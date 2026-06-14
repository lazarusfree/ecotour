<?php
require_once '../config/database.php';
try {
    $stats = [
        'tours' => $db->query("SELECT COUNT(*) FROM tour")->fetchColumn(),
        'operators' => $db->query("SELECT COUNT(*) FROM operator")->fetchColumn(),
        'bookings' => $db->query("SELECT COUNT(*) FROM booking")->fetchColumn(),
        'funds' => $db->query("SELECT COUNT(*) FROM conservation_fund")->fetchColumn(),
    ];
    $database->sendSuccess($stats, "Connected to ecotour database");
} catch(Exception $e) {
    $database->sendError("Connection failed: " . $e->getMessage());
}
