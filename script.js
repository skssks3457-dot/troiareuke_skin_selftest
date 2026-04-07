const questions = [
  {
    id: "customerInfo",
    category: "Client Intake",
    title: "怨좉컼 湲곕낯 ?뺣낫瑜??낅젰??二쇱꽭??",
    description: "?곷떞 ??湲곕낯 ?뺣낫瑜?癒쇱? ?뺣━?섎㈃ ?댄썑 吏꾨떒 寃곌낵? ?곌껐?섍린 ?쎌뒿?덈떎.",
    type: "infoForm"
  },
  {
    id: "postCleanseFeel",
    category: "After Cleansing",
    title: "?몄븞 ???쇰? ?먮굦? ?대뼡媛??",
    description: "?몄븞 吏곹썑 媛??媛源뚯슫 諛섏쓳???좏깮??二쇱꽭??",
    type: "cards",
    multiSelect: true,
    orderedSelect: true,
    options: [
      { value: "tight", label: "留롮씠 ?밴?", description: "?몄븞 ??諛붾줈 ?밴린怨?嫄댁“???먮굦??媛뺥빐??" },
      { value: "innerDry", label: "?띻굔議?, description: "寃됱? 愿쒖갖??蹂댁뿬???띿씠 硫붾쭏瑜??먮굦???덉뼱??" },
      { value: "redness", label: "遺됱쓬", description: "?몄븞 ??遺됱뼱吏嫄곕굹 ?먭레 諛섏쓳???щ씪???" },
      { value: "mixedZone", label: "遺?꾨퀎 ?ㅻ쫫", description: "遺?꾨쭏??諛섏쓳???ㅻⅤ怨?洹좎씪?섏? ?딆븘??" }
    ]
  },
  {
    id: "oilBalance",
    category: "Sebum Balance",
    title: "?됱냼 ?쇱?? 踰덈뱾嫄곕┝? ?대뼡 ?몄씤媛??",
    description: "?쇱??됯낵 ?좊텇媛먯? ?쇰? ??낆쓣 ?섎늻???듭떖 湲곗??낅땲??",
    type: "sebumVisual",
    options: [
      { value: "none", label: "?쇱? ?놁쓬", description: "嫄곗쓽 踰덈뱾嫄곕┝???녾퀬 嫄댁“???몄씠?먯슂." },
      { value: "normal", label: "?쇱? 蹂댄넻", description: "?좊텇??怨쇳븯吏???곸????딆? ?몄씠?먯슂." },
      { value: "many", label: "?쇱? 留롮쓬", description: "?좊텇怨?踰덈뱾嫄곕┝???쎄쾶 ?щ씪???" }
    ]
  },
  {
    id: "sensitivityLevel",
    category: "Sensitivity Dial",
    title: "?꾩옱 ?쇰? ?덈??꾨? 吏곸젒 議곗젅??二쇱꽭??",
    description: "誘쇨컧?꾨뒗 吏꾩젙/?λ꼍 以묒떖 ?쒖븞 ?щ?瑜?寃곗젙?섎뒗 蹂댁“ 吏?쒖엯?덈떎.",
    type: "slider",
    min: 0,
    max: 10,
    step: 1,
    labels: ["?덉젙??, "蹂댄넻", "?쎄컙 ?덈?", "留ㅼ슦 ?덈?"]
  },
  {
    id: "faceZoneConcern",
    category: "Face Zone Mapping",
    title: "?쇨뎬?먯꽌 ?좉꼍 ?곗씠??遺?꾨? ?좏깮??怨좊???怨⑤씪二쇱꽭??",
    description: "遺?꾨? 癒쇱? 怨좊Ⅸ ?? ?대떦 遺?꾩뿉??媛???ш쾶 ?먮겮??怨좊????댁뼱???좏깮??二쇱꽭??",
    type: "faceMap",
    zones: [
      {
        value: "forehead",
        label: "?대쭏",
        description: "?쇱?, 醫곸?, ?명뎮遺덊뎮 寃?,
        concerns: [
          { value: "forehead_oil", label: "?좊텇???쎄쾶 ?щ씪???, description: "踰덈뱾嫄곕┝怨??쇱? 遺꾨퉬媛 鍮좊Ⅴ寃??먭뺨?몄슂." },
          { value: "forehead_bumps", label: "醫곸???諛섎났?쇱슂", description: "?묎퀬 ?ㅻ룎?좊룎???몃윭釉붿씠 ?먯＜ ?앷꺼??" },
          { value: "forehead_texture", label: "寃곗씠 留ㅻ걚?쎌? ?딆븘??, description: "硫붿씠?ъ뾽???ㅻ쑉嫄곕굹 ?쒕㈃??嫄곗튌寃?蹂댁뿬??" }
        ]
      },
      {
        value: "cheeks",
        label: "蹂?,
        description: "遺됱쓬, 嫄댁“, 誘쇨컧 諛섏쓳",
        concerns: [
          { value: "cheeks_redness", label: "遺됱? 湲곌? ?좉꼍 ?곗뿬??, description: "?닿컧怨??④퍡 ?띿“媛 ?щ씪?ㅻ뒗 ?몄씠?먯슂." },
          { value: "cheeks_dry", label: "嫄댁“?섍퀬 ?밴꺼??, description: "?띾떦源怨??몄꽍?⑥씠 ?쎄쾶 ?먭뺨?몄슂." },
          { value: "cheeks_sensitive", label: "?쒗뭹???덈??섍쾶 諛섏쓳?댁슂", description: "???쒗뭹?대굹 ?먭레??誘쇨컧?섍쾶 諛섏쓳?댁슂." }
        ]
      },
      {
        value: "nose",
        label: "肄?二쇰?",
        description: "釉붾옓?ㅻ뱶, ?쇱?, 紐④났",
        concerns: [
          { value: "nose_pores", label: "紐④났???꾨뱶?쇱졇 蹂댁뿬??, description: "肄붿? 肄㏓낵 紐④났???볦뼱 蹂댁씠???몄씠?먯슂." },
          { value: "nose_blackhead", label: "釉붾옓?ㅻ뱶媛 ?좉꼍 ?곗뿬??, description: "?쇱?媛 ?볦씠硫댁꽌 ?먯쿂??蹂댁뿬??" },
          { value: "nose_oil", label: "?좊텇??鍮좊Ⅴ寃??щ씪???, description: "?쒓컙??吏?섎㈃ 踰덈뱾嫄곕┝???ш쾶 ?먭뺨?몄슂." }
        ]
      },
      {
        value: "chin",
        label: "???낃?",
        description: "諛섎났 ?몃윭釉? 留덉같, 嫄댁“",
        concerns: [
          { value: "chin_trouble", label: "?몃윭釉붿씠 諛섎났?쇱슂", description: "???쇱씤怨??낃???諛섎났?곸쑝濡??щ씪???" },
          { value: "chin_irritation", label: "留덉같 ?먭레???덉뼱??, description: "留덉뒪?щ굹 ???묒큺 ???덈??댁????몄씠?먯슂." },
          { value: "chin_flaky", label: "媛곸쭏???ㅻ뼚 蹂댁뿬??, description: "?낃? 二쇰???嫄댁“?섍퀬 ?ㅻ쑉???몄씠?먯슂." }
        ]
      },
      {
        value: "eyes",
        label: "?덇?",
        description: "嫄댁“, ?붿＜由? ?뉗? ?쇰?",
        concerns: [
          { value: "eyes_dry", label: "嫄댁“?⑥씠 鍮⑤━ ?먭뺨?몄슂", description: "?덇?媛 ?쎄쾶 硫붾쭏瑜닿퀬 ?밴꺼??" },
          { value: "eyes_lines", label: "?붿＜由꾩씠 ?좉꼍 ?곗뿬??, description: "?쒖젙?좉낵 ?뉗? 二쇰쫫???덉뿉 ?꾩뼱??" },
          { value: "eyes_sensitive", label: "?꾩씠 ?쒗뭹???덈??댁슂", description: "?덇? ?꾩슜 ?쒗뭹??媛??遺?댁뒪?쎄쾶 ?먭뺨?몄슂." }
        ]
      },
      {
        value: "jawline",
        label: "?깆꽑",
        description: "源딆? ?몃윭釉? 遺볤린, 寃?,
        concerns: [
          { value: "jawline_deep", label: "源딆? ?몃윭釉붿씠 ?앷꺼??, description: "?덉そ?먯꽌 ?щ씪?ㅻ뒗 臾듭쭅???몃윭釉붿씠 ?덉뼱??" },
          { value: "jawline_texture", label: "寃곗씠 怨좊Ⅴ吏 ?딆븘??, description: "留ㅻ걟?섏? ?딄퀬 留뚯죱?????명뎮遺덊뎮?댁슂." },
          { value: "jawline_dull", label: "移숈튃??蹂댁뿬??, description: "?깆꽑 遺?꾧? ?좊룆 ?곹븯怨?移숈튃???먮굦?댁뿉??" }
        ]
      }
    ]
  },
  {
    id: "estimatedSkinType",
    category: "Type Estimate",
    title: "?꾩옱 ?묐떟 湲곗? ?덉긽 ?쇰? ??낆엯?덈떎.",
    description: "?몄븞 ???쇰? 諛섏쓳怨??쇱? 諛몃윴?ㅻ? 諛뷀깢?쇰줈 1李??쇰? ??낆쓣 ?덈궡?⑸땲??",
    type: "autoProfile"
  },
  {
    id: "representativeConcern",
    category: "Main Trouble",
    title: "?꾩옱 媛???닿껐?섍퀬 ?띠? ????쇰? 怨좊?? 臾댁뾿?멸???",
    description: "?뚮줈?곗쓽 留덉?留??④퀎?낅땲?? 媛???곗꽑?쒖쐞媛 ?믪? 怨좊? ??媛吏瑜??좏깮??二쇱꽭??",
    type: "pills",
    options: [
      { value: "dehydration", label: "湲곕? ?띾낫??寃고븤" },
      { value: "sensitive", label: "誘쇨컧/吏꾩젙" },
      { value: "pigment", label: "愿묒콈/?됱냼" },
      { value: "elasticity", label: "?꾨젰/二쇰쫫" },
      { value: "pore", label: "紐④났/?몃윭釉? },
      { value: "tone", label: "?덉깋/?? }
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

function getCustomerName() {
  return "";
}

function getCustomerPrefix() {
  return "";
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
    questionTitle.textContent = `${customerPrefix}${currentZone.label} 怨좊????좏깮??二쇱꽭??`;
    questionDescription.textContent = `${customerPrefix}${currentZone.label} 遺?꾩뿉??媛??媛源뚯슫 ??ぉ??1媛??좏깮??二쇱꽭?? ?밸퀎??怨좊????놁쑝硫?'?놁쓬'???좏깮??二쇱꽭??`;
  } else if (question.id === "postCleanseFeel") {
    questionTitle.textContent = `${customerPrefix}?몄븞 吏곹썑 媛??媛源뚯슫 諛섏쓳???좏깮??二쇱꽭??`;
    questionDescription.textContent = "媛??媛源뚯슫 諛섏쓳 ?쒖쑝濡??뚮윭二쇱꽭?? ??媛源뚯슱?섎줉 癒쇱? ?뚮윭二쇱꽭??";
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
    ? (state.faceZoneStep === question.zones.length - 1 ? "?ㅼ쓬" : "?ㅼ쓬 遺??)
    : (state.currentIndex === questions.length - 1 ? "寃곌낵 蹂닿린" : "?ㅼ쓬");

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
    age: "",
    gender: "",
    note: "",
    ...(state.answers.customerInfo || {})
  };

  const form = document.createElement("div");
  form.className = "info-form";
  form.innerHTML = `
    <div class="field-row">
      <div class="field-group">
        <label class="field-label" for="customer-age">?섏씠</label>
        <input id="customer-age" class="field-input" type="number" min="10" max="99" placeholder="?? 32">
      </div>
    </div>
    <div class="field-group">
      <span class="field-label">?깅퀎</span>
      <div class="choice-inline">
        <button id="gender-female" class="choice-button" type="button">?ъ꽦</button>
        <button id="gender-male" class="choice-button" type="button">?⑥꽦</button>
      </div>
    </div>
    <div class="field-group">
      <label class="field-label" for="customer-note">?뱀씠?ы빆</label>
      <textarea id="customer-note" class="field-textarea" placeholder="?뚮젅瑜닿린, ?쒖닠 寃쏀뿕, 怨꾩젅 諛섏쓳 ?? lang="ko"></textarea>
    </div>
  `;

  dynamicField.appendChild(form);

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
      <span class="profile-chip">誘쇨컧??${state.answers.sensitivityLevel ?? 4}/10</span>
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
        <div class="sebum-scale-rail" data-sebum-rail="true" aria-label="?쇱? ?④퀎 ?좏깮" role="slider" aria-valuemin="1" aria-valuemax="${question.options.length}" aria-valuenow="${question.options.findIndex((option) => option.value === selectedOption.value) + 1}" tabindex="0">
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
    const selectedOrder = question.multiSelect ? selectedValues.indexOf(option.value) + 1 : 0;

    if (isSelected) {
      button.classList.add("is-selected");
    }
    button.innerHTML = `
      <span class="option-topline">
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
      <p class="slider-caption">?꾩옱 ?쇰?媛 諛섏쓳?섎뒗 媛뺣룄</p>
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
  questionHelper.textContent = `${getCustomerPrefix()}遺?꾨퀎 ?쇰? 怨좊? ${state.faceZoneStep + 1} / ${question.zones.length}`;
  questionHelper.classList.remove("hidden");

  const concernList = document.createElement("div");
  concernList.className = "concern-list";
  const concerns = [
    { value: "none", label: "?놁쓬", description: `${currentZone.label} 遺?꾩뿉???꾩옱 ?밸퀎??怨좊????놁뼱??` },
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
    return `??쓬 ${value}`;
  }
  if (value <= 5) {
    return `蹂댄넻 ${value}`;
  }
  if (value <= 7) {
    return `二쇱쓽 ${value}`;
  }
  return `怨좊? 源딆쓬 ${value}`;
}

function getEstimatedSkinProfile() {
  const cleanse = Array.isArray(state.answers.postCleanseFeel) ? state.answers.postCleanseFeel : [];
  const oil = state.answers.oilBalance;
  const sensitivity = Number(state.answers.sensitivityLevel || 0);

  let typeLabel = "以묒꽦";
  let description = "?좎닔遺?諛몃윴?ㅺ? 鍮꾧탳???덉젙?곸씤 ?먮쫫?쇰줈 蹂댁엯?덈떎.";

  if (oil === "none" && cleanse.includes("tight")) {
    typeLabel = sensitivity >= 6 ? "誘쇨컧?? : "嫄댁꽦";
    description = sensitivity >= 6
      ? "?밴?怨??덈? 諛섏쓳???④퍡 蹂댁뿬 ?λ꼍 吏꾩젙 以묒떖??愿由ш? ?곗꽑?낅땲??"
      : "?섎텇怨??좊텇??紐⑤몢 遺議깊빐 蹂댁씠硫?蹂댁뒿怨?蹂댄샇留?媛뺥솕媛 以묒슂?⑸땲??";
  } else if (oil === "none" && cleanse.includes("innerDry")) {
    typeLabel = "嫄댁꽦/?띻굔議?;
    description = "寃됰낫???띾떦源??以묒떖?대씪 ?덉씠?대뱶 蹂댁뒿怨??섎텇 ?좎??μ씠 以묒슂?⑸땲??";
  } else if (oil === "many") {
    typeLabel = sensitivity >= 6 ? "?덈???吏?? : "吏??;
    description = sensitivity >= 6
      ? "?좊텇? 留롮?留??먭레 諛섏쓳???숇컲??吏꾩젙怨??쇱? 諛몃윴?ㅻ? ?④퍡 ?≪븘???⑸땲??"
      : "?좊텇怨?踰덈뱾嫄곕┝???쒕졆???쇱?, 紐④났, ?몃윭釉?愿由?鍮꾩쨷???쎈땲??";
  } else if (cleanse.includes("redness")) {
    typeLabel = "誘쇨컧??;
    description = "?몄븞 ??遺됱쓬???먮뱶?ъ졇 ?먭레 理쒖냼?붿? 吏꾩젙 猷⑦떞???곗꽑?낅땲??";
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
      : "?꾩옱 臾명빆???묐떟?????ㅼ쓬 ?④퀎濡??대룞??二쇱꽭??";
  }

  return hasAnswer;
}

function goToNext() {
  if (!validateCurrentStep()) {
    return;
  }

  const question = questions[state.currentIndex];
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
      return `${zone.label} - ${selected ? selected.concernLabel : "誘몄쓳??}`;
    }).join(", ");
  }

  if (question.type === "infoForm") {
    if (!value) {
      return "-";
    }
    const genderLabel = value.gender === "female" ? "?ъ꽦" : value.gender === "male" ? "?⑥꽦" : "-";
    return `${value.name || "-"} / ${value.age || "-"}??/ ${genderLabel}`;
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
      name: "",
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
  const genderLabel = customer.gender === "female" ? "?ъ꽦" : customer.gender === "male" ? "?⑥꽦" : "-";
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
    "[?몃줈?댁븘瑜댁? ?쇰? 吏꾨떒 ?붿빟]",
    `?섏씠/?깅퀎: ${customer.age || "-"}??/ ${genderLabel}`,
    `?덉긽 ?쇰? ??? ${profile.typeLabel}`,
    `誘쇨컧?? ${state.answers.sensitivityLevel ?? 0}/10`,
    `?쇱? 諛몃윴?? ${oilAnswer}`,
    `遺?꾨퀎 怨좊?: ${zoneAnswer}`,
    `???怨좊?: ${concernAnswer}`,
    `吏꾨떒 ?붿빟: ${result.headline}`,
    `?곷떞 硫붾え: ${customer.note?.trim() || "?놁쓬"}`
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
    consultCopyStatus.textContent = "?곷떞 ?붿빟??蹂듭궗?섏뿀?듬땲??";
  } catch (error) {
    consultSummaryText.select();
    document.execCommand("copy");
    consultCopyStatus.textContent = "?곷떞 ?붿빟??蹂듭궗?섏뿀?듬땲??";
  }
}

function calculateResult() {
  const profile = getEstimatedSkinProfile();
  const sensitivity = Number(state.answers.sensitivityLevel || 0);
  const score = Math.min(100, Math.max(22, 38 + sensitivity * 4 + (state.answers.oilBalance === "many" ? 14 : 0) + (state.answers.postCleanseFeel === "redness" ? 10 : 0)));

  let headline = `${profile.typeLabel} 以묒떖 ?곷떞???곹빀???곹깭`;
  let summary = `${profile.description} ?꾩옱 ???怨좊?? ${getOptionLabel(questions[6], state.answers.representativeConcern)} 以묒떖?쇰줈 蹂댁엯?덈떎.`;
  let recommendations = [
    `${profile.typeLabel} 湲곗????덉??댁? ?곷떞 硫붿떆吏瑜?癒쇱? ?쒖븞??蹂댁꽭??`,
    `遺???좏깮 寃곌낵??${getOptionLabel(questions[4], state.answers.faceZoneConcern)} 遺?꾨? 以묒떖?쇰줈 ?쒗뭹 ?ㅻ챸???곌껐?섎㈃ ?먯뿰?ㅻ읇?듬땲??`,
    "怨좉컼 諛고룷?⑹뿉?쒕뒗 ??寃곌낵瑜??쒗뭹 異붿쿇 ?먮뒗 ?곷떞 ?덉빟 CTA? 諛붾줈 ?댁뼱二쇰뒗 援ъ꽦??醫뗭뒿?덈떎."
  ];

  if (profile.typeLabel.includes("誘쇨컧")) {
    recommendations = [
      "吏꾩젙, ?λ꼍, ??먭레 ?ㅼ썙?쒕? ?곗꽑 ?몄텧??怨좉컼 遺덉븞??以꾩뿬 二쇱꽭??",
      `誘쇨컧??${sensitivity}/10 湲곗??쇰줈 媛뺥븳 ?≫떚釉??쒖븞蹂대떎 ?덉젙??猷⑦떞??癒쇱? ?덈궡?섎뒗 ?몄씠 醫뗭뒿?덈떎.`,
      "?곷떞?먯꽌???몄븞 ?듦?, 留덉같, ?쒗뭹 援먯껜 ?대젰???④퍡 泥댄겕??蹂댁꽭??"
    ];
  } else if (profile.typeLabel.includes("吏??) || profile.typeLabel.includes("蹂듯빀")) {
    recommendations = [
      "?쇱?? 紐④났, 踰덈뱾嫄곕┝ 愿由?以묒떖???덈궡媛 ?곗꽑?낅땲??",
      "T議?U議?遺꾨━ 愿由?硫붿떆吏瑜??ｌ쑝硫?怨좉컼 泥닿컧????醫뗭븘吏묐땲??",
      "紐④났, ?몃윭釉? 寃?媛쒖꽑 ?쒗뭹 異붿쿇 ?섏씠吏? ?곌껐?섍린 醫뗭뒿?덈떎."
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
  const customerPrefix = getCustomerPrefix();

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


