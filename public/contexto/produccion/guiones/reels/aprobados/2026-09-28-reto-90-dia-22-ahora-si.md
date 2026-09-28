# Reto 90 días · Día 22 — «¡Ahora sí!»

| | |
|---|---|
| **Fecha** | Lunes 28 de septiembre de 2026 · rótulo **«LUNES · DÍA 22»**. Abre la **semana 4**, la última del mes de EL EQUIPO |
| **Estado** | 🎬 **Montado**, pendiente de publicar |
| **Numeración** | Por calendario: después del día 19 (viernes 25) no se publicó video hasta hoy |
| **Sticker** | Propuesto: **«Pregúntele a Queswa»** — repite el llamado del video y promete lo que la persona encuentra al tocarlo (la conversación con Queswa). En Instagram y Facebook lo aplica el Director con el texto que sugiere el agente; en WhatsApp va el enlace limpio. ⏳ Confirmar el que se usó |
| **Formato** | Vertical 9:16, hablado a cámara, con el café en la mano. Dos clips —la apertura, grabada aparte, más cerca y sin gafas, y el cuerpo—, sala silenciosa |
| **Rejilla** | Lunes = creencia · semana 4 = **los primeros socios**. La creencia: *uno se queda anclado a cómo eran las cosas* |
| **Versiones** | Una sola historia: **56.75 s** (apertura 6.3 s + cuerpo 48.9 s + outro corto 1.42 s) · −13.8 LUFS, pico −1.2 dBFS |
| **Entrega** | `~/Downloads/reels-equipo/0928/entrega/reto-dia22-historia.mp4` · y en Drive, `reto-90/salida/` |
| **Fuente** | `~/Downloads/reels-equipo/0928/` — `dia-22-intro.MP4` (la apertura, `DIA-22-INTRO.MP4` en la SD), `dia-22.MP4` (toma 0286 de las 16:02, SD de la cámara), `dia-22-cam.WAV` (el PCM de la cámara) y `dia-22.WAV` (micrófono, `DJI_Audio_006/DJI_13_20260928_160159.WAV`) |
| **Corte** | `~/Downloads/reels-equipo/0928/corte-dia22-intro.json` + `corte-dia22.json` · generadores `0928/work/corte_intro.py` y `corte.py` · cadena `0928/work/chain22b.sh` |
| **Enlace** | `https://creatuactivo.com/luis-cabrejo/queswa` |

---

## Guion (como se grabó)

Lunes, día 22. Empezamos la cuarta semana del reto de crear una empresa en 90 días.

El viernes les conté que por fin estoy viendo luz verde. La luz verde tiene nombres: Carlos, Andrés, Marlon, Mónica y Maryi, los primeros socios.

Un ingeniero en Ibagué, un agricultor en Granada, Meta, dos hermanos que han trabajado en el sector público, él en Villavicencio, ella en Yopal, y una empresaria reconocida en Fómeque.

Y todos coincidieron en algo, casi con las mismas palabras: «¡Ahora sí!».

A veces uno se queda anclado a cómo eran las cosas. Ejemplo: mandar plata era hacer fila en el banco, y hoy es un clic en el celular. Aquí pasa igual: una empresa de distribución moderna hoy se monta en queswa.app, y una buena parte, en WhatsApp.

¿Quiere ver cómo aplicaría para usted? Sea empleado, empresario o gerente del hogar, pregúntele a Queswa.

**Frente al texto aprobado:** la apertura faltaba en las dos tomas del cuerpo (la 0285 es un ensayo del
mismo tramo) y **el Director la grabó aparte**, más cerca y sin gafas; va como primer plano, con el
rótulo encima. Lo demás, improvisado al grabar: *«estoy viendo»* (por *estaba*),
*«tiene nombres»* (plural), *«un ingeniero»* (sin *industrial*), *«él en Villavicencio, ella en Yopal»*,
*«Ejemplo:»* delante de *mandar plata*, y el llamado partido en dos: la pregunta primero y *«Sea
empleado, empresario o gerente del hogar, pregúntele a Queswa»* después. El subtítulo lleva lo que se
oye.

---

## De dónde salió

**El ángulo es del Director.** El agente propuso para el lunes la semilla de Dan Sullivan (*¿con quién?*,
no *¿cómo?*); el Director trajo la luz verde del viernes: los primeros socios que se montaron en la
visión, y su común denominador, un *«¡ahora sí!»* ante lo que se construyó en lo tecnológico. La
creencia salió de ahí: uno juzga lo de hoy con la foto de cómo era antes. Sullivan queda para octubre,
donde lo tenía el plan.

**El párrafo del banco y el llamado final son del Director**; el trabajo fue gramática, puntuación y
cumplimiento (*«crear una empresa… se monta»* no concordaba; *«pregúntale»* pasó a usted).

⛔ **El contexto que dio** —que Maryi ya pagó, que Marlon hoy está desempleado, que tiene muchas mujeres
gerentes del hogar en su círculo— **no entró al guion**.

---

## Por qué quedó así

1. **Solo el nombre de pila** (Director). Con oficio y ciudad los cuatro se reconocen igual, y el nombre
   completo los vuelve identificables en historias públicas.
2. **Oficio y ciudad son lo que da la fuerza.** Cinco personas comunes, en cinco ciudades, sin conocerse,
   dicen lo mismo: eso se lee como tendencia. Uno solo se archiva como excepción (investigación del
   estigma, sep 2026).
3. **De Marlon no se dice que está sin empleo**: *«han trabajado en el sector público»* es cierto para
   los dos hermanos y no lo expone.
4. **Se quitó *«que dijeron que sí»*** tras *«los primeros socios»* (Director): ya estaba dicho.
5. **La gerente del hogar va en el llamado, no al lado de Maryi.** Pegada a ella (*«una empresaria con
   muchas mujeres…»*) y justo después de nombrar socios, se lee *«ella va a traer a muchas»*: gente detrás
   de alguien, la silueta de pirámide. En el llamado le habla directo a quien está mirando.
   *Gerente del hogar* es el término del Director para elevar el oficio; ninguna ama de casa se presenta
   así, pero lo entienden y les gusta.
6. **Lo que cambió se dice como hecho que se comprueba** —*se monta en queswa.app, y buena parte en
   WhatsApp*—, sin adjetivos, y *una empresa de distribución moderna* va con las cuatro palabras juntas.

---

## Lo que Queswa tiene que poder responder — auditoría del 28 sep

Dos corridas de `auditar-guion-queswa.mjs` sobre el texto aprobado, antes de grabar. Lo que se arregló:

- **Queswa no sabía quiénes eran.** Nota del día 22 en el prompt (v5.11), con Maryi (v5.12) y alineada con
  la grabación (v5.13); cierra con *«De ellos solo se sabe lo que dice el video»*. Salió el día 15 y
  entró el 19 (el Coyote), que nunca había entrado.
- **El llamado recibía dos preguntas, una por el tiempo libre de la persona.** El prompt pide ahora solo
  el oficio (v5.12). Verificado: *«Para mostrarle cómo se vería en su caso… ¿A qué se dedica usted?»*.
- **La nota ponía en boca de los socios una frase de Luis** (la de queswa.app): corregida (v5.12).
- **Las amas de casa caían en `PERFIL_02` 🔒**, la del independiente, dictada literal (*cada mes arranca
  en cero…*). Nace `PERFIL_03` (arsenal v6.61), con el índice en las palabras de ella (v6.62): gana
  *«yo no hago nada, el que trabaja es mi esposo»*, que era el ejemplo del Director.
- **«Soy ama de casa» se guardaba como el NOMBRE de la persona** (y *gerente del hogar*, *agricultor*, *de
  Bogotá*). Arreglado en `route.ts` (commit `e653068`): la lista negra mira también la primera palabra.

Lo que el juez marcó y **no** se tocó: la lista de espera (doctrina desde el 10 sep), el año 2026 (es
cierto) y *«qué tengo que hacer para empezar»* → las tres formas de empezar (regla del prompt).
⏳ Pendientes que no son de este video: *«¿qué es lo que se distribuye?»* no nombra los productos, y en
una conversación de dos turnos la reescritura de la consulta llevó *«Soy gerente del hogar»* a `WHY_01`.
**Y la regla del Director para el canal** (v5.14): a quien le diga que es ama de casa, Queswa le edifica
su labor y la trata como *gerente del hogar* — en una prueba el modelo lo había cambiado por *quien maneja
un hogar*. Lo que él ve en el uno a uno: muchas se quitan el mérito, y al oírlo se sienten reconocidas.

---

## Producción

**Audio del MP4 de la cámara**, no del micrófono: tras RNNoise, 42.6 dB de voz sobre el ruido contra 26.1
del DJI, que grabó a −52 LUFS. El WAV de la cámara da 45.0, pero va **77 ms adelantado** respecto al
video; se prefirió el del MP4, sin desfase.

**Un arranque en falso que solo cazó la transcripción del montaje.** Tras *«queswa.app»* hay un *«y…
bueno…»* (67.6–68.7 s), una pausa, y la frase entera en 70.1 s. Whisper sobre la fuente lo leyó como
*«y una buena parte»* con pausas largas; sobre el curado apareció *«y bueno y una buena parte»*. Se partió
la zona en dos y se descartó el tramo.

**Los avisos de cola corta eran falsos** (sala silenciosa, piso −71 dB): nueve cortes marcados con 0.18–0.24 s
tras la última palabra; medidos, en todos la energía ya estaba en el piso y la voz había terminado. Y
**los tiempos de Whisper iban adelantados** en cada arranque de frase (*«El»*, *«La»*, *«Y»*): la energía
muestra la voz subiendo justo donde abre el corte.

**Color:** con el LUT de la Osmo la cara queda en luma 82–91; píldora con `--lut`, sin corrección por clip.
**Blanqueamiento 0.21** y **música a volumen constante** (`--musica-lufs -30 --musica-vol 1.0 --sin-duck`),
como pidió el Director el día 15. Transcripción del curado contra el guion: 96.9 %, y las diferencias son
solo nombres que Whisper no conoce (*Marge*, *Fomec*, *Queso*); en la entrega, 96.6 % con las mismas. Los nombres propios se revisaron en pantalla: *Maryi*, *Fómeque*, *queswa.app* y *Queswa* salen bien escritos.

**La apertura, grabada aparte:** con el LUT la cara queda en 87–94 (el cuerpo, 82–91), sin salto de brillo; nivelada por separado (−24.7 LUFS, +8.7 dB) queda a −16.1 contra −17.1/−16.1 del cuerpo. Se unió ya retocada al cuerpo retocado y la píldora corrió una sola vez sobre el completo.
