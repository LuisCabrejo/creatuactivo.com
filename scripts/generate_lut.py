#!/usr/bin/env python3
"""
Genera naval_style.cube — 3D LUT 33x33x33
Estilo Naval Ravikant / Dan Koe para videos de CreaTuActivo

Correcciones aplicadas:
  - Temperatura: 3200K (LED cálido) → 5000K (neutro/daylight)
  - Black crush: aplana negros para look cinematic
  - Curva S: contraste editorial suave
  - Desaturación 10%: look premium sin sobresat.
  - Gamma 0.93: imagen ligeramente más oscura y rica

Uso:
  python3 scripts/generate_lut.py
  → Genera scripts/naval_style.cube

El .cube se usa en DaVinci Resolve (davinci_naval.py) y en FFmpeg
"""

import math
import os

SIZE = 33  # 33x33x33 = 35,937 puntos de color


def s_curve(x, strength=0.15):
    """Curva S suave — contraste sin perder sombras."""
    return x + strength * math.sin(2 * math.pi * x) / (2 * math.pi)


def apply_naval_grade(r, g, b):
    # 1. Corrección de temperatura (enfriar: bajar rojos, subir azules)
    r = r * 0.91
    g = g * 0.97
    b = b * 1.08

    r = max(0.0, min(1.0, r))
    g = max(0.0, min(1.0, g))
    b = max(0.0, min(1.0, b))

    # 2. Black crush (negro más profundo = look cinematic)
    black_point = 0.035
    r = max(0.0, (r - black_point) / (1.0 - black_point))
    g = max(0.0, (g - black_point) / (1.0 - black_point))
    b = max(0.0, (b - black_point) / (1.0 - black_point))

    # 3. Curva S
    r = s_curve(r)
    g = s_curve(g)
    b = s_curve(b)

    # 4. Ligera desaturación (look editorial, no saturado)
    luma = 0.2126 * r + 0.7152 * g + 0.0722 * b
    sat = 0.90
    r = luma + (r - luma) * sat
    g = luma + (g - luma) * sat
    b = luma + (b - luma) * sat

    # 5. Gamma premium (0.93 = ligeramente más oscuro y rico)
    gamma = 0.93
    r = pow(max(0.0, r), gamma)
    g = pow(max(0.0, g), gamma)
    b = pow(max(0.0, b), gamma)

    return (
        max(0.0, min(1.0, r)),
        max(0.0, min(1.0, g)),
        max(0.0, min(1.0, b)),
    )


def generate_cube(output_path):
    lines = [
        "# naval_style.cube — CreaTuActivo Video Grade",
        "# Estilo: Naval Ravikant / Dan Koe",
        "# Corrección temperatura 3200K→5000K + black crush + curva S + gamma 0.93",
        f"LUT_3D_SIZE {SIZE}",
        "",
    ]

    for bi in range(SIZE):
        for gi in range(SIZE):
            for ri in range(SIZE):
                r_in = ri / (SIZE - 1)
                g_in = gi / (SIZE - 1)
                b_in = bi / (SIZE - 1)

                r_out, g_out, b_out = apply_naval_grade(r_in, g_in, b_in)
                lines.append(f"{r_out:.6f} {g_out:.6f} {b_out:.6f}")

    with open(output_path, "w") as f:
        f.write("\n".join(lines))

    print(f"✅ LUT generado: {output_path}")
    print(f"   {SIZE}x{SIZE}x{SIZE} = {SIZE**3:,} puntos de color")
    print(f"   Listo para usar en DaVinci Resolve y FFmpeg")


if __name__ == "__main__":
    script_dir = os.path.dirname(os.path.abspath(__file__))
    output = os.path.join(script_dir, "naval_style.cube")
    generate_cube(output)
