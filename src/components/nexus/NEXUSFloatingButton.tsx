'use client';
import React, { useState, useEffect } from 'react';
import NEXUSWidget from './NEXUSWidget';

interface TrackingState {
  isReady: boolean;
  hasError: boolean;
  retryCount: number;
}

const NEXUSFloatingButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [trackingState, setTrackingState] = useState<TrackingState>({
    isReady: false,
    hasError: false,
    retryCount: 0
  });

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let retryTimeoutId: NodeJS.Timeout;

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
          setTrackingState(prev => ({
            ...prev,
            isReady: true,
            hasError: false
          }));
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
      if (!checkTrackingReady() && trackingState.retryCount < 10) {
        setTrackingState(prev => ({
          ...prev,
          retryCount: prev.retryCount + 1
        }));

        retryTimeoutId = setTimeout(pollForTracking, 500);
      } else if (trackingState.retryCount >= 10) {
        console.warn('⚠️ NEXUS: Timeout esperando Framework IAA - Activando modo fallback');
        setTrackingState(prev => ({
          ...prev,
          isReady: true, // Permitir funcionar en modo degradado
          hasError: true
        }));
      }
    };

    // 🔧 FIX 4: Timeout inicial más agresivo
    timeoutId = setTimeout(() => {
      if (!trackingState.isReady) {
        pollForTracking();
      }
    }, 1000);

    // 🔧 FIX 5: Fallback absoluto después de 10 segundos
    const absoluteTimeoutId = setTimeout(() => {
      if (!trackingState.isReady) {
        console.warn('🚨 NEXUS: Activando modo emergency - Framework IAA no disponible');
        setTrackingState({
          isReady: true,
          hasError: true,
          retryCount: 999
        });
      }
    }, 10000);

    return () => {
      window.removeEventListener('nexusTrackingReady', handleTrackingReady as EventListener);
      if (timeoutId) clearTimeout(timeoutId);
      if (retryTimeoutId) clearTimeout(retryTimeoutId);
      if (absoluteTimeoutId) clearTimeout(absoluteTimeoutId);
    };
  }, [trackingState.retryCount, trackingState.isReady]);

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

  // 🔧 FIX 7: Tooltip dinámico basado en estado
  const getTooltipText = () => {
    if (!trackingState.isReady) {
      return 'Inicializando sistema...';
    }

    if (trackingState.hasError) {
      return 'Sistema en modo degradado - Click para continuar';
    }

    return 'Descubre cómo construir patrimonio con tecnología';
  };

  return (
    <>
      {/* Floating Button - Con verificación de estado */}
      <button
        data-nexus-button
        className="fixed bottom-6 right-6 w-16 h-16 rounded-full shadow-2xl z-40 flex items-center justify-center transition-all duration-300 hover:scale-110 group"
        style={getButtonStyles()}
        onClick={handleButtonClick}
        title={getTooltipText()}
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

        {/* Tooltip mejorado */}
        <div className="absolute right-full mr-4 px-3 py-2 bg-slate-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
          {getTooltipText()}
          <div className="absolute top-1/2 -right-1 transform -translate-y-1/2 w-2 h-2 bg-slate-800 rotate-45"></div>
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
