"""
Copyright © 2026 CreaTuActivo.com

Le pone la ETIQUETA REAL a la caja de una escena generada (21 nov 2026, Director).

La escena del hablador con Ganocafé (la caja detrás de la taza, una sola cámara y una
sola luz) se generó con Nano Banana. Una IA redibuja el empaque: la marca le sale
bien, pero la letra pequeña no («BETA GLUCANO» y el peso neto salían deformados).
Y la regla del proyecto es que la foto de producto es real. Este script:

  1. encuentra la etiqueta real (public/productos/_set/limpios) dentro de la caja
     generada con SIFT + RANSAC: la perspectiva exacta (21 nov: 278 puntos, 1,3 px);
  2. la lleva a esa perspectiva, le da la profundidad de campo de la escena y su
     luz (el cociente de las dos versiones muy desenfocadas, por canal);
  3. respeta lo que está DELANTE de la caja: la taza se recorta con GrabCut.
     ⚠️ No por diferencia de color: la taza en sombra se parece a la caja y la
     etiqueta quedó pintada encima de ella en el primer intento;
  4. guarda también <salida>-objetos.png: la caja (con su costado y su tapa) y la
     taza en blanco. La usa componer-fondo-hablador.mjs para apagar la mesa sin
     apagar los objetos.

Lo que NO corrige: la tapa y el costado de la caja siguen siendo los de la IA (miden
~1 mm impresos). Requiere opencv-python-headless (no está en package.json).

  python3 scripts/hablador-reetiquetar-caja.py <escena.jpg> <salida.jpg> [x y ancho alto de la taza]

El rectángulo de la taza (para GrabCut) va en píxeles de la escena; por defecto, el
de la escena del 21 nov 2026 (1696 × 2528).
"""
import sys
import cv2
import numpy as np

ETIQUETA = 'public/productos/_set/limpios/ganocafe-3-en-1.png'
escena_ruta, salida = sys.argv[1], sys.argv[2]
rect_taza = tuple(int(v) for v in sys.argv[3:7]) if len(sys.argv) >= 7 else (800, 1480, 820, 780)

gen = cv2.imread(escena_ruta)
real = cv2.imread(ETIQUETA, cv2.IMREAD_UNCHANGED)
h, w = gen.shape[:2]

# 1. La perspectiva: rasgos de la etiqueta real dentro de la caja generada.
sift = cv2.SIFT_create(8000)
k1, d1 = sift.detectAndCompute(cv2.cvtColor(real[:, :, :3], cv2.COLOR_BGR2GRAY), None)
k2, d2 = sift.detectAndCompute(cv2.cvtColor(gen, cv2.COLOR_BGR2GRAY), None)
pares = cv2.FlannBasedMatcher(dict(algorithm=1, trees=5), dict(checks=80)).knnMatch(d1, d2, k=2)
buenos = [a for a, b in pares if a.distance < 0.72 * b.distance]
src = np.float32([k1[a.queryIdx].pt for a in buenos])
dst = np.float32([k2[a.trainIdx].pt for a in buenos])
H, inl = cv2.findHomography(src, dst, cv2.RANSAC, 4.0)
dentro = inl.ravel() == 1
err = np.linalg.norm(cv2.perspectiveTransform(src[dentro].reshape(-1, 1, 2), H).reshape(-1, 2) - dst[dentro], axis=1)
print(f'etiqueta: {int(dentro.sum())} puntos, error medio {err.mean():.2f} px')
if dentro.sum() < 60 or err.mean() > 3:
    sys.exit('⛔ La etiqueta no se encontró con precisión en la escena: no se reetiqueta.')

# 2. La etiqueta real en esa perspectiva, con la profundidad de campo y la luz de la escena.
genf = gen.astype(np.float32)
warp = cv2.warpPerspective(real[:, :, :3].astype(np.float32), H, (w, h), flags=cv2.INTER_LANCZOS4)
warp = cv2.GaussianBlur(warp, (0, 0), 1.7)
cara = cv2.warpPerspective(np.full(real.shape[:2], 255, np.uint8), H, (w, h))
cara = cv2.erode(cara, np.ones((5, 5), np.uint8)).astype(np.float32) / 255
sig = 28
peso = cv2.GaussianBlur(cara, (0, 0), sig)[..., None] + 1e-4
num = cv2.GaussianBlur(genf * cara[..., None], (0, 0), sig) / peso
den = cv2.GaussianBlur(warp * cara[..., None], (0, 0), sig) / peso
relit = np.clip(warp * np.clip((num + 1) / (den + 1), 0.2, 3.0), 0, 255)

# 3. La taza va delante: GrabCut en su rectángulo, con el café de la boca rellenado.
m = np.zeros((h, w), np.uint8)
cv2.grabCut(gen, m, rect_taza, np.zeros((1, 65)), np.zeros((1, 65)), 6, cv2.GC_INIT_WITH_RECT)
taza = np.where((m == 1) | (m == 3), 255, 0).astype(np.uint8)
contornos, _ = cv2.findContours(taza, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
silueta = np.zeros_like(taza)
cv2.drawContours(silueta, [max(contornos, key=cv2.contourArea)], -1, 255, -1)
taza = cv2.GaussianBlur(cv2.dilate(silueta, np.ones((5, 5), np.uint8)).astype(np.float32) / 255, (0, 0), 1.5)

a = cv2.GaussianBlur(np.clip(cara * (1 - taza), 0, 1), (0, 0), 1.0)[..., None]
cv2.imwrite(salida, np.clip(genf * (1 - a) + relit * a, 0, 255).astype(np.uint8), [cv2.IMWRITE_JPEG_QUALITY, 93])
print(f'✅ {salida}')

# 4. La máscara de los objetos. La caja: su cara (de la perspectiva) más el costado y
#    la tapa, que la IA dibujó a la izquierda y arriba (≈ 8 % del ancho de la cara).
esq = cv2.perspectiveTransform(np.float32([[0, 0], [real.shape[1], 0], [real.shape[1], real.shape[0]], [0, real.shape[0]]]).reshape(-1, 1, 2), H).reshape(-1, 2)
ancho_cara = esq[1][0] - esq[0][0]
costado, tapa = 0.23 * ancho_cara, 0.17 * ancho_cara
puntos = np.vstack([esq, esq[[0, 3]] - [costado, 0], esq[[0, 1]] - [costado * 0.6, tapa]]).astype(np.int32)
objetos = np.zeros((h, w), np.uint8)
cv2.fillConvexPoly(objetos, cv2.convexHull(puntos), 255)
objetos = cv2.max(objetos, silueta)
ruta_objetos = salida.rsplit('.', 1)[0] + '-objetos.png'
cv2.imwrite(ruta_objetos, objetos)
print(f'✅ {ruta_objetos}')
