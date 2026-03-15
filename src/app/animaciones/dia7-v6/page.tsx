'use client';

import React, { useRef, useState, useEffect } from 'react';

// ── V6: Aplicando código Dan Koe v10 ─────────────────────────────────────────
// ✅ v6: Film grain, velocidad x2, partículas ambientales
// ✅ v7: Grid multiplicador + triángulos + hexágonos
// ✅ v8: Shatter pills + Mini-explosiones + Particle burst final
// ✅ v9: Líneas conectoras + Parallax layering + Glitch effects
// ✅ v10: Variedad de partículas + Background grid persistente
// ❌ Omitido: "HACER MÁS" tachado y contador numérico (se añaden en CapCut)

export default function Dia7V6() {
  const canvasRef  = useRef(null);
  const [isPlaying,   setIsPlaying]   = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [progress,    setProgress]    = useState(0);
  const [status,      setStatus]      = useState('Listo para reproducir');

  const animationFrameRef  = useRef(null);
  const startTimeRef       = useRef(null);
  const mediaRecorderRef   = useRef(null);
  const recordedChunksRef  = useRef([]);
  const sceneRef           = useRef(null);

  const FPS      = 60;
  const DURATION = 38;

  const T1 = 1.12; const T2 = 4.08; const T3 = 8.06; const T4 = 13.16;
  const T5 = 18.20; const T6 = 32.06; const T7 = 34.09; const T8 = 37.08;

  const Easing = {
    easeOutExpo:    (x) => x === 1 ? 1 : 1 - Math.pow(2, -10 * x),
    easeOutBack:    (x) => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(x-1,3) + c1 * Math.pow(x-1,2); },
    easeOutQuad:    (x) => 1 - (1-x)*(1-x),
    easeInQuart:    (x) => x*x*x*x,
    easeOutQuart:   (x) => 1 - Math.pow(1-x,4),
    easeOutCubic:   (x) => 1 - Math.pow(1-x,3),
    easeInOutCubic: (x) => x < 0.5 ? 4*x*x*x : 1 - Math.pow(-2*x+2,3)/2,
  };

  const drawFilmGrain = (ctx, W, H, intensity=0.08, fc) => {
    const grainSize = 2;
    const cols = Math.floor(W/grainSize);
    const rows = Math.floor(H/grainSize);
    const grainSeed = Math.floor(fc/3);
    ctx.save();
    ctx.globalAlpha = intensity;
    ctx.fillStyle = '#ffffff';
    for (let i=0; i<cols*rows*0.015; i++) {
      const seed = (grainSeed * 9301 + i * 49297) % 233280;
      const rnd = seed / 233280.0;
      const x = (rnd * cols) * grainSize;
      const y = ((seed * 0.397) % rows) * grainSize;
      ctx.fillRect(x, y, grainSize, grainSize);
    }
    ctx.restore();
  };

  const drawBackgroundGrid = (ctx, W, H, time, opacity) => {
    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 0.5;
    const gridSpacing = 120;
    const offsetX = (time * 15) % gridSpacing;
    const offsetY = (time * 10) % gridSpacing;
    for (let x = -gridSpacing + offsetX; x < W + gridSpacing; x += gridSpacing) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }
    for (let y = -gridSpacing + offsetY; y < H + gridSpacing; y += gridSpacing) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }
    ctx.restore();
  };

  class FloatingParticle {
    constructor(W, H) {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.vx = (Math.random()-0.5) * 0.8;
      this.vy = (Math.random()-0.5) * 0.8;
      this.size = 1 + Math.random() * 3;
      this.opacity = 0.1 + Math.random() * 0.2;
      this.life = 1;
      const shapeRand = Math.random();
      if (shapeRand < 0.4) {
        this.shape = 'circle';
      } else if (shapeRand < 0.6) {
        this.shape = 'line';
        this.lineLength = 8 + Math.random() * 12;
        this.lineAngle = Math.random() * Math.PI * 2;
        this.lineRotSpeed = (Math.random() - 0.5) * 0.03;
      } else if (shapeRand < 0.8) {
        this.shape = 'dot';
        this.size = 1 + Math.random() * 1.5;
      } else {
        this.shape = 'square';
        this.rotation = Math.random() * Math.PI * 2;
        this.rotSpeed = (Math.random() - 0.5) * 0.05;
      }
    }
    update(W, H, parallaxSpeed = 1.0) {
      this.x += this.vx * parallaxSpeed;
      this.y += this.vy * parallaxSpeed;
      if (this.shape === 'line') this.lineAngle += this.lineRotSpeed;
      else if (this.shape === 'square') this.rotation += this.rotSpeed;
      if (this.x < 0) this.x = W;
      if (this.x > W) this.x = 0;
      if (this.y < 0) this.y = H;
      if (this.y > H) this.y = 0;
    }
    draw(ctx) {
      ctx.save();
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#ffffff';
      if (this.shape === 'circle') {
        ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI*2); ctx.fill();
      } else if (this.shape === 'line') {
        ctx.lineWidth = 1;
        const x1 = this.x + Math.cos(this.lineAngle) * this.lineLength/2;
        const y1 = this.y + Math.sin(this.lineAngle) * this.lineLength/2;
        const x2 = this.x - Math.cos(this.lineAngle) * this.lineLength/2;
        const y2 = this.y - Math.sin(this.lineAngle) * this.lineLength/2;
        ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      } else if (this.shape === 'dot') {
        ctx.fillRect(this.x - this.size/2, this.y - this.size/2, this.size, this.size);
      } else if (this.shape === 'square') {
        ctx.translate(this.x, this.y); ctx.rotate(this.rotation);
        ctx.fillRect(-this.size/2, -this.size/2, this.size, this.size);
      }
      ctx.restore();
    }
  }

  class ExplosionParticle {
    constructor(x, y, angle, speed, size, shape = 'rect') {
      this.x = x; this.y = y;
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed;
      this.size = size;
      this.life = 1;
      this.decay = 0.018 + Math.random() * 0.012;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotationSpeed = (Math.random() - 0.5) * 0.3;
      this.shape = shape;
    }
    update() {
      this.x += this.vx; this.y += this.vy;
      this.vy += 0.15; this.vx *= 0.98;
      this.rotation += this.rotationSpeed;
      this.life -= this.decay;
    }
    draw(ctx) {
      if (this.life <= 0) return;
      ctx.save();
      ctx.globalAlpha = Math.max(0, this.life);
      ctx.translate(this.x, this.y); ctx.rotate(this.rotation);
      ctx.fillStyle = '#ffffff';
      if (this.shape === 'circle') {
        ctx.beginPath(); ctx.arc(0, 0, this.size/2, 0, Math.PI*2); ctx.fill();
      } else if (this.shape === 'line') {
        ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(-this.size, 0); ctx.lineTo(this.size, 0); ctx.stroke();
      } else {
        const w = this.size;
        const h = this.size * (0.4 + Math.random() * 0.6);
        ctx.fillRect(-w/2, -h/2, w, h);
      }
      ctx.restore();
    }
  }

  class ShatterFragment {
    constructor(x, y, angle, speed) {
      this.x = x; this.y = y;
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed - 2;
      this.size = 4 + Math.random() * 8;
      this.life = 1;
      this.decay = 0.022 + Math.random() * 0.018;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotationSpeed = (Math.random() - 0.5) * 0.25;
    }
    update() {
      this.x += this.vx; this.y += this.vy;
      this.vy += 0.25; this.vx *= 0.96;
      this.rotation += this.rotationSpeed;
      this.life -= this.decay;
    }
    draw(ctx) {
      if (this.life <= 0) return;
      ctx.save();
      ctx.globalAlpha = Math.max(0, this.life) * 0.8;
      ctx.translate(this.x, this.y); ctx.rotate(this.rotation);
      ctx.fillStyle = 'rgba(255, 60, 60, 0.9)';
      ctx.fillRect(-this.size/2, -this.size/2, this.size, this.size * 0.6);
      ctx.restore();
    }
  }

  const drawHero = (ctx, x, y, r, opacity, sx=1, sy=1, glow=40, glitchIntensity=0) => {
    ctx.save();
    ctx.globalAlpha = opacity * 0.25;
    const a1 = ctx.createRadialGradient(x,y,r*0.8,x,y,r*5);
    a1.addColorStop(0,'rgba(255,255,255,0.5)'); a1.addColorStop(1,'rgba(255,255,255,0)');
    ctx.fillStyle = a1; ctx.beginPath(); ctx.arc(x,y,r*5,0,Math.PI*2); ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.globalAlpha = opacity*0.55;
    const a2 = ctx.createRadialGradient(x,y,r*0.6,x,y,r*1.8);
    a2.addColorStop(0,'rgba(255,255,255,0.7)'); a2.addColorStop(1,'rgba(255,255,255,0)');
    ctx.fillStyle = a2; ctx.beginPath(); ctx.arc(x,y,r*1.8,0,Math.PI*2); ctx.fill();
    ctx.restore();

    if (glitchIntensity > 0) {
      const offset = glitchIntensity * 3;
      ctx.save(); ctx.globalAlpha = opacity * 0.5;
      ctx.shadowBlur = glow * 0.5; ctx.shadowColor = 'rgba(255,0,0,0.6)';
      ctx.fillStyle = 'rgba(255,0,0,0.7)';
      ctx.beginPath(); ctx.ellipse(x-offset, y, r*sx, r*sy, 0, 0, Math.PI*2); ctx.fill();
      ctx.shadowBlur = 0; ctx.restore();

      ctx.save(); ctx.globalAlpha = opacity * 0.5;
      ctx.shadowBlur = glow * 0.5; ctx.shadowColor = 'rgba(0,100,255,0.6)';
      ctx.fillStyle = 'rgba(0,100,255,0.7)';
      ctx.beginPath(); ctx.ellipse(x+offset, y, r*sx, r*sy, 0, 0, Math.PI*2); ctx.fill();
      ctx.shadowBlur = 0; ctx.restore();
    }

    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.shadowBlur = glow; ctx.shadowColor = 'rgba(255,255,255,0.9)';
    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.ellipse(x, y, r*sx, r*sy, 0, 0, Math.PI*2); ctx.fill();
    ctx.shadowBlur = 0;
    ctx.restore();
  };

  const drawOrbitalRing = (ctx, cx, cy, rx, ry, angle, opacity) => {
    ctx.save();
    ctx.globalAlpha = opacity * 0.45;
    ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 1.2;
    ctx.translate(cx, cy); ctx.rotate(angle);
    ctx.beginPath(); ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI*2); ctx.stroke();
    const nodeR = 6;
    [[rx, 0], [-rx, 0]].forEach(([nx, ny]) => {
      ctx.globalAlpha = opacity * 0.85;
      ctx.shadowBlur = 12; ctx.shadowColor = 'rgba(255,255,255,0.9)';
      ctx.fillStyle = '#ffffff';
      ctx.beginPath(); ctx.arc(nx, ny, nodeR, 0, Math.PI*2); ctx.fill();
      ctx.shadowBlur = 0;
    });
    ctx.restore();
  };

  const drawWireBox = (ctx, cx, cy, size, angle, alpha) => {
    if (alpha <= 0) return;
    ctx.save();
    ctx.globalAlpha = alpha; ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 1.2;
    ctx.translate(cx, cy); ctx.rotate(angle);
    const s = size/2, d = size * 0.32;
    const bx = d*0.75, by = -d*0.55;
    ctx.strokeRect(-s, -s, size, size);
    ctx.strokeRect(-s+bx, -s+by, size, size);
    [[-s,-s],[s,-s],[s,s],[-s,s]].forEach(([fx,fy]) => {
      ctx.beginPath(); ctx.moveTo(fx,fy); ctx.lineTo(fx+bx,fy+by); ctx.stroke();
    });
    ctx.restore();
  };

  const drawTriangle = (ctx, cx, cy, size, angle, alpha) => {
    if (alpha <= 0) return;
    ctx.save();
    ctx.globalAlpha = alpha; ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 1.2;
    ctx.translate(cx, cy); ctx.rotate(angle);
    const h = size * Math.sqrt(3)/2;
    ctx.beginPath();
    ctx.moveTo(0, -h*0.67); ctx.lineTo(-size/2, h*0.33); ctx.lineTo(size/2, h*0.33);
    ctx.closePath(); ctx.stroke();
    const innerSize = size * 0.5, ih = innerSize * Math.sqrt(3)/2;
    ctx.rotate(Math.PI);
    ctx.beginPath();
    ctx.moveTo(0, -ih*0.67); ctx.lineTo(-innerSize/2, ih*0.33); ctx.lineTo(innerSize/2, ih*0.33);
    ctx.closePath(); ctx.stroke();
    ctx.restore();
  };

  const drawHexagon = (ctx, cx, cy, size, angle, alpha) => {
    if (alpha <= 0) return;
    ctx.save();
    ctx.globalAlpha = alpha; ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 1.2;
    ctx.translate(cx, cy); ctx.rotate(angle);
    const r = size/2;
    ctx.beginPath();
    for (let i=0; i<6; i++) {
      const a = (Math.PI/3) * i;
      if (i === 0) ctx.moveTo(r*Math.cos(a), r*Math.sin(a));
      else ctx.lineTo(r*Math.cos(a), r*Math.sin(a));
    }
    ctx.closePath(); ctx.stroke();
    const ir = r * 0.6;
    ctx.rotate(Math.PI/6);
    ctx.beginPath();
    for (let i=0; i<6; i++) {
      const a = (Math.PI/3) * i;
      if (i === 0) ctx.moveTo(ir*Math.cos(a), ir*Math.sin(a));
      else ctx.lineTo(ir*Math.cos(a), ir*Math.sin(a));
    }
    ctx.closePath(); ctx.stroke();
    ctx.restore();
  };

  const drawPill = (ctx, cx, cy, text, opacity, scale=1, struck=false, strikeP=0) => {
    if (opacity <= 0.01) return;
    ctx.save();
    ctx.globalAlpha = Math.min(1, opacity);
    ctx.translate(cx, cy); ctx.scale(scale, scale);
    ctx.font = '600 28px Montserrat, sans-serif';
    const tw = ctx.measureText(text).width;
    const bw = tw+44, bh=54;
    ctx.fillStyle = 'rgba(255,255,255,0.08)';
    ctx.strokeStyle = 'rgba(255,255,255,0.3)'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.roundRect(-bw/2,-bh/2,bw,bh,10); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#ffffff'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(text, 0, 0);
    if (struck && strikeP > 0) {
      ctx.strokeStyle = 'rgba(255,60,60,0.9)'; ctx.lineWidth = 3.5; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(-tw/2-6, 0); ctx.lineTo(-tw/2-6+(tw+12)*strikeP, 0); ctx.stroke();
    }
    ctx.restore();
  };

  const drawConnectionLine = (ctx, x1, y1, x2, y2, opacity, maxDistance=250) => {
    const dx = x2-x1, dy = y2-y1;
    const dist = Math.sqrt(dx*dx+dy*dy);
    if (dist > maxDistance) return;
    const alpha = Math.max(0, 1-dist/maxDistance) * opacity;
    ctx.save();
    ctx.globalAlpha = alpha * 0.15;
    ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 0.8;
    ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke();
    ctx.restore();
  };

  const drawDiamond3D = (ctx, cx, diamondY, cubeSize, scene, cardOpacity=1) => {
    scene.diamond.angleX = 0.15;
    scene.diamond.angleY += 0.005;
    ctx.shadowBlur = 25; ctx.shadowColor = 'rgba(255,255,255,0.6)';
    ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 4;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const proj = scene.diamond.vertices.map(v => {
      const x1 = v.x*Math.cos(scene.diamond.angleY) - v.z*Math.sin(scene.diamond.angleY);
      const z1 = v.x*Math.sin(scene.diamond.angleY) + v.z*Math.cos(scene.diamond.angleY);
      const y2 = v.y*Math.cos(scene.diamond.angleX) - z1*Math.sin(scene.diamond.angleX);
      const z2 = v.y*Math.sin(scene.diamond.angleX) + z1*Math.cos(scene.diamond.angleX);
      return { x: cx + x1*cubeSize, y: diamondY + y2*cubeSize, z: z2 };
    });
    scene.diamond.edges.forEach(e => {
      const p1=proj[e[0]], p2=proj[e[1]];
      const avgZ = (p1.z+p2.z)/2;
      ctx.globalAlpha = cardOpacity * (0.5 + (avgZ+1)*0.25);
      ctx.beginPath(); ctx.moveTo(p1.x,p1.y); ctx.lineTo(p2.x,p2.y); ctx.stroke();
    });
    ctx.shadowBlur = 0;
  };

  const drawSignatureCard = (ctx, W, H, CX, CY, cardOpacity, cardOffsetY, lightX, lightY, breathe, scene) => {
    const cardWidth = 800, cardHeight = 1500;
    const cardX = CX - cardWidth / 2;
    const cardY = CY - cardHeight / 2;

    ctx.save();
    ctx.globalAlpha = cardOpacity * breathe;
    const bg = ctx.createRadialGradient(lightX, lightY, cardWidth*0.15, lightX, lightY, cardWidth*1.3);
    bg.addColorStop(0,'rgba(220,216,208,1)'); bg.addColorStop(0.15,'rgba(190,186,178,0.85)');
    bg.addColorStop(0.3,'rgba(155,151,144,0.6)'); bg.addColorStop(0.5,'rgba(110,107,102,0.3)');
    bg.addColorStop(0.7,'rgba(65,63,58,0.1)'); bg.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=bg; ctx.fillRect(0,0,W,H); ctx.restore();

    ctx.save();
    ctx.globalAlpha = cardOpacity * breathe * 0.8;
    const bl = ctx.createRadialGradient(lightX-180,lightY-80,0,lightX-180,lightY-80,cardHeight*0.6);
    bl.addColorStop(0,'rgba(230,226,218,0.95)'); bl.addColorStop(0.15,'rgba(190,186,178,0.7)');
    bl.addColorStop(0.35,'rgba(140,137,130,0.35)'); bl.addColorStop(0.6,'rgba(80,77,72,0.1)');
    bl.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=bl; ctx.fillRect(0,0,W,H); ctx.restore();

    ctx.save();
    ctx.globalAlpha = cardOpacity * breathe * 0.4;
    const br = ctx.createRadialGradient(cardX+cardWidth+50,CY+100,0,cardX+cardWidth+50,CY+100,cardHeight*0.5);
    br.addColorStop(0,'rgba(200,196,188,0.7)'); br.addColorStop(0.2,'rgba(150,147,140,0.4)');
    br.addColorStop(0.5,'rgba(90,87,82,0.12)'); br.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=br; ctx.fillRect(0,0,W,H); ctx.restore();

    ctx.save();
    ctx.globalAlpha = cardOpacity;
    ctx.translate(0, cardOffsetY);
    ctx.fillStyle = '#090909';
    ctx.fillRect(cardX, cardY, cardWidth, cardHeight);

    const edge = (grad, rx, ry, rw, rh) => { ctx.fillStyle=grad; ctx.fillRect(rx,ry,rw,rh); };
    const le = ctx.createLinearGradient(cardX-1,0,cardX+4,0);
    le.addColorStop(0,'rgba(220,216,208,0.6)'); le.addColorStop(0.5,'rgba(180,176,168,0.25)'); le.addColorStop(1,'rgba(180,176,168,0)');
    edge(le,cardX-1,cardY,5,cardHeight);
    const te = ctx.createLinearGradient(0,cardY-1,0,cardY+3);
    te.addColorStop(0,'rgba(200,196,188,0.4)'); te.addColorStop(0.5,'rgba(160,156,148,0.15)'); te.addColorStop(1,'rgba(160,156,148,0)');
    edge(te,cardX,cardY-1,cardWidth*0.6,4);
    const re2 = ctx.createLinearGradient(cardX+cardWidth+1,0,cardX+cardWidth-3,0);
    re2.addColorStop(0,'rgba(170,166,158,0.2)'); re2.addColorStop(0.5,'rgba(140,136,128,0.08)'); re2.addColorStop(1,'rgba(140,136,128,0)');
    edge(re2,cardX+cardWidth-3,cardY,4,cardHeight);
    const be2 = ctx.createLinearGradient(0,cardY+cardHeight+1,0,cardY+cardHeight-3);
    be2.addColorStop(0,'rgba(170,166,158,0.2)'); be2.addColorStop(0.5,'rgba(140,136,128,0.08)'); be2.addColorStop(1,'rgba(140,136,128,0)');
    edge(be2,cardX,cardY+cardHeight-3,cardWidth*0.5,4);

    ctx.globalAlpha = cardOpacity;
    ctx.font='bold 50px Montserrat, sans-serif'; ctx.fillStyle='#ffffff';
    ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.fillText('CREA TU', CX, CY-450);
    ctx.font='900 88px Montserrat, sans-serif';
    ctx.fillText('ACTIVO', CX, CY-350);

    drawDiamond3D(ctx, CX, CY-80, 180, scene, cardOpacity);

    ctx.globalAlpha = cardOpacity;
    ctx.font='600 20px Montserrat, sans-serif'; ctx.fillStyle='rgba(255,255,255,0.85)';
    ctx.letterSpacing='4px';
    ctx.fillText('ELIMINACIÓN RADICAL', CX, CY+280);
    ctx.letterSpacing='0px';
    ctx.font='900 64px Montserrat, sans-serif'; ctx.fillStyle='#ffffff';
    const nm='LUIS CABREJO';
    if (ctx.measureText(nm).width > cardWidth*0.85) ctx.font='900 56px Montserrat, sans-serif';
    ctx.fillText(nm, CX, CY+360);
    ctx.restore();
  };

  const update = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = canvas.width, H = canvas.height;
    const CX = W/2, CY = H/2;

    const now = performance.now();
    if (startTimeRef.current === null) startTimeRef.current = now;
    const elapsed = (now - startTimeRef.current) / 1000;
    const time = Math.min(elapsed, DURATION);
    const fc = Math.floor(time * FPS);

    setProgress((time / DURATION) * 100);

    if (!sceneRef.current) {
      const createGrid = (cols, rows, W, H) => {
        const items = [];
        for (let r=0; r<rows; r++) for (let c=0; c<cols; c++) {
          const shapeType = Math.random();
          items.push({
            cx: (c+0.5)*(W/cols),
            cy: (r+0.5)*(H/rows),
            size: 60 + Math.random()*40,
            angle: Math.random()*Math.PI*2,
            rotSpeed: (Math.random()-0.5)*0.01,
            type: shapeType < 0.5 ? 'box' : shapeType < 0.75 ? 'triangle' : 'hexagon',
          });
        }
        return items;
      };

      const gridItems = createGrid(5, 9, W, H);

      const TOOLS_ALL = ['HORAS','ESTRATEGIAS','HERRAMIENTAS','APPS','EMAILS','REUNIONES','CURSOS','TAREAS'];
      const tools = TOOLS_ALL.map((label, i) => ({
        label,
        orbitAngle: (Math.PI*2*i)/TOOLS_ALL.length,
        orbitRadius: 240 + (i%3)*55,
        opacity: 0, strikeP: 0, eliminated: false, elimProgress: 0,
        shattered: false,
      }));

      const NUM_V = 14;
      const stonePoints = [];
      for (let i=0; i<NUM_V; i++) {
        const a = (Math.PI*2*i)/NUM_V + (Math.random()-0.5)*0.22;
        stonePoints.push({ baseAngle:a, roughR: 210+(Math.random()-0.5)*110, smoothR:185 });
      }

      const diamond = { angleX:0, angleY:0, vertices:[], edges:[] };
      const dv = diamond.vertices;
      for (let i=0;i<8;i++){const a=(Math.PI*2*i)/8; dv.push({x:Math.cos(a)*0.55,y:-0.35,z:Math.sin(a)*0.55});}
      for (let i=0;i<8;i++){const a=(Math.PI*2*i)/8; dv.push({x:Math.cos(a)*1.0,y:0,z:Math.sin(a)*1.0});}
      dv.push({x:0,y:1.6,z:0});
      const de = diamond.edges;
      for(let i=0;i<8;i++) de.push([i,(i+1)%8]);
      for(let i=0;i<8;i++) de.push([i,i+8]);
      for(let i=8;i<16;i++) de.push([i,i===15?8:i+1]);
      for(let i=8;i<16;i++) de.push([i,16]);
      for(let i=8;i<16;i++) de.push([i,((i+1)%8)+8]);

      const floatingParticles = [];
      for (let i=0; i<120; i++) floatingParticles.push(new FloatingParticle(W, H));

      sceneRef.current = {
        gridItems,
        gridMultiplied: false,
        gridPhase2: [],
        gridPhase3: [],
        createGrid,
        tools,
        stonePoints, stoneChips:[], stoneChipCount:0, stoneSmooth:0,
        diamond,
        orbitalAngle: 0,
        heroNavX: CX, heroNavY: CY, heroNavTX: CX, heroNavTY: CY, heroNavTimer:0,
        floatingParticles,
        explosionParticles: [],
        shatterFragments: [],
        finalBurstParticles: [],
        finalBurstTriggered: false,
      };
    }

    const scene = sceneRef.current;
    const breathe = 1 + Math.sin(fc*0.04)*0.04;

    ctx.fillStyle = '#050505';
    ctx.fillRect(0,0,W,H);

    const bgGridOpacity = time < T3 ? 0.03 :
                         time < T4 ? 0.02 :
                         time < T5 ? 0.025 :
                         time < T6 ? 0.03 :
                         time < T7 ? 0.02 : 0.015;
    drawBackgroundGrid(ctx, W, H, time, bgGridOpacity);

    if (time < T3 || (time >= T5 && time < T6)) {
      scene.floatingParticles.forEach(p => { p.update(W, H, 0.6); p.draw(ctx); });
    }

    scene.explosionParticles = scene.explosionParticles.filter(p => p.life > 0);
    scene.explosionParticles.forEach(p => { p.update(); p.draw(ctx); });

    scene.shatterFragments = scene.shatterFragments.filter(p => p.life > 0);
    scene.shatterFragments.forEach(p => { p.update(); p.draw(ctx); });

    scene.finalBurstParticles = scene.finalBurstParticles.filter(p => p.life > 0);
    scene.finalBurstParticles.forEach(p => { p.update(); p.draw(ctx); });

    // ================================================================
    // PHASE 1 (0–8.06s)
    // ================================================================
    if (time < T3) {
      scene.gridItems.forEach(g => { g.angle += g.rotSpeed * 1.0; });

      // 1A (0–1.12s)
      if (time < T1) {
        const t1A = time / T1;
        const gridAlpha = Easing.easeOutCubic(t1A) * 0.28;
        scene.gridItems.forEach(g => {
          if (g.type === 'box') drawWireBox(ctx, g.cx, g.cy, g.size, g.angle, gridAlpha);
          else if (g.type === 'triangle') drawTriangle(ctx, g.cx, g.cy, g.size, g.angle, gridAlpha);
          else drawHexagon(ctx, g.cx, g.cy, g.size, g.angle, gridAlpha);
        });
        const heroOp = Easing.easeOutCubic(t1A) * 0.6;
        drawHero(ctx, CX, CY, 42*breathe, heroOp, 1, 1, 25);
      }

      // 1B (1.12–4.08s)
      else if (time < T2) {
        const t1B = (time-T1)/(T2-T1);
        if (!scene.gridMultiplied && t1B >= 0.30) {
          scene.gridPhase2 = scene.createGrid(8, 12, W, H);
          scene.gridMultiplied = true;
        }
        const gridAlpha = (0.28 + t1B*0.06);
        scene.gridItems.forEach(g => {
          if (g.type === 'box') drawWireBox(ctx, g.cx, g.cy, g.size, g.angle, gridAlpha);
          else if (g.type === 'triangle') drawTriangle(ctx, g.cx, g.cy, g.size, g.angle, gridAlpha);
          else drawHexagon(ctx, g.cx, g.cy, g.size, g.angle, gridAlpha);
        });
        if (scene.gridMultiplied && scene.gridPhase2.length > 0) {
          const fadeT = Math.min(1, (t1B - 0.30) / 0.25);
          const phase2Alpha = Easing.easeOutCubic(fadeT) * gridAlpha * 0.7;
          scene.gridPhase2.forEach(g => {
            g.angle += g.rotSpeed * 0.75;
            if (g.type === 'box') drawWireBox(ctx, g.cx, g.cy, g.size, g.angle, phase2Alpha);
            else if (g.type === 'triangle') drawTriangle(ctx, g.cx, g.cy, g.size, g.angle, phase2Alpha);
            else drawHexagon(ctx, g.cx, g.cy, g.size, g.angle, phase2Alpha);
          });
        }
        const orbitalNodes = [];
        for (let i=0;i<4;i++){
          const na = (Math.PI*2*i)/4 + t1B*Math.PI*1.5;
          const nr = 140+i*20;
          const nx = CX+Math.cos(na)*nr, ny = CY+Math.sin(na)*nr;
          orbitalNodes.push({x: nx, y: ny});
          ctx.save();
          ctx.globalAlpha = Easing.easeOutCubic(t1B)*0.5;
          ctx.strokeStyle='rgba(255,255,255,0.3)'; ctx.lineWidth=1;
          ctx.beginPath(); ctx.moveTo(CX,CY); ctx.lineTo(nx,ny); ctx.stroke();
          ctx.fillStyle='#ffffff';
          ctx.shadowBlur=8; ctx.shadowColor='rgba(255,255,255,0.9)';
          ctx.beginPath(); ctx.arc(nx,ny,7,0,Math.PI*2); ctx.fill();
          ctx.shadowBlur=0; ctx.restore();
        }
        orbitalNodes.forEach(node => {
          scene.gridItems.forEach(g => {
            drawConnectionLine(ctx, node.x, node.y, g.cx, g.cy, Easing.easeOutCubic(t1B), 200);
          });
        });
        drawHero(ctx, CX, CY, 46*breathe, 1, 1, 1, 35);
      }

      // 1C (4.08–8.06s): 8 pills con shatter + triple grid
      else {
        const t1C = (time-T2)/(T3-T2);

        if (scene.gridPhase3.length === 0 && t1C >= 0.20) {
          scene.gridPhase3 = scene.createGrid(10, 15, W, H);
        }

        const gridAlpha = 0.34 + t1C*0.08;
        scene.gridItems.forEach(g => {
          if (g.type === 'box') drawWireBox(ctx, g.cx, g.cy, g.size, g.angle, gridAlpha);
          else if (g.type === 'triangle') drawTriangle(ctx, g.cx, g.cy, g.size, g.angle, gridAlpha);
          else drawHexagon(ctx, g.cx, g.cy, g.size, g.angle, gridAlpha);
        });
        if (scene.gridPhase2.length > 0) {
          scene.gridPhase2.forEach(g => {
            g.angle += g.rotSpeed * 0.75;
            if (g.type === 'box') drawWireBox(ctx, g.cx, g.cy, g.size, g.angle, gridAlpha*0.75);
            else if (g.type === 'triangle') drawTriangle(ctx, g.cx, g.cy, g.size, g.angle, gridAlpha*0.75);
            else drawHexagon(ctx, g.cx, g.cy, g.size, g.angle, gridAlpha*0.75);
          });
        }
        if (scene.gridPhase3.length > 0) {
          const fadeT = Math.min(1, (t1C - 0.20) / 0.30);
          const phase3Alpha = Easing.easeOutCubic(fadeT) * gridAlpha * 0.55;
          scene.gridPhase3.forEach(g => {
            g.angle += g.rotSpeed * 0.50;
            if (g.type === 'box') drawWireBox(ctx, g.cx, g.cy, g.size, g.angle, phase3Alpha);
            else if (g.type === 'triangle') drawTriangle(ctx, g.cx, g.cy, g.size, g.angle, phase3Alpha);
            else drawHexagon(ctx, g.cx, g.cy, g.size, g.angle, phase3Alpha);
          });
        }

        const pillData = [
          { label:'HORAS',        show:[0.00, 0.18], pos:{ x:CX-180, y:CY-480 }, shattered:false },
          { label:'ESTRATEGIAS',  show:[0.10, 0.28], pos:{ x:CX+220, y:CY+440 }, shattered:false },
          { label:'APPS',         show:[0.18, 0.36], pos:{ x:CX+260, y:CY-360 }, shattered:false },
          { label:'HERRAMIENTAS', show:[0.26, 0.44], pos:{ x:CX-120, y:CY-640 }, shattered:false },
          { label:'EMAILS',       show:[0.34, 0.52], pos:{ x:CX-240, y:CY+350 }, shattered:false },
          { label:'REUNIONES',    show:[0.42, 0.60], pos:{ x:CX+190, y:CY-530 }, shattered:false },
          { label:'CURSOS',       show:[0.50, 0.68], pos:{ x:CX-200, y:CY+560 }, shattered:false },
          { label:'TAREAS',       show:[0.58, 0.76], pos:{ x:CX+230, y:CY+220 }, shattered:false },
        ];

        pillData.forEach((p, idx) => {
          if (t1C >= p.show[0] && t1C <= p.show[1]) {
            const local = (t1C-p.show[0])/(p.show[1]-p.show[0]);
            const pAlpha = local < 0.10 ? local/0.10 : local > 0.70 ? Math.max(0,(1-(local-0.70)/0.30)) : 1;
            drawPill(ctx, p.pos.x, p.pos.y, p.label, pAlpha*0.9);
            if (local > 0.90 && local < 0.92 && !pillData[idx].shattered) {
              pillData[idx].shattered = true;
              for (let j=0; j<12; j++) {
                const angle = (Math.PI*2*j/12) + (Math.random()-0.5)*0.4;
                const speed = 6 + Math.random() * 8;
                scene.shatterFragments.push(new ShatterFragment(p.pos.x, p.pos.y, angle, speed));
              }
            }
          } else {
            if (!pillData[idx].shattered) pillData[idx].shattered = false;
          }
        });

        const strX = 1-t1C*0.36, strY = 1+t1C*0.40;
        const hGlow = 38-t1C*16;
        const hShake = t1C*6;
        const sx2 = hShake>0 ? (Math.random()-0.5)*hShake : 0;
        const sy2 = hShake>0 ? (Math.random()-0.5)*hShake : 0;
        const glitchIntensity = t1C > 0.7 ? (t1C - 0.7) / 0.3 * 2 : 0;
        drawHero(ctx, CX+sx2, CY+sy2, 46*breathe, 1, strX, strY, hGlow, glitchIntensity);
      }

      setStatus('Fase 1: Acumulación');
    }

    // ================================================================
    // PHASE 2 (8.06–13.16s)
    // ================================================================
    else if (time < T4) {
      const t2 = (time-T3)/(T4-T3);
      const FREEZE = 0.06, SLAM = 0.14, EXPLODE = 0.22, EQ1 = 0.34, EQ2 = 0.56;

      const gridFade = Math.max(0, 1-t2/FREEZE);
      if (gridFade > 0) {
        const allGrids = [...scene.gridItems, ...scene.gridPhase2, ...scene.gridPhase3];
        allGrids.forEach((g, idx) => {
          const layerSpeed = idx < scene.gridItems.length ? 1.0 :
                            idx < scene.gridItems.length + scene.gridPhase2.length ? 0.75 : 0.50;
          g.angle += g.rotSpeed * layerSpeed;
          const alpha = 0.38*gridFade;
          if (g.type === 'box') drawWireBox(ctx,g.cx,g.cy,g.size,g.angle,alpha);
          else if (g.type === 'triangle') drawTriangle(ctx,g.cx,g.cy,g.size,g.angle,alpha);
          else drawHexagon(ctx,g.cx,g.cy,g.size,g.angle,alpha);
        });
      }

      let shX=0, shY=0;
      if (t2>=FREEZE && t2<SLAM+0.05) {
        const d = Math.max(0,1-(t2-FREEZE)/0.08);
        shX=(Math.random()-0.5)*18*d; shY=(Math.random()-0.5)*12*d;
      }
      ctx.save(); ctx.translate(shX, shY);

      if (t2 >= FREEZE) {
        const slamT = Easing.easeOutBack(Math.min(1,(t2-FREEZE)/(SLAM-FREEZE)));
        const falsoFade = t2>=EQ1 ? Math.max(0,1-(t2-EQ1)/0.14) : 1;
        ctx.save();
        ctx.globalAlpha = falsoFade;
        ctx.translate(CX, CY-160); ctx.scale(slamT,slamT);
        ctx.shadowBlur=70; ctx.shadowColor='rgba(255,255,255,0.9)';
        ctx.font='900 220px Montserrat, sans-serif';
        ctx.fillStyle='#ffffff'; ctx.textAlign='center'; ctx.textBaseline='middle';
        ctx.fillText('FALSO',0,0);
        ctx.shadowBlur=0; ctx.restore();

        if (t2 < SLAM) {
          const fT = (t2-FREEZE)/(SLAM-FREEZE);
          ctx.save(); ctx.globalAlpha=Math.max(0,(1-fT*3.5))*0.5;
          ctx.fillStyle='#ffffff'; ctx.fillRect(0,0,W,H); ctx.restore();
        }
      }
      ctx.restore();

      if (t2 >= EXPLODE) {
        const heroT = Easing.easeOutCubic(Math.min(1,(t2-EXPLODE)/0.12));
        const orbOp = Easing.easeOutCubic(Math.min(1,(t2-EXPLODE-0.05)/0.15));
        scene.orbitalAngle += 0.008;
        drawOrbitalRing(ctx, CX, CY+80, 160, 55, scene.orbitalAngle, orbOp);
        const glitchIntensity = (t2 < SLAM && t2 > FREEZE) ? (SLAM - t2) / (SLAM - FREEZE) * 4 : 0;
        drawHero(ctx, CX, CY+80, 50*breathe, heroT, 1, 1, 50+t2*22, glitchIntensity);
        if (t2 >= 0.50) {
          for (let r=0;r<3;r++) {
            const rP=((t2-0.50)/0.50*1.4+r*0.33)%1;
            ctx.save(); ctx.globalAlpha=(1-rP)*0.22;
            ctx.strokeStyle='#ffffff'; ctx.lineWidth=1;
            ctx.beginPath(); ctx.arc(CX,CY+80,rP*300,0,Math.PI*2); ctx.stroke();
            ctx.restore();
          }
        }
      }

      if (t2 >= EQ1) {
        const e1T=Easing.easeOutCubic(Math.min(1,(t2-EQ1)/0.10));
        const e1F=t2>=EQ2?Math.max(0,1-(t2-EQ2)/0.16):1;
        ctx.save(); ctx.globalAlpha=e1T*e1F;
        ctx.font='700 78px Montserrat, sans-serif'; ctx.fillStyle='#ffffff';
        ctx.textAlign='center'; ctx.textBaseline='middle';
        ctx.shadowBlur=20; ctx.shadowColor='rgba(255,255,255,0.4)';
        ctx.fillText('SUMA ≠ ÉXITO', CX, CY-420);
        ctx.shadowBlur=0; ctx.restore();
      }
      if (t2 >= EQ2) {
        const e2T=Easing.easeOutBack(Math.min(1,(t2-EQ2)/0.12));
        ctx.save(); ctx.globalAlpha=e2T;
        ctx.font='700 78px Montserrat, sans-serif'; ctx.fillStyle='#ffffff';
        ctx.textAlign='center'; ctx.textBaseline='middle';
        ctx.shadowBlur=28; ctx.shadowColor='rgba(255,255,255,0.55)';
        ctx.fillText('ÉXITO = RESTA', CX, CY-310);
        ctx.shadowBlur=0; ctx.restore();
      }

      setStatus('Fase 2: FALSO');
    }

    // ================================================================
    // PHASE 3 (13.16–18.20s)
    // ================================================================
    else if (time < T5) {
      const t3 = (time-T4)/(T5-T4);
      scene.stoneSmooth = Easing.easeInOutCubic(Math.min(1, t3*1.05));
      const stoneOp = Easing.easeOutCubic(Math.min(1, t3/0.12));
      const chipInterval = 0.05;
      const numChips = Math.floor(t3/chipInterval);
      if (numChips > scene.stoneChipCount) {
        scene.stoneChipCount = numChips;
        const ip = scene.stonePoints[numChips % scene.stonePoints.length];
        const r = ip.roughR + (ip.smoothR-ip.roughR)*scene.stoneSmooth;
        const ix = CX+Math.cos(ip.baseAngle)*r, iy = CY+Math.sin(ip.baseAngle)*r;
        for (let j=0;j<7;j++) {
          const ang = ip.baseAngle+(Math.random()-0.5)*1.8;
          const sp = 3.5+Math.random()*5.5;
          scene.stoneChips.push({ x:ix,y:iy,vx:Math.cos(ang)*sp,vy:Math.sin(ang)*sp-1,size:5+Math.random()*12,life:1,decay:0.013+Math.random()*0.018 });
        }
      }
      scene.stoneChips.forEach(c => {
        c.x+=c.vx*1.4; c.y+=c.vy*1.4; c.vy+=0.18; c.vx*=0.97; c.life-=c.decay;
        if (c.life>0) {
          ctx.save(); ctx.globalAlpha=Math.max(0,c.life)*stoneOp;
          ctx.fillStyle='#ffffff';
          ctx.beginPath(); ctx.moveTo(c.x,c.y-c.size/2); ctx.lineTo(c.x+c.size/3,c.y+c.size/2); ctx.lineTo(c.x-c.size/3,c.y+c.size/2); ctx.closePath(); ctx.fill();
          ctx.restore();
        }
      });
      if (stoneOp > 0) {
        ctx.save();
        ctx.globalAlpha = stoneOp * (1-scene.stoneSmooth*0.75);
        ctx.strokeStyle='#ffffff'; ctx.lineWidth=3;
        ctx.shadowBlur=15; ctx.shadowColor='rgba(255,255,255,0.3)';
        ctx.beginPath();
        scene.stonePoints.forEach((p,i) => {
          const r = p.roughR+(p.smoothR-p.roughR)*scene.stoneSmooth;
          const px=CX+Math.cos(p.baseAngle)*r, py=CY+Math.sin(p.baseAngle)*r;
          if (i===0) ctx.moveTo(px,py); else ctx.lineTo(px,py);
        });
        ctx.closePath(); ctx.stroke();
        ctx.shadowBlur=0; ctx.restore();
        const fp=(t3%chipInterval)/chipInterval;
        if (fp<0.16 && numChips>0) {
          const ip2=scene.stonePoints[numChips%scene.stonePoints.length];
          const ir=ip2.roughR+(ip2.smoothR-ip2.roughR)*scene.stoneSmooth;
          const ix2=CX+Math.cos(ip2.baseAngle)*ir, iy2=CY+Math.sin(ip2.baseAngle)*ir;
          ctx.save(); ctx.globalAlpha=(1-fp/0.16)*0.65;
          const fg=ctx.createRadialGradient(ix2,iy2,0,ix2,iy2,70);
          fg.addColorStop(0,'rgba(255,255,255,1)'); fg.addColorStop(1,'rgba(255,255,255,0)');
          ctx.fillStyle=fg; ctx.beginPath(); ctx.arc(ix2,iy2,70,0,Math.PI*2); ctx.fill();
          ctx.restore();
        }
      }
      if (t3 >= 0.65) {
        const eT=Easing.easeOutCubic((t3-0.65)/0.35);
        scene.orbitalAngle += 0.007;
        drawOrbitalRing(ctx, CX, CY, 155, 52, scene.orbitalAngle, eT*0.8);
        drawHero(ctx, CX, CY, 55*breathe, eT, 1, 1, 40+eT*30);
      }
      setStatus('Fase 3: La Estatua');
    }

    // ================================================================
    // PHASE 4 (18.20–32.06s)
    // ================================================================
    else if (time < T6) {
      const t4 = (time-T5)/(T6-T5);
      const ELIM_START = 0.16;

      scene.heroNavTimer -= 0.016;
      if (scene.heroNavTimer <= 0) {
        scene.heroNavTX = CX+(Math.random()-0.5)*300;
        scene.heroNavTY = CY+(Math.random()-0.5)*380;
        scene.heroNavTimer = 1.8+Math.random()*1.4;
      }
      scene.heroNavX += (scene.heroNavTX-scene.heroNavX)*0.018;
      scene.heroNavY += (scene.heroNavTY-scene.heroNavY)*0.018;

      const elimCount = scene.tools.filter(t=>t.eliminated).length;
      const heroR = 52+elimCount*3;
      const heroGlow = 40+elimCount*6;

      scene.orbitalAngle += 0.006;
      const ELIM_INTERVAL = 0.60;
      let justEliminated = false;

      scene.tools.forEach((tool, i) => {
        tool.orbitAngle = (tool.orbitAngle || (Math.PI*2*i)/scene.tools.length);
        tool.orbitAngle += 0.005;
        const orX = CX+Math.cos(tool.orbitAngle)*tool.orbitRadius;
        const orY = CY+Math.sin(tool.orbitAngle)*tool.orbitRadius;

        const elimTime = T5+(T6-T5)*ELIM_START+i*ELIM_INTERVAL;
        if (time >= elimTime && !tool.eliminated) {
          tool.eliminated = true;
          justEliminated = true;
          for (let j=0; j<25; j++) {
            const angle = (Math.PI*2*j/25) + (Math.random()-0.5)*0.3;
            const speed = 4 + Math.random() * 6;
            const size = 3 + Math.random() * 5;
            const shapeRand = Math.random();
            const shape = shapeRand < 0.4 ? 'rect' : shapeRand < 0.7 ? 'circle' : 'line';
            scene.explosionParticles.push(new ExplosionParticle(orX, orY, angle, speed, size, shape));
          }
        }

        if (tool.eliminated) {
          tool.strikeP = Math.min(1, tool.strikeP+0.06);
          tool.elimProgress = Math.min(1, tool.elimProgress+0.024);
          const tOp = Math.max(0, 1-tool.elimProgress*1.5);
          if (tOp > 0) drawPill(ctx, orX, orY, tool.label, tOp, 1, true, tool.strikeP);
        } else {
          const rank = i - elimCount;
          if (rank < 3) {
            drawPill(ctx, orX, orY, tool.label, 0.7, 1);
            drawConnectionLine(ctx, scene.heroNavX, scene.heroNavY, orX, orY, 0.8, 400);
          }
        }
      });

      drawOrbitalRing(ctx, scene.heroNavX, scene.heroNavY, heroR*2.8, heroR*0.95, scene.orbitalAngle*1.3, 0.6);
      const vibGlitch = justEliminated ? 1.5 : 0;
      drawHero(ctx, scene.heroNavX, scene.heroNavY, heroR*breathe, 1, 1, 1, heroGlow, vibGlitch);

      // ❌ "HACER MÁS" y contador OMITIDOS — se añaden en CapCut

      setStatus('Fase 4: Eliminando');
    }

    // ================================================================
    // PHASE 5 (32.06–34.09s)
    // ================================================================
    else if (time < T7) {
      const t5 = (time-T6)/(T7-T6);

      if (!scene.finalBurstTriggered) {
        scene.finalBurstTriggered = true;
        for (let i=0; i<400; i++) {
          const angle = (Math.PI*2*i/400) + (Math.random()-0.5)*0.2;
          const speed = 8 + Math.random() * 22;
          const size = 2 + Math.random() * 6;
          const shapeRand = Math.random();
          const shape = shapeRand < 0.5 ? 'rect' : shapeRand < 0.75 ? 'circle' : 'line';
          scene.finalBurstParticles.push(new ExplosionParticle(CX, CY, angle, speed, size, shape));
        }
      }

      const heroR = 56+t5*32;
      scene.orbitalAngle += 0.012;
      drawOrbitalRing(ctx, CX, CY, heroR*3.2, heroR*1.1, scene.orbitalAngle, 1-t5*0.5);
      for (let r=0;r<4;r++) {
        const rP=((t5*1.7+r*0.25)%1);
        ctx.save(); ctx.globalAlpha=(1-rP)*0.35;
        ctx.strokeStyle='#ffffff'; ctx.lineWidth=1.5;
        ctx.beginPath(); ctx.arc(CX,CY,rP*580,0,Math.PI*2); ctx.stroke();
        ctx.restore();
      }
      drawHero(ctx, CX, CY, heroR*breathe, 1, 1, 1, 85+t5*90);
      if (t5 >= 0.70) {
        const fT = Easing.easeInQuart(Math.min(1,(t5-0.70)/0.30));
        ctx.save(); ctx.globalAlpha=fT; ctx.fillStyle='#050505';
        ctx.fillRect(0,0,W,H); ctx.restore();
      }
      setStatus('Fase 5: Lo inevitable');
    }

    // ================================================================
    // FIRMA (34.09–37.08s)
    // ================================================================
    else if (time < T8) {
      const t = (time-T7)/(T8-T7);
      const slideP = Easing.easeOutQuart(Math.min(1, t/0.08));
      const cardOpacity = slideP;
      const cardOffsetY = (1-slideP) * 180;
      const lightTime = time - T7;
      const breathe = 0.93 + Math.sin(lightTime*0.6)*0.07;
      const lightX = CX + 220 - t*480;
      const lightY = CY + 420 - t*520;

      ctx.fillStyle = '#050505';
      ctx.fillRect(0,0,W,H);
      drawSignatureCard(ctx, W, H, CX, CY, cardOpacity, cardOffsetY, lightX, lightY, breathe, scene);
      setStatus('Firma: Eliminación Radical');
    }

    // ================================================================
    // HOLD FINAL
    // ================================================================
    else {
      const breatheF = 0.93 + Math.sin((time-T8)*0.6)*0.07;
      const holdLX = CX - 260;
      const holdLY = CY - 100;
      ctx.fillStyle = '#050505';
      ctx.fillRect(0,0,W,H);
      drawSignatureCard(ctx, W, H, CX, CY, 1, 0, holdLX, holdLY, breatheF, scene);
      setStatus('Animación completada');
    }

    drawFilmGrain(ctx, W, H, 0.08, fc);

    if (time < DURATION) {
      animationFrameRef.current = requestAnimationFrame(update);
    } else {
      setIsPlaying(false);
      setStatus('Animación completada');
    }
  };

  const play = () => {
    if (startTimeRef.current === null) startTimeRef.current = performance.now();
    setIsPlaying(true); update();
  };
  const pause = () => {
    setIsPlaying(false);
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
  };
  const restart = () => {
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    startTimeRef.current = null; sceneRef.current = null;
    setProgress(0); setIsPlaying(false);
    const canvas = canvasRef.current;
    if (canvas) { const ctx=canvas.getContext('2d'); if(ctx){ctx.fillStyle='#050505';ctx.fillRect(0,0,canvas.width,canvas.height);} }
    setStatus('Reiniciado');
    setTimeout(()=>play(), 100);
  };
  const startRecording = () => {
    const canvas = canvasRef.current;
    if (!canvas || isRecording) return;
    restart(); setIsRecording(true); recordedChunksRef.current=[];
    const stream = canvas.captureStream(60);
    const opts = { mimeType:'video/webm;codecs=vp9', videoBitsPerSecond:30000000 };
    try { mediaRecorderRef.current = new MediaRecorder(stream, opts); }
    catch { mediaRecorderRef.current = new MediaRecorder(stream); }
    mediaRecorderRef.current.ondataavailable = e => { if(e.data.size>0) recordedChunksRef.current.push(e.data); };
    mediaRecorderRef.current.onstop = () => {
      const blob=new Blob(recordedChunksRef.current,{type:'video/webm'});
      const url=URL.createObjectURL(blob);
      const a=document.createElement('a'); a.href=url;
      a.download='dia7-v6-eliminacion-radical-38s-60fps.webm';
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      URL.revokeObjectURL(url); setIsRecording(false); setStatus('Grabación descargada');
    };
    mediaRecorderRef.current.start();
    setTimeout(()=>{ if(mediaRecorderRef.current?.state==='recording') mediaRecorderRef.current.stop(); }, DURATION*1000+600);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha:false });
    if (!ctx) return;
    const CX=canvas.width/2, CY=canvas.height/2;
    ctx.fillStyle='#050505'; ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.shadowBlur=40; ctx.shadowColor='rgba(197,160,89,0.6)';
    ctx.font='bold 52px Montserrat, sans-serif'; ctx.fillStyle='#ffffff';
    ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.fillText('Día 7 · v6', CX, CY-90); ctx.shadowBlur=0;
    ctx.font='32px Montserrat, sans-serif'; ctx.fillStyle='rgba(255,255,255,0.7)';
    ctx.fillText('Dan Koe Style · Sin subtítulos', CX, CY+10);
    ctx.font='22px Montserrat, sans-serif'; ctx.fillStyle='rgba(255,255,255,0.4)';
    ctx.fillText('Presiona ▶ Reproducir para comenzar', CX, CY+100);
    return () => { if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current); };
  }, []);

  useEffect(() => { if (isPlaying) update(); }, [isPlaying]);

  return (
    <div className="app">
      <div className="container">
        <canvas ref={canvasRef} width={1080} height={1920} className="canvas" />
        <div className="progress-bar"><div className="progress-fill" style={{width:`${progress}%`}} /></div>
        <div className="controls">
          <button onClick={isPlaying ? pause : play} disabled={isRecording}>{isPlaying?'⏸ Pausar':'▶ Reproducir'}</button>
          <button onClick={restart} disabled={isRecording}>↻ Reiniciar</button>
          <button onClick={startRecording} disabled={isRecording}>{isRecording?'⬤ Grabando...':'⬤ Grabar (38s)'}</button>
        </div>
        <div className="info" suppressHydrationWarning>
          <div className="status" suppressHydrationWarning>{status}</div>
          <div>1080×1920 · 60FPS · 38s · v6 (Dan Koe Style)</div>
        </div>
      </div>
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600;700;900&display=swap');
        *{margin:0;padding:0;box-sizing:border-box;}
        .app{background:linear-gradient(135deg,#0a0a0f 0%,#1a1a1f 100%);display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;font-family:'Montserrat',sans-serif;color:#fff;padding:20px;}
        .container{display:flex;flex-direction:column;align-items:center;gap:20px;max-width:100%;}
        .canvas{background:#000;border-radius:8px;box-shadow:0 0 40px rgba(197,160,89,0.2),0 0 80px rgba(197,160,89,0.1);max-height:80vh;max-width:100%;aspect-ratio:9/16;}
        .progress-bar{width:100%;max-width:540px;height:4px;background:rgba(255,255,255,0.1);border-radius:2px;}
        .progress-fill{height:100%;background:#C5A059;border-radius:2px;transition:width 0.1s linear;}
        .controls{display:flex;gap:12px;flex-wrap:wrap;justify-content:center;}
        button{padding:14px 28px;font-size:15px;font-weight:700;background:rgba(255,255,255,0.08);color:#fff;border:1px solid rgba(255,255,255,0.2);border-radius:8px;cursor:pointer;font-family:'Montserrat',sans-serif;transition:all 0.2s;}
        button:hover:not(:disabled){background:rgba(197,160,89,0.2);border-color:#C5A059;}
        button:disabled{opacity:0.4;cursor:not-allowed;}
        .info{text-align:center;font-size:14px;color:rgba(255,255,255,0.5);line-height:1.8;}
        .status{color:rgba(255,255,255,0.85);font-weight:600;font-size:15px;}
      `}</style>
    </div>
  );
}
