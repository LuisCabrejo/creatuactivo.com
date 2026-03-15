'use client';

import React, { useRef, useState, useEffect } from 'react';

export default function Dia5EnfoqueVsOcupacion() {
  const canvasRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('Listo para reproducir');

  const animationFrameRef = useRef(null);
  const frameCountRef = useRef(0);
  const startTimeRef = useRef(null);
  const particlesRef = useRef([]);
  const spearFinalYRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);

  const FPS = 60;
  const DURATION = 20;
  const TOTAL_FRAMES = FPS * DURATION;

  const Easing = {
    easeInExpo: (x) => x === 0 ? 0 : Math.pow(2, 10 * x - 10),
    easeOutExpo: (x) => x === 1 ? 1 : 1 - Math.pow(2, -10 * x),
    easeOutBack: (x) => {
      const c1 = 1.70158;
      const c3 = c1 + 1;
      return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
    },
    easeInBack: (x) => {
      const c1 = 1.70158;
      const c3 = c1 + 1;
      return c3 * x * x * x - c1 * x * x;
    },
    easeOutQuad: (x) => 1 - (1 - x) * (1 - x),
    easeInOutQuad: (x) => x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2,
    easeInQuart: (x) => x * x * x * x,
    easeOutQuart: (x) => 1 - Math.pow(1 - x, 4)
  };

  class Particle {
    constructor(x, y, vx, vy) {
      this.x = x;
      this.y = y;
      this.vx = vx;
      this.vy = vy;
      this.life = 1.0;
      this.size = Math.random() * 12 + 3;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotationSpeed = (Math.random() - 0.5) * 0.2;
      this.gravity = 0.6;
      this.friction = 0.98;
    }

    update() {
      this.vx *= this.friction;
      this.vy += this.gravity;
      this.x += this.vx;
      this.y += this.vy;
      this.rotation += this.rotationSpeed;
      this.life -= 0.015;
    }

    draw(ctx) {
      if (this.life <= 0) return;
      ctx.save();
      ctx.globalAlpha = this.life;
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.shadowBlur = 15;
      ctx.shadowColor = "rgba(255, 255, 255, 0.8)";
      ctx.fillStyle = "#ffffff";
      const w = this.size;
      const h = this.size * (0.5 + Math.random() * 0.5);
      ctx.fillRect(-w/2, -h/2, w, h);
      ctx.restore();
    }
  }

  const initScene = () => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const CENTER_X = canvas.width / 2;
    const CENTER_Y = canvas.height / 2;

    const hero = {
      x: CENTER_X,
      y: CENTER_Y,
      radius: 70,
      shake: { x: 0, y: 0 },
      shakeIntensity: 0,
      opacity: 1,
      pulsePhase: 0,
      morphProgress: 0,
      width: 140,
      height: 140,
      targetY: CENTER_Y,
      currentY: CENTER_Y
    };

    const BLOCK_COUNT = 8;
    const BLOCK_SIZE = 90;
    const BLOCK_DISTANCE = 220;
    const blocks = [];

    for (let i = 0; i < BLOCK_COUNT; i++) {
      const angle = (Math.PI * 2 / BLOCK_COUNT) * i;
      blocks.push({
        x: CENTER_X + Math.cos(angle) * BLOCK_DISTANCE,
        y: CENTER_Y + Math.sin(angle) * BLOCK_DISTANCE,
        targetX: CENTER_X + Math.cos(angle) * BLOCK_DISTANCE,
        targetY: CENTER_Y + Math.sin(angle) * BLOCK_DISTANCE,
        size: BLOCK_SIZE,
        angle: angle,
        pressure: 0,
        opacity: 1,
        yVel: 0,
        rotation: Math.random() * Math.PI * 2
      });
    }

    const wall = {
      x: CENTER_X,
      y: CENTER_Y - 750,
      width: 700,
      height: 120,
      visible: false,
      destroyed: false,
      bricks: [],
      shakeX: 0
    };

    const BRICK_ROWS = 4;
    const BRICK_COLS = 14;
    const BRICK_WIDTH = wall.width / BRICK_COLS;
    const BRICK_HEIGHT = wall.height / BRICK_ROWS;

    for (let row = 0; row < BRICK_ROWS; row++) {
      for (let col = 0; col < BRICK_COLS; col++) {
        wall.bricks.push({
          x: wall.x - wall.width/2 + col * BRICK_WIDTH,
          y: wall.y + row * BRICK_HEIGHT,
          width: BRICK_WIDTH - 2,
          height: BRICK_HEIGHT - 2,
          destroyed: false
        });
      }
    }

    const SIDES = 8;
    const diamondVertices = [];
    const diamondEdges = [];

    diamondVertices.push({x: 0, y: -0.55, z: 0});

    for (let i = 0; i < SIDES; i++) {
      const angle = (Math.PI * 2 / SIDES) * i;
      diamondVertices.push({
        x: Math.cos(angle) * 0.55,
        y: -0.35,
        z: Math.sin(angle) * 0.55
      });
    }

    for (let i = 0; i < SIDES; i++) {
      const angle = (Math.PI * 2 / SIDES) * i;
      diamondVertices.push({
        x: Math.cos(angle) * 1.0,
        y: 0,
        z: Math.sin(angle) * 1.0
      });
    }

    diamondVertices.push({x: 0, y: 1.6, z: 0});

    for (let i = 0; i < SIDES; i++) {
      diamondEdges.push([0, i + 1]);
    }
    for (let i = 0; i < SIDES; i++) {
      diamondEdges.push([i + 1, ((i + 1) % SIDES) + 1]);
    }
    for (let i = 0; i < SIDES; i++) {
      diamondEdges.push([i + 1, SIDES + 1 + i]);
    }
    for (let i = 0; i < SIDES; i++) {
      diamondEdges.push([SIDES + 1 + i, SIDES + 1 + ((i + 1) % SIDES)]);
    }
    for (let i = 0; i < SIDES; i++) {
      diamondEdges.push([SIDES + 1 + i, SIDES * 2 + 1]);
    }

    const cube = {
      angleX: 0.15,
      angleY: 0,
      size: 180,
      opacity: 0,
      pulse: 0,
      vertices: diamondVertices,
      edges: diamondEdges
    };

    return { hero, blocks, wall, cube, CENTER_X, CENTER_Y };
  };

  const sceneRef = useRef(null);

  const update = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    if (!sceneRef.current) {
      sceneRef.current = initScene();
    }

    if (!sceneRef.current) return;

    const { hero, blocks, wall, cube, CENTER_X, CENTER_Y } = sceneRef.current;

    if (startTimeRef.current === null) {
      startTimeRef.current = performance.now();
    }
    const time = (performance.now() - startTimeRef.current) / 1000;
    const frameCount = Math.floor(time * FPS);

    ctx.fillStyle = "#050505";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const progressPercent = Math.min(100, (time / DURATION) * 100);
    setProgress(progressPercent);

    const drawGlow = (color, blur) => {
      ctx.shadowBlur = blur;
      ctx.shadowColor = color;
    };

    const resetGlow = () => {
      ctx.shadowBlur = 0;
      ctx.shadowColor = "transparent";
    };

    // ============================================================
    // FASE 1 (0-3s): "No necesitas más horas / Necesitas más enfoque"
    // Cubos presionan al héroe → todo cae junto
    // ============================================================
    if (time < 3) {

      // 0-2s: Cubos presionan al héroe
      if (time < 2) {
        hero.shakeIntensity = 1;

        blocks.forEach((block, i) => {
          if (block.opacity <= 0) return;
          ctx.save();
          ctx.globalAlpha = block.opacity;

          const pressure = Math.sin(frameCount * 0.12 + i * 0.5) * 12;
          block.pressure = pressure;

          const pushAmount = 1 - Math.abs(Math.sin(frameCount * 0.08 + i * 0.3)) * 0.15;
          block.x = block.targetX * pushAmount + CENTER_X * (1 - pushAmount);
          block.y = block.targetY * pushAmount + CENTER_Y * (1 - pushAmount);

          drawGlow("rgba(255, 255, 255, 0.5)", 20);
          ctx.fillStyle = "#ffffff";
          ctx.translate(block.x, block.y);
          ctx.rotate(block.rotation);
          ctx.fillRect(-block.size/2, -block.size/2, block.size, block.size);
          resetGlow();
          ctx.restore();
        });

        ctx.save();
        ctx.globalAlpha = hero.opacity;
        const shakeAmount = 8;
        hero.shake.x = (Math.random() - 0.5) * shakeAmount * hero.shakeIntensity;
        hero.shake.y = (Math.random() - 0.5) * shakeAmount * hero.shakeIntensity;
        hero.pulsePhase += 0.15;
        const pulse = Math.sin(hero.pulsePhase) * 10;
        drawGlow("rgba(255, 255, 255, 0.6)", 35 + pulse);
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(hero.x + hero.shake.x, hero.y + hero.shake.y, hero.radius, 0, Math.PI * 2);
        ctx.fill();
        resetGlow();
        ctx.restore();
      }
      // 2-3s: Todo cae junto → héroe se transforma en lanza mientras cae
      else {
        const fallT = (time - 2) / 1;
        const eased = Easing.easeInQuart(fallT);

        // Cubos caen y desaparecen
        blocks.forEach((block) => {
          if (block.opacity <= 0) return;
          ctx.save();
          block.opacity = 1 - eased;
          ctx.globalAlpha = block.opacity;
          block.yVel += 3;
          block.y += block.yVel;
          block.rotation += 0.15;
          drawGlow("rgba(255, 255, 255, " + block.opacity + ")", 15);
          ctx.fillStyle = "#ffffff";
          ctx.translate(block.x, block.y);
          ctx.rotate(block.rotation);
          ctx.fillRect(-block.size/2, -block.size/2, block.size, block.size);
          resetGlow();
          ctx.restore();
        });

        // Héroe cae Y se transforma en lanza durante la caída
        const BOTTOM_Y = canvas.height - 300; // Punto bajo (posición ~1.5 de 10)
        const heroFallY = CENTER_Y + eased * (BOTTOM_Y - CENTER_Y);

        // Morph: círculo → lanza mientras cae
        const morphT = Easing.easeInOutQuad(fallT);
        hero.width = 140 - (140 - 18) * morphT;
        hero.height = 140 + (260 - 140) * morphT;
        hero.opacity = 1;

        ctx.save();
        ctx.globalAlpha = hero.opacity;
        drawGlow("rgba(255, 255, 255, 0.7)", 30);
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.ellipse(CENTER_X, heroFallY, hero.width/2, hero.height/2, 0, 0, Math.PI * 2);
        ctx.fill();
        hero.currentY = heroFallY;
        resetGlow();
        ctx.restore();
      }

      setStatus("Fase 1: Caída");
    }
    // ============================================================
    // FASE 2 (3-7s): "La mayoría dispara para todos lados... y no le da a nada"
    // Lanza en la parte baja, vibrando con tensión, NO avanza
    // ============================================================
    else if (time < 7) {
      const t = (time - 3) / 4;

      blocks.forEach((block) => { block.opacity = 0; });

      // Lanza posicionada abajo (punto ~2 de 10)
      const SPEAR_Y = canvas.height - 300;

      // Lanza ya formada, vibra con intensidad creciente
      hero.width = 18;
      hero.height = 260;
      hero.opacity = 1;

      // Vibración que aumenta (acumulando energía)
      const vibrateIntensity = 3 + t * 12;
      const vibrateX = (Math.random() - 0.5) * vibrateIntensity;
      const vibrateY = (Math.random() - 0.5) * vibrateIntensity * 0.3;

      // Pulso de energía creciente
      const energyPulse = Math.sin(frameCount * 0.15) * (5 + t * 15);
      const glowIntensity = 40 + t * 30;

      ctx.save();
      ctx.globalAlpha = hero.opacity;
      drawGlow("rgba(255, 255, 255, " + (0.8 + t * 0.2) + ")", glowIntensity);
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.ellipse(CENTER_X + vibrateX, SPEAR_Y + vibrateY, hero.width/2 + energyPulse * 0.1, hero.height/2, 0, 0, Math.PI * 2);
      ctx.fill();
      hero.currentY = SPEAR_Y;
      resetGlow();
      ctx.restore();

      // Partículas de energía que se acumulan alrededor de la lanza
      if (t > 0.3) {
        const sparkCount = Math.floor(t * 6);
        for (let i = 0; i < sparkCount; i++) {
          const sparkAngle = frameCount * 0.1 + i * (Math.PI * 2 / sparkCount);
          const sparkDist = 30 + Math.sin(frameCount * 0.2 + i) * 15;
          const sparkX = CENTER_X + Math.cos(sparkAngle) * sparkDist;
          const sparkY = SPEAR_Y + Math.sin(sparkAngle) * sparkDist * 0.5;
          ctx.save();
          ctx.globalAlpha = 0.3 + t * 0.4;
          drawGlow("rgba(255, 255, 255, 0.6)", 10);
          ctx.fillStyle = "#ffffff";
          ctx.beginPath();
          ctx.arc(sparkX, sparkY, 2 + Math.random() * 2, 0, Math.PI * 2);
          ctx.fill();
          resetGlow();
          ctx.restore();
        }
      }

      // Muro aparece arriba (punto 9) - se ve a lo lejos
      if (t > 0.5) {
        wall.visible = true;
        const wallFadeIn = Math.min(1, (t - 0.5) * 4);
        ctx.save();
        ctx.globalAlpha = wallFadeIn * 0.6;
        drawGlow("rgba(230, 230, 230, 0.5)", 15);
        ctx.fillStyle = "#e8e8e8";
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2;
        wall.bricks.forEach(brick => {
          ctx.fillRect(brick.x, brick.y, brick.width, brick.height);
          ctx.strokeRect(brick.x, brick.y, brick.width, brick.height);
        });
        resetGlow();
        ctx.restore();
      }

      setStatus("Fase 2: Acumulando energía");
    }
    // ============================================================
    // FASE 3 (7-10s): "Una flecha bien dirigida... penetra lo que mil piedras no logran"
    // Lanza sale DISPARADA a toda velocidad → impacto devastador
    // ============================================================
    else if (time < 10) {
      const t = (time - 7) / 3;

      wall.visible = true;

      // Muro visible (tiembla antes del impacto)
      if (!wall.destroyed) {
        ctx.save();
        if (t > 0.4) {
          wall.shakeX = (Math.random() - 0.5) * (t - 0.4) * 40;
        }
        drawGlow("rgba(230, 230, 230, 0.7)", 25);
        ctx.fillStyle = "#e8e8e8";
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2;
        wall.bricks.forEach(brick => {
          if (brick.destroyed) return;
          ctx.fillRect(brick.x + wall.shakeX, brick.y, brick.width, brick.height);
          ctx.strokeRect(brick.x + wall.shakeX, brick.y, brick.width, brick.height);
        });
        resetGlow();
        ctx.restore();
      }

      // LANZAMIENTO: de punto bajo hasta el muro a TODA VELOCIDAD
      const SPEAR_START_Y = canvas.height - 300;
      const WALL_Y = wall.y + wall.height / 2;
      const totalDistance = SPEAR_START_Y - WALL_Y;

      // easeInExpo: empieza lento, EXPLOTA en velocidad
      const launchT = Easing.easeInExpo(Math.min(1, t * 1.5));
      hero.currentY = SPEAR_START_Y - (launchT * totalDistance);

      // Estela de velocidad (más intensa cuanto más rápido va)
      const trailCount = Math.min(5, Math.floor(launchT * 8));
      for (let i = trailCount; i > 0; i--) {
        ctx.globalAlpha = (0.15 / i) * launchT;
        drawGlow("rgba(255, 255, 255, 0.3)", 30 + i * 10);
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.ellipse(CENTER_X, hero.currentY + (i * 50 * launchT), 8, 120, 0, 0, Math.PI * 2);
        ctx.fill();
        resetGlow();
      }

      // Lanza principal
      ctx.globalAlpha = 1;
      const spearGlow = 50 + launchT * 40;
      drawGlow("rgba(255, 255, 255, 0.95)", spearGlow);
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.ellipse(CENTER_X, hero.currentY, 10, 140, 0, 0, Math.PI * 2);
      ctx.fill();
      resetGlow();

      spearFinalYRef.current = hero.currentY;

      // IMPACTO cuando la lanza alcanza el muro
      if (hero.currentY <= wall.y + wall.height && !wall.destroyed) {
        wall.destroyed = true;

        for (let i = 0; i < 400; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = 10 + Math.random() * 35;
          const vx = Math.cos(angle) * speed;
          const vy = Math.sin(angle) * speed - 12;

          particlesRef.current.push(new Particle(
            CENTER_X + (Math.random() - 0.5) * wall.width,
            wall.y + wall.height / 2,
            vx,
            vy
          ));
        }
      }

      particlesRef.current = particlesRef.current.filter(p => p.life > 0);
      particlesRef.current.forEach(p => {
        p.update();
        p.draw(ctx);
      });

      setStatus("Fase 3: ¡IMPACTO!");
    }
    else if (time >= 10 && time < 15) {
      particlesRef.current = particlesRef.current.filter(p => p.life > 0);
      particlesRef.current.forEach(p => {
        p.update();
        p.life -= 0.03;
        p.draw(ctx);
      });

      if (time < 12) {
        const subT = (time - 10) / 2;

        const startY = spearFinalYRef.current || CENTER_Y - 600;
        const returnY = startY + (CENTER_Y - startY) * Easing.easeOutQuad(subT);

        const contractWidth = 10 + (70 - 10) * Easing.easeInQuart(subT);
        const contractHeight = 140 - (140 - 70) * Easing.easeInQuart(subT);

        ctx.save();
        ctx.globalAlpha = 1 - (subT * 0.3);
        drawGlow("rgba(255, 255, 255, 0.8)", 40);
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.ellipse(CENTER_X, returnY, contractWidth/2, contractHeight/2, 0, 0, Math.PI * 2);
        ctx.fill();
        resetGlow();
        ctx.restore();

        cube.opacity = Math.min(0.3, Easing.easeInQuart(subT) * 0.3);
        cube.size = 100;

        setStatus("Fase 4A: Metamorfosis...");
      }
      else {
        const subT = (time - 12) / 3;

        cube.opacity = Math.min(1, Easing.easeOutQuad(subT * 1.2));

        const targetSize = 180;
        const scale = Easing.easeOutBack(Math.min(1, subT * 1.3));
        cube.size = 100 + (targetSize - 100) * scale;

        setStatus("Fase 4B: El activo creado");
      }

      if (cube.opacity > 0) {
        cube.angleX = 0.15;
        cube.angleY += 0.015;
        cube.pulse = Math.sin(frameCount * 0.05) * 8;

        // Héroe visible dentro del diamante (círculo brillante en el centro)
        const globalT = (time - 10) / 5;
        const heroInsideOpacity = cube.opacity * 0.7;
        const heroRadius = 25 + Math.sin(frameCount * 0.08) * 5;

        ctx.save();
        ctx.globalAlpha = heroInsideOpacity;
        drawGlow("rgba(255, 255, 255, 0.9)", 40 + cube.pulse);
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(CENTER_X, CENTER_Y, heroRadius, 0, Math.PI * 2);
        ctx.fill();
        resetGlow();

        // Halo suave alrededor del héroe
        ctx.globalAlpha = heroInsideOpacity * 0.3;
        const haloGrad = ctx.createRadialGradient(CENTER_X, CENTER_Y, heroRadius, CENTER_X, CENTER_Y, heroRadius * 3);
        haloGrad.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
        haloGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = haloGrad;
        ctx.beginPath();
        ctx.arc(CENTER_X, CENTER_Y, heroRadius * 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Diamante wireframe sobre el héroe
        ctx.save();
        ctx.globalAlpha = cube.opacity;

        drawGlow("rgba(255, 255, 255, 0.7)", 30 + cube.pulse);
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 5;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        const projectedPoints = cube.vertices.map((v) => {
          let x1 = v.x * Math.cos(cube.angleY) - v.z * Math.sin(cube.angleY);
          let z1 = v.x * Math.sin(cube.angleY) + v.z * Math.cos(cube.angleY);

          let y2 = v.y * Math.cos(cube.angleX) - z1 * Math.sin(cube.angleX);
          let z2 = v.y * Math.sin(cube.angleX) + z1 * Math.cos(cube.angleX);

          return {
            x: CENTER_X + x1 * cube.size,
            y: CENTER_Y + y2 * cube.size,
            z: z2
          };
        });

        cube.edges.forEach(edge => {
          const p1 = projectedPoints[edge[0]];
          const p2 = projectedPoints[edge[1]];
          const avgZ = (p1.z + p2.z) / 2;
          const opacity = 0.4 + (avgZ + 1) * 0.3;

          ctx.globalAlpha = cube.opacity * opacity;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        });

        resetGlow();
        ctx.restore();
      }
    }
    else if (time >= 15 && time < 20) {
      const t = (time - 15) / 5;

      const cardScale = t < 0.6 ? Easing.easeOutBack(t / 0.6) : 1;
      const cardOpacity = Math.min(1, t / 0.4);

      // TARJETA MÁS GRANDE
      const cardWidth = 800;
      const cardHeight = 1500;
      const cardX = CENTER_X - cardWidth / 2;
      const cardY = CENTER_Y - cardHeight / 2;

      // === BACKLIGHT INTENSO (estilo Dan Koe) ===
      const lightTime = time - 15;
      const fadeIn = Math.min(1, lightTime / 1.0);
      const breathe = 0.93 + Math.sin(lightTime * 0.6) * 0.07;

      // Capa 1: Gran resplandor central detrás de la tarjeta (muy brillante)
      ctx.save();
      ctx.globalAlpha = cardOpacity * fadeIn * breathe;
      const bigGlow = ctx.createRadialGradient(
        CENTER_X - 60, CENTER_Y, cardWidth * 0.15,
        CENTER_X - 60, CENTER_Y, cardWidth * 1.3
      );
      bigGlow.addColorStop(0, 'rgba(220, 216, 208, 1)');
      bigGlow.addColorStop(0.15, 'rgba(190, 186, 178, 0.85)');
      bigGlow.addColorStop(0.3, 'rgba(155, 151, 144, 0.6)');
      bigGlow.addColorStop(0.5, 'rgba(110, 107, 102, 0.3)');
      bigGlow.addColorStop(0.7, 'rgba(65, 63, 58, 0.1)');
      bigGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = bigGlow;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.restore();

      // Capa 2: Luz fuerte desde la izquierda (asimétrica)
      ctx.save();
      ctx.globalAlpha = cardOpacity * fadeIn * breathe * 0.8;
      const leftLight = ctx.createRadialGradient(
        cardX - 50, CENTER_Y - 150, 0,
        cardX - 50, CENTER_Y - 150, cardHeight * 0.6
      );
      leftLight.addColorStop(0, 'rgba(230, 226, 218, 0.95)');
      leftLight.addColorStop(0.15, 'rgba(190, 186, 178, 0.7)');
      leftLight.addColorStop(0.35, 'rgba(140, 137, 130, 0.35)');
      leftLight.addColorStop(0.6, 'rgba(80, 77, 72, 0.1)');
      leftLight.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = leftLight;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.restore();

      // Capa 3: Rebote derecho (más débil, pero visible)
      ctx.save();
      ctx.globalAlpha = cardOpacity * fadeIn * breathe * 0.4;
      const rightLight = ctx.createRadialGradient(
        cardX + cardWidth + 50, CENTER_Y + 100, 0,
        cardX + cardWidth + 50, CENTER_Y + 100, cardHeight * 0.5
      );
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

      ctx.translate(CENTER_X, CENTER_Y);
      ctx.scale(cardScale, cardScale);
      ctx.translate(-CENTER_X, -CENTER_Y);

      // Tarjeta color plano #090909
      ctx.fillStyle = "#090909";
      ctx.fillRect(cardX, cardY, cardWidth, cardHeight);

      // Borde izquierdo iluminado (donde la luz pega fuerte)
      const leftEdgeGrad = ctx.createLinearGradient(cardX - 1, 0, cardX + 4, 0);
      leftEdgeGrad.addColorStop(0, 'rgba(220, 216, 208, 0.6)');
      leftEdgeGrad.addColorStop(0.5, 'rgba(180, 176, 168, 0.25)');
      leftEdgeGrad.addColorStop(1, 'rgba(180, 176, 168, 0)');
      ctx.fillStyle = leftEdgeGrad;
      ctx.fillRect(cardX - 1, cardY, 5, cardHeight);

      // Borde superior (más brillante en la mitad izquierda)
      const topEdgeGrad = ctx.createLinearGradient(0, cardY - 1, 0, cardY + 3);
      topEdgeGrad.addColorStop(0, 'rgba(200, 196, 188, 0.4)');
      topEdgeGrad.addColorStop(0.5, 'rgba(160, 156, 148, 0.15)');
      topEdgeGrad.addColorStop(1, 'rgba(160, 156, 148, 0)');
      ctx.fillStyle = topEdgeGrad;
      ctx.fillRect(cardX, cardY - 1, cardWidth * 0.6, 4);

      // Borde derecho sutil
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

      ctx.font = "bold 50px Montserrat, sans-serif";
      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("CREA TU", CENTER_X, CENTER_Y - 450);

      ctx.font = "900 88px Montserrat, sans-serif";
      ctx.fillText("ACTIVO", CENTER_X, CENTER_Y - 350);

      // DIAMANTE MÁS ARRIBA Y MÁS PEQUEÑO
      const cubeSize = 120;
      const diamondY = CENTER_Y - 80; // Movido más arriba

      cube.angleX = 0;
      cube.angleY += 0.005;
      cube.pulse = Math.sin(frameCount * 0.05) * 6;

      drawGlow("rgba(255, 255, 255, 0.6)", 25 + cube.pulse);
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 4;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      const projectedPoints = cube.vertices.map((v) => {
        let x1 = v.x * Math.cos(cube.angleY) - v.z * Math.sin(cube.angleY);
        let z1 = v.x * Math.sin(cube.angleY) + v.z * Math.cos(cube.angleY);

        let y2 = v.y * Math.cos(cube.angleX) - z1 * Math.sin(cube.angleX);
        let z2 = v.y * Math.sin(cube.angleX) + z1 * Math.cos(cube.angleX);

        return {
          x: CENTER_X + x1 * cubeSize,
          y: diamondY + y2 * cubeSize,
          z: z2
        };
      });

      cube.edges.forEach(edge => {
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

      // TEXTOS MÁS ABAJO
      ctx.globalAlpha = cardOpacity;
      ctx.font = "600 20px Montserrat, sans-serif";
      ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
      ctx.letterSpacing = "4px";
      ctx.fillText("ARQUITECTURA DE ACTIVOS", CENTER_X, CENTER_Y + 280);
      ctx.letterSpacing = "0px";

      ctx.font = "900 64px Montserrat, sans-serif";
      ctx.fillStyle = "#ffffff";

      const name = "LUIS CABREJO";
      const nameWidth = ctx.measureText(name).width;

      if (nameWidth > cardWidth * 0.85) {
        ctx.font = "900 56px Montserrat, sans-serif";
      }

      ctx.fillText(name, CENTER_X, CENTER_Y + 380);

      ctx.restore();

      setStatus("Fase 5: Firma");
    }
    else {
      const cardWidth = 800;
      const cardHeight = 1500;
      const cardX = CENTER_X - cardWidth / 2;
      const cardY = CENTER_Y - cardHeight / 2;

      // === BACKLIGHT INTENSO (continuación FINAL) ===
      const lightTime = time - 15;
      const breatheF = 0.93 + Math.sin(lightTime * 0.6) * 0.07;

      // Capa 1: Gran resplandor central
      ctx.save();
      ctx.globalAlpha = breatheF;
      const bigGlowF = ctx.createRadialGradient(
        CENTER_X - 60, CENTER_Y, cardWidth * 0.15,
        CENTER_X - 60, CENTER_Y, cardWidth * 1.3
      );
      bigGlowF.addColorStop(0, 'rgba(220, 216, 208, 1)');
      bigGlowF.addColorStop(0.15, 'rgba(190, 186, 178, 0.85)');
      bigGlowF.addColorStop(0.3, 'rgba(155, 151, 144, 0.6)');
      bigGlowF.addColorStop(0.5, 'rgba(110, 107, 102, 0.3)');
      bigGlowF.addColorStop(0.7, 'rgba(65, 63, 58, 0.1)');
      bigGlowF.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = bigGlowF;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.restore();

      // Capa 2: Luz fuerte izquierda
      ctx.save();
      ctx.globalAlpha = breatheF * 0.8;
      const leftLightF = ctx.createRadialGradient(
        cardX - 50, CENTER_Y - 150, 0,
        cardX - 50, CENTER_Y - 150, cardHeight * 0.6
      );
      leftLightF.addColorStop(0, 'rgba(230, 226, 218, 0.95)');
      leftLightF.addColorStop(0.15, 'rgba(190, 186, 178, 0.7)');
      leftLightF.addColorStop(0.35, 'rgba(140, 137, 130, 0.35)');
      leftLightF.addColorStop(0.6, 'rgba(80, 77, 72, 0.1)');
      leftLightF.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = leftLightF;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.restore();

      // Capa 3: Rebote derecho
      ctx.save();
      ctx.globalAlpha = breatheF * 0.4;
      const rightLightF = ctx.createRadialGradient(
        cardX + cardWidth + 50, CENTER_Y + 100, 0,
        cardX + cardWidth + 50, CENTER_Y + 100, cardHeight * 0.5
      );
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

      // Borde izquierdo iluminado
      const leftEdgeF = ctx.createLinearGradient(cardX - 1, 0, cardX + 4, 0);
      leftEdgeF.addColorStop(0, 'rgba(220, 216, 208, 0.6)');
      leftEdgeF.addColorStop(0.5, 'rgba(180, 176, 168, 0.25)');
      leftEdgeF.addColorStop(1, 'rgba(180, 176, 168, 0)');
      ctx.fillStyle = leftEdgeF;
      ctx.fillRect(cardX - 1, cardY, 5, cardHeight);

      // Borde superior
      const topEdgeF = ctx.createLinearGradient(0, cardY - 1, 0, cardY + 3);
      topEdgeF.addColorStop(0, 'rgba(200, 196, 188, 0.4)');
      topEdgeF.addColorStop(0.5, 'rgba(160, 156, 148, 0.15)');
      topEdgeF.addColorStop(1, 'rgba(160, 156, 148, 0)');
      ctx.fillStyle = topEdgeF;
      ctx.fillRect(cardX, cardY - 1, cardWidth * 0.6, 4);

      // Borde derecho sutil
      const rightEdgeF = ctx.createLinearGradient(cardX + cardWidth + 1, 0, cardX + cardWidth - 3, 0);
      rightEdgeF.addColorStop(0, 'rgba(170, 166, 158, 0.2)');
      rightEdgeF.addColorStop(0.5, 'rgba(140, 136, 128, 0.08)');
      rightEdgeF.addColorStop(1, 'rgba(140, 136, 128, 0)');
      ctx.fillStyle = rightEdgeF;
      ctx.fillRect(cardX + cardWidth - 3, cardY, 4, cardHeight);

      // Borde inferior
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

      cube.angleX = 0;
      cube.angleY += 0.005;

      drawGlow("rgba(255, 255, 255, 0.6)", 25);
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 4;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      const projectedPoints = cube.vertices.map((v) => {
        let x1 = v.x * Math.cos(cube.angleY) - v.z * Math.sin(cube.angleY);
        let z1 = v.x * Math.sin(cube.angleY) + v.z * Math.cos(cube.angleY);

        let y2 = v.y * Math.cos(cube.angleX) - z1 * Math.sin(cube.angleX);
        let z2 = v.y * Math.sin(cube.angleX) + z1 * Math.cos(cube.angleX);

        return {
          x: CENTER_X + x1 * cubeSize,
          y: diamondY + y2 * cubeSize,
          z: z2
        };
      });

      cube.edges.forEach(edge => {
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
      ctx.fillText("ARQUITECTURA DE ACTIVOS", CENTER_X, CENTER_Y + 280);
      ctx.letterSpacing = "0px";

      ctx.font = "900 64px Montserrat, sans-serif";
      ctx.fillStyle = "#ffffff";

      const name = "LUIS CABREJO";
      const nameWidth = ctx.measureText(name).width;

      if (nameWidth > 800 * 0.85) {
        ctx.font = "900 56px Montserrat, sans-serif";
      }

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
    particlesRef.current = [];
    spearFinalYRef.current = null;
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

    const options = {
      mimeType: 'video/webm;codecs=vp9',
      videoBitsPerSecond: 30000000
    };

    try {
      mediaRecorderRef.current = new MediaRecorder(stream, options);
    } catch (e) {
      mediaRecorderRef.current = new MediaRecorder(stream);
    }

    mediaRecorderRef.current.ondataavailable = (event) => {
      if (event.data.size > 0) {
        recordedChunksRef.current.push(event.data);
      }
    };

    mediaRecorderRef.current.onstop = () => {
      const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = 'dia5-enfoque-laser-20s-60fps.webm';
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
    ctx.fillText("Día 5", CENTER_X, CENTER_Y - 80);

    ctx.font = "32px Montserrat, sans-serif";
    ctx.shadowBlur = 25;
    ctx.shadowColor = "rgba(255, 255, 255, 0.4)";
    ctx.fillText("Enfoque vs Ocupación", CENTER_X, CENTER_Y + 20);

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
            {isRecording ? '⬤ Grabando... (20s)' : '⬤ Grabar (20s)'}
          </button>
        </div>

        <div className="info" suppressHydrationWarning>
          <div className="status" suppressHydrationWarning>{status}</div>
          <div>Canvas 1080x1920 · 60 FPS · 20 segundos</div>
        </div>
      </div>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700;900&display=swap');

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

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
          box-shadow:
            0 0 40px rgba(197, 160, 89, 0.2),
            0 0 80px rgba(197, 160, 89, 0.1);
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
          box-shadow: 0 6px 20px rgba(197, 160, 89, 0.4);
        }

        button:active:not(:disabled) {
          transform: translateY(0);
        }

        button:disabled {
          background: #333333;
          color: #666666;
          cursor: not-allowed;
          box-shadow: none;
        }

        .progress-bar {
          width: 100%;
          max-width: 600px;
          height: 6px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
          overflow: hidden;
          position: relative;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #C5A059 0%, #D4AF37 100%);
          transition: width 0.1s linear;
          box-shadow: 0 0 10px rgba(197, 160, 89, 0.6);
        }

        .info {
          text-align: center;
          opacity: 0.7;
          font-size: 13px;
          max-width: 600px;
        }

        .status {
          font-weight: 700;
          color: #C5A059;
          margin-bottom: 8px;
        }

        @media (max-width: 600px) {
          button {
            padding: 12px 20px;
            font-size: 13px;
          }
        }
      `}</style>
    </div>
  );
}
