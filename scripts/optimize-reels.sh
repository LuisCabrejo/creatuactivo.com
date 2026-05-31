#!/bin/bash
# Optimiza los 5 reels para web (inline en creatuactivo.com).
# Fuente CapCut (1080p/20Mbps, ~290MB) → web ~24MB (CRF 23, faststart).
# El poster ya NO se genera aquí: los reels usan un poster branded único
# (public/videos/reels/poster.webp + poster.jpg), no un frame por-nicho.
# Uso: bash scripts/optimize-reels.sh
set -e
DIR="public/videos/reels"
REELS=(corporativo empleados empresarios diaspora informales)

for name in "${REELS[@]}"; do
  in="$DIR/$name.mp4"
  out="$DIR/$name-web.mp4"
  if [ ! -f "$in" ]; then echo "⚠️  falta $in — saltando"; continue; fi
  echo "🎬 Optimizando $name ..."
  ffmpeg -y -loglevel error -stats -i "$in" \
    -c:v libx264 -profile:v high -pix_fmt yuv420p \
    -crf 23 -preset medium -maxrate 6M -bufsize 12M \
    -vf "scale=1080:1920:flags=lanczos" \
    -c:a aac -b:a 128k -movflags +faststart \
    "$out"
  echo "   ✓ $out ($(du -h "$out" | cut -f1))"
done
echo "✅ Optimización completa."
