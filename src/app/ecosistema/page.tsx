'use client'

import { Suspense, useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { FileText, Cpu, User, Zap, GraduationCap, BrainCircuit, Users, Check, Instagram } from 'lucide-react'
import StrategicNavigation from '@/components/StrategicNavigation'

// --- Estilos CSS Globales (Consistentes con /fundadores) ---
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
    }

    .creatuactivo-final-card {
      background: linear-gradient(135deg, rgba(30, 64, 175, 0.2) 0%, rgba(124, 58, 237, 0.2) 100%);
      border: 1px solid rgba(124, 58, 237, 0.4);
      border-radius: 16px;
      padding: 32px;
    }
  `}</style>
);

// --- Componente Reutilizable para Tarjetas de Pilares ---
const PillarCard = ({ icon, title, description }: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => (
  <div className="creatuactivo-ecosystem-card p-8 h-full text-center">
    <div className="mb-6 inline-block text-yellow-400">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
    <p className="text-slate-400 leading-relaxed">{description}</p>
  </div>
);

// --- Componente para Tarjetas de Testimonios (CORREGIDO) ---
const TestimonialCard = ({ quote, name, role, imageSrc, instagramUrl }: {
  quote: string;
  name: string;
  role: string;
  imageSrc: string;
  instagramUrl: string;
}) => {
  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  // CORREGIDO: función getInitials con el error de sintaxis arreglado
  const getInitials = (name: string) => {
    const names = name.split(' ');
    let initials = names.length > 1
      ? `${names[0][0]}${names[names.length - 1][0]}` // CORREGIDO: agregadas las [0]
      : name.substring(0, 2);
    return initials.toUpperCase();
  };

  // Manejar carga de imagen
  const handleImageLoad = () => {
    setImgLoaded(true);
    setImgError(false);
  };

  const handleImageError = () => {
    console.log(`Error cargando imagen para ${name}:`, imageSrc);
    setImgError(true);
    setImgLoaded(false);
  };

  return (
    <div className="creatuactivo-ecosystem-card p-6 flex flex-col h-full">
      <div className="flex items-center mb-4">
        <div className="relative w-16 h-16 mr-4 flex-shrink-0">
          {imgError || !imgLoaded ? (
            <div className="w-full h-full rounded-full flex items-center justify-center bg-purple-500/30 text-purple-300 font-bold text-xl border-2 border-purple-500/50">
              {getInitials(name)}
            </div>
          ) : null}

          <img
            src={imageSrc}
            alt={`Foto de perfil de ${name}`}
            className={`w-full h-full rounded-full object-cover border-2 border-purple-500/50 ${
              imgLoaded && !imgError ? 'block' : 'hidden'
            }`}
            onLoad={handleImageLoad}
            onError={handleImageError}
            crossOrigin="anonymous"
          />
        </div>
        <div>
          <p className="font-bold text-white text-lg">{name}</p>
          <p className="text-sm text-purple-400">{role}</p>
        </div>
      </div>
      <p className="text-slate-300 italic flex-grow mb-4">"{quote}"</p>
      <a
        href={instagramUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center mt-auto bg-slate-700/50 text-slate-300 font-bold py-2 px-4 rounded-lg hover:bg-slate-700/80 transition-colors self-start"
      >
        <Instagram className="w-5 h-5 mr-2" />
        Ver Perfil
      </a>
    </div>
  );
};

// --- Componente de Contenido de la Página ---
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
          {/* --- SECCIÓN 1: HERO DE VALIDACIÓN --- */}
          <section className="text-center max-w-4xl mx-auto py-20 lg:py-28">
            <h1 className="creatuactivo-h1-ecosystem text-4xl md:text-6xl lg:text-7xl mb-6">
              Bienvenido al Ecosistema, {applicantName}.
            </h1>
            <p className="text-lg lg:text-xl text-slate-300 max-w-3xl mx-auto">
              Mientras nuestro Comité de Arquitectos revisa tu visión, te invitamos a un recorrido por la filosofía y la maquinaria que impulsan a los constructores de activos más exitosos de América.
            </p>
          </section>

          {/* --- SECCIÓN 2: LA FILOSOFÍA DEL SISTEMA --- */}
          <section className="max-w-6xl mx-auto mb-20 lg:mb-32">
            <div className="text-center mb-12">
              <h2 className="creatuactivo-h2-component text-3xl lg:text-4xl font-bold mb-4">El Secreto no está en el Producto, está en el Sistema.</h2>
              <p className="text-slate-400 max-w-3xl mx-auto">
                Inspirados por visionarios como Ray Kroc y Jeff Bezos, no nos enfocamos en "vender hamburguesas" o "libros al detal". Nos obsesionamos con perfeccionar el sistema que permite a otros construir imperios.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <PillarCard
                icon={<FileText size={40} />}
                title="El Plano (Metodología)"
                description="Una estrategia probada y refinada durante 9 años. Es el 'cómo' y el 'porqué' que garantiza resultados predecibles, eliminando la improvisación."
              />
              <PillarCard
                icon={<Cpu size={40} />}
                title="La Maquinaria (Tecnología)"
                description="El motor automatizado que ejecuta el 80% del trabajo pesado. Es tu equipo de operaciones, marketing y seguimiento trabajando 24/7 sin descanso."
              />
              <PillarCard
                icon={<User size={40} />}
                title="El Constructor (Tú)"
                description="El piloto que dirige la maquinaria con una visión clara. Tu rol no es ser el mecánico, sino el estratega que pone el sistema en movimiento."
              />
            </div>
          </section>

          {/* --- SECCIÓN 3: TU ROL - METODOLOGÍA IAA --- */}
          <section className="max-w-5xl mx-auto mb-20 lg:mb-32">
            <div className="text-center mb-12">
              <h2 className="creatuactivo-h2-component text-3xl lg:text-4xl font-bold mb-4">Tu Rol Redefinido: El Framework IAA</h2>
              <p className="text-slate-400 max-w-3xl mx-auto">
                Olvídate de ser un experto en todo. El Framework IAA (Iniciar, Acoger, Activar) redefine tu rol, permitiéndote enfocarte únicamente en las 3 acciones que generan crecimiento exponencial.
              </p>
            </div>
            <div className="creatuactivo-ecosystem-card p-8 md:p-12">
              <div className="grid md:grid-cols-3 gap-8 text-center">
                <div className="flex flex-col items-center">
                  <div className="bg-blue-500/20 text-blue-400 rounded-full w-16 h-16 flex items-center justify-center mb-4 border border-blue-400/30">
                    <Zap size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">1. Iniciar</h3>
                  <p className="text-slate-400">La chispa estratégica. Tu rol es conectar y despertar la curiosidad usando la tecnología del ecosistema, no convencer.</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="bg-purple-500/20 text-purple-400 rounded-full w-16 h-16 flex items-center justify-center mb-4 border border-purple-400/30">
                    <Users size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">2. Acoger</h3>
                  <p className="text-slate-400">El arte de la confianza. Tu función es ser el anfitrión de la experiencia, guiando a los prospectos calificados que el sistema te entrega.</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="bg-yellow-500/20 text-yellow-400 rounded-full w-16 h-16 flex items-center justify-center mb-4 border border-yellow-400/30">
                    <Check size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">3. Activar</h3>
                  <p className="text-slate-400">El punto de partida. Formalizas el ingreso del nuevo constructor al ecosistema para que la maquinaria comience a trabajar para él.</p>
                </div>
              </div>
              <div className="mt-10 text-center bg-slate-800/50 p-4 rounded-lg">
                <p className="text-slate-300"><span className="font-bold text-white">Tu Enfoque:</span> Apalancamiento Tecnológico y Estratégico. <span className="text-slate-500">No más trabajo manual y repetitivo.</span></p>
              </div>
            </div>
          </section>

          {/* --- SECCIÓN 4: CRECIMIENTO PERSONAL --- */}
          <section className="max-w-5xl mx-auto mb-20 lg:mb-32 text-center">
            <GraduationCap size={48} className="mx-auto text-purple-400 mb-6" />
            <h2 className="creatuactivo-h2-component text-3xl lg:text-4xl font-bold mb-4">Más que un Activo: Una Transformación Personal.</h2>
            <p className="text-slate-400 max-w-3xl mx-auto">
              Descubrimos que la razón más profunda por la que las personas inician no es solo económica. Es el deseo de crecer, superar miedos y convertirse en la persona capaz de liderar. Este ecosistema está diseñado para forjar arquitectos, no solo para construir activos. Dentro de la **Academia de Arquitectos**, encontrarás la formación y la comunidad para catalizar esa transformación.
            </p>
          </section>

          {/* --- SECCIÓN 5: TESTIMONIOS (PRUEBA SOCIAL) --- */}
          <section className="max-w-7xl mx-auto mb-20 lg:mb-32">
            <div className="text-center mb-12">
              <h2 className="creatuactivo-h2-component text-3xl lg:text-4xl font-bold mb-4">La Visión de los Pioneros</h2>
              <p className="text-slate-400 max-w-3xl mx-auto">
                Ellos construyeron imperios en la "edad de piedra", con pura metodología y visión de sistema. Escucha por qué este es un momento histórico.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <TestimonialCard
                quote="Entendí temprano que el éxito, como en la visión de Ray Kroc, no estaba en el producto, sino en la duplicación del sistema. La metodología de Gano Excel nos dio el plano. Ahora, con esta tecnología, es como pasar de construir a mano a tener una imprenta 3D. La escala es inimaginable."
                name="Andrés Guzmán"
                role="Diamante Premier, Gano Excel"
                imageSrc="https://ui-avatars.com/api/?name=Andres+Guzman&size=150&background=1E40AF&color=fff&format=png"
                instagramUrl="https://www.instagram.com/andresguzmanofficial/"
              />
              <TestimonialCard
                quote="Como médico, mi tiempo es limitado. No podía 'vender' un producto, pero sí podía presentar un sistema de negocio inteligente. La clave siempre fue el apalancamiento. Lo que antes requería 100% de mi esfuerzo, ahora se puede lograr con un 20% estratégico, dejando que el sistema haga el resto. Es la definición de un activo."
                name="Dr. Jonathan Moncaleano"
                role="Diamante Ejecutivo, Gano Excel"
                imageSrc="https://ui-avatars.com/api/?name=Jonathan+Moncaleano&size=150&background=7C3AED&color=fff&format=png"
                instagramUrl="https://www.instagram.com/jonathanmoncaleano/"
              />
              <TestimonialCard
                quote="La gente no sigue a un producto, sigue una visión. Jeff Bezos no vendía libros, construía el sistema de comercio del futuro. Nuestra metodología siempre fue enseñar a la gente a pensar como empresarios. Esta tecnología es la pieza que faltaba para que cualquier persona seria pueda ejecutar esa visión a nivel global."
                name="Juan Pablo Restrepo"
                role="Diamante Royal, Gano Excel"
                imageSrc="https://ui-avatars.com/api/?name=Juan+Pablo+Restrepo&size=150&background=F59E0B&color=000&format=png"
                instagramUrl="https://www.instagram.com/juanpaelrojo/"
              />
            </div>
          </section>

          {/* --- SECCIÓN 6: PREPARACIÓN PARA LA LLAMADA --- */}
          <section className="max-w-4xl mx-auto text-center py-20">
            <div className="creatuactivo-final-card">
              <BrainCircuit size={48} className="mx-auto text-purple-400 mb-6" />
              <h2 className="creatuactivo-h2-component text-3xl lg:text-4xl font-bold mb-6">Prepara tu Mentalidad de Arquitecto</h2>
              <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
                Si esta filosofía de sistemas, confianza y apalancamiento resuena contigo, estás en el lugar correcto. La llamada que programaremos no es una entrevista de ventas. Es una **sesión de estrategia** para validar si tu visión y nuestro ecosistema pueden construir algo extraordinario juntos.
              </p>
              <p className="text-yellow-400 font-semibold text-lg">
                Llega a la conversación listo para hablar de sistemas, no de productos. Ese es el primer paso para pensar como un verdadero constructor de activos.
              </p>
            </div>
          </section>

          <footer className="border-t border-white/10 py-8 mt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-slate-400 text-sm">
              <p>&copy; {new Date().getFullYear()} CreaTuActivo.com. Todos los derechos reservados.</p>
            </div>
          </footer>
        </main>
      </div>
    </>
  );
}

// --- Componente Principal que envuelve con Suspense ---
export default function EcosistemaPage() {
  return (
    <Suspense fallback={<div className="bg-slate-900 text-white min-h-screen flex items-center justify-center">Cargando Ecosistema...</div>}>
      <EcosistemaContent />
    </Suspense>
  );
}
