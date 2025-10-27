#!/bin/bash
# Script de optimización de video para página Fundadores
# Uso: ./scripts/optimize-video.sh [ruta-al-video-original.mp4]

set -e  # Detener en caso de error

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}   OPTIMIZADOR DE VIDEO - CreaTuActivo Fundadores${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Verificar que se proporcionó un archivo
if [ -z "$1" ]; then
  echo -e "${RED}❌ Error: Debes proporcionar la ruta al video original${NC}"
  echo -e "${YELLOW}Uso: ./scripts/optimize-video.sh video-original.mp4${NC}"
  exit 1
fi

INPUT_VIDEO="$1"

# Verificar que el archivo existe
if [ ! -f "$INPUT_VIDEO" ]; then
  echo -e "${RED}❌ Error: No se encontró el archivo: $INPUT_VIDEO${NC}"
  exit 1
fi

# Verificar que FFmpeg está instalado
if ! command -v ffmpeg &> /dev/null; then
  echo -e "${RED}❌ Error: FFmpeg no está instalado${NC}"
  echo -e "${YELLOW}Instala con: brew install ffmpeg${NC}"
  exit 1
fi

# Crear carpeta de salida
OUTPUT_DIR="public/videos"
mkdir -p "$OUTPUT_DIR"

echo -e "${GREEN}✓ Video original encontrado: $INPUT_VIDEO${NC}"
echo -e "${GREEN}✓ Carpeta de salida: $OUTPUT_DIR${NC}"
echo ""

# Obtener información del video original
echo -e "${BLUE}📊 Información del video original:${NC}"
ffprobe -v error -show_entries format=duration,size,bit_rate -show_entries stream=width,height,codec_name -of default=noprint_wrappers=1 "$INPUT_VIDEO" 2>&1 | grep -E "(duration|size|width|height|bit_rate|codec_name)" || true
echo ""

# Tamaño original
ORIGINAL_SIZE=$(du -h "$INPUT_VIDEO" | cut -f1)
echo -e "${YELLOW}📦 Tamaño original: $ORIGINAL_SIZE${NC}"
echo ""

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}   PASO 1/4: Generando versión 1080p (Principal)${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

ffmpeg -i "$INPUT_VIDEO" \
  -vf "scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2" \
  -c:v libx264 \
  -crf 23 \
  -preset slow \
  -c:a aac \
  -b:a 128k \
  -movflags +faststart \
  -y \
  "$OUTPUT_DIR/fundadores-1080p.mp4"

SIZE_1080P=$(du -h "$OUTPUT_DIR/fundadores-1080p.mp4" | cut -f1)
echo -e "${GREEN}✓ 1080p generado: $SIZE_1080P${NC}"
echo ""

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}   PASO 2/4: Generando versión 720p (Móvil)${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

ffmpeg -i "$INPUT_VIDEO" \
  -vf "scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2" \
  -c:v libx264 \
  -crf 26 \
  -preset slow \
  -c:a aac \
  -b:a 96k \
  -movflags +faststart \
  -y \
  "$OUTPUT_DIR/fundadores-720p.mp4"

SIZE_720P=$(du -h "$OUTPUT_DIR/fundadores-720p.mp4" | cut -f1)
echo -e "${GREEN}✓ 720p generado: $SIZE_720P${NC}"
echo ""

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}   PASO 3/4: Generando versión 4K (Opcional)${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

ffmpeg -i "$INPUT_VIDEO" \
  -vf "scale=3840:2160:force_original_aspect_ratio=decrease,pad=3840:2160:(ow-iw)/2:(oh-ih)/2" \
  -c:v libx264 \
  -crf 28 \
  -preset slow \
  -c:a aac \
  -b:a 128k \
  -movflags +faststart \
  -y \
  "$OUTPUT_DIR/fundadores-4k.mp4"

SIZE_4K=$(du -h "$OUTPUT_DIR/fundadores-4k.mp4" | cut -f1)
echo -e "${GREEN}✓ 4K generado: $SIZE_4K${NC}"
echo ""

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}   PASO 4/4: Generando imagen de poster${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Extraer frame en segundo 3
ffmpeg -i "$INPUT_VIDEO" \
  -ss 00:00:03 \
  -vframes 1 \
  -vf "scale=1920:1080:force_original_aspect_ratio=decrease" \
  -q:v 2 \
  -y \
  "$OUTPUT_DIR/fundadores-poster.jpg"

SIZE_POSTER=$(du -h "$OUTPUT_DIR/fundadores-poster.jpg" | cut -f1)
echo -e "${GREEN}✓ Poster generado: $SIZE_POSTER${NC}"
echo ""

echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}   ✅ OPTIMIZACIÓN COMPLETADA${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${BLUE}📦 Resumen de tamaños:${NC}"
echo -e "  Original: ${YELLOW}$ORIGINAL_SIZE${NC}"
echo -e "  1080p:    ${GREEN}$SIZE_1080P${NC} ⭐ (Principal)"
echo -e "  720p:     ${GREEN}$SIZE_720P${NC}"
echo -e "  4K:       ${GREEN}$SIZE_4K${NC}"
echo -e "  Poster:   ${GREEN}$SIZE_POSTER${NC}"
echo ""
echo -e "${BLUE}📁 Archivos generados en: ${YELLOW}$OUTPUT_DIR${NC}"
ls -lh "$OUTPUT_DIR"
echo ""
echo -e "${GREEN}🚀 Siguiente paso:${NC}"
echo -e "${YELLOW}   node scripts/upload-to-blob.mjs${NC}"
echo ""
