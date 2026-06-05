-- 롤링페이퍼 샘플 데이터 30개 삽입 스크립트

USE rolling_paper;

-- 기존 데이터가 있다면 초기화 (필요시 활성화)
TRUNCATE TABLE messages;

INSERT INTO messages (sender, content, bg_type, font_type, emoji, created_at) VALUES 
('김민우', '언제나 밝은 미소로 인사해 주셔서 하루를 항상 기분 좋게 시작할 수 있어요. 따뜻한 친절에 늘 감사드립니다! 😊', 'pastel-blue', 'font-sans', '😊', DATE_SUB(NOW(), INTERVAL 1 HOUR)),
('이서연', '힘든 일이 있을 때마다 묵묵히 제 이야기를 경청해 주시고 격려해 주셔서 큰 위로가 되었어요. 진심으로 감사드려요.', 'pastel-pink', 'font-handwriting', '❤️', DATE_SUB(NOW(), INTERVAL 2 HOUR)),
('박지수', '어려운 업무나 도움이 필요할 때 먼저 손 내밀어 적극적으로 도와주셔서 항상 큰 힘이 됩니다. 건강하고 행복한 일들만 가득하시길 바라요! 🍀', 'pastel-green', 'font-cute', '🍀', DATE_SUB(NOW(), INTERVAL 3 HOUR)),
('정준호', '함께하는 동안 긍정적인 에너지를 아낌없이 나누어 주셔서 주변 사람들까지 미소 짓게 하시는 힘이 있는 것 같아요. 항상 응원합니다!', 'warm-yellow', 'font-serif', '👍', DATE_SUB(NOW(), INTERVAL 4 HOUR)),
('최하은', '도움이 필요한 매 순간마다 다정한 설명과 함께 세심하게 신경 써주셔서 얼마나 든든한지 모릅니다. 늘 감사하게 생각하고 있어요.', 'elegant-purple', 'font-sans', '🌟', DATE_SUB(NOW(), INTERVAL 5 HOUR)),
('윤도윤', '올해 계획하고 바라시는 모든 소망과 목표들이 하나도 빠짐없이 전부 원하시는 대로 잘 풀리시기를 마음 다해 진심으로 응원하고 기도할게요!', 'pastel-blue', 'font-handwriting', '🎉', DATE_SUB(NOW(), INTERVAL 6 HOUR)),
('한유진', '선배님 덕분에 낯선 환경에서도 빠르게 적응하고 많은 배움을 얻어 갈 수 있었어요. 늘 아낌없이 베풀어주시는 마음에 보답하고 싶습니다.', 'pastel-pink', 'font-cute', '😊', DATE_SUB(NOW(), INTERVAL 8 HOUR)),
('강현우', '매사에 솔선수범하시고 따뜻한 리더십으로 이끌어 주시는 멋진 모습 본받고 싶습니다. 건강 유의하시고 오늘 하루도 행복한 시간 보내세요.', 'warm-yellow', 'font-serif', '👍', DATE_SUB(NOW(), INTERVAL 10 HOUR)),
('송예린', '사소한 배려 하나하나가 쌓여서 저에게는 큰 감동으로 와닿았답니다. 늘 사려 깊고 따뜻하게 챙겨주셔서 고맙습니다. 생일 축하드려요! 🎂', 'pastel-green', 'font-sans', '🎂', DATE_SUB(NOW(), INTERVAL 12 HOUR)),
('임민재', '어려운 도전 앞에서도 물러서지 않고 긍정적으로 헤쳐 나가시는 추진력을 보며 많이 배웁니다. 앞으로 가시는 길에 꽃길만 가득하길 응원해요.', 'elegant-purple', 'font-handwriting', '🍀', DATE_SUB(NOW(), INTERVAL 14 HOUR)),
('오소율', '항상 주변 분위기를 밝고 화기애애하게 이끌어 주셔서 덕분에 출근길이 즐겁습니다. 오래오래 함께 일했으면 좋겠습니다.', 'pastel-pink', 'font-cute', '😊', DATE_SUB(NOW(), INTERVAL 16 HOUR)),
('신건우', '언제나 든든한 버팀목이 되어주시는 모습에 진심으로 존경을 표합니다. 보내주신 깊은 신뢰와 은혜에 부족함 없이 보답하는 사람이 되겠습니다.', 'pastel-blue', 'font-serif', '🌟', DATE_SUB(NOW(), INTERVAL 18 HOUR)),
('서채원', '따뜻한 차 한 잔 나누며 건네주신 위로의 한마디가 가슴 깊이 남았습니다. 힘들 때 의지할 수 있는 소중한 동료가 되어주셔서 감사합니다.', 'warm-yellow', 'font-handwriting', '❤️', DATE_SUB(NOW(), INTERVAL 20 HOUR)),
('조우진', '목표를 향해 한 걸음씩 묵묵히 걸어 나가시는 성실함과 우직함을 열렬히 응원합니다. 조만간 좋은 결실이 눈앞에 맺어질 거예요. 화이팅!', 'pastel-green', 'font-sans', '👍', DATE_SUB(NOW(), INTERVAL 22 HOUR)),
('권서윤', '소소한 농담과 이야기들 덕분에 매일이 웃음으로 가득 채워지는 것 같아요. 항상 내 일처럼 기뻐해 주고 슬퍼해 줘서 고마워.', 'elegant-purple', 'font-cute', '😊', DATE_SUB(NOW(), INTERVAL 1 DAY)),
('황정우', '인생의 소중한 길목에서 믿음직스러운 조언과 멘토링을 베풀어주셔서 진심으로 고맙습니다. 가르쳐주신 지혜 잊지 않고 잘 간직할게요.', 'pastel-blue', 'font-serif', '🌟', DATE_SUB(NOW(), INTERVAL 1 DAY)),
('양수아', '항상 열정적인 태도로 임하시는 모습을 지켜보면서 저도 긍정적인 자극을 많이 받습니다. 우리 같이 성장해서 더 좋은 미래를 만들어 가요!', 'pastel-pink', 'font-handwriting', '🍀', DATE_SUB(NOW(), INTERVAL 2 DAY)),
('배선우', '기쁠 때 같이 기뻐 날뛰어 주고 힘들 땐 곁을 지키며 다독여주는 최고의 파트너! 항상 말은 못 했지만 속 깊은 배려에 깊이 고마워하고 있어.', 'warm-yellow', 'font-sans', '❤️', DATE_SUB(NOW(), INTERVAL 2 DAY)),
('백지아', '소박하고 따뜻한 일상들이 쌓여 평생 기억에 남을 소중한 추억들이 되었네요. 늘 다정하고 선량한 마음씨로 감동하게 해줘서 고맙습니다.', 'pastel-green', 'font-cute', '😊', DATE_SUB(NOW(), INTERVAL 3 DAY)),
('유주원', '귀한 시간 내서 묵묵히 귀를 기울여 주신 마음에 정말 감사드려요. 말씀해 주신 대로 힘내서 끝까지 도전해 보려고 합니다. 화이팅!', 'elegant-purple', 'font-serif', '👍', DATE_SUB(NOW(), INTERVAL 3 DAY)),
('남윤아', '늘 먼저 상냥하게 인사 건네주시고 사소한 일도 친절하게 알려주셔서 몸 둘 바 모르게 감사할 뿐입니다. 항상 기분 좋은 하루 보내세요!', 'pastel-blue', 'font-handwriting', '😊', DATE_SUB(NOW(), INTERVAL 4 DAY)),
('전시우', '어려운 고비마다 침착함을 잃지 않고 지혜롭게 중재해 주셔서 큰 어려움 없이 잘 해결될 수 있었습니다. 항상 깊은 신뢰를 보냅니다.', 'pastel-pink', 'font-sans', '🌟', DATE_SUB(NOW(), INTERVAL 4 DAY)),
('안다은', '마음 편하게 고민을 털어놓을 수 있는 상대를 만난다는 것은 큰 축복인 것 같아요. 저에게 그런 특별한 존재가 되어주셔서 늘 감사합니다.', 'warm-yellow', 'font-cute', '❤️', DATE_SUB(NOW(), INTERVAL 5 DAY)),
('홍민성', '끝이 없을 것 같던 프로젝트도 성실히 헌신해 주신 덕분에 무사히 종착지에 닿았네요. 정말 대단하시고 고생 많으셨습니다. 푹 쉬세요!', 'pastel-green', 'font-serif', '🎉', DATE_SUB(NOW(), INTERVAL 5 DAY)),
('한유나', '기대 이상의 결과물을 내기 위해 밤낮으로 고민하고 노력하시는 열정적인 에너지를 진심으로 응원합니다. 노력한 만큼 눈부신 보상이 따를 겁니다.', 'elegant-purple', 'font-handwriting', '🍀', DATE_SUB(NOW(), INTERVAL 6 DAY)),
('문태민', '바쁜 일상 속에서도 항상 활력을 잃지 않고 긍정적으로 생활하시는 기운을 나누어 받고 싶네요. 행복이 마르지 않는 나날이 되시길 빌어요.', 'pastel-blue', 'font-sans', '😊', DATE_SUB(NOW(), INTERVAL 6 DAY)),
('양지호', '남들이 꺼리는 힘든 일을 가장 먼저 나서서 묵묵하게 해내시는 책임감 있는 모습에 언제나 감동합니다. 저도 귀감이 될 수 있게 노력할게요.', 'pastel-pink', 'font-cute', '👍', DATE_SUB(NOW(), INTERVAL 7 DAY)),
('허지유', '당신의 소중한 시작을 열렬히 기뻐하며 축하합니다. 앞으로 시작되는 새로운 여정이 당신만의 빛나는 색깔로 아름답게 물들기를 바랄게요.', 'warm-yellow', 'font-serif', '🌟', DATE_SUB(NOW(), INTERVAL 7 DAY)),
('고승우', '따사로운 햇살처럼 밝고 온화한 당신의 친절이 삭막한 일상에 단비 같은 위안이 됩니다. 늘 감사하고 행복한 연말 맞이하시기를 기원합니다.', 'pastel-green', 'font-handwriting', '🍀', DATE_SUB(NOW(), INTERVAL 8 DAY)),
('임민지', '축하합니다! 오랫동안 간절하게 꿈꾸고 땀 흘려 노력하던 결실이 마침내 이루어졌네요. 오늘은 온전히 당신이 가장 행복한 날이기를 바랍니다.', 'elegant-purple', 'font-sans', '🎉', DATE_SUB(NOW(), INTERVAL 8 DAY));
