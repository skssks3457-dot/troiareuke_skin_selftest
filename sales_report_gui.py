from __future__ import annotations

import traceback
from pathlib import Path
import tkinter as tk
from tkinter import filedialog, messagebox, ttk

from sales_report_generator import aggregate, compare_with_template, write_report


class SalesReportApp:
    def __init__(self, root: tk.Tk) -> None:
        self.root = root
        self.root.title("판매 실적 자동 집계")
        self.root.geometry("760x420")
        self.root.minsize(700, 380)

        self.raw_path = tk.StringVar()
        self.template_path = tk.StringVar()
        self.output_path = tk.StringVar()
        self.sheet_name = tk.StringVar(value="3월")

        self._build_ui()

    def _build_ui(self) -> None:
        container = ttk.Frame(self.root, padding=18)
        container.pack(fill="both", expand=True)

        title = ttk.Label(container, text="26년/25년 동월 상품 판매 실적 자동 계산", font=("Malgun Gothic", 15, "bold"))
        title.pack(anchor="w")

        desc = ttk.Label(
            container,
            text="원본 판매현황 파일과 경영회의자료 파일을 선택하면 세트상품을 단품 기준으로 환산해 결과 파일을 생성합니다.",
            wraplength=700,
        )
        desc.pack(anchor="w", pady=(8, 18))

        self._add_file_row(container, "원본 데이터", self.raw_path, self._pick_raw)
        self._add_file_row(container, "경영회의자료", self.template_path, self._pick_template)
        self._add_file_row(container, "결과 저장 위치", self.output_path, self._pick_output)

        sheet_frame = ttk.Frame(container)
        sheet_frame.pack(fill="x", pady=(10, 0))
        ttk.Label(sheet_frame, text="시트명", width=16).pack(side="left")
        ttk.Entry(sheet_frame, textvariable=self.sheet_name, width=16).pack(side="left")

        button_frame = ttk.Frame(container)
        button_frame.pack(fill="x", pady=(20, 14))

        ttk.Button(button_frame, text="기본 경로 불러오기", command=self._load_defaults).pack(side="left")
        ttk.Button(button_frame, text="집계 실행", command=self._run).pack(side="right")

        ttk.Label(container, text="실행 로그").pack(anchor="w")
        self.log = tk.Text(container, height=12, wrap="word", font=("Consolas", 10))
        self.log.pack(fill="both", expand=True, pady=(8, 0))

        self._load_defaults()

    def _add_file_row(self, parent: ttk.Frame, label: str, variable: tk.StringVar, command) -> None:
        row = ttk.Frame(parent)
        row.pack(fill="x", pady=6)
        ttk.Label(row, text=label, width=16).pack(side="left")
        ttk.Entry(row, textvariable=variable).pack(side="left", fill="x", expand=True, padx=(0, 8))
        ttk.Button(row, text="찾아보기", command=command).pack(side="left")

    def _pick_raw(self) -> None:
        path = filedialog.askopenfilename(title="원본 판매현황 파일 선택", filetypes=[("Excel files", "*.xlsx *.xlsm *.xls")])
        if path:
            self.raw_path.set(path)

    def _pick_template(self) -> None:
        path = filedialog.askopenfilename(title="경영회의자료 파일 선택", filetypes=[("Excel files", "*.xlsx *.xlsm *.xls")])
        if path:
            self.template_path.set(path)

    def _pick_output(self) -> None:
        path = filedialog.asksaveasfilename(
            title="결과 파일 저장",
            defaultextension=".xlsx",
            filetypes=[("Excel files", "*.xlsx")],
            initialfile="경영회의자료_자동집계_결과.xlsx",
        )
        if path:
            self.output_path.set(path)

    def _load_defaults(self) -> None:
        desktop = Path.home() / "Desktop"
        raw = desktop / "26년, 25년 3월 데이터(로우).xlsx"
        template = desktop / "경영회의자료_MK_3월 제품 판매 실적_26.03.31.xlsx"
        output = desktop / "경영회의자료_MK_3월_자동집계_결과.xlsx"

        if raw.exists():
            self.raw_path.set(str(raw))
        if template.exists():
            self.template_path.set(str(template))
        self.output_path.set(str(output))
        self._write_log("기본 경로를 불러왔습니다.")

    def _write_log(self, text: str) -> None:
        self.log.insert("end", f"{text}\n")
        self.log.see("end")
        self.root.update_idletasks()

    def _validate(self) -> bool:
        if not Path(self.raw_path.get()).exists():
            messagebox.showerror("오류", "원본 데이터 파일 경로를 확인해주세요.")
            return False
        if not Path(self.template_path.get()).exists():
            messagebox.showerror("오류", "경영회의자료 파일 경로를 확인해주세요.")
            return False
        if not self.sheet_name.get().strip():
            messagebox.showerror("오류", "시트명을 입력해주세요.")
            return False
        return True

    def _run(self) -> None:
        if not self._validate():
            return

        try:
            self.log.delete("1.0", "end")
            self._write_log("집계를 시작합니다.")
            self._write_log(f"원본 데이터: {self.raw_path.get()}")
            self._write_log(f"경영회의자료: {self.template_path.get()}")

            totals = aggregate(Path(self.raw_path.get()))
            write_report(Path(self.template_path.get()), Path(self.output_path.get()), totals, self.sheet_name.get().strip())

            self._write_log("결과 파일 저장이 완료되었습니다.")
            self._write_log(f"저장 위치: {self.output_path.get()}")
            self._write_log("")
            self._write_log("기존 시트와 계산값 차이는 콘솔 기준 비교 함수로도 확인할 수 있습니다.")
            compare_with_template(Path(self.template_path.get()), totals, self.sheet_name.get().strip())

            messagebox.showinfo("완료", f"집계가 끝났습니다.\n\n결과 파일:\n{self.output_path.get()}")
        except Exception:
            self._write_log("오류가 발생했습니다.")
            self._write_log(traceback.format_exc())
            messagebox.showerror("오류", "집계 중 오류가 발생했습니다. 아래 로그를 확인해주세요.")


def main() -> None:
    root = tk.Tk()
    try:
        from ctypes import windll

        windll.shcore.SetProcessDpiAwareness(1)
    except Exception:
        pass
    SalesReportApp(root)
    root.mainloop()


if __name__ == "__main__":
    main()
