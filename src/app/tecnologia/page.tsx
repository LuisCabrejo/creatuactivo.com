/**
 * Copyright © 2025 CreaTuActivo.com
 * Página de Tecnología - Queswa Diferenciador
 * Explica la ventaja competitiva de la IA
 */

import Link from 'next/link';
import StrategicNavigation from '@/components/StrategicNavigation';
import { Bot, Target, BarChart3, Users, CheckCircle, X } from 'lucide-react';

export const metadata = {
  title: 'Tecnología Queswa - Tu Ventaja Injusta | CreaTuActivo',
  description: 'Conoce Queswa, la inteligencia artificial que educa, filtra y trabaja 24/7 para que tú no tengas que vender. La tecnología que diferencia a CreaTuActivo.',
};

export default function TecnologiaPage() {
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
          {/* Hero Section */}
          <section className="pt-32 pb-20 px-6">
            <div className="max-w-4xl mx-auto text-center">
              <span className="inline-flex items-center gap-2 text-sm text-[#a0a0a8] bg-[#1a1a24] px-4 py-2 rounded-full border border-[#2a2a35] mb-8">
                <span className="w-2 h-2 bg-[#D4AF37] rounded-full animate-pulse" />
                La Ventaja Injusta
              </span>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl leading-tight mb-6 font-serif">
                Conoce a{' '}
                <span className="text-[#D4AF37]">Queswa</span>
              </h1>

              <p className="text-xl text-[#a0a0a8] mb-10 max-w-2xl mx-auto leading-relaxed">
                La inteligencia artificial que trabaja 24/7 para que tú no tengas que
                &quot;vender&quot;. El sistema que hace el 80% del trabajo que tú odias.
              </p>
            </div>
          </section>

          {/* El Problema que Resuelve */}
          <section className="py-20 px-6 bg-[#12121a]">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16">
                <span className="text-sm font-medium uppercase tracking-widest text-[#D4AF37]">
                  El Problema
                </span>
                <h2 className="text-3xl sm:text-4xl mt-4 font-serif">
                  ¿Por qué el 95% fracasa en Network Marketing?
                </h2>
              </div>

              <div className="grid md:grid-cols-2 gap-8 mb-12">
                <div className="p-6 rounded-2xl bg-[#0a0a0f] border border-[#2a2a35]">
                  <div className="text-red-400 text-4xl font-bold mb-4">#1</div>
                  <h3 className="text-xl font-semibold mb-3">&quot;No sé vender&quot;</h3>
                  <p className="text-[#a0a0a8]">
                    La mayoría de las personas odian vender. No quieren molestar amigos,
                    no saben qué decir, les da vergüenza.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-[#0a0a0f] border border-[#2a2a35]">
                  <div className="text-red-400 text-4xl font-bold mb-4">#2</div>
                  <h3 className="text-xl font-semibold mb-3">&quot;No tengo tiempo&quot;</h3>
                  <p className="text-[#a0a0a8]">
                    Entre el trabajo, la familia y otras responsabilidades,
                    no hay tiempo para hacer presentaciones constantemente.
                  </p>
                </div>
              </div>

              <div className="p-8 rounded-2xl bg-gradient-to-r from-[#1a1a24] to-[#22222e] border border-[#D4AF37]/20 text-center">
                <p className="text-xl">
                  <span className="text-[#D4AF37] font-semibold">Queswa elimina estos dos problemas de raíz.</span>
                </p>
              </div>
            </div>
          </section>

          {/* Qué es Queswa */}
          <section className="py-20 px-6">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-16">
                <span className="text-sm font-medium uppercase tracking-widest text-[#D4AF37]">
                  La Solución
                </span>
                <h2 className="text-3xl sm:text-4xl mt-4 font-serif">
                  ¿Qué hace Queswa por ti?
                </h2>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Educa 24/7 */}
                <div className="p-6 rounded-2xl bg-[#1a1a24] border border-[#2a2a35] text-center">
                  <div className="w-14 h-14 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center mx-auto mb-4">
                    <Bot className="w-7 h-7 text-[#D4AF37]" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Educa 24/7</h3>
                  <p className="text-sm text-[#a0a0a8]">Responde preguntas sobre el negocio con datos precisos mientras tú duermes.</p>
                </div>

                {/* Filtra Prospectos */}
                <div className="p-6 rounded-2xl bg-[#1a1a24] border border-[#2a2a35] text-center">
                  <div className="w-14 h-14 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center mx-auto mb-4">
                    <Target className="w-7 h-7 text-[#D4AF37]" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Filtra Prospectos</h3>
                  <p className="text-sm text-[#a0a0a8]">Identifica quién tiene interés real y quién solo tiene curiosidad pasajera.</p>
                </div>

                {/* Captura Datos */}
                <div className="p-6 rounded-2xl bg-[#1a1a24] border border-[#2a2a35] text-center">
                  <div className="w-14 h-14 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center mx-auto mb-4">
                    <BarChart3 className="w-7 h-7 text-[#D4AF37]" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Captura Datos</h3>
                  <p className="text-sm text-[#a0a0a8]">Recoge información de contacto y nivel de interés automáticamente.</p>
                </div>

                {/* Duplicación */}
                <div className="p-6 rounded-2xl bg-[#1a1a24] border border-[#2a2a35] text-center">
                  <div className="w-14 h-14 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center mx-auto mb-4">
                    <Users className="w-7 h-7 text-[#D4AF37]" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Duplicación</h3>
                  <p className="text-sm text-[#a0a0a8]">Entrena a tu equipo nuevo. La IA sabe todo lo que tú no puedes memorizar.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Cómo Funciona */}
          <section className="py-20 px-6 bg-[#12121a]">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16">
                <span className="text-sm font-medium uppercase tracking-widest text-[#D4AF37]">
                  El Proceso
                </span>
                <h2 className="text-3xl sm:text-4xl mt-4 font-serif">
                  Así trabaja Queswa
                </h2>
              </div>

              <div className="space-y-8">
                {[
                  {
                    step: '1',
                    title: 'Tú compartes un enlace',
                    description: 'Solo necesitas enviar tu link personal a quien tenga curiosidad. Sin presentaciones. Sin presión.'
                  },
                  {
                    step: '2',
                    title: 'Queswa educa y responde',
                    description: 'La IA explica el modelo, responde objeciones, muestra datos. Está entrenada con toda la información del sistema.'
                  },
                  {
                    step: '3',
                    title: 'El prospecto se autoselecciona',
                    description: 'Si tiene interés real, Queswa te avisa. Si solo era curioso, no pierdes tiempo.'
                  },
                  {
                    step: '4',
                    title: 'Tú cierras con humanos',
                    description: 'Solo hablas con personas que ya entienden el modelo y quieren más información. El trabajo pesado ya está hecho.'
                  }
                ].map((item, i) => (
                  <div key={i} className="flex gap-6 items-start">
                    <div className="w-12 h-12 rounded-full bg-[#D4AF37] flex items-center justify-center flex-shrink-0">
                      <span className="text-[#0a0a0f] font-bold text-lg">{item.step}</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                      <p className="text-[#a0a0a8]">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Comparación */}
          <section className="py-20 px-6">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16">
                <span className="text-sm font-medium uppercase tracking-widest text-[#D4AF37]">
                  La Diferencia
                </span>
                <h2 className="text-3xl sm:text-4xl mt-4 font-serif">
                  Con Queswa vs Sin Queswa
                </h2>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Sin Queswa */}
                <div className="p-8 rounded-2xl bg-[#1a1a24] border border-[#2a2a35] opacity-60">
                  <h3 className="text-xl font-semibold mb-6 text-red-400">Método Tradicional</h3>
                  <ul className="space-y-4 text-[#a0a0a8]">
                    <li className="flex items-start gap-3">
                      <X className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                      <span>Hacer presentaciones una por una</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <X className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                      <span>Memorizar respuestas a objeciones</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <X className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                      <span>Disponibilidad limitada a tu tiempo</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <X className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                      <span>Difícil de duplicar (depende de tu habilidad)</span>
                    </li>
                  </ul>
                </div>

                {/* Con Queswa */}
                <div className="p-8 rounded-2xl bg-[#1a1a24] border border-[#D4AF37]/30 shadow-lg shadow-[#D4AF37]/5">
                  <h3 className="text-xl font-semibold mb-6 text-[#D4AF37]">Con Queswa</h3>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                      <span>La IA presenta por ti, 24/7</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                      <span>Respuestas perfectas a cada objeción</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                      <span>Trabaja mientras duermes, viajas o trabajas</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                      <span>100% duplicable (tu equipo tiene lo mismo)</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Final */}
          <section className="py-20 px-6 bg-[#12121a]">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl sm:text-4xl font-serif mb-6">
                ¿Quieres experimentar Queswa?
              </h2>
              <p className="text-lg text-[#a0a0a8] mb-10">
                Únete al Reto de 5 Días y descubre cómo esta tecnología
                puede transformar tu forma de construir un activo.
              </p>

              <Link
                href="/reto-5-dias"
                className="inline-flex items-center justify-center gap-3 font-semibold text-lg px-10 py-5 rounded-xl transition-all duration-300 hover:translate-y-[-2px] hover:shadow-lg bg-[#D4AF37] text-[#0a0a0f]"
              >
                Unirme al Reto de 5 Días
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>

              <p className="text-sm mt-6 text-[#6b6b75]">
                Gratis · Sin compromiso · 5 días por WhatsApp
              </p>
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
