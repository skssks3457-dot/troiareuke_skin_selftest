from __future__ import annotations

import argparse
import re
from dataclasses import dataclass
from pathlib import Path

import pandas as pd


def clean_text(value: str) -> str:
    text = str(value or "").strip()
    text = text.replace("™", "").replace("㈜", "")
    text = re.sub(r"\s+", " ", text)
    return text


def detect_pack_count(name: str) -> int:
    text = clean_text(name)
    counts: list[int] = []

    plus = re.search(r"(\d+)\s*\+\s*(\d+)", text)
    if plus:
        counts.append(int(plus.group(1)) + int(plus.group(2)))

    for pattern in [
        r"(\d+)개",
        r"(\d+)세트",
        r"(\d+)SET",
        r"(\d+)ea",
        r"\*(\d+)(?:개|ea|매입)?",
        r"(\d+)매입",
        r"(\d+)회분",
    ]:
        for match in re.finditer(pattern, text, re.IGNORECASE):
            counts.append(int(match.group(1)))

    if counts:
        return max(counts)
    return 1


def classify_line(name: str) -> str:
    text = clean_text(name)

    if text.startswith("[DH]") or "담향" in text:
        return "담향"
    if "(MM)" in text or "밀리맘" in text or "밀리타임" in text:
        return "밀리맘"
    if "(TS)" in text or "서울 " in text:
        return "서울라인"
    if "(AC)" in text or "악센" in text:
        return "악센"
    if any(keyword in text for keyword in ["트로이필", "VVS", "AGT", "GPS", "에스테틱비비크림", "에너지크림", "쉴드크림", "인텐스 UV", "안티링클", "멜라-소닉", "멜라소닉씨인퓨저", "H+ 칵테일", "힐링칵테일", "(TA)", "(TP)"]):
        return "트로이아르케"
    if "(BT)" in text or "쇼핑백" in text or "리프팅컵" in text or "진열대" in text:
        return "부자재/BT"
    if "택배비" in text or "할인" in text:
        return "기타"
    return "기타"


def classify_group(name: str) -> str:
    text = clean_text(name)

    group_rules = [
        ("웨폰키트", "트로이필/웨폰키트"),
        ("트로이필", "트로이필/웨폰키트"),
        ("VVS", "VVS"),
        ("힐링칵테일", "힐링칵테일"),
        ("H+ 칵테일", "힐링칵테일"),
        ("악센 리커버리", "악센 리커버리"),
        ("오일컷클렌징", "악센 오일컷클렌징"),
        ("포어컨트롤마스크", "악센 포어컨트롤마스크"),
        ("퍼플시카마스크", "악센 퍼플시카마스크"),
        ("AC크림", "악센 AC크림"),
        ("AC클리어앰플 키트", "악센 AC클리어앰플 키트"),
        ("AC스팟솔루션", "악센 AC스팟솔루션"),
        ("센 앰플", "악센 센앰플"),
        ("센앰플", "악센 센앰플"),
        ("시카센토너", "악센 시카센토너"),
        ("셀레믹스세럼", "악센 셀레믹스세럼"),
        ("TOC토너", "악센 TOC토너"),
        ("UV프로텍터에센스", "악센 UV프로텍터에센스"),
        ("UV프로텍터 에센스", "악센 UV프로텍터에센스"),
        ("아크소닉", "아크소닉"),
        ("엘디소닉", "엘디소닉"),
        ("멜라소닉", "멜라소닉"),
        ("AI피부진단기", "AI피부진단기"),
        ("AGT하이드로 에센스", "AGT하이드로 에센스"),
        ("AGT 하이드로 에센스", "AGT하이드로 에센스"),
        ("AGT하이드로 크림", "AGT하이드로 크림"),
        ("AGT 하이드로 크림", "AGT하이드로 크림"),
        ("안티링클아이크림", "안티링클아이크림"),
        ("안티링클 콜라겔 아이패치", "안티링클 콜라겔 아이패치"),
        ("쿠션 A+", "트로이아르케 쿠션"),
        ("에스테틱비비크림", "에스테틱 비비크림"),
        ("에너지크림", "에너지크림"),
        ("쉴드크림", "쉴드크림"),
        ("인텐스 UV프로텍터", "인텐스 UV프로텍터"),
        ("GPS마스크", "GPS마스크"),
        ("GPS 마스크", "GPS마스크"),
        ("멜라-소닉 씨-인퓨저", "멜라C인퓨저"),
        ("멜라소닉씨인퓨저", "멜라C인퓨저"),
        ("멜라C인퓨저", "멜라C인퓨저"),
        ("서울 에스테틱 쿠션", "서울 에스테틱 쿠션"),
        ("서울쿠션", "서울 에스테틱 쿠션"),
        ("엑토인 톤업 선세럼", "서울 엑토인 톤업 선세럼"),
        ("옥시젠 토닝 클렌저", "서울 옥시젠 토닝 클렌저"),
        ("워터인 퀀칭 세럼", "서울 워터인 퀀칭 세럼"),
        ("엑토인 퀀칭 크림", "서울 엑토인 퀀칭 크림"),
        ("더마인 리 + 베리어", "서울 더마인 리+베리어"),
        ("더마인 리+베리어", "서울 더마인 리+베리어"),
        ("오일앤크림", "밀리맘 오일앤크림"),
        ("아토크림", "밀리맘 아토크림"),
        ("새싹 로션", "밀리맘 새싹 로션"),
        ("새싹 워시", "밀리맘 새싹 워시"),
        ("수딩세럼", "밀리맘 수딩세럼/세트"),
        ("힙 버블 클렌저", "밀리맘 힙 버블 클렌저"),
        ("에센셜 키트", "밀리맘 키트/세트"),
        ("트래블키트", "밀리맘 키트/세트"),
        ("기프트 세트", "밀리맘 키트/세트"),
        ("소프트브레스", "담향 소프트브레스"),
        ("슈퍼아로마", "담향 슈퍼아로마"),
    ]

    for keyword, group in group_rules:
        if keyword in text:
            return group

    if "세트" in text or "(P)" in text or "키트" in text:
        return "세트/프로모션 기타"
    if "(BT)" in text or "쇼핑백" in text or "리프팅컵" in text or "가이드북" in text or "진열대" in text:
        return "부자재/BT"
    if "택배비" in text:
        return "택배비"
    if "할인" in text:
        return "할인"
    return "기타"


def is_set_item(name: str) -> bool:
    text = clean_text(name)
    set_keywords = ["(P)", "세트", "키트", "1+1", "2개", "3개", "4개", "5개", "6개", "SET", "+"]
    return any(keyword in text for keyword in set_keywords)


@dataclass
class OutputSheets:
    detail: pd.DataFrame
    line_summary: pd.DataFrame
    group_summary: pd.DataFrame
    line_group_summary: pd.DataFrame


def analyze_sales(path: Path) -> OutputSheets:
    df = pd.read_excel(path, sheet_name="판매현황", header=1)
    df = df.rename(columns=lambda col: str(col).strip())
    df = df[df["품목명[규격]"].notna()].copy()

    df["품목명[규격]"] = df["품목명[규격]"].map(clean_text)
    for col in ["수량", "공급가액", "부가세", "합계"]:
        df[col] = pd.to_numeric(df[col], errors="coerce").fillna(0)

    df["라인"] = df["품목명[규격]"].map(classify_line)
    df["그룹"] = df["품목명[규격]"].map(classify_group)
    df["세트여부"] = df["품목명[규격]"].map(lambda x: "세트" if is_set_item(x) else "단품")
    df["환산수량"] = df.apply(lambda row: row["수량"] * detect_pack_count(row["품목명[규격]"]) if row["세트여부"] == "세트" else row["수량"], axis=1)

    detail_cols = ["라인", "그룹", "세트여부", "품목명[규격]코드", "품목명[규격]", "수량", "환산수량", "공급가액", "부가세", "합계"]
    detail = df[detail_cols].sort_values(["라인", "그룹", "품목명[규격]"]).reset_index(drop=True)

    line_summary = (
        df.groupby("라인", dropna=False)[["수량", "환산수량", "합계"]]
        .sum()
        .sort_values("합계", ascending=False)
        .reset_index()
        .rename(columns={"수량": "주문수량", "합계": "판매액"})
    )

    group_summary = (
        df.groupby(["라인", "그룹"], dropna=False)[["수량", "환산수량", "합계"]]
        .sum()
        .sort_values(["라인", "합계"], ascending=[True, False])
        .reset_index()
        .rename(columns={"수량": "주문수량", "합계": "판매액"})
    )

    line_group_summary = (
        df.groupby(["라인", "그룹", "세트여부"], dropna=False)[["수량", "환산수량", "합계"]]
        .sum()
        .sort_values(["라인", "그룹", "세트여부"])
        .reset_index()
        .rename(columns={"수량": "주문수량", "합계": "판매액"})
    )

    return OutputSheets(detail=detail, line_summary=line_summary, group_summary=group_summary, line_group_summary=line_group_summary)


def save_output(sheets: OutputSheets, out_path: Path) -> None:
    with pd.ExcelWriter(out_path, engine="openpyxl") as writer:
        sheets.line_summary.to_excel(writer, index=False, sheet_name="라인별요약")
        sheets.group_summary.to_excel(writer, index=False, sheet_name="그룹별요약")
        sheets.line_group_summary.to_excel(writer, index=False, sheet_name="라인그룹상세")
        sheets.detail.to_excel(writer, index=False, sheet_name="원본분류결과")


def main() -> None:
    parser = argparse.ArgumentParser(description="판매현황 파일을 라인/그룹 기준으로 재분류합니다.")
    parser.add_argument("--input", type=Path, required=True, help="입력 엑셀 경로")
    parser.add_argument("--output", type=Path, required=True, help="출력 엑셀 경로")
    args = parser.parse_args()

    sheets = analyze_sales(args.input)
    save_output(sheets, args.output)
    print(f"저장 완료: {args.output}")


if __name__ == "__main__":
    main()
