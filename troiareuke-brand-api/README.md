# 트로이아르케 실시간 API

## 목적

이 API는 GitHub Pages로 배포한 대시보드에 실제 데이터를 내려주기 위한 백엔드입니다.

수집 대상:

- 네이버 검색량: DataLab 검색어 트렌드 API
- 네이버 멘션: 뉴스, 블로그, 카페글 검색 API
- 구글 검색량: pytrends 시도, 실패 시 공식 Google Trends 비교 링크 제공

## 준비

1. 네이버 개발자 센터에서 앱 생성
2. 검색 API와 DataLab 검색어 트렌드 API 사용 신청
3. `.env.example`을 복사해서 `.env` 생성

필수 환경 변수:

- `NAVER_CLIENT_ID`
- `NAVER_CLIENT_SECRET`

## 설치

```powershell
cd troiareuke-brand-api
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

## 실행

```powershell
python app.py
```

## 엔드포인트

헬스체크:

```txt
GET /api/health
```

대시보드:

```txt
GET /api/dashboard?start=2026-03-16&end=2026-04-14
```

## 프론트 연결

`troiareuke-brand-dashboard/app.js`

```js
const LIVE_API_CONFIG = {
  enabled: true,
  endpoint: "http://localhost:8000/api/dashboard"
};
```

GitHub Pages에 배포할 때는 `endpoint`를 실제 배포된 API 주소로 바꾸면 됩니다.

## 응답 구조

- `heroMetrics`
- `overview`
- `searchSummary`
- `sentiment`
- `trends`
- `keywords`
- `competitors`
- `issues`
- `playbooks`
- `mentions`

## 배포 추천

- 프론트: GitHub Pages
- API: Render, Railway, Fly.io, Cloud Run 중 택 1
