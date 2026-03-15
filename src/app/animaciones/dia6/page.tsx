'use client';

import React, { useRef, useState, useEffect } from 'react';

export default function Dia6FlywheelEffect() {
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

  // Spark particles
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
        // EL PROTAGONISTA — nuestro héroe, el hilo conductor de los 30 días
        hero: {
          angle: -Math.PI / 2, // Posición angular sobre el engranaje
          distFromCenter: 220, // Empieza en el BORDE del engranaje (= flywheel.radius)
          radius: 50, // GRANDE como Dan Koe — protagonista visible
          shake: 0,
          opacity: 1,
          stretchX: 1,
          stretchY: 1,
        },
        flywheel: {
          angle: 0,
          velocity: 0,
          radius: 220,
          teeth: 16,
        },
        // Engranajes secundarios (el sistema que crece)
        smallGears: [
          { x: 0, y: 0, radius: 80, teeth: 10, angle: 0, coupled: false, opacity: 0 },
          { x: 0, y: 0, radius: 65, teeth: 8, angle: 0, coupled: false, opacity: 0 },
          { x: 0, y: 0, radius: 55, teeth: 7, angle: 0, coupled: false, opacity: 0 },
        ],
        sparks: [],
        // Diamante joyería para firma
        diamond: {
          angleX: 0, angleY: 0,
          vertices: [],
          edges: []
        }
      };

      // Jewelry diamond vertices (continuidad con día 5)
      const dv = sceneRef.current.diamond.vertices;
      dv.push({x: 0, y: -0.55, z: 0}); // apex
      for (let i = 0; i < 8; i++) {
        const a = (Math.PI * 2 * i) / 8;
        dv.push({x: Math.cos(a) * 0.55, y: -0.35, z: Math.sin(a) * 0.55}); // table ring
      }
      for (let i = 0; i < 8; i++) {
        const a = (Math.PI * 2 * i) / 8;
        dv.push({x: Math.cos(a) * 1.0, y: 0, z: Math.sin(a) * 1.0}); // girdle
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

    // === DRAW GEAR ===
    const drawGear = (x, y, radius, teeth, angle, opacity, glowIntensity, lineW = 4) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.globalAlpha = opacity;

      drawGlow("rgba(255, 255, 255, " + Math.min(1, glowIntensity) + ")", 15 + glowIntensity * 40);
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = lineW;
      ctx.lineJoin = "round";

      // Gear teeth
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

      // Central hub
      ctx.beginPath();
      ctx.arc(0, 0, radius * 0.25, 0, Math.PI * 2);
      ctx.stroke();

      // Inner ring
      ctx.beginPath();
      ctx.arc(0, 0, radius * 0.55, 0, Math.PI * 2);
      ctx.stroke();

      // 4 spokes (heavy structure)
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

    // === DRAW HERO (estilo Dan Koe: círculo SÓLIDO + glow atmosférico detrás) ===
    const drawHero = (x, y, radius, opacity, stretchX, stretchY, glowSize, shake) => {
      const shakeX = shake > 0 ? (Math.random() - 0.5) * shake : 0;
      const shakeY = shake > 0 ? (Math.random() - 0.5) * shake : 0;
      const hx = x + shakeX;
      const hy = y + shakeY;

      // CAPA 1: Glow atmosférico DETRÁS (suave, difuso — NO es el héroe)
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

      // CAPA 2: Soft edge glow (borde suave inmediato)
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

      // CAPA 3: CÍRCULO SÓLIDO (el héroe real — bordes LIMPIOS, blanco puro)
      ctx.save();
      ctx.globalAlpha = opacity;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.ellipse(hx, hy, radius * stretchX, radius * stretchY, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    // ============================================================
    // FASE 1 (0-9s): RESISTENCIA
    // Héroe en el BORDE del engranaje, sufriendo cada rotación.
    // "Es un volante pesado... empujas mucho y avanzas poco."
    // "La mayoría renuncia aquí... en el silencio de resultados invisibles."
    // ============================================================
    if (time < 9) {
      const t = time / 9;

      // Aceleración EXTREMADAMENTE lenta — el volante es PESADO
      // Con 0.000025: menos de 1 rotación completa en 9 segundos
      scene.flywheel.velocity += 0.000025;
      scene.flywheel.angle += scene.flywheel.velocity;

      const speedFactor = t * 0.1;

      // Héroe FIJO en el borde del engranaje — gira CON el diente
      scene.hero.angle = scene.flywheel.angle - Math.PI / 2;
      scene.hero.distFromCenter = scene.flywheel.radius; // BORDE completo

      const heroX = CENTER_X + Math.cos(scene.hero.angle) * scene.hero.distFromCenter;
      const heroY = CENTER_Y + Math.sin(scene.hero.angle) * scene.hero.distFromCenter;

      // Vibración intensa del esfuerzo
      const heroShake = 8 + Math.sin(frameCount * 0.2) * 3;

      // Deformación: se APLASTA contra el diente por la inercia
      const strainPulse = Math.sin(frameCount * 0.15) * 0.1;
      const stretchX = 0.75 + strainPulse;
      const stretchY = 1.25 - strainPulse;

      // Glow pequeño (poco energía, mucho esfuerzo)
      const glowSize = 25 + Math.sin(frameCount * 0.1) * 5;

      // Draw gear first (behind hero)
      const resistShake = Math.sin(frameCount * 0.3) * (1 - t) * 2;
      drawGear(
        CENTER_X + resistShake, CENTER_Y,
        scene.flywheel.radius, scene.flywheel.teeth,
        scene.flywheel.angle, 1, speedFactor, 5
      );

      // Draw hero on the edge, suffering
      drawHero(heroX, heroY, scene.hero.radius, 1, stretchX, stretchY, glowSize, heroShake);

      // Líneas de esfuerzo radiando del héroe (sudor visual)
      if (time > 0.5) {
        ctx.save();
        ctx.globalAlpha = 0.3 * (1 - t * 0.5);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        const pushAngle = scene.hero.angle + Math.PI; // dirección opuesta
        for (let i = 0; i < 5; i++) {
          const lineAngle = pushAngle + (i - 2) * 0.2;
          const startDist = scene.hero.radius + 15;
          const endDist = startDist + 30 + Math.sin(frameCount * 0.1 + i) * 12;
          ctx.beginPath();
          ctx.moveTo(heroX + Math.cos(lineAngle) * startDist, heroY + Math.sin(lineAngle) * startDist);
          ctx.lineTo(heroX + Math.cos(lineAngle) * endDist, heroY + Math.sin(lineAngle) * endDist);
          ctx.stroke();
        }
        ctx.restore();
      }

      setStatus("Fase 1: Resistencia");
    }
    // ============================================================
    // FASE 2 (9-14s): ACUMULACIÓN
    // El volante gana velocidad. Héroe se DESLIZA del borde al CENTRO.
    // "Pero si sigues empujando... la inercia toma el control."
    // Engranajes secundarios se acoplan (resultados invisibles construyéndose).
    // ============================================================
    else if (time < 14) {
      const t = (time - 9) / 5;

      // Aceleración más agresiva (la base es baja tras la fase lenta)
      scene.flywheel.velocity *= 1.012;
      scene.flywheel.velocity = Math.min(scene.flywheel.velocity, 0.25);
      scene.flywheel.angle += scene.flywheel.velocity;

      const speedFactor = Easing.easeInOutCubic(t);
      const mainR = scene.flywheel.radius;

      // === FÍSICA DEL HÉROE ===
      // Permanece en el BORDE hasta t=0.612 (12.06s total)
      // Solo empieza a migrar al centro cuando el narrador dice "pero si sigues empujando"
      const HERO_MIGRATE_START = 0.612;
      scene.hero.angle = scene.flywheel.angle - Math.PI / 2;

      let normT = 0; // 0=en borde, 1=en centro
      if (t < HERO_MIGRATE_START) {
        scene.hero.distFromCenter = mainR;
      } else {
        const migT = (t - HERO_MIGRATE_START) / (1 - HERO_MIGRATE_START);
        normT = Easing.easeInOutQuad(migT);
        scene.hero.distFromCenter = mainR * (1 - normT);
      }

      const heroX = CENTER_X + Math.cos(scene.hero.angle) * scene.hero.distFromCenter;
      const heroY = CENTER_Y + Math.sin(scene.hero.angle) * scene.hero.distFromCenter;

      // Vibración: desaparece solo cuando comienza a migrar
      const vibFade = t < HERO_MIGRATE_START ? 0 : Math.min(1, (t - HERO_MIGRATE_START) / 0.2);
      const heroShake = 8 * (1 - vibFade);

      // Deformación: se normaliza al migrar
      const stretchX = 0.75 + 0.25 * normT;
      const stretchY = 1.25 - 0.25 * normT;

      // Glow crece al acercarse al centro
      const heroGlowP2 = 25 + normT * 40;

      // === PIÑONES SECUNDARIOS ===
      // Aparecen a partir de t=0.63 (12.15s) — "pero si sigues empujando"
      // Representan los resultados invisibles que se estaban construyendo
      if (t > 0.63) {
        const g = scene.smallGears[0];
        const enterT = Math.min(1, (t - 0.63) / 0.14);
        const eased = Easing.easeOutBack(enterT);
        g.x = CENTER_X + mainR + 200 - (200 - (g.radius - 8)) * eased;
        g.y = CENTER_Y - 30;
        g.opacity = Math.min(1, enterT * 2);
        g.coupled = enterT >= 1;
        g.angle = -scene.flywheel.angle * (mainR / g.radius);
      }

      if (t > 0.76) {
        const g = scene.smallGears[1];
        const cAngle = Math.PI * 1.25;
        const coupledX = CENTER_X + Math.cos(cAngle) * (mainR + g.radius - 8);
        const coupledY = CENTER_Y + Math.sin(cAngle) * (mainR + g.radius - 8);
        const enterT = Math.min(1, (t - 0.76) / 0.14);
        const eased = Easing.easeOutBack(enterT);
        g.x = (coupledX + Math.cos(cAngle) * 200) + (coupledX - (coupledX + Math.cos(cAngle) * 200)) * eased;
        g.y = (coupledY + Math.sin(cAngle) * 200) + (coupledY - (coupledY + Math.sin(cAngle) * 200)) * eased;
        g.opacity = Math.min(1, enterT * 2);
        g.coupled = enterT >= 1;
        g.angle = -scene.flywheel.angle * (mainR / g.radius);
      }

      if (t > 0.88) {
        const g = scene.smallGears[2];
        const cAngle = Math.PI * 0.75;
        const coupledX = CENTER_X + Math.cos(cAngle) * (mainR + g.radius - 8);
        const coupledY = CENTER_Y + Math.sin(cAngle) * (mainR + g.radius - 8);
        const enterT = Math.min(1, (t - 0.88) / 0.12);
        const eased = Easing.easeOutBack(enterT);
        g.x = (coupledX + Math.cos(cAngle) * 200) + (coupledX - (coupledX + Math.cos(cAngle) * 200)) * eased;
        g.y = (coupledY + Math.sin(cAngle) * 200) + (coupledY - (coupledY + Math.sin(cAngle) * 200)) * eased;
        g.opacity = Math.min(1, enterT * 2);
        g.coupled = enterT >= 1;
        g.angle = -scene.flywheel.angle * (mainR / g.radius);
      }

      // Draw main gear
      drawGear(CENTER_X, CENTER_Y, mainR, scene.flywheel.teeth,
        scene.flywheel.angle, 1, speedFactor, 4 + speedFactor * 2);

      // Draw secondary gears
      scene.smallGears.forEach(g => {
        if (g.opacity > 0) {
          drawGear(g.x, g.y, g.radius, g.teeth, g.angle, g.opacity, speedFactor * 0.7, 3);
        }
      });

      // Draw hero
      drawHero(heroX, heroY, scene.hero.radius, 1, stretchX, stretchY, heroGlowP2, heroShake);

      // Visual feedback según posición del héroe
      if (t < HERO_MIGRATE_START) {
        // Héroe en borde: líneas de esfuerzo (igual que Fase 1)
        ctx.save();
        ctx.globalAlpha = 0.25;
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        const pushAngle = scene.hero.angle + Math.PI;
        for (let i = 0; i < 4; i++) {
          const lineAngle = pushAngle + (i - 1.5) * 0.2;
          const startDist = scene.hero.radius + 15;
          const endDist = startDist + 25 + Math.sin(frameCount * 0.1 + i) * 10;
          ctx.beginPath();
          ctx.moveTo(heroX + Math.cos(lineAngle) * startDist, heroY + Math.sin(lineAngle) * startDist);
          ctx.lineTo(heroX + Math.cos(lineAngle) * endDist, heroY + Math.sin(lineAngle) * endDist);
          ctx.stroke();
        }
        ctx.restore();
      } else {
        // Héroe migrando: trail espiral hacia el centro
        const migProgress = (t - HERO_MIGRATE_START) / (1 - HERO_MIGRATE_START);
        const trailCount = Math.floor(migProgress * 5);
        for (let i = 1; i <= trailCount; i++) {
          const trailDist = scene.hero.distFromCenter + i * 28;
          if (trailDist > mainR) continue;
          const trailAngle = scene.hero.angle - (i * 0.12);
          const trailX = CENTER_X + Math.cos(trailAngle) * trailDist;
          const trailY = CENTER_Y + Math.sin(trailAngle) * trailDist;
          ctx.save();
          ctx.globalAlpha = (0.2 / i) * migProgress;
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(trailX, trailY, scene.hero.radius * Math.max(0.1, 0.7 - i * 0.12), 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }

      // Sparks en puntos de engranaje
      if (t > 0.65 && speedFactor > 0.3) {
        scene.smallGears.forEach(g => {
          if (g.coupled && Math.random() < speedFactor * 0.3) {
            const contactAngle = Math.atan2(g.y - CENTER_Y, g.x - CENTER_X);
            const contactX = CENTER_X + Math.cos(contactAngle) * mainR;
            const contactY = CENTER_Y + Math.sin(contactAngle) * mainR;
            scene.sparks.push(new SparkParticle(contactX, contactY,
              contactAngle + (Math.random() - 0.5) * Math.PI, 2 + Math.random() * 4));
          }
        });
      }

      scene.sparks = scene.sparks.filter(s => s.life > 0);
      scene.sparks.forEach(s => { s.update(); s.draw(ctx); });

      setStatus(t < HERO_MIGRATE_START ? "Fase 2: Resultados Invisibles..." : "Fase 2: El Héroe Avanza");
    }
    // ============================================================
    // FASE 3 (14-20s): PAZ EN MEDIO DEL CAOS (Soberanía)
    // Héroe INMÓVIL en el centro absoluto. Brillante. Sereno.
    // "La inercia toma el control... No busques aplausos rápidos... construye momentum."
    // La rueda gira FURIOSA a su alrededor — él no se mueve. Eso es soberanía.
    // ============================================================
    else if (time < 21) {
      const t = (time - 14) / 7;

      // Velocidad máxima — la rueda es un borrón de caos
      scene.flywheel.velocity = 0.4 + t * 0.3;
      scene.flywheel.angle += scene.flywheel.velocity;

      // Héroe FIJO en el centro absoluto — no se mueve
      scene.hero.distFromCenter = 0;

      const mainR = scene.flywheel.radius;

      scene.smallGears.forEach(g => {
        g.angle = -scene.flywheel.angle * (mainR / g.radius);
      });

      // ============================================================
      // FASE 3-A (0-0.643, tiempos 14-18.5s): PAZ EN MEDIO DEL CAOS
      // "la inercia toma el control... No busques aplausos rápidos..."
      // Rueda girando furiosa. Héroe: inmóvil, brillante, en paz.
      // ============================================================
      if (t < 0.643) {
        const subT = t / 0.643;

        // Motion blur — la rueda gira tan rápido que se ve borrosa
        const gearGlow = 0.4 + subT * 0.6;
        const gearOpacity = 1 - subT * 0.45;
        const blurPasses = Math.floor(3 + subT * 6);
        for (let b = 0; b < blurPasses; b++) {
          const blurAngle = scene.flywheel.angle + (b / blurPasses) * scene.flywheel.velocity * 2.5;
          const blurOpacity = gearOpacity / (blurPasses * 0.65);
          drawGear(CENTER_X, CENTER_Y, mainR, scene.flywheel.teeth, blurAngle, blurOpacity, gearGlow, 3);
        }

        // Piñones secundarios — también girando (sistema en marcha)
        scene.smallGears.forEach(g => {
          if (g.opacity > 0) drawGear(g.x, g.y, g.radius, g.teeth, g.angle, g.opacity * 0.45, gearGlow * 0.6, 2);
        });

        // Speed lines (caos alrededor del héroe)
        ctx.save();
        ctx.globalAlpha = 0.28 + subT * 0.38;
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        for (let i = 0; i < 36; i++) {
          const lineAngle = (Math.PI * 2 * i) / 36 + scene.flywheel.angle * 0.12;
          const innerDist = mainR + 25;
          const outerDist = mainR + 70 + subT * 140;
          ctx.beginPath();
          ctx.moveTo(CENTER_X + Math.cos(lineAngle) * innerDist, CENTER_Y + Math.sin(lineAngle) * innerDist);
          ctx.lineTo(CENTER_X + Math.cos(lineAngle) * outerDist, CENTER_Y + Math.sin(lineAngle) * outerDist);
          ctx.stroke();
        }
        ctx.restore();

        // HÉROE: inmóvil, respiración suave — PAZ
        const breathe = 1 + Math.sin(frameCount * 0.04) * 0.05;
        const heroGlowA = 55 + subT * 35;
        drawHero(CENTER_X, CENTER_Y, scene.hero.radius * breathe, 1, 1, 1, heroGlowA, 0);

        // Sparks del sistema
        if (Math.random() < 0.4) {
          const sparkAngle = Math.random() * Math.PI * 2;
          scene.sparks.push(new SparkParticle(
            CENTER_X + Math.cos(sparkAngle) * mainR,
            CENTER_Y + Math.sin(sparkAngle) * mainR,
            sparkAngle, 3 + Math.random() * 6));
        }

        setStatus("Fase 3: Soberanía");
      }
      // ============================================================
      // FASE 3-B (0.643-0.929, tiempos 18.5-20.5s): "construye MOMENTUM"
      // El momento de la recompensa. Héroe en su MÁXIMA luminosidad.
      // buildT llega a 1 exactamente en el segundo 20 (cuando se dice "momentum")
      // y SE MANTIENE al máximo hasta 20.5s — eso es soberanía.
      // ============================================================
      else if (t < 0.929) {
        const subT = (t - 0.643) / 0.286;
        // buildT satura en 1 al llegar al segundo 20 (subT≈0.75), luego se sostiene
        const buildT = Math.min(1, subT / 0.75);
        const blast = Easing.easeOutExpo(buildT); // explosión rápida, luego hold

        // Anillos concéntricos expandiéndose desde el centro
        for (let r = 0; r < 4; r++) {
          const ringDelay = r * 0.22;
          const ringT = Math.max(0, subT - ringDelay);
          if (ringT <= 0) continue;
          const ringRadius = mainR * 1.1 * Math.min(1, ringT / (1 - ringDelay));
          const ringOpacity = (1 - Math.min(1, ringT / (1 - ringDelay))) * (0.9 - r * 0.18);
          if (ringOpacity <= 0.01) continue;
          ctx.save();
          ctx.globalAlpha = ringOpacity;
          drawGlow("rgba(255, 255, 255, 0.9)", 35 - r * 5);
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = Math.max(1, 5 - r * 1.2);
          ctx.beginPath();
          ctx.arc(CENTER_X, CENTER_Y, ringRadius, 0, Math.PI * 2);
          ctx.stroke();
          resetGlow();
          ctx.restore();
        }

        // Rayos radiales del burst (energía que emana del héroe)
        ctx.save();
        ctx.globalAlpha = blast * 0.55;
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        for (let i = 0; i < 16; i++) {
          const burstAngle = (Math.PI * 2 * i) / 16 + scene.flywheel.angle * 0.05;
          const startDist = scene.hero.radius * (1 + blast * 0.9) + 8;
          const endDist = startDist + 60 + blast * 100;
          drawGlow("rgba(255, 255, 255, 0.5)", 8);
          ctx.beginPath();
          ctx.moveTo(CENTER_X + Math.cos(burstAngle) * startDist, CENTER_Y + Math.sin(burstAngle) * startDist);
          ctx.lineTo(CENTER_X + Math.cos(burstAngle) * endDist, CENTER_Y + Math.sin(burstAngle) * endDist);
          ctx.stroke();
        }
        resetGlow();
        ctx.restore();

        // HÉROE: MÁXIMA LUMINOSIDAD — crece, brilla al máximo
        const heroExpand = 1 + blast * 0.9;
        const heroGlowB = 90 + blast * 120;
        drawHero(CENTER_X, CENTER_Y, scene.hero.radius * heroExpand, 1, 1, 1, heroGlowB, 0);

        setStatus("✦ MOMENTUM ✦");
      }
      // ============================================================
      // FASE 3-C (0.929-1.0, tiempos 20.5-21s): PANTALLA NEGRA
      // Pausa dramática antes de la firma.
      // ============================================================
      else {
        const subT = (t - 0.929) / 0.071;
        const eased = Easing.easeInOutQuad(subT);

        // Héroe se desvanece en la oscuridad
        const heroOpacity = 1 - eased;
        if (heroOpacity > 0.01) {
          drawHero(CENTER_X, CENTER_Y, scene.hero.radius, heroOpacity, 1, 1, 60, 0);
        }

        // Pantalla negra
        ctx.save();
        ctx.globalAlpha = eased;
        ctx.fillStyle = "#050505";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.restore();

        setStatus("Transición a firma...");
      }

      scene.sparks = scene.sparks.filter(s => s.life > 0);
      scene.sparks.forEach(s => { s.update(); s.draw(ctx); });
    }
    // ============================================================
    // FASE 4 (21-26s): FIRMA + DIAMANTE (Dan Koe backlight)
    // ============================================================
    else if (time >= 21 && time < 26) {
      const t = (time - 21) / 5;

      // === DC BATMAN CARD ENTRY: entrada INSTANTÁNEA (~0.5s), un solo impulso ===
      // Referencia Dan Koe: de invisible a totalmente visible en 3 frames @ 24fps
      const SLIDE_DUR = 0.10; // la tarjeta completa la entrada al 10% del tiempo (0.5s)
      const slideProgress = Easing.easeOutQuart(Math.min(1, t / SLIDE_DUR));
      const cardOffsetY = (1 - slideProgress) * 180; // poco desplazamiento — el impacto está en la velocidad
      const cardOpacity = slideProgress; // opacidad 100% ligada al slide — un solo movimiento

      const cardWidth = 800;
      const cardHeight = 1500;
      const cardX = CENTER_X - cardWidth / 2;
      const cardY = CENTER_Y - cardHeight / 2;

      // === BACKLIGHT CINEMATOGRÁFICO (luz en movimiento, como foco real) ===
      // La fuente de luz barre un arco: inferior-derecho → superior-izquierdo
      // La tarjeta SUBE hacia la luz que ya está presente — esto crea el efecto Batman.
      const lightTime = time - 21;
      const breathe = 0.93 + Math.sin(lightTime * 0.6) * 0.07;
      // Posición animada del foco principal
      const lightX = CENTER_X + 220 - t * 480; // barre de derecha a izquierda
      const lightY = CENTER_Y + 420 - t * 520; // sube de abajo hacia arriba
      // Fade-in de la luz (más lento que el de la tarjeta — luz "esperaba" ahí)
      const fadeIn = Math.min(1, lightTime / 0.8);

      // Capa 1: Gran resplandor central (origen = foco en movimiento)
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

      // Capa 2: Luz secundaria (sigue al foco con desfase — como rebote de pared)
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

      // Tarjeta — DC Batman: sube desde abajo, sin scale
      ctx.save();
      ctx.globalAlpha = cardOpacity;
      ctx.translate(0, cardOffsetY);

      ctx.fillStyle = "#090909";
      ctx.fillRect(cardX, cardY, cardWidth, cardHeight);

      // Borde izquierdo iluminado
      const leftEdgeGrad = ctx.createLinearGradient(cardX - 1, 0, cardX + 4, 0);
      leftEdgeGrad.addColorStop(0, 'rgba(220, 216, 208, 0.6)');
      leftEdgeGrad.addColorStop(0.5, 'rgba(180, 176, 168, 0.25)');
      leftEdgeGrad.addColorStop(1, 'rgba(180, 176, 168, 0)');
      ctx.fillStyle = leftEdgeGrad;
      ctx.fillRect(cardX - 1, cardY, 5, cardHeight);

      // Borde superior
      const topEdgeGrad = ctx.createLinearGradient(0, cardY - 1, 0, cardY + 3);
      topEdgeGrad.addColorStop(0, 'rgba(200, 196, 188, 0.4)');
      topEdgeGrad.addColorStop(0.5, 'rgba(160, 156, 148, 0.15)');
      topEdgeGrad.addColorStop(1, 'rgba(160, 156, 148, 0)');
      ctx.fillStyle = topEdgeGrad;
      ctx.fillRect(cardX, cardY - 1, cardWidth * 0.6, 4);

      // Borde derecho
      const rightEdgeGrad = ctx.createLinearGradient(cardX + cardWidth + 1, 0, cardX + cardWidth - 3, 0);
      rightEdgeGrad.addColorStop(0, 'rgba(170, 166, 158, 0.2)');
      rightEdgeGrad.addColorStop(0.5, 'rgba(140, 136, 128, 0.08)');
      rightEdgeGrad.addColorStop(1, 'rgba(140, 136, 128, 0)');
      ctx.fillStyle = rightEdgeGrad;
      ctx.fillRect(cardX + cardWidth - 3, cardY, 4, cardHeight);

      // Borde inferior
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
      ctx.fillText("CONSTRUYE MOMENTUM", CENTER_X, CENTER_Y + 280);
      ctx.letterSpacing = "0px";

      ctx.font = "900 64px Montserrat, sans-serif";
      ctx.fillStyle = "#ffffff";
      const name = "LUIS CABREJO";
      const nameWidth = ctx.measureText(name).width;
      if (nameWidth > cardWidth * 0.85) ctx.font = "900 56px Montserrat, sans-serif";
      ctx.fillText(name, CENTER_X, CENTER_Y + 380);

      ctx.restore();
      setStatus("Firma: Construye Momentum");
    }
    // === HOLD FINAL ===
    else {
      const cardWidth = 800;
      const cardHeight = 1500;
      const cardX = CENTER_X - cardWidth / 2;
      const cardY = CENTER_Y - cardHeight / 2;
      const breatheF = 0.93 + Math.sin((time - 21) * 0.6) * 0.07;

      // Backlight capas
      ctx.save();
      ctx.globalAlpha = breatheF;
      // Luz asentada en su posición final (t=1 del sweep: upper-left)
      const holdLightX = CENTER_X - 260;
      const holdLightY = CENTER_Y - 100;
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

      // Bordes
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
      ctx.fillText("CONSTRUYE MOMENTUM", CENTER_X, CENTER_Y + 280);
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
      a.download = 'dia6-flywheel-momentum-26s-60fps.webm';
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
    ctx.fillText("Día 6", CENTER_X, CENTER_Y - 80);

    ctx.font = "32px Montserrat, sans-serif";
    ctx.shadowBlur = 25;
    ctx.shadowColor = "rgba(255, 255, 255, 0.4)";
    ctx.fillText("El Efecto Volante", CENTER_X, CENTER_Y + 20);

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
