'use client'

import { useState, useEffect } from 'react'
import { ArrowRight, CheckCircle, Clock, PlayCircle, Rocket, Shield, Users, Zap } from 'lucide-react'
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

    .creatuactivo-cta-ecosystem {
      background: linear-gradient(135deg, var(--creatuactivo-blue) 0%, var(--creatuactivo-purple) 100%);
      border: none;
      border-radius: 16px;
      padding: 18px 36px;
      font-weight: 700;
      color: white;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow:
        0 6px 20px rgba(30, 64, 175, 0.4),
        0 3px 10px rgba(124, 58, 237, 0.3),
        0 1px 5px rgba(245, 158, 11, 0.2);
      position: relative;
      overflow: hidden;
    }

    .creatuactivo-cta-ecosystem:hover {
      transform: translateY(-3px);
      box-shadow:
        0 12px 35px rgba(30, 64, 175, 0.5),
        0 6px 15px rgba(124, 58, 237, 0.4),
        0 2px 8px rgba(245, 158, 11, 0.3);
    }

    .creatuactivo-cta-ecosystem::after {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg,
        transparent,
        rgba(255, 255, 255, 0.4),
        transparent);
      animation: ecosystem-shimmer 3s infinite;
    }

    @keyframes ecosystem-shimmer {
      0% {
        transform: translateX(-100%);
      }
      100% {
        transform: translateX(200%);
      }
    }

    .creatuactivo-trust-ecosystem {
      background: rgba(5, 150, 105, 0.1);
      border: 1px solid rgba(5, 150, 105, 0.3);
      border-radius: 16px;
      padding: 20px;
    }

    .creatuactivo-progress-ecosystem {
      background: rgba(30, 64, 175, 0.1);
      border: 1px solid rgba(30, 64, 175, 0.3);
      border-radius: 12px;
      padding: 20px;
    }

    .ecosystem-progress-bar {
      background: rgba(255, 255, 255, 0.2);
      border-radius: 8px;
      height: 8px;
      overflow: hidden;
      margin: 12px 0;
    }

    .ecosystem-progress-fill {
      background: linear-gradient(135deg, var(--creatuactivo-blue) 0%, var(--creatuactivo-purple) 50%, var(--creatuactivo-gold) 100%);
      height: 100%;
      transition: width 2s ease;
      position: relative;
    }

    .ecosystem-progress-fill::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg,
        transparent,
        rgba(255, 255, 255, 0.3),
        transparent);
      animation: progress-shine 2s infinite;
    }

    @keyframes progress-shine {
      0% {
        transform: translateX(-100%);
      }
      100% {
        transform: translateX(100%);
      }
    }
  `}</style>
);

// --- Componente Reutilizable para Tarjetas de Beneficios ---
const BenefitCard = ({ icon, title, description, colorScheme }: {
  icon: React.ReactNode;
  title: string;
  description: string;
  colorScheme: string;
}) => {
  const iconColors: Record<string, string> = {
    blue: 'text-blue-400',
    purple: 'text-purple-400',
    green: 'text-green-400',
    orange: 'text-orange-400'
  };

  return (
    <div className="creatuactivo-ecosystem-card p-8 h-full">
      <div className="mb-6">
        <div className={`inline-block ${iconColors[colorScheme] || iconColors.blue}`}>
          {icon}
        </div>
      </div>
      <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
      <p className="text-slate-400 leading-relaxed">{description}</p>
    </div>
  );
};

// --- Componente Principal de la Página de Fundadores ---
export default function FundadoresPage() {
  const [spotsLeft, setSpotsLeft] = useState(() => {
    const now = new Date();
    const startDate = new Date('2025-09-22T10:00:00'); // Lunes 22 septiembre 10am
    const currentHour = now.getHours();

    let spotsLeft = 150;

    // Si es el día de inicio (lunes 22) y después de las 10am
    if (now.toDateString() === startDate.toDateString() && currentHour >= 10) {
      const hoursPassedToday = currentHour - 10;
      spotsLeft = 150 - hoursPassedToday;
    }
    // Si han pasado días completos desde el lunes 22
    else if (now > startDate) {
      const daysPassed = Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      const hoursPassedToday = currentHour >= 10 ? currentHour - 10 : 0;
      spotsLeft = 150 - (daysPassed * 12) - hoursPassedToday;
    }

    return Math.max(spotsLeft, 0); // No menor a 0
  });

  const [formStep, setFormStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    arquetipo: '',
    inversion: ''
  });

  useEffect(() => {
    // Actualizar contador cada hora
    const interval = setInterval(() => {
      const now = new Date();
      const startDate = new Date('2025-09-22T10:00:00'); // Lunes 22 septiembre
      const currentHour = now.getHours();

      let spotsLeft = 150;

      if (now.toDateString() === startDate.toDateString() && currentHour >= 10) {
        const hoursPassedToday = currentHour - 10;
        spotsLeft = 150 - hoursPassedToday;
      }
      else if (now > startDate) {
        const daysPassed = Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
        const hoursPassedToday = currentHour >= 10 ? currentHour - 10 : 0;
        spotsLeft = 150 - (daysPassed * 12) - hoursPassedToday;
      }

      setSpotsLeft(Math.max(spotsLeft, 0));
    }, 3600000); // Cada hora

    return () => clearInterval(interval);
  }, []);

  // ✅ NUEVA FUNCIONALIDAD RESEND AGREGADA
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formStep < 3) {
      setFormStep(formStep + 1);
    } else {
      setIsSubmitting(true);

      try {
        const response = await fetch('/api/fundadores', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...formData,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            referrer: document.referrer,
            page: 'fundadores'
          })
        });

        const result = await response.json();

        if (response.ok && result.success) {
          // Éxito - mostrar mensaje personalizado
          alert(`¡Excelente ${formData.nombre}! Tu solicitud fue enviada exitosamente. Nuestro equipo revisará tu perfil y, si se alinea con la visión, recibirás una invitación en las próximas 24 horas.`);

          // Opcional: Analytics o redirección
          console.log('✅ Solicitud enviada:', result.emailId);

        } else {
          throw new Error(result.error || 'Error en el procesamiento de la solicitud');
        }

      } catch (error) {
        console.error('❌ Error enviando solicitud:', error);

        // Mensaje de error amigable con alternativa
        alert(`Hubo un error al enviar tu solicitud, ${formData.nombre}. Por favor intenta de nuevo en unos minutos, o contáctanos directamente por WhatsApp al +57 310 206 6593.`);

      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const scrollToForm = () => {
    // Verificación de null para getElementById
    const element = document.getElementById('formulario-fundador');
    if (element) {
      element.scrollIntoView({behavior: 'smooth'});
    }
  };

  return (
    <>
      <GlobalStyles />
      <div className="bg-slate-900 text-white">
        {/* Navegación Centralizada */}
        <StrategicNavigation />

        {/* --- Fondo Decorativo Oficial --- */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute -top-64 -left-64 w-96 h-96 bg-[var(--creatuactivo-purple)] opacity-20 rounded-full filter blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-64 -right-64 w-96 h-96 bg-[var(--creatuactivo-blue)] opacity-20 rounded-full filter blur-3xl animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-[var(--creatuactivo-gold)] opacity-10 rounded-full filter blur-3xl animate-pulse transform -translate-x-1/2 -translate-y-1/2"></div>
        </div>

        <main className="relative z-10 p-4 lg:p-8">
          {/* --- SECCIÓN 1: HERO - Validación y Visión --- */}
          <section className="text-center max-w-4xl mx-auto py-20 lg:py-32 pt-20">
            <div className="inline-block bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-purple-300 font-semibold text-sm uppercase tracking-wider px-4 py-2 rounded-full mb-6 border border-purple-500/30">
              Una invitación para Pioneros
            </div>
            <h1 className="creatuactivo-h1-ecosystem text-4xl md:text-6xl lg:text-7xl mb-6 leading-tight">
              Bienvenido a la Arquitectura del Futuro.
            </h1>
            <p className="text-lg lg:text-xl text-slate-300 max-w-3xl mx-auto mb-10">
              Estás a un paso de ser Fundador del primer ecosistema tecnológico que automatiza el 80% del trabajo para que puedas construir un activo digital real, no solo un ingreso.
            </p>
            <div className="flex flex-col md:flex-row justify-center items-center gap-4">
              <button
                onClick={scrollToForm}
                className="creatuactivo-cta-ecosystem w-full md:w-auto text-lg flex items-center justify-center"
              >
                Reservar mi Cupo de Fundador <ArrowRight size={20} className="ml-2" />
              </button>
              <a
                href="/presentacion-empresarial"
                className="w-full md:w-auto bg-white/10 backdrop-blur-lg text-slate-300 font-semibold py-4 px-8 rounded-lg hover:bg-white/20 transition-colors duration-300 inline-block text-center"
              >
                Ver Presentación Empresarial
              </a>
            </div>
          </section>

          {/* --- SECCIÓN 2: VIDEO PLACEHOLDER - La "Nueva Categoría" en 60 Segundos --- */}
          <section className="max-w-5xl mx-auto mb-20 lg:mb-32">
              <div className="relative aspect-video bg-slate-800/50 rounded-2xl border border-white/10 shadow-2xl shadow-purple-500/10 overflow-hidden group">
                  <img
                      src="https://placehold.co/1280x720/0f172a/94a3b8?text=La+Nueva+Categor%C3%ADa"
                      alt="Placeholder del video explicativo"
                      className="w-full h-full object-cover opacity-30 group-hover:opacity-40 transition-opacity"
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                      <PlayCircle size={80} className="text-white/50 group-hover:text-white/80 group-hover:scale-110 transition-all duration-300 mb-4" />
                      <h2 className="creatuactivo-h2-component text-2xl lg:text-4xl font-bold mb-2">Esto es diferente.</h2>
                      <p className="text-slate-300 max-w-xl">Presiona play y descubre en 60 segundos por qué este ecosistema está redefiniendo las reglas del juego en América.</p>
                  </div>
              </div>
          </section>

          {/* --- SECCIÓN 3: URGENCIA Y TIMELINE MEJORADO --- */}
          <section className="max-w-5xl mx-auto mb-20 lg:mb-32">
              <div className="grid md:grid-cols-2 gap-8 items-center mb-12">
                  <div className="creatuactivo-trust-ecosystem text-center">
                      <p className="text-sm text-slate-400 uppercase tracking-wider mb-2">Cupos de Fundador Disponibles</p>
                      <p className="text-6xl font-bold text-green-400 animate-pulse">{spotsLeft}</p>
                      <p className="text-slate-400">de 150</p>
                  </div>
                  <div>
                      <h3 className="creatuactivo-h2-component text-2xl font-bold mb-4">La Ventana de Oportunidad es Real</h3>
                      <p className="text-slate-300 mb-6">Estamos en la fase exclusiva para Fundadores. Una vez que se abran las puertas al público, la oportunidad de tener una ventaja posicional como esta no volverá a existir.</p>

                      {/* Timeline Premium - Sutil y Elegante (ORIGINAL) */}
                      <div className="space-y-2 mb-6 text-sm">
                        <div className="flex items-center justify-between text-slate-400">
                          <span>22 Sept: Lista Privada</span>
                          <span className="text-slate-500">20 Constructores</span>
                        </div>
                        <div className="flex items-center justify-between text-slate-400">
                          <span>29 Sept: Pre-Lanzamiento</span>
                          <span className="text-slate-500">150 Constructores</span>
                        </div>
                        <div className="flex items-center justify-between text-slate-400">
                          <span>01 Dic: Lanzamiento Público</span>
                          <span className="text-slate-500">3,000 Constructores</span>
                        </div>
                        <div className="flex items-center justify-between text-slate-400">
                          <span>05 Ene 2026: Arquitectos Consolidados</span>
                          <span className="text-slate-500">Elite</span>
                        </div>
                      </div>

                      <div className="creatuactivo-progress-ecosystem">
                        <div className="ecosystem-progress-bar">
                          <div className="ecosystem-progress-fill" style={{width: `${(spotsLeft/150)*100}%`}}></div>
                        </div>
                        <div className="flex justify-between text-xs mt-2 text-slate-400">
                            <span>Fase Fundadores (Activa)</span>
                            <span>Pre-Lanzamiento</span>
                            <span>Lanzamiento Público</span>
                        </div>
                      </div>
                  </div>
              </div>

              {/* ✅ ROADMAP ESTRATÉGICO COOL (AGREGADO) - CON CORRECCIÓN DIAMANTES */}
              <div className="creatuactivo-progress-ecosystem mt-12">
                  <h4 className="text-white font-bold mb-6 text-center">🗓️ Roadmap Estratégico 2025-2026</h4>

                  {/* Hitos del Timeline */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div className="bg-blue-500/20 border border-blue-400/30 rounded-lg p-4">
                          <div className="flex items-center mb-2">
                              <div className="w-3 h-3 bg-blue-400 rounded-full mr-2"></div>
                              <span className="font-bold text-blue-400">22 Sep - ACTIVA</span>
                          </div>
                          <p className="text-slate-300">Lista Privada</p>
                          <p className="text-xs text-slate-400 mt-1">Feedback + Primeros 20 Constructores</p>
                      </div>

                      <div className="bg-purple-500/20 border border-purple-400/30 rounded-lg p-4">
                          <div className="flex items-center mb-2">
                              <div className="w-3 h-3 bg-purple-400 rounded-full mr-2"></div>
                              <span className="font-bold text-purple-400">29 Sep</span>
                          </div>
                          <p className="text-slate-300">Pre-Lanzamiento</p>
                          <p className="text-xs text-slate-400 mt-1">Base: 150 Constructores</p>
                      </div>

                      <div className="bg-orange-500/20 border border-orange-400/30 rounded-lg p-4">
                          <div className="flex items-center mb-2">
                              <div className="w-3 h-3 bg-orange-400 rounded-full mr-2"></div>
                              <span className="font-bold text-orange-400">1 Dic</span>
                          </div>
                          <p className="text-slate-300">Lanzamiento</p>
                          <p className="text-xs text-slate-400 mt-1">Objetivo: 3,000 Constructores</p>
                      </div>

                      <div className="bg-yellow-500/20 border border-yellow-400/30 rounded-lg p-4">
                          <div className="flex items-center mb-2">
                              <div className="w-3 h-3 bg-yellow-400 rounded-full mr-2"></div>
                              <span className="font-bold text-yellow-400">5 Ene 2026</span>
                          </div>
                          <p className="text-slate-300">Arquitectos Consolidados</p>
                          <p className="text-xs text-slate-400 mt-1">Élite de Constructores</p>
                      </div>
                  </div>

                  {/* Fase Actual Destacada */}
                  <div className="mt-6 text-center bg-green-500/10 border border-green-400/30 rounded-lg p-4">
                      <p className="text-green-400 font-bold">📍 FASE ACTUAL: Lista Privada Activa</p>
                      <p className="text-slate-300 text-sm mt-1">Tu oportunidad de estar en el grupo fundacional antes que nadie</p>
                  </div>
              </div>
          </section>

          {/* --- SECCIÓN 4: BENEFICIOS DEL PIONERO --- */}
          <section className="max-w-7xl mx-auto mb-20 lg:mb-32">
            <h2 className="creatuactivo-h2-component text-3xl lg:text-4xl font-bold text-center mb-12">El Valor de ser Pionero</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <BenefitCard
                icon={<Rocket size={32}/>}
                title="Posicionamiento Estratégico"
                description="Tu activo se construye en la cima de la arquitectura. Todo el crecimiento futuro se apalanca desde tu base."
                colorScheme="blue"
              />
              <BenefitCard
                icon={<Zap size={32}/>}
                title="Acceso Tecnológico Total"
                description="Desbloquea el 100% del arsenal de NodeX desde el día cero. Una ventaja competitiva que nadie más tendrá."
                colorScheme="purple"
              />
              <BenefitCard
                icon={<Shield size={32}/>}
                title="Ventaja Económica Fundacional"
                description="Accede a un modelo de valor diseñado para recompensar de forma superior y vitalicia a quienes construyeron primero."
                colorScheme="green"
              />
               <BenefitCard
                icon={<Users size={32}/>}
                title="Co-Creación del Futuro"
                description="Tu feedback no solo será escuchado, moldeará la evolución del ecosistema. Serás un arquitecto, no un usuario."
                colorScheme="orange"
              />
            </div>
          </section>

          {/* --- SECCIÓN 5: PRUEBA DE CONFIANZA --- */}
          <section className="max-w-5xl mx-auto text-center mb-20 lg:mb-32">
               <h2 className="creatuactivo-h2-component text-3xl lg:text-4xl font-bold mb-4">Construido por Arquitectos, <br/> sobre una Base Sólida.</h2>
               <p className="text-slate-300 max-w-3xl mx-auto mb-12">Esta innovación no nace en el vacío. Es el resultado de 9 años de éxito probado, ahora potenciado por un socio corporativo con 30+ años de trayectoria global y una patente mundial que garantiza su unicidad.</p>
               <div className="flex justify-center gap-8">
                  <div className="creatuactivo-trust-ecosystem p-6 rounded-lg text-center">
                      <p className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">9 Años</p>
                      <p className="text-slate-400">de Liderazgo Probado</p>
                  </div>
                   <div className="creatuactivo-trust-ecosystem p-6 rounded-lg text-center">
                      <p className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">30+ Años</p>
                      <p className="text-slate-400">de Respaldo Corporativo</p>
                  </div>
               </div>
          </section>

          {/* --- SECCIÓN 6: FORMULARIO ORIGINAL MANTENIDO --- */}
          <section id="formulario-fundador" className="max-w-4xl mx-auto mb-20 lg:mb-32">
            <div className="text-center mb-12">
              <h2 className="creatuactivo-h2-component text-3xl lg:text-4xl font-bold mb-6">
                Solicita tu Consultoría
                <br />
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  de Fundador
                </span>
              </h2>
              <p className="text-slate-300 max-w-2xl mx-auto">
                Proceso de aplicación de 3 pasos. Nuestro equipo revisará tu perfil y, si se alinea con la visión, te contactaremos para agendar tu sesión estratégica exclusiva.
              </p>
            </div>

            {/* Progress Indicator */}
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6 max-w-2xl mx-auto">
                {[1, 2, 3].map((step) => (
                  <div key={step} className={`flex items-center ${step !== 3 ? 'flex-1' : ''}`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2 ${
                      formStep >= step
                        ? 'bg-gradient-to-r from-[var(--creatuactivo-blue)] to-[var(--creatuactivo-purple)] text-white border-[var(--creatuactivo-blue)]'
                        : 'bg-slate-800 text-slate-400 border-slate-600'
                    }`}>
                      {formStep > step ? <CheckCircle size={16} /> : step}
                    </div>
                    {step !== 3 && (
                      <div className={`flex-1 h-1 mx-4 ${
                        formStep > step ? 'bg-gradient-to-r from-[var(--creatuactivo-blue)] to-[var(--creatuactivo-purple)]' : 'bg-slate-700'
                      }`}></div>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-sm text-slate-400 max-w-2xl mx-auto">
                <span>Información Base</span>
                <span>Tu Perfil</span>
                <span>Confirmación</span>
              </div>
            </div>

            {/* Formulario Container */}
            <div className="creatuactivo-ecosystem-card p-8 max-w-2xl mx-auto">

              {/* Paso 1: Información Base */}
              {formStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-white font-medium mb-2">Nombre Completo</label>
                    <input
                      type="text"
                      value={formData.nombre}
                      onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-[var(--creatuactivo-blue)] focus:outline-none transition-colors"
                      placeholder="Tu nombre completo"
                    />
                  </div>
                  <div>
                    <label className="block text-white font-medium mb-2">Email Profesional</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-[var(--creatuactivo-blue)] focus:outline-none transition-colors"
                      placeholder="tu@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-white font-medium mb-2">WhatsApp</label>
                    <input
                      type="tel"
                      value={formData.telefono}
                      onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-[var(--creatuactivo-blue)] focus:outline-none transition-colors"
                      placeholder="+57 300 123 4567"
                    />
                  </div>
                </div>
              )}

              {/* Paso 2: Perfil del Constructor */}
              {formStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-white font-medium mb-4">¿Cuál describe mejor tu situación actual?</label>
                    <div className="space-y-3">
                      {[
                        'Profesional establecido buscando diversificación inteligente',
                        'Emprendedor digital necesitando un ecosistema integrado',
                        'Visionario con recursos limitados pero gran ambición',
                        'Madre/Padre constructor buscando flexibilidad y comunidad',
                        'Estudiante ambicioso construyendo su futuro anticipadamente'
                      ].map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => setFormData({...formData, arquetipo: option})}
                          className={`w-full text-left p-4 rounded-lg border transition-all duration-300 ${
                            formData.arquetipo === option
                              ? 'bg-[var(--creatuactivo-blue)]/20 border-[var(--creatuactivo-blue)] text-white'
                              : 'bg-slate-700/30 border-slate-600 text-slate-300 hover:border-[var(--creatuactivo-blue)]/50 hover:bg-slate-700/50'
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-white font-medium mb-4">Nivel de inversión que consideras para tu posición de fundador</label>
                    <div className="space-y-3">
                      {[
                        'Constructor Inicial - $900,000 COP (~$200 USD) (validación del ecosistema)',
                        'Constructor Estratégico - $2,250,000 COP (~$500 USD) (posición equilibrada)',
                        'Constructor Visionario - $4,500,000 COP (~$1,000 USD) (máximo potencial)',
                        'Prefiero que Luis o Liliana me asesore sobre la mejor opción'
                      ].map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => setFormData({...formData, inversion: option})}
                          className={`w-full text-left p-4 rounded-lg border transition-all duration-300 ${
                            formData.inversion === option
                              ? 'bg-[var(--creatuactivo-purple)]/20 border-[var(--creatuactivo-purple)] text-white'
                              : 'bg-slate-700/30 border-slate-600 text-slate-300 hover:border-[var(--creatuactivo-purple)]/50 hover:bg-slate-700/50'
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Paso 3: Confirmación (ORIGINAL MANTENIDO) */}
              {formStep === 3 && (
                <div className="text-center space-y-6">
                  <div className="text-6xl mb-4">🚀</div>
                  <h3 className="text-2xl font-bold text-white mb-4">¡Solicitud Recibida!</h3>
                  <div className="bg-slate-700/50 rounded-lg p-6 space-y-3 text-left">
                    <div><strong className="text-blue-400">Constructor:</strong> <span className="text-white">{formData.nombre}</span></div>
                    <div><strong className="text-blue-400">Email:</strong> <span className="text-white">{formData.email}</span></div>
                    <div><strong className="text-blue-400">Perfil:</strong> <span className="text-white">{formData.arquetipo?.split(' ')[0]} {formData.arquetipo?.split(' ')[1]}</span></div>
                    <div><strong className="text-blue-400">Inversión:</strong> <span className="text-white">{formData.inversion?.split(' -')[0]}</span></div>
                  </div>
                  <div className="creatuactivo-trust-ecosystem">
                    <h4 className="text-blue-400 font-bold mb-3">📋 Proceso de Evaluación</h4>
                    <div className="text-sm text-slate-300 space-y-2">
                      <div>✓ <strong>Revisión de perfil</strong> por nuestro equipo de Arquitectos</div>
                      <div>✓ <strong>Evaluación de alineación</strong> con la visión del ecosistema</div>
                      <div>✓ <strong>Si calificas:</strong> Invitación a consultoría estratégica exclusiva</div>
                      <div>✓ <strong>Activación inmediata</strong> de tu posición de fundador</div>
                    </div>
                    <div className="mt-4 text-center">
                      <p className="text-[var(--creatuactivo-gold)] font-medium">Nuestro equipo revisará tu perfil. Si tu visión se alinea con la de un Arquitecto Fundador, recibirás una invitación por WhatsApp o Email en las próximas 24 horas.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Botón de Acción - CON FUNCIONALIDAD RESEND AGREGADA */}
              <div className="mt-8">
                <button
                  onClick={handleFormSubmit}
                  disabled={
                    isSubmitting ||
                    (formStep === 1 && (!formData.nombre || !formData.email || !formData.telefono)) ||
                    (formStep === 2 && (!formData.arquetipo || !formData.inversion))
                  }
                  className="creatuactivo-cta-ecosystem w-full text-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Enviando solicitud...
                    </>
                  ) : (
                    <>
                      {formStep === 1 && (
                        <>Continuar al Perfil <ArrowRight size={20} className="ml-2" /></>
                      )}
                      {formStep === 2 && (
                        <>Enviar Solicitud <CheckCircle size={20} className="ml-2" /></>
                      )}
                      {formStep === 3 && (
                        <>Finalizar Proceso</>
                      )}
                    </>
                  )}
                </button>
              </div>
            </div>
          </section>

          {/* --- SECCIÓN 7: CTA FINAL --- */}
          <section className="max-w-4xl mx-auto text-center py-20">
              <h2 className="creatuactivo-h2-component text-3xl lg:text-4xl font-bold mb-6">Tu Momento es Ahora.</h2>
              <p className="text-slate-300 mb-10 max-w-2xl mx-auto">La historia la escriben quienes actúan en los momentos decisivos. Esta es tu invitación para ser uno de ellos.</p>
              <button
                onClick={scrollToForm}
                className="creatuactivo-cta-ecosystem text-lg"
              >
                Activar mi Posición de Fundador
              </button>
          </section>

          {/* --- FOOTER --- */}
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
