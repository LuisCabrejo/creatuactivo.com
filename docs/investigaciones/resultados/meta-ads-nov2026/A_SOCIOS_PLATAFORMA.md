# Investigación Campaña A (nuevos socios) — Meta Ads, 6 nov 2026

Alcance: preguntas 1, 2, 3, 4, 5, 5b y 6 del brief `docs/investigaciones/prompts/PROMPT_GEMINI_META_ADS_DISTRIBUIDORES_Y_CATALOGO_NOV2026.md`. No cubre la Campaña B ni el bloque C.

Convención: **VERIFICADO** = leído hoy (6 nov 2026) en la fuente primaria, con URL. **NO VERIFICADO** = blog, agencia, prensa o inferencia mía. Donde digo «análisis» es razonamiento propio, no evidencia.

Límites de esta investigación, dichos de entrada:
- Las páginas del Servicio de ayuda de Meta (facebook.com/business/help/…) no cargan sin JavaScript: la fase de aprendizaje y las categorías especiales las verifiqué en la documentación para desarrolladores y en el Centro de Transparencia, no en el Servicio de ayuda.
- **La Biblioteca de anuncios no se pudo consultar**: devuelve 403 al lector web y el navegador automatizado estaba ocupado por otro agente durante toda la sesión. Al final dejo el protocolo manual.
- No hay acceso a una cuenta publicitaria ni al Planificador de palabras clave: la disponibilidad de intereses y el volumen de búsqueda en Google quedan sin dato duro (dejo cómo sacarlos en cinco minutos).
- Internet Archive estaba fuera de servicio: no pude recuperar la versión anterior de la página de «resultados poco realistas».

---

## Resumen de lo que decide

1. **La página que cita la §5 ya no existe.** `transparency.meta.com/policies/ad-standards/deceptive-content/unrealistic-outcomes` devuelve 404 (también en alemán y con barra final), y el índice vigente de las Normas de publicidad no contiene «unrealistic», «multilevel», «multi-level» ni «MLM». La sección de contenido engañoso de los anuncios remite ahora a la **Norma comunitaria de Prácticas comerciales prohibidas**, cuyo registro de cambios tiene entradas del 29 y 30 de octubre de 2026. **El texto vigente no prohíbe el multinivel por su nombre.** VERIFICADO.
2. **Lo que sí prohíbe hoy**, y por donde se cae un anuncio de la Campaña A: (a) «Ofertas de oportunidades de recompensas financieras no realistas a cambio de un esfuerzo mínimo o poco claro»; (b) ofertas de inversión cuya compensación «se basen total o parcialmente en el reclutamiento de otras personas para que se incorporen al esquema»; (c) ofertas de empleo sin datos de la empresa o con salario prometido. VERIFICADO.
3. **El riesgo mayor de la Campaña A no está en la política de anuncios: está en la de WhatsApp.** La Política de Mensajes de WhatsApp Business (actualizada el 23 sep 2026) prohíbe usar WhatsApp for Business para «buying, selling, promoting, or otherwise facilitating the exchange of» una lista que incluye **«Multi-level marketing»**, y aclara que la prohibición aplica «irrespective of the global or local licenses, registrations, or other approvals your business may hold». La documentación de cumplimiento de la plataforma clasifica el multinivel bajo la infracción **MISLEADING**. VERIFICADO. La §5 no lo menciona. Un anuncio de reclutamiento que lleva al 321 ata la cuenta publicitaria, el portafolio y el número de Queswa a esa línea, y le suma el volumen de bloqueos de un público frío.
4. **Categorías especiales: no aplican en Colombia.** Son obligatorias para anunciantes de EE. UU. o que llegan a EE. UU., Canadá o partes de Europa; fuera de ahí se puede marcar `NONE`. Declarar «Empleo» además **saca el anuncio de los Estados de WhatsApp** y restringe la segmentación. VERIFICADO.
5. **Conversions API para mensajería:** acepta `LeadSubmitted`, `QualifiedLead` y `Purchase` (entre otros) con `action_source: business_messaging` y el `ctwa_clid`. Pero la guía está escrita para *Business Messaging Partners*, exige al app el nivel avanzado del *Marketing API Access Tier* (1.500 llamadas en 15 días según el cuerpo, 500 según el aviso), y lo único que Meta documenta como optimización por estos eventos es la **de compras** (objetivo Ventas). Para Clientes potenciales con WhatsApp, la API solo lista `CONVERSATIONS`. VERIFICADO.
6. **Con $20.000-$50.000 COP diarios no hay volumen para optimizar por la reunión ni por la vinculación.** La campaña se optimiza por conversaciones, y los eventos de CAPI se mandan para **medir**, no para optimizar. Con un costo por conversación de 6.000-10.000 COP (estimación de agencia, NO VERIFICADO), 50 conversaciones por semana cuestan unos 43.000-71.000 COP diarios: solo el tope del rango sale de aprendizaje.
7. **Audiencias de video: la hipótesis de la §5 se confirma.** Las fuentes admitidas son Página, perfil de empresa de Instagram, anuncios de clientes potenciales, Instant Experience, Shopping y RA. No hay perfil personal ni «modo profesional», y **una cuenta de Instagram de creador no sirve** para audiencias de video. VERIFICADO. Los videos del reto en el perfil personal no construyen público.
8. **Anuncios en Estados de WhatsApp:** disponibles «globally, except in the EU, UK, Iran, Cuba, Syria, Russia, and North Korea» (Colombia incluida). Solo corren si también está seleccionada la ubicación Historias de Instagram, no admiten categorías especiales y no son compatibles con pruebas A/B ni con creativo dinámico. VERIFICADO.
9. **El rango «Diamante»:** Meta no lo trata en su texto. La guía de la FTC (abril 2024) y la del DSSRC (2022) tratan el anuncio de rangos, premios y testimonios de éxito como **afirmación de ingresos implícita**. VERIFICADO (fuentes de EE. UU., no vinculantes en Colombia). Se puede usar como credencial de quién habla, nunca como meta que el otro alcanzará.
10. **Atraer networkers de otras compañías:** el Código de ACOVEDI 2026 (§4.2) califica de desleal «desorganizar internamente una empresa competidora» y las «maquinaciones reiteradas tendientes a privar a un competidor» de su gente, y la Ley 256 de 1996 (art. 17) castiga inducir a incumplir «deberes contractuales básicos». VERIFICADO. El anuncio de A2 se dirige al que ya conoce la industria, no al que está activo en otra.

---

## Pregunta 1. Texto vigente de las políticas de Meta y si un multinivel legal puede pautar

### 1.1 Qué hay hoy en las Normas de publicidad

- **Índice de las Normas de publicidad** — https://transparency.meta.com/policies/ad-standards/ (leído el 6 nov 2026). Secciones en orden: Overview · Meta advertising policy principles · The ad review process · What to do if your ad is rejected… · Community Standards · Unacceptable content · **Prohibited Commercial Practices** · Restricted goods and services · Objectionable content · Intellectual property infringement · Social issue… · Product and format-specific policies · Advertising policies affecting business assets · Data use restrictions · Things you should know · EU DSA. Los términos «Unrealistic», «multilevel», «multi-level» y «MLM» **no aparecen**. La sección pertinente dice: «Content that may deceive or mislead people», con enlace a `/policies/ad-standards/deceptive-content/prohibited-commercial-practices/`. **VERIFICADO.**
- La URL de «unrealistic outcomes» que cita la §5 da **404** (probada en inglés, alemán y con barra final). **VERIFICADO.** Un blog dice que las páginas viejas «redirigen» a la nueva (NO VERIFICADO); en mi lectura no redirigen, dan 404.
- **Página de anuncios «Prohibited Commercial Practices»** — https://transparency.meta.com/policies/ad-standards/deceptive-content/prohibited-commercial-practices/ : «Ads Must Comply with the Community Standard on Prohibited Commercial Practices». Ejemplos que nombra: «deceptive pricing, unauthorized endorsements, and guaranteed investment returns». **VERIFICADO.**
- La antigua «Unacceptable business practices» (https://transparency.meta.com/policies/ad-standards/fraud-scams/unacceptable-business-practices/) muestra hoy el mismo contenido. **VERIFICADO.**

### 1.2 El texto literal que gobierna (Norma comunitaria, versión en español)

Fuente: https://transparency.meta.com/es-la/policies/community-standards/prohibited-commercial-practices/ (registro de cambios: «Hoy» y «29 oct. 2026»; la versión en inglés muestra «Oct 30, 2026»). **VERIFICADO.** El lector solo entrega citas de hasta 125 caracteres, así que algunas viñetas van en dos tramos entre comillas.

**Enriquecimiento rápido**
- «Ofertas de oportunidades de recompensas financieras no realistas a cambio de un esfuerzo mínimo o poco claro.»

**Contenido de inversión prohibido**
- «Ofertas de oportunidades de inversión con retorno de la inversión garantizado o sin riesgos.»
- «Ofertas de oportunidades de inversión donde el retorno de la inversión o la compensación» «se basen total o parcialmente en el reclutamiento de otras personas para que se incorporen al esquema.»
- «Oportunidades de inversión que afirmen o hagan referencia a un rendimiento o a unos resultados exitosos pasados» «para crear una expectativa de resultados futuros similares.»
- «Ofertas de oportunidades de inversión que prometen retornos rápidos (p. ej., en menos de 24 horas).»
- «Ofertas para transformar una determinada suma de dinero en una suma mayor» «a través de un intercambio, una artimaña o una estrategia que mencione explícitamente promesas de» «“multiplicación de efectivo”, “multiplicación de dinero” o terminología similar.»

**Ofertas de empleo engañosas**
- «Ofertas de empleo que no contienen información sobre la empresa y las especificaciones del empleo,» «y que simplemente hacen referencia a las vacantes.»
- «Ofertas de trabajo desde casa, pero donde el cargo implique que el empleado no podrá trabajar desde casa.»
- «Ofertas de empleos con promesas anticipadas de salario.»
- «Ofertas de empleos asegurados.»
- «Ofertas de empleos que requieren que se pague un monto por adelantado antes de conseguir el puesto.»

Versión en inglés del mismo apartado (https://transparency.meta.com/policies/community-standards/prohibited-commercial-practices/): «Offers of opportunities of unrealistic financial reward for unclear or minimal effort.»; «partly or fully based on recruitment of others to participate in the scheme». **VERIFICADO.**

### 1.3 Otras normas de anuncios que tocan la Campaña A

- **Atributos personales** — https://transparency.meta.com/policies/ad-standards/objectionable-content/privacy-violations-personal-attributes/ : los anuncios no deben afirmar ni insinuar «vulnerable financial status» ni «Imply knowledge of personal or organizational financial information». Ejemplo prohibido: «Are you bankrupt? Check out our services.» Registro: «Today» y «Jun 27, 2024». **VERIFICADO.**
  *Consecuencia práctica (análisis):* el villano del proyecto («al día siguiente de que le entra la plata, ese dinero ya tiene dueño») funciona en un anuncio **solo narrado en tercera persona o como hecho general** («le pasa igual al que gana dos millones y al que gana más de veinte»). Dicho en segunda persona como pregunta («¿A usted no le alcanza?») cae de frente en este ejemplo.
- **Proceso de revisión** — https://transparency.meta.com/es-la/policies/ad-standards/ : «pueden revisarse componentes específicos de los anuncios, como imágenes, video, texto y datos de segmentación»; también «su página de destino u otros destinos relacionados con ellos»; «Nuestro sistema de revisión usa principalmente herramientas automatizadas». **VERIFICADO.**
- **Integridad de la cuenta** — https://transparency.meta.com/policies/ad-standards/business-assets/account-integrity/ : Meta restringe cuentas «that are used to egregiously or persistently violate our policies across any of our products». No publica cuántos rechazos llevan a restricción. **VERIFICADO** (y el umbral es desconocido).

### 1.4 ¿Puede correr un anuncio de una compañía multinivel legal en Colombia?

**Sí, en la política de anuncios**: el texto vigente no prohíbe la categoría y castiga tres patrones (recompensa irreal por poco esfuerzo, compensación por reclutamiento enmarcada como inversión, oferta de empleo engañosa). **VERIFICADO** en cuanto al texto; la aplicación real no la puedo medir sin la Biblioteca de anuncios.

**Pero el destino es otra norma.** La Política de Mensajes de WhatsApp Business — https://whatsappbusiness.com/policy/ («Last updated: September 23, 2026»), sección «4. Prohibited Organizations and Restrictions on Use»: «We prohibit use of WhatsApp for Business for buying, selling, promoting, or otherwise facilitating the exchange of» «certain regulated or restricted goods and services listed below, as determined in our sole discretion.» La lista incluye «Medical and healthcare products», «Business models, goods, items, or services that we determine may be or are fraudulent, misleading, offensive, or deceptive» y **«Multi-level marketing»**. Cierra: «These prohibitions apply irrespective of the global or local licenses, registrations, or other approvals your business may hold.» Las excepciones de la sección 5 (juegos de azar, medicamentos de venta libre, alcohol) **no incluyen el multinivel**. **VERIFICADO.**
La tipificación operativa — https://developers.facebook.com/documentation/business-messaging/whatsapp/policy-enforcement-violations — pone el multinivel como ejemplo de la infracción **MISLEADING**. **VERIFICADO.** Escalamiento — https://developers.facebook.com/documentation/business-messaging/whatsapp/policy-enforcement : primero una advertencia, luego bloqueos de plantillas de 1 o 3 días, bloqueos de todo envío de 5, 7 o 30 días, bloqueo indefinido y desactivación permanente. No dice qué conteo dispara cada nivel ni si MISLEADING es «grave». **VERIFICADO.**

*Análisis:* el WABA de Queswa ya opera en esa línea todos los días, porque los enlaces de los socios llevan allí. La pauta no crea el riesgo, pero lo vuelve visible y medible para Meta por tres vías: (1) un anuncio CTWA declara el número como destino de un mensaje de reclutamiento que revisa el sistema de anuncios; (2) la cuenta publicitaria vive en el mismo portafolio que el WABA (§3 del brief); (3) un público frío bloquea y reporta más que uno que llega por el enlace de un conocido, y la calidad del número es la palanca que Meta usa primero. Hay evidencia anterior en el repo (`docs/investigaciones/resultados/notas-naming-sep2026/renombrar_la_categoria.md` §4 y `SALUD_CLAIMS_META_WHATSAPP_SEP2026.md`); lo nuevo hoy es la fecha de la política (23 sep 2026) y que la política de anuncios ya no menciona el multinivel, así que **el filtro más duro está en el destino, no en el anuncio**.

### 1.5 Patrones de copy y de video que disparan rechazo (derivados del texto vigente; análisis)

| Patrón | Norma que lo toca |
|---|---|
| Cifras de ingreso, capturas de comisiones, «gane $X al mes» | Recompensa financiera irreal (Meta); afirmación de ingresos (FTC, DSSRC, ACOVEDI 3.5) |
| «Sin experiencia», «desde el celular en tus ratos libres», «solo comparte un enlace y gana» | «esfuerzo mínimo o poco claro» |
| «Gana por cada persona que invites», «arma tu equipo y cobra» | Compensación «total o parcialmente» por reclutamiento |
| «Invierte $X en tu paquete y recupéralo en N semanas» | Inversión con retorno rápido / resultados pasados |
| «Se busca personal», «vacantes», «empleo desde casa», «ingreso fijo» | Ofertas de empleo engañosas |
| «¿No te alcanza el sueldo?», «¿endeudado?» | Atributos personales: estado financiero vulnerable |
| Carros, viajes, fajos de billetes, casas | Estilo de vida (FTC P15, DSSRC §5); refuerza «recompensa irreal» |
| Anuncio limpio que lleva a una página o un chat que sí promete | Meta revisa «página de destino u otros destinos» |

**Casos reales aprobados en la Biblioteca de anuncios:** no pude consultarla (403 al lector y navegador ocupado). Sin censo propio, no afirmo qué tienen en común. Protocolo manual al final.

---

## Pregunta 2. ¿Hay que declarar categoría especial (empleo, servicios financieros)?

**No en Colombia. Y declararla perjudica.**

- Centro de Transparencia, Prácticas discriminatorias — https://transparency.meta.com/policies/ad-standards/unacceptable-content/discriminatory-practices/ : el requisito aplica a anunciantes de EE. UU. o que segmentan «the United States, Canada or certain parts of Europe»; las categorías son «financial products and services, housing or employment ads». No define «empleo» ni menciona oportunidades de negocio, contratistas independientes ni multinivel. Registro: «Today» y «Dec 20, 2024». **VERIFICADO.**
- Documentación de la API — https://developers.facebook.com/documentation/ads-commerce/marketing-api/audiences/special-ad-category.md : «**Businesses outside the U.S. and reaching audiences outside the U.S., Canada, and Europe**, where these restrictions currently apply, must also pass the Special Ad Category field, but can choose to opt-in or opt-out of audience restrictions. […] these businesses can either opt-out by indicating `NONE`…». **VERIFICADO.**
- Servicios financieros — https://transparency.meta.com/policies/ad-standards/restricted-goods-services/financial-services/ : cubre seguros, hipotecas, préstamos, «Investment products and opportunities» y tarjetas de crédito; no menciona oportunidades de negocio ni multinivel. **VERIFICADO.** *Análisis:* un anuncio que hable de «invertir» en un paquete acerca la pieza a esta categoría y a la de «inversión» de la norma comunitaria. En la Campaña A no se usa la palabra «inversión».
- Estados de WhatsApp — https://developers.facebook.com/documentation/ads-commerce/marketing-api/ads-in-whatsapp-status.md : «Special ad categories (Finance, Employment, Housing, and Social Issues/Elections/Politics) are not eligible for WhatsApp Status.» **VERIFICADO.**

**Ojo con la diáspora:** si un día la Campaña A segmenta a colombianos en EE. UU., la declaración pasa a ser obligatoria para financieros y la pregunta de si «distribuidor independiente» es «empleo» queda abierta (Meta no lo define en lo que pude leer). Para esa campaña haría falta una consulta aparte.

---

## Pregunta 3. Estructura con $20.000-$50.000 COP diarios

### Lo que dice la fuente primaria

- **Objetivos válidos para Click-to-WhatsApp** — https://developers.facebook.com/documentation/ads-commerce/marketing-api/ad-creative/messaging-ads/click-to-whatsapp.md : «Supported objectives are `OUTCOME_ENGAGEMENT`, `OUTCOME_LEADS`, `OUTCOME_SALES`, and `OUTCOME_TRAFFIC`.» Metas de optimización: Interacción → `CONVERSATIONS`, `LINK_CLICKS`; Ventas → `CONVERSATIONS`, `OFFSITE_CONVERSIONS`, `LINK_CLICKS`, `IMPRESSIONS`, `REACH`; Tráfico → …; **Clientes potenciales → solo `CONVERSATIONS`**. Facturación: `IMPRESSIONS`. `promoted_object` exige `page_id`. **VERIFICADO.**
- **Optimización por clientes potenciales y compras en mensajería (Ads Manager)** — https://whatsappbusiness.com/resources/resource-library/down-funnel-optimizations-whatsapp/ (página de WhatsApp, sin fecha; «© 2026»): para clientes potenciales, «Select Leads as the campaign objective»; para compras, «Select Sales or Engagement as your campaign objective»; «Once you've met the eligibility criteria, you'll see the option…». No define los criterios de elegibilidad ni dice si la optimización de clientes potenciales usa eventos de CAPI. Cifras de Meta: −24 % de costo por cliente potencial frente a optimizar por conversaciones (116 mil campañas, 4-10 nov 2024) y −10 % de costo por compra (H2 2024). **VERIFICADO** (son cifras de Meta sobre su propio producto, no de este nicho).
- **Fase de aprendizaje:** el umbral de ~50 eventos de optimización en 7 días tras la última edición importante lo repiten todas las fuentes secundarias; la página del Servicio de ayuda (https://www.facebook.com/business/help/112167992830700) no cargó. **NO VERIFICADO** en primaria. Hay reportes de 2026 de umbrales más bajos (25/semana en Advantage+ de compras) que tampoco pude confirmar.
- **Estados de WhatsApp** (ver pregunta 1 de la §5 más abajo): para `OUTCOME_LEADS` y `OUTCOME_ENGAGEMENT` aceptan `CONVERSATIONS`; requieren Historias de Instagram seleccionadas; formatos de imagen, video o carrusel; sin A/B ni DCO. **VERIFICADO.**

### Cuentas con el presupuesto (análisis; cifras de costo NO VERIFICADAS, ver pregunta 5)

- Tasa de referencia: unos 4.000 COP por dólar (supuesto, no verificado; Gano usa 4.500).
- 25.000 COP/día ≈ 175.000 COP/semana. Con 6.000-15.000 COP por conversación: **12 a 29 conversaciones por semana**. Con 50.000 COP/día: 23 a 58.
- Salir de aprendizaje por conversaciones (50/semana) exige unos 43.000-107.000 COP/día. **Con 25.000 COP/día la campaña va a quedar en «Aprendizaje limitado»**; eso no la apaga, pero la entrega es menos estable.
- Si el 5-15 % de las conversaciones pide la reunión 1-a-1, son **1 a 4 `LeadSubmitted` por semana**, y las vinculaciones, menos. Optimizar por esos eventos es imposible con este presupuesto, aunque Meta lo habilitara.

### Estructura recomendada (análisis)

- **Una campaña por público (A1 y A2), un solo conjunto de anuncios cada una, presupuesto en el conjunto.** Fragmentar en varios conjuntos divide eventos que ya son pocos.
- **Objetivo: Clientes potenciales**, destino mensajería y **meta «conversaciones»**. Clientes potenciales y no Interacción porque deja la puerta abierta a la optimización por clientes potenciales cuando Meta la habilite para la cuenta, sin rehacer la campaña. Si al crearla no aparece la opción de WhatsApp, Interacción → Conversaciones es equivalente.
- **Público: Advantage+ con la edad mínima fijada en lo que permita el control (28 años si deja; si no, 25) y Colombia.** Los intereses van como sugerencia, no como límite. El creativo es la segmentación (ver 5b).
- **Ubicaciones: Advantage+ (automáticas), comprobando que los Estados de WhatsApp aparezcan en las ubicaciones efectivas.** No hay que forzarlos: el número de Queswa ya es el destino, y en Estados el anuncio corre junto a Historias de Instagram.
- **Creativos: 3 por conjunto, no más.** Con 12-29 conversaciones semanales, cada creativo adicional le quita a los demás la poca señal que hay. Rotar uno nuevo cada 14 días, retirando el peor.
- **No declarar categoría especial** (`NONE`).

---

## Pregunta 4. Conversions API for Business Messaging

Fuente: https://developers.facebook.com/documentation/ads-commerce/conversions-api/business-messaging.md (leída el 6 nov 2026, sin fecha de actualización en la página). **Todo lo de este apartado es VERIFICADO salvo lo marcado.**

- **Para quién está escrita:** «This guide is designed to support Business Messaging Partners in completing the technical integration for the Conversions API for WhatsApp, Messenger or Instagram on behalf of their clients.» No dice que un anunciante directo no pueda hacerlo, y agrega: «Datasets are created either through a partner platform or directly on Events Manager. The business owns the dataset…».
- **Eventos aceptados** (lista de la página): Purchase, LeadSubmitted, InitiateCheckout, AddToCart, ViewContent, OrderCreated, OrderShipped, OrderDelivered, OrderCanceled, OrderReturned, CartAbandoned, **QualifiedLead**, RatingProvided, ReviewProvided. `QualifiedLead` está en la lista de Meta, no solo «según terceros».
- **Parámetros para WhatsApp con identificador de clic:** `action_source: "business_messaging"`, `messaging_channel: "whatsapp"`, `whatsapp_business_account_id` y `ctwa_clid`. Sin `ctwa_clid`: `page_id`, `whatsapp_business_account_id` y al menos un dato de cliente con hash. La página dice: «Upon receiving the ctwa_clid, store it with the conversation.» y «When a conversion has happened within a conversation, send the corresponding ctwa_clid via the Conversions API.» Y también: «Send ctwa_clid whenever you have it. It identifies the originating ad click directly, so it matches more reliably than hashed customer information and is not subject to the limits below.»
- **Ventana:** para el camino **sin** `ctwa_clid`, «It attributes an event to an ad interaction from the past seven days. A conversion you report after that is still accepted, but is not attributed.» Para el camino **con** `ctwa_clid`, la página no fija ventana (dice que no está sujeto a esos límites).
- **Permisos:** `whatsapp_business_management` y `whatsapp_business_manage_events`, y además el **«Marketing API Access Tier»** en nivel avanzado: «To be eligible for the Advanced Access feature, you need to make a total of 1500 successful Marketing API calls with an error rate of less than 10% in the past 15 days.» El aviso de la misma página dice que el umbral «has been reduced from 1,500 to **500**». La página es inconsistente.
- **Token:** «If you are integrated with Embedded Signup, we recommend you reuse the token generated from the Embedded Signup flow.» «Alternatively, you can use a Business Integration System User access token, a System User access token,» (o de usuario) con los permisos. **Un token de usuario del sistema propio sirve, según el texto.**
- **Optimización (FAQ):** «The Conversions API enables access to purchase optimization for ads that click to Messenger and ads that click to WhatsApp only». No menciona optimización por `LeadSubmitted` ni por `QualifiedLead`. No publica un umbral de eventos.
- **Detalle técnico:** «ctwa_clid is only available in the messages webhook on Biz API versions 2.45.1 and beyond» (aplica al API en sus instalaciones; el webhook de Queswa ya recibe el `ctwa_clid`, según el §3).

### ¿Es correcta la idea de la §6 (LeadSubmitted al pedir la reunión, Purchase al vincularse)?

Respuesta en análisis, con base en lo anterior:

- **`LeadSubmitted` cuando la persona pide la reunión 1-a-1: correcto como medición.** Es un hecho dentro del hilo y se ata al `ctwa_clid`.
- **Mejor añadir `QualifiedLead` cuando la reunión ocurre** (el socio la confirma en el Dashboard), porque separa al que pidió del que se sentó.
- **`Purchase` al vincularse: válido, pero con dos cuidados.** (1) La compra del paquete ocurre en Gano, no en el chat; la guía pide eventos que «represent interactions in the messaging thread». Si se manda, que sea cuando Queswa o el socio confirman la vinculación en el hilo. (2) `Purchase` es el único evento con optimización documentada, así que si algún día se optimiza por él, Meta va a buscar «gente que compra por chat», no «gente que construye». Con 1-3 vinculaciones al mes eso no va a pasar con este presupuesto.
- **Conclusión:** los tres eventos sirven para saber qué anuncio trae reuniones y vinculaciones, que es exactamente lo que Luis quiere enseñar. **No van a mover la entrega** con este volumen. El primer paso práctico es comprobar el nivel de acceso del app (el límite de 500/1.500 llamadas) mandando un evento de prueba en el Administrador de eventos.

---

## Pregunta 5. Costos reales 2025-2026 (Colombia y Latinoamérica)

**Ninguna de estas cifras es de Meta: Meta no publica tarifas de subasta.** Todas son NO VERIFICADAS (agencias o paneles de herramientas), con su moneda y su fuente.

| Métrica | Cifra | Moneda | Fuente | Nota |
|---|---|---|---|---|
| CPM Colombia, todas las industrias | media de 13 meses ~3,20; mínimo 1,70 (may 2026); 13,06 (jul 2026) | USD | Superads, https://www.superads.ai/facebook-ads-costs/cpm-cost-per-mille/colombia | Panel propio de la herramienta; la propia página se contradice en el período |
| CPM Colombia | ~2,00 | USD | Lebesgue (tabla del 27 jul 2026), vía búsqueda | Comercio electrónico |
| CPM Colombia | 1,80-3,00 Facebook; 2,50-4,00 Instagram | USD | Adligator 2026, vía búsqueda | Sin metodología |
| CPM Colombia | 7.000-18.000 (servicios jurídicos y financieros: 14.000-30.000) | COP | Alejandro Verjel, 16 ago 2026, https://www.alejandroverjel.com/blog/facebook/cuanto-cuesta-publicidad-facebook-instagram-colombia/ | Sin muestra ni período |
| CPC Colombia | ~0,22 (media); 0,12-0,86 | USD | Superads, https://www.superads.ai/facebook-ads-costs/cpc-cost-per-click/colombia | |
| Costo por conversación iniciada en WhatsApp | 3.500-18.000 | COP | Verjel (misma URL) | Rango general, no de este nicho |
| Costo por conversación | 320-346 (ropa infantil) | COP | Agencia citada en búsqueda | Sector muy distinto; no extrapolar |
| Costo por cliente potencial, formulario instantáneo | 6.000-30.000 | COP | Verjel | |
| Costo por cliente potencial, página propia | 12.000-60.000 | COP | Verjel | |
| Costo por cliente potencial, Colombia | media 10,78; 2,30-50,29 | USD | Superads, https://www.superads.ai/facebook-ads-costs/cost-per-lead/colombia | Volatilidad enorme en 2026 |
| Costo por cliente potencial, global/EE. UU. | 27,39-27,66 | USD | WordStream vía terceros | No sirve para Colombia |

**Nicho de oportunidad de ingreso o venta directa en Latinoamérica: no encontré ninguna cifra.** Ni en español ni en inglés hay un panel que separe esta categoría. Cualquier número que se presente como «costo por cliente potencial de multinivel en Colombia» sale de una agencia sin metodología.

*Análisis:* espero que la Campaña A quede en la franja alta de CPM (cercana a «servicios financieros», 14.000-30.000 COP), porque compite por el mismo adulto de 28-55 años con interés en negocios. Para planear, uso 6.000-15.000 COP por conversación y lo corrijo con los datos de la primera semana.

**Costo de los mensajes después del clic** — https://developers.facebook.com/docs/whatsapp/pricing : la ventana gratuita del punto de entrada «may remain open for up to 7 days» si se responde dentro de la ventana de servicio, y mientras está abierta «Meta does not charge for marketing, utility, authentication or service messages» (sí cobra los mensajes de «Meta Business Agent»). Desde el 1 oct 2026 se cobra el servicio a partir del mensaje 1.001 del mes por número. **VERIFICADO.** La §5 habla de 72 horas; el texto vigente dice hasta 7 días.

---

## Pregunta 5b. Los dos públicos

### Segmentación

- **Lo verificado:** Meta tiene una API de búsqueda de intereses que marca cada opción como `NORMAL`, `NON-DELIVERABLE` o `DEPRECATING` (https://developers.facebook.com/documentation/ads-commerce/marketing-api/audiences/reference/targeting-search.md). **VERIFICADO.** Sin token no pude consultarla.
- **Lo reportado por terceros:** desde junio de 2025 Meta fusionó intereses de nicho en grupos amplios, y los conjuntos que usaban opciones retiradas dejaron de entregar el **15 de enero de 2026**; también desaparecieron las exclusiones por segmentación detallada. **NO VERIFICADO.**
- **Si existen hoy «network marketing», «venta directa», «emprendimiento», «franquicias»: NO VERIFICADO.** Se resuelve en cinco minutos con una llamada de solo lectura, con un token que tenga `ads_read`:
  `GET https://graph.facebook.com/v24.0/search?type=adinterestvalid&interest_list=["Network marketing","Multi-level marketing","Direct selling","Entrepreneurship","Franchising","Gano Excel"]`
  (o escribiendo cada término en «Segmentación detallada» del Administrador de anuncios; el que no sugiere nada ya no existe).
- **¿Advantage+ con un creativo que filtra solo?** Análisis: sí, y no por fe en el algoritmo sino por aritmética. Con 12-29 conversaciones por semana, un interés estrecho encarece el CPM sin dar volumen para comparar. El primer renglón del anuncio hace la segmentación: le habla a uno y el otro sigue de largo.

### Mensaje

**A1, público frío (nunca estuvo en la industria).**
- Primera línea: el mecanismo, no el resultado. Ejemplo dentro del léxico del proyecto: *«Una empresa de distribución moderna: un fabricante que produce y despacha, un enlace que usted comparte y una asistente que atiende a cada interesado.»*
- ¿Nombrar a Gano Excel? **No en el gancho; sí dentro del mismo anuncio o en el primer mensaje del chat.** La FTC (Q21, abril 2024) dice que se debe ser «candid and upfront with potential recruits about the type of opportunity being offered» y que hacer invertir tiempo antes de saber eso es «manifestly unfair and deceptive» — https://www.ftc.gov/business-guidance/resources/business-guidance-concerning-multi-level-marketing (**VERIFICADO**, norma de EE. UU.). ACOVEDI (§3.3) exige a la compañía «información comercial exacta y completa relacionada con la oportunidad» (**VERIFICADO**, ver abajo). El orden del proyecto («Gano al final») cabe dentro de una pieza, siempre que la persona sepa quién fabrica antes de comprometer tiempo. El cuerpo del anuncio de A1 debe decir que se gana un porcentaje de las **compras** de los clientes (ejemplos en compras, nunca en personas), lo que además lo aleja de la viñeta de «compensación por reclutamiento».
- No usar: «inversión», «empleo», «vacante», «sin experiencia», «desde el celular», cifras de dinero.

**A2, público de la industria (conoce el network marketing o a Gano).**
- Primera línea: lo que cambió en la forma de trabajar, no la compañía. Ejemplo: *«Si alguna vez pensó en Gano Excel y lo frenó tener que explicarlo todo usted mismo: hoy la explicación la hace una asistente, y usted trabaja directamente con un Diamante con 12 años en la compañía.»*
- El gancho es la herramienta y el acompañamiento («trabajar con un Diamante y con su tecnología»), no la promesa.

### El rango en el anuncio

- **Meta:** el texto vigente no menciona rangos. La viñeta que más se acerca es la de inversión: «hagan referencia a un rendimiento o a unos resultados exitosos pasados para crear una expectativa de resultados futuros similares». **VERIFICADO.** *Análisis:* «Diamante, 12 años» presentado como **quién habla** no crea esa expectativa; «cómo llegué a Diamante (y usted también puede)» sí la crea.
- **FTC, abril 2024** (misma URL): advierte contra sugerir «achieving a particular rank, unless that result is in fact typical» (P23) y contra implicar que llegar a un rango toma cierto número de años (P24); los testimonios de quienes ganan mucho son atípicos y exigen revelar el resultado típico (P13); el estilo de vida rico es una afirmación implícita (P15). **VERIFICADO.**
- **DSSRC (BBB National Programs), Guía sobre afirmaciones de ingresos, 2022** (https://assets.bbbprograms.org/docs/default-source/dssrc/dssrc_guidanceonearningsclaimsforthedirectsellingindustry.pdf): cuentan como afirmación de ingresos, entre otras, «(F) that salesforce members may earn or have earned company-sponsored incentives…» y «(G) endorsements or testimonials by independent salesforce members… made to promote the business opportunity»; §8: «An award or announcement of compensation describing the earnings of any current or former salesforce member may be considered an earnings claim»; §6 prohíbe «quit your job», «full-time income», «replacement income» y marca de alto riesgo «financial freedom» y «time freedom». **VERIFICADO** (autorregulación de EE. UU.).
- **Conclusión:** «Diamante» y «12 años» pueden ir en A2 **como credencial de experiencia**, sin dinero, sin estilo de vida, sin plazo y sin invitar a alcanzarlo. Lo que no se puede verificar desde aquí es si el manual de políticas de Gano Excel restringe el uso del título de rango en publicidad pagada: hay que preguntarlo.

**Cómo pautan los líderes de venta directa en Latinoamérica:** no encontré ningún caso documentado en fuentes públicas, y la Biblioteca de anuncios no se pudo consultar. **Sin dato.** Ver el protocolo manual.

### La frontera: atraer networkers de otras compañías

- **ACOVEDI, Código de Ética 2026** (copia publicada por Yanbal: https://info01.yanbal.com/yanbal/CO/codigo_de_etica_ACOVEDI_2026.pdf), **VERIFICADO**:
  - §4.2 Competencia desleal: «Los medios o sistemas dirigidos a desorganizar internamente una empresa competidora en el sistema de venta directa o a obtener sus secretos»; «Los medios o sistemas encauzados a obtener la desviación de la clientela de cualquiera de las compañías de venta directa, siempre que sean contrarios a las costumbres comerciales»; «Las maquinaciones reiteradas tendientes a privar a un competidor de sus técnicos o empleados de confianza…».
  - §3.2 Incorporación: «no podrán emplear prácticas engañosas o injustas de incorporación o ingreso».
  - §3.4: «Los vendedores independientes no recibirán ganancias basadas únicamente por el ingreso o incorporación de otros vendedores independientes».
  - §3.5: los potenciales vendedores deben «Ser informados sobre el hecho de que las ganancias y ventas actuales variarán de persona a persona…».
  - §2.7: los vendedores no pueden usar «afirmaciones o testimonios o promesas verbales que no hayan sido autorizados por las compañías».
  - El código obliga a las **compañías afiliadas**; los vendedores independientes no están obligados directamente.
- **Ley 256 de 1996, art. 17** (texto leído en https://leyes.co/se_dictan_normas_sobre_competencia_desleal/17.htm, versión no oficial): es desleal inducir a trabajadores, proveedores, clientes y demás obligados a infringir sus «deberes contractuales básicos» con los competidores; inducir la terminación regular de un contrato solo es desleal si se hace a sabiendas y con fines de expansión de un sector o con engaño o intención de eliminar a un competidor. **VERIFICADO en fuente secundaria del texto legal**; la Secretaría del Senado y Función Pública no cargaron.
- **Código del DSA de EE. UU.:** excluye las disputas por «proselytizing» o «seller raids» salvo que haya conducta engañosa (vía búsqueda; NO VERIFICADO en el original).
- **Política de Gano Excel sobre patrocinio cruzado:** no es pública. Las comparables (USANA, LifeVantage, SeneGence) prohíben el *cross-sponsoring* dentro de la misma compañía y muchas prohíben a su distribuidor reclutar para otra (NO VERIFICADO para Gano).
- **Cómo se escribe A2 sin la silueta de «robar equipo» (análisis):** (1) se dirige a quien *conoce* la industria o *pensó alguna vez* en Gano, no a quien está activo en otra; (2) no nombra ni compara otras compañías (ACOVEDI §2.8 prohíbe denigrar); (3) no dice «trae a tu equipo», «cámbiate», «¿no te paga tu compañía?»; (4) el gancho es una manera de trabajar, no una oferta mejor; (5) Queswa pregunta, sin juzgar, si la persona está vinculada hoy a Gano o a otra compañía, y si es distribuidora activa de Gano aplica la regla ya vigente (caso Aldo: no se le vende paquete y se avisa a Luis).

### Intención de búsqueda (Google Ads o YouTube)

- **Volumen y costo por clic de «distribuidor Gano Excel», «negocio con Gano Excel» o «negocio de distribución» en Colombia: sin dato.** No hay fuente pública; requiere el Planificador de palabras clave. Referencia general, NO VERIFICADA: CPC medio de Google en Colombia de 0,58 USD (Merca2.0).
- **Política de Google:** la regla de «Unreliable claims» prohíbe «claims that entice the user with an improbable result (even if this result is possible)» — https://support.google.com/adspolicy/answer/6020955 . No menciona el multinivel. **VERIFICADO.**
- *Análisis:* quien busca «distribuidor Gano Excel» ya tiene la intención que Meta tiene que crear, pero es un volumen pequeño y puede que ya tenga quien lo patrocine (la frontera de arriba). Vale la pena **solo si el Planificador muestra más de unas pocas centenas de búsquedas al mes**. En ese caso: una campaña de búsqueda con tope de 10.000-15.000 COP/día, y una página de destino que diga quién es Luis y lleve a Queswa web. No antes de tener la Campaña A midiendo.

---

## Pregunta 6. Audiencia fría frente a tibia, y qué formato

### Audiencias de video

- Documentación de audiencias personalizadas por interacción — https://developers.facebook.com/documentation/ads-commerce/marketing-api/audiences/guides/engagement-custom-audiences.md : «Currently supported audience types include Page, Instagram business profile, Lead ads, Instant Experience ads, Shopping, and augmented reality.» Fuentes: `page`, `ig_business`, `lead`, `ig_lead_generation`, `canvas`, `shopping_page`, `shopping_ig`, `ar_experience`, `ar_effects`. «**Instagram Media Creator type is currently not supported for video engagement custom audience creation.**» Retención máxima: Página 730 días, perfil de empresa de Instagram 730 días. **VERIFICADO.**
- El perfil personal ni el «modo profesional» aparecen como fuente. Los blogs coinciden en que el modo profesional no da acceso al Administrador de anuncios ni a audiencias personalizadas (NO VERIFICADO).
- **Conclusión:** sí conviene publicar los videos del reto **también** en la Página «Crea Tu Activo» y en una cuenta de Instagram **de empresa** (no de creador). Así, quien vio el 50 % de un video del reto se convierte en público tibio para A2 y en público de exclusión para A1. Para A2, donde pesa la reputación de Luis, vale considerar una Página a nombre de Luis Cabrejo como identidad del anuncio (análisis).

### ¿Qué rinde: fundador a cámara, testimonios o explicación del modelo?

- **No encontré evidencia primaria de esta categoría.** Las guías de creativo de Meta que circulan (vertical 9:16, los primeros 3 segundos, subtítulos) vienen de terceros. NO VERIFICADO.
- **Límites a los testimonios:** la política de anuncios vigente no tiene una regla propia de testimonios para oportunidades de negocio; los tocan «respaldos no autorizados» (Meta), la afirmación de ingresos (FTC P13, DSSRC 2(G)) y ACOVEDI §2.7 (testimonios autorizados por la compañía). **VERIFICADO** en cada fuente.
- *Análisis, para decidir:*
  - **A2:** Luis a cámara, 30-60 s, explicando *cómo trabaja hoy* (la asistente que explica, el enlace, Gano que despacha y paga). Es la credencial que A2 compra y no requiere testimonios.
  - **A1:** la explicación del modelo con imagen (el material de la Presentación en video ya existe), con Luis presente pero sin ser el titular: A1 primero tiene que ver la plataforma.
  - **Testimonios:** solo de experiencia («lo que me cambió fue no tener que explicar»), sin dinero, sin rango y sin estilo de vida, y con autorización de Gano. En la primera ronda los dejaría fuera: suman riesgo y no hay volumen para medirlos contra los otros dos.

---

## Dónde la §5 se equivoca o se queda corta

1. **«Resultados poco realistas» exige describir el modelo y prohíbe el multinivel» — desactualizado.** Esa página da 404 y el índice vigente ya no la tiene. El texto que rige es la Norma comunitaria de Prácticas comerciales prohibidas (registro del 29-30 oct 2026), que **no nombra el multinivel** ni exige «describir por completo». Prohíbe la recompensa irreal por esfuerzo mínimo, la compensación por reclutamiento enmarcada como inversión y las ofertas de empleo engañosas. La §5 apunta a un riesgo que ya no está escrito así y no ve los que sí lo están.
2. **Falta lo más grave: la Política de Mensajes de WhatsApp.** Prohíbe «Multi-level marketing» (23 sep 2026) en cualquier uso de WhatsApp for Business, con independencia de licencias, y la tipifica como MISLEADING. La §5 toma el CTWA hacia Queswa como destino obvio de la Campaña A sin pesar ese riesgo.
3. **CAPI: correcta en eventos y permiso, corta en lo que importa.** `QualifiedLead` está en la lista oficial (no solo «según terceros»). Falta: la guía es para socios tecnológicos; exige el *Marketing API Access Tier* avanzado (500-1.500 llamadas en 15 días); la única optimización documentada es la de **compras**; para Clientes potenciales con WhatsApp la API solo lista `CONVERSATIONS`; la ventana de 7 días aplica al camino sin `ctwa_clid`. Y con este presupuesto, ningún evento de CAPI llega al volumen para optimizar.
4. **Audiencias de video: la hipótesis se confirma, con un agregado.** Una cuenta de Instagram de **creador** tampoco sirve: tiene que ser de empresa.
5. **Estados de WhatsApp «desde febrero de 2026 en todo el mundo»:** la disponibilidad global (salvo UE, Reino Unido y países sancionados) está confirmada en la documentación; la fecha de febrero solo la da la prensa. Faltan las condiciones: exige Historias de Instagram, no corre solo, no admite categorías especiales y no admite pruebas A/B ni creativo dinámico.
6. **No contestó si aplica categoría especial.** No aplica en Colombia, y declararla quita los Estados de WhatsApp.
7. **Ventana gratuita (de la Campaña B, pero toca el costo de A):** el texto vigente de Meta dice «up to 7 days», no 72 horas.

---

## Recomendación concreta

Supuestos comunes: cuenta nueva, sin píxel; presupuesto total de **50.000 COP/día** (25.000 por público). Si el total es 20.000-30.000, **A2 va primero sola 14 días** y A1 después, porque A2 convierte con menos dinero y da la primera señal. Los umbrales son de mi análisis, calibrados con los rangos de costo de arriba; se corrigen con la primera semana real.

**Antes de gastar un peso (las dos campañas):**
- Comprobar en el Administrador de anuncios que la cuenta permite Clientes potenciales → mensajería → WhatsApp con la Página «Crea Tu Activo» y el 321.
- Registrar en Queswa, por cada `ctwa_clid`: mensajes del usuario, si pidió el 1-a-1, si hubo reunión y si se vinculó. Ya se guardan el `ctwa_clid` y el `ad_id`; falta el tablero.
- Enviar un evento de prueba de CAPI (`LeadSubmitted`) para saber si el app tiene el nivel de acceso.
- Anotar la **calidad del número 321** el día 0. Es la alarma número uno.
- Decisión que es de Luis, no mía: aceptar o no exponer el 321 a pauta de reclutamiento (pregunta 1.4). Si no lo acepta, la alternativa es poner el destino en la web (`/servilleta` con Queswa web) e instalar píxel y CAPI web, sabiendo que en el celular el puente igual lleva a WhatsApp, y que en esa ruta se pierde el `ctwa_clid`.

### A2 — público de la industria

| Elemento | Decisión |
|---|---|
| Objetivo | Clientes potenciales; destino mensajería → WhatsApp (321); meta: maximizar conversaciones |
| Presupuesto | 25.000 COP/día, un conjunto, 14 días sin tocar (salvo apagado) |
| Público | Colombia, Advantage+, edad mínima en el máximo que permita el control; como sugerencia, los intereses que existan («Network marketing», «Venta directa», «Gano Excel», a verificar); cuando exista, el público de quienes vieron el 50 % de los videos del reto en la Página |
| Ubicación | Advantage+; comprobar que Estados de WhatsApp esté en las efectivas |
| Creativos | 3 videos verticales de Luis a cámara, 30-45 s: (1) «la explicación la hace una asistente»; (2) «12 años, Diamante: cómo trabajo hoy»; (3) «si alguna vez pensó en Gano Excel». Sin cifras, sin estilo de vida, sin otras compañías |
| Texto precargado | «Hola Queswa, vengo del anuncio de Luis» (atribuye a Luis) |
| Evento que se mide | Conversación → mensajes del usuario ≥3 → `LeadSubmitted` (pide el 1-a-1) → `QualifiedLead` (reunión hecha) → `Purchase` (vinculación) |
| Día 7 (~175.000 COP) | **Seguir** si costo por conversación ≤10.000 COP, ≥40 % de conversaciones con ≥3 mensajes del usuario, ≥1 `LeadSubmitted`, cero rechazos y calidad del 321 sin cambio. **Cambiar** el creativo peor si el costo por conversación está entre 10.000 y 20.000 o el engagement es menor al 25 %. **Apagar ya** si llega una advertencia de política al WABA, si la calidad baja de Alta o si un anuncio se rechaza dos veces por lo mismo |
| Día 14 (~350.000 COP) | **Seguir** (y subir 20 % por semana) si hay ≥3 `LeadSubmitted` (≤120.000 COP cada uno) y ≥1 reunión hecha. **Cambiar** el mensaje si hay conversaciones baratas pero ≤1 solicitud (falla el ajuste entre mensaje y público, o el recorrido de Queswa). **Apagar** si hay <2 solicitudes y el costo por conversación supera 15.000 |

### A1 — público frío

| Elemento | Decisión |
|---|---|
| Objetivo | Clientes potenciales → WhatsApp (321), meta conversaciones. **Alternativa más prudente para el número:** Tráfico/Clientes potenciales hacia `/servilleta` con píxel y CAPI web (evento personalizado al tocar «Abrir Queswa» o al abrir el chat web). Es la opción que pide el propio brief («primero la plataforma») y le baja al 321 los bloqueos del público frío |
| Presupuesto | 25.000 COP/día, un conjunto, 14 días |
| Público | Colombia, 28-55 en lo que permita el control, Advantage+ sin intereses (o «Emprendimiento» como sugerencia si existe); excluir a quienes ya escribieron a Queswa y a quienes vieron los videos del reto |
| Ubicación | Advantage+ |
| Creativos | 3: (1) la Presentación en video recortada a 30-45 s (los tres elementos); (2) Luis explicando el mecanismo en una frase, con el villano narrado en tercera persona; (3) imagen o carrusel de los tres elementos. Gano Excel nombrado en el cuerpo del anuncio, como quien fabrica y paga |
| Evento que se mide | Conversación (o visita a `/servilleta` y apertura de Queswa) → ≥3 mensajes → `LeadSubmitted` |
| Día 7 (~175.000 COP) | **Seguir** si costo por conversación ≤15.000 COP (o costo por apertura de Queswa desde la web ≤20.000) y ≥30 % de conversaciones con ≥3 mensajes. **Cambiar** si el costo está bien pero el engagement queda <20 % (el anuncio atrae curiosos, no interesados). **Apagar ya** con las mismas alarmas del 321 que A2, y además si los bloqueos o reportes del número suben de forma visible |
| Día 14 (~350.000 COP) | **Seguir** si hay ≥2 `LeadSubmitted` (≤175.000 COP cada uno). **Cambiar** a la ruta web si el CTWA trae conversaciones que no pasan del primer mensaje. **Apagar** si hay 0 solicitudes con >25 conversaciones: A1 necesita más contenido tibio antes de pauta |

---

## Protocolo manual para la Biblioteca de anuncios (Campaña A)

En https://www.facebook.com/ads/library/ → País: Colombia (repetir con México y Perú) → Todos los anuncios → Activos. Búsquedas: «negocio Gano Excel», «distribuidor Gano», «network marketing», «venta directa», «únete a mi equipo», «multinivel», «emprendimiento desde casa», «Diamante» + nombre de compañías de venta directa. Por cada anuncio de un líder (no de producto), anotar: anunciante (Página de persona, de marca o de equipo), fecha de inicio (sobrevivencia), formato (video a cámara, entrevista, transmisión, invitación a reunión, carrusel), destino (WhatsApp, Messenger, web, formulario), si menciona dinero, rango, años o estilo de vida, y si nombra la compañía. Con 20-30 anuncios se ve qué patrón sobrevive más de 30 días.

---

## Fuentes primarias leídas el 6 nov 2026

- https://transparency.meta.com/policies/ad-standards/ y /es-la/
- https://transparency.meta.com/policies/ad-standards/deceptive-content/prohibited-commercial-practices/
- https://transparency.meta.com/policies/community-standards/prohibited-commercial-practices/ y /es-la/
- https://transparency.meta.com/policies/ad-standards/fraud-scams/unacceptable-business-practices/
- https://transparency.meta.com/policies/ad-standards/deceptive-content/unrealistic-outcomes (404)
- https://transparency.meta.com/policies/ad-standards/objectionable-content/privacy-violations-personal-attributes/
- https://transparency.meta.com/policies/ad-standards/unacceptable-content/discriminatory-practices/
- https://transparency.meta.com/policies/ad-standards/restricted-goods-services/financial-services/
- https://transparency.meta.com/policies/ad-standards/restricted-goods-services/health-wellness/
- https://transparency.meta.com/policies/ad-standards/business-assets/account-integrity/
- https://whatsappbusiness.com/policy/ (Política de Mensajes de WhatsApp Business, 23 sep 2026)
- https://developers.facebook.com/documentation/business-messaging/whatsapp/policy-enforcement-violations
- https://developers.facebook.com/documentation/business-messaging/whatsapp/policy-enforcement
- https://developers.facebook.com/documentation/ads-commerce/conversions-api/business-messaging.md
- https://developers.facebook.com/documentation/ads-commerce/marketing-api/ad-creative/messaging-ads/click-to-whatsapp.md
- https://developers.facebook.com/documentation/ads-commerce/marketing-api/ads-in-whatsapp-status.md y /whatsapp-identity
- https://developers.facebook.com/documentation/ads-commerce/marketing-api/audiences/special-ad-category.md
- https://developers.facebook.com/documentation/ads-commerce/marketing-api/audiences/guides/engagement-custom-audiences.md
- https://developers.facebook.com/documentation/ads-commerce/marketing-api/audiences/reference/targeting-search.md
- https://developers.facebook.com/docs/whatsapp/pricing
- https://whatsappbusiness.com/resources/resource-library/down-funnel-optimizations-whatsapp/
- https://whatsappbusiness.com/es-la/whatsapp-ads/
- https://about.fb.com/news/2025/06/helping-you-find-more-channels-businesses-on-whatsapp/
- https://www.ftc.gov/business-guidance/resources/business-guidance-concerning-multi-level-marketing (abril 2024)
- https://assets.bbbprograms.org/docs/default-source/dssrc/dssrc_guidanceonearningsclaimsforthedirectsellingindustry.pdf (2022)
- https://info01.yanbal.com/yanbal/CO/codigo_de_etica_ACOVEDI_2026.pdf
- https://leyes.co/se_dictan_normas_sobre_competencia_desleal/17.htm (Ley 256 de 1996, art. 17; copia no oficial)
- https://support.google.com/adspolicy/answer/6020955

No cargaron: Servicio de ayuda de Meta (fase de aprendizaje, categorías especiales), Biblioteca de anuncios (403), Internet Archive (fuera de servicio), Secretaría del Senado y Función Pública (error de conexión o de certificado).
