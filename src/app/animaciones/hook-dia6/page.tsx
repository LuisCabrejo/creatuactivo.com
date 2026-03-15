'use client';

import React, { useRef, useEffect } from 'react';

export default function HookDia6() {
  const canvasRef = useRef(null);

  const draw = (ctx, W, H) => {
    const CX = W / 2;

    // ─── FONDO ───────────────────────────────────────────────────
    ctx.fillStyle = '#060608';
    ctx.fillRect(0, 0, W, H);

    // ─── BACKLIGHT DAN KOE ───────────────────────────────────────
    // Foco principal: superior-izquierdo
    const gl1 = ctx.createRadialGradient(CX - 310, 360, 0, CX - 310, 360, 1000);
    gl1.addColorStop(0,    'rgba(218, 214, 206, 0.52)');
    gl1.addColorStop(0.18, 'rgba(178, 174, 166, 0.26)');
    gl1.addColorStop(0.38, 'rgba(128, 125, 118, 0.10)');
    gl1.addColorStop(0.65, 'rgba(66,  64,  59,  0.03)');
    gl1.addColorStop(1,    'rgba(0, 0, 0, 0)');
    ctx.fillStyle = gl1;
    ctx.fillRect(0, 0, W, H);

    // Rebote derecho (complementario, más suave)
    const gl2 = ctx.createRadialGradient(CX + 390, H * 0.52, 0, CX + 390, H * 0.52, 560);
    gl2.addColorStop(0,   'rgba(148, 145, 138, 0.14)');
    gl2.addColorStop(0.4, 'rgba(82,  79,  74,  0.05)');
    gl2.addColorStop(1,   'rgba(0, 0, 0, 0)');
    ctx.fillStyle = gl2;
    ctx.fillRect(0, 0, W, H);

    // ─── ENGRANAJE CONGELADO ──────────────────────────────────────
    // El mismo engranaje del Día 6, pero inmóvil. Sugiere bloqueo.
    const GX = CX;
    const GY = 880;
    const GR = 188;
    const GT = 16;
    const GA = Math.PI / 14; // ángulo estático — como si se trabó aquí

    ctx.save();
    ctx.translate(GX, GY);
    ctx.rotate(GA);
    ctx.globalAlpha = 0.17;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 5;
    ctx.lineJoin = 'round';

    // Dientes
    ctx.beginPath();
    const td = GR * 0.12;
    const tw = Math.PI / GT;
    for (let i = 0; i < GT; i++) {
      const ba  = (Math.PI * 2 * i) / GT;
      const a1  = ba - tw * 0.4;
      const a2  = ba + tw * 0.4;
      const a3  = ba + tw * 0.6;
      const a4  = ba + (Math.PI * 2 / GT) - tw * 0.6;
      const nb  = (Math.PI * 2 * (i + 1)) / GT;
      const oR  = GR + td;
      const iR  = GR - td;
      if (i === 0) ctx.moveTo(Math.cos(a1) * oR, Math.sin(a1) * oR);
      ctx.lineTo(Math.cos(a2) * oR, Math.sin(a2) * oR);
      ctx.lineTo(Math.cos(a3) * iR, Math.sin(a3) * iR);
      ctx.lineTo(Math.cos(a4) * iR, Math.sin(a4) * iR);
      ctx.lineTo(Math.cos(nb - tw * 0.4) * oR, Math.sin(nb - tw * 0.4) * oR);
    }
    ctx.closePath();
    ctx.stroke();

    // Hub
    ctx.beginPath();
    ctx.arc(0, 0, GR * 0.25, 0, Math.PI * 2);
    ctx.stroke();

    // Inner ring
    ctx.beginPath();
    ctx.arc(0, 0, GR * 0.55, 0, Math.PI * 2);
    ctx.stroke();

    // 4 radios
    for (let i = 0; i < 4; i++) {
      const a = (Math.PI * 2 * i) / 4;
      ctx.beginPath();
      ctx.moveTo(Math.cos(a) * GR * 0.25, Math.sin(a) * GR * 0.25);
      ctx.lineTo(Math.cos(a) * GR * 0.55, Math.sin(a) * GR * 0.55);
      ctx.stroke();
    }

    ctx.restore();

    // Líneas de "resistencia" — el engranaje está bloqueado
    // 8 marcas cortas en el borde exterior, muy sutiles
    ctx.save();
    ctx.globalAlpha = 0.09;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3.5;
    ctx.lineCap = 'round';
    for (let i = 0; i < 8; i++) {
      const a  = (Math.PI * 2 * i) / 8 + GA + Math.PI / 16;
      const r1 = GR + td + 14;
      const r2 = GR + td + 42;
      ctx.beginPath();
      ctx.moveTo(GX + Math.cos(a) * r1, GY + Math.sin(a) * r1);
      ctx.lineTo(GX + Math.cos(a) * r2, GY + Math.sin(a) * r2);
      ctx.stroke();
    }
    ctx.restore();

    // ─── TEXTO ────────────────────────────────────────────────────
    ctx.textAlign    = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowBlur   = 0;

    // — Bloque superior —
    ctx.fillStyle = 'rgba(255, 255, 255, 0.80)';
    ctx.font = '700 78px Montserrat, sans-serif';
    ctx.fillText('¿Sientes que', CX, 278);

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 100px Montserrat, sans-serif';
    ctx.fillText('empujas con', CX, 402);
    ctx.fillText('fuerza...', CX, 526);

    // Separador fino
    ctx.save();
    ctx.globalAlpha = 0.13;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(CX - 160, 608);
    ctx.lineTo(CX + 160, 608);
    ctx.stroke();
    ctx.restore();

    // — Bloque inferior —
    ctx.fillStyle = 'rgba(255, 255, 255, 0.80)';
    ctx.font = '700 78px Montserrat, sans-serif';
    ctx.fillText('...pero no avanzas', CX, 1148);

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 100px Montserrat, sans-serif';
    ctx.fillText('ni un metro?', CX, 1275);

    // Emoji — usa fuente del sistema para máxima compatibilidad
    ctx.font = '108px sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('🛑', CX, 1435);

    // ─── HANDLE ───────────────────────────────────────────────────
    ctx.font      = '400 36px Montserrat, sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.28)';
    ctx.fillText('@luiscabrejo', CX, 1800);
  };

  useEffect(() => {
    // Cargar Montserrat antes de dibujar para que el texto sea correcto
    const link = document.createElement('link');
    link.rel  = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700;900&display=swap';
    document.head.appendChild(link);

    document.fonts.ready.then(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      draw(ctx, 1080, 1920);
    });
  }, []);

  const downloadPng = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a      = document.createElement('a');
    a.download   = 'hook-dia6-sientes-que-empujas.png';
    a.href       = canvas.toDataURL('image/png');
    a.click();
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a1f 100%)',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: 'Montserrat, sans-serif',
      color: '#ffffff',
    }}>
      <canvas
        ref={canvasRef}
        width={1080}
        height={1920}
        style={{
          maxHeight: '80vh',
          maxWidth: '100%',
          aspectRatio: '9/16',
          borderRadius: '8px',
          boxShadow: '0 0 40px rgba(197, 160, 89, 0.18), 0 0 80px rgba(197, 160, 89, 0.08)',
        }}
      />

      <div style={{ display: 'flex', gap: '12px', marginTop: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button
          onClick={downloadPng}
          style={{
            padding: '14px 28px',
            fontSize: '15px',
            fontWeight: 700,
            cursor: 'pointer',
            background: 'linear-gradient(135deg, #C5A059 0%, #D4AF37 100%)',
            color: '#000',
            border: 'none',
            borderRadius: '6px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          }}
        >
          ⬇ Descargar PNG (1080×1920)
        </button>
      </div>

      <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '13px', marginTop: '12px', textAlign: 'center' }}>
        Canvas 1080×1920 · Historia de Instagram
      </p>
    </div>
  );
}
