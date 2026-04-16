$ErrorActionPreference = 'Stop'

$workdir = 'C:\Users\MK\Documents\Playground'
$xlsxFile = Get-ChildItem -LiteralPath $workdir -Filter '*.xlsx' |
    Where-Object { $_.Name -notlike '*backup*' } |
    Sort-Object LastWriteTime -Descending |
    Select-Object -First 1

if (-not $xlsxFile) {
    throw '허브 xlsx 파일을 찾지 못했습니다.'
}

$xlsxPath = $xlsxFile.FullName
$xlsmPath = Join-Path $workdir 'sales_hub.xlsm'
$modulePath = Join-Path $workdir 'sales_hub_module.bas'

$vbaCode = @'
Option Explicit

Private Const HUB_SHEET_INDEX As Long = 1
Private Const MASTER_SHEET_INDEX As Long = 2
Private Const RULE_SHEET_INDEX As Long = 3
Private Const MAP_SHEET_INDEX As Long = 4
Private Const DEPT_SHEET_INDEX As Long = 5
Private Const RAW_SHEET_INDEX As Long = 6
Private Const NORM_SHEET_INDEX As Long = 7
Private Const LAYOUT_SHEET_INDEX As Long = 8

Public Sub ImportDataAndBuild()
    Application.ScreenUpdating = False
    Application.DisplayAlerts = False
    On Error GoTo CleanFail

    Call ImportDataFromDesktop
    If LastRawRow() > 1 Then
        Call BuildMonthlyYoYSheets
    End If

CleanExit:
    Application.DisplayAlerts = True
    Application.ScreenUpdating = True
    Exit Sub

CleanFail:
    MsgBox "데이터 불러오기 중 오류가 발생했습니다." & vbCrLf & Err.Description, vbExclamation
    Resume CleanExit
End Sub

Public Sub BuildMonthlyYoYSheets()
    Dim wsRaw As Worksheet, wsNorm As Worksheet, wsHub As Worksheet, wsLayout As Worksheet
    Dim masterDict As Object, ruleDict As Object, mapDict As Object, groupDict As Object
    Dim aggDict As Object, monthDict As Object
    Dim colMap As Object
    Dim lastRow As Long, lastLayoutRow As Long, outRow As Long
    Dim r As Long, rawYear As Long, rawMonth As Long, compareYear As Long, prevYear As Long
    Dim rawDept As String, rawCode As String, rawName As String, rawBaseMonth As String
    Dim rawQty As Double, rawAmt As Double
    Dim masterInfo As Variant, reportItem As String, reportGroup As String
    Dim ruleRows As Collection, comp As Variant
    Dim qtyPaid As Double, qtyActual As Double, compareAmt As Double
    Dim normCode As String, normName As String, normLine As String, normDiv As String
    Dim maxYear As Long, monthKey As Variant

    On Error GoTo FailHandler

    Set wsRaw = ThisWorkbook.Worksheets(RAW_SHEET_INDEX)
    Set wsNorm = ThisWorkbook.Worksheets(NORM_SHEET_INDEX)
    Set wsHub = ThisWorkbook.Worksheets(HUB_SHEET_INDEX)
    Set wsLayout = ThisWorkbook.Worksheets(LAYOUT_SHEET_INDEX)

    If wsRaw.Cells(wsRaw.Rows.Count, 1).End(xlUp).Row < 2 Then
        MsgBox "RawData 시트에 불러온 데이터가 없습니다.", vbInformation
        Exit Sub
    End If

    Set colMap = HeaderIndexMap(wsRaw)
    ValidateRequiredHeaders colMap

    Set masterDict = LoadMasterDict()
    Set ruleDict = LoadRuleDict()
    Set mapDict = CreateObject("Scripting.Dictionary")
    Set groupDict = CreateObject("Scripting.Dictionary")
    LoadMappingAndGroups mapDict, groupDict

    Set aggDict = CreateObject("Scripting.Dictionary")
    Set monthDict = CreateObject("Scripting.Dictionary")

    ResetNormalizedSheet wsNorm

    lastRow = wsRaw.Cells(wsRaw.Rows.Count, 1).End(xlUp).Row
    outRow = 2
    maxYear = 0

    For r = 2 To lastRow
        rawCode = SafeText(wsRaw.Cells(r, colMap("품목코드")).Value)
        If Len(rawCode) = 0 Then GoTo ContinueLoop

        rawDept = SafeText(wsRaw.Cells(r, colMap("거래처그룹2")).Value)
        rawName = SafeText(wsRaw.Cells(r, colMap("품목명")).Value)
        rawBaseMonth = SafeText(wsRaw.Cells(r, colMap("기준월")).Value)
        rawYear = CLng(SafeNum(wsRaw.Cells(r, colMap("연도")).Value))
        rawMonth = CLng(SafeNum(wsRaw.Cells(r, colMap("월")).Value))
        rawQty = SafeNum(wsRaw.Cells(r, colMap("수량")).Value)
        rawAmt = SafeNum(wsRaw.Cells(r, colMap("합계")).Value)

        If rawYear <= 0 Or rawMonth <= 0 Then GoTo ContinueLoop
        If rawYear > maxYear Then maxYear = rawYear
        monthDict(CStr(rawMonth)) = True

        If ContainsText(rawDept, "무상") Or ContainsText(rawName, "무상") Or ContainsText(rawCode, "무상") Then
            GoTo ContinueLoop
        End If

        If IsConsumerDept(rawDept) And ruleDict.Exists(rawCode) Then
            Set ruleRows = ruleDict(rawCode)
            For Each comp In ruleRows
                normCode = CStr(comp(0))
                normName = CStr(comp(1))
                qtyActual = rawQty * CDbl(comp(2))
                qtyPaid = rawQty * CDbl(comp(3))
                compareAmt = rawAmt * CDbl(comp(4))

                If masterDict.Exists(normCode) Then
                    masterInfo = masterDict(normCode)
                    normName = CStr(masterInfo(0))
                    normLine = CStr(masterInfo(1))
                    normDiv = CStr(masterInfo(2))
                Else
                    normLine = vbNullString
                    normDiv = "단품"
                End If

                reportItem = ResolveReportItem(normCode, normName, normLine, mapDict)
                reportGroup = ResolveReportGroup(reportItem, groupDict)

                WriteNormalizedRow wsNorm, outRow, rawBaseMonth, rawYear, rawMonth, rawDept, rawCode, rawName, _
                    normCode, normName, normLine, normDiv, reportGroup, reportItem, rawQty, qtyActual, qtyPaid, compareAmt, rawAmt
                AddAggregate aggDict, BuildAggKey(rawYear, rawMonth, reportGroup, reportItem), qtyPaid, compareAmt
                outRow = outRow + 1
            Next comp
        Else
            normCode = rawCode
            normName = rawName
            normLine = vbNullString
            normDiv = "단품"
            qtyActual = rawQty
            qtyPaid = rawQty
            compareAmt = rawAmt

            If masterDict.Exists(normCode) Then
                masterInfo = masterDict(normCode)
                normName = CStr(masterInfo(0))
                normLine = CStr(masterInfo(1))
                normDiv = CStr(masterInfo(2))
                qtyActual = rawQty * CDbl(masterInfo(4))
                qtyPaid = rawQty * CDbl(masterInfo(5))
                If IsConsumerDept(rawDept) And SafeNum(masterInfo(3)) <> 0 Then
                    compareAmt = qtyPaid * CDbl(masterInfo(3))
                End If
            End If

            reportItem = ResolveReportItem(normCode, normName, normLine, mapDict)
            reportGroup = ResolveReportGroup(reportItem, groupDict)

            WriteNormalizedRow wsNorm, outRow, rawBaseMonth, rawYear, rawMonth, rawDept, rawCode, rawName, _
                normCode, normName, normLine, normDiv, reportGroup, reportItem, rawQty, qtyActual, qtyPaid, compareAmt, rawAmt
            AddAggregate aggDict, BuildAggKey(rawYear, rawMonth, reportGroup, reportItem), qtyPaid, compareAmt
            outRow = outRow + 1
        End If

ContinueLoop:
    Next r

    If maxYear = 0 Then
        MsgBox "연도/월 데이터를 찾지 못했습니다.", vbExclamation
        Exit Sub
    End If

    prevYear = maxYear - 1
    DeleteGeneratedMonthSheets

    For Each monthKey In SortedMonthKeys(monthDict)
        BuildMonthSheet CLng(monthKey), maxYear, prevYear, aggDict, groupDict, wsLayout
    Next monthKey

    wsHub.Range("B12").Value = maxYear & "년 기준 월별 시트 생성 완료"
    wsHub.Range("B13").Value = "정규화 행 수: " & (outRow - 2)

    MsgBox "월별 작년대비 시트 생성이 완료되었습니다.", vbInformation
    Exit Sub

FailHandler:
    MsgBox "월별 시트 생성 중 오류가 발생했습니다." & vbCrLf & Err.Description, vbExclamation
End Sub

Private Sub ImportDataFromDesktop()
    Dim fd As FileDialog
    Dim selectedPath As String
    Dim srcWb As Workbook, srcWs As Worksheet
    Dim wsRaw As Worksheet, wsHub As Worksheet
    Dim usedRows As Long, usedCols As Long

    Set fd = Application.FileDialog(3)
    With fd
        .Title = "바탕화면에서 월별 원본 파일 선택"
        .AllowMultiSelect = False
        .InitialFileName = Environ$("USERPROFILE") & "\Desktop\"
        .Filters.Clear
        .Filters.Add "Excel Files", "*.xlsx;*.xlsm;*.xls"
        If .Show <> -1 Then Exit Sub
        selectedPath = .SelectedItems(1)
    End With

    Set srcWb = Workbooks.Open(selectedPath, ReadOnly:=True)
    Set srcWs = srcWb.Worksheets(1)
    Set wsRaw = ThisWorkbook.Worksheets(RAW_SHEET_INDEX)
    Set wsHub = ThisWorkbook.Worksheets(HUB_SHEET_INDEX)

    wsRaw.Cells.Clear
    usedRows = srcWs.Cells(srcWs.Rows.Count, 1).End(xlUp).Row
    usedCols = srcWs.Cells(1, srcWs.Columns.Count).End(xlToLeft).Column
    srcWs.Range(srcWs.Cells(1, 1), srcWs.Cells(usedRows, usedCols)).Copy
    wsRaw.Cells(1, 1).PasteSpecial xlPasteValues
    Application.CutCopyMode = False

    srcWb.Close SaveChanges:=False

    wsHub.Range("B10").Value = selectedPath
    wsHub.Range("B11").Value = Format(Now, "yyyy-mm-dd hh:mm:ss")
End Sub

Private Function LoadMasterDict() As Object
    Dim dict As Object
    Dim ws As Worksheet
    Dim lastRow As Long, r As Long
    Dim code As String

    Set dict = CreateObject("Scripting.Dictionary")
    Set ws = ThisWorkbook.Worksheets(MASTER_SHEET_INDEX)
    lastRow = ws.Cells(ws.Rows.Count, 1).End(xlUp).Row

    For r = 2 To lastRow
        code = SafeText(ws.Cells(r, 1).Value)
        If Len(code) > 0 Then
            dict(code) = Array( _
                SafeText(ws.Cells(r, 2).Value), _
                SafeText(ws.Cells(r, 3).Value), _
                SafeText(ws.Cells(r, 4).Value), _
                SafeNum(ws.Cells(r, 5).Value), _
                IIf(SafeNum(ws.Cells(r, 6).Value) = 0, 1, SafeNum(ws.Cells(r, 6).Value)), _
                IIf(SafeNum(ws.Cells(r, 7).Value) = 0, 1, SafeNum(ws.Cells(r, 7).Value)) _
            )
        End If
    Next r

    Set LoadMasterDict = dict
End Function

Private Function LoadRuleDict() As Object
    Dim dict As Object, coll As Collection
    Dim ws As Worksheet
    Dim lastRow As Long, r As Long
    Dim setCode As String, compCode As String

    Set dict = CreateObject("Scripting.Dictionary")
    Set ws = ThisWorkbook.Worksheets(RULE_SHEET_INDEX)
    lastRow = ws.Cells(ws.Rows.Count, 1).End(xlUp).Row

    For r = 2 To lastRow
        setCode = SafeText(ws.Cells(r, 1).Value)
        compCode = SafeText(ws.Cells(r, 4).Value)
        If Len(setCode) = 0 Or Len(compCode) = 0 Then GoTo ContinueLoop
        If Not dict.Exists(setCode) Then
            Set coll = New Collection
            dict.Add setCode, coll
        End If
        Set coll = dict(setCode)
        coll.Add Array( _
            compCode, _
            SafeText(ws.Cells(r, 5).Value), _
            IIf(SafeNum(ws.Cells(r, 6).Value) = 0, 1, SafeNum(ws.Cells(r, 6).Value)), _
            SafeNum(ws.Cells(r, 7).Value), _
            SafeNum(ws.Cells(r, 8).Value) _
        )
ContinueLoop:
    Next r

    Set LoadRuleDict = dict
End Function

Private Sub LoadMappingAndGroups(ByRef mapDict As Object, ByRef groupDict As Object)
    Dim wsMap As Worksheet, wsLayout As Worksheet
    Dim lastRow As Long, r As Long
    Dim code As String, itemName As String, groupName As String

    Set wsMap = ThisWorkbook.Worksheets(MAP_SHEET_INDEX)
    lastRow = wsMap.Cells(wsMap.Rows.Count, 1).End(xlUp).Row
    For r = 2 To lastRow
        itemName = SafeText(wsMap.Cells(r, 1).Value)
        code = SafeText(wsMap.Cells(r, 2).Value)
        If Len(code) > 0 And Len(itemName) > 0 Then
            mapDict(code) = itemName
        End If
    Next r

    Set wsLayout = ThisWorkbook.Worksheets(LAYOUT_SHEET_INDEX)
    lastRow = wsLayout.Cells(wsLayout.Rows.Count, 1).End(xlUp).Row
    For r = 2 To lastRow
        groupName = SafeText(wsLayout.Cells(r, 2).Value)
        itemName = SafeText(wsLayout.Cells(r, 3).Value)
        If Len(itemName) > 0 Then
            groupDict(itemName) = groupName
        End If
    Next r
End Sub

Private Function ResolveReportItem(ByVal code As String, ByVal itemName As String, ByVal lineName As String, ByVal mapDict As Object) As String
    If mapDict.Exists(code) Then
        ResolveReportItem = CStr(mapDict(code))
        Exit Function
    End If

    If ContainsText(lineName, "밀리맘") Then
        ResolveReportItem = "기타(젤, 힙, 미니, 세트)"
    ElseIf ContainsText(lineName, "서울") Then
        ResolveReportItem = "기타(세트상품)"
    ElseIf Left$(code, 4) = "MKBT" Or ContainsText(itemName, "(BT)") Then
        ResolveReportItem = "뷰티툴(BT)"
    ElseIf ContainsText(lineName, "미용기기") Then
        ResolveReportItem = "AI피부진단기"
    ElseIf ContainsText(lineName, "담향") Then
        ResolveReportItem = "기타"
    Else
        ResolveReportItem = "기타(링플, 샤쉐, LD, 악센)"
    End If
End Function

Private Function ResolveReportGroup(ByVal reportItem As String, ByVal groupDict As Object) As String
    If groupDict.Exists(reportItem) Then
        ResolveReportGroup = CStr(groupDict(reportItem))
    ElseIf reportItem = "뷰티툴(BT)" Or reportItem = "파트너스(교육)" Or reportItem = "기타(택배비, 리플렛, 단종)" Or reportItem = "할인" Then
        ResolveReportGroup = "기 타"
    Else
        ResolveReportGroup = "트로이아르케"
    End If
End Function

Private Function HeaderIndexMap(ByVal ws As Worksheet) As Object
    Dim dict As Object
    Dim lastCol As Long, c As Long
    Dim header As String

    Set dict = CreateObject("Scripting.Dictionary")
    lastCol = ws.Cells(1, ws.Columns.Count).End(xlToLeft).Column

    For c = 1 To lastCol
        header = SafeText(ws.Cells(1, c).Value)
        If Len(header) > 0 Then dict(header) = c
    Next c

    Set HeaderIndexMap = dict
End Function

Private Sub ValidateRequiredHeaders(ByVal colMap As Object)
    Dim requiredHeaders As Variant, i As Long
    requiredHeaders = Array("기준월", "연도", "월", "거래처그룹2코드", "거래처그룹2", "품목코드", "품목명", "수량", "공급가액", "부가세", "합계")
    For i = LBound(requiredHeaders) To UBound(requiredHeaders)
        If Not colMap.Exists(CStr(requiredHeaders(i))) Then
            Err.Raise vbObjectError + 1000, , "원본 파일 1행에 '" & requiredHeaders(i) & "' 헤더가 필요합니다."
        End If
    Next i
End Sub

Private Sub ResetNormalizedSheet(ByVal ws As Worksheet)
    ws.Cells.Clear
    ws.Range("A1:Q1").Value = Array("기준월", "연도", "월", "부서", "원본품목코드", "원본품목명", "정규화품목코드", "정규화품목명", "라인", "구분", "보고대분류", "보고상품명", "원본수량", "실물수량", "정산수량", "비교매출", "원본합계")
End Sub

Private Sub WriteNormalizedRow(ByVal ws As Worksheet, ByVal targetRow As Long, ByVal baseMonth As String, ByVal y As Long, ByVal m As Long, _
    ByVal dept As String, ByVal rawCode As String, ByVal rawName As String, ByVal normCode As String, ByVal normName As String, _
    ByVal lineName As String, ByVal divName As String, ByVal reportGroup As String, ByVal reportItem As String, ByVal rawQty As Double, _
    ByVal actualQty As Double, ByVal settleQty As Double, ByVal compareAmt As Double, ByVal rawAmt As Double)

    ws.Cells(targetRow, 1).Value = baseMonth
    ws.Cells(targetRow, 2).Value = y
    ws.Cells(targetRow, 3).Value = m
    ws.Cells(targetRow, 4).Value = dept
    ws.Cells(targetRow, 5).Value = rawCode
    ws.Cells(targetRow, 6).Value = rawName
    ws.Cells(targetRow, 7).Value = normCode
    ws.Cells(targetRow, 8).Value = normName
    ws.Cells(targetRow, 9).Value = lineName
    ws.Cells(targetRow, 10).Value = divName
    ws.Cells(targetRow, 11).Value = reportGroup
    ws.Cells(targetRow, 12).Value = reportItem
    ws.Cells(targetRow, 13).Value = rawQty
    ws.Cells(targetRow, 14).Value = actualQty
    ws.Cells(targetRow, 15).Value = settleQty
    ws.Cells(targetRow, 16).Value = compareAmt
    ws.Cells(targetRow, 17).Value = rawAmt
End Sub

Private Function IsConsumerDept(ByVal deptName As String) As Boolean
    IsConsumerDept = (deptName = "트로이아르케사업팀" Or deptName = "셀럽B2B" Or deptName = "밀리맘사업팀")
End Function

Private Function ContainsText(ByVal sourceText As String, ByVal keyword As String) As Boolean
    ContainsText = (InStr(1, sourceText, keyword, vbTextCompare) > 0)
End Function

Private Function SafeText(ByVal v As Variant) As String
    If IsError(v) Or IsNull(v) Or IsEmpty(v) Then
        SafeText = vbNullString
    Else
        SafeText = Trim$(CStr(v))
    End If
End Function

Private Function SafeNum(ByVal v As Variant) As Double
    If IsError(v) Or IsNull(v) Or IsEmpty(v) Or v = vbNullString Then
        SafeNum = 0
    ElseIf IsNumeric(v) Then
        SafeNum = CDbl(v)
    Else
        SafeNum = 0
    End If
End Function

Private Function BuildAggKey(ByVal y As Long, ByVal m As Long, ByVal groupName As String, ByVal itemName As String) As String
    BuildAggKey = CStr(y) & "|" & Format$(m, "00") & "|" & groupName & "|" & itemName
End Function

Private Sub AddAggregate(ByVal dict As Object, ByVal aggKey As String, ByVal qty As Double, ByVal amt As Double)
    Dim values As Variant
    If dict.Exists(aggKey) Then
        values = dict(aggKey)
        values(0) = CDbl(values(0)) + qty
        values(1) = CDbl(values(1)) + amt
        dict(aggKey) = values
    Else
        dict.Add aggKey, Array(qty, amt)
    End If
End Sub

Private Function GetQty(ByVal dict As Object, ByVal y As Long, ByVal m As Long, ByVal groupName As String, ByVal itemName As String) As Double
    Dim key As String
    key = BuildAggKey(y, m, groupName, itemName)
    If dict.Exists(key) Then GetQty = CDbl(dict(key)(0))
End Function

Private Function GetAmt(ByVal dict As Object, ByVal y As Long, ByVal m As Long, ByVal groupName As String, ByVal itemName As String) As Double
    Dim key As String
    key = BuildAggKey(y, m, groupName, itemName)
    If dict.Exists(key) Then GetAmt = CDbl(dict(key)(1))
End Function

Private Function SumQtyToMonth(ByVal dict As Object, ByVal y As Long, ByVal monthLimit As Long, ByVal groupName As String, ByVal itemName As String) As Double
    Dim m As Long
    For m = 1 To monthLimit
        SumQtyToMonth = SumQtyToMonth + GetQty(dict, y, m, groupName, itemName)
    Next m
End Function

Private Function SumAmtToMonth(ByVal dict As Object, ByVal y As Long, ByVal monthLimit As Long, ByVal groupName As String, ByVal itemName As String) As Double
    Dim m As Long
    For m = 1 To monthLimit
        SumAmtToMonth = SumAmtToMonth + GetAmt(dict, y, m, groupName, itemName)
    Next m
End Function

Private Function SortedMonthKeys(ByVal monthDict As Object) As Variant
    Dim arr() As Long, i As Long, key As Variant, j As Long, tmp As Long
    ReDim arr(0 To monthDict.Count - 1)
    i = 0
    For Each key In monthDict.Keys
        arr(i) = CLng(key)
        i = i + 1
    Next key
    For i = LBound(arr) To UBound(arr) - 1
        For j = i + 1 To UBound(arr)
            If arr(i) > arr(j) Then
                tmp = arr(i)
                arr(i) = arr(j)
                arr(j) = tmp
            End If
        Next j
    Next i
    SortedMonthKeys = arr
End Function

Private Sub DeleteGeneratedMonthSheets()
    Dim protectedNames As Object
    Dim ws As Worksheet

    Set protectedNames = CreateObject("Scripting.Dictionary")
    protectedNames("허브") = True
    protectedNames("상품마스터") = True
    protectedNames("세트규칙") = True
    protectedNames("보고상품명코드매핑") = True
    protectedNames("DeptRule") = True
    protectedNames("RawData") = True
    protectedNames("NormalizedData") = True
    protectedNames("ReportLayout") = True

    Dim idx As Long
    For idx = ThisWorkbook.Worksheets.Count To 1 Step -1
        Set ws = ThisWorkbook.Worksheets(idx)
        If Not protectedNames.Exists(ws.Name) Then
            ws.Delete
        End If
    Next idx
End Sub

Private Sub BuildMonthSheet(ByVal monthNum As Long, ByVal currYear As Long, ByVal prevYear As Long, ByVal aggDict As Object, ByVal groupDict As Object, ByVal wsLayout As Worksheet)
    Dim ws As Worksheet
    Dim rowOut As Long, lastLayoutRow As Long, r As Long
    Dim curGroup As String, prevGroup As String, itemName As String
    Dim curQty As Double, prevQty As Double, curAmt As Double, prevAmt As Double
    Dim curCumQty As Double, prevCumQty As Double, curCumAmt As Double, prevCumAmt As Double
    Dim totalMonthQty As Double, totalMonthAmt As Double, totalCumQty As Double, totalCumAmt As Double
    Dim groupVals(1 To 16) As Double, totalVals(1 To 16) As Double, i As Long
    Dim valueArr(1 To 16) As Double

    Set ws = ThisWorkbook.Worksheets.Add(After:=ThisWorkbook.Worksheets(ThisWorkbook.Worksheets.Count))
    ws.Name = CStr(monthNum) & "월"
    SetupMonthSheetHeader ws, monthNum

    lastLayoutRow = wsLayout.Cells(wsLayout.Rows.Count, 1).End(xlUp).Row

    For r = 2 To lastLayoutRow
        curGroup = SafeText(wsLayout.Cells(r, 2).Value)
        itemName = SafeText(wsLayout.Cells(r, 3).Value)
        totalMonthQty = totalMonthQty + GetQty(aggDict, currYear, monthNum, curGroup, itemName)
        totalMonthAmt = totalMonthAmt + GetAmt(aggDict, currYear, monthNum, curGroup, itemName)
        totalCumQty = totalCumQty + SumQtyToMonth(aggDict, currYear, monthNum, curGroup, itemName)
        totalCumAmt = totalCumAmt + SumAmtToMonth(aggDict, currYear, monthNum, curGroup, itemName)
    Next r

    rowOut = 4
    prevGroup = vbNullString
    Erase groupVals
    Erase totalVals

    For r = 2 To lastLayoutRow
        curGroup = SafeText(wsLayout.Cells(r, 2).Value)
        itemName = SafeText(wsLayout.Cells(r, 3).Value)

        If prevGroup <> vbNullString And curGroup <> prevGroup Then
            WriteSummaryRow ws, rowOut, "소계", groupVals, totalMonthQty, totalMonthAmt, totalCumQty, totalCumAmt
            rowOut = rowOut + 1
            Erase groupVals
        End If

        curQty = GetQty(aggDict, currYear, monthNum, curGroup, itemName)
        prevQty = GetQty(aggDict, prevYear, monthNum, curGroup, itemName)
        curAmt = GetAmt(aggDict, currYear, monthNum, curGroup, itemName)
        prevAmt = GetAmt(aggDict, prevYear, monthNum, curGroup, itemName)
        curCumQty = SumQtyToMonth(aggDict, currYear, monthNum, curGroup, itemName)
        prevCumQty = SumQtyToMonth(aggDict, prevYear, monthNum, curGroup, itemName)
        curCumAmt = SumAmtToMonth(aggDict, currYear, monthNum, curGroup, itemName)
        prevCumAmt = SumAmtToMonth(aggDict, prevYear, monthNum, curGroup, itemName)

        valueArr(1) = curQty
        valueArr(2) = prevQty
        valueArr(3) = YoY(curQty, prevQty)
        valueArr(4) = Share(curQty, totalMonthQty)
        valueArr(5) = curAmt
        valueArr(6) = prevAmt
        valueArr(7) = YoY(curAmt, prevAmt)
        valueArr(8) = Share(curAmt, totalMonthAmt)
        valueArr(9) = curCumQty
        valueArr(10) = prevCumQty
        valueArr(11) = YoY(curCumQty, prevCumQty)
        valueArr(12) = Share(curCumQty, totalCumQty)
        valueArr(13) = curCumAmt
        valueArr(14) = prevCumAmt
        valueArr(15) = YoY(curCumAmt, prevCumAmt)
        valueArr(16) = Share(curCumAmt, totalCumAmt)

        If curGroup <> prevGroup Then
            ws.Cells(rowOut, 1).Value = curGroup
        End If
        ws.Cells(rowOut, 2).Value = itemName
        For i = 1 To 16
            ws.Cells(rowOut, i + 2).Value = valueArr(i)
            groupVals(i) = groupVals(i) + valueArr(i)
            totalVals(i) = totalVals(i) + valueArr(i)
        Next i

        prevGroup = curGroup
        rowOut = rowOut + 1
    Next r

    If prevGroup <> vbNullString Then
        WriteSummaryRow ws, rowOut, "소계", groupVals, totalMonthQty, totalMonthAmt, totalCumQty, totalCumAmt
        rowOut = rowOut + 1
    End If

    WriteSummaryRow ws, rowOut, "합계", totalVals, totalMonthQty, totalMonthAmt, totalCumQty, totalCumAmt, True
    FormatMonthSheet ws, rowOut
End Sub

Private Sub SetupMonthSheetHeader(ByVal ws As Worksheet, ByVal monthNum As Long)
    ws.Range("A1").Value = "1. 제품별 판매현황"
    ws.Range("A2").Value = "구분"
    ws.Range("C2").Value = CStr(monthNum) & "월 당월"
    ws.Range("K2").Value = CStr(monthNum) & "월 누계"
    ws.Range("C3:R3").Value = Array("수량", "전년", "증감", "구성비", "금액", "전년", "YOY", "구성비", "수량", "전년", "YOY", "구성비", "금액", "전년", "YOY", "구성비")

    ws.Range("A1:R1").Font.Bold = True
    ws.Range("A1:R3").Interior.Color = RGB(242, 237, 225)
    ws.Range("A1:R3").HorizontalAlignment = xlCenter
    ws.Range("A1:R3").VerticalAlignment = xlCenter
    ws.Rows(1).RowHeight = 24
    ws.Rows(2).RowHeight = 22
    ws.Rows(3).RowHeight = 22
End Sub

Private Sub WriteSummaryRow(ByVal ws As Worksheet, ByVal rowNum As Long, ByVal labelText As String, ByRef vals() As Double, _
    ByVal totalMonthQty As Double, ByVal totalMonthAmt As Double, ByVal totalCumQty As Double, ByVal totalCumAmt As Double, Optional ByVal isGrandTotal As Boolean = False)
    Dim outVals(1 To 16) As Double
    Dim i As Long

    outVals(1) = vals(1)
    outVals(2) = vals(2)
    outVals(3) = YoY(vals(1), vals(2))
    outVals(4) = Share(vals(1), totalMonthQty)
    outVals(5) = vals(5)
    outVals(6) = vals(6)
    outVals(7) = YoY(vals(5), vals(6))
    outVals(8) = Share(vals(5), totalMonthAmt)
    outVals(9) = vals(9)
    outVals(10) = vals(10)
    outVals(11) = YoY(vals(9), vals(10))
    outVals(12) = Share(vals(9), totalCumQty)
    outVals(13) = vals(13)
    outVals(14) = vals(14)
    outVals(15) = YoY(vals(13), vals(14))
    outVals(16) = Share(vals(13), totalCumAmt)

    ws.Cells(rowNum, 2).Value = labelText
    If isGrandTotal Then ws.Cells(rowNum, 1).Value = "합계"

    For i = 1 To 16
        ws.Cells(rowNum, i + 2).Value = outVals(i)
    Next i

    ws.Rows(rowNum).Font.Bold = True
    ws.Rows(rowNum).Interior.Color = IIf(isGrandTotal, RGB(217, 225, 242), RGB(234, 241, 221))
End Sub

Private Function YoY(ByVal currentValue As Double, ByVal prevValue As Double) As Variant
    If prevValue = 0 Then
        YoY = vbNullString
    Else
        YoY = (currentValue - prevValue) / prevValue
    End If
End Function

Private Function Share(ByVal currentValue As Double, ByVal totalValue As Double) As Variant
    If totalValue = 0 Then
        Share = 0
    Else
        Share = currentValue / totalValue
    End If
End Function

Private Sub FormatMonthSheet(ByVal ws As Worksheet, ByVal lastDataRow As Long)
    Dim percentCols As Variant, col As Variant
    Dim rng As Range

    ws.Columns("A").ColumnWidth = 14
    ws.Columns("B").ColumnWidth = 26
    ws.Columns("C:R").ColumnWidth = 11
    ws.Range("A1:R" & lastDataRow).Borders.LineStyle = xlContinuous
    ws.Range("A4:B" & lastDataRow).HorizontalAlignment = xlLeft
    ws.Range("C4:R" & lastDataRow).HorizontalAlignment = xlRight
    ws.Range("A1:R" & lastDataRow).VerticalAlignment = xlCenter

    percentCols = Array("E", "F", "I", "J", "M", "N", "Q", "R")
    For Each col In percentCols
        Set rng = ws.Range(col & "4:" & col & lastDataRow)
        rng.NumberFormat = "0.0%"
    Next col

    ws.Range("C4:D" & lastDataRow).NumberFormat = "#,##0"
    ws.Range("G4:H" & lastDataRow).NumberFormat = "#,##0"
    ws.Range("K4:L" & lastDataRow).NumberFormat = "#,##0"
    ws.Range("O4:P" & lastDataRow).NumberFormat = "#,##0"
    ws.Range("A4").Select
    ActiveWindow.FreezePanes = True
End Sub

Private Function LastRawRow() As Long
    LastRawRow = ThisWorkbook.Worksheets(RAW_SHEET_INDEX).Cells(ThisWorkbook.Worksheets(RAW_SHEET_INDEX).Rows.Count, 1).End(xlUp).Row
End Function
'@

Set-Content -LiteralPath $modulePath -Value $vbaCode -Encoding UTF8

$excel = $null
$wb = $null

try {
    $excel = New-Object -ComObject Excel.Application
    $excel.Visible = $false
    $excel.DisplayAlerts = $false

    $wb = $excel.Workbooks.Open($xlsxPath)
    $xlOpenXMLWorkbookMacroEnabled = 52
    $wb.SaveAs($xlsmPath, $xlOpenXMLWorkbookMacroEnabled)

    try {
        $vbProject = $wb.VBProject
    } catch {
        throw "VBA 프로젝트 접근이 막혀 있습니다. Excel 옵션에서 'VBA 프로젝트 개체 모델에 안전하게 액세스' 허용이 필요합니다."
    }

    foreach ($component in @($vbProject.VBComponents)) {
        if ($component.Name -eq 'SalesHubModule') {
            $vbProject.VBComponents.Remove($component)
            break
        }
    }

    $module = $vbProject.VBComponents.Add(1)
    $module.Name = 'SalesHubModule'
    $module.CodeModule.AddFromString($vbaCode)

    $hub = $wb.Worksheets.Item(1)

    foreach ($shape in @($hub.Shapes)) {
        if ($shape.Name -like 'btn*') {
            $shape.Delete() | Out-Null
        }
    }

    $btn1 = $hub.Shapes.AddShape(1, 420, 80, 180, 36)
    $btn1.Name = 'btnImportBuild'
    $btn1.TextFrame.Characters().Text = '데이터 불러오기'
    $btn1.Fill.ForeColor.RGB = 13882323
    $btn1.Line.ForeColor.RGB = 10066329
    $btn1.OnAction = 'ImportDataAndBuild'

    $btn2 = $hub.Shapes.AddShape(1, 420, 130, 180, 36)
    $btn2.Name = 'btnRebuild'
    $btn2.TextFrame.Characters().Text = '월별 시트 다시생성'
    $btn2.Fill.ForeColor.RGB = 15527148
    $btn2.Line.ForeColor.RGB = 10066329
    $btn2.OnAction = 'BuildMonthlyYoYSheets'

    foreach ($sheetName in @('DeptRule', 'RawData', 'NormalizedData', 'ReportLayout')) {
        $wb.Worksheets.Item($sheetName).Visible = 0  # xlSheetHidden
    }

    $wb.Save()
}
finally {
    if ($wb -ne $null) { $wb.Close($true) }
    if ($excel -ne $null) {
        $excel.Quit()
        [void][System.Runtime.InteropServices.Marshal]::ReleaseComObject($excel)
    }
    [GC]::Collect()
    [GC]::WaitForPendingFinalizers()
}
