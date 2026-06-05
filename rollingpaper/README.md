# 마음을 전하는 롤링페이퍼 (Rolling Paper App)

방문자가 실시간으로 따뜻한 축하와 격려의 메시지를 남길 수 있는 감성 가득한 롤링페이퍼 웹 애플리케이션입니다. 

## 🛠 기술 스택 (Technology Stack)

### Backend & Database
- **PHP 8.x** (경량 REST API 구현 및 XSS 방지 필터링)
- **MariaDB / MySQL** (InnoDB 엔진, UTF-8mb4 인코딩 지원)
- **AWS Lightsail LAMP Stack** (호스팅 및 배포 환경)

### Frontend
- **HTML5 & Vanilla CSS3** (자체 반응형 디자인 시스템, 다크 모드, 네온 글로우 효과)
- **Vanilla Javascript (ES6+)** (DOM 제어, 디바운스 검색, 비동기 AJAX 연동, 슬라이더 제어)
- **Font & Icon Resources**: 
  - Google Fonts (Inter, Gowun Batang, Gaegu, Nanum Pen Script 등)
  - Lucide Icons (벡터 아이콘 모듈)

---

## 📁 디렉토리 구조 (Directory Structure)

```text
rollingpaper/
├── api/
│   ├── create_message.php     # 메시지 등록 API (입력값 유효성 검증 및 XSS 방지)
│   └── get_messages.php       # 메시지 조회 API (검색 필터링 및 페이징)
├── assets/
│   └── splash.png             # 스플래시 화면용 3D Voxel 도트 아트 이미지
├── config/
│   └── db.php                 # 데이터베이스 PDO 커넥션 설정 정의
├── css/
│   └── style.css              # 앱 메인 스타일시트 (글래스모피즘, 모달 제어 등)
├── js/
│   └── app.js                 # 코어 프론트엔드 비즈니스 로직 (상태 관리, 캐러셀)
├── sql/
│   ├── schema.sql             # DB 생성 및 messages 테이블 스키마 정의
│   └── sample_data.sql        # 30개의 정중하고 따뜻한 톤의 초기 데이터셋
├── index.php                  # 메인 애플리케이션 엔트리 포인트 (HTML5 빌드)
└── README.md                  # 프로젝트 매뉴얼 (본 문서)
```

---

## 🚀 설치 및 설정 (Installation & Configuration)

### 1. 데이터베이스 구축
원격 MariaDB/MySQL 서버에 접속한 후, `sql/schema.sql`을 실행하여 데이터베이스와 테이블을 생성합니다.
```bash
# schema.sql 로드
mysql -u [username] -p < sql/schema.sql
```

### 2. DB 환경 설정 정의
`config/db.php` 파일에 데이터베이스 연결 정보를 기입합니다.
```php
define('DB_HOST', '127.0.0.1');
define('DB_NAME', 'rolling_paper');
define('DB_USER', 'your_username');
define('DB_PASS', 'your_password');
```

### 3. 샘플 데이터(30개) 삽입
테스트 및 정식 서비스 초기 구동을 위해 30개의 다정하고 친절한 샘플 데이터를 DB에 밀어 넣습니다.
```bash
# sample_data.sql 로드
mysql -u [username] -p < sql/sample_data.sql
```

---

## 💡 주요 기능 및 구현 설계 (Key Features)

1. **딤 처리 스플래시 팝업**
   - 첫 방문 시 3D Voxel 아트웍과 제작자 정보(`made by heeziko`) 및 입장하기 버튼이 팝업으로 나타납니다.
   - 최초 1회 승인 시 브라우저 `sessionStorage`에 상태를 기록해 재방문 시에는 노출되지 않도록 제어했습니다.
   - **하트 로고 아이콘 연동**: 헤더 좌측의 하트 로고 아이콘을 누르면 스플래시 팝업이 다시 활성화됩니다.
2. **모아보기 (Grid View)**
   - 카드보드(Corkboard) 레이아웃으로, 작성된 메시지들이 각 테마별 파스텔 톤과 폰트 스타일로 무작위 각도로 회전되어 예쁘게 흩뿌려집니다.
3. **펼쳐보기 (Slide View / Carousel)**
   - 하나의 카드를 큼직하게 탐색할 수 있는 슬라이드 형태로, 방향키 및 화면 버튼을 통해 1장씩 넘겨볼 수 있습니다.
4. **실시간 미리보기 팝업**
   - 메시지 작성 시, 우측 영역에 입력한 내용, 선택한 폰트, 이모지가 즉각적으로 렌더링되어 미리보기할 수 있습니다.

---

## 🛠 주요 이슈 및 해결 이력 (Troubleshooting)

### 1. 정적 파일 브라우저 캐싱 문제
- **현상**: CSS나 JS를 수정하여 배포했음에도, 브라우저가 정적 자원을 강력히 캐싱하여 레이아웃 수정이 즉각 노출되지 않는 문제 발생.
- **해결**: `index.php`에서 CSS와 JS를 로드할 때 `css/style.css?v=1.5`, `js/app.js?v=1.5`와 같이 쿼리스트링 버전을 지정해 캐시를 무력화(Version Busting)하였습니다.

### 2. 타임존 9시간 시차 오류
- **현상**: 메시지 등록 시각이 DB(UTC 기준)에 기록되는데, 프론트엔드가 이를 단순 시각 문자열(`14:00:00`)로 받아 로컬 타임존(KST, GMT+9)인 `14:00:00 KST`로 인식하면서, 등록 직후 "9시간 전"으로 표시되는 시차 문제 발생.
- **해결**: `api/get_messages.php`에서 응답을 반환하기 전에 타임스탬프를 UTC 기준인 **ISO 8601 표준 규격(예: `2026-06-05T14:00:00Z`)**으로 변환하도록 API를 패치했습니다. 브라우저의 JavaScript `new Date()`가 `Z` 접미사(UTC)를 식별하여 사용자의 로컬 타임존(`23:00:00 KST`)으로 자동 오프셋 보정 처리를 수행합니다.

### 3. 클라이언트 날짜 파싱 오류 (`NaN-NaN-NaN`)
- **현상**: API 날짜에 ISO 8601 규격을 도입하자, 기존 사파리 호환용 정규표현식 치환부(`.replace(/-/g, '/')`)로 인해 `2026/06/05T14:00:00Z`로 문자열이 오염되어 브라우저가 시간을 읽지 못하고 `NaN`이 노출되는 문제 발생.
- **해결**: `js/app.js` 내의 `formatRelativeDate` 함수를 수정하여, 날짜 문자열에 `T`가 포함된 표준 ISO 문자열일 경우 변환을 건너뛰고 바로 `new Date()` 파서로 넘겨지도록 분기 예외 처리를 완료했습니다.

### 4. 1920x1080 해상도 모달 하단 등록 버튼 잘림 문제
- **현상**: 세로 높이가 한정된 모니터/브라우저 창에서 작성 팝업이 전체 크기로 늘어나 화면 위아래 뷰포트를 벗어나 클릭이 불가능한 현상 발생.
- **해결**: 모달 컨테이너에 `max-height: 90vh`를 걸고, 바디 그리드 영역에 `flex: 1; min-height: 0;` 및 `max-height: calc(90vh - 75px)`를 주어 높이가 줄어들더라도 팝업 내부 폼에 스크롤바가 생겨 하단의 "등록하기", "취소" 액션 버튼이 항상 100% 보이도록 레이아웃을 고도화했습니다.
