/**
 * Copyright © 2025 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * Este software es propiedad privada y confidencial de CreaTuActivo.com.
 * Prohibida su reproducción, distribución o uso sin autorización escrita.
 *
 * Para consultas de licenciamiento: legal@creatuactivo.com
 */

'use client';
import React, { useState, useEffect } from 'react';
import NEXUSWidget from './NEXUSWidget';

interface TrackingState {
  isReady: boolean;
  hasError: boolean;
  retryCount: number;
}

// Configuración de tiempos para el tooltip (en milisegundos)
const TOOLTIP_CONFIG = {
  scrollDelayMs: 5000,        // Aparece 5 segundos después de scroll
  visibleDurationMs: 5000,    // Visible por 5 segundos (antes 8s)
  reappearDelayMs: 120000,    // Reaparece después de 2 minutos (antes 1min)
};

const NEXUSFloatingButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [trackingState, setTrackingState] = useState<TrackingState>({
    isReady: true, // ✅ FIX: Empezar como "ready" para no bloquear UI
    hasError: false,
    retryCount: 0
  });

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let retryTimeoutId: NodeJS.Timeout;
    let retryCount = 0; // ✅ FIX: Variable local en lugar de state

    const checkTrackingReady = () => {
      // Verificar si FrameworkIAA está disponible y funcional
      if (typeof window !== 'undefined') {
        const isFrameworkReady = !!(
          window.FrameworkIAA &&
          window.FrameworkIAA.fingerprint &&
          window.updateProspectData
        );

        if (isFrameworkReady) {
          console.log('✅ NEXUS: Framework IAA listo');
          // No actualizamos state porque ya empezó como ready
          return true;
        }
      }
      return false;
    };

    const handleTrackingReady = (event: CustomEvent) => {
      console.log('🎯 NEXUS: Evento nexusTrackingReady recibido', event.detail);

      if (event.detail && (event.detail.fingerprint || event.detail.prospect)) {
        setTrackingState(prev => ({
          ...prev,
          isReady: true,
          hasError: false
        }));
      }
    };

    // 🔧 FIX 1: Verificación inmediata si ya está listo
    if (checkTrackingReady()) {
      return; // Ya está listo, no necesitamos listeners
    }

    // 🔧 FIX 2: Listener para evento de tracking listo
    window.addEventListener('nexusTrackingReady', handleTrackingReady as EventListener);

    // 🔧 FIX 3: Polling backup para casos edge
    const pollForTracking = () => {
      if (!checkTrackingReady() && retryCount < 10) {
        retryCount++; // ✅ FIX: Incremento local
        retryTimeoutId = setTimeout(pollForTracking, 500);
      } else if (retryCount >= 10) {
        console.warn('⚠️ NEXUS: Timeout esperando Framework IAA - Modo fallback activo');
        // Ya está ready por defecto, no necesitamos actualizar state
      }
    };

    // 🔧 FIX 4: Timeout inicial - solo para logging
    timeoutId = setTimeout(() => {
      checkTrackingReady(); // Verificación silenciosa
    }, 1000);

    // ✅ FIX: Removido fallback absoluto - no necesitamos bloquear UI

    return () => {
      window.removeEventListener('nexusTrackingReady', handleTrackingReady as EventListener);
      if (timeoutId) clearTimeout(timeoutId);
      if (retryTimeoutId) clearTimeout(retryTimeoutId);
    };
  }, []); // ✅ FIX: Sin dependencias para evitar loop infinito

  // 🎯 TOOLTIP: Lógica de aparición/desaparición automática
  useEffect(() => {
    // Si el usuario ya abrió el widget, no mostrar más el tooltip
    if (hasInteracted || isOpen) return;

    let initialTimeout: NodeJS.Timeout;
    let hideTimeout: NodeJS.Timeout;
    let reappearTimeout: NodeJS.Timeout;

    // Función para mostrar tooltip y programar ocultamiento
    const showAndScheduleHide = () => {
      if (hasInteracted || isOpen) return;

      setShowTooltip(true);

      // Ocultar después del tiempo de visibilidad
      hideTimeout = setTimeout(() => {
        setShowTooltip(false);

        // Programar reaparición si no hay interacción
        reappearTimeout = setTimeout(() => {
          showAndScheduleHide();
        }, TOOLTIP_CONFIG.reappearDelayMs);

      }, TOOLTIP_CONFIG.visibleDurationMs);
    };

    // Mostrar tooltip automáticamente después del delay inicial
    initialTimeout = setTimeout(() => {
      showAndScheduleHide();
    }, TOOLTIP_CONFIG.scrollDelayMs);

    return () => {
      if (initialTimeout) clearTimeout(initialTimeout);
      if (hideTimeout) clearTimeout(hideTimeout);
      if (reappearTimeout) clearTimeout(reappearTimeout);
    };
  }, [hasInteracted, isOpen]);

  const handleButtonClick = () => {
    if (!trackingState.isReady) {
      console.log('🚫 NEXUS: Tracking no está listo aún, intentando recargar...');

      // Forzar verificación una vez más
      if (typeof window !== 'undefined' && window.reidentifyProspect) {
        window.reidentifyProspect();
      }

      // Mostrar feedback visual (opcional)
      const button = document.querySelector('[data-nexus-button]') as HTMLElement;
      if (button) {
        button.style.animation = 'pulse 0.5s ease-in-out';
        setTimeout(() => {
          button.style.animation = '';
        }, 500);
      }
      return;
    }

    setHasInteracted(true); // Marcar que el usuario interactuó
    setShowTooltip(false);  // Ocultar tooltip
    setIsOpen(true);
  };

  // 🔧 FIX 6: Estado visual del botón basado en tracking
  const getButtonStyles = () => {
    if (!trackingState.isReady) {
      return {
        background: 'linear-gradient(135deg, #64748b 0%, #475569 100%)', // Gris mientras carga
        opacity: 0.7
      };
    }

    if (trackingState.hasError) {
      return {
        background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)', // Rojo si hay error
        opacity: 0.9
      };
    }

    return {
      background: 'linear-gradient(135deg, #1E40AF 0%, #7C3AED 100%)' // Normal
    };
  };

  return (
    <>
      {/* 🎯 TOOLTIP INTELIGENTE - Aparece tras scroll, con botón para cerrar */}
      {!isOpen && trackingState.isReady && !trackingState.hasError && (
        <div
          className={`fixed bottom-24 right-3 z-40 transition-all duration-500 ${
            showTooltip
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-4 pointer-events-none'
          }`}
        >
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white pl-4 pr-2 py-2 rounded-full shadow-xl flex items-center gap-2">
            <span className="text-sm font-semibold whitespace-nowrap">💬 Habla con NEXUS</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
            </svg>
            {/* Botón para cerrar el tooltip */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowTooltip(false);
                setHasInteracted(true); // No vuelve a aparecer
              }}
              className="ml-1 p-1 hover:bg-white/20 rounded-full transition-colors"
              aria-label="Cerrar sugerencia"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Floating Button - Con verificación de estado */}
      <button
        data-nexus-button
        className="fixed bottom-6 right-6 w-16 h-16 rounded-full shadow-2xl z-40 flex items-center justify-center transition-all duration-300 hover:scale-110 group"
        style={getButtonStyles()}
        onClick={handleButtonClick}
        aria-label="Abrir chat con NEXUS IA"
      >
        <div className="relative">
          {/* 🔧 FIX 8: Icono dinámico basado en estado */}
          {!trackingState.isReady ? (
            // Spinner de carga
            <svg className="w-8 h-8 text-white animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : trackingState.hasError ? (
            // Icono de advertencia
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/>
            </svg>
          ) : (
            // Icono normal
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/>
            </svg>
          )}

          {/* Notification pulse - Solo cuando está listo y sin errores */}
          {trackingState.isReady && !trackingState.hasError && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse">
              <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-75"></div>
            </div>
          )}
        </div>
      </button>

      {/* Widget - Solo se renderiza cuando tracking está listo */}
      {trackingState.isReady && (
        <NEXUSWidget
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
        />
      )}

      {/* 🔧 FIX 9: CSS para animación de pulse personalizada */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      `}</style>
    </>
  );
};

// 🔧 FIX 10: Declarar tipos para window objects si no existen
declare global {
  interface Window {
    FrameworkIAA?: {
      fingerprint?: string;
      prospect?: any;
      updateProspectData?: Function;
    };
    updateProspectData?: Function;
    reidentifyProspect?: Function;
  }
}

export default NEXUSFloatingButton;
