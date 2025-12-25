/**
 * Copyright © 2025 CreaTuActivo.com
 * Reto 5 Días - Paso 2 del Funnel Russell Brunson
 * Página de registro para el reto por WhatsApp
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import StrategicNavigation from '@/components/StrategicNavigation';

// ============================================================================
// CSS VARIABLES - QUIET LUXURY PALETTE
// ============================================================================

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap');

  :root {
    --gold: #D4AF37;
    --gold-light: #E8C547;
    --gold-dark: #B8982F;
    --gold-muted: #C9A962;

    --bg-deep: #0a0a0f;
    --bg-surface: #12121a;
    --bg-card: #1a1a24;
    --bg-elevated: #22222e;

    --text-primary: #f5f5f5;
    --text-secondary: #a0a0a8;
    --text-muted: #6b6b75;

    --border: #2a2a35;
    --border-subtle: #1f1f28;

    --font-display: 'Playfair Display', Georgia, serif;
    --font-body: 'Inter', -apple-system, sans-serif;
  }
`;

// ============================================================================
// TIPOS
// ============================================================================

interface FormData {
  nombre: string;
  email: string;
  whatsapp: string;
}

// ============================================================================
// DATOS DEL RETO
// ============================================================================

const diasDelReto = [
  {
    dia: 1,
    titulo: 'El Diagnóstico',
    descripcion: 'Descubre exactamente dónde estás y por qué tu plan actual no te llevará a la libertad.',
    icono: '🔍'
  },
  {
    dia: 2,
    titulo: 'Los Vehículos',
    descripcion: 'Conoce los 4 vehículos de riqueza y por qué solo 1 te da verdadera libertad.',
    icono: '🚀'
  },
  {
    dia: 3,
    titulo: 'El Nuevo Modelo',
    descripcion: 'La matemática detrás del modelo que funciona (y por qué el 99% no lo entiende).',
    icono: '📐'
  },
  {
    dia: 4,
    titulo: 'El Estigma',
    descripcion: 'Cómo construir sin vergüenza, sin molestar amigos, sin perder tu reputación.',
    icono: '🛡️'
  },
  {
    dia: 5,
    titulo: 'La Invitación',
    descripcion: 'Tu oportunidad de acceder al sistema completo con acompañamiento.',
    icono: '🎯'
  }
];

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

export default function Reto5DiasPage() {
  const [formData, setFormData] = useState<FormData>({
    nombre: '',
    email: '',
    whatsapp: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simular envío - aquí conectarías con tu backend/CRM
    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsSubmitted(true);
    setIsSubmitting(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <StrategicNavigation />
      <main
        className="min-h-screen"
        style={{
          backgroundColor: 'var(--bg-deep)',
          color: 'var(--text-primary)',
          fontFamily: 'var(--font-body)'
        }}
      >
        <HeroSection
          formData={formData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          isSubmitted={isSubmitted}
        />
        <QueAprenderas />
        <ParaQuienEs />
        <SobreLuis />
        <FinalCTA
          formData={formData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          isSubmitted={isSubmitted}
        />
        <Footer />
      </main>
    </>
  );
}

// ============================================================================
// HERO SECTION
// ============================================================================

function HeroSection({
  formData,
  handleChange,
  handleSubmit,
  isSubmitting,
  isSubmitted
}: {
  formData: FormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  isSubmitted: boolean;
}) {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      {/* Gradient background */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, rgba(212, 175, 55, 0.1) 0%, transparent 50%)'
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
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border)'
              }}
            >
              <span
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ backgroundColor: 'var(--gold)' }}
              />
              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Próximo reto inicia pronto
              </span>
            </div>

            {/* Headline */}
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl leading-tight mb-6"
              style={{ fontFamily: 'var(--font-display)', fontWeight: 500 }}
            >
              <span style={{ color: 'var(--gold)' }}>5 días</span>
              <br />
              para entender lo que
              <br />
              <span style={{ color: 'var(--text-secondary)' }}>nadie te explica</span>
            </h1>

            <p className="text-xl mb-8" style={{ color: 'var(--text-secondary)' }}>
              Un reto gratuito por WhatsApp donde descubrirás por qué tu plan actual
              no te llevará a la libertad financiera—y qué hacer al respecto.
            </p>

            {/* Bullets */}
            <div className="space-y-4 mb-8">
              {[
                '5 lecciones en video directo a tu WhatsApp',
                'Acciones simples de 15 minutos por día',
                'Sin compromiso, sin presión, sin costo'
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: 'rgba(212, 175, 55, 0.2)' }}
                  >
                    <svg className="w-3 h-3" style={{ color: 'var(--gold)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span style={{ color: 'var(--text-secondary)' }}>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Form */}
          <div
            className="p-8 rounded-2xl"
            style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border)'
            }}
          >
            {isSubmitted ? (
              <SuccessMessage />
            ) : (
              <RegistrationForm
                formData={formData}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                isSubmitting={isSubmitting}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// FORM COMPONENTS
// ============================================================================

function RegistrationForm({
  formData,
  handleChange,
  handleSubmit,
  isSubmitting
}: {
  formData: FormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
}) {
  return (
    <form onSubmit={handleSubmit}>
      <h2
        className="text-2xl mb-2"
        style={{ fontFamily: 'var(--font-display)', fontWeight: 500 }}
      >
        Reserva tu lugar
      </h2>
      <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>
        Ingresa tus datos para recibir el reto directamente en tu WhatsApp.
      </p>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
            Tu nombre
          </label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
            placeholder="¿Cómo te llamas?"
            className="w-full px-4 py-3 rounded-xl text-base transition-all duration-200 focus:outline-none focus:ring-2"
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border)',
              color: 'var(--text-primary)'
            }}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
            Tu email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="email@ejemplo.com"
            className="w-full px-4 py-3 rounded-xl text-base transition-all duration-200 focus:outline-none focus:ring-2"
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border)',
              color: 'var(--text-primary)'
            }}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
            Tu WhatsApp
          </label>
          <input
            type="tel"
            name="whatsapp"
            value={formData.whatsapp}
            onChange={handleChange}
            required
            placeholder="+57 300 123 4567"
            className="w-full px-4 py-3 rounded-xl text-base transition-all duration-200 focus:outline-none focus:ring-2"
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border)',
              color: 'var(--text-primary)'
            }}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full mt-6 py-4 rounded-xl font-medium text-lg transition-all duration-300 disabled:opacity-70"
        style={{
          backgroundColor: 'var(--gold)',
          color: 'var(--bg-deep)'
        }}
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Reservando...
          </span>
        ) : (
          'Quiero unirme al Reto'
        )}
      </button>

      <p className="text-center text-sm mt-4" style={{ color: 'var(--text-muted)' }}>
        100% gratis. Sin tarjeta. Sin spam.
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
        <svg className="w-8 h-8" style={{ color: 'var(--gold)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h2
        className="text-2xl mb-3"
        style={{ fontFamily: 'var(--font-display)', fontWeight: 500 }}
      >
        ¡Estás dentro!
      </h2>
      <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>
        Revisa tu WhatsApp. En minutos recibirás el primer mensaje con las instrucciones.
      </p>
      <div
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full"
        style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border)'
        }}
      >
        <svg className="w-5 h-5" style={{ color: '#25D366' }} viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
        <span style={{ color: 'var(--text-secondary)' }}>Revisa tu WhatsApp</span>
      </div>
    </div>
  );
}

// ============================================================================
// QUE APRENDERAS SECTION
// ============================================================================

function QueAprenderas() {
  return (
    <section className="py-24" style={{ backgroundColor: 'var(--bg-surface)' }}>
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <span
            className="text-sm font-medium uppercase tracking-widest"
            style={{ color: 'var(--gold-muted)' }}
          >
            El recorrido
          </span>
          <h2
            className="text-3xl sm:text-4xl mt-6 mb-6"
            style={{ fontFamily: 'var(--font-display)', fontWeight: 500 }}
          >
            Qué descubrirás en 5 días
          </h2>
          <p className="text-xl max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            Cada día recibirás un video corto y una acción simple. Sin overwhelm.
          </p>
        </div>

        <div className="grid md:grid-cols-5 gap-4">
          {diasDelReto.map((dia) => (
            <div
              key={dia.dia}
              className="p-6 rounded-2xl text-center"
              style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border)'
              }}
            >
              <div className="text-4xl mb-4">{dia.icono}</div>
              <div
                className="text-sm font-medium mb-2"
                style={{ color: 'var(--gold)' }}
              >
                Día {dia.dia}
              </div>
              <h3
                className="text-lg font-medium mb-3"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {dia.titulo}
              </h3>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                {dia.descripcion}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// PARA QUIEN ES SECTION
// ============================================================================

function ParaQuienEs() {
  return (
    <section className="py-24" style={{ backgroundColor: 'var(--bg-deep)' }}>
      <div className="max-w-5xl mx-auto px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Este reto es para ti si... */}
          <div>
            <h2
              className="text-2xl mb-8"
              style={{ fontFamily: 'var(--font-display)', fontWeight: 500 }}
            >
              Este reto es para ti si...
            </h2>
            <div className="space-y-4">
              {[
                'Trabajas duro pero sientes que no avanzas',
                'Sabes que necesitas un Plan B pero no sabes por dónde empezar',
                'Has intentado emprender pero siempre vuelves al empleo',
                'Te preocupa depender 100% de tu trabajo',
                'Quieres construir algo propio sin renunciar a tu carrera'
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ backgroundColor: 'rgba(212, 175, 55, 0.2)' }}
                  >
                    <svg className="w-3 h-3" style={{ color: 'var(--gold)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span style={{ color: 'var(--text-secondary)' }}>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Este reto NO es para ti si... */}
          <div>
            <h2
              className="text-2xl mb-8"
              style={{ fontFamily: 'var(--font-display)', fontWeight: 500 }}
            >
              Este reto NO es para ti si...
            </h2>
            <div className="space-y-4">
              {[
                'Buscas hacerte rico rápido sin esfuerzo',
                'No estás dispuesto a dedicar 15 minutos al día',
                'Crees que ya lo sabes todo',
                'No tienes genuino interés en construir un activo',
                'Solo quieres curiosear sin intención de aplicar'
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ backgroundColor: 'rgba(107, 107, 117, 0.2)' }}
                  >
                    <svg className="w-3 h-3" style={{ color: 'var(--text-muted)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <span style={{ color: 'var(--text-muted)' }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// SOBRE LUIS SECTION
// ============================================================================

function SobreLuis() {
  return (
    <section className="py-24" style={{ backgroundColor: 'var(--bg-surface)' }}>
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <div className="text-center">
          {/* Avatar placeholder */}
          <div
            className="w-24 h-24 rounded-full mx-auto mb-8"
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '2px solid var(--gold)'
            }}
          />

          <span
            className="text-sm font-medium uppercase tracking-widest"
            style={{ color: 'var(--gold-muted)' }}
          >
            Tu guía en el reto
          </span>

          <h2
            className="text-3xl sm:text-4xl mt-4 mb-6"
            style={{ fontFamily: 'var(--font-display)', fontWeight: 500 }}
          >
            Luis Cabrejo
          </h2>

          <p className="text-lg max-w-2xl mx-auto mb-8" style={{ color: 'var(--text-secondary)' }}>
            12 años emprendiendo. A los 40, quebrado. Encontré un modelo que funcionaba
            matemáticamente pero la infraestructura estaba rota. Lo ejecuté de la forma
            difícil: 2.5 años hasta llegar a Diamante. Después me pregunté: ¿qué hubiera
            pasado si hubiera tenido las herramientas correctas?
          </p>

          <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            Esa pregunta se convirtió en <span style={{ color: 'var(--gold)' }}>CreaTuActivo</span>.
          </p>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// FINAL CTA SECTION
// ============================================================================

function FinalCTA({
  formData,
  handleChange,
  handleSubmit,
  isSubmitting,
  isSubmitted
}: {
  formData: FormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  isSubmitted: boolean;
}) {
  return (
    <section className="py-24" style={{ backgroundColor: 'var(--bg-deep)' }}>
      <div className="max-w-2xl mx-auto px-6 lg:px-8">
        <div
          className="p-8 md:p-12 rounded-2xl text-center"
          style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border)'
          }}
        >
          <h2
            className="text-3xl mb-4"
            style={{ fontFamily: 'var(--font-display)', fontWeight: 500 }}
          >
            ¿Listo para empezar?
          </h2>
          <p className="text-lg mb-8" style={{ color: 'var(--text-secondary)' }}>
            5 días. 15 minutos al día. Claridad total sobre tu futuro financiero.
          </p>

          {isSubmitted ? (
            <SuccessMessage />
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
                placeholder="Tu nombre"
                className="w-full px-4 py-3 rounded-xl text-base focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-primary)'
                }}
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Tu email"
                className="w-full px-4 py-3 rounded-xl text-base focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-primary)'
                }}
              />
              <input
                type="tel"
                name="whatsapp"
                value={formData.whatsapp}
                onChange={handleChange}
                required
                placeholder="Tu WhatsApp"
                className="w-full px-4 py-3 rounded-xl text-base focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-primary)'
                }}
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-xl font-medium text-lg transition-all duration-300 disabled:opacity-70"
                style={{
                  backgroundColor: 'var(--gold)',
                  color: 'var(--bg-deep)'
                }}
              >
                {isSubmitting ? 'Reservando...' : 'Unirme al Reto Gratis'}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// FOOTER
// ============================================================================

function Footer() {
  return (
    <footer
      className="py-12"
      style={{
        backgroundColor: 'var(--bg-surface)',
        borderTop: '1px solid var(--border)'
      }}
    >
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: 'var(--gold)' }}
            >
              <span
                className="text-xl font-semibold"
                style={{
                  color: 'var(--bg-deep)',
                  fontFamily: 'var(--font-display)'
                }}
              >
                C
              </span>
            </div>
            <span className="text-lg font-medium">
              Crea<span style={{ color: 'var(--gold)' }}>Tu</span>Activo
            </span>
          </Link>

          <div className="flex items-center gap-6 text-sm" style={{ color: 'var(--text-muted)' }}>
            <Link href="/privacidad" className="hover:text-white transition-colors">
              Privacidad
            </Link>
            <span>© 2025 CreaTuActivo.com</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
