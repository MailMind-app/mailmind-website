"""Zet de 3D-Rens-bronbestanden om naar transparante WebP's voor de hulpknop.

Gebruik:  python scripts/build-avatar.py
Bron:     design-assets/avatar/*.png (effen magenta achtergrond, rens-peek.png al transparant)
Uitvoer:  public/avatar/*.webp en design-review/avatar-check.png (controleplaat)

Vereist Pillow en numpy.
"""

from __future__ import annotations

import io
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "design-assets" / "avatar"
OUT = ROOT / "public" / "avatar"
REVIEW = ROOT / "design-review"

QUALITY = 82
MIN_QUALITY = 40
LIMIT = 40 * 1024
PAIR_LIMIT = 50 * 1024

# Zwaai-hand: verwachte maat na bijsnijden en het handgebied daarin (volle resolutie).
ZWAAI_EXPECTED = (607, 1493)
HAND_BOX = (0, 268, 195, 480)  # x0, y0, x1, y1
HAND_CANVAS = (205, 480)
# De basis houdt een strook onder de snede, zodat de hand er overlapt: geen naad na het schalen.
HAND_OVERLAP = 10


def chroma_key(img: Image.Image) -> Image.Image:
    """Magenta weg met een zachte alpha, plus despill op de randen."""
    rgb = np.asarray(img.convert("RGB"), dtype=np.float32)
    r, g, b = rgb[..., 0], rgb[..., 1], rgb[..., 2]
    m = np.minimum(r, b) - g
    alpha = np.clip(1 - (m - 40) / 160, 0, 1)
    spill = np.where(m > 20, 0.6 * (m - 20), 0)
    r = np.clip(r - spill, 0, 255)
    b = np.clip(b - spill, 0, 255)
    out = np.dstack([r, g, b, alpha * 255]).round().astype(np.uint8)
    return Image.fromarray(out, "RGBA")


def clean(img: Image.Image) -> Image.Image:
    """Volledig transparante pixels zwart maken: kleinere bestanden, geen kleurresten."""
    a = np.asarray(img).copy()
    a[a[..., 3] == 0, :3] = 0
    return Image.fromarray(a, "RGBA")


def crop(img: Image.Image) -> Image.Image:
    bbox = img.getchannel("A").point(lambda v: 255 if v > 8 else 0).getbbox()
    return img.crop(bbox)


def resize(img: Image.Image, size: tuple[int, int]) -> Image.Image:
    # Premultiplied schalen, anders lopen donkere randen in de halfdoorzichtige pixels.
    return img.convert("RGBa").resize(size, Image.LANCZOS).convert("RGBA")


def scale_to_height(img: Image.Image, height: int) -> Image.Image:
    w, h = img.size
    return resize(img, (round(w * height / h), height))


def encode(img: Image.Image, quality: int) -> bytes:
    buf = io.BytesIO()
    clean(img).save(buf, "WEBP", quality=quality, method=6, alpha_quality=90, exact=False)
    return buf.getvalue()


def save_within(images: dict[str, Image.Image], limit: int, per_file: int = LIMIT) -> dict[str, int]:
    """Sla een of meer WebP's op; verlaag de quality tot alles binnen de limieten past."""
    quality = QUALITY
    while True:
        data = {name: encode(img, quality) for name, img in images.items()}
        total = sum(len(d) for d in data.values())
        if (total < limit and all(len(d) < per_file for d in data.values())) or quality <= MIN_QUALITY:
            break
        quality -= 4
    for name, d in data.items():
        (OUT / name).write_bytes(d)
        print(f"  {name:22} {images[name].size[0]:>4}x{images[name].size[1]:<4} {len(d) / 1024:5.1f} KB  q{quality}")
    return {name: len(d) for name, d in data.items()}


def load_keyed(name: str) -> Image.Image:
    return crop(chroma_key(Image.open(SRC / name)))


def build_zwaai() -> None:
    full = load_keyed("rens-zwaai.png")
    print(f"  rens-zwaai bijgesneden: {full.size[0]}x{full.size[1]}")
    if full.size != ZWAAI_EXPECTED:
        raise SystemExit(
            f"rens-zwaai is {full.size}, niet {ZWAAI_EXPECTED}: bepaal HAND_BOX opnieuw (hand boven de manchet)."
        )

    x0, y0, x1, y1 = HAND_BOX
    hand = Image.new("RGBA", HAND_CANVAS, (0, 0, 0, 0))
    hand.paste(full.crop(HAND_BOX), (x0, y0))
    base = full.copy()
    base.paste(Image.new("RGBA", (x1 - x0, y1 - y0 - HAND_OVERLAP), (0, 0, 0, 0)), (x0, y0))

    factor = 720 / full.size[1]
    size = lambda im: (round(im.size[0] * factor), round(im.size[1] * factor))  # noqa: E731
    save_within(
        {
            "rens-zwaai.webp": resize(full, size(full)),
        },
        LIMIT,
    )
    save_within(
        {
            "rens-zwaai-base.webp": resize(base, size(base)),
            "rens-zwaai-hand.webp": resize(hand, size(hand)),
        },
        PAIR_LIMIT,
    )


def build_head() -> None:
    img = load_keyed("rens-head.png")
    w, h = img.size
    # Vierkant vanaf de bovenkant van het haar: gezicht en kraag in beeld.
    side = min(w, h)
    left = (w - side) // 2
    square = img.crop((left, 0, left + side, side))
    save_within({"rens-head.webp": resize(square, (256, 256))}, LIMIT)


def contact_sheet() -> None:
    files = sorted(OUT.glob("*.webp"))
    tiles = [Image.open(f).convert("RGBA") for f in files]
    pad = 24
    height = max(t.size[1] for t in tiles) + 2 * pad
    width = sum(t.size[0] for t in tiles) + pad * (len(tiles) + 1)
    sheet = Image.new("RGBA", (width, height), (10, 15, 30, 255))
    x = pad
    for t in tiles:
        sheet.alpha_composite(t, (x, pad))
        x += t.size[0] + pad
    REVIEW.mkdir(exist_ok=True)
    sheet.convert("RGB").save(REVIEW / "avatar-check.png", optimize=True)
    print(f"  controleplaat: {REVIEW / 'avatar-check.png'}")


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for name, height in [("rens-duim", 720), ("rens-denk", 720), ("rens-scan", 640)]:
        save_within({f"{name}.webp": scale_to_height(load_keyed(f"{name}.png"), height)}, LIMIT)
    peek = crop(Image.open(SRC / "rens-peek.png").convert("RGBA"))
    save_within({"rens-peek.webp": scale_to_height(peek, 600)}, LIMIT)
    build_head()
    build_zwaai()
    contact_sheet()


if __name__ == "__main__":
    main()
