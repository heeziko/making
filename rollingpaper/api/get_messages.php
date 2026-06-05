<?php
// api/get_messages.php

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');

require_once __DIR__ . '/../config/db.php';

$search = isset($_GET['search']) ? trim($_GET['search']) : '';
$limit = isset($_GET['limit']) ? intval($_GET['limit']) : 100;
$offset = isset($_GET['offset']) ? intval($_GET['offset']) : 0;

if ($limit <= 0 || $limit > 200) {
    $limit = 100;
}
if ($offset < 0) {
    $offset = 0;
}

try {
    $pdo = getDBConnection();
    
    // 기본 쿼리 구성
    $sql = "SELECT id, sender, content, bg_type, font_type, emoji, created_at FROM messages";
    $params = [];
    
    // 검색어가 입력된 경우 WHERE 조건 추가
    if (!empty($search)) {
        $sql .= " WHERE sender LIKE :search_sender OR content LIKE :search_content";
        $params[':search_sender'] = '%' . $search . '%';
        $params[':search_content'] = '%' . $search . '%';
    }
    
    // 최신 글 순서로 정렬 및 페이징 적용
    $sql .= " ORDER BY created_at DESC LIMIT :limit OFFSET :offset";
    
    $stmt = $pdo->prepare($sql);
    
    // PDO prepared statement에서 LIMIT, OFFSET은 integer 바인딩 필요
    if (!empty($search)) {
        $stmt->bindValue(':search_sender', $params[':search_sender'], PDO::PARAM_STR);
        $stmt->bindValue(':search_content', $params[':search_content'], PDO::PARAM_STR);
    }
    $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
    $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
    
    $stmt->execute();
    $messages = $stmt->fetchAll();
    
    // DB의 UTC 기준 시각을 ISO 8601 UTC 규격(Z 접미사)으로 포맷팅하여 브라우저의 KST 자동 변환 지원
    foreach ($messages as &$msg) {
        if (isset($msg['created_at'])) {
            try {
                $date = new DateTime($msg['created_at'], new DateTimeZone('UTC'));
                $msg['created_at'] = $date->format('Y-m-d\TH:i:s\Z');
            } catch (Exception $e) {
                // 파싱 에러 시 원본 보존
            }
        }
    }
    unset($msg);
    
    // 전체 메시지 개수 조회 (페이징 처리를 위해 전체 카운트 제공)
    $countSql = "SELECT COUNT(*) FROM messages";
    if (!empty($search)) {
        $countSql .= " WHERE sender LIKE :search_sender OR content LIKE :search_content";
        $countStmt = $pdo->prepare($countSql);
        $countStmt->bindValue(':search_sender', $params[':search_sender'], PDO::PARAM_STR);
        $countStmt->bindValue(':search_content', $params[':search_content'], PDO::PARAM_STR);
    } else {
        $countStmt = $pdo->prepare($countSql);
    }
    $countStmt->execute();
    $totalCount = intval($countStmt->fetchColumn());
    
    echo json_encode([
        'success' => true,
        'data' => $messages,
        'pagination' => [
            'total' => $totalCount,
            'limit' => $limit,
            'offset' => $offset
        ]
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => '서버 오류로 인해 메시지를 조회하지 못했습니다: ' . $e->getMessage()
    ]);
}
