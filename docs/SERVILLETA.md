# La presentación única — `/servilleta`

> **Desde el 10 oct 2026 hay UNA sola presentación** (Director), en la URL con el SEO de «plan servilleta». Es la columna que nació en `/presentacion` (23 sep 2026) y se mudó aquí. El deck viejo de 4 pantallas de la servilleta (v6.7, b-rolls en card-scrollers, beat del colapso) y la copia `/12-niveles` **se retiraron**; su documentación vive en el historial de git de este archivo (antes del commit de la mudanza, `c9dbc8a`).
>
> **La fuente viva es el código**: el mapa de las diez pantallas, las reglas que rompen algo y el porqué de cada decisión están en la cabecera y en los comentarios de [src/app/servilleta/page.tsx](../src/app/servilleta/page.tsx). Aquí solo va lo que un agente necesita para no romperla.

## Por qué en `/servilleta`

Quien busca «plan servilleta gano excel» es, sobre todo, **un distribuidor que necesita una presentación para usar** (investigación: `reports/Plan servilleta top 3 Google.md`, con datos de Search Console). La presentación que se usa en el 1-a-1 y la que se encuentra en Google son, por eso, la misma.

## La página tiene dos pisos

1. **El deck** ocupa la primera pantalla (`.pd-root`, `height: 100dvh`). Diez pantallas, algunas por *beats* (`BEATS` en el código). Se presenta en vivo: el socio narra y comparte el enlace después.
2. **La guía en texto** ([GuiaPlanServilleta.tsx](../src/app/servilleta/GuiaPlanServilleta.tsx)) va debajo, fuera del deck: el clic que avanza y el swipe no la alcanzan, y Google la lee sin interacción. Lleva el **único `<h1>`** de la página (el credo del deck es `<h2>`). Se **oculta en pantalla completa** y en el modo kiosco. Mientras alguien la lee (el deck queda a menos del 25 % en vista), el teclado no pasa diapositivas y los videos se pausan.
   - Su copy lo aprobó el Director (8 oct y 10 oct 2026). Cumplimiento de cada frase → cabecera del componente (nunca «oficial», sin cifras de comisión ni precios, GEN5 en compras, las formas de ganar no se numeran).
   - La fecha «Actualizada» se cambia **solo con cambios reales**.

## Lo que rompe algo si se toca sin leer

- ⛔ **Un asset que cambia lleva NOMBRE NUEVO** (`telefono-union-v4.mp4` → `-v5`…) y se actualiza el `src`. El service worker (`public/sw.js`) sirve los estáticos cache-first y el navegador también: con el mismo nombre, quien ya abrió el deck sigue viendo la versión vieja (pasó el 10 oct con las v2–v4 del clip de la unión). Al cambiar la página, subir `CACHE_VERSION`.
- ⛔ **Al verificar con Playwright, desregistrar el service worker** (`navigator.serviceWorker.getRegistrations()` + `caches.delete`): si no, la prueba mira el build anterior.
- ⛔ **El texto del clímax entra por reloj** (`.pd-union-texto`, 3,0 / 3,9 / 4,4 s), atado a la receta del clip `telefono-union` (el cubo armado a 2,48 s, luz plena ~3,6 s). Si cambia el clip, se mueven los retrasos.
- ⛔ **Un solo `<h1>`**: el de la guía. Ninguna diapositiva lo lleva.
- ⚠️ **Swipe**: solo los `<input>` (sliders, el nombre del prospecto) exoneran el gesto. No añadir paneles ni botones a esa lista.
- ⚠️ **Moneda**: pesos con punto de miles, dólares con coma; los locales van explícitos (`es-CO` / `en-US`).
- ⚠️ **En el deck no conviven precio de entrada y comisión.** Solo hay comisiones; los precios viven en `/paquetes`.

## Redirecciones y enlaces (todo apunta aquí)

- `next.config.js` (308, conservan `?ref` y `?pantalla`): `/presentacion`, `/presentacion/*`, `/pitch-deck`, `/presentacion-empresarial` → `/servilleta`; `/12-niveles`, `/12-niveles/{ref}` y los slugs del reto → `/servilleta?pantalla=9`; `/presentacion/opengraph-image` → `/servilleta/opengraph-image`.
- `/servilleta/{id}` → `/servilleta?ref={id}` (ruta `[constructorId]`).
- `DESTINO_MAP` en `src/app/[slug]/[destino]/page.tsx`: `presentacion` · `deck` · `pitch-deck` · `servilleta` → `?ref`; `12-niveles` · `reto` → `&pantalla=9`. Todos comparten la **tarjeta del prospecto** (`OG_PRESENTACION`, `src/app/servilleta/og.ts`): no nombra a Gano Excel arriba y su `og:url` es el del slug (para que Facebook no publique el enlace sin el socio).
- La tarjeta de `/servilleta` a secas (la de Google) lleva el título SEO de su layout y la imagen de los pares de la modernización (`opengraph-image.tsx`, rótulo «CreaTuActivo · Plan servilleta»).
- Queswa en la web: `textoSimuladorWeb` (conductor) → `/servilleta?pantalla=9`.
- El socio del `?ref` (o el `constructor_ref` que guarda `tracking.js`) aparece en la última pantalla con su WhatsApp; sin socio, el equipo (WhatsApp Business). El avance se reporta en hitos a `/api/track/presentacion`; el Dashboard lo llama «su Presentación».

## Modo Vertical para Meet

Botón con ícono de celular en el HUD (oculto en el teléfono). Un monitor horizontal no va a pantalla completa en vertical, así que se simula: iframe de `/servilleta?kiosk=1` a 412×732 lógicos (dispara el diseño de teléfono), escalado para llenar la pantalla en negro, en pantalla completa nativa. Abre **en la pantalla y con el `?ref`** del socio; el foco pasa al marco al cargar. En kiosco (clase `kiosk` en `<html>`): sin guía, sin botones de modo ni de pantalla completa, sin reportar avance, sin aviso de cookies (`data-cookie-banner`) y sin barra de desplazamiento visible. Esc o ✕ cierran.

## Los videos del deck

Todos en `public/videos/presentacion/`, mudos (en vivo la banda sonora es el socio), con poster. Cada `<video>` declara `data-beat="pantalla-beat"` y un solo efecto reproduce el del beat activo y pausa-rebobina los demás; con movimiento reducido queda el poster.

- `pieza-fabricante` · `pieza-atiende` · `pieza-ruta`: las tres piezas (pantalla 5), recortes cuadrados de los b-rolls de `public/videos/servilleta/`.
- `telefono-union-v4`: el clímax — la unión de los tres cubos dentro del celular, el cubo que enciende su luz interior y late, 60 s sin rearmarse. Receta reproducible: `scripts/dankoe-video/captions/work/como-funciona/armar_telefono_union.py`.
- `multiplicacion`: «Solo se multiplica lo que es sencillo» (pantalla 6). `pieza-atiende` se reutiliza en el centro de «Qué hace usted».

## Queswa en la presentación

El orbe flotante **no** se muestra (`isDeck` en `UnifiedQueswaOrb`): el chat se abre solo desde el botón «PREGÚNTELE ALGO AHORA» de la pieza 2 (evento `open-queswa`), porque es la demostración en vivo y mandarla a WhatsApp sacaría al prospecto de la reunión (`RUTAS_ORBE_QUESWA_WEB` en `orbe-config.ts`). El botón de la guía, en cambio, abre Queswa **en WhatsApp**: quien lee desde Google va al canal principal.
