/**
 * Copyright © 2025 CreaTuActivo.com
 * RETO 5 DÍAS - SQUEEZE PAGE CON REFERIDO
 * Versión con tracking de constructor que invita
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function Reto5DiasRefPage() {
  const router = useRouter();
  const params = useParams();
  const ref = params.ref as string;

  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    whatsapp: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [constructorName, setConstructorName] = useState<string | null>(null);

  // Obtener nombre del constructor que invita
  useEffect(() => {
    if (ref) {
      // Guardar ref en localStorage para tracking
      localStorage.setItem('constructorRef', ref);

      // TODO: Fetch constructor name from API
      // Por ahora usar ref como fallback
      // fetch(`/api/constructor/${ref}`).then(...)
    }
  }, [ref]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

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
          referrer: ref, // Tracking del constructor
        }),
      });

      if (!response.ok) throw new Error('Error');

      router.push('/reto-5-dias/gracias');
    } catch {
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
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2">
              <Image src="/header.png" alt="CreaTuActivo Logo" width={40} height={40} priority className="object-contain" />
              <span className="text-lg font-bold text-white" style={{ fontFamily: 'var(--font-oswald), sans-serif' }}>CreaTuActivo</span>
            </Link>
          </div>

          {/* Referrer Badge (if we have constructor name) */}
          {constructorName && (
            <div className="text-center mb-6">
              <span className="text-sm text-[#A3A3A3]">
                Invitado por <span className="text-[#E5C279] font-medium">{constructorName}</span>
              </span>
            </div>
          )}

          {/* Card */}
          <div className="bg-[#16181D] border border-[rgba(229, 194, 121, 0.15)] rounded-2xl p-8">
            {/* Badge - Urgencia */}
            <div className="text-center mb-6">
              <span className="inline-flex items-center gap-2 text-sm text-[#A3A3A3] bg-[#16181D] px-4 py-2 rounded-full border border-[rgba(229, 194, 121, 0.15)]">
                <span className="w-2 h-2 bg-[#F59E0B] rounded-full animate-pulse" />
                Próximo reto inicia en 48 horas
              </span>
            </div>

            {/* Hook - Headline */}
            <h1
              className="text-3xl sm:text-4xl text-center leading-tight mb-4"
              style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
            >
              En <span className="text-[#E5C279]">5 días</span> vas a entender
              <br />
              lo que nadie te explica
            </h1>

            {/* Subheadline - Promise */}
            <p className="text-center text-[#A3A3A3] mb-8">
              Un reto gratuito por WhatsApp donde descubrirás por qué tu plan actual
              no te llevará a la libertad que buscas.
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Tu nombre"
                value={formData.nombre}
                onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
                required
                className="w-full px-4 py-4 bg-[#16181D] border border-[rgba(229, 194, 121, 0.15)] rounded-xl text-[#E5E5E5] placeholder-[#6b6b75] focus:outline-none focus:border-[#E5C279] transition-colors"
              />
              <input
                type="email"
                placeholder="Tu mejor email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                required
                className="w-full px-4 py-4 bg-[#16181D] border border-[rgba(229, 194, 121, 0.15)] rounded-xl text-[#E5E5E5] placeholder-[#6b6b75] focus:outline-none focus:border-[#E5C279] transition-colors"
              />
              <input
                type="tel"
                placeholder="Tu WhatsApp (+57 300...)"
                value={formData.whatsapp}
                onChange={(e) => setFormData(prev => ({ ...prev, whatsapp: e.target.value }))}
                required
                className="w-full px-4 py-4 bg-[#16181D] border border-[rgba(229, 194, 121, 0.15)] rounded-xl text-[#E5E5E5] placeholder-[#6b6b75] focus:outline-none focus:border-[#E5C279] transition-colors"
              />

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
                  'Quiero Unirme GRATIS'
                )}
              </button>
            </form>

            {/* Trust Elements */}
            <div className="mt-6 flex items-center justify-center gap-4 text-xs text-[#6b6b75]">
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Sin spam
              </span>
              <span>•</span>
              <span>100% gratis</span>
              <span>•</span>
              <span>Sin tarjeta</span>
            </div>
          </div>

          {/* Social Proof */}
          <p className="text-center text-[#6b6b75] text-sm mt-6">
            +2,400 personas ya tomaron el reto
          </p>
        </div>
      </div>

      {/* Minimal Footer */}
      <footer className="py-4 text-center text-[#6b6b75] text-xs relative z-10">
        <Link href="/privacidad" className="hover:text-[#A3A3A3] transition-colors">
          Política de Privacidad
        </Link>
        <span className="mx-2">•</span>
        <span>© 2025 CreaTuActivo.com</span>
      </footer>
    </main>
  );
}
