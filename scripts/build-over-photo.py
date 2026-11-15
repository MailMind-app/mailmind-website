"""Zet de foto van Rens om naar het ronde fotootje bij het citaat op /over, zonder metadata.

Gebruik:  python scripts/build-over-photo.py
Bron:     design-assets/over/rens.png (alleen lokaal, staat in .gitignore)
Uitvoer:  public/over/rens-face.webp (400x400, gezicht)

Alleen de pixels gaan mee: geen EXIF, XMP, ICC of locatie. Vereist Pillow.
"""

from __future__ import annotations

import io
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "design-assets" / "over" / "rens.png"
OUT = ROOT / "public" / "over"

QUALITY = 80
# Gezicht in de bron (1122x1402): vierkant rond het hoofd, met een stukje kraag.
FACE_BOX = (250, 120, 830, 700)
FACE_SIZE = 400


def pixels_only(img: Image.Image) -> Image.Image:
    """Nieuwe afbeelding met alleen de pixels: alle metadata van de bron blijft achter."""
    rgb = img.convert("RGB")
    return Image.frombytes("RGB", rgb.size, rgb.tobytes())


def main() -> None:
    src = pixels_only(Image.open(SRC))
    OUT.mkdir(parents=True, exist_ok=True)

    face = src.crop(FACE_BOX).resize((FACE_SIZE, FACE_SIZE), Image.LANCZOS)
    buf = io.BytesIO()
    face.save(buf, "WEBP", quality=QUALITY, method=6)
    (OUT / "rens-face.webp").write_bytes(buf.getvalue())
    print(f"rens-face.webp  {FACE_SIZE}x{FACE_SIZE}  {len(buf.getvalue()) / 1024:.1f} KB")


if __name__ == "__main__":
    main()
