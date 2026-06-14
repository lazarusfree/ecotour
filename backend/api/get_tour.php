<?php
require_once '../config/database.php';
$id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
try {
    $stmt = $db->prepare("SELECT t.*, o.business_name, o.eco_score as operator_score
        FROM tour t JOIN operator o ON t.operator_id = o.operator_id WHERE t.tour_id = :id");
    $stmt->execute([':id' => $id]);
    $tour = $stmt->fetch();
    if (!$tour) $database->sendError("Tour not found", 404);
    
    $stmt = $db->prepare("SELECT tf.*, cf.name as fund_name, cf.category 
        FROM tour_fund tf JOIN conservation_fund cf ON tf.fund_id = cf.fund_id WHERE tf.tour_id = :id");
    $stmt->execute([':id' => $id]);
    $tour['funds'] = $stmt->fetchAll();
    
    $database->sendSuccess($tour, "Tour retrieved");
} catch(Exception $e) {
    $database->sendError("Failed to fetch tour");
}
