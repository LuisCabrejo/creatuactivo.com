'use client';

import React, { useRef, useState, useEffect } from 'react';

// ── EL ACOPLAMIENTO v3.0 — "Anillos → Elevador Cyan" Dan Koe Style ────────────
// B-Roll · 1080×1920 · 10s · 60fps
//
// Acto 1 (0–3s):   Mismos 44 anillos concéntricos que "Laberinto Infinito" v3.0.
//                  Héroe orbita el anillo #36. Continuidad visual directa.
// Transición (3–3.8s): Anillos se desvanecen (colapsan hacia el centro). Línea
//                  cyan aparece simultáneamente. Héroe se alinea a CX suavemente.
// Acto 2 (3.8–10s): Héroe asciende en control total por la infraestructura cyan.
//                  Sale del frame por arriba.

export default function ElAcoplamiento() {
  const canvasRef         = useRef<HTMLCanvasElement>(null);
  const [isPlaying,       setIsPlaying]    = useState(false);
  const [isRecording,     setIsRecording]  = useState(false);
  const [progress,        setProgress]     = useState(0);
  const [status,          setStatus]       = useState('Listo para reproducir');

  const animationFrameRef = useRef<number | null>(null);
  const startTimeRef      = useRef<number | null>(null);
  const mediaRecorderRef  = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  const FPS      = 60;
  const DURATION = 10;
  const W = 1080, H = 1920, CX = 540, CY = 960;

  const T_CHAOS      = 4.65;  // fin del caos — instante exacto en que el héroe pasa por el punto más bajo del anillo #36 (angle = π/2 + 2π, t = 4.65s)
  const ALIGN_DUR    = 0.5;   // alineación corta — en el punto inferior el héroe ya está cerca de CX (±68px)

  // ── Sistema de anillos (idéntico a Laberinto Infinito v3.0) ──────────────────
  const N_RINGS    = 44;
  const TILT       = 0;        // 90° exacto — eje mayor vertical perfecto
  const MAX_RX     = 490;
  const MAX_RY     = 860;
  const HERO_RING  = 36;
  const HERO_SPEED = 1.7;    // rad/s
  const HERO_R     = 27;

  // ── Elevador cyan ─────────────────────────────────────────────────────────────
  const CYAN       = '0, 229, 255';
  const BAR_STEP   = 80;
  const BAR_SPEED  = 450;
  const RISE_SPEED = 520;

  const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
  const lerp  = (a: number, b: number, t: number)   => a + (b - a) * t;
  const easeInOutCubic = (x: number) =>
    x < 0.5 ? 4*x*x*x : 1 - Math.pow(-2*x+2, 3)/2;

  // ── Parámetros de cada anillo ─────────────────────────────────────────────────
  const getRingParams = (i: number) => {
    const t     = Math.pow(i / (N_RINGS - 1), 1.35);
    const rx    = 10 + t * MAX_RX;
    const ry    = 10 + t * MAX_RY;
    const cy    = CY;
    const alpha = 0.06 + t * 0.13;
    const lineW = (i % 5 === 0) ? 1.5 : 0.85;
    return { rx, ry, cy, alpha, lineW };
  };

  // ── Posición del héroe en su anillo de órbita ─────────────────────────────────
  const getHeroPos = (time: number) => {
    const { rx, ry, cy } = getRingParams(HERO_RING);
    const angle = time * HERO_SPEED;
    const cosT  = Math.cos(TILT);
    const sinT  = Math.sin(TILT);
    const lx    = Math.cos(angle) * rx;
    const ly    = Math.sin(angle) * ry;
    return {
      x: CX + cosT * lx - sinT * ly,
      y: cy  + sinT * lx + cosT * ly,
    };
  };

  // ── drawHero ─────────────────────────────────────────────────────────────────
  const drawHero = (
    ctx: CanvasRenderingContext2D,
    x: number, y: number,
    radius: number, opacity: number, shake: number
  ) => {
    if (radius < 1 || opacity < 0.01) return;
    const hx = x + (shake > 0 ? (Math.random() - 0.5) * shake : 0);
    const hy = y + (shake > 0 ? (Math.random() - 0.5) * shake : 0);

    ctx.save();
    ctx.globalAlpha = opacity * 0.35;
    const atmos = ctx.createRadialGradient(hx, hy, radius * 0.8, hx, hy, radius * 3.5);
    atmos.addColorStop(0,   'rgba(255,255,255,0.5)');
    atmos.addColorStop(0.4, 'rgba(255,255,255,0.15)');
    atmos.addColorStop(1,   'rgba(255,255,255,0)');
    ctx.fillStyle = atmos;
    ctx.beginPath(); ctx.arc(hx, hy, radius * 3.5, 0, Math.PI * 2); ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.globalAlpha = opacity * 0.5;
    const edge = ctx.createRadialGradient(hx, hy, radius * 0.7, hx, hy, radius * 1.6);
    edge.addColorStop(0,   'rgba(255,255,255,0.6)');
    edge.addColorStop(0.5, 'rgba(255,255,255,0.2)');
    edge.addColorStop(1,   'rgba(255,255,255,0)');
    ctx.fillStyle = edge;
    ctx.beginPath(); ctx.arc(hx, hy, radius * 1.6, 0, Math.PI * 2); ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.fillStyle   = '#ffffff';
    ctx.beginPath(); ctx.arc(hx, hy, radius, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  };

  // ── Film grain ────────────────────────────────────────────────────────────────
  const drawGrain = (ctx: CanvasRenderingContext2D, fc: number, intensity: number) => {
    if (intensity < 0.005) return;
    const imgd = ctx.getImageData(0, 0, W, H);
    const d    = imgd.data;
    const seed = Math.floor(fc / 2) * 7919;
    for (let i = 0; i < d.length; i += 4) {
      const rn    = ((seed ^ (i * 2654435761)) >>> 0) % 256;
      const noise = (rn / 255 - 0.5) * intensity * 55;
      d[i]   = clamp(d[i]   + noise, 0, 255);
      d[i+1] = clamp(d[i+1] + noise, 0, 255);
      d[i+2] = clamp(d[i+2] + noise, 0, 255);
    }
    ctx.putImageData(imgd, 0, 0);
  };

  // ── Dibuja los anillos (con control de opacidad y escala para la transición) ──
  const drawRings = (
    ctx: CanvasRenderingContext2D,
    fadeIn: number,
    scale: number = 1,       // 1 = normal · <1 = colapso hacia el centro
    extraFade: number = 1    // multiplicador extra de opacidad (para fade-out)
  ) => {
    for (let i = 0; i < N_RINGS; i++) {
      const { rx, ry, cy, alpha, lineW } = getRingParams(i);
      const isHeroOrbit = i === HERO_RING;
      const finalAlpha  = fadeIn * extraFade * (alpha + (isHeroOrbit ? 0.10 : 0));
      if (finalAlpha < 0.005) continue;
      ctx.save();
      ctx.globalAlpha = finalAlpha;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth   = isHeroOrbit ? 1.8 : lineW;
      ctx.beginPath();
      ctx.ellipse(CX, cy, rx * scale, ry * scale, TILT, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
  };

  // ── Main loop ─────────────────────────────────────────────────────────────────
  const update = () => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx    = canvas.getContext('2d', { alpha: false }); if (!ctx) return;
    const now    = performance.now();
    if (!startTimeRef.current) startTimeRef.current = now;
    const time   = Math.min((now - startTimeRef.current) / 1000, DURATION);
    const fc     = Math.floor(time * FPS);
    setProgress((time / DURATION) * 100);

    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, W, H);

    const fadeIn = Math.min(1, time / 0.8);

    // ════════════════════════════════════════════════════════════════════════════
    // ACTO 1 (0–3s): Anillos concéntricos — idéntico a Laberinto Infinito v3.0
    // ════════════════════════════════════════════════════════════════════════════
    if (time <= T_CHAOS) {
      drawRings(ctx, fadeIn);

      // Trail del héroe en órbita
      const TRAIL_STEPS = 14;
      const TRAIL_DT    = 0.006;
      for (let s = TRAIL_STEPS; s > 0; s--) {
        const tp   = getHeroPos(time - s * TRAIL_DT);
        const frac = 1 - s / TRAIL_STEPS;
        ctx.save();
        ctx.globalAlpha = fadeIn * frac * 0.28;
        ctx.fillStyle   = '#ffffff';
        ctx.beginPath();
        ctx.arc(tp.x, tp.y, HERO_R * (0.3 + frac * 0.5), 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      const { x: heroX, y: heroY } = getHeroPos(time);
      drawHero(ctx, heroX, heroY, HERO_R, fadeIn, 4);
      setStatus('Laberinto activo — sin vector de salida');
    }

    // ════════════════════════════════════════════════════════════════════════════
    // TRANSICIÓN + ACTO 2 (3–10s)
    // ════════════════════════════════════════════════════════════════════════════
    else {
      const t2 = time - T_CHAOS;   // 0 → 7s

      // Posición exacta del héroe en el momento del acoplamiento (t = 3s)
      const { x: chaosEndX, y: chaosEndY } = getHeroPos(T_CHAOS);

      // ── Anillos: se desvanecen + colapsan hacia el centro durante ALIGN_DUR ──
      const ringFade  = clamp(1 - t2 / ALIGN_DUR, 0, 1);
      const ringScale = lerp(1, 0.55, easeInOutCubic(clamp(t2 / ALIGN_DUR, 0, 1)));
      if (ringFade > 0.005) {
        drawRings(ctx, 1.0, ringScale, ringFade);
      }

      // ── Línea vertical cyan (aparece conforme los anillos desaparecen) ────────
      const elevAlpha = clamp(t2 / 0.5, 0, 1);
      ctx.save();
      ctx.globalAlpha = elevAlpha * 0.65;
      ctx.strokeStyle = `rgba(${CYAN},1)`;
      ctx.lineWidth   = 2.5;
      ctx.beginPath(); ctx.moveTo(CX, H + 20); ctx.lineTo(CX, -20);
      ctx.stroke();
      ctx.restore();

      // ── Barras horizontales fluyendo hacia arriba ─────────────────────────────
      const barOffset = (t2 * BAR_SPEED) % BAR_STEP;
      ctx.save();
      ctx.globalAlpha = elevAlpha * 0.26;
      ctx.strokeStyle = `rgba(${CYAN},1)`;
      ctx.lineWidth   = 1.5;
      for (let barY = H + BAR_STEP; barY > -BAR_STEP; barY -= BAR_STEP) {
        const by = barY - barOffset;
        ctx.beginPath();
        ctx.moveTo(CX - 55, by);
        ctx.lineTo(CX + 55, by);
        ctx.stroke();
      }
      ctx.restore();

      // ── Héroe: alineación suave a CX (easeInOutCubic) + ascenso posterior ────
      const alignProgress = clamp(t2 / ALIGN_DUR, 0, 1);
      const alignEase     = easeInOutCubic(alignProgress);

      const heroX      = lerp(chaosEndX, CX, alignEase);
      const heroY_base = lerp(chaosEndY, chaosEndY, alignEase);  // Y fija durante alineación
      const riseAmount = Math.max(0, t2 - ALIGN_DUR) * RISE_SPEED;
      const heroY      = heroY_base - riseAmount;

      // Trail ascenso (solo después de la alineación)
      if (t2 > ALIGN_DUR && heroY > -HERO_R * 4) {
        for (let s = 8; s > 0; s--) {
          const trailY = heroY + s * (RISE_SPEED / FPS) * 2.5;
          const frac   = 1 - s / 8;
          ctx.save();
          ctx.globalAlpha = frac * 0.28;
          ctx.fillStyle   = '#ffffff';
          ctx.beginPath();
          ctx.arc(CX, trailY, HERO_R * (0.3 + frac * 0.5), 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }

      // Héroe (visible mientras esté en el canvas)
      if (heroY > -HERO_R * 5) {
        drawHero(ctx, heroX, heroY, HERO_R, 1.0, 0);
      }

      if (alignProgress < 0.5) {
        setStatus('Acoplamiento — saliendo del laberinto');
      } else if (alignProgress < 1) {
        setStatus('Acoplamiento — integrando a la infraestructura');
      } else if (heroY > 0) {
        setStatus(`Ascenso en control · ${Math.round(riseAmount)}px`);
      } else {
        setStatus('Liberación total — infraestructura activa');
      }
    }

    drawGrain(ctx, fc, 0.038);

    if (time < DURATION) {
      animationFrameRef.current = requestAnimationFrame(update);
    } else {
      setIsPlaying(false);
      setStatus('Completado · 10 segundos');
    }
  };

  // ── Controles ─────────────────────────────────────────────────────────────────
  const stopAnimation = () => {
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    animationFrameRef.current = null; startTimeRef.current = null;
    setIsPlaying(false); setProgress(0); setStatus('Detenido');
  };
  const startAnimation = () => {
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    startTimeRef.current = null;
    setIsPlaying(true); setProgress(0);
  };
  const play    = () => startAnimation();
  const pause   = () => stopAnimation();
  const restart = () => { stopAnimation(); setTimeout(() => play(), 80); };

  const startRecording = () => {
    const canvas = canvasRef.current;
    if (!canvas || isRecording) return;
    restart(); setIsRecording(true); recordedChunksRef.current = [];
    const stream = canvas.captureStream(FPS);
    let mr: MediaRecorder;
    try { mr = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp9', videoBitsPerSecond: 14_000_000 }); }
    catch { mr = new MediaRecorder(stream); }
    mediaRecorderRef.current = mr;
    mr.ondataavailable = (e) => { if (e.data.size > 0) recordedChunksRef.current.push(e.data); };
    mr.onstop = () => {
      const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href = url; a.download = 'acoplamiento-v3-10s-60fps.webm';
      document.body.appendChild(a); a.click();
      document.body.removeChild(a); URL.revokeObjectURL(url);
      setIsRecording(false); setStatus('Descargado ✓');
    };
    mr.start();
    setTimeout(() => {
      if (mediaRecorderRef.current?.state === 'recording') mediaRecorderRef.current.stop();
    }, DURATION * 1000 + 500);
  };

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx    = canvas.getContext('2d', { alpha: false }); if (!ctx) return;
    ctx.fillStyle = '#000000'; ctx.fillRect(0, 0, W, H);
    drawRings(ctx, 0.20);
    // Línea cyan preview
    ctx.save();
    ctx.globalAlpha = 0.18;
    ctx.strokeStyle = `rgba(${CYAN},1)`;
    ctx.lineWidth   = 2;
    ctx.beginPath(); ctx.moveTo(CX, H * 0.3); ctx.lineTo(CX, -20);
    ctx.stroke();
    ctx.restore();
    ctx.shadowBlur = 40; ctx.shadowColor = `rgba(${CYAN},0.5)`;
    ctx.font = 'bold 40px Montserrat, sans-serif';
    ctx.fillStyle = '#ffffff'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('El Acoplamiento', W/2, H/2 - 80);
    ctx.shadowBlur = 0;
    ctx.font = '20px Montserrat, sans-serif';
    ctx.fillStyle = `rgba(${CYAN},0.65)`;
    ctx.fillText('Anillos → Elevador Cyan · 10s', W/2, H/2 + 30);
    ctx.font = '17px Montserrat, sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.22)';
    ctx.fillText('Presiona Reproducir para comenzar', W/2, H/2 + 105);
    return () => { if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current); };
  }, []);

  useEffect(() => { if (isPlaying) animationFrameRef.current = requestAnimationFrame(update); }, [isPlaying]);

  return (
    <div className="animation-app">
      <div className="container">
        <canvas ref={canvasRef} width={W} height={H} className="canvas" />
        <div className="progress-bar"><div className="progress-fill" style={{ width: `${progress}%` }} /></div>
        <div className="controls">
          <button onClick={isPlaying ? pause : play} disabled={isRecording}>{isPlaying ? '⏸ Pausar' : '▶ Reproducir'}</button>
          <button onClick={restart} disabled={isRecording}>↻ Reiniciar</button>
          <button onClick={startRecording} disabled={isRecording} className={isRecording ? 'recording' : ''}>
            {isRecording ? '⬤ Grabando... (10s)' : '⬤ Grabar (10s)'}
          </button>
        </div>
        <div className="info" suppressHydrationWarning>
          <div className="status" suppressHydrationWarning>{status}</div>
          <div>Canvas 1080×1920 · 60 FPS · {N_RINGS} anillos → cyan · {RISE_SPEED}px/s</div>
        </div>
        <div className="acts">
          {(['0–4.65s|Caos|44 anillos · héroe baja al fondo', '4.65–5.15s|Acoplamiento|Anillos colapsan · héroe se integra', '5.15–10s|Ascenso|Control total por la infraestructura'] as const).map(s => {
            const [t, title, sub] = s.split('|');
            return (
              <div key={t} className="act-card">
                <div className="act-time">{t}</div>
                <div className="act-title">{title}</div>
                <div className="act-sub">{sub}</div>
              </div>
            );
          })}
        </div>
      </div>
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700;900&display=swap');
        * { margin:0; padding:0; box-sizing:border-box; }
        .animation-app { background:linear-gradient(135deg,#0a0a0f 0%,#1a1a1f 100%); display:flex; flex-direction:column; align-items:center; justify-content:center; min-height:100vh; font-family:'Montserrat',sans-serif; color:#fff; padding:20px; }
        .container { display:flex; flex-direction:column; align-items:center; gap:20px; max-width:100%; }
        .canvas { background:#000; box-shadow:0 0 40px rgba(0,229,255,0.12), 0 0 80px rgba(0,229,255,0.05); border-radius:8px; max-height:80vh; max-width:100%; aspect-ratio:9/16; }
        .progress-bar { width:100%; max-width:400px; height:3px; background:rgba(255,255,255,0.1); border-radius:2px; overflow:hidden; }
        .progress-fill { height:100%; background:linear-gradient(90deg,#00E5FF,#00B4C8); transition:width 0.1s linear; }
        .controls { display:flex; gap:12px; flex-wrap:wrap; justify-content:center; }
        button { padding:14px 28px; font-size:15px; font-weight:700; font-family:'Montserrat',sans-serif; cursor:pointer; background:linear-gradient(135deg,#ffffff 0%,#f0f0f0 100%); color:#000; border:none; border-radius:6px; text-transform:uppercase; letter-spacing:0.5px; transition:all 0.3s; box-shadow:0 4px 12px rgba(0,0,0,0.3); }
        button:hover:not(:disabled) { background:linear-gradient(135deg,#00E5FF 0%,#00B4C8 100%); transform:translateY(-2px); box-shadow:0 6px 20px rgba(0,229,255,0.4); }
        button:disabled { opacity:0.4; cursor:not-allowed; }
        button.recording { background:linear-gradient(135deg,#e53e3e 0%,#c53030 100%) !important; color:#fff !important; animation:pulse-record 1s ease-in-out infinite; }
        @keyframes pulse-record { 0%,100% { box-shadow:0 4px 12px rgba(229,62,62,0.4); } 50% { box-shadow:0 4px 28px rgba(229,62,62,0.8); } }
        .info { text-align:center; font-size:13px; color:rgba(255,255,255,0.45); line-height:1.6; }
        .status { color:rgba(0,229,255,0.85); font-weight:700; margin-bottom:4px; font-size:14px; }
        .acts { display:flex; gap:10px; flex-wrap:wrap; justify-content:center; max-width:600px; }
        .act-card { background:rgba(0,229,255,0.04); border:1px solid rgba(0,229,255,0.12); border-radius:8px; padding:12px 16px; text-align:center; min-width:130px; flex:1; }
        .act-time { font-size:11px; color:rgba(0,229,255,0.7); font-weight:700; margin-bottom:4px; }
        .act-title { font-size:13px; color:#fff; font-weight:700; margin-bottom:3px; }
        .act-sub { font-size:11px; color:rgba(255,255,255,0.4); }
      `}</style>
    </div>
  );
}
