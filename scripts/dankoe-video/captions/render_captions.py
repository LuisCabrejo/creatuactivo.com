#!/usr/bin/env python
"""stamps.json -> secuencia de PNG transparentes (subtitulos quemables via overlay).

NO usa libass. Renderiza cada frame con Pillow: pagina centrada, palabra activa
en dorado de marca, contorno negro para legibilidad. Compose despues con ffmpeg overlay.

Uso:
    python render_captions.py <stamps.json> <outdir> [--fps 24] [--dur 100.3]
                              [--w 1080] [--h 1920] [--y 0.64]
                              [--maxwords 3] [--mode karaoke|reveal]
"""
import sys, os, json, argparse
from PIL import Image, ImageDraw, ImageFont

FONT_PATH   = os.path.expanduser("~/Library/Fonts/Montserrat-Black.otf")
COLOR_BASE  = (255, 255, 255, 255)      # blanco
COLOR_ACTIVE= (197, 160, 89, 255)       # dorado marca #C5A059
STROKE_COL  = (0, 0, 0, 255)
BASE_FONT   = 86
STROKE_W    = 8
MARGIN_X    = 80
GAP_PX      = 24                          # espacio entre palabras
GAP_NEWPAGE = 0.6
SENT_END    = (".", ":", "?", "!", "…", ";")

def apply_display_map(words, dmap):
    """Reescribe el TEXTO mostrado conservando los tiempos de la alineacion.
    - replace: token (normalizado lower) -> texto a mostrar
    - collapse: secuencia de tokens -> un solo token con su rango combinado
    """
    if not dmap:
        return words
    rep = dmap.get("replace", {})
    collapses = dmap.get("collapse", [])
    norm = lambda s: s.strip().lower()
    ends = lambda s: s.strip().endswith(SENT_END)
    out, i = [], 0
    while i < len(words):
        matched = False
        for c in collapses:
            seq = c["from"]
            if i + len(seq) <= len(words) and all(
                norm(words[i+k]["text"]) == norm(seq[k]) for k in range(len(seq))
            ):
                last = words[i+len(seq)-1]
                out.append({
                    "text": c["to"],
                    "start": words[i]["start"],
                    "end": last["end"],
                    "score": words[i].get("score", 0),
                    "brk": ends(last["text"]),  # conserva fin-de-frase aunque el texto cambie
                })
                i += len(seq); matched = True; break
        if matched:
            continue
        w = dict(words[i])
        w["brk"] = ends(w["text"])
        if norm(w["text"]) in rep:
            w["text"] = rep[norm(w["text"])]
        out.append(w); i += 1
    return out

def make_pages(words, max_words):
    pages, cur = [], []
    for i, w in enumerate(words):
        cur.append(w)
        ends = w.get("brk", w["text"].strip().endswith(SENT_END))
        biggap = (i+1 < len(words)) and (words[i+1]["start"] - w["end"] > GAP_NEWPAGE)
        if len(cur) >= max_words or ends or biggap or i == len(words)-1:
            pages.append(cur); cur = []
    return pages

def fit_font(draw, words, max_w):
    """Reduce el tamaño hasta que la pagina entre en max_w (cap en BASE_FONT)."""
    size = BASE_FONT
    while size > 40:
        font = ImageFont.truetype(FONT_PATH, size)
        total = sum(draw.textlength(w["text"].strip(), font=font) for w in words)
        total += GAP_PX * (len(words)-1)
        if total <= max_w:
            return font, total
        size -= 4
    return ImageFont.truetype(FONT_PATH, size), total

def render_page_image(W, H, y, page, active_idx, mode):
    img = Image.new("RGBA", (W, H), (0,0,0,0))
    d = ImageDraw.Draw(img)
    # palabras visibles segun modo
    if mode == "reveal":
        vis = page[:active_idx+1]
    else:
        vis = page
    font, total = fit_font(d, vis, W - 2*MARGIN_X)
    x = (W - total) / 2
    asc, desc = font.getmetrics()
    cy = y - (asc+desc)/2
    for k, w in enumerate(vis):
        t = w["text"].strip()
        col = COLOR_ACTIVE if k == active_idx else COLOR_BASE
        d.text((x, cy), t, font=font, fill=col,
               stroke_width=STROKE_W, stroke_fill=STROKE_COL)
        x += d.textlength(t, font=font) + GAP_PX
    return img

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("stamps"); ap.add_argument("outdir")
    ap.add_argument("--fps", type=float, default=24)
    ap.add_argument("--dur", type=float, default=None)
    ap.add_argument("--w", type=int, default=1080)
    ap.add_argument("--h", type=int, default=1920)
    ap.add_argument("--y", type=float, default=0.64)
    ap.add_argument("--maxwords", type=int, default=3)
    ap.add_argument("--mode", choices=["karaoke","reveal"], default="karaoke")
    ap.add_argument("--display-map", help="JSON con replace/collapse de texto mostrado")
    a = ap.parse_args()

    words = json.load(open(a.stamps, encoding="utf-8"))["words"]
    if a.display_map:
        words = apply_display_map(words, json.load(open(a.display_map, encoding="utf-8")))
    pages = make_pages(words, a.maxwords)
    dur = a.dur or (words[-1]["end"] + 0.5)
    n_frames = int(round(dur * a.fps))
    y = int(a.y * a.h)
    os.makedirs(a.outdir, exist_ok=True)

    # estados: por cada frame, que pagina+palabra activa
    # precomputamos para cada pagina su rango y los limites de palabra
    blank = Image.new("RGBA", (a.w, a.h), (0,0,0,0))
    cache = {}   # key (page_idx, active_idx) -> PNG bytes path
    import io
    blank_bytes = io.BytesIO(); blank.save(blank_bytes, "PNG"); blank_bytes = blank_bytes.getvalue()

    def page_at(t):
        for pi, pg in enumerate(pages):
            p_start = pg[0]["start"]
            p_end = pg[-1]["end"] + 0.18
            nxt = pages[pi+1][0]["start"] if pi+1 < len(pages) else None
            if nxt is not None: p_end = min(p_end, nxt)
            if p_start <= t < p_end:
                # palabra activa = ultima cuyo start <= t (clamp 0)
                ai = 0
                for k, w in enumerate(pg):
                    if w["start"] <= t: ai = k
                    else: break
                return pi, ai
        return None

    rendered = {}
    for f in range(n_frames):
        t = f / a.fps
        st = page_at(t)
        path = os.path.join(a.outdir, f"f{f:05d}.png")
        if st is None:
            with open(path, "wb") as fh: fh.write(blank_bytes)
            continue
        if st not in rendered:
            im = render_page_image(a.w, a.h, y, pages[st[0]], st[1], a.mode)
            b = io.BytesIO(); im.save(b, "PNG"); rendered[st] = b.getvalue()
        with open(path, "wb") as fh: fh.write(rendered[st])

    print(f"OK {n_frames} frames ({len(rendered)} estados unicos) -> {a.outdir}")

if __name__ == "__main__":
    main()
