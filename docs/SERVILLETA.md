# Servilleta Digital — Deck Interactivo

> Extraído de `CLAUDE.md` el 4 ago 2026 para aliviar el contexto que se carga en cada sesión.
> **Esta es la fuente viva de la arquitectura del deck.** CLAUDE.md conserva solo el resumen y las reglas que rompen producción.
>
> Aplica igual a **`/12-niveles`**, que es una **copia** de 2.3K líneas de este deck con el Slide 4 modificado — cualquier cambio aquí debe replicarse a mano allá (ver CLAUDE.md → Active Pages).

Herramienta de presentación para conversaciones 1-a-1. **Desde 15 May 2026 usa el mismo sistema de diseño Lujo Silencioso del sitio principal** (no más "Industrial Realism" / paleta steel-orange). La servilleta hereda tokens semánticos vía las variables locales `--bg-dark`, `--concrete`, `--steel`, `--orange` que ahora apuntan a tokens globales (`--color-bg-primary`, `--color-bg-elevated`, `--color-titanium-dark`, `--color-brand`).

| Version | Route | Style |
|---------|-------|-------|
| v6.7 (Main) | `/servilleta` | 4-slide deck; **slides 1 y 2 son card-scrollers con b-rolls 3D + portada** (ver [B-rolls 3D](#b-rolls-3d-en-slides-1-y-2-jun-2026)); fullscreen (F key), keyboard nav, swipe |
| v6.7 (Ref) | `/servilleta/[constructorId]` | Re-exports main page; constructorId read from URL path client-side for tracking |

**Controls**: Arrow keys/Space (avanzar), F (fullscreen), double-click fuera de clip (fullscreen), **swipe horizontal desde cualquier punto** (mobile), **tap sobre un clip = pausa/play solo en táctil** (en desktop el click avanza; pausa desktop = botón central al hover)

**Typography**: `var(--font-sans)` Inter (headings) + `var(--font-mono)` Roboto Mono (data) — unificado con homepage

**Color Palette**: Lujo Silencioso — hereda los tokens del Design System (Carbón + Dorado Champán + Titanio, ver [BRANDING.md](../BRANDING.md)) + Cyan `#22D3EE` como único acento de data exclusivo de la servilleta

## Contenido y copy — fuente de verdad

⚠️ **El copy verbatim de las 4 slides NO se duplica aquí** (se desincronizaba con cada recalibración). Fuentes vivas:
- **Copy renderizado de las slides** (nav, H1/H2, CTAs, `getLifestyleTranslation`, etc.) → [src/app/servilleta/page.tsx](../src/app/servilleta/page.tsx) (deck v6.7).
- **Narración / teleprompter aprobada** → [guion_maestro_servilleta_v3.md](../public/contexto/produccion/guiones/servilleta/guion_maestro_servilleta_v3.md) + su variante `_TELEPROMPTER.md` (⚠️ nombre de archivo legacy `v3` — el contenido es **v5.8**, 3 jul 2026).

Estructura de las 4 slides (**estado 2 ago 2026**): **01 EL PROBLEMA** (portada + 3 cards del *ciclo del dinero*: llega entera · se la reparten · vuelve a empezar — clips `problema-llega / problema-reparte / problema-repite`) · **02 LAS TRES COSAS** (primeros principios: Gano Excel, socio logístico y financiero · Queswa, socio digital · el Método — clips `respaldo / queswa / metodo`, **+ el beat del colapso**) · **03 EL PRODUCTO** · **04 LOS NÚMEROS** (simulador + CTA). Slides 1 y 2 son **card-scrollers simétricos**: cada una abre con SU portada (índice 0) y sigue con 3 clips (1-3); el nombre visible lo pone el `<h3>` HTML, **no el video** → un cambio de léxico NO requiere re-render. La card de Queswa (slide 2) tiene el botón inline que dispara `open-queswa` CustomEvent.

> 🔴 **El slide "QUÉ HACE USTED" se eliminó el 2 ago 2026** (decisión del Director): el deck pasó de 5 a 4 slides. El clip de Queswa ya mostraba los tres pasos, así que *centro de mando → método comprobado → usted solo comparte* repetía el mismo contexto tres veces. Los tres movimientos se absorbieron en la **card del método** del Slide 2 (cian *Método comprobado* + blanco *Compartir · Recibir · Multiplicar*). Los clips `compartir/recibir/multiplicar.mp4` quedaron sin uso en el deck. ⚠️ Las clases CSS `.slide-4-layout` / `.slide-4-bottom` viven dentro de `#slide-3` (el producto) — ya estaban corridas un número **antes** de esta eliminación; no es un bug de la renumeración.
>
> **BEAT DEL COLAPSO (Slide 2, cards 4..9) — patrón Jobs, sin reloj.** La versión vieja tiraba las tres piezas de las esquinas al centro en 3 s automáticos y el público no alcanzaba a leer nada. Ahora cada elemento tiene su momento **a solas y grande**, y el paso al siguiente es una **rotación del mismo objeto** (eso siembra "es la misma cosa" antes de decirlo); luego un ciclo rápido **mudo** y el remate en el celular con WhatsApp. **El orador pasa cada beat con clic/scroll** — vive como 6 índices de card, así hereda la navegación existente, y el indicador los cuenta como un solo punto (`CARD_DOTS`). ⏳ Pendientes los assets definitivos: 3 PNG cuadrados (fábrica · inteligencia · método) + celular con marca de WhatsApp; hoy usa fotogramas de los b-rolls como placeholder.

⚠️ **Léxico**: el deck v6.2 ya está migrado al registro accesible. El copy "Abr 2026" que vivía aquí (PATRIMONIO PARALELO, Base Operativa, UNIDAD DE SUMINISTRO, "tecnología nutricional") es **léxico retirado** — no reintroducir (ver [BRANDING.md §7](../BRANDING.md#7-léxico-queswa--vocabulario-canónico-aprobado--prohibido)).

## Arquitectura Mobile (Abr 2026 — no revertir)

**Slides 1 y 2**: Grid de 3 tarjetas (`.card-industrial`). **Desde jun 2026 el fondo es un `<video>` 3D full-bleed** (ver [B-rolls 3D](#b-rolls-3d-en-slides-1-y-2-jun-2026)), no una imagen split:
- `.card-bg` aloja el `<video>` con **`object-fit: contain` + fondo carbón** → muestra el objeto 3D completo sin recorte (el letterbox es invisible: el clip ya es carbón `#0F1115`). **NO** revertir a `object-fit: cover` ni al split `height: 50%` (recortaba el 3D)
- `.card-content`: overlay absoluto al pie con degradado — solo el **nombre** (slide 1) o nombre + botón Queswa (slide 2 card-1). Sin párrafos ni tachados (name-only)
- Cards inactivas: `filter: brightness(0.45)` → activa: `brightness(1)`; borde activo/hover **dorado** (`var(--orange)`, no cyan)
- `one-card-mode` generalizado de `#slide-2` a `.one-card-mode` (CSS) → aplica a slide 1 y 2; ambas comparten `activeCardIndex` (portada índice 0 + 3 clips índices 1-3, `maxCardIndex=3`)
- ⚠️ **Navegación de card (v6.7 supersede el "bug del salto"):** el índice NO se resetea en ningún efecto — cada ruta lo fija explícitamente: avanzar/`showSlide` → 0 (portada) · **retroceder → `LAST_CARD` (última card de la slide destino)**. El IntersectionObserver de scroll fue **eliminado** (one-card oculta las cards no activas con `display:none` → nunca intersectaban; su mapeo por offset corrompería los índices actuales)

**Slide 3**: `.slide-3-layout` es `flex-direction: column; justify-content: flex-end` en mobile — slide-3-bottom y CTA apilan verticalmente (NO flex-direction: row que hace flotar el CTA a la derecha).

**Slide 4**: Scroll-snap vertical en mobile — dos snap items de `100vh`:
1. `.simulator-panel` — calculadora (INGRESO INMEDIATO / INGRESO RECURRENTE)
2. `.cta-panel` — imagen `boton-accion.jpg` (top 48%) + zona texto (bottom 52%)
   - `.bg-image-cta`: `grayscale(100%) brightness(50%)` por defecto
   - Desktop: imagen gris hasta hover (CSS `:hover` puro — NO setTimeout auto-reveal)
   - Mobile: `ctaVisible` state + IntersectionObserver → `cta-revealed` → color al scroll-snap
   - `#slide-4 { padding-top: 0 }` en fullscreen — elimina espacio negro vacío del HUD
   - **Distribución del overlay:** imagen `48%` + overlay `top: 48%`. **Mobile normal** = `justify-content: center`; **fullscreen mobile** = `justify-content: flex-start` (la `.mobile-nav` se oculta y centrar empujaba el 2º botón fuera de pantalla). ❌ NO unificar ambos a `center`.
   - **Swipe: exoneración SOLO en `<input>`:** `touchSwipeIgnore` ignora el swipe únicamente si el touch nace sobre un `input` (arrastrar el thumb de un slider es horizontal legítimo). ❌ NO añadir `.simulator-panel` ni tabs/botones a esa lista (bloquea el swipe-back del Slide 4). Guard de eje |dx|>|dy| evita que el scroll vertical del simulador cambie de slide. `handleSlideClick` SÍ conserva la lista amplia (click-to-advance dentro del simulador sería caos). Snap del Slide 4 = `proximity` (no `mandatory`) + `.simulator-panel` con `justify-content: flex-start`.
   - Botón primario "ACTIVAR SU EMPRESA DIGITAL →": `width: 100%`, naranja dominante → `/paquetes`
   - Botón secundario "SUSCRIBIRSE AL BOLETÍN →": outline, más angosto → abre `SubscribeModal` (newsletter; OPCIÓN 2 del guion v5.1). Antes empujaba al Diagnóstico de 5 Días → `/empresa-digital`, desconectado como gancho jun 2026

## B-rolls 3D en Slides 1 y 2 (jun 2026)

Slides 1 (qué es una empresa digital) y 2 (primeros principios) usan **b-rolls 3D** como fondo de cada card, en vez de imágenes. Pensado para uso **en vivo en mobile**: cada b-roll muestra **solo el nombre** (Luis narra el resto). Diseño: el video llena la card (`object-fit: contain`, ver bloque Mobile arriba) y la gráfica debe **explicar sin texto**.

**Assets servidos** (Vercel/Next desde `/public`, no Blob) en [public/videos/servilleta/](../public/videos/servilleta/): el deck v6.7 usa 6 clips — `empresa-tradicional · empresa-digital · sonrisaslindas` (slide 1) + `respaldo · queswa · metodo` (slide 2), todos `.mp4`. Son los b-rolls IA (Veo/Vertex) del reel explainer de la Home, CON AUDIO (720×1280 CRF28 + AAC). Prompts/doctrina → `HANDOFF_BROLLS_HOME.md` + `GUIA_IDENTIDAD_VISUAL_IA.md` §9. Reproducción: `preload="none"` + **control central de media** (un solo efecto gobierna TODOS los videos por `data-slide`/`data-card`: la slide abandonada se pausa+rebobina+mutea; en one-card SOLO la card activa reproduce y suena desde 0s; en grid desktop los 3 reproducen EN MUTE).

**UX de clips (v6.7 — no revertir):** tap sobre el clip = pausa/play **SOLO en táctil** (en desktop el click conserva el avance de presentación); **un solo control de pausa, el central** (⏸ al hover en desktop / ▶ persistente al pausar); **retroceso de slide aterriza en la ÚLTIMA card** de la slide destino (`LAST_CARD`, no la portada); **swipe horizontal navega desde CUALQUIER punto** (`touch-action: pan-y` en `.deck-container` + `onTouchMove`/`onTouchCancel`) con guard de eje |dx|>|dy|. Investigación: `public/contexto/produccion/INVESTIGACION_UX_SERVILLETA_SCROLL_VIDEO.md`.

**Fuente histórica (comps Remotion)** → [scripts/dankoe-video/motion/src/](../scripts/dankoe-video/motion/src/): las comps `Matriz3D/IAOnda3D/Checklist3D` (con guard `{(eyebrow||title||sub) && (...)}`) y `Expandir3D/Activar3D/Maestria3D` ya **NO alimentan el deck** (reemplazadas por los b-rolls IA) pero siguen sirviendo a los **reels** — no quitar el guard ni des-registrarlas de `Root.tsx`.

**Semántica de cada gráfica — NO cambiar el mensaje** (calibrado con Luis jun 2026; la gráfica debe gritar el concepto sin texto):
- **Expandir = distribución / alcance.** La orbe central (su celular) emite una **onda que se expande y enciende un campo de ~22 contactos** (espiral girasol) de adentro hacia afuera = "comparte con un clic → su alcance llega a muchos". ❌ NO debe **atraer** nodos hacia el centro (eso comunica lo contrario; fue el bug de la v1).
- **Activar = conversión.** Un prospecto parte **rojo**, un anillo de progreso se llena **rojo→verde** mientras la orbe Queswa lo acompaña desde arriba, y cierra en **verde con ✓** (de acuerdo / listo). Colores de estado de marca (`#F43F5E`→`#10B981`).
- **Multiplicación** (comp `Maestria3D` — nombre interno conservado; los b-rolls del deck son **name-only**, sin texto quemado, así que el rename de léxico no exige re-render)**.** Réplicas **idénticas** (mismo tamaño = iguales) que se duplican **1→2→4→8 de abajo hacia arriba**. ❌ NO usar pirámide ni cascada **top-down** ni nodos de distinto tamaño — es lenguaje MLM (downline) y está prohibido.

**Re-render + deploy de un b-roll:**
```bash
cd scripts/dankoe-video/motion
# comps de pilares: props de texto vacías para render limpio
npx remotion render Matriz3D  out/deck-respaldo.mp4 --gl=angle --props='{"eyebrow":"","count":0,"unit":"","sub":""}'
npx remotion render IAOnda3D  out/deck-queswa.mp4   --gl=angle --props='{"eyebrow":"","title":"","sub":""}'
npx remotion render Checklist3D out/deck-metodo.mp4 --gl=angle --props='{"eyebrow":"","title":"","sub":"","steps":["PASO 01","PASO 02","PASO 03"]}'
# comandos slide 2: defaultProps ya vienen vacíos
npx remotion render Expandir3D out/deck-expandir.mp4 --gl=angle
npx remotion render Activar3D  out/deck-activar.mp4  --gl=angle
npx remotion render Maestria3D out/deck-maestria.mp4 --gl=angle
# optimizar a /public (ej. expandir)
ffmpeg -y -i out/deck-expandir.mp4 -vf scale=720:1280 -c:v libx264 -profile:v high -pix_fmt yuv420p -crf 27 -preset slow -an -movflags +faststart ../../../public/videos/servilleta/expandir.mp4
```
⚠️ Render headless M1 requiere `--gl=angle`. Las comps Remotion en `motion/src` están **untracked** en git (igual que las de los reels — son herramientas de build); en producción solo se versionan los `.mp4` de `public/videos/servilleta/` + `page.tsx`.

## Reglas de iconos Material Symbols en Servilleta (NO revertir)

**Problema conocido**: Los íconos Material Symbols Sharp cargan de forma asíncrona. Si un nombre de ícono aparece como string dentro de `<span className="material-symbols-sharp">nombre</span>`, renderiza como texto literal en inglés hasta que la fuente carga.

**Solución aplicada**: Eliminar el span completo y usar texto Unicode `→` o dejar el elemento sin ícono. Íconos eliminados: `precision_manufacturing`, `calculate`, `cell_tower`, `memory`, `hub`, `rocket_launch`, `verified_user`, `biotech`, `bolt`, `autorenew`, `settings`, `eco`, `bar_chart`.

**Íconos que SÍ funcionan** (cargados síncronos): `fullscreen`, `fullscreen_exit` (en botón fullscreen del nav — usan el font ya cargado en layout.tsx).

## Queswa en Servilleta

Decisión Director 2 jul 2026 — la burbuja sobre los clips NO es la experiencia buscada:
- El orbe flotante **nunca se muestra** en `/servilleta`. Gate en `UnifiedQueswaOrb`: `pathname === '/servilleta' && !visibleInServilleta && !isOpen → null` — el componente monta SOLO mientras el chat está abierto y desaparece al cerrarlo. La página **no despacha** `show-queswa-orb`
- El chat abre únicamente desde el botón "PREGÚNTALE ALGO EN VIVO" (card Queswa de slide 2, dispara `open-queswa`)
- El `body.style.overflow = 'auto'` se restaura temporalmente al abrir Queswa para que el teclado funcione
- La servilleta usa eventos custom (`open-queswa` / `close-queswa`) para comunicarse con `NEXUSFloatingButton`. El `deck-container` mantiene `overflow: hidden` independientemente
