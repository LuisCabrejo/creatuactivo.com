'use client';

/**
 * Copyright © 2026 CreaTuActivo.com
 * AUDITORÍA DE ARQUITECTURA PATRIMONIAL — MÓDULO 02
 * El Techo Técnico — Análisis de Escalabilidad
 * noindex — funnel interno
 */

import { useRef, useEffect } from 'react';

const VIDEO_1080P = 'https://tydh3stq7cgynabr.public.blob.vercel-storage.com/videos/mapa-dia2-1080p.mp4';
const VIDEO_720P  = 'https://tydh3stq7cgynabr.public.blob.vercel-storage.com/videos/mapa-dia2-720p.mp4';
const POSTER      = 'https://tydh3stq7cgynabr.public.blob.vercel-storage.com/videos/mapa-dia2-poster.jpg';

const C = {
  gold: '#C8A84B',
  white: '#F5F5F0',
  muted: '#6B6B5A',
  mutedLight: '#8A8A7A',
  bg: '#080808',
  bgCard: '#0d0d0d',
  bgCardBorder: '#1c1c1c',
  cyan: '#22D3EE',
  divider: '#222',
};

function trackEvent(event: string) {
  try {
    const fp = (window as any).FrameworkIAA?.fingerprint;
    fetch('/api/nexus', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event, page: 'auditoria-dia-2', fingerprint: fp }),
      keepalive: true,
    }).catch(() => {});
  } catch {}
}

export default function Modulo02Page() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const completedRef = useRef(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onPlay = () => trackEvent('video_play_modulo02');
    const onTimeUpdate = () => {
      if (!completedRef.current && video.duration > 0 && video.currentTime / video.duration >= 0.8) {
        completedRef.current = true;
        trackEvent('video_completed_80_modulo02');
      }
    };

    video.addEventListener('play', onPlay);
    video.addEventListener('timeupdate', onTimeUpdate);
    return () => {
      video.removeEventListener('play', onPlay);
      video.removeEventListener('timeupdate', onTimeUpdate);
    };
  }, []);

  return (
    <main style={{ backgroundColor: C.bg, minHeight: '100vh' }}>
      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '48px 20px 80px' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <p style={{
            color: C.gold, fontSize: '11px', fontWeight: 600,
            letterSpacing: '3px', margin: '0 0 14px',
            fontFamily: "'Roboto Mono', monospace",
          }}>
            COORDENADA 02 DE 05 — AUDITORÍA EN CURSO
          </p>
          <h1 style={{
            color: C.white,
            fontSize: 'clamp(22px, 4vw, 34px)',
            fontWeight: 700,
            fontFamily: "'Playfair Display', Georgia, serif",
            margin: '0 0 12px', lineHeight: 1.25,
          }}>
            El Techo Técnico
          </h1>
          <p style={{
            color: C.mutedLight, fontSize: '15px', margin: 0,
            fontFamily: "'Rajdhani', sans-serif", letterSpacing: '0.04em',
          }}>
            Módulo 02 — Análisis del límite matemático de su modelo operativo manual
          </p>
        </div>

        {/* Video Player */}
        <div style={{
          position: 'relative',
          aspectRatio: '16/9',
          backgroundColor: C.bgCard,
          border: `1px solid ${C.bgCardBorder}`,
          overflow: 'hidden',
          boxShadow: '0 25px 60px rgba(0,0,0,0.6)',
        }}>
          <video
            ref={videoRef}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            poster={POSTER}
            controls
            preload="metadata"
            playsInline
            controlsList="nodownload"
          >
            <source src={VIDEO_1080P} type="video/mp4" media="(min-width: 1024px)" />
            <source src={VIDEO_720P}  type="video/mp4" />
          </video>
        </div>

        {/* Instrucción de ejecución */}
        <div style={{
          borderLeft: `2px solid ${C.gold}`,
          padding: '18px 24px',
          margin: '28px 0',
          background: 'rgba(200,168,75,0.04)',
        }}>
          <p style={{
            color: '#E5E5E5', fontSize: '15px', lineHeight: 1.75, margin: 0,
          }}>
            Evalúe el <strong>límite matemático de su modelo operativo manual</strong>. La respuesta instintiva de trabajar más horas es matemáticamente defectuosa — este módulo demuestra por qué, y cuantifica la urgencia de integrar apalancamiento asimétrico.
          </p>
        </div>

        {/* Footer instructivo */}
        <div style={{
          textAlign: 'center', marginTop: '36px',
          borderTop: `1px solid ${C.divider}`, paddingTop: '24px',
        }}>
          <p style={{
            color: C.muted, fontSize: '12px', marginBottom: '6px',
            fontFamily: "'Roboto Mono', monospace", letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}>
            La Coordenada 03 será inyectada en su bandeja de entrada mañana a las 8:00 AM.
          </p>
          <p style={{
            color: '#333', fontSize: '11px', margin: 0,
            fontFamily: "'Roboto Mono', monospace", letterSpacing: '0.06em',
          }}>
            Auditoría de Arquitectura Patrimonial · CreaTuActivo.com
          </p>
        </div>

      </div>
    </main>
  );
}
