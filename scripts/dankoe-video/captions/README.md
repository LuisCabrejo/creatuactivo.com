# Subtítulos quemados para reels (forced alignment + Pillow)

Genera subtítulos word-level sincronizados al audio usando el **guion exacto**
(no transcribe — *forced alignment*), y los quema sobre el video. Resuelve el
problema de drift que tenía el enfoque Whisper (ver `memory/project_subtitulos_pipeline.md`).

## Por qué este enfoque
- **Forced alignment** (modelo MMS, ONNX, sin torch): toma el texto conocido y solo
  resuelve el *cuándo* de cada palabra. Resolución 20 ms, sin drift acumulado.
- **Render con Pillow** (no libass): control pixel-perfect del estilo y evita un bug
  de libass en el ffmpeg de este equipo (antepone una "," a cada línea).
- Composición final con `ffmpeg overlay`.

## Uso (1 reel)
```bash
./caption-reel.sh <video.mp4> <guion.txt> <salida.mp4> [--mode karaoke|reveal] [--maxwords 3] [--y 0.64]
```
- `karaoke` (default): la frase queda fija y la palabra activa se pinta de dorado.
- `reveal`: las palabras aparecen una a una.
- Salida: 1080×1920, H.264, faststart (lista para `optimize-reels.sh` / Blob).

## El guion (clave)
El `.txt` debe contener **solo lo hablado**, sin encabezados de producción ni markdown,
con los **números deletreados** como se pronuncian (`setenta`, `veinticuatro`, `quince`).
La alineación es tan buena como el calce texto↔audio.

## Piezas
- `align.py` — audio + guion → `stamps.json` (word timestamps).
- `render_captions.py` — `stamps.json` → secuencia PNG transparente (estilo).
- `caption-reel.sh` — orquesta todo.
- `.venv/` — Python 3.12 con `ctc-forced-aligner`, `onnxruntime`, `unidecode`, `pillow`.

## Estilo (en `render_captions.py`, arriba)
`FONT_PATH` (Montserrat-Black), `COLOR_ACTIVE` (#C5A059 dorado marca), `BASE_FONT`,
`STROKE_W`, `--y`. Auto-reduce el tamaño por página para no desbordar el ancho.
