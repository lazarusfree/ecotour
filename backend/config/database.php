<?php
/**
 * Bootstrap shared by every API endpoint: response headers, CORS preflight
 * handling, the Database helper, and the auth/validation helpers.
 * Credentials live in config.php (overridable via environment variables).
 */
$config = require __DIR__ . '/config.php';
require_once __DIR__ . '/auth.php';
require_once __DIR__ . '/validation.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: ' . $config['cors_origin']);
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('ngrok-skip-browser-warning: true');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

class Database {
    private $config;

    public function __construct(array $config) {
        $this->config = $config;
    }

    public function getConnection() {
        try {
            $conn = new PDO(
                "mysql:host={$this->config['db_host']};dbname={$this->config['db_name']};charset=utf8mb4",
                $this->config['db_user'], $this->config['db_pass']
            );
            $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
            $conn->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
            $conn->exec("SET time_zone = '+08:00'");
            return $conn;
        } catch(PDOException $e) {
            // Log the real reason server-side; never leak credentials/details to the client.
            error_log("DB connection failed: " . $e->getMessage());
            $this->sendError("Database connection failed", 500);
        }
    }

    public function sendSuccess($data, $message = "Success") {
        echo json_encode(['success' => true, 'message' => $message, 'data' => $data]);
        exit();
    }

    public function sendError($error, $code = 400) {
        http_response_code($code);
        echo json_encode(['success' => false, 'error' => $error]);
        exit();
    }
}

$database = new Database($config);
$db = $database->getConnection();
