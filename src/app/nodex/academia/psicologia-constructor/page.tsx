'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { BrainCircuit, Briefcase, MonitorSmartphone, Users, Home, School, GraduationCap, ArrowRight } from 'lucide-react'
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
  `}</style>
);

// --- Componente de Tarjeta de Arquetipo ---
const ArchetypeCard = ({ icon, title, painPoint, aspiration }) => (
    <div className="creatuactivo-component-card p-6 h-full">
        <div className="flex items-center gap-3 mb-4">
            {icon}
            <h3 className="text-xl font-bold text-white">{title}</h3>
        </div>
        <div>
            <p className="text-sm font-semibold text-red-400/80">Dolor Principal:</p>
            <p className="text-slate-400 text-sm mb-3">{painPoint}</p>
            <p className="text-sm font-semibold text-green-400/80">Aspiración Clave:</p>
            <p className="text-slate-400 text-sm">{aspiration}</p>
        </div>
    </div>
);

// --- Componente Principal de la Página de Psicología del Constructor ---
export default function PsicologiaConstructorPage() {
    const archetypes = [
        { icon: <Briefcase className="w-6 h-6 text-cyan-400"/>, title: "Profesional Corporativo", painPoint: "Atrapado en la 'jaula de oro', intercambiando tiempo por un buen salario.", aspiration: "Construir un activo propio que le dé verdadera libertad y control." },
        { icon: <MonitorSmartphone className="w-6 h-6 text-orange-400"/>, title: "Emprendedor / Dueño de Negocio", painPoint: "Es el motor de su negocio, pero también su mayor cuello de botella. No puede escalar.", aspiration: "Un sistema que trabaje para él, permitiéndole pasar de operador a arquitecto." },
        { icon: <Users className="w-6 h-6 text-pink-400"/>, title: "Visionario Independiente", painPoint: "Su ingreso está 100% atado a sus horas. Ha alcanzado un techo en su potencial.", aspiration: "Convertir su talento en un activo que se multiplique sin su presencia constante." },
        { icon: <Home className="w-6 h-6 text-indigo-400"/>, title: "Líder del Hogar", painPoint: "Posee habilidades de gestión de élite, pero sin un vehículo para capitalizarlas.", aspiration: "Un proyecto con flexibilidad real para construir independencia económica y propósito." },
        { icon: <Users className="w-6 h-6 text-teal-400"/>, title: "Líder de Comunidad", painPoint: "Tiene una gran influencia y confianza, pero no un sistema para monetizarla.", aspiration: "Un vehículo para transformar su influencia en un legado tangible y un activo para su comunidad." },
        { icon: <School className="w-6 h-6 text-yellow-400"/>, title: "Estudiante", painPoint: "Enfrenta un futuro de deudas y competencia por empleos.", aspiration: "Construir un activo ahora para graduarse con independencia, no con deudas." },
    ];

    return (
        <>
            <GlobalStyles />
            <div className="flex min-h-screen bg-slate-900">
                <NodeXSidebar />
                <main className="flex-1 p-6">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                        <div className="mb-12">
                            <Link href="/nodex/academia/fundamentos" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">&larr; Volver a Fundamentos</Link>
                            <h1 className="creatuactivo-h1-ecosystem text-4xl md:text-5xl mt-4">
                                Módulo: La Psicología del Constructor Inteligente.
                            </h1>
                            <p className="text-slate-300 text-lg mt-2">No vendemos a un perfil, atraemos una mentalidad. Aquí aprenderás a identificar y conectar con ella.</p>
                        </div>

                        <div className="creatuactivo-component-card p-8 md:p-12 mb-12">
                            <div className="grid md:grid-cols-2 gap-8 items-center">
                                <div className="text-left">
                                    <h2 className="creatuactivo-h2-component text-3xl font-bold mb-4">El Filtro Real: Mentalidad, no Currículum</h2>
                                    <p className="text-slate-300 mb-6">El error de los modelos tradicionales es intentar convencer a todo el mundo. Nosotros no convencemos; buscamos y activamos a un tipo específico de persona: el **Constructor Inteligente**. Este módulo te enseñará a reconocer su ADN, entender su "dolor" silencioso y hablar el lenguaje de su aspiración.</p>
                                </div>
                                <div className="hidden md:flex items-center justify-center">
                                    <BrainCircuit size={128} className="text-purple-400/30" />
                                </div>
                            </div>
                        </div>

                        <div className="mb-12">
                             <h2 className="creatuactivo-h2-component text-3xl font-bold mb-8">La Radiografía de los 6 Arquetipos</h2>
                             <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {archetypes.map(arch => (
                                    <ArchetypeCard key={arch.title} {...arch} />
                                ))}
                            </div>
                        </div>

                        <section className="text-center py-20">
                             <div className="max-w-3xl mx-auto">
                                <h2 className="creatuactivo-h2-component text-3xl md:text-5xl font-bold mb-6">Ahora, a la Práctica.</h2>
                                <p className="text-slate-400 text-lg mb-10">Ahora que entiendes la mentalidad, es hora de dominar las herramientas. El siguiente paso es el tour por tu Centro de Comando NodeX, donde aplicarás esta inteligencia.</p>
                                <Link href="/nodex" className="creatuactivo-cta-ecosystem text-lg inline-block">
                                    Ir a mi Centro de Comando NodeX
                                </Link>
                            </div>
                        </section>

                    </motion.div>
                </main>
            </div>
        </>
    );
}
