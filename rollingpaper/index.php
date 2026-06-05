<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>마음을 전하는 롤링페이퍼</title>
    <meta name="description" content="웹사이트 방문자들이 실시간으로 따뜻한 메시지를 남기고 모아볼 수 있는 감성 가득한 온라인 롤링페이퍼 서비스입니다.">
    
    <!-- Google Fonts 로드 -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Gaegu:wght@400;700&family=Gowun+Batang:wght@400;700&family=Nanum+Pen+Script&family=Outfit:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    
    <!-- Lucide Icons (아름답고 깔끔한 아이콘 팩) -->
    <script src="https://unpkg.com/lucide@latest"></script>
    
    <!-- CSS 스타일시트 -->
    <link rel="stylesheet" href="css/style.css?v=1.4">
</head>
<body>
    <!-- 스플래시 화면 팝업 -->
    <div id="splash-screen" class="splash-overlay">
        <div class="splash-card">
            <img src="assets/splash.png" alt="3D Dot Art woman in pajamas writing a letter" id="splash-img">
            <div class="splash-credits">made by heeziko</div>
            <button id="btn-enter" class="btn-enter-app">
                <span>입장하기</span>
            </button>
        </div>
    </div>



    <!-- 앱 전체 컨테이너 -->
    <div class="app-container">
        
        <!-- 헤더 영역 -->
        <header class="app-header">
            <div class="header-logo">
                <i data-lucide="heart-handshake" class="logo-icon" id="logo-heart"></i>
                <h1 id="app-title">Rolling Paper</h1>
            </div>
            
            <div class="header-controls">
                <!-- 다크 모드 토글 -->
                <button id="theme-toggle" class="btn-icon" aria-label="테마 전환">
                    <i data-lucide="sun" class="icon-sun"></i>
                    <i data-lucide="moon" class="icon-moon"></i>
                </button>
                
                <!-- 뷰 모드 토글 -->
                <div class="view-switch-container">
                    <button id="view-grid-btn" class="btn-switch active" aria-label="모아보기 모드">
                        <i data-lucide="layout-grid"></i>
                        <span>모아보기</span>
                    </button>
                    <button id="view-slide-btn" class="btn-switch" aria-label="펼쳐보기 모드">
                        <i data-lucide="book-open"></i>
                        <span>펼쳐보기</span>
                    </button>
                </div>
            </div>
        </header>

        <!-- 필터 및 검색 바 -->
        <section class="search-filter-section">
            <div class="search-bar-container">
                <i data-lucide="search" class="search-icon"></i>
                <input type="text" id="search-input" placeholder="보낸 사람 또는 메시지 내용 검색..." autocomplete="off">
                <button id="search-clear-btn" class="btn-clear-search" style="display: none;">
                    <i data-lucide="x"></i>
                </button>
            </div>
            
            <div class="stats-counter" id="stats-counter">
                총 <span id="total-messages-count">0</span>개의 이야기
            </div>
        </section>

        <!-- 메인 콘텐츠 영역 -->
        <main class="main-content">
            
            <!-- 로딩 스피너 -->
            <div id="loading-spinner" class="loading-container" style="display: none;">
                <div class="spinner"></div>
                <p>메시지를 가져오는 중...</p>
            </div>
            
            <!-- 빈 상태 안내 -->
            <div id="empty-state" class="empty-state-container" style="display: none;">
                <i data-lucide="message-square-dashed" class="empty-icon"></i>
                <h3>첫 번째 메시지를 남겨보세요!</h3>
                <p>방문자님의 따뜻한 한마디가 모두에게 미소를 전합니다.</p>
                <button id="empty-create-btn" class="btn-primary">
                    <i data-lucide="pen-tool"></i>
                    <span>메시지 작성하기</span>
                </button>
            </div>

            <!-- 1. 모아보기 (Grid View) -->
            <div id="grid-view" class="grid-view-container">
                <!-- JS에서 메시지 카드를 동적으로 렌더링 -->
            </div>

            <!-- 2. 펼쳐보기 (Slide View / Carousel) -->
            <div id="slide-view" class="slide-view-container" style="display: none;">
                <button id="prev-slide-btn" class="btn-nav slide-prev" aria-label="이전 메시지">
                    <i data-lucide="chevron-left"></i>
                </button>
                
                <div class="slide-viewport">
                    <div id="slide-track" class="slide-track">
                        <!-- JS에서 슬라이드 카드를 동적으로 렌더링 -->
                    </div>
                </div>
                
                <button id="next-slide-btn" class="btn-nav slide-next" aria-label="다음 메시지">
                    <i data-lucide="chevron-right"></i>
                </button>
                
                <!-- 슬라이드 페이지 표시기 -->
                <div class="slide-indicator" id="slide-indicator">
                    <span id="current-slide-index">0</span> / <span id="total-slide-count">0</span>
                </div>
            </div>
            
        </main>
        
        <!-- 푸터 -->
        <footer class="app-footer">
            <p>&copy; 2026 Rolling Paper App. Powered by PHP & Vanilla JS.</p>
        </footer>
    </div>

    <!-- 메시지 작성하기 플로팅 버튼 (FAB) -->
    <button id="fab-create-btn" class="fab-button" aria-label="메시지 작성하기">
        <i data-lucide="plus"></i>
    </button>

    <!-- 메시지 작성 모달 -->
    <div id="create-modal" class="modal-overlay" style="display: none;">
        <div class="modal-container" id="create-modal-container">
            <div class="modal-header">
                <h2>새로운 메시지 남기기</h2>
                <button id="close-create-modal" class="btn-close" aria-label="모달 닫기">
                    <i data-lucide="x"></i>
                </button>
            </div>
            
            <div class="modal-body-split">
                <!-- 폼 작성부 -->
                <form id="message-form" class="modal-form" onsubmit="return false;">
                    <div class="form-group">
                        <label for="input-sender">보내는 사람 <span class="required">*</span></label>
                        <input type="text" id="input-sender" name="sender" maxlength="30" placeholder="이름 또는 닉네임을 적어주세요." required autocomplete="off">
                    </div>
                    
                    <div class="form-group">
                        <label for="input-content">전하고 싶은 말 <span class="required">*</span></label>
                        <textarea id="input-content" name="content" maxlength="800" placeholder="따뜻한 마음을 담아 메시지를 입력해 주세요." required></textarea>
                        <div class="textarea-counter"><span id="char-count">0</span>/800</div>
                    </div>
                    
                    <!-- 테마 및 스타일링 옵션 -->
                    <div class="form-group">
                        <label>카드 색상 선택</label>
                        <div class="color-picker-grid">
                            <label class="color-option pastel-pink active">
                                <input type="radio" name="bg_type" value="pastel-pink" checked>
                                <span class="color-dot"></span>
                            </label>
                            <label class="color-option pastel-blue">
                                <input type="radio" name="bg_type" value="pastel-blue">
                                <span class="color-dot"></span>
                            </label>
                            <label class="color-option warm-yellow">
                                <input type="radio" name="bg_type" value="warm-yellow">
                                <span class="color-dot"></span>
                            </label>
                            <label class="color-option pastel-green">
                                <input type="radio" name="bg_type" value="pastel-green">
                                <span class="color-dot"></span>
                            </label>
                            <label class="color-option elegant-purple">
                                <input type="radio" name="bg_type" value="elegant-purple">
                                <span class="color-dot"></span>
                            </label>
                        </div>
                    </div>

                    <div class="form-group">
                        <label>글꼴 스타일</label>
                        <div class="font-picker-grid">
                            <label class="font-option-card font-sans active">
                                <input type="radio" name="font_type" value="font-sans" checked>
                                <span>고딕체</span>
                            </label>
                            <label class="font-option-card font-handwriting">
                                <input type="radio" name="font_type" value="font-handwriting">
                                <span style="font-family: 'Nanum Pen Script', sans-serif; font-size: 1.25rem;">나눔손글씨</span>
                            </label>
                            <label class="font-option-card font-cute">
                                <input type="radio" name="font_type" value="font-cute">
                                <span style="font-family: 'Gaegu', sans-serif;">개구체</span>
                            </label>
                            <label class="font-option-card font-serif">
                                <input type="radio" name="font_type" value="font-serif">
                                <span style="font-family: 'Gowun Batang', serif;">바탕체</span>
                            </label>
                        </div>
                    </div>

                    <div class="form-group">
                        <label>스티커/이모지 추가</label>
                        <div class="emoji-picker-grid">
                            <label class="emoji-option active">
                                <input type="radio" name="emoji" value="" checked>
                                <span class="emoji-box">없음</span>
                            </label>
                            <label class="emoji-option">
                                <input type="radio" name="emoji" value="❤️">
                                <span class="emoji-box">❤️</span>
                            </label>
                            <label class="emoji-option">
                                <input type="radio" name="emoji" value="🎉">
                                <span class="emoji-box">🎉</span>
                            </label>
                            <label class="emoji-option">
                                <input type="radio" name="emoji" value="🎂">
                                <span class="emoji-box">🎂</span>
                            </label>
                            <label class="emoji-option">
                                <input type="radio" name="emoji" value="🌟">
                                <span class="emoji-box">🌟</span>
                            </label>
                            <label class="emoji-option">
                                <input type="radio" name="emoji" value="😊">
                                <span class="emoji-box">😊</span>
                            </label>
                            <label class="emoji-option">
                                <input type="radio" name="emoji" value="👍">
                                <span class="emoji-box">👍</span>
                            </label>
                            <label class="emoji-option">
                                <input type="radio" name="emoji" value="🍀">
                                <span class="emoji-box">🍀</span>
                            </label>
                        </div>
                    </div>

                    <div class="form-actions">
                        <button type="button" id="btn-cancel-create" class="btn-secondary">취소</button>
                        <button type="submit" id="btn-submit-message" class="btn-primary">
                            <i data-lucide="send"></i>
                            <span>등록하기</span>
                        </button>
                    </div>
                </form>

                <!-- 실시간 미리보기부 -->
                <div class="preview-area">
                    <label class="preview-label">실시간 카드 미리보기</label>
                    <div id="card-preview" class="preview-card-outer">
                        <div class="paper-card pastel-pink font-sans preview-card-inner">
                            <div class="card-emoji-container" id="preview-emoji"></div>
                            <div class="card-content-preview" id="preview-text">메시지를 입력하면 이곳에 실시간으로 반영됩니다...</div>
                            <div class="card-footer-preview">
                                <span class="card-from">From. <span id="preview-sender">누군가</span></span>
                                <span class="card-date">오늘</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- 카드 상세보기 모달 -->
    <div id="detail-modal" class="modal-overlay" style="display: none;">
        <div class="modal-container detail-modal-container">
            <button id="close-detail-modal" class="btn-close" aria-label="모달 닫기">
                <i data-lucide="x"></i>
            </button>
            <div class="detail-modal-body">
                <!-- 선택된 메시지 카드 내용이 펼쳐지듯 들어감 -->
                <div id="detail-card-target"></div>
            </div>
            <div class="detail-modal-navigation">
                <button id="detail-prev-btn" class="btn-secondary">
                    <i data-lucide="arrow-left"></i> 이전 메시지
                </button>
                <button id="detail-next-btn" class="btn-secondary">
                    다음 메시지 <i data-lucide="arrow-right"></i>
                </button>
            </div>
        </div>
    </div>

    <!-- JS 스크립트 -->
    <script src="js/app.js?v=1.5"></script>
</body>
</html>
