/**
 * Copyright © 2025 CreaTuActivo.com
 * RETO 5 DÍAS - BRIDGE PAGE / THANK YOU
 * Epiphany Bridge: La historia de Luis + Instrucciones del reto
 */

import Link from 'next/link';

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
              <div className="w-10 h-10 rounded-lg bg-[#C5A059] flex items-center justify-center">
                <span className="text-[#0F1115] font-bold text-xl" style={{ fontFamily: 'Georgia, serif' }}>C</span>
              </div>
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

            <p className="text-xl text-[#A3A3A3] mb-8">
              Tu lugar en el Reto de 5 Días está confirmado.
            </p>

            {/* WhatsApp Alert */}
            <div className="bg-[#1A1D23] border border-[rgba(197, 160, 89, 0.15)] rounded-2xl p-6 mb-12">
              <div className="flex items-center justify-center gap-3 mb-4">
                <svg className="w-8 h-8 text-[#25D366]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                <span className="text-xl font-medium">Revisa tu WhatsApp</span>
              </div>
              <p className="text-[#A3A3A3]">
                En los próximos minutos recibirás un mensaje con las instrucciones para el Día 1.
              </p>
            </div>
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
                { num: 1, text: 'Guarda el número de WhatsApp en tus contactos', icon: 'save' },
                { num: 2, text: 'Revisa tu bandeja de spam (por si acaso)', icon: 'email' },
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
