/**
 * Copyright © 2026 CreaTuActivo.com
 * RETO 5 DÍAS - SQUEEZE PAGE (Russell Brunson Style)
 * Página minimalista de captura para tráfico frío (ads/redes)
 *
 * THE ARCHITECT'S SUITE - Bimetallic System v3.0
 * Gold (#C5A059): CTAs, highlights, accents
 * Titanium (#94A3B8): Structural elements
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function Reto5DiasPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    whatsapp: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/funnel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          name: formData.nombre,
          whatsapp: formData.whatsapp,
          source: 'reto-5-dias',
          step: 'reto_registered',
        }),
      });

      if (!response.ok) throw new Error('Error');

      // Redirigir a página de gracias (Bridge Page)
      router.push('/reto-5-dias/gracias');
    } catch {
      // Aún así redirigir para no frustrar
      router.push('/reto-5-dias/gracias');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0B0C0C] text-[#E5E5E5] flex flex-col">
      {/* Gradient Background */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, rgba(229, 194, 121, 0.07) 0%, transparent 50%)'
        }}
      />

      {/* Main Content - Centered */}
      <div className="flex-1 flex items-center justify-center px-4 py-12 relative z-10">
        <div className="w-full max-w-lg">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2">
              <Image src="/header.png" alt="CreaTuActivo Logo" width={40} height={40} priority className="object-contain" />
              <span className="text-lg font-bold text-white" style={{ fontFamily: 'var(--font-oswald), sans-serif' }}>CreaTuActivo</span>
            </Link>
          </div>

          {/* Card */}
          <div className="bg-[#16181D] border border-[rgba(229, 194, 121, 0.15)] rounded-2xl p-8 sm:p-10">
            {/* PRE-TITULAR - Cualificación del Lead */}
            <div className="text-center mb-6">
              <span className="inline-flex items-center gap-2 text-sm text-[#A3A3A3] bg-[#16181D] px-4 py-2 rounded-full border border-[rgba(229, 194, 121, 0.15)]">
                <span className="w-2 h-2 bg-[#F59E0B] rounded-full animate-pulse" />
                Para profesionales que buscan diversificación inteligente
              </span>
            </div>

            {/* TITULAR (HOOK) - Identity Shift */}
            <h1
              className="text-2xl sm:text-3xl text-center leading-tight mb-4 font-serif"
            >
              Pasa de <span className="text-[#A3A3A3]">DEPENDIENTE</span> a{' '}
              <span className="text-[#E5C279]">SOBERANO</span>
            </h1>

            {/* SUB-TITULAR - Mecanismo Único */}
            <p className="text-center text-[#A3A3A3] mb-6 text-sm sm:text-base">
              El Plan de 5 Días para construir tu{' '}
              <span className="text-[#E5E5E5] font-medium">Cartera de Activos Híbrida</span>.
              <br className="hidden sm:block" />
              <span className="text-[#E5C279]">Modelo Tri-Modal</span> + Tecnología de IA Propietaria.
            </p>

            {/* HISTORIA (MICRO) - Epiphany Bridge */}
            <div className="p-4 rounded-xl bg-[#0B0C0C] border border-[rgba(229, 194, 121, 0.15)] mb-6">
              <p className="text-sm text-[#A3A3A3] italic text-center leading-relaxed">
                &quot;A los 40 años descubrí que había comprado un empleo, no construido un activo.
                Esta es la hoja de ruta matemática para salir de la trampa.&quot;
              </p>
              <p className="text-xs text-[#64748B] text-center mt-2">
                — Luis Cabrejo, Arquitecto de Activos
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Tu nombre"
                value={formData.nombre}
                onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
                required
                className="w-full px-4 py-4 bg-[#16181D] border border-[rgba(229, 194, 121, 0.15)] rounded-xl text-[#E5E5E5] placeholder-[#64748B] focus:outline-none focus:border-[#E5C279] transition-colors"
              />
              <input
                type="email"
                placeholder="Tu mejor email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                required
                className="w-full px-4 py-4 bg-[#16181D] border border-[rgba(229, 194, 121, 0.15)] rounded-xl text-[#E5E5E5] placeholder-[#64748B] focus:outline-none focus:border-[#E5C279] transition-colors"
              />
              <input
                type="tel"
                placeholder="Tu WhatsApp (+57 300...)"
                value={formData.whatsapp}
                onChange={(e) => setFormData(prev => ({ ...prev, whatsapp: e.target.value }))}
                required
                className="w-full px-4 py-4 bg-[#16181D] border border-[rgba(229, 194, 121, 0.15)] rounded-xl text-[#E5E5E5] placeholder-[#64748B] focus:outline-none focus:border-[#E5C279] transition-colors"
              />

              {error && (
                <p className="text-red-400 text-sm text-center">{error}</p>
              )}

              {/* CTA - Micro-compromiso */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-haptic w-full py-4 font-industrial font-bold text-lg tracking-widest uppercase rounded-xl transition-all duration-300 disabled:opacity-70"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Reservando...
                  </span>
                ) : (
                  'Reservar mi Cupo GRATIS'
                )}
              </button>
            </form>

            {/* ANTI-GANCHOS - Manejo objeciones preventivo */}
            <div className="mt-6 pt-6 border-t border-[rgba(229, 194, 121, 0.15)]">
              <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-[#64748B]">
                <span className="flex items-center gap-1">
                  <svg className="w-3.5 h-3.5 text-[#E5C279]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Sin perseguir amigos
                </span>
                <span className="flex items-center gap-1">
                  <svg className="w-3.5 h-3.5 text-[#E5C279]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Sin inventario en casa
                </span>
                <span className="flex items-center gap-1">
                  <svg className="w-3.5 h-3.5 text-[#E5C279]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Sin ventas de los 90
                </span>
              </div>
            </div>

            {/* Trust Elements */}
            <div className="mt-4 flex items-center justify-center gap-4 text-xs text-[#64748B]">
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Sin spam
              </span>
              <span>•</span>
              <span>100% gratis</span>
              <span>•</span>
              <span>5 días por WhatsApp</span>
            </div>
          </div>

          {/* Social Proof */}
          <p className="text-center text-[#64748B] text-sm mt-6">
            +2,400 personas ya tomaron el reto
          </p>
        </div>
      </div>

      {/* Minimal Footer */}
      <footer className="py-4 text-center text-[#64748B] text-xs relative z-10">
        <Link href="/privacidad" className="hover:text-[#A3A3A3] transition-colors">
          Política de Privacidad
        </Link>
        <span className="mx-2">•</span>
        <span>© 2026 CreaTuActivo.com</span>
      </footer>
    </main>
  );
}
