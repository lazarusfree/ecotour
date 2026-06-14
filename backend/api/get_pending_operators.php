<?php
require_once '../config/database.php';

// The verification queue exposes unvetted business details — admin only.
require_admin($database);

try {
    $stmt = $db->query("SELECT * FROM operator WHERE verification_status IN ('pending', 'flagged') ORDER BY submitted_at DESC");
    $database->sendSuccess($stmt->fetchAll(), "Pending operators retrieved");
} catch(Exception $e) {
    error_log("get_pending_operators failed: " . $e->getMessage());
    $database->sendError("Failed to fetch pending operators", 500);
}
