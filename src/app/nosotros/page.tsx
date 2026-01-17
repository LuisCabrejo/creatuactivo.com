/**
 * Copyright © 2025 CreaTuActivo.com
 * Página "Manifiesto" - El Arquitecto de Activos
 *
 * Objetivo: Vender al Guía (Luis) para vender el Destino (Libertad)
 * Estructura: Gancho filosófico → Historia Buena Vista → Pivote → Principios → CTA
 *
 * NO es un CV. Es una Squeeze Page disfrazada de "Sobre Nosotros".
 */

import Link from 'next/link';
import StrategicNavigation from '@/components/StrategicNavigation';

export const metadata = {
  title: 'Manifiesto - La Búsqueda de la Soberanía | CreaTuActivo',
  description: 'De las promesas rotas en un mirador a la arquitectura de activos digitales. Por qué dejé de trabajar para vivir y cómo puedes hacerlo tú también.',
  robots: { index: false, follow: true },
};

export default function ManifiestoPage() {
  return (
    <>
      <StrategicNavigation />
      <main className="min-h-screen bg-[#0F1115] text-[#E5E5E5]">
        {/* Subtle gradient - Quiet Luxury */}
        <div
          className="fixed inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at 50% 0%, rgba(197, 160, 89, 0.06) 0%, transparent 60%)'
          }}
        />

        <div className="relative z-10">
          {/* ═══════════════════════════════════════════════════════════════
              HERO: El Gancho Filosófico
              ═══════════════════════════════════════════════════════════════ */}
          <section className="pt-32 pb-20 px-6">
            <div className="max-w-3xl mx-auto">
              {/* Badge sutil */}
              <div className="flex justify-center mb-12">
                <span className="text-xs uppercase tracking-[0.2em] text-[#C5A059]">
                  Manifiesto
                </span>
              </div>

              {/* Headline filosófico */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl leading-[1.1] mb-8 font-serif text-center">
                La búsqueda de la
                <br />
                <span className="text-[#C5A059]">Soberanía</span>
              </h1>

              {/* Subhead - La promesa */}
              <p className="text-xl sm:text-2xl text-[#A3A3A3] text-center leading-relaxed max-w-2xl mx-auto font-light">
                De las promesas rotas en un mirador
                <br className="hidden sm:block" />
                a la arquitectura de activos digitales.
              </p>
            </div>
          </section>

          {/* ═══════════════════════════════════════════════════════════════
              LA HISTORIA: Buena Vista (Evolución de Consciencia)
              ═══════════════════════════════════════════════════════════════ */}
          <article className="py-16 px-6">
            <div className="max-w-2xl mx-auto">
              {/* Opening */}
              <div className="mb-20">
                <p className="text-3xl sm:text-4xl font-serif text-[#E5E5E5] leading-relaxed mb-8">
                  El algoritmo estaba roto.
                </p>

                <div className="space-y-6 text-lg text-[#A3A3A3] leading-relaxed">
                  <p>
                    Hace años, llevé a mi novia (hoy mi esposa) a un lugar llamado Buena Vista.
                    Mirando al horizonte, le hice tres promesas: una casa de campo,
                    compras sin mirar el precio, y tres hijos.
                  </p>
                  <p>
                    Catorce años después, la matemática de mi vida no cuadraba.
                    <span className="text-[#E5E5E5]"> Solo había cumplido con los hijos.</span>
                  </p>
                </div>
              </div>

              {/* La Cinta Estática */}
              <div className="mb-20">
                <p className="text-lg text-[#A3A3A3] leading-relaxed mb-6">
                  No era por falta de esfuerzo. Yo era el prototipo del &quot;buen profesional&quot;.
                  Trabajaba, ahorraba, invertía horas... pero mi cuenta bancaria y mi libertad
                  no crecían al mismo ritmo que mi estrés.
                </p>

                <div className="p-8 rounded-xl bg-[#1A1D23] border-l-2 border-[#C5A059] my-10">
                  <p className="text-xl text-[#E5E5E5] font-serif italic">
                    Estaba corriendo en una cinta estática: mucho sudor, cero desplazamiento.
                  </p>
                </div>
              </div>

              {/* La Primera Epifanía */}
              <div className="mb-20">
                <h2 className="text-sm uppercase tracking-[0.15em] text-[#C5A059] mb-6">
                  La Primera Epifanía
                </h2>
                <p className="text-2xl sm:text-3xl font-serif text-[#E5E5E5] leading-relaxed mb-8">
                  El &quot;Qué&quot; vs. El &quot;Cómo&quot;
                </p>

                <div className="space-y-6 text-lg text-[#A3A3A3] leading-relaxed">
                  <p>
                    Entendí que no importaba cuánto trabajara si el vehículo era incorrecto.
                    Un Ferrari en un embotellamiento avanza más lento que una bicicleta en campo abierto.
                  </p>
                  <p>
                    Probé el modelo tradicional de distribución. Me fue bien financieramente
                    (llegué al 1%), pero fallé en lo vital:
                    <span className="text-[#E5E5E5]"> Libertad.</span>
                    Me convertí en un esclavo de mi propio teléfono, persiguiendo gente.
                  </p>
                  <p>
                    Probé el E-commerce. Me fue bien en ventas, pero fallé en lo vital:
                    <span className="text-[#E5E5E5]"> Paz Mental.</span>
                    Me convertí en un esclavo de la logística, las aduanas y los algoritmos publicitarios.
                  </p>
                </div>
              </div>

              {/* La Reingeniería */}
              <div className="mb-20">
                <h2 className="text-sm uppercase tracking-[0.15em] text-[#C5A059] mb-6">
                  El Pivote
                </h2>
                <p className="text-2xl sm:text-3xl font-serif text-[#E5E5E5] leading-relaxed mb-8">
                  La Reingeniería
                </p>

                <div className="space-y-6 text-lg text-[#A3A3A3] leading-relaxed">
                  <p>
                    Me di cuenta de que la verdadera riqueza no es el dinero;
                    es el <span className="text-[#C5A059] font-medium">Apalancamiento</span>.
                  </p>
                  <p>
                    Me obsesioné con una pregunta: ¿Existe una forma de construir un activo
                    que tenga la logística de una multinacional pero la libertad de un inversionista?
                  </p>

                  <div className="p-8 rounded-xl bg-[#1A1D23] border border-[#C5A059]/20 my-10">
                    <p className="text-xl text-[#E5E5E5] font-serif text-center">
                      La respuesta fue dejar de ser un &quot;vendedor&quot;
                      <br />
                      y convertirme en un
                      <span className="text-[#C5A059]"> Arquitecto de Activos</span>.
                    </p>
                  </div>

                  <p>
                    Hoy, dirijo CreaTuActivo, una firma de educación e implementación
                    donde enseñamos a profesionales a:
                  </p>
                </div>

                <ul className="space-y-4 my-8 text-lg">
                  <li className="flex items-start gap-4">
                    <span className="text-[#C5A059] text-xl mt-0.5">1</span>
                    <span className="text-[#E5E5E5]">
                      Utilizar infraestructuras existentes para eliminar el riesgo logístico.
                    </span>
                  </li>
                  <li className="flex items-start gap-4">
                    <span className="text-[#C5A059] text-xl mt-0.5">2</span>
                    <span className="text-[#E5E5E5]">
                      Utilizar sistemas digitales para eliminar el rechazo social.
                    </span>
                  </li>
                  <li className="flex items-start gap-4">
                    <span className="text-[#C5A059] text-xl mt-0.5">3</span>
                    <span className="text-[#E5E5E5]">
                      Construir flujos de caja que no dependan de su reloj.
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </article>

          {/* ═══════════════════════════════════════════════════════════════
              PRINCIPIOS OPERATIVOS (No Misión/Visión genérica)
              ═══════════════════════════════════════════════════════════════ */}
          <section className="py-20 px-6 bg-[#1A1D23]">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-sm uppercase tracking-[0.15em] text-[#C5A059] mb-4 text-center">
                Nuestros Principios Operativos
              </h2>
              <p className="text-2xl sm:text-3xl font-serif text-[#E5E5E5] mb-16 text-center">
                Lo que creemos (y no negociamos)
              </p>

              <div className="space-y-12">
                {/* Principio 1 */}
                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full border border-[#C5A059]/30 flex items-center justify-center">
                    <span className="text-[#C5A059] font-serif text-lg">01</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-serif text-[#E5E5E5] mb-2">Cero Hype</h3>
                    <p className="text-[#A3A3A3] leading-relaxed">
                      No vendemos sueños falsos. Hablamos de matemáticas y sistemas.
                      Si no puedes explicarlo con números, probablemente sea humo.
                    </p>
                  </div>
                </div>

                {/* Principio 2 */}
                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full border border-[#C5A059]/30 flex items-center justify-center">
                    <span className="text-[#C5A059] font-serif text-lg">02</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-serif text-[#E5E5E5] mb-2">Tecnología sobre Talento</h3>
                    <p className="text-[#A3A3A3] leading-relaxed">
                      Si el negocio depende de que seas carismático, no es duplicable.
                      El sistema debe hacer el trabajo pesado, no tu personalidad.
                    </p>
                  </div>
                </div>

                {/* Principio 3 */}
                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full border border-[#C5A059]/30 flex items-center justify-center">
                    <span className="text-[#C5A059] font-serif text-lg">03</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-serif text-[#E5E5E5] mb-2">La Familia Primero</h3>
                    <p className="text-[#A3A3A3] leading-relaxed">
                      Si el negocio te quita tiempo para cenar con tus hijos
                      (o cumplir tus promesas), es un mal negocio. Punto.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ═══════════════════════════════════════════════════════════════
              CTA: Squeeze Page Disfrazada
              ═══════════════════════════════════════════════════════════════ */}
          <section className="py-24 px-6">
            <div className="max-w-2xl mx-auto text-center">
              <p className="text-2xl sm:text-3xl font-serif text-[#E5E5E5] mb-8 leading-relaxed">
                No estoy aquí para convencerte.
              </p>

              <p className="text-lg text-[#A3A3A3] mb-12 leading-relaxed">
                Ya pasé la etapa de &quot;perseguir&quot;. Hoy, dedico mi tiempo a construir
                con aquellos que entienden que el &quot;Plan por Defecto&quot; ha caducado.
              </p>

              <div className="p-8 rounded-2xl bg-[#1A1D23] border border-[#C5A059]/20 mb-12">
                <p className="text-[#A3A3A3] mb-6">
                  Si quieres ver los planos exactos de cómo construimos estos activos
                  sin inventarios y sin perseguir amigos, he preparado un entrenamiento de 5 días.
                </p>
                <p className="text-[#E5E5E5] font-medium">
                  Es la condensación de 14 años de prueba y error.
                </p>
              </div>

              <Link
                href="/reto-5-dias"
                className="inline-flex items-center justify-center gap-3 font-semibold text-lg px-12 py-5 rounded-xl transition-all duration-300 hover:translate-y-[-2px] bg-[#C5A059] text-[#0F1115]"
              >
                Ver los Planos
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>

              <p className="text-sm mt-6 text-[#6B7280]">
                5 días · Gratis · Sin compromiso
              </p>
            </div>
          </section>

          {/* Footer mínimo */}
          <footer className="px-6 py-10 border-t border-[rgba(197, 160, 89, 0.1)]">
            <div className="max-w-5xl mx-auto text-center">
              <p className="text-sm text-[#6B7280]">
                © 2025 CreaTuActivo.com ·
                <Link href="/privacidad" className="hover:text-[#A3A3A3] ml-2">
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
