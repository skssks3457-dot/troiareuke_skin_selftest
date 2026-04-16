# GitHub Pages 배포 방법

## 바로 배포하는 가장 쉬운 방법

이 폴더 안 파일만 새 GitHub 저장소에 올리면 됩니다.

업로드할 파일:

- `index.html`
- `styles.css`
- `app.js`
- `troiareuke-logo.png`
- `.nojekyll`

## GitHub에서 설정할 것

1. 새 저장소 생성
2. 위 파일 업로드
3. 저장소 `Settings`
4. `Pages` 메뉴 진입
5. `Deploy from a branch` 선택
6. Branch를 `main`으로 선택
7. Folder를 `/ (root)`로 선택
8. 저장

## 배포 주소 형태

```txt
https://계정명.github.io/저장소명/
```

## 현재 가능한 것

- 화면 배포
- 기간 필터 사용
- 차트 확인
- 경쟁사 비교
- 샘플 데이터 기반 데모 운영

## 실시간 연동 시 수정할 곳

`app.js`에서 아래 2개를 바꾸면 됩니다.

```js
const LIVE_API_CONFIG = {
  enabled: true,
  endpoint: "https://your-api-domain.com/api/dashboard"
};
```

## 추천 순서

1. 먼저 GitHub Pages로 화면 배포
2. 화면 확인
3. 그 다음 실시간 API 연결

이 순서가 가장 빠르고 안전합니다.
