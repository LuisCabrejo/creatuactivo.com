'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export interface CapturedData {
  nombre?: string;
  telefono?: string;
  ocupacion?: string;
}

interface NEXUSDataCaptureCardProps {
  capturedData: CapturedData;
  onDismiss: () => void;
  isVisible: boolean;
}

interface FieldConfig {
  key: keyof CapturedData;
  label: string;
  icon: string;
  priority: number;
}

// ✅ v12.0 - Orden actualizado según buenas prácticas: Nombre → Ocupación → WhatsApp
const FIELDS: FieldConfig[] = [
  { key: 'nombre', label: 'Nombre', icon: '👤', priority: 1 },
  { key: 'ocupacion', label: 'Ocupación', icon: '💼', priority: 2 },
  { key: 'telefono', label: 'WhatsApp', icon: '📱', priority: 3 }
];

export function NEXUSDataCaptureCard({
  capturedData,
  onDismiss,
  isVisible
}: NEXUSDataCaptureCardProps) {
  // Calcular progreso
  const completedFields = Object.entries(capturedData).filter(([_, value]) => value).length;
  const totalFields = FIELDS.length;
  const progressPercentage = (completedFields / totalFields) * 100;

  // Si ya se capturaron todos los datos, no mostrar
  if (completedFields === totalFields) {
    return null;
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="sticky top-0 z-50"
          style={{
            background: 'linear-gradient(135deg, rgba(30, 64, 175, 0.12) 0%, rgba(124, 58, 237, 0.12) 50%, rgba(245, 158, 11, 0.12) 100%)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderBottom: '2px solid rgba(245, 158, 11, 0.3)',
            boxShadow: '0 8px 32px rgba(245, 158, 11, 0.15)'
          }}
        >
          <div className="max-w-4xl mx-auto px-3 py-2 sm:px-4 sm:py-3">
            {/* Header - Compacto */}
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-1.5">
                <motion.span
                  className="text-base sm:text-lg"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  📝
                </motion.span>
                <h3 className="font-semibold text-xs sm:text-sm" style={{ color: '#1E40AF' }}>
                  Conociendo tu perfil
                </h3>
              </div>
              <button
                onClick={onDismiss}
                className="transition-colors p-1 rounded hover:bg-white/20"
                style={{ color: '#7C3AED' }}
                aria-label="Cerrar"
              >
                <X size={16} />
              </button>
            </div>

            {/* Fields - Mobile: columna, Desktop: fila compacta */}
            <div className="flex flex-col sm:flex-row gap-1.5 mb-2">
              {FIELDS.map((field) => {
                const value = capturedData[field.key];
                const isCompleted = !!value;

                return (
                  <motion.div
                    key={field.key}
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{
                      scale: 1,
                      opacity: 1
                    }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg flex-1"
                    style={{
                      background: isCompleted
                        ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(245, 158, 11, 0.25) 100%)'
                        : 'rgba(255, 255, 255, 0.4)',
                      border: isCompleted
                        ? '1.5px solid rgba(245, 158, 11, 0.5)'
                        : '1.5px solid rgba(124, 58, 237, 0.3)',
                      boxShadow: isCompleted
                        ? '0 2px 8px rgba(245, 158, 11, 0.2)'
                        : 'none'
                    }}
                  >
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1, rotate: isCompleted ? 360 : 0 }}
                      transition={{ duration: 0.5 }}
                      className="text-sm"
                    >
                      {isCompleted ? '✅' : '⏳'}
                    </motion.span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1">
                        <span className="text-xs">{field.icon}</span>
                        <span className="text-xs font-medium truncate" style={{ color: isCompleted ? '#1E40AF' : '#7C3AED' }}>
                          {value || `${field.label}...`}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Progress Bar - Compacto */}
            <div className="flex items-center gap-2">
              <div className="flex-1 rounded-full h-1.5 overflow-hidden" style={{ background: 'rgba(255, 255, 255, 0.3)' }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className="h-1.5 rounded-full"
                  style={{
                    background: 'linear-gradient(90deg, #1E40AF 0%, #7C3AED 50%, #F59E0B 100%)',
                    boxShadow: '0 0 8px rgba(245, 158, 11, 0.6)'
                  }}
                />
              </div>
              <span className="text-xs font-bold whitespace-nowrap" style={{ color: '#F59E0B' }}>
                {completedFields}/{totalFields}
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
