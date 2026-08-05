# Pipeline de reels — local (M1)

> ⚠️ **`process_video.py` (BiRefNet) está OBSOLETO.** Servía para recortar al sujeto
> de una pared blanca y componer un fondo infinito. Ya **no se usa**: hay fondo físico
> (pared carbón). El paso de color ahora vive en código → ver **`grade.py`** abajo.
> El resto de este README documenta el flujo BiRefNet legacy (referencia histórica).

## PASO 0 — `grade.py` (color grade automatizado — OPCIONAL)

> 🔧 **Flujo vivo (jun 2026):** el color se hace en **CapCut** (Luis) — ver "Config CapCut"
> abajo. `grade.py` es una **alternativa automatizada opcional** que codifica el MISMO
> look calibrado (LUT + domar mesa + chaqueta negra + viñeta) por si se quiere graduar
> por lote o sin CapCut. No es obligatorio en el pipeline; sirve también como referencia
> de los valores ideales que se replican a mano en CapCut.

Toma el clip **crudo D-Log M** de la Osmo Pocket 3 y entrega la base graduada que
alimenta el pipeline (subtítulos + motion + audio).

```bash
python3 grade.py input/clip.mp4 [output/clip-graded.mp4]
python3 grade.py --frame ruta/frame.png out.png   # previsualiza el look en un still
```

Cadena final (calibrada con metraje real, jun 2026):

1. **LUT** `luts/dji-osmo-pocket3-dlogm-to-709.cube` (= "LUT 100%" de CapCut; copiado para reproducibilidad).
2. **selectivecolor (amarillos)** — doma la mesa de madera para que no compita con la cara.
3. **colorbalance** — degreen sutil + piel cálida + sombras un toque frías.
4. **curves (punto negro suave)** — filmico; NO crushea a vacío.
5. **lutyuv `JACKET_BLACK` (solo-luma)** — ennegrece la chaqueta SIN tocar la croma → la piel no palidece.
6. **hqdn3d** (denoise) — quita el grano de sensor del fondo oscuro.
7. **unsharp** = "Enfocar +20".
8. **vignette (centrada en la cara)** — apaga la mesa/bordes, centra la luz en el sujeto.
9. **halation/bloom (en RGB)** — glow suave en luces y micrófono.

**Aprendizajes de calibración (no repetir errores):**
- `curves` de ffmpeg interpola con **spline cúbico** → meter puntos bajos para ennegrecer
  la chaqueta genera overshoot que **levanta y desatura la piel**. Por eso el ennegrecido
  va en `lutyuv` (solo-luma): toca el brillo, no la croma.
- En fondo oscuro una **viñeta débil es invisible** (oscurecer negro no se ve). Se centra en
  la cara y se sube la fuerza para que caiga sobre la **mesa/bordes** — ahí sí se percibe.
- `eq=saturation` global **re-satura y aclara la mesa** ya domada → no usarlo.
- Protección de piel hue-selectiva no es limpia en ffmpeg; si hace falta, DaVinci o LUT de piel.

## Config CapCut (flujo vivo del color)

El grade del color se hace a mano en CapCut. Config calibrada equivalente al `grade.py`:

- **LUT**: `DJI OSMO Pocket 3 D-Log M to Rec.709 V1` · Intensidad **100** · **Proteger tono de piel: ON**.
- **HSL → Amarillo**: Saturación **−48** · Brillo **−6** (doma la mesa sin lavar la piel).
- **Básico**: Temp **+6** · Tinte **+6** (calidez + degreen) · Enfocar **+18**. *(NO subir Negros/Contraste agresivo: palidece la piel.)*
- **Curvas → Luminancia** (NO la RGB): baja la zona de sombras → **chaqueta negra sin desaturar la piel** (mismo principio que `lutyuv`).
- **Viñeta** (Efectos): intensidad **alta** — recién se percibe cuando empieza a apagar la mesa.
- *(Opcional)* Retoque facial: blanqueamiento dental — feature de IA de CapCut, sin equivalente en ffmpeg.

**Después del color**: el clip graduado entra al pipeline para **audio + producción final**
(subtítulos por forced alignment + inserts 3D + SFX + atmósfera + música + outro).

---

# Dan Koe Style Video Processor (LEGACY — BiRefNet)

Pipeline local para convertir un clip con pared blanca en un video estilo Dan Koe:
fondo negro cinematografico con gradiente radial sutil + color grading moody.

## Requisitos previos

- Python 3.10+
- FFmpeg instalado y accesible en PATH (`ffmpeg -version` debe responder)
- ~3 GB libres (el modelo BiRefNet se descarga la primera vez)

## Pasos

1. Abre VS Code en esta carpeta.
2. Copia tu clip a `input/video.mp4`.
3. Abre Claude Code en la terminal integrada y pegale el brief de abajo.

## Brief para Claude Code

```
Estoy en la carpeta dankoe-video. Lee process_video.py y README.md.

Tareas:
1. Crea un venv (.venv) con Python 3.10+.
2. Instala las dependencias de requirements.txt.
3. Verifica que ffmpeg este disponible.
4. Ejecuta process_video.py con el video en input/video.mp4.
5. Cuando termine, abre output/video_dankoe.mp4 y confirma que se genero.
6. Si el resultado tiene flicker en bordes, ajusta ALPHA_TEMPORAL_WEIGHT a 0.5.
   Si el fondo se ve muy plano, sube BG_CENTER_BRIGHTNESS a 45.
   Si el contraste es excesivo, baja CONTRAST_STRENGTH a 0.3.

Reporta tiempo de render y tamano final del archivo.
```

## Parametros editables (en process_video.py)

| Parametro | Default | Que controla |
|---|---|---|
| `BG_CENTER_BRIGHTNESS` | 32 | Brillo del centro del gradiente (0-255) |
| `BG_EDGE_BRIGHTNESS` | 0 | Brillo en las esquinas |
| `GRADIENT_FALLOFF` | 2.5 | Dureza del gradiente (mayor = mas oscuro en bordes) |
| `GRADIENT_CENTER_Y` | 0.40 | Posicion vertical de la luz (0=arriba, 1=abajo) |
| `ALPHA_TEMPORAL_WEIGHT` | 0.35 | Suavizado entre frames (reduce flicker) |
| `SHADOW_BLUE_LIFT` | 10 | Intensidad del azul en sombras |
| `HIGHLIGHT_WARMTH` | 6 | Calidez en la piel |
| `CONTRAST_STRENGTH` | 0.6 | Intensidad del contraste cinematografico |
| `MASK_FEATHER_PX` | 2 | Suavizado de bordes del recorte |

## Flujo

1. `rembg` + `birefnet-general` segmenta al sujeto frame a frame.
2. Suavizado temporal del alpha mask para evitar flicker.
3. Composicion sobre canvas 1080x1920 con gradiente radial.
4. Color grading: sombras frias, medios calidos, curva S.
5. FFmpeg re-ensambla con el audio original en H.264 CRF 18.

## Despues

Lleva el MP4 resultante a CapCut para agregar subtitulos keyword serif
(amarillo mostaza y blanco alternando) siguiendo el estilo Dan Koe.

Fuente serif recomendada: **Cardo**, **EB Garamond** o **Playfair Display**.
Color amarillo mostaza: `#D4A017`.
