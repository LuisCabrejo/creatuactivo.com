#!/bin/bash
# Pipeline completo: video + guion -> video con subtitulos quemados (1080x1920).
# Forced alignment (sin torch) + render Pillow (sin libass) + overlay ffmpeg.
#
# Uso: ./caption-reel.sh <video.mp4> <guion.txt> <salida.mp4> [opciones]
#   --mode karaoke|reveal   (default karaoke: pagina fija, palabra activa dorada)
#   --maxwords N            (default 3)
#   --y 0.64                (posicion vertical 0..1)
set -e
VIDEO="$1"; GUION="$2"; OUT="$3"; shift 3 || true
MODE="karaoke"; MAXW="3"; Y="0.64"
while [ $# -gt 0 ]; do case "$1" in
  --mode) MODE="$2"; shift 2;; --maxwords) MAXW="$2"; shift 2;;
  --y) Y="$2"; shift 2;; *) shift;; esac; done

DIR="$(cd "$(dirname "$0")" && pwd)"; source "$DIR/.venv/bin/activate"
W="$DIR/work"; BASE="$(basename "${OUT%.*}")"
WAV="$W/${BASE}_16k.wav"; STAMPS="$W/${BASE}_stamps.json"; FRAMES="$W/${BASE}_frames"

DUR=$(ffprobe -v error -show_entries format=duration -of default=nk=1:nw=1 "$VIDEO")
echo "[1/4] audio 16k..."
ffmpeg -y -i "$VIDEO" -vn -ac 1 -ar 16000 -c:a pcm_s16le "$WAV" -loglevel error
echo "[2/4] forced alignment guion->audio..."
python "$DIR/align.py" "$WAV" "$GUION" "$STAMPS" spa
echo "[3/4] render PNG (Pillow, modo $MODE)..."
rm -rf "$FRAMES"; mkdir -p "$FRAMES"
python "$DIR/render_captions.py" "$STAMPS" "$FRAMES" --fps 24 --dur "$DUR" \
  --mode "$MODE" --maxwords "$MAXW" --y "$Y"
echo "[4/4] overlay + encode 1080x1920..."
ffmpeg -y -i "$VIDEO" -framerate 24 -start_number 0 -i "$FRAMES/f%05d.png" \
  -filter_complex "[0:v]scale=1080:1920:flags=lanczos[bg];[bg][1:v]overlay=0:0[v]" \
  -map "[v]" -map 0:a -c:v libx264 -preset medium -crf 20 -pix_fmt yuv420p \
  -c:a aac -b:a 192k -movflags +faststart "$OUT" -loglevel error
rm -rf "$FRAMES"
echo "LISTO -> $OUT"
