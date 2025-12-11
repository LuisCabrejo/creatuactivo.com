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
  Award,
  CheckCircle,
  AlertTriangle,
  FileText,
  Calendar,
  Building2,
  Rocket,
  ChevronRight,
  ExternalLink,
  Briefcase,
  GitMerge,
  Globe,
  Database,
  Cpu,
  Landmark,
  ShoppingCart,
  UserCheck,
  Laptop
} from 'lucide-react'
import Link from 'next/link'
import { useHydration } from '@/hooks/useHydration'

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
          <td>Desde $7M COP</td>
          <td className="text-green-400 font-bold">45-90%</td>
          <td className="text-green-400 font-bold">12-18 meses</td>
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
  const isHydrated = useHydration()
  const [teamSize, setTeamSize] = useState(50);
  const [weeklyIncome, setWeeklyIncome] = useState(0);
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [annualIncome, setAnnualIncome] = useState(0);
  const [roi, setROI] = useState(0);

  useEffect(() => {
    const incomePerPerson = 19125;
    const weekly = teamSize * incomePerPerson;
    const monthly = weekly * 4;
    const annual = monthly * 12;
    const investment = 15000000;
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

          <ConfidentialBanner />

          {/* Hero Section */}
          <section className="mb-20">
            <motion.div
              initial={isHydrated ? { opacity: 0, y: 20 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-block bg-amber-500/10 border border-amber-500/30 px-4 py-2 rounded-full mb-6">
                <span className="text-amber-400 font-semibold text-sm">PROPUESTA DE INVERSIÓN GLOBAL</span>
              </div>

              <h1 className="text-5xl md:text-7xl font-extrabold mb-6">
                <span className="bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 bg-clip-text text-transparent">
                  CreaTuActivo.com
                </span>
              </h1>

              <p className="text-2xl md:text-3xl text-slate-300 mb-8 max-w-3xl">
                Infraestructura SaaS de Network Marketing con Respaldo Jurídico en USA y Ecosistema de Tráfico Validado.
              </p>

              <div className="grid md:grid-cols-3 gap-6">
                <StatCard
                  value="$335M COP"
                  label="Presupuesto Lean Anual"
                  sublabel="Modelo Optimizado y Global"
                />
                <StatCard
                  value="12 Meses"
                  label="Runway Operativo"
                  sublabel="Equipo Senior + Ventas"
                  trend="up"
                />
                <StatCard
                  value="USA + COL"
                  label="Respaldo Legal"
                  sublabel="LLC Delaware + Cuentas USD"
                  trend="up"
                />
              </div>
            </motion.div>
          </section>

           {/* --- SECCIÓN NUEVA: ECOSISTEMA DE CAPTACIÓN --- */}
           <section className="mb-20">
            <SectionHeader
              icon={<Zap size={32} />}
              title="El Ecosistema: 3 Motores de Crecimiento"
              subtitle="Tu inversión se beneficia de un embudo diversificado y operativo que alimenta la red automáticamente"
            />

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Motor 1: Consumo */}
              <div className="investor-card p-6 border-b-4 border-b-green-500">
                 <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mb-4 text-green-400">
                    <ShoppingCart size={24} />
                 </div>
                 <h3 className="text-xl font-bold text-white mb-2">ganocafe.online</h3>
                 <p className="text-xs font-bold text-green-400 uppercase tracking-wider mb-4">E-COMMERCE ACTIVO</p>
                 <p className="text-slate-300 text-sm mb-4">
                   Tienda en línea posicionada que genera ventas y afiliaciones orgánicas en toda América.
                 </p>
                 <div className="bg-slate-900/50 p-3 rounded text-xs text-slate-400">
                   <strong>Función:</strong> Atrae consumidores finales y clientes recurrentes para volumen estable.
                 </div>
              </div>

              {/* Motor 2: Marca Personal */}
              <div className="investor-card p-6 border-b-4 border-b-amber-500">
                 <div className="w-12 h-12 bg-amber-500/20 rounded-full flex items-center justify-center mb-4 text-amber-400">
                    <UserCheck size={24} />
                 </div>
                 <h3 className="text-xl font-bold text-white mb-2">luiscabrejo.com</h3>
                 <p className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-4">MARCA & LIDERAZGO</p>
                 <p className="text-slate-300 text-sm mb-4">
                   Sitio de autoridad enfocado en educar y atraer networkers profesionales buscando oportunidades.
                 </p>
                 <div className="bg-slate-900/50 p-3 rounded text-xs text-slate-400">
                   <strong>Función:</strong> Captura líderes experimentados que construyen equipos rápidamente.
                 </div>
              </div>

              {/* Motor 3: Tecnología */}
              <div className="investor-card p-6 border-b-4 border-b-blue-500">
                 <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mb-4 text-blue-400">
                    <Laptop size={24} />
                 </div>
                 <h3 className="text-xl font-bold text-white mb-2">CreaTuActivo.com</h3>
                 <p className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-4">PLATAFORMA SAAS</p>
                 <p className="text-slate-300 text-sm mb-4">
                   El protagonista. Software de automatización y prospección con IA (Nexus) para constructores.
                 </p>
                 <div className="bg-slate-900/50 p-3 rounded text-xs text-slate-400">
                   <strong>Función:</strong> Retención, duplicación masiva y escalabilidad tecnológica.
                 </div>
              </div>
            </div>
          </section>

           {/* --- SECCIÓN DE TICKETS DE INVERSIÓN --- */}
           <section className="mb-20">
            <SectionHeader
              icon={<DollarSign size={32} />}
              title="Tickets de Inversión"
              subtitle="Selecciona tu posición basada en la estructura que deseas garantizar"
            />

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Plan 1: 7M */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="investor-card p-8 hover:bg-slate-800/80 border-t-4 border-t-slate-500"
              >
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-slate-300 mb-2">Ticket Constructor</h3>
                  <div className="text-4xl font-extrabold text-white mb-2">$7.000.000</div>
                  <span className="text-sm text-slate-500">COP</span>
                </div>

                <div className="bg-slate-900/60 rounded-lg p-4 mb-6 text-center border border-slate-700">
                    <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">ESTRUCTURA GARANTIZADA</p>
                    <div className="flex items-center justify-center gap-4 text-xl font-bold">
                        <span className="text-slate-500">0 Izq</span>
                        <GitMerge className="w-5 h-5 text-amber-500" />
                        <span className="text-green-400">100 Der</span>
                    </div>
                </div>

                <ul className="space-y-4 mb-8">
                   <li className="flex items-start gap-3">
                     <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                     <span className="text-slate-300 text-sm">
                       <strong>Ingreso Pasivo: $0.</strong> Si no construyes tu interna, no hay comisiones.
                     </span>
                   </li>
                   <li className="flex items-start gap-3">
                     <CheckCircle className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" />
                     <span className="text-slate-300 text-sm">Apoyo de tráfico del Ecosistema (Derrame).</span>
                   </li>
                </ul>

                <button className="w-full py-3 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-bold transition-colors">
                  Elegir Opción Constructor
                </button>
              </motion.div>

              {/* Plan 2: 15M */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="investor-card p-8 hover:bg-slate-800/80 border-t-4 border-t-amber-500"
              >
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-amber-400 mb-2">Ticket Inversionista</h3>
                  <div className="text-4xl font-extrabold text-white mb-2">$15.000.000</div>
                  <span className="text-sm text-slate-500">COP</span>
                </div>

                <div className="bg-slate-900/60 rounded-lg p-4 mb-6 text-center border border-amber-500/30">
                    <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">ESTRUCTURA GARANTIZADA</p>
                    <div className="flex items-center justify-center gap-4 text-xl font-bold">
                        <span className="text-white">50 Izq</span>
                        <GitMerge className="w-5 h-5 text-amber-500" />
                        <span className="text-green-400">100 Der</span>
                    </div>
                    <p className="text-xs text-green-400 mt-2 font-semibold">Cobras por: 50 personas</p>
                </div>

                <ul className="space-y-4 mb-8">
                   <li className="flex items-start gap-3">
                     <CheckCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                     <span className="text-slate-300 text-sm">
                       Ingreso estimado: <strong className="text-white">~$960.000 COP/semana</strong>
                     </span>
                   </li>
                   <li className="flex items-start gap-3">
                     <CheckCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                     <span className="text-slate-300 text-sm">Prioridad en asignación de leads.</span>
                   </li>
                </ul>

                <button className="w-full py-3 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-bold transition-colors">
                  Elegir Opción Inversionista
                </button>
              </motion.div>

              {/* Plan 3: 30M */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="investor-card p-8 hover:bg-slate-800/80 border-t-4 border-t-purple-500"
              >
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-purple-400 mb-2">Ticket Elite</h3>
                  <div className="text-4xl font-extrabold text-white mb-2">$30.000.000</div>
                  <span className="text-sm text-slate-500">COP</span>
                </div>

                <div className="bg-slate-900/60 rounded-lg p-4 mb-6 text-center border border-purple-500/30">
                    <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">ESTRUCTURA GARANTIZADA</p>
                    <div className="flex items-center justify-center gap-4 text-xl font-bold">
                        <span className="text-white">100 Izq</span>
                        <GitMerge className="w-5 h-5 text-purple-500" />
                        <span className="text-green-400">200 Der</span>
                    </div>
                    <p className="text-xs text-green-400 mt-2 font-semibold">Cobras por: 100 personas</p>
                </div>

                <ul className="space-y-4 mb-8">
                   <li className="flex items-start gap-3">
                     <CheckCircle className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                     <span className="text-slate-300 text-sm">
                       Ingreso estimado: <strong className="text-white">~$1.900.000 COP/semana</strong>
                     </span>
                   </li>
                   <li className="flex items-start gap-3">
                     <CheckCircle className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                     <span className="text-slate-300 text-sm">Máxima prioridad y mentoría 1-1.</span>
                   </li>
                </ul>

                <button className="w-full py-3 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-bold transition-colors">
                  Elegir Opción Elite
                </button>
              </motion.div>
            </div>
          </section>

          {/* Calculadora ROI Interactiva */}
          <section className="mb-20">
            <SectionHeader
              icon={<BarChart3 size={32} />}
              title="Calculadora de Comisiones (Binario)"
              subtitle="Proyecta tus ganancias basadas en la 'Pata de Pago' (Lado menor)"
            />

            <div className="investor-card p-8 lg:p-12">
              <div className="mb-8">
                <label className="block text-slate-300 mb-4 text-center">
                  <span className="text-lg">Personas activas en tu centro de negocios de Pago: </span>
                  <span className="text-3xl font-bold text-amber-400">{teamSize}</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="200"
                  step="10"
                  value={teamSize}
                  onChange={(e) => setTeamSize(Number(e.target.value))}
                  className="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-slate-500 mt-2">
                  <span>0 (7M)</span>
                  <span>50 (15M)</span>
                  <span>100 (30M)</span>
                  <span>200</span>
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-lg p-6 text-center">
                  <p className="text-xs text-slate-400 uppercase mb-2">Ingreso Semanal</p>
                  <p className="text-2xl font-bold text-green-400">
                    ${(weeklyIncome / 1000).toLocaleString('es-CO')}K
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
                  <p className="text-xs text-slate-400 uppercase mb-2">ROI (Ref. 15M)</p>
                  <p className={`text-2xl font-bold ${roi > 0 ? 'text-amber-400' : 'text-red-400'}`}>
                    {roi > 0 ? '+' : ''}{roi.toFixed(0)}%
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                     *Proyectado Anual
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* --- ESCENARIOS PRESUPUESTALES (CORREGIDO CON TEXTOS EXACTOS) --- */}
          <section className="mb-20">
            <SectionHeader
              icon={<Briefcase size={32} />}
              title="Escenarios de Ejecución"
              subtitle="El respaldo internacional no es un lujo, es una necesidad estratégica"
            />

            <div className="grid lg:grid-cols-3 gap-8">
               {/* Escenario Local */}
              <div className="investor-card p-6 bg-slate-900/40">
                <h3 className="font-bold text-slate-400 mb-2">Escenario Local</h3>
                <div className="text-2xl font-bold text-white mb-1">$210M COP</div>
                <p className="text-xs text-red-400 mb-2">Riesgo: Sin respaldo USA</p>
                <ul className="text-xs text-slate-400 space-y-1 mt-3">
                    <li>• Operación 100% colombiana</li>
                    <li>• Inversión ADS básica</li>
                    <li>• Menor confianza para líderes</li>
                </ul>
              </div>

               {/* Escenario Global Lean */}
              <div className="investor-card p-6 border border-amber-500/30 bg-amber-900/10 relative">
                 <div className="absolute top-0 right-0 -mt-2 mr-2">
                     <span className="bg-green-500 text-black text-[10px] font-bold px-2 py-0.5 rounded">RECOMENDADO</span>
                </div>
                <h3 className="font-bold text-amber-400 mb-2">Escenario Global Lean</h3>
                <div className="text-2xl font-bold text-white mb-1">$335M COP</div>
                <p className="text-xs text-green-400 mb-2">Objetivo: Confianza Total</p>
                <ul className="text-xs text-slate-300 space-y-1 mt-3">
                    <li>• <strong className="text-white">Legal USA First</strong> - LLC + Cuentas</li>
                    <li>• <strong className="text-white">Estrategia agresiva en negocios (1.000)</strong></li>
                    <li>• <strong className="text-white">Mayor confianza</strong> para líderes</li>
                    <li>• <strong className="text-white">Operación Internacional</strong></li>
                    <li>• <strong className="text-white">Ads Agresivos</strong> - Crecimiento</li>
                </ul>
              </div>

               {/* Escenario Expansión */}
              <div className="investor-card p-6 bg-slate-900/40">
                <h3 className="font-bold text-slate-400 mb-2">Escenario Expansión</h3>
                <div className="text-2xl font-bold text-white mb-1">$480M COP</div>
                <p className="text-xs text-blue-400 mb-2">Apertura Mercado Brasil</p>
                <ul className="text-xs text-slate-400 space-y-1 mt-3">
                    <li>• Registro Marca Brasil (INPI)</li>
                    <li>• Ads Masivos ($15M+/mes)</li>
                    <li>• Giras y Eventos Presenciales</li>
                    <li>• Operación internacional fuerte</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Uso de Fondos (DETALLADO CON USA) */}
          <section className="mb-20">
            <SectionHeader
              icon={<DollarSign size={32} />}
              title="Desglose de Fondos ($335M)"
              subtitle="Priorizando respaldo legal y tracción comercial"
            />

            <div className="grid lg:grid-cols-2 gap-8">
              <TimelineItem
                quarter="Nómina Eficiente (66%)"
                title="Equipo Comprometido"
                budget="$222M COP"
                goals={[
                  "CEO (Luis): $6M/mes (Operativo + Equipos)",
                  "COO (Admin): $2M/mes",
                  "Dev Senior (LATAM): $7.5M/mes + Bonos",
                  "Mkt Specialist (Ads/Edit/Copy): $3M/mes"
                ]}
              />

              <TimelineItem
                quarter="Marketing & Tracción (21%)"
                title="Combustible de Ventas"
                budget="$71M COP"
                goals={[
                  "Ads Digitales: $6M/mes (Prioridad 1)",
                  "Material POP (Ajustado)",
                  "Estrategia 1 a 1 en comercios"
                ]}
              />

              <TimelineItem
                quarter="Tecnología Optimizada (7.5%)"
                title="Infraestructura Escalable"
                budget="$25M COP"
                goals={[
                  "API Claude (Optimización Caché 10min)",
                  "Base de datos Vectorial",
                  "Vercel / Supabase Scale",
                  "Servidores"
                ]}
              />

              <TimelineItem
                quarter="Legal Global (5.5%)"
                title="Blindaje USA + COL"
                budget="$17M COP"
                goals={[
                  "Constitución LLC Delaware/Florida",
                  "Cuenta Bancaria Global (Stripe)",
                  "Marca USA (USPTO) + COL (SIC)",
                  "Contabilidad Base"
                ]}
              />
            </div>
          </section>

          {/* Riesgos y Mitigación (CON USA) */}
          <section className="mb-20">
            <SectionHeader
              icon={<Shield size={32} />}
              title="Análisis de Riesgos y Blindaje"
              subtitle="Cómo protegemos la inversión ante incertidumbre"
            />

            <div className="grid lg:grid-cols-2 gap-6">
              <RiskCard
                title="Devaluación del Peso (Riesgo País)"
                probability="medium"
                impact="high"
                mitigation="Mitigación Total: Estructura LLC en USA permite facturar y mantener tesorería en Dólares Fuertes, protegiendo el capital de trabajo."
              />
              <RiskCard
                title="Desconfianza de Líderes Top"
                probability="medium"
                impact="high"
                mitigation="La entidad legal en USA y cuentas corporativas americanas eliminan la fricción de 'empresa local', proyectando solidez global desde el día 1."
              />
               <RiskCard
                title="Tasa de Conversión Baja"
                probability="medium"
                impact="medium"
                mitigation="Validación temprana con Ads. Si tasa <10%, pivoteamos presupuesto de expansión a optimización de embudos (Nexus AI)."
              />
               <RiskCard
                title="Cambios en Gano Excel"
                probability="low"
                impact="high"
                mitigation="Relación directa con Diamantes. Contrato y plataforma adaptable a otras empresas MLM si fuera necesario."
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
                value="$120K USD"
                label="Inversión Previa Luis"
                sublabel="Capital + Valor Horas Desarrollo"
                trend="up"
              />
              <StatCard
                value="9 Años"
                label="Track Record"
                sublabel="2,847 personas desarrolladas"
                trend="up"
              />
              <StatCard
                value="Global"
                label="Visión"
                sublabel="Infraestructura lista para escalar"
                trend="up"
              />
            </div>

            <div className="investor-card p-8">
              <h3 className="text-xl font-bold text-white mb-4">Tecnología de Vanguardia:</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-slate-300">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    CreaTuActivo.com 100% funcional
                  </li>
                  <li className="flex items-center gap-2 text-slate-300">
                    <Database className="w-4 h-4 text-green-400" />
                    <span className="text-white font-semibold">Vectores + RAG Optimizado</span>
                  </li>
                  <li className="flex items-center gap-2 text-slate-300">
                    <Cpu className="w-4 h-4 text-green-400" />
                    <span className="text-white font-semibold">Caché Inteligente (10 min)</span>
                  </li>
                </ul>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-slate-300">
                    <Landmark className="w-4 h-4 text-green-400" />
                    <span className="text-white font-semibold">Base Operativa USA (Virtual)</span>
                  </li>
                  <li className="flex items-center gap-2 text-slate-300">
                    <Globe className="w-4 h-4 text-green-400" />
                    Adaptación de productos por país
                  </li>
                  <li className="flex items-center gap-2 text-slate-300">
                    <Zap className="w-4 h-4 text-green-400" />
                    Sistema eficiente de tokens
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="border-t border-slate-700 mt-20 pt-8 text-center text-slate-500 text-sm">
            <p className="mb-2">
              &copy; {new Date().getFullYear()} CreaTuActivo.com. Todos los derechos reservados.
            </p>
            <p className="mb-4">
              Documento confidencial v1.8 • {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </footer>

        </div>
      </div>
    </>
  );
}
