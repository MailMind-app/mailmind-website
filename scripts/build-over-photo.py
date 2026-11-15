"""Zet de foto van Rens om naar het ronde fotootje bij het citaat op /over, zonder metadata.

Gebruik:  python scripts/build-over-photo.py
Bron:     design-assets/over/rens.png (alleen lokaal, staat in .gitignore)
Uitvoer:  public/over/rens-face-56.webp, -112.webp en -168.webp (1x, 2x, 3x van 56 px)

Eén keer verkleinen vanuit het origineel (Lanczos), daarna licht verscherpen.
De pagina toont ze met een srcset, zonder next/image-optimizer: geen tweede compressie.
Alleen de pixels gaan mee: geen EXIF, XMP, ICC of locatie. Vereist Pillow.
"""

from __future__ import annotations

import io
from pathlib import Path

from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "design-assets" / "over" / "rens.png"
OUT = ROOT / "public" / "over"

QUALITY = 90
SIZES = (56, 112, 168)
# Hoofd en bovenkant van de schouders, gezicht horizontaal in het midden (bron 1122x1402).
FACE_BOX = (250, 150, 830, 730)
MIN_BOX = 500
SHARPEN = ImageFilter.UnsharpMask(radius=0.8, percent=70, threshold=2)


def pixels_only(img: Image.Image) -> Image.Image:
    """Nieuwe afbeelding met alleen de pixels: alle metadata van de bron blijft achter."""
    rgb = img.convert("RGB")
    return Image.frombytes("RGB", rgb.size, rgb.tobytes())


def main() -> None:
    x0, y0, x1, y1 = FACE_BOX
    assert x1 - x0 == y1 - y0 >= MIN_BOX, "uitsnede moet vierkant en minimaal 500 px zijn"
    src = pixels_only(Image.open(SRC))
    crop = src.crop(FACE_BOX)
    OUT.mkdir(parents=True, exist_ok=True)
    for size in SIZES:
        img = crop.resize((size, size), Image.LANCZOS).filter(SHARPEN)
        buf = io.BytesIO()
        img.save(buf, "WEBP", quality=QUALITY, method=6)
        (OUT / f"rens-face-{size}.webp").write_bytes(buf.getvalue())
        print(f"rens-face-{size}.webp  {size}x{size}  {len(buf.getvalue()) / 1024:.1f} KB  (uit {x1 - x0}x{y1 - y0})")


if __name__ == "__main__":
    main()
