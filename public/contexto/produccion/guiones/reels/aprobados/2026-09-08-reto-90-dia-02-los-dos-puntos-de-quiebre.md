# Reto 90 días · Día 2 — «Los dos puntos de quiebre»

| | |
|---|---|
| **Fecha** | Martes 8 de septiembre de 2026 |
| **Serie** | Reto de los 90 días (documentación en vivo) |
| **Estado** | 🎬 **Grabado y montado** — pendiente de publicar |
| **Formato** | Talking-head a cámara, plano cerrado, DJI Osmo Pocket 3 + micrófono DJI |
| **Versiones** | Muro **93.4 s** (con outro) · Historia 1 **54.8 s** · Historia 2 **38.7 s** (con outro) |
| **Entrega** | `~/Downloads/reels-equipo/0908/reto-dia2-{muro-final,historia-1,historia-2}.mp4` |
| **Fuente** | `~/Downloads/reels-equipo/dia-2.MP4` — HEVC 1728×3072, 10 bits, 23.976 fps, 1.33 GB |
| **Trabajo** | `scripts/dankoe-video/captions/work/work-d02/` |

---

## Guion (como se habló)

Ayer les conté que estoy armando el equipo base, he hablado con varias personas y me encontré con una pregunta que no esperaba: ¿y a usted qué lo movió a empezar?

Y puedo hablarles de dos momentos. El primero, a mis 40 años, cuando me di cuenta que por mucho que hubiera trabajado, mi vida era un mismo ciclo: trabajar, pagar cuentas y repetir.

Es más, les puedo contar una historia. Cuando estaba de novio con mi esposa, la llevé al Mirador Buena Vista, en los Llanos Orientales, y allí le hice tres promesas. Le dije: nena, mira, cuando estemos casados vas a poder vivir en casa de campo, vas a poder ir de compras cada vez que quieras, y tendremos tres hijos.

Permítanme confesarles: para cuando habíamos cumplido 14 años de casados, solamente le había cumplido con los tres hijos.

No era que no trabajara, no era que no me esforzara. Es más, trabajaba 15 horas diarias. Pero a nivel financiero me sentía como en una bicicleta estática: yo sentía que le daba, le daba, le daba, pero siempre a nivel financiero estaba en el mismo punto.

El segundo momento llegó después, desarrollando el mercado de una línea de productos premium de bienestar.

Ahí entendí que lo ganador de un negocio no es iniciarlo, es multiplicarlo. Porque negocio puede tener casi todo el mundo: el de la tienda, el del restaurante, la inmobiliaria, el vendedor. Y está bien.

Lo que casi nadie tiene es un negocio que escale, que se multiplique sin que usted tenga que estar encima.

Por eso creamos CreaTuActivo.com y Queswa.app, para poner la independencia financiera al alcance de cualquiera.

Y no hablo de hacerse millonario, hablo de tranquilidad.

Así que en esta nueva etapa sigo en lo mío: armar el equipo base.

---

## El corte en dos actos

La historia 1 termina en la bicicleta estática; la 2 abre en *«El segundo momento llegó después»*. **El corte no se eligió: estaba escrito en el guion**, y como el pivot musical caía ahí, cada mitad quedó con una sola cama —suspenso la primera, corporativa la segunda— sin forzar nada. Se publican seguidas, en ese orden.

---

## Por qué quedó así

1. **La improvisación mejoró el guion escrito, y por eso se conservó tal cual.** Cuatro cambios que el Director hizo grabando: *«le dije: nena, mira»* —diálogo real, que convierte el recuerdo en escena—; *«lo ganador de un negocio no es iniciarlo, es multiplicarlo»* en vez de *«lo difícil no era el negocio»*; *«no era que no me esforzara»* sumado al esfuerzo; y los ejemplos de negocio cambiados a **tienda · restaurante · inmobiliaria · vendedor**, que suben el registro. El borrador decía *aguacates en la esquina* y era un riesgo: miraba por encima del hombro a su propio mercado.
2. ⭐ **«Negocio tiene casi todo el mundo» corrigió un error de fondo.** El borrador cerraba con *«para que construir un negocio propio deje de ser cosa de unos pocos»* y el Director lo rechazó con el dato: en Colombia la mayoría **ya tiene** un negocio, informal o no, y vive de él. Tener negocio no es lo escaso. **Lo escaso es un negocio que escale**, y ahí es donde entra lo que ofrecemos. La línea *«y está bien»* no sobra: sin ella, nombrar la tienda suena a desprecio.
3. **«Escalar» y «multiplicar» van juntas, por decisión del Director.** Buena parte de su mercado natural son empresarios, que dicen *escalar* con naturalidad; pegarle el eco —*«que se multiplique sin que usted tenga que estar encima»*— se lo traduce a quien no la usa. Es la técnica de Mario Alonso Puig: la palabra de experto y, en la misma frase, la imagen que la aterriza. ⚠️ Esto **retira el veto** que tenía *escalar* en el léxico.
4. **La aspiración va en dos tiempos.** Primero la palabra grande —*independencia financiera*— y enseguida el aterrizaje: *«no hablo de hacerse millonario, hablo de tranquilidad»*. Sola, la primera suena a promesa; sola, la segunda se queda corta para el empresario. Juntas cubren a los dos, y la segunda es literalmente lo que el Director oye decir a la gente.
5. **Se retiró «democratizar»** — quedó *«al alcance de cualquiera»*, la misma idea sin palabra de conferencia.

---

## Producción

**Un solo render.** Se montó el muro completo y de ahí se cortaron las dos historias en el pivot (54.72 s), así los tres se ven idénticos y se ahorra la mitad del trabajo.

**Color: LUT + recuperación fuerte.** ⚠️ **La toma quedó subexpuesta** — luma media de la fuente **56**, contra **76** del Día 1. Se recuperó con `eq=brightness=0.20:contrast=1.06:saturation=1.08` después del LUT (el Día 1 usó 0.085), viñeta suavizada a `PI/8` y grano bajado a `alls=4`, porque en poca luz el sensor ya aporta el suyo. Aun así el resultado es más oscuro que el del Día 1: **de una toma subexpuesta no se saca luz que no se grabó.** Para la próxima, una fuente de luz más al frente.

**Audio:** pausas atenuadas −24 dB (8.3 s en total), cama suspense 0.65 → Pulse 1.00 en el pivot con `whoosh_up` un cuarto de segundo antes, mezcla voz-anclada a **−14.5 LUFS**.

**Subtítulos** karaoke `y=0.76`, máx 3 palabras. Texto de pantalla corregido: *cuarenta → 40*, *catorce → 14*, *quince → 15*, *«CreaTuActivo punto com» → CreaTuActivo.com*, *«Queswa punto app» → Queswa.app*, y signos de interrogación restituidos en la pregunta de apertura.
