"""Private technical inventory and four time-spread frames for each supplied clip.

No originals are changed. Install Pillow/imageio-ffmpeg only in the ignored audit
tool directory. Contact sheets and metadata remain outside public/.
"""
import concurrent.futures
import json
import math
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "output/media-audit"
sys.path.insert(0, str(OUT / "tooling"))
from PIL import Image, ImageDraw, ImageFont, ImageOps

SOURCE = ROOT / "src/fotos videos y contenido traveldays"
VIDEO = OUT / "videos"
VIDEO.mkdir(parents=True, exist_ok=True)
FFMPEG = OUT / "tooling/imageio_ffmpeg/binaries/ffmpeg-win-x86_64-v7.1.exe"
FONT = ImageFont.truetype("C:/Windows/Fonts/arial.ttf", 17)
CREATE_NO_WINDOW = 0x08000000
REFRESH_FIRST = next((int(arg.split("=", 1)[1]) for arg in sys.argv if arg.startswith("--refresh-first=")), 0)

def run(args):
    return subprocess.run([str(FFMPEG), "-hide_banner", "-threads", "1", *args],
        capture_output=True, creationflags=CREATE_NO_WINDOW)

def process(pair):
    index, path = pair
    identifier = f"V{index+1:03}"
    info = run(["-i", str(path)])
    text = info.stderr.decode("utf-8", "replace")
    duration_match = re.search(r"Duration: (\d+):(\d+):([\d.]+)", text)
    duration = sum(float(value)*mult for value, mult in zip(duration_match.groups(), [3600, 60, 1])) if duration_match else 0
    video_line = next((line.strip() for line in text.splitlines() if "Video:" in line), "")
    audio_line = next((line.strip() for line in text.splitlines() if "Audio:" in line), "")
    size = re.search(r"\b(\d{2,5})x(\d{2,5})\b", video_line)
    record = {"id": identifier, "path": path.relative_to(SOURCE).as_posix(), "bytes": path.stat().st_size,
              "duration_seconds": duration, "video_stream": video_line, "audio_stream": audio_line,
              "has_audio": bool(audio_line), "width": int(size[1]) if size else None, "height": int(size[2]) if size else None,
              "sample_fractions": [.125, .375, .625, .875], "sample_times": []}
    row = Image.new("RGB", (1120, 254), "#edf0f4")
    draw = ImageDraw.Draw(row)
    draw.text((8, 6), f"{identifier}  {duration:.2f}s  {record['width']}x{record['height']}  {path.name}", fill="black", font=FONT)
    if "--refresh" in sys.argv or index < REFRESH_FIRST or not all((VIDEO / f"{identifier}-{i+1}.jpg").exists() for i in range(4)):
        # Decode once per clip. fps takes a frame near the middle of each quarter.
        result = run(["-i", str(path), "-vf", f"fps={4/max(duration,.1)},scale=640:640:force_original_aspect_ratio=decrease",
                      "-frames:v", "4", "-q:v", "3", "-y", str(VIDEO / f"{identifier}-%d.jpg")])
        if result.returncode:
            record.setdefault("errors", []).append(result.stderr.decode("utf-8", "replace")[-500:])
    for i, fraction in enumerate(record["sample_fractions"]):
        timestamp = max(0, duration*fraction)
        frame = VIDEO / f"{identifier}-{i+1}.jpg"
        record["sample_times"].append(round(timestamp, 3))
        if frame.exists():
            with Image.open(frame) as image:
                small = ImageOps.contain(image.convert("RGB"), (274, 204))
                row.paste(small, (i*280+(280-small.width)//2, 34+(204-small.height)//2))
        draw.text((i*280+6, 236), f"{timestamp:.2f}s", fill="black", font=FONT)
    row.save(VIDEO / f"{identifier}.jpg", quality=90)
    return record

paths = sorted((SOURCE / "Videos").rglob("*.mp4"))
with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool:
    records = list(pool.map(process, enumerate(paths)))
(OUT / "video-metadata.json").write_text(json.dumps(records, indent=2, ensure_ascii=False), encoding="utf-8")
for start in range(0, len(records), 4):
    selected = records[start:start+4]
    sheet = Image.new("RGB", (1120, len(selected)*254), "white")
    for i, record in enumerate(selected):
        with Image.open(VIDEO / f"{record['id']}.jpg") as row:
            sheet.paste(row, (0, i*254))
    sheet.save(VIDEO / f"sheet-{start//4+1:02}.jpg", quality=93)
print(json.dumps({"clips": len(records), "total_seconds": round(sum(r['duration_seconds'] for r in records), 2),
                  "errors": sum(bool(r.get('errors')) for r in records), "sheets": math.ceil(len(records)/4)}))
