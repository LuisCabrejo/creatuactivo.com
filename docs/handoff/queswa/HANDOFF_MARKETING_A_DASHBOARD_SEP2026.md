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

## 🟡 Dos flojas, dentro de ideas que pasaron

- **`FREQ_37` (candado) responde titularidad a quien preguntó otra cosa:** *«¿y si el cliente quiere hablar conmigo directo, qué pasa?»* recibió el candado completo de registro, dos formas de comprar y precios preferenciales, sin decir nunca qué pasa si el cliente lo busca a él. Huele a candado solitario ganando una consulta que no es la suya — vale medir si el índice de `FREQ_37` está atrayendo el «hablar directo».
- **Contradicción en el despacho:** ante *«¿lo del despacho cómo es la vuelta?»* (recuperó `PROD_02`/`LUV_02` del catálogo) el motor dijo *«a la dirección que usted registre»*, contradiciendo su propia respuesta anterior de que llega a la casa del cliente. Con el hecho del envío ya confirmado, la dirección es la del comprador.

## Lo que este repo ya cerró (para que no se duplique)

- **Pitch deck y Home** alineados al entregable de tres elementos (la pieza 3 es la aplicación personalizada; los dos pasos y la ley de la multiplicación viven en el remate del deck). `/servilleta` quedó quieta por decisión del Director.
- **Prompt v5.9 desplegado a los tres canales** (27 sep, RPC verificado): el video «Cómo funciona» entró como entrada **permanente** del bloque de videos — el tercer ❌ de la auditoría (*«vi el video de Luis y no entendí»* devolvía solo los dos videos del reto y un juicio sobre Luis) se resolvió por ese lado. La instrucción «tómelo como parte del reto» ya no cubre cualquier mención de video.
