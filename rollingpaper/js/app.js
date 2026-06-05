/**
 * js/app.js
 * 롤링페이퍼 웹 앱의 코어 프론트엔드 비즈니스 로직
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. 애플리케이션 상태 관리 (State)
    const state = {
        messages: [],            // 서버에서 불러온 메시지 전체 리스트
        filteredMessages: [],    // 검색 조건에 맞게 필터링된 메시지 리스트
        currentView: 'grid',     // 'grid' (모아보기) 또는 'slide' (펼쳐보기)
        currentSlideIndex: 0,    // 펼쳐보기 모드의 현재 슬라이드 인덱스
        currentDetailIndex: 0,   // 상세보기 모달의 현재 메시지 인덱스
        theme: 'light',          // 'light' 또는 'dark'
        searchQuery: '',         // 검색 바 입력어
        isSubmitting: false      // 메시지 등록 중 중복 클릭 방지 플래그
    };

    // 2. DOM 엘리먼트 캐싱
    const themeToggle = document.getElementById('theme-toggle');
    const viewGridBtn = document.getElementById('view-grid-btn');
    const viewSlideBtn = document.getElementById('view-slide-btn');
    const searchInput = document.getElementById('search-input');
    const searchClearBtn = document.getElementById('search-clear-btn');
    const statsCounter = document.getElementById('stats-counter');
    const totalMessagesCount = document.getElementById('total-messages-count');
    
    const loadingSpinner = document.getElementById('loading-spinner');
    const emptyState = document.getElementById('empty-state');
    const gridView = document.getElementById('grid-view');
    const slideView = document.getElementById('slide-view');
    
    // 슬라이더 관련
    const slideTrack = document.getElementById('slide-track');
    const prevSlideBtn = document.getElementById('prev-slide-btn');
    const nextSlideBtn = document.getElementById('next-slide-btn');
    const currentSlideIndexText = document.getElementById('current-slide-index');
    const totalSlideCountText = document.getElementById('total-slide-count');
    
    // 작성 모달 관련
    const fabCreateBtn = document.getElementById('fab-create-btn');
    const emptyCreateBtn = document.getElementById('empty-create-btn');
    const createModal = document.getElementById('create-modal');
    const closeCreateModal = document.getElementById('close-create-modal');
    const btnCancelCreate = document.getElementById('btn-cancel-create');
    const messageForm = document.getElementById('message-form');
    const btnSubmitMessage = document.getElementById('btn-submit-message');
    
    // 작성 모달 실시간 프리뷰 엘리먼트
    const inputSender = document.getElementById('input-sender');
    const inputContent = document.getElementById('input-content');
    const charCount = document.getElementById('char-count');
    const cardPreview = document.getElementById('card-preview');
    const previewText = document.getElementById('preview-text');
    const previewSender = document.getElementById('preview-sender');
    const previewEmoji = document.getElementById('preview-emoji');
    
    // 상세보기 모달 관련
    const detailModal = document.getElementById('detail-modal');
    const closeDetailModal = document.getElementById('close-detail-modal');
    const detailCardTarget = document.getElementById('detail-card-target');
    const detailPrevBtn = document.getElementById('detail-prev-btn');
    const detailNextBtn = document.getElementById('detail-next-btn');

    // 3. 앱 초기화 (Initialization)
    function init() {
        // 아이콘 초기화 (Lucide)
        lucide.createIcons();
        
        // 스플래시 화면 초기화
        initSplashScreen();
        
        // 테마 설정 불러오기
        initTheme();
        
        // 데이터 불러오기
        fetchMessages();
        
        // 이벤트 바인딩
        bindEvents();
        
        // 실시간 미리보기 초기 동기화
        updateLivePreview();
    }

    // 4. 테마 관리 (Theme management)
    function initTheme() {
        const savedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (savedTheme) {
            state.theme = savedTheme;
        } else if (systemPrefersDark) {
            state.theme = 'dark';
        }
        
        document.documentElement.setAttribute('data-theme', state.theme);
    }

    function toggleTheme() {
        state.theme = state.theme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', state.theme);
        localStorage.setItem('theme', state.theme);
    }

    // 스플래시 화면 노출 여부 관리
    function initSplashScreen() {
        const splashScreen = document.getElementById('splash-screen');
        if (!splashScreen) return;
        
        const isEntered = sessionStorage.getItem('splash_entered');
        if (isEntered === 'true') {
            splashScreen.style.display = 'none';
            document.body.style.overflow = '';
        } else {
            splashScreen.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    }

    // 5. 서버 데이터 연동 (API Calls)
    async function fetchMessages(search = '') {
        showLoading(true);
        try {
            const url = `http://13.125.143.67/api/get_messages.php?search=${encodeURIComponent(search)}`;
            const response = await fetch(url);
            const result = await response.json();
            
            if (result.success) {
                state.messages = result.data || [];
                state.filteredMessages = state.messages;
                
                // 검색어 비었을 때만 전체 개수 업데이트
                if (!search) {
                    totalMessagesCount.textContent = result.pagination.total;
                }
                
                renderViews();
            } else {
                console.error(result.message);
                showToast('메시지를 불러오는 데 실패했습니다.', 'error');
            }
        } catch (error) {
            console.error('API Error:', error);
            showToast('서버와의 통신이 원활하지 않습니다.', 'error');
        } finally {
            showLoading(false);
        }
    }

    async function submitMessage(formData) {
        if (state.isSubmitting) return;
        state.isSubmitting = true;
        
        // 버튼 로딩 상태 표시
        const submitBtnText = btnSubmitMessage.querySelector('span');
        const originalText = submitBtnText.textContent;
        submitBtnText.textContent = '등록 중...';
        btnSubmitMessage.disabled = true;
        
        try {
            const response = await fetch('http://13.125.143.67/api/create_message.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            
            const result = await response.json();
            
            if (response.ok && result.success) {
                showToast('따뜻한 마음이 성공적으로 전달되었습니다! 🎉');
                closeModal(createModal);
                messageForm.reset();
                updateLivePreview();
                
                // 새로 등록된 메시지를 리스트 맨 앞에 수동 추가하여 로컬 상태 업데이트
                // 혹은 서버에서 전체 다시 조회
                await fetchMessages();
                
                // 모아보기 뷰로 자동 이동
                switchView('grid');
            } else {
                showToast(result.message || '등록 중 오류가 발생했습니다.', 'error');
            }
        } catch (error) {
            console.error('Submit Error:', error);
            showToast('서버와의 통신 오류가 발생했습니다.', 'error');
        } finally {
            state.isSubmitting = false;
            submitBtnText.textContent = originalText;
            btnSubmitMessage.disabled = false;
        }
    }

    // 6. UI 렌더링 함수들
    function showLoading(isLoading) {
        if (isLoading) {
            loadingSpinner.style.display = 'flex';
            gridView.style.display = 'none';
            slideView.style.display = 'none';
            emptyState.style.display = 'none';
        } else {
            loadingSpinner.style.display = 'none';
        }
    }

    function renderViews() {
        const hasMessages = state.filteredMessages.length > 0;
        
        if (!hasMessages) {
            emptyState.style.display = 'flex';
            gridView.style.display = 'none';
            slideView.style.display = 'none';
            statsCounter.style.visibility = 'hidden';
            return;
        }
        
        statsCounter.style.visibility = 'visible';
        emptyState.style.display = 'none';
        
        if (state.currentView === 'grid') {
            renderGridView();
        } else {
            renderSlideView();
        }
    }

    // 모아보기 (Grid) 렌더링
    function renderGridView() {
        gridView.style.display = 'grid';
        slideView.style.display = 'none';
        gridView.innerHTML = '';
        
        state.filteredMessages.forEach((msg, index) => {
            const card = document.createElement('div');
            
            // 프리미엄 Corkboard 느낌을 위해 약간의 무작위 회전 각도(Rotation) 부여 (-2.5도 ~ +2.5도)
            const randomRotation = (Math.random() * 5 - 2.5).toFixed(2);
            card.style.transform = `rotate(${randomRotation}deg)`;
            
            card.className = `paper-card ${msg.bg_type} ${msg.font_type}`;
            card.innerHTML = `
                ${msg.emoji ? `<span class="card-emoji">${msg.emoji}</span>` : ''}
                <div class="card-body">${escapeHTML(msg.content)}</div>
                <div class="card-footer">
                    <span class="card-from">From. ${escapeHTML(msg.sender)}</span>
                    <span class="card-date">${formatRelativeDate(msg.created_at)}</span>
                </div>
            `;
            
            // 카드 클릭 시 상세보기
            card.addEventListener('click', () => {
                openDetailModal(index);
            });
            
            gridView.appendChild(card);
        });
    }

    // 펼쳐보기 (Slide) 렌더링
    function renderSlideView() {
        gridView.style.display = 'none';
        slideView.style.display = 'flex';
        slideTrack.innerHTML = '';
        
        state.filteredMessages.forEach((msg) => {
            const slideItem = document.createElement('div');
            slideItem.className = 'slide-item';
            
            slideItem.innerHTML = `
                <div class="paper-card ${msg.bg_type} ${msg.font_type}">
                    ${msg.emoji ? `<span class="card-emoji">${msg.emoji}</span>` : ''}
                    <div class="card-body">${escapeHTML(msg.content)}</div>
                    <div class="card-footer">
                        <span class="card-from">From. ${escapeHTML(msg.sender)}</span>
                        <span class="card-date">${formatRelativeDate(msg.created_at)}</span>
                    </div>
                </div>
            `;
            
            slideTrack.appendChild(slideItem);
        });
        
        // 슬라이드 개수 한계 동기화
        state.currentSlideIndex = Math.min(state.currentSlideIndex, state.filteredMessages.length - 1);
        if (state.currentSlideIndex < 0) state.currentSlideIndex = 0;
        
        updateSliderPosition();
    }

    // 7. 슬라이더 인터랙션 제어
    function updateSliderPosition() {
        const slideWidth = slideTrack.clientWidth || 480; // 디바이스 가로 사이즈 감안
        const offset = -state.currentSlideIndex * (slideWidth + 32); // 32px은 gap 크기
        slideTrack.style.transform = `translateX(${offset}px)`;
        
        // 내비게이션 버튼 활성화/비활성화
        prevSlideBtn.disabled = state.currentSlideIndex === 0;
        nextSlideBtn.disabled = state.currentSlideIndex === state.filteredMessages.length - 1;
        
        // 페이지 표시기 업데이트
        currentSlideIndexText.textContent = state.currentSlideIndex + 1;
        totalSlideCountText.textContent = state.filteredMessages.length;
    }

    function moveSlide(direction) {
        if (direction === 'next' && state.currentSlideIndex < state.filteredMessages.length - 1) {
            state.currentSlideIndex++;
        } else if (direction === 'prev' && state.currentSlideIndex > 0) {
            state.currentSlideIndex--;
        }
        updateSliderPosition();
    }

    // 8. 작성 모달 및 라이브 프리뷰 연동
    function updateLivePreview() {
        // 글자수 표시 및 실시간 렌더링
        const senderVal = inputSender.value.trim() || '누군가';
        const contentVal = inputContent.value || '메시지를 입력하면 이곳에 실시간으로 반영됩니다...';
        
        charCount.textContent = inputContent.value.length;
        previewSender.textContent = senderVal;
        previewText.textContent = contentVal;
        
        // 활성화된 테마 및 색상 클래스 연동
        const activeBg = messageForm.querySelector('input[name="bg_type"]:checked').value;
        const activeFont = messageForm.querySelector('input[name="font_type"]:checked').value;
        const activeEmoji = messageForm.querySelector('input[name="emoji"]:checked').value;
        
        // 프리뷰 카드 클래스 초기화 및 부여
        cardPreview.querySelector('.paper-card').className = `paper-card ${activeBg} ${activeFont} preview-card-inner`;
        
        // 이모지 렌더링
        if (activeEmoji) {
            previewEmoji.innerHTML = `<span class="card-emoji" style="top: -10px; right: 0; font-size: 2rem;">${activeEmoji}</span>`;
        } else {
            previewEmoji.innerHTML = '';
        }
    }

    // 9. 상세보기 모달 및 앞/뒤 브라우징
    function openDetailModal(index) {
        state.currentDetailIndex = index;
        updateDetailModalContent();
        openModal(detailModal);
    }

    function updateDetailModalContent() {
        const msg = state.filteredMessages[state.currentDetailIndex];
        if (!msg) return;
        
        detailCardTarget.innerHTML = `
            <div class="paper-card ${msg.bg_type} ${msg.font_type}">
                ${msg.emoji ? `<span class="card-emoji">${msg.emoji}</span>` : ''}
                <div class="card-body">${escapeHTML(msg.content)}</div>
                <div class="card-footer">
                    <span class="card-from">From. ${escapeHTML(msg.sender)}</span>
                    <span class="card-date">${formatRelativeDate(msg.created_at)}</span>
                </div>
            </div>
        `;
        
        // 상세 모달 내비게이션 버튼 제어
        detailPrevBtn.disabled = state.currentDetailIndex === 0;
        detailNextBtn.disabled = state.filteredMessages.length - 1 === state.currentDetailIndex;
        
        // Lucide 새 아이콘 반영
        lucide.createIcons();
    }

    function navigateDetail(direction) {
        if (direction === 'next' && state.currentDetailIndex < state.filteredMessages.length - 1) {
            state.currentDetailIndex++;
        } else if (direction === 'prev' && state.currentDetailIndex > 0) {
            state.currentDetailIndex--;
        }
        updateDetailModalContent();
    }

    // 10. 모달 공통 기능 (Open/Close)
    function openModal(modalEl) {
        modalEl.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // 배경 스크롤 방지
    }

    function closeModal(modalEl) {
        modalEl.style.display = 'none';
        document.body.style.overflow = '';
    }

    // 11. 뷰 모드 전환
    function switchView(viewType) {
        if (state.currentView === viewType) return;
        
        state.currentView = viewType;
        
        if (viewType === 'grid') {
            viewGridBtn.classList.add('active');
            viewSlideBtn.classList.remove('active');
        } else {
            viewGridBtn.classList.remove('active');
            viewSlideBtn.classList.add('active');
            state.currentSlideIndex = 0; // 뷰 전환 시 초기 첫 번째 카드로 세팅
        }
        
        renderViews();
    }

    // 12. 검색 기능 구현 (디바운싱 지원)
    let searchDebounceTimer = null;
    function handleSearchInput(e) {
        const query = e.target.value;
        state.searchQuery = query;
        
        // 검색 삭제 버튼 표기 제어
        searchClearBtn.style.display = query ? 'block' : 'none';
        
        // 300ms 디바운스 적용하여 API 호출 최소화
        clearTimeout(searchDebounceTimer);
        searchDebounceTimer = setTimeout(() => {
            fetchMessages(query);
        }, 300);
    }

    function clearSearch() {
        searchInput.value = '';
        state.searchQuery = '';
        searchClearBtn.style.display = 'none';
        fetchMessages('');
        searchInput.focus();
    }

    // 13. 이벤트 리스너 바인딩
    function bindEvents() {
        // 스플래시 화면 입장하기 버튼 제어
        const btnEnter = document.getElementById('btn-enter');
        const splashScreen = document.getElementById('splash-screen');
        if (btnEnter && splashScreen) {
            btnEnter.addEventListener('click', () => {
                splashScreen.classList.add('fade-out');
                sessionStorage.setItem('splash_entered', 'true');
                document.body.style.overflow = '';
                setTimeout(() => {
                    splashScreen.style.display = 'none';
                }, 600);
            });
        }

        // 로고 하트 아이콘 클릭 시 스플래시 화면 다시 띄우기
        const logoHeart = document.getElementById('logo-heart');
        if (logoHeart && splashScreen) {
            logoHeart.addEventListener('click', () => {
                splashScreen.classList.remove('fade-out');
                splashScreen.style.display = 'flex';
                document.body.style.overflow = 'hidden';
            });
        }

        // 테마 전환 버튼
        themeToggle.addEventListener('click', toggleTheme);
        
        // 뷰 스위처
        viewGridBtn.addEventListener('click', () => switchView('grid'));
        viewSlideBtn.addEventListener('click', () => switchView('slide'));
        
        // 검색 바
        searchInput.addEventListener('input', handleSearchInput);
        searchClearBtn.addEventListener('click', clearSearch);
        
        // 슬라이더 내비게이션
        prevSlideBtn.addEventListener('click', () => moveSlide('prev'));
        nextSlideBtn.addEventListener('click', () => moveSlide('next'));
        
        // 작성 모달 오픈 (FAB 및 빈 화면 버튼)
        fabCreateBtn.addEventListener('click', () => {
            openModal(createModal);
            inputSender.focus();
        });
        emptyCreateBtn.addEventListener('click', () => {
            openModal(createModal);
            inputSender.focus();
        });
        
        // 작성 모달 닫기
        closeCreateModal.addEventListener('click', () => closeModal(createModal));
        btnCancelCreate.addEventListener('click', () => closeModal(createModal));
        createModal.addEventListener('click', (e) => {
            if (e.target === createModal) closeModal(createModal);
        });
        
        // 작성 폼 실시간 동기화
        inputSender.addEventListener('input', updateLivePreview);
        inputContent.addEventListener('input', updateLivePreview);
        
        // 작성 폼 색상/폰트/이모지 변경 시
        messageForm.querySelectorAll('input[name="bg_type"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                // 부모 레이블 active 상태 수동 제어
                messageForm.querySelectorAll('.color-option').forEach(el => el.classList.remove('active'));
                e.target.closest('.color-option').classList.add('active');
                updateLivePreview();
            });
        });
        
        messageForm.querySelectorAll('input[name="font_type"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                messageForm.querySelectorAll('.font-option-card').forEach(el => el.classList.remove('active'));
                e.target.closest('.font-option-card').classList.add('active');
                updateLivePreview();
            });
        });
        
        messageForm.querySelectorAll('input[name="emoji"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                messageForm.querySelectorAll('.emoji-option').forEach(el => el.classList.remove('active'));
                e.target.closest('.emoji-option').classList.add('active');
                updateLivePreview();
            });
        });
        
        // 작성 폼 등록 요청
        messageForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formData = {
                sender: inputSender.value.trim(),
                content: inputContent.value.trim(),
                bg_type: messageForm.querySelector('input[name="bg_type"]:checked').value,
                font_type: messageForm.querySelector('input[name="font_type"]:checked').value,
                emoji: messageForm.querySelector('input[name="emoji"]:checked').value
            };
            
            submitMessage(formData);
        });
        
        // 상세보기 모달 제어
        closeDetailModal.addEventListener('click', () => closeModal(detailModal));
        detailModal.addEventListener('click', (e) => {
            if (e.target === detailModal) closeModal(detailModal);
        });
        detailPrevBtn.addEventListener('click', () => navigateDetail('prev'));
        detailNextBtn.addEventListener('click', () => navigateDetail('next'));
        
        // 키보드 방향키 단축키 지원 (사용자 경험 개선)
        document.addEventListener('keydown', (e) => {
            // 모달이 닫혀 있을 때 슬라이더 제어
            if (state.currentView === 'slide' && createModal.style.display === 'none' && detailModal.style.display === 'none') {
                if (e.key === 'ArrowLeft') moveSlide('prev');
                if (e.key === 'ArrowRight') moveSlide('next');
            }
            
            // 상세보기 모달 브라우징 제어
            if (detailModal.style.display === 'flex') {
                if (e.key === 'ArrowLeft') navigateDetail('prev');
                if (e.key === 'ArrowRight') navigateDetail('next');
                if (e.key === 'Escape') closeModal(detailModal);
            }
            
            // 작성 모달 ESC 닫기
            if (createModal.style.display === 'flex') {
                if (e.key === 'Escape') closeModal(createModal);
            }
        });
        
        // 슬라이더 영역 창 크기 변경 대응 리사이즈 감지
        window.addEventListener('resize', () => {
            if (state.currentView === 'slide') {
                updateSliderPosition();
            }
        });
    }

    // 14. 헬퍼 함수들 (Helper functions)
    
    // HTML 엔티티 이스케이프 (XSS 방지)
    function escapeHTML(str) {
        if (!str) return '';
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    // 가독성 높은 상대시간 계산 (예: 5분 전, 3시간 전, 어제, 2026-06-05)
    function formatRelativeDate(dateString) {
        if (!dateString) return '';
        // ISO 8601 형식(T 포함)은 그대로 파싱하고, 비표준 DB DATETIME은 Safari 호환을 위해 /로 교체 후 파싱
        const parsedString = dateString.includes('T') ? dateString : dateString.replace(/-/g, '/');
        const date = new Date(parsedString);
        const now = new Date();
        const diffMs = now - date;
        const diffSec = Math.floor(diffMs / 1000);
        const diffMin = Math.floor(diffSec / 60);
        const diffHr = Math.floor(diffMin / 60);
        const diffDays = Math.floor(diffHr / 24);
        
        if (diffSec < 60) {
            return '방금 전';
        } else if (diffMin < 60) {
            return `${diffMin}분 전`;
        } else if (diffHr < 24) {
            return `${diffHr}시간 전`;
        } else if (diffDays === 1) {
            return '어제';
        } else if (diffDays < 7) {
            return `${diffDays}일 전`;
        } else {
            const y = date.getFullYear();
            const m = String(date.getMonth() + 1).padStart(2, '0');
            const d = String(date.getDate()).padStart(2, '0');
            return `${y}-${m}-${d}`;
        }
    }

    // 토스트 알림 메시지 함수
    function showToast(message, type = 'success') {
        // 기존 토스트 제거
        const existingToast = document.querySelector('.app-toast');
        if (existingToast) {
            existingToast.remove();
        }
        
        const toast = document.createElement('div');
        toast.className = `app-toast ${type}`;
        toast.innerHTML = `
            <i data-lucide="${type === 'success' ? 'check-circle' : 'alert-circle'}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(toast);
        
        // 토스트 전용 CSS 동적 삽입 (별도 클래스 분리보다 결합도 높은 동작 지원)
        if (!document.getElementById('toast-style')) {
            const style = document.createElement('style');
            style.id = 'toast-style';
            style.textContent = `
                .app-toast {
                    position: fixed;
                    bottom: 30px;
                    left: 50%;
                    transform: translate(-50%, 50px);
                    background: rgba(20, 16, 38, 0.9);
                    backdrop-filter: blur(8px);
                    color: #fff;
                    padding: 12px 24px;
                    border-radius: 30px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    z-index: 1000;
                    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
                    font-size: 0.95rem;
                    font-weight: 500;
                    opacity: 0;
                    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    border: 1px solid rgba(255, 255, 255, 0.15);
                }
                .app-toast.error {
                    background: rgba(120, 15, 15, 0.95);
                }
                .app-toast.show {
                    transform: translate(-50%, 0);
                    opacity: 1;
                }
            `;
            document.head.appendChild(style);
        }
        
        lucide.createIcons();
        
        // 애니메이션 효과 적용을 위해 미세 시간 지연 후 show 클래스 추가
        setTimeout(() => toast.classList.add('show'), 50);
        
        // 3.5초 뒤 자동 제거
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 400);
        }, 3500);
    }

    // 즉시 실행
    init();
});
