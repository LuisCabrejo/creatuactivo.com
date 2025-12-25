/**
 * Copyright © 2025 CreaTuActivo.com
 * Calculadora de Días de Libertad - Lead Magnet Principal
 * "La libertad no es un concepto abstracto. Es una métrica matemática."
 *
 * Simplificado a 3 preguntas siguiendo principios de Russell Brunson:
 * Menos fricción = Más conversiones
 */

'use client';

import React, { useState } from 'react';
import StrategicNavigation from '@/components/StrategicNavigation';

// 🎨 Quiet Luxury Color Palette
const QUIET_LUXURY = {
  gold: '#D4AF37',
  goldMuted: '#C9A962',
  goldDark: '#B8962F',
  bgDeep: '#0a0a0f',
  bgSurface: '#12121a',
  bgCard: '#1a1a24',
  bgElevated: '#22222e',
  textPrimary: '#f5f5f5',
  textSecondary: '#a0a0a8',
  textMuted: '#6b6b75',
  border: '#2a2a35',
};

// 3 preguntas esenciales - Russell Brunson style
const questions = [
  {
    id: 'situation',
    question: '¿Cuál es tu situación actual?',
    subtext: 'Esto nos ayuda a personalizar tu resultado',
    options: [
      { value: 'empleado', label: 'Empleado' },
      { value: 'emprendedor', label: 'Emprendedor/Dueño de negocio' },
      { value: 'freelancer', label: 'Freelancer/Independiente' },
      { value: 'otro', label: 'Otro' },
    ],
  },
  {
    id: 'monthlyExpenses',
    question: '¿Cuánto necesitas al mes para vivir?',
    subtext: 'Vivienda, alimentación, servicios, transporte, deudas... todo',
    options: [
      { value: 3000000, label: '$2M - $4M COP' },
      { value: 5000000, label: '$4M - $6M COP' },
      { value: 8000000, label: '$6M - $10M COP' },
      { value: 12000000, label: '$10M - $15M COP' },
      { value: 20000000, label: 'Más de $15M COP' },
    ],
  },
  {
    id: 'passiveIncome',
    question: '¿Cuánto dinero entra a tu cuenta cada mes SIN trabajar?',
    subtext: 'Arriendos, inversiones, regalías, dividendos... ingreso pasivo real',
    options: [
      { value: 0, label: '$0 - No tengo ingreso pasivo' },
      { value: 500000, label: 'Menos de $500K COP' },
      { value: 1500000, label: '$500K - $2M COP' },
      { value: 4000000, label: '$2M - $5M COP' },
      { value: 8000000, label: 'Más de $5M COP' },
    ],
  },
];

export default function CalculadoraPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number | string>>({});
  const [showResults, setShowResults] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', whatsapp: '' });

  const handleAnswer = (questionId: string, value: number | string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));

    if (currentStep < questions.length - 1) {
      setTimeout(() => setCurrentStep(prev => prev + 1), 300);
    } else {
      setTimeout(() => setShowResults(true), 300);
    }
  };

  const calculateResults = () => {
    const monthlyExpenses = (answers.monthlyExpenses as number) || 5000000;
    const passiveIncome = (answers.passiveIncome as number) || 0;
    const situation = (answers.situation as string) || 'empleado';

    // LA FÓRMULA CLAVE: (Ingreso Pasivo / Gastos) × 365
    const freedomDays = monthlyExpenses > 0
      ? Math.min(Math.floor((passiveIncome / monthlyExpenses) * 365), 365)
      : 0;

    const freedomPercentage = (freedomDays / 365) * 100;

    return {
      freedomDays,
      freedomPercentage,
      passiveIncome,
      monthlyExpenses,
      situation,
    };
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Aquí iría la integración con Supabase
    await new Promise(resolve => setTimeout(resolve, 1500));

    window.location.href = '/reto-5-dias?source=calculadora';
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const results = showResults ? calculateResults() : null;

  const getMessage = () => {
    if (!results) return { title: '', body: '' };

    const { freedomDays, situation } = results;

    // Personalización sutil basada en situación
    const situationContext = situation === 'empleado'
      ? 'Tu trabajo no es el problema. Es depender 100% de él.'
      : situation === 'emprendedor'
      ? 'Tener un negocio es el primer paso. Construir un activo es el segundo.'
      : situation === 'freelancer'
      ? 'Ser independiente es libertad de horario. No es libertad real.'
      : '';

    if (freedomDays === 0) {
      return {
        title: 'Dependes 100% de tu trabajo.',
        body: `Si mañana no puedes trabajar—por enfermedad, despido, o cualquier imprevisto—no tienes ni un solo día de respaldo. ${situationContext}`,
      };
    } else if (freedomDays < 30) {
      return {
        title: `Solo ${freedomDays} días de respaldo.`,
        body: `Menos de un mes. Una emergencia, una reestructuración, y tu situación cambia completamente. El problema no eres tú. Es que nadie te enseñó a construir un activo.`,
      };
    } else if (freedomDays < 90) {
      return {
        title: `${freedomDays} días no es libertad.`,
        body: 'Tienes algo construido, pero aún dependes mayoritariamente de tu trabajo. ¿Qué pasaría si pudieras duplicar o triplicar tus días de libertad en los próximos 12 meses?',
      };
    } else if (freedomDays < 180) {
      return {
        title: `${freedomDays} días. Vas por buen camino.`,
        body: 'Ya entiendes el concepto. Ahora la pregunta es: ¿cómo aceleras para llegar a 365 días de soberanía total?',
      };
    } else if (freedomDays < 365) {
      return {
        title: `${freedomDays} días. Casi libre.`,
        body: 'Estás más cerca que el 99% de las personas. Con el sistema correcto, podrías alcanzar soberanía completa.',
      };
    } else {
      return {
        title: '365 días. Soberanía total.',
        body: 'Tu ingreso pasivo cubre tus gastos. Trabajas porque quieres, no porque necesitas. Este es el objetivo.',
      };
    }
  };

  return (
    <>
      <StrategicNavigation />

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap');

        .calculator-container {
          min-height: 100vh;
          background: ${QUIET_LUXURY.bgDeep};
          color: ${QUIET_LUXURY.textPrimary};
          font-family: 'Inter', -apple-system, sans-serif;
        }

        .display-font {
          font-family: 'Playfair Display', Georgia, serif;
        }

        .option-card {
          background: ${QUIET_LUXURY.bgCard};
          border: 1px solid transparent;
          border-radius: 12px;
          padding: 16px 20px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .option-card:hover {
          border-color: ${QUIET_LUXURY.gold};
          transform: translateY(-2px);
        }

        .option-card.selected {
          border-color: ${QUIET_LUXURY.gold};
          background: rgba(212, 175, 55, 0.1);
        }

        .progress-bar {
          height: 4px;
          background: ${QUIET_LUXURY.bgCard};
          border-radius: 2px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: ${QUIET_LUXURY.gold};
          transition: width 0.5s ease;
        }

        .input-field {
          width: 100%;
          background: ${QUIET_LUXURY.bgSurface};
          border: 1px solid ${QUIET_LUXURY.border};
          border-radius: 12px;
          padding: 16px;
          color: ${QUIET_LUXURY.textPrimary};
          font-size: 16px;
          outline: none;
          transition: all 0.3s ease;
        }

        .input-field:focus {
          border-color: ${QUIET_LUXURY.gold};
          box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.1);
        }

        .input-field::placeholder {
          color: ${QUIET_LUXURY.textMuted};
        }

        .cta-button {
          background: ${QUIET_LUXURY.gold};
          color: ${QUIET_LUXURY.bgDeep};
          font-weight: 600;
          padding: 16px 32px;
          border-radius: 12px;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 16px;
          width: 100%;
        }

        .cta-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(212, 175, 55, 0.3);
        }

        .cta-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fadeInUp 0.5s ease forwards;
        }
      `}</style>

      <div className="calculator-container">
        {/* Hero Section - Solo en primera pregunta */}
        {currentStep === 0 && !showResults && (
          <section className="pt-16 pb-8 px-4 animate-fade-in">
            <div className="max-w-2xl mx-auto text-center">
              <p
                className="text-sm uppercase tracking-wider mb-4"
                style={{ color: QUIET_LUXURY.gold }}
              >
                Herramienta Gratuita • 30 segundos
              </p>
              <h1 className="display-font text-3xl md:text-4xl lg:text-5xl font-medium mb-6">
                Calculadora de Días de Libertad
              </h1>
              <p
                className="text-lg md:text-xl mb-8"
                style={{ color: QUIET_LUXURY.textSecondary }}
              >
                La libertad no es un concepto abstracto. Es una métrica matemática.
                <br />
                <span style={{ color: QUIET_LUXURY.gold }}>
                  ¿Cuántos días del año podrías vivir sin trabajar hoy?
                </span>
              </p>
            </div>
          </section>
        )}

        {/* Progress Bar */}
        {!showResults && (
          <div className="max-w-2xl mx-auto px-4 mb-8">
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
              />
            </div>
            <p
              className="text-sm mt-2 text-center"
              style={{ color: QUIET_LUXURY.textMuted }}
            >
              Pregunta {currentStep + 1} de {questions.length}
            </p>
          </div>
        )}

        {/* Questions */}
        {!showResults && (
          <section className="px-4 pb-16 animate-fade-in" key={currentStep}>
            <div className="max-w-2xl mx-auto">
              <div
                className="p-8 rounded-2xl"
                style={{
                  background: QUIET_LUXURY.bgSurface,
                  border: `1px solid ${QUIET_LUXURY.border}`,
                }}
              >
                <h2 className="display-font text-2xl md:text-3xl font-medium mb-3">
                  {questions[currentStep].question}
                </h2>
                <p
                  className="mb-8"
                  style={{ color: QUIET_LUXURY.textSecondary }}
                >
                  {questions[currentStep].subtext}
                </p>

                <div className="space-y-3">
                  {questions[currentStep].options.map((option) => (
                    <button
                      key={String(option.value)}
                      onClick={() => handleAnswer(questions[currentStep].id, option.value)}
                      className={`option-card w-full text-left ${
                        answers[questions[currentStep].id] === option.value ? 'selected' : ''
                      }`}
                    >
                      <span style={{ color: QUIET_LUXURY.textPrimary }}>
                        {option.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Results */}
        {showResults && results && !showLeadForm && (
          <section className="px-4 py-16 animate-fade-in">
            <div className="max-w-3xl mx-auto">
              {/* Título */}
              <div className="text-center mb-12">
                <p
                  className="text-sm uppercase tracking-wider mb-4"
                  style={{ color: QUIET_LUXURY.gold }}
                >
                  Tu Resultado
                </p>
                <h1 className="display-font text-3xl md:text-4xl font-medium">
                  Calculadora de Días de Libertad
                </h1>
              </div>

              {/* Anillo Visual */}
              <div className="flex justify-center mb-12">
                <div
                  style={{
                    width: '280px',
                    height: '280px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: `conic-gradient(${QUIET_LUXURY.gold} 0% ${results.freedomPercentage}%, ${QUIET_LUXURY.bgCard} ${results.freedomPercentage}% 100%)`,
                    boxShadow: '0 0 60px rgba(212, 175, 55, 0.15)',
                  }}
                >
                  <div
                    style={{
                      width: '240px',
                      height: '240px',
                      background: QUIET_LUXURY.bgDeep,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexDirection: 'column',
                    }}
                  >
                    <span
                      className="display-font"
                      style={{
                        fontSize: '4.5rem',
                        fontWeight: 500,
                        color: QUIET_LUXURY.gold,
                        lineHeight: 1,
                      }}
                    >
                      {results.freedomDays}
                    </span>
                    <span
                      style={{
                        fontSize: '1.1rem',
                        color: QUIET_LUXURY.textSecondary,
                        marginTop: '8px',
                      }}
                    >
                      Días de Libertad
                    </span>
                    <span
                      style={{
                        fontSize: '0.9rem',
                        color: QUIET_LUXURY.textMuted,
                      }}
                    >
                      de 365
                    </span>
                  </div>
                </div>
              </div>

              {/* Mensaje Impactante */}
              <div
                className="p-8 rounded-2xl mb-8 text-center"
                style={{
                  background: QUIET_LUXURY.bgSurface,
                  border: `1px solid ${QUIET_LUXURY.border}`,
                }}
              >
                <h2
                  className="display-font text-2xl md:text-3xl font-medium mb-4"
                  style={{ color: QUIET_LUXURY.gold }}
                >
                  {getMessage().title}
                </h2>
                <p
                  className="text-lg leading-relaxed"
                  style={{ color: QUIET_LUXURY.textSecondary }}
                >
                  {getMessage().body}
                </p>
              </div>

              {/* Datos de Contexto - Solo 2 cards relevantes */}
              <div className="grid md:grid-cols-2 gap-4 mb-10">
                <div
                  className="p-6 rounded-xl text-center"
                  style={{
                    background: QUIET_LUXURY.bgCard,
                    border: `1px solid ${QUIET_LUXURY.border}`,
                  }}
                >
                  <p style={{ color: QUIET_LUXURY.textMuted, fontSize: '0.875rem' }}>
                    Gastos mensuales
                  </p>
                  <p
                    className="display-font text-2xl mt-2"
                    style={{ color: QUIET_LUXURY.textPrimary }}
                  >
                    {formatCurrency(results.monthlyExpenses)}
                  </p>
                </div>
                <div
                  className="p-6 rounded-xl text-center"
                  style={{
                    background: QUIET_LUXURY.bgCard,
                    border: `1px solid ${QUIET_LUXURY.border}`,
                  }}
                >
                  <p style={{ color: QUIET_LUXURY.textMuted, fontSize: '0.875rem' }}>
                    Ingreso pasivo actual
                  </p>
                  <p
                    className="display-font text-2xl mt-2"
                    style={{ color: results.passiveIncome === 0 ? QUIET_LUXURY.textMuted : QUIET_LUXURY.gold }}
                  >
                    {results.passiveIncome === 0 ? '$0' : formatCurrency(results.passiveIncome)}
                  </p>
                </div>
              </div>

              {/* CTA */}
              <div className="text-center">
                <button
                  onClick={() => setShowLeadForm(true)}
                  className="cta-button inline-block"
                  style={{ maxWidth: '400px' }}
                >
                  Quiero cambiar esto
                </button>
                <p
                  className="mt-4 text-sm"
                  style={{ color: QUIET_LUXURY.textMuted }}
                >
                  Descubre cómo construir tu activo en 5 días
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Lead Form */}
        {showLeadForm && (
          <section className="px-4 py-16 animate-fade-in">
            <div className="max-w-md mx-auto">
              <div
                className="p-8 rounded-2xl"
                style={{
                  background: QUIET_LUXURY.bgSurface,
                  border: `1px solid ${QUIET_LUXURY.border}`,
                }}
              >
                <div className="text-center mb-8">
                  <h2 className="display-font text-2xl font-medium mb-3">
                    ¿Listo para cambiar estos números?
                  </h2>
                  <p style={{ color: QUIET_LUXURY.textSecondary }}>
                    En 5 días te muestro cómo construir un activo
                    que trabaje para ti—sin dejar tu trabajo actual.
                  </p>
                </div>

                <form onSubmit={handleLeadSubmit} className="space-y-4">
                  <div>
                    <input
                      type="text"
                      placeholder="Tu nombre"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      required
                      className="input-field"
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      placeholder="Tu email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      required
                      className="input-field"
                    />
                  </div>
                  <div>
                    <input
                      type="tel"
                      placeholder="Tu WhatsApp"
                      value={formData.whatsapp}
                      onChange={(e) => setFormData(prev => ({ ...prev, whatsapp: e.target.value }))}
                      required
                      className="input-field"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="cta-button"
                  >
                    {isSubmitting ? 'Enviando...' : 'Unirme al Reto de 5 Días'}
                  </button>
                </form>

                <p
                  className="text-center text-sm mt-6"
                  style={{ color: QUIET_LUXURY.textMuted }}
                >
                  100% gratis. Sin spam. Puedes salir cuando quieras.
                </p>
              </div>
            </div>
          </section>
        )}
      </div>
    </>
  );
}
