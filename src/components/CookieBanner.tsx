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
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t-2 border-amber-500 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Texto */}
          <div className="flex-1 text-sm text-gray-700">
            <p className="font-medium text-gray-900 mb-1">
              🍪 Usamos cookies para mejorar tu experiencia
            </p>
            <p className="text-gray-600">
              Utilizamos cookies y tecnologías similares para personalizar tu experiencia y analizar el tráfico del sitio.
              Al hacer clic en "Aceptar", aceptas nuestro uso de cookies según nuestra{' '}
              <Link
                href="/privacidad"
                className="text-amber-600 hover:text-amber-700 underline font-medium"
                target="_blank"
              >
                Política de Privacidad
              </Link>
              {' '}y cumplimos con la Ley 1581/2012 de Colombia.
            </p>
          </div>

          {/* Botones */}
          <div className="flex gap-3 shrink-0">
            <button
              onClick={handleReject}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
            >
              Rechazar
            </button>
            <button
              onClick={handleAccept}
              className="px-6 py-2 text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              Aceptar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
