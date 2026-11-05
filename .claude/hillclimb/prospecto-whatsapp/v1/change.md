# v1 · El precio no es pedido, y «Catalago» es el catálogo

Dos errores de código de la auditoría del 5 nov 2026, arreglados como reglas generales, no como palabras sueltas:

- `detectarIntencionCompra` (src/lib/wa-pedido.ts): preguntar el precio o pedir información no es comprar, aunque diga «quiero», salvo que la frase traiga un verbo de compra explícito. Antes, «Quiero saber en cuanto me queda el colágeno» registraba el pedido 3 de 3.
- `mencionaCatalogo` (src/lib/wa-onboarding.ts): cualquier palabra a dos ediciones o menos de «catalogo», sin tildes. La usan la puerta del prospecto y la del socio (webhook). Antes, «Catalago» recibía el discurso de los productos 3 de 3. El arnés de tipeo baja de 3 a 0.

También va el `first_url` local de las fichas en modo ensayo (solo con WA_DRY_RUN=1), que no cambia el comportamiento de Queswa.
