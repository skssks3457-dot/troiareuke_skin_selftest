Option Explicit

Private Const SHEET_HUB As String = "허브"
Private Const SHEET_MASTER As String = "상품마스터"
Private Const SHEET_RULES As String = "세트규칙"
Private Const SHEET_MAPPING As String = "보고상품명코드매핑"
Private Const SHEET_RAW As String = "RawData"
Private Const SHEET_NORM As String = "NormalizedData"
Private Const SHEET_LOG As String = "ChangeLog"

Private Const BRAND_GROUP_CODE As String = "MK004"
Private Const BRAND_GROUP_NAME As String = "브랜드사업부"
Private Const DEVICE_LINE As String = "미용기기"
Private Const DEVICE_PARTS_NAME As String = "미용기기 부속품"

Public Sub ImportMonthlyFiles()
    Dim fd As FileDialog
    Dim i As Long, importedCount As Long
    Dim wsRaw As Worksheet

    Set fd = Application.FileDialog(msoFileDialogFilePicker)
    With fd
        .Title = "월별 로우데이터 파일 선택"
        .AllowMultiSelect = True
        .InitialFileName = Environ$("USERPROFILE") & "\Desktop\"
        .Filters.Clear
        .Filters.Add "Excel Files", "*.xlsx;*.xlsm;*.xls"
        If .Show <> -1 Then Exit Sub
    End With

    Application.ScreenUpdating = False
    Application.DisplayAlerts = False
    On Error GoTo FailHandler

    Set wsRaw = ThisWorkbook.Worksheets(SHEET_RAW)
    wsRaw.Cells.Clear
    wsRaw.Range("A1:I1").Value = Array("기준월", "연도", "월", "거래처그룹2코드", "거래처그룹2", "품목코드", "품목명", "수량", "합계")

    For i = 1 To fd.SelectedItems.Count
        ImportOneMonthlyFile CStr(fd.SelectedItems(i))
        importedCount = importedCount + 1
    Next i

    ThisWorkbook.Worksheets(SHEET_HUB).Range("E4").Value = importedCount & "개 파일 불러옴"
    ThisWorkbook.Worksheets(SHEET_HUB).Range("E5").Value = Format(Now, "yyyy-mm-dd hh:mm:ss")
    ThisWorkbook.Worksheets(SHEET_HUB).Range("E6").Value = GetImportedMonthCount()
    LogAction "IMPORT", "RawData", importedCount & " file(s)"

    Application.DisplayAlerts = True
    Application.ScreenUpdating = True
    MsgBox "월별 로우데이터 불러오기가 완료되었습니다.", vbInformation
    Exit Sub

FailHandler:
    Application.DisplayAlerts = True
    Application.ScreenUpdating = True
    MsgBox "파일 불러오기 중 오류가 발생했습니다." & vbCrLf & Err.Description, vbExclamation
End Sub

Public Sub RebuildReports()
    Dim wsRaw As Worksheet, wsNorm As Worksheet
    Dim masterDict As Object, ruleDict As Object, mapDict As Object, orderDict As Object
    Dim aggDict As Object, monthDict As Object
    Dim lastRow As Long, outRow As Long, r As Long
    Dim code As String, itemName As String, groupCode As String, groupName As String
    Dim yy As Long, mm As Long, qty As Double, amt As Double, ym As String
    Dim lineName As String, reportName As String
    Dim itemInfo As Variant, ruleList As Collection, oneRule As Variant
    Dim compCode As String, compName As String
    Dim settleQty As Double, actualQty As Double, allocAmt As Double
    Dim ruleKey As String

    Application.ScreenUpdating = False
    Application.DisplayAlerts = False
    On Error GoTo FailHandler

    Set wsRaw = ThisWorkbook.Worksheets(SHEET_RAW)
    Set wsNorm = ThisWorkbook.Worksheets(SHEET_NORM)
    If wsRaw.Cells(wsRaw.Rows.Count, 1).End(xlUp).Row < 2 Then
        MsgBox "먼저 로우데이터를 불러와 주세요.", vbInformation
        GoTo CleanExit
    End If

    Set masterDict = LoadMasterDict()
    Set ruleDict = LoadRuleDict()
    Set mapDict = CreateObject("Scripting.Dictionary")
    Set orderDict = CreateObject("Scripting.Dictionary")
    LoadMappingDict mapDict, orderDict

    Set aggDict = CreateObject("Scripting.Dictionary")
    Set monthDict = CreateObject("Scripting.Dictionary")

    ResetNormalizedSheet wsNorm
    outRow = 2
    lastRow = wsRaw.Cells(wsRaw.Rows.Count, 1).End(xlUp).Row

    For r = 2 To lastRow
        ym = SafeText(wsRaw.Cells(r, 1).Value)
        yy = CLng(SafeNum(wsRaw.Cells(r, 2).Value))
        mm = CLng(SafeNum(wsRaw.Cells(r, 3).Value))
        groupCode = SafeText(wsRaw.Cells(r, 4).Value)
        groupName = SafeText(wsRaw.Cells(r, 5).Value)
        code = SafeText(wsRaw.Cells(r, 6).Value)
        itemName = SafeText(wsRaw.Cells(r, 7).Value)
        qty = SafeNum(wsRaw.Cells(r, 8).Value)
        amt = SafeNum(wsRaw.Cells(r, 9).Value)
        If Len(code) = 0 Then GoTo ContinueLoop
        monthDict(CStr(mm)) = True

        ruleKey = FindRuleKey(code, itemName, ruleDict)
        If Len(ruleKey) > 0 Then
            Set ruleList = ruleDict(ruleKey)
            For Each oneRule In ruleList
                compCode = CStr(oneRule(0))
                compName = CStr(oneRule(1))
                actualQty = qty * CDbl(oneRule(2))
                settleQty = qty * CDbl(oneRule(3))
                allocAmt = amt * CDbl(oneRule(4))
                itemInfo = ResolveItemInfo(compCode, compName, masterDict, mapDict)
                lineName = CStr(itemInfo(1))
                reportName = CStr(itemInfo(2))
                WriteNormalizedRow wsNorm, outRow, ym, yy, mm, groupCode, groupName, code, itemName, compCode, compName, lineName, reportName, qty, actualQty, settleQty, allocAmt, amt, "Y"
                AddAggregate aggDict, yy, mm, lineName, reportName, settleQty, allocAmt
                outRow = outRow + 1
            Next oneRule
        Else
            itemInfo = ResolveItemInfo(code, itemName, masterDict, mapDict)
            lineName = CStr(itemInfo(1))
            reportName = CStr(itemInfo(2))
            WriteNormalizedRow wsNorm, outRow, ym, yy, mm, groupCode, groupName, code, itemName, code, itemName, lineName, reportName, qty, qty, qty, amt, amt, "N"
            AddAggregate aggDict, yy, mm, lineName, reportName, qty, amt
            outRow = outRow + 1
        End If
ContinueLoop:
    Next r

    DeleteGeneratedMonthSheets
    BuildMonthSheets aggDict, monthDict, orderDict
    ThisWorkbook.Worksheets(SHEET_HUB).Range("E5").Value = Format(Now, "yyyy-mm-dd hh:mm:ss")
    ThisWorkbook.Worksheets(SHEET_HUB).Range("E6").Value = GetImportedMonthCount()
    LogAction "REBUILD", "MonthlySheets", outRow - 2 & " normalized rows"
    MsgBox "결과 시트 생성이 완료되었습니다.", vbInformation

CleanExit:
    Application.DisplayAlerts = True
    Application.ScreenUpdating = True
    Exit Sub

FailHandler:
    Application.DisplayAlerts = True
    Application.ScreenUpdating = True
    MsgBox "결과 생성 중 오류가 발생했습니다." & vbCrLf & Err.Description, vbExclamation
End Sub

Public Sub GoToMaster()
    ThisWorkbook.Worksheets(SHEET_MASTER).Activate
End Sub

Public Sub GoToRules()
    ThisWorkbook.Worksheets(SHEET_RULES).Activate
End Sub

Public Sub GoToMapping()
    ThisWorkbook.Worksheets(SHEET_MAPPING).Activate
End Sub

Public Sub DebugImportSpecificFile(ByVal filePath As String)
    Dim wsRaw As Worksheet
    Set wsRaw = ThisWorkbook.Worksheets(SHEET_RAW)
    wsRaw.Cells.Clear
    wsRaw.Range("A1:I1").Value = Array("기준월", "연도", "월", "거래처그룹2코드", "거래처그룹2", "품목코드", "품목명", "수량", "합계")
    ImportOneMonthlyFile filePath
End Sub

Private Sub ImportOneMonthlyFile(ByVal filePath As String)
    Dim wb As Workbook, ws As Worksheet, wsRaw As Worksheet
    Dim lastRow As Long, outRow As Long, r As Long
    Dim monthNum As Long
    Dim groupCode As String, groupName As String, code As String, itemName As String
    Dim qty2026 As Double, amt2026 As Double, qty2025 As Double, amt2025 As Double
    Dim headerA As String, headerB As String, headerC As String
    Dim isCodeLayout As Boolean

    monthNum = ExtractMonthFromText(filePath)
    If monthNum = 0 Then monthNum = ExtractMonthFromText(CStr(ThisWorkbook.Worksheets(SHEET_HUB).Range("E4").Value))

    Set wb = Workbooks.Open(filePath, ReadOnly:=True)
    Set ws = wb.Worksheets(1)
    Set wsRaw = ThisWorkbook.Worksheets(SHEET_RAW)
    outRow = wsRaw.Cells(wsRaw.Rows.Count, 1).End(xlUp).Row + 1
    lastRow = ws.Cells(ws.Rows.Count, 3).End(xlUp).Row
    headerA = SafeText(ws.Cells(2, 1).Value)
    headerB = SafeText(ws.Cells(2, 2).Value)
    headerC = SafeText(ws.Cells(2, 3).Value)
    isCodeLayout = (InStr(headerA, "코드") > 0 Or InStr(headerB, "코드") > 0 Or InStr(headerC, "코드") > 0)

    For r = 4 To lastRow
        If isCodeLayout Then
            groupCode = SafeText(ws.Cells(r, 1).Value)
            groupName = SafeText(ws.Cells(r, 2).Value)
            code = SafeText(ws.Cells(r, 3).Value)
            itemName = SafeText(ws.Cells(r, 4).Value)
        Else
            groupCode = SafeText(ws.Cells(r, 1).Value)
            groupName = SafeText(ws.Cells(r, 2).Value)
            code = SafeText(ws.Cells(r, 4).Value)
            itemName = SafeText(ws.Cells(r, 4).Value)
        End If
        If Len(code) = 0 Or Len(itemName) = 0 Then GoTo NextRow
        qty2026 = SafeNum(ws.Cells(r, 5).Value)
        amt2026 = SafeNum(ws.Cells(r, 8).Value)
        qty2025 = SafeNum(ws.Cells(r, 9).Value)
        amt2025 = SafeNum(ws.Cells(r, 12).Value)

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

Private Function LoadMasterDict() As Object
    Dim dict As Object, ws As Worksheet, lastRow As Long, r As Long, code As String
    Dim itemName As String, lineName As String, divisionName As String, nameKey As String
    Set dict = CreateObject("Scripting.Dictionary")
    Set ws = ThisWorkbook.Worksheets(SHEET_MASTER)
    lastRow = ws.Cells(ws.Rows.Count, 1).End(xlUp).Row
    For r = 2 To lastRow
        code = SafeText(ws.Cells(r, 1).Value)
        itemName = SafeText(ws.Cells(r, 2).Value)
        lineName = SafeText(ws.Cells(r, 3).Value)
        divisionName = SafeText(ws.Cells(r, 4).Value)
        If Len(code) > 0 Then
            dict(code) = Array(code, itemName, lineName, divisionName)
        End If
        nameKey = "NAME|" & NormalizeLookup(itemName)
        If Len(itemName) > 0 And Len(nameKey) > 5 Then
            If Not dict.Exists(nameKey) Then
                dict(nameKey) = Array(code, itemName, lineName, divisionName)
            End If
        End If
    Next r
    Set LoadMasterDict = dict
End Function

Private Function LoadRuleDict() As Object
    Dim dict As Object, coll As Collection, ws As Worksheet
    Dim lastRow As Long, r As Long, setCode As String, setName As String, nameKey As String
    Set dict = CreateObject("Scripting.Dictionary")
    Set ws = ThisWorkbook.Worksheets(SHEET_RULES)
    lastRow = ws.Cells(ws.Rows.Count, 1).End(xlUp).Row
    For r = 2 To lastRow
        setCode = SafeText(ws.Cells(r, 1).Value)
        setName = SafeText(ws.Cells(r, 2).Value)
        If Len(setCode) = 0 Then GoTo ContinueLoop
        If Not dict.Exists(setCode) Then
            Set coll = New Collection
            dict.Add setCode, coll
        End If
        Set coll = dict(setCode)
        coll.Add Array( _
            SafeText(ws.Cells(r, 4).Value), _
            SafeText(ws.Cells(r, 5).Value), _
            SafeNum(ws.Cells(r, 6).Value), _
            SafeNum(ws.Cells(r, 7).Value), _
            SafeNum(ws.Cells(r, 8).Value))
        nameKey = "NAME|" & NormalizeLookup(setName)
        If Len(setName) > 0 And Len(nameKey) > 5 Then
            If Not dict.Exists(nameKey) Then
                Set coll = New Collection
                dict.Add nameKey, coll
            End If
            Set coll = dict(nameKey)
            coll.Add Array( _
                SafeText(ws.Cells(r, 4).Value), _
                SafeText(ws.Cells(r, 5).Value), _
                SafeNum(ws.Cells(r, 6).Value), _
                SafeNum(ws.Cells(r, 7).Value), _
                SafeNum(ws.Cells(r, 8).Value))
        End If
ContinueLoop:
    Next r
    Set LoadRuleDict = dict
End Function

Private Sub LoadMappingDict(ByRef mapDict As Object, ByRef orderDict As Object)
    Dim ws As Worksheet, lastRow As Long, r As Long
    Dim code As String, reportName As String, lineName As String, itemName As String, nameKey As String

    Set ws = ThisWorkbook.Worksheets(SHEET_MAPPING)
    lastRow = ws.Cells(ws.Rows.Count, 1).End(xlUp).Row
    For r = 2 To lastRow
        reportName = SafeText(ws.Cells(r, 1).Value)
        code = SafeText(ws.Cells(r, 2).Value)
        itemName = SafeText(ws.Cells(r, 3).Value)
        lineName = SafeText(ws.Cells(r, 4).Value)
        If Len(code) = 0 Then GoTo ContinueLoop
        mapDict(code) = Array(itemName, lineName, reportName)
        nameKey = "NAME|" & NormalizeLookup(itemName)
        If Len(itemName) > 0 And Len(nameKey) > 5 Then
            If Not mapDict.Exists(nameKey) Then
                mapDict(nameKey) = Array(itemName, lineName, reportName)
            End If
        End If
        If Len(lineName) > 0 And Len(reportName) > 0 Then
            AddReportOrder orderDict, lineName, reportName
        End If
ContinueLoop:
    Next r
End Sub

Private Function ResolveItemInfo(ByVal code As String, ByVal itemName As String, ByVal masterDict As Object, ByVal mapDict As Object) As Variant
    Dim lineName As String, reportName As String, displayName As String
    Dim nameKey As String

    nameKey = "NAME|" & NormalizeLookup(itemName)

    If mapDict.Exists(code) Then
        displayName = CStr(mapDict(code)(0))
        lineName = CStr(mapDict(code)(1))
        reportName = CStr(mapDict(code)(2))
    ElseIf mapDict.Exists(nameKey) Then
        displayName = CStr(mapDict(nameKey)(0))
        lineName = CStr(mapDict(nameKey)(1))
        reportName = CStr(mapDict(nameKey)(2))
    ElseIf masterDict.Exists(code) Then
        displayName = CStr(masterDict(code)(1))
        lineName = CStr(masterDict(code)(2))
        reportName = vbNullString
    ElseIf masterDict.Exists(nameKey) Then
        displayName = CStr(masterDict(nameKey)(1))
        lineName = CStr(masterDict(nameKey)(2))
        reportName = vbNullString
    Else
        displayName = itemName
        lineName = InferLine(code, itemName, vbNullString)
        reportName = vbNullString
    End If

    If Len(lineName) = 0 Then lineName = InferLine(code, itemName, vbNullString)
    If Len(reportName) = 0 Then reportName = FallbackReportName(lineName)
    ResolveItemInfo = Array(displayName, lineName, reportName)
End Function

Private Function InferLine(ByVal code As String, ByVal itemName As String, ByVal fallbackLine As String) As String
    Dim codeU As String
    If Len(fallbackLine) > 0 Then
        InferLine = fallbackLine
        Exit Function
    End If

    codeU = UCase$(code)
    If Left$(codeU, 4) = "MKBD" Or InStr(itemName, "미용기기") > 0 Then
        InferLine = DEVICE_LINE
    ElseIf Left$(codeU, 4) = "SDDH" Or InStr(itemName, "담향") > 0 Then
        InferLine = "담향"
    ElseIf Left$(codeU, 4) = "MKMM" Or InStr(itemName, "밀리맘") > 0 Then
        InferLine = "밀리맘"
    ElseIf Left$(codeU, 4) = "MKAC" Or InStr(itemName, "악센") > 0 Then
        InferLine = "악센"
    ElseIf Left$(codeU, 4) = "MKTS" Or InStr(itemName, "서울") > 0 Then
        InferLine = "서울"
    Else
        InferLine = "트로이아르케"
    End If
End Function

Private Function FallbackReportName(ByVal lineName As String) As String
    If lineName = DEVICE_LINE Then
        FallbackReportName = DEVICE_PARTS_NAME
    Else
        FallbackReportName = "기타"
    End If
End Function

Private Function NormalizeLookup(ByVal textValue As String) As String
    Dim result As String
    result = UCase$(Trim$(textValue))
    result = Replace(result, " ", "")
    result = Replace(result, vbTab, "")
    result = Replace(result, vbCr, "")
    result = Replace(result, vbLf, "")
    result = Replace(result, "-", "")
    result = Replace(result, "_", "")
    result = Replace(result, "/", "")
    result = Replace(result, "(", "")
    result = Replace(result, ")", "")
    result = Replace(result, "[", "")
    result = Replace(result, "]", "")
    result = Replace(result, ",", "")
    result = Replace(result, ".", "")
    result = Replace(result, "사용중단", "")
    NormalizeLookup = result
End Function

Private Function FindRuleKey(ByVal code As String, ByVal itemName As String, ByVal ruleDict As Object) As String
    Dim nameKey As String
    If ruleDict.Exists(code) Then
        FindRuleKey = code
        Exit Function
    End If
    nameKey = "NAME|" & NormalizeLookup(itemName)
    If ruleDict.Exists(nameKey) Then
        FindRuleKey = nameKey
    End If
End Function

Private Sub ResetNormalizedSheet(ByVal ws As Worksheet)
    ws.Cells.Clear
    ws.Range("A1:Q1").Value = Array("기준월", "연도", "월", "거래처그룹2코드", "거래처그룹2", "원본품목코드", "원본품목명", "집계품목코드", "집계품목명", "라인", "보고상품명", "원본수량", "실물수량", "정산수량", "비교매출", "원본합계", "세트환산여부")
End Sub

Private Sub WriteNormalizedRow(ByVal ws As Worksheet, ByVal outRow As Long, ByVal ym As String, ByVal yy As Long, ByVal mm As Long, _
    ByVal groupCode As String, ByVal groupName As String, ByVal srcCode As String, ByVal srcName As String, _
    ByVal itemCode As String, ByVal itemName As String, ByVal lineName As String, ByVal reportName As String, _
    ByVal srcQty As Double, ByVal actualQty As Double, ByVal settleQty As Double, ByVal compareAmt As Double, ByVal srcAmt As Double, ByVal expandedFlag As String)
    ws.Cells(outRow, 1).Resize(1, 17).Value = Array(ym, yy, mm, groupCode, groupName, srcCode, srcName, itemCode, itemName, lineName, reportName, srcQty, actualQty, settleQty, compareAmt, srcAmt, expandedFlag)
End Sub

Private Sub AddAggregate(ByVal dict As Object, ByVal yy As Long, ByVal mm As Long, ByVal lineName As String, ByVal reportName As String, ByVal qty As Double, ByVal amt As Double)
    Dim key As String, arr As Variant
    key = yy & "|" & mm & "|" & lineName & "|" & reportName
    If dict.Exists(key) Then
        arr = dict(key)
        arr(0) = arr(0) + qty
        arr(1) = arr(1) + amt
        dict(key) = arr
    Else
        dict.Add key, Array(qty, amt)
    End If
End Sub

Private Sub AddReportOrder(ByRef orderDict As Object, ByVal lineName As String, ByVal reportName As String)
    Dim coll As Collection, v As Variant
    If Not orderDict.Exists(lineName) Then
        Set coll = New Collection
        orderDict.Add lineName, coll
    End If
    Set coll = orderDict(lineName)
    For Each v In coll
        If CStr(v) = reportName Then Exit Sub
    Next v
    coll.Add reportName
End Sub

Private Sub BuildMonthSheets(ByVal aggDict As Object, ByVal monthDict As Object, ByVal orderDict As Object)
    Dim arr As Variant, i As Long
    arr = SortedMonthKeys(monthDict)
    For i = LBound(arr) To UBound(arr)
        BuildOneMonthSheet CLng(arr(i)), aggDict, orderDict
    Next i
End Sub

Private Sub BuildOneMonthSheet(ByVal monthNum As Long, ByVal aggDict As Object, ByVal orderDict As Object)
    Dim ws As Worksheet, rowOut As Long
    Dim lineNames As Variant, lineName As Variant, reportNames As Collection, reportName As Variant
    Dim lineStart As Long, lineEnd As Long
    Dim monthTotalQty As Double, monthTotalAmt As Double, cumTotalQty As Double, cumTotalAmt As Double
    Dim lineVals(1 To 8) As Double, troiaVals(1 To 8) As Double, grandVals(1 To 8) As Double, vals(1 To 8) As Double

    Set ws = ThisWorkbook.Worksheets.Add(After:=ThisWorkbook.Worksheets(ThisWorkbook.Worksheets.Count))
    ws.Name = CStr(monthNum) & "월"
    SetupMonthSheetHeader ws, monthNum

    lineNames = Array("트로이아르케", "악센", "서울", "미용기기", "담향", "밀리맘", "기타")
    monthTotalQty = TotalMonthQty(aggDict, monthNum)
    monthTotalAmt = TotalMonthAmt(aggDict, monthNum)
    cumTotalQty = TotalCumQty(aggDict, monthNum)
    cumTotalAmt = TotalCumAmt(aggDict, monthNum)

    rowOut = 5
    For Each lineName In lineNames
        Set reportNames = GetReportNamesForLine(CStr(lineName), orderDict, aggDict)
        If reportNames.Count = 0 Then GoTo ContinueLine
        Erase lineVals
        lineStart = rowOut

        For Each reportName In reportNames
            vals(1) = GetQty(aggDict, 2026, monthNum, CStr(lineName), CStr(reportName))
            vals(2) = GetQty(aggDict, 2025, monthNum, CStr(lineName), CStr(reportName))
            vals(3) = GetAmt(aggDict, 2026, monthNum, CStr(lineName), CStr(reportName))
            vals(4) = GetAmt(aggDict, 2025, monthNum, CStr(lineName), CStr(reportName))
            vals(5) = SumQtyToMonth(aggDict, 2026, monthNum, CStr(lineName), CStr(reportName))
            vals(6) = SumQtyToMonth(aggDict, 2025, monthNum, CStr(lineName), CStr(reportName))
            vals(7) = SumAmtToMonth(aggDict, 2026, monthNum, CStr(lineName), CStr(reportName))
            vals(8) = SumAmtToMonth(aggDict, 2025, monthNum, CStr(lineName), CStr(reportName))

            WriteDataRow ws, rowOut, vbNullString, CStr(reportName), vals, monthTotalQty, monthTotalAmt, cumTotalQty, cumTotalAmt, False
            AddEight lineVals, vals
            AddEight grandVals, vals
            If CStr(lineName) = "트로이아르케" Or CStr(lineName) = "악센" Then AddEight troiaVals, vals
            rowOut = rowOut + 1
        Next reportName

        lineEnd = rowOut - 1
        MergeLineLabel ws, lineStart, lineEnd, CStr(lineName)
        WriteDataRow ws, rowOut, vbNullString, CStr(lineName) & " 소계", lineVals, monthTotalQty, monthTotalAmt, cumTotalQty, cumTotalAmt, True
        rowOut = rowOut + 1

        If CStr(lineName) = "악센" Then
            WriteDataRow ws, rowOut, vbNullString, "트로이아르케 전체", troiaVals, monthTotalQty, monthTotalAmt, cumTotalQty, cumTotalAmt, True
            rowOut = rowOut + 1
        End If
ContinueLine:
    Next lineName

    WriteDataRow ws, rowOut, vbNullString, "전체 소계", grandVals, monthTotalQty, monthTotalAmt, cumTotalQty, cumTotalAmt, True, True
    FormatMonthSheet ws, rowOut
End Sub

Private Sub SetupMonthSheetHeader(ByVal ws As Worksheet, ByVal monthNum As Long)
    ws.Range("A1:R1").Merge
    ws.Range("A1").Value = "1. 제품별 판매현황"
    ws.Range("A2:B4").Merge
    ws.Range("A2").Value = "구분"
    ws.Range("C2:J2").Merge
    ws.Range("C2").Value = monthNum & "월 당월"
    ws.Range("K2:R2").Merge
    ws.Range("K2").Value = monthNum & "월 누계"
    ws.Range("C3:F3").Merge
    ws.Range("C3").Value = "판매수량"
    ws.Range("G3:J3").Merge
    ws.Range("G3").Value = "판매실적"
    ws.Range("K3:N3").Merge
    ws.Range("K3").Value = "판매수량"
    ws.Range("O3:R3").Merge
    ws.Range("O3").Value = "판매실적"
    ws.Range("C4:R4").Value = Array("수량", "전년", "증감", "구성비", "금액", "전년", "YOY", "구성비", "수량", "전년", "YOY", "구성비", "금액", "전년", "YOY", "구성비")

    ws.Range("A2:R4").Interior.Color = RGB(220, 230, 241)
    ws.Range("A2:R4").Font.Bold = True
    ws.Range("A2:R4").HorizontalAlignment = xlCenter
    ws.Range("A2:R4").VerticalAlignment = xlCenter
    ws.Range("A1").Font.Bold = True
    ws.Range("A1").Font.Size = 12
End Sub

Private Sub WriteDataRow(ByVal ws As Worksheet, ByVal rowNum As Long, ByVal lineLabel As String, ByVal itemLabel As String, _
    ByRef vals() As Double, ByVal totalMonthQty As Double, ByVal totalMonthAmt As Double, ByVal totalCumQty As Double, ByVal totalCumAmt As Double, _
    ByVal isSubtotal As Boolean, Optional ByVal isGrand As Boolean = False)
    Dim outArr(1 To 16) As Variant
    If Len(lineLabel) > 0 Then ws.Cells(rowNum, 1).Value = lineLabel
    ws.Cells(rowNum, 2).Value = itemLabel
    outArr(1) = vals(1)
    outArr(2) = vals(2)
    outArr(3) = YoY(vals(1), vals(2))
    outArr(4) = Share(vals(1), totalMonthQty)
    outArr(5) = vals(3)
    outArr(6) = vals(4)
    outArr(7) = YoY(vals(3), vals(4))
    outArr(8) = Share(vals(3), totalMonthAmt)
    outArr(9) = vals(5)
    outArr(10) = vals(6)
    outArr(11) = YoY(vals(5), vals(6))
    outArr(12) = Share(vals(5), totalCumQty)
    outArr(13) = vals(7)
    outArr(14) = vals(8)
    outArr(15) = YoY(vals(7), vals(8))
    outArr(16) = Share(vals(7), totalCumAmt)
    ws.Cells(rowNum, 3).Resize(1, 16).Value = outArr

    If isGrand Then
        ws.Rows(rowNum).Interior.Color = RGB(198, 217, 241)
        ws.Rows(rowNum).Font.Bold = True
    ElseIf isSubtotal Then
        ws.Rows(rowNum).Interior.Color = RGB(217, 226, 243)
        ws.Rows(rowNum).Font.Bold = True
    End If
End Sub

Private Sub FormatMonthSheet(ByVal ws As Worksheet, ByVal lastRow As Long)
    Dim c As Variant
    ws.Range("A1:R" & lastRow).Borders.LineStyle = xlContinuous
    ws.Columns("A").ColumnWidth = 14
    ws.Columns("B").ColumnWidth = 22
    ws.Columns("C:F").ColumnWidth = 9
    ws.Columns("G:H").ColumnWidth = 16
    ws.Columns("I:J").ColumnWidth = 9
    ws.Columns("K:N").ColumnWidth = 9
    ws.Columns("O:P").ColumnWidth = 16
    ws.Columns("Q:R").ColumnWidth = 9
    ws.Range("C5:D" & lastRow).NumberFormat = "#,##0"
    ws.Range("G5:H" & lastRow).NumberFormat = """₩""#,##0"
    ws.Range("K5:L" & lastRow).NumberFormat = "#,##0"
    ws.Range("O5:P" & lastRow).NumberFormat = """₩""#,##0"
    For Each c In Array("E", "F", "I", "J", "M", "N", "Q", "R")
        ws.Range(c & "5:" & c & lastRow).NumberFormat = "0.0%"
    Next c
    ws.Range("C5").Select
    ActiveWindow.FreezePanes = True
End Sub

Private Sub MergeLineLabel(ByVal ws As Worksheet, ByVal startRow As Long, ByVal endRow As Long, ByVal textVal As String)
    If startRow > endRow Then Exit Sub
    If startRow < endRow Then ws.Range(ws.Cells(startRow, 1), ws.Cells(endRow, 1)).Merge
    ws.Cells(startRow, 1).Value = textVal
    ws.Cells(startRow, 1).HorizontalAlignment = xlCenter
    ws.Cells(startRow, 1).VerticalAlignment = xlCenter
End Sub

Private Function GetReportNamesForLine(ByVal lineName As String, ByVal orderDict As Object, ByVal aggDict As Object) As Collection
    Dim coll As New Collection, seen As Object, key As Variant, parts() As String, extraName As String, v As Variant
    Set seen = CreateObject("Scripting.Dictionary")
    If orderDict.Exists(lineName) Then
        For Each v In orderDict(lineName)
            coll.Add v
            seen(CStr(v)) = True
        Next v
    End If
    For Each key In aggDict.Keys
        parts = Split(CStr(key), "|")
        If UBound(parts) >= 3 Then
            If parts(2) = lineName Then
                If Not seen.Exists(parts(3)) Then
                    coll.Add parts(3)
                    seen(parts(3)) = True
                End If
            End If
        End If
    Next key
    extraName = IIf(lineName = DEVICE_LINE, DEVICE_PARTS_NAME, "기타")
    If Not seen.Exists(extraName) Then coll.Add extraName
    Set GetReportNamesForLine = coll
End Function

Private Function GetQty(ByVal aggDict As Object, ByVal yy As Long, ByVal mm As Long, ByVal lineName As String, ByVal reportName As String) As Double
    Dim key As String
    key = yy & "|" & mm & "|" & lineName & "|" & reportName
    If aggDict.Exists(key) Then GetQty = CDbl(aggDict(key)(0))
End Function

Private Function GetAmt(ByVal aggDict As Object, ByVal yy As Long, ByVal mm As Long, ByVal lineName As String, ByVal reportName As String) As Double
    Dim key As String
    key = yy & "|" & mm & "|" & lineName & "|" & reportName
    If aggDict.Exists(key) Then GetAmt = CDbl(aggDict(key)(1))
End Function

Private Function SumQtyToMonth(ByVal aggDict As Object, ByVal yy As Long, ByVal monthNum As Long, ByVal lineName As String, ByVal reportName As String) As Double
    Dim m As Long
    For m = 1 To monthNum
        SumQtyToMonth = SumQtyToMonth + GetQty(aggDict, yy, m, lineName, reportName)
    Next m
End Function

Private Function SumAmtToMonth(ByVal aggDict As Object, ByVal yy As Long, ByVal monthNum As Long, ByVal lineName As String, ByVal reportName As String) As Double
    Dim m As Long
    For m = 1 To monthNum
        SumAmtToMonth = SumAmtToMonth + GetAmt(aggDict, yy, m, lineName, reportName)
    Next m
End Function

Private Function TotalMonthQty(ByVal aggDict As Object, ByVal monthNum As Long) As Double
    Dim key As Variant, parts() As String
    For Each key In aggDict.Keys
        parts = Split(CStr(key), "|")
        If CLng(parts(0)) = 2026 And CLng(parts(1)) = monthNum Then TotalMonthQty = TotalMonthQty + CDbl(aggDict(key)(0))
    Next key
End Function

Private Function TotalMonthAmt(ByVal aggDict As Object, ByVal monthNum As Long) As Double
    Dim key As Variant, parts() As String
    For Each key In aggDict.Keys
        parts = Split(CStr(key), "|")
        If CLng(parts(0)) = 2026 And CLng(parts(1)) = monthNum Then TotalMonthAmt = TotalMonthAmt + CDbl(aggDict(key)(1))
    Next key
End Function

Private Function TotalCumQty(ByVal aggDict As Object, ByVal monthNum As Long) As Double
    Dim key As Variant, parts() As String
    For Each key In aggDict.Keys
        parts = Split(CStr(key), "|")
        If CLng(parts(0)) = 2026 And CLng(parts(1)) <= monthNum Then TotalCumQty = TotalCumQty + CDbl(aggDict(key)(0))
    Next key
End Function

Private Function TotalCumAmt(ByVal aggDict As Object, ByVal monthNum As Long) As Double
    Dim key As Variant, parts() As String
    For Each key In aggDict.Keys
        parts = Split(CStr(key), "|")
        If CLng(parts(0)) = 2026 And CLng(parts(1)) <= monthNum Then TotalCumAmt = TotalCumAmt + CDbl(aggDict(key)(1))
    Next key
End Function

Private Function SortedMonthKeys(ByVal monthDict As Object) As Variant
    Dim arr() As Long, i As Long, j As Long, tmp As Long, key As Variant
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
    Dim keep As Object, idx As Long, ws As Worksheet
    Set keep = CreateObject("Scripting.Dictionary")
    keep(SHEET_HUB) = True
    keep(SHEET_MASTER) = True
    keep(SHEET_RULES) = True
    keep(SHEET_MAPPING) = True
    keep(SHEET_RAW) = True
    keep(SHEET_NORM) = True
    keep(SHEET_LOG) = True
    For idx = ThisWorkbook.Worksheets.Count To 1 Step -1
        Set ws = ThisWorkbook.Worksheets(idx)
        If Not keep.Exists(ws.Name) Then ws.Delete
    Next idx
End Sub

Private Function ExtractMonthFromText(ByVal textValue As String) As Long
    Dim i As Long, ch As String, num As String
    For i = 1 To Len(textValue)
        ch = Mid$(textValue, i, 1)
        If ch Like "#" Then
            num = num & ch
        ElseIf Len(num) > 0 Then
            Exit For
        End If
    Next i
    If Len(num) > 0 Then ExtractMonthFromText = CLng(num)
End Function

Private Function YoY(ByVal currentValue As Double, ByVal prevValue As Double) As Variant
    If prevValue = 0 Then
        If currentValue = 0 Then
            YoY = 0
        Else
            YoY = 1
        End If
    Else
        YoY = (currentValue / prevValue) - 1
    End If
End Function

Private Function Share(ByVal valueNum As Double, ByVal totalNum As Double) As Variant
    If totalNum = 0 Then
        Share = 0
    Else
        Share = valueNum / totalNum
    End If
End Function

Private Function SafeText(ByVal value As Variant) As String
    If IsError(value) Or IsNull(value) Or IsEmpty(value) Then
        SafeText = vbNullString
    Else
        SafeText = Trim$(CStr(value))
    End If
End Function

Private Function SafeNum(ByVal value As Variant) As Double
    If IsError(value) Or IsNull(value) Or IsEmpty(value) Or value = "" Then
        SafeNum = 0
    Else
        SafeNum = CDbl(value)
    End If
End Function

Private Sub AddEight(ByRef target() As Double, ByRef source() As Double)
    Dim i As Long
    For i = 1 To 8
        target(i) = target(i) + source(i)
    Next i
End Sub

Private Function GetImportedMonthCount() As Long
    Dim ws As Worksheet, lastRow As Long, dict As Object, r As Long
    Set ws = ThisWorkbook.Worksheets(SHEET_RAW)
    Set dict = CreateObject("Scripting.Dictionary")
    lastRow = ws.Cells(ws.Rows.Count, 1).End(xlUp).Row
    For r = 2 To lastRow
        If Len(SafeText(ws.Cells(r, 1).Value)) > 0 Then dict(SafeText(ws.Cells(r, 1).Value)) = True
    Next r
    GetImportedMonthCount = dict.Count
End Function

Private Sub LogAction(ByVal actionName As String, ByVal targetName As String, ByVal noteText As String)
    Dim ws As Worksheet, nextRow As Long
    Set ws = ThisWorkbook.Worksheets(SHEET_LOG)
    nextRow = ws.Cells(ws.Rows.Count, 1).End(xlUp).Row + 1
    ws.Cells(nextRow, 1).Resize(1, 5).Value = Array(Format(Now, "yyyy-mm-dd hh:mm:ss"), Environ$("USERNAME"), actionName, targetName, noteText)
End Sub
