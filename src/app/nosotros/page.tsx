/**
 * Copyright © 2026 CreaTuActivo.com
 * Página "Manifiesto" - Memorándum Fundacional v4.0
 *
 * Objetivo: Posicionar a Luis como Arquitecto de Patrimonio, no como vendedor
 * Estructura: Buena Vista → Déficit Estructural → Falla del Vehículo → Pivote → Principios → CTA
 *
 * THE ARCHITECT'S SUITE - Bimetallic System v3.0
 * Gold (#C5A059): CTAs, highlights, key titles
 * Titanium (#94A3B8): Structural elements
 */

import Link from 'next/link';
import StrategicNavigation from '@/components/StrategicNavigation';
import { IndustrialHeader } from '@/components/IndustrialHeader';

export const metadata = {
  title: 'Manifiesto - La Búsqueda de la Soberanía | CreaTuActivo',
  description: 'De una promesa personal a la ingeniería de activos digitales. El diagnóstico técnico del porqué el esfuerzo manual no escala, y cómo usted puede auditar nuestro modelo.',
  robots: { index: false, follow: true },
};

export default function ManifiestoPage() {
  return (
    <>
      {/* Navegación estándar del sitio */}
      <StrategicNavigation />

      <main
        className="min-h-screen text-[#E5E5E5]"
        style={{
          backgroundImage: `linear-gradient(rgba(12,12,12,0.62), rgba(12,12,12,0.62)), url('/images/servilleta/hormigon-tile.webp')`,
          backgroundSize: 'cover, 600px 600px',
          backgroundRepeat: 'no-repeat, repeat',
          backgroundAttachment: 'scroll, scroll',
        }}
      >
        <div className="relative z-10">
          {/* ═══════════════════════════════════════════════════════════════
              HERO: Industrial Header
              ═══════════════════════════════════════════════════════════════ */}
          <IndustrialHeader
            title="MEMORÁNDUM DIRECTIVO"
            refCode="DOCUMENTO_FUNDACIONAL_V1"
            imageSrc="/images/header-manifiesto.jpg"
            imageAlt=""
          />

          {/* ═══════════════════════════════════════════════════════════════
              LA HISTORIA: Buena Vista → Déficit Estructural → Pivote
              ═══════════════════════════════════════════════════════════════ */}
          <article className="py-0 px-6">
            <div
              className="max-w-2xl mx-auto"
              style={{
                background: 'rgba(22, 24, 29, 0.70)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: '1px solid rgba(212, 175, 55, 0.1)',
                borderRadius: '0',
                padding: 'clamp(2rem, 5vw, 4rem)',
                marginTop: '-1rem',
                position: 'relative',
                zIndex: 10,
              }}
            >
              {/* Opening */}
              <div className="mb-20">
                <p className="text-3xl sm:text-4xl font-serif text-[#E5E5E5] leading-relaxed mb-8">
                  La arquitectura estaba fracturada.
                </p>

                <div className="prose-drop-cap space-y-6 text-lg text-[#A3A3A3] leading-relaxed">
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
                  No era por falta de esfuerzo. Mi perfil era el del &quot;buen profesional&quot;.
                  Trabajaba e invertía horas, pero mi liquidez no escalaba.
                  Operaba bajo un <span className="text-[#E5E5E5]">Déficit Estructural de Ingresos</span>.
                </p>

                <div className="p-8 bg-[#16181D] border-l-2 border-[#C5A059] my-10">
                  <p className="text-xl text-[#E5E5E5] font-serif italic">
                    Era el equivalente a correr en una cinta estática: máxima fricción operativa,
                    nulo desplazamiento financiero.
                  </p>
                </div>
              </div>

              {/* La Falla del Vehículo */}
              <div className="mb-20">
                <h2 className="text-sm uppercase tracking-[0.15em] text-[#E5C279] mb-6">
                  La Falla del Vehículo
                </h2>
                <p className="text-2xl sm:text-3xl font-serif text-[#E5E5E5] leading-relaxed mb-8">
                  El problema no era el esfuerzo. Era el vehículo.
                </p>

                <div className="space-y-6 text-lg text-[#A3A3A3] leading-relaxed">
                  <p>
                    Entendí que no importaba cuánto trabajara si el vehículo era
                    matemáticamente ineficiente.
                  </p>
                  <p>
                    Al evaluar modelos tradicionales y de comercio electrónico, detecté dos fallas
                    críticas: primero, la fricción operativa de perseguir prospectos manualmente;
                    y segundo, convertirse en el esclavo de la propia logística.
                  </p>
                </div>
              </div>

              {/* El Pivote */}
              <div className="mb-20">
                <h2 className="text-sm uppercase tracking-[0.15em] text-[#E5C279] mb-6">
                  El Pivote
                </h2>
                <p className="text-2xl sm:text-3xl font-serif text-[#E5E5E5] leading-relaxed mb-8">
                  La Reingeniería
                </p>

                <div className="space-y-6 text-lg text-[#A3A3A3] leading-relaxed">
                  <p>
                    La obsesión se convirtió en una pregunta técnica: ¿Existe una forma de construir
                    un activo que tenga la logística de una multinacional pero la libertad de un
                    inversionista?
                  </p>

                  <div className="p-8 bg-[#16181D] border border-[#C5A059]/20 my-10">
                    <p className="text-xl text-[#E5E5E5] font-serif text-center">
                      La solución no era convertirse en un mejor vendedor,
                      <br />
                      sino en un
                      <span className="text-[#E5C279]"> Arquitecto de Patrimonio</span>.
                    </p>
                  </div>

                  <p>
                    Hoy, dirijo CreaTuActivo, una firma de educación e implementación
                    donde transferimos protocolos de ingeniería financiera a quienes comprenden que operar bajo el Protocolo de la Presencia Obligada es estructuralmente insostenible, para:
                  </p>
                </div>

                <ul className="space-y-4 my-8 text-lg">
                  <li className="flex items-start gap-4">
                    <span className="text-[#E5C279] text-xl mt-0.5">1</span>
                    <span className="text-[#E5E5E5]">
                      Utilizar infraestructuras existentes para eliminar el riesgo logístico.
                    </span>
                  </li>
                  <li className="flex items-start gap-4">
                    <span className="text-[#E5C279] text-xl mt-0.5">2</span>
                    <span className="text-[#E5E5E5]">
                      Utilizar sistemas digitales para eliminar la fricción operativa.
                    </span>
                  </li>
                  <li className="flex items-start gap-4">
                    <span className="text-[#E5C279] text-xl mt-0.5">3</span>
                    <span className="text-[#E5E5E5]">
                      Construir flujos de caja que no dependan de su reloj.
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </article>

          {/* ═══════════════════════════════════════════════════════════════
              PRINCIPIOS OPERATIVOS
              ═══════════════════════════════════════════════════════════════ */}
          <section className="py-20 px-6" style={{ background: 'rgba(16,18,22,0.75)', backdropFilter: 'blur(6px)' }}>
            <div className="max-w-3xl mx-auto">
              <h2 className="text-sm uppercase tracking-[0.15em] text-[#E5C279] mb-4 text-center">
                Nuestros Principios Operativos
              </h2>
              <p className="text-2xl sm:text-3xl font-serif text-[#E5E5E5] mb-16 text-center">
                Lo que creemos (y no negociamos)
              </p>

              <div className="space-y-12">
                {/* Principio 1 */}
                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-12 h-12 border border-[#C5A059]/30 flex items-center justify-center">
                    <span className="text-[#E5C279] font-serif text-lg">01</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-serif text-[#E5E5E5] mb-2">Matemática sobre Motivación</h3>
                    <p className="text-[#A3A3A3] leading-relaxed">
                      No operamos bajo persuasión ni promesas vacías. Hablamos de datos y amortización.
                      Si una proyección no puede sostenerse matemáticamente, es especulación.
                    </p>
                  </div>
                </div>

                {/* Principio 2 */}
                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-12 h-12 border border-[#C5A059]/30 flex items-center justify-center">
                    <span className="text-[#E5C279] font-serif text-lg">02</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-serif text-[#E5E5E5] mb-2">Apalancamiento Tecnológico</h3>
                    <p className="text-[#A3A3A3] leading-relaxed">
                      Si su infraestructura depende de su carisma o presencia física, no es escalable.
                      El sistema asume el 90% del desgaste operativo; usted aporta la dirección estratégica.
                    </p>
                  </div>
                </div>

                {/* Principio 3 */}
                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-12 h-12 border border-[#C5A059]/30 flex items-center justify-center">
                    <span className="text-[#E5C279] font-serif text-lg">03</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-serif text-[#E5E5E5] mb-2">Soberanía de Tiempo</h3>
                    <p className="text-[#A3A3A3] leading-relaxed">
                      Si su fuente de ingresos le resta capacidad para cumplir sus promesas personales,
                      es una vulnerabilidad patrimonial. El activo debe trabajar para usted, no al revés.
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
                No estoy aquí para persuadirle.
              </p>

              <div className="p-8 bg-[#16181D] border border-[#C5A059]/20 mb-12">
                <p className="text-[#A3A3A3] mb-6 leading-relaxed">
                  Nuestra Dirección invierte tiempo exclusivamente en perfiles que comprenden
                  que el Déficit Estructural de Ingresos es insostenible. Si usted desea auditar
                  los planos exactos de cómo construimos estas infraestructuras sin inventarios
                  físicos propios y sin fricción manual, hemos liberado nuestra evaluación técnica.
                </p>
                <p className="text-[#E5E5E5] font-medium">
                  Es la condensación de 14 años de ingeniería de negocios.
                </p>
              </div>

              <Link
                href="/auditoria-patrimonial"
                className="inline-flex items-center justify-center gap-3 font-semibold text-lg px-12 py-5 transition-all duration-300 hover:translate-y-[-2px] bg-[#F59E0B] text-[#0B0C0C]"
                style={{
                  clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)',
                }}
              >
                SOLICITAR AUDITORÍA TÉCNICA →
              </Link>

              <p className="text-sm mt-6 text-[#6B7280]">
                5 Días · Subvencionado · Escrutinio Técnico
              </p>
            </div>
          </section>

          {/* Footer mínimo */}
          <footer className="px-6 py-10 border-t border-[rgba(229, 194, 121, 0.1)]">
            <div className="max-w-5xl mx-auto text-center">
              <p className="text-sm text-[#6B7280]">
                © 2026 CreaTuActivo.com ·
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
