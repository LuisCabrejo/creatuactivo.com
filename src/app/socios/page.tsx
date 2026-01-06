/**
 * Copyright © 2025 CreaTuActivo.com
 * Página de Presentación para Socios Estratégicos
 * Objetivo: Convertir sesgados del MLM tradicional al modelo moderno
 */

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  X,
  Check,
  Smartphone,
  Users,
  BarChart3,
  MessageSquare,
  Clock,
  Target,
  Zap,
  TrendingUp,
  Shield,
  Brain,
  ChevronDown,
  Play,
} from 'lucide-react';

export default function SociosPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-[#f5f5f5]">
      {/* Header Simple */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0f]/90 backdrop-blur-md border-b border-[#2a2a35]">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#D4AF37] rounded-lg flex items-center justify-center">
              <span className="text-[#0a0a0f] font-bold text-xl font-serif">C</span>
            </div>
            <span className="text-lg font-semibold">CreaTuActivo</span>
          </div>
          <span className="text-sm text-[#a0a0a8]">Presentación Exclusiva</span>
        </div>
      </header>

      {/* Hero - El Problema */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 mb-8 bg-[#1a1a24] border border-[#2a2a35]">
            <span className="w-2 h-2 rounded-full bg-[#D4AF37]" />
            <span className="text-sm text-[#a0a0a8]">Para Socios Estratégicos</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif leading-tight mb-6">
            <span className="text-[#a0a0a8]">Lo que construimos</span>
            <br />
            <span className="text-[#D4AF37]">no es lo que conoces.</span>
          </h1>

          <p className="text-lg text-[#a0a0a8] mb-12 max-w-2xl mx-auto leading-relaxed">
            Si tu experiencia con el network marketing ha sido frustrante,
            entiendo. La mía también lo fue. Pero lo que hemos construido
            es <strong className="text-[#f5f5f5]">fundamentalmente diferente</strong>.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#comparacion"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#D4AF37] text-[#0a0a0f] font-semibold rounded-lg hover:bg-[#c9a432] transition-colors"
            >
              Ver la Diferencia
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>

      {/* Comparación: Viejo vs Nuevo */}
      <section id="comparacion" className="py-20 px-6 bg-[#0d0d14]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-2xl sm:text-3xl font-serif mb-4">
              MLM Tradicional vs. <span className="text-[#D4AF37]">CreaTuActivo</span>
            </h2>
            <p className="text-[#a0a0a8]">
              No es una mejora. Es una reinvención completa.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Columna Viejo */}
            <div className="bg-[#12121a] border border-red-500/20 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center">
                  <X className="w-6 h-6 text-red-500" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-red-400">Lo que conocías</h3>
                  <p className="text-sm text-[#6b6b75]">MLM de los años 90</p>
                </div>
              </div>

              <ul className="space-y-4">
                {[
                  'Hacer listas de 100 contactos',
                  'Llamar a amigos y familiares',
                  'Reuniones en hoteles',
                  'Perseguir prospectos',
                  '"Fake it until you make it"',
                  'Vender productos puerta a puerta',
                  'Cargar inventario en casa',
                  'Convencer con presión',
                  'Depender de tu carisma',
                  'Trabajar 24/7 sin sistema',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-[#a0a0a8]">
                    <X className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 p-4 bg-red-500/5 rounded-xl border border-red-500/10">
                <p className="text-sm text-red-400 italic">
                  "El 95% fracasa porque el sistema depende de habilidades que el 95% no tiene."
                </p>
              </div>
            </div>

            {/* Columna Nuevo */}
            <div className="bg-[#12121a] border border-[#D4AF37]/30 rounded-2xl p-8 relative">
              <div className="absolute -top-3 right-8 px-3 py-1 bg-[#D4AF37] text-[#0a0a0f] text-xs font-bold rounded-full">
                NUESTRO MODELO
              </div>

              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-[#D4AF37]/10 rounded-xl flex items-center justify-center">
                  <Check className="w-6 h-6 text-[#D4AF37]" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[#D4AF37]">Lo que construimos</h3>
                  <p className="text-sm text-[#6b6b75]">Sistema Digital 2025</p>
                </div>
              </div>

              <ul className="space-y-4">
                {[
                  'Contenido que atrae (Reto 5 Días)',
                  'IA que educa y filtra (Queswa)',
                  'Dashboard con métricas en tiempo real',
                  'Prospectos que vienen a ti',
                  'Autenticidad y transparencia',
                  'E-commerce de la corporación',
                  'Logística manejada por Gano Excel',
                  'Información que convence sola',
                  'Sistema que duplica sin ti',
                  'Automatización que trabaja 24/7',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-[#f5f5f5]">
                    <Check className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 p-4 bg-[#D4AF37]/5 rounded-xl border border-[#D4AF37]/10">
                <p className="text-sm text-[#D4AF37] italic">
                  "El sistema funciona aunque tú no tengas las habilidades. Porque las tiene la tecnología."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* La Tecnología: Queswa */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-[#D4AF37] text-sm font-semibold uppercase tracking-wider mb-4 block">
                La Ventaja Injusta
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif mb-6">
                Queswa: Tu socio digital que
                <span className="text-[#D4AF37]"> nunca duerme</span>
              </h2>

              <p className="text-[#a0a0a8] mb-8 leading-relaxed">
                Mientras el networker tradicional tiene que explicar lo mismo 100 veces,
                convencer, manejar objeciones y cerrar... <strong className="text-[#f5f5f5]">Queswa lo hace por ti</strong>.
              </p>

              <div className="space-y-4">
                {[
                  { icon: MessageSquare, text: 'Responde preguntas con precisión 24/7' },
                  { icon: Brain, text: 'Maneja objeciones con datos, no con presión' },
                  { icon: Target, text: 'Filtra curiosos de prospectos serios' },
                  { icon: Users, text: 'Entrena a tu equipo automáticamente' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 bg-[#12121a] rounded-xl border border-[#2a2a35]">
                    <div className="w-10 h-10 bg-[#D4AF37]/10 rounded-lg flex items-center justify-center">
                      <item.icon className="w-5 h-5 text-[#D4AF37]" />
                    </div>
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Chat Demo Visual */}
            <div className="bg-[#12121a] rounded-2xl border border-[#2a2a35] p-6">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#2a2a35]">
                <div className="w-10 h-10 bg-[#D4AF37] rounded-full flex items-center justify-center">
                  <span className="text-[#0a0a0f] font-bold">Q</span>
                </div>
                <div>
                  <p className="font-semibold">Queswa</p>
                  <p className="text-xs text-green-500">En línea</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-end">
                  <div className="bg-[#D4AF37]/20 rounded-2xl rounded-tr-sm px-4 py-3 max-w-[80%]">
                    <p className="text-sm">¿Esto es una pirámide?</p>
                  </div>
                </div>

                <div className="flex justify-start">
                  <div className="bg-[#1a1a24] rounded-2xl rounded-tl-sm px-4 py-3 max-w-[85%]">
                    <p className="text-sm text-[#a0a0a8]">
                      Entiendo la pregunta. Las pirámides son ilegales porque no hay producto real y solo circula dinero.
                      Aquí distribuyes café de Gano Excel (empresa con 30 años, presente en 65 países).
                      Tu ganancia viene del consumo real, no del reclutamiento.
                      ¿Te comparto el registro legal de la compañía?
                    </p>
                  </div>
                </div>

                <div className="flex justify-end">
                  <div className="bg-[#D4AF37]/20 rounded-2xl rounded-tr-sm px-4 py-3 max-w-[80%]">
                    <p className="text-sm">Sí, quiero verlo</p>
                  </div>
                </div>

                <div className="flex justify-start">
                  <div className="bg-[#1a1a24] rounded-2xl rounded-tl-sm px-4 py-3 max-w-[85%]">
                    <p className="text-sm text-[#D4AF37]">
                      📄 Enviando: Certificado DIAN + Cámara de Comercio...
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#2a2a35] text-center">
                <p className="text-xs text-[#6b6b75]">
                  Queswa responde con datos, no con presión emocional.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* El Dashboard */}
      <section className="py-20 px-6 bg-[#0d0d14]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-[#D4AF37] text-sm font-semibold uppercase tracking-wider mb-4 block">
              Control Total
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif mb-4">
              Dashboard: Tu negocio en
              <span className="text-[#D4AF37]"> un vistazo</span>
            </h2>
            <p className="text-[#a0a0a8] max-w-2xl mx-auto">
              Mientras el networker tradicional no sabe quién vio su mensaje,
              tú tendrás data en tiempo real de cada interacción.
            </p>
          </div>

          {/* Dashboard Preview */}
          <div className="bg-[#12121a] rounded-2xl border border-[#2a2a35] p-6 md:p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Prospectos Hoy', value: '24', trend: '+12%', color: 'text-[#D4AF37]' },
                { label: 'Conversaciones', value: '156', trend: '+8%', color: 'text-blue-400' },
                { label: 'Interés Alto', value: '18', trend: '+23%', color: 'text-green-400' },
                { label: 'Listos para Cerrar', value: '7', trend: '+5%', color: 'text-purple-400' },
              ].map((stat, i) => (
                <div key={i} className="bg-[#0a0a0f] rounded-xl p-4 border border-[#2a2a35]">
                  <p className="text-xs text-[#6b6b75] mb-1">{stat.label}</p>
                  <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                  <p className="text-xs text-green-500">{stat.trend}</p>
                </div>
              ))}
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Lista de Prospectos */}
              <div className="md:col-span-2 bg-[#0a0a0f] rounded-xl p-4 border border-[#2a2a35]">
                <h4 className="text-sm font-semibold mb-4 flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#D4AF37]" />
                  Prospectos Recientes
                </h4>
                <div className="space-y-3">
                  {[
                    { name: 'María G.', status: 'Interés Alto', time: 'Hace 5 min', score: 8 },
                    { name: 'Carlos R.', status: 'Evaluando', time: 'Hace 12 min', score: 6 },
                    { name: 'Ana P.', status: 'Preguntó precios', time: 'Hace 23 min', score: 7 },
                  ].map((prospect, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-[#12121a] rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-[#D4AF37]/20 rounded-full flex items-center justify-center text-xs font-bold text-[#D4AF37]">
                          {prospect.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{prospect.name}</p>
                          <p className="text-xs text-[#6b6b75]">{prospect.status}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-[#6b6b75]">{prospect.time}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <div className="h-1.5 w-16 bg-[#2a2a35] rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#D4AF37] rounded-full"
                              style={{ width: `${prospect.score * 10}%` }}
                            />
                          </div>
                          <span className="text-xs text-[#D4AF37]">{prospect.score}/10</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Panel de Actividad */}
              <div className="bg-[#0a0a0f] rounded-xl p-4 border border-[#2a2a35]">
                <h4 className="text-sm font-semibold mb-4 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-[#D4AF37]" />
                  Queswa Actividad
                </h4>
                <div className="space-y-3">
                  {[
                    { action: 'Respondió objeción "pirámide"', time: '2 min' },
                    { action: 'Envió info de productos', time: '8 min' },
                    { action: 'Calificó prospecto: 8/10', time: '15 min' },
                    { action: 'Detectó interés en paquete ESP3', time: '22 min' },
                  ].map((activity, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] mt-1.5 shrink-0" />
                      <div>
                        <p className="text-[#a0a0a8]">{activity.action}</p>
                        <p className="text-[#6b6b75]">Hace {activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#2a2a35] text-center">
              <p className="text-sm text-[#6b6b75]">
                <span className="text-[#D4AF37]">*</span> Vista de demostración. Dashboard real disponible para socios activos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* El Flujo Completo */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-serif mb-4">
              Tu único trabajo:
              <span className="text-[#D4AF37]"> Conectar</span>
            </h2>
            <p className="text-[#a0a0a8]">
              El sistema hace el resto.
            </p>
          </div>

          <div className="relative">
            {/* Línea conectora */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#D4AF37] via-[#D4AF37]/50 to-[#D4AF37]/20 hidden md:block" />

            <div className="space-y-8">
              {[
                {
                  step: '1',
                  title: 'Compartes el Reto 5 Días',
                  description: 'Un link. Eso es todo. Sin explicar, sin convencer.',
                  icon: Smartphone,
                },
                {
                  step: '2',
                  title: 'El prospecto se registra',
                  description: 'Recibe contenido de valor por WhatsApp durante 5 días.',
                  icon: MessageSquare,
                },
                {
                  step: '3',
                  title: 'Queswa educa y filtra',
                  description: 'La IA responde dudas, maneja objeciones, califica el interés.',
                  icon: Brain,
                },
                {
                  step: '4',
                  title: 'Recibes prospectos calificados',
                  description: 'Solo hablas con quienes ya entienden y quieren avanzar.',
                  icon: Target,
                },
                {
                  step: '5',
                  title: 'Cierras y el sistema duplica',
                  description: 'Tu nuevo socio tiene las mismas herramientas. El ciclo se repite.',
                  icon: TrendingUp,
                },
              ].map((item, i) => (
                <div key={i} className="flex gap-6 items-start">
                  <div className="w-12 h-12 bg-[#D4AF37] rounded-xl flex items-center justify-center shrink-0 relative z-10">
                    <item.icon className="w-6 h-6 text-[#0a0a0f]" />
                  </div>
                  <div className="bg-[#12121a] rounded-xl p-6 border border-[#2a2a35] flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs text-[#D4AF37] font-semibold">PASO {item.step}</span>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                    <p className="text-[#a0a0a8] text-sm">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Preguntas que sé que tienen */}
      <section className="py-20 px-6 bg-[#0d0d14]">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-serif mb-4">
              Sé que tienen
              <span className="text-[#D4AF37]"> preguntas</span>
            </h2>
            <p className="text-[#a0a0a8]">
              Las mismas que yo tenía antes de construir esto.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: '¿Y si la IA dice algo incorrecto?',
                a: 'Queswa está entrenada con información verificada de la compañía, testimonios reales y documentación legal. No inventa. Y cada conversación queda registrada para que puedas revisarla.'
              },
              {
                q: '¿Esto realmente funciona sin vender?',
                a: 'El sistema no elimina las ventas, las transforma. En lugar de tú convencer, el contenido educa y la IA responde. Cuando el prospecto llega a ti, ya está informado. Solo confirmas y cierras.'
              },
              {
                q: '¿Por qué no está todo el mundo haciendo esto?',
                a: 'Porque construir esta infraestructura tomó años y miles de dólares en desarrollo. La mayoría de networkers no tiene acceso a tecnología propia. Nosotros sí.'
              },
              {
                q: '¿Cuánto tiempo tengo que dedicar?',
                a: 'Depende de tus metas. Con 1-2 horas diarias compartiendo contenido y revisando el dashboard, puedes construir. El sistema trabaja las otras 22-23 horas.'
              },
              {
                q: '¿Y si ya probé MLM antes y fracasé?',
                a: 'El 95% fracasa con el método tradicional porque depende de habilidades de venta que la mayoría no tiene. Este sistema elimina esa dependencia. Las habilidades las tiene la tecnología.'
              },
            ].map((faq, i) => (
              <div
                key={i}
                className="bg-[#12121a] rounded-xl border border-[#2a2a35] overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-[#1a1a24] transition-colors"
                >
                  <span className="font-semibold pr-4">{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#D4AF37] shrink-0 transition-transform ${
                      openFaq === i ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-6">
                    <p className="text-[#a0a0a8] leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-serif mb-6">
            La infraestructura está lista.
            <br />
            <span className="text-[#D4AF37]">Solo falta tu decisión.</span>
          </h2>

          <p className="text-[#a0a0a8] mb-8 max-w-xl mx-auto">
            No te pido que confíes ciegamente. Te pido que evalúes con mente abierta.
            Que veas el sistema funcionando. Que hagas preguntas.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/reto-5-dias"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#D4AF37] text-[#0a0a0f] font-semibold rounded-lg hover:bg-[#c9a432] transition-colors"
            >
              Experimentar el Reto
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/fundadores"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#12121a] border border-[#2a2a35] text-[#f5f5f5] font-semibold rounded-lg hover:bg-[#1a1a24] transition-colors"
            >
              Ver Información Completa
            </Link>
          </div>

          <p className="mt-8 text-sm text-[#6b6b75]">
            ¿Preguntas? Habla directamente conmigo:
            <a href="https://wa.me/573215193909" className="text-[#D4AF37] hover:underline ml-1">
              +57 321 519 3909
            </a>
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-[#2a2a35]">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-sm text-[#6b6b75]">
            © {new Date().getFullYear()} CreaTuActivo.com — Presentación exclusiva para socios estratégicos
          </p>
        </div>
      </footer>
    </div>
  );
}
