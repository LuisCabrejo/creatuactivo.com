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
    <main className="min-h-screen bg-[#0a0a0f] text-[#f5f5f5]">
      {/* Gradient Background */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, rgba(212, 175, 55, 0.08) 0%, transparent 50%)'
        }}
      />

      <div className="relative z-10">
        {/* Header */}
        <header className="py-6 px-4">
          <div className="max-w-4xl mx-auto">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-[#D4AF37] flex items-center justify-center">
                <span className="text-[#0a0a0f] font-bold text-xl" style={{ fontFamily: 'Georgia, serif' }}>C</span>
              </div>
              <span className="text-lg font-medium">
                Crea<span className="text-[#D4AF37]">Tu</span>Activo
              </span>
            </Link>
          </div>
        </header>

        {/* Success Message */}
        <section className="py-12 px-4">
          <div className="max-w-2xl mx-auto text-center">
            {/* Check Icon */}
            <div className="w-20 h-20 rounded-full bg-[#D4AF37]/20 mx-auto mb-6 flex items-center justify-center">
              <svg className="w-10 h-10 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h1
              className="text-4xl sm:text-5xl mb-4"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              <span className="text-[#D4AF37]">¡Estás dentro!</span>
            </h1>

            <p className="text-xl text-[#a0a0a8] mb-8">
              Tu lugar en el Reto de 5 Días está confirmado.
            </p>

            {/* WhatsApp Alert */}
            <div className="bg-[#12121a] border border-[#2a2a35] rounded-2xl p-6 mb-12">
              <div className="flex items-center justify-center gap-3 mb-4">
                <svg className="w-8 h-8 text-[#25D366]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                <span className="text-xl font-medium">Revisa tu WhatsApp</span>
              </div>
              <p className="text-[#a0a0a8]">
                En los próximos minutos recibirás un mensaje con las instrucciones para el Día 1.
              </p>
            </div>
          </div>
        </section>

        {/* Bridge Section - Epiphany Bridge Story */}
        <section className="py-16 px-4 bg-[#12121a]">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <span className="text-sm font-medium uppercase tracking-widest text-[#D4AF37]/70">
                Mientras esperas...
              </span>
              <h2
                className="text-3xl sm:text-4xl mt-4 mb-4"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                Por qué creé este reto
              </h2>
              <p className="text-[#a0a0a8]">
                Un video corto de 3 minutos que te preparará para lo que viene
              </p>
            </div>

            {/* Video Placeholder */}
            <div className="aspect-video bg-[#1a1a24] rounded-2xl border border-[#2a2a35] flex items-center justify-center mb-8">
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-[#D4AF37]/20 mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-10 h-10 text-[#D4AF37]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
                <p className="text-[#6b6b75] text-sm">Video del Puente de Epifanía</p>
                <p className="text-[#6b6b75] text-xs mt-1">(Próximamente)</p>
              </div>
            </div>

            {/* Story Summary (for now, before video is ready) */}
            <div className="bg-[#0a0a0f] rounded-2xl p-8 border border-[#2a2a35]">
              <h3
                className="text-2xl mb-6"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                La historia corta
              </h3>

              <div className="space-y-4 text-[#a0a0a8]">
                <p>
                  <strong className="text-[#f5f5f5]">A los 40 años estaba quebrado.</strong> 12 años emprendiendo,
                  múltiples negocios, y cada uno terminaba igual: dependiendo de mí 24/7.
                </p>
                <p>
                  Entonces encontré un modelo que funcionaba matemáticamente diferente. No era vender mi tiempo,
                  era construir un <span className="text-[#D4AF37]">activo que generara ingresos sin mi presencia constante</span>.
                </p>
                <p>
                  El problema: la infraestructura para ejecutarlo estaba rota. Tuve que hacerlo de la forma difícil.
                  2.5 años después, era el #1 de mi organización.
                </p>
                <p>
                  <strong className="text-[#f5f5f5]">Y me pregunté:</strong> ¿Qué hubiera pasado si hubiera tenido las herramientas correctas desde el día 1?
                </p>
                <p className="text-[#D4AF37] font-medium">
                  Esa pregunta se convirtió en CreaTuActivo.
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
                  className="bg-[#12121a] border border-[#2a2a35] rounded-xl p-4 text-center"
                >
                  <div className="text-sm font-medium text-[#D4AF37] mb-2">
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
        <section className="py-16 px-4 bg-[#12121a]">
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
                  className="flex items-center gap-4 bg-[#0a0a0f] border border-[#2a2a35] rounded-xl p-4"
                >
                  <div className="w-10 h-10 rounded-full bg-[#D4AF37] text-[#0a0a0f] font-bold flex items-center justify-center flex-shrink-0">
                    {item.num}
                  </div>
                  <span className="text-[#a0a0a8]">{item.text}</span>
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
