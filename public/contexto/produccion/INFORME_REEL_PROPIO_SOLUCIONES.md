# INFORME — Soluciones aplicadas en el Reel "PROPIO" (para el agente de producción de reels)

> **Para quién.** El agente Claude Code que ensambla reels con el pipeline `scripts/dankoe-video/` (lee esto junto a `MANUAL_AGENTE_CLIPS_IA.md`). Documenta **qué problemas aparecieron y cómo se resolvieron** al producir el reel de prospección **PROPIO**, para reproducir el patrón en el próximo reel.
>
> **Contexto de negocio + guión aplicado + doctrina de copy** → ver [`HANDOFF_REEL_PROPIO_DASHBOARD.md`](../../../HANDOFF_REEL_PROPIO_DASHBOARD.md). Este informe es **solo técnico/producción**.

---

## 0. La decisión que cambió todo: REUSO primero, no generar

El mayor ahorro no fue de prompting sino de **estrategia**: este reel se armó **casi 100% de clips 3D de archivo** (ecosistema Home/servilleta), recortados a la ventana de cada beat. Solo se generó **1 clip nuevo** (Beat 1, la torre con íconos de dueño).

**Método para decidir reuso (hazlo SIEMPRE antes de proponer generar):**
1. Lista los clips candidatos (`~/Downloads/clips-reel-home/`, `scripts/dankoe-video/masters/`, `public/videos/servilleta/`).
2. **Extrae un frame representativo de cada uno y míralo** — no adivines por el nombre:
   ```bash
   for c in clipA clipB clipC; do
     dur=$(ffprobe -v error -show_entries format=duration -of default=nw=1:nk=1 "$c.mp4")
     mid=$(echo "$dur 0.4" | awk '{printf "%.2f",$1*$2}')
     ffmpeg -v error -ss "$mid" -i "$c.mp4" -frames:v 1 -vf scale=360:-1 "/tmp/f/${c}.jpg" -y
   done
   ```
3. Mapea beat → clip por lo que el frame REALMENTE muestra. Genera solo lo que no exista.

> Aprendizaje del Director: *"podemos usar material del que ya tenemos, es genial."* Un reel de prospección nuevo casi siempre se puede armar reusando + 1‑2 generaciones puntuales.

**Mapa final PROPIO:** Beat1 `peso-empresarios` (nuevo) · Beat2 `el-puente-v2`+`multiplicacion-glint` · Beat3 `socio-logistico`+`queswa-final` · Beat4 `metodo` (+texto PROPIO post).

---

## 1. Swap de íconos por encaje de nicho (imagen)

**Problema:** el clip base de la torre (`el-peso`) traía íconos de **empleado** (carro, birrete/estudio, casa) — no aplican a un reel de dueño de negocio.

**Solución:** editar la imagen final (img2img) cambiando a las cargas del **dueño**: camión/logística · cajas/inventario · local/arriendo comercial · personas/nóminas. Reglas que funcionaron:
- Íconos **incrustados a ciego** (doctrina `con-sus-manos`): "pressed INTO the concrete, SAME concrete color, readable only by the soft shadow of its recessed relief — like the sunken depth of a coin".
- Íconos **universales** (test abuela): camión, cajas, local, siluetas de personas.
- Pedir **4 bloques** explícito y conservar material/placa/orbe/luz de la referencia.
- Fallback si img2img no reemplaza bien los íconos: texto‑a‑imagen describiendo toda la torre.

## 2. Bloques que se destruían al caer (video) — FIX importante

**Problema (3 generaciones seguidas):** el bloque que caía **destrozaba** 1‑2 de los de abajo. Causa: el prompt decía `concrete` + `debris scattering` → Veo lo lee como fractura.

**Solución — candados positivos de integridad** (sin negativos, es prompt de video):
- `"HEAVY and SOLID like blocks of granite — rigid and INDESTRUCTIBLE. Each cube keeps its exact shape and stays perfectly whole and undamaged."`
- `"stack like solid stone locking together: the cube below holds firm and keeps its shape."`
- Repetir `"stay whole"` **por cada beat** de caída.
- Quitar `debris scattering` → `"a soft puff of fine grey dust shaken loose from the surface at the contact seam"` (polvo de superficie, no el bloque partiéndose).
- El peso se conserva por **slam + jolt de cámara + polvo**, no por destrucción.

> Regla general: para "pesado pero intacto" separa **polvo de superficie** (permitido) de **fractura/deformación** (prohibida con candado de rigidez).

## 3. Caídas cronometradas + inmersión/3D (video encadenado)

Encadenado **primer frame → último frame** (`Animate from the first frame to the last frame`): placa vacía → torre de 4 bloques.

- **4 caídas en los primeros 5s** con timestamps por beat (`[00:00–00:01.2]` … `[00:03.6–00:05.0]`); la **última la más robusta** (mayor polvo + jolt).
- **Dos actos de cámara** (§4.15): durante las caídas cámara **fija con jolts de impacto**; solo al final, con la torre quieta, **un push‑in** que revela la altura. Nunca compiten.
- **Inmersión 3D por colocación:** 3 planos (orbe cerca / torre media / rejilla‑fondo lejos) + **caída por el eje Z hacia cámara** = paralaje real. La rejilla recta da la profundidad.

## 4. Receta de ensamble (ffmpeg)

Normalizar cada segmento a specs idénticas → concat demuxer → mezcla. **Todos los clips deben quedar iguales** (res/fps/audio) o el concat falla.

```bash
# trim + normaliza (maneja mismatch de resolución, p.ej. 720x1280 -> 1080x1920)
trim() { ffmpeg -v error -y -i "$1.mp4" -ss "$2" -t "$3" \
  -vf "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,fps=24,setpts=PTS-STARTPTS" -r 24 \
  -c:v libx264 -profile:v high -pix_fmt yuv420p -crf 20 -preset medium \
  -af "aresample=48000,asetpts=PTS-STARTPTS" -ar 48000 -ac 2 -c:a aac -b:a 192k "/tmp/seg/$4.mp4"; }
# ... trim de cada clip a su ventana de beat ...
ffmpeg -v error -y -f concat -safe 0 -i list.txt -c copy /tmp/seg/video.mp4   # video + SFX nativo
```

## 5. Audio: voz‑anclada + música por actos

**Cama por actos** (cross‑fade en el pivote narrativo, aquí 6.8s "Hoy la ventaja…"):
```bash
ffmpeg -v error -y -i suspense.mp3 -i corporate.mp3 -filter_complex \
 "[0:a]atrim=20:27,asetpts=N/SR/TB[s];[1:a]atrim=0:19.1,asetpts=N/SR/TB[c];\
  [s][c]acrossfade=d=0.5:c1=tri:c2=tri[m]" -map "[m]" -ar 48000 -ac 2 music.wav
```
**Mezcla final** — VO anclada dominante, SFX de clips, música de fondo, whoosh en pivote:
```bash
ffmpeg -v error -y -i video.mp4 -i vo.mp3 -i music.wav -i whoosh_up.wav -filter_complex \
 "[0:a]volume=0.60[sfx];[1:a]loudnorm=I=-15:TP=-1.5:LRA=11[vo];[2:a]volume=0.15[mus];\
  [3:a]adelay=6700|6700,volume=0.5[wh];\
  [sfx][vo][mus][wh]amix=inputs=4:normalize=0:duration=first,alimiter=limit=0.95[a]" \
 -map 0:v -map "[a]" -c:v copy -c:a aac -b:a 192k out.mp4
```
Claves calibradas con Luis en esta sesión:
- **VO** loudnorm a ≈ −15 LUFS = dominante. Nunca loudnorm sobre TODA la mezcla (mezcla voz‑anclada).
- **`amix ... normalize=0`** (suma sin dividir) + `alimiter` — si no, amix baja todo al dividir por nº de inputs.
- **Música al alza / SFX al alza, música de fondo:** el balance final pedido fue **música 0.15 (baja)** + **SFX clips 0.60 (arriba)**.
- **Hook con música con cuerpo:** la intro del track de suspenso era ~5 dB más suave (−22.8 vs −18.1 dB). Arrancar el trim en su **tramo vivo (seg 20)**, no en 0, para que el hook tenga música desde el segundo 0 aunque la cama esté baja.

## 6. Capa de textos: subtítulos + CTA + marca de agua

**Subtítulos karaoke — usar el `stamps` LIMPIO, no re‑alinear sobre la mezcla.** `caption-reel.sh` re‑alinea desde el audio del video; si el video ya trae música/SFX, la alineación se degrada. Solución: renderizar directo desde el `stamps.json` alineado de la **VO pura** (la VO arranca en 0 en la mezcla → los tiempos calzan):
```bash
python render_captions.py work/propio/stamps.json /tmp/caps --fps 24 --dur <DUR> --mode karaoke --maxwords 3 --y 0.64
# overlay: [0:v][1:v(f%05d.png @24, -start_number 0)]overlay=0:0
```

**CTA como PNG (Pillow), NO `drawtext`.** El ffmpeg de esta máquina **no trae `drawtext`** (sin libfreetype) → `No such filter: 'drawtext'`. Se genera el texto con Pillow (misma Montserrat‑Black), PNG transparente 1080×1920, y se compone con `overlay` + fade de alpha:
```bash
[2:v]format=rgba,fade=t=in:st=22:d=0.4:alpha=1[cta];  [cap][cta]overlay=0:0:enable='gte(t,22)'
```

**Doctrina del CTA (calibrada con Luis):**
- **"ESCRIBA PROPIO"** (usted) — NUNCA "ESCRIBE" (tuteo prohibido).
- El lockup del keyword **NO va sobre el visual 3D** (orbe/pin) → colocarlo en una **banda despejada** (aquí la zona gris superior). El texto grande respeta el sujeto, no lo tapa.
- Keyword en dorado marca #C5A059 con contorno negro; el subtítulo corre aparte (posición `--y 0.64`).

**Marca de agua "CreaTuActivo.com"** (spec del agente de reels — aplica a TODOS los reels):
- Asset: `scripts/dankoe-video/captions/work/_assets/watermark.png` (wordmark blanco Montserrat‑Bold, ~709×98 transparente). Si se regenera: Pillow, blanco sobre transparente, misma tipografía.
- Compose (sobre el video ya con subtítulos): `scale=330:-1,format=rgba,colorchannelmixer=aa=0.22` → `overlay=W-w-38:H-h-46`.
- Va sobre **todo el cuerpo** del reel, 22% (sutil, anti‑robo). El **outro NO** la lleva (trae su propio branding: emblema + CreaTuActivo.com + boom) → se concatena el outro después, sin re‑watermark.

## 7. Gotchas de shell/ffmpeg (macOS/zsh)

- **zsh NO hace word‑splitting** de `$var` sin comillas → `set -- $seg` deja `$1` con toda la cadena. Usa arrays o comandos explícitos.
- **`volumedetect`/`ebur128` imprimen a nivel `info`** → con `-v error` NO ves la medición. Usa `-hide_banner -nostats` y lee stderr.
- **Mismatch de resolución** (un clip a 720p entre otros 1080p): `scale=...:force_original_aspect_ratio=increase,crop=1080:1920` lo iguala sin deformar.
- **Pipe deadlock** al componer por numpy/PIL: usar `-frames:v N` EXACTO y cerrar stdout (ver manual §5). No aplica al ensamble por concat, sí a composición cuadro a cuadro.

## 8. Estado / entregable

- **Entregable con textos + marca de agua:** `~/Downloads/reels-equipo/propio_v7.mp4` — subtítulos karaoke + CTA **"ESCRIBA PROPIO"** en banda superior (fuera del visual) + watermark CreaTuActivo.com 22%. (Mezcla base sin textos: `propio_v5.mp4`.)
- **Pendiente:** outro/boom canónico (concatenar; sin re‑watermark) → máster final → subir a Blob/host → pasar URL al Dashboard.
- **Detalle abierto (a criterio del Director):** en el Beat 4 la palabra "PROPIO" aparece dos veces (lockup grande arriba + subtítulo corriendo abajo); opción de ocultar el subtítulo durante el CTA.
- VO+stamps: `scripts/dankoe-video/captions/work/propio/`.
