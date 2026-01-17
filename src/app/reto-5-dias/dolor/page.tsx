/**
 * Copyright © 2025 CreaTuActivo.com
 * VARIACIÓN A - DOLOR/MIEDO
 * Hook enfocado en el perfil "Empleado frustrado"
 *
 * A/B Test: /reto-5-dias/dolor
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RetoDolorPage() {
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
          source: 'reto-5-dias-dolor',
          step: 'reto_registered',
          variant: 'A_dolor',
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
    <main className="min-h-screen bg-[#0F1115] text-[#E5E5E5] flex flex-col">
      {/* Gradient Background */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, rgba(197, 160, 89, 0.08) 0%, transparent 50%)'
        }}
      />

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12 relative z-10">
        <div className="w-full max-w-lg">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-[#C5A059] flex items-center justify-center">
                <span className="text-[#0F1115] font-bold text-xl" style={{ fontFamily: 'Georgia, serif' }}>C</span>
              </div>
              <span className="text-lg font-medium">
                Crea<span className="text-[#C5A059]">Tu</span>Activo
              </span>
            </Link>
          </div>

          {/* Card */}
          <div className="bg-[#1A1D23] border border-[rgba(197, 160, 89, 0.15)] rounded-2xl p-8 sm:p-10">
            {/* PRE-TITULAR */}
            <div className="text-center mb-6">
              <span className="inline-flex items-center gap-2 text-sm text-[#A3A3A3] bg-[#1A1D23] px-4 py-2 rounded-full border border-[rgba(197, 160, 89, 0.15)]">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                Esto me hubiera ahorrado 20 años
              </span>
            </div>

            {/* TITULAR - HOOK DOLOR */}
            <h1
              className="text-2xl sm:text-3xl text-center leading-tight mb-4"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              Hace unos años cometí un error que{' '}
              <span className="text-red-400">me costó 20 años de mi vida</span>
            </h1>

            {/* SUB-TITULAR */}
            <p className="text-center text-[#A3A3A3] mb-6 text-sm sm:text-base">
              Y cómo evitar que te pase a ti.
              <br className="hidden sm:block" />
              En <span className="text-[#C5A059]">5 días</span> te muestro la salida que yo no conocí.
            </p>

            {/* HISTORIA DOLOR */}
            <div className="p-4 rounded-xl bg-[#0F1115] border border-red-500/20 mb-6">
              <p className="text-sm text-[#A3A3A3] leading-relaxed">
                Trabajé 20 años creyendo que el esfuerzo me llevaría a la libertad.
                A los 40 descubrí la verdad: había construido una jaula de oro.
                <span className="text-[#E5E5E5] font-medium"> No cometas mi error.</span>
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
                className="w-full px-4 py-4 bg-[#1A1D23] border border-[rgba(197, 160, 89, 0.15)] rounded-xl text-[#E5E5E5] placeholder-[#6b6b75] focus:outline-none focus:border-[#C5A059] transition-colors"
              />
              <input
                type="email"
                placeholder="Tu mejor email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                required
                className="w-full px-4 py-4 bg-[#1A1D23] border border-[rgba(197, 160, 89, 0.15)] rounded-xl text-[#E5E5E5] placeholder-[#6b6b75] focus:outline-none focus:border-[#C5A059] transition-colors"
              />
              <input
                type="tel"
                placeholder="Tu WhatsApp (+57 300...)"
                value={formData.whatsapp}
                onChange={(e) => setFormData(prev => ({ ...prev, whatsapp: e.target.value }))}
                required
                className="w-full px-4 py-4 bg-[#1A1D23] border border-[rgba(197, 160, 89, 0.15)] rounded-xl text-[#E5E5E5] placeholder-[#6b6b75] focus:outline-none focus:border-[#C5A059] transition-colors"
              />

              {error && (
                <p className="text-red-400 text-sm text-center">{error}</p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-[#C5A059] hover:bg-[#E8C547] text-[#0F1115] font-semibold text-lg rounded-xl transition-all duration-300 disabled:opacity-70"
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
                  'Quiero Evitar Ese Error'
                )}
              </button>
            </form>

            {/* Trust */}
            <div className="mt-6 flex items-center justify-center gap-4 text-xs text-[#6b6b75]">
              <span>100% gratis</span>
              <span>•</span>
              <span>Sin spam</span>
              <span>•</span>
              <span>5 días por WhatsApp</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
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
