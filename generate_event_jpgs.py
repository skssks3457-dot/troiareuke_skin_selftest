from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont


WORKSPACE = Path(r"C:\Users\MK\Documents\Playground")
MEDIA = WORKSPACE / "troiareuke-event-draft-unpacked" / "ppt" / "media"
OUT = WORKSPACE / "event-assets"
OUT.mkdir(exist_ok=True)

LOGO_PATH = WORKSPACE / "troiareuke-logo-white-text.png"
PRODUCT_PATH = MEDIA / "image6.png"
MASK_PATH = MEDIA / "image7.png"

FONT_REGULAR = r"C:\Windows\Fonts\malgun.ttf"
FONT_BOLD = r"C:\Windows\Fonts\malgunbd.ttf"


def font(path: str, size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(path, size)


def vertical_gradient(size: tuple[int, int], top: tuple[int, int, int], bottom: tuple[int, int, int]) -> Image.Image:
    width, height = size
    base = Image.new("RGB", size, top)
    draw = ImageDraw.Draw(base)
    for y in range(height):
        t = y / max(1, height - 1)
        color = tuple(int(top[i] * (1 - t) + bottom[i] * t) for i in range(3))
        draw.line((0, y, width, y), fill=color)
    return base


def add_glow(img: Image.Image, center: tuple[int, int], radius: int, color: tuple[int, int, int], alpha: int) -> None:
    layer = Image.new("RGBA", img.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    x, y = center
    draw.ellipse((x - radius, y - radius, x + radius, y + radius), fill=(*color, alpha))
    layer = layer.filter(ImageFilter.GaussianBlur(radius // 2))
    img.alpha_composite(layer)


def fit_image(img: Image.Image, box: tuple[int, int]) -> Image.Image:
    width, height = box
    image = img.copy().convert("RGBA")
    image.thumbnail((width, height))
    canvas = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    x = (width - image.width) // 2
    y = (height - image.height) // 2
    canvas.alpha_composite(image, (x, y))
    return canvas


def rounded_panel(draw: ImageDraw.ImageDraw, xy: tuple[int, int, int, int], radius: int, fill, outline=None, width: int = 1) -> None:
    draw.rounded_rectangle(xy, radius=radius, fill=fill, outline=outline, width=width)


def save_rgb(img: Image.Image, path: Path) -> None:
    img.convert("RGB").save(path, quality=95)


logo = Image.open(LOGO_PATH).convert("RGBA")
product = Image.open(PRODUCT_PATH).convert("RGBA")
mask = Image.open(MASK_PATH).convert("RGBA")

accent = (255, 191, 92)
white = (250, 242, 234)
soft = (219, 198, 177)


def build_thumbnail() -> None:
    thumb = vertical_gradient((860, 860), (19, 7, 3), (45, 19, 8)).convert("RGBA")
    add_glow(thumb, (610, 220), 180, (239, 137, 28), 135)
    add_glow(thumb, (330, 520), 120, (255, 200, 120), 65)

    draw = ImageDraw.Draw(thumb)
    rounded_panel(draw, (24, 24, 836, 836), 34, fill=None, outline=(116, 71, 37, 140), width=1)

    thumb.alpha_composite(fit_image(logo, (170, 36)), (44, 38))
    thumb.alpha_composite(fit_image(product, (470, 470)), (350, 180))

    small = font(FONT_REGULAR, 23)
    small_bold = font(FONT_BOLD, 24)
    mid = font(FONT_BOLD, 42)
    large = font(FONT_BOLD, 62)
    large2 = font(FONT_BOLD, 48)
    body = font(FONT_REGULAR, 22)

    draw.text((46, 98), "NEW LAUNCH EVENT", font=small, fill=accent)
    draw.text((46, 146), "드.디.어", font=mid, fill=white)
    draw.text((46, 196), "#속기미크림 출시", font=large2, fill=(255, 169, 33))
    draw.text((46, 282), "멜라-소닉\nC-인퓨저 크림", font=large, fill=white, spacing=0)
    draw.text((46, 430), "포토 체험단 모집", font=mid, fill=(255, 224, 186))
    draw.text((46, 486), "2026.04.13 - 2026.04.16", font=small_bold, fill=soft)
    draw.text((46, 522), "MELA-SONIC C-INFUSER CREAM EVENT", font=body, fill=(163, 143, 124))

    rounded_panel(draw, (42, 710, 338, 796), 28, fill=(27, 12, 7, 220), outline=(255, 193, 103, 130), width=2)
    draw.text((68, 733), "체험 인원 5명", font=small_bold, fill=accent)
    draw.text((68, 766), "베스트 리뷰어 1명\nGPS 비타-토닝 마스크 3매 증정", font=body, fill=white, spacing=4)

    save_rgb(thumb, OUT / "troiareuke-thumbnail.jpg")


def build_detail() -> None:
    img = vertical_gradient((860, 1800), (19, 7, 3), (32, 13, 6)).convert("RGBA")
    add_glow(img, (650, 180), 220, (243, 141, 30), 120)
    add_glow(img, (220, 1180), 180, (90, 52, 22), 70)

    draw = ImageDraw.Draw(img)
    rounded_panel(draw, (24, 24, 836, 1776), 36, fill=None, outline=(116, 71, 37, 120), width=1)

    img.alpha_composite(fit_image(logo, (180, 40)), (52, 44))
    img.alpha_composite(fit_image(product, (360, 360)), (470, 70))

    draw.text((52, 106), "PHOTO REVIEWER EVENT", font=font(FONT_REGULAR, 20), fill=accent)
    draw.text((52, 150), "멜라-소닉 C-인퓨저 크림", font=font(FONT_BOLD, 54), fill=white)
    draw.text((52, 218), "포토 체험단 모집", font=font(FONT_BOLD, 40), fill=(255, 173, 42))
    draw.text((52, 274), "속기미 고민 댓글 참여 후 포토 리뷰 미션", font=font(FONT_REGULAR, 24), fill=soft)
    draw.text((52, 312), "2026.04.13(월) - 04.16(목)", font=font(FONT_BOLD, 24), fill=(255, 228, 194))

    panel_fill = (28, 13, 8, 214)
    panel_outline = (255, 191, 101, 110)

    def panel(x1: int, y1: int, x2: int, y2: int, title: str) -> None:
        rounded_panel(draw, (x1, y1, x2, y2), 28, fill=panel_fill, outline=panel_outline, width=2)
        draw.text((x1 + 26, y1 + 22), title, font=font(FONT_BOLD, 28), fill=accent)

    panel(48, 420, 812, 690, "참여 방법")
    steps = [
        ("01", "공식몰 회원가입", "트로이아르케 공식몰 회원가입을 완료해주세요."),
        ("02", "기미 · 미백 고민 댓글 남기기", "현재 피부 고민과 제품 기대 포인트를 댓글로 남겨주세요."),
        ("03", "포토 리뷰 업로드", "사용 전, 사용 중, 사용 후 사진이 보이도록 리뷰를 작성해주세요."),
    ]
    sy = 484
    for num, title, desc in steps:
        draw.ellipse((78, sy + 2, 118, sy + 42), fill=(255, 171, 36))
        bbox = draw.textbbox((0, 0), num, font=font(FONT_BOLD, 18))
        draw.text((98 - (bbox[2] - bbox[0]) / 2, sy + 10), num, font=font(FONT_BOLD, 18), fill=(24, 10, 4))
        draw.text((138, sy), title, font=font(FONT_BOLD, 26), fill=white)
        draw.text((138, sy + 36), desc, font=font(FONT_REGULAR, 18), fill=soft)
        sy += 62

    panel(48, 724, 812, 1030, "이벤트 정보")
    rows = [
        ("모집 기간", "2026.04.13(월) - 04.16(목)"),
        ("체험 상품", "멜라-소닉 C-인퓨저 크림 50ml"),
        ("체험 인원", "총 5명"),
        ("당첨자 발표", "2026.04.17(금) 게시물 공지 및 개별 연락"),
        ("체험 기간", "2026.04.20(월) - 04.27(월)"),
    ]
    ry = 794
    for key, value in rows:
        draw.text((76, ry), key, font=font(FONT_REGULAR, 21), fill=(174, 154, 136))
        draw.text((240, ry), value, font=font(FONT_BOLD, 21), fill=white)
        draw.line((76, ry + 36, 784, ry + 36), fill=(94, 59, 38), width=1)
        ry += 50

    panel(48, 1064, 812, 1356, "리뷰 미션")
    draw.text((76, 1122), "Before / During / After 3장 이상 필수 첨부", font=font(FONT_BOLD, 27), fill=white)
    boxes = [
        (76, 1184, "사용 전", "현재 피부 상태 사진"),
        (300, 1184, "사용 중", "제품 사용 장면\n또는 제형 사진"),
        (524, 1184, "사용 후", "변화된 피부 사진"),
    ]
    for x, y, title, body in boxes:
        rounded_panel(draw, (x, y, x + 180, y + 112), 22, fill=(51, 24, 13, 215), outline=(255, 189, 92, 90), width=2)
        draw.text((x + 18, y + 18), title, font=font(FONT_BOLD, 24), fill=accent)
        draw.text((x + 18, y + 54), body, font=font(FONT_REGULAR, 20), fill=white, spacing=4)
    draw.text((76, 1316), "* 피부 변화(Before & After) 사진 포함, 3장 이상 필수 첨부", font=font(FONT_REGULAR, 18), fill=soft)

    panel(48, 1390, 812, 1598, "우수 체험단 혜택")
    draw.text((76, 1450), "베스트 리뷰어 1분께\nGPS 비타-토닝 마스크 3매 증정", font=font(FONT_BOLD, 34), fill=white, spacing=4)
    draw.text((76, 1544), "정성스러운 사용 후기와 피부 변화가 잘 드러난 리뷰를 우선 선정합니다.", font=font(FONT_REGULAR, 18), fill=soft)
    img.alpha_composite(fit_image(mask, (170, 170)), (604, 1408))

    panel(48, 1632, 812, 1750, "NOTICE")
    notice = (
        "· 등록된 사진 및 콘텐츠는 마케팅 목적으로 활용될 수 있습니다.\n"
        "· 리뷰 기한 미준수 시 향후 이벤트 참여가 제한될 수 있습니다.\n"
        "· 본 이벤트는 내부 사정에 따라 변경 또는 조기 종료될 수 있습니다."
    )
    draw.text((76, 1686), notice, font=font(FONT_REGULAR, 17), fill=(231, 218, 202), spacing=7)

    draw.text((52, 1764), "TROIAREUKE MELA-SONIC C-INFUSER CREAM EVENT", font=font(FONT_REGULAR, 16), fill=(135, 116, 102))

    save_rgb(img, OUT / "troiareuke-detail.jpg")


if __name__ == "__main__":
    build_thumbnail()
    build_detail()
    print(OUT / "troiareuke-thumbnail.jpg")
    print(OUT / "troiareuke-detail.jpg")
