/**
 * Copyright © 2025 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * Este software es propiedad privada y confidencial de CreaTuActivo.com.
 * Prohibida su reproducción, distribución o uso sin autorización escrita.
 *
 * Para consultas de licenciamiento: legal@creatuactivo.com
 */

'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Users, Mic, Calendar } from 'lucide-react'
import Link from 'next/link'
import StrategicNavigation from '@/components/StrategicNavigation'

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

    .creatuactivo-component-card:hover {
      transform: translateY(-8px);
      border-color: rgba(245, 158, 11, 0.4);
      box-shadow: 0 20px 60px rgba(30, 64, 175, 0.2);
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

    .creatuactivo-cta-ecosystem:hover {
      transform: translateY(-3px);
      box-shadow: 0 12px 35px rgba(30, 64, 175, 0.5);
    }
  `}</style>
);

// --- Datos de Miembros de la Comunidad (Placeholder) ---
const communityMembers = [
    { name: 'Ana Sofía R.', role: 'Profesional Corporativo', story: '"Pude construir mi Plan B sin dejar mi trabajo. Ahora mi activo genera más que mi salario."', img: 'https://placehold.co/100x100/1e293b/94a3b8?text=AR' },
    { name: 'Javier Mendoza', role: 'Emprendedor Actual', story: '"El ecosistema me dio el sistema que necesitaba para escalar. Dejé de ser el cuello de botella de mi propio negocio."', img: 'https://placehold.co/100x100/1e293b/94a3b8?text=JM' },
    { name: 'Carolina Vélez', role: 'Líder del Hogar', story: '"Construí un activo rentable en mi propio horario, sin sacrificar el tiempo con mis hijos. Es libertad real."', img: 'https://placehold.co/100x100/1e293b/94a3b8?text=CV' },
    { name: 'David Chen', role: 'Talento Emergente', story: '"Me gradué de la universidad con un activo que ya facturaba. Fue la mejor decisión de mi vida."', img: 'https://placehold.co/100x100/1e293b/94a3b8?text=DC' },
];

// --- Componente de Tarjeta de Testimonio ---
const TestimonialCard = ({ member }) => (
    <div className="creatuactivo-component-card p-6 h-full flex flex-col">
        <p className="text-slate-300 italic flex-grow">"{member.story}"</p>
        <div className="mt-4 flex items-center gap-4 pt-4 border-t border-white/10">
            <img src={member.img} alt={member.name} className="w-12 h-12 rounded-full border-2 border-purple-500/50" />
            <div>
                <p className="font-bold text-white">{member.name}</p>
                <p className="text-sm text-purple-400">{member.role}</p>
            </div>
        </div>
    </div>
);

// --- Componente Principal de la Página de la Comunidad ---
export default function ComunidadPage() {
    return (
        <>
            <GlobalStyles />
            <div className="bg-slate-900 text-white">
                <StrategicNavigation />
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                    <div className="absolute -top-1/4 -left-1/4 w-96 h-96 bg-[var(--creatuactivo-blue)] opacity-10 rounded-full filter blur-3xl animate-pulse"></div>
                    <div className="absolute top-1/4 -right-1/4 w-96 h-96 bg-[var(--creatuactivo-purple)] opacity-10 rounded-full filter blur-3xl animate-pulse animation-delay-2000"></div>
                </div>

                <main className="relative z-10 p-4 lg:p-8">
                    <section className="text-center max-w-4xl mx-auto pt-20 pb-20 lg:pb-28">
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                            <div className="inline-block bg-teal-500/10 text-teal-300 font-semibold text-sm uppercase tracking-wider px-4 py-2 rounded-full mb-6 border border-teal-500/30">
                                El Ecosistema Humano
                            </div>
                            <h1 className="creatuactivo-h1-ecosystem text-4xl md:text-6xl mb-6">
                                No Construyes Solo.
                            </h1>
                            <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto">
                                Bienvenido al corazón de CreaTuActivo.com: una comunidad vibrante de arquitectos, mentores y pioneros que comparten la misma visión de construir un futuro en sus propios términos.
                            </p>
                        </motion.div>
                    </section>

                    <section className="max-w-7xl mx-auto mb-20 lg:mb-32">
                        <div className="text-center max-w-3xl mx-auto mb-12">
                            <h2 className="creatuactivo-h2-component text-3xl md:text-5xl font-bold mb-4">El Muro de los Constructores</h2>
                            <p className="text-slate-400 text-lg">Historias reales de personas reales que están transformando su realidad con nuestro ecosistema.</p>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {communityMembers.map((member) => (
                                <TestimonialCard key={member.name} member={member} />
                            ))}
                        </div>
                    </section>

                    <section className="max-w-5xl mx-auto mb-20 lg:mb-32 creatuactivo-component-card p-8 md:p-12">
                         <div className="text-center mb-12">
                            <h2 className="creatuactivo-h2-component text-3xl md:text-4xl font-bold">Un Ecosistema en Acción</h2>
                            <p className="text-slate-400 mt-2">La comunidad no es estática. Es un entorno dinámico de crecimiento, aprendizaje y conexión.</p>
                        </div>
                        <div className="grid md:grid-cols-3 gap-8 text-center">
                            <div className="space-y-3">
                                <div className="inline-block bg-blue-500/10 p-4 rounded-xl"><Mic className="w-8 h-8 text-blue-300"/></div>
                                <h4 className="text-xl font-bold text-white">Webinars Semanales</h4>
                                <p className="text-slate-400 text-sm">Sesiones de estrategia en vivo con los arquitectos principales y líderes del ecosistema.</p>
                            </div>
                            <div className="space-y-3">
                                <div className="inline-block bg-purple-500/10 p-4 rounded-xl"><Users className="w-8 h-8 text-purple-300"/></div>
                                <h4 className="text-xl font-bold text-white">Grupos de Apoyo</h4>
                                <p className="text-slate-400 text-sm">Conecta con constructores de tu mismo perfil en círculos de mastermind para acelerar tu crecimiento.</p>
                            </div>
                            <div className="space-y-3">
                                <div className="inline-block bg-yellow-500/10 p-4 rounded-xl"><Calendar className="w-8 h-8 text-yellow-300"/></div>
                                <h4 className="text-xl font-bold text-white">Eventos Presenciales</h4>
                                <p className="text-slate-400 text-sm">Convenciones y retiros de liderazgo que combinan formación de alto nivel con experiencias inolvidables.</p>
                            </div>
                        </div>
                    </section>

                    <section className="text-center py-20">
                         <div className="max-w-3xl mx-auto">
                            <h2 className="creatuactivo-h2-component text-3xl md:text-5xl font-bold mb-6">Tu Silla en la Mesa está Esperando.</h2>
                            <p className="text-slate-400 text-lg mb-10">Más que unirte a un negocio, te unes a un movimiento. Es hora de encontrar tu lugar entre los constructores.</p>
                            <Link href="/fundadores" className="creatuactivo-cta-ecosystem text-lg inline-block">
                                Convertirme en Fundador
                            </Link>
                        </div>
                    </section>
                </main>
            </div>
        </>
    );
}
