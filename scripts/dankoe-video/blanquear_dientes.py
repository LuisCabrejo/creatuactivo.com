#!/usr/bin/env python
r"""Retoque facial por máscara: blanqueamiento dental + suavizado de piel.

    python blanquear_dientes.py <entrada.mp4> <salida.mp4>
           [--fuerza 0.85] [--piel 0.45] [--prueba t1,t2,...] [--medir t1,t2,...]

DIENTES. Aísla el contorno INTERNO de los labios, dentro de él separa los dientes
del interior oscuro por luminancia, y sobre esa zona sube L* y acerca b* al neutro
—que es literalmente lo que hace un blanqueamiento: menos amarillo, más luz.

PIEL. Sobre el óvalo de la cara, MENOS ojos, cejas, boca y el borde de la nariz,
aplica un filtro bilateral (respeta los bordes, alisa lo plano) y lo mezcla con el
original. Nunca al 100 %: la textura de la piel es lo que separa una cara de un
dibujo. Las zonas excluidas son las que dan la sensación de nitidez — si se alisan
los ojos, la cara entera se lee como filtro de teléfono.

Las dos máscaras van difuminadas para que no se vea el borde.

⭐ NIVELES ÓPTIMOS, Y CÓMO SE COMPRUEBAN (calibrados el 11 sep 2026)
--------------------------------------------------------------------
`--medir t1,t2` imprime los dos números que definen si quedó natural o cargado.
No se juzga de memoria ni «a ojo en la miniatura»: se mide y se compara.

| Qué                          | Natural   | Cargado    | Se mide con                    |
|------------------------------|-----------|------------|--------------------------------|
| separación dientes−piel (L*) | 30 a 42   | > 50       | --medir, «separación después»  |
| textura de piel conservada   | 65 a 80 % | < 55 %     | --medir, «textura conservada»  |

**Valores por defecto: `--fuerza 0.85` y `--piel 0.45`.** Salieron de barrer el
rodaje del día 4 y quedarse con el punto donde la separación llega a ~35 y la
textura conserva ~80 %. El suavizado es deliberadamente discreto: en un reel de
documentación una cara sin poro se lee como filtro, y eso contradice la pieza.

⚠️ La separación se mide en la escala de OpenCV, donde **L\* va de 0 a 255, NO de
0 a 100**. Una cara bien resuelta tiene entre 40 y 60 puntos de separación entre
dientes y piel; este rodaje partía de **17**, que es lo que hace que los dientes se
vean apagados. Llevarlo a 36 es corregir; pasar de 50 es dentadura de anuncio.
"""
import cv2, numpy as np, mediapipe as mp, sys, os
from mediapipe.tasks import python as mptask
from mediapipe.tasks.python import vision as mpvision

MODELO = os.path.join(os.path.dirname(os.path.abspath(__file__)), "modelos/face_landmarker.task")

def crear_malla():
    opts = mpvision.FaceLandmarkerOptions(
        base_options=mptask.BaseOptions(model_asset_path=MODELO),
        running_mode=mpvision.RunningMode.VIDEO, num_faces=1)
    return mpvision.FaceLandmarker.create_from_options(opts)

# cuántos puntos L* por encima de la piel deben quedar los dientes (ver la cabecera)
SEPARACION_OBJETIVO = 46.0

LABIO_INTERNO = [78,95,88,178,87,14,317,402,318,324,308,415,310,311,312,13,82,81,80,191]
OVALO = [10,338,297,332,284,251,389,356,454,323,361,288,397,365,379,378,400,377,152,148,176,
         149,150,136,172,58,132,93,234,127,162,21,54,103,67,109]
OJO_D = [33,7,163,144,145,153,154,155,133,173,157,158,159,160,161,246]
OJO_I = [362,382,381,380,374,373,390,249,263,466,388,387,386,385,384,398]
CEJA_D = [70,63,105,66,107,55,65,52,53,46]
CEJA_I = [300,293,334,296,336,285,295,282,283,276]
LABIO_EXT = [61,146,91,181,84,17,314,405,321,375,291,409,270,269,267,0,37,39,40,185]
NARIZ = [168,6,197,195,5,4,45,220,115,48,64,98,97,2,326,327,278,294,344,440,275]


def _poli(lm, idxs, w, h):
    return np.array([[int(lm[i].x*w), int(lm[i].y*h)] for i in idxs], np.int32)


def suavizar_piel(bgr, lm, fuerza):
    """Bilateral sobre el óvalo facial, sin ojos, cejas, boca ni nariz."""
    if fuerza <= 0: return bgr, None
    h, w = bgr.shape[:2]
    cara = np.zeros((h,w), np.uint8)
    cv2.fillPoly(cara, [_poli(lm, OVALO, w, h)], 255)
    fuera = np.zeros((h,w), np.uint8)
    for idxs in (OJO_D, OJO_I, CEJA_D, CEJA_I, LABIO_EXT, NARIZ):
        cv2.fillPoly(fuera, [_poli(lm, idxs, w, h)], 255)
    # los rasgos se protegen con holgura: alisar justo hasta el borde del ojo se nota
    fuera = cv2.dilate(fuera, np.ones((9,9), np.uint8), iterations=2)
    cara = cv2.bitwise_and(cara, cv2.bitwise_not(fuera))
    cara = cv2.erode(cara, np.ones((5,5), np.uint8), iterations=1)
    if cv2.countNonZero(cara) < 500: return bgr, None
    m = cv2.GaussianBlur(cara.astype(np.float32)/255.0, (0,0), 9.0)
    m = np.clip(m, 0, 1)[:,:,None] * fuerza
    # bilateral: alisa lo plano y respeta los bordes; el radio se escala con la cara
    lado = int(np.sqrt(cv2.countNonZero(cara)))
    d = max(5, min(15, lado//45*2+5))
    suave = cv2.bilateralFilter(bgr, d, 42, 42)
    return (bgr.astype(np.float32)*(1-m) + suave.astype(np.float32)*m).astype(np.uint8), cara

def procesar(bgr, malla, fuerza=1.0, piel=0.0):
    h,w = bgr.shape[:2]
    img = mp.Image(image_format=mp.ImageFormat.SRGB, data=cv2.cvtColor(bgr, cv2.COLOR_BGR2RGB))
    r = malla.detect_for_video(img, procesar.ts); procesar.ts += 41
    if not r.face_landmarks: return bgr, 0.0
    lm = r.face_landmarks[0]
    bgr, mascara_cara = suavizar_piel(bgr, lm, piel)
    if mascara_cara is None:
        mascara_cara = np.zeros(bgr.shape[:2], np.uint8)
        cv2.fillPoly(mascara_cara, [_poli(lm, OVALO, w, h)], 255)
        fuera = np.zeros(bgr.shape[:2], np.uint8)
        for idxs in (OJO_D, OJO_I, CEJA_D, CEJA_I, LABIO_EXT, NARIZ):
            cv2.fillPoly(fuera, [_poli(lm, idxs, w, h)], 255)
        mascara_cara = cv2.bitwise_and(mascara_cara,
            cv2.bitwise_not(cv2.dilate(fuera, np.ones((9,9), np.uint8), iterations=2)))
    pts = np.array([[int(lm[i].x*w), int(lm[i].y*h)] for i in LABIO_INTERNO], np.int32)
    boca = np.zeros((h,w), np.uint8)
    cv2.fillPoly(boca, [pts], 255)
    if cv2.countNonZero(boca) < 120: return bgr, 0.0

    lab = cv2.cvtColor(bgr, cv2.COLOR_BGR2LAB).astype(np.float32)
    L,a,b = lab[:,:,0], lab[:,:,1], lab[:,:,2]
    dentro = boca > 0
    # los dientes son lo CLARO dentro de la boca; el resto es cavidad y lengua
    vals = L[dentro]
    if vals.size < 120: return bgr, 0.0
    umbral = np.percentile(vals, 55)
    dientes = ((L > umbral) & dentro).astype(np.float32)
    if dientes.sum() < 60: return bgr, 0.0
    # borde suave: sin esto se ve un parche recortado
    m = cv2.GaussianBlur(dientes, (0,0), 3.0)
    m = np.clip(m, 0, 1) * fuerza

    # ⚠️ El objetivo NO es una constante: se deriva de la PIEL de este fotograma.
    # Lo era —140, medido el 8 sep sobre un rodaje con los dientes en L*=106— y el
    # 11 sep no hizo absolutamente nada: en el rodaje del día 4 los dientes ya salían
    # entre 150 y 194, así que `clip(140 - L, 0, 45)` daba cero y el blanqueamiento
    # no existía. Una constante de exposición ajena es una constante equivocada.
    # Se apunta a dejar los dientes SEPARACION_OBJETIVO puntos por encima de la piel,
    # que es lo que hace que se lean blancos sin parecer un anuncio.
    # ⚠️ La referencia es la PIEL DE LA CARA, no el interior de la boca. Con el
    # interior como referencia el objetivo caía por debajo de los dientes y el
    # blanqueamiento no hacía nada, sin importar --fuerza (11 sep 2026).
    cara_px = L[mascara_cara > 0]
    piel_ref = float(np.median(cara_px)) if cara_px.size > 400 else float(np.median(L[dentro]))
    OBJ_L = min(238.0, piel_ref + SEPARACION_OBJETIVO)
    L2 = L + m * np.clip(OBJ_L - L, 0, 60) * 0.60    # solo aclara; nunca oscurece
    b2 = b - m * np.clip(b - 128, 0, 40) * 0.80      # b* hacia el neutro = menos amarillo
    lab[:,:,0], lab[:,:,2] = np.clip(L2,0,255), np.clip(b2,0,255)
    return cv2.cvtColor(lab.astype(np.uint8), cv2.COLOR_LAB2BGR), float(m.sum())

procesar.ts = 0

def medir(bgr, malla):
    """Los dos números que dicen si el retoque quedó natural o de anuncio."""
    h, w = bgr.shape[:2]
    img = mp.Image(image_format=mp.ImageFormat.SRGB, data=cv2.cvtColor(bgr, cv2.COLOR_BGR2RGB))
    r = malla.detect_for_video(img, medir.ts); medir.ts += 41
    if not r.face_landmarks: return None
    lm = r.face_landmarks[0]
    lab = cv2.cvtColor(bgr, cv2.COLOR_BGR2LAB).astype(np.float32); L = lab[:,:,0]
    boca = np.zeros((h,w), np.uint8); cv2.fillPoly(boca, [_poli(lm, LABIO_INTERNO, w, h)], 255)
    dentro = boca > 0
    if dentro.sum() < 120: return None
    dientes = L[dentro & (L > np.percentile(L[dentro], 55))]
    # mejilla: óvalo sin rasgos, que es donde se juzga la piel
    cara = np.zeros((h,w), np.uint8); cv2.fillPoly(cara, [_poli(lm, OVALO, w, h)], 255)
    fuera = np.zeros((h,w), np.uint8)
    for idxs in (OJO_D, OJO_I, CEJA_D, CEJA_I, LABIO_EXT, NARIZ):
        cv2.fillPoly(fuera, [_poli(lm, idxs, w, h)], 255)
    fuera = cv2.dilate(fuera, np.ones((9,9), np.uint8), iterations=2)
    piel_m = cv2.bitwise_and(cara, cv2.bitwise_not(fuera)) > 0
    if piel_m.sum() < 500: return None
    piel_L = L[piel_m]
    # textura = desviación LOCAL, no global: la global mide el modelado de la luz
    g = cv2.cvtColor(bgr, cv2.COLOR_BGR2GRAY).astype(np.float32)
    med = cv2.blur(g, (7,7)); det = np.abs(g - med)
    return {"dientes_L": float(np.mean(dientes)), "piel_L": float(np.mean(piel_L)),
            "separacion": float(np.mean(dientes) - np.mean(piel_L)),
            "textura": float(np.mean(det[piel_m]))}


medir.ts = 0


def main():
    ent, sal = sys.argv[1], sys.argv[2]
    fuerza = float(sys.argv[sys.argv.index("--fuerza")+1]) if "--fuerza" in sys.argv else 0.85
    piel   = float(sys.argv[sys.argv.index("--piel")+1])   if "--piel"   in sys.argv else 0.45
    prueba = sys.argv[sys.argv.index("--prueba")+1].split(",") if "--prueba" in sys.argv else None
    if "--medir" in sys.argv:
        cap = cv2.VideoCapture(ent); malla = crear_malla(); m2 = crear_malla()
        print(f"  fuerza={fuerza}  piel={piel}")
        print(f"  {'momento':>9s} {'separación':>22s}  {'textura conservada':>20s}")
        for t in sys.argv[sys.argv.index("--medir")+1].split(","):
            cap.set(cv2.CAP_PROP_POS_MSEC, float(t)*1000)
            ok, f = cap.read()
            if not ok: continue
            a = medir(f, malla)
            g, _ = procesar(f.copy(), m2, fuerza, piel)
            b = medir(g, malla)
            if not a or not b: print(f"  {t:>9s}  (sin cara detectada)"); continue
            cons = 100*b["textura"]/max(a["textura"], 1e-6)
            print(f"  {t:>9s}s  {a['separacion']:6.1f} → {b['separacion']:6.1f} puntos L*"
                  f"      {cons:5.1f} %")
        cap.release()
        print("\n  natural: separación 30-42 · textura conservada 65-80 %")
        print("  cargado: separación > 50 · textura < 55 %")
        return
    cap = cv2.VideoCapture(ent)
    fps = cap.get(cv2.CAP_PROP_FPS); W=int(cap.get(3)); H=int(cap.get(4))
    n = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    malla = crear_malla()
    if prueba:
        for t in prueba:
            cap.set(cv2.CAP_PROP_POS_MSEC, float(t)*1000)
            ok, f = cap.read()
            if not ok: continue
            g,_ = procesar(f, malla, fuerza, piel)
            cv2.imwrite(f"{sal}_t{t}_antes.png", f); cv2.imwrite(f"{sal}_t{t}_despues.png", g)
        print("fotogramas de prueba escritos"); return
    import subprocess
    # ⚠️ el audio del original se COPIA. El retoque corre sobre el montaje curado, antes
    # del color, y si aquí se pierde la pista hay que volver a sincronizarla: el error
    # más caro de todo este pipeline.
    out = subprocess.Popen(
        ["ffmpeg","-y","-v","error","-f","rawvideo","-pix_fmt","bgr24",
         "-s",f"{W}x{H}","-r",str(fps),"-i","-","-i",ent,
         "-map","0:v:0","-map","1:a:0?","-shortest",
         "-c:v","libx264","-preset","medium","-crf","16","-pix_fmt","yuv420p",
         "-c:a","pcm_s16le","-ar","48000",sal],
        stdin=subprocess.PIPE)
    con, i = 0, 0
    while True:
        ok, f = cap.read()
        if not ok: break
        g, area = procesar(f, malla, fuerza, piel)
        if area > 0: con += 1
        out.stdin.write(g.tobytes()); i += 1
        if i % 240 == 0: print(f"  {i}/{n}", flush=True)
    out.stdin.close(); out.wait(); cap.release()
    print(f"✅ {i} fotogramas · boca detectada y tratada en {con} ({100*con/max(i,1):.0f}%)")

if __name__ == "__main__": main()
