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
import { Bot, Target, BarChart3, Users, CheckCircle, X } from 'lucide-react';
import { IndustrialHeader } from '@/components/IndustrialHeader';

export const metadata = {
  title: '¿Qué es Queswa.app? Motor Cognitivo de CreaTuActivo · Luis Cabrejo',
  description: 'De una promesa personal a la ingeniería de activos digitales. El diagnóstico técnico del porqué el esfuerzo manual no escala, y cómo usted puede auditar nuestro modelo.',
  keywords: 'qué es queswa, queswa app, queswa.app, qué es queswa.app, aplicación queswa, queswa creatuactivo, luis cabrejo queswa, motor cognitivo creatuactivo, queswa ia, dashboard queswa',
  authors: [{ name: 'Luis Cabrejo', url: 'https://luiscabrejo.com' }],
  openGraph: {
    title: '¿Qué es Queswa.app? · CreaTuActivo',
    description: 'Motor Cognitivo y Dashboard Operativo exclusivo de CreaTuActivo.com, diseñado por Luis Cabrejo.',
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
      headline: '¿Qué es Queswa.app? El Motor Cognitivo de CreaTuActivo',
      description: 'Queswa.app es el Motor Cognitivo y Dashboard Operativo exclusivo de la infraestructura CreaTuActivo.com, diseñado por Luis Cabrejo.',
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
      alternateName: ['Queswa', 'Motor Cognitivo CreaTuActivo'],
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      url: 'https://queswa.app',
      description: 'Motor Cognitivo y Dashboard Operativo exclusivo de la infraestructura CreaTuActivo.com. No es una red social ni un chat público. Es un entorno de Inteligencia Artificial cerrado para Directores Ejecutivos que construyen activos empresariales con la metodología EAM.',
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
      jobTitle: 'Arquitecto de Activos',
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
            title="MEMORÁNDUM DIRECTIVO"
            subtitle="El Motor Cognitivo de CreaTuActivo"
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
                <h1 className="text-2xl font-serif mb-4" style={{ color: '#E5C279' }}>
                  La Definición Oficial de Queswa.app
                </h1>
                <p className="text-[#E5E5E5] leading-relaxed mb-4">
                  <strong>Queswa.app</strong> es el Motor Cognitivo y Dashboard Operativo exclusivo
                  de la infraestructura <strong>CreaTuActivo.com</strong>. No es una red social, ni un
                  chat público, ni una aplicación de mensajería abierta. Es un entorno de Inteligencia
                  Artificial cerrado, diseñado específicamente para que los Directores
                  Ejecutivos de CreaTuActivo automaticen la expansión de sus activos empresariales.
                </p>
                <p className="text-[#A3A3A3] leading-relaxed">
                  Fue concebida y estructurada por <a href="https://luiscabrejo.com" target="_blank" rel="noopener noreferrer" style={{ color: '#C5A059', fontWeight: 600, textDecoration: 'none' }}>Luis Cabrejo</a>,
                  Arquitecto de Activos y fundador de CreaTuActivo, con un único objetivo: eliminar
                  el desgaste operativo que sufren los emprendedores tradicionales. Su acceso está
                  disponible en <a href="https://queswa.app" style={{ color: '#C5A059' }}>queswa.app</a> y
                  es de uso exclusivo para Directores Ejecutivos activos.
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
                clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)',
              }}
            >
              <p className="text-xl text-[#A3A3A3] max-w-2xl mx-auto leading-relaxed">
                El ecosistema de Inteligencia Artificial que opera 24/7 para erradicar
                la fricción comercial. La infraestructura que asume el 90% del desgaste operativo.
              </p>
            </div>
          </div>

          {/* El Problema que Resuelve */}
          <section className="py-20 px-6 bg-[#16181D]">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16">
                <span className="text-sm font-medium uppercase tracking-widest text-[#E5C279]">
                  El Problema
                </span>
                <h2 className="text-3xl sm:text-4xl mt-4 font-serif">
                  ¿Por qué colapsan los modelos de operación manual?
                </h2>
              </div>

              <div className="grid md:grid-cols-2 gap-8 mb-12">
                <div className="p-6  bg-[#0B0C0C] border border-[rgba(229, 194, 121, 0.15)]">
                  <div className="text-[#6B7280] text-4xl font-bold mb-4">#1</div>
                  <h3 className="text-xl font-semibold mb-3">Fricción Operativa</h3>
                  <p className="text-[#A3A3A3]">
                    Los modelos tradicionales exigen persecución manual y persuasión. Un desgaste
                    táctico que destruye la autoridad del operador y quema su círculo relacional.
                  </p>
                </div>

                <div className="p-6  bg-[#0B0C0C] border border-[rgba(229, 194, 121, 0.15)]">
                  <div className="text-[#6B7280] text-4xl font-bold mb-4">#2</div>
                  <h3 className="text-xl font-semibold mb-3">Ausencia de Apalancamiento</h3>
                  <p className="text-[#A3A3A3]">
                    Si la presentación del modelo depende exclusivamente de la disponibilidad
                    física del operador, la escalabilidad es matemáticamente imposible.
                  </p>
                </div>
              </div>

              <div className="p-8  bg-gradient-to-r from-[#16181D] to-[#22222e] border border-[#C5A059]/20 text-center">
                <p className="text-xl">
                  <span className="text-[#E5C279] font-semibold">El Protocolo Queswa corrige ambas fallas estructurales.</span>
                </p>
              </div>
            </div>
          </section>

          {/* Qué hace Queswa */}
          <section className="py-20 px-6">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-16">
                <span className="text-sm font-medium uppercase tracking-widest text-[#E5C279]">
                  La Solución
                </span>
                <h2 className="text-3xl sm:text-4xl mt-4 font-serif">
                  ¿Qué hace Queswa por usted?
                </h2>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Educa 24/7 */}
                <div className="p-6  bg-[#16181D] border border-[rgba(229, 194, 121, 0.15)] text-center">
                  <div className="w-14 h-14  bg-[#F59E0B]/10 flex items-center justify-center mx-auto mb-4">
                    <Bot className="w-7 h-7 text-[#E5C279]" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Instrucción Asíncrona</h3>
                  <p className="text-sm text-[#A3A3A3]">Presenta el modelo y responde objeciones con datos fríos, sin depender de su horario físico.</p>
                </div>

                {/* Filtra Prospectos */}
                <div className="p-6  bg-[#16181D] border border-[rgba(229, 194, 121, 0.15)] text-center">
                  <div className="w-14 h-14  bg-[#F59E0B]/10 flex items-center justify-center mx-auto mb-4">
                    <Target className="w-7 h-7 text-[#E5C279]" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Filtrado de Perfiles</h3>
                  <p className="text-sm text-[#A3A3A3]">Identifica intención operativa real vs. curiosidad, ejecutando un proceso de Due Diligence automatizado.</p>
                </div>

                {/* Captura Datos */}
                <div className="p-6  bg-[#16181D] border border-[rgba(229, 194, 121, 0.15)] text-center">
                  <div className="w-14 h-14  bg-[#F59E0B]/10 flex items-center justify-center mx-auto mb-4">
                    <BarChart3 className="w-7 h-7 text-[#E5C279]" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Extracción de Coordenadas</h3>
                  <p className="text-sm text-[#A3A3A3]">Recopila información de contacto y califica el nivel de interés mediante algoritmos predictivos.</p>
                </div>

                {/* Duplicación */}
                <div className="p-6  bg-[#16181D] border border-[rgba(229, 194, 121, 0.15)] text-center">
                  <div className="w-14 h-14  bg-[#F59E0B]/10 flex items-center justify-center mx-auto mb-4">
                    <Users className="w-7 h-7 text-[#E5C279]" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Escalabilidad Autónoma</h3>
                  <p className="text-sm text-[#A3A3A3]">Replica el protocolo técnico a escala global. La infraestructura de IA posee todo el conocimiento que un operador individual no puede sostener.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Cómo Funciona */}
          <section className="py-20 px-6 bg-[#16181D]">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16">
                <span className="text-sm font-medium uppercase tracking-widest text-[#E5C279]">
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
                    title: 'Usted habilita un punto de acceso',
                    description: 'Solo requiere direccionar tráfico digital hacia el sistema. Sin presentaciones. Sin fricción manual.'
                  },
                  {
                    step: '2',
                    title: 'La IA audita e instruye',
                    description: 'El protocolo presenta la arquitectura, resuelve dudas técnicas y expone la matemática del modelo con precisión clínica.'
                  },
                  {
                    step: '3',
                    title: 'El perfil se autoselecciona',
                    description: 'Si el nivel de interés es alto, el sistema lo notifica. El desgaste de lidiar con el escepticismo queda automatizado.'
                  },
                  {
                    step: '4',
                    title: 'Usted asume la Dirección',
                    description: 'Usted invierte tiempo exclusivamente en auditar perfiles que ya decidieron activar su infraestructura. El trabajo pesado está hecho.'
                  }
                ].map((item, i) => (
                  <div key={i} className="flex gap-6 items-start">
                    <div
                      className="w-12 h-12 flex items-center justify-center flex-shrink-0"
                      style={{
                        background: 'transparent',
                        border: '2px solid #F59E0B',
                        clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
                      }}
                    >
                      <span className="font-bold text-lg" style={{ color: '#F59E0B' }}>{item.step}</span>
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
                <span className="text-sm font-medium uppercase tracking-widest text-[#E5C279]">
                  La Diferencia
                </span>
                <h2 className="text-3xl sm:text-4xl mt-4 font-serif">
                  Con Queswa vs Sin Queswa
                </h2>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Sin Queswa */}
                <div className="p-8  bg-[#16181D] border border-[rgba(229, 194, 121, 0.15)] opacity-60">
                  <h3 className="text-xl font-semibold mb-6 text-[#6B7280]">Método Tradicional</h3>
                  <ul className="space-y-4 text-[#A3A3A3]">
                    <li className="flex items-start gap-3">
                      <X className="w-5 h-5 text-[#6B7280] flex-shrink-0 mt-0.5" />
                      <span>Ejecutar presentaciones manuales</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <X className="w-5 h-5 text-[#6B7280] flex-shrink-0 mt-0.5" />
                      <span>Depender de guiones de persuasión</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <X className="w-5 h-5 text-[#6B7280] flex-shrink-0 mt-0.5" />
                      <span>Sometido a su disponibilidad biológica</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <X className="w-5 h-5 text-[#6B7280] flex-shrink-0 mt-0.5" />
                      <span>Cuello de botella operativo (no escalable)</span>
                    </li>
                  </ul>
                </div>

                {/* Con Queswa */}
                <div className="p-8  bg-[#16181D] border border-[#C5A059]/30 shadow-lg shadow-[#C5A059]/5">
                  <h3 className="text-xl font-semibold mb-6 text-[#E5C279]">Con Queswa</h3>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-[#E5C279] flex-shrink-0 mt-0.5" />
                      <span>El protocolo presenta 24/7</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-[#E5C279] flex-shrink-0 mt-0.5" />
                      <span>Respuestas con precisión de Base de Conocimiento</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-[#E5C279] flex-shrink-0 mt-0.5" />
                      <span>Opera de forma asíncrona a nivel global</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-[#E5C279] flex-shrink-0 mt-0.5" />
                      <span>Apalancamiento asimétrico absoluto</span>
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
                ¿Desea auditar esta tecnología?
              </h2>
              <p className="text-lg text-[#A3A3A3] mb-10">
                Inicie la Auditoría Patrimonial de 5 Días y compruebe empíricamente cómo este
                motor cognitivo neutraliza el Protocolo de la Presencia Obligada.
              </p>

              <Link
                href="/auditoria-patrimonial"
                className="inline-flex items-center justify-center gap-3 font-semibold text-lg px-10 py-5  transition-all duration-300 hover:translate-y-[-2px] hover:shadow-lg bg-[#F59E0B] text-[#0B0C0C]"
                style={{
                  clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)',
                }}
              >
                SOLICITAR AUDITORÍA TÉCNICA →
              </Link>

              <p className="text-sm mt-6 text-[#64748B]">
                5 Días · Subvencionado · Escrutinio Clínico
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
