/**
 * Copyright © 2025 CreaTuActivo.com
 * Webinar - Sala de Transmisión
 * "Los 3 Secretos para Construir un Activo Digital"
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import StrategicNavigation from '@/components/StrategicNavigation';

// THE ARCHITECT'S SUITE - Quiet Luxury Colors
const COLORS = {
  gold: '#C5A059',
  bgDeep: '#0F1115',
  bgSurface: '#1A1D23',
  bgCard: '#1A1D23',
  textPrimary: '#E5E5E5',
  textSecondary: '#A3A3A3',
  textMuted: '#6B7280',
  border: 'rgba(197, 160, 89, 0.15)',
};

export default function WebinarSalaPage() {
  const [isLive, setIsLive] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // Fecha del próximo webinar (configurar según necesidad)
  const webinarDate = new Date('2026-01-15T19:00:00-05:00'); // 7 PM Colombia

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const diff = webinarDate.getTime() - now.getTime();

      if (diff <= 0) {
        setIsLive(true);
        clearInterval(timer);
        return;
      }

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <StrategicNavigation />
      <main
        className="min-h-screen"
        style={{
          backgroundColor: COLORS.bgDeep,
          color: COLORS.textPrimary,
          fontFamily: "'Inter', -apple-system, sans-serif",
        }}
      >
        {/* Header */}
        <section className="relative pt-28 pb-8 overflow-hidden">
          <div
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(ellipse at 50% 0%, rgba(212, 175, 55, 0.08) 0%, transparent 50%)',
            }}
          />

          <div className="relative max-w-5xl mx-auto px-6 lg:px-8 text-center">
            {/* Status Badge */}
            <div
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 mb-6"
              style={{
                backgroundColor: isLive ? 'rgba(239, 68, 68, 0.2)' : COLORS.bgCard,
                border: `1px solid ${isLive ? 'rgba(239, 68, 68, 0.5)' : COLORS.border}`,
              }}
            >
              <span
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ backgroundColor: isLive ? '#ef4444' : COLORS.gold }}
              />
              <span className="text-sm" style={{ color: isLive ? '#fca5a5' : COLORS.textSecondary }}>
                {isLive ? 'EN VIVO AHORA' : 'Próximamente'}
              </span>
            </div>

            <h1
              className="text-3xl sm:text-4xl lg:text-5xl leading-tight mb-4"
              style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 500 }}
            >
              Los <span style={{ color: COLORS.gold }}>3 Secretos</span> para
              <br />
              Construir un Activo Digital
            </h1>

            <p className="text-lg mb-8" style={{ color: COLORS.textSecondary }}>
              Con Luis Cabrejo
            </p>
          </div>
        </section>

        {/* Video Section */}
        <section className="pb-12">
          <div className="max-w-4xl mx-auto px-6 lg:px-8">
            {isLive ? (
              <LiveVideo />
            ) : (
              <CountdownTimer timeLeft={timeLeft} webinarDate={webinarDate} />
            )}
          </div>
        </section>

        {/* Chat Section (solo si está en vivo) */}
        {isLive && (
          <section className="pb-12">
            <div className="max-w-4xl mx-auto px-6 lg:px-8">
              <LiveChat />
            </div>
          </section>
        )}

        {/* What You'll Learn */}
        <section className="py-16" style={{ backgroundColor: COLORS.bgSurface }}>
          <div className="max-w-4xl mx-auto px-6 lg:px-8">
            <h2
              className="text-2xl text-center mb-12"
              style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 500 }}
            >
              Lo que aprenderás en este webinar
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  number: '01',
                  title: 'El Plan por Defecto',
                  description: 'Por qué el 97% de las personas nunca logran independencia financiera.',
                },
                {
                  number: '02',
                  title: 'El Modelo Matemático',
                  description: 'La fórmula que funciona y cómo empezar con lo que tienes hoy.',
                },
                {
                  number: '03',
                  title: 'El Sistema Probado',
                  description: 'Lo que construí después de 12 años de fracasos—y cómo replicarlo.',
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="p-6 rounded-2xl"
                  style={{
                    backgroundColor: COLORS.bgCard,
                    border: `1px solid ${COLORS.border}`,
                  }}
                >
                  <span
                    className="text-4xl font-light"
                    style={{ color: COLORS.gold, fontFamily: "'Playfair Display', Georgia, serif" }}
                  >
                    {item.number}
                  </span>
                  <h3 className="text-lg font-medium mt-4 mb-2">{item.title}</h3>
                  <p className="text-sm" style={{ color: COLORS.textSecondary }}>
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="max-w-2xl mx-auto px-6 lg:px-8 text-center">
            <h2
              className="text-2xl mb-4"
              style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 500 }}
            >
              ¿Listo para dar el siguiente paso?
            </h2>
            <p className="mb-8" style={{ color: COLORS.textSecondary }}>
              Únete al Reto de 5 Días y empieza a construir tu activo digital.
            </p>
            <Link
              href="/reto-5-dias"
              className="inline-block px-8 py-4 rounded-xl font-medium text-lg transition-all duration-300"
              style={{
                backgroundColor: COLORS.gold,
                color: COLORS.bgDeep,
              }}
            >
              Unirme al Reto de 5 Días
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer
          className="py-12"
          style={{
            backgroundColor: COLORS.bgSurface,
            borderTop: `1px solid ${COLORS.border}`,
          }}
        >
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <Link href="/" className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: COLORS.gold }}
                >
                  <span
                    className="text-xl font-semibold"
                    style={{
                      color: COLORS.bgDeep,
                      fontFamily: "'Playfair Display', Georgia, serif",
                    }}
                  >
                    C
                  </span>
                </div>
                <span className="text-lg font-medium">
                  Crea<span style={{ color: COLORS.gold }}>Tu</span>Activo
                </span>
              </Link>

              <div className="flex items-center gap-6 text-sm" style={{ color: COLORS.textMuted }}>
                <Link href="/privacidad" className="hover:text-white transition-colors">
                  Privacidad
                </Link>
                <span>© 2025 CreaTuActivo.com</span>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}

function CountdownTimer({
  timeLeft,
  webinarDate,
}: {
  timeLeft: { days: number; hours: number; minutes: number; seconds: number };
  webinarDate: Date;
}) {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-CO', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div
      className="p-8 md:p-12 rounded-2xl text-center"
      style={{
        backgroundColor: COLORS.bgSurface,
        border: `1px solid ${COLORS.border}`,
      }}
    >
      <p className="text-sm uppercase tracking-widest mb-6" style={{ color: COLORS.gold }}>
        El webinar comienza en
      </p>

      <div className="flex justify-center gap-4 md:gap-8 mb-8">
        {[
          { value: timeLeft.days, label: 'Días' },
          { value: timeLeft.hours, label: 'Horas' },
          { value: timeLeft.minutes, label: 'Min' },
          { value: timeLeft.seconds, label: 'Seg' },
        ].map((item, i) => (
          <div key={i} className="text-center">
            <div
              className="w-16 h-16 md:w-20 md:h-20 rounded-xl flex items-center justify-center mb-2"
              style={{ backgroundColor: COLORS.bgCard, border: `1px solid ${COLORS.border}` }}
            >
              <span
                className="text-2xl md:text-3xl font-medium"
                style={{ color: COLORS.gold, fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                {String(item.value).padStart(2, '0')}
              </span>
            </div>
            <span className="text-xs" style={{ color: COLORS.textMuted }}>
              {item.label}
            </span>
          </div>
        ))}
      </div>

      <p style={{ color: COLORS.textSecondary }}>{formatDate(webinarDate)}</p>

      <div
        className="mt-8 p-4 rounded-xl"
        style={{ backgroundColor: 'rgba(212, 175, 55, 0.1)', border: `1px solid rgba(212, 175, 55, 0.2)` }}
      >
        <p className="text-sm" style={{ color: COLORS.textSecondary }}>
          <span style={{ color: COLORS.gold }}>Consejo:</span> Agrega este evento a tu calendario para no perdértelo.
        </p>
      </div>
    </div>
  );
}

function LiveVideo() {
  return (
    <div
      className="aspect-video rounded-2xl overflow-hidden"
      style={{
        backgroundColor: COLORS.bgCard,
        border: `1px solid ${COLORS.border}`,
      }}
    >
      {/* Placeholder para el video en vivo */}
      {/* En producción, integrar con YouTube Live, Vimeo, o plataforma de streaming */}
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <div
            className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
            style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)' }}
          >
            <div className="w-0 h-0 border-t-[12px] border-t-transparent border-l-[20px] border-l-red-500 border-b-[12px] border-b-transparent ml-1" />
          </div>
          <p style={{ color: COLORS.textSecondary }}>
            El video se cargará aquí cuando el webinar esté en vivo.
          </p>
          <p className="text-sm mt-2" style={{ color: COLORS.textMuted }}>
            Integrar con YouTube Live / Vimeo / StreamYard
          </p>
        </div>
      </div>
    </div>
  );
}

function LiveChat() {
  const [message, setMessage] = useState('');

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        backgroundColor: COLORS.bgSurface,
        border: `1px solid ${COLORS.border}`,
      }}
    >
      <div className="p-4" style={{ borderBottom: `1px solid ${COLORS.border}` }}>
        <h3 className="font-medium">Chat en Vivo</h3>
      </div>

      {/* Messages area */}
      <div className="h-64 p-4 overflow-y-auto">
        <p className="text-sm text-center" style={{ color: COLORS.textMuted }}>
          El chat estará disponible durante el webinar en vivo.
        </p>
      </div>

      {/* Input */}
      <div className="p-4" style={{ borderTop: `1px solid ${COLORS.border}` }}>
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Escribe tu pregunta..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 px-4 py-2 rounded-xl text-sm focus:outline-none focus:ring-2"
            style={{
              backgroundColor: COLORS.bgCard,
              border: `1px solid ${COLORS.border}`,
              color: COLORS.textPrimary,
            }}
          />
          <button
            className="px-4 py-2 rounded-xl font-medium text-sm transition-all"
            style={{
              backgroundColor: COLORS.gold,
              color: COLORS.bgDeep,
            }}
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
}
