# TROIAREUKE Skin Diagnosis Web

트로이아르케 고객용 피부 진단 페이지입니다.

## Public Files

- `index.html`: 고객용 진단 페이지
- `style.css`: 고객용 스타일
- `script.js`: 고객용 인터랙션 및 결과 저장

## Local Run

정적 페이지라서 파일을 바로 열어도 되지만, 로컬 서버로 여는 것을 권장합니다.

예시:

```powershell
python -m http.server 8080
```

그 다음 브라우저에서 아래 주소를 엽니다.

- 고객용: `http://localhost:8080/index.html`

## GitHub Pages

이 프로젝트는 정적 파일만 사용하므로 GitHub Pages에 바로 배포할 수 있습니다.

1. GitHub 저장소 생성
2. 현재 폴더를 push
3. GitHub 저장소의 `Settings > Pages` 진입
4. `Deploy from a branch` 선택
5. 브랜치 `main`과 폴더 `/root` 선택
6. 저장 후 배포 URL 확인

## Local Admin

어드민 파일은 공개 배포 저장소에서 제외하고, 로컬 전용으로 분리해서 사용하는 것을 권장합니다.

주의:

- 현재 고객 진단 결과는 브라우저 `localStorage`에 저장됩니다.
- 따라서 실제 운영 환경에서 다른 고객의 응답을 어드민에서 보려면 추후 백엔드 또는 외부 DB 연동이 필요합니다.
