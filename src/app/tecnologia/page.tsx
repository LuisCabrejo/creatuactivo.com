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
import { Bot, Target, Users, PenLine, Handshake, LayoutDashboard } from 'lucide-react';
import { IndustrialHeader } from '@/components/IndustrialHeader';
import QueswaCTAButton from '@/components/QueswaCTAButton';

export const metadata = {
  title: '¿Qué es Queswa? La inteligencia artificial de CreaTuActivo',
  description: 'Queswa explica, atiende y madura en cada interesado la decisión de avanzar, las 24 horas. En queswa.app usted ve quién llegó, qué preguntó y quién está listo.',
  keywords: 'qué es queswa, queswa app, queswa.app, qué es queswa.app, aplicación queswa, queswa creatuactivo, luis cabrejo queswa, queswa ia, inteligencia artificial creatuactivo',
  authors: [{ name: 'Luis Cabrejo', url: 'https://luiscabrejo.com' }],
  alternates: { canonical: 'https://creatuactivo.com/tecnologia' },
  openGraph: {
    title: '¿Qué es Queswa? La inteligencia artificial de CreaTuActivo',
    description: 'Queswa explica, atiende y madura en cada interesado la decisión de avanzar, las 24 horas. En queswa.app usted ve quién llegó, qué preguntó y quién está listo.',
    url: 'https://creatuactivo.com/tecnologia',
    type: 'article',
    // No tenía imagen en la tarjeta (auditoría SEO, 1 oct 2026): va la general del sitio.
    images: [{ url: 'https://creatuactivo.com/opengraph-image', width: 1200, height: 630 }],
  },
};

// JSON-LD — relaciona matemáticamente: queswa.app ↔ CreaTuActivo ↔ Luis Cabrejo
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      headline: '¿Qué es Queswa? La inteligencia artificial de CreaTuActivo',
      description: 'Queswa explica, atiende y madura en cada interesado la decisión de avanzar, las 24 horas. En queswa.app usted ve quién llegó, qué preguntó y quién está listo.',
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
      alternateName: ['Queswa'],
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      url: 'https://queswa.app',
      description: 'Queswa explica, atiende y madura en cada interesado la decisión de avanzar, las 24 horas. En queswa.app usted ve quién llegó, qué preguntó y quién está listo.',
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
            background: 'radial-gradient(ellipse at 50% 0%, rgba(197, 160, 89, 0.08) 0%, transparent 50%)'
          }}
        />

        <div className="relative z-10">
          {/* Hero Section */}
          {/* Subtítulo reemplazado (26 sep 2026, Director): el anterior —«Construya una
              estructura de ingresos recurrentes — usted decide; Queswa hace el trabajo»—
              abría con el ingreso en vez del negocio (regla del 29 ago 2026) y usaba el
              patrón retirado «usted no hace X» (29 jun 2026). Ahora: el negocio primero
              y la promesa canónica de Queswa. */}
          <IndustrialHeader
            title="LA TECNOLOGÍA DE SU SISTEMA DE DISTRIBUCIÓN"
            subtitle="La inteligencia artificial de su sistema de distribución: explica, atiende y madura en cada interesado la decisión de avanzar, las 24 horas."
            refCode="SISTEMA_QUESWA_V3"
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
                {/* Texto aprobado por el Director el 1 oct 2026. */}
                <p className="text-[#E5E5E5] leading-relaxed mb-4">
                  <strong>Queswa</strong> es la inteligencia artificial de{' '}
                  <strong>CreaTuActivo</strong>. Conversa por WhatsApp con cada persona que llega
                  por el enlace de un socio, le resuelve las dudas y madura en cada interesado la
                  decisión de avanzar, a cualquier hora. Y cada cliente que se registra por ese
                  enlace queda a nombre del socio.
                </p>
                <p className="text-[#A3A3A3] leading-relaxed">
                  La concibió <a href="https://luiscabrejo.com" target="_blank" rel="noopener noreferrer" style={{ color: '#C5A059', fontWeight: 600, textDecoration: 'none' }}>Luis Cabrejo</a>,
                  fundador de CreaTuActivo, para que tener un ingreso que no dependa de su presencia
                  deje de ser cuestión de talento o de suerte. Los socios la usan en{' '}
                  <a href="https://queswa.app" style={{ color: '#C5A059' }}>queswa.app</a>.
                </p>
              </div>
            </div>
          </section>

          {/* La sección «El Problema» y el párrafo del 90% salieron el 1 oct 2026
              (Director): describían con detalle la tarea vieja antes de liberar al lector.
              La dificultad queda en una sola frase. */}
          <section className="py-16 px-6 bg-[#16181D]">
            <div className="max-w-3xl mx-auto">
              <div className="p-8 bg-gradient-to-r from-[#16181D] to-[#22222e] border border-[#C5A059]/20 text-center">
                <p className="text-xl">
                  En ese entonces, atender a cada interesado a cualquier hora era imposible para
                  una sola persona.{' '}
                  <span className="text-[#C5A059] font-semibold">Hoy no lo es.</span>
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
                  ¿Qué hace Queswa?
                </h2>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {/* Explica */}
                <div className="p-6  bg-[#16181D] border border-[rgba(197,160,89,0.15)] text-center">
                  <div className="w-14 h-14  bg-[#C5A059]/10 flex items-center justify-center mx-auto mb-4">
                    <Bot className="w-7 h-7 text-[#C5A059]" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Explica</h3>
                  <p className="text-sm text-[#A3A3A3]">Presenta el modelo completo y resuelve cada duda con datos claros, a cualquier hora. La misma explicación para cada persona.</p>
                </div>

                {/* Convierte */}
                <div className="p-6  bg-[#16181D] border border-[rgba(197,160,89,0.15)] text-center">
                  <div className="w-14 h-14  bg-[#C5A059]/10 flex items-center justify-center mx-auto mb-4">
                    <Target className="w-7 h-7 text-[#C5A059]" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Madura la decisión</h3>
                  <p className="text-sm text-[#A3A3A3]">Conversa con cada interesado hasta que está listo para avanzar, y le avisa a usted en el momento: quién abrió su presentación, quién vio el video, quién está listo.</p>
                </div>

                {/* Multiplica */}
                <div className="p-6  bg-[#16181D] border border-[rgba(197,160,89,0.15)] text-center">
                  <div className="w-14 h-14  bg-[#C5A059]/10 flex items-center justify-center mx-auto mb-4">
                    <Users className="w-7 h-7 text-[#C5A059]" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Se multiplica con usted</h3>
                  <p className="text-sm text-[#A3A3A3]">Cuando alguien inicia con usted, recibe el mismo sistema, con la misma Queswa atendiendo a los suyos.</p>
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
                    description: 'Lleva el material que Queswa le entrega a sus contactos, con un clic. Queswa toma desde ahí.'
                  },
                  {
                    step: '2',
                    title: 'Queswa conversa',
                    description: 'Presenta el modelo, resuelve dudas y madura la decisión de avanzar — 24/7, con cada contacto a la vez.'
                  },
                  {
                    step: '3',
                    title: 'Usted lo ve en vivo',
                    description: 'Recibe notificaciones de cada paso: quién entró, quién avanza, quién quedó listo. Su negocio, en la palma de su mano.'
                  },
                  {
                    step: '4',
                    title: 'Usted recibe',
                    description: 'Dedica su tiempo a quienes ya decidieron avanzar.'
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

          {/* Para el dueño — lo construido para el EMPRESARIO, no solo para sus
              interesados (Director, 26 sep 2026). Todo lo que se afirma existe hoy:
              el modo socio del canal (Queswa reconoce al distribuidor por su teléfono
              y le cambia el trato), la redacción de mensajes para una persona
              (wa-redaccion-socio), el plan completo con los ciclos calculados, y el
              Centro de Mando con Maestría y la evidencia de cada ingrediente
              (arsenal_ciencia_socio, tenant dashboard). */}
          <section className="py-20 px-6">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-16">
                <span className="text-sm font-medium uppercase tracking-widest text-[#C5A059]">
                  Para el dueño
                </span>
                <h2 className="text-3xl sm:text-4xl mt-4 font-serif">
                  Y cuando usted ya es socio, Queswa trabaja para usted.
                </h2>
                <p className="text-[#A3A3A3] mt-4 max-w-2xl mx-auto leading-relaxed">
                  Queswa lo reconoce y le cambia el trato: deja de presentarle el negocio
                  y pasa a ser su equipo de trabajo, por el mismo WhatsApp.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="p-6 bg-[#16181D] border border-[rgba(197,160,89,0.15)] text-center">
                  <div className="w-14 h-14 bg-[#C5A059]/10 flex items-center justify-center mx-auto mb-4">
                    <PenLine className="w-7 h-7 text-[#C5A059]" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Le redacta los mensajes</h3>
                  <p className="text-sm text-[#A3A3A3]">
                    Dígale a quién quiere invitar — su hermana, un colega, un conocido — y
                    Queswa le escribe el mensaje con su voz, cuidando las reglas del negocio.
                    Usted lo revisa y lo envía.
                  </p>
                </div>

                <div className="p-6 bg-[#16181D] border border-[rgba(197,160,89,0.15)] text-center">
                  <div className="w-14 h-14 bg-[#C5A059]/10 flex items-center justify-center mx-auto mb-4">
                    <Handshake className="w-7 h-7 text-[#C5A059]" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Le responde de colega a colega</h3>
                  <p className="text-sm text-[#A3A3A3]">
                    El plan de compensación completo, el ciclo de pago vigente, la ficha y el
                    precio de cada producto — lo que usted necesita a la mano para atender a
                    sus clientes y a sus distribuidores.
                  </p>
                </div>

                <div className="p-6 bg-[#16181D] border border-[rgba(197,160,89,0.15)] text-center">
                  <div className="w-14 h-14 bg-[#C5A059]/10 flex items-center justify-center mx-auto mb-4">
                    <LayoutDashboard className="w-7 h-7 text-[#C5A059]" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Su espacio en queswa.app</h3>
                  <p className="text-sm text-[#A3A3A3]">
                    En queswa.app vive su lista con su pipeline en tiempo real, la formación
                    de Maestría — liderazgo, comunicación y producto — y la evidencia
                    científica de cada ingrediente, con lo que sí puede decirle a su cliente.
                  </p>
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
                Pregúntele a Queswa, con sus propios números, cómo funcionaría su sistema de
                distribución. Le responde a cualquier hora.
              </p>

              <QueswaCTAButton
                className="cta-base cta-primary"
                style={{ padding: '1.125rem 2.5rem', fontSize: '0.95rem' }}
              >
                HABLAR CON QUESWA →
              </QueswaCTAButton>
            </div>
          </section>

          {/* Footer */}
          <footer className="px-6 py-12 border-t border-[rgba(197,160,89,0.15)]">
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
