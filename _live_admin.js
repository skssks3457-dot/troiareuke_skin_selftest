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

  loginError.textContent = "?꾩씠???먮뒗 鍮꾨?踰덊샇媛 ?щ컮瑜댁? ?딆뒿?덈떎.";
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
    container.innerHTML = '<p class="detail-text">?꾩쭅 吏묎퀎???곗씠?곌? ?놁뒿?덈떎.</p>';
    return;
  }

  container.innerHTML = entries.map(([name, count]) => {
    const percent = total ? Math.round((count / total) * 100) : 0;
    return `
      <div class="metric-row">
        <div class="metric-head">
          <span class="metric-name">${name}</span>
          <span class="metric-value">${count}嫄?쨌 ${percent}%</span>
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

  skinTypeFilter.innerHTML = '<option value="">?꾩껜</option>' +
    skinTypes.map((item) => `<option value="${item}">${item}</option>`).join("");

  concernFilter.innerHTML = '<option value="">?꾩껜</option>' +
    concerns.map((item) => `<option value="${item}">${item}</option>`).join("");
}

function applyFilters() {
  const searchValue = searchInput.value.trim().toLowerCase();
  const skinTypeValue = skinTypeFilter.value;
  const concernValue = concernFilter.value;

  adminState.filtered = adminState.records.filter((record) => {
    const searchTarget = [
      record.id,
      record.customer?.age,
      record.customer?.gender,
      record.customer?.note,
      record.createdAtLabel,
      record.profile?.skinType,
      record.profile?.mainConcern
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
  const sensitiveCount = adminState.records.filter((record) => (record.profile?.skinType || "").includes("誘쇨컧")).length;
  const oilyCount = adminState.records.filter((record) => (record.profile?.skinType || "").includes("吏??)).length;
  const averageSensitivity = total
    ? (adminState.records.reduce((sum, record) => sum + Number(record.profile?.sensitivity || 0), 0) / total).toFixed(1)
    : "0.0";
  const uniqueCustomers = new Set(
    adminState.records.map((record) => `${record.customer?.age || ""}-${record.customer?.gender || ""}-${record.createdAt || ""}`)
  ).size;

  statsGrid.innerHTML = `
    <article class="stat-card">
      <p class="stat-label">珥??묐떟 ??/p>
      <p class="stat-value">${total}</p>
      <p class="stat-sub">?꾩쟻 ??λ맂 吏꾨떒 寃곌낵</p>
    </article>
    <article class="stat-card">
      <p class="stat-label">誘쇨컧???묐떟</p>
      <p class="stat-value">${sensitiveCount}</p>
      <p class="stat-sub">誘쇨컧 ?ㅼ썙???ы븿 ???湲곗?</p>
    </article>
    <article class="stat-card">
      <p class="stat-label">吏???묐떟</p>
      <p class="stat-value">${oilyCount}</p>
      <p class="stat-sub">吏???ㅼ썙???ы븿 ???湲곗?</p>
    </article>
    <article class="stat-card">
      <p class="stat-label">?됯퇏 誘쇨컧??/ 怨좉컼 ??/p>
      <p class="stat-value">${averageSensitivity}</p>
      <p class="stat-sub">고유 응답 ${uniqueCustomers}건 · 최근 ${latest ? latest.createdAtLabel : "-"}</p>
    </article>
  `;

  const skinTypeMap = countBy(adminState.records.map((record) => record.profile?.skinType));
  const concernMap = countBy(adminState.records.map((record) => record.profile?.mainConcern));
  const zoneMap = countFlatBy(adminState.records, (record) => {
    const value = record.answers?.faceZoneConcern;
    if (!value || Array.isArray(value)) {
      return [];
    }
    return Object.values(value).map((item) => item.zoneLabel);
  });
  const cleanseMap = countFlatBy(adminState.records, (record) => {
    const values = record.answers?.postCleanseFeel;
    if (!Array.isArray(values)) {
      return [];
    }
    const labels = {
      tight: "留롮씠 ?밴?",
      innerDry: "?띻굔議?,
      redness: "遺됱쓬",
      mixedZone: "遺?꾨퀎 ?ㅻ쫫"
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
  resultCount.textContent = `${adminState.filtered.length}嫄?;

  if (!adminState.filtered.length) {
    responseList.innerHTML = '<div class="detail-view empty-state">議곌굔??留욌뒗 ?묐떟???놁뒿?덈떎.</div>';
    return;
  }

  responseList.innerHTML = adminState.filtered.map((record) => `
    <button class="response-card ${record.id === adminState.selectedId ? "is-active" : ""}" type="button" data-record-id="${record.id}">
      <div class="response-card-head">
        <p class="response-name">응답 ${record.createdAtLabel}</p>
        <button class="card-danger-button" type="button" data-delete-id="${record.id}">??젣</button>
      </div>
      <p class="response-meta">${record.customer.age || "-"}??/ ${getGenderLabel(record.customer.gender)} / ${record.createdAtLabel}</p>
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
    return "?ъ꽦";
  }
  if (gender === "male") {
    return "?⑥꽦";
  }
  return "-";
}

function renderDetail() {
  const record = adminState.filtered.find((item) => item.id === adminState.selectedId);

  if (!record) {
    detailView.className = "detail-view empty-state";
    detailView.textContent = "醫뚯륫 紐⑸줉?먯꽌 ?묐떟???좏깮??二쇱꽭??";
    return;
  }

  detailView.className = "detail-view";
  detailView.innerHTML = `
    <div class="detail-block">
      <div class="detail-block-head">
        <h3>고객 기본 정보</h3>
        <button class="card-danger-button" type="button" id="delete-selected-record">??젣</button>
      </div>
      <p class="detail-meta">${record.customer.age || "-"}??/ ${getGenderLabel(record.customer.gender)} / ${record.createdAtLabel}</p>
      <p class="detail-text">${record.customer.note || "?뱀씠?ы빆 ?놁쓬"}</p>
      <div class="detail-chip-row">
        <span class="detail-chip">${record.profile.skinType}</span>
        <span class="detail-chip">誘쇨컧??${record.profile.sensitivity}/10</span>
        <span class="detail-chip">${record.profile.mainConcern}</span>
      </div>
    </div>
    <div class="detail-block">
      <h3>吏꾨떒 寃곌낵</h3>
      <p class="detail-meta">?덈???吏??${record.result.score} / 100</p>
      <p class="answer-value">${record.result.headline}</p>
      <p class="detail-text">${record.result.summary}</p>
    </div>
    <div class="detail-block">
      <h3>遺??諛??쇱? ?뺣낫</h3>
      <div class="detail-chip-row">
        <span class="detail-chip">${record.profile.faceZone}</span>
        <span class="detail-chip">${record.profile.oilBalance}</span>
      </div>
    </div>
    <div class="detail-block">
      <h3>?묐떟 ?곸꽭</h3>
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
    window.alert("??젣???묐떟???놁뒿?덈떎.");
    return;
  }

  const shouldDelete = window.confirm("??λ맂 紐⑤뱺 怨좉컼 ?묐떟????젣?좉퉴?? ???묒뾽? ?섎룎由????놁뒿?덈떎.");
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

