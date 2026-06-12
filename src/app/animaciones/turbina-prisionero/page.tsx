'use client';

import React, { useRef, useState, useEffect } from 'react';

// ── PRISIONERO DE LA TURBINA v2.0 ─────────────────────────────────────────────
// B-Roll · 1080×1920 · 15s · 60fps
//
// METÁFORA VISUAL:
//   Las 150 partículas SON las 15 aspas (10 por aspa).
//   Estado 1 (0–3s):   caos Browniano — las partículas no saben que son un sistema
//   Transición (3–5s): lerp hacia sus posiciones dentro del cuerpo del aspa
//   Estado 2 (5–15s):  las partículas rotan JUNTAS formando la turbina — sin drawBlade
//
// Héroe (dia7 style) en el centro: libre → inquieto → aprisionado.

export default function PrisioneroTurbina() {
  const canvasRef      = useRef<HTMLCanvasElement>(null);
  const [isPlaying,    setIsPlaying]    = useState(false);
  const [isRecording,  setIsRecording]  = useState(false);
  const [progress,     setProgress]     = useState(0);
  const [status,       setStatus]       = useState('Listo para reproducir');

  const animationFrameRef = useRef<number | null>(null);
  const startTimeRef      = useRef<number | null>(null);
  const mediaRecorderRef  = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const sceneRef          = useRef<any>(null);

  const FPS      = 60;
  const DURATION = 15;
  const W = 1080, H = 1920, CX = 540, CY = 960;
  const SPOKES   = 15;
  const PER_BLADE = 10;           // partículas por aspa
  const TOTAL_P   = SPOKES * PER_BLADE;  // 150

  const INNER_R = 72;
  const OUTER_R = 285;
  const BASE_W  = 28;
  const TIP_W   = 8;
  const SWEEP   = 0.13;           // barrido aerodinámico

  const T1 = 3.0;
  const T2 = 5.0;

  const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
  const lerp  = (a: number, b: number, t: number)   => a + (b - a) * t;
  const easeInOutCubic = (x: number) =>
    x < 0.5 ? 4*x*x*x : 1 - Math.pow(-2*x+2, 3)/2;
  const easeOutCubic = (x: number) => 1 - Math.pow(1-x, 3);
  const easeInExpo   = (x: number) => x === 0 ? 0 : Math.pow(2, 10*x-10);

  // ── Posición local de la partícula j dentro del aspa (espacio local del aspa)
  // El aspa apunta en -Y, va de innerR (base) a outerR (punta).
  // Retorna {lx, ly} en coordenadas locales del aspa.
  const bladeLocalPos = (j: number): { lx: number; ly: number } => {
    const t = j / (PER_BLADE - 1);         // 0 = base, 1 = punta
    const halfW = lerp(BASE_W / 2, TIP_W / 2, t);
    // Posición a lo largo del aspa + barrido lateral
    const ly = -(INNER_R + t * (OUTER_R - INNER_R));
    const sweepOff = Math.abs(ly) * Math.tan(SWEEP);
    // Distribuir partículas dentro del ancho (izq → der)
    const ratio = j % 2 === 0
      ? lerp(-halfW, halfW, (j / 2) / Math.ceil(PER_BLADE / 2))
      : 0;
    const lx = sweepOff * 0.6 + ratio;
    return { lx, ly };
  };

  // ── Inicializar escena ────────────────────────────────────────────────────────
  const initScene = () => {
    const particles = Array.from({ length: TOTAL_P }, (_, idx) => {
      const bladeIdx   = Math.floor(idx / PER_BLADE);
      const partInBlade = idx % PER_BLADE;
      const { lx, ly } = bladeLocalPos(partInBlade);

      // Ángulo base del aspa en la turbina
      const bladeBaseAngle = (bladeIdx / SPOKES) * Math.PI * 2;

      // Posición mundo target (sin rotar turbina — empieza en angle=0)
      const worldAngle = bladeBaseAngle;
      const tx = CX + (lx * Math.cos(worldAngle) - ly * Math.sin(worldAngle));
      const ty = CY + (lx * Math.sin(worldAngle) + ly * Math.cos(worldAngle));

      // Posición inicial: dispersa aleatoriamente por el canvas
      const randAngle = Math.random() * Math.PI * 2;
      const randDist  = 150 + Math.random() * 700;

      return {
        // Posición actual
        x:  CX + Math.cos(randAngle) * randDist,
        y:  CY + Math.sin(randAngle) * randDist,
        // Velocidad Browniana
        vx: (Math.random() - 0.5) * 4.5,
        vy: (Math.random() - 0.5) * 4.5,
        // Meta (posición en el aspa — se actualiza con el ángulo de turbina)
        tx, ty,
        // Info de aspa
        bladeIdx,
        partInBlade,
        lx, ly,         // coordenadas locales dentro del aspa
        bladeBaseAngle,
        // Visual
        size: 2.2 + Math.random() * 1.8,
      };
    });

    return {
      particles,
      turbineAngle: 0,
    };
  };

  // ── drawHero — idéntica a dia7 ────────────────────────────────────────────────
  const drawHero = (
    ctx:      CanvasRenderingContext2D,
    x:        number,
    y:        number,
    radius:   number,
    opacity:  number,
    stretchX: number,
    stretchY: number,
    shake:    number
  ) => {
    const shakeX = shake > 0 ? (Math.random() - 0.5) * shake : 0;
    const shakeY = shake > 0 ? (Math.random() - 0.5) * shake : 0;
    const hx = x + shakeX, hy = y + shakeY;

    ctx.save();
    ctx.globalAlpha = opacity * 0.35;
    const atmos = ctx.createRadialGradient(hx, hy, radius*0.8, hx, hy, radius*3.5);
    atmos.addColorStop(0,   'rgba(255,255,255,0.5)');
    atmos.addColorStop(0.4, 'rgba(255,255,255,0.15)');
    atmos.addColorStop(1,   'rgba(255,255,255,0)');
    ctx.fillStyle = atmos;
    ctx.beginPath(); ctx.arc(hx, hy, radius*3.5, 0, Math.PI*2); ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.globalAlpha = opacity * 0.5;
    const edge = ctx.createRadialGradient(hx, hy, radius*0.7, hx, hy, radius*1.6);
    edge.addColorStop(0,   'rgba(255,255,255,0.6)');
    edge.addColorStop(0.5, 'rgba(255,255,255,0.2)');
    edge.addColorStop(1,   'rgba(255,255,255,0)');
    ctx.fillStyle = edge;
    ctx.beginPath(); ctx.arc(hx, hy, radius*1.6, 0, Math.PI*2); ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.fillStyle   = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(hx, hy, radius*stretchX, radius*stretchY, 0, 0, Math.PI*2);
    ctx.fill();
    ctx.restore();
  };

  // ── Grain ─────────────────────────────────────────────────────────────────────
  const drawGrain = (ctx: CanvasRenderingContext2D, fc: number, intensity: number) => {
    if (intensity < 0.005) return;
    const imgd = ctx.getImageData(0, 0, W, H);
    const d    = imgd.data;
    const seed = Math.floor(fc / 2) * 7919;
    for (let i = 0; i < d.length; i += 4) {
      const rn    = ((seed ^ (i * 2654435761)) >>> 0) % 256;
      const noise = (rn/255 - 0.5) * intensity * 55;
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
    const scene  = sceneRef.current; if (!scene) return;
    setProgress((time / DURATION) * 100);

    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, W, H);

    // ══════════════════════════════════════════════════════════════════════════
    // ESTADO 1 (0–3s): MOVIMIENTO BROWNIANO
    // ══════════════════════════════════════════════════════════════════════════
    if (time < T1) {
      const fadeIn = easeOutCubic(Math.min(1, time / 0.6));
      const anxiety = time / T1;   // crece hacia el fin del acto

      scene.particles.forEach((p: any) => {
        p.vx += (Math.random() - 0.5) * 2.5;
        p.vy += (Math.random() - 0.5) * 2.5;
        p.vx  = clamp(p.vx * 0.91, -7, 7);
        p.vy  = clamp(p.vy * 0.91, -7, 7);
        if (p.x < 60)     p.vx += 1.5;
        if (p.x > W - 60) p.vx -= 1.5;
        if (p.y < 60)     p.vy += 1.5;
        if (p.y > H - 60) p.vy -= 1.5;
        p.x += p.vx; p.y += p.vy;

        // Color: gris con ligero tinte dorado conforme crece la ansiedad
        const gray  = Math.round(lerp(95, 130, anxiety));
        const alpha = lerp(0.45, 0.75, fadeIn);
        ctx.fillStyle = `rgba(${gray},${gray},${Math.round(gray*0.9)},${alpha})`;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
      });

      // Héroe al centro — pequeña vibración que crece
      const strainPulse = Math.sin(fc * 0.13) * 0.05;
      drawHero(ctx, CX, CY, 46, fadeIn,
        1.0 + strainPulse, 1.0 - strainPulse, lerp(0, 5, anxiety));

      setStatus('Estado 1: Déficit Estructural — caos biológico');
    }

    // ══════════════════════════════════════════════════════════════════════════
    // TRANSICIÓN (3–5s): PARTÍCULAS CONVERGEN → FORMAN LAS ASPAS
    // ══════════════════════════════════════════════════════════════════════════
    else if (time < T2) {
      const t  = (time - T1) / (T2 - T1);
      const tE = easeInOutCubic(t);

      // Turbina empieza a girar lentamente
      scene.turbineAngle += lerp(0.015, 0.45, tE) / FPS;

      // Grid aparece
      ctx.save();
      ctx.globalAlpha = tE * 0.032;
      ctx.strokeStyle = '#00E5FF'; ctx.lineWidth = 0.5;
      for (let x = 0; x < W; x += 60) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke(); }
      for (let y = 0; y < H; y += 60) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }
      ctx.restore();

      scene.particles.forEach((p: any) => {
        // Recalcular target con el ángulo actual de la turbina
        const worldAngle = p.bladeBaseAngle + scene.turbineAngle;
        p.tx = CX + (p.lx * Math.cos(worldAngle) - p.ly * Math.sin(worldAngle));
        p.ty = CY + (p.lx * Math.sin(worldAngle) + p.ly * Math.cos(worldAngle));

        // Lerp: la partícula viaja hacia su posición en el aspa
        p.x = lerp(p.x, p.tx, tE * 0.10);
        p.y = lerp(p.y, p.ty, tE * 0.10);

        // Color: gris → cian conforme se acercan
        const distToTarget = Math.sqrt((p.x-p.tx)**2 + (p.y-p.ty)**2);
        const closeness    = clamp(1 - distToTarget / 400, 0, 1);
        const r = Math.round(lerp(120,   0, closeness));
        const g = Math.round(lerp(120, 200, closeness));
        const b = Math.round(lerp(130, 245, closeness));
        ctx.fillStyle = `rgba(${r},${g},${b},0.85)`;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
      });

      // Conectar partículas del mismo aspa con líneas tenues (silueta emergiendo)
      ctx.save();
      for (let bi = 0; bi < SPOKES; bi++) {
        const bladeParticles = scene.particles.slice(bi * PER_BLADE, (bi + 1) * PER_BLADE);
        // Ordenar por posición a lo largo del aspa (partInBlade)
        for (let j = 0; j < PER_BLADE - 1; j++) {
          const pa = bladeParticles[j], pb = bladeParticles[j + 1];
          const d  = Math.sqrt((pa.x-pb.x)**2 + (pa.y-pb.y)**2);
          if (d < 120) {
            const alpha = tE * 0.35 * (1 - d / 120);
            ctx.strokeStyle = `rgba(0,200,240,${alpha})`;
            ctx.lineWidth   = 0.8;
            ctx.beginPath(); ctx.moveTo(pa.x, pa.y); ctx.lineTo(pb.x, pb.y); ctx.stroke();
          }
        }
      }
      ctx.restore();

      // Héroe: pánico creciente
      const strainPulse = Math.sin(fc * 0.18) * lerp(0.06, 0.22, t);
      drawHero(ctx, CX, CY, lerp(46, 40, tE), 1.0,
        1.0 + strainPulse, 1.0 - strainPulse, lerp(5, 20, easeInExpo(t)));

      setStatus('Transición: el sistema se cierra sobre el héroe...');
    }

    // ══════════════════════════════════════════════════════════════════════════
    // ESTADO 2 (5–15s): TURBINA ACTIVA — PARTÍCULAS SON LAS ASPAS
    // El héroe queda aprisionado en el centro por las 150 partículas
    // ══════════════════════════════════════════════════════════════════════════
    else {
      const t  = (time - T2) / (DURATION - T2);
      const tE = easeOutCubic(Math.min(1, t));

      // Aceleración continua de la turbina
      const rotSpeed = lerp(0.48, 1.15, t);
      scene.turbineAngle += rotSpeed / FPS;

      // Grid
      ctx.save();
      ctx.globalAlpha = 0.032;
      ctx.strokeStyle = '#00E5FF'; ctx.lineWidth = 0.5;
      for (let x = 0; x < W; x += 60) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke(); }
      for (let y = 0; y < H; y += 60) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }
      ctx.restore();

      // Anillos decorativos
      ctx.save();
      ctx.strokeStyle = `rgba(0,229,255,${0.18 + 0.08 * Math.sin(time * 2)})`;
      ctx.lineWidth   = 0.8;
      ctx.beginPath(); ctx.arc(CX, CY, OUTER_R + 40, 0, Math.PI*2); ctx.stroke();
      ctx.strokeStyle = `rgba(198,168,124,0.14)`;
      ctx.lineWidth   = 0.6;
      ctx.beginPath(); ctx.arc(CX, CY, OUTER_R + 75, 0, Math.PI*2); ctx.stroke();
      ctx.restore();

      // ── Dibujar las aspas COMO PARTÍCULAS (esto es la metáfora) ─────────
      ctx.save();
      for (let bi = 0; bi < SPOKES; bi++) {
        const bladeParticles = scene.particles.slice(bi * PER_BLADE, (bi + 1) * PER_BLADE);

        // Mover cada partícula exactamente a su posición en el aspa rotada
        bladeParticles.forEach((p: any) => {
          const worldAngle = p.bladeBaseAngle + scene.turbineAngle;
          p.tx = CX + (p.lx * Math.cos(worldAngle) - p.ly * Math.sin(worldAngle));
          p.ty = CY + (p.lx * Math.sin(worldAngle) + p.ly * Math.cos(worldAngle));
          // En Estado 2 siguen el target con alta fidelidad (casi pegadas)
          p.x  = lerp(p.x, p.tx, 0.22);
          p.y  = lerp(p.y, p.ty, 0.22);

          // Color: cian en la base → blanco cian en la punta (según partInBlade)
          const tipness = p.partInBlade / (PER_BLADE - 1);
          const r = Math.round(lerp(0,   80, tipness));
          const g = Math.round(lerp(180, 229, tipness));
          const b = 255;
          ctx.fillStyle = `rgba(${r},${g},${b},0.90)`;
          // Puntos más grandes en la punta (efecto de masa)
          const dotR = lerp(p.size * 0.9, p.size * 1.6, tipness);
          ctx.beginPath(); ctx.arc(p.x, p.y, dotR, 0, Math.PI * 2); ctx.fill();
        });

        // Conectar partículas adyacentes del aspa con líneas (silueta del aspa)
        for (let j = 0; j < PER_BLADE - 1; j++) {
          const pa = bladeParticles[j], pb = bladeParticles[j + 1];
          // Borde de ataque (j par) → oro; resto → cian
          const isLeadingEdge = j % 2 === 0;
          ctx.strokeStyle = isLeadingEdge
            ? `rgba(198,168,124,0.72)`
            : `rgba(0,200,245,0.45)`;
          ctx.lineWidth   = isLeadingEdge ? 2.2 : 1.0;
          ctx.beginPath(); ctx.moveTo(pa.x, pa.y); ctx.lineTo(pb.x, pb.y); ctx.stroke();
        }
      }
      ctx.restore();

      // ── Red de conexión entre puntas de aspas adyacentes (la "jaula") ────
      ctx.save();
      const tipParticles = [];
      for (let bi = 0; bi < SPOKES; bi++) {
        // La punta de cada aspa = última partícula del aspa
        tipParticles.push(scene.particles[(bi + 1) * PER_BLADE - 1]);
      }
      for (let i = 0; i < SPOKES; i++) {
        const pa = tipParticles[i], pb = tipParticles[(i + 1) % SPOKES];
        const netAlpha = (0.15 + 0.12 * Math.sin(time * 2.2 + i * 0.4)) * tE;
        ctx.strokeStyle = `rgba(0,229,255,${netAlpha})`;
        ctx.lineWidth   = 0.7;
        ctx.beginPath(); ctx.moveTo(pa.x, pa.y); ctx.lineTo(pb.x, pb.y); ctx.stroke();
        // Rayo punta → centro
        ctx.strokeStyle = `rgba(0,229,255,${netAlpha * 0.5})`;
        ctx.lineWidth   = 0.4;
        ctx.beginPath(); ctx.moveTo(CX, CY); ctx.lineTo(pa.x, pa.y); ctx.stroke();
      }
      ctx.restore();

      // ── Héroe aprisionado ─────────────────────────────────────────────────
      // Shock cada vez que un aspa pasa cerca
      let shockFactor = 0;
      for (let bi = 0; bi < SPOKES; bi++) {
        const bladeAngle = (bi / SPOKES) * Math.PI * 2 + scene.turbineAngle;
        let angDiff = Math.abs((bladeAngle % (Math.PI * 2)) - Math.PI / 2);
        angDiff = Math.min(angDiff, Math.PI * 2 - angDiff);
        if (angDiff < 0.28) shockFactor = Math.max(shockFactor, 1 - angDiff / 0.28);
      }

      const baseShake   = lerp(20, 34, t);
      const totalShake  = baseShake + shockFactor * 20;
      const compression = lerp(0, 0.20, t);
      const strainPulse = Math.sin(fc * 0.22) * lerp(0.12, 0.30, t);
      const stretchX    = clamp(0.78 - compression + strainPulse + shockFactor * 0.14, 0.48, 1.05);
      const stretchY    = clamp(1.22 + compression - strainPulse - shockFactor * 0.12, 0.90, 1.65);
      const heroR       = lerp(40, 33, t * 0.65);

      drawHero(ctx, CX, CY, heroR, 1.0, stretchX, stretchY, totalShake);

      // Destello de choque
      if (shockFactor > 0.55) {
        ctx.save();
        ctx.globalAlpha = shockFactor * 0.22;
        const flash = ctx.createRadialGradient(CX, CY, 0, CX, CY, heroR * 2.8);
        flash.addColorStop(0, 'rgba(255,210,100,0.9)');
        flash.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = flash;
        ctx.beginPath(); ctx.arc(CX, CY, heroR * 2.8, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      }

      setStatus(`Estado 2: Aprisionado — las partículas son la turbina · ${Math.round(t * 100)}%`);
    }

    // ── Grain ────────────────────────────────────────────────────────────────
    const grainI = time < T1 ? 0.07 : time < T2
      ? lerp(0.07, 0.03, (time-T1)/(T2-T1)) : 0.03;
    drawGrain(ctx, fc, grainI);

    if (time < DURATION) {
      animationFrameRef.current = requestAnimationFrame(update);
    } else {
      setIsPlaying(false);
      setStatus('Completado · 15 segundos');
    }
  };

  // ── Stop / Start / Record ─────────────────────────────────────────────────────
  const stopAnimation = () => {
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    animationFrameRef.current = null; startTimeRef.current = null;
    setIsPlaying(false); setProgress(0); setStatus('Detenido');
  };
  const startAnimation = () => {
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    sceneRef.current = initScene(); startTimeRef.current = null;
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
    try { mr = new MediaRecorder(stream, { mimeType:'video/webm;codecs=vp9', videoBitsPerSecond: 14_000_000 }); }
    catch { mr = new MediaRecorder(stream); }
    mediaRecorderRef.current = mr;
    mr.ondataavailable = (e) => { if (e.data.size > 0) recordedChunksRef.current.push(e.data); };
    mr.onstop = () => {
      const blob = new Blob(recordedChunksRef.current, { type:'video/webm' });
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href = url; a.download = 'turbina-prisionero-15s-60fps.webm';
      document.body.appendChild(a); a.click();
      document.body.removeChild(a); URL.revokeObjectURL(url);
      setIsRecording(false);
      setStatus('Descargado ✓ — convertir a MP4 en CapCut');
    };
    mr.start();
    setTimeout(() => {
      if (mediaRecorderRef.current?.state === 'recording') mediaRecorderRef.current.stop();
    }, DURATION * 1000 + 500);
  };

  // ── Idle frame ───────────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx    = canvas.getContext('2d', { alpha: false }); if (!ctx) return;
    ctx.fillStyle = '#050505'; ctx.fillRect(0, 0, W, H);
    ctx.shadowBlur = 50; ctx.shadowColor = 'rgba(255,255,255,0.4)';
    ctx.font = 'bold 44px Montserrat, sans-serif';
    ctx.fillStyle = '#ffffff'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('Prisionero de la Turbina', W/2, H/2 - 90); ctx.shadowBlur = 0;
    ctx.font = '24px Montserrat, sans-serif';
    ctx.fillStyle = 'rgba(198,168,124,0.65)';
    ctx.fillText('150 partículas → 15 aspas · 15s · 60fps', W/2, H/2 + 18);
    ctx.font = '19px Montserrat, sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.25)';
    ctx.fillText('Presiona Reproducir para comenzar', W/2, H/2 + 108);
    return () => { if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current); };
  }, []);

  useEffect(() => {
    if (isPlaying) animationFrameRef.current = requestAnimationFrame(update);
  }, [isPlaying]);

  // ── JSX ───────────────────────────────────────────────────────────────────────
  return (
    <div className="animation-app">
      <div className="container">
        <canvas ref={canvasRef} width={W} height={H} className="canvas" />
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <div className="controls">
          <button onClick={isPlaying ? pause : play} disabled={isRecording}>
            {isPlaying ? '⏸ Pausar' : '▶ Reproducir'}
          </button>
          <button onClick={restart} disabled={isRecording}>↻ Reiniciar</button>
          <button onClick={startRecording} disabled={isRecording} className={isRecording ? 'recording' : ''}>
            {isRecording ? '⬤ Grabando... (15s)' : '⬤ Grabar (15s)'}
          </button>
        </div>
        <div className="info" suppressHydrationWarning>
          <div className="status" suppressHydrationWarning>{status}</div>
          <div>Canvas 1080×1920 · 60 FPS · 150 partículas → 15 aspas</div>
        </div>
        <div className="acts">
          {([
            ['0–3s',  'Caos Browniano',    '150 partículas libres'],
            ['3–5s',  'Convergencia',      'Lerp → posición en aspa'],
            ['5–15s', 'Turbina activa',    'Partículas SON las aspas'],
          ] as const).map(([t, title, sub]) => (
            <div key={t} className="act-card">
              <div className="act-time">{t}</div>
              <div className="act-title">{title}</div>
              <div className="act-sub">{sub}</div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700;900&display=swap');
        * { margin:0; padding:0; box-sizing:border-box; }
        .animation-app {
          background: linear-gradient(135deg,#0a0a0f 0%,#1a1a1f 100%);
          display:flex; flex-direction:column; align-items:center;
          justify-content:center; min-height:100vh;
          font-family:'Montserrat',sans-serif; color:#fff; padding:20px;
        }
        .container { display:flex; flex-direction:column; align-items:center; gap:20px; max-width:100%; }
        .canvas {
          background:#000;
          box-shadow: 0 0 40px rgba(255,255,255,0.10), 0 0 80px rgba(0,229,255,0.07);
          border-radius:8px; max-height:80vh; max-width:100%; aspect-ratio:9/16;
        }
        .controls { display:flex; gap:12px; flex-wrap:wrap; justify-content:center; }
        button {
          padding:14px 28px; font-size:15px; font-weight:700;
          font-family:'Montserrat',sans-serif; cursor:pointer;
          background:linear-gradient(135deg,#ffffff 0%,#f0f0f0 100%);
          color:#000; border:none; border-radius:6px;
          text-transform:uppercase; letter-spacing:0.5px;
          transition:all 0.3s cubic-bezier(0.4,0,0.2,1);
          box-shadow:0 4px 12px rgba(0,0,0,0.3);
        }
        button:hover:not(:disabled) {
          background:linear-gradient(135deg,#C5A059 0%,#D4AF37 100%);
          transform:translateY(-2px); box-shadow:0 6px 20px rgba(197,160,89,0.4);
        }
        button:active:not(:disabled) { transform:translateY(0); }
        button:disabled:not(.recording) { background:#333; color:#666; cursor:not-allowed; box-shadow:none; }
        button.recording {
          background:linear-gradient(135deg,#cc2222 0%,#ff4444 100%);
          color:#fff; cursor:not-allowed;
          animation:pulse-rec 1s ease-in-out infinite;
        }
        @keyframes pulse-rec {
          0%,100% { box-shadow:0 0 8px rgba(255,50,50,0.5); }
          50%      { box-shadow:0 0 22px rgba(255,50,50,0.9); }
        }
        .progress-bar {
          width:100%; max-width:600px; height:6px;
          background:rgba(255,255,255,0.08); border-radius:3px; overflow:hidden;
        }
        .progress-fill {
          height:100%;
          background:linear-gradient(90deg,#555 0%,#00E5FF 40%,#C5A059 100%);
          transition:width 0.1s linear; box-shadow:0 0 10px rgba(0,229,255,0.5);
        }
        .info { text-align:center; opacity:0.7; font-size:13px; max-width:600px; }
        .status { font-weight:700; color:#C5A059; margin-bottom:8px; }
        .acts { display:grid; grid-template-columns:repeat(3,1fr); gap:8px; width:100%; max-width:600px; }
        .act-card {
          background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08);
          border-radius:6px; padding:10px 12px; text-align:center;
        }
        .act-time  { color:rgba(0,229,255,0.7); font-size:11px; font-weight:700; letter-spacing:0.06em; }
        .act-title { color:rgba(255,255,255,0.8); font-size:12px; font-weight:700; margin-top:4px; }
        .act-sub   { color:rgba(255,255,255,0.35); font-size:10px; margin-top:3px; }
        @media (max-width:600px) { button { padding:12px 20px; font-size:13px; } }
      `}</style>
    </div>
  );
}
