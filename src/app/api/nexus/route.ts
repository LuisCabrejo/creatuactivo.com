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

// Cliente admin (service role) — solo para lectura de nexus_documents con embeddings.
// RLS bloquea la lectura directa con anon key silenciosamente (retorna 0 sin error).
// Las demás operaciones (prospects, conversaciones) siguen usando anon key.
let supabaseAdmin: ReturnType<typeof createClient> | null = null;
function getSupabaseAdmin() {
  if (!supabaseAdmin) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);
  }
  return supabaseAdmin;
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
/**
 * Detecta señales avanzadas de intención de compra — Scoring v3.0
 *
 * Base científica (Mar 2026):
 * - Gong.io 2025: equilibrio habla-escucha, multi-threading (+130% cierre con terceros)
 * - Frontiers in AI 2025: Gradient Boosting — verbos de compra como predictores clave
 * - Emerald JSM 2025: especificidad lingüística = proxy directo de etapa BOFU
 * - MLM Motivational Factors Study 2025 (SCIRP): desarrollo personal beta 0.669
 * - Rogers Diffusion of Innovation: perfil innovador = conversión alta en fases early
 *
 * Escala: contribuciones hacia total 0–100 (acumulativo entre mensajes)
 * Dimensiones: Fit(30%) + Comportamiento(40%) + Lingüística(30%)
 */
function detectAdvancedSignals(message: string, messageCount: number): number {
  let signalScore = 0;
  const messageLower = message.toLowerCase();

  // ── DIMENSIÓN FIT — quién es ──────────────────────────────────────────────

  // F1: Profesión relevante (+10) — MLM Motivational Study, SCIRP 2025
  const relevantProfessions = [
    'comerciante', 'vendedor', 'emprendedor', 'empresario',
    'networker', 'distribuidor', 'freelance', 'consultor',
    'coach', 'asesor', 'independiente', 'representante',
    'agente', 'proveedor', 'mayorista', 'importador'
  ];
  if (relevantProfessions.some(p => messageLower.includes(p))) {
    signalScore += 10;
    console.log('👤 [SCORING v3.0] F1 — Profesión relevante (+10)');
  }

  // F2: Interés en desarrollo personal (+8) — MLM Study beta 0.669
  const personalDevPatterns = [
    /crecer/i, /aprender/i, /mejorar/i, /capacitar/i,
    /desarrollo personal/i, /superación/i, /habilidades/i,
    /mentoría/i, /academia/i, /formación/i
  ];
  if (personalDevPatterns.some(p => p.test(message))) {
    signalScore += 8;
    console.log('📚 [SCORING v3.0] F2 — Desarrollo personal (+8)');
  }

  // F3: Perfil innovador / early adopter (+7) — Rogers Diffusion of Innovation
  const innovatorPatterns = [
    /primero/i, /exclusiv/i, /cuántos (ya|están)/i,
    /cupos (disponibles|quedan)/i, /antes que/i,
    /fundador/i, /fundadores/i, /ventana/i, /tecnología/i
  ];
  if (innovatorPatterns.some(p => p.test(message))) {
    signalScore += 7;
    console.log('🚀 [SCORING v3.0] F3 — Perfil innovador (+7)');
  }

  // F4: Capacidad de inversión mencionada (+5)
  const investmentCapacityPatterns = [
    /puedo invertir/i, /tengo capital/i,
    /tengo (el |los )?(dinero|recursos|fondos)/i,
    /mi presupuesto/i, /cuánto (se necesita|hay que poner)/i
  ];
  if (investmentCapacityPatterns.some(p => p.test(message))) {
    signalScore += 5;
    console.log('💵 [SCORING v3.0] F4 — Capacidad de inversión (+5)');
  }

  // ── DIMENSIÓN COMPORTAMIENTO — qué hace ──────────────────────────────────

  // B1: Multi-threading — SEÑAL CRÍTICA (+15)
  // Gong.io 2025: negocios que involucran terceros cierran 130% más
  // Patrones colombianos validados contextualmente
  const multiThreadingPatterns = [
    /mi (esposa|esposo|pareja|socio|socia)/i,
    /mi (hermano|hermana|cuñado|cuñada)/i,
    /tengo (un amigo|una amiga|un conocido)/i,
    /nosotros (podríamos|lo haríamos|estamos interesados)/i,
    /lo (compartiría|compartiría) con/i,
    /también (le interesa|está interesado|quiere)/i,
    /mi (compañero|compañera) de (trabajo|negocio)/i,
    /somos (dos|tres|varios)/i,
    /(otra persona|alguien más) (que|también)/i,
    /un grupo de/i
  ];
  if (multiThreadingPatterns.some(p => p.test(message))) {
    signalScore += 15;
    console.log('👥 [SCORING v3.0] B1 — Multi-threading (+15) ← SEÑAL CRÍTICA');
  }

  // B2: Solicita contacto directo (+8) — escalada a humano = alta intención
  const contactRequestPatterns = [
    /una llamada/i, /videollamada/i, /reunión/i,
    /hablar (por|en) whatsapp/i, /contactar/i,
    /tu (número|contacto|whatsapp)/i,
    /cómo (te contacto|me comunico contigo)/i,
    /quiero hablar con/i
  ];
  if (contactRequestPatterns.some(p => p.test(message))) {
    signalScore += 8;
    console.log('📞 [SCORING v3.0] B2 — Solicita contacto (+8)');
  }

  // B3: Aplicación personal — paso de abstracto a concreto (+6)
  // Emerald JSM 2025: concreción = indicador de etapa BOFU
  const personalApplicationPatterns = [
    /cómo puedo yo/i, /en mi caso/i, /para mí/i,
    /yo podría/i, /si yo/i, /mi whatsapp/i,
    /mi correo/i, /mi número/i, /qué hago yo/i
  ];
  if (personalApplicationPatterns.some(p => p.test(message))) {
    signalScore += 6;
    console.log('🎯 [SCORING v3.0] B3 — Aplicación personal (+6)');
  }

  // B4: Comunicación directa y concisa (+4)
  // Gong.io 2025: decisores usan lenguaje directo y breve
  const wordCount = message.split(/\s+/).length;
  if (wordCount <= 6 && messageCount >= 3) {
    signalScore += 4;
    console.log('⚡ [SCORING v3.0] B4 — Comunicación directa (+4)');
  }

  // ── DIMENSIÓN LINGÜÍSTICA — cómo se expresa ───────────────────────────────

  // L1: Verbos de acción de compra (+8)
  // Frontiers in AI 2025: "comprar"(0.84), "encontrar"(0.85), "buscar"(0.78)
  const purchaseVerbPatterns = [
    /quiero (entrar|empezar|comenzar|unirme|participar)/i,
    /voy a (invertir|comenzar|empezar|unirme)/i,
    /(comprar|adquirir|invertir|registrar|inscrib)/i,
    /me (anoto|apunto|registro|uno)/i,
    /cómo (me registro|me uno|entro|empiezo)/i,
    /proceso de (registro|inscripción|activación)/i
  ];
  if (purchaseVerbPatterns.some(p => p.test(message))) {
    signalScore += 8;
    console.log('🛒 [SCORING v3.0] L1 — Verbos de compra (+8)');
  }

  // L2: Términos financieros específicos (+7)
  // Especificidad = diferenciador TOFU vs BOFU (Emerald JSM 2025)
  const specificFinancialTerms = [
    'rendimiento', 'porcentaje', 'comisión', 'retorno', 'roi',
    'paquete', 'dividendo', 'generación', 'gen5',
    'renta vitalicia', 'flujo', 'patrimonio',
    'portafolio', 'apalancamiento', 'plan de compensación'
  ];
  if (specificFinancialTerms.some(t => messageLower.includes(t))) {
    signalScore += 7;
    console.log('💰 [SCORING v3.0] L2 — Términos financieros específicos (+7)');
  }

  // L3: Urgencia genuina (+6) — diferente a evasión temporal
  const urgencyPatterns = [
    /lo antes posible/i, /esta semana/i, /hoy mismo/i,
    /cuándo (puedo|puedo empezar|arranca)/i,
    /no quiero (esperar|perder|quedarme sin)/i,
    /aprovechar (el momento|ahora|esta oportunidad)/i,
    /ya (quiero|estoy listo|puedo)/i
  ];
  if (urgencyPatterns.some(p => p.test(message))) {
    signalScore += 6;
    console.log('⏰ [SCORING v3.0] L3 — Urgencia genuina (+6)');
  }

  // L4: Profundización técnica (+4)
  const detailPatterns = [
    /exactamente/i, /específicamente/i, /en detalle/i,
    /explícame/i, /más información/i,
    /cómo funciona en la práctica/i,
    /a qué (te|se) refiere/i
  ];
  if (detailPatterns.some(p => p.test(message))) {
    signalScore += 4;
    console.log('🔍 [SCORING v3.0] L4 — Profundización (+4)');
  }

  // L5: Mentalidad de expansión / liderazgo (+5)
  const leadershipPatterns = [
    /mi equipo/i, /otras personas/i, /replicar/i,
    /enseñar/i, /acompañar/i, /construir.*equipo/i,
    /ayudar.*otros/i, /escalar/i, /duplicar/i
  ];
  if (leadershipPatterns.some(p => p.test(message))) {
    signalScore += 5;
    console.log('👑 [SCORING v3.0] L5 — Mentalidad de expansión (+5)');
  }

  // L6: Feedback positivo explícito (+3)
  const positiveFeedback = [
    /suena bien/i, /me gusta/i, /perfecto/i, /excelente/i,
    /genial/i, /me parece bien/i,
    /esto es lo que (buscaba|necesitaba)/i
  ];
  if (positiveFeedback.some(p => p.test(message))) {
    signalScore += 3;
    console.log('✅ [SCORING v3.0] L6 — Feedback positivo (+3)');
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
    /^([A-ZÀ-ÿ][a-zà-ÿ]+(?:\s+[A-ZÀ-ÿ][a-zà-ÿ]+)*)\s+(?:y|precio|cuánto|empezar|iniciar|a\)|b\)|c\)|d\)|e\)|f\))/i, // Nombre + conectores (sin "dame"/"quiero"/"necesito" — capturan verbos imperativos)
    /^([A-ZÀ-ÿ][a-zà-ÿ]+(?:\s+[A-ZÀ-ÿ][a-zà-ÿ]+)*)\s*$/
  ];

  // Blacklist de palabras que NO son nombres (incluye paquetes, arquetipos y opciones)
  // ✅ v12.3: Expandida para prevenir captura de paquetes como "visionario"
  const nameBlacklist = /^(hola|gracias|si|sí|no|ok|bien|claro|perfecto|excelente|entiendo|estoy listo|el|la|los|las|ese|este|aquel|aquella|el más|el de|la de|lo de|para|con|sin|sobre|desde|hasta|quiero|necesito|dame|busco|visionario|inicial|empresarial|constructor|estratégico|estrategico|acepto|a|b|c|d|e|f|profesional|emprendedor|freelancer|independiente|lider|líder|joven|ambicion|ambición|hogar|comunidad|vision|visión|dueño|dueno|negocio|empleo|empleado|empleada|trabajo|trabajador|trabajadora|comerciante|empresario|empresaria|ingeniero|ingeniera|médico|medico|médica|medica|doctor|doctora|abogado|abogada|profesor|profesora|docente|estudiante|pensionado|pensionada|jubilado|jubilada|gerente|director|directora|consultor|consultora|vendedor|vendedora|contador|contadora|administrador|administradora|jefe|CEO|CFO|CTO|muéstrame|háblame|cuéntame|explícame)$/i;

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

    // ⚠️ BLACKLIST EXPANDIDA v12.4: Evitar capturar paquetes, arquetipos, ocupaciones o respuestas como nombres
    const nameBlacklist = /^(hola|gracias|si|sí|no|ok|bien|claro|perfecto|excelente|entiendo|estoy listo|el|la|los|las|ese|este|aquel|aquella|el más|el de|la de|lo de|para|con|sin|sobre|desde|hasta|quiero|necesito|dame|busco|visionario|inicial|empresarial|constructor|estratégico|estrategico|acepto|a|b|c|d|e|f|profesional|emprendedor|freelancer|independiente|lider|líder|joven|ambicion|ambición|hogar|comunidad|vision|visión|dueño|dueno|negocio|empleo|empleado|empleada|trabajo|trabajador|trabajadora|comerciante|empresario|empresaria|ingeniero|ingeniera|médico|medico|médica|medica|doctor|doctora|abogado|abogada|profesor|profesora|docente|estudiante|pensionado|pensionada|jubilado|jubilada|gerente|director|directora|consultor|consultora|vendedor|vendedora|contador|contadora|administrador|administradora|jefe|CEO|CFO|CTO|muéstrame|háblame|cuéntame|explícame)$/i;

    if (simpleNameMatch && !messageLower.match(nameBlacklist)) {
      const capturedName = simpleNameMatch[1].trim();

      // ✅ VALIDACIÓN ADICIONAL: No capturar si empieza con artículo
      const startsWithArticle = /^(el|la|los|las|un|una|unos|unas)\s+/i.test(capturedName);

      if (capturedName.length >= 2 && !startsWithArticle && /^[A-ZÁÉÍÓÚÑ]/.test(capturedName)) {
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
    // Abreviaciones ESP (nomenclatura actual)
    'esp-1': 'ESP-1',
    'esp1': 'ESP-1',
    'esp 1': 'ESP-1',
    'esp-2': 'ESP-2',
    'esp2': 'ESP-2',
    'esp 2': 'ESP-2',
    'esp-3': 'ESP-3',
    'esp3': 'ESP-3',
    'esp 3': 'ESP-3',

    // Nombres completos ESP (con prefijo — evita falsos positivos)
    'esp-1 inicial': 'ESP-1',
    'esp-2 empresarial': 'ESP-2',
    'esp-3 visionario': 'ESP-3',
    'el inicial': 'ESP-1',
    'el empresarial': 'ESP-2',
    'el visionario': 'ESP-3',
    'paquete inicial': 'ESP-1',
    'paquete empresarial': 'ESP-2',
    'paquete visionario': 'ESP-3',
    'nivel inicial': 'ESP-1',
    'nivel empresarial': 'ESP-2',
    'nivel visionario': 'ESP-3',

    // Precios actuales (USD)
    '$200': 'ESP-1',
    '200 usd': 'ESP-1',
    'usd 200': 'ESP-1',
    '$500': 'ESP-2',
    '500 usd': 'ESP-2',
    'usd 500': 'ESP-2',
    '$1,000': 'ESP-3',
    '$1000': 'ESP-3',
    '1000 usd': 'ESP-3',
    'usd 1.000': 'ESP-3',
    'usd 1000': 'ESP-3',
    'mil dólares': 'ESP-3',
    'el de mil': 'ESP-3',
    'los mil': 'ESP-3',

    // Precios COP actuales
    '900.000': 'ESP-1',
    '900000': 'ESP-1',
    '2.250.000': 'ESP-2',
    '2250000': 'ESP-2',
    '4.500.000': 'ESP-3',
    '4500000': 'ESP-3',

    // Lenguaje natural — tamaño relativo
    'el más grande': 'ESP-3',
    'el grande': 'ESP-3',
    'el mayor': 'ESP-3',
    'el más completo': 'ESP-3',
    'el más caro': 'ESP-3',
    'el premium': 'ESP-3',
    'el top': 'ESP-3',
    'el mejor': 'ESP-3',
    'el máximo': 'ESP-3',
    'nivel máximo': 'ESP-3',
    'nivel directivo': 'ESP-3',
    'el de mayor rentabilidad': 'ESP-3',
    'el de 17%': 'ESP-3',

    'el pequeño': 'ESP-1',
    'el más pequeño': 'ESP-1',
    'el chico': 'ESP-1',
    'el básico': 'ESP-1',
    'el económico': 'ESP-1',
    'el barato': 'ESP-1',
    'el más barato': 'ESP-1',
    'el de entrada': 'ESP-1',
    'el de 15%': 'ESP-1',

    'el de la mitad': 'ESP-2',
    'el del medio': 'ESP-2',
    'el mediano': 'ESP-2',
    'el intermedio': 'ESP-2',
    'el estándar': 'ESP-2',
    'el normal': 'ESP-2',
    'nivel ejecutivo': 'ESP-2',
    'el de 16%': 'ESP-2',

    // Cantidad de productos
    'el de 7 productos': 'ESP-1',
    'el de siete productos': 'ESP-1',
    'con 7 productos': 'ESP-1',
    'el de 18 productos': 'ESP-2',
    'el de 35 productos': 'ESP-3',
    'el de treinta y cinco': 'ESP-3',
    'el que tiene más productos': 'ESP-3',
    'el que trae más': 'ESP-3',

    // Legado (nombres anteriores — mantener compatibilidad)
    'constructor inicial': 'ESP-1',
    'constructor estratégico': 'ESP-2',
    'constructor visionario': 'ESP-3',
    'el estratégico': 'ESP-2',
    'el estrategico': 'ESP-2',
    'nivel estratégico': 'ESP-2',
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
  // CÁLCULO DE NIVEL DE INTERÉS — SCORING v3.0
  // Base científica: Gong.io 2025, Frontiers in AI 2025, Emerald JSM 2025,
  //                  MLM Motivational Study (SCIRP 2025), Rogers Diffusion
  // Escala: 0–100 | Fórmula: Fit(30%) + Comportamiento(40%) + Lingüística(30%)
  // Umbrales: Frío 0–49 | Tibio 50–74 | Caliente 75–89 | SQL 90–100
  // ========================================

  // PASO 1: Score previo (acumulativo — no se resetea entre mensajes)
  let previousScore = 0; // Arrancar desde 0, sin base artificial
  let messageCount = 0;

  if (fingerprint && existingData) {
    previousScore = existingData.interest_level || 0;
    messageCount = (existingData.message_count || 0) + 1;
    console.log('📊 [SCORING v3.0] Score previo:', previousScore, '| Mensaje #' + messageCount);
  } else {
    console.log('📊 [SCORING v3.0] Nuevo prospecto — score base: 0');
  }

  // PASO 2: Señales de FIT — datos personales compartidos (acto de compromiso)
  let fitSignals = 0;
  if (data.name) fitSignals += 5;
  if (data.phone) fitSignals += 7;
  if (data.email) fitSignals += 6;
  if (data.occupation) fitSignals += 3;

  // PASO 3: Señales avanzadas v3.0 (Fit + Comportamiento + Lingüística)
  const advancedSignals = detectAdvancedSignals(message, messageCount);

  // PASO 4: Bonus por engagement sostenido
  // Frontiers in AI 2025: conversaciones largas con alta intención predicen conversión
  let engagementBonus = 0;
  if (messageCount >= 5) engagementBonus += 3;
  if (messageCount >= 8) engagementBonus += 3; // Total +6

  // PASO 5: Señales NEGATIVAS — penalizaciones científicamente validadas
  let negativeSignals = 0;

  // Rechazo explícito (-20) — descalificación inmediata
  if (messageLower.includes('no me interesa') || messageLower.includes('no gracias')) {
    negativeSignals -= 20;
    console.log('🚫 [SCORING v3.0] NEG — Rechazo explícito (-20)');
  }

  // Sin urgencia / evasión temporal (-10)
  // HubSpot Sales 2025: falta de urgencia = principal asesino de tratos
  const noUrgencyPatterns = [
    'tal vez', 'quizás', 'quizas', 'no es urgente',
    'después veo', 'despues veo', 'luego te escribo',
    'más tarde', 'mas tarde', 'otro día', 'otro dia',
    'no es importante ahora', 'lo pienso', 'déjame pensarlo', 'dejame pensarlo'
  ];
  if (noUrgencyPatterns.some(k => messageLower.includes(k))) {
    negativeSignals -= 10;
    console.log('⏸️ [SCORING v3.0] NEG — Sin urgencia (-10)');
  }

  // Necesita aprobación de tercero sin señal positiva de multi-threading (-8)
  // Vendux 2025: bloqueador del proceso de decisión si no se gestiona
  const approvalNeededPatterns = [
    /tengo que (preguntarle|consultarle|hablar con) (mi|el|la)/i,
    /primero (le pregunto|consulto|hablo con)/i,
    /mi (pareja|esposa|esposo|jefe|socio) (tiene que|debe|necesita) (ver|saber|decidir)/i
  ];
  if (approvalNeededPatterns.some(p => p.test(message))) {
    negativeSignals -= 8;
    console.log('🔒 [SCORING v3.0] NEG — Necesita aprobación (-8)');
  }

  // Evasión de presupuesto (-8)
  // Peasy AI 2025: ausencia de necesidad real = probabilidad de conversión nula
  const budgetEvasionPatterns = [
    /estamos explorando/i, /estoy viendo opciones/i,
    /no tengo (presupuesto|dinero|capital) (ahora|por ahora|todavía)/i,
    /ahorita no (puedo|tengo)/i
  ];
  if (budgetEvasionPatterns.some(p => p.test(message))) {
    negativeSignals -= 8;
    console.log('💸 [SCORING v3.0] NEG — Evasión de presupuesto (-8)');
  }

  // Sobre-acuerdo sin preguntas (-10)
  // Vendux 2025: "sí" a todo sin objeción = fuga educada, no conversión real
  const msgWords = message.trim().split(/\s+/).length;
  const isOverAgreement = msgWords <= 3 && messageCount >= 3 &&
    (messageLower.includes('sí') || messageLower.includes('si') ||
     messageLower.includes('claro') || messageLower.includes('ok') ||
     messageLower.includes('entiendo') || messageLower.includes('entendido'));
  if (isOverAgreement) {
    negativeSignals -= 10;
    console.log('⚠️ [SCORING v3.0] NEG — Sobre-acuerdo sin preguntas (-10)');
  }

  // PASO 6: Delta total y score acumulativo (escala 0–100)
  const deltaScore = fitSignals + advancedSignals + engagementBonus + negativeSignals;
  const totalScore = Math.min(100, Math.max(0, previousScore + deltaScore));
  data.interest_level = Math.round(totalScore);

  // PASO 7: Temperatura — umbrales validados por literatura científica
  // sales-mind.ai 2025, InsideSales.com, Velocify
  const temperatura =
    data.interest_level >= 90 ? 'listo' :
    data.interest_level >= 75 ? 'caliente' :
    data.interest_level >= 50 ? 'tibio' : 'frio';

  data.momento_optimo = temperatura;

  // PASO 8: Logging detallado
  console.log('📊 ═══════════════════════════════════════════════');
  console.log('📊 [SCORING v3.0] Mensaje #' + messageCount);
  console.log('  ├─ 📥 Score previo: ' + previousScore);
  console.log('  ├─ 👤 Señales fit: +' + fitSignals);
  console.log('  ├─ 🌟 Señales avanzadas: +' + advancedSignals.toFixed(1));
  console.log('  ├─ 💬 Bonus engagement: +' + engagementBonus);
  console.log('  ├─ 🚫 Señales negativas: ' + negativeSignals);
  console.log('  ├─ 📈 Delta total: ' + deltaScore.toFixed(1));
  console.log('  └─ 🎯 SCORE FINAL: ' + data.interest_level + '/100 → ' + temperatura.toUpperCase());
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

  // Las señales de bajo interés ya están integradas en PASO 5 (negativeSignals) del Scoring v3.0

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
// EXTRACCIÓN DE NOMBRE PARA HANDOFF (Estado 3a → Estado 4)
// Más permisiva que captureProspectData: el contexto es explícito (bot preguntó el nombre)
// ============================================================================
function extractNameFromHandoffReply(message: string): string | null {
  const cleanMsg = message.trim();

  // Rechazar si el usuario declina dar su nombre
  const declines = /no\s+(quiero|tengo|doy|d[eé]|quiero\s+dar)|prefiero\s+no|an[oó]nimo|sin\s+nombre|no\s+importa|da\s+igual|como\s+quieras|no\s+es\s+necesario|s[aá]ltalo|omite/i;
  if (declines.test(cleanMsg)) return null;

  // Blacklist de ocupaciones/comandos que no son nombres de persona
  const occupationBlacklist = /^(empleo|empleado|empleada|trabajo|trabajador|trabajadora|comerciante|empresario|empresaria|ingeniero|ingeniera|m[eé]dico|m[eé]dica|doctor|doctora|abogado|abogada|profesor|profesora|docente|freelance|freelancer|independiente|estudiante|pensionado|pensionada|jubilado|jubilada|gerente|director|directora|consultor|consultora|vendedor|vendedora|contador|contadora|administrador|administradora|jefe|l[ií]der|lider|CEO|CFO|CTO|hola|gracias|si|s[ií]|no|ok|bien|claro|perfecto|excelente|acepto|dame|quiero|necesito|mu[eé]strame|h[aá]blame|cu[eé]ntame|expl[ií]came|vamos|adelante)$/i;

  // Patrones para extraer el nombre
  const namePatterns = [
    /(?:me llamo|mi nombre es|soy)\s+([A-ZÀ-ÿ][a-zà-ÿ]+(?:\s+[A-ZÀ-ÿ][a-zà-ÿ]+)*)/i,
    /^([A-ZÀ-ÿ][a-zà-ÿ]+(?:\s+[A-ZÀ-ÿ][a-zà-ÿ]+)*)[,.]?\s*$/,  // Solo el nombre (con puntuación opcional al final)
  ];

  for (const pattern of namePatterns) {
    const match = cleanMsg.match(pattern);
    if (match) {
      const candidate = match[1].trim();
      if (candidate.length >= 2 && !occupationBlacklist.test(candidate)) {
        return candidate;
      }
    }
  }
  return null;
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
    const { data, error } = await getSupabaseAdmin()
      .from('nexus_documents')
      .select('category, title, content, embedding_512, metadata')
      .in('category', ['arsenal_inicial', 'arsenal_avanzado', 'catalogo_productos', 'arsenal_compensacion', 'arsenal_reto'])
      .eq('tenant_id', 'creatuactivo_marketing')  // Capa 3.2: aislamiento multi-tenant
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
    const { data, error } = await getSupabaseAdmin()
      .from('nexus_documents')
      .select('category, title, content, embedding_512, metadata')
      .or('category.like.arsenal_%_%, category.like.catalogo_productos_%')  // Match arsenal_inicial_WHY_01, catalogo_productos_BEB_01, etc.
      // Sin filtro de tenant: se carga todos los fragmentos (creatuactivo_marketing + ecommerce + marca_personal)
      // El filtro real ocurre en searchArsenalFragments → filter(f => f.category.startsWith(arsenalType))
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
    // Threshold 0.40: equilibrio entre recall y precisión. Con 0.30 había falsos positivos
    // (query de catálogo matcheaba compensación con similitud 0.31-0.38).
    // Los routing directos (paquetes, suplementos, categorías) bypassean este threshold.
    const results = await vectorSearch(userMessage, arsenalFragments, voyageApiKey, {
      threshold: 0.40,
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
    /(?:dame el precio|cuánto cuesta|precio|cuesta|valor|vale|cuánto vale).*schokolade/i,

    // ===== CUIDADO PERSONAL =====
    /(?:dame el precio|cuánto cuesta|precio|cuesta|valor|vale|cuánto vale).*(?:pasta.*dientes|gano fresh)/i,
    /(?:dame el precio|cuánto cuesta|precio|cuesta|valor|vale|cuánto vale).*(?:jabón|gano\s*soap|soap\s*gano|jabón\s*gano|champú|acondicionador|exfoliante)/i,
    /(?:dame el precio|cuánto cuesta|precio|cuesta|valor|vale|cuánto vale).*(?:piel.*brillo|piel&brillo)/i,

    // ===== PATRONES GENERALES DE PRODUCTOS =====
    /(?:dame el precio|cuánto cuesta|precio|cuesta|valor|vale|cuánto vale).*producto/i,
    /(?:precio|valor).*(?:consumidor|individual)/i,
    /catálogo.*(?:precio|valor)/i,
    /lista.*(?:precios|valores).*producto/i,

    // ===== PATRONES ESPECÍFICOS POR MARCA =====
    /(?:dame el precio|cuánto cuesta|precio|cuesta|valor|vale|cuánto vale).*(?:gano excel|dxn)/i,

    // ===== FÓRMULAS NATURALES DE CONSULTA DE PRECIO =====
    // "qué precio tiene X", "cuánto es el X", "cuánto sale el X", "a cuánto está X"
    /qu[eé]\s*precio\s*(?:tiene|cuesta|vale)\s+(?:el|la|los|las)?\s*(?:gano|caf[eé]|schokolade|cordygold|luvoco|reskine|col[aá]geno|espirulina|rooibos|jab[oó]n|soap|shampoo|acondicionador|exfoliante|excellium|c[aá]psulas)/i,
    /cu[aá]nto\s+(?:es|sale|está|esta)\s+(?:el|la|los|las)?\s*(?:gano|caf[eé]|schokolade|cordygold|luvoco|reskine|col[aá]geno|espirulina|rooibos|jab[oó]n|soap|shampoo|acondicionador|exfoliante|excellium|c[aá]psulas)/i,
    /a\s*cu[aá]nto\s*(?:est[aá]n?)\s+(?:el|la|los|las)?\s*(?:gano|caf[eé]|schokolade|cordygold|luvoco|reskine|jab[oó]n|soap)/i,
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

    // ===== FIX: TODO LO RELACIONADO CON PAQUETES =====
    // COMP_PAQ_01 (precios), COMP_PAQ_02/03/04 (contenido) — todos en arsenal_compensacion
    /precio.*paquete/i,                // "precio de los paquetes"
    /paquete.*precio/i,                // "paquete empresarial precio"
    /cu[aá]nto.*cuesta.*(paquete|esp|empezar|activar|entrar)/i,
    /cu[aá]nto.*vale.*(paquete|esp)/i,
    /paquetes.*disponibles/i,
    /cu[aá]les.*(?:son.*)?(?:los\s+)?paquetes/i,
    /qu[eé].*paquetes.*(?:hay|tienen|ofrecen)/i,
    /h[aá]blame.*(?:de\s+)?(?:los\s+)?paquetes/i,
    /informaci[oó]n.*paquetes/i,
    /tipos.*(?:de\s+)?paquetes/i,
    /\besp[\s-]?[123]\b/i,             // "ESP-1", "ESP 2", "ESP3"
    /paquete\s*(?:inicial|empresarial|visionario)/i,
    // Contenido por paquete (COMP_PAQ_02/03/04)
    /qu[eé].*(?:trae|incluye|contiene|recibo|viene).*(?:paquete|esp)/i,
    /(?:paquete|esp).*(?:trae|incluye|contiene|recibo|viene)/i,
    /cu[aá]ntos.*productos.*(paquete|esp)/i,
    /qu[eé].*productos.*(paquete|esp)/i,
    /desglose.*paquete/i,
    /composici[oó]n.*paquete/i,
    /inventario.*paquete/i,
    // Conformación — "cómo están conformados los paquetes", "qué productos incluye el empresarial"
    /conformad[ao]s?\s*(?:los\s*)?paquetes?/i,
    /paquetes?\s*conformad[ao]s?/i,
    /c[oó]mo\s+est[aá]n?\s+conformad[ao]s?/i,
    /con\s+qu[eé]\s+productos/i,
    /qu[eé]\s+productos\s+(est[aá]|trae|incluye|contiene|viene)/i,
    // Inicio del negocio — "cómo se inicia", "cómo empiezo", "para empezar" → paquetes
    /c[oó]mo\s+(se\s+)?(inici[ao]|empies[ao]|empiez[ao])/i,
    /c[oó]mo\s+empe[zc][ao]r/i,
    /para\s+(empezar|iniciar|arrancar|activar|entrar)\s*(al?\s+)?(negocio|sistema|plataforma|esto)?/i,
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
    /biodisponibilidad/i,

    // Nombres coloquiales de productos específicos (sin requerir precio)
    /rooibos/i,                                             // Oleaf Gano Rooibos
    /\bcereal\b/i,                                          // Gano C'Real Spirulina
    /c['`]?real/i,                                         // "c'real", "gano creal"
    /espirulina|spirulina/i,                                // Gano C'Real Spirulina
    /schokoladde/i,                                         // Gano Schokoladde (sin precio)
    /(?:tienen|tienes|hay|tiene).*\bt[eé]\b/i,             // "tienen algún té", "hay té"
    /\bt[eé]\b.*(?:gano|ganoderma|funcional)/i,            // "té con ganoderma"
    /háblame.*(?:del?\s+t[eé]|rooibos|cereal|espirulina)/i, // "háblame del té/cereal"
    /(?:colágeno|colageno).*(?:bebida|drink|gano)/i,        // colágeno como bebida
    /reskine/i,                                             // Reskine Collagen (sin precio)
    /oleaf/i,                                               // Oleaf (sin precio)
    /luvoco.*(?:cápsula|beneficio|para.*qué|sirve)/i        // Luvoco sin precio
  ];

  // PRIORIDAD 1.5: CV/PV de productos O lista completa de precios → arsenal_compensacion
  // COMP_PV_06 es la fuente única de verdad: 22 productos × {Cod|PV|CV|Precio COP vigente 2026}.
  // Los fragmentos de catalogo_productos (BEB_01 etc.) tienen precios correctos en el TXT
  // pero el modelo los ignora y usa precios de entrenamiento (~2023). COMP_PV_06 tiene
  // códigos oficiales de producto que el modelo no puede "sustituir" con datos viejos.
  const esCVoPVQuery = /\bcv\b|\bpv\b|puntos\s*(de\s*)?volumen|volumen\s*personal|cu[aá]ntos?\s*(pv|cv)|valor(es)?\s*(pv|cv)|(pv|cv)\s*(tiene|del?|de\s+la?|por|da|aporta|genera)/i.test(messageLower);
  // "dame los precios" / "lista completa" / "todos los precios" → también COMP_PV_06
  const esListaPreciosGlobal = /lista.*precio|precio.*lista|todos.*(?:los\s*)?precio|precios.*(?:de\s*todos|completo)|dame.*(?:los\s*)?precio|cu[aá]les.*(?:son.*)?(?:los\s*)?precio|precio.*producto|catálogo.*precio|22.*producto/i.test(messageLower);
  if (esCVoPVQuery || esListaPreciosGlobal) {
    console.log('📊 Clasificación: CV/PV / LISTA PRECIOS → arsenal_compensacion (COMP_PV_06)');
    return 'arsenal_compensacion';
  }

  // PRIORIDAD 1.6: GEN5 / Bonos / Plan de Compensación → arsenal_compensacion
  // FIX 2026-04-06: patrones_cierre incluye /gen5/i, /bono/i, /comision/i pero devuelve
  // arsenal_avanzado — GEN5 content está en COMP_GEN5_01 de arsenal_compensacion.
  const esGEN5oCompensacion = /\bgen[\s-]?5\b|\bgen5\b|bono.*inici|inici.*r[aá]pid|plan\s*de?\s*compensac|compensac.*plan|c[oó]mo\s*(se\s*)?(gana|paga|distribuye)\s*(el\s*)?dinero|qu[eé]\s*gano\s*cuando|cu[aá]nto\s*gano\s*(por|en|a\s*la?\s*(semana|mes))|velocidad\s*de\s*inici|pago\s*semanal|tabla\s*de\s*generac|bono\s*de\s*inici/i.test(messageLower);
  if (esGEN5oCompensacion) {
    console.log('💰 Clasificación: GEN5/Bono/Compensación → arsenal_compensacion (COMP_GEN5_*)');
    return 'arsenal_compensacion';
  }

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
  // PASO 0: CLASIFICACIÓN — Patrones primero (0ms), Voyage AI solo si es necesario
  // ============================================================================
  // ⚡ OPTIMIZACIÓN LATENCIA: el pattern matcher cubre ~80% de los casos comunes
  // (saludos, preguntas de precio, objeciones frecuentes) en 0ms.
  // Solo se llama a Voyage AI cuando los patrones no resuelven la ruta.
  let documentType: string | null = null;

  // Cortocircuito: patrones rápidos primero
  documentType = clasificarDocumentoHibrido(expandedMessage);
  if (documentType) {
    console.log(`📋 [Patterns] Clasificación rápida (0ms): ${documentType}`);
  }

  // Solo si los patrones no resolvieron, usar Voyage AI
  if (!documentType) {
    try {
      documentType = await clasificarDocumentoVectorial(expandedMessage);
      if (documentType) {
        console.log(`🧠 [VectorSearch] Clasificación vectorial: ${documentType}`);
      }
    } catch (error) {
      console.warn('[VectorSearch] Failed, using pattern fallback:', error);
    }
  }

  // PASO 0.5: OVERRIDE CRÍTICO — Previene falsos positivos del vector search
  // El vector confunde "cómo funciona el negocio" con arsenal_compensacion
  // porque COMP_MODELO_01 también responde "cómo funciona el plan de compensación"
  const queryLower = expandedMessage.toLowerCase();
  const overridesAInicial = [
    /c[oó]mo\s+funciona\s+(el\s+)?negocio/i,
    /c[oó]mo\s+funciona\s+(el\s+)?modelo/i,
    /explicar\s+(el\s+)?sistema/i,           // expansión del menú opción 'b'
    /qu[eé]\s+es\s+creatuactivo/i,
    /de\s+qu[eé]\s+trata\s+(el\s+)?negocio/i,
    /en\s+qu[eé]\s+consiste\s+(el\s+)?negocio/i,
  ];
  if (overridesAInicial.some(p => p.test(queryLower)) && documentType !== 'arsenal_inicial') {
    console.log(`🔒 [Override WHY→inicial] "${documentType}" → arsenal_inicial`);
    documentType = 'arsenal_inicial';
  }

  // PASO 1: Fallback a clasificación por patrones si vector no encontró match
  if (!documentType) {
    documentType = clasificarDocumentoHibrido(expandedMessage);
    if (documentType) {
      console.log(`📋 [Patterns] Clasificación por patrones: ${documentType}`);
    }
  }

  // NUEVA LÓGICA: CONSULTA DE CATÁLOGO DE PRODUCTOS (fragmentada)
  if (documentType === 'catalogo_productos') {
    // Queries de "lista completa" → recuperar las 4 tablas de precios explícitamente
    // BEB_01 + LUV_01 + SUP_01 + PERS_01 tienen TODAS las tablas de precios del catálogo
    // El doc monolítico (14,748 chars) causaba alucinaciones de precio por atención dispersa
    const esListaCompleta = /cat[aá]logo.*completo|lista.*completa|todos.*los.*producto|todos.*los.*precio|dame.*todos|completo.*con.*precio|precio.*todos|22.*producto/i.test(userMessage.toLowerCase());
    if (esListaCompleta) {
      console.log('📋 [Catálogo] Lista completa → recuperando tablas de precio (BEB_01+LUV_01+SUP_01+PERS_01)');
      const allFragments = await getArsenalFragments();
      const precioIds = [
        'catalogo_productos_BEB_01',
        'catalogo_productos_LUV_01',
        'catalogo_productos_SUP_01',
        'catalogo_productos_PERS_01'
      ];
      const precioFragments = allFragments.filter(f => precioIds.includes(f.category));
      console.log(`📋 [Catálogo] Tablas de precio recuperadas: ${precioFragments.map(f => f.category).join(', ')}`);
      if (precioFragments.length >= 2) {
        const combinedContent = precioFragments.map(f => f.content).join('\n\n---\n\n');
        const result = [{
          id: 'catalogo_productos_price_tables',
          title: 'Tablas de precios — Catálogo completo',
          content: combinedContent,
          category: 'catalogo_productos',
          metadata: { is_price_tables: true, fragment_count: precioFragments.length },
          source: '/knowledge_base/catalogo_productos.txt',
          search_method: 'price_table_fragments'
        }];
        searchCache.set(cacheKey, { data: result, timestamp: Date.now() });
        return result;
      }
      // Fallback: si los fragmentos no están disponibles, usar doc monolítico
      console.log('⚠️ [Catálogo] Fragmentos de precio no disponibles → fallback doc completo');
      const catalogoResult = await consultarCatalogoProductos(query);
      if (catalogoResult.length > 0) {
        searchCache.set(cacheKey, { data: catalogoResult, timestamp: Date.now() });
        return catalogoResult;
      }
    }

    // Routing directo por categoría — evita fallos de vector search en consultas por categoría
    // "dame el precio de los suplementos" → SUP_01 directamente sin depender de similitud vectorial
    const msgL = userMessage.toLowerCase();
    const esBebidaCategoria  = /precio.*bebida|bebidas.*precio|precio.*caf[eé]|cuánto.*caf[eé]|cuánto.*bebida|lista.*bebida|todos.*caf[eé]/i.test(msgL) && !/específico|rooibos|latte|mocha|shoko|spirulina|cereal|colágeno|reskine|schokolade|clásico|classic/i.test(msgL);
    const esSuplementoCat    = /suplemento|cápsula|capsula|ganoderma caps|excellium|cordygold/i.test(msgL);
    const esLuvocoCat        = /luvoco|m[aá]quina.*caf[eé]|caf[eé].*m[aá]quina/i.test(msgL);
    const esCuidadoPersonal  = /cuidado.*personal|jabón|jabon|shampoo|acondicionador|exfoliante|pasta.*diente|toothpaste|gano\s*soap/i.test(msgL);
    const categoriasDirectas: string[] = [];
    if (esBebidaCategoria) categoriasDirectas.push('catalogo_productos_BEB_01');
    if (esSuplementoCat)   categoriasDirectas.push('catalogo_productos_SUP_01');
    if (esLuvocoCat)       categoriasDirectas.push('catalogo_productos_LUV_01');
    if (esCuidadoPersonal) categoriasDirectas.push('catalogo_productos_PERS_01');

    if (categoriasDirectas.length > 0) {
      console.log(`🎯 [Catálogo] Routing directo por categoría: ${categoriasDirectas.join(', ')}`);
      const allFragments = await getArsenalFragments();
      const directFrags = allFragments.filter(f => categoriasDirectas.includes(f.category));
      if (directFrags.length > 0) {
        const combinedContent = directFrags.map(f => f.content).join('\n\n---\n\n');
        const result = [{
          id: 'catalogo_productos_direct',
          title: 'Catálogo — categoría específica',
          content: combinedContent,
          category: 'catalogo_productos',
          metadata: { categories: categoriasDirectas },
          source: '/knowledge_base/catalogo_productos.txt',
          search_method: 'category_direct'
        }];
        searchCache.set(cacheKey, { data: result, timestamp: Date.now() });
        return result;
      }
    }

    console.log('🛒 Consulta fragmentada: CATÁLOGO DE PRODUCTOS');

    // Intentar primero con fragmentos Voyage AI (igual que arsenales)
    const fragments = await searchArsenalFragments(userMessage, 'catalogo_productos', 5);

    if (fragments.length > 0) {
      const totalFragmentChars = fragments.reduce((sum, f) => sum + f.content.length, 0);
      console.log(`✅ [Fragments] ${fragments.length} fragmentos catálogo (${totalFragmentChars} chars vs ~14,748 doc completo)`);

      const combinedContent = fragments.map(f => f.content).join('\n\n---\n\n');

      const result = [{
        id: 'catalogo_productos_fragments',
        title: 'Fragmentos relevantes de catálogo de productos',
        content: combinedContent,
        category: 'catalogo_productos',
        metadata: {
          is_fragment_result: true,
          fragment_count: fragments.length,
          fragment_categories: fragments.map(f => f.category),
          total_chars: totalFragmentChars
        },
        source: '/knowledge_base/catalogo_productos.txt',
        search_method: 'fragment_vector_search'
      }];

      searchCache.set(cacheKey, { data: result, timestamp: Date.now() });
      return result;
    }

    // Fallback inteligente: 4 tablas de precio (~2K chars) en lugar del doc monolítico (14K)
    // Cubre productos como "Reskine" que no tienen fragmento propio pero sí aparecen en BEB_01
    console.log('⚠️ [Catálogo] Vector search sin resultados → fallback tablas de precio (BEB_01+SUP_01+LUV_01+PERS_01)');
    const allFragsFallback = await getArsenalFragments();
    const precioTableIds = [
      'catalogo_productos_BEB_01',
      'catalogo_productos_SUP_01',
      'catalogo_productos_LUV_01',
      'catalogo_productos_PERS_01'
    ];
    const precioTableFrags = allFragsFallback.filter(f => precioTableIds.includes(f.category));
    if (precioTableFrags.length >= 2) {
      console.log(`📋 [Catálogo] Tablas de precio recuperadas: ${precioTableFrags.map(f => f.category).join(', ')}`);
      const combinedPrices = precioTableFrags.map(f => f.content).join('\n\n---\n\n');
      const result = [{
        id: 'catalogo_productos_price_tables_fallback',
        title: 'Tablas de precios — productos sin fragmento específico',
        content: combinedPrices,
        category: 'catalogo_productos',
        metadata: { is_price_tables_fallback: true, fragment_count: precioTableFrags.length },
        source: '/knowledge_base/catalogo_productos.txt',
        search_method: 'price_table_fallback'
      }];
      searchCache.set(cacheKey, { data: result, timestamp: Date.now() });
      return result;
    }

    // Último recurso: doc completo (solo si las tablas de precio no están disponibles)
    console.log('⚠️ [Catálogo] Tablas de precio no disponibles → doc completo (último recurso)');
    const catalogoResult = await consultarCatalogoProductos(query);
    if (catalogoResult.length > 0) {
      searchCache.set(cacheKey, { data: catalogoResult, timestamp: Date.now() });
      return catalogoResult;
    }
  }

  // ⚡ ROUTING DIRECTO: TABLA DE PRECIOS COMPLETA → COMP_PV_06
  // COMP_PV_06 = 22 productos × {Cod|PV|CV|Precio COP vigente 2026}. Es la fuente canónica.
  // Los fragmentos de catalogo_productos (BEB_01 etc.) son ignorados por el modelo que usa
  // precios de entrenamiento pre-2026. COMP_PV_06 tiene códigos oficiales que anclan el modelo.
  if (documentType === 'arsenal_compensacion') {
    const msgLp = userMessage.toLowerCase();
    const esListaPrecios = /lista.*precio|precio.*lista|todos.*precio|precios.*(?:de\s*todos|completo|producto)|dame.*precio|cu[aá]les.*precio|22.*producto|catálogo.*precio|\bcv\b.*\bpv\b|\bpv\b.*\bcv\b|cv.*pv.*precio|tabla.*precio|precios.*caf[eé]/i.test(msgLp);
    if (esListaPrecios) {
      console.log('📊 [COMP_PV_06] Routing directo → tabla completa precios+CV+PV');
      const allFragments = await getArsenalFragments();
      const pvFrags = allFragments.filter(f => f.category === 'arsenal_compensacion_COMP_PV_06');
      if (pvFrags.length > 0) {
        const result = [{
          id: 'arsenal_compensacion_COMP_PV_06',
          title: 'Tabla completa PV, CV y Precio — 22 productos vigente 2026',
          content: pvFrags[0].content,
          category: 'arsenal_compensacion',
          metadata: { is_pv_table: true },
          source: '/knowledge_base/arsenal_compensacion.txt',
          search_method: 'comp_pv06_direct'
        }];
        searchCache.set(cacheKey, { data: result, timestamp: Date.now() });
        return result;
      }
    }
  }

  // ⚡ ROUTING DIRECTO: PAQUETES DE INVERSIÓN (compensación)
  // "háblame de los paquetes", "que trae el ESP-2", etc. → COMP_PAQ_01-04 directamente
  // Evita fallos de vector search cuando la query no alcanza threshold 0.30
  if (documentType === 'arsenal_compensacion') {
    const msgLc = userMessage.toLowerCase();
    const esPaqueteQuery = /paquete|esp[-\s]?[123]|qu[eé].*trae|qu[eé].*incluye|composici[oó]n|inventario.*esp|contenido.*esp|inversion.*inicial|cu[aá]nto.*cuesta.*emp|precio.*esp|conformad[ao]s?|con\s+qu[eé]\s+productos|c[oó]mo\s+(se\s+)?(inici[ao]|empies[ao]|empiez[ao])|para\s+(empezar|iniciar|activar|entrar)/i.test(msgLc);
    if (esPaqueteQuery) {
      const esESP1 = /esp[-\s]?1|inicial|200\s*usd/i.test(msgLc);
      const esESP2 = /esp[-\s]?2|empresarial|500\s*usd/i.test(msgLc);
      const esESP3 = /esp[-\s]?3|visionario|1[,.]?000\s*usd/i.test(msgLc);
      // Si pide uno específico → PAQ_01 + el específico; si pide todos → PAQ_01,02,03,04
      const paqIds: string[] = ['arsenal_compensacion_COMP_PAQ_01'];
      if (esESP1 || (!esESP2 && !esESP3)) paqIds.push('arsenal_compensacion_COMP_PAQ_02');
      if (esESP2 || (!esESP1 && !esESP3)) paqIds.push('arsenal_compensacion_COMP_PAQ_03');
      if (esESP3 || (!esESP1 && !esESP2)) paqIds.push('arsenal_compensacion_COMP_PAQ_04');

      const allFragments = await getArsenalFragments();
      const paqFrags = allFragments.filter(f => paqIds.includes(f.category));
      console.log(`🎯 [Paquetes] Routing directo: ${paqFrags.map(f => f.category).join(', ')}`);
      if (paqFrags.length > 0) {
        const combinedContent = paqFrags.map(f => f.content).join('\n\n---\n\n');
        const result = [{
          id: 'arsenal_compensacion_paquetes',
          title: 'Paquetes de Inversión — COMP_PAQ_01-04',
          content: combinedContent,
          category: 'arsenal_compensacion',
          metadata: { is_paquetes: true, fragment_count: paqFrags.length },
          source: '/knowledge_base/arsenal_compensacion.txt',
          search_method: 'paquete_direct'
        }];
        searchCache.set(cacheKey, { data: result, timestamp: Date.now() });
        return result;
      }
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

/// ✅ MULTI-TENANT v15.0: getSystemPrompt acepta tenantId inyectado por middleware.ts
// Cache particionado por tenant — cada dominio tiene su propia entrada en memoria
async function getSystemPrompt(tenantId: string = 'creatuactivo_marketing'): Promise<string> {
  const cacheKey = `system_prompt_${tenantId}`;
  const cached = systemPromptCache.get(cacheKey);

  // Verificar cache válido
  if (cached && (Date.now() - cached.timestamp) < SYSTEM_PROMPT_CACHE_TTL) {
    console.log(`✅ System prompt [${tenantId}] ${cached.version} desde cache (${Math.round((SYSTEM_PROMPT_CACHE_TTL - (Date.now() - cached.timestamp)) / 1000)}s restantes)`);
    return cached.content;
  }

  console.log(`🔄 Recargando system prompt para tenant [${tenantId}]...`);

  try {
    // Usar RPC get_tenant_system_prompt para resolución por tenant_id
    // Fallback: si el tenant no tiene prompt propio, usar nexus_main (creatuactivo_marketing)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: rpcData, error: rpcError } = await (getSupabaseClient().rpc as any)(
      'get_tenant_system_prompt',
      { p_tenant_id: tenantId }
    );

    let promptData: { prompt: string; version: string } | null = null;

    if (!rpcError && rpcData && Array.isArray(rpcData) && rpcData.length > 0) {
      promptData = rpcData[0] as { prompt: string; version: string };
    } else if (!rpcError && rpcData && !Array.isArray(rpcData)) {
      promptData = rpcData as { prompt: string; version: string };
    } else {
      // Tenant sin prompt propio → fallback a nexus_main
      console.warn(`⚠️ [${tenantId}] sin prompt en DB, fallback a nexus_main`);
      const { data: fallbackData } = await getSupabaseClient()
        .from('system_prompts')
        .select('prompt, version')
        .eq('name', 'nexus_main')
        .single();
      promptData = fallbackData as { prompt: string; version: string } | null;
    }

    const systemPrompt = promptData?.prompt || getFallbackSystemPrompt();

    if (systemPrompt.length > 50000) {
      console.warn(`⚠️ System prompt muy largo: ${systemPrompt.length} chars`);
    }

    systemPromptCache.set(cacheKey, {
      content: systemPrompt,
      timestamp: Date.now(),
      version: promptData?.version || 'unknown',
      length: systemPrompt.length
    });

    console.log(`✅ [${tenantId}] ${promptData?.version} cacheado (${systemPrompt.length} chars)`);
    return systemPrompt;

  } catch (error) {
    console.error(`Error cargando system prompt [${tenantId}]:`, error);
    if (cached) return cached.content;
    return getFallbackSystemPrompt();
  }
}

// Fallback system prompt - IDENTIDAD COMPLETA SIN VERSIONES
function getFallbackSystemPrompt(): string {
  console.log('Usando fallback system prompt - identidad completa');
  return `Eres Queswa, el Motor Cognitivo de Construcción de Patrimonio Paralelo del ecosistema CreaTuActivo.

🎭 IDENTIDAD CORE: Motor Cognitivo

Eres Queswa (El Enlace), el Motor Cognitivo de Construcción de Patrimonio Paralelo del ecosistema CreaTuActivo. Tu misión es guiar constructores activos hacia la soberanía financiera a través de apalancamiento asimétrico. Eres preciso, directo y nunca vendes — posicionas.

TU MISIÓN: Construcción de Patrimonio Paralelo
Cada respuesta debe acercar al prospecto a una decisión informada. No persuades — presentas arquitectura. El sistema califica; tú informas con claridad de consultor senior.

LOS TRES COMPONENTES DE LA MÁQUINA HÍBRIDA:
• El músculo es Gano Excel — infraestructura corporativa en más de 70 países, con plantas de producción, logística y distribución propias. Sin fábrica propia, sin almacén.
• El cerebro es Queswa y CreaTuActivo — la plataforma que presenta el negocio, responde preguntas y guía a las personas paso a paso.
• Tu rol es la Dirección Ejecutiva — suministras la materia prima (tráfico) y tomas decisiones de expansión. La tecnología hace el 90% de la ejecución.

ARSENAL ACTIVO (respuestas optimizadas + productos):
- arsenal_inicial: Identidad, WHY, historia, objeciones iniciales (37 respuestas)
- arsenal_avanzado: Objeciones complejas + Sistema + Valor + Escalación (17 respuestas)
- arsenal_reto: El Mapa de Salida v3.0 (7 respuestas)
- catalogo_productos: Catálogo completo + ciencia + perfiles (22 productos)
- arsenal_compensacion: Plan de compensación Ingreso Inmediato + Recurrente (38 respuestas)

LENGUAJE APROBADO (USAR):
- "Apalancamiento Asimétrico"
- "Demanda Biológica"
- "Tracción Inbound"
- "Ingreso Inmediato / Ingreso Recurrente"
- "Portabilidad Patrimonial"

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

PERSONALIDAD: Motor Cognitivo — tono de consultor senior de patrimonio. Preciso, sin hype, sin jerga MLM. Cada respuesta eleva la percepción del ecosistema.`;
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
    'contacto': 'contacto WhatsApp escalación constructor mentor equipo liderazgo',

    // Objeciones comunes
    'mlm': 'MLM multinivel pirámide legítimo diferenciación nueva categoría',
    'tiempo': 'tiempo dedicar automatización 90% trabajo estratégico apalancamiento',
    'experiencia': 'experiencia ventas arquitecto operador sistema formación',
    'confianza': 'confianza credibilidad legítimo real funciona resultados',

    // Sistema y valor
    'ganar': 'ganar cuánto realista modelo valor compensación ingresos',
    'distribución': 'distribución sistema canales infraestructura Gano Excel',
    'escalación': 'siguiente paso empezar contactar hablar equipo liderazgo',

    // Nuevo léxico Industrial Premium v19.0
    'impacto exponencial': 'cómo funciona Tridente EAM Expansión Activación Maestría proceso sistema método',
    'demanda biológica': 'productos Gano Excel fórmula exclusiva ventaja competitiva único',
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
    'Gano Excel', 'NEXUS', 'Constructor', 'activo', 'Queswa', 'aplicación',
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
// ── CORS: dominios externos autorizados a consumir este API ───────────────────
const ALLOWED_ORIGINS = [
  'https://ganocafe.online',
  'https://www.ganocafe.online',
  'https://creatuactivo.com',
  'https://www.creatuactivo.com',
  'https://luiscabrejo.com',
  'https://www.luiscabrejo.com',
  'https://queswa.app',
  'https://www.queswa.app',
];

function getCorsHeaders(origin: string | null): Record<string, string> {
  // 'null' string = local file:// testing (Chrome/Firefox envían origin: null desde file://)
  const allowed = (origin && (ALLOWED_ORIGINS.includes(origin) || origin === 'null'))
    ? origin
    : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, x-tenant-id',
    'Access-Control-Max-Age': '86400',
  };
}

export async function OPTIONS(req: Request) {
  const origin = req.headers.get('origin');
  return new Response(null, { status: 204, headers: getCorsHeaders(origin) });
}

export async function POST(req: Request) {
  const startTime = Date.now();
  const origin = req.headers.get('origin');

  // ── MULTI-TENANT v15.0: leer tenant inyectado por middleware.ts ──────────────
  // middleware.ts resuelve el dominio de origen y propaga x-tenant-id en <1ms
  // Valores: creatuactivo_marketing | marca_personal | queswa_dashboard | ecommerce
  // Para widgets externos (ganocafe.online) el tenant viene en el header x-tenant-id del widget
  const tenantId = req.headers.get('x-tenant-id') ?? 'creatuactivo_marketing';
  console.log(`🏢 [Tenant] ${tenantId}`);

  try {
    const { messages, sessionId, fingerprint, constructorId, consentGiven, isReturningUser, pageContext } = await req.json();

    // ✅ Validación de mensajes
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      console.error('❌ [NEXUS] Request inválido: messages vacío o undefined');
      return new Response(JSON.stringify({
        error: 'Request inválido: se requiere array de mensajes'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...getCorsHeaders(origin) }
      });
    }

    const latestUserMessage = messages[messages.length - 1].content;

    // 🔑 EXTRAER CONSTRUCTOR UUID + DATOS PROSPECTO + HISTORIAL + SYSTEM PROMPT — EN PARALELO
    // ⚡ OPTIMIZACIÓN: Ejecutar todas las llamadas independientes simultáneamente
    const constructorUUIDPromise = constructorId
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ? (getSupabaseClient().rpc as any)('get_constructor_uuid', { p_constructor_id: constructorId })
          .then(({ data, error }: any) => {
            if (error) console.error(`❌ [NEXUS] Error al buscar constructor "${constructorId}":`, error);
            else if (data) console.log(`✅ [NEXUS] Constructor encontrado: ${constructorId} → UUID: ${data}`);
            else console.warn(`⚠️ [NEXUS] Constructor no encontrado: ${constructorId}`);
            return data as string | null;
          })
          .catch((err: any) => { console.error('❌ [NEXUS] Error buscando constructor:', err); return null; })
      : Promise.resolve(null);

    const prospectPromise: Promise<{ data: any; error: any }> = fingerprint
      ? Promise.resolve(
          getSupabaseClient()
            .from('prospects')
            .select('id, device_info')
            .eq('fingerprint_id', fingerprint)
            .order('created_at', { ascending: false })
            .limit(1)
            .single()
        ).then(({ data, error }: any) => ({ data, error }))
         .catch(() => ({ data: null, error: null }))
      : Promise.resolve({ data: null, error: null });

    const conversationsPromise: Promise<{ data: any; error: any }> = fingerprint
      ? Promise.resolve(
          getSupabaseClient()
            .from('nexus_conversations')
            .select('messages, created_at')
            .eq('fingerprint_id', fingerprint)
            .order('created_at', { ascending: true })
            .limit(5) // ⚡ Reducido de 10 → 5 para menor latencia
        ).then(({ data, error }: any) => ({ data, error }))
         .catch((err: any) => { console.error('❌ [NEXUS] Error cargando historial:', err); return { data: null, error: err }; })
      : Promise.resolve({ data: null, error: null });

    const systemPromptPromise = getSystemPrompt(tenantId);

    // ⚡ Todas las llamadas de BD + system prompt corren en paralelo
    const t0 = Date.now();
    const [constructorUUID, prospectResult, conversationsResult, baseSystemPromptRaw] = await Promise.all([
      constructorUUIDPromise,
      prospectPromise,
      conversationsPromise,
      systemPromptPromise,
    ]);
    console.log(`⏱️ [TIMING] Promise.all BD: ${Date.now() - t0}ms`);

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

    // 🔵 DATOS DEL PROSPECTO — ya cargados en paralelo
    let existingProspectData: any = {};
    let prospectId: string | null = null;
    {
      const prospectRaw = prospectResult.data as { id: string; device_info: Record<string, unknown> } | null;
      if (prospectRaw && prospectRaw.device_info) {
        prospectId = prospectRaw.id;
        existingProspectData = prospectRaw.device_info;
        console.log('📊 [NEXUS] Datos existentes del prospecto:', {
          tiene_nombre: !!existingProspectData.name,
          tiene_email: !!existingProspectData.email,
          tiene_whatsapp: !!existingProspectData.whatsapp,
          tiene_archetype: !!existingProspectData.archetype,
          tiene_consentimiento: !!existingProspectData.consent_granted,
          consent_modal_shown_count: existingProspectData.consent_modal_shown_count || 0,
          consentGivenFromLocalStorage: consentGiven
        });
      } else {
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


    // 🧠 HISTORIAL DE CONVERSACIONES PREVIAS — ya cargado en paralelo
    let conversationSummary = '';

    if (fingerprint) {
      try {
        const { data: conversations, error: convError } = conversationsResult;

        if (convError) {
          console.error('❌ [NEXUS] Error cargando historial:', convError);
        } else if (conversations && conversations.length > 0) {
          console.log(`✅ [NEXUS] Historial encontrado: ${conversations.length} conversaciones previas`);
          try {
            // Generar resumen del historial para el System Prompt
            const summaryParts: string[] = [];

            conversations.forEach((conv: any, _index: number) => {
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

    console.log(`⏱️ [TIMING] Historial procesado: ${Date.now() - startTime}ms total`);

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

    // ⚡ ROUTER ANTICIPADO: Clasificar ANTES del vector search para saltarlo en queries simples
    const userMessageCount = messages.filter((m: any) => m.role === 'user').length;
    const isSimpleQueryEarly = (() => {
      // Para ecommerce (ganocafe.online): siempre hacer vector search.
      // Cualquier query puede ser sobre un producto — "el té", "algún cereal",
      // "jabón", "capuchino" — no hay queries "simples" en una tienda de productos.
      if (tenantId === 'ecommerce') return false;

      // M1/M2/M3 siempre Sonnet — turnos críticos donde el nombre, la situación y la
      // confirmación post-nombre definen el tono de toda la conversación.
      if (userMessageCount <= 3) return false;

      // Selección de paquete ESP → siempre Sonnet (Estado 3 del cierre requiere texto verbatim)
      // Verificamos tanto el paquete previo (BD) como el mensaje actual (el captureProspectData
      // corre después del router, así que este mensaje puede ser la primera mención del paquete)
      if (mergedProspectData.package) return false;

      const msg = latestUserMessage.toLowerCase().trim();
      if (/\besp[-\s]?[123]\b|visionario|empresarial|el inicial|el de mil|1[.,]000\s*usd|\$1[.,]000|\$500|\$200/i.test(msg)) return false;
      const wordCount = msg.split(/\s+/).length;
      // Primer mensaje real del usuario → Sonnet (MENSAJE 1 es el momento de marca más crítico)
      if (userMessageCount === 1) return false;
      // Saludos terminales simples (no señales de avance conversacional)
      // REMOVIDO: "de acuerdo" — es señal de aceptación del pitch → requiere WHY_02 (Sonnet)
      if (/^(hola|buenas|hey|hi|buenos|saludos|gracias|👋|😊)[\s!.?]*$/i.test(msg)) return true;
      // Mensajes muy cortos sin intención de compra ni avance conversacional
      // EXPANDIDO: gana/ganas/ganar, iniciar/inicio/empezar cubren queries de ingreso y cierre
      if (wordCount <= 3 && !/precio|costo|cuánto|paquete|invertir|gana|ganar|negocio|unirme|iniciar|inicio|empezar|empiezo|cómo|funciona/i.test(msg)) return true;
      return false;
    })();

    console.log(`⏱️ [TIMING] captureProspectData: ${Date.now() - startTime}ms total`);
    console.log(`⚡ [ROUTER EARLY] ${isSimpleQueryEarly ? 'SIMPLE → skip vector search' : 'COMPLEJA → vector search'} (userMsg #${userMessageCount}, "${latestUserMessage.substring(0, 40)}")`);

    // Early FSM check: skip Voyage AI cuando estamos en flujo de cierre (estados 1/2/3)
    // El arsenal no se usa en esos estados — evita el round-trip innecesario a Voyage AI (~300ms)
    const isClosingFlowEarly = (() => {
      // ── DETECCIÓN POST-ESTADO 3 ──────────────────────────────────────────────
      // Si Estado 3 ya fue entregado en esta conversación, el prospecto puede seguir
      // haciendo preguntas (precios, compensación, productos). Permitir flujo normal.
      const botMsgs = messages.filter((m: any) => m.role === 'assistant');
      const estadoTresYaEntregado = botMsgs.some((m: any) =>
        /He consolidado tu expediente|WhatsApp Directo de Activación|mesa directiva|privilegio orquestar/i.test(m.content || '')
      );
      if (estadoTresYaEntregado) return false; // Estado 3 ya entregado → flujo normal

      if (mergedProspectData.package) return true; // Estado 3 pendiente: paquete elegido pero no entregado aún
      const lastBotMsg: string = botMsgs[botMsgs.length - 1]?.content || '';
      if (/ancho de banda operativo|horas a la semana|cuántas horas/i.test(lastBotMsg)) return true; // Estado 1→2
      // FIX: Solo señales de INTENCIÓN DE COMPRA activan el FSM — NO preguntas informativas.
      // "los paquetes / cuánto cuesta el ESP-2" → necesitan RAG (arsenal_compensacion).
      // "cuánto cuesta empezar / qué necesito poner" → intención de iniciar → FSM correcto.
      if (/cu[aá]nto\s*(cuesta|vale|es)\s*(iniciar|entrar|empezar|activar)|cu[aá]nto\s*hay\s*que\s*(invertir|poner|meter)|qu[eé]\s*necesito\s*(invertir|poner|para\s+iniciar|para\s+empezar)/i.test(latestUserMessage)) return true;
      if (/cómo inicio|como inicio|quiero (iniciar|empezar|comenzar|activar|entrar)|deseo iniciar|deseo empezar|me anoto|listo para iniciar|cuál es el primer paso|qué hago primero|guíame|sigamos|avancemos|iniciemos|ok adelante|vamos|estoy listo|cómo procedo|cómo empiezo|donde (pago|inicio|entro|me registro)|dónde (pago|inicio|entro)|quiero activar|me interesa iniciar/i.test(latestUserMessage)) return true;
      return false;
    })();
    if (isClosingFlowEarly) {
      console.log(`🔀 [FSM EARLY] Flujo de cierre detectado — Voyage AI suprimido`);
    }

    // 🔍 Detectar si pide precios — declarado aquí para uso en bypass y sessionInstructions
    const lastUserMessageForPrices = latestUserMessage.toLowerCase();
    const pideListaPreciosEarly = /^precios?$|lista.*precio|todos.*los.*precio|precios.*producto|catálogo.*precio|dame.*los.*precio|cuáles.*son.*los.*precio|22.*producto|lista.*completa|cu[aá]nto.*cuesta|cu[aá]nto.*vale|cu[aá]nto.*son|cu[aá]nto.*cobran|qu[eé].*precio|precios.*cat[aá]logo|ver.*precios?|mostrar.*precios?/i.test(lastUserMessageForPrices);
    console.log(`🚨 DETECCIÓN PRECIOS: pideListaPreciosEarly=${pideListaPreciosEarly}, msg="${lastUserMessageForPrices.substring(0, 50)}"`);

    // CONSULTA HÍBRIDA ESCALABLE — solo para queries complejas y fuera del flujo de cierre
    let relevantDocuments: any[] = [];

    // ⚡ BYPASS PRECIOS: cualquier query de precios → COMP_PV_06 directamente
    // Evita que "precios", "cuánto cuestan" etc. vayan al vector search y recuperen
    // documentos de compensación o paquetes en vez del catálogo con precios COP
    const isPreciosQuery = pideListaPreciosEarly && tenantId !== 'ecommerce';
    if (isPreciosQuery) {
      console.log('📊 [BYPASS PRECIOS] Query de precios → COMP_PV_06 directo');
      const allFrags = await getArsenalFragments();
      const pvFrag = allFrags.find(f => f.category === 'arsenal_compensacion_COMP_PV_06');
      if (pvFrag) {
        relevantDocuments = [{
          id: 'arsenal_compensacion_COMP_PV_06',
          title: 'Tabla completa PV, CV y Precio — 22 productos vigente 2026',
          content: pvFrag.content,
          category: 'arsenal_compensacion',
          metadata: { is_pv_table: true },
          source: '/knowledge_base/arsenal_compensacion.txt',
          search_method: 'comp_pv06_direct'
        }];
        console.log('✅ [BYPASS PRECIOS] COMP_PV_06 cargado correctamente');
      }
    }

    if (!isPreciosQuery && !isSimpleQueryEarly && !isClosingFlowEarly) {
      if (tenantId === 'ecommerce') {
        // ── TENANT ECOMMERCE (ganocafe.online) ──────────────────────────────────
        // Siempre usar arsenal_ganocafe — ignora clasificación de creatuactivo
        console.log('🛒 [GanoCafe] Routing directo a arsenal_ganocafe');
        const gcFragments = await searchArsenalFragments(latestUserMessage, 'arsenal_ganocafe', 5);
        if (gcFragments.length > 0) {
          const gcContent = gcFragments.map(f => f.content).join('\n\n---\n\n');
          console.log(`✅ [GanoCafe] ${gcFragments.length} fragmentos encontrados`);
          relevantDocuments = [{
            id: 'arsenal_ganocafe_fragments',
            title: 'Arsenal GanoCafe — fragmentos relevantes',
            content: gcContent,
            category: 'arsenal_ganocafe',
            metadata: { is_fragment_result: true, fragment_count: gcFragments.length },
            search_method: 'fragment_vector_search'
          }];
        } else {
          // Fallback: cargar arsenal completo si no hay fragmentos
          console.log('⚠️ [GanoCafe] Sin fragmentos, usando arsenal completo');
          const { data: gcData } = await getSupabaseClient()
            .from('nexus_documents')
            .select('id, title, content, category, metadata')
            .eq('category', 'arsenal_ganocafe')
            .limit(1);
          if (gcData && gcData.length > 0) {
            relevantDocuments = (gcData as any[]).map(doc => ({
              ...doc,
              search_method: 'full_arsenal_fallback'
            }));
          }
        }
      } else {
        const searchQuery = interpretQueryHibrido(latestUserMessage);
        console.log('Query híbrido generado:', searchQuery);
        relevantDocuments = await consultarArsenalHibrido(searchQuery, latestUserMessage);
        console.log(`Arsenal híbrido: ${relevantDocuments.length} documentos encontrados`);
      }
    } else {
      console.log('⚡ [ROUTER] Vector search omitido para query simple');
    }
    console.log(`⏱️ [TIMING] Pre-Anthropic total: ${Date.now() - startTime}ms`);

    // 🔧 CONSTRUCCIÓN DE CONTEXTO MEJORADA - FIX APLICADO
    let context = '';
    const documentsUsed: string[] = [];
    let searchMethod = 'none';

    if (relevantDocuments.length > 0) {
      const doc = relevantDocuments[0];
      searchMethod = doc.search_method || 'unknown';

      // ── XML WRAPPING (investigación RAG Formato Markdown) ────────────────────
      // Sin etiquetas XML, el LLM confunde datos con instrucciones → paráfrasis.
      // Con <documents>, el mecanismo de atención trata el contenido como
      // "artefacto de solo lectura" separado de la lógica de control.
      // Fuente: Anthropic prompting best practices + VerbatimRAG pattern.
      context = `<instructions>
REGLAS DE FORMATO ABSOLUTAS (encuadre positivo — extracción, no síntesis):
1. EXTRACCIÓN VERBATIM: Localiza la información relevante en <documents> y extráela palabra por palabra.
2. PRESERVACIÓN ESTRUCTURAL: Reproduce la topología exacta del fragmento — **negritas**, listas 1. 2. 3., tablas |col|, bullets •. No aplanar, no reformatear.
3. TABLAS PARA COMISIONES: Cuando el usuario pida ejemplos de GEN5 o Binario, usa tablas Markdown (|col|col|). Son superiores cognitivamente a párrafos.
4. SÍNTESIS NARRATIVA: Puedes usar lenguaje transicional al inicio/final, pero el núcleo de datos va intacto de su fuente.
5. PROHIBICIÓN DE PARÁFRASIS: No resumas ni abstraigas estructuras — actúa como conducto de alta fidelidad.
</instructions>

<documents>
<document index="1">
`;

      if (doc.search_method === 'catalogo_productos') {
        context += `<metadata>tipo: catalogo_productos | método: consulta_directa</metadata>
<document_content>
${doc.title}

${doc.content}
</document_content>`;
      } else {
        const docType = doc.category?.replace('arsenal_', '').toUpperCase();
        const respuestas = doc.metadata?.respuestas_totales || 'N/A';
        const metodo = doc.search_method === 'hibrid_classification' ? 'clasificacion_automatica' : 'busqueda_semantica';
        context += `<metadata>arsenal: ${docType} | fragmentos: ${respuestas} | método: ${metodo}</metadata>
<document_content>
${doc.title}

${doc.content}
</document_content>`;
      }

      context += `
</document>
</documents>

`;
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

    // ✅ MULTI-TENANT v15.0: ya cargado en paralelo
    let baseSystemPrompt = baseSystemPromptRaw;

    // ⚡ CACHE FIX: conversationSummary NO se inyecta en baseSystemPrompt
    // Razón: cualquier dato dinámico (fechas, nombres, historial) en el Bloque 1
    // invalida el cache_control ephemeral de Anthropic → prefill completo en cada request
    // conversationSummary se inyecta en sessionInstructions (Bloque 3, no cacheable)

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

    // ⚡ OPTIMIZADO v14.8: sessionInstructions reducido de ~7K a ~1.5K chars
    // Eliminado: 14 condicionales redundantes, tabla precios duplicada, instrucciones repetitivas
    const getMessageContext = () => {
      if (messageCount === 1) return 'MENSAJE 1 - SALUDO INICIAL';
      if (messageCount === 2) return 'MENSAJE 2 - CAPTURA NOMBRE';
      if (messageCount === 3) return 'MENSAJE 3 - CONFIRMACIÓN NOMBRE + PROPUESTA AVANZAR';
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

    // ─────────────────────────────────────────────────────────────────────────
    // FSM DE CIERRE — ARQUITECTURA BASADA EN INVESTIGACIÓN
    //
    // PRINCIPIO (Investigación "Máquinas de Estado Conversacional"):
    //   El LLM actúa como procesador semántico, NO como tomador de decisiones.
    //   El backend (este código) detecta y controla el estado — no el model.
    //   Patrón: Graph Prompting (Bland AI / 11x.ai / Salesforce Atlas)
    //   Cada estado recibe SOLO el micro-prompt de su nodo. El modelo es
    //   "localmente omnisciente pero globalmente ignorante" — no puede alucinar
    //   pasos que no existen en su topología inmediata.
    //
    // ESTADOS:
    //   0 = conversación normal
    //   1 = trigger detectado → preguntar horas (Estado 1)
    //   2 = horas recibidas → presentar tabla ESP (Estado 2)
    //   3 = paquete elegido → handoff WhatsApp (Estado 3) ← ya funcionaba
    // ─────────────────────────────────────────────────────────────────────────

    // ── DETECCIÓN DE closing_state POR CÓDIGO ────────────────────────────────
    // Lee el historial de mensajes — el LLM no decide el estado, el código sí.
    // `directPaquetes`: true cuando llegamos a Estado 2 sin pasar por Estado 1 (horas).
    // Cuando es true, el micro-prompt de Estado 2 NO menciona horas (nadie las declaró).
    const { closingState, directPaquetes } = (() => {
      // ── POST-ESTADO 4: si el link WA ya fue entregado esta sesión → flujo normal ──
      const allBotMsgs = messages.filter((m: any) => m.role === 'assistant');
      const waLinkEntregado = allBotMsgs.some((m: any) =>
        /He consolidado tu expediente|WhatsApp Directo de Activación|mesa directiva|privilegio orquestar/i.test(m.content || '')
      );
      if (waLinkEntregado) return { closingState: 0 as const, directPaquetes: false };

      // Estado 4: Estado 3 (solicitud de nombre) ya entregado → entregar link WA
      const nombreSolicitado = allBotMsgs.some((m: any) =>
        /bajo qu[eé] nombre|registrar.*evaluaci[oó]n|ensamblar.*expediente|expediente de activaci[oó]n/i.test(m.content || '')
      );
      if (nombreSolicitado && mergedProspectData.package) return { closingState: 4 as const, directPaquetes: false };

      // Estado 3: paquete elegido → solicitar nombre (White-Glove, flujo 2-pasos)
      if (mergedProspectData.package) return { closingState: 3 as const, directPaquetes: false };

      const botMessages = messages.filter((m: any) => m.role === 'assistant');
      const lastBotMessage: string = botMessages[botMessages.length - 1]?.content || '';
      const currentUserMsg = latestUserMessage.toLowerCase().trim();

      // Estado 2: el último mensaje del bot fue el Estado 1 (pregunta de horas)
      const botPreguntóHoras = /ancho de banda operativo|horas a la semana|cuántas horas|horas.*semana|semana.*horas/i.test(lastBotMessage);
      if (botPreguntóHoras) {
        const horasMatch = currentUserMsg.match(/\b([1-9]|1[0-9]|20)\b.*h(ora|r)?s?|(\d+)\s*h/i)
          || currentUserMsg.match(/^(\d{1,2})$/)
          || /puedo|tengo|dispongo|asigno|dedico/i.test(currentUserMsg);
        if (horasMatch || /\d/.test(currentUserMsg)) {
          console.log('🔀 [FSM] closing_state=2 detectado — bot preguntó horas, usuario respondió con número');
          return { closingState: 2 as const, directPaquetes: false };
        }
        console.log('🔀 [FSM] closing_state=1 sostenido — bot preguntó horas, usuario no dio número');
        return { closingState: 1 as const, directPaquetes: false };
      }

      // Estado 2 directo: el usuario pregunta por los paquetes sin haber pasado por Estado 1
      const triggerPaquetes = /háblame de (los )?paquetes|cuáles son los paquetes|los paquetes|qué paquetes|paquetes disponibles|opciones de (inversión|paquete|entrada|capitalización)|cuánto (cuesta|vale|es) (iniciar|entrar|empezar|activar|el paquete)|cuánto hay que (invertir|poner|meter)|qué necesito (invertir|poner)/i;
      if (triggerPaquetes.test(latestUserMessage)) {
        console.log('🔀 [FSM] closing_state=2 directo — usuario pregunta por paquetes (sin Estado 1)');
        return { closingState: 2 as const, directPaquetes: true };
      }

      // Estado 1: trigger de intención de iniciar
      const triggerInicio = /cómo inicio|como inicio|quiero (iniciar|empezar|comenzar|activar|entrar)|deseo iniciar|deseo empezar|me anoto|listo para iniciar|cuál es el primer paso|qué hago primero|guíame|guia me|guíame paso|sigamos|avancemos|iniciemos|ok adelante|vamos|estoy listo|cómo procedo|cómo empiezo|donde (pago|inicio|entro|me registro)|dónde (pago|inicio|entro)|quiero activar|me interesa iniciar/i;
      if (triggerInicio.test(latestUserMessage)) {
        console.log('🔀 [FSM] closing_state=1 detectado — trigger de inicio en mensaje del usuario');
        return { closingState: 1 as const, directPaquetes: false };
      }

      return { closingState: 0 as const, directPaquetes: false };
    })();
    console.log(`🔀 [FSM] closing_state=${closingState} | package="${mergedProspectData.package || 'none'}" | msg="${latestUserMessage.substring(0, 40)}"`);

    // ── MICRO-PROMPTS POR ESTADO (Graph Prompting) ───────────────────────────
    // Cada estado recibe SOLO las instrucciones de su nodo.
    // El modelo no conoce los estados vecinos → imposible alucinar pasos futuros.
    const nombre = mergedProspectData.name || 'prospecto';

    const getMicroPromptCierre = (): string => {
      if (closingState === 1) {
        return `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 ESTADO 1 — VALIDACIÓN DE ARRANQUE
Tu única tarea en este turno: hacer UNA sola pregunta sobre disponibilidad de tiempo.
Imprime EXACTAMENTE este texto (reemplaza [NOMBRE] con "${nombre}"):

${nombre}, perfecto. La postura directiva es la correcta. Tu paso inmediato es una Validación de Arranque rápida. La primera variable es tu ancho de banda operativo: ¿cuántas horas a la semana puedes asignar con total enfoque para orquestar este activo? (Sugerimos de 7 a 10 horas).

STOP. No agregues nada más. No ofrezcas opciones. No expliques el sistema. Espera la respuesta.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;
      }

      if (closingState === 2) {
        // Cuando llegamos directamente desde una pregunta por paquetes (sin Estado 1),
        // el usuario NO declaró horas — omitir cualquier referencia a tiempo.
        const apertura = directPaquetes
          ? `La variable clave es tu nivel de capitalización.`
          : `Ese ancho de banda es exacto para traccionar. La segunda y última variable es tu nivel de capitalización.`;
        return `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 ESTADO 2 — CAPITALIZACIÓN
Tu única tarea: presentar la tabla de niveles. Imprime EXACTAMENTE este texto:

${apertura} Tu capital se respalda 100% en inventario inicial de tecnología nutricional premium, activando tus derechos operativos. Tienes tres niveles:

• **ESP-3 Visionario:** $1,000 USD — 17% de rentabilidad sobre el consumo de la infraestructura (máxima velocidad)

• **ESP-2 Empresarial:** $500 USD — 16% de rentabilidad

• **ESP-1 Inicial:** $200 USD — 15% de rentabilidad

Evaluando tu flujo de caja, ¿con cuál de estos niveles deseas habilitar tu posición?

STOP. No pidas correo, nombre, país ni ningún otro dato. No expliques el onboarding. Espera que elija un nivel.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;
      }

      if (closingState === 3) {
        const paquete = mergedProspectData.package || 'seleccionado';
        return `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 ESTADO 3 — SOLICITUD DE NOMBRE (Guante Blanco)
Tu única tarea en este turno: confirmar la elección y pedir el nombre. Imprime EXACTAMENTE:

Excelente decisión. El nivel ${paquete} es la postura correcta para máxima tracción.

Para ensamblar su expediente de activación, ¿bajo qué nombre debo registrarlo?

STOP. No preguntes correo, teléfono ni ciudad. No expliques el proceso de onboarding. Espera el nombre.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;
      }

      return '';
    };

    // ── ESTADO 4: Handoff verbatim con nombre real capturado ─────────────────
    const getCierreEstado4 = (): string => {
      if (closingState !== 4 || !mergedProspectData.package) return '';
      const paquete = mergedProspectData.package;
      const paqueteEncoded = encodeURIComponent(paquete);

      // Prioridad: (1) nombre de la respuesta actual (directa a "¿bajo qué nombre?"),
      // (2) nombre en BD si no es una ocupación, (3) sin nombre
      const nombreDesdeRespuesta = extractNameFromHandoffReply(latestUserMessage);
      const occupationCheck = /^(empleo|empleado|empleada|trabajo|trabajador|trabajadora|comerciante|empresario|empresaria|ingeniero|ingeniera|m[eé]dico|m[eé]dica|doctor|doctora|abogado|abogada|profesor|profesora|docente|freelance|freelancer|independiente|estudiante|pensionado|pensionada|jubilado|jubilada|gerente|director|directora|consultor|consultora|vendedor|vendedora|contador|contadora|administrador|administradora|jefe|l[ií]der|lider|CEO|CFO|CTO)$/i;
      const existingNameIsValid = mergedProspectData.name && !occupationCheck.test(mergedProspectData.name);
      const nombreFinal = nombreDesdeRespuesta || (existingNameIsValid ? mergedProspectData.name : '');

      const waText = nombreFinal
        ? `Hola%20equipo%20directivo.%20Soy%20${encodeURIComponent(nombreFinal)}.%20He%20completado%20mi%20auditoria%20con%20Queswa%20y%20autorizo%20mi%20activacion%20con%20el%20inventario%20${paqueteEncoded}.`
        : `Hola%20equipo%20directivo.%20He%20completado%20mi%20auditoria%20con%20Queswa%20y%20autorizo%20mi%20activacion%20con%20el%20inventario%20${paqueteEncoded}.`;

      console.log(`🎯 [ESTADO 4] nombre="${nombreFinal || '(sin nombre)'}" paquete="${paquete}"`);

      return `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 ESTADO 4 — HANDOFF GUANTE BLANCO (paquete: ${paquete}${nombreFinal ? `, nombre: ${nombreFinal}` : ', sin nombre'})
Tu única tarea: imprimir EXACTAMENTE el texto de abajo. Sin agregar ni un carácter extra.

${nombreFinal ? `Gracias, ${nombreFinal}.` : ''} Su expediente está consolidado.

Dado nuestro estándar operativo, no lidiarás con formularios burocráticos. Nuestro equipo asume la fricción administrativa.

He consolidado tu expediente. Tu único paso ahora es hacer clic en el siguiente enlace para enviar tu orden pre-aprobada directamente a la Dirección y recibir tu acceso:

[📲 **WhatsApp Directo de Activación**](https://wa.me/573215193909?text=${waText})

Bienvenido a la mesa directiva. Ha sido un privilegio orquestar tu evaluación.

STOP. Sin preguntas de seguimiento. Sin cálculos. Sin pasos adicionales.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;
    };

    // ── SUPRESIÓN DE RAG EN CIERRE (Investigación: "RAG para lógica de procesos es letal") ──
    // Durante estados 1 y 2, el contexto del arsenal se reemplaza por string vacío.
    // El modelo no puede recuperar instrucciones de onboarding/KYC si no están en su contexto.
    const arsenalParaCierre = (closingState === 1 || closingState === 2 || closingState === 3 || closingState === 4)
      ? '// Flujo de cierre activo — contexto de arsenal suspendido para este turno.'
      : arsenalContext;

    // ── INYECCIÓN DE CIFRAS GEN5 VERIFICADAS (anti-alucinación financiera) ──────
    // Cuando el usuario pregunta sobre ingreso inmediato / cuánto se gana / GEN5,
    // inyectamos las cifras exactas del plan de compensación directamente en Bloque 3.
    // Patrón: mismo que getCierreEstado3 — código controla los números, no el LLM.
    const getPinCifrasGEN5 = (): string => {
      // Disparar si la query es sobre cifras/ganancias O si el doc recuperado es de compensación
      const esDocCompensacion = relevantDocuments[0]?.category === 'arsenal_compensacion'
        || relevantDocuments[0]?.category?.startsWith('arsenal_compensacion');
      const preguntaSobreCifras = /cu[aá]nto\s*(gano|gana|se\s+gana|cobra|genera)|ingreso\s*inmediato|\bgen[\s.-]?5\b|bono.*gen|comisi[oó]n.*esp|cu[aá]nto.*paga|ejemplo.*n[uú]mero|n[uú]meros.*reales|cifras|cu[aá]nto.*entrada|cu[aá]nto.*primera|ganancia.*persona|cu[aá]nto\s*(se\s*)?gana|ingresos\s*(del\s*)?negocio|c[oó]mo\s*(se\s*)?gana|numbers|proyecto.*ingreso/i;
      if (!esDocCompensacion && !preguntaSobreCifras.test(latestUserMessage)) return '';
      return `
📌 CIFRAS VERIFICADAS GEN5 — USA SOLO ESTOS NÚMEROS (fuente: plan de compensación oficial):
Ingreso Inmediato se llama "Bono GEN5". Solo aplica con Paquetes Empresariales (ESP-1/2/3).
• ESP-3 Visionario ($1,000 USD): Gen1=$150 | Gen2=$20 | Gen3=$20 | Gen4=$20 | Gen5=$40
• ESP-2 Empresarial ($500 USD):  Gen1=$75  | Gen2=$10 | Gen3=$10 | Gen4=$10 | Gen5=$20
• ESP-1 Inicial ($200 USD):      Gen1=$25  | Gen2=$5  | Gen3=$5  | Gen4=$5  | Gen5=$10
El pago es semanal cada viernes. PROHIBIDO inventar cifras distintas a las anteriores.`;
    };

    // ── TABLA DE COMISIONES (investigación: tablas > párrafos para comprensión cognitiva)
    const getTablasComisiones = (): string => {
      // Disparar cuando: se pide ejemplo explícito, O el doc recuperado es de compensación GEN5/Binario
      const esDocCompensacion = relevantDocuments[0]?.category === 'arsenal_compensacion'
        || relevantDocuments[0]?.category?.startsWith('arsenal_compensacion');
      const pideEjemploComision = /ejemplo.*(gen5?|binario|velocidad|comisi|ingreso|gana)|dame.*(gen5?|binario|velocidad|n[uú]mero|cifra|cu[aá]nto)|gen5?.*(ejemplo|gr[aá]fico|n[uú]mero)|binario.*(ejemplo|gr[aá]fico|n[uú]mero)/i.test(latestUserMessage);
      const esConsultaCompensacion = esDocCompensacion && /gen[\s.-]?5|binario|bono|comisi[oó]n|ingreso\s*(inmediato|recurrente)|cu[aá]nto\s*(gano|se\s*gana|paga)|ganancias|n[uú]meros/i.test(latestUserMessage);
      if (!pideEjemploComision && !esConsultaCompensacion && closingState !== 2) return '';
      return `
📊 FORMATO TABLA OBLIGATORIO para GEN5 y Binario. Reglas:

GEN5 — usa exactamente esta estructura (adapta números al caso):
| Generación | ESP-3 ($1,000) | ESP-2 ($500) | ESP-1 ($200) |
|---|---|---|---|
| Gen 1 (directo) | $150 USD | $75 USD | $25 USD |
| Gen 2 | $20 USD | $10 USD | $5 USD |
| Gen 3 | $20 USD | $10 USD | $5 USD |
| Gen 4 | $20 USD | $10 USD | $5 USD |
| Gen 5 (100+ PV) | $40 USD | $20 USD | $10 USD |

BINARIO — usa exactamente esta estructura (tabla de COMP_BIN_02):
| Paquete | Cálculo | Comisión Semanal |
|---|---|---|
| Kit Inicio | CV × 10% × $1 | ejemplo USD |
| ESP-3 | CV × 17% × $1 | ejemplo USD |

🚫 PROHIBIDO en Binario: NO añadas columnas de "Ingreso Mensual", "Ingreso Anual" ni filas con múltiples volúmenes (5,000/10,000/15,000 CV) a menos que el usuario las pida explícitamente. Una tabla simple de 2-3 filas es suficiente.
🚫 PROHIBIDO en GEN5: NO uses árboles ASCII ni diagramas jerárquicos. Solo tablas Markdown.`;
    };

    const sessionInstructions = `
📍 ${getMessageContext()}
${getPageContextInstructions()}
${getMicroPromptCierre()}
${getCierreEstado4()}
${getPinCifrasGEN5()}
${getTablasComisiones()}
${conversationSummary}<prospect_state>
${mergedProspectData.name ? `  <nombre>${mergedProspectData.name}</nombre>` : '  <nombre>no_capturado</nombre>'}
${mergedProspectData.archetype ? `  <arquetipo>${mergedProspectData.archetype}</arquetipo>` : ''}
${mergedProspectData.phone ? `  <whatsapp_confirmado>${mergedProspectData.phone}</whatsapp_confirmado>` : ''}
${mergedProspectData.interest_level ? `  <nivel_interes>${mergedProspectData.interest_level}_de_10</nivel_interes>` : ''}
  <turno_actual>${interaccionActual}</turno_actual>
  <estado_fsm>${closingState}</estado_fsm>
</prospect_state>

${relevantDocuments[0]?.metadata?.is_pv_table ? `📊 TABLA OFICIAL PRECIOS — COMP_PV_06: Copia la tabla EXACTAMENTE como aparece en el contexto. NO inventes categorías ni nombres de sección ("Cafés con Ganoderma", "Bebidas Premium", etc.) — esas categorías no existen en la tabla oficial. NO uses precios de tu entrenamiento. Los precios correctos para Colombia 2026 están en la columna "Precio COP" del contexto recuperado.` : relevantDocuments[0]?.category === 'catalogo_productos' ? `🛒 CATÁLOGO ACTIVO: Presenta SOLO los productos y categorías que aparecen en el fragmento recuperado. No inventes categorías, no agregues productos que no estén en el texto, no estimes precios. Copia los precios COP exactamente como aparecen en las tablas.` : ''}
${/paquete|esp[-\s]?[123]|inversi[oó]n.*paquete|precio.*paquete|cu[aá]nto.*paquete|paquete.*empresar|conformad[ao]s?|c[oó]mo\s+(se\s+)?(inici[ao]|empies[ao]|empiez[ao])|para\s+(empezar|iniciar|activar|entrar)|c[oó]mo.*empez/i.test(latestUserMessage) ? `💰 PAQUETES — PRECIOS OFICIALES 2026 (BLINDADO ANTI-ALUCINACIÓN):
• ESP-1 Inicial = $200 USD / $900,000 COP (NO $250 USD — ese precio no existe)
• ESP-2 Empresarial = $500 USD / $2,250,000 COP
• ESP-3 Visionario = $1,000 USD / $4,500,000 COP
SIEMPRE muestra precio en AMBAS monedas. NUNCA uses precios de tu entrenamiento. Los precios de entrenamiento son INCORRECTOS (datos 2023).` : ''}
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
    console.log('📝 Arsenal context length:', arsenalParaCierre.length, 'chars', closingState > 0 ? `[FSM state=${closingState}]` : '');
    console.log('📝 Session instructions length:', sessionInstructions.length, 'chars');

    console.log('Enviando request Claude con contexto híbrido + CACHE...');

    // ⚡ FASE 1 - OPTIMIZACIÓN: max_tokens dinámico según tipo de consulta
    // FIX 2025-12-08: Regex específico para lista COMPLETA (no precios individuales)
    const lastUserMessage = messages[messages.length - 1]?.content?.toLowerCase() || '';
    const pideListaPrecios = /lista.*precio|todos.*los.*precio|precios.*producto|catálogo.*precio|dame.*los.*precio|cuáles.*son.*los.*precio|22.*producto|lista.*completa/i.test(lastUserMessage);

    console.log(`🔍 DEBUG PRECIOS: mensaje="${lastUserMessage.substring(0, 80)}", detectado=${pideListaPrecios}`);

    // ⚡ v17.5.0: Tokens aumentados para respuestas más cálidas y completas
    const pideTablaCVPV = /\bcv\b.*\bpv\b|\bpv\b.*\bcv\b|tabla.*(?:cv|pv)|todos.*(?:cv|pv)|(?:cv|pv).*todos/i.test(lastUserMessage);
    const esCatalogoCompleto = searchMethod === 'price_table_fragments' || searchMethod === 'category_direct' || searchMethod === 'comp_pv06_direct';
    const maxTokens = searchMethod === 'comp_pv06_direct'
      ? 1200  // COMP_PV_06: tabla 22 filas + 2 ejemplos de activación
      : pideTablaCVPV
      ? 1200  // Tabla CV/PV (22 filas)
      : pideListaPrecios || esCatalogoCompleto
      ? 1500  // Lista completa 22 productos (4 tablas por categoría)
      : searchMethod === 'paquete_direct'
      ? 1200  // Paquetes: tabla comparativa + composición ESP-1/2/3
      : searchMethod === 'catalogo_productos'
      ? 600   // Consulta de producto individual
      : prospectData.momento_optimo === 'caliente'
      ? 700
      : 700;

    console.log(`⚡ max_tokens dinámico: ${maxTokens} (${searchMethod}, pideListaPrecios=${pideListaPrecios})`);

    // 🧠 MEMORIA A LARGO PLAZO: Usar solo mensajes de sesión actual
    // El historial se inyecta como RESUMEN en el System Prompt (no como mensajes)
    const recentMessages = messages.length > 6 ? messages.slice(-6) : messages;
    console.log(`⚡ Mensajes de sesión actual: ${recentMessages.length} (últimos 3 intercambios)`);

    // ⚡ FASE 2 — HAIKU ROUTER: Usar clasificación anticipada (ya calculada antes del vector search)
    // FIX: Si isClosingFlowEarly=true, SIEMPRE usar Sonnet — el FSM (getMicroPromptCierre)
    // solo existe en el path Sonnet (Bloque 3 sessionInstructions). Haiku no lo recibe nunca.
    const isSimpleQuery = isClosingFlowEarly ? false : isSimpleQueryEarly;

    // ⚡ HAIKU PROMPT: misma personalidad Queswa, condensada para velocidad
    // Incluye conversationSummary para que recuerde usuarios previos
    const conoceAlUsuario = !!(mergedProspectData.name);
    const HAIKU_SYSTEM_PROMPT = `Queswa — Arquitecto de Infraestructura, CreaTuActivo.com.

TONO: Directo, confiado, sin jerga informal. Sin "compa", sin "¡Qué tal!", sin emojis de fuerza. Máximo 2-3 oraciones.

REGLAS:
- Siempre en español, tutea al usuario
- ${conoceAlUsuario ? `El usuario se llama ${mergedProspectData.name}. Respóndele por nombre de forma breve.` : 'Responde de forma breve y directa a lo que preguntó.'}
- Si pregunta algo técnico sin contexto previo: "Buena pregunta. Para calibrar bien la respuesta, ¿cuál es tu situación hoy?"
- Nunca menciones que eres IA o chatbot
- Vocabulario: Arquitecto, Infraestructura, Activo, Plan por Defecto, Máquina Híbrida

${conversationSummary ? `MEMORIA: ${conversationSummary.substring(0, 300)}` : ''}
ESTADO: ${getMessageContext()}`;

    console.log(`⚡ [ROUTER] Query clasificada como: ${isSimpleQuery ? 'SIMPLE → Haiku' : 'COMPLEJA → Sonnet'} (msg #${messages.length}, "${latestUserMessage.substring(0, 40)}")`);

    // ✅ Generar respuesta con Claude usando Prompt Caching + Optimizaciones FASE 1 + FASE 1.5
    const response = await anthropic.messages.create({
      model: isSimpleQuery ? 'claude-haiku-4-5-20251001' : 'claude-sonnet-4-20250514',
      system: isSimpleQuery
        // Haiku: prompt corto ~300 chars, TTFT ~0.6s, sin overhead de cache
        ? HAIKU_SYSTEM_PROMPT
        // Sonnet: 3 bloques con prompt caching, respuesta completa
        : [
            // 🎯 BLOQUE 1: Base System Prompt (CACHEABLE - ~15K chars)
            {
              type: 'text' as const,
              text: baseSystemPrompt,
              cache_control: { type: 'ephemeral' as const }
            },
            // 🎯 BLOQUE 2: Arsenal/Catálogo Context (CACHEABLE - ~2-8K chars)
            // Durante cierre estados 1/2: RAG suprimido para evitar contaminación KYC
            {
              type: 'text' as const,
              text: arsenalParaCierre,
              cache_control: { type: 'ephemeral' as const }
            },
            // 📝 BLOQUE 3: Session Instructions (NO CACHEABLE - siempre cambia)
            {
              type: 'text' as const,
              text: sessionInstructions
            }
          ],
      stream: true,
      max_tokens: maxTokens,
      temperature: 0.65,            // Haiku y Sonnet no aceptan temperature + top_p juntos
      messages: recentMessages,
    });

    // ⚡ LOG DE CACHÉ: Verificar si Anthropic está usando prompt cache
    const cacheReadTokens = (response as any).usage?.cache_read_input_tokens ?? 0;
    const cacheCreationTokens = (response as any).usage?.cache_creation_input_tokens ?? 0;
    const inputTokens = (response as any).usage?.input_tokens ?? 0;
    if (cacheReadTokens > 0) {
      console.log(`✅ [CACHE HIT] cache_read=${cacheReadTokens} tokens | cache_creation=${cacheCreationTokens} | input=${inputTokens}`);
    } else {
      console.warn(`⚠️ [CACHE MISS] cache_read=0 | cache_creation=${cacheCreationTokens} | input=${inputTokens} — Cold start, próximo request debería hacer hit`);
    }

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

    return new StreamingTextResponse(stream, { headers: getCorsHeaders(origin) });

  } catch (error) {
    const totalTime = Date.now() - startTime;
    console.error(`Error NEXUS híbrido después de ${totalTime}ms:`, error);

    const fallbackResponse = `Estamos experimentando alta demanda en este momento. Por favor intenta de nuevo en unos segundos.

Si el problema persiste, puedes continuar la conversación directamente en **creatuactivo.com** o escribirle a quien te compartió este acceso.`;

    return new Response(JSON.stringify({
      error: fallbackResponse
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...getCorsHeaders(origin) }
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
