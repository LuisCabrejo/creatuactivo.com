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
 * Mapa de expansión de chips → queries semánticas óptimas para el RAG.
 *
 * PROBLEMA QUE RESUELVE:
 * Los chips usan frases largas con vocabulario premium ("Quiero entender la lógica:
 * ¿cómo funciona esta Estructura Patrimonial?"). Estos embeddings no recuperan los
 * fragmentos canónicos del arsenal con la misma confianza que las preguntas literales
 * del avatar. Sin recuperación correcta del fragmento, el modelo improvisa una respuesta
 * sin formato Markdown (sin viñetas, negritas, numeración).
 *
 * SOLUCIÓN:
 * route.ts (líneas ~2013 y ~2552) detecta cuando el mensaje del usuario coincide
 * exactamente con uno de los 4 chips (lowercase trim) y expande la query interna
 * a la formulación que SÍ recupera los fragmentos canónicos correctos:
 *
 * Chip 1 → WHY_02 ("¿Cómo funciona el negocio?")
 * Chip 2 → WHY_ROL_01 / EAM_01 / METH_01 (rol del Arquitecto, metodología EAM)
 * Chip 3 → WHY_PROD_01 + catalogo_productos (qué se vende)
 * Chip 4 → FREQ_04 / FREQ_11 + arsenal_compensacion (cómo se gana)
 *
 * El usuario ve el chip premium (vocabulario McKinsey).
 * El RAG recibe la query semántica óptima que recupera el fragmento con formato.
 *
 * Las keys deben estar en lowercase (route.ts hace .toLowerCase().trim() antes del match).
 */
export const QUESWA_QUICK_REPLIES_EXPANSION: Record<string, string> = {
  'quiero entender la lógica: ¿cómo funciona esta estructura patrimonial?':
    'cómo funciona el negocio sistema distribución tres pilares arquitectura',
  '¿cuál es la metodología operativa? ¿qué hago yo en el día a día?':
    'qué tengo que hacer cuál es mi rol metodología tridente EAM día a día',
  '¿cuál es el producto? ¿sobre qué activo físico se sostiene este flujo de caja?':
    'qué productos venden catálogo qué distribuimos Ganoderma Gano Excel',
  'quiero ver los números: ¿cómo se monetiza y cuáles son las vías de liquidez?':
    'cómo se gana cuánto se gana ingreso compensación capitalización inmediata renta vitalicia',
};

/**
 * Saludo de primera visita (sin nombre persistido en localStorage).
 * Usado por Chat.tsx, useNEXUSChat.ts (rama 3) y route.ts (M1 micro-prompt FSM).
 */
export function getInitialGreeting(): string {
  return `Le doy la bienvenida.\n\n${MISION}\n\n${TRANSICION}`;
}
