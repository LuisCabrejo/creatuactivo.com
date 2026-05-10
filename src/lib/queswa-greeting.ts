/**
 * Copyright © 2026 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * Este software es propiedad privada y confidencial de CreaTuActivo.com.
 * Prohibida su reproducción, distribución o uso sin autorización escrita.
 *
 * Para consultas de licenciamiento: legal@creatuactivo.com
 */

/**
 * Saludo canónico de Queswa — single source of truth.
 *
 * Antes el saludo + chips estaban duplicados en 4 lugares con copy divergente:
 * - src/components/nexus/Chat.tsx (initialMessages)
 * - src/components/nexus/useNEXUSChat.ts (rama "primera visita" de getInitialGreeting)
 * - src/components/nexus/NEXUSWidget.tsx (array hardcoded de chips)
 * - src/app/api/nexus/route.ts (getMicroPromptApertura M1 — variante distinta)
 *
 * Cualquier cambio léxico aquí se propaga automáticamente a los 4 puntos.
 *
 * NO centraliza:
 * - Saludo de visita recurrente con nombre ("Hola, {nombre}") — vive en useNEXUSChat.ts
 *   porque es lógica condicional contextual, no copy duplicado
 * - Saludo de página /sistema/productos — vive en useNEXUSChat.ts por la misma razón
 *
 * Última actualización léxica: 10 may 2026 — alineación SP v26.4 + 4 preguntas reales del avatar
 * (12 años de campo Luis Cabrejo) + patrón Gemini "verbalización + pregunta concreta".
 */

const MISION = `Mi función es ahorrarle tiempo, filtrar la información y ayudarle a diagnosticar si su arquitectura financiera actual requiere la integración de una Estructura Patrimonial.`;

const TRANSICION = `¿En qué fase del análisis se encuentra hoy?`;

/**
 * Las 4 preguntas que el avatar premium colombiano hace en orden de frecuencia
 * documentada (12 años de campo). Espejan los 4 slides de la servilleta v3:
 * 1. Slide 1 — Diagnóstico y Arquitectura (70% del tráfico)
 * 2. Slide 2 — Metodología Tridente EAM
 * 3. Slide 3 — Capa Logística (Producto)
 * 4. Slide 4 — Matemática de Amortización
 */
export const QUESWA_QUICK_REPLIES = [
  'Quiero entender la lógica: ¿cómo funciona esta Estructura Patrimonial?',
  '¿Cuál es la metodología operativa? ¿Qué hago yo en el día a día?',
  '¿Cuál es el producto? ¿Sobre qué activo físico se sostiene este flujo de caja?',
  'Quiero ver los números: ¿cómo se monetiza y cuáles son las vías de liquidez?',
] as const;

/**
 * CTA secundario — siempre visible debajo de los 4 chips.
 * No es una pregunta del avatar, es la conversión a la Auditoría Patrimonial.
 */
export const QUESWA_CTA_LABEL = 'Iniciar Auditoría de Viabilidad';

/**
 * Saludo de primera visita (sin nombre persistido en localStorage).
 * Usado por Chat.tsx, useNEXUSChat.ts (rama 3) y route.ts (M1 micro-prompt FSM).
 */
export function getInitialGreeting(): string {
  return `Le doy la bienvenida.\n\n${MISION}\n\n${TRANSICION}`;
}
