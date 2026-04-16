from __future__ import annotations

import html
import os
import re
from datetime import datetime
from typing import Any, Dict, List
from urllib.parse import quote

import requests
from dotenv import load_dotenv
from flask import Flask, jsonify, request

try:
    from pytrends.request import TrendReq
except Exception:  # pragma: no cover - optional dependency fallback
    TrendReq = None


load_dotenv()

app = Flask(__name__)

BRANDS = [
    {"name": "TROIAREUKE", "query": "트로이아르케 OR TROIAREUKE"},
    {"name": "달바", "query": "달바 OR d'Alba"},
    {"name": "닥터멜락신", "query": "닥터멜락신 OR Dr.Melaxin"},
    {"name": "톰프로그램", "query": "톰프로그램 OR TOM PROGRAM"},
    {"name": "메디테라피", "query": "메디테라피 OR Meditherapy"},
    {"name": "파메스테틱", "query": "파메스테틱 OR Pharmesthetic"},
]

NEGATIVE_HINTS = [
    "자극", "따가", "트러블", "붉", "건조", "반품", "별로", "악화", "부작용",
    "irritation", "dry", "return", "problem", "bad",
]
POSITIVE_HINTS = [
    "추천", "좋", "만족", "재구매", "인기", "1위", "호평", "베스트", "출시", "기록",
    "recommend", "best", "popular", "good", "sold out",
]

NAVER_SEARCH_BASE = "https://openapi.naver.com/v1/search"
NAVER_DATALAB_BASE = "https://openapi.naver.com/v1/datalab/search"


def strip_html(raw: str) -> str:
    cleaned = re.sub(r"<[^>]+>", "", raw or "")
    return html.unescape(cleaned).strip()


def parse_date(raw: str | None) -> str:
    if not raw:
        return ""

    raw = raw.strip()
    for fmt in ("%a, %d %b %Y %H:%M:%S %z", "%Y%m%d"):
        try:
            return datetime.strptime(raw, fmt).strftime("%Y-%m-%d")
        except ValueError:
            continue
    return raw


def score_sentiment(text: str) -> str:
    lowered = text.lower()
    negative_score = sum(keyword in lowered for keyword in NEGATIVE_HINTS)
    positive_score = sum(keyword in lowered for keyword in POSITIVE_HINTS)

    if negative_score > positive_score:
        return "negative"
    if positive_score > negative_score:
        return "positive"
    return "neutral"


class NaverClient:
    def __init__(self, client_id: str, client_secret: str) -> None:
        self.client_id = client_id
        self.client_secret = client_secret

    @property
    def is_configured(self) -> bool:
        return bool(self.client_id and self.client_secret)

    @property
    def headers(self) -> Dict[str, str]:
        return {
            "X-Naver-Client-Id": self.client_id,
            "X-Naver-Client-Secret": self.client_secret,
        }

    def search(self, endpoint: str, query: str, display: int = 10, sort: str = "date") -> Dict[str, Any]:
        response = requests.get(
            f"{NAVER_SEARCH_BASE}/{endpoint}.json",
            params={"query": query, "display": display, "sort": sort},
            headers=self.headers,
            timeout=20,
        )
        response.raise_for_status()
        return response.json()

    def datalab_trends(self, keywords: List[str], start_date: str, end_date: str) -> Dict[str, Any]:
        keyword_groups = [{"groupName": keyword, "keywords": [keyword]} for keyword in keywords]
        payload = {
            "startDate": start_date,
            "endDate": end_date,
            "timeUnit": "date",
            "keywordGroups": keyword_groups,
        }
        response = requests.post(
            NAVER_DATALAB_BASE,
            json=payload,
            headers=self.headers,
            timeout=20,
        )
        response.raise_for_status()
        return response.json()


def build_google_trends_link(keywords: List[str], start_date: str, end_date: str) -> str:
    joined = ",".join(quote(keyword) for keyword in keywords)
    date_part = quote(f"{start_date} {end_date}")
    return (
        "https://trends.google.com/trends/explore"
        f"?date={date_part}&geo=KR&q={joined}"
    )


def fetch_google_trends_series(keywords: List[str], start_date: str, end_date: str) -> Dict[str, List[int]]:
    if TrendReq is None:
        return {"labels": [], "values": []}

    pytrends = TrendReq(hl="ko-KR", tz=540)
    timeframe = f"{start_date} {end_date}"
    pytrends.build_payload(keywords, timeframe=timeframe, geo=os.getenv("GOOGLE_TRENDS_GEO", "KR"))
    frame = pytrends.interest_over_time()

    if frame.empty:
        return {"labels": [], "values": []}

    labels = [index.strftime("%Y-%m-%d") for index in frame.index]
    values = []
    for keyword in keywords:
        series = frame[keyword].fillna(0).astype(int).tolist()
        values.append(series)

    return {"labels": labels, "values": values}


def build_mentions_from_search(brand_name: str, search_payload: Dict[str, Any], channel_name: str) -> List[Dict[str, Any]]:
    mentions: List[Dict[str, Any]] = []
    for item in search_payload.get("items", [])[:3]:
        title = strip_html(item.get("title", ""))
        description = strip_html(item.get("description", ""))
        combined = f"{title} {description}"
        mentions.append(
            {
                "channel": channel_name,
                "sentiment": score_sentiment(combined),
                "title": f"{brand_name}: {title}",
                "text": description or "요약 정보 없음",
                "author": strip_html(item.get("bloggername") or item.get("originallink") or channel_name),
                "date": parse_date(item.get("postdate") or item.get("pubDate")),
                "tags": [brand_name, channel_name],
                "sourceUrl": item.get("link") or item.get("originallink") or "",
            }
        )
    return mentions


def build_dashboard_data(start_date: str, end_date: str) -> Dict[str, Any]:
    naver = NaverClient(
        client_id=os.getenv("NAVER_CLIENT_ID", ""),
        client_secret=os.getenv("NAVER_CLIENT_SECRET", ""),
    )

    snapshot_date = datetime.now().strftime("%Y-%m-%d")
    google_link = build_google_trends_link([brand["name"] for brand in BRANDS], start_date, end_date)

    if not naver.is_configured:
        return {
            "snapshotDate": snapshot_date,
            "heroMetrics": [
                {
                    "label": "네이버 API 상태",
                    "value": "미설정",
                    "note": "NAVER_CLIENT_ID / NAVER_CLIENT_SECRET 환경 변수가 필요합니다.",
                    "sourceLabel": "Naver Developers",
                    "sourceUrl": "https://developers.naver.com/docs/serviceapi/datalab/search/search.md",
                },
                {
                    "label": "구글 트렌드 비교",
                    "value": "링크 제공",
                    "note": "Google Trends 비교 링크로 실제 트렌드를 열 수 있습니다.",
                    "sourceLabel": "Google Trends",
                    "sourceUrl": google_link,
                },
                {
                    "label": "현재 응답",
                    "value": "설정 가이드",
                    "note": "API 키를 넣으면 실제 데이터를 반환합니다.",
                    "sourceLabel": "백엔드 README",
                    "sourceUrl": "",
                },
            ],
            "overview": [],
            "searchSummary": [
                {
                    "label": "네이버 DataLab",
                    "value": "연결 필요",
                    "note": "실제 기간별 검색량은 DataLab API 연결 후 집계됩니다.",
                    "sourceLabel": "Naver Developers",
                    "sourceUrl": "https://developers.naver.com/docs/serviceapi/datalab/search/search.md",
                },
                {
                    "label": "구글 트렌드",
                    "value": "링크 열기",
                    "note": "공식 비교 화면으로 이동해 실제 비교가 가능합니다.",
                    "sourceLabel": "Google Trends",
                    "sourceUrl": google_link,
                },
            ],
            "sentiment": {"positive": 0, "neutral": 100, "negative": 0},
            "trends": {"labels": [], "totalMentions": [], "naverSearch": [], "googleSearch": []},
            "keywords": [],
            "competitors": [],
            "issues": [],
            "playbooks": [
                {
                    "title": "네이버 API 키 연결",
                    "copy": "환경 변수 설정 후 `/api/dashboard`를 호출하면 실제 데이터가 내려옵니다.",
                }
            ],
            "mentions": [],
        }

    blog_totals: Dict[str, int] = {}
    news_totals: Dict[str, int] = {}
    cafe_totals: Dict[str, int] = {}
    mentions: List[Dict[str, Any]] = []

    for brand in BRANDS:
        query = brand["query"]
        blog_result = naver.search("blog", query, display=6)
        news_result = naver.search("news", query, display=6)
        cafe_result = naver.search("cafearticle", query, display=6)

        blog_totals[brand["name"]] = int(blog_result.get("total", 0))
        news_totals[brand["name"]] = int(news_result.get("total", 0))
        cafe_totals[brand["name"]] = int(cafe_result.get("total", 0))

        mentions.extend(build_mentions_from_search(brand["name"], news_result, "뉴스"))
        mentions.extend(build_mentions_from_search(brand["name"], blog_result, "네이버 블로그"))
        mentions.extend(build_mentions_from_search(brand["name"], cafe_result, "커뮤니티"))

    keyword_names = [brand["name"] for brand in BRANDS]
    naver_trends = naver.datalab_trends(keyword_names, start_date, end_date)
    google_trends = fetch_google_trends_series(keyword_names, start_date, end_date)

    total_by_brand = {
        brand["name"]: blog_totals[brand["name"]] + news_totals[brand["name"]] + cafe_totals[brand["name"]]
        for brand in BRANDS
    }
    grand_total = sum(total_by_brand.values()) or 1

    trend_lookup = {result["title"]: result["data"] for result in naver_trends.get("results", [])}
    naver_latest = {
        name: (trend_lookup.get(name, [{"ratio": 0}])[-1]["ratio"] if trend_lookup.get(name) else 0)
        for name in keyword_names
    }

    google_latest = {}
    if google_trends["labels"]:
        for index, name in enumerate(keyword_names):
            google_latest[name] = google_trends["values"][index][-1]
    else:
        for name in keyword_names:
            google_latest[name] = 0

    competitor_rows = []
    for name in keyword_names:
        competitor_rows.append(
            {
                "name": name,
                "share": f"{(total_by_brand[name] / grand_total) * 100:.1f}%",
                "sentiment": "긍정 우세" if google_latest[name] >= 50 or naver_latest[name] >= 50 else "중립 혼재",
                "momentum": f"네이버 {naver_latest[name]:.1f} / 구글 {google_latest[name]}",
                "sourceUrl": google_link,
            }
        )

    positive_count = sum(1 for item in mentions if item["sentiment"] == "positive")
    negative_count = sum(1 for item in mentions if item["sentiment"] == "negative")
    neutral_count = max(0, len(mentions) - positive_count - negative_count)
    mention_count = max(1, len(mentions))

    labels = []
    total_series = []
    naver_series = []
    google_series = []

    if naver_trends.get("results"):
        labels = [row["period"] for row in naver_trends["results"][0]["data"]]
        troiareuke_name = keyword_names[0]
        naver_series = [int(row["ratio"]) for row in trend_lookup.get(troiareuke_name, [])]
        total_series = [total_by_brand[troiareuke_name]] * len(labels)
        google_series = google_trends["values"][0] if google_trends["values"] else [0] * len(labels)

    issues = []
    negative_mentions = [item for item in mentions if item["sentiment"] == "negative"][:3]
    for item in negative_mentions:
        issues.append(
            {
                "priority": "high",
                "channel": item["channel"],
                "title": item["title"],
                "copy": item["text"],
                "sourceLabel": "원문 보기",
                "sourceUrl": item["sourceUrl"],
            }
        )

    if not issues:
        issues.append(
            {
                "priority": "medium",
                "channel": "검색",
                "title": "부정 키워드 급증은 아직 뚜렷하지 않음",
                "copy": "실시간 운영 시에는 특정 임계치 이상일 때만 경고를 띄우도록 설정하는 것이 좋습니다.",
                "sourceLabel": "Google Trends",
                "sourceUrl": google_link,
            }
        )

    top_mentions = sorted(mentions, key=lambda item: item["date"], reverse=True)[:12]

    return {
        "snapshotDate": snapshot_date,
        "heroMetrics": [
            {
                "label": "총 수집 멘션",
                "value": f"{sum(total_by_brand.values()):,}건",
                "note": "네이버 뉴스, 블로그, 카페글 검색 API 합산",
                "sourceLabel": "Naver Search API",
                "sourceUrl": "https://developers.naver.com/products/service-api/search/search.md",
            },
            {
                "label": "트로이아르케 네이버 검색지수",
                "value": f"{naver_latest['TROIAREUKE']:.1f}",
                "note": f"{start_date} ~ {end_date} DataLab 기준 최신 지수",
                "sourceLabel": "Naver DataLab",
                "sourceUrl": "https://developers.naver.com/docs/serviceapi/datalab/search/search.md",
            },
            {
                "label": "구글 트렌드 비교",
                "value": "실제 비교 링크",
                "note": "공식 Google Trends 비교 화면으로 열기",
                "sourceLabel": "Google Trends",
                "sourceUrl": google_link,
            },
        ],
        "overview": [
            {
                "label": "트로이아르케 점유 멘션",
                "value": f"{(total_by_brand['TROIAREUKE'] / grand_total) * 100:.1f}%",
                "delta": f"{total_by_brand['TROIAREUKE']:,}건",
                "direction": "up",
                "note": "지정 경쟁사 대비 네이버 검색 결과 점유 비중",
                "sourceLabel": "Naver Search API",
                "sourceUrl": "https://developers.naver.com/products/service-api/search/search.md",
            },
            {
                "label": "트로이아르케 블로그 언급",
                "value": f"{blog_totals['TROIAREUKE']:,}건",
                "delta": f"뉴스 {news_totals['TROIAREUKE']:,}건",
                "direction": "up",
                "note": "블로그와 뉴스 언급량을 분리해서 확인",
                "sourceLabel": "Naver Blog API",
                "sourceUrl": "https://developers.naver.com/docs/serviceapi/search/blog/blog.md",
            },
            {
                "label": "트로이아르케 카페 언급",
                "value": f"{cafe_totals['TROIAREUKE']:,}건",
                "delta": f"DataLab {naver_latest['TROIAREUKE']:.1f}",
                "direction": "up",
                "note": "커뮤니티 반응과 검색 관심도를 함께 봄",
                "sourceLabel": "Naver Cafe API",
                "sourceUrl": "https://developers.naver.com/docs/serviceapi/search/cafearticle/cafearticle.md",
            },
            {
                "label": "구글 트렌드 최신값",
                "value": str(google_latest['TROIAREUKE']),
                "delta": "상대 지수",
                "direction": "up",
                "note": "pytrends 수집 성공 시 실제 값, 실패 시 0으로 표시",
                "sourceLabel": "Google Trends",
                "sourceUrl": google_link,
            },
        ],
        "searchSummary": [
            {
                "label": "네이버 최신 검색지수",
                "value": f"{naver_latest['TROIAREUKE']:.1f}",
                "note": "트로이아르케 기준",
                "sourceLabel": "Naver DataLab",
                "sourceUrl": "https://developers.naver.com/docs/serviceapi/datalab/search/search.md",
            },
            {
                "label": "구글 최신 검색지수",
                "value": str(google_latest["TROIAREUKE"]),
                "note": "pytrends 수집 성공 시 실제 상대값",
                "sourceLabel": "Google Trends",
                "sourceUrl": google_link,
            },
            {
                "label": "구글 비교 링크",
                "value": "바로 열기",
                "note": "브랜드 6개를 한 번에 비교하는 공식 링크",
                "sourceLabel": "Google Trends",
                "sourceUrl": google_link,
            },
        ],
        "sentiment": {
            "positive": round((positive_count / mention_count) * 100),
            "neutral": round((neutral_count / mention_count) * 100),
            "negative": round((negative_count / mention_count) * 100),
        },
        "trends": {
            "labels": labels,
            "totalMentions": total_series,
            "naverSearch": naver_series,
            "googleSearch": google_series,
        },
        "keywords": [
            {"label": "네이버 뉴스", "delta": f"{sum(news_totals.values()):,}건"},
            {"label": "네이버 블로그", "delta": f"{sum(blog_totals.values()):,}건"},
            {"label": "네이버 카페글", "delta": f"{sum(cafe_totals.values()):,}건"},
            {"label": "구글 트렌드", "delta": "공식 비교 링크 지원"},
            {"label": "트로이아르케", "delta": f"검색지수 {naver_latest['TROIAREUKE']:.1f}"},
        ],
        "competitors": competitor_rows,
        "issues": issues,
        "playbooks": [
            {
                "title": "네이버 검색과 멘션을 매일 집계",
                "copy": "GitHub Pages는 화면만 담당하고 이 API를 주기적으로 호출해 최신 스냅샷을 캐시하면 운영 효율이 높아집니다.",
            },
            {
                "title": "구글 트렌드는 링크와 pytrends를 함께 사용",
                "copy": "공식 비교 링크를 바로 보여주고, pytrends 성공 시 대시보드에 상대 지수까지 표시하도록 구성했습니다.",
            },
            {
                "title": "부정 키워드 감지 기준을 분리 운영",
                "copy": "자극, 따가움, 반품, 별로 같은 키워드가 붙은 멘션만 이슈 보드에 우선 노출되도록 설계했습니다.",
            },
        ],
        "mentions": top_mentions,
    }


@app.after_request
def apply_cors_headers(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type"
    response.headers["Access-Control-Allow-Methods"] = "GET,OPTIONS"
    return response


@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "timestamp": datetime.now().isoformat()})


@app.route("/api/dashboard", methods=["GET"])
def dashboard():
    start_date = request.args.get("start", datetime.now().strftime("%Y-%m-01"))
    end_date = request.args.get("end", datetime.now().strftime("%Y-%m-%d"))
    data = build_dashboard_data(start_date, end_date)
    return jsonify(data)


if __name__ == "__main__":
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", "8000"))
    app.run(host=host, port=port, debug=True)
