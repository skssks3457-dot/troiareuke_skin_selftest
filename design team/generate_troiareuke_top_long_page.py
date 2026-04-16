from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont


ROOT = Path(r"C:\Users\MK\Documents\Playground\design team")
REF = ROOT / "references" / "troiareuke" / "images"
OUT = ROOT / "outputs" / "detail_pages" / "png"

W = 1080
SECTION_H = 1350
SECTIONS = 4
H = SECTION_H * SECTIONS

FONT_REGULAR = str(Path(r"C:\Windows\Fonts\NotoSansKR-VF.ttf"))
FONT_BOLD = str(Path(r"C:\Windows\Fonts\malgunbd.ttf"))

COLORS = {
    "bg": "#0B2348",
    "headline": "#F7F9FC",
    "body": "#E6EBF2",
    "caption": "#BBC6D5",
    "footer": "#CFD7E2",
}


@dataclass
class SectionSpec:
    background: str
    mode: str
    caption: list[str]
    title: list[str]
    body: list[str]
    bullets: list[str]
    footer: list[str]
    text_box: tuple[int, int, int]
    contain_box: tuple[int, int, int, int] | None = None


SECTIONS_SPEC = [
    SectionSpec(
        background="use_the_reference_202603271533.png",
        mode="crop",
        caption=["TROIAREUKE Home Aesthetics Kit"],
        title=["처음 만나는 트로이아르케,", "집에서 시작하는 홈 에스테틱"],
        body=["에스테틱의 시작을 더 간결하고 정제된 루틴으로."],
        bullets=[],
        footer=["Bring your spa home"],
        text_box=(96, 112, 620),
    ),
    SectionSpec(
        background="use_the_reference_202603271533.png",
        mode="crop",
        caption=["START ROUTINE"],
        title=["트로이아르케를 시작하는", "가장 간결한 방법"],
        body=["처음 시작하는 고객을 위해", "가장 먼저 필요한 루틴만 담았습니다."],
        bullets=[
            "처음 시작하는 트로이아르케 스타트 솔루션",
            "집에서도 완성하는 에스테틱 2-Step 루틴",
            "클렌저와 앰플로 정돈하는 홈 케어 시스템",
        ],
        footer=[],
        text_box=(96, 130, 360),
    ),
    SectionSpec(
        background="use_the_reference_202603271603.png",
        mode="contain",
        caption=["2-STEP ROUTINE"],
        title=["정돈하고, 채우는", "홈 에스테틱 2-Step"],
        body=[],
        bullets=[
            "STEP 1. Oil Cut Cleansing|피부를 맑고 개운하게 정돈하는 클렌징 스타트 단계",
            "STEP 2. Healing Cocktail Ampoule|수분감 있는 피부 바탕을 차분하게 채워주는 앰플 케어 단계",
        ],
        footer=["매일 이어질수록 더 탄탄해지는 트로이아르케 루틴"],
        text_box=(650, 150, 330),
        contain_box=(60, 220, 520, 900),
    ),
    SectionSpec(
        background="use_the_reference_202603271509.png",
        mode="crop",
        caption=["RECOMMENDED FOR"],
        title=["이런 분께 추천합니다"],
        body=[],
        bullets=[
            "어떤 제품부터 시작해야 할지 고민되는 분",
            "집에서도 정돈된 홈케어 루틴을 만들고 싶은 분",
            "트로이아르케를 처음 경험하는 분",
        ],
        footer=["매일의 루틴을 더 정제된 시작으로 바꾸어 보세요."],
        text_box=(650, 140, 310),
    ),
]


def font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(FONT_BOLD if bold else FONT_REGULAR, size=size)


def fit_crop(image: Image.Image, size: tuple[int, int]) -> Image.Image:
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
    left = (new_w - dst_w) // 2
    top = max(0, (new_h - dst_h) // 2)
    return resized.crop((left, top, left + dst_w, top + dst_h))


def make_crop_section(spec: SectionSpec) -> Image.Image:
    source = Image.open(REF / spec.background).convert("RGBA")
    base = fit_crop(source, (W, SECTION_H))

    veil = Image.new("RGBA", base.size, (0, 0, 0, 0))
    vdraw = ImageDraw.Draw(veil)
    vdraw.rectangle((0, 0, W, 460), fill=(8, 19, 36, 54))
    vdraw.rectangle((0, 460, W, 900), fill=(8, 19, 36, 16))
    vdraw.ellipse((-160, -30, 760, 980), fill=(255, 255, 255, 18))
    return Image.alpha_composite(base, veil.filter(ImageFilter.GaussianBlur(48)))


def make_contain_section(spec: SectionSpec) -> Image.Image:
    canvas = Image.new("RGBA", (W, SECTION_H), COLORS["bg"])
    glow = Image.new("RGBA", (W, SECTION_H), (0, 0, 0, 0))
    gdraw = ImageDraw.Draw(glow)
    gdraw.ellipse((20, 180, 760, 1120), fill=(31, 121, 235, 82))
    gdraw.ellipse((220, 20, 920, 720), fill=(125, 191, 255, 22))
    canvas = Image.alpha_composite(canvas, glow.filter(ImageFilter.GaussianBlur(95)))

    product = Image.open(REF / spec.background).convert("RGBA")
    left, top, box_w, box_h = spec.contain_box
    scale = min(box_w / product.size[0], box_h / product.size[1])
    size = (int(product.size[0] * scale), int(product.size[1] * scale))
    product = product.resize(size, Image.Resampling.LANCZOS)
    px = left + (box_w - size[0]) // 2
    py = top + (box_h - size[1]) // 2
    canvas.alpha_composite(product, (px, py))
    return canvas


def draw_lines(draw: ImageDraw.ImageDraw, lines: list[str], *, box_x: int, box_w: int, y: int, face: ImageFont.FreeTypeFont, fill: str, gap: int) -> int:
    current_y = y
    for text in lines:
        draw.text((box_x, current_y), text, font=face, fill=fill)
        bbox = draw.textbbox((box_x, current_y), text, font=face)
        current_y = bbox[3] + gap
    return current_y


def draw_bullets(draw: ImageDraw.ImageDraw, spec: SectionSpec, y: int) -> int:
    x, _, w = spec.text_box
    current_y = y
    if spec.caption == ["2-STEP ROUTINE"]:
        title_face = font(23, True)
        body_face = font(19, False)
        for item in spec.bullets:
            title, desc = item.split("|", 1)
            current_y = draw_lines(draw, [title], box_x=x, box_w=w, y=current_y, face=title_face, fill=COLORS["headline"], gap=10)
            current_y = draw_lines(draw, [desc], box_x=x, box_w=w, y=current_y, face=body_face, fill=COLORS["body"], gap=0)
            current_y += 48
        return current_y

    bullet_face = font(21, False)
    for item in spec.bullets:
        current_y = draw_lines(draw, [item], box_x=x, box_w=w, y=current_y, face=bullet_face, fill=COLORS["headline"], gap=0)
        current_y += 38
    return current_y


def draw_text(section: Image.Image, spec: SectionSpec, index: int) -> Image.Image:
    draw = ImageDraw.Draw(section)
    x, y, w = spec.text_box

    y = draw_lines(draw, spec.caption, box_x=x, box_w=w, y=y, face=font(18, False), fill=COLORS["caption"], gap=16)
    y += 18
    y = draw_lines(draw, spec.title, box_x=x, box_w=w, y=y, face=font(54 if index == 0 else 38, True), fill=COLORS["headline"], gap=16 if index == 0 else 14)

    if spec.body:
        y += 18
        y = draw_lines(draw, spec.body, box_x=x, box_w=w, y=y, face=font(22, False), fill=COLORS["body"], gap=12)

    if spec.bullets:
        y += 34
        y = draw_bullets(draw, spec, y)

    if spec.footer:
        draw_lines(draw, spec.footer, box_x=x, box_w=w, y=SECTION_H - 118, face=font(18, False), fill=COLORS["footer"], gap=10)
    return section


def build() -> Path:
    canvas = Image.new("RGBA", (W, H), COLORS["bg"])
    for index, spec in enumerate(SECTIONS_SPEC):
        if spec.mode == "contain":
            section = make_contain_section(spec)
        else:
            section = make_crop_section(spec)
        section = draw_text(section, spec, index)
        canvas.alpha_composite(section, (0, index * SECTION_H))

    OUT.mkdir(parents=True, exist_ok=True)
    target = OUT / "troiareuke_top_long_page.png"
    canvas.convert("RGB").save(target, quality=95)
    return target


if __name__ == "__main__":
    print(build())
