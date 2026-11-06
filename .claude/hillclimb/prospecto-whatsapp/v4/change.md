# v4 — los datos le llegan al modelo (Sonnet 4.6, 5 nov 2026)

Tras v2/v3 (Sonnet 5.5 y Opus 5.5 no mueven el resultado: 71-75 % por intento, mismos
casos caídos), tres cambios de código sobre v1, sin copy nuevo:

1. `wa-formato.ts`: la etiqueta de una tabla de dos columnas pierde su negrita antes
   de envolverla («• **Total*:* *18*» → «• *Total:* *18*»). Caso: dieciocho-unidades.
2. `route.ts`: una puerta DICTADA no se abre con la paráfrasis del CQR, solo con las
   palabras de la persona o un ancla determinística. Caso: bajar-de-peso («y para la
   vitalidad» → CQR «…del día a día» → EAM_01 dictaba el video del negocio).
3. `ficha-producto.ts`: el pin de producto lleva cómo se toma, momento, ritual y lo que
   se nota (de `productos/catalogo-datos.ts`), y sin producto en el mensaje toma el de
   la última respuesta de Queswa. Casos: reskine-rutina, beneficios-cada-uno,
   bebidas-si-encadenados.
