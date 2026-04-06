# TROIAREUKE Skin Diagnosis Web

트로이아르케 고객용 피부 진단 페이지와 어드민 확인 페이지입니다.

## Files

- `index.html`: 고객용 진단 페이지
- `style.css`: 고객용 스타일
- `script.js`: 고객용 인터랙션 및 결과 저장
- `admin.html`: 어드민 로그인/대시보드 페이지
- `admin-style.css`: 어드민 스타일
- `admin.js`: 어드민 로그인, 응답 조회, 통계, 삭제 기능

## Local Run

정적 페이지라서 파일을 바로 열어도 되지만, 로컬 서버로 여는 것을 권장합니다.

예시:

```powershell
python -m http.server 8080
```

그 다음 브라우저에서 아래 주소를 엽니다.

- 고객용: `http://localhost:8080/index.html`
- 어드민: `http://localhost:8080/admin.html`

## Admin Login

- ID: `troiareuke`
- Password: `!1qazxsw2@`

주의: 현재 로그인 방식은 프론트엔드 기반의 간단한 접근 제한입니다. 공개 배포용 보안 인증으로는 충분하지 않습니다.

## GitHub Pages

이 프로젝트는 정적 파일만 사용하므로 GitHub Pages에 바로 배포할 수 있습니다.

1. GitHub 저장소 생성
2. 현재 폴더를 push
3. GitHub 저장소의 `Settings > Pages` 진입
4. `Deploy from a branch` 선택
5. 브랜치 `main`과 폴더 `/root` 선택
6. 저장 후 배포 URL 확인

## Data Storage

고객 진단 결과는 현재 브라우저 `localStorage`에 저장됩니다.

- 같은 브라우저/기기에서는 어드민 페이지에서 바로 확인 가능
- 다른 팀원과 데이터를 공유하려면 추후 백엔드 또는 외부 DB 연동이 필요
