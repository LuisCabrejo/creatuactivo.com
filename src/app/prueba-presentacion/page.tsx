/**
 * Copyright © 2025 CreaTuActivo.com
 * PRESENTACIÓN EMPRESARIAL v4.0 - Bridge Page Style
 * Enfoque: Brunson methodology, Quiet Luxury, Single CTA
 */

'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowRight, CheckCircle, Play } from 'lucide-react'

export default function PruebaPresentacionPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0f] text-[#f5f5f5]">
      {/* Gradient Background */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, rgba(212, 175, 55, 0.08) 0%, transparent 50%)'
        }}
      />

      <div className="relative z-10">
        {/* Header Simple */}
        <header className="py-6 px-4">
          <div className="max-w-4xl mx-auto">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-[#D4AF37] flex items-center justify-center">
                <span className="text-[#0a0a0f] font-bold text-xl" style={{ fontFamily: 'Georgia, serif' }}>C</span>
              </div>
              <span className="text-lg font-medium">
                CreaTu<span className="text-[#D4AF37]">Activo</span>
              </span>
            </Link>
          </div>
        </header>

        {/* Hero - Hook Principal */}
        <section className="py-16 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-flex items-center gap-2 text-sm text-[#a0a0a8] bg-[#12121a] px-4 py-2 rounded-full border border-[#2a2a35] mb-8">
              <span className="w-2 h-2 bg-[#D4AF37] rounded-full animate-pulse" />
              Presentación Completa
            </span>

            <h1
              className="text-4xl sm:text-5xl lg:text-6xl leading-tight mb-6"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              El sistema que construye
              <br />
              <span className="text-[#D4AF37]">mientras tú vives</span>
            </h1>

            <p className="text-xl text-[#a0a0a8] mb-12 max-w-2xl mx-auto">
              25 minutos que pueden cambiar tu perspectiva sobre cómo se construye
              libertad financiera en la era digital.
            </p>
          </div>
        </section>

        {/* Video Principal */}
        <section className="pb-16 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="aspect-video bg-[#12121a] rounded-2xl border border-[#2a2a35] flex items-center justify-center relative overflow-hidden group cursor-pointer">
              {/* Placeholder - Reemplazar con video real */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/10 to-transparent" />
              <div className="relative z-10 text-center">
                <div className="w-20 h-20 rounded-full bg-[#D4AF37] mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Play className="w-8 h-8 text-[#0a0a0f] ml-1" fill="currentColor" />
                </div>
                <p className="text-[#a0a0a8] text-sm">Ver Presentación Completa</p>
                <p className="text-[#6b6b75] text-xs mt-1">25 minutos</p>
              </div>
            </div>
          </div>
        </section>

        {/* 3 Pilares - Versión Simplificada */}
        <section className="py-16 px-4 bg-[#12121a]">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2
                className="text-3xl mb-4"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                Lo que vas a descubrir
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  num: '01',
                  title: 'El Modelo',
                  desc: 'Por qué la distribución en red es el vehículo más eficiente para construir ingresos residuales.'
                },
                {
                  num: '02',
                  title: 'La Tecnología',
                  desc: 'Cómo nuestra IA elimina el problema #1: "no sé vender" y "no tengo tiempo".'
                },
                {
                  num: '03',
                  title: 'La Oportunidad',
                  desc: 'Por qué ahora es el momento de posicionarse antes del crecimiento exponencial.'
                }
              ].map((item) => (
                <div
                  key={item.num}
                  className="bg-[#0a0a0f] border border-[#2a2a35] rounded-2xl p-6"
                >
                  <span className="text-[#D4AF37] text-sm font-medium">{item.num}</span>
                  <h3 className="text-xl font-medium mt-2 mb-3">{item.title}</h3>
                  <p className="text-[#a0a0a8] text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Prueba Social Compacta */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2
                className="text-3xl mb-4"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                Resultados reales
              </h2>
              <p className="text-[#a0a0a8]">
                Personas comunes usando un sistema extraordinario.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  initials: 'LM',
                  name: 'Liliana P.',
                  role: 'Madre de familia',
                  quote: 'Construí el patrimonio de mis hijas desde casa, sin tener que vender puerta a puerta.'
                },
                {
                  initials: 'AG',
                  name: 'Andrés G.',
                  role: 'Profesional de salud',
                  quote: 'La IA hace el 80% del trabajo que yo no tenía tiempo de hacer.'
                }
              ].map((item) => (
                <div
                  key={item.initials}
                  className="bg-[#12121a] border border-[#2a2a35] rounded-2xl p-6"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] font-medium">
                      {item.initials}
                    </div>
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-[#6b6b75]">{item.role}</p>
                    </div>
                  </div>
                  <p className="text-[#a0a0a8] text-sm italic">"{item.quote}"</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Checklist de Beneficios */}
        <section className="py-16 px-4 bg-[#12121a]">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <h2
                className="text-3xl mb-4"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                Lo que obtienes
              </h2>
            </div>

            <div className="space-y-4">
              {[
                'Acceso a la plataforma CreaTuActivo con IA integrada',
                'Sistema de duplicación automática para tu equipo',
                'Productos de consumo diario (café, suplementos)',
                'Plan de compensación con ingresos residuales',
                'Mentoría y comunidad de constructores',
                'Sin inventario en casa, envíos directos'
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 bg-[#0a0a0f] border border-[#2a2a35] rounded-xl p-4"
                >
                  <CheckCircle className="w-5 h-5 text-[#D4AF37] flex-shrink-0" />
                  <span className="text-[#a0a0a8]">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Final - Un solo llamado a la acción */}
        <section className="py-24 px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2
              className="text-3xl sm:text-4xl mb-6"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              ¿Listo para dar el siguiente paso?
            </h2>
            <p className="text-[#a0a0a8] mb-10">
              Únete como Fundador y accede a condiciones exclusivas
              que no estarán disponibles después del lanzamiento público.
            </p>

            <Link
              href="/fundadores"
              className="inline-flex items-center gap-3 px-10 py-5 bg-[#D4AF37] hover:bg-[#E8C547] text-[#0a0a0f] font-semibold text-lg rounded-xl transition-all duration-300"
            >
              Quiero ser Fundador
              <ArrowRight className="w-5 h-5" />
            </Link>

            <p className="text-[#6b6b75] text-sm mt-6">
              Solo 150 posiciones disponibles
            </p>
          </div>
        </section>

        {/* Footer Simple */}
        <footer className="py-8 px-4 text-center text-[#6b6b75] text-sm border-t border-[#2a2a35]">
          <Link href="/privacidad" className="hover:text-[#a0a0a8] transition-colors">
            Política de Privacidad
          </Link>
          <span className="mx-2">•</span>
          <span>© 2025 CreaTuActivo.com</span>
        </footer>
      </div>
    </main>
  )
}
