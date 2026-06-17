/**
 * Copyright © 2026 CreaTuActivo.com
 * Diagnóstico financiero — Landing Page (Quiz Funnel)
 * Registro accesible latino (jun 2026): eje "seguridad financiera de su casa",
 * presente/ciclo, usted parejo, sin jerga ni etiquetas que ataquen identidad.
 * SIN navegación - Enfoque total en conversión.
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import RadarChart from '@/components/RadarChart';

// ============================================================================
// TYPES
// ============================================================================

type QuizStep = 'hero' | 'quiz' | 'capture' | 'result';

interface QuizAnswers {
  autonomia: number;
  resiliencia: number;
  eficiencia: number;
  apalancamiento: number;
  pazMental: number;
}

interface CaptureData {
  nombre: string;
  email: string;
  countryCode: string;
  phoneNumber: string;
}

// ============================================================================
// CSS VARIABLES
// ============================================================================

// Variables locales del quiz redirigidas a tokens del Sistema (Lujo Silencioso v1.0).
// Las fuentes Playfair + Inter ya las carga next/font en layout.tsx — sin @import.
const styles = `
  :root {
    --gold: var(--color-brand);
    --gold-light: var(--color-brand-hover);
    --gold-dark: var(--color-brand-muted);
    --gold-muted: var(--color-text-muted);

    --bg-deep: var(--color-bg-primary);
    --bg-surface: var(--color-bg-elevated);
    --bg-card: var(--color-bg-elevated);
    --bg-elevated: var(--color-bg-surface);

    --text-primary: var(--color-text-body);
    --text-secondary: var(--color-text-muted);
    --text-muted: rgba(255, 255, 255, 0.4);

    --border: rgba(197, 160, 89, 0.2);
    --border-subtle: rgba(197, 160, 89, 0.1);

    --font-display: var(--font-serif);
    --font-body: var(--font-sans);
  }

  .quiz-option {
    transition: all 0.3s ease;
  }
  .quiz-option:hover {
    transform: translateX(4px);
    border-color: var(--gold);
  }
  .quiz-option.selected {
    border-color: var(--gold);
    background: rgba(197, 160, 89, 0.1);
  }
`;

// ============================================================================
// QUIZ DATA
// ============================================================================

const quizQuestions = [
  {
    id: 'autonomia',
    question: 'Si tuviera que parar unos meses —por salud, un despido o un imprevisto—, ¿qué pasaría con la plata que entra a su casa?',
    options: [
      { value: 10, label: 'Se acaba de una', sublabel: 'Todo depende de que yo siga trabajando' },
      { value: 50, label: 'Aguanta un tiempo y baja', sublabel: 'Tengo algo de colchón, pero no dura' },
      { value: 100, label: 'Sigue entrando sin mí', sublabel: 'Ya tengo algo que produce aunque yo no esté' },
    ],
  },
  {
    id: 'resiliencia',
    question: '¿Siente que vive en el ciclo de trabajar, pagar cuentas y volver a empezar?',
    options: [
      { value: 10, label: 'Sí, todos los meses', sublabel: 'Trabajo, pago, y al otro mes arranco de cero' },
      { value: 50, label: 'A veces', sublabel: 'Algunos meses respiro, otros no' },
      { value: 100, label: 'Ya no', sublabel: 'Lo que construí me sacó de ese ciclo' },
    ],
  },
  {
    id: 'eficiencia',
    question: 'Al final del año, cuando mira todo lo que ganó y lo que de verdad le quedó, ¿cómo se siente?',
    options: [
      { value: 20, label: 'Frustrado', sublabel: 'La plata entra y se va; soy solo el puente por donde pasa' },
      { value: 50, label: 'Conforme', sublabel: 'Algo guardo, pero no lo suficiente para cambiar nada' },
      { value: 90, label: 'Tranquilo', sublabel: 'Lo que gané se quedó y sigue ahí' },
    ],
  },
  {
    id: 'apalancamiento',
    question: 'Para ganar el doble, ¿tendría que trabajar el doble?',
    options: [
      { value: 20, label: 'Sí, así es', sublabel: 'Más plata significa más horas mías' },
      { value: 50, label: 'Más o menos', sublabel: 'Tengo ayuda, pero todo sigue pasando por mí' },
      { value: 90, label: 'No', sublabel: 'Lo que construí puede crecer sin que yo meta más horas' },
    ],
  },
  {
    id: 'pazMental',
    question: 'Pensando en el dinero, ¿con cuánta tranquilidad duerme hoy?',
    options: [
      { value: 20, label: 'Poca', sublabel: 'Vivo con el estrés del dinero casi siempre' },
      { value: 50, label: 'Más o menos', sublabel: 'Hay meses buenos y meses de angustia' },
      { value: 80, label: 'Buena', sublabel: 'Me siento bastante seguro' },
      { value: 100, label: 'Total', sublabel: 'Duermo tranquilo; lo financiero no me quita el sueño' },
    ],
  },
];

// ============================================================================
// DIAGNÓSTICO (Queswa genera el texto; este es el fallback determinístico)
// ============================================================================

type Diagnostico = { titular: string; cuerpo: string };

// Nombre descriptivo de cada dimensión para el prompt de Queswa.
const DIM_PROMPT: Record<keyof QuizAnswers, string> = {
  autonomia: 'Independencia (que su ingreso no dependa solo de usted)',
  resiliencia: 'Salir del ciclo de trabajar, pagar y repetir',
  eficiencia: 'Lo que le queda al final del año',
  apalancamiento: 'Poder crecer sin meter más horas',
  pazMental: 'Su tranquilidad con el dinero',
};

// Frase corta de cada dimensión cuando es el punto MÁS frágil (para el fallback).
const DIM_DEBIL: Record<keyof QuizAnswers, string> = {
  autonomia: 'que su ingreso no dependa solo de usted',
  resiliencia: 'salir del ciclo de trabajar, pagar y repetir',
  eficiencia: 'que al final del año le quede algo',
  apalancamiento: 'poder crecer sin meter más horas',
  pazMental: 'dormir tranquilo con el dinero',
};

// Fallback determinístico (si Queswa no responde): titular por nivel + su punto más frágil real.
function fallbackDiagnostico(answers: QuizAnswers, nombre: string): Diagnostico {
  const primer = (nombre || '').trim().split(' ')[0];
  const saludo = primer ? `${primer}, ` : '';
  const entries = (Object.keys(answers) as (keyof QuizAnswers)[]).map((k) => [k, answers[k]] as const);
  const avg = entries.reduce((a, [, v]) => a + v, 0) / entries.length;
  const weakest = entries.reduce((a, b) => (b[1] < a[1] ? b : a));

  let titular: string;
  let primera: string;
  if (avg <= 35) {
    titular = 'Hoy todo depende de usted';
    primera = `${saludo}sus respuestas muestran que, por ahora, la economía de su casa descansa entera sobre sus hombros. No es falta de esfuerzo; es cómo está armado el juego hoy.`;
  } else if (avg <= 65) {
    titular = 'Ya empezó a construir';
    primera = `${saludo}va por buen camino: tiene piezas en su lugar, aunque todavía no la tranquilidad completa.`;
  } else {
    titular = 'Ya tiene una base firme';
    primera = `${saludo}lo está haciendo bien: su economía hoy no depende solo de usted.`;
  }

  const cuerpo = `${primera}\n\nSu punto más frágil hoy es ${DIM_DEBIL[weakest[0]]}. Ahí es donde más se siente la presión — y es justo lo que se puede corregir.\n\nEso es lo que trabajamos, paso a paso, en el Diagnóstico de 5 Días que ya va en camino a su correo.`;
  return { titular, cuerpo };
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function DiagnosticoPage() {
  const [step, setStep] = useState<QuizStep>('hero');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>({
    autonomia: 0,
    resiliencia: 0,
    eficiencia: 0,
    apalancamiento: 0,
    pazMental: 0,
  });
  const [captureData, setCaptureData] = useState<CaptureData>({ nombre: '', email: '', countryCode: '+57', phoneNumber: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [interpretacion, setInterpretacion] = useState<Diagnostico | null>(null);

  const handleStartQuiz = () => {
    setStep('quiz');
  };

  const handleAnswer = (questionId: string, value: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));

    setTimeout(() => {
      if (currentQuestion < quizQuestions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
      } else {
        setStep('capture');
      }
    }, 300);
  };

  const handleCapture = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!captureData.nombre || !captureData.email || !captureData.phoneNumber) return;

    const whatsapp = `${captureData.countryCode}${captureData.phoneNumber}`;

    setIsSubmitting(true);

    // Dos llamadas en paralelo:
    // 1) /api/diagnostico — guarda quiz + arquetipo en Supabase
    // 2) /api/funnel — dispara email de confirmación + inscribe en secuencia
    //    Auditoría Patrimonial 5 días (Resend + cron diario)
    const persistDiagnostico = fetch('/api/diagnostico', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: captureData.nombre,
        email: captureData.email,
        whatsapp,
        answers,
        timestamp: new Date().toISOString(),
        page: 'diagnostico-landing',
      }),
    }).catch((error) => {
      console.error('Error guardando diagnóstico:', error);
    });

    const triggerFunnel = fetch('/api/funnel', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: captureData.nombre,
        email: captureData.email,
        whatsapp,
        source: 'diagnostico',
        step: 'auditoria_registered',
      }),
    }).catch((error) => {
      console.error('Error inscribiendo al funnel:', error);
    });

    await Promise.allSettled([persistDiagnostico, triggerFunnel]);

    // Queswa escribe el diagnóstico a la medida desde las respuestas (con fallback si falla)
    try {
      const respuestas = quizQuestions.map((q) => {
        const key = q.id as keyof QuizAnswers;
        const opt = q.options.find((o) => o.value === answers[key]) || q.options[0];
        return { dimension: DIM_PROMPT[key], label: opt.label, sublabel: opt.sublabel, value: opt.value };
      });
      const res = await fetch('/api/diagnostico/interpretar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: captureData.nombre, respuestas }),
      });
      const data = await res.json();
      if (data?.ok && data.cuerpo) setInterpretacion({ titular: data.titular || '', cuerpo: data.cuerpo });
    } catch (error) {
      console.error('Error interpretando diagnóstico:', error);
    }

    setIsSubmitting(false);
    setStep('result');
  };

  const radarData = {
    autonomia: answers.autonomia,
    resiliencia: answers.resiliencia,
    eficiencia: answers.eficiencia,
    apalancamiento: answers.apalancamiento,
    pazMental: answers.pazMental,
  };

  const diagnostico = interpretacion ?? fallbackDiagnostico(answers, captureData.nombre);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      {/* SIN StrategicNavigation - Landing Page pura */}
      <main
        className="min-h-screen"
        style={{
          backgroundColor: 'var(--bg-deep)',
          color: 'var(--text-primary)',
          fontFamily: 'var(--font-body)',
        }}
      >
        {step === 'hero' && <HeroSection onStart={handleStartQuiz} />}
        {step === 'quiz' && (
          <QuizSection
            question={quizQuestions[currentQuestion]}
            currentIndex={currentQuestion}
            total={quizQuestions.length}
            selectedValue={answers[quizQuestions[currentQuestion].id as keyof QuizAnswers]}
            onAnswer={handleAnswer}
          />
        )}
        {step === 'capture' && (
          <CaptureSection
            data={captureData}
            onChange={setCaptureData}
            onSubmit={handleCapture}
            isSubmitting={isSubmitting}
          />
        )}
        {step === 'result' && (
          <ResultSection radarData={radarData} diagnostico={diagnostico} nombre={captureData.nombre} />
        )}
      </main>
    </>
  );
}

// ============================================================================
// HERO SECTION
// ============================================================================

function HeroSection({ onStart }: { onStart: () => void }) {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 py-20">
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 50% 30%, rgba(197, 160, 89, 0.08) 0%, transparent 50%)',
        }}
      />

      <div className="relative max-w-3xl mx-auto text-center">
        {/* Logo pequeño */}
        <Link href="/" className="inline-block mb-8 opacity-60 hover:opacity-100 transition-opacity">
          <span className="text-sm font-medium tracking-wider" style={{ color: 'var(--gold)' }}>
            CREATUACTIVO
          </span>
        </Link>

        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 rounded-full px-4 py-2 mb-8"
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border)',
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--gold)' }} />
          <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Diagnóstico gratis · 60 segundos
          </span>
        </div>

        {/* Main Headline */}
        <h1
          className="text-3xl sm:text-4xl lg:text-5xl leading-tight mb-8"
          style={{ fontFamily: 'var(--font-display)', fontWeight: 500 }}
        >
          <span style={{ color: 'var(--text-primary)' }}>¿Trabaja duro pero, a nivel financiero, siente que pedalea en una </span>
          <span style={{ color: 'var(--gold)' }}>bicicleta estática</span>
          <span style={{ color: 'var(--text-primary)' }}>?</span>
        </h1>

        {/* Subheadline */}
        <p
          className="text-lg sm:text-xl mb-12 max-w-2xl mx-auto leading-relaxed"
          style={{ color: 'var(--text-secondary)' }}
        >
          En 60 segundos vea, con sus propios números, qué tan firme está hoy la economía de su casa
          <br className="hidden sm:block" />
          <span style={{ color: 'var(--text-primary)' }}>
            — y dónde está la fuga que no lo deja avanzar.
          </span>
        </p>

        {/* CTA Button — Lujo Silencioso (Carbón + Borde Dorado + Texto Dorado) */}
        <button
          onClick={onStart}
          className="cta-base cta-primary"
          style={{ padding: '1.125rem 2.5rem', fontSize: '0.95rem' }}
        >
          Hacer mi diagnóstico gratis
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </button>

        {/* Trust indicators */}
        <div className="flex flex-wrap items-center justify-center gap-8 mt-12 text-sm" style={{ color: 'var(--text-muted)' }}>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" style={{ color: 'var(--gold-muted)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>60 segundos</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" style={{ color: 'var(--gold-muted)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
            <span>100% confidencial</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" style={{ color: 'var(--gold-muted)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
            </svg>
            <span>Resultado inmediato</span>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// QUIZ SECTION
// ============================================================================

interface QuizSectionProps {
  question: typeof quizQuestions[0];
  currentIndex: number;
  total: number;
  selectedValue: number;
  onAnswer: (questionId: string, value: number) => void;
}

function QuizSection({ question, currentIndex, total, selectedValue, onAnswer }: QuizSectionProps) {
  return (
    <section className="min-h-screen flex items-center justify-center px-6 py-20">
      <div className="max-w-2xl mx-auto w-full">
        {/* Progress */}
        <div className="mb-10">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Pregunta {currentIndex + 1} de {total}
            </span>
            <span className="text-sm font-medium" style={{ color: 'var(--gold)' }}>
              {Math.round(((currentIndex + 1) / total) * 100)}%
            </span>
          </div>
          <div
            className="h-1 rounded-full overflow-hidden"
            style={{ backgroundColor: 'var(--bg-card)' }}
          >
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                backgroundColor: 'var(--gold)',
                width: `${((currentIndex + 1) / total) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Question */}
        <h2
          className="text-xl sm:text-2xl lg:text-3xl mb-10 leading-relaxed"
          style={{ fontFamily: 'var(--font-display)', fontWeight: 500 }}
        >
          {question.question}
        </h2>

        {/* Options */}
        <div className="space-y-4">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => onAnswer(question.id, option.value)}
              className={`quiz-option w-full text-left p-5 rounded-xl border-2 ${
                selectedValue === option.value ? 'selected' : ''
              }`}
              style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: selectedValue === option.value ? 'var(--gold)' : 'var(--border)',
              }}
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-sm font-bold"
                  style={{
                    backgroundColor: selectedValue === option.value ? 'var(--gold)' : 'var(--bg-elevated)',
                    color: selectedValue === option.value ? 'var(--bg-deep)' : 'var(--text-muted)',
                  }}
                >
                  {String.fromCharCode(65 + index)}
                </div>
                <div>
                  <p className="font-medium text-lg" style={{ color: 'var(--text-primary)' }}>
                    {option.label}
                  </p>
                  <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                    {option.sublabel}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// CAPTURE SECTION
// ============================================================================

interface CaptureSectionProps {
  data: CaptureData;
  onChange: (data: CaptureData) => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
}

function CaptureSection({ data, onChange, onSubmit, isSubmitting }: CaptureSectionProps) {
  const [showCustomCode, setShowCustomCode] = useState(false);

  const handleCountryChange = (value: string) => {
    if (value === 'other') {
      setShowCustomCode(true);
      onChange({ ...data, countryCode: '+' });
    } else {
      setShowCustomCode(false);
      onChange({ ...data, countryCode: value });
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center px-6 py-20">
      <div className="max-w-md mx-auto w-full text-center">
        <div
          className="w-20 h-20 rounded-lg flex items-center justify-center mx-auto mb-8"
          style={{ backgroundColor: 'rgba(197, 160, 89, 0.1)' }}
        >
          <svg className="w-10 h-10" style={{ color: 'var(--gold)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
          </svg>
        </div>

        <h2
          className="text-2xl sm:text-3xl mb-4"
          style={{ fontFamily: 'var(--font-display)', fontWeight: 500 }}
        >
          Su diagnóstico está listo
        </h2>

        <p className="text-lg mb-8" style={{ color: 'var(--text-secondary)' }}>
          ¿A nombre de quién y a dónde le enviamos su resultado y su gráfico?
        </p>

        <form onSubmit={onSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Su nombre"
            value={data.nombre}
            onChange={(e) => onChange({ ...data, nombre: e.target.value })}
            autoCapitalize="words"
            required
            className="w-full px-5 py-4 rounded-xl focus:outline-none transition-all duration-300"
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border)',
              color: 'var(--text-primary)',
            }}
          />
          <input
            type="email"
            placeholder="Su email"
            value={data.email}
            onChange={(e) => onChange({ ...data, email: e.target.value.trim() })}
            onBlur={(e) => onChange({ ...data, email: e.target.value.trim() })}
            inputMode="email"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            required
            className="w-full px-5 py-4 rounded-xl focus:outline-none transition-all duration-300"
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border)',
              color: 'var(--text-primary)',
            }}
          />
          {/* WhatsApp con código de país separado */}
          <div className="flex gap-3">
            {showCustomCode ? (
              <input
                type="text"
                placeholder="+XX"
                value={data.countryCode}
                onChange={(e) => {
                  let val = e.target.value;
                  if (!val.startsWith('+')) val = '+' + val;
                  onChange({ ...data, countryCode: val.replace(/[^+\d]/g, '') });
                }}
                className="px-4 py-4 rounded-xl focus:outline-none transition-all duration-300 text-center"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-primary)',
                  width: '90px',
                }}
              />
            ) : (
              <select
                value={data.countryCode}
                onChange={(e) => handleCountryChange(e.target.value)}
                className="px-3 py-4 rounded-xl focus:outline-none transition-all duration-300"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-primary)',
                  width: '115px',
                }}
              >
                <option value="+57">🇨🇴 +57</option>
                <option value="+1">🇺🇸 +1</option>
                <option value="+52">🇲🇽 +52</option>
                <option value="+34">🇪🇸 +34</option>
                <option value="+51">🇵🇪 +51</option>
                <option value="+56">🇨🇱 +56</option>
                <option value="+54">🇦🇷 +54</option>
                <option value="+593">🇪🇨 +593</option>
                <option value="+58">🇻🇪 +58</option>
                <option value="+507">🇵🇦 +507</option>
                <option value="+506">🇨🇷 +506</option>
                <option value="+502">🇬🇹 +502</option>
                <option value="+55">🇧🇷 +55</option>
                <option value="other">🌍 Otro</option>
              </select>
            )}
            <input
              type="tel"
              placeholder="Su número de WhatsApp"
              value={data.phoneNumber}
              onChange={(e) => onChange({ ...data, phoneNumber: e.target.value.replace(/\D/g, '') })}
              required
              className="flex-1 px-5 py-4 rounded-xl focus:outline-none transition-all duration-300"
              style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border)',
                color: 'var(--text-primary)',
              }}
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="cta-base cta-primary w-full disabled:opacity-60"
            style={{ padding: '1.125rem 2rem', fontSize: '0.95rem' }}
          >
            {isSubmitting ? 'Queswa está preparando su diagnóstico…' : 'Ver Mi Diagnóstico'}
          </button>
        </form>

        <p className="text-sm mt-6" style={{ color: 'var(--text-muted)' }}>
          Sus datos están protegidos. Sin spam, solo su diagnóstico.
        </p>
      </div>
    </section>
  );
}

// ============================================================================
// RESULT SECTION
// ============================================================================

interface ResultSectionProps {
  radarData: {
    autonomia: number;
    resiliencia: number;
    eficiencia: number;
    apalancamiento: number;
    pazMental: number;
  };
  diagnostico: Diagnostico;
  nombre: string;
}

function ResultSection({ radarData, diagnostico, nombre }: ResultSectionProps) {
  const primerNombre = (nombre || '').trim().split(' ')[0];
  return (
    <section className="min-h-screen px-6 py-20">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <span
            className="text-sm font-medium uppercase tracking-widest"
            style={{ color: 'var(--gold)' }}
          >
            Diagnóstico Completado
          </span>
          <h1
            className="text-3xl sm:text-4xl mt-4"
            style={{ fontFamily: 'var(--font-display)', fontWeight: 500 }}
          >
            {primerNombre ? `Listo, ${primerNombre}` : 'Listo'} — así está hoy la economía de su casa
          </h1>
        </div>

        {/* Radar Chart — 100% fiel a sus respuestas */}
        <div className="flex justify-center mb-12">
          <RadarChart data={radarData} size={320} animated={true} />
        </div>

        {/* Diagnóstico de Queswa (o fallback determinístico) */}
        <div
          className="rounded-lg p-8 sm:p-10 mb-10"
          style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}
        >
          <div className="text-center mb-6">
            <span
              className="inline-block px-4 py-1.5 rounded-full text-sm font-medium mb-4"
              style={{ backgroundColor: 'rgba(197, 160, 89, 0.1)', color: 'var(--gold)' }}
            >
              SU DIAGNÓSTICO
            </span>
            {diagnostico.titular && (
              <h2
                className="text-2xl sm:text-3xl"
                style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}
              >
                {diagnostico.titular}
              </h2>
            )}
          </div>

          <div className="space-y-5 text-lg leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {diagnostico.cuerpo.split('\n\n').map((parrafo, i) => (
              <p key={i}>{parrafo}</p>
            ))}
          </div>
        </div>

        {/* Confirmación — sin re-formulario (el correo ya va en camino) */}
        <div
          className="rounded-lg p-8 sm:p-10 text-center"
          style={{
            background: 'linear-gradient(135deg, rgba(197, 160, 89, 0.1) 0%, rgba(197, 160, 89, 0.02) 100%)',
            border: '1px solid rgba(197, 160, 89, 0.2)',
          }}
        >
          <h3
            className="text-xl sm:text-2xl mb-4"
            style={{ fontFamily: 'var(--font-display)', fontWeight: 500 }}
          >
            Su <span style={{ color: 'var(--gold)' }}>Diagnóstico de 5 Días</span> ya va en camino
          </h3>

          <p className="text-lg mb-8 max-w-xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            Revise su correo y su WhatsApp. Cada día le llega un paso para corregir, justamente,
            su punto más frágil — sin llenar nada más.
          </p>

          <Link
            href="/empresa-digital/dia-1"
            className="cta-base cta-primary"
            style={{ padding: '1.125rem 2.5rem', fontSize: '0.95rem' }}
          >
            Empezar ahora con el Día 1
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        {/* Footer */}
        <footer className="text-center mt-16 pt-10" style={{ borderTop: '1px solid var(--border)' }}>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            © 2026 CreaTuActivo.com — Tecnología para construir ingresos recurrentes
          </p>
        </footer>
      </div>
    </section>
  );
}
