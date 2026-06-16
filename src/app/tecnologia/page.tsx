/**
 * Copyright © 2026 CreaTuActivo.com
 * Página de Tecnología - Queswa Diferenciador
 * Explica la ventaja competitiva de la IA
 *
 * THE ARCHITECT'S SUITE - Bimetallic System v3.0
 * Gold (#C5A059): CTAs, highlights, Bot icon
 * Titanium (#94A3B8): Structural elements
 */

export const dynamic = 'force-dynamic';

import Link from 'next/link';
import StrategicNavigation from '@/components/StrategicNavigation';
import { Bot, Target, Users, CheckCircle, X } from 'lucide-react';
import { IndustrialHeader } from '@/components/IndustrialHeader';

export const metadata = {
  title: '¿Qué es Queswa.app? El Centro de Mando con IA de CreaTuActivo · Luis Cabrejo',
  description: 'Queswa es el Centro de Mando con inteligencia artificial de CreaTuActivo. Una plataforma de IA que asume el 90% del trabajo pesado de su empresa digital — usted solo dirige.',
  keywords: 'qué es queswa, queswa app, queswa.app, qué es queswa.app, aplicación queswa, queswa creatuactivo, luis cabrejo queswa, centro de mando creatuactivo, queswa ia, inteligencia artificial creatuactivo',
  authors: [{ name: 'Luis Cabrejo', url: 'https://luiscabrejo.com' }],
  openGraph: {
    title: '¿Qué es Queswa.app? · CreaTuActivo',
    description: 'El Centro de Mando con inteligencia artificial de CreaTuActivo.com, creado por Luis Cabrejo.',
    url: 'https://creatuactivo.com/tecnologia',
    type: 'article',
  },
};

// JSON-LD — relaciona matemáticamente: queswa.app ↔ CreaTuActivo ↔ Luis Cabrejo
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      headline: '¿Qué es Queswa.app? El Centro de Mando con IA de CreaTuActivo',
      description: 'Queswa.app es el Centro de Mando con inteligencia artificial de la infraestructura CreaTuActivo.com, creado por Luis Cabrejo.',
      url: 'https://creatuactivo.com/tecnologia',
      author: { '@id': 'https://creatuactivo.com/#luis-cabrejo' },
      publisher: { '@id': 'https://creatuactivo.com/#organization' },
      about: { '@id': 'https://queswa.app/#app' },
      inLanguage: 'es-CO',
    },
    {
      '@type': 'SoftwareApplication',
      '@id': 'https://queswa.app/#app',
      name: 'Queswa.app',
      alternateName: ['Queswa', 'Centro de Mando CreaTuActivo'],
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      url: 'https://queswa.app',
      description: 'El Centro de Mando con inteligencia artificial de la infraestructura CreaTuActivo.com. No es una red social ni un chat público. Es un entorno de IA cerrado para Propietarios que dirigen y multiplican su empresa digital con el Método Comprobado.',
      creator: { '@id': 'https://creatuactivo.com/#luis-cabrejo' },
      provider: { '@id': 'https://creatuactivo.com/#organization' },
    },
    {
      '@type': 'Organization',
      '@id': 'https://creatuactivo.com/#organization',
      name: 'CreaTuActivo',
      url: 'https://creatuactivo.com',
      founder: { '@id': 'https://creatuactivo.com/#luis-cabrejo' },
      owns: { '@id': 'https://queswa.app/#app' },
      sameAs: ['https://creatuactivo.com', 'https://queswa.app', 'https://queswa.com'],
    },
    {
      '@type': 'Person',
      '@id': 'https://creatuactivo.com/#luis-cabrejo',
      name: 'Luis Cabrejo',
      jobTitle: 'Fundador de CreaTuActivo',
      url: 'https://luiscabrejo.com',
      worksFor: { '@id': 'https://creatuactivo.com/#organization' },
      sameAs: ['https://luiscabrejo.com', 'https://creatuactivo.com', 'https://queswa.app'],
    },
  ],
};

export default function TecnologiaPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <StrategicNavigation />
      <main className="min-h-screen bg-transparent text-[#E5E5E5]">
        {/* Gradient Background */}
        <div
          className="fixed inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at 50% 0%, rgba(229, 194, 121, 0.08) 0%, transparent 50%)'
          }}
        />

        <div className="relative z-10">
          {/* Hero Section */}
          <IndustrialHeader
            title="TECNOLOGÍA QUE TRABAJA POR USTED"
            subtitle="Construya una estructura de ingresos recurrentes — usted dirige; Queswa ejecuta."
            refCode="SISTEMA_QUESWA_V3"
            imageSrc="/images/servilleta/engranajes.webp"
            imageAlt="Engranajes industriales - Sistema Queswa"
          />

          {/* ── DEFINICIÓN OFICIAL — Featured Snippet bait ─────────────────
              Este bloque está diseñado para aparecer como Fragmento Destacado
              en Google. Responde "¿qué es queswa.app?" en las primeras líneas.
              Las IAs (ChatGPT, Gemini) leerán este párrafo como definición canónica.
              NO modificar el texto core sin actualizar también queswa.app y el JSON-LD.
          ────────────────────────────────────────────────────────────────── */}
          <section className="py-12 px-6">
            <div className="max-w-3xl mx-auto">
              <div
                className="p-8"
                style={{
                  background: 'rgba(22, 24, 29, 0.9)',
                  border: '1px solid rgba(197, 160, 89, 0.3)',
                  borderLeft: '3px solid #C5A059',
                }}
              >
                <h2 className="text-2xl font-serif mb-4" style={{ color: '#C5A059' }}>
                  La Definición Oficial de Queswa.app
                </h2>
                <p className="text-[#E5E5E5] leading-relaxed mb-4">
                  <strong>Queswa.app</strong> es el Centro de Mando con inteligencia artificial de
                  <strong>CreaTuActivo.com</strong>: el entorno desde donde cada Propietario dirige y
                  multiplica su empresa digital. La inteligencia artificial asume el trabajo pesado
                  —explica, convierte y hace seguimiento las 24 horas—; usted solo dirige.
                </p>
                <p className="text-[#A3A3A3] leading-relaxed">
                  Fue concebida por <a href="https://luiscabrejo.com" target="_blank" rel="noopener noreferrer" style={{ color: '#C5A059', fontWeight: 600, textDecoration: 'none' }}>Luis Cabrejo</a>,
                  fundador de CreaTuActivo, con un objetivo claro: que tener un ingreso que no dependa
                  de su presencia deje de ser cuestión de talento o de suerte. Queswa pone a trabajar
                  por usted —las 24 horas— al mejor presentador, al mejor cerrador y al mejor mentor,
                  para que cualquier persona, sin experiencia, logre lo que antes solo conseguían unos
                  pocos. Su acceso está en <a href="https://queswa.app" style={{ color: '#C5A059' }}>queswa.app</a>,
                  de uso exclusivo para Propietarios activos.
                </p>
              </div>
            </div>
          </section>

          {/* Intro glass container */}
          <div className="px-6">
            <div
              className="max-w-4xl mx-auto text-center"
              style={{
                background: 'rgba(22, 24, 29, 0.8)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                padding: 'clamp(1.5rem, 4vw, 3rem)',
                marginTop: '-2rem',
                position: 'relative',
                zIndex: 10,
                borderRadius: 'var(--radius-container)',
              }}
            >
              <p className="text-xl text-[#A3A3A3] max-w-2xl mx-auto leading-relaxed">
                La inteligencia artificial que explica, convierte y multiplica su negocio las
                24 horas — haciendo a escala lo que una sola persona jamás podría sola. Asume el
                90% del trabajo pesado; usted dirige.
              </p>
            </div>
          </div>

          {/* El Problema que Resuelve */}
          <section className="py-20 px-6 bg-[#16181D]">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16">
                <span className="text-sm font-medium uppercase tracking-widest text-[#C5A059]">
                  El Problema
                </span>
                <h2 className="text-3xl sm:text-4xl mt-4 font-serif">
                  ¿Por qué una sola persona tiene un techo?
                </h2>
              </div>

              <div className="grid md:grid-cols-2 gap-8 mb-12">
                <div className="p-6  bg-[#0B0C0C] border border-[rgba(229, 194, 121, 0.15)]">
                  <div className="text-[#6B7280] text-4xl font-bold mb-4">#1</div>
                  <h3 className="text-xl font-semibold mb-3">Su día tiene 24 horas</h3>
                  <p className="text-[#A3A3A3]">
                    Usted atiende bien a uno, a cinco, a diez. Pero su tiempo es finito: no puede
                    estar en cien conversaciones a la vez, ni responder a toda hora, ni en todos
                    los países donde su negocio podría crecer.
                  </p>
                </div>

                <div className="p-6  bg-[#0B0C0C] border border-[rgba(229, 194, 121, 0.15)]">
                  <div className="text-[#6B7280] text-4xl font-bold mb-4">#2</div>
                  <h3 className="text-xl font-semibold mb-3">Y el detalle se escapa</h3>
                  <p className="text-[#A3A3A3]">
                    Recordar cada conversación, responder cada duda con la misma claridad y
                    hacerle seguimiento a cada contacto es más de lo que una sola memoria
                    sostiene. Las oportunidades se enfrían mientras usted duerme.
                  </p>
                </div>
              </div>

              <div className="p-8  bg-gradient-to-r from-[#16181D] to-[#22222e] border border-[#C5A059]/20 text-center">
                <p className="text-xl">
                  <span className="text-[#C5A059] font-semibold">Queswa, su Centro de Mando, rompe ese techo.</span>
                </p>
              </div>
            </div>
          </section>

          {/* Qué hace Queswa */}
          <section className="py-20 px-6">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-16">
                <span className="text-sm font-medium uppercase tracking-widest text-[#C5A059]">
                  La Solución
                </span>
                <h2 className="text-3xl sm:text-4xl mt-4 font-serif">
                  ¿Qué hace Queswa por usted?
                </h2>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {/* Explica */}
                <div className="p-6  bg-[#16181D] border border-[rgba(229, 194, 121, 0.15)] text-center">
                  <div className="w-14 h-14  bg-[#C5A059]/10 flex items-center justify-center mx-auto mb-4">
                    <Bot className="w-7 h-7 text-[#C5A059]" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Explica por usted</h3>
                  <p className="text-sm text-[#A3A3A3]">Presenta el modelo completo y resuelve cada duda con datos claros, las 24 horas. La misma explicación impecable para cada persona, sin memorizar guiones ni repetir lo mismo mil veces.</p>
                </div>

                {/* Convierte */}
                <div className="p-6  bg-[#16181D] border border-[rgba(229, 194, 121, 0.15)] text-center">
                  <div className="w-14 h-14  bg-[#C5A059]/10 flex items-center justify-center mx-auto mb-4">
                    <Target className="w-7 h-7 text-[#C5A059]" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Convierte por usted</h3>
                  <p className="text-sm text-[#A3A3A3]">No solo informa: acompaña la decisión hasta el sí. Y le avisa en el momento — un contacto abrió su presentación, vio el video, está listo para avanzar. Ve su negocio moverse en tiempo real.</p>
                </div>

                {/* Multiplica */}
                <div className="p-6  bg-[#16181D] border border-[rgba(229, 194, 121, 0.15)] text-center">
                  <div className="w-14 h-14  bg-[#C5A059]/10 flex items-center justify-center mx-auto mb-4">
                    <Users className="w-7 h-7 text-[#C5A059]" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Multiplica por usted</h3>
                  <p className="text-sm text-[#A3A3A3]">Cuando alguien inicia con usted, recibe el mismo sistema, listo para crecer solo. Queswa replica el método a escala, con todo el conocimiento que una persona jamás podría sostener.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Cómo Funciona */}
          <section className="py-20 px-6 bg-[#16181D]">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16">
                <span className="text-sm font-medium uppercase tracking-widest text-[#C5A059]">
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
                    title: 'Usted comparte',
                    description: 'Lleva el material que Queswa le entrega a sus contactos, con un clic. El sistema toma desde ahí.'
                  },
                  {
                    step: '2',
                    title: 'Queswa explica y convierte',
                    description: 'Presenta el modelo, resuelve dudas y acompaña la decisión — 24/7, con cada contacto a la vez.'
                  },
                  {
                    step: '3',
                    title: 'Usted lo ve en vivo',
                    description: 'Recibe notificaciones de cada paso: quién entró, quién avanza, quién quedó listo. Su negocio, en la palma de su mano.'
                  },
                  {
                    step: '4',
                    title: 'Usted dirige',
                    description: 'Dedica su tiempo a quienes ya decidieron avanzar. Lo demás, ya está hecho.'
                  }
                ].map((item, i) => (
                  <div key={i} className="flex gap-6 items-start">
                    <div
                      className="w-12 h-12 flex items-center justify-center flex-shrink-0"
                      style={{
                        background: 'transparent',
                        border: '2px solid #C5A059',
                        borderRadius: '50%',
                      }}
                    >
                      <span className="font-bold text-lg" style={{ color: '#C5A059' }}>{item.step}</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                      <p className="text-[#A3A3A3]">{item.description}</p>
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
                <span className="text-sm font-medium uppercase tracking-widest text-[#C5A059]">
                  La Diferencia
                </span>
                <h2 className="text-3xl sm:text-4xl mt-4 font-serif">
                  Con Queswa vs Sin Queswa
                </h2>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Sin Queswa */}
                <div className="p-8  bg-[#16181D] border border-[rgba(229, 194, 121, 0.15)] opacity-60">
                  <h3 className="text-xl font-semibold mb-6 text-[#6B7280]">Una sola persona</h3>
                  <ul className="space-y-4 text-[#A3A3A3]">
                    <li className="flex items-start gap-3">
                      <X className="w-5 h-5 text-[#6B7280] flex-shrink-0 mt-0.5" />
                      <span>Atiende de a uno — su día tiene un límite</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <X className="w-5 h-5 text-[#6B7280] flex-shrink-0 mt-0.5" />
                      <span>Repite la misma explicación mil veces</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <X className="w-5 h-5 text-[#6B7280] flex-shrink-0 mt-0.5" />
                      <span>Las oportunidades se enfrían cuando usted no está</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <X className="w-5 h-5 text-[#6B7280] flex-shrink-0 mt-0.5" />
                      <span>Lo que alcanza depende solo de usted</span>
                    </li>
                  </ul>
                </div>

                {/* Con Queswa */}
                <div className="p-8  bg-[#16181D] border border-[#C5A059]/30 shadow-lg shadow-[#C5A059]/5">
                  <h3 className="text-xl font-semibold mb-6 text-[#C5A059]">Con Queswa</h3>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-[#C5A059] flex-shrink-0 mt-0.5" />
                      <span>Atiende a todos a la vez, 24/7</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-[#C5A059] flex-shrink-0 mt-0.5" />
                      <span>La misma explicación impecable, siempre</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-[#C5A059] flex-shrink-0 mt-0.5" />
                      <span>Trabaja a toda hora, en toda América</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-[#C5A059] flex-shrink-0 mt-0.5" />
                      <span>Usted ve cada paso en tiempo real</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Final */}
          <section className="py-20 px-6 bg-[#16181D]">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl sm:text-4xl font-serif mb-6">
                ¿Quiere comprobar esta tecnología?
              </h2>
              <p className="text-lg text-[#A3A3A3] mb-10">
                Inicie el Diagnóstico de 5 Días y vea, con sus propios números, cómo esta
                tecnología multiplica lo que hoy usted sostiene solo.
              </p>

              <Link
                href="/empresa-digital"
                className="cta-base cta-primary"
                style={{ padding: '1.125rem 2.5rem', fontSize: '0.95rem' }}
              >
                INICIAR EL DIAGNÓSTICO →
              </Link>

              <p className="text-sm mt-6 text-[#64748B]">
                5 Días · Sin Costo · Sin Compromiso
              </p>
            </div>
          </section>

          {/* Footer */}
          <footer className="px-6 py-12 border-t border-[rgba(229, 194, 121, 0.15)]">
            <div className="max-w-5xl mx-auto text-center">
              <p className="text-sm text-[#64748B]">
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
