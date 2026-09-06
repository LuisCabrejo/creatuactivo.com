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
