$ErrorActionPreference = "Stop"

$workspace = "C:\Users\MK\Documents\Playground"
$mediaDir = Join-Path $workspace "troiareuke-event-draft-unpacked\ppt\media"
$outputDir = Join-Path $workspace "event-assets"

New-Item -ItemType Directory -Force -Path $outputDir | Out-Null

$ppt = $null
$thumbDeck = $null
$detailDeck = $null

function Set-SolidFill($shape, [int]$r, [int]$g, [int]$b) {
  $shape.Fill.Visible = -1
  $shape.Fill.Solid()
  $shape.Fill.ForeColor.RGB = [int]($r + 256 * $g + 65536 * $b)
}

function Set-LineStyle($shape, [int]$r, [int]$g, [int]$b, [double]$weight = 1.2) {
  $shape.Line.Visible = -1
  $shape.Line.ForeColor.RGB = [int]($r + 256 * $g + 65536 * $b)
  $shape.Line.Weight = $weight
  $shape.Line.Transparency = 0.2
}

function Hide-Line($shape) {
  $shape.Line.Visible = 0
}

function Add-TextBlock($slide, [single]$left, [single]$top, [single]$width, [single]$height, [string]$text, [float]$size, [string]$fontName, [int]$r, [int]$g, [int]$b, [int]$bold = 0) {
  $shape = $slide.Shapes.AddTextbox(1, $left, $top, $width, $height)
  $frame = $shape.TextFrame2
  $frame.TextRange.Text = $text
  $frame.MarginLeft = 0
  $frame.MarginRight = 0
  $frame.MarginTop = 0
  $frame.MarginBottom = 0
  $frame.TextRange.Font.Name = $fontName
  $frame.TextRange.Font.Size = $size
  $frame.TextRange.Font.Bold = $bold
  $frame.TextRange.Font.Fill.ForeColor.RGB = [int]($r + 256 * $g + 65536 * $b)
  return $shape
}

function Add-RoundedPanel($slide, [single]$left, [single]$top, [single]$width, [single]$height, [int]$r, [int]$g, [int]$b) {
  $shape = $slide.Shapes.AddShape(5, $left, $top, $width, $height)
  Set-SolidFill $shape $r $g $b
  Hide-Line $shape
  return $shape
}

function Add-Divider($slide, [single]$left, [single]$top, [single]$width, [int]$r, [int]$g, [int]$b) {
  $line = $slide.Shapes.AddLine($left, $top, $left + $width, $top)
  $line.Line.ForeColor.RGB = [int]($r + 256 * $g + 65536 * $b)
  $line.Line.Weight = 1
  $line.Line.Transparency = 0.45
  return $line
}

function Add-BulletRow($slide, [single]$left, [single]$top, [single]$numberSize, [single]$textLeft, [string]$title, [string]$body) {
  $badge = $slide.Shapes.AddShape(9, $left, $top, 25, 25)
  Set-SolidFill $badge 255 169 35
  Hide-Line $badge
  $badgeText = $badge.TextFrame2
  $badgeText.TextRange.Text = $numberSize
  $badgeText.TextRange.Font.Name = "Pretendard"
  $badgeText.TextRange.Font.Size = 10
  $badgeText.TextRange.Font.Bold = -1
  $badgeText.TextRange.Font.Fill.ForeColor.RGB = [int](20 + 256 * 8 + 65536 * 3)
  $badgeText.VerticalAnchor = 3
  $badge.TextFrame2.TextRange.ParagraphFormat.Alignment = 2

  $titleShape = Add-TextBlock $slide $textLeft $top - 1 500 18 $title 14 "Pretendard" 255 245 232 -1
  $bodyShape = Add-TextBlock $slide $textLeft ($top + 18) 500 30 $body 10.5 "Pretendard" 211 194 177 0
  return @($badge, $titleShape, $bodyShape)
}

try {
  $ppt = New-Object -ComObject PowerPoint.Application
  $ppt.Visible = -1

  $logo = Join-Path $workspace "troiareuke-logo-white-text.png"
  $product = Join-Path $mediaDir "image6.png"
  $mobileRef = Join-Path $mediaDir "image4.jpeg"
  $mask = Join-Path $mediaDir "image7.png"

  $thumbDeck = $ppt.Presentations.Add()
  $thumbDeck.PageSetup.SlideWidth = 645
  $thumbDeck.PageSetup.SlideHeight = 645
  $thumbSlide = $thumbDeck.Slides.Add(1, 12)
  Set-SolidFill $thumbSlide.Background 18 7 3

  $bgGlow = $thumbSlide.Shapes.AddShape(9, 360, 80, 210, 210)
  Set-SolidFill $bgGlow 142 71 14
  Hide-Line $bgGlow
  $bgGlow.Fill.Transparency = 0.32
  $bgGlow.SoftEdge.Radius = 40

  $thumbSlide.Shapes.AddPicture($logo, 0, -1, 34, 28, 110, 24) | Out-Null
  Add-TextBlock $thumbSlide 34 72 180 20 "NEW LAUNCH EVENT" 10.5 "Pretendard" 255 197 109 0 | Out-Null

  Add-TextBlock $thumbSlide 34 112 300 48 "드.디.어" 28 "Pretendard" 255 238 221 0 | Out-Null
  Add-TextBlock $thumbSlide 34 142 380 44 "#속기미크림 출시" 31 "Pretendard" 255 172 43 -1 | Out-Null
  Add-TextBlock $thumbSlide 34 196 360 64 "멜라-소닉 C-인퓨저 크림" 25 "Pretendard" 255 245 233 -1 | Out-Null
  Add-TextBlock $thumbSlide 34 246 330 36 "포토 체험단 모집" 22 "Pretendard" 255 228 192 0 | Out-Null
  Add-TextBlock $thumbSlide 34 283 200 20 "2026.04.13 - 2026.04.16" 12 "Pretendard" 214 193 169 0 | Out-Null
  Add-TextBlock $thumbSlide 34 304 320 18 "MELA-SONIC C-INFUSER CREAM EVENT" 9.5 "Pretendard" 171 150 132 0 | Out-Null

  $thumbSlide.Shapes.AddPicture($product, 0, -1, 240, 120, 360, 360) | Out-Null

  $chip = Add-RoundedPanel $thumbSlide 36 530 186 52 32 14 8
  $chip.Fill.Transparency = 0.06
  Set-LineStyle $chip 255 189 92 1.1
  Add-TextBlock $thumbSlide 56 540 150 16 "체험 인원 5명" 11.5 "Pretendard" 255 202 114 -1 | Out-Null
  Add-TextBlock $thumbSlide 56 557 150 14 "정성 리뷰어 1명 마스크 3매 증정" 8.5 "Pretendard" 224 204 179 0 | Out-Null

  $thumbDeck.SaveAs((Join-Path $outputDir "troiareuke-thumbnail-editable.pptx"))
  $thumbSlide.Export((Join-Path $outputDir "troiareuke-thumbnail.jpg"), "JPG", 860, 860)

  $detailDeck = $ppt.Presentations.Add()
  $detailDeck.PageSetup.SlideWidth = 645
  $detailDeck.PageSetup.SlideHeight = 1350
  $detailSlide = $detailDeck.Slides.Add(1, 12)
  Set-SolidFill $detailSlide.Background 18 7 3

  $topGlow = $detailSlide.Shapes.AddShape(9, 360, 50, 220, 220)
  Set-SolidFill $topGlow 143 70 12
  Hide-Line $topGlow
  $topGlow.Fill.Transparency = 0.38
  $topGlow.SoftEdge.Radius = 48

  $detailSlide.Shapes.AddPicture($logo, 0, -1, 38, 30, 120, 26) | Out-Null
  Add-TextBlock $detailSlide 38 74 220 16 "PHOTO REVIEWER EVENT" 10 "Pretendard" 255 196 109 0 | Out-Null
  Add-TextBlock $detailSlide 38 108 470 54 "멜라-소닉 C-인퓨저 크림" 30 "Pretendard" 255 245 233 -1 | Out-Null
  Add-TextBlock $detailSlide 38 152 360 38 "포토 체험단 모집" 22 "Pretendard" 255 179 55 -1 | Out-Null
  Add-TextBlock $detailSlide 38 188 340 18 "속기미 고민 댓글 참여 후 포토 리뷰 미션" 10.5 "Pretendard" 212 193 170 0 | Out-Null
  Add-TextBlock $detailSlide 38 208 180 18 "2026.04.13 - 2026.04.16" 11.5 "Pretendard" 255 236 212 0 | Out-Null

  $detailSlide.Shapes.AddPicture($product, 0, -1, 315, 72, 260, 260) | Out-Null

  $panel1 = Add-RoundedPanel $detailSlide 38 304 569 150 29 14 8
  $panel1.Fill.Transparency = 0.04
  Set-LineStyle $panel1 255 191 101 1.1
  Add-TextBlock $detailSlide 62 330 180 18 "참여 방법" 14 "Pretendard" 255 200 111 -1 | Out-Null
  Add-BulletRow $detailSlide 62 365 "1" 96 "공식몰 회원가입" "트로이아르케 공식몰 회원가입을 완료해주세요." | Out-Null
  Add-BulletRow $detailSlide 62 401 "2" 96 "기미 · 미백 고민 댓글 남기기" "현재 피부 고민과 기대 포인트를 댓글로 남겨주세요." | Out-Null
  Add-BulletRow $detailSlide 62 437 "3" 96 "포토 리뷰 업로드" "사용 전, 사용 중, 사용 후가 드러나는 리뷰를 등록해주세요." | Out-Null

  $panel2 = Add-RoundedPanel $detailSlide 38 476 569 192 29 14 8
  $panel2.Fill.Transparency = 0.04
  Set-LineStyle $panel2 255 191 101 1.1
  Add-TextBlock $detailSlide 62 500 180 18 "이벤트 정보" 14 "Pretendard" 255 200 111 -1 | Out-Null

  $rows = @(
    @("모집 기간", "2026.04.13(월) - 04.16(목)"),
    @("체험 상품", "멜라-소닉 C-인퓨저 크림 50ml"),
    @("체험 인원", "총 5명"),
    @("당첨자 발표", "2026.04.17(금) 게시물 공지 및 개별 연락"),
    @("체험 기간", "2026.04.20(월) - 04.27(월)")
  )

  $rowTop = 530
  foreach ($row in $rows) {
    Add-TextBlock $detailSlide 62 $rowTop 110 16 $row[0] 10.5 "Pretendard" 171 150 132 0 | Out-Null
    Add-TextBlock $detailSlide 170 $rowTop 380 16 $row[1] 10.5 "Pretendard" 255 242 224 -1 | Out-Null
    Add-Divider $detailSlide 62 ($rowTop + 21) 500 91 57 36 | Out-Null
    $rowTop += 28
  }

  $panel3 = Add-RoundedPanel $detailSlide 38 692 569 220 29 14 8
  $panel3.Fill.Transparency = 0.04
  Set-LineStyle $panel3 255 191 101 1.1
  Add-TextBlock $detailSlide 62 716 180 18 "리뷰 미션" 14 "Pretendard" 255 200 111 -1 | Out-Null
  Add-TextBlock $detailSlide 62 744 500 18 "Before / During / After 3장 이상 필수 첨부" 16 "Pretendard" 255 244 227 -1 | Out-Null

  $missionBox1 = Add-RoundedPanel $detailSlide 62 782 160 84 52 25 14
  $missionBox2 = Add-RoundedPanel $detailSlide 242 782 160 84 52 25 14
  $missionBox3 = Add-RoundedPanel $detailSlide 422 782 160 84 52 25 14
  foreach ($box in @($missionBox1, $missionBox2, $missionBox3)) {
    Set-LineStyle $box 255 189 92 0.8
    $box.Fill.Transparency = 0.1
  }
  Add-TextBlock $detailSlide 82 802 120 14 "사용 전" 11.5 "Pretendard" 255 197 109 -1 | Out-Null
  Add-TextBlock $detailSlide 82 820 120 28 "현재 피부 상태 사진" 9.5 "Pretendard" 244 230 213 0 | Out-Null
  Add-TextBlock $detailSlide 262 802 120 14 "사용 중" 11.5 "Pretendard" 255 197 109 -1 | Out-Null
  Add-TextBlock $detailSlide 262 820 120 28 "제품 사용 장면 또는 제형 사진" 9.5 "Pretendard" 244 230 213 0 | Out-Null
  Add-TextBlock $detailSlide 442 802 120 14 "사용 후" 11.5 "Pretendard" 255 197 109 -1 | Out-Null
  Add-TextBlock $detailSlide 442 820 120 28 "변화된 피부 사진" 9.5 "Pretendard" 244 230 213 0 | Out-Null

  Add-TextBlock $detailSlide 62 878 470 14 "* 피부 변화(Before & After) 사진 포함, 3장 이상 필수 첨부" 10 "Pretendard" 213 193 171 0 | Out-Null

  $panel4 = Add-RoundedPanel $detailSlide 38 936 569 188 29 14 8
  $panel4.Fill.Transparency = 0.04
  Set-LineStyle $panel4 255 191 101 1.1
  Add-TextBlock $detailSlide 62 960 200 18 "우수 체험단 혜택" 14 "Pretendard" 255 200 111 -1 | Out-Null
  Add-TextBlock $detailSlide 62 989 340 42 "베스트 리뷰어 1분께\nGPS 비타-토닝 마스크 3매 증정" 17 "Pretendard" 255 245 233 -1 | Out-Null
  Add-TextBlock $detailSlide 62 1048 320 32 "정성스러운 사용 후기와 피부 변화가 잘 드러난 리뷰를 우선 선정합니다." 10 "Pretendard" 211 194 177 0 | Out-Null
  $detailSlide.Shapes.AddPicture($mask, 0, -1, 420, 950, 136, 136) | Out-Null

  $panel5 = Add-RoundedPanel $detailSlide 38 1148 569 154 29 14 8
  $panel5.Fill.Transparency = 0.04
  Set-LineStyle $panel5 255 191 101 1.1
  Add-TextBlock $detailSlide 62 1172 120 18 "NOTICE" 14 "Pretendard" 255 200 111 -1 | Out-Null
  Add-TextBlock $detailSlide 62 1202 510 66 "· 등록된 사진 및 콘텐츠는 마케팅 목적으로 활용될 수 있습니다.`n· 리뷰 기한 미준수 시 향후 이벤트 참여가 제한될 수 있습니다.`n· 본 이벤트는 내부 사정에 따라 변경 또는 조기 종료될 수 있습니다." 10 "Pretendard" 231 218 202 0 | Out-Null

  Add-TextBlock $detailSlide 38 1312 280 16 "TROIAREUKE MELA-SONIC C-INFUSER CREAM EVENT" 9 "Pretendard" 141 122 107 0 | Out-Null

  $detailDeck.SaveAs((Join-Path $outputDir "troiareuke-detail-editable.pptx"))
  $detailSlide.Export((Join-Path $outputDir "troiareuke-detail.jpg"), "JPG", 860, 1800)
}
finally {
  if ($thumbDeck -ne $null) { $thumbDeck.Close() }
  if ($detailDeck -ne $null) { $detailDeck.Close() }
  if ($ppt -ne $null) { $ppt.Quit() }
  [System.GC]::Collect()
  [System.GC]::WaitForPendingFinalizers()
}
