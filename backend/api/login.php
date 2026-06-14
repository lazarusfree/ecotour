<?php
require_once '../config/database.php';

$data = json_decode(file_get_contents('php://input'), true);
if (!$data || !isset($data['email']) || !isset($data['password'])) {
    $database->sendError("Missing email or password");
}

$stmt = $db->prepare("SELECT * FROM user WHERE email = :email AND is_deleted = 0");
$stmt->execute([':email' => $data['email']]);
$user = $stmt->fetch();

if (!$user || !password_verify($data['password'], $user['password_hash'])) {
    // Same message for "no such user" and "wrong password" so the endpoint
    // can't be used to enumerate registered emails.
    $database->sendError("Invalid email or password", 401);
}

unset($user['password_hash']);

// Establish the server-side session; regenerate the ID to prevent fixation.
ecotour_session_start();
session_regenerate_id(true);
$_SESSION['user'] = [
    'user_id' => (int)$user['user_id'],
    'full_name' => $user['full_name'],
    'email' => $user['email'],
    'role' => $user['role'],
];

$database->sendSuccess($user, "Login successful");
