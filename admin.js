const STORAGE_KEY = "TROIAREUKE_SKIN_DIAGNOSIS_RECORDS";
const ADMIN_AUTH_KEY = "TROIAREUKE_ADMIN_AUTH";
const ADMIN_PERSIST_AUTH_KEY = "TROIAREUKE_ADMIN_AUTH_PERSIST";
const ADMIN_SAVED_CREDENTIALS_KEY = "TROIAREUKE_ADMIN_SAVED_CREDENTIALS";
const ADMIN_CREDENTIALS = {
  id: "troiareuke",
  password: "!1qazxsw2@"
};

const loginView = document.getElementById("admin-login-view");
const dashboardView = document.getElementById("admin-dashboard-view");
const adminIdInput = document.getElementById("admin-id-input");
const adminPasswordInput = document.getElementById("admin-password-input");
const rememberCredentialsInput = document.getElementById("remember-credentials");
const keepLoginInput = document.getElementById("keep-login");
const adminLoginButton = document.getElementById("admin-login-button");
const adminLogoutButton = document.getElementById("admin-logout-button");
const loginError = document.getElementById("login-error");
const statsGrid = document.getElementById("stats-grid");
const skinTypeBreakdown = document.getElementById("skin-type-breakdown");
const concernBreakdown = document.getElementById("concern-breakdown");
const zoneBreakdown = document.getElementById("zone-breakdown");
const cleanseBreakdown = document.getElementById("cleanse-breakdown");
const oilBreakdown = document.getElementById("oil-breakdown");
const responseList = document.getElementById("response-list");
const detailView = document.getElementById("detail-view");
const resultCount = document.getElementById("result-count");
const searchInput = document.getElementById("search-input");
const skinTypeFilter = document.getElementById("skin-type-filter");
const concernFilter = document.getElementById("concern-filter");
const clearFiltersButton = document.getElementById("clear-filters");
const deleteAllRecordsButton = document.getElementById("delete-all-records");

const adminState = {
  records: [],
  filtered: [],
  selectedId: null
};

function isAuthenticated() {
  return (
    sessionStorage.getItem(ADMIN_AUTH_KEY) === "authorized" ||
    localStorage.getItem(ADMIN_PERSIST_AUTH_KEY) === "authorized"
  );
}

function showLogin() {
  loginView.classList.remove("hidden");
  dashboardView.classList.add("hidden");
}

function showDashboard() {
  loginView.classList.add("hidden");
  dashboardView.classList.remove("hidden");
}

function handleLogin() {
  const id = adminIdInput.value.trim();
  const password = adminPasswordInput.value;

  if (id === ADMIN_CREDENTIALS.id && password === ADMIN_CREDENTIALS.password) {
    if (keepLoginInput.checked) {
      localStorage.setItem(ADMIN_PERSIST_AUTH_KEY, "authorized");
      sessionStorage.removeItem(ADMIN_AUTH_KEY);
    } else {
      sessionStorage.setItem(ADMIN_AUTH_KEY, "authorized");
      localStorage.removeItem(ADMIN_PERSIST_AUTH_KEY);
    }

    if (rememberCredentialsInput.checked) {
      localStorage.setItem(
        ADMIN_SAVED_CREDENTIALS_KEY,
        JSON.stringify({ id, password, remember: true, keepLogin: keepLoginInput.checked })
      );
    } else {
      localStorage.removeItem(ADMIN_SAVED_CREDENTIALS_KEY);
    }

    loginError.textContent = "";
    adminPasswordInput.value = "";
    showDashboard();
    initDashboard();
    return;
  }

  loginError.textContent = "아이디 또는 비밀번호가 올바르지 않습니다.";
}

function handleLogout() {
  sessionStorage.removeItem(ADMIN_AUTH_KEY);
  localStorage.removeItem(ADMIN_PERSIST_AUTH_KEY);
  adminPasswordInput.value = "";
  showLogin();
}

function loadSavedCredentials() {
  const saved = JSON.parse(localStorage.getItem(ADMIN_SAVED_CREDENTIALS_KEY) || "null");
  if (!saved) {
    return;
  }

  adminIdInput.value = saved.id || "";
  adminPasswordInput.value = saved.password || "";
  rememberCredentialsInput.checked = Boolean(saved.remember);
  keepLoginInput.checked = Boolean(saved.keepLogin);
}

function loadRecords() {
  adminState.records = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
}

function persistRecords(records) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  adminState.records = records;
}

function getUniqueValues(selector) {
  return [...new Set(adminState.records.map(selector).filter(Boolean))];
}

function countBy(items) {
  return items.reduce((acc, item) => {
    if (!item) {
      return acc;
    }
    acc[item] = (acc[item] || 0) + 1;
    return acc;
  }, {});
}

function countFlatBy(records, selector) {
  return records.reduce((acc, record) => {
    const values = selector(record);
    values.forEach((value) => {
      if (!value) {
        return;
      }
      acc[value] = (acc[value] || 0) + 1;
    });
    return acc;
  }, {});
}

function renderMetricList(container, map) {
  const entries = Object.entries(map).sort((a, b) => b[1] - a[1]);
  const total = entries.reduce((sum, [, count]) => sum + count, 0);

  if (!entries.length) {
    container.innerHTML = '<p class="detail-text">아직 집계할 데이터가 없습니다.</p>';
    return;
  }

  container.innerHTML = entries.map(([name, count]) => {
    const percent = total ? Math.round((count / total) * 100) : 0;
    return `
      <div class="metric-row">
        <div class="metric-head">
          <span class="metric-name">${name}</span>
          <span class="metric-value">${count}건 · ${percent}%</span>
        </div>
        <div class="metric-bar">
          <div class="metric-fill" style="width: ${percent}%;"></div>
        </div>
      </div>
    `;
  }).join("");
}

function renderFilterOptions() {
  const skinTypes = getUniqueValues((record) => record.profile?.skinType);
  const concerns = getUniqueValues((record) => record.profile?.mainConcern);

  skinTypeFilter.innerHTML = '<option value="">전체</option>' +
    skinTypes.map((item) => `<option value="${item}">${item}</option>`).join("");

  concernFilter.innerHTML = '<option value="">전체</option>' +
    concerns.map((item) => `<option value="${item}">${item}</option>`).join("");
}

function applyFilters() {
  const searchValue = searchInput.value.trim().toLowerCase();
  const skinTypeValue = skinTypeFilter.value;
  const concernValue = concernFilter.value;

  adminState.filtered = adminState.records.filter((record) => {
    const searchTarget = [
      record.createdAtLabel,
      record.customer?.age,
      record.customer?.gender,
      record.customer?.note,
      record.profile?.skinType,
      record.profile?.mainConcern,
      record.profile?.faceZone
    ].filter(Boolean).join(" ").toLowerCase();
    const nameMatch = !searchValue || searchTarget.includes(searchValue);
    const skinTypeMatch = !skinTypeValue || record.profile?.skinType === skinTypeValue;
    const concernMatch = !concernValue || record.profile?.mainConcern === concernValue;
    return nameMatch && skinTypeMatch && concernMatch;
  });

  if (!adminState.filtered.find((record) => record.id === adminState.selectedId)) {
    adminState.selectedId = adminState.filtered[0]?.id || null;
  }
}

function renderStats() {
  const total = adminState.records.length;
  const latest = adminState.records[0];
  const sensitiveCount = adminState.records.filter((record) => (record.profile?.skinType || "").includes("민감")).length;
  const oilyCount = adminState.records.filter((record) => (record.profile?.skinType || "").includes("지성")).length;
  const averageSensitivity = total
    ? (adminState.records.reduce((sum, record) => sum + Number(record.profile?.sensitivity || 0), 0) / total).toFixed(1)
    : "0.0";
  const uniqueCustomers = new Set(
    adminState.records.map((record) => `${record.customer?.age || ""}-${record.customer?.gender || ""}-${record.createdAt || ""}`)
  ).size;

  statsGrid.innerHTML = `
    <article class="stat-card">
      <p class="stat-label">총 응답 수</p>
      <p class="stat-value">${total}</p>
      <p class="stat-sub">누적 저장된 진단 결과</p>
    </article>
    <article class="stat-card">
      <p class="stat-label">민감성 응답</p>
      <p class="stat-value">${sensitiveCount}</p>
      <p class="stat-sub">민감 키워드 포함 타입 기준</p>
    </article>
    <article class="stat-card">
      <p class="stat-label">지성 응답</p>
      <p class="stat-value">${oilyCount}</p>
      <p class="stat-sub">지성 키워드 포함 타입 기준</p>
    </article>
    <article class="stat-card">
      <p class="stat-label">평균 민감도 / 고객 수</p>
      <p class="stat-value">${averageSensitivity}</p>
      <p class="stat-sub">고유 응답 ${uniqueCustomers}건 · 최근 ${latest ? latest.createdAtLabel : "-"}</p>
    </article>
  `;

  const skinTypeMap = countBy(adminState.records.map((record) => record.profile?.skinType));
  const concernMap = countBy(adminState.records.map((record) => record.profile?.mainConcern));
  const zoneMap = countFlatBy(adminState.records, (record) => {
    const value = record.answers?.faceZoneConcern;
    if (!Array.isArray(value)) {
      return [];
    }
    return value.map((item) => item.zoneLabel);
  });
  const cleanseMap = countFlatBy(adminState.records, (record) => {
    const values = record.answers?.postCleanseFeel;
    if (!Array.isArray(values)) {
      return [];
    }
    const labels = {
      tight: "많이 당김",
      innerDry: "속건조",
      redness: "붉음",
      mixedZone: "부위별 다름"
    };
    return values.map((value) => labels[value] || value);
  });
  const oilMap = countBy(adminState.records.map((record) => record.profile?.oilBalance));

  renderMetricList(skinTypeBreakdown, skinTypeMap);
  renderMetricList(concernBreakdown, concernMap);
  renderMetricList(zoneBreakdown, zoneMap);
  renderMetricList(cleanseBreakdown, cleanseMap);
  renderMetricList(oilBreakdown, oilMap);
}

function renderList() {
  resultCount.textContent = `${adminState.filtered.length}건`;

  if (!adminState.filtered.length) {
    responseList.innerHTML = '<div class="detail-view empty-state">조건에 맞는 응답이 없습니다.</div>';
    return;
  }

  responseList.innerHTML = adminState.filtered.map((record) => `
    <button class="response-card ${record.id === adminState.selectedId ? "is-active" : ""}" type="button" data-record-id="${record.id}">
      <div class="response-card-head">
        <p class="response-name">응답 ${record.createdAtLabel}</p>
        <button class="card-danger-button" type="button" data-delete-id="${record.id}">삭제</button>
      </div>
      <p class="response-meta">${record.customer.age || "-"}세 / ${getGenderLabel(record.customer.gender)} / ${record.createdAtLabel}</p>
      <div class="response-tag-row">
        <span class="response-tag">${record.profile.skinType}</span>
        <span class="response-tag">${record.profile.mainConcern}</span>
      </div>
    </button>
  `).join("");

  responseList.querySelectorAll("[data-record-id]").forEach((button) => {
    button.addEventListener("click", () => {
      adminState.selectedId = button.getAttribute("data-record-id");
      renderList();
      renderDetail();
    });
  });

  responseList.querySelectorAll("[data-delete-id]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      const recordId = button.getAttribute("data-delete-id");
      deleteRecord(recordId);
    });
  });
}

function getGenderLabel(gender) {
  if (gender === "female") {
    return "여성";
  }
  if (gender === "male") {
    return "남성";
  }
  return "-";
}

function renderDetail() {
  const record = adminState.filtered.find((item) => item.id === adminState.selectedId);

  if (!record) {
    detailView.className = "detail-view empty-state";
    detailView.textContent = "좌측 목록에서 응답을 선택해 주세요.";
    return;
  }

  detailView.className = "detail-view";
  detailView.innerHTML = `
    <div class="detail-block">
      <div class="detail-block-head">
        <h3>고객 기본 정보</h3>
        <button class="card-danger-button" type="button" id="delete-selected-record">삭제</button>
      </div>
      <p class="detail-meta">${record.customer.age || "-"}세 / ${getGenderLabel(record.customer.gender)} / ${record.createdAtLabel}</p>
      <p class="detail-text">${record.customer.note || "특이사항 없음"}</p>
      <div class="detail-chip-row">
        <span class="detail-chip">${record.profile.skinType}</span>
        <span class="detail-chip">민감도 ${record.profile.sensitivity}/10</span>
        <span class="detail-chip">${record.profile.mainConcern}</span>
      </div>
    </div>
    <div class="detail-block">
      <h3>진단 결과</h3>
      <p class="detail-meta">예민도 지수 ${record.result.score} / 100</p>
      <p class="answer-value">${record.result.headline}</p>
      <p class="detail-text">${record.result.summary}</p>
    </div>
    <div class="detail-block">
      <h3>부위 및 피지 정보</h3>
      <div class="detail-chip-row">
        <span class="detail-chip">${record.profile.faceZone}</span>
        <span class="detail-chip">${record.profile.oilBalance}</span>
      </div>
    </div>
    <div class="detail-block">
      <h3>응답 상세</h3>
      <div class="answer-list">
        ${record.answerSummary.map((item) => `
          <article class="answer-item">
            <p class="answer-question">${item.question}</p>
            <p class="answer-value">${item.answer}</p>
          </article>
        `).join("")}
      </div>
    </div>
  `;

  const deleteSelectedButton = document.getElementById("delete-selected-record");
  deleteSelectedButton.addEventListener("click", () => {
    deleteRecord(record.id);
  });
}

function deleteRecord(recordId) {
  const record = adminState.records.find((item) => item.id === recordId);
  if (!record) {
    return;
  }

  const shouldDelete = window.confirm(`선택한 응답을 삭제할까요? 이 작업은 되돌릴 수 없습니다.`);
  if (!shouldDelete) {
    return;
  }

  const nextRecords = adminState.records.filter((item) => item.id !== recordId);
  persistRecords(nextRecords);
  adminState.selectedId = nextRecords[0]?.id || null;
  renderFilterOptions();
  renderStats();
  rerender();
}

function deleteAllRecords() {
  if (!adminState.records.length) {
    window.alert("삭제할 응답이 없습니다.");
    return;
  }

  const shouldDelete = window.confirm("저장된 모든 고객 응답을 삭제할까요? 이 작업은 되돌릴 수 없습니다.");
  if (!shouldDelete) {
    return;
  }

  persistRecords([]);
  adminState.selectedId = null;
  renderFilterOptions();
  renderStats();
  rerender();
}

function bindEvents() {
  adminLoginButton.addEventListener("click", handleLogin);
  adminLogoutButton.addEventListener("click", handleLogout);
  adminPasswordInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      handleLogin();
    }
  });
  searchInput.addEventListener("input", rerender);
  skinTypeFilter.addEventListener("change", rerender);
  concernFilter.addEventListener("change", rerender);
  clearFiltersButton.addEventListener("click", () => {
    searchInput.value = "";
    skinTypeFilter.value = "";
    concernFilter.value = "";
    rerender();
  });
  deleteAllRecordsButton.addEventListener("click", deleteAllRecords);
}

function rerender() {
  applyFilters();
  renderList();
  renderDetail();
}

let dashboardInitialized = false;

function initDashboard() {
  if (dashboardInitialized) {
    loadRecords();
    renderStats();
    rerender();
    return;
  }

  loadRecords();
  renderFilterOptions();
  renderStats();
  applyFilters();
  renderList();
  renderDetail();
  bindEvents();
  dashboardInitialized = true;
}

function init() {
  loadSavedCredentials();

  if (isAuthenticated()) {
    showDashboard();
    initDashboard();
    return;
  }

  showLogin();
  adminLoginButton.addEventListener("click", handleLogin);
  adminPasswordInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      handleLogin();
    }
  });
}

init();
