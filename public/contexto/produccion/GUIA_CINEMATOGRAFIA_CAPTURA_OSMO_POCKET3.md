# Guía de Cinematografía — Captura Real (Osmo Pocket 3 + DJI Mic → CapCut)

> **Propósito.** Manual operativo para lograr un acabado **cinematográfico tipo Netflix** en los reels de CreaTuActivo, partiendo del kit real: **DJI Osmo Pocket 3**, **micrófono DJI (Mic 2 / Mic Mini del Creator Combo)** y **grado de color final en CapCut**.
>
> **Dónde encaja.** Esta guía cubre el **frente de la cadena** (rodaje + grado base en CapCut). El export graduado de CapCut es exactamente lo que consume el pipeline de código en [`scripts/dankoe-video/PIPELINE.md`](../../../scripts/dankoe-video/PIPELINE.md), que le suma subtítulos por forced-alignment, motion graphics Remotion, SFX y música por actos. **Regla de integración crítica:** al exportar de CapCut para el pipeline, la **música va en MUTE** (el pipeline la entierra y monta la suya). Ver §8.
>
> **Formato objetivo.** 9:16 vertical · 24 fps · el reel reflexivo/documentación es talking-head de Luis + atmósfera (grano/halation/viñeta). Complementa —no reemplaza— las guías de b-rolls IA ([`GUIA_IDENTIDAD_VISUAL_IA.md`](GUIA_IDENTIDAD_VISUAL_IA.md), [`CINEMATOGRAFIA_INMERSION_3D.md`](CINEMATOGRAFIA_INMERSION_3D.md)).

---

## 0. Qué significa "look Netflix" (para este proyecto)

No es un filtro; son **cuatro decisiones físicas que se toman ANTES de grabar** y que el grado solo termina de pulir:

1. **Rango dinámico real** → grabar en **D-Log M 10-bit** (sombras y luces recuperables, piel que no se quema).
2. **Movimiento con cadencia de cine** → **24 fps + obturador 1/50** (motion blur natural; nada de video "de noticiero" a 60fps nítido).
3. **Separación sujeto-fondo** → luz suave y direccional + fondo en penumbra + algo de profundidad (el sujeto "flota", no está pegado al telón).
4. **Piel protegida, sombras frías** → paleta **teal-orange sutil**: piel cálida en medios, sombras hacia el azul/acero. Con intención, dosificada — nunca el "naranja-teal de máquina".

El lujo de la marca es la **claridad y la contención**, igual que en el copy (test "abuela de 75 años" aplicado a la imagen: si se ve sobre-procesado, está mal).

---

## 1. La cadena de producción (mapa de una sola mirada)

```
[CAPTURA]                 [AUDIO]              [GRADO BASE]           [ACABADO CÓDIGO]
Osmo Pocket 3      +      DJI Mic       →      CapCut          →     scripts/dankoe-video
D-Log M · 4K24 · 1/50    WAV · -6dB          LUT DJI + curvas        subtítulos · SFX
Follow mode              Safety Track        HSL piel · teal-orange   música por actos
                         AGC OFF             viñeta · grano leve      mezcla −14 LUFS
                                             EXPORT SIN MÚSICA ──────┘
```

Cada eslabón hereda los errores del anterior: **un rodaje mal expuesto no se "arregla" en CapCut**. La disciplina está en la captura.

---

## 2. Captura — DJI Osmo Pocket 3

### 2.1. Tabla de ajustes canónica (talking-head / reel reflexivo)

| Ajuste | Valor | Por qué |
|--------|-------|---------|
| **Modo** | Pro | Desbloquea control manual (ISO, shutter, WB, perfil) |
| **Resolución** | 4K (3840×2160) | Sobra-resolución: permite reencuadrar a 9:16 y estabilizar sin perder nitidez. Grabar horizontal y recomponer, salvo que el set sea nativo vertical (ver 2.3) |
| **Frame rate** | **24 fps** | Cadencia de cine. (30 fps solo para contenido tipo documental/informativo) |
| **Obturador (shutter)** | **1/50 s** | Regla 180°: doble del frame rate → motion blur natural. Con luz fuerte, sostenerlo con filtro ND, NO subiendo el shutter |
| **ISO** | **≤ 800** (idealmente 100–400) | Sobre 800 aparece ruido que el grado amplifica. Iluminar el set antes que subir ISO |
| **Perfil de color** | **D-Log M** (10-bit) | Máximo rango dinámico y profundidad para el grado. Requiere LUT en post (§7) |
| **Balance de blancos** | **Manual, fijo** ~5200K (luz día) / ~3200K (tungsteno) | NUNCA WB automático: cambia solo entre tomas y arruina la continuidad del grado |
| **Modo gimbal** | **Follow** (default) | Horizonte nivelado, sigue paneos suaves. Tilt-Locked para caminatas; FPV solo para tomas dinámicas puntuales |
| **Enfoque** | AF con cara / o fijo manual si el sujeto no se mueve | Evita "respiración" de foco (hunting) en talking-head |
| **Estabilización** | Rotational Speed baja/media | Movimiento más "peso de cámara", menos robótico |

### 2.2. La regla del obturador y el filtro ND

Para mantener 1/50 en exteriores o con luz potente sin sobreexponer, **se baja la luz que entra con un filtro ND** (Neutral Density), no subiendo el obturador. Sin ND, con sol, el Pocket 3 se ve forzado a 1/500+ y el movimiento se vuelve "entrecortado" (efecto videojuego). Un kit ND (ND8/ND16/ND32/ND64) es la inversión #1 en look cine para esta cámara.

### 2.3. Vertical (9:16) — dos caminos

- **Recomendado: grabar 4K horizontal y recomponer a 9:16 en CapCut.** Da margen para reencuadre, corrección de horizonte y estabilización. Máxima calidad final.
- **Nativo vertical (Portrait Mode):** rotar la pantalla o "Lock Portrait". Cómodo para captura directa, pero **el modo retrato tope a ~3K tras recorte** y da menos margen de post. Usar solo si el flujo lo exige.

### 2.4. Antipatrones de captura (no hacer)

- ❌ WB automático · ❌ ISO >800 "porque estaba oscuro" · ❌ 60 fps para un reel narrativo (mata la cadencia cine) · ❌ shutter alto en vez de ND · ❌ grabar en perfil "Normal/Vívido" pensando en ahorrar post (se pierde rango irrecuperable).

---

## 3. Iluminación — el 70% del "look" ocurre aquí

El grado no crea luz; solo la modela. Un buen encuadre mal iluminado nunca será Netflix.

### 3.1. Esquema base para Luis (talking-head)

**Three-point clásico**, adaptado a un solo presentador:

- **Key (luz principal):** fuente **grande y suave** (softbox / panel LED con difusión) a **45° del sujeto y ligeramente por encima del nivel de ojos**, apuntando hacia abajo. Orientar la mejilla en sombra hacia cámara → aparece el "triángulo Rembrandt". *Cuanto más grande la fuente relativa al rostro, más suave y premium.*
- **Fill (relleno):** en el lado opuesto, a **~50% de la intensidad del key**. Suaviza las sombras sin borrar el volumen. Puede ser un reflector blanco en vez de una segunda luz.
- **Backlight / rim (contraluz):** detrás del sujeto a 30–45°, apuntando a hombros y nuca → **halo sutil que despega a Luis del telón gris**. Es la luz que más "3D" y separación aporta.

### 3.2. Teal-orange desde el set (no solo en post)

El look complementario se puede **plantar con la luz**, y queda mucho más orgánico que forzarlo en grado:

- Key **cálida** sobre el sujeto (piel en el espectro naranja).
- Fondo/sombras con caída hacia **frío** — un gel azul suave en una luz de fondo, o simplemente dejar el telón gris en penumbra fría.
- El contraste azul↔naranja es el par complementario de mayor separación tonal → el sujeto "salta" del fondo.

### 3.3. Fondo (telón gris)

- Mantenerlo **más oscuro que el sujeto** (1–2 pasos abajo). Un fondo tan brillante como la cara aplana la imagen.
- Un poco de **gradiente/vignette de luz** en el telón (una luz rasante) da textura y evita el "fondo plano de Zoom".
- Distancia sujeto↔fondo: cuanta más, mejor separación y más caída natural de foco.

### 3.4. Si solo hay una luz

Un **panel LED con softbox a 45°** + un **reflector** al lado opuesto ya produce un talking-head de aspecto profesional. La suavidad importa más que la cantidad de luces.

---

## 4. Composición y encuadre 9:16

- **Regla de los tercios:** ojos del sujeto en la línea superior de tercios; nunca centrado-plano ni con la cabeza pegada al borde superior.
- **Espacio negativo:** en vertical, dejar aire a un lado del rostro comunica intención y deja zona limpia para **subtítulos / motion graphics** del pipeline (que caen en el tercio inferior/central). Componer pensando en esos overlays.
- **Profundidad / capas:** algo en primer término o un fondo con caída de foco añade dimensión. Foco largo (tele) separa mejor que gran angular.
- **Nivel de ojos:** cámara a la altura de los ojos de Luis para autoridad y cercanía (ni picado ni contrapicado en el registro institucional).
- **Headroom vertical:** en 9:16 el encuadre pide plano medio-corto / primer plano; controlar el aire sobre la cabeza para que no "flote".

---

## 5. Audio — DJI Mic

El audio limpio es el 50% de la percepción de "producción cara". Un video bien grabado con audio sucio se siente amateur al instante.

### 5.1. Ajustes canónicos

| Ajuste | Valor | Por qué |
|--------|-------|---------|
| **Formato** | **WAV** (sin comprimir) | Máxima calidad para limpiar/editar en post |
| **Ganancia (gain)** | **−6 dB** estudio/interior silencioso · **−8 dB** casual · **−10 dB** entorno ruidoso | Dejar headroom: mejor grabar "bajo y limpio" que clippeado |
| **Safety Track** | **ON, a −6 dB** | Pista de respaldo que salva la toma si un pico distorsiona la principal |
| **Sensibilidad de ruido** | Normal (Low si hay viento/ruido de fondo fuerte) | — |
| **Niveles objetivo** | picos entre **−12 dB y −6 dB** | Hacer un test de 5–10s hablando normal y ajustar |
| **Viento** | **muff/deadcat** siempre en exterior | Elimina el "rumble" grave irrecuperable |

### 5.2. Reglas de oro

- **Desactivar AGC (Auto Gain Control)** en la cámara/receptor. El AGC "bombea" el ruido de fondo entre frases → suena amateur. Niveles manuales, siempre.
- **Apagar la reducción de ruido en cámara** (introduce eco/artefactos).
- **Test antes de cada set:** 5–10s de habla normal, verificar que los picos vivan en −12/−6 dB.
- **Micrófono cerca:** solapa/pecho a ~20 cm de la boca. La proximidad es lo que da el timbre "cálido de podcast".
- **Grabar en ambiente tratado:** una habitación con eco arruina el mejor micrófono. Textiles, alfombra, cortinas ayudan.

---

## 6. Flujo de rodaje — checklist de set

**Antes de grabar (2 min):**
- [ ] Pro mode · 4K · 24 fps · shutter 1/50 · ISO ≤800 · WB manual fijo · **D-Log M**
- [ ] ND puesto si hay luz fuerte (mantener 1/50)
- [ ] Key 45° suave + fill ½ + rim de fondo · telón 1–2 pasos más oscuro
- [ ] DJI Mic: WAV · gain −6/−8 · Safety Track ON · AGC OFF · test de niveles
- [ ] Encuadre: ojos en tercio superior · aire para subtítulos · nivel de ojos
- [ ] Batería + tarjeta con espacio · horizonte nivelado (Follow mode)

**Durante:**
- [ ] Una toma "buena" completa + 1–2 de respaldo · dejar 2s de aire al inicio/fin de cada clip (colchón para el pipeline)
- [ ] Vigilar que el foco no "respire" · no dejar que el WB o el gain cambien entre tomas

---

## 7. Grado de color en CapCut (D-Log M → look final)

**Orden de operaciones** (respetar la secuencia; cambiar el orden cambia el resultado):

1. **LUT de conversión DJI.** Aplicar la LUT oficial **D-Log M → Rec.709** del Osmo Pocket 3 (descarga gratuita en el [Download Center de DJI](https://www.dji.com/downloads/softwares/osmo-pocket-3-dlog-to-rec709)). Esto "normaliza" el material plano a color estándar. Es el punto de partida, no el destino.
2. **Contraste — curva Luma en S.** Bajar sombras, subir luces suavemente → profundidad y "punch" cinematográfico. Sin exagerar (mantener detalle en negros).
3. **Balance / temperatura.** Afinar el WB si hace falta. Empujar sombras hacia **teal/acero** y dejar que las luces conserven algo **cálido** (teal-orange sutil).
4. **HSL — proteger la piel.** Con HSL, ajustar el rango naranja/rojo: mantener la piel natural y saturada lo justo, mientras el resto del cuadro puede ir más frío/desaturado. **La piel es sagrada** — si se ve verde o anaranjada de más, retroceder.
5. **Saturación / claridad.** Referencia de creadores: **saturación 20–25 en interior, ~50 en exterior**; una pizca de **clarity/sharpen** (poca — el exceso delata el filtro).
6. **Viñeta sutil.** Oscurecer bordes muy levemente para llevar el ojo al centro. Debe ser imperceptible conscientemente.
7. **Grano de película leve.** Rompe el "digital limpio" y da textura de cine. Muy sutil (el pipeline de código también puede añadir grano/halation en los reflexivos — coordinar para no duplicar).

**Filosofía de grado:** *dial it back.* Es preferible quedarse corto. El teal-orange fuerte se reserva para momentos que lo justifiquen; el registro institucional de la marca vive en la versión contenida.

---

## 8. Export de CapCut → pipeline de código (integración crítica)

Cuando el reel va a pasar por [`scripts/dankoe-video/`](../../../scripts/dankoe-video/PIPELINE.md):

- **Export SIN música** (pista musical en MUTE). El pipeline monta música por actos y mezcla anclada a voz a **−14 LUFS**; si el export ya trae música, la entierra o desfasa. → deja **voz + ambiente** limpios.
- **1080×1920 · 24 fps · H.264 ~20 Mbps** como fuente (el pipeline/`optimize-reels.sh` re-comprime a CRF 23 + `+faststart` para web).
- Mantener el color **graduado** (el pipeline no re-gradúa; asume material ya con look).
- No quemar subtítulos en CapCut si el pipeline los va a generar por forced-alignment (evita doble capa).

Si el reel es **CapCut-only** (sin pasar por el pipeline), entonces sí se cierra todo en CapCut: música, subtítulos y export final directo. Decidir la ruta ANTES de exportar.

---

## 9. Errores comunes (anti-patrones que delatan "amateur")

| Síntoma | Causa | Fix |
|---------|-------|-----|
| Movimiento "de videojuego" | 60 fps o shutter alto | 24 fps + 1/50 + ND |
| Piel verde/naranja tras el grado | Teal-orange sin proteger HSL de piel | Aislar rango naranja en HSL, retroceder |
| Imagen plana, sujeto "pegado" al fondo | Sin rim light, fondo tan claro como la cara | Backlight + bajar el fondo 1–2 pasos |
| Ruido en sombras | ISO >800 | Iluminar más, bajar ISO |
| Color que "salta" entre tomas | WB automático | WB manual fijo |
| Audio que "bombea" | AGC encendido | AGC OFF, niveles manuales |
| Look sobre-procesado | Grado agresivo, saturación/clarity altas | Dial it back; la contención es el lujo |
| Continuidad rota en post | Cada clip con exposición/WB distintos | Fijar todo en cámara antes de rodar |

---

## 10. Inversiones de mayor impacto (orden de prioridad)

1. **Kit de filtros ND** — habilita 24fps/1/50 en cualquier luz. El salto #1 a "cine".
2. **Una luz suave grande + difusión** (softbox/panel) — el 70% del look.
3. **Deadcat/muff para el DJI Mic** + tratar la sala — audio limpio = producción cara.
4. **Reflector plegable** — fill gratis, evita segunda luz.
5. **Gel azul suave** para el fondo — teal-orange orgánico desde el set.

---

## Fuentes

- [Best Settings for the DJI Osmo Pocket 3 — Settings Lab](https://settingslab.com/best-settings-for-the-dji-osmo-pocket-3-to-get-best-results-on-videos/)
- [DJI Pocket 3 Video Settings — Roman Fox](https://www.snapsbyfox.com/blog/dji-pocket-3-video-settings)
- [DJI Pocket 3: How To Get Pro Level Cinematic Video — DroneXL](https://dronexl.co/2024/02/15/dji-pocket-3-how-to-get-cinematic-video/)
- [DJI OSMO Pocket 3 D-Log M to Rec.709 LUT — DJI Download Center](https://www.dji.com/downloads/softwares/osmo-pocket-3-dlog-to-rec709)
- [How to Color Grade DJI Osmo Pocket 3 D-Log M in CapCut — YouTube](https://www.youtube.com/watch?v=SKudLrLppv0)
- [DJI Mic 2 Best Settings — Zont Sound](https://zontsound.com/dji-mic-2-best-settings/)
- [How to Get Better Audio from the DJI Mic 2 (Pocket 3 Creator Combo) — Vaskoobscura](https://www.vaskoobscura.com/blog/how-to-get-better-audio-from-the-dji-mic-2)
- [Mastering Teal & Orange Film Look — Cinema LUTs](https://www.cinema-luts.com/teal-and-orange/)
- [Cinematic Teal and Orange Look: Lighting Tutorial — Cinecom](https://www.cinecom.net/lighting-tutorials/cinematic-teal-orange-look/)
- [Master Color Grading in CapCut — CapCut](https://www.capcut.com/resource/capcut-color-grading)
- [Shot Craft: The Talking Head — American Society of Cinematographers](https://theasc.com/article/shot-craft-the-talking-head-shooting-interviews/)
- [Three-Point Video Lighting Setup Guide — StudioBinder](https://www.studiobinder.com/blog/three-point-lighting-setup/)
- [DJI Osmo Pocket 3 Stability Tips — Ulanzi](https://www.ulanzi.com/blogs/news/dji-osmo-pocket-3-video-stability-tips)
- [DJI Osmo Pocket 3 — Specs — DJI](https://www.dji.com/osmo-pocket-3/specs)
- [Rules of Shot Composition in Film — StudioBinder](https://www.studiobinder.com/blog/rules-of-shot-composition-in-film/)

---

*Documento de referencia — captura cinematográfica real. Creado jul 2026. Complementa [`GUIA_IDENTIDAD_VISUAL_IA.md`](GUIA_IDENTIDAD_VISUAL_IA.md) (b-rolls IA), [`CINEMATOGRAFIA_INMERSION_3D.md`](CINEMATOGRAFIA_INMERSION_3D.md) y [`scripts/dankoe-video/PIPELINE.md`](../../../scripts/dankoe-video/PIPELINE.md) (acabado por código).*
