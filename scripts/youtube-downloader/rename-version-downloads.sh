#!/usr/bin/env bash
# Rename MP3s from scripts/youtube-downloader/files/ to musics/{version}--{title_id}.mp3
# using titles from a version album file. Run after `yarn mp3`.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
VERSION="${1:-}"
ALBUM_FILE="$ROOT/src/database/albums/${VERSION}.ts"
SRC_DIR="$ROOT/scripts/youtube-downloader/files"
DEST_DIR="$ROOT/musics"

if [[ -z "$VERSION" || ! -f "$ALBUM_FILE" ]]; then
  echo "Usage: ./scripts/youtube-downloader/rename-version-downloads.sh <version>"
  exit 1
fi

mkdir -p "$DEST_DIR"

python3 - "$ALBUM_FILE" "$SRC_DIR" "$DEST_DIR" <<'PY'
import re, sys, shutil
from pathlib import Path

album_path, src_dir, dest_dir = map(Path, sys.argv[1:4])
text = album_path.read_text(encoding="utf-8")
pattern = re.compile(
    r'title:\s*"([^"]+)"[\s\S]*?source:\s*"/musics/([^"]+)"',
    re.MULTILINE,
)

def norm(s: str) -> str:
    return re.sub(r"[^a-z0-9]+", "", s.lower())

pairs = pattern.findall(text)
if not pairs:
    raise SystemExit(f"No tracks found in {album_path}")

files = list(src_dir.glob("*.mp3"))
if not files:
    raise SystemExit(f"No MP3 files in {src_dir}")

for title, filename in pairs:
    dest = dest_dir / filename
    if dest.exists():
        print(f"skip (exists): {filename}")
        continue
    title_key = norm(title.split("|")[0])
    match = None
    for f in files:
        if title_key in norm(f.stem) or norm(f.stem) in title_key:
            match = f
            break
    if not match:
        print(f"WARN: no file match for: {title}")
        continue
    shutil.move(str(match), str(dest))
    print(f"{match.name} -> {filename}")

remaining = list(src_dir.glob("*.mp3"))
if remaining:
    print(f"\n{len(remaining)} file(s) still in {src_dir} (manual rename needed)")
PY
