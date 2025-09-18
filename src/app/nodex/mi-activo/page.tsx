'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { GitBranch, Users, BarChart3, DollarSign, ArrowRight } from 'lucide-react'
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
    .creatuactivo-ecosystem-card {
      background: linear-gradient(135deg,
        rgba(30, 64, 175, 0.15) 0%,
        rgba(124, 58, 237, 0.15) 50%,
        rgba(245, 158, 11, 0.15) 100%);
      backdrop-filter: blur(24px);
      border: 1px solid rgba(124, 58, 237, 0.2);
      border-radius: 20px;
      transition: all 0.4s ease;
      position: relative;
      overflow: hidden;
    }
    .creatuactivo-ecosystem-card:hover {
      border-color: rgba(245, 158, 11, 0.5);
      transform: translateY(-4px) scale(1.02);
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
      transform: translateY(-4px);
      border-color: rgba(245, 158, 11, 0.4);
      box-shadow: 0 15px 40px rgba(30, 64, 175, 0.15);
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

// --- Componente de Tarjeta de Métrica Detallada (Sin cambios) ---
const DetailMetricCard = ({ title, value, change, icon }) => (
    <div className="creatuactivo-component-card p-6">
        <div className="flex items-center gap-4">
            <div className="bg-slate-800/50 p-3 rounded-lg">{icon}</div>
            <div>
                <p className="text-slate-400 text-sm font-medium">{title}</p>
                <div className="flex items-baseline gap-2">
                    <p className="text-2xl font-bold text-white">{value}</p>
                    {change && <p className="text-sm font-semibold text-green-400">{change}</p>}
                </div>
            </div>
        </div>
    </div>
);

// --- Componente Principal de la Página "Mi Activo" (ACTUALIZADO) ---
export default function MiActivoPage() {
    const constructores = [
        { name: 'Ana Sofía R.', status: 'Activo', volume: '150 CV' },
        { name: 'Javier Mendoza', status: 'Activo', volume: '200 CV' },
        { name: 'David Chen', status: 'En Proceso', volume: '50 CV' },
    ];

    return (
        <>
            <GlobalStyles />
            {/* AJUSTE: Se utiliza NodeXSidebar como el layout principal que envuelve todo el contenido. */}
            <NodeXSidebar>
                <div className="p-6 text-white relative">
                    {/* Background Effects */}
                    <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                        <div className="absolute -top-1/4 -left-1/4 w-96 h-96 bg-[var(--creatuactivo-blue)] opacity-10 rounded-full filter blur-3xl animate-pulse"></div>
                        <div className="absolute -bottom-1/4 -right-1/4 w-96 h-96 bg-[var(--creatuactivo-purple)] opacity-10 rounded-full filter blur-3xl animate-pulse animation-delay-4000"></div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="relative z-10 max-w-6xl mx-auto"
                    >
                        {/* Header Mi Activo */}
                        <div className="mb-12">
                            <h1 className="creatuactivo-h1-ecosystem text-4xl md:text-5xl">
                                La Arquitectura de tu Activo.
                            </h1>
                            <p className="text-slate-300 text-lg mt-2">Aquí es donde visualizas el crecimiento de tu canal de distribución y analizas su rendimiento.</p>
                        </div>

                        {/* Métricas del Activo */}
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                            <DetailMetricCard
                                title="Constructores Totales"
                                value="3"
                                change="+1 esta semana"
                                icon={<Users className="w-6 h-6 text-blue-400"/>}
                            />
                            <DetailMetricCard
                                title="Volumen del Canal (Mes)"
                                value="400 CV"
                                change="+50 CV vs. semana pasada"
                                icon={<BarChart3 className="w-6 h-6 text-purple-400"/>}
                            />
                            <DetailMetricCard
                                title="Ingreso Residual (Mes)"
                                value="$1,530,000"
                                change="+12%"
                                icon={<DollarSign className="w-6 h-6 text-green-400"/>}
                            />
                            <DetailMetricCard
                                title="Nuevos Prospectos (IAA)"
                                value="8"
                                change="3 en ACOGER"
                                icon={<GitBranch className="w-6 h-6 text-yellow-400"/>}
                            />
                        </div>

                        {/* Ecosistema de Constructores */}
                        <div className="creatuactivo-ecosystem-card p-8 mb-12">
                            <h2 className="creatuactivo-h2-component text-2xl font-bold mb-6">Tu Ecosistema de Constructores</h2>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-white/10 text-sm text-slate-400">
                                            <th className="p-4">Constructor</th>
                                            <th className="p-4">Estado</th>
                                            <th className="p-4">Volumen (Últimos 30 días)</th>
                                            <th className="p-4">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {constructores.map((c, i) => (
                                            <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                                <td className="p-4 font-semibold text-white">{c.name}</td>
                                                <td className="p-4">
                                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${c.status === 'Activo' ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                                                        {c.status}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-slate-300">{c.volume}</td>
                                                <td className="p-4">
                                                    <button className="text-blue-400 hover:text-blue-300 text-sm font-semibold transition-colors">
                                                        Ver Detalles
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {constructores.length === 0 && (
                                <div className="text-center py-12">
                                    <GitBranch className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                                    <p className="text-slate-400 mb-2">Tu ecosistema está esperando crecer</p>
                                    <p className="text-slate-500 text-sm">Los constructores activados aparecerán aquí</p>
                                </div>
                            )}
                        </div>

                        {/* CTA Final a Academia */}
                        <section className="text-center py-20">
                             <div className="max-w-3xl mx-auto">
                                <h2 className="creatuactivo-h2-component text-3xl md:text-5xl font-bold mb-6">Esto es solo el Comienzo.</h2>
                                <p className="text-slate-400 text-lg mb-10">Tu activo está vivo y en constante crecimiento. El siguiente paso es seguir nutriéndolo con conocimiento. Visita la Academia para dominar las estrategias de escalabilidad.</p>
                                <Link href="/nodex/academia" className="creatuactivo-cta-ecosystem text-lg inline-block">
                                    Ir a la Academia
                                </Link>
                            </div>
                        </section>

                    </motion.div>
                </div>
            </NodeXSidebar>
        </>
    );
}
