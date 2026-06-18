#!/usr/bin/env bash
# Limpia los INTERMEDIOS regenerables del pipeline de reels (dankoe-video).
# Los reels ya están desplegados (Vercel Blob); estos archivos se regeneran
# desde el pipeline cuando haga falta. Correr después de cerrar/desplegar un reel.
#
#   BORRA:
#     · captions/work/*        → segmentos, versiones full, módulos, frames de subtítulos
#     · motion/out/* (menos kit/) → renders .mp4 y stills .png de prueba
#
#   CONSERVA (nunca toca):
#     · masters/               → masters finales (archivo local / Drive)
#     · music/                 → camas de fondo (commiteadas)
#     · motion/out/kit/        → SFX sintetizados (commiteados)
#     · motion/src/  *.py  guiones  captions/*.py  → código fuente
#     · .venv/  node_modules/  → herramientas (usar --deep para node_modules)
#
#   Uso:
#     bash clean-pipeline.sh          # limpieza estándar
#     bash clean-pipeline.sh --deep   # + borra motion/node_modules (reinstalar: cd motion && npm install)
set -euo pipefail
cd "$(dirname "$0")"

echo "Antes:"
du -sh captions/work motion/out 2>/dev/null || true

# Intermedios de subtítulos / ensamblaje
rm -rf captions/work/* 2>/dev/null || true
# Renders y stills de motion, conservando la carpeta kit/ (SFX commiteados)
find motion/out -mindepth 1 -maxdepth 1 ! -name kit -exec rm -rf {} + 2>/dev/null || true

if [[ "${1:-}" == "--deep" ]]; then
  echo ">>> --deep: borrando motion/node_modules (reinstala con: cd motion && npm install)"
  rm -rf motion/node_modules
fi

echo "Después:"
du -sh captions/work motion/out 2>/dev/null || true
echo "✓ Intermedios limpiados. Masters, música, SFX, src y código intactos."
