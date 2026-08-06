# Changelog — Arsenales Queswa

Historial doctrinal de los arsenales (tenant `creatuactivo_marketing` salvo nota explícita). Extraído del cuerpo de CLAUDE.md a partir del 23 May 2026 para reducir overhead de tokens — un agente nuevo solo necesita la versión *actual* + la *previa*; el historial completo vive aquí.

Cada arsenal vive en `knowledge_base/<nombre>.txt`. Deploy:
- Actualizar todo el documento: `node scripts/deploy-arsenal-<nombre>.mjs`
- Solo re-fragmentar cambios puntuales: `node scripts/actualizar-fragmentos-modificados.mjs`
- Fragmentos Master con `<verbatim_lock>` (WHY_01/WHY_02/EAM_01): `node scripts/actualizar-fragmentos-master-v25.7.mjs`
- Cambios específicos al cierre (FREQ_03 + purgar CIERRE_01/02): `node scripts/actualizar-fragmentos-cierre-v5.2.mjs`

---

## arsenal_inicial

### v5.31 — EAM_01 en formato WhatsApp (6 ago 2026)

Decisión del Director tras auditar la primera conversación real por el canal: **la mayor parte de la comunicación es por WhatsApp**, y el orbe del sitio se va a reemplazar por WhatsApp, así que **las respuestas se calibran para WhatsApp en todas partes**. La excepción es el Dashboard (`queswa.app`), donde sí se quieren respuestas largas porque es el espacio de formación de los empresarios — y no le afecta: tiene tenant propio (`dashboard`, con `arsenal_cierre` + `arsenal_manejo`) y no lee `arsenal_inicial`.

**EAM_01**: de 1.350 a **818 caracteres**. Los tres movimientos pasan a nombrarse por el Tridente —**Comparte · Recibe · Multiplica**— en vez de "Usted comparte / Yo me encargo del resto / Usted pone lo humano". El tercero **no existía**: la respuesta describía dos movimientos del héroe y uno de Queswa, y la Multiplicación —el 3er Comando— quedaba fuera de la única respuesta que explica el día a día. Se retira además *"le llega la misma empresa digital"* (bautizo diferido a la Academia, ver [[feedback_bautizo_empresa_digital_diferido]]) → *"recibe lo mismo que usted tiene, ya montado"*. Sincronizado carácter por carácter con `MASTER_EAM_01`; fragmento purgado, re-embebido y re-clonado al tenant whatsapp.

⚠️ El formato Markdown ya **no se instruye, se traduce**: `src/lib/wa-formato.ts` convierte tablas, `**` y viñetas en la capa de canal. Los arsenales pueden seguir escribiéndose en Markdown.

### v5.30 — Método renombrado en el encabezado (2 ago 2026)

Línea Estrategia del doc padre: "(Comando Expandir · Activar · Multiplicación)" → **"(Compartir · Recibir · Multiplicar)"** — propagación del rename de servilleta v6.5. Solo doc padre (ningún fragmento contenía los nombres viejos; EAM_01 ya narraba los movimientos sin nombres). Padre re-desplegado + re-clonado al tenant whatsapp.

### v5.29 — Barrido del villano viejo (2 ago 2026)

Cierre de los pendientes del `docs/handoff/queswa/HANDOFF_LEXICO_MOTOR_AGO2026.md` §3.2 y §3.3. (1) **WHY_02**: *"cuánta gente ya está consumiendo"* → **"cuántas personas ya están consumiendo"** (registro vetado, ver [[feedback_evitar_gente_despectivo]]; se coló en la redacción del 31 jul y llegó a producción). El `<verbatim_lock>` pasa de 1349 a 1354 chars, sincronizado carácter por carácter con `MASTER_WHY_02` en `respuestas-maestras.ts`. (2) **STORY_01**: retirada la etiqueta *"un sistema diseñado para la asfixia mensual, no para construir verdadera soberanía financiera"* — villano etiquetado + "asfixia mensual" no es universal + "soberanía financiera" fuera del lema. Ahora narrado con el trancón 1 (*"la plata llegaba y al día siguiente ya tenía dueño"*) y el ancla del patrimonio concreto (*"nada de eso dejaba algo construido a su nombre"*). (3) Barrido verificado en `arsenal_avanzado`, `arsenal_12_niveles`, `arsenal_compensacion` y `catalogo_productos`: sin más ocurrencias de "mejores años", "consecuencia matemática" o "asfixia" de cara al prospecto. Sincroniza con system prompt **v29.4**.

### v5.28 — Lenguaje concreto: WHY_01, WHY_02 y EMPRESA_DIGITAL_01 (31 jul 2026)

Origen: dato de campo del Director tras dos meses de conversaciones 1-a-1 — *"nadie parece entender el concepto empresa digital, nadie me ha dicho sí wooow"*. Tres pasadas de investigación independientes (dos Gemini, una Claude Code) coincidieron: la categoría es abstracta y el prospecto rellena el vacío con pirámides, cripto o cursos — la misma causa por la que el propio modelo alucinaba infoproductos.

(1) **WHY_02** (>50% de las primeras preguntas) ahora dice **de dónde sale la plata en el segundo párrafo** — ventas de producto y de paquetes empresariales → un porcentaje → cuenta bancaria cada viernes — y explica la recurrencia con el café que se acaba. La arquitectura baja al final, reducida a **dos fuerzas** (quien fabrica · quien atiende); el método pasa a EAM_01. Se retiran la apertura por apalancamiento, la definición de "empresa digital", la analogía Amazon/MercadoLibre y la figura del "puente".
(2) **WHY_01** responde *qué hacemos* con sustantivos concretos (negocio de distribución de café y suplementos · celular · inteligencia artificial) y el *por qué ahora* en clave de lo que cambió en el mundo, no de lo que anda mal en la vida del prospecto. Se retira el diagnóstico "un sistema que le toma sus mejores años y su salud" (victimiza, roza retórica ideológica, activa reactancia). **"Empresa de tecnología" se conserva** deliberadamente contra la propuesta de cambiarla por "ecosistema/plataforma": es la palabra llana, la misma que usó Nubank ("somos una empresa de tecnología… no un banco").
(3) **EMPRESA_DIGITAL_01** abría con *"funciona sobre internet, **no sobre activos físicos**"*, que contradice de frente el candado de confianza de WHY_02 y ubica el negocio del lado de "la nube" — el patrón que el prospecto reconoce como fraude. Ahora aterriza: lo digital es la forma de dirigirlo; lo que se mueve es físico. El candado **se afirma, nunca se niega**.
(4) **El bautizo de la categoría sale del primer contacto.** Las categorías se ganan, no se anuncian: Nubank nunca le pidió a un cliente entender "neobanco" — el término lo pusieron los analistas años después. "Empresa digital" sigue vivo a nivel de marca, manifiesto y flujo de cierre.

57 fragments. Desplegado + re-fragmentado (Voyage) + purgado y clonado al tenant whatsapp. Sincroniza con system prompt **v29.3**. Base: `docs/handoff/negocio/HANDOFF_HOOK_Y_LENGUAJE_CONCRETO_JUL2026.md` + `docs/investigaciones/posicionamiento-categoria/`.

### v5.27 — Cliente Preferencial: rename + fragmento de cara al cliente (26 jul 2026)

(1) **"Consumidor VIP" → "Cliente VIP"** en todo el arsenal (24 ocurrencias) + `arsenal_compensacion` — decisión Luis: *cliente* es mejor que *consumidor*. "Cliente Preferencial" queda como sinónimo pleno, declarado en FREQ_22 y en los triggers. (2) **Fragmento nuevo CLIENTE_VIP_01** (`<verbatim_lock>`, tras FREQ_22): responde *"yo solo quiero el producto, no el negocio"* **de cara al cliente**, con cifras — precio sugerido $147.900 vs $110.900 de distribuidor = $37.000 por caja, 25% de ahorro, ~$1.776.000 al año para quien toma un café diario; acceso con compra inicial de 50 PV acompañada por el patrocinador; sin cuota mensual ni obligación de mover producto. Cierra dos huecos: el 25% no existía en ningún fragmento, y FREQ_22 respondía esa pregunta **desde el ángulo del Propietario** ("usted percibe regalías por el consumo de cada Cliente VIP") — al prospecto que preguntaba por el precio se le explicaba cómo otro gana con él.

### v5.26 — INVERSION_MARKETING_01 (9 jul 2026)

Fragmento nuevo para *"me dijeron que me pueden ayudar con marketing / invierten en marketing para armar la estructura"*. Cubre una oferta 1-a-1 no pública (Luis apoya con marketing casos puntuales para acelerar uno de sus dos lados de estructura): Queswa **confirma que existe** sin explicar mecánica, cifras ni por qué es selectiva, y remite al equipo de creatuactivo.com. Cierra el hueco donde la consulta caía en FREQ_03/FREQ_04 por colisión semántica con "inversión" y el modelo llegó a **negar que la oferta existiera**. `<verbatim_lock>`, tras FREQ_02. Ver [[project_inversion_marketing_selectiva]].

### v5.25 — Historia de la mesa + resolver de raíz (4 jul 2026)

Cobertura para las 2 historias de Instagram que promueven el reel Home (auditoría anti-alucinación — el CTA de ambas es "pregúntele a Queswa"). (1) **STORY_02**: la historia de la mesa en dos patas (evento de liderazgo en Mocoa, ~300 personas) — canónica y atribuida a Luis, con instrucción de NO inventar detalles adicionales; puentea al "¿cómo lo armo? ¿qué piezas necesito?" → las 3 cosas. (2) **FREQ_28**: "resolver el tema financiero de raíz" = estructura (ingresos que no dependen de su presencia), no acumulación ni paños de agua tibia; mapea "ideas y herramientas exactas" a fabricante/plataforma/método; **GUARD diciembre**: la "meta a diciembre" es meta personal de Luis — NO existe fecha de lanzamiento/cierre (cupos, no calendario), NUNCA mencionar fecha. 53→55 fragments; clonado al tenant whatsapp (solo inserción de categorías nuevas, sin purga).

### v5.24 — Tríada sin pronombre ambiguo (3 jul 2026)

WHY_02: "la idea es simple" → "la regla es sencilla"; "Alguien **la** fabrica / Algo **la** atiende" → **"Alguien fabrica / Una plataforma atiende a las personas"** (el pronombre era ambiguo — nadie "fabrica" una empresa; "una plataforma" mapea limpio con Queswa). Sync char-by-char con `MASTER_WHY_02`. Desplegado + re-fragmentado + clonado a whatsapp, incluyendo todo lo pendiente desde v5.20. *(Marco retirado en v5.28.)*

### v5.23 — WHY_02 a primeros principios + bisagra "se usa, no se entra" (30 jun 2026)

"Tres fuerzas que trabajan a su favor" → primeros principios en columna (*"tres cosas tienen que ser ciertas…"*, apilado con líneas en blanco porque el widget usa ReactMarkdown+remarkGfm y colapsa el salto simple). Bisagra **"Usted no entra a Gano Excel; Gano Excel trabaja para usted"**. Cierre "el trabajo pesado corre por cuenta de sus socios" → "Lo pesado ya está resuelto" ("sus socios" como sujeto suelto lee MLM). Labels "socio de infraestructura/de tecnología" → **"socio logístico y financiero / socio digital"**. WHY_01: "le entregamos el control" → "usted toma el control" (voz fundador). Ver [[feedback_gano_socio_primeros_principios]]. *(La tríada se retira como apertura canónica en v5.28.)*

### v5.22 — WHY_01 por ritmo (Puig) + purga del aforismo "Usted no explica" (29 jun 2026)

WHY_01: apertura que responde "qué es" (definición Waze), viñetas → prosa enumerada, sin guiones de freno. **Aforismo "Usted no explica — Queswa explica" retirado de TODA superficie viva** (arsenales, system prompt, home, servilleta); slot EXPANDIR → "Usted comparte; su alcance se vuelve masivo". Ver [[feedback_usted_no_explica_retirar]].

### v5.21 — WHY_02 por ritmo (Puig) desde el guion del reel Home (29 jun 2026)

Narrativa fluida en prosa enumerada, apertura cálida, apalancamiento como concepto-ancla, promesa completa "explico, atiendo y maduro". Retirados: el aforismo "Usted no explica" (al latino le gusta hablar), "a su escala", y la línea del ingreso "consumo se repite… recibe una parte" (se adelantaba al CTA de números y rozaba el fantasma MLM). Doctrina: [[feedback_ritmo_narrativo_puig]].

### v5.20 — Reframe socios / tres fuerzas estratégicas (28 jun 2026)

"Tres pilares / tres partes" → **tres fuerzas que trabajan para usted**, con dirección del poder explícita ("de su lado", "a su favor") → resuelve el colapso "¡ahh, es meterse a Gano!". Gano y Queswa pasan a **socio logístico y financiero** / **socio digital**. "Sistema" → "puente" en WHY_02 (el villano no se reusa en positivo). Barrido de TODOS los "(el Pilar 1/2)" residuales en CRED/FREQ/OBJ/VOICE — cero "Pilar" de cara al prospecto (decisión Director 28 jun: socios reemplaza pilares aunque tenga toque MLM, excepción aceptada). "Ingresos recurrentes" → "ingresos una y otra vez" (test abuela).

### v5.19 — Promesa Queswa: "guía" → "madura" (25 jun 2026)

WHY_01/WHY_02 + EAM_01 → *"madura en cada interesado la decisión de avanzar"*: el objeto es **la decisión**, no la persona → activo sin presionar. **Regla del espejo:** en CTA o interpelación al lector NO se usa verbo sobre *su* decisión (expone la persuasión); el verbo solo describe lo que Queswa hace con los prospectos del usuario. La calidez humana conserva "acompaña". Ver [[feedback_promesa_canonica_queswa]].

### v5.18 — EMPRESA_DIGITAL_01 a Camino A + "sistema" → "puente" (23 jun 2026)

Bug de recuperación: *"¿qué es una empresa digital?"* traía WHY_01 por similitud vectorial y el modelo sintetizaba pilares. Se sirve verbatim por **Camino A** (regex en `respuestas-maestras.ts`, tras el match exacto de chips) → $0 tokens. "Sistema" evitado en positivo por ser el villano.

### v5.17 — Fragmento EMPRESA_DIGITAL_01 + WHY_01 pulido (22 jun 2026)

EMPRESA_DIGITAL_01 responde la pregunta directa que el encuadre "empresa digital" dispara, con definición accesible y puente a "en el caso de CreaTuActivo". WHY_01: "monetiza" → "produce ingresos de", "protocolo paso a paso" → "paso a paso exacto", retirado el rótulo clínico "Pregunta de seguimiento". *(Ambos reescritos en v5.28.)*

### v5.16 — WHY_02 + EAM_01 al norte "empresa digital" + chips nuevos (22 jun 2026)

Chips 1 y 2 reescritos para empatizar con el pensamiento real: *"¿Y esto cómo funciona, exactamente?"* · *"¿Cómo lo haría yo? ¿Qué hago en el día a día?"* (sincronizados en `queswa-greeting.ts` + `respuestas-maestras.ts`). WHY_02 presenta los 3 pilares como **alivio** y nombra a Gano con orgullo (respaldo, **NUNCA titular del ingreso** — retirada la cláusula "ingresos cada vez que consumen productos Gano Excel"). EAM_01 alivia los miedos del "qué hago": minutos, no vender, no andar detrás de nadie, no responder a medianoche.

### v5.15 — Calidez en Activar + diagnóstico retirado (jun 2026)

"Usted revisa / da el sí" → *"cuando alguien ya decidió, usted lo recibe — la calidez que solo un humano puede dar"* (nadie audita). **CTA_01** deja de ofrecer el Diagnóstico de 5 Días → "una conversación sin compromiso, de persona a persona" (la Home lo desconectó como gancho).

### v5.14 — ACTIVACION_01 (19 jun 2026)

Fragmento nuevo para *"cómo se activa mi empresa digital"*: proceso de arranque concreto en `<verbatim_lock>` — capitalización → paquete en oficina Gano o a domicilio → formulario sencillo con cuenta bancaria → Centro de Mando activo de inmediato → acompañamiento del equipo por llamada. Cierra el vacío donde el modelo improvisaba con los 3 Comandos. Trigger de FREQ_03 limpiado para que no compitan.

### v5.13 — EAM_01 cierre humano (17 jun 2026)

Rol del héroe = recibir de persona a persona a quien decidió avanzar: calidez/confianza/apretón de manos. Nadie audita — ni Queswa ni el constructor. Cierra el giro de "filtro/auditoría" hacia un cierre humano. Sincronizado carácter por carácter con `respuestas-maestras.ts` (EAM_01). Alineado con system prompt v28.5.

### v5.12 — EAM_01 simple + "filtrar" desterrado + Maestría→Multiplicación (17 jun 2026)

(1) **EAM_01 versión simple**: 3 pasos Expandir/Activar/Multiplicación, Activar = conversión, sin la lista "no requiere" ni el "Protocolo de Validación". (2) **"filtrar" desterrado** → conversar/acompañar/reconocer quién está listo (reencuadre a conversión, ver [[feedback_filtrar_prohibido]]). (3) **3er Comando Maestría → Multiplicación** (ver [[project_rename_maestria_multiplicacion]]). WHY_02 + EAM_01 re-sincronizados carácter por carácter con `respuestas-maestras.ts`.

### v5.11 — Villano = el sistema que toma sus mejores años y su salud (13 jun 2026)

Reubica el villano de WHY_01 y WHY_02. "Asfixia mensual" NO es universal (hay quien está mal económicamente pero se siente relajado); el villano más potente e identificable (12 años de campo de Luis) es **un sistema diseñado para tomar sus mejores años y su salud a cambio de casi nada**. Antítesis deliberada: usted *entrega* sus años/salud / el sistema los *toma*.

- **WHY_02:** "sistema diseñado para la asfixia mensual, no para crear independencia financiera" → "…para tomar sus mejores años y su salud, no para darle seguridad financiera". Chip sincronizado (`respuestas-maestras.ts`).
- **WHY_01:** se retira el villano de **ausencia + patrimonio** ("un mes que no pueda trabajar… sus bienes más del banco que suyos") — doble problema: futuro/ausencia (cabeza del americano) + "patrimonio" que el latino ya cree tener. Reemplazo: "vive dentro de un sistema diseñado para tomar sus mejores años y su salud, sin devolverle nunca verdadera seguridad financiera".

Alineado con system prompt v28.3 (sección EL VILLANO) + servilleta Slide 1 + reel Home. Ver [[feedback_villano_anos_salud]]. ⏳ Pendiente: STORY_01 y Manifiesto aún citan "asfixia mensual".

### v5.10 — Villano narrado sin atacar el esfuerzo: WHY_01 + WHY_02 (12 jun 2026)

WHY_02 (chip 1) y WHY_01 reescritos para reubicar el villano. Fundamento: investigaciones `El Statu Quo_ Anatomía y Escape` + `Léxico CreaTuActivo_ Comprensión y Duplicabilidad` — atacar la "dependencia del trabajo" / la presencia obligada genera disonancia en el latino promedio, que valora su empleo como digno. El villano correcto es el **sistema de asfixia mensual** (vejez sin pensión, edadismo, deuda), narrado sin etiqueta abstracta.

- **WHY_02**: abre con reencuadre ("destapemos el verdadero problema") + reconocimiento del esfuerzo ("Usted trabaja duro, entrega sus mejores años y su salud"). Nombra Gano Excel + productos + "toda América" + "dirige desde su celular". Pilares presentados como alivio entregado (infraestructura/tecnología/método ya construidos). Se eliminó el villano "depende de su presencia". Léxico: "Operar" → "Llevar" (regla operar/operador).
- **WHY_01**: apertura reconoce el esfuerzo antes de la vulnerabilidad ("Usted ha trabajado duro y ha hecho las cosas bien. Aun así…"); "ingresos que no dependen de su trabajo físico" → "que siguen produciendo aunque usted no esté presente".

Sincronizado carácter por carácter con `src/lib/respuestas-maestras.ts` (MASTER_WHY_02). ⏳ Deploy a Supabase + re-fragmentar pendiente.

### v5.9 — Swap "empresa digital" (12 jun 2026)

El activo que entregamos: "negocio digital" → **"empresa digital"** (decisión Luis, alineado con Home v13.6 — eleva el estatus de propiedad). Concordancias de género corregidas. Se conserva "negocio" en el chip canónico ("¿Cómo funciona el negocio?"), en el negocio actual del prospecto y en "Centro de Negocios" (Binario). WHY_02 re-sincronizado con `respuestas-maestras.ts`.

### v5.8 — Swap léxico "negocio digital" (jun 2026, HANDOFF_AGENTE_LEXICO_ARSENALES.md)

"Base Operativa" → **"negocio digital"** (a secas — NO "de Gano Excel": la corona es de CreaTuActivo; Gano Excel solo se nombra como Respaldo Operativo / Pilar 1). Rol "Propietario de Base Operativa" → "Propietario". `operar/operador` del usuario/sistema → dirige/funciona/trabaja (se conserva "opera" de Gano Excel). `escalar` → **multiplicar** (incl. aforismo "Queswa multiplica"). Conservado: lema de Luis "soberanía financiera" en STORY_01. 48 fragments.

### v5.7 — Recalibración a Registro Accesible (Beto) (jun 2026)

WHY_01, WHY_02 y EAM_01 reescritos al léxico accesible: "Estructura Patrimonial" → estructura de ingresos recurrentes · "La Matriz Física" → El Respaldo Operativo · "El Tridente EAM" → El Método Comprobado · "Arquitecto de Patrimonio" → Propietario. WHY_01 con concepto nuclear modelo Waze + vulnerabilidad en autopersuasión ("un mes que no pueda trabajar, un despido… y en cuestión de meses sus bienes son más del banco que suyos"). Villano narrado sin etiqueta (NuBank). Camino A sincronizado.

### v5.6 / v5.6.1 — 4 nuevas FREQ + 2 nuevas COMP (tasa Gano, VIP, familia, back office, inscripción, 50 PV) (29 May 2026)

Causa: meta-auditoría del chat real identificó 7 gaps prioritarios. 4 aplicados en arsenal_inicial + 2 en arsenal_compensacion. Un pendiente (COMP_CV_02 sobre PVP) descartado tras audit — PV/CV/GCV ya cubiertos por COMP_PV_01/04/05 + COMP_CV_01.

**Nuevas respuestas en arsenal_inicial:**
- **FREQ_23** *"¿A qué tasa me paga Gano Excel?"* — tasa FIJA $4,500 COP/USD vigente independiente de TRM. Cierra malentendido "$1,000 USD a tasa de mercado = $3,631,020 COP" — la realidad es $4,500,000 COP. Ventaja estructural en contextos de devaluación.
- **FREQ_24** *"¿Cómo inscribo un Consumidor VIP?"* — proceso idéntico a Arquitecto. Documentos (ID/email/dirección/contacto). Canales (línea CO 018000 184266 / fija (601) 742 3399 / oficinas / back office). Formulario físico con presentador o digital enviado al correo tras finiquitar pago.
- **FREQ_25** *"¿El consumo familiar cuenta?"* — sí, abrir códigos VIP a familia directa (cónyuge/hijos/padres). Consumo familiar = CV al Centro de Negocios de Cobro. Upgrade futuro a Arquitecto posible.
- **FREQ_26** *"¿Back office vs Queswa.app?"* — distinción clave. Back office = sistema administrativo Gano Excel universal. Queswa.app = Centro de Mando exclusivo CreaTuActivo.com (Luis Cabrejo Parra + Liliana Patricia Moreno). El primero gestiona, el segundo orquesta.

**Nuevas respuestas en arsenal_compensacion:**
- **COMP_VIP_01** *"¿VIP requiere paquete / compras mensuales?"* — NO a ambas. Activación con 50 PV iniciales. Sin recompra mensual obligatoria. Sugerencia: mínimo 1 producto cada 5 meses para mantener cuenta operativa. Diferencia operativa explícita con Arquitecto (50 PV mensuales para conservar derecho de cobro de comisiones).
- **COMP_PV_08** *"¿Qué productos para mis 50 PV mensuales?"* — portado desde INV_06 (arsenal_12_niveles, vigente 2026). 4 opciones de combinación (café solo / café + suplemento / suplementos / mix) + tabla PV/CV oficial por producto. Resuelve el gap del chat principal que antes solo tenía la tabla en arsenal_12_niveles (no recuperable desde chat creatuactivo.com).

**Pendientes auditados y descartados:**
- COMP_CV_02 (CV vs precio) — NO crear. Auditoría confirmó que PV/CV/GCV ya están completamente cubiertos por COMP_PV_01/04/05 + COMP_CV_01 + COMP_PV_07. La distinción CV vs precio se mantiene implícita en COMP_BIN_11 sin necesidad de respuesta dedicada.

**Versiones finales tras v5.6.1:** arsenal_inicial 48 fragments + arsenal_compensacion 41 fragments = 89 respuestas en producción. Total Supabase: 179 fragments.

### v5.5 — Anti-alucinación Binario, 3 nuevas FREQ (personas/bases/VIP), banco aperturas (29 May 2026)

Causa: feedback de campo (Director Cabrejo) identificó tres focos:
1. Queswa improvisó tabla con encabezado *"Personas/Lado"* en respuesta de Binario — alucinación que refuerza paradigma MLM tradicional ("ganas por meter gente").
2. Repetición de la apertura *"Con gusto"* sonaba a guion comercial; necesitaba banco de aperturas para variar.
3. Errores semánticos repetidos por agentes Claude: *"paga 17% sobre el centro de negocios de cobro"* → el usuario malinterpreta como "17% sobre $100M de venta = $17M". La forma correcta es *"17% del GCV sobre el Centro de Negocios de Cobro"*. Y al decir *"ganas por consumo de Bases Operativas"*, muchos asumen que NO ganan por consumidores VIP que solo compran producto.

**Cambios léxicos en system prompt (v27.2):**
- *"Hoy analicemos las dos principales"* → *"Su Base Operativa genera ganancias en 12 velocidades que cubren su flujo de corto, mediano y largo plazo. Analicemos dos:"* (sincronizado con FREQ_04 verbatim_lock del arsenal). Doctrina: "las dos principales" implica jerarquía falsa sobre las otras 10.
- *"pierna débil/fuerte"* → *"Centro de Negocios de Cobro"* / *"Centro de Negocios de Mayor Tracción"* (doctrina canónica arsenal_compensacion:1010).
- *"17% sobre la pierna débil"* → *"17% del GCV sobre el Centro de Negocios de Cobro"* (el GCV vs PVP es la distinción clave).
- Nuevo banco de aperturas Lujo Clínico humano: *Claro / Por supuesto / Entiendo / Excelente / OK / Comprendo / De acuerdo* — antipatrón documentado: NUNCA empezar siempre con *"Con gusto"*.

**Cambios anti-alucinación en route.ts (getTablasComisiones):**
- Tabla Binario blindada con encabezado canónico *"Rentabilidad sobre GCV del Centro de Negocios de Cobro"*.
- Prohibición ABSOLUTA: nunca generar tablas con *"Personas/Lado"* — alucinación reincidente del modelo. Unidad correcta: *"Bases Operativas"*.
- Si el usuario pide proyección concreta, contextualizar estimado: *"con consumo de 4 cajas Ganocafé por Base Operativa por mes"*.
- USD + COP SIEMPRE entre paréntesis. Tasa Gano Excel fija: $1 USD = $4,500 COP (NO tasa de mercado).

**3 nuevas respuestas en arsenal_inicial:**
- **FREQ_04_PERSONAS** *"¿Gano Excel paga por meter personas?"* — filtro doctrinal anti-MLM tradicional. NO premia inscripciones; premia movimiento de inventario.
- **FREQ_04_BASES** *"¿Las ganancias son generadas únicamente por las Bases Operativas?"* — aclara que cada Base Operativa contiene Arquitectos Y Consumidores VIP. El sistema audita el consumo TOTAL.
- **FREQ_04_VIP** *"¿Qué es un Consumidor VIP?"* — define perfil (acceso a precio distribuidor sin compromiso de desarrollo). El usuario gana por su consumo recurrente igual que por el de un Arquitecto.

**Nueva respuesta en arsenal_compensacion:**
- **COMP_BIN_LIQUIDACION** *"¿Cómo liquida Gano Excel las comisiones binarias?"* — explica la matemática real: GCV (Volumen Comisionable Grupal) del Centro de Negocios de Cobro × porcentaje del paquete/rango activo. Tabla de orígenes de % (ESP-1/2/3 + escala de rangos Bronce-Diamante + promociones corporativas).

**Frontend (NEXUSWidget.tsx):**
- Custom `hr` component agregado al ReactMarkdown: `my-6` (24px vertical) + borde sutil. El default `<hr>` del browser dejaba el texto siguiente "pegado" al separador, rompiendo la respiración del Lujo Silencioso.

Doctrina aplicada: **cuando se detectan errores repetidos del modelo, no basta con ajustar el system prompt — hay que añadir respuestas explícitas al arsenal**. Las preguntas que el usuario va a hacer N veces deben tener fragment dedicado en el RAG, para que el modelo recupere doctrina verificada en lugar de improvisar.

### v5.4 — UX (FREQ_02 + FREQ_06), híbrido contextual de voz Queswa, limpieza léxico residual (24 May 2026)

Causa: feedback de campo identificó (a) respuestas demasiado técnicas en FREQ_02 y FREQ_06; (b) disonancia conversacional por uso sistemático de tercera persona ("Queswa hace X") cuando el agente habla con el usuario; (c) léxico residual no purgado en v5.3 (plusvalía, ancho de banda, vector); (d) inconsistencia "global" cuando se refiere al activo del usuario vs descripción factual de Gano Excel.

**Cambios:**

**FREQ_02 — reescrita completa** (sugerencia Gemini): Los 3 modos de tráfico ahora son "**Conexión Directa / Conexión Asistida / Conexión Automatizada**" en lugar de "Modo Relacional / Híbrido / Escalabilidad". Los nuevos nombres son auto-explicativos (cada uno indica QUÉ hace), eliminan "vector de tráfico"/"inyección de prospectos"/"protocolo de evaluación", y resuelven la inconsistencia con el header (que pregunta por "Análoga, Híbrida y Digital").

**FREQ_06 — reescrita completa**: elimina "Plusvalía Estructural" (→ "Ventaja Estructural"), "ancho de banda en la Dirección" (→ "disponibilidad de la Dirección"), "calibración personalizada" (→ "acompañamiento directo"). Nueva pregunta de cierre proyecta el "impacto financiero de asegurar esta posición de ventaja". Fecha corregida a "lunes 25 al domingo 31 de mayo" (ventana operativa real, no la histórica "04 al 09").

**Híbrido contextual de voz Queswa — doctrina de 3 niveles** (decisión arquitectónica documentada en CLAUDE.md):
- **Nivel 1 — Aforismos canónicos**: tercera persona PRESERVADA ("Usted no explica — Queswa explica", "Usted no enseña; Queswa escala"). Son frases-marca; cambiarlas rompe su fuerza retórica.
- **Nivel 2 — Sustantivos/componentes**: tercera persona PRESERVADA ("Centro de Mando Queswa", "Academia Queswa", "plataforma Queswa", "Pilar 2 (Queswa)" en referencias arquitectónicas). Son nombres propios o nombran componentes del ecosistema.
- **Nivel 3 — Acciones del agente AHORA**: CAMBIO a primera persona ("yo proceso", "yo asumo", "yo opero"). Antes el agente decía "Queswa filtra"; ahora dice "yo filtro".

Razón doctrinal: la disonancia conversacional ("¿acaso él no es Queswa?") quema atención del usuario. La regla híbrida resuelve la disonancia en chat sin perder la fuerza de los aforismos ni la precisión de los nombres propios. Aplicada a 9 instancias cross-arsenal: arsenal_inicial (5 cambios incluyendo WHY_01 verbatim_lock L34 + FREQ_01 L123 + FREQ_02 L153 + FREQ_04 L197 + DIASPORA L642), arsenal_avanzado (4 cambios L17, L69, L244, L246). arsenal_reto y respuestas-maestras.ts no requirieron cambios (ya alineados).

**Limpieza léxico residual:**
- "plusvalía" → "ventaja"/"valor patrimonial" según contexto (arsenal_avanzado:233 + arsenal_reto:32)
- "ancho de banda" → "disponibilidad"/"agenda" según contexto (4 instancias: arsenal_inicial L350, L437, L463 + arsenal_reto L55)
- "vector de tráfico"/"vector de adquisición" → absorbido en reescritura de FREQ_02 ("camino de expansión"/"ruta")
- "global" → "internacional" solo cuando refiere al activo del usuario (consumo internacional, Base Operativa internacional). "global" PRESERVADO cuando describe factualmente Gano Excel (70 países, distribución global) o el despliegue público del 1 de junio.

**Catálogo Bilingüe Verbal:**
- Cuando se hable de **acciones del agente conversacional**, usar primera persona ("yo")
- Cuando se citen **aforismos doctrinales**, mantener tercera persona ("Queswa")
- Cuando se nombren **componentes con nombre propio** (Centro de Mando Queswa, queswa.app, Academia Queswa, "Pilar 2 (Queswa)"), mantener tercera persona

### v5.3 — Propagación al backend dictador + léxico "arquitectura actual" → "modelo de ingresos" (24 May 2026)

Causa: el backend dictador en `route.ts` Estado 2 informativo (texto verbatim que se imprime cuando el usuario pide "háblame de los paquetes" en modo informativo) seguía usando vocabulario v5.1 prohibido — "Asignación de Capital para la Activación de Infraestructura", "tecnología nutricional", "apalancamiento asimétrico máximo". La purga v5.2 limpió el arsenal pero **no propagó al backend**, así que el modelo imprimía el preámbulo viejo verbatim.

**Cambios:**
- **`route.ts` Estado 2 informativo** (`getMicroPromptCierre` con `modoCierre=false`): preámbulo simple + bullets ESP simplificados ("Apalancamiento estratégico" sin "asimétrico/máximo") + pregunta de cierre canónica nueva.
- **`route.ts` Tabla Binario** (`getTablasComisiones`): eliminada columna técnica `CV × % × $1` (fricción innecesaria) + eliminada fila "Kit Inicio". Solo Paquete + Rentabilidad %. La fórmula técnica se sirve únicamente si el usuario pregunta "¿cómo se calcula la comisión semanal?".
- **PERFIL_01**: "su arquitectura actual" → "su modelo de ingresos".
- **OBJ_02 pregunta de cierre**: nueva canónica "¿Cuál de estas tres opciones (ESP-1/2/3) se alinea mejor con la liquidez que desea inyectar a su Estructura Patrimonial este mes?".
- **FREQ_04 (Doble Velocidad)**: "matemática" / "proyección estructural" → "(cómo se genera la liquidez semanal)" / "(cómo se consolida el flujo recurrente)".
- **FREQ_03 verbatim_lock**: (a) eliminada frase "No existen cuotas de inscripción ni cobros por afiliación" — en México sí hay un cobro de afiliación pequeño (~$10 USD); afirmar lo contrario es impreciso. (b) Pregunta de cierre alineada a la canónica de OBJ_02.
- **Limpieza léxico v5.2 residual**: 6 instancias de "tecnología nutricional" en `arsenal_inicial.txt` + 1 en `arsenal_avanzado.txt` → "productos físicos" / "bebidas enriquecidas y suplementos Gano Excel" / "este mercado" según contexto.
- **Afirmaciones "100%" eliminadas en CRED_04 y OBJ_02**: "El 100% de los fondos se transfiere" → "Su capital se transfiere a productos físicos". Mismo razonamiento que la regla México (cobros pequeños existentes; afirmar 100% genera riesgo de inconsistencia auditable).

Doctrina aplicada: **el backend dictador es la fuente de verdad ejecutable**. Si el arsenal tiene léxico v5.2 pero el backend imprime verbatim v5.1, el usuario ve v5.1. Cada vez que se purga vocabulario del arsenal, hay que auditar `route.ts` por reaparición en bloques `getMicroPromptApertura/Cierre/Estado4` y en las strings de inyección "📊 FORMATO TABLA".

### v5.2 — Cierre simplificado (22 May 2026, paralelo a system prompt v27.1)

Causa: ante "¿cómo se inicia?" el modelo alucinaba "equipo de Dirección Estratégica con disponibilidad de inventario en su zona" (texto inexistente en el arsenal); paralelamente CIERRE_01 aún disparaba el Klaff Prize Frame "7-10 horas semanales" — código zombi de antes de Opción B.

**Cambios:**
- **FREQ_03** reescrito con copy v5.2 + `<verbatim_lock>` para delivery exacto.
- Triggers ampliados: absorbe "cómo se inicia / quiero empezar / cómo me uno / cuáles son los pasos" además de los originales.
- Vocabulario simplificado: fuera "Asignación de Capital", "apalancamiento estratégico máximo", "tecnología nutricional"; adentro "su capital se convierte en los productos físicos" (sin afirmar 100% — no siempre exacto).
- Datos tangibles por nivel: productos + Binario + GEN5 (anchoring ESP-3 primero).
- **CIERRE_01 eliminado** del arsenal (Klaff Prize Frame BANT horas, contrario a Opción B).
- **CIERRE_02 eliminado** del arsenal (follow-up del Estado 1, ya no existe).
- BLOQUE CIERRE: header "4 respuestas" → "2 respuestas" + nota operativa que documenta el colapso.

Doctrina aplicada (insight del Director Cabrejo): *"el arquitecto no puede precipitar el cierre pero debe esperar que pase, y cuando pasa los procesos son sencillos"*. Cuando el prospecto pregunta cómo se inicia se sirven los 3 niveles + pregunta de selección, el FSM avanza a Estado 3 (nombre) y Estado 4 (warm handoff automático). Sin entrevista BANT prematura.

### v25.9 — Markdown enriquecido en chips canónicos (19 May 2026)

WHY_02 + EAM_01 reescritos con numeración explícita (1./2./3.), negritas en frases-ancla, cursivas en reencuadres psicológicos, separador `---` antes del cierre. Sincronizado con system prompt v26.9 (nueva sección "RECURSOS DE LEGIBILIDAD COGNITIVA").

### v25.8 — Migración XML verbatim_lock (18 May 2026)

`[VERBATIM_LOCK]...[/VERBATIM_LOCK]` → `<verbatim_lock>...</verbatim_lock>` en WHY_01, WHY_02, EAM_01. Razón: investigación Gemini Hipótesis C confirmó que Claude Sonnet 4.6 reconoce XML tags como señal de máxima prioridad post-entrenada; los corchetes planos son texto inerte. Paralela a system prompt v26.8.

### v25.7 — Respuestas Master del Director Académico (18 May 2026)

WHY_01, WHY_02, EAM_01 calibrados al estándar Director Académico de Élite (v5.0/v6.0/v5.1). Preservan recategorizaciones v25.3 (Pilar 3 = Metodología Automatizada) + v25.5 (jerarquía causal Modelo→Inestabilidad→Déficit).

### v25.6 — DIASPORA + verbos paridad (Abr 2026)

Bloque DIASPORA_01-03 (latinos en USA/Europa), verbos de paridad ("dirige", "orquesta", "ejecuta") aplicados en WHY_02 y CIERRE_03. Cifra cupos Fundadores 15.

### v25.5 — Jerarquía causal corregida (17 May 2026)

WHY_01 + STORY_01 + PERFIL_01 reescriben Déficit Estructural de Ingresos como CAUSA RAÍZ (no consecuencia). Modelo de presencia obligada = MANIFESTACIÓN. Sincronizado con system prompt v26.6.

### v25.3 — Pilar 3 recategorizado (15 May 2026)

WHY_02 reescrito: Pilar 3 = La Metodología Automatizada (El Tridente EAM), no "Su Rol como Arquitecto de Patrimonio". El Arquitecto queda elevado como director de los 3 pilares. Sincronizado con system prompt v26.5.

---

## arsenal_avanzado

### v12.5 — METH_01: Compartir · Recibir · Multiplicar (2 ago 2026)

Propagación del rename del método (servilleta v6.5, decisión del Director: *"si hay que explicar la palabra, la palabra falló"* — Expandir → **Compartir** · Activar → **Recibir** · Multiplicar sin cambio, "Recibir" además desambigua "activar" que ya significa comprar el paquete). METH_01: "tres comandos" → "tres movimientos"; bajo el rótulo Recibir, Queswa dice "yo **converso** con esas personas" (no "yo recibo" — recibir es el movimiento del Propietario, el apretón de manos al final); *"las guío hasta su decisión"* → *"maduro su decisión"* (verbo vetado, [[feedback_promesa_canonica_queswa]]); *"su empresa digital se multiplica"* → *"su negocio se multiplica"*. Cifras intactas. Purga METH_01 + re-fragmentación. Sincroniza con system prompt **v29.5**, Home, Manifiesto, `/fundadores` y voice-command. *(v12.4 documentada en el header del .txt — no tuvo entrada aquí.)*

### v12.3 — "filtrar" desterrado + Maestría→Multiplicación (17 jun 2026)

"filtrar" desterrado (5 hits → conversar/acompañar/reconocer) + 3er Comando Maestría → Multiplicación (Comando Multiplicación reescrito: la formación enlaza con multiplicación 1·2·4·8). Cifras intactas.

### v12.2 — Swap "empresa digital" (12 jun 2026)

"negocio digital" → "empresa digital" para el activo que entregamos. Cifras intactas.

### v12.1 — Swap léxico "negocio digital" (jun 2026)

Base Operativa → negocio digital · "Operando en el nivel" → "En el nivel" · aforismo "Queswa escala" → "Queswa multiplica" · "Calibre ESP-3" → "nivel ESP-3". Cifras intactas.

### v12.0 — Migración al registro accesible (Beto) (jun 2026)

Léxico canónico → accesible. "Capas" → "respaldos independientes" (ADV_TECH_03), "calibre" → "nivel", GCV correcto ("17% compensado sobre el volumen comisionable", "hasta 15/17% del GCV"), 50 PV como compra personal mínima, ADV_SIST_03 reescrito con técnica Mario Puig (analogía director de orquesta). Cifras del plan intactas. Aforismos canónicos preservados (Activar suavizado: "revisa y da el sí").

### v10.0 — ADV_VAL_05 + Tridente Comandos (May 2026)

Nueva respuesta ADV_VAL_05 (incentivos corporativos Gano Excel). METH_01 con Comandos canónicos del Tridente EAM (Expandir/Activar/Maestría + aforismos). Patrimonio Paralelo en OBJ_02. Queswa nombrado en OBJ_01. USD/COP unificado VAL_01/VAL_04. ADV_TECH_03 con "Queswa, el Centro de Mando" + "sistemas de contingencia" (Capas — no Pilares). ADV_SIST_02 "Infraestructura Continental". ADV_SIST_03 reordenado.

---

## arsenal_reto (Auditoría Patrimonial)

### v4.7 — Swap "empresa digital" (12 jun 2026)

"negocio digital" → "empresa digital". Jerga clínica profunda intacta (ver v4.6). 7 fragments (días 1–5).

### v4.6 — Swap léxico "negocio digital" (jun 2026)

Solo swap de marca: Base Operativa → negocio digital + "WhatsApp operará" → "funcionará". ⚠️ La **jerga clínica profunda se conserva a propósito** (Déficit Estructural, Re-Arquitectura, Acoplamiento Híbrido, "Ancho de Banda Mental" — esta última permitida explícitamente en RETO_05) — ver [[project_reto_12niveles_no_migrar]]. Migración profunda + rename del producto ("El Diagnóstico de 5 Días") = pase cross-channel pendiente.

### v4.1 — Arquitecto de Patrimonio (May 2026)

7 respuestas calibradas: Arquitecto de Patrimonio, jerarquía causal Protocolo→Inestabilidad→Déficit, Pilares 1/2 en Día 3, Base Operativa digital.

---

## arsenal_compensacion

### v6.4 — Cobertura geográfica canónica (22 May 2026)

Nueva sección "REGLA CANÓNICA: COBERTURA GEOGRÁFICA" (70 países Gano Excel vs 15 países operativos CreaTuActivo). COMP_MODELO_01 corregido: "cualquier país" → "cualquiera de los 15 países operativos de América". COMP_PAQ_01 con Insight "NUNCA digas 'X meses de GEN5'" — corrige confusión entre duración Binario y GEN5.

### v6.2 — Doble velocidad + organización (May 2026)

Capitalización Inmediata (GEN5) / Renta Vitalicia (Binario). "Su organización" reemplaza "su equipo/red". Arquitectos de Patrimonio. Analogía del Acueducto eliminada. COMP_MODELO_01 "Monetización de Doble Velocidad".

**⚠️ NO modificar vocabulario ni cifras** sin autorización explícita — son cifras matemáticas del plan, no copy editorial.

---

## catalogo_productos

### v7.2 — Verbatim lock en tablas + PROD_OVERVIEW (22 May 2026)

Causa: ante "¿Cuál es el producto?" Queswa alucinaba nombres simplificados ("Ganotea" en lugar de **Oleaf Gano Rooibos**, "Gano Cocoa" en lugar de **Gano Schokolade**, "Gano Supreme" inexistente, "Ganocafé Negro" en lugar de **Ganocafé Clásico**) y omitía la categoría completa de **Suplementos** (mencionando solo 2 de 4 categorías reales).

Diagnóstico: el catálogo SÍ estaba fragmentado (25 fragments en Supabase + doc maestro de 17,664 chars). La nota previa en CLAUDE.md decía que "no está fragmentado" — era falsa. El problema real: las tablas canónicas no tenían `<verbatim_lock>`, así que el modelo parafraseaba con nombres simplificados aunque tuviera la tabla exacta en contexto.

**Cambios v7.2:**
- **PROD_OVERVIEW (NUEVO)**: vista global de las 4 categorías canónicas en `<verbatim_lock>` — responde "vista general del portafolio", "categorías de productos", "¿cuál es el producto?". **Crítico: NUNCA omitir Suplementos ni LUVOCO.**
- **BEB_01**: tabla 9 bebidas envuelta en `<verbatim_lock>` + triggers ampliados ("productos", "bebidas") + nota explícita de productos inexistentes (Ganotea/Gano Cocoa/Ganocafé Negro).
- **LUV_01**: tabla sistema LUVOCO (4 productos) en `<verbatim_lock>`.
- **SUP_01**: tabla 3 suplementos en `<verbatim_lock>` + nota "es 1 de 4 categorías — NUNCA omitir" + aclaración "no existe Gano Supreme".
- **PERS_01**: tabla 6 cuidado personal en `<verbatim_lock>`.

Deploy: `node scripts/actualizar-fragmentos-catalogo-v7.2.mjs`. 5/5 fragments actualizados con embeddings duales (voyage-large-2 + voyage-3-lite) y `metadata.is_fragment = true`.

**Bug pendiente parcial:** CV/PV todavía faltantes en respuestas individuales por producto (PROD_*, BEB_02-06). Ver `docs/handoff/queswa/HANDOFF-QUESWA-PRECIOS-CVPV.md`.

### v7.0 — Lujo Clínico (Abr 2026)

22 productos + ciencia (Ganoderma Lucidum, Cordyceps), audiencia premium pan-americana. ~20KB total. Estructura por categorías: Bebidas funcionales (9), LUVOCO (4), Suplementos (3), Cuidado Personal (6).

---

## arsenal_marca_personal (tenant `marca_personal`)

### v1.1 — Calibración Luis Cabrejo (Abr 2026)

11 respuestas: QUIEN, HIST, VISION, METOD, ACTIVO, OBJ, CONTACTO. Para `luiscabrejo.com`.

---

## arsenal_ganocafe (tenant `ecommerce`)

### v1.5 — Alias coloquiales (Mar 2026)

16 respuestas (PROD_01–07, BENE, COMPRA, OBJ_GC, NEGOCIO, CODIGO). Para `ganocafe.online` (piloto Google Ads).

⚠️ El system prompt `ganocafe_main` tiene catálogo de precios hardcodeado. Al cambiar precios en el arsenal, **también** actualizar el system prompt con `node scripts/actualizar-system-prompt-ganocafe-v1.3.mjs`. Deben estar sincronizados.

---

## arsenal_12_niveles

### Mayo 2026 — Aforismo Tridente canónico

Línea 164: aforismo corregido a "Usted no explica — Queswa explica". 13 fragmentos re-embebidos con voyage-large-2 + voyage-3-lite.

---

## Versiones anteriores

Para historial pre-v25.3, consultar `git log -- knowledge_base/<arsenal>.txt`. Las versiones explícitas tienen tag de fecha; las implícitas se infieren del commit.
