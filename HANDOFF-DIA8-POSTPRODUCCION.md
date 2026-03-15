# HANDOFF: Día 8 — "El Apalancamiento del Artesano Digital"
## Post-Producción: Audio · SFX · Música · Subtítulos

**Para**: Agente Gemini / Editor de Post-producción
**De**: Director de Proyecto (Claude Code + Luis Cabrejo)
**Estado animación**: ✅ FINALIZADA — lista para audio
**Archivo fuente**: `src/app/animaciones/dia8-v2/page.tsx`
**Output del canvas**: `dia8-v2-apalancamiento-38s-60fps.webm`
**URL de previsualización**: `http://localhost:3000/animaciones/dia8-v2`

---

## 1. ESPECIFICACIONES TÉCNICAS DEL VIDEO

| Parámetro | Valor |
|-----------|-------|
| Resolución | 1080 × 1920 px (9:16 vertical) |
| FPS | 60 fps |
| Duración total | 38 segundos |
| Formato canvas (sin audio) | WebM |
| Formato destino final | MP4 H.264 + AAC |
| Estética visual | Dan Koe Style — fondo `#050505`, líneas blancas, sin color |
| Tipografía firma | Montserrat Bold / Weight 900 |
| Plataformas destino | Instagram Reels, TikTok, YouTube Shorts |

---

## 2. MAPA DE ACTOS — TIMING EXACTO

```
TIMELINE COMPLETO (38 segundos)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
0s ─────── 12s ─────── 22s ─────── 28s ─────── 35s ─── 38s
  ACT 1       ACT 2       ACT 3       ACT 4     FIRMA  HOLD
  "Trampa"   "Epifanía" "Estallido" "Cosecha"
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 3. BEAT MAP VISUAL — TIMESTAMP POR TIMESTAMP

### ACTO 1: "La Trampa Mecánica" (0 – 12s)

| Timestamp | Evento visual | Importancia audio |
|-----------|--------------|-------------------|
| 0.0s | Cinta transportadora aparece. Héroe **invisible** | Ambiente arranca |
| **0.6s** | **Héroe entra desde izquierda** (easeOutBack — rebote confiado) | SFX suave de entrada |
| 1.8s | **Cinta empieza a moverse** — aceleración gradual | SFX motor arranca |
| **2.6s** | **Bloque cae desde arriba** (easeOutBounce) | Silencio pre-impacto |
| **~3.1s** | ⚡ **IMPACTO del bloque** — screen shake + flash blanco | **SFX impacto metálico (prioridad máxima)** |
| 3.4s → 7.0s | 14 engranajes aparecen **uno por uno** (cada ~0.28s) | Click metálico sutil por cada gear |
| 7.5s | Reloj de arena desliza desde la derecha | SFX cristal/vidrio |
| **8.5s** | **Vaca entra caminando** desde la izquierda | Pasos suaves (opcional) |
| 9.0s → 10s | Héroe empuja el bloque — líneas de esfuerzo + sudor | Hum mecánico en pico |
| **10.0s** | ⬛ **INICIO FUNDIDO A NEGRO** (dura 2 segundos) | **Fade out de todos los SFX mecánicos** |
| 12.0s | Negro absoluto — transición silenciosa al Acto 2 | Silencio dramático |

### ACTO 2: "La Epifanía" (12 – 22s)

| Timestamp | Evento visual | Importancia audio |
|-----------|--------------|-------------------|
| 12.0s | Emerge de la oscuridad — fade in de 1.2s | Tono puro ascendente (revelación) |
| 12.4s | Héroe se **separa** del bloque, empieza a subir | — |
| 13.2s | Flash de separación (destello blanco breve) | SFX `whoosh` suave |
| 14.8s | Héroe completamente libre, flota en el centro superior | — |
| 15.6s | Rayo de luz hacia el fulcro (línea discontinua animada) | Tono electrónico suave |
| **16.8s** | **Fulcro aparece** dibujándose (triángulo) | SFX lápiz/tiza sobre pizarra |
| **18.8s** | **Palanca se extiende** — bloque al extremo derecho | SFX metal estirado |
| 20.0s | Héroe se posiciona en el extremo izquierdo | — |
| 22.0s | Transición al Acto 3 | — |

### ACTO 3: "El Estallido" (22 – 28s)

| Timestamp | Evento visual | Importancia audio |
|-----------|--------------|-------------------|
| 22.0s | Fulcro estático, palanca horizontal | Música: build up empieza |
| 23.1s | Héroe salta en arco parabólico — ghost trail visible | — |
| 24.4s | Palanca se inclina (MAX_TILT = -0.28 rad) | Crujido metálico |
| **24.7s** | 💥 **EXPLOSIÓN del bloque — 150 partículas** | **SFX explosión (prioridad máxima)** + sub-bass kick |
| 25.5s | Red neuronal (18 nodos) empieza a formarse | Pings cristalinos (uno por nodo) |
| 26.5s | Conexiones entre nodos — líneas blancas densas | Zumbido armónico suave |
| 28.0s | Transición al Acto 4 | Música: release/resolución |

### ACTO 4: "La Cosecha" (28 – 35s)

| Timestamp | Evento visual | Importancia audio |
|-----------|--------------|-------------------|
| 28.0s | Red neuronal autónoma — 18 nodos con drift sinusoidal | Ambiente: lofi/ambient |
| 28.4s | Lluvia de partículas cae desde los nodos | Tintineo suave aleatorio |
| 29.0s | Héroe aparece en escritorio — zona inferior de pantalla | — |
| 29.0 → 35s | **Héroe leyendo**: lean ±5px, nod de comprensión cada ~4.5s | Teclado suave de fondo (8% vol) |
| 29.0 → 35s | Pantalla laptop: texto scrollea + cursor parpadea | — |
| 29.0 → 35s | Línea de atención dashed: héroe → pantalla (muy sutil) | — |
| 29.0 → 35s | Anillo orbital de 12 puntos alrededor del héroe | — |
| 33.6s | Anillos expansivos concéntricos (clímax visual) | Resonancia/reverb expansivo |
| **34.2s** | **Fade to black** | Fade out de música |
| 35.0s | Transición a Firma | — |

### FIRMA (35 – 38s)

| Timestamp | Evento visual |
|-----------|--------------|
| 35.0s | Tarjeta entra desde abajo con slide (0.24s) |
| 35.0s | Starfield de fondo |
| 35.0 → 38s | Backlight sweep derecha→izquierda |
| 35.0 → 38s | Diamante wireframe 3D rotando |
| | `"CREA TU ACTIVO"` (grande, centrado) |
| | `"EL APALANCAMIENTO"` (subtítulo) |
| | `"LUIS CABREJO"` (firma) |
| 38s+ | Hold final — bucle de respiración sin límite |

---

## 4. SINCRONIZACIÓN NARRACIÓN ELEVENLABS

El audio de narración fue generado en ElevenLabs. Mapearlo con estos timestamps:

```
[0.0s – 2.5s]
"Nos han mentido."
→ BEAT: cinta quieta → arranca. Voz antes del impacto.

[2.5s – 7.0s]
"[El sistema dice: más horas, más resultados. Más esfuerzo...]"
→ BEAT: período de gears apareciendo. Tono: atrapamiento, rutina.

[7.0s – 10.0s]
"[Pero hay algo que no te enseñaron en ninguna escuela.]"
→ BEAT: reloj de arena + vaca. Voz desacelera. Pausa intencional.

[10.0s – 12.0s]
⬛ SILENCIO DRAMÁTICO o música instrumental únicamente
→ BEAT: fundido a negro. NO narración.

[12.0s – 16.0s]
"[Existe una herramienta diferente. No trabaja por horas...]"
→ BEAT: héroe se eleva, se libera. Voz: esperanzadora.

[16.0s – 20.0s]
"[...trabaja por PALANCA.]"
→ BEAT: fulcro aparece → palanca se extiende.
→ CRÍTICO: "PALANCA" debe pronunciarse en ~18.8s (cuando la palanca aparece).

[20.0s – 22.0s]
Pausa / música instrumental
→ BEAT: héroe se posiciona.

[22.0s – 24.5s]
"[Una sola acción...]"
→ BEAT: salto + inclinación de palanca.

[24.5s – 27.5s]
"[...lo activa todo.]"
→ BEAT: "todo" debe coincidir con la EXPLOSIÓN (24.7s).
→ CRÍTICO: pico vocal = pico visual.

[27.5s – 29.5s]
"[Eso es el APALANCAMIENTO.]"
→ BEAT: red neuronal formándose.

[29.5s – 34.0s]
"[Mientras estudias. Mientras descansas. La red trabaja por ti.]"
→ BEAT: héroe leyendo + lluvia. Ritmo: pausado, contemplativo.

[34.0s – 35.0s]
⬛ Fade out de narración
→ BEAT: fade to black.

[35.0s – 38s]
SIN NARRACIÓN — solo música y visual de firma.
```

### Ajustes de sincronización críticos:
1. **Impacto bloque (3.1s)** → una sílaba enfática o pausa justo antes
2. **"PALANCA" (18.8s)** → sincronizar con aparición de la palanca
3. **"todo" → EXPLOSIÓN (24.7s)** → el pico vocal más importante
4. **Silencio 10-12s** → 2 segundos sin voz (solo música si la hay)
5. **Firma 35-38s** → sin voz encima

---

## 5. CATÁLOGO DE EFECTOS DE SONIDO (SFX)

### SFX prioritarios (sin ellos el video pierde impacto):

| # | Timestamp | SFX | Vol | Descripción técnica |
|---|-----------|-----|-----|---------------------|
| 1 | 0.0s | Hum mecánico | 20% | Loop ambiente fabril — arranca suave |
| 2 | 1.8s | Motor arrancando | 35% | La cinta empieza a moverse |
| 3 | **3.1s** | **IMPACTO METÁLICO** | **80%** | `clang` + reverb corto + sub-bass punch |
| 4 | 3.4–7.0s | Click engranaje | 12% | Uno por cada gear (14 clicks en 3.6s) |
| 5 | 7.5s | Cristal deslizando | 18% | Reloj de arena entra |
| 6 | 8.5s | Pasos suaves | 10% | Vaca camina (muy sutil, opcional) |
| 7 | 10.0s | Fade out mecánico | → 0% | Todos los sonidos mecánicos desaparecen en 2s |
| 8 | 12.0s | Tono ascendente | 28% | 440Hz → 523Hz — revelación |
| 9 | 16.8s | Tiza sobre pizarrón | 22% | Fulcro se dibuja |
| 10 | 18.8s | Metal estirado | 28% | Palanca se extiende |
| 11 | **24.7s** | **EXPLOSIÓN** | **90%** | Boom + shockwave + debris. Prioridad máxima. |
| 12 | 24.7s | Sub-bass kick | 65% | Impacto físico de la explosión |
| 13 | 25.5s | Pings cristalinos | 10% | Un ping por nodo de red que aparece |
| 14 | 28.0–35s | Teclado suave | 8% | Loop: artesano digital trabajando |
| 15 | 28.0–35s | Tintineo lluvia | 12% | Partículas cayendo — aleatorio |
| 16 | 33.6s | Resonancia expansiva | 38% | Anillos concéntricos — `whoosh` + reverb largo |
| 17 | 35.0s | Swipe/slide | 18% | Tarjeta de firma entra |

### Fuentes de SFX (gratuitas y royalty-free):
- **Freesound.org** — `mechanical gear`, `metal impact`, `explosion`, `crystal ping`
- **Pixabay SFX** — `machinery`, `whoosh`, `notification`, `chalk`
- **Zapsplat** (free tier) — `industrial`, `lever`, `glass slide`
- **YouTube Audio Library** — efectos de sonido libres de derechos

---

## 6. DISEÑO DE MÚSICA DE FONDO

### Mood por acto:

| Segmento | Mood | BPM ref | Estilo |
|----------|------|---------|--------|
| Act 1 (0–12s) | Tensión mecánica, atrapamiento | 90-100 | Piano minimalista + bajo pulsante |
| Transición (10–12s) | Suspenso / vacío | — | Silencio o music box sutil |
| Act 2 (12–22s) | Revelación, claridad, esperanza | 80-90 | Sintetizador limpio + pad etéreo |
| Act 3 (22–28s) | Acción, explosión, energía | 110-130 | Build up → **DROP en 24.7s** |
| Act 4 (28–35s) | Serenidad productiva | 70-80 | Lofi / ambient + soft keys |
| Firma (35–38s) | Autoridad, cierre | — | Nota sostenida o silencio total |

### Estructura de audio completa:
```
Música:    [Tensión ─────── crescendo ──── DROP ──── release ─── ambient ── fades]
SFX:       [Mecánico ──────────────── ⚡ ───── 💥 ───── pings ─── soft ──────────]
Narración: [A ──── B ─── C ─ SILENCE ─── D ─── E ─── F ─── G ─────────────── ──]
Tiempo:    0     4     8    10    12    16    20   24    28    32    35    38s
```

### Niveles de mezcla:
```
Narración ElevenLabs  → 100% (protagonista absoluto)
SFX eventos clave     →  70-90% (puntuales, no sostenidos)
Música de fondo       →  20-30% (soporte, nunca compite con voz)
SFX ambiente          →  10-15% (textura, muy sutil)
```

### Referencias de búsqueda musical:
- Keywords: `"cinematic minimal piano"`, `"dark ambient tension"`, `"electronic build drop"`, `"lofi chill beats"`, `"ambient electronic instrumental"`
- Plataformas: **Epidemic Sound** (recomendado), **Artlist.io**, **YouTube Audio Library**

---

## 7. ESPECIFICACIONES DE SUBTÍTULOS

### Estilo visual (Dan Koe style):

```
POSICIÓN:    Centro inferior — y: 88% de la altura (≈1690px de 1920px)
FUENTE:      Montserrat Bold, Weight 700
TAMAÑO:      52-58px
COLOR:       #FFFFFF (blanco puro)
SOMBRA:      0 2px 12px rgba(0,0,0,0.9) — visibilidad sobre fondo oscuro
BACKGROUND:  NINGUNO — sin caja negra
ALINEACIÓN:  Centrado
MAX WIDTH:   ~800px / máximo 35 caracteres por línea
DURACIÓN:    2-4 segundos por fragmento
FADE:        0.1s entrada, 0.1s salida
```

### Reglas estilo Dan Koe:
1. **Una idea por segmento** — nunca dos frases completas simultáneas
2. **Conceptos clave en MAYÚSCULAS** → `PALANCA`, `ACTIVO`, `APALANCAMIENTO`
3. **Sin puntuación excesiva** — comas y puntos. Sin `...` ni exclamaciones
4. **Timing**: subtítulo aparece 1-2 frames ANTES de que la palabra sea pronunciada
5. **NO mostrar subtítulos durante la firma** (35-38s)

### Subtítulos sugeridos:

```
[0.0s – 2.4s]   "Nos han mentido."
[2.5s – 4.5s]   "El sistema dice: más horas, más resultados."
[4.5s – 7.0s]   "Más esfuerzo. Más herramientas."
[7.0s – 9.5s]   "Pero hay algo que no te enseñaron."
[10.0s – 11.9s] ─── SILENCIO — sin subtítulo ───
[12.0s – 15.0s] "Existe una herramienta diferente."
[15.0s – 18.7s] "No trabaja por horas..."
[18.8s – 21.5s] "...trabaja por PALANCA."
[22.0s – 24.6s] "Una sola acción..."
[24.7s – 27.5s] "...activa todo el sistema."
[27.5s – 29.5s] "Eso es el APALANCAMIENTO."
[29.5s – 32.0s] "Mientras estudias. Mientras descansas."
[32.0s – 34.5s] "La red trabaja por ti."
[34.5s – 35.0s] ─── FADE OUT ───
[35.0s – 38s]   ─── SIN SUBTÍTULOS (solo firma) ───
```

### Herramientas recomendadas:
- **CapCut** (gratuito) → auto-subtítulos con ajuste manual de timing
- **DaVinci Resolve** → control total, profesional, gratuito
- **Adobe Premiere** → si tienes licencia, lo más eficiente

---

## 8. WORKFLOW DE POST-PRODUCCIÓN

### Paso a paso en orden:

```
PASO 1 — Exportar el video base del canvas
   → Abrir http://localhost:3000/animaciones/dia8-v2
   → Presionar ▶ Reproducir
   → Presionar ⏺ Grabar (simultáneamente o reiniciar)
   → Esperar los 38 segundos completos
   → Descarga automática: dia8-v2-apalancamiento-38s-60fps.webm

PASO 2 — Convertir WebM → MP4 (si el editor no acepta WebM)
   → ffmpeg: ffmpeg -i input.webm -c:v copy -c:a copy output.mp4
   → O usar HandBrake (GUI gratuita): preset "Fast 1080p30"

PASO 3 — Importar en DaVinci Resolve (recomendado)
   → New Project → Timeline: 1080×1920, 60fps
   → Importar el .webm o .mp4 base

PASO 4 — Pista 1: Video base (sin audio)

PASO 5 — Pista 2: Narración ElevenLabs
   → Importar el .mp3 de ElevenLabs
   → Sincronizar con el Beat Map (Sección 3)
   → Ajustar velocidad si es necesario (±5% aceptable)
   → Aplicar cadena de procesamiento vocal (ver Sección 9)

PASO 6 — Pista 3: Música de fondo
   → Volumen: 25-30%
   → Fade in: 0-1s | Fade out: 34-38s

PASO 7 — Pista 4+: SFX individuales
   → Cada SFX en su timestamp exacto (ver Sección 5)
   → ⚡ 3.1s impacto y 💥 24.7s explosión son PRIORIDAD

PASO 8 — Pista 5: Subtítulos
   → Texto según Sección 7
   → Verificar legibilidad en móvil (pantalla 5")

PASO 9 — Color grading (opcional)
   → El video base es #050505
   → Crush blacks ligeramente (+3%)
   → Boost highlights (+8%)
   → Mantener contraste alto — es el estilo Dan Koe

PASO 10 — Export final
   → Formato: MP4 H.264
   → Resolución: 1080×1920
   → Bitrate: 10-15 Mbps
   → Audio: AAC 320kbps estéreo
   → Nombre: dia8-apalancamiento-FINAL-[YYYYMMDD].mp4
```

---

## 9. PROCESAMIENTO VOCAL ELEVENLABS (OPCIONAL PERO RECOMENDADO)

La voz de ElevenLabs sale limpia pero puede optimizarse:

| Etapa | Plugin | Configuración | Por qué |
|-------|--------|--------------|---------|
| HPF | Cualquier EQ | 80Hz, 12dB/oct | Elimina rumble |
| Corte | EQ | -3dB en 380Hz (Q media) | Reduce nasalidad |
| Compresión | Compresor | Ratio 4:1, threshold -12dB | Iguala volumen |
| Presencia | EQ | +2dB en 4kHz | Inteligibilidad |
| Aire | EQ | +1.5dB en 12kHz | Fidelidad percibida |
| De-esser | De-esser | 6-8kHz, -4dB | Sibilancia cómoda |

---

## 10. NOTAS DE DIRECCIÓN — ESTILO DAN KOE

### Lo que hace especial esta animación:
- **Hero = glowing circle** — abstracción pura, el espectador se proyecta
- **Metáforas físicas reales** — palanca, fulcro, cinta — no conceptos abstractos
- **La vaca** = consumidor mecánico del sistema (lo que el sistema produce sin pensar)
- **La red (Act 4)** = ecosistema de activos autónomos — el resultado del apalancamiento
- **Negro como protagonista** — el espacio vacío comunica claridad mental

### Lo que NO hacer:
- ❌ No agregar transiciones de color o efectos visuales encima
- ❌ No usar música con letra
- ❌ No poner caja/rectángulo detrás de los subtítulos
- ❌ No alterar el timing de los beats visuales ya programados
- ❌ No sobrecargar de SFX — menos es más
- ❌ No narrar encima de la firma (35-38s)

### Lo que SÍ mantener:
- ✅ El grano de película del canvas (ya incluido al 8%)
- ✅ El silencio de 2 segundos en t=10-12s — no llenarlo
- ✅ El negro absoluto entre actos — es intencional
- ✅ La firma sin voz — dejar que el visual hable solo

---

## 11. CONTEXTO ESTRATÉGICO DE CAMPAÑA

| Elemento | Detalle |
|---------|---------|
| Serie | 30 animaciones Dan Koe Style — CreaTuActivo.com |
| Posición | **Día 8 de 30** |
| Tema | El Apalancamiento — pasar de tiempo→dinero a activos autónomos |
| Audiencia | Profesionales 28-45 años, LATAM |
| Villain implícito | "El Plan por Defecto" — intercambiar tiempo por dinero |
| CTA implícito | Descubrir qué es un activo digital → creatuactivo.com |
| ⚠️ Palabras evitadas | MLM, network marketing, ingresos pasivos, libertad financiera |

---

## 12. CHECKLIST FINAL ANTES DE PUBLICAR

```
□ Video exportado completo sin corrupción (exactamente 38 segundos)
□ Narración ElevenLabs sincronizada con los beats visuales del Acto 1-4
□ ⚡ IMPACTO (3.1s): SFX de golpe metálico audible
□ 💥 EXPLOSIÓN (24.7s): boom + reverb dominante en ese momento
□ Silencio en 10-12s: no hay audio narrativo (ok si hay música muy sutil)
□ "PALANCA" pronunciada cuando la palanca aparece en pantalla (18.8s)
□ Música no supera 30% de volumen en ningún punto
□ Subtítulos legibles en pantalla de teléfono 5" (probar en físico)
□ Subtítulos desaparecen antes de la firma (antes de 35s)
□ Firma visible completa: "CREA TU ACTIVO / EL APALANCAMIENTO / LUIS CABREJO"
□ Export MP4: resolución 1080×1920, ≤100MB para Reels
□ Thumbnail capturado del frame más impactante (sugerido: t=24.7s o t=33.6s)
□ Aspect ratio 9:16 exacto verificado
□ Reproducción sin audio activada en Instagram/TikTok — ¿se entiende la historia solo visual?
```

---

*Documento de Post-producción — CreaTuActivo.com*
*Animación: dia8-v2 | Fecha: 2026-02-19*
