'use client'

import { useState } from 'react'
import {
  Lightbulb,
  MessageSquare,
  UserPlus,
  ArrowRight,
  CheckCircle2,
  Zap,
  Play,
  Target,
  Users,
  TrendingUp,
  Clock,
  Star,
  Crown,
  BarChart3
} from 'lucide-react'

export default function MetodoIAAPage() {
  const [activeStep, setActiveStep] = useState(0)

  const frameworkSteps = [
    {
      id: 'iniciar',
      title: 'INICIAR',
      subtitle: 'Despertar Interés Estratégico',
      icon: <Lightbulb className="w-8 h-8" />,
      gradient: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-500/20',
      textColor: 'text-blue-300',
      description: 'Conectar personas con el ecosistema superior usando estrategias inteligentes.',
      detail: 'No es "prospección" tradicional. Es despertar curiosidad sobre construcción de activos empresariales usando tecnología que otros no tienen.',
      tools: [
        'Sistema personalización automática mensajes',
        'Generador contenido inteligente IA',
        'Dashboard analytics tiempo real',
        'Presentaciones nivel C-Suite'
      ],
      results: [
        '3-5 conexiones estratégicas semanales',
        'Conversaciones de calidad vs cantidad',
        'Posicionamiento consultor experto',
        'Diferenciación inmediata vs competencia'
      ]
    },
    {
      id: 'acoger',
      title: 'ACOGER',
      subtitle: 'Consultoría Estratégica Personalizada',
      icon: <MessageSquare className="w-8 h-8" />,
      gradient: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-500/20',
      textColor: 'text-purple-300',
      description: 'Intervenir en el momento óptimo con consultoría empresarial de valor.',
      detail: 'El sistema identifica cuando el prospecto está listo. Tu rol: entregar consultoría estratégica personalizada que demuestre superioridad del modelo.',
      tools: [
        'Alertas momento óptimo intervención',
        'Scripts consultoría personalizados',
        'Resolución objeciones automatizada',
        'Presentación productos sin fricción'
      ],
      results: [
        '40-60% tasa conversión interés',
        'Consultas de alta calidad',
        'Posicionamiento asesor confiable',
        'Proceso educativo sin presión'
      ]
    },
    {
      id: 'activar',
      title: 'ACTIVAR',
      subtitle: 'Entrega Sistema Completo',
      icon: <UserPlus className="w-8 h-8" />,
      gradient: 'from-green-500 to-green-600',
      bgColor: 'bg-green-500/20',
      textColor: 'text-green-300',
      description: 'Entregar ecosistema personalizado y enseñar primer paso arquitectónico.',
      detail: 'No "vendes productos". Entregas un sistema empresarial completo personalizado con su información y les enseñas cómo dar el primer paso estratégico.',
      tools: [
        'Portal personalizado constructor',
        'Herramientas con datos precargados',
        'Capacitación Framework IAA',
        'Acompañamiento primeros pasos'
      ],
      results: [
        'Nuevos constructores activos',
        'Canal distribución expandido',
        'Multiplicación exponencial',
        'Activos empresariales creciendo'
      ]
    }
  ]

  const diferenciadoresCompetencia = [
    {
      tradicional: 'Prospección masiva',
      iaa: 'INICIAR estratégico',
      ventaja: '5x más efectivo'
    },
    {
      tradicional: 'Seguimiento insistente',
      iaa: 'ACOGER momento óptimo',
      ventaja: 'Sin presión, más conversiones'
    },
    {
      tradicional: 'Venta transaccional',
      iaa: 'ACTIVAR sistema completo',
      ventaja: 'Construcción activos vs venta'
    },
    {
      tradicional: 'Herramientas básicas',
      iaa: 'Ecosistema tecnológico',
      ventaja: 'Automatización 80% trabajo'
    }
  ]

  const casosExito = [
    {
      perfil: 'Profesional TI',
      tiempo: '6 semanas',
      resultado: 'Canal 12 constructores activos',
      clave: 'INICIAR en comunidades tech + Ecosistema NodeX'
    },
    {
      perfil: 'Empresaria Retail',
      tiempo: '8 semanas',
      resultado: 'Activo $2,500 USD/mes',
      clave: 'ACOGER clientas existentes + Framework IAA'
    },
    {
      perfil: 'Ejecutivo Banca',
      tiempo: '4 semanas',
      resultado: 'Red 20+ contactos C-Suite',
      clave: 'ACTIVAR nivel ejecutivo + Presentaciones premium'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Hero Section */}
      <div className="relative px-4 lg:px-8 pt-16 pb-24">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-green-500/10 opacity-50"></div>

        <div className="relative max-w-7xl mx-auto text-center">
          {/* Badge exclusivo */}
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500/20 to-red-500/20 backdrop-blur-xl rounded-full px-6 py-2 border border-orange-400/30 mb-8">
            <Crown className="w-5 h-5 text-orange-300" />
            <span className="text-orange-300 font-semibold">Framework Exclusivo CreaTuActivo.com</span>
          </div>

          {/* Título principal */}
          <h1 className="text-5xl lg:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-green-400 bg-clip-text text-transparent">
              Framework IAA
            </span>
            <br />
            <span className="text-white">La Metodología Que Cambia Todo</span>
          </h1>

          {/* Subtítulo */}
          <p className="text-xl lg:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
            Olvida la "prospección" tradicional. <span className="text-blue-400">INICIAR, ACOGER, ACTIVAR</span> es
            la única metodología que convierte tu influencia en un activo empresarial real y escalable.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center gap-2 justify-center">
              <Play className="w-5 h-5" />
              Ver Framework en Acción
              <ArrowRight className="w-5 h-5" />
            </button>
            <button className="bg-white/10 hover:bg-white/20 backdrop-blur-xl px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 border border-white/20 flex items-center gap-2 justify-center">
              <Zap className="w-5 h-5" />
              Acceder Ecosistema Completo
            </button>
          </div>
        </div>
      </div>

      {/* Framework Steps Interactive */}
      <div className="px-4 lg:px-8 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
              Los 3 Pilares del Framework IAA
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Cada pilar tiene herramientas específicas que automatizan el trabajo pesado. Tu rol: decisiones estratégicas.
            </p>
          </div>

          {/* Step Navigation */}
          <div className="flex justify-center mb-12">
            <div className="flex bg-white/10 backdrop-blur-xl rounded-2xl p-2 border border-white/20">
              {frameworkSteps.map((step, index) => (
                <button
                  key={step.id}
                  onClick={() => setActiveStep(index)}
                  className={`
                    flex items-center gap-3 px-6 py-3 rounded-xl font-medium transition-all duration-300
                    ${activeStep === index
                      ? `bg-gradient-to-r ${step.gradient} text-white shadow-lg`
                      : 'text-gray-400 hover:text-white hover:bg-white/10'
                    }
                  `}
                >
                  {step.icon}
                  <span className="hidden sm:block">{step.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Active Step Content */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 lg:p-12 border border-white/20">
            {frameworkSteps.map((step, index) => (
              <div
                key={step.id}
                className={`${activeStep === index ? 'block' : 'hidden'}`}
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                  {/* Content Left */}
                  <div>
                    <div className="flex items-center gap-4 mb-6">
                      <div className={`p-4 rounded-xl ${step.bgColor} ${step.textColor}`}>
                        {step.icon}
                      </div>
                      <div>
                        <h3 className="text-3xl font-bold text-white">{step.title}</h3>
                        <p className="text-gray-400">{step.subtitle}</p>
                      </div>
                    </div>

                    <p className="text-xl text-gray-300 mb-6 leading-relaxed">
                      {step.description}
                    </p>

                    <p className="text-gray-400 mb-8 leading-relaxed">
                      {step.detail}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="bg-white/5 rounded-2xl p-6">
                        <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                          <Zap className="w-5 h-5 text-yellow-400" />
                          Herramientas Automáticas
                        </h4>
                        <ul className="space-y-2">
                          {step.tools.map((tool, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-gray-300">
                              <CheckCircle2 className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                              <span className="text-sm">{tool}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-white/5 rounded-2xl p-6">
                        <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                          <BarChart3 className="w-5 h-5 text-purple-400" />
                          Resultados Esperados
                        </h4>
                        <ul className="space-y-2">
                          {step.results.map((result, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-gray-300">
                              <TrendingUp className="w-4 h-4 text-blue-400 mt-1 flex-shrink-0" />
                              <span className="text-sm">{result}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Visual Right */}
                  <div className="bg-white/5 rounded-2xl p-8">
                    <div className="text-center mb-8">
                      <div className={`inline-flex p-6 rounded-2xl ${step.bgColor} mb-4`}>
                        <div className={`w-16 h-16 ${step.textColor} flex items-center justify-center`}>
                          {step.icon}
                        </div>
                      </div>
                      <h4 className="text-2xl font-bold text-white mb-2">{step.title}</h4>
                      <p className="text-gray-400">{step.subtitle}</p>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-white/10 rounded-xl p-4">
                        <div className="flex items-center gap-3 mb-2">
                          <Clock className="w-5 h-5 text-blue-400" />
                          <span className="text-white font-medium">Tu Tiempo Invertido</span>
                        </div>
                        <p className="text-gray-300 text-sm">20% decisiones estratégicas</p>
                      </div>

                      <div className="bg-white/10 rounded-xl p-4">
                        <div className="flex items-center gap-3 mb-2">
                          <Zap className="w-5 h-5 text-yellow-400" />
                          <span className="text-white font-medium">Automatización</span>
                        </div>
                        <p className="text-gray-300 text-sm">80% trabajo pesado automatizado</p>
                      </div>

                      <div className="bg-white/10 rounded-xl p-4">
                        <div className="flex items-center gap-3 mb-2">
                          <Target className="w-5 h-5 text-green-400" />
                          <span className="text-white font-medium">Enfoque</span>
                        </div>
                        <p className="text-gray-300 text-sm">Construcción activos vs transacciones</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Diferenciación vs Competencia */}
      <div className="px-4 lg:px-8 py-16 bg-gradient-to-r from-slate-900/50 to-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
              Framework IAA vs Métodos Tradicionales
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Por qué el 90% de la industria sigue usando métodos obsoletos mientras nosotros construimos activos reales.
            </p>
          </div>

          <div className="space-y-6">
            {diferenciadoresCompetencia.map((diff, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                  <div className="text-center">
                    <h4 className="text-red-400 font-semibold mb-2">❌ Método Tradicional</h4>
                    <p className="text-gray-300">{diff.tradicional}</p>
                  </div>

                  <div className="text-center">
                    <ArrowRight className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                    <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl p-3">
                      <p className="text-green-400 font-semibold">{diff.ventaja}</p>
                    </div>
                  </div>

                  <div className="text-center">
                    <h4 className="text-green-400 font-semibold mb-2">✅ Framework IAA</h4>
                    <p className="text-white font-medium">{diff.iaa}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Casos de Éxito */}
      <div className="px-4 lg:px-8 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
              Casos de Éxito Framework IAA
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Constructores reales aplicando Framework IAA con Luis Cabrejo - 9 años consecutivos Diamante.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {casosExito.map((caso, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{caso.perfil}</h3>
                  <p className="text-gray-400">{caso.tiempo}</p>
                </div>

                <div className="bg-white/10 rounded-xl p-6 mb-6">
                  <h4 className="text-lg font-semibold text-green-400 mb-2">Resultado:</h4>
                  <p className="text-white font-medium">{caso.resultado}</p>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-purple-400">Clave del Éxito:</h4>
                  <p className="text-gray-300 text-sm">{caso.clave}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Final */}
      <div className="px-4 lg:px-8 py-16 bg-gradient-to-t from-slate-900 to-slate-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            ¿Listo Para Dominar Framework IAA?
          </h2>
          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            No es teoría. Es la metodología probada que Luis Cabrejo usa para mantener
            <span className="text-green-400"> 9 años consecutivos como Diamante</span> construyendo activos reales.
          </p>

          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-blue-400 mb-2">100%</div>
                <div className="text-gray-400">Exclusivo CreaTuActivo.com</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-400 mb-2">80%</div>
                <div className="text-gray-400">Trabajo Automatizado</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-400 mb-2">9</div>
                <div className="text-gray-400">Años Diamante Consecutivos</div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-10 py-5 rounded-xl font-bold text-lg transition-all duration-300 flex items-center gap-2 justify-center shadow-2xl">
              <Zap className="w-6 h-6" />
              Acceder Ecosistema Framework IAA
              <ArrowRight className="w-6 h-6" />
            </button>
            <button className="bg-white/10 hover:bg-white/20 backdrop-blur-xl px-10 py-5 rounded-xl font-semibold text-lg transition-all duration-300 border border-white/20 flex items-center gap-2 justify-center">
              <span>Consulta Directa Luis</span>
              <span className="text-green-400">+57 310 206 6593</span>
            </button>
          </div>

          <p className="text-sm text-gray-500 mt-6">
            * Framework IAA disponible exclusivamente para constructores CreaTuActivo.com
          </p>
        </div>
      </div>
    </div>
  )
}
