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
import { Globe, ShieldCheck, Zap, BrainCircuit, GitBranch, Award } from 'lucide-react'
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

    .creatuactivo-ecosystem-card {
      background: linear-gradient(135deg,
        rgba(30, 64, 175, 0.15) 0%,
        rgba(124, 58, 237, 0.15) 50%,
        rgba(245, 158, 11, 0.15) 100%);
      backdrop-filter: blur(24px);
      border: 2px solid rgba(245, 158, 11, 0.3);
      border-radius: 20px;
      box-shadow:
        0 12px 40px rgba(30, 64, 175, 0.2),
        0 6px 20px rgba(124, 58, 237, 0.15),
        0 2px 10px rgba(245, 158, 11, 0.1);
      transition: all 0.4s ease;
      position: relative;
      overflow: hidden;
    }

    .creatuactivo-ecosystem-card:hover {
      border-color: rgba(245, 158, 11, 0.5);
      transform: translateY(-4px) scale(1.02);
      box-shadow:
        0 20px 60px rgba(30, 64, 175, 0.25),
        0 10px 30px rgba(124, 58, 237, 0.2),
        0 4px 15px rgba(245, 158, 11, 0.15);
    }

    .creatuactivo-ecosystem-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 1px;
      background: linear-gradient(135deg, var(--creatuactivo-blue) 0%, var(--creatuactivo-purple) 50%, var(--creatuactivo-gold) 100%);
    }

    .creatuactivo-gano-card {
      background: linear-gradient(135deg,
        rgba(146, 64, 14, 0.15) 0%,
        rgba(116, 66, 16, 0.1) 100%);
      border: 1px solid rgba(146, 64, 14, 0.3);
      border-radius: 16px;
      backdrop-filter: blur(24px);
      transition: all 0.4s ease;
    }

    .creatuactivo-gano-card:hover {
      border-color: rgba(245, 158, 11, 0.4);
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(146, 64, 14, 0.2);
    }

    .creatuactivo-sinergia-card {
      background: linear-gradient(135deg, rgba(30, 64, 175, 0.1) 0%, rgba(124, 58, 237, 0.1) 100%);
      border: 1px solid rgba(124, 58, 237, 0.2);
      border-radius: 20px;
      backdrop-filter: blur(24px);
      transition: all 0.4s ease;
    }

    .creatuactivo-sinergia-card:hover {
      border-color: rgba(245, 158, 11, 0.3);
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(30, 64, 175, 0.15);
    }
  `}</style>
);

// --- Componente de Cabecera de Página ---
const PageHeader = ({ title, subtitle }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
    className="text-center max-w-4xl mx-auto pt-20 pb-16"
  >
    <h1 className="creatuactivo-h1-ecosystem text-4xl md:text-6xl lg:text-7xl mb-4 leading-tight">
      {title}
    </h1>
    <p className="text-lg md:text-xl text-slate-300">
      {subtitle}
    </p>
  </motion.div>
);

// --- Componente de Tarjeta de Pilar ---
const PillarCard = ({ icon, title, children }) => (
  <div className="creatuactivo-ecosystem-card p-8 h-full">
    <div className="flex items-center gap-4 mb-6">
      <div className="bg-[var(--creatuactivo-gold)]/20 p-3 rounded-lg">
        {icon}
      </div>
      <h3 className="text-2xl font-bold text-white">{title}</h3>
    </div>
    <div className="text-slate-400 space-y-4">
      {children}
    </div>
  </div>
);

// --- Componente Principal de la Página del Socio Corporativo ---
export default function SocioCorporativoPage() {
  return (
    <>
      <GlobalStyles />
      <div className="bg-slate-900 text-white">
        <StrategicNavigation />

        {/* --- Fondo Decorativo Oficial --- */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-[var(--creatuactivo-gold)]/10 rounded-full filter blur-3xl opacity-50 animate-pulse"></div>
          <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[var(--creatuactivo-blue)]/10 rounded-full filter blur-3xl opacity-50 animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-[var(--creatuactivo-purple)]/10 rounded-full filter blur-3xl opacity-30 animate-pulse transform -translate-x-1/2 -translate-y-1/2"></div>
        </div>

        <main className="relative z-10 p-4 lg:p-8">
          <PageHeader
            title="El Motor de la Nueva Categoría"
            subtitle="Un ecosistema tecnológico tan avanzado necesita un motor de valor igual de robusto, probado y, sobre todo, único. Esa base es nuestro socio corporativo: Gano Excel."
          />

          {/* --- Sección de Pilares --- */}
          <section className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8 mb-20 lg:mb-32">
            <PillarCard
              icon={<Globe className="w-8 h-8 text-[var(--creatuactivo-gold)]" />}
              title="Pilar de Credibilidad"
            >
              <p>En un mundo de promesas fugaces, nos anclamos en la historia. Gano Excel, fundada en 1995 por el visionario micólogo Sr. Leow Soon Seng, es una institución global con más de 30 años de liderazgo científico.</p>
              <ul className="list-disc list-inside space-y-2">
                <li><span className="font-semibold text-white">Presencia Global:</span> Operaciones en más de 60 países que soportan nuestro ecosistema en América.</li>
                <li><span className="font-semibold text-white">Visión Alineada:</span> Su misión de llevar bienestar a cada familia potencia nuestra arquitectura tecnológica.</li>
              </ul>
            </PillarCard>

            <PillarCard
              icon={<Award className="w-8 h-8 text-[var(--creatuactivo-gold)]" />}
              title="Pilar de Unicidad"
            >
              <p>Esta es nuestra ventaja competitiva más profunda. Gano Excel es la <span className="font-semibold text-white">única compañía en el mundo</span> que posee la patente para un extracto de Ganoderma lucidum 100% soluble.</p>
              <p>Como constructor, no distribuyes un producto genérico; construyes tu activo sobre una pieza de propiedad intelectual única. Eliminas la competencia y te posicionas en una categoría propia desde el día uno.</p>
            </PillarCard>
          </section>

          {/* --- Sección de Sinergia --- */}
          <section className="max-w-5xl mx-auto text-center mb-20 lg:mb-32">
            <h2 className="creatuactivo-h2-component text-3xl md:text-5xl font-bold mb-6">La Sinergia Perfecta: <br/> Lo Mejor de Dos Mundos</h2>
            <p className="text-slate-300 text-lg max-w-3xl mx-auto mb-12">
              La clave de nuestra arquitectura de negocio superior es la perfecta definición de roles. Tú, como constructor, obtienes el beneficio de una base sólida y una superestructura tecnológica.
            </p>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="creatuactivo-sinergia-card p-8 text-left">
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                  <ShieldCheck className="w-7 h-7 text-[var(--creatuactivo-gold)]"/>
                  Gano Excel provee:
                </h3>
                <ul className="space-y-3 text-slate-300">
                  <li className="flex items-start gap-3"><span className="text-green-400 mt-1">✓</span>La Ciencia y el Producto Patentado.</li>
                  <li className="flex items-start gap-3"><span className="text-green-400 mt-1">✓</span>La Infraestructura Física y Logística.</li>
                  <li className="flex items-start gap-3"><span className="text-green-400 mt-1">✓</span>La Transparencia y el Pago de Comisiones.</li>
                </ul>
              </div>
              <div className="creatuactivo-sinergia-card p-8 text-left">
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                  <Zap className="w-7 h-7 text-[var(--creatuactivo-purple)]"/>
                  CreaTuActivo provee:
                </h3>
                <ul className="space-y-3 text-slate-300">
                  <li className="flex items-start gap-3"><span className="text-green-400 mt-1">✓</span>La Arquitectura Tecnológica (Aplicación CreaTuActivo y NEXUS IA).</li>
                  <li className="flex items-start gap-3"><span className="text-green-400 mt-1">✓</span>El Sistema de Crecimiento (Los 3 Pasos: IAA).</li>
                  <li className="flex items-start gap-3"><span className="text-green-400 mt-1">✓</span>La Experiencia del Constructor Inteligente.</li>
                </ul>
              </div>
            </div>
            <p className="mt-8 text-xl font-semibold bg-gradient-to-r from-[var(--creatuactivo-blue)] to-[var(--creatuactivo-purple)] bg-clip-text text-transparent">
              Gano Excel nos da la solidez y la exclusividad. Nosotros te damos la velocidad y la inteligencia.
            </p>
          </section>

          {/* --- Sección Video --- */}
          <section className="max-w-4xl mx-auto text-center mb-20 lg:mb-32">
              <h2 className="creatuactivo-h2-component text-3xl md:text-4xl font-bold mb-6">Una Trayectoria de Impacto en las Américas</h2>
              <p className="text-slate-400 mb-8">Este video ofrece una perspectiva sobre la sólida base sobre la cual construimos nuestro innovador ecosistema.</p>
              <div className="creatuactivo-gano-card p-4">
                <div className="aspect-video bg-slate-800 rounded-lg border border-white/10 overflow-hidden">
                    <iframe
                        width="100%"
                        height="100%"
                        src="https://www.youtube.com/embed/0lJ-aLvkQL4"
                        title="Gano Excel - Trayectoria de Impacto en las Américas"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen>
                    </iframe>
                </div>
              </div>
          </section>

          {/* --- CTA Final --- */}
          <section className="max-w-4xl mx-auto text-center py-20">
            <div className="creatuactivo-ecosystem-card p-12">
              <h2 className="creatuactivo-h2-component text-3xl md:text-4xl font-bold mb-6">Construye sobre Base Sólida</h2>
              <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto">
                La combinación de 30+ años de Gano Excel + la tecnología CreaTuActivo.com crea una ventaja competitiva que ningún competidor puede replicar.
              </p>
              <Link
                href="/fundadores"
                className="inline-block bg-gradient-to-r from-[var(--creatuactivo-blue)] to-[var(--creatuactivo-purple)] text-white font-bold py-4 px-8 rounded-lg shadow-lg hover:scale-105 transition-transform duration-300"
              >
                Activar Mi Ecosistema
              </Link>
            </div>
          </section>

          {/* --- Footer --- */}
          <footer className="border-t border-white/10 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-slate-400 text-sm">
              <p>&copy; {new Date().getFullYear()} CreaTuActivo.com. Todos los derechos reservados.</p>
              <p className="mt-2">El primer ecosistema tecnológico completo para construcción de activos en América.</p>
            </div>
          </footer>
        </main>
      </div>
    </>
  );
}
