'use client';

import React, { useRef, useState, useEffect } from 'react';

export default function Dia7EliminacionRadical() {
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
  const DURATION = 26;
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
    easeOutCubic: (x) => 1 - Math.pow(1 - x, 3)
  };

  // Spark particles (same system as Day 6)
  class SparkParticle {
    x; y; vx; vy; life; size; angle;
    constructor(x, y, angle, speed) {
      this.x = x;
      this.y = y;
      this.angle = angle;
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed;
      this.life = 1.0;
      this.size = Math.random() * 4 + 1;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.vx *= 0.98;
      this.vy *= 0.98;
      this.life -= 0.02;
    }
    draw(ctx) {
      if (this.life <= 0) return;
      ctx.save();
      ctx.globalAlpha = this.life * 0.8;
      ctx.shadowBlur = 10;
      ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size * this.life, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

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

    const CENTER_X = canvas.width / 2;
    const CENTER_Y = canvas.height / 2;

    // Initialize scene state
    if (!sceneRef.current) {
      sceneRef.current = {
        hero: {
          x: CENTER_X,
          y: CENTER_Y,
          radius: 50,
          stretchX: 0.6,
          stretchY: 1.4,
          shake: 10,
          opacity: 1,
          glowSize: 20,
        },
        centralGear: {
          angle: 0,
          velocity: 0.02,
          radius: 160,
          teeth: 14,
          opacity: 1,
        },
        // 6 engranajes de la fábrica — los primeros 3 ya acoplados, 4-6 llegan con "Más..."
        machineGears: [
          { radius: 90,  teeth: 11, offsetAngle: 0,              opacity: 1, entered: true,  expelDist: 0 },
          { radius: 75,  teeth: 9,  offsetAngle: (2 * Math.PI) / 3, opacity: 1, entered: true,  expelDist: 0 },
          { radius: 65,  teeth: 8,  offsetAngle: (4 * Math.PI) / 3, opacity: 1, entered: true,  expelDist: 0 },
          { radius: 55,  teeth: 7,  offsetAngle: Math.PI / 3,       opacity: 0, entered: false, expelDist: 0 },
          { radius: 50,  teeth: 7,  offsetAngle: Math.PI,           opacity: 0, entered: false, expelDist: 0 },
          { radius: 45,  teeth: 6,  offsetAngle: (5 * Math.PI) / 3, opacity: 0, entered: false, expelDist: 0 },
        ],
        transformLine: {
          height: 0,
          opacity: 0,
          width: 4,
        },
        distractions: [],
        refPoints: [],
        sparks: [],
        // Diamante joyería para firma
        diamond: {
          angleX: 0, angleY: 0,
          vertices: [],
          edges: []
        }
      };

      // Initialize reference points for Phase 4 (ascent illusion)
      for (let i = 0; i < 12; i++) {
        sceneRef.current.refPoints.push({
          x: CENTER_X + (Math.random() - 0.5) * 300,
          y: (i / 12) * 1920,
          baseX: CENTER_X + (Math.random() - 0.5) * 300,
          speed: 0,
          size: 2 + Math.random() * 3,
          opacity: 0.12 + Math.random() * 0.15,
        });
      }

      // Jewelry diamond vertices (continuidad con Día 5 y 6)
      const dv = sceneRef.current.diamond.vertices;
      dv.push({x: 0, y: -0.55, z: 0}); // apex
      for (let i = 0; i < 8; i++) {
        const a = (Math.PI * 2 * i) / 8;
        dv.push({x: Math.cos(a) * 0.55, y: -0.35, z: Math.sin(a) * 0.55});
      }
      for (let i = 0; i < 8; i++) {
        const a = (Math.PI * 2 * i) / 8;
        dv.push({x: Math.cos(a) * 1.0, y: 0, z: Math.sin(a) * 1.0});
      }
      dv.push({x: 0, y: 1.6, z: 0}); // culet

      const de = sceneRef.current.diamond.edges;
      for (let i = 1; i <= 8; i++) de.push([0, i]);
      for (let i = 1; i <= 8; i++) de.push([i, i === 8 ? 1 : i + 1]);
      for (let i = 0; i < 8; i++) {
        de.push([i + 1, i + 9]);
        de.push([i + 1, ((i + 1) % 8) + 9]);
      }
      for (let i = 9; i <= 16; i++) de.push([i, i === 16 ? 9 : i + 1]);
      for (let i = 9; i <= 16; i++) de.push([i, 17]);
    }

    const scene = sceneRef.current;

    // Clear
    ctx.fillStyle = "#050505";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const drawGlow = (color, blur) => {
      ctx.shadowBlur = blur;
      ctx.shadowColor = color;
    };

    const resetGlow = () => {
      ctx.shadowBlur = 0;
      ctx.shadowColor = "transparent";
    };

    // === DRAW GEAR (identical to Day 6) ===
    const drawGear = (x, y, radius, teeth, angle, opacity, glowIntensity, lineW = 4) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.globalAlpha = opacity;

      drawGlow("rgba(255, 255, 255, " + Math.min(1, glowIntensity) + ")", 15 + glowIntensity * 40);
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = lineW;
      ctx.lineJoin = "round";

      ctx.beginPath();
      const toothDepth = radius * 0.12;
      const toothWidth = Math.PI / teeth;
      for (let i = 0; i < teeth; i++) {
        const baseAngle = (Math.PI * 2 * i) / teeth;
        const a1 = baseAngle - toothWidth * 0.4;
        const a2 = baseAngle + toothWidth * 0.4;
        const a3 = baseAngle + toothWidth * 0.6;
        const a4 = baseAngle + (Math.PI * 2 / teeth) - toothWidth * 0.6;
        const outerR = radius + toothDepth;
        const innerR = radius - toothDepth;
        if (i === 0) ctx.moveTo(Math.cos(a1) * outerR, Math.sin(a1) * outerR);
        ctx.lineTo(Math.cos(a2) * outerR, Math.sin(a2) * outerR);
        ctx.lineTo(Math.cos(a3) * innerR, Math.sin(a3) * innerR);
        ctx.lineTo(Math.cos(a4) * innerR, Math.sin(a4) * innerR);
        const nextBase = (Math.PI * 2 * (i + 1)) / teeth;
        ctx.lineTo(Math.cos(nextBase - toothWidth * 0.4) * outerR, Math.sin(nextBase - toothWidth * 0.4) * outerR);
      }
      ctx.closePath();
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(0, 0, radius * 0.25, 0, Math.PI * 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(0, 0, radius * 0.55, 0, Math.PI * 2);
      ctx.stroke();

      for (let i = 0; i < 4; i++) {
        const spokeAngle = (Math.PI * 2 * i) / 4;
        ctx.beginPath();
        ctx.moveTo(Math.cos(spokeAngle) * radius * 0.25, Math.sin(spokeAngle) * radius * 0.25);
        ctx.lineTo(Math.cos(spokeAngle) * radius * 0.55, Math.sin(spokeAngle) * radius * 0.55);
        ctx.stroke();
      }

      resetGlow();
      ctx.restore();
    };

    // === DRAW HERO (Dan Koe 3-layer, identical to Day 6) ===
    const drawHero = (x, y, radius, opacity, stretchX, stretchY, glowSize, shake) => {
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

    // Helper: calculate gear world position
    const getGearPos = (g) => {
      const dist = scene.centralGear.radius + g.radius - 8;
      return {
        x: CENTER_X + Math.cos(g.offsetAngle) * dist + (g.expelDist > 0 ? Math.cos(g.offsetAngle) * g.expelDist : 0),
        y: CENTER_Y + Math.sin(g.offsetAngle) * dist + (g.expelDist > 0 ? Math.sin(g.offsetAngle) * g.expelDist : 0),
      };
    };

    // ============================================================
    // FASE 1 (0-5s): LA FÁBRICA DEL RUIDO
    // "Nos han mentido. Nos dijeron que para crecer hay que sumar.
    //  Más horas. Más estrategias. Más herramientas."
    // ============================================================
    if (time < 5) {
      const t = time / 5;

      // Central gear: starts slow, accelerates with each new gear
      scene.centralGear.angle += scene.centralGear.velocity;

      // Gear entry schedule: first 3 already present, 4-6 enter with "Más..."
      const entryTimes = [0, 0, 0, 0.60, 0.74, 0.88]; // t values for entry
      let activeCount = 3;
      for (let i = 3; i < 6; i++) {
        if (t >= entryTimes[i]) {
          const g = scene.machineGears[i];
          if (!g.entered) {
            g.entered = true;
            // Speed up the machine with each addition
            scene.centralGear.velocity *= 1.25;
          }
          const enterT = Math.min(1, (t - entryTimes[i]) / 0.12);
          g.opacity = Easing.easeOutBack(enterT);
          activeCount++;
        }
      }

      // Speed factor for visual intensity
      const speedFactor = 0.15 + t * 0.45;

      // Draw all gears
      // Central gear
      drawGear(CENTER_X, CENTER_Y, scene.centralGear.radius, scene.centralGear.teeth,
        scene.centralGear.angle, 1, speedFactor, 5);

      // Secondary gears (connected, counter-rotating)
      scene.machineGears.forEach(g => {
        if (!g.entered || g.opacity <= 0) return;
        g.angle = -scene.centralGear.angle * (scene.centralGear.radius / g.radius);
        const pos = getGearPos(g);
        drawGear(pos.x, pos.y, g.radius, g.teeth, g.angle, g.opacity, speedFactor * 0.7, 3);

        // Sparks at contact points
        if (g.opacity > 0.5 && Math.random() < speedFactor * 0.25) {
          const contactX = CENTER_X + Math.cos(g.offsetAngle) * scene.centralGear.radius;
          const contactY = CENTER_Y + Math.sin(g.offsetAngle) * scene.centralGear.radius;
          scene.sparks.push(new SparkParticle(contactX, contactY,
            g.offsetAngle + (Math.random() - 0.5) * Math.PI, 2 + Math.random() * 4));
        }
      });

      // HERO: trapped at center, compressed by the machine
      const strainPulse = Math.sin(frameCount * 0.15) * 0.05;
      scene.hero.stretchX = 0.6 + strainPulse;
      scene.hero.stretchY = 1.4 - strainPulse;
      scene.hero.shake = 8 + t * 4; // vibration increases as machine speeds up
      scene.hero.glowSize = 18 + t * 5; // dim glow — low energy

      drawHero(CENTER_X, CENTER_Y, scene.hero.radius, 1,
        scene.hero.stretchX, scene.hero.stretchY, scene.hero.glowSize, scene.hero.shake);

      // Sparks
      scene.sparks = scene.sparks.filter(s => s.life > 0);
      scene.sparks.forEach(s => { s.update(); s.draw(ctx); });

      setStatus("Fase 1: La Fábrica del Ruido");
    }
    // ============================================================
    // FASE 2 (5-8s): "FALSO" — EL COLAPSO
    // "Falso. El éxito no es una suma... es una resta."
    // ============================================================
    else if (time < 8) {
      const t = (time - 5) / 3;

      // Sub-phases within the collapse
      const FREEZE_END = 0.10;   // 5.0-5.3s: everything freezes
      const SHAKE_END = 0.17;    // 5.3-5.5s: camera shake on "Falso"
      const EXPEL_END = 0.83;    // 5.5-7.5s: centrifugal explosion

      // Camera shake
      let shakeX = 0, shakeY = 0;
      if (t > FREEZE_END && t < SHAKE_END + 0.15) {
        const shakeIntensity = Math.max(0, 1 - ((t - SHAKE_END) / 0.15));
        shakeX = Math.sin(frameCount * 1.5) * 10 * shakeIntensity;
        shakeY = Math.cos(frameCount * 2.1) * 7 * shakeIntensity;
      }

      ctx.save();
      ctx.translate(shakeX, shakeY);

      // During freeze: everything stops
      if (t < FREEZE_END) {
        // Draw frozen machine (don't update angles)
      } else {
        // After freeze: update central gear (decelerating)
        scene.centralGear.velocity *= 0.96;
        scene.centralGear.angle += scene.centralGear.velocity;
      }

      // Expulsion of secondary gears
      if (t >= SHAKE_END) {
        const expelT = Math.min(1, (t - SHAKE_END) / (EXPEL_END - SHAKE_END));
        const expelEased = Easing.easeOutExpo(expelT);

        scene.machineGears.forEach((g, i) => {
          if (!g.entered) return;
          g.expelDist = expelEased * (600 + i * 80); // fly out progressively further
          g.opacity = Math.max(0, 1 - expelT * 1.3); // fade out faster than movement

          // Spawn burst sparks at the moment of separation
          if (expelT < 0.05 && g.opacity > 0.5) {
            for (let s = 0; s < 5; s++) {
              const contactX = CENTER_X + Math.cos(g.offsetAngle) * scene.centralGear.radius;
              const contactY = CENTER_Y + Math.sin(g.offsetAngle) * scene.centralGear.radius;
              scene.sparks.push(new SparkParticle(contactX, contactY,
                g.offsetAngle + (Math.random() - 0.5) * 1.2, 4 + Math.random() * 8));
            }
          }
        });
      }

      // Draw central gear (still present but decelerating)
      const centralOpacity = t < 0.5 ? 1 : Math.max(0.3, 1 - (t - 0.5) * 0.5);
      drawGear(CENTER_X, CENTER_Y, scene.centralGear.radius, scene.centralGear.teeth,
        scene.centralGear.angle, centralOpacity, 0.2, 4);

      // Draw expelled secondary gears
      scene.machineGears.forEach(g => {
        if (!g.entered || g.opacity <= 0.01) return;
        g.angle = -scene.centralGear.angle * (scene.centralGear.radius / g.radius);
        const pos = getGearPos(g);
        drawGear(pos.x, pos.y, g.radius, g.teeth, g.angle, g.opacity, 0.1, 3);
      });

      // HERO: LIBERATION
      // Hero springs back to natural shape
      const liberationT = Math.min(1, Math.max(0, (t - FREEZE_END) / 0.4));
      const libEased = Easing.easeOutBack(liberationT);
      const heroStretchX = 0.6 + 0.4 * libEased; // 0.6 → 1.0
      const heroStretchY = 1.4 - 0.4 * libEased; // 1.4 → 1.0
      const heroShake = 10 * (1 - liberationT); // vibration fades
      const heroGlow = 20 + 30 * libEased; // glow grows as freed

      // Brief expansion pulse at liberation
      const pulseT = Math.min(1, Math.max(0, (t - 0.15) / 0.25));
      const pulse = pulseT < 1 ? 1 + Math.sin(pulseT * Math.PI) * 0.25 : 1;

      drawHero(CENTER_X, CENTER_Y, scene.hero.radius * pulse, 1,
        heroStretchX, heroStretchY, heroGlow, heroShake);

      ctx.restore(); // end camera shake

      // Sparks (outside shake context so they're stable)
      scene.sparks = scene.sparks.filter(s => s.life > 0);
      scene.sparks.forEach(s => { s.update(); s.draw(ctx); });

      setStatus(t < FREEZE_END ? "..." : t < SHAKE_END ? "FALSO." : "Fase 2: El Colapso");
    }
    // ============================================================
    // FASE 3 (8-12s): LA TRANSFORMACIÓN
    // "Una estatua no se crea añadiendo arcilla,
    //  sino quitando lo que sobra de la piedra."
    // ============================================================
    else if (time < 12) {
      const t = (time - 8) / 4;

      // Central gear fades out
      const gearFade = 1 - Easing.easeInQuart(Math.min(1, t / 0.35));
      scene.centralGear.angle += scene.centralGear.velocity;
      scene.centralGear.velocity *= 0.97; // still decelerating

      if (gearFade > 0.01) {
        drawGear(CENTER_X, CENTER_Y, scene.centralGear.radius, scene.centralGear.teeth,
          scene.centralGear.angle, gearFade, 0.1, 3);
      }

      // VERTICAL LINE grows from center
      const lineGrowStart = 0.12;
      const lineGrowEnd = 0.85;
      if (t >= lineGrowStart) {
        const lineT = Math.min(1, (t - lineGrowStart) / (lineGrowEnd - lineGrowStart));
        const lineEased = Easing.easeOutCubic(lineT);
        const lineHeight = 1400 * lineEased;
        const lineOpacity = Math.min(1, lineT / 0.3);

        ctx.save();
        ctx.globalAlpha = lineOpacity;
        drawGlow("rgba(255, 255, 255, 0.5)", 15);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3.5;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(CENTER_X, CENTER_Y + lineHeight / 2);
        ctx.lineTo(CENTER_X, CENTER_Y - lineHeight / 2);
        ctx.stroke();
        resetGlow();
        ctx.restore();

        // Store for later phases
        scene.transformLine.height = lineHeight;
        scene.transformLine.opacity = lineOpacity;
      }

      // HERO rises to the top of the line
      const heroMoveStart = 0.25;
      if (t >= heroMoveStart) {
        const moveT = Math.min(1, (t - heroMoveStart) / 0.65);
        const moveEased = Easing.easeInOutCubic(moveT);
        const lineTop = CENTER_Y - scene.transformLine.height / 2;
        scene.hero.y = CENTER_Y + (lineTop + scene.hero.radius + 25 - CENTER_Y) * moveEased;
      } else {
        scene.hero.y = CENTER_Y;
      }

      // Hero: growing glow, breathing, serene
      const breathe = 1 + Math.sin(frameCount * 0.04) * 0.04;
      const heroGlow = 50 + t * 20;

      drawHero(CENTER_X, scene.hero.y, scene.hero.radius * breathe, 1, 1, 1, heroGlow, 0);

      setStatus("Fase 3: La Transformación");
    }
    // ============================================================
    // FASE 4 (12-17s): EL ASCENSO SIN FRICCIÓN
    // "Si quieres que tu negocio vuele, deja de buscar qué más hacer.
    //  Empieza a decidir qué vas a ignorar."
    // "La productividad no es hacer más cosas.
    //  Es eliminar todo lo que no sea esencial..."
    // ============================================================
    else if (time < 17) {
      const t = (time - 12) / 5;

      // The vertical line stays full height
      const lineHeight = 1400;
      ctx.save();
      ctx.globalAlpha = 0.85;
      drawGlow("rgba(255, 255, 255, 0.4)", 12);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(CENTER_X, CENTER_Y + lineHeight / 2);
      ctx.lineTo(CENTER_X, CENTER_Y - lineHeight / 2);
      ctx.stroke();
      resetGlow();
      ctx.restore();

      // REFERENCE POINTS — move downward to create illusion of upward travel
      const speed = 150 + t * 700; // accelerating
      scene.refPoints.forEach(p => {
        p.y += speed / FPS;
        // Wrap around when off screen
        if (p.y > 1920 + 20) {
          p.y = -20;
          p.x = CENTER_X + (Math.random() - 0.5) * 400;
          p.opacity = 0.10 + Math.random() * 0.18;
          p.size = 2 + Math.random() * 3;
        }
      });

      // Draw reference points (dots streaming downward)
      scene.refPoints.forEach(p => {
        // Don't draw too close to center line (hero's path)
        const distFromCenter = Math.abs(p.x - CENTER_X);
        if (distFromCenter < 60) return;

        ctx.save();
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        // At high speed, draw as streaks
        if (speed > 400) {
          const streakLen = Math.min(40, speed / 20);
          ctx.fillRect(p.x - p.size * 0.5, p.y, p.size, streakLen);
        } else {
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      });

      // SPEED LINES (thin vertical lines at edges, pulsing)
      ctx.save();
      const speedLineAlpha = 0.08 + t * 0.20;
      ctx.globalAlpha = speedLineAlpha;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      for (let i = 0; i < 8; i++) {
        const lx = 60 + (i / 8) * 200 + Math.sin(frameCount * 0.03 + i) * 15;
        const lx2 = canvas.width - 60 - (i / 8) * 200 + Math.sin(frameCount * 0.03 + i + 3) * 15;
        const ly = Math.sin(frameCount * 0.05 + i * 0.7) * 100;
        ctx.beginPath();
        ctx.moveTo(lx, ly);
        ctx.lineTo(lx, ly + 400 + t * 600);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(lx2, ly + 100);
        ctx.lineTo(lx2, ly + 500 + t * 600);
        ctx.stroke();
      }
      ctx.restore();

      // DISTRACTIONS — geometric fragments that approach center and disintegrate
      // Spawn every ~0.8s
      if (frameCount % 48 === 0 && t < 0.85) {
        const side = scene.distractions.length % 2 === 0 ? -1 : 1;
        scene.distractions.push({
          x: CENTER_X + side * (350 + Math.random() * 100),
          y: CENTER_Y - 300 + Math.random() * 600,
          vx: -side * (1.8 + Math.random() * 1.2),
          vy: (Math.random() - 0.5) * 0.5,
          size: 16 + Math.random() * 18,
          opacity: 0.55,
          type: Math.floor(Math.random() * 3), // 0=rect, 1=circle, 2=triangle
        });
      }

      // Update & draw distractions
      scene.distractions = scene.distractions.filter(d => d.opacity > 0.01);
      scene.distractions.forEach(d => {
        d.x += d.vx;
        d.y += d.vy;

        // Disintegrate as they approach center
        const distFromCenter = Math.abs(d.x - CENTER_X);
        if (distFromCenter < 160) {
          d.opacity *= 0.92; // rapid fade
          d.size *= 0.97; // shrink
        }

        ctx.save();
        ctx.globalAlpha = d.opacity;
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;

        if (d.type === 0) {
          // Rectangle (notification)
          ctx.strokeRect(d.x - d.size / 2, d.y - d.size / 3, d.size, d.size * 0.66);
        } else if (d.type === 1) {
          // Circle (bubble)
          ctx.beginPath();
          ctx.arc(d.x, d.y, d.size / 2, 0, Math.PI * 2);
          ctx.stroke();
        } else {
          // Triangle (warning)
          ctx.beginPath();
          ctx.moveTo(d.x, d.y - d.size / 2);
          ctx.lineTo(d.x + d.size / 2, d.y + d.size / 2);
          ctx.lineTo(d.x - d.size / 2, d.y + d.size / 2);
          ctx.closePath();
          ctx.stroke();
        }
        ctx.restore();
      });

      // HERO: at top of line, motion blur trail below
      const heroY = CENTER_Y - lineHeight / 2 + scene.hero.radius + 25;
      scene.hero.y = heroY;
      const heroGlow = 70 + t * 20;

      // Motion blur (ghost copies below hero)
      for (let g = 3; g >= 1; g--) {
        const ghostY = heroY + g * 35;
        const ghostOpacity = 0.18 / g;
        drawHero(CENTER_X, ghostY, scene.hero.radius * (1 - g * 0.08), ghostOpacity, 1, 1, heroGlow * 0.5, 0);
      }

      // Main hero
      const breathe = 1 + Math.sin(frameCount * 0.04) * 0.03;
      drawHero(CENTER_X, heroY, scene.hero.radius * breathe, 1, 1, 1, heroGlow, 0);

      setStatus("Fase 4: El Ascenso");
    }
    // ============================================================
    // FASE 5 (17-20s): "LO INEVITABLE" + TRANSICIÓN
    // "...hasta que solo quede lo inevitable."
    // ============================================================
    else if (time < 20) {
      const t = (time - 17) / 3;

      const lineHeight = 1400;
      const heroY = CENTER_Y - lineHeight / 2 + scene.hero.radius + 25;

      // Sub-phases: climax (0-0.67) and fade (0.67-1.0)
      if (t < 0.67) {
        const climbT = t / 0.67;

        // Line still visible
        ctx.save();
        ctx.globalAlpha = 0.75;
        drawGlow("rgba(255, 255, 255, 0.5)", 15 + climbT * 20);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3 + climbT * 2;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(CENTER_X, CENTER_Y + lineHeight / 2);
        ctx.lineTo(CENTER_X, CENTER_Y - lineHeight / 2);
        ctx.stroke();
        resetGlow();
        ctx.restore();

        // Speed lines intensify
        ctx.save();
        ctx.globalAlpha = 0.25 + climbT * 0.35;
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1 + climbT;
        for (let i = 0; i < 12; i++) {
          const lx = 40 + (i / 12) * 250 + Math.sin(frameCount * 0.04 + i) * 20;
          const lx2 = canvas.width - 40 - (i / 12) * 250 + Math.sin(frameCount * 0.04 + i + 3) * 20;
          ctx.beginPath();
          ctx.moveTo(lx, 0);
          ctx.lineTo(lx, canvas.height);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(lx2, 0);
          ctx.lineTo(lx2, canvas.height);
          ctx.stroke();
        }
        ctx.restore();

        // Reference points as fast streaks
        scene.refPoints.forEach(p => {
          p.y += 1200 / FPS;
          if (p.y > 1920 + 20) {
            p.y = -20;
            p.x = CENTER_X + (Math.random() - 0.5) * 500;
          }
          const distFromCenter = Math.abs(p.x - CENTER_X);
          if (distFromCenter < 60) return;
          ctx.save();
          ctx.globalAlpha = 0.18;
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(p.x - 1, p.y, 2, 60);
          ctx.restore();
        });

        // CONCENTRIC RINGS (callback to Day 6 Momentum)
        const blast = Easing.easeOutExpo(climbT);
        for (let r = 0; r < 4; r++) {
          const ringDelay = r * 0.22;
          const ringT = Math.max(0, climbT - ringDelay);
          if (ringT <= 0) continue;
          const ringRadius = 300 * Math.min(1, ringT / (1 - ringDelay));
          const ringOpacity = (1 - Math.min(1, ringT / (1 - ringDelay))) * (0.7 - r * 0.15);
          if (ringOpacity <= 0.01) continue;
          ctx.save();
          ctx.globalAlpha = ringOpacity;
          drawGlow("rgba(255, 255, 255, 0.8)", 25 - r * 4);
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = Math.max(1, 4 - r);
          ctx.beginPath();
          ctx.arc(CENTER_X, heroY, ringRadius, 0, Math.PI * 2);
          ctx.stroke();
          resetGlow();
          ctx.restore();
        }

        // HERO: maximum luminosity
        const heroExpand = 1 + blast * 0.45;
        const heroGlowMax = 90 + blast * 50;
        drawHero(CENTER_X, heroY, scene.hero.radius * heroExpand, 1, 1, 1, heroGlowMax, 0);

        setStatus("✦ LO INEVITABLE ✦");
      }
      // FADE TO BLACK (19-20s)
      else {
        const fadeT = (t - 0.67) / 0.33;
        const eased = Easing.easeInOutQuad(fadeT);

        // Hero fades
        const heroOpacity = 1 - eased;
        if (heroOpacity > 0.01) {
          // Line fades
          ctx.save();
          ctx.globalAlpha = 0.6 * heroOpacity;
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 3;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(CENTER_X, CENTER_Y + lineHeight / 2);
          ctx.lineTo(CENTER_X, CENTER_Y - lineHeight / 2);
          ctx.stroke();
          ctx.restore();

          drawHero(CENTER_X, heroY, scene.hero.radius * 1.3, heroOpacity, 1, 1, 100, 0);
        }

        // Black overlay
        ctx.save();
        ctx.globalAlpha = eased;
        ctx.fillStyle = "#050505";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.restore();

        setStatus("Transición a firma...");
      }
    }
    // ============================================================
    // FASE 6 (20-26s): FIRMA + DIAMANTE (Dan Koe backlight)
    // Idéntica al Día 6, subtítulo: "ELIMINACIÓN RADICAL"
    // ============================================================
    else if (time >= 20 && time < 25) {
      const t = (time - 20) / 5;

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

      // Capa 1: Gran resplandor central
      ctx.save();
      ctx.globalAlpha = cardOpacity * fadeIn * breathe;
      const bigGlow = ctx.createRadialGradient(
        lightX, lightY, cardWidth * 0.15,
        lightX, lightY, cardWidth * 1.3);
      bigGlow.addColorStop(0, 'rgba(220, 216, 208, 1)');
      bigGlow.addColorStop(0.15, 'rgba(190, 186, 178, 0.85)');
      bigGlow.addColorStop(0.3, 'rgba(155, 151, 144, 0.6)');
      bigGlow.addColorStop(0.5, 'rgba(110, 107, 102, 0.3)');
      bigGlow.addColorStop(0.7, 'rgba(65, 63, 58, 0.1)');
      bigGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = bigGlow;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.restore();

      // Capa 2: Luz secundaria
      ctx.save();
      ctx.globalAlpha = cardOpacity * fadeIn * breathe * 0.8;
      const leftLight = ctx.createRadialGradient(
        lightX - 180, lightY - 80, 0,
        lightX - 180, lightY - 80, cardHeight * 0.6);
      leftLight.addColorStop(0, 'rgba(230, 226, 218, 0.95)');
      leftLight.addColorStop(0.15, 'rgba(190, 186, 178, 0.7)');
      leftLight.addColorStop(0.35, 'rgba(140, 137, 130, 0.35)');
      leftLight.addColorStop(0.6, 'rgba(80, 77, 72, 0.1)');
      leftLight.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = leftLight;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.restore();

      // Capa 3: Rebote derecho
      ctx.save();
      ctx.globalAlpha = cardOpacity * fadeIn * breathe * 0.4;
      const rightLight = ctx.createRadialGradient(
        cardX + cardWidth + 50, CENTER_Y + 100, 0,
        cardX + cardWidth + 50, CENTER_Y + 100, cardHeight * 0.5);
      rightLight.addColorStop(0, 'rgba(200, 196, 188, 0.7)');
      rightLight.addColorStop(0.2, 'rgba(150, 147, 140, 0.4)');
      rightLight.addColorStop(0.5, 'rgba(90, 87, 82, 0.12)');
      rightLight.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = rightLight;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.restore();

      // Tarjeta
      ctx.save();
      ctx.globalAlpha = cardOpacity;
      ctx.translate(0, cardOffsetY);

      ctx.fillStyle = "#090909";
      ctx.fillRect(cardX, cardY, cardWidth, cardHeight);

      // Bordes iluminados
      const leftEdgeGrad = ctx.createLinearGradient(cardX - 1, 0, cardX + 4, 0);
      leftEdgeGrad.addColorStop(0, 'rgba(220, 216, 208, 0.6)');
      leftEdgeGrad.addColorStop(0.5, 'rgba(180, 176, 168, 0.25)');
      leftEdgeGrad.addColorStop(1, 'rgba(180, 176, 168, 0)');
      ctx.fillStyle = leftEdgeGrad;
      ctx.fillRect(cardX - 1, cardY, 5, cardHeight);

      const topEdgeGrad = ctx.createLinearGradient(0, cardY - 1, 0, cardY + 3);
      topEdgeGrad.addColorStop(0, 'rgba(200, 196, 188, 0.4)');
      topEdgeGrad.addColorStop(0.5, 'rgba(160, 156, 148, 0.15)');
      topEdgeGrad.addColorStop(1, 'rgba(160, 156, 148, 0)');
      ctx.fillStyle = topEdgeGrad;
      ctx.fillRect(cardX, cardY - 1, cardWidth * 0.6, 4);

      const rightEdgeGrad = ctx.createLinearGradient(cardX + cardWidth + 1, 0, cardX + cardWidth - 3, 0);
      rightEdgeGrad.addColorStop(0, 'rgba(170, 166, 158, 0.2)');
      rightEdgeGrad.addColorStop(0.5, 'rgba(140, 136, 128, 0.08)');
      rightEdgeGrad.addColorStop(1, 'rgba(140, 136, 128, 0)');
      ctx.fillStyle = rightEdgeGrad;
      ctx.fillRect(cardX + cardWidth - 3, cardY, 4, cardHeight);

      const bottomEdgeGrad = ctx.createLinearGradient(0, cardY + cardHeight + 1, 0, cardY + cardHeight - 3);
      bottomEdgeGrad.addColorStop(0, 'rgba(170, 166, 158, 0.2)');
      bottomEdgeGrad.addColorStop(0.5, 'rgba(140, 136, 128, 0.08)');
      bottomEdgeGrad.addColorStop(1, 'rgba(140, 136, 128, 0)');
      ctx.fillStyle = bottomEdgeGrad;
      ctx.fillRect(cardX, cardY + cardHeight - 3, cardWidth * 0.5, 4);

      // Texto superior
      ctx.font = "bold 50px Montserrat, sans-serif";
      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("CREA TU", CENTER_X, CENTER_Y - 450);
      ctx.font = "900 88px Montserrat, sans-serif";
      ctx.fillText("ACTIVO", CENTER_X, CENTER_Y - 350);

      // DIAMANTE JOYERÍA
      const cubeSize = 120;
      const diamondY = CENTER_Y - 80;
      scene.diamond.angleX = 0.15;
      scene.diamond.angleY += 0.005;

      drawGlow("rgba(255, 255, 255, 0.6)", 25 + Math.sin(frameCount * 0.05) * 6);
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 4;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      const projectedPoints = scene.diamond.vertices.map((v) => {
        let x1 = v.x * Math.cos(scene.diamond.angleY) - v.z * Math.sin(scene.diamond.angleY);
        let z1 = v.x * Math.sin(scene.diamond.angleY) + v.z * Math.cos(scene.diamond.angleY);
        let y2 = v.y * Math.cos(scene.diamond.angleX) - z1 * Math.sin(scene.diamond.angleX);
        let z2 = v.y * Math.sin(scene.diamond.angleX) + z1 * Math.cos(scene.diamond.angleX);
        return { x: CENTER_X + x1 * cubeSize, y: diamondY + y2 * cubeSize, z: z2 };
      });

      scene.diamond.edges.forEach(edge => {
        const p1 = projectedPoints[edge[0]];
        const p2 = projectedPoints[edge[1]];
        const avgZ = (p1.z + p2.z) / 2;
        const opacity = 0.5 + (avgZ + 1) * 0.25;
        ctx.globalAlpha = cardOpacity * opacity;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      });
      resetGlow();

      // Textos inferiores
      ctx.globalAlpha = cardOpacity;
      ctx.font = "600 20px Montserrat, sans-serif";
      ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
      ctx.letterSpacing = "4px";
      ctx.fillText("ELIMINACIÓN RADICAL", CENTER_X, CENTER_Y + 280);
      ctx.letterSpacing = "0px";

      ctx.font = "900 64px Montserrat, sans-serif";
      ctx.fillStyle = "#ffffff";
      const name = "LUIS CABREJO";
      const nameWidth = ctx.measureText(name).width;
      if (nameWidth > cardWidth * 0.85) ctx.font = "900 56px Montserrat, sans-serif";
      ctx.fillText(name, CENTER_X, CENTER_Y + 380);

      ctx.restore();
      setStatus("Firma: Eliminación Radical");
    }
    // === HOLD FINAL ===
    else {
      const cardWidth = 800;
      const cardHeight = 1500;
      const cardX = CENTER_X - cardWidth / 2;
      const cardY = CENTER_Y - cardHeight / 2;
      const breatheF = 0.93 + Math.sin((time - 20) * 0.6) * 0.07;

      const holdLightX = CENTER_X - 260;
      const holdLightY = CENTER_Y - 100;

      ctx.save();
      ctx.globalAlpha = breatheF;
      const bigGlowF = ctx.createRadialGradient(holdLightX, holdLightY, cardWidth * 0.15, holdLightX, holdLightY, cardWidth * 1.3);
      bigGlowF.addColorStop(0, 'rgba(220, 216, 208, 1)');
      bigGlowF.addColorStop(0.15, 'rgba(190, 186, 178, 0.85)');
      bigGlowF.addColorStop(0.3, 'rgba(155, 151, 144, 0.6)');
      bigGlowF.addColorStop(0.5, 'rgba(110, 107, 102, 0.3)');
      bigGlowF.addColorStop(0.7, 'rgba(65, 63, 58, 0.1)');
      bigGlowF.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = bigGlowF;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.restore();

      ctx.save();
      ctx.globalAlpha = breatheF * 0.8;
      const leftLightF = ctx.createRadialGradient(holdLightX - 180, holdLightY - 80, 0, holdLightX - 180, holdLightY - 80, cardHeight * 0.6);
      leftLightF.addColorStop(0, 'rgba(230, 226, 218, 0.95)');
      leftLightF.addColorStop(0.15, 'rgba(190, 186, 178, 0.7)');
      leftLightF.addColorStop(0.35, 'rgba(140, 137, 130, 0.35)');
      leftLightF.addColorStop(0.6, 'rgba(80, 77, 72, 0.1)');
      leftLightF.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = leftLightF;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.restore();

      ctx.save();
      ctx.globalAlpha = breatheF * 0.4;
      const rightLightF = ctx.createRadialGradient(cardX + cardWidth + 50, CENTER_Y + 100, 0, cardX + cardWidth + 50, CENTER_Y + 100, cardHeight * 0.5);
      rightLightF.addColorStop(0, 'rgba(200, 196, 188, 0.7)');
      rightLightF.addColorStop(0.2, 'rgba(150, 147, 140, 0.4)');
      rightLightF.addColorStop(0.5, 'rgba(90, 87, 82, 0.12)');
      rightLightF.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = rightLightF;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.restore();

      ctx.save();
      ctx.fillStyle = "#090909";
      ctx.fillRect(cardX, cardY, cardWidth, cardHeight);

      const leftEdgeF = ctx.createLinearGradient(cardX - 1, 0, cardX + 4, 0);
      leftEdgeF.addColorStop(0, 'rgba(220, 216, 208, 0.6)');
      leftEdgeF.addColorStop(0.5, 'rgba(180, 176, 168, 0.25)');
      leftEdgeF.addColorStop(1, 'rgba(180, 176, 168, 0)');
      ctx.fillStyle = leftEdgeF;
      ctx.fillRect(cardX - 1, cardY, 5, cardHeight);

      const topEdgeF = ctx.createLinearGradient(0, cardY - 1, 0, cardY + 3);
      topEdgeF.addColorStop(0, 'rgba(200, 196, 188, 0.4)');
      topEdgeF.addColorStop(0.5, 'rgba(160, 156, 148, 0.15)');
      topEdgeF.addColorStop(1, 'rgba(160, 156, 148, 0)');
      ctx.fillStyle = topEdgeF;
      ctx.fillRect(cardX, cardY - 1, cardWidth * 0.6, 4);

      const rightEdgeF = ctx.createLinearGradient(cardX + cardWidth + 1, 0, cardX + cardWidth - 3, 0);
      rightEdgeF.addColorStop(0, 'rgba(170, 166, 158, 0.2)');
      rightEdgeF.addColorStop(0.5, 'rgba(140, 136, 128, 0.08)');
      rightEdgeF.addColorStop(1, 'rgba(140, 136, 128, 0)');
      ctx.fillStyle = rightEdgeF;
      ctx.fillRect(cardX + cardWidth - 3, cardY, 4, cardHeight);

      const bottomEdgeF = ctx.createLinearGradient(0, cardY + cardHeight + 1, 0, cardY + cardHeight - 3);
      bottomEdgeF.addColorStop(0, 'rgba(170, 166, 158, 0.2)');
      bottomEdgeF.addColorStop(0.5, 'rgba(140, 136, 128, 0.08)');
      bottomEdgeF.addColorStop(1, 'rgba(140, 136, 128, 0)');
      ctx.fillStyle = bottomEdgeF;
      ctx.fillRect(cardX, cardY + cardHeight - 3, cardWidth * 0.5, 4);

      ctx.font = "bold 50px Montserrat, sans-serif";
      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("CREA TU", CENTER_X, CENTER_Y - 450);
      ctx.font = "900 88px Montserrat, sans-serif";
      ctx.fillText("ACTIVO", CENTER_X, CENTER_Y - 350);

      const cubeSize = 120;
      const diamondY = CENTER_Y - 80;
      scene.diamond.angleX = 0.15;
      scene.diamond.angleY += 0.005;

      drawGlow("rgba(255, 255, 255, 0.6)", 25);
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 4;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      const projectedPoints = scene.diamond.vertices.map((v) => {
        let x1 = v.x * Math.cos(scene.diamond.angleY) - v.z * Math.sin(scene.diamond.angleY);
        let z1 = v.x * Math.sin(scene.diamond.angleY) + v.z * Math.cos(scene.diamond.angleY);
        let y2 = v.y * Math.cos(scene.diamond.angleX) - z1 * Math.sin(scene.diamond.angleX);
        let z2 = v.y * Math.sin(scene.diamond.angleX) + z1 * Math.cos(scene.diamond.angleX);
        return { x: CENTER_X + x1 * cubeSize, y: diamondY + y2 * cubeSize, z: z2 };
      });

      scene.diamond.edges.forEach(edge => {
        const p1 = projectedPoints[edge[0]];
        const p2 = projectedPoints[edge[1]];
        const avgZ = (p1.z + p2.z) / 2;
        const opacity = 0.5 + (avgZ + 1) * 0.25;
        ctx.globalAlpha = opacity;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      });
      resetGlow();

      ctx.globalAlpha = 1;
      ctx.font = "600 20px Montserrat, sans-serif";
      ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
      ctx.letterSpacing = "4px";
      ctx.fillText("ELIMINACIÓN RADICAL", CENTER_X, CENTER_Y + 280);
      ctx.letterSpacing = "0px";

      ctx.font = "900 64px Montserrat, sans-serif";
      ctx.fillStyle = "#ffffff";
      const name = "LUIS CABREJO";
      const nameWidth = ctx.measureText(name).width;
      if (nameWidth > 800 * 0.85) ctx.font = "900 56px Montserrat, sans-serif";
      ctx.fillText(name, CENTER_X, CENTER_Y + 380);
      ctx.restore();

      setStatus("Animación completada");
    }

    if (time < DURATION) {
      animationFrameRef.current = requestAnimationFrame(update);
    } else {
      setIsPlaying(false);
      setStatus("Animación completada");
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
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  };

  const restart = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    frameCountRef.current = 0;
    startTimeRef.current = null;
    sceneRef.current = null;
    setProgress(0);
    setIsPlaying(false);

    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = "#050505";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
    setStatus("Reiniciado - Listo para reproducir");
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
      a.download = 'dia7-eliminacion-radical-26s-60fps.webm';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setIsRecording(false);
      setStatus("Grabación descargada exitosamente");
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

    const CENTER_X = canvas.width / 2;
    const CENTER_Y = canvas.height / 2;

    ctx.fillStyle = "#050505";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = "bold 48px Montserrat, sans-serif";
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.shadowBlur = 40;
    ctx.shadowColor = "rgba(197, 160, 89, 0.6)";
    ctx.fillText("Día 7", CENTER_X, CENTER_Y - 80);

    ctx.font = "32px Montserrat, sans-serif";
    ctx.shadowBlur = 25;
    ctx.shadowColor = "rgba(255, 255, 255, 0.4)";
    ctx.fillText("Eliminación Radical", CENTER_X, CENTER_Y + 20);

    ctx.font = "20px Montserrat, sans-serif";
    ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
    ctx.shadowBlur = 0;
    ctx.fillText("Presiona Reproducir para comenzar", CENTER_X, CENTER_Y + 100);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isPlaying) {
      update();
    }
  }, [isPlaying]);

  return (
    <div className="animation-app">
      <div className="container">
        <canvas
          ref={canvasRef}
          width={1080}
          height={1920}
          className="canvas"
        />

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
          <div>Canvas 1080x1920 · 60 FPS · 26 segundos</div>
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
