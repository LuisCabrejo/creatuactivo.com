# HANDOFF — Reel MOTOR (prospección, 3D bimetálico, faceless)

Datos duros para ensamblar el reel MOTOR. Pipeline: `scripts/dankoe-video/PIPELINE.md`
(variante b-roll 100% IA). Método establecido: **clips de ~8s con los tiempos de acción escritos
en el prompt de Vertex/Veo**; el VO alineado (`stamps.json`) es el reloj maestro; los clips se
retiman con `setpts` para caer en los beats.

## VO (ElevenLabs — Andres Felipe) — YA GENERADO
Texto exacto:
> "Toda la vida nos enseñaron a remar más fuerte. Nunca a construir el barco. Y por más duro que
> usted reme, jamás le ganará a quien le puso un motor. Ese motor se llama apalancamiento: la
> tecnología hace el trabajo pesado por usted. El esfuerzo bruto ya no es la ventaja. ¿Quiere el
> suyo? Escriba la palabra MOTOR."

- Archivo VO: `scripts/dankoe-video/captions/work/prospeccion-g5/vo.mp3`
- Forced alignment: `.../prospeccion-g5/stamps.json`
- **Duración total VO: 19.44s**
- Keyword: **MOTOR** · Palabras de poder (dorado): **motor · apalancamiento**
- SFX ancla: arranque de motor, colocado en **10.84s** (inicio de "apalancamiento")

## Timestamps reales (del forced alignment)
| Palabra | Inicio–fin |
|---|---|
| remar | 1.36–1.62s |
| barco. | 3.86–4.20s |
| motor. (1ª mención) | 8.56–8.94s |
| **apalancamiento:** | **10.84–11.90s** |
| tecnología | 12.38–12.86s |
| esfuerzo | 15.16–15.50s |
| MOTOR. (keyword) | 18.74–19.44s |

## Beat map (acción anclada al segundo real)
| Segundo | Voz | Acción en pantalla |
|---|---|---|
| 0.0 – 8.56s | remar / barco / "por más duro que reme" | Máquina FRÍA, atascada, rechinando. CERO oro. |
| 8.56s | "…un motor" | Chispa sutil en el núcleo (opcional) |
| **10.84 – 11.90s** | "se llama apalancamiento" | **ENCENDIDO PLENO** dorado + SFX arranque |
| 12.38 – 15.0s | "la tecnología hace el trabajo pesado" | Gira suave, oro fluyendo |
| 15.16 – 17.0s | "el esfuerzo bruto ya no es la ventaja" | Sigue suave |
| 18.74 – 19.44s | "Escriba la palabra MOTOR" | Pull-back al monolito héroe |
| +3s | (outro) | Emblema + CreaTuActivo.com + boom |

**Regla dura:** el dorado NO puede aparecer antes de ~10.8s. Si aparece antes = falla (motor
arrancado desde 0s). La fase fría dura ~11s (más de la mitad del reel).

## Keyframes (Vertex) — YA GENERADOS
- Foto FRÍA (apagada): `public/contexto/capturas/reels-equipo/image (51).png` (torre vertical + volante)
- Alterna/inserto: `public/contexto/capturas/reels-equipo/image (50).png` (caja de engranajes angulada)
- Foto ENCENDIDA (dorada): pendiente — misma máquina que la 51 con el cubo central del volante
  en dorado champán `#C5A059` y la luz derramándose por el metal.

## Prompt Veo/Vertex — con tiempos escritos (clip ~8s, extendido a ~21s)
Estilo base: Lujo Clínico Bimetálico (`GUIA_IDENTIDAD_VISUAL_IA.md §10`). Vertical 9:16, cámara
lenta y estable, sin cortes, sin humanos, sin texto, sin neón.
```
Start on a heavy vertical titanium machine (tower with stacked gears and a large spoked flywheel),
deep carbon-fiber black background. For the first 8 seconds the machine strains and grinds, gears
barely turning under brute resistance, cold and dim, NO gold and NO glowing core. Around second 11
a warm champagne-gold core (#C5A059) ignites at the center of the front flywheel and the whole
mechanism begins to rotate smoothly and effortlessly; the golden glow spreads through the gears and
metal. From second 12 to 17 it runs smoothly, gold glowing steadily, specular highlights sweeping
across the brushed titanium. From second 17 the camera slowly pulls back to reveal the whole
monolith standing powered and calm. Slow stable cinematic camera throughout, no cuts.
```

## Ensamble (pipeline b-roll IA — `PIPELINE.md`)
1. Secuenciar el/los clip(s) Vertex bajo el VO; retimar con `setpts` para que el encendido caiga
   en 10.84s.
2. Subtítulos: `align.py` + `render_captions.py` (ya hay `stamps.json`; keyword MOTOR en dorado).
3. Logo-bug (`motion/assets/emblema.png` + `drawbox`) tapando cualquier marca de Vertex, abajo-dcha.
4. Música suspense→corporativa, cambio en 10.84s ("apalancamiento"); nivel nicho `volume=0.80`.
5. SFX arranque de motor en 10.84s (kit `motion/out/kit/` o `sfx.py`).
6. Sin atmósfera (los clips Vertex ya vienen graduados).
7. Outro canónico (`motion/out/outro.mp4`) + boom.
8. Mezcla voz-anclada `loudnorm=I=-14` sobre la voz; música/SFX por debajo; `alimiter` al cierre.
9. Marca de agua wordmark "CreaTuActivo.com" esquina inf-dcha ~22% opacidad todo el reel.
10. Export web: CRF23 + `maxrate 6M` + `faststart`.

## Assets existentes en `captions/work/prospeccion-g5/`
`vo.mp3` · `vo_16k.wav` · `stamps.json` · `motor.wav` (SFX arranque) · `guion.txt` · `dmap.json`
· `frames/` (subtítulos) · `master.mp4` (versión previa en ARCILLA — reemplazar por la bimetálica)
