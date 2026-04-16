param(
    [string]$WorkbookPath = "$env:USERPROFILE\Desktop\전사 제품별 판매실적_프로그램.xlsm"
)

$ErrorActionPreference = 'Stop'

if (-not (Test-Path -LiteralPath $WorkbookPath)) {
    throw "대상 파일을 찾을 수 없습니다: $WorkbookPath"
}

$replacement = @'
Public Sub DebugImportSpecificFile(ByVal filePath As String)
    Dim wsRaw As Worksheet
    Set wsRaw = ThisWorkbook.Worksheets(SHEET_RAW)
    wsRaw.Cells.Clear
    wsRaw.Range("A1:I1").Value = Array("기준월", "연도", "월", "거래처그룹코드", "거래처그룹", "품목코드", "품목명", "수량", "합계")
    ImportOneMonthlyFile filePath
End Sub

Private Sub ImportOneMonthlyFile(ByVal filePath As String)
    Dim wb As Workbook, ws As Worksheet, wsRaw As Worksheet
    Dim lastRow As Long, outRow As Long, r As Long
    Dim monthNum As Long
    Dim groupCode As String, groupName As String, code As String, itemName As String
    Dim qty2026 As Double, amt2026 As Double, qty2025 As Double, amt2025 As Double
    Dim colGroupCode As Long, colGroupName As Long, colCode As Long, colItemName As Long
    Dim colQty2026 As Long, colAmt2026 As Long, colQty2025 As Long, colAmt2025 As Long
    Dim headerRow2Col3 As String, headerRow2Col7 As String, headerRow2Col8 As String

    monthNum = ExtractMonthFromText(filePath)
    If monthNum = 0 Then monthNum = ExtractMonthFromText(CStr(ThisWorkbook.Worksheets(SHEET_HUB).Range("E4").Value))

    Set wb = Workbooks.Open(filePath, ReadOnly:=True)
    Set ws = wb.Worksheets(1)
    Set wsRaw = ThisWorkbook.Worksheets(SHEET_RAW)
    outRow = wsRaw.Cells(wsRaw.Rows.Count, 1).End(xlUp).Row + 1

    headerRow2Col3 = SafeText(ws.Cells(2, 3).Value)
    headerRow2Col7 = SafeText(ws.Cells(2, 7).Value)
    headerRow2Col8 = SafeText(ws.Cells(2, 8).Value)

    If InStr(headerRow2Col7, "품목명[규격]코드") > 0 Then
        colGroupCode = 1
        colGroupName = 2
        colCode = 7
        colItemName = 8
        colQty2026 = 9
        colAmt2026 = 12
        colQty2025 = 13
        colAmt2025 = 16
        lastRow = ws.Cells(ws.Rows.Count, colCode).End(xlUp).Row
    ElseIf InStr(headerRow2Col3, "코드") > 0 And InStr(headerRow2Col8, "품목명[규격]") = 0 Then
        colGroupCode = 1
        colGroupName = 2
        colCode = 3
        colItemName = 4
        colQty2026 = 5
        colAmt2026 = 8
        colQty2025 = 9
        colAmt2025 = 12
        lastRow = ws.Cells(ws.Rows.Count, colCode).End(xlUp).Row
    Else
        colGroupCode = 1
        colGroupName = 2
        colCode = 4
        colItemName = 4
        colQty2026 = 5
        colAmt2026 = 8
        colQty2025 = 9
        colAmt2025 = 12
        lastRow = ws.Cells(ws.Rows.Count, colItemName).End(xlUp).Row
    End If

    For r = 4 To lastRow
        groupCode = SafeText(ws.Cells(r, colGroupCode).Value)
        groupName = SafeText(ws.Cells(r, colGroupName).Value)
        code = SafeText(ws.Cells(r, colCode).Value)
        itemName = SafeText(ws.Cells(r, colItemName).Value)
        If Len(code) = 0 Or Len(itemName) = 0 Then GoTo NextRow

        qty2026 = SafeNum(ws.Cells(r, colQty2026).Value)
        amt2026 = SafeNum(ws.Cells(r, colAmt2026).Value)
        qty2025 = SafeNum(ws.Cells(r, colQty2025).Value)
        amt2025 = SafeNum(ws.Cells(r, colAmt2025).Value)

        If qty2026 <> 0 Or amt2026 <> 0 Then
            wsRaw.Cells(outRow, 1).Resize(1, 9).Value = Array("2026/" & Format(monthNum, "00"), 2026, monthNum, groupCode, groupName, code, itemName, qty2026, amt2026)
            outRow = outRow + 1
        End If
        If qty2025 <> 0 Or amt2025 <> 0 Then
            wsRaw.Cells(outRow, 1).Resize(1, 9).Value = Array("2025/" & Format(monthNum, "00"), 2025, monthNum, groupCode, groupName, code, itemName, qty2025, amt2025)
            outRow = outRow + 1
        End If
NextRow:
    Next r

    wb.Close SaveChanges:=False
End Sub
'@

$excel = $null
$wb = $null
$component = $null
$codeModule = $null

try {
    $excel = New-Object -ComObject Excel.Application
    $excel.Visible = $false
    $excel.DisplayAlerts = $false

    $wb = $excel.Workbooks.Open($WorkbookPath)
    $component = $wb.VBProject.VBComponents.Item('SalesProgramModule')
    $codeModule = $component.CodeModule
    $fullCode = $codeModule.Lines(1, $codeModule.CountOfLines)

    $pattern = '(?s)Public Sub DebugImportSpecificFile\(ByVal filePath As String\).*?End Sub\s*Private Sub ImportOneMonthlyFile\(ByVal filePath As String\).*?End Sub|(?s)Private Sub ImportOneMonthlyFile\(ByVal filePath As String\).*?End Sub'
    $updatedCode = [regex]::Replace($fullCode, $pattern, $replacement, 1)

    if ($updatedCode -eq $fullCode) {
        throw 'ImportOneMonthlyFile 블록을 찾지 못했습니다.'
    }

    $codeModule.DeleteLines(1, $codeModule.CountOfLines)
    $codeModule.AddFromString($updatedCode)

    $wb.Save()
    $wb.Close($true)
    $excel.Quit()
}
finally {
    if ($codeModule) { $null = [Runtime.InteropServices.Marshal]::ReleaseComObject($codeModule) }
    if ($component) { $null = [Runtime.InteropServices.Marshal]::ReleaseComObject($component) }
    if ($wb) { $null = [Runtime.InteropServices.Marshal]::ReleaseComObject($wb) }
    if ($excel) { $null = [Runtime.InteropServices.Marshal]::ReleaseComObject($excel) }
    [GC]::Collect()
    [GC]::WaitForPendingFinalizers()
}
