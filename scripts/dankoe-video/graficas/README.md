# Gráficas de los reels del reto, en el estilo del deck

Mismo vocabulario que `src/app/servilleta/CicloPropiedad.tsx` y los íconos de `ELEMENTOS` en `src/app/servilleta/page.tsx`.

- **Figuras:** la figura humana es una persona («Usted», los clientes); el cubo crema es «Su empresa»; el cian es Queswa.
- **Estilo:** trazos de 1,5 en titanio sobre tarjetas `#15171C` con borde de vidrio; rótulos en Roboto Mono, en mayúsculas y espaciados; titulares en Inter 700 blanco.
- **El oro, una sola vez:** lo que se multiplica.

Cada escena es un HTML con `window.pintar(t)` y `window.DUR`. Los tiempos salen del `stamps.json` de la píldora (alineación forzada), en segundos del cuerpo del video.

```bash
node captura.js $PWD/dia74-delegar.html /ruta/cuadros todo     # PNG con alfa, 24 fps
node captura.js $PWD/dia74-delegar.html /ruta/cuadros claves   # 9 cuadros para revisar
# se montan sobre el retocado ANTES de la píldora, así los subtítulos quedan encima:
ffmpeg -i retocado-sin-graf.mov -framerate 24000/1001 -itsoffset T0 -i cuadros/%04d.png \
  -filter_complex "[1:v]format=rgba,setpts=PTS-STARTPTS+T0/TB[g];[0:v][g]overlay=0:0:eof_action=pass[v]" \
  -map "[v]" -map 0:a -c:v libx264 -crf 16 -pix_fmt yuv420p -c:a copy retocado.mov
```

`captura.js` usa el Playwright instalado (`require('playwright')`).

- **Día 74 («Amapolas»):** la empresa normal (usted hace todo: fabrica, atiende, despacha, mil cosas) se convierte en la empresa moderna (alguien fabrica, alguien atiende, una herramienta digital, y su empresa se multiplica de 1 a 2 y de 2 a 4).
