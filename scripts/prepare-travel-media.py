"""Prepare reviewed copies only; preserve source bytes and strip metadata.

Run audit-travel-media.py first. Requires the local audit-only Pillow/HEIC
tooling in output/media-audit/tooling. Nothing is added to runtime dependencies.
"""
import hashlib
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "output/media-audit"
sys.path.insert(0, str(OUT / "tooling"))
from PIL import Image, ImageOps
import pillow_heif
pillow_heif.register_heif_opener()

SOURCE = ROOT / "src/fotos videos y contenido traveldays"
inventory = json.loads((OUT / "inventory.json").read_text(encoding="utf-8"))
by_id = {item["id"]: item for item in inventory if "id" in item}
# Publication: empty office interiors + individually authorized portraits only.
# Youthful/third-party portraits stay private even when a staff name is known.
selections = [
    ("P140", "office-consultation", "office-hero", "public", (50, 50)),
    ("P139", "office-lounge", "office", "review", (50, 50)),
    ("P138", "office-exterior", "exterior", "review", (50, 50)),
    ("P142", "javier-garay", "portrait", "public", (52, 39)),
    ("P006", "daiana-dascon", "headshot", "public", (54, 34)),
    ("P001", "azul-barrera", "headshot", "public", (51, 43)),
    ("P147", "karoll-tello", "headshot", "public", (50, 35)),
    ("P141", "ezequiel-grego", "portrait", "review", (50, 39)),
    ("P007", "dj-mosca", "portrait", "review", (50, 40)),
    ("P021", "event-group", "event", "review", (50, 50)),
    ("P046", "event-overview", "event", "review", (50, 50)),
    ("P059", "event-experience", "event", "review", (50, 50)),
]
# Bind the reviewed batch to source bytes. New files can shift sequential audit
# IDs; never let a re-scan silently authorize a different photograph.
expected_hashes = {
    "P001": "c0fda73545b143994717ce6f4b90e0170b816631d3f19537b6c699be994d61ec",
    "P006": "d6df3c91c6694ff0653cb010cad8393493a0465dd0f0c528e031d4ffc4da777f",
    "P007": "4754ae9aa954d0e735212f770b9516a971b3d211e882d543afcd5a9b1c405fe5",
    "P021": "cdf67e58a63e8d35447a2ee19e197fa7d39bd9de74d8655ce38e28702b636585",
    "P046": "c10c3a168e587aa3323c19ea79ae3b48e97d93b3969d3fc6ffc7608080ce7cd9",
    "P059": "b70b54c8bf6c7b58a1928b5ade0f51d2c1f2e95cbcfce8401545188132c87c73",
    "P138": "03890bb530b66b52cf469905e9be66c4e823e205b542653bacc5e082623c8c98",
    "P139": "5b6a15af88238ed80c2eb4f52a65f744f9ef1097e2bcfe237686df99ccdb8df7",
    "P140": "c86df4eb06973dd100c42f0b1769b6508f90f2dbd08745320796829569421ac0",
    "P141": "6e1cbe33a836dec1b7d035d202753193618d7c153023990232d6f2f514ffad11",
    "P142": "10a7061fd6b509e360f1c1f471fd170258b2188b213fc86c333653c6bcb2d4c9",
    "P147": "b57213b75648a5daec8740b621dd0c6c30fdd92693a41343b65d05c080d19f08",
}
for photo_id, *_ in selections:
    item = by_id.get(photo_id)
    if not item or item["sha256"] != expected_hashes[photo_id]:
        raise ValueError(f"{photo_id}: cambió el lote revisado; revisar selección y permisos antes de generar copias")
    with (SOURCE / item["path"]).open("rb") as stream:
        if hashlib.file_digest(stream, "sha256").hexdigest() != expected_hashes[photo_id]:
            raise ValueError(f"{photo_id}: cambió el original; se requiere nueva revisión visual")
variant_sizes = {
    "office-hero": [("desktop", (1000, 1250)), ("mobile", (1280, 960)), ("small", (640, 480))],
    "office": [("desktop", (1600, 1200)), ("mobile", (800, 1000)), ("small", (480, 600))],
    "portrait": [("desktop", (600, 750)), ("mobile", (320, 400)), ("small", (160, 200))],
    "headshot": [("desktop", (600, 600)), ("mobile", (320, 320)), ("small", (160, 160))],
    "exterior": [("desktop", (1440, 1440)), ("mobile", (720, 720))],
    "event": [("desktop", (1440, 1440)), ("mobile", (720, 720))],
}
# Reviewed source-pixel crops for the 56px circular profiles. A full-body photo
# shrunk to an avatar makes the face too small and can clip the forehead.
headshot_crops = {"P006": (320, 0, 960, 640), "P001": (180, 80, 708, 608), "P147": (140, 20, 620, 500)}
outputs = []
for photo_id, name, kind, status, focal in selections:
    item = by_id[photo_id]
    path = SOURCE / item["path"]
    destination = ROOT / "public/media/travel-days" if status == "public" else OUT / "review-optimized"
    destination = destination / ("team" if kind in {"portrait", "headshot"} else "office" if kind.startswith("office") or kind == "exterior" else "experiences")
    destination.mkdir(parents=True, exist_ok=True)
    with Image.open(path) as raw:
        original = ImageOps.exif_transpose(raw).convert("RGB")
        if kind == "headshot":
            original = original.crop(headshot_crops[photo_id])
        for label, size in variant_sizes[kind]:
            scale = min(1, original.width / size[0], original.height / size[1])
            size = (int(size[0] * scale), int(size[1] * scale))
            # Office mobile has its own art-directed crop. Portraits retain the
            # photographed head and context; CSS focal points finish the crop.
            if kind == "office-hero" or (kind == "office" and label == "mobile"):
                image = ImageOps.fit(original, size, centering=(focal[0]/100, focal[1]/100))
            elif kind in {"portrait", "headshot"}:
                image = ImageOps.fit(original, size, centering=(focal[0]/100, focal[1]/100))
            else:
                image = ImageOps.contain(original, size)
            target = destination / f"{name}-{label}.webp"
            image.save(target, "WEBP", quality=82 if kind in {"portrait", "headshot"} else 80, method=6)
            with Image.open(target) as check:
                assert not check.getexif() and not check.info.get("xmp") and not check.info.get("icc_profile"), target
            outputs.append({"source_id": photo_id, "source": item["path"], "path": target.relative_to(ROOT).as_posix(), "status": status, "width": image.width, "height": image.height, "bytes": target.stat().st_size, "metadata_stripped": True})
(OUT / "optimized.json").write_text(json.dumps(outputs, indent=2, ensure_ascii=False), encoding="utf-8")
print(json.dumps({"derivatives": len(outputs), "public_bytes": sum(i['bytes'] for i in outputs if i['status']=='public'), "private_bytes": sum(i['bytes'] for i in outputs if i['status']=='review')}, ensure_ascii=False))
