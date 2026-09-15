# Reto 90 días · Día 8 (video 1 de 2) — «Las tres condiciones»

| | |
|---|---|
| **Fecha** | Lunes 14 de septiembre de 2026 |
| **Serie** | Reto de los 90 días (documentación en vivo) |
| **Estado** | ✅ **Emitido** — historias de Instagram y Facebook con sticker **«Qué estamos construyendo»** + WhatsApp (enlace escrito) |
| **Formato** | Vertical 9:16. **Intro semanal** al estilo de las series («en capítulos anteriores»). Un clip, **sala silenciosa** |
| **Rejilla** | Lunes = creencia. Ese día se hicieron **dos videos**: este, la intro, y la creencia, que se grabó al día siguiente como día 9 (`2026-09-15-reto-90-dia-09-lo-importante-no-espera.md`) |
| **Versiones** | Historia **1080×1920 · 59.2 s** con outro corto · −13.6 LUFS · cuerpo 57.6 s en 18 segmentos |
| **Entrega** | `~/Downloads/reels-equipo/0914/entrega/reto-dia8-intro-historia.mp4` · y en Drive, `reto-90/salida/` |
| **Fuente** | `~/Downloads/reels-equipo/0914/` — `dia-8.MP4` (SD de la cámara, `DCIM/DJI_001`) y `dia-8.WAV` (micrófono, `DJI_Audio_005`) |
| **Corte** | `~/Downloads/reels-equipo/0914/corte-dia8-intro.json` (micrófono −0.152 s, constante, sin saltos) |
| **Enlace** | `https://creatuactivo.com/luis-cabrejo/queswa` |

---

## Guion (como se habló)

Lunes, día 8. Como saben, hoy hace una semana empecé el reto de crear una empresa en 90 días. Lo bonito es que después de esto la empresa no será para mí, será para otras personas. Nos planteamos que esta empresa tiene que cumplir tres condiciones: que pueda iniciarse con bajo capital, que genere ingresos sin que yo tenga que estar encima, y que genere ingresos para tener tranquilidad financiera.

La primera semana no pude trabajar como quería por una condición de salud, pero hoy ya me siento espléndido.

Queremos cambiar las reglas del juego, simplificar la vida financiera de miles de personas y demostrar que la tecnología puede cambiar para bien la forma tradicional de hacer empresa. Creemos que la tecnología puede hacer sencillo lo que antes era complejo, y en que las personas pueden tener una mejor opción que el ciclo de trabajar, pagar cuentas y repetir.

Y saben, también quiero que las personas puedan empezar a dedicarle tiempo a lo que es verdaderamente importante. Así que, con la mejor actitud y de la mano de Dios, vamos por una semana extraordinaria.

---

## De dónde salió

**El formato lo propuso el Director, mirando las series sobre personas que crearon empresas.** En la
intro de cada capítulo se repite el contexto: uno ya se lo sabe, pero no cansa oírlo, y da razón para
seguir viendo porque recuerda cuál es la meta. Él lo contrastó con lo que venía viendo desde
noviembre de 2025: antes, el tráfico empezaba alto y bajaba a medida que el tema pasaba; con esta
serie, sube despacio.

**El texto es suyo.** El trabajo fue solo gramática, puntuación y cumplimiento. Él grabó con
variaciones mínimas (en torno a un 95 % igual), y el texto de arriba es el que se oye en la entrega.

---

## Por qué quedó así

1. **Las tres condiciones se repiten como ancla de la serie.** Son la meta con la que se va a medir
   el reto, y el mes 3 del plan las revisa una por una.
2. **«Que genere ingresos» va como condición de diseño de la empresa, no como promesa al que mira.**
   No lleva cifra, plazo ni sujeto que no sea la empresa misma.
3. **La salud cabe en una línea y sin detalle.** El sábado ya se contó; aquí solo explica por qué la
   primera semana rindió poco.
4. **La columna y el ciclo** (*hacer sencillo lo que antes era complejo* · *trabajar, pagar cuentas y
   repetir*) enlazan con la frase de identidad sin repetirla entera.
5. **«Lo verdaderamente importante» abre el tema de la semana 2**, que desarrolla el video 2.

**El sticker: «Qué estamos construyendo»** (confirmado por el Director). Se eligió repetirlo: la
serie gana una puerta fija, y promete lo que la persona encuentra al tocarlo (la apertura de Queswa). ⛔ Se desaconsejó **«Las tres
condiciones»**, porque ese día Queswa no tenía respuesta para eso.

---

## Lo que pasó después, y por qué importa para los próximos videos

**Queswa no sabía responder lo que decía el video.** Tres problemas encontrados el mismo 14 sep:

1. **No había respuesta sobre las tres condiciones.** Se escribió `RETO_01` (arsenal inicial v6.39),
   desplegada en los tres tenants el 14 sep.
2. **Cualquier mensaje con la palabra «reto» iba al plan de compensación**, por patrones heredados de
   un reto viejo, y Queswa llegó a negar que el reto existiera. Se construyó una puerta
   (`src/lib/puerta-reto.ts`) que manda esas preguntas a `RETO_01`. ✅ En producción desde el 15 sep
   (commit `5f159d3`).
3. **El prompt de Queswa no sabe quién es Luis ni qué es el reto.** ⏳ Hay una línea propuesta,
   pendiente de aprobación.

**De ahí sale la herramienta que se corre antes de publicar:**
`NODE_NO_WARNINGS=1 npx tsx scripts/auditar-guion-queswa.mjs <guion.txt>`. Anticipa lo que
preguntaría quien vio el video, se lo pregunta al Queswa real y juzga cada respuesta. ⏳ Que esto
sea la séptima regla del plan sigue pendiente de que el Director lo confirme.

---

## Producción

**Sala silenciosa (piso de ruido en −74 dB): el verificador de `armar-curado.py` dio falsos
positivos.** Marcó ocho segmentos «sin voz» y cuatro colas negativas, y la transcripción del tramo
mostró todas las palabras en su lugar.

**Whisper, con el montaje entero, se saltó una frase completa** (*«Queremos cambiar las reglas del
juego, simplificar la vida»*). Transcrito solo el tramo de 22 a 36 s, estaba ahí. Si falta un bloque
contiguo, primero se transcribe ese tramo aislado.

**Descartado:** la primera toma de *«pero hoy ya me siento espléndido»* (la repitió) y la segunda de
*«queremos cambiar las reglas del juego»*, que tenía una pausa y un *juego* repetido. Un *«Así… así
que»* que marcó Whisper no existe en el audio.
