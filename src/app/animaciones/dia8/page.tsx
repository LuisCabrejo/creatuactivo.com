'use client';

import React, { useRef, useState, useEffect } from 'react';

// ── DÍA 8: LA LEY DE LA PALANCA ──────────────────────────────────────────────
// Basado en Dan Koe v10 (dia7-v6)
// Sin subtítulos — se añaden en CapCut
// 4 Actos:
//   Acto 1 (0–10s):  Héroe empujando bloque pesado (trabajo lineal)
//   Acto 2 (10–16s): Bloque revierte, colapso
//   Acto 3 (16–25s): Palanca dibujada como plano arquitectónico
//   Acto 4 (25–34s): Héroe salta, bloque vuela, nodos de red emergen
//   Firma  (34–38s): CREA TU ACTIVO / EL APALANCAMIENTO / LUIS CABREJO

export default function Dia8() {
  const canvasRef       = useRef(null);
  const [isPlaying,   setIsPlaying]   = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [progress,    setProgress]    = useState(0);
  const [status,      setStatus]      = useState('Listo para reproducir');

  const animationFrameRef = useRef(null);
  const startTimeRef      = useRef(null);
  const mediaRecorderRef  = useRef(null);
  const recordedChunksRef = useRef([]);
  const sceneRef          = useRef(null);

  const FPS      = 60;
  const DURATION = 38;

  // Timing constants (absolute seconds)
  const T1 = 10.0;  // Acto 1 → 2
  const T2 = 16.0;  // Acto 2 → 3
  const T3 = 25.0;  // Acto 3 → 4
  const T4 = 34.0;  // Acto 4 → Firma
  const T5 = 37.0;  // Firma  → Hold

  // Lever geometry (canvas 1080×1920, CX=540)
  const PVT_X = 540;   // pivot X
  const PVT_Y = 1220;  // pivot Y
  const LEV_L = 420;   // left arm length
  const LEV_R = 300;   // right arm length
  const MAX_TILT = -0.26; // radians (CCW: left goes DOWN, right goes UP)
  const BLOCK_SZ = 150;

  const Easing = {
    easeOutExpo:    (x) => x === 1 ? 1 : 1 - Math.pow(2, -10 * x),
    easeOutBack:    (x) => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(x-1,3) + c1 * Math.pow(x-1,2); },
    easeOutQuad:    (x) => 1 - (1-x)*(1-x),
    easeInQuart:    (x) => x*x*x*x,
    easeOutQuart:   (x) => 1 - Math.pow(1-x,4),
    easeOutCubic:   (x) => 1 - Math.pow(1-x,3),
    easeInOutCubic: (x) => x < 0.5 ? 4*x*x*x : 1 - Math.pow(-2*x+2,3)/2,
    easeInOutSine:  (x) => -(Math.cos(Math.PI * x) - 1) / 2,
  };

  // ── Utilidades ──────────────────────────────────────────────────────────────

  const drawFilmGrain = (ctx, W, H, intensity, fc) => {
    const grainSize = 2;
    const cols = Math.floor(W / grainSize);
    const rows = Math.floor(H / grainSize);
    const grainSeed = Math.floor(fc / 3);
    ctx.save(); ctx.globalAlpha = intensity; ctx.fillStyle = '#ffffff';
    for (let i = 0; i < cols * rows * 0.015; i++) {
      const seed = (grainSeed * 9301 + i * 49297) % 233280;
      const rnd  = seed / 233280.0;
      const x    = (rnd * cols) * grainSize;
      const y    = ((seed * 0.397) % rows) * grainSize;
      ctx.fillRect(x, y, grainSize, grainSize);
    }
    ctx.restore();
  };

  const drawBackgroundGrid = (ctx, W, H, time, opacity) => {
    ctx.save(); ctx.globalAlpha = opacity;
    ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 0.5;
    const gs = 120;
    const ox = (time * 15) % gs, oy = (time * 10) % gs;
    for (let x = -gs + ox; x < W + gs; x += gs) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke(); }
    for (let y = -gs + oy; y < H + gs; y += gs) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }
    ctx.restore();
  };

  class FloatingParticle {
    constructor(W, H) {
      this.x = Math.random() * W; this.y = Math.random() * H;
      this.vx = (Math.random()-0.5)*0.8; this.vy = (Math.random()-0.5)*0.8;
      this.size = 1 + Math.random()*3; this.opacity = 0.1 + Math.random()*0.2;
      const sr = Math.random();
      if (sr < 0.4) { this.shape = 'circle'; }
      else if (sr < 0.6) { this.shape='line'; this.lineLength=8+Math.random()*12; this.lineAngle=Math.random()*Math.PI*2; this.lineRotSpeed=(Math.random()-0.5)*0.03; }
      else if (sr < 0.8) { this.shape='dot'; this.size=1+Math.random()*1.5; }
      else { this.shape='square'; this.rotation=Math.random()*Math.PI*2; this.rotSpeed=(Math.random()-0.5)*0.05; }
    }
    update(W, H, spd=1) {
      this.x += this.vx*spd; this.y += this.vy*spd;
      if (this.shape==='line') this.lineAngle+=this.lineRotSpeed;
      else if (this.shape==='square') this.rotation+=this.rotSpeed;
      if (this.x<0) this.x=W; if (this.x>W) this.x=0;
      if (this.y<0) this.y=H; if (this.y>H) this.y=0;
    }
    draw(ctx) {
      ctx.save(); ctx.globalAlpha=this.opacity; ctx.fillStyle='#ffffff'; ctx.strokeStyle='#ffffff';
      if (this.shape==='circle') { ctx.beginPath(); ctx.arc(this.x,this.y,this.size,0,Math.PI*2); ctx.fill(); }
      else if (this.shape==='line') { ctx.lineWidth=1; const x1=this.x+Math.cos(this.lineAngle)*this.lineLength/2, y1=this.y+Math.sin(this.lineAngle)*this.lineLength/2, x2=this.x-Math.cos(this.lineAngle)*this.lineLength/2, y2=this.y-Math.sin(this.lineAngle)*this.lineLength/2; ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke(); }
      else if (this.shape==='dot') { ctx.fillRect(this.x-this.size/2,this.y-this.size/2,this.size,this.size); }
      else { ctx.translate(this.x,this.y); ctx.rotate(this.rotation); ctx.fillRect(-this.size/2,-this.size/2,this.size,this.size); }
      ctx.restore();
    }
  }

  class ExplosionParticle {
    constructor(x, y, angle, speed, size, shape='rect') {
      this.x=x; this.y=y;
      this.vx=Math.cos(angle)*speed; this.vy=Math.sin(angle)*speed;
      this.size=size; this.life=1;
      this.decay=0.018+Math.random()*0.012;
      this.rotation=Math.random()*Math.PI*2; this.rotationSpeed=(Math.random()-0.5)*0.3;
      this.shape=shape;
    }
    update() { this.x+=this.vx; this.y+=this.vy; this.vy+=0.15; this.vx*=0.98; this.rotation+=this.rotationSpeed; this.life-=this.decay; }
    draw(ctx) {
      if (this.life<=0) return;
      ctx.save(); ctx.globalAlpha=Math.max(0,this.life); ctx.translate(this.x,this.y); ctx.rotate(this.rotation); ctx.fillStyle='#ffffff';
      if (this.shape==='circle') { ctx.beginPath(); ctx.arc(0,0,this.size/2,0,Math.PI*2); ctx.fill(); }
      else if (this.shape==='line') { ctx.strokeStyle='#ffffff'; ctx.lineWidth=1.5; ctx.beginPath(); ctx.moveTo(-this.size,0); ctx.lineTo(this.size,0); ctx.stroke(); }
      else { ctx.fillRect(-this.size/2,-this.size/2,this.size,this.size*0.6); }
      ctx.restore();
    }
  }

  // ── Héroe (idéntico a dia7-v6) ───────────────────────────────────────────────
  const drawHero = (ctx, x, y, r, opacity, sx=1, sy=1, glow=40, glitch=0) => {
    ctx.save(); ctx.globalAlpha=opacity*0.25;
    const a1=ctx.createRadialGradient(x,y,r*0.8,x,y,r*5);
    a1.addColorStop(0,'rgba(255,255,255,0.5)'); a1.addColorStop(1,'rgba(255,255,255,0)');
    ctx.fillStyle=a1; ctx.beginPath(); ctx.arc(x,y,r*5,0,Math.PI*2); ctx.fill(); ctx.restore();

    ctx.save(); ctx.globalAlpha=opacity*0.55;
    const a2=ctx.createRadialGradient(x,y,r*0.6,x,y,r*1.8);
    a2.addColorStop(0,'rgba(255,255,255,0.7)'); a2.addColorStop(1,'rgba(255,255,255,0)');
    ctx.fillStyle=a2; ctx.beginPath(); ctx.arc(x,y,r*1.8,0,Math.PI*2); ctx.fill(); ctx.restore();

    if (glitch > 0) {
      const off = glitch*3;
      ctx.save(); ctx.globalAlpha=opacity*0.5; ctx.shadowBlur=glow*0.5; ctx.shadowColor='rgba(255,0,0,0.6)'; ctx.fillStyle='rgba(255,0,0,0.7)'; ctx.beginPath(); ctx.ellipse(x-off,y,r*sx,r*sy,0,0,Math.PI*2); ctx.fill(); ctx.shadowBlur=0; ctx.restore();
      ctx.save(); ctx.globalAlpha=opacity*0.5; ctx.shadowBlur=glow*0.5; ctx.shadowColor='rgba(0,100,255,0.6)'; ctx.fillStyle='rgba(0,100,255,0.7)'; ctx.beginPath(); ctx.ellipse(x+off,y,r*sx,r*sy,0,0,Math.PI*2); ctx.fill(); ctx.shadowBlur=0; ctx.restore();
    }

    ctx.save(); ctx.globalAlpha=opacity; ctx.shadowBlur=glow; ctx.shadowColor='rgba(255,255,255,0.9)'; ctx.fillStyle='#ffffff';
    ctx.beginPath(); ctx.ellipse(x,y,r*sx,r*sy,0,0,Math.PI*2); ctx.fill();
    ctx.shadowBlur=0; ctx.restore();
  };

  const drawOrbitalRing = (ctx, cx, cy, rx, ry, angle, opacity) => {
    ctx.save(); ctx.globalAlpha=opacity*0.45; ctx.strokeStyle='#ffffff'; ctx.lineWidth=1.2;
    ctx.translate(cx,cy); ctx.rotate(angle);
    ctx.beginPath(); ctx.ellipse(0,0,rx,ry,0,0,Math.PI*2); ctx.stroke();
    [[rx,0],[-rx,0]].forEach(([nx,ny])=>{
      ctx.globalAlpha=opacity*0.85; ctx.shadowBlur=12; ctx.shadowColor='rgba(255,255,255,0.9)'; ctx.fillStyle='#ffffff';
      ctx.beginPath(); ctx.arc(nx,ny,6,0,Math.PI*2); ctx.fill(); ctx.shadowBlur=0;
    }); ctx.restore();
  };

  // ── Bloque pesado ────────────────────────────────────────────────────────────
  const drawBlock = (ctx, x, y, size, opacity) => {
    if (opacity <= 0) return;
    ctx.save(); ctx.globalAlpha=opacity;
    ctx.fillStyle='rgba(255,255,255,0.05)';
    ctx.fillRect(x-size/2, y-size/2, size, size);
    ctx.strokeStyle='#ffffff'; ctx.lineWidth=3; ctx.shadowBlur=14; ctx.shadowColor='rgba(255,255,255,0.35)';
    ctx.strokeRect(x-size/2, y-size/2, size, size); ctx.shadowBlur=0;
    ctx.globalAlpha=opacity*0.18; ctx.lineWidth=1.5;
    ctx.beginPath(); ctx.moveTo(x-size/2,y-size/2); ctx.lineTo(x+size/2,y+size/2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x+size/2,y-size/2); ctx.lineTo(x-size/2,y+size/2); ctx.stroke();
    ctx.restore();
  };

  // ── Nodo de red ──────────────────────────────────────────────────────────────
  const drawNetworkNode = (ctx, x, y, r, opacity) => {
    if (opacity <= 0) return;
    ctx.save();
    ctx.globalAlpha=opacity*0.12;
    const g1=ctx.createRadialGradient(x,y,r*0.3,x,y,r*4.5);
    g1.addColorStop(0,'rgba(255,255,255,0.9)'); g1.addColorStop(1,'rgba(255,255,255,0)');
    ctx.fillStyle=g1; ctx.beginPath(); ctx.arc(x,y,r*4.5,0,Math.PI*2); ctx.fill();
    ctx.globalAlpha=opacity*0.45;
    const g2=ctx.createRadialGradient(x,y,0,x,y,r*1.8);
    g2.addColorStop(0,'rgba(255,255,255,1)'); g2.addColorStop(1,'rgba(255,255,255,0)');
    ctx.fillStyle=g2; ctx.beginPath(); ctx.arc(x,y,r*1.8,0,Math.PI*2); ctx.fill();
    ctx.globalAlpha=opacity; ctx.shadowBlur=22; ctx.shadowColor='rgba(255,255,255,0.8)';
    ctx.fillStyle='#ffffff'; ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill();
    ctx.shadowBlur=0; ctx.restore();
  };

  // ── Diamante 3D (firma) ──────────────────────────────────────────────────────
  const drawDiamond3D = (ctx, cx, diamondY, cubeSize, scene, cardOpacity=1) => {
    scene.diamond.angleX=0.15; scene.diamond.angleY+=0.005;
    ctx.shadowBlur=25; ctx.shadowColor='rgba(255,255,255,0.6)';
    ctx.strokeStyle='#ffffff'; ctx.lineWidth=4; ctx.lineCap='round'; ctx.lineJoin='round';
    const proj=scene.diamond.vertices.map(v=>{
      const x1=v.x*Math.cos(scene.diamond.angleY)-v.z*Math.sin(scene.diamond.angleY);
      const z1=v.x*Math.sin(scene.diamond.angleY)+v.z*Math.cos(scene.diamond.angleY);
      const y2=v.y*Math.cos(scene.diamond.angleX)-z1*Math.sin(scene.diamond.angleX);
      const z2=v.y*Math.sin(scene.diamond.angleX)+z1*Math.cos(scene.diamond.angleX);
      return {x:cx+x1*cubeSize, y:diamondY+y2*cubeSize, z:z2};
    });
    scene.diamond.edges.forEach(e=>{
      const p1=proj[e[0]], p2=proj[e[1]];
      ctx.globalAlpha=cardOpacity*(0.5+(p1.z+p2.z)/2*0.25+0.25);
      ctx.beginPath(); ctx.moveTo(p1.x,p1.y); ctx.lineTo(p2.x,p2.y); ctx.stroke();
    });
    ctx.shadowBlur=0;
  };

  // ── Firma (Dan Koe card) — subtítulo: EL APALANCAMIENTO ─────────────────────
  const drawSignatureCard = (ctx, W, H, CX, CY, cardOpacity, cardOffsetY, lightX, lightY, breathe, scene) => {
    const cardWidth=800, cardHeight=1500;
    const cardX=CX-cardWidth/2, cardY=CY-cardHeight/2;

    ctx.save(); ctx.globalAlpha=cardOpacity*breathe;
    const bg=ctx.createRadialGradient(lightX,lightY,cardWidth*0.15,lightX,lightY,cardWidth*1.3);
    bg.addColorStop(0,'rgba(220,216,208,1)'); bg.addColorStop(0.15,'rgba(190,186,178,0.85)');
    bg.addColorStop(0.3,'rgba(155,151,144,0.6)'); bg.addColorStop(0.5,'rgba(110,107,102,0.3)');
    bg.addColorStop(0.7,'rgba(65,63,58,0.1)'); bg.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=bg; ctx.fillRect(0,0,W,H); ctx.restore();

    ctx.save(); ctx.globalAlpha=cardOpacity*breathe*0.8;
    const bl=ctx.createRadialGradient(lightX-180,lightY-80,0,lightX-180,lightY-80,cardHeight*0.6);
    bl.addColorStop(0,'rgba(230,226,218,0.95)'); bl.addColorStop(0.15,'rgba(190,186,178,0.7)');
    bl.addColorStop(0.35,'rgba(140,137,130,0.35)'); bl.addColorStop(0.6,'rgba(80,77,72,0.1)'); bl.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=bl; ctx.fillRect(0,0,W,H); ctx.restore();

    ctx.save(); ctx.globalAlpha=cardOpacity*breathe*0.4;
    const br=ctx.createRadialGradient(cardX+cardWidth+50,CY+100,0,cardX+cardWidth+50,CY+100,cardHeight*0.5);
    br.addColorStop(0,'rgba(200,196,188,0.7)'); br.addColorStop(0.2,'rgba(150,147,140,0.4)');
    br.addColorStop(0.5,'rgba(90,87,82,0.12)'); br.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=br; ctx.fillRect(0,0,W,H); ctx.restore();

    ctx.save(); ctx.globalAlpha=cardOpacity; ctx.translate(0,cardOffsetY);
    ctx.fillStyle='#090909'; ctx.fillRect(cardX,cardY,cardWidth,cardHeight);

    const le=ctx.createLinearGradient(cardX-1,0,cardX+4,0);
    le.addColorStop(0,'rgba(220,216,208,0.6)'); le.addColorStop(0.5,'rgba(180,176,168,0.25)'); le.addColorStop(1,'rgba(180,176,168,0)');
    ctx.fillStyle=le; ctx.fillRect(cardX-1,cardY,5,cardHeight);
    const te=ctx.createLinearGradient(0,cardY-1,0,cardY+3);
    te.addColorStop(0,'rgba(200,196,188,0.4)'); te.addColorStop(0.5,'rgba(160,156,148,0.15)'); te.addColorStop(1,'rgba(160,156,148,0)');
    ctx.fillStyle=te; ctx.fillRect(cardX,cardY-1,cardWidth*0.6,4);
    const re2=ctx.createLinearGradient(cardX+cardWidth+1,0,cardX+cardWidth-3,0);
    re2.addColorStop(0,'rgba(170,166,158,0.2)'); re2.addColorStop(0.5,'rgba(140,136,128,0.08)'); re2.addColorStop(1,'rgba(140,136,128,0)');
    ctx.fillStyle=re2; ctx.fillRect(cardX+cardWidth-3,cardY,4,cardHeight);

    ctx.globalAlpha=cardOpacity;
    ctx.font='bold 50px Montserrat, sans-serif'; ctx.fillStyle='#ffffff';
    ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.fillText('CREA TU', CX, CY-450);
    ctx.font='900 88px Montserrat, sans-serif';
    ctx.fillText('ACTIVO', CX, CY-350);

    drawDiamond3D(ctx, CX, CY-80, 180, scene, cardOpacity);

    ctx.globalAlpha=cardOpacity;
    ctx.font='600 20px Montserrat, sans-serif'; ctx.fillStyle='rgba(255,255,255,0.85)';
    ctx.letterSpacing='4px';
    ctx.fillText('EL APALANCAMIENTO', CX, CY+280);
    ctx.letterSpacing='0px';
    ctx.font='900 64px Montserrat, sans-serif'; ctx.fillStyle='#ffffff';
    const nm='LUIS CABREJO';
    if (ctx.measureText(nm).width > cardWidth*0.85) ctx.font='900 56px Montserrat, sans-serif';
    ctx.fillText(nm, CX, CY+360);
    ctx.restore();
  };

  // ── Loop principal ───────────────────────────────────────────────────────────
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
    const time    = Math.min(elapsed, DURATION);
    const fc      = Math.floor(time * FPS);

    setProgress((time / DURATION) * 100);

    // ── Inicialización de escena ──────────────────────────────────────────────
    if (!sceneRef.current) {
      const nodeTargets = [
        { tx:CX,     ty:310 },
        { tx:CX-270, ty:440 },
        { tx:CX+270, ty:440 },
        { tx:CX-160, ty:580 },
        { tx:CX+160, ty:580 },
        { tx:CX-380, ty:660 },
        { tx:CX+380, ty:660 },
        { tx:CX,     ty:520 },
        { tx:CX-260, ty:770 },
        { tx:CX+260, ty:770 },
      ];
      const networkNodes = nodeTargets.map((p,i) => ({
        x: CX, y: 200,            // start at top center (block explosion point)
        tx: p.tx, ty: p.ty,
        r: 10 + Math.random()*8,
        opacity: 0,
      }));

      const diamond = { angleX:0, angleY:0, vertices:[], edges:[] };
      const dv=diamond.vertices;
      for(let i=0;i<8;i++){const a=(Math.PI*2*i)/8; dv.push({x:Math.cos(a)*0.55,y:-0.35,z:Math.sin(a)*0.55});}
      for(let i=0;i<8;i++){const a=(Math.PI*2*i)/8; dv.push({x:Math.cos(a)*1.0,y:0,z:Math.sin(a)*1.0});}
      dv.push({x:0,y:1.6,z:0});
      const de=diamond.edges;
      for(let i=0;i<8;i++) de.push([i,(i+1)%8]);
      for(let i=0;i<8;i++) de.push([i,i+8]);
      for(let i=8;i<16;i++) de.push([i,i===15?8:i+1]);
      for(let i=8;i<16;i++) de.push([i,16]);
      for(let i=8;i<16;i++) de.push([i,((i+1)%8)+8]);

      const floatingParticles = [];
      for (let i=0; i<80; i++) floatingParticles.push(new FloatingParticle(W, H));

      sceneRef.current = {
        floatingParticles,
        explosionParticles: [],
        networkNodes,
        nodesActivated: false,
        blockLaunchX: 0,
        blockLaunchY: 0,
        blockLaunchCaptured: false,
        diamond,
      };
    }

    const scene   = sceneRef.current;
    const breathe = 1 + Math.sin(fc*0.04)*0.04;

    // ── Fondo ─────────────────────────────────────────────────────────────────
    ctx.fillStyle = '#050505';
    ctx.fillRect(0, 0, W, H);

    const bgOp = time < T1 ? 0.025 : time < T2 ? 0.012 : time < T3 ? 0.02 : time < T4 ? 0.028 : 0.015;
    drawBackgroundGrid(ctx, W, H, time, bgOp);

    if (time < T2 || (time >= T3 && time < T4)) {
      scene.floatingParticles.forEach(p => { p.update(W, H, 0.5); p.draw(ctx); });
    }

    scene.explosionParticles = scene.explosionParticles.filter(p => p.life > 0);
    scene.explosionParticles.forEach(p => { p.update(); p.draw(ctx); });

    // ================================================================
    // ACTO 1 (0–10s): EL EMPUJE LINEAL
    // ================================================================
    if (time < T1) {
      const t1 = time / T1;
      const fadeIn = Easing.easeOutCubic(Math.min(1, time / 0.9));

      // Posición del bloque: se mueve MUY lento (solo 90px en 10s)
      const blockX = CX + 80 + t1 * 90;
      const blockY = 1110;

      // Posición del héroe: empujando desde la izquierda
      const pushCycle = (time * 1.8) % 1;
      const heroX = blockX - 230 + (Math.random()-0.5)*1.5;
      const heroY = blockY + (Math.random()-0.5)*1.2;

      // Bloque
      drawBlock(ctx, blockX, blockY, 180, fadeIn);

      // Líneas de peso (flechas hacia abajo bajo el bloque)
      if (fadeIn > 0.3) {
        for (let i = -2; i <= 2; i++) {
          const wx = blockX + i * 30;
          const wy = blockY + 92;
          const wlen = 18 + Math.abs(i)*4;
          ctx.save(); ctx.globalAlpha = 0.22 * fadeIn;
          ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 1.2; ctx.lineCap='round';
          ctx.beginPath(); ctx.moveTo(wx, wy); ctx.lineTo(wx, wy + wlen);
          ctx.lineTo(wx-4, wy+wlen-6); ctx.moveTo(wx, wy+wlen); ctx.lineTo(wx+4, wy+wlen-6);
          ctx.stroke(); ctx.restore();
        }
      }

      // Líneas de esfuerzo (abanico de líneas hacia la derecha desde el héroe)
      const effortAlpha = (0.15 + Math.sin(pushCycle*Math.PI)*0.5) * fadeIn;
      for (let j = 0; j < 7; j++) {
        const angle = -Math.PI*0.30 + (Math.PI*0.60 * j/6);
        const lineLen = 22 + j*6 + Math.sin(pushCycle*Math.PI*2+j*0.8)*8;
        const lsx = heroX + 42, lsy = heroY;
        ctx.save(); ctx.globalAlpha = effortAlpha*(0.5+0.5*Math.sin(pushCycle*Math.PI));
        ctx.strokeStyle='#ffffff'; ctx.lineWidth=1.5; ctx.lineCap='round';
        ctx.beginPath(); ctx.moveTo(lsx,lsy); ctx.lineTo(lsx+Math.cos(angle)*lineLen, lsy+Math.sin(angle)*lineLen);
        ctx.stroke(); ctx.restore();
      }

      // Gotas de sudor (exertion)
      if (t1 > 0.25) {
        for (let s = 0; s < 2; s++) {
          const swt = ((time*1.6 + s*0.45) % 1);
          if (swt < 0.65) {
            const sx = heroX - 18 + s*38, sy = heroY - 48 - swt*55;
            ctx.save(); ctx.globalAlpha = (1-swt/0.65)*0.45*fadeIn;
            ctx.fillStyle='#ffffff'; ctx.beginPath(); ctx.arc(sx,sy,3,0,Math.PI*2); ctx.fill(); ctx.restore();
          }
        }
      }

      // Héroe (comprimido horizontalmente al empujar)
      const hStrX = 1 + Math.sin(pushCycle*Math.PI)*0.22;
      const hStrY = 1 - Math.sin(pushCycle*Math.PI)*0.12;
      const hGlow = 22 + Math.sin(pushCycle*Math.PI)*10;
      drawHero(ctx, heroX, heroY, 38*breathe, fadeIn, hStrX, hStrY, hGlow);

      // Línea de suelo (sólida)
      const gAlpha = Math.min(1, time / 0.55) * 0.38 * fadeIn;
      ctx.save(); ctx.globalAlpha=gAlpha; ctx.strokeStyle='#ffffff'; ctx.lineWidth=2.5;
      ctx.beginPath(); ctx.moveTo(CX-460, blockY+92); ctx.lineTo(CX+480, blockY+92); ctx.stroke();
      ctx.restore();

      setStatus('Acto 1: El Esfuerzo Lineal');
    }

    // ================================================================
    // ACTO 2 (10–16s): EL COLAPSO — bloque aplasta al héroe
    // ================================================================
    else if (time < T2) {
      const t2 = (time - T1) / (T2 - T1);
      const FREEZE_END=0.05, FLASH_END=0.09, APPROACH_END=0.40, IMPACT=0.34, CRUSH_END=0.58, FADE_OUT=0.62;

      // Suelo (continuidad visual)
      ctx.save(); ctx.globalAlpha=0.30; ctx.strokeStyle='#ffffff'; ctx.lineWidth=2.5;
      ctx.beginPath(); ctx.moveTo(CX-460, 1202); ctx.lineTo(CX+480, 1202); ctx.stroke(); ctx.restore();

      // FREEZE: último frame del Acto 1
      if (t2 < FREEZE_END) {
        drawBlock(ctx, CX+170, 1110, 180, 1);
        drawHero(ctx, CX-60, 1110, 38, 1);
      }

      // FLASH: el bloque se congela un instante, flash blanco
      if (t2 >= FREEZE_END && t2 < FLASH_END) {
        drawBlock(ctx, CX+170, 1110, 180, 1);
        drawHero(ctx, CX-60, 1110, 38, 1);
        const fT=(t2-FREEZE_END)/(FLASH_END-FREEZE_END);
        ctx.save(); ctx.globalAlpha=Math.max(0,1-fT*2.5)*0.44; ctx.fillStyle='#ffffff'; ctx.fillRect(0,0,W,H); ctx.restore();
      }

      // APPROACH → IMPACT → CRUSH: bloque carga hacia el héroe
      if (t2 >= FLASH_END && t2 < FADE_OUT) {
        const approachT = Math.min(1, (t2-FLASH_END)/(APPROACH_END-FLASH_END));
        // Bloque acelera desde CX+170 hacia la izquierda (easeInQuart = parte lento y termina rápido)
        const bx = (CX+170) - Easing.easeInQuart(approachT) * 510;

        // Héroe retrocede levemente al ver el bloque venir
        const retrT = Math.min(1, Math.max(0, (approachT-0.55)/0.38));
        const heroX = CX - 60 - retrT * 55;

        // Progreso de aplaste (cuando bloque llega al héroe)
        const crushP = t2 >= IMPACT ? Easing.easeOutQuad(Math.min(1,(t2-IMPACT)/(CRUSH_END-IMPACT))) : 0;

        // Camera shake en el impacto
        let shX=0, shY=0;
        if (t2 >= IMPACT && t2 < IMPACT+0.15) {
          const shI=1-(t2-IMPACT)/0.15;
          shX=(Math.random()-0.5)*32*shI; shY=(Math.random()-0.5)*20*shI;
        }
        ctx.save(); ctx.translate(shX, shY);

        // Flash de impacto
        if (t2 >= IMPACT && t2 < IMPACT+0.07) {
          const iT=(t2-IMPACT)/0.07;
          ctx.save(); ctx.globalAlpha=(1-iT)*0.58; ctx.fillStyle='#ffffff'; ctx.fillRect(0,0,W,H); ctx.restore();
        }

        // Bloque (se vuelve ligeramente más grande al aplastar)
        drawBlock(ctx, bx, 1110, 180+crushP*30, 1);

        // Chispas en el punto de contacto
        if (t2 >= IMPACT && t2 < IMPACT+0.11) {
          const spA=(1-(t2-IMPACT)/0.11)*0.90;
          for (let sp=0; sp<10; sp++) {
            const sa=(Math.PI*2*sp/10);
            const cpX=bx+90+15; // borde derecho del bloque
            const slen=18+Math.random()*30;
            ctx.save(); ctx.globalAlpha=spA; ctx.strokeStyle='#ffffff'; ctx.lineWidth=1.5;
            ctx.beginPath(); ctx.moveTo(cpX,1110); ctx.lineTo(cpX+Math.cos(sa)*slen,1110+Math.sin(sa)*slen); ctx.stroke(); ctx.restore();
          }
        }

        // Héroe aplastado: se achata horizontalmente
        const heroSX = 1 + crushP * 3.5;
        const heroSY = Math.max(0.04, 1 - crushP * 0.96);
        const heroOp = Math.max(0, 1 - crushP * 0.88);
        if (heroOp > 0.02) {
          drawHero(ctx, heroX, 1110, 38, heroOp, heroSX, heroSY, Math.max(4, 22-crushP*20));
        }

        // Partículas del héroe destruido
        if (crushP > 0.05 && crushP < 0.65 && Math.random() < 0.35) {
          for (let i=0; i<2; i++) {
            const ang=Math.random()*Math.PI*2;
            scene.explosionParticles.push(new ExplosionParticle(heroX, 1110, ang, 4+Math.random()*9, 2+Math.random()*4, Math.random()<0.5?'circle':'rect'));
          }
        }

        ctx.restore();
      }

      // FADE TO BLACK
      if (t2 >= FADE_OUT) {
        const ft=Easing.easeInQuart((t2-FADE_OUT)/(1-FADE_OUT));
        ctx.save(); ctx.globalAlpha=ft; ctx.fillStyle='#050505'; ctx.fillRect(0,0,W,H); ctx.restore();
      }

      setStatus('Acto 2: El Colapso');
    }

    // ================================================================
    // ACTO 3 (16–25s): LA PALANCA
    // ================================================================
    else if (time < T3) {
      const t3 = (time - T2) / (T3 - T2);
      const fadeIn = Easing.easeOutCubic(Math.min(1, t3 / 0.10));

      // Segmentos temporales
      const FULCRUM_START=0.08, FULCRUM_END=0.34;
      const LEVER_START=0.30,   LEVER_END=0.62;
      const BLOCK_APPEAR=0.50;
      const HERO_APPEAR=0.64;

      const fulcrumP = t3 >= FULCRUM_START ? Easing.easeOutCubic(Math.min(1,(t3-FULCRUM_START)/(FULCRUM_END-FULCRUM_START))) : 0;
      const leverP   = t3 >= LEVER_START   ? Easing.easeOutCubic(Math.min(1,(t3-LEVER_START)/(LEVER_END-LEVER_START))) : 0;

      const PIVOT_X = PVT_X, PIVOT_Y = PVT_Y;
      const FULCRUM_H = 100;

      // Guías de plano (líneas punteadas de fondo)
      if (t3 > FULCRUM_START - 0.03) {
        const gA = Math.min(1,(t3-(FULCRUM_START-0.03))/0.06)*0.06*fadeIn;
        ctx.save(); ctx.globalAlpha=gA; ctx.strokeStyle='#ffffff'; ctx.lineWidth=0.6;
        ctx.setLineDash([8,18]);
        ctx.beginPath(); ctx.moveTo(0, PIVOT_Y+FULCRUM_H); ctx.lineTo(W, PIVOT_Y+FULCRUM_H); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(PIVOT_X, PIVOT_Y-220); ctx.lineTo(PIVOT_X, PIVOT_Y+FULCRUM_H+70); ctx.stroke();
        ctx.setLineDash([]); ctx.restore();
      }

      // Triángulo del fulcro (dibujado trazo a trazo)
      if (fulcrumP > 0) {
        const fs = 130;
        const topX=PIVOT_X, topY=PIVOT_Y;
        const blX=PIVOT_X-fs/2, blY=PIVOT_Y+FULCRUM_H;
        const brX=PIVOT_X+fs/2, brY=PIVOT_Y+FULCRUM_H;

        ctx.save(); ctx.globalAlpha=fadeIn; ctx.strokeStyle='#ffffff'; ctx.lineWidth=3; ctx.lineCap='round';
        ctx.shadowBlur=18; ctx.shadowColor='rgba(255,255,255,0.45)';
        ctx.beginPath(); ctx.moveTo(topX, topY);
        if (fulcrumP < 0.33) {
          const t=fulcrumP/0.33;
          ctx.lineTo(topX+(blX-topX)*t, topY+(blY-topY)*t);
        } else if (fulcrumP < 0.66) {
          ctx.lineTo(blX,blY);
          const t=(fulcrumP-0.33)/0.33;
          ctx.lineTo(blX+(brX-blX)*t, blY);
        } else {
          ctx.lineTo(blX,blY); ctx.lineTo(brX,brY);
          const t=(fulcrumP-0.66)/0.34;
          ctx.lineTo(brX+(topX-brX)*t, brY+(topY-brY)*t);
        }
        ctx.stroke();

        // Línea de suelo base
        if (fulcrumP > 0.55) {
          const gA=Math.min(1,(fulcrumP-0.55)/0.3);
          ctx.globalAlpha=fadeIn*gA; ctx.lineWidth=4;
          ctx.beginPath(); ctx.moveTo(PIVOT_X-210,PIVOT_Y+FULCRUM_H+4); ctx.lineTo(PIVOT_X+210,PIVOT_Y+FULCRUM_H+4); ctx.stroke();
        }
        ctx.shadowBlur=0; ctx.restore();
      }

      // Barra de la palanca (crece desde el pivote hacia ambos extremos)
      if (leverP > 0) {
        const leftLen  = LEV_L * leverP;
        const rightLen = LEV_R * leverP;

        ctx.save(); ctx.globalAlpha=fadeIn; ctx.strokeStyle='#ffffff'; ctx.lineWidth=5; ctx.lineCap='round';
        ctx.shadowBlur=22; ctx.shadowColor='rgba(255,255,255,0.55)';
        ctx.beginPath(); ctx.moveTo(PIVOT_X-leftLen, PIVOT_Y); ctx.lineTo(PIVOT_X+rightLen, PIVOT_Y); ctx.stroke();

        // Círculo de pivote
        if (leverP > 0.45) {
          const pcA=Math.min(1,(leverP-0.45)/0.3);
          ctx.globalAlpha=fadeIn*pcA; ctx.shadowBlur=30;
          ctx.fillStyle='#ffffff'; ctx.beginPath(); ctx.arc(PIVOT_X,PIVOT_Y,9,0,Math.PI*2); ctx.fill();
        }

        // Marcas de escala en la barra
        if (leverP > 0.75) {
          const tkA=Math.min(1,(leverP-0.75)/0.2)*0.28;
          ctx.globalAlpha=fadeIn*tkA; ctx.lineWidth=1.5; ctx.shadowBlur=0;
          for (let tk=-4; tk<=3; tk++) {
            if (tk===0) continue;
            const tkX=PIVOT_X+tk*90;
            const tkLen=tk%2===0?18:10;
            ctx.beginPath(); ctx.moveTo(tkX,PIVOT_Y-tkLen/2); ctx.lineTo(tkX,PIVOT_Y+tkLen/2); ctx.stroke();
          }
        }
        ctx.shadowBlur=0; ctx.restore();

        // Bloque en el extremo derecho
        if (t3 >= BLOCK_APPEAR) {
          const bAlpha=Easing.easeOutCubic(Math.min(1,(t3-BLOCK_APPEAR)/0.18))*fadeIn;
          drawBlock(ctx, PIVOT_X+rightLen*0.88, PIVOT_Y-BLOCK_SZ/2-4, BLOCK_SZ, bAlpha);
        }

        // Héroe en el extremo izquierdo
        if (t3 >= HERO_APPEAR) {
          const hT=Easing.easeOutBack(Math.min(1,(t3-HERO_APPEAR)/0.16));
          const heroX=PIVOT_X-leftLen*0.82;
          const heroY=PIVOT_Y-36;
          drawHero(ctx, heroX, heroY, 32*breathe, hT*fadeIn, 1, 1, 28);

          // Flecha pulsante mostrando "presiona aquí"
          if (hT > 0.6) {
            const arrA=Math.sin((t3-HERO_APPEAR)*Math.PI*3)*0.35+0.45;
            ctx.save(); ctx.globalAlpha=Math.min(1,(hT-0.6)/0.4)*arrA*fadeIn*0.55;
            ctx.strokeStyle='#ffffff'; ctx.lineWidth=2; ctx.lineCap='round';
            ctx.beginPath(); ctx.moveTo(heroX,heroY-85); ctx.lineTo(heroX,heroY-52);
            ctx.lineTo(heroX-8,heroY-65); ctx.moveTo(heroX,heroY-52); ctx.lineTo(heroX+8,heroY-65);
            ctx.stroke(); ctx.restore();
          }
        }
      }

      setStatus('Acto 3: La Palanca');
    }

    // ================================================================
    // ACTO 4 (25–34s): EL APALANCAMIENTO
    // ================================================================
    else if (time < T4) {
      const t4 = (time - T3) / (T4 - T3);

      const JUMP=0.06, TILT_DONE=0.25, BLOCK_LAUNCH=0.28, NODES_FORM=0.42;

      // Ángulo de la palanca (gira cuando el héroe salta)
      const tiltP = t4 >= JUMP ? Easing.easeOutQuad(Math.min(1,(t4-JUMP)/(TILT_DONE-JUMP))) : 0;
      const leverAngle = MAX_TILT * tiltP;

      const PIVOT_X=PVT_X, PIVOT_Y=PVT_Y;
      const FULCRUM_H=100, FS=130;

      // ── Fulcro (estático, ya dibujado) ──────────────────────────
      ctx.save(); ctx.strokeStyle='#ffffff'; ctx.lineWidth=3; ctx.lineCap='round';
      ctx.shadowBlur=14; ctx.shadowColor='rgba(255,255,255,0.38)';
      ctx.beginPath(); ctx.moveTo(PIVOT_X,PIVOT_Y); ctx.lineTo(PIVOT_X-FS/2,PIVOT_Y+FULCRUM_H); ctx.lineTo(PIVOT_X+FS/2,PIVOT_Y+FULCRUM_H); ctx.closePath(); ctx.stroke();
      ctx.lineWidth=4; ctx.beginPath(); ctx.moveTo(PIVOT_X-215,PIVOT_Y+FULCRUM_H+4); ctx.lineTo(PIVOT_X+215,PIVOT_Y+FULCRUM_H+4); ctx.stroke();
      ctx.shadowBlur=0; ctx.restore();

      // ── Barra de palanca (rotando) ───────────────────────────────
      ctx.save(); ctx.translate(PIVOT_X,PIVOT_Y); ctx.rotate(leverAngle);
      ctx.strokeStyle='#ffffff'; ctx.lineWidth=5; ctx.lineCap='round';
      ctx.shadowBlur=22; ctx.shadowColor='rgba(255,255,255,0.6)';
      ctx.beginPath(); ctx.moveTo(-LEV_L,0); ctx.lineTo(LEV_R,0); ctx.stroke();
      ctx.shadowBlur=30; ctx.fillStyle='#ffffff';
      ctx.beginPath(); ctx.arc(0,0,9,0,Math.PI*2); ctx.fill();
      ctx.shadowBlur=0; ctx.restore();

      // ── Posición del extremo derecho de la palanca (para el bloque) ──
      const rightEndX = PIVOT_X + LEV_R * Math.cos(leverAngle);
      const rightEndY = PIVOT_Y + LEV_R * Math.sin(leverAngle);

      // ── Bloque: descansa sobre extremo derecho HASTA que se lanza ──
      if (t4 < BLOCK_LAUNCH) {
        drawBlock(ctx, rightEndX, rightEndY - BLOCK_SZ/2 - 4, BLOCK_SZ, 1);
      }

      // Capturar posición de lanzamiento al primer frame de BLOCK_LAUNCH
      if (t4 >= BLOCK_LAUNCH && !scene.blockLaunchCaptured) {
        scene.blockLaunchCaptured = true;
        scene.blockLaunchX = rightEndX;
        scene.blockLaunchY = rightEndY - BLOCK_SZ/2 - 4;
      }

      // ── Héroe en extremo izquierdo de la palanca ─────────────────
      if (t4 < JUMP) {
        // Pequeño rebote antes de saltar (carga de energía)
        const chargeT=t4/JUMP;
        const heroX=PIVOT_X-LEV_L*0.82;
        const heroY=PIVOT_Y-36-Math.sin(chargeT*Math.PI)*25;
        drawHero(ctx, heroX, heroY, 34*breathe, 1, 1, 1, 30);
      } else {
        // Héroe sobre la palanca inclinada
        const heroLX=PIVOT_X+(-LEV_L*0.82)*Math.cos(leverAngle);
        const heroLY=PIVOT_Y+(-LEV_L*0.82)*Math.sin(leverAngle)-36;
        const heroGrow=34+t4*18;
        const heroGlowSize=30+t4*65;

        drawHero(ctx, heroLX, heroLY, heroGrow*breathe, 1, 1, 1, heroGlowSize);
      }

      // ── Bloque volando hacia arriba (tras lanzamiento) ───────────
      if (scene.blockLaunchCaptured) {
        const launchT = time - (T3 + (T4-T3)*BLOCK_LAUNCH);
        const bflyY = scene.blockLaunchY - launchT * 280 * (1 + launchT * 2.8);
        const bflyX = scene.blockLaunchX + Math.sin(launchT*3.5)*16;

        // Activar nodos cuando el bloque alcanza la parte superior
        if (!scene.nodesActivated && bflyY < 520) {
          scene.nodesActivated = true;
          for (let i=0; i<90; i++) {
            const angle=(Math.PI*2*i/90)+(Math.random()-0.5)*0.2;
            const speed=7+Math.random()*18;
            const size=2+Math.random()*6;
            const shape=Math.random()<0.5?'rect':Math.random()<0.5?'circle':'line';
            scene.explosionParticles.push(new ExplosionParticle(bflyX, bflyY, angle, speed, size, shape));
          }
          scene.networkNodes.forEach((nd,i) => {
            const scA=(Math.PI*2*i/scene.networkNodes.length)+(Math.random()-0.5)*0.6;
            const scD=40+Math.random()*70;
            nd.x=bflyX+Math.cos(scA)*scD;
            nd.y=bflyY+Math.sin(scA)*scD;
          });
        }

        // Bloque visible mientras vuela (desaparece con la explosión de nodos)
        if (!scene.nodesActivated && bflyY > -50) {
          drawBlock(ctx, bflyX, bflyY, BLOCK_SZ, 1);
        }
      }

      // ── Red de nodos ─────────────────────────────────────────────
      if (scene.nodesActivated) {
        const nodesT=Easing.easeOutCubic(Math.min(1,(t4-NODES_FORM+0.05)/0.30));

        scene.networkNodes.forEach((nd,i) => {
          // Moverse hacia posición target
          nd.x += (nd.tx - nd.x) * 0.035;
          nd.y += (nd.ty - nd.y) * 0.035;
          nd.opacity = Math.min(1, nd.opacity + 0.012);
          const pulse = 1 + Math.sin(time*2.2+i*0.9)*0.07;
          drawNetworkNode(ctx, nd.x, nd.y, nd.r*pulse, nd.opacity*nodesT);
        });

        // Líneas de conexión entre nodos cercanos
        if (t4 >= NODES_FORM) {
          const lineT=Easing.easeOutCubic(Math.min(1,(t4-NODES_FORM)/0.28));
          scene.networkNodes.forEach((n1,i)=>{
            scene.networkNodes.forEach((n2,j)=>{
              if (j<=i) return;
              const dx=n2.x-n1.x, dy=n2.y-n1.y;
              const dist=Math.sqrt(dx*dx+dy*dy);
              if (dist<360) {
                const lA=(1-dist/360)*lineT*0.45*Math.min(1,n1.opacity)*Math.min(1,n2.opacity);
                ctx.save(); ctx.globalAlpha=lA; ctx.strokeStyle='#ffffff'; ctx.lineWidth=0.9;
                ctx.beginPath(); ctx.moveTo(n1.x,n1.y); ctx.lineTo(n2.x,n2.y); ctx.stroke(); ctx.restore();
              }
            });
          });
        }

        // Anillos expansivos (clímax)
        if (t4 >= 0.78) {
          for (let r=0; r<3; r++) {
            const rP=((t4-0.78)/0.22*1.5+r*0.34)%1;
            ctx.save(); ctx.globalAlpha=(1-rP)*0.22;
            ctx.strokeStyle='#ffffff'; ctx.lineWidth=1.2;
            ctx.beginPath(); ctx.arc(CX,450,rP*420,0,Math.PI*2); ctx.stroke(); ctx.restore();
          }
        }
      }

      // Fade to black al final del acto
      if (t4 >= 0.90) {
        const fT=Easing.easeInQuart((t4-0.90)/0.10);
        ctx.save(); ctx.globalAlpha=fT; ctx.fillStyle='#050505'; ctx.fillRect(0,0,W,H); ctx.restore();
      }

      setStatus('Acto 4: El Apalancamiento');
    }

    // ================================================================
    // FIRMA (34–37s)
    // ================================================================
    else if (time < T5) {
      const t = (time-T4)/(T5-T4);
      const slideP=Easing.easeOutQuart(Math.min(1,t/0.08));
      const cardOpacity=slideP;
      const cardOffsetY=(1-slideP)*180;
      const lightTime=time-T4;
      const breatheF=0.93+Math.sin(lightTime*0.6)*0.07;
      const lightX=CX+220-t*480;
      const lightY=CY+420-t*520;
      ctx.fillStyle='#050505'; ctx.fillRect(0,0,W,H);
      drawSignatureCard(ctx, W, H, CX, CY, cardOpacity, cardOffsetY, lightX, lightY, breatheF, scene);
      setStatus('Firma: El Apalancamiento');
    }

    // ================================================================
    // HOLD FINAL
    // ================================================================
    else {
      const breatheF=0.93+Math.sin((time-T5)*0.6)*0.07;
      ctx.fillStyle='#050505'; ctx.fillRect(0,0,W,H);
      drawSignatureCard(ctx, W, H, CX, CY, 1, 0, CX-260, CY-100, breatheF, scene);
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

  // ── Controles ────────────────────────────────────────────────────────────────
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
    setTimeout(() => play(), 100);
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
      a.download='dia8-ley-palanca-38s-60fps.webm';
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      URL.revokeObjectURL(url); setIsRecording(false); setStatus('Grabación descargada');
    };
    mediaRecorderRef.current.start();
    setTimeout(()=>{ if(mediaRecorderRef.current?.state==='recording') mediaRecorderRef.current.stop(); }, DURATION*1000+700);
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
    ctx.fillText('Día 8 · La Palanca', CX, CY-90); ctx.shadowBlur=0;
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
          <div>1080×1920 · 60FPS · 38s · Día 8 (Dan Koe Style)</div>
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
