# Reto 90 días · Día 1 — «El primer equipo»

| | |
|---|---|
| **Fecha** | Lunes 7 de septiembre de 2026 |
| **Serie** | Reto de los 90 días (documentación en vivo) |
| **Estado** | 🎬 **Grabado y montado** — pendiente de publicar |
| **Formato** | Talking-head a cámara, DJI Osmo Pocket 3, escritorio |
| **Versiones** | Muro **61.4 s** (con outro emblema) · Historias **56.0 s** |
| **Entrega** | `~/Downloads/reels-equipo/0907/reto-dia1-{muro,historias}-final.mp4` |
| **Fuente** | `~/Downloads/reels-equipo/dia-1.MP4` — HEVC 1728×3072, 10 bits, 23.976 fps, 60 Mbps |
| **Trabajo** | `scripts/dankoe-video/captions/work/work-d01/` |

---

## Guion (como se habló)

El sábado les conté mi reto: construir una empresa desde cero en 90 días. Hoy es lunes, oficialmente Día 1.

¿Por dónde arrancamos? Respondiéndonos una sola pregunta: ¿cómo usamos esto para ayudar a la gente?

Y eso lo tenemos claro. Hoy, quien quiere montar algo propio choca con una barrera de entrada: requiere un capital y tiempo que no tiene libres.

Esto lleva así toda la vida, y hasta el momento a nadie le ha parecido anormal. A nosotros sí.

Por eso creamos CreaTuActivo y a Queswa, nuestra inteligencia artificial, para derribar esa barrera.

En esta primera fase queremos que esto beneficie a más de 8.000 personas. Claro, esto no se hace en solitario.

Mi tarea de esta semana es armar el equipo base: 15 socios. 15 pioneros a los que voy a acompañar mano a mano a construir su propio sistema de distribución operado por inteligencia artificial.

Y les confieso algo: lo complejo no fue la tecnología. Lo verdaderamente difícil empieza hoy: escribirle a contactos que no veo hace años.

Les cuento cómo me va en las historias.

---

## Por qué quedó así

1. **La confesión del cierre es el corazón del video.** Decisión del Director: *«esta parte a la gente le causa terror y nervios, y ver a otro que lo va a hacer es curioso e interesante»*. Coincide con lo medido en [lazos dormidos](../../../../../docs/investigaciones/resultados/LISTA_TIBIA_VS_AUDIENCIA_FRIA_SEP2026.md) — la reticencia es de quien reconecta, no de quien recibe. **No se corta ni en la versión de historias.**
2. **«15 pioneros» y «operado por inteligencia artificial» se conservan por decisión del Director**, después de que se señalaran. *Pioneros* despierta interés según su experiencia de campo; y *operado por IA* se refiere al **ejercicio de la persona**, que sí está apoyado por completo en la IA — la entrega de producto es otro contexto y la gente la da por hecha.
3. **Nubank y Vélez salieron del guion.** El registro se absorbió; el nombre no se cita. Nombrarlo prestaba estatus pero invitaba la comparación *«usted no es Nubank»*.
4. **Se descartaron dos tomas en el montaje:** un *«Claro»* tartamudeado y el arranque falso *«Mi tarea de esa semana»*.
5. **Sin analogía del concesionario.** El Director la sacó al grabar; queda como la línea que se puede recuperar si un día el video se lee demasiado interno.

---

## Producción

**Montaje por islas de habla** — 20 islas detectadas, 18 usadas. Tiempos por **alineación forzada** (`align.py`), nunca por Whisper: en el Día 0 los tiempos de Whisper desfasaron un subtítulo dos rondas. Zoom alternado 1.06× para que los cortes lean como intención. Pausas: muro 0.26 s de continuación / 0.42 s de frase; historias 0.16 / 0.28. Una pausa larga de 0.62 s antes de *«A nosotros sí»*, que es el giro.

**Música** — suspense 0.65 → **Pulse corporativa** 1.00 en el pivot (25.0 s muro · 24.0 s historias, sobre *«A nosotros sí»*), con `whoosh_up` un cuarto de segundo antes. Cama medida: −31.3 dB en el acto 1, −26.6 dB en el acto 2. Mezcla voz-anclada con `sidechaincompress`, final **−14.1 LUFS**.

**Subtítulos** karaoke `y=0.76`, máximo 3 palabras. El texto de pantalla difiere del alineado a propósito: *noventa → 90*, *ocho mil → 8.000*, *quince → 15*, y se restituyeron los signos de interrogación.

⚠️ **Color: SÍ se aplicó el LUT de DJI, pero como LOOK, no como conversión.** El Director creyó
haber grabado en D-Log M y el archivo salió en **Rec.709** (10 bits, eso sí): YMAX llega a 920–948
sobre 1023, y en log los altos hacen rodillo mucho antes. **Pero eso no descalifica al LUT.** Medido
sobre cinco instantes, `dji-osmo-pocket3-dlogm-to-709.cube` **no recorta nada**: baja los negros de 29
a 17 —negro legal, sin taparse— y **protege los altos**, que sin él se estaban quemando en 255. Lo
único que hace de más es oscurecer la media (87 → 69), y eso se compensa con exposición:
`eq=brightness=0.085:contrast=1.02:saturation=1.05` después del LUT. Resultado: grises más limpios,
piel mejor separada del fondo, altos a salvo.

⚠️ **Audio: las pausas van atenuadas −24 dB.** La silla chirriaba. Barrido espectral del montaje: de
44 eventos de alta frecuencia, **43 caen sobre sílabas** —eses y ches, normales— y **uno solo estaba
en una pausa**, en 14.05–14.20 s, justo donde el Director lo oyó. Se resolvió con una envolvente
derivada de los propios `stamps`: ganancia plena a ±0.14 s de cada palabra, −24 dB fuera, con rampas
de 30 ms. El chirrido bajó de −35.1 a −45.3 dB y una sílaba de control quedó idéntica al decimal.
