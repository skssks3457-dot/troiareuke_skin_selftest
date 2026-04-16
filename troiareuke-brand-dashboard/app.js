const COMPETITORS = [
  "TROIAREUKE",
  "달바",
  "닥터멜락신",
  "톰프로그램",
  "메디테라피",
  "파메스테틱"
];

const LIVE_API_CONFIG = {
  enabled: false,
  endpoint: "http://localhost:8000/api/dashboard"
};

const CHANNEL_OPTIONS = ["전체", "공식몰", "뉴스", "리뷰", "커뮤니티", "플랫폼"];
const MODE_OPTIONS = ["실제 공개 스냅샷", "실시간 연동"];

const state = {
  mode: "실제 공개 스냅샷",
  channel: "전체",
  startDate: "2026-03-16",
  endDate: "2026-04-14",
  dataset: null
};

const SNAPSHOT_DATA = {
  snapshotDate: "2026-04-14",
  heroMetrics: [
    {
      label: "트로이아르케 공식몰 리뷰",
      value: "759건",
      note: "악센 UV 선에센스 공식몰 사용후기 기준",
      sourceLabel: "트로이아르케 공식몰",
      sourceUrl: "https://www.troiareuke.co.kr/"
    },
    {
      label: "달바 화해 리뷰",
      value: "4.36 / 318",
      note: "화이트 트러플 바이탈 스프레이 세럼",
      sourceLabel: "화해",
      sourceUrl: "https://www.hwahae.co.kr/products/%EB%8B%AC%EB%B0%94-%ED%99%94%EC%9D%B4%ED%8A%B8-%ED%8A%B8%EB%9F%AC%ED%94%8C-%EB%B0%94%EC%9D%B4%ED%83%88-%EC%8A%A4%ED%94%84%EB%A0%88%EC%9D%B4-%EC%84%B8%EB%9F%BC/2008792"
    },
    {
      label: "닥터멜락신 최근 실적",
      value: "월 250억원",
      note: "2026년 3월 칼슘 라인 월매출",
      sourceLabel: "아시아투데이 / 네이트뉴스",
      sourceUrl: "https://m.news.nate.com/view/20260410n10921"
    }
  ],
  overview: [
    {
      label: "트로이아르케 최근 모멘텀",
      value: "네이버쇼핑 1위",
      delta: "2026-03-06",
      direction: "up",
      note: "톤업크림 카테고리 인기순·구매순 1위 기사",
      sourceLabel: "대학저널",
      sourceUrl: "https://dhnews.co.kr/news/view/1065575445516370"
    },
    {
      label: "톰프로그램 최근 모멘텀",
      value: "카카오 선물하기 1위",
      delta: "2025-03-13",
      direction: "up",
      note: "G필 12주 플랜 출시 직후 전체 카테고리 1위 기사",
      sourceLabel: "뉴스핌",
      sourceUrl: "https://www.newspim.com/news/view/20250313000755"
    },
    {
      label: "메디테라피 최근 모멘텀",
      value: "누적 96만개",
      delta: "2025-08-26",
      direction: "up",
      note: "포쎄라 리얼 비피다 블러크림 글로벌 누적 판매량",
      sourceLabel: "스포츠월드",
      sourceUrl: "https://www.sportsworldi.com/newsView/20250826507657"
    },
    {
      label: "파메스테틱 공개 판매가",
      value: "217,800원",
      delta: "공개가",
      direction: "up",
      note: "스타터팩 10% 할인 판매가",
      sourceLabel: "파메스테틱",
      sourceUrl: "https://pharmer.pharmesthetic.com/ko/articles/%ED%8C%8C%EB%A9%94%EC%8A%A4%ED%85%8C%ED%8B%B1-%EC%8A%A4%ED%83%80%ED%84%B0%ED%8C%A9-f1a1154d"
    }
  ],
  searchSummary: [
    {
      label: "구글 검색 트렌드",
      value: "직접 비교 가능",
      note: "Google Trends 비교 링크로 실시간 확인",
      sourceLabel: "Google Trends 도움말",
      sourceUrl: "https://support.google.com/trends/answer/4365538?hl=ko"
    },
    {
      label: "네이버 검색 트렌드",
      value: "API 연동 필요",
      note: "DataLab 검색어 트렌드 API로 기간별 집계 가능",
      sourceLabel: "Naver Developers",
      sourceUrl: "https://developers.naver.com/docs/serviceapi/datalab/search/search.md"
    },
    {
      label: "현재 배포 구조",
      value: "GitHub Pages",
      note: "실시간 집계는 별도 API 연결 시 자동화 가능",
      sourceLabel: "현재 프로젝트 구조",
      sourceUrl: "https://github.com/"
    }
  ],
  sentiment: {
    positive: 58,
    neutral: 24,
    negative: 18
  },
  trends: {
    labels: ["트로이아르케", "달바", "닥터멜락신", "톰프로그램", "메디테라피", "파메스테틱"],
    totalMentions: [759, 318, 250, 100, 96, 217],
    naverSearch: [1, 0, 0, 1, 0, 0],
    googleSearch: [1, 1, 1, 1, 1, 0]
  },
  keywords: [
    { label: "에스테틱", delta: "트로이아르케·톰프로그램 공통" },
    { label: "진정", delta: "트로이아르케·달바 리뷰 키워드" },
    { label: "슬로우에이징", delta: "닥터멜락신 브랜드 포지션" },
    { label: "뷰티테크", delta: "메디테라피 핵심 포지션" },
    { label: "프로모션", delta: "파메스테틱·톰프로그램 반복 노출" }
  ],
  competitors: [
    {
      name: "TROIAREUKE",
      share: "공식몰 리뷰 759건",
      sentiment: "5점 리뷰 다수 노출",
      momentum: "네이버쇼핑 톤업크림 1위",
      sourceUrl: "https://www.troiareuke.co.kr/"
    },
    {
      name: "달바",
      share: "화해 리뷰 318개",
      sentiment: "평점 4.36",
      momentum: "미스트·오일 랭킹 9위",
      sourceUrl: "https://www.hwahae.co.kr/products/%EB%8B%AC%EB%B0%94-%ED%99%94%EC%9D%B4%ED%8A%B8-%ED%8A%B8%EB%9F%AC%ED%94%8C-%EB%B0%94%EC%9D%B4%ED%83%88-%EC%8A%A4%ED%94%84%EB%A0%88%EC%9D%B4-%EC%84%B8%EB%9F%BC/2008792"
    },
    {
      name: "닥터멜락신",
      share: "칼슘 라인 월 250억원",
      sentiment: "글로우픽 3.78 / 18리뷰",
      momentum: "미국·영국 틱톡샵 확장",
      sourceUrl: "https://m.news.nate.com/view/20260410n10921"
    },
    {
      name: "톰프로그램",
      share: "올리브영N 성수 입점",
      sentiment: "자사몰 전량 품절 기사",
      momentum: "카카오톡 선물하기 1위",
      sourceUrl: "https://www.sedaily.com/NewsView/2DGXZGDDWD"
    },
    {
      name: "메디테라피",
      share: "블러크림 누적 96만개",
      sentiment: "블라인드 평점 2.8 / 60개 리뷰",
      momentum: "Qoo10 메가포 매출 3배",
      sourceUrl: "https://www.sportsworldi.com/newsView/20250826507657"
    },
    {
      name: "파메스테틱",
      share: "스타터팩 217,800원",
      sentiment: "프로모션·상담형 판매 구조",
      momentum: "크레시나 12종 공식 런칭",
      sourceUrl: "https://pharmer.pharmesthetic.com/ko/articles/%ED%8C%8C%EB%A9%94%EC%8A%A4%ED%85%8C%ED%8B%B1-%EC%8A%A4%ED%83%80%ED%84%B0%ED%8C%A9-f1a1154d"
    }
  ],
  issues: [
    {
      priority: "high",
      channel: "리뷰",
      title: "달바 리뷰에서 보습 만족은 높지만 알러지반응 11건, 따가움 10건이 노출됨",
      copy: "민감성 반응 관리 문구와 사용 가이드를 명확히 붙이지 않으면 부정 리뷰가 계속 쌓일 수 있습니다.",
      sourceLabel: "화해",
      sourceUrl: "https://www.hwahae.co.kr/products/%EB%8B%AC%EB%B0%94-%ED%99%94%EC%9D%B4%ED%8A%B8-%ED%8A%B8%EB%9F%AC%ED%94%8C-%EB%B0%94%EC%9D%B4%ED%83%88-%EC%8A%A4%ED%94%84%EB%A0%88%EC%9D%B4-%EC%84%B8%EB%9F%BC/2008792"
    },
    {
      priority: "high",
      channel: "리뷰",
      title: "닥터멜락신 칼슘 볼륨 크림은 유통 채널 평점 5.0이지만 글로우픽 평점은 3.78로 온도차가 있음",
      copy: "광고성 강한 채널과 사용자 리뷰 플랫폼의 온도차를 분리해서 읽어야 하고, 트로이아르케도 같은 검증 축이 필요합니다.",
      sourceLabel: "SSG / 글로우픽",
      sourceUrl: "https://glowpick.co.kr/product/164866"
    },
    {
      priority: "medium",
      channel: "검색",
      title: "네이버 검색량은 공개 페이지가 아니라 DataLab API 연동이 필요함",
      copy: "GitHub Pages만으로는 실시간 검색량 집계가 불가능하므로, 실제 운영에는 API 또는 서버리스 함수가 필수입니다.",
      sourceLabel: "Naver Developers",
      sourceUrl: "https://developers.naver.com/docs/serviceapi/datalab/search/search.md"
    }
  ],
  playbooks: [
    {
      title: "트로이아르케는 공식몰 리뷰 많은 제품을 중심으로 신뢰 후킹 구성",
      copy: "악센 UV 선에센스 759건, 힐링쿠션 할인 판매, 톤업크림 네이버쇼핑 1위 같은 실제 수치를 첫 화면에 넣는 구조가 유리합니다."
    },
    {
      title: "경쟁사는 리뷰 플랫폼과 기사 채널을 분리 모니터링",
      copy: "달바는 화해 리뷰, 닥터멜락신은 글로벌 매출 기사, 톰프로그램은 커머스 모멘텀 기사, 메디테라피는 판매량 기사 중심으로 분리 추적해야 합니다."
    },
    {
      title: "실시간 검색량은 GitHub Pages가 아니라 API로 연결",
      copy: "프론트는 그대로 두고 Naver DataLab API, Google Trends export 또는 별도 수집 서버를 붙여야 실제 기간 필터가 살아납니다."
    }
  ],
  mentions: [
    {
      channel: "공식몰",
      sentiment: "positive",
      title: "트로이아르케 악센 UV 선에센스 공식몰 사용후기 759건 노출",
      text: "공식몰 메인에 1+1 프로모션과 함께 리뷰 수가 직접 노출되어 있습니다. 브랜드 신뢰 요소로 활용 가치가 높습니다.",
      author: "트로이아르케 공식몰",
      date: "2026-04-08 확인",
      tags: ["공식몰", "리뷰수", "선케어"],
      sourceUrl: "https://www.troiareuke.co.kr/"
    },
    {
      channel: "뉴스",
      sentiment: "positive",
      title: "트로이아르케 톤업 라인 네이버 쇼핑 인기순·구매순 1위 기사",
      text: "2026년 3월 6일 기사 기준, 톤업 라인이 네이버 쇼핑 톤업크림 카테고리에서 인기순과 구매순 1위를 기록했다고 보도됐습니다.",
      author: "대학저널",
      date: "2026-03-06",
      tags: ["네이버쇼핑", "톤업크림", "1위"],
      sourceUrl: "https://dhnews.co.kr/news/view/1065575445516370"
    },
    {
      channel: "리뷰",
      sentiment: "neutral",
      title: "달바 화이트 트러플 바이탈 스프레이 세럼 화해 평점 4.36, 리뷰 318개",
      text: "좋아요 키워드는 보습, 수분, 향 만족이 강하고, 아쉬워요 키워드에는 알러지반응 11건과 따가움 10건이 노출됩니다.",
      author: "화해",
      date: "2026-03 확인",
      tags: ["달바", "화해", "리뷰318"],
      sourceUrl: "https://www.hwahae.co.kr/products/%EB%8B%AC%EB%B0%94-%ED%99%94%EC%9D%B4%ED%8A%B8-%ED%8A%B8%EB%9F%AC%ED%94%8C-%EB%B0%94%EC%9D%B4%ED%83%88-%EC%8A%A4%ED%94%84%EB%A0%88%EC%9D%B4-%EC%84%B8%EB%9F%BC/2008792"
    },
    {
      channel: "뉴스",
      sentiment: "positive",
      title: "닥터멜락신 칼슘 라인 2026년 3월 월매출 250억원 기사",
      text: "해외 매출 비중이 97% 이상이라는 설명과 함께, 글로벌 고기능성 더마 시장 확장 모멘텀이 강조됩니다.",
      author: "아시아투데이 / 네이트뉴스",
      date: "2026-04-10",
      tags: ["닥터멜락신", "월매출250억", "글로벌"],
      sourceUrl: "https://m.news.nate.com/view/20260410n10921"
    },
    {
      channel: "뉴스",
      sentiment: "positive",
      title: "톰프로그램 G필 12주 플랜, 카카오톡 선물하기 전체 카테고리 1위 기사",
      text: "화이트데이 프로모션 기사에서 지난해 9월 카카오톡 선물하기 입점 직후 전체 카테고리 1위를 기록했다고 언급됩니다.",
      author: "뉴스핌",
      date: "2025-03-13",
      tags: ["톰프로그램", "카카오선물하기", "1위"],
      sourceUrl: "https://www.newspim.com/news/view/20250313000755"
    },
    {
      channel: "뉴스",
      sentiment: "positive",
      title: "메디테라피 포쎄라 블러크림 글로벌 누적 판매량 96만개 기사",
      text: "셀럽 노출과 함께 출시 1년 만에 글로벌 누적 판매량 96만 개를 돌파했다고 보도됐습니다.",
      author: "스포츠월드",
      date: "2025-08-26",
      tags: ["메디테라피", "96만개", "블러크림"],
      sourceUrl: "https://www.sportsworldi.com/newsView/20250826507657"
    },
    {
      channel: "플랫폼",
      sentiment: "neutral",
      title: "파메스테틱 스타터팩 공개 판매가 217,800원과 구성 제품 노출",
      text: "클렌저, 젤 토너, 시트 등 입문 패키지 구성이 공개되어 있고, 공식 프로모션형 판매 구조가 확인됩니다.",
      author: "파메스테틱",
      date: "2025-07 확인",
      tags: ["파메스테틱", "스타터팩", "217800원"],
      sourceUrl: "https://pharmer.pharmesthetic.com/ko/articles/%ED%8C%8C%EB%A9%94%EC%8A%A4%ED%85%8C%ED%8B%B1-%EC%8A%A4%ED%83%80%ED%84%B0%ED%8C%A9-f1a1154d"
    }
  ]
};

const heroMetricGrid = document.getElementById("heroMetricGrid");
const modeFilters = document.getElementById("modeFilters");
const channelFilters = document.getElementById("channelFilters");
const competitorPills = document.getElementById("competitorPills");
const dateRangeLabel = document.getElementById("dateRangeLabel");
const statGrid = document.getElementById("statGrid");
const trendChart = document.getElementById("trendChart");
const searchGrid = document.getElementById("searchGrid");
const sentimentBars = document.getElementById("sentimentBars");
const keywordCloud = document.getElementById("keywordCloud");
const competitorTable = document.getElementById("competitorTable");
const issueList = document.getElementById("issueList");
const playbookList = document.getElementById("playbookList");
const mentionsList = document.getElementById("mentionsList");
const dataModeLabel = document.getElementById("dataModeLabel");
const dataStatusText = document.getElementById("dataStatusText");
const startDateInput = document.getElementById("startDate");
const endDateInput = document.getElementById("endDate");
const applyDateButton = document.getElementById("applyDateButton");

async function fetchDashboardData(start, end) {
  if (state.mode === "실시간 연동" && LIVE_API_CONFIG.enabled) {
    const query = new URLSearchParams({ start, end });
    const response = await fetch(`${LIVE_API_CONFIG.endpoint}?${query.toString()}`);
    if (!response.ok) {
      throw new Error("실시간 API 요청에 실패했습니다.");
    }
    return response.json();
  }

  return SNAPSHOT_DATA;
}

function renderFilterChips(container, items, activeValue, onClick) {
  container.innerHTML = "";
  items.forEach((item) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `filter-chip${item === activeValue ? " is-active" : ""}`;
    button.textContent = item;
    button.addEventListener("click", () => onClick(item));
    container.appendChild(button);
  });
}

function renderCompetitorPills() {
  competitorPills.innerHTML = COMPETITORS
    .map((brand) => `<span class="brand-pill">${brand}</span>`)
    .join("");
}

function buildSourceLink(label, url) {
  if (!url) {
    return "";
  }
  return `<a class="source-link" href="${url}" target="_blank" rel="noopener noreferrer">${label}</a>`;
}

function renderHeroMetrics(data) {
  heroMetricGrid.innerHTML = data.heroMetrics
    .map((item) => `
      <article class="hero-metric-card">
        <p>${item.label}</p>
        <strong>${item.value}</strong>
        <span>${item.note}</span>
        ${buildSourceLink(item.sourceLabel, item.sourceUrl)}
      </article>
    `)
    .join("");
}

function renderOverview(data) {
  dateRangeLabel.textContent = `실제 공개 스냅샷 기준일: ${data.snapshotDate}`;
  statGrid.innerHTML = data.overview
    .map((item) => `
      <article class="stat-card">
        <p class="meta-line">${item.label}</p>
        <strong>${item.value}</strong>
        <span class="delta ${item.direction}">${item.delta}</span>
        <p class="meta-line">${item.note}</p>
        ${buildSourceLink(item.sourceLabel, item.sourceUrl)}
      </article>
    `)
    .join("");
}

function buildChartPath(values, width, height, padding) {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const graphWidth = width - padding * 2;
  const graphHeight = height - padding * 2;

  return values
    .map((value, index) => {
      const x = padding + (graphWidth / Math.max(values.length - 1, 1)) * index;
      const normalized = (value - min) / Math.max(max - min, 1);
      const y = height - padding - normalized * graphHeight;
      return `${index === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");
}

function renderTrendChart(data) {
  const { labels, totalMentions, naverSearch, googleSearch } = data.trends;
  const width = 720;
  const height = 320;
  const padding = 36;

  const labelMarkup = labels
    .map((label, index) => {
      const x = padding + ((width - padding * 2) / Math.max(labels.length - 1, 1)) * index;
      return `<text x="${x}" y="${height - 10}" text-anchor="middle" fill="#60665e" font-size="12">${label}</text>`;
    })
    .join("");

  const gridMarkup = [0, 1, 2, 3]
    .map((step) => {
      const y = padding + ((height - padding * 2) / 3) * step;
      return `<line x1="${padding}" y1="${y}" x2="${width - padding}" y2="${y}" stroke="rgba(31,35,32,0.08)" stroke-width="1" />`;
    })
    .join("");

  trendChart.innerHTML = `
    <rect x="0" y="0" width="${width}" height="${height}" rx="24" fill="transparent"></rect>
    ${gridMarkup}
    <path d="${buildChartPath(totalMentions, width, height, padding)}" fill="none" stroke="#b45a2a" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"></path>
    <path d="${buildChartPath(naverSearch, width, height, padding)}" fill="none" stroke="#63725f" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="10 8"></path>
    <path d="${buildChartPath(googleSearch, width, height, padding)}" fill="none" stroke="#6986b8" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="4 8"></path>
    ${labelMarkup}
  `;
}

function renderSearchSummary(data) {
  searchGrid.innerHTML = data.searchSummary
    .map((item) => `
      <article class="search-card">
        <p>${item.label}</p>
        <strong>${item.value}</strong>
        <span>${item.note}</span>
        ${buildSourceLink(item.sourceLabel, item.sourceUrl)}
      </article>
    `)
    .join("");
}

function renderSentiment(data) {
  const labels = {
    positive: "긍정",
    neutral: "중립",
    negative: "부정"
  };

  sentimentBars.innerHTML = Object.entries(data.sentiment)
    .map(([key, value]) => `
      <div class="sentiment-row">
        <span>${labels[key]}</span>
        <div class="sentiment-track">
          <div class="sentiment-fill ${key}" style="width:${value}%"></div>
        </div>
        <strong>${value}%</strong>
      </div>
    `)
    .join("");
}

function renderKeywords(data) {
  keywordCloud.innerHTML = data.keywords
    .map((item) => `
      <article class="keyword-pill">
        <strong>${item.label}</strong>
        <span>${item.delta}</span>
      </article>
    `)
    .join("");
}

function renderCompetitors(data) {
  competitorTable.innerHTML = data.competitors
    .map((item) => `
      <tr>
        <td><strong>${item.name}</strong></td>
        <td>${item.share}</td>
        <td>${item.sentiment}</td>
        <td><a class="table-badge source-link-inline" href="${item.sourceUrl}" target="_blank" rel="noopener noreferrer">${item.momentum}</a></td>
      </tr>
    `)
    .join("");
}

function renderIssues(data) {
  issueList.innerHTML = data.issues
    .map((item) => `
      <article class="issue-card">
        <div class="issue-meta">
          <span class="priority-badge ${item.priority}">${item.priority.toUpperCase()}</span>
          <span class="channel-badge">${item.channel}</span>
        </div>
        <strong>${item.title}</strong>
        <p class="action-copy">${item.copy}</p>
        ${buildSourceLink(item.sourceLabel, item.sourceUrl)}
      </article>
    `)
    .join("");
}

function renderPlaybooks(data) {
  playbookList.innerHTML = data.playbooks
    .map((item) => `
      <article class="playbook-card">
        <strong>${item.title}</strong>
        <p class="action-copy">${item.copy}</p>
      </article>
    `)
    .join("");
}

function renderMentions(data) {
  if (!data) {
    return;
  }

  const items = state.channel === "전체"
    ? data.mentions
    : data.mentions.filter((item) => item.channel === state.channel);

  mentionsList.innerHTML = items
    .map((item) => `
      <article class="mention-card">
        <div class="mention-meta">
          <span class="channel-badge">${item.channel}</span>
          <span class="sentiment-badge ${item.sentiment}">${item.sentiment === "positive" ? "긍정" : item.sentiment === "neutral" ? "중립" : "부정"}</span>
        </div>
        <div class="mention-headline">${item.title}</div>
        <p class="mention-text">${item.text}</p>
        <div class="tag-row">${item.tags.map((tag) => `<span class="tag-pill">#${tag}</span>`).join("")}</div>
        <div class="mention-footer">
          <span>${item.author}</span>
          <span>${item.date}</span>
        </div>
        <a class="source-link" href="${item.sourceUrl}" target="_blank" rel="noopener noreferrer">출처 보기</a>
      </article>
    `)
    .join("");
}

function updateStatus(success) {
  const isLiveMode = state.mode === "실시간 연동";
  dataModeLabel.textContent = isLiveMode ? "실시간 연동 모드" : "실제 공개 스냅샷 모드";

  if (!isLiveMode) {
    dataStatusText.textContent = "2026-04-14 기준 공개 출처를 수집해 정리한 실제 스냅샷입니다.";
    return;
  }

  dataStatusText.textContent = LIVE_API_CONFIG.enabled && success
    ? "실시간 API 응답으로 데이터를 불러오는 중입니다."
    : "실시간 구조는 준비되어 있지만 API는 아직 연결되지 않았습니다.";
}

async function loadDashboard() {
  try {
    const data = await fetchDashboardData(state.startDate, state.endDate);
    state.dataset = data;
    renderHeroMetrics(data);
    renderOverview(data);
    renderTrendChart(data);
    renderSearchSummary(data);
    renderSentiment(data);
    renderKeywords(data);
    renderCompetitors(data);
    renderIssues(data);
    renderPlaybooks(data);
    renderMentions(data);
    updateStatus(true);
  } catch (error) {
    state.dataset = SNAPSHOT_DATA;
    renderHeroMetrics(SNAPSHOT_DATA);
    renderOverview(SNAPSHOT_DATA);
    renderTrendChart(SNAPSHOT_DATA);
    renderSearchSummary(SNAPSHOT_DATA);
    renderSentiment(SNAPSHOT_DATA);
    renderKeywords(SNAPSHOT_DATA);
    renderCompetitors(SNAPSHOT_DATA);
    renderIssues(SNAPSHOT_DATA);
    renderPlaybooks(SNAPSHOT_DATA);
    renderMentions(SNAPSHOT_DATA);
    updateStatus(false);
  }
}

function syncInputs() {
  startDateInput.value = state.startDate;
  endDateInput.value = state.endDate;
}

function renderModeFilters() {
  renderFilterChips(modeFilters, MODE_OPTIONS, state.mode, (value) => {
    state.mode = value;
    renderModeFilters();
    loadDashboard();
  });
}

function renderChannelFilters() {
  renderFilterChips(channelFilters, CHANNEL_OPTIONS, state.channel, (value) => {
    state.channel = value;
    renderChannelFilters();
    renderMentions(state.dataset);
  });
}

function initializeInteractions() {
  syncInputs();
  renderCompetitorPills();
  renderModeFilters();
  renderChannelFilters();

  applyDateButton.addEventListener("click", () => {
    if (!startDateInput.value || !endDateInput.value) {
      return;
    }

    if (startDateInput.value > endDateInput.value) {
      window.alert("시작일은 종료일보다 늦을 수 없습니다.");
      return;
    }

    state.startDate = startDateInput.value;
    state.endDate = endDateInput.value;

    if (state.mode === "실제 공개 스냅샷") {
      window.alert("현재 모드는 실제 공개 스냅샷 모드입니다. 선택 기간별 실제 재집계는 실시간 API 연결 후 사용할 수 있습니다.");
    }

    loadDashboard();
  });

  document.querySelectorAll("[data-scroll-target]").forEach((button) => {
    button.addEventListener("click", () => {
      const target = document.querySelector(button.dataset.scrollTarget);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });
}

initializeInteractions();
loadDashboard();
