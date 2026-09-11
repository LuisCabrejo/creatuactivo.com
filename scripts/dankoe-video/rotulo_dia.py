#!/usr/bin/env python
"""Rótulo del día para la serie del reto — «JUEVES · DÍA 4».

    python rotulo_dia.py <salida.png> "<texto>" [--tam 96]

Montserrat Black en oro de marca (#C5A059) con contorno negro, centrado y a la
altura del 15.5 % — por encima de los subtítulos (que viven al 76 %) y por debajo
de la franja donde Instagram pone su interfaz de historias.

⚠️ El tamaño se AJUSTA SOLO para que el texto quepa con margen: «DÍA 4» a 96 px
ocupa 287 px de 1080, pero «JUEVES · DÍA 4» al mismo cuerpo se sale. Se pide el
tamaño deseado y el script lo baja hasta que entre en el 84 % del ancho.
"""
import sys
from PIL import Image, ImageDraw, ImageFont

FUENTE = "/Users/luiscabrejo/Library/Fonts/Montserrat-Black.otf"
ORO    = (197, 160, 89, 255)
W, H   = 1080, 1920
ALTURA = 0.155
ANCHO_MAX = 0.84

def main():
    salida, texto = sys.argv[1], sys.argv[2]
    tam = int(sys.argv[sys.argv.index("--tam")+1]) if "--tam" in sys.argv else 96
    img = Image.new("RGBA", (W, H), (0,0,0,0)); d = ImageDraw.Draw(img)
    while tam > 40:
        f = ImageFont.truetype(FUENTE, tam)
        bb = d.textbbox((0,0), texto, font=f, stroke_width=max(4, tam//12))
        if bb[2]-bb[0] <= W*ANCHO_MAX: break
        tam -= 2
    trazo = max(4, tam//12)
    bb = d.textbbox((0,0), texto, font=f, stroke_width=trazo)
    d.text(((W-(bb[2]-bb[0]))//2 - bb[0], int(H*ALTURA)), texto, font=f,
           fill=ORO, stroke_width=trazo, stroke_fill=(0,0,0,255))
    img.save(salida)
    print(f"{texto}  ·  {tam} px  ·  {bb[2]-bb[0]} de {W} px de ancho")

if __name__ == "__main__": main()
