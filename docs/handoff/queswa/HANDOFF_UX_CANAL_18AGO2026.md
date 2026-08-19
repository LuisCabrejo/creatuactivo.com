# Handoff — Experiencia de usuario del canal WhatsApp (18 ago 2026)

Sesión con el Director sobre legibilidad y recursos de la Cloud API antes de salir a producción. Aquí queda lo que se decidió, lo que se midió y lo que falta.

## Lo que se midió (no se supuso)

Sondas enviadas al Android (320 341 5438) y al iPhone (314 368 9510), capturas en `public/contexto/capturas/pruebas/4.png`, `5.jpeg`, `6.jpeg`. Meta **no documenta** nada de esto en la referencia de mensajes de texto — es comportamiento del cliente, por eso se probó en teléfono:

| Formato | Android | iPhone | Decisión |
|---|---|---|---|
| Viñeta `• ` (la que emitimos) | lista nativa, 2º renglón sangrado | igual | **se conserva** — `- ` no aporta y en cliente viejo se vería como raya |
| Lista numerada `1. ` | alineada, sangría francesa | igual | pasa intacta; regla en el prompt (v4.12) para usarla cuando hay orden |
| Cita en bloque `> ` | barra vertical + gris | solo gris con sangría | renderiza; **uso diferido** (ver abajo) |
| Código en línea `` ` `` | monoespacio resaltado | igual | sin uso previsto |

Conclusión: **`aFormatoWhatsApp` no cambia.** FREQ_03 ya emite `> ` en el detalle de cada paquete y sale como cita gris bajo el título en negrita — funciona como jerarquía y se deja.

## Lo que entró en producción (route.ts + wa-channel.ts, commits 6860234 + 5f872cd)

- **Acuse inmediato**: `marcarLeidoYEscribiendo(wamid)` al entrar el mensaje — visto azul + "escribiendo…" en una sola llamada. Se cae solo a los 25 s. Se re-dispara entre partes cuando la respuesta se parte, con pausa que escala con la longitud (antes 600 ms fijos).
- **Cita contextual**: `sendText(to, text, {responderA: wamid})` — solo en el primer envío, y solo si el turno tardó > 8 s (la persona ya escribió otra cosa encima). Citar siempre satura.
- **Acuse a lo no procesable**: imagen, video, documento, ubicación, contacto reciben una línea (`ACUSE_NO_PROCESABLE`). Reacción y sticker siguen mudos a propósito.
- **Envíos fallidos se registran**: el webhook lee `statuses[].status === 'failed'`. Fuera de la ventana de 24 h Meta acepta con 200 + ID y descarta después; sin este log, no entregado = entregado. Así se perdió la primera sonda.

## Prompt `queswa_whatsapp` → v4.12_listas_numeradas

Una sola regla nueva en `<channel_formatting>`: numerar cuando hay orden, viñetas cuando no, nunca ambas en un mensaje.

**Diferido a propósito — la cita de las palabras de la persona.** Se había propuesto que Queswa abriera la respuesta a una objeción repitiendo en `> ` las palabras de la persona. Se dejó fuera porque el transporte ya hace ese trabajo (la respuesta sale colgada del mensaje citado cuando tardó) y una regla de estilo nueva justo antes de producción es una variable más. Se decide con conversaciones reales. Y **no** para la línea bisagra: el gris la apagaría.

## Incidente de la sesión (léalo si trabaja en paralelo)

El commit `6860234` (otra sesión) agregó `route.ts` entero mientras esta sesión lo tenía a medio editar: se llevó las llamadas a `marcarLeidoYEscribiendo` sin `wa-channel.ts`, donde vive. **Todo mensaje entrante reventó** en la primera línea del POST hasta `5f872cd`. Regla: `git diff` antes de `git add` de un archivo compartido; y un cambio que cruza dos archivos no se deja sin commit mientras alguien más puede empujar.

## Pendientes, en orden

1. **Fase 2** (con conversaciones reales encima): botón `cta_url` en vez de URL cruda para el enlace de radicación · imagen de producto con pie de foto en modo consultor de bienestar · reacción de acuse cuando el turno pasa al socio · la cita `> ` de las palabras de la persona (arriba).
2. **Foto del comprobante de pago**: hoy recibe el acuse genérico de imagen. Quien acaba de pagar merece algo mejor — es flujo nuevo, no se improvisó.
3. **Fase 3, a evaluar**: nota de voz de salida (`audio` con `voice: true`, OGG/OPUS, < 512 KB para el ícono de play). Regla propuesta: responder en audio solo a quien escribió en audio, siempre con el texto al lado (el audio no se relee ni se reenvía al cónyuge). Verificar que ElevenLabs entregue OPUS en OGG y medir la latencia de subir el media.
4. **Fuera a propósito**: lista interactiva de 4–10 opciones a media conversación — choca con "una pregunta, una salida".

Fuentes: Typing indicators · Mark as read · Interactive CTA URL · Audio messages (developers.facebook.com, consultadas 18 ago 2026).

---

# Continuación — 19 ago 2026: auditoría de conversación y prueba de 40 preguntas

## Lo que se corrigió (todo desplegado)

**El acuse y la legibilidad** (Fase 1, ya en producción): visto azul + "escribiendo…" al entrar el mensaje y renovado cada 20 s mientras el motor trabaja · cita contextual cuando el turno pasa de 8 s · acuse a imágenes, documentos y ubicaciones · registro de envíos fallidos · cronómetro `⏱` por turno · prompt v4.12 (numerar cuando hay orden).

**El emoji del saludo se retiró, medido.** La redirección entrega bien el carácter (`Location` con `%F0%9F%AA%A2`), pero al webhook llega `U+FFFD`: **la pre-carga de texto de wa.me destruye los emoji de cuatro bytes**, y con 👋 pasaba igual desde siempre. El nudo vive en las respuestas de Queswa, que salen por la API y sí lo conservan.

**Seis defectos de conversación**, cada uno con su causa:

| Síntoma | Causa real |
|---|---|
| El GEN5 no se respondía; salía la respuesta correctiva | La pregunta caía en el routing directo de paquetes (composiciones + precios) y el modelo pegaba precio y comisión → guardarraíl de negocio |
| El simulador respondía el ejemplo fijo al 17% aunque se eligiera 16% | El pin no leía el escenario. Ahora lo responde `wa-simulador.ts` con las tablas del Flow, sin modelo |
| "¿cómo se inicia con este paquete?" → tres formas inventadas | FREQ_03 le gana a ACTIVACION_01 por centésimas y el candado solitario devuelve la lista de paquetes |
| Un precio pedido devolvía la tabla de nueve; el Cordygold perdía su ficha por 0.02 | La tabla de categoría lleva candado y manda sobre todo lo demás |
| A un independiente se le respondió con el villano del empleado | WHY_03 comparte el "ya me va bien" y está escrita para quien vive de un salario |
| Un "sí" a una oferta recibió "¿cuál es su número de identificación?" | El trámite se mira sobre tres turnos del bot, y el "sí" caía dentro de esa ventana |

## Las tres lecciones que costaron tiempo

**1. Un comentario que dice «esto ya está resuelto» no es evidencia de que funcione.** La retirada del arsenal cuando el pin dicta llevaba días registrada como hecha, y no hacía nada: vaciaba `relevantDocuments` cuando el texto ya se había copiado a `context` setecientas líneas antes. **Lo que se retira tiene que ser lo que el modelo lee.**

**2. Una puerta que existe porque el enrutamiento falla no puede condicionarse a que el enrutamiento acierte.** La puerta a FREQ_10 estaba escrita y nunca se ejecutaba: exigía `documentType === 'arsenal_inicial'` y la pregunta se iba por vector a `arsenal_avanzado`. Las cuatro puertas viven ahora en una tabla y se evalúan sobre cualquier arsenal.

**3. «Casi siempre» no es un dictado.** Con el pin activo, el arsenal retirado y el log diciendo `dicta=true`, el modelo seguía parafraseando el ejemplo unas veces sí y otras no. Se resolvió como todo lo verbatim en este motor: **el ejemplo se emite desde el backend, sin llamar al modelo** (`extraerEjemploDictado`). Cero tokens, ~50 ms, y la cifra que sale es la que se calculó.

⚠️ **Y una trampa de nomenclatura:** *"paquetes empresariales"* en plural es el genérico de lo que paga el GEN5, no el ESP-2. Capturarlo como selección fijaba un paquete que nadie eligió y encendía la Marcha 2, cuyo micro-prompt ordena responder con el contenido del paquete — contra el ejemplo que el pin acababa de dictar. Dos instrucciones opuestas en el mismo turno se ven como si el modelo dudara.

## La prueba de 40 preguntas

`node scripts/prueba-40-preguntas.mjs [--detalle] [--solo N] [--base URL]`

Pregunta por la puerta del motor con el tenant del canal. Cada caso declara lo que la respuesta **debe** y **no puede** traer; además vigila el léxico retirado, los dos guardarraíles y los tiempos. **Estado: 39/40**, mediana 6.7 s, p95 13.7 s, máximo 16 s — cómodo bajo el techo de 30 s del webhook.

⚠️ **No reemplaza la prueba en el teléfono:** no ve los botones, ni el Flow del simulador, ni cómo parte el texto en pantalla. Ve el contenido.

⚠️ **Dos trampas del arnés, ya corregidas y que volverán a morder a quien lo edite:** el fingerprint necesita prefijo `57` (sin él el motor no detecta país y cotiza en USD — parecía un fallo del pin), y el guardarraíl de salud marca cualquier respuesta que **nombre** una enfermedad, incluidas las negativas correctas.

## Pendientes

1. **El webhook procesa antes de responderle a Meta**, con techo de 30 s. Lo correcto es responder 200 de inmediato y procesar en `waitUntil`, con guarda por `wamid` para que un reintento de Meta no produzca dos respuestas. Con los tiempos medidos no es urgente; con una conversación lenta sí.
2. Fase 2 de UX: botón `cta_url` en vez de URL cruda · imagen de producto con pie de foto · reacción de acuse · la cita `> ` de las palabras de la persona.
3. **Foto del comprobante de pago**: hoy recibe el acuse genérico de imagen.
4. Fase 3: nota de voz de salida (`voice: true`, OGG/OPUS, < 512 KB).
