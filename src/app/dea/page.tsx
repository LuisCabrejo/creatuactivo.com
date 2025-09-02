'use client'

import { useState } from 'react'
import {
  Brain,
  Settings,
  Zap,
  BarChart3,
  Users,
  TrendingUp,
  Clock,
  Shield,
  Target,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Star,
  Crown,
  Cpu,
  Network,
  Bot
} from 'lucide-react'

export default function DEAPage() {
  const [activeComparison, setActiveComparison] = useState(0)

  const modeloComparacion = [
    {
      id: 'tradicional',
      title: 'Modelo Tradicional',
      subtitle: '100% Trabajo Manual',
      color: 'red',
      percentage: 100,
      elementos: [
        { tarea: 'Prospección', manual: 100, auto: 0 },
        { tarea: 'Seguimiento', manual: 100, auto: 0 },
        { tarea: 'Presentaciones', manual: 100, auto: 0 },
        { tarea: 'Capacitación', manual: 100, auto: 0 },
        { tarea: 'Soporte', manual: 100, auto: 0 },
        { tarea: 'Análisis', manual: 100, auto: 0 }
      ]
    },
    {
      id: 'dea',
      title: 'Modelo DEA',
      subtitle: '20% Estrategia + 80% Automatización',
      color: 'green',
      percentage: 80,
      elementos: [
        { tarea: 'Prospección', manual: 20, auto: 80 },
        { tarea: 'Seguimiento', manual: 15, auto: 85 },
        { tarea: 'Presentaciones', manual: 10, auto: 90 },
        { tarea: 'Capacitación', manual: 25, auto: 75 },
        { tarea: 'Soporte', manual: 5, auto: 95 },
        { tarea: 'Análisis', manual: 0, auto: 100 }
      ]
    }
  ]

  const automatizacionTools = [
    {
      categoria: 'Inteligencia Artificial',
      icon: <Brain className="w-8 h-8" />,
      color: 'blue',
      herramientas: [
        {
          nombre: 'Generador Mensajes IA',
          descripcion: 'Crear comunicaciones personalizadas Framework IAA',
          automatizacion: '95%'
        },
        {
          nombre: 'Análisis Sentimiento',
          descripcion: 'Identificar momento óptimo para ACOGER',
          automatizacion: '90%'
        },
        {
          nombre: 'Predicción Conversión',
          descripcion: 'Score probabilidad ACTIVAR exitoso',
          automatizacion: '85%'
        }
      ]
    },
    {
      categoria: 'Automatización Procesos',
      icon: <Settings className="w-8 h-8" />,
      color: 'purple',
      herramientas: [
        {
          nombre: 'Personalización Portal',
          descripcion: 'Todas las herramientas con datos del constructor',
          automatizacion: '100%'
        },
        {
          nombre: 'Secuencias Follow-up',
          descripcion: 'Nurturing inteligente post-INICIAR',
          automatizacion: '90%'
        },
        {
          nombre: 'Reportes Automáticos',
          descripcion: 'Analytics y métricas tiempo real',
          automatizacion: '100%'
        }
      ]
    },
    {
      categoria: 'Ecosistema Integrado',
      icon: <Network className="w-8 h-8" />,
      color: 'green',
      herramientas: [
        {
          nombre: 'Centro Comando NodeX',
          descripcion: 'Dashboard unificado todas las herramientas',
          automatizacion: '85%'
        },
        {
          nombre: 'Sistema Capacitación',
          descripcion: 'Entrenamiento Framework IAA automatizado',
          automatizacion: '80%'
        },
        {
          nombre: 'Soporte 24/7',
          descripcion: 'Resolución consultas y objeciones automática',
          automatizacion: '95%'
        }
      ]
    }
  ]

  const ventajasCompetitivas = [
    {
      aspecto: 'Tiempo Construcción Canal',
      tradicional: '12-18 meses',
      dea: '3-6 meses',
      mejora: '3x más rápido'
    },
    {
      aspecto: 'Horas Trabajo Semanal',
      tradicional: '25-40 horas',
      dea: '5-10 horas',
      mejora: '75% menos tiempo'
    },
    {
      aspecto: 'Tasa Conversión',
      tradicional: '5-10%',
      dea: '25-40%',
      mejora: '4x más efectivo'
    },
    {
      aspecto: 'Costo Herramientas',
      tradicional: '$500-1000/mes',
      dea: 'Incluido ecosistema',
      mejora: '$12,000/año ahorrado'
    },
    {
      aspecto: 'Escalabilidad',
      tradicional: 'Lineal con trabajo',
      dea: 'Exponencial automática',
      mejora: 'Crecimiento sin límites'
    }
  ]

  const arquitecturaTecnologica = [
    {
      capa: 'Frontend Inteligente',
      descripcion: 'Interface premium glassmorphism + UX C-Suite',
      tecnologias: ['React 18', 'Next.js 14', 'Tailwind CSS', 'Framer Motion']
    },
    {
      capa: 'Backend Automatización',
      descripcion: 'APIs inteligentes + procesamiento tiempo real',
      tecnologias: ['Node.js', 'AI/ML Models', 'WebRTC', 'Microservices']
    },
    {
      capa: 'Base Datos Inteligente',
      descripcion: 'Analytics avanzados + patrones comportamiento',
      tecnologias: ['PostgreSQL', 'Redis Cache', 'Analytics Engine', 'ML Pipeline']
    },
    {
      capa: 'Infraestructura Escalable',
      descripcion: 'Cloud premium + disponibilidad 99.9%',
      tecnologias: ['AWS/Azure', 'CDN Global', 'Auto-scaling', 'Monitoring']
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Hero Section */}
      <div className="relative px-4 lg:px-8 pt-16 pb-24">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-green-500/10 opacity-50"></div>

        <div className="relative max-w-7xl mx-auto text-center">
          {/* Badge exclusivo */}
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/20 to-green-500/20 backdrop-blur-xl rounded-full px-6 py-2 border border-blue-400/30 mb-8">
            <Bot className="w-5 h-5 text-blue-300" />
            <span className="text-blue-300 font-semibold">Tecnología Exclusiva CreaTuActivo.com</span>
          </div>

          {/* Título principal */}
          <h1 className="text-5xl lg:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-400 via-green-400 to-purple-400 bg-clip-text text-transparent">
              Modelo DEA
            </span>
            <br />
            <span className="text-white">Distribución Estratégica Automatizada</span>
          </h1>

          {/* Subtítulo */}
          <p className="text-xl lg:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
            El único modelo de la industria que combina <span className="text-blue-400">decisiones estratégicas humanas (20%)</span> con
            <span className="text-green-400"> automatización tecnológica (80%)</span> para construir activos escalables.
          </p>

          {/* Estadística Impactante */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 inline-block mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-blue-400 mb-2">80%</div>
                <div className="text-gray-400">Trabajo Automatizado</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-green-400 mb-2">4x</div>
                <div className="text-gray-400">Más Efectivo</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-purple-400 mb-2">24/7</div>
                <div className="text-gray-400">Sistema Activo</div>
              </div>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-blue-500 to-green-600 hover:from-blue-600 hover:to-green-700 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center gap-2 justify-center">
              <Cpu className="w-5 h-5" />
              Ver Arquitectura Tecnológica
              <ArrowRight className="w-5 h-5" />
            </button>
            <button className="bg-white/10 hover:bg-white/20 backdrop-blur-xl px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 border border-white/20 flex items-center gap-2 justify-center">
              <Zap className="w-5 h-5" />
              Acceder Modelo DEA
            </button>
          </div>
        </div>
      </div>

      {/* Comparación Modelos */}
      <div className="px-4 lg:px-8 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-red-400 to-green-400 bg-clip-text text-transparent">
              Modelo DEA vs Distribución Tradicional
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              La diferencia que hace que CreaTuActivo.com opere en una nueva categoría tecnológica superior.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {modeloComparacion.map((modelo, index) => (
              <div
                key={modelo.id}
                className={`bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 ${
                  modelo.color === 'red' ? 'border-red-500/30' : 'border-green-500/30'
                }`}
              >
                <div className="text-center mb-8">
                  <div className={`inline-flex p-4 rounded-xl mb-4 ${
                    modelo.color === 'red' ? 'bg-red-500/20' : 'bg-green-500/20'
                  }`}>
                    {modelo.color === 'red' ?
                      <AlertTriangle className="w-8 h-8 text-red-400" /> :
                      <Crown className="w-8 h-8 text-green-400" />
                    }
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">{modelo.title}</h3>
                  <p className={modelo.color === 'red' ? 'text-red-400' : 'text-green-400'}>
                    {modelo.subtitle}
                  </p>
                </div>

                <div className="space-y-4">
                  {modelo.elementos.map((elemento, idx) => (
                    <div key={idx} className="bg-white/5 rounded-xl p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-white font-medium">{elemento.tarea}</span>
                        <span className={`text-sm font-semibold ${
                          modelo.color === 'red' ? 'text-red-400' : 'text-green-400'
                        }`}>
                          {modelo.color === 'red' ? `${elemento.manual}% Manual` : `${elemento.auto}% Auto`}
                        </span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full transition-all duration-500 ${
                            modelo.color === 'red' ? 'bg-red-500' : 'bg-green-500'
                          }`}
                          style={{
                            width: `${modelo.color === 'red' ? elemento.manual : elemento.auto}%`
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Herramientas Automatización */}
      <div className="px-4 lg:px-8 py-16 bg-gradient-to-r from-slate-900/50 to-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Arsenal Tecnológico DEA
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Cada herramienta diseñada para automatizar el trabajo pesado y potenciar tus decisiones estratégicas.
            </p>
          </div>

          <div className="space-y-12">
            {automatizacionTools.map((categoria, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20">
                <div className="flex items-center gap-4 mb-8">
                  <div className={`p-4 rounded-xl bg-${categoria.color}-500/20`}>
                    <div className={`text-${categoria.color}-400`}>
                      {categoria.icon}
                    </div>
                  </div>
                  <h3 className="text-3xl font-bold text-white">{categoria.categoria}</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {categoria.herramientas.map((herramienta, idx) => (
                    <div key={idx} className="bg-white/10 rounded-xl p-6 hover:bg-white/15 transition-all duration-300">
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="text-lg font-semibold text-white">{herramienta.nombre}</h4>
                        <span className="text-green-400 font-bold text-sm bg-green-500/20 px-2 py-1 rounded">
                          {herramienta.automatizacion}
                        </span>
                      </div>
                      <p className="text-gray-300 text-sm">{herramienta.descripcion}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Ventajas Competitivas */}
      <div className="px-4 lg:px-8 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
              Ventajas Competitivas Modelo DEA
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Resultados medibles que demuestran por qué DEA redefine la construcción de canales de distribución.
            </p>
          </div>

          <div className="space-y-6">
            {ventajasCompetitivas.map((ventaja, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
                  <div>
                    <h4 className="text-lg font-semibold text-white">{ventaja.aspecto}</h4>
                  </div>

                  <div className="text-center">
                    <p className="text-red-400 font-medium">❌ Tradicional</p>
                    <p className="text-gray-300 text-sm">{ventaja.tradicional}</p>
                  </div>

                  <div className="text-center">
                    <p className="text-green-400 font-medium">✅ Modelo DEA</p>
                    <p className="text-white font-semibold">{ventaja.dea}</p>
                  </div>

                  <div className="text-center">
                    <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-xl p-3">
                      <p className="text-blue-400 font-bold">{ventaja.mejora}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Arquitectura Tecnológica */}
      <div className="px-4 lg:px-8 py-16 bg-gradient-to-r from-slate-900/50 to-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Arquitectura Tecnológica DEA
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Stack tecnológico empresarial que soporta automatización 24/7 con disponibilidad 99.9%.
            </p>
          </div>

          <div className="space-y-6">
            {arquitecturaTecnologica.map((capa, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-4">{capa.capa}</h3>
                    <p className="text-gray-300 mb-6">{capa.descripcion}</p>
                    <div className="flex flex-wrap gap-2">
                      {capa.tecnologias.map((tech, idx) => (
                        <span
                          key={idx}
                          className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm border border-purple-400/30"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white/5 rounded-2xl p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <Cpu className="w-8 h-8 text-purple-400" />
                      <span className="text-white font-semibold">Nivel Empresarial</span>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Disponibilidad:</span>
                        <span className="text-green-400 font-semibold">99.9%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Escalabilidad:</span>
                        <span className="text-blue-400 font-semibold">Ilimitada</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Seguridad:</span>
                        <span className="text-purple-400 font-semibold">Grado Empresarial</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Final */}
      <div className="px-4 lg:px-8 py-16 bg-gradient-to-t from-slate-900 to-slate-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
            El Futuro de la Distribución Inteligente
          </h2>
          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            Mientras otros siguen trabajando manualmente 40+ horas semanales, los constructores DEA
            <span className="text-green-400"> construyen activos escalables en 5-10 horas</span> con tecnología superior.
          </p>

          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-center">
              <div className="space-y-4">
                <h4 className="text-xl font-bold text-red-400">❌ Sin Modelo DEA</h4>
                <ul className="space-y-2 text-gray-300">
                  <li>• 100% trabajo manual repetitivo</li>
                  <li>• 25-40 horas semanales invertidas</li>
                  <li>• Crecimiento lineal limitado</li>
                  <li>• Herramientas fragmentadas costosas</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h4 className="text-xl font-bold text-green-400">✅ Con Modelo DEA</h4>
                <ul className="space-y-2 text-white">
                  <li>• 80% automatización inteligente</li>
                  <li>• 5-10 horas decisiones estratégicas</li>
                  <li>• Escalabilidad exponencial 24/7</li>
                  <li>• Ecosistema integrado incluido</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-blue-500 to-green-600 hover:from-blue-600 hover:to-green-700 px-10 py-5 rounded-xl font-bold text-lg transition-all duration-300 flex items-center gap-2 justify-center shadow-2xl">
              <Bot className="w-6 h-6" />
              Activar Modelo DEA Completo
              <ArrowRight className="w-6 h-6" />
            </button>
            <button className="bg-white/10 hover:bg-white/20 backdrop-blur-xl px-10 py-5 rounded-xl font-semibold text-lg transition-all duration-300 border border-white/20 flex items-center gap-2 justify-center">
              <span>Consulta Arquitecto Luis</span>
              <span className="text-green-400">+57 310 206 6593</span>
            </button>
          </div>

          <p className="text-sm text-gray-500 mt-6">
            * Modelo DEA disponible exclusivamente en ecosistema CreaTuActivo.com
          </p>
        </div>
      </div>
    </div>
  )
}
