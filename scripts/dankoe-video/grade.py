#!/usr/bin/env python3
# © CreaTuActivo.com — pipeline de reels (uso interno)
"""
grade.py — PASO 0 del pipeline de reels: grade automatizado en ffmpeg.

Reemplaza el grade manual de CapCut. Toma el clip CRUDO D-Log M de la Osmo
Pocket 3 y entrega la base graduada que ya alimenta los pasos siguientes
(subtítulos por forced alignment + motion 3D + audio).

Cadena (look cinematográfico — calibrado con metraje real, jun 2026):
  1. LUT DJI D-Log M → Rec.709        (= "LUT 100%" de CapCut; entrega el contraste 709)
  2. selectivecolor (amarillos)        (doma la mesa de madera para que no compita con la cara)
  3. colorbalance                      (degreen sutil + piel cálida + sombras un toque frías)
  4. curves (punto negro suave)        (filmico, NO crushea a vacío — conserva detalle de sombra)
  5. lutyuv (JACKET_BLACK, solo-luma)  (ennegrece la chaqueta SIN tocar la croma/piel)
  6. hqdn3d  (denoise)                 (limpieza: quita grano de sensor del fondo oscuro)
  7. unsharp (nitidez)                 (= "Enfocar +20"; el fondo ya limpio no amplifica ruido)
  8. vignette (centrada en la cara)    (más cine: apaga la mesa/bordes, centra la luz en el sujeto)
  9. halation/bloom (en RGB)           (más cine: glow suave en luces/micro)

Uso:
  python3 grade.py input/clip.mp4 [output/clip-graded.mp4]
  python3 grade.py --frame ruta/al/frame.png      # procesa UN still para previsualizar el look

Requiere ffmpeg en PATH.

NOTA DE CALIBRACIÓN: los valores de `MASTER_CURVE` y `SHARPEN` son una primera
aproximación a los sliders de CapCut (cuya matemática interna es propietaria).
Se afinan comparando un frame de salida contra `public/contexto/capturas/capcut/
ajustes-gemini.png`. La cadena en sí es exacta; los números se ajustan con metraje real.

NOTA SOBRE "sharpen selectivo / protección de piel": el objetivo elegido era
"máxima nitidez, fondo oscuro sin grano de sensor". Se logra de forma más robusta
con denoise ANTES del sharpen (paso 3 → 4): el grano del sensor se elimina primero,
así el unsharp del paso 4 realza al sujeto sin reamplificar ruido en el fondo —
sin necesidad de re-segmentar al sujeto (BiRefNet). La protección de tono de piel
hue-selectiva no es limpia en ffmpeg; si se necesita, va mejor en DaVinci o con un
LUT de piel dedicado. Ver README.
"""

import os
import shlex
import subprocess
import sys

HERE = os.path.dirname(os.path.abspath(__file__))

# ───────────────────────── PARÁMETROS EDITABLES ─────────────────────────

# --- 0. Nivelar horizonte (corrección de cámara torcida — CLIP-SPECIFIC) ---
# Si la grabación quedó con la cámara un poco rotada, esto la endereza con una
# rotación global + leve upscale para no dejar esquinas negras. Es POR CLIP:
# default 0 (sin tocar). Para prueba-1 el valor medido fue +1.18°.
#   signo: + baja el lado derecho (horario) · − baja el izquierdo.
LEVEL_DEG = 0.0
LEVEL_FILL = 1.05   # upscale que tapa las esquinas tras rotar (≈ cubre hasta ~1.5°)

LUT = os.path.join(HERE, "luts", "dji-osmo-pocket3-dlogm-to-709.cube")

# --- 1. LUT (= "LUT Osmo Pocket 3 al 100%" de CapCut) ---
APPLY_LUT = True

# --- 2a. Domar la mesa de madera (movimiento compositivo) ---
# La madera amarilla en primer plano es el elemento más brillante/saturado y compite
# con la cara. selectivecolor sobre los AMARILLOS la apaga (desatura + oscurece un toque)
# SIN lavar la piel: la piel vive en rojos/naranjas, la mesa en amarillos → el filtro
# es hue-selectivo y robusto al encuadre. Reemplaza el HSL "amarillo −51 sat / −3 brillo"
# que Luis hacía a mano en CapCut. Formato: "c m y k" (−1..1) para el rango de amarillos.
TAME_DESK = True
DESK_YELLOWS = "0.15 0.10 -0.42 0.10"   # +cyan +magenta −yellow (desatura) · +k (oscurece)

# --- 2b. Look colorista (cinematográfico) ---
# El LUT DJI deja un leve cast verde en sombras (medido: V<128) y la piel sale fría.
# colorbalance lo corrige sutil: degreen + piel cálida + sombras un toque frías.
COLORBALANCE = True
CB = "gs=-0.02:bs=0.02:rm=0.03:gm=-0.03:bm=-0.02"

# Curva de sombras SUAVE (filmica). El LUT ya da el contraste 709 → NO S global.
# Solo un toe gentil que conserva detalle de sombra. ⚠️ NO usar esta curva para
# "ennegrecer la chaqueta": ffmpeg `curves` interpola con SPLINE CÚBICO, y meter
# puntos bajos genera overshoot que LEVANTA y DESATURA la piel (sale pálida). El
# ennegrecido de la chaqueta se hace abajo con JACKET_BLACK (solo-luma, no toca croma).
MASTER_CURVE = "0/0 0.10/0.05 1/1"

# --- Ennegrecer la chaqueta SIN tocar la piel (solo-luma) ---
# Resta luminancia en las sombras (chaqueta iluminada Y~59 → ~47, fondo → negro)
# con decaimiento exponencial: a partir de Y~110 el efecto se desvanece, así la PIEL
# (Y>120) queda intacta. Opera SOLO sobre Y (luma) vía lutyuv → la croma (calidez y
# saturación de la piel) se conserva matemáticamente. Calibrado jun 2026 (feedback
# "más negro a la chaqueta" + "la piel se ve más blanca"): el culpable era el spline
# de `curves`; con lutyuv la piel mide idéntica a la natural (calidez +47 / sat 47).
JACKET_BLACK = True
JACKET_SUBTRACT = 45   # cuánto resta en negros (mayor = chaqueta/fondo más negros)
JACKET_FALLOFF = 45    # Y de desvanecimiento (mayor = sube el efecto hacia los medios)

# --- 3. Limpieza técnica: denoise (quita grano de sensor del fondo oscuro) ---
DENOISE = True
DN_LUMA_SPATIAL = 3.0     # menor = conserva más detalle de piel
DN_CHROMA_SPATIAL = 2.5
DN_LUMA_TEMP = 6.0        # temporal: el que más reduce el "hervor" de ruido en sombras
DN_CHROMA_TEMP = 4.5

# --- 4. Nitidez (= "Enfocar +20" de CapCut) ---
SHARPEN = True
SHARPEN_AMOUNT = 0.9      # luma_amount de unsharp; 0.8–1.2 ≈ "Enfocar +20"
SHARPEN_RADIUS = 5        # tamaño de máscara (impar)

# --- 5. Vignette (más cine: separa sujeto/fondo + apaga la mesa en los bordes) ---
# En fondo oscuro una viñeta débil es invisible (oscurecer negro no se ve). Esta cae
# sobre la MESA y los bordes — sí se percibe — y centra la luz en la cara (y0 arriba).
VIGNETTE = True
VIGNETTE_ANGLE = "PI/4"     # PI/5 = default ffmpeg; menor número = MÁS marcada
VIGNETTE_Y0 = "h*0.42"      # centro de la viñeta a la altura de la cara (no del cuadro)

# --- 6. Halation / bloom (más cine: glow en luces) ---
HALATION = True
HALATION_THRESHOLD = 0.70  # solo las luces por encima de este nivel brillan
HALATION_BLUR = 18         # radio del glow (sigma gblur)
HALATION_OPACITY = 0.16    # intensidad del glow (0.10–0.22)

# --- Salida ---
CRF = 18                   # master de alta calidad para el pipeline (no es el web final)
OUT_PIX_FMT = "yuv420p"

# ─────────────────────────────────────────────────────────────────────────


def build_filtergraph(is_still: bool = False) -> str:
    """Construye el -filter_complex completo con pads nombrados."""
    parts = []
    last = "0:v"

    if LEVEL_DEG:
        rad = LEVEL_DEG * 3.141592653589793 / 180.0
        # upscale → rota → recorta de vuelta al tamaño original (centrado) sin esquinas negras
        parts.append(
            f"[{last}]scale=iw*{LEVEL_FILL}:ih*{LEVEL_FILL},"
            f"rotate={rad}:c=black,crop=iw/{LEVEL_FILL}:ih/{LEVEL_FILL}[lvl]"
        )
        last = "lvl"

    if APPLY_LUT:
        # el .cube fue copiado a luts/ sin espacios en el nombre → sin escapes raros
        lut_path = LUT.replace("\\", "/")
        parts.append(f"[{last}]lut3d=file={shlex.quote(lut_path)}[lut]")
        last = "lut"

    if TAME_DESK:
        parts.append(f"[{last}]selectivecolor=yellows={DESK_YELLOWS}[desk]")
        last = "desk"

    if COLORBALANCE:
        parts.append(f"[{last}]colorbalance={CB}[cb]")
        last = "cb"

    parts.append(f"[{last}]curves=all='{MASTER_CURVE}'[cur]")
    last = "cur"

    if JACKET_BLACK:
        # resta luma en sombras con desvanecimiento exponencial → no toca la piel ni la croma
        expr = f"max(0,val-{JACKET_SUBTRACT}*exp(-val/{JACKET_FALLOFF}))"
        parts.append(f"[{last}]lutyuv=y='{expr}'[jk]")
        last = "jk"

    if DENOISE and not is_still:
        # el componente temporal no aplica a un still; en stills solo el espacial actúa
        parts.append(
            f"[{last}]hqdn3d={DN_LUMA_SPATIAL}:{DN_CHROMA_SPATIAL}:"
            f"{DN_LUMA_TEMP}:{DN_CHROMA_TEMP}[dn]"
        )
        last = "dn"
    elif DENOISE and is_still:
        parts.append(f"[{last}]hqdn3d={DN_LUMA_SPATIAL}:{DN_CHROMA_SPATIAL}:0:0[dn]")
        last = "dn"

    if SHARPEN:
        parts.append(
            f"[{last}]unsharp=lx={SHARPEN_RADIUS}:ly={SHARPEN_RADIUS}:"
            f"la={SHARPEN_AMOUNT}:cx={SHARPEN_RADIUS}:cy={SHARPEN_RADIUS}:ca=0[shp]"
        )
        last = "shp"

    if VIGNETTE:
        parts.append(
            f"[{last}]vignette=angle={VIGNETTE_ANGLE}:x0=w/2:y0={VIGNETTE_Y0}[vig]"
        )
        last = "vig"

    if HALATION:
        # aísla las altas luces, las difumina y las suma en modo screen.
        # CRÍTICO: el blend debe operar en RGB (gbrp), NO en YUV — "screen" sobre
        # los planos de croma U/V desplaza el color (cast magenta en sombras).
        parts.append(f"[{last}]format=gbrp,split=2[hbase][hglow]")
        parts.append(
            f"[hglow]curves=all='0/0 {HALATION_THRESHOLD}/0 1/1',"
            f"gblur=sigma={HALATION_BLUR}[glow]"
        )
        parts.append(
            f"[hbase][glow]blend=all_mode=screen:all_opacity={HALATION_OPACITY}[hal]"
        )
        last = "hal"

    parts.append(f"[{last}]format={OUT_PIX_FMT}[out]")
    return ";".join(parts)


def run_video(inp: str, outp: str):
    fc = build_filtergraph(is_still=False)
    cmd = [
        "ffmpeg", "-y", "-i", inp,
        "-filter_complex", fc,
        "-map", "[out]", "-map", "0:a?",
        "-c:v", "libx264", "-crf", str(CRF), "-preset", "slow",
        "-pix_fmt", OUT_PIX_FMT, "-c:a", "copy",
        "-movflags", "+faststart", outp,
    ]
    print("→ Graduando:", inp, "→", outp)
    subprocess.run(cmd, check=True)
    print("✓ Listo:", outp)


def run_still(inp: str, outp: str):
    fc = build_filtergraph(is_still=True)
    cmd = ["ffmpeg", "-y", "-i", inp, "-filter_complex", fc,
           "-map", "[out]", "-frames:v", "1", "-update", "1", outp]
    print("→ Preview de un still:", inp, "→", outp)
    subprocess.run(cmd, check=True)
    print("✓ Listo:", outp)


def main():
    args = sys.argv[1:]
    if not args:
        print(__doc__)
        sys.exit(1)

    if args[0] == "--frame":
        inp = args[1]
        outp = args[2] if len(args) > 2 else os.path.splitext(inp)[0] + "-graded.png"
        run_still(inp, outp)
        return

    inp = args[0]
    if len(args) > 1:
        outp = args[1]
    else:
        base = os.path.splitext(os.path.basename(inp))[0]
        os.makedirs(os.path.join(HERE, "output"), exist_ok=True)
        outp = os.path.join(HERE, "output", base + "-graded.mp4")
    run_video(inp, outp)


if __name__ == "__main__":
    main()
