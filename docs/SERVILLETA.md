# La presentación única — `/servilleta`

> **Desde el 10 oct 2026 hay UNA sola presentación** (Director), en la URL con el SEO de «plan servilleta». Es la columna que nació en `/presentacion` (23 sep 2026) y se mudó aquí. El deck viejo de 4 pantallas de la servilleta (v6.7, b-rolls en card-scrollers, beat del colapso) y la copia `/12-niveles` **se retiraron**; su documentación vive en el historial de git de este archivo (antes del commit de la mudanza, `c9dbc8a`).
>
> **La fuente viva es el código**: el mapa de las diez pantallas, las reglas que rompen algo y el porqué de cada decisión están en la cabecera y en los comentarios de [src/app/servilleta/page.tsx](../src/app/servilleta/page.tsx). Aquí solo va lo que un agente necesita para no romperla.

## Por qué en `/servilleta`

Quien busca «plan servilleta gano excel» es, sobre todo, **un distribuidor que necesita una presentación para usar** (investigación: `reports/Plan servilleta top 3 Google.md`, con datos de Search Console). La presentación que se usa en el 1-a-1 y la que se encuentra en Google son, por eso, la misma.

## La página tiene dos pisos

1. **El deck** ocupa la primera pantalla (`.pd-root`, `height: 100dvh`). Nueve pantallas desde el 18 oct 2026 (diez hasta ese día: salió «Qué hace usted»), algunas por *beats* (`BEATS` en el código). Se presenta en vivo: el socio narra y comparte el enlace después.
2. **La guía en texto** ([GuiaPlanServilleta.tsx](../src/app/servilleta/GuiaPlanServilleta.tsx)) va debajo, fuera del deck: el clic que avanza y el swipe no la alcanzan, y Google la lee sin interacción. Lleva el **único `<h1>`** de la página (el credo del deck es `<h2>`). Se **oculta en pantalla completa** y en el modo kiosco. Mientras alguien la lee (el deck queda a menos del 25 % en vista), el teclado no pasa diapositivas y los videos se pausan. **Solo se alcanza desde la última pantalla** (13 oct 2026, Director): antes, en la portada, deslizar hacia arriba la mostraba y la persona creía que la presentación era ese texto. La página no baja hasta la última pantalla, la del WhatsApp (`html:has(.pd-root[data-guia="cerrada"])` → `overflow: hidden`, desde el primer HTML, **solo en `html`**: el `body` del sitio mide la pantalla y, bloqueado, se volvía su propio contenedor), lo que cierra también el desplazamiento interno de las pantallas largas que seguía de largo hacia la página. Ahí aparece abajo la señal «LA PRESENTACIÓN, EN TEXTO ↓». La guía **no** se quita del HTML: Google la lee igual. ⚠️ **El dedo nunca la abre** (18 oct 2026, Director: en la portada la gente desliza hacia arriba y se pierde la presentación). Hasta ese día, cualquier desplazamiento con la guía bloqueada la abría para siempre, así que un navegador que dejara pasar el gesto (sin `:has`, un WebView viejo) la destapaba. Ahora un desplazamiento que llega después de un toque, la rueda o el teclado se devuelve al deck (`huboGesto` en `page.tsx`), y solo el que hace el navegador sin gesto la abre. No se fija el `body`: el documento quedaría del alto de la pantalla y Google dejaría de ver la guía entera. Si la página llega ya desplazada (enlace de Google con `#:~:text=`, la posición restaurada al recargar) o el tabulador entra a la guía (`focusin`), la guía queda abierta; si se vuelve a una pantalla anterior con la página a medio bajar, sube al deck.
   - Su copy lo aprobó el Director (8 oct y 10 oct 2026). Cumplimiento de cada frase → cabecera del componente (nunca «oficial», sin cifras de comisión ni precios, GEN5 en compras, las formas de ganar no se numeran).
   - La fecha «Actualizada» se cambia **solo con cambios reales**.
3. **El video «Cómo funciona» va SOLO como opción, en «La solución»** (pantalla 5, beat 0; se llamó «La propuesta» hasta el 18 oct 2026): bajo «Se requieren tres elementos:», el botón «VERLO EN VIDEO →» (13 oct 2026, Director: el socio escoge si rueda el video o si explica él los tres elementos). Es el corte de WhatsApp y de la Home (`VIDEO_COMO_FUNCIONA_WA`), en una ventana y con voz (se monta con el toque). Son dos caminos por la pantalla 5: al terminar el video, el deck **salta a la pantalla 6** (el producto), porque el video ya contó lo de los beats 1 a 7; si se cierra antes (✕, Esc o tocar fuera), se queda en la propuesta y el socio sigue narrando. Visto al 80 %, marca «ya vio el video» para Queswa (`marcarVioComoFunciona`). Con la ventana abierta, ni el teclado ni el gesto mueven el deck. ⚠️ El video nombra a Gano Excel y el porcentaje de la recompra antes de las pantallas 6 y 8: es elección del socio, que sabe a quién tiene enfrente. ⛔ **No va en ningún otro punto del deck:** el 13 oct 2026 estuvo también como repaso al comienzo de la última pantalla y el Director lo retiró al día siguiente — «únicamente debe estar como opción en el botón».

## Lo que rompe algo si se toca sin leer

- ⛔ **Un asset que cambia lleva NOMBRE NUEVO** (`telefono-union-v4.mp4` → `-v5`…) y se actualiza el `src`. El service worker (`public/sw.js`) sirve los estáticos cache-first y el navegador también: con el mismo nombre, quien ya abrió el deck sigue viendo la versión vieja (pasó el 10 oct con las v2–v4 del clip de la unión). Al cambiar la página, subir `CACHE_VERSION`.
- ⛔ **Al verificar con Playwright, desregistrar el service worker** (`navigator.serviceWorker.getRegistrations()` + `caches.delete`): si no, la prueba mira el build anterior.
- ⛔ **El texto del clímax entra por reloj** (`.pd-union-texto`, 5,4 / 6,5 / 7,0 s), atado a la receta del clip `telefono-union-v5` (fusión en grande hasta 2,48 s · cubo encendido y un latido hasta 5,1 s · la cámara se aleja hasta el celular a 6,3 s). Si cambia el clip, se mueven los retrasos.
- ⛔ **Un solo `<h1>`**: el de la guía. Ninguna diapositiva lo lleva.
- ⚠️ **Swipe**: solo los `<input>` (sliders, el nombre del prospecto) exoneran el gesto. No añadir paneles ni botones a esa lista.
- ⚠️ **Moneda**: pesos con punto de miles, dólares con coma; los locales van explícitos (`es-CO` / `en-US`).
- ⚠️ **En el deck no conviven precio de entrada y comisión.** Solo hay comisiones; los precios viven en `/paquetes`.

## Redirecciones y enlaces (todo apunta aquí)

- `next.config.js` (308, conservan `?ref` y `?pantalla`): `/presentacion`, `/presentacion/*`, `/pitch-deck`, `/presentacion-empresarial` → `/servilleta`; `/12-niveles`, `/12-niveles/{ref}` y los slugs del reto → `/servilleta?pantalla=8` (la de los números; fue la 9 hasta el 18 oct 2026); `/presentacion/opengraph-image` → `/servilleta/opengraph-image`.
- `/servilleta/{id}` → `/servilleta?ref={id}` (ruta `[constructorId]`).
- `DESTINO_MAP` en `src/app/[slug]/[destino]/page.tsx`: `presentacion` · `deck` · `pitch-deck` · `servilleta` → `?ref`; `12-niveles` · `reto` → `&pantalla=8`. Todos comparten la **tarjeta del prospecto** (`OG_PRESENTACION`, `src/app/servilleta/og.ts`): no nombra a Gano Excel arriba y su `og:url` es el del slug (para que Facebook no publique el enlace sin el socio).
- La tarjeta de `/servilleta` a secas (la de Google) lleva el título SEO de su layout y la imagen de los pares de la modernización (`opengraph-image.tsx`, rótulo «CreaTuActivo · Plan servilleta»).
- Queswa en la web: `textoSimuladorWeb` (conductor) → `/servilleta?pantalla=8`. En WhatsApp, al socio, `enlacePresentacion(slug, 8)` (webhook).
- El socio del `?ref` (o el `constructor_ref` que guarda `tracking.js`) aparece en la última pantalla con su WhatsApp; sin socio, el equipo (WhatsApp Business). El avance se reporta en hitos a `/api/track/presentacion`; el Dashboard lo llama «su Presentación».

## Modo Vertical para Meet

Botón con ícono de celular en el HUD (oculto en el teléfono). Un monitor horizontal no va a pantalla completa en vertical, así que se simula: iframe de `/servilleta?kiosk=1` a 412×732 lógicos (dispara el diseño de teléfono), escalado para llenar la pantalla en negro, en pantalla completa nativa. Abre **en la pantalla y con el `?ref`** del socio; el foco pasa al marco al cargar. En kiosco (clase `kiosk` en `<html>`): sin guía, sin botones de modo ni de pantalla completa, sin reportar avance, sin aviso de cookies (`data-cookie-banner`) y sin barra de desplazamiento visible. Esc o ✕ cierran.

## Los videos del deck

Todos en `public/videos/presentacion/`, mudos (en vivo la banda sonora es el socio), con poster. Cada `<video>` declara `data-beat="pantalla-beat"` y un solo efecto reproduce el del beat activo y pausa-rebobina los demás; con movimiento reducido queda el poster.

- `pieza-fabricante` · `pieza-atiende` · `multiplicacion`: las tres piezas (pantalla 5), loops cuadrados. Las dos primeras son recortes de los b-rolls de `public/videos/servilleta/`; la tercera, desde el 18 oct 2026, es la multiplicación (recorte de c-distribuir del video «Cómo funciona»), con `multiplicacion-quieta.webp` (el segundo 4) para la pantalla de las tres quietas. `pieza-ruta` (el pin de mapa) quedó sin uso.
- `telefono-union-v5` (18 oct 2026): el clímax — los tres cubos se funden EN GRANDE, el cubo enciende su luz interior y late una vez, y la cámara se aleja hasta mostrar que vive dentro del celular, donde sigue latiendo hasta los 60 s sin rearmarse. Zoom por código, sin IA: un cambio de forma generado sale caótico. Receta reproducible: `scripts/dankoe-video/captions/work/como-funciona/armar_telefono_union_v5.py` (la v4, con la fusión pequeña dentro del celular desde el primer cuadro, sigue en `armar_telefono_union.py`).
- «Solo se multiplica lo que es sencillo» es el remate en texto de la pantalla 5 (beat 4), sin clip: el clip pasó al tercer elemento.

## Queswa en la presentación

El orbe flotante **no** se muestra (`isDeck` en `UnifiedQueswaOrb`): el chat se abre solo desde el botón «PREGÚNTELE ALGO AHORA» de la pieza 2 (evento `open-queswa`), porque es la demostración en vivo y mandarla a WhatsApp sacaría al prospecto de la reunión (`RUTAS_ORBE_QUESWA_WEB` en `orbe-config.ts`). Al lado, desde el 18 oct 2026, «VERLA POR DENTRO →» abre queswa.app en Enlaces en una ventana del tamaño de un celular (`abrirQueswaAppPorDentro`): el socio comparte su enlace delante de la persona y el aviso le llega ahí mismo. ⚠️ Probar en el equipo del socio que la ventana se abra con el deck en pantalla completa; si no, cae a pestaña nueva.

## Los tres elementos: un fabricante · una máquina de ventas · una herramienta para multiplicar (18 oct 2026)

El Director los presentaba así en sus 1-a-1 —las personas llegan «en seis u ocho» en vez de cero— y ese día los hizo canon en todas partes: la Presentación, `WHY_02` 🔒 y `WHY_05` 🔒 (arsenal v6.76), el prompt v5.19, el video «Cómo funciona» v6, la Home, `/prueba`, esta guía y el Dashboard. Son las funciones de cualquier empresa: fabricar · vender · multiplicar.

- **Una máquina de ventas** es concreta y, desde el 17 oct, verificable (el catálogo es una tienda con pago a Gano Excel). Es también el nombre de marca de los cursos de Hotmart, así que se paga siempre con el mecanismo en la misma frase: usted envía a quien quiera; ahí conoce los productos y los compra, o ve cómo participar; Queswa atiende a cada uno.
- **Una herramienta para multiplicar** conserva *saber qué hacer* como mecanismo: acompaña a cada distribuidor y, como en Waze, le va marcando la ruta. El «¿seré capaz?» lo responde ahora la demostración en vivo de queswa.app. ⛔ «Herramienta», nunca «aplicación»: la aplicación es el envase de los tres. ⛔ Sin dinero junto a «quien inicie con usted».
- Queswa reconoce «la máquina de ventas» por una **puerta directa** a `WHY_02` (`src/lib/puerta-maquina-ventas.ts`): en el índice de `WHY_02` diluía (perdía dos consultas suyas del benchmark de producción).
