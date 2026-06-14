<?php
require_once '../config/database.php';
try {
    $stats = [
        'operator_count' => (int)$db->query("SELECT COUNT(*) FROM operator WHERE verification_status = 'verified'")->fetchColumn(),
        'total_funded' => $db->query("SELECT COALESCE(SUM(amount), 0) FROM fund_ledger")->fetchColumn(),
        'states_covered' => (int)$db->query("SELECT COUNT(DISTINCT state) FROM tour WHERE is_active = 1")->fetchColumn(),
        'avg_eco_score' => $db->query("SELECT COALESCE(ROUND(AVG(eco_score), 1), 0) FROM tour WHERE is_active = 1")->fetchColumn(),
        'tour_count' => (int)$db->query("SELECT COUNT(*) FROM tour WHERE is_active = 1")->fetchColumn(),
    ];
    $database->sendSuccess($stats, "Stats retrieved");
} catch(Exception $e) {
    error_log("get_stats failed: " . $e->getMessage());
    $database->sendError("Failed to fetch stats", 500);
}
