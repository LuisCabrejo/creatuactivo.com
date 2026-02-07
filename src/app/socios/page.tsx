/**
 * Copyright © 2026 CreaTuActivo.com
 * Página de Presentación para Socios Estratégicos
 * Enfoque: StoryBrand (Ellas son las heroínas) + Plan Trimodal
 * NO confrontacional - La tecnología POTENCIA sus métodos tradicionales
 *
 * THE ARCHITECT'S SUITE - Bimetallic System v3.0
 * Gold (#C5A059): CTAs, highlights, achievements
 * Titanium (#94A3B8): Structural elements
 */

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  ChevronDown,
  Sparkles,
  Users,
  Heart,
  Target,
  Zap,
  Trophy,
  Calendar,
  MessageSquare,
  TrendingUp,
  Star,
  Gift,
  Rocket,
  Handshake,
  CheckCircle2,
  Play,
  Quote,
  Share2,
} from 'lucide-react';

export default function SociosPage() {
  const [openDay, setOpenDay] = useState<number | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[#0F1115] text-[#E5E5E5]">
      {/* Header Simple */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0F1115]/90 backdrop-blur-md border-b border-[rgba(197, 160, 89, 0.15)]">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/header.png" alt="CreaTuActivo Logo" width={40} height={40} priority className="object-contain" />
            <span className="text-lg font-bold text-white" style={{ fontFamily: 'var(--font-oswald), sans-serif' }}>CreaTuActivo</span>
          </div>
          <span className="text-sm text-[#A3A3A3]">Presentación para Socios</span>
        </div>
      </header>

      {/* Hero - Validación + Curiosidad */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 mb-8 bg-[#1A1D23] border border-[#C5A059]/30">
            <Heart className="w-4 h-4 text-[#C5A059]" />
            <span className="text-sm text-[#A3A3A3]">Para quienes ya conocen el poder de las relaciones</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif leading-tight mb-6">
            Lo que funciona sigue funcionando.
            <br />
            <span className="text-[#C5A059]">Solo necesita más alcance.</span>
          </h1>

          <p className="text-lg text-[#A3A3A3] mb-8 max-w-2xl mx-auto leading-relaxed">
            El 1 a 1. Las reuniones. La conexión humana genuina.
            <strong className="text-[#E5E5E5]"> Eso nunca será reemplazado por tecnología.</strong>
            <br /><br />
            Pero... ¿y si la tecnología pudiera
            <strong className="text-[#C5A059]"> multiplicar tu alcance sin perder tu esencia?</strong>
          </p>

          <a
            href="#historia"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#C5A059] text-[#0F1115] font-semibold rounded-lg hover:bg-[#B38B59] transition-colors"
          >
            Conocer la Historia
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </section>

      {/* El Villano Real - El Entrenamiento Tradicional */}
      <section id="historia" className="py-20 px-6 bg-[#15171C]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-[#C5A059] text-sm font-semibold uppercase tracking-wider mb-4 block">
              El Verdadero Enemigo
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif mb-4">
              No es tu gente.
              <span className="text-[#C5A059]"> Es el entrenamiento que les dieron.</span>
            </h2>
          </div>

          <div className="bg-[#1A1D23] rounded-2xl border border-red-500/20 p-8 mb-8">
            <div className="flex items-start gap-4">
              <Quote className="w-8 h-8 text-red-400 shrink-0 mt-2" />
              <div>
                <p className="text-xl text-red-400 font-semibold mb-4">
                  "Haz una lista de 100 y vamos a llamarlos."
                </p>
                <p className="text-[#A3A3A3] leading-relaxed">
                  Ese es el entrenamiento tradicional. Y funciona... para los que ya tienen
                  confianza, las palabras correctas y cero miedo al rechazo.
                  <strong className="text-[#E5E5E5]"> Para el resto, genera esto:</strong>
                </p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: 'Miedo al rechazo',
                description: '"No sé qué decirle a mis amigos." Sienten que van a molestar o quemar su mercado cálido.',
                icon: Users,
              },
              {
                title: 'Sin palabras',
                description: 'Les preguntan "¿a qué te dedicas?" y balbucean. Suenan a vendedores desesperados.',
                icon: MessageSquare,
              },
              {
                title: 'Cero resultados',
                description: 'Frustración. Dudas. Y trabajar con alguien frustrado que duda... es agotador.',
                icon: TrendingUp,
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-[#1A1D23] rounded-xl p-6 border border-red-500/10"
              >
                <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center mb-4">
                  <item.icon className="w-5 h-5 text-red-400" />
                </div>
                <h3 className="font-semibold mb-2 text-red-400">{item.title}</h3>
                <p className="text-sm text-[#A3A3A3]">{item.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-[#1A1D23] rounded-xl border border-[#C5A059]/30 p-8">
            <h4 className="font-semibold text-[#C5A059] mb-4 text-lg">Mi Historia</h4>
            <div className="space-y-4 text-[#A3A3A3] leading-relaxed">
              <p>
                Cuando empecé, no me costaba. <strong className="text-[#E5E5E5]">5 presentaciones, 4 iniciaban.</strong> Pensé que duplicar sería igual de fácil.
              </p>
              <p>
                Pero cuando mi equipo empezó a crecer, descubrí algo incómodo:
                <strong className="text-[#C5A059]"> lo que para mí era fácil, para ellos era difícil.</strong>
              </p>
              <p>
                Ellos no sabían qué decir. Les daba miedo llamar. Y yo no podía estar en cada presentación.
              </p>
              <p>
                Ahí entendí: <strong className="text-[#E5E5E5]">el problema no era mi gente. Era que el método dependía de MÍ.</strong>
              </p>
              <p>
                Necesitaba un sistema que hiciera el trabajo pesado — educar, responder objeciones, generar interés —
                para que cuando mi equipo hablara con alguien, esa persona ya llegara lista.
              </p>
              <p className="text-[#C5A059] font-semibold pt-2">
                Eso es lo que construimos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* La Evolución (No Reemplazo) */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-[#C5A059] text-sm font-semibold uppercase tracking-wider mb-4 block">
              Evolución, No Revolución
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif mb-4">
              Los taxis no desaparecieron.
              <span className="text-[#C5A059]"> Se transformaron.</span>
            </h2>
            <p className="text-[#A3A3A3] max-w-2xl mx-auto">
              Las habilidades que funcionan no desaparecen.
              Se amplifican con las herramientas del siglo XXI.
            </p>
          </div>

          <div className="space-y-6">
            {[
              {
                before: 'Los taxistas conocían cada calle',
                after: 'Uber les dio GPS + pagos digitales + rating',
                insight: 'El conocimiento local + tecnología = más clientes',
              },
              {
                before: 'El correo entregaba mensajes personales',
                after: 'WhatsApp hizo lo mismo, instantáneo y gratis',
                insight: 'La intención de comunicar + velocidad = más conexión',
              },
              {
                before: 'Las reuniones en hotel eran efectivas',
                after: 'Los webinars llegan a miles simultáneamente',
                insight: 'La habilidad de presentar + alcance = más impacto',
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-[#1A1D23] rounded-xl p-6 border border-[rgba(197, 160, 89, 0.15)]"
              >
                <div className="grid md:grid-cols-3 gap-4 items-center">
                  <div className="text-center md:text-left">
                    <p className="text-sm text-[#64748B] mb-1">Antes</p>
                    <p className="text-[#A3A3A3]">{item.before}</p>
                  </div>
                  <div className="text-center">
                    <ArrowRight className="w-6 h-6 text-[#C5A059] mx-auto" />
                  </div>
                  <div className="text-center md:text-right">
                    <p className="text-sm text-[#64748B] mb-1">Ahora</p>
                    <p className="text-[#E5E5E5]">{item.after}</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-[rgba(197, 160, 89, 0.15)]">
                  <p className="text-sm text-[#C5A059] text-center">
                    <Sparkles className="w-4 h-4 inline mr-2" />
                    {item.insight}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* El Plan Trimodal */}
      <section className="py-20 px-6 bg-[#15171C]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-[#C5A059] text-sm font-semibold uppercase tracking-wider mb-4 block">
              El Plan Trimodal
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif mb-4">
              Tres caminos.
              <span className="text-[#C5A059]"> Tú eliges el tuyo.</span>
            </h2>
            <p className="text-[#A3A3A3] max-w-2xl mx-auto">
              No todos tenemos los mismos talentos ni recursos. Por eso diseñamos
              tres rutas para construir activos según tu perfil.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Análogo */}
            <div className="bg-[#1A1D23] rounded-2xl border-2 border-[#C5A059]/50 p-8 relative">
              <div className="absolute -top-3 right-8 px-3 py-1 bg-[#C5A059] text-[#0F1115] text-xs font-bold rounded-full">
                TU FORTALEZA
              </div>
              <div className="w-14 h-14 bg-[#C5A059]/10 rounded-xl flex items-center justify-center mb-6">
                <Handshake className="w-7 h-7 text-[#C5A059]" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-[#C5A059]">Análogo</h3>
              <p className="text-sm text-[#64748B] mb-4">El poder de las relaciones</p>
              <p className="text-[#A3A3A3] mb-6 leading-relaxed">
                Para quienes brillan en el 1 a 1, las reuniones y las presentaciones personales.
                <strong className="text-[#E5E5E5]"> Tu red de contactos es tu mayor activo.</strong>
              </p>
              <ul className="space-y-3">
                {[
                  'Presentaciones presenciales',
                  'Reuniones en casa o café',
                  'Seguimiento personalizado',
                  'El arte del cierre en vivo',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-[#C5A059] shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 p-4 bg-[#C5A059]/5 rounded-xl">
                <p className="text-xs text-[#C5A059]">
                  + La tecnología filtra y educa a tus prospectos ANTES de que lleguen a ti
                </p>
              </div>
            </div>

            {/* Híbrido */}
            <div className="bg-[#1A1D23] rounded-2xl border border-[rgba(197, 160, 89, 0.15)] p-8">
              <div className="w-14 h-14 bg-purple-500/10 rounded-xl flex items-center justify-center mb-6">
                <Users className="w-7 h-7 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-purple-400">Híbrido</h3>
              <p className="text-sm text-[#64748B] mb-4">Marca personal + Relaciones</p>
              <p className="text-[#A3A3A3] mb-6 leading-relaxed">
                Para quienes quieren construir autoridad en redes sociales mientras
                mantienen el toque personal.
              </p>
              <ul className="space-y-3">
                {[
                  'Contenido en redes sociales',
                  'Lives y videos educativos',
                  'Comunidad online + offline',
                  'Autoridad como experto',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Digital */}
            <div className="bg-[#1A1D23] rounded-2xl border border-[rgba(197, 160, 89, 0.15)] p-8">
              <div className="w-14 h-14 bg-blue-500/10 rounded-xl flex items-center justify-center mb-6">
                <Rocket className="w-7 h-7 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-blue-400">Digital</h3>
              <p className="text-sm text-[#64748B] mb-4">Inversión + Automatización</p>
              <p className="text-[#A3A3A3] mb-6 leading-relaxed">
                Para quienes tienen capital para invertir en publicidad y prefieren
                sistemas 100% automatizados.
              </p>
              <ul className="space-y-3">
                {[
                  'Publicidad pagada (Ads)',
                  'Embudos automatizados',
                  'Equipo comercial delegado',
                  'Escalabilidad sin límites',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-[#A3A3A3] max-w-2xl mx-auto">
              La belleza del modelo es que puedes combinarlos.
              Empezar con <strong className="text-[#C5A059]">Análogo</strong> y
              escalar a <strong className="text-purple-400">Híbrido</strong> o
              <strong className="text-blue-400"> Digital</strong> cuando estés lista.
            </p>
          </div>
        </div>
      </section>

      {/* Russell Brunson y la Metodología */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-[#C5A059] text-sm font-semibold uppercase tracking-wider mb-4 block">
              La Metodología Probada
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif mb-4">
              No inventamos la rueda.
              <span className="text-[#C5A059]"> La adaptamos.</span>
            </h2>
          </div>

          <div className="bg-[#1A1D23] rounded-2xl border border-[rgba(197, 160, 89, 0.15)] p-8 mb-8">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="w-24 h-24 bg-[#C5A059]/10 rounded-full flex items-center justify-center shrink-0">
                <Trophy className="w-12 h-12 text-[#C5A059]" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3">Russell Brunson</h3>
                <p className="text-[#A3A3A3] leading-relaxed mb-4">
                  Creador de ClickFunnels, empresa valorada en $360 millones.
                  Sus metodologías —<strong className="text-[#E5E5E5]">DotCom Secrets, Expert Secrets, Traffic Secrets</strong>—
                  han ayudado a miles de emprendedores a construir negocios de 7 y 8 cifras.
                </p>
                <p className="text-[#E5E5E5]">
                  Lo que hemos construido para CreaTuActivo está basado en sus principios:
                </p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                title: 'El Reto de 5 Días',
                description: 'Metodología "Challenge Funnel" que convierte curiosos en comprometidos',
                icon: Calendar,
              },
              {
                title: 'Epiphany Bridge',
                description: 'Historias que transforman creencias y eliminan objeciones',
                icon: Heart,
              },
              {
                title: 'The Stack',
                description: 'Presentación de valor que hace irresistible la oferta',
                icon: Gift,
              },
              {
                title: 'Funnel Hub',
                description: 'Ecosistema completo que valida y genera confianza',
                icon: Target,
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-[#1A1D23] rounded-xl p-6 border border-[rgba(197, 160, 89, 0.15)] flex items-start gap-4"
              >
                <div className="w-10 h-10 bg-[#C5A059]/10 rounded-lg flex items-center justify-center shrink-0">
                  <item.icon className="w-5 h-5 text-[#C5A059]" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">{item.title}</h4>
                  <p className="text-sm text-[#A3A3A3]">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* El Reto de 5 Días - Día por Día */}
      <section className="py-20 px-6 bg-[#15171C]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-[#C5A059] text-sm font-semibold uppercase tracking-wider mb-4 block">
              El Reto de 5 Días
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif mb-4">
              Qué reciben tus prospectos
              <span className="text-[#C5A059]"> antes de hablar contigo</span>
            </h2>
            <p className="text-[#A3A3A3] max-w-2xl mx-auto">
              Imagina que cada persona que llega a ti ya entiende el modelo,
              ya superó sus objeciones y ya está lista para tomar una decisión.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                day: 1,
                title: 'El Diagnóstico',
                subtitle: 'La Verdad que Nadie Cuenta',
                content: 'Calculadora de "Días de Libertad". El prospecto descubre cuántos días puede vivir sin trabajar con sus ahorros actuales. El resultado (generalmente alarmante) crea la necesidad de buscar alternativas. Rompe la creencia de que "el empleo es seguro".',
                result: 'Entienden que necesitan un cambio',
              },
              {
                day: 2,
                title: 'Los Vehículos',
                subtitle: 'El Modelo Tri-Modal',
                content: 'Presentamos las tres rutas para construir activos: Análoga (relaciones), Híbrida (marca personal) y Digital (inversión). Cada quien elige según sus talentos y recursos. No hay presión para ser algo que no son.',
                result: 'Ven un camino que encaja con ellos',
              },
              {
                day: 3,
                title: 'El Motor',
                subtitle: 'La Revelación',
                content: 'Se presenta a Gano Excel (30 años, 65 países, patentes propias) como la infraestructura, y a Queswa como la ventaja tecnológica. El café no es "el producto a vender" — es el vehículo de retención más poderoso porque es un hábito.',
                result: 'Entienden el modelo sin sentir que les venden',
              },
              {
                day: 4,
                title: 'El Estigma',
                subtitle: 'Rompiendo Cadenas',
                content: 'Se abordan todas las objeciones: "¿Es pirámide?", "No sé vender", "Ya probé MLM y fracasé". Con datos, documentación legal (Ley 1700) y analogías claras. Amazon es una red. Uber es una red. Nosotros también.',
                result: 'Las objeciones desaparecen antes de hablar contigo',
              },
              {
                day: 5,
                title: 'La Invitación',
                subtitle: 'El Siguiente Paso',
                content: 'Presentación de la oferta completa con la metodología "Stack" de Brunson: Membresía + Tecnología + Academia + Mentoría. No es "compra este producto", es "únete a esta infraestructura".',
                result: 'Llegan a ti listos para decidir, no para escuchar',
              },
            ].map((day, i) => (
              <div
                key={i}
                className="bg-[#1A1D23] rounded-xl border border-[rgba(197, 160, 89, 0.15)] overflow-hidden"
              >
                <button
                  onClick={() => setOpenDay(openDay === i ? null : i)}
                  className="w-full p-6 text-left flex items-center gap-4 hover:bg-[#1A1D23] transition-colors"
                >
                  <div className="w-12 h-12 bg-[#C5A059] rounded-xl flex items-center justify-center shrink-0">
                    <span className="text-[#0F1115] font-bold text-lg">{day.day}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{day.title}</h3>
                    <p className="text-sm text-[#A3A3A3]">{day.subtitle}</p>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-[#C5A059] shrink-0 transition-transform ${
                      openDay === i ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openDay === i && (
                  <div className="px-6 pb-6">
                    <div className="ml-16 border-l-2 border-[#C5A059]/30 pl-6">
                      <p className="text-[#A3A3A3] mb-4 leading-relaxed">{day.content}</p>
                      <div className="p-3 bg-[#C5A059]/5 rounded-lg">
                        <p className="text-sm text-[#C5A059]">
                          <CheckCircle2 className="w-4 h-4 inline mr-2" />
                          <strong>Resultado:</strong> {day.result}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 p-6 bg-[#1A1D23] rounded-xl border border-[#C5A059]/30">
            <p className="text-center text-[#E5E5E5]">
              <Sparkles className="w-5 h-5 text-[#C5A059] inline mr-2" />
              <strong>El poder para ustedes:</strong> Cada persona que completa el reto
              llega educada, sin objeciones, lista para que ustedes hagan lo que mejor saben:
              <span className="text-[#C5A059]"> conectar y cerrar.</span>
            </p>
          </div>
        </div>
      </section>

      {/* El Webinar */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-[#C5A059] text-sm font-semibold uppercase tracking-wider mb-4 block">
              Después del Reto
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif mb-4">
              El Webinar de Arquitectura de Activos
            </h2>
            <p className="text-[#A3A3A3] max-w-2xl mx-auto">
              Para quienes completaron el reto y quieren entender el modelo a profundidad
              antes de tomar su decisión.
            </p>
          </div>

          <div className="bg-[#1A1D23] rounded-2xl border border-[rgba(197, 160, 89, 0.15)] p-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 bg-[#C5A059]/10 rounded-full flex items-center justify-center">
                <Play className="w-8 h-8 text-[#C5A059]" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">Webinar en Vivo</h3>
                <p className="text-[#A3A3A3]">90 minutos que cambian la perspectiva</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-4 text-[#C5A059]">Contenido:</h4>
                <ul className="space-y-3">
                  {[
                    'La Gran Promesa: Cartera de activos en 6 meses',
                    'Secreto 1: Por qué el café saludable es mejor que crypto',
                    'Secreto 2: Cómo Queswa hace el trabajo "difícil"',
                    'Secreto 3: El factor Tri-Modal explicado',
                    'La Oferta Irresistible (The Stack)',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-[#A3A3A3]">
                      <CheckCircle2 className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4 text-[#C5A059]">Beneficio para ustedes:</h4>
                <p className="text-[#A3A3A3] leading-relaxed mb-4">
                  En lugar de hacer presentaciones individuales explicando todo desde cero,
                  invitan a sus prospectos al webinar. Ellos reciben la información completa.
                  Ustedes solo hacen seguimiento y cierre.
                </p>
                <div className="p-4 bg-[#C5A059]/5 rounded-lg">
                  <p className="text-sm text-[#C5A059]">
                    <strong>Resultado:</strong> Más cierres con menos esfuerzo.
                    <br />
                    El sistema presenta. Ustedes conectan.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* La Experiencia de 11 Estrellas */}
      <section className="py-20 px-6 bg-[#15171C]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-[#C5A059] text-sm font-semibold uppercase tracking-wider mb-4 block">
              Nuestra Visión
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif mb-4">
              La Experiencia de
              <span className="text-[#C5A059]"> 11 Estrellas</span>
            </h2>
            <p className="text-[#A3A3A3] max-w-2xl mx-auto">
              Brian Chesky (fundador de Airbnb) preguntaba: "Si la experiencia de 5 estrellas
              es excelente... ¿cómo sería una de 11?" Esa pregunta cambió todo.
            </p>
          </div>

          <div className="space-y-4 mb-8">
            {[
              {
                stars: 5,
                title: 'Experiencia Normal',
                description: 'El prospecto recibe información, entiende el producto, puede decidir.',
                color: 'text-[#A3A3A3]',
              },
              {
                stars: 7,
                title: 'Experiencia Buena',
                description: 'Recibe contenido de valor, se siente respetado, tiene tiempo para pensar.',
                color: 'text-blue-400',
              },
              {
                stars: 9,
                title: 'Experiencia Excelente',
                description: 'Tiene IA disponible 24/7, dashboard con su progreso, mentoría incluida.',
                color: 'text-purple-400',
              },
              {
                stars: 11,
                title: 'Lo que estamos construyendo',
                description: 'El prospecto siente que encontró una comunidad que genuinamente quiere su éxito. No una venta, sino un equipo.',
                color: 'text-[#C5A059]',
              },
            ].map((level, i) => (
              <div
                key={i}
                className="bg-[#1A1D23] rounded-xl p-6 border border-[rgba(197, 160, 89, 0.15)]"
              >
                <div className="flex items-center gap-4">
                  <div className="flex gap-1">
                    {Array.from({ length: Math.min(level.stars, 5) }).map((_, j) => (
                      <Star
                        key={j}
                        className={`w-4 h-4 ${level.color} fill-current`}
                      />
                    ))}
                    {level.stars > 5 && (
                      <span className={`text-sm font-bold ${level.color} ml-1`}>
                        +{level.stars - 5}
                      </span>
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-semibold ${level.color}`}>{level.title}</h4>
                    <p className="text-sm text-[#A3A3A3]">{level.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-6 bg-[#1A1D23] rounded-xl border border-[#C5A059]/30 mb-8">
            <p className="text-center text-[#A3A3A3]">
              <strong className="text-[#E5E5E5]">¿Por qué importa esto para ustedes?</strong>
              <br /><br />
              Cuando sus prospectos y nuevos socios tienen una experiencia de 11 estrellas,
              <span className="text-[#C5A059]"> la duplicación se vuelve natural</span>.
              No tienen que "convencer" a nadie de quedarse. Quieren quedarse porque
              la experiencia es excepcional.
            </p>
          </div>

          {/* La Solución: Material que Atrae */}
          <div className="bg-gradient-to-br from-[#C5A059]/10 to-[#1A1D23] rounded-2xl border border-[#C5A059]/30 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-[#C5A059] rounded-xl flex items-center justify-center">
                <Share2 className="w-6 h-6 text-[#0F1115]" />
              </div>
              <div>
                <h4 className="font-semibold text-[#C5A059]">La Solución 11 Estrellas</h4>
                <p className="text-sm text-[#A3A3A3]">Lo que encuentra el nuevo al llegar</p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4 mb-6">
              {[
                {
                  step: '1',
                  title: 'Material Atractivo',
                  description: 'Contenido listo para publicar en redes. Sin tener que llamar a nadie.',
                },
                {
                  step: '2',
                  title: 'Reto 5 Días',
                  description: 'El contenido lleva a sus contactos al Reto. El sistema educa por ellos.',
                },
                {
                  step: '3',
                  title: 'Interesados Llegan',
                  description: 'No persiguen. Los prospectos llegan preguntando. Listos para hablar.',
                },
              ].map((item, i) => (
                <div key={i} className="bg-[#0F1115]/50 rounded-xl p-4 text-center">
                  <div className="w-8 h-8 bg-[#C5A059] rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-[#0F1115] font-bold text-sm">{item.step}</span>
                  </div>
                  <h5 className="font-semibold mb-2 text-[#E5E5E5]">{item.title}</h5>
                  <p className="text-xs text-[#A3A3A3]">{item.description}</p>
                </div>
              ))}
            </div>

            <p className="text-center text-[#E5E5E5]">
              El nuevo ya no dice <span className="text-red-400">"no sé qué decirle a mis amigos"</span>.
              <br />
              Ahora dice: <span className="text-[#C5A059]">"publiqué y me escribieron 3 personas preguntando"</span>.
            </p>
          </div>
        </div>
      </section>

      {/* Los Viajes - El Sueño Tangible */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-[#C5A059] text-sm font-semibold uppercase tracking-wider mb-4 block">
              El Sueño Tangible
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif mb-4">
              Malasia. Tailandia. Cancún. Cartagena.
              <br />
              <span className="text-[#C5A059]">Y TODO tu equipo puede llegar.</span>
            </h2>
            <p className="text-[#A3A3A3] max-w-2xl mx-auto">
              Gano Excel acaba de lanzar el Corporativo Malasia-Tailandia 2026.
              Y nuestro equipo tiene dos viajes propios este año.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {[
              {
                destination: 'Malasia-Tailandia',
                event: 'Corporativo Gano Excel 2026',
                type: 'Internacional',
                color: 'from-amber-500 to-orange-500',
              },
              {
                destination: 'Cancún',
                event: 'Viaje de Reconocimiento 2026',
                type: 'Equipo CreaTuActivo',
                color: 'from-cyan-500 to-blue-500',
              },
              {
                destination: 'Cartagena',
                event: 'Copa Imparables 2026',
                type: 'Equipo CreaTuActivo',
                color: 'from-purple-500 to-pink-500',
              },
            ].map((trip, i) => (
              <div
                key={i}
                className="bg-[#1A1D23] rounded-2xl border border-[rgba(197, 160, 89, 0.15)] overflow-hidden group hover:border-[#C5A059]/30 transition-colors"
              >
                <div className={`h-2 bg-gradient-to-r ${trip.color}`} />
                <div className="p-6">
                  <p className="text-xs text-[#64748B] mb-2">{trip.type}</p>
                  <h3 className="text-xl font-semibold mb-1">{trip.destination}</h3>
                  <p className="text-sm text-[#A3A3A3]">{trip.event}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-[#1A1D23] rounded-2xl border border-[#C5A059]/30 p-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-[#C5A059]/10 rounded-xl flex items-center justify-center shrink-0">
                <Trophy className="w-6 h-6 text-[#C5A059]" />
              </div>
              <div>
                <h4 className="font-semibold mb-3 text-[#C5A059]">
                  El sistema no solo te ayuda a TI a calificar...
                </h4>
                <p className="text-[#A3A3A3] leading-relaxed mb-4">
                  Imagina que cada persona en tu equipo tiene acceso al mismo sistema:
                  el Reto que educa, Queswa que responde 24/7, el webinar que presenta.
                </p>
                <p className="text-[#E5E5E5] leading-relaxed">
                  Cuando tu equipo tiene herramientas que funcionan aunque ellos estén dormidos,
                  <strong className="text-[#C5A059]"> la calificación a estos viajes se vuelve alcanzable para TODOS</strong>.
                  No solo para las "estrellas" — para todo tu árbol.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-[#A3A3A3]">
              Tú en Malasia. Tu primer nivel en Cancún. Tu segundo nivel en Cartagena.
              <br />
              <strong className="text-[#E5E5E5]">Eso es lo que hace la diferencia entre un sistema y no tenerlo.</strong>
            </p>
          </div>
        </div>
      </section>

      {/* El Dolor que Resolvemos (Empatía) */}
      <section className="py-20 px-6 bg-[#15171C]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-[#C5A059] text-sm font-semibold uppercase tracking-wider mb-4 block">
              Entendemos el Desafío
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif mb-4">
              Los dolores que conocemos
              <span className="text-[#C5A059]"> porque también los vivimos</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                pain: 'Duplicación difícil',
                solution: 'El sistema educa y califica prospectos. Tus nuevos socios arrancan con prospectos pre-calificados, no con una lista fría.',
                icon: Users,
              },
              {
                pain: 'Dependencia de habilidades de venta',
                solution: 'Queswa responde objeciones con datos. Tú solo conectas y cierras con quienes ya están convencidos.',
                icon: MessageSquare,
              },
              {
                pain: 'Necesidad constante de "sangre nueva"',
                solution: 'El Reto de 5 Días genera prospectos continuamente. El embudo trabaja aunque tú descanses.',
                icon: TrendingUp,
              },
              {
                pain: 'Presentaciones repetitivas',
                solution: 'El webinar presenta. El reto educa. Tú solo haces seguimiento personalizado.',
                icon: Calendar,
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-[#1A1D23] rounded-xl p-6 border border-[rgba(197, 160, 89, 0.15)]"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-red-400" />
                  </div>
                  <h4 className="font-semibold text-red-400">{item.pain}</h4>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-[#C5A059]/10 rounded flex items-center justify-center shrink-0 mt-0.5">
                    <Zap className="w-3 h-3 text-[#C5A059]" />
                  </div>
                  <p className="text-[#A3A3A3] text-sm leading-relaxed">{item.solution}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Preguntas Frecuentes */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-serif mb-4">
              Preguntas que probablemente tengan
            </h2>
          </div>

          <div className="space-y-4">
            {[
              {
                q: '¿Esto significa que ya no hago reuniones 1 a 1?',
                a: 'Al contrario. Seguirás haciendo las reuniones que amas, pero con prospectos que ya entienden el modelo y ya superaron sus objeciones. Tu tiempo 1 a 1 será para conectar y cerrar, no para explicar desde cero.'
              },
              {
                q: '¿Y si prefiero no usar la tecnología?',
                a: 'Perfecto. El Plan Trimodal tiene la ruta "Análoga" diseñada exactamente para ti. Usas las herramientas que quieras, cuando quieras. La tecnología está disponible, no es obligatoria. Aunque... tus prospectos sí la usarán, y eso te beneficia.'
              },
              {
                q: '¿Cómo sé que esto funciona?',
                a: 'Porque está basado en metodologías probadas por miles de emprendedores (Russell Brunson, ClickFunnels). No inventamos nada nuevo — adaptamos lo que ya funciona al modelo de network marketing. Y lo mejor: tú puedes experimentar el Reto como prospecto para verlo funcionar.'
              },
              {
                q: '¿Qué pasa con mi forma actual de trabajar?',
                a: 'La mantienes. Lo que construimos no compite con tus métodos — los complementa. Imagina tus habilidades de relacionamiento + un sistema que trabaja 24/7 filtrando y educando prospectos para ti. Es tu forma de trabajar, potenciada.'
              },
              {
                q: '¿Qué gano yo específicamente?',
                a: 'Prospectos que llegan educados (menos explicaciones). Objeciones manejadas por IA (menos fricción). Dashboard para ver el estado de cada prospecto (más control). Webinars que presentan por ti (más escala). Y todo esto mientras sigues haciendo lo que mejor sabes: conectar con personas.'
              },
            ].map((faq, i) => (
              <div
                key={i}
                className="bg-[#1A1D23] rounded-xl border border-[rgba(197, 160, 89, 0.15)] overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-[#1A1D23] transition-colors"
                >
                  <span className="font-semibold pr-4">{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#C5A059] shrink-0 transition-transform ${
                      openFaq === i ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-6">
                    <p className="text-[#A3A3A3] leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 px-6 bg-[#15171C]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-serif mb-6">
            Lo que construimos es para ustedes.
            <br />
            <span className="text-[#C5A059]">Para potenciar lo que ya hacen.</span>
          </h2>

          <p className="text-[#A3A3A3] mb-8 max-w-xl mx-auto leading-relaxed">
            No les pedimos que cambien. Les invitamos a que vean cómo sus talentos
            de siempre pueden multiplicarse con las herramientas de hoy.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/reto-5-dias"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#C5A059] text-[#0F1115] font-semibold rounded-lg hover:bg-[#B38B59] transition-colors"
            >
              Experimentar el Reto (Como Prospecto)
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/fundadores"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#1A1D23] border border-[rgba(197, 160, 89, 0.15)] text-[#E5E5E5] font-semibold rounded-lg hover:bg-[#1A1D23] transition-colors"
            >
              Ver la Oferta Completa
            </Link>
          </div>

          <p className="mt-8 text-sm text-[#64748B]">
            ¿Preguntas? Hablemos directamente:
            <a href="https://wa.me/573215193909" className="text-[#C5A059] hover:underline ml-1">
              +57 321 519 3909
            </a>
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-[rgba(197, 160, 89, 0.15)]">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-sm text-[#64748B]">
            © {new Date().getFullYear()} CreaTuActivo.com — Presentación exclusiva para socios estratégicos
          </p>
        </div>
      </footer>
    </div>
  );
}
