const questions = [
  {
    id: "customerInfo",
    category: "Client Intake",
    title: "고객 기본 정보를 입력해 주세요.",
    description: "상담 전 기본 정보를 먼저 정리하면 이후 진단 결과와 연결하기 쉽습니다.",
    type: "infoForm"
  },
  {
    id: "postCleanseFeel",
    category: "After Cleansing",
    title: "세안 후 피부 느낌은 어떤가요?",
    description: "가장 가까운 반응 순으로 눌러주세요. 더 가까울수록 먼저 눌러주세요.",
    type: "cards",
    multiSelect: true,
    orderedSelect: true,
    options: [
      { value: "tight", label: "많이 당김", description: "세안 후 바로 당기고 건조한 느낌이 강해요." },
      { value: "innerDry", label: "속건조", description: "겉은 괜찮아 보여도 속이 메마른 느낌이 있어요." },
      { value: "redness", label: "붉음", description: "세안 후 붉어지거나 자극 반응이 올라와요." },
      { value: "mixedZone", label: "부위별 다름", description: "부위마다 반응이 다르고 균일하지 않아요." }
    ]
  },
  {
    id: "oilBalance",
    category: "Sebum Balance",
    title: "평소 피지와 번들거림은 어떤 편인가요?",
    description: "피지량과 유분감은 피부 타입을 나누는 핵심 기준입니다.",
    type: "sebumVisual",
    options: [
      { value: "none", label: "피지 없음", description: "거의 번들거림이 없고 건조한 편이에요." },
      { value: "normal", label: "피지 보통", description: "유분이 과하지도 적지도 않은 편이에요." },
      { value: "many", label: "피지 많음", description: "유분과 번들거림이 쉽게 올라와요." }
    ]
  },
  {
    id: "sensitivityLevel",
    category: "Sensitivity Dial",
    title: "현재 피부 예민도를 직접 조절해 주세요.",
    description: "민감도는 진정/장벽 중심 제안 여부를 결정하는 보조 지표입니다.",
    type: "slider",
    min: 0,
    max: 10,
    step: 1,
    labels: ["안정적", "보통", "약간 예민", "매우 예민"]
  },
  {
    id: "reactionTriggers",
    category: "Barrier Triggers",
    title: "피부가 반응하는 상황을 가까운 순서대로 골라주세요.",
    description: "자주 겪는 상황부터 눌러 주세요. 선택 순서가 장벽 민감도 판단에 반영됩니다.",
    type: "cards",
    multiSelect: true,
    orderedSelect: true,
    options: [
      { value: "season", visual: "환절기", label: "환절기마다 뒤집어져요", description: "계절이 바뀔 때 각질이 들뜨고 피부 컨디션이 쉽게 무너져요." },
      { value: "cosmetics", visual: "화장품", label: "새 제품에 따갑거나 가려워요", description: "새 화장품을 쓰면 따가움, 가려움, 붉어짐이 생겨요." },
      { value: "dust", visual: "미세먼지", label: "공기 나쁜 날 트러블이 올라와요", description: "미세먼지나 외부 환경이 나쁠 때 간지럽고 트러블이 올라와요." },
      { value: "stable", visual: "무던함", label: "대체로 무던한 편이에요", description: "환경이 바뀌어도 피부 반응이 크게 심해지지 않아요." }
    ]
  },
  {
    id: "rednessDuration",
    category: "Redness Timer",
    title: "세안 후 붉은 기는 얼마나 오래 남나요?",
    description: "붉은 기가 가라앉는 시간을 골라 장벽 반응 속도를 확인해요.",
    type: "timeVisual",
    options: [
      { value: "under10", label: "10분 내외", description: "잠깐 붉어졌다가 비교적 빠르게 가라앉아요." },
      { value: "over30", label: "30분 이상", description: "붉은 기가 꽤 오래 남아 피부가 예민해 보여요." },
      { value: "overnight", label: "다음날까지", description: "붉은 기나 열감이 다음날까지 이어질 때가 있어요." }
    ]
  },
  {
    id: "sleepRhythm",
    category: "Lifestyle Rhythm",
    title: "요즘 수면 리듬은 어떤 편인가요?",
    description: "피부 회복력과 컨디션을 좌우하는 생활 리듬을 체크해요.",
    type: "sleepClock",
    options: [
      { value: "short", label: "6시간 미만", description: "피곤하고 피부가 푸석해 보이는 날이 많아요." },
      { value: "steady", label: "7~8시간", description: "수면 시간이 비교적 충분하고 일정한 편이에요." },
      { value: "irregular", label: "불규칙", description: "자는 시간이 들쭉날쭉하고 자주 깨는 편이에요." }
    ]
  },
  {
    id: "dailyTriggers",
    category: "Daily Trigger Cards",
    title: "생활 속 피부 트리거를 골라주세요.",
    description: "피부를 흔들 수 있는 생활 요인을 여러 개 선택해 주세요.",
    type: "cards",
    multiSelect: true,
    options: [
      { value: "spicyLateMeal", visual: "식습관", label: "맵고 짠 음식 / 야식", description: "자극적인 음식이나 늦은 식사가 피부 컨디션에 영향을 주는 편이에요." },
      { value: "sweetFlour", visual: "당·밀가루", label: "단 음식 / 밀가루", description: "단 음식이나 밀가루를 먹은 뒤 트러블이 신경 쓰일 때가 있어요." },
      { value: "stressHeat", visual: "스트레스", label: "스트레스와 열감", description: "스트레스가 높아지면 열감, 붉어짐, 트러블이 함께 올라와요." },
      { value: "waterVeggie", visual: "밸런스", label: "수분과 채소를 챙겨요", description: "수분 섭취와 식단 균형을 비교적 잘 챙기는 편이에요." }
    ]
  },
  {
    id: "cleansingHabit",
    category: "Home Care Check",
    title: "평소 세안 습관은 어떤 쪽에 가까운가요?",
    description: "세안 방식은 장벽과 피지 밸런스에 직접 영향을 줍니다.",
    type: "segments",
    options: [
      { value: "overCleanse", label: "뽀득할 때까지", description: "개운한 느낌이 날 때까지 오래 씻는 편이에요." },
      { value: "gentleOnce", label: "천천히 자극없이 1번", description: "마찰을 줄이고 한 번에 부드럽게 세안해요." },
      { value: "dailyWipe", label: "닦토를 자주", description: "화장솜으로 닦아내는 토너 사용을 자주 해요." },
      { value: "warmWater", label: "따뜻한 물로", description: "미온수보다 따뜻한 물로 씻는 편이에요." },
      { value: "showerStream", label: "샤워하며 샤워기로", description: "샤워 중 얼굴에 물줄기를 직접 닿게 해요." }
    ]
  },
  {
    id: "recoverySignal",
    category: "Recovery Signal",
    title: "자고 일어난 후 베개 자국은 얼마나 오래가나요?",
    description: "피부 회복력과 탄력 흐름을 확인하는 재미있는 체크예요.",
    type: "recoveryDrag",
    defaultValue: "normal",
    options: [
      { value: "quick", label: "10분 내 사라짐", minutes: 10, description: "눌린 자국이 비교적 빠르게 회복돼요." },
      { value: "normal", label: "20분 전후", minutes: 20, description: "조금 시간이 지나면 자연스럽게 옅어져요." },
      { value: "slow", label: "30분 이상 지속", minutes: 35, description: "눌린 자국이 오래 남아 회복력이 떨어진 느낌이 있어요." },
      { value: "verySlow", label: "오전 내내 남음", minutes: 60, description: "아침 시간이 지나도 자국이 쉽게 사라지지 않아요." }
    ]
  },
  {
    id: "faceZoneConcern",
    category: "Face Zone Mapping",
    title: "얼굴에서 신경 쓰이는 부위를 선택해 고민을 골라주세요.",
    description: "부위를 먼저 고른 뒤, 해당 부위에서 가장 크게 느끼는 고민을 이어서 선택해 주세요.",
    type: "faceMap",
    zones: [
      {
        value: "forehead",
        label: "이마",
        description: "피지, 좁쌀, 울퉁불퉁 결",
        concerns: [
          { value: "forehead_oil", label: "유분이 쉽게 올라와요", description: "번들거림과 피지 분비가 빠르게 느껴져요." },
          { value: "forehead_bumps", label: "좁쌀이 반복돼요", description: "작고 오돌토돌한 트러블이 자주 생겨요." },
          { value: "forehead_texture", label: "결이 매끄럽지 않아요", description: "메이크업이 들뜨거나 표면이 거칠게 보여요." }
        ]
      },
      {
        value: "cheeks",
        label: "볼",
        description: "붉음, 건조, 민감 반응",
        concerns: [
          { value: "cheeks_redness", label: "붉은 기가 신경 쓰여요", description: "열감과 함께 홍조가 올라오는 편이에요." },
          { value: "cheeks_dry", label: "건조하고 당겨요", description: "속당김과 푸석함이 쉽게 느껴져요." },
          { value: "cheeks_sensitive", label: "제품에 예민하게 반응해요", description: "새 제품이나 자극에 민감하게 반응해요." }
        ]
      },
      {
        value: "nose",
        label: "코 주변",
        description: "블랙헤드, 피지, 모공",
        concerns: [
          { value: "nose_pores", label: "모공이 도드라져 보여요", description: "코와 콧볼 모공이 넓어 보이는 편이에요." },
          { value: "nose_blackhead", label: "블랙헤드가 신경 쓰여요", description: "피지가 쌓이면서 점처럼 보여요." },
          { value: "nose_oil", label: "유분이 빠르게 올라와요", description: "시간이 지나면 번들거림이 크게 느껴져요." }
        ]
      },
      {
        value: "chin",
        label: "턱/입가",
        description: "반복 트러블, 마찰, 건조",
        concerns: [
          { value: "chin_trouble", label: "트러블이 반복돼요", description: "턱 라인과 입가에 반복적으로 올라와요." },
          { value: "chin_irritation", label: "마찰 자극이 있어요", description: "마스크나 손 접촉 뒤 예민해지는 편이에요." },
          { value: "chin_flaky", label: "각질이 들떠 보여요", description: "입가 주변이 건조하고 들뜨는 편이에요." }
        ]
      },
      {
        value: "eyes",
        label: "눈가",
        description: "건조, 잔주름, 얇은 피부",
        concerns: [
          { value: "eyes_dry", label: "건조함이 빨리 느껴져요", description: "눈가가 쉽게 메마르고 당겨요." },
          { value: "eyes_lines", label: "잔주름이 신경 쓰여요", description: "표정선과 얇은 주름이 눈에 띄어요." },
          { value: "eyes_sensitive", label: "아이 제품에 예민해요", description: "눈가 전용 제품도 가끔 부담스럽게 느껴져요." }
        ]
      },
      {
        value: "jawline",
        label: "턱선",
        description: "깊은 트러블, 붓기, 결",
        concerns: [
          { value: "jawline_deep", label: "깊은 트러블이 생겨요", description: "안쪽에서 올라오는 묵직한 트러블이 있어요." },
          { value: "jawline_texture", label: "결이 고르지 않아요", description: "매끈하지 않고 만졌을 때 울퉁불퉁해요." },
          { value: "jawline_dull", label: "칙칙해 보여요", description: "턱선 부위가 유독 탁하고 칙칙한 느낌이에요." }
        ]
      }
    ]
  },
  {
    id: "estimatedSkinType",
    category: "Type Estimate",
    title: "현재 응답 기준 예상 피부 타입입니다.",
    description: "세안 후 피부 반응과 피지 밸런스를 바탕으로 1차 피부 타입을 안내합니다.",
    type: "autoProfile"
  },
  {
    id: "representativeConcern",
    category: "Main Trouble",
    title: "현재 가장 해결하고 싶은 대표 피부 고민은 무엇인가요?",
    description: "플로우의 마지막 단계입니다. 가장 우선순위가 높은 고민 한 가지를 선택해 주세요.",
    type: "pills",
    options: [
      { value: "dehydration", label: "기미 속보습 결핍" },
      { value: "sensitive", label: "민감/진정" },
      { value: "pigment", label: "광채/색소" },
      { value: "elasticity", label: "탄력/주름" },
      { value: "pore", label: "모공/트러블" },
      { value: "tone", label: "안색/톤" }
    ]
  }
];

const STORAGE_KEY = "TROIAREUKE_SKIN_DIAGNOSIS_RECORDS";

const productCatalog = {
  "P.I.T 클렌징 밀크": { image: "assets/products/pit-cleansing-milk.jpg", category: "클렌저" },
  "악센 오일컷 클렌징": { image: "assets/products/acsen-oilcut-cleansing.jpg", category: "클렌저" },
  "악센 리커버리": { image: "assets/products/acsen-recovery.jpg", category: "크림" },
  "악센 시카 SEN 토너": { image: "assets/products/acsen-cica-sen-toner.jpg", category: "토너" },
  "악센 SEN 앰플": { image: "assets/products/acsen-sen-ampoule.jpg", category: "앰플" },
  "악센 AC클리어 앰플": { image: "assets/products/acsen-ac-clear-ampoule-kit.jpg", category: "앰플" },
  "악센 TOC토너": { image: "assets/products/acsen-toc-toner.jpg", category: "토너" },
  "악센 AC크림": { image: "assets/products/acsen-ac-cream.jpg", category: "크림" },
  "악센 AC스팟솔루션": { image: "assets/products/acsen-ac-spot-solution.jpg", category: "스팟" },
  "악센 UV프로텍터 에센스": { image: "assets/products/acsen-uv-protector-essence.jpg", category: "선케어" },
  "AGT™ 하이드로 에센스": { image: "assets/products/agt-hydro-essence.jpg", category: "에센스" },
  "AGT™ 하이드로 크림": { image: "assets/products/agt-hydro-cream.jpg", category: "크림" },
  "에너지 크림": { image: "assets/products/energy-cream.jpg", category: "크림" },
  "쉴드크림": { image: "assets/products/shield-cream.jpg", category: "크림" },
  "안티-링클 아이크림": { image: "assets/products/anti-wrinkle-eye-cream.jpg", category: "아이케어" },
  "안티-링클 아이패치": { image: "assets/products/anti-wrinkle-eye-patch.jpg", category: "아이케어" },
  "멜라소닉 C-인퓨저": { image: "assets/products/melasonic-c-infuser.jpg", category: "앰플" },
  "인텐스 UV프로텍터 크림": { image: "assets/products/intense-uv-protector-cream.jpg", category: "선케어" },
  "GPS 마스크 비타토닝": { image: "assets/products/gps-mask-vita-toning.jpg", category: "마스크" },
  "GPS 마스크 티-레스큐": { image: "assets/products/gps-mask-t-rescue.jpg", category: "마스크" },
  "GPS 마스크 레드 디-에이징": { image: "assets/products/gps-mask-red-deaging.jpg", category: "마스크" },
  "H+ 칵테일 옐로우": { image: "assets/products/healing-cocktail-yellow.jpg", category: "앰플토너" },
  "H+ 칵테일 그린": { image: "assets/products/healing-cocktail-green.jpg", category: "앰플토너" },
  "H+ 칵테일 레드": { image: "assets/products/healing-cocktail-red.jpg", category: "앰플토너" },
  "H+ 칵테일 블루": { image: "assets/products/healing-cocktail-blue.jpg", category: "앰플토너" }
};

const productSets = {
  aging: {
    title: "탄력/주름/노화 케어 세트",
    type: "주름·탄력",
    description: "탄력 저하와 주름 등 노화 징후를 집중 케어해 생기 있고 매끈한 피부로 설계한 세트입니다.",
    products: ["H+ 칵테일 레드", "안티-링클 아이크림", "에너지 크림", "GPS 마스크 레드 디-에이징"]
  },
  pore: {
    title: "모공 밀도 케어 세트",
    type: "모공·결",
    description: "피지 배출과 결 정돈, 수분 밀도 케어를 함께 잡아 느슨해진 모공 탄력을 관리합니다.",
    products: ["악센 오일컷 클렌징", "악센 TOC토너", "H+ 칵테일 레드", "AGT™ 하이드로 에센스"]
  },
  barrier: {
    title: "피부 장벽강화 세트",
    type: "장벽·민감",
    description: "약산성·저자극 루틴으로 민감하고 약해진 피부에 진정, 보습, 보호를 단계별로 채웁니다.",
    products: ["악센 리커버리", "악센 시카 SEN 토너", "악센 SEN 앰플", "쉴드크림"]
  },
  pigment: {
    title: "기미/잡티 케어 세트",
    type: "색소·톤",
    description: "멜라닌 완화, 브라이트닝, 자외선 차단을 연결해 칙칙한 피부톤을 균일하게 정리합니다.",
    products: ["H+ 칵테일 옐로우", "멜라소닉 C-인퓨저", "인텐스 UV프로텍터 크림", "GPS 마스크 비타토닝"]
  },
  sebum: {
    title: "피지조절 케어 세트",
    type: "피지·번들거림",
    description: "과도한 피지와 모공 정체를 정돈해 피부를 맑고 깨끗한 컨디션으로 맞춥니다.",
    products: ["악센 오일컷 클렌징", "악센 AC클리어 앰플", "악센 AC크림"]
  },
  heat: {
    title: "해열/열노화 케어 세트",
    type: "열감·홍조",
    description: "열감과 민감 반응을 빠르게 진정시키고 수분 장벽을 강화하는 쿨링 케어입니다.",
    products: ["H+ 칵테일 블루", "AGT™ 하이드로 에센스", "AGT™ 하이드로 크림", "GPS 마스크 티-레스큐"]
  },
  hydration: {
    title: "수분/진정 케어 세트",
    type: "수분·진정",
    description: "고보습 레이어링으로 건조함과 당김을 완화하고 장시간 촉촉함을 유지합니다.",
    products: ["H+ 칵테일 그린", "AGT™ 하이드로 에센스", "AGT™ 하이드로 크림", "쉴드크림"]
  },
  redness: {
    title: "홍조 케어 세트",
    type: "홍조·민감",
    description: "저자극 진정 루틴으로 붉은기와 민감 반응을 가라앉히고 장벽 회복을 돕습니다.",
    products: ["악센 SEN 앰플", "악센 시카 SEN 토너", "악센 리커버리", "악센 UV프로텍터 에센스"]
  },
  acne: {
    title: "여드름/트러블 케어 세트",
    type: "트러블·모공",
    description: "피지, 각질, 모공, 염증성 트러블을 함께 관리하는 지성·복합성 맞춤 세트입니다.",
    products: ["악센 AC클리어 앰플", "악센 TOC토너", "악센 AC스팟솔루션", "악센 AC크림"]
  }
};

const state = {
  currentIndex: 0,
  answers: {},
  lastSavedId: null,
  faceZoneStep: 0
};

const surveyView = document.getElementById("survey-view");
const summaryView = document.getElementById("summary-view");
const dynamicField = document.getElementById("dynamic-field");
const questionCategory = document.getElementById("question-category");
const questionAccent = document.getElementById("question-accent");
const questionTitle = document.getElementById("question-title");
const questionDescription = document.getElementById("question-description");
const questionHelper = document.getElementById("question-helper");
const stepLabel = document.getElementById("step-label");
const progressLabel = document.getElementById("progress-label");
const progressBar = document.getElementById("progress-bar");
const errorMessage = document.getElementById("error-message");
const prevButton = document.getElementById("prev-button");
const nextButton = document.getElementById("next-button");
const summaryList = document.getElementById("summary-list");
const resultScoreValue = document.getElementById("result-score-value");
const resultHeadline = document.getElementById("result-headline");
const resultSummary = document.getElementById("result-summary");
const resultRecommendations = document.getElementById("result-recommendations");
const productSetTitle = document.getElementById("product-set-title");
const productSetDescription = document.getElementById("product-set-description");
const productRecommendations = document.getElementById("product-recommendations");
const restartButton = document.getElementById("restart-button");
const consultButton = document.getElementById("consult-button");
const consultModal = document.getElementById("consult-modal");
const consultCloseButton = document.getElementById("consult-close-button");
const consultSummaryText = document.getElementById("consult-summary-text");
const consultCopyButton = document.getElementById("consult-copy-button");
const consultCopyStatus = document.getElementById("consult-copy-status");

const nicknameParts = {
  month: ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"],
  fruit: ["사과", "복숭아", "자두", "포도", "레몬", "체리", "멜론", "유자"],
  animal: ["고양이", "토끼", "여우", "다람쥐", "사슴", "강아지", "판다", "참새"],
  vegetable: ["당근", "브로콜리", "양배추", "오이", "버섯", "토마토", "무", "고구마"]
};

function getSeededIndex(seed, length, offset = 0) {
  const value = Math.abs(seed * (offset + 3) + offset * 17);
  return value % length;
}

function generateAutoNickname() {
  const customer = state.answers.customerInfo || {};
  const ageSeed = Number(customer.age || 0);
  const genderSeed = customer.gender === "female" ? 7 : customer.gender === "male" ? 13 : 3;
  const monthSeed = new Date().getMonth() + 1;
  const baseSeed = ageSeed + genderSeed + monthSeed + Date.now();

  const month = nicknameParts.month[getSeededIndex(baseSeed, nicknameParts.month.length, 1)];
  const fruit = nicknameParts.fruit[getSeededIndex(baseSeed, nicknameParts.fruit.length, 2)];
  const animal = nicknameParts.animal[getSeededIndex(baseSeed, nicknameParts.animal.length, 3)];
  const vegetable = nicknameParts.vegetable[getSeededIndex(baseSeed, nicknameParts.vegetable.length, 4)];

  return `${month} ${fruit} ${animal} ${vegetable}`;
}

function getCustomerName() {
  return state.answers.customerInfo?.nickname || "";
}

function getCustomerPrefix() {
  const nickname = getCustomerName();
  return nickname ? `${nickname}님의 ` : "";
}

function getTimestampLabel(isoString) {
  const date = new Date(isoString);
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  }).format(date);
}

function ensureDefaultAnswer(question) {
  if (state.answers[question.id] !== undefined) {
    return;
  }

  if (question.type === "sebumVisual") {
    state.answers[question.id] = question.defaultValue || "normal";
  }

  if (question.type === "slider") {
    state.answers[question.id] = question.defaultValue ?? 4;
  }

  if (question.type === "recoveryDrag") {
    state.answers[question.id] = question.defaultValue || question.options[1]?.value || question.options[0]?.value;
  }
}

function renderQuestion() {
  const question = questions[state.currentIndex];
  ensureDefaultAnswer(question);
  const progress = Math.round(((state.currentIndex + 1) / questions.length) * 100);
  const customerPrefix = getCustomerPrefix();
  const isFaceMap = question.type === "faceMap";
  const currentZone = isFaceMap ? question.zones[state.faceZoneStep] : null;

  stepLabel.textContent = `${String(state.currentIndex + 1).padStart(2, "0")} / ${String(questions.length).padStart(2, "0")}`;
  progressLabel.textContent = `${progress}%`;
  progressBar.style.width = `${progress}%`;
  questionCategory.textContent = question.category;
  if (isFaceMap && currentZone) {
    questionTitle.textContent = `${customerPrefix}${currentZone.label} 고민을 선택해 주세요.`;
    questionDescription.textContent = `${customerPrefix}${currentZone.label} 부위에서 가장 가까운 항목을 1개 선택해 주세요. 특별한 고민이 없으면 '없음'을 선택해 주세요.`;
  } else {
    questionTitle.textContent = state.currentIndex === 0 ? question.title : `${customerPrefix}${question.title}`;
    questionDescription.textContent = state.currentIndex === 0 ? question.description : `${customerPrefix}${question.description}`;
  }
  questionHelper.classList.add("hidden");
  questionHelper.textContent = "";
  questionAccent.style.opacity = String(0.55 + state.currentIndex * 0.08);
  errorMessage.textContent = "";
  prevButton.disabled = state.currentIndex === 0 && (!isFaceMap || state.faceZoneStep === 0);
  nextButton.textContent = isFaceMap
    ? (state.faceZoneStep === question.zones.length - 1 ? "다음" : "다음 부위")
    : (state.currentIndex === questions.length - 1 ? "추천 상품 받기" : "다음");

  dynamicField.innerHTML = "";

  if (question.type === "cards") {
    renderCardOptions(question);
  }

  if (question.type === "sebumVisual") {
    renderSebumVisual(question);
  }

  if (question.type === "infoForm") {
    renderInfoForm(question);
  }

  if (question.type === "slider") {
    renderSlider(question);
  }

  if (question.type === "segments") {
    renderSegments(question);
  }

  if (question.type === "timeVisual") {
    renderTimeVisual(question);
  }

  if (question.type === "sleepClock") {
    renderSleepClock(question);
  }

  if (question.type === "recoveryDrag") {
    renderRecoveryDrag(question);
  }

  if (question.type === "bubbles") {
    renderBubbles(question);
  }

  if (question.type === "pills") {
    renderPills(question);
  }

  if (question.type === "faceMap") {
    renderFaceMap(question);
  }

  if (question.type === "autoProfile") {
    renderAutoProfile();
  }
}

function renderInfoForm() {
  const savedInfo = {
    nickname: "",
    age: "",
    gender: "",
    note: "",
    ...(state.answers.customerInfo || {})
  };

  if (!savedInfo.nickname) {
    savedInfo.nickname = generateAutoNickname();
    state.answers.customerInfo = {
      ...state.answers.customerInfo,
      nickname: savedInfo.nickname
    };
  }

  const form = document.createElement("div");
  form.className = "info-form";
  form.innerHTML = `
    <div class="field-group">
      <span class="field-label">랜덤 닉네임</span>
      <div class="nickname-row">
        <div id="customer-nickname" class="nickname-card">${savedInfo.nickname}</div>
        <button id="nickname-refresh" class="nickname-refresh" type="button">다른 닉네임</button>
      </div>
    </div>
    <div class="field-row">
      <div class="field-group">
        <label class="field-label" for="customer-age">나이</label>
        <input id="customer-age" class="field-input" type="number" min="10" max="99" placeholder="예: 32">
      </div>
    </div>
    <div class="field-group">
      <span class="field-label">성별</span>
      <div class="choice-inline">
        <button id="gender-female" class="choice-button" type="button">여성</button>
        <button id="gender-male" class="choice-button" type="button">남성</button>
      </div>
    </div>
    <div class="field-group">
      <label class="field-label" for="customer-note">특이사항</label>
      <textarea id="customer-note" class="field-textarea" placeholder="알레르기, 시술 경험, 계절 반응 등" lang="ko"></textarea>
    </div>
  `;

  dynamicField.appendChild(form);

  const nicknameCard = document.getElementById("customer-nickname");
  const nicknameRefreshButton = document.getElementById("nickname-refresh");
  const ageInput = document.getElementById("customer-age");
  const noteInput = document.getElementById("customer-note");
  const femaleButton = document.getElementById("gender-female");
  const maleButton = document.getElementById("gender-male");

  ageInput.value = savedInfo.age;
  noteInput.value = savedInfo.note || "";

  if (savedInfo.gender === "female") {
    femaleButton.classList.add("is-selected");
  }
  if (savedInfo.gender === "male") {
    maleButton.classList.add("is-selected");
  }

  const persistInfo = (next) => {
    state.answers.customerInfo = {
      ...state.answers.customerInfo,
      ...next
    };
  };

  nicknameRefreshButton.addEventListener("click", () => {
    const nextNickname = generateAutoNickname();
    nicknameCard.textContent = nextNickname;
    persistInfo({ nickname: nextNickname });
  });
  ageInput.addEventListener("input", (event) => {
    persistInfo({ age: event.target.value });
  });
  noteInput.addEventListener("input", (event) => {
    persistInfo({ note: event.target.value });
  });

  femaleButton.addEventListener("click", () => {
    persistInfo({ gender: "female" });
    renderQuestion();
  });
  maleButton.addEventListener("click", () => {
    persistInfo({ gender: "male" });
    renderQuestion();
  });
}

function renderAutoProfile() {
  const profile = getEstimatedSkinProfile();
  const card = document.createElement("div");
  card.className = "profile-card";
  card.innerHTML = `
    <p class="section-label">Estimated Profile</p>
    <h3 class="result-headline">${profile.typeLabel}</h3>
    <div class="profile-chip-row">
      <span class="profile-chip">${profile.cleanseLabel}</span>
      <span class="profile-chip">${profile.oilLabel}</span>
      <span class="profile-chip">민감도 ${state.answers.sensitivityLevel ?? 4}/10</span>
    </div>
    <p class="profile-copy">${profile.description}</p>
  `;
  dynamicField.appendChild(card);
}

function renderSebumVisual(question) {
  const selectedValue = state.answers[question.id] || question.options[0].value;
  const selectedOption = question.options.find((option) => option.value === selectedValue) || question.options[0];

  const panel = document.createElement("div");
  panel.className = "sebum-panel";
  panel.innerHTML = `
    <div class="sebum-card-layout">
      <div class="sebum-preview">
        <div id="sebum-visual" class="sebum-visual">${getSebumSvg(selectedOption.value)}</div>
      </div>
      <div class="sebum-scale">
        <div id="sebum-scale-labels" class="sebum-scale-labels">${getSebumScaleLabels(question, selectedOption.value)}</div>
        <div class="sebum-scale-rail" data-sebum-rail="true" aria-label="피지 단계 선택" role="slider" aria-valuemin="1" aria-valuemax="${question.options.length}" aria-valuenow="${question.options.findIndex((option) => option.value === selectedOption.value) + 1}" tabindex="0">
          <div class="sebum-scale-line"></div>
          <div id="sebum-scale-dot" class="sebum-scale-dot" style="top: ${getSebumScalePosition(selectedOption.value)}%;"></div>
        </div>
      </div>
    </div>
    <div class="sebum-copy">
      <span id="sebum-label" class="sebum-label">${selectedOption.label}</span>
      <span id="sebum-description" class="sebum-description">${selectedOption.description}</span>
    </div>
  `;

  const rail = panel.querySelector("[data-sebum-rail='true']");
  const visual = panel.querySelector("#sebum-visual");
  const labels = panel.querySelector("#sebum-scale-labels");
  const dot = panel.querySelector("#sebum-scale-dot");
  const label = panel.querySelector("#sebum-label");
  const description = panel.querySelector("#sebum-description");
  let currentIndex = question.options.findIndex((option) => option.value === selectedOption.value);
  let isDragging = false;

  const syncUI = () => {
    const option = question.options[currentIndex];
    state.answers[question.id] = option.value;
    visual.innerHTML = getSebumSvg(option.value);
    labels.innerHTML = getSebumScaleLabels(question, option.value);
    dot.style.top = `${getSebumScalePosition(option.value)}%`;
    rail.setAttribute("aria-valuenow", String(currentIndex + 1));
    label.textContent = option.label;
    description.textContent = option.description;
  };

  const selectByIndex = (index) => {
    const clampedIndex = Math.max(0, Math.min(question.options.length - 1, index));
    if (clampedIndex === currentIndex) {
      return;
    }
    currentIndex = clampedIndex;
    syncUI();
  };

  const selectFromPointer = (clientY) => {
    const rect = rail.getBoundingClientRect();
    const relative = (clientY - rect.top) / rect.height;
    const index = Math.round(relative * (question.options.length - 1));
    selectByIndex(index);
  };

  rail.addEventListener("pointerdown", (event) => {
    isDragging = true;
    rail.setPointerCapture(event.pointerId);
    selectFromPointer(event.clientY);
  });

  rail.addEventListener("pointermove", (event) => {
    if (!isDragging) {
      return;
    }
    selectFromPointer(event.clientY);
  });

  rail.addEventListener("pointerup", (event) => {
    isDragging = false;
    rail.releasePointerCapture(event.pointerId);
  });

  rail.addEventListener("pointercancel", () => {
    isDragging = false;
  });

  rail.addEventListener("keydown", (event) => {
    if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      event.preventDefault();
      selectByIndex(currentIndex - 1);
    }

    if (event.key === "ArrowDown" || event.key === "ArrowRight") {
      event.preventDefault();
      selectByIndex(currentIndex + 1);
    }
  });

  dynamicField.appendChild(panel);
}

function renderCardOptions(question) {
  const wrapper = document.createElement("div");
  wrapper.className = "option-grid";
  const selectedValue = state.answers[question.id];
  const selectedValues = Array.isArray(selectedValue) ? selectedValue : [];

  question.options.forEach((option) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "option-button";
    const isSelected = question.multiSelect
      ? selectedValues.includes(option.value)
      : selectedValue === option.value;

    if (isSelected) {
      button.classList.add("is-selected");
    }
    const selectedOrder = question.multiSelect ? selectedValues.indexOf(option.value) + 1 : 0;
    button.innerHTML = `
      <span class="option-topline">
        ${option.visual ? `<span class="option-visual">${option.visual}</span>` : ""}
        <span class="option-label">${option.label}</span>
        ${question.orderedSelect && isSelected ? `<span class="option-order">${selectedOrder}</span>` : ""}
      </span>
      <span class="option-description">${option.description}</span>
    `;
    button.addEventListener("click", () => {
      if (question.multiSelect) {
        state.answers[question.id] = toggleMultiValue(selectedValues, option.value);
      } else {
        state.answers[question.id] = option.value;
      }
      renderQuestion();
    });
    wrapper.appendChild(button);
  });

  dynamicField.appendChild(wrapper);
}

function toggleMultiValue(currentValues, nextValue) {
  if (currentValues.includes(nextValue)) {
    return currentValues.filter((value) => value !== nextValue);
  }

  return [...currentValues, nextValue];
}

function renderSlider(question) {
  const savedValue = state.answers[question.id] ?? 4;
  const container = document.createElement("div");
  container.className = "slider-shell";

  const valueLabel = getSensitivityCopy(savedValue);

  container.innerHTML = `
    <div class="slider-topline">
      <p class="slider-caption">현재 피부가 반응하는 강도</p>
      <div id="slider-value" class="slider-value">${valueLabel}</div>
    </div>
    <input
      id="sensitivity-slider"
      class="slider-input"
      type="range"
      min="${question.min}"
      max="${question.max}"
      step="${question.step}"
      value="${savedValue}"
    >
    <div class="slider-labels">
      <span>${question.labels[0]}</span>
      <span>${question.labels[1]}</span>
      <span>${question.labels[2]}</span>
      <span>${question.labels[3]}</span>
    </div>
  `;

  dynamicField.appendChild(container);

  const slider = document.getElementById("sensitivity-slider");
  const sliderValue = document.getElementById("slider-value");

  slider.addEventListener("input", (event) => {
    const currentValue = Number(event.target.value);
    state.answers[question.id] = currentValue;
    sliderValue.textContent = getSensitivityCopy(currentValue);
  });
}

function renderSegments(question) {
  const wrapper = document.createElement("div");
  wrapper.className = "segment-track";
  const selectedValue = state.answers[question.id];

  question.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "segment-button";
    if (selectedValue === option.value) {
      button.classList.add("is-selected");
    }
    button.innerHTML = `
      <span class="segment-index">0${index + 1}</span>
      <span class="segment-text">${option.label}</span>
    `;
    button.addEventListener("click", () => {
      state.answers[question.id] = option.value;
      renderQuestion();
    });
    wrapper.appendChild(button);
  });

  dynamicField.appendChild(wrapper);
}

function renderBubbles(question) {
  const wrapper = document.createElement("div");
  wrapper.className = "bubble-grid";
  const selectedValue = state.answers[question.id];

  question.options.forEach((option) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "bubble-button";
    if (selectedValue === option.value) {
      button.classList.add("is-selected");
    }
    button.innerHTML = `
      <span class="bubble-step">${option.label}</span>
      <span class="bubble-copy">${option.description}</span>
    `;
    button.addEventListener("click", () => {
      state.answers[question.id] = option.value;
      renderQuestion();
    });
    wrapper.appendChild(button);
  });

  dynamicField.appendChild(wrapper);
}

function renderTimeVisual(question) {
  const wrapper = document.createElement("div");
  wrapper.className = "time-visual-grid";
  const selectedValue = state.answers[question.id];
  const progressMap = {
    under10: 18,
    over30: 54,
    overnight: 100
  };
  const handMap = {
    under10: 38,
    over30: 180,
    overnight: 0
  };
  const labelMap = {
    under10: "10분",
    over30: "30분+",
    overnight: "24h 이상"
  };

  question.options.forEach((option) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "time-card";
    if (selectedValue === option.value) {
      button.classList.add("is-selected");
    }
    const progress = progressMap[option.value] || 40;
    const hand = handMap[option.value] || 90;
    const timeLabel = labelMap[option.value] || option.label;
    const isOvernight = option.value === "overnight";
    button.innerHTML = `
      <span class="time-clock ${isOvernight ? "is-overnight" : ""}" style="--time-progress: ${progress}%; --hand-angle: ${hand}deg;">
        ${isOvernight ? "" : "<span class=\"time-clock-hand\"></span>"}
        <span class="time-clock-center"></span>
        <span class="time-clock-label">${timeLabel}</span>
      </span>
      <span class="time-copy">
        <strong>${option.label}</strong>
        <span>${option.description}</span>
      </span>
    `;
    button.addEventListener("click", () => {
      state.answers[question.id] = option.value;
      renderQuestion();
    });
    wrapper.appendChild(button);
  });

  dynamicField.appendChild(wrapper);
}

function renderSleepClock(question) {
  const wrapper = document.createElement("div");
  wrapper.className = "sleep-clock-grid";
  const selectedValue = state.answers[question.id];
  const moonMap = {
    short: { phase: "thin", label: "짧은 밤", fill: 38 },
    steady: { phase: "full", label: "충분한 밤", fill: 82 },
    irregular: { phase: "cloud", label: "흐린 밤", fill: 58 }
  };

  question.options.forEach((option) => {
    const moon = moonMap[option.value] || moonMap.steady;
    const button = document.createElement("button");
    button.type = "button";
    button.className = "sleep-card";
    if (selectedValue === option.value) {
      button.classList.add("is-selected");
    }
    button.innerHTML = `
      <span class="sleep-dial sleep-moon sleep-moon-${moon.phase}" style="--sleep-fill: ${moon.fill}%;">
        <span class="moon-core"></span>
        <span class="moon-shadow"></span>
        <span class="moon-cloud"></span>
        <span class="sleep-moon-label">${moon.label}</span>
      </span>
      <span class="sleep-copy">
        <strong>${option.label}</strong>
        <span>${option.description}</span>
      </span>
    `;
    button.addEventListener("click", () => {
      state.answers[question.id] = option.value;
      renderQuestion();
    });
    wrapper.appendChild(button);
  });

  dynamicField.appendChild(wrapper);
}

function renderRecoveryDrag(question) {
  const selectedValue = state.answers[question.id] || question.defaultValue || question.options[1].value;
  const selectedIndex = Math.max(0, question.options.findIndex((option) => option.value === selectedValue));
  const selectedOption = question.options[selectedIndex] || question.options[0];
  const container = document.createElement("div");
  container.className = "recovery-drag-panel";
  container.innerHTML = `
    <div class="pillow-visual" style="--mark-opacity: ${getPillowMarkOpacity(selectedIndex, question.options.length)};">
      <span class="pillow-shape"></span>
      <span class="pillow-mark"></span>
      <span class="pillow-skin"></span>
    </div>
    <div class="recovery-meter-copy">
      <span id="recovery-minutes" class="recovery-minutes">${selectedOption.minutes}분</span>
      <strong id="recovery-label">${selectedOption.label}</strong>
      <p id="recovery-description">${selectedOption.description}</p>
    </div>
    <input
      id="recovery-slider"
      class="recovery-slider"
      type="range"
      min="0"
      max="${question.options.length - 1}"
      step="1"
      value="${selectedIndex}"
    >
    <div class="recovery-ticks">
      ${question.options.map((option) => `<span>${option.label}</span>`).join("")}
    </div>
  `;

  dynamicField.appendChild(container);

  const slider = document.getElementById("recovery-slider");
  const minutes = document.getElementById("recovery-minutes");
  const label = document.getElementById("recovery-label");
  const description = document.getElementById("recovery-description");
  const visual = container.querySelector(".pillow-visual");

  slider.addEventListener("input", (event) => {
    const currentIndex = Number(event.target.value);
    const currentOption = question.options[currentIndex];
    state.answers[question.id] = currentOption.value;
    minutes.textContent = `${currentOption.minutes}분`;
    label.textContent = currentOption.label;
    description.textContent = currentOption.description;
    visual.style.setProperty("--mark-opacity", getPillowMarkOpacity(currentIndex, question.options.length));
  });
}

function getPillowMarkOpacity(index, total) {
  if (total <= 1) {
    return 0.2;
  }
  return (0.18 + (index / (total - 1)) * 0.72).toFixed(2);
}

function renderPills(question) {
  const wrapper = document.createElement("div");
  wrapper.className = "pill-grid";
  const selectedValue = state.answers[question.id];

  question.options.forEach((option) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "pill-button";
    button.textContent = option.label;
    if (selectedValue === option.value) {
      button.classList.add("is-selected");
    }
    button.addEventListener("click", () => {
      state.answers[question.id] = option.value;
      renderQuestion();
    });
    wrapper.appendChild(button);
  });

  dynamicField.appendChild(wrapper);
}

function renderFaceMap(question) {
  const wrapper = document.createElement("div");
  wrapper.className = "zone-layout";

  const selectedAnswers = state.answers[question.id] && !Array.isArray(state.answers[question.id])
    ? state.answers[question.id]
    : {};
  const currentZone = question.zones[state.faceZoneStep];

  const zoneGrid = document.createElement("div");
  zoneGrid.className = "zone-grid";

  question.zones.forEach((zone, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "zone-button";

    if (index === state.faceZoneStep) {
      button.classList.add("is-selected");
    }

    const selected = selectedAnswers[zone.value];
    button.innerHTML = `
      <span class="zone-name">${zone.label}</span>
      <span class="zone-copy">${selected ? selected.concernLabel : zone.description}</span>
    `;

    button.addEventListener("click", () => {
      state.faceZoneStep = index;
      renderQuestion();
    });

    zoneGrid.appendChild(button);
  });

  wrapper.appendChild(zoneGrid);
  questionHelper.textContent = `${getCustomerPrefix()}부위별 피부 고민 ${state.faceZoneStep + 1} / ${question.zones.length}`;
  questionHelper.classList.remove("hidden");

  const concernList = document.createElement("div");
  concernList.className = "concern-list";
  const concerns = [
    { value: "none", label: "없음", description: `${currentZone.label} 부위에는 현재 특별한 고민이 없어요.` },
    ...currentZone.concerns
  ];

  concerns.forEach((concern) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "concern-button";

    if (selectedAnswers[currentZone.value]?.concern === concern.value) {
      button.classList.add("is-selected");
    }

    button.innerHTML = `
      <span class="concern-title">${concern.label}</span>
      <span class="concern-description">${concern.description}</span>
    `;

    button.addEventListener("click", () => {
      state.answers[question.id] = {
        ...selectedAnswers,
        [currentZone.value]: {
          zone: currentZone.value,
          concern: concern.value,
          zoneLabel: currentZone.label,
          concernLabel: concern.label
        }
      };
      renderQuestion();
    });

    concernList.appendChild(button);
  });

  wrapper.appendChild(concernList);

  dynamicField.appendChild(wrapper);
}

function getSensitivityCopy(value) {
  if (value <= 2) {
    return `낮음 ${value}`;
  }
  if (value <= 5) {
    return `보통 ${value}`;
  }
  if (value <= 7) {
    return `주의 ${value}`;
  }
  return `고민 깊음 ${value}`;
}

function getEstimatedSkinProfile() {
  const cleanse = Array.isArray(state.answers.postCleanseFeel) ? state.answers.postCleanseFeel : [];
  const oil = state.answers.oilBalance;
  const sensitivity = Number(state.answers.sensitivityLevel || 0);

  let typeLabel = "중성";
  let description = "유수분 밸런스가 비교적 안정적인 흐름으로 보입니다.";

  if (oil === "none" && cleanse.includes("tight")) {
    typeLabel = sensitivity >= 6 ? "민감성" : "건성";
    description = sensitivity >= 6
      ? "당김과 예민 반응이 함께 보여 장벽 진정 중심의 관리가 우선입니다."
      : "수분과 유분이 모두 부족해 보이며 보습과 보호막 강화가 중요합니다.";
  } else if (oil === "none" && cleanse.includes("innerDry")) {
    typeLabel = "건성/속건조";
    description = "겉보다 속당김이 중심이라 레이어드 보습과 수분 유지력이 중요합니다.";
  } else if (oil === "many") {
    typeLabel = sensitivity >= 6 ? "예민성 지성" : "지성";
    description = sensitivity >= 6
      ? "유분은 많지만 자극 반응도 동반돼 진정과 피지 밸런스를 함께 잡아야 합니다."
      : "유분과 번들거림이 뚜렷해 피지, 모공, 트러블 관리 비중이 큽니다.";
  } else if (cleanse.includes("redness")) {
    typeLabel = "민감성";
    description = "세안 후 붉음이 두드러져 자극 최소화와 진정 루틴이 우선입니다.";
  }

  return {
    typeLabel,
    description,
    cleanseLabel: getOptionLabel(questions[1], cleanse),
    oilLabel: getOptionLabel(questions[2], oil)
  };
}

function getSebumSvg(level) {
  const configs = {
    none: {
      dots: 3,
      wave: 0.08,
      gloss: 0.08,
      poreOpacity: 0.1,
      label: "sebum-none"
    },
    normal: {
      dots: 6,
      wave: 0.18,
      gloss: 0.18,
      poreOpacity: 0.16,
      label: "sebum-normal"
    },
    many: {
      dots: 10,
      wave: 0.34,
      gloss: 0.34,
      poreOpacity: 0.24,
      label: "sebum-many"
    }
  };

  const config = configs[level];
  const poreDots = Array.from({ length: config.dots }).map((_, index) => {
    const positions = [
      [56, 54], [84, 68], [114, 50], [138, 62], [72, 98], [108, 92], [142, 78], [64, 126], [112, 126], [146, 112]
    ];
    const [x, y] = positions[index];
    return `<circle cx="${x}" cy="${y}" r="${level === "many" ? 3.6 : 3.1}" fill="rgba(120,125,136,${config.poreOpacity})" />`;
  }).join("");

  const waveHeight = 16 + config.wave * 72;
  const shineBands = level === "many"
    ? `
      <path d="M28 86 C58 70, 96 74, 120 86 C144 98, 168 98, 192 84" stroke="rgba(255,255,255,0.68)" stroke-width="10" fill="none" stroke-linecap="round"/>
      <path d="M34 116 C68 102, 114 106, 152 114 C172 118, 184 118, 192 114" stroke="rgba(255,255,255,0.55)" stroke-width="12" fill="none" stroke-linecap="round"/>
      <path d="M40 142 C70 132, 108 136, 142 142 C166 146, 182 146, 192 142" stroke="rgba(255,255,255,0.36)" stroke-width="8" fill="none" stroke-linecap="round"/>
    `
    : level === "normal"
      ? `
        <path d="M34 110 C62 98, 102 100, 134 110 C158 118, 178 118, 192 112" stroke="rgba(255,255,255,0.44)" stroke-width="8" fill="none" stroke-linecap="round"/>
        <path d="M38 136 C72 126, 110 128, 144 134 C166 138, 180 138, 192 134" stroke="rgba(255,255,255,0.24)" stroke-width="6" fill="none" stroke-linecap="round"/>
      `
      : `<path d="M38 136 C72 128, 112 130, 146 136 C166 140, 182 140, 192 138" stroke="rgba(255,255,255,0.18)" stroke-width="5" fill="none" stroke-linecap="round"/>`;

  const microTexture = Array.from({ length: level === "many" ? 18 : level === "normal" ? 12 : 8 }).map((_, index) => {
    const points = [
      [44, 46, 60, 56], [72, 42, 84, 52], [104, 44, 118, 56], [136, 46, 152, 60],
      [52, 82, 70, 92], [88, 78, 102, 90], [122, 80, 138, 90], [148, 84, 166, 96],
      [46, 118, 64, 126], [80, 118, 98, 128], [114, 118, 130, 128], [144, 122, 160, 132],
      [58, 150, 74, 158], [94, 148, 108, 156], [124, 150, 140, 158], [150, 150, 168, 160],
      [74, 166, 92, 174], [118, 166, 136, 176]
    ];
    const [x1, y1, x2, y2] = points[index];
    return `<path d="M${x1} ${y1} C${x1 + 4} ${y1 + 2}, ${x2 - 4} ${y2 - 2}, ${x2} ${y2}" stroke="rgba(255,255,255,${0.06 + config.gloss * 0.22})" stroke-width="${level === "many" ? 2.4 : 1.6}" fill="none" stroke-linecap="round"/>`;
  }).join("");

  return `
    <svg class="sebum-svg" viewBox="0 0 220 220" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${config.label}">
      <defs>
        <linearGradient id="panelBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#fbfcff"/>
          <stop offset="100%" stop-color="#eef3fb"/>
        </linearGradient>
        <linearGradient id="skinField" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${level === "many" ? "#f2dc9b" : level === "normal" ? "#f2e3b5" : "#f3ead2"}"/>
          <stop offset="100%" stop-color="${level === "many" ? "#dfbe62" : level === "normal" ? "#e7ce86" : "#ead7b0"}"/>
        </linearGradient>
        <radialGradient id="glowField" cx="50%" cy="36%" r="58%">
          <stop offset="0%" stop-color="rgba(255,248,196,0.52)"/>
          <stop offset="100%" stop-color="rgba(255,255,255,0)"/>
        </radialGradient>
      </defs>
      <rect width="220" height="220" rx="24" fill="url(#panelBg)"/>
      <rect x="28" y="28" width="164" height="164" rx="10" fill="url(#skinField)"/>
      <rect x="28" y="28" width="164" height="164" rx="10" fill="url(#glowField)" opacity="${0.22 + config.gloss * 0.5}"/>
      <path d="M28 ${132 - waveHeight} C62 ${120 - waveHeight} 104 ${148 - waveHeight} 136 ${136 - waveHeight} C156 ${130 - waveHeight} 174 ${126 - waveHeight} 192 ${134 - waveHeight} L192 192 L28 192 Z" fill="rgba(246,214,88,${0.12 + config.gloss * 0.26})"/>
      <path d="M28 ${144 - waveHeight} C58 ${132 - waveHeight} 94 ${154 - waveHeight} 126 ${148 - waveHeight} C150 ${144 - waveHeight} 172 ${138 - waveHeight} 192 ${146 - waveHeight}" stroke="rgba(255,244,182,${0.24 + config.gloss * 0.34})" stroke-width="${level === "many" ? 8 : 6}" fill="none" stroke-linecap="round"/>
      ${microTexture}
      ${shineBands}
      ${poreDots}
    </svg>
  `;
}

function getSebumScaleLabels(question, selectedValue) {
  return question.options.map((option) => `
    <span class="sebum-scale-label ${selectedValue === option.value ? "is-active" : ""}">${option.label}</span>
  `).join("");
}

function getSebumScalePosition(level) {
  const positions = {
    none: 8,
    normal: 50,
    many: 92
  };

  return positions[level];
}

function validateCurrentStep() {
  const question = questions[state.currentIndex];
  const answer = state.answers[question.id];
  let hasAnswer = answer !== undefined && answer !== null && answer !== "";

  if (question.type === "faceMap") {
    const currentZone = question.zones[state.faceZoneStep];
    hasAnswer = Boolean(answer && answer[currentZone.value] && answer[currentZone.value].concern);
  } else if (question.multiSelect) {
    hasAnswer = Array.isArray(answer) && answer.length > 0;
  }

  if (question.type === "infoForm") {
    hasAnswer = Boolean(
      answer &&
      answer.age &&
      answer.gender
    );
  }

  if (question.type === "autoProfile") {
    hasAnswer = true;
  }

  if (!hasAnswer) {
    errorMessage.textContent = question.type === "infoForm"
      ? "나이와 성별을 입력한 뒤 다음 단계로 이동해 주세요."
      : "현재 문항에 응답한 뒤 다음 단계로 이동해 주세요.";
  }

  return hasAnswer;
}

function goToNext() {
  if (!validateCurrentStep()) {
    return;
  }

  const question = questions[state.currentIndex];
  if (question.id === "customerInfo" && !state.answers.customerInfo?.nickname) {
    state.answers.customerInfo = {
      ...state.answers.customerInfo,
      nickname: generateAutoNickname()
    };
  }
  if (question.type === "faceMap" && state.faceZoneStep < question.zones.length - 1) {
    state.faceZoneStep += 1;
    renderQuestion();
    return;
  }

  if (state.currentIndex === questions.length - 1) {
    renderSummary();
    return;
  }

  state.currentIndex += 1;
  renderQuestion();
}

function goToPrevious() {
  const question = questions[state.currentIndex];
  if (question.type === "faceMap" && state.faceZoneStep > 0) {
    state.faceZoneStep -= 1;
    renderQuestion();
    return;
  }

  if (state.currentIndex === 0) {
    return;
  }

  state.currentIndex -= 1;
  renderQuestion();
}

function getOptionLabel(question, value) {
  if (question.type === "slider") {
    return `${value} / 10`;
  }

  if (question.type === "faceMap") {
    if (!value || Array.isArray(value)) {
      return "-";
    }
    return question.zones.map((zone) => {
      const selected = value[zone.value];
      return `${zone.label} - ${selected ? selected.concernLabel : "미응답"}`;
    }).join(", ");
  }

  if (question.type === "infoForm") {
    if (!value) {
      return "-";
    }
    const genderLabel = value.gender === "female" ? "여성" : value.gender === "male" ? "남성" : "-";
    return `${value.name || "-"} / ${value.age || "-"}세 / ${genderLabel}`;
  }

  if (question.type === "autoProfile") {
    return getEstimatedSkinProfile().typeLabel;
  }

  if (question.multiSelect) {
    if (!Array.isArray(value) || !value.length) {
      return "-";
    }
    return value
      .map((selectedValue) => question.options.find((item) => item.value === selectedValue)?.label || selectedValue)
      .join(", ");
  }

  const option = question.options.find((item) => item.value === value);
  return option ? option.label : "-";
}

function buildAnswerSummary() {
  return questions.map((question) => ({
    id: question.id,
    question: question.title,
    answer: getOptionLabel(question, state.answers[question.id])
  }));
}

function buildSurveyRecord() {
  const profile = getEstimatedSkinProfile();
  const result = calculateResult();
  const now = new Date().toISOString();

  return {
    id: state.lastSavedId || `diag-${Date.now()}`,
    createdAt: now,
    createdAtLabel: getTimestampLabel(now),
    customer: {
      name: state.answers.customerInfo?.nickname || "",
      nickname: state.answers.customerInfo?.nickname || "",
      age: state.answers.customerInfo?.age || "",
      gender: state.answers.customerInfo?.gender || "",
      note: state.answers.customerInfo?.note?.trim() || ""
    },
    profile: {
      skinType: profile.typeLabel,
      sensitivity: Number(state.answers.sensitivityLevel || 0),
      mainConcern: getOptionLabel(
        questions.find((question) => question.id === "representativeConcern"),
        state.answers.representativeConcern
      ),
      faceZone: getOptionLabel(
        questions.find((question) => question.id === "faceZoneConcern"),
        state.answers.faceZoneConcern
      ),
      oilBalance: getOptionLabel(
        questions.find((question) => question.id === "oilBalance"),
        state.answers.oilBalance
      )
    },
    result,
    answers: { ...state.answers },
    answerSummary: buildAnswerSummary()
  };
}

function saveSurveyRecord() {
  const record = buildSurveyRecord();
  const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  const withoutCurrent = existing.filter((item) => item.id !== record.id);
  const nextRecords = [record, ...withoutCurrent];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(nextRecords));
  state.lastSavedId = record.id;
}

function buildConsultSummaryText() {
  const profile = getEstimatedSkinProfile();
  const result = calculateResult();
  const customer = state.answers.customerInfo || {};
  const genderLabel = customer.gender === "female" ? "여성" : customer.gender === "male" ? "남성" : "-";
  const zoneAnswer = getOptionLabel(
    questions.find((question) => question.id === "faceZoneConcern"),
    state.answers.faceZoneConcern
  );
  const concernAnswer = getOptionLabel(
    questions.find((question) => question.id === "representativeConcern"),
    state.answers.representativeConcern
  );
  const oilAnswer = getOptionLabel(
    questions.find((question) => question.id === "oilBalance"),
    state.answers.oilBalance
  );
  const productSet = result.recommendedSet;
  const productLine = productSet
    ? `${productSet.title} - ${productSet.products.join(", ")}`
    : "-";

  return [
    "[트로이아르케 피부 진단 요약]",
    `닉네임: ${customer.nickname || customer.name || "-"}`,
    `나이/성별: ${customer.age || "-"}세 / ${genderLabel}`,
    `예상 피부 타입: ${profile.typeLabel}`,
    `민감도: ${state.answers.sensitivityLevel ?? 0}/10`,
    `피지 밸런스: ${oilAnswer}`,
    `부위별 고민: ${zoneAnswer}`,
    `대표 고민: ${concernAnswer}`,
    `진단 요약: ${result.headline}`,
    `추천 상품: ${productLine}`,
    `상담 메모: ${customer.note?.trim() || "없음"}`
  ].join("\n");
}

function openConsultModal() {
  consultSummaryText.value = buildConsultSummaryText();
  consultCopyStatus.textContent = "";
  consultModal.classList.remove("hidden");
  consultModal.setAttribute("aria-hidden", "false");
}

function closeConsultModal() {
  consultModal.classList.add("hidden");
  consultModal.setAttribute("aria-hidden", "true");
}

async function copyConsultSummary() {
  try {
    await navigator.clipboard.writeText(consultSummaryText.value);
    consultCopyStatus.textContent = "상담 요약이 복사되었습니다.";
  } catch (error) {
    consultSummaryText.select();
    document.execCommand("copy");
    consultCopyStatus.textContent = "상담 요약이 복사되었습니다.";
  }
}

function getRecommendedProductSet() {
  const mainConcern = state.answers.representativeConcern;
  const oil = state.answers.oilBalance;
  const redness = state.answers.rednessDuration;
  const sleep = state.answers.sleepRhythm;
  const faceAnswers = state.answers.faceZoneConcern || {};
  const faceConcernValues = Object.values(faceAnswers).map((item) => item?.concern || "");

  if (mainConcern === "pigment" || mainConcern === "tone") {
    return productSets.pigment;
  }

  if (mainConcern === "elasticity" || state.answers.recoverySignal === "verySlow") {
    return productSets.aging;
  }

  if (mainConcern === "dehydration") {
    return productSets.hydration;
  }

  if (mainConcern === "sensitive") {
    return redness === "overnight" || redness === "over30" ? productSets.redness : productSets.barrier;
  }

  if (mainConcern === "pore") {
    if (oil === "many" || faceConcernValues.some((value) => value.includes("trouble") || value.includes("blackhead"))) {
      return productSets.acne;
    }
    return productSets.pore;
  }

  if (oil === "many") {
    return productSets.sebum;
  }

  if (redness === "overnight" || sleep === "irregular") {
    return productSets.heat;
  }

  return productSets.hydration;
}

function calculateResult() {
  const profile = getEstimatedSkinProfile();
  const sensitivity = Number(state.answers.sensitivityLevel || 0);
  const cleanse = Array.isArray(state.answers.postCleanseFeel) ? state.answers.postCleanseFeel : [];
  const reactionTriggers = Array.isArray(state.answers.reactionTriggers) ? state.answers.reactionTriggers : [];
  const dailyTriggers = Array.isArray(state.answers.dailyTriggers) ? state.answers.dailyTriggers : [];
  const rednessBoost = state.answers.rednessDuration === "overnight"
    ? 12
    : state.answers.rednessDuration === "over30"
      ? 7
      : 0;
  const recoveryBoost = state.answers.recoverySignal === "slow" ? 5 : 0;
  const lifestyleBoost = dailyTriggers.includes("stressHeat") ? 5 : Math.min(dailyTriggers.length * 2, 6);
  const score = Math.min(
    100,
    Math.max(
      22,
      38
        + sensitivity * 4
        + (state.answers.oilBalance === "many" ? 14 : 0)
        + (cleanse.includes("redness") ? 10 : 0)
        + reactionTriggers.length * 3
        + rednessBoost
        + recoveryBoost
        + lifestyleBoost
    )
  );
  const representativeQuestion = questions.find((question) => question.id === "representativeConcern");
  const faceZoneQuestion = questions.find((question) => question.id === "faceZoneConcern");
  const representativeLabel = getOptionLabel(representativeQuestion, state.answers.representativeConcern);
  const faceZoneLabel = getOptionLabel(faceZoneQuestion, state.answers.faceZoneConcern);

  let headline = `${profile.typeLabel} 중심 상담이 적합한 상태`;
  let summary = `${profile.description} 현재 대표 고민은 ${representativeLabel} 중심으로 보입니다.`;
  let recommendations = [
    `${profile.typeLabel} 기준의 홈케어와 상담 메시지를 먼저 제안해 보세요.`,
    `부위 선택 결과인 ${faceZoneLabel} 부위를 중심으로 제품 설명을 연결하면 자연스럽습니다.`,
    "고객 배포용에서는 이 결과를 제품 추천 또는 상담 예약 CTA와 바로 이어주는 구성이 좋습니다."
  ];

  if (profile.typeLabel.includes("민감")) {
    recommendations = [
      "진정, 장벽, 저자극 키워드를 우선 노출해 고객 불안을 줄여 주세요.",
      `민감도 ${sensitivity}/10 기준으로 강한 액티브 제안보다 안정화 루틴을 먼저 안내하는 편이 좋습니다.`,
      "상담에서는 세안 습관, 마찰, 제품 교체 이력을 함께 체크해 보세요."
    ];
  } else if (profile.typeLabel.includes("지성") || profile.typeLabel.includes("복합")) {
    recommendations = [
      "피지와 모공, 번들거림 관리 중심의 안내가 우선입니다.",
      "T존/U존 분리 관리 메시지를 넣으면 고객 체감이 더 좋아집니다.",
      "모공, 트러블, 결 개선 제품 추천 페이지와 연결하기 좋습니다."
    ];
  }

  return {
    score,
    headline,
    summary,
    recommendations,
    recommendedSet: getRecommendedProductSet()
  };
}

function renderSummary() {
  saveSurveyRecord();
  const result = calculateResult();

  surveyView.classList.add("hidden");
  summaryView.classList.remove("hidden");

  resultScoreValue.textContent = String(result.score);
  resultHeadline.textContent = result.headline;
  resultSummary.textContent = result.summary;

  summaryList.innerHTML = "";
  resultRecommendations.innerHTML = "";

  questions.forEach((question, index) => {
    const item = document.createElement("article");
    item.className = "summary-item";
    item.innerHTML = `
      <p class="summary-question">${String(index + 1).padStart(2, "0")}. ${question.title}</p>
      <p class="summary-answer">${getOptionLabel(question, state.answers[question.id])}</p>
    `;
    summaryList.appendChild(item);
  });

  result.recommendations.forEach((recommendation) => {
    const item = document.createElement("li");
    item.textContent = recommendation;
    resultRecommendations.appendChild(item);
  });

  renderProductRecommendations(result.recommendedSet);
}

function renderProductRecommendations(productSet) {
  if (!productSet || !productRecommendations) {
    return;
  }

  productSetTitle.textContent = productSet.title;
  productSetDescription.textContent = productSet.description;
  productRecommendations.innerHTML = "";

  productSet.products.forEach((productName, index) => {
    const product = productCatalog[productName];
    if (!product) {
      return;
    }
    const card = document.createElement("article");
    card.className = "product-card";
    card.innerHTML = `
      <div class="product-image-wrap">
        <img src="${product.image}" alt="${productName}" loading="lazy">
      </div>
      <div class="product-card-copy">
        <span>Step ${index + 1} · ${product.category}</span>
        <strong>${productName}</strong>
      </div>
    `;
    productRecommendations.appendChild(card);
  });
}

function resetSurvey() {
  state.currentIndex = 0;
  state.answers = {};
  state.lastSavedId = null;
  state.faceZoneStep = 0;
  summaryView.classList.add("hidden");
  surveyView.classList.remove("hidden");
  renderQuestion();
}

prevButton.addEventListener("click", goToPrevious);
nextButton.addEventListener("click", goToNext);
restartButton.addEventListener("click", resetSurvey);
consultButton.addEventListener("click", openConsultModal);
consultCloseButton.addEventListener("click", closeConsultModal);
consultCopyButton.addEventListener("click", copyConsultSummary);
consultModal.addEventListener("click", (event) => {
  if (event.target === consultModal) {
    closeConsultModal();
  }
});

renderQuestion();
