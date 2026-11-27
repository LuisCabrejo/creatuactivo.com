# Reto 90 días · Día 79 — «El tablero del rey»

| | |
|---|---|
| **Fecha** | Martes 24 de noviembre de 2026 · semana 12. Escrito para el lunes 23 (día 78), que no se publicó; la numeración sigue la fecha, como con los días 47 y 49 |
| **Estado** | Grabado (24 nov) y montaje aprobado por el Director (24 nov), v5. Abre con la leyenda, sin la línea del día, a propósito: así el gancho es lo primero que se oye (Director). El día lo pone el rótulo «MARTES · DÍA 79» |
| **Rejilla** | Lunes = la creencia. La creencia es que una base de miles es para otros, o que toma media vida; el ejercicio de Los 12 Niveles la desarma sin nombrarla |
| **Formato** | Vertical 9:16, selfi en un balcón al atardecer, a contraluz. Una sola toma corrida de 106 s (Osmo Pocket, 1080×1920, 47,95 fps) con el micrófono DJI aparte; entrega de 91,1 s (cuerpo 88,0 s + outro 3,1 s), −14,4 LUFS |
| **Gráfica** | Dos escenas: el tablero de la leyenda y las doce casillas, sin pesos |
| **Enlace** | ⏳ Sugerido: `creatuactivo.com/{slug}/12-niveles` (abre la presentación en el simulador). Por confirmar con el Director |

---

## Guion (como va en el subtítulo)

Cuentan que, cuando el inventor del ajedrez le presentó el juego al rey, el rey quedó tan encantado que le dijo: «Pida lo que quiera».

El inventor pidió algo que parecía muy poco: un grano de trigo en la primera casilla, dos en la segunda casilla, cuatro en la tercera casilla, y así, el doble en cada casilla.

El rey casi se ofende. ¿Solo trigo? Y mandó que le pagaran.

Al día siguiente, sus sabios le dieron la noticia: en todo el reino no había trigo suficiente para pagarle.

El rey no se equivocó por ingenuo. Se equivocó como nos equivocamos casi todos: juzgó por cómo empieza. Y al principio, el doble de muy poquito se ve muy poco.

Con un negocio pasa igual. Cuando uno se imagina miles de clientes, se imagina a sí mismo hablando con miles de personas, y eso cansa antes de empezar.

Pero los miles no se consiguen: se construyen, de a pocos. En nuestro negocio de lavadoras empezamos con un cliente, y en dos años teníamos casi 1.500. No hablamos con 1.500 personas: atendimos bien a unas pocas, y ellas nos recomendaron.

Aquí funciona igual, con una diferencia: la tecnología, que pone compartir a un clic. Usted no ayuda a miles. Ayuda a dos personas a empezar su propio negocio, y cada una hace lo mismo. Como en el tablero del rey, al llegar a la casilla 12 o al nivel 12, son 8.190 familias con su propio negocio.

Y ninguna tuvo que conocer a miles. Cada una ayudó a dos.

Si quiere ver el tablero completo, pregúntele a Queswa por Los 12 Niveles.

---

## Montaje (v5, aprobada)

**Subtítulo = lo que se oye** (regla 7): «dos en la segunda **casilla**», «cuatro en la tercera **casilla**», «el doble de **muy** poquito se ve **muy** poco», «**No hablamos** con 1.500 personas», «la casilla 12 **o** al nivel 12», «**sus** sabios» (Director: el texto y el audio están correctos). En «cada una hace lo mismo» dos transcripciones oyen *uno* y una *una*; va *una*, como el guion. El «Súper. Genial.» del final de la toma sale.

**Corte** (`~/Downloads/reels-equipo/1124/work/corte-dia79.json`): una toma, desfase del micrófono −0,10 s constante, RNNoise sí (piso −57,6 dB). Pausas de más de 0,9 s recortadas a ~0,45 s, en 13 segmentos; cortar cada pausa (41 islas) daba un salto cada segundo y medio en una toma corrida. ⚠️ El detector de islas dejó fuera «a un clic», dicho suave: lo cazó la transcripción del montaje («la tecnología que pone compartir.») y el segmento se alargó de 79,84 a 80,25 s.

**Gráficas** (`scripts/dankoe-video/graficas/dia79-*.html`, tiempos del cuerpo):

| Tiempo | Qué va |
|---|---|
| 10,6–19,5 | `dia79-a-tablero`: el tablero de 8×8 se llena con la leyenda (1, 2, 4 con su palabra; desde «y así», la cascada) |
| 26,3–32,5 | El mismo tablero, lleno; en «trigo suficiente» sale el total de las 64 casillas: 18.446.744.073.709.551.615 granos. Se sostiene hasta «El rey no se equivocó por ingenuo» para que se alcance a leer (Director) |
| 68,7–81,15 | `dia79-b-casilla-doce`: «Usted ayuda a dos» → «Cada una hace lo mismo» → «Casilla doce»; doce casillas en rejilla de 4×3, cada una un celular con su cuenta, y el 8.190 en oro con «familias con su propio negocio». Vuelve a la cara en «Y ninguna tuvo que conocer a miles» |

**Color** (sin LUT: la toma viene en Rec.709, y el LUT de la Osmo la hundía). Cara en luma 26 contra cielo en 162, a contraluz. Curva de medios con techo (`0/0 0.04/0.11 0.10/0.32 0.20/0.49 0.40/0.66 0.62/0.73 0.80/0.85 1/0.97`), saturación 1,2, y dos máscaras por luminancia: 5000 K por debajo de luma 115 (cara) y 7600 K por encima de 150 (cielo). La primera versión calentaba solo la cara y el Director vio la cara y el fondo en el mismo gris: el cielo frío los separa. `pildora.py --sin-halo` por el cielo.

**Retoque:** dientes a `--fuerza 0.04` (Director: 0,35 «exagerado» → 0,10 → 0,05 → 0,04), piel 0,45. ⚠️ El retoque corre antes del color, y una curva que levanta tanto las sombras **multiplica** el aclarado de los dientes: con un contraluz así, la fuerza va muy por debajo de la de siempre.

Entrega: `~/Downloads/reels-equipo/1124/entrega/reto-dia79.mp4` (91,1 s) y `reto-dia79-liviano.mp4` (720p), copiadas a `Mi unidad/videos/reto-90/salida/`. Rótulo «MARTES · DÍA 79» en los primeros 3,8 s y outro completo.

## De dónde salió

El Director pidió el gancho de cómo ayudar a 8.190 personas en un año empezando con dos distribuidores, en el estilo de Elon Musk y David Vélez: mostrar que hay un plan y tecnología para que pase, con la gráfica de Los 12 Niveles. Las objeciones (ganar a muy largo plazo, quemar los barcos, invertir mucho tiempo) eran **contexto**: la presentación misma es la respuesta, y no se nombran. Las historias de los vehículos y de las lavadoras son suyas, contadas como las cuenta en sus presentaciones, igual que el párrafo del acompañamiento. De Musk y Vélez se usan las mecánicas, no los nombres: la cifra imposible dicha sin adornos y reducida a su principio, y la tecnología que vuelve sencillo lo complicado.

## Por qué quedó así

1. **Tres versiones.** La primera contaba la duplicación («usted conecta dos, ellos conectan a otros dos») y respondía las objeciones una por una: el Director la rechazó porque los distribuidores parecían piezas y gritaba «pirámide». La segunda puso a los socios antes del número. La tercera, la aprobada, cambia el centro: nadie llega a miles de clientes de un momento a otro; se construye con pocos bien atendidos que recomiendan, como en las dos historias del Director, y la tecnología lo vuelve sencillo y escalable.
2. **El plazo va con su condición a la vista.** «Si cada uno lo logra en una semana… si le toma un mes…»: es un cálculo, no una promesa, y deja que el ritmo lo ponga cada uno. Sin el *si*, la frase vuelve a sonar a promesa.
3. **«Aquí funciona igual»**, no «puedo asegurarle que aquí es igual»: *asegurarle* cerca de cifras se oye como garantía.
4. **«Sin que nadie les pagara por hacerlo»**, no «sin necesidad de tenerles un plan de compensación»: nombrar el plan ahí invita a completar «aquí sí le pagan por recomendar», que es el marco del reclutamiento.
5. **El abandono no se nombra.** «No lo dejamos solo» se lo recuerda a quien no lo traía; «hasta que camine solo» le responde a quien sí.
6. **Se asume la responsabilidad del acompañamiento, no la del éxito.** «El éxito del nuevo distribuidor es nuestra responsabilidad» es una oferta que el Estatuto del Consumidor vuelve exigible; el acompañamiento sí depende de nosotros. «De clase mundial» se cambió por un hecho que se ve: sencilla de manejar, que cabe en el celular.
7. **Los ingresos van detrás de su causa** (los clientes que vuelven a comprar). Sin ella, «un activo que le da ingresos semana a semana» es promesa de ingreso pasivo.
8. **Sin «Gano fabrica y despacha» ni «Queswa atiende»** (Director). En su revisión final quitó además «de a dos, y bien atendidos», «para que atender bien sea fácil, y lo demás llegue como consecuencia» y la línea de apertura del día.
9. **«Negocio digital»** vuelve como en el día 77, por decisión del Director para estos videos.
10. **«Escalable» sale por el test de la abuela** (Director: es la palabra correcta, pero no la de una abuela de 75 años). Queda lo que significa: «llega a muchas más personas». Él sumó «más rápido».
11. **Versión final: la leyenda del ajedrez (Director, 23 nov).** La versión de las doce semanas se sentía «muy numérica y no empática». El Director pidió el ángulo del inventor del ajedrez y el rey, con tono empático, para que la lógica llegue con un «ajá»: el rey no se equivoca por ingenuo, sino como casi todos, juzgando por cómo empieza. Salieron: la apertura «Mucha gente me dice: “Eso no es para mí”» (no favorece la prueba social), la historia de los tres meses vendiendo vehículos (le da la razón a quien teme tener que perseguir gente), la condición de tiempo, el párrafo del acompañamiento y el propósito de los 4 millones. Se corrigió una frase: «y cada una hace lo mismo», sin la cual el salto de dos a 8.190 no se ve, y «como en el tablero del rey» en lugar de «igual que el rey y el juego de ajedrez». El tablero se detiene en la casilla doce: el trigo del reino es de la leyenda, no una promesa.

## Lo que Queswa tiene que poder responder

«¿Qué es lo del tablero del rey?», «¿Qué son Los 12 Niveles?» y «¿Cómo es lo del tablero completo?» (`NIVELES_01`, que ofrece el simulador); «¿En cuánto tiempo se llega a la casilla doce?» (no debe dar un plazo: el video no lo da); «No conozco a miles de personas»; «¿Cómo es eso de las lavadoras?». ✅ `RETO_D79` desplegado en los tres tenants el 26 nov (arsenal_inicial v6.95), aprobado por el Director, y `RETO_MAS_RECIENTE` apunta aquí. Medido con paráfrasis: gana «lo del rey y los granos de trigo» (0.571) y «la historia del ajedrez» (0.596), y no le quita a `NIVELES_01` «qué son Los 12 Niveles». ⏳ La auditoría del 26 nov marcó cinco ideas: «lo de las lavadoras» lo gana `PERS_01` 🔒 (cuidado personal) y ninguna variante del índice lo voltea; «cómo se cuenta el 8.190» no tiene respuesta; «ayudo a dos» cae en `POCA_GENTE_01`; Los 12 Niveles se van a cifras. Propuesta en el chat: una puerta mientras el 79 sea el más reciente y una línea con la suma.
