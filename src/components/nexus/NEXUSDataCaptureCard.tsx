'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export interface CapturedData {
  nombre?: string;
  telefono?: string;
  email?: string;
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

const FIELDS: FieldConfig[] = [
  { key: 'nombre', label: 'Nombre', icon: '👤', priority: 1 },
  { key: 'telefono', label: 'Teléfono', icon: '📱', priority: 2 },
  { key: 'email', label: 'Email', icon: '📧', priority: 3 },
  { key: 'ocupacion', label: 'Ocupación', icon: '💼', priority: 4 }
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
          className="sticky top-0 z-50 bg-gradient-to-r from-blue-50 to-purple-50 border-b-2 border-blue-200 shadow-lg"
        >
          <div className="max-w-4xl mx-auto px-4 py-3">
            {/* Header */}
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-2">
                <motion.span
                  className="text-xl"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  📝
                </motion.span>
                <h3 className="font-semibold text-gray-800 text-sm sm:text-base">
                  NEXUS está recopilando tu información
                </h3>
              </div>
              <button
                onClick={onDismiss}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-200 rounded"
                aria-label="Cerrar"
              >
                <X size={18} />
              </button>
            </div>

            {/* Fields Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
              {FIELDS.map((field) => {
                const value = capturedData[field.key];
                const isCompleted = !!value;

                return (
                  <motion.div
                    key={field.key}
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{
                      scale: 1,
                      opacity: 1,
                      backgroundColor: isCompleted
                        ? 'rgb(220, 252, 231)' // green-100
                        : 'rgb(255, 255, 255)'  // white
                    }}
                    transition={{ duration: 0.2 }}
                    className={`flex items-center gap-2 p-2 rounded-lg border-2 ${
                      isCompleted
                        ? 'border-green-300'
                        : 'border-blue-200 animate-pulse'
                    }`}
                  >
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1, rotate: isCompleted ? 360 : 0 }}
                      transition={{ duration: 0.5 }}
                      className="text-lg"
                    >
                      {isCompleted ? '✅' : '⏳'}
                    </motion.span>
                    <div className="flex-1 min-w-0">
                      <span className="text-xs sm:text-sm font-medium text-gray-700">
                        {field.icon} {field.label}:
                      </span>
                      <div className={`text-xs sm:text-sm truncate ${
                        isCompleted ? 'text-gray-900 font-semibold' : 'text-gray-400'
                      }`}>
                        {value || '[Pendiente]'}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Progress Bar */}
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                />
              </div>
              <span className="text-xs sm:text-sm font-bold text-gray-700 whitespace-nowrap">
                {completedFields} de {totalFields}
              </span>
            </div>

            {/* Helper Text */}
            {completedFields > 0 && completedFields < totalFields && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="text-xs text-gray-600 mt-2 text-center"
              >
                Continúa la conversación para completar tu perfil 🚀
              </motion.p>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
