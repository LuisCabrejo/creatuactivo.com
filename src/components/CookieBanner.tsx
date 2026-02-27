'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Verificar si el usuario ya dio consentimiento
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) {
      // Mostrar banner después de 1 segundo (mejor UX)
      setTimeout(() => setShowBanner(true), 1000);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie_consent', 'accepted');
    localStorage.setItem('cookie_consent_date', new Date().toISOString());
    setShowBanner(false);
  };

  const handleReject = () => {
    localStorage.setItem('cookie_consent', 'rejected');
    localStorage.setItem('cookie_consent_date', new Date().toISOString());
    setShowBanner(false);

    // Opcional: Deshabilitar tracking si rechaza
    if (typeof window !== 'undefined' && (window as any).FrameworkIAA) {
      (window as any).FrameworkIAA.trackingEnabled = false;
    }
  };

  if (!showBanner) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 shadow-lg"
      style={{
        background: 'rgba(22, 24, 29, 0.97)',
        backdropFilter: 'blur(12px)',
        borderTop: '1px solid rgba(229, 194, 121, 0.15)',
      }}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2 sm:py-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4">
          {/* Texto */}
          <div className="flex-1 text-xs sm:text-sm" style={{ color: '#A3A3A3' }}>
            <p className="leading-tight">
              Usamos cookies para mejorar tu experiencia.{' '}
              <Link
                href="/privacidad"
                className="underline"
                style={{ color: '#E5C279' }}
                target="_blank"
              >
                Política de Privacidad
              </Link>
            </p>
          </div>

          {/* Botones */}
          <div className="flex gap-2 shrink-0 w-full sm:w-auto">
            <button
              onClick={handleReject}
              className="flex-1 sm:flex-none px-4 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-full transition-colors"
              style={{
                color: '#94A3B8',
                background: 'rgba(148, 163, 184, 0.08)',
                border: '1px solid rgba(148, 163, 184, 0.25)',
              }}
            >
              Rechazar
            </button>
            <button
              onClick={handleAccept}
              className="flex-1 sm:flex-none px-5 sm:px-7 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold rounded-full transition-all"
              style={{
                background: 'linear-gradient(135deg, #C5A059 0%, #B38B59 100%)',
                color: '#0F1115',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                boxShadow: '0 2px 10px rgba(197, 160, 89, 0.25)',
              }}
            >
              Aceptar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
