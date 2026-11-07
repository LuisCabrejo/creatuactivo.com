# Investigación: campañas pagadas en Meta para un equipo de Gano Excel en Colombia
### 6 de noviembre de 2026 · de Luis Cabrejo (Director de CreaTuActivo) y Claude Code

---

## 1. La tarea, en una línea

Necesitamos diseñar **campañas pagadas en Meta** (Facebook, Instagram y WhatsApp) y queremos su investigación independiente antes de gastar:

- **Campaña A, nuevos socios para la plataforma:** personas que terminen construyendo con nosotros. Partimos de una premisa: casi nadie busca «ser distribuidor de Gano Excel» ni «entrar a un network marketing». Lo que ofrecemos es una plataforma para construir un activo, una empresa de distribución moderna que funciona en todo el continente. Gano Excel es el fabricante que la respalda y se nombra al final, nunca como titular. Hay dos públicos distintos, con mensajes distintos:
  - **A1, el público frío:** personas inteligentes para los negocios, que buscan oportunidades, modelos de distribución o una segunda empresa, sin pasado en la industria. Primero ven la plataforma y el modelo; la compañía, después.
  - **A2, el público de la industria:** personas que ya conocen el network marketing o a Gano Excel, que alguna vez pensaron en afiliarse y solo les falta un empujón, y networkers de otras compañías. Para ellos pesa la reputación de Luis: 12 años, rango Diamante en Gano Excel y la posibilidad de trabajar directamente con un Diamante y con su tecnología.
- **Campaña B, catálogo de productos:** clientes que compren café y productos Gano Excel por WhatsApp.

**El propósito:** Luis va a hacer la prueba en persona, con su propio dinero, para después enseñarles a sus distribuidores qué mensajes funcionan y qué errores evitar. Lo que salga de aquí se va a duplicar en muchas cuentas, así que necesitamos el panorama real, no el teórico.

**La paradoja que debe explicar (§6, bloque C):** Facebook e Instagram están llenos de anuncios pagados de Ganocafé 3 en 1 y otros productos con Ganoderma que afirman que ayudan contra la diabetes, la artritis o el cáncer, y algunos casi prometen la inmortalidad. Mientras tanto, nosotros ni siquiera decimos que ayuda con un resfriado. **No queremos copiar esas afirmaciones**: no son necesarias ni correctas. Pero si Meta y el INVIMA las dejan correr por miles, necesitamos saber cuál es el riesgo real y no solo el que está escrito en la norma. Una investigación que solo cita la norma nos deja maniatados frente a un mercado que no la cumple.

Claude Code ya hizo una primera investigación (sus hallazgos están en §5). **No queremos que la confirme: queremos que la contraste, la refute donde tenga base y encuentre lo que nos falta.** Marque cada dato como **VERIFICADO** (leído en la fuente primaria, con URL y fecha) o **NO VERIFICADO** (blog, agencia, prensa). Los blogs de agencias no cuentan como política de Meta.

---

## 2. Quiénes somos (contexto que necesita)

- **Gano Excel** es una empresa de venta directa de origen malasio con más de 30 años y presencia en más de 60 países. En Colombia opera bajo la Ley 1700 de 2013 (venta multinivel), con registros INVIMA. Fabrica cafés, tés, chocolates y cápsulas con Ganoderma, además de productos de cuidado personal. Paga semanalmente a sus distribuidores.
- **CreaTuActivo** es el equipo de Luis Cabrejo dentro de Gano Excel: 12 años en la actividad y miles de personas en su organización. Su propuesta es una **empresa de distribución moderna** con tres elementos: el fabricante (Gano Excel produce, despacha y paga), una máquina de ventas (el distribuidor comparte su enlace; quien llega conoce y compra) y una herramienta para multiplicar.
- **Queswa** es nuestro agente de inteligencia artificial. Atiende a los prospectos por WhatsApp (API oficial de WhatsApp Business, número +57 321 519 3909) y en la web (creatuactivo.com). Conversa, explica el modelo, madura la decisión y, cuando la persona está lista, la pasa a una reunión 1-a-1 con su distribuidor. También recibe pedidos del catálogo web.
- **Público:** colombianos de clase media, empleados e independientes de 28 a 55 años. El tono es de firma de inversión, no de «oportunidad de negocio». En nuestro copy están vetados «ingreso pasivo», «libertad financiera», «sé tu propio jefe», «oportunidad de negocio» y cualquier promesa de ingreso.
- **El contenido actual:** un reto de 90 días en video (vamos en el día 58). Luis publica videos de 2 a 3 minutos **en su perfil personal de Facebook**, no en la Página de la empresa.

## 3. Lo que ya está montado (verificado en nuestro código y en nuestra cuenta)

- **Cuenta publicitaria nueva**, sin historial, en el portafolio comercial donde también vive la cuenta de WhatsApp Business API de Queswa. Los anuncios salen a nombre de la Página «Crea Tu Activo».
- **Click-to-WhatsApp (CTWA):** el webhook de Queswa ya detecta los mensajes que llegan de un anuncio (objeto `referral`) y **guarda el `ctwa_clid` y el `ad_id`** de cada prospecto.
- **Atribución por texto precargado:** si el primer mensaje dice *«Hola Queswa, vengo del enlace de luis-cabrejo»*, el prospecto queda asignado a ese distribuidor.
- **Catálogo web** `creatuactivo.com/productos/{distribuidor}`: es una tienda para el cliente final. El pedido sale **por WhatsApp hacia Queswa**, que lo registra y avisa al distribuidor.
- **El sitio no tiene píxel de Meta** ni maneja `fbclid`. Hoy no hay ninguna señal de conversión que vuelva a Meta.
- **Números de WhatsApp:** +57 321 519 3909 es Queswa (API). +57 320 680 5737 es la app WhatsApp Business de Luis, que atiende él a mano y tiene su propio catálogo dentro de la app. **No se migra a la API.**

## 4. Restricciones que no son negociables (y por qué)

1. **Ninguna promesa de ingreso** (cifras, fechas, garantías, «de por vida», reemplazar el salario). Lo exigen el Estatuto del Consumidor (Ley 1480), la Ley 1700 y las Normas de publicidad de Meta.
2. **Ninguna declaración de salud** fuera de las aprobadas: nada de enfermedades, adelgazamiento, «cura», «previene» ni mecanismos. El producto se vende por lo sensorial y el ritual.
3. **Los ejemplos se cuentan en compras, nunca en personas que hay que conseguir.** Nada con silueta de pirámide.
4. **Un anuncio rechazado le cuesta a una cuenta nueva.** Preferimos aprobar con margen que probar el límite.

## 5. Lo que encontró Claude Code (para contrastar)

**Campaña A, distribuidores:**
- La política de Meta sobre resultados poco realistas exige que un anuncio de oportunidad de ingreso **describa por completo el producto o el modelo de negocio** y prohíbe los modelos de «compensación rápida por poca inversión, incluido el marketing multinivel». Fuente: transparency.meta.com/policies/ad-standards/deceptive-content/unrealistic-outcomes. No pudimos confirmar si la redacción cambió en 2026.
- El objetivo **Interacción → WhatsApp** optimiza para personas que *escriben*, no para personas que *se vinculan*. Existe la **Conversions API for Business Messaging**, que permite devolverle a Meta eventos como `LeadSubmitted` y `Purchase` (más `QualifiedLead`, según terceros) atados al `ctwa_clid`, con `action_source: business_messaging`. Requiere el permiso `whatsapp_business_manage_events`.
- Las audiencias personalizadas de quienes vieron un video solo se pueden armar con videos de una **Página** o de una cuenta profesional de Instagram, no de un perfil personal. *Hipótesis nuestra, por verificar.*
- Desde febrero de 2026 hay anuncios en los **Estados de WhatsApp** (pestaña Novedades) en todo el mundo.

**Campaña B, catálogo:**
- En Colombia, **la publicidad de un suplemento dietario requiere aprobación previa del INVIMA** (Decreto 3249 de 2006, art. 24, vigente en la práctica de 2026). Tres productos de Gano están registrados como suplemento dietario (SD): Ganocafé 3 en 1, Ganocafé Clásico y Cápsulas de Ganoderma. Los otros doce (bebidas y cápsulas) son alimento (NSA), y los seis de cuidado personal son cosméticos (NSOC).
- **Precedente:** en 2015 el INVIMA abrió un proceso sancionatorio (201500495) por publicidad de Ganocafé 3 en 1 en Facebook y YouTube de un distribuidor, «sin autorización previa» y con propiedades terapéuticas. Se archivó en 2021 porque no logró identificar al responsable. El distribuidor que pauta es «anunciante» ante la Ley 1480.
- Desde 2025, Meta **restringe la optimización de bajo embudo** (compras, añadir al carrito) para anunciantes que clasifica como de «salud y bienestar». Solo encontramos fuentes secundarias, sin detalle para Colombia.
- **Precios de WhatsApp:** desde el 1 de octubre de 2026 las respuestas de servicio se cobran (Colombia, ~US$0,0008 por mensaje), pero la **ventana de 72 horas de un anuncio CTWA sigue gratis**. Fuente secundaria (Mercately); falta confirmarlo en la página de Meta.
- No encontramos en público la **política de Gano Excel sobre publicidad pagada de sus distribuidores** (uso de la marca, precios, plataformas).
- **El contrapeso que Claude Code no midió:** el proceso del INVIMA de 2015 se archivó, y hoy circulan miles de anuncios de estos mismos productos con afirmaciones mucho más graves que las nuestras. La norma existe; lo que no sabemos es con qué frecuencia se aplica a un distribuidor individual, ni qué le pasa en la práctica a un anuncio limpio frente a uno que promete curas.

## 6. Lo que le pedimos investigar

**Campaña A, nuevos socios para la plataforma (prioridad)**
1. El texto vigente de las políticas de Meta que aplican: resultados poco realistas, multinivel, oportunidades de ingreso y prácticas comerciales inaceptables. Diga si un anuncio de una empresa multinivel legal en Colombia puede correr, con qué condiciones, y qué patrones de copy y de video disparan rechazo o restricción de la cuenta. Incluya casos reales de anuncios aprobados de distribuidores de venta directa (Biblioteca de anuncios de Meta, en Colombia o Latinoamérica) y lo que tienen en común.
2. ¿Hay que declarar alguna **categoría especial de anuncio** (empleo, servicios financieros) cuando se buscan distribuidores independientes? Cite la norma.
3. **Estructura de campaña con presupuesto de $20.000 a $50.000 COP diarios:** objetivo, optimización (conversaciones o eventos de CAPI), público (Advantage+ frente a intereses), ubicaciones (incluidos los Estados de WhatsApp) y número de creativos. ¿Cuánto dura la fase de aprendizaje y cuántos eventos semanales necesita con ese presupuesto?
4. **Conversions API for Business Messaging**, desde la documentación oficial de Meta: qué eventos acepta, en qué ventana de tiempo, si un anunciante directo (sin ser BSP) puede enviarlos con su propio token, y desde cuántos eventos semanales Meta puede optimizar por ellos. Nuestra idea: enviar `LeadSubmitted` cuando la persona pide la reunión 1-a-1 y `Purchase` cuando se vincula. ¿Es correcto?
5. **Datos de costo reales** en Colombia o Latinoamérica para 2025-2026: CPM, costo por conversación iniciada en WhatsApp y costo por lead calificado en nichos de oportunidad de ingreso o venta directa. Moneda y fuente de cada cifra.
5b. **Los dos públicos de la Campaña A (A1 y A2), por separado:**
    - **Segmentación:** ¿qué intereses o comportamientos siguen disponibles en Meta en 2026 para llegar a cada uno? Tras los recortes de segmentación detallada de 2022 a 2025, ¿existen todavía «network marketing», «venta directa», «emprendimiento», «franquicias» o «distribución»? ¿Rinde más Advantage+ con un creativo que se dirija al público por sí solo?
    - **Mensaje:** ¿qué gancho y qué primera línea funcionan con quien busca oportunidades de negocio sin conocer la industria (A1), y con quien ya la conoce (A2)? ¿Conviene que el anuncio de A1 nombre a Gano Excel, o solo la plataforma y el modelo?
    - **El rango en el anuncio:** ¿mencionar «Diamante» o los años en la industria en un anuncio de A2 cuenta para Meta como una afirmación implícita de ingresos? ¿Cómo lo hacen sin rechazo los líderes reconocidos de la venta directa en Latinoamérica? Busque casos reales de líderes que pauten para atraer networkers y cuál es su formato (video a cámara, entrevista, transmisión en vivo, invitación a una reunión).
    - **Una frontera que no se cruza:** a un distribuidor activo de otro equipo de Gano Excel no se le ofrece cambiarse (no es ético y las políticas de estas compañías lo suelen prohibir). ¿Qué dice la norma de la industria sobre atraer networkers de otras compañías, y cómo se escribe un anuncio para A2 que no tenga la silueta de «robar equipo»?
    - **Intención de búsqueda:** Meta interrumpe, no responde a una búsqueda. ¿Vale la pena complementar con Google Ads o YouTube para quien ya busca «cómo ser distribuidor de Gano Excel», «negocio de distribución» o «negocio con Gano Excel»? Diga el volumen aproximado de búsqueda en Colombia y el costo por clic, si lo encuentra.
6. **Audiencia fría frente a tibia:** ¿conviene que Luis publique los videos del reto también en la Página o en Instagram profesional para construir públicos de quienes los vieron? ¿Qué rinde mejor en esta categoría: el fundador hablando a cámara, testimonios (con qué límites de Meta) o una explicación del modelo?

**Campaña B, catálogo de productos**
7. **Norma colombiana:** ¿una campaña pagada que muestre solo productos con registro de alimento (NSA), sin declaraciones de salud, necesita aprobación previa del INVIMA? ¿Y si muestra los productos SD? ¿Puede un distribuidor usar piezas que Gano Excel Colombia ya tenga aprobadas? Busque si Gano Excel S.A.S. tiene autorizaciones de publicidad del INVIMA a su nombre.
8. **Política de Gano Excel** (Colombia o corporativa) sobre publicidad pagada, uso de marca, precios publicados y venta en línea de sus distribuidores. Si no es pública, diga dónde suele estar (contrato, manual de políticas y procedimientos) y qué cláusulas suelen tener las empresas de venta directa comparables (Herbalife, Amway, Omnilife).
9. **Meta y la categoría de salud y bienestar:** ¿un anunciante de café con Ganoderma en Colombia cae en las restricciones de 2025? ¿Qué objetivos y eventos quedan disponibles? Fuente primaria de Meta.
10. **Destino del anuncio, comparando tres caminos:**
    (a) la función «Anunciar» de la app WhatsApp Business (número 320 680 5737, atendido a mano, con el catálogo de la app);
    (b) Click-to-WhatsApp hacia Queswa (321), que ya registra pedidos y avisa al distribuidor;
    (c) tráfico al catálogo web (sin píxel).
    ¿Qué permite medir cada uno, qué cuesta y qué limitaciones tiene? En particular: ¿la app WhatsApp Business deja pautar el catálogo de la app, y con qué formatos?

**Bloque C. La paradoja: por qué Meta deja correr esos anuncios (misma prioridad que la Campaña A)**
11. **Censo en la Biblioteca de anuncios de Meta** (facebook.com/ads/library, país Colombia, y si puede México, Perú y Estados Unidos en español). Busque «Ganocafé», «Gano Excel», «Ganoderma», «café de Ganoderma», «reishi» y «hongo reishi café». Reporte cuántos anuncios activos hay, cuántos anunciantes, y clasifique una muestra de al menos 30:
    - qué afirman (sin declaración de salud, bienestar genérico, enfermedad nombrada, cura);
    - dónde está la afirmación: en el texto, en la imagen, en la voz del video o solo en la conversación de WhatsApp después del clic;
    - desde cuándo corren (la fecha de inicio indica cuánto sobreviven);
    - a dónde llevan (WhatsApp, web, Messenger, perfil);
    - si los anuncia una Página de marca, una tienda o un perfil de persona.
    ¿Duran más los que afirman curas o los limpios? Si no puede consultar la Biblioteca directamente, diga exactamente qué búsquedas y qué columnas hacer para que Luis las haga a mano.
12. **Cómo revisa Meta un anuncio en la práctica:** revisión automática frente a humana, qué parte del video y del audio analiza, si revisa el texto en español con la misma precisión que en inglés, si revisa la conversación de WhatsApp que sigue al clic (entendemos que no), y qué dicen los informes de transparencia de Meta sobre anuncios de salud retirados. Incluya las investigaciones periodísticas sobre los ingresos de Meta por anuncios engañosos o prohibidos (por ejemplo, la de Reuters de noviembre de 2025 sobre documentos internos de Meta, si la encuentra) y lo que concluyen.
13. **Qué le pasa en la práctica a quien pauta afirmaciones prohibidas:** anuncio rechazado, cuenta publicitaria restringida, portafolio deshabilitado, perfil personal bloqueado para anunciar. ¿Con qué frecuencia y después de cuántos rechazos? ¿Por qué tantos anunciantes de estos productos parecen no tener consecuencias (cuentas desechables, anuncios que cambian a diario, rotación de perfiles)?
14. **La aplicación real de la norma en Colombia:** sanciones del INVIMA y de la Superintendencia de Industria y Comercio en los últimos cinco años contra **distribuidores individuales** (no contra el titular del registro) por publicidad en redes sociales de suplementos o alimentos. Número de casos, montos y si alguno fue de venta directa. Con eso, compare el riesgo real de tres anuncios: (a) Ganocafé 3 en 1 vendido por el sabor y el ritual, sin ninguna declaración de salud; (b) el mismo producto con «apoya el funcionamiento normal de las defensas»; (c) uno que promete curar una enfermedad.
15. **Lo que aprendan los distribuidores:** a partir de 11 a 14, ¿qué mensajes, formatos y destinos tienen la mejor relación entre resultado y riesgo para un distribuidor que pauta con su propia cuenta? ¿Qué errores llevan a perder la cuenta publicitaria?

## 7. Formato de entrega

- Un **resumen ejecutivo** de no más de 10 puntos, con lo que decide.
- Para cada pregunta: la respuesta, el nivel de evidencia (VERIFICADO o NO VERIFICADO) y las URL con fecha de lectura.
- Una sección **«Dónde Claude Code se equivoca o se queda corto»** que contraste punto por punto lo de §5.
- Una **recomendación concreta para A1, A2 y B, por separado**: objetivo, presupuesto, público, ubicación, destino, el evento que se mide y el umbral para decidir si sigue, cambia o se apaga a los 7 y a los 14 días.
- Una **tabla de riesgo real** para el bloque C, con dos columnas: lo que dice la norma y lo que pasa en la práctica. Para cada tipo de anuncio, la probabilidad y la consecuencia del rechazo, de la restricción de la cuenta y de una sanción del INVIMA o la SIC.
- Un **borrador de guía para distribuidores**: cinco mensajes que funcionan y pasan la revisión, y los cinco errores que más cuentas cuestan.
- En español, sin anglicismos innecesarios. Si cita una norma o una política, cite el texto, no un resumen de un blog.
