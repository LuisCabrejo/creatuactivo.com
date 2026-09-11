#!/usr/bin/env python
"""Ensambla el corte CURADO de un reel hablado: varias tomas, audio de micrófono
aparte, y el descarte de lo que no se usa.

    captions/.venv/bin/python armar-curado.py <corte.json> [--salida <archivo.mov>]

Resuelve lo que `pildora.py` no hace y que a mano se equivoca: sincronizar el
micrófono con la imagen, dejar los tres clips al MISMO nivel, quedarse solo con las
tomas buenas y cortar en frontera de cuadro. La salida se le pasa después a
`pildora.py --lut --guion … --sin-recorte --sin-compuerta`, que pone color,
subtítulos, atmósfera, música y outro.

EL ARCHIVO DE CORTE (JSON)
--------------------------
{
  "clips": {
    "uno":  {"video": "dia4-1.MP4", "audio": "DJI_28.WAV", "desfase":  -0.214},
    "unoB": {"video": "dia4-1.MP4", "audio": "DJI_28.WAV", "desfase":  +0.956}
  },
  "segmentos": [
    {"clip": "uno", "de": 0.80, "a": 6.65, "nota": "hoy no le escribí a nadie…"}
  ]
}

`color` es opcional y va POR CLIP: la cadena de filtros de video, con la palabra
`LUT` donde deba entrar el de la Osmo. Existe porque **dos clips del mismo día
pueden tener exposiciones incompatibles** y entonces el color no puede ser global:
el 11 sep uno se grabó en la calle con la cara en luma 202 y 24 % de píxeles
quemados, y el otro bajo techo con la cara en 99. Un corte entre ellos sin igualar
es un fogonazo. Si un clip lleva `color`, **`pildora.py` se corre SIN `--lut`**.
⚠️ La exposición se corrige ANTES del LUT y con gamma, no con un desplazamiento
después: un desplazamiento lineal lava los negros (lección del día 2). Y lo que se
iguala es la **luma de la cara**, no la media del cuadro ni la saturación: el fondo
de dos sitios distintos nunca va a coincidir, y el ojo va a la cara.

`desfase` es lo que mide la correlación: **el instante en que la voz aparece en la
CÁMARA menos el instante en que aparece en el MICRÓFONO**. Negativo = el micrófono
va adelante y se le recorta la cabeza; positivo = va atrasado y se le antepone
silencio. Los tiempos de cada segmento son **tiempo de video**.

⚠️ Un mismo clip puede aparecer con dos desfases (arriba, "uno" y "unoB"). No es
rebuscado: el 10 sep 2026 el micrófono DJI dio un SALTO de 1.17 s a mitad del
clip 1 —−214 ms antes de la pausa, +956 ms después—, así que la única forma de que
los labios cuadren en todo el clip es tratarlo como dos.

LO QUE HACE, Y POR QUÉ EN ESE ORDEN
-----------------------------------
1. Limpia cada micrófono (highpass 80 Hz + arnndn, modelo `lq`). Con ruido de centro
   comercial RNNoise baja la sala 26 dB y casi no toca la voz; `afftdn` solo bajaba 4.
2. Normaliza **el archivo entero, en dos pasadas**, ANTES de desplazarlo. Este orden
   no es cosmético: normalizar después del desplazamiento deja cada tramo en un
   nivel distinto porque loudnorm de una pasada es adaptativo. Medido el 10 sep: el
   segundo tramo del clip 1 quedó **16 dB por debajo** del resto y esa frase «casi
   no se escuchaba».
3. Corta en frontera de cuadro. `trim` corta el video al cuadro y el audio al
   instante exacto; con varios segmentos ese error se SUMA y los labios se salen.
4. Verifica y avisa: nivel de cada frase, cola de cada corte, y video contra audio.

⚠️ LO QUE ESTE SCRIPT NO PUEDE ARREGLAR: que al micrófono le FALTE audio. El 11 sep 2026
se midió que el DJI perdió **1.19 s en mitad de una frase** — dura 2.58 s en la cámara y
1.39 s en el micrófono—, y eso no es un desfase: es contenido que no existe. Se detecta
comparando la duración de la misma isla en las dos fuentes. La salida es usar el audio de
cámara para esa frase, o quitarla del corte.

Al terminar imprime el informe. **Si marca algo, se corrige antes de publicar.**
"""
import json, os, subprocess, sys, math, wave, array

BASE = os.path.dirname(os.path.abspath(__file__))
# ⚠️ El modelo IMPORTA, y no se escoge por cuál deja la pausa más callada. Medido el 11 sep
# 2026 sobre el día 4: `sh` dejaba la primera palabra («Hoy», ataque suave al abrir la frase)
# 19 dB por debajo de lo que la deja `lq`, y la pausa solo 3 dB más limpia. Margen voz/ruido:
# lq 32.7 dB contra sh 16.4. Escoger por el silencio es optimizar lo que nadie escucha.
RNN  = os.path.join(BASE, "rnnoise/lq.rnnn")
FPS  = 24000/1001          # nativo de la Osmo Pocket 3
COLA_MINIMA  = 0.25        # s de silencio que debe quedar tras la última palabra
MARGEN_NIVEL = 6.0         # dB de diferencia entre frases que ya es audible


def sh(*a):
    return subprocess.run(a, check=True, capture_output=True, text=True)

def probe(f, campo, flujo="v:0"):
    return sh("ffprobe","-v","error","-select_streams",flujo,"-show_entries",
              f"stream={campo}","-of","csv=p=0",f).stdout.strip().split("\n")[0]

def cuadro(t):
    return round(round(t*FPS)/FPS, 6)

def medir_loudness(f):
    r = subprocess.run(["ffmpeg","-i",f,"-af","loudnorm=I=-16:TP=-1.5:LRA=11:print_format=json",
                        "-f","null","-"], capture_output=True, text=True)
    t = r.stderr[r.stderr.rfind("{"):r.stderr.rfind("}")+1]
    return json.loads(t)

def envolvente(f, sr=16000, paso=0.01):
    """dB por ventana de `paso` segundos."""
    import numpy as np
    tmp = f + ".env16.wav"
    sh("ffmpeg","-y","-v","error","-i",f,"-vn","-ac","1","-ar",str(sr),tmp)
    w = wave.open(tmp,"rb"); a = array.array("h"); a.frombytes(w.readframes(w.getnframes())); w.close()
    os.remove(tmp)
    x = np.array(a, dtype=np.float32)/32768
    h = int(sr*paso); n = len(x)//h
    return 20*np.log10(np.sqrt((x[:n*h].reshape(n,h)**2).mean(1))+1e-9), paso


def leer16(f, af=""):
    import numpy as np
    tmp = f + ".r16.wav"
    sh("ffmpeg","-y","-v","error","-i",f,"-vn","-ac","1","-ar","16000",
       *(["-af",af] if af else []), tmp)
    w = wave.open(tmp,"rb"); a = array.array("h"); a.frombytes(w.readframes(w.getnframes())); w.close()
    os.remove(tmp)
    return np.array(a, dtype=np.float32)/32768


def revisar_fuente(video, pista_limpia, nombre):
    """¿El micrófono se mantiene en sincronía con la cámara a lo largo de TODO el clip,
    y grabó todo lo que la cámara oyó? Las dos fallas que un oído pilla y una medición
    global no: un SALTO a mitad de clip, y audio PERDIDO dentro de una frase."""
    import numpy as np
    sr = 16000
    cam = leer16(video); mic = leer16(pista_limpia)
    def desfase(a0, a1, rango=1.8):
        m = mic[int(a0*sr):int(a1*sr)]
        lo = max(0,int((a0-rango)*sr)); hi = min(len(cam),int((a1+rango)*sr)); cw = cam[lo:hi]
        if len(m) < sr//4 or len(cw) <= len(m): return None, 0
        m = m-m.mean(); cw = cw-cw.mean(); n = len(m)+len(cw)
        xc = np.fft.irfft(np.fft.rfft(cw,n)*np.conj(np.fft.rfft(m,n)),n)[:len(cw)-len(m)+1]
        k = int(np.argmax(np.abs(xc)))
        return (lo+k)/sr-a0, abs(xc[k])/(np.linalg.norm(m)*np.linalg.norm(cw[k:k+len(m)])+1e-9)
    medidas = []
    t = 0.5
    while t < len(mic)/sr - 1.5:
        o, c = desfase(t, t+1.0)
        if o is not None and c > 0.55: medidas.append((t, o))
        t += 0.5
    avisos = []
    if len(medidas) >= 3:
        vals = np.array([o for _, o in medidas])
        if vals.max()-vals.min() > 0.08:
            saltos = [(medidas[i][0], (medidas[i+1][1]-medidas[i][1])*1000)
                      for i in range(len(medidas)-1) if abs(medidas[i+1][1]-medidas[i][1]) > 0.08]
            for cuando, cuanto in saltos[:3]:
                avisos.append(f"  ⚠️ {nombre}: el micrófono SALTA {cuanto:+.0f} ms hacia el segundo {cuando:.1f} "
                              f"— ese clip necesita dos desfases, o le falta audio ahí")
    def voz_total(x):
        h = 160; n = len(x)//h
        e = 20*np.log10(np.sqrt((x[:n*h].reshape(n,h)**2).mean(1))+1e-9)
        return float((e > np.percentile(e,15)+12).sum()*h/sr)
    vc, vm = voz_total(cam), voz_total(mic)
    if vc - vm > 0.6:
        avisos.append(f"  ⚠️ {nombre}: la cámara oyó {vc:.1f}s de voz y el micrófono solo {vm:.1f}s "
                      f"— al micrófono le FALTAN {vc-vm:.1f}s, y eso no lo arregla ningún desfase")
    return avisos


def main():
    if len(sys.argv) < 2: sys.exit(__doc__)
    corte = json.load(open(os.path.abspath(sys.argv[1]), encoding="utf-8"))
    raiz  = os.path.dirname(os.path.abspath(sys.argv[1]))
    salida = os.path.abspath(sys.argv[sys.argv.index("--salida")+1]) if "--salida" in sys.argv \
             else os.path.join(raiz, "curado.mov")
    trabajo = os.path.join(raiz, "_curado"); os.makedirs(trabajo, exist_ok=True)
    if not os.path.exists(RNN): sys.exit(f"falta el modelo de ruido en {RNN}")

    # 1-2 · un audio limpio y normalizado por ARCHIVO de micrófono (no por tramo)
    pistas = {}
    for nombre, c in corte["clips"].items():
        wav = os.path.join(raiz, c["audio"])
        if wav not in pistas:
            base = os.path.join(trabajo, "limpio-" + os.path.splitext(os.path.basename(wav))[0] + ".wav")
            if not os.path.exists(base):
                sh("ffmpeg","-y","-v","error","-i",wav,"-af",
                   f"highpass=f=80,arnndn=m={RNN}","-ac","1","-ar","48000", base+".tmp.wav")
                m = medir_loudness(base+".tmp.wav")
                sh("ffmpeg","-y","-v","error","-i",base+".tmp.wav","-af",
                   f"loudnorm=I=-16:TP=-1.5:LRA=11:measured_I={m['input_i']}:"
                   f"measured_TP={m['input_tp']}:measured_LRA={m['input_lra']}:"
                   f"measured_thresh={m['input_thresh']}:linear=true",
                   "-ac","1","-ar","48000", base)
                os.remove(base+".tmp.wav")
                print(f"  limpio y nivelado: {os.path.basename(wav)}  ({m['input_i']} → −16 LUFS)")
            pistas[wav] = base
        # 3 · desfase de sincronía, sobre el archivo YA nivelado
        d = float(c["desfase"]); pista = os.path.join(trabajo, f"sync-{nombre}.wav")
        filtro = f"adelay={int(round(d*1000))}|{int(round(d*1000))}" if d > 0 else \
                 (f"atrim={-d:.3f},asetpts=N/SR/TB" if d < 0 else "anull")
        sh("ffmpeg","-y","-v","error","-i",pistas[wav],"-af",filtro,"-ac","1","-ar","48000",pista)
        c["_pista"] = pista
        c["_video"] = os.path.join(raiz, c["video"])

    # 4 · ensamble, con los cortes en frontera de cuadro
    entradas, idx, fg, t = [], {}, [], 0.0
    for nombre, c in corte["clips"].items():
        for ruta in (c["_video"], c["_pista"]):
            if ruta not in idx:
                idx[ruta] = len(entradas); entradas.append(ruta)
    linea = []
    for n, s in enumerate(corte["segmentos"]):
        c = corte["clips"][s["clip"]]
        a, b = cuadro(s["de"]), cuadro(s["a"])
        color = c.get("color", "")
        if color:
            color = color.replace("LUT", f"lut3d={os.path.join(BASE,'luts/dji-osmo-pocket3-dlogm-to-709.cube')}")
            color += ","
        fg.append(f"[{idx[c['_video']]}:v:0]trim={a:.6f}:{b:.6f},setpts=PTS-STARTPTS,{color}"
                  f"scale=1080:1920:flags=lanczos,setsar=1[v{n}];")
        fg.append(f"[{idx[c['_pista']]}:a:0]atrim={a:.6f}:{b:.6f},asetpts=PTS-STARTPTS[a{n}];")
        linea.append((t, t+b-a, s.get("nota",""))); t += b-a
    fg.append("".join(f"[v{n}][a{n}]" for n in range(len(corte["segmentos"])))
              + f"concat=n={len(corte['segmentos'])}:v=1:a=1[vout][aout]")
    guion_fg = os.path.join(trabajo,"fg.txt"); open(guion_fg,"w").write("\n".join(fg))
    cmd = ["ffmpeg","-y","-v","error"]
    for e in entradas: cmd += ["-i", e]
    cmd += ["-filter_complex_script",guion_fg,"-map","[vout]","-map","[aout]",
            "-c:v","libx264","-preset","medium","-crf","18","-pix_fmt","yuv420p",
            "-r","24000/1001","-c:a","pcm_s16le","-ar","48000", salida]
    sh(*cmd)
    print(f"\n▸ {salida}  ·  {t:.2f}s  ·  {len(corte['segmentos'])} segmentos")

    # 5 · verificación — lo que a mano se pasa por alto
    import numpy as np
    e, paso = envolvente(salida)
    piso = np.percentile(e, 15); umbral = piso + 12
    voz = e > umbral; islas = []; i = 0
    while i < len(voz):
        if voz[i]:
            j = i
            while j < len(voz) and (voz[j] or voz[j:j+int(0.25/paso)].any()): j += 1
            if (j-i)*paso >= 0.25: islas.append((i*paso, j*paso))
            i = j
        else: i += 1
    niveles = [(a, b, 20*math.log10(math.sqrt(np.mean(
                 np.power(10, e[int(a/paso):int(b/paso)]/10)))+1e-9)) for a, b in islas]
    print(f"\nVERIFICACIÓN  ({len(islas)} frases detectadas)")
    avisos = []
    if niveles:
        mediana = float(np.median([d for _,_,d in niveles]))
        for a, b, d in niveles:
            if mediana - d > MARGEN_NIVEL:
                avisos.append(f"  ⚠️ la frase de {a:.2f}s suena {mediana-d:.0f} dB por debajo del resto")
    for ini, fin, nota in linea:
        dentro = [b for a, b in islas if ini-0.05 <= a < fin]
        if dentro and fin - max(dentro) < COLA_MINIMA:
            avisos.append(f"  ⚠️ el corte de {fin:.2f}s deja solo {fin-max(dentro):.2f}s "
                          f"tras la última palabra — se oirá truncada  ({nota[:44]})")
        if not dentro:
            avisos.append(f"  ⚠️ el segmento {ini:.2f}-{fin:.2f}s no tiene voz  ({nota[:44]})")
    vistos = set()
    for nombre, c in corte["clips"].items():
        clave = (c["_video"], c["audio"])
        if clave in vistos: continue
        vistos.add(clave)
        avisos += revisar_fuente(c["_video"], pistas[os.path.join(raiz,c["audio"])], c["video"])
    dv = float(probe(salida,"duration")); da = float(probe(salida,"duration",flujo="a:0"))
    if abs(dv-da) > 0.05:
        avisos.append(f"  ⚠️ el video dura {dv:.3f}s y el audio {da:.3f}s — los labios se saldrán")
    print("\n".join(avisos) if avisos else "  ✅ niveles parejos, colas suficientes y video y audio del mismo largo")
    return 1 if avisos else 0


if __name__ == "__main__":
    sys.exit(main())
