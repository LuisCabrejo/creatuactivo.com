# Reto 90 días · Día 67 — «La bicicleta estática»

| | |
|---|---|
| **Fecha** | Jueves 12 de noviembre de 2026 · semana 10 |
| **Estado** | ✅ **Aprobado** por el Director (12 nov), sobre la segunda toma. Montaje pendiente |
| **Formato** | Vertical 9:16, hablado a cámara, 1080×1920. Toma de 146.7 s; unos 90 s después de los cortes. No cabe en una tarjeta de historia: va como reel o en dos tarjetas |
| **Toma** | `villavicencio4.mp4` (Drive del Director). La primera, `villavicencio3.mp4`, se descartó |
| **Enlace** | Va escrito en el pie del video, no como sticker (Director). Texto ⏳ |

---

## Guion (como se oye en la toma aprobada)

Hoy es mi tercer y, por ahora, último día en mi tierra llanera. Y me voy con una mezcla rara: emoción por todo lo que ha pasado estos días, y nostalgia por lo que ya empiezo a extrañar.

¿Sabe qué encontré acá? Lo mismo que en el Eje Cafetero. Gente trabajadora, que siente que por más que se esfuerce, las deudas y los compromisos siempre le llevan la delantera. Como en una bicicleta estática: uno le da y le da, y siente que está siempre en el mismo punto.

Y no es cosa de una región. En Colombia, más de la mitad de las personas que trabajan lo hacen en la informalidad. Y tres de cada cuatro personas en edad de pensionarse no reciben ninguna pensión.

Pero miren lo que ha pasado en estos años. WhatsApp nos resolvió las llamadas a otro país. Nequi y Nubank nos sacaron de la fila del banco. La tecnología volvió sencillo lo que era complicado.

Con tener una empresa hoy pasa lo mismo. Usted puede ser dueño de una empresa de distribución moderna y manejarla desde el celular, sin saber de tecnología. Usted comparte un enlace. Queswa, nuestra herramienta, atiende a quien llega y le explica. Y Gano Excel, con más de 30 años en 60 países, fabrica y despacha los productos. Cada cliente que llega por su enlace queda a su nombre, y cuando vuelve a comprar, a usted le queda un porcentaje.

Hoy el empresario no tiene que ser dueño de las piezas. Tiene que ser dueño del sistema.

Aquí abajo les dejo un video de cuatro minutos donde se ve cómo funciona. Mírenlo con calma.

---

## De dónde salió

El Director grabó en Villavicencio, en su tercer día en los Llanos, a partir de una idea suya: los problemas que oyó allá son los mismos del Eje Cafetero. La primera toma (`villavicencio3.mp4`, 123 s) se descartó y el guion se reescribió sobre sus propias frases —la bicicleta estática, WhatsApp y Nequi, piezas y sistema—. La segunda toma es la aprobada.

## Por qué quedó así

1. **La primera toma traía tres frases que no podían salir.** La cifra de pensión quedó invertida (*«de cada cuatro, solamente tres reciben una pensión»*; la fuente dice que tres de cada cuatro **no** la reciben). *«Usted tendría un porcentaje todos los días, todas las semanas»* es promesa de ingreso con frecuencia y sin su causa. Y *«la solución a este problema social»* promete resolver la deuda y la pensión. Por eso se regrabó en vez de cortar.
2. **El porcentaje va atado a su causa**: el cliente que llega por su enlace queda a su nombre, y cuando vuelve a comprar, queda un porcentaje.
3. **El contexto va dentro del video** (Director): quien no abra el enlace debe saber al menos que hay algo empresarial, que se maneja desde el celular y que no exige saber de tecnología. Es el quinto párrafo, con quién hace cada parte.
4. **Sin «solución» ni «oportunidad»**: el puente es *«la tecnología volvió sencillo lo que era complicado»*.
5. **La informalidad se dice sobre las personas que trabajan**, que es lo que mide el DANE; la primera toma decía «de las personas».
6. **Usted y ustedes conviven**, como se oye: el cuerpo va en usted, y *«miren»*, *«les dejo»* y *«mírenlo»* en plural. No se corrige en el subtítulo.
7. **«En 60 países»**, sin «más de»: es lo que se oye, y es cierto.
8. **Las cifras llevan su fuente en pantalla**, como en los días 58 y 64: 54,6 %, DANE, GEIH, mayo a julio de 2026 · Colpensiones y Universidad Javeriana, 2022. La de los nueve de cada diez hogares no va en este video.

## Cortes del montaje (segundos de `villavicencio4.mp4`)

Medidos con la transcripción palabra por palabra; antes de cortar se afinan con el detector de islas ([PIPELINE.md](../../../../../../scripts/dankoe-video/PIPELINE.md)).

| Tramo | Qué es |
|---|---|
| 0–10,5 | Silencio antes de empezar |
| 34,3–39,7 · 45,4–49,4 · 59,6–69,1 · 80,3–88,2 · 108,6–113,9 · 120,6–125,5 · 129,5–134,0 | Pausas entre bloques |
| 134,0–135,6 | Arranque en falso: «Aquí abajo les dejo un enlace» |
| 141,0–142,0 | Primer «Mírenlo con calma» (queda el segundo) |

## El enlace

El video de cuatro minutos es la presentación en video (`VIDEO_PLAN_SERVILLETA`, 3:55), que se abre con el botón de la pantalla 1 de `/servilleta`. El enlace que lleva ahí con el identificador del socio es `creatuactivo.com/{slug}/presentacion`: en el celular, con socio, el botón del video es lo primero que se ve. ⚠️ `/{slug}/video-plan` no sirve: lleva al video anterior, de seis minutos.

## Lo que Queswa tiene que poder responder

⏳ La auditoría (`scripts/auditar-guion-queswa.mjs`) no se ha corrido: la sesión donde se trabajó el guion no tenía acceso a la base. Tampoco existe todavía el fragmento `RETO_D67` ni se movió `RETO_MAS_RECIENTE`.
