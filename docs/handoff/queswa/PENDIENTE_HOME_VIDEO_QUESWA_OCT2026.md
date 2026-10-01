# Pendiente — Queswa sabe si la persona vio el video «Cómo funciona» en la Home (1 oct 2026)

> **Estado: HECHO el 1 oct 2026**, salvo dos puntos marcados abajo como abiertos. El Director confirmó el texto del botón y aprobó el saludo corto el mismo día. Arnés: `npx tsx scripts/prueba-home-video-queswa.mts`.

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
- [x] Texto del botón de la Home.
- [x] Copy del saludo corto del primer turno, en sus dos variantes (vio / no vio).

**Implementación**
- [x] `VideoComoFuncionaHome`: al llegar al 80 % guardar una marca local (`cta_vio_como_funciona` con la fecha). Es un booleano, no un dato personal.
- [x] `textoAperturaWhatsApp(ref, contexto, { vioComoFunciona, pregunta })`: las cinco variantes de la tabla. Sin `ref`, decir «vengo de creatuactivo.com» en vez de «quiero saber cómo funciona».
- [x] `QueswaCTAButton` en la Home: emitir `open-queswa` con `detail: { pregunta: 'dinero' }`; `WhatsAppOrb` lo lee y lo pasa.
- [x] Webhook: reconocer «vengo de creatuactivo.com» como llegada (hoy `_vieneDelEnlace` solo mira «vengo del enlace» o una URL con barra). Quitar la exigencia del enlace para el video visto, y atender en el primer turno la pregunta que trae el precargado.
- [x] Los botones después de la respuesta, según la marca de video visto. Verificar que la pregunta de cierre del video del dinero no ofrezca «Cómo funciona» a quien ya lo vio.
- [ ] **Abierto:** si `ORBE_MODO` pasa a `'queswa'` (chat web): la misma marca va como `pageContext` al conductor, para que la web responda igual que WhatsApp.
- [ ] **Abierto (opcional):** reportar a la ficha (`home_video_como_funciona`), para que la campanita del socio diga «vio el video "Cómo funciona" en la Home».
- [x] Subir `CACHE_VERSION` del service worker al desplegar.

**Pruebas**
- [x] Arnés sin red de las cinco variantes del precargado y de su lectura en el webhook (vio / no vio / con y sin ref / niega haberlo visto).
- [x] Ensayo por webhook (`repetir-por-webhook.mts` con `WA_DRY_RUN=1`) de los dos primeros turnos en cada caso.
- [ ] En el teléfono: ver el video completo → tocar el botón → comprobar el saludo, el video del dinero y que no se ofrezca «Cómo funciona».

## Cómo quedó (1 oct 2026)

- **Botón del hero:** «Pregúntele a Queswa cómo entra el dinero» (`QueswaCTAButton pregunta="dinero"`).
- **Marca de video visto:** `VideoComoFuncionaHome` llama a `marcarVioComoFunciona()` al 80 %; el orbe la lee con `vioVideoComoFunciona()` (`orbe-config.ts`).
- **Texto precargado:** `textoAperturaWhatsApp(ref, contexto, { vioComoFunciona, pregunta })`. Quien ya conversó abre con solo la pregunta.
- **Webhook:** `_preguntaDinero` manda el saludo corto con los botones que faltan (`construirAperturaPreguntaDinero` / `aperturaRetornoPreguntaDinero` y `opcionesTrasPreguntaDinero`, en `wa-apertura.ts`), fija `opcionElegida = 'apertura_dinero'` y el nodo 1.6 manda el video del dinero. Saludo y video quedan en un solo turno, nodo `pregunta del dinero desde la Home (video)`.
- **Ensayo por webhook** (WA_DRY_RUN, números ficticios, sin ref): nuevo que vio el video, nuevo que no lo vio y alguien que ya había escrito. Los tres responden como se diseñó.
- **El saludo aprobado:**
  - *Nuevo, vio:* «Hola, {nombre}. Un gusto saludarle. / Soy Queswa, la inteligencia artificial que asiste a {socio}, la misma del video. Atiendo a cientos de personas, las 24 horas. / Como ya vio cómo funciona, vamos con su pregunta.»
  - *Nuevo, no vio:* lo mismo, sin «la misma del video», y cierra «Vamos con su pregunta.»
  - *Vuelve:* «Qué bueno que vuelva{, nombre}. Como ya vio el video de cómo funciona, vamos con su pregunta.» (o solo «Vamos con su pregunta.»)
