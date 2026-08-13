#!/usr/bin/env bash
# Render GitHub-safe PNG charts from render.html (Chrome headless).
set -euo pipefail
CHROME="${CHROME:-/usr/bin/google-chrome}"
DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT="$(cd "$DIR/.." && pwd)"

shot() {
  local name="$1" w="$2" h="$3"
  "$CHROME" --headless=new --disable-gpu --hide-scrollbars --no-sandbox --allow-file-access-from-files \
    --force-device-scale-factor=1 --window-size="${w},${h}" \
    --screenshot="${DIR}/${name}.png" \
    "file://${DIR}/render.html?chart=${name}"
}

banner() {
  "$CHROME" --headless=new --disable-gpu --hide-scrollbars --no-sandbox --allow-file-access-from-files \
    --force-device-scale-factor=1 --window-size="1920,560" \
    --screenshot="${ROOT}/banner.png" \
    "file://${ROOT}/banner.html"
}

shot winloss 1720 680
shot expectancy 1720 760
shot equity 1720 760
shot drawdown 1720 680
banner
# Chrome screenshots PNG; convert banner to JPG for GitHub README.
python3 - "$ROOT/banner.png" <<'PY'
from pathlib import Path
import sys
src = Path(sys.argv[1])
dst = src.with_suffix(".jpg")
try:
    from PIL import Image
    Image.open(src).convert("RGB").save(dst, "JPEG", quality=90)
    src.unlink(missing_ok=True)
    print(f"wrote {dst}")
except Exception:
    # ffmpeg / ImageMagick fallback
    import shutil, subprocess
    if shutil.which("ffmpeg"):
        subprocess.check_call(["ffmpeg", "-y", "-i", str(src), "-q:v", "3", str(dst)], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        src.unlink(missing_ok=True)
        print(f"wrote {dst} (ffmpeg)")
    elif shutil.which("convert"):
        subprocess.check_call(["convert", str(src), str(dst)])
        src.unlink(missing_ok=True)
        print(f"wrote {dst} (convert)")
    else:
        print("banner.png kept (no JPEG encoder); README expects docs/banner.jpg")
PY
echo "wrote ${DIR}/{winloss,expectancy,equity,drawdown}.png"
