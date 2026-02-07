/**
 * Copyright © 2025 CreaTuActivo.com
 * RETO 5 DÍAS - BRIDGE PAGE / THANK YOU
 * Epiphany Bridge: La historia de Luis + Instrucciones del reto
 */

import Link from 'next/link';
import Image from 'next/image';

export const metadata = {
  title: 'Estás Dentro | Reto 5 Días - CreaTuActivo',
  description: 'Confirmación de registro al Reto de 5 Días de Soberanía Financiera.',
  robots: 'noindex, nofollow', // No indexar página de gracias
};

export default function GraciasPage() {
  return (
    <main className="min-h-screen bg-[#0F1115] text-[#E5E5E5]">
      {/* Gradient Background */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, rgba(197, 160, 89, 0.08) 0%, transparent 50%)'
        }}
      />

      <div className="relative z-10">
        {/* Header */}
        <header className="py-6 px-4">
          <div className="max-w-4xl mx-auto">
            <Link href="/" className="inline-flex items-center gap-2">
              <Image src="/header.png" alt="CreaTuActivo Logo" width={40} height={40} priority className="object-contain" />
              <span className="text-lg font-medium">
                CreaTu<span className="text-[#C5A059]">Activo</span>
              </span>
            </Link>
          </div>
        </header>

        {/* Success Message */}
        <section className="py-12 px-4">
          <div className="max-w-2xl mx-auto text-center">
            {/* Check Icon */}
            <div className="w-20 h-20 rounded-full bg-[#C5A059]/20 mx-auto mb-6 flex items-center justify-center">
              <svg className="w-10 h-10 text-[#C5A059]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h1
              className="text-4xl sm:text-5xl mb-4"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              <span className="text-[#C5A059]">¡Estás dentro!</span>
            </h1>

            <p className="text-xl text-[#A3A3A3] mb-4">
              Tu lugar en el Reto de 5 Días está confirmado.
            </p>
            <p className="text-[#6b6b75] mb-8">
              Estás a 5 días de tu soberanía.
            </p>
          </div>
        </section>

        {/* Bridge Section - Epiphany Bridge Story */}
        <section className="py-16 px-4 bg-[#1A1D23]">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <span className="text-sm font-medium uppercase tracking-widest text-[#C5A059]/70">
                Mientras esperas...
              </span>
              <h2
                className="text-3xl sm:text-4xl mt-4 mb-4"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                Por qué creé este reto
              </h2>
              <p className="text-[#A3A3A3]">
                Un video corto de 3 minutos que te preparará para lo que viene
              </p>
            </div>

            {/* Video Placeholder */}
            <div className="aspect-video bg-[#1A1D23] rounded-2xl border border-[rgba(197, 160, 89, 0.15)] flex items-center justify-center mb-8">
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-[#C5A059]/20 mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-10 h-10 text-[#C5A059]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
                <p className="text-[#6b6b75] text-sm">Video del Puente de Epifanía</p>
                <p className="text-[#6b6b75] text-xs mt-1">(Próximamente)</p>
              </div>
            </div>

            {/* WhatsApp VIP CTA - Golden Button */}
            <div className="bg-[#0F1115] border border-[#C5A059]/30 rounded-2xl p-8 mb-8">
              <div className="text-center">
                <h3 className="text-xl font-medium mb-4" style={{ fontFamily: 'Georgia, serif' }}>
                  <span className="text-[#C5A059]">Paso Final</span>
                </h3>
                <p className="text-[#A3A3A3] mb-6">
                  Para garantizar que recibas los enlaces de acceso cada día
                  (y evitar que caigan en spam), he habilitado un canal VIP directo en WhatsApp.
                </p>
                <p className="text-sm text-[#6b6b75] mb-6">
                  Haz clic abajo para confirmar tu cupo y recibir tu primera instrucción personal.
                </p>
                <a
                  href="https://wa.me/573215193909?text=Hola%20Luis,%20ya%20vi%20el%20video%20y%20quiero%20activar%20mi%20acceso%20al%20Reto."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 bg-[#C5A059] hover:bg-[#D4AF37] text-[#0F1115] font-semibold py-4 px-8 rounded-xl transition-colors text-lg"
                >
                  <span>👉</span>
                  ACTIVAR MI ACCESO VIP EN WHATSAPP
                </a>
              </div>
            </div>

            {/* Story Summary - Epiphany Bridge Oficial */}
            <div className="bg-[#0F1115] rounded-2xl p-8 border border-[rgba(197, 160, 89, 0.15)]">
              <h3
                className="text-2xl mb-6"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                Mi historia (versión corta)
              </h3>

              <div className="space-y-4 text-[#A3A3A3]">
                <p>
                  Cuando estaba de novio con mi esposa, la llevé a un mirador en los Llanos que se llama{' '}
                  <strong className="text-[#E5E5E5]">Buena Vista</strong>. Ahí le hice tres promesas:
                  una casa de campo, compras sin mirar la etiqueta, y tres hijos.
                </p>
                <p>
                  <strong className="text-[#E5E5E5]">Catorce años después...</strong> de las tres promesas,
                  solo le había cumplido con los tres hijos.
                </p>
                <p>
                  No era por falta de esfuerzo. Mi vida se había convertido en lo que llamo el{' '}
                  <span className="text-[#C5A059] font-medium">&quot;Plan por Defecto&quot;</span>: trabajar como loco
                  para pagar las cuentas, y repetir al mes siguiente.
                </p>
                <p>
                  Encontré un modelo diferente. En 2.5 años, fui el #1 de mi organización. Pero mi éxito no se duplicaba.
                  Lo que para mí era natural, para otros era una lucha constante.
                </p>
                <p>
                  <strong className="text-[#E5E5E5]">Esa fue mi primera epifanía:</strong> un sistema que solo funciona
                  para algunos no es una solución real.
                </p>
                <p>
                  Después vino el e-commerce. Otra vez funcionó para mí, pero requería saber de marketing, SEO, logística...{' '}
                  <strong className="text-[#E5E5E5]">Segunda epifanía:</strong> el problema no era la gente, era el modelo.
                </p>
                <p className="text-[#C5A059] font-medium text-lg mt-6">
                  &quot;La soberanía financiera no se trata de lujos. Se trata de poder cumplir tu palabra.&quot;
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* What to Expect */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2
                className="text-3xl mb-4"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                Lo que vas a descubrir
              </h2>
            </div>

            <div className="grid md:grid-cols-5 gap-4">
              {[
                { dia: 1, titulo: 'El Diagnóstico', desc: 'Dónde estás realmente' },
                { dia: 2, titulo: 'Los Vehículos', desc: 'Por qué tu plan no funciona' },
                { dia: 3, titulo: 'El Modelo', desc: 'La matemática que sí funciona' },
                { dia: 4, titulo: 'El Estigma', desc: 'Construir sin vergüenza' },
                { dia: 5, titulo: 'La Invitación', desc: 'Tu siguiente paso' },
              ].map((item) => (
                <div
                  key={item.dia}
                  className="bg-[#1A1D23] border border-[rgba(197, 160, 89, 0.15)] rounded-xl p-4 text-center"
                >
                  <div className="text-sm font-medium text-[#C5A059] mb-2">
                    Día {item.dia}
                  </div>
                  <div className="font-medium mb-1">{item.titulo}</div>
                  <div className="text-xs text-[#6b6b75]">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Action Items */}
        <section className="py-16 px-4 bg-[#1A1D23]">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2
                className="text-2xl mb-4"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                Mientras tanto, haz esto:
              </h2>
            </div>

            <div className="space-y-4">
              {[
                { num: 1, text: 'Activa tu acceso VIP en WhatsApp (botón arriba)', icon: 'whatsapp' },
                { num: 2, text: 'Revisa tu correo y bandeja de spam', icon: 'email' },
                { num: 3, text: 'Bloquea 15 minutos al día para el reto', icon: 'clock' },
              ].map((item) => (
                <div
                  key={item.num}
                  className="flex items-center gap-4 bg-[#0F1115] border border-[rgba(197, 160, 89, 0.15)] rounded-xl p-4"
                >
                  <div className="w-10 h-10 rounded-full bg-[#C5A059] text-[#0F1115] font-bold flex items-center justify-center flex-shrink-0">
                    {item.num}
                  </div>
                  <span className="text-[#A3A3A3]">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 px-4 text-center text-[#6b6b75] text-sm">
          <p>¿Preguntas? Escríbenos al WhatsApp</p>
          <p className="mt-4">© 2025 CreaTuActivo.com</p>
        </footer>
      </div>
    </main>
  );
}
