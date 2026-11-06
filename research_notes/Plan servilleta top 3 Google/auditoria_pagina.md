# Auditoría on-page y técnica de creatuactivo.com/servilleta (8 oct 2026)

> Método: `curl` de la URL viva con user-agent de Googlebot smartphone (HTML del servidor, sin JS) · render propio en Chrome headless con UA de Googlebot (móvil 412×915 y escritorio 1366×900, `--dump-dom`) · lectura del código fuente (`src/app/servilleta/page.tsx`, `layout.tsx`, `opengraph-image.tsx`, `src/app/layout.tsx`, `src/app/page.tsx`) · historial git de solo lectura · Search Console API de solo lectura (inspección de URL + `searchanalytics.query`, 1 ene–7 oct 2026; carpeta temporal `scripts/.tmp-audit/` ya borrada) · Lighthouse 12.8.2 local (la API de PageSpeed Insights devolvió **429, cuota diaria agotada** del proyecto anónimo) · documentación de Google Search Central.
>
> Nota de proceso: el navegador Playwright MCP es compartido con otros agentes (a mitad de una evaluación la pestaña saltó a ganoexcel.com.co/material-de-apoyo, navegación que no hice yo), por eso el render se hizo con un Chrome headless propio. Quedaron dos registros de consola de Playwright en `.playwright-mcp/` (carpeta ya existente y sin rastrear); no los borré porque el segundo lo comparte otra sesión.

## 1. ¿Qué texto ve Googlebot y cuánto es indexable? ¿Aparece «plan servilleta»?

### Takeaway
La página es un prerender estático (Vercel `PRERENDER`) cuyo HTML ya contiene las cuatro diapositivas, pero el texto visible total es de apenas **~256–268 palabras**, y **la frase «plan servilleta» aparece 0 veces en el cuerpo** (ni siquiera la palabra «servilleta»). Tampoco aparecen «binario», «Gen5», «compensación» ni «calculadora». La relevancia para la consulta descansa casi entera en el `<title>`, la URL `/servilleta` y un único enlace interno.

### Cited Findings
- Respuesta del servidor a Googlebot: `HTTP/2 200`, `x-vercel-cache: PRERENDER`, `x-matched-path: /servilleta`, 109.715 bytes, `cache-control: public, s-maxage=86400, stale-while-revalidate=604800`, `<html lang="es">` — [URL viva, curl 8 oct 2026](https://creatuactivo.com/servilleta)
- Texto visible del HTML del servidor (sin `<script>`/`<style>`): **256 palabras**. Render con JS en Chrome headless como Googlebot: **261 palabras (móvil)** y **268 (escritorio)**; la diferencia es el texto del banner de cookies («Política de Privacidad — Usamos cookies…») y el enlace «Cómo lo hacemos →» solo en escritorio — [URL viva](https://creatuactivo.com/servilleta)
- Conteo de términos en el texto visible (igual en HTML del servidor y renderizado): «plan servilleta» **0** · «servilleta» **0** · «gano excel» **1** (un `<h3>`) · «binario» 0 · «gen5» 0 · «compensación» 0 · «plan de compensación» 0 · «calculadora» 0 · «simulador» 1 — [URL viva](https://creatuactivo.com/servilleta)
- Texto completo que Google indexa (en orden): rótulos de navegación «01 EL PROBLEMA · 02 LAS TRES COSAS · 03 EL PRODUCTO · 04 LOS NÚMEROS», «TRABAJAR, PAGAR CUENTAS Y REPETIR», «Usted trabaja el mes entero. Al día siguiente, ese dinero ya tiene dueño.», «La plata llega / Ya tiene dueño / Y vuelve a empezar», «LO DIFÍCIL YA ESTÁ HECHO», «Tres cosas hacen falta para distribuir en serio. Las tres ya están resueltas.», «Fabrica y despacha Gano Excel», «Conversa y atiende Queswa, su inteligencia artificial», «Compartir · Método comprobado · Dos pasos sencillos», «UN HÁBITO QUE NO CAMBIA … Ganoderma Lucidum … más de 2.000 estudios publicados …», «SIMULADOR DE INGRESOS RECURRENTES · INGRESO RECURRENTE · INGRESO POR PAQUETES · $ 238 USD ≈ $ 1,071,000 COP · VOLUMEN DE COMPRAS EN SU CANAL: 50», «UN VIERNES QUE NO LE DEBE NADA A NADIE», «ACTIVAR SU NEGOCIO →» — [URL viva](https://creatuactivo.com/servilleta)
- Las cuatro diapositivas (`section#slide-1` … `#slide-4`) **sí están en el HTML inicial**; solo la activa lleva la clase `active`, las demás se ocultan por CSS — [HTML renderizado de la URL viva](https://creatuactivo.com/servilleta); [page.tsx](/Users/luiscabrejo/Cta/marketing/src/app/servilleta/page.tsx) (líneas ~2336–2860)
- Lo que **no** está en el DOM hasta que alguien hace clic: el panel de la pestaña «INGRESO POR PAQUETES» (GEN5) del simulador (`{simMode === 'gen5' && (…)}`, línea 2767; por defecto `simMode = 'binario'`, línea 152), el **video del Plan** (modal `videoModalOpen`, línea 2907) y el modal del catálogo — [page.tsx](/Users/luiscabrejo/Cta/marketing/src/app/servilleta/page.tsx)
- Google sobre contenido que exige interacción: «Don't lazy-load primary content upon user interaction. Google won't load content that requires user interactions (for example, swiping, clicking, or typing) to load.» — [Google, mobile-first indexing](https://developers.google.com/search/docs/crawling-indexing/mobile/mobile-sites-mobile-first-indexing)
- Google sobre contenido en pestañas/acordeones: «You can have a different design on mobile to maximize user experience (for example, moving content into accordions or tabs); just make sure that the content is equivalent to the desktop site.» — [Google, mobile-first indexing](https://developers.google.com/search/docs/crawling-indexing/mobile/mobile-sites-mobile-first-indexing)
- Buena parte del mensaje de las diapositivas 1 y 2 vive en seis b-rolls de video (`/videos/servilleta/*.mp4`) con rótulos quemados en la imagen (un commit del 24 jun 2026 habla de «el rótulo quemado superior» del b-roll) — [page.tsx](/Users/luiscabrejo/Cta/marketing/src/app/servilleta/page.tsx), historial git (`2fa8661`)
- La palabra clave solo existe en: `<title>`, `meta description`, `og:title/og:description`, `twitter:title`, y `meta keywords` — [layout.tsx](/Users/luiscabrejo/Cta/marketing/src/app/servilleta/layout.tsx). Google no usa `meta keywords` para posicionar — [Google Search Central Blog, 2009](https://developers.google.com/search/blog/2009/09/google-does-not-use-keywords-meta-tag)
- Historia: ninguna versión revisada del deck (abr, jun, jul, ago 2026) tuvo «plan servilleta» como texto visible; incluso cuando posicionaba en 4,0 (abril) — historial git de [page.tsx](/Users/luiscabrejo/Cta/marketing/src/app/servilleta/page.tsx) (commits `60bd0c6`, `1b910ac`, `f207258`, `322b743`)

### Inferences
- Para Google, el documento trata de «trabajar, pagar cuentas y repetir», «Gano Excel/Queswa» y «Ganoderma»; el tema «plan servilleta / plan de compensación de Gano Excel» solo lo declara el título. Con ~260 palabras y cero menciones del término en el cuerpo, la página compite en relevancia principalmente por título + URL + ancla, lo que es coherente con quedarse en 6–7 frente a páginas que (presumiblemente) explican el plan en texto.
- El contenido oculto por CSS en diapositivas (no por interacción) probablemente se indexa, según la guía de pestañas/acordeones; el problema no es la ocultación sino la **escasez y el tema del texto**.
- Lo que más se parecería a «plan servilleta gano excel» (el GEN5/«ingreso por paquetes» y el video del Plan) es justo lo que Google **no** carga.
- El texto quemado en video es invisible para el índice de texto.

### Gaps
- No pude ver qué texto toma Google como «contenido principal» (no hay API para la captura renderizada de la Inspección de URL; solo el panel la muestra).
- No verifiqué el contenido de las páginas competidoras en el top 3 (la búsqueda web disponible es solo de EE. UU. y devolvió resultados irrelevantes).

## 2. Encabezados: ¿hay exactamente un H1? ¿Qué dicen H2/H3?

### Takeaway
**No hay ningún `<h1>`** (ni en el HTML del servidor ni tras renderizar, ni en móvil ni en escritorio). Hay 3 `<h2>` y 8 `<h3>`, ninguno con «plan servilleta», «Gano Excel plan» o «compensación». La página **perdió su H1 el 16 jun 2026**, y la posición media mensual empeoró a partir de julio.

### Cited Findings
- Encabezados en HTML del servidor y renderizado (idénticos): H1 = 0 · H2 (3) = «TRABAJAR, PAGAR CUENTAS Y REPETIR», «LO DIFÍCIL YA ESTÁ HECHO», «UN HÁBITO QUE NO CAMBIA» · H3 (8) = «La plata llega», «Ya tiene dueño», «Y vuelve a empezar», «Gano Excel», «Queswa, su inteligencia artificial», «Dos pasos sencillos», «Las tres cosas», «SIMULADOR DE INGRESOS RECURRENTES» — [URL viva](https://creatuactivo.com/servilleta)
- El código comenta «H1» en las portadas, pero renderiza `<h2 className="deck-h2">` (p. ej. líneas 2342–2346 y 2382–2386) — [page.tsx](/Users/luiscabrejo/Cta/marketing/src/app/servilleta/page.tsx)
- El H1 se quitó en el commit `451f59c` del **2026-06-16** («feat(servilleta): slide 1 card-scroller de 3 pilares + b-rolls 3D»): `- <h1 className="deck-h1">` → `+ <h2 className="deck-h2">`. Antes decía «CONSTRUCCIÓN DE PATRIMONIO PARALELO» (abr) y «CONSTRUCCIÓN DE ESTRUCTURA PATRIMONIAL» (1 jun) — historial git de [page.tsx](/Users/luiscabrejo/Cta/marketing/src/app/servilleta/page.tsx)
- Posición media mensual de /servilleta en Search Console: mar 4,2 · abr 4,0 · may 5,4 · jun 4,9 · **jul 6,1 · ago 6,9** · sep 5,6 · oct (1–5) 5,2 — [Search Console API, consulta propia 8 oct 2026](https://developers.google.com/webmaster-tools/v1/searchanalytics/query)
- Google usa los encabezados al generar el título del resultado: examina «Heading elements, such as `<h1>` elements» y «Other content that's large and prominent through the use of style treatments» — [Google, title links](https://developers.google.com/search/docs/appearance/title-link)
- Google pide «the same clear and meaningful headings on the mobile site as you do on the desktop site» — [Google, mobile-first indexing](https://developers.google.com/search/docs/crawling-indexing/mobile/mobile-sites-mobile-first-indexing)
- Regla del proyecto: un solo `<h1>` por página — [CLAUDE.md / BRANDING.md](/Users/luiscabrejo/Cta/marketing/CLAUDE.md)

### Inferences
- La caída de jun→ago coincide en el tiempo con la pérdida del H1 y con la reescritura del deck (5→4 diapositivas el 2 ago, léxico nuevo en jul–sep). Es correlación, no causa demostrada: en esos meses cambiaron muchas cosas a la vez y no hay datos de competidores.
- Ni siquiera el H1 antiguo contenía la consulta; un H1 nuevo que diga explícitamente «Plan servilleta…» sería la señal on-page más fuerte disponible sin tocar el diseño del deck (podría vivir como portada/encabezado visualmente discreto).

### Gaps
- No se puede aislar el efecto del H1 frente a otros cambios simultáneos (contenido, competidores, actualizaciones de Google).

## 3. Title y meta description: longitud, truncado, posición de la palabra clave, «oficial»

### Takeaway
El título mide **84 caracteres** (el layout da 70 y la plantilla raíz añade « | CreaTuActivo») y se trunca en el SERP justo antes de «Gano Excel». La descripción mide **188 caracteres**, se corta en «…Simulador del plan de compensaci…», y dice «**oficial**» (también la `og:description`). Título y descripción prometen «Calculadora de Compensación», «binario» y «Gen5», palabras que el cuerpo no contiene.

### Cited Findings
- `<title>` vivo: «Plan Servilleta Digital 2026 | Calculadora de Compensación Gano Excel | CreaTuActivo» (84 caracteres). Cortado a ~60: «Plan Servilleta Digital 2026 | Calculadora de Compensación G…» — [URL viva](https://creatuactivo.com/servilleta); [layout.tsx](/Users/luiscabrejo/Cta/marketing/src/app/servilleta/layout.tsx)
- `meta description` viva (188 caracteres): «Plan Servilleta interactivo oficial para Gano Excel 2026. Calcula tu proyección de ingresos con el sistema binario y Gen5. Simulador del plan de compensación con proyección en tiempo real.» Cortada a ~155: «…Simulador del plan de compensaci» — [URL viva](https://creatuactivo.com/servilleta)
- `og:description`: «Simula tu proyección de ingresos con el Plan Servilleta **oficial** de Gano Excel…»; `twitter:description`: «Calculadora interactiva del plan de compensación Gano Excel» — [URL viva](https://creatuactivo.com/servilleta)
- Google: «there's no limit on how long a `<title>` element can be, the title link is truncated in Google Search results as needed, typically to fit the device width.» y «Avoid keyword stuffing… there's no reason to have the same words or phrases appear multiple times.» — [Google, title links](https://developers.google.com/search/docs/appearance/title-link)
- Google puede reescribir el título: «try to generate an improved title link from anchors, on-page text, or other sources» — [Google, title links](https://developers.google.com/search/docs/appearance/title-link)
- Google sobre la descripción: «Google sometimes uses the meta description HTML element if it might give users a more accurate description of the page than content taken directly from the page.» y «meta descriptions comprised of long strings of keywords… are less likely to be displayed as a snippet.» — [Google, snippets](https://developers.google.com/search/docs/appearance/snippet)
- CTR por consulta (feb–oct 2026): «plan servilleta» 137 impresiones, **0 clics**, pos. 7,4 · «plan servilleta gano excel» 108 imp., 4 clics (3,7 %), pos. 6,4 · «plan servilleta de gano excel» 50 imp., 1 clic (2,0 %), pos. 6,0. Total página: 850 imp., 46 clics, pos. 5,54 (las consultas visibles suman solo ~300 imp.; el resto son consultas anonimizadas) — [Search Console API, consulta propia](https://developers.google.com/webmaster-tools/v1/searchanalytics/query)
- Por dispositivo (filas no anonimizadas): móvil 218 imp., pos. 7,1, CTR 1,4 % · escritorio 77 imp., pos. 6,4, CTR 2,6 %. Por país: Colombia 101 imp. (pos. 6,9), Ecuador 70 (7,7), México 57 (5,7, 0 clics), Guatemala 9 — [Search Console API, consulta propia](https://developers.google.com/webmaster-tools/v1/searchanalytics/query)
- La variante `/servilleta/{constructorId}` sirve título «La Servilleta Digital | CreaTuActivo», `index, follow` y canonical a `/servilleta` — [URL viva de ejemplo](https://creatuactivo.com/servilleta/luis-cabrejo); [\[constructorId\]/page.tsx](/Users/luiscabrejo/Cta/marketing/src/app/servilleta/[constructorId]/page.tsx)

### Inferences
- Quitar «oficial» (obligatorio por cumplimiento: somos distribuidor independiente) **no debería afectar el ranking**: la descripción no es factor de posicionamiento y Google la usa solo «sometimes». El efecto posible es sobre el CTR del snippet, y puede ser neutro o positivo si el texto nuevo describe con precisión lo que la página es. El riesgo de «oficial» es reputacional/legal, no de SEO.
- La palabra «Gano Excel» queda fuera de la parte visible del título en el SERP; para la consulta que más clics trae («plan servilleta gano excel») el usuario no ve la coincidencia completa en negrita. Un título ≤ 60 caracteres con «Plan servilleta Gano Excel» al principio lo resolvería (el sufijo « | CreaTuActivo» de la plantilla consume 15 caracteres).
- El «2026» en el título envejece el 1 de enero de 2027.
- La promesa «Calculadora de compensación… binario y Gen5» vs. un cuerpo sin esas palabras crea desajuste de intención: quien busca «plan servilleta» probablemente espera ver el plan explicado; el 0 % de CTR sobre 137 impresiones en «plan servilleta» es consistente con un snippet poco convincente o reescrito por Google (no verificable desde la API).

### Gaps
- No se puede ver qué título y descripción **muestra** Google realmente en el SERP (la API no lo expone); habría que mirar el resultado en vivo desde Colombia/Ecuador/México.

## 4. Datos estructurados: qué hay y qué convendría

### Takeaway
La página solo hereda el `@graph` del layout raíz (Organization, SoftwareApplication «Queswa», Person); **no declara nada propio** (ni WebPage, ni BreadcrumbList, ni VideoObject). Search Console no detecta resultados enriquecidos. FAQPage ya no da resultados enriquecidos y VideoObject no serviría con el video tras un clic.

### Cited Findings
- JSON-LD presente (heredado de `src/app/layout.tsx`): `Organization` (`#organization`, logo, sameAs, `founder` → `https://luiscabrejo.com/#luis-cabrejo`, contactPoint con 16 países), `SoftwareApplication` (`https://queswa.app/#app`), `Person` (Luis Cabrejo). No hay nodo `WebSite` ni `WebPage` — [URL viva](https://creatuactivo.com/servilleta)
- Inspección de URL: «Resultados enriquecidos detectados: ninguno» — [Search Console URL Inspection API vía scripts/gsc-inspeccionar.mjs](https://developers.google.com/webmaster-tools/v1/urlInspection.index/inspect)
- FAQ: «the feature is only shown for well-known, authoritative government and health websites», y la documentación indica que el resultado enriquecido de FAQ dejó de mostrarse en Google desde el 7 may 2026 — [Google, FAQPage](https://developers.google.com/search/docs/appearance/structured-data/faqpage)
- Breadcrumb: «This feature is available on desktop in all regions and languages where Google Search is available.» — [Google, breadcrumb](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb)
- Video: para las funciones de video Google pide «create a dedicated watch page for each video», «A watch page's main purpose is to show users a single video», y «Don't rely on user actions (such as swiping, clicking, or typing) to load the video.» — [Google, video SEO](https://developers.google.com/search/docs/appearance/video)
- Google recomienda que móvil y escritorio tengan los mismos datos estructurados, y nombra BreadcrumbList y VideoObject entre los prioritarios — [Google, mobile-first indexing](https://developers.google.com/search/docs/crawling-indexing/mobile/mobile-sites-mobile-first-indexing)

### Inferences
- Apropiado y de bajo riesgo: un `WebPage` propio (name «Plan servilleta…», description, `inLanguage: es`, `isPartOf` un `WebSite`, `about`/`mentions` Gano Excel como `Organization` externa, `publisher` → `#organization`) y un `BreadcrumbList` (Inicio › Plan servilleta). Ninguno mueve el ranking por sí solo; ayudan a la comprensión de entidades y, el breadcrumb, solo en escritorio.
- VideoObject solo tendría sentido si el video del Plan se muestra en la carga (no en un modal) y es el contenido principal; en el diseño actual no calificaría.
- FAQPage ya no produce resultados enriquecidos; un bloque de preguntas frecuentes **en texto visible** sí aportaría texto relevante, aunque sin marcado útil.
- Cuidado de cumplimiento: cualquier `about`/`mentions` de Gano Excel debe describirla como fabricante, nunca sugerir que la página es de Gano Excel.

### Gaps
- No se probó el JSON-LD en la Prueba de resultados enriquecidos (no hay nada propio que probar).

## 5. Enlaces internos y externos

### Takeaway
Desde el 1 oct 2026 la página **recibe un solo enlace interno indexable**: el enlace del pie de la Home con ancla «Plan servilleta» (estilo atenuado). Ninguna otra página indexable enlaza a `/servilleta`. Hacia afuera, la página solo enlaza a `/paquetes` y `/privacidad`. No pude verificar enlaces externos.

### Cited Findings
- Home: `<a style="color:var(--color-text-muted);text-decoration:none" href="/servilleta">Plan servilleta</a>` (pie; `src/app/page.tsx` línea 1045) — [Home viva](https://creatuactivo.com/); [page.tsx de la Home](/Users/luiscabrejo/Cta/marketing/src/app/page.tsx)
- Sin enlaces a `/servilleta` en: `/tecnologia`, `/productos`, `/paquetes`, `/nosotros`, `/presentacion`, `/blog`, `/blog/network-marketing-obsoleto`, `/blog/empleo-vs-activos`, `/blog/legalidad-network-marketing`, `/12-niveles`, `/lexico`. Solo `/prueba` (noindex) tiene uno — curl de cada URL viva, 8 oct 2026, p. ej. [creatuactivo.com/tecnologia](https://creatuactivo.com/tecnologia)
- Salió del menú principal el 1 oct 2026 (array `directLinks` de `StrategicNavigation.tsx`) — [CLAUDE.md, sección Page Structure](/Users/luiscabrejo/Cta/marketing/CLAUDE.md)
- Enlaces salientes de /servilleta en el HTML: `https://creatuactivo.com/paquetes` («ACTIVAR SU NEGOCIO →») y `/privacidad` — [URL viva](https://creatuactivo.com/servilleta)
- Sitemap: incluida, `lastmod 2026-10-01T00:00:00.000Z`, `priority 0.8`; **las 9 URL del sitemap tienen exactamente el mismo `lastmod`** — [sitemap.xml](https://creatuactivo.com/sitemap.xml)
- Semanas recientes (pocas impresiones, poco concluyente): semana del 28 sep pos. 4,4 (36 imp.); semana del 5 oct pos. 8,0 (7 imp.) — [Search Console API, consulta propia](https://developers.google.com/webmaster-tools/v1/searchanalytics/query)
- Google recomienda texto de ancla descriptivo en enlaces rastreables — [Google, link best practices](https://developers.google.com/search/docs/crawling-indexing/links-crawlable)

### Inferences
- El ancla «Plan servilleta» de la Home es exactamente la palabra clave (bien), pero un único enlace en el pie, atenuado, transmite poca importancia relativa; antes del 1 oct la página recibía un enlace desde el menú de **todas** las páginas. El efecto de esa pérdida aún no se ve en los datos (solo una semana).
- Los tres artículos del blog (tema: network marketing, legalidad) son candidatos naturales a enlazar con ancla descriptiva hacia `/servilleta`; también `/presentacion` y `/paquetes`.
- Un `lastmod` idéntico para todas las URL es una señal que Google suele ignorar; no hace daño, tampoco ayuda.

### Gaps
- Enlaces externos entrantes: la API de Search Console no expone el informe de Enlaces y la búsqueda web disponible (solo EE. UU.) no encontró menciones de `creatuactivo.com/servilleta`. Hay que revisar el informe «Enlaces» en el panel de Search Console.

## 6. Medios: videos, imágenes, alt, peso, carga diferida, imagen para Google Imágenes, OG

### Takeaway
No hay ninguna imagen que Google pueda asociar a «plan servilleta»: las tres imágenes del HTML tienen `alt=""`, el póster y el video del Plan solo existen tras un clic, y la imagen OG (de generación propia) dice «INFRAESTRUCTURA DE MULTIPLICACIÓN / QUESWA.SYS», léxico retirado. En Google Imágenes la página casi no aparece (3 impresiones, pos. 39).

### Cited Findings
- `<img>` en el HTML: 6 (3 únicas, duplicadas en vista móvil/escritorio): `/images/servilleta/colapso-fabrica.webp` (19 KB), `colapso-conversacion.webp` (10 KB), `colapso-metodo-v2.webp` (13 KB), todas con `alt=""` y sin `loading`; además las tres van **precargadas** con `<link rel="preload" as="image">` en el `<head>` aunque están fuera de pantalla — [URL viva](https://creatuactivo.com/servilleta); [page.tsx líneas 2595 y 2606](/Users/luiscabrejo/Cta/marketing/src/app/servilleta/page.tsx)
- `<video>` en el HTML: 6 b-rolls `/videos/servilleta/{problema-llega 96 KB, problema-reparte 299 KB, problema-repite 226 KB, respaldo 1,4 MB, queswa 1,2 MB, metodo 747 KB}.mp4`, `muted`, `preload="none"` (el de método `preload="metadata"`), sin `poster` ni texto alternativo — [URL viva](https://creatuactivo.com/servilleta)
- Video del Plan: `https://tydh3stq7cgynabr.public.blob.vercel-storage.com/plan-servilleta/video-plan-servilleta.mp4`, **144.055.767 bytes (~144 MB)**, póster `/videos/plan-servilleta/poster.webp` (37 KB); solo se monta en un modal tras pulsar «▶ Ver video» — [src/lib/reels.ts](/Users/luiscabrejo/Cta/marketing/src/lib/reels.ts) líneas 21–22; HEAD de las URL, 8 oct 2026
- Google Imágenes: «plan servilleta gano excel» 3 impresiones, 0 clics, pos. 39,3; búsqueda de video: sin datos — [Search Console API, consulta propia](https://developers.google.com/webmaster-tools/v1/searchanalytics/query)
- Google: «Google uses alt text along with computer vision algorithms and the contents of the page to understand the subject matter of the image.»; «Google can find images in `src` attribute of `<img>` element… Google doesn't index CSS images.»; «make sure images are placed near relevant text» — [Google, image SEO](https://developers.google.com/search/docs/appearance/google-images)
- Imagen OG viva: `og:image` = `https://creatuactivo.com/servilleta/opengraph-image` (PNG 1200×630, generada por `opengraph-image.tsx`, que **anula** la `favicon-cta.png` 1200×1200 declarada en `layout.tsx`). Texto de la imagen: «QUESWA.SYS // THE INDUSTRIAL DECK V5.1 · INFRAESTRUCTURA DE MULTIPLICACIÓN · ARQUITECTURA DE APALANCAMIENTO · SYSTEM STATUS: ONLINE • CREATUACTIVO.COM»; `og:image:alt` = «Infraestructura de Multiplicación | QUESWA.SYS» — [imagen OG viva](https://creatuactivo.com/servilleta/opengraph-image); [opengraph-image.tsx](/Users/luiscabrejo/Cta/marketing/src/app/servilleta/opengraph-image.tsx)
- **Falta `og:url`**: el `openGraph` del layout de servilleta reemplaza al de la raíz (que sí declara `og:url https://creatuactivo.com`), y no define `url` — [URL viva](https://creatuactivo.com/servilleta); regla del proyecto «cada página declara su propio `openGraph.url`» en [CLAUDE.md](/Users/luiscabrejo/Cta/marketing/CLAUDE.md)
- Caché de medios locales: `cache-control: public, s-maxage=86400, stale-while-revalidate=604800` (sin `max-age` para el navegador); Lighthouse lo marca como «cache lifetime 0» — HEAD de las URL; [Lighthouse 12.8.2](https://github.com/GoogleChrome/lighthouse)

### Inferences
- Para Google Imágenes haría falta al menos una imagen `<img>` en el HTML inicial, con nombre de archivo y `alt` descriptivos (p. ej. un esquema del plan), junto a texto que hable del plan servilleta.
- La imagen OG no afecta el ranking (la página no se comparte en redes, por decisión del Director), pero su léxico («Infraestructura de Multiplicación», «QUESWA.SYS») contradice la migración léxica vigente.
- 144 MB para un video que se reproduce en móvil es un problema de experiencia (consumo de datos) más que de SEO; no afecta las métricas de carga porque solo se pide tras un clic.

### Gaps
- No verifiqué si los b-rolls llevan texto quemado en todos los casos ni su contenido exacto (no se transcribieron).

## 7. Core Web Vitals y rendimiento

### Takeaway
PageSpeed Insights no respondió (cuota agotada). En Lighthouse local, **escritorio va bien (98; LCP 0,9 s)** y **móvil va justo (69; LCP 5,3 s, FCP 4,6 s, en laboratorio)**; el elemento LCP en móvil es **el texto del banner de cookies**. TBT 0 y CLS 0 en ambos. Lighthouse SEO = 100 en ambos.

### Cited Findings
- API de PageSpeed Insights (móvil y escritorio): `429 Quota exceeded for quota metric 'Queries' and limit 'Queries per day'` — [PSI API](https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=https://creatuactivo.com/servilleta&strategy=mobile)
- Lighthouse 12.8.2 local, móvil (simulado): Rendimiento **69** · Accesibilidad 95 · Buenas prácticas 100 · **SEO 100**. FCP **4,6 s** · LCP **5,3 s** · TBT 0 ms · CLS 0 · Speed Index 4,6 s · TTI 5,3 s · respuesta del documento 90 ms · peso 735 KiB · DOM 194 elementos. Elemento LCP: `<p class="leading-tight"> Política de Privacidad — Usamos cookies para mejorar su experiencia.` — [Lighthouse](https://github.com/GoogleChrome/lighthouse)
- Lighthouse local, escritorio: Rendimiento **98** · SEO 100. FCP 0,4 s · LCP **0,9 s** (elemento: `<h2 class="deck-h2"> TRABAJAR, PAGAR CUENTAS Y REPETIR`) · TBT 0 · CLS 0,001 (`nav.top-hud > div.nav-controls`) · peso 1.262 KiB — [Lighthouse](https://github.com/GoogleChrome/lighthouse)
- Hallazgos de Lighthouse (móvil): CSS que bloquea el render (2 hojas, 1,3 KB y 10,3 KB); falta `preconnect` a `fonts.gstatic.com` (~437 ms) y a `cvadzbmdypnbrbnkznpb.supabase.co` (~300 ms); **fuente Material Symbols Sharp de 307 KB** (la petición más pesada de la página); imágenes fuera de pantalla 42 KiB (las tres `colapso-*.webp` precargadas); caché ineficiente 142 KiB; CSS sin usar 15 KiB; JS heredado 11 KiB; `font-display` ~110 ms — [Lighthouse](https://github.com/GoogleChrome/lighthouse)
- Accesibilidad: falla `color-contrast` en los `span.nav-label` de la navegación del deck — [Lighthouse](https://github.com/GoogleChrome/lighthouse)
- Umbral «bueno» de LCP: «2.5 seconds or less» en el percentil 75 — [web.dev, LCP](https://web.dev/articles/lcp)
- Peso de la experiencia de página: «Google Search always seeks to show the most relevant content, even if the page experience is sub-par.» — [Google, page experience](https://developers.google.com/search/docs/appearance/page-experience)

### Inferences
- El LCP móvil de laboratorio lo determina un elemento que no es contenido (el banner de cookies, que aparece tarde porque es de cliente); acortar ese texto o hacer que el H2/H1 de la portada sea el elemento más grande y pintado en el servidor mejoraría la métrica.
- Con la guía de Google, el rendimiento difícilmente explica por sí solo la posición 6–7; es un factor de desempate frente a competidores con relevancia similar.
- La fuente de íconos de 307 KB se descarga aunque el deck ya no debe usar íconos de Material Symbols (regla de CLAUDE.md); vale revisar si /servilleta la necesita.

### Gaps
- Sin datos de campo (CrUX / informe de Core Web Vitals de Search Console): la API de CrUX necesita clave y el informe CWV no está en la API de Search Console. Con ~850 impresiones en 9 meses, es probable que la URL no tenga datos de campo propios.
- El laboratorio corrió desde la conexión local de Bogotá (la misma con incidencias de ruta hacia Vercel documentadas el 7 oct); el modo simulado de Lighthouse atenúa esto, pero las cifras de PSI podrían diferir.

## 8. Usabilidad móvil, canonical, robots, hreflang, sitemap, estado de indexación

### Takeaway
La higiene técnica está bien: indexada, canonical propio aceptado por Google, `index, follow`, robots.txt permite, viewport correcto, `lang="es"`, en el sitemap. Nada técnico bloquea el posicionamiento; el límite está en el contenido y las señales on-page.

### Cited Findings
- Inspección de URL (8 oct 2026): «PASS · Enviada e indexada», último rastreo **2026-10-06T01:55:29Z**, canonical declarado = canonical de Google = `https://creatuactivo.com/servilleta` — [Search Console URL Inspection](https://developers.google.com/webmaster-tools/v1/urlInspection.index/inspect)
- `<link rel="canonical" href="https://creatuactivo.com/servilleta">`, `<meta name="robots" content="index, follow">`, `<meta name="googlebot" content="index, follow">` — [URL viva](https://creatuactivo.com/servilleta)
- robots.txt: `Allow: /`; solo bloquea `/api/`, `/dashboard/`, `/admin/`, `/private/` (y para `*` también `/*.json$` y `/tracking.js`) — [robots.txt](https://creatuactivo.com/robots.txt)
- Viewport: `width=device-width, initial-scale=1, maximum-scale=5, viewport-fit=cover, interactive-widget=resizes-content` — [URL viva](https://creatuactivo.com/servilleta)
- Sin `hreflang` (el sitio es de un solo idioma; el `pt-BR` se retiró el 1 oct 2026) — [URL viva](https://creatuactivo.com/servilleta); [CLAUDE.md](/Users/luiscabrejo/Cta/marketing/CLAUDE.md)
- Variantes `/servilleta/{constructorId}`: 200, `index, follow`, canonical → `/servilleta` (consolidan correctamente) — [ejemplo vivo](https://creatuactivo.com/servilleta/luis-cabrejo)
- Lighthouse SEO 100 en móvil y escritorio (title, description, canonical, rastreabilidad, viewport, etc.) — [Lighthouse](https://github.com/GoogleChrome/lighthouse)

### Inferences
- El canonical de las variantes por socio está bien resuelto; no hay contenido duplicado que diluya.
- `og:locale es_CO` y `contactPoint` multipaís no afectan; la audiencia real es Colombia, Ecuador y México.

### Gaps
- No pude comprobar el informe de usabilidad/HTTPS del panel ni la «captura renderizada» de la Inspección de URL (no están en la API).

## 9. Ranking de debilidades por impacto probable (por qué 6–7 y no top 3)

### Takeaway
Las tres primeras son de **relevancia on-page** y explican mejor la posición que cualquier factor técnico: (1) el cuerpo no menciona «plan servilleta» y tiene ~260 palabras, (2) no hay H1, (3) solo un enlace interno desde el 1 oct. El resto son mejoras de CTR, entidades y rendimiento.

### Cited Findings
1. **Cuerpo sin la consulta y muy delgado** — 0 menciones de «plan servilleta»/«servilleta», 0 de «binario/Gen5/compensación», ~256–268 palabras; lo que más se acerca al tema (pestaña GEN5, video del Plan) solo carga con clic — [URL viva](https://creatuactivo.com/servilleta); Google: «Google won't load content that requires user interactions» — [mobile-first indexing](https://developers.google.com/search/docs/crawling-indexing/mobile/mobile-sites-mobile-first-indexing)
2. **Cero H1** desde el 16 jun 2026; ningún encabezado contiene la consulta; caída de posición media de 4,0–4,9 (abr–jun) a 6,1–6,9 (jul–ago) — [historial git](/Users/luiscabrejo/Cta/marketing/src/app/servilleta/page.tsx); [Search Console API](https://developers.google.com/webmaster-tools/v1/searchanalytics/query); Google usa `<h1>` para el título del resultado — [title links](https://developers.google.com/search/docs/appearance/title-link)
3. **Un único enlace interno** (pie de la Home) desde que salió del menú el 1 oct; ningún artículo del blog ni página de producto enlaza — [Home viva](https://creatuactivo.com/)
4. **Título truncado** (84 caracteres; «Gano Excel» queda fuera de lo visible) y con año «2026» — [title links](https://developers.google.com/search/docs/appearance/title-link)
5. **Descripción** de 188 caracteres con «oficial» (cumplimiento), keyword-heavy y prometiendo «binario y Gen5» que el cuerpo no muestra; CTR 0 % en «plan servilleta» (137 imp.) — [snippets](https://developers.google.com/search/docs/appearance/snippet); [Search Console API](https://developers.google.com/webmaster-tools/v1/searchanalytics/query)
6. **Sin datos estructurados propios** (WebPage/BreadcrumbList) y sin resultados enriquecidos — [URL viva](https://creatuactivo.com/servilleta)
7. **Sin imágenes indexables con alt** ni video descubrible; Google Imágenes pos. 39 — [image SEO](https://developers.google.com/search/docs/appearance/google-images); [video SEO](https://developers.google.com/search/docs/appearance/video)
8. **Rendimiento móvil de laboratorio** (LCP 5,3 s por el banner de cookies; Material Symbols 307 KB; preload de imágenes fuera de pantalla) — [Lighthouse](https://github.com/GoogleChrome/lighthouse); importancia secundaria según [page experience](https://developers.google.com/search/docs/appearance/page-experience)
9. **OG desactualizada y sin `og:url`** (sin efecto en ranking; incoherencia léxica) — [imagen OG](https://creatuactivo.com/servilleta/opengraph-image)

### Inferences
- La palanca más barata y de mayor efecto probable: añadir texto visible e indexable (en el HTML inicial, no tras clic) que explique qué es el plan servilleta y cómo se dibuja el plan de Gano Excel (binario, GEN5, recompra), con un H1 que contenga «Plan servilleta» y la marca, sin romper el deck (por ejemplo, una sección de texto bajo el deck o una portada textual). Debe cuidar el cumplimiento: distribuidor independiente, sin «oficial», sin promesa de ingreso, cifras del plan literales.
- Segunda palanca: enlaces internos con ancla descriptiva desde el blog y `/presentacion`/`/paquetes`.
- Tercera: título ≤ 60 caracteres que empiece por «Plan servilleta Gano Excel», y descripción ≤ 155 sin «oficial».
- Lo técnico (indexación, canonical, robots) no es el cuello de botella.

### Gaps
- Sin análisis de las páginas del top 3 (qué texto, encabezados y enlaces tienen), no se puede cuantificar la brecha de contenido; es el dato que más falta para priorizar con certeza.
- Sin informe de Enlaces (backlinks) ni datos de campo de CWV.
