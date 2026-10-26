"""Local, private media inventory. Never writes into public/ or changes originals.

Requires Pillow; HEIC support: pillow-heif. Install audit-only tooling under
output/media-audit/tooling, not the application dependency tree.
"""
import hashlib
import json
import math
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "output/media-audit"
sys.path.insert(0, str(OUT / "tooling"))
from PIL import Image, ImageDraw, ImageFont, ImageOps, ImageStat, ImageFilter
import pillow_heif
pillow_heif.register_heif_opener()

SOURCE = ROOT / "src/fotos videos y contenido traveldays"
OUT.mkdir(parents=True, exist_ok=True)
(OUT / "photos").mkdir(exist_ok=True)
font = ImageFont.truetype("C:/Windows/Fonts/arial.ttf", 15)
items = []
thumbs = []
for index, path in enumerate(sorted(SOURCE.rglob("*"))):
    if not path.is_file():
        continue
    record = {"path": path.relative_to(SOURCE).as_posix(), "bytes": path.stat().st_size,
              "sha256": hashlib.file_digest(path.open("rb"), "sha256").hexdigest(), "extension": path.suffix.lower()}
    if path.suffix.lower() in {".jpg", ".jpeg", ".png", ".heic"}:
        record["id"] = f"P{len(thumbs)+1:03}"
        try:
            with Image.open(path) as original:
                record["metadata_present"] = bool(original.getexif())
                photo = ImageOps.exif_transpose(original).convert("RGB")
                record.update(width=photo.width, height=photo.height,
                              orientation="horizontal" if photo.width > photo.height else "vertical" if photo.width < photo.height else "cuadrada")
                gray = ImageOps.fit(photo.convert("L"), (9, 8))
                pixels = list(gray.tobytes())
                record["dhash"] = f"{sum((pixels[y*9+x] > pixels[y*9+x+1]) << (y*8+x) for y in range(8) for x in range(8)):016x}"
                small = ImageOps.contain(photo, (256, 256))
                record["edge_variance_proxy"] = round(ImageStat.Stat(small.convert("L").filter(ImageFilter.FIND_EDGES)).var[0], 2)
                photo.thumbnail((1200, 1200))
                photo.save(OUT / "photos" / f"{record['id']}.jpg", quality=87)
                cell = Image.new("RGB", (300, 240), "#edf0f4")
                thumb = ImageOps.contain(photo, (292, 200))
                cell.paste(thumb, ((300-thumb.width)//2, (200-thumb.height)//2))
                draw = ImageDraw.Draw(cell)
                draw.text((8, 204), f"{record['id']}  {record['width']}x{record['height']}", font=font, fill="black")
                draw.text((8, 223), path.name[:34], font=font, fill="black")
                thumbs.append(cell)
        except Exception as error:
            record["error"] = str(error)
            thumbs.append(Image.new("RGB", (300, 240), "red"))
    items.append(record)

for start in range(0, len(thumbs), 24):
    cells = thumbs[start:start+24]
    sheet = Image.new("RGB", (1200, math.ceil(len(cells)/4)*240), "white")
    for i, cell in enumerate(cells):
        sheet.paste(cell, ((i%4)*300, (i//4)*240))
    sheet.save(OUT / f"photos-{start//24+1:02}.jpg", quality=90)

groups = {}
for item in items:
    groups.setdefault(item["sha256"], []).append(item["path"])
similar = []
photos = [item for item in items if item.get("dhash")]
for i, first in enumerate(photos):
    for second in photos[i+1:]:
        distance = (int(first["dhash"], 16) ^ int(second["dhash"], 16)).bit_count()
        if distance <= 7 and first["sha256"] != second["sha256"]:
            similar.append({"first": first["id"], "second": second["id"], "distance": distance})
(OUT / "inventory.json").write_text(json.dumps(items, indent=2, ensure_ascii=False), encoding="utf-8")
(OUT / "duplicates.json").write_text(json.dumps({"exact": [v for v in groups.values() if len(v)>1], "similar_candidates": similar}, indent=2, ensure_ascii=False), encoding="utf-8")
print(json.dumps({"files": len(items), "photos": len(photos), "bytes": sum(i['bytes'] for i in items), "errors": [i for i in items if 'error' in i], "sheets": math.ceil(len(thumbs)/24), "exact_duplicate_groups": sum(len(v)>1 for v in groups.values()), "similar_candidates": len(similar)}, ensure_ascii=False))
