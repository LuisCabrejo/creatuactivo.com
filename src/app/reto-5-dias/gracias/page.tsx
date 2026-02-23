/**
 * Copyright © 2026 CreaTuActivo.com
 * RETO 5 DÍAS - BRIDGE PAGE / THANK YOU
 * v2.0 - INDUSTRIAL LUXURY (Hard Surface)
 * Epiphany Bridge: La historia de Luis + Instrucciones del reto
 */

import { IndustrialHeader } from '@/components/IndustrialHeader';

export const metadata = {
  title: 'Estás Dentro | Reto 5 Días - CreaTuActivo',
  description: 'Confirmación de registro al Reto de 5 Días de Soberanía Financiera.',
  robots: 'noindex, nofollow', // No indexar página de gracias
};

const C = {
  gold: '#E5C279',
  amber: '#F59E0B',
  cyan: '#38BDF8',
  obsidian: '#0B0C0C',
  gunmetal: '#16181D',
  textMain: '#E5E5E5',
  textMuted: '#A3A3A3',
  textDim: '#6b6b75',
};

export default function GraciasPage() {
  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        .whatsapp-cta-btn {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          padding: 16px 32px;
          background: linear-gradient(135deg, ${C.amber}, #E9A23B);
          color: #000;
          font-weight: 700;
          font-size: 0.95rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          text-decoration: none;
          font-family: 'Rajdhani', sans-serif;
          clip-path: polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px);
          transition: all 0.2s ease;
        }
        .whatsapp-cta-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px ${C.amber}40;
        }
      `}} />
      <main
        className="min-h-screen text-[#E5E5E5]"
        style={{
          position: 'relative',
          backgroundImage: `linear-gradient(rgba(12,12,12,0.62), rgba(12,12,12,0.62)), url('/images/servilleta/fondo-global-hormigon.jpg?v=20260208')`,
          backgroundSize: 'cover, 600px 600px',
          backgroundRepeat: 'no-repeat, repeat',
          backgroundAttachment: 'scroll, scroll',
        }}
      >
      <div className="relative z-10">
        {/* ═══════════════════════════════════════════════════════════════
            HEADER: Pasillo Industrial (Header Dramático)
            ═══════════════════════════════════════════════════════════════ */}
        <IndustrialHeader
          title="ACCESO CONFIRMADO"
          subtitle="Tu cupo en el Reto de 5 Días está asegurado"
          refCode="RETO_5D_BRIDGE_V2"
          imageSrc="/images/header-gracias.jpg"
          imageAlt=""
        />

        {/* ═══════════════════════════════════════════════════════════════
            SUCCESS MESSAGE: Check Hexagonal
            ═══════════════════════════════════════════════════════════════ */}
        <section className="py-12 px-4">
          <div className="max-w-2xl mx-auto text-center">
            {/* Check Icon - HEXÁGONO (no círculo) */}
            <div
              style={{
                width: '80px',
                height: '80px',
                margin: '0 auto 1.5rem',
                background: 'rgba(245, 158, 11, 0.15)',
                clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg className="w-10 h-10" style={{ color: C.gold }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h1
              className="text-4xl sm:text-5xl mb-4"
              style={{ fontFamily: "'Playfair Display', Georgia, serif", color: C.gold }}
            >
              ¡Estás dentro!
            </h1>

            <p className="text-xl mb-4" style={{ color: C.textMuted }}>
              Tu lugar en el Reto de 5 Días está confirmado.
            </p>
            <p className="text-sm" style={{ color: C.textDim, fontFamily: "'Roboto Mono', monospace", letterSpacing: '0.1em' }}>
              ESTADO: ACTIVO · DÍAS RESTANTES: 5
            </p>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            BRIDGE SECTION: Epiphany Bridge Story
            ═══════════════════════════════════════════════════════════════ */}
        <section className="py-16 px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  textTransform: 'uppercase',
                  letterSpacing: '0.2em',
                  color: `${C.gold}B3`,
                  fontFamily: "'Roboto Mono', monospace",
                }}
              >
                Mientras esperas...
              </span>
              <h2
                className="text-3xl sm:text-4xl mt-4 mb-4"
                style={{ fontFamily: "'Playfair Display', Georgia, serif", color: C.textMain }}
              >
                Por qué creé este reto
              </h2>
              <p style={{ color: C.textMuted }}>
                Un video corto de 3 minutos que te preparará para lo que viene
              </p>
            </div>

            {/* Video Epifanía - Bridge Page */}
            <div
              style={{
                aspectRatio: '16/9',
                background: C.obsidian,
                border: `1px solid ${C.gold}26`,
                marginBottom: '2rem',
                overflow: 'hidden',
              }}
            >
              <video
                controls
                preload="none"
                poster={process.env.NEXT_PUBLIC_VIDEO_EPIFANIA_POSTER}
                playsInline
                style={{ width: '100%', height: '100%', display: 'block' }}
              >
                <source src={process.env.NEXT_PUBLIC_VIDEO_EPIFANIA_1080P} type="video/mp4" />
                <source src={process.env.NEXT_PUBLIC_VIDEO_EPIFANIA_720P} type="video/mp4" />
              </video>
            </div>

            {/* WhatsApp VIP CTA - INDUSTRIAL BUTTON */}
            <div
              style={{
                background: 'rgba(22, 24, 29, 0.75)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: `1px solid ${C.gold}40`,
                padding: '2rem',
                marginBottom: '2rem',
              }}
            >
              <div className="text-center">
                <h3
                  className="text-xl font-medium mb-4"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  <span style={{ color: C.gold }}>Paso Final</span>
                </h3>
                <p className="mb-6" style={{ color: C.textMuted }}>
                  Para garantizar que recibas los enlaces de acceso cada día
                  (y evitar que caigan en spam), he habilitado un canal VIP directo en WhatsApp.
                </p>
                <p className="text-sm mb-6" style={{ color: C.textDim }}>
                  Haz clic abajo para confirmar tu cupo y recibir tu primera instrucción personal.
                </p>
                <a
                  href="https://wa.me/573215193909?text=Hola%20Luis,%20ya%20vi%20el%20video%20y%20quiero%20activar%20mi%20acceso%20al%20Reto."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="whatsapp-cta-btn"
                >
                  <span>👉</span>
                  ACTIVAR ACCESO VIP EN WHATSAPP
                </a>
              </div>
            </div>

            {/* Story Summary - Glass Container */}
            <div
              style={{
                background: 'rgba(22, 24, 29, 0.70)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                padding: '2rem',
                border: `1px solid ${C.gold}26`,
              }}
            >
              <h3
                className="text-2xl mb-6"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Mi historia (versión corta)
              </h3>

              <div className="space-y-4" style={{ color: C.textMuted }}>
                <p>
                  Cuando estaba de novio con mi esposa, la llevé a un mirador en los Llanos que se llama{' '}
                  <strong style={{ color: C.textMain }}>Buena Vista</strong>. Ahí le hice tres promesas:
                  una casa de campo, compras sin mirar la etiqueta, y tres hijos.
                </p>
                <p>
                  <strong style={{ color: C.textMain }}>Catorce años después...</strong> de las tres promesas,
                  solo le había cumplido con los tres hijos.
                </p>
                <p>
                  No era por falta de esfuerzo. Mi vida se había convertido en lo que llamo el{' '}
                  <span style={{ color: C.gold, fontWeight: 500 }}>&quot;Plan por Defecto&quot;</span>: trabajar como loco
                  para pagar las cuentas, y repetir al mes siguiente.
                </p>
                <p>
                  Encontré un modelo diferente. En 2.5 años, fui el #1 de mi organización. Pero mi éxito no se duplicaba.
                  Lo que para mí era natural, para otros era una lucha constante.
                </p>
                <p>
                  <strong style={{ color: C.textMain }}>Esa fue mi primera epifanía:</strong> un sistema que solo funciona
                  para algunos no es una solución real.
                </p>
                <p>
                  Después vino el e-commerce. Otra vez funcionó para mí, pero requería saber de marketing, SEO, logística...{' '}
                  <strong style={{ color: C.textMain }}>Segunda epifanía:</strong> el problema no era la gente, era el modelo.
                </p>
                <p style={{ color: C.gold, fontWeight: 500, fontSize: '1.125rem', marginTop: '1.5rem' }}>
                  &quot;La soberanía financiera no se trata de lujos. Se trata de poder cumplir tu palabra.&quot;
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            WHAT TO EXPECT: Días del Reto (Tarjetas Industriales)
            ═══════════════════════════════════════════════════════════════ */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2
                className="text-3xl mb-4"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
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
                  style={{
                    background: 'rgba(22, 24, 29, 0.80)',
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)',
                    border: `1px solid ${C.gold}26`,
                    borderTop: `3px solid ${C.cyan}`,
                    padding: '1rem',
                    textAlign: 'center',
                  }}
                >
                  <div
                    className="text-sm font-medium mb-2"
                    style={{
                      color: C.gold,
                      fontFamily: "'Roboto Mono', monospace",
                      letterSpacing: '0.1em',
                    }}
                  >
                    DÍA {item.dia}
                  </div>
                  <div className="font-medium mb-1" style={{ color: C.textMain }}>{item.titulo}</div>
                  <div className="text-xs" style={{ color: C.textDim }}>{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            ACTION ITEMS: Pasos a seguir (Cuadrados, no círculos)
            ═══════════════════════════════════════════════════════════════ */}
        <section
          className="py-16 px-4"
          style={{
            background: 'rgba(22, 24, 29, 0.5)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
          }}
        >
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2
                className="text-2xl mb-4"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Mientras tanto, haz esto:
              </h2>
            </div>

            <div className="space-y-4">
              {[
                { num: 1, text: 'Activa tu acceso VIP en WhatsApp (botón arriba)' },
                { num: 2, text: 'Revisa tu correo y bandeja de spam' },
                { num: 3, text: 'Bloquea 15 minutos al día para el reto' },
              ].map((item) => (
                <div
                  key={item.num}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    background: C.obsidian,
                    border: `1px solid ${C.gold}26`,
                    padding: '1rem',
                  }}
                >
                  {/* CUADRADO (no círculo) */}
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      background: C.amber,
                      color: C.obsidian,
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      fontFamily: "'Rajdhani', sans-serif",
                      fontSize: '1.25rem',
                    }}
                  >
                    {item.num}
                  </div>
                  <span style={{ color: C.textMuted }}>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            FOOTER
            ═══════════════════════════════════════════════════════════════ */}
        <footer className="py-8 px-4 text-center text-sm" style={{ color: C.textDim }}>
          <p>¿Preguntas? Escríbenos al WhatsApp</p>
          <p className="mt-4" style={{ fontFamily: "'Roboto Mono', monospace", fontSize: '0.75rem', letterSpacing: '0.1em' }}>
            © 2026 CREATUACTIVO.COM · TODOS LOS DERECHOS RESERVADOS
          </p>
        </footer>
      </div>
    </main>
    </>
  );
}
