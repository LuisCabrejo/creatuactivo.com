'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, CheckCircle, Copy, Lightbulb, Mic, Shield, BarChart3, BrainCircuit, MessageSquare, BookOpen } from 'lucide-react'
import Link from 'next/link'
import NodeXSidebar from '@/components/NodeXSidebar'

// --- Estilos CSS Globales (Sin cambios) ---
const GlobalStyles = () => (
  <style jsx global>{`
    :root {
      --creatuactivo-blue: #1E40AF;
      --creatuactivo-purple: #7C3AED;
      --creatuactivo-gold: #F59E0B;
    }
    .creatuactivo-h1-ecosystem {
      font-weight: 800;
      background: linear-gradient(135deg, var(--creatuactivo-blue) 0%, var(--creatuactivo-purple) 50%, var(--creatuactivo-gold) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      line-height: 1.1;
      letter-spacing: -0.03em;
    }
    .creatuactivo-h2-component {
        font-weight: 700;
        background: linear-gradient(135deg, #FFFFFF 0%, #E5E7EB 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }
    .creatuactivo-component-card {
      background: linear-gradient(135deg, rgba(30, 64, 175, 0.1) 0%, rgba(124, 58, 237, 0.1) 100%);
      backdrop-filter: blur(24px);
      border: 1px solid rgba(124, 58, 237, 0.2);
      border-radius: 20px;
      transition: all 0.4s ease;
      position: relative;
      overflow: hidden;
    }
    .creatuactivo-cta-ecosystem {
      background: linear-gradient(135deg, var(--creatuactivo-blue) 0%, var(--creatuactivo-purple) 100%);
      border-radius: 16px;
      padding: 18px 36px;
      font-weight: 700;
      color: white;
      transition: all 0.3s ease;
      box-shadow: 0 6px 20px rgba(30, 64, 175, 0.4);
    }
    .form-input {
        background-color: rgba(30, 41, 59, 0.5);
        border: 1px solid rgba(124, 58, 237, 0.2);
        color: white;
        border-radius: 12px;
        padding: 0.75rem 1rem;
        width: 100%;
        transition: all 0.3s ease;
    }
    .form-input::placeholder {
        color: #64748B;
    }
    .form-input:focus {
        outline: none;
        border-color: var(--creatuactivo-purple);
        box-shadow: 0 0 15px rgba(124, 58, 237, 0.3);
    }
  `}</style>
);

// --- Componente Principal de la Página ACE (ACTUALIZADO) ---
export default function ACEPage() {
    const [step, setStep] = useState(1);
    const [dojoResponse, setDojoResponse] = useState('');
    const [dojoFeedback, setDojoFeedback] = useState('');
    const [simulationFeedback, setSimulationFeedback] = useState('');

    const prospectData = {
        name: "Ana María Rojas",
        engagement: "Alto (7 min)",
        focus: "Simulador de Ingresos",
        emotion: "Analítico / Cauteloso",
        suggestion: "Enfoca tu llamada en datos y ROI."
    };

    const handleSimulationChoice = (choice) => {
        let feedback = '';
        if (choice === 'C') {
            feedback = '¡Excelente elección! Reencuadrar la conversación hacia la "arquitectura" es una jugada de alto nivel.';
        } else {
            feedback = 'Buena opción. Ambas son válidas, pero enfócate siempre en el sistema, no solo en los números.';
        }
        setSimulationFeedback(feedback);
        setTimeout(() => {
            setStep(3);
        }, 2500);
    };

    const handleDojoSubmit = () => {
        setDojoFeedback("Tu respuesta es buena, pero usaste la palabra 'costo' en lugar de 'inversión'. Intenta reencuadrarlo así... Además, tu tono sonó un poco dubitativo al final. Proyecta más seguridad al afirmar el valor del ecosistema.");
    };

    const steps = ["Inteligencia", "Simulación", "Dojo de Objeciones", "Plan de Juego"];

    return (
        <>
            <GlobalStyles />
            {/* AJUSTE: Se utiliza NodeXSidebar como el layout principal que envuelve todo el contenido. */}
            <NodeXSidebar>
                <div className="p-6 relative">
                    <section className="text-center max-w-4xl mx-auto py-20 lg:py-28">
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                             <div className="inline-block bg-purple-500/10 text-purple-300 font-semibold text-sm uppercase tracking-wider px-4 py-2 rounded-full mb-6 border border-purple-500/30">
                                Centro de Entrenamiento de Élite
                            </div>
                            <h1 className="creatuactivo-h1-ecosystem text-4xl md:text-6xl mb-6">
                                El Asistente de Conversación Estratégica.
                            </h1>
                            <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto">
                                La herramienta que erradica la duda y te convierte en un consultor de élite antes de tu primera llamada de ACOGER.
                            </p>
                        </motion.div>
                    </section>

                    {/* Stepper */}
                    <div className="max-w-3xl mx-auto mb-12">
                         <div className="flex items-center justify-between">
                            {steps.map((s, i) => (
                                <React.Fragment key={s}>
                                    <div className="flex flex-col items-center text-center">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-all duration-500 ${step >= i + 1 ? 'bg-gradient-to-r from-[var(--creatuactivo-blue)] to-[var(--creatuactivo-purple)] text-white border-[var(--creatuactivo-blue)]' : 'bg-slate-800 text-slate-400 border-slate-600'}`}>
                                            {step > i + 1 ? <CheckCircle size={16} /> : i + 1}
                                        </div>
                                        <p className={`mt-2 text-xs font-semibold ${step >= i + 1 ? 'text-white' : 'text-slate-500'}`}>{s}</p>
                                    </div>
                                    {i < steps.length - 1 && <div className={`flex-1 h-1 mx-4 rounded-full ${step > i + 1 ? 'bg-gradient-to-r from-[var(--creatuactivo-blue)] to-[var(--creatuactivo-purple)]' : 'bg-slate-700'}`}></div>}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>

                    <div className="max-w-5xl mx-auto">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={step}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.5 }}
                            >
                                {step === 1 && (
                                    <div className="creatuactivo-component-card p-8 text-center">
                                        <h2 className="creatuactivo-h2-component text-3xl font-bold mb-4">Paso 1: Carga de Inteligencia</h2>
                                        <p className="text-slate-400 mb-8">Este es el plan de vuelo para tu llamada con <span className="font-bold text-white">{prospectData.name}</span>.</p>
                                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
                                            <div className="bg-slate-900/50 p-4 rounded-lg"><p className="text-sm text-blue-400 font-semibold">Engagement</p><p className="text-lg text-white font-bold">{prospectData.engagement}</p></div>
                                            <div className="bg-slate-900/50 p-4 rounded-lg"><p className="text-sm text-blue-400 font-semibold">Foco Principal</p><p className="text-lg text-white font-bold">{prospectData.focus}</p></div>
                                            <div className="bg-slate-900/50 p-4 rounded-lg"><p className="text-sm text-blue-400 font-semibold">Análisis Emocional</p><p className="text-lg text-white font-bold">{prospectData.emotion}</p></div>
                                            <div className="bg-slate-900/50 p-4 rounded-lg"><p className="text-sm font-semibold text-[var(--creatuactivo-gold)]">Sugerencia Estratégica</p><p className="text-lg text-white font-bold">{prospectData.suggestion}</p></div>
                                        </div>
                                        <button onClick={() => setStep(2)} className="creatuactivo-cta-ecosystem text-base mt-8">Iniciar Simulación</button>
                                    </div>
                                )}
                                {step === 2 && (
                                    <div className="creatuactivo-component-card p-8">
                                        <h2 className="creatuactivo-h2-component text-3xl font-bold mb-4 text-center">Paso 2: Simulador de Vuelo</h2>
                                        <p className="text-slate-400 mb-8 text-center">La IA actuará como tu prospecto. Elige la mejor respuesta estratégica.</p>
                                        <div className="bg-slate-900/50 p-6 rounded-xl border border-white/10 space-y-4">
                                            <div className="text-left"><p className="text-sm text-purple-400 font-semibold">IA ({prospectData.name})</p><p className="bg-slate-800 p-3 rounded-lg mt-1">Hola, gracias por la info. Se ve profesional, pero los números del simulador parecen demasiado buenos. ¿Son realistas?</p></div>
                                            <div className="space-y-3">
                                                <button onClick={() => handleSimulationChoice('A')} className="w-full text-left p-3 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm transition-colors">A) "Es una pregunta excelente. Hablemos de la matemática detrás..."</button>
                                                <button onClick={() => handleSimulationChoice('B')} className="w-full text-left p-3 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm transition-colors">B) "Entiendo tu escepticismo. Permíteme contarte una historia..."</button>
                                                <button onClick={() => handleSimulationChoice('C')} className="w-full text-left p-3 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm transition-colors">C) "Me alegra que te enfoques en los números. La clave no es el número final, sino la arquitectura..."</button>
                                            </div>
                                            <AnimatePresence>
                                            {simulationFeedback && (
                                                <motion.div initial={{opacity:0, height:0}} animate={{opacity:1, height:'auto'}} exit={{opacity:0, height:0}} className="pt-4">
                                                    <p className="text-center text-sm text-green-400">{simulationFeedback}</p>
                                                </motion.div>
                                            )}
                                            </AnimatePresence>
                                        </div>
                                    </div>
                                )}
                                {step === 3 && (
                                     <div className="creatuactivo-component-card p-8">
                                        <h2 className="creatuactivo-h2-component text-3xl font-bold mb-4 text-center">Paso 3: Dojo de Objeciones</h2>
                                        <p className="text-slate-400 mb-8 text-center">Practica tu respuesta a la objeción más probable: "No tengo tiempo".</p>
                                        <div className="space-y-4">
                                            <textarea value={dojoResponse} onChange={e => setDojoResponse(e.target.value)} className="w-full form-input text-white" rows="4" placeholder="Escribe tu respuesta aquí. Sé directo y empático..."></textarea>
                                            <button onClick={handleDojoSubmit} className="w-full bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2 rounded-lg">Obtener Feedback de IA</button>
                                            {dojoFeedback && <div className="bg-slate-900/50 p-4 rounded-lg border border-purple-500/30 text-sm text-slate-300"><span className="font-bold text-purple-400">Feedback de NEXUS:</span> {dojoFeedback}</div>}
                                        </div>
                                         <div className="text-center mt-8">
                                            <button onClick={() => setStep(4)} className="creatuactivo-cta-ecosystem text-base">Generar mi Plan de Juego</button>
                                        </div>
                                    </div>
                                )}
                                {step === 4 && (
                                    <div className="creatuactivo-component-card p-8">
                                        <h2 className="creatuactivo-h2-component text-3xl font-bold mb-4 text-center">Paso 4: Tu Plan de Juego Definitivo</h2>
                                        <p className="text-slate-400 mb-8 text-center">Esta es tu hoja de misión para una llamada de ACOGER exitosa.</p>
                                        <div className="bg-slate-900/50 p-6 rounded-xl border border-white/10 text-left space-y-4">
                                            <div><p className="text-sm font-semibold text-blue-400">Objetivo Principal:</p><p className="text-white">Agendar una llamada de 3 con tu Arquitecto Mentor.</p></div>
                                            <div><p className="text-sm font-semibold text-blue-400">Tu Frase de Apertura Ideal:</p><p className="text-white">"Hola Ana María, vi que exploraste el ecosistema. ¿Qué fue lo que más capturó tu atención de la arquitectura?"</p></div>
                                            <div><p className="text-sm font-semibold text-blue-400">Punto de Dolor a Tocar:</p><p className="text-white">Conectar la limitación del ingreso lineal con la oportunidad de construir un activo.</p></div>
                                            <div><p className="text-sm font-semibold text-blue-400">"Frase de Oro" Recomendada (de la Biblioteca):</p><p className="text-white italic">"La mayoría de la gente se enfoca en el vehículo. Los arquitectos nos enfocamos en el motor."</p></div>
                                        </div>
                                         <div className="text-center mt-8">
                                            <button onClick={() => alert("Plan copiado!")} className="creatuactivo-cta-ecosystem text-base">Copiar Plan de Juego</button>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </NodeXSidebar>
        </>
    );
}
