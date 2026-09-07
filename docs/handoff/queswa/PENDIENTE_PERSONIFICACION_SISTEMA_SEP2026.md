# Pendiente — la personificación del sistema

**Abierto:** 6 sep 2026, al cerrar la migración *canal → sistema de distribución*.
**Estado:** inventariado y sin aplicar. Cada caso necesita leerse en su respuesta completa antes de tocarlo.

---

## Por qué existe este documento

La migración cambió el nombre del activo, y con el nombre cambió lo que la palabra puede hacer en una frase.

**Un canal es un conducto: no consume, no compra, no pide.** Cuando el colectivo hacía algo humano, la regla del 9 ago 2026 ya obligaba a nombrar a quién —*sus clientes*, *sus distribuidores*— y esa regla sigue viva. **Un sistema tampoco consume.** La migración no la resolvió: la heredó, y en algunos sitios la agravó, porque *sistema* suena lo bastante a máquina como para que la frase no chirríe al leerla rápido.

El costo no es de estilo. Un sistema que consume solo es **una máquina que se paga sola**, que es exactamente la silueta de la promesa sin causa. Nombrar a quién consume mete al consumidor en la frase — que es donde la Ley 1700 quiere verlo.

**El patrón de resolución ya está aplicado** en [src/lib/wa-simulador.ts](../../../src/lib/wa-simulador.ts):

> ~~mientras el canal compre sus cajas~~ → **mientras sus distribuidores compren sus cajas**

No se cambió el verbo ni la cifra: se cambió el sujeto. Ese es el movimiento en los cinco casos de abajo.

---

## A · Personificación real — cinco casos

El sujeto de un verbo humano es el sistema. Se reemplaza por quién.

| # | Archivo | Línea | Texto |
|---|---------|-------|-------|
| 1 | `knowledge_base/arsenal_12_niveles.txt` | 100 | «mientras **el sistema consuma**, hay comisión; si deja de consumir, no la hay» |
| 2 | `knowledge_base/arsenal_12_niveles.txt` | 222 | «**Mientras el sistema consuma**, esa comisión se liquida por ciclos semanales» |
| 3 | `knowledge_base/arsenal_12_niveles.txt` | 353 | «es que **su sistema siga consumiendo** mes a mes» |
| 4 | `knowledge_base/arsenal_compensacion.txt` | 500 | «productos reales que consume o **comparte con su sistema**» |
| 5 | `src/lib/wa-simulador.ts` | 224 | «el ritmo lo pone **cada canal**» — residuo de la migración en copy **servido**, no comentario |

⚠️ **El 5 es de otra especie:** no personifica, se le escapó la palabra vieja. Va aquí porque se corrige en la misma pasada y el arnés es el mismo.

⚠️ **Lo que NO es un caso:** `arsenal_12_niveles.txt:25` dice «el ingreso del sistema consumiendo», pero es la **nota de versión** de la cabecera del `.txt` — el fragmentador no la sirve y el modelo no la lee. Se deja como está.

---

## B · Ambigüedad de vocabulario — dos casos, problema distinto

Aquí *sistema* no es el activo del usuario: es **el plan de compensación**, el software de Gano que aplica el porcentaje.

| # | Archivo | Línea | Texto |
|---|---------|-------|-------|
| 6 | `knowledge_base/arsenal_compensacion.txt` | 600 | «**el sistema aplica** automáticamente el más alto disponible» |
| 7 | `knowledge_base/arsenal_compensacion.txt` | 612 | «**el sistema toma** por defecto el más alto entre su paquete, su rango y la promoción vigente» |

**Estos dos no se resuelven cambiando el sujeto por *sus distribuidores* — quedaría falso.** Se resuelven nombrando quién lo hace de verdad: **Gano Excel**, o **el plan**. Y hay un motivo de fondo para no dejarlos: desde la migración, *sistema* es el nombre de lo que la persona compra. Que la misma palabra signifique dos cosas en el mismo arsenal es la deriva que la migración vino a cerrar.

---

## Cómo se cierra

1. **Leer la respuesta completa**, no la línea. En dos de los casos el sujeto correcto depende de si el párrafo ya viene hablando de clientes o de distribuidores.
2. **Proponer el texto en el chat** antes de tocar archivos (acuerdo del 8 ago 2026).
3. Los de `arsenal_12_niveles` y `arsenal_compensacion` van por la **receta de cinco pasos** — purgar, re-fragmentar, clonar a los tres tenants.
4. `wa-simulador.ts` es código: solo build.
5. **Verificar contra los tres tenants** con un `content like` sobre lo que entró **y** sobre lo que debía salir.

## Riesgo de tocarlo

Los casos 1, 2 y 3 viven en respuestas de **NIVELES**, y la 1 y la 2 son el remate del argumento de que la compañía paga por venta y no por gente vinculada. Es la frase que desarma la sospecha de pirámide. **Cambiar el sujeto no puede debilitar ese remate**: si al nombrar a los distribuidores la frase pierde fuerza, la solución es reescribir el remate entero, no dejar la personificación.
