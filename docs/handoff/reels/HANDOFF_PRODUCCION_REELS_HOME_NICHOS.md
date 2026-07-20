# HANDOFF — Producción final: Reel HOME + Reels de NICHO

> Documento de traspaso para el agente de post-producción de reels (jun 2026).
> Autosuficiente, pero apunta a CLAUDE.md como fuente de verdad de la receta técnica.

## 0) Misión
Post-producción cinematográfica (estilo Dan Koe/Naval) de:
- **Reel HOME** (explainer del sitio, voz neutra).
- **Reels de NICHO** (5 de tráfico + networkers) — Luis los graba/regraba.
Las bases de talking-head salen de CapCut **ya graduadas** (LUT + ajustes). Tu trabajo
es el acabado por código: subtítulos, atmósfera, motion graphics 3D, SFX, música, outro.

## 1) Lee primero (fuente de verdad)
- **CLAUDE.md** → secciones **"Reel Post-Production Pipeline (`scripts/dankoe-video`)"**,
  **"Reels por Nicho"**, **"Guiones de Reels — Taxonomía"** y **"Reel HOME"**. Ahí está la
  receta completa, paso a paso, con valores de casa (atmósfera, mezcla, etc.). NO se repite aquí.
- El pipeline vive en **`scripts/dankoe-video/`** (captions/, motion/, music/, masters/).
- Ejemplo recién hecho que puedes calcar: el **reel del Día 12** (doc-24-junio) — primer
  doc reel con inserts 3D. Documentado en `public/contexto/produccion/guiones/reels/REELS_DIARIOS_DOCUMENTACION.md`
  (línea de *Producción*). Mismo flujo aplica a HOME/nichos.

## 2) Fuentes de COPY (texto hablado / de página)
- **HOME** → `public/contexto/produccion/guiones/reels/REELS_SITIO_CREATUACTIVO.md` (voz neutra,
  reutilizable por todos los arquitectos). El reel HOME va en el hero vía `HomeManifestoVideo.tsx`.
- **NICHOS** → `public/contexto/produccion/guiones/reels/REELS_NICHOS_DOCUMENTACION.md`
  (bloque SOLUCIÓN+CTA compartido por los 5 de tráfico + secciones por nicho + networkers aparte).
- **Copy de página** (landing del reel) → `src/lib/reels.ts` (`REEL_COPY`).
- ⚠️ Estos 3 archivos se **recalibraron el 25 jun 2026** — úsalos tal cual están, NO partas de versiones viejas.

## 3) ⚠️ LÉXICO ACTUAL (cambió 25 jun — crítico para que el video salga bien)
1. **Promesa canónica de Queswa** = *"Queswa explica, atiende y **madura en cada interesado
   la decisión de avanzar**, las 24 horas"* (antes "guía"). El objeto es **la decisión**, no la persona.
2. **REGLA DEL ESPEJO (clave para los CTA):** "madura/guía la decisión" SOLO en 3ª persona
   (los prospectos del usuario / "cada interesado" / "su organización"). En el **CTA**, que interpela
   al espectador sobre **su propia** decisión, **NINGÚN verbo de persuasión** — solo ofrecer ayuda.
   Ej. networkers CTA = *"pregúntele a Queswa — le explica, mejor que nadie."* (NO "lo guía/madura
   hasta la decisión"). Decirle al espectador que lo vamos a llevar a decidir = se siente como manipulación.
3. **"Las horas NO son el villano":** el trabajo es orgullo/dignidad latina. Prohibido "cambiar
   horas por dinero", "no a cambio de sus horas". El villano es la **DEPENDENCIA** ("el día que para,
   el ingreso para") + falta de seguridad. Swap "no depende de su tiempo/horas" → **"de su presencia"**.
   ("Techo limitado a las horas" SÍ se permite — es límite de escala.)
4. "negocio/empresa digital", "ingresos recurrentes", "3 pilares", usted. Prohibido: filtrar, vehículo,
   red (MLM), patrimonio paralelo, capas, Máquina Híbrida, escalar (→ multiplicar), operar (→ hacer/funcionar).
- Si el guion grabado dice algo distinto a esto, **avísale a Luis antes de quemar subtítulos**.

## 4) Receta técnica (resumen — detalle en CLAUDE.md)
- **Formato:** 1080×1920 · 24fps · H.264 · yuv420p · faststart.
- **Subtítulos:** forced alignment (`captions/align.py` con guion EXACTO hablado → `*_stamps.json`)
  → frames PNG (`captions/render_captions.py`, **karaoke, máx 3 palabras, y=0.64**). Se queman por
  **overlay PNG (Pillow), NO libass**. venv: `captions/.venv` (py3.12). Display-map para números
  ("cuarenta"→"40", "creatuactivo punto com"→"CreaTuActivo.com").
- **Atmósfera** (DESPUÉS del overlay de subtítulos, sobre el grade existente — NO re-graduar):
  halation + viñeta + grano (valores de casa en CLAUDE.md / `grade.py`).
- **SFX:** kit sintético en `motion/out/kit/*.wav` (whoosh_up/down, shimmer, boom, finale_boom).
  Whoosh en cada entrada de insert; shimmer en analogías memorables. Regenerar con `python motion/sfx.py` si faltan.
- **Outro:** `motion/out/outro.mp4` (emblema + CreaTuActivo.com + finale_boom). Normalizar a los mismos
  params y concatenar.
- **Mezcla VOZ-ANCLADA:** `[voz]loudnorm=I=-14:TP=-1.5:LRA=11` como ancla → `asplit` → sidechain
  duck de música; SFX/música por debajo a niveles fijos; cierre `alimiter` (NO loudnorm final). Resultado ≈ −14 LUFS.
- **Master** CRF~19; **web** CRF23 + `maxrate 6M` + faststart.

## 5) B-ROLLS 3D disponibles para INSERTS (úsalos)
6 clips consolidados en `public/videos/servilleta/` (720×1280, sin audio, marca de agua Gemini
tapada con el emblema): `empresa-tradicional.mp4` (fábrica que tambalea) · `empresa-digital.mp4` (el
puente) · `sonrisaslindas.mp4` (red dental) · `respaldo.mp4` (globo/70 países) · `queswa.mp4` (orbe IA)
· `metodo.mp4` (checklist). Tienen **rótulo quemado arriba-izq** ("LA EMPRESA DE TODA LA VIDA", etc.)
que suele REFORZAR la narración. Escálalos a 1080×1920 y móntalos como cutaway con
`overlay=enable='between(t,A,B)'` + `setpts=PTS+A/TB` + whoosh. **Deja ≥1.5s de talking-head entre
cutaways** (gaps <1s parpadean). Calza el insert con el momento del guion (ej. "empresa de toda la vida…
empieza a tambalear" → empresa-tradicional; "imagine la suya, sonrisaslindas.app" → sonrisaslindas).
Fuentes Remotion de más inserts (villanos por nicho, pilares) en `motion/src/` (registrados en `Root.tsx`);
render headless M1 requiere `--gl=angle`. Relabel por `--props='{...}'` sin duplicar comp.

## 6) Tipografía y marca
- Subtítulos: **Montserrat Black**, blanco con contorno negro, palabra activa en **dorado #C5A059**.
- Emblema/outro: `motion/assets/emblema.png`. Paleta bimetálica (carbón #0F1115 + dorado champán + titanio).

## 7) Música (convención FIJA — Luis calibra al alza, nunca bajar)
- Camas en `music/` (commiteadas): `hook-diagnostico_suspense.mp3` + `solucion-cta_calm-corporate.mp3`.
- **El cambio suspense→corporativa cae EXACTO en el pivot diagnóstico→solución** (léelo del `*_stamps.json`).
- Niveles: reels de **nicho** (módulo) = `volume=0.80` (**networkers = 0.90**); reels **reflexivos de
  documentación** = `volume=1.00`. La corporativa (~29s) si no cubre el acto 2 → `-stream_loop 1` + `atrim`.
- ⚠️ La base de CapCut debe venir **SIN música** (pista en mute). Verifica con `volumedetect`/`silencedetect`:
  en una pausa, base limpio ≈ −60 dB; con música bakeada ≈ −30 dB. Si trae música, no se puede mezclar bien.

## 8) Deploy / hosting
- Reels → **Vercel Blob** (`reels/{nicho}.mp4`, **mismas URLs** → no tocar `REEL_ASSETS` en `reels.ts`).
  Subir con `@vercel/blob put` (allowOverwrite) o `scripts/upload-reels-to-blob.mjs`.
- **Poster por-nicho:** frame del propio reel (`ffmpeg -ss 0.5 … scale=1080:1920` + sharp→webp), commitea
  `{nicho}-poster.webp/.jpg` en `public/videos/reels/` y registra en `REEL_POSTER_OVERRIDE` (`reels.ts`).
- HOME → Blob `home/home-manifesto.mp4` + poster local (`HomeManifestoVideo.tsx`).
- Masters locales en `scripts/dankoe-video/masters/` (gitignored). Los reels reflexivos de documentación
  NO van a Blob — se entregan directo para Stories.
- Limpieza de intermedios: `bash scripts/dankoe-video/clean-pipeline.sh` (NUNCA toca masters/music/kit/src).

## 9) Gotchas (te ahorran horas)
- **zsh:** el Bash tool corre con semántica zsh → en un `filter_complex` las variables se vacían dentro
  de funciones de shell. Escribe los ffmpeg con filtros **inline, literales, sin variables ni funciones**.
- Render Remotion headless en M1: **`--gl=angle`**.
- El `collapse`/display-map de subtítulos matchea por token exacto tras `strip()` (cuida la puntuación final).
- Verifica SIEMPRE un par de frames extraídos (cutaway + atmósfera + subtítulo) antes de masterizar.
- `git push` SIEMPRE en primer plano (el background no accede al llavero macOS). Luis autoriza, tú haces el push.

## 10) Antes de cerrar cada reel
1. Confirma que el guion quemado = el copy actual (sección 3).
2. Verifica LUFS ≈ −14 (`volumedetect`) y que NO hay doble música.
3. Frames de control en ventanas de insert.
4. Sube a Blob (misma URL) + poster override + commit del `.webp/.jpg`.
5. Documenta en el `.md` correspondiente (línea *Producción:* con pivot + master).

---
*Generado al cierre de la sesión de recalibración léxica "madura"/"horas" (25 jun 2026). El contexto
de producción (pipeline, b-rolls nuevos, tipografía, efectos, música) proviene de la producción del
reel Día 12 y de CLAUDE.md.*
