/**
 * Copyright © 2025 CreaTuActivo.com
 * Página de Productos - Versión Conversión (noindex)
 * Enfocada en sistemas de bienestar con CTA al Reto
 */

import Link from 'next/link';
import StrategicNavigation from '@/components/StrategicNavigation';
import { Zap, Users, Target, Sparkles, Coffee, ShieldCheck, Leaf, ArrowRight, CheckCircle } from 'lucide-react';

export const metadata = {
  title: 'Productos de Bienestar | CreaTuActivo',
  description: 'Descubre nuestros sistemas de bienestar basados en Ganoderma Lucidum. Café funcional, suplementos y cuidado personal de alta calidad.',
  robots: 'noindex, follow',
};

const sistemasProductos = [
  {
    id: 'energia',
    nombre: 'Energía y Enfoque',
    descripcion: 'Empieza el día con energía sostenida sin el bajón del café normal.',
    beneficios: ['Café con 200+ fitonutrientes', 'Sin acidez estomacal', 'Energía sin nerviosismo'],
    icono: Zap,
    color: 'from-amber-500 to-orange-500',
    bgColor: 'bg-amber-500/10',
  },
  {
    id: 'familia',
    nombre: 'Para Toda la Familia',
    descripcion: 'Bebidas y productos que cuidan a grandes y chicos por igual.',
    beneficios: ['Chocolate y latte funcionales', 'Pasta dental natural', 'Cereales nutritivos'],
    icono: Users,
    color: 'from-emerald-500 to-green-500',
    bgColor: 'bg-emerald-500/10',
  },
  {
    id: 'vitalidad',
    nombre: 'Vitalidad Activa',
    descripcion: 'Ideal si haces ejercicio o simplemente quieres sentirte con más energía.',
    beneficios: ['Cápsulas de Cordyceps', 'Espirulina de alta calidad', 'Suplementos premium'],
    icono: Target,
    color: 'from-red-500 to-rose-500',
    bgColor: 'bg-red-500/10',
  },
  {
    id: 'belleza',
    nombre: 'Piel y Belleza',
    descripcion: 'Cuida tu piel desde adentro con colágeno y por fuera con jabones naturales.',
    beneficios: ['Bebida de colágeno', 'Jabones con Ganoderma', 'Exfoliantes naturales'],
    icono: Sparkles,
    color: 'from-purple-500 to-pink-500',
    bgColor: 'bg-purple-500/10',
  },
  {
    id: 'premium',
    nombre: 'Experiencia Barista',
    descripcion: 'Café de especialidad con tecnología de extracción de 15 bares.',
    beneficios: ['Máquina Luvoco exclusiva', 'Cápsulas en 3 intensidades', 'Calidad profesional'],
    icono: Coffee,
    color: 'from-slate-600 to-slate-800',
    bgColor: 'bg-slate-500/10',
  },
];

export default function ProductosPage() {
  return (
    <>
      <StrategicNavigation />
      <main className="min-h-screen bg-[#0a0a0f] text-[#f5f5f5]">
        {/* Gradient Background */}
        <div
          className="fixed inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at 50% 0%, rgba(212, 175, 55, 0.08) 0%, transparent 50%)'
          }}
        />

        <div className="relative z-10">
          {/* Hero */}
          <section className="pt-32 pb-16 px-6">
            <div className="max-w-4xl mx-auto text-center">
              <span className="inline-flex items-center gap-2 text-sm text-[#a0a0a8] bg-[#1a1a24] px-4 py-2 rounded-full border border-[#2a2a35] mb-8">
                <Leaf className="w-4 h-4 text-[#D4AF37]" />
                Productos de Bienestar
              </span>

              <h1 className="text-4xl sm:text-5xl leading-tight mb-6 font-serif">
                Transforma tus hábitos
                <br />
                <span className="text-[#D4AF37]">con productos que funcionan</span>
              </h1>

              <p className="text-xl text-[#a0a0a8] max-w-2xl mx-auto leading-relaxed mb-8">
                Café funcional, suplementos y cuidado personal basados en Ganoderma Lucidum.
                Productos que la gente ya consume a diario, mejorados con ciencia.
              </p>

              {/* Trust Badges */}
              <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-sm text-[#6b6b75]">
                <span className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                  Registro INVIMA
                </span>
                <span className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                  GMP Certified
                </span>
                <span className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                  Halal Certified
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#D4AF37]" />
                  28+ años
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#D4AF37]" />
                  60+ países
                </span>
              </div>
            </div>
          </section>

          {/* Sistemas de Productos */}
          <section className="py-16 px-6">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-2xl sm:text-3xl font-serif mb-4">
                  Sistemas de Bienestar
                </h2>
                <p className="text-[#a0a0a8]">
                  Productos organizados por objetivo para que encuentres lo que necesitas.
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sistemasProductos.map((sistema) => {
                  const IconComponent = sistema.icono;
                  return (
                    <div
                      key={sistema.id}
                      className="group p-6 rounded-2xl bg-[#12121a] border border-[#2a2a35] hover:border-[#D4AF37]/30 transition-all duration-300"
                    >
                      {/* Icon */}
                      <div className={`w-14 h-14 rounded-xl ${sistema.bgColor} flex items-center justify-center mb-4`}>
                        <IconComponent className={`w-7 h-7 bg-gradient-to-br ${sistema.color} bg-clip-text text-transparent`} style={{ color: sistema.color.includes('amber') ? '#f59e0b' : sistema.color.includes('emerald') ? '#10b981' : sistema.color.includes('red') ? '#ef4444' : sistema.color.includes('purple') ? '#a855f7' : '#64748b' }} />
                      </div>

                      {/* Content */}
                      <h3 className="text-lg font-semibold mb-2">{sistema.nombre}</h3>
                      <p className="text-[#a0a0a8] text-sm mb-4 leading-relaxed">
                        {sistema.descripcion}
                      </p>

                      {/* Benefits */}
                      <ul className="space-y-2 mb-4">
                        {sistema.beneficios.map((beneficio, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <CheckCircle className="w-4 h-4 text-[#D4AF37] mt-0.5 flex-shrink-0" />
                            <span className="text-[#a0a0a8]">{beneficio}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* El Diferenciador */}
          <section className="py-16 px-6 bg-[#12121a]">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-2xl sm:text-3xl font-serif mb-4">
                  ¿Qué hace diferentes a estos productos?
                </h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-6 rounded-xl bg-[#0a0a0f] border border-[#2a2a35]">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Leaf className="w-5 h-5 text-[#D4AF37]" />
                    Ganoderma Lucidum
                  </h3>
                  <p className="text-[#a0a0a8] text-sm leading-relaxed">
                    Conocido como el &quot;Rey de los Hongos&quot;, contiene más de 200 fitonutrientes.
                    Usado por más de 4,000 años en la medicina tradicional asiática.
                  </p>
                </div>

                <div className="p-6 rounded-xl bg-[#0a0a0f] border border-[#2a2a35]">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-[#D4AF37]" />
                    Calidad Certificada
                  </h3>
                  <p className="text-[#a0a0a8] text-sm leading-relaxed">
                    Certificación GMP (Buenas Prácticas de Manufactura), Halal Certified,
                    registro INVIMA Colombia. Cultivo orgánico propio sin químicos.
                  </p>
                </div>

                <div className="p-6 rounded-xl bg-[#0a0a0f] border border-[#2a2a35]">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Coffee className="w-5 h-5 text-[#D4AF37]" />
                    No Cambia Hábitos
                  </h3>
                  <p className="text-[#a0a0a8] text-sm leading-relaxed">
                    Café, chocolate, pasta de dientes—productos que ya consumes.
                    Solo los mejora con nutrientes funcionales.
                  </p>
                </div>

                <div className="p-6 rounded-xl bg-[#0a0a0f] border border-[#2a2a35]">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Target className="w-5 h-5 text-[#D4AF37]" />
                    Consumo Recurrente
                  </h3>
                  <p className="text-[#a0a0a8] text-sm leading-relaxed">
                    La base del modelo de ingresos residuales: productos que se consumen
                    y reordenan naturalmente mes a mes.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Principal */}
          <section className="py-20 px-6">
            <div className="max-w-2xl mx-auto">
              <div className="bg-[#12121a] border border-[#2a2a35] rounded-2xl p-8 sm:p-10 text-center">
                <span className="inline-flex items-center gap-2 text-sm text-[#a0a0a8] bg-[#0a0a0f] px-4 py-2 rounded-full border border-[#2a2a35] mb-6">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                  Siguiente paso
                </span>

                <h2 className="text-2xl sm:text-3xl font-serif mb-4">
                  ¿Quieres saber cómo funciona?
                </h2>

                <p className="text-[#a0a0a8] mb-8 max-w-lg mx-auto">
                  En el <span className="text-[#f5f5f5] font-medium">Reto de 5 Días</span> te explico
                  cómo estos productos pueden convertirse en tu primer activo generador de ingresos residuales.
                </p>

                <Link
                  href="/reto-5-dias"
                  className="inline-flex items-center gap-3 px-8 py-4 bg-[#D4AF37] hover:bg-[#E8C547] text-[#0a0a0f] font-semibold text-lg rounded-xl transition-all duration-300 w-full sm:w-auto justify-center"
                >
                  Unirme al Reto Gratis
                  <ArrowRight className="w-5 h-5" />
                </Link>

                <p className="text-[#6b6b75] text-xs mt-6">
                  Sin costo • 5 días por WhatsApp • Sin compromiso
                </p>
              </div>

              {/* CTA Secundario */}
              <div className="mt-8 text-center">
                <p className="text-[#6b6b75] text-sm mb-3">
                  ¿Ya conoces el modelo y quieres ver el catálogo completo?
                </p>
                <Link
                  href="/sistema/productos"
                  className="text-[#D4AF37] hover:text-[#E8C547] text-sm font-medium inline-flex items-center gap-1 transition-colors"
                >
                  Ver catálogo de productos <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="px-6 py-12 border-t border-[#2a2a35]">
            <div className="max-w-5xl mx-auto text-center">
              <p className="text-sm text-[#6b6b75]">
                © 2025 CreaTuActivo.com ·
                <Link href="/privacidad" className="hover:text-[#a0a0a8] ml-2">
                  Privacidad
                </Link>
              </p>
            </div>
          </footer>
        </div>
      </main>
    </>
  );
}
