# Auditoría del tráfico orgánico de Queswa — la dinámica y el caso Betsabe (5 sep 2026)

> **Para qué sirve este documento.** Es la forma de trabajo cuando entra tráfico real al canal: cómo se saca lo que la gente escribió, cómo se separa de los arneses, qué se mira en cada hilo, cómo se lleva un fallo hasta el nodo del código que debió atenderlo, y cómo se verifica antes de desplegar. La primera vuelta completa fue el caso de Betsabe. Lo que quedó pendiente está al final, con su diagnóstico hecho, para que la siguiente sesión arranque en el arreglo y no en la búsqueda.

## 1. La dinámica, paso a paso

1. **Volcar las conversaciones.** `node scripts/auditar-conversaciones.mjs --dias 10` deja en `docs/respaldos/auditoria-<fecha>/` dos archivos: `conversaciones.txt` (los hilos completos por persona, con el `search_method` y los fragmentos de cada turno) y `preguntas.tsv` (una fila por mensaje de la persona). Por defecto saca solo a las personas; `--todo` incluye los arneses.
2. **Separar personas de arneses antes de contar nada.** Una persona llega con «Hola Queswa, vengo del enlace de …» o saludando, desde un `wa_57` + 10 dígitos o un BSUID `wa_CO.…`; después toca botones. Los arneses arrancan con la pregunta de prueba directamente y repiten la misma 24 o 48 veces (`wa_5730…`, `wa_5731…` de 4 turnos, `wa_conv_*`, `web_probe_*`, `wa_e3_*`). El 4 sep hubo 133 filas y 127 «personas» y eran dos corridas del arnés. Auditar sobre eso mide el arnés.
3. **Leer el hilo entero, no la pregunta suelta.** Las fallas que cuestan una persona solo se ven en el hilo: el «sí» que no recibió lo ofrecido, la promesa que el backend no cumplió, la contradicción entre dos turnos seguidos.
4. **Leer el `search_method` de cada «sí».** Un turno con `-` lo dictó el webhook (apertura, botones, conductor). Un «sí» de la persona que cae en `fragment_vector_search` es un nodo que NO disparó: la aceptación llegó al motor y el modelo improvisó. Ese es el diagnóstico antes de tocar copy (regla de CLAUDE.md: no diagnosticar como copy lo que es enrutamiento).
5. **Llevar el fallo hasta el nodo.** Con el último mensaje del bot y el mensaje de la persona, buscar el nodo que debió atenderlo (`queswa-conductor.ts` para lo compartido, el webhook para lo propio del canal) y reproducir por qué no disparó: casi siempre una expresión regular que exige una frase exacta o una forma de escribir que la gente no usa.
6. **Escribir el arnés que reproduce el turno real ANTES de arreglar** (`scripts/prueba-*.mts`, se corren con `npx tsx`). El turno se pega tal cual quedó en la base. Debe fallar antes del arreglo y pasar después, y probar también la dirección contraria: que el nodo no se trague lo que no es suyo.
7. **Correr las baterías que ya existen**: `prueba-mesa-canal.mts`, `test-guardarrail-salud.mjs`, `test-guardarrail-negocio.mjs`, `benchmark-clasificador.mjs --tenant whatsapp`. Todas en verde o no se despliega.
8. **Cruzar con el Radar del socio.** Los nombres de la notificación de queswa.app están en `prospects.device_info->>'name'` (nombre del perfil de WhatsApp); `prospect_data` no los tiene. Con eso se le dice al socio a quién le escribe hoy.
9. **Desplegar y documentar aquí** lo corregido y lo pendiente, con el diagnóstico ya hecho.

## 2. Lo que se encontró (27 ago – 5 sep 2026)

**Tráfico real:** 10 personas y un socio. Milena (27 ago, 28 turnos, quería una caja), Liliana y Patricia (desde `ganocafe-online-1716`, preguntaban por salud), la pareja de Liliana, y cinco el 5 sep entre 15:52 y 18:38 por el enlace de luis-cabrejo: Henry Castro, Betsabe Rueda, Giovana Ruiz, Domicilios Maru y Beto Moreno. Un número británico mandó tres mensajes sin texto y no dejó rastro. El socio Carlos (`cafranco`) probó el modo socio.

**Cómo pregunta la gente.** No escribe, toca: 8 de 9 primeros turnos son el botón. Cuando escribe es corto, sin tildes ni signos («Cómo funciona», «Si», «Sii», «Si por favor», «1», «No»), con typos («rcomendarías», «orgaismo») y con cariño («Si mi diamante»). Quien teclea pregunta por el producto y la salud (limpieza del organismo, diabetes, beneficios del café), y por comprar como cliente («cuanto vale una caja», «solo quiero una caja», «pagar contra entrega», «envío a santa marta»). La objeción de dinero se dice «No tengo dinero». Nadie real preguntó por pirámide, GEN5 ni binario.

**Caída tras «Cómo funciona».** Cuatro de cinco el 5 sep no pasaron de ahí. Muestra pequeña; se vigila.

## 3. El caso Betsabe — diagnóstico y arreglo

**Qué pasó.** Turno 7: el motor cerró con «¿Le muestro el catálogo completo con precios?». Turno 8: «Si mi diamante» → `fragment_vector_search` → el modelo escribió «Déme un momento para cargarlo y se lo muestro completo» y no llegó nada. Se fue a las 18:17.

**Por qué.** El nodo 2.24 del conductor solo reconocía la oferta con la frase exacta `¿Le muestro el catálogo completo para que vea las presentaciones?` (`RE_OFERTA_CATALOGO_SALUD`). El arsenal cierra con «…con precios», y el modelo compone otras variantes. Además, la aceptación pelada del motor (`_aceptacionPelada` en `route.ts` y `wa-radicacion.ts`) exigía que el mensaje terminara en el «sí», así que «mi diamante» la anulaba.

**Arreglo (commit de esta sesión).**
- `wa-pedido.ts`: `RE_OFERTA_CATALOGO` reconoce la oferta por su forma («¿Le muestro / paso / envío … catálogo …?» como última línea del bot). `RE_OFERTA_CATALOGO_SALUD` queda como alias.
- `wa-pedido.ts`: `esAceptacion()` acepta «Sii», «claro que sí», «sí señora», «Si mi diamante» y rechaza el «sí» que trae otra pregunta encima («sí, ¿y cuánto vale?» va al motor con la pregunta entera).
- `queswa-conductor.ts`: 2.24 usa la oferta general. Aplica a WhatsApp y a la web por igual.
- `route.ts` y `wa-radicacion.ts`: la aceptación pelada admite un apelativo al final.
- Arnés: `npx tsx scripts/prueba-aceptacion-catalogo.mts` reproduce el turno de Betsabe tal cual quedó en la base, siete formas de la oferta, nueve aceptaciones reales y cinco que no lo son.

**Lo que Betsabe recibe ahora con ese mismo «Si mi diamante»:** el enlace `creatuactivo.com/luis-cabrejo/productos`, emitido por el backend, con el ref del socio.

## 4. Pendientes con diagnóstico hecho (en orden)

1. **Quien viene de ganocafe.online o del catálogo recibe la apertura de negocio y su pregunta se ignora.** El orbe manda «…Quiero preguntar por los productos.» (`orbe-config.ts`), pero en el webhook `_traePregunta` es falso siempre que el texto diga «vengo del enlace» (bloque de la apertura, buscar `_vieneDelEnlace`). Patricia escribió una pregunta de salud completa y recibió el discurso del canal; no volvió. Arreglo: si el primer mensaje trae «preguntar por los productos» o texto después del slug, responde el motor en modo asesor, sin la apertura de negocio.
2. **La tabla con candado de cuidado personal (PERS_01) lleva declaraciones que el guardarraíl no ve:** «anti-inflamatorio» (el guion burla `antiinflamator` porque `normalizarSalud()` no quita guiones), «Renovación celular» (solo está `regeneracion celular`, y el propio Concepto Nuclear de PERS_05 la prohíbe), «Reduce caída», «encías saludables». Se le sirvió a Liliana el 31 ago. Copy de la tabla a aprobación del Director; los dos patrones son código.
3. **La cafeína está invertida en BEB_03** (`catalogo_productos.txt`, buscar «13 a 1»): el cuerpo dice que 13 tazas de café convencional equivalen a una de Ganocafé, mientras su cabecera dice «13 veces menor». Se sirvió el 3 sep. Texto propuesto: «necesitaría 13 tazas de Ganocafé para igualar la cafeína de una de café convencional».
4. **Otras fugas de salud en respuestas vivas:** adelgazar (la Spirulina como «saciante», y «responderla con honestidad»), gastritis («menos acidez… gracias al extracto», atada a la condición), diabetes (tras decir que nada está indicado, sugiere las cápsulas «en su forma más concentrada»), Milena («el sueño mejora en calidad», y el Excellium descrito como rendimiento físico, que es el Cordygold).
5. **«Solo quiero una caja» disparó la radicación** y le pidió el nombre completo a Milena. Propuesta: «una caja / comprar una caja / solo quiero probar» entrega el enlace del catálogo con el ref del socio y nombra a quien coordina el pedido, nunca la radicación.
6. **Colisiones entre fragmentos:** precio público del 3 en 1 ($140.000 en un turno, $147.900 dos turnos después); cliente preferencial (sin compromiso / compra mensual mínima / 50 PV para abrir); envío («vale lo mismo una caja que veinticinco» y un minuto después «varía según peso y ciudad»; el nodo 2.47 ya existe, verificar que diga una sola cosa). El modelo inventó una dirección de Bogotá, una oficina en Santa Marta y «precios en su zona».
7. **Mensajes sin texto no dejan rastro.** El acuse de imagen/video/sticker responde antes de registrar el prospecto; el número británico del 5 sep no aparece en ningún radar. Propuesta: crear el prospecto y guardar el tipo de mensaje también por ese camino.
8. **Léxico en respuestas vivas:** «no improvisa ni convence», «antes de entrar a algo… un dueño entra y sale», «ecosistema» y «Satisface sin culpas» dentro del candado BEB_01; «¿Cuánto cuesta empezar?» muestra los tres ESP sin el Kit mientras «Es mucho dinero» y los 12 Niveles apuntan al Kit. Las tres tablas juntas omiten Luvoco y dicen «más de 20». queswa.app (otro repo) sigue diciendo «12 velocidades de ingreso» y «red».

## 5. Consultas que sirvieron

```sql
-- personas reales en 30 días (primer mensaje por el enlace)
select created_at::date, count(distinct fingerprint_id)
from nexus_conversations
where created_at > now() - interval '30 days'
  and messages->0->>'content' ilike '%vengo del enlace%'
  and fingerprint_id !~ 'conv|probe|_p_|q23' group by 1 order by 1;

-- quién escribió en las últimas horas (identidad cruda de Meta, hora Bogotá)
select to_char(creado_at at time zone 'America/Bogota','HH24:MI'), identidad::text
from wa_mensajes_procesados where creado_at > now() - interval '5 hours' order by creado_at;

-- el nombre del perfil de WhatsApp que ve el socio en su Radar
select fingerprint_id, device_info->>'name' from prospects where fingerprint_id like 'wa_%' order by created_at desc limit 20;
```

## 6. Segunda vuelta — 8 sep 2026 (tráfico del 5 al 8 sep)

Volcado en `docs/respaldos/auditoria-2026-09-08/` (10 hilos reales, 367 turnos en la base de los que 357 son arnés). Nada de esta vuelta se desplegó: es diagnóstico, con reproducción hecha.

**Qué entró.** Los cinco del 5 sep ya auditados; Betsabe volvió el 7 sep; el 8 sep: Patricia Reyes (la de ganocafe-online, ahora por el enlace de luis-cabrejo, 5 turnos), un perfil sin continuidad (`3164249534`, solo la apertura) y dos pruebas del Director: el 6 sep desde el 320 680 5737 como prospecto (12 Niveles → simulador, todo dictado, sin fallo) y el 8 sep desde el 320 341 5438 como socio (redactar el mensaje para su hermano Faver). **Nidia no ha escrito**: no hay un solo mensaje del 310 286 0505 en `wa_mensajes_procesados` en tres días, así que el pendiente de restaurarle el WhatsApp de socia sigue abierto. Los cinco mensajes del 320 680 5737 entre 19:13 y 20:04 del 6 sep no dejaron conversación ni prospecto (el prospecto se creó a las 20:22): consistente con una purga entre pruebas, no con un fallo.

### 6.1 El candado se rompe dentro de un hilo de salud (Patricia, turno 5) — reproducido 3/3

Patricia abrió con cáncer de colon y quimioterapia (Capa 0 derivó bien las dos veces), pidió estudios de PubMed (la salida se reemplazó por la derivación) y en el turno 5 preguntó *«En qué consiste el esquema de distribución de estos productos?»*. Recibió una respuesta compuesta: *«canal digital»*, *«red de consumo»*, *«otras personas se vinculan bajo el suyo»* y el margen de reventa como primera fuente de ganancia — la silueta de la pirámide, en la persona que menos la traía.

Reproducido contra producción con el hilo tal cual (`wa_probe_patricia_*`):

| Historial | Resultado (3 corridas cada uno) |
|---|---|
| En frío (solo la pregunta) | `EMPRESA_DIGITAL_01` verbatim |
| Apertura + la pregunta | `EMPRESA_DIGITAL_01` verbatim — **y con las etiquetas `<verbatim_lock>` impresas en el texto** |
| El hilo de salud de Patricia + la pregunta | **Compuesta las tres veces**; en una, «canal de distribución» |

Descartado: el CQR **no reescribe** esa pregunta (nueve palabras, sin deíctico reconocido — verificado corriendo `reescribirConsultaConversacional` con su hilo). El fragmento que llega es el mismo archivo en los tres casos. Lo que cambia el comportamiento es el contenido del hilo: tras tres turnos de salud el modelo deja de obedecer el candado. **Primer sospechoso del «canal»:** el prompt compartido todavía dice *«El canal se nombra siempre por su categoría: canal de distribución de productos premium de bienestar»* (`system-prompt-queswa.md`, buscar «se nombra siempre por su categoría»; está desplegado así en `queswa_whatsapp`). Es la única aparición del léxico viejo que le llega al modelo: los fragmentos del tenant `whatsapp` están limpios (una sola ocurrencia, en el documento padre de `arsenal_inicial`, que no se sirve).

**Las etiquetas impresas** las quita `wa-formato.ts` antes de enviar, así que en WhatsApp no se ven. `route.ts` no las quita: el día que `ORBE_MODO` pase a la web, saldrían al lector tal cual.

### 6.2 Betsabe volvió y recibió los tres botones que ya había agotado

El 7 sep a las 19:29 tocó el enlace otra vez. El nodo de retorno (`aperturaRetorno` + `APERTURA_OPCIONES`) le dijo *«Qué bueno que vuelva. Seguimos donde quiera. ¿Por dónde retomamos?»* con los mismos tres botones del primer día. Se le debía el catálogo desde el 5 sep (el arreglo del nodo 2.24 entró después de su «Si mi diamante»). No siguió. Dos cosas: el retorno de quien quedó con una oferta aceptada y no entregada debería **entregarla** (el enlace del catálogo con su ref), y *«¿Por dónde retomamos?»* es la pregunta que encuesta — la regla del cierre que propone.

### 6.3 Modo socio (Director, 8 sep): el flujo funciona; el copy que se propaga sale sin red

Lo que funcionó: las dos preguntas del esqueleto (oficio y trato), el borrador, el cambio a tú al saber que era su hermano, y sobre todo que Queswa **detectó la promesa de resultado en el texto del propio Director** (*«solucionar de una buena vez y para toda la vida el tema financiero»*) y la retiró. Lo que no:

1. **Léxico en el borrador que el socio va a mandar**: *«sabes reconocer una oportunidad»*, *«la IA atiende a la gente por uno»*, *«les abra una nueva fuente de ingresos»* (la «segunda fuente de ingresos» quemada por el multinivel, con otro adjetivo) y *«si su amigo entra con esa expectativa»* (el verbo vetado, y además Faver **es** el amigo: confundió al destinatario). Es el texto que más se duplica y no pasa por candado ni guardarraíl.
2. **La puerta `INV_00` disparó sobre el borrador pegado** (*«desde el paquete más básico»* casa con su regex) y el motor la sirvió también en *«Me gusta»* y *«Lo voy a usar tal cual»* (`search_method: puerta_directa`, `arsenal_inicial`). El modelo la ignoró, pero un socio que pega un texto largo no está preguntando por el paquete más barato: las puertas no deberían evaluarse sobre texto citado en modo socio.
3. *«Me gusta»* y *«Lo voy a usar tal cual»* recibieron la misma respuesta dos veces.
4. **El socio queda puntuado como prospecto caliente en su propia huella** (`interest_level 77`, arquetipo, objeción «confianza»): `captureProspectData` corre igual en `whatsapp_socio`.

### 6.4 Menores y de herramientas

- El número británico del 5 sep mandó cinco mensajes sin texto y sigue sin prospecto (pendiente 7 de la sección 4, vigente).
- `medir-recuperacion-voyage.mjs` **no filtra los documentos padre**: en el tenant `whatsapp` hay cuatro con `embedding_512` (`arsenal_12_niveles`, `arsenal_compensacion`, `arsenal_avanzado`, `catalogo_productos`) y aparecen en su ranking (el padre del catálogo a 0.603, con 🔒). Producción los filtra por `is_fragment`; el medidor no, y su top-6 miente cuando un padre gana.
- `scripts/sql.mjs` devuelve **401**: el `SUPABASE_ACCESS_TOKEN` de `.env.local` está vencido. Las consultas de esta vuelta se hicieron con `supabase-js`.

### 6.5 Lo que se arregló el mismo día (8 sep, tarde) — el hilo de salud de Patricia

**Corrección del Director antes de tocar nada:** no se asume que la persona está enferma. Patricia es docente universitaria y se preparaba para lo que el mercado le va a preguntar; «ayudarme», «coadyuvante» y el vocabulario clínico no la vuelven paciente. El borrador que decía «cuando uno está pasando por algo así» cometía el error exacto que el código del 29 ago evita, y se retiró.

**La investigación que sostiene la respuesta a «muéstreme los estudios»** (norma y percepción): la Res. 3096 art. 5.3 castiga lo que «sugiera o implique» un uso para enfermedad, y la FDA lleva 31 cartas desde 2006 por citar literatura, con el criterio de que la cita refiera a una enfermedad **en el contexto del conjunto** — enlazar resúmenes de estudios cuenta. Por eso en un hilo que abrió con cáncer, «los estudios los puede consultar usted» reproduce el patrón sancionado, y por eso `grave` manda sobre `evidencia`. Lo que sí cabe está en la lista verde del fabricante: *el hongo más estudiado*. Del lado humano: el cumplimiento parcial (información general sin lo accionable) reduce más de la mitad la percepción negativa frente al rechazo seco (480 participantes, 2025); el rechazo que desvía a una alternativa concreta frustra menos (CHI 2024); el porqué se dice como hecho, sin disculpa ni virtud propia; y la validación repetida («Comprendo su consulta» en cada turno) viola las máximas de la conversación. Fuentes en el mensaje de la sesión y en `docs/investigaciones/resultados/Optimización Prompt Agente WhatsApp Colombia.md` §2.4, 2.5 y 2.8.

**Por qué sonaba a plantilla:** las tres respuestas robóticas nunca pasaron por el modelo. La familia grave se dictaba entera (dos veces el mismo texto), y el bloqueo de salida reemplazaba con un único texto fijo, en la variante de quien declara. El turno 3, compuesto alrededor del núcleo, fue el único humano.

**Cuatro cambios** (`wa-guardarrail-salud.ts`, webhook, `route.ts`), todos con el núcleo legal literal y verificado antes de enviar:

1. **La familia grave se compone.** `saludSeCompone('grave')` es verdadero; en la instrucción del motor rigen dos reglas más: ningún producto concreto en ese turno, y un acuse que no atribuya («su condición», «su médico», «le deseo lo mejor» quedan prohibidos para quien no declaró nada).
2. **Familia nueva `evidencia`** (`RE_SALUD_EVIDENCIA`, `NUCLEO_EVIDENCIA`, `RECHAZO_SALUD_EVIDENCIA`, `CIERRE_EVIDENCIA`): quien pide estudios, PubMed o «qué dice la ciencia» se compone desde la entrada alrededor de su núcleo, en vez de bloquearse a la salida. Orden: grave > evidencia > común.
3. **Reincidencia = no repetir.** Si el núcleo que aplica ya está en el hilo (`nucleoSaludYaDicho` en el webhook, `contieneNucleoSalud` en la web), el núcleo pasa a ser `NUCLEO_REINCIDE` («Ahí aplica lo mismo que le acabo de decir, y no se lo repito.»), el `pageContext` lleva `_otravez` y el motor recibe una instrucción sin acuse que arranca en lo nuevo. Cuenta también contra los textos fijos viejos (compara sobre la frase legal, sin el «Para orientarle con exactitud:»).
4. **El reemplazo de salida lee a la persona:** el respaldo de la familia si el turno venía compuesto; si no, el de evidencia cuando eso pidió; si no, el acuse según preguntó o declaró. Sigue siendo texto fijo: no se reintenta la generación.

**Arnés:** `npx tsx scripts/prueba-salud-patricia.mts` reproduce los cinco turnos tal cual quedaron en la base (ninguno se lee como declaración, familias, reincidencia en T2 y no en T4, el reemplazo, los tres borradores aprobados contra el filtro de salida, y la dirección contraria). La batería `test-guardarrail-salud.mjs` ganó la sección de evidencia y verifica los núcleos y cierres por nombre. `prueba-conversacion.mjs` emula la derivación con `rechazoSaludPorFamilia`.

**Pendiente de esta pieza:** reconocer a quien vuelve (Patricia había escrito el 2 sep y Queswa no dio señal de recordarla) — no existe en ninguna familia.

## 7. Tercera vuelta — 9 sep 2026: los hilos que llegaron desde /productos

Dos hilos reales entraron por la página de productos en diez días (Liliana Patricia Moreno, 17 turnos del 31 ago al 8 sep; Patricia Reyes, 15 turnos del 2 al 8 sep), los dos con el ref de ganocafe-online. Reporte completo en el mensaje de la sesión; aquí lo arreglado y lo que quedó.

**Arreglado (commit de esta sesión, arnés `prueba-radicacion-y-persona.mts`):**

1. **La radicación secuestró el hilo de Patricia.** «Quiero ver cómo se vería en mi caso» no es volición (verificado), pero el modelo copió el bloque de los cuatro datos del prompt; al turno siguiente `gestionarCierre`, viendo ese texto en los últimos turnos del bot, le pidió el nombre completo a «armeme el guión». El bloque salió del prompt; el modelo, si reconoce una volición que el regex no vio, cierra con la frase puente `OFERTA_RADICAR_MODELO` y el «sí» abre el trámite; y el trámite solo se reabre con pedidos que el backend emitió (`metadata.nodo = 'radicacion'` → `pedidosDelBackend`).
2. **La reincidencia de salud sin ventana de tiempo.** Liliana recibió «lo mismo que le acabo de decir» el 8 sep por un núcleo del 31 ago, y dos veces seguidas. Ahora cuenta solo dentro de tres horas, y a la segunda reincidencia seguida va el texto corto (`RECHAZO_SALUD_CORTO`, que ya no dice «su médico») con la puerta al equipo. Espejo en la web.
3. **El «ok» a la oferta de conectarla con el equipo no avisaba.** `botOfrecioPersona()` reconoce la oferta por su forma en el último turno del bot y, con una aceptación, dispara el 2.46.

**Decisiones del Director (9 sep):** la página de productos abre como asesora (pendiente de copy, ver §7.1); quien ya venía conversando del negocio y pasa al catálogo conserva su hilo; **Queswa no redacta piezas publicitarias desde WhatsApp** (eso será una función del Dashboard para cada distribuidor); las imágenes predefinidas de producto, de línea y del portafolio se mantienen, porque los prospectos van a querer ver los productos.

**Pendientes de esta vuelta:** §7.1 la apertura de productos y la respuesta a quien pide un guion o una pieza (copy a aprobación); la ficha de Liliana con «paquete ESP-3» capturado de la tarifa del simulador; «El negocio» compuesto con léxico viejo en un hilo largo (mismo problema del candado que se pierde, diagnóstico aparte); y los pendientes del catálogo ya listados en §4 (PERS_01, cafeína, diabetes) que se siguen sirviendo.

### 7.1 La página de productos abre como asesora, y Queswa no redacta piezas (9 sep, tarde)

Copy aprobado por el Director e implementado (`prueba-productos-apertura.mts`, 27/27):

- **Nuevo desde /productos** (`vieneDeProductos`): apertura de productos con dos botones —«Ver el portafolio» manda la imagen aprobada con el conteo por línea; «Lista de precios» manda el enlace del catálogo con el ref del socio—. Si la frase del orbe trae una pregunta detrás (Patricia), no se dicta nada: el motor responde en modo asesora con la presentación en una línea (`whatsapp_catalogo_primer_contacto`).
- **Quien ya venía conversando**: «Qué bueno que vuelva, {nombre}. Aquí sigo con su conversación, y ahora vamos con los productos. ¿Le muestro el portafolio completo?», con los mismos dos botones y el hilo intacto. Los turnos siguientes van en modo asesora (`whatsapp_catalogo`) durante tres horas o hasta que pregunte por el negocio (`RE_HABLA_DE_NEGOCIO`), y ahí vuelve a lo que traía.
- **Modo asesora en el motor**: el producto por lo que ES (qué lleva, preparación, presentación, precio, registro), lo sensorial y el ritual; el negocio solo si lo piden; sin vincular un producto al propósito que la persona trajo («limpiar el organismo»); sin adivinar el género; sin anunciar la propia honestidad.
- **Nodo 2.49, piezas publicitarias** (`atenderPidePieza`, conductor, los dos canales): verbo de creación + guion/video/diapositiva/flyer/post/contenido → «Eso no lo hago por aquí… ¿Le mando la del portafolio?». El «sí» va por 2.25a (el portafolio ahora tiene `ofrecida`). «¿En qué presentación viene?» y el mensaje personal del socio para un amigo siguen funcionando.
- **Hallazgo colateral**: la puerta de FREQ_30 («¿cuál paquete me recomienda?») disparaba con «¿qué me recomiendas hacer?» en una pregunta de producto y servía «¿con cuál arranca?» con candado. Ahora no abre si el mensaje habla de producto, café, cápsulas, organismo o limpieza.

Pendiente heredado: la ficha de Liliana con «paquete ESP-3» capturado del simulador; «El negocio» compuesto con léxico viejo en hilo largo.

### 7.2 Los dos pendientes de la vuelta, resueltos (9 sep, tarde)

1. **El paquete capturado del simulador.** `captureProspectData` ignora ahora los mensajes que empiezan por «Acabo de usar el simulador» (los redacta el webhook a partir del Flow): la tarifa que la persona eligió para ver una cifra no es un paquete elegido. La ficha de Liliana quedó sin `package` (antes ESP-3).
2. **El candado que se pierde en el hilo largo.** Diagnóstico en producción con los hilos reales: «El negocio» de Liliana lo reescribe el CQR a «Cómo funciona el modelo de negocio de CreaTuActivo», que recupera WHY_01 🔒 solo —y el modelo lo componía con «consumo diario» y «red de distribuidores»—; el «esquema de distribución» de Patricia recuperaba EMPRESA_DIGITAL_01 🔒 solo y el modelo lo componía con «canal» y «se vinculan bajo el suyo» (3/3). Es el mismo fallo que ya tenían las puertas y el ejemplo de cifras: «casi siempre» no es un dictado. **Arreglo:** el fragmento con candado que se sirve solo lo emite el backend en el canal (`candado_solitario` en la metadata → `candado_dictado`), con el cuerpo del candado y su pregunta de seguimiento; fuera quedan los candados con marcadores de pin y los turnos de salud compuesta. En local, 4/4 verbatim con los dos hilos reales.

**Lo que esto destapa, para el Director:** ahora un candado sale literal SIEMPRE, así que el copy del candado es lo único que cuenta. WHY_01 dice *«Distribuir productos que las personas consumen todos los días siempre ha sido buen negocio»* —el marco del consumo diario que se retiró de WHY_02 el 8 ago— y hoy se lo dice a quien pregunta «El negocio» tras un hilo largo. Es copy, va a su aprobación.

**Nidia:** historial de prospecto borrado por segunda vez a pedido del Director (respaldo `docs/respaldos/respaldo-nidia-3102860505-9sep.json`: 1 prospecto, 6 conversaciones, 6 mensajes procesados). Su WhatsApp de socia se restauró en `constructor_slugs` y `private_users` el 9 sep a pedido del Director (`identificarSocio` la reconoce: slug `nidia-cabrejo`); la prueba como prospecto quedó cerrada.

### 7.3 El catálogo web reescrito con la composición del fabricante (9 sep, noche)

Auditoría a pedido del Director: «hay inconsistencias, ejemplo el té rooibos y las cápsulas dicen lo mismo». Lo que había: un bloque fijo («extracto exclusivo 100% hidrosoluble… imposible de replicar por la competencia») en los 22, incluidos seis sin Ganoderma en sus ingredientes; la tercera pestaña mostrándole al prospecto los puntos de conversación del socio («clientes de alto poder adquisitivo», «regalo corporativo», «perfecto para embarazadas»); composición sin verificar (Schokolade «suizo» y sin la leche, Rooibos con «antioxidantes naturales» y «sabor natural» inventados, Reskine sin el Ganoderma); léxico fuera de doctrina («ciencia oriental», «revolucionaria», «tónico cerebral»); sin presentación ni categoría en ningún producto; nombres inconsistentes («Gano Schokoladde», «BEBIDA DE OLEAF GANO ROOIBOS»).

**Fuentes:** la única que fijó el Director es `ganoexcel.com.co` («no hay más sitios»); las 19 fichas se leyeron una por una desde `/todos-productos/`, más el micrositio `luvoco.ganoexcel.com.co` para las tres cápsulas. Nombres, precios y códigos, de las capturas del back office (`public/contexto/capturas/productos/`). La voz, de las fichas del catálogo de Queswa (BEB, LUV, SUP, PERS). **Criterio del Director para la web:** hay más margen que en el canal, y se usa el vocabulario verde de agosto (antioxidante, energía estable sin nerviosismo, enfoque y claridad mental, «apoya el funcionamiento normal de las defensas», «el hongo más estudiado»).

**Lo que quedó:** `productData` reescrito en `src/app/productos/page.tsx` con tres campos nuevos (`presentacion`, `categoria` del fabricante, `llevaGanoderma`) y `ritual` en lugar de `puntosConversacion`; las tres pestañas de la ficha pasan a «Lo que es · Qué lleva · Cómo se usa»; el bloque del extracto (seis variedades, hidrosoluble, polisacáridos y triterpenos, apoya el funcionamiento normal de las defensas) va solo en los que lo llevan, y el Cordygold y la máquina dicen que no lo llevan; presentación y categoría en tarjeta y ficha. Los 22 pasan los guardarraíles de salud y negocio y el barrido de léxico.

**Verificado contra el fabricante, producto por producto (lo que el Director pidió mirar):**
- *Latte y Mocha*: la crema es «no láctea», como dice el Director, y la misma ficha lista leche en polvo y leche desnatada en polvo (y la crema lleva caseinato de sodio). Se dice «crema no láctea» y se declara «contiene derivados de la leche»; nunca «sin leche». El Mocha lleva además extracto de malta de cebada: se declara el gluten.
- *Rooibos*: la ficha solo dice rooibos sudafricano y Ganoderma; salieron los ingredientes inventados. Sin cafeína porque la planta no la tiene.
- *Spirulina*: espirulina, Ganoderma y crema no láctea (derivados de leche).
- *Cordygold*: Cordyceps sinensis 500 mg por cápsula, sin Ganoderma.
- *Excellium y Cápsulas de Ganoderma*: 275 mg de extracto por cápsula cada una; la ficha del fabricante no menciona «micelio», así que la web ya no lo afirma.
- *Reskine*: colágeno de pescado (se declara el pescado), betaglucanos de Ganoderma, quinua, manzana, goji, aloe, espinaca.
- *Schokolade*: cacao, azúcar refinada, crema no láctea, leche descremada en polvo; no es suizo.
- *Luvoco*: Suave = tueste claro y MÁS cafeína; Medio = equilibrado; Fuerte = tueste alto y MENOS cafeína, con betaglucanos en las tres; 8 g por cápsula. Es lo contrario de la escala de intensidad inventada en mayo.

**Dos discrepancias que solo el Director puede cerrar:** (1) la ficha del fabricante del Shoko Rico muestra el registro NSA-0010766-2021 y el back office NSA-0012964-2022; se dejó el del back office. (2) La categoría por producto se tomó del sitio del fabricante (Clásico, Spirulina, Rooibos, Schokolade y las tres cápsulas como suplemento dietario; 3 en 1, Ganoricos, Reskine y Luvoco como alimento), que no coincide con lo que sugieren los prefijos de registro (SD/NSA); prevalece el sitio.

**Pendiente estructural:** la web sigue con su propia copia de los datos. La unificación con `wa-productos.ts` (una sola fuente para nombre, presentación, precio, registro e imagen) queda propuesta.
