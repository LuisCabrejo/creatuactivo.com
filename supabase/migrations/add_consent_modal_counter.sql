-- Migration: Agregar contador de veces que se mostró el modal de consentimiento
-- Fecha: 21 Nov 2025
-- Propósito: Garantizar que el modal de consentimiento se muestre SOLO UNA VEZ por dispositivo

-- Agregar campo para contar cuántas veces se mostró el modal
ALTER TABLE device_info
ADD COLUMN IF NOT EXISTS consent_modal_shown_count INTEGER DEFAULT 0;

-- Agregar campo para timestamp de última vez que se mostró
ALTER TABLE device_info
ADD COLUMN IF NOT EXISTS last_consent_modal_shown TIMESTAMP WITH TIME ZONE;

-- Crear índice para optimizar queries
CREATE INDEX IF NOT EXISTS idx_device_info_consent_modal_count
ON device_info(consent_modal_shown_count);

-- Comentarios para documentación
COMMENT ON COLUMN device_info.consent_modal_shown_count IS
'Contador de veces que se mostró el modal de consentimiento. Máximo debe ser 1.';

COMMENT ON COLUMN device_info.last_consent_modal_shown IS
'Timestamp de la última vez que se mostró el modal de consentimiento al usuario.';
