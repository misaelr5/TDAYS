"""Generate authorized, complete testimonial derivatives; never alter originals.

Usage: python scripts/prepare-testimonials.py --ffmpeg <ffmpeg executable>
Requires existing FFmpeg, no Python packages. Run only for the two resources
whose image/voice approval is recorded in src/config/media.ts.
"""
import argparse
import hashlib
import json
from pathlib import Path
import subprocess

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "src/fotos videos y contenido traveldays/testimonios"
OUTPUT = ROOT / "public/media/travel-days/testimonials"
SOURCES = (
    ("primaria", "Testimonios clientes primaria.mp4", "8ccf00013a7307aa07d8be4eb1c0cab2de1182dce869223831bdd47ea2092e04", 23.90, True),
    ("pasajeros-2024", "Testimonios Pax 2024.mp4", "08414faa1ccbd3997b64dcdbaad6340fedccfc572489e20b4e3a8e13974d6847", 39.59, False),
)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--ffmpeg", required=True)
    args = parser.parse_args()
    # Check all inputs before creating any public output. Unknown/replaced sources
    # need a new review; authorization is never inferred from a filename alone.
    for _, name, expected_hash, _, _ in SOURCES:
        source = SOURCE / name
        if hashlib.sha256(source.read_bytes()).hexdigest() != expected_hash:
            raise ValueError(f"Original modificado o no revisado: {name}")
    OUTPUT.mkdir(parents=True, exist_ok=True)
    audit = []
    for identifier, name, expected_hash, poster_time, copy_audio in SOURCES:
        source = SOURCE / name
        video = OUTPUT / f"{identifier}.mp4"
        poster = OUTPUT / f"{identifier}.webp"
        if video.exists() or poster.exists():
            raise FileExistsError(f"No se sobrescriben derivados existentes: {identifier}")
        base = [args.ffmpeg, "-hide_banner", "-loglevel", "error", "-n", "-threads", "2"]
        audio_args = ["-c:a", "copy"] if copy_audio else ["-c:a", "aac", "-b:a", "96k"]
        subprocess.run(base + ["-i", str(source), "-map", "0:v:0", "-map", "0:a:0", "-map_metadata", "-1", "-map_chapters", "-1",
                              "-c:v", "libx264", "-preset", "medium", "-crf", "24", "-maxrate", "900k", "-bufsize", "1800k",
                              "-pix_fmt", "yuv420p", "-threads", "2", *audio_args, "-movflags", "+faststart", str(video)], check=True)
        subprocess.run(base + ["-ss", str(poster_time), "-i", str(source), "-frames:v", "1", "-map_metadata", "-1",
                              "-c:v", "libwebp", "-quality", "82", str(poster)], check=True)
        if hashlib.sha256(source.read_bytes()).hexdigest() != expected_hash:
            raise ValueError(f"Se modificó el original: {name}")
        audit.append({"id": identifier, "original_sha256": expected_hash,
                      "original_bytes": source.stat().st_size, "video_bytes": video.stat().st_size,
                      "video_sha256": hashlib.sha256(video.read_bytes()).hexdigest(),
                      "poster_bytes": poster.stat().st_size, "poster_time": poster_time,
                      "audio": "AAC original sin recodificar" if copy_audio else "AAC 96 kbit/s",
                      "cut": "video completo, sin recortes"})
    private = ROOT / "output/testimonials"
    private.mkdir(parents=True, exist_ok=True)
    (private / "derivatives.json").write_text(json.dumps(audit, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps(audit, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
