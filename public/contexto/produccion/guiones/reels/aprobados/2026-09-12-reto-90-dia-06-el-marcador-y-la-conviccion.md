# Reto 90 días · Día 6 — «Les debo el marcador de la semana»

| | |
|---|---|
| **Fecha** | Sábado 12 de septiembre de 2026 |
| **Serie** | Reto de los 90 días (documentación en vivo) |
| **Estado** | ✅ **Emitido** — historias de Instagram y Facebook con sticker **«Qué estamos construyendo»** + WhatsApp (enlace escrito) |
| **Formato** | Vertical 9:16. **Un solo clip**, grabado en un centro comercial (ruido de fondo constante) |
| **Rejilla** | Se usó para el **marcador** que había quedado pendiente de la semana 1 (el viernes salió como pregunta real) |
| **Versiones** | Historia **1080×1920 · 59.0 s** con outro corto · −14.0 LUFS |
| **Entrega** | `~/Downloads/reels-equipo/0912/entrega/reto-dia6-historia.mp4` · y en Drive, `reto-90/salida/` |
| **Fuente** | `~/Downloads/reels-equipo/0912/` — `dia6-1.MP4` y `DJI_37_20260912_161713.WAV` |
| **Corte** | `~/Downloads/reels-equipo/0912/corte-dia6.json` (micrófono 1.319 s atrasado, constante) |
| **Enlace** | `https://creatuactivo.com/luis-cabrejo/queswa` |

---

## Guion (como se habló)

Sábado, día 6. Les debo el marcador de la semana, pero la verdad he hecho muy poco. La semana pasada me dio una ciática como nunca me había dado en la vida. Hubo días en los que no podía levantarme de la cama sin la ayuda de mis hijos. Arranqué el lunes con toda, pero el martes recaí. Fue casi como volver a ceros.

No es una historia triste, ya estoy mucho mejor, pero sentarme quince minutos al computador era demasiado. Un par de días se quedaron sin publicar. Y bueno, cuando se suman cosas, enfermedad, la familia en tres lugares diferentes de Colombia y no puedes trabajar, pues la moral se baja. Es normal, no soy de acero.

No les voy a decir que puse la mejor actitud porque mentiría. Lo que me mueve no es la actitud, es la convicción de lo que estamos construyendo.

Y las cosas malas a veces traen cosas buenas. Y esos días quieto me quedó claro qué es lo importante: después de Dios, mi salud, mi hogar, mi esposa, y sacar adelante este proyecto.

Hoy empecé a sentirme mejor de verdad. Me quedan dos días de esta semana y los estoy usando.

---

## De dónde salió

**El marcador cambió de historia cuando el Director contó su semana.** Los datos del canal daban
material técnico, pero lo que de verdad pasó fue que casi no pudo trabajar, y eso es exactamente lo
que la regla 3 pide: el marcador incluye lo que falló. La frase que sostiene la pieza la dijo de
pasada: *no puede decir que le puso buena actitud, porque no fue así*. En este tipo de contenido
todos dicen que le pusieron la mejor actitud; él dice que no.

---

## Por qué quedó así

1. ⭐ **La convicción va DESPUÉS del bajón.** Si aparece antes, el bajón se lee como que no fue tal,
   y se pierde lo que hace valioso el video.
2. ⛔ **«Lo que me mueve no es la actitud» no se quita** (Director, 12 sep). Se había propuesto
   quitarla para bajar de 60 s y él la defendió: sin ella, *«es la convicción…»* se queda sin sujeto.
3. **«No es una historia triste» va en medio, no al principio.** Al principio suena a que va a
   minimizar lo que sigue; ahí desactiva el lamento justo donde el relato podría caer en él.
4. ⛔ **Quedó fuera una promesa con fecha** sobre lo que se vería en los próximos días. El plazo es
   justo donde vive la prohibición que protege el canal con Meta y con el Estatuto del Consumidor,
   aunque lo prometido no sea dinero.
5. **Sin número de conversaciones**, por el mismo motivo del día 5: invita a juzgar la cifra.
6. ⛔ **Lo que la gente le cuenta al canal no va al video.** Esa semana hubo conversaciones sobre
   condiciones de salud, una grave. No se usan ni en agregado.
7. **«Qué es lo importante» sembró la semana 2** sin buscarlo. El lunes 14 la recogió.

**El sticker.** Se recomendó **«Qué estamos construyendo»**: recoge sus propias palabras (*«la
convicción de lo que estamos construyendo»*) y responde la curiosidad que el video deja abierta. En
WhatsApp, con el enlace escrito: *«Por si le quedó la duda de qué estamos construyendo:»* y debajo
el enlace. Confirmado por el Director: ese fue el texto publicado.

---

## Producción

⭐ **Los huecos que el Director oyó eran murmullo, no pausas.** El ruido del centro comercial se
sienta en +5 a +13 dB sobre el piso y la voz en +20 a +36; con la apertura de las islas en +10 se
abrían cortes sobre ruido. Con la apertura en **piso+18** se fueron 7.5 s de nada.

⛔ **Antes de eso se le dijo que el cuerpo tenía «59.4 s de voz real» y que para llegar a 60 había
que quitar frases.** Era falso: la medición contaba el murmullo como voz. Se llegaron a quitar tres
frases; con el umbral corregido volvieron las tres y el guion entró completo en 59.0 s.

**Cuatro palabras átonas se perdían sin que nada avisara**: *ayuda*, *mentiría*, el *«Es»* de *«Es
normal»* y el *«Me»* de *«Me quedan»*. Se rescataron uniendo islas separadas por menos de 0.40 s y
bajando el umbral de cierre solo en sus zonas. Lo que las encontró fue transcribir el montaje y
compararlo contra el guion, no el verificador.

**Outro corto** (1.42 s en vez de 3.1): el logo congelado del medio se recorta. **Retoque facial**
`--fuerza 0.85 --piel 0.45`. Detalle técnico de todo lo anterior → `scripts/dankoe-video/PIPELINE.md`.

⚠️ **Las gafas de sol** tapaban justamente lo que este video necesitaba mostrar. Se señaló y no se
tocó.
