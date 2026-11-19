# Reto 90 días · Día 74 — «Amapolas»

| | |
|---|---|
| **Fecha** | Jueves 19 de noviembre de 2026 · semana 11 |
| **Estado** | Grabado por el Director (toma `amapolas.mp4`). Montaje v2 (19 nov), con las gráficas de la empresa normal y la moderna. **Publicado** por el Director el 19 nov |
| **Formato** | Vertical 9:16, selfi con el teléfono, 1080×1920. Toma de 51,6 s; entrega de 48,2 s (cuerpo 45,0 s + outro 3,1 s), −14,5 LUFS. Cabe en una sola tarjeta de historia (60 s) |
| **Toma** | `amapolas.mp4` (Drive del Director), grabada en la pastelería Amapolas, Villavicencio. Teléfono, 30 fps, Rec.709, con metadato de rotación |
| **Enlace** | ⏳ Por confirmar con el Director. El video cierra con «pregúntenle aquí a Queswa»: el mismo enlace de los días 69 y 73 (`creatuactivo.com/{slug}/queswa`) |

---

## Guion (como va en el subtítulo)

Me han dicho: «Luis, ¿es que usted no trabaja o qué?». No, sí trabajo. Lo que pasa es que hay formas de trabajar. Esta es la forma tradicional, en la que uno hace todo, y esta es la forma en que uno delega.

Pero bueno, antes les muestro por acá un lugar muy agradable en Villavicencio: Amapolas. Tortica, tortica rica, el café que no puede faltar.

Y bueno, ¿cómo así que delegar? En la empresa normal uno hace todo: fabrica, atiende, despacha, hace mil cosas. En la empresa moderna uno delega: alguien fabrica, alguien atiende a las personas, y una herramienta digital también se encarga de escalar el negocio y multiplicar.

Eso es todo. Si quieren conocer un poco más, pregúntenle aquí a Queswa.

---

## Por qué quedó así

1. **El subtítulo lleva lo que se oye** (regla 7 del README), con tres decisiones:
   - *«Tortica, tortica rica, el café que no puede faltar»* va como lo citó el Director (19 nov). Whisper oía «Tortica… carica» y un «Bueno» antes de «el café»; en un café ruidoso el modelo no decide.
   - *«multiplicar»*: dos transcripciones decían «multiplicarlo» y dos «multiplicar». La energía de la palabra tiene cuatro sílabas y nada después, así que va «multiplicar».
   - *«pregúntenle»*, en plural: tres de cuatro transcripciones lo oyen así, y la toma habla a «ustedes» desde «les muestro». *Queswa* va bien escrito; whisper oía «Queso».
2. **Léxico**: «escalar» va junto a «multiplicar», como pide la regla. Se dice «la empresa moderna», sin «de distribución», y eso no se puede corregir en el audio. Lo que cuenta la toma son los tres elementos: alguien fabrica, alguien atiende y una herramienta multiplica.
3. **Cumplimiento**: no hay cifras de ingreso, plazos ni declaraciones de salud. La torta y el café van como lugar y antojo, sin producto de Gano.

## Cortes del montaje (segundos de `amapolas.mp4`)

| Tramo | Qué es |
|---|---|
| 0–0,96 | Arranque |
| 6,1–6,5 | Pausa recortada a ~0,5 s |
| 17,85–19,75 | Sonrisa quieta antes de girar el teléfono a la mesa |
| 26,95–27,6 | Vuelta del teléfono a la cara (barrido) |
| 31,8–32,2 | Pausa recortada a ~0,5 s |
| 49,3–51,6 | Cola |

La toma de la mesa (19,75–26,95) va entera. La v1 interna la había partido y se comía «tortica rica», hasta que el Director lo señaló. Las pausas se dejaron naturales, hasta ~0,7 s, porque el día 73 el Director pidió que respiraran.

**Ruido de café** (piso −26,5 dB, la voz apenas 10 dB por encima): RNNoise sí va (`rnnoise` por defecto), al revés del día 73. El detector de islas se corrió sobre el audio limpio (piso −48,7 dB) y solo sirvió para ubicar las fronteras; el corte va a mano.

**El montaje se quedaba sin memoria** (16 GB): seis `trim` sobre la misma entrada rotada encolan cuadros crudos. Se resolvió rotando primero la toma a 1080×1920 (`amapolas-v.mp4`, CRF 14). El verificador avisa de «Amapolas truncada» con 0,07 s de cola, pero es falso: la energía cierra la palabra en 17,3 s y el corte va hasta 17,85.

Comprobación: el curado se transcribió completo por tramos y están todas las frases. Sin LUT (es teléfono, Rec.709). Retoque de dientes 0.35 y piel 0.45; la boca se trató en el 87 % de los cuadros, porque el resto es la mesa. Rótulo «JUEVES · DÍA 74» en los primeros 3,8 s. Entrega en `entregas/reto-90/reto-dia74.mp4` y `reto-dia74-liviano.mp4` (720p), 22 y 4,6 MB.

## v2: las gráficas en el estilo de la Presentación (Director, 19 nov: «mismo estilo de gráficas»)

De 26,25 a 40,35 s del cuerpo, el video pasa a una escena dibujada a pantalla completa; la voz sigue y los subtítulos van encima. Vuelve a la cara en «Eso es todo». El vocabulario es el del deck: `CicloPropiedad.tsx` y los íconos de los tres elementos de la pantalla 5. La figura humana es una persona, el cubo crema es «Su empresa», el cian es Queswa y el único oro es la multiplicación. Cada cosa entra con la palabra que la nombra (alineación forzada de la píldora):

1. **La empresa normal:** «Usted» al centro. Con «fabrica», «atiende» y «despacha» entra cada tarea en su tarjeta, conectada a usted, y con «mil cosas» le llueven puntos encima y la figura tiembla.
2. **La empresa moderna:** con «delega», usted suelta el peso y sube, pequeño, sobre su empresa (el cubo). La caja de despachar se funde en la fábrica (Gano fabrica y despacha). «Alguien fabrica» enciende la fábrica, con una línea de oro hacia la empresa. «Alguien atiende a las personas» enciende la conversación en cian, con tres personas. «Herramienta digital» trae el celular, y con «escalar» y «multiplicar» su empresa pasa de 1 a 2 y de 2 a 4 cubos, en oro: «Se multiplica».

Los rótulos repiten las palabras de la voz («La empresa moderna», sin «de distribución», porque así se dice). Fuente y receta en `scripts/dankoe-video/graficas/`.

## Lo que Queswa tiene que poder responder

Quien escriba puede preguntar «¿cómo así que delegar?», «¿quién fabrica?» o «¿qué herramienta digital?». Lo responden la doctrina de los tres elementos (`WHY_01`, `EAM_01`) y el fragmento de la empresa de distribución moderna. Nadie va a preguntar por Amapolas. ⏳ Fragmento `RETO_D74` sin proponer; auditoría (`scripts/auditar-guion-queswa.mjs`) sin correr.
