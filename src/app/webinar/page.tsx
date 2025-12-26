/**
 * Copyright © 2025 CreaTuActivo.com
 * Webinar - Página de Registro
 * "Los 3 Secretos para Construir un Activo Digital"
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import StrategicNavigation from '@/components/StrategicNavigation';

// Quiet Luxury Colors
const COLORS = {
  gold: '#D4AF37',
  bgDeep: '#0a0a0f',
  bgSurface: '#12121a',
  bgCard: '#1a1a24',
  textPrimary: '#f5f5f5',
  textSecondary: '#a0a0a8',
  textMuted: '#6b6b75',
  border: '#2a2a35',
};

export default function WebinarPage() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    whatsapp: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await fetch('/api/funnel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          source: 'webinar',
          step: 'webinar_registered',
        }),
      });

      setIsRegistered(true);
    } catch (error) {
      console.error('Error:', error);
      setIsRegistered(true); // Mostrar éxito de todas formas
    } finally {
      setIsSubmitting(false);
    }
  };

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
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 overflow-hidden">
          {/* Gradient */}
          <div
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(ellipse at 50% 0%, rgba(212, 175, 55, 0.08) 0%, transparent 50%)',
            }}
          />

          <div className="relative max-w-6xl mx-auto px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Left: Content */}
              <div>
                {/* Badge */}
                <div
                  className="inline-flex items-center gap-2 rounded-full px-4 py-2 mb-8"
                  style={{
                    backgroundColor: COLORS.bgCard,
                    border: `1px solid ${COLORS.border}`,
                  }}
                >
                  <span
                    className="w-2 h-2 rounded-full animate-pulse"
                    style={{ backgroundColor: COLORS.gold }}
                  />
                  <span className="text-sm" style={{ color: COLORS.textSecondary }}>
                    Webinar Gratuito
                  </span>
                </div>

                {/* Headline */}
                <h1
                  className="text-4xl sm:text-5xl lg:text-6xl leading-tight mb-6"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 500 }}
                >
                  Los <span style={{ color: COLORS.gold }}>3 Secretos</span>
                  <br />
                  para Construir un
                  <br />
                  <span style={{ color: COLORS.textSecondary }}>Activo Digital</span>
                </h1>

                <p className="text-xl mb-8" style={{ color: COLORS.textSecondary }}>
                  Sin renunciar a tu trabajo. Sin invertir miles.
                  Sin necesitar habilidades técnicas.
                </p>

                {/* What you'll learn */}
                <div className="space-y-4 mb-8">
                  {[
                    'Por qué el 97% nunca logran soberanía financiera',
                    'El modelo matemático que funciona (y cómo empezar hoy)',
                    'El sistema que construí después de 12 años de fracasos',
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{ backgroundColor: 'rgba(212, 175, 55, 0.2)' }}
                      >
                        <span style={{ color: COLORS.gold, fontWeight: 600 }}>{i + 1}</span>
                      </div>
                      <span style={{ color: COLORS.textSecondary }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Form */}
              <div
                className="p-8 rounded-2xl"
                style={{
                  backgroundColor: COLORS.bgSurface,
                  border: `1px solid ${COLORS.border}`,
                }}
              >
                {isRegistered ? (
                  <SuccessMessage />
                ) : (
                  <RegistrationForm
                    formData={formData}
                    setFormData={setFormData}
                    handleSubmit={handleSubmit}
                    isSubmitting={isSubmitting}
                  />
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Host Section */}
        <section className="py-24" style={{ backgroundColor: COLORS.bgSurface }}>
          <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
            <div
              className="w-24 h-24 rounded-full mx-auto mb-8"
              style={{
                backgroundColor: COLORS.bgCard,
                border: `2px solid ${COLORS.gold}`,
              }}
            />
            <p
              className="text-sm font-medium uppercase tracking-widest mb-4"
              style={{ color: COLORS.gold }}
            >
              Tu anfitrión
            </p>
            <h2
              className="text-3xl mb-6"
              style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 500 }}
            >
              Luis Cabrejo
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: COLORS.textSecondary }}>
              12 años emprendiendo. A los 40, quebrado. Encontré un modelo que funcionaba
              matemáticamente y lo ejecuté de la forma difícil: 2.5 años hasta Diamante.
              Ahora ayudo a otros a hacerlo más rápido con las herramientas correctas.
            </p>
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

function RegistrationForm({
  formData,
  setFormData,
  handleSubmit,
  isSubmitting,
}: {
  formData: { nombre: string; email: string; whatsapp: string };
  setFormData: React.Dispatch<React.SetStateAction<{ nombre: string; email: string; whatsapp: string }>>;
  handleSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
}) {
  return (
    <form onSubmit={handleSubmit}>
      <h2
        className="text-2xl mb-2"
        style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 500 }}
      >
        Reserva tu lugar
      </h2>
      <p className="mb-6" style={{ color: COLORS.textSecondary }}>
        Cupos limitados. El webinar se transmite en vivo.
      </p>

      <div className="space-y-4">
        <input
          type="text"
          placeholder="Tu nombre"
          value={formData.nombre}
          onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
          required
          className="w-full px-4 py-3 rounded-xl text-base focus:outline-none focus:ring-2"
          style={{
            backgroundColor: COLORS.bgCard,
            border: `1px solid ${COLORS.border}`,
            color: COLORS.textPrimary,
          }}
        />
        <input
          type="email"
          placeholder="Tu email"
          value={formData.email}
          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          required
          className="w-full px-4 py-3 rounded-xl text-base focus:outline-none focus:ring-2"
          style={{
            backgroundColor: COLORS.bgCard,
            border: `1px solid ${COLORS.border}`,
            color: COLORS.textPrimary,
          }}
        />
        <input
          type="tel"
          placeholder="Tu WhatsApp"
          value={formData.whatsapp}
          onChange={(e) => setFormData(prev => ({ ...prev, whatsapp: e.target.value }))}
          required
          className="w-full px-4 py-3 rounded-xl text-base focus:outline-none focus:ring-2"
          style={{
            backgroundColor: COLORS.bgCard,
            border: `1px solid ${COLORS.border}`,
            color: COLORS.textPrimary,
          }}
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full mt-6 py-4 rounded-xl font-medium text-lg transition-all duration-300 disabled:opacity-70"
        style={{
          backgroundColor: COLORS.gold,
          color: COLORS.bgDeep,
        }}
      >
        {isSubmitting ? 'Reservando...' : 'Reservar mi Lugar Gratis'}
      </button>

      <p className="text-center text-sm mt-4" style={{ color: COLORS.textMuted }}>
        100% gratis. Te enviaremos el enlace por email.
      </p>
    </form>
  );
}

function SuccessMessage() {
  return (
    <div className="text-center py-8">
      <div
        className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center"
        style={{ backgroundColor: 'rgba(212, 175, 55, 0.2)' }}
      >
        <svg
          className="w-8 h-8"
          style={{ color: COLORS.gold }}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h2
        className="text-2xl mb-3"
        style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 500 }}
      >
        ¡Estás registrado!
      </h2>
      <p className="mb-6" style={{ color: COLORS.textSecondary }}>
        Revisa tu email. Te enviaremos el enlace y un recordatorio antes del webinar.
      </p>
      <div
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full"
        style={{
          backgroundColor: COLORS.bgCard,
          border: `1px solid ${COLORS.border}`,
        }}
      >
        <svg className="w-5 h-5" style={{ color: COLORS.gold }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        <span style={{ color: COLORS.textSecondary }}>Revisa tu bandeja</span>
      </div>
    </div>
  );
}
