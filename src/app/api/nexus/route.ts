/**
 * Copyright © 2025 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * Este software es propiedad privada y confidencial de CreaTuActivo.com.
 * Prohibida su reproducción, distribución o uso sin autorización escrita.
 *
 * Para consultas de licenciamiento: legal@creatuactivo.com
 */

// src/app/api/nexus/route.ts
// API Route NEXUS - ARQUITECTURA HÍBRIDA + FLUJO 14 MENSAJES v14.9
// VERSION: v14.9 - Fragmentación de arsenales (95% reducción tokens)
// ARSENAL: 108 fragmentos individuales con embeddings Voyage AI (antes: 3 documentos monolíticos)
// IDENTIDAD: Copiloto del Arquitecto con captura temprana de datos
// CAMBIOS v13.0: Nombre msg 2 (no msg 7) + Verificación progreso msg 8 + Resumen final msg 13
// COMPLIANCE: Ley 1581/2012 Art. 9 + Conversational AI Best Practices (Drift, Intercom, Nielsen Norman Group)

import { createClient } from '@supabase/supabase-js';
import Anthropic from '@anthropic-ai/sdk';
import { AnthropicStream, StreamingTextResponse } from 'ai';
import {
  vectorSearch,
  type DocumentWithEmbedding,
  type VectorSearchResult
} from '@/lib/vectorSearch';

// 1. Configuración de Clientes
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// ✅ FIX: Lazy initialization de Supabase client para build-time
let supabaseClient: ReturnType<typeof createClient> | null = null;
function getSupabaseClient() {
  if (!supabaseClient) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
  }
  return supabaseClient;
}

export const runtime = 'edge';
export const maxDuration = 60; // ✅ FIX: Aumentado de 30→60s para lista de precios completa (22 productos)

// Cache en memoria optimizado para arquitectura híbrida
const searchCache = new Map<string, any>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutos
// System prompt cache para reducir latencia
const systemPromptCache = new Map<string, any>();
const SYSTEM_PROMPT_CACHE_TTL = 5 * 60 * 1000; // 5 minutos (sincronizado con searchCache)

const API_VERSION = 'v13.0_flujo_14_mensajes'; // ✅ v13.0: Flujo 14 mensajes + Captura temprana + Progressive profiling

// ========================================
// UTILIDADES - LIMPIEZA DE DATOS
// ========================================
/**
 * Remueve valores NULL y undefined de un objeto.
 * Evita que NULL sobreescriba datos existentes en el merge JSONB de PostgreSQL.
 * @param obj - Objeto con posibles valores NULL/undefined
 * @returns Objeto limpio solo con valores válidos
 */
function removeNullValues(obj: Record<string, any>): Record<string, any> {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, value]) => value !== null && value !== undefined)
  );
}

// ========================================
// CAPTURA INTELIGENTE DE PROSPECTOS (Tridente EAM)
// ========================================
interface ProspectData {
  name?: string;
  email?: string;
  phone?: string;
  occupation?: string;
  interest_level?: number;
  objections?: string[];
  archetype?: string;
  package?: string;  // ✅ NUEVO: paquete de inversión seleccionado
  momento_optimo?: string;
  preguntas?: string[];
  consent_granted?: boolean;
  consent_timestamp?: string;
}

// ========================================
// SISTEMA DE SCORING PROGRESIVO v2.0
// ========================================
/**
 * Detecta señales conversacionales avanzadas que indican interés real
 * más allá de keywords básicos.
 *
 * Caso de uso: Prospectos como Diego que muestran alto interés ANTES
 * de compartir WhatsApp deben calificar en ACOGER temprano.
 *
 * @param message - Mensaje del usuario
 * @param previousMessages - Número de mensajes previos (para engagement)
 * @returns Score adicional basado en señales avanzadas
 */
function detectAdvancedSignals(message: string, previousMessages?: number): number {
  let signalScore = 0;
  const messageLower = message.toLowerCase();

  // SEÑAL 1: Cambio de teoría a aplicación personal (+3 puntos)
  // Indica que pasó de curiosidad a evaluación seria
  const personalApplicationPatterns = [
    /cómo puedo yo/i,
    /qué hago yo/i,
    /en mi caso/i,
    /para mí/i,
    /yo podría/i,
    /si yo/i,
    /mi whatsapp/i,
    /mi correo/i,
    /mi número/i
  ];

  if (personalApplicationPatterns.some(pattern => pattern.test(message))) {
    signalScore += 3;
    console.log('🌟 [SCORING] SEÑAL: Aplicación personal (+3)');
  }

  // SEÑAL 2: Preguntas sobre DETALLES/profundización (+1.5 puntos)
  // Muestra engagement más allá de curiosidad superficial
  const detailPatterns = [
    /exactamente/i,
    /específicamente/i,
    /en detalle/i,
    /cuánto.*exacto/i,
    /qué hace/i,
    /cómo funciona.*práctica/i,
    /explícame/i,
    /más información/i
  ];

  if (detailPatterns.some(pattern => pattern.test(message))) {
    signalScore += 1.5;
    console.log('🔍 [SCORING] SEÑAL: Profundización (+1.5)');
  }

  // SEÑAL 3: Mentalidad de LÍDER/CONSTRUCTOR (+3.5 puntos)
  // Piensa en equipo ANTES de activarse = prospecto de alto valor
  const leadershipPatterns = [
    /cómo ayudo/i,
    /mi equipo/i,
    /otras personas/i,
    /replicar/i,
    /enseñar/i,
    /mentorear/i,
    /acompañar/i,
    /construir.*equipo/i,
    /ayudar.*otros/i
  ];

  if (leadershipPatterns.some(pattern => pattern.test(message))) {
    signalScore += 3.5;
    console.log('👑 [SCORING] SEÑAL: Mentalidad de líder (+3.5)');
  }

  // SEÑAL 4: Análisis FINANCIERO - hace cálculos (+4 puntos)
  // Está evaluando ROI = decisor serio
  const financialAnalysisPatterns = [
    /cuánto gano/i,
    /si.*compra.*paquete/i,
    /en.*generación/i,
    /gen \d/i,
    /porcentaje/i,
    /comisión/i,
    /retorno/i,
    /inversión/i,
    /esp\d/i,
    /plan.*compensación/i
  ];

  if (financialAnalysisPatterns.some(pattern => pattern.test(message))) {
    signalScore += 4;
    console.log('💰 [SCORING] SEÑAL: Análisis financiero (+4)');
  }

  // SEÑAL 5: Profesión RELEVANTE compartida (+2 puntos)
  // Fit natural con el modelo de negocio
  const relevantProfessions = [
    'comerciante', 'vendedor', 'emprendedor', 'empresario',
    'networker', 'distribuidor', 'freelance', 'consultor',
    'coach', 'asesor', 'independiente'
  ];

  if (relevantProfessions.some(prof => messageLower.includes(prof))) {
    signalScore += 2;
    console.log('💼 [SCORING] SEÑAL: Profesión relevante (+2)');
  }

  // SEÑAL 6: Respuestas CONCISAS = decisor (+1 punto)
  // Comunicación directa indica persona de acción
  const wordCount = message.split(/\s+/).length;
  if (wordCount <= 5 && (previousMessages || 0) >= 3) {
    signalScore += 1;
    console.log('⚡ [SCORING] SEÑAL: Comunicación directa (+1)');
  }

  // SEÑAL 7: Feedback POSITIVO explícito (+2 puntos)
  // Confirma interés genuino
  const positiveFeedback = [
    /suena bien/i,
    /interesante/i,
    /me gusta/i,
    /perfecto/i,
    /excelente/i,
    /genial/i,
    /me parece bien/i,
    /está bien/i
  ];

  if (positiveFeedback.some(pattern => pattern.test(message))) {
    signalScore += 2;
    console.log('✅ [SCORING] SEÑAL: Feedback positivo (+2)');
  }

  // SEÑAL 8: Solicita CONTACTO directo (+2.5 puntos)
  // Quiere escalada humana = muy caliente
  const contactRequestPatterns = [
    /una llamada/i,
    /hablar.*whatsapp/i,
    /contactar/i,
    /llamar/i,
    /videollamada/i,
    /reunión/i
  ];

  if (contactRequestPatterns.some(pattern => pattern.test(message))) {
    signalScore += 2.5;
    console.log('📞 [SCORING] SEÑAL: Solicita contacto (+2.5)');
  }

  return signalScore;
}

// Función para capturar datos del prospecto inteligentemente
async function captureProspectData(
  message: string,
  sessionId: string,
  fingerprint?: string,
  constructorUUID?: string | null,
  existingData?: any  // ✅ NUEVO: Datos ya guardados en BD
): Promise<ProspectData> {

  console.log('🔍 [NEXUS] Captura datos híbrida - Input:', {
    message: message.substring(0, 100),
    sessionId,
    fingerprint,
    hasFingerprint: !!fingerprint,
    hasExistingName: !!(existingData?.name)  // ✅ Log si ya hay nombre
  });

  const data: ProspectData = {};
  const messageLower = message.toLowerCase().trim();

  // ✅ DETECCIÓN AUTOMÁTICA DE CONSENTIMIENTO (Backend-driven)
  // Detecta cuando el usuario acepta el consentimiento de datos
  const consentPatterns = [
    /^a$/i,                           // Solo "a"
    /^acepto$/i,                      // "acepto"
    /^si$/i, /^sí$/i,                // "si" o "sí"
    /^a\)$/i,                         // "a)"
    /acepto/i,                        // contiene "acepto"
    /aceptar/i,                       // contiene "aceptar"
    /^opci[oó]n\s*a$/i,              // "opción a"
    /^dale$/i, /^ok$/i, /^okay$/i    // afirmaciones simples
  ];

  const isAcceptingConsent = consentPatterns.some(pattern => pattern.test(message.trim()));

  if (isAcceptingConsent && !existingData?.consent_granted) {
    data.consent_granted = true;
    data.consent_timestamp = new Date().toISOString();
    console.log('✅ [NEXUS Backend] Consentimiento detectado y guardado - Input:', message);
  }

  // ✅ CAPTURA DE NOMBRE (solo si NO existe previamente)
  // Evita sobrescribir nombre válido con frases como "el pequeño", "el más grande"
  const skipNameCapture = existingData?.name && existingData.name.length > 2;

  if (!skipNameCapture) {
    // CAPTURA DE NOMBRE (solo si no existe)
  const namePatterns = [
    /(?:me llamo|mi nombre es|soy)\s+([A-ZÀ-ÿ][a-zà-ÿ]+(?:\s+[A-ZÀ-ÿ][a-zà-ÿ]+)*)/i,
    /^([A-ZÀ-ÿ][a-zà-ÿ]+(?:\s+[A-ZÀ-ÿ][a-zà-ÿ]+)*)\s+es\s+mi\s+nombre/i,  // Formato invertido: "Disipro es mi nombre"
    /^([A-ZÀ-ÿ][a-zà-ÿ]+(?:\s+[A-ZÀ-ÿ][a-zà-ÿ]+)*)\s*-/i,                  // Nombre (1 o más palabras) + guión: "Luis - precio" o "Juan Pérez - precio"
    /^([A-ZÀ-ÿ][a-zà-ÿ]+(?:\s+[A-ZÀ-ÿ][a-zà-ÿ]+)*)\s+(?:y|dame|precio|cuánto|quiero|necesito|empezar|iniciar|a\)|b\)|c\)|d\)|e\)|f\))/i, // Nombre + conectores
    /^([A-ZÀ-ÿ][a-zà-ÿ]+(?:\s+[A-ZÀ-ÿ][a-zà-ÿ]+)*)\s*$/
  ];

  // Blacklist de palabras que NO son nombres (incluye paquetes, arquetipos y opciones)
  // ✅ v12.3: Expandida para prevenir captura de paquetes como "visionario"
  const nameBlacklist = /^(hola|gracias|si|sí|no|ok|bien|claro|perfecto|excelente|entiendo|estoy listo|el|la|los|las|ese|este|aquel|aquella|el más|el de|la de|lo de|para|con|sin|sobre|desde|hasta|quiero|necesito|dame|busco|visionario|inicial|empresarial|constructor|estratégico|estrategico|acepto|a|b|c|d|e|f|profesional|emprendedor|freelancer|independiente|lider|líder|joven|ambicion|ambición|hogar|comunidad|vision|visión|dueño|dueno|negocio)$/i;

  for (const pattern of namePatterns) {
    const match = message.match(pattern);
    if (match) {
      const capturedName = match[1].trim();
      // Validar que no sea palabra blacklisted (paquetes, opciones, etc)
      if (capturedName.length >= 2 && !nameBlacklist.test(capturedName)) {
        data.name = capturedName;
        console.log('✅ [NEXUS] Nombre capturado:', data.name, 'del mensaje:', message.substring(0, 50));
        break;
      } else if (nameBlacklist.test(capturedName)) {
        console.log('⚠️ [NEXUS] Nombre rechazado (blacklist):', capturedName);
      }
    }
  }

  if (!data.name && message.length < 30) {
    // Intento adicional: nombre simple sin patrón estricto
    const simpleNameMatch = message.match(/^([A-ZÀ-ÿa-zà-ÿ]+(?:\s+[A-ZÀ-ÿa-zà-ÿ]+)?)\s*$/i);

    // ⚠️ BLACKLIST EXPANDIDA v12.3: Evitar capturar paquetes, arquetipos o respuestas como nombres
    const nameBlacklist = /^(hola|gracias|si|sí|no|ok|bien|claro|perfecto|excelente|entiendo|estoy listo|el|la|los|las|ese|este|aquel|aquella|el más|el de|la de|lo de|para|con|sin|sobre|desde|hasta|quiero|necesito|dame|busco|visionario|inicial|empresarial|constructor|estratégico|estrategico|acepto|a|b|c|d|e|f|profesional|emprendedor|freelancer|independiente|lider|líder|joven|ambicion|ambición|hogar|comunidad|vision|visión|dueño|dueno|negocio)$/i;

    if (simpleNameMatch && !messageLower.match(nameBlacklist)) {
      const capturedName = simpleNameMatch[1].trim();

      // ✅ VALIDACIÓN ADICIONAL: No capturar si empieza con artículo
      const startsWithArticle = /^(el|la|los|las|un|una|unos|unas)\s+/i.test(capturedName);

      if (capturedName.length >= 2 && !startsWithArticle) {
        data.name = capturedName;
        console.log('✅ [NEXUS] Nombre capturado (patrón simple):', data.name);
      } else if (startsWithArticle) {
        console.log('⚠️ [NEXUS] Nombre rechazado (empieza con artículo):', capturedName);
      }
    }
  }
  } else {
    console.log('⏭️ [NEXUS] Nombre ya existe, omitiendo captura:', existingData?.name);
  }

  // CAPTURA DE WHATSAPP (Internacional - Multi-país)
  // Soporta todos los países de operación CreaTuActivo:
  // 🇨🇴 Colombia: +57 310 206 6593 o 320 3412323 (10 dígitos)
  // 🇺🇸 USA: +1 305 123 4567 (10 dígitos)
  // 🇲🇽 México: +52 55 1234 5678 (10 dígitos)
  // 🇪🇨 Ecuador: +593 99 123 4567 (9 dígitos)
  // 🇵🇪 Perú: +51 987 654 321 (9 dígitos)
  // 🇻🇪 Venezuela: +58 414 123 4567 (10 dígitos)
  // 🇧🇷 Brasil: +55 11 91234 5678 (11 dígitos)
  // Acepta formatos: con/sin +, con/sin espacios, con/sin guiones, con/sin paréntesis

  // Regex que captura números con formato flexible
  const phonePattern = /(?:\+?\d{1,4}[\s\-\(\)]?)?([\d\s\-\(\)]{7,20})/g;
  const phoneMatches = message.match(phonePattern);

  if (phoneMatches) {
    for (const match of phoneMatches) {
      // Extraer solo dígitos (limpiar +, espacios, guiones, paréntesis)
      const digitsOnly = match.replace(/[\s\-\(\)+]/g, '');

      // Validar longitud para WhatsApp internacional (7-15 dígitos)
      // Estándar E.164: código país (1-3) + número nacional (4-14)
      // Mínimo 7: números locales cortos (ej: Ecuador sin código)
      // Máximo 15: estándar internacional máximo
      if (digitsOnly.length >= 7 && digitsOnly.length <= 15) {
        data.phone = digitsOnly;
        console.log('✅ [NEXUS] WhatsApp capturado:', data.phone, 'desde input:', match.trim());
        break; // Tomar primer número válido encontrado
      }
    }
  }

  // CAPTURA DE EMAIL
  const emailMatch = message.match(/[\w.-]+@[\w.-]+\.\w+/);
  if (emailMatch) {
    data.email = emailMatch[0].toLowerCase();
    console.log('Email capturado:', data.email);
  }

  // DETECCIÓN DE CONSENTIMIENTO (palabras clave de aceptación)
  const consentKeywords = ['acepto', 'aceptar', 'sí autorizo', 'si autorizo', 'autorizo', 'de acuerdo', 'ok', 'si', 'sí'];
  const hasConsent = consentKeywords.some(keyword => messageLower.includes(keyword));

  if (hasConsent && (messageLower.includes('dato') || messageLower.includes('trata') || messageLower.includes('privacidad') || messageLower === 'si' || messageLower === 'sí' || messageLower === 'acepto' || messageLower === 'aceptar')) {
    data.consent_granted = true;
    data.consent_timestamp = new Date().toISOString();
    console.log('✅ [NEXUS] Consentimiento detectado y guardado');
  }

  // ✅ CAPTURA DE ARQUETIPO (viñetas A-F + texto completo)

  // PRIORIDAD 1: Detección por letra sola (usuario escribe solo "A", "B", etc.)
  const trimmedMessage = message.trim().toLowerCase();
  const singleLetterRegex = /^[a-f]$/i;

  if (singleLetterRegex.test(trimmedMessage)) {
    const letterMap: Record<string, string> = {
      'a': 'profesional_vision',
      'b': 'emprendedor_dueno_negocio',
      'c': 'independiente_freelancer',
      'd': 'lider_hogar',
      'e': 'lider_comunidad',
      'f': 'joven_ambicion'
    };
    data.archetype = letterMap[trimmedMessage];
    console.log('✅ [NEXUS] Arquetipo capturado por letra:', trimmedMessage.toUpperCase(), '→', data.archetype);
  }

  // PRIORIDAD 2: Detección por viñeta (usuario escribe "A)", "B)", etc.)
  if (!data.archetype) {
    const bulletMap: Record<string, string> = {
      'a)': 'profesional_vision',
      'b)': 'emprendedor_dueno_negocio',
      'c)': 'independiente_freelancer',
      'd)': 'lider_hogar',
      'e)': 'lider_comunidad',
      'f)': 'joven_ambicion'
    };

    for (const [bullet, value] of Object.entries(bulletMap)) {
      if (messageLower.includes(bullet)) {
        data.archetype = value;
        console.log('✅ [NEXUS] Arquetipo capturado por viñeta:', bullet.toUpperCase(), '→', value);
        break;
      }
    }
  }

  // PRIORIDAD 3: Detección por texto completo (usuario copia el perfil completo)
  if (!data.archetype) {
    const textMap: Record<string, string> = {
      'profesional con visión': 'profesional_vision',
      'emprendedor y dueño de negocio': 'emprendedor_dueno_negocio',
      'independiente y freelancer': 'independiente_freelancer',
      'líder del hogar': 'lider_hogar',
      'líder de la comunidad': 'lider_comunidad',
      'joven con ambición': 'joven_ambicion'
    };

    for (const [label, value] of Object.entries(textMap)) {
      if (messageLower.includes(label)) {
        data.archetype = value;
        console.log('✅ [NEXUS] Arquetipo capturado por texto:', label, '→', value);
        break;
      }
    }
  }

  // ✅ CAPTURA DE ARQUETIPO POR ICONO VECTORIAL (branding CreaTuActivo)
  if (!data.archetype) {
    const iconArchetypeMap: Record<string, string> = {
      '💼': 'profesional_vision',
      '📱': 'emprendedor_dueno_negocio',  // Actualizado: 🎯 → 📱
      '💡': 'independiente_freelancer',
      '🏠': 'lider_hogar',
      '👥': 'lider_comunidad',
      '🎓': 'joven_ambicion'  // Actualizado: 📈 → 🎓
    };

    for (const [icon, value] of Object.entries(iconArchetypeMap)) {
      if (message.includes(icon)) {
        data.archetype = value;
        console.log('✅ [NEXUS] Arquetipo capturado por icono:', icon, '→', value);
        break;
      }
    }
  }

  // ✅ CAPTURA DE PAQUETE (Multi-estrategia: directa + semántica + contexto)
  const packageMap: Record<string, string> = {
    // Nombres completos
    'constructor inicial': 'inicial',
    'constructor estratégico': 'estrategico',
    'constructor visionario': 'visionario',
    'prefiero asesoría personalizada': 'asesoria',
    'asesoría personalizada': 'asesoria',

    // Abreviaciones ESP
    'esp1': 'inicial',
    'esp 1': 'inicial',
    'esp2': 'estrategico',
    'esp 2': 'estrategico',
    'esp3': 'visionario',
    'esp 3': 'visionario',

    // Precios mencionados
    '$2,000': 'inicial',
    '2000 usd': 'inicial',
    '2.250.000': 'inicial',
    '$3,500': 'estrategico',
    '3500 usd': 'estrategico',
    '3.500.000': 'estrategico',
    '$4,500': 'visionario',
    '4500 usd': 'visionario',
    '4.500.000': 'visionario',

    // Solo palabras clave
    'inicial': 'inicial',
    'estratégico': 'estrategico',
    'estrategico': 'estrategico',
    'visionario': 'visionario',

    // ✅ LENGUAJE NATURAL (cómo la gente realmente habla)
    // Tamaño relativo
    'el más grande': 'visionario',
    'el grande': 'visionario',
    'el mayor': 'visionario',
    'el más completo': 'visionario',
    'el más caro': 'visionario',
    'el premium': 'visionario',
    'el top': 'visionario',
    'el mejor': 'visionario',

    'el pequeño': 'inicial',
    'el más pequeño': 'inicial',
    'el chico': 'inicial',
    'el básico': 'inicial',
    'el económico': 'inicial',
    'el barato': 'inicial',
    'el más barato': 'inicial',
    'el de entrada': 'inicial',
    'para empezar': 'inicial',

    'el de la mitad': 'estrategico',
    'el del medio': 'estrategico',
    'el mediano': 'estrategico',
    'el intermedio': 'estrategico',
    'el estándar': 'estrategico',
    'el normal': 'estrategico',

    // Cantidad de productos
    'el de 7 productos': 'inicial',
    'el de siete productos': 'inicial',
    'el de 7': 'inicial',
    'con 7 productos': 'inicial',

    'el de 35 productos': 'visionario',
    'el de treinta y cinco': 'visionario',
    'el de 35': 'visionario',
    'con 35 productos': 'visionario',

    'el que tiene más productos': 'visionario',
    'el que trae más': 'visionario',

    // Variaciones coloquiales
    'ese': 'estrategico',  // "¿Cuál prefieres?" → "Ese" (contexto depende de última mención)
    'este': 'estrategico',
    'aquel': 'estrategico'
  };

  for (const [label, value] of Object.entries(packageMap)) {
    if (messageLower.includes(label)) {
      data.package = value;
      console.log('✅ [NEXUS] Paquete capturado:', value, 'desde label:', label);
      break;
    }
  }

  // CAPTURA DE OCUPACIÓN (fallback para captura libre)
  if (!data.archetype) {
    const occupationPatterns = [
      /(?:soy|trabajo como|me dedico a|trabajo en|estudio)\s+(.+?)(?:\.|,|$)/i,
      /(?:profesión|ocupación):\s*(.+?)(?:\.|,|$)/i,
      /(?:estudiante de|estudiante|estoy estudiando)\s+(.+?)(?:\.|,|$)/i  // Nuevo: casos de estudiantes
    ];

    for (const pattern of occupationPatterns) {
      const match = message.match(pattern);
      if (match) {
        data.occupation = match[1].trim();
        console.log('✅ [NEXUS] Ocupación capturada:', data.occupation, 'del mensaje:', message.substring(0, 50));
        break;
      }
    }
  }

  // ========================================
  // CÁLCULO DE NIVEL DE INTERÉS - SISTEMA PROGRESIVO v2.0
  // ========================================
  // CAMBIO FUNDAMENTAL: Score ACUMULATIVO (no snapshot)
  // Caso Diego: Debe calificar en ACOGER desde mensaje 1, no esperar al WhatsApp

  // PASO 1: Obtener score previo del prospecto (si existe)
  let previousScore = 5; // Base neutral para nuevos prospectos
  let messageCount = 0;

  if (fingerprint && existingData) {
    // existingData ya contiene la info de device_info
    previousScore = existingData.interest_level || 5;
    messageCount = (existingData.message_count || 0) + 1;
    console.log('📊 [SCORING v2.0] Score previo:', previousScore, '| Mensaje #' + messageCount);
  } else {
    console.log('📊 [SCORING v2.0] Nuevo prospecto, score base: 5');
  }

  // PASO 2: Calcular señales BÁSICAS (keywords tradicionales)
  let basicSignals = 0;

  // Compartir datos personales = interés alto
  if (data.name) basicSignals += 2;
  if (data.phone) basicSignals += 2; // ✅ AJUSTADO: Antes +3, ahora +2 (menos peso)
  if (data.email) basicSignals += 2;
  if (data.occupation) basicSignals += 1;

  // Keywords positivos
  if (messageLower.includes('paquete') || messageLower.includes('inversión')) basicSignals += 2;
  if (messageLower.includes('empezar') || messageLower.includes('comenzar')) basicSignals += 3;
  if (messageLower.includes('precio') || messageLower.includes('costo') || messageLower.includes('cuánto')) basicSignals += 2;
  if (messageLower.includes('quiero') || messageLower.includes('necesito') || messageLower.includes('me interesa')) basicSignals += 2;
  if (messageLower.includes('cuándo') || messageLower.includes('cuando') || messageLower.includes('cómo')) basicSignals += 1;

  // Keywords negativos
  if (messageLower.includes('no me interesa') || messageLower.includes('no gracias')) basicSignals -= 3;
  if (messageLower.includes('tal vez') || messageLower.includes('quizás')) basicSignals -= 1;
  if (messageLower.includes('duda')) basicSignals -= 1;

  // PASO 3: Calcular señales AVANZADAS (sistema nuevo v2.0)
  const advancedSignals = detectAdvancedSignals(message, messageCount);

  // PASO 4: Bonus por engagement sostenido (frecuencia de mensajes)
  let engagementBonus = 0;
  if (messageCount >= 3) engagementBonus += 1.5;
  if (messageCount >= 5) engagementBonus += 1; // Total +2.5
  if (messageCount >= 8) engagementBonus += 1; // Total +3.5

  // PASO 5: Calcular DELTA (cambio en este mensaje solamente)
  const deltaScore = basicSignals + advancedSignals + engagementBonus;

  // PASO 6: Score ACUMULATIVO (sumar al score previo)
  const totalScore = Math.min(10, Math.max(0, previousScore + deltaScore));

  // Redondear a INTEGER
  data.interest_level = Math.round(totalScore);

  // PASO 7: Determinar momento óptimo con NUEVOS UMBRALES
  // ✅ CRÍTICO: Umbrales más bajos para calificar en ACOGER más rápido
  const momentoOptimo = data.interest_level >= 9 ? 'listo' :
                        data.interest_level >= 7 ? 'caliente' :
                        data.interest_level >= 5 ? 'tibio' : 'frio';

  data.momento_optimo = momentoOptimo;

  // PASO 8: Logging detallado del scoring progresivo
  console.log('📊 ═══════════════════════════════════════════════');
  console.log('📊 [SCORING PROGRESIVO v2.0] Mensaje #' + messageCount);
  console.log('📊 ───────────────────────────────────────────────');
  console.log('  ├─ 📥 Score previo: ' + previousScore.toFixed(1));
  console.log('  ├─ 🔤 Señales básicas: +' + basicSignals.toFixed(1));
  console.log('  ├─ 🌟 Señales avanzadas: +' + advancedSignals.toFixed(1));
  console.log('  ├─ 💬 Bonus engagement: +' + engagementBonus.toFixed(1));
  console.log('  ├─ 📈 Delta total: +' + deltaScore.toFixed(1));
  console.log('  └─ 🎯 SCORE FINAL: ' + data.interest_level + '/10 → ' + momentoOptimo.toUpperCase());
  console.log('📊 ═══════════════════════════════════════════════');

  // DETECCIÓN DE OBJECIONES (SEMÁNTICA)
  const objeciones: string[] = [];

  if (messageLower.includes('caro') || messageLower.includes('mucho dinero') ||
      messageLower.includes('no tengo dinero')) {
    objeciones.push('precio');
  }

  if (messageLower.includes('tiempo') || messageLower.includes('ocupado') ||
      messageLower.includes('no puedo')) {
    objeciones.push('tiempo');
  }

  if (messageLower.includes('mlm') || messageLower.includes('pirámide') ||
      messageLower.includes('multinivel')) {
    objeciones.push('mlm');
  }

  if (messageLower.includes('estafa') || messageLower.includes('real') ||
      messageLower.includes('confianza')) {
    objeciones.push('confianza');
  }

  if (objeciones.length > 0) {
    data.objections = objeciones;
    console.log('Objeciones detectadas:', objeciones);
  }

  // 🧠 DETECCIÓN DE LOW-INTENT SIGNALS (Best Practice: Adapt strategy when user shows disinterest)
  const lowIntentKeywords = [
    'tal vez', 'quizás', 'quizas', 'no sé', 'no se',
    'después veo', 'despues veo', 'luego te escribo',
    'más tarde', 'mas tarde', 'otro día', 'otro dia',
    'déjame pensarlo', 'dejame pensarlo', 'lo pienso',
    'no estoy seguro', 'no estoy segura'
  ];

  const hasLowIntent = lowIntentKeywords.some(keyword => messageLower.includes(keyword));

  if (hasLowIntent) {
    // Reduce score by 1 point when low-intent is detected
    if (data.interest_level && data.interest_level > 0) {
      data.interest_level = Math.max(0, data.interest_level - 1);
      console.log('⚠️ [LOW-INTENT DETECTED] Score reducido por señales de desinterés:', lowIntentKeywords.find(k => messageLower.includes(k)));
    }
    // Mark as "tibio" instead of "caliente"
    if (data.momento_optimo === 'caliente') {
      data.momento_optimo = 'tibio';
      console.log('⚠️ [LOW-INTENT DETECTED] Momento óptimo cambiado de "caliente" a "tibio"');
    }
  }

  // DETECCIÓN DE ARQUETIPO (ESCALABLE)
  if (messageLower.includes('empresa') || messageLower.includes('negocio')) {
    data.archetype = 'emprendedor_dueno_negocio';
  } else if (messageLower.includes('trabajo') || messageLower.includes('empleado')) {
    data.archetype = 'profesional_vision';
  } else if (messageLower.includes('familia') || messageLower.includes('hijos')) {
    data.archetype = 'lider_hogar';
  } else if (messageLower.includes('estudiante') || messageLower.includes('universidad')) {
    data.archetype = 'joven_ambicion';
  }

  if (data.archetype) {
    console.log('Arquetipo detectado:', data.archetype);
  }

  // DETERMINAR MOMENTO ÓPTIMO
  if (data.interest_level >= 7) {
    data.momento_optimo = 'caliente';
  } else if (data.interest_level >= 4) {
    data.momento_optimo = 'tibio';
  } else {
    data.momento_optimo = 'frio';
  }

  // GUARDAR EN SUPABASE SI HAY DATOS
  if (Object.keys(data).length > 0 && fingerprint) {
    try {
      // ✅ PROTECCIÓN: Remover valores NULL antes de guardar
      const cleanedData = removeNullValues(data);

      console.log('🔵 [NEXUS] Guardando en BD:', {
        fingerprint: fingerprint.substring(0, 20) + '...',
        data: cleanedData,
        constructor_uuid: constructorUUID || 'Sistema (fallback)'
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: rpcResult, error: rpcError } = await (getSupabaseClient().rpc as any)('update_prospect_data', {
        p_fingerprint_id: fingerprint,
        p_data: cleanedData,  // ✅ Usar datos limpios sin NULL
        p_constructor_id: constructorUUID || undefined  // ✅ Pasar UUID o undefined (usa Sistema como fallback)
      });

      if (rpcError) {
        console.error('❌ [NEXUS] Error RPC update_prospect_data:', rpcError);
        throw rpcError;
      }

      console.log('✅ [NEXUS] Datos guardados exitosamente:', rpcResult);
    } catch (error) {
      console.error('❌ [NEXUS] Error guardando datos del prospecto:', error);
      // No propagar el error para no romper la conversación
    }
  } else {
    console.warn('⚠️ [NEXUS] No se guardaron datos:', {
      tieneFingerprint: !!fingerprint,
      fingerprintValue: fingerprint || 'undefined',
      cantidadDatos: Object.keys(data).length,
      datosCapturados: data,
      motivo: !fingerprint ? 'Sin fingerprint' : 'Sin datos capturados'
    });
  }

  return data;
}

// ============================================================================
// BÚSQUEDA VECTORIAL CON VOYAGE AI (90% precisión)
// ============================================================================
// Cache de documentos con embeddings para evitar queries repetidas
let vectorDocsCache: { data: DocumentWithEmbedding[] | null; timestamp: number } = {
  data: null,
  timestamp: 0
};
const VECTOR_DOCS_CACHE_TTL = 10 * 60 * 1000; // 10 minutos

/**
 * Obtiene documentos con embeddings de Supabase (con cache)
 */
async function getDocumentsWithEmbeddings(): Promise<DocumentWithEmbedding[]> {
  // Check cache
  if (vectorDocsCache.data && (Date.now() - vectorDocsCache.timestamp) < VECTOR_DOCS_CACHE_TTL) {
    return vectorDocsCache.data;
  }

  try {
    const { data, error } = await getSupabaseClient()
      .from('nexus_documents')
      .select('category, title, content, embedding_512, metadata')
      .in('category', ['arsenal_inicial', 'arsenal_avanzado', 'catalogo_productos', 'arsenal_compensacion', 'arsenal_reto'])
      .not('embedding_512', 'is', null);

    if (error) {
      console.error('[VectorSearch] Error loading documents:', error);
      return [];
    }

    const rawDocs = data as Array<{ category: string; title: string; content: string; embedding_512: string; metadata: Record<string, unknown> }> | null;
    const docs: DocumentWithEmbedding[] = (rawDocs || []).map(doc => ({
      category: doc.category,
      title: doc.title,
      content: doc.content,
      embedding: String(doc.embedding_512),
      metadata: doc.metadata
    }));

    // Update cache
    vectorDocsCache = { data: docs, timestamp: Date.now() };
    console.log(`[VectorSearch] Cached ${docs.length} documents with embeddings`);

    return docs;
  } catch (error) {
    console.error('[VectorSearch] Exception loading documents:', error);
    return [];
  }
}

// ========================================
// ⚡ FRAGMENTACIÓN DE ARSENALES v14.9
// Reduce tokens de entrada de ~60K a ~3K por request
// ========================================

// Cache para fragmentos de arsenales
const fragmentsCache: { data: DocumentWithEmbedding[]; timestamp: number } = { data: [], timestamp: 0 };
const FRAGMENTS_CACHE_TTL = 5 * 60 * 1000; // 5 minutos

/**
 * Obtiene todos los fragmentos de arsenales con embeddings
 * Los fragmentos tienen categoría como: arsenal_inicial_WHY_01, arsenal_avanzado_OBJ_03, etc.
 */
async function getArsenalFragments(): Promise<DocumentWithEmbedding[]> {
  // Check cache
  if (fragmentsCache.data.length > 0 && (Date.now() - fragmentsCache.timestamp) < FRAGMENTS_CACHE_TTL) {
    console.log(`⚡ [Fragments] Usando ${fragmentsCache.data.length} fragmentos desde cache`);
    return fragmentsCache.data;
  }

  try {
    const { data, error } = await getSupabaseClient()
      .from('nexus_documents')
      .select('category, title, content, embedding_512, metadata')
      .like('category', 'arsenal_%_%')  // Match arsenal_inicial_WHY_01, etc.
      .not('embedding_512', 'is', null);

    if (error) {
      console.error('[Fragments] Error loading fragments:', error);
      return [];
    }

    const rawDocs = data as Array<{
      category: string;
      title: string;
      content: string;
      embedding_512: string;
      metadata: Record<string, unknown>;
    }> | null;

    // Filtrar solo fragmentos (tienen metadata.is_fragment = true)
    const fragments: DocumentWithEmbedding[] = (rawDocs || [])
      .filter(doc => {
        const meta = doc.metadata as { is_fragment?: boolean };
        return meta?.is_fragment === true;
      })
      .map(doc => ({
        category: doc.category,
        title: doc.title,
        content: doc.content,
        embedding: String(doc.embedding_512),
        metadata: doc.metadata
      }));

    // Update cache
    fragmentsCache.data = fragments;
    fragmentsCache.timestamp = Date.now();
    console.log(`⚡ [Fragments] Cacheados ${fragments.length} fragmentos de arsenales`);

    return fragments;
  } catch (error) {
    console.error('[Fragments] Exception loading fragments:', error);
    return [];
  }
}

/**
 * Busca fragmentos relevantes para una consulta usando Voyage AI
 *
 * @param userMessage - Mensaje del usuario
 * @param arsenalType - Tipo de arsenal (arsenal_inicial, arsenal_avanzado, arsenal_compensacion)
 * @param maxResults - Número máximo de fragmentos (default: 5)
 * @returns Array de fragmentos relevantes con similitud
 */
async function searchArsenalFragments(
  userMessage: string,
  arsenalType: string,
  maxResults: number = 5
): Promise<VectorSearchResult[]> {
  const voyageApiKey = process.env.VOYAGE_API_KEY;

  if (!voyageApiKey) {
    console.log('[Fragments] No VOYAGE_API_KEY, cannot search fragments');
    return [];
  }

  try {
    const allFragments = await getArsenalFragments();

    // Filtrar fragmentos del arsenal específico
    const arsenalFragments = allFragments.filter(f =>
      f.category.startsWith(`${arsenalType}_`)
    );

    if (arsenalFragments.length === 0) {
      console.log(`[Fragments] No fragments found for ${arsenalType}`);
      return [];
    }

    console.log(`⚡ [Fragments] Buscando en ${arsenalFragments.length} fragmentos de ${arsenalType}...`);

    // Buscar fragmentos similares
    const results = await vectorSearch(userMessage, arsenalFragments, voyageApiKey, {
      threshold: 0.30,  // Umbral más bajo para fragmentos específicos
      maxResults,
      debug: false
    });

    if (results.length > 0) {
      console.log(`✅ [Fragments] ${results.length} fragmentos relevantes encontrados:`);
      results.forEach((r, i) => console.log(`   ${i + 1}. ${r.category} (${r.similarity.toFixed(3)})`));
    }

    return results;
  } catch (error) {
    console.error('[Fragments] Error searching fragments:', error);
    return [];
  }
}

/**
 * Clasificación vectorial usando Voyage AI
 * Retorna la categoría del documento más similar o null si no hay match claro
 *
 * @param userMessage - Mensaje del usuario
 * @returns Categoría del documento o null
 */
async function clasificarDocumentoVectorial(userMessage: string): Promise<string | null> {
  const voyageApiKey = process.env.VOYAGE_API_KEY;

  // Si no hay API key, skip búsqueda vectorial
  if (!voyageApiKey) {
    console.log('[VectorSearch] No VOYAGE_API_KEY, skipping vector search');
    return null;
  }

  try {
    const documents = await getDocumentsWithEmbeddings();

    if (documents.length === 0) {
      console.log('[VectorSearch] No documents with embeddings found');
      return null;
    }

    const results = await vectorSearch(userMessage, documents, voyageApiKey, {
      threshold: 0.35, // Umbral más estricto para evitar falsos positivos
      maxResults: 1,
      debug: false
    });

    if (results.length > 0) {
      const topResult = results[0];
      console.log(`[VectorSearch] Match: ${topResult.category} (similarity: ${topResult.similarity.toFixed(3)})`);

      // Solo retornar si la similitud es suficientemente alta
      if (topResult.similarity >= 0.4) {
        return topResult.category;
      } else {
        console.log(`[VectorSearch] Similarity too low (${topResult.similarity.toFixed(3)} < 0.4), using pattern fallback`);
      }
    }

    return null;
  } catch (error) {
    console.error('[VectorSearch] Error:', error);
    return null;
  }
}

// FUNCIÓN ACTUALIZADA: clasificarDocumentoHibrido() con EXPANSIÓN SEMÁNTICA COMPLETA
// Para reconocer TODAS las variaciones de "¿Cómo funciona el negocio?"

function clasificarDocumentoHibrido(userMessage: string): string | null {
  const messageLower = userMessage.toLowerCase();

  // 🔧 NUEVA CLASIFICACIÓN ROBUSTA: PRODUCTOS INDIVIDUALES (CATÁLOGO) - FIX 2025-10-25: AGREGADO "VALOR"
  const patrones_productos = [
    // ===== CÁPSULAS CORDYGOLD (PROBLEMA ESPECÍFICO) =====
    /(?:dame el precio|cuánto cuesta|precio|cuesta|valor|vale|cuánto vale).*(?:cordy gold|cordygold|cordy|gano cordyceps)/i,
    /(?:dame el precio|cuánto cuesta|precio|cuesta|valor|vale|cuánto vale).*cordyceps/i,

    // ===== GANO CAFÉ VARIACIONES =====
    /(?:dame el precio|cuánto cuesta|precio|cuesta|valor|vale|cuánto vale).*(?:gano.*café|ganocafé|café.*3.*en.*1|capuchino)/i,
    /(?:dame el precio|cuánto cuesta|precio|cuesta|valor|vale|cuánto vale).*(?:café.*negro|café.*clásico|negrito)/i,
    /(?:dame el precio|cuánto cuesta|precio|cuesta|valor|vale|cuánto vale).*(?:latte.*rico|mocha.*rico|shoko.*rico)/i,

    // ===== CÁPSULAS SUPLEMENTOS =====
    /(?:dame el precio|cuánto cuesta|precio|cuesta|valor|vale|cuánto vale).*(?:cápsulas.*ganoderma|ganoderma.*lucidum)/i,
    /(?:dame el precio|cuánto cuesta|precio|cuesta|valor|vale|cuánto vale).*excellium/i,
    /(?:dame el precio|cuánto cuesta|precio|cuesta|valor|vale|cuánto vale).*(?:cápsula|suplemento)/i,

    // ===== LÍNEA LUVOCO =====
    /(?:dame el precio|cuánto cuesta|precio|cuesta|valor|vale|cuánto vale).*(?:máquina.*luvoco|luvoco)/i,
    /(?:dame el precio|cuánto cuesta|precio|cuesta|valor|vale|cuánto vale).*(?:cápsulas.*luvoco|luvoco.*cápsulas)/i,

    // ===== PRODUCTOS ESPECÍFICOS =====
    /(?:dame el precio|cuánto cuesta|precio|cuesta|valor|vale|cuánto vale).*(?:reskine|colágeno)/i,
    /(?:dame el precio|cuánto cuesta|precio|cuesta|valor|vale|cuánto vale).*(?:espirulina|c'real)/i,
    /(?:dame el precio|cuánto cuesta|precio|cuesta|valor|vale|cuánto vale).*(?:rooibos|oleaf)/i,
    /(?:dame el precio|cuánto cuesta|precio|cuesta|valor|vale|cuánto vale).*schokoladde/i,

    // ===== CUIDADO PERSONAL =====
    /(?:dame el precio|cuánto cuesta|precio|cuesta|valor|vale|cuánto vale).*(?:pasta.*dientes|gano fresh)/i,
    /(?:dame el precio|cuánto cuesta|precio|cuesta|valor|vale|cuánto vale).*(?:jabón|champú|acondicionador|exfoliante)/i,
    /(?:dame el precio|cuánto cuesta|precio|cuesta|valor|vale|cuánto vale).*(?:piel.*brillo|piel&brillo)/i,

    // ===== PATRONES GENERALES DE PRODUCTOS =====
    /(?:dame el precio|cuánto cuesta|precio|cuesta|valor|vale|cuánto vale).*producto/i,
    /(?:precio|valor).*(?:consumidor|individual)/i,
    /catálogo.*(?:precio|valor)/i,
    /lista.*(?:precios|valores).*producto/i,

    // ===== PATRONES ESPECÍFICOS POR MARCA =====
    /(?:dame el precio|cuánto cuesta|precio|cuesta|valor|vale|cuánto vale).*(?:gano excel|dxn)/i,

    // ===== CRÍTICO: Distinguir productos de paquetes de inversión =====
    /(?:cuánto.*cuesta|cuánto.*vale|valor)(?!.*paquete|.*inversión|.*empezar|.*constructor|.*activar)/i,
    /(?:precio|valor).*(?!.*paquete|.*inversión|.*constructor)/i,
  ];

  // 🎯 NUEVA CLASIFICACIÓN: LOS 12 NIVELES (arsenal_12_niveles v4.0)
  // Solo se activa con menciones EXPLÍCITAS a "12 niveles" o "kit de inicio"
  // Separado de patrones_compensacion para socios activos con estrategia específica
  const patrones_12_niveles = [
    // ===== MENCIONES EXPLÍCITAS "12 NIVELES" =====
    /12\s*niveles/i,                     // "12 niveles", "12niveles"
    /doce\s*niveles/i,                   // "doce niveles"
    /los\s*12\s*niveles/i,               // "los 12 niveles"
    /los\s*doce\s*niveles/i,             // "los doce niveles"
    /estrategia.*12.*niveles/i,          // "estrategia de 12 niveles"
    /reto.*12.*niveles/i,                // "reto 12 niveles"

    // ===== MENCIONES EXPLÍCITAS "KIT DE INICIO" =====
    /kit\s*de\s*inicio/i,                // "kit de inicio"
    /kit\s*inicio/i,                     // "kit inicio"
    /kit\s*inicial/i,                    // "kit inicial"
    /el\s*kit/i,                         // "el kit" (en contexto)

    // ===== PRECIOS ESPECÍFICOS KIT =====
    /443[,.]?600/i,                      // "$443,600" o "443.600"
    /443\s*mil/i,                        // "443 mil"
    /cuatrocientos.*cuarenta.*tres/i,    // escrito en palabras
  ];

  // 🔥 CLASIFICACIÓN: RETO 12 DÍAS + COMPENSACIÓN GENERAL (arsenal_compensacion)
  // Prioridad alta para capturar preguntas sobre el reto, inversión mínima y formas de ganar
  const patrones_compensacion = [
    // ===== RETO DE LOS 12 DÍAS =====
    /reto/i,                           // "reto", "el reto"
    /12.*días/i,                       // "12 días"
    /doce.*días/i,                     // "doce días"
    /reto.*diciembre/i,                // "reto de diciembre"
    /campaña.*diciembre/i,             // "campaña de diciembre"
    /construir.*diciembre/i,           // "construir en diciembre"

    // ===== INVERSIÓN MÍNIMA / KIT DE INICIO =====
    /inversión.*mínima/i,              // "inversión mínima"
    /inversion.*minima/i,              // sin tildes
    /mínimo.*para.*empezar/i,          // "mínimo para empezar"
    /minimo.*para.*empezar/i,          // sin tildes
    /443/i,                            // "$443,600" o "443 mil"
    /kit.*inicio/i,                    // "kit de inicio"
    /kit.*inicial/i,                   // "kit inicial"
    /cuánto.*mínimo/i,                 // "cuánto es el mínimo"
    /menos.*puedo.*empezar/i,          // "con cuánto menos puedo empezar"
    /más.*barato/i,                    // "más barato"
    /más.*económico/i,                 // "más económico"
    /opción.*accesible/i,              // "opción accesible"
    /menor.*inversión/i,               // "menor inversión"

    // ===== COMPENSACIÓN Y FORMAS DE GANAR =====
    /cómo.*gano/i,                     // "cómo gano"
    /como.*gano/i,                     // sin tilde
    /cómo.*se.*gana/i,                 // "cómo se gana"
    /como.*se.*gana/i,                 // sin tilde
    /cómo.*gana.*uno/i,                // "cómo gana uno"
    /cómo.*ganas/i,                    // "cómo ganas"
    /gana.*en.*este.*plan/i,           // "gana en este plan"
    /ganar.*en.*este.*plan/i,          // "ganar en este plan"
    /formas.*ganar/i,                  // "formas de ganar"
    /maneras.*ganar/i,                 // "maneras de ganar"
    /cuántas.*formas.*ganar/i,         // "cuántas formas de ganar"
    /12.*formas/i,                     // "12 formas"
    /doce.*formas/i,                   // "doce formas"
    /plan.*compensación/i,             // "plan de compensación"
    /plan.*compensacion/i,             // sin tilde
    /plan.*ganancias/i,                // "plan de ganancias"

    // ===== PROYECCIONES Y GANANCIAS =====
    /proyección.*ganar/i,              // "proyección de ganancias"
    /cuánto.*puedo.*ganar/i,           // "cuánto puedo ganar"
    /cuanto.*puedo.*ganar/i,           // sin tilde
    /potencial.*ganancias/i,           // "potencial de ganancias"
    /ganar.*reto/i,                    // "ganar con el reto"
    /ganar.*12.*días/i,                // "ganar en 12 días"
    /ganancias.*reto/i,                // "ganancias del reto"
    /ingresos.*reto/i,                 // "ingresos del reto"

    // ===== DUPLICACIÓN 2x2 =====
    /2.*x.*2/i,                        // "2x2"
    /2×2/i,                            // "2×2"
    /duplicación/i,                    // "duplicación"
    /sistema.*2.*2/i,                  // "sistema 2 2"
    /red.*8.*190/i,                    // "red de 8,190"

    // ===== PREGUNTAS SOBRE OPCIONES DE INVERSIÓN =====
    /opciones.*inversión/i,            // "opciones de inversión"
    /opciones.*para.*empezar/i,        // "opciones para empezar"
    /con.*cuánto.*empiezo/i,           // "con cuánto empiezo"
    /con.*cuanto.*empiezo/i,           // sin tilde
    /cuánto.*necesito.*invertir/i,     // "cuánto necesito invertir"
    /cuanto.*necesito.*invertir/i,     // sin tilde

    // ===== 🆕 PREGUNTAS SOBRE CV/PV DE PRODUCTOS (FIX 2025-12-10) =====
    // Preguntas directas sobre CV/PV de productos individuales
    /cu[aá]ntos?\s*cv/i,               // "cuántos CV", "cuanto CV"
    /cu[aá]ntos?\s*pv/i,               // "cuántos PV", "cuanto PV"
    /cv\s*(?:tiene|de|del)/i,          // "CV tiene", "CV de", "CV del"
    /pv\s*(?:tiene|de|del)/i,          // "PV tiene", "PV de", "PV del"
    /(?:tiene|aporta|genera).*cv/i,    // "tiene CV", "aporta CV", "genera CV"
    /(?:tiene|aporta|genera).*pv/i,    // "tiene PV", "aporta PV", "genera PV"
    /puntos.*(?:tiene|de|del)/i,       // "puntos tiene", "puntos de"
    /(?:valor|volumen).*comision/i,    // "valor comisional", "volumen comisional"
    /(?:valor|volumen).*personal/i,    // "valor personal", "volumen personal"

    // Preguntas sobre cálculos de recompra con PV
    /completar.*pv/i,                  // "completar mis PV"
    /faltan.*pv/i,                     // "me faltan PV"
    /llegar.*a.*50.*pv/i,              // "llegar a 50 PV"
    /tengo.*pv.*(?:qu[eé]|c[oó]mo)/i,  // "tengo 30 PV, qué..."
    /con.*qu[eé].*productos.*complet/i,// "con qué productos completo"
    /qu[eé].*productos.*para.*pv/i,    // "qué productos para mis PV"
    /productos.*para.*recompra/i,      // "productos para recompra"
    /cu[aá]nto.*pv.*(?:necesito|falta)/i, // "cuánto PV necesito/falta"

    // Preguntas específicas sobre máquina Luvoco y puntos
    /luvoco.*(?:cv|pv|puntos)/i,       // "luvoco CV", "luvoco PV"
    /m[aá]quina.*(?:cv|pv|puntos)/i,   // "máquina CV", "máquina puntos"
    /(?:cv|pv|puntos).*luvoco/i,       // "CV luvoco", "puntos luvoco"
    /(?:cv|pv|puntos).*m[aá]quina/i,   // "CV máquina", "puntos máquina"
  ];

  // NUEVA CLASIFICACIÓN: PAQUETES DE INVERSIÓN (CONSTRUCTORES)
  const patrones_paquetes = [
    // Paquetes específicos de inversión
    /cuál.*inversión/i,
    /precio.*paquete/i,
    /cuesta.*empezar/i,
    /inversión.*inicial/i,
    /constructor.*inicial/i,
    /constructor.*empresarial/i,
    /constructor.*visionario/i,
    /paquete.*emprendedor/i,
    /cuánto.*cuesta.*(empezar|constructor|paquete|inversión|activar)/i,

    // Contexto de inversión para construcción
    /inversión.*para/i,
    /costo.*activar/i,
    /precio.*fundador/i,

    // Patrones generales para paquetes
    /háblame.*paquetes/i,
    /sobre.*paquetes/i,
    /de.*los.*paquetes/i,
    /qué.*paquetes/i,
    /cuáles.*paquetes/i,
    /información.*paquetes/i,
    /paquetes.*disponibles/i,
    /paquetes.*hay/i,
    /tipos.*paquetes/i,

    // Referencias específicas ESP
    /esp\s*1/i,
    /esp\s*2/i,
    /esp\s*3/i,
    /esp1/i,
    /esp2/i,
    /esp3/i,
    /paquete.*esp/i,
    /esp.*paquete/i,

    // 🆕 FIX 2025-10-21: PATRONES PARA PRODUCTOS POR PAQUETE (SIST_11)
    // ============================================================
    // Preguntas sobre CANTIDAD de productos
    /cuántos.*productos.*paquete/i,
    /cuántos.*productos.*ESP/i,
    /cuántos.*productos.*trae/i,
    /cuántos.*productos.*incluye/i,
    /cuántos.*productos.*contiene/i,
    /cantidad.*productos.*paquete/i,
    /número.*productos.*paquete/i,

    // Preguntas sobre QUÉ productos
    /qué.*productos.*paquete/i,
    /qué.*productos.*ESP/i,
    /qué.*productos.*trae/i,
    /qué.*productos.*incluye/i,
    /qué.*contiene.*paquete/i,
    /qué.*viene.*paquete/i,
    /cuáles.*productos.*paquete/i,
    /cuáles.*productos.*ESP/i,

    // Preguntas sobre INVENTARIO/COMPOSICIÓN
    /inventario.*paquete/i,
    /listado.*productos.*paquete/i,
    /lista.*productos.*paquete/i,
    /desglose.*paquete/i,
    /composición.*paquete/i,
    /detalle.*paquete/i,
    /detalle.*productos.*paquete/i,

    // Patrones específicos por paquete y productos
    /ESP.*1.*productos/i,
    /ESP.*2.*productos/i,
    /ESP.*3.*productos/i,
    /Inicial.*productos/i,
    /Empresarial.*productos/i,
    /Visionario.*productos/i,
    /productos.*Inicial/i,
    /productos.*Empresarial/i,
    /productos.*Visionario/i,

    // Patrones de contexto "qué viene"
    /qué.*viene.*ESP/i,
    /qué.*trae.*ESP/i,
    /qué.*incluye.*ESP/i
  ];

  // 🌿 PRIORIDAD 1: BENEFICIOS CIENTÍFICOS + PRODUCTOS (catalogo_productos v3.0)
  // Detecta preguntas sobre beneficios, propiedades, Ganoderma, estudios científicos, precios
  // CONSOLIDADO: productos_ciencia + catalogo_productos → catalogo_productos v3.0
  const patrones_beneficios_productos = [
    // Beneficios generales
    /beneficios.*productos/i,
    /qué.*beneficios.*productos/i,
    /cuáles.*beneficios/i,
    /para.*qué.*sirven.*productos/i,
    /qué.*hacen.*productos/i,
    /por.*qué.*productos/i,

    // Ganoderma específico
    /ganoderma/i,
    /reishi/i,
    /hongo/i,
    /qué.*es.*ganoderma/i,
    /beneficios.*ganoderma/i,
    /propiedades.*ganoderma/i,
    /para.*qué.*sirve.*ganoderma/i,
    /por.*qué.*ganoderma/i,
    /qué.*hace.*ganoderma/i,

    // Estudios científicos
    /estudios.*científicos/i,
    /estudios.*pubmed/i,
    /evidencia.*científica/i,
    /respaldo.*científico/i,
    /investigación.*ganoderma/i,

    // Salud y bienestar
    /salud.*productos/i,
    /sistema.*inmune/i,
    /inmunológico/i,
    /anti.*inflamatorio/i,
    /energía.*productos/i,
    /claridad.*mental/i,

    // Preguntas técnicas (TECH_01 a TECH_04 ahora en catalogo_productos)
    /seguro.*consumir/i,
    /cuánto.*tiempo.*beneficios/i,
    /cómo.*tomar/i,
    /cómo.*combinar.*productos/i,
    /dosis/i,
    /contraindicaciones/i,

    // Diferenciación
    /qué.*hace.*diferente.*gano.*excel/i,
    /diferencia.*otros.*productos/i,
    /por.*qué.*gano.*excel/i,
    /ventaja.*productos/i,
    /fórmula.*exclusiva|proceso.*único|secreto.*industrial/i,
    /proceso.*extracción/i,
    /biodisponibilidad/i
  ];

  // PRIORIDAD 2: PRODUCTOS INDIVIDUALES - PRECIOS (catálogo)
  if (patrones_productos.some(patron => patron.test(messageLower)) ||
      patrones_beneficios_productos.some(patron => patron.test(messageLower))) {
    console.log('🛒 Clasificación: PRODUCTOS + CIENCIA (catalogo_productos v3.0)');
    return 'catalogo_productos';
  }

  // 🎯 PRIORIDAD 2.4: RETO DE 5 DÍAS (arsenal_reto v1.0)
  // Lead Magnet principal - Challenge Funnel
  const patrones_reto_5_dias = [
    /reto\s*(de\s*)?(5|cinco)\s*d[ií]as?/i,    // "reto de 5 días", "reto 5 dias"
    /reto\s*5/i,                                // "reto 5"
    /cinco\s*d[ií]as/i,                         // "cinco días"
    /5\s*d[ií]as/i,                             // "5 días"
    /bootcamp/i,                                // "bootcamp"
    /challenge/i,                               // "challenge"
    /c[oó]mo\s*(me\s*)?registro/i,              // "cómo me registro"
    /c[oó]mo\s*(me\s*)?inscribo/i,              // "cómo me inscribo"
    /c[oó]mo\s*empiezo\s*el\s*reto/i,           // "cómo empiezo el reto"
    /qu[eé]\s*es\s*el\s*reto/i,                 // "qué es el reto"
    /de\s*qu[eé]\s*trata\s*el\s*reto/i,         // "de qué trata el reto"
    /temario/i,                                 // "temario"
    /qu[eé]\s*voy\s*a\s*aprender/i,             // "qué voy a aprender"
    /es\s*gratis\s*el\s*reto/i,                 // "es gratis el reto"
    /cuesta\s*el\s*reto/i,                      // "cuesta el reto"
    /precio\s*del\s*reto/i,                     // "precio del reto"
    /horarios?\s*(del\s*)?reto/i,               // "horarios del reto"
    /es\s*en\s*vivo/i,                          // "es en vivo"
    /es\s*grabado/i,                            // "es grabado"
    /requisitos?\s*(para\s*)?(el\s*)?reto/i,    // "requisitos para el reto"
    /qu[eé]\s*necesito\s*para\s*(el\s*)?reto/i, // "qué necesito para el reto"
    /simulador/i,                               // "simulador" (analogía del arsenal)
    /test\s*drive/i,                            // "test drive" (analogía del arsenal)
    /prueba\s*antes\s*de\s*comprar/i,           // "prueba antes de comprar"
  ];

  if (patrones_reto_5_dias.some(patron => patron.test(messageLower))) {
    console.log('🎯 Clasificación: RETO DE 5 DÍAS (arsenal_reto v1.0)');
    return 'arsenal_reto';
  }

  // 🎯 PRIORIDAD 2.5: LOS 12 NIVELES (arsenal_12_niveles v4.0)
  // Solo activa con menciones EXPLÍCITAS - separado de compensación general
  if (patrones_12_niveles.some(patron => patron.test(messageLower))) {
    console.log('🎯 Clasificación: LOS 12 NIVELES (arsenal_12_niveles v4.0)');
    return 'arsenal_12_niveles';
  }

  // 🔥 PRIORIDAD 3: RETO 12 DÍAS + COMPENSACIÓN (arsenal_compensacion)
  if (patrones_compensacion.some(patron => patron.test(messageLower))) {
    console.log('🔥 Clasificación: RETO 12 DÍAS + COMPENSACIÓN (arsenal_compensacion)');
    return 'arsenal_compensacion';
  }

  // PRIORIDAD 4: PAQUETES DE INVERSIÓN
  // 🆕 FIX 2025-11-25: Routing a arsenal_avanzado (contiene SIST_11 con productos por paquete)
  if (patrones_paquetes.some(patron => patron.test(messageLower))) {
    console.log('💼 Clasificación: PAQUETES (arsenal_avanzado - SIST_11)');
    return 'arsenal_avanzado'; // ✅ CORRECTO: SIST_11 está en arsenal_avanzado
  }

  // 🎯 PRIORIDAD 5: FLUJO 3 NIVELES - EXPANSIÓN SEMÁNTICA CRÍTICA
  // ===============================================================
  const patrones_flujo_3_niveles = [
    // ===== VARIACIONES DIRECTAS "¿CÓMO FUNCIONA?" =====
    /^cómo funciona$/i,                    // "¿Cómo funciona?" (exacto)
    /^cómo funciona\?$/i,                  // "¿Cómo funciona?" (con interrogación)
    /^¿cómo funciona$/i,                   // "¿Cómo funciona" (sin cierre)
    /^¿cómo funciona\?$/i,                 // "¿Cómo funciona?" (completo)

    // ===== VARIACIONES CON OBJETOS GENÉRICOS =====
    /cómo funciona esto/i,                 // "¿Cómo funciona esto?"
    /cómo funciona eso/i,                  // "¿Cómo funciona eso?"
    /cómo funciona aquí/i,                 // "¿Cómo funciona aquí?"
    /cómo funciona todo/i,                 // "¿Cómo funciona todo?"

    // ===== VARIACIONES CON TÉRMINOS ESPECÍFICOS =====
    /cómo funciona.*negocio/i,             // "¿Cómo funciona el negocio?" (original)
    /cómo funciona.*oportunidad/i,         // "¿Cómo funciona la oportunidad?"
    /cómo funciona.*sistema/i,             // "¿Cómo funciona el sistema?"
    /cómo funciona.*modelo/i,              // "¿Cómo funciona el modelo?"
    /cómo funciona.*ecosistema/i,          // "¿Cómo funciona el ecosistema?"
    /cómo funciona.*plataforma/i,          // "¿Cómo funciona la plataforma?"
    /cómo funciona.*proceso/i,             // "¿Cómo funciona el proceso?"
    /cómo funciona.*método/i,              // "¿Cómo funciona el método?"
    /cómo funciona.*framework/i,           // "¿Cómo funciona el framework?"

    // ===== VARIACIONES ALTERNATIVAS SEMÁNTICAS =====
    /^en qué consiste$/i,                  // "¿En qué consiste?"
    /en qué consiste esto/i,               // "¿En qué consiste esto?"
    /en qué consiste.*negocio/i,           // "¿En qué consiste el negocio?"
    /en qué consiste.*oportunidad/i,       // "¿En qué consiste la oportunidad?"
    /en qué consiste.*sistema/i,           // "¿En qué consiste el sistema?"

    /explícame.*sistema/i,                 // "Explícame el sistema"
    /explícame.*negocio/i,                 // "Explícame el negocio"
    /explícame.*oportunidad/i,             // "Explícame la oportunidad"
    /explícame.*modelo/i,                  // "Explícame el modelo"
    /explícame.*proceso/i,                 // "Explícame el proceso"
    /explícame.*método/i,                  // "Explícame el método"
    /explícame cómo/i,                     // "Explícame cómo..."

    /cuál es.*modelo/i,                    // "¿Cuál es el modelo?"
    /cuál es.*sistema/i,                   // "¿Cuál es el sistema?"
    /cuál es.*método/i,                    // "¿Cuál es el método?"
    /cuál es.*proceso/i,                   // "¿Cuál es el proceso?"
    /cuál es.*negocio/i,                   // "¿Cuál es el negocio?"

    /de qué se trata/i,                    // "¿De qué se trata?"
    /de qué va esto/i,                     // "¿De qué va esto?"
    /de qué va.*negocio/i,                 // "¿De qué va el negocio?"
    /qué es lo que hacen/i,                // "¿Qué es lo que hacen?"
    /qué es lo que ofertan/i,              // "¿Qué es lo que ofertan?"

    // ===== VARIACIONES OPERACIONALES =====
    /cómo opera/i,                         // "¿Cómo opera?"
    /cómo opera esto/i,                    // "¿Cómo opera esto?"
    /cómo se maneja/i,                     // "¿Cómo se maneja?"
    /cómo se desarrolla/i,                 // "¿Cómo se desarrolla?"
    /cómo se ejecuta/i,                    // "¿Cómo se ejecuta?"

    // ===== CONTEXTO INICIO DE CONVERSACIÓN =====
    // Patrones que son más probables al inicio del chat
    /^háblame.*negocio$/i,                 // "Háblame del negocio"
    /^háblame.*oportunidad$/i,             // "Háblame de la oportunidad"
    /^háblame.*sistema$/i,                 // "Háblame del sistema"
    /^cuéntame.*negocio$/i,                // "Cuéntame del negocio"
    /^cuéntame.*oportunidad$/i,            // "Cuéntame de la oportunidad"
    /^cuéntame.*sistema$/i,                // "Cuéntame del sistema"

    // ===== VARIACIONES INFORMALES =====
    /cómo va.*negocio/i,                   // "¿Cómo va el negocio?"
    /cómo va.*sistema/i,                   // "¿Cómo va el sistema?"
    /cómo está.*negocio/i,                 // "¿Cómo está el negocio?"
    /qué tal.*negocio/i,                   // "¿Qué tal el negocio?"
    /qué tal.*oportunidad/i,               // "¿Qué tal la oportunidad?"
  ];

  // ✅ VERIFICAR PATRONES FLUJO 3 NIVELES
  const esFluo3Niveles = patrones_flujo_3_niveles.some(patron => patron.test(messageLower));

  if (esFluo3Niveles) {
    console.log('🎯 Clasificación: FLUJO 3 NIVELES (arsenal_inicial con flujo especial)');
    console.log('🎯 Mensaje detectado para flujo:', messageLower);
    return 'arsenal_inicial'; // Retorna arsenal_inicial pero se activará el flujo 3 niveles
  }

  // Resto de clasificaciones originales - PATRONES ACTUALIZADOS
  const patrones_inicial = [
    /qué es.*creatuactivo/i,
    /retorno.*activo/i,
    /es.*heredable/i,
    /qué.*fundador/i,
    /quién.*detrás/i,
    /es.*confiable/i,
    /realmente.*funciona/i,
    /tiempo.*operando/i,
    /es.*legítimo/i,

    // NUEVOS PATRONES GENERALES INICIALES
    /^qué es esto$/i,                      // "¿Qué es esto?"
    /qué es.*ecosistema/i,                 // "¿Qué es el ecosistema?"
    /qué es.*plataforma/i,                 // "¿Qué es la plataforma?"
    /información.*básica/i,                // "Información básica"
    /información.*general/i,               // "Información general"
  ];

  const patrones_manejo = [
    /esto.*mlm/i,
    /es.*pirámide/i,
    /necesito.*experiencia/i,
    /no.*tengo.*tiempo/i,
    /me.*da.*miedo/i,
    /no.*sé.*vender/i,
    /datos.*personales/i,
    /puedo.*pausar/i,
    /cómo.*pagos/i,
    /funciona.*país/i,
    /qué.*soporte/i,
    /mucho.*trabajo/i,
    /automatiza.*80/i
  ];

  const patrones_cierre = [
    /cómo.*distribución/i,
    /herramientas.*tecnológicas/i,
    /cómo.*escalar/i,
    /modelo.*dea/i,
    /cómo.*se.*gana/i,
    /cuánto.*ganar/i,
    /porcentajes.*modelo/i,
    /qué.*me.*venden/i,
    /siguiente.*paso/i,
    /hablar.*equipo/i,
    /empezar.*hoy/i,
    /contactar.*alguien/i,

    // 🆕 FIX 2025-12-07: PATRONES PARA BONOS Y COMISIONES (VAL_01, VAL_02)
    // ============================================================
    /bono/i,                      // "bono", "bonos", "qué bono"
    /gen5/i,                      // "gen5", "GEN5"
    /gen\s*5/i,                   // "gen 5", "GEN 5"
    /gen-5/i,                     // "gen-5"
    /inicio.*rápido/i,            // "inicio rápido", "bono de inicio rápido"
    /inicio.*rapido/i,            // sin tilde
    /comisión/i,                  // "comisión", "comisiones"
    /comision/i,                  // sin tilde
    /cuánto.*gano/i,              // "cuánto gano"
    /cuanto.*gano/i,              // sin tilde
    /porcentaje/i,                // "porcentaje", "porcentajes"
    /qué.*gano.*cuando/i,         // "qué gano cuando alguien compra"
    /que.*gano.*cuando/i,         // sin tilde
    /plan.*compensación/i,        // "plan de compensación"
    /plan.*compensacion/i,        // sin tilde
    /binario/i,                   // "binario", "bono binario"
    /bono.*semanal/i,             // "bono semanal"
    /consumo.*semanal/i,          // "consumo semanal"
    /recompra/i,                  // "recompra", "recompras"

    // 🆕 FIX 2025-10-22: PATRONES PARA AUTO ENVÍO (SIST_12)
    // ============================================================
    /auto.*envío/i,
    /autoenvío/i,
    /auto\s*envío/i,
    /qué.*auto.*envío/i,
    /cómo.*funciona.*auto.*envío/i,
    /beneficios.*auto.*envío/i,
    /programa.*auto.*envío/i,
    /qué.*es.*auto.*envío/i,
    /explicame.*auto.*envío/i,
    /cuánto.*auto.*envío/i,

    // Variaciones sin tilde
    /auto.*envio/i,
    /qué.*auto.*envio/i,
    /beneficios.*auto.*envio/i,

    // Contexto de programa de lealtad
    /programa.*lealtad/i,
    /producto.*gratis/i,
    /producto.*obsequio/i,
    /recompensa.*consumo/i,

    // 🆕 FIX 2025-10-22: PATRONES PARA SECCIONES SIST FALTANTES (Auditoría Completa)
    // ============================================================

    // SIST_03: "¿Cómo escalo mi operación estratégicamente?"
    /escalo.*operación/i,
    /escala.*operación/i,
    /escalabilidad.*operación/i,
    /operación.*estratégica/i,
    /escalar.*estratégicamente/i,
    /cómo.*crezco/i,

    // SIST_04: "¿Dónde queda mi toque personal en un sistema tan automatizado?"
    /toque.*personal/i,
    /personalización/i,
    /sistema.*automatizado/i,
    /automatizado.*personal/i,
    /dónde.*queda.*personal/i,

    // SIST_05: "¿Qué diferencia esto de otros sistemas tecnológicos?"
    /diferencia.*otros.*sistemas/i,
    /diferencia.*sistemas.*tecnológicos/i,
    /qué.*diferencia.*esto/i,
    /vs.*otros.*sistemas/i,
    /comparación.*sistemas/i,

    // SIST_07: "¿Qué me diferencia de los demás constructores?"
    /me.*diferencia.*constructores/i,
    /diferencia.*demás.*constructores/i,
    /otros.*constructores/i,
    /diferenciación.*personal/i,

    // SIST_08: "¿Qué tipo de personas ya están construyendo aquí?"
    /tipo.*personas/i,
    /personas.*construyendo/i,
    /quién.*está.*aquí/i,
    /perfil.*constructores/i,
    /ya.*están.*construyendo/i,

    // SIST_09: "¿Cuál sería tu rol como mi mentor?"
    /rol.*mentor/i,
    /como.*mentor/i,
    /tu.*rol/i,
    /mentoría/i,
    /guía.*estratégico/i,

    // SIST_10: "¿Cuál es el plan de construcción para el primer año?"
    /plan.*construcción/i,
    /plan.*primer.*año/i,
    /roadmap.*año/i,
    /estrategia.*anual/i,
    /plan.*anual/i,

    // 🆕 FIX 2025-10-22: PATRONES PARA SECCIONES VAL FALTANTES
    // ============================================================

    // VAL_03: "¿Mi ingreso depende de cuánta gente active?"
    /ingreso.*depende.*gente/i,
    /depende.*cuánta.*gente/i,
    /depende.*activar/i,
    /ingreso.*cantidad/i,

    // VAL_05: "¿Qué me están vendiendo exactamente?"
    /qué.*venden.*exactamente/i,
    /qué.*me.*están.*vendiendo/i,
    /están.*vendiendo/i,
    /venden.*realmente/i,

    // VAL_06: "¿En qué tiempo promedio veo resultados?"
    /tiempo.*promedio.*resultados/i,
    /cuándo.*veo.*resultados/i,
    /cuánto.*tiempo.*resultados/i,
    /qué.*tiempo.*resultados/i,

    // VAL_07: "¿Normalmente qué estadística hay de éxito?"
    /estadística.*éxito/i,
    /qué.*estadística/i,
    /tasa.*éxito/i,
    /porcentaje.*éxito/i,
    /normalmente.*éxito/i,

    // VAL_08: "¿Cuál paquete me recomienda para iniciar?"
    /paquete.*recomienda/i,
    /recomienda.*iniciar/i,
    /cuál.*paquete.*mejor/i,
    /qué.*paquete.*elegir/i,

    // VAL_09: "¿Cuál es la arquitectura completa que incluye esto?"
    /arquitectura.*completa/i,
    /qué.*incluye.*arquitectura/i,
    /arquitectura.*incluye/i,
    /qué.*viene.*arquitectura/i,

    // VAL_10: "¿Es lo mismo que otros sistemas de marketing que he visto?"
    /es.*lo.*mismo/i,
    /igual.*otros.*sistemas/i,
    /otros.*sistemas.*marketing/i,
    /parecido.*otros/i,

    // VAL_11: "¿Qué significan PV, CV y GCV?"
    /qué.*significan/i,
    /significado.*pv/i,
    /qué.*es.*pv/i,
    /qué.*es.*cv/i,
    /qué.*es.*gcv/i,
    /volumen.*personal/i,
    /volumen.*comisional/i,

    // 🆕 FIX 2025-10-22: PATRONES PARA SECCIONES ESC FALTANTES
    // ============================================================

    // ESC_03: "¿Cómo empiezo hoy mismo?"
    /empiezo.*hoy/i,
    /empezar.*inmediatamente/i,
    /empezar.*ya/i,
    /comenzar.*hoy/i,
    /activar.*hoy/i,

    // ESC_04: "¿Puedo reservar mi lugar sin comprometerme completamente?"
    /reservar.*lugar/i,
    /puedo.*reservar/i,
    /sin.*comprometerme/i,
    /sin.*compromiso/i,
    /apartar.*lugar/i,

    // ESC_05: "Me interesa pero necesito pensarlo"
    /necesito.*pensarlo/i,
    /interesa.*pero/i,
    /interesa.*necesito/i,
    /me.*interesa.*tiempo/i,
    /tengo.*dudas/i
  ];

  // Evaluar patrones restantes
  const esInicial = patrones_inicial.some(patron => patron.test(messageLower));
  const esManejo = patrones_manejo.some(patron => patron.test(messageLower));
  const esCierre = patrones_cierre.some(patron => patron.test(messageLower));

  console.log('Clasificación híbrida expandida:', {
    inicial: esInicial,
    manejo: esManejo,
    cierre: esCierre,
    flujo3Niveles: esFluo3Niveles,
    query: messageLower.substring(0, 50)
  });

  // Retornar clasificación más específica
  if (esInicial && !esManejo && !esCierre) return 'arsenal_inicial';
  if (esManejo || esCierre) return 'arsenal_avanzado'; // ✅ CONSOLIDADO: arsenal_manejo + arsenal_cierre → arsenal_avanzado

  return null; // Búsqueda general si no hay clasificación clara
}

// NUEVA FUNCIÓN: Consultar catálogo de productos
async function consultarCatalogoProductos(query: string): Promise<any[]> {
  console.log('🛒 Consultando catálogo de productos...');

  try {
    // Buscar por category (más confiable) o por pattern de título
    // NOTA: No usar id.eq.8 porque la tabla usa UUIDs, no integers
    const { data, error } = await getSupabaseClient()
      .from('nexus_documents')
      .select('id, title, content, category, metadata')
      .or('category.eq.catalogo_productos,title.ilike.%Catálogo%Productos%')
      .limit(1);

    if (error) {
      console.error('Error consultando catálogo de productos:', error);
      return [];
    }

    const docs = data as Array<{ id: string; title: string; content: string; category: string; metadata: Record<string, unknown> }> | null;
    if (!docs || docs.length === 0) {
      console.warn('⚠️ Catálogo de productos no encontrado en Supabase');
      return [];
    }

    const catalogoDoc = docs[0];
    console.log('✅ Catálogo de productos encontrado:', catalogoDoc.title);

    // Agregar metadata de identificación
    const result = {
      ...catalogoDoc,
      search_method: 'catalogo_productos',
      source: '/knowledge_base/catalogo_productos_gano_excel.txt'
    };

    return [result];

  } catch (error) {
    console.error('Error accediendo catálogo de productos:', error);
    return [];
  }
}

// Analizador de intención semántica
function analizarIntencionSemantica(userMessage: string): string[] {
  const messageLower = userMessage.toLowerCase();

  // Conceptos semánticos principales (ESCALABLES)
  const conceptos = {
    "funcionamiento": ["funciona", "cómo", "proceso", "sistema", "método"],
    "inversión": ["costo", "precio", "inversión", "dinero", "pagar", "vale"],
    "tiempo": ["cuándo", "tiempo", "retorno", "resultados", "rápido", "demora"],
    "credibilidad": ["confiable", "legítimo", "real", "funciona", "verdad", "estafa"],
    "soporte": ["ayuda", "apoyo", "soporte", "asistencia", "enseñan", "formación"],
    "escalación": ["hablar", "contactar", "siguiente", "empezar", "activar", "proceder"],
    "automatización": ["automatiza", "trabajo", "esfuerzo", "80%", "sistema"],
    "compensación": ["ganar", "ingreso", "dinero", "cuánto", "porcentaje"]
  };

  const conceptos_detectados = [];

  for (const [concepto, palabras] of Object.entries(conceptos)) {
    if (palabras.some(palabra => messageLower.includes(palabra))) {
      conceptos_detectados.push(concepto);
    }
  }

  console.log('Conceptos semánticos detectados:', conceptos_detectados);
  return conceptos_detectados;
}

// CORRECCIÓN: Búsqueda híbrida escalable en Arsenal MVP + Catálogo
async function consultarArsenalHibrido(query: string, userMessage: string, maxResults = 1) {
  const cacheKey = `hibrido_${query.toLowerCase()}`;

  const cached = searchCache.get(cacheKey);
  if (cached && (Date.now() - cached.timestamp) < CACHE_TTL) {
    console.log('Cache hit híbrido:', query);
    return cached.data;
  }

  // ============================================================================
  // PASO -1: EXPANSIÓN DE OPCIONES DEL MENÚ INICIAL (a, b, c, d)
  // ============================================================================
  // Cuando el usuario responde "a", "b", "c" o "d" al menú inicial, expandimos
  // el mensaje para que la búsqueda vectorial encuentre el contenido correcto.
  const menuExpansion: Record<string, string> = {
    'a': 'conocer el reto de los 12 días qué es el reto',
    'b': 'cómo funciona el negocio explicar el sistema',
    'c': 'qué productos distribuimos catálogo Gano Excel',
    'd': 'inversión y ganancias cuánto cuesta empezar'
  };

  const trimmedMessage = userMessage.trim().toLowerCase();
  let expandedMessage = userMessage;

  if (menuExpansion[trimmedMessage]) {
    expandedMessage = menuExpansion[trimmedMessage];
    console.log(`🔄 [MenuExpansion] "${trimmedMessage}" → "${expandedMessage}"`);
  }

  // ============================================================================
  // PASO 0: BÚSQUEDA VECTORIAL (90% precisión con Voyage AI)
  // ============================================================================
  // Intenta clasificación semántica primero, fallback a patrones si no hay match
  let documentType: string | null = null;

  try {
    documentType = await clasificarDocumentoVectorial(expandedMessage);
    if (documentType) {
      console.log(`🧠 [VectorSearch] Clasificación vectorial: ${documentType}`);
    }
  } catch (error) {
    console.warn('[VectorSearch] Failed, using pattern fallback:', error);
  }

  // PASO 1: Fallback a clasificación por patrones si vector no encontró match
  if (!documentType) {
    documentType = clasificarDocumentoHibrido(expandedMessage);
    if (documentType) {
      console.log(`📋 [Patterns] Clasificación por patrones: ${documentType}`);
    }
  }

  // NUEVA LÓGICA: CONSULTA DE CATÁLOGO DE PRODUCTOS
  if (documentType === 'catalogo_productos') {
    console.log('🛒 Consulta dirigida: CATÁLOGO DE PRODUCTOS');

    const catalogoResult = await consultarCatalogoProductos(query);

    if (catalogoResult.length > 0) {
      searchCache.set(cacheKey, {
        data: catalogoResult,
        timestamp: Date.now()
      });

      return catalogoResult;
    }
  }

  // ⚡ LÓGICA OPTIMIZADA v14.9: FRAGMENTOS DE ARSENALES
  // Reduce tokens de entrada de ~60K a ~3K por request (95% ahorro)
  if (documentType && documentType.startsWith('arsenal_')) {
    console.log(`⚡ Consulta fragmentada: ${documentType.toUpperCase()}`);

    try {
      // PASO 1: Buscar fragmentos relevantes con vector search
      const fragments = await searchArsenalFragments(userMessage, documentType, 5);

      if (fragments.length > 0) {
        // Calcular chars totales de fragmentos vs arsenal completo
        const totalFragmentChars = fragments.reduce((sum, f) => sum + f.content.length, 0);
        console.log(`✅ [Fragments] ${fragments.length} fragmentos encontrados (${totalFragmentChars} chars vs ~60K full arsenal)`);

        // Combinar contenido de fragmentos relevantes
        const combinedContent = fragments
          .map(f => f.content)
          .join('\n\n---\n\n');

        const result = [{
          id: `${documentType}_fragments`,
          title: `Fragmentos relevantes de ${documentType}`,
          content: combinedContent,
          category: documentType,
          metadata: {
            is_fragment_result: true,
            fragment_count: fragments.length,
            fragment_categories: fragments.map(f => f.category),
            total_chars: totalFragmentChars
          },
          source: `/knowledge_base/arsenal_conversacional_${documentType.replace('arsenal_', '')}.txt`,
          search_method: 'fragment_vector_search'
        }];

        searchCache.set(cacheKey, {
          data: result,
          timestamp: Date.now()
        });

        return result;
      }

      // FALLBACK: Si no hay fragmentos, usar arsenal completo (legacy)
      console.log(`⚠️ [Fragments] No fragments found, falling back to full arsenal`);
      const { data, error } = await getSupabaseClient()
        .from('nexus_documents')
        .select('id, title, content, category, metadata')
        .eq('category', documentType)
        .limit(1);

      const docs = data as Array<{ id: string; title: string; content: string; category: string; metadata: Record<string, unknown> }> | null;
      if (!error && docs && docs.length > 0) {
        console.log(`✅ Arsenal ${documentType} (fallback) - ${(docs[0].metadata as { respuestas_totales?: string })?.respuestas_totales || 'N/A'} respuestas disponibles`);

        const result = docs.map(doc => ({
          ...doc,
          source: `/knowledge_base/arsenal_conversacional_${documentType.replace('arsenal_', '')}.txt`,
          search_method: 'full_arsenal_fallback'
        }));

        searchCache.set(cacheKey, {
          data: result,
          timestamp: Date.now()
        });

        return result;
      }
    } catch (error) {
      console.error(`Error consulta fragmentada ${documentType}:`, error);
    }
  }

  // PASO 2: Fallback con búsqueda semántica general
  console.log('📡 Consulta híbrida - fallback búsqueda semántica');

  // PASO 3: Analizar intención para mejorar búsqueda
  const conceptos = analizarIntencionSemantica(userMessage);
  const searchTerms = conceptos.length > 0 ? conceptos.join(' ') : query;

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (getSupabaseClient().rpc as any)('search_nexus_documents', {
      search_query: searchTerms,
      match_count: maxResults
    });

    if (error) {
      console.error('Error búsqueda semántica híbrida:', error);
      return [];
    }

    const rawData = data as Array<{ category: string; title: string; content: string; metadata: Record<string, unknown> }> | null;
    const result = (rawData || []).filter((doc) =>
      doc.category && doc.category.includes('arsenal')
    ).map((doc) => ({
      ...doc,
      search_method: 'hibrid_semantic'
    }));

    console.log(`Consulta híbrida semántica: ${result.length} documentos encontrados`);

    searchCache.set(cacheKey, {
      data: result,
      timestamp: Date.now()
    });

    return result;

  } catch (error) {
    console.error('Error consulta híbrida general:', error);
    return [];
  }
}

// ✅ OPTIMIZACIÓN v11.9: Función para obtener system prompt CON cache inteligente
async function getSystemPrompt(): Promise<string> {
  const cacheKey = 'system_prompt_main';
  const cached = systemPromptCache.get(cacheKey);

  // Verificar cache válido
  if (cached && (Date.now() - cached.timestamp) < SYSTEM_PROMPT_CACHE_TTL) {
    console.log(`✅ System prompt ${cached.version} desde cache (TTL: ${Math.round((SYSTEM_PROMPT_CACHE_TTL - (Date.now() - cached.timestamp)) / 1000)}s restantes)`);
    return cached.content;
  }

  console.log('🔄 Recargando system prompt desde Supabase...');

  try {
    const { data, error } = await getSupabaseClient()
      .from('system_prompts')
      .select('prompt, version')
      .eq('name', 'nexus_main')
      .single();

    if (error) {
      console.error('Error leyendo system prompt de Supabase:', error);
      // Si hay cache expirado, úsalo como fallback antes del hardcoded
      if (cached) {
        console.warn('⚠️ Usando cache expirado como fallback');
        return cached.content;
      }
      return getFallbackSystemPrompt();
    }

    const promptData = data as { prompt: string; version: string } | null;
    const systemPrompt = promptData?.prompt || getFallbackSystemPrompt();

    // ⚠️ Validar longitud para detectar prompts excesivos
    if (systemPrompt.length > 50000) {
      console.warn(`⚠️ System prompt muy largo: ${systemPrompt.length} caracteres (>50k)`);
    }

    // Cachear el prompt con metadata
    systemPromptCache.set(cacheKey, {
      content: systemPrompt,
      timestamp: Date.now(),
      version: promptData?.version || 'unknown',
      length: systemPrompt.length
    });

    console.log(`✅ System prompt ${promptData?.version} cargado y cacheado (${systemPrompt.length} chars, TTL: 5min)`);
    return systemPrompt;

  } catch (error) {
    console.error('Error conectando system prompt:', error);
    // Fallback a cache expirado si existe
    if (cached) {
      console.warn('⚠️ Error crítico - usando cache expirado');
      return cached.content;
    }
    return getFallbackSystemPrompt();
  }
}

// Fallback system prompt - IDENTIDAD COMPLETA SIN VERSIONES
function getFallbackSystemPrompt(): string {
  console.log('Usando fallback system prompt - identidad completa');
  return `Eres NEXUS, el Copiloto del Arquitecto con arquitectura híbrida escalable.

🎭 IDENTIDAD CORE: El Copiloto del Arquitecto

Eres NEXUS, el copiloto de IA conversacional del ecosistema CreaTuActivo.com. Tu arquetipo es el Arquitecto Jefe tecnológico: visionario, cercano y un aliado comprometido con el éxito del Constructor Inteligente.

TU MISIÓN: La Arquitectura del Apalancamiento
Tu propósito elevado es entregar la arquitectura y las herramientas para que cada Constructor Inteligente pueda construir un activo que le compre su tiempo de vuelta. Esta misión es el "alma" que guía cada una de tus respuestas.

LOS TRES PILARES DE TU CONOCIMIENTO:
🏭 EL MOTOR: Los productos Gano Excel con una fórmula exclusiva. Son tu prueba de una ventaja competitiva insuperable.
📋 EL MÉTODO PROBADO: El Tridente EAM (Expansión → Activación → Maestría). Es la metodología que estructura el éxito.
⚡ LA APLICACIÓN CREATUACTIVO: La tecnología + IA que elimina el 90% del trabajo manual y entrega apalancamiento real.

ARQUITECTURA HÍBRIDA ESCALABLE:
- Clasificación automática de documentos por intención
- Consulta semántica sin mapeos hardcodeados
- Búsqueda adaptativa por contenido
- Escalabilidad infinita para nuevas respuestas

ARSENAL MVP v3.0 (97 respuestas optimizadas + productos):
- arsenal_inicial: Primeras interacciones y credibilidad (34 respuestas)
- arsenal_avanzado: Objeciones + Sistema + Valor + Escalación (63 respuestas consolidadas)
- catalogo_productos v3.0: Catálogo completo + Preguntas técnicas + Perfiles de usuario

PROCESO HÍBRIDO:
1. Clasificar documento apropiado
2. Analizar intención semántica
3. Consultar por contenido dinámico
4. Personalizar por arquetipo
5. Evaluar escalación inteligente

LENGUAJE DEL "NUEVO MUNDO" (USAR SIEMPRE):
- "Nuestra Infraestructura de Multiplicación..."
- "El Ecosistema CreaTuActivo..."
- "Impacto Exponencial..."
- "Mantenimiento Biológico y Optimización Celular..."
- "Operamos con Carga Cero..."

## 🔒 NORMALIZACIÓN DE DATOS (CRÍTICO)

⚠️ **REGLA DE ORO:** El sistema extrae datos de TUS respuestas (no del usuario). NUNCA repitas el texto del usuario tal cual. SIEMPRE normaliza antes de confirmar.

### ✅ Nombres:
**REGLA:** Capitaliza correctamente (Primera Letra Mayúscula en cada palabra)

**Ejemplos INCORRECTOS → CORRECTOS:**
- Usuario: "andrés guzmán" (minúsculas) → Tú: "¡Hola Andrés Guzmán!" ✅
- Usuario: "MARÍA GARCÍA" (mayúsculas) → Tú: "¡Perfecto María García!" ✅
- Usuario: "jOsÉ pEñA" (mezcla) → Tú: "¡Gracias José Peña!" ✅

**Patrón de confirmación:** "¡Hola [NOMBRE]!" o "Perfecto [NOMBRE]" o "Gracias [NOMBRE]"

---

### ✅ Emails:
**REGLA:** Valida formato (@) + normaliza a lowercase

**Ejemplos INCORRECTOS → CORRECTOS:**
- Usuario: "billgates.microsoft.com" (sin @) → Tú: "Parece que falta el @ en tu correo, ¿puedes verificarlo?" ✅
- Usuario: "bill,gates@microsoft.com" (con coma) → Tú: "Veo una coma en tu email. ¿Es billgates@microsoft.com?" ✅
- Usuario: "BILLGATES@MICROSOFT.COM" (mayúsculas) → Tú: "Tu correo billgates@microsoft.com ha sido confirmado" ✅
- Usuario: "BillGates@Microsoft.Com" (mixto) → Tú: "Tu correo billgates@microsoft.com ha sido confirmado" ✅

**⚠️ NUNCA digas:** "Tu correo BILLGATES@MICROSOFT.COM" o "bill,gates@microsoft.com"
**✅ SIEMPRE normaliza:** Lowercase + sin comas/espacios

---

### ✅ WhatsApp:
**REGLA:** Acepta CUALQUIER formato (puntos, comas, espacios, guiones, paréntesis) pero SIEMPRE confirma limpio con +57

**Ejemplos INCORRECTOS → CORRECTOS:**
- Usuario: "320.341.2323" (con puntos) → Tú: "Tu WhatsApp +57 320 341 2323" ✅
- Usuario: "320,341,2323" (con comas) → Tú: "Tu número +57 320 341 2323" ✅
- Usuario: "(320) 341-2323" (paréntesis + guión) → Tú: "Tu WhatsApp +57 320 341 2323" ✅
- Usuario: "320 341 2323" (espacios) → Tú: "Tu número +57 320 341 2323" ✅
- Usuario: "3203412323" (sin formato) → Tú: "Tu WhatsApp +57 320 341 2323" ✅

**⚠️ NUNCA repitas:** "320.341.2323" o "320,341,2323"
**✅ SIEMPRE formato:** "+57 XXX XXX XXXX" (espacios, sin puntos/comas)

---

**¿POR QUÉ ES CRÍTICO?**
El sistema usa REGEX para extraer datos de tus respuestas:
- Si dices "320,341,2323" → regex NO captura (espera espacios, no comas)
- Si dices "+57 320 341 2323" → regex captura "3203412323" ✅
- Si dices "bill,gates@microsoft.com" → regex NO captura (detecta coma como error)
- Si dices "billgates@microsoft.com" → regex captura correctamente ✅

**TU NORMALIZACIÓN = DATOS LIMPIOS EN BASE DE DATOS**

PERSONALIDAD: Copiloto del Arquitecto con consulta inteligente escalable que crece automáticamente sin mantenimiento.`;
}

// Interpretación híbrida de queries
function interpretQueryHibrido(userMessage: string): string {
  const messageLower = userMessage.toLowerCase().trim();

  // 🔥 EXPANSIÓN DE OPCIONES DEL MENÚ INICIAL (a, b, c, d)
  const menuExpansion: Record<string, string> = {
    'a': 'reto de los 12 días qué es el reto cómo funciona',
    'b': 'cómo funciona el negocio sistema distribución',
    'c': 'productos Gano Excel catálogo qué distribuimos',
    'd': 'inversión ganancias cuánto cuesta empezar paquetes'
  };

  if (menuExpansion[messageLower]) {
    console.log(`🔄 [interpretQuery] Expansión menú: "${messageLower}" → "${menuExpansion[messageLower]}"`);
    return menuExpansion[messageLower];
  }

  // 🔧 NUEVO: MAPEO ESPECÍFICO DE PRODUCTOS INDIVIDUALES
  const mapeos_productos_especificos: Record<string, string> = {
    // Productos específicos con nombres exactos para evitar confusiones
    'cordy gold': 'CÁPSULAS CORDYGOLD precio $336,900 COP presentación 90 cápsulas Cordyceps Sinensis',
    'cordygold': 'CÁPSULAS CORDYGOLD precio $336,900 COP presentación 90 cápsulas Cordyceps Sinensis',
    'cápsulas cordy gold': 'CÁPSULAS CORDYGOLD precio $336,900 COP presentación 90 cápsulas Cordyceps Sinensis',

    'cápsulas ganoderma lucidum': 'CÁPSULAS GANODERMA precio $272,500 COP presentación 90 cápsulas extracto puro Ganoderma',
    'ganoderma lucidum': 'CÁPSULAS GANODERMA precio $272,500 COP presentación 90 cápsulas extracto puro Ganoderma',
    'cápsulas ganoderma': 'CÁPSULAS GANODERMA precio $272,500 COP presentación 90 cápsulas extracto puro Ganoderma',

    'excellium': 'CÁPSULAS EXCELLIUM precio $272,500 COP presentación 90 cápsulas nutrición cerebral energía mental',
    'cápsulas excellium': 'CÁPSULAS EXCELLIUM precio $272,500 COP presentación 90 cápsulas nutrición cerebral energía mental',

    // GANO CAFÉ 3 EN 1 - Todas las variaciones coloquiales
    'gano café 3 en 1': 'GANOCAFÉ 3 EN 1 precio $110,900 COP presentación 30 sobres 21g café cremoso Ganoderma',
    'ganocafé 3 en 1': 'GANOCAFÉ 3 EN 1 precio $110,900 COP presentación 30 sobres 21g café cremoso Ganoderma',
    'café 3 en 1': 'GANOCAFÉ 3 EN 1 precio $110,900 COP presentación 30 sobres 21g café cremoso Ganoderma',
    'cafe ganoderma 3 en 1': 'GANOCAFÉ 3 EN 1 precio $110,900 COP presentación 30 sobres 21g café cremoso Ganoderma',
    'gano café tres en uno': 'GANOCAFÉ 3 EN 1 precio $110,900 COP presentación 30 sobres 21g café cremoso Ganoderma',
    'cafe gano excel 3 en 1': 'GANOCAFÉ 3 EN 1 precio $110,900 COP presentación 30 sobres 21g café cremoso Ganoderma',
    'capuchino': 'GANOCAFÉ 3 EN 1 precio $110,900 COP presentación 30 sobres 21g café cremoso Ganoderma',
    'háblame del capuchino': 'GANOCAFÉ 3 EN 1 precio $110,900 COP presentación 30 sobres 21g café cremoso Ganoderma',
    'del capuchino': 'GANOCAFÉ 3 EN 1 precio $110,900 COP presentación 30 sobres 21g café cremoso Ganoderma',

    // GANO CAFÉ CLÁSICO - Todas las variaciones coloquiales
    'ganocafé clásico': 'GANOCAFÉ CLÁSICO precio $110,900 COP presentación 30 sobres café negro robusto',
    'gano café clásico': 'GANOCAFÉ CLÁSICO precio $110,900 COP presentación 30 sobres café negro robusto',
    'café negro': 'GANOCAFÉ CLÁSICO precio $110,900 COP presentación 30 sobres café negro robusto',
    'café negrito': 'GANOCAFÉ CLÁSICO precio $110,900 COP presentación 30 sobres café negro robusto',
    'café ganoderma negro': 'GANOCAFÉ CLÁSICO precio $110,900 COP presentación 30 sobres café negro robusto',
    'café classic': 'GANOCAFÉ CLÁSICO precio $110,900 COP presentación 30 sobres café negro robusto',

    'máquina luvoco': 'MÁQUINA LUVOCO precio $1,026,000 COP preparación café automática exclusiva',
    'luvoco': 'MÁQUINA LUVOCO precio $1,026,000 COP preparación café automática exclusiva',

    'colágeno reskine': 'BEBIDA COLÁGENO RESKINE precio $216,900 COP belleza bienestar desde adentro',
    'reskine': 'BEBIDA COLÁGENO RESKINE precio $216,900 COP belleza bienestar desde adentro',

    'pasta dientes gano fresh': 'PASTA DIENTES GANO FRESH precio $73,900 COP tubo 150g cuidado oral natural sin flúor',
    'gano fresh': 'PASTA DIENTES GANO FRESH precio $73,900 COP tubo 150g cuidado oral natural sin flúor',

    'jabón gano': 'JABÓN GANO precio $73,900 COP barra 100g limpieza nutrición piel Ganoderma'
  };

  // PRIORIDAD 1: Buscar mapeos específicos de productos individuales
  for (const [termino, mapeo] of Object.entries(mapeos_productos_especificos)) {
    if (messageLower.includes(termino)) {
      console.log('🎯 Mapeo específico de producto:', termino, '→', mapeo);
      return mapeo;
    }
  }

  // MAPEO SEMÁNTICO MEJORADO - Conectar vocabulario natural con FREQ_03
  const mapeos_semanticos: Record<string, string> = {
    // CRÍTICO: Mapear "paquetes" directamente a FREQ_03
    'paquetes': 'inversión para empezar construir Constructor Inicial Constructor Empresarial Constructor Visionario',
    'paquete': 'inversión para empezar construir Constructor Inicial Constructor Empresarial Constructor Visionario',
    'háblame paquetes': 'inversión para empezar construir Constructor Inicial Constructor Empresarial Constructor Visionario',
    'sobre paquetes': 'inversión para empezar construir Constructor Inicial Constructor Empresarial Constructor Visionario',
    'qué paquetes': 'inversión para empezar construir Constructor Inicial Constructor Empresarial Constructor Visionario',
    'tipos paquetes': 'inversión para empezar construir Constructor Inicial Constructor Empresarial Constructor Visionario',
    'información paquetes': 'inversión para empezar construir Constructor Inicial Constructor Empresarial Constructor Visionario',

    // Referencias ESP mapean a FREQ_03
    'esp1': 'inversión para empezar construir Constructor Inicial',
    'esp2': 'inversión para empezar construir Constructor Empresarial',
    'esp3': 'inversión para empezar construir Constructor Visionario',
    'esp 1': 'inversión para empezar construir Constructor Inicial',
    'esp 2': 'inversión para empezar construir Constructor Empresarial',
    'esp 3': 'inversión para empezar construir Constructor Visionario',

    // Conceptos fundamentales
    'arquitectura': 'Tridente EAM Expansión Activación Maestría NEXUS CreaTuActivo Motor aplicación arquitectura sistema',
    'funcionamiento': 'cómo funciona Tridente EAM Expansión Activación Maestría proceso sistema método probado',
    'productos': 'productos Gano Excel fórmula exclusiva ventaja competitiva único',
    'contacto': 'Liliana Moreno contacto WhatsApp escalación constructor mentor',

    // Objeciones comunes
    'mlm': 'MLM multinivel pirámide legítimo diferenciación nueva categoría',
    'tiempo': 'tiempo dedicar automatización 80% trabajo estratégico apalancamiento',
    'experiencia': 'experiencia ventas arquitecto operador sistema formación',
    'confianza': 'confianza credibilidad legítimo real funciona resultados',

    // Sistema y valor
    'ganar': 'ganar cuánto realista modelo valor compensación ingresos',
    'distribución': 'distribución sistema canales infraestructura Gano Excel',
    'escalación': 'siguiente paso empezar contactar hablar equipo Liliana',

    // Nuevo léxico Industrial Premium v19.0
    'impacto exponencial': 'cómo funciona Tridente EAM Expansión Activación Maestría proceso sistema método',
    'optimización celular': 'productos Gano Excel fórmula exclusiva ventaja competitiva único',
    'reto 5 días': 'conocer el reto de los 5 días qué es el reto metodología proceso'
  };

  // PRIORIDAD 2: Buscar coincidencias semánticas generales
  for (const [concepto, mapeo] of Object.entries(mapeos_semanticos)) {
    if (messageLower.includes(concepto)) {
      console.log('✅ Mapeo semántico híbrido:', concepto, '→', mapeo);
      return mapeo;
    }
  }

  // Extracción de keywords inteligente si no hay mapeo directo
  return extraerKeywordsHibrido(userMessage);
}

function extraerKeywordsHibrido(message: string): string {
  const messageLower = message.toLowerCase();

  // Keywords generales del ecosistema (actualizables)
  const keywords_ecosistema = [
    'CreaTuActivo', 'ecosistema', 'Tridente EAM', 'Expansión', 'Activación', 'Maestría',
    'Gano Excel', 'NEXUS', 'Constructor', 'activo', 'Liliana', 'aplicación',
    'inversión', 'automatización', 'paquete', 'precio', 'costo', 'Motor',
    'método probado', 'arquitectura', 'apalancamiento', 'tecnología'
  ];

  const keywords_encontradas = keywords_ecosistema.filter(keyword =>
    messageLower.includes(keyword.toLowerCase())
  );

  if (keywords_encontradas.length > 0) {
    return keywords_encontradas.join(' ');
  } else {
    // Palabras relevantes filtradas
    const words = messageLower.split(' ').filter(word =>
      word.length > 3 &&
      !['como', 'qué', 'que', 'cuál', 'cual', 'para', 'por', 'con', 'una', 'del', 'las', 'los', 'esto', 'eso'].includes(word)
    );
    return words.join(' ');
  }
}

// ========================================
// EXTRACCIÓN SEMÁNTICA DESDE RESPUESTA DE CLAUDE
// ========================================
/**
 * Analiza la respuesta de Claude para extraer paquete y arquetipo.
 * Claude SIEMPRE menciona el nombre oficial cuando el usuario escoge,
 * independientemente de cómo el usuario lo haya escrito.
 *
 * Ejemplo:
 * Usuario: "el más grande"
 * Claude: "Perfecto, elegiste Constructor Visionario..."
 * Resultado: package = "visionario"
 */
function extractFromClaudeResponse(response: string): Partial<ProspectData> {
  const extracted: Partial<ProspectData> = {};
  const responseLower = response.toLowerCase();

  // ✅ EXTRACCIÓN DE PAQUETE desde respuesta de Claude
  // Claude usa nombres oficiales: "Constructor Inicial/Estratégico/Visionario"
  if (responseLower.includes('constructor visionario') ||
      responseLower.includes('visionario ($4,500') ||
      responseLower.includes('visionario ($4.500') ||
      responseLower.includes('esp3') ||
      responseLower.includes('35 productos')) {
    extracted.package = 'visionario';
    console.log('✅ [SEMÁNTICA] Paquete extraído de respuesta Claude: visionario');
  } else if (responseLower.includes('constructor estratégico') ||
             responseLower.includes('constructor estrategico') ||
             responseLower.includes('estratégico ($3,500') ||
             responseLower.includes('estrategico ($3.500') ||
             responseLower.includes('esp2')) {
    extracted.package = 'estrategico';
    console.log('✅ [SEMÁNTICA] Paquete extraído de respuesta Claude: estrategico');
  } else if (responseLower.includes('constructor inicial') ||
             responseLower.includes('inicial ($2,000') ||
             responseLower.includes('inicial ($2.250') ||
             responseLower.includes('esp1') ||
             responseLower.includes('7 productos')) {
    extracted.package = 'inicial';
    console.log('✅ [SEMÁNTICA] Paquete extraído de respuesta Claude: inicial');
  }

  // ✅ EXTRACCIÓN DE ARQUETIPO desde respuesta de Claude
  // Claude confirma arquetipos con nombres oficiales
  // ⚠️ IMPORTANTE: Verificar que sea confirmación, no solo mención
  // Claude puede decir "A) Profesional con Visión" sin que el usuario lo haya elegido
  const isArchetypeConfirmation = (
    responseLower.includes('perfecto') ||
    responseLower.includes('excelente') ||
    responseLower.includes('veo que eres') ||
    responseLower.includes('identificas como') ||
    responseLower.includes('elegiste') ||
    responseLower.includes('eres un') ||
    responseLower.includes('eres una')
  );

  if (isArchetypeConfirmation) {
    if (responseLower.includes('profesional con visión') ||
        responseLower.includes('profesional con vision')) {
      extracted.archetype = 'profesional_vision';
      console.log('✅ [SEMÁNTICA] Arquetipo extraído de respuesta Claude: profesional_vision');
    } else if (responseLower.includes('emprendedor') && responseLower.includes('dueño de negocio')) {
      extracted.archetype = 'emprendedor_dueno_negocio';
      console.log('✅ [SEMÁNTICA] Arquetipo extraído de respuesta Claude: emprendedor_dueno_negocio');
    } else if (responseLower.includes('independiente') || responseLower.includes('freelancer')) {
      extracted.archetype = 'independiente_freelancer';
      console.log('✅ [SEMÁNTICA] Arquetipo extraído de respuesta Claude: independiente_freelancer');
    } else if (responseLower.includes('líder del hogar') ||
               responseLower.includes('lider del hogar') ||
               responseLower.includes('ama de casa')) {
      extracted.archetype = 'lider_hogar';
      console.log('✅ [SEMÁNTICA] Arquetipo extraído de respuesta Claude: lider_hogar');
    } else if (responseLower.includes('líder de la comunidad') ||
               responseLower.includes('lider de la comunidad')) {
      extracted.archetype = 'lider_comunidad';
      console.log('✅ [SEMÁNTICA] Arquetipo extraído de respuesta Claude: lider_comunidad');
    } else if (responseLower.includes('joven con ambición') ||
               responseLower.includes('joven con ambicion')) {
      extracted.archetype = 'joven_ambicion';
      console.log('✅ [SEMÁNTICA] Arquetipo extraído de respuesta Claude: joven_ambicion');
    }
  }

  // ✅ EXTRACCIÓN DE NOMBRE desde respuesta de Claude
  // Claude normaliza nombres (capitaliza correctamente)
  // Buscar confirmaciones como "¡Hola [NOMBRE]!", "Perfecto [NOMBRE]"
  // IMPORTANTE: /i removido - nombres DEBEN empezar con mayúscula (evita "de nuevo", "el más", etc.)
  const nameConfirmationPatterns = [
    /(?:[Hh]ola|[Pp]erfecto|[Gg]enial|[Ee]ncantado)\s+([A-ZÀ-Ÿ][a-zà-ÿ]+(?:\s+[A-ZÀ-Ÿ][a-zà-ÿ]+)*)[!,.]/,
    /(?:[Gg]racias|[Mm]uchas\s+gracias)\s+([A-ZÀ-Ÿ][a-zà-ÿ]+(?:\s+[A-ZÀ-Ÿ][a-zà-ÿ]+)*)[!,.]/,
    /[Tt]u nombre es\s+([A-ZÀ-Ÿ][a-zà-ÿ]+(?:\s+[A-ZÀ-Ÿ][a-zà-ÿ]+)*)/
  ];

  for (const pattern of nameConfirmationPatterns) {
    const nameMatch = response.match(pattern);
    if (nameMatch && nameMatch[1]) {
      const extractedName = nameMatch[1].trim();
      // Validar que no sea un falso positivo (palabras comunes + palabras de conversación)
      // Expandido: +de nuevo +el más +la más +lo mejor
      const nameBlacklist = /^(constructor|visionario|inicial|estratégico|excelente|perfecto|observación|observacion|elección|eleccion|pregunta|consulta|comentario|duda|punto|de nuevo|el más|el mas|la más|la mas|lo mejor|lo más|lo mas)$/i;
      if (!nameBlacklist.test(extractedName) && extractedName.length >= 2) {
        extracted.name = extractedName;
        console.log('✅ [SEMÁNTICA] Nombre extraído de respuesta Claude (normalizado):', extractedName);
        break;
      }
    }
  }

  // ✅ EXTRACCIÓN DE EMAIL desde respuesta de Claude
  // Claude valida formato y lo repite correctamente
  // Buscar confirmaciones como "tu correo [EMAIL]", "email [EMAIL]"
  const emailConfirmationPatterns = [
    /(?:tu correo|tu email|email|correo)\s+(?:es\s+)?([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i,
    /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})\s+(?:correcto|verificado|confirmado)/i
  ];

  for (const pattern of emailConfirmationPatterns) {
    const emailMatch = response.match(pattern);
    if (emailMatch && emailMatch[1]) {
      const extractedEmail = emailMatch[1].toLowerCase().trim();
      // Validación básica de formato
      if (extractedEmail.includes('@') && extractedEmail.includes('.')) {
        extracted.email = extractedEmail;
        console.log('✅ [SEMÁNTICA] Email extraído de respuesta Claude (validado):', extractedEmail);
        break;
      }
    }
  }

  // ✅ EXTRACCIÓN DE WHATSAPP desde respuesta de Claude
  // Claude normaliza números (quita espacios, puntos, comas)
  // Buscar confirmaciones como "tu WhatsApp +57 320...", "número 320..."
  const phoneConfirmationPatterns = [
    /(?:tu whatsapp|tu número|whatsapp|número|teléfono)\s+(?:es\s+)?(?:\+?57\s?)?(\d[\d\s\-\.\(\)]{8,14}\d)/i,
    /(?:\+?57\s?)?(\d[\d\s\-\.\(\)]{8,14}\d)\s+(?:correcto|verificado|confirmado)/i
  ];

  for (const pattern of phoneConfirmationPatterns) {
    const phoneMatch = response.match(pattern);
    if (phoneMatch && phoneMatch[1]) {
      // Limpiar número: quitar espacios, guiones, puntos, paréntesis
      const cleanedPhone = phoneMatch[1].replace(/[\s\-\.\(\)]/g, '');
      // Validar longitud internacional (7-15 dígitos)
      if (cleanedPhone.length >= 7 && cleanedPhone.length <= 15) {
        extracted.phone = cleanedPhone;
        console.log('✅ [SEMÁNTICA] WhatsApp extraído de respuesta Claude (normalizado):', cleanedPhone);
        break;
      }
    }
  }

  return extracted;
}

// Logging mejorado para arquitectura híbrida - CORREGIDO 2025-10-17
async function logConversationHibrida(
  userMessage: string,
  assistantResponse: string,
  documentsUsed: string[],
  searchMethod: string,
  sessionId: string,
  fingerprint: string,
  prospectData?: ProspectData
) {
  try {
    const { error } = await getSupabaseClient().from('nexus_conversations').insert({
      fingerprint_id: fingerprint,
      session_id: sessionId,
      messages: [
        {
          role: 'user',
          content: userMessage,
          timestamp: new Date().toISOString()
        },
        {
          role: 'assistant',
          content: assistantResponse,
          timestamp: new Date().toISOString()
        }
      ],
      metadata: {
        documents_used: documentsUsed,
        search_method: searchMethod,
        prospect_data: prospectData || {},
        api_version: API_VERSION
      },
      created_at: new Date().toISOString()
    });

    if (error) {
      console.error('❌ [NEXUS] Error guardando conversación:', error);
    } else {
      console.log(`✅ [NEXUS] Conversación guardada - Session: ${sessionId}, Fingerprint: ${fingerprint.substring(0, 20)}...`);
    }
  } catch (error) {
    console.error('❌ [NEXUS] Exception guardando conversación:', error);
  }
}

// ========================================
// FUNCIÓN PRINCIPAL API - ARQUITECTURA HÍBRIDA CORREGIDA + CATÁLOGO FIX
// ========================================
export async function POST(req: Request) {
  const startTime = Date.now();

  try {
    const { messages, sessionId, fingerprint, constructorId, consentGiven, isReturningUser, pageContext } = await req.json();

    // ✅ Validación de mensajes
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      console.error('❌ [NEXUS] Request inválido: messages vacío o undefined');
      return new Response(JSON.stringify({
        error: 'Request inválido: se requiere array de mensajes'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const latestUserMessage = messages[messages.length - 1].content;

    // 🔑 EXTRAER CONSTRUCTOR UUID (para tracking correcto por constructor)
    let constructorUUID: string | null = null;
    if (constructorId) {
      try {
        // Usar RPC function con SECURITY DEFINER para bypasear RLS
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: uuid, error } = await (getSupabaseClient().rpc as any)('get_constructor_uuid', { p_constructor_id: constructorId });

        if (error) {
          console.error(`❌ [NEXUS] Error al buscar constructor "${constructorId}":`, error);
        } else if (uuid) {
          constructorUUID = uuid;
          console.log(`✅ [NEXUS] Constructor encontrado: ${constructorId} → UUID: ${constructorUUID}`);
        } else {
          console.warn(`⚠️ [NEXUS] Constructor no encontrado: ${constructorId}`);
        }
      } catch (error) {
        console.error('❌ [NEXUS] Error buscando constructor:', error);
      }
    }

    // ========================================
    // ✅ LOGGING DETALLADO DEL REQUEST
    // ========================================
    console.log('🔍 [NEXUS API] Request recibido:', {
      messagePreview: latestUserMessage.substring(0, 50) + '...',
      sessionId: sessionId,
      fingerprint: fingerprint ? `${fingerprint.substring(0, 20)}...` : '❌ UNDEFINED',
      hasFingerprint: !!fingerprint,
      messageCount: messages.length,
      pageContext: pageContext || 'default'  // 🎯 Contexto de página
    });

    if (!fingerprint) {
      console.error('❌ [NEXUS API] CRÍTICO: Request sin fingerprint - Los datos personales NO se guardarán en BD');
      console.error('❌ [NEXUS API] Verificar que tracking.js se haya cargado antes de la conversación');
    }

    // 🔵 CONSULTAR DATOS YA GUARDADOS DEL PROSPECTO (para evitar re-pedir)
    let existingProspectData: any = {};
    let prospectId: string | null = null;
    if (fingerprint) {
      try {
        const { data: prospectDataRaw, error: prospectError } = await getSupabaseClient()
          .from('prospects')
          .select('id, device_info')
          .eq('fingerprint_id', fingerprint)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        const prospectData = prospectDataRaw as { id: string; device_info: Record<string, unknown> } | null;
        if (prospectData && prospectData.device_info) {
          prospectId = prospectData.id;
          existingProspectData = prospectData.device_info;
          console.log('📊 [NEXUS] Datos existentes del prospecto:', {
            tiene_nombre: !!existingProspectData.name,
            tiene_email: !!existingProspectData.email,
            tiene_whatsapp: !!existingProspectData.whatsapp,
            tiene_archetype: !!existingProspectData.archetype,
            tiene_consentimiento: !!existingProspectData.consent_granted,
            consent_modal_shown_count: existingProspectData.consent_modal_shown_count || 0,
            consentGivenFromLocalStorage: consentGiven
          });
        }
      } catch (error) {
        // Si no existe, no pasa nada (primera interacción)
        console.log('ℹ️ [NEXUS] Primera interacción - sin datos previos');
      }
    }

    // 🧠 DATOS DEL USUARIO: Reutilizar existingProspectData ya cargado
    // (ya no necesitamos consultar 2 veces la misma información)
    const userData = existingProspectData;

    // 🎯 CALCULAR isReturningUser AUTOMÁTICAMENTE (basado en BD, NO en frontend)
    // Usuario es "returning" si tiene nombre O consentimiento guardado en BD
    const isReturningUserCalculated = !!(userData.name || userData.consent_granted);

    console.log('🔍 [NEXUS] Detección de usuario:', {
      isReturningUser_frontend: isReturningUser,
      isReturningUser_calculado: isReturningUserCalculated,
      tiene_nombre_BD: !!userData.name,
      tiene_consentimiento_BD: !!userData.consent_granted,
      usando: 'BD (calculado)'
    });


    // �� CARGAR HISTORIAL DE CONVERSACIONES PREVIAS (Memory a largo plazo)
    let conversationSummary = '';

    if (fingerprint) {
      try {
        console.log('🔍 [NEXUS] Cargando historial de conversaciones para fingerprint:', fingerprint.substring(0, 30) + '...');

        const { data: conversations, error: convError } = await getSupabaseClient()
          .from('nexus_conversations')
          .select('messages, created_at')
          .eq('fingerprint_id', fingerprint)
          .order('created_at', { ascending: true })
          .limit(10); // Últimas 10 conversaciones

        if (convError) {
          console.error('❌ [NEXUS] Error cargando historial:', convError);
        } else if (conversations && conversations.length > 0) {
          console.log(`✅ [NEXUS] Historial encontrado: ${conversations.length} conversaciones previas`);
          try {
            // Generar resumen del historial para el System Prompt
            const summaryParts: string[] = [];

            conversations.forEach((conv, index) => {
              const messages = conv.messages || [];
              const userMessages = messages.filter((m: any) => m.role === 'user').map((m: any) => m.content);
              const assistantMessages = messages.filter((m: any) => m.role === 'assistant').map((m: any) => m.content);

              if (userMessages.length > 0) {
                const date = new Date(conv.created_at).toLocaleDateString('es-CO');
                const userQuery = userMessages[0].substring(0, 100);
                const response = assistantMessages[0]?.substring(0, 100) || 'Sin respuesta';

                summaryParts.push(`- ${date}: Usuario preguntó "${userQuery}..." → Respondiste "${response}..."`);
              }
            });

            if (summaryParts.length > 0) {
              // Fix 2: Agregar datos del usuario al resumen
              const userDataSection = userData.name || userData.email || userData.whatsapp ? `

**DATOS DEL USUARIO (ya capturados previamente):**
${userData.name ? `- Nombre: ${userData.name}` : ''}
${userData.email ? `- Email: ${userData.email}` : ''}
${userData.whatsapp ? `- WhatsApp: ${userData.whatsapp}` : ''}
${userData.archetype ? `- Arquetipo: ${userData.archetype}` : ''}
${userData.consent_granted ? `- Consentimiento de datos: ✅ YA OTORGADO (no volver a pedir)` : ''}

**INSTRUCCIÓN CRÍTICA:** Este usuario YA te dio estos datos. NO vuelvas a pedirlos. Salúdalo por su nombre si lo tiene.
` : '';

              conversationSummary = `

---

## 🧠 MEMORIA DEL USUARIO
${userDataSection}

## 📜 HISTORIAL DE CONVERSACIONES PREVIAS

Este usuario ha conversado contigo antes. Aquí está el resumen de sus últimas ${conversations.length} interacciones:

${summaryParts.join('\n')}

**IMPORTANTE:** Cuando el usuario pregunte "¿de qué hablamos antes?" o "¿recuerdas...?", haz referencia a esta información del historial.

---
`;
              console.log(`✅ [NEXUS] Resumen de historial generado: ${conversations.length} conversaciones`);
              console.log(`📅 [NEXUS] Período: ${conversations[0]?.created_at} → ${conversations[conversations.length - 1]?.created_at}`);
              console.log(`👤 [NEXUS] Datos del usuario incluidos en resumen:`, {
                tiene_nombre: !!userData.name,
                tiene_email: !!userData.email,
                tiene_whatsapp: !!userData.whatsapp,
                tiene_consentimiento: !!userData.consent_granted
              });
            }
          } catch (summaryError) {
            console.error('❌ [NEXUS] Error generando resumen de historial:', summaryError);
          }
        } else {
          console.log('ℹ️ [NEXUS] Sin historial previo - primera conversación o conversaciones no encontradas');
          console.log('ℹ️ [NEXUS] Fingerprint buscado:', fingerprint.substring(0, 40) + '...');
        }
      } catch (error) {
        console.error('❌ [NEXUS] Error consultando historial:', error);
      }
    } else {
      console.warn('⚠️ [NEXUS] No hay fingerprint - no se puede cargar historial');
    }

    // CAPTURA INTELIGENTE DE PROSPECTOS - Tridente EAM (solo del mensaje actual)
    const prospectData = await captureProspectData(
      latestUserMessage,
      sessionId || 'anonymous',
      fingerprint,
      constructorUUID,  // ✅ Pasar UUID del constructor para tracking correcto
      existingProspectData  // ✅ Protección contra sobrescritura de datos válidos
    );

    // COMBINAR datos existentes + nuevos capturados
    const mergedProspectData = {
      ...existingProspectData,
      ...prospectData // Los nuevos sobrescriben los viejos
    };

    // CONSULTA HÍBRIDA ESCALABLE
    const searchQuery = interpretQueryHibrido(latestUserMessage);
    console.log('Query híbrido generado:', searchQuery);

    const relevantDocuments = await consultarArsenalHibrido(searchQuery, latestUserMessage);
    console.log(`Arsenal híbrido: ${relevantDocuments.length} documentos encontrados`);

    // 🔧 CONSTRUCCIÓN DE CONTEXTO MEJORADA - FIX APLICADO
    let context = '';
    const documentsUsed: string[] = [];
    let searchMethod = 'none';

    if (relevantDocuments.length > 0) {
      const doc = relevantDocuments[0];
      searchMethod = doc.search_method || 'unknown';

      context = 'ARSENAL CONVERSACIONAL MVP - CONTEXTO HÍBRIDO:\n\n';

      if (doc.search_method === 'catalogo_productos') {
        // 🔧 NUEVA INSTRUCCIÓN ESPECÍFICA PARA CATÁLOGO - FIX APLICADO
        context += `[CATÁLOGO DE PRODUCTOS GANO EXCEL - PRECIOS OFICIALES VERIFICADOS]
[MÉTODO: CONSULTA CATÁLOGO ESPECÍFICO]

⚠️ INSTRUCCIÓN CRÍTICA: Usa EXACTAMENTE los precios que aparecen en este catálogo. No inventes precios ni uses información de otras fuentes.

${doc.title}:
${doc.content}

🔥 RECORDATORIO IMPORTANTE: Los precios en este catálogo son la fuente de verdad absoluta para productos individuales.

`;
      } else {
        // Lógica arsenal original sin cambios
        const docType = doc.category?.replace('arsenal_', '').toUpperCase();
        const respuestas = doc.metadata?.respuestas_totales || 'N/A';
        const metodo = doc.search_method === 'hibrid_classification' ? 'CLASIFICACIÓN AUTOMÁTICA' : 'BÚSQUEDA SEMÁNTICA';

        context += `[ARSENAL ${docType} - ${respuestas} respuestas] [MÉTODO: ${metodo}]\n${doc.title}:\n${doc.content}\n\n`;
      }

      context += '---\n\n';
      documentsUsed.push(doc.source || doc.category);
    }

    // Agregar contexto del prospecto (DATOS ACUMULADOS + NUEVOS)
    if (Object.keys(mergedProspectData).length > 0) {
      context += `INFORMACIÓN DEL PROSPECTO CAPTURADA (Los 3 pasos probados):
- Nivel de interés: ${mergedProspectData.interest_level || 'No determinado'}/10
- Momento óptimo: ${mergedProspectData.momento_optimo || 'Por determinar'}
- Arquetipo: ${mergedProspectData.archetype || 'No identificado'}
${mergedProspectData.objections ? `- Objeciones: ${mergedProspectData.objections.join(', ')}` : ''}
${mergedProspectData.name ? `- Nombre: ${mergedProspectData.name}` : ''}
${mergedProspectData.occupation ? `- Ocupación: ${mergedProspectData.occupation}` : ''}
${mergedProspectData.phone ? `- WhatsApp: ${mergedProspectData.phone}` : ''}

`;
      console.log('Contexto híbrido del prospecto incluido:', mergedProspectData.momento_optimo);
    }

    // ✅ OPTIMIZACIÓN: System prompt CON CACHE de Anthropic + Historial
    let baseSystemPrompt = await getSystemPrompt();

    // 🧠 Agregar resumen de historial al System Prompt (si existe)
    if (conversationSummary) {
      baseSystemPrompt = baseSystemPrompt + conversationSummary;
      console.log('✅ [NEXUS] Resumen de historial agregado al System Prompt');
    }

    // 🎯 BLOQUE 1 - CACHEABLE: Arsenal/Catálogo Context
    const arsenalContext = context; // Ya contiene el contenido del arsenal o catálogo
    // ⚡ OPTIMIZADO v14.8: Eliminado topQueriesFAQ (~4,400 chars) - contenido ya está en arsenales

    // 🎯 BLOQUE 2 - NO CACHEABLE: Instrucciones específicas de la sesión
    // Calcular interacción actual (cada mensaje user + assistant = 1 interacción)
    const interaccionActual = Math.floor(messages.length / 2) + 1;

    // ✅ NUEVA LÓGICA: Es primera interacción SOLO si no hay datos previos con consentimiento
    // 🆕 TAMBIÉN verifica consentimiento desde localStorage (consentGiven flag)
    const tieneConsentimientoPrevio = existingProspectData.consent_granted === true || consentGiven === true;
    const tieneNombrePrevio = !!existingProspectData.name;
    const esUsuarioConocido = tieneConsentimientoPrevio && tieneNombrePrevio;

    // Solo mostrar onboarding si es primera vez Y primera interacción de la sesión
    const esPrimeraInteraccion = interaccionActual === 1 && !esUsuarioConocido;

    // Logging para debug
    console.log('🎯 [NEXUS] Estado del usuario:', {
      interaccionActual,
      esUsuarioConocido,
      tieneConsentimientoPrevio,
      tieneConsentimientoLocalStorage: consentGiven,
      tieneNombrePrevio,
      esPrimeraInteraccion,
      nombre: existingProspectData.name || 'N/A'
    });

    // 🎯 FLUJO DE 14 MENSAJES v13.0 - Progressive Profiling + Captura Temprana
    const messageCount = messages.length;

    // 🔍 Detectar si pide lista de precios COMPLETA (para excepción de concisión)
    // ⚠️ IMPORTANTE: Solo activar para lista completa, NO para precios individuales
    const lastUserMessageForPrices = messages[messages.length - 1]?.content?.toLowerCase() || '';
    const pideListaPreciosEarly = /lista.*precio|todos.*los.*precio|precios.*producto|catálogo.*precio|dame.*los.*precio|cuáles.*son.*los.*precio|22.*producto|lista.*completa/i.test(lastUserMessageForPrices);

    // 🚨 LOG CRÍTICO: Verificar detección de lista de precios
    console.log(`🚨🚨🚨 DETECCIÓN LISTA PRECIOS: pideListaPreciosEarly=${pideListaPreciosEarly}, mensaje="${lastUserMessageForPrices.substring(0, 50)}"`);

    // ⚡ OPTIMIZADO v14.8: sessionInstructions reducido de ~7K a ~1.5K chars
    // Eliminado: 14 condicionales redundantes, tabla precios duplicada, instrucciones repetitivas
    const getMessageContext = () => {
      if (messageCount === 1) return 'MENSAJE 1 - SALUDO INICIAL';
      if (messageCount === 2) return 'MENSAJE 2 - CAPTURA NOMBRE';
      if (messageCount === 3) return 'MENSAJE 3 - CAPTURA ARQUETIPO';
      if (messageCount === 4) return 'MENSAJE 4 - OPCIONES';
      if (messageCount >= 5 && messageCount <= 7) return `MENSAJES 5-7 - PREGUNTAS (${messageCount}/14)`;
      if (messageCount === 8) return 'MENSAJE 8 - CHECKPOINT';
      if (messageCount >= 9 && messageCount <= 10) return `MENSAJES 9-10 - PROFUNDIZAR (${messageCount}/14)`;
      if (messageCount >= 11 && messageCount <= 13) return `MENSAJES 11-13 - CONVERSACIÓN (${messageCount}/14)`;
      return 'MENSAJE 14+ - CIERRE OBLIGATORIO';
    };

    // 🎯 CONTEXTO DE PÁGINA: Instrucciones específicas según dónde está el usuario
    const getPageContextInstructions = () => {
      if (pageContext === 'catalogo_productos') {
        return `
🌿 MODO ASESOR DE SALUD Y BIENESTAR (Página de Productos)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ INSTRUCCIÓN CRÍTICA: En esta página SOLO hablas de SALUD y BIENESTAR.

✅ LO QUE DEBES HACER:
• Enfocarte en beneficios para la salud del Ganoderma
• Explicar cómo los productos pueden mejorar su bienestar
• Responder sobre ingredientes, uso y beneficios
• Ayudar a elegir productos según sus necesidades de salud
• Dar información de precios cuando pregunten

❌ LO QUE NUNCA DEBES HACER EN ESTA PÁGINA:
• NUNCA mencionar "oportunidad de negocio"
• NUNCA hablar de "construir un activo" o "ingresos pasivos"
• NUNCA mencionar "ser distribuidor" o "unirse al equipo"
• NUNCA hablar de comisiones, redes o multinivel
• NUNCA sugerir que pueden ganar dinero con los productos

🎯 TU ROL: Eres un asesor de salud amable que ayuda a encontrar productos para mejorar el bienestar.
`;
      }
      return ''; // Sin instrucciones especiales para otras páginas
    };

    const sessionInstructions = `
📍 ${getMessageContext()}
${getPageContextInstructions()}
📊 PROSPECTO:
${mergedProspectData.name ? `• Nombre: ${mergedProspectData.name}` : ''}
${mergedProspectData.archetype ? `• Arquetipo: ${mergedProspectData.archetype}` : ''}
${mergedProspectData.phone ? `• WhatsApp: ${mergedProspectData.phone}` : ''}
${mergedProspectData.interest_level ? `• Interés: ${mergedProspectData.interest_level}/10` : ''}

${searchMethod === 'catalogo_productos' ? `🛒 CATÁLOGO ACTIVO: Usa precios EXACTOS del contenido arriba.` : ''}
${pideListaPreciosEarly ? `🚨 LISTA PRECIOS: Usa catálogo completo, ignora límites de concisión.` : `🎯 CONCISIÓN: Responde solo lo preguntado.`}
${messageCount >= 14 ? `⚠️ LÍMITE: NO continuar después de este mensaje.` : ''}
`;

    // 🔍 LOGGING DETALLADO PARA DEBUGGING
    console.log('🔍 DEBUG - Contexto enviado a Claude:');
    console.log('Método de búsqueda:', searchMethod);
    console.log('📦 CACHE STATUS: Usando Anthropic Prompt Caching (2 bloques + 1 dinámico)');
    if (searchMethod === 'catalogo_productos') {
      console.log('📋 Contenido catálogo enviado (primeros 200 chars):',
        relevantDocuments[0]?.content?.substring(0, 200) + '...');
    }
    console.log('📝 System prompt base (primeros 100 chars):',
      baseSystemPrompt.substring(0, 100) + '...');
    console.log('📝 Arsenal context length:', arsenalContext.length, 'chars');
    console.log('📝 Session instructions length:', sessionInstructions.length, 'chars');

    console.log('Enviando request Claude con contexto híbrido + CACHE...');

    // ⚡ FASE 1 - OPTIMIZACIÓN: max_tokens dinámico según tipo de consulta
    // FIX 2025-12-08: Regex específico para lista COMPLETA (no precios individuales)
    const lastUserMessage = messages[messages.length - 1]?.content?.toLowerCase() || '';
    const pideListaPrecios = /lista.*precio|todos.*los.*precio|precios.*producto|catálogo.*precio|dame.*los.*precio|cuáles.*son.*los.*precio|22.*producto|lista.*completa/i.test(lastUserMessage);

    console.log(`🔍 DEBUG PRECIOS: mensaje="${lastUserMessage.substring(0, 80)}", detectado=${pideListaPrecios}`);

    // ⚡ v17.5.0: Tokens aumentados para respuestas más cálidas y completas
    const maxTokens = pideListaPrecios
      ? 1000  // Lista completa de 22 productos (optimizado)
      : searchMethod === 'catalogo_productos'
      ? 500   // Consultas de precios = espacio para contexto (antes: 400)
      : prospectData.momento_optimo === 'caliente'
      ? 700   // Prospecto caliente = cierre cálido detallado (antes: 500)
      : 700;  // Default: espacio para empatía + analogías (antes: 600)

    console.log(`⚡ max_tokens dinámico: ${maxTokens} (${searchMethod}, pideListaPrecios=${pideListaPrecios})`);

    // 🧠 MEMORIA A LARGO PLAZO: Usar solo mensajes de sesión actual
    // El historial se inyecta como RESUMEN en el System Prompt (no como mensajes)
    const recentMessages = messages.length > 6 ? messages.slice(-6) : messages;
    console.log(`⚡ Mensajes de sesión actual: ${recentMessages.length} (últimos 3 intercambios)`);

    // ✅ Generar respuesta con Claude usando Prompt Caching + Optimizaciones FASE 1 + FASE 1.5
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      system: [
        // 🎯 BLOQUE 1: Base System Prompt (CACHEABLE - ~15K chars)
        {
          type: 'text',
          text: baseSystemPrompt,
          cache_control: { type: 'ephemeral' }
        },
        // 🎯 BLOQUE 2: Arsenal/Catálogo Context (CACHEABLE - ~2-8K chars)
        {
          type: 'text',
          text: arsenalContext,
          cache_control: { type: 'ephemeral' }
        },
        // 📝 BLOQUE 3: Session Instructions (NO CACHEABLE - siempre cambia)
        // ⚡ OPTIMIZADO: Eliminado topQueriesFAQ (~4K chars) - ya está en arsenales
        {
          type: 'text',
          text: sessionInstructions
        }
      ],
      stream: true,
      max_tokens: maxTokens,        // ⚡ v17.5.0: dinámico 500-1000 (antes: 300-600)
      temperature: 0.65,            // ⚡ v17.5.0: más natural y empático (antes: 0.3)
      top_p: 0.9,                    // Consistencia mejorada
      messages: recentMessages,      // ⚡ OPTIMIZADO: últimos 6 mensajes (antes: todos)
    });

    // Stream optimizado para arquitectura híbrida
    const stream = AnthropicStream(response as any, {
      onFinal: async (completion) => {
        const totalTime = Date.now() - startTime;
        console.log(`✅ NEXUS híbrido completado en ${totalTime}ms - Método: ${searchMethod}`);

        // ✅ EXTRACCIÓN SEMÁNTICA: Analizar respuesta de Claude para capturar datos
        const semanticData = extractFromClaudeResponse(completion);

        // 🛡️ PROTECCIÓN: NO sobrescribir nombre válido con extracción semántica
        // Causa: Regex "Perfecto [NOMBRE]" puede capturar solo apellido ("Pablo" en vez de "Pablo Hoyos")
        // Fix: Comparar con datos EXISTENTES en BD, no solo del mensaje actual
        const currentNameInDB = mergedProspectData.name || existingProspectData.name;
        if (semanticData.name && currentNameInDB && currentNameInDB.length >= 2) {
          console.log('⚠️ [SEMÁNTICA] Ignorando nombre semántico - ya existe nombre válido en BD:', currentNameInDB, '(semántico:', semanticData.name, ')');
          delete semanticData.name;
        }

        // Merge datos: captura directa (del usuario) + semántica (de respuesta Claude)
        const finalData: ProspectData = {
          ...prospectData,  // Datos capturados del input del usuario
          ...semanticData   // Datos extraídos de la respuesta de Claude (prioridad, excepto nombre)
        };

        // Guardar datos semánticos si se encontró algo
        if (Object.keys(semanticData).length > 0 && fingerprint) {
          console.log('🔍 [SEMÁNTICA] Guardando datos extraídos de respuesta Claude:', semanticData);

          try {
            const cleanedSemanticData = removeNullValues(semanticData);

            const { data: rpcResult, error: rpcError } = await getSupabaseClient().rpc('update_prospect_data', {
              p_fingerprint_id: fingerprint,
              p_data: cleanedSemanticData,
              p_constructor_id: constructorUUID || undefined
            });

            if (rpcError) {
              console.error('❌ [SEMÁNTICA] Error guardando datos semánticos:', rpcError);
            } else {
              console.log('✅ [SEMÁNTICA] Datos semánticos guardados exitosamente:', rpcResult);
            }
          } catch (error) {
            console.error('❌ [SEMÁNTICA] Exception guardando datos semánticos:', error);
          }
        }

        // Log conversación con datos finales completos
        await logConversationHibrida(
          latestUserMessage,
          completion,
          documentsUsed,
          searchMethod,
          sessionId,
          fingerprint,
          finalData  // ✅ Incluir datos semánticos en el log
        );
      }
    });

    return new StreamingTextResponse(stream);

  } catch (error) {
    const totalTime = Date.now() - startTime;
    console.error(`Error NEXUS híbrido después de ${totalTime}ms:`, error);

    const fallbackResponse = `Experimentamos alta demanda. Arquitectura híbrida activando contacto directo.

**Contacto inmediato disponible:**
Liliana Moreno - Consultora Senior
WhatsApp: +573102066593
Horario: 8:00 AM - 8:00 PM (GMT-5)

Información disponible:
- Arquitectura CreaTuActivo.com completa
- Paquetes y opciones personalizadas
- Proceso de activación paso a paso
- Consultoría estratégica completa`;

    return new Response(JSON.stringify({
      error: fallbackResponse
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Health check híbrido
export async function GET() {
  try {
    const supabase = getSupabaseClient();

    // Verificar Arsenal MVP completo
    const { data: arsenalDocs, error: arsenalError } = await supabase
      .from('nexus_documents')
      .select('category, metadata')
      .in('category', ['arsenal_inicial', 'arsenal_avanzado', 'catalogo_productos', 'arsenal_compensacion', 'arsenal_reto']);

    if (arsenalError) throw arsenalError;

    const arsenalInfo = arsenalDocs?.map(doc => ({
      type: doc.category,
      respuestas: doc.metadata?.respuestas_totales || 0
    })) || [];

    const totalRespuestas = arsenalInfo.reduce((sum, doc) => sum + (doc.respuestas || 0), 0);

    // Verificar system prompt híbrido
    const { data: promptData } = await supabase
      .from('system_prompts')
      .select('version, metadata')
      .eq('name', 'nexus_main')
      .single();

    // Verificar catálogo de productos
    const { data: catalogoData } = await supabase
      .from('nexus_documents')
      .select('id, title')
      .eq('id', 8)
      .single();

    // Verificar funciones RPC disponibles
    const { data: rpcFunctions } = await getSupabaseClient().rpc('search_nexus_documents', {
      search_query: 'test',
      match_count: 1
    });

    return new Response(JSON.stringify({
      status: 'healthy',
      version: API_VERSION,
      system_prompt_version: promptData?.version || 'unknown',
      arquitectura: 'híbrida escalable + catálogo fix',
      arsenal_mvp: {
        documentos: arsenalInfo,
        total_respuestas: totalRespuestas,
        esperado: 79,
        status: totalRespuestas === 79 ? 'completo' : 'incompleto',
        escalabilidad: 'infinita'
      },
      catalogo_productos: {
        id: catalogoData?.id || null,
        title: catalogoData?.title || null,
        status: catalogoData ? 'disponible' : 'no encontrado'
      },
      funciones_rpc: {
        search_nexus_documents: rpcFunctions !== null ? 'disponible' : 'error',
        update_prospect_data: 'disponible'
      },
      fix_aplicado: {
        instrucciones_catalogo: 'específicas y enfáticas',
        logging_detallado: 'habilitado',
        separacion_productos_paquetes: 'clara',
        fecha_aplicacion: '2025-09-01'
      },
      cache_hibrido: searchCache.size,
      timestamp: new Date().toISOString()
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({
      status: 'unhealthy',
      version: API_VERSION,
      arquitectura: 'híbrida + catálogo fix',
      error: error instanceof Error ? error.message : String(error)
    }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
