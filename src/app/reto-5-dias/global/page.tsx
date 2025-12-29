/**
 * Copyright © 2025 CreaTuActivo.com
 * VARIACIÓN C - REVERSE SQUEEZE PAGE
 * Para el mercado de "Latinos en el extranjero"
 *
 * Formato: Entrega valor ANTES de pedir el email (Reciprocidad)
 * A/B Test: /reto-5-dias/global
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RetoGlobalPage() {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
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
          source: 'reto-5-dias-global',
          step: 'reto_registered',
          variant: 'C_global',
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
    <main className="min-h-screen bg-[#0a0a0f] text-[#f5f5f5] flex flex-col">
      {/* Gradient Background */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, rgba(212, 175, 55, 0.08) 0%, transparent 50%)'
        }}
      />

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12 relative z-10">
        <div className="w-full max-w-lg">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-[#D4AF37] flex items-center justify-center">
                <span className="text-[#0a0a0f] font-bold text-xl" style={{ fontFamily: 'Georgia, serif' }}>C</span>
              </div>
              <span className="text-lg font-medium">
                Crea<span className="text-[#D4AF37]">Tu</span>Activo
              </span>
            </Link>
          </div>

          {/* Card */}
          <div className="bg-[#12121a] border border-[#2a2a35] rounded-2xl p-8 sm:p-10">
            {/* PRE-TITULAR */}
            <div className="text-center mb-6">
              <span className="inline-flex items-center gap-2 text-sm text-[#a0a0a8] bg-[#1a1a24] px-4 py-2 rounded-full border border-[#2a2a35]">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                Para latinos en USA, Europa y el mundo
              </span>
            </div>

            {/* TITULAR */}
            <h1
              className="text-2xl sm:text-3xl text-center leading-tight mb-4"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              Ya demostraste que puedes{' '}
              <span className="text-[#D4AF37]">sacrificarte lejos de casa</span>
            </h1>

            {/* SUB-TITULAR */}
            <p className="text-center text-[#a0a0a8] mb-6 text-sm sm:text-base">
              Ahora construye el activo que te permita{' '}
              <span className="text-[#f5f5f5] font-medium">regresar cuando quieras</span>.
            </p>

            {!showForm ? (
              <>
                {/* VALOR PRIMERO - Reverse Squeeze */}
                <div className="p-5 rounded-xl bg-[#0a0a0f] border border-[#2a2a35] mb-6">
                  <h3 className="font-semibold text-[#f5f5f5] mb-3 text-center">
                    La trampa del migrante exitoso
                  </h3>
                  <ul className="space-y-3 text-sm text-[#a0a0a8]">
                    <li className="flex items-start gap-2">
                      <span className="text-[#D4AF37] mt-1">1.</span>
                      <span>Ganas en dólares/euros, pero <strong className="text-[#f5f5f5]">gastas en dólares/euros</strong></span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#D4AF37] mt-1">2.</span>
                      <span>Envías remesas que se <strong className="text-[#f5f5f5]">consumen, no se invierten</strong></span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#D4AF37] mt-1">3.</span>
                      <span>Sin activo, <strong className="text-[#f5f5f5]">regresar = empezar de cero</strong></span>
                    </li>
                  </ul>
                </div>

                {/* LA SOLUCIÓN */}
                <div className="p-5 rounded-xl bg-[#D4AF37]/5 border border-[#D4AF37]/20 mb-6">
                  <h3 className="font-semibold text-[#D4AF37] mb-3 text-center">
                    El modelo 100% Digital
                  </h3>
                  <p className="text-sm text-[#a0a0a8] text-center mb-3">
                    Usa tu capital (dólares) para construir una red que genera en automático.
                    <strong className="text-[#f5f5f5]"> Sin tiempo extra. Sin vender.</strong>
                  </p>
                  <ul className="flex justify-center gap-4 text-xs text-[#6b6b75]">
                    <li className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      Inversión ~$100 USD
                    </li>
                    <li className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      IA vende por ti
                    </li>
                    <li className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      60+ países
                    </li>
                  </ul>
                </div>

                {/* CTA para mostrar form */}
                <button
                  onClick={() => setShowForm(true)}
                  className="w-full py-4 bg-[#D4AF37] hover:bg-[#E8C547] text-[#0a0a0f] font-semibold text-lg rounded-xl transition-all duration-300"
                >
                  Quiero Saber Cómo Funciona
                </button>
              </>
            ) : (
              <>
                {/* Form aparece después de dar valor */}
                <p className="text-center text-[#a0a0a8] mb-4 text-sm">
                  En 5 días te explico el modelo completo por WhatsApp.
                  <br />
                  <span className="text-[#f5f5f5]">Sin compromiso. Sin presión.</span>
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    type="text"
                    placeholder="Tu nombre"
                    value={formData.nombre}
                    onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
                    required
                    className="w-full px-4 py-4 bg-[#1a1a24] border border-[#2a2a35] rounded-xl text-[#f5f5f5] placeholder-[#6b6b75] focus:outline-none focus:border-[#D4AF37] transition-colors"
                  />
                  <input
                    type="email"
                    placeholder="Tu mejor email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    required
                    className="w-full px-4 py-4 bg-[#1a1a24] border border-[#2a2a35] rounded-xl text-[#f5f5f5] placeholder-[#6b6b75] focus:outline-none focus:border-[#D4AF37] transition-colors"
                  />
                  <input
                    type="tel"
                    placeholder="Tu WhatsApp (con código de país)"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData(prev => ({ ...prev, whatsapp: e.target.value }))}
                    required
                    className="w-full px-4 py-4 bg-[#1a1a24] border border-[#2a2a35] rounded-xl text-[#f5f5f5] placeholder-[#6b6b75] focus:outline-none focus:border-[#D4AF37] transition-colors"
                  />

                  {error && (
                    <p className="text-red-400 text-sm text-center">{error}</p>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-[#D4AF37] hover:bg-[#E8C547] text-[#0a0a0f] font-semibold text-lg rounded-xl transition-all duration-300 disabled:opacity-70"
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
                      'Empezar el Reto Gratis'
                    )}
                  </button>
                </form>
              </>
            )}

            {/* Trust */}
            <div className="mt-6 flex items-center justify-center gap-4 text-xs text-[#6b6b75]">
              <span>100% gratis</span>
              <span>•</span>
              <span>En español</span>
              <span>•</span>
              <span>5 días por WhatsApp</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-4 text-center text-[#6b6b75] text-xs relative z-10">
        <Link href="/privacidad" className="hover:text-[#a0a0a8] transition-colors">
          Política de Privacidad
        </Link>
        <span className="mx-2">•</span>
        <span>© 2025 CreaTuActivo.com</span>
      </footer>
    </main>
  );
}
