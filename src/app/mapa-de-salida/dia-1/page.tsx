'use client';

/**
 * Copyright © 2025 CreaTuActivo.com
 * Mapa de Salida — Coordenada 1
 * Página de video para prospectos del email Día 1
 * noindex — funnel interno
 */

const VIDEO_1080P = 'https://tydh3stq7cgynabr.public.blob.vercel-storage.com/videos/mapa-dia1-1080p.mp4';
const VIDEO_720P  = 'https://tydh3stq7cgynabr.public.blob.vercel-storage.com/videos/mapa-dia1-720p.mp4';
const POSTER      = 'https://tydh3stq7cgynabr.public.blob.vercel-storage.com/videos/mapa-dia1-poster.jpg';

export default function Coordenada1Page() {
  return (
    <main style={{ backgroundColor: '#0F1115', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '48px 20px 80px' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <p style={{ color: '#C5A059', fontSize: '12px', fontWeight: 600, letterSpacing: '3px', margin: '0 0 12px' }}>
            COORDENADA 1 DE 5
          </p>
          <h1 style={{ color: '#F5F5F5', fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 500, fontFamily: 'Georgia, serif', margin: '0 0 12px', lineHeight: 1.3 }}>
            Por qué sudas mucho, pero no avanzas
          </h1>
          <p style={{ color: '#A3A3A3', fontSize: '16px', margin: 0 }}>
            El Diagnóstico — 3 min
          </p>
        </div>

        {/* Video Player */}
        <div style={{
          position: 'relative',
          aspectRatio: '16/9',
          backgroundColor: '#1A1D23',
          borderRadius: '16px',
          border: '1px solid rgba(255,255,255,0.08)',
          overflow: 'hidden',
          boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
        }}>
          <video
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            poster={POSTER}
            controls
            preload="metadata"
            playsInline
            controlsList="nodownload"
          >
            <source src={VIDEO_1080P} type="video/mp4" media="(min-width: 1024px)" />
            <source src={VIDEO_720P}  type="video/mp4" />
            Tu navegador no soporta la reproducción de video.
          </video>
        </div>

        {/* Descripción */}
        <div style={{
          backgroundColor: '#1A1D23',
          borderLeft: '4px solid #C5A059',
          borderRadius: '0 8px 8px 0',
          padding: '20px 24px',
          margin: '32px 0',
        }}>
          <p style={{ color: '#E5E5E5', fontSize: '17px', lineHeight: 1.7, margin: 0 }}>
            Al final de este video encontrarás las instrucciones para calcular tu <strong>"Número de Fragilidad"</strong> — el ejercicio de 2 minutos que te dará claridad total sobre dónde estás parado hoy.
          </p>
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <p style={{ color: '#A3A3A3', fontSize: '14px', marginBottom: '8px' }}>
            Mañana recibirás la Coordenada 2 en tu correo.
          </p>
          <p style={{ color: '#64748B', fontSize: '13px', margin: 0 }}>
            Mapa de Salida · CreaTuActivo.com
          </p>
        </div>

      </div>
    </main>
  );
}
