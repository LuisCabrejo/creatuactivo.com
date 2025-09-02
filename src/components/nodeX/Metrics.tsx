// src/components/nodeX/Metrics.tsx
'use client'
import React, { useState, useEffect } from 'react'
import { BarChart3, TrendingUp, Users, Target, Calendar, Download, Filter } from 'lucide-react'

interface ChartData {
  period: string
  iniciar: number
  acoger: number
  activar: number
  revenue: number
}

interface ConversionFunnelData {
  contacts: number
  interested: number
  consultations: number
  activated: number
}

export default function NodeXMetrics() {
  const [selectedPeriod, setSelectedPeriod] = useState('weekly')
  const [selectedView, setSelectedView] = useState('framework')
  const [chartData, setChartData] = useState<ChartData[]>([])
  const [funnelData, setFunnelData] = useState<ConversionFunnelData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadMetricsData = async () => {
      setLoading(true)
      await new Promise(resolve => setTimeout(resolve, 800))

      // Datos simulados para charts Framework IAA
      const mockChartData: ChartData[] = [
        { period: 'Sem 1', iniciar: 8, acoger: 3, activar: 1, revenue: 1200 },
        { period: 'Sem 2', iniciar: 12, acoger: 5, activar: 2, revenue: 2100 },
        { period: 'Sem 3', iniciar: 15, acoger: 7, activar: 3, revenue: 3200 },
        { period: 'Sem 4', iniciar: 18, acoger: 8, activar: 4, revenue: 4100 },
        { period: 'Sem 5', iniciar: 22, acoger: 10, activar: 5, revenue: 5300 }
      ]

      const mockFunnelData: ConversionFunnelData = {
        contacts: 150,
        interested: 45,
        consultations: 18,
        activated: 7
      }

      setChartData(mockChartData)
      setFunnelData(mockFunnelData)
      setLoading(false)
    }

    loadMetricsData()
  }, [selectedPeriod])

  const calculateConversionRate = (current: number, total: number) =>
    ((current / total) * 100).toFixed(1)

  const maxValue = Math.max(...chartData.map(d => Math.max(d.iniciar, d.acoger, d.activar)))

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <BarChart3 className="w-8 h-8 text-white" />
          </div>
          <p className="text-white/70 text-lg">Cargando métricas avanzadas...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 relative overflow-hidden">
      {/* Fondo dinámico */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(59,130,246,0.3),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(139,92,246,0.2),transparent_50%)]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 lg:px-8 py-8">
        {/* Header con controles */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-200 to-purple-200 bg-clip-text text-transparent">
                📊 Analytics Avanzado NodeX
              </h1>
              <p className="text-white/70 mt-2">
                Métricas inteligentes Framework "INICIAR, ACOGER, ACTIVAR"
              </p>
            </div>

            <div className="flex items-center space-x-4 mt-4 lg:mt-0">
              <select
                value={selectedView}
                onChange={(e) => setSelectedView(e.target.value)}
                className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-400"
              >
                <option value="framework">Framework IAA</option>
                <option value="financial">Financiero</option>
                <option value="conversion">Conversión</option>
              </select>

              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-400"
              >
                <option value="weekly">Semanal</option>
                <option value="monthly">Mensual</option>
                <option value="quarterly">Trimestral</option>
              </select>

              <button className="bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg px-4 py-2 text-white transition-colors flex items-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Exportar</span>
              </button>
            </div>
          </div>
        </div>

        {/* Vista Framework IAA */}
        {selectedView === 'framework' && (
          <div className="space-y-8">
            {/* Chart Principal Framework IAA */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-white mb-6">
                Evolución Framework "INICIAR, ACOGER, ACTIVAR"
              </h3>

              <div className="space-y-6">
                {/* Leyenda */}
                <div className="flex justify-center space-x-8">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-blue-500 rounded"></div>
                    <span className="text-white/80">INICIAR</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-purple-500 rounded"></div>
                    <span className="text-white/80">ACOGER</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-green-500 rounded"></div>
                    <span className="text-white/80">ACTIVAR</span>
                  </div>
                </div>

                {/* Chart Visual */}
                <div className="relative h-80 bg-white/5 rounded-xl p-6">
                  <div className="flex items-end justify-between h-full space-x-4">
                    {chartData.map((data, index) => (
                      <div key={index} className="flex-1 flex flex-col items-center space-y-2">
                        <div className="flex items-end space-x-1 h-48">
                          {/* INICIAR bar */}
                          <div className="relative group">
                            <div
                              className="w-8 bg-gradient-to-t from-blue-600 to-blue-400 rounded-t transition-all duration-500 hover:opacity-80"
                              style={{ height: `${(data.iniciar / maxValue) * 100}%` }}
                            />
                            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                              {data.iniciar}
                            </div>
                          </div>

                          {/* ACOGER bar */}
                          <div className="relative group">
                            <div
                              className="w-8 bg-gradient-to-t from-purple-600 to-purple-400 rounded-t transition-all duration-500 hover:opacity-80"
                              style={{ height: `${(data.acoger / maxValue) * 100}%` }}
                            />
                            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-purple-500 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                              {data.acoger}
                            </div>
                          </div>

                          {/* ACTIVAR bar */}
                          <div className="relative group">
                            <div
                              className="w-8 bg-gradient-to-t from-green-600 to-green-400 rounded-t transition-all duration-500 hover:opacity-80"
                              style={{ height: `${(data.activar / maxValue) * 100}%` }}
                            />
                            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-green-500 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                              {data.activar}
                            </div>
                          </div>
                        </div>

                        <span className="text-white/70 text-sm">{data.period}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Funnel de Conversión */}
            {funnelData && (
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-white mb-6">
                  Funnel de Conversión Framework IAA
                </h3>

                <div className="space-y-6">
                  {[
                    { label: 'Contactos Totales', value: funnelData.contacts, color: 'cyan', width: 100 },
                    { label: 'Mostraron Interés', value: funnelData.interested, color: 'blue', width: 75 },
                    { label: 'Aceptaron Consultoría', value: funnelData.consultations, color: 'purple', width: 50 },
                    { label: 'Se Activaron', value: funnelData.activated, color: 'green', width: 25 }
                  ].map((stage, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-white font-medium">{stage.label}</span>
                        <div className="flex items-center space-x-4">
                          <span className="text-white font-bold">{stage.value}</span>
                          {index > 0 && (
                            <span className="text-green-400 text-sm">
                              {calculateConversionRate(stage.value, funnelData.contacts)}%
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="relative">
                        <div className="w-full bg-slate-700 rounded-full h-6"></div>
                        <div
                          className={`absolute top-0 left-0 h-6 bg-gradient-to-r from-${stage.color}-500 to-${stage.color}-400 rounded-full transition-all duration-1000 flex items-center justify-end pr-3`}
                          style={{ width: `${stage.width}%` }}
                        >
                          <span className="text-white text-sm font-medium">{stage.value}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Vista Financiera */}
        {selectedView === 'financial' && (
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-6">
              Métricas Financieras Activo Empresarial
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: 'Ingresos Totales', value: '$12,800', change: '+23.5%', color: 'green' },
                { title: 'Volumen Mensual', value: '$8,400', change: '+18.2%', color: 'blue' },
                { title: 'Comisiones Directas', value: '$2,100', change: '+31.0%', color: 'purple' },
                { title: 'Bonos Equipo', value: '$2,300', change: '+15.8%', color: 'cyan' }
              ].map((metric, index) => (
                <div key={index} className={`bg-${metric.color}-500/10 border border-${metric.color}-500/30 rounded-xl p-6`}>
                  <p className="text-white/70 text-sm mb-2">{metric.title}</p>
                  <p className="text-2xl font-bold text-white mb-1">{metric.value}</p>
                  <p className={`text-${metric.color}-400 text-sm font-medium`}>{metric.change}</p>
                </div>
              ))}
            </div>

            {/* Chart financiero */}
            <div className="mt-8 h-64 bg-white/5 rounded-xl p-6 flex items-center justify-center">
              <p className="text-white/60">Chart financiero en desarrollo...</p>
            </div>
          </div>
        )}

        {/* Vista Conversión */}
        {selectedView === 'conversion' && (
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-6">
              Análisis de Conversión Detallado
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Tasas de conversión por etapa */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-white">Tasas de Conversión por Etapa</h4>
                {[
                  { from: 'Contacto', to: 'Interés', rate: 30, count: '45/150' },
                  { from: 'Interés', to: 'Consultoría', rate: 40, count: '18/45' },
                  { from: 'Consultoría', to: 'Activación', rate: 38, count: '7/18' }
                ].map((conversion, index) => (
                  <div key={index} className="bg-white/5 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white text-sm">{conversion.from} → {conversion.to}</span>
                      <span className="text-cyan-400 font-semibold">{conversion.rate}%</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full transition-all duration-700"
                        style={{ width: `${conversion.rate}%` }}
                      />
                    </div>
                    <p className="text-white/60 text-xs mt-1">{conversion.count}</p>
                  </div>
                ))}
              </div>

              {/* Tiempo promedio por etapa */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-white">Tiempo Promedio por Etapa</h4>
                {[
                  { stage: 'Primera respuesta', time: '2.3 días', icon: '⚡' },
                  { stage: 'Agendar consultoría', time: '5.1 días', icon: '📅' },
                  { stage: 'Proceso activación', time: '1.8 días', icon: '🚀' }
                ].map((timing, index) => (
                  <div key={index} className="bg-white/5 rounded-lg p-4 flex items-center space-x-4">
                    <div className="text-2xl">{timing.icon}</div>
                    <div className="flex-1">
                      <p className="text-white font-medium">{timing.stage}</p>
                      <p className="text-white/60 text-sm">Tiempo promedio</p>
                    </div>
                    <div className="text-purple-400 font-bold">{timing.time}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Insights y Recomendaciones */}
        <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/30 rounded-2xl p-8">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-cyan-400" />
            Insights Inteligentes Framework IAA
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <p className="text-cyan-400 font-semibold">📈 Tendencias Positivas</p>
              <ul className="space-y-2 text-white/80 text-sm">
                <li>• Conversión INICIAR → ACOGER mejoró 15% esta semana</li>
                <li>• Tiempo promedio de activación se redujo a 1.8 días</li>
                <li>• Tasa de retención constructores activos: 92%</li>
              </ul>
            </div>

            <div className="space-y-3">
              <p className="text-purple-400 font-semibold">🎯 Recomendaciones</p>
              <ul className="space-y-2 text-white/80 text-sm">
                <li>• Incrementar frecuencia INICIAR: +3 contactos semanales</li>
                <li>• Optimizar seguimiento post-consultoría ACOGER</li>
                <li>• Implementar sistema buddy para nuevos ACTIVAR</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
