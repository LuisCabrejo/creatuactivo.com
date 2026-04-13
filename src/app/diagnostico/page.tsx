/**
 * Copyright © 2025 CreaTuActivo.com
 * Diagnóstico de Arquitectura Soberana - Landing Page (Quiz Funnel)
 * SIN navegación - Enfoque total en conversión
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
  email: string;
  countryCode: string;
  phoneNumber: string;
}

// ============================================================================
// CSS VARIABLES
// ============================================================================

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap');

  :root {
    --gold: #E5C279;
    --gold-light: #F59E0B;
    --gold-dark: #D97706;
    --gold-muted: #A3A3A3;

    --bg-deep: #0B0C0C;
    --bg-surface: #16181D;
    --bg-card: #16181D;
    --bg-elevated: #22252B;

    --text-primary: #E5E5E5;
    --text-secondary: #A3A3A3;
    --text-muted: #6B7280;

    --border: rgba(229, 194, 121, 0.15);
    --border-subtle: rgba(229, 194, 121, 0.1);

    --font-display: 'Playfair Display', Georgia, serif;
    --font-body: 'Inter', -apple-system, sans-serif;
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
    background: rgba(212, 175, 55, 0.1);
  }
`;

// ============================================================================
// QUIZ DATA
// ============================================================================

const quizQuestions = [
  {
    id: 'autonomia',
    question: 'Si por una razón de fuerza mayor dejaras de trabajar físicamente durante 6 meses, ¿qué sucedería con sus ingresos?',
    options: [
      { value: 10, label: 'Se detienen inmediatamente', sublabel: 'Dependo 100% de mi trabajo activo' },
      { value: 50, label: 'Se mantienen al 50-70% por un tiempo', sublabel: 'Tengo algo de colchón pero decaen' },
      { value: 100, label: 'Continúan llegando sin mi presencia', sublabel: 'Tengo sistemas que generan sin mí' },
    ],
  },
  {
    id: 'resiliencia',
    question: '¿Qué porcentaje de su patrimonio y fuentes de ingreso está atado a una ubicación geográfica específica?',
    options: [
      { value: 10, label: '100% - Todo depende de donde vivo', sublabel: 'Mi economía no es portátil' },
      { value: 50, label: '50% - Tengo inversiones diversificadas', sublabel: 'Pero mi ingreso principal es local' },
      { value: 100, label: '0-20% - Mi economía es agnóstica', sublabel: 'Puedo operar desde cualquier lugar' },
    ],
  },
  {
    id: 'eficiencia',
    question: 'Cuando revisas la relación entre lo que generaste (bruto) y lo que retuviste en activos reales, ¿cómo le sientes?',
    options: [
      { value: 20, label: 'Frustrado', sublabel: '"Soy un canal de paso para el dinero; entra y sale"' },
      { value: 50, label: 'Conforme', sublabel: '"Ahorré algo, pero no lo suficiente para cambiar mi vida"' },
      { value: 90, label: 'Satisfecho', sublabel: '"Construí patrimonio neto real y tangible"' },
    ],
  },
  {
    id: 'apalancamiento',
    question: '¿Su estrategia actual para duplicar sus ingresos requiere duplicar su esfuerzo personal o su tiempo?',
    options: [
      { value: 20, label: 'Sí, es una relación lineal', sublabel: 'Más dinero = Más trabajo' },
      { value: 50, label: 'Parcialmente', sublabel: 'Tengo equipo pero sigo siendo el cuello de botella' },
      { value: 90, label: 'No, uso sistemas de apalancamiento', sublabel: 'Mi ingreso puede escalar sin mí' },
    ],
  },
  {
    id: 'pazMental',
    question: 'En una escala del 1 al 10, ¿cuánta paz mental le da la arquitectura financiera que has construido hasta hoy?',
    options: [
      { value: 20, label: '1-3: Muy poca', sublabel: 'Vivo con ansiedad financiera constante' },
      { value: 50, label: '4-6: Regular', sublabel: 'Hay días buenos y días de preocupación' },
      { value: 80, label: '7-8: Buena', sublabel: 'Me siento relativamente seguro' },
      { value: 100, label: '9-10: Excelente', sublabel: 'Tengo paz mental total sobre mi futuro' },
    ],
  },
];

// ============================================================================
// ARQUETIPOS
// ============================================================================

const getArchetype = (data: { potenciaIngreso: number; autonomiaOperativa: number; resilienciaGeografica: number; escalabilidadSistemica: number; eficienciaPatrimonial: number }) => {
  const avgSupport = (data.autonomiaOperativa + data.escalabilidadSistemica + data.eficienciaPatrimonial) / 3;

  if (data.potenciaIngreso >= 70 && avgSupport <= 40) {
    return {
      name: 'EL GIGANTE DE PIES DE BARRO',
      subtitle: 'Alto Rendimiento / Motor Solitario',
      description: 'Los datos indican que tiene una capacidad excepcional para generar flujo de efectivo. Eres el motor indiscutible de su economía. Ese es su superpoder, pero paradójicamente, es su mayor riesgo.',
      insight: 'Su gráfico muestra una "Arquitectura Asimétrica". Has optimizado todo su sistema para el Ingreso Activo (dependiente de ti), pero has descuidado peligrosamente la Infraestructura de Soporte.',
      truth: 'Actualmente, no posees un activo; el activo eres TÚ. Si usted le detienes, el sistema colapsa. Esto no es Soberanía, es una jaula de oro de alta gama.',
      metaphor: 'Tiene el motor de un Ferrari montado en el chasis de una bicicleta.',
      need: 'Lo que le falta no es más dinero. Le falta un Chasis.',
    };
  }

  if (avgSupport <= 30) {
    return {
      name: 'EL OPERADOR AGOTADO',
      subtitle: 'Negocio Propio / Sin Tiempo',
      description: 'Has construido algo, pero le has convertido en esclavo de su propia creación. Su negocio no funciona sin ti, lo que significa que no tiene un negocio: tiene un trabajo disfrazado.',
      insight: 'Todos los ejes de su gráfico dependen de su presencia física. No has logrado separar su tiempo de su ingreso.',
      truth: 'Si cierras la puerta mañana, dejas de ganar. Eso no es un activo, es una trampa operativa.',
      metaphor: 'Eres el motor, el volante y los frenos. Si le enfermas, el carro se detiene.',
      need: 'Necesitas sistemas que operen sin su presencia constante.',
    };
  }

  return {
    name: 'EL CONSTRUCTOR EN PROGRESO',
    subtitle: 'En Camino / Con Potencial',
    description: 'Tiene algunos elementos de estructura, pero aún no has logrado la independencia operativa completa. Estás mejor que la mayoría, pero lejos de la Soberanía.',
    insight: 'Su gráfico muestra áreas de oportunidad claras. No estás en crisis, pero tampoco estás protegido.',
    truth: 'Con los ajustes correctos, podrías acelerar significativamente su camino hacia la autonomía.',
    metaphor: 'Tiene los planos, pero la construcción está a medias.',
    need: 'Necesitas completar la infraestructura que ya empezaste.',
  };
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function DiagnosticoPage() {
  const [step, setStep] = useState<QuizStep>('quiz');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>({
    autonomia: 0,
    resiliencia: 0,
    eficiencia: 0,
    apalancamiento: 0,
    pazMental: 0,
  });
  const [captureData, setCaptureData] = useState<CaptureData>({ email: '', countryCode: '+57', phoneNumber: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    if (!captureData.email || !captureData.phoneNumber) return;

    const whatsapp = `${captureData.countryCode}${captureData.phoneNumber}`;

    setIsSubmitting(true);

    try {
      await fetch('/api/diagnostico', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: captureData.email,
          whatsapp,
          answers,
          timestamp: new Date().toISOString(),
          page: 'diagnostico-landing',
        }),
      });
    } catch (error) {
      console.error('Error guardando diagnóstico:', error);
    }

    setIsSubmitting(false);
    setStep('result');
  };

  const radarData = {
    potenciaIngreso: 85,
    autonomiaOperativa: answers.autonomia,
    resilienciaGeografica: answers.resiliencia,
    escalabilidadSistemica: answers.apalancamiento,
    eficienciaPatrimonial: answers.eficiencia,
  };

  const archetype = getArchetype(radarData);

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
          <ResultSection radarData={radarData} archetype={archetype} />
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
          background: 'radial-gradient(ellipse at 50% 30%, rgba(212, 175, 55, 0.08) 0%, transparent 50%)',
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
            Auditoría de 60 segundos
          </span>
        </div>

        {/* Main Headline */}
        <h1
          className="text-3xl sm:text-4xl lg:text-5xl leading-tight mb-8"
          style={{ fontFamily: 'var(--font-display)', fontWeight: 500 }}
        >
          <span style={{ color: 'var(--text-secondary)' }}>A los 40 años descubrí que</span>
          <br />
          <span style={{ color: 'var(--text-primary)' }}>había pasado dos décadas</span>
          <br />
          <span style={{ color: 'var(--gold)' }}>subiendo la escalera equivocada.</span>
        </h1>

        {/* Subheadline */}
        <p
          className="text-lg sm:text-xl mb-12 max-w-2xl mx-auto leading-relaxed"
          style={{ color: 'var(--text-secondary)' }}
        >
          La mayoría de los profesionales exitosos son ricos en ingresos pero pobres en arquitectura.
          <br className="hidden sm:block" />
          <span style={{ color: 'var(--text-primary)' }}>
            Realiza esta auditoría para visualizar las grietas invisibles en su modelo actual.
          </span>
        </p>

        {/* CTA Button */}
        <button
          onClick={onStart}
          className="inline-flex items-center justify-center gap-3 font-semibold text-lg px-10 py-5 rounded-xl transition-all duration-300 hover:translate-y-[-2px] hover:shadow-lg"
          style={{
            backgroundColor: 'var(--gold)',
            color: 'var(--bg-deep)',
          }}
        >
          Iniciar Auditoría Gratuita
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
          className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-8"
          style={{ backgroundColor: 'rgba(212, 175, 55, 0.1)' }}
        >
          <svg className="w-10 h-10" style={{ color: 'var(--gold)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
          </svg>
        </div>

        <h2
          className="text-2xl sm:text-3xl mb-4"
          style={{ fontFamily: 'var(--font-display)', fontWeight: 500 }}
        >
          Su análisis está listo
        </h2>

        <p className="text-lg mb-8" style={{ color: 'var(--text-secondary)' }}>
          ¿A dónde enviamos su informe detallado y el gráfico de arquitectura?
        </p>

        <form onSubmit={onSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Su email"
            value={data.email}
            onChange={(e) => onChange({ ...data, email: e.target.value })}
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
            className="w-full px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:opacity-90 disabled:opacity-60"
            style={{
              backgroundColor: 'var(--gold)',
              color: 'var(--bg-deep)',
            }}
          >
            {isSubmitting ? 'Procesando...' : 'Ver Mi Auditoría'}
          </button>
        </form>

        <p className="text-sm mt-6" style={{ color: 'var(--text-muted)' }}>
          Sus datos están protegidos. Sin spam, solo su auditoría.
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
    potenciaIngreso: number;
    autonomiaOperativa: number;
    resilienciaGeografica: number;
    escalabilidadSistemica: number;
    eficienciaPatrimonial: number;
  };
  archetype: ReturnType<typeof getArchetype>;
}

function ResultSection({ radarData, archetype }: ResultSectionProps) {
  return (
    <section className="min-h-screen px-6 py-20">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <span
            className="text-sm font-medium uppercase tracking-widest"
            style={{ color: 'var(--gold)' }}
          >
            Auditoría Completada
          </span>
          <h1
            className="text-3xl sm:text-4xl mt-4"
            style={{ fontFamily: 'var(--font-display)', fontWeight: 500 }}
          >
            Su Arquitectura Financiera
          </h1>
        </div>

        {/* Radar Chart */}
        <div className="flex justify-center mb-12">
          <RadarChart data={radarData} size={320} animated={true} />
        </div>

        {/* Archetype Card */}
        <div
          className="rounded-2xl p-8 sm:p-10 mb-10"
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border)',
          }}
        >
          <div className="text-center mb-8">
            <span
              className="inline-block px-4 py-1.5 rounded-full text-sm font-medium mb-4"
              style={{
                backgroundColor: 'rgba(212, 175, 55, 0.1)',
                color: 'var(--gold)',
              }}
            >
              ARQUETIPO DETECTADO
            </span>
            <h2
              className="text-2xl sm:text-3xl mb-2"
              style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}
            >
              {archetype.name}
            </h2>
            <p style={{ color: 'var(--text-muted)' }}>{archetype.subtitle}</p>
          </div>

          <div className="space-y-6" style={{ color: 'var(--text-secondary)' }}>
            <p className="text-lg leading-relaxed">{archetype.description}</p>
            <p className="leading-relaxed">{archetype.insight}</p>
            <p
              className="text-lg font-medium leading-relaxed"
              style={{ color: 'var(--text-primary)' }}
            >
              <strong>La Verdad Incómoda:</strong> {archetype.truth}
            </p>
            <p
              className="text-xl italic text-center py-4"
              style={{ color: 'var(--gold)', fontFamily: 'var(--font-display)' }}
            >
              &quot;{archetype.metaphor}&quot;
            </p>
            <p
              className="text-lg font-semibold text-center"
              style={{ color: 'var(--text-primary)' }}
            >
              {archetype.need}
            </p>
          </div>
        </div>

        {/* Transition to Reto */}
        <div
          className="rounded-2xl p-8 sm:p-10 text-center"
          style={{
            background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, rgba(212, 175, 55, 0.02) 100%)',
            border: '1px solid rgba(212, 175, 55, 0.2)',
          }}
        >
          <h3
            className="text-xl sm:text-2xl mb-6"
            style={{ fontFamily: 'var(--font-display)', fontWeight: 500 }}
          >
            La brecha entre su situación actual y la Soberanía
            <br />
            <span style={{ color: 'var(--gold)' }}>no es cuestión de esfuerzo. Es cuestión de Diseño.</span>
          </h3>

          <p className="text-lg mb-6 max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            La mayoría intenta corregir este gráfico trabajando más duro. Pero no puede solucionar
            un problema estructural con más esfuerzo operativo. Eso es como tratar de arreglar
            una fuga de agua abriendo más el grifo.
          </p>

          <p className="mb-8" style={{ color: 'var(--text-secondary)' }}>
            He diseñado el <strong style={{ color: 'var(--gold)' }}>El Mapa de Salida</strong> específicamente
            para perfiles de alto rendimiento que necesitan transicionar de{' '}
            <em>Operadores</em> a <em>Arquitectos</em>.
          </p>

          <div
            className="p-6 rounded-xl mb-8 text-left"
            style={{ backgroundColor: 'var(--bg-deep)', border: '1px solid var(--border)' }}
          >
            <p className="font-medium mb-4" style={{ color: 'var(--text-primary)' }}>
              No es un curso motivacional. Es un proceso de ingeniería donde:
            </p>
            <ul className="space-y-3" style={{ color: 'var(--text-secondary)' }}>
              <li className="flex items-start gap-3">
                <span style={{ color: 'var(--gold)' }}>Día 1:</span>
                <span>Realizaremos la auditoría matemática profunda (la versión cuantitativa de lo que acabas de ver)</span>
              </li>
              <li className="flex items-start gap-3">
                <span style={{ color: 'var(--gold)' }}>Día 2:</span>
                <span>Desmantelaremos los vehículos obsoletos que consumen su tiempo</span>
              </li>
              <li className="flex items-start gap-3">
                <span style={{ color: 'var(--gold)' }}>Día 3:</span>
                <span>Le entregaré los planos de la infraestructura de socios (El Nuevo Modelo)</span>
              </li>
              <li className="flex items-start gap-3">
                <span style={{ color: 'var(--gold)' }}>Día 4:</span>
                <span>Hablaremos del elefante en la habitación (El Estigma)</span>
              </li>
              <li className="flex items-start gap-3">
                <span style={{ color: 'var(--gold)' }}>Día 5:</span>
                <span>Le entregaré las llaves de su soberanía (La Invitación)</span>
              </li>
            </ul>
          </div>

          <p className="mb-8 font-medium" style={{ color: 'var(--text-primary)' }}>
            Su auditoría dice que estás listo para escalar,
            <br />
            pero su estructura no lo soportará. <span style={{ color: 'var(--gold)' }}>Refuerza los cimientos primero.</span>
          </p>

          <Link
            href="/mapa-de-salida"
            className="inline-flex items-center justify-center gap-3 font-semibold text-lg px-10 py-5 rounded-xl transition-all duration-300 hover:translate-y-[-2px] hover:shadow-lg"
            style={{
              backgroundColor: 'var(--gold)',
              color: 'var(--bg-deep)',
            }}
          >
            Unirme al Protocolo Soberanía
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>

          <p className="text-sm mt-6" style={{ color: 'var(--text-muted)' }}>
            Trae su gráfico de resultados al Día 1. Será nuestro punto de partida.
          </p>
        </div>

        {/* Footer */}
        <footer className="text-center mt-16 pt-10" style={{ borderTop: '1px solid var(--border)' }}>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            © 2025 CreaTuActivo.com — Arquitectura de Soberanía Financiera
          </p>
        </footer>
      </div>
    </section>
  );
}
