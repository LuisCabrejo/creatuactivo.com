'use client';

import React, { useRef, useState, useEffect } from 'react';

export default function Dia7MatrizEnfoque() {
  const canvasRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('Listo para reproducir');

  const animationFrameRef = useRef(null);
  const frameCountRef = useRef(0);
  const startTimeRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);
  const sceneRef = useRef(null);

  const FPS = 60;
  const DURATION = 38;
  const TOTAL_FRAMES = FPS * DURATION;

  const Easing = {
    easeInExpo: (x) => x === 0 ? 0 : Math.pow(2, 10 * x - 10),
    easeOutExpo: (x) => x === 1 ? 1 : 1 - Math.pow(2, -10 * x),
    easeOutBack: (x) => {
      const c1 = 1.70158;
      const c3 = c1 + 1;
      return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
    },
    easeOutQuad: (x) => 1 - (1 - x) * (1 - x),
    easeInOutQuad: (x) => x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2,
    easeInQuart: (x) => x * x * x * x,
    easeOutQuart: (x) => 1 - Math.pow(1 - x, 4),
    easeInOutCubic: (x) => x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2,
    easeOutCubic: (x) => 1 - Math.pow(1 - x, 3),
    easeInCubic: (x) => x * x * x,
  };

  // === DRAW HERO (Dan Koe 3-layer) ===
  const drawHeroFn = (ctx, x, y, radius, opacity, stretchX, stretchY, glowSize, shake) => {
    const shakeX = shake > 0 ? (Math.random() - 0.5) * shake : 0;
    const shakeY = shake > 0 ? (Math.random() - 0.5) * shake : 0;
    const hx = x + shakeX;
    const hy = y + shakeY;

    ctx.save();
    ctx.globalAlpha = opacity * 0.35;
    const atmosGlow = ctx.createRadialGradient(hx, hy, radius * 0.8, hx, hy, radius * 3.5);
    atmosGlow.addColorStop(0, 'rgba(255, 255, 255, 0.5)');
    atmosGlow.addColorStop(0.4, 'rgba(255, 255, 255, 0.15)');
    atmosGlow.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = atmosGlow;
    ctx.beginPath();
    ctx.arc(hx, hy, radius * 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.globalAlpha = opacity * 0.5;
    const edgeGlow = ctx.createRadialGradient(hx, hy, radius * 0.7, hx, hy, radius * 1.6);
    edgeGlow.addColorStop(0, 'rgba(255, 255, 255, 0.6)');
    edgeGlow.addColorStop(0.5, 'rgba(255, 255, 255, 0.2)');
    edgeGlow.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = edgeGlow;
    ctx.beginPath();
    ctx.arc(hx, hy, radius * 1.6, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(hx, hy, radius * stretchX, radius * stretchY, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };

  const drawGlow = (ctx, color, blur) => {
    ctx.shadowBlur = blur;
    ctx.shadowColor = color;
  };

  const resetGlow = (ctx) => {
    ctx.shadowBlur = 0;
    ctx.shadowColor = 'transparent';
  };

  const update = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const now = performance.now();
    if (startTimeRef.current === null) {
      startTimeRef.current = now;
    }

    const elapsed = (now - startTimeRef.current) / 1000;
    const time = Math.min(elapsed, DURATION);
    const frameCount = Math.floor(time * FPS);
    frameCountRef.current = frameCount;

    setProgress((time / DURATION) * 100);

    const W = canvas.width;
    const H = canvas.height;
    const CENTER_X = W / 2;
    const CENTER_Y = H / 2;

    // Initialize scene
    if (!sceneRef.current) {
      const HLINES = 28;   // horizontal lines
      const VLINES = 14;   // vertical lines
      const centerVIndex = Math.floor(VLINES / 2);

      // Cell pulses — small flickering lights in grid cells
      const cellPulses = [];
      for (let row = 0; row < HLINES - 1; row++) {
        for (let col = 0; col < VLINES - 1; col++) {
          if (Math.random() < 0.35) { // ~35% of cells have a pulse
            cellPulses.push({
              row, col,
              phase: Math.random() * Math.PI * 2,
              speed: 0.05 + Math.random() * 0.12,
              size: 2 + Math.random() * 4,
              baseOpacity: 0.08 + Math.random() * 0.15,
            });
          }
        }
      }

      // Reference points for ascent (Phase 4)
      const refPoints = [];
      for (let i = 0; i < 12; i++) {
        refPoints.push({
          x: CENTER_X + (Math.random() - 0.5) * 400,
          y: (i / 12) * H,
          speed: 0,
          size: 2 + Math.random() * 3,
          opacity: 0.10 + Math.random() * 0.15,
        });
      }

      // Jewelry diamond — corona plana (sin apex)
      const diamond = { angleX: 0, angleY: 0, vertices: [], edges: [] };
      const dv = diamond.vertices;
      // [0-7] Corona superior (octágono plano) - radio 0.55
      for (let i = 0; i < 8; i++) {
        const a = (Math.PI * 2 * i) / 8;
        dv.push({ x: Math.cos(a) * 0.55, y: -0.35, z: Math.sin(a) * 0.55 });
      }
      // [8-15] Girdle/cinturón - radio 1.0
      for (let i = 0; i < 8; i++) {
        const a = (Math.PI * 2 * i) / 8;
        dv.push({ x: Math.cos(a) * 1.0, y: 0, z: Math.sin(a) * 1.0 });
      }
      // [16] Culet (punta inferior)
      dv.push({ x: 0, y: 1.6, z: 0 });

      const de = diamond.edges;
      // Corona loop (octágono cerrado y plano)
      for (let i = 0; i < 8; i++) de.push([i, (i + 1) % 8]);
      // Corona → Girdle (solo verticales directas, sin cruces)
      for (let i = 0; i < 8; i++) de.push([i, i + 8]);
      // Girdle loop
      for (let i = 8; i < 16; i++) de.push([i, i === 15 ? 8 : i + 1]);
      // Girdle → Culet (todas convergen)
      for (let i = 8; i < 16; i++) de.push([i, 16]);
      // Cruces en el pabellón (profundidad)
      for (let i = 8; i < 16; i++) de.push([i, ((i + 1) % 8) + 8]);

      sceneRef.current = {
        HLINES,
        VLINES,
        centerVIndex,
        cellPulses,
        refPoints,
        diamond,
        // Grid elimination state
        hLineElim: 0,       // 0-1 progress for horizontal line erasure
        vLineElim: 0,       // 0-1 progress for vertical line erasure
        centralLineWidth: 1, // starts at 1, grows to 10
        centralLineGlow: 0,  // glow intensity
        // Hero — trapped in center cell from the start
        hero: {
          x: CENTER_X,
          y: CENTER_Y,
          radius: 38,
          opacity: 1,
          glowSize: 25,
          // Bounce physics for prison cell
          vx: 2.5,
          vy: 1.8,
          stretchX: 1,
          stretchY: 1,
          shake: 0,
        },
        distractions: [],
      };
    }

    const scene = sceneRef.current;

    // Clear
    ctx.fillStyle = '#050505';
    ctx.fillRect(0, 0, W, H);

    // Grid geometry
    const margin = 60;
    const gridLeft = margin;
    const gridRight = W - margin;
    const gridTop = margin;
    const gridBottom = H - margin;
    const hSpacing = (gridBottom - gridTop) / (scene.HLINES - 1);
    const vSpacing = (gridRight - gridLeft) / (scene.VLINES - 1);
    const centerLineX = gridLeft + scene.centerVIndex * vSpacing;

    // ============================================================
    // FASE 1 (0-5s): LA TRAMPA
    // Hero trapped in center cell, bouncing off grid walls
    // ============================================================
    if (time < 8.06) {
      const t = time / 8.06;

      // Grid builds in during first 1.5s
      const buildT = Math.min(1, t / 0.30);
      const gridOpacity = Easing.easeOutCubic(buildT);

      // === HERO CELL BOUNDS ===
      // Hero trapped in the BOTTOM row — spanning the full width (left wall to right wall)
      // This maximizes the contrast: trapped at bottom → free to ascend
      const heroCellLeft = gridLeft;
      const heroCellRight = gridRight;
      // Bottom row: last cell before the final line
      const bottomHIndex = scene.HLINES - 2; // second-to-last row = bottom corridor
      const heroCellTop = gridTop + bottomHIndex * hSpacing;
      const heroCellBottom = gridTop + (bottomHIndex + 1) * hSpacing;

      // Hero position is locked to vertical center of that bottom corridor
      const corridorCenterY = (heroCellTop + heroCellBottom) / 2;
      scene.hero.y = corridorCenterY; // NO vertical movement — can't go up
      scene.hero.vy = 0;

      // Move only horizontally — left to right, bouncing off walls
      scene.hero.x += scene.hero.vx;

      // Bounce off left/right walls — squish on impact
      if (scene.hero.x - scene.hero.radius < heroCellLeft) {
        scene.hero.x = heroCellLeft + scene.hero.radius;
        scene.hero.vx = Math.abs(scene.hero.vx);
        scene.hero.stretchX = 0.65; // hard squish on wall hit
        scene.hero.stretchY = 1.35;
      }
      if (scene.hero.x + scene.hero.radius > heroCellRight) {
        scene.hero.x = heroCellRight - scene.hero.radius;
        scene.hero.vx = -Math.abs(scene.hero.vx);
        scene.hero.stretchX = 0.65;
        scene.hero.stretchY = 1.35;
      }

      // Recover squish back to 1.0 — snappy recovery
      scene.hero.stretchX += (1 - scene.hero.stretchX) * 0.14;
      scene.hero.stretchY += (1 - scene.hero.stretchY) * 0.14;

      // Speed increases with frustration — faster and faster
      const targetSpeed = 7 + t * 14; // 7 → 21 px/frame
      scene.hero.vx = scene.hero.vx > 0 ? targetSpeed : -targetSpeed;

      // Draw horizontal lines
      ctx.save();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      for (let i = 0; i < scene.HLINES; i++) {
        const y = gridTop + i * hSpacing;
        const lineDelay = i / scene.HLINES;
        const lineOpacity = gridOpacity * Math.min(1, Math.max(0, (buildT - lineDelay * 0.5) / 0.5));
        if (lineOpacity <= 0) continue;

        const flicker = 0.4 + Math.abs(Math.sin(frameCount * 0.08 + i * 1.7)) * 0.6;
        ctx.globalAlpha = lineOpacity * flicker * 0.55;
        ctx.beginPath();
        ctx.moveTo(gridLeft, y);
        ctx.lineTo(gridRight, y);
        ctx.stroke();
      }
      ctx.restore();

      // Draw vertical lines
      ctx.save();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      for (let i = 0; i < scene.VLINES; i++) {
        const x = gridLeft + i * vSpacing;
        const lineDelay = i / scene.VLINES;
        const lineOpacity = gridOpacity * Math.min(1, Math.max(0, (buildT - lineDelay * 0.3) / 0.5));
        if (lineOpacity <= 0) continue;

        const flicker = 0.4 + Math.abs(Math.sin(frameCount * 0.06 + i * 2.3 + 5)) * 0.6;
        ctx.globalAlpha = lineOpacity * flicker * 0.55;
        ctx.beginPath();
        ctx.moveTo(x, gridTop);
        ctx.lineTo(x, gridBottom);
        ctx.stroke();
      }
      ctx.restore();

      // Cell pulses — small vibrating lights inside cells
      if (buildT > 0.5) {
        const pulseAlpha = Math.min(1, (buildT - 0.5) / 0.5);
        scene.cellPulses.forEach(p => {
          const cx = gridLeft + (p.col + 0.5) * vSpacing;
          const cy = gridTop + (p.row + 0.5) * hSpacing;
          const pulse = Math.sin(frameCount * p.speed + p.phase);
          const size = p.size * (0.6 + pulse * 0.4);
          const alpha = p.baseOpacity * pulseAlpha * (0.5 + pulse * 0.5);

          ctx.save();
          ctx.globalAlpha = alpha;
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(cx + Math.sin(frameCount * 0.03 + p.phase) * 3, cy, size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        });
      }

      // Moiré tension — subtle overlay
      if (t > 0.6) {
        ctx.save();
        ctx.globalAlpha = 0.03 + t * 0.04;
        for (let i = 0; i < 40; i++) {
          const y = gridTop + i * (hSpacing * 0.7) + Math.sin(frameCount * 0.02 + i) * 5;
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(gridLeft, y);
          ctx.lineTo(gridRight, y);
          ctx.stroke();
        }
        ctx.restore();
      }

      // === DRAW HERO (trapped, anxious, bouncing) ===
      const heroAppear = Math.min(1, t / 0.15); // fades in at start
      const heroGlow = 20 + t * 8; // dim — low energy, trapped
      drawHeroFn(ctx, scene.hero.x, scene.hero.y, scene.hero.radius, heroAppear,
        scene.hero.stretchX, scene.hero.stretchY, heroGlow, 3 + t * 5);

      setStatus('Fase 1: La Trampa');
    }
    // ============================================================
    // FASE 2 (8.06-13.16s): "FALSO" — DECONSTRUCCIÓN
    // Horizontal lines retract, vertical lines retract from edges
    // ============================================================
    else if (time < 13.16) {
      const t = (time - 8.06) / 5.10;

      // Sub-phases
      const FREEZE_END = 0.06;   // 8.06-8.36s: freeze (0.3s)
      const SHAKE_END = 0.12;    // 8.36-8.67s: camera shake (0.3s)
      const HERASE_END = 0.50;   // 8.67-10.62s: horizontal lines erase (2.0s)
      const VERASE_END = 0.80;   // 10.62-12.14s: vertical lines erase from edges (1.5s)

      // Camera shake
      let shakeX = 0, shakeY = 0;
      if (t > FREEZE_END && t < SHAKE_END + 0.15) {
        const shakeI = Math.max(0, 1 - ((t - SHAKE_END) / 0.15));
        shakeX = Math.sin(frameCount * 1.5) * 10 * shakeI;
        shakeY = Math.cos(frameCount * 2.1) * 7 * shakeI;
      }

      ctx.save();
      ctx.translate(shakeX, shakeY);

      // Horizontal lines — erase via dashoffset
      const hEraseProgress = Math.min(1, Math.max(0, (t - SHAKE_END) / (HERASE_END - SHAKE_END)));
      const hEraseEased = Easing.easeInCubic(hEraseProgress);

      if (hEraseEased < 1) {
        ctx.save();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        const lineLen = gridRight - gridLeft;
        for (let i = 0; i < scene.HLINES; i++) {
          const y = gridTop + i * hSpacing;
          // Lines retract from both ends toward center
          const retractAmount = hEraseEased * (lineLen / 2);
          const leftEnd = gridLeft + retractAmount;
          const rightEnd = gridRight - retractAmount;
          if (leftEnd >= rightEnd) continue;

          // Flicker stops after freeze
          const flicker = t < FREEZE_END
            ? 0.4 + Math.abs(Math.sin(frameCount * 0.08 + i * 1.7)) * 0.6
            : 1;
          ctx.globalAlpha = (1 - hEraseEased * 0.5) * flicker * 0.55;
          ctx.beginPath();
          ctx.moveTo(leftEnd, y);
          ctx.lineTo(rightEnd, y);
          ctx.stroke();
        }
        ctx.restore();
      }

      // Vertical lines — erase from edges inward (staggered)
      const vEraseStart = HERASE_END * 0.7;
      const vEraseProgress = Math.min(1, Math.max(0, (t - vEraseStart) / (VERASE_END - vEraseStart)));

      ctx.save();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      for (let i = 0; i < scene.VLINES; i++) {
        const x = gridLeft + i * vSpacing;
        const isCenter = i === scene.centerVIndex;

        if (isCenter) {
          // Central line survives — starts glowing
          const glowStart = Math.max(0, vEraseProgress - 0.3);
          const glowT = Math.min(1, glowStart / 0.7);
          const lw = 1 + glowT * 3;

          ctx.save();
          ctx.globalAlpha = 0.7 + glowT * 0.3;
          if (glowT > 0) {
            drawGlow(ctx, 'rgba(255, 255, 255, 0.5)', 8 + glowT * 12);
          }
          ctx.lineWidth = lw;
          ctx.beginPath();
          ctx.moveTo(x, gridTop);
          ctx.lineTo(x, gridBottom);
          ctx.stroke();
          resetGlow(ctx);
          ctx.restore();
          continue;
        }

        // Distance from center determines erase order (outside→in)
        const distFromCenter = Math.abs(i - scene.centerVIndex);
        const maxDist = scene.centerVIndex;
        // Lines far from center erase first
        const lineEraseStart = (1 - distFromCenter / maxDist) * 0.7;
        const lineEraseT = Math.min(1, Math.max(0, (vEraseProgress - lineEraseStart) / 0.3));
        const lineEraseEased = Easing.easeInCubic(lineEraseT);

        if (lineEraseEased >= 1) continue;

        // Retract from both ends toward middle
        const lineLen = gridBottom - gridTop;
        const retract = lineEraseEased * (lineLen / 2);
        const top = gridTop + retract;
        const bottom = gridBottom - retract;
        if (top >= bottom) continue;

        ctx.globalAlpha = (1 - lineEraseEased) * 0.5;
        ctx.beginPath();
        ctx.moveTo(x, top);
        ctx.lineTo(x, bottom);
        ctx.stroke();
      }
      ctx.restore();

      // Cell pulses fade during freeze/collapse
      if (t < 0.4) {
        const fadeOut = 1 - t / 0.4;
        scene.cellPulses.forEach(p => {
          const cx = gridLeft + (p.col + 0.5) * vSpacing;
          const cy = gridTop + (p.row + 0.5) * hSpacing;
          const frozen = t < FREEZE_END;
          const pulse = frozen ? Math.sin(5 * FPS * p.speed + p.phase) : Math.sin(frameCount * p.speed + p.phase);
          const size = p.size * (0.6 + pulse * 0.4);

          ctx.save();
          ctx.globalAlpha = p.baseOpacity * fadeOut * 0.5;
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(cx, cy, size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        });
      }

      // === HERO during collapse — stays at the BOTTOM ===
      // Hero position: locked at bottom center of canvas (where it was bouncing)
      const heroBottomY = H - 120; // near the bottom of screen

      if (t < FREEZE_END) {
        // Frozen in place mid-bounce — sudden stop
        scene.hero.x = scene.hero.x; // stays wherever it stopped
        drawHeroFn(ctx, scene.hero.x, heroBottomY, scene.hero.radius, 1,
          scene.hero.stretchX, scene.hero.stretchY, 25, 0);
      }
      else if (t < SHAKE_END + 0.20) {
        // Stillness moment: hero floats in the void — walls are gone, it realizes
        // Stays at bottom, just centers on X, stretches back to circle
        const stillT = Math.min(1, (t - FREEZE_END) / 0.30);
        const stillEased = Easing.easeOutCubic(stillT);
        const heroX = scene.hero.x + (centerLineX - scene.hero.x) * stillEased;
        const sX = scene.hero.stretchX + (1 - scene.hero.stretchX) * stillEased;
        const sY = scene.hero.stretchY + (1 - scene.hero.stretchY) * stillEased;
        // Glow pulses — dawning realization
        const heroGlow = 25 + stillEased * 20;
        drawHeroFn(ctx, heroX, heroBottomY, scene.hero.radius, 1, sX, sY, heroGlow, 0);
        scene.hero.x = heroX;
        scene.hero.stretchX = sX;
        scene.hero.stretchY = sY;
      }
      else {
        // Hero stays at bottom, centered, calm — gathering energy
        const heroGlow = 45 + Math.sin(frameCount * 0.15) * 8;
        drawHeroFn(ctx, centerLineX, heroBottomY, scene.hero.radius, 1, 1, 1, heroGlow, 0);
        scene.hero.x = centerLineX;
        scene.hero.y = heroBottomY;
      }

      ctx.restore(); // end camera shake

      setStatus(t < FREEZE_END ? '...' : t < SHAKE_END ? 'FALSO.' : 'Fase 2: El Escape');
    }
    // ============================================================
    // FASE 3 (8-12s): EL LANZAMIENTO
    // Hero is already at bottom + centered. Brief pause → rockets upward → exits screen top.
    // MINIMALISM: only the vertical line + the hero.
    // ============================================================
    else if (time < 18.20) {
      const t = (time - 13.16) / 5.04;

      const heroBottomY = H - 120; // where Phase 2 left the hero

      const PAUSE_END = 0.12; // ~0.48s pause at bottom — gathering energy

      // Vertical line — full height, glow grows
      const lineGrow = Easing.easeOutCubic(Math.min(1, t / 0.25));
      const lineGlow = 10 + t * 32;

      ctx.save();
      ctx.globalAlpha = 0.9;
      drawGlow(ctx, `rgba(255, 255, 255, ${0.4 + t * 0.35})`, lineGlow);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 4 + lineGrow * 6;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(centerLineX, H);
      ctx.lineTo(centerLineX, 0);
      ctx.stroke();
      resetGlow(ctx);
      ctx.restore();

      if (t < PAUSE_END) {
        // PAUSE at bottom — anticipation
        const breathe = 1 + Math.sin(frameCount * 0.14) * 0.05;
        const heroGlow = 45 + Math.sin(frameCount * 0.12) * 12;

        // Subtle energy ring pulsing outward from hero
        ctx.save();
        ctx.globalAlpha = 0.06 + Math.sin(frameCount * 0.18) * 0.04;
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(centerLineX, heroBottomY, 55 + Math.sin(frameCount * 0.14) * 18, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();

        scene.hero.x = centerLineX;
        scene.hero.y = heroBottomY;
        drawHeroFn(ctx, centerLineX, heroBottomY, scene.hero.radius * breathe, 1, 1, 1, heroGlow, 0);
      }
      else {
        // LAUNCH: explosive easeInExpo acceleration — bottom → exits screen top
        const launchT = (t - PAUSE_END) / (1 - PAUSE_END);
        const launchEased = Easing.easeInExpo(launchT);
        const startY = heroBottomY;
        const endY = -scene.hero.radius - 40; // exits screen top completely
        scene.hero.x = centerLineX;
        scene.hero.y = startY + (endY - startY) * launchEased;

        // Motion blur trail — ghost copies BELOW hero (velocity trail)
        if (launchT > 0.04) {
          const trailIntensity = Math.min(1, launchT / 0.25);
          const trailSpacing = 35 + launchEased * 140; // gaps grow with speed
          for (let g = 5; g >= 1; g--) {
            const ghostY = scene.hero.y + g * trailSpacing;
            if (ghostY > H + 20) continue;
            const ghostOp = 0.14 * trailIntensity / g;
            drawHeroFn(ctx, centerLineX, ghostY, scene.hero.radius * (1 - g * 0.05), ghostOp, 1, 1.2, 20, 0);
          }
        }

        // Hero elongates with speed
        const stretchY = 1 + launchEased * 0.32;
        const stretchX = 1 - launchEased * 0.14;
        const heroGlow = 55 + launchEased * 65;
        // Only draw if still on screen
        if (scene.hero.y > -scene.hero.radius - 5) {
          drawHeroFn(ctx, centerLineX, scene.hero.y, scene.hero.radius, 1, stretchX, stretchY, heroGlow, 0);
        }
      }

      setStatus('Fase 3: El Lanzamiento');
    }
    // ============================================================
    // FASE 4 (12-17s): EL ASCENSO — PURA TRAYECTORIA
    // ELIMINACIÓN RADICAL: solo la línea + el héroe.
    // Sin puntos, sin distracciones, sin ruido. Solo el camino.
    // ============================================================
    else if (time < 32.06) {
      const t = (time - 18.20) / 13.86;

      // Vertical line — full height, luminosity grows with time
      ctx.save();
      ctx.globalAlpha = 0.88;
      drawGlow(ctx, 'rgba(255, 255, 255, 0.55)', 18 + t * 18);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 8 + t * 3;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(centerLineX, H);
      ctx.lineTo(centerLineX, 0);
      ctx.stroke();
      resetGlow(ctx);
      ctx.restore();

      // Wind tunnel: 2 ultra-thin lines flanking the central line
      // Creates sense of speed without adding visual noise
      const tunnelAlpha = 0.07 + t * 0.10;
      [16, 32].forEach((offset, idx) => {
        [-1, 1].forEach(side => {
          ctx.save();
          ctx.globalAlpha = tunnelAlpha / (idx + 1);
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(centerLineX + side * offset, 0);
          ctx.lineTo(centerLineX + side * offset, H);
          ctx.stroke();
          ctx.restore();
        });
      });

      // Hero at top of line — increasing luminosity
      const heroY = scene.hero.radius + 55;
      scene.hero.y = heroY;
      const heroGlow = 68 + t * 30;

      // Motion blur trail below hero (velocity at full speed)
      for (let g = 4; g >= 1; g--) {
        const ghostY = heroY + g * (45 + t * 70);
        if (ghostY > H) continue;
        const ghostOp = 0.14 / g;
        drawHeroFn(ctx, centerLineX, ghostY, scene.hero.radius * (1 - g * 0.07), ghostOp, 1, 1.18, 20, 0);
      }

      const breathe = 1 + Math.sin(frameCount * 0.04) * 0.03;
      drawHeroFn(ctx, centerLineX, heroY, scene.hero.radius * breathe, 1, 1, 1, heroGlow, 0);

      setStatus('Fase 4: El Ascenso');
    }
    // ============================================================
    // FASE 5 (17-20s): "LO INEVITABLE" + FADE TO BLACK
    // ============================================================
    else if (time < 34.09) {
      const t = (time - 32.06) / 2.03;

      const heroY = scene.hero.radius + 55;

      if (t < 0.67) {
        const climbT = t / 0.67;

        // Line — peak luminosity, maximum glow
        ctx.save();
        ctx.globalAlpha = 0.9;
        drawGlow(ctx, 'rgba(255, 255, 255, 0.7)', 28 + climbT * 30);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 11 + climbT * 5;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(centerLineX, H);
        ctx.lineTo(centerLineX, 0);
        ctx.stroke();
        resetGlow(ctx);
        ctx.restore();

        // Concentric rings expanding from hero (callback to Day 6 momentum)
        // These emanate FROM the hero — not external noise, they ARE the hero
        for (let r = 0; r < 4; r++) {
          const ringDelay = r * 0.22;
          const ringT = Math.max(0, climbT - ringDelay);
          if (ringT <= 0) continue;
          const ringRadius = 380 * Math.min(1, ringT / (1 - ringDelay));
          const ringOpacity = (1 - Math.min(1, ringT / (1 - ringDelay))) * (0.55 - r * 0.10);
          if (ringOpacity <= 0.01) continue;
          ctx.save();
          ctx.globalAlpha = ringOpacity;
          drawGlow(ctx, 'rgba(255, 255, 255, 0.6)', 20 - r * 4);
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = Math.max(0.5, 3.5 - r * 0.8);
          ctx.beginPath();
          ctx.arc(centerLineX, heroY, ringRadius, 0, Math.PI * 2);
          ctx.stroke();
          resetGlow(ctx);
          ctx.restore();
        }

        // Hero: maximum luminosity — expanding, inevitable
        const heroExpand = 1 + Easing.easeOutExpo(climbT) * 0.5;
        const heroGlowMax = 95 + climbT * 65;
        drawHeroFn(ctx, centerLineX, heroY, scene.hero.radius * heroExpand, 1, 1, 1, heroGlowMax, 0);

        setStatus('✦ LO INEVITABLE ✦');
      }
      // Fade to black
      else {
        const fadeT = (t - 0.67) / 0.33;
        const eased = Easing.easeInOutQuad(fadeT);

        const heroOpacity = 1 - eased;
        if (heroOpacity > 0.01) {
          // Line fades
          ctx.save();
          ctx.globalAlpha = 0.6 * heroOpacity;
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 10;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(centerLineX, H);
          ctx.lineTo(centerLineX, 0);
          ctx.stroke();
          ctx.restore();

          drawHeroFn(ctx, centerLineX, heroY, scene.hero.radius * 1.35, heroOpacity, 1, 1, 110, 0);
        }

        // Black overlay
        ctx.save();
        ctx.globalAlpha = eased;
        ctx.fillStyle = '#050505';
        ctx.fillRect(0, 0, W, H);
        ctx.restore();

        setStatus('Transición a firma...');
      }
    }
    // ============================================================
    // FIRMA (34.09-37.08s): Dan Koe Card — "ELIMINACIÓN RADICAL"
    // ============================================================
    else if (time >= 34.09 && time < 37.08) {
      const t = (time - 34.09) / 2.91;

      const SLIDE_DUR = 0.10;
      const slideProgress = Easing.easeOutQuart(Math.min(1, t / SLIDE_DUR));
      const cardOffsetY = (1 - slideProgress) * 180;
      const cardOpacity = slideProgress;

      const cardWidth = 800;
      const cardHeight = 1500;
      const cardX = CENTER_X - cardWidth / 2;
      const cardY = CENTER_Y - cardHeight / 2;

      const lightTime = time - 20;
      const breathe = 0.93 + Math.sin(lightTime * 0.6) * 0.07;
      const lightX = CENTER_X + 220 - t * 480;
      const lightY = CENTER_Y + 420 - t * 520;
      const fadeIn = Math.min(1, lightTime / 0.8);

      // Backlight layers
      ctx.save();
      ctx.globalAlpha = cardOpacity * fadeIn * breathe;
      const bigGlow2 = ctx.createRadialGradient(lightX, lightY, cardWidth * 0.15, lightX, lightY, cardWidth * 1.3);
      bigGlow2.addColorStop(0, 'rgba(220, 216, 208, 1)');
      bigGlow2.addColorStop(0.15, 'rgba(190, 186, 178, 0.85)');
      bigGlow2.addColorStop(0.3, 'rgba(155, 151, 144, 0.6)');
      bigGlow2.addColorStop(0.5, 'rgba(110, 107, 102, 0.3)');
      bigGlow2.addColorStop(0.7, 'rgba(65, 63, 58, 0.1)');
      bigGlow2.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = bigGlow2;
      ctx.fillRect(0, 0, W, H);
      ctx.restore();

      ctx.save();
      ctx.globalAlpha = cardOpacity * fadeIn * breathe * 0.8;
      const leftLight = ctx.createRadialGradient(lightX - 180, lightY - 80, 0, lightX - 180, lightY - 80, cardHeight * 0.6);
      leftLight.addColorStop(0, 'rgba(230, 226, 218, 0.95)');
      leftLight.addColorStop(0.15, 'rgba(190, 186, 178, 0.7)');
      leftLight.addColorStop(0.35, 'rgba(140, 137, 130, 0.35)');
      leftLight.addColorStop(0.6, 'rgba(80, 77, 72, 0.1)');
      leftLight.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = leftLight;
      ctx.fillRect(0, 0, W, H);
      ctx.restore();

      ctx.save();
      ctx.globalAlpha = cardOpacity * fadeIn * breathe * 0.4;
      const rightLight = ctx.createRadialGradient(cardX + cardWidth + 50, CENTER_Y + 100, 0, cardX + cardWidth + 50, CENTER_Y + 100, cardHeight * 0.5);
      rightLight.addColorStop(0, 'rgba(200, 196, 188, 0.7)');
      rightLight.addColorStop(0.2, 'rgba(150, 147, 140, 0.4)');
      rightLight.addColorStop(0.5, 'rgba(90, 87, 82, 0.12)');
      rightLight.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = rightLight;
      ctx.fillRect(0, 0, W, H);
      ctx.restore();

      // Card
      ctx.save();
      ctx.globalAlpha = cardOpacity;
      ctx.translate(0, cardOffsetY);

      ctx.fillStyle = '#090909';
      ctx.fillRect(cardX, cardY, cardWidth, cardHeight);

      // Illuminated edges
      const leftEdge = ctx.createLinearGradient(cardX - 1, 0, cardX + 4, 0);
      leftEdge.addColorStop(0, 'rgba(220, 216, 208, 0.6)');
      leftEdge.addColorStop(0.5, 'rgba(180, 176, 168, 0.25)');
      leftEdge.addColorStop(1, 'rgba(180, 176, 168, 0)');
      ctx.fillStyle = leftEdge;
      ctx.fillRect(cardX - 1, cardY, 5, cardHeight);

      const topEdge = ctx.createLinearGradient(0, cardY - 1, 0, cardY + 3);
      topEdge.addColorStop(0, 'rgba(200, 196, 188, 0.4)');
      topEdge.addColorStop(0.5, 'rgba(160, 156, 148, 0.15)');
      topEdge.addColorStop(1, 'rgba(160, 156, 148, 0)');
      ctx.fillStyle = topEdge;
      ctx.fillRect(cardX, cardY - 1, cardWidth * 0.6, 4);

      const rightEdge = ctx.createLinearGradient(cardX + cardWidth + 1, 0, cardX + cardWidth - 3, 0);
      rightEdge.addColorStop(0, 'rgba(170, 166, 158, 0.2)');
      rightEdge.addColorStop(0.5, 'rgba(140, 136, 128, 0.08)');
      rightEdge.addColorStop(1, 'rgba(140, 136, 128, 0)');
      ctx.fillStyle = rightEdge;
      ctx.fillRect(cardX + cardWidth - 3, cardY, 4, cardHeight);

      const bottomEdge = ctx.createLinearGradient(0, cardY + cardHeight + 1, 0, cardY + cardHeight - 3);
      bottomEdge.addColorStop(0, 'rgba(170, 166, 158, 0.2)');
      bottomEdge.addColorStop(0.5, 'rgba(140, 136, 128, 0.08)');
      bottomEdge.addColorStop(1, 'rgba(140, 136, 128, 0)');
      ctx.fillStyle = bottomEdge;
      ctx.fillRect(cardX, cardY + cardHeight - 3, cardWidth * 0.5, 4);

      // Text
      ctx.font = 'bold 50px Montserrat, sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('CREA TU', CENTER_X, CENTER_Y - 450);
      ctx.font = '900 88px Montserrat, sans-serif';
      ctx.fillText('ACTIVO', CENTER_X, CENTER_Y - 350);

      // Diamond — 3D rotating wireframe
      const cubeSize = 180;
      const diamondY = CENTER_Y - 80;
      scene.diamond.angleX = 0.15;
      scene.diamond.angleY += 0.005;
      drawGlow(ctx, 'rgba(255, 255, 255, 0.6)', 25 + Math.sin(frameCount * 0.05) * 6);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      const projPts = scene.diamond.vertices.map(v => {
        const x1 = v.x * Math.cos(scene.diamond.angleY) - v.z * Math.sin(scene.diamond.angleY);
        const z1 = v.x * Math.sin(scene.diamond.angleY) + v.z * Math.cos(scene.diamond.angleY);
        const y2 = v.y * Math.cos(scene.diamond.angleX) - z1 * Math.sin(scene.diamond.angleX);
        const z2 = v.y * Math.sin(scene.diamond.angleX) + z1 * Math.cos(scene.diamond.angleX);
        return { x: CENTER_X + x1 * cubeSize, y: diamondY + y2 * cubeSize, z: z2 };
      });
      scene.diamond.edges.forEach(edge => {
        const p1 = projPts[edge[0]];
        const p2 = projPts[edge[1]];
        const avgZ = (p1.z + p2.z) / 2;
        ctx.globalAlpha = cardOpacity * (0.5 + (avgZ + 1) * 0.25);
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      });
      resetGlow(ctx);

      ctx.globalAlpha = cardOpacity;
      ctx.font = '600 20px Montserrat, sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.letterSpacing = '4px';
      ctx.fillText('ELIMINACIÓN RADICAL', CENTER_X, CENTER_Y + 280);
      ctx.letterSpacing = '0px';

      ctx.font = '900 64px Montserrat, sans-serif';
      ctx.fillStyle = '#ffffff';
      const name = 'LUIS CABREJO';
      const nameW = ctx.measureText(name).width;
      if (nameW > cardWidth * 0.85) ctx.font = '900 56px Montserrat, sans-serif';
      ctx.fillText(name, CENTER_X, CENTER_Y + 380);

      ctx.restore();
      setStatus('Firma: Eliminación Radical');
    }
    // === HOLD FINAL ===
    else {
      const cardWidth = 800;
      const cardHeight = 1500;
      const cardX = CENTER_X - cardWidth / 2;
      const cardY = CENTER_Y - cardHeight / 2;
      const breatheF = 0.93 + Math.sin((time - 34.09) * 0.6) * 0.07;

      const holdLightX = CENTER_X - 260;
      const holdLightY = CENTER_Y - 100;

      ctx.save();
      ctx.globalAlpha = breatheF;
      const bg1 = ctx.createRadialGradient(holdLightX, holdLightY, cardWidth * 0.15, holdLightX, holdLightY, cardWidth * 1.3);
      bg1.addColorStop(0, 'rgba(220, 216, 208, 1)');
      bg1.addColorStop(0.15, 'rgba(190, 186, 178, 0.85)');
      bg1.addColorStop(0.3, 'rgba(155, 151, 144, 0.6)');
      bg1.addColorStop(0.5, 'rgba(110, 107, 102, 0.3)');
      bg1.addColorStop(0.7, 'rgba(65, 63, 58, 0.1)');
      bg1.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = bg1;
      ctx.fillRect(0, 0, W, H);
      ctx.restore();

      ctx.save();
      ctx.globalAlpha = breatheF * 0.8;
      const bg2 = ctx.createRadialGradient(holdLightX - 180, holdLightY - 80, 0, holdLightX - 180, holdLightY - 80, cardHeight * 0.6);
      bg2.addColorStop(0, 'rgba(230, 226, 218, 0.95)');
      bg2.addColorStop(0.15, 'rgba(190, 186, 178, 0.7)');
      bg2.addColorStop(0.35, 'rgba(140, 137, 130, 0.35)');
      bg2.addColorStop(0.6, 'rgba(80, 77, 72, 0.1)');
      bg2.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = bg2;
      ctx.fillRect(0, 0, W, H);
      ctx.restore();

      ctx.save();
      ctx.globalAlpha = breatheF * 0.4;
      const bg3 = ctx.createRadialGradient(cardX + cardWidth + 50, CENTER_Y + 100, 0, cardX + cardWidth + 50, CENTER_Y + 100, cardHeight * 0.5);
      bg3.addColorStop(0, 'rgba(200, 196, 188, 0.7)');
      bg3.addColorStop(0.2, 'rgba(150, 147, 140, 0.4)');
      bg3.addColorStop(0.5, 'rgba(90, 87, 82, 0.12)');
      bg3.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = bg3;
      ctx.fillRect(0, 0, W, H);
      ctx.restore();

      ctx.save();
      ctx.fillStyle = '#090909';
      ctx.fillRect(cardX, cardY, cardWidth, cardHeight);

      // Edges
      const le = ctx.createLinearGradient(cardX - 1, 0, cardX + 4, 0);
      le.addColorStop(0, 'rgba(220, 216, 208, 0.6)');
      le.addColorStop(0.5, 'rgba(180, 176, 168, 0.25)');
      le.addColorStop(1, 'rgba(180, 176, 168, 0)');
      ctx.fillStyle = le;
      ctx.fillRect(cardX - 1, cardY, 5, cardHeight);

      const te = ctx.createLinearGradient(0, cardY - 1, 0, cardY + 3);
      te.addColorStop(0, 'rgba(200, 196, 188, 0.4)');
      te.addColorStop(0.5, 'rgba(160, 156, 148, 0.15)');
      te.addColorStop(1, 'rgba(160, 156, 148, 0)');
      ctx.fillStyle = te;
      ctx.fillRect(cardX, cardY - 1, cardWidth * 0.6, 4);

      const re = ctx.createLinearGradient(cardX + cardWidth + 1, 0, cardX + cardWidth - 3, 0);
      re.addColorStop(0, 'rgba(170, 166, 158, 0.2)');
      re.addColorStop(0.5, 'rgba(140, 136, 128, 0.08)');
      re.addColorStop(1, 'rgba(140, 136, 128, 0)');
      ctx.fillStyle = re;
      ctx.fillRect(cardX + cardWidth - 3, cardY, 4, cardHeight);

      const be = ctx.createLinearGradient(0, cardY + cardHeight + 1, 0, cardY + cardHeight - 3);
      be.addColorStop(0, 'rgba(170, 166, 158, 0.2)');
      be.addColorStop(0.5, 'rgba(140, 136, 128, 0.08)');
      be.addColorStop(1, 'rgba(140, 136, 128, 0)');
      ctx.fillStyle = be;
      ctx.fillRect(cardX, cardY + cardHeight - 3, cardWidth * 0.5, 4);

      ctx.font = 'bold 50px Montserrat, sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('CREA TU', CENTER_X, CENTER_Y - 450);
      ctx.font = '900 88px Montserrat, sans-serif';
      ctx.fillText('ACTIVO', CENTER_X, CENTER_Y - 350);

      // Diamond — 3D rotating wireframe
      const cubeSize = 180;
      const diamondY = CENTER_Y - 80;
      scene.diamond.angleX = 0.15;
      scene.diamond.angleY += 0.005;
      drawGlow(ctx, 'rgba(255, 255, 255, 0.6)', 25 + Math.sin(frameCount * 0.05) * 6);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      const projPtsH = scene.diamond.vertices.map(v => {
        const x1 = v.x * Math.cos(scene.diamond.angleY) - v.z * Math.sin(scene.diamond.angleY);
        const z1 = v.x * Math.sin(scene.diamond.angleY) + v.z * Math.cos(scene.diamond.angleY);
        const y2 = v.y * Math.cos(scene.diamond.angleX) - z1 * Math.sin(scene.diamond.angleX);
        const z2 = v.y * Math.sin(scene.diamond.angleX) + z1 * Math.cos(scene.diamond.angleX);
        return { x: CENTER_X + x1 * cubeSize, y: diamondY + y2 * cubeSize, z: z2 };
      });
      scene.diamond.edges.forEach(edge => {
        const p1 = projPtsH[edge[0]];
        const p2 = projPtsH[edge[1]];
        const avgZ = (p1.z + p2.z) / 2;
        ctx.globalAlpha = 0.5 + (avgZ + 1) * 0.25;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      });
      resetGlow(ctx);

      ctx.globalAlpha = 1;
      ctx.font = '600 20px Montserrat, sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.letterSpacing = '4px';
      ctx.fillText('ELIMINACIÓN RADICAL', CENTER_X, CENTER_Y + 280);
      ctx.letterSpacing = '0px';

      ctx.font = '900 64px Montserrat, sans-serif';
      ctx.fillStyle = '#ffffff';
      const name = 'LUIS CABREJO';
      const nameW = ctx.measureText(name).width;
      if (nameW > 800 * 0.85) ctx.font = '900 56px Montserrat, sans-serif';
      ctx.fillText(name, CENTER_X, CENTER_Y + 380);
      ctx.restore();

      setStatus('Animación completada');
    }

    if (time < DURATION) {
      animationFrameRef.current = requestAnimationFrame(update);
    } else {
      setIsPlaying(false);
      setStatus('Animación completada');
    }
  };

  const play = () => {
    if (startTimeRef.current === null) {
      startTimeRef.current = performance.now();
    }
    setIsPlaying(true);
    update();
  };

  const pause = () => {
    setIsPlaying(false);
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
  };

  const restart = () => {
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    frameCountRef.current = 0;
    startTimeRef.current = null;
    sceneRef.current = null;
    setProgress(0);
    setIsPlaying(false);

    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#050505';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
    setStatus('Reiniciado - Listo para reproducir');
    setTimeout(() => play(), 100);
  };

  const startRecording = () => {
    const canvas = canvasRef.current;
    if (!canvas || isRecording) return;

    restart();
    setIsRecording(true);
    recordedChunksRef.current = [];

    const stream = canvas.captureStream(60);
    const options = { mimeType: 'video/webm;codecs=vp9', videoBitsPerSecond: 30000000 };

    try {
      mediaRecorderRef.current = new MediaRecorder(stream, options);
    } catch (e) {
      mediaRecorderRef.current = new MediaRecorder(stream);
    }

    mediaRecorderRef.current.ondataavailable = (event) => {
      if (event.data.size > 0) recordedChunksRef.current.push(event.data);
    };

    mediaRecorderRef.current.onstop = () => {
      const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'dia7-v3-eliminacion-radical-38s-60fps.webm';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setIsRecording(false);
      setStatus('Grabación descargada exitosamente');
    };

    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.start();
      setTimeout(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
          mediaRecorderRef.current.stop();
        }
      }, DURATION * 1000 + 500);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const CX = canvas.width / 2;
    const CY = canvas.height / 2;

    ctx.fillStyle = '#050505';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = 'bold 48px Montserrat, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowBlur = 40;
    ctx.shadowColor = 'rgba(197, 160, 89, 0.6)';
    ctx.fillText('Día 7 · Opción 3', CX, CY - 80);

    ctx.font = '32px Montserrat, sans-serif';
    ctx.shadowBlur = 25;
    ctx.shadowColor = 'rgba(255, 255, 255, 0.4)';
    ctx.fillText('La Matriz de Enfoque', CX, CY + 20);

    ctx.font = '20px Montserrat, sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.shadowBlur = 0;
    ctx.fillText('Presiona Reproducir para comenzar', CX, CY + 100);

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  useEffect(() => {
    if (isPlaying) update();
  }, [isPlaying]);

  return (
    <div className="animation-app">
      <div className="container">
        <canvas ref={canvasRef} width={1080} height={1920} className="canvas" />

        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>

        <div className="controls">
          <button onClick={isPlaying ? pause : play} disabled={isRecording}>
            {isPlaying ? '⏸ Pausar' : '▶ Reproducir'}
          </button>
          <button onClick={restart} disabled={isRecording}>
            ↻ Reiniciar
          </button>
          <button onClick={startRecording} disabled={isRecording}>
            {isRecording ? '⬤ Grabando... (26s)' : '⬤ Grabar (26s)'}
          </button>
        </div>

        <div className="info" suppressHydrationWarning>
          <div className="status" suppressHydrationWarning>{status}</div>
          <div>Canvas 1080x1920 · 60 FPS · 26 segundos · Opción 3: Matriz</div>
        </div>
      </div>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700;900&display=swap');

        * { margin: 0; padding: 0; box-sizing: border-box; }

        .animation-app {
          background: linear-gradient(135deg, #0a0a0f 0%, #1a1a1f 100%);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          font-family: 'Montserrat', sans-serif;
          color: #ffffff;
          padding: 20px;
        }

        .container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
          max-width: 100%;
        }

        .canvas {
          background-color: #000000;
          box-shadow: 0 0 40px rgba(197, 160, 89, 0.2), 0 0 80px rgba(197, 160, 89, 0.1);
          border-radius: 8px;
          max-height: 80vh;
          max-width: 100%;
          aspect-ratio: 9/16;
        }

        .controls {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          justify-content: center;
        }

        button {
          padding: 14px 28px;
          font-size: 15px;
          font-weight: 700;
          font-family: 'Montserrat', sans-serif;
          cursor: pointer;
          background: linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%);
          color: #000000;
          border: none;
          border-radius: 6px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }

        button:hover:not(:disabled) {
          background: linear-gradient(135deg, #C5A059 0%, #D4AF37 100%);
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(197, 160, 89, 0.3);
        }

        button:active:not(:disabled) { transform: translateY(0); }

        button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          background: #333;
          color: #888;
        }

        .progress-bar {
          width: 100%;
          max-width: 400px;
          height: 4px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 2px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #C5A059, #D4AF37);
          border-radius: 2px;
          transition: width 0.1s linear;
        }

        .info {
          text-align: center;
          font-size: 13px;
          color: rgba(255, 255, 255, 0.5);
          line-height: 1.6;
        }

        .status {
          color: rgba(197, 160, 89, 0.8);
          font-weight: 700;
          font-size: 14px;
          margin-bottom: 4px;
        }
      `}</style>
    </div>
  );
}
