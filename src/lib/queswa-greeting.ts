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
 * Última actualización léxica: 12 jun 2026 — MISION recalibrada al registro de la home
 * (reconoce el esfuerzo, no ataca el trabajo; eco del hero "no es trabajar más, ni dejar
 * lo que hace hoy"; léxico "siga produciendo aunque usted no esté presente" alineado con WHY_01).
 * Previo: 10 may 2026 — alineación SP v26.4 + 4 preguntas reales del avatar
 * (12 años de campo Luis Cabrejo) + patrón Gemini "verbalización + pregunta concreta".
 */

const MISION = `Estoy aquí para mostrarle cómo puede ser propietario de una empresa digital que le genere ingresos una y otra vez.`;

const TRANSICION = `¿Por dónde quiere empezar?`;

/**
 * Las 4 preguntas que el avatar hace en orden de frecuencia documentada
 * (12 años de campo). Espejan los 4 slides de la servilleta:
 * 1. Slide 1 — Diagnóstico y los 3 pilares (70% del tráfico)
 * 2. Slide 2 — El Método Comprobado (¿cómo lo hago?)
 * 3. Slide 3 — El producto (¿qué es y para qué sirve?)
 * 4. Slide 4 — Cómo y cuánto se gana
 *
 * Léxico accesible (jun 2026): sin jerga McKinsey ("metodología operativa",
 * "activo físico", "flujo de caja", "monetiza", "vías de liquidez"). Pregunta
 * reformulada estilo Gemini, no sustantivos densos. Test abuela/Beto.
 */
export const QUESWA_QUICK_REPLIES = [
  '¿Cómo funciona el modelo de negocio?',
  '¿Cuál es la metodología? ¿Qué hago yo en el día a día?',
  '¿Cuáles son los productos y para qué sirven?',
  'Quiero ver los números: ¿cómo y cuánto se gana?',
] as const;

/**
 * CTA secundario — siempre visible debajo de los 4 chips.
 * No es una pregunta del avatar, es la conversión al Diagnóstico de 5 Días.
 */
export const QUESWA_CTA_LABEL = 'Iniciar Diagnóstico';

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
 * Chip 1 → WHY_02 ("¿Cómo funciona el modelo de negocio?")
 * Chip 2 → WHY_ROL_01 / EAM_01 / METH_01 (rol del Propietario, El Método Comprobado)
 * Chip 3 → WHY_PROD_01 + catalogo_productos (qué es y para qué sirve)
 * Chip 4 → FREQ_04 / FREQ_11 + arsenal_compensacion (cómo se gana)
 *
 * El usuario ve el chip premium (vocabulario McKinsey).
 * El RAG recibe la query semántica óptima que recupera el fragmento con formato.
 *
 * Las keys deben estar en lowercase (route.ts hace .toLowerCase().trim() antes del match).
 */
export const QUESWA_QUICK_REPLIES_EXPANSION: Record<string, string> = {
  '¿cómo funciona el modelo de negocio?':
    'cómo funciona el negocio sistema distribución tres pilares apalancamiento',
  '¿cuál es la metodología? ¿qué hago yo en el día a día?':
    'qué tengo que hacer cuál es mi rol metodología método comprobado día a día comandos',
  '¿cuáles son los productos y para qué sirven?':
    'qué productos cuáles son para qué sirven beneficios catálogo Ganoderma Gano Excel',
  'quiero ver los números: ¿cómo y cuánto se gana?':
    'cómo se gana cuánto se gana ingreso compensación capitalización inmediata renta vitalicia',
};

/**
 * Saludo de primera visita (sin nombre persistido en localStorage).
 * Usado por Chat.tsx, useNEXUSChat.ts (rama 3) y route.ts (M1 micro-prompt FSM).
 */
export function getInitialGreeting(): string {
  return `Le doy la bienvenida.\n\n${MISION}\n\n${TRANSICION}`;
}

/**
 * Saludo GENERALISTA post-reel (jun 2026) — cuando la persona llega tras ver un reel
 * (home explainer o cualquiera de los 6 nichos). Recoge el testigo que el reel le
 * entregó ("Queswa guía hasta la decisión de avanzar, las 24 horas") sin reiniciar
 * de cero ni repetir lo que ya vio. NO nombra qué reel vio (sirve para todos).
 *
 * Doctrina v28.6/v28.7: el usuario decide, Queswa NO lo evalúa ni lo califica.
 * Aprobado por Luis (19 jun 2026). Usado por useNEXUSChat.ts en rutas de reel.
 */
export function getReelGreeting(): string {
  return `Acaba de ver el panorama. Ahora lo importante es lo suyo.\n\nCuénteme su situación o pregúnteme lo que quiera — le doy la claridad para que usted decida, con calma, si es el camino para usted. Sin tecnicismos y a su ritmo. ¿Por dónde empezamos?`;
}
