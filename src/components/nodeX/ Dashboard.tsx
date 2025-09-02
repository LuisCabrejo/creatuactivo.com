// src/components/nodeX/Dashboard.tsx
'use client'
import React, { useState, useEffect } from 'react'
import { TrendingUp, Users, Zap, Target, BarChart3, Clock, Award, ArrowUp } from 'lucide-react'

interface MetricData {
  current: number
  previous: number
  target: number
  trend: 'up' | 'down' | 'stable'
}

interface DashboardData {
  iniciar: MetricData
  acoger: MetricData
  activar: MetricData
  weeklyVolume: number
  monthlyGrowth: number
  activeConstructors: number
}

export default function NodeXDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('week')
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simular carga de datos reales Framework IAA
    const loadDashboardData = async () => {
      setLoading(true)

      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Datos simulados realistas
      const mockData: DashboardData = {
        iniciar: {
          current: 12,
          previous: 9,
          target: 20,
          trend: 'up'
        },
        acoger: {
          current: 5,
          previous: 3,
          target: 8,
          trend: 'up'
        },
        activar: {
          current: 2,
          previous: 1,
          target: 3,
          trend: 'up'
        },
        weeklyVolume: 2450,
        monthlyGrowth: 23.5,
        activeConstructors: 14
      }

      setDashboardData(mockData)
      setLoading(false)
    }

    loadDashboardData()
  }, [selectedPeriod])

  const calculateProgress = (current: number, target: number) =>
    Math.min((current / target) * 100, 100)

  const formatTrend = (current: number, previous: number) => {
    const change = current - previous
    const percentage = previous > 0 ? (change / previous * 100) : 0
    return {
      value: change,
      percentage: percentage.toFixed(1),
      isPositive: change >= 0
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Loading skeleton */}
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 animate-pulse">
            <div className="h-6 bg-white/10 rounded mb-4 w-1/3"></div>
            <div className="h-8 bg-white/10 rounded mb-2 w-1/2"></div>
            <div className="h-4 bg-white/10 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    )
  }

  if (!dashboardData) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 relative overflow-hidden">
      {/* Fondo dinámico */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(59,130,246,0.3),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(139,92,246,0.2),transparent_50%)]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-200 to-purple-200 bg-clip-text text-transparent">
                ⚡ Centro de Comando NodeX
              </h1>
              <p className="text-white/70 mt-2">
                Framework "INICIAR, ACOGER, ACTIVAR" - Métricas en tiempo real
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-400"
              >
                <option value="week">Esta semana</option>
                <option value="month">Este mes</option>
                <option value="quarter">Este trimestre</option>
              </select>
            </div>
          </div>
        </div>

        {/* Métricas Framework IAA */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* INICIAR */}
          <div className="bg-white/5 backdrop-blur-xl border border-blue-500/30 rounded-2xl p-6 hover:bg-white/10 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-500/20 rounded-lg">
                <Zap className="w-6 h-6 text-blue-400" />
              </div>
              <div className="text-right">
                {(() => {
                  const trend = formatTrend(dashboardData.iniciar.current, dashboardData.iniciar.previous)
                  return (
                    <div className={`flex items-center space-x-1 ${trend.isPositive ? 'text-green-400' : 'text-red-400'}`}>
                      <ArrowUp className={`w-4 h-4 ${!trend.isPositive && 'rotate-180'}`} />
                      <span className="text-sm font-semibold">+{trend.value}</span>
                    </div>
                  )
                })()}
              </div>
            </div>

            <div className="mb-4">
              <div className="flex items-baseline space-x-2 mb-2">
                <span className="text-3xl font-bold text-white">{dashboardData.iniciar.current}</span>
                <span className="text-white/60">/ {dashboardData.iniciar.target}</span>
              </div>
              <p className="text-blue-400 font-semibold mb-1">INICIAR</p>
              <p className="text-white/60 text-sm">Contactos activados con curiosidad</p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-white/70">Progreso</span>
                <span className="text-white">{calculateProgress(dashboardData.iniciar.current, dashboardData.iniciar.target).toFixed(0)}%</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-blue-400 h-2 rounded-full transition-all duration-700"
                  style={{ width: `${calculateProgress(dashboardData.iniciar.current, dashboardData.iniciar.target)}%` }}
                />
              </div>
            </div>
          </div>

          {/* ACOGER */}
          <div className="bg-white/5 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-6 hover:bg-white/10 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-500/20 rounded-lg">
                <Users className="w-6 h-6 text-purple-400" />
              </div>
              <div className="text-right">
                {(() => {
                  const trend = formatTrend(dashboardData.acoger.current, dashboardData.acoger.previous)
                  return (
                    <div className={`flex items-center space-x-1 ${trend.isPositive ? 'text-green-400' : 'text-red-400'}`}>
                      <ArrowUp className={`w-4 h-4 ${!trend.isPositive && 'rotate-180'}`} />
                      <span className="text-sm font-semibold">+{trend.value}</span>
                    </div>
                  )
                })()}
              </div>
            </div>

            <div className="mb-4">
              <div className="flex items-baseline space-x-2 mb-2">
                <span className="text-3xl font-bold text-white">{dashboardData.acoger.current}</span>
                <span className="text-white/60">/ {dashboardData.acoger.target}</span>
              </div>
              <p className="text-purple-400 font-semibold mb-1">ACOGER</p>
              <p className="text-white/60 text-sm">Consultorías estratégicas completadas</p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-white/70">Progreso</span>
                <span className="text-white">{calculateProgress(dashboardData.acoger.current, dashboardData.acoger.target).toFixed(0)}%</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-purple-500 to-purple-400 h-2 rounded-full transition-all duration-700"
                  style={{ width: `${calculateProgress(dashboardData.acoger.current, dashboardData.acoger.target)}%` }}
                />
              </div>
            </div>
          </div>

          {/* ACTIVAR */}
          <div className="bg-white/5 backdrop-blur-xl border border-green-500/30 rounded-2xl p-6 hover:bg-white/10 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-500/20 rounded-lg">
                <Target className="w-6 h-6 text-green-400" />
              </div>
              <div className="text-right">
                {(() => {
                  const trend = formatTrend(dashboardData.activar.current, dashboardData.activar.previous)
                  return (
                    <div className={`flex items-center space-x-1 ${trend.isPositive ? 'text-green-400' : 'text-red-400'}`}>
                      <ArrowUp className={`w-4 h-4 ${!trend.isPositive && 'rotate-180'}`} />
                      <span className="text-sm font-semibold">+{trend.value}</span>
                    </div>
                  )
                })()}
              </div>
            </div>

            <div className="mb-4">
              <div className="flex items-baseline space-x-2 mb-2">
                <span className="text-3xl font-bold text-white">{dashboardData.activar.current}</span>
                <span className="text-white/60">/ {dashboardData.activar.target}</span>
              </div>
              <p className="text-green-400 font-semibold mb-1">ACTIVAR</p>
              <p className="text-white/60 text-sm">Nuevos constructores incorporados</p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-white/70">Progreso</span>
                <span className="text-white">{calculateProgress(dashboardData.activar.current, dashboardData.activar.target).toFixed(0)}%</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-green-500 to-green-400 h-2 rounded-full transition-all duration-700"
                  style={{ width: `${calculateProgress(dashboardData.activar.current, dashboardData.activar.target)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Feed de Actividad Reciente */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Actividad Framework IAA */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-cyan-400" />
              Actividad Reciente Framework IAA
            </h3>

            <div className="space-y-4">
              {[
                { type: 'iniciar', action: 'Nuevo contacto activado', time: '2h', name: 'María González' },
                { type: 'acoger', action: 'Consultoría completada', time: '4h', name: 'Carlos Ruiz' },
                { type: 'activar', action: 'Constructor incorporado', time: '1d', name: 'Ana López' },
                { type: 'iniciar', action: 'Mensaje estratégico enviado', time: '1d', name: 'Pedro Martín' }
              ].map((activity, i) => (
                <div key={i} className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                  <div className={`p-2 rounded-lg ${
                    activity.type === 'iniciar' ? 'bg-blue-500/20' :
                    activity.type === 'acoger' ? 'bg-purple-500/20' : 'bg-green-500/20'
                  }`}>
                    {activity.type === 'iniciar' ? <Zap className="w-4 h-4 text-blue-400" /> :
                     activity.type === 'acoger' ? <Users className="w-4 h-4 text-purple-400" /> :
                     <Target className="w-4 h-4 text-green-400" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-white text-sm font-medium">{activity.action}</p>
                    <p className="text-white/60 text-xs">{activity.name}</p>
                  </div>
                  <span className="text-white/50 text-xs">{activity.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* KPIs Secundarios */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-cyan-400" />
              KPIs Activo Empresarial
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div>
                  <p className="text-white font-medium">Volumen Semanal</p>
                  <p className="text-white/60 text-sm">Productos consumidos</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-cyan-400">${dashboardData.weeklyVolume.toLocaleString()}</p>
                  <p className="text-green-400 text-sm">+15.2%</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div>
                  <p className="text-white font-medium">Crecimiento Mensual</p>
                  <p className="text-white/60 text-sm">Red de constructores</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-purple-400">{dashboardData.monthlyGrowth}%</p>
                  <p className="text-green-400 text-sm">+5.3%</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div>
                  <p className="text-white font-medium">Constructores Activos</p>
                  <p className="text-white/60 text-sm">En tu organización</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-400">{dashboardData.activeConstructors}</p>
                  <p className="text-green-400 text-sm">+2 nuevo</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Acciones Rápidas */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">
            ⚡ Acciones Rápidas Framework IAA
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="p-4 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg transition-colors text-left">
              <Zap className="w-6 h-6 text-blue-400 mb-2" />
              <p className="text-white font-medium">Nuevo INICIAR</p>
              <p className="text-white/60 text-sm">Generar mensaje estratégico</p>
            </button>

            <button className="p-4 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 rounded-lg transition-colors text-left">
              <Users className="w-6 h-6 text-purple-400 mb-2" />
              <p className="text-white font-medium">Programar ACOGER</p>
              <p className="text-white/60 text-sm">Consultoría estratégica</p>
            </button>

            <button className="p-4 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 rounded-lg transition-colors text-left">
              <Target className="w-6 h-6 text-green-400 mb-2" />
              <p className="text-white font-medium">Proceso ACTIVAR</p>
              <p className="text-white/60 text-sm">Incorporar constructor</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
