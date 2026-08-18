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
