# Reto 90 días · Día 3 — «La serie y las notificaciones»

| | |
|---|---|
| **Fecha** | Miércoles 9 de septiembre de 2026 |
| **Serie** | Reto de los 90 días (documentación en vivo) |
| **Estado** | 🎬 **Montado y entregado** |
| **Formato** | Pieza de estilo de vida, **sin voz**. Plano fijo de la pantalla: la serie a la izquierda, el Centro de Mando de queswa.app a la derecha |
| **Versiones** | WhatsApp **1920×1080 · 63 s** (audio de la serie) · Meta **1080×1080 · 63 s** (música propia) |
| **Entrega** | `~/Downloads/reels-equipo/0909/reto-dia3-{whatsapp-horizontal,cuadrado-meta}.mp4` |
| **Fuente** | `~/Downloads/reels-equipo/día-3/día-3.mp4` — 1920×1080, 24 fps, 63 s |

---

## No hay guion hablado

El día 3 no se escribió: no hubo tiempo. La pieza es de **estilo de vida** y todo lo que dice va en un rótulo de cuatro líneas:

> **DÍA 3**
> Yo veo una serie.
> **Queswa atiende a los que llegan.**

Las dos primeras líneas en blanco, las dos últimas en oro. El resto lo dicen las notificaciones que se leen en pantalla: *«Los Valientes de David llegó a tu enlace»* · *«Un visitante llegó a tu enlace»* · *«Alguien está revisando los productos de Gano Excel en tu enlace»* · *«Hace 4 horas»* · **PUSH ACTIVAS · TIEMPO REAL**.

---

## Por qué quedó así

1. ⭐ **La yuxtaposición ES la pieza, y por eso el vertical se descartó.** El primer montaje recortaba en vertical sobre el Centro de Mando: las notificaciones quedaban perfectamente legibles y la serie salía del cuadro —lo que resolvía de una vez el formato de historias y el riesgo de derechos—. El Director lo rechazó y tenía razón: *«no ofrece nada interesante… en ese formato no saben que estoy viendo una serie»*. **Sin las dos cosas en el mismo cuadro no hay idea**, solo una interfaz que un desconocido no reconoce. Se había optimizado la legalidad y la legibilidad destruyendo el mensaje.
2. **El cuadrado apareció como la salida, y la propuso el Director.** Recortando **por la izquierda** (`crop=1080:1080:840:0`, que es el máximo posible sin salirse del cuadro) sobreviven la calle y el carro a un lado y el panel completo al otro. La yuxtaposición aguanta el recorte.
3. **Dos audios, dos destinos.** WhatsApp lleva **el sonido de la serie**, que es lo que produce la inmersión (Director). Meta lleva **música nuestra**, y esa es la decisión que de verdad baja el riesgo: la detección por audio es la vía más fuerte y supera el 99%; el recorte solo, no protege.

---

## ⚠️ Derechos de autor — lo que se investigó

**No es la música: es la serie.** Meta escanea **audio y video** contra su base de derechos, y **no existe una duración segura para contenido de cine o televisión** — no hay umbral de segundos que lo salve. La detección de audio supera el **99%** incluso tras recomprimir. El titular decide: silenciar, limitar el alcance o bajar la publicación.

- **WhatsApp Estado** no tiene identificación de contenido → la serie no es problema. Es el único sitio donde caben la imagen completa **y** el sonido original.
- **Facebook e Instagram** → recorte cuadrado **y** audio sustituido. Queda solo el emparejamiento de imagen, sobre un fragmento recortado, con LUT, grano y rótulo encima. **No es riesgo cero**; lo más probable ante una coincidencia es limitación de alcance, no un reclamo formal.

---

## Producción

**Color:** LUT de la Osmo (`dji-osmo-pocket3-dlogm-to-709.cube`) + `eq=brightness=0.04:contrast=1.03:saturation=1.04`. Medido: la saturación media sube de **8.3 a 14.3**, un 71 % más color.

⛔ **Trampa que costó una vuelta: el archivo que llega por la app de DJI MIENTE sobre su origen.** Los metadatos decían `Core Media` / marca `qt` / H.264 **8 bits**, y de ahí se concluyó que no era material de la Osmo y que el LUT no aplicaba. Falso: **la app reenvuelve y transcodifica el archivo al pasarlo al teléfono**, y le deja encima la firma del teléfono. El origen seguía siendo D-Log M. **La prueba no es el metadato: es aplicar el LUT y medir la saturación.**

**Audio de WhatsApp:** el original venía a **−37 LUFS**. Subirlo veintitrés decibelios habría traído el ruido de sala con él, así que va `highpass=70` + `afftdn` suave antes de nivelar, y queda en **−17 LUFS** a propósito — el sonido de una serie de fondo tiene que sonar a fondo. ⚠️ **El micrófono DJI no grabó**: picos en −20 dB y media en −40 en los cuatro tramos, sin voz. Lo que se oye es la sala.

**Atmósfera** más suave que en un talking-head (viñeta `PI/10`, grano `alls=3-4`, halation al 0.10): la pantalla filmada ya trae su propio patrón y una atmósfera fuerte lo ensucia.
