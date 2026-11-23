# Gráficas de los reels del reto, en el estilo del deck

Mismo vocabulario que `src/app/servilleta/CicloPropiedad.tsx` y los íconos de `ELEMENTOS` en `src/app/servilleta/page.tsx`.

- **Figuras:** la figura humana es una persona («Usted», los clientes); el cubo crema es «Su empresa»; el cian es Queswa.
- **Estilo:** trazos de 1,5 en titanio sobre tarjetas `#15171C` con borde de vidrio; rótulos en Roboto Mono, en mayúsculas y espaciados; titulares en Inter 700 blanco.
- **El oro, una sola vez:** lo que se multiplica.

Cada escena es un HTML con `window.pintar(t)` y `window.DUR`; desde el día 77 las piezas comunes (íconos, tarjeta, cubo, fondo, fundido) viven en `comun.js`. Los tiempos salen del `stamps.json` de la píldora (alineación forzada), en segundos del cuerpo del video.

```bash
node captura.js $PWD/dia74-delegar.html /ruta/cuadros todo     # PNG con alfa, 24 fps
node captura.js $PWD/dia74-delegar.html /ruta/cuadros claves   # 9 cuadros para revisar
# se montan sobre el retocado ANTES de la píldora, así los subtítulos quedan encima:
ffmpeg -framerate 24000/1001 -i cuadros/%04d.png -c:v qtrle -pix_fmt argb grafica.mov
ffmpeg -i retocado-sin-graf.mov -i grafica.mov \
  -filter_complex "[1:v]format=rgba,setpts=PTS-STARTPTS+T0/TB[g];[0:v][g]overlay=0:0:eof_action=pass[v]" \
  -map "[v]" -map 0:a -c:v libx264 -crf 16 -pix_fmt yuv420p -c:a copy retocado.mov
```

`captura.js` usa el Playwright instalado (`require('playwright')`).

- **Día 74 («Amapola»):** la empresa normal (usted hace todo: fabrica, atiende, despacha, mil cosas) se convierte en la empresa moderna (alguien fabrica, alguien atiende, una herramienta digital, y su empresa se multiplica de 1 a 2 y de 2 a 4).

⚠️ **Los cuadros sueltos se empaquetan antes en un `.mov` con alfa** (`qtrle`). Montados directo como secuencia de PNG dentro de un `filter_complex` con varias entradas, ffmpeg los leyó a 25 fps aunque llevaran `-framerate 24000/1001`: la escena del día 77 terminaba medio segundo antes, cortada en seco.

- **Día 77 («El Ranchero»):** cuatro escenas. `dia77-a-negocio` (el local, la cocina, las mesas, la gente; ¿hasta dónde llega?: tres cuadras, y otro restaurante) · `dia77-b-internet` (el local físico se tacha; en internet, toda Colombia y toda América; sin local, sin abrir y cerrar, 24 horas) · `dia77-c-creatuactivo` (la infraestructura arma su negocio, a su nombre; el cliente compra y cada vuelta deja un % sobre usted, el ciclo del deck; 16 países; en paralelo con lo que hace hoy) · `dia77-d-condiciones` (al menos una de tres; con «si tiene al menos una» se encienden por turno). Los tres elementos no se desglosan: el Director no los quiere en este video.
