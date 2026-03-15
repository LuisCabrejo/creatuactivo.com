'use client';

import React, { useRef, useState, useEffect } from 'react';

// ── DÍA 8 v2: EL APALANCAMIENTO DEL ARTESANO DIGITAL ─────────────────────────
// Basado en Opción 3 del documento de investigación visual (Guiones Día 8)
// 4 Actos enriquecidos:
//   Acto 1 (0–12s):  La Trampa Mecánica — cinta, engranajes, vaca, reloj arena
//   Acto 2 (12–22s): La Epifanía — héroe se separa, fondo se limpia, fulcro + palanca
//   Acto 3 (22–28s): El Estallido — salto parabólico, bloque vibra, explota en red
//   Acto 4 (28–35s): La Cosecha — red gira autónoma, héroe en escritorio, lluvia de partículas
//   Firma  (35–38s): CREA TU ACTIVO / EL APALANCAMIENTO / LUIS CABREJO

export default function Dia8V2() {
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
  const cowImgRef         = useRef<HTMLImageElement|null>(null);   // SVG vaca Dan Koe

  const FPS      = 60;
  const DURATION = 38;

  const T1 = 12.0;  // Acto 1 → 2
  const T2 = 22.0;  // Acto 2 → 3
  const T3 = 28.0;  // Acto 3 → 4
  const T4 = 35.0;  // Acto 4 → Firma
  const T5 = 38.0;  // Firma  → Hold

  // Lever geometry
  const PVT_X = 540, PVT_Y = 1150;
  const LEV_L = 380, LEV_R = 260;
  const MAX_TILT = -0.28;
  const BLOCK_SZ = 160;

  // Belt geometry
  const BELT_TOP = 1060, BELT_H = 55, BELT_W = 820;

  const Easing = {
    easeOutExpo:    (x) => x===1?1:1-Math.pow(2,-10*x),
    easeOutBack:    (x) => { const c1=1.70158,c3=c1+1; return 1+c3*Math.pow(x-1,3)+c1*Math.pow(x-1,2); },
    easeOutQuad:    (x) => 1-(1-x)*(1-x),
    easeInQuart:    (x) => x*x*x*x,
    easeOutQuart:   (x) => 1-Math.pow(1-x,4),
    easeOutCubic:   (x) => 1-Math.pow(1-x,3),
    easeInOutCubic: (x) => x<0.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2,
    easeInOutSine:  (x) => -(Math.cos(Math.PI*x)-1)/2,
    easeInQuad:     (x) => x*x,
    easeOutBounce:  (x) => {
      const n1=7.5625,d1=2.75;
      if(x<1/d1) return n1*x*x;
      else if(x<2/d1){const xm=x-1.5/d1; return n1*xm*xm+0.75;}
      else if(x<2.5/d1){const xm=x-2.25/d1; return n1*xm*xm+0.9375;}
      else{const xm=x-2.625/d1; return n1*xm*xm+0.984375;}
    },
  };

  // ── Utilidades ───────────────────────────────────────────────────────────────

  const drawFilmGrain = (ctx, W, H, intensity, fc) => {
    const gs=2, cols=Math.floor(W/gs), rows=Math.floor(H/gs), seed=Math.floor(fc/3);
    ctx.save(); ctx.globalAlpha=intensity; ctx.fillStyle='#ffffff';
    for (let i=0; i<cols*rows*0.015; i++) {
      const s=(seed*9301+i*49297)%233280, r=s/233280;
      ctx.fillRect((r*cols)*gs, ((s*0.397)%rows)*gs, gs, gs);
    }
    ctx.restore();
  };

  const drawBackgroundGrid = (ctx, W, H, time, opacity) => {
    ctx.save(); ctx.globalAlpha=opacity; ctx.strokeStyle='#ffffff'; ctx.lineWidth=0.5;
    const gs=120, ox=(time*15)%gs, oy=(time*10)%gs;
    for (let x=-gs+ox; x<W+gs; x+=gs) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke(); }
    for (let y=-gs+oy; y<H+gs; y+=gs) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }
    ctx.restore();
  };

  class FloatingParticle {
    constructor(W, H) {
      this.x=Math.random()*W; this.y=Math.random()*H;
      this.vx=(Math.random()-0.5)*0.7; this.vy=(Math.random()-0.5)*0.7;
      this.size=1+Math.random()*2.5; this.opacity=0.06+Math.random()*0.12;
    }
    update(W, H) { this.x+=this.vx; this.y+=this.vy; if(this.x<0)this.x=W; if(this.x>W)this.x=0; if(this.y<0)this.y=H; if(this.y>H)this.y=0; }
    draw(ctx) { ctx.save(); ctx.globalAlpha=this.opacity; ctx.fillStyle='#ffffff'; ctx.beginPath(); ctx.arc(this.x,this.y,this.size,0,Math.PI*2); ctx.fill(); ctx.restore(); }
  }

  class ExplosionParticle {
    constructor(x, y, angle, speed, size) {
      this.x=x; this.y=y; this.vx=Math.cos(angle)*speed; this.vy=Math.sin(angle)*speed;
      this.size=size; this.life=1; this.decay=0.016+Math.random()*0.014;
      this.rotation=Math.random()*Math.PI*2; this.rotSpeed=(Math.random()-0.5)*0.25;
    }
    update() { this.x+=this.vx; this.y+=this.vy; this.vy+=0.12; this.vx*=0.98; this.rotation+=this.rotSpeed; this.life-=this.decay; }
    draw(ctx) {
      if(this.life<=0)return;
      ctx.save(); ctx.globalAlpha=Math.max(0,this.life); ctx.fillStyle='#ffffff';
      ctx.translate(this.x,this.y); ctx.rotate(this.rotation);
      ctx.fillRect(-this.size/2,-this.size/2,this.size,this.size*0.65);
      ctx.restore();
    }
  }

  // ── Engranaje ────────────────────────────────────────────────────────────────
  const drawGear = (ctx, cx, cy, r, teeth, angle, alpha) => {
    if (alpha<=0.01) return;
    ctx.save(); ctx.globalAlpha=alpha; ctx.strokeStyle='#ffffff';
    ctx.lineWidth=1.5; ctx.shadowBlur=6; ctx.shadowColor='rgba(255,255,255,0.22)';
    const innerR=r*0.68, tw=0.19;
    ctx.beginPath();
    let first=true;
    for (let i=0; i<teeth; i++) {
      const a1=angle+(i/teeth)*Math.PI*2;
      const a2=angle+((i+0.5)/teeth)*Math.PI*2;
      const pts=[
        [cx+Math.cos(a1-tw)*innerR, cy+Math.sin(a1-tw)*innerR],
        [cx+Math.cos(a1-tw)*r,      cy+Math.sin(a1-tw)*r],
        [cx+Math.cos(a1+tw)*r,      cy+Math.sin(a1+tw)*r],
        [cx+Math.cos(a1+tw)*innerR, cy+Math.sin(a1+tw)*innerR],
        [cx+Math.cos(a2-tw)*innerR, cy+Math.sin(a2-tw)*innerR],
      ];
      pts.forEach(([px,py]) => { if(first){ctx.moveTo(px,py);first=false;}else ctx.lineTo(px,py); });
    }
    ctx.closePath(); ctx.stroke();
    ctx.beginPath(); ctx.arc(cx,cy,r*0.18,0,Math.PI*2); ctx.stroke();
    for (let i=0;i<4;i++) {
      const sa=angle+(i/4)*Math.PI*2;
      ctx.beginPath(); ctx.moveTo(cx+Math.cos(sa)*r*0.19,cy+Math.sin(sa)*r*0.19);
      ctx.lineTo(cx+Math.cos(sa)*innerR*0.86,cy+Math.sin(sa)*innerR*0.86); ctx.stroke();
    }
    ctx.shadowBlur=0; ctx.restore();
  };

  // ── Cinta transportadora ─────────────────────────────────────────────────────
  const drawConveyorBelt = (ctx, cx, topY, bW, bH, alpha, offset) => {
    if (alpha<=0.01) return;
    const x=cx-bW/2;
    ctx.save(); ctx.globalAlpha=alpha; ctx.strokeStyle='#ffffff'; ctx.lineWidth=2; ctx.lineCap='round';
    ctx.strokeRect(x,topY,bW,bH);
    // Rollers
    ctx.beginPath(); ctx.arc(x,    topY+bH/2,bH/2,0,Math.PI*2); ctx.stroke();
    ctx.beginPath(); ctx.arc(x+bW, topY+bH/2,bH/2,0,Math.PI*2); ctx.stroke();
    // Moving marks
    ctx.lineWidth=1.2; ctx.globalAlpha=alpha*0.5;
    const sp=60;
    for (let i=-1; i<bW/sp+2; i++) {
      const mx=x+(((i*sp)+offset)%bW+bW)%bW;
      ctx.beginPath(); ctx.moveTo(mx,topY+5); ctx.lineTo(mx,topY+bH-5); ctx.stroke();
    }
    ctx.restore();
  };


  // ── Cuerpo stick figure del héroe empujando ──────────────────────────────────
  // headX/headY = centro del círculo cabeza, headR = radio, blockLeftEdge = borde izq del bloque
  const drawHeroPushBody = (ctx, headX, headY, headR, blockLeftEdge, opacity) => {
    if (opacity<=0.01) return;
    const torsoTopY = headY + headR;
    const torsoBaseY = Math.min(BELT_TOP + 18, torsoTopY + 52);
    const hipX = headX + 16;
    const sX = headX + 7, sY = torsoTopY + 16;
    ctx.save();
    ctx.globalAlpha = opacity * 0.88;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3.8;
    ctx.lineCap = 'round';
    ctx.shadowBlur = 10;
    ctx.shadowColor = 'rgba(255,255,255,0.45)';
    // Torso (inclinado hacia el bloque)
    ctx.beginPath(); ctx.moveTo(headX+7, torsoTopY); ctx.lineTo(hipX, torsoBaseY); ctx.stroke();
    // Brazo superior (extendido hacia el bloque)
    ctx.beginPath(); ctx.moveTo(sX, sY); ctx.lineTo(blockLeftEdge+5, sY-16); ctx.stroke();
    // Brazo inferior
    ctx.beginPath(); ctx.moveTo(sX, sY+18); ctx.lineTo(blockLeftEdge+5, sY+2); ctx.stroke();
    // Pierna delantera (hacia el bloque)
    ctx.beginPath(); ctx.moveTo(hipX, torsoBaseY); ctx.lineTo(hipX+28, torsoBaseY+24); ctx.stroke();
    // Pierna trasera (atrás, empujando)
    ctx.beginPath(); ctx.moveTo(hipX, torsoBaseY); ctx.lineTo(hipX-16, torsoBaseY+20); ctx.stroke();
    ctx.shadowBlur=0; ctx.restore();
  };

  // ── Reloj de arena ───────────────────────────────────────────────────────────
  // Silueta clásica de 6 puntos: tapa plana arriba + lados que convergen al cuello + tapa plana abajo
  const drawHourglass = (ctx, cx, cy, size, alpha) => {
    if (alpha<=0.01) return;
    const w=size*0.44, h=size*0.54, nw=size*0.10;
    ctx.save();
    ctx.globalAlpha=alpha; ctx.strokeStyle='#ffffff';
    ctx.lineWidth=2.4; ctx.lineCap='round'; ctx.lineJoin='round';
    ctx.shadowBlur=12; ctx.shadowColor='rgba(255,255,255,0.45)';
    // Contorno cerrado: tapa superior → cuello → tapa inferior → cuello → cierra
    ctx.beginPath();
    ctx.moveTo(cx-w, cy-h);  ctx.lineTo(cx+w, cy-h);   // tapa superior (plana)
    ctx.lineTo(cx+nw, cy);                               // lado derecho → cuello
    ctx.lineTo(cx+w, cy+h);  ctx.lineTo(cx-w, cy+h);   // tapa inferior (plana)
    ctx.lineTo(cx-nw, cy);                               // lado izquierdo → cuello
    ctx.closePath();
    ctx.stroke();
    // Arena acumulada en la parte inferior (relleno sutil)
    ctx.globalAlpha=alpha*0.22; ctx.fillStyle='#ffffff';
    ctx.beginPath();
    ctx.moveTo(cx-nw, cy); ctx.lineTo(cx+nw, cy);
    ctx.lineTo(cx+w*0.68, cy+h*0.62); ctx.lineTo(cx-w*0.68, cy+h*0.62);
    ctx.closePath(); ctx.fill();
    // Gota cayendo por el cuello
    ctx.globalAlpha=alpha*0.72; ctx.fillStyle='#ffffff';
    ctx.beginPath(); ctx.arc(cx, cy+8, 2.8, 0, Math.PI*2); ctx.fill();
    ctx.shadowBlur=0; ctx.restore();
  };

  // ── Escritorio (artesano digital) ────────────────────────────────────────────
  const drawDesk = (ctx, cx, deskY, alpha, time=0) => {
    if (alpha<=0.01) return;
    ctx.save(); ctx.globalAlpha=alpha; ctx.strokeStyle='#ffffff'; ctx.lineWidth=2.5; ctx.lineCap='round';
    // Surface
    ctx.beginPath(); ctx.moveTo(cx-200,deskY); ctx.lineTo(cx+200,deskY); ctx.stroke();
    // Legs
    ctx.lineWidth=2;
    [[-160,55],[160,55]].forEach(([lx,lh]) => {
      ctx.beginPath(); ctx.moveTo(cx+lx,deskY); ctx.lineTo(cx+lx,deskY+lh); ctx.stroke();
    });
    // Laptop screen
    ctx.lineWidth=1.8; ctx.globalAlpha=alpha*0.85;
    ctx.beginPath();
    ctx.moveTo(cx-55,deskY); ctx.lineTo(cx-46,deskY-72); ctx.lineTo(cx+46,deskY-72); ctx.lineTo(cx+55,deskY);
    ctx.stroke();
    // Screen inner glow — pulsa mientras lee
    const screenPulse=0.10+Math.sin(time*0.8)*0.04;
    ctx.globalAlpha=alpha*screenPulse; ctx.fillStyle='#ffffff';
    ctx.fillRect(cx-43,deskY-69,86,60);
    // Texto scrolleando en pantalla (simula contenido siendo leído)
    ctx.save();
    ctx.beginPath(); ctx.rect(cx-43,deskY-69,86,60); ctx.clip(); // clipping a pantalla
    const lineWidths=[58,40,52,34,55,28,48,36];
    const scrollOff=(time*10)%11;
    for (let ln=0;ln<8;ln++) {
      const ly=deskY-65+(ln*9)-scrollOff;
      if (ly>deskY-68 && ly<deskY-13) {
        ctx.globalAlpha=alpha*(0.38+Math.sin(ln*1.7)*0.12);
        ctx.strokeStyle='#ffffff'; ctx.lineWidth=1.2; ctx.lineCap='round';
        ctx.beginPath(); ctx.moveTo(cx-38,ly); ctx.lineTo(cx-38+lineWidths[ln%8],ly); ctx.stroke();
      }
    }
    // Cursor parpadeante
    if (Math.floor(time*2)%2===0) {
      ctx.globalAlpha=alpha*0.72; ctx.fillStyle='#ffffff';
      ctx.fillRect(cx-10,deskY-18,5,8);
    }
    ctx.restore();
    // Coffee cup
    ctx.globalAlpha=alpha*0.88; ctx.lineWidth=1.8; ctx.strokeStyle='#ffffff';
    ctx.strokeRect(cx+92,deskY-30,22,30);
    // Cup handle
    ctx.beginPath(); ctx.arc(cx+118,deskY-15,9,Math.PI*0.28,Math.PI*1.72); ctx.stroke();
    // Steam wisps
    ctx.globalAlpha=alpha*0.38; ctx.lineWidth=1.2;
    [0,7,-6].forEach((sx,i) => {
      ctx.beginPath(); ctx.moveTo(cx+100+sx,deskY-32);
      ctx.quadraticCurveTo(cx+105+sx,deskY-44+i*3,cx+100+sx,deskY-54+i*3); ctx.stroke();
    });
    ctx.restore();
  };

  // ── Héroe ────────────────────────────────────────────────────────────────────
  const drawHero = (ctx, x, y, r, opacity, sx=1, sy=1, glow=40) => {
    ctx.save(); ctx.globalAlpha=opacity*0.22;
    const a1=ctx.createRadialGradient(x,y,r*0.8,x,y,r*5);
    a1.addColorStop(0,'rgba(255,255,255,0.5)'); a1.addColorStop(1,'rgba(255,255,255,0)');
    ctx.fillStyle=a1; ctx.beginPath(); ctx.arc(x,y,r*5,0,Math.PI*2); ctx.fill(); ctx.restore();

    ctx.save(); ctx.globalAlpha=opacity*0.55;
    const a2=ctx.createRadialGradient(x,y,r*0.6,x,y,r*1.8);
    a2.addColorStop(0,'rgba(255,255,255,0.7)'); a2.addColorStop(1,'rgba(255,255,255,0)');
    ctx.fillStyle=a2; ctx.beginPath(); ctx.arc(x,y,r*1.8,0,Math.PI*2); ctx.fill(); ctx.restore();

    ctx.save(); ctx.globalAlpha=opacity; ctx.shadowBlur=glow; ctx.shadowColor='rgba(255,255,255,0.9)'; ctx.fillStyle='#ffffff';
    ctx.beginPath(); ctx.ellipse(x,y,r*sx,r*sy,0,0,Math.PI*2); ctx.fill();
    ctx.shadowBlur=0; ctx.restore();
  };

  // ── Bloque pesado ────────────────────────────────────────────────────────────
  const drawBlock = (ctx, x, y, size, opacity) => {
    if (opacity<=0.01) return;
    ctx.save(); ctx.globalAlpha=opacity;
    ctx.fillStyle='rgba(255,255,255,0.05)'; ctx.fillRect(x-size/2,y-size/2,size,size);
    ctx.strokeStyle='#ffffff'; ctx.lineWidth=3; ctx.shadowBlur=14; ctx.shadowColor='rgba(255,255,255,0.35)';
    ctx.strokeRect(x-size/2,y-size/2,size,size); ctx.shadowBlur=0;
    ctx.globalAlpha=opacity*0.18; ctx.lineWidth=1.5;
    ctx.beginPath(); ctx.moveTo(x-size/2,y-size/2); ctx.lineTo(x+size/2,y+size/2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x+size/2,y-size/2); ctx.lineTo(x-size/2,y+size/2); ctx.stroke();
    ctx.restore();
  };

  // ── Nodo de red ──────────────────────────────────────────────────────────────
  const drawNetworkNode = (ctx, x, y, r, opacity) => {
    if (opacity<=0.01) return;
    ctx.save();
    ctx.globalAlpha=opacity*0.12;
    const g1=ctx.createRadialGradient(x,y,r*0.3,x,y,r*4.5);
    g1.addColorStop(0,'rgba(255,255,255,0.9)'); g1.addColorStop(1,'rgba(255,255,255,0)');
    ctx.fillStyle=g1; ctx.beginPath(); ctx.arc(x,y,r*4.5,0,Math.PI*2); ctx.fill();
    ctx.globalAlpha=opacity; ctx.shadowBlur=18; ctx.shadowColor='rgba(255,255,255,0.8)'; ctx.fillStyle='#ffffff';
    ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill();
    ctx.shadowBlur=0; ctx.restore();
  };

  // ── Campo estelar (escena final, tipo dan-koe/23.png) ────────────────────────
  const drawStarfield = (ctx, W, H, time, alpha) => {
    if (alpha<=0.01) return;
    ctx.save();
    // 280 estrellas pequeñas con parpadeo individual
    for (let i=0;i<280;i++) {
      const sx=((i*7919+1234)%10000)/10000*W;
      const sy=((i*6271+5678)%10000)/10000*H;
      const sBase=((i*3491+2345)%10000)/10000;
      const sSize=0.5+sBase*3.2;
      const freq=0.6+((i*2311)%10000)/10000*2.1;
      const phase=((i*4127)%10000)/10000*Math.PI*2;
      const twinkle=0.30+Math.sin(time*freq+phase)*0.70;
      const sOp=Math.max(0,twinkle*(sBase*0.55+0.14))*alpha;
      if(sOp<0.01) continue;
      ctx.globalAlpha=sOp; ctx.fillStyle='#ffffff';
      ctx.beginPath(); ctx.arc(sx,sy,sSize,0,Math.PI*2); ctx.fill();
    }
    // 3 orbes grandes con halo difuso (como dan-koe/23.png)
    const orbs=[
      {x:W*0.17,y:H*0.21,r:7,gR:75},
      {x:W*0.80,y:H*0.52,r:5,gR:52},
      {x:W*0.44,y:H*0.11,r:6,gR:62},
    ];
    orbs.forEach((orb,i)=>{
      const pulse=0.68+Math.sin(time*0.5+i*2.1)*0.32;
      const g=ctx.createRadialGradient(orb.x,orb.y,0,orb.x,orb.y,orb.gR);
      g.addColorStop(0,`rgba(255,255,255,${(0.88*pulse*alpha).toFixed(3)})`);
      g.addColorStop(0.18,`rgba(255,255,255,${(0.32*pulse*alpha).toFixed(3)})`);
      g.addColorStop(0.48,`rgba(255,255,255,${(0.07*pulse*alpha).toFixed(3)})`);
      g.addColorStop(1,'rgba(255,255,255,0)');
      ctx.globalAlpha=1; ctx.fillStyle=g;
      ctx.beginPath(); ctx.arc(orb.x,orb.y,orb.gR,0,Math.PI*2); ctx.fill();
      ctx.globalAlpha=alpha*pulse; ctx.fillStyle='#ffffff';
      ctx.shadowBlur=22; ctx.shadowColor='rgba(255,255,255,0.9)';
      ctx.beginPath(); ctx.arc(orb.x,orb.y,orb.r,0,Math.PI*2); ctx.fill();
      ctx.shadowBlur=0;
    });
    ctx.restore();
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

  // ── Firma (Dan Koe Card) ─────────────────────────────────────────────────────
  const drawSignatureCard = (ctx, W, H, CX, CY, cardOpacity, cardOffsetY, lightX, lightY, breathe, scene) => {
    const cardWidth=800, cardHeight=1500, cardX=CX-cardWidth/2, cardY=CY-cardHeight/2;

    ctx.save(); ctx.globalAlpha=cardOpacity*breathe;
    const bg=ctx.createRadialGradient(lightX,lightY,cardWidth*0.15,lightX,lightY,cardWidth*1.3);
    bg.addColorStop(0,'rgba(220,216,208,1)'); bg.addColorStop(0.15,'rgba(190,186,178,0.85)');
    bg.addColorStop(0.3,'rgba(155,151,144,0.6)'); bg.addColorStop(0.5,'rgba(110,107,102,0.3)');
    bg.addColorStop(0.7,'rgba(65,63,58,0.1)'); bg.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=bg; ctx.fillRect(0,0,W,H); ctx.restore();

    ctx.save(); ctx.globalAlpha=cardOpacity*breathe*0.75;
    const bl=ctx.createRadialGradient(lightX-180,lightY-80,0,lightX-180,lightY-80,cardHeight*0.6);
    bl.addColorStop(0,'rgba(230,226,218,0.95)'); bl.addColorStop(0.2,'rgba(180,176,168,0.6)');
    bl.addColorStop(0.5,'rgba(90,87,82,0.12)'); bl.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=bl; ctx.fillRect(0,0,W,H); ctx.restore();

    ctx.save(); ctx.globalAlpha=cardOpacity; ctx.translate(0,cardOffsetY);
    ctx.fillStyle='#090909'; ctx.fillRect(cardX,cardY,cardWidth,cardHeight);
    const le=ctx.createLinearGradient(cardX-1,0,cardX+4,0);
    le.addColorStop(0,'rgba(220,216,208,0.6)'); le.addColorStop(0.5,'rgba(180,176,168,0.25)'); le.addColorStop(1,'rgba(180,176,168,0)');
    ctx.fillStyle=le; ctx.fillRect(cardX-1,cardY,5,cardHeight);
    const te=ctx.createLinearGradient(0,cardY-1,0,cardY+3);
    te.addColorStop(0,'rgba(200,196,188,0.4)'); te.addColorStop(1,'rgba(160,156,148,0)');
    ctx.fillStyle=te; ctx.fillRect(cardX,cardY-1,cardWidth*0.6,4);

    ctx.globalAlpha=cardOpacity;
    ctx.font='bold 50px Montserrat,sans-serif'; ctx.fillStyle='#ffffff';
    ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.fillText('CREA TU',CX,CY-450);
    ctx.font='900 88px Montserrat,sans-serif'; ctx.fillText('ACTIVO',CX,CY-350);
    drawDiamond3D(ctx,CX,CY-80,180,scene,cardOpacity);
    ctx.globalAlpha=cardOpacity;
    ctx.font='600 20px Montserrat,sans-serif'; ctx.fillStyle='rgba(255,255,255,0.85)';
    ctx.fillText('EL APALANCAMIENTO',CX,CY+280);
    ctx.font='900 64px Montserrat,sans-serif'; ctx.fillStyle='#ffffff';
    ctx.fillText('LUIS CABREJO',CX,CY+360);
    ctx.restore();
  };

  // ── Loop principal ───────────────────────────────────────────────────────────
  const update = () => {
    const canvas=canvasRef.current; if(!canvas)return;
    const ctx=canvas.getContext('2d'); if(!ctx)return;
    const W=canvas.width, H=canvas.height, CX=W/2;

    const now=performance.now();
    if(startTimeRef.current===null) startTimeRef.current=now;
    const elapsed=(now-startTimeRef.current)/1000;
    const time=Math.min(elapsed,DURATION);
    const fc=Math.floor(time*FPS);
    setProgress((time/DURATION)*100);

    // ── Inicialización de escena ────────────────────────────────────────────
    if (!sceneRef.current) {
      const gearConfigs=[
        // Zona cercana al héroe/bloque — entran primero (presión inmediata)
        {cx:360,cy:840,r:56,teeth:11,speed:0.013, entryTime:3.40,fromDir:'top'},
        {cx:730,cy:830,r:44,teeth:9, speed:-0.018,entryTime:3.68,fromDir:'top'},
        {cx:540,cy:740,r:40,teeth:8, speed:0.022, entryTime:4.80,fromDir:'top'},
        // Flancos medios
        {cx:130,cy:630,r:55,teeth:11,speed:-0.013,entryTime:5.08,fromDir:'left'},
        {cx:965,cy:650,r:48,teeth:10,speed:0.015, entryTime:5.36,fromDir:'right'},
        {cx:270,cy:500,r:38,teeth:8, speed:0.021, entryTime:5.64,fromDir:'left'},
        {cx:810,cy:515,r:46,teeth:9, speed:-0.016,entryTime:5.92,fromDir:'right'},
        // Campo superior
        {cx:75,cy:340,r:62,teeth:12,speed:-0.011,entryTime:6.20,fromDir:'left'},
        {cx:990,cy:370,r:50,teeth:10,speed:0.013, entryTime:6.48,fromDir:'right'},
        {cx:420,cy:310,r:34,teeth:7, speed:0.025, entryTime:6.76,fromDir:'top'},
        {cx:680,cy:290,r:40,teeth:8, speed:-0.020,entryTime:7.04,fromDir:'top'},
        // Densidad extra — base del encuadre
        {cx:175,cy:890,r:32,teeth:7, speed:0.027, entryTime:3.96,fromDir:'top'},
        {cx:910,cy:910,r:36,teeth:8, speed:-0.019,entryTime:4.24,fromDir:'top'},
        {cx:540,cy:970,r:28,teeth:6, speed:0.030, entryTime:4.52,fromDir:'top'},
      ];
      const gears=gearConfigs.map(g=>({...g,angle:Math.random()*Math.PI*2}));

      const nodeTargets=[
        {tx:CX,     ty:175},{tx:CX-230,ty:255},{tx:CX+230,ty:255},
        {tx:CX-420,ty:315},{tx:CX+420,ty:315},{tx:CX-120,ty:360},
        {tx:CX+120,ty:360},{tx:CX-330,ty:450},{tx:CX+330,ty:450},
        {tx:CX,     ty:415},{tx:CX-470,ty:535},{tx:CX+470,ty:535},
        {tx:CX-195,ty:565},{tx:CX+195,ty:565},{tx:CX-55, ty:645},
        {tx:CX+55, ty:645},
      ];
      const networkNodes=nodeTargets.map(p=>({x:CX,y:400,tx:p.tx,ty:p.ty,r:7+Math.random()*8,opacity:0}));

      const diamond={angleX:0,angleY:0,vertices:[],edges:[]};
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

      const floatingParticles=[];
      for(let i=0;i<60;i++) floatingParticles.push(new FloatingParticle(W,H));

      sceneRef.current={
        floatingParticles, explosionParticles:[], gears, networkNodes,
        nodesActivated:false, blockLaunchCaptured:false, blockLaunchX:0, blockLaunchY:0,
        gearsOpacity:1, orbitAngle:0, rainDrops:[], diamond,
        blockLanded:false, blockLandTime:-1,
      };
    }

    const scene=sceneRef.current;
    const breathe=1+Math.sin(fc*0.04)*0.04;

    // Fondo
    ctx.fillStyle='#050505'; ctx.fillRect(0,0,W,H);
    const bgOp=time<T1?0.022:time<T2?0.010:time<T3?0.018:0.026;
    drawBackgroundGrid(ctx,W,H,time,bgOp);
    scene.floatingParticles.forEach(p=>{p.update(W,H);p.draw(ctx);});
    scene.explosionParticles=scene.explosionParticles.filter(p=>p.life>0);
    scene.explosionParticles.forEach(p=>{p.update();p.draw(ctx);});
    scene.gears.forEach(g=>{g.angle+=g.speed;});

    // ================================================================
    // ACTO 1 (0–12s): LA TRAMPA MECÁNICA — 7 beats progresivos
    // ================================================================
    if (time < T1) {
      const t1=time/T1;
      const BEAT_BELT=1.8, BEAT_BLOCK=2.6, BEAT_HOG=7.5, BEAT_COW=8.5;
      const fadeIn=Easing.easeOutCubic(Math.min(1,time/0.9));

      // Shake de impacto — envuelve todos los draws (excepto el flash final)
      const shaking=scene.blockLanded&&(time-scene.blockLandTime)<0.38;
      if (shaking) {
        const st=time-scene.blockLandTime;
        const sa=Math.max(0,1-st/0.38)*9;
        ctx.save(); ctx.translate(Math.sin(st*250)*sa, Math.cos(st*200)*sa);
      }

      // ── BEAT 1-2: Cinta quieta → arranca gradualmente ───────────────
      const getBeltOff=(t)=>{
        if(t<BEAT_BELT) return 0;
        const rd=t-BEAT_BELT;
        return rd<0.8 ? 55*rd*rd : 55*0.64+88*(rd-0.8);
      };
      const beltOffset=((-getBeltOff(time))%BELT_W+BELT_W)%BELT_W;
      drawConveyorBelt(ctx,CX,BELT_TOP,BELT_W,BELT_H,fadeIn*0.82,beltOffset);

      // ── BEAT 3: Bloque cae desde arriba con rebote ──────────────────
      const blockFX=CX+60+t1*75, blockFY=BELT_TOP-BLOCK_SZ/2;
      if (time>=BEAT_BLOCK) {
        const bep=Math.min(1,(time-BEAT_BLOCK)/0.55);
        if (bep>=0.98&&!scene.blockLanded) { scene.blockLanded=true; scene.blockLandTime=time; }
        const blockCY=-BLOCK_SZ+(blockFY+BLOCK_SZ)*Easing.easeOutBounce(bep);
        drawBlock(ctx,blockFX,blockCY,BLOCK_SZ,Math.min(1,bep*2.5));
        // Flechas de peso (aparecen gradualmente después del impacto)
        if (scene.blockLanded&&time-scene.blockLandTime>0.28) {
          const wA=Math.min(1,(time-scene.blockLandTime-0.28)/0.35)*0.20;
          for (let i=-2;i<=2;i++) {
            const wx=blockFX+i*28,wy=blockFY+BLOCK_SZ/2+2,wl=16+Math.abs(i)*3;
            ctx.save(); ctx.globalAlpha=wA; ctx.strokeStyle='#ffffff'; ctx.lineWidth=1.2; ctx.lineCap='round';
            ctx.beginPath(); ctx.moveTo(wx,wy); ctx.lineTo(wx,wy+wl);
            ctx.lineTo(wx-4,wy+wl-5); ctx.moveTo(wx,wy+wl); ctx.lineTo(wx+4,wy+wl-5);
            ctx.stroke(); ctx.restore();
          }
        }
      }

      // ── BEAT 4: Engranajes entran 1 a 1 (cada 0.28s) ───────────────
      scene.gears.forEach(g=>{
        if (time<g.entryTime) return;
        const gep=Math.min(1,(time-g.entryTime)/0.45);
        const gA=Easing.easeOutCubic(gep)*0.68*fadeIn;
        let gx=g.cx, gy=g.cy;
        if (g.fromDir==='top')        gy=-(g.r+20)+(g.cy+g.r+20)*Easing.easeOutBounce(gep);
        else if (g.fromDir==='left')  gx=-(g.r+20)+(g.cx+g.r+20)*Easing.easeOutCubic(gep);
        else                          gx=W+g.r+20-(W+g.r+20-g.cx)*Easing.easeOutCubic(gep);
        drawGear(ctx,gx,gy,g.r,g.teeth,g.angle,gA);
      });

      // ── BEAT 5: Reloj de arena desliza desde la derecha ─────────────
      const hgFX=blockFX+155, hgFY=BELT_TOP-88;
      if (time>=BEAT_HOG) {
        const hgP=Math.min(1,(time-BEAT_HOG)/0.50);
        const hgA=Easing.easeOutCubic(hgP)*0.72;
        const hgX=W+100-(W+100-hgFX)*Easing.easeOutBack(hgP);
        drawHourglass(ctx,hgX,hgFY,42,hgA);
        if (hgP>=1.0) {
          const coinC=(time*1.55)%1;
          if (coinC>=0.50&&coinC<0.88) {
            const ct=(coinC-0.50)/0.38;
            ctx.save(); ctx.globalAlpha=Math.sin(ct*Math.PI)*0.92*hgA; ctx.fillStyle='#ffffff';
            ctx.shadowBlur=8; ctx.shadowColor='rgba(255,255,255,0.8)';
            ctx.beginPath(); ctx.arc(hgFX,hgFY+18+ct*90,5,0,Math.PI*2); ctx.fill();
            ctx.shadowBlur=0; ctx.restore();
          }
        }
      }

      // ── BEAT 6: Vaca SVG entra caminando desde la izquierda ─────────
      if (time>=BEAT_COW && cowImgRef.current) {
        const cowFP   = Math.min(1,(time-BEAT_COW)/0.7);
        const cowA    = Easing.easeOutCubic(cowFP)*0.88;
        const cowCX   = -100+(time-BEAT_COW)*80;
        const cowBob  = Math.sin(time*4.8)*3.5;              // bob vertical de paso
        const cowSway = Math.sin(time*4.8+1.2)*0.038;        // ±2.2° balanceo corporal
        const pivotX  = cowCX;                               // centro horizontal
        const pivotY  = BELT_TOP - 10;                       // nivel de patas (pivot)
        ctx.save();
        ctx.globalAlpha=cowA;
        ctx.globalCompositeOperation='screen';
        ctx.translate(pivotX, pivotY);
        ctx.rotate(cowSway);
        ctx.translate(-pivotX, -pivotY);
        ctx.drawImage(cowImgRef.current, cowCX-120, BELT_TOP-140+cowBob, 240, 150);
        ctx.restore();
      }

      // ── BEAT 7: Héroe — entrada rápida desde izquierda, luego empuja ──────────
      const HERO_ENTRY=0.6, HERO_DUR=0.62;
      const heroGlow=44-t1*34;
      const pushActive=scene.blockLanded;
      const pushCycle=pushActive?((time-scene.blockLandTime)*1.55)%1:0;
      const heroY=BELT_TOP-36;
      const heroX=blockFX-235+(pushActive?Math.sin(pushCycle*Math.PI*2)*5:0);
      const hSX=pushActive?1+Math.sin(pushCycle*Math.PI)*0.22:1;
      const hSY=pushActive?1-Math.sin(pushCycle*Math.PI)*0.14:1;
      // Cálculo de entrada: desliza desde x=-80 con easeOutBack
      let hDrawX=heroX, hDrawA=0;
      if (time>=HERO_ENTRY+HERO_DUR)      { hDrawA=fadeIn; }
      else if (time>=HERO_ENTRY) {
        const ep=Easing.easeOutBack(Math.min(1,(time-HERO_ENTRY)/HERO_DUR));
        hDrawX=-80+(heroX+80)*ep;
        hDrawA=Math.min(1,ep*1.6)*fadeIn;
      }
      if (hDrawA>0.01) {
        if (pushActive) {
          const effortA=(0.18+Math.sin(pushCycle*Math.PI)*0.5)*hDrawA;
          for (let j=0;j<7;j++) {
            const angle=-Math.PI*0.28+(Math.PI*0.56*j/6);
            const ll=20+j*5+Math.sin(pushCycle*Math.PI*2+j)*7;
            ctx.save(); ctx.globalAlpha=effortA*0.72; ctx.strokeStyle='#ffffff'; ctx.lineWidth=1.4; ctx.lineCap='round';
            ctx.beginPath(); ctx.moveTo(hDrawX+34,heroY); ctx.lineTo(hDrawX+34+Math.cos(angle)*ll,heroY+Math.sin(angle)*ll); ctx.stroke(); ctx.restore();
          }
          if (t1>0.30) {
            for (let s=0;s<2;s++) {
              const swt=((time*1.4+s*0.5)%1);
              if(swt<0.55){ctx.save();ctx.globalAlpha=(1-swt/0.55)*0.38*hDrawA;ctx.fillStyle='#ffffff';ctx.beginPath();ctx.arc(hDrawX-14+s*30,heroY-40-swt*48,3,0,Math.PI*2);ctx.fill();ctx.restore();}
            }
          }
        }
        drawHero(ctx,hDrawX,heroY,36*breathe,hDrawA,hSX,hSY,Math.max(8,heroGlow));
      }

      if (shaking) ctx.restore();

      // Flash de impacto (full-screen, fuera del shake)
      if (scene.blockLanded) {
        const ft=time-scene.blockLandTime;
        if (ft<0.18) {
          ctx.save(); ctx.globalAlpha=Math.max(0,1-ft/0.18)*0.32;
          ctx.fillStyle='#ffffff'; ctx.fillRect(0,0,W,H); ctx.restore();
        }
      }

      // ── Fundido a negro al final del Acto 1 (cierre de capítulo) ────────────
      if (time > 10.0) {
        const fp=Easing.easeInQuad(Math.min(1,(time-10.0)/2.0));
        ctx.save(); ctx.globalAlpha=fp*0.92; ctx.fillStyle='#050505'; ctx.fillRect(0,0,W,H); ctx.restore();
      }

      setStatus('Acto 1: La Trampa Mecánica');
    }

    // ================================================================
    // ACTO 2 (12–22s): LA EPIFANÍA
    // ================================================================
    else if (time < T2) {
      const t2=(time-T1)/(T2-T1);
      // Fade-in desde negro (primer 1.2s de Act 2 — emerge de la oscuridad)
      const act2In=Easing.easeOutCubic(Math.min(1,t2/0.12));

      // Engranajes se desvanecen rápidamente
      const gearFade=Math.max(0,1-Easing.easeOutQuad(Math.min(1,t2/0.22)));
      scene.gears.forEach(g=>{
        if(gearFade>0.01) drawGear(ctx,g.cx,g.cy,g.r,g.teeth,g.angle,gearFade*0.68*act2In);
      });

      // Hero se separa del bloque y se mueve al centro, recupera glow
      const sepP=Easing.easeOutCubic(Math.min(1,Math.max(0,(t2-0.04)/0.28)));
      const heroHX=(CX-90)+(CX-(CX-90))*sepP;
      const heroHY=(BELT_TOP-36)-(sepP*130); // sube suavemente
      const heroGlowR=10+Easing.easeOutCubic(Math.min(1,(t2-0.06)/0.32))*52;

      // Pulso de expansión al recuperar el brillo
      const pulseR=1+Math.max(0,Math.sin(Math.min(1,(t2-0.08)/0.24)*Math.PI)*0.28);

      // Flash de separación
      if (t2>=0.04 && t2<0.18) {
        const fP=(t2-0.04)/0.14;
        ctx.save(); ctx.globalAlpha=Math.max(0,Math.sin(fP*Math.PI)*0.26); ctx.fillStyle='#ffffff'; ctx.fillRect(0,0,W,H); ctx.restore();
      }

      drawHero(ctx,heroHX,heroHY,36*breathe*pulseR,act2In,1,1,Math.max(10,heroGlowR));

      // Rayo de luz hacia el fulcro
      const RAY_S=0.28;
      if (t2>=RAY_S) {
        const rayP=Easing.easeOutCubic(Math.min(1,(t2-RAY_S)/0.22));
        const destX=PVT_X, destY=PVT_Y;
        const rayEX=heroHX+(destX-heroHX)*rayP;
        const rayEY=heroHY+(destY-heroHY)*rayP;
        const rayOpacity=0.60*(1-Math.max(0,(rayP-0.75)/0.25));
        ctx.save(); ctx.globalAlpha=rayOpacity;
        ctx.strokeStyle='#ffffff'; ctx.lineWidth=2; ctx.shadowBlur=14; ctx.shadowColor='rgba(255,255,255,0.7)';
        ctx.setLineDash([9,7]);
        ctx.beginPath(); ctx.moveTo(heroHX,heroHY); ctx.lineTo(rayEX,rayEY); ctx.stroke();
        ctx.setLineDash([]); ctx.shadowBlur=0; ctx.restore();
      }

      // Fulcro aparece cuando el rayo llega
      const FULCRUM_S=0.48;
      if (t2>=FULCRUM_S) {
        const fP=Easing.easeOutCubic(Math.min(1,(t2-FULCRUM_S)/0.26));
        const FS=130, FULCRUM_H=100;
        const tX=PVT_X, tY=PVT_Y, blX=PVT_X-FS/2, blY=PVT_Y+FULCRUM_H, brX=PVT_X+FS/2, brY=PVT_Y+FULCRUM_H;
        ctx.save(); ctx.strokeStyle='#ffffff'; ctx.lineWidth=3; ctx.lineCap='round';
        ctx.shadowBlur=18; ctx.shadowColor='rgba(255,255,255,0.45)';
        ctx.beginPath(); ctx.moveTo(tX,tY);
        if(fP<0.33){const t=fP/0.33; ctx.lineTo(tX+(blX-tX)*t,tY+(blY-tY)*t);}
        else if(fP<0.66){ctx.lineTo(blX,blY); const t=(fP-0.33)/0.33; ctx.lineTo(blX+(brX-blX)*t,blY);}
        else{ctx.lineTo(blX,blY); ctx.lineTo(brX,brY); const t=(fP-0.66)/0.34; ctx.lineTo(brX+(tX-brX)*t,brY+(tY-brY)*t);}
        ctx.stroke();
        if(fP>0.58){
          ctx.globalAlpha=Math.min(1,(fP-0.58)/0.28); ctx.lineWidth=4;
          ctx.beginPath(); ctx.moveTo(PVT_X-220,PVT_Y+FULCRUM_H+4); ctx.lineTo(PVT_X+220,PVT_Y+FULCRUM_H+4); ctx.stroke();
        }
        ctx.shadowBlur=0; ctx.restore();
      }

      // Palanca se extiende
      const LEVER_S=0.68;
      if (t2>=LEVER_S) {
        const lP=Easing.easeOutCubic(Math.min(1,(t2-LEVER_S)/0.28));
        ctx.save(); ctx.strokeStyle='#ffffff'; ctx.lineWidth=5; ctx.lineCap='round';
        ctx.shadowBlur=22; ctx.shadowColor='rgba(255,255,255,0.55)';
        ctx.beginPath(); ctx.moveTo(PVT_X-LEV_L*lP,PVT_Y); ctx.lineTo(PVT_X+LEV_R*lP,PVT_Y); ctx.stroke();
        if(lP>0.5){
          ctx.shadowBlur=30; ctx.fillStyle='#ffffff';
          ctx.beginPath(); ctx.arc(PVT_X,PVT_Y,9,0,Math.PI*2); ctx.fill();
        }
        ctx.shadowBlur=0; ctx.restore();
        // Bloque extremo derecho
        if(lP>0.74){
          const bA=Easing.easeOutCubic(Math.min(1,(lP-0.74)/0.26));
          drawBlock(ctx,PVT_X+LEV_R*lP-20,PVT_Y-BLOCK_SZ/2-4,BLOCK_SZ,bA);
        }
        // Héroe al extremo izquierdo (preview de posición)
        if(lP>0.82){
          const hA=Easing.easeOutBack(Math.min(1,(lP-0.82)/0.18));
          drawHero(ctx,PVT_X-LEV_L*lP+25,PVT_Y-36,30*breathe,hA,1,1,24);
        }
      }

      setStatus('Acto 2: La Epifanía');
    }

    // ================================================================
    // ACTO 3 (22–28s): EL ESTALLIDO DEL ECOSISTEMA
    // ================================================================
    else if (time < T3) {
      const t3=(time-T2)/(T3-T2);
      const FS=130, FULCRUM_H=100;

      // Fulcro estático
      ctx.save(); ctx.strokeStyle='#ffffff'; ctx.lineWidth=3; ctx.lineCap='round';
      ctx.shadowBlur=14; ctx.shadowColor='rgba(255,255,255,0.38)';
      ctx.beginPath(); ctx.moveTo(PVT_X,PVT_Y); ctx.lineTo(PVT_X-FS/2,PVT_Y+FULCRUM_H); ctx.lineTo(PVT_X+FS/2,PVT_Y+FULCRUM_H); ctx.closePath(); ctx.stroke();
      ctx.lineWidth=4; ctx.beginPath(); ctx.moveTo(PVT_X-225,PVT_Y+FULCRUM_H+4); ctx.lineTo(PVT_X+225,PVT_Y+FULCRUM_H+4); ctx.stroke();
      ctx.shadowBlur=0; ctx.restore();

      // Timing del acto 3
      const JUMP_DUR=0.18, TILT_DONE=0.40, BLOCK_LAUNCH=0.45, NODES_FORM=0.58;
      const tiltP=t3>=0.01?Easing.easeOutQuad(Math.min(1,(t3-0.01)/(TILT_DONE-0.01))):0;
      const leverAngle=MAX_TILT*tiltP;

      // Barra de palanca (rotando)
      ctx.save(); ctx.translate(PVT_X,PVT_Y); ctx.rotate(leverAngle);
      ctx.strokeStyle='#ffffff'; ctx.lineWidth=5; ctx.lineCap='round';
      ctx.shadowBlur=22; ctx.shadowColor='rgba(255,255,255,0.6)';
      ctx.beginPath(); ctx.moveTo(-LEV_L,0); ctx.lineTo(LEV_R,0); ctx.stroke();
      ctx.shadowBlur=30; ctx.fillStyle='#ffffff';
      ctx.beginPath(); ctx.arc(0,0,9,0,Math.PI*2); ctx.fill();
      ctx.shadowBlur=0; ctx.restore();

      const rightEndX=PVT_X+LEV_R*Math.cos(leverAngle);
      const rightEndY=PVT_Y+LEV_R*Math.sin(leverAngle);

      // Bloque: vibra y desaparece al lanzamiento
      if (t3<BLOCK_LAUNCH) {
        const vibrate=t3>0.26?Math.sin(t3*85)*((t3-0.26)/(BLOCK_LAUNCH-0.26))*14:0;
        drawBlock(ctx,rightEndX+vibrate,rightEndY-BLOCK_SZ/2-4,BLOCK_SZ,1);
      }

      // Capturar posición de lanzamiento + explosión
      if (t3>=BLOCK_LAUNCH && !scene.blockLaunchCaptured) {
        scene.blockLaunchCaptured=true;
        scene.blockLaunchX=rightEndX;
        scene.blockLaunchY=rightEndY-BLOCK_SZ/2-4;
        for(let i=0;i<150;i++){
          const a=(Math.PI*2*i/150)+(Math.random()-0.5)*0.18;
          scene.explosionParticles.push(new ExplosionParticle(scene.blockLaunchX,scene.blockLaunchY,a,6+Math.random()*22,2+Math.random()*7));
        }
      }

      // Héroe: arco parabólico → aterriza en palanca
      const leftArmX=PVT_X+(-LEV_L*0.80)*Math.cos(leverAngle);
      const leftArmY=PVT_Y+(-LEV_L*0.80)*Math.sin(leverAngle)-36;
      if (t3<JUMP_DUR) {
        const jP=t3/JUMP_DUR;
        const sX=PVT_X-LEV_L*0.80, sY=PVT_Y-240; // starts above
        const lX=leftArmX, lY=PVT_Y-36; // flat lever target
        const heroJX=sX+(lX-sX)*Easing.easeInOutSine(jP);
        const heroJY=sY+(lY-sY)*jP - Math.sin(jP*Math.PI)*110;
        drawHero(ctx,heroJX,heroJY,36*breathe,1,1,1,34);
        // Ghost trail
        [0.14,0.07].forEach((gOp,gi)=>{
          const gP=Math.max(0,jP-0.10*(gi+1));
          if(gP>0){
            const gX=sX+(lX-sX)*Easing.easeInOutSine(gP);
            const gY=sY+(lY-sY)*gP-Math.sin(gP*Math.PI)*110;
            drawHero(ctx,gX,gY,36,gOp,1,1,0);
          }
        });
      } else {
        const heroGrow=36+Math.min(1,(t3-JUMP_DUR)/0.38)*15;
        drawHero(ctx,leftArmX,leftArmY,heroGrow*breathe,1,1,1,36+t3*50);
      }

      // Bloque volando hacia arriba
      if (scene.blockLaunchCaptured) {
        const launchT=time-(T2+(T3-T2)*BLOCK_LAUNCH);
        if (launchT>0) {
          const bflyY=scene.blockLaunchY-launchT*200*(1+launchT*2.6);
          const bflyX=scene.blockLaunchX+Math.sin(launchT*4)*10;
          if (!scene.nodesActivated && bflyY<460) {
            scene.nodesActivated=true;
            scene.networkNodes.forEach((nd,i)=>{
              const scA=(Math.PI*2*i/scene.networkNodes.length)+(Math.random()-0.5)*0.55;
              const scD=30+Math.random()*55;
              nd.x=bflyX+Math.cos(scA)*scD; nd.y=bflyY+Math.sin(scA)*scD;
            });
          }
          if (!scene.nodesActivated) drawBlock(ctx,bflyX,bflyY,BLOCK_SZ,1);
        }
      }

      // Nodos de red formándose
      if (scene.nodesActivated) {
        const nP=Easing.easeOutCubic(Math.min(1,(t3-NODES_FORM+0.02)/0.35));
        scene.networkNodes.forEach((nd,i)=>{
          nd.x+=(nd.tx-nd.x)*0.045; nd.y+=(nd.ty-nd.y)*0.045;
          nd.opacity=Math.min(1,nd.opacity+0.022);
          // Pulso de aparición: nodo crece al llegar a su posición objetivo
          const bloom=1+Math.max(0,1-nd.opacity*1.5)*0.8;
          drawNetworkNode(ctx,nd.x,nd.y,nd.r*bloom*(1+Math.sin(time*2.2+i)*0.07),nd.opacity*nP);
        });
        if (t3>=NODES_FORM) {
          const lt=Math.min(1,(t3-NODES_FORM)/0.32);
          scene.networkNodes.forEach((n1,i)=>scene.networkNodes.forEach((n2,j)=>{
            if(j<=i)return;
            const dx=n2.x-n1.x, dy=n2.y-n1.y, dist=Math.sqrt(dx*dx+dy*dy);
            if(dist<420){
              ctx.save(); ctx.globalAlpha=(1-dist/420)*lt*0.55*Math.min(1,n1.opacity)*Math.min(1,n2.opacity);
              ctx.strokeStyle='#ffffff'; ctx.lineWidth=1.1;
              ctx.beginPath(); ctx.moveTo(n1.x,n1.y); ctx.lineTo(n2.x,n2.y); ctx.stroke(); ctx.restore();
            }
          }));
        }
      }

      setStatus('Acto 3: El Estallido');
    }

    // ================================================================
    // ACTO 4 (28–35s): LA COSECHA DEL ACTIVO
    // ================================================================
    else if (time < T4) {
      const t4=(time-T3)/(T4-T3);
      const fadeIn=Easing.easeOutCubic(Math.min(1,t4/0.14));

      // Mantener la formación espectacular del Acto 3 — nodos en posiciones target
      // Solo drift sinusoidal suave alrededor de tx/ty (no órbita circular)
      scene.networkNodes.forEach((nd,i)=>{
        nd.opacity=Math.min(1,nd.opacity+0.025);
        const driftX=Math.sin(time*0.30+i*1.15)*9;
        const driftY=Math.cos(time*0.25+i*0.90)*6;
        nd.x=nd.tx+driftX; nd.y=nd.ty+driftY;
        drawNetworkNode(ctx,nd.x,nd.y,nd.r*(1+Math.sin(time*2.1+i)*0.08),nd.opacity*fadeIn);
      });

      // Líneas de conexión — misma densidad espectacular que Act 3
      scene.networkNodes.forEach((n1,i)=>scene.networkNodes.forEach((n2,j)=>{
        if(j<=i)return;
        const dx=n2.x-n1.x, dy=n2.y-n1.y, dist=Math.sqrt(dx*dx+dy*dy);
        if(dist<420){
          ctx.save(); ctx.globalAlpha=(1-dist/420)*0.52*fadeIn*Math.min(1,n1.opacity)*Math.min(1,n2.opacity);
          ctx.strokeStyle='#ffffff'; ctx.lineWidth=1.1;
          ctx.beginPath(); ctx.moveTo(n1.x,n1.y); ctx.lineTo(n2.x,n2.y); ctx.stroke(); ctx.restore();
        }
      }));

      // Lluvia de partículas desde los nodos de la red hacia abajo
      if (t4>0.06 && Math.random()<0.32) {
        const src=scene.networkNodes[Math.floor(Math.random()*scene.networkNodes.length)];
        scene.rainDrops.push({x:src.x,y:src.y,vy:2.4+Math.random()*3.5,opacity:0.78+Math.random()*0.22,size:2+Math.random()*3});
      }
      scene.rainDrops.forEach(d=>{d.y+=d.vy; d.opacity-=0.007;});
      scene.rainDrops=scene.rainDrops.filter(d=>d.opacity>0.01&&d.y<H+20);
      scene.rainDrops.forEach(d=>{
        ctx.save(); ctx.globalAlpha=d.opacity*fadeIn; ctx.fillStyle='#ffffff';
        ctx.beginPath(); ctx.arc(d.x,d.y,d.size,0,Math.PI*2); ctx.fill(); ctx.restore();
      });

      // Héroe y escritorio — LEYENDO
      const DESK_Y=1440;
      drawDesk(ctx,CX,DESK_Y,fadeIn,time);    // pantalla animada
      // Animación de lectura: lean lento hacia pantalla + nod de comprensión
      const readPhase = Math.sin(time*0.65);                       // ciclo lento
      const nodPulse  = 1+Math.max(0,Math.sin(time*1.4))*0.05;    // nod sutil
      const readOffX  = readPhase*5;                               // balanceo ±5px
      const readSY    = 1-Math.abs(readPhase)*0.04;                // compresión leve
      const hDeskX    = CX+readOffX, hDeskY=DESK_Y-82;
      // Línea de atención: héroe → pantalla (dashed, muy sutil)
      const gazeA=(0.07+Math.sin(time*1.1)*0.05)*fadeIn;
      ctx.save(); ctx.globalAlpha=gazeA; ctx.strokeStyle='#ffffff'; ctx.lineWidth=0.8;
      ctx.setLineDash([3,6]); ctx.beginPath(); ctx.moveTo(hDeskX,hDeskY); ctx.lineTo(CX,DESK_Y-68); ctx.stroke();
      ctx.setLineDash([]); ctx.restore();
      drawHero(ctx,hDeskX,hDeskY,36*breathe*nodPulse,fadeIn,1,readSY,42+Math.sin(time*0.85)*14);

      // Anillo orbital de partículas alrededor del héroe (driven por time, no orbitAngle)
      const ORBIT_R=118, ORBIT_DOTS=12;
      for(let i=0;i<ORBIT_DOTS;i++){
        const oa=time*0.9+i*(Math.PI*2/ORBIT_DOTS);
        const ox=hDeskX+Math.cos(oa)*ORBIT_R;
        const oy=hDeskY+Math.sin(oa)*ORBIT_R*0.40;
        const dotOp=Math.max(0,(0.38+Math.sin(oa*2+time)*0.32))*fadeIn;
        if(dotOp>0.01){
          ctx.save(); ctx.globalAlpha=dotOp; ctx.fillStyle='#ffffff';
          ctx.shadowBlur=9; ctx.shadowColor='rgba(255,255,255,0.7)';
          ctx.beginPath(); ctx.arc(ox,oy,3,0,Math.PI*2); ctx.fill();
          ctx.shadowBlur=0; ctx.restore();
        }
      }

      // Anillos expansivos en el clímax
      if (t4>=0.80) {
        for(let r=0;r<3;r++){
          const rP=((t4-0.80)/0.20*1.5+r*0.34)%1;
          ctx.save(); ctx.globalAlpha=(1-rP)*0.20;
          ctx.strokeStyle='#ffffff'; ctx.lineWidth=1.2;
          ctx.beginPath(); ctx.arc(hDeskX,hDeskY,rP*180,0,Math.PI*2); ctx.stroke(); ctx.restore();
        }
      }

      // Fade to black
      if (t4>=0.88) {
        const fT=Easing.easeInQuart((t4-0.88)/0.12);
        ctx.save(); ctx.globalAlpha=fT; ctx.fillStyle='#050505'; ctx.fillRect(0,0,W,H); ctx.restore();
      }

      setStatus('Acto 4: La Cosecha del Activo');
    }

    // ================================================================
    // FIRMA (35–38s)
    // ================================================================
    else if (time < T5) {
      const t=(time-T4)/(T5-T4);
      const slideP=Easing.easeOutQuart(Math.min(1,t/0.08));
      const breatheF=0.93+Math.sin((time-T4)*0.6)*0.07;
      const lightX=CX+220-t*480;
      const lightY=960+420-t*520;
      ctx.fillStyle='#050505'; ctx.fillRect(0,0,W,H);
      drawStarfield(ctx,W,H,time,Math.min(1,t/0.18)*0.72);
      drawSignatureCard(ctx,W,H,CX,960,slideP,(1-slideP)*180,lightX,lightY,breatheF,scene);
      setStatus('Firma: El Apalancamiento');
    }

    // ================================================================
    // HOLD FINAL
    // ================================================================
    else {
      const breatheF=0.93+Math.sin((time-T5)*0.6)*0.07;
      ctx.fillStyle='#050505'; ctx.fillRect(0,0,W,H);
      drawStarfield(ctx,W,H,time,0.72);
      drawSignatureCard(ctx,W,H,CX,960,1,0,CX-260,960-100,breatheF,scene);
      setStatus('Animación completada');
    }

    drawFilmGrain(ctx,W,H,0.08,fc);

    if (time<DURATION) {
      animationFrameRef.current=requestAnimationFrame(update);
    } else {
      setIsPlaying(false); setStatus('Animación completada');
    }
  };

  // ── Controles ────────────────────────────────────────────────────────────────
  const play=()=>{ if(startTimeRef.current===null)startTimeRef.current=performance.now(); setIsPlaying(true); update(); };
  const pause=()=>{ setIsPlaying(false); if(animationFrameRef.current)cancelAnimationFrame(animationFrameRef.current); };
  const restart=()=>{
    if(animationFrameRef.current)cancelAnimationFrame(animationFrameRef.current);
    startTimeRef.current=null; sceneRef.current=null;
    setProgress(0); setIsPlaying(false);
    const canvas=canvasRef.current;
    if(canvas){const ctx=canvas.getContext('2d');if(ctx){ctx.fillStyle='#050505';ctx.fillRect(0,0,canvas.width,canvas.height);}}
    setStatus('Reiniciado');
    setTimeout(()=>play(),100);
  };
  const startRecording=()=>{
    const canvas=canvasRef.current; if(!canvas||isRecording)return;
    restart(); setIsRecording(true); recordedChunksRef.current=[];
    const stream=canvas.captureStream(60);
    const opts={mimeType:'video/webm;codecs=vp9',videoBitsPerSecond:30000000};
    try{mediaRecorderRef.current=new MediaRecorder(stream,opts);}
    catch{mediaRecorderRef.current=new MediaRecorder(stream);}
    mediaRecorderRef.current.ondataavailable=e=>{if(e.data.size>0)recordedChunksRef.current.push(e.data);};
    mediaRecorderRef.current.onstop=()=>{
      const blob=new Blob(recordedChunksRef.current,{type:'video/webm'});
      const url=URL.createObjectURL(blob);
      const a=document.createElement('a'); a.href=url;
      a.download='dia8-v2-apalancamiento-artesano-38s-60fps.webm';
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      URL.revokeObjectURL(url); setIsRecording(false); setStatus('Grabación descargada');
    };
    mediaRecorderRef.current.start();
    setTimeout(()=>{if(mediaRecorderRef.current?.state==='recording')mediaRecorderRef.current.stop();},DURATION*1000+700);
  };

  useEffect(()=>{
    const canvas=canvasRef.current; if(!canvas)return;
    const ctx=canvas.getContext('2d',{alpha:false}); if(!ctx)return;
    const CX=canvas.width/2, CY=canvas.height/2;
    ctx.fillStyle='#050505'; ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.shadowBlur=40; ctx.shadowColor='rgba(197,160,89,0.6)';
    ctx.font='bold 48px Montserrat,sans-serif'; ctx.fillStyle='#ffffff'; ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.fillText('Día 8 v2 · El Artesano Digital',CX,CY-90); ctx.shadowBlur=0;
    ctx.font='28px Montserrat,sans-serif'; ctx.fillStyle='rgba(255,255,255,0.7)';
    ctx.fillText('Dan Koe Style · Guión Enriquecido · 38s',CX,CY+10);
    ctx.font='20px Montserrat,sans-serif'; ctx.fillStyle='rgba(255,255,255,0.4)';
    ctx.fillText('Presiona ▶ Reproducir para comenzar',CX,CY+100);
    // Precarga SVG de la vaca
    const cowImg=new Image();
    cowImg.onload=()=>{ cowImgRef.current=cowImg; };
    cowImg.src='/animaciones/cow-danko.svg';
    return()=>{if(animationFrameRef.current)cancelAnimationFrame(animationFrameRef.current);};
  },[]);

  useEffect(()=>{if(isPlaying)update();},[isPlaying]);

  return (
    <div className="app">
      <div className="container">
        <canvas ref={canvasRef} width={1080} height={1920} className="canvas" />
        <div className="progress-bar"><div className="progress-fill" style={{width:`${progress}%`}} /></div>
        <div className="controls">
          <button onClick={isPlaying?pause:play} disabled={isRecording}>{isPlaying?'⏸ Pausar':'▶ Reproducir'}</button>
          <button onClick={restart} disabled={isRecording}>↻ Reiniciar</button>
          <button onClick={startRecording} disabled={isRecording}>{isRecording?'⬤ Grabando...':'⬤ Grabar (38s)'}</button>
        </div>
        <div className="info" suppressHydrationWarning>
          <div className="status" suppressHydrationWarning>{status}</div>
          <div>1080×1920 · 60FPS · 38s · Día 8 v2 (El Artesano Digital)</div>
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
