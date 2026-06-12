'use client';

import React, { useRef, useState, useEffect } from 'react';

// ── DEPRECIACIÓN BIOLÓGICA v5.0 — "Orquesta Sinfónica" ───────────────────────
// B-Roll · 1080×1920 · 12s · 60fps
//
// Tres capas que llenan el frame completo:
//  1. 44 ANILLOS CONCÉNTRICOS centrados en la línea de tiempo — mismo idioma visual
//     que el resto de la trilogía. Se "pelan" de afuera hacia adentro al ritmo del
//     decay biológico. Al crash, los últimos anillos colapsan en 0.4s.
//  2. ÁREA DORADA bajo la línea de ingreso — relleno con gradiente (#C8A84B → negro)
//     que convierte la línea en una montaña visual. Drena verticalmente al crash.
//  3. FUERZA VITAL — halo gigante alrededor del héroe (r×8 al inicio) que se
//     contrae y apaga con el decay. Es el aura de vida que el sistema consume.

export default function DepreciacionBiologica() {
  const canvasRef         = useRef<HTMLCanvasElement>(null);
  const [isPlaying,       setIsPlaying]    = useState(false);
  const [isRecording,     setIsRecording]  = useState(false);
  const [progress,        setProgress]     = useState(0);
  const [status,          setStatus]       = useState('Listo para reproducir');

  const animationFrameRef = useRef<number | null>(null);
  const startTimeRef      = useRef<number | null>(null);
  const mediaRecorderRef  = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const fragmentsRef      = useRef<{
    x: number; y: number; vx: number; vy: number;
    r: number; life: number; decay: number;
  }[]>([]);

  const FPS      = 60;
  const DURATION = 7;
  const W = 1080, H = 1920;

  const X_START    = W * 0.08;
  const X_END      = W * 0.92;
  const Y_TIMELINE = H * 0.70;    // 1344px
  const INCOME_MAX = H * 0.38;    // 729px de subida
  const CRASH_AT   = 0.80;
  const GOLD       = '#C8A84B';
  const HERO_R     = 35;

  // ── Sistema de anillos (misma lógica que trilogía) ────────────────────────────
  const N_RINGS = 44;
  const TILT    = 0;        // 90° exacto — eje mayor vertical perfecto
  const MAX_RX  = 460;
  const MAX_RY  = 800;            // sube hasta y≈544 (por encima del gráfico de ingreso)

  const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
  const lerp  = (a: number, b: number, t: number)   => a + (b - a) * t;

  const getRingParams = (i: number) => {
    const t    = Math.pow(i / (N_RINGS - 1), 1.35);
    return {
      rx:     10 + t * MAX_RX,
      ry:     10 + t * MAX_RY,
      alpha:  0.10 + t * 0.18,          // más visible que laberinto — están sobre el fondo puro
      lineW:  (i % 5 === 0) ? 1.5 : 0.85,
    };
  };

  // ── CAPA 1: Anillos de vitalidad — peel externo→interno con el decay ──────────
  const drawVitalityRings = (
    ctx: CanvasRenderingContext2D,
    fadeIn: number,
    decay: number,
    crashCollapse: number   // 0 = normal, 1 = todos colapsan al crash
  ) => {
    for (let i = 0; i < N_RINGS; i++) {
      const { rx, ry, alpha, lineW } = getRingParams(i);

      // Anillo externo (i alto) desaparece primero con el decay
      const startDecay = 0.02 + (1 - i / (N_RINGS - 1)) * 0.85;
      const FADE_W     = 0.10;
      const peelFactor = clamp(1 - (decay - startDecay) / FADE_W, 0, 1);

      // Al crash: colapso rápido de todos los anillos restantes
      const collapseFactor = clamp(1 - crashCollapse * 2.5, 0, 1);
      const scale = lerp(1, 0.08, crashCollapse * crashCollapse);

      const finalAlpha = alpha * peelFactor * collapseFactor * fadeIn;
      if (finalAlpha < 0.004) continue;

      ctx.save();
      ctx.globalAlpha = finalAlpha;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth   = lineW;
      ctx.beginPath();
      ctx.ellipse(CX_RING, Y_TIMELINE, rx * scale, ry * scale, TILT, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
  };

  const CX_RING = W / 2;   // 540 — centro horizontal de los anillos

  // ── CAPA 2: Área dorada (relleno bajo la línea de ingreso) ───────────────────
  const drawIncomeArea = (
    ctx: CanvasRenderingContext2D,
    fadeIn: number,
    p: number, heroP: number, crashed: boolean, crashProgress: number
  ) => {
    const STEPS = 200;

    // Gradiente: cúspide dorada hacia negro en la línea de tiempo
    const grad = ctx.createLinearGradient(0, Y_TIMELINE - INCOME_MAX, 0, Y_TIMELINE);
    grad.addColorStop(0,   'rgba(200,168,75,0.45)');
    grad.addColorStop(0.5, 'rgba(200,168,75,0.20)');
    grad.addColorStop(1,   'rgba(200,168,75,0.00)');

    ctx.save();
    ctx.globalAlpha = fadeIn;
    ctx.fillStyle   = grad;
    ctx.beginPath();
    ctx.moveTo(X_START, Y_TIMELINE);

    if (!crashed) {
      for (let i = 1; i <= STEPS; i++) {
        const ip = (i / STEPS) * heroP;
        if (ip > p) break;
        ctx.lineTo(
          X_START + (X_END - X_START) * (ip / CRASH_AT),
          Y_TIMELINE - INCOME_MAX * (ip / CRASH_AT)
        );
      }
      ctx.lineTo(X_START + (X_END - X_START) * (heroP / CRASH_AT), Y_TIMELINE);
    } else {
      for (let i = 1; i <= STEPS; i++) {
        const ip = (i / STEPS) * CRASH_AT;
        ctx.lineTo(
          X_START + (X_END - X_START) * (ip / CRASH_AT),
          Y_TIMELINE - INCOME_MAX * (ip / CRASH_AT)
        );
      }
      const peakX  = X_END;
      const crashY = lerp(Y_TIMELINE - INCOME_MAX, Y_TIMELINE, crashProgress * crashProgress);
      ctx.lineTo(peakX, crashY);
      ctx.lineTo(peakX, Y_TIMELINE);
    }

    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // Línea superior del área (el gráfico de ingreso propiamente)
    ctx.save();
    ctx.strokeStyle = GOLD;
    ctx.lineWidth   = 2.8;
    ctx.lineCap     = 'round';
    ctx.lineJoin    = 'round';
    ctx.globalAlpha = fadeIn * 0.90;
    ctx.beginPath();
    ctx.moveTo(X_START, Y_TIMELINE);

    if (!crashed) {
      for (let i = 1; i <= STEPS; i++) {
        const ip = (i / STEPS) * heroP;
        if (ip > p) break;
        ctx.lineTo(
          X_START + (X_END - X_START) * (ip / CRASH_AT),
          Y_TIMELINE - INCOME_MAX * (ip / CRASH_AT)
        );
      }
    } else {
      for (let i = 1; i <= STEPS; i++) {
        const ip = (i / STEPS) * CRASH_AT;
        ctx.lineTo(
          X_START + (X_END - X_START) * (ip / CRASH_AT),
          Y_TIMELINE - INCOME_MAX * (ip / CRASH_AT)
        );
      }
      ctx.lineTo(X_END, lerp(Y_TIMELINE - INCOME_MAX, Y_TIMELINE, crashProgress * crashProgress));
    }
    ctx.stroke();
    ctx.restore();
  };

  // ── CAPA 3: Fuerza vital — halo gigante que se contrae con el decay ───────────
  const drawLifeForce = (
    ctx: CanvasRenderingContext2D,
    hx: number, hy: number,
    decay: number, fadeIn: number
  ) => {
    const vitality = 1 - decay;
    if (vitality < 0.02) return;

    // Halo exterior — muy grande al inicio, se contrae con la vida que queda
    const outerR = HERO_R * (3 + vitality * 5);   // r×8 al inicio, r×3 al final
    ctx.save();
    ctx.globalAlpha = vitality * vitality * 0.28 * fadeIn;
    const outer = ctx.createRadialGradient(hx, hy, HERO_R, hx, hy, outerR);
    outer.addColorStop(0,   'rgba(255,255,255,0.55)');
    outer.addColorStop(0.35,'rgba(255,255,255,0.12)');
    outer.addColorStop(1,   'rgba(255,255,255,0)');
    ctx.fillStyle = outer;
    ctx.beginPath();
    ctx.arc(hx, hy, outerR, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Halo medio — siempre presente, se debilita
    const midR = HERO_R * (1.2 + vitality * 2.5);
    ctx.save();
    ctx.globalAlpha = vitality * 0.42 * fadeIn;
    const mid = ctx.createRadialGradient(hx, hy, HERO_R * 0.6, hx, hy, midR);
    mid.addColorStop(0,   'rgba(255,255,255,0.7)');
    mid.addColorStop(0.5, 'rgba(255,255,255,0.2)');
    mid.addColorStop(1,   'rgba(255,255,255,0)');
    ctx.fillStyle = mid;
    ctx.beginPath();
    ctx.arc(hx, hy, midR, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
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

    const fadeIn        = Math.min(1, time / 0.8);
    const p             = time / DURATION;
    const heroP         = Math.min(p, CRASH_AT);
    const heroX         = X_START + (X_END - X_START) * (p / CRASH_AT > 1 ? 1 : p / CRASH_AT);
    const crashed       = p > CRASH_AT;
    const crashProgress = crashed ? clamp((p - CRASH_AT) / (1 - CRASH_AT), 0, 1) : 0;
    const decay         = clamp(heroP / CRASH_AT, 0, 1);

    // ── ORDEN DE DIBUJO: rings → área dorada → timeline → life force → héroe → fragments ──

    // 1. Anillos de vitalidad (fondo — detrás de todo lo demás)
    drawVitalityRings(ctx, fadeIn, decay, crashed ? crashProgress : 0);

    // 2. Área dorada + línea de ingreso
    drawIncomeArea(ctx, fadeIn, p, heroP, crashed, crashProgress);

    // Punto luminoso en la punta del gráfico
    if (!crashed || crashProgress < 1.0) {
      const tipX = crashed ? X_END : X_START + (X_END - X_START) * (heroP / CRASH_AT);
      const tipY = crashed
        ? lerp(Y_TIMELINE - INCOME_MAX, Y_TIMELINE, crashProgress * crashProgress)
        : Y_TIMELINE - INCOME_MAX * (heroP / CRASH_AT);
      ctx.save();
      ctx.globalAlpha = fadeIn * (crashed ? 1 - crashProgress : 1) * 0.9;
      const tipGlow = ctx.createRadialGradient(tipX, tipY, 0, tipX, tipY, 22);
      tipGlow.addColorStop(0, 'rgba(200,168,75,0.9)');
      tipGlow.addColorStop(1, 'rgba(200,168,75,0)');
      ctx.fillStyle = tipGlow;
      ctx.beginPath(); ctx.arc(tipX, tipY, 22, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = GOLD;
      ctx.beginPath(); ctx.arc(tipX, tipY, 5, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    }

    // 3. Línea de tiempo horizontal
    ctx.save();
    ctx.globalAlpha = fadeIn * 0.45;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth   = 1.8;
    ctx.beginPath(); ctx.moveTo(X_START - 10, Y_TIMELINE); ctx.lineTo(X_END + 10, Y_TIMELINE); ctx.stroke();
    ctx.restore();

    // Tick marks
    ctx.save();
    ctx.globalAlpha = fadeIn * 0.20;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth   = 1;
    for (let i = 0; i <= 8; i++) {
      const tx = X_START + (X_END - X_START) * (i / 8);
      ctx.beginPath(); ctx.moveTo(tx, Y_TIMELINE - 10); ctx.lineTo(tx, Y_TIMELINE + 10); ctx.stroke();
    }
    ctx.restore();

    // 4. Fuerza vital + héroe
    if (!crashed) {
      const heroOpacity = lerp(1.0, 0.12, decay) * fadeIn;
      const heroShake   = decay * decay * 8;

      // Fuerza vital (halo grande que se contrae)
      drawLifeForce(ctx, heroX, Y_TIMELINE, decay, fadeIn);

      // Fragmentos biológicos (comienzan al 30%)
      if (decay > 0.30 && fc % 3 === 0) {
        const fragCount = Math.floor((decay - 0.30) / 0.70 * 5) + 1;
        for (let f = 0; f < fragCount; f++) {
          const angle = Math.random() * Math.PI * 2;
          const spd   = 0.6 + Math.random() * 2.0;
          fragmentsRef.current.push({
            x: heroX, y: Y_TIMELINE,
            vx: Math.cos(angle) * spd, vy: Math.sin(angle) * spd,
            r:  1.5 + Math.random() * 3.5,
            life: 1.0, decay: 0.012 + Math.random() * 0.018,
          });
        }
      }

      // Trail horizontal
      const trailSteps = 6;
      const stepPx     = (X_END - X_START) / (DURATION / CRASH_AT * FPS);
      for (let s = trailSteps; s > 0; s--) {
        const tx   = heroX - s * stepPx * 3;
        const frac = 1 - s / trailSteps;
        if (tx < X_START) continue;
        ctx.save();
        ctx.globalAlpha = heroOpacity * frac * 0.25;
        ctx.fillStyle   = '#ffffff';
        ctx.beginPath(); ctx.arc(tx, Y_TIMELINE, HERO_R * (0.3 + frac * 0.5), 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      }

      drawHero(ctx, heroX, Y_TIMELINE, HERO_R, heroOpacity, heroShake);

    } else {
      // Post-crash: explosión de fragmentos
      if (crashProgress < 0.3 && fc % 2 === 0) {
        for (let f = 0; f < 6; f++) {
          const angle = Math.random() * Math.PI * 2;
          const spd   = 2 + Math.random() * 5;
          fragmentsRef.current.push({
            x: X_END, y: Y_TIMELINE,
            vx: Math.cos(angle) * spd, vy: Math.sin(angle) * spd,
            r:  2 + Math.random() * 4,
            life: 1.0, decay: 0.018 + Math.random() * 0.025,
          });
        }
      }
    }

    // 5. Fragmentos activos
    fragmentsRef.current = fragmentsRef.current.filter(f => f.life > 0);
    for (const f of fragmentsRef.current) {
      f.x += f.vx; f.y += f.vy; f.vy += 0.06; f.life -= f.decay;
      ctx.save();
      ctx.globalAlpha = f.life * fadeIn * 0.70;
      ctx.fillStyle   = '#ffffff';
      ctx.beginPath(); ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    }

    // Flash de colapso
    if (crashed && crashProgress < 0.15) {
      ctx.save();
      ctx.globalAlpha = (0.15 - crashProgress) / 0.15 * 0.14;
      ctx.fillStyle   = '#ffffff';
      ctx.fillRect(0, 0, W, H);
      ctx.restore();
    }

    drawGrain(ctx, fc, 0.042);

    const pct = Math.round(decay * 100);
    if (!crashed) {
      setStatus(`Depreciación biológica ${pct}% · ${N_RINGS} anillos activos`);
    } else {
      setStatus(`Colapso total · anillos colapsados · ${Math.round(crashProgress * 100)}%`);
    }

    if (time < DURATION) {
      animationFrameRef.current = requestAnimationFrame(update);
    } else {
      setIsPlaying(false);
      setStatus('Completado · 7 segundos');
    }
  };

  // ── Controles ─────────────────────────────────────────────────────────────────
  const stopAnimation = () => {
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    animationFrameRef.current = null; startTimeRef.current = null;
    fragmentsRef.current = [];
    setIsPlaying(false); setProgress(0); setStatus('Detenido');
  };
  const startAnimation = () => {
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    fragmentsRef.current = []; startTimeRef.current = null;
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
      a.href = url; a.download = 'depreciacion-biologica-v5-12s-60fps.webm';
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
    // Preview estático: anillos + área dorada + héroe
    drawVitalityRings(ctx, 0.65, 0, 0);
    const grad = ctx.createLinearGradient(0, Y_TIMELINE - INCOME_MAX, 0, Y_TIMELINE);
    grad.addColorStop(0, 'rgba(200,168,75,0.25)'); grad.addColorStop(1, 'rgba(200,168,75,0)');
    ctx.save(); ctx.globalAlpha = 0.5; ctx.fillStyle = grad;
    ctx.beginPath(); ctx.moveTo(X_START, Y_TIMELINE); ctx.lineTo(X_END, Y_TIMELINE - INCOME_MAX); ctx.lineTo(X_END, Y_TIMELINE); ctx.closePath(); ctx.fill(); ctx.restore();
    ctx.save(); ctx.globalAlpha = 0.18; ctx.strokeStyle = GOLD; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(X_START, Y_TIMELINE); ctx.lineTo(X_END, Y_TIMELINE - INCOME_MAX); ctx.stroke(); ctx.restore();
    ctx.save(); ctx.globalAlpha = 0.45; ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.arc(X_START, Y_TIMELINE, 35, 0, Math.PI * 2); ctx.fill(); ctx.restore();
    ctx.shadowBlur = 40; ctx.shadowColor = 'rgba(255,255,255,0.4)';
    ctx.font = 'bold 36px Montserrat, sans-serif'; ctx.fillStyle = '#ffffff'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('Depreciación Biológica', W/2, H/2 - 70); ctx.shadowBlur = 0;
    ctx.font = '19px Montserrat, sans-serif'; ctx.fillStyle = 'rgba(200,168,75,0.65)';
    ctx.fillText(`${N_RINGS} anillos · área dorada · fuerza vital · 7s`, W/2, H/2 + 35);
    ctx.font = '17px Montserrat, sans-serif'; ctx.fillStyle = 'rgba(255,255,255,0.22)';
    ctx.fillText('Presiona Reproducir para comenzar', W/2, H/2 + 110);
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
            {isRecording ? '⬤ Grabando... (7s)' : '⬤ Grabar (7s)'}
          </button>
        </div>
        <div className="info" suppressHydrationWarning>
          <div className="status" suppressHydrationWarning>{status}</div>
          <div>Canvas 1080×1920 · 60 FPS · {N_RINGS} anillos · área dorada · fuerza vital</div>
        </div>
        <div className="acts">
          {(['0–5.6s|Depreciación|Anillos se pelan · aura se contrae · ingreso sube', '5.6–7s|Colapso|Anillos imploden · área dorada drena → cero'] as const).map(s => {
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
        .canvas { background:#000; box-shadow:0 0 40px rgba(255,255,255,0.08); border-radius:8px; max-height:80vh; max-width:100%; aspect-ratio:9/16; }
        .progress-bar { width:100%; max-width:400px; height:3px; background:rgba(255,255,255,0.1); border-radius:2px; overflow:hidden; }
        .progress-fill { height:100%; background:linear-gradient(90deg,#C8A84B,#D4AF37); transition:width 0.1s linear; }
        .controls { display:flex; gap:12px; flex-wrap:wrap; justify-content:center; }
        button { padding:14px 28px; font-size:15px; font-weight:700; font-family:'Montserrat',sans-serif; cursor:pointer; background:linear-gradient(135deg,#ffffff 0%,#f0f0f0 100%); color:#000; border:none; border-radius:6px; text-transform:uppercase; letter-spacing:0.5px; transition:all 0.3s; box-shadow:0 4px 12px rgba(0,0,0,0.3); }
        button:hover:not(:disabled) { background:linear-gradient(135deg,#C8A84B 0%,#D4AF37 100%); transform:translateY(-2px); box-shadow:0 6px 20px rgba(200,168,75,0.4); }
        button:disabled { opacity:0.4; cursor:not-allowed; }
        button.recording { background:linear-gradient(135deg,#e53e3e 0%,#c53030 100%) !important; color:#fff !important; animation:pulse-record 1s ease-in-out infinite; }
        @keyframes pulse-record { 0%,100% { box-shadow:0 4px 12px rgba(229,62,62,0.4); } 50% { box-shadow:0 4px 28px rgba(229,62,62,0.8); } }
        .info { text-align:center; font-size:13px; color:rgba(255,255,255,0.45); line-height:1.6; }
        .status { color:rgba(200,168,75,0.85); font-weight:700; margin-bottom:4px; font-size:14px; }
        .acts { display:flex; gap:10px; flex-wrap:wrap; justify-content:center; max-width:600px; }
        .act-card { background:rgba(200,168,75,0.04); border:1px solid rgba(200,168,75,0.12); border-radius:8px; padding:12px 16px; text-align:center; min-width:160px; flex:1; }
        .act-time { font-size:11px; color:rgba(200,168,75,0.7); font-weight:700; margin-bottom:4px; }
        .act-title { font-size:13px; color:#fff; font-weight:700; margin-bottom:3px; }
        .act-sub { font-size:11px; color:rgba(255,255,255,0.4); }
      `}</style>
    </div>
  );
}
