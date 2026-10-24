# Reto 90 días · Día 48 — «No llegué solo»

| | |
|---|---|
| **Fecha** | Sábado 24 de octubre de 2026 · rótulo **«SÁBADO · DÍA 48»**. Festivo en el Eje Cafetero |
| **Estado** | 🎬 **Montado**, entregado al Director |
| **Numeración** | Por calendario (día 1 = lunes 7 sep). Esta semana se publicó cada día salvo el viernes 23 (día 47) |
| **Sticker** | Lo aplicó el Director en Instagram y Facebook |
| **Formato** | Vertical 9:16, hablado a cámara, grabado **con el celular** (no con la cámara ni el micrófono de solapa) |
| **Rejilla** | Sábado = pregunta real; hoy el ángulo lo puso el Director: más cerca del formato humano del domingo (las personas que lo formaron, el día de fiesta y la familia) |
| **Fuente** | Drive, carpeta `Documentacion/` — `queswa-video-2026-10-24-1146.mp4` (36 MB) |
| **Versiones** | Una sola historia: **37.8 s** (cuerpo 35.8 s + outro 2.0 s) · −14.0 LUFS |
| **Entrega** | Rama temporal `video-dia-48-entrega` (`reto-dia48-historia.mp4`); el original llegó por el release `video-dia-48`. Las dos se borran tras descargar |
| **Enlace** | `https://creatuactivo.com/luis-cabrejo/queswa` |

---

## Guion (como se grabó)

Hoy estamos de fiesta en el Eje Cafetero, pero a primera hora tuve una reunión con una empresaria visionaria: Yellitza Rosario.

Ella fue la persona que me sembró una visión y me ayudó a pensar en grande. No llegué solo a donde estoy. Estaba rodeado de personas mejores que yo, y en gran medida, de mujeres.

Hoy les compartiré detalles del detrás de cámaras de construir una maquinaria de distribución en toda América. Y aunque mi ética de trabajo es el trabajo duro, no todo es trabajo. Hoy voy a compartir con muchos colegas, con mi esposa y con mi hija, en este día de fiesta.

**Frente al texto aprobado:** no dijo *«Sábado, día 48»* (lo pone el rótulo); dijo *«Estaba rodeado»*
(por *he estado*) y *«Y aunque»*. El subtítulo lleva lo que se oye. ⚠️ *Estaba* y *mejores* los dio la
comparación de dos modelos (Parakeet oyó *menores*; Whisper, *mejor*): si el Director oye otra cosa, manda él.

---

## De dónde salió

**El texto es del Director.** Su primera versión partía de un recuerdo de la reunión con Yellitza:
*«vamos a poner este producto en las alacenas de todos los hogares de América»*, y una cuenta de lo
que ganaría si cierto número de personas consumía el producto. El agente propuso beats y un borrador.
Después el Director entregó el texto propio de arriba, y el trabajo fue solo gramática y puntuación.

## Por qué quedó así

- ⛔ **Sin la cifra de ingreso de la reunión** (ni el número de personas ni la cantidad mensual): una
  cifra de ingreso en cámara es la primera prohibición del reto, aunque la diga otra persona en una cita.
  El Director rehízo el texto sin ella, y el giro pasó de la cuenta a **las personas**: *no llegué solo*.
- *«Donde estoy no lo hice solo»* → **«No llegué solo a donde estoy»** (el *lo* no tenía a qué referirse).
- *«maquinaría»* → **«maquinaria»**. *Maquinaria de distribución* es sinónimo vivo del sistema y se queda.
- El cierre repetía *«en el Eje Cafetero»*, que ya abre el video: quedó en *«en este día de fiesta»*.
- Se avisó al Director que *compartir* suena dos veces seguidas; quedó a su criterio.

## Lo que Queswa tiene que poder responder

Quien escriba después de este video puede preguntar quién es Yellitza Rosario o qué es el detrás de
cámaras. ⏳ La nota del día para el prompt y la rotación de los videos (en el prompt siguen el 43 y el
44; el 45 y el 46 no entraron) quedan pendientes: el Director pidió hoy solo el video. Auditoría
(`scripts/auditar-guion-queswa.mjs`): ⏳ no se corrió.

## Producción

Montado en la sesión en la nube, sin el Mac, y por eso con tres sustituciones que hay que saber:
- **Transcripción y tiempos**: huggingface.co estaba bloqueado (sin faster-whisper ni el alineador MMS).
  Se usó Parakeet TDT 0.6B v3 y Whisper small de sherpa-onnx (releases de GitHub); los tiempos de
  palabra salen de Parakeet, y los bordes de corte, del detector de islas de PIPELINE.md (apertura `piso+18`,
  cierre `piso+10`), más el arranque de las átonas que la apertura deja fuera.
- **Marca de agua y outro**: `captions/work/_assets/watermark.png` y `motion/out/outro.mp4` no están en
  el repositorio. La marca se hizo con `motion/assets/creatuactivo_text.png` (330 px, 22 %) y el outro, de
  2.0 s, con `emblema.png` + ese texto + `finale_boom.wav`. ⚠️ No son los canónicos.
- Celular (no Osmo): **sin LUT**. Retoque `--fuerza 0.35 --piel 0.45` (boca en 1290 de 1290 cuadros).
  Pausas de más de 0.75 s recortadas (43.1 → 35.8 s). Música `pulse-corporate` a −30 LUFS × 1.0,
  constante (como el día 22). Sin compuerta: con el murmullo del restaurante habría bombeado.
