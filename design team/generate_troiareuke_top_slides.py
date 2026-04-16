from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont


ROOT = Path(r"C:\Users\MK\Documents\Playground\design team")
REF = ROOT / "references" / "troiareuke" / "images"
OUT = ROOT / "outputs" / "detail_pages" / "png"

W = 1080
H = 1350

COLORS = {
    "headline": "#F7F9FC",
    "body": "#E8EDF4",
    "caption": "#C7D0DC",
    "footer": "#D1D8E2",
}

FONT_REGULAR = str(Path(r"C:\Windows\Fonts\NotoSansKR-VF.ttf"))
FONT_BOLD = str(Path(r"C:\Windows\Fonts\malgunbd.ttf"))


@dataclass
class SlideSpec:
    filename: str
    background: str
    anchor: str
    text_align: str
    text_box: tuple[int, int, int]
    caption: list[str]
    title: list[str]
    body: list[str]
    bullets: list[str]
    footer: list[str]
    contain_box: tuple[int, int, int, int] | None = None


SLIDES = [
    SlideSpec(
        filename="troiareuke_top_slide_01.png",
        background="use_the_reference_202603271608.png",
        anchor="center",
        text_align="left",
        text_box=(108, 108, 590),
        caption=["TROIAREUKE Home Aesthetics Kit"],
        title=["처음 만나는 트로이아르케,", "집에서 시작하는 홈 에스테틱"],
        body=["에스테틱의 시작을 더 간결하고 정제된 루틴으로."],
        bullets=[],
        footer=["Bring your spa home"],
    ),
    SlideSpec(
        filename="troiareuke_top_slide_02.png",
        background="use_the_reference_202603271533.png",
        anchor="center",
        text_align="left",
        text_box=(88, 110, 360),
        caption=["START ROUTINE"],
        title=["트로이아르케를 시작하는", "가장 간결한 방법"],
        body=["처음 시작하는 고객을 위해", "가장 먼저 필요한 루틴만 담았습니다."],
        bullets=[
            "처음 시작하는 트로이아르케 스타트 솔루션",
            "집에서도 완성하는 에스테틱 2-Step 루틴",
            "클렌저와 앰플로 정돈하는 홈 케어 시스템",
        ],
        footer=[],
    ),
    SlideSpec(
        filename="troiareuke_top_slide_03.png",
        background="use_the_reference_202603271603.png",
        anchor="center",
        text_align="left",
        text_box=(672, 126, 320),
        caption=["2-STEP ROUTINE"],
        title=["정돈하고, 채우는", "홈 에스테틱 2-Step"],
        body=[],
        bullets=[
            "STEP 1. Oil Cut Cleansing|피부를 맑고 개운하게 정돈하는 클렌징 스타트 단계",
            "STEP 2. Healing Cocktail Ampoule|수분감 있는 피부 바탕을 차분하게 채워주는 앰플 케어 단계",
        ],
        footer=["매일 이어질수록 더 탄탄해지는 트로이아르케 루틴"],
        contain_box=(48, 190, 560, 980),
    ),
    SlideSpec(
        filename="troiareuke_top_slide_04.png",
        background="use_the_reference_202603271509.png",
        anchor="right",
        text_align="left",
        text_box=(640, 126, 300),
        caption=["RECOMMENDED FOR"],
        title=["이런 분께 추천합니다"],
        body=[],
        bullets=[
            "어떤 제품부터 시작해야 할지 고민되는 분",
            "집에서도 정돈된 홈케어 루틴을 만들고 싶은 분",
            "트로이아르케를 처음 경험하는 분",
        ],
        footer=["매일의 루틴을 더 정제된 시작으로 바꾸어 보세요."],
    ),
]


def font(size: int, weight: str = "regular") -> ImageFont.FreeTypeFont:
    path = FONT_BOLD if weight == "bold" else FONT_REGULAR
    return ImageFont.truetype(path, size=size)


def fit_crop(image: Image.Image, size: tuple[int, int], anchor: str = "center") -> Image.Image:
    src_w, src_h = image.size
    dst_w, dst_h = size
    src_ratio = src_w / src_h
    dst_ratio = dst_w / dst_h

    if src_ratio > dst_ratio:
        new_h = dst_h
        new_w = round(src_w * (dst_h / src_h))
    else:
        new_w = dst_w
        new_h = round(src_h * (dst_w / src_w))

    resized = image.resize((new_w, new_h), Image.Resampling.LANCZOS)
    if anchor == "right":
        left = new_w - dst_w
    elif anchor == "left":
        left = 0
    else:
        left = (new_w - dst_w) // 2
    top = max(0, (new_h - dst_h) // 2)
    return resized.crop((left, top, left + dst_w, top + dst_h))


def apply_soft_veil(image: Image.Image) -> Image.Image:
    base = image.convert("RGBA")
    veil = Image.new("RGBA", base.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(veil)
    draw.rectangle((0, 0, W, H), fill=(245, 248, 252, 16))
    draw.ellipse((-160, 0, 760, 980), fill=(255, 255, 255, 24))
    draw.ellipse((260, 820, 1180, 1540), fill=(255, 255, 255, 10))
    return Image.alpha_composite(base, veil.filter(ImageFilter.GaussianBlur(120)))


def apply_on_gradient(image: Image.Image, box: tuple[int, int, int, int]) -> Image.Image:
    canvas = Image.new("RGBA", (W, H), "#0B2446")
    glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(glow)
    draw.ellipse((40, 200, 760, 1200), fill=(41, 122, 231, 78))
    draw.ellipse((220, 20, 980, 760), fill=(110, 181, 255, 30))
    canvas = Image.alpha_composite(canvas, glow.filter(ImageFilter.GaussianBlur(95)))

    left, top, box_w, box_h = box
    product = image.convert("RGBA")
    src_w, src_h = product.size
    scale = min(box_w / src_w, box_h / src_h)
    new_size = (int(src_w * scale), int(src_h * scale))
    product = product.resize(new_size, Image.Resampling.LANCZOS)
    paste_x = left + (box_w - new_size[0]) // 2
    paste_y = top + (box_h - new_size[1]) // 2
    canvas.alpha_composite(product, (paste_x, paste_y))
    return canvas


def add_top_fade(canvas: Image.Image) -> Image.Image:
    overlay = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    draw.rectangle((0, 0, W, 460), fill=(7, 18, 35, 54))
    draw.rectangle((0, 460, W, 860), fill=(7, 18, 35, 18))
    return Image.alpha_composite(canvas, overlay.filter(ImageFilter.GaussianBlur(48)))


def line_x(box_x: int, box_w: int, text_w: int, align: str) -> int:
    if align == "right":
        return box_x + box_w - text_w
    if align == "center":
        return box_x + (box_w - text_w) // 2
    return box_x


def draw_line(draw: ImageDraw.ImageDraw, text: str, x: int, y: int, face: ImageFont.FreeTypeFont, fill: str) -> tuple[int, int, int, int]:
    draw.text((x, y), text, font=face, fill=fill)
    return draw.textbbox((x, y), text, font=face)


def draw_lines(draw: ImageDraw.ImageDraw, lines: list[str], *, box_x: int, box_w: int, y: int, align: str, face: ImageFont.FreeTypeFont, fill: str, gap: int) -> int:
    current_y = y
    for text in lines:
        bbox = draw.textbbox((0, 0), text, font=face)
        x = line_x(box_x, box_w, bbox[2] - bbox[0], align)
        bbox = draw_line(draw, text, x, current_y, face, fill)
        current_y = bbox[3] + gap
    return current_y


def draw_bullets(draw: ImageDraw.ImageDraw, items: list[str], *, box_x: int, box_w: int, y: int, align: str, mode: str) -> int:
    current_y = y
    if mode == "steps":
        step_face = font(23, "bold")
        desc_face = font(19, "regular")
        for item in items:
            title, desc = item.split("|", 1)
            current_y = draw_lines(
                draw,
                [title],
                box_x=box_x,
                box_w=box_w,
                y=current_y,
                align=align,
                face=step_face,
                fill=COLORS["headline"],
                gap=10,
            )
            current_y = draw_lines(
                draw,
                [desc],
                box_x=box_x,
                box_w=box_w,
                y=current_y,
                align=align,
                face=desc_face,
                fill=COLORS["body"],
                gap=0,
            )
            current_y += 48
        return current_y

    bullet_face = font(21, "regular")
    for item in items:
        current_y = draw_lines(
            draw,
            [item],
            box_x=box_x,
            box_w=box_w,
            y=current_y,
            align=align,
            face=bullet_face,
            fill=COLORS["headline"],
            gap=0,
        )
        current_y += 38
    return current_y


def build_slide(spec: SlideSpec, slide_no: int) -> Path:
    source = Image.open(REF / spec.background)
    if spec.contain_box:
        canvas = add_top_fade(apply_on_gradient(source, spec.contain_box))
    else:
        bg = fit_crop(source, (W, H), spec.anchor)
        canvas = add_top_fade(apply_soft_veil(bg))
    draw = ImageDraw.Draw(canvas)

    box_x, y, box_w = spec.text_box

    y = draw_lines(
        draw,
        spec.caption,
        box_x=box_x,
        box_w=box_w,
        y=y,
        align=spec.text_align,
        face=font(18, "regular"),
        fill=COLORS["caption"],
        gap=16,
    )
    y += 20

    y = draw_lines(
        draw,
        spec.title,
        box_x=box_x,
        box_w=box_w,
        y=y,
        align=spec.text_align,
        face=font(54 if slide_no == 1 else 38, "bold"),
        fill=COLORS["headline"],
        gap=16 if slide_no == 1 else 14,
    )

    if spec.body:
        y += 18
        y = draw_lines(
            draw,
            spec.body,
            box_x=box_x,
            box_w=box_w,
            y=y,
            align=spec.text_align,
            face=font(22, "regular"),
            fill=COLORS["body"],
            gap=12,
        )

    if spec.bullets:
        y += 32
        mode = "steps" if slide_no == 3 else "bullets"
        y = draw_bullets(draw, spec.bullets, box_x=box_x, box_w=box_w, y=y, align=spec.text_align, mode=mode)

    if spec.footer:
        draw_lines(
            draw,
            spec.footer,
            box_x=box_x,
            box_w=box_w,
            y=H - 118,
            align=spec.text_align,
            face=font(18, "regular"),
            fill=COLORS["footer"],
            gap=10,
        )

    OUT.mkdir(parents=True, exist_ok=True)
    target = OUT / spec.filename
    canvas.convert("RGB").save(target, quality=95)
    return target


def main() -> None:
    for index, spec in enumerate(SLIDES, start=1):
        print(build_slide(spec, index))


if __name__ == "__main__":
    main()
