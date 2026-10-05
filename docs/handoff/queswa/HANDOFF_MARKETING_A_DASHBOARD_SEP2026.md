# Traspaso: hallazgos de la auditoría del guion «Cómo funciona» (27 sep 2026)

**Para:** el agente Claude Code del Dashboard. **Escribe:** el agente de creatuactivo.com, con el Director.
**Contexto:** respuesta al traspaso `HANDOFF_APLICACION_PERSONALIZADA_SEP2026.md`. Las tareas de este repo quedaron hechas el 27 sep (pitch deck, Home y prompt — detalle abajo) y la tarea 5 —`auditar-guion-queswa.mjs` sobre el guion aprobado del video, contra el motor real en producción, tenant `whatsapp`— salió con **2 ideas en ❌ y 2 flojas que son de los arsenales**, que son suyos. Las huellas de la corrida son de arnés (`wa_57300…`), fuera de la auditoría de tráfico real.

**Lo primero: el estreno está cubierto.** `WHY_APP_01` dispara con `candado_dictado` ante «¿cómo así que como Waze?» y responde en mecanismo; la propiedad del cliente, el porcentaje de la recompra, la periodicidad de pago y «¿esto es pirámide?» pasaron todas. Lo que falló es anterior al tercer elemento.

## ❌ 1 — «¿Quién paga el envío, el cliente o yo?» (FREQ_37)

Pregunta binaria que recibió *«los costos de envío los maneja Gano Excel»* — ni contesta quién paga, ni es algo que Queswa pueda afirmar. **El hecho, confirmado por el Director el 27 sep: el envío lo paga el comprador.** Copy aprobado por él en el chat (la segunda frase que proponíamos —*«usted no paga envíos ajenos ni queda en medio»*— la retiró: enumeraba cargas que la persona no tendrá):

> El envío lo paga quien compra, dentro de su propio pedido: Gano Excel despacha desde sus bodegas hasta la puerta del cliente.

Dónde viva (una línea en `FREQ_37`, o donde el índice lo recupere ante *«quién paga el envío»*) es decisión suya — al medir, la paráfrasis de referencia es la binaria de arriba, no el disparador literal.

## ❌ 2 — «¿Entonces yo no tengo que guardar producto en la casa?» (INV_03 · INV_05)

El fondo lo responde bien (no hay inventario ni entregas), pero agrega como hecho *«su propia recompra mensual»* y *«el paquete con el que arranca»* — un compromiso de compra que nadie preguntó, metido en la respuesta que existe para quitar cargas. El fragmento pone el argumento del inventario; la recompra tiene su propia casa y su propio momento.

## 🟡 El índice de `WHY_02` no tiene la paráfrasis «los tres elementos»

El video dice literalmente *«los tres elementos que eliminan la fricción»*, así que la gente va a preguntar con esas palabras (*«¿cuáles son los tres elementos?»*, *«lo de los tres elementos»*). Hoy la cobertura aguda la pone el prompt v5.9 (el resumen de los tres viaja en toda conversación del prospecto), pero lo robusto es que el índice de `WHY_02` gane esas paráfrasis — al medir, meter en la mesa a `WHY_APP_01`, `WHY_01` y `EAM_01`, que son los que podrían perderla o robarla.

## 🟡 Dos flojas, dentro de ideas que pasaron

- **`FREQ_37` (candado) responde titularidad a quien preguntó otra cosa:** *«¿y si el cliente quiere hablar conmigo directo, qué pasa?»* recibió el candado completo de registro, dos formas de comprar y precios preferenciales, sin decir nunca qué pasa si el cliente lo busca a él. Huele a candado solitario ganando una consulta que no es la suya — vale medir si el índice de `FREQ_37` está atrayendo el «hablar directo».
- **Contradicción en el despacho:** ante *«¿lo del despacho cómo es la vuelta?»* (recuperó `PROD_02`/`LUV_02` del catálogo) el motor dijo *«a la dirección que usted registre»*, contradiciendo su propia respuesta anterior de que llega a la casa del cliente. Con el hecho del envío ya confirmado, la dirección es la del comprador.

## Lo que este repo ya cerró (para que no se duplique)

- **Pitch deck y Home** alineados al entregable de tres elementos (la pieza 3 es la aplicación personalizada; los dos pasos y la ley de la multiplicación viven en el remate del deck). `/servilleta` quedó quieta por decisión del Director.
- **Prompt v5.9 desplegado a los tres canales** (27 sep, RPC verificado): el video «Cómo funciona» entró como entrada **permanente** del bloque de videos — el tercer ❌ de la auditoría (*«vi el video de Luis y no entendí»* devolvía solo los dos videos del reto y un juicio sobre Luis) se resolvió por ese lado. La instrucción «tómelo como parte del reto» ya no cubre cualquier mención de video.

## Segunda corrida de la auditoría (27 sep, más tarde) — lo que este repo cerró y lo que le queda a usted

Otra sesión de creatuactivo.com corrió la auditoría de nuevo tras el despliegue de v6.55 y cerró, con aprobación del Director en su chat:

- **`FREQ_38` (arsenal v6.56, desplegado y clonado a los tres tenants):** *«¿y si un cliente escribe a las 2 am usted le responde?»* caía en el **candado de `FREQ_37`** —emitido literal— y la persona recibía el vínculo del cliente en vez de la disponibilidad. Dos líneas sin candado, cierre hacia `FREQ_37`. ⚠️ **Si usted re-mide `FREQ_37`, espere esta migración a propósito:** *«¿usted es la misma IA que atiende a mis clientes?»* ahora la gana `FREQ_38` (0.593 vs 0.546) — la palabra de la persona es *atiende*, y es mejor casa. Las paráfrasis propias de `FREQ_37` (queda a mi nombre, en qué momento, si abren mi enlace) siguen ganándolas él, re-medidas.
- **Puerta `WHY_PROD_01` (route.ts de este repo):** la pregunta mixta *«¿Gano Excel qué es? ¿qué productos venden?»* recibía solo el catálogo; ahora el backend antepone la línea de credenciales (30 años, más de 60 países — estatus, en hechos). No toca arsenales.

**Dos preexistentes que el arnés destapó y son de sus arsenales** (medidos contra los rivales de producción, no los causa nada de hoy):

- *«¿me lo pueden quitar después?»* → gana `FREQ_15` y `FREQ_37` queda en el puesto **5** (0.457), aunque «si me lo pueden quitar» está literal en su índice. Suma al caso del atractor de FREQ_37 que ya está arriba.
- *«en el video hablaban de una ruta paso a paso, ¿qué es eso?»* → `EAM_01` (0.493) le gana a `WHY_APP_01` (0.485) por 0.008. Si toca el índice de `WHY_APP_01`, esa paráfrasis («la ruta paso a paso del video») es candidata — midiendo que EAM_01 no pierda las suyas.

## 5 oct 2026 — El detalle de Los 12 Niveles para el socio, sin los cuatro pasos

El Director probó el nodo del canal (2.223) y lo devolvió por «demasiada carga cognitiva»: el video que llega antes ya explica el 2×2 y el 10%, y lo que la persona necesita es ver el crecimiento paso a paso. En WhatsApp quedó así (`detalleNivelesSocio`, `src/lib/wa-simulador.ts`): una línea de entrada, las doce filas (`*Nivel 2* · llegan 4 · Total: 6 Dist. · $75.600 COP`, con «distribuidores» completo solo en el nivel 1 y «Total:» solo en el nivel 2) y el enlace a la pantalla 9. Salieron los cuatro pasos, la línea de la tarifa del paquete y «el potencial matemático bajo duplicación perfecta».

**El Dashboard responde al mismo «Si» con el texto viejo** (`dash_luis-cabrejo-1288`, 5 oct 08:27): «Se lo explico en cuatro pasos…», `[[simulador:doce-niveles]]`, la tarifa del ESP-3 y el potencial matemático. Lo que pide el Director aplica igual allá: queda «Así se ve, nivel por nivel. Arranca en el 10% del Kit; mueva el porcentaje para ver el de su paquete:» y el simulador. Nada antes, nada después. Si el simulador no muestra cuántos LLEGAN en cada nivel, conviene que lo haga: fue la secuencia que él pidió ver.

## 5 oct 2026 — Dos cosas más del Director, para el Dashboard

- **Acceso con Google.** Decisión del Director (5 oct): el distribuidor debe poder entrar al Dashboard con su cuenta de Google, sin depender del enlace de un solo uso. El callback `api/auth/google` ya existe en este repositorio; lo que falta es que sea la puerta por defecto para el socio. Queda en el checklist de pendientes.
- **El esqueleto de redacción cambió** (desplegado al tenant `dashboard` el 5 oct, categoría `esqueleto_redaccion_socio`): estado nuevo del PASO 1 para quien ya tuvo código o ya evaluó el negocio. Si el socio no dijo de quién es el código, el modelo pregunta literal «¿Ese código lo tiene con usted, en su sistema?». Si es con él, en el Dashboard el modelo le dice que mande los tres datos (nombre completo, WhatsApp, código de Gano) a sistema@creatuactivo.com y administración activa; en WhatsApp ese «sí» lo atiende el webhook (nodo 2.225) y la solicitud sale sola a ese correo. Nadie activa a nadie por fuera de administración.
