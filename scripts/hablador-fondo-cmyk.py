"""
Copyright © 2026 CreaTuActivo.com

El fondo del PDF de imprenta del hablador (/hablador/{slug}/pdf), en CMYK (21 nov 2026).
Lo llama scripts/componer-fondo-hablador.mjs; también corre solo:

  python3 scripts/hablador-fondo-cmyk.py <fondo-rgb.jpg> <salida-cmyk.jpg> <perfil.icc>

Perfil: ISO Coated v2 300 % (FOGRA39, papel estucado), intención perceptual. El negro
sale en 73/68/63/95 (299 % de tinta), el negro enriquecido de ese perfil.
⚠️ Con lcms y no con sharp: sharp dejaba el negro en 65/58/52/73 —un gris oscuro
impreso, y gris en la vista previa del celular— y, con withMetadata, el JPEG en sRGB.
"""
import sys
from PIL import Image, ImageCms

origen, salida, perfil = sys.argv[1:4]
rgb = Image.open(origen).convert('RGB')
t = ImageCms.buildTransform(ImageCms.createProfile('sRGB'), ImageCms.getOpenProfile(perfil), 'RGB', 'CMYK',
                            renderingIntent=ImageCms.Intent.PERCEPTUAL)
cmyk = ImageCms.applyTransform(rgb, t)
cmyk.save(salida, 'JPEG', quality=92, subsampling=0, dpi=(300, 300))
negro = [round(v / 2.55) for v in Image.open(salida).getpixel((5, 5))]
print(f'✅ {salida} · CMYK FOGRA39 · esquina {negro}')
