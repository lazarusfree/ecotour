<?php
/**
 * Integration tests against the live API (requires Apache + MySQL running
 * and the seed data loaded).
 *
 * Run:  C:\xampp\php\php.exe backend/tests/integration_test.php [--write]
 *
 * Read-only by default. Pass --write to also exercise the full booking
 * happy path (inserts a real booking for the demo traveler account).
 */
$BASE = getenv('ECOTOUR_API_BASE') ?: 'http://localhost/ecotour/backend/api/';
$COOKIE_JAR = tempnam(sys_get_temp_dir(), 'ecotour_cookies');
$write = in_array('--write', $argv ?? [], true);

$passed = 0;
$failed = 0;

function api($endpoint, $method = 'GET', $data = null) {
    global $BASE, $COOKIE_JAR;
    $ch = curl_init($BASE . $endpoint);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_CUSTOMREQUEST => $method,
        CURLOPT_COOKIEJAR => $COOKIE_JAR,
        CURLOPT_COOKIEFILE => $COOKIE_JAR,
        CURLOPT_TIMEOUT => 10,
    ]);
    if ($data !== null) {
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
        curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    }
    $body = curl_exec($ch);
    $status = curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
    curl_close($ch);
    return ['status' => $status, 'json' => json_decode($body, true)];
}

function check($label, $condition) {
    global $passed, $failed;
    if ($condition) { $passed++; echo "  ok    $label\n"; }
    else { $failed++; echo "  FAIL  $label\n"; }
}

echo "connectivity\n";
$r = api('test_connection.php');
check("test_connection returns success", $r['status'] === 200 && ($r['json']['success'] ?? false));

echo "public reads\n";
$r = api('get_tours.php');
check("get_tours returns a list", ($r['json']['success'] ?? false) && is_array($r['json']['data']));
$tour = $r['json']['data'][0] ?? null;
check("tours include operator info", $tour && isset($tour['business_name']));

$r = api('get_tour.php?id=1');
check("get_tour returns funds breakdown", ($r['json']['success'] ?? false) && isset($r['json']['data']['funds']));

$r = api('get_tour.php?id=999999');
check("get_tour 404 for unknown id", $r['status'] === 404);

$r = api('get_stats.php');
check("get_stats returns operator_count", isset($r['json']['data']['operator_count']));

echo "authorization (no session)\n";
$r = api('get_bookings.php?user_id=1');
check("get_bookings requires login", $r['status'] === 401);
$r = api('create_booking.php', 'POST', ['tour_id' => 1, 'date' => '2027-01-15', 'participants' => 2]);
check("create_booking requires login", $r['status'] === 401);
$r = api('get_pending_operators.php');
check("pending operators requires admin", $r['status'] === 401);
$r = api('verify_operator.php', 'POST', ['id' => 3, 'action' => 'approve']);
check("verify_operator requires admin", $r['status'] === 401);

echo "registration validation\n";
$r = api('register.php', 'POST', ['full_name' => 'X', 'email' => 'bad-email', 'password' => 'password123']);
check("rejects invalid email", $r['status'] === 400);
$r = api('register.php', 'POST', ['full_name' => 'X', 'email' => 'x@example.com', 'password' => 'short']);
check("rejects short password", $r['status'] === 400);
$r = api('register.php', 'POST', ['full_name' => 'Evil', 'email' => 'evil@example.com', 'password' => 'password123', 'role' => 'admin']);
check("rejects self-registration as admin", $r['status'] === 400);
$r = api('register.php', 'POST', ['full_name' => 'X', 'email' => 'rezza@ecotour.my', 'password' => 'password123']);
check("rejects duplicate email", $r['status'] === 400 && stripos($r['json']['error'] ?? '', 'already') !== false);

echo "login\n";
$r = api('login.php', 'POST', ['email' => 'rezza@ecotour.my', 'password' => 'wrong-password']);
check("wrong password rejected with 401", $r['status'] === 401);
$r = api('login.php', 'POST', ['email' => 'rezza@ecotour.my', 'password' => 'password123']);
check("valid login succeeds", ($r['json']['success'] ?? false));
check("password hash never returned", !isset($r['json']['data']['password_hash']));

echo "session-scoped access\n";
$r = api('session.php');
check("session.php returns current user", ($r['json']['data']['email'] ?? '') === 'rezza@ecotour.my');
$r = api('get_bookings.php?user_id=2');
$allOwn = ($r['json']['success'] ?? false);
foreach (($r['json']['data'] ?? []) as $b) {
    if ((int)$b['user_id'] !== 1) $allOwn = false;
}
check("traveler cannot read another user's bookings", $allOwn);
$r = api('get_pending_operators.php');
check("traveler blocked from admin queue (403)", $r['status'] === 403);

echo "booking validation (logged in)\n";
$r = api('create_booking.php', 'POST', ['tour_id' => 1, 'date' => '2020-01-01', 'participants' => 2]);
check("rejects past booking date", $r['status'] === 400);
$r = api('create_booking.php', 'POST', ['tour_id' => 1, 'date' => '2027-01-15', 'participants' => 0]);
check("rejects zero participants", $r['status'] === 400);
$r = api('create_booking.php', 'POST', ['tour_id' => 1, 'date' => '2027-01-15', 'participants' => 99]);
check("rejects over group size", $r['status'] === 400);
$r = api('create_booking.php', 'POST', ['tour_id' => 999999, 'date' => '2027-01-15', 'participants' => 2]);
check("404 for unknown tour", $r['status'] === 404);

if ($write) {
    echo "booking happy path (--write)\n";
    // Orangutan Canopy Trek (tour 1): RM280 x 2 + 30% levy = 728.00
    $r = api('create_booking.php', 'POST', ['tour_id' => 1, 'date' => '2027-01-15', 'participants' => 2]);
    check("booking created", ($r['json']['success'] ?? false));
    check("server-computed total = 728.00", abs(($r['json']['data']['total'] ?? 0) - 728.00) < 0.01);
    check("server-computed levy = 168.00", abs(($r['json']['data']['levy'] ?? 0) - 168.00) < 0.01);
    check("booking ref format", preg_match('/^ECO-[0-9A-F]{6}$/', $r['json']['data']['booking_ref'] ?? '') === 1);
}

echo "logout\n";
$r = api('logout.php', 'POST');
check("logout succeeds", ($r['json']['success'] ?? false));
$r = api('session.php');
check("session gone after logout", $r['status'] === 401);

@unlink($COOKIE_JAR);
echo "\n$passed passed, $failed failed\n";
exit($failed === 0 ? 0 : 1);
