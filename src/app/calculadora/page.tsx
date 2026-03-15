/**
 * Copyright © 2026 CreaTuActivo.com
 * Calculadora de Días de Libertad v3.0 - THE ARCHITECT'S SUITE
 * Protocolo Funnel v4
 *
 * THE ARCHITECT'S SUITE - Bimetallic System v3.0
 * Gold (#E5C279): CTAs, progress bar, highlights
 * Titanium (#94A3B8): Structural elements
 * Semaphore colors for status indicators
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import StrategicNavigation from '@/components/StrategicNavigation';
import SovereignSlider from '@/components/ui/SovereignSlider';

// ============================================================================
// THE ARCHITECT'S SUITE - COLOR PALETTE
// ============================================================================

const COLORS = {
  bg: { main: '#0B0C0C', card: '#16181D' },
  gold: { primary: '#E5C279', hover: '#F59E0B', bronze: '#D97706' },
  text: { primary: '#FFFFFF', main: '#E5E5E5', muted: '#A3A3A3' },
  border: { subtle: 'rgba(229, 194, 121, 0.2)', card: 'rgba(229, 194, 121, 0.1)' },
  // Semáforo
  semaphore: {
    red: '#dc2626',
    redBg: 'rgba(220, 38, 38, 0.15)',
    yellow: '#eab308',
    yellowBg: 'rgba(234, 179, 8, 0.15)',
    green: '#22c55e',
    greenBg: 'rgba(34, 197, 94, 0.15)',
  }
};

// 3 preguntas simplificadas
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
    id: 'savings',
    question: '¿Cuánto tienes ahorrado ahora mismo?',
    subtext: 'Cuentas de ahorro, inversiones líquidas, colchón de emergencia',
    options: [
      { value: 0, label: '$0 - No tengo ahorros' },
      { value: 2000000, label: 'Menos de $2M COP' },
      { value: 5000000, label: '$2M - $8M COP' },
      { value: 15000000, label: '$8M - $20M COP' },
      { value: 40000000, label: 'Más de $20M COP' },
    ],
  },
];

type Step = 'quiz' | 'capture' | 'results';

export default function CalculadoraPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('quiz');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number | string>>({});
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fingerprint = (window as any).FrameworkIAA?.fingerprint || localStorage.getItem('iaa_fingerprint') || null
    const constructorRef = localStorage.getItem('constructor_ref') || null
    fetch('/api/funnel', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        source: 'calculadora',
        step: 'vio_calculadora',
        fingerprint,
        constructor_ref: constructorRef,
      }),
    }).catch(() => {})
  }, [])

  const handleAnswer = (questionId: string, value: number | string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));

    if (currentQuestion < questions.length - 1) {
      setTimeout(() => setCurrentQuestion(prev => prev + 1), 300);
    } else {
      setTimeout(() => setStep('capture'), 300);
    }
  };

  const calculateResults = () => {
    const monthlyExpenses = (answers.monthlyExpenses as number) || 5000000;
    const savings = (answers.savings as number) || 0;

    const freedomDays = monthlyExpenses > 0
      ? Math.floor((savings / monthlyExpenses) * 30)
      : 0;

    return {
      freedomDays,
      savings,
      monthlyExpenses,
      situation: answers.situation as string,
    };
  };

  const submitCapture = async () => {
    if (!formData.email) return;
    setIsSubmitting(true);
    try {
      const results = calculateResults();
      await fetch('/api/funnel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          name: formData.name,
          source: 'calculadora',
          step: 'calculator_completed',
          situation: results.situation,
          monthlyExpenses: results.monthlyExpenses,
          savings: results.savings,
          freedomDays: results.freedomDays,
          constructor_ref: localStorage.getItem('constructor_ref') || undefined,
        }),
      });
    } catch (error) {
      console.error('Error:', error);
    }
    setIsSubmitting(false);
    setStep('results');
  };

  const handleCapture = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitCapture();
  };

  const results = step === 'results' ? calculateResults() : null;

  const getSemaphoreColor = (days: number) => {
    if (days < 30) return {
      color: COLORS.semaphore.red,
      bg: COLORS.semaphore.redBg,
      label: 'Zona de Peligro',
      emoji: '🔴'
    };
    if (days < 180) return {
      color: COLORS.semaphore.yellow,
      bg: COLORS.semaphore.yellowBg,
      label: 'Estabilidad Falsa',
      emoji: '🟡'
    };
    return {
      color: COLORS.semaphore.green,
      bg: COLORS.semaphore.greenBg,
      label: 'Listo para Invertir',
      emoji: '🟢'
    };
  };

  const getMessage = (days: number) => {
    if (days === 0) {
      return {
        title: 'Dependes 100% de tu trabajo.',
        body: 'Si mañana no puedes trabajar—por enfermedad, despido, o cualquier imprevisto—no tienes ni un solo día de respaldo.',
      };
    } else if (days < 30) {
      return {
        title: `Solo ${days} días de respaldo.`,
        body: 'Menos de un mes. Una emergencia, una reestructuración, y tu situación cambia completamente.',
      };
    } else if (days < 90) {
      return {
        title: `${days} días. Algo es algo.`,
        body: 'Tienes algo construido, pero aún estás lejos de la libertad real. ¿Qué pasaría si pudieras duplicar este número en 12 meses?',
      };
    } else if (days < 180) {
      return {
        title: `${days} días. Vas por buen camino.`,
        body: 'Ya entiendes el concepto. La pregunta es: ¿cómo aceleras para llegar a 365 días de soberanía total?',
      };
    } else {
      return {
        title: `${days} días. Impresionante.`,
        body: 'Estás más cerca que el 99% de las personas. Con el sistema correcto, podrías alcanzar soberanía completa.',
      };
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <>
      <StrategicNavigation />

      <div
        className="min-h-screen pt-8"
        style={{
          backgroundImage: `
            linear-gradient(rgba(12,12,12,0.70), rgba(12,12,12,0.70)),
            url('/images/servilleta/fondo-global-hormigon.jpg?v=20260208')
          `,
          backgroundSize: 'cover, 600px 600px',
          backgroundRepeat: 'no-repeat, repeat',
          backgroundAttachment: 'scroll, scroll',
          color: COLORS.text.main,
          fontFamily: "var(--font-montserrat), 'Montserrat', sans-serif",
        }}
      >
        {/* Progress Bar */}
        {step === 'quiz' && (
          <div className="max-w-2xl mx-auto px-4 mb-8">
            <div
              className="h-1  overflow-hidden"
              style={{
                backgroundColor: COLORS.bg.card,
                clipPath: 'polygon(2px 0, 100% 0, 100% calc(100% - 2px), calc(100% - 2px) 100%, 0 100%, 0 2px)',
              }}
            >
              <div
                className="h-full transition-all duration-500"
                style={{
                  backgroundColor: COLORS.gold.primary,
                  width: `${((currentQuestion + 1) / questions.length) * 100}%`,
                }}
              />
            </div>
            <p
              className="text-sm mt-2 text-center"
              style={{ color: COLORS.text.muted }}
            >
              Pregunta {currentQuestion + 1} de {questions.length}
            </p>
          </div>
        )}

        {/* QUIZ STEP */}
        {step === 'quiz' && (
          <section className="px-4 pb-16 animate-fade-in" key={currentQuestion}>
            <div className="max-w-2xl mx-auto">
              <div
                className="p-8 "
                style={{
                  backgroundColor: COLORS.bg.card,
                  border: `1px solid ${COLORS.border.card}`,
                  clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)',
                }}
              >
                <h2
                  className="text-2xl md:text-3xl font-medium mb-3 font-serif"
                  style={{ color: COLORS.text.primary }}
                >
                  {questions[currentQuestion].question}
                </h2>
                <p
                  className="mb-8"
                  style={{ color: COLORS.text.muted }}
                >
                  {questions[currentQuestion].subtext}
                </p>

                <div className="space-y-3">
                  {questions[currentQuestion].options.map((option) => (
                    <button
                      key={String(option.value)}
                      onClick={() => handleAnswer(questions[currentQuestion].id, option.value)}
                      className="w-full text-left p-4  transition-all duration-300 hover:translate-x-1"
                      style={{
                        backgroundColor: COLORS.bg.main,
                        border: `1px solid ${answers[questions[currentQuestion].id] === option.value ? COLORS.gold.primary : COLORS.border.card}`,
                        color: COLORS.text.main,
                        clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)',
                      }}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* CAPTURE STEP */}
        {step === 'capture' && (
          <section className="px-4 py-16 animate-fade-in">
            <div className="max-w-md mx-auto text-center">
              <div
                className="w-20 h-20  flex items-center justify-center mx-auto mb-8"
                style={{
                  backgroundColor: 'rgba(229, 194, 121, 0.1)',
                  clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)',
                }}
              >
                <svg
                  className="w-10 h-10"
                  style={{ color: COLORS.gold.primary }}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
              </div>

              <h2
                className="text-2xl sm:text-3xl mb-4 font-serif"
                style={{ color: COLORS.text.primary }}
              >
                Tu diagnóstico está listo
              </h2>

              <p
                className="text-lg mb-8"
                style={{ color: COLORS.text.muted }}
              >
                ¿A dónde enviamos tu reporte de libertad y el plan de acción?
              </p>

              <form
                onSubmit={handleCapture}
                className="space-y-4"
                style={{
                  backgroundColor: COLORS.bg.card,
                  border: `1px solid ${COLORS.border.card}`,
                  padding: '24px',
                  clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)',
                }}
              >
                <input
                  type="text"
                  placeholder="Tu nombre"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-5 py-4  focus:outline-none transition-all duration-300"
                  style={{
                    backgroundColor: COLORS.bg.main,
                    border: `1px solid ${COLORS.border.card}`,
                    color: COLORS.text.main,
                    clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)',
                  }}
                />
                <input
                  type="email"
                  placeholder="Tu email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  required
                  className="w-full px-5 py-4  focus:outline-none transition-all duration-300"
                  style={{
                    backgroundColor: COLORS.bg.main,
                    border: `1px solid ${COLORS.border.card}`,
                    color: COLORS.text.main,
                    clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)',
                  }}
                />
                <SovereignSlider
                  label="DESLIZAR PARA VER RESULTADO"
                  onComplete={submitCapture}
                  disabled={!formData.email || isSubmitting}
                  accentColor="gold"
                />
              </form>

              <p
                className="text-sm mt-6"
                style={{ color: COLORS.text.muted }}
              >
                Tus datos están protegidos. Sin spam.
              </p>
            </div>
          </section>
        )}

        {/* RESULTS STEP */}
        {step === 'results' && results && (
          <section className="px-4 py-16 animate-fade-in">
            <div className="max-w-3xl mx-auto">
              {/* Título */}
              <div className="text-center mb-12">
                <p
                  className="text-sm uppercase tracking-wider mb-4"
                  style={{ color: COLORS.gold.primary }}
                >
                  Tu Resultado
                </p>
                <h1
                  className="text-3xl md:text-4xl font-medium font-serif"
                  style={{ color: COLORS.text.primary }}
                >
                  Días de Libertad
                </h1>
              </div>

              {/* Resultado con Semáforo */}
              {(() => {
                const semaphore = getSemaphoreColor(results.freedomDays);
                const message = getMessage(results.freedomDays);

                return (
                  <>
                    {/* Número grande con color semafórico */}
                    <div
                      className="text-center p-10  mb-8"
                      style={{
                        backgroundColor: semaphore.bg,
                        border: `2px solid ${semaphore.color}`,
                        clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)',
                      }}
                    >
                      <div className="text-6xl mb-2">{semaphore.emoji}</div>
                      <span
                        className="text-7xl md:text-8xl font-bold font-serif"
                        style={{ color: semaphore.color }}
                      >
                        {results.freedomDays}
                      </span>
                      <p
                        className="text-xl mt-2"
                        style={{ color: COLORS.text.muted }}
                      >
                        Días de Libertad
                      </p>
                      <p
                        className="text-lg font-semibold mt-4"
                        style={{ color: semaphore.color }}
                      >
                        {semaphore.label}
                      </p>
                    </div>

                    {/* Mensaje */}
                    <div
                      className="p-8  mb-8 text-center"
                      style={{
                        backgroundColor: COLORS.bg.card,
                        border: `1px solid ${COLORS.border.card}`,
                        clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)',
                      }}
                    >
                      <h2
                        className="text-2xl md:text-3xl font-medium mb-4 font-serif"
                        style={{ color: COLORS.text.primary }}
                      >
                        {message.title}
                      </h2>
                      <p
                        className="text-lg leading-relaxed"
                        style={{ color: COLORS.text.muted }}
                      >
                        {message.body}
                      </p>
                    </div>

                    {/* Datos de contexto */}
                    <div className="grid md:grid-cols-2 gap-4 mb-10">
                      <div
                        className="p-6  text-center"
                        style={{
                          backgroundColor: COLORS.bg.card,
                          border: `1px solid ${COLORS.border.card}`,
                          clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)',
                        }}
                      >
                        <p style={{ color: COLORS.text.muted, fontSize: '0.875rem' }}>
                          Ahorros actuales
                        </p>
                        <p
                          className="text-2xl mt-2 font-serif"
                          style={{
                            color: results.savings === 0 ? COLORS.text.muted : COLORS.text.primary,
                          }}
                        >
                          {results.savings === 0 ? '$0' : formatCurrency(results.savings)}
                        </p>
                      </div>
                      <div
                        className="p-6  text-center"
                        style={{
                          backgroundColor: COLORS.bg.card,
                          border: `1px solid ${COLORS.border.card}`,
                          clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)',
                        }}
                      >
                        <p style={{ color: COLORS.text.muted, fontSize: '0.875rem' }}>
                          Gastos mensuales
                        </p>
                        <p
                          className="text-2xl mt-2 font-serif"
                          style={{ color: COLORS.text.primary }}
                        >
                          {formatCurrency(results.monthlyExpenses)}
                        </p>
                      </div>
                    </div>

                    {/* CTA Final */}
                    <div className="text-center">
                      <p
                        className="text-lg mb-6"
                        style={{ color: COLORS.text.muted }}
                      >
                        ¿Listo para reescribir esta matemática?
                      </p>

                      <SovereignSlider
                        label="DESLIZAR PARA OBTENER MAPA DE SALIDA"
                        onComplete={() => router.push('/mapa-de-salida')}
                        accentColor="cyan"
                      />

                      <p
                        className="mt-6 text-sm"
                        style={{ color: COLORS.text.muted }}
                      >
                        Auditoría 100% gratuita. Traza tu ruta de escape del &ldquo;Plan por Defecto&rdquo;.
                      </p>
                    </div>
                  </>
                );
              })()}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
