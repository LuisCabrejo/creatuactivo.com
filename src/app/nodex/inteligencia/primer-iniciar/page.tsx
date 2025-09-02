'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle, Copy, Link as LinkIcon, Rocket, Users, BarChart3, Target, Lightbulb } from 'lucide-react'
import Link from 'next/link'
import NodeXSidebar from '@/components/NodeXSidebar'

// --- Estilos CSS Globales (Desde Guía de Branding v4.2) ---
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
    .form-input:focus {
        outline: none;
        border-color: var(--creatuactivo-purple);
        box-shadow: 0 0 15px rgba(124, 58, 237, 0.3);
    }
  `}</style>
);

// --- Componente Principal de la Página "Centro de Inteligencia del Arquitecto" ---
export default function CentroInteligenciaPage() {
    const [formData, setFormData] = useState({
        nombre: '',
        arquetipo: 'Profesional Corporativo',
        otroArquetipo: '',
        confianza: 'Tibio',
        superpoder: '',
        contexto: '',
        notas: '' // Campo unificado para notas adicionales
    });
    const [generatedMessage, setGeneratedMessage] = useState('');
    const [copied, setCopied] = useState(false);

    const constructorId = "carlos-perez-123"; // Placeholder
    const presentationLink = `https://CreaTuActivo.com/presentacion-empresarial?ref=${constructorId}`;

    const handleGenerateMessage = () => {
        // Simulación de la llamada a la IA de NEXUS con datos enriquecidos
        const { nombre, arquetipo, otroArquetipo, confianza, superpoder, contexto, notas } = formData;

        const finalArquetipo = arquetipo === 'Otro' ? otroArquetipo : arquetipo;

        // Lógica de IA (simulada) que ahora puede usar el campo 'notas' para mayor asertividad
        let toneIntro = "te escribo por algo muy puntual.";
        if (confianza === 'Caliente') toneIntro = "te escribo directo al grano porque pensé en ti para algo grande.";
        if (confianza === 'Frío') toneIntro = `espero que estés muy bien. Mi nombre es [Tu Nombre], nos conocimos en ${contexto}.`;

        let compliment = superpoder ? `Siempre he admirado tu increíble capacidad para ${superpoder}. ` : '';

        const message = `Hola ${nombre}, ¿cómo estás? ${toneIntro} ${compliment}Justamente por eso, pensé en ti para algo que estoy construyendo: una arquitectura de negocio diseñada para perfiles como el tuyo (${finalArquetipo.toLowerCase()}) que buscan construir un activo real. Échale un vistazo cuando tengas un momento, creo que te va a resonar mucho: ${presentationLink}`;

        setGeneratedMessage(message);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(generatedMessage);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const arquetiposDefinitivos = [
        "Profesional Corporativo",
        "Emprendedor / Dueño de Negocio",
        "Profesional Independiente",
        "Líder del Hogar",
        "Líder de Comunidad",
        "Estudiante",
        "Otro"
    ];

    return (
        <>
            <GlobalStyles />
            <div className="flex min-h-screen bg-slate-900">
                <NodeXSidebar />
                <main className="flex-1 p-6">
                    <section className="text-center max-w-4xl mx-auto pb-20 lg:pb-28">
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                             <div className="inline-block bg-blue-500/10 text-blue-300 font-semibold text-sm uppercase tracking-wider px-4 py-2 rounded-full mb-6 border border-blue-500/30">
                                Academia de Constructores: Misión 01
                            </div>
                            <h1 className="creatuactivo-h1-ecosystem text-4xl md:text-6xl mb-6">
                                El Centro de Inteligencia del Arquitecto.
                            </h1>
                            <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto">
                                Bienvenido a tu primera victoria. Esta herramienta te dará la inteligencia y el plan de acción para ejecutar un INICIAR de clase mundial.
                            </p>
                        </motion.div>
                    </section>

                    <section className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8 mb-20 lg:mb-32">
                        {/* Columna 1: La Radiografía */}
                        <div className="creatuactivo-component-card p-8">
                            <h2 className="creatuactivo-h2-component text-2xl font-bold mb-2">Paso 1: La Radiografía</h2>
                            <p className="text-slate-400 mb-6">Completa el perfil de tu constructor potencial. Mientras más preciso seas, más potente será el mensaje.</p>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-1">Nombre del Contacto</label>
                                    <input type="text" value={formData.nombre} onChange={e => setFormData({...formData, nombre: e.target.value})} className="form-input" placeholder="Ej: Nelson López" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-1">Arquetipo Principal</label>
                                    <select value={formData.arquetipo} onChange={e => setFormData({...formData, arquetipo: e.target.value})} className="form-input">
                                        {arquetiposDefinitivos.map(arq => <option key={arq}>{arq}</option>)}
                                    </select>
                                </div>
                                {formData.arquetipo === 'Otro' && (
                                     <motion.div initial={{opacity:0, height:0}} animate={{opacity:1, height:'auto'}}>
                                        <label className="block text-sm font-medium text-slate-300 mb-1">Describe su rol o profesión</label>
                                        <input type="text" value={formData.otroArquetipo} onChange={e => setFormData({...formData, otroArquetipo: e.target.value})} className="form-input" placeholder="Ej: Ganadero, Artista, un crack para los negocios" />
                                     </motion.div>
                                )}
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-1">Nivel de Confianza</label>
                                    <select value={formData.confianza} onChange={e => setFormData({...formData, confianza: e.target.value})} className="form-input">
                                        <option>Tibio</option>
                                        <option>Caliente</option>
                                        <option>Frío</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-1">"Superpoder" Conocido</label>
                                    <input type="text" value={formData.superpoder} onChange={e => setFormData({...formData, superpoder: e.target.value})} className="form-input" placeholder="Ej: hacer dinero sin saber leer" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-1">Notas Clave (Contexto, edad, estado civil, etc.)</label>
                                    <textarea value={formData.notas} onChange={e => setFormData({...formData, notas: e.target.value})} className="form-input" rows="3" placeholder="Ej: Amigo cercano, 45 años, casado con hijos. Le interesa construir un legado."></textarea>
                                </div>
                            </div>
                        </div>

                        {/* Columna 2: El Mensaje Inteligente */}
                        <div className="creatuactivo-component-card p-8">
                             <h2 className="creatuactivo-h2-component text-2xl font-bold mb-2">Paso 2: El Mensaje Inteligente</h2>
                             <p className="text-slate-400 mb-6">Usa la inteligencia de NEXUS para generar y copiar tu mensaje hiper-personalizado.</p>

                             <button onClick={handleGenerateMessage} disabled={!formData.nombre} className="w-full creatuactivo-cta-ecosystem text-base mb-6 disabled:opacity-50 disabled:cursor-not-allowed">
                                 <Lightbulb className="inline-block w-5 h-5 mr-2"/>
                                 Generar Mensaje con IA
                             </button>

                             {generatedMessage && (
                                <motion.div initial={{opacity:0}} animate={{opacity:1}} className="bg-slate-900/50 p-4 rounded-lg border border-white/10">
                                    <p className="text-slate-300 text-sm mb-4">{generatedMessage}</p>
                                    <button onClick={handleCopy} className="w-full bg-slate-700 hover:bg-slate-600 text-slate-300 font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2">
                                        {copied ? <CheckCircle className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5" />}
                                        {copied ? 'Copiado' : 'Copiar Mensaje y Enlace'}
                                    </button>
                                </motion.div>
                             )}
                        </div>
                    </section>

                    <section className="max-w-5xl mx-auto mb-20 lg:mb-32 creatuactivo-component-card p-8 md:p-12">
                         <div className="text-center mb-12">
                            <h2 className="creatuactivo-h2-component text-3xl md:text-4xl font-bold">Paso 3: El Informe de Inteligencia</h2>
                            <p className="text-slate-400 mt-2">Una vez que tu contacto visite el enlace, aquí en tu Dashboard NodeX recibirás un informe completo para tu llamada de ACOGER.</p>
                        </div>
                        <div className="bg-slate-900/50 p-6 rounded-xl border border-white/10 opacity-70">
                            <h4 className="font-bold text-white mb-2">Informe de Inteligencia (Ejemplo)</h4>
                            <p className="text-sm text-slate-400 mb-4">Aparecerá aquí después de la visita de tu contacto.</p>
                            <ul className="text-sm text-slate-300 space-y-2">
                                <li><span className="font-semibold text-blue-400">Nivel de Engagement:</span> Alto (7 min)</li>
                                <li><span className="font-semibold text-blue-400">Foco de Interés:</span> Simulador de Ingresos</li>
                                <li><span className="font-semibold text-blue-400">Análisis Emocional:</span> Analítico / Cauteloso</li>
                                <li><span className="font-semibold text-blue-400">Sugerencia Estratégica:</span> Enfoca tu llamada en datos y ROI.</li>
                            </ul>
                        </div>
                    </section>

                    <section className="text-center py-20">
                         <div className="max-w-3xl mx-auto">
                            <h2 className="creatuactivo-h2-component text-3xl md:text-5xl font-bold mb-6">Has Ejecutado un INICIAR de Clase Mundial.</h2>
                            <p className="text-slate-400 text-lg mb-10">Este es el poder de un ecosistema que trabaja para ti. El siguiente paso es unirte a la comunidad para compartir tus resultados.</p>
                            <Link href="/ecosistema/comunidad" className="creatuactivo-cta-ecosystem text-lg inline-block">
                                Ir a la Comunidad de Constructores
                            </Link>
                        </div>
                    </section>
                </main>
            </div>
        </>
    );
}
