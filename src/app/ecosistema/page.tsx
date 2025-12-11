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

import React, { Suspense, useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Smartphone, Bot, Package, Check, Zap, Users, Target, ChevronDown, Instagram } from 'lucide-react'
import StrategicNavigation from '@/components/StrategicNavigation'

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

    .creatuactivo-component-card {
      background: linear-gradient(135deg, rgba(30, 64, 175, 0.1) 0%, rgba(124, 58, 237, 0.1) 100%);
      backdrop-filter: blur(24px);
      border: 1px solid rgba(124, 58, 237, 0.2);
      border-radius: 20px;
      transition: all 0.4s ease;
    }

    .creatuactivo-component-card:hover {
      transform: translateY(-4px);
      border-color: rgba(245, 158, 11, 0.4);
      box-shadow: 0 12px 35px rgba(30, 64, 175, 0.15);
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

// --- Componentes ---
const ComponentCard = ({ icon, title, description }: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => (
  <div className="text-center">
    <div className="mb-4 inline-block text-yellow-400">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
    <p className="text-slate-400 leading-relaxed">{description}</p>
  </div>
);

const StepCard = ({ number, icon, title, description }: {
  number: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}) => (
  <div className="text-center">
    <div className="bg-blue-500/20 text-blue-400 rounded-full w-16 h-16 flex items-center justify-center mb-4 border border-blue-400/30 mx-auto">
      {icon}
    </div>
    <span className="text-blue-400 font-bold text-sm">Paso {number}</span>
    <h3 className="text-xl font-bold text-white mt-2 mb-3">{title}</h3>
    <p className="text-slate-400 leading-relaxed">{description}</p>
  </div>
);

const TestimonialCard = ({ quote, name, role, imageSrc, instagramUrl }: {
  quote: string;
  name: string;
  role: string;
  imageSrc: string;
  instagramUrl: string;
}) => {
  const [imgError, setImgError] = React.useState(false);
  const [imgLoaded, setImgLoaded] = React.useState(false);

  const getInitials = (name: string) => {
    const names = name.split(' ');
    let initials = names.length > 1
      ? `${names[0][0]}${names[names.length - 1][0]}`
      : name.substring(0, 2);
    return initials.toUpperCase();
  };

  return (
    <div className="creatuactivo-component-card p-6 flex flex-col h-full">
      <div className="flex items-center mb-4">
        <div className="relative w-12 h-12 mr-3 flex-shrink-0">
          {imgError || !imgLoaded ? (
            <div className="w-full h-full rounded-full flex items-center justify-center bg-purple-500/30 text-purple-300 font-bold text-sm border-2 border-purple-500/50">
              {getInitials(name)}
            </div>
          ) : null}
          <img
            src={imageSrc}
            alt={name}
            className={`w-full h-full rounded-full object-cover border-2 border-purple-500/50 ${
              imgLoaded && !imgError ? 'block' : 'hidden'
            }`}
            onLoad={() => { setImgLoaded(true); setImgError(false); }}
            onError={() => { setImgError(true); setImgLoaded(false); }}
            crossOrigin="anonymous"
          />
        </div>
        <div>
          <p className="font-bold text-white">{name}</p>
          <p className="text-xs text-purple-400">{role}</p>
        </div>
      </div>
      <p className="text-slate-300 text-sm italic flex-grow mb-3">"{quote}"</p>
      <a
        href={instagramUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center bg-slate-700/50 text-slate-300 text-sm font-semibold py-2 px-3 rounded-lg hover:bg-slate-700/80 transition-colors self-start"
      >
        <Instagram className="w-4 h-4 mr-2" />
        Ver Perfil
      </a>
    </div>
  );
};

const FAQItem = ({ question, answer }: { question: string; answer: string }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="creatuactivo-component-card p-6 cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-white pr-4">{question}</h3>
        <ChevronDown className={`w-6 h-6 text-blue-400 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>
      {isOpen && (
        <p className="text-slate-300 mt-4 leading-relaxed">{answer}</p>
      )}
    </div>
  );
};

// --- Componente Principal ---
function EcosistemaContent() {
  const searchParams = useSearchParams();
  const [applicantName, setApplicantName] = useState('Constructor');

  useEffect(() => {
    const name = searchParams.get('nombre');
    if (name) {
      const decodedName = decodeURIComponent(name.replace(/\+/g, ' '));
      const firstName = decodedName.split(' ')[0];
      setApplicantName(firstName.charAt(0).toUpperCase() + firstName.slice(1));
    }
  }, [searchParams]);

  return (
    <>
      <GlobalStyles />
      <div className="bg-slate-900 text-white">
        <StrategicNavigation />

        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute -top-64 -left-64 w-96 h-96 bg-[var(--creatuactivo-purple)] opacity-20 rounded-full filter blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-64 -right-64 w-96 h-96 bg-[var(--creatuactivo-blue)] opacity-20 rounded-full filter blur-3xl animate-pulse"></div>
        </div>

        <main className="relative z-10 p-4 lg:p-8">
          {/* --- HERO --- */}
          <section className="text-center max-w-4xl mx-auto py-20 lg:py-28">
            <h1 className="creatuactivo-h1-ecosystem text-4xl md:text-6xl lg:text-7xl mb-6">
              Bienvenido al Ecosistema, CreaTuActivo.
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 max-w-2xl mx-auto">
              Una aplicación web para crear tu propio sistema de distribución de productos Gano Excel - Gano Itouch en toda América.
            </p>
          </section>

          {/* --- 3 COMPONENTES ÚNICOS --- */}
          <section className="max-w-6xl mx-auto mb-20 lg:mb-32">
            <div className="text-center mb-12">
              <h2 className="creatuactivo-h2-component text-3xl lg:text-5xl font-bold mb-6">
                3 Componentes Únicos
              </h2>
              <p className="text-slate-400 text-lg max-w-3xl mx-auto">
                Es tener tu propia empresa, pero sin inventar nada.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <ComponentCard
                icon={<Package size={48} />}
                title="1. Gano Excel"
                description="Productos únicos con fórmula exclusiva. Nadie más puede venderlos."
              />
              <ComponentCard
                icon={<Smartphone size={48} />}
                title="2. CreaTuActivo.com"
                description="La aplicación que hace el trabajo pesado: NEXUS + Dashboard."
              />
              <ComponentCard
                icon={<Zap size={48} />}
                title="3. Los 3 Pasos"
                description="INICIAR → ACOGER → ACTIVAR. El método probado."
              />
            </div>

            <div className="creatuactivo-component-card p-8 text-center">
              <p className="text-xl text-white font-bold mb-3">
                La tecnología hace el 80% del trabajo.
              </p>
              <p className="text-slate-400">
                Tú haces el 20% estratégico.
              </p>
            </div>
          </section>

          {/* --- LOS 3 PASOS --- */}
          <section className="max-w-5xl mx-auto mb-20 lg:mb-32">
            <div className="text-center mb-12">
              <h2 className="creatuactivo-h2-component text-3xl lg:text-5xl font-bold mb-6">
                Tu Rol: Los 3 Pasos
              </h2>
              <p className="text-slate-400 text-lg max-w-3xl mx-auto">
                No tienes que ser experto en todo. Solo haces 3 cosas simples.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <StepCard
                number="1"
                icon={<Zap size={32} />}
                title="Iniciar"
                description="Comparte la oportunidad. NEXUS responde las preguntas automáticamente."
              />
              <StepCard
                number="2"
                icon={<Users size={32} />}
                title="Acoger"
                description="La app te avisa cuándo hablar. Tú tienes la conversación personal."
              />
              <StepCard
                number="3"
                icon={<Target size={32} />}
                title="Activar"
                description="Le entregas su aplicación CreaTuActivo. Así crece tu sistema."
              />
            </div>
          </section>

          {/* --- LA TECNOLOGÍA CAMBIÓ TODO (ANTES VS AHORA) --- */}
          <section className="max-w-6xl mx-auto mb-20 lg:mb-32">
            <div className="text-center mb-12">
              <h2 className="creatuactivo-h2-component text-3xl lg:text-5xl font-bold mb-6">
                La Tecnología Cambió Todo
              </h2>
              <p className="text-slate-400 text-lg max-w-3xl mx-auto">
                Así como estas herramientas eliminaron el trabajo pesado...
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
              <div className="creatuactivo-component-card p-6 text-center">
                <p className="text-slate-400 text-sm mb-3 uppercase tracking-wide">Antes</p>
                <p className="text-white font-semibold mb-4">Ir a alquilar DVDs y devolverlos</p>
                <div className="border-t border-slate-700 my-4"></div>
                <p className="text-green-400 text-sm mb-3 uppercase tracking-wide">Ahora</p>
                <p className="text-white font-semibold">Netflix desde el sofá</p>
              </div>

              <div className="creatuactivo-component-card p-6 text-center">
                <p className="text-slate-400 text-sm mb-3 uppercase tracking-wide">Antes</p>
                <p className="text-white font-semibold mb-4">Mapas de papel y preguntar direcciones</p>
                <div className="border-t border-slate-700 my-4"></div>
                <p className="text-green-400 text-sm mb-3 uppercase tracking-wide">Ahora</p>
                <p className="text-white font-semibold">Google Maps</p>
              </div>

              <div className="creatuactivo-component-card p-6 text-center">
                <p className="text-slate-400 text-sm mb-3 uppercase tracking-wide">Antes</p>
                <p className="text-white font-semibold mb-4">Enviar cartas y esperar semanas</p>
                <div className="border-t border-slate-700 my-4"></div>
                <p className="text-green-400 text-sm mb-3 uppercase tracking-wide">Ahora</p>
                <p className="text-white font-semibold">WhatsApp</p>
              </div>

              <div className="creatuactivo-component-card p-6 text-center">
                <p className="text-slate-400 text-sm mb-3 uppercase tracking-wide">Antes</p>
                <p className="text-white font-semibold mb-4">Comprar CDs en tiendas</p>
                <div className="border-t border-slate-700 my-4"></div>
                <p className="text-green-400 text-sm mb-3 uppercase tracking-wide">Ahora</p>
                <p className="text-white font-semibold">Spotify</p>
              </div>
            </div>

            <div className="creatuactivo-component-card p-8 text-center">
              <p className="text-xl md:text-2xl text-white font-bold mb-3">
                CreaTuActivo hace lo mismo con tu sistema de distribución.
              </p>
              <p className="text-slate-300 text-lg">
                Antes tenías que hacer todo manualmente. Ahora, la tecnología trabaja por ti.
              </p>
            </div>
          </section>

          {/* --- ANTES VS AHORA --- */}
          <section className="max-w-5xl mx-auto mb-20 lg:mb-32">
            <div className="text-center mb-12">
              <h2 className="creatuactivo-h2-component text-3xl lg:text-5xl font-bold mb-6">
                La Diferencia
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="creatuactivo-component-card p-8">
                <h3 className="text-2xl font-bold text-red-400 mb-6">Sin CreaTuActivo</h3>
                <div className="space-y-3 text-slate-400">
                  <p className="flex items-start gap-3">
                    <span className="text-red-400 font-bold">×</span>
                    <span>Contestar las mismas preguntas 50 veces</span>
                  </p>
                  <p className="flex items-start gap-3">
                    <span className="text-red-400 font-bold">×</span>
                    <span>Perder el rastro de quién está interesado</span>
                  </p>
                  <p className="flex items-start gap-3">
                    <span className="text-red-400 font-bold">×</span>
                    <span>Olvidar hacer seguimiento</span>
                  </p>
                  <p className="flex items-start gap-3">
                    <span className="text-red-400 font-bold">×</span>
                    <span>Entrenar desde cero a cada persona</span>
                  </p>
                </div>
              </div>

              <div className="creatuactivo-component-card p-8 border-2 border-green-500/30">
                <h3 className="text-2xl font-bold text-green-400 mb-6">Con CreaTuActivo</h3>
                <div className="space-y-3 text-slate-300">
                  <p className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span><strong>NEXUS</strong> responde automáticamente</span>
                  </p>
                  <p className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span><strong>Dashboard</strong> te muestra quién está listo</span>
                  </p>
                  <p className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span><strong>Recordatorios</strong> te avisan cuándo actuar</span>
                  </p>
                  <p className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span><strong>Cada persona</strong> recibe su app lista</span>
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* --- TESTIMONIOS --- */}
          <section className="max-w-6xl mx-auto mb-20 lg:mb-32">
            <div className="text-center mb-12">
              <h2 className="creatuactivo-h2-component text-3xl lg:text-5xl font-bold mb-4">
                Lo Que Dicen los Líderes
              </h2>
              <p className="text-slate-400 text-lg">
                Diamantes de Gano Excel que construyeron con esta metodología.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <TestimonialCard
                quote="El éxito no está en el producto, sino en la duplicación del sistema. Ahora, con esta tecnología, es como pasar de construir a mano a tener una imprenta 3D."
                name="Andrés Guzmán"
                role="Diamante Premier"
                imageSrc="https://ui-avatars.com/api/?name=Andres+Guzman&size=150&background=1E40AF&color=fff&format=png"
                instagramUrl="https://www.instagram.com/andresguzmanofficial/"
              />
              <TestimonialCard
                quote="Como médico, mi tiempo es limitado. La clave siempre fue el apalancamiento. Lo que antes requería 100% de mi esfuerzo, ahora se logra con un 20% estratégico."
                name="Dr. Jonathan Moncaleano"
                role="Diamante Ejecutivo"
                imageSrc="https://ui-avatars.com/api/?name=Jonathan+Moncaleano&size=150&background=7C3AED&color=fff&format=png"
                instagramUrl="https://www.instagram.com/jonathanmoncaleano/"
              />
              <TestimonialCard
                quote="La gente no sigue a un producto, sigue una visión. Esta tecnología es la pieza que faltaba para que cualquier persona seria pueda ejecutar esa visión a nivel global."
                name="Juan Pablo Restrepo"
                role="Diamante Royal"
                imageSrc="https://ui-avatars.com/api/?name=Juan+Pablo+Restrepo&size=150&background=F59E0B&color=000&format=png"
                instagramUrl="https://www.instagram.com/juanpaelrojo/"
              />
            </div>
          </section>

          {/* --- PREGUNTAS FRECUENTES --- */}
          <section className="max-w-4xl mx-auto mb-20 lg:mb-32">
            <div className="text-center mb-12">
              <h2 className="creatuactivo-h2-component text-3xl lg:text-5xl font-bold mb-4">
                Preguntas Frecuentes
              </h2>
            </div>

            <div className="space-y-4">
              <FAQItem
                question="¿Qué productos distribuyo?"
                answer="Productos de salud de Gano Excel: café, té y suplementos con Ganoderma (un hongo medicinal con fórmula exclusiva). Son productos que la gente compra cada mes."
              />
              <FAQItem
                question="¿Necesito experiencia en ventas?"
                answer="No. CreaTuActivo hace el trabajo difícil. Tú solo compartes, conversas y ayudas a otros a empezar."
              />
              <FAQItem
                question="¿Cuánto tiempo necesito dedicar?"
                answer="Con 5-7 horas a la semana, la mayoría ve sus primeros resultados en el Mes 1. Después del año 1, tu sistema crece solo."
              />
              <FAQItem
                question="¿Cuánto cuesta empezar?"
                answer="Hay 3 opciones: $200, $500 o $1,000 USD. También hay una inversión mensual de 50 PV (aprox. $450,000 COP) en productos que tú recibes."
              />
            </div>
          </section>

          {/* --- CTA FINAL --- */}
          <section className="text-center py-20">
            <div className="max-w-3xl mx-auto">
              <h2 className="creatuactivo-h2-component text-3xl md:text-5xl font-bold mb-6">
                ¿Listo para Empezar?
              </h2>
              <p className="text-slate-400 text-lg mb-10">
                El siguiente paso es ver la presentación completa del sistema.
              </p>
              <a href="/presentacion-empresarial" className="creatuactivo-cta-ecosystem text-lg inline-block">
                Ver Presentación Completa
              </a>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}

// --- Export ---
export default function Page() {
  return (
    <Suspense fallback={<div className="bg-slate-900 min-h-screen" />}>
      <EcosistemaContent />
    </Suspense>
  );
}
