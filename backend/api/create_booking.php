<?php
require_once '../config/database.php';

// The booking is always created for the logged-in user — the user_id the
// client may send in the body is ignored, so nobody can book (and charge)
// on another account.
$sessionUser = require_login($database);
$userId = (int)$sessionUser['user_id'];

$data = json_decode(file_get_contents('php://input'), true);
if (!$data || !isset($data['tour_id']) || !isset($data['date']) || !isset($data['participants'])) {
    $database->sendError("Missing required booking fields");
}

if ($err = booking_date_error($data['date'])) {
    $database->sendError($err);
}

try {
    $stmt = $db->prepare("SELECT price, group_size FROM tour WHERE tour_id = :tid AND is_active = 1");
    $stmt->execute([':tid' => (int)$data['tour_id']]);
    $tour = $stmt->fetch();
    if (!$tour) {
        $database->sendError("Tour not found", 404);
    }

    if ($err = participants_error($data['participants'], $tour['group_size'])) {
        $database->sendError($err);
    }
    $participants = (int)$data['participants'];
    $subtotal = round($tour['price'] * $participants, 2);

    $stmt = $db->prepare("SELECT tf.fund_id, tf.allocation_pct FROM tour_fund tf WHERE tf.tour_id = :tid");
    $stmt->execute([':tid' => (int)$data['tour_id']]);
    $funds = $stmt->fetchAll();

    $split = calculate_levy($subtotal, $funds);
    $levy = $split['levy'];
    $total = round($subtotal + $levy, 2);

    $db->beginTransaction();

    // Retry on the (unlikely) chance the random reference already exists.
    $bookingId = null;
    $insert = $db->prepare("INSERT INTO booking (user_id, tour_id, booking_ref, booking_date, participants, total_amount, conservation_levy) VALUES (?, ?, ?, ?, ?, ?, ?)");
    for ($attempt = 0; $attempt < 5; $attempt++) {
        $ref = generate_booking_ref();
        try {
            $insert->execute([$userId, (int)$data['tour_id'], $ref, $data['date'], $participants, $total, $levy]);
            $bookingId = $db->lastInsertId();
            break;
        } catch (PDOException $e) {
            if ($e->getCode() !== '23000') throw $e;
        }
    }
    if (!$bookingId) {
        throw new RuntimeException("Could not generate a unique booking reference");
    }

    // Record the per-fund split and keep each fund's running total in sync,
    // all inside the same transaction.
    $ledger = $db->prepare("INSERT INTO fund_ledger (booking_id, fund_id, amount) VALUES (?, ?, ?)");
    $updateFund = $db->prepare("UPDATE conservation_fund SET collected_amount = collected_amount + ? WHERE fund_id = ?");
    foreach ($split['splits'] as $fundId => $amount) {
        $ledger->execute([$bookingId, $fundId, $amount]);
        $updateFund->execute([$amount, $fundId]);
    }

    $db->commit();
    $database->sendSuccess(
        ['booking_id' => $bookingId, 'booking_ref' => $ref, 'total' => $total, 'levy' => $levy],
        "Booking created"
    );
} catch (Exception $e) {
    if ($db->inTransaction()) $db->rollBack();
    error_log("Booking failed: " . $e->getMessage());
    $database->sendError("Booking failed. Please try again.", 500);
}
