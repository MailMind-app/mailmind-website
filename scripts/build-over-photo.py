"""Zet de foto van Rens om naar WebP's voor /over, zonder metadata.

Gebruik:  python scripts/build-over-photo.py
Bron:     design-assets/over/rens.png (niet publiceren)
Uitvoer:  public/over/rens.webp      (4:5, max. 1600 px breed, < 250 KB)
          public/over/rens-face.webp (400x400, gezicht, voor het contactblok)

Alleen de pixels gaan mee: geen EXIF, XMP, ICC of locatie. Vereist Pillow.
"""

from __future__ import annotations

import io
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "design-assets" / "over" / "rens.png"
OUT = ROOT / "public" / "over"

MAX_WIDTH = 1600
QUALITY = 80
MIN_QUALITY = 60
LIMIT = 250 * 1024
# Gezicht in de bron (1122x1402): vierkant rond het hoofd, met een stukje kraag.
FACE_BOX = (250, 120, 830, 700)
FACE_SIZE = 400


def pixels_only(img: Image.Image) -> Image.Image:
    """Nieuwe afbeelding met alleen de pixels: alle metadata van de bron blijft achter."""
    rgb = img.convert("RGB")
    return Image.frombytes("RGB", rgb.size, rgb.tobytes())


def crop_4_5(img: Image.Image) -> Image.Image:
    w, h = img.size
    target_h = round(w * 5 / 4)
    if target_h <= h:
        top = (h - target_h) // 2
        return img.crop((0, top, w, top + target_h))
    target_w = round(h * 4 / 5)
    left = (w - target_w) // 2
    return img.crop((left, 0, left + target_w, h))


def encode(img: Image.Image, limit: int | None) -> bytes:
    quality = QUALITY
    while True:
        buf = io.BytesIO()
        img.save(buf, "WEBP", quality=quality, method=6)
        data = buf.getvalue()
        if limit is None or len(data) <= limit or quality <= MIN_QUALITY:
            return data
        quality -= 4


def main() -> None:
    src = pixels_only(Image.open(SRC))
    OUT.mkdir(parents=True, exist_ok=True)

    photo = crop_4_5(src)
    if photo.width > MAX_WIDTH:
        photo = photo.resize((MAX_WIDTH, round(MAX_WIDTH * photo.height / photo.width)), Image.LANCZOS)
    data = encode(photo, LIMIT)
    (OUT / "rens.webp").write_bytes(data)
    print(f"rens.webp       {photo.width}x{photo.height}  {len(data) / 1024:.1f} KB")

    face = src.crop(FACE_BOX).resize((FACE_SIZE, FACE_SIZE), Image.LANCZOS)
    data = encode(face, None)
    (OUT / "rens-face.webp").write_bytes(data)
    print(f"rens-face.webp  {FACE_SIZE}x{FACE_SIZE}  {len(data) / 1024:.1f} KB")


if __name__ == "__main__":
    main()
