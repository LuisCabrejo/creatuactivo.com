'use client'

import { useState, useEffect } from 'react'
import {
  Calculator,
  TrendingUp,
  Users,
  Zap,
  Target,
  DollarSign,
  ArrowRight,
  Play,
  BarChart3,
  Lightbulb,
  MessageSquare,
  UserPlus,
  Crown,
  Sparkles,
  RefreshCw
} from 'lucide-react'

export default function CalculadoraPage() {
  // Estados Framework IAA
  const [iniciar, setIniciar] = useState(5)
  const [acoger, setAcoger] = useState(3)
  const [activar, setActivar] = useState(1)

  // Estados calculados
  const [proyecciones, setProyecciones] = useState({
    contactosSemanales: 0,
    conversionesSemanales: 0,
    nuevosConstructores: 0,
    ingresosSemana: 0,
    ingresosMes: 0,
    ingresosAno: 0,
    canalTamaño: 0,
    efectividad: 0
  })

  // Animación contador
  const [animandoResultados, setAnimandoResultados] = useState(false)

  // Cálculos Framework IAA tiempo real
  useEffect(() => {
    setAnimandoResultados(true)

    const timer = setTimeout(() => {
      // Fórmulas basadas en Framework IAA
      const contactosSemanales = iniciar * 3 // Cada INICIAR genera ~3 contactos
      const tasaConversion = (acoger / 10) * 0.4 // ACOGER mejora conversión hasta 40%
      const conversionesSemanales = contactosSemanales * tasaConversion
      const multiplicadorActivar = 1 + (activar * 0.8) // ACTIVAR multiplica exponencialmente

      const nuevosConstructores = conversionesSemanales * multiplicadorActivar
      const ingresosPorConstructor = 180 // Promedio conservador USD

      const ingresosSemana = nuevosConstructores * ingresosPorConstructor
      const ingresosMes = ingresosSemana * 4.33
      const ingresosAno = ingresosMes * 12

      const canalTamaño = nuevosConstructores * 52 // Proyección anual
      const efectividad = Math.min(((iniciar + acoger + activar) / 35) * 100, 100)

      setProyecciones({
        contactosSemanales: Math.round(contactosSemanales),
        conversionesSemanales: Math.round(conversionesSemanales * 10) / 10,
        nuevosConstructores: Math.round(nuevosConstructores * 10) / 10,
        ingresosSemana: Math.round(ingresosSemana),
        ingresosMes: Math.round(ingresosMes),
        ingresosAno: Math.round(ingresosAno),
        canalTamaño: Math.round(canalTamaño),
        efectividad: Math.round(efectividad)
      })

      setAnimandoResultados(false)
    }, 300)

    return () => clearTimeout(timer)
  }, [iniciar, acoger, activar])

  const sliders = [
    {
      id: 'iniciar',
      label: 'INICIAR',
      descripcion: 'Conexiones estratégicas semanales',
      valor: iniciar,
      max: 20,
      setter: setIniciar,
      icon: <Lightbulb className="w-6 h-6" />,
      gradient: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-500/20',
      textColor: 'text-blue-300',
      explicacion: 'Despertar interés y conectar personas con el ecosistema superior'
    },
    {
      id: 'acoger',
      label: 'ACOGER',
      descripcion: 'Sesiones consultoría estratégica semanales',
      valor: acoger,
      max: 10,
      setter: setAcoger,
      icon: <MessageSquare className="w-6 h-6" />,
      gradient: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-500/20',
      textColor: 'text-purple-300',
      explicacion: 'Intervenir momento óptimo con consultoría personalizada'
    },
    {
      id: 'activar',
      label: 'ACTIVAR',
      descripcion: 'Nuevos arquitectos activados semanalmente',
      valor: activar,
      max: 5,
      setter: setActivar,
      icon: <UserPlus className="w-6 h-6" />,
      gradient: 'from-green-500 to-green-600',
      bgColor: 'bg-green-500/20',
      textColor: 'text-green-300',
      explicacion: 'Entregar sistema completo y enseñar primer paso'
    }
  ]

  const metricas = [
    {
      titulo: 'Contactos/Semana',
      valor: proyecciones.contactosSemanales,
      suffix: '',
      icon: <Users className="w-6 h-6" />,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20'
    },
    {
      titulo: 'Conversiones/Semana',
      valor: proyecciones.conversionesSemanales,
      suffix: '',
      icon: <Target className="w-6 h-6" />,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20'
    },
    {
      titulo: 'Nuevos Constructores',
      valor: proyecciones.nuevosConstructores,
      suffix: '/sem',
      icon: <UserPlus className="w-6 h-6" />,
      color: 'text-green-400',
      bgColor: 'bg-green-500/20'
    },
    {
      titulo: 'Ingresos Semanales',
      valor: proyecciones.ingresosSemana,
      suffix: ' USD',
      icon: <DollarSign className="w-6 h-6" />,
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/20'
    },
    {
      titulo: 'Ingresos Mensuales',
      valor: proyecciones.ingresosMes,
      suffix: ' USD',
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'text-red-400',
      bgColor: 'bg-red-500/20'
    },
    {
      titulo: 'Canal Distribución',
      valor: proyecciones.canalTamaño,
      suffix: ' constructores/año',
      icon: <BarChart3 className="w-6 h-6" />,
      color: 'text-pink-400',
      bgColor: 'bg-pink-500/20'
    }
  ]

  const resetearCalculadora = () => {
    setIniciar(5)
    setAcoger(3)
    setActivar(1)
  }

  const maximizarFramework = () => {
    setIniciar(15)
    setAcoger(8)
    setActivar(4)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Hero Section */}
      <div className="relative px-4 lg:px-8 pt-16 pb-12">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-green-500/10 opacity-50"></div>

        <div className="relative max-w-7xl mx-auto text-center">
          {/* Badge Framework */}
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-xl rounded-full px-6 py-2 border border-blue-400/30 mb-8">
            <Calculator className="w-5 h-5 text-blue-300" />
            <span className="text-blue-300 font-semibold">Framework IAA Demo Interactiva</span>
          </div>

          {/* Título */}
          <h1 className="text-4xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-green-400 bg-clip-text text-transparent">
            Calculadora Framework
            <br />
            <span className="text-white">INICIAR, ACOGER, ACTIVAR</span>
          </h1>

          {/* Subtítulo */}
          <p className="text-xl lg:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
            Descubre el potencial real de tu canal de distribución usando la metodología revolucionaria que
            <span className="text-purple-400"> solo CreaTuActivo.com</span> puede enseñarte
          </p>

          {/* Acciones rápidas */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <button
              onClick={maximizarFramework}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 justify-center"
            >
              <Sparkles className="w-5 h-5" />
              Ver Potencial Máximo
            </button>
            <button
              onClick={resetearCalculadora}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-xl px-6 py-3 rounded-xl font-semibold transition-all duration-300 border border-white/20 flex items-center gap-2 justify-center"
            >
              <RefreshCw className="w-5 h-5" />
              Reiniciar Cálculo
            </button>
          </div>
        </div>
      </div>

      {/* Calculadora Interactiva */}
      <div className="px-4 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Framework IAA Sliders */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {sliders.map((slider) => (
              <div key={slider.id} className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300">
                <div className="flex items-center gap-4 mb-6">
                  <div className={`p-3 rounded-xl ${slider.bgColor} ${slider.textColor}`}>
                    {slider.icon}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">{slider.label}</h3>
                    <p className="text-gray-400 text-sm">{slider.descripcion}</p>
                  </div>
                </div>

                {/* Slider */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-gray-400">Valor actual:</span>
                    <span className={`text-2xl font-bold ${slider.textColor}`}>{slider.valor}</span>
                  </div>

                  <div className="relative">
                    <input
                      type="range"
                      min="0"
                      max={slider.max}
                      value={slider.valor}
                      onChange={(e) => slider.setter(parseInt(e.target.value))}
                      className={`w-full h-3 rounded-lg appearance-none cursor-pointer slider-${slider.id}`}
                      style={{
                        background: `linear-gradient(to right,
                          rgb(59 130 246) 0%,
                          rgb(139 92 246) ${(slider.valor / slider.max) * 100}%,
                          rgb(71 85 105) ${(slider.valor / slider.max) * 100}%,
                          rgb(71 85 105) 100%)`
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0</span>
                    <span>{slider.max}</span>
                  </div>
                </div>

                {/* Explicación */}
                <div className={`${slider.bgColor} rounded-xl p-4 border border-opacity-30`}>
                  <p className="text-sm text-gray-300">{slider.explicacion}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Efectividad Framework */}
          <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 backdrop-blur-xl rounded-2xl p-8 border border-orange-400/30 mb-12">
            <div className="text-center">
              <h3 className="text-3xl font-bold mb-4 text-white">Efectividad Framework IAA</h3>
              <div className="relative w-full bg-gray-700 rounded-full h-6 mb-4">
                <div
                  className="bg-gradient-to-r from-orange-500 to-red-500 h-6 rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                  style={{ width: `${proyecciones.efectividad}%` }}
                >
                  <span className="text-white font-bold text-sm">{proyecciones.efectividad}%</span>
                </div>
              </div>
              <p className="text-orange-300">
                {proyecciones.efectividad < 30 ? 'Potencial iniciando - Incrementa tus acciones Framework' :
                 proyecciones.efectividad < 60 ? 'Construyendo momentum - Buen progreso detectado' :
                 proyecciones.efectividad < 85 ? 'Alto rendimiento - Dominio Framework evidente' :
                 'CONSTRUCTOR ÉLITE - Framework IAA dominado completamente'}
              </p>
            </div>
          </div>

          {/* Métricas Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {metricas.map((metrica, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
                <div className="flex items-center gap-4 mb-4">
                  <div className={`p-3 rounded-xl ${metrica.bgColor}`}>
                    <div className={metrica.color}>
                      {metrica.icon}
                    </div>
                  </div>
                  <h4 className="text-lg font-semibold text-white">{metrica.titulo}</h4>
                </div>

                <div className={`text-3xl font-bold ${metrica.color} ${animandoResultados ? 'opacity-50' : 'opacity-100'} transition-opacity duration-300`}>
                  {metrica.valor.toLocaleString()}{metrica.suffix}
                </div>
              </div>
            ))}
          </div>

          {/* Proyección Anual Destacada */}
          <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-xl rounded-3xl p-8 lg:p-12 border border-purple-400/30 mb-12">
            <div className="text-center">
              <Crown className="w-16 h-16 text-purple-400 mx-auto mb-6" />
              <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Proyección Anual Framework IAA
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6">
                  <div className="text-4xl font-bold text-green-400 mb-2">
                    ${proyecciones.ingresosAno.toLocaleString()}
                  </div>
                  <div className="text-gray-300">Ingresos Anuales Proyectados</div>
                </div>

                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6">
                  <div className="text-4xl font-bold text-blue-400 mb-2">
                    {proyecciones.canalTamaño}
                  </div>
                  <div className="text-gray-300">Constructores en tu Canal</div>
                </div>

                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6">
                  <div className="text-4xl font-bold text-purple-400 mb-2">
                    {Math.round(proyecciones.nuevosConstructores * 52)}
                  </div>
                  <div className="text-gray-300">Activaciones Anuales</div>
                </div>
              </div>

              <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                Estos números son proyecciones conservadoras basadas en Framework IAA.
                <span className="text-purple-400"> Constructores élite superan estas métricas.</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Superior */}
      <div className="px-4 lg:px-8 py-16 bg-gradient-to-t from-slate-900 to-slate-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            La Calculadora Es Solo El Inicio
          </h2>
          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            Esta demo muestra una fracción del poder real. El ecosistema NodeX completo incluye
            automatización 24/7, analytics avanzados, y herramientas que <span className="text-blue-400">la competencia no puede igualar.</span>
          </p>

          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <Zap className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
                <div className="text-2xl font-bold text-yellow-400 mb-2">80%</div>
                <div className="text-gray-400">Trabajo Automatizado</div>
              </div>
              <div>
                <Target className="w-8 h-8 text-green-400 mx-auto mb-3" />
                <div className="text-2xl font-bold text-green-400 mb-2">24/7</div>
                <div className="text-gray-400">Sistema Activo</div>
              </div>
              <div>
                <Crown className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                <div className="text-2xl font-bold text-purple-400 mb-2">100%</div>
                <div className="text-gray-400">Acceso NodeX</div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-10 py-5 rounded-xl font-bold text-lg transition-all duration-300 flex items-center gap-2 justify-center shadow-2xl">
              <Play className="w-6 h-6" />
              Acceder NodeX Completo
              <ArrowRight className="w-6 h-6" />
            </button>
            <button className="bg-white/10 hover:bg-white/20 backdrop-blur-xl px-10 py-5 rounded-xl font-semibold text-lg transition-all duration-300 border border-white/20 flex items-center gap-2 justify-center">
              <Crown className="w-6 h-6" />
              Aplicar Constructor Fundador
            </button>
          </div>

          <p className="text-sm text-gray-500 mt-6">
            * Proyecciones basadas en Framework IAA probado. Resultados dependen de ejecución individual del método.
          </p>
        </div>
      </div>

      {/* Estilos para sliders customizados */}
      <style jsx>{`
        input[type="range"]::-webkit-slider-thumb {
          appearance: none;
          height: 24px;
          width: 24px;
          border-radius: 50%;
          background: linear-gradient(45deg, #3B82F6, #8B5CF6);
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        }

        input[type="range"]::-moz-range-thumb {
          height: 24px;
          width: 24px;
          border-radius: 50%;
          background: linear-gradient(45deg, #3B82F6, #8B5CF6);
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        }
      `}</style>
    </div>
  )
}
