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

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export interface CapturedData {
  nombre?: string;
  archetype?: string; // ✅ v13.0 - Cambiado de 'ocupacion' a 'archetype' (arquetipos A-F)
  telefono?: string;
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

// ✅ v13.0 - Orden actualizado según flujo 14 mensajes: Nombre → Arquetipo → WhatsApp
const FIELDS: FieldConfig[] = [
  { key: 'nombre', label: 'Nombre', icon: '👤', priority: 1 },
  { key: 'archetype', label: 'Arquetipo', icon: '💼', priority: 2 },
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
            background: 'rgba(22, 24, 29, 0.97)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(56, 189, 248, 0.15)',
            boxShadow: '0 4px 24px rgba(0, 0, 0, 0.4)'
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
                <h3 className="font-semibold text-xs sm:text-sm font-industrial" style={{ color: '#38BDF8' }}>
                  Conociendo tu perfil
                </h3>
              </div>
              <button
                onClick={onDismiss}
                className="transition-colors p-1 rounded hover:bg-white/20"
                style={{ color: '#6B7280' }}
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
                        ? 'rgba(245, 158, 11, 0.08)'
                        : 'rgba(30, 32, 40, 0.8)',
                      border: isCompleted
                        ? '1px solid rgba(245, 158, 11, 0.4)'
                        : '1px solid rgba(229, 194, 121, 0.15)',
                      boxShadow: isCompleted
                        ? '0 2px 8px rgba(245, 158, 11, 0.12)'
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
                        <span className="text-xs font-medium truncate" style={{ color: isCompleted ? '#E5C279' : '#A3A3A3' }}>
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
              <div className="flex-1 rounded-full h-1.5 overflow-hidden" style={{ background: 'rgba(56, 189, 248, 0.1)' }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className="h-1.5 rounded-full"
                  style={{
                    background: 'linear-gradient(90deg, #38BDF8 0%, #E5C279 50%, #F59E0B 100%)',
                    boxShadow: '0 0 8px rgba(245, 158, 11, 0.4)'
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
