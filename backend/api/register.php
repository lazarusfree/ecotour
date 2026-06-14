<?php
require_once '../config/database.php';

$data = json_decode(file_get_contents('php://input'), true);
if (!$data || !isset($data['email']) || !isset($data['password']) || !isset($data['full_name'])) {
    $database->sendError("Missing required fields");
}

$fullName = trim($data['full_name']);
if ($fullName === '' || mb_strlen($fullName) > 100) {
    $database->sendError("Full name is required (max 100 characters)");
}
if (!is_valid_email($data['email'])) {
    $database->sendError("Invalid email address");
}
if ($err = password_error($data['password'])) {
    $database->sendError($err);
}

// Only public roles may be self-registered — admin accounts are created
// directly in the database, never through this endpoint.
$role = isset($data['role']) ? $data['role'] : 'traveler';
if (!in_array($role, ['traveler', 'operator'], true)) {
    $database->sendError("Invalid role");
}

$hash = password_hash($data['password'], PASSWORD_BCRYPT);
try {
    $stmt = $db->prepare("INSERT INTO user (full_name, email, password_hash, role) VALUES (:name, :email, :hash, :role)");
    $stmt->execute([':name' => $fullName, ':email' => $data['email'], ':hash' => $hash, ':role' => $role]);
} catch (PDOException $e) {
    // 23000 = unique-constraint violation on email. Relying on the constraint
    // (rather than SELECT-then-INSERT) avoids a duplicate-signup race.
    if ($e->getCode() === '23000') {
        $database->sendError("Email already registered");
    }
    error_log("Registration failed: " . $e->getMessage());
    $database->sendError("Registration failed", 500);
}

$database->sendSuccess(['user_id' => $db->lastInsertId()], "Registration successful");
