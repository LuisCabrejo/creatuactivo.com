# Reto 90 días · Día 73 — «El bache»

| | |
|---|---|
| **Fecha** | Miércoles 18 de noviembre de 2026 · semana 11 |
| **Estado** | Grabado por el Director (toma `oficina-cedritos.mp4`). Montaje listo (18 nov), pendiente de su visto bueno |
| **Formato** | Vertical 9:16, hablado a cámara, 1080×1920. Toma de 137,0 s; entrega de 88,1 s (cuerpo 84,9 s + outro 3,1 s), −14,5 LUFS. Va como reel o en dos tarjetas de historia |
| **Toma** | `oficina-cedritos.mp4` (Drive del Director), grabada en la oficina de Cedritos, Bogotá. 120 fps, Rec.709 |
| **Enlace** | ⏳ Por confirmar con el Director. El video cierra con «Aquí abajo le dejo el enlace para escribirle por WhatsApp», el mismo cierre del día 69 (`creatuactivo.com/{slug}/queswa`) |

---

## Guion (como va en el subtítulo)

¿Qué hacer cuando se siente desanimado?

No hablo de querer tirar la toalla. Hablo de ese momento en que usted sabe que tiene que hacer algo que es importante, como la rutina de ejercicio que se propuso o el proyecto que quiere sacar adelante, y simplemente no le dan ganas, se siente bajo de nota y no sabe ni por dónde empezar.

Hoy le quiero decir algo con mucho cariño: ese momento no es malo. Es más, es una muy buena señal.

En la serie Billonarios hay una escena que me encanta. Un juez ve a un fiscal a punto de rendirse y le dice: «Esa sensación, amigo mío, que usted tiene se llama el bache. Se siente como el momento antes de la derrota, pero en realidad es el momento antes del éxito».

Ese bache lo describió Seth Godin, y solo aparece cuando uno va por algo grande. Lo fácil no tiene bache.

A mí me pasa muchas veces con mi proyecto. Y cuando llega ese momento, me hago una pregunta: ¿cómo me voy a sentir cuando haya hecho lo que sé que tengo que hacer? Y la respuesta siempre es la misma: muy bien. Entonces sonrío y voy por ello.

Y ahí pasa algo hermoso: en la acción llega una satisfacción enorme. Uno se siente más fuerte porque superó justo lo que lo quería detener.

Así que la próxima vez que llegue el desánimo, no se angustie. Recíbalo con una sonrisa y hágase esa pregunta: ¿cómo me sentiré cuando lo haya hecho? Y seguro que la respuesta es que se sentirá muy bien.

Y si ha pensado en construir algo propio, hable con Queswa. Aquí abajo le dejo el enlace para escribirle por WhatsApp.

---

## Por qué quedó así

1. **El subtítulo lleva lo que se oye** (regla 7 del README). Dos frases se confirmaron transcribiendo el tramo aislado, porque la transcripción completa las oía mal: *«voy por ello»* (salía «voy por hecho») y *«lo que lo quería detener»* (salía «lo que quería detenerse»).
2. **«Billonarios» va como se dijo.** La serie es *Billions*. ⏳ Pendiente del Director si se escribe con el título original. La escena del juez no se pudo verificar en una búsqueda web (18 nov); lo que sí es comprobable es el concepto: *The Dip* («el bache»), de Seth Godin (2007).
3. **Cumplimiento**: no hay cifras de ingreso, plazos ni declaraciones de salud. «Construir algo propio» invita a hablar con Queswa sin prometer resultados.

## Cortes del montaje (segundos de `oficina-cedritos.mp4`)

| Tramo | Qué es |
|---|---|
| 0–9,0 | Primera toma de la pregunta de apertura (queda la segunda, desde 9,07) |
| 87,2–112,9 | Tres intentos del cierre: «hágase esa pregunta» incompleto, «que le llegue…» cortado, y el tercero cortado con «¡Ay, santo Dios!» (queda la cuarta toma) |
| 135,3–137,0 | Silencio final |
| Pausas | Montaje por islas: apertura en piso+18, cierre en piso+8 (piso −73 dB, sala silenciosa); islas unidas a menos de 0,40 s; pausas internas de 0,38 s o más, recortadas a 0,16 s. 29 segmentos |

Comprobación: el curado se transcribió completo por tramos y están todas las frases. En sala silenciosa, el verificador de `armar-curado.py` dio avisos de cola y de «segmento sin voz» que la transcripción desmintió (lo mismo que el día 8). Sin LUT: la toma viene en Rec.709, y el LUT saturaba el rojo del pendón y oscurecía la cara. Retoque de dientes 0.35 y piel 0.45 (2.036 de 2.036 cuadros). Rótulo «MIÉRCOLES · DÍA 73» en los primeros 3,8 s. Entrega en `entregas/reto-90/reto-dia73.mp4` (48 MB) y `reto-dia73-liviano.mp4` (9,6 MB, 720p).

## Lo que Queswa tiene que poder responder

Quien escriba puede preguntar «¿qué es eso del bache?», «¿cuál es la serie?» o «¿cómo le hago cuando estoy desanimado?». No son preguntas del negocio, y el arsenal no las cubre. La puerta natural es «construir algo propio», que ya responde `WHY_01`. ⏳ Fragmento `RETO_D73` sin proponer; auditoría (`scripts/auditar-guion-queswa.mjs`) sin correr.
