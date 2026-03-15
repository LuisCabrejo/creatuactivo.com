'use client';

import React, { useRef, useState, useEffect } from 'react';

// ── DÍA 9: EL TERRENO ALQUILADO ──────────────────────────────────────────────
// 6 Actos (39 segundos, 60 fps):
//   Acto 1 (0–7.05s):     La Torre Inestable — likes llueven hasta 07:03
//   Acto 2 (7.05–12.517s): El Terreno Alquilado — castillo grande 1s, zoom out
//   Acto 3 (12.517–19.067s): El Colapso — tiembla desde 12:31, explosión 16:25
//   Acto 4 (19.067–23.5s): La Fuga de Atención — embudo 19:04, escudo fallido
//   Acto 5 (23.5–34s):    La Infraestructura — cilindros 26:19/28:17/29:15, red fractal
//   Acto 6 (34–39s):      El Activo — apogeo red, firma CREA TU ACTIVO

export default function Dia9TerrenoAlquilado() {
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

  const FPS = 60, DURATION = 39;
  const W = 1080, H = 1920, CX = 540;
  const GROUND_Y = 1400; // ground level Acts 1-2

  // Act boundaries anclados a timecodes del guion
  // T1=7.05 (07:03) · T2=12.517 (12:31) · T3=19.067 (19:04) · T4/T5 sin cambio
  const T1=7.05, T2=12.517, T3=19.067, T4=23.5, T5=34.0;

  // ── Easing ────────────────────────────────────────────────────────────────────
  const Easing = {
    easeOutExpo:    (x) => x===1?1:1-Math.pow(2,-10*x),
    easeOutBack:    (x) => { const c1=1.70158,c3=c1+1; return 1+c3*Math.pow(x-1,3)+c1*Math.pow(x-1,2); },
    easeOutBounce:  (x) => {
      const n1=7.5625,d1=2.75;
      if(x<1/d1) return n1*x*x;
      else if(x<2/d1){const xm=x-1.5/d1; return n1*xm*xm+0.75;}
      else if(x<2.5/d1){const xm=x-2.25/d1; return n1*xm*xm+0.9375;}
      else{const xm=x-2.625/d1; return n1*xm*xm+0.984375;}
    },
    easeOutQuad:    (x) => 1-(1-x)*(1-x),
    easeOutCubic:   (x) => 1-Math.pow(1-x,3),
    easeOutQuart:   (x) => 1-Math.pow(1-x,4),
    easeInQuad:     (x) => x*x,
    easeInQuart:    (x) => x*x*x*x,
    easeInOutCubic: (x) => x<0.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2,
  };

  const lerp   = (a, b, t) => a+(b-a)*t;
  const clamp  = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  const prog   = (time, start, dur) => clamp((time-start)/dur, 0, 1);

  // ── Film grain ────────────────────────────────────────────────────────────────
  const drawFilmGrain = (ctx, W, H, intensity, fc) => {
    const gs=2, cols=Math.floor(W/gs), rows=Math.floor(H/gs), seed=Math.floor(fc/3);
    ctx.save(); ctx.globalAlpha=intensity; ctx.fillStyle='#ffffff';
    for(let i=0;i<cols*rows*0.012;i++){
      const s=(seed*9301+i*49297)%233280, r=s/233280;
      ctx.fillRect((r*cols)*gs, ((s*0.397)%rows)*gs, gs, gs);
    }
    ctx.restore();
  };

  // ── FloatingParticle (4 shape types — HANDOFF Tier 4) ────────────────────────
  class FloatingParticle {
    constructor(W, H) {
      this.x=Math.random()*W; this.y=Math.random()*H;
      this.vx=(Math.random()-0.5)*0.8; this.vy=(Math.random()-0.5)*0.8;
      this.size=1+Math.random()*2.8; this.opacity=0.07+Math.random()*0.14;
      const sr=Math.random();
      if(sr<0.40){ this.shape='circle'; }
      else if(sr<0.60){ this.shape='line'; this.lineLen=8+Math.random()*12; this.lineAng=Math.random()*Math.PI*2; this.lineRot=(Math.random()-0.5)*0.03; }
      else if(sr<0.80){ this.shape='dot'; this.size=1+Math.random()*1.5; }
      else{ this.shape='square'; this.rot=Math.random()*Math.PI*2; this.rotSpd=(Math.random()-0.5)*0.05; }
    }
    update(W, H) {
      this.x+=this.vx; this.y+=this.vy;
      if(this.shape==='line') this.lineAng+=this.lineRot;
      if(this.shape==='square') this.rot+=this.rotSpd;
      if(this.x<0)this.x=W; if(this.x>W)this.x=0; if(this.y<0)this.y=H; if(this.y>H)this.y=0;
    }
    draw(ctx) {
      ctx.save(); ctx.globalAlpha=this.opacity; ctx.fillStyle='#ffffff'; ctx.strokeStyle='#ffffff';
      if(this.shape==='circle'){ ctx.beginPath(); ctx.arc(this.x,this.y,this.size,0,Math.PI*2); ctx.fill(); }
      else if(this.shape==='line'){ ctx.lineWidth=1; ctx.beginPath(); ctx.moveTo(this.x+Math.cos(this.lineAng)*this.lineLen/2,this.y+Math.sin(this.lineAng)*this.lineLen/2); ctx.lineTo(this.x-Math.cos(this.lineAng)*this.lineLen/2,this.y-Math.sin(this.lineAng)*this.lineLen/2); ctx.stroke(); }
      else if(this.shape==='dot'){ ctx.fillRect(this.x-this.size/2,this.y-this.size/2,this.size,this.size); }
      else{ ctx.translate(this.x,this.y); ctx.rotate(this.rot); ctx.fillRect(-this.size/2,-this.size/2,this.size,this.size); }
      ctx.restore();
    }
  }

  // ── Hero (glowing circle — 3 layers) ────────────────────────────────────────
  const drawHero = (ctx, x, y, r, opacity, glow=40) => {
    if(opacity<=0.01) return;
    // Layer 1: atmospheric glow (r×5)
    ctx.save(); ctx.globalAlpha=opacity*0.18;
    const a1=ctx.createRadialGradient(x,y,r*0.8,x,y,r*5);
    a1.addColorStop(0,'rgba(255,255,255,0.5)'); a1.addColorStop(1,'rgba(255,255,255,0)');
    ctx.fillStyle=a1; ctx.beginPath(); ctx.arc(x,y,r*5,0,Math.PI*2); ctx.fill(); ctx.restore();
    // Layer 2: soft-edge glow halo (r×1.8)
    ctx.save(); ctx.globalAlpha=opacity*0.55;
    ctx.shadowBlur=glow*0.7; ctx.shadowColor='rgba(255,255,255,0.6)';
    ctx.fillStyle='rgba(255,255,255,0.12)';
    ctx.beginPath(); ctx.arc(x,y,r*1.8,0,Math.PI*2); ctx.fill();
    ctx.shadowBlur=0; ctx.restore();
    // Layer 3: solid white core
    ctx.save(); ctx.globalAlpha=opacity;
    ctx.shadowBlur=glow; ctx.shadowColor='rgba(255,255,255,0.9)';
    ctx.fillStyle='#ffffff'; ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill();
    ctx.shadowBlur=0; ctx.restore();
  };

  // ── Social interaction icon — white line-art (Dan Koe style) ─────────────────
  const drawSocialIcon = (ctx, cx, cy, size, opacity, type) => {
    if(opacity<=0.01) return;
    const s=size*0.42;
    ctx.save(); ctx.globalAlpha=opacity; ctx.strokeStyle='#ffffff'; ctx.fillStyle='#ffffff';
    ctx.lineWidth=2.6; ctx.lineCap='round'; ctx.lineJoin='round';
    ctx.shadowBlur=11; ctx.shadowColor='rgba(255,255,255,0.45)';
    switch(type % 9) {
      case 0: // ♥ Heart
        ctx.beginPath();
        ctx.moveTo(cx, cy+s*0.35);
        ctx.bezierCurveTo(cx,cy-s*0.1, cx-s*0.9,cy-s*0.1, cx-s*0.9,cy-s*0.45);
        ctx.bezierCurveTo(cx-s*0.9,cy-s*0.9, cx,cy-s*0.68, cx,cy-s*0.32);
        ctx.bezierCurveTo(cx,cy-s*0.68, cx+s*0.9,cy-s*0.9, cx+s*0.9,cy-s*0.45);
        ctx.bezierCurveTo(cx+s*0.9,cy-s*0.1, cx,cy-s*0.1, cx,cy+s*0.35);
        ctx.stroke(); break;
      case 1: // 😢 Sad face + tear
        ctx.beginPath(); ctx.arc(cx,cy,s,0,Math.PI*2); ctx.stroke();
        ctx.beginPath(); ctx.arc(cx-s*0.28,cy-s*0.12,s*0.1,0,Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.arc(cx+s*0.28,cy-s*0.12,s*0.1,0,Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.arc(cx,cy+s*0.52,s*0.35,Math.PI*1.2,Math.PI*1.8); ctx.stroke();
        ctx.lineWidth=1.8; ctx.beginPath(); ctx.moveTo(cx-s*0.28,cy+s*0.08); ctx.bezierCurveTo(cx-s*0.3,cy+s*0.28,cx-s*0.22,cy+s*0.38,cx-s*0.26,cy+s*0.52); ctx.stroke(); break;
      case 2: // 😊 Smiley
        ctx.beginPath(); ctx.arc(cx,cy,s,0,Math.PI*2); ctx.stroke();
        ctx.beginPath(); ctx.arc(cx-s*0.28,cy-s*0.12,s*0.1,0,Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.arc(cx+s*0.28,cy-s*0.12,s*0.1,0,Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.arc(cx,cy+s*0.1,s*0.38,0.18*Math.PI,0.82*Math.PI); ctx.stroke(); break;
      case 3: // 💬 Chat bubble
        ctx.beginPath(); ctx.moveTo(cx-s*0.7,cy-s*0.52); ctx.lineTo(cx+s*0.7,cy-s*0.52);
        ctx.quadraticCurveTo(cx+s,cy-s*0.52, cx+s,cy-s*0.18); ctx.lineTo(cx+s,cy+s*0.22);
        ctx.quadraticCurveTo(cx+s,cy+s*0.52, cx+s*0.6,cy+s*0.52); ctx.lineTo(cx-s*0.05,cy+s*0.52);
        ctx.lineTo(cx-s*0.42,cy+s*0.96); ctx.lineTo(cx-s*0.52,cy+s*0.52); ctx.lineTo(cx-s*0.7,cy+s*0.52);
        ctx.quadraticCurveTo(cx-s,cy+s*0.52, cx-s,cy+s*0.22); ctx.lineTo(cx-s,cy-s*0.18);
        ctx.quadraticCurveTo(cx-s,cy-s*0.52, cx-s*0.7,cy-s*0.52); ctx.closePath(); ctx.stroke();
        ctx.lineWidth=1.5;
        [-s*0.35,0,s*0.35].forEach(dx=>{ ctx.beginPath(); ctx.arc(cx+dx,cy+s*0.04,s*0.09,0,Math.PI*2); ctx.fill(); }); break;
      case 4: // 👁 Eye
        ctx.beginPath(); ctx.ellipse(cx,cy,s*0.9,s*0.5,0,0,Math.PI*2); ctx.stroke();
        ctx.beginPath(); ctx.arc(cx,cy,s*0.28,0,Math.PI*2); ctx.stroke();
        ctx.beginPath(); ctx.arc(cx+s*0.08,cy-s*0.08,s*0.12,0,Math.PI*2); ctx.fill(); break;
      case 5: // ↺ Share / repost
        ctx.beginPath(); ctx.arc(cx,cy,s*0.62,Math.PI*0.22,Math.PI*0.98); ctx.stroke();
        ctx.beginPath(); ctx.arc(cx,cy,s*0.62,Math.PI*1.22,Math.PI*1.98); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(cx+s*0.48,cy-s*0.44); ctx.lineTo(cx+s*0.62,cy-s*0.13); ctx.lineTo(cx+s*0.35,cy-s*0.11); ctx.fill();
        ctx.beginPath(); ctx.moveTo(cx-s*0.48,cy+s*0.44); ctx.lineTo(cx-s*0.62,cy+s*0.13); ctx.lineTo(cx-s*0.35,cy+s*0.11); ctx.fill(); break;
      case 6: // 😮 Surprised
        ctx.beginPath(); ctx.arc(cx,cy,s,0,Math.PI*2); ctx.stroke();
        ctx.beginPath(); ctx.arc(cx-s*0.3,cy-s*0.18,s*0.1,0,Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.arc(cx+s*0.3,cy-s*0.18,s*0.1,0,Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(cx,cy+s*0.32,s*0.2,s*0.27,0,0,Math.PI*2); ctx.stroke(); break;
      case 7: // 💕 Double heart
        ctx.beginPath();
        ctx.moveTo(cx-s*0.25,cy+s*0.2); ctx.bezierCurveTo(cx-s*0.25,cy-s*0.2, cx-s*1.05,cy-s*0.2, cx-s*1.05,cy-s*0.52);
        ctx.bezierCurveTo(cx-s*1.05,cy-s*0.96, cx-s*0.25,cy-s*0.78, cx-s*0.25,cy-s*0.34);
        ctx.bezierCurveTo(cx-s*0.25,cy-s*0.78, cx+s*0.55,cy-s*0.96, cx+s*0.55,cy-s*0.52);
        ctx.bezierCurveTo(cx+s*0.55,cy-s*0.2, cx-s*0.25,cy-s*0.2, cx-s*0.25,cy+s*0.2); ctx.stroke();
        ctx.globalAlpha=opacity*0.48; ctx.beginPath();
        ctx.moveTo(cx+s*0.1,cy+s*0.06); ctx.bezierCurveTo(cx+s*0.1,cy-s*0.2, cx-s*0.5,cy-s*0.2, cx-s*0.5,cy-s*0.44);
        ctx.bezierCurveTo(cx-s*0.5,cy-s*0.8, cx+s*0.1,cy-s*0.62, cx+s*0.1,cy-s*0.26);
        ctx.bezierCurveTo(cx+s*0.1,cy-s*0.62, cx+s*0.7,cy-s*0.8, cx+s*0.7,cy-s*0.44);
        ctx.bezierCurveTo(cx+s*0.7,cy-s*0.2, cx+s*0.1,cy-s*0.2, cx+s*0.1,cy+s*0.06); ctx.stroke(); break;
      case 8: // 💔 Broken heart
        ctx.beginPath(); ctx.moveTo(cx,cy+s*0.42);
        ctx.bezierCurveTo(cx,cy-s*0.1, cx-s*0.9,cy-s*0.1, cx-s*0.9,cy-s*0.45);
        ctx.bezierCurveTo(cx-s*0.9,cy-s*0.9, cx,cy-s*0.68, cx,cy-s*0.32);
        ctx.lineTo(cx-s*0.15,cy-s*0.05); ctx.lineTo(cx+s*0.16,cy-s*0.28); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(cx+s*0.16,cy-s*0.28);
        ctx.bezierCurveTo(cx,cy-s*0.68, cx+s*0.9,cy-s*0.9, cx+s*0.9,cy-s*0.45);
        ctx.bezierCurveTo(cx+s*0.9,cy-s*0.1, cx,cy-s*0.1, cx,cy+s*0.42); ctx.stroke(); break;
    }
    ctx.shadowBlur=0; ctx.restore();
  };

  // ── Heart (like) ──────────────────────────────────────────────────────────────
  const drawHeart = (ctx, cx, cy, size, opacity) => {
    if(opacity<=0.01) return;
    ctx.save(); ctx.globalAlpha=opacity; ctx.strokeStyle='#ffffff'; ctx.lineWidth=2.5; ctx.lineCap='round';
    const s=size;
    ctx.beginPath();
    ctx.moveTo(cx, cy+s*0.35);
    ctx.bezierCurveTo(cx,cy-s*0.1, cx-s*0.9,cy-s*0.1, cx-s*0.9,cy-s*0.45);
    ctx.bezierCurveTo(cx-s*0.9,cy-s*0.9, cx,cy-s*0.7, cx,cy-s*0.35);
    ctx.bezierCurveTo(cx,cy-s*0.7, cx+s*0.9,cy-s*0.9, cx+s*0.9,cy-s*0.45);
    ctx.bezierCurveTo(cx+s*0.9,cy-s*0.1, cx,cy-s*0.1, cx,cy+s*0.35);
    ctx.stroke(); ctx.restore();
  };

  // ── Glow helpers ─────────────────────────────────────────────────────────────
  const drawGlow = (ctx, color, blur) => { ctx.shadowBlur=blur; ctx.shadowColor=color; };
  const resetGlow = (ctx) => { ctx.shadowBlur=0; ctx.shadowColor='transparent'; };

  // ── SparkParticle ─────────────────────────────────────────────────────────────
  class SparkParticle {
    constructor(x, y, angle, speed) {
      this.x=x; this.y=y;
      this.vx=Math.cos(angle)*speed; this.vy=Math.sin(angle)*speed;
      this.life=1.0; this.size=Math.random()*3.5+1;
    }
    update() { this.x+=this.vx; this.y+=this.vy; this.vx*=0.96; this.vy*=0.96; this.life-=0.028; }
    draw(ctx) {
      if(this.life<=0) return;
      ctx.save(); ctx.globalAlpha=this.life*0.85;
      ctx.shadowBlur=10; ctx.shadowColor='rgba(255,255,255,0.8)'; ctx.fillStyle='#ffffff';
      ctx.beginPath(); ctx.arc(this.x,this.y,this.size*this.life,0,Math.PI*2); ctx.fill();
      ctx.shadowBlur=0; ctx.restore();
    }
  }

  // ── ExplosionParticle (burst final — HANDOFF Tier 2B) ────────────────────────
  class ExplosionParticle {
    constructor(x, y, angle, speed, size) {
      this.x=x; this.y=y;
      this.vx=Math.cos(angle)*speed; this.vy=Math.sin(angle)*speed;
      this.size=size; this.life=1;
      this.decay=0.016+Math.random()*0.012;
      this.rotation=Math.random()*Math.PI*2;
      this.rotSpd=(Math.random()-0.5)*0.3;
    }
    update() { this.x+=this.vx; this.y+=this.vy; this.vy+=0.12; this.vx*=0.98; this.rotation+=this.rotSpd; this.life-=this.decay; }
    draw(ctx) {
      if(this.life<=0) return;
      ctx.save(); ctx.globalAlpha=Math.max(0,this.life)*0.9; ctx.fillStyle='#ffffff';
      ctx.translate(this.x,this.y); ctx.rotate(this.rotation);
      ctx.beginPath(); ctx.arc(0,0,this.size/2,0,Math.PI*2); ctx.fill();
      ctx.restore();
    }
  }

  // ── Background grid (HANDOFF Tier 4) ─────────────────────────────────────────
  const drawBackgroundGrid = (ctx, W, H, time, opacity) => {
    if(opacity<=0.005) return;
    ctx.save(); ctx.globalAlpha=opacity; ctx.strokeStyle='#ffffff'; ctx.lineWidth=0.5;
    const gs=120;
    const ox=(time*15)%gs, oy=(time*10)%gs;
    for(let x=-gs+ox; x<W+gs; x+=gs){ ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke(); }
    for(let y=-gs+oy; y<H+gs; y+=gs){ ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }
    ctx.restore();
  };

  // ── Diamond 3D (firma) ───────────────────────────────────────────────────────
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

  // ── Castle (geometric) ────────────────────────────────────────────────────────
  const drawCastle = (ctx, cx, baseY, scale, opacity, wobble) => {
    if(opacity<=0.01) return;
    const s=scale;
    ctx.save(); ctx.globalAlpha=opacity; ctx.strokeStyle='#ffffff'; ctx.lineCap='round'; ctx.lineJoin='round';
    const bW=260*s, bH=280*s, mW=36*s, mH=44*s, tW=72*s, tH=160*s;
    const bx=cx+wobble-bW/2, by=baseY-bH;
    ctx.lineWidth=4*s;
    // Main body
    ctx.strokeRect(bx, by, bW, bH);
    // Battlements on main body (5)
    for(let i=0;i<5;i++) ctx.strokeRect(bx+i*(bW/4.2), by-mH, mW, mH);
    // Central tower
    ctx.strokeRect(cx+wobble-tW/2, by-tH, tW, tH);
    // Tower merlons (3)
    [-tW/2, tW/2-20*s*2, 0].forEach(dx=>{
      ctx.strokeRect(cx+wobble+dx-2*s, by-tH-32*s, 20*s, 32*s);
    });
    // Gate arch
    ctx.lineWidth=3*s;
    ctx.beginPath(); ctx.arc(cx+wobble, baseY-52*s, 30*s, Math.PI, 0);
    ctx.lineTo(cx+wobble+30*s, baseY); ctx.lineTo(cx+wobble-30*s, baseY); ctx.closePath(); ctx.stroke();
    // Windows
    ctx.lineWidth=2*s;
    ctx.strokeRect(cx+wobble-16*s, by+30*s, 32*s, 38*s);
    ctx.strokeRect(cx+wobble-80*s, by+60*s, 28*s, 34*s);
    ctx.strokeRect(cx+wobble+52*s, by+60*s, 28*s, 34*s);
    ctx.restore();
  };

  // ── Dotted ground line ────────────────────────────────────────────────────────
  const drawDottedGround = (ctx, cx, y, width, alpha, phase) => {
    if(alpha<=0.01) return;
    ctx.save(); ctx.globalAlpha=alpha; ctx.strokeStyle='#ffffff'; ctx.lineWidth=3;
    ctx.setLineDash([14,16]); ctx.lineDashOffset=-phase*22;
    ctx.beginPath(); ctx.moveTo(cx-width/2, y); ctx.lineTo(cx+width/2, y); ctx.stroke();
    ctx.setLineDash([]); ctx.restore();
  };

  // ── Abyss gradient ────────────────────────────────────────────────────────────
  const drawAbyss = (ctx, fromY, toY, alpha) => {
    if(alpha<=0.01) return;
    const grad=ctx.createLinearGradient(0,fromY,0,toY);
    grad.addColorStop(0,'rgba(0,0,0,0)'); grad.addColorStop(0.35,'rgba(0,0,0,0.65)'); grad.addColorStop(1,'rgba(0,0,0,0.98)');
    ctx.save(); ctx.globalAlpha=alpha; ctx.fillStyle=grad; ctx.fillRect(0,fromY,W,toY-fromY); ctx.restore();
  };

  // ── Document icon ─────────────────────────────────────────────────────────────
  const drawDocument = (ctx, cx, cy, alpha) => {
    if(alpha<=0.01) return;
    ctx.save(); ctx.globalAlpha=alpha; ctx.strokeStyle='#ffffff'; ctx.lineWidth=2.5; ctx.lineCap='round';
    const w=58, h=72, fold=16;
    ctx.beginPath();
    ctx.moveTo(cx-w/2, cy-h/2); ctx.lineTo(cx+w/2-fold, cy-h/2);
    ctx.lineTo(cx+w/2, cy-h/2+fold); ctx.lineTo(cx+w/2, cy+h/2);
    ctx.lineTo(cx-w/2, cy+h/2); ctx.closePath(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx+w/2-fold, cy-h/2); ctx.lineTo(cx+w/2-fold, cy-h/2+fold); ctx.lineTo(cx+w/2, cy-h/2+fold); ctx.stroke();
    ctx.lineWidth=1.8;
    [-18,-4,10,24].forEach(dy=>{ ctx.beginPath(); ctx.moveTo(cx-w/2+9,cy+dy); ctx.lineTo(cx+w/2-9,cy+dy); ctx.stroke(); });
    // ! warning mark
    ctx.globalAlpha=alpha*0.8; ctx.font='bold 28px sans-serif'; ctx.fillStyle='#ffffff'; ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.fillText('!', cx, cy-h/2-18);
    ctx.restore();
  };

  // ── Funnel ────────────────────────────────────────────────────────────────────
  const drawFunnel = (ctx, cx, cy, scale, alpha) => {
    if(alpha<=0.01) return;
    const s=scale;
    ctx.save(); ctx.globalAlpha=alpha; ctx.strokeStyle='#ffffff'; ctx.lineWidth=4.5*s; ctx.lineCap='round';
    const topW=360*s, botW=44*s, h=340*s;
    ctx.beginPath();
    ctx.moveTo(cx-topW/2, cy-h/2); ctx.lineTo(cx+topW/2, cy-h/2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx-topW/2, cy-h/2); ctx.lineTo(cx-botW/2, cy+h/2); ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx+topW/2, cy-h/2); ctx.lineTo(cx+botW/2, cy+h/2); ctx.stroke();
    ctx.restore();
  };

  // ── No control (circle-slash universal symbol) ───────────────────────────────
  const drawNoControl = (ctx, cx, cy, drawProg, alpha) => {
    if(alpha<=0.01) return;
    const R=70;
    ctx.save(); ctx.strokeStyle='#ffffff'; ctx.lineCap='round';
    // Circle appears first
    ctx.lineWidth=4.5; ctx.globalAlpha=alpha*Math.min(1,drawProg*2.5);
    ctx.shadowBlur=16; ctx.shadowColor='rgba(255,255,255,0.55)';
    ctx.beginPath(); ctx.arc(cx,cy,R,0,Math.PI*2); ctx.stroke();
    ctx.shadowBlur=0;
    // Diagonal slash grows in second half
    if(drawProg>0.36) {
      const slashP=Math.min(1,(drawProg-0.36)/0.64);
      const sx=cx-R*0.68, sy=cy-R*0.68, ex=cx+R*0.68, ey=cy+R*0.68;
      ctx.lineWidth=4.5; ctx.globalAlpha=alpha*slashP;
      ctx.shadowBlur=16; ctx.shadowColor='rgba(255,255,255,0.55)';
      ctx.beginPath(); ctx.moveTo(sx,sy); ctx.lineTo(lerp(sx,ex,slashP),lerp(sy,ey,slashP)); ctx.stroke();
      ctx.shadowBlur=0;
    }
    // "SIN CONTROL" label — pulses at end of each cycle
    ctx.globalAlpha=alpha*Math.min(1,drawProg*2)*(0.65+Math.sin(drawProg*Math.PI*2.2)*0.35);
    ctx.font='bold 26px Montserrat,sans-serif'; ctx.fillStyle='#ffffff';
    ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.shadowBlur=10; ctx.shadowColor='rgba(255,255,255,0.5)';
    ctx.fillText('SIN CONTROL', cx, cy+R+34);
    ctx.shadowBlur=0; ctx.restore();
  };

  // ── Solid ground sweep ────────────────────────────────────────────────────────
  const drawSolidGround = (ctx, y, sweepP, alpha) => {
    if(alpha<=0.01) return;
    ctx.save(); ctx.globalAlpha=alpha; ctx.strokeStyle='#ffffff'; ctx.lineWidth=5; ctx.lineCap='round';
    ctx.shadowBlur=14; ctx.shadowColor='rgba(255,255,255,0.55)';
    ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(sweepP*W,y); ctx.stroke();
    ctx.shadowBlur=0; ctx.restore();
  };

  // ── Dome ──────────────────────────────────────────────────────────────────────
  const drawDome = (ctx, cx, cy, r, alpha, pulse) => {
    if(alpha<=0.01) return;
    const pr=r*(1+pulse*0.04);
    ctx.save(); ctx.globalAlpha=alpha*0.55; ctx.strokeStyle='#ffffff'; ctx.lineWidth=2.5;
    ctx.shadowBlur=20; ctx.shadowColor='rgba(255,255,255,0.4)';
    ctx.beginPath(); ctx.arc(cx, cy, pr, Math.PI, 0);
    ctx.lineTo(cx+pr, cy); ctx.lineTo(cx-pr, cy); ctx.stroke();
    ctx.globalAlpha=alpha*0.10; ctx.lineWidth=10;
    ctx.beginPath(); ctx.arc(cx, cy, pr, Math.PI, 0); ctx.stroke();
    ctx.shadowBlur=0; ctx.restore();
  };

  // ── Isometric cylinder (database) ─────────────────────────────────────────────
  const drawCylinder = (ctx, cx, cy, scale, alpha) => {
    if(alpha<=0.01) return;
    const s=scale, cW=95*s, cH=130*s, eH=26*s;
    ctx.save(); ctx.globalAlpha=alpha; ctx.strokeStyle='#ffffff'; ctx.lineWidth=3.8*s; ctx.lineCap='round';
    ctx.shadowBlur=16; ctx.shadowColor='rgba(255,255,255,0.5)';
    // Top ellipse
    ctx.beginPath(); ctx.ellipse(cx, cy-cH/2, cW/2, eH/2, 0, 0, Math.PI*2); ctx.stroke();
    // Body sides
    ctx.beginPath(); ctx.moveTo(cx-cW/2, cy-cH/2+eH/2); ctx.lineTo(cx-cW/2, cy+cH/2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx+cW/2, cy-cH/2+eH/2); ctx.lineTo(cx+cW/2, cy+cH/2); ctx.stroke();
    // Bottom arc
    ctx.beginPath(); ctx.ellipse(cx, cy+cH/2, cW/2, eH/2, 0, 0, Math.PI); ctx.stroke();
    // Edge highlight
    ctx.globalAlpha=alpha*0.28; ctx.lineWidth=1.2;
    ctx.beginPath(); ctx.moveTo(cx-cW/2+5*s, cy-cH/2+eH*0.5); ctx.lineTo(cx-cW/2+5*s, cy+cH/2-eH*0.3); ctx.stroke();
    ctx.shadowBlur=0; ctx.restore();
  };

  // ── Network node ──────────────────────────────────────────────────────────────
  const drawNetworkNode = (ctx, x, y, r, alpha) => {
    if(alpha<=0.01) return;
    ctx.save(); ctx.globalAlpha=alpha*0.20;
    const g=ctx.createRadialGradient(x,y,r*0.5,x,y,r*3.5);
    g.addColorStop(0,'rgba(255,255,255,0.6)'); g.addColorStop(1,'rgba(255,255,255,0)');
    ctx.fillStyle=g; ctx.beginPath(); ctx.arc(x,y,r*3.5,0,Math.PI*2); ctx.fill(); ctx.restore();
    ctx.save(); ctx.globalAlpha=alpha; ctx.fillStyle='#ffffff';
    ctx.shadowBlur=12; ctx.shadowColor='rgba(255,255,255,0.8)';
    ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill();
    ctx.shadowBlur=0; ctx.restore();
  };

  // ── Diamond (final act) ───────────────────────────────────────────────────────
  const drawDiamond = (ctx, cx, cy, size, alpha, rot) => {
    if(alpha<=0.01) return;
    ctx.save(); ctx.globalAlpha=alpha; ctx.strokeStyle='#ffffff';
    ctx.lineCap='round'; ctx.lineJoin='round';
    ctx.shadowBlur=32; ctx.shadowColor='rgba(255,255,255,0.7)';
    ctx.translate(cx, cy); ctx.rotate(rot);
    const s=size;
    // Outer rhombus
    ctx.lineWidth=5.5;
    ctx.beginPath(); ctx.moveTo(0,-s); ctx.lineTo(s*0.58,0); ctx.lineTo(0,s); ctx.lineTo(-s*0.58,0); ctx.closePath(); ctx.stroke();
    // Inner wireframe facets
    ctx.lineWidth=2; ctx.globalAlpha=alpha*0.55;
    ctx.beginPath(); ctx.moveTo(-s*0.58,0); ctx.lineTo(0,-s*0.38); ctx.lineTo(s*0.58,0); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-s*0.58,0); ctx.lineTo(0,s*0.38); ctx.lineTo(s*0.58,0); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0,-s); ctx.lineTo(0,-s*0.38); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0,s); ctx.lineTo(0,s*0.38); ctx.stroke();
    // Horizontal equator line
    ctx.globalAlpha=alpha*0.35; ctx.lineWidth=1.5;
    ctx.beginPath(); ctx.moveTo(-s*0.58,0); ctx.lineTo(s*0.58,0); ctx.stroke();
    ctx.shadowBlur=0; ctx.restore();
  };

  // ── Starfield ─────────────────────────────────────────────────────────────────
  const drawStarfield = (ctx, W, H, time, alpha) => {
    if(alpha<=0.01) return;
    const stars=[[120,200,1.2],[300,85,0.9],[540,155,1.5],[800,240,0.8],[950,125,1.1],
      [210,610,1.3],[680,510,0.7],[900,660,1.4],[105,910,0.9],[460,830,1.2],
      [750,790,1.0],[1010,905,0.8],[355,1110,1.3],[820,1060,0.9],[540,1210,1.5],
      [185,1355,0.7],[705,1310,1.1],[955,1405,0.8],[285,1605,1.2],[635,1525,0.9],
      [885,1585,1.0],[125,1755,1.3],[455,1705,0.8],[785,1825,1.1]];
    ctx.save(); ctx.fillStyle='#ffffff';
    stars.forEach(([x,y,r])=>{
      const twinkle=0.4+Math.sin(time*1.5+x*0.03)*0.6;
      ctx.globalAlpha=alpha*twinkle*0.85;
      ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill();
    });
    ctx.restore();
  };

  // ── Firma (Dan Koe Card — backlight + diamante 3D) ───────────────────────────
  const drawSignatureCard = (ctx, cx, cy, cardOpacity, cardOffsetY, lightX, lightY, breathe, scene) => {
    const cardWidth=800, cardHeight=1500, cardX=cx-cardWidth/2, cardY=cy-cardHeight/2;
    // Capa 1: Gran resplandor central (backlight)
    ctx.save(); ctx.globalAlpha=cardOpacity*breathe;
    const bg=ctx.createRadialGradient(lightX,lightY,cardWidth*0.15,lightX,lightY,cardWidth*1.3);
    bg.addColorStop(0,'rgba(220,216,208,1)'); bg.addColorStop(0.15,'rgba(190,186,178,0.85)');
    bg.addColorStop(0.3,'rgba(155,151,144,0.6)'); bg.addColorStop(0.5,'rgba(110,107,102,0.3)');
    bg.addColorStop(0.7,'rgba(65,63,58,0.1)'); bg.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=bg; ctx.fillRect(0,0,W,H); ctx.restore();
    // Capa 2: Luz secundaria
    ctx.save(); ctx.globalAlpha=cardOpacity*breathe*0.75;
    const bl=ctx.createRadialGradient(lightX-180,lightY-80,0,lightX-180,lightY-80,cardHeight*0.6);
    bl.addColorStop(0,'rgba(230,226,218,0.95)'); bl.addColorStop(0.2,'rgba(180,176,168,0.6)');
    bl.addColorStop(0.5,'rgba(90,87,82,0.12)'); bl.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=bl; ctx.fillRect(0,0,W,H); ctx.restore();
    // Tarjeta principal (DC Batman entry via cardOffsetY)
    ctx.save(); ctx.globalAlpha=cardOpacity; ctx.translate(0,cardOffsetY);
    ctx.fillStyle='#090909'; ctx.fillRect(cardX,cardY,cardWidth,cardHeight);
    const le=ctx.createLinearGradient(cardX-1,0,cardX+4,0);
    le.addColorStop(0,'rgba(220,216,208,0.6)'); le.addColorStop(0.5,'rgba(180,176,168,0.25)'); le.addColorStop(1,'rgba(180,176,168,0)');
    ctx.fillStyle=le; ctx.fillRect(cardX-1,cardY,5,cardHeight);
    const te=ctx.createLinearGradient(0,cardY-1,0,cardY+3);
    te.addColorStop(0,'rgba(200,196,188,0.4)'); te.addColorStop(1,'rgba(160,156,148,0)');
    ctx.fillStyle=te; ctx.fillRect(cardX,cardY-1,cardWidth*0.6,4);
    // Texto
    ctx.globalAlpha=cardOpacity;
    ctx.font='bold 50px Montserrat,sans-serif'; ctx.fillStyle='#ffffff';
    ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.fillText('CREA TU', cx, cy-450);
    ctx.font='900 88px Montserrat,sans-serif'; ctx.fillText('ACTIVO', cx, cy-350);
    // Diamante 3D rotando
    drawDiamond3D(ctx,cx,cy-80,180,scene,cardOpacity);
    ctx.globalAlpha=cardOpacity;
    ctx.font='600 22px Montserrat,sans-serif'; ctx.fillStyle='rgba(255,255,255,0.85)';
    ctx.fillText('EL TERRENO ALQUILADO', cx, cy+280);
    ctx.font='900 64px Montserrat,sans-serif'; ctx.fillStyle='#ffffff';
    ctx.fillText('LUIS CABREJO', cx, cy+360);
    ctx.restore();
  };

  // ── Scene initialization ──────────────────────────────────────────────────────
  const initScene = () => {
    const particles=[];
    for(let i=0;i<100;i++) particles.push(new FloatingParticle(W,H));
    // Network nodes for Act 5 (upper-mid region, hero is lower)
    const networkNodes=[
      {tx:CX,     ty:720, r:8,opacity:0},{tx:CX-195, ty:600, r:6,opacity:0},
      {tx:CX+195, ty:600, r:6,opacity:0},{tx:CX-355, ty:760, r:5,opacity:0},
      {tx:CX+355, ty:760, r:5,opacity:0},{tx:CX-175, ty:900, r:7,opacity:0},
      {tx:CX+175, ty:900, r:7,opacity:0},{tx:CX-415, ty:540, r:5,opacity:0},
      {tx:CX+415, ty:540, r:5,opacity:0},{tx:CX,     ty:460, r:6,opacity:0},
      {tx:CX-285, ty:410, r:4,opacity:0},{tx:CX+285, ty:410, r:4,opacity:0},
      {tx:CX-80,  ty:1030,r:5,opacity:0},{tx:CX+80,  ty:1030,r:5,opacity:0},
      {tx:CX-460, ty:890, r:4,opacity:0},{tx:CX+460, ty:890, r:4,opacity:0},
      {tx:CX-195, ty:340, r:4,opacity:0},{tx:CX+195, ty:340, r:4,opacity:0},
    ];
    networkNodes.forEach(nd=>{ nd.x=nd.tx; nd.y=nd.ty; });
    return {
      floatingParticles: particles,
      // Act 1
      fallingBlocks:  [],
      stackedBlocks:  [],
      hearts:         [],
      nextBlockTime:  0.45,
      nextHeartTime:  0.80,
      // Act 3
      castleParticles: [],
      castleShattered: false,
      castleShatterTime: -1,
      // Act 4
      funnelShapes:   [],
      nextShapeTime:  0.5,
      // Act 5
      networkNodes,
      cylinderEntries: [-1,-1,-1],
      // Act 6
      collapseStarted: false,
      ecosystemBurst: [],
      ecosystemBurstTriggered: false,
      // Firma
      sparks: [],
      diamond: (() => {
        const dv=[], de=[];
        dv.push({x:0,y:-0.55,z:0});
        for(let i=0;i<8;i++){const a=(Math.PI*2*i)/8; dv.push({x:Math.cos(a)*0.55,y:-0.35,z:Math.sin(a)*0.55});}
        for(let i=0;i<8;i++){const a=(Math.PI*2*i)/8; dv.push({x:Math.cos(a)*1.0,y:0,z:Math.sin(a)*1.0});}
        dv.push({x:0,y:1.6,z:0});
        for(let i=1;i<=8;i++) de.push([0,i]);
        for(let i=1;i<=8;i++) de.push([i,i===8?1:i+1]);
        for(let i=0;i<8;i++){de.push([i+1,i+9]); de.push([i+1,((i+1)%8)+9]);}
        for(let i=9;i<=16;i++) de.push([i,i===16?9:i+1]);
        for(let i=9;i<=16;i++) de.push([i,17]);
        return { angleX:0, angleY:0, vertices:dv, edges:de };
      })(),
    };
  };

  // ── Stop / Start ──────────────────────────────────────────────────────────────
  const stopAnimation = () => {
    if(animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    animationFrameRef.current=null; startTimeRef.current=null;
    setIsPlaying(false); setProgress(0); setStatus('Detenido');
  };

  const startAnimation = () => {
    if(animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    sceneRef.current=initScene(); startTimeRef.current=null; setIsPlaying(true); setProgress(0);
  };

  // ── Main loop ─────────────────────────────────────────────────────────────────
  const update = () => {
    const canvas=canvasRef.current; if(!canvas) return;
    const ctx=canvas.getContext('2d',{alpha:false}); if(!ctx) return;
    const now=performance.now();
    if(!startTimeRef.current) startTimeRef.current=now;
    const time=Math.min((now-startTimeRef.current)/1000, DURATION);
    const fc=Math.floor(time*FPS);
    const scene=sceneRef.current; if(!scene) return;
    setProgress(time/DURATION);

    const breathe=0.97+Math.sin(time*1.1)*0.03;

    // ── Background ──
    ctx.fillStyle='#050505'; ctx.fillRect(0,0,W,H);
    // Background grid (subtle drift — HANDOFF Tier 4)
    const bgGridOp = time<T1?0.028 : time<T2?0.022 : time<T3?0.018 : time<T4?0.025 : time<T5?0.028 : 0.015;
    drawBackgroundGrid(ctx,W,H,time,bgGridOp);
    scene.floatingParticles.forEach(p=>{p.update(W,H);p.draw(ctx);});

    // ══════════════════════════════════════════════════════════════════════════════
    // ACTO 1: LA TORRE INESTABLE (0 – 4.5s)
    // ══════════════════════════════════════════════════════════════════════════════
    if (time < T1) {
      const fadeIn=Easing.easeOutCubic(Math.min(1,time/0.5));

      // Ground reference line
      ctx.save(); ctx.globalAlpha=fadeIn*0.55; ctx.strokeStyle='#ffffff'; ctx.lineWidth=2;
      ctx.beginPath(); ctx.moveTo(0,GROUND_Y); ctx.lineTo(W,GROUND_Y); ctx.stroke(); ctx.restore();

      // Spawn falling content blocks
      if(time>=0.3 && scene.stackedBlocks.length<9 && time>=scene.nextBlockTime) {
        scene.fallingBlocks.push({
          x: CX+(-90+Math.random()*180), y:-70,
          vy: 500+Math.random()*130, size:70+Math.random()*18,
          type: Math.floor(Math.random()*10)
        });
        scene.nextBlockTime=time+0.50;
      }
      // Update falling blocks → land on stack
      scene.fallingBlocks=scene.fallingBlocks.filter(b=>{
        b.y+=b.vy/FPS;
        const stackTop=GROUND_Y-scene.stackedBlocks.length*76;
        if(b.y>=stackTop-44) { scene.stackedBlocks.push({size:b.size,xOff:b.x-CX,type:b.type||0}); return false; }
        return true;
      });
      // Tower wobble (grows with height)
      const wobbleAmt=Math.sin(time*5.5)*Math.min(16,scene.stackedBlocks.length*2.8);
      // Draw stacked tower
      scene.stackedBlocks.forEach((b,i)=>{
        const f=i/Math.max(1,scene.stackedBlocks.length);
        const bx=CX+b.xOff*0.28+wobbleAmt*f;
        const by=GROUND_Y-i*76-38;
        drawSocialIcon(ctx,bx,by,b.size,fadeIn*0.92,b.type||0);
      });
      // Draw falling blocks
      scene.fallingBlocks.forEach(b=>drawSocialIcon(ctx,b.x,b.y,b.size,fadeIn*0.85,b.type||0));

      // Spawn hearts (likes)
      if(time>=0.8 && time>=scene.nextHeartTime) {
        scene.hearts.push({x:CX+(-160+Math.random()*320), y:180+Math.random()*320, vy:260+Math.random()*100, size:22+Math.random()*12, dissolving:false, phase:0});
        scene.nextHeartTime=time+0.62;
      }
      // Update hearts
      scene.hearts=scene.hearts.filter(h=>{
        h.y+=h.vy/FPS;
        const towerTop=GROUND_Y-scene.stackedBlocks.length*76;
        if(!h.dissolving && h.y>=towerTop-55) h.dissolving=true;
        if(h.dissolving) h.phase+=1.6/FPS;
        const alpha=h.dissolving?Math.max(0,1-h.phase):1;
        if(h.dissolving && h.phase>0.05) {
          // Kinetic dust
          for(let p=0;p<2;p++) {
            ctx.save(); ctx.globalAlpha=Math.max(0,alpha*0.45*(1-h.phase));
            ctx.fillStyle='#ffffff';
            ctx.beginPath(); ctx.arc(h.x+(Math.sin(h.phase*9+p*2.3)*28), h.y-(h.phase*22+p*12), 1.8, 0, Math.PI*2); ctx.fill();
            ctx.restore();
          }
        }
        if(alpha>0.01) drawHeart(ctx,h.x,h.y,h.size,alpha*fadeIn);
        return h.phase<1.1 && h.y<GROUND_Y+40;
      });

      // Hero (catches, slight catch animation)
      const catchBob=scene.fallingBlocks.length>0?Math.sin(time*6)*0.10:0;
      drawHero(ctx,CX,GROUND_Y-36,36*breathe*(1+catchBob),fadeIn,36+time*3);

      // Fade to black (últimos 0.8s del acto)
      if(time > T1-0.8) {
        const fp=Easing.easeInQuad(Math.min(1,(time-(T1-0.8))/0.8));
        ctx.save(); ctx.globalAlpha=fp*0.88; ctx.fillStyle='#050505'; ctx.fillRect(0,0,W,H); ctx.restore();
      }
      setStatus('Acto 1: La Torre Inestable');
    }

    // ══════════════════════════════════════════════════════════════════════════════
    // ACTO 2: EL TERRENO ALQUILADO (7.05 – 12.517s)
    // 07:04 castillo grande 1 segundo, luego zoom out hasta 12:31
    // ══════════════════════════════════════════════════════════════════════════════
    else if (time < T2) {
      const t2=(time-T1)/(T2-T1);
      const fadeIn=Easing.easeOutCubic(Math.min(1,t2/0.10)); // rápido fade-in

      // 1s hold grande antes de zoom out (BIG_END = T1+1.0 = 8.05s)
      const BIG_END = T1 + 1.0;
      const zoomRaw = time < BIG_END ? 0 : (time - BIG_END) / (T2 - BIG_END);
      const zoomP   = Easing.easeOutCubic(Math.min(1, zoomRaw / 0.55));
      const scaleV  = lerp(1.0, 0.52, zoomP);

      ctx.save();
      ctx.translate(CX, GROUND_Y); ctx.scale(scaleV, scaleV); ctx.translate(-CX, -GROUND_Y);

      // Abyss below
      drawAbyss(ctx, GROUND_Y+6, GROUND_Y+700, fadeIn*Math.min(1,t2*3.5));
      // Dotted rented ground
      drawDottedGround(ctx, CX, GROUND_Y, 720, fadeIn, time);
      // Castle (slightly wobbles)
      const castleWob=Math.sin(time*0.9)*1.8;
      drawCastle(ctx, CX, GROUND_Y, 1.5, fadeIn, castleWob);
      // Platform under castle (semi-transparent)
      ctx.save(); ctx.globalAlpha=fadeIn*0.12; ctx.fillStyle='#ffffff';
      ctx.fillRect(CX-150, GROUND_Y, 300, 7); ctx.restore();

      ctx.restore(); // end zoom

      // Document icon (blinks = contract / TOS) — aparece tras el hold
      if(time > BIG_END + 0.5) {
        const tDoc = time - (BIG_END + 0.5);
        const blinkAlpha=Math.floor(time*2.3)%2===0?0.90:0.38;
        const docP=Easing.easeOutBack(Math.min(1,tDoc/0.35));
        drawDocument(ctx, CX+260, GROUND_Y-170, blinkAlpha*fadeIn*docP);
      }

      // Sin fade a negro — el castillo sigue visible al entrar en Acto 3 (tiembla)
      setStatus('Acto 2: El Terreno Alquilado');
    }

    // ══════════════════════════════════════════════════════════════════════════════
    // ACTO 3: EL COLAPSO ALGORÍTMICO (12.517 – 19.067s) → EXPLOSIÓN @ 16:25 (16.417s)
    // Castillo tiembla desde 12:31, explota a 16:25, negro completo antes de 19:04
    // ══════════════════════════════════════════════════════════════════════════════
    else if (time < T3) {
      const SHATTER_T=16.417, BLACK_T=17.917; // 16:25 explosión · negro @ 17.917s

      // TREMBLING PHASE (T2=12.517 → SHATTER_T=16.417s)
      if(time < SHATTER_T) {
        const tRemb=(time-T2)/(SHATTER_T-T2); // 0→1 durante el temblor
        const fadeIn=Easing.easeOutCubic(Math.min(1,(time-T2)/0.35));
        const shakeFreq=16+tRemb*26;           // 16hz → 42hz (se acelera)
        const shakeAmp =4+tRemb*34;            // 4px → 38px (crece)
        const shakeX=Math.sin(time*shakeFreq)*shakeAmp;
        const shakeY=Math.sin(time*shakeFreq*1.38+1.1)*shakeAmp*0.42;

        // Dotted ground se va rompiendo con el temblor
        const gapSize=12+tRemb*200;
        ctx.save(); ctx.globalAlpha=fadeIn*(1-tRemb*0.65); ctx.strokeStyle='#ffffff'; ctx.lineWidth=3;
        ctx.setLineDash([12,gapSize]); ctx.lineDashOffset=-time*22;
        ctx.beginPath(); ctx.moveTo(CX-370+shakeX*0.3,GROUND_Y); ctx.lineTo(CX+370+shakeX*0.3,GROUND_Y); ctx.stroke();
        ctx.setLineDash([]); ctx.restore();

        // RGB glitch aparece en el último 30% del temblor (muy intenso al final)
        if(tRemb>0.70) {
          const gP=(tRemb-0.70)/0.30;
          [[0.20,shakeAmp*0.45],[-0.14,-shakeAmp*0.35]].forEach(([a,ox])=>{
            ctx.save(); ctx.globalAlpha=Math.abs(a)*gP; ctx.translate(ox,0);
            drawCastle(ctx,CX+shakeX,GROUND_Y+shakeY,0.78,1,0); ctx.restore();
          });
        }

        // Castillo principal tiembla
        ctx.save(); ctx.globalAlpha=fadeIn; ctx.translate(shakeX,shakeY);
        drawCastle(ctx,CX,GROUND_Y,0.78,1,0);
        ctx.restore();
      }

      // SHATTER (16.417s) — castle explodes into particles
      if(time>=SHATTER_T && !scene.castleShattered) {
        scene.castleShattered=true; scene.castleShatterTime=time;
        for(let i=0;i<68;i++) {
          const angle=Math.random()*Math.PI*2, spd=3.5+Math.random()*13;
          scene.castleParticles.push({
            x:CX+(Math.random()-0.5)*140, y:GROUND_Y-180+(Math.random()-0.5)*240,
            vx:Math.cos(angle)*spd, vy:Math.sin(angle)*spd-8.5,
            size:4+Math.random()*13, rotation:Math.random()*Math.PI*2,
            rotSpeed:(Math.random()-0.5)*0.32, life:1,
            decay:0.007+Math.random()*0.016, pts:3+Math.floor(Math.random()*4)
          });
        }
      }
      if(scene.castleShattered && time<BLACK_T) {
        scene.castleParticles.forEach(p=>{
          p.x+=p.vx; p.y+=p.vy; p.vy+=0.55; p.vx*=0.98; p.rotation+=p.rotSpeed; p.life-=p.decay;
          if(p.life>0.01) {
            ctx.save(); ctx.globalAlpha=p.life; ctx.strokeStyle='#ffffff'; ctx.lineWidth=1.8;
            ctx.translate(p.x,p.y); ctx.rotate(p.rotation);
            ctx.beginPath();
            for(let v=0;v<p.pts;v++){
              const a=(Math.PI*2*v/p.pts);
              v===0?ctx.moveTo(Math.cos(a)*p.size,Math.sin(a)*p.size):ctx.lineTo(Math.cos(a)*p.size,Math.sin(a)*p.size);
            }
            ctx.closePath(); ctx.stroke(); ctx.restore();
          }
        });
        scene.castleParticles=scene.castleParticles.filter(p=>p.life>0.01);
      }

      // BLACK SCREEN overlay (15.5–17.5s)
      if(time>=BLACK_T) {
        const bp=Math.min(1,(time-BLACK_T)/0.35);
        ctx.save(); ctx.globalAlpha=bp; ctx.fillStyle='#050505'; ctx.fillRect(0,0,W,H); ctx.restore();
      }
      setStatus('Acto 3: El Colapso Algorítmico');
    }

    // ══════════════════════════════════════════════════════════════════════════════
    // ACTO 4: LA FUGA DE ATENCIÓN (17.5 – 23.5s)
    // ══════════════════════════════════════════════════════════════════════════════
    else if (time < T4) {
      const t4=(time-T3)/(T4-T3);
      const fadeIn=Easing.easeOutCubic(Math.min(1,t4/0.20));
      const FUNNEL_CX=360, FUNNEL_CY=960;

      // Funnel aparece exactamente en T3=19.067s (19:04)
      const funnelP=Easing.easeOutBack(Math.min(1,prog(time,T3,1.3)));
      drawFunnel(ctx, FUNNEL_CX, FUNNEL_CY, funnelP, fadeIn);

      // Falling shapes through funnel (attention metaphor)
      if(t4>0.18 && time>=scene.nextShapeTime) {
        scene.funnelShapes.push({
          x: FUNNEL_CX+(-80+Math.random()*160), y: FUNNEL_CY-300,
          vy: 210+Math.random()*90, type:Math.floor(Math.random()*3),
          size: 16+Math.random()*10, opacity:1
        });
        scene.nextShapeTime=time+0.46;
      }
      scene.funnelShapes=scene.funnelShapes.filter(s=>{
        s.y+=s.vy/FPS;
        const fp=clamp((s.y-(FUNNEL_CY-220))/440,0,1);
        const maxX=lerp(150,14,fp);
        s.x=clamp(s.x, FUNNEL_CX-maxX, FUNNEL_CX+maxX);
        if(s.y>FUNNEL_CY+180) s.opacity=Math.max(0,s.opacity-0.05);
        if(s.opacity>0.01) {
          ctx.save(); ctx.globalAlpha=s.opacity*fadeIn; ctx.strokeStyle='#ffffff'; ctx.lineWidth=2.2; ctx.lineCap='round';
          if(s.type===0) {
            ctx.beginPath(); ctx.arc(s.x,s.y,s.size/2,0,Math.PI*2); ctx.stroke();
          } else if(s.type===1) {
            // 5-pointed star
            ctx.beginPath();
            for(let i=0;i<5;i++){
              const a=(i*Math.PI*2/5)-Math.PI/2, ai=((i+0.5)*Math.PI*2/5)-Math.PI/2;
              i===0?ctx.moveTo(s.x+Math.cos(a)*s.size,s.y+Math.sin(a)*s.size):ctx.lineTo(s.x+Math.cos(a)*s.size,s.y+Math.sin(a)*s.size);
              ctx.lineTo(s.x+Math.cos(ai)*s.size*0.42,s.y+Math.sin(ai)*s.size*0.42);
            }
            ctx.closePath(); ctx.stroke();
          } else {
            // Eye
            ctx.beginPath(); ctx.ellipse(s.x,s.y,s.size*0.78,s.size*0.44,0,0,Math.PI*2); ctx.stroke();
            ctx.globalAlpha=s.opacity*fadeIn*0.8; ctx.fillStyle='#ffffff';
            ctx.beginPath(); ctx.arc(s.x,s.y,s.size*0.22,0,Math.PI*2); ctx.fill();
          }
          ctx.restore();
        }
        return s.opacity>0.01 && s.y<FUNNEL_CY+420;
      });

      // "No bottom" void indicator
      if(t4>0.35) {
        ctx.save(); ctx.globalAlpha=fadeIn*(0.18+Math.sin(time*2.8)*0.12);
        ctx.fillStyle='#ffffff'; ctx.font='24px Montserrat,sans-serif'; ctx.textAlign='center';
        ctx.fillText('▼  ▼  ▼', FUNNEL_CX, FUNNEL_CY+240); ctx.restore();
      }

      // "SIN CONTROL" on right — circle-slash symbol cycles, tries to form but fails
      const SHIELD_CX=720, SHIELD_CY=960;
      if(t4>0.32) {
        const sStartP=Math.min(1,(t4-0.32)/0.15);
        const sCycle=(((time-T3-1.9)%2.5)/2.5+1)%1;
        let shP=0;
        if(sCycle<0.48) shP=Easing.easeOutCubic(sCycle/0.48)*0.88;
        else if(sCycle<0.62) shP=0.88*(1-(sCycle-0.48)/0.14);
        const shAlpha=Math.abs(Math.sin(sCycle*Math.PI))*0.92*Math.min(1,sStartP*4);
        drawNoControl(ctx, SHIELD_CX, SHIELD_CY, shP, fadeIn*shAlpha);
      }

      // Fade to Act 5
      if(t4>0.82) {
        const fp=Easing.easeInQuad(Math.min(1,(t4-0.82)/0.18));
        ctx.save(); ctx.globalAlpha=fp*0.92; ctx.fillStyle='#050505'; ctx.fillRect(0,0,W,H); ctx.restore();
      }
      setStatus('Acto 4: La Fuga de Atención');
    }

    // ══════════════════════════════════════════════════════════════════════════════
    // ACTO 5: LA INFRAESTRUCTURA DEL ARQUITECTO (23.5 – 34s)
    // ══════════════════════════════════════════════════════════════════════════════
    else if (time < T5) {
      const t5=(time-T4)/(T5-T4);
      const fadeIn=Easing.easeOutCubic(Math.min(1,t5/0.14));
      const GROUND_A5=1460;

      // Solid ground sweeps in (Phase A)
      const sweepP=Easing.easeOutCubic(prog(time, T4, 1.1));
      drawSolidGround(ctx, GROUND_A5, sweepP, fadeIn);

      // Hero (calm, protected)
      const heroA=Easing.easeOutCubic(prog(time, T4+0.5, 0.75));
      drawHero(ctx, CX, GROUND_A5-46, 38*breathe, heroA, 44+Math.sin(time*0.9)*12);

      // Dome
      const domeA=Easing.easeOutCubic(prog(time, T4+0.85, 0.8));
      drawDome(ctx, CX, GROUND_A5-46, 136, domeA*heroA, breathe-1);

      // Repelled like hearts bounce off dome
      if(t5>0.15 && Math.random()<0.05) {
        const angle=-Math.PI/2+(Math.random()-0.5)*Math.PI*1.1;
        const hx=CX+Math.cos(angle)*136, hy=GROUND_A5-46+Math.sin(angle)*136*0.45;
        ctx.save(); ctx.globalAlpha=0.32; ctx.strokeStyle='#ffffff'; ctx.lineWidth=1.5;
        ctx.beginPath(); ctx.arc(hx,hy,11,0,Math.PI*2); ctx.stroke(); ctx.restore();
      }

      // Phase B: 3 cylinders — timecodes anclados: 26:19 / 28:17 / 29:15
      const CYL_OFFSETS=[2.817,4.783,5.75]; // T4+offset = 26.317, 28.283, 29.25
      const CYL_POS=[[CX-258,GROUND_A5-78],[CX,GROUND_A5-78],[CX+258,GROUND_A5-78]];
      CYL_POS.forEach(([cx2,cy2],i)=>{
        const cylStart=T4+CYL_OFFSETS[i];
        if(time<cylStart) return;
        const cP=prog(time, cylStart, 0.55);
        const bounceY=Easing.easeOutBounce(cP);
        const drawY=lerp(cy2-580, cy2, bounceY);
        drawCylinder(ctx, cx2, drawY, Easing.easeOutCubic(cP), Easing.easeOutCubic(cP));
        if(scene.cylinderEntries[i]<0 && cP>0.95) scene.cylinderEntries[i]=time;
      });

      // Phase C: Network nodes emerge FROM cylinder tops (tras cilindro 3 @ 29:15)
      const NET_START=T4+6.5; // 30.0s — da tiempo al cilindro 3 para establecerse
      const CYL_TOP_Y=GROUND_A5-78-65; // top of cylinders (cy - cH/2)
      const cylTops=[[CX-258,CYL_TOP_Y],[CX,CYL_TOP_Y],[CX+258,CYL_TOP_Y]];
      if(time>=NET_START) {
        const netFadeP=prog(time, NET_START, 1.2);
        scene.networkNodes.forEach((nd,i)=>{
          nd.opacity=Math.min(1,nd.opacity+0.018*(1+Math.random()*0.3));
          nd.x=nd.tx+Math.sin(time*0.31+i*1.15)*9;
          nd.y=nd.ty+Math.cos(time*0.26+i*0.88)*6;
          // Line grows from cylinder top to node as opacity builds
          const [sx,sy]=cylTops[i%3];
          const lineP=Math.min(1,nd.opacity*2.2);
          if(lineP>0.05) {
            ctx.save();
            ctx.globalAlpha=nd.opacity*0.55*fadeIn*netFadeP;
            ctx.strokeStyle='#ffffff'; ctx.lineWidth=0.9;
            ctx.beginPath(); ctx.moveTo(sx,sy); ctx.lineTo(lerp(sx,nd.x,lineP),lerp(sy,nd.y,lineP)); ctx.stroke();
            ctx.restore();
          }
          // Rhythmic pulsing node
          const pulse=1+Math.sin(time*2.8+i*0.85)*0.22;
          drawNetworkNode(ctx,nd.x,nd.y,nd.r*pulse,nd.opacity*fadeIn*netFadeP);
        });
        // Node-to-node web (secondary connections)
        scene.networkNodes.forEach((n1,i)=>scene.networkNodes.forEach((n2,j)=>{
          if(j<=i) return;
          const dx=n2.x-n1.x, dy=n2.y-n1.y, d=Math.sqrt(dx*dx+dy*dy);
          if(d<360) {
            ctx.save(); ctx.globalAlpha=(1-d/360)*0.28*Math.min(1,n1.opacity)*Math.min(1,n2.opacity)*fadeIn;
            ctx.strokeStyle='#ffffff'; ctx.lineWidth=0.7;
            ctx.beginPath(); ctx.moveTo(n1.x,n1.y); ctx.lineTo(n2.x,n2.y); ctx.stroke(); ctx.restore();
          }
        }));
      }

      // Phase D: Fractal ring (30.5s+)
      const FRAC_START=T4+6.6;
      if(time>=FRAC_START) {
        const fracP=Easing.easeOutCubic(prog(time, FRAC_START, 1.8));
        for(let i=0;i<18;i++) {
          const a=(Math.PI*2*i/18)+time*0.055;
          const r=lerp(0,390,fracP);
          const nx=CX+Math.cos(a)*r, ny=920+Math.sin(a)*r*0.72;
          const nOp=fracP*(0.48+Math.sin(time*2+i)*0.24)*fadeIn;
          drawNetworkNode(ctx,nx,ny,4*(1+Math.sin(time*1.8+i)*0.12),nOp);
          if(nOp>0.12 && scene.networkNodes.length>0) {
            const near=scene.networkNodes[i%scene.networkNodes.length];
            const d=Math.sqrt((near.x-nx)**2+(near.y-ny)**2);
            if(d<520) {
              ctx.save(); ctx.globalAlpha=nOp*0.28*(1-d/520); ctx.strokeStyle='#ffffff'; ctx.lineWidth=0.8;
              ctx.beginPath(); ctx.moveTo(nx,ny); ctx.lineTo(near.x,near.y); ctx.stroke(); ctx.restore();
            }
          }
        }
      }

      // Fade to Act 6
      if(t5>0.84) {
        const fp=Easing.easeInQuad(Math.min(1,(t5-0.84)/0.16));
        ctx.save(); ctx.globalAlpha=fp*0.94; ctx.fillStyle='#050505'; ctx.fillRect(0,0,W,H); ctx.restore();
      }
      setStatus('Acto 5: La Infraestructura del Arquitecto');
    }

    // ══════════════════════════════════════════════════════════════════════════════
    // ACTO 6: EL ACTIVO (34 – 39s)
    // Phase A (34–35.5s): ECOSYSTEM APOGEO — red al máximo, burst de energía
    // Phase B (35.5–37s): CONVERGENCIA — nodos fluyen al centro, diamante 3D nace
    // Phase C (37–39s):   FIRMA — DC Batman entry, backlight, diamante rotando
    // ══════════════════════════════════════════════════════════════════════════════
    else if (time < DURATION) {
      const APOGEO_END  = T5 + 1.5;  // 35.5s
      const CARD_START  = T5 + 1.5;  // 35.5s — firma inmediatamente tras apogeo (diamante omitido)

      // Starfield fades in smoothly throughout Act 6
      const t6=(time-T5)/5.0;
      drawStarfield(ctx, W, H, time, Math.min(1,t6/0.25)*0.72);

      // ── Phase A: Ecosystem Apogeo (34–35.5s) ──────────────────────────────────
      if(time < APOGEO_END) {
        const apogeoP = Math.min(1,(time-T5)/1.5);

        // Trigger particle burst once
        if(!scene.ecosystemBurstTriggered) {
          scene.ecosystemBurstTriggered=true;
          for(let i=0;i<300;i++){
            const angle=(Math.PI*2*i/300)+(Math.random()-0.5)*0.3;
            const speed=4+Math.random()*20;
            const sz=1.5+Math.random()*4.5;
            scene.ecosystemBurst.push(new ExplosionParticle(CX,920,angle,speed,sz));
          }
        }

        // Amplified network nodes
        scene.networkNodes.forEach((nd,i)=>{
          nd.x=nd.tx+Math.sin(time*0.31+i*1.15)*14;
          nd.y=nd.ty+Math.cos(time*0.26+i*0.88)*10;
          const pulse=1+Math.sin(time*2.8+i*0.85)*0.35;
          drawNetworkNode(ctx,nd.x,nd.y,nd.r*pulse*(1+apogeoP*0.55),Math.min(1,nd.opacity*1.2));
        });

        // Blazing node-to-node connections
        scene.networkNodes.forEach((n1,i)=>scene.networkNodes.forEach((n2,j)=>{
          if(j<=i) return;
          const dx=n2.x-n1.x,dy=n2.y-n1.y,d=Math.sqrt(dx*dx+dy*dy);
          if(d<380){
            ctx.save();
            ctx.globalAlpha=(1-d/380)*0.55*apogeoP*Math.min(1,n1.opacity)*Math.min(1,n2.opacity);
            ctx.strokeStyle='#ffffff'; ctx.lineWidth=1.1;
            ctx.shadowBlur=7; ctx.shadowColor='rgba(255,255,255,0.5)';
            ctx.beginPath(); ctx.moveTo(n1.x,n1.y); ctx.lineTo(n2.x,n2.y); ctx.stroke();
            ctx.shadowBlur=0; ctx.restore();
          }
        }));

        // Fractal ring at full intensity
        for(let i=0;i<18;i++){
          const a=(Math.PI*2*i/18)+time*0.055;
          const nx=CX+Math.cos(a)*390, ny=920+Math.sin(a)*390*0.72;
          const nOp=(0.55+Math.sin(time*2+i)*0.28)*apogeoP;
          drawNetworkNode(ctx,nx,ny,4.5*(1+Math.sin(time*1.8+i)*0.14),nOp);
          const near=scene.networkNodes[i%scene.networkNodes.length];
          const dx=near.x-nx,dy=near.y-ny,d=Math.sqrt(dx*dx+dy*dy);
          if(d<550){
            ctx.save(); ctx.globalAlpha=nOp*0.28*(1-d/550); ctx.strokeStyle='#ffffff'; ctx.lineWidth=0.9;
            ctx.beginPath(); ctx.moveTo(nx,ny); ctx.lineTo(near.x,near.y); ctx.stroke(); ctx.restore();
          }
        }

        // Orbital rings pulsing outward from ecosystem center
        for(let r=0;r<4;r++){
          const rP=((time*0.55+r*0.25)%1+1)%1;
          ctx.save(); ctx.globalAlpha=(1-rP)*0.18*apogeoP; ctx.strokeStyle='#ffffff'; ctx.lineWidth=2;
          ctx.beginPath(); ctx.arc(CX,920,rP*450+20,0,Math.PI*2); ctx.stroke(); ctx.restore();
        }
      }

      // Burst particles
      scene.ecosystemBurst=scene.ecosystemBurst.filter(p=>p.life>0);
      scene.ecosystemBurst.forEach(p=>{ p.update(); p.draw(ctx); });

      // ── Firma — DC Batman entry (35.5–39s) ─────────────────────────────────────
      if(time>=CARD_START) {
        const tCard=time-CARD_START;
        const slideP=Easing.easeOutQuart(Math.min(1,tCard/0.10));
        const slideOff=(1-slideP)*H;
        const lx=CX+220-tCard*480;
        const cardBreathe=0.97+Math.sin(tCard*0.65)*0.03;
        drawSignatureCard(ctx,CX,960,slideP,slideOff,lx,860,cardBreathe,scene);
      }

      setStatus('Acto 6: El Activo');
    }

    // ── Hold final ────────────────────────────────────────────────────────────────
    else {
      drawStarfield(ctx, W, H, time, 0.7);
      drawSignatureCard(ctx,CX,960,1,0,CX-260,860,breathe,scene);
      setStatus('Animación completada');
    }

    drawFilmGrain(ctx, W, H, 0.08, fc);

    if(time<DURATION) {
      animationFrameRef.current=requestAnimationFrame(update);
    } else {
      setIsPlaying(false); setProgress(1);
      if(mediaRecorderRef.current) mediaRecorderRef.current.stop();
      setStatus('Completado — listo para descargar');
    }
  };

  // ── Mount ─────────────────────────────────────────────────────────────────────
  useEffect(()=>{
    const canvas=canvasRef.current; if(!canvas) return;
    const ctx=canvas.getContext('2d',{alpha:false}); if(!ctx) return;
    const cx=canvas.width/2, cy=canvas.height/2;
    ctx.fillStyle='#050505'; ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.shadowBlur=38; ctx.shadowColor='rgba(255,255,255,0.5)';
    ctx.font='bold 44px Montserrat,sans-serif'; ctx.fillStyle='#ffffff'; ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.fillText('Día 9 · El Terreno Alquilado', cx, cy-80); ctx.shadowBlur=0;
    ctx.font='26px Montserrat,sans-serif'; ctx.fillStyle='rgba(255,255,255,0.6)';
    ctx.fillText('Dan Koe Style · 6 Actos · 39s', cx, cy+14);
    ctx.font='19px Montserrat,sans-serif'; ctx.fillStyle='rgba(255,255,255,0.3)';
    ctx.fillText('Presiona ▶ Reproducir para comenzar', cx, cy+104);
    return()=>{ if(animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current); };
  },[]);


  useEffect(()=>{ if(isPlaying) update(); },[isPlaying]);

  const handlePlay = () => {
    if(isPlaying){ stopAnimation(); return; }
    startAnimation();
  };

  const handleRecord = () => {
    if(isRecording){ mediaRecorderRef.current?.stop(); setIsRecording(false); return; }
    const canvas=canvasRef.current; if(!canvas) return;
    const stream=canvas.captureStream(FPS);
    recordedChunksRef.current=[];
    const mr=new MediaRecorder(stream,{mimeType:'video/webm;codecs=vp9',videoBitsPerSecond:12000000});
    mr.ondataavailable=(e)=>{ if(e.data.size>0) recordedChunksRef.current.push(e.data); };
    mr.onstop=()=>{
      const blob=new Blob(recordedChunksRef.current,{type:'video/webm'});
      const url=URL.createObjectURL(blob);
      const a=document.createElement('a'); a.href=url;
      a.download='dia9-terreno-alquilado-39s-60fps.webm'; a.click();
      URL.revokeObjectURL(url); setIsRecording(false);
    };
    mediaRecorderRef.current=mr; mr.start(100); setIsRecording(true);
    startAnimation();
  };

  // ── JSX ───────────────────────────────────────────────────────────────────────
  return (
    <div style={{display:'flex',flexDirection:'column',alignItems:'center',minHeight:'100vh',backgroundColor:'#0a0a0a',padding:'20px',fontFamily:'Montserrat,sans-serif'}}>
      <h1 style={{color:'#ffffff',fontSize:'19px',fontWeight:'700',marginBottom:'6px',letterSpacing:'0.08em'}}>DÍA 9 · EL TERRENO ALQUILADO</h1>
      <p style={{color:'rgba(255,255,255,0.4)',fontSize:'12px',marginBottom:'14px'}}>Dan Koe Style · 6 Actos · 39 segundos · 60fps · 1080×1920</p>
      <div style={{border:'1px solid rgba(255,255,255,0.10)',borderRadius:'8px',overflow:'hidden',marginBottom:'14px',maxWidth:'100%'}}>
        <canvas ref={canvasRef} width={W} height={H} style={{display:'block',width:'min(360px,88vw)',height:'auto'}}/>
      </div>
      {/* Progress bar */}
      <div style={{marginBottom:'10px',width:'min(360px,88vw)',backgroundColor:'rgba(255,255,255,0.06)',borderRadius:'4px',height:'3px'}}>
        <div style={{height:'3px',backgroundColor:'#ffffff',borderRadius:'4px',width:`${progress*100}%`,transition:'width 0.1s'}}/>
      </div>
      <p style={{color:'rgba(255,255,255,0.45)',fontSize:'11px',marginBottom:'14px'}}>{status}</p>
      <div style={{display:'flex',gap:'12px',flexWrap:'wrap',justifyContent:'center'}}>
        <button onClick={handlePlay} style={{padding:'10px 26px',backgroundColor:isPlaying?'rgba(255,255,255,0.07)':'#ffffff',color:isPlaying?'#ffffff':'#050505',border:'1px solid rgba(255,255,255,0.22)',borderRadius:'6px',cursor:'pointer',fontFamily:'Montserrat,sans-serif',fontWeight:'700',fontSize:'13px',letterSpacing:'0.05em'}}>
          {isPlaying?'⏹ Detener':'▶ Reproducir'}
        </button>
        <button onClick={handleRecord} style={{padding:'10px 26px',backgroundColor:isRecording?'rgba(255,60,60,0.12)':'rgba(255,255,255,0.05)',color:isRecording?'#ff5555':'rgba(255,255,255,0.8)',border:`1px solid ${isRecording?'rgba(255,60,60,0.35)':'rgba(255,255,255,0.14)'}`,borderRadius:'6px',cursor:'pointer',fontFamily:'Montserrat,sans-serif',fontWeight:'600',fontSize:'13px',letterSpacing:'0.05em'}}>
          {isRecording?'⏹ Detener Grab.':'⏺ Grabar WebM'}
        </button>
      </div>
      <p style={{color:'rgba(255,255,255,0.18)',fontSize:'10px',marginTop:'10px',textAlign:'center',maxWidth:'320px',lineHeight:'1.5'}}>
        Grabar = inicia desde frame 0 · Output: 1080×1920 · WebM VP9
      </p>
      {/* Act timeline reference */}
      <div style={{marginTop:'18px',width:'min(360px,88vw)',display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'6px'}}>
        {[['A1','0–5.5s','Torre Inestable'],['A2','5.5–10.5s','Terreno Alquilado'],['A3','10.5–17.5s','El Colapso'],
          ['A4','17.5–23.5s','Fuga Atención'],['A5','23.5–34s','Infraestructura'],['A6','34–39s','El Activo']].map(([act,t,label])=>(
          <div key={act} style={{backgroundColor:'rgba(255,255,255,0.04)',borderRadius:'4px',padding:'6px 8px',textAlign:'center'}}>
            <div style={{color:'rgba(255,255,255,0.6)',fontSize:'10px',fontWeight:'700'}}>{act} · {t}</div>
            <div style={{color:'rgba(255,255,255,0.3)',fontSize:'9px',marginTop:'2px'}}>{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
