'use client';

import React, { useRef, useState, useEffect } from 'react';

// Audio timestamps (seconds):
// 00.00 — "Nos han mentido."
// 01.12 — "Nos dijeron que para crecer hay que sumar."
// 04.08 — "Más horas. Más estrategias. Más herramientas."
// 08.06 — "Falso."
// 09.23 — "El éxito no es una suma... es una resta."
// 13.16 — "Una estatua no se crea añadiendo arcilla, sino quitando lo que sobra de la piedra."
// 18.20 — "Si quieres que tu negocio vuele, deja de buscar qué más hacer. Empieza a decidir qué vas a ignorar."
// 26.11 — "La productividad no es hacer más cosas."
// 29.10 — "Es eliminar todo lo que no sea esencial..."
// 32.06 — "hasta que solo quede lo inevitable."
// 34.09 — [Firma]

export default function Dia7EliminacionRadical() {
  const canvasRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('Listo para reproducir');

  const animationFrameRef = useRef(null);
  const startTimeRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);
  const sceneRef = useRef(null);

  const FPS = 60;
  const DURATION = 38;

  // Phase boundaries
  const T1 = 1.12;   // 1B: "Nos dijeron..."
  const T2 = 4.08;   // 1C: "Más horas..."
  const T3 = 8.06;   // Phase 2: "Falso"
  const T4 = 13.16;  // Phase 3: "Una estatua..."
  const T5 = 18.20;  // Phase 4: "Si quieres..."
  const T6 = 32.06;  // Phase 5: "lo inevitable"
  const T7 = 34.09;  // Firma
  const T8 = 37.08;  // Hold

  const TOOL_DATA = [
    { label: 'HORAS',        appearAt: 0.05 },
    { label: 'ESTRATEGIAS',  appearAt: 0.18 },
    { label: 'HERRAMIENTAS', appearAt: 0.30 },
    { label: 'APPS',         appearAt: 0.42 },
    { label: 'EMAILS',       appearAt: 0.54 },
    { label: 'REUNIONES',    appearAt: 0.64 },
    { label: 'CURSOS',       appearAt: 0.74 },
    { label: 'TAREAS',       appearAt: 0.84 },
  ];

  const Easing = {
    easeInExpo:     (x) => x === 0 ? 0 : Math.pow(2, 10 * x - 10),
    easeOutExpo:    (x) => x === 1 ? 1 : 1 - Math.pow(2, -10 * x),
    easeOutBack:    (x) => { const c1 = 1.70158; const c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); },
    easeOutQuad:    (x) => 1 - (1 - x) * (1 - x),
    easeInOutQuad:  (x) => x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2,
    easeInQuart:    (x) => x * x * x * x,
    easeOutQuart:   (x) => 1 - Math.pow(1 - x, 4),
    easeInOutCubic: (x) => x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2,
    easeOutCubic:   (x) => 1 - Math.pow(1 - x, 3),
  };

  const drawHero = (ctx, x, y, radius, opacity, stretchX = 1, stretchY = 1, glowSize = 40, shake = 0) => {
    const sx = shake > 0 ? (Math.random() - 0.5) * shake : 0;
    const sy = shake > 0 ? (Math.random() - 0.5) * shake : 0;
    const hx = x + sx, hy = y + sy;

    ctx.save();
    ctx.globalAlpha = opacity * 0.28;
    const atmos = ctx.createRadialGradient(hx, hy, radius * 0.8, hx, hy, radius * 4.5);
    atmos.addColorStop(0, 'rgba(255,255,255,0.5)');
    atmos.addColorStop(0.4, 'rgba(255,255,255,0.12)');
    atmos.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = atmos;
    ctx.beginPath(); ctx.arc(hx, hy, radius * 4.5, 0, Math.PI * 2); ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.globalAlpha = opacity * 0.5;
    const edge = ctx.createRadialGradient(hx, hy, radius * 0.7, hx, hy, radius * 1.7);
    edge.addColorStop(0, 'rgba(255,255,255,0.6)');
    edge.addColorStop(0.5, 'rgba(255,255,255,0.2)');
    edge.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = edge;
    ctx.beginPath(); ctx.arc(hx, hy, radius * 1.7, 0, Math.PI * 2); ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.shadowBlur = glowSize;
    ctx.shadowColor = 'rgba(255,255,255,0.8)';
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(hx, hy, radius * stretchX, radius * stretchY, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.restore();
  };

  const drawGlow = (ctx, color, blur) => { ctx.shadowBlur = blur; ctx.shadowColor = color; };
  const resetGlow = (ctx) => { ctx.shadowBlur = 0; ctx.shadowColor = 'transparent'; };

  const drawPill = (ctx, cx, cy, text, opacity, scale = 1, struck = false, strikeP = 0) => {
    if (opacity <= 0) return;
    ctx.save();
    ctx.globalAlpha = Math.min(1, opacity);
    ctx.translate(cx, cy);
    ctx.scale(scale, scale);
    ctx.font = 'bold 28px Montserrat, sans-serif';
    const tw = ctx.measureText(text).width;
    const bw = tw + 44, bh = 54;
    ctx.fillStyle = 'rgba(255,255,255,0.09)';
    ctx.strokeStyle = 'rgba(255,255,255,0.35)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(-bw / 2, -bh / 2, bw, bh, 10);
    ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 0, 0);
    if (struck && strikeP > 0) {
      ctx.strokeStyle = 'rgba(255,60,60,0.95)';
      ctx.lineWidth = 3.5;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(-tw / 2 - 6, 0);
      ctx.lineTo(-tw / 2 - 6 + (tw + 12) * strikeP, 0);
      ctx.stroke();
    }
    ctx.restore();
  };

  const drawDiamond3D = (ctx, cx, scene, cubeSize, diamondY, cardOpacity) => {
    scene.diamond.angleX = 0.15;
    scene.diamond.angleY += 0.005;
    drawGlow(ctx, 'rgba(255,255,255,0.6)', 25);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    const proj = scene.diamond.vertices.map(v => {
      const x1 = v.x * Math.cos(scene.diamond.angleY) - v.z * Math.sin(scene.diamond.angleY);
      const z1 = v.x * Math.sin(scene.diamond.angleY) + v.z * Math.cos(scene.diamond.angleY);
      const y2 = v.y * Math.cos(scene.diamond.angleX) - z1 * Math.sin(scene.diamond.angleX);
      const z2 = v.y * Math.sin(scene.diamond.angleX) + z1 * Math.cos(scene.diamond.angleX);
      return { x: cx + x1 * cubeSize, y: diamondY + y2 * cubeSize, z: z2 };
    });
    scene.diamond.edges.forEach(e => {
      const p1 = proj[e[0]], p2 = proj[e[1]];
      const avgZ = (p1.z + p2.z) / 2;
      ctx.globalAlpha = cardOpacity * (0.5 + (avgZ + 1) * 0.25);
      ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y); ctx.stroke();
    });
    resetGlow(ctx);
  };

  const drawSignatureCard = (ctx, W, H, CENTER_X, CENTER_Y, cardOpacity, cardOffsetY, lightX, lightY, breathe, scene, frameCount) => {
    const cardWidth = 800, cardHeight = 1500;
    const cardX = CENTER_X - cardWidth / 2;
    const cardY = CENTER_Y - cardHeight / 2;

    // Backlights
    ctx.save();
    ctx.globalAlpha = cardOpacity * breathe;
    const bg = ctx.createRadialGradient(lightX, lightY, cardWidth * 0.15, lightX, lightY, cardWidth * 1.3);
    bg.addColorStop(0, 'rgba(220,216,208,1)');
    bg.addColorStop(0.15, 'rgba(190,186,178,0.85)');
    bg.addColorStop(0.3, 'rgba(155,151,144,0.6)');
    bg.addColorStop(0.5, 'rgba(110,107,102,0.3)');
    bg.addColorStop(0.7, 'rgba(65,63,58,0.1)');
    bg.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
    ctx.restore();

    ctx.save();
    ctx.globalAlpha = cardOpacity * breathe * 0.8;
    const bl = ctx.createRadialGradient(lightX - 180, lightY - 80, 0, lightX - 180, lightY - 80, cardHeight * 0.6);
    bl.addColorStop(0, 'rgba(230,226,218,0.95)');
    bl.addColorStop(0.15, 'rgba(190,186,178,0.7)');
    bl.addColorStop(0.35, 'rgba(140,137,130,0.35)');
    bl.addColorStop(0.6, 'rgba(80,77,72,0.1)');
    bl.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = bl; ctx.fillRect(0, 0, W, H);
    ctx.restore();

    ctx.save();
    ctx.globalAlpha = cardOpacity * breathe * 0.4;
    const br = ctx.createRadialGradient(cardX + cardWidth + 50, CENTER_Y + 100, 0, cardX + cardWidth + 50, CENTER_Y + 100, cardHeight * 0.5);
    br.addColorStop(0, 'rgba(200,196,188,0.7)');
    br.addColorStop(0.2, 'rgba(150,147,140,0.4)');
    br.addColorStop(0.5, 'rgba(90,87,82,0.12)');
    br.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = br; ctx.fillRect(0, 0, W, H);
    ctx.restore();

    ctx.save();
    ctx.globalAlpha = cardOpacity;
    ctx.translate(0, cardOffsetY);
    ctx.fillStyle = '#090909';
    ctx.fillRect(cardX, cardY, cardWidth, cardHeight);

    const edge = (grad, rx, ry, rw, rh) => { ctx.fillStyle = grad; ctx.fillRect(rx, ry, rw, rh); };
    const le = ctx.createLinearGradient(cardX - 1, 0, cardX + 4, 0);
    le.addColorStop(0, 'rgba(220,216,208,0.6)'); le.addColorStop(0.5, 'rgba(180,176,168,0.25)'); le.addColorStop(1, 'rgba(180,176,168,0)');
    edge(le, cardX - 1, cardY, 5, cardHeight);
    const te = ctx.createLinearGradient(0, cardY - 1, 0, cardY + 3);
    te.addColorStop(0, 'rgba(200,196,188,0.4)'); te.addColorStop(0.5, 'rgba(160,156,148,0.15)'); te.addColorStop(1, 'rgba(160,156,148,0)');
    edge(te, cardX, cardY - 1, cardWidth * 0.6, 4);
    const re2 = ctx.createLinearGradient(cardX + cardWidth + 1, 0, cardX + cardWidth - 3, 0);
    re2.addColorStop(0, 'rgba(170,166,158,0.2)'); re2.addColorStop(0.5, 'rgba(140,136,128,0.08)'); re2.addColorStop(1, 'rgba(140,136,128,0)');
    edge(re2, cardX + cardWidth - 3, cardY, 4, cardHeight);
    const be2 = ctx.createLinearGradient(0, cardY + cardHeight + 1, 0, cardY + cardHeight - 3);
    be2.addColorStop(0, 'rgba(170,166,158,0.2)'); be2.addColorStop(0.5, 'rgba(140,136,128,0.08)'); be2.addColorStop(1, 'rgba(140,136,128,0)');
    edge(be2, cardX, cardY + cardHeight - 3, cardWidth * 0.5, 4);

    ctx.globalAlpha = cardOpacity;
    ctx.font = 'bold 50px Montserrat, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('CREA TU', CENTER_X, CENTER_Y - 450);
    ctx.font = '900 88px Montserrat, sans-serif';
    ctx.fillText('ACTIVO', CENTER_X, CENTER_Y - 350);

    drawDiamond3D(ctx, CENTER_X, scene, 180, CENTER_Y - 80, cardOpacity);

    ctx.globalAlpha = cardOpacity;
    ctx.font = '600 20px Montserrat, sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    ctx.letterSpacing = '4px';
    ctx.fillText('ELIMINACIÓN RADICAL', CENTER_X, CENTER_Y + 280);
    ctx.letterSpacing = '0px';

    ctx.font = '900 64px Montserrat, sans-serif';
    ctx.fillStyle = '#ffffff';
    const nm = 'LUIS CABREJO';
    if (ctx.measureText(nm).width > cardWidth * 0.85) ctx.font = '900 56px Montserrat, sans-serif';
    ctx.fillText(nm, CENTER_X, CENTER_Y + 380);
    ctx.restore();
  };

  const update = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = canvas.width, H = canvas.height;
    const CENTER_X = W / 2, CENTER_Y = H / 2;

    const now = performance.now();
    if (startTimeRef.current === null) startTimeRef.current = now;
    const elapsed = (now - startTimeRef.current) / 1000;
    const time = Math.min(elapsed, DURATION);
    const frameCount = Math.floor(time * FPS);

    setProgress((time / DURATION) * 100);

    // ── SCENE INIT ────────────────────────────────────────────────
    if (!sceneRef.current) {
      const NUM_VERTS = 14;
      const stoneBasePoints = [];
      for (let i = 0; i < NUM_VERTS; i++) {
        const a = (Math.PI * 2 * i) / NUM_VERTS + (Math.random() - 0.5) * 0.25;
        stoneBasePoints.push({
          baseAngle: a,
          roughR: 205 + (Math.random() - 0.5) * 120,
          smoothR: 185,
        });
      }

      const tools = TOOL_DATA.map((td, i) => {
        const side = i % 4;
        let fx, fy;
        if (side === 0) { fx = Math.random() * W * 0.8 + W * 0.1; fy = -120; }
        else if (side === 1) { fx = W + 120; fy = H * 0.2 + Math.random() * H * 0.6; }
        else if (side === 2) { fx = Math.random() * W * 0.8 + W * 0.1; fy = H + 120; }
        else { fx = -120; fy = H * 0.2 + Math.random() * H * 0.6; }
        return {
          label: td.label,
          appearAt: td.appearAt,
          flyFromX: fx, flyFromY: fy,
          orbitAngle: (Math.PI * 2 * i) / TOOL_DATA.length + Math.PI / 8,
          orbitRadius: 230 + (i % 3) * 60,
          orbitSpeed: 0.35 + (i % 4) * 0.08,
          opacity: 0, scale: 0, flyProgress: 0,
          eliminated: false, elimProgress: 0, strikeP: 0,
        };
      });

      // Diamond geometry — flat crown, no apex
      const diamond = { angleX: 0, angleY: 0, vertices: [], edges: [] };
      const dv = diamond.vertices;
      for (let i = 0; i < 8; i++) {
        const a = (Math.PI * 2 * i) / 8;
        dv.push({ x: Math.cos(a) * 0.55, y: -0.35, z: Math.sin(a) * 0.55 });
      }
      for (let i = 0; i < 8; i++) {
        const a = (Math.PI * 2 * i) / 8;
        dv.push({ x: Math.cos(a) * 1.0, y: 0, z: Math.sin(a) * 1.0 });
      }
      dv.push({ x: 0, y: 1.6, z: 0 });
      const de = diamond.edges;
      for (let i = 0; i < 8; i++) de.push([i, (i + 1) % 8]);
      for (let i = 0; i < 8; i++) de.push([i, i + 8]);
      for (let i = 8; i < 16; i++) de.push([i, i === 15 ? 8 : i + 1]);
      for (let i = 8; i < 16; i++) de.push([i, 16]);
      for (let i = 8; i < 16; i++) de.push([i, ((i + 1) % 8) + 8]);

      sceneRef.current = {
        tools,
        stoneBasePoints,
        stoneChips: [], stoneChipCount: 0,
        stoneSmooth: 0, stoneOpacity: 0,
        diamond,
        heroNavX: CENTER_X, heroNavY: CENTER_Y,
        heroNavTX: CENTER_X, heroNavTY: CENTER_Y,
        heroNavTimer: 0,
      };
    }

    const scene = sceneRef.current;

    // ── CLEAR ────────────────────────────────────────────────────
    ctx.fillStyle = '#050505';
    ctx.fillRect(0, 0, W, H);

    // ================================================================
    // PHASE 1 (0-8.06s): "Nos han mentido... Más herramientas."
    // ================================================================
    if (time < T3) {
      const breathe = 1 + Math.sin(frameCount * 0.04) * 0.04;

      // ── 1A (0-1.12s): Hero aparece + typewriter ──────────────
      if (time < T1) {
        const t1A = time / T1;
        const heroOp = Easing.easeOutCubic(t1A);

        drawHero(ctx, CENTER_X, CENTER_Y, 52 * breathe, heroOp, 1, 1, 35);

        const txt = 'NOS HAN MENTIDO.';
        const chars = Math.floor(txt.length * Easing.easeOutCubic(t1A));
        ctx.save();
        ctx.globalAlpha = heroOp;
        ctx.font = 'bold 56px Montserrat, sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        drawGlow(ctx, 'rgba(255,255,255,0.3)', 18);
        ctx.fillText(txt.substring(0, chars), CENTER_X, CENTER_Y + 240);
        resetGlow(ctx);
        ctx.restore();

        setStatus('Fase 1: Nos han mentido');
      }

      // ── 1B (1.12-4.08s): "SUMAR" watermark + nodos ──────────
      else if (time < T2) {
        const t1B = (time - T1) / (T2 - T1);
        const wAlpha = Easing.easeOutQuad(t1B) * 0.10;

        // Watermark "SUMAR"
        ctx.save();
        ctx.globalAlpha = wAlpha;
        ctx.font = '900 310px Montserrat, sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('SUMAR', CENTER_X, CENTER_Y);
        ctx.restore();

        // Símbolos "+"
        ctx.save();
        ctx.globalAlpha = wAlpha * 4;
        ctx.font = '900 130px Montserrat, sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('+', CENTER_X - 380, CENTER_Y - 480);
        ctx.fillText('+', CENTER_X + 320, CENTER_Y + 350);
        ctx.fillText('+', CENTER_X + 380, CENTER_Y - 650);
        ctx.restore();

        // Texto subtítulo
        const subOp = Easing.easeOutCubic(Math.min(1, t1B * 3));
        ctx.save();
        ctx.globalAlpha = subOp * 0.8;
        ctx.font = '400 40px Montserrat, sans-serif';
        ctx.fillStyle = 'rgba(255,255,255,0.75)';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('nos dijeron que para crecer', CENTER_X, CENTER_Y + 220);
        ctx.fillText('hay que sumar.', CENTER_X, CENTER_Y + 270);
        ctx.restore();

        // 3 nodos orbitando al héroe
        for (let i = 0; i < 3; i++) {
          const nodeAngle = (Math.PI * 2 * i) / 3 + t1B * Math.PI * 1.2;
          const nodeR = 155 + i * 35;
          const nx = CENTER_X + Math.cos(nodeAngle) * nodeR;
          const ny = CENTER_Y + Math.sin(nodeAngle) * nodeR;
          const nodeOp = Easing.easeOutCubic(Math.min(1, t1B * 4)) * 0.55;
          ctx.save();
          ctx.globalAlpha = nodeOp;
          ctx.strokeStyle = 'rgba(255,255,255,0.4)';
          ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(CENTER_X, CENTER_Y); ctx.lineTo(nx, ny); ctx.stroke();
          ctx.fillStyle = '#ffffff';
          ctx.beginPath(); ctx.arc(nx, ny, 9, 0, Math.PI * 2); ctx.fill();
          ctx.restore();
        }

        drawHero(ctx, CENTER_X, CENTER_Y, 52 * breathe, 1, 1, 1, 42);
        setStatus('Fase 1: Para crecer hay que sumar');
      }

      // ── 1C (4.08-8.06s): Herramientas vuelan + héroe comprimido ─
      else {
        const t1C = (time - T2) / (T3 - T2); // 0-1
        const orbitSpeedMult = 1 + t1C * 2;

        // Actualizar y dibujar herramientas (detrás del héroe)
        scene.tools.forEach((tool, i) => {
          tool.orbitAngle += 0.007 * orbitSpeedMult * tool.orbitSpeed;
          const targetX = CENTER_X + Math.cos(tool.orbitAngle) * tool.orbitRadius;
          const targetY = CENTER_Y + Math.sin(tool.orbitAngle) * tool.orbitRadius;

          if (t1C >= tool.appearAt) {
            const localT = Math.min(1, (t1C - tool.appearAt) / 0.10);
            tool.flyProgress = Easing.easeOutBack(localT);
            tool.opacity = localT;
            tool.scale = 0.5 + localT * 0.5;
          }

          if (tool.flyProgress > 0) {
            const tx = tool.flyFromX + (targetX - tool.flyFromX) * tool.flyProgress;
            const ty = tool.flyFromY + (targetY - tool.flyFromY) * tool.flyProgress;
            drawPill(ctx, tx, ty, tool.label, tool.opacity * 0.85, tool.scale);
          }
        });

        // "MÁS..." en 3 pulsos
        const masTexts = ['MÁS HORAS.', 'MÁS ESTRATEGIAS.', 'MÁS HERRAMIENTAS.'];
        const masPositions = [
          { x: CENTER_X - 120, y: CENTER_Y - 460 },
          { x: CENTER_X + 80,  y: CENTER_Y + 480 },
          { x: CENTER_X,       y: CENTER_Y - 600 },
        ];
        const masPhase = t1C * 3;
        const masIdx = Math.min(2, Math.floor(masPhase));
        const masLocal = masPhase - masIdx;
        const masAlpha = masLocal < 0.12 ? masLocal / 0.12
          : masLocal > 0.65 ? Math.max(0, 1 - (masLocal - 0.65) / 0.35) : 1;

        if (masIdx < masTexts.length) {
          const mp = masPositions[masIdx];
          ctx.save();
          ctx.globalAlpha = masAlpha * 0.95;
          ctx.font = '900 62px Montserrat, sans-serif';
          ctx.fillStyle = '#ffffff';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          drawGlow(ctx, 'rgba(255,255,255,0.5)', 22);
          ctx.fillText(masTexts[masIdx], mp.x, mp.y);
          resetGlow(ctx);
          ctx.restore();
        }

        // Héroe se comprime bajo el peso
        const stretchX = 1 - t1C * 0.38;
        const stretchY = 1 + t1C * 0.42;
        const heroShake = t1C * 7;
        const heroGlow = 38 - t1C * 18;
        drawHero(ctx, CENTER_X, CENTER_Y, 52 * breathe, 1, stretchX, stretchY, heroGlow, heroShake);

        setStatus('Fase 1: Más horas, más herramientas...');
      }
    }

    // ================================================================
    // PHASE 2 (8.06-13.16s): "Falso. El éxito es una resta."
    // ================================================================
    else if (time < T4) {
      const t2 = (time - T3) / (T4 - T3); // 0-1

      const FREEZE_END  = 0.06;
      const SLAM_END    = 0.14;
      const EXPLODE_END = 0.24;
      const EQ1_START   = 0.34;
      const EQ2_START   = 0.56;

      // Camera shake
      let shakeX = 0, shakeY = 0;
      if (t2 >= FREEZE_END && t2 < SLAM_END + 0.06) {
        const shakeDecay = Math.max(0, 1 - (t2 - FREEZE_END) / 0.08);
        shakeX = (Math.random() - 0.5) * 20 * shakeDecay;
        shakeY = (Math.random() - 0.5) * 13 * shakeDecay;
      }
      ctx.save();
      ctx.translate(shakeX, shakeY);

      // Herramientas congeladas / explotando
      if (t2 < EXPLODE_END) {
        const explodeP = t2 < FREEZE_END ? 0 : Easing.easeOutExpo(Math.min(1, (t2 - FREEZE_END) / (EXPLODE_END - FREEZE_END)));
        scene.tools.forEach(tool => {
          if (tool.flyProgress <= 0) return;
          const orbitX = CENTER_X + Math.cos(tool.orbitAngle) * tool.orbitRadius;
          const orbitY = CENTER_Y + Math.sin(tool.orbitAngle) * tool.orbitRadius;
          const dx = orbitX - CENTER_X, dy = orbitY - CENTER_Y;
          const len = Math.sqrt(dx * dx + dy * dy) || 1;
          const ex = orbitX + (dx / len) * explodeP * 700;
          const ey = orbitY + (dy / len) * explodeP * 700;
          const tOp = Math.max(0, 1 - explodeP * 1.8);
          drawPill(ctx, ex, ey, tool.label, tOp * 0.85);
        });
      }

      // "FALSO" slam
      if (t2 >= FREEZE_END) {
        const slamT = Easing.easeOutBack(Math.min(1, (t2 - FREEZE_END) / (SLAM_END - FREEZE_END)));
        const falsoAlpha = t2 >= EQ1_START ? Math.max(0, 1 - (t2 - EQ1_START) / 0.12) : 1;
        ctx.save();
        ctx.globalAlpha = falsoAlpha;
        ctx.translate(CENTER_X, CENTER_Y - 160);
        ctx.scale(slamT, slamT);
        drawGlow(ctx, 'rgba(255,255,255,0.9)', 60 * slamT);
        ctx.font = '900 210px Montserrat, sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('FALSO', 0, 0);
        resetGlow(ctx);
        ctx.restore();
      }

      // Flash blanco en el impacto
      if (t2 >= FREEZE_END && t2 < SLAM_END) {
        const flashT = (t2 - FREEZE_END) / (SLAM_END - FREEZE_END);
        ctx.save();
        ctx.globalAlpha = Math.max(0, (1 - flashT * 3.5)) * 0.45;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, W, H);
        ctx.restore();
      }

      ctx.restore(); // fin camera shake

      // Héroe se calma
      if (t2 >= EXPLODE_END) {
        const heroT = Easing.easeOutCubic(Math.min(1, (t2 - EXPLODE_END) / 0.18));
        const breathe = 1 + Math.sin(frameCount * 0.03) * 0.04;
        drawHero(ctx, CENTER_X, CENTER_Y + 80, 56 * breathe, heroT, 1, 1, 50 + t2 * 25);

        // Anillos de meditación
        if (t2 >= 0.48) {
          const ringT = (t2 - 0.48) / 0.52;
          for (let r = 0; r < 3; r++) {
            const rPhase = (ringT + r * 0.33) % 1;
            const rR = rPhase * 280;
            const rAlpha = (1 - rPhase) * 0.28;
            ctx.save();
            ctx.globalAlpha = rAlpha;
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(CENTER_X, CENTER_Y + 80, rR, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
          }
        }
      }

      // Ecuación 1: "SUMA ≠ ÉXITO"
      if (t2 >= EQ1_START) {
        const e1T = Easing.easeOutCubic(Math.min(1, (t2 - EQ1_START) / 0.14));
        const e1Fade = t2 >= EQ2_START ? Math.max(0, 1 - (t2 - EQ2_START) / 0.18) : 1;
        ctx.save();
        ctx.globalAlpha = e1T * e1Fade;
        ctx.font = '900 80px Montserrat, sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        drawGlow(ctx, 'rgba(255,255,255,0.4)', 22);
        ctx.fillText('SUMA ≠ ÉXITO', CENTER_X, CENTER_Y - 420);
        resetGlow(ctx);
        ctx.restore();
      }

      // Ecuación 2: "ÉXITO = RESTA"
      if (t2 >= EQ2_START) {
        const e2T = Easing.easeOutBack(Math.min(1, (t2 - EQ2_START) / 0.18));
        ctx.save();
        ctx.globalAlpha = e2T;
        ctx.font = '900 80px Montserrat, sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        drawGlow(ctx, 'rgba(255,255,255,0.55)', 28);
        ctx.fillText('ÉXITO = RESTA', CENTER_X, CENTER_Y - 300);
        resetGlow(ctx);
        ctx.restore();
      }

      setStatus('Fase 2: FALSO — El Colapso');
    }

    // ================================================================
    // PHASE 3 (13.16-18.20s): "Una estatua... quitando lo que sobra"
    // ================================================================
    else if (time < T5) {
      const t3 = (time - T4) / (T5 - T4); // 0-1

      scene.stoneOpacity = Easing.easeOutCubic(Math.min(1, t3 / 0.12));
      scene.stoneSmooth  = Easing.easeInOutCubic(Math.min(1, t3 * 1.05));

      // Generar chips de cincel cada ~0.07 de t3
      const chipInterval = 0.07;
      const numChips = Math.floor(t3 / chipInterval);
      if (numChips > scene.stoneChipCount) {
        scene.stoneChipCount = numChips;
        const pts = scene.stoneBasePoints;
        const randPt = pts[numChips % pts.length];
        const r = randPt.roughR + (randPt.smoothR - randPt.roughR) * scene.stoneSmooth;
        const cx2 = CENTER_X + Math.cos(randPt.baseAngle) * r;
        const cy2 = CENTER_Y + Math.sin(randPt.baseAngle) * r;
        for (let j = 0; j < 7; j++) {
          const angle = randPt.baseAngle + (Math.random() - 0.5) * 1.8;
          const speed = 3.5 + Math.random() * 6;
          scene.stoneChips.push({
            x: cx2, y: cy2,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 1,
            size: 5 + Math.random() * 12,
            life: 1.0,
            decay: 0.013 + Math.random() * 0.018,
          });
        }
      }

      // Actualizar y dibujar chips
      scene.stoneChips.forEach(chip => {
        chip.x += chip.vx * 1.4;
        chip.y += chip.vy * 1.4;
        chip.vy += 0.18;
        chip.vx *= 0.97;
        chip.life -= chip.decay;
        if (chip.life > 0) {
          ctx.save();
          ctx.globalAlpha = Math.max(0, chip.life) * scene.stoneOpacity;
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.moveTo(chip.x, chip.y - chip.size / 2);
          ctx.lineTo(chip.x + chip.size / 3, chip.y + chip.size / 2);
          ctx.lineTo(chip.x - chip.size / 3, chip.y + chip.size / 2);
          ctx.closePath();
          ctx.fill();
          ctx.restore();
        }
      });

      // Dibujar polígono-piedra
      if (scene.stoneOpacity > 0) {
        const pts = scene.stoneBasePoints;
        ctx.save();
        ctx.globalAlpha = scene.stoneOpacity * (1 - scene.stoneSmooth * 0.72);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3;
        drawGlow(ctx, 'rgba(255,255,255,0.35)', 18);
        ctx.beginPath();
        pts.forEach((p, i) => {
          const r = p.roughR + (p.smoothR - p.roughR) * scene.stoneSmooth;
          const px = CENTER_X + Math.cos(p.baseAngle) * r;
          const py = CENTER_Y + Math.sin(p.baseAngle) * r;
          if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        });
        ctx.closePath();
        ctx.stroke();
        resetGlow(ctx);
        ctx.restore();

        // Flash en punto de impacto
        const flashPhase = (t3 % chipInterval) / chipInterval;
        if (flashPhase < 0.18 && numChips > 0) {
          const ip = scene.stoneBasePoints[numChips % scene.stoneBasePoints.length];
          const ir = ip.roughR + (ip.smoothR - ip.roughR) * scene.stoneSmooth;
          const ix = CENTER_X + Math.cos(ip.baseAngle) * ir;
          const iy = CENTER_Y + Math.sin(ip.baseAngle) * ir;
          ctx.save();
          ctx.globalAlpha = (1 - flashPhase / 0.18) * 0.65;
          const fg = ctx.createRadialGradient(ix, iy, 0, ix, iy, 70);
          fg.addColorStop(0, 'rgba(255,255,255,1)');
          fg.addColorStop(1, 'rgba(255,255,255,0)');
          ctx.fillStyle = fg;
          ctx.beginPath(); ctx.arc(ix, iy, 70, 0, Math.PI * 2); ctx.fill();
          ctx.restore();
        }
      }

      // Héroe emerge cuando la piedra se suaviza
      if (t3 >= 0.65) {
        const emergeT = Easing.easeOutCubic((t3 - 0.65) / 0.35);
        const breathe = 1 + Math.sin(frameCount * 0.04) * 0.04;
        drawHero(ctx, CENTER_X, CENTER_Y, 62 * breathe, emergeT, 1, 1, 40 + emergeT * 35);
      }

      // Texto subtítulo
      const subAlpha = t3 < 0.08 ? t3 / 0.08 : t3 > 0.88 ? Math.max(0, 1 - (t3 - 0.88) / 0.12) : 1;
      ctx.save();
      ctx.globalAlpha = subAlpha * 0.75;
      ctx.font = '400 36px Montserrat, sans-serif';
      ctx.fillStyle = 'rgba(255,255,255,0.8)';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('quitando lo que sobra de la piedra', CENTER_X, H - 220);
      ctx.restore();

      setStatus('Fase 3: La Estatua');
    }

    // ================================================================
    // PHASE 4 (18.20-32.06s): "Si quieres que vuele..."
    // ================================================================
    else if (time < T6) {
      const t4 = (time - T5) / (T6 - T5); // 0-1 over 13.86s

      // Boundaries dentro de fase 4
      const SUB_A_END = (26.11 - T5) / (T6 - T5); // ~0.573
      const SUB_B_END = (29.10 - T5) / (T6 - T5); // ~0.790
      const ELIM_START = 0.18; // start eliminating tools at t4=0.18

      // Héroe navega (drift suave)
      scene.heroNavTimer -= 0.016;
      if (scene.heroNavTimer <= 0) {
        scene.heroNavTX = CENTER_X + (Math.random() - 0.5) * 320;
        scene.heroNavTY = CENTER_Y + (Math.random() - 0.5) * 420;
        scene.heroNavTimer = 1.8 + Math.random() * 1.4;
      }
      scene.heroNavX += (scene.heroNavTX - scene.heroNavX) * 0.018;
      scene.heroNavY += (scene.heroNavTY - scene.heroNavY) * 0.018;

      const elimCount = scene.tools.filter(t => t.eliminated).length;
      const heroR = 58 + elimCount * 3.5;
      const heroGlow = 42 + elimCount * 6;
      const breathe = 1 + Math.sin(frameCount * 0.04) * 0.04;

      // Herramientas regresan y se eliminan
      const returnP = Math.min(1, t4 / 0.12);
      scene.tools.forEach((tool, i) => {
        tool.orbitAngle += 0.005;
        const orbitX = CENTER_X + Math.cos(tool.orbitAngle) * tool.orbitRadius;
        const orbitY = CENTER_Y + Math.sin(tool.orbitAngle) * tool.orbitRadius;

        // Tiempo de eliminación (una cada 0.88s)
        const elimTime = T5 + (T6 - T5) * ELIM_START + i * 0.88;
        if (time >= elimTime && !tool.eliminated) {
          tool.eliminated = true;
        }

        if (tool.eliminated) {
          tool.elimProgress = Math.min(1, tool.elimProgress + 0.018);
          tool.strikeP = Math.min(1, tool.strikeP + 0.04);
          const tOp = Math.max(0, 1 - tool.elimProgress * 1.4) * returnP;
          if (tOp > 0) drawPill(ctx, orbitX, orbitY, tool.label, tOp, 1, true, tool.strikeP);
        } else {
          drawPill(ctx, orbitX, orbitY, tool.label, 0.78 * returnP);
        }
      });

      // Héroe encima
      drawHero(ctx, scene.heroNavX, scene.heroNavY, heroR * breathe, 1, 1, 1, heroGlow);

      // Sub-fase B: "HACER MÁS" tachado
      if (t4 >= SUB_A_END) {
        const t4B = Math.min(1, (t4 - SUB_A_END) / (SUB_B_END - SUB_A_END));
        const showAlpha = Easing.easeOutCubic(Math.min(1, t4B * 6));
        const strikeT = Math.min(1, (t4 - SUB_A_END - 0.02) / 0.10);
        ctx.save();
        ctx.globalAlpha = showAlpha;
        ctx.font = '900 96px Montserrat, sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const hText = 'HACER MÁS';
        ctx.fillText(hText, CENTER_X, CENTER_Y - 460);
        if (strikeT > 0) {
          const tw = ctx.measureText(hText).width;
          ctx.strokeStyle = 'rgba(255,60,60,0.95)';
          ctx.lineWidth = 7;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(CENTER_X - tw / 2, CENTER_Y - 460);
          ctx.lineTo(CENTER_X - tw / 2 + tw * strikeT, CENTER_Y - 460);
          ctx.stroke();
        }
        ctx.restore();
      }

      // Sub-fase C: Contador
      if (t4 >= SUB_B_END) {
        const remaining = Math.max(0, scene.tools.length - elimCount);
        ctx.save();
        ctx.globalAlpha = 1;
        ctx.font = '900 240px Montserrat, sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        drawGlow(ctx, 'rgba(255,255,255,0.55)', 50);
        ctx.fillText(remaining.toString(), CENTER_X, CENTER_Y - 400);
        resetGlow(ctx);
        ctx.font = '400 38px Montserrat, sans-serif';
        ctx.fillStyle = 'rgba(255,255,255,0.55)';
        ctx.fillText('pendientes por eliminar', CENTER_X, CENTER_Y - 260);
        ctx.restore();
      }

      setStatus('Fase 4: Eliminando lo no esencial');
    }

    // ================================================================
    // PHASE 5 (32.06-34.09s): "...hasta que solo quede lo inevitable."
    // ================================================================
    else if (time < T7) {
      const t5 = (time - T6) / (T7 - T6); // 0-1

      const heroR = 60 + t5 * 35;
      const glowSize = 85 + t5 * 90;
      const breathe = 1 + Math.sin(frameCount * 0.05) * 0.03;
      drawHero(ctx, CENTER_X, CENTER_Y, heroR * breathe, 1, 1, 1, glowSize);

      // Anillos expansivos
      for (let r = 0; r < 4; r++) {
        const rPhase = (t5 * 1.6 + r * 0.25) % 1;
        const rR = rPhase * 560;
        const rAlpha = (1 - rPhase) * 0.38;
        ctx.save();
        ctx.globalAlpha = rAlpha;
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(CENTER_X, CENTER_Y, rR, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      // "LO INEVITABLE"
      if (t5 >= 0.28) {
        const textT = Easing.easeOutCubic(Math.min(1, (t5 - 0.28) / 0.28));
        const textFade = t5 >= 0.78 ? Math.max(0, 1 - (t5 - 0.78) / 0.22) : 1;
        ctx.save();
        ctx.globalAlpha = textT * textFade;
        ctx.font = '300 50px Montserrat, sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.letterSpacing = '8px';
        ctx.fillText('LO INEVITABLE', CENTER_X, CENTER_Y + 310);
        ctx.letterSpacing = '0px';
        ctx.restore();
      }

      // Fade to black
      if (t5 >= 0.72) {
        const fadeT = Easing.easeInQuart(Math.min(1, (t5 - 0.72) / 0.28));
        ctx.save();
        ctx.globalAlpha = fadeT;
        ctx.fillStyle = '#050505';
        ctx.fillRect(0, 0, W, H);
        ctx.restore();
      }

      setStatus('Fase 5: Lo inevitable');
    }

    // ================================================================
    // FIRMA (34.09-37.08s)
    // ================================================================
    else if (time < T8) {
      const t = (time - T7) / (T8 - T7);
      const slideP = Easing.easeOutQuart(Math.min(1, t / 0.10));
      const cardOpacity = slideP;
      const cardOffsetY = (1 - slideP) * 180;
      const lightTime = time - T7;
      const breathe = 0.93 + Math.sin(lightTime * 0.6) * 0.07;
      const lightX = CENTER_X + 220 - t * 480;
      const lightY = CENTER_Y + 420 - t * 520;
      drawSignatureCard(ctx, W, H, CENTER_X, CENTER_Y, cardOpacity, cardOffsetY, lightX, lightY, breathe, scene, frameCount);
      setStatus('Firma: Eliminación Radical');
    }

    // ================================================================
    // HOLD FINAL
    // ================================================================
    else {
      const breatheF = 0.93 + Math.sin((time - T8) * 0.6) * 0.07;
      const holdLX = CENTER_X - 260;
      const holdLY = CENTER_Y - 100;
      drawSignatureCard(ctx, W, H, CENTER_X, CENTER_Y, 1, 0, holdLX, holdLY, breatheF, scene, frameCount);
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
    if (startTimeRef.current === null) startTimeRef.current = performance.now();
    setIsPlaying(true);
    update();
  };

  const pause = () => {
    setIsPlaying(false);
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
  };

  const restart = () => {
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    startTimeRef.current = null;
    sceneRef.current = null;
    setProgress(0);
    setIsPlaying(false);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) { ctx.fillStyle = '#050505'; ctx.fillRect(0, 0, canvas.width, canvas.height); }
    }
    setStatus('Reiniciado');
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
    } catch {
      mediaRecorderRef.current = new MediaRecorder(stream);
    }
    mediaRecorderRef.current.ondataavailable = (e) => {
      if (e.data.size > 0) recordedChunksRef.current.push(e.data);
    };
    mediaRecorderRef.current.onstop = () => {
      const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'dia7-v4-eliminacion-radical-38s-60fps.webm';
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setIsRecording(false);
      setStatus('Grabación descargada');
    };
    mediaRecorderRef.current.start();
    setTimeout(() => {
      if (mediaRecorderRef.current?.state === 'recording') mediaRecorderRef.current.stop();
    }, DURATION * 1000 + 600);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;
    const CX = canvas.width / 2, CY = canvas.height / 2;
    ctx.fillStyle = '#050505';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = 'bold 52px Montserrat, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowBlur = 40; ctx.shadowColor = 'rgba(197,160,89,0.6)';
    ctx.fillText('Día 7 · v4', CX, CY - 90);
    ctx.shadowBlur = 0;
    ctx.font = '32px Montserrat, sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.fillText('Eliminación Radical', CX, CY + 10);
    ctx.font = '22px Montserrat, sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.fillText('Presiona ▶ Reproducir para comenzar', CX, CY + 100);
    return () => { if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current); };
  }, []);

  useEffect(() => {
    if (isPlaying) update();
  }, [isPlaying]);

  return (
    <div className="app">
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
            {isRecording ? '⬤ Grabando...' : '⬤ Grabar (38s)'}
          </button>
        </div>

        <div className="info" suppressHydrationWarning>
          <div className="status" suppressHydrationWarning>{status}</div>
          <div>Canvas 1080×1920 · 60 FPS · 38s · v4 Eliminación Radical</div>
        </div>
      </div>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600;700;900&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        .app {
          background: linear-gradient(135deg, #0a0a0f 0%, #1a1a1f 100%);
          display: flex; flex-direction: column; align-items: center;
          justify-content: center; min-height: 100vh;
          font-family: 'Montserrat', sans-serif; color: #fff; padding: 20px;
        }
        .container { display: flex; flex-direction: column; align-items: center; gap: 20px; max-width: 100%; }
        .canvas {
          background: #000; border-radius: 8px;
          box-shadow: 0 0 40px rgba(197,160,89,0.2), 0 0 80px rgba(197,160,89,0.1);
          max-height: 80vh; max-width: 100%; aspect-ratio: 9/16;
        }
        .progress-bar { width: 100%; max-width: 540px; height: 4px; background: rgba(255,255,255,0.1); border-radius: 2px; }
        .progress-fill { height: 100%; background: #C5A059; border-radius: 2px; transition: width 0.1s linear; }
        .controls { display: flex; gap: 12px; flex-wrap: wrap; justify-content: center; }
        button {
          padding: 14px 28px; font-size: 15px; font-weight: 700;
          background: rgba(255,255,255,0.08); color: #fff;
          border: 1px solid rgba(255,255,255,0.2); border-radius: 8px;
          cursor: pointer; font-family: 'Montserrat', sans-serif;
          transition: all 0.2s;
        }
        button:hover:not(:disabled) { background: rgba(197,160,89,0.2); border-color: #C5A059; }
        button:disabled { opacity: 0.4; cursor: not-allowed; }
        .info { text-align: center; font-size: 14px; color: rgba(255,255,255,0.5); line-height: 1.8; }
        .status { color: rgba(255,255,255,0.85); font-weight: 600; font-size: 15px; }
      `}</style>
    </div>
  );
}
