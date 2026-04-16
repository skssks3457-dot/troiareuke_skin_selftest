# 개발자 전달용 요구사항

## 목적

- 이카운트 ERP 매출 데이터를 Google Sheets로 자동 적재한다.
- Looker Studio에서 대표용 / 실무용 매출 대시보드를 자동 갱신한다.
- 운영 기준 시각은 매일 오후 4시다.

## 필수 요구사항

1. 데이터 소스
   - 이카운트 ERP Open API 사용
   - 매출 관련 전표 또는 매출 집계 데이터를 조회
2. 실행 주기
   - 매일 `16:00` 메인 동기화
   - 매일 `16:10` 보정 동기화
   - 시간대는 `Asia/Seoul`
3. 조회 범위
   - 기본: 당일 `00:00:00 ~ 실행 시점`
   - 수정 전표 반영 필요 시 최근 3일 재조회 가능 구조로 설계
4. 저장 방식
   - Google Sheets `raw_sales` 시트에 원본 적재
   - `slip_no` 우선, 없으면 `order_no` 기준 업서트
5. 가공 방식
   - `dashboard_base` 시트에 대시보드 전용 컬럼 생성
   - 취소/반품은 별도 금액으로 분리하고 최종 매출에 차감 반영
6. 에러 처리
   - API 실패 시 실행 로그 남김
   - 필요 시 관리자 이메일 알림 가능 구조

## 데이터 항목

- sale_date
- slip_no
- order_no
- customer_code
- customer_name
- item_code
- item_name
- qty
- supply_amount
- vat_amount
- total_amount
- channel
- sales_rep
- status
- updated_at
- sync_batch_at

## 비즈니스 규칙

1. 정상 전표
   - `gross_sales = total_amount`
   - `cancel_amount = 0`
   - `final_sales = total_amount`
2. 취소/반품 전표
   - `gross_sales = total_amount`
   - `cancel_amount = total_amount`
   - `final_sales = 0` 또는 음수 처리
   - 최종 처리 방식은 대시보드 합산 로직에 맞춰 고정
3. 최근 업데이트 시각
   - 마지막 성공 동기화 시각을 `config.LAST_SYNC_AT`에 저장
   - `dashboard_base.last_sync_at`에도 동일값 반영

## 품질 기준

1. 동일 전표가 중복 적재되지 않을 것
2. 전표 수정 시 최신값으로 덮어쓸 것
3. 당일 데이터 재실행 시 숫자가 안정적으로 동일할 것
4. Looker Studio에서 별도 계산 없이 주요 지표가 나올 것

## 완료 산출물

1. Google Apps Script 코드
2. Google Sheets 템플릿 구조
3. Apps Script 트리거 설정
4. Looker Studio 연결용 `dashboard_base` 완성
5. 테스트 결과 문서

## 테스트 시나리오

1. 정상 매출 1건 적재 확인
2. 같은 전표 재조회 시 중복 미발생 확인
3. 전표 금액 수정 후 재실행 시 값 업데이트 확인
4. 취소/반품 전표 반영 확인
5. `16:00` / `16:10` 트리거 정상 실행 확인
