#!/usr/bin/env python
"""Blanqueamiento dental por máscara de boca (mediapipe FaceMesh).

    python blanquear_dientes.py <entrada.mp4> <salida.mp4> [--fuerza 1.0] [--prueba t1,t2,...]

Aísla el contorno INTERNO de los labios, dentro de él separa los dientes del
interior oscuro por luminancia, y sobre esa zona sube L* y acerca b* al neutro
—que es literalmente lo que hace un blanqueamiento: menos amarillo, más luz.
La máscara va difuminada para que no se vea el borde.
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

LABIO_INTERNO = [78,95,88,178,87,14,317,402,318,324,308,415,310,311,312,13,82,81,80,191]

def procesar(bgr, malla, fuerza=1.0):
    h,w = bgr.shape[:2]
    img = mp.Image(image_format=mp.ImageFormat.SRGB, data=cv2.cvtColor(bgr, cv2.COLOR_BGR2RGB))
    r = malla.detect_for_video(img, procesar.ts); procesar.ts += 41
    if not r.face_landmarks: return bgr, 0.0
    lm = r.face_landmarks[0]
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

    # OJO con la escala: en OpenCV L* va de 0 a 255, NO de 0 a 100. Medido en este
    # rodaje, los dientes salieron en L*=106 y la piel en 89 — solo 17 puntos de
    # separación, cuando una imagen bien resuelta tiene entre 40 y 60. El objetivo
    # se fija por medición, nunca de memoria.
    OBJ_L = 140.0
    L2 = L + m * np.clip(OBJ_L - L, 0, 45) * 0.60    # solo aclara; nunca oscurece
    b2 = b - m * np.clip(b - 128, 0, 40) * 0.80      # b* hacia el neutro = menos amarillo
    lab[:,:,0], lab[:,:,2] = np.clip(L2,0,255), np.clip(b2,0,255)
    return cv2.cvtColor(lab.astype(np.uint8), cv2.COLOR_LAB2BGR), float(m.sum())

procesar.ts = 0

def main():
    ent, sal = sys.argv[1], sys.argv[2]
    fuerza = float(sys.argv[sys.argv.index("--fuerza")+1]) if "--fuerza" in sys.argv else 1.0
    prueba = sys.argv[sys.argv.index("--prueba")+1].split(",") if "--prueba" in sys.argv else None
    cap = cv2.VideoCapture(ent)
    fps = cap.get(cv2.CAP_PROP_FPS); W=int(cap.get(3)); H=int(cap.get(4))
    n = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    malla = crear_malla()
    if prueba:
        for t in prueba:
            cap.set(cv2.CAP_PROP_POS_MSEC, float(t)*1000)
            ok, f = cap.read()
            if not ok: continue
            g,_ = procesar(f, malla, fuerza)
            cv2.imwrite(f"{sal}_t{t}_antes.png", f); cv2.imwrite(f"{sal}_t{t}_despues.png", g)
        print("fotogramas de prueba escritos"); return
    import subprocess
    out = subprocess.Popen(
        ["ffmpeg","-y","-v","error","-f","rawvideo","-pix_fmt","bgr24",
         "-s",f"{W}x{H}","-r",str(fps),"-i","-","-an",
         "-c:v","libx264","-preset","medium","-crf","16","-pix_fmt","yuv420p",sal],
        stdin=subprocess.PIPE)
    con, i = 0, 0
    while True:
        ok, f = cap.read()
        if not ok: break
        g, area = procesar(f, malla, fuerza)
        if area > 0: con += 1
        out.stdin.write(g.tobytes()); i += 1
        if i % 240 == 0: print(f"  {i}/{n}", flush=True)
    out.stdin.close(); out.wait(); cap.release()
    print(f"✅ {i} fotogramas · boca detectada y tratada en {con} ({100*con/max(i,1):.0f}%)")

if __name__ == "__main__": main()
