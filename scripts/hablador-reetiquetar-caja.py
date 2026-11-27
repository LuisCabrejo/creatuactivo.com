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
      [--etiqueta <foto>] [--cara x,y x,y x,y x,y]

El rectángulo de la taza (para GrabCut) va en píxeles de la escena; por defecto, el
de la escena del 21 nov 2026 (1696 × 2528).

--etiqueta y --cara (27 nov 2026, la caja de ESTADOS UNIDOS): de la de allá no hay
etiqueta plana; la foto oficial de ganoexcel.us muestra la caja en tres cuartos y con
granos tapando el pie. --cara son las cuatro esquinas, en píxeles de esa foto y en
orden (arriba-izq, arriba-der, abajo-der, abajo-izq), de la parte del FRENTE que se
ve: sin el costado y sin los granos. Sin --cara, la cara es toda la imagen (Colombia),
o su silueta si la foto trae transparencia (los frascos).

Para las escenas por negocio (27 nov 2026: salón de belleza y gimnasio), donde no hay
taza delante de la etiqueta y hay más de un producto:
  --sin-taza          no recorta ninguna taza (sin GrabCut). Los cuatro números del
                      rectángulo de la taza sobran.
  --zona x y w h      busca la etiqueta solo en ese rectángulo de la escena: el champú y
                      el acondicionador tienen el mismo diseño, y sin zona la etiqueta de
                      uno calzaba en el frasco del otro.
  --delante <png>     lo blanco de esa máscara está DELANTE de esta etiqueta y no se pinta
                      (el frasco de Cordygold delante de la caja de Ganocafé Classic). Es
                      la <salida>-objetos.png de la pasada del producto de adelante.
  --sin-costado       la máscara de objetos es la silueta de la etiqueta, sin sumarle el
                      costado y la tapa de una caja (los frascos).
  --min-puntos N      puntos que deben calzar (60 por defecto): una etiqueta pequeña,
                      como la del frasco de Cordygold, da menos.
  --desenfoque S      la profundidad de campo que se le da a la etiqueta (1,7 por
                      defecto: la caja de Colombia va detrás de la taza). Una caja que
                      la escena tiene enfocada pide menos.
Con varios productos se corre una vez por producto, del de adelante al de atrás, y
cada pasada parte de la salida de la anterior.
"""
import sys
import cv2
import numpy as np

args = sys.argv[1:]
def opcion(nombre, n):
    if nombre not in args: return None
    i = args.index(nombre); valor = args[i + 1:i + 1 + n]; del args[i:i + 1 + n]; return valor
ETIQUETA = (opcion('--etiqueta', 1) or ['public/productos/_set/limpios/ganocafe-3-en-1.png'])[0]
cara_ref = opcion('--cara', 4)
zona = opcion('--zona', 4)
delante = (opcion('--delante', 1) or [None])[0]
minimo = int((opcion('--min-puntos', 1) or ['60'])[0])
desenfoque = float((opcion('--desenfoque', 1) or ['1.7'])[0])
sin_taza = '--sin-taza' in args
sin_costado = '--sin-costado' in args
args = [a for a in args if a not in ('--sin-taza', '--sin-costado')]
escena_ruta, salida = args[0], args[1]
rect_taza = tuple(int(v) for v in args[2:6]) if len(args) >= 6 else (800, 1480, 820, 780)

gen = cv2.imread(escena_ruta)
real = cv2.imread(ETIQUETA, cv2.IMREAD_UNCHANGED)
h, w = gen.shape[:2]
# Las esquinas de la cara en la foto de la etiqueta: toda la imagen, o las de --cara.
if cara_ref:
    esq_ref = np.float32([[float(v) for v in p.split(',')] for p in cara_ref])
else:
    esq_ref = np.float32([[0, 0], [real.shape[1], 0], [real.shape[1], real.shape[0]], [0, real.shape[0]]])
mascara_ref = np.zeros(real.shape[:2], np.uint8)
cv2.fillConvexPoly(mascara_ref, esq_ref.astype(np.int32), 255)
if real.shape[2] == 4 and not cara_ref:
    mascara_ref = np.where(real[:, :, 3] > 128, 255, 0).astype(np.uint8)
mascara_escena = None
if zona:
    zx, zy, zw, zh = (int(v) for v in zona)
    mascara_escena = np.zeros((h, w), np.uint8)
    mascara_escena[zy:zy + zh, zx:zx + zw] = 255

# 1. La perspectiva: rasgos de la etiqueta real dentro de la caja generada.
sift = cv2.SIFT_create(8000)
k1, d1 = sift.detectAndCompute(cv2.cvtColor(real[:, :, :3], cv2.COLOR_BGR2GRAY), mascara_ref)
k2, d2 = sift.detectAndCompute(cv2.cvtColor(gen, cv2.COLOR_BGR2GRAY), mascara_escena)
pares = cv2.FlannBasedMatcher(dict(algorithm=1, trees=5), dict(checks=80)).knnMatch(d1, d2, k=2)
buenos = [a for a, b in pares if a.distance < 0.72 * b.distance]
src = np.float32([k1[a.queryIdx].pt for a in buenos])
dst = np.float32([k2[a.trainIdx].pt for a in buenos])
H, inl = cv2.findHomography(src, dst, cv2.RANSAC, 4.0)
dentro = inl.ravel() == 1
err = np.linalg.norm(cv2.perspectiveTransform(src[dentro].reshape(-1, 1, 2), H).reshape(-1, 2) - dst[dentro], axis=1)
print(f'etiqueta: {int(dentro.sum())} puntos, error medio {err.mean():.2f} px')
if dentro.sum() < minimo or err.mean() > 3:
    sys.exit('⛔ La etiqueta no se encontró con precisión en la escena: no se reetiqueta.')

# 2. La etiqueta real en esa perspectiva, con la profundidad de campo y la luz de la escena.
genf = gen.astype(np.float32)
warp = cv2.warpPerspective(real[:, :, :3].astype(np.float32), H, (w, h), flags=cv2.INTER_LANCZOS4)
warp = cv2.GaussianBlur(warp, (0, 0), desenfoque)
cara = cv2.warpPerspective(mascara_ref, H, (w, h))
cara = cv2.erode(cara, np.ones((5, 5), np.uint8)).astype(np.float32) / 255
sig = 28
peso = cv2.GaussianBlur(cara, (0, 0), sig)[..., None] + 1e-4
num = cv2.GaussianBlur(genf * cara[..., None], (0, 0), sig) / peso
den = cv2.GaussianBlur(warp * cara[..., None], (0, 0), sig) / peso
relit = np.clip(warp * np.clip((num + 1) / (den + 1), 0.2, 3.0), 0, 255)

# 3. La taza va delante: GrabCut en su rectángulo, con el café de la boca rellenado.
silueta = np.zeros((h, w), np.uint8)
taza = np.zeros((h, w), np.float32)
if not sin_taza:
    m = np.zeros((h, w), np.uint8)
    cv2.grabCut(gen, m, rect_taza, np.zeros((1, 65)), np.zeros((1, 65)), 6, cv2.GC_INIT_WITH_RECT)
    taza = np.where((m == 1) | (m == 3), 255, 0).astype(np.uint8)
    contornos, _ = cv2.findContours(taza, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
    silueta = np.zeros_like(taza)
    cv2.drawContours(silueta, [max(contornos, key=cv2.contourArea)], -1, 255, -1)
    # GrabCut se lleva mesa a la derecha, bajo el asa, hasta el borde de su rectángulo
    # (21 nov: un corte vertical en la mesa del hablador). Se recorta la silueta al borde
    # real de la taza: el último píxel beige de cada fila, y bajo el asa, el del cuerpo.
    B, G, R = (gen[..., i].astype(int) for i in range(3))
    beige = (R > 105) & (G > 85) & (B > 60) & ((R - B) < 85)
    filas = np.nonzero(silueta.any(axis=1))[0]
    x0, x1 = rect_taza[0], rect_taza[0] + rect_taza[2]
    borde = np.array([(np.nonzero(beige[y, x0:x1])[0].max() + x0) if beige[y, x0:x1].any() else x0 for y in filas])
    borde = np.array([np.median(borde[max(0, i - 4):i + 5]) for i in range(len(borde))])
    # Lo más saliente del asa, buscado en los dos tercios de arriba: abajo, un brillo de
    # la mesa puede ser más «saliente» que el asa (21 nov: x 1665 en la fila 2200).
    pico = int(np.argmax(borde[: int(len(borde) * 0.65)]))
    # Después de su punto más saliente, el borde de la taza solo retrocede (el asa baja
    # hacia el cuerpo y la base se cierra): el mínimo acumulado. Lo beige que reaparece
    # más afuera es brillo de la mesa. ⚠️ Probado y descartado: «el primer mínimo» (un
    # diente del borde lo cortaba en el asa) y medir el cuerpo en la boca (es una elipse).
    tope_fila = borde.copy()
    for i in range(pico + 1, len(borde)):
        tope_fila[i] = min(tope_fila[i - 1], borde[i])
    for i, y in enumerate(filas):
        tope = int(tope_fila[i]) + 6
        silueta[y, tope:] = 0
    taza = cv2.GaussianBlur(cv2.dilate(silueta, np.ones((5, 5), np.uint8)).astype(np.float32) / 255, (0, 0), 1.5)
# Lo que otra pasada dejó delante (--delante) tampoco se pinta.
if delante:
    adelante = cv2.resize(cv2.imread(delante, cv2.IMREAD_GRAYSCALE), (w, h)).astype(np.float32) / 255
    taza = np.maximum(taza, cv2.GaussianBlur(adelante, (0, 0), 1.5))

a = cv2.GaussianBlur(np.clip(cara * (1 - taza), 0, 1), (0, 0), 1.0)[..., None]
cv2.imwrite(salida, np.clip(genf * (1 - a) + relit * a, 0, 255).astype(np.uint8), [cv2.IMWRITE_JPEG_QUALITY, 93])
print(f'✅ {salida}')

# 4. La máscara de los objetos. La caja: su cara (de la perspectiva) más el costado y
#    la tapa, que la IA dibujó a la izquierda y arriba (≈ 8 % del ancho de la cara).
esq = cv2.perspectiveTransform(esq_ref.reshape(-1, 1, 2), H).reshape(-1, 2)
ancho_cara = esq[1][0] - esq[0][0]
costado, tapa = 0.23 * ancho_cara, 0.17 * ancho_cara
puntos = np.vstack([esq, esq[[0, 3]] - [costado, 0], esq[[0, 1]] - [costado * 0.6, tapa]]).astype(np.int32)
objetos = np.zeros((h, w), np.uint8)
if sin_costado:
    objetos = cv2.warpPerspective(mascara_ref, H, (w, h))
else:
    cv2.fillConvexPoly(objetos, cv2.convexHull(puntos), 255)
objetos = cv2.max(objetos, silueta)
ruta_objetos = salida.rsplit('.', 1)[0] + '-objetos.png'
cv2.imwrite(ruta_objetos, objetos)
print(f'✅ {ruta_objetos}')
