-- 데이터베이스 생성
CREATE DATABASE IF NOT EXISTS rolling_paper DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE rolling_paper;

-- 메시지 저장용 테이블
CREATE TABLE IF NOT EXISTS messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sender VARCHAR(50) NOT NULL,
    content TEXT NOT NULL,
    bg_type VARCHAR(30) NOT NULL DEFAULT 'default',  -- pastel-pink, pastel-blue, warm-yellow, pastel-green, elegant-purple 등
    font_type VARCHAR(30) NOT NULL DEFAULT 'default', -- font-serif, font-handwriting, font-monospace, font-sans
    emoji VARCHAR(10) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_created_at (created_at DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
