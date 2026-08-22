# Copyright © 2026 CreaTuActivo.com
#
# Quita el fondo de fotos de producto con BiRefNet (el mismo modelo ONNX que usa
# scripts/dankoe-video/process_video.py para los reels) y deja PNG con alfa,
# recortados al producto.
#
# Así se produjeron los PNG de `public/productos/_set/limpios/` (22 ago 2026):
# las fotos de estudio de ganoexcel.com.co/todos-productos/ (1500×1500, fondo
# claro con reflejo, SIN hongos ni frutas de adorno) pasadas por aquí y luego
# renombradas al slug del catálogo. La foto de las tres cajas Luvoco se partió
# en tres por las columnas de menor alfa. Los collages de familia los prefieren
# al PNG oficial; las imágenes individuales siguen usando el PNG con hongo.
#
# Uso (CPU, ~2-3 min por imagen en un M1):
#   python3.12 -m venv /tmp/venv-rembg && /tmp/venv-rembg/bin/pip install onnxruntime numpy pillow
#   /tmp/venv-rembg/bin/python scripts/recortar-fondo-birefnet.py <carpeta_jpg> <carpeta_salida>
# Modelo: ~/.u2net/birefnet-general.onnx (ver process_video.py para descargarlo).
import sys, os, numpy as np, onnxruntime as ort
from PIL import Image

MODEL = os.path.expanduser('~/.u2net/birefnet-general.onnx')
sess = ort.InferenceSession(MODEL, providers=['CPUExecutionProvider'])
name = sess.get_inputs()[0].name
mean = np.array([0.485, 0.456, 0.406], np.float32)
std = np.array([0.229, 0.224, 0.225], np.float32)
src, dst = sys.argv[1], sys.argv[2]
os.makedirs(dst, exist_ok=True)
for f in sorted(os.listdir(src)):
    if not f.lower().endswith(('.jpg', '.jpeg', '.png')) or f.startswith('_'):
        continue
    out_path = os.path.join(dst, os.path.splitext(f)[0] + '.png')
    if os.path.exists(out_path):
        continue  # reanudable: se salta lo ya hecho
    im = Image.open(os.path.join(src, f)).convert('RGB')
    W, H = im.size
    x = np.asarray(im.resize((1024, 1024), Image.BILINEAR), np.float32) / 255.
    x = ((x - mean) / std).transpose(2, 0, 1)[None]
    out = sess.run(None, {name: x})[0][0, 0]
    a = 1 / (1 + np.exp(-out))
    a = (a - a.min()) / (a.max() - a.min() + 1e-6)
    alpha = Image.fromarray((a * 255).astype(np.uint8)).resize((W, H), Image.LANCZOS)
    rgba = im.copy()
    rgba.putalpha(alpha)
    bbox = Image.fromarray((np.asarray(alpha) > 12).astype(np.uint8) * 255).getbbox()
    rgba.crop(bbox).save(out_path)
    print(f, rgba.size)
