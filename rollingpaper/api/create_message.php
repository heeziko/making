<?php
// api/create_message.php

header('Content-Type: application/json; charset=utf-8');
// CORS 활성화 (필요한 경우 로컬 개발 지원)
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => '허용되지 않은 요청 메서드입니다.']);
    exit;
}

require_once __DIR__ . '/../config/db.php';

// JSON 및 Form-data 입력값 모두 처리 지원
$inputData = json_decode(file_get_contents('php://input'), true);
if (!$inputData) {
    $inputData = $_POST;
}

$sender = isset($inputData['sender']) ? trim($inputData['sender']) : '';
$content = isset($inputData['content']) ? trim($inputData['content']) : '';
$bg_type = isset($inputData['bg_type']) ? trim($inputData['bg_type']) : 'pastel-pink';
$font_type = isset($inputData['font_type']) ? trim($inputData['font_type']) : 'font-sans';
$emoji = isset($inputData['emoji']) ? trim($inputData['emoji']) : '';

// 기본 유효성 검사
if (empty($sender) || empty($content)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => '보내는 사람과 메시지 내용을 입력해주세요.']);
    exit;
}

if (mb_strlen($sender) > 50) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => '보내는 사람 이름은 50자 이내여야 합니다.']);
    exit;
}

if (mb_strlen($content) > 1000) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => '메시지 내용은 1000자 이내여야 합니다.']);
    exit;
}

// XSS 방지를 위한 기초 필터링 (HTML 태그 제거)
$sender = strip_tags($sender);
$content = strip_tags($content);
$bg_type = strip_tags($bg_type);
$font_type = strip_tags($font_type);
$emoji = strip_tags($emoji);

try {
    $pdo = getDBConnection();
    $sql = "INSERT INTO messages (sender, content, bg_type, font_type, emoji) VALUES (:sender, :content, :bg_type, :font_type, :emoji)";
    $stmt = $pdo->prepare($sql);
    
    $result = $stmt->execute([
        ':sender' => $sender,
        ':content' => $content,
        ':bg_type' => $bg_type,
        ':font_type' => $font_type,
        ':emoji' => empty($emoji) ? null : $emoji
    ]);
    
    if ($result) {
        http_response_code(201);
        echo json_encode([
            'success' => true,
            'message' => '메시지가 성공적으로 등록되었습니다.',
            'data' => [
                'id' => $pdo->lastInsertId(),
                'sender' => $sender,
                'content' => $content,
                'bg_type' => $bg_type,
                'font_type' => $font_type,
                'emoji' => $emoji,
                'created_at' => date('Y-m-d H:i:s')
            ]
        ]);
    } else {
        throw new Exception('DB Insert failed');
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => '서버 오류로 인해 메시지를 등록하지 못했습니다: ' . $e->getMessage()
    ]);
}
