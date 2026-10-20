"""Create K09 web derivatives from the unchanged K08 ImageGen masters.

Requires Python 3 and Pillow 12.0.0. Run from any directory.
"""
import hashlib
import json
from pathlib import Path

from PIL import Image, __version__ as pillow_version

ROOT = Path(__file__).resolve().parent.parent
OUTPUT = ROOT / "public/assets"
REPORT = ROOT / "docs/k09/assets.json"
WIDTHS = (480, 768, 1280, 1536)


def sha256(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def main():
    OUTPUT.mkdir(parents=True, exist_ok=True)
    sources = json.loads((ROOT / "docs/k08/manifest.json").read_text(encoding="utf-8"))
    records = []
    for slot in ("hero", "courtyard", "ridge", "woodland"):
        original = ROOT / f"docs/k08/originals/{slot}.png"
        expected = next(asset for asset in sources["assets"] if asset["slot"] == slot)
        if sha256(original) != expected["sha256"]:
            raise ValueError(f"Master hash differs from K08 manifest: {slot}")
        with Image.open(original) as source:
            source.load()
            if source.size != (1536, 1024):
                raise ValueError(f"Unexpected master size for {slot}: {source.size}")
            image = source.convert("RGB")
            for width in WIDTHS:
                height = round(width * image.height / image.width)
                resized = image.resize((width, height), Image.Resampling.LANCZOS)
                # Keep small-image detail; reduce large files to the design budget.
                webp_quality = 80 if width < 1280 else (38 if slot == "woodland" else 65)
                for extension, options in (
                    ("webp", {"quality": webp_quality, "method": 6}),
                    ("jpg", {"quality": 82, "optimize": True, "progressive": True}),
                ):
                    target = OUTPUT / f"{slot}-{width}.{extension}"
                    resized.save(target, **options)
                    with Image.open(target) as check:
                        check.verify()
                    records.append({
                        "path": target.relative_to(ROOT).as_posix(),
                        "width": width, "height": height,
                        "bytes": target.stat().st_size, "sha256": sha256(target),
                        "quality": options["quality"],
                    })
        print(f"{slot}: 4 WebP + 4 JPEG variants; original unchanged {sha256(original)}")
    REPORT.parent.mkdir(parents=True, exist_ok=True)
    REPORT.write_text(json.dumps({
        "sourceManifest": "docs/k08/manifest.json",
        "sourceTool": sources["tool"],
        "pillowVersion": pillow_version,
        "webpQuality": "80 below 1280px; 65 for large hero/courtyard/ridge; 38 for large woodland",
        "jpegQuality": 82,
        "resize": "Lanczos; original 3:2 composition; no upscaling or colour filters",
        "files": records,
    }, indent=2) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
