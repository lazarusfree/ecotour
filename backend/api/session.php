<?php
// Returns the currently logged-in user (fresh from the database), or 401.
// The frontend calls this on load to validate a restored localStorage session.
require_once '../config/database.php';

$sessionUser = require_login($database);

$stmt = $db->prepare("SELECT user_id, full_name, email, role, eco_score, created_at
    FROM user WHERE user_id = :uid AND is_deleted = 0");
$stmt->execute([':uid' => $sessionUser['user_id']]);
$user = $stmt->fetch();

if (!$user) {
    $database->sendError("Account no longer exists", 401);
}
$database->sendSuccess($user, "Session active");
