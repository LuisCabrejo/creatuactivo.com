# Pendiente — Queswa sabe si la persona vio el video «Cómo funciona» en la Home (1 oct 2026)

> **Estado: por hacer.** Encargo del Director el 1 oct 2026. Auditado ese día; las decisiones abiertas están marcadas **[Director]**.

## Por qué

Desde el 1 oct 2026 el hero de la Home trae el video «Cómo funciona» (`VideoComoFuncionaHome`). Con eso cambian tres cosas:

1. **El botón «Pregúntele a Queswa cómo funciona» queda redundante:** el video ya lo explicó.
2. **Queswa tiene que saber que la persona ya vio el video**, igual que cuando llega desde la historia de WhatsApp: saludo sin repetir la explicación y solo dos botones en lugar de tres.
3. **Y tiene que saber también cuando NO lo vio:** quien toca el botón sin darle play debe seguir teniendo «Cómo funciona» como opción.

## Lo que ya existe (no se reinventa)

- **Reconocimiento por el texto precargado.** El enlace del reel (`/{slug}/como-funciona`) abre WhatsApp con «Hola Queswa, vengo del enlace de {slug}. Ya vi el video de cómo funciona.». El webhook lo detecta con `vieneDelVideoComoFunciona` (`src/lib/wa-apertura.ts`) y responde:
  - `construirAperturaTrasVideo`: copy aprobado el 28 sep, sin el credo ni las viñetas.
  - `APERTURA_TRAS_VIDEO_OPCIONES`: los botones sin «Cómo funciona».
  - `notaVideoComoFuncionaVisto`: la bitácora marca el tema como ya mostrado, para que el modelo no lo repita.
- **La corrección de quien dice que no lo vio:** `niegaHaberVistoVideo`.
- **Un solo camino hacia WhatsApp en la web.** El botón de la Home (`QueswaCTAButton`) emite `open-queswa`; `WhatsAppOrb` lo atiende y llama a `abrirConversacionQueswa(leerRefSocio(), contexto)`, que precarga `textoAperturaWhatsApp(ref, contexto)` (`src/lib/orbe-config.ts`). El botón flotante usa el mismo camino, así que el cambio se hace una sola vez.

## Huecos encontrados en la auditoría

1. **Sin enlace de socio, el precargado dice «Hola Queswa, quiero saber cómo funciona»** (`textoAperturaWhatsApp` sin `ref`). Quien acaba de ver el video en la Home le pide a Queswa justo lo que ya vio, y recibe el video otra vez.
2. **El webhook exige «vengo del enlace» para reconocer el video visto:** `_vieneDelVideo = _vieneDelEnlace && vieneDelVideoComoFunciona(...)`. Un visitante orgánico de la Home, sin `ref`, no tiene cómo decirle a Queswa que ya lo vio.
3. **La Home no registra si el video se vio.** `VideoComoFuncionaHome` no guarda nada.
4. **El botón flotante de WhatsApp** de la Home tampoco sabría que el video se vio.

## Recomendación

- **Texto del botón [Director]:** «Pregúntele a Queswa cómo entra el dinero». Es la pregunta que sigue en la secuencia del prospecto, y en el tráfico real es el botón más tocado después de la apertura (28–30 sep: Granola, Edilson, Miguel, Edilberto, Yesid y Eduardo lo tocaron primero o segundo). La alternativa neutra, «Hable con Queswa», es más simple pero promete menos.
- **El precargado cambia según si la persona vio el video.** «Vio» = llegó al 80 %, que es el mismo umbral que los videos de los módulos.

| Situación | Texto precargado |
|---|---|
| Vio el video, con ref | Hola Queswa, vengo del enlace de {ref}. Ya vi el video de cómo funciona. ¿Cómo entra el dinero? |
| No lo vio, con ref | Hola Queswa, vengo del enlace de {ref}. ¿Cómo entra el dinero? |
| Vio el video, sin ref | Hola Queswa, vengo de creatuactivo.com. Ya vi el video de cómo funciona. ¿Cómo entra el dinero? |
| No lo vio, sin ref | Hola Queswa, vengo de creatuactivo.com. ¿Cómo entra el dinero? |
| Botón flotante | El mismo, sin la pregunta: abre con la apertura que corresponda |

- **El primer turno de Queswa responde la pregunta [Director: aprobar el copy del saludo corto].** Un saludo breve, el video «Cómo entra el dinero» (el mismo de `VIDEOS_APERTURA`) y después los botones que falten:
  - si **no** vio el video: «Cómo funciona» y «Qué debo hacer yo»;
  - si lo vio: solo «Qué debo hacer yo».

## Checklist

**Decisiones del Director**
- [ ] Texto del botón de la Home.
- [ ] Copy del saludo corto del primer turno, en sus dos variantes (vio / no vio).

**Implementación**
- [ ] `VideoComoFuncionaHome`: al llegar al 80 % guardar una marca local (`cta_vio_como_funciona` con la fecha). Es un booleano, no un dato personal.
- [ ] `textoAperturaWhatsApp(ref, contexto, { vioComoFunciona, pregunta })`: las cinco variantes de la tabla. Sin `ref`, decir «vengo de creatuactivo.com» en vez de «quiero saber cómo funciona».
- [ ] `QueswaCTAButton` en la Home: emitir `open-queswa` con `detail: { pregunta: 'dinero' }`; `WhatsAppOrb` lo lee y lo pasa.
- [ ] Webhook: reconocer «vengo de creatuactivo.com» como llegada (hoy `_vieneDelEnlace` solo mira «vengo del enlace» o una URL con barra). Quitar la exigencia del enlace para el video visto, y atender en el primer turno la pregunta que trae el precargado.
- [ ] Los botones después de la respuesta, según la marca de video visto. Verificar que la pregunta de cierre del video del dinero no ofrezca «Cómo funciona» a quien ya lo vio.
- [ ] Si `ORBE_MODO` pasa a `'queswa'` (chat web): la misma marca va como `pageContext` al conductor, para que la web responda igual que WhatsApp.
- [ ] Opcional: reportar a la ficha (`home_video_como_funciona`), para que la campanita del socio diga «vio el video "Cómo funciona" en la Home».
- [ ] Subir `CACHE_VERSION` del service worker al desplegar.

**Pruebas**
- [ ] Arnés sin red de las cinco variantes del precargado y de su lectura en el webhook (vio / no vio / con y sin ref / niega haberlo visto).
- [ ] Ensayo por webhook (`repetir-por-webhook.mts` con `WA_DRY_RUN=1`) de los dos primeros turnos en cada caso.
- [ ] En el teléfono: ver el video completo → tocar el botón → comprobar el saludo, el video del dinero y que no se ofrezca «Cómo funciona».
