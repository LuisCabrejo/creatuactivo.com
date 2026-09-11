#!/usr/bin/env python
"""Receta LIGERA para píldoras diarias — de un archivo crudo a un reel publicable.

    captions/.venv/bin/python pildora.py <entrada.mp4> [--lut] [--sin-musica] [--outro]
                                         [--guion <texto.txt>]
                                         [--sin-recorte] [--sin-compuerta]

Hace sola lo que en el video Top se decide a mano: recorta silencios, arma el
montaje, alinea subtítulos, pone marca de agua y atmósfera, y normaliza a -14 LUFS.
NO hace: curaduría de tomas ni arco musical con pivot. Para eso está el pipeline
completo (ver PIPELINE.md).

--guion <texto.txt> entrega el texto REAL de lo que se dijo y se salta a whisper:
la alineación forzada solo resuelve tiempos, así que el subtítulo sale con las
palabras del guion aprobado y no con lo que el modelo creyó oír. Con ruido de calle
whisper confunde palabras enteras —«armando» por «arruinando», y se come frases—, y
ese error se quema en pantalla. El texto debe ser lo que se OYE en el archivo de
entrada, no el guion completo: si una toma se descartó al cortar, su texto no va.

--sin-recorte deja las pausas como vienen. Para material YA curado a mano, donde el
ritmo se decidió al cortar y volver a apretarlo se come el aire que se puso a
propósito.

--sin-compuerta no atenúa las pausas. La compuerta usa los tiempos de la alineación
y el alineador cierra la palabra antes de que el sonido se apague, así que la cola
se pierde: se comió 240 ms del «.com» de CreaTuActivo.com. Con audio ya limpio
(micrófono de solapa pasado por arnndn) no hay roces que matar — úsela siempre.
"""
import json, os, subprocess, sys, shutil, tempfile, math

BASE = os.path.dirname(os.path.abspath(__file__))
PY   = os.path.join(BASE, "captions/.venv/bin/python")
LUT  = os.path.join(BASE, "luts/dji-osmo-pocket3-dlogm-to-709.cube")
WM   = os.path.join(BASE, "captions/work/_assets/watermark.png")
MUS  = os.path.expanduser("~/Downloads/reels-equipo/audios/pulse-corporate-technolofy.MP3")
OUTRO= os.path.join(BASE, "motion/out/outro.mp4")

GAP_CORTA, PRE, GAP = 0.75, 0.10, 0.28   # pausa que se recorta · pre-roll · pausa que queda

def sh(*a, **k):
    return subprocess.run(a, check=True, capture_output=True, text=True, **k)

def probe(f, campo):
    return sh("ffprobe","-v","error","-select_streams","v:0","-show_entries",
              f"stream={campo}","-of","csv=p=0",f).stdout.strip().split("\n")[0]

def main():
    src = os.path.abspath(sys.argv[1])
    usar_lut  = "--lut" in sys.argv
    con_musica= "--sin-musica" not in sys.argv
    con_outro = "--outro" in sys.argv
    sin_recorte = "--sin-recorte" in sys.argv
    sin_compuerta = "--sin-compuerta" in sys.argv
    guion_ext = None
    if "--guion" in sys.argv:
        i = sys.argv.index("--guion")
        if i+1 >= len(sys.argv): sys.exit("--guion necesita la ruta de un .txt")
        guion_ext = os.path.abspath(sys.argv[i+1])
        if not os.path.exists(guion_ext): sys.exit(f"no existe {guion_ext}")
    nombre = os.path.splitext(os.path.basename(src))[0]
    W = os.path.join(BASE, "captions/work", f"pildora-{nombre}")
    shutil.rmtree(W, ignore_errors=True); os.makedirs(W)
    print(f"▸ {nombre}")

    # 1 · audio y texto
    wav = f"{W}/a16k.wav"
    sh("ffmpeg","-y","-v","error","-i",src,"-vn","-ac","1","-ar","16000",wav)
    if guion_ext:
        texto = " ".join(open(guion_ext,encoding="utf-8").read().split())
        if not texto: sys.exit("el guion está vacío")
        print(f"  guion dado: {len(texto.split())} palabras (no se transcribe)")
    else:
        from faster_whisper import WhisperModel
        m = WhisperModel("medium", device="cpu", compute_type="int8")
        segs,_ = m.transcribe(wav, language="es", word_timestamps=True, vad_filter=False)
        words = [{"word":w.word,"start":w.start,"end":w.end} for s in segs for w in s.words]
        if not words: sys.exit("sin habla detectable")
        texto = " ".join(w["word"].strip() for w in words)
        print(f"  {len(words)} palabras")

    # 2 · guion exacto -> alineación forzada (los tiempos de whisper no son fiables)
    open(f"{W}/guion.txt","w").write(texto)
    sh(PY, os.path.join(BASE,"captions/align.py"), wav, f"{W}/guion.txt", f"{W}/stamps.json","spa")
    AW = json.load(open(f"{W}/stamps.json"))["words"]
    if AW[-1]["end"]-AW[-1]["start"] > 1.0: AW[-1]["end"] = AW[-1]["start"]+0.6

    # 3 · islas y EDL (se recortan las pausas largas)
    isl, cur = [], [AW[0]]
    for w in AW[1:]:
        if w["start"] - cur[-1]["end"] > GAP_CORTA:
            isl.append(cur); cur = [w]
        else:
            cur.append(w)
    isl.append(cur)
    # el corte se CUANTIZA a frontera de cuadro del origen: trim corta el video al cuadro
    # y el audio al instante exacto, así que un corte a media exposición desfasa hasta 1/fps,
    # y con varias islas ese error se SUMA. Medido el 10 sep 2026: 6 islas dejaron el video
    # 222 ms por delante del audio, y en pantalla eso son los labios fuera de sincronía.
    crudo = float(probe(src,"duration") or 0)
    try:    n_, d_ = probe(src,"r_frame_rate").split("/"); fps_src = float(n_)/float(d_)
    except Exception: fps_src = 24.0
    cuad = lambda t: round(t*fps_src)/fps_src
    if sin_recorte:
        isl = [[w for g in isl for w in g]]
        segs_edl = [(0.0, cuad(crudo))]
        t = segs_edl[0][1]
    else:
        segs_edl, t = [], 0.0
        for g in isl:
            a, b = cuad(max(0,g[0]["start"]-PRE)), cuad(g[-1]["end"]+GAP)
            segs_edl.append((a,b)); t += b-a
    dur = round(t,2)
    print(f"  {len(segs_edl)} isla(s) · {dur}s (crudo {crudo or 'n/d'})"
          + ("  [sin recorte de pausas]" if sin_recorte else ""))

    # 4 · encuadre 9:16 y ensamble
    w0,h0 = int(probe(src,"width")), int(probe(src,"height"))
    if w0/h0 > 9/16:   # apaisado -> recorte central
        enc = "crop=ih*9/16:ih,scale=1080:1920:flags=lanczos"
    else:
        enc = "scale=1080:1920:flags=lanczos:force_original_aspect_ratio=increase,crop=1080:1920"
    pre = f"lut3d={LUT},eq=brightness=0.085:contrast=1.02:saturation=1.05," if usar_lut else ""
    fg=[]
    for n,(a,b) in enumerate(segs_edl):
        fg.append(f"[0:v]trim={a:.3f}:{b:.3f},setpts=PTS-STARTPTS,{pre}{enc},fps=24,setsar=1[v{n}];")
        fg.append(f"[0:a]atrim={a:.3f}:{b:.3f},asetpts=PTS-STARTPTS[a{n}];")
    ins="".join(f"[v{n}][a{n}]" for n in range(len(segs_edl)))
    fg.append(f"{ins}concat=n={len(segs_edl)}:v=1:a=1[vout][aout]")
    open(f"{W}/fg.txt","w").write("\n".join(fg))
    sh("ffmpeg","-y","-v","error","-i",src,"-filter_complex_script",f"{W}/fg.txt",
       "-map","[vout]","-map","[aout]","-c:v","libx264","-preset","medium","-crf","18",
       "-pix_fmt","yuv420p","-r","24","-c:a","aac","-b:a","192k","-ar","48000",f"{W}/cuerpo.mp4")

    # 5 · subtítulos sobre la línea de tiempo montada
    # los nombres propios que Whisper siempre parte o deforma
    FUSION = [(("Crea","tu","Activo"),"CreaTuActivo"), (("crea","tu","activo"),"CreaTuActivo"),
              (("Gano","Excel"),"Gano Excel")]
    SUELTO = {"aquesua":"Queswa","queso":"Queswa","queso,":"Queswa,","quesua":"Queswa",
              "quesgua":"Queswa","queswa":"Queswa"}
    def arreglar(g):
        r, i = [], 0
        while i < len(g):
            hecho = False
            for toks, disp in FUSION:
                cand = tuple(x["text"].strip(".,;:").capitalize() if k else x["text"].strip(".,;:")
                             for k,x in enumerate(g[i:i+len(toks)]))
                if len(g[i:i+len(toks)])==len(toks) and \
                   [x["text"].strip(".,;:").lower() for x in g[i:i+len(toks)]]==[t.lower() for t in toks]:
                    cola = g[i+len(toks)-1]["text"][len(g[i+len(toks)-1]["text"].rstrip(".,;:!?")):]
                    r.append({"text":disp+cola,"start":g[i]["start"],"end":g[i+len(toks)-1]["end"]})
                    i += len(toks); hecho = True; break
            if hecho: continue
            t = g[i]["text"]
            nucleo = t.rstrip(".,;:!?¿¡"); cola = t[len(nucleo):]
            t = SUELTO.get(nucleo.lower(), nucleo) + cola
            r.append({"text":t,"start":g[i]["start"],"end":g[i]["end"]})
            i += 1
        return r
    out, tt = [], 0.0
    for (a,b),g in zip(segs_edl,isl):
        for w in arreglar(g):
            out.append({"text":w["text"],"start":round(tt+w["start"]-a,3),
                        "end":round(tt+w["end"]-a,3),"score":1.0})
        tt += b-a
    json.dump({"words":out}, open(f"{W}/stamps_edl.json","w"), ensure_ascii=False)
    os.makedirs(f"{W}/frames")
    sh(PY, os.path.join(BASE,"captions/render_captions.py"), f"{W}/stamps_edl.json", f"{W}/frames",
       "--fps","24","--dur",str(dur),"--mode","karaoke","--maxwords","3","--y","0.76")

    # 6 · atmósfera + subtítulos + marca
    sh("ffmpeg","-y","-v","error","-i",f"{W}/cuerpo.mp4","-framerate","24","-i",f"{W}/frames/f%05d.png",
       "-i",WM,"-filter_complex",
       "[0:v]format=gbrp,split[b][h];[h]curves=all='0/0 0.70/0 1/1',gblur=sigma=18[g];"
       "[b][g]blend=all_mode=screen:all_opacity=0.16,vignette=angle=PI/6:x0=w/2:y0=h*0.42,"
       "noise=alls=6:allf=t+u,format=yuv420p[atm];[atm][1:v]overlay=0:0:shortest=1[s];"
       "[2:v]scale=330:-1,colorchannelmixer=aa=0.22[wm];[s][wm]overlay=W-w-38:H-h-46[v]",
       "-map","[v]","-map","0:a","-c:v","libx264","-preset","medium","-crf","18",
       "-pix_fmt","yuv420p","-r","24","-c:a","copy",f"{W}/vid.mp4")

    # 7 · voz limpia (pausas atenuadas: mata roces de silla y teclado) + cama suave
    # ⚠️ La compuerta se guía por los tiempos de la ALINEACIÓN, y el alineador cierra la palabra
    # antes de que se apague el sonido: la cola queda fuera y se atenúa 24 dB. Medido el 10 sep
    # 2026: se comió 240 ms del «.com» de CreaTuActivo.com y en pantalla sonaba «creatuactivo.c».
    # Con audio ya denoised (micrófono de solapa + arnndn) la compuerta no aporta nada: use
    # --sin-compuerta.
    sh("ffmpeg","-y","-v","error","-i",f"{W}/vid.mp4","-vn","-ac","1","-ar","48000",f"{W}/voz.wav")
    import wave, array
    ww=wave.open(f"{W}/voz.wav","rb"); sr=ww.getframerate(); n=ww.getnframes()
    a=array.array("h"); a.frombytes(ww.readframes(n)); ww.close()
    g=[1.0]*n if sin_compuerta else [0.06]*n
    for x in ([] if sin_compuerta else out):
        for i in range(max(0,int((x["start"]-0.14)*sr)), min(n,int((x["end"]+0.14)*sr))): g[i]=1.0
    k=int(0.030*sr); pre_s=[0.0]*(n+1)
    for i in range(n): pre_s[i+1]=pre_s[i]+g[i]
    o=array.array("h",[0])*n
    for i in range(n):
        lo,hi=max(0,i-k//2),min(n,i+k//2)
        o[i]=max(-32768,min(32767,int(a[i]*((pre_s[hi]-pre_s[lo])/(hi-lo)))))
    wo=wave.open(f"{W}/voz_ok.wav","wb"); wo.setnchannels(1); wo.setsampwidth(2); wo.setframerate(sr)
    wo.writeframes(o.tobytes()); wo.close()

    if con_musica and os.path.exists(MUS):
        sh("ffmpeg","-y","-v","error","-i",MUS,"-af",
           f"loudnorm=I=-26:TP=-3:LRA=11,atrim=0:{dur},asetpts=N/SR/TB,volume=0.85,"
           f"afade=t=in:st=0:d=1.0,afade=t=out:st={max(0,dur-1.6):.2f}:d=1.6",
           "-ar","48000","-ac","2",f"{W}/cama.wav")
        sh("ffmpeg","-y","-v","error","-i",f"{W}/vid.mp4","-i",f"{W}/voz_ok.wav","-i",f"{W}/cama.wav",
           "-filter_complex",
           "[1:a]aformat=fltp:48000:stereo,loudnorm=I=-16:TP=-1.5:LRA=11,asplit[v][sc];"
           "[2:a]aformat=fltp:48000:stereo[c];[c][sc]sidechaincompress=threshold=0.03:ratio=12:"
           "attack=15:release=350:makeup=1[d];[v][d]amix=inputs=2:duration=first:normalize=0,"
           "loudnorm=I=-14:TP=-1.5:LRA=11[a]",
           "-map","0:v","-map","[a]","-c:v","copy","-c:a","aac","-b:a","192k",f"{W}/mix.mp4")
    else:
        sh("ffmpeg","-y","-v","error","-i",f"{W}/vid.mp4","-i",f"{W}/voz_ok.wav","-filter_complex",
           "[1:a]aformat=fltp:48000:stereo,loudnorm=I=-14:TP=-1.5:LRA=11[a]",
           "-map","0:v","-map","[a]","-c:v","copy","-c:a","aac","-b:a","192k",f"{W}/mix.mp4")

    # 8 · salida
    salida = os.path.expanduser(
        "~/Library/CloudStorage/GoogleDrive-sistema@creatuactivo.com/Mi unidad/videos/reto-90/salida")
    os.makedirs(salida, exist_ok=True)
    final = os.path.join(salida, f"{nombre}-listo.mp4")
    if con_outro and os.path.exists(OUTRO):
        sh("ffmpeg","-y","-v","error","-i",f"{W}/mix.mp4","-i",OUTRO,"-filter_complex",
           "[0:v]scale=1080:1920,fps=24,setsar=1,format=yuv420p[v0];"
           "[1:v]scale=1080:1920,fps=24,setsar=1,format=yuv420p[v1];"
           "[0:a]aformat=fltp:48000:stereo[a0];"
           "[1:a]aformat=fltp:48000:stereo,loudnorm=I=-14:TP=-1.5:LRA=11[a1];"
           "[v0][a0][v1][a1]concat=n=2:v=1:a=1[v][a]",
           "-map","[v]","-map","[a]","-c:v","libx264","-preset","slow","-crf","18",
           "-pix_fmt","yuv420p","-r","24","-c:a","aac","-b:a","192k","-movflags","+faststart",final)
    else:
        sh("ffmpeg","-y","-v","error","-i",f"{W}/mix.mp4","-c:v","libx264","-preset","slow","-crf","18",
           "-pix_fmt","yuv420p","-c:a","aac","-b:a","192k","-ar","48000","-movflags","+faststart",final)
    d = float(sh("ffprobe","-v","error","-show_entries","format=duration","-of","csv=p=0",final).stdout)
    print(f"✅ {final}  ·  {d:.1f}s")

if __name__ == "__main__":
    main()
