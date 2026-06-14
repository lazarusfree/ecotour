<?php
require_once '../config/database.php';

// Changing an operator's verification status is an admin-only action.
require_admin($database);

$data = json_decode(file_get_contents('php://input'), true);
if (!$data || !isset($data['id']) || !isset($data['action'])) {
    $database->sendError("Missing operator ID or action");
}

$validActions = ['approve' => 'verified', 'reject' => 'rejected', 'flag' => 'flagged'];
if (!isset($validActions[$data['action']])) $database->sendError("Invalid action");

$stmt = $db->prepare("UPDATE operator SET verification_status = :status WHERE operator_id = :id");
$stmt->execute([':status' => $validActions[$data['action']], ':id' => (int)$data['id']]);
if ($stmt->rowCount() === 0) {
    $database->sendError("Operator not found or status unchanged", 404);
}
$database->sendSuccess([], "Operator " . $validActions[$data['action']]);
