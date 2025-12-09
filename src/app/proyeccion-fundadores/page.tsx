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
import { ArrowRight, Users, TrendingUp, Crown, Rocket, Target, ChevronRight, Calculator, DollarSign, Coffee } from 'lucide-react'
import Link from 'next/link'
import StrategicNavigation from '@/components/StrategicNavigation'
import { useHydration } from '@/hooks/useHydration'

// --- Estilos CSS Globales ---
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
    .text-gradient-gold {
      background: linear-gradient(135deg, #FBBF24 0%, #D97706 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      font-weight: 800;
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
    .projection-row {
      transition: all 0.3s ease;
    }
    .projection-row:hover {
      background: rgba(124, 58, 237, 0.15);
    }
    .level-badge {
      background: linear-gradient(135deg, rgba(30, 64, 175, 0.3) 0%, rgba(124, 58, 237, 0.3) 100%);
      border: 1px solid rgba(124, 58, 237, 0.3);
    }
    .milestone-row {
      background: linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(234, 88, 12, 0.1) 100%);
      border: 1px solid rgba(245, 158, 11, 0.3);
    }
  `}</style>
);

// Datos de proyección 2×2 a 12 niveles con cálculos financieros en COP
// Base: 4 cajas Gano Café 3en1 = $443,600 COP = 52 CV por persona
// Tasa Gano Excel Colombia: $4,500 COP = 1 USD
// Bono binario: 10% del CV del lado menor × $4,500
const COP_RATE = 4500;

const projectionData = [
  { level: 1, people: 2, cvPerSide: 52, bonus10: 23400, acum10: 23400, acum15: 35100, acum16: 37440, acum17: 39780 },
  { level: 2, people: 4, cvPerSide: 104, bonus10: 46800, acum10: 70200, acum15: 105300, acum16: 112320, acum17: 119340 },
  { level: 3, people: 8, cvPerSide: 208, bonus10: 93600, acum10: 163800, acum15: 245700, acum16: 262080, acum17: 278460 },
  { level: 4, people: 16, cvPerSide: 416, bonus10: 187200, acum10: 351000, acum15: 526500, acum16: 561600, acum17: 596700 },
  { level: 5, people: 32, cvPerSide: 832, bonus10: 374400, acum10: 725400, acum15: 1088100, acum16: 1160640, acum17: 1233180 },
  { level: 6, people: 64, cvPerSide: 1664, bonus10: 748800, acum10: 1474200, acum15: 2211300, acum16: 2358720, acum17: 2506140 },
  { level: 7, people: 128, cvPerSide: 3328, bonus10: 1497600, acum10: 2971800, acum15: 4457700, acum16: 4754880, acum17: 5052060 },
  { level: 8, people: 256, cvPerSide: 6656, bonus10: 2995200, acum10: 5967000, acum15: 8950500, acum16: 9547200, acum17: 10143900 },
  { level: 9, people: 512, cvPerSide: 13312, bonus10: 5990400, acum10: 11957400, acum15: 17936100, acum16: 19131840, acum17: 20327580 },
  { level: 10, people: 1024, cvPerSide: 26624, bonus10: 11980800, acum10: 23938200, acum15: 35907300, acum16: 38301120, acum17: 40694940 },
  { level: 11, people: 2048, cvPerSide: 53248, bonus10: 23961600, acum10: 47899800, acum15: 71849700, acum16: 76639680, acum17: 81429660 },
  { level: 12, people: 4096, cvPerSide: 106496, bonus10: 47923200, acum10: 95823000, acum15: 143734500, acum16: 153316800, acum17: 162899100 },
];

// Totales acumulados
const totals = {
  people: 8190,           // Suma de todas las personas
  cv: 212940,             // Suma de todo el CV
  bonus10: 95823000,      // Total acumulado 10% en COP
  bonus15: 143734500,     // Total acumulado 15% en COP
  bonus16: 153316800,     // Total acumulado 16% en COP
  bonus17: 162899100,     // Total acumulado 17% en COP
};

// Componente de fila de la tabla
const ProjectionRow = ({
  level,
  people,
  cvPerSide,
  bonus10,
  acum10,
  acum15,
  acum16,
  acum17,
  isAnimated,
  delay
}: {
  level: number
  people: number
  cvPerSide: number
  bonus10: number
  acum10: number
  acum15: number
  acum16: number
  acum17: number
  isAnimated: boolean
  delay: number
}) => {
  const isHydrated = useHydration()
  const isHighlight = level >= 10;

  const formatCOP = (value: number) => `$${value.toLocaleString('es-CO')}`;

  return (
    <motion.tr
      initial={isHydrated && isAnimated ? { opacity: 0, x: -20 } : false}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: delay * 0.08 }}
      className={`projection-row ${isHighlight ? 'milestone-row' : ''}`}
    >
      <td className="py-3 px-2 md:px-3">
        <span className={`level-badge w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center font-bold text-xs md:text-sm ${
          level <= 4 ? 'text-blue-400' :
          level <= 8 ? 'text-purple-400' :
          'text-amber-400'
        }`}>
          {level}
        </span>
      </td>
      <td className="py-3 px-2 md:px-3 text-center">
        <span className="font-mono font-bold text-white text-xs md:text-sm">
          {people.toLocaleString('es-CO')}
        </span>
      </td>
      <td className="py-3 px-2 md:px-3 text-center">
        <span className="font-mono text-slate-300 text-xs md:text-sm">
          {cvPerSide.toLocaleString('es-CO')}
        </span>
      </td>
      <td className="py-3 px-2 md:px-3 text-center">
        <span className="font-mono text-slate-300 text-xs md:text-sm">
          {formatCOP(bonus10)}
        </span>
      </td>
      <td className="py-3 px-2 md:px-3 text-center">
        <span className="font-mono font-bold text-green-400 text-xs md:text-sm">
          {formatCOP(acum10)}
        </span>
      </td>
      <td className="py-3 px-2 md:px-3 text-center">
        <span className="font-mono font-bold text-blue-400 text-xs md:text-sm">
          {formatCOP(acum15)}
        </span>
      </td>
      <td className="py-3 px-2 md:px-3 text-center">
        <span className="font-mono font-bold text-purple-400 text-xs md:text-sm">
          {formatCOP(acum16)}
        </span>
      </td>
      <td className="py-3 px-2 md:px-3 text-center">
        <span className="font-mono font-bold text-amber-400 text-xs md:text-sm">
          {formatCOP(acum17)}
        </span>
      </td>
    </motion.tr>
  );
};

// Componente de tarjeta de estadística
const StatCard = ({
  icon,
  value,
  label,
  sublabel,
  color = "blue"
}: {
  icon: React.ReactNode
  value: string
  label: string
  sublabel?: string
  color?: "blue" | "purple" | "amber" | "green"
}) => {
  const colorClasses = {
    blue: "from-blue-500/20 to-blue-600/20 border-blue-500/30 text-blue-400",
    purple: "from-purple-500/20 to-purple-600/20 border-purple-500/30 text-purple-400",
    amber: "from-amber-500/20 to-amber-600/20 border-amber-500/30 text-amber-400",
    green: "from-green-500/20 to-green-600/20 border-green-500/30 text-green-400"
  };

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} border rounded-2xl p-6 text-center`}>
      <div className="mb-3 flex justify-center">{icon}</div>
      <p className="text-3xl md:text-4xl font-extrabold text-white mb-1">{value}</p>
      <p className="text-sm font-semibold text-slate-300">{label}</p>
      {sublabel && <p className="text-xs text-slate-500 mt-1">{sublabel}</p>}
    </div>
  );
};

// Componente principal
export default function ProyeccionFundadoresPage() {
  const isHydrated = useHydration()
  const [showAllLevels, setShowAllLevels] = useState(false);
  const [animateTable, setAnimateTable] = useState(false);

  // Calcular estadísticas
  const totalPorFundador = 8190;
  const fundadores = 150;
  const totalRedFundadores = fundadores * totalPorFundador;
  const meta = 4000000;
  const porcentajeMeta = ((totalRedFundadores / meta) * 100).toFixed(1);

  useEffect(() => {
    const timer = setTimeout(() => setAnimateTable(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <GlobalStyles />
      <div className="bg-slate-900 text-white min-h-screen">
        <StrategicNavigation />

        {/* Background effects */}
        <div className="fixed top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
          <div className="absolute -top-1/4 -left-1/4 w-96 h-96 bg-[var(--creatuactivo-blue)] opacity-10 rounded-full filter blur-3xl animate-pulse"></div>
          <div className="absolute top-1/2 -right-1/4 w-96 h-96 bg-[var(--creatuactivo-purple)] opacity-10 rounded-full filter blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-1/4 left-1/3 w-96 h-96 bg-[var(--creatuactivo-gold)] opacity-5 rounded-full filter blur-3xl animate-pulse"></div>
        </div>

        <main className="relative z-10 pt-28 pb-20 px-4 lg:px-8">

          {/* HERO */}
          <section className="max-w-5xl mx-auto mb-16 lg:mb-24 text-center">
            <motion.div
              initial={isHydrated ? { opacity: 0, y: 30 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-bold uppercase tracking-wider mb-6">
                <Crown className="w-4 h-4" />
                Exclusivo Fundadores
              </div>

              <h1 className="creatuactivo-h1-ecosystem text-4xl md:text-6xl lg:text-7xl mb-6">
                El Poder de la Duplicación
              </h1>

              <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto mb-8">
                Meta: Impactar positivamente la vida de <span className="text-gradient-gold">4 millones de personas</span> en los próximos 3-7 años.
              </p>

              <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                ¿Cómo se logra? Con la <strong className="text-white">duplicación más conservadora posible</strong>:
                cada persona invita a <span className="text-blue-400 font-bold">solo 2 personas</span>.
              </p>
            </motion.div>
          </section>

          {/* ESTADÍSTICAS CLAVE */}
          <section className="max-w-6xl mx-auto mb-16 lg:mb-24">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              <StatCard
                icon={<Coffee className="w-8 h-8 text-blue-400" />}
                value="$443,600"
                label="Inversión Mínima"
                sublabel="4 cajas Gano Café 3en1"
                color="blue"
              />
              <StatCard
                icon={<TrendingUp className="w-8 h-8 text-purple-400" />}
                value="52 CV"
                label="Por Persona"
                sublabel="Volumen de comisión"
                color="purple"
              />
              <StatCard
                icon={<Users className="w-8 h-8 text-amber-400" />}
                value="8,190"
                label="Red al Nivel 12"
                sublabel="Duplicación 2×2"
                color="amber"
              />
              <StatCard
                icon={<DollarSign className="w-8 h-8 text-green-400" />}
                value="$95.8M"
                label="Bono Binario COP"
                sublabel="Acumulado 10% nivel 12"
                color="green"
              />
            </div>
          </section>

          {/* EXPLICACIÓN DEL MODELO */}
          <section className="max-w-4xl mx-auto mb-16 lg:mb-24">
            <div className="creatuactivo-component-card p-6 md:p-10">
              <div className="flex items-start gap-4 mb-6">
                <div className="bg-blue-500/20 p-3 rounded-xl">
                  <Calculator className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">¿Cómo funciona la proyección?</h2>
                  <p className="text-slate-400">El escenario más conservador posible.</p>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6 mb-6">
                <div className="bg-slate-800/50 rounded-xl p-5">
                  <div className="text-3xl font-bold text-blue-400 mb-2">1</div>
                  <h3 className="font-bold text-white mb-1">Tú empiezas</h3>
                  <p className="text-sm text-slate-400">Activas tu posición como Fundador en la Lista Privada.</p>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-5">
                  <div className="text-3xl font-bold text-purple-400 mb-2">2</div>
                  <h3 className="font-bold text-white mb-1">Invitas a 2</h3>
                  <p className="text-sm text-slate-400">Solo 2 personas que compartan la visión. No más.</p>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-5">
                  <div className="text-3xl font-bold text-amber-400 mb-2">∞</div>
                  <h3 className="font-bold text-white mb-1">Ellos repiten</h3>
                  <p className="text-sm text-slate-400">Cada uno invita a 2. El sistema se duplica solo.</p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-xl p-4 text-center">
                <p className="text-slate-300">
                  <strong className="text-amber-400">La matemática no miente:</strong> Con solo 2×2 en 12 niveles,
                  cada fundador puede impactar a <span className="font-bold text-white">8,190 personas</span>.
                </p>
              </div>
            </div>
          </section>

          {/* TABLA DE PROYECCIÓN */}
          <section className="max-w-7xl mx-auto mb-16 lg:mb-24">
            <div className="text-center mb-8">
              <h2 className="creatuactivo-h2-component text-3xl md:text-4xl font-bold mb-4">
                Proyección Binaria 2×2 en COP
              </h2>
              <p className="text-slate-400">Inversión mínima: <span className="text-white font-semibold">$443,600 COP</span> (4 cajas Gano Café 3en1) = <span className="text-blue-400 font-semibold">52 CV</span></p>
              <p className="text-slate-500 text-sm mt-1">Tasa Gano Excel Colombia: $4,500 COP = 1 USD</p>
            </div>

            <div className="creatuactivo-component-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px]">
                  <thead>
                    <tr className="border-b border-white/10 bg-slate-800/50">
                      <th className="py-3 px-2 md:px-3 text-left text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Nivel
                      </th>
                      <th className="py-3 px-2 md:px-3 text-center text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Personas
                      </th>
                      <th className="py-3 px-2 md:px-3 text-center text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider">
                        CV/Lado
                      </th>
                      <th className="py-3 px-2 md:px-3 text-center text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Bono 10%
                      </th>
                      <th className="py-3 px-2 md:px-3 text-center text-[10px] md:text-xs font-bold text-green-400 uppercase tracking-wider bg-green-500/5">
                        Acum 10%
                      </th>
                      <th className="py-3 px-2 md:px-3 text-center text-[10px] md:text-xs font-bold text-blue-400 uppercase tracking-wider bg-blue-500/5">
                        Acum 15%
                      </th>
                      <th className="py-3 px-2 md:px-3 text-center text-[10px] md:text-xs font-bold text-purple-400 uppercase tracking-wider bg-purple-500/5">
                        Acum 16%
                      </th>
                      <th className="py-3 px-2 md:px-3 text-center text-[10px] md:text-xs font-bold text-amber-400 uppercase tracking-wider bg-amber-500/5">
                        Acum 17%
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {projectionData
                      .slice(0, showAllLevels ? 12 : 6)
                      .map((row, index) => (
                        <ProjectionRow
                          key={row.level}
                          level={row.level}
                          people={row.people}
                          cvPerSide={row.cvPerSide}
                          bonus10={row.bonus10}
                          acum10={row.acum10}
                          acum15={row.acum15}
                          acum16={row.acum16}
                          acum17={row.acum17}
                          isAnimated={animateTable}
                          delay={index}
                        />
                      ))}
                  </tbody>
                  {/* Fila de TOTALES */}
                  {showAllLevels && (
                    <tfoot>
                      <tr className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-t-2 border-green-500/30">
                        <td className="py-4 px-2 md:px-3">
                          <span className="font-bold text-green-400 text-xs uppercase">Total</span>
                        </td>
                        <td className="py-4 px-2 md:px-3 text-center">
                          <span className="font-mono font-bold text-white text-sm">
                            {totals.people.toLocaleString('es-CO')}
                          </span>
                        </td>
                        <td className="py-4 px-2 md:px-3 text-center">
                          <span className="font-mono font-bold text-slate-300 text-sm">
                            {totals.cv.toLocaleString('es-CO')}
                          </span>
                        </td>
                        <td className="py-4 px-2 md:px-3 text-center">
                          <span className="text-slate-500 text-xs">—</span>
                        </td>
                        <td className="py-4 px-2 md:px-3 text-center bg-green-500/5">
                          <span className="font-mono font-bold text-green-400 text-sm">
                            ${totals.bonus10.toLocaleString('es-CO')}
                          </span>
                        </td>
                        <td className="py-4 px-2 md:px-3 text-center bg-blue-500/5">
                          <span className="font-mono font-bold text-blue-400 text-sm">
                            ${totals.bonus15.toLocaleString('es-CO')}
                          </span>
                        </td>
                        <td className="py-4 px-2 md:px-3 text-center bg-purple-500/5">
                          <span className="font-mono font-bold text-purple-400 text-sm">
                            ${totals.bonus16.toLocaleString('es-CO')}
                          </span>
                        </td>
                        <td className="py-4 px-2 md:px-3 text-center bg-amber-500/5">
                          <span className="font-mono font-bold text-amber-400 text-sm">
                            ${totals.bonus17.toLocaleString('es-CO')}
                          </span>
                        </td>
                      </tr>
                    </tfoot>
                  )}
                </table>
              </div>

              {!showAllLevels && (
                <div className="p-4 text-center border-t border-white/10">
                  <button
                    onClick={() => setShowAllLevels(true)}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-purple-500/20 text-purple-400 font-bold hover:bg-purple-500/30 transition-colors"
                  >
                    Ver los 12 niveles completos
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {showAllLevels && (
                <div className="p-6 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-t border-green-500/20">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-green-500/10 rounded-xl">
                      <p className="text-xs text-slate-400 mb-1">ACUMULADO 10%</p>
                      <p className="text-xl md:text-2xl font-extrabold text-green-400">
                        $95.8M
                      </p>
                    </div>
                    <div className="text-center p-3 bg-blue-500/10 rounded-xl">
                      <p className="text-xs text-slate-400 mb-1">ACUMULADO 15%</p>
                      <p className="text-xl md:text-2xl font-extrabold text-blue-400">
                        $143.7M
                      </p>
                    </div>
                    <div className="text-center p-3 bg-purple-500/10 rounded-xl">
                      <p className="text-xs text-slate-400 mb-1">ACUMULADO 16%</p>
                      <p className="text-xl md:text-2xl font-extrabold text-purple-400">
                        $153.3M
                      </p>
                    </div>
                    <div className="text-center p-3 bg-amber-500/10 rounded-xl">
                      <p className="text-xs text-slate-400 mb-1">ACUMULADO 17%</p>
                      <p className="text-xl md:text-2xl font-extrabold text-amber-400">
                        $162.9M
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Nota aclaratoria */}
            <div className="mt-4 text-center">
              <p className="text-xs text-slate-500">
                * Bono binario = % del CV del lado menor × $4,500 COP. En escenario balanceado 2×2, ambos lados son iguales.
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Porcentajes: 10% base, hasta 17% según rango alcanzado.
              </p>
            </div>
          </section>

          {/* VISIÓN 4 MILLONES */}
          <section className="max-w-5xl mx-auto mb-16 lg:mb-24">
            <div className="creatuactivo-component-card p-8 md:p-12">
              <div className="text-center mb-10">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  El Camino a <span className="text-gradient-gold">4 Millones</span>
                </h2>
                <p className="text-slate-400 max-w-2xl mx-auto">
                  Esta es la proyección más conservadora. En la realidad, muchas personas invitan a más de 2.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6 mb-10">
                <div className="text-center p-6 bg-blue-500/10 rounded-2xl border border-blue-500/20">
                  <Crown className="w-10 h-10 text-amber-400 mx-auto mb-4" />
                  <p className="text-sm text-slate-400 mb-2">FASE 1: Lista Privada</p>
                  <p className="text-3xl font-bold text-white mb-1">150</p>
                  <p className="text-sm text-slate-400">Fundadores</p>
                  <div className="mt-3 pt-3 border-t border-white/10">
                    <p className="text-xs text-slate-500">Potencial: {totalRedFundadores.toLocaleString('es-CO')}</p>
                  </div>
                </div>

                <div className="text-center p-6 bg-purple-500/10 rounded-2xl border border-purple-500/20">
                  <Rocket className="w-10 h-10 text-purple-400 mx-auto mb-4" />
                  <p className="text-sm text-slate-400 mb-2">FASE 2: Pre-Lanzamiento</p>
                  <p className="text-3xl font-bold text-white mb-1">22,500</p>
                  <p className="text-sm text-slate-400">Constructores</p>
                  <div className="mt-3 pt-3 border-t border-white/10">
                    <p className="text-xs text-slate-500">150 × 150 = 22,500</p>
                  </div>
                </div>

                <div className="text-center p-6 bg-green-500/10 rounded-2xl border border-green-500/20">
                  <Target className="w-10 h-10 text-green-400 mx-auto mb-4" />
                  <p className="text-sm text-slate-400 mb-2">META: 3-7 Años</p>
                  <p className="text-3xl font-bold text-white mb-1">4M+</p>
                  <p className="text-sm text-slate-400">Personas impactadas</p>
                  <div className="mt-3 pt-3 border-t border-white/10">
                    <p className="text-xs text-slate-500">América Latina completa</p>
                  </div>
                </div>
              </div>

              {/* Barra de progreso visual */}
              <div className="bg-slate-800/50 rounded-xl p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-bold text-slate-400">Progreso con 150 Fundadores (12 niveles)</span>
                  <span className="text-sm font-bold text-green-400">{porcentajeMeta}%</span>
                </div>
                <div className="h-4 bg-slate-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(parseFloat(porcentajeMeta), 100)}%` }}
                    transition={{ duration: 1.5, delay: 0.5 }}
                    className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-amber-500 rounded-full"
                  />
                </div>
                <div className="flex justify-between mt-2 text-xs text-slate-500">
                  <span>0</span>
                  <span>1M</span>
                  <span>2M</span>
                  <span>3M</span>
                  <span>4M</span>
                </div>
              </div>
            </div>
          </section>

          {/* MENSAJE PARA FUNDADORES */}
          <section className="max-w-4xl mx-auto mb-16 lg:mb-24">
            <div className="bg-gradient-to-br from-amber-500/10 to-orange-600/10 border border-amber-500/20 rounded-3xl p-8 md:p-12 text-center">
              <Crown className="w-16 h-16 text-amber-400 mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                ¿Por qué ser Fundador importa?
              </h2>
              <p className="text-lg text-slate-300 max-w-2xl mx-auto mb-8">
                Los <strong className="text-amber-400">150 Fundadores</strong> son la semilla de todo el movimiento.
                Cada uno tiene el potencial de impactar <strong className="text-white">8,190+ vidas</strong> directamente.
              </p>

              <div className="grid md:grid-cols-3 gap-4 mb-8">
                <div className="bg-slate-900/50 rounded-xl p-4">
                  <p className="text-2xl font-bold text-amber-400">Nivel 0</p>
                  <p className="text-sm text-slate-400">Posición más alta</p>
                </div>
                <div className="bg-slate-900/50 rounded-xl p-4">
                  <p className="text-2xl font-bold text-amber-400">Primero</p>
                  <p className="text-sm text-slate-400">En la línea del tiempo</p>
                </div>
                <div className="bg-slate-900/50 rounded-xl p-4">
                  <p className="text-2xl font-bold text-amber-400">Mentor</p>
                  <p className="text-sm text-slate-400">Rol de liderazgo</p>
                </div>
              </div>

              <p className="text-slate-400 text-sm">
                Solo hay 150 posiciones de Fundador. Una vez se cierren, no vuelven a abrirse.
              </p>
            </div>
          </section>

          {/* CTA FINAL */}
          <section className="text-center py-12">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                La proyección está clara. <br/>
                <span className="text-gradient-gold">¿Estarás en ella?</span>
              </h2>
              <p className="text-slate-400 text-lg mb-8">
                2 personas. Eso es todo lo que necesitas para activar la duplicación.
              </p>
              <Link
                href="/fundadores"
                className="creatuactivo-cta-ecosystem text-lg inline-flex items-center gap-3"
              >
                Asegurar mi Posición de Fundador
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </section>

          {/* Footer */}
          <footer className="border-t border-white/10 pt-8 mt-12">
            <div className="max-w-7xl mx-auto text-center text-slate-400 text-sm">
              <p>&copy; {new Date().getFullYear()} CreaTuActivo.com. Todos los derechos reservados.</p>
              <p className="mt-2">
                <em>Nota: Esta proyección es ilustrativa y muestra el potencial matemático de la duplicación 2×2.
                Los resultados reales dependen del esfuerzo individual y las condiciones del mercado.</em>
              </p>
            </div>
          </footer>
        </main>
      </div>
    </>
  );
}
