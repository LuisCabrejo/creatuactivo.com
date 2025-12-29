/**
 * Copyright © 2025 CreaTuActivo.com
 * Página "Acerca de" - Epiphany Bridge Story
 *
 * Estructura basada en investigación "Páginas Definitivas y Estrategia de Funnel"
 * Sección 5.1, Punto 2: La historia completa para conexión emocional
 *
 * Objetivo: Que el lector diga "Él es como yo, pero está donde yo quiero estar"
 */

import Link from 'next/link';
import StrategicNavigation from '@/components/StrategicNavigation';

export const metadata = {
  title: 'Mi Historia - De Empleado Exitoso a Arquitecto de Activos | CreaTuActivo',
  description: 'Conoce la historia de Luis Cabrejo: 20 años de éxito corporativo, la quiebra a los 40, y el descubrimiento del sistema que cambió todo. La misión de 4 millones de familias.',
  robots: { index: false, follow: true }, // SEO en página personal Luis Cabrejo Parra
};

export default function NosotrosPage() {
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
            <div className="max-w-3xl mx-auto text-center">
              <span className="inline-flex items-center gap-2 text-sm text-[#a0a0a8] bg-[#1a1a24] px-4 py-2 rounded-full border border-[#2a2a35] mb-8">
                <span className="w-2 h-2 bg-[#D4AF37] rounded-full" />
                Mi Historia
              </span>

              <h1 className="text-4xl sm:text-5xl leading-tight mb-6 font-serif">
                A los 40 años descubrí que había
                <br />
                <span className="text-[#D4AF37]">comprado un empleo</span>
              </h1>

              <p className="text-xl text-[#a0a0a8] max-w-2xl mx-auto leading-relaxed">
                No construido un activo. Esta es la historia de cómo encontré el camino
                que me hubiera ahorrado 20 años de esfuerzo mal direccionado.
              </p>
            </div>
          </section>

          {/* Story Content */}
          <article className="py-12 px-6">
            <div className="max-w-3xl mx-auto">
              {/* Chapter 1: El Éxito Aparente */}
              <section className="mb-16">
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-4xl font-bold text-[#D4AF37]/30">01</span>
                  <h2 className="text-2xl font-serif">El &quot;éxito&quot; que todos querían</h2>
                </div>

                <div className="prose prose-invert max-w-none space-y-4 text-[#a0a0a8] leading-relaxed">
                  <p>
                    Durante 20 años hice todo lo que se supone que debía hacer. Estudié,
                    me especialicé, trabajé más que nadie. Llegué a posiciones directivas
                    en empresas multinacionales del sector automotriz.
                  </p>
                  <p>
                    Tenía el cargo, el salario, el reconocimiento. Mis padres estaban orgullosos.
                    Mis amigos me veían como el ejemplo a seguir.
                    <span className="text-[#f5f5f5] font-medium"> El problema: yo era el motor.</span>
                  </p>
                  <p>
                    Si me detenía, todo paraba. Cada promoción significaba más responsabilidad,
                    más horas, menos tiempo. Había comprado una jaula de oro y me había
                    convencido de que era libertad.
                  </p>
                </div>
              </section>

              {/* Chapter 2: El Despertar */}
              <section className="mb-16">
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-4xl font-bold text-[#D4AF37]/30">02</span>
                  <h2 className="text-2xl font-serif">El golpe de realidad</h2>
                </div>

                <div className="prose prose-invert max-w-none space-y-4 text-[#a0a0a8] leading-relaxed">
                  <p>
                    A los 40 todo cambió. No importan los detalles—puede ser una enfermedad,
                    un recorte de personal, una crisis económica. El resultado es el mismo:
                    de un día para otro, descubres que no tienes nada.
                  </p>

                  <div className="p-6 rounded-xl bg-[#12121a] border border-red-500/20 my-8">
                    <p className="text-lg text-[#f5f5f5] italic">
                      &quot;Todo lo que había construido en 20 años dependía de mi presencia.
                      Sin mí trabajando, el ingreso era cero.&quot;
                    </p>
                  </div>

                  <p>
                    Fue devastador. Pero también fue el despertar que necesitaba.
                    Por primera vez me hice la pregunta correcta: ¿Qué pasaría con mis
                    ingresos si dejo de trabajar por 6 meses?
                  </p>
                  <p>
                    La respuesta era obvia y aterradora.
                    <span className="text-[#f5f5f5] font-medium"> No tenía activos. Tenía un empleo disfrazado de éxito.</span>
                  </p>
                </div>
              </section>

              {/* Chapter 3: El Descubrimiento */}
              <section className="mb-16">
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-4xl font-bold text-[#D4AF37]/30">03</span>
                  <h2 className="text-2xl font-serif">El plan oculto</h2>
                </div>

                <div className="prose prose-invert max-w-none space-y-4 text-[#a0a0a8] leading-relaxed">
                  <p>
                    Empecé a estudiar cómo se construye riqueza real. No la riqueza de
                    aparentar, sino la que sigue generando cuando tú no estás.
                  </p>
                  <p>
                    Descubrí que las personas verdaderamente libres tienen algo en común:
                    <span className="text-[#f5f5f5] font-medium"> no dependen de su tiempo para generar ingresos.</span>
                  </p>
                  <p>
                    Pero la mayoría de los caminos hacia esa libertad—bienes raíces,
                    dividendos, negocios propios—requieren capital significativo o
                    décadas de acumulación.
                  </p>
                  <p>
                    Hasta que encontré un modelo diferente. Uno que combina:
                  </p>
                  <ul className="space-y-2 my-4">
                    <li className="flex items-start gap-2">
                      <span className="text-[#D4AF37] mt-1">→</span>
                      <span>Una empresa global de 28+ años con infraestructura en 60+ países</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#D4AF37] mt-1">→</span>
                      <span>Productos de consumo recurrente (no ventas de una vez)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#D4AF37] mt-1">→</span>
                      <span>Tecnología de IA que hace el trabajo pesado</span>
                    </li>
                  </ul>
                </div>
              </section>

              {/* Chapter 4: La Construcción */}
              <section className="mb-16">
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-4xl font-bold text-[#D4AF37]/30">04</span>
                  <h2 className="text-2xl font-serif">CreaTuActivo</h2>
                </div>

                <div className="prose prose-invert max-w-none space-y-4 text-[#a0a0a8] leading-relaxed">
                  <p>
                    Hoy lidero una organización de más de 800 personas en varios países.
                    Pero más importante que los números es esto:
                    <span className="text-[#f5f5f5] font-medium"> mi ingreso no depende de mi tiempo.</span>
                  </p>
                  <p>
                    He construido lo que llamo una &quot;Arquitectura de Activos&quot;—un sistema
                    que genera mientras duermo, viajo, o simplemente vivo mi vida.
                  </p>
                  <p>
                    CreaTuActivo nace de una convicción: nadie debería tener que descubrir
                    esto a los 40 años, después de haber perdido dos décadas en el camino equivocado.
                  </p>
                </div>
              </section>

              {/* Chapter 5: La Misión */}
              <section className="mb-16">
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-4xl font-bold text-[#D4AF37]/30">05</span>
                  <h2 className="text-2xl font-serif">La misión de 4 millones</h2>
                </div>

                <div className="p-8 rounded-2xl bg-[#12121a] border border-[#D4AF37]/20">
                  <p className="text-xl text-[#f5f5f5] font-serif mb-4 text-center">
                    &quot;Ayudar a 4 millones de familias hispanas a construir
                    <span className="text-[#D4AF37]"> activos que generen sin su presencia constante.</span>&quot;
                  </p>
                  <p className="text-[#a0a0a8] text-center">
                    No prometo riqueza rápida. No vendo sueños. Ofrezco un sistema probado,
                    mentoría real, y tecnología que hace posible lo que antes solo podían
                    lograr los que tenían capital o conexiones.
                  </p>
                </div>
              </section>

              {/* Stats */}
              <section className="mb-16">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-6 rounded-xl bg-[#12121a] border border-[#2a2a35] text-center">
                    <p className="text-3xl font-bold text-[#D4AF37]">20+</p>
                    <p className="text-sm text-[#6b6b75]">Años en liderazgo corporativo</p>
                  </div>
                  <div className="p-6 rounded-xl bg-[#12121a] border border-[#2a2a35] text-center">
                    <p className="text-3xl font-bold text-[#D4AF37]">800+</p>
                    <p className="text-sm text-[#6b6b75]">Personas en la organización</p>
                  </div>
                  <div className="p-6 rounded-xl bg-[#12121a] border border-[#2a2a35] text-center">
                    <p className="text-3xl font-bold text-[#D4AF37]">#1</p>
                    <p className="text-sm text-[#6b6b75]">De su upline directo</p>
                  </div>
                  <div className="p-6 rounded-xl bg-[#12121a] border border-[#2a2a35] text-center">
                    <p className="text-3xl font-bold text-[#D4AF37]">4M</p>
                    <p className="text-sm text-[#6b6b75]">Familias: la meta</p>
                  </div>
                </div>
              </section>
            </div>
          </article>

          {/* CTA */}
          <section className="py-20 px-6 bg-[#12121a]">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-2xl sm:text-3xl font-serif mb-6">
                ¿Te suena familiar esta historia?
              </h2>
              <p className="text-[#a0a0a8] mb-8">
                Si sientes que estás trabajando duro pero no construyendo nada duradero,
                el Reto de 5 Días te mostrará una alternativa. Sin compromiso.
              </p>
              <Link
                href="/reto-5-dias"
                className="inline-flex items-center justify-center gap-3 font-semibold text-lg px-10 py-5 rounded-xl transition-all duration-300 hover:translate-y-[-2px] hover:shadow-lg bg-[#D4AF37] text-[#0a0a0f]"
              >
                Empezar el Reto de 5 Días
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <p className="text-sm mt-6 text-[#6b6b75]">
                Gratis · 5 días por WhatsApp · Sin presión
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
