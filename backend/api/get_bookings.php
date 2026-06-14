<?php
require_once '../config/database.php';

// Users may only read their own booking history; admins may pass ?user_id=
// to inspect any account.
$sessionUser = require_login($database);
$userId = (int)$sessionUser['user_id'];
if ($sessionUser['role'] === 'admin' && isset($_GET['user_id'])) {
    $userId = (int)$_GET['user_id'];
}

try {
    $stmt = $db->prepare("SELECT b.*, t.title as tour_name, t.location, t.state, o.business_name
        FROM booking b JOIN tour t ON b.tour_id = t.tour_id
        JOIN operator o ON t.operator_id = o.operator_id
        WHERE b.user_id = :uid ORDER BY b.created_at DESC");
    $stmt->execute([':uid' => $userId]);
    $database->sendSuccess($stmt->fetchAll(), "Bookings retrieved");
} catch(Exception $e) {
    error_log("get_bookings failed: " . $e->getMessage());
    $database->sendError("Failed to fetch bookings", 500);
}
