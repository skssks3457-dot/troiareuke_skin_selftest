$ErrorActionPreference = 'Stop'

$workdir = 'C:\Users\MK\Documents\Playground'
$modulePath = Join-Path $workdir 'distribution_hub_module.bas'
$defaultTarget = Join-Path $workdir '전사 제품별 판매실적_프로그램.xlsm'
$desktopTarget = Join-Path $env:USERPROFILE 'Desktop\전사 제품별 판매실적_프로그램.xlsm'

if (Test-Path -LiteralPath $desktopTarget) {
    $xlsmPath = $desktopTarget
} elseif (Test-Path -LiteralPath $defaultTarget) {
    $xlsmPath = $defaultTarget
} else {
    throw '대상 xlsm 파일을 찾지 못했습니다.'
}

if (-not (Test-Path -LiteralPath $modulePath)) {
    throw 'VBA 모듈 파일을 찾지 못했습니다.'
}

$excel = $null
$wb = $null
$vbProject = $null
$module = $null
$hub = $null

try {
    $excel = New-Object -ComObject Excel.Application
    $excel.Visible = $false
    $excel.DisplayAlerts = $false

    $wb = $excel.Workbooks.Open($xlsmPath)
    $vbProject = $wb.VBProject

    foreach ($component in @($vbProject.VBComponents)) {
        if ($component.Type -eq 1 -or $component.Type -eq 2 -or $component.Type -eq 3) {
            if ($component.Name -ne 'ThisWorkbook' -and -not $component.Name.StartsWith('Sheet')) {
                $vbProject.VBComponents.Remove($component)
            }
        }
    }

    $moduleCode = Get-Content -LiteralPath $modulePath -Raw -Encoding UTF8
    $module = $vbProject.VBComponents.Add(1)
    $module.Name = 'SalesProgramModule'
    $module.CodeModule.AddFromString($moduleCode)

    $hub = $wb.Worksheets.Item(1)
    foreach ($shape in @($hub.Shapes)) {
        if ($shape.Name -like 'CodexBtn*') {
            $shape.Delete()
        }
    }

    $btn1 = $hub.Shapes.AddShape(1, 420, 80, 180, 34)
    $btn1.Name = 'CodexBtnImport'
    $btn1.TextFrame.Characters().Text = '월별 데이터 불러오기'
    $btn1.OnAction = 'ImportMonthlyFiles'

    $btn2 = $hub.Shapes.AddShape(1, 420, 124, 180, 34)
    $btn2.Name = 'CodexBtnBuild'
    $btn2.TextFrame.Characters().Text = '결과 다시 생성'
    $btn2.OnAction = 'RebuildReports'

    $btn3 = $hub.Shapes.AddShape(1, 420, 168, 180, 30)
    $btn3.Name = 'CodexBtnMaster'
    $btn3.TextFrame.Characters().Text = '상품마스터 열기'
    $btn3.OnAction = 'GoToMaster'

    $btn4 = $hub.Shapes.AddShape(1, 420, 206, 180, 30)
    $btn4.Name = 'CodexBtnRules'
    $btn4.TextFrame.Characters().Text = '세트규칙 열기'
    $btn4.OnAction = 'GoToRules'

    $btn5 = $hub.Shapes.AddShape(1, 420, 244, 180, 30)
    $btn5.Name = 'CodexBtnMapping'
    $btn5.TextFrame.Characters().Text = '보고매핑 열기'
    $btn5.OnAction = 'GoToMapping'

    foreach ($btn in @($btn1, $btn2, $btn3, $btn4, $btn5)) {
        $btn.Fill.ForeColor.RGB = 15773696
        $btn.Line.ForeColor.RGB = 7829367
        $btn.TextFrame.HorizontalAlignment = -4108
        $btn.TextFrame.VerticalAlignment = -4108
        $btn.TextFrame.Characters().Font.Size = 11
        $btn.TextFrame.Characters().Font.Bold = $true
    }

    $wb.Save()
    $wb.Close($true)
    $excel.Quit()
}
catch {
    if ($wb) { $wb.Close($false) }
    if ($excel) { $excel.Quit() }
    throw
}
finally {
    if ($hub) { $null = [System.Runtime.InteropServices.Marshal]::ReleaseComObject($hub) }
    if ($module) { $null = [System.Runtime.InteropServices.Marshal]::ReleaseComObject($module) }
    if ($vbProject) { $null = [System.Runtime.InteropServices.Marshal]::ReleaseComObject($vbProject) }
    if ($wb) { $null = [System.Runtime.InteropServices.Marshal]::ReleaseComObject($wb) }
    if ($excel) { $null = [System.Runtime.InteropServices.Marshal]::ReleaseComObject($excel) }
    [GC]::Collect()
    [GC]::WaitForPendingFinalizers()
}
