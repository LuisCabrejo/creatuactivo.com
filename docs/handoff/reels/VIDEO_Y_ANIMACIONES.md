# Video estándar, color grade y animaciones Canvas

> Extraído de `CLAUDE.md` el 4 ago 2026. CLAUDE.md conserva solo el puntero.
> Para el acabado cinematográfico de reels (subtítulos, motion graphics, música, SFX) → [scripts/dankoe-video/PIPELINE.md](../../../scripts/dankoe-video/PIPELINE.md).

## 1. Flujo estándar (video ya editado)

```bash
# 1. Optimizar (genera 720p, 1080p, 4K + poster)
./scripts/optimize-video.sh /path/to/video.mp4

# 2. Subir a Vercel Blob
node scripts/upload-to-blob.mjs

# 3. Agregar las URLs a .env.local y al Vercel Dashboard
```

Detalle → [README_VIDEO_IMPLEMENTATION.md](../../../README_VIDEO_IMPLEMENTATION.md) · arranque rápido → [QUICK_START_VIDEO.md](../../../QUICK_START_VIDEO.md).

## 2. Color Grade — estilo Naval Ravikant / Dan Koe (DaVinci Resolve)

Flujo completo → [HANDOFF-VIDEO-NAVAL-DAVINCI.md](HANDOFF-VIDEO-NAVAL-DAVINCI.md). Resumen:

```bash
python3 scripts/generate_lut.py                                  # genera naval_style.cube
python3 scripts/davinci_naval.py --input video.mp4 --name nombre # exporta 1080p + 720p + poster
```

⚠️ DaVinci debe estar **abierto** antes de correr el script. Si `naval_style.cube` se borra, se regenera con el primer comando.

## 3. Canvas Animation Videos (`src/app/animaciones/`)

Videos verticales estilo Dan Koe renderizados en el navegador con Canvas API + React. Para contenido de redes.

- **Formato**: 1080×1920 (9:16 vertical), 60fps, ~38 segundos
- **Stack**: React + TypeScript + Canvas API + MediaRecorder (graba a WebM/MP4)
- **Assets**: `public/campaign-assets/` — fondos, efectos visuales, sonidos
- **Videos exportados**: `public/animaciones/` — exports WebM/HTML renderizados (estáticos, no código fuente)
- **Gráficas estáticas**: `public/codigo/` — SVG y visuales de código para las animaciones
- **Handoff**: [HANDOFF-DAN-KOE-STYLE-IMPLEMENTATION.md](HANDOFF-DAN-KOE-STYLE-IMPLEMENTATION.md)
- **Día 8 post-producción**: [HANDOFF-DIA8-POSTPRODUCCION.md](HANDOFF-DIA8-POSTPRODUCCION.md) — audio, SFX y spec de subtítulos para `dia8-v2`

Cada página `animaciones/diaX/` renderiza y exporta **un** video. Las variantes (`dia7-v3` … `dia7-v6`) son iteraciones A/B del guion de ese día. Algunas animaciones usan nombre de concepto en vez de `diaX`: `acoplamiento/`, `depreciacion-biologica/`, `laberinto-infinito/`, `turbina-prisionero/`.
