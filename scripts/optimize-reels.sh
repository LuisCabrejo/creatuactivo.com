#!/bin/bash
# Optimiza los 5 reels para web (inline en creatuactivo.com).
# Crudo ~140MB (9.45 Mbps) → web ~40-60MB (CRF 23) + poster <250KB.
# Uso: bash scripts/optimize-reels.sh
set -e
DIR="public/videos/reels"
REELS=(corporativo empleados empresarios diaspora informales)

for name in "${REELS[@]}"; do
  in="$DIR/$name.mp4"
  out="$DIR/$name-web.mp4"
  poster="$DIR/$name-poster.jpg"
  if [ ! -f "$in" ]; then echo "⚠️  falta $in — saltando"; continue; fi
  echo "🎬 Optimizando $name ..."
  ffmpeg -y -loglevel error -stats -i "$in" \
    -c:v libx264 -profile:v high -pix_fmt yuv420p \
    -crf 23 -preset medium -maxrate 6M -bufsize 12M \
    -vf "scale=1080:1920:flags=lanczos" \
    -c:a aac -b:a 128k -movflags +faststart \
    "$out"
  # Poster (frame al segundo 1, liviano para OG WhatsApp)
  ffmpeg -y -loglevel error -ss 1 -i "$in" -frames:v 1 \
    -vf "scale=720:1280" -q:v 5 "$poster"
  echo "   ✓ $out ($(du -h "$out" | cut -f1)) · poster $(du -h "$poster" | cut -f1)"
done
echo "✅ Optimización completa."
