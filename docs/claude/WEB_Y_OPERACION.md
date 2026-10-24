# Web, funnel, video y operación

> Texto íntegro de lo que vivía en [CLAUDE.md](../../CLAUDE.md) hasta el 18 oct 2026, movido sin recortar. CLAUDE.md conserva cada regla en una o dos líneas y apunta aquí; **lo largo —el porqué, las fechas y los casos— se mantiene en este archivo.** Si una regla cambia, se corrige aquí y su línea en CLAUDE.md.

## Performance — Estado Actual (Abr 2026)

**Historial LCP homepage** (`/`):

| Fecha | LCP | Speed Index | Cambio |
|-------|-----|-------------|--------|
| Línea base | 6.5s | 4.5s | — |
| Imágenes WebP + next/image | 3.8s | 2.6s | turbina.webp + hormigon-tile.webp |
| force-static homepage | 2.9s | — | TTFB CDN edge ~20ms |
| turbina lazy + CSS gradient LCP | 2.7s | 1.7s | LCP = H1 texto, no imagen |
| backdropFilter eliminado + DeferredOrb | 2.5s | 2.0s | Framer 114KB diferido |
| Cache-Control s-maxage=86400 | 2.5s | 2.0s | CDN cachea HTML 24h |

**Decisiones de arquitectura de performance (NO revertir):**

- **`export const dynamic = 'force-static'`** en [src/app/page.tsx](../../src/app/page.tsx) — homepage pre-renderizado en build time, servido desde CDN edge
- **Turbina hero con `loading="lazy"`** — el LCP es el H1 texto (no requiere request de red adicional); turbina aparece ~2s después sin bloquear
- **`DeferredOrb`** en [src/components/DeferredOrb.tsx](../../src/components/DeferredOrb.tsx) — envuelve `UnifiedQueswaOrb` y difiere la carga de Framer Motion (114KB) hasta el primer evento del usuario (scroll/mousemove/touchstart). Fallback: carga a los 3s si no hubo interacción
- **`globals.css` limpio** — reducido de 374 líneas a 166 líneas (9.3KB → 4.3KB). ~18 clases y 4 keyframes eliminados por no tener uso en el proyecto
- **3 fuentes** (Playfair Display, Inter, Roboto Mono) — Montserrat, Oswald y Rajdhani NO están cargadas en la web. `BRAND.fonts` en [src/lib/branding.ts](../../src/lib/branding.ts) son stacks web-safe SOLO para emails (los keys muertos `industrial`/`logo` con Rajdhani se eliminaron jul 2026)
- **Preconnects mínimos** en layout.tsx — solo Material Symbols async. Los preconnects de Google Fonts y Supabase fueron eliminados (next/font self-hostea, Queswa carga lazy)
- **`hormigon-tile.webp`** en [public/images/servilleta/hormigon-tile.webp](../../public/images/servilleta/hormigon-tile.webp) — tile 200×200px de 2KB reemplaza `fondo-global-hormigon.jpg` (299KB) en 12 páginas
- **Cache-Control HTML** en `next.config.js` — `s-maxage=86400, stale-while-revalidate=604800` para todas las páginas excepto `/api/*`

**Techo realista con arquitectura actual:** ~2.3–2.5s LCP en PSI (simulación mobile 3G). Llegar a <1.5s requeriría Critical CSS extraction (frágil con Tailwind) o migrar a servidor con LiteSpeed/full-page cache.

## Critical Git Workflow

**BEFORE any development work**:
```bash
git status  # MUST verify repository is working
```

This repository has **lost its `.git` directory** in the past. Always verify git status before starting work.

**Symptoms of missing .git**:
- ❌ `git status` returns "fatal: no es un repositorio git"
- ❌ Production shows old code despite local changes working
- ⚠️ Vercel deployments show "vercel deploy" instead of `main` branch

**If .git is missing**:
```bash
git init
git remote add origin https://github.com/LuisCabrejo/creatuactivo.com.git
git fetch origin main
git reset --hard origin/main  # WARNING: Overwrites local files
# Restore your changes, then:
git add [files]
git commit -m "✨ Your message"
git push -u origin main
```

**Standard workflow**:
```bash
git status              # Verify repository works
git add [files]
git commit -m "✨ feat: Description"
git push origin main
# ALWAYS verify on GitHub that changes uploaded
```

**Commit Convention** (Conventional Commits):
- `feat(scope):` - New features
- `fix(scope):` - Bug fixes
- `style(scope):` - Visual/style changes
- `content(scope):` - Content updates
- `refactor(scope):` - Code refactoring

### 5. Page Structure & Funnel Architecture

> 📄 **Inventario página por página, historia de la Home y del funnel eliminado → [docs/PAGINAS_Y_FUNNEL.md](../../docs/PAGINAS_Y_FUNNEL.md).** Aquí quedan solo el mapa vigente y las trampas que cuestan horas.

**Funnel vigente** — el de reto/mapa/diagnóstico se eliminó en jul 2026 tras meses sin conversión; sus URLs redirigen a Home (301):

```
Tráfico (reel por nicho / orgánico WhatsApp) → creatuactivo.com/{slug}/{nicho}
                              ↓
              Reel + Queswa (conversa, madura la decisión) → 1-a-1 con el socio
                              ↓
                         /paquetes (activación)

Home → "Hablar con Queswa" (open-queswa) + "Suscríbete" (newsletter → /api/subscribe)
Blog (SEO) → /blog/* → Home
```

⚠️ **Eliminadas el 1 oct 2026** (Director: nunca se usaron en producción): `/fundadores`, `/calculadora` y `/presentacion-empresarial`. Redirigen con 308 en `next.config.js` —las dos primeras a la Home con el `?ref` del socio, la última a `/servilleta`— y sus destinos cortos en `DESTINO_MAP` también. El mismo día salió `/paises/brasil` (→ Home): decía «Lançamento Oficial 2025» y «Gano Excel Oficial», y un distribuidor no se presenta como la página oficial de la marca; con ella se fue el hreflang `pt-BR` del layout raíz. Las APIs (`/api/fundadores/*`, `/api/funnel`) y la secuencia de correos siguen en pie.

**Las tres trampas:**

- ⚠️ **`DESTINO_MAP` (cuesta horas):** un destino que no esté en el mapa —ni en `REEL_NICHOS`— **cae al fallback `/?ref={constructor_id}`, la Home, sin 404** (la mini-landing `/{slug}` se eliminó el 8 jul 2026). Síntoma: *"el enlace `/{slug}/X` lleva a la Home"*. Al añadir un enlace amigable en el Dashboard (`src/lib/arsenal.ts`), agregue SIEMPRE su destino en [src/app/[slug]/[destino]/page.tsx](../../src/app/[slug]/[destino]/page.tsx).
- ⚠️ **`/{slug}` solo, sin destino, también va a la Home con el `ref`** (16 oct 2026, [src/app/[slug]/page.tsx](../../src/app/[slug]/page.tsx)): acepta slug, `constructor_id` y seudónimo anterior; lo demás cae a la 404 propia ([src/app/not-found.tsx](../../src/app/not-found.tsx)), que **no lleva orbe** (`<SinOrbe />`). Hasta ese día el enlace recortado del socio daba la 404 en inglés de Next.js. ⚠️ En Next 14 una página que llama a `notFound()` llega con el cuerpo vacío (`<html id="__next_error__">`) y la 404 se dibuja en el navegador; la persona la ve igual, y el título de la pestaña lo corrige `TituloEnCliente`.
- ⚠️ **OG por página:** la página destino debe declarar su **propio `openGraph.url`**. Si solo define `title`/`description`, hereda el del root layout y al compartir en Meta la publicación enlaza a la raíz aunque el enlace pegado sea correcto. Tras corregir, forzar re-scrape en el Sharing Debugger.
- ⚠️ **Un solo `<h1>` por página**, vía [IndustrialHeader](../../src/components/IndustrialHeader.tsx). Bug recurrente.

**El enlace de Queswa** (`/{slug}/queswa` y los cuatro de los videos) lleva a WhatsApp con el mensaje escrito (en celular y tableta; en computador abre el chat web, abajo); la persona tiene que tocar «Enviar». ⭐ **Desde el 24 oct 2026 en el celular no redirige: sirve un puente** ([src/components/AbrirQueswaEnWhatsApp.tsx](../../src/components/AbrirQueswaEnWhatsApp.tsx)) con la misma tarjeta, el título y la descripción de la tarjeta, y un solo botón, «Abrir Queswa en WhatsApp» (Director; el mensaje pre-llenado no se muestra en la página, lo pidió el Director el 24 oct). Por qué: WhatsApp abre nuestro enlace en su navegador interno, y de un navegador solo se sale a otra app con un toque de la persona. Con el 307 a wa.me (hasta el 23 oct) la persona caía en la página de api.whatsapp.com («Abrir aplicación» · «Descárgala ahora») y Chrome le ponía encima «¿Quieres continuar a WhatsApp?», porque el salto lo pedía un script; el orbe ya lo documentaba desde agosto («wa.me pide un toque más»). Los esquemas nativos desde la redirección (`intent://` y `whatsapp://`, 23 oct 18:20 y 18:31, revertidos esa noche) chocaban con lo mismo. El botón es `intent://` con respaldo a wa.me en Android y `https://wa.me` (enlace universal) en iOS; nada salta solo al cargar, y el orbe se retira. La apertura sigue quedando en `page_visits` (`destino = 'whatsapp'`); el toque sobre el botón todavía no se mide. Desde el 6 oct 2026 la tarjeta dice en negrita dónde ocurre la conversación (`OG_QUESWA`, caso Felipe: creyó que era un error porque no se abrió la pantalla de un agente); desde el 20 oct dice **«Hable con Queswa»**, sin «por WhatsApp», porque en computador es el chat web. ⛔ **El mensaje no lleva código desde el 20 oct 2026** (ni la cookie ` c:…` del enlace ni la huella ` w:…` del orbe): se veía sospechoso en la casilla y la persona no enviaba y cada apertura queda en `page_visits` antes de redirigir (`scripts/medir-aperturas-enlace.mjs`). El orbe web en verde quedó en observación.

⭐ **En el COMPUTADOR, Queswa conversa en la web** (Director, 13 oct 2026, caso Wilson Romero: tocó dos veces el enlace del video desde un computador de escritorio, el navegador intentó abrir WhatsApp y lo leyó como un error; en la semana previa, 3 de 19 aperturas del enlace terminaron en mensaje). En computador el enlace aterriza en `/?ref={constructor_id}&abrir=queswa[&vio={video}]` y `DeferredOrb` abre el chat con el cursor listo, sin ofrecer el botón del video que ya vio; el orbe es el chat web; el botón del hero hace su pregunta dentro del chat; al terminar el video de la Home se abre el chat (el diseño con que empezó la Home), y la guía de `/servilleta` también abre el chat. **En celular y tableta no cambió nada**, salvo en **el catálogo** (`/productos` y `/productos/{ref}`): ahí el chat web abre **en todos los dispositivos**, también en el celular (Director, 13 oct 2026; `esPaginaDeProductos` en orbe-config.ts — la excepción de ganocafe ya solo decide el orbe verde). La regla vive en un solo lugar, igual para el servidor y el navegador: [src/lib/dispositivo.ts](../../src/lib/dispositivo.ts) (solo el agente de usuario y `Sec-CH-UA-Mobile`; el iPad con Safari moderno se anuncia como Mac y cuenta como computador). ⚠️ En computador se pierde lo que da WhatsApp: el número desde el primer mensaje y los avisos con contexto al socio; por eso cada apertura se mide por dispositivo (fila de la Referencia rápida) — si el computador convierte peor que antes, se revisa.

🛑 **Del 20 al 23 oct 2026 el celular y la tableta también fueron al chat web** (Director, 20 oct: de 20 personas que tocaron el enlace ese día en el celular, 12 no tocaron Enviar en WhatsApp; el sospechoso era el código ` c:…` al final del mensaje, y se quitaron las dos cosas a la vez). Medido el 23 oct con `node scripts/medir-aperturas-enlace.mjs --dias 7`, el enlace del socio desde el celular convirtió peor en la web: a WhatsApp (hasta el 20 oct), 13 de 32 navegadores conversaron (41 %); al chat web (21 al 23 oct), 4 de 24 (17 %), y cinco de las seis conversaciones web se quedaron en dos mensajes. **Desde el 23 oct, WhatsApp otra vez en celular y tableta, SIN el código**: la variable que se prueba es WhatsApp sin código, y el 30 oct se mide la semana contra esas dos líneas base. La historia de la línea está en `conversaPorWhatsApp` ([src/lib/dispositivo.ts](../../src/lib/dispositivo.ts)); el catálogo no cambió (chat web en todos). ⚠️ **Lo que el código hacía y ya no hace**: el webhook ataba la ficha de WhatsApp al navegador (`device_info.web_cookie`). Sin él, (a) la **segunda tabla** del script (por dispositivo) muestra WhatsApp cerca de 0 % aunque la gente escriba —la comparación válida es la **primera**, aperturas contra «escribieron», por socio y por día—, y (b) el aviso «abrió y no envió» del Dashboard (`/api/socio/sin-enviar/avisar`, sobre `page_visits.destino = 'whatsapp'`) vuelve a ver estas aperturas pero no puede nombrar a la persona ni confirmar que escribió por la cookie: el inmediato queda sin nombre y pasa al resumen de las 7:00 p. m., y la regla «ante la duda, escribió» calla el aviso cuando al socio le escribe alguien nuevo. La atribución al socio no depende del código: el webhook lee el slug del texto («vengo del enlace de luis-cabrejo»).

**Menú** ([StrategicNavigation.tsx](../../src/components/StrategicNavigation.tsx), array `directLinks`, 1 oct 2026): Presentación (`/servilleta` desde el 10 oct) · Productos (`/productos`) · Tecnología · Nosotros (`/nosotros`) + CTA **"Suscríbete"**. Cuatro enlaces planos, **sin submenú**, en el orden de las preguntas de quien llega (¿cómo funciona? · ¿qué se vende? · ¿con qué? · ¿quién está detrás?). Insights salió (`/blog`, sigue en el pie de la Home). Quien llega a la presentación sin `?ref` ve a su socio si entró antes por su enlace (`constructor_ref`), o al equipo con el WhatsApp Business. ⚠️ **Los rótulos no coinciden con sus rutas a propósito** (jun 2026): el menú nombra *qué encuentra el visitante*, no la ruta técnica.

**Indexadas (y en el sitemap):** `/`, `/blog/*`, `/tecnologia`, `/productos`, `/paquetes`, `/servilleta` (la presentación única desde el 10 oct 2026; responde «plan servilleta»). **noindex:** `/nosotros`, `/prueba`, `/lexico`. ⚠️ **SEO técnico (auditoría 1 oct 2026):** `robots.txt` **no** bloquea `/_next/` (Google necesita el CSS, el JS y las imágenes optimizadas); cada página indexable declara su `canonical`, y el catálogo de cada socio (`/productos/{id}`) apunta a `/productos`.

### La presentación única — `/servilleta`

⭐ **UNA sola presentación, en la URL con el SEO de «plan servilleta»** (Director, 10 oct 2026): quien busca «plan servilleta gano excel» es un distribuidor buscando una herramienta, así que la que se usa y la que se encuentra son la misma. Es la columna que nació en `/presentacion` (23 sep 2026), mudada aquí. **Fuente viva completa → [docs/SERVILLETA.md](../../docs/SERVILLETA.md)**; el mapa de pantallas y las reglas viven en la cabecera de [src/app/servilleta/page.tsx](../../src/app/servilleta/page.tsx).

- **Retiradas** (viven en git): el deck viejo de 4 pantallas de la servilleta, `/presentacion` (+ `/anterior`) y la copia `/12-niveles`. Redirigen con 308 conservando `?ref` y `?pantalla`: `/presentacion`, `/pitch-deck`, `/presentacion-empresarial` → `/servilleta`; `/12-niveles` y los slugs del reto → `/servilleta?pantalla=8` (la de los números; fue la 9 hasta el 18 oct 2026). `/servilleta/{id}` → `?ref={id}`.
- ⛔ **Todo apunta aquí**, incluido el simulador que Queswa ofrece en la web (`textoSimuladorWeb` → `?pantalla=8`) y los enlaces cortos del socio (`DESTINO_MAP`: presentacion · deck · pitch-deck · servilleta → `?ref`; 12-niveles · reto → `&pantalla=8`), que comparten la tarjeta del prospecto (`OG_PRESENTACION` en `src/app/servilleta/og.ts`: sin Gano Excel arriba, `og:url` del slug).
- **Dos pisos:** el deck ocupa la primera pantalla (100dvh) y debajo va la guía SEO ([GuiaPlanServilleta.tsx](../../src/app/servilleta/GuiaPlanServilleta.tsx), el **único `<h1>`** — el credo del deck es `<h2>`). En pantalla completa la guía se oculta; mientras se lee, el teclado no pasa diapositivas. ⛔ **La página no baja hasta la última pantalla** (13 oct 2026): en la portada, deslizar hacia arriba mostraba la guía y la persona creía que la presentación era ese texto. La guía sigue en el HTML (es lo que lee Google); solo se bloquea el desplazamiento, y desde el 18 oct 2026 un desplazamiento hecho con el dedo se devuelve al deck en vez de abrirla (`huboGesto`; no fijar el `body`, que le cortaría la guía a Google), y en la última pantalla aparece la señal «LA PRESENTACIÓN, EN TEXTO ↓» (`guiaAbierta` en `page.tsx`).
- **El video «Cómo funciona» va SOLO como opción, en el botón «VERLO EN VIDEO →» de «La solución»** (pantalla 5; Director, 13-14 oct 2026; se llamó «La propuesta» hasta el 18 oct): el socio elige si rueda el video o explica él los tres elementos, y al terminar el deck salta a la 6, el producto. ⛔ No se repite en otro punto del deck: el repaso en la última pantalla se retiró el 14 oct. Detalle en [docs/SERVILLETA.md](../../docs/SERVILLETA.md).
- ⭐ **Nueve pantallas desde el 18 oct 2026** (Director, tras presentarla en vivo): salió «Qué hace usted» (las dos acciones se MUESTRAN al compartir el enlace delante de la persona; sobreviven en una línea de la multiplicación, en la guía y en `EAM_01` — no reponer la pantalla), la multiplicación pasó a la pantalla 5 detrás del tercer elemento, la frase «Hoy, la mayoría de las personas siente que tiene que hacer algo» va destacada bajo las cifras, y ⭐ **los tres elementos son, en TODAS partes, «un fabricante · una máquina de ventas · una herramienta para multiplicar»** (Director, 18 oct 2026: fabricar · vender · multiplicar). Canon en `WHY_02` 🔒 y `WHY_05` 🔒 (arsenal v6.76), el prompt v5.19, el video «Cómo funciona» v6, la Home, `/prueba`, la guía SEO y el Dashboard (landing, aviso al patrocinador, texto del compartible). *Máquina de ventas* es también el nombre de marca de los cursos de Hotmart, así que **se paga siempre con el mecanismo en la misma frase** (usted envía a quien quiera; ahí conoce y compra; Queswa atiende). *Saber qué hacer* quedó como el MECANISMO del tercero (*le va marcando la ruta, como en Waze*), y el «¿seré capaz?» lo responde la demostración en vivo de queswa.app. ⛔ **«Herramienta», nunca «aplicación»**: la aplicación es el envase de los tres, y un tercer elemento llamado aplicación devuelve la circularidad del 9 oct (auditado con el Director). ⛔ Sin dinero junto a «quien inicie con usted». Queswa reconoce «la máquina de ventas» por una puerta directa a `WHY_02` (`puerta-maquina-ventas.ts`; en el índice diluía, medido). En el deck, la pieza 3 lleva el clip de la multiplicación y «Solo se multiplica lo que es sencillo» queda como remate en texto. Junto a «PREGÚNTELE ALGO AHORA», «VERLA POR DENTRO →» abre queswa.app en Enlaces en una ventana del tamaño de un celular. El clímax lleva el clip `telefono-union-v5` (la fusión en grande y la cámara que se aleja hasta el celular, por código, sin IA).
- **Modo Vertical para Meet:** botón con ícono de celular; iframe `?kiosk=1` a 412×732 escalado, que abre en la pantalla y con el `?ref` del socio. En kiosco: sin guía, sin botones de modo, sin reportar avance, sin aviso de cookies.
- ⛔ **Un asset que cambia lleva NOMBRE NUEVO** (`telefono-union-v5.mp4` → `-v6`…): el service worker sirve los estáticos cache-first y el navegador también; con el mismo nombre, quien ya abrió el deck sigue viendo el viejo.

### Video y Reels

> 📄 **Todo el detalle —inventario de los 6 nichos, componentes, posters, hosting, pipeline de actualización, taxonomía de guiones y el reel de la Home— vive en [docs/handoff/reels/REELS_Y_VIDEO.md](../../docs/handoff/reels/REELS_Y_VIDEO.md).** Post-producción → [scripts/dankoe-video/PIPELINE.md](../../scripts/dankoe-video/PIPELINE.md), que hay que leer **antes** de ensamblar cualquier reel.

**Qué es:** 6 reels verticales por nicho (`corporativo · empleados · empresarios · diaspora · informales · networkers`) que cada socio comparte por WhatsApp. Viven en `creatuactivo.com/{slug}/{nicho}` con tracking de referido. Fuente de verdad: [src/lib/reels.ts](../../src/lib/reels.ts). **NO** se publica reel nativo en IG/TikTok en esta fase.

**Las cuatro reglas que rompen algo si se ignoran:**

- ⚠️ **Los campos de engagement son un contrato cerrado con el Dashboard — no se renombran:** `reel_nicho`, `reel_pct`, `reel_completed`, `reel_time_s`, `queswa_opened`, `queswa_messages`, `visit_count`. Los reporta [ReelVideo.tsx](../../src/components/ReelVideo.tsx) a [`/api/track/engagement`](../../src/app/api/track/engagement/route.ts), que mergea **sin retroceder** (`Math.max` / OR lógico).
- ⚠️ **Anti-spam (crítico):** cada escritura dispara un webhook → push al socio. **Máximo ~6 escrituras por sesión.** Solo milestones del reel (25/50/75/100), `queswa_opened` una vez, y `reel_time_s` + `visit_count` en el beacon de salida. Nunca en `timeupdate` ni en heartbeats.
- ⚠️ **El WhatsApp del socio se lee de `private_users.whatsapp`**, NO de `constructor_slugs.whatsapp`. Bug histórico de "cero inicial" en esos números — el `.replace(/\D/g, '')` lo neutraliza. Fallback: el número orgánico.
- ⚠️ **Tres tipos de guion, tres registros que no se mezclan** (`public/contexto/produccion/guiones/reels/`): **documentación** (build-in-public, primera persona, despierta curiosidad sin confrontar — su mercado ya cree que "hace Gano Excel" y un hook de negocio en cada reel lo quema) · **nicho** (oportunidad directa, es el copy de las páginas `/{slug}/{nicho}`) · **sitio** (explainer en voz **neutra**, nunca "soy Luis", porque la Home la alimentan todos los socios con su `?ref`).

**Léxico de los tres:** sistema de distribución · ingreso que no depende de que usted esté encima · usted decide, el sistema hace el trabajo.

**El reto de los 90 días — un reel al día desde el 7 sep 2026.** Lo que un agente necesita para sacar el de hoy sin reinventar nada:

- 📐 **La rejilla:** [PLAN_CONTENIDO_RETO_90_DIAS.md](../../docs/handoff/negocio/PLAN_CONTENIDO_RETO_90_DIAS.md) — el guion sale de cruzar el **tema de la semana** con el **formato del día** (lunes creencia · martes pregunta real · miércoles escena · jueves píldora · viernes marcador · sábado pregunta real · domingo humano). No son noventa guiones: es el riel que evita la página en blanco. Trae la frase que ancla la serie y las seis reglas.
- 📁 **Los guiones aprobados, uno por día:** `public/contexto/produccion/guiones/reels/aprobados/` (README con el formato). **Se lee el de ayer antes de escribir el de hoy**, y cada día deja su registro con el guion verbatim y *por qué quedó así*. ⛔ Un guion emitido no se edita: se sucede.
- 🎬 **Montaje — son CUATRO pasos y el orden importa** (ver [PIPELINE.md](../../scripts/dankoe-video/PIPELINE.md), que trae el bloque de comandos): `armar-curado.py` (corte declarado en un JSON: sincronía, niveles, tomas buenas, frontera de cuadro) → `blanquear_dientes.py` (dientes y piel, **antes** del color) → `pildora.py --lut --guion … --sin-recorte --sin-compuerta --outro` → `rotulo_dia.py` («VIERNES · DÍA 5»). El vigilante de Drive sigue bloqueado por permisos de macOS: la entrada es `~/Downloads/reels-equipo/`.
- ⚠️ **El micrófono de solapa falla de dos maneras que el oído nota y una medición global no** (11 sep 2026, día 4): puede **saltar a mitad de clip** —el DJI dio 1.17 s, y el clip necesitó dos desfases— y puede **perder audio dentro de una frase** —1.19 s, con la frase durando 2.58 s en la cámara y 1.39 en el micrófono—. Lo segundo no lo arregla ningún corte: se usa el audio de cámara o se quita la frase. **`armar-curado.py` avisa de las dos** al terminar, junto con las frases que suenan por debajo del resto y los cortes que dejan la última palabra sin cola. **Si el informe marca algo, se corrige antes de entregar.**
- ⚠️ **Tres ajustes del pipeline que costaron tres entregas rechazadas, y que ya están en código:** el subtítulo se le da **escrito** (`--guion`), porque con ruido de calle el modelo transcribe «seguimos **arruinando** el equipo» y eso se quema en pantalla · la **compuerta de pausas se apaga** (`--sin-compuerta`), porque se guía por el alineador y le comió 240 ms al «.com» de CreaTuActivo.com · y el audio se **normaliza entero antes de desplazarlo**, no después, o un tramo queda 16 dB por debajo y esa frase no se escucha.
- ⚠️ **Cortar por islas: lo que costó entregas rechazadas en los días 6 y 8** (detalle y comandos en [PIPELINE.md](../../scripts/dankoe-video/PIPELINE.md)). **La apertura va por encima del murmullo, en `piso+18`**: con ruido de centro comercial el murmullo se sienta en +5 a +13 dB y la voz en +20 a +36, y abrir en +10 metió 7.5 s de nada que el Director oyó como huecos. **Las átonas se rescatan uniendo islas a menos de 0.40 s y bajando el cierre solo en su zona.** **Lo que decide es transcribir el montaje y compararlo con el guion**; si falta un bloque seguido, primero se transcribe ese tramo aislado, porque Whisper se salta frases. **La historia entra en una tarjeta de 60 s**: con el outro corto de 1.42 s, apuntar a 59–59.5 s. ⛔ No se le propone quitar frases sin haber medido el habla con el umbral correcto. ⛔ Cada paso se comprueba por su archivo de salida, no por un ✅: un script roto en silencio hizo que la píldora procesara el archivo viejo. ⚠️ El detector de islas **no vive en el repo**: el algoritmo y sus parámetros están en PIPELINE.md
- ✍️ **El guion con el Director** (14 sep 2026, reglas completas en el README de `aprobados/`): ⛔ **lo que él marca como contexto nunca entra al guion** (un párrafo con `*`, *«esto es contexto»*, *«no es para el guion»*; en la duda, es contexto). Cuando entrega su texto, **solo se corrigen gramática, puntuación y cumplimiento**. Primero beats, después redacción. ⛔ **Nunca voz de coach**: una frase que la persona se reconozca diciendo, no un diagnóstico dicho en voz alta
- 🔎 **Antes de publicar, Queswa tiene que poder responder lo que el video estrena:** `NODE_NO_WARNINGS=1 npx tsx scripts/auditar-guion-queswa.mjs <guion.txt>`. Anticipa las preguntas, se las hace al motor real y juzga las respuestas; termina en error si hay ❌. No redacta: la respuesta que falta se le propone al Director en el chat. **Las preguntas sobre el reto** las abre [src/lib/puerta-reto.ts](../../src/lib/puerta-reto.ts) hacia `RETO_01`; *«el plan de los 90 días»* es de los 12 Niveles y no entra por esa puerta. ⛔ **Lo que dice cada video NO se acumula en el prompt** (v5.6, 22 sep 2026): el prompt conserva **solo los dos videos más recientes** —hoy y ayer, tope duro de dos, en `<role_and_objective>`— y el resto vive en el arsenal como fragmentos `RETO_DNN` (con mayúscula: el fragmentador solo lee IDs en `[A-Z0-9]` y salta en silencio lo demás; cinco líneas: qué contó, la cita, la anécdota; índice escrito como pregunta la gente: *«lo de las diez cosas»*, *«el señor que nombró al final»*). **La rutina del día:** al escribir el registro, (1) el video de anteayer sale del prompt y entra al arsenal como fragmento, con la receta de los cinco pasos; (2) el de hoy entra al prompt en dos líneas; (3) la auditoría del guion prueba las dos cosas. Motivo: a 450 caracteres por video, en un mes el bloque pesaba más que todo el recorte de la v5.6 — el costo de un video en el prompt lo paga cada conversación; el de un fragmento, solo quien pregunta por él. ⏳ Que sea la séptima regla del plan sigue pendiente del Director
- ⭐ **La frase de identidad (Director, 10 sep 2026):** *«Creemos que nadie debería entregar su vida entera al ciclo de trabajar, pagar cuentas y repetir. Creemos que el trabajo de cada persona debería convertirse en un activo.»* ⚠️ **La segunda frase cambió el 9 oct 2026** (Director; antes *«…para que recuperen el control de su tiempo y de su dinero»*): le responde a la primera y le da sentido al nombre de la marca. *Activo* y no *capital real*: capital, en un primer mensaje, suena a inversión. Vive igual en la Home, la apertura del canal, el saludo de la web y `WHY_01`/`WHY_05` 🔒/`CRED_01` (arsenal v6.68); la Presentación conserva su segunda mitad propia (*capital real*, Director 24-26 sep), y el perfil del WABA en Meta sigue con la anterior hasta que el Director lo decida. Calca la **mecánica** de la de Nu —adversario nombrado, absolución, restitución—, no sus palabras. La **anáfora es deliberada**: dos frases que abren igual son recurso de manifiesto; lo que sí era defecto era unirlas con coma en una sola frase, que se leía como lista. ⛔ **No lleva juicio de CANTIDAD** (*«y recibir tan poco a cambio»*, descartada el mismo día): el remate de `STORY_03` existe para cerrar esa salida —quien gana bien se exime y se acabó la conversación—. ⛔ Y **sin *absoluto***, que sí dice Nu: en un banco es la cuenta del cliente; aquí sería promesa. ✅ **Desplegada en los tres sitios el 10 sep:** Home v16 (bajo el rótulo «EN QUÉ CREEMOS»), apertura del canal (`wa-apertura.ts`) y `WHY_01` 🔒 (arsenal v6.31).
- ⛔ **«La vida es corta» no abre nada nuestro** (investigación 10 sep): en publicidad hispana viene pegada al hedonismo —*disfruta · date el gusto*— e importa *gástatelo* donde pedimos *asegúrelo*; y lo que mueve a actuar no es el miedo sino el **arrepentimiento anticipado**. Se nombra una **pérdida en curso** (*se le va la vida en…*), nunca un final.
- ⛔ **La apertura del canal NO dice de dónde sale la plata** (Director, 10 sep 2026). La viñeta *«le paga cada vez que hay consumo»* se retiró: sin decir **de quién** es ese consumo, el lector lo rellena con la escalera de gente —la silueta que reconoce como pirámide— y huele la industria en el primer mensaje. Medido: el 5 sep, 2 de 4 personas que tocaron «Cómo funciona» se fueron en la respuesta que ponía el origen del dinero en la segunda línea. El mecanismo se explica cuando preguntan cómo se gana, y ahí ya se entiende que es por movimiento de producto. La cascada queda en dos viñetas; si alguna vez sabe a poco, **el reemplazo no es dinero**. ⚠️ Y con ella salió la **aspiración comparativa** (*«con el potencial de igualar o superar sus ingresos actuales»*), por decisión del Director el mismo día — **quien la eche de menos, que no la reponga sin preguntarle**; la historia completa está junto al código.
- ⛔ **Se afirma, no se anuncia** (Director, 10 sep): *«vienen cambios para hacerlo más en serio»* se oye como *«¿y antes no?»*. Las reglas se dicen en presente y como hecho —*«el acceso es limitado y funciona por lista de espera»*—, con una sola razón dicha una vez. La lista de espera **se siembra desde el día 4**, como consecuencia de una capacidad real, nunca como táctica.


### Founder Spots Counter

⚠️ **La página `/fundadores` se eliminó el 1 oct 2026** (Director: nunca se usó en producción). Su contador estático de 150 cupos se fue con ella; `scripts/test-contador-cupos.mjs` queda como historia.

## Business Timeline

**Fases del Lanzamiento** — ⚠️ **sin fechas duras** (decisión 31 May 2026): la ventana la cierra el cupo, no el calendario. Las fechas vencidas y el countdown estático de `/fundadores` fueron retirados (jul 2026).

1. **Lista Privada** - 150 Founder spots (Fundadores = MENTORES) — fase actual
2. **Pre-Lanzamiento** - 22,500 Constructor spots (150 × 150)
3. **Lanzamiento Público** - Target: 4M+ users

⚠️ **150 vs 15 — no confundir**: **150** = cupos totales de la Lista Privada (la página que lo mostraba, `/fundadores`, se eliminó el 1 oct 2026); **15** = núcleo de socios estratégicos de la fase de cimentación — el número que usan Queswa y los arsenales (ver Queswa Official Constants). Antes de citar cualquiera de los dos en copy nuevo, confirmar con el Director cuál aplica.

**Actualizar fechas**: `node scripts/actualizar-fechas-prelanzamiento.mjs` (legacy — hoy la página no muestra fechas).

## Deployment

### Vercel (Next.js)

- TypeScript errors don't block builds
- Set all env vars in Vercel Dashboard
- Video URLs required in production
- ⚠️ **El proyecto de Vercel que sirve creatuactivo.com se llama `creatuactivo-com`** (repo `LuisCabrejo/creatuactivo.com`, despliega por GitHub), aunque esta carpeta local se llame `marketing`. Ese desajuste de nombres ya causó una confusión: existía un segundo proyecto llamado **`marketing`** —abandonado desde dic 2025, sin repo ni dominio propio— y el `.vercel/project.json` de esta carpeta apuntaba a ÉL, de modo que un `vercel deploy` desde aquí habría publicado en el lugar equivocado. **El 14 ago 2026 se eliminó ese proyecto y se borró el enlace local.** ⚠️ **Volvió el 16 oct 2026 (11:37):** alguien corrió `vercel` en esta carpeta, el CLI creó otra vez un proyecto `marketing` conectado al mismo repositorio, y cada push disparó dos despliegues; el duplicado fallaba siempre («supabaseUrl is required»: no tiene variables) y los commits se veían en rojo aunque creatuactivo.com compilaba bien. Se eliminó el 17 oct, con su `.vercel/`. **Nunca correr `vercel` / `vercel link` en esta carpeta.** Para auditar despliegues, solo lectura y sin enlazar: `vercel ls creatuactivo-com --scope luis-cabrejo-s-projects` y `vercel inspect <url> --logs --scope luis-cabrejo-s-projects` (el `VERCEL_TOKEN` de `.env.local` no tiene acceso a ese equipo; el CLI usa la sesión del Director)
- ⚠️ **Un `engines` en `package.json` pisa en silencio la versión de Node del panel de Vercel.** El aviso de fin de vida de Node 20 (ago 2026) salió de ahí: el Dashboard traía `"node": "20.x"` mientras su panel decía 22.x, así que el build corría en 20 y el panel mentía. **Al diagnosticar versión de Node se lee el `package.json` ANTES que el panel** — el log del build lo confirma con un `Warning: Due to "engines"…`. Hoy los 11 proyectos de la cuenta están en **24.x** y este repo no tiene pin (obedece al panel)
- 🔴 **DNS (7 oct 2026, autorizado por el Director): `creatuactivo.com` apunta a la red ANTIGUA de Vercel.** El apex `@` y el comodín `*` son `A 76.76.21.21` (ids `rec_4196c995fb30a6db2d79ca26` y `rec_6d89c14e961208acb88e0e44`), en lugar del `ALIAS → 95783686dc48871e.vercel-dns-017.com` / `cname.vercel-dns-016.com` que Vercel pone por defecto y que resuelve a su red anycast nueva (216.150.x.x · 216.198.79.x · 64.29.17.x). Razón: desde la conexión del Director (Claro Fijo Bogotá) la ruta Claro → GTT → red nueva perdía paquetes más de 4 h (handshake TLS de 4–12 s, cuerpos cortados, 3 cargas completas de 10) mientras por 76.76.21.21 la misma página llegaba en 0,3 s, 10 de 10; lo mismo le pasaba a queswa.app, cambiado igual. Medido con 6 sondas de Globalping en Colombia que **no** era el país ni todo Claro, sino la salida de esa zona. Vercel lista `A 76.76.21.21` como configuración válida de rango 2 (`GET /v6/domains/creatuactivo.com/config`), `misconfigured: false` tras el cambio; MX, TXT, CAA y `send.` intactos. Prueba en 30 s si vuelve el síntoma: `curl -w '%{time_appconnect} %{time_total}' --resolve creatuactivo.com:443:76.76.21.21 https://creatuactivo.com/` contra el DNS normal. Revertir = borrar esos dos `A` y recrear los `ALIAS` (API `/v2/domains/creatuactivo.com/records`, TTL 60 s). Detalle completo en el CLAUDE.md del Dashboard, Breaking Changes 2026-10-07.

### Supabase

**Prerequisites**:
- Enable `pgvector` extension (for embeddings storage)
- Enable `pg_net` extension (for DB triggers to call Edge Functions)

**Critical order**:
1. Apply migrations: `supabase/APPLY_MANUALLY.sql`
2. Seed knowledge base (copy from `knowledge_base/*.txt`)
3. Deploy Edge Function: `npx supabase functions deploy nexus-queue-processor`
4. Create trigger: `supabase/CREATE_TRIGGER_AFTER_FUNCTION.sql`
5. Update system prompts in `system_prompts` table

**Verify**:
- Edge Function logs in Supabase Dashboard
- Test: `curl -X POST https://your-app.vercel.app/api/nexus/producer`
- Check `nexus_queue` table

**Security (RLS)**:
All 34 tables have Row Level Security enabled (Dec 2025). To diagnose/fix:
```bash
# Run in Supabase SQL Editor
# Diagnostic: scripts/diagnostico-seguridad-supabase.sql
# Fix: scripts/fix-rls-seguridad-supabase.sql
```

### Design System: Bimetallic v3.0

**Fuente única y completa → [BRANDING.md](../../BRANDING.md)** (paleta con todos los hex, tipografía, geometría, CTAs, efectos atmosféricos, léxico §7). Aquí solo lo que se aplica en cada decisión:

**Filosofía**: "Quiet Luxury meets Private Equity" — el sitio debe parecer una firma de inversión, no un MLM típico. Dorado = máx 10-20% del lienzo.

| Rol | Token | Hex | Uso |
|-----|-------|-----|-----|
| **Oro (EL PREMIO)** | `--color-brand` | `#C5A059` | CTAs, dinero, logros, títulos clave (hover `#D4AF37`) |
| **Titanio (LA ESTRUCTURA)** | `--color-titanium` | `#94A3B8` | Iconos activos, navegación (hover → oro) |
| **Cian (EL DATO)** | `--color-data` | `#22D3EE` | Labels técnicos en mono, líneas REF, Queswa en línea. ~5%. Nunca en CTAs, títulos ni dinero. ⚠️ Reemplaza a «exclusivo servilleta» (29 ago 2026) — ver [BRANDING.md](../../BRANDING.md) |
| **Fondo** | `--color-bg-primary` | `#0F1115` | Carbón; alterna con `#15171C` elevado |
| **Texto** | `--color-text-primary` | `#E5E5E5` | Cuerpo; `#FFFFFF` solo titulares |
| Estado | | `#10B981` / `#FBBF24` / `#F43F5E` | Éxito / pendiente / alerta |

**Reglas que se rompen a diario:**
- **Iconos**: arrancan titanio, hover → oro. Solo CTAs, cifras y logros nacen dorados (`ICON_COLORS` en [src/lib/branding.ts](../../src/lib/branding.ts))
- **Bordes de card**: glass `rgba(255,255,255,0.1)` neutro; dorado `rgba(197,160,89,0.3)` **solo** en hover
- **Nunca hex hardcodeado** — use los tokens (`var(--color-brand)`, no `#E5C279`; `var(--color-bg-surface)`, no `#18181b`)
- **CTAs**: clases `.cta-primary` / `.cta-secondary` / `.cta-ghost` de [globals.css](../../src/app/globals.css). Nunca fondo sólido + texto invertido en un primario
- **H1/H2**: Inter uppercase para institucional, Playfair natural para editorial y narrativo; eyebrows en `<p>`, nunca `<h2>`. Un solo `<h1>` por página, vía [IndustrialHeader](../../src/components/IndustrialHeader.tsx)
- **Fuentes cargadas**: solo Playfair Display, Inter y Roboto Mono. Cualquier otra (Rajdhani, Oswald, Montserrat) hace fallback al sistema
- **Tailwind**: paletas `titanium`/`carbon`/`champagne` + utilidades `shadow-spotlight`, `bg-spotlight-gold` en [tailwind.config.ts](../../tailwind.config.ts)

**Implementación de referencia**: [src/app/page.tsx](../../src/app/page.tsx) — la Home. Léala antes de crear una página nueva. (`/infraestructura`, la referencia anterior, se eliminó el 29 ago 2026.)


## Insights Estratégicos

Posicionamiento, doctrina de venta, diáspora latina, eventos corporativos Gano Excel, distinciones léxicas críticas → ver [public/contexto/INSIGHTS_ESTRATEGICOS_v1.md](../../public/contexto/INSIGHTS_ESTRATEGICOS_v1.md). Contenido extraído de CLAUDE.md el 18 May 2026 — no es referencia de arquitectura técnica, es referencia de doctrina de venta.

---

## Key Documentation Files

> 📁 **`docs/` (jul 2026)** — handoffs de trabajo e investigaciones, **fuera de `public/`** (no se sirven en la web). Índice en [docs/README.md](../../docs/README.md). Estructura: `docs/handoff/{reels,queswa,negocio}/` + `docs/investigaciones/{prompts,resultados}/`. Los docs **núcleo** (este archivo, `README.md`, `BRANDING.md`, `POSICIONAMIENTO.md`, `EPIPHANY_BRIDGE_OFICIAL.md`, `MANIFIESTO_FUNDADORES.md`, `HANDOFF_CONTEXTO_COMPLETO.md`, `HANDOFF_QUESWA_TECNICO.md`) siguen en la raíz a propósito.

**Extraídos de este archivo (4 ago 2026)** — se movieron para que CLAUDE.md no los cargue en cada sesión:
- [docs/SERVILLETA.md](../../docs/SERVILLETA.md) - La presentación única en `/servilleta` (desde el 10 oct 2026)
- [docs/handoff/reels/VIDEO_Y_ANIMACIONES.md](../../docs/handoff/reels/VIDEO_Y_ANIMACIONES.md) - Video estándar, color grade DaVinci, animaciones Canvas
- [docs/handoff/negocio/ESTRATEGIA_CONTENIDO_Y_VOZ.md](../../docs/handoff/negocio/ESTRATEGIA_CONTENIDO_Y_VOZ.md) - Estrategia de contenido, voz de Queswa (3 niveles), migración léxica, historia del fundador
- [BRANDING.md](../../BRANDING.md) - Design System completo + léxico aprobado/prohibido (§7)

**Architecture & Deploy**:
- [DEPLOYMENT_DB_QUEUE.md](../../DEPLOYMENT_DB_QUEUE.md) - Queue system deployment
- [knowledge_base/README.md](../../knowledge_base/README.md) - Arsenal structure and sync docs

**SEO & Performance**:
- [GOOGLE_SEARCH_CONSOLE_SETUP.md](../../GOOGLE_SEARCH_CONSOLE_SETUP.md) - GSC setup
- [OPTIMIZACIONES_PAGESPEED.md](../../OPTIMIZACIONES_PAGESPEED.md) - PageSpeed optimizations

**Video & Media**:
- [README_VIDEO_IMPLEMENTATION.md](../../README_VIDEO_IMPLEMENTATION.md) - Video implementation
- [QUICK_START_VIDEO.md](../../QUICK_START_VIDEO.md) - Quick start guide
- [HANDOFF-VIDEO-NAVAL-DAVINCI.md](../../docs/handoff/reels/HANDOFF-VIDEO-NAVAL-DAVINCI.md) - DaVinci Resolve color grade handoff

**Business Logic**:
- [CONTADOR_CUPOS_FUNDADORES.md](../../CONTADOR_CUPOS_FUNDADORES.md) - Spots counter spec
- [PITCHES_ARQUITECTO_EMPRESARIAL_V3.md](../../PITCHES_ARQUITECTO_EMPRESARIAL_V3.md) - Sales pitches

**Handoff & Context**:
- ⭐ [docs/handoff/queswa/AUDITORIA_TRAFICO_ORGANICO_SEP2026.md](../../docs/handoff/queswa/AUDITORIA_TRAFICO_ORGANICO_SEP2026.md) — **(5-10 sep): la dinámica cuando entra tráfico real, vuelta por vuelta.** Cómo volcar y separar personas de arneses, leer el `search_method` de cada «sí», llevar el fallo hasta el nodo, escribir el arnés que lo reproduce antes de arreglar; el caso Betsabe resuelto y ocho pendientes con diagnóstico hecho. ⭐ **§8 es la auditoría del DISTRIBUIDOR (caso Patricia Reyes) y trae el checklist de lo que falta** — el primero es que **el socio que prospecta comercios no tiene camino**, que es lo que ella hace de verdad
- ⭐ [docs/handoff/queswa/HANDOFF_UX_CANAL_18AGO2026.md](../../docs/handoff/queswa/HANDOFF_UX_CANAL_18AGO2026.md) — **(18-20 ago).** La experiencia de usuario del canal: acuse de lectura y «escribiendo…», el webhook que responde a Meta antes de trabajar, las fotos de producto, los ciclos de pago calculados, las puertas directas, y las cuatro pruebas automáticas con lo que cada una ve y lo que NO ve
- ⭐ [docs/handoff/queswa/HANDOFF_CANAL_17AGO2026.md](../../docs/handoff/queswa/HANDOFF_CANAL_17AGO2026.md) — **el de los guardarraíles.** Los dos guardarraíles de salida (salud y negocio) con su criterio de calibración, el onboarding del socio por WhatsApp (comando ACTIVAR, plantilla aprobada, avisos), las trece respuestas reescritas, **los cuatro pendientes documentados a propósito** (guardarraíl solo en el webhook · arsenal_ganocafe · SUP_01 · auditoría del catálogo con alérgenos omitidos) y las cuatro lecciones que costaron errores: la cabecera que dicta lo que nombra, los disparadores que no abren puertas en fragmentos largos, el script de medición que medía mal, y por qué una decisión citada en un handoff ajeno es un reporte y no una regla
- ⭐ [docs/handoff/queswa/HANDOFF_CANAL_PRODUCCION_14AGO2026.md](../../docs/handoff/queswa/HANDOFF_CANAL_PRODUCCION_14AGO2026.md) — **el de la salida a producción.** Estado al salir a producción: qué cambió en route.ts (y por qué no se revierte), la prueba de 5 puntos que el Director está corriendo, el arreglo del Flow del simulador, los pendientes en orden, y la lección de la sesión: tres pruebas fallaron por ENRUTAMIENTO, nunca por copy — verificar qué llegó al contexto antes de reescribir nada
- ⭐ [docs/handoff/queswa/HANDOFF_ARSENAL_Y_LANZAMIENTO_AGO2026.md](../../docs/handoff/queswa/HANDOFF_ARSENAL_Y_LANZAMIENTO_AGO2026.md) — **empiece aquí si va a tocar el arsenal.** Estado de la revisión respuesta por respuesta (30 hechas, 3 eliminadas, ~27 pendientes), las 6 pruebas del canal con lo que debe responder cada una, y cómo medir la recuperación con Voyage antes de tocar un disparador
- [HANDOFF_CONTEXTO_COMPLETO.md](../../HANDOFF_CONTEXTO_COMPLETO.md) - Complete business context for onboarding
- [HANDOFF_QUESWA_TECNICO.md](../../HANDOFF_QUESWA_TECNICO.md) - Technical handoff for Queswa chatbot
- [HANDOFF_MENSAJES_1A1_FUNDADORES.md](../../docs/handoff/negocio/HANDOFF_MENSAJES_1A1_FUNDADORES.md) - Guion de mensajes 1-a-1 para captar Fundadores
- [EPIPHANY_BRIDGE_OFICIAL.md](../../EPIPHANY_BRIDGE_OFICIAL.md) - Luis Cabrejo's story (master doc for all storytelling)

**Research**: los resultados viven en `docs/investigaciones/resultados/` (índice en [docs/README.md](../../docs/README.md)). Aquí no se listan títulos: la lista anterior nombraba documentos que ya no existen.

**Handoffs técnicos de Queswa** (in `docs/handoff/queswa/`):
- `HANDOFF-QUESWA-PRECIOS-CVPV.md` - Bug parcialmente resuelto (22 May 2026): nombres de productos + categorías ya correctos (catálogo v7.2 con `<verbatim_lock>`); CV/PV individuales todavía pendientes en BEB_02-06 y PROD_*
- `HANDOFF-QUESWA-UX-M3-BUG.md` - UX bug handoff for M3 flow
- `HANDOFF-GANOCAFE-WIDGET.md` - Integración widget ganocafe.online
- `Handoff_WABA_Queswa_WhatsApp_Estado_Abr2026.md` - Estado integración WABA WhatsApp

**Security**:
- [scripts/diagnostico-seguridad-supabase.sql](../../scripts/diagnostico-seguridad-supabase.sql) - RLS diagnostic
- [scripts/fix-rls-seguridad-supabase.sql](../../scripts/fix-rls-seguridad-supabase.sql) - RLS fix script
