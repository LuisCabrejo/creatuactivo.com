/**
 * Copyright © 2025 CreaTuActivo.com
 * Calculadora de Libertad - Lead Magnet Principal
 * Funnel: Tope del embudo para captura de leads
 */

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import StrategicNavigation from '@/components/StrategicNavigation';

// 🎨 Quiet Luxury Color Palette
const QUIET_LUXURY = {
  gold: '#D4AF37',
  goldMuted: '#C9A962',
  goldDark: '#B8962F',
  bgDeep: '#0a0a0f',
  bgSurface: '#12121a',
  bgCard: '#1a1a24',
  textPrimary: '#f5f5f5',
  textSecondary: '#a0a0a8',
  textMuted: '#6b6b75',
};

// Tipos para las respuestas
interface Answers {
  income: number;
  hoursPerWeek: number;
  commuteMinutes: number;
  stressLevel: number;
  jobSecurity: number;
  yearsToRetirement: number;
  name: string;
  email: string;
  whatsapp: string;
}

// Preguntas del quiz
const questions = [
  {
    id: 'income',
    question: '¿Cuál es tu ingreso mensual aproximado?',
    subtext: 'Esto nos ayuda a calcular el costo de oportunidad de tu tiempo',
    type: 'select',
    options: [
      { value: 3000000, label: '$2M - $4M COP' },
      { value: 6000000, label: '$4M - $8M COP' },
      { value: 12000000, label: '$8M - $15M COP' },
      { value: 20000000, label: '$15M - $25M COP' },
      { value: 35000000, label: 'Más de $25M COP' },
    ],
  },
  {
    id: 'hoursPerWeek',
    question: '¿Cuántas horas trabajas a la semana?',
    subtext: 'Incluye reuniones, emails fuera de horario y trabajo en casa',
    type: 'select',
    options: [
      { value: 40, label: '40 horas (horario estándar)' },
      { value: 50, label: '45-50 horas' },
      { value: 55, label: '50-60 horas' },
      { value: 65, label: '60-70 horas' },
      { value: 75, label: 'Más de 70 horas' },
    ],
  },
  {
    id: 'commuteMinutes',
    question: '¿Cuánto tiempo gastas en transporte al día?',
    subtext: 'Ida y vuelta al trabajo, incluyendo tráfico',
    type: 'select',
    options: [
      { value: 30, label: 'Menos de 30 minutos' },
      { value: 60, label: '30-60 minutos' },
      { value: 90, label: '1-1.5 horas' },
      { value: 120, label: '1.5-2 horas' },
      { value: 180, label: 'Más de 2 horas' },
    ],
  },
  {
    id: 'stressLevel',
    question: '¿Qué tan estresado te sientes regularmente?',
    subtext: 'Sé honesto contigo mismo',
    type: 'select',
    options: [
      { value: 2, label: 'Tranquilo - Manejo bien la presión' },
      { value: 4, label: 'Moderado - Algunos días difíciles' },
      { value: 6, label: 'Estresado - Frecuentemente agotado' },
      { value: 8, label: 'Muy estresado - Afecta mi salud' },
      { value: 10, label: 'Quemado - Necesito un cambio urgente' },
    ],
  },
  {
    id: 'jobSecurity',
    question: '¿Qué tan seguro te sientes en tu trabajo?',
    subtext: 'Piensa en los próximos 2-3 años',
    type: 'select',
    options: [
      { value: 10, label: 'Muy seguro - Indispensable' },
      { value: 7, label: 'Bastante seguro - Buen desempeño' },
      { value: 5, label: 'Neutral - Podría pasar cualquier cosa' },
      { value: 3, label: 'Inseguro - Reestructuraciones posibles' },
      { value: 1, label: 'Muy inseguro - Siempre preocupado' },
    ],
  },
  {
    id: 'yearsToRetirement',
    question: '¿Cuántos años te faltan para "jubilarte"?',
    subtext: 'O para alcanzar libertad financiera',
    type: 'select',
    options: [
      { value: 10, label: 'Menos de 10 años' },
      { value: 20, label: '10-20 años' },
      { value: 30, label: '20-30 años' },
      { value: 40, label: 'Más de 30 años' },
      { value: 0, label: 'No tengo idea / Nunca' },
    ],
  },
];

export default function CalculadoraPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<Answers>>({});
  const [showResults, setShowResults] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', whatsapp: '' });

  const handleAnswer = (questionId: string, value: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));

    if (currentStep < questions.length - 1) {
      setTimeout(() => setCurrentStep(prev => prev + 1), 300);
    } else {
      setTimeout(() => setShowResults(true), 300);
    }
  };

  const calculateResults = () => {
    const income = answers.income || 6000000;
    const hoursPerWeek = answers.hoursPerWeek || 50;
    const commuteMinutes = answers.commuteMinutes || 60;
    const stressLevel = answers.stressLevel || 5;
    const jobSecurity = answers.jobSecurity || 5;
    const yearsToRetirement = answers.yearsToRetirement || 25;

    // Cálculos
    const hourlyRate = income / (hoursPerWeek * 4);
    const commuteHoursPerMonth = (commuteMinutes / 60) * 22;
    const commuteCostPerMonth = commuteHoursPerMonth * hourlyRate;
    const overtimeHours = Math.max(0, hoursPerWeek - 40) * 4;
    const overtimeCost = overtimeHours * hourlyRate;

    // Costo del estrés (días de salud perdidos estimados)
    const stressDaysLost = stressLevel * 2; // días por año
    const stressCost = (stressDaysLost / 22) * income;

    // Costo de inseguridad (ahorro de emergencia necesario)
    const securityCost = (10 - jobSecurity) * income * 0.1;

    // Techo salarial (proyección estancada)
    const ceilingCost = income * 0.15 * yearsToRetirement; // 15% de crecimiento perdido

    // Total anual
    const monthlyTotalCost = commuteCostPerMonth + overtimeCost + (stressCost / 12) + (securityCost / 12);
    const yearlyTotalCost = monthlyTotalCost * 12;

    // Freedom Score (0-100)
    const freedomScore = Math.max(0, Math.min(100,
      100 - (stressLevel * 5) - (10 - jobSecurity) * 3 - Math.min(30, (hoursPerWeek - 40) * 2)
    ));

    // Años de vida laboral perdidos
    const yearsLost = Math.round((commuteHoursPerMonth * 12 * yearsToRetirement) / (365 * 8));

    return {
      hourlyRate,
      commuteHoursPerMonth,
      commuteCostPerMonth,
      overtimeCost,
      stressCost,
      monthlyTotalCost,
      yearlyTotalCost,
      freedomScore,
      yearsLost,
      ceilingCost,
      yearsToRetirement,
    };
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Aquí iría la integración con Supabase para guardar el lead
    // Por ahora simulamos un delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Redirigir al siguiente paso del funnel
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

        .gold-gradient {
          background: linear-gradient(135deg, ${QUIET_LUXURY.gold} 0%, ${QUIET_LUXURY.goldMuted} 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
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

        .result-card {
          background: ${QUIET_LUXURY.bgCard};
          border: 1px solid rgba(212, 175, 55, 0.15);
          border-radius: 16px;
          padding: 24px;
        }

        .freedom-meter {
          height: 12px;
          background: ${QUIET_LUXURY.bgSurface};
          border-radius: 6px;
          overflow: hidden;
        }

        .freedom-fill {
          height: 100%;
          border-radius: 6px;
          transition: width 1s ease;
        }

        .input-field {
          width: 100%;
          background: ${QUIET_LUXURY.bgSurface};
          border: 1px solid rgba(212, 175, 55, 0.2);
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

        @keyframes countUp {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-count {
          animation: countUp 0.3s ease forwards;
        }
      `}</style>

      <div className="calculator-container">
        {/* Hero Section - Solo visible al inicio */}
        {currentStep === 0 && !showResults && (
          <section className="pt-16 pb-12 px-4 animate-fade-in">
            <div className="max-w-3xl mx-auto text-center">
              <p
                className="text-sm uppercase tracking-wider mb-4"
                style={{ color: QUIET_LUXURY.gold }}
              >
                Herramienta Gratuita
              </p>
              <h1 className="display-font text-4xl md:text-5xl lg:text-6xl font-medium mb-6">
                ¿Cuánto te cuesta{' '}
                <span className="gold-gradient">realmente</span>{' '}
                tu empleo?
              </h1>
              <p
                className="text-lg md:text-xl mb-8 max-w-2xl mx-auto"
                style={{ color: QUIET_LUXURY.textSecondary }}
              >
                No hablamos solo de dinero. Descubre el costo oculto en tiempo,
                salud y libertad que pagas cada mes.
              </p>
              <p
                className="text-sm mb-12"
                style={{ color: QUIET_LUXURY.textMuted }}
              >
                6 preguntas · 2 minutos · 100% confidencial
              </p>
            </div>
          </section>
        )}

        {/* Quiz Section */}
        {!showResults && (
          <section className="pb-20 px-4">
            <div className="max-w-xl mx-auto">
              {/* Progress Bar */}
              <div className="mb-8">
                <div className="flex justify-between text-sm mb-2" style={{ color: QUIET_LUXURY.textMuted }}>
                  <span>Pregunta {currentStep + 1} de {questions.length}</span>
                  <span>{Math.round(((currentStep + 1) / questions.length) * 100)}%</span>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Current Question */}
              <div key={currentStep} className="animate-fade-in">
                <h2
                  className="display-font text-2xl md:text-3xl font-medium mb-3"
                  style={{ color: QUIET_LUXURY.textPrimary }}
                >
                  {questions[currentStep].question}
                </h2>
                <p
                  className="mb-8"
                  style={{ color: QUIET_LUXURY.textMuted }}
                >
                  {questions[currentStep].subtext}
                </p>

                {/* Options */}
                <div className="space-y-3">
                  {questions[currentStep].options.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleAnswer(questions[currentStep].id, option.value)}
                      className={`option-card w-full text-left ${
                        answers[questions[currentStep].id as keyof Answers] === option.value ? 'selected' : ''
                      }`}
                    >
                      <span style={{ color: QUIET_LUXURY.textPrimary }}>
                        {option.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Back Button */}
              {currentStep > 0 && (
                <button
                  onClick={() => setCurrentStep(prev => prev - 1)}
                  className="mt-8 text-sm flex items-center gap-2 transition-colors"
                  style={{ color: QUIET_LUXURY.textMuted }}
                  onMouseEnter={(e) => e.currentTarget.style.color = QUIET_LUXURY.gold}
                  onMouseLeave={(e) => e.currentTarget.style.color = QUIET_LUXURY.textMuted}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Pregunta anterior
                </button>
              )}
            </div>
          </section>
        )}

        {/* Results Section */}
        {showResults && results && !showLeadForm && (
          <section className="py-12 px-4 animate-fade-in">
            <div className="max-w-3xl mx-auto">
              {/* Main Result */}
              <div className="text-center mb-12">
                <p
                  className="text-sm uppercase tracking-wider mb-4"
                  style={{ color: QUIET_LUXURY.gold }}
                >
                  Tu Resultado
                </p>
                <h2 className="display-font text-3xl md:text-4xl font-medium mb-6">
                  Tu empleo te cuesta
                </h2>
                <div
                  className="display-font text-5xl md:text-7xl font-bold mb-4 animate-count"
                  style={{ color: QUIET_LUXURY.gold }}
                >
                  {formatCurrency(results.yearlyTotalCost)}
                </div>
                <p
                  className="text-xl"
                  style={{ color: QUIET_LUXURY.textSecondary }}
                >
                  al año en libertad perdida
                </p>
              </div>

              {/* Freedom Score */}
              <div className="result-card mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="display-font text-xl">Tu Índice de Libertad</h3>
                  <span
                    className="text-3xl font-bold"
                    style={{
                      color: results.freedomScore < 40
                        ? '#ef4444'
                        : results.freedomScore < 70
                        ? QUIET_LUXURY.goldMuted
                        : '#22c55e'
                    }}
                  >
                    {results.freedomScore}/100
                  </span>
                </div>
                <div className="freedom-meter">
                  <div
                    className="freedom-fill"
                    style={{
                      width: `${results.freedomScore}%`,
                      background: results.freedomScore < 40
                        ? 'linear-gradient(90deg, #ef4444, #f87171)'
                        : results.freedomScore < 70
                        ? `linear-gradient(90deg, ${QUIET_LUXURY.goldMuted}, ${QUIET_LUXURY.gold})`
                        : 'linear-gradient(90deg, #22c55e, #4ade80)'
                    }}
                  />
                </div>
                <p
                  className="mt-4 text-sm"
                  style={{ color: QUIET_LUXURY.textMuted }}
                >
                  {results.freedomScore < 40
                    ? 'Tu situación laboral está consumiendo gran parte de tu libertad. Es momento de considerar alternativas.'
                    : results.freedomScore < 70
                    ? 'Tienes cierta libertad, pero hay espacio significativo para mejorar tu calidad de vida.'
                    : 'Estás en buena posición, pero siempre hay formas de optimizar tu tiempo y recursos.'
                  }
                </p>
              </div>

              {/* Breakdown */}
              <div className="grid md:grid-cols-2 gap-4 mb-8">
                <div className="result-card">
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ background: 'rgba(212, 175, 55, 0.1)' }}
                    >
                      <svg className="w-5 h-5" style={{ color: QUIET_LUXURY.gold }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h4 style={{ color: QUIET_LUXURY.textSecondary }}>Tiempo en Transporte</h4>
                  </div>
                  <p className="display-font text-2xl" style={{ color: QUIET_LUXURY.gold }}>
                    {Math.round(results.commuteHoursPerMonth)} horas/mes
                  </p>
                  <p className="text-sm mt-1" style={{ color: QUIET_LUXURY.textMuted }}>
                    = {formatCurrency(results.commuteCostPerMonth)} en valor de tu tiempo
                  </p>
                </div>

                <div className="result-card">
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ background: 'rgba(212, 175, 55, 0.1)' }}
                    >
                      <svg className="w-5 h-5" style={{ color: QUIET_LUXURY.gold }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <h4 style={{ color: QUIET_LUXURY.textSecondary }}>Costo del Estrés</h4>
                  </div>
                  <p className="display-font text-2xl" style={{ color: QUIET_LUXURY.gold }}>
                    {formatCurrency(results.stressCost)}/año
                  </p>
                  <p className="text-sm mt-1" style={{ color: QUIET_LUXURY.textMuted }}>
                    En salud y productividad perdida
                  </p>
                </div>

                <div className="result-card">
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ background: 'rgba(212, 175, 55, 0.1)' }}
                    >
                      <svg className="w-5 h-5" style={{ color: QUIET_LUXURY.gold }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    </div>
                    <h4 style={{ color: QUIET_LUXURY.textSecondary }}>Techo Salarial</h4>
                  </div>
                  <p className="display-font text-2xl" style={{ color: QUIET_LUXURY.gold }}>
                    {formatCurrency(results.ceilingCost)}
                  </p>
                  <p className="text-sm mt-1" style={{ color: QUIET_LUXURY.textMuted }}>
                    Crecimiento limitado en {results.yearsToRetirement} años
                  </p>
                </div>

                <div className="result-card">
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ background: 'rgba(212, 175, 55, 0.1)' }}
                    >
                      <svg className="w-5 h-5" style={{ color: QUIET_LUXURY.gold }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h4 style={{ color: QUIET_LUXURY.textSecondary }}>Años de Vida</h4>
                  </div>
                  <p className="display-font text-2xl" style={{ color: QUIET_LUXURY.gold }}>
                    {results.yearsLost} años
                  </p>
                  <p className="text-sm mt-1" style={{ color: QUIET_LUXURY.textMuted }}>
                    Perdidos solo en transporte
                  </p>
                </div>
              </div>

              {/* The Villain Section */}
              <div
                className="result-card mb-8 text-center"
                style={{ background: 'rgba(239, 68, 68, 0.05)', borderColor: 'rgba(239, 68, 68, 0.2)' }}
              >
                <h3 className="display-font text-xl mb-4" style={{ color: '#f87171' }}>
                  Esto se llama "El Plan por Defecto"
                </h3>
                <p style={{ color: QUIET_LUXURY.textSecondary }}>
                  Trabajar → Pagar cuentas → Repetir... hasta jubilarte con el 30% de tu salario.
                  <br />
                  <span style={{ color: QUIET_LUXURY.textMuted }}>
                    La buena noticia: existe otra forma.
                  </span>
                </p>
              </div>

              {/* CTA */}
              <div className="text-center">
                <button
                  onClick={() => setShowLeadForm(true)}
                  className="cta-button"
                >
                  Ver Cómo Cambiar Este Resultado
                </button>
                <p
                  className="mt-4 text-sm"
                  style={{ color: QUIET_LUXURY.textMuted }}
                >
                  Descubre el sistema que usan profesionales para construir ingresos paralelos
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Lead Capture Form */}
        {showLeadForm && (
          <section className="py-12 px-4 animate-fade-in">
            <div className="max-w-md mx-auto">
              <div className="text-center mb-8">
                <div
                  className="w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center"
                  style={{ background: QUIET_LUXURY.gold }}
                >
                  <svg className="w-8 h-8" style={{ color: QUIET_LUXURY.bgDeep }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h2 className="display-font text-2xl md:text-3xl font-medium mb-4">
                  Te enviaremos tu{' '}
                  <span style={{ color: QUIET_LUXURY.gold }}>Plan de Escape</span>
                </h2>
                <p style={{ color: QUIET_LUXURY.textSecondary }}>
                  Incluye acceso al Reto de 5 Días donde aprenderás a construir
                  tu primer activo digital.
                </p>
              </div>

              <form onSubmit={handleLeadSubmit} className="space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder="Tu nombre"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="input-field"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    placeholder="Tu email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="input-field"
                  />
                </div>
                <div>
                  <input
                    type="tel"
                    placeholder="Tu WhatsApp (opcional)"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData(prev => ({ ...prev, whatsapp: e.target.value }))}
                    className="input-field"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="cta-button w-full flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Procesando...
                    </>
                  ) : (
                    <>
                      Quiero Mi Plan de Escape
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </>
                  )}
                </button>
              </form>

              <p
                className="text-center text-xs mt-6"
                style={{ color: QUIET_LUXURY.textMuted }}
              >
                Al continuar, aceptas recibir información sobre cómo construir activos digitales.
                <br />
                Puedes cancelar en cualquier momento.
              </p>
            </div>
          </section>
        )}

        {/* Footer */}
        <footer
          className="py-8 px-4 text-center"
          style={{ borderTop: `1px solid ${QUIET_LUXURY.bgCard}` }}
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 transition-opacity hover:opacity-80"
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: QUIET_LUXURY.gold }}
            >
              <span
                className="font-bold text-sm"
                style={{
                  fontFamily: 'Georgia, serif',
                  color: QUIET_LUXURY.bgDeep
                }}
              >
                C
              </span>
            </div>
            <span style={{ color: QUIET_LUXURY.textSecondary }}>
              Crea<span style={{ color: QUIET_LUXURY.gold }}>Tu</span>Activo
            </span>
          </Link>
          <p
            className="mt-4 text-sm"
            style={{ color: QUIET_LUXURY.textMuted }}
          >
            © 2025 CreaTuActivo.com · Todos los derechos reservados
          </p>
        </footer>
      </div>
    </>
  );
}
