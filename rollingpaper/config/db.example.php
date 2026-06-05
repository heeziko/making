<?php
// config/db.example.php
// 이 파일을 db.php로 복사한 뒤 실제 데이터베이스 연결 정보를 기입하여 사용하십시오.

define('DB_HOST', '127.0.0.1');
define('DB_NAME', 'rolling_paper');
define('DB_USER', 'your_database_user');
define('DB_PASS', 'your_database_password');
define('DB_CHARSET', 'utf8mb4');

/**
 * 데이터베이스 연결 객체(PDO)를 반환하는 함수
 */
function getDBConnection() {
    static $pdo = null;
    
    if ($pdo === null) {
        $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ];
        
        try {
            $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
        } catch (\PDOException $e) {
            // 운영 환경에서는 에러 메시지를 보안상 직접 노출하지 않아야 함
            header('Content-Type: application/json; charset=utf-8');
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Database connection failed.'
            ]);
            exit;
        }
    }
    
    return $pdo;
}
