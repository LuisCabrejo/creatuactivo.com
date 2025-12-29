/**
 * Copyright © 2025 CreaTuActivo.com
 * Homepage v5.0 - Funnel Hub (Restaurada según diseño original)
 * Basado en Russell Brunson: Hub que valida y dirige al embudo principal
 * Gap corregido: pt-32 para espacio entre nav y body
 */

import Link from 'next/link';
import StrategicNavigation from '@/components/StrategicNavigation';

// ============================================================================
// METADATA
// ============================================================================

export const metadata = {
  title: 'CreaTuActivo - Sistema de Arquitectura Soberana',
  description: 'Construye tu cartera de activos con distribución global. Un sistema diseñado por Luis Cabrejo para transicionar de dependiente a soberano.',
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function HomePage() {
  return (
    <>
      <StrategicNavigation />
      <main className="min-h-screen bg-[#0a0a0f] text-[#f5f5f5] relative">
        {/* Background Image - Gano Excel */}
        <div
          className="fixed inset-0 pointer-events-none z-0 opacity-40"
          style={{
            backgroundImage: `url('/gano-excel.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        />

        {/* Content wrapper - above background */}
        <div className="relative z-10">
          {/* HERO SECTION */}
          <HeroSection />

          {/* TRAFFIC DIRECTOR */}
          <TrafficDirector />

          {/* EL PROBLEMA (EL VILLANO) */}
          <ProblemSection />

          {/* EL SISTEMA */}
          <SystemSection />

          {/* EL ARQUITECTO */}
          <ArchitectSection />

          {/* TESTIMONIOS */}
          <TestimonialsSection />

          {/* CTA FINAL */}
          <FinalCTASection />

          {/* FOOTER */}
          <Footer />
        </div>
      </main>
    </>
  );
}

// ============================================================================
// HERO SECTION - Con Video Manifiesto integrado
// ============================================================================

function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center px-6 pt-60 pb-20">
      {/* Background gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 50% 30%, rgba(212, 175, 55, 0.08) 0%, transparent 50%)',
        }}
      />

      <div className="relative max-w-4xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 mb-8 bg-[#1a1a24] border border-[#2a2a35]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
          <span className="text-sm text-[#a0a0a8]">
            Estrategia de Soberanía Financiera
          </span>
        </div>

        {/* Main Headline */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl leading-tight mb-6 font-serif">
          <span className="text-[#a0a0a8]">¿Es Tu Plan Financiero un Puente</span>
          <br />
          <span className="text-[#f5f5f5]">hacia la </span>
          <span className="text-[#D4AF37]">Soberanía</span>
          <br />
          <span className="text-[#f5f5f5]">o una </span>
          <span className="text-[#a0a0a8]">Trampa de Dependencia</span>
          <span className="text-[#f5f5f5]">?</span>
        </h1>

        {/* Subheadline */}
        <p className="text-lg sm:text-xl mb-8 max-w-2xl mx-auto leading-relaxed text-[#a0a0a8]">
          Deja de ser el motor de tu economía.{' '}
          <span className="text-[#f5f5f5] font-medium underline decoration-[#D4AF37]/50">Construye el chasis</span>{' '}
          que te permita detenerte{' '}
          <span className="text-[#D4AF37] font-medium underline decoration-[#D4AF37]/50">sin que todo colapse</span>.
        </p>

        {/* Video Manifiesto Placeholder */}
        <div className="max-w-md mx-auto mb-8">
          <div className="aspect-video rounded-2xl bg-[#12121a] border border-[#2a2a35] flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-[#D4AF37] flex items-center justify-center mx-auto mb-3 cursor-pointer hover:bg-[#E8C547] transition-colors">
                <svg className="w-7 h-7 text-[#0a0a0f] ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <p className="text-[#a0a0a8] text-sm">Ver Manifiesto</p>
              <p className="text-[#6b6b75] text-xs">2 minutos</p>
            </div>
          </div>
        </div>

        {/* Architect credit */}
        <p className="text-sm mb-8 text-[#6b6b75]">
          Diseñado por <span className="text-[#a0a0a8]">Luis Cabrejo Parra</span> · #1 de su organización
        </p>

        {/* CTA Button */}
        <Link
          href="/reto-5-dias"
          className="inline-flex items-center justify-center gap-3 font-semibold text-lg px-10 py-5 rounded-xl transition-all duration-300 hover:translate-y-[-2px] hover:shadow-lg bg-[#D4AF37] text-[#0a0a0f]"
        >
          Unirme al Reto de 5 Días
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>

        {/* Trust indicators */}
        <div className="flex flex-wrap items-center justify-center gap-8 mt-12 text-sm text-[#6b6b75]">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-[#C9A962]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
            </svg>
            <span>65+ países</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-[#C9A962]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
            <span>Inversión desde $200 USD</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-[#C9A962]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
            </svg>
            <span>Operación 100% Remota</span>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// TRAFFIC DIRECTOR - 2 Opciones: Nuevo vs Ya tomó el reto
// ============================================================================

function TrafficDirector() {
  return (
    <section className="px-6 py-12 bg-[#0a0a0f]">
      <div className="max-w-3xl mx-auto">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Option 1: Nuevo - Reto */}
          <Link
            href="/reto-5-dias"
            className="group p-8 rounded-2xl bg-[#12121a] border border-[#2a2a35] hover:border-[#D4AF37]/50 transition-all duration-300"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              </div>
              <span className="text-xs text-[#D4AF37]">¿Eres nuevo?</span>
            </div>
            <h3 className="text-xl font-semibold mb-2 group-hover:text-[#D4AF37] transition-colors">
              Empieza por el Reto de 5 Días
            </h3>
            <p className="text-sm text-[#6b6b75]">
              Descubre si este modelo es para ti. Gratis, sin compromiso.
            </p>
          </Link>

          {/* Option 2: Ya tomó el reto - Fundador */}
          <Link
            href="/fundadores"
            className="group p-8 rounded-2xl bg-[#12121a] border border-[#2a2a35] hover:border-[#D4AF37]/50 transition-all duration-300"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                </svg>
              </div>
              <span className="text-xs text-[#D4AF37]">¿Ya tomaste el reto?</span>
            </div>
            <h3 className="text-xl font-semibold mb-2 group-hover:text-[#D4AF37] transition-colors">
              Únete como Fundador
            </h3>
            <p className="text-sm text-[#6b6b75]">
              Accede a la tecnología y comienza a construir tu activo.
            </p>
          </Link>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// PROBLEM SECTION (EL VILLANO)
// ============================================================================

function ProblemSection() {
  return (
    <section className="px-6 py-20 bg-[#12121a]">
      <div className="max-w-4xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="text-sm font-medium uppercase tracking-widest text-[#D4AF37]">
            El Problema
          </span>
          <h2 className="text-3xl sm:text-4xl mt-4 font-serif">
            La Trampa del Plan por Defecto
          </h2>
        </div>

        {/* The trap visualization */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="p-6 rounded-xl bg-[#1a1a24] border border-[#2a2a35] text-center">
            <div className="w-12 h-12 rounded-full bg-[#D4AF37]/10 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-[#D4AF37]">1</span>
            </div>
            <h3 className="font-semibold mb-2">Trabajar</h3>
            <p className="text-sm text-[#a0a0a8]">
              Dedicas 40+ horas semanales a generar ingresos
            </p>
          </div>
          <div className="p-6 rounded-xl bg-[#1a1a24] border border-[#2a2a35] text-center">
            <div className="w-12 h-12 rounded-full bg-[#D4AF37]/10 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-[#D4AF37]">2</span>
            </div>
            <h3 className="font-semibold mb-2">Pagar Cuentas</h3>
            <p className="text-sm text-[#a0a0a8]">
              El dinero entra y sale. Eres un canal de paso.
            </p>
          </div>
          <div className="p-6 rounded-xl bg-[#1a1a24] border border-[#2a2a35] text-center">
            <div className="w-12 h-12 rounded-full bg-[#D4AF37]/10 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-[#D4AF37]">3</span>
            </div>
            <h3 className="font-semibold mb-2">Repetir</h3>
            <p className="text-sm text-[#a0a0a8]">
              Hasta que... ¿cuándo? ¿Jubilación a los 65?
            </p>
          </div>
        </div>

        {/* The insight */}
        <div className="p-8 rounded-2xl bg-gradient-to-r from-[#1a1a24] to-[#22222e] border border-[#2a2a35]">
          <p className="text-xl leading-relaxed text-center">
            <span className="text-[#a0a0a8]">El problema no es que trabajes duro.</span>
            <br />
            <span className="text-[#f5f5f5]">El problema es que </span>
            <span className="text-[#D4AF37] font-semibold">el activo eres TÚ</span>
            <span className="text-[#f5f5f5]">.</span>
            <br />
            <span className="text-[#a0a0a8]">Si tú te detienes, el sistema colapsa.</span>
            <br />
            <span className="text-[#6b6b75] text-lg italic mt-2 block">¿Es eso un negocio... o una obligación disfrazada?</span>
          </p>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// SYSTEM SECTION - Con Queswa y Gano Excel específicos
// ============================================================================

function SystemSection() {
  return (
    <section className="px-6 py-20">
      <div className="max-w-5xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="text-sm font-medium uppercase tracking-widest text-[#D4AF37]">
            La Solución
          </span>
          <h2 className="text-3xl sm:text-4xl mt-4 font-serif">
            ¿Qué es CreaTuActivo?
          </h2>
          <p className="text-lg text-[#a0a0a8] mt-4 max-w-2xl mx-auto">
            Un sistema que combina tecnología propietaria, mentoría y distribución global
            para que construyas activos que generen sin tu presencia constante.
          </p>
        </div>

        {/* Three pillars */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Pilar 1 - Tecnología Queswa */}
          <div className="p-8 rounded-2xl bg-[#1a1a24] border border-[#2a2a35]">
            <div className="w-14 h-14 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center mb-6">
              <svg className="w-7 h-7 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-1">Tecnología Queswa</h3>
            <p className="text-sm text-[#D4AF37] mb-3">Tu ventaja injusta</p>
            <p className="text-[#a0a0a8] leading-relaxed text-sm">
              IA que educa y filtra prospectos 24/7. Funnels automatizados. Sistema que
              hace el 80% del trabajo que tú odias.
            </p>
          </div>

          {/* Pilar 2 - Mentoría */}
          <div className="p-8 rounded-2xl bg-[#1a1a24] border border-[#2a2a35]">
            <div className="w-14 h-14 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center mb-6">
              <svg className="w-7 h-7 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-1">Mentoría</h3>
            <p className="text-sm text-[#D4AF37] mb-3">No estás solo</p>
            <p className="text-[#a0a0a8] leading-relaxed text-sm">
              Reto de 5 Días, capacitación continua, comunidad de constructores. Tienes
              un arquitecto que ya recorrió el camino.
            </p>
          </div>

          {/* Pilar 3 - Distribución Global */}
          <div className="p-8 rounded-2xl bg-[#1a1a24] border border-[#2a2a35]">
            <div className="w-14 h-14 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center mb-6">
              <svg className="w-7 h-7 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-1">Distribución Global</h3>
            <p className="text-sm text-[#D4AF37] mb-3">Gano Excel · 65+ países</p>
            <p className="text-[#a0a0a8] leading-relaxed text-sm">
              Producto de consumo diario con 28 años en el mercado. Tu red crece
              mientras duermes. Sin inventario en casa.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// ARCHITECT SECTION
// ============================================================================

function ArchitectSection() {
  return (
    <section className="px-6 py-20 bg-[#12121a]">
      <div className="max-w-4xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-12">
          <span className="text-sm font-medium uppercase tracking-widest text-[#D4AF37]">
            El Arquitecto
          </span>
          <h2 className="text-3xl sm:text-4xl mt-4 font-serif">
            Luis Cabrejo Parra
          </h2>
        </div>

        {/* Content */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Photo placeholder */}
          <div className="aspect-square rounded-2xl bg-gradient-to-br from-[#1a1a24] to-[#22222e] border border-[#2a2a35] flex items-center justify-center">
            <div className="text-center p-8">
              <div className="w-24 h-24 rounded-full bg-[#D4AF37]/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl font-serif text-[#D4AF37]">LC</span>
              </div>
              <p className="text-sm text-[#6b6b75]">Foto próximamente</p>
            </div>
          </div>

          {/* Bio */}
          <div className="space-y-6">
            <p className="text-lg leading-relaxed text-[#a0a0a8]">
              <span className="text-[#f5f5f5]">A los 40 años</span> descubrí que había pasado dos décadas
              escalando la escalera del éxito... <span className="text-[#D4AF37] underline decoration-[#D4AF37]/50">solo para darme cuenta
              de que estaba apoyada en la pared equivocada</span>.
            </p>

            <p className="leading-relaxed text-[#a0a0a8]">
              Trabajé en empresas importantes del sector automotriz.
              Emprendí negocios con mi esposa. Pensé que sería millonario a los 30...
              luego a los 40. Me equivoqué.
            </p>

            <p className="leading-relaxed text-[#a0a0a8]">
              Descubrí que <span className="text-[#f5f5f5] underline decoration-[#D4AF37]/50">había comprado un empleo,
              no construido un activo</span>. Entonces encontré un modelo diferente.
            </p>

            <div className="p-4 rounded-xl bg-[#0a0a0f] border border-[#2a2a35]">
              <p className="text-sm text-[#D4AF37] font-medium">
                En 2.5 años llegué al #1 de mi organización.
              </p>
              <p className="text-sm text-[#6b6b75] mt-1">
                Ahora ayudo a otros a construir su propia arquitectura soberana.
              </p>
            </div>

            <p className="text-sm italic text-[#6b6b75]">
              &quot;La lealtad es con los objetivos del proyecto.&quot;
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// TESTIMONIALS SECTION
// ============================================================================

function TestimonialsSection() {
  return (
    <section className="px-6 py-20">
      <div className="max-w-5xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="text-sm font-medium uppercase tracking-widest text-[#D4AF37]">
            Historias de Transformación
          </span>
          <h2 className="text-3xl sm:text-4xl mt-4 font-serif">
            De Dependientes a Soberanos
          </h2>
        </div>

        {/* Testimonials grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Testimonial 1 */}
          <div className="p-8 rounded-2xl bg-[#1a1a24] border border-[#2a2a35]">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-[#D4AF37]/10 flex items-center justify-center">
                <span className="font-semibold text-[#D4AF37]">MR</span>
              </div>
              <div>
                <p className="font-medium">María R.</p>
                <p className="text-sm text-[#6b6b75]">Profesional en finanzas</p>
              </div>
            </div>
            <p className="text-[#a0a0a8] leading-relaxed">
              &quot;Después de 15 años en banca, mi diagnóstico fue devastador:
              14 días de libertad. Hoy, 8 meses después, mi activo paralelo
              genera lo que antes me tomaba 3 meses de trabajo.&quot;
            </p>
          </div>

          {/* Testimonial 2 */}
          <div className="p-8 rounded-2xl bg-[#1a1a24] border border-[#2a2a35]">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-[#D4AF37]/10 flex items-center justify-center">
                <span className="font-semibold text-[#D4AF37]">CA</span>
              </div>
              <div>
                <p className="font-medium">Carlos A.</p>
                <p className="text-sm text-[#6b6b75]">Dueño de restaurante</p>
              </div>
            </div>
            <p className="text-[#a0a0a8] leading-relaxed">
              &quot;Mi negocio me tenía atrapado. Si no abría, no cobraba.
              CreaTuActivo me enseñó a construir algo que funciona
              sin mi presencia física. Ahora tengo dos motores.&quot;
            </p>
          </div>

          {/* Testimonial 3 */}
          <div className="p-8 rounded-2xl bg-[#1a1a24] border border-[#2a2a35]">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-[#D4AF37]/10 flex items-center justify-center">
                <span className="font-semibold text-[#D4AF37]">JL</span>
              </div>
              <div>
                <p className="font-medium">Jorge L.</p>
                <p className="text-sm text-[#6b6b75]">Latino en Miami</p>
              </div>
            </div>
            <p className="text-[#a0a0a8] leading-relaxed">
              &quot;Trabajo en construcción. Envío remesas a mi familia.
              Mi cuerpo no va a durar siempre. Necesitaba un plan B.
              Encontré un activo que funciona en dólares y pesos.&quot;
            </p>
          </div>

          {/* Testimonial 4 */}
          <div className="p-8 rounded-2xl bg-[#1a1a24] border border-[#2a2a35]">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-[#D4AF37]/10 flex items-center justify-center">
                <span className="font-semibold text-[#D4AF37]">AP</span>
              </div>
              <div>
                <p className="font-medium">Andrea P.</p>
                <p className="text-sm text-[#6b6b75]">Emprendedora</p>
              </div>
            </div>
            <p className="text-[#a0a0a8] leading-relaxed">
              &quot;El Reto de 5 Días me abrió los ojos. No es lo que
              pensaba. Es un proyecto empresarial serio. Ya recuperé
              mi inversión inicial y apenas estoy empezando.&quot;
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// FINAL CTA SECTION
// ============================================================================

function FinalCTASection() {
  return (
    <section className="px-6 py-20 bg-[#12121a]">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-serif mb-6">
          ¿Listo para construir tu activo?
        </h2>

        <p className="text-lg text-[#a0a0a8] mb-10">
          En 5 días descubrirás si este modelo es para ti. Sin compromiso. Sin presión. Solo claridad.
        </p>

        <Link
          href="/reto-5-dias"
          className="inline-flex items-center justify-center gap-3 font-semibold text-lg px-10 py-5 rounded-xl transition-all duration-300 hover:translate-y-[-2px] hover:shadow-lg bg-[#D4AF37] text-[#0a0a0f]"
        >
          Unirme al Reto Gratis
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>

        <p className="text-sm mt-6 text-[#6b6b75]">
          Sin atajos mágicos. Sin promesas vacías. Solo un sistema probado y mentoría real.
        </p>
      </div>
    </section>
  );
}

// ============================================================================
// FOOTER
// ============================================================================

function Footer() {
  return (
    <footer className="px-6 py-12 border-t border-[#2a2a35]">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <p className="font-medium text-[#D4AF37]">CreaTuActivo</p>
            <p className="text-sm text-[#6b6b75] mt-1">
              Sistema de Arquitectura Soberana
            </p>
          </div>

          <div className="flex gap-6 text-sm text-[#6b6b75]">
            <Link href="/privacidad" className="hover:text-[#a0a0a8] transition-colors">
              Privacidad
            </Link>
            <Link href="/presentacion-empresarial" className="hover:text-[#a0a0a8] transition-colors">
              Presentación
            </Link>
            <Link href="/fundadores" className="hover:text-[#a0a0a8] transition-colors">
              Fundadores
            </Link>
          </div>

          <p className="text-sm text-[#6b6b75]">
            © 2025 CreaTuActivo.com
          </p>
        </div>
      </div>
    </footer>
  );
}
