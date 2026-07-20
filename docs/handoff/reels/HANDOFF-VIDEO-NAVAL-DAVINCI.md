# HANDOFF — Video Production: Naval/Dan Koe Style + DaVinci Resolve

**Fecha:** 2026-03-08
**Proyecto:** CreaTuActivo.com (`/Users/luiscabrejo/Cta/marketing`)
**Estado:** Scripts listos ✅ — Pendiente: instalar DaVinci + grabar con nuevo equipo físico

---

## Contexto del Trabajo

Luis produce videos al estilo **Naval Ravikant / Dan Koe** para los videos de:
- **La Epifanía** — historia personal de Luis Cabrejo (bridge page `/reto-5-dias/gracias`)
- **El Mapa de Salida** — presentación del sistema (funnel principal)
- **Fundadores** — video de oferta para la página `/fundadores`

### El problema raíz (ya diagnosticado)
Los LEDs de habitación típicos (~3200K) graban con tono **cálido/sepia** que el software no puede corregir sin distorsionar los tonos de piel. Intentamos 4 enfoques con FFmpeg — ninguno fue satisfactorio.

**Solución real = dos frentes:**
1. **Físico**: Luis está comprando softbox LED bicolor 5600K + fondo negro → esto elimina el problema en origen
2. **Software**: Scripts DaVinci Resolve ya listos en `scripts/` → aplican color grade editorial sobre el nuevo material

---

## Scripts Creados (ya existen en el repo)

### `scripts/generate_lut.py`
Genera el archivo `scripts/naval_style.cube` — un 3D LUT (33×33×33) con:
- Corrección de temperatura 3200K → 5000K
- Black crush (negros más profundos)
- Curva S de contraste editorial
- Desaturación 10%
- Gamma 0.93

```bash
python3 scripts/generate_lut.py
# → scripts/naval_style.cube (ya existe, generado)
```

### `scripts/davinci_naval.py`
Automatización completa de DaVinci Resolve vía Python API:
- Conecta a DaVinci (debe estar ABIERTO)
- Crea proyecto, importa video, aplica LUT naval_style.cube
- Renderiza 1080p + 720p
- Genera poster JPG con FFmpeg (frame en segundo 3)

```bash
# Uso general
python3 scripts/davinci_naval.py \
  --input ~/Desktop/VIDEO-RAW.mp4 \
  --name epifania   # o: mapa-salida, fundadores

# Salidas → public/videos/
#   epifania-1080p.mp4
#   epifania-720p.mp4
#   epifania-poster.jpg
```

### `scripts/naval_style.cube`
LUT ya generado. Si se borra, re-generar con `python3 scripts/generate_lut.py`.

---

## Flujo Completo Cuando DaVinci Esté Instalado

```bash
# 1. Abrir DaVinci Resolve (OBLIGATORIO antes del script)

# 2. En DaVinci → Preferences → General → habilitar:
#    "External scripting using" → Local

# 3. Generar LUT (si no existe)
python3 scripts/generate_lut.py

# 4. Procesar video
python3 scripts/davinci_naval.py \
  --input ~/Desktop/epifania-raw.mp4 \
  --name epifania

# 5. Revisar resultado en public/videos/
#    Si el LUT no se aplicó vía API (warning en consola):
#    → DaVinci Color page → clic derecho en nodo → Apply LUT → scripts/naval_style.cube

# 6. Subir a Vercel Blob
node scripts/upload-to-blob.mjs
```

---

## Si la API de DaVinci Falla (Plan B Manual)

La API Python de DaVinci Resolve puede fallar si:
- DaVinci no está abierto
- `External scripting` no está habilitado en Preferences
- La versión de DaVinci no soporta `SetLUT()` en ese nodo

**En ese caso, flujo manual en DaVinci:**
1. File → Import Media → seleccionar video raw
2. Arrastrar al timeline
3. Ir a pestaña **Color**
4. Clic derecho en el nodo → **Apply LUT** → navegar a `scripts/naval_style.cube`
5. Ajustar exposición ±0.3 si el gamma queda muy oscuro
6. Render As → MP4 → 1080p → H.264 → 10,000 kbps → `public/videos/epifania-1080p.mp4`
7. Repetir para 720p → 5,000 kbps

**Luego generar poster:**
```bash
ffmpeg -i public/videos/epifania-1080p.mp4 \
  -ss 00:00:03 -vframes 1 -q:v 2 \
  public/videos/epifania-poster.jpg
```

---

## Referencia Visual del Estilo Objetivo

**Dan Koe**: fondo #050505 (negro casi puro), tonos de piel neutros, alto contraste, viñeta sutil
**Naval Ravikant**: talking head natural, colores neutros, negros profundos, nada saturado

**Lo que distingue el look:**
- Fondo completamente negro (no gris oscuro)
- Tonos de piel ni cálidos ni fríos — neutros/naturales
- Negros que llegan a 0 (no levantados)
- Mínimo procesamiento visible

---

## Estado del Equipo Físico

Luis está comprando (Mar 2026):
- **Softbox LED bicolor** — buscar 5600K daylight, mínimo 60W, con difusor
- **Fondo negro** — tela o papel fotográfico
- Sin esto, el LUT no puede compensar completamente el tono sepia del LED cálido

---

## Archivos de Video Actuales en `public/videos/`

```
epifania-1080p.mp4    ← versión anterior (sepia, antes del nuevo equipo)
epifania-720p.mp4     ← versión anterior
epifania-poster.jpg   ← poster de versión anterior
fundadores-4k.mp4     ← video fundadores
```

Cuando se grabe nuevo material, reemplazar `epifania-*` con los archivos generados por `davinci_naval.py`.

---

## Tareas Pendientes

| Tarea | Responsable | Estado |
|-------|-------------|--------|
| Comprar softbox LED 5600K | Luis | En proceso 🔄 |
| Comprar fondo negro | Luis | En proceso 🔄 |
| Crear cuenta blackmagicdesign.com | Luis | Pendiente ⏳ |
| Instalar DaVinci Resolve (Free) | Luis | Pendiente ⏳ |
| Grabar nueva versión de la Epifanía con nuevo equipo | Luis | Pendiente ⏳ |
| Correr `davinci_naval.py` sobre nuevo video | Claude Code | Pendiente ⏳ |
| Verificar color grade — aprobar frame | Luis | Pendiente ⏳ |
| Ajustar LUT si el resultado necesita corrección | Claude Code | Pendiente ⏳ |
| Subir a Vercel Blob con `upload-to-blob.mjs` | Claude Code | Pendiente ⏳ |
| Repetir para "Mapa de Salida" y "Fundadores" | Ambos | Pendiente ⏳ |

---

## Cómo Continuar en la Próxima Sesión

1. Leer este documento primero
2. Verificar que DaVinci esté instalado: `ls /Applications/DaVinci\ Resolve/`
3. Confirmar que el video nuevo está grabado y en qué ruta
4. Correr el flujo completo del paso 3 arriba
5. Si hay problemas con la API de DaVinci, usar el Plan B manual

**Comando de verificación rápida:**
```bash
# Verificar que los scripts existen
ls scripts/generate_lut.py scripts/davinci_naval.py scripts/naval_style.cube

# Verificar DaVinci instalado
ls /Applications/ | grep -i davinci

# Ver videos actuales
ls -lh public/videos/
```

---

## Decisiones Técnicas Tomadas (No Reabrir)

1. **FFmpeg puro descartado** — 4 enfoques intentados, todos fallaron por temperatura de color bakeada en el sensor
2. **LUT 3D elegido sobre curves** — más preciso, portátil, funciona igual en DaVinci y FFmpeg
3. **DaVinci Resolve Free elegido sobre Adobe Premiere** — tiene Python API nativa, es gratuito, no requiere suscripción
4. **Scripts en `scripts/` del proyecto** — misma ubicación que `optimize-video.sh`, mismo patrón del proyecto
5. **Salida a `public/videos/`** — mismo directorio de todos los videos del proyecto

---

*Documento generado: 2026-03-08*
*Próxima actualización: cuando DaVinci esté instalado y se procese el primer video nuevo*
