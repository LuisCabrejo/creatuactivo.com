# Pendiente — la personificación del sistema

**Abierto:** 6 sep 2026, al cerrar la migración *canal → sistema de distribución*.
**Estado:** ✅ **CERRADO el 10 sep 2026.** Los cinco de la categoría A se corrigieron; los de la categoría B **se cerraron por criterio, no por olvido** — ver la regla del Director abajo.

---

## Por qué existe este documento

La migración cambió el nombre del activo, y con el nombre cambió lo que la palabra puede hacer en una frase.

**Un canal es un conducto: no consume, no compra, no pide.** Cuando el colectivo hacía algo humano, la regla del 9 ago 2026 ya obligaba a nombrar a quién —*sus clientes*, *sus distribuidores*— y esa regla sigue viva. **Un sistema tampoco consume.** La migración no la resolvió: la heredó, y en algunos sitios la agravó, porque *sistema* suena lo bastante a máquina como para que la frase no chirríe al leerla rápido.

El costo no es de estilo. Un sistema que consume solo es **una máquina que se paga sola**, que es exactamente la silueta de la promesa sin causa. Nombrar a quién consume mete al consumidor en la frase — que es donde la Ley 1700 quiere verlo.

**El patrón de resolución ya está aplicado** en [src/lib/wa-simulador.ts](../../../src/lib/wa-simulador.ts):

> ~~mientras el canal compre sus cajas~~ → **mientras sus distribuidores compren sus cajas**

No se cambió el verbo ni la cifra: se cambió el sujeto. Ese es el movimiento en los cinco casos de abajo.

---

## ⭐ La regla que lo cerró (Director, 10 sep 2026)

**Una palabra no es el problema; lo es el verbo que se le cuelga.**

*Cadena* no estorba en **cadena de restaurantes** ni en **cadena hotelera**: el contexto la desambigua sola, y nadie lee ahí una cadena de gente. **Con *sistema* pasa igual.** Lo que chirría no es la palabra: es pedirle que haga algo que solo hace una persona.

De ahí salen las dos categorías de este documento, y sus dos destinos:

- **A · el verbo es humano** — *consumir · comprar · pedir*. **Se corrige**: no se cambia el verbo, se cambia el sujeto.
- **B · el verbo es de máquina** — *emparejar · aplicar · tomar*. **No se toca**: un software sí empareja puntos, sí aplica un porcentaje y sí toma el más alto. Ahí *sistema* se lee como el plan, sin disonancia.

---

## A · Personificación real — cinco casos ✅ CORREGIDOS

El sujeto de un verbo humano es el sistema. Se reemplaza por quién.

| # | Archivo | Línea | Texto |
|---|---------|-------|-------|
| 1 ✅ | `arsenal_12_niveles` · `NIVELES_02` | 100 | ~~«mientras **el sistema consuma**, hay comisión»~~ → **«mientras sus distribuidores y sus clientes sigan comprando, hay comisión; si dejan de comprar, no la hay»**. El remate anti-pirámide no se debilitó: **se fortaleció** — nombrar al consumidor es lo que separa el comercio del fraude, y es donde la Ley 1700 lo quiere ver |
| 2 ✅ | `arsenal_12_niveles` · `NIVELES_08` | 222 | → **«Mientras sus distribuidores sigan consumiendo»** — el sujeto ya venía dado dos líneas antes (*8.190 distribuidores consumiendo*) |
| 3 ✅ | `arsenal_12_niveles` · `INV_04` | 353 | → **«es que sus distribuidores y sus clientes sigan consumiendo mes a mes»** |
| 4 ✅ | `arsenal_compensacion` · `COMP_PV_08` | 500 | → **«que consume o comparte con sus clientes»** — con quién comparte, que es lo que la frase no decía |
| 5 ✅ | `src/lib/wa-simulador.ts` | 187 y 224 | → **«el ritmo lo pone cada sistema»**. ⚠️ **Eran DOS, no una**: el inventario listó solo la 224 y la 187 decía lo mismo. Un inventario por línea se queda corto; se cierra con un `grep` de la frase |

⚠️ **El 5 es de otra especie:** no personifica, se le escapó la palabra vieja. Va aquí porque se corrige en la misma pasada y el arnés es el mismo.

⚠️ **Lo que NO es un caso:** `arsenal_12_niveles.txt:25` dice «el ingreso del sistema consumiendo», pero es la **nota de versión** de la cabecera del `.txt` — el fragmentador no la sirve y el modelo no la lee. Se deja como está.

---

## B · Verbo de máquina — NO se toca ✅ (cerrado por criterio)

Aquí *sistema* no es el activo del usuario: es **el plan de compensación**, el software de Gano que aplica el porcentaje.

| # | Archivo | Línea | Texto |
|---|---------|-------|-------|
| 6 | `knowledge_base/arsenal_compensacion.txt` | 600 | «**el sistema aplica** automáticamente el más alto disponible» |
| 7 | `knowledge_base/arsenal_compensacion.txt` | 612 | «**el sistema toma** por defecto el más alto entre su paquete, su rango y la promoción vigente» |

⚠️ **Y son más de dos**: al cerrarlo aparecieron también `arsenal_compensacion:598` y `:729` («el sistema empareja cada punto…») y `src/lib/wa-simulador.ts:187`. **Ninguno se tocó**, y la decisión es del Director: *emparejar*, *aplicar* y *tomar* son cosas que un software hace, así que ahí *sistema* se lee como el plan y no compite con el activo del usuario. La preocupación original —que la misma palabra signifique dos cosas— **se resuelve con el contexto**, igual que *cadena de restaurantes* no compite con la cadena de una pirámide.

---

## Cómo se cierra

1. **Leer la respuesta completa**, no la línea. En dos de los casos el sujeto correcto depende de si el párrafo ya viene hablando de clientes o de distribuidores.
2. **Proponer el texto en el chat** antes de tocar archivos (acuerdo del 8 ago 2026).
3. Los de `arsenal_12_niveles` y `arsenal_compensacion` van por la **receta de cinco pasos** — purgar, re-fragmentar, clonar a los tres tenants.
4. `wa-simulador.ts` es código: solo build.
5. **Verificar contra los tres tenants** con un `content like` sobre lo que entró **y** sobre lo que debía salir.

## Riesgo de tocarlo — así se resolvió

Los casos 1, 2 y 3 viven en respuestas de **NIVELES**, y la 1 y la 2 son el remate del argumento de que la compañía paga por venta y no por gente vinculada. Es la frase que desarma la sospecha de pirámide. **Cambiar el sujeto no puede debilitar ese remate**: si al nombrar a los distribuidores la frase pierde fuerza, la solución es reescribir el remate entero, no dejar la personificación. ✅ **No hizo falta**: la frase quedó más fuerte con el sujeto nombrado, por el motivo de la fila 1.

---

## Verificado al cerrar (10 sep 2026)

Tres baterías en verde (clasificador **58/58**) · **0 frases vetadas** en 176 fragmentos · los tres tenants con **176 fragmentos** y el sujeto nombrado en los cuatro corregidos, sin residuos · `npm run build` limpio para el cambio de `wa-simulador.ts`.
