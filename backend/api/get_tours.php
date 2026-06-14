<?php
require_once '../config/database.php';
try {
    $query = "SELECT t.*, o.business_name, o.eco_score as operator_score, o.verification_status
              FROM tour t
              JOIN operator o ON t.operator_id = o.operator_id
              WHERE t.is_active = 1
              ORDER BY t.eco_score DESC";
    $stmt = $db->query($query);
    $database->sendSuccess($stmt->fetchAll(), "Tours retrieved");
} catch(Exception $e) {
    $database->sendError("Failed to fetch tours");
}
