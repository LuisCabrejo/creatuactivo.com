# Marca — assets de identidad (producción)

Directorio **permanente**. No confundir con `public/contexto/capturas/`, que es transitorio y se vacía.

## Foto de perfil del WABA (WhatsApp)

`perfil-whatsapp-{A-carbon,B-spotlight,C-elevado}.png` — 640×640 sRGB, **sin canal alfa a propósito**.

⚠️ **WhatsApp NO admite transparencia en la foto de perfil.** Meta convierte toda foto de perfil a
**JPEG**, que no tiene canal alfa, y aplana lo transparente contra **blanco**. Verificado el 21 ago 2026
descargando lo almacenado: JPEG 640×640, esquinas `srgb(255,255,255)`. Por eso el fondo va **horneado**:
no es un descuido, es la única forma de que el disco sea carbón de marca y no blanco por omisión.
**Nunca "corrija" estos archivos devolviéndoles transparencia** — el resultado sería el blanco otra vez.

- El logo va al **88% del radio** del círculo (12% de aire). A tamaño real el avatar mide ~46 px; a sangre
  se lee como mancha. El logo entra completo: su radio circunscrito es 486,6 de 500, **no hay recorte**
  — los cortes planos de los arcos laterales son del diseño.
- Se entregan a **640×640** porque es exactamente lo que Meta almacena; así no hay reescalado encima.

## El master del logotipo NO está aquí

Este directorio guarda **solo los derivados de 640 px**. El master —2000×2000 `TrueColorAlpha`— se deja
fuera del repo por peso, igual que los masters de video (ver [[reference_archivo_video_drive]]).
Al 21 ago 2026 vive en `public/contexto/capturas/logo/logotipo-CreaTuActivo.com.png`, que es un
**directorio transitorio que se vacía** — si va a componer algo nuevo, archívelo antes en Drive.

⚠️ **No use `public/images/logotipo.png` como fuente para composiciones nuevas.** Es `PaletteAlpha` de
**223 colores**: pasó por una cuantización que le quitó profundidad, y en un render 3D metálico con
degradados se nota. Es el mismo dibujo que el master (RMSE 0,003) pero degradado. Lo consumen las cinco
rutas `opengraph-image`, así que sustituirlo es una mejora pendiente, no un cambio inocuo.
