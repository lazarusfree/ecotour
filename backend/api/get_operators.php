<?php
require_once '../config/database.php';
try {
    $stmt = $db->query("SELECT * FROM operator ORDER BY eco_score DESC");
    $database->sendSuccess($stmt->fetchAll(), "Operators retrieved");
} catch(Exception $e) {
    $database->sendError("Failed to fetch operators");
}
