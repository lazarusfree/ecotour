<?php
require_once '../config/database.php';
try {
    $funds = $db->query("SELECT * FROM conservation_fund WHERE is_active = 1")->fetchAll();
    $total = $db->query("SELECT COALESCE(SUM(amount), 0) FROM fund_ledger")->fetchColumn();
    $database->sendSuccess(['funds' => $funds, 'total_collected' => $total], "Fund stats retrieved");
} catch(Exception $e) {
    $database->sendError("Failed to fetch fund stats");
}
