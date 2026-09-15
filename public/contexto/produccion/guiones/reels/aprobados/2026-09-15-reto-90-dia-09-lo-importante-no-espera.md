# Reto 90 días · Día 9 — «Lo importante no espera»

| | |
|---|---|
| **Fecha** | Martes 15 de septiembre de 2026 · rótulo **«MARTES · DÍA 9»** (Director) |
| **Aprobado** | Lunes 14 de septiembre, como video 2 del día 8 |
| **Estado** | 📝 **Aprobado, sin grabar.** El Director lo graba el 15 sep. Al publicarlo: marcar ✅ Emitido, poner duración y rutas de entrega, y reemplazar el guion por el texto como se grabó |
| **Sticker** | **«Qué estamos construyendo»**, el mismo de los días 6 y 8 (la serie mantiene una puerta fija) |
| **Formato** | Vertical 9:16, hablado a cámara |
| **Rejilla** | Semana 2, tema **«Qué es importante»** · formato **la creencia** (del lunes, corrida al martes): una idea aprendida por repetición, contada en historia y sin ponerle etiqueta |
| **Guion de trabajo** | `~/Downloads/reels-equipo/0914/work/guion-dia8-creencia.txt` |
| **Investigación** | `docs/investigaciones/resultados/DEJAR_PARA_DESPUES_POR_ESTAR_OCUPADO_SEP2026.md` |

---

## Guion (aprobado; el subtítulo va con lo que se oiga en la grabación)

A todos nos ha pasado: por estar tan ocupados, aplazamos cosas que sabemos que son importantes y que deberíamos hacer ya. Y nos engañamos pensando: cuando tenga más tiempo, o cuando no tenga deudas, haré deporte, le dedicaré más tiempo a la familia, a mi salud.

El problema es que ese después nunca llega.

No nos lo inventamos. Lo aprendimos viendo a nuestros padres, que trabajaron toda la vida pensando que lo demás venía después. Y trabajar no tiene nada de malo. Lo que pasa es que el ser humano aprende por repetición, y por repetición aprendimos a estar siempre ocupados en cosas que no son las verdaderamente importantes.

Y lo importante no espera. Lo viví la semana pasada, cuando la salud me pasó factura.

Así que la pregunta que sirve no es qué quiero lograr, sino qué es verdaderamente importante para mí.

---

## De dónde salió

**El texto es del Director**, escrito tomando lo mejor de dos borradores. El trabajo fue solo
gramática y puntuación. Llegar ahí costó tres vueltas, y lo que se aprendió en ellas vale para
todos los guiones (ver el README de esta carpeta).

---

## Por qué quedó así

1. ⛔ **Nada de voz de coach.** Una versión que convertía el contexto del Director en diagnóstico, con
   lista de lo que no es importante y lección aprendida, fue rechazada: *«se siente artificial,
   parece un coach queriendo enseñar»*. Lo que funciona es una frase que la persona se reconozca
   diciendo, y que la conclusión la saque ella.
2. ⭐ **Abre con lo que TODOS admiten, no con lo que nadie admite.** Casi nadie reconoce en voz alta
   que descuida lo importante por culpa del trabajo; lo siente, pero no lo dice. Lo que sí admite
   cualquiera es que deja cosas importantes para después porque siempre está ocupado. *«A todos nos
   ha pasado»* entra por ahí, y cada persona pone su propio caso.
3. **Los ejemplos van después de la frase general**, no antes. Si el video nombra solo dos casos
   concretos, deja por fuera a quien tiene otro; la frase general los incluye a todos primero.
4. **«Trabajar no tiene nada de malo» es una concesión, y el villano no es el trabajo.** Para quien
   mira, trabajar mucho es el plan obvio y hasta motivo de orgullo. Lo que se nombra es la
   repetición que nos enseñó a estar siempre ocupados.
5. **La salud en una línea**, porque el sábado ya se contó.
6. **Cierra con la pregunta de la semana y sin llamado a la acción.** No promete tiempo ni ningún
   resultado: se queda en la creencia.

⛔ **El contexto que dio el Director para escribirlo no entra al guion**, ni en esta versión ni en las
que salgan al grabar. Sirvió para calibrar el ángulo y el tono. Por eso no se transcribe aquí.

---

## ⚠️ Antes de publicar

**La auditoría del 14 sep marcó ❌ en este guion.** Correrla otra vez con el texto que de verdad se
grabó:

`NODE_NO_WARNINGS=1 npx tsx scripts/auditar-guion-queswa.mjs <guion-como-se-grabo.txt>`

Lo que falló, y en qué estado estaba al 15 sep:

- **Preguntas por la salud de Luis** (*«¿qué le pasó?»*). Queswa respondió que el mensaje había
  llegado a la conversación equivocada, porque el prompt no sabe quién es Luis ni qué es el reto.
  ⏳ La línea del prompt está propuesta y no aprobada.
- **Una persona endeudada que pregunta si puede empezar.** El modelo compuso que el sistema *genera
  ingresos desde el primer ciclo semanal*, y el guardarraíl de negocio no lo detectó: solo cubre *«desde
  el primer día»*. ⏳ Ampliar ese patrón está propuesto y no aprobado.
- **Las preguntas que dicen «reto»** dependen de que la puerta del reto esté en producción.

Si alguno sigue en ❌, se le propone al Director la respuesta que falta **antes** de publicar.
