/**
 * Copyright © 2025 CreaTuActivo.com
 * PRESENTACIÓN EMPRESARIAL v4.0
 * Herramienta de apoyo para conversaciones 1-a-1
 * CTA Principal: Reto 5 Días
 */

'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowRight, CheckCircle, Play, Clock, Shield, TrendingUp, Zap } from 'lucide-react'

export default function PresentacionEmpresarialPruebaPage() {
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
        {/* Header Simple - Sin menú para no distraer */}
        <header className="py-6 px-4">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-[#D4AF37] flex items-center justify-center">
                <span className="text-[#0a0a0f] font-bold text-xl" style={{ fontFamily: 'Georgia, serif' }}>C</span>
              </div>
              <span className="text-lg font-medium">
                Crea<span className="text-[#D4AF37]">Tu</span>Activo
              </span>
            </Link>

            {/* Badge de confianza */}
            <span className="hidden sm:inline-flex items-center gap-2 text-xs text-[#a0a0a8] bg-[#12121a] px-3 py-1.5 rounded-full border border-[#2a2a35]">
              <Shield className="w-3 h-3 text-[#D4AF37]" />
              Operación 100% Remota
            </span>
          </div>
        </header>

        {/* Hero - El Problema + La Promesa */}
        <section className="py-12 sm:py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <span className="inline-flex items-center gap-2 text-sm text-[#a0a0a8] bg-[#12121a] px-4 py-2 rounded-full border border-[#2a2a35] mb-8">
              <span className="w-2 h-2 bg-[#D4AF37] rounded-full animate-pulse" />
              Presentación del Sistema
            </span>

            {/* Hook Principal - Similar a Home */}
            <h1
              className="text-3xl sm:text-4xl lg:text-5xl leading-tight mb-6"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              Tu plan actual de retiro
              <br />
              <span className="text-[#D4AF37]">tiene un problema matemático</span>
            </h1>

            <p className="text-lg sm:text-xl text-[#a0a0a8] mb-8 max-w-2xl mx-auto leading-relaxed">
              Trabajar 40 años para vivir con el 40% de un ingreso que ya no alcanzaba.
              <span className="text-[#f5f5f5]"> Existe otra forma.</span>
            </p>

            {/* Stats de credibilidad */}
            <div className="flex flex-wrap justify-center gap-6 sm:gap-10 mb-12 text-sm">
              <div className="text-center">
                <p className="text-2xl font-bold text-[#D4AF37]">28+</p>
                <p className="text-[#6b6b75]">años operando</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-[#D4AF37]">60+</p>
                <p className="text-[#6b6b75]">países</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-[#D4AF37]">$0</p>
                <p className="text-[#6b6b75]">deuda corporativa</p>
              </div>
            </div>
          </div>
        </section>

        {/* Video Principal */}
        <section className="pb-16 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="aspect-video bg-[#12121a] rounded-2xl border border-[#2a2a35] flex items-center justify-center relative overflow-hidden group cursor-pointer">
              {/* Placeholder - Reemplazar con video real */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/5 to-transparent" />
              <div className="relative z-10 text-center">
                <div className="w-20 h-20 rounded-full bg-[#D4AF37] mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-[#D4AF37]/20">
                  <Play className="w-8 h-8 text-[#0a0a0f] ml-1" fill="currentColor" />
                </div>
                <p className="text-[#f5f5f5] font-medium">Ver Presentación Completa</p>
                <p className="text-[#6b6b75] text-sm mt-1 flex items-center justify-center gap-1">
                  <Clock className="w-3 h-3" /> 18 minutos
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* La Diferencia - Ingreso Lineal vs Residual */}
        <section className="py-16 px-4 bg-[#12121a]">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2
                className="text-2xl sm:text-3xl mb-4"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                No es cuánto ganas.
                <span className="text-[#D4AF37]"> Es cómo lo ganas.</span>
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Ingreso Lineal */}
              <div className="bg-[#0a0a0f] border border-[#2a2a35] rounded-2xl p-6 opacity-60">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-red-400" />
                  </div>
                  <h3 className="text-lg font-medium">Ingreso Lineal</h3>
                </div>
                <ul className="space-y-3 text-sm text-[#a0a0a8]">
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 mt-0.5">✕</span>
                    <span>Si dejas de trabajar, el ingreso para</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 mt-0.5">✕</span>
                    <span>Cambias tiempo por dinero (1:1)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 mt-0.5">✕</span>
                    <span>Techo limitado por tus horas</span>
                  </li>
                </ul>
              </div>

              {/* Ingreso Residual */}
              <div className="bg-[#0a0a0f] border border-[#D4AF37]/30 rounded-2xl p-6 shadow-lg shadow-[#D4AF37]/5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-[#D4AF37]" />
                  </div>
                  <h3 className="text-lg font-medium">Ingreso Residual</h3>
                </div>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-[#D4AF37] mt-0.5 flex-shrink-0" />
                    <span className="text-[#f5f5f5]">El sistema trabaja sin tu presencia</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-[#D4AF37] mt-0.5 flex-shrink-0" />
                    <span className="text-[#f5f5f5]">Crece exponencialmente con la red</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-[#D4AF37] mt-0.5 flex-shrink-0" />
                    <span className="text-[#f5f5f5]">Heredable y sin techo financiero</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Los 3 Pilares */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2
                className="text-2xl sm:text-3xl mb-4"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                ¿Cómo funciona?
              </h2>
              <p className="text-[#a0a0a8]">
                Un sistema de 3 pilares diseñado para eliminar las barreras tradicionales.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: <Zap className="w-6 h-6" />,
                  title: 'Producto de Consumo',
                  desc: 'Café y suplementos que la gente ya consume a diario. No vendes, conectas con un hábito existente.',
                  color: 'text-blue-400',
                  bg: 'bg-blue-400/10'
                },
                {
                  icon: <TrendingUp className="w-6 h-6" />,
                  title: 'Sistema de Distribución',
                  desc: 'Construyes un canal de distribución, no una lista de clientes. El consumo recurrente genera regalías.',
                  color: 'text-[#D4AF37]',
                  bg: 'bg-[#D4AF37]/10'
                },
                {
                  icon: <Shield className="w-6 h-6" />,
                  title: 'Tecnología + Mentoría',
                  desc: 'IA que educa y filtra prospectos 24/7. Comunidad de constructores que te guía paso a paso.',
                  color: 'text-emerald-400',
                  bg: 'bg-emerald-400/10'
                }
              ].map((item, i) => (
                <div
                  key={i}
                  className="bg-[#12121a] border border-[#2a2a35] rounded-2xl p-6 text-center"
                >
                  <div className={`w-14 h-14 rounded-xl ${item.bg} flex items-center justify-center mx-auto mb-4 ${item.color}`}>
                    {item.icon}
                  </div>
                  <h3 className="text-lg font-medium mb-3">{item.title}</h3>
                  <p className="text-[#a0a0a8] text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Objeciones Comunes */}
        <section className="py-16 px-4 bg-[#12121a]">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2
                className="text-2xl sm:text-3xl mb-4"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                Lo que probablemente estás pensando
              </h2>
            </div>

            <div className="space-y-4">
              {[
                {
                  q: '"No tengo tiempo"',
                  a: 'El sistema está diseñado para 1-2 horas diarias. La IA trabaja 24/7 educando a tus prospectos.'
                },
                {
                  q: '"No sé vender"',
                  a: 'No tienes que vender. La IA explica, tú solo invitas a personas a evaluar. Sin presión, sin guiones.'
                },
                {
                  q: '"Es multinivel, ¿verdad?"',
                  a: 'Sí, distribución en red. Pero con tecnología del 2026, no métodos de los 90s. Sin reuniones en hoteles, sin tocar puertas.'
                },
                {
                  q: '"¿Cuánto tengo que invertir?"',
                  a: 'Desde $200 USD en producto (que tú consumes). No hay cuotas mensuales obligatorias ni costos ocultos.'
                }
              ].map((item, i) => (
                <div
                  key={i}
                  className="bg-[#0a0a0f] border border-[#2a2a35] rounded-xl p-5"
                >
                  <p className="font-medium text-[#D4AF37] mb-2">{item.q}</p>
                  <p className="text-[#a0a0a8] text-sm">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Principal - Reto 5 Días */}
        <section className="py-20 px-4">
          <div className="max-w-2xl mx-auto">
            <div className="bg-[#12121a] border border-[#2a2a35] rounded-2xl p-8 sm:p-10 text-center">
              <span className="inline-flex items-center gap-2 text-sm text-[#a0a0a8] bg-[#0a0a0f] px-4 py-2 rounded-full border border-[#2a2a35] mb-6">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                Siguiente paso
              </span>

              <h2
                className="text-2xl sm:text-3xl mb-4"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                ¿Quieres profundizar?
              </h2>

              <p className="text-[#a0a0a8] mb-8 max-w-lg mx-auto">
                Únete al <span className="text-[#f5f5f5] font-medium">Reto de 5 Días</span> gratuito
                donde te explico paso a paso cómo funciona este modelo y si es para ti.
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

            {/* CTA Secundario para los que ya están listos */}
            <div className="mt-8 text-center">
              <p className="text-[#6b6b75] text-sm mb-3">
                ¿Ya tomaste el reto o estás listo para empezar?
              </p>
              <Link
                href="/fundadores"
                className="text-[#D4AF37] hover:text-[#E8C547] text-sm font-medium inline-flex items-center gap-1 transition-colors"
              >
                Ir directo a Fundadores <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
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
