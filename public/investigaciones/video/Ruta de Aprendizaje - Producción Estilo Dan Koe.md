# Ruta de Aprendizaje: Producción Audiovisual Estilo Dan Koe

> Documento de referencia para alcanzar el nivel de producción de @DanKoeTalks.
> Basado en análisis de 20 capturas + 6 investigaciones previas.
> Fecha: Febrero 2026

---

## 1. El lenguaje visual de Dan Koe (lo que estamos replicando)

### Elementos fundamentales

| Elemento | Función | Herramienta requerida |
|----------|---------|----------------------|
| Círculo héroe (stroke blanco, sin fill) | Representa al individuo/espectador | After Effects Shape Layers |
| Fondo negro puro (#000000) | Lienzo existencial | Cualquier editor |
| Deep Glow (halo fotométrico) | Energía, consciencia, importancia | Plugin Deep Glow (AE) |
| Nodos conectados por líneas | Conocimiento, red, aprendizaje | AE + Trim Paths |
| Rectángulos/bloques geométricos | Sistema, estructura, hábitos | AE Shape Layers |
| Explosiones radiales | Breakthrough, despertar | AE + Particular o nativo |
| Escaleras isométricas | Progresión, ascenso | AE + 3D o pseudo-3D |
| Iconos orbitales | Multi-disciplina, generalista | AE + iconos SVG stroke |
| Film grain (ruido monocromático) | Calidez analógica, textura | AE: Add Grain + posterizeTime |
| Stroke Tapering | Trazos orgánicos con grosor variable | AE: Stroke Taper (nativo desde 2024) |

### Arco narrativo visual (estructura de cada reel)

```
1. ESTADO INICIAL     → Círculo solo en el vacío (individuo aislado)
2. EL PROBLEMA        → Círculo atrapado en estructura rígida
3. TRANSFORMACIÓN     → Geometría muta (grid → cubo, línea → red)
4. BREAKTHROUGH       → Explosión radial / expansión de luz
5. ESTADO FINAL       → Círculo luminoso con glow (potencial realizado)
```

Cada reel cuenta una historia completa en 60-90 segundos usando SOLO formas abstractas.

### Paleta cromática

| Color | Hex | Uso |
|-------|-----|-----|
| Negro absoluto | `#000000` / `#050505` | Fondo principal |
| Blanco puro | `#FFFFFF` | Strokes, formas hero |
| Blanco humo | `#ECECEC` | Halos secundarios, elementos de fondo |
| Gris medio | `#666666` | Sombras, profundidad |
| Amarillo señal | `#F5C518` | Keywords en subtítulos (opcional) |

**Regla**: El color NO existe en el mundo de Dan Koe. Todo es blanco sobre negro. El color solo aparece en subtítulos para señalizar palabras clave.

---

## 2. Stack tecnológico completo

### Nivel 1: Mínimo viable (inversión ~$85 inicial + $23/mes)

| Herramienta | Función | Costo | Prioridad |
|-------------|---------|-------|-----------|
| **Adobe After Effects** | Animaciones geométricas, Shape Layers, Expressions | $23/mes (plan individual) | OBLIGATORIO |
| **Deep Glow** (AEScripts.com) | Glow fotométrico real (reemplaza glow nativo) | $39 una vez | OBLIGATORIO |
| **Motion Tools Pro** | Panel de easing presets, speed curves | Gratis | ALTA |
| **CapCut Desktop** | Assembly final, subtítulos, B-Roll | Gratis | YA LO TIENEN |
| **DJI Osmo Pocket 3** | Talking head 4K/24fps/D-Log M | Ya adquirido | YA LO TIENEN |
| **DJI Mic 2** | Audio 32-bit float | Ya adquirido | YA LO TIENEN |

### Nivel 2: Potenciador (añadir cuando dominen Nivel 1)

| Herramienta | Función | Costo |
|-------------|---------|-------|
| **Saber** (Video Copilot) | Líneas de energía, núcleos luminosos | Gratis |
| **EaseCopy** | Copiar curvas de easing entre propiedades | $10 |
| **Motion 4** (Mt. Mograph) | Speed curves avanzadas, presets de animación | $50 |
| **Overlord** | Enviar vectores de Illustrator a AE directamente | $45 |
| **DaVinci Resolve** | Color grading profesional de D-Log M | Gratis |

### Nivel 3: Ventaja competitiva (diferenciación)

| Herramienta | Función | Costo | Por qué |
|-------------|---------|-------|---------|
| **Remotion** (React) | Animaciones programáticas exportables con alpha | Gratis (OSS) | Templates reproducibles desde código, ideal para escalar |
| **p5.js + CCapture.js** | Fondos generativos (partículas, redes) | Gratis | Ya tienen código en investigaciones previas |
| **Three.js** | Escenas 3D (bloques flotantes, profundidad) | Gratis | Para composiciones tipo captura 20 |
| **Cavalry** | Motion graphics procedural (alternativa a AE) | $27/mes | Curva menor que AE para geometría |
| **Rive** | Animaciones vectoriales interactivas | Gratis (plan básico) | Doble uso: video + web |

### Costo mensual estimado por nivel

| Nivel | Mensual | Setup inicial |
|-------|---------|---------------|
| Nivel 1 (MVP) | $23/mes | ~$85 (Deep Glow + Motion Tools) |
| Nivel 1+2 | $23/mes | ~$190 |
| Nivel 1+2+3 | $23-50/mes | ~$190 + tiempo de aprendizaje |

---

## 3. Ruta de aprendizaje (8 semanas)

### Semana 1-2: Fundamentos de After Effects

**Objetivo**: Crear un círculo con glow que se mueve suavemente.

**Aprender**:
- Interfaz de AE (compositions, timeline, layers)
- Shape Layers: crear círculo, rectángulo, línea
- Propiedades: Position, Scale, Rotation, Opacity
- Keyframes y el Graph Editor (la herramienta más importante)
- Easing: Easy Ease → ajustar curvas Bezier al 75-100% influencia
- Instalar y usar Deep Glow (aplicar a una capa)

**Recursos recomendados**:
- YouTube: "Ben Marriott" (motion graphics fundamentals)
- YouTube: "School of Motion" (After Effects Kickstart)
- YouTube: "Jake in Motion" (shape layers específicamente)

**Ejercicio**: Recrear la captura 10 (círculo solo en negro con glow sutil).

### Semana 3-4: Shape Layers avanzados

**Objetivo**: Crear la animación de nodos conectados (capturas 7-8).

**Aprender**:
- Trim Paths (líneas que se dibujan a sí mismas)
- Merge Paths, Offset Paths
- Repeater (duplicar formas con offset)
- Stroke Width, Round Cap, Round Join
- Stroke Tapering (grosor variable)
- Parenting y Null Objects
- Motion Blur

**Ejercicio**: Recrear la captura 8 (red radial de nodos conectados).

### Semana 5-6: Expressions y automatización

**Objetivo**: Crear animaciones que "viven" solas (rotación perpetua, grano).

**Aprender**:
- Expressions básicas: `time * N` (rotación perpetua)
- `wiggle(freq, amp)` (movimiento orgánico)
- `posterizeTime(6)` + `random()` (film grain stop-motion)
- `pointOnPath()` (mover objeto a lo largo de un trazo)
- `loopOut("cycle")` (loops infinitos)
- Vincular propiedades entre capas

**Recursos**:
- YouTube: "Motion Science" (expressions)
- Libro: "After Effects Expressions" de Marcus Geduld

**Ejercicio**: Recrear la captura 11 (iconos orbitando en círculo con glow).

### Semana 7-8: Compositing y pipeline completo

**Objetivo**: Producir un reel completo de 60 segundos.

**Aprender**:
- Export con alpha (ProRes 4444)
- Film grain: Add Grain → monochrome → Overlay blend
- Compositing en CapCut: V1 talking head + V2 animaciones AE
- Sincronización audio-visual (markers en AE)
- Subtítulos: Montserrat Bold, word-by-word, keywords en #F5C518

**Ejercicio**: Producir el Día 1 del reto de 30 días completo.

---

## 4. Sistema de templates (para escalar a 30 videos)

Una vez dominados los fundamentos, crear estos 6 templates reutilizables:

### Template 1: "Círculo Héroe"
- Círculo central con Deep Glow
- Parámetros: tamaño, intensidad glow, posición
- Uso: Apertura y cierre de cada video

### Template 2: "Nodos Conectados"
- N puntos conectados por líneas con Trim Paths
- Parámetros: cantidad de nodos, layout (lineal/radial/grid)
- Uso: Conceptos de conexión, aprendizaje, red

### Template 3: "Transformación Geométrica"
- Morph de Forma A → Forma B (grid → cubo, línea → red)
- Parámetros: forma origen, forma destino, duración
- Uso: Evolución, cambio de paradigma

### Template 4: "Explosión Radial"
- Burst de partículas/líneas desde el centro
- Parámetros: intensidad, cantidad de rayos, velocidad
- Uso: Momentos de breakthrough, despertar

### Template 5: "Escalera / Ascenso"
- Bloques isométricos formando escalera
- Parámetros: cantidad de escalones, ángulo, dirección
- Uso: Progresión, niveles, crecimiento

### Template 6: "Pedestal / Museo"
- Objetos sobre pedestales con iluminación dramática
- Parámetros: cantidad de pedestales, iconos, texto
- Uso: Comparación de opciones, distracciones vs. potencial

### Tiempo de producción estimado con templates

| Fase | Sin templates | Con templates |
|------|---------------|---------------|
| Animación | 8-16 horas | 2-4 horas |
| Assembly (CapCut) | 2-3 horas | 2-3 horas |
| Audio + subtítulos | 1-2 horas | 1-2 horas |
| **Total por video** | **11-21 horas** | **5-9 horas** |

---

## 5. Configuración técnica de producción

### Cámara (DJI Osmo Pocket 3)
```
Resolución: 4K (3840x2160)
FPS: 24fps (look cinematográfico)
Shutter: 1/50 (regla 180°)
Perfil: D-Log M 10-bit
ISO: Lo más bajo posible (100-400)
ND Filters: Obligatorio en exteriores
Relación aspecto: 9:16 para reels, 16:9 para YouTube
```

### Audio (DJI Mic 2)
```
Grabación: Internal (32-bit float, anti-clipping)
Gain: -6dB (dejar headroom)
Posición: ~20cm del mentón (lapel)
Respaldo: Siempre grabar backup interno del mic
```

### Cadena vocal (post-producción audio)
```
1. iZotope RX → Reducción de ruido
2. EQ Sustractiva:
   - HPF a 80Hz (eliminar rumble)
   - Cut -3dB en 300-400Hz (reducir muddiness)
3. Compresión: Ratio 3:1, attack 10ms, release 100ms
4. EQ Aditiva:
   - +2dB en 100-150Hz (body/warmth)
   - +3dB en 3-5kHz (presencia/claridad)
5. De-Esser: Target 6-8kHz, threshold suave
6. Compresor secundario: Ratio 2:1 (pegamento)
7. Limitador: Ceiling -1dB, target -14 LUFS
```

### Export de animaciones (After Effects)
```
Formato: ProRes 4444 (con canal alpha)
Resolución: 1080x1920 (vertical) o 3840x2160 (4K)
FPS: 24fps (match con cámara)
Color: sRGB
Canal alpha: Straight (Unmatted)
```

### Export final (CapCut → Plataformas)
```
TikTok/Reels/Shorts:
  - H.264, CBR 15-20 Mbps
  - 1080x1920, 24fps o 30fps
  - Audio: AAC 320kbps

WhatsApp Status (90 segundos máximo):
  - H.264, 1.2-1.4 Mbps (para <16MB)
  - 720x1280 (720p suficiente)
  - Hack HD: Enviar a uno mismo → HD → Reenviar a Estado
  - VENTAJA: El estilo Dan Koe (negro + líneas) comprime muy bien

YouTube Long-Form:
  - H.264, VBR 2-pass, 20-50 Mbps
  - 1920x1080 o 3840x2160
  - Audio: AAC 320kbps
```

### Subtítulos (estilo Dan Koe)
```
Fuente: Montserrat Bold (o similar sans-serif geométrica)
Tamaño: 48-56px (en 1080p)
Color base: #FFFFFF (blanco puro)
Keywords: #F5C518 (amarillo señal)
Aparición: Word-by-word (no frase completa)
Posición: Tercio inferior, centrado
Fondo: Sin fondo (texto directo sobre video)
Sombra: Drop shadow sutil para legibilidad
```

---

## 6. Alternativa sin After Effects (corto plazo)

Mientras se aprende AE, estas opciones permiten crear contenido con estética similar (no idéntica):

### Opción A: Remotion (React)
Si ya dominan React/TypeScript (como sugiere el stack del proyecto):
- Crear componentes de animación en código
- Exportar como MP4/ProRes con canal alpha
- Ventaja: 100% reproducible y parametrizable
- Limitación: Curvas de easing menos orgánicas que AE

### Opción B: Keynote/PowerPoint → Video
- Crear formas geométricas con animaciones
- Exportar como video
- Ventaja: Curva de aprendizaje casi nula
- Limitación: Sin Deep Glow, sin film grain, animaciones rígidas

### Opción C: Canva Pro → Animaciones
- Templates de motion graphics
- Exportar como MP4
- Ventaja: Muy rápido
- Limitación: Estética genérica, no alcanza el nivel Dan Koe

### Opción D: CapCut + overlays pre-fabricados
- Comprar packs de motion graphics en Envato Elements (~$17/mes)
- Buscar: "geometric abstract animations", "line art motion", "minimal shapes"
- Importar como overlays con transparencia en CapCut
- Ventaja: No requiere crear animaciones desde cero
- Limitación: No son personalizadas al mensaje

**Recomendación**: La Opción A (Remotion) es la más alineada con el stack actual del equipo y produce resultados más cercanos al estilo Dan Koe que las demás opciones sin AE.

---

## 7. Próximos pasos concretos

### Fase inmediata (esta semana)
- [ ] Definir estrategia de producción para los primeros videos (con herramientas actuales)
- [ ] Grabar audio del Día 1 con la cadena vocal documentada
- [ ] Crear subtítulos estilo Dan Koe en CapCut

### Fase corta (semanas 1-2)
- [ ] Instalar Adobe After Effects ($23/mes)
- [ ] Comprar Deep Glow ($39)
- [ ] Instalar Motion Tools Pro (gratis)
- [ ] Completar tutorial básico de Shape Layers (3-4 horas)
- [ ] Recrear el círculo héroe con Deep Glow (ejercicio semana 1)

### Fase media (semanas 3-4)
- [ ] Dominar Trim Paths y Graph Editor
- [ ] Crear los primeros 2 templates (Círculo Héroe + Nodos Conectados)
- [ ] Producir el primer reel con animaciones propias

### Fase completa (semanas 5-8)
- [ ] Dominar Expressions básicas
- [ ] Completar los 6 templates
- [ ] Establecer pipeline de producción: Audio → AE → CapCut → Export
- [ ] Producir 2-3 reels por semana con calidad consistente

---

## 8. Referencias y recursos

### Canales de YouTube para aprender
- **Ben Marriott** - Motion graphics fundamentals, estilo accesible
- **School of Motion** - Cursos formales, After Effects Kickstart
- **Jake in Motion** - Shape Layers específicamente
- **Motion Science** - Expressions y automatización
- **Workbench** (Evan Abrams) - Tutoriales técnicos avanzados
- **Mt. Mograph** - Motion 4, easing avanzado

### Plugins esenciales (links)
- Deep Glow: aescripts.com/deep-glow
- Motion Tools Pro: motiondesign.school (gratuito)
- Saber: videocopilot.net/tutorials/saber (gratuito)

### Inspiración directa
- @DanKoeTalks (YouTube/TikTok) - El estándar a replicar
- @mattdavella - Estilo minimalista similar
- @struthless - Animación abstracta + storytelling

### Documentos internos relacionados
- `Edición de Video Estilo Dan Koe.md` - Post-producción en CapCut
- `Estilo Dan Koe_ Guía de Producción de Reels.md` - Tutorial exhaustivo AE
- `Pipeline Producción Audiovisual Cognitivo.md` - Arquitectura neurocinemática
- `Optimización y Límites de Videos para Redes.md` - Specs por plataforma
- `Estratega Viral_ Conceptos Magnéticos para Profesionales.md` - 12 conceptos de contenido
- `Guion y Producción de Video Estratégico.md` - Producción "El Regreso"
