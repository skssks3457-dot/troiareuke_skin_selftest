# ECOUNT 매출 대시보드 자동화

## 목표

- 매일 오후 4시에 이카운트 ERP 매출 데이터를 외부 대시보드에 최신 반영한다.
- 운영 부담이 적은 `ECOUNT API -> Google Sheets -> Looker Studio` 구조로 시작한다.
- 대표용 KPI와 실무용 상세 분석을 같은 원본 데이터에서 관리한다.

## 구조

1. `ECOUNT API`
   - 당일 매출, 취소, 반품, 수정 전표 조회
2. `Google Apps Script`
   - 매일 16:00 자동 실행
   - 필요 시 16:10 보정 실행
   - 전표번호 기준 업서트
3. `Google Sheets`
   - `raw_sales`: 원본 적재
   - `dashboard_base`: 대시보드용 가공
   - `config`: 설정값
4. `Looker Studio`
   - `dashboard_base` 연결
   - 대표용 / 실무용 리포트 분리

## 자동화 기준

- 시간대: `Asia/Seoul`
- 메인 동기화: 매일 `16:00`
- 보정 동기화: 매일 `16:10`
- 조회 범위: 당일 `00:00:00`부터 실행 시점까지
- 반영 기준: 매출 + 취소 + 반품 + 수정 전표
- 중복 처리: `slip_no` 또는 `order_no` 기준 최신값 반영

## 시트 구성

### 1) `config`

아래 키를 A열 `key`, B열 `value`로 저장한다.

| key | value 예시 |
| --- | --- |
| COMPANY_CODE | `YOUR_COMPANY_CODE` |
| API_ID | `YOUR_API_ID` |
| API_SECRET | `YOUR_API_SECRET` |
| BASE_URL | `https://oapi.ecount.com` |
| TOKEN_PATH | `/OAPI/V2/OAuth2/Token` |
| SALES_PATH | `/OAPI/V2/Sales/GetSalesList` |
| TOKEN_FIELD | `access_token` |
| DATA_FIELD | `Data` |
| START_DATE_FIELD | `start_date` |
| END_DATE_FIELD | `end_date` |
| LOOKBACK_DAYS | `0` |
| START_DATE | `2026-04-01` |
| MONTHLY_TARGET | `150000000` |
| LAST_SYNC_AT | `` |

### 2) `raw_sales`

원본 데이터를 그대로 누적/갱신한다.

| 컬럼명 | 설명 |
| --- | --- |
| sale_date | 매출일자 |
| slip_no | 전표번호 |
| order_no | 주문번호 |
| customer_code | 거래처코드 |
| customer_name | 거래처명 |
| item_code | 품목코드 |
| item_name | 품목명 |
| qty | 수량 |
| supply_amount | 공급가 |
| vat_amount | 부가세 |
| total_amount | 합계금액 |
| channel | 채널 |
| sales_rep | 담당자 |
| status | 정상 / 취소 / 반품 |
| updated_at | ERP 수정시각 또는 수집시각 |
| sync_batch_at | 이번 동기화 실행시각 |

### 3) `dashboard_base`

대시보드에서 바로 쓰는 값만 만든다.

| 컬럼명 | 설명 |
| --- | --- |
| sale_date | 매출일자 |
| year_month | `YYYY-MM` |
| channel | 채널 |
| sales_rep | 담당자 |
| customer_name | 거래처명 |
| item_name | 품목명 |
| gross_sales | 총매출 |
| cancel_amount | 취소/반품 금액 |
| final_sales | 최종 반영 매출 |
| qty | 수량 |
| last_sync_at | 최근 동기화 시각 |

### 4) `sync_logs`

| 컬럼명 | 설명 |
| --- | --- |
| run_at | 실행 시각 |
| mode | MAIN / RETRY / BACKFILL |
| status | SUCCESS / FAILED |
| row_count | 수집 건수 |
| message | 실행 로그 |

## 대표용 대시보드 구성

- 오늘 매출
- 이번달 누적 매출
- 목표 달성률
- 전월 동일기간 대비
- 채널별 매출
- 상품별 매출 TOP 10
- 거래처별 매출 TOP 10
- 최근 업데이트 시각

## 실무용 대시보드 구성

- 기간 필터
- 채널 필터
- 담당자 필터
- 거래처 필터
- 품목 필터
- 일별 매출 추이
- 취소/반품 내역
- 거래처별 상세 매출
- 품목별 수량/매출

## 운영 규칙

1. ERP 기준 데이터와 대시보드 숫자가 다르면 `raw_sales`를 먼저 확인한다.
2. 전표 수정이 잦으면 당일만 보지 말고 최근 3일 재조회로 넓힌다.
3. Looker Studio에는 계산 로직을 최소화하고, 가공은 `dashboard_base`에서 끝낸다.
4. 대표 보고 기준 문구는 `최근 업데이트: YYYY-MM-DD HH:mm`로 통일한다.

## 구축 순서

1. 이카운트 API 인증 정보 확보
2. Google Sheets 생성
3. `config`, `raw_sales`, `dashboard_base` 시트 생성
4. `Code.gs`, `appsscript.json` 붙여넣기
5. `initializeProject()` 1회 실행
6. `config` 시트에 API 설정값 입력
7. `syncSalesMain()` 수동 실행 후 데이터 검증
8. `setupDailyTriggers()` 실행
9. Looker Studio 연결

## 바로 실행 체크리스트

- [ ] 이카운트 API 접근 가능 여부 확인
- [ ] 매출 조회 API 엔드포인트 확정
- [ ] `slip_no` 또는 `order_no` 중 중복 기준 확정
- [ ] 채널값 매핑 기준 정리
- [ ] 취소/반품 차감 규칙 확정
- [ ] 오후 4시 / 4시 10분 트리거 등록
- [ ] 대표용 KPI 화면 완성
