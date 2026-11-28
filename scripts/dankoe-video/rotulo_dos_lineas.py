#!/usr/bin/env python
"""Rótulo de marca en dos líneas para los videos de Queswa que se comparten como historia
(27 nov 2026, Director): «CREATUACTIVO.COM» y debajo el tema («CÓMO FUNCIONA»). Mismo estilo
y misma altura que el rótulo del reto (rotulo_dia.py): Montserrat Black en oro con contorno
negro, desde el 15,5 % de la altura; la segunda línea al 70 % del cuerpo de la primera.

    python rotulo_dos_lineas.py <salida.png> "CREATUACTIVO.COM" "CÓMO FUNCIONA"
"""
import sys
from PIL import Image, ImageDraw, ImageFont
from rotulo_dia import FUENTE, ORO, W, H, ALTURA, ANCHO_MAX


def ajustar(d, texto, tam):
    while tam > 30:
        f = ImageFont.truetype(FUENTE, tam)
        bb = d.textbbox((0, 0), texto, font=f, stroke_width=max(4, tam // 12))
        if bb[2] - bb[0] <= W * ANCHO_MAX: return f, tam, bb
        tam -= 2
    return f, tam, bb


def main():
    salida, l1, l2 = sys.argv[1:4]
    img = Image.new("RGBA", (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(img)
    f1, t1, _ = ajustar(d, l1, 96)
    f2, t2, _ = ajustar(d, l2, int(t1 * 0.7))
    y = int(H * ALTURA)
    for txt, f, tam in ((l1, f1, t1), (l2, f2, t2)):
        trazo = max(4, tam // 12)
        bb = d.textbbox((0, 0), txt, font=f, stroke_width=trazo)
        d.text(((W - (bb[2] - bb[0])) // 2 - bb[0], y - bb[1]), txt, font=f, fill=ORO, stroke_width=trazo, stroke_fill=(0, 0, 0, 255))
        y += (bb[3] - bb[1]) + int(tam * 0.28)
    img.save(salida)
    print(f"{l1} ({t1} px) / {l2} ({t2} px) · termina en y={y}")


if __name__ == "__main__": main()
