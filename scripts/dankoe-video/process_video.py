#!/usr/bin/env python3
"""
Dan Koe Style Video Processor
DEL: Video con pared blanca detras del sujeto
AL:  Fondo negro cinematografico con gradiente radial sutil + color grading moody

Cambio v2: bypass de rembg.new_session() — usa onnxruntime directo
para evitar el bloqueo de pooch al verificar checksum del modelo.
"""

import sys
import subprocess
import time
from pathlib import Path
import cv2
import numpy as np
import onnxruntime as ort
from tqdm import tqdm
from PIL import Image

# ============ CONFIG ============
INPUT_VIDEO   = sys.argv[1] if len(sys.argv) > 1 else "input/video.mp4"
OUTPUT_VIDEO  = "output/video_dankoe.mp4"
MODEL_PATH    = Path.home() / ".u2net" / "u2net_human_seg.onnx"  # 175MB, 320x320, CPU
OUTPUT_WIDTH  = 1080
OUTPUT_HEIGHT = 1920                 # 9:16 vertical (Reels/TikTok/Shorts)

# Gradiente radial
BG_CENTER_BRIGHTNESS = 45   # era 32 — más profundidad, silla se integra mejor
BG_EDGE_BRIGHTNESS   = 0
GRADIENT_FALLOFF     = 2.5
GRADIENT_CENTER_Y    = 0.40

# Suavizado temporal del alpha (reduce flicker en bordes)
ALPHA_TEMPORAL_WEIGHT = 0.35

# Color grading cinematografico
SHADOW_BLUE_LIFT   = 14    # era 10 — tono cinematográfico más pronunciado
HIGHLIGHT_WARMTH   = 6
CONTRAST_STRENGTH  = 0.6

# Suavizado de bordes del recorte
MASK_CLOSE_PX    = 3       # closing — rellena huecos puntuales
MASK_ERODE_PX    = 4       # erosión base
MASK_FEATHER_PX  = 2       # blur suave
FB_FUSION_R1     = 90      # radio primera pasada FB Fusion
FB_FUSION_R2     = 3       # radio segunda pasada FB Fusion

# Halo controlado — convierte el borde en un outline intencional oscuro
OUTLINE_ERODE_PX = 3       # px adicionales a erosionar para definir zona interior "limpia"
OUTLINE_COLOR_BGR = (30, 30, 30)  # gris oscuro #1e1e1e — outline intencional

# Fade-to-black inferior (oculta corte brusco de la mesa)
FADE_START_Y     = 0.72    # 0.0=arriba, 1.0=abajo — donde empieza el fade

# ============ BIREFNET DIRECTO (sin rembg/pooch) ============

def load_model():
    """Carga BiRefNet via onnxruntime directo — sin pooch, sin lock, sin red."""
    if not MODEL_PATH.exists():
        print(f"ERROR: modelo no encontrado en {MODEL_PATH}")
        print("       Descargalo con:")
        print("       curl -L -o ~/.u2net/birefnet-general.onnx \\")
        print("         https://github.com/danielgatis/rembg/releases/download/v0.0.0/BiRefNet-general-epoch_244.onnx")
        sys.exit(1)

    providers = ["CPUExecutionProvider"]

    print(f"    Provider: {providers[0]}")
    session = ort.InferenceSession(str(MODEL_PATH), providers=providers)
    return session

def preprocess(img_rgb: np.ndarray) -> np.ndarray:
    """Preprocesa imagen RGB para u2net: resize 320x320 + normalizar."""
    img = cv2.resize(img_rgb, (320, 320), interpolation=cv2.INTER_LINEAR)
    img = img.astype(np.float32) / 255.0
    mean = np.array([0.485, 0.456, 0.406], dtype=np.float32)
    std  = np.array([0.229, 0.224, 0.225], dtype=np.float32)
    img = (img - mean) / std
    img = img.transpose(2, 0, 1)[None]  # HWC -> NCHW
    return img

def predict_mask(session, img_rgb: np.ndarray, orig_w: int, orig_h: int) -> np.ndarray:
    """Devuelve alpha mask float32 [0,1] del tamaño original."""
    inp = preprocess(img_rgb)
    input_name = session.get_inputs()[0].name
    out = session.run(None, {input_name: inp})[0]  # (1, 1, 1024, 1024)

    # Sigmoid + squeeze
    pred = 1.0 / (1.0 + np.exp(-out[0, 0]))
    mi, ma = pred.min(), pred.max()
    if ma > mi:
        pred = (pred - mi) / (ma - mi)

    # Resize al tamaño original
    alpha = cv2.resize(pred, (orig_w, orig_h), interpolation=cv2.INTER_LANCZOS4)
    return alpha.astype(np.float32)

# ============ VIDEO ============

def get_video_info(path):
    cap = cv2.VideoCapture(str(path))
    fps = cap.get(cv2.CAP_PROP_FPS)
    w   = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    h   = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    n   = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    cap.release()
    return fps, w, h, n

def create_radial_gradient(w, h):
    y, x = np.ogrid[:h, :w]
    cx = w // 2
    cy = int(h * GRADIENT_CENTER_Y)
    max_dist = np.sqrt(max(cx, w - cx) ** 2 + max(cy, h - cy) ** 2)
    dist = np.sqrt((x - cx) ** 2 + (y - cy) ** 2)
    mask = np.clip(1.0 - dist / max_dist, 0, 1) ** GRADIENT_FALLOFF
    brightness = BG_EDGE_BRIGHTNESS + (BG_CENTER_BRIGHTNESS - BG_EDGE_BRIGHTNESS) * mask
    bg = np.stack([brightness * 1.05, brightness * 0.95, brightness * 0.90], axis=-1)
    return np.clip(bg, 0, 255).astype(np.uint8)

def apply_cinematic_grade(bgr):
    img = bgr.astype(np.float32)
    lum = (0.114*img[...,0] + 0.587*img[...,1] + 0.299*img[...,2]) / 255.0
    shadow_mask    = np.clip(1 - lum / 0.35,       0, 1)[..., None]
    highlight_mask = np.clip((lum - 0.30) / 0.70,  0, 1)[..., None]
    img[..., 0] += shadow_mask[..., 0]    * SHADOW_BLUE_LIFT
    img[..., 2] += highlight_mask[..., 0] * HIGHLIGHT_WARMTH
    img[..., 2] -= shadow_mask[..., 0]    * (SHADOW_BLUE_LIFT * 0.5)
    norm = img / 255.0
    s_curve = np.where(norm < 0.5, 2*norm**2, 1 - 2*(1-norm)**2)
    img = (norm*(1-CONTRAST_STRENGTH) + s_curve*CONTRAST_STRENGTH) * 255.0
    return np.clip(img, 0, 255).astype(np.uint8)

def refine_alpha(alpha, close_px=3, erode_px=3, blur_px=2):
    alpha_u8 = (alpha * 255).astype(np.uint8)

    # 1) Closing pequeño — rellena huecos puntuales (puntos negros en manos)
    #    Kernel pequeño para NO expandir hacia el fondo blanco
    if close_px > 0:
        k_close = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (close_px*2+1, close_px*2+1))
        alpha_u8 = cv2.morphologyEx(alpha_u8, cv2.MORPH_CLOSE, k_close)

    # 2) Erosión — elimina halo de borde contaminado con color del fondo blanco
    if erode_px > 0:
        k_erode = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (erode_px*2+1, erode_px*2+1))
        alpha_u8 = cv2.erode(alpha_u8, k_erode, iterations=1)

    alpha = alpha_u8.astype(np.float32) / 255.0

    # 3) Blur — suaviza bordes para look natural
    if blur_px > 0:
        k = blur_px * 2 + 1
        alpha = cv2.GaussianBlur(alpha, (k, k), 0)

    return alpha

def fb_blur_fusion(image, F, B, alpha, r):
    """
    FB Blur Fusion — Photoroom ICIP 2021.
    Estima el color verdadero del foreground eliminando la contaminación
    del fondo original (blanco) de los píxeles de borde semitransparentes.
    image, F, B: float32 [H,W,3] en [0,1]
    alpha: float32 [H,W,1] en [0,1]
    """
    blurred_alpha = cv2.blur(alpha[:, :, 0], (r, r))[:, :, None]
    blurred_FA    = cv2.blur(F * alpha, (r, r))
    blurred_F     = blurred_FA / (blurred_alpha + 1e-5)
    blurred_B1A   = cv2.blur(B * (1 - alpha), (r, r))
    blurred_B     = blurred_B1A / ((1 - blurred_alpha) + 1e-5)
    F_out = blurred_F + alpha * (image - alpha * blurred_F - (1 - alpha) * blurred_B)
    return np.clip(F_out, 0, 1), blurred_B

def decontaminate_foreground(frame_rgb_f32, alpha_f32):
    """
    Dos pasadas de FB Blur Fusion para eliminar contaminación blanca del borde.
    frame_rgb_f32: float32 [H,W,3] en [0,1]
    alpha_f32: float32 [H,W] en [0,1]
    Retorna: float32 [H,W,3] con colores de borde corregidos
    """
    alpha_3 = alpha_f32[:, :, None]
    white   = np.ones_like(frame_rgb_f32)   # fondo original = blanco

    F, blur_B = fb_blur_fusion(frame_rgb_f32, frame_rgb_f32, white,  alpha_3, FB_FUSION_R1)
    F, _      = fb_blur_fusion(frame_rgb_f32, F,             blur_B, alpha_3, FB_FUSION_R2)
    return F

def apply_outline(canvas, alpha, off_y, off_x, scaled_h, scaled_w, bg_gradient):
    """
    Reemplaza la zona de borde (halo) con un outline oscuro intencional.
    La zona de borde = diferencia entre alpha original y alpha muy erosionado.
    """
    alpha_u8 = (alpha * 255).astype(np.uint8)
    # Máscara interior limpia (erosión extra)
    k = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (OUTLINE_ERODE_PX*2+1, OUTLINE_ERODE_PX*2+1))
    inner = cv2.erode(alpha_u8, k, iterations=1)
    # Zona de borde = alpha actual − zona interior
    edge_zone = ((alpha_u8 > 20) & (inner < 20)).astype(np.uint8)

    if edge_zone.sum() == 0:
        return canvas

    # Pintar zona de borde en gris oscuro en el canvas
    outline_color = np.array(OUTLINE_COLOR_BGR, dtype=np.float32)
    edge_f = edge_zone.astype(np.float32)[:, :, None]
    region = canvas[off_y:off_y+scaled_h, off_x:off_x+scaled_w].astype(np.float32)
    region = region * (1 - edge_f) + outline_color * edge_f
    canvas[off_y:off_y+scaled_h, off_x:off_x+scaled_w] = np.clip(region, 0, 255).astype(np.uint8)
    return canvas

def apply_bottom_fade(canvas, fade_start_y=0.72):
    """Fade-to-black progresivo en el tercio inferior — disuelve la mesa."""
    h = canvas.shape[0]
    start_px = int(h * fade_start_y)
    fade_zone = h - start_px
    gradient = np.linspace(1.0, 0.0, fade_zone, dtype=np.float32)
    for i, g in enumerate(gradient):
        canvas[start_px + i] = (canvas[start_px + i].astype(np.float32) * g).astype(np.uint8)
    return canvas

# ============ MAIN ============

def process_video():
    t0 = time.time()
    input_path  = Path(INPUT_VIDEO)
    output_path = Path(OUTPUT_VIDEO)
    output_path.parent.mkdir(parents=True, exist_ok=True)

    if not input_path.exists():
        print(f"ERROR: no encuentro {input_path}")
        sys.exit(1)

    print("==> Analizando video...")
    fps, w, h, n_frames = get_video_info(input_path)
    print(f"    {w}x{h} @ {fps:.1f}fps, {n_frames} frames")

    target_w, target_h = OUTPUT_WIDTH, OUTPUT_HEIGHT
    scale    = min(target_w / w, target_h / h)
    scaled_w = int(w * scale)
    scaled_h = int(h * scale)
    off_x    = (target_w - scaled_w) // 2
    off_y    = (target_h - scaled_h) // 2

    print(f"==> Salida: {target_w}x{target_h} (9:16)")
    print(f"==> Cargando modelo BiRefNet...")
    session = load_model()
    print(f"    Modelo listo en {time.time()-t0:.1f}s")

    bg_gradient = create_radial_gradient(target_w, target_h)

    temp_video = output_path.with_suffix(".temp.mp4")
    fourcc = cv2.VideoWriter_fourcc(*"mp4v")
    writer = cv2.VideoWriter(str(temp_video), fourcc, fps, (target_w, target_h))

    cap        = cv2.VideoCapture(str(input_path))
    prev_alpha = None

    print("==> Procesando frames...")
    for _ in tqdm(range(n_frames), unit="fr"):
        ret, frame_bgr = cap.read()
        if not ret:
            break

        frame_resized = cv2.resize(frame_bgr, (scaled_w, scaled_h), interpolation=cv2.INTER_LANCZOS4)
        frame_rgb     = cv2.cvtColor(frame_resized, cv2.COLOR_BGR2RGB)

        alpha = predict_mask(session, frame_rgb, scaled_w, scaled_h)

        if prev_alpha is not None and prev_alpha.shape == alpha.shape:
            alpha = ALPHA_TEMPORAL_WEIGHT * prev_alpha + (1 - ALPHA_TEMPORAL_WEIGHT) * alpha
        prev_alpha = alpha.copy()

        alpha = refine_alpha(alpha, MASK_CLOSE_PX, MASK_ERODE_PX, MASK_FEATHER_PX)

        # FB Blur Fusion — elimina contaminación blanca de píxeles de borde
        frame_f32 = frame_rgb.astype(np.float32) / 255.0
        fg_clean  = decontaminate_foreground(frame_f32, alpha)

        # Grading sobre foreground limpio
        fg_bgr = cv2.cvtColor((fg_clean * 255).astype(np.uint8), cv2.COLOR_RGB2BGR)
        fg_bgr = apply_cinematic_grade(fg_bgr)

        canvas   = bg_gradient.copy()
        alpha_3  = alpha[..., None]
        region   = canvas[off_y:off_y+scaled_h, off_x:off_x+scaled_w].astype(np.float32)
        blended  = fg_bgr.astype(np.float32) * alpha_3 + region * (1 - alpha_3)
        canvas[off_y:off_y+scaled_h, off_x:off_x+scaled_w] = np.clip(blended, 0, 255).astype(np.uint8)

        canvas = apply_outline(canvas, alpha, off_y, off_x, scaled_h, scaled_w, bg_gradient)
        canvas = apply_bottom_fade(canvas, FADE_START_Y)
        writer.write(canvas)

    cap.release()
    writer.release()

    print("==> Combinando audio original...")
    subprocess.run([
        "ffmpeg", "-y",
        "-i", str(temp_video),
        "-i", str(input_path),
        "-c:v", "libx264", "-preset", "slow", "-crf", "18", "-pix_fmt", "yuv420p",
        "-c:a", "aac", "-b:a", "192k",
        "-map", "0:v:0", "-map", "1:a:0?",
        "-shortest",
        str(output_path),
    ], check=True)
    temp_video.unlink(missing_ok=True)

    elapsed = int(time.time() - t0)
    size_mb = output_path.stat().st_size / (1024*1024)
    print(f"\nOK -> {output_path}")
    print(f"⏱  Render: {elapsed}s  |  Tamaño: {size_mb:.1f} MB")

if __name__ == "__main__":
    process_video()
