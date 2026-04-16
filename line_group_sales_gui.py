from __future__ import annotations

from pathlib import Path
import tkinter as tk
from tkinter import filedialog, messagebox, ttk
import traceback

from line_group_sales_analyzer import analyze_sales, save_output


class AnalyzerApp:
    def __init__(self, root: tk.Tk) -> None:
        self.root = root
        self.root.title("라인/세트 판매 분석기")
        self.root.geometry("760x420")

        self.input_path = tk.StringVar()
        self.output_path = tk.StringVar()

        self._build()
        self._load_defaults()

    def _build(self) -> None:
        frame = ttk.Frame(self.root, padding=18)
        frame.pack(fill="both", expand=True)

        ttk.Label(frame, text="라인/세트 판매 분석 프로그램", font=("Malgun Gothic", 15, "bold")).pack(anchor="w")
        ttk.Label(
            frame,
            text="품목별 판매수량과 판매액 데이터를 읽어서 세트는 그룹으로 묶고, 라인별 요약과 그룹별 집계 결과를 새 엑셀로 만듭니다.",
            wraplength=700,
        ).pack(anchor="w", pady=(8, 18))

        self._row(frame, "입력 파일", self.input_path, self.pick_input)
        self._row(frame, "결과 파일", self.output_path, self.pick_output)

        btns = ttk.Frame(frame)
        btns.pack(fill="x", pady=(18, 12))
        ttk.Button(btns, text="기본 경로", command=self._load_defaults).pack(side="left")
        ttk.Button(btns, text="분석 실행", command=self.run).pack(side="right")

        ttk.Label(frame, text="로그").pack(anchor="w")
        self.log = tk.Text(frame, height=14, wrap="word", font=("Consolas", 10))
        self.log.pack(fill="both", expand=True, pady=(8, 0))

    def _row(self, parent: ttk.Frame, label: str, var: tk.StringVar, command) -> None:
        row = ttk.Frame(parent)
        row.pack(fill="x", pady=6)
        ttk.Label(row, text=label, width=12).pack(side="left")
        ttk.Entry(row, textvariable=var).pack(side="left", fill="x", expand=True, padx=(0, 8))
        ttk.Button(row, text="찾아보기", command=command).pack(side="left")

    def _write(self, text: str) -> None:
        self.log.insert("end", text + "\n")
        self.log.see("end")
        self.root.update_idletasks()

    def _load_defaults(self) -> None:
        desktop = Path.home() / "Desktop"
        self.input_path.set(str(desktop / "SBxcNA1F5rrAZ16S.xlsx"))
        self.output_path.set(str(desktop / "판매분석_라인세트_결과.xlsx"))
        self._write("기본 경로를 불러왔습니다.")

    def pick_input(self) -> None:
        path = filedialog.askopenfilename(filetypes=[("Excel files", "*.xlsx *.xlsm *.xls")], title="입력 파일 선택")
        if path:
            self.input_path.set(path)

    def pick_output(self) -> None:
        path = filedialog.asksaveasfilename(
            defaultextension=".xlsx",
            filetypes=[("Excel files", "*.xlsx")],
            title="결과 저장 위치 선택",
            initialfile="판매분석_라인세트_결과.xlsx",
        )
        if path:
            self.output_path.set(path)

    def run(self) -> None:
        in_path = Path(self.input_path.get())
        out_path = Path(self.output_path.get())
        if not in_path.exists():
            messagebox.showerror("오류", "입력 파일 경로를 확인해주세요.")
            return

        try:
            self.log.delete("1.0", "end")
            self._write(f"입력 파일: {in_path}")
            self._write("분석을 시작합니다.")
            sheets = analyze_sales(in_path)
            save_output(sheets, out_path)
            self._write("분석 완료")
            self._write(f"결과 파일: {out_path}")
            self._write(f"라인 수: {len(sheets.line_summary)}")
            self._write(f"그룹 수: {len(sheets.group_summary)}")
            messagebox.showinfo("완료", f"분석이 끝났습니다.\n\n{out_path}")
        except Exception:
            self._write("오류가 발생했습니다.")
            self._write(traceback.format_exc())
            messagebox.showerror("오류", "분석 중 오류가 발생했습니다. 로그를 확인해주세요.")


def main() -> None:
    root = tk.Tk()
    AnalyzerApp(root)
    root.mainloop()


if __name__ == "__main__":
    main()
