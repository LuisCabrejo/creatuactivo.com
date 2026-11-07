# Bloque C · La paradoja: por qué Meta deja correr anuncios de Ganoderma con declaraciones de salud
### Investigación del 6 de noviembre de 2026 · preguntas 11 a 15 del brief

Convención: **VERIFICADO** = leído en la fuente primaria (o medido por nosotros en la Biblioteca de anuncios), con URL y fecha. **NO VERIFICADO** = prensa, blog o agencia, o inferencia nuestra que no se puede confirmar desde afuera. Todas las lecturas son del 6 nov 2026 salvo que se diga otra cosa.

---

## 0. Resumen ejecutivo (lo que decide)

1. **La Biblioteca de anuncios se pudo consultar sin iniciar sesión** (navegador sin sesión, Colombia, anuncios activos). En Colombia hay hoy ~48 resultados para «ganocafe», ~170 para «cafe ganoderma», ~380 para «ganoderma» y ~460 para «reishi». Son **decenas de anunciantes, no miles de anuncios**: en la muestra cargada, 17 Páginas pautan productos de Gano Excel. VERIFICADO (medición propia).
2. **En el texto escrito, casi nadie promete curas.** De 25 creativos de productos Gano Excel activos en Colombia, 5 no hacen ninguna declaración, 11 se quedan en bienestar genérico («defensas», «energía», «antioxidantes»), 8 nombran una enfermedad y 1 promete combatir enfermedades graves. **En 6 de esos 9, la afirmación grave no está en el texto: está en la voz del video o en la imagen.** VERIFICADO (transcripción propia con Whisper y lectura de las imágenes).
3. **El caso extremo lleva 10,5 meses al aire.** Un video de la Página «Ganoderma CON AMOR», en circulación desde el 22 dic 2025 y con 4 versiones, dice en la voz: *«te ayuda a combatir enfermedades como la diabetes, hipertensión, artritis, colesterol, obesidad, cáncer, migraña»*. El texto escrito solo habla de digestión. VERIFICADO.
4. **Meta sí «oye» esa voz.** El buscador de la Biblioteca encuentra ese anuncio con las palabras «diabetes», «cáncer», «obesidad» y «migraña», que solo están en el audio. Con «gastritis» y «gripas» pasa lo mismo con otros anuncios. Es decir: **Meta transcribe el audio y el texto de las imágenes, y aun así esos anuncios siguen activos.** El índice de búsqueda no es necesariamente el mismo sistema que hace cumplir las normas; esa parte es inferencia nuestra. VERIFICADO el hecho, NO VERIFICADO el mecanismo.
5. **Parte de la paradoja no es descuido: la norma de Meta es más estrecha que la colombiana.** La política de Salud y bienestar de Meta (actualizada el 22 jul 2026) prohíbe afirmar la *curación, sanación o eliminación* de una **lista cerrada** de enfermedades: diabetes, herpes, tiroides, psoriasis, ébola, cáncer, autismo, Alzheimer, Parkinson, ELA y VIH. Además aclara que la prohibición *«no se aplica a las afirmaciones sobre el tratamiento de los síntomas»*. Artritis, gastritis, migraña, colesterol, ansiedad o defensas no están en esa lista. El Decreto 3249 de 2006 (art. 25.8), en cambio, prohíbe decir que un suplemento sirve para *«prevenir, aliviar, tratar o curar una enfermedad, trastorno o estado fisiológico»*. **Mucho de lo que circula viola la ley colombiana sin violar el texto específico de Meta.** VERIFICADO.
6. **Meta aplica con umbrales altos y lo sabe.** Según Reuters (noviembre de 2025, a partir de documentos internos de 2021 a 2025), Meta proyectó que ~10 % de sus ingresos de 2024 (~US$16.000 millones) vendrían de anuncios de estafas y bienes prohibidos, incluidos *«productos médicos prohibidos»*. Solo veta a un anunciante si sus sistemas tienen al menos **95 % de certeza** de fraude; a los sospechosos les cobra más caro («penalty bids»); un anunciante pequeño necesitaba al menos **8 alertas** por fraude financiero antes del bloqueo, y algunas «High Value Accounts» acumularon **más de 500**. La serie ganó el Pulitzer de reportería especializada el 4 may 2026. NO VERIFICADO (prensa; no pudimos abrir reuters.com y lo leímos en la versión sindicada).
7. **La norma colombiana casi no se aplica contra distribuidores individuales.** No encontramos ni una sanción del INVIMA ni de la SIC en los últimos cinco años contra un distribuidor individual por publicidad en redes de un suplemento con registro. El único antecedente con Ganocafé (proceso 201500495) duró **seis años** y se archivó *«en contra de: INDETERMINADO»* porque no se pudo identificar ni notificar al responsable. El propio grupo de reacción del INVIMA escribió que los perfiles de redes *«dificulta[n] la identificación»*. Según la evaluación ex post del Minsalud y el INVIMA (2021), **el 91,5 % de las piezas de suplementos monitoreadas en redes sociales no tenía autorización previa**. VERIFICADO.
8. **La conclusión equilibrada:** el riesgo de *sanción estatal* por prometer curas es bajo en probabilidad, pero alto en consecuencia para quien es **identificable**. El riesgo de *perder la cuenta publicitaria* es real y no tiene un umbral público. La impunidad aparente del mercado viene de dos cosas que Luis no tiene ni quiere: **anonimato** (Páginas con nombres de tienda, sin persona detrás) y **rotación** (Meta demandó en 2026 a quienes «alquilan cuentas de confianza» y venden «desbaneos»). Luis pauta con su nombre, su Página, su número verificado de WhatsApp y su reputación de Diamante: es el anunciante **más fácil de identificar del mercado**, así que la estadística del mercado no le aplica.
9. **Lo limpio también funciona en esta categoría:** una Página que vende café con Ganoderma por sabor, regalo y precio («Gano Power», sin declaraciones de salud, a Messenger) lleva corriendo desde el 8 may 2026, seis meses. La supervivencia **no depende** de la afirmación médica. VERIFICADO (la fecha de inicio; no vemos su gasto ni sus resultados).
10. **Para los distribuidores, lo que se duplica:** sabor, ritual, precio honesto, fabricante con 30 años y registro verificable, y la cara del distribuidor; destino WhatsApp; y **cero salud en la voz y en la imagen**, que es exactamente donde el mercado esconde lo que no se atreve a escribir. Ver §7.

---

## 1. Método y límites

- **Herramienta:** el servidor de Playwright de la sesión estaba ocupado por otro agente, así que usamos la misma librería con el Chrome local en modo sin interfaz, **sin iniciar sesión**. Ruta de partida: `facebook.com/ads/library/?active_status=active&ad_type=all&country=CO&q=…&search_type=keyword_unordered`.
- **Búsquedas (Colombia):** ganocafe · gano excel · gano cafe · ganoderma · cafe ganoderma · reishi · hongo reishi. Para probar el índice: ganoderma + diabetes / cáncer / artritis / cura / presión / gastritis / migraña / obesidad / colesterol / gripas, y reishi + diabetes. **México y Perú:** ganocafe · gano excel · cafe ganoderma. **No hicimos Estados Unidos** por falta de tiempo.
- **Carga:** desplazamos la página entre 4 y 10 veces por búsqueda. Leímos 368 anuncios únicos de Colombia (109 Páginas) y 149 de México y Perú. Los conteos de la Biblioteca son aproximados (el «~» es de Meta), y la búsqueda «gano excel» trae ruido (plantillas de Excel, contabilidad).
- **Voz:** descargamos 19 videos de anuncios activos y los transcribimos con faster-whisper (modelo small, español). Whisper se equivoca en algunas palabras (oye «pertención» por *hipertensión*, «gano verma» por *Ganoderma*), pero ninguno de esos errores cambia una afirmación.
- **Imagen:** capturamos las tarjetas de 130 anuncios y bajamos en resolución completa las imágenes de los dos anuncios con afirmaciones escritas en la imagen.
- **Límite que importa:** **la Biblioteca solo muestra lo que está activo.** Con el estado «Todos», «ganocafe» en Colombia da ~49 resultados contra ~48 activos: los anuncios comerciales que se apagaron o que Meta rechazó **desaparecen** (fuera de la UE solo se conservan los políticos). No se puede medir cuántos anuncios con curas tumbó Meta; solo se ve a los sobrevivientes. VERIFICADO (medición propia); la regla de conservación, NO VERIFICADO (fuentes secundarias que citan a Meta).
- **Privacidad:** solo nombramos Páginas comerciales. Las Páginas con nombre de persona y los nombres que aparecen en testimonios y en expedientes se omiten.

---

## 2. Pregunta 11 · Censo en la Biblioteca de anuncios

### 2.1 Conteos que muestra la Biblioteca (activos, 6 nov 2026)

| País | Búsqueda | Resultados (Meta) | Nota |
|---|---|---|---|
| CO | ganocafe | ~48 | agrupados en 19 tarjetas (variantes del mismo contenido) |
| CO | gano excel | ~44 | solo ~6 son de Gano Excel; el resto es ruido («Excel») |
| CO | cafe ganoderma | ~170 | incluye marcas de café con hongos que no son Gano |
| CO | ganoderma | ~380 | colágeno con Ganoderma, gomitas, mezclas de hongos |
| CO | hongo reishi | ~51 | |
| CO | reishi | ~460 | sobre todo suplementos importados de hongos |
| CO | ganoderma diabetes / cancer / artritis | ~13 / ~15 / ~15 | coinciden aunque el texto no tenga esas palabras (ver §3.3) |
| MX | ganocafe · gano excel · cafe ganoderma | ~2 · ~35 · ~67 | **ningún anuncio de Gano Excel**; domina DXN |
| PE | ganocafe · gano excel · cafe ganoderma | ~1 · ~28 · ~130 | **ningún anuncio de Gano Excel**; dominan capuchinos locales con Ganoderma |

**Anunciantes:** en Colombia, 45 Páginas distintas en la muestra cargada mencionan Ganoderma, Gano o Reishi, y **17 pautan productos de Gano Excel**. Ninguna es la Página oficial de Gano Excel Colombia. Hay tiendas con nombre de marca propia, una tienda Shopify y una Página con nombre de persona. Un mismo creativo con afirmaciones de enfermedad en la imagen aparece en dos Páginas distintas («Café 360» y «Ganolife», archivo idéntico por MD5), lo que sugiere un mismo operador o un banco de piezas que circula entre distribuidores. NO VERIFICADO (inferencia).

### 2.2 Muestra clasificada (40 anuncios)

Clase = la afirmación **más grave** en cualquier capa: **0** ninguna · **1** bienestar genérico · **2** enfermedad nombrada · **3** cura o tratamiento de enfermedad. Dónde: **T** texto · **I** imagen · **V** voz. Destino: WA = WhatsApp, MSG = Messenger. «Días» = días en circulación al 6 nov 2026.

**A. Productos de Gano Excel, Colombia (25 creativos, 17 Páginas)**

| # | Id. Biblioteca | Página | Inicio | Días | Clase | Dónde y qué | Destino | Tipo de anunciante |
|---|---|---|---|---|---|---|---|---|
| 1 | 1064913665736392 (+3 versiones) | Ganoderma CON AMOR | 22 dic 2025 | 319 | **3** | T: estreñimiento e inflamación «terminaron gracias a» el café · **V: «combatir enfermedades como la diabetes, hipertensión, artritis, colesterol, obesidad, cáncer, migraña… depresión»** | WA | Tienda de marca propia |
| 2 | 1556054075540486 (6 versiones) | Ganoderma CON AMOR | 22 dic 2025 | 319 | 2 | T: «¿El médico te prohibió el tinto?… sin la acidez» · V: «café saludable» | WA | ídem |
| 3 | 1555319958947377 | Ganoderma CON AMOR | 28 dic 2025 | 313 | 1 | T: «Mejora la circulación», estrés | WA | ídem |
| 4 | 1904976216891803 | Ganoderma CON AMOR | 29 dic 2025 | 312 | 2 | T: «virus… fortalece tus defensas… blindan tu cuerpo… prevenir» | WA | ídem |
| 5 | 1624683078907763 / 2330699034044178 | Ganoderma CON AMOR | 21 dic 2025 | 320 | 2 | T: ritual, «ese plus que te hace bien» · **V: «hongo medicinal… ideal para prevenir las gripas frecuentes»** | WA | ídem |
| 6 | 2217343145340333 | Ganoderma CON AMOR | 21 dic 2025 | 320 | 2 | T: ritual · **V (testimonio): «desinflamar el colon… gastritis… problemas digestivos»** | WA | ídem |
| 7 | 2679383459122788 | Ganoderma CON AMOR | 15 ago 2026 | 83 | 2 | T: «aumenta las defensas» · **V: «limpia… el hígado, reduce migrañas… estreñimiento, depresión, ayuda a prevenir problemas cardíacos»** | WA | ídem |
| 8 | 1909421333766735 | Aroma Orgánico - Café saludable | 22 oct 2026 | 15 | 2 | T: «fortalecer tu sistema inmune… evita la acidez, la ansiedad» | WA | Tienda |
| 9 | 1407154187466434 | Café 360 | 27 sep 2026 | 40 | 2 | T: sabor y promoción · **I: «controla irritación del colon, disminuye el colesterol LDL, efectivo contra la migraña, regula el metabolismo, diurético»** | Botón «Comprar» | Tienda |
| 10 | 2297957660987893 | Ganolife | 27 oct 2026 | 10 | 2 | T: sabor · **I: la misma imagen que el #9** | Botón «Comprar» | Tienda |
| 11 | 1748868200582678 | Café 360 | 9 oct 2026 | 28 | 0* | T: regalo (termo y mugs) · I: lista de beneficios ilegible a esta resolución | Botón «Comprar» | Tienda |
| 12 | 947022911396171 | Experiencia Parceros | 7 oct 2026 | 30 | 1 | T: «+150 antioxidantes… aumenta tus defensas» | Pedido por mensaje | Tienda |
| 13 | 2877321022652687 | Esencia Viva Vital | 28 sep 2026 | 39 | 1 | T: «energía sin nerviosismo… tu cuerpo lo agradece» | WA | Tienda |
| 14 | 1080831224766598 | Ganoessence | 19 oct 2026 | 18 | 1 | T: «+200 nutrientes, 154 antioxidantes» · V: «fortalecen tu sistema inmune» | WA | Tienda |
| 15 | 1474384428089233 | Ganoessence | 19 oct 2026 | 18 | 1 | V: «súper alimento… fortalecer tu sistema inmune… sin químicos» | WA | Tienda |
| 16 | 819903044441150 | Balance Natural | 24 jul 2026 | 105 | 1 | T: «medicina tradicional asiática… compuestos bioactivos» | Botón «Comprar» | Tienda |
| 17 | 1404197731037331 | Balance Natural | 15 sep 2026 | 52 | 0 | T: café premium, sin azúcar, envío gratis | WA | Tienda |
| 18 | 2156752058383319 | Productos ganoderma salud y bienestar | 24 oct 2026 | 13 | 1 | T: «cafés, chocolates y productos de bienestar» | Web (Shopify) | Tienda en línea |
| 19 | 1429199006084439 | Imperio residual | 29 oct 2026 | 8 | 0 | T: aroma, cremoso, tradición asiática | WA | Tienda |
| 20 | 1132898133000954 | Neuroderma | 6 nov 2026 | 0 | 1 | T: «hongo reconocido por sus cualidades saludables» | WA | Tienda |
| 21 | 26655056247482824 | Gano Power | 8 may 2026 | **182** | 0–1 | T: compre 3 cajas y reciba una taza calentadora; «energía natural para tu rutina» | MSG | Tienda |
| 22 | 1083521904739616 | Bienestar Ganoitouch | 5 nov 2026 | 1 | 1 | T: Ganocereal, «fuente de fibra que contribuye…» | MSG | Tienda |
| 23 | 998389909424894 | Vitrina Digital 360 | 5 nov 2026 | 1 | 1 | T: el mismo texto del #22 | WA | Tienda |
| 24 | 1532594381517017 | grupo salud y nutrición | 27 ago 2026 | 71 | 1 | T: «es hora de cuidar tu cuerpo» | WA | Tienda |
| 25 | 1793661905266757 | (Página con nombre de persona) | 3 nov 2026 | 3 | 0 | T: lista de productos y precio | «Contactarnos» | Perfil de persona |

\* El #11 queda en 0 por el texto; su imagen trae una lista de beneficios que no se alcanza a leer.

**Fuera de catálogo, en la misma búsqueda (campaña A, no B):** «Sueña, Ríe, Emprende» (1830418718201989) y «Vitrina Digital 360» (1614768843463917), ambos desde el 5 nov 2026, con el mismo texto: *«Estamos ampliando nuestra red de distribuidores de productos GanoExcel… ¡Genera Ingresos Ilimitados!»*. Es una promesa de ingreso explícita, y lleva un día al aire.

**B. Otros productos con Ganoderma, Colombia (9)**

| # | Id. | Página | Inicio | Días | Clase | Dónde y qué | Destino |
|---|---|---|---|---|---|---|---|
| 26 | 1726156671962493 | Tiendas Maka Colombia | 3 ago 2026 | 95 | **3** | T: «dile adiós al malestar» · **V: «combatir la artritis, la artrosis… alivio y prevención… cuenta con el respaldo del INVIMA»** | WA |
| 27 | 1567166215002147 | Tiendas Maka Colombia | 14 jul 2026 | 115 | 2 | T: «muévete sin dolor» · V: testimonio de una abuela que «ahora sí puede caminar» | WA |
| 28 | 1134452962315126 | Factores 2x2 Plus | 1 nov 2026 | 5 | 2 | T: «¿Artritis o artrosis?» | Web |
| 29 | 1912183723496962 | Factores de Transferencia 2x2 Plus | 1 nov 2026 | 5 | 2 | T: quimioterapia, «no reemplaza ningún tratamiento médico. Lo acompaña» | Web |
| 30 | 826903900291744 | el_despertar_55 | 12 jun 2026 | 147 | 2 | T: «menos estrés y ansiedad… tratamiento de 38 días» (combo con un producto psicodélico) | WA |
| 31 | 1103708648912235 | Linaje Vital Cerón | 12 oct 2026 | 25 | 2 | V: testimonio de 8 años de dolor de talón; «bienestar físico… también económico» | WA |
| 32 | 897932770054350 | Planeta fungi Colombia | 4 ago 2026 | 94 | 3 | V: «me reparan desde adentro… rendir, sanar… la medicina ideal para ti» | WA |
| 33 | 2011619712885141 | Fuly Kids | 21 oct 2026 | 16 | 1–2 | T y V: gripas en niños del jardín; «garantizar el funcionamiento normal del sistema inmune» | Web |
| 34 | 1168873736083147 | Fuly Kids | 3 nov 2026 | 3 | 1 | T: *«ingredientes que ayudan al funcionamiento normal del sistema inmune.\*»* (con asterisco y aclaración) | «Contactarnos» |

**C. México y Perú (muestra de 6)**

| # | País | Id. | Página | Inicio | Clase | Qué | Destino |
|---|---|---|---|---|---|---|---|
| 35 | MX | 1780671953176636 | (distribuidor de DXN, nombre de persona) | 23 oct 2026 | 2 | T: «ayuda a mejorar el estreñimiento y la inflamación abdominal; mejora el sistema inmunológico» | MSG |
| 36 | MX | 1449601773169016 | PH Nutrition México (DXN) | 6 nov 2026 | 0 | T: cremoso, bajo en cafeína, envío gratis | Web |
| 37 | MX | 1490604477459796 | Café, Salud y Negocio DXN | 6 nov 2026 | 0 | T: membresía con 33 % de descuento | Web |
| 38 | PE | 947990521079054 | Cuidavic Perú | 15 sep 2026 | 2 | T: «¡Dile adiós a la ansiedad! Café + Ganoderma… refuerza el sistema inmune» | — |
| 39 | PE | 1376283731343823 | Cuidavic Perú | 16 sep 2026 | 2 | T: «combatir la ansiedad, fortalece tu sistema inmune y cuida tu piel» | WA |
| 40 | PE | 4523602814521717 | Salunat Salud Natural | 19 sep 2026 | 1 | T: «Café que cuida tu salud» y 5 beneficios | WA |

### 2.3 Lo que dice la muestra

- **Distribución (A, 25 creativos de Gano Excel):** 5 sin declaración · 11 bienestar genérico · 8 enfermedad nombrada · 1 combate enfermedades graves (diabetes, cáncer). **Ninguno escribe «cura» en el texto.** VERIFICADO (clasificación propia).
- **Dónde está la afirmación grave (los 9 de clase 2 o 3):** 3 en el texto, **4 en la voz** (en el #1 el texto es más suave que la voz) y **2 en la imagen**. La voz y la imagen son el escondite. VERIFICADO.
- **Destino:** unos 17 de 25 van a WhatsApp, 2 a Messenger, 1 a una tienda web y 4 a un botón «Comprar» sin dominio visible. Nadie manda a la web de Gano Excel. VERIFICADO.
- **¿Duran más los que prometen curas?** La mediana de inicio de los 9 anuncios con enfermedad o cura es el **29 dic 2025 (~312 días)**; la de los 16 limpios o genéricos, mediados de **octubre de 2026 (~3 semanas)**. **No concluya de ahí que la cura «protege».** La diferencia la hace casi sola una Página («Ganoderma CON AMOR»: 7 creativos de diciembre de 2025, con las afirmaciones en la voz). Además, la Biblioteca solo muestra sobrevivientes: no vemos los anuncios con curas que Meta tumbó. Y el limpio más antiguo («Gano Power», desde el 8 may 2026) muestra que un anuncio sin salud también dura meses. Lo que sí se puede afirmar: **un anuncio con afirmaciones graves en la voz puede sobrevivir casi un año sin que Meta lo saque.** VERIFICADO el hecho, NO VERIFICADO cualquier causalidad.
- **México y Perú:** no hay anuncios activos de Gano Excel. Las afirmaciones de enfermedad (ansiedad, estreñimiento) aparecen **en el texto** en Perú, en marcas locales de capuchino con Ganoderma que llevan casi dos meses activas.
- **Lo que no vimos:** ningún anuncio activo escrito con «cura la diabetes» o «elimina el cáncer». Si «el mercado está lleno de eso», está en publicaciones orgánicas, Reels, grupos, Marketplace, en la voz de los videos (como el #1) o en la conversación de WhatsApp después del clic. Lo orgánico no lo medimos: la Biblioteca solo ve pauta.

### 2.4 Procedimiento manual para que Luis (o un distribuidor) repita el censo

1. Abrir `https://www.facebook.com/ads/library/` (no hace falta iniciar sesión). País: **Colombia** · Categoría: **Todos los anuncios** · Estado: **Activos** · Tipo de búsqueda: **palabra clave**.
2. Hacer, una por una: `ganocafe` · `gano cafe` · `gano excel` · `cafe ganoderma` · `ganoderma` · `hongo reishi` · `reishi`. Para destapar lo que está en la voz o la imagen: `ganoderma diabetes` · `ganoderma cancer` · `ganoderma artritis` · `ganoderma gastritis` · `ganoderma migraña` · `ganoderma gripa`. **Si aparece un anuncio cuyo texto no contiene la palabra, la palabra está en el audio o en la imagen: ábralo y escúchelo con sonido.**
3. Repetir con México, Perú y Estados Unidos (en EE. UU., buscar en español).
4. En cada tarjeta, «Ver detalles del anuncio» (o «del resumen» si hay varias versiones) muestra las versiones, las plataformas y el botón de destino.
5. **Columnas de la hoja:** fecha de la revisión · país · búsqueda · identificador de la Biblioteca · nombre de la Página · tipo (tienda / Página de marca / persona) · fecha «En circulación desde» · número de versiones · plataformas (FB, IG, Messenger, WhatsApp, Audience Network) · formato (imagen / video / carrusel) · destino (WhatsApp / Messenger / web y dominio / perfil) · afirmación en el texto (0-3) · en la imagen (0-3) · en la voz (0-3) · frase literal más grave · producto · ¿promesa de ingreso? (sí/no).
6. **Repetir la misma búsqueda cada 7 días** y marcar qué identificadores desaparecieron. Es la única forma de medir supervivencia, porque la Biblioteca borra los inactivos.

---

## 3. Pregunta 12 · Cómo revisa Meta un anuncio, en la práctica

### 3.1 Lo que dice Meta (fuente primaria)

- **Automática primero, humana a veces.** *«Nuestro sistema de revisión usa principalmente herramientas automatizadas… Nuestro proceso de revisión se inicia de forma automática antes de que los anuncios se pongan en circulación y suele completarse en 24 horas… Los anuncios pueden volver a revisarse incluso una vez publicados.»* Y: *«Usamos revisiones automatizadas y, en algunos casos, manuales.»* VERIFICADO — Normas de publicidad, introducción: https://transparency.meta.com/es-es/policies/ad-standards/
- **Qué revisa:** *«Pueden revisarse componentes específicos de los anuncios, como imágenes, vídeo, texto y datos de segmentación, así como su página de destino u otros destinos.»* VERIFICADO (misma página).
- **Admite que no lo ve todo:** *«Es posible que en el proceso de revisión no se consigan detectar todas las infracciones de políticas, por lo que los anuncios están sujetos a revisiones posteriores y pueden rechazarse… en cualquier momento.»* Y en el Servicio de ayuda: *«Es posible que un anuncio no se revise para comprobar que cumple todas las políticas antes empezar a entregar impresiones… tanto las máquinas como las personas cometemos errores.»* VERIFICADO — «Información sobre los anuncios en revisión»: https://www.facebook.com/business/help/204798856225114
- **El historial pesa:** *«podemos tener en cuenta el historial de cumplimiento de nuestras Normas de publicidad de un anunciante o los comentarios de los clientes a la hora de evaluar sus anuncios.»* Una cuenta nueva no tiene historial. VERIFICADO (misma página).
- **Editar dispara otra revisión:** cambiar segmentación, contenido, optimización o evento de facturación lanza una revisión nueva; cambiar puja, presupuesto o calendario, no. VERIFICADO (misma página).
- **La ley local es asunto del anunciante:** *«Es responsabilidad del anunciante conocer y cumplir… todas las leyes y normativas locales.»* Meta no se compromete a hacer cumplir el Decreto 3249. VERIFICADO (introducción de las Normas).

### 3.2 La regla de salud de Meta, textual

Política «Salud y bienestar», registro de cambios: **22 jul 2026** y 26 dic 2024. https://transparency.meta.com/es-es/policies/ad-standards/restricted-goods-services/health-wellness/ — VERIFICADO:

- *«Los anuncios que promocionen o publiciten productos y servicios dietéticos, de salud o para la pérdida o el aumento de peso deben dirigirse a mayores de 18 años.»* (Los «productos alimentarios generales» quedan exentos de la edad mínima. Un café podría caber ahí, pero un suplemento dietario registrado como SD no.)
- Los anuncios no pueden *«realizar afirmaciones… sobre la curación, sanación o eliminación de cualquiera de estas enfermedades incurables o terminales (lista exhaustiva): diabetes, herpes, tiroides, psoriasis, ébola, cáncer, autismo, Alzheimer, Parkinson, esclerosis lateral amiotrófica (ELA) o virus de inmunodeficiencia humana (VIH). Nota: No se aplica a las afirmaciones sobre el tratamiento de los síntomas de estas enfermedades.»*
- Tampoco pueden *«emplear tácticas de cebo de clics en contextos de salud… lenguaje sensacionalista con afirmaciones exageradas o extremas, o promesas de resultados específicos en un plazo determinado sin descargos de responsabilidad ni calificativos.»*

**Lectura:** la regla de Meta es **más estrecha** que la colombiana. «Ayuda con la artritis», «controla la irritación del colon», «previene las gripas» o «fortalece las defensas» no caen en la lista cerrada. A lo sumo los puede alcanzar la cláusula de sensacionalismo o una política general de prácticas engañosas, a criterio de Meta. El #1 (diabetes y cáncer en la voz) **sí viola la letra de Meta**, y aun así sigue activo.

### 3.3 Video, audio, imagen e idioma

- **Meta dice que revisa video e imagen** (§3.1), pero **no publica** si transcribe el audio para hacer cumplir las normas.
- **Lo que medimos:** la búsqueda por palabra clave de la Biblioteca encuentra anuncios por palabras que **solo están en la voz** (`ganoderma obesidad` → solo el #1; `gastritis ganoderma` → solo el #6; `gripas ganoderma` → el #5) o **en la imagen** (`migraña ganoderma` y `colesterol ganoderma` → los #9 y #10, con la imagen de beneficios). **Meta tiene transcripciones del audio en español y texto leído de las imágenes.** Que esos anuncios sigan activos después de 10 meses indica que **tener la transcripción no basta para que actúe**: o la aplicación de normas no usa esa señal, o la usa por debajo de su umbral. VERIFICADO el hecho (búsquedas del 6 nov 2026), NO VERIFICADO el mecanismo.
- **Español frente a inglés:** Meta no publica tasas de precisión por idioma para anuncios. El dato más citado es de Avaaz (2020, desinformación orgánica sobre la covid, no anuncios): ~70 % del contenido falso en español quedaba sin etiqueta, contra ~30 % en inglés. Meta lo disputó. NO VERIFICADO (prensa: kunc.org, 16 mar 2021). Nuestro censo no muestra una ceguera en el texto en español (las curas escritas casi no aparecen); la debilidad está en la voz.
- **La conversación de WhatsApp después del clic:** Meta dice que revisa el «destino del anuncio», que en un anuncio Click-to-WhatsApp es el chat. **No encontramos ninguna fuente de Meta que diga que lee los mensajes que siguen.** WhatsApp aplica su propia política a las empresas y actúa, entre otras señales, por *«excessive negative feedback from users»*, con una escala: advertencia, bloqueo de plantillas por 1 o 3 días, bloqueo de todos los mensajes por 5, 7 o 30 días, cuenta bloqueada y cuenta deshabilitada. VERIFICADO — https://developers.facebook.com/documentation/business-messaging/whatsapp/policy-enforcement (página sin fecha). Que una denuncia le reenvíe a WhatsApp los últimos 5 mensajes es NO VERIFICADO (prensa tecnológica). **Conclusión práctica: lo que se dice en el chat no lo ve la revisión del anuncio, pero un cliente que denuncia sí lo puede llevar a WhatsApp, y en Colombia el chat es prueba ante la SIC (Ley 1480, art. 29: lo anunciado obliga).**

### 3.4 Informes de transparencia y el caso Reuters

- **Meta no publica en su Informe de cumplimiento de normas una cifra de anuncios de salud retirados.** La única cifra global reciente es que **retiró más de 134 millones de anuncios de estafa en 2025** (anuncio del 3 dic 2025). NO VERIFICADO (lo citan ppc.land y otros; no leímos el comunicado original).
- **Reuters, «Meta is earning a fortune on a deluge of fraudulent ads, documents show»**, de Jeff Horwitz, 6-7 nov 2025. Lo leímos en la versión sindicada (Hawaii Tribune-Herald) porque reuters.com no se dejó abrir. NO VERIFICADO (prensa):
  - Meta proyectó que ~**10 % de sus ingresos de 2024 (~US$16.000 millones)** vendrían de anuncios de estafas y bienes prohibidos, incluida *«la venta de productos médicos prohibidos»*.
  - Un documento de diciembre de 2024: los usuarios ven ~**15.000 millones de anuncios de estafa «de mayor riesgo» al día**.
  - Meta solo veta a un anunciante si sus sistemas predicen que tiene al menos **95 % de certeza** de cometer fraude; a los sospechosos por debajo de ese umbral les **cobra tarifas más altas como penalización** («penalty bids»).
  - En el primer semestre de 2025, el equipo de verificación no podía tomar medidas que costaran **más del 0,15 % de los ingresos** (~US$135 millones). Meta dice que no era un límite duro.
  - Un anunciante **pequeño** tenía que recibir al menos **8 alertas** por fraude financiero antes del bloqueo; algunas **«High Value Accounts»** acumularon **más de 500** sin ser cerradas (engadget.com y otros, 6 nov 2025).
  - **Fuentes del reportaje:** documentos internos de 2021 a 2025 de las áreas de finanzas, cabildeo, ingeniería y seguridad: un documento de 2022 sobre la «falta de inversión» en detección automática, uno de 2023 sobre denuncias de estafa rechazadas, uno de noviembre de 2024 sobre los ingresos, uno de febrero de 2025 sobre el límite de ingresos y una presentación de seguridad de mayo de 2025.
  - **Respuesta de Meta (Andy Stone):** los documentos *«presentan una visión selectiva que distorsiona el enfoque de Meta»*; el 10,1 % es una estimación *«burda y demasiado inclusiva»*; las denuncias de anuncios de estafa bajaron 58 % en 18 meses.
- **Seguimiento en 2026:**
  - Reuters ganó el **Pulitzer de reportería especializada** el **4 may 2026** por la serie *«The Secrets of Meta's Success»* (Horwitz, con Engen Tham). NO VERIFICADO (theprint.in, gvwire.com).
  - En **diciembre de 2025**, Reuters informó que ~19 % de los ingresos de Meta por anunciantes chinos estaban ligados a contenido prohibido y que el equipo que lo bajó al 9 % fue disuelto. NO VERIFICADO (Fortune, 15 dic 2025; Yahoo Finance).
  - El **26 feb 2026** Meta demandó a anunciantes de Brasil, China y Vietnam. En Brasil: deepfakes de un médico conocido para vender *«productos de salud sin aprobación regulatoria»* (B&B Suplementos e Cosméticos Ltda.); en Vietnam: cloaking. Además, Meta envió cartas de cese a ocho antiguos Business Partners por ofrecer «des-baneo» y por *«alquilar el acceso a cuentas de confianza que ayudaban a los clientes a evadir nuestros sistemas»*. VERIFICADO — https://about.fb.com/news/2026/02/meta-takes-legal-action-against-scam-advertisers/
  - Reguladores: Polonia pidió en agosto de 2026 a la Comisión Europea una multa de €250 millones porque Meta no retiró 106 de 122 anuncios fraudulentos señalados (86,8 %); la FCA británica criticó a Meta en marzo de 2026; la SEC investiga, según los documentos. NO VERIFICADO (pymnts.com, videoweek.com). **No encontramos ninguna acción de un regulador colombiano contra Meta por anuncios.**

---

## 4. Pregunta 13 · Qué le pasa en la práctica a quien pauta afirmaciones prohibidas

### 4.1 La escala oficial (fuente primaria)

«Información sobre restricciones publicitarias»: https://www.facebook.com/business/help/975570072950669 — VERIFICADO:
- **Cuándo:** si el anunciante no cumple las Normas comunitarias, las Normas publicitarias, las Políticas de comercio u otras condiciones; si hay sospecha de hackeo; si falta la verificación en dos pasos; o si hay actividad inusual en pagos o cuentas.
- **Qué puede pasar:** límite de gasto diario o umbral de pago más bajo; pérdida de funciones de pago o de publicidad; **pérdida total de la capacidad de anunciarse**.
- **En qué activo:** **portafolio empresarial** (no podrá publicar anuncios) · **cuenta publicitaria** (se inhabilitan la cuenta, sus anuncios y algunos activos; *«si no puedes optar a su restablecimiento durante seis meses, puede que pierdas cualquier servicio de prepago sin usar… Transcurrido este periodo de tiempo, la cuenta no podrá restablecerse»*) · **Página** (no podrá publicar anuncios) · **perfil personal** (*«no se le permitirá usar los productos de Meta para publicar anuncios… También podrían inhabilitarse las cuentas publicitarias en las que sea el único usuario»*).
- **Cuántos rechazos:** **Meta no publica un umbral.** Las Normas solo dicen que puede restringir a quienes infringen de forma *«grave o reiterada»*. La cifra de 8 alertas (Reuters) era para fraude financiero, no para salud. Los blogs de agencias que hablan de «demasiados anuncios rechazados» no citan número. NO VERIFICADO cualquier umbral.
- **El sistema de «strikes» del Centro de transparencia** (actualizado el 12 nov 2024) es de las Normas comunitarias, no de las de publicidad. Ahí la restricción para crear anuncios puede llegar *«desde el primer strike»* en las políticas más graves. VERIFICADO — https://transparency.meta.com/enforcement/taking-action/restricting-accounts/

**Lo que esto significa para Luis:** su Página «Crea Tu Activo», su cuenta publicitaria y **el portafolio donde vive el WhatsApp Business API de Queswa** están en el mismo lugar. Una restricción del portafolio por anuncios no dice nada, en el texto citado, sobre la cuenta de WhatsApp. Pero el riesgo de contagio entre activos del mismo portafolio y del mismo perfil es real: la nota sobre el perfil personal lo muestra. Es el argumento más fuerte para **no probar el límite desde ese portafolio**. NO VERIFICADO el efecto sobre el WABA.

### 4.2 Por qué tantos parecen no tener consecuencias (evidencia, no especulación)

1. **Umbral alto y castigo con precio, no con veto.** 95 % de certeza para vetar; «penalty bids» por debajo; límite de 0,15 % de ingresos para las medidas del equipo de verificación (Reuters, NO VERIFICADO). Para Meta, el anunciante sospechoso es un cliente que paga más.
2. **La regla de salud de Meta es una lista cerrada** (§3.2): mucho de lo que vemos no la viola en su letra. VERIFICADO.
3. **La afirmación está donde la revisión no actúa** (voz, imagen, chat): 6 de los 9 casos graves del censo. VERIFICADO.
4. **Cuentas alquiladas y servicios de «des-baneo».** Meta lo documenta en su propia demanda de febrero de 2026 (*«alquilar el acceso a cuentas de confianza»*). VERIFICADO (about.fb.com).
5. **Cloaking.** Meta demandó a LeadCloak en abril de 2020 por vender software que mostraba a la revisión una página inocente y al usuario otra; lo usaban, entre otros, para pastillas para adelgazar y productos farmacéuticos. Volvió a demandar por cloaking en 2026. VERIFICADO el de 2026; el de 2020, NO VERIFICADO (about.fb.com/news/2020/04/addressing-deceptive-ad-practices, leído en prensa).
6. **Rotación y multiplicidad.** En el censo, una sola Página corre 7 creativos con 4 a 6 versiones cada uno; dos Páginas usan la misma imagen; dos Páginas publican el mismo texto de reclutamiento el mismo día. Es compatible con operadores que reparten el riesgo entre activos. VERIFICADO lo observado, NO VERIFICADO la intención.
7. **Sesgo de supervivencia.** Solo vemos a los que siguen vivos (§1). No sabemos cuántos cayeron.

---

## 5. Pregunta 14 · La aplicación real de la norma en Colombia

### 5.1 La norma (fuente primaria)

- **Decreto 3249 de 2006, art. 24** (modificado por el art. 6 del Decreto 3863 de 2008): *«La publicidad de los suplementos dietarios se ajustará a los beneficios atribuidos a cada uno de los ingredientes característicos de la composición y deberá ser aprobada previamente por el… Invima.»* VERIFICADO — texto en faolex.fao.org/docs/pdf/col86188.pdf y col86189.pdf.
- **Art. 25.8:** la publicidad no puede *«declarar propiedades que no puedan comprobarse, o que señalen que los productos son útiles para prevenir, aliviar, tratar o curar una enfermedad, trastorno o estado fisiológico»*. Y el 25.1: *«completa, veraz, que no induzca a confusión o engaño»*. VERIFICADO (misma fuente).
- **Sanciones sanitarias:** amonestación, multas sucesivas de hasta 10.000 SMMLV, decomiso, suspensión o cancelación del registro y cierre (Ley 9 de 1979, art. 577, modificado por el Decreto 2106 de 2019). VERIFICADO — tal como la resume la evaluación ex post del Minsalud y el INVIMA (9 nov 2021).
- **Ley 1480 de 2011, art. 30:** *«Está prohibida la publicidad engañosa. El anunciante será responsable de los perjuicios que cause la publicidad engañosa.»* Art. 29: *«Las condiciones objetivas y específicas anunciadas en la publicidad obligan al anunciante.»* VERIFICADO — secretariasenado.gov.co. El tope de multa de la SIC (2.000 SMMLV, art. 61) es NO VERIFICADO en el texto: no cargó esa parte de la ley.

### 5.2 Lo que pasa en la práctica

- **INVIMA, monitoreo de 2016 a 2019:** de 59 piezas de suplementos con registro revisadas en redes sociales, **54 (91,5 %) no tenían autorización previa**; en páginas web, 29 de 29 (100 %); en total, 83,2 %. VERIFICADO — Minsalud e INVIMA, *Evaluación ex post del Decreto 3249 de 2006*, informe final del 9 nov 2021, Tabla 9: https://www.minsalud.gov.co/sites/rid/Lists/BibliotecaDigital/RIDE/VS/PP/SSNAB/evaluacion-expost-suplementos-dietarios.pdf
- **INVIMA, procesos sancionatorios por suplementos entre 2006 y 2020: 95 en total (unos 6 al año)**, el 72,6 % con multa de entre 40 y 6.000 salarios mínimos *diarios*. Son por fallas de calidad, seguridad e inocuidad, no por publicidad. VERIFICADO (misma fuente, Tabla 8).
- **SIC, suplementos, de 2016 a 2020:** 16 denuncias por publicidad engañosa y **4 sanciones**, de entre $137,9 y $708,8 millones. VERIFICADO (misma fuente, Tabla 10). Las sanciones conocidas son contra **empresas**. Por ejemplo, Natural Vitamins S.A.S. («Té Chino El Original»: «previene el cáncer», «reduce la dependencia a la insulina», en redes sociales y televisión), multada con $551.563.200 (800 SMLMV) por la Resolución 1485 de 2016. VERIFICADO — sic.gov.co.
- **El único caso con Ganocafé (proceso 201500495):** una denuncia de enero de 2015 contra la web ganocafecolombia.com y sus redes (Facebook, Twitter, YouTube) por publicidad del suplemento GANOCAFE (SD 20120002589) *«sin autorización previa»* y con *«propiedades terapéuticas»*. Primero se citó a Gano Excel S.A.; en 2017 se formularon cargos contra el proveedor de hosting del dominio (que no era el anunciante); en 2020, contra una persona natural y su S.A.S., a quienes no se pudo notificar (correo devuelto, «no reside»). La Resolución 2021019877 del 24 may 2021 lo **archivó**, *«en contra de: INDETERMINADO»*, porque no fue posible *«establecer más allá de toda duda razonable»* quién era el responsable. El grupo de reacción del INVIMA dejó escrito que en Facebook el perfil *«no está creado a nombre de persona natural alguna»*, lo que *«dificulta la identificación»*. **Fueron seis años para nada.** VERIFICADO — https://www.invima.gov.co/biblioteca/aviso-2021000081-del-31-de-mayo-de-2021-ps-201500495pdf (PDF completo: /biblioteca/download/142120).
- **Alertas del INVIMA sobre Ganoderma:**
  - **Ninguna contra Gano Excel ni contra Ganocafé.** La 017-2024 (29 ene 2024) **protege** al CORDY GOLD de Gano Excel (SD2017-0004056, *«vigente a la fecha»*) y advierte contra imitaciones sin registro. VERIFICADO — https://www.invima.gov.co/alertas-sanitarias/cordyceps-ver-imagenes
  - La 357-2023 (23 oct 2023) es contra productos **sin registro** de la marca HUA, entre ellos «SISTEMA INMUNE (Ganoderma lucidum con zinc)», por promocionarse *«declarando propiedades para la salud»*. Las 308-2024 y 304-2026 son contra Reishi u hongos sin registro. NO VERIFICADO (resumen del buscador; no abrimos cada alerta).
  - **El patrón del INVIMA en 2024-2026:** alertas contra productos **fraudulentos o sin registro** vendidos por redes (129-2025 y 130-2025 contra una cuenta de Instagram; 285-2026). Contra un producto **registrado** con publicidad abusiva de un distribuidor, no encontramos nada. VERIFICADO (129-2025).
  - Un proceso del INVIMA de 2025 (201613295, MATCHA SLIM) incluyó remitir información a la SIC para **bloquear la publicidad en redes**. Es la vía que el INVIMA usa hoy. NO VERIFICADO (resumen del buscador del auto de inicio del 21 feb 2025).
- **SIC contra personas naturales e influenciadores:** la *Guía de buenas prácticas en la publicidad a través de influenciadores* (octubre de 2020) **no es vinculante**, pero refleja cómo la SIC lee la Ley 1480 (NO VERIFICADO, prensa jurídica). Hay una sanción a una influenciadora como **anunciante** (Resolución 36872 del 16 jun 2021, pruebas de covid que decía tener registro del INVIMA sin tenerlo; responsabilidad *«de carácter objetivo»*) (NO VERIFICADO, asuntoslegales.com.co, 3 jul 2021) y la multa de $813 millones a Grupo Cossio S.A.S. (Resolución 18525 del 17 abr 2024) por **promesas de ganancia rápida** de un curso (NO VERIFICADO, prensa). Esta última es relevante para la campaña A: **las promesas de ingreso sí se sancionan**.
- **Distribuidores individuales de venta directa, sancionados por publicidad de un suplemento en redes en los últimos cinco años: cero casos encontrados**, ni de Gano Excel ni de otras compañías. Que no los encontremos no prueba que no existan: el INVIMA publica avisos por proceso, no una base consultable de sanciones.

### 5.3 Comparación de los tres anuncios (riesgo regulatorio)

- **(a) Ganocafé 3 en 1 por sabor y ritual, sin declaración de salud.** Según la letra del art. 24, toda publicidad de un **SD** requiere aprobación previa, aunque no declare nada; el proceso de 2015 se abrió *también* por «sin autorización previa». Pero sin declaraciones no hay engaño (Ley 1480) ni infracción del art. 25.8, y con el 91,5 % del mercado sin autorización, el INVIMA no persigue piezas inocuas. Hay una vía de menor riesgo formal: pautar con los productos registrados como **alimento (NSA)**, o usar piezas que Gano Excel Colombia ya tenga aprobadas (lo verifican los investigadores de la campaña B). **Riesgo real: muy bajo.**
- **(b) El mismo producto con «apoya el funcionamiento normal de las defensas».** Para Meta pasa: no está en la lista cerrada y no es sensacionalista. Para el INVIMA es una declaración de función, no de enfermedad, así que no cae de frente en el 25.8. Pero el art. 24 exige que la publicidad *«se ajuste a los beneficios atribuidos»* en el registro: si esa declaración no está aprobada para ese producto, es publicidad no autorizada con contenido de salud, un escalón por encima de (a). Una marca del censo (Fuly Kids, #34) usa la fórmula *«ayudan al funcionamiento normal del sistema inmune.\*»* con asterisco y aclaración, que es el patrón prudente. **Riesgo real: bajo**, y casi todo es formal.
- **(c) Prometer curar una enfermedad.** Viola el 25.8 de frente y es engaño ante la Ley 1480. Si la enfermedad está en la lista de Meta (diabetes, cáncer…), también viola la política de Meta. La probabilidad de una sanción del INVIMA o la SIC contra un distribuidor anónimo es baja (nadie sancionado en cinco años; 2015 archivado). Para **un anunciante identificable** —con nombre, Página, número verificado y reputación pública— cambian dos cosas: una denuncia (de un competidor, un consumidor o la propia compañía) lo encuentra en un día, y la responsabilidad es objetiva. **Riesgo real: bajo en probabilidad para el anónimo; moderado y de consecuencia alta para Luis.**

---

## 6. Tabla de riesgo real (bloque C)

Probabilidades cualitativas, estimadas por nosotros a partir de lo anterior. Ningún dato público permite poner porcentajes.

| Tipo de anuncio | Lo que dice la norma | Lo que pasa en la práctica | Rechazo de Meta (probabilidad · consecuencia) | Restricción de cuenta o portafolio (probabilidad · consecuencia) | Sanción INVIMA / SIC (probabilidad · consecuencia) |
|---|---|---|---|---|---|
| **(a) Sabor, ritual, precio; sin salud** (Ganocafé SD) | Meta: permitido, mayores de 18 si se trata como suplemento. INVIMA: el art. 24 exige aprobación previa de toda publicidad de un SD. Ley 1480: precio y condiciones obligan | Es lo más común entre los anuncios nuevos; uno así lleva 6 meses al aire. El 91,5 % de las piezas de SD en redes no tiene autorización y nadie es sancionado por eso | **Muy baja** · se edita y se reenvía | **Muy baja** · — | **Muy baja** · en teoría, requerimiento o proceso por «sin autorización previa»; en la práctica no ocurre |
| **(b) + «apoya el funcionamiento normal de las defensas»** | Meta: permitido (fuera de la lista cerrada). INVIMA: debe coincidir con los beneficios aprobados en el registro; si no, es publicidad de salud no autorizada | Muy común («fortalece tus defensas», «+150 antioxidantes»), incluso en formas más fuertes, y con meses al aire | **Baja** · posible por cebo o sensacionalismo si se exagera | **Baja** · — | **Baja** · el mismo riesgo formal que (a), algo mayor si hay denuncia; amonestación o multa |
| **(c1) Enfermedad nombrada, sin «cura»** (artritis, gastritis, colon, migraña, gripa, ansiedad) | Meta: **no** está en la lista cerrada (aunque podría tocar la cláusula de sensacionalismo). INVIMA: **prohibido** (art. 25.8: prevenir, aliviar, tratar). Ley 1480: engaño si no se puede probar | 8 de 25 creativos de Gano en Colombia; casi siempre en la voz o la imagen; uno con 10 meses al aire | **Media-baja en texto; baja en voz o imagen** · rechazo, y se acumula historial | **Baja-media** · si es reiterado: límite de gasto o inhabilitación; sin umbral público | **Baja (anónimo) / media (identificable)** · multa INVIMA (hasta 10.000 SMMLV) o SIC; caso de referencia: $551 millones a una empresa en 2016 |
| **(c2) Cura de una enfermedad grave** (diabetes, cáncer…) | Meta: **prohibido explícitamente**. INVIMA: prohibido. SIC: engaño | 1 caso activo, en la **voz**, 10,5 meses; en el texto, ninguno sobrevive en la muestra | **Alta en texto; incierta en voz** (Meta transcribe pero no actuó) · rechazo; en re-revisión, también a destiempo | **Media** · *«grave o reiterada»*: cuenta, Página, perfil y portafolio; tras 6 meses sin restablecer, pérdida definitiva | **Baja-media**, pero con la **consecuencia más alta**: proceso sanitario, multa SIC, responsabilidad objetiva ante el consumidor y daño de reputación del distribuidor y de la marca |
| **Cualquiera de los anteriores + evasión** (voz o imagen distinta del texto, cloaking, cuentas alquiladas, Páginas en rotación) | Meta: eludir la revisión es motivo autónomo de restricción; demandas en 2020 y 2026 | Es como sobrevive el mercado, a costa de quemar activos | Varía | **Alta a mediano plazo** · Meta sanciona la conducta, no solo el anuncio | Igual que (c), con agravante de mala fe |

---

## 7. Pregunta 15 · Guía para distribuidores (borrador)

### Cinco mensajes con la mejor relación entre resultado y riesgo

1. **El ritual, sin salud.** *«Su tinto de la mañana, cremoso y listo en 30 segundos, con extracto de Ganoderma. Pídalo por WhatsApp y le llega a la casa.»* Video casero del producto preparándose; botón a WhatsApp. (Es el patrón de los anuncios limpios que más duran.)
2. **La oferta honesta.** *«Tres cajas de Ganocafé y le regalamos la taza. Pago contra entrega en todo Colombia.»* Las condiciones exactas, porque obligan (Ley 1480, art. 29). Sin «solo hoy» si no es cierto.
3. **El fabricante, con hechos que se pueden verificar.** *«Gano Excel: más de 30 años y presencia en más de 60 países. Producto original, con registro sanitario INVIMA [número].»* El número de registro se cita solo si está confirmado. **Nunca** «avalado por el INVIMA» para un efecto: el INVIMA registra el producto, no avala beneficios.
4. **La cara del distribuidor.** Un video a cámara de 20 a 40 segundos: *«Soy [nombre], de [ciudad]. Le llevo el café a la casa y le explico los productos por WhatsApp.»* La confianza la pone la persona, no la promesa. Los testimonios, solo de sabor y de experiencia («es el que tomamos en la casa»), nunca de resultados en el cuerpo.
5. **El catálogo como regalo.** *«Cafés, chocolates, tés y cereales con Ganoderma. Pídale el catálogo a [distribuidor] por WhatsApp.»* Abre la conversación sin afirmar nada; lo demás lo atiende el chat, con las mismas reglas.

*Opcional y con más riesgo formal:* «apoya el funcionamiento normal de las defensas», solo en productos donde esté aprobada, con asterisco y aclaración, y nunca en la voz de un video improvisado.

### Los cinco errores que más cuentas cuestan

1. **Nombrar una enfermedad, sobre todo de la lista de Meta** (diabetes, cáncer, tiroides…), aunque sea «ayuda con». Es rechazo seguro en el texto, el historial se acumula y en Colombia es ilegal para un suplemento.
2. **Decirlo en la voz o en la imagen porque «el texto lo revisan».** Meta transcribe el audio y lee las imágenes, y re-revisa en cualquier momento. Lo que hoy pasa, mañana tumba la cuenta con todo el historial.
3. **Mezclar el café con la promesa de ingreso** («Genera ingresos ilimitados», cifras, «únete a mi equipo» en un anuncio de producto). Choca con la política de resultados poco realistas de Meta y es lo que la SIC sí sanciona (Cossio, 2024).
4. **Burlar una restricción** abriendo otra cuenta, usando una Página prestada, «alquilando» un perfil o pagando un «des-baneo». Meta rastrea los vínculos entre cuentas y en 2026 demandó y envió cartas de cese a quienes venden ese servicio. Una restricción del perfil personal puede arrastrar las cuentas donde ese perfil es el único usuario.
5. **Hacerse pasar por la marca y descuidar lo básico:** una Página llamada «Gano Excel Colombia» sin serlo (denuncia de propiedad intelectual), piezas copiadas de otro distribuidor, un anuncio de suplemento dirigido a menores de 18 o cambiar el texto de un anuncio aprobado para «meter» beneficios (cada edición se revisa otra vez).

---

## 8. Dónde Claude Code se equivoca o se queda corto (bloque C de §5)

| Lo que dijo Claude Code | Contraste |
|---|---|
| «Hoy circulan **miles** de anuncios… con afirmaciones mucho más graves» | **Se refuta en parte.** En la Biblioteca hay decenas de anuncios activos de Gano Excel en Colombia (17 Páginas), no miles, y casi ninguno escribe curas. Las afirmaciones graves existen, pero se concentran en pocos anunciantes y en la voz o la imagen. Si hay miles, son orgánicos o de otros productos con Ganoderma, y eso no lo medimos. |
| El problema es que la norma «no se aplica» | **Incompleto.** Hay dos asimetrías distintas: (1) **Meta** aplica una lista cerrada de enfermedades y exime los síntomas, así que mucho de lo que circula no viola su letra; (2) el **INVIMA** sí lo prohíbe, pero casi no lo aplica (91,5 % sin autorización; 95 procesos por suplementos en 15 años, ninguno conocido contra distribuidores por publicidad). |
| Proceso 2015 (201500495): «se archivó en 2021 porque no logró identificar al responsable» | **Correcto, y peor de lo que sugiere.** El origen fue una **página web** (y sus redes); se cargaron cargos al proveedor de hosting por error; luego a una persona y su S.A.S., que no se pudieron notificar; seis años y archivo «contra INDETERMINADO». Para Luis, la lección es que **la impunidad viene del anonimato**, y él no es anónimo. |
| Decreto 3249, art. 24: aprobación previa | **Correcto** (con el texto del Decreto 3863 de 2008, art. 6). Falta el **art. 25.8**, que es el que hace ilegal «prevenir, aliviar, tratar o curar» e incluso un «estado fisiológico». |
| «El distribuidor que pauta es anunciante ante la Ley 1480» | **Correcto** (art. 30) y reforzado: la SIC ha tratado como anunciante a personas naturales (influenciadora, 2021) con responsabilidad objetiva. |
| Lo que Claude Code no midió | Ahora medido: **supervivencia** (el anuncio de diabetes y cáncer en la voz lleva 319 días; los limpios también pueden durar 6 meses), **dónde se esconde la afirmación** (voz e imagen) y **que Meta tiene la transcripción**. Lo que **no** se puede medir desde afuera: cuántos anuncios rechazó Meta y cuántas cuentas cayeron, porque la Biblioteca borra los inactivos. |

---

## 9. Fuentes (lectura del 6 nov 2026 salvo que se indique)

**Primarias (VERIFICADO)**
- Biblioteca de anuncios de Meta, búsquedas descritas en §1 y §2.4 — https://www.facebook.com/ads/library/
- Normas de publicidad de Meta, introducción y proceso de revisión — https://transparency.meta.com/es-es/policies/ad-standards/
- Política de Salud y bienestar (cambios del 22 jul 2026 y el 26 dic 2024) — https://transparency.meta.com/es-es/policies/ad-standards/restricted-goods-services/health-wellness/
- Información sobre los anuncios en revisión — https://www.facebook.com/business/help/204798856225114
- Información sobre restricciones publicitarias — https://www.facebook.com/business/help/975570072950669
- Restricción de cuentas (Centro de transparencia, actualizado el 12 nov 2024) — https://transparency.meta.com/enforcement/taking-action/restricting-accounts/
- Meta, «Meta Takes Legal Action Against Scam Advertisers», 26 feb 2026 — https://about.fb.com/news/2026/02/meta-takes-legal-action-against-scam-advertisers/
- WhatsApp Business Platform, cumplimiento de políticas — https://developers.facebook.com/documentation/business-messaging/whatsapp/policy-enforcement
- Decreto 3249 de 2006 y Decreto 3863 de 2008 — https://faolex.fao.org/docs/pdf/col86188.pdf · https://faolex.fao.org/docs/pdf/col86189.pdf
- Ley 1480 de 2011, arts. 29-32 — http://www.secretariasenado.gov.co/senado/basedoc/ley_1480_2011.html
- INVIMA, aviso 2021000081 y Resolución 2021019877 (proceso 201500495) — https://www.invima.gov.co/biblioteca/aviso-2021000081-del-31-de-mayo-de-2021-ps-201500495pdf
- INVIMA, alerta 017-2024 (Cordyceps) — https://www.invima.gov.co/alertas-sanitarias/cordyceps-ver-imagenes
- INVIMA, alerta 129-2025 — https://www.invima.gov.co/alertas-sanitarias/productos-promocionados-y-comercializados-en-redes-sociales-de-comercio-eletronico-como-suplementos-dietarios-son-fraudu
- Minsalud e INVIMA, *Evaluación ex post del Decreto 3249 de 2006*, 9 nov 2021 — https://www.minsalud.gov.co/sites/rid/Lists/BibliotecaDigital/RIDE/VS/PP/SSNAB/evaluacion-expost-suplementos-dietarios.pdf
- SIC, sanción a Natural Vitamins (Resolución 1485 de 2016) — https://sic.gov.co/noticias/superindustria-sanciona-a-NATURAL-VITAMINS-por-publicidad-enganosa-en-su-producto-TE-CHINO-EL%20ORIGINAL-al-decir-que-hace-perder-peso-y-previene-el-cancer

**Secundarias (NO VERIFICADO)**
- Reuters (J. Horwitz), 6-7 nov 2025, leído en la versión sindicada — https://www.hawaiitribune-herald.com/?p=352123 · Engadget, 6 nov 2025 — https://www.engadget.com/social-media/meta-is-making-billions-of-dollars-from-scam-ads-on-facebook-instagram-and-whatsapp-report-says-184128645.html
- El Pulitzer de 2026 — https://theprint.in/world/reuters-wins-beat-reporting-pulitzer-for-meta-investigations/2922263/
- Los ingresos de China (Reuters, diciembre de 2025) — https://fortune.com/2025/12/15/former-meta-integrity-chief-ad-fraud-epidemic-china-scams/
- Los 134 millones de anuncios de estafa retirados en 2025 — https://ppc.land/meta-removes-134-million-scam-ads-in-2025-amid-expanding-fraud-crisis/
- Polonia y la Comisión Europea — https://www.pymnts.com/cpi-posts/poland-seeks-e250-million-eu-fine-against-meta-over-scam-ads/ · FCA — https://videoweek.com/2026/03/18/britains-fca-calls-out-metas-failings-on-scam-ads/
- Avaaz y la desinformación en español (2020-2021) — https://www.kunc.org/2021-03-16/facebooks-failing-to-flag-spanish-language-misinformation-analysis-suggests
- LeadCloak (2020) — https://about.fb.com/news/2020/04/addressing-deceptive-ad-practices/
- La influenciadora sancionada por la SIC (2021) — https://www.asuntoslegales.com.co/consultorio/publicidad-en-redes-sociales-el-caso-de-elizabeth-loaiza-3195735 · Grupo Cossio (2024) — https://www.ambitojuridico.com/noticias/mercantil/administrativo-y-contratacion/sic-sanciona-grupo-cossio-por-publicidad-enganosa
- La guía de influenciadores de la SIC (2020) — https://www.bu.com.co/es/insights/noticias/guia-de-buenas-practicas-en-la-publicidad-traves-de-influenciadores
- Alerta 357-2023, MATCHA SLIM (auto de 2025): resúmenes del buscador; no abrimos los documentos.

---

## Anexo · Transcripciones de la voz (Whisper small, 6 nov 2026)

Copiadas tal como salieron de Whisper, sin corregir. Se omite el nombre propio que aparece en un testimonio.

- **1064913665736392 (Ganoderma CON AMOR):** «café orgánico con ganoderma lucido. Te ayuda a combatir enfermedades como la diabetes y pertención, artritis, colesterol, obesidad, cáncer, migraña y otras enfermedades. También te ayuda con la fatiga y la depresión…»
- **1624683078907763 y 2330699034044178 (Ganoderma CON AMOR):** «¿Te sientes agotado al final del día? … un delicioso café con ganoderma, un poderoso, un gum medicinal que fortalece tu sistema immunológico. Ideal para prevenir las gripas frecuentes y combatir el cansancio.»
- **1556054075540486 y 1348946809889228 (Ganoderma CON AMOR):** «¿Te quitaron el café por tu salud? … bajo en cafeína suave y lleno de beneficios… tu momento de café saludable empieza hoy.»
- **2217343145340333 (Ganoderma CON AMOR):** «… tengo un producto que me ayudó demasiado y me cambió la vida… gano café 3 en 1 y… classic… ayudan a desiglamar el colon, a regular los niveles de asides… para todas las personas que sufren de gastritis…»
- **2679383459122788 (Ganoderma CON AMOR):** «… Ayuda a la desintoxicación del cuerpo. Limpia y prótache y el hígado. Fortalece el sistema inmunológico. Reduce migrañas y dolores de cabeza… estreñimiento, depresión. Ayuda a prevenir problemas cardíacos y vasculares…»
- **1080831224766598 (Ganoessence):** «… más de 200 nutrientes activos y 154 antioxidantes… que fortalecen tu sistema inmune y te dan energía todos los días…»
- **1474384428089233 (Ganoessence):** «… café con extracto de ganoderma, un súper alimento natural que ayuda a fortalecer tu sistema inmune… sin químicos, sin culpa. Mismo ritual de siempre…»
- **1726156671962493 (Tiendas Maka Colombia):** «¿Buscas una solución natural para combatir la artritis, la artrosis…? … te ofrece alivio y prevención para tus dolencias articulares… cuenta con el respaldo del inbima.»
- **1567166215002147 (Tiendas Maka Colombia):** testimonio: «… mi abuela ahora sí puede caminar…»
- **1085933500953597 (Tiendas Maka Colombia Oficial):** uñas; «un producto respaldado y avalado por el índima».
- **897932770054350 (Planeta fungi Colombia):** «… me reparan desde adentro… darle a mis células el combustible ancestral que necesitan para rendir, sanar y protegerme… la medicina ideal para ti.»
- **1103708648912235 (Linaje Vital Cerón):** testimonio de dolor de talón por 8 años; «Recomendarlo ha traído no solamente un bienestar físico sino también económico.»
- **2011619712885141 (Fuly Kids):** gripas en el jardín; «garantizar el funcionamiento normal del sistema inmune».

Archivos de trabajo (capturas, transcripciones crudas, JSON de la Biblioteca): /private/tmp/claude-501/-Users-luiscabrejo-Cta-marketing/0bbfc3d1-34da-4f36-8466-216fe90ccea0/scratchpad/adlib/
