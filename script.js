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
    description: "세안 직후 가장 가까운 반응을 선택해 주세요.",
    type: "cards",
    multiSelect: true,
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

function renderQuestion() {
  const question = questions[state.currentIndex];
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
    : (state.currentIndex === questions.length - 1 ? "결과 보기" : "다음");

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
    button.innerHTML = `
      <span class="option-label">${option.label}</span>
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

function calculateResult() {
  const profile = getEstimatedSkinProfile();
  const sensitivity = Number(state.answers.sensitivityLevel || 0);
  const score = Math.min(100, Math.max(22, 38 + sensitivity * 4 + (state.answers.oilBalance === "many" ? 14 : 0) + (state.answers.postCleanseFeel === "redness" ? 10 : 0)));

  let headline = `${profile.typeLabel} 중심 상담이 적합한 상태`;
  let summary = `${profile.description} 현재 대표 고민은 ${getOptionLabel(questions[6], state.answers.representativeConcern)} 중심으로 보입니다.`;
  let recommendations = [
    `${profile.typeLabel} 기준의 홈케어와 상담 메시지를 먼저 제안해 보세요.`,
    `부위 선택 결과인 ${getOptionLabel(questions[4], state.answers.faceZoneConcern)} 부위를 중심으로 제품 설명을 연결하면 자연스럽습니다.`,
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
    recommendations
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
