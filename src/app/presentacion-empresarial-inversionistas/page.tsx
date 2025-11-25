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

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Lock,
  TrendingUp,
  DollarSign,
  Users,
  Target,
  Shield,
  Zap,
  BarChart3,
  Clock,
  Award,
  CheckCircle,
  AlertTriangle,
  FileText,
  Calendar,
  Building2,
  Rocket,
  ChevronDown,
  ChevronRight,
  ExternalLink
} from 'lucide-react'
import Link from 'next/link'

// --- Estilos Globales ---
const GlobalStyles = () => (
  <style jsx global>{`
    :root {
      --investor-blue: #0F172A;
      --investor-gold: #F59E0B;
      --investor-green: #10B981;
      --investor-red: #EF4444;
    }
    .investor-gradient-bg {
      background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%);
    }
    .investor-card {
      background: rgba(30, 41, 59, 0.5);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(148, 163, 184, 0.1);
      border-radius: 16px;
      transition: all 0.3s ease;
    }
    .investor-card:hover {
      border-color: rgba(245, 158, 11, 0.3);
      transform: translateY(-4px);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    }
    .investor-stat-card {
      background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(6, 182, 212, 0.1) 100%);
      border: 1px solid rgba(16, 185, 129, 0.2);
      border-radius: 12px;
      padding: 1.5rem;
    }
    .investor-warning-card {
      background: linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(251, 146, 60, 0.1) 100%);
      border: 1px solid rgba(239, 68, 68, 0.2);
      border-radius: 12px;
      padding: 1.5rem;
    }
    .investor-table {
      border-collapse: separate;
      border-spacing: 0;
      width: 100%;
      background: rgba(15, 23, 42, 0.5);
      border-radius: 12px;
      overflow: hidden;
    }
    .investor-table th {
      background: rgba(30, 41, 59, 0.8);
      padding: 1rem;
      text-align: left;
      font-weight: 600;
      color: #F59E0B;
    }
    .investor-table td {
      padding: 1rem;
      border-top: 1px solid rgba(148, 163, 184, 0.1);
      color: #CBD5E1;
    }
    .investor-table tr:hover td {
      background: rgba(30, 41, 59, 0.3);
    }
  `}</style>
);

// --- Componentes ---
const ConfidentialBanner = () => (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-8 flex items-start gap-3"
  >
    <Lock className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
    <div>
      <h3 className="font-bold text-red-400 mb-1">DOCUMENTO CONFIDENCIAL</h3>
      <p className="text-sm text-slate-300">
        Esta información es exclusiva para inversionistas potenciales.
        Prohibida su reproducción o distribución sin autorización escrita.
      </p>
    </div>
  </motion.div>
);

const SectionHeader = ({ icon, title, subtitle }: { icon: React.ReactNode, title: string, subtitle: string }) => (
  <div className="mb-8">
    <div className="flex items-center gap-3 mb-2">
      <div className="text-amber-400">{icon}</div>
      <h2 className="text-3xl md:text-4xl font-bold text-white">{title}</h2>
    </div>
    <p className="text-lg text-slate-400">{subtitle}</p>
  </div>
);

const StatCard = ({ value, label, sublabel, trend }: { value: string, label: string, sublabel?: string, trend?: 'up' | 'down' | 'neutral' }) => (
  <div className="investor-stat-card">
    <div className="text-3xl md:text-4xl font-extrabold text-white mb-2">
      {value}
    </div>
    <div className="text-sm font-semibold text-slate-300 mb-1">{label}</div>
    {sublabel && <div className="text-xs text-slate-500">{sublabel}</div>}
    {trend && (
      <div className={`text-xs mt-2 flex items-center gap-1 ${
        trend === 'up' ? 'text-green-400' : trend === 'down' ? 'text-red-400' : 'text-slate-400'
      }`}>
        <TrendingUp className="w-3 h-3" />
        {trend === 'up' ? 'Tendencia positiva' : trend === 'down' ? 'Requiere atención' : 'Estable'}
      </div>
    )}
  </div>
);

const ComparisonTable = () => (
  <div className="overflow-x-auto">
    <table className="investor-table">
      <thead>
        <tr>
          <th>Inversión</th>
          <th>Capital Inicial</th>
          <th>ROI Anual</th>
          <th>Recuperación</th>
          <th>Escalabilidad</th>
        </tr>
      </thead>
      <tbody>
        <tr className="bg-green-500/5">
          <td className="font-bold text-green-400">CreaTuActivo</td>
          <td>$205M COP</td>
          <td className="text-green-400 font-bold">45-90%</td>
          <td className="text-green-400 font-bold">24-30 meses</td>
          <td className="text-green-400 font-bold">Exponencial</td>
        </tr>
        <tr>
          <td>Apartamento alquiler</td>
          <td>$400M COP</td>
          <td>8-12%</td>
          <td>8-12 años</td>
          <td>Lineal</td>
        </tr>
        <tr>
          <td>Local comercial</td>
          <td>$600M COP</td>
          <td>10-15%</td>
          <td>6-10 años</td>
          <td>Lineal</td>
        </tr>
        <tr>
          <td>Acciones bolsa</td>
          <td>Variable</td>
          <td>10-15%</td>
          <td>N/A</td>
          <td>Media</td>
        </tr>
      </tbody>
    </table>
  </div>
);

const RiskCard = ({ title, probability, impact, mitigation }: {
  title: string,
  probability: 'low' | 'medium' | 'high',
  impact: 'low' | 'medium' | 'high',
  mitigation: string
}) => {
  const probabilityColor = probability === 'high' ? 'text-red-400' : probability === 'medium' ? 'text-yellow-400' : 'text-green-400';
  const impactColor = impact === 'high' ? 'text-red-400' : impact === 'medium' ? 'text-yellow-400' : 'text-green-400';

  return (
    <div className="investor-card p-6">
      <h4 className="font-bold text-white mb-3">{title}</h4>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <span className="text-xs text-slate-500">Probabilidad</span>
          <div className={`text-sm font-bold ${probabilityColor} capitalize`}>{probability}</div>
        </div>
        <div>
          <span className="text-xs text-slate-500">Impacto</span>
          <div className={`text-sm font-bold ${impactColor} capitalize`}>{impact}</div>
        </div>
      </div>
      <div className="bg-blue-500/10 border border-blue-500/20 rounded p-3">
        <p className="text-xs font-semibold text-blue-400 mb-1">MITIGACIÓN:</p>
        <p className="text-sm text-slate-300">{mitigation}</p>
      </div>
    </div>
  );
};

const TimelineItem = ({ quarter, title, budget, goals }: { quarter: string, title: string, budget: string, goals: string[] }) => (
  <div className="investor-card p-6">
    <div className="flex items-center gap-3 mb-3">
      <div className="bg-amber-500/20 text-amber-400 font-bold px-3 py-1 rounded-full text-sm">
        {quarter}
      </div>
      <h4 className="font-bold text-white">{title}</h4>
    </div>
    <div className="text-2xl font-bold text-green-400 mb-4">{budget}</div>
    <ul className="space-y-2">
      {goals.map((goal, idx) => (
        <li key={idx} className="flex items-start gap-2 text-sm text-slate-300">
          <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
          <span>{goal}</span>
        </li>
      ))}
    </ul>
  </div>
);

// --- Componente Principal ---
export default function PresentacionInversionistasPage() {
  const [teamSize, setTeamSize] = useState(100);
  const [weeklyIncome, setWeeklyIncome] = useState(0);
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [annualIncome, setAnnualIncome] = useState(0);
  const [roi, setROI] = useState(0);

  useEffect(() => {
    const incomePerPerson = 19125; // COP por persona/semana
    const weekly = teamSize * incomePerPerson;
    const monthly = weekly * 4;
    const annual = monthly * 12;
    const investment = 205000000; // COP
    const roiCalc = ((annual - investment) / investment) * 100;

    setWeeklyIncome(weekly);
    setMonthlyIncome(monthly);
    setAnnualIncome(annual);
    setROI(roiCalc);
  }, [teamSize]);

  return (
    <>
      <GlobalStyles />
      <div className="investor-gradient-bg min-h-screen text-white">
        <div className="max-w-7xl mx-auto px-4 py-12 lg:py-20">

          {/* Confidential Banner */}
          <ConfidentialBanner />

          {/* Hero Section */}
          <section className="mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-block bg-amber-500/10 border border-amber-500/30 px-4 py-2 rounded-full mb-6">
                <span className="text-amber-400 font-semibold text-sm">PROPUESTA DE INVERSIÓN</span>
              </div>

              <h1 className="text-5xl md:text-7xl font-extrabold mb-6">
                <span className="bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 bg-clip-text text-transparent">
                  CreaTuActivo.com
                </span>
              </h1>

              <p className="text-2xl md:text-3xl text-slate-300 mb-8 max-w-3xl">
                Plataforma Tecnológica para Automatización de Network Marketing
              </p>

              <div className="grid md:grid-cols-3 gap-6">
                <StatCard
                  value="$290M COP"
                  label="Inversión Recomendada"
                  sublabel="~$64,500 USD (Opción 2)"
                />
                <StatCard
                  value="12 Meses"
                  label="Hasta Autosostenibilidad"
                  sublabel="Garantizados sin recortes"
                  trend="up"
                />
                <StatCard
                  value="127%"
                  label="ROI Proyectado Año 2"
                  sublabel="24-30 meses recuperación total"
                  trend="up"
                />
              </div>
            </motion.div>
          </section>

          {/* 3 Opciones de Inversión */}
          <section className="mb-20">
            <SectionHeader
              icon={<DollarSign size={32} />}
              title="3 Opciones de Inversión"
              subtitle="Elige el nivel de compromiso que mejor se ajuste a tu perfil"
            />

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Opción 1: Conservadora */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="investor-card p-8 relative"
              >
                <div className="absolute top-4 right-4">
                  <div className="bg-yellow-500/20 text-yellow-400 text-xs font-bold px-3 py-1 rounded-full">
                    RIESGO MEDIO
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-white mb-2">Opción 1: Conservadora</h3>
                <div className="text-4xl font-extrabold text-amber-400 mb-4">$205M COP</div>
                <p className="text-slate-500 text-sm mb-6">~$45,000 USD</p>

                <div className="bg-slate-900/50 rounded-lg p-4 mb-6">
                  <p className="text-sm text-slate-400 mb-2">DURACIÓN GARANTIZADA</p>
                  <p className="text-xl font-bold text-white">8-9 meses</p>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-300">Validación del modelo</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-300">Necesita 2da ronda mes 9</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-300">Marketing reducido</span>
                  </div>
                </div>

                <div className="border-t border-slate-700 pt-4 mb-4">
                  <p className="text-xs text-slate-500 mb-2">PARA QUIÉN:</p>
                  <p className="text-sm text-slate-300">Inversionista que quiere "probar" antes de comprometer más capital</p>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/20 rounded p-3">
                  <p className="text-xs font-semibold text-blue-400 mb-1">PROYECCIÓN MES 12:</p>
                  <p className="text-sm text-white">Estructura 60×60</p>
                  <p className="text-sm text-green-400 font-bold">$4.5M/mes ingreso red</p>
                </div>
              </motion.div>

              {/* Opción 2: Realista (RECOMENDADA) */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="investor-card p-8 relative ring-2 ring-amber-500"
              >
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-bold px-6 py-2 rounded-full shadow-lg">
                    ⭐ RECOMENDADA
                  </div>
                </div>

                <div className="absolute top-4 right-4">
                  <div className="bg-green-500/20 text-green-400 text-xs font-bold px-3 py-1 rounded-full">
                    RIESGO BAJO
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-white mb-2 mt-4">Opción 2: Realista</h3>
                <div className="text-4xl font-extrabold text-amber-400 mb-4">$290M COP</div>
                <p className="text-slate-500 text-sm mb-6">~$64,500 USD</p>

                <div className="bg-slate-900/50 rounded-lg p-4 mb-6">
                  <p className="text-sm text-slate-400 mb-2">DURACIÓN GARANTIZADA</p>
                  <p className="text-xl font-bold text-white">12 meses completos</p>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-300">Equipo completo profesional</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-300">Marketing escalado</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-300">Buffer 20% Claude API</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-300">Autosostenible mes 12-18</span>
                  </div>
                </div>

                <div className="border-t border-slate-700 pt-4 mb-4">
                  <p className="text-xs text-slate-500 mb-2">PARA QUIÉN:</p>
                  <p className="text-sm text-slate-300">Inversionista que comprende startups y busca ROI sólido</p>
                </div>

                <div className="bg-green-500/10 border border-green-500/20 rounded p-3">
                  <p className="text-xs font-semibold text-green-400 mb-1">PROYECCIÓN MES 12:</p>
                  <p className="text-sm text-white">Estructura 100×100</p>
                  <p className="text-sm text-green-400 font-bold">$7.6M/mes ingreso red</p>
                  <p className="text-xs text-slate-400 mt-1">Recuperación: 24-30 meses</p>
                </div>
              </motion.div>

              {/* Opción 3: Premium */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="investor-card p-8 relative"
              >
                <div className="absolute top-4 right-4">
                  <div className="bg-blue-500/20 text-blue-400 text-xs font-bold px-3 py-1 rounded-full">
                    CERO RIESGO
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-white mb-2">Opción 3: Premium</h3>
                <div className="text-4xl font-extrabold text-amber-400 mb-4">$380M COP</div>
                <p className="text-slate-500 text-sm mb-6">~$84,500 USD</p>

                <div className="bg-slate-900/50 rounded-lg p-4 mb-6">
                  <p className="text-sm text-slate-400 mb-2">DURACIÓN GARANTIZADA</p>
                  <p className="text-xl font-bold text-white">18 meses completos</p>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-300">Seguridad máxima</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-300">Break-even garantizado</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-300">Marketing agresivo</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-300">Proyecto genera utilidades</span>
                  </div>
                </div>

                <div className="border-t border-slate-700 pt-4 mb-4">
                  <p className="text-xs text-slate-500 mb-2">PARA QUIÉN:</p>
                  <p className="text-sm text-slate-300">Inversionista conservador que no quiere preocupaciones</p>
                </div>

                <div className="bg-purple-500/10 border border-purple-500/20 rounded p-3">
                  <p className="text-xs font-semibold text-purple-400 mb-1">PROYECCIÓN MES 18:</p>
                  <p className="text-sm text-white">Estructura 150×150</p>
                  <p className="text-sm text-green-400 font-bold">$11M/mes ingreso red</p>
                  <p className="text-xs text-slate-400 mt-1">Recuperación: 20-24 meses</p>
                </div>
              </motion.div>
            </div>

            {/* Tabla Comparativa Detallada */}
            <div className="mt-12 investor-card p-8">
              <h4 className="text-xl font-bold text-white mb-6">Tabla Comparativa Detallada</h4>
              <div className="overflow-x-auto">
                <table className="investor-table">
                  <thead>
                    <tr>
                      <th>Factor</th>
                      <th>Conservadora ($205M)</th>
                      <th className="bg-amber-500/10">Realista ($290M) ⭐</th>
                      <th>Premium ($380M)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="font-semibold">Duración garantizada</td>
                      <td>8-9 meses</td>
                      <td className="bg-amber-500/5">12 meses</td>
                      <td>18 meses</td>
                    </tr>
                    <tr>
                      <td className="font-semibold">Equipo completo desde</td>
                      <td>Mes 4</td>
                      <td className="bg-amber-500/5">Mes 4</td>
                      <td>Mes 1</td>
                    </tr>
                    <tr>
                      <td className="font-semibold">Marketing potencia</td>
                      <td>60%</td>
                      <td className="bg-amber-500/5">85%</td>
                      <td>100%</td>
                    </tr>
                    <tr>
                      <td className="font-semibold">Riesgo 2da ronda</td>
                      <td className="text-red-400">Alto (mes 9)</td>
                      <td className="bg-amber-500/5 text-green-400">Bajo</td>
                      <td className="text-green-400">Nulo</td>
                    </tr>
                    <tr>
                      <td className="font-semibold">Red proyectada (mes 12)</td>
                      <td>60×60</td>
                      <td className="bg-amber-500/5">100×100</td>
                      <td>120×120</td>
                    </tr>
                    <tr>
                      <td className="font-semibold">Ingreso mes 12</td>
                      <td>$4.5M/mes</td>
                      <td className="bg-amber-500/5 text-green-400 font-bold">$7.6M/mes</td>
                      <td>$9M/mes</td>
                    </tr>
                    <tr>
                      <td className="font-semibold">ROI Año 2</td>
                      <td>~90%</td>
                      <td className="bg-amber-500/5 font-bold">~127%</td>
                      <td>~96%</td>
                    </tr>
                    <tr>
                      <td className="font-semibold">Recuperación inversión</td>
                      <td>30-36 meses</td>
                      <td className="bg-amber-500/5 text-green-400 font-bold">24-30 meses</td>
                      <td>20-24 meses</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Resumen Ejecutivo */}
          <section className="mb-20">
            <SectionHeader
              icon={<FileText size={32} />}
              title="Resumen Ejecutivo"
              subtitle="La oportunidad en 3 minutos"
            />

            <div className="investor-card p-8 lg:p-12">
              <div className="grid lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-amber-400 mb-4">¿Qué es CreaTuActivo.com?</h3>
                  <p className="text-slate-300 leading-relaxed mb-6">
                    Plataforma SaaS que automatiza la construcción de redes de distribución en Network Marketing mediante:
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <Zap className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
                      <span className="text-slate-300">
                        <strong className="text-white">NEXUS AI:</strong> Chatbot conversacional (Claude Sonnet 4.5) que califica prospectos 24/7
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Target className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
                      <span className="text-slate-300">
                        <strong className="text-white">Sistema IAA:</strong> Metodología probada con 2,847 personas en 9 años
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Users className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
                      <span className="text-slate-300">
                        <strong className="text-white">Tracking Avanzado:</strong> Fingerprinting multicapa para 0% pérdida de leads
                      </span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-amber-400 mb-4">Propuesta de Valor para el Inversionista</h3>
                  <div className="space-y-4">
                    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                      <p className="text-sm text-green-400 font-semibold mb-2">RED EMPRESARIAL BAJO TU CÓDIGO</p>
                      <p className="text-sm text-slate-300">
                        No compras equity del software. Recibes la posición raíz en la red de distribución.
                      </p>
                    </div>

                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                      <p className="text-sm text-blue-400 font-semibold mb-2">PROYECCIÓN CONSERVADORA</p>
                      <p className="text-sm text-slate-300">
                        100 personas activas cada lado = <strong className="text-white">$1.5M COP/semana</strong> (ingreso residual)
                      </p>
                    </div>

                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
                      <p className="text-sm text-amber-400 font-semibold mb-2">LEGADO HEREDABLE</p>
                      <p className="text-sm text-slate-300">
                        Red transferible a generaciones futuras (como bienes raíces)
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* El Problema + La Solución */}
          <section className="mb-20">
            <SectionHeader
              icon={<AlertTriangle size={32} />}
              title="El Problema del Mercado"
              subtitle="Una oportunidad de $500M+ en distribuidores abandonados"
            />

            <div className="grid lg:grid-cols-2 gap-8 mb-12">
              <div className="investor-warning-card">
                <h3 className="text-xl font-bold text-red-400 mb-4">Dolor del Mercado</h3>
                <div className="space-y-4 text-slate-300">
                  <p>
                    <strong className="text-white">Gano Excel pre-pandemia:</strong> 600,000 distribuidores
                  </p>
                  <p>
                    <strong className="text-white">Gano Excel hoy:</strong> 53,700 distribuidores
                  </p>
                  <div className="text-3xl font-bold text-red-400 my-4">
                    91% deserción
                  </div>
                  <p className="text-sm">
                    Razón principal: "Es difícil" → En realidad: <strong className="text-white">falta de herramientas tecnológicas</strong>
                  </p>
                </div>
              </div>

              <div className="investor-stat-card">
                <h3 className="text-xl font-bold text-green-400 mb-4">La Oportunidad</h3>
                <div className="space-y-4 text-slate-300">
                  <p>
                    Los 546,300 distribuidores que abandonaron <strong className="text-white">NO perdieron la fe en el producto</strong> (patente mundial, 30+ años de respaldo).
                  </p>
                  <p>
                    Perdieron la fe en su capacidad de vender <strong className="text-white">sin herramientas</strong>.
                  </p>
                  <div className="bg-blue-500/20 border border-blue-500/30 rounded p-4 mt-4">
                    <p className="font-bold text-blue-400 text-lg">
                      CreaTuActivo.com recupera ese mercado ofreciendo lo que faltaba: automatización inteligente.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Calculadora ROI Interactiva */}
          <section className="mb-20">
            <SectionHeader
              icon={<BarChart3 size={32} />}
              title="Proyección de Retorno (ROI)"
              subtitle="Ajusta los números y visualiza tu retorno"
            />

            <div className="investor-card p-8 lg:p-12">
              <div className="mb-8">
                <label className="block text-slate-300 mb-4 text-center">
                  <span className="text-lg">Personas activas en tu red (cada lado): </span>
                  <span className="text-3xl font-bold text-amber-400">{teamSize}</span>
                </label>
                <input
                  type="range"
                  min="50"
                  max="500"
                  step="10"
                  value={teamSize}
                  onChange={(e) => setTeamSize(Number(e.target.value))}
                  className="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-slate-500 mt-2">
                  <span>50 (Mínimo Q1)</span>
                  <span>100 (Meta Año 1)</span>
                  <span>500 (Diamante)</span>
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-lg p-6 text-center">
                  <p className="text-xs text-slate-400 uppercase mb-2">Ingreso Semanal</p>
                  <p className="text-2xl font-bold text-green-400">
                    ${(weeklyIncome / 1000000).toFixed(2)}M
                  </p>
                  <p className="text-xs text-slate-500 mt-1">COP</p>
                </div>

                <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-lg p-6 text-center">
                  <p className="text-xs text-slate-400 uppercase mb-2">Ingreso Mensual</p>
                  <p className="text-2xl font-bold text-blue-400">
                    ${(monthlyIncome / 1000000).toFixed(2)}M
                  </p>
                  <p className="text-xs text-slate-500 mt-1">COP</p>
                </div>

                <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-lg p-6 text-center">
                  <p className="text-xs text-slate-400 uppercase mb-2">Ingreso Anual</p>
                  <p className="text-2xl font-bold text-purple-400">
                    ${(annualIncome / 1000000).toFixed(1)}M
                  </p>
                  <p className="text-xs text-slate-500 mt-1">COP</p>
                </div>

                <div className="bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-lg p-6 text-center">
                  <p className="text-xs text-slate-400 uppercase mb-2">ROI Año 1</p>
                  <p className={`text-2xl font-bold ${roi > 0 ? 'text-amber-400' : 'text-red-400'}`}>
                    {roi > 0 ? '+' : ''}{roi.toFixed(0)}%
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {roi > 100 ? 'Inversión recuperada' : 'En progreso'}
                  </p>
                </div>
              </div>

              <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-6">
                <h4 className="font-bold text-white mb-3">Análisis de Escenario Actual:</h4>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-slate-400">Inversión inicial:</span>
                    <p className="text-white font-bold">$205M COP</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Recuperación total:</span>
                    <p className="text-white font-bold">
                      {annualIncome > 0 ? Math.ceil((205000000 / annualIncome) * 12) : '∞'} meses
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-400">Valor red (5 años):</span>
                    <p className="text-white font-bold">
                      ${((annualIncome * 5) / 1000000).toFixed(0)}M COP
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Comparación de Inversiones */}
          <section className="mb-20">
            <SectionHeader
              icon={<Building2 size={32} />}
              title="Comparación con Otras Inversiones"
              subtitle="Para un inversionista con experiencia en bienes raíces"
            />

            <ComparisonTable />

            <div className="investor-card p-6 mt-8">
              <h4 className="font-bold text-amber-400 mb-3">Por qué CreaTuActivo es Superior:</h4>
              <ul className="grid md:grid-cols-2 gap-4">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
                  <span className="text-slate-300">
                    <strong className="text-white">Menor capital inicial:</strong> 50% menos que un apartamento
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
                  <span className="text-slate-300">
                    <strong className="text-white">ROI 5-7x mayor:</strong> 45-90% vs 8-12% de alquileres
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
                  <span className="text-slate-300">
                    <strong className="text-white">Recuperación 3x más rápida:</strong> 24-30 meses vs 8-12 años
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
                  <span className="text-slate-300">
                    <strong className="text-white">Escalabilidad exponencial:</strong> Red crece automáticamente
                  </span>
                </li>
              </ul>
            </div>
          </section>

          {/* Uso de Fondos */}
          <section className="mb-20">
            <SectionHeader
              icon={<DollarSign size={32} />}
              title="Uso de Fondos: $205M COP"
              subtitle="Desglose trimestral transparente"
            />

            <div className="grid lg:grid-cols-2 gap-8">
              <TimelineItem
                quarter="Q1 (Meses 1-3)"
                title="Construcción de Base"
                budget="$55M COP"
                goals={[
                  "Contratar marketero y desarrollador",
                  "Lanzar campaña digital (ads + SEO)",
                  "200 habladores QR en establecimientos",
                  "Desarrollar luiscabrejo.com",
                  "Meta: 30-50 fundadores"
                ]}
              />

              <TimelineItem
                quarter="Q2 (Meses 4-6)"
                title="Escalamiento"
                budget="$52M COP"
                goals={[
                  "Intensificar ads digitales",
                  "300 habladores adicionales",
                  "Prueba nuevos canales (TikTok, YouTube)",
                  "Meta: 80-100 fundadores, estructura 50x50"
                ]}
              />

              <TimelineItem
                quarter="Q3 (Meses 7-9)"
                title="Optimización"
                budget="$50M COP"
                goals={[
                  "Campaña retargeting",
                  "2 workshops presenciales",
                  "Features avanzados (analytics, gamificación)",
                  "Meta: 120 fundadores, estructura 80x80"
                ]}
              />

              <TimelineItem
                quarter="Q4 (Meses 10-12)"
                title="Autosostenibilidad"
                budget="$48M COP"
                goals={[
                  "Mantenimiento operativo",
                  "Preparación pre-lanzamiento constructores",
                  "Meta: 150 fundadores, estructura 100x100",
                  "Ingresos SaaS: $2,500 USD/mes"
                ]}
              />
            </div>
          </section>

          {/* Riesgos y Mitigaciones */}
          <section className="mb-20">
            <SectionHeader
              icon={<Shield size={32} />}
              title="Análisis de Riesgos"
              subtitle="Transparencia total: identificamos y mitigamos cada riesgo"
            />

            <div className="grid lg:grid-cols-2 gap-6">
              <RiskCard
                title="Tasa de Conversión Baja (Fundadores)"
                probability="medium"
                impact="high"
                mitigation="Validación temprana: primeros 20 fundadores en mes 1. Si tasa <10%: pivot a luiscabrejo.com (tráfico warm). Presupuesto reserva Q2."
              />

              <RiskCard
                title="Deserción de Fundadores"
                probability="medium"
                impact="medium"
                mitigation="Onboarding intensivo (2 semanas mentoría), comunidad activa (workshops mensuales), gamificación. NEXUS reduce fricción → menos deserción vs MLM tradicional."
              />

              <RiskCard
                title="Cambios en Gano Excel"
                probability="low"
                impact="high"
                mitigation="Relación directa con pareja de Diamantes. Contrato legal con Gano Excel (en progreso). Plan B: plataforma adaptable a otras empresas MLM."
              />

              <RiskCard
                title="Autosostenibilidad No Lograda en 12 Meses"
                probability="medium"
                impact="high"
                mitigation="Contingencia en presupuesto (10%). Opción: segunda ronda inversionista (mes 10). Peor caso: reducción equipo, Luis tiempo completo ventas."
              />
            </div>
          </section>

          {/* Track Record */}
          <section className="mb-20">
            <SectionHeader
              icon={<Award size={32} />}
              title="Tracción y Validación"
              subtitle="Activos existentes y prueba social"
            />

            <div className="grid lg:grid-cols-3 gap-6 mb-8">
              <StatCard
                value="$30K USD"
                label="Invertidos por Luis"
                sublabel="Software 100% funcional"
                trend="up"
              />
              <StatCard
                value="9 Años"
                label="Track Record"
                sublabel="2,847 personas desarrolladas"
                trend="up"
              />
              <StatCard
                value="30+ Años"
                label="Gano Excel"
                sublabel="100% libre de deudas"
                trend="neutral"
              />
            </div>

            <div className="investor-card p-8">
              <h3 className="text-xl font-bold text-white mb-4">Infraestructura Técnica Existente:</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-slate-300">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    CreaTuActivo.com 100% funcional
                  </li>
                  <li className="flex items-center gap-2 text-slate-300">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    NEXUS AI operativo (v18.0)
                  </li>
                  <li className="flex items-center gap-2 text-slate-300">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    Sistema de tracking desplegado
                  </li>
                </ul>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-slate-300">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    4 arsenales de conocimiento
                  </li>
                  <li className="flex items-center gap-2 text-slate-300">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    12+ páginas de conversión
                  </li>
                  <li className="flex items-center gap-2 text-slate-300">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    Infraestructura cloud configurada
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Próximos Pasos */}
          <section className="mb-20">
            <SectionHeader
              icon={<Calendar size={32} />}
              title="Próximos Pasos"
              subtitle="Proceso de Due Diligence en 4 semanas"
            />

            <div className="grid md:grid-cols-4 gap-6">
              <div className="investor-card p-6 text-center">
                <div className="bg-amber-500/20 text-amber-400 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  1
                </div>
                <h4 className="font-bold text-white mb-2">Semana 1</h4>
                <p className="text-sm text-slate-400">Reunión presencial + demo en vivo</p>
              </div>

              <div className="investor-card p-6 text-center">
                <div className="bg-amber-500/20 text-amber-400 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  2
                </div>
                <h4 className="font-bold text-white mb-2">Semana 2</h4>
                <p className="text-sm text-slate-400">Due diligence técnico y financiero</p>
              </div>

              <div className="investor-card p-6 text-center">
                <div className="bg-amber-500/20 text-amber-400 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  3
                </div>
                <h4 className="font-bold text-white mb-2">Semana 3</h4>
                <p className="text-sm text-slate-400">Negociación términos finales</p>
              </div>

              <div className="investor-card p-6 text-center">
                <div className="bg-amber-500/20 text-amber-400 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  4
                </div>
                <h4 className="font-bold text-white mb-2">Semana 4</h4>
                <p className="text-sm text-slate-400">Firma + desembolso tramo 1</p>
              </div>
            </div>
          </section>

          {/* CTA Final */}
          <section className="text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="investor-card p-12"
            >
              <Rocket className="w-16 h-16 text-amber-400 mx-auto mb-6" />

              <h2 className="text-4xl font-bold text-white mb-6">
                Esta No es Una Inversión en Software
              </h2>

              <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
                Es una inversión en <strong className="text-amber-400">tu propia red de distribución</strong> con la ventaja de tecnología de punta trabajando 24/7 por ti, liderazgo probado (9 años, 2,847 personas), y un mercado de 546,300 distribuidores esperando.
              </p>

              <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-xl p-8 mb-8">
                <p className="text-2xl font-bold text-amber-400 mb-3">
                  $205M COP no son un "gasto"
                </p>
                <p className="text-lg text-slate-300">
                  Son el capital de trabajo para construir un activo que en 3-5 años puede generar <strong className="text-white">$5-10M COP/semana</strong> de ingreso residual heredable.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}?text=Hola%20Luis%2C%20revisé%20la%20propuesta%20de%20inversión%20y%20me%20gustaría%20agendar%20una%20reunión`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold py-4 px-8 rounded-lg transition-all transform hover:scale-105 shadow-lg"
                >
                  Agendar Reunión Presencial
                  <ExternalLink className="w-5 h-5" />
                </a>

                <Link
                  href="/fundadores"
                  className="inline-flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-white font-bold py-4 px-8 rounded-lg transition-all"
                >
                  Ver Plataforma en Acción
                  <ChevronRight className="w-5 h-5" />
                </Link>
              </div>

              <p className="text-sm text-slate-500 mt-6">
                Respuesta a consultas: &lt;24h • Disponibilidad reuniones: Lunes-Viernes 9AM-6PM
              </p>
            </motion.div>
          </section>

          {/* Footer */}
          <footer className="border-t border-slate-700 mt-20 pt-8 text-center text-slate-500 text-sm">
            <p className="mb-2">
              &copy; {new Date().getFullYear()} CreaTuActivo.com. Todos los derechos reservados.
            </p>
            <p className="mb-4">
              Documento confidencial v1.0 • {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
            <div className="flex items-center justify-center gap-2 text-red-400">
              <Lock className="w-4 h-4" />
              <span>Información exclusiva para inversionistas potenciales</span>
            </div>
          </footer>

        </div>
      </div>
    </>
  );
}
