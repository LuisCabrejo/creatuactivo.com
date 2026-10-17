# El catálogo como tienda B2C — tres investigaciones (17 oct 2026)

> Insumo, no doctrina. Encargadas al rehacer `/productos` (Director: *«es una herramienta de nuestros distribuidores para sus clientes, B2C, pero en este momento parece B2B»*) y al revisar los mensajes que recibe el comprador por WhatsApp. Marcas: **[medido]** estudio con datos · **[experto]** guía de Baymard o NN/g basada en pruebas · **[observado]** práctica o documentación · **[sin fuente]**. Las cifras que circulan sin fuente verificable se dejaron fuera a propósito.

## 0. Lo que había (medido el 17 oct 2026, celular de 390 px)

- El primer producto aparecía a **4.361 px** (cinco pantallas de «ciencia» y «sistemas de bienestar» antes). Página de **26.013 px**; una tarjeta de 400 px por pantalla.
- Carrito con el encabezado tapado por el menú (capa 40 contra 50): no se veía cómo cerrarlo. Precios con coma o punto según el idioma del navegador (`toLocaleString()` sin región).
- Copy de socio frente al comprador («el ancla perfecta para clientes de alto valor que garantiza compra recurrente y construye su activo mes a mes»), y un FAQ visible y en datos estructurados con «hongo medicinal», «fortalece el sistema inmunológico», «reduce el estrés», «35% de descuento», «Solo 150 cupos» y un envío gratis que no existe.
- El teal del catálogo, **#0F2E2F, es el mismo hex de AG1** (polvo verde «de laboratorio»).
- En 60 días, **un solo pedido salió del carrito**, y fue la prueba del Director.

## 1. UX de catálogo móvil

- **Primer producto en la primera pantalla.** NN/g 2018 (120 personas, 130.000 fijaciones): 57 % del tiempo de lectura arriba del pliegue, 74 % en las dos primeras pantallas [medido, escritorio]. Ceguera a lo que parece publicidad [medido]. Baymard: un vistazo debe mostrar al menos el 40 % de los tipos de producto [experto].
- **Navegación visible.** NN/g 2016 (179 personas): en móvil la navegación visible se usó 89 % de las veces y la escondida tras hamburguesa 44 % [medido]. Chips fijos con las cuatro líneas.
- **Tarjeta.** Los mismos atributos en todas, escaneables (Baymard; el 64 % de los sitios falla) [experto]. NN/g: 20 % de los fallos de tarea por información de producto incompleta [medido]. Imagen, nombre, presentación, precio, Agregar. Meta: 4 a 6 productos por pantalla. Uno contra dos columnas: las pruebas A/B publicadas salen mixtas y sin muestra [observado].
- **Agregar desde el listado, que se vuelve −/+** (Baymard 2023, supermercado; aplica a consumibles de recompra) [experto]. Selector −/+ antes que campo o desplegable [experto]. Hoober 2013: 49 % usa el celular con una mano [medido] → el carrito arriba a la derecha queda lejos del pulgar; barra inferior con el total [observado].
- **Ficha.** Nunca pestañas horizontales: se pasan por alto (Baymard) [experto]; secciones abiertas o plegables para lo secundario (NN/g). Envío visible en la ficha: 64 % lo buscó antes de agregar (Baymard 2017) [medido]. Complementos con precio y botón [experto].
- **Carrito y cierre.** Abandono promedio 70,22 % (Baymard, 50 estudios); costos extra 40 %, entrega lenta 20 %, no ver el total 12 % [medido, EE. UU.]. Fecha de entrega mejor que velocidad [experto]. Colombia, CCCE 2T 2025: PSE 63,9 %, tarjeta 33,3 %, efectivo/contraentrega 2,7 % [medido]. Decir «aquí no paga nada». Pantalla después del botón: «falta un paso, toque Enviar» (caso Felipe) [observado].
- **El vendedor se ve.** Nielsen 2015: 83 % confía en recomendaciones de conocidos [medido]. Ert, Fleischer y Magen 2016 (Airbnb): la foto del anfitrión pesó en la elección [medido, por analogía].
- **Velocidad.** Deloitte/Google 2019 (37 marcas): 0,1 s menos ↔ +8,4 % de conversión en retail [medido, correlacional]. Vodafone 2021: LCP 31 % mejor → 8 % más ventas [medido, A/B].
- **Venta directa con tienda personal** (Natura, Avon, Ésika, Yanbal, Herbalife): la tienda lleva el nombre de la persona y la marca respalda pago y entrega [observado].

## 2. Cerrar la compra por WhatsApp

- Meta/Kantar 2025 (11.056 adultos, 22 mercados): 73,3 % prefiere escribirle a la empresa; **79,3 % exige una prueba de legitimidad antes de interactuar** [medido, promedio global].
- Treble.ai Colombia 2024 (150 personas): molesta el chatbot que no resuelve (54 %), la demora (49 %) y **tener que hablar con varios números o personas (~21 %)** [medido, muestra pequeña]. Twilio 2024: 51 % espera respuesta en una hora; 46 % dejó una marca por lentitud [medido].
- **Mensaje pre-escrito.** wa.me solo llena la caja: la persona lo lee, lo puede editar y tiene que tocar Enviar. No hay parámetro oculto; la práctica es un código corto al final [observado]. «vengo del enlace de luis-cabrejo-1288» es algo que nadie diría, justo cuando busca señales de legitimidad [inferencia].
- **Confirmación** (Baymard): primero confirmar con resumen, número de pedido y fecha esperada; lo extra después [experto]. Narvar 2025 (3.461 personas): 66 % siente ansiedad tras pedir; una fecha estimada la calma [medido]. Es el mensaje más leído (Omnisend 2026: 54 % de apertura) [medido] → no debe competir consigo mismo: una sola cosa extra, de un toque.
- **Traspaso a otro número.** La API permite un mensaje `contacts` (botones «Mensaje» y «Guardar contacto») y un botón `cta_url` [observado, Meta]. WhatsApp está desplegando una advertencia antes de escribirle a un número no guardado [observado, jun 2026]. La Policía y la DIJIN describen como fraude típico el número desconocido que pide pagar por WhatsApp [observado]. **Riesgo:** Queswa promete «se comunica por este mismo medio» y luego escribe un número personal pidiendo $341.700: es la silueta del fraude.
- **Pagos en Colombia.** Bre-B, primer año (Banco de la República, 5 oct 2026): 36,1 M de clientes, ticket promedio $146.966 [medido]. Nequi 22 M de clientes (2024) [medido]. Efectivo 77,8 % de pagos habituales (BanRep 2024) [medido, fuente secundaria]. No hay encuesta del medio de pago en compras por WhatsApp [sin fuente].

## 3. Marca y color

Hex leídos del CSS de cada sitio el 17 oct 2026.

| Marca | Fondo | Texto · acento | Botón |
|---|---|---|---|
| Four Sigmatic | crema #F8F4EC | café #59432D · naranja #FF8100 | píldora |
| Ryze | crema #F9F1E9 | café #533A2D · terracota #CA5839 | 8 px |
| Om | crema #FDF3E4 | café #4A2D1A · #F0512C | 0/16 px |
| Nespresso CO | blanco; fondo de producto #F3EEE6 | #17171A · #876C43 | píldora |
| Aesop | crema #FFFEF2 + bandas #252525 | #333 · #945C26 | recto |
| MUD\WTR | oscuro #151515 | blanco · lima | píldora |
| AG1 | blanco | **teal #0F2E2F** · lima | píldora |

- **11 de 14 comparables venden sobre fondo claro**; las de bebida caliente repiten crema + texto café + un solo botón cálido + serif editorial. El verde-teal con mono es el estilo de los polvos verdes «científicos» [observado].
- Bottomley & Doyle 2006: un color se juzga apropiado cuando coincide con el tipo de producto (sensorial o funcional) [medido]. Schuldt 2013: el verde comunica «sano» [medido]. de Craen 1996: azul y verde se asocian a calma, cálidos a estímulo [medido]. Spence 2015: el color fija lo que se espera saborear [medido]. «El dorado es lujo»: sin experimento controlado [sin evidencia].
- **Claro vs. oscuro:** el texto oscuro sobre claro gana en lectura, más en letra pequeña (NN/g) [medido]. Más espacio alrededor del producto sube el prestigio percibido (Sevilla & Townsend 2016) [medido]: el lujo lo da el aire más que el negro. Caja oscura sobre fondo oscuro no contrasta [observado].
- **Marca madre oscura, tienda clara:** Apple (marketing en #000, tienda en #F5F5F7), Starbucks Reserve, Aesop, Nespresso [observado]. Se conservan logo, Playfair, dorado y carbón como marco; cambia la superficie de exhibición.
- **Redondeado:** preferencia por contornos curvos (Bar & Neta 2006; meta-análisis de 61 estudios, g = 0,39) [medido]; 11 de 14 comparables redondean los botones [observado]. No hay estudio de radio de botón contra conversión [sin fuente].
- **Copy sin salud:** sabor, textura, momento del día y preparación con su medida (Nespresso: «café armoniosamente equilibrado y de cuerpo espeso») [observado]. Las promesas de efecto de las marcas de EE. UU. no se trasladan a Colombia.

**Dirección elegida (A):** crema cálida dentro de un marco carbón. Página #F7F2EA, fondo de producto #EFE6D8, texto #2B211A (14,1:1), secundario #6B5A4C (5,9:1); dorado #C5A059 solo de relleno con texto oscuro (6,4:1) y #7A5C24 cuando va como texto (5,6:1); botón en píldora #2B211A; Playfair en títulos y nombres, Inter en cuerpo y precio. Sin verde.

## Fuentes principales

Baymard: avoid-horizontal-tabs · product-listing-page-plp-ux · grocery-add-to-cart-buttons · show-shipping-costs-on-product-pages · cart-abandonment-rate · order-confirmation-page · shipping-speed-vs-delivery-date. NN/g: scrolling-and-attention · find-navigation-mobile-even-hamburger · product-descriptions · dark-mode · dimensions-of-ai-chatbots. web.dev: milliseconds-make-millions · vodafone. whatsappbusiness.com: state-of-business-messaging. Treble.ai, Estudio WhatsApp Colombia 2024. Twilio 2024. Narvar 2025. Omnisend 2026. developers.facebook.com: contacts-messages · interactive-cta-url-messages. Banco de la República / Vanguardia (Bre-B, oct 2026). CCCE 2T 2025. Bottomley & Doyle 2006 · Schuldt 2013 · de Craen 1996 · Spence 2015 · Sevilla & Townsend 2016 · Bar & Neta 2006/2007 · Chuquichambi 2022. Sitios: foursigmatic.com · ryzesuperfoods.com · ommushrooms.com · nespresso.com/co · aesop.com · mudwtr.com · drinkag1.com · apple.com.
