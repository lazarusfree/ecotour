<?php
require_once '../config/database.php';
try {
    $stmt = $db->query("SELECT fl.*, cf.name as fund_name, b.booking_ref
        FROM fund_ledger fl 
        JOIN conservation_fund cf ON fl.fund_id = cf.fund_id
        JOIN booking b ON fl.booking_id = b.booking_id
        ORDER BY fl.created_at DESC LIMIT 20");
    $database->sendSuccess($stmt->fetchAll(), "Ledger retrieved");
} catch(Exception $e) {
    $database->sendError("Failed to fetch ledger");
}
