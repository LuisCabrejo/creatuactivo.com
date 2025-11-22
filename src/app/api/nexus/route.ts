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
// API Route NEXUS - ARQUITECTURA HÍBRIDA + COMPLIANCE LEGAL v12.1
// VERSION: v12.1 - Timing Optimizado + Formato de Listas Mejorado
// ARSENAL: 79 respuestas en 3 documentos con búsqueda adaptativa
// IDENTIDAD: Copiloto del Arquitecto con onboarding legal + timing estratégico
// CAMBIOS v12.1: Captura AL FINAL + Listas verticales + Datos acumulados
// COMPLIANCE: Ley 1581/2012 Art. 9 + UX optimizada (efecto de recencia)

import { createClient } from '@supabase/supabase-js';
import Anthropic from '@anthropic-ai/sdk';
import { AnthropicStream, StreamingTextResponse } from 'ai';

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
export const maxDuration = 30; // ✅ OPTIMIZACIÓN: 30s buffer para requests pesados

// Cache en memoria optimizado para arquitectura híbrida
const searchCache = new Map<string, any>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutos
// System prompt cache para reducir latencia
const systemPromptCache = new Map<string, any>();
const SYSTEM_PROMPT_CACHE_TTL = 5 * 60 * 1000; // 5 minutos (sincronizado con searchCache)

const API_VERSION = 'v12.1_timing_optimizado'; // ✅ v12.1: Timing + Formato + Datos acumulados

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
// FRAMEWORK IAA - CAPTURA INTELIGENTE
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

  for (const pattern of namePatterns) {
    const match = message.match(pattern);
    if (match) {
      const capturedName = match[1].trim();
      // Validar que el nombre tenga al menos 2 caracteres (evita capturar solo letras de opciones)
      if (capturedName.length >= 2) {
        data.name = capturedName;
        console.log('✅ [NEXUS] Nombre capturado:', data.name, 'del mensaje:', message.substring(0, 50));
        break;
      }
    }
  }

  if (!data.name && message.length < 30) {
    // Intento adicional: nombre simple sin patrón estricto
    const simpleNameMatch = message.match(/^([A-ZÀ-ÿa-zà-ÿ]+(?:\s+[A-ZÀ-ÿa-zà-ÿ]+)?)\s*$/i);

    // ⚠️ BLACKLIST EXPANDIDA: Evitar capturar frases que NO son nombres
    const nameBlacklist = /^(hola|gracias|si|sí|no|ok|bien|claro|perfecto|excelente|entiendo|estoy listo|el|la|los|las|ese|este|aquel|aquella|el más|el de|la de|lo de|para|con|sin|sobre|desde|hasta|quiero|necesito|dame|busco)$/i;

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
    'el más completo': 'visionario',

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
      /(?:soy|trabajo como|me dedico a|trabajo en)\s+(.+?)(?:\.|,|$)/i,
      /(?:profesión|ocupación):\s*(.+?)(?:\.|,|$)/i
    ];

    for (const pattern of occupationPatterns) {
      const match = message.match(pattern);
      if (match) {
        data.occupation = match[1].trim();
        console.log('Ocupación capturada (fallback):', data.occupation);
        break;
      }
    }
  }

  // CÁLCULO DE NIVEL DE INTERÉS (HÍBRIDO MEJORADO)
  let nivelInteres = 5; // Base neutral

  // ✅ NUEVO: Compartir datos personales = alta calificación
  if (data.name) nivelInteres += 2;
  if (data.phone) nivelInteres += 3; // WhatsApp es el indicador más fuerte
  if (data.email) nivelInteres += 2; // Cambiado de 1.5 a 2 (INTEGER)
  if (data.occupation) nivelInteres += 1;

  // Indicadores positivos (palabras clave)
  if (messageLower.includes('paquete') || messageLower.includes('inversión')) nivelInteres += 2;
  if (messageLower.includes('empezar') || messageLower.includes('comenzar')) nivelInteres += 3;
  if (messageLower.includes('precio') || messageLower.includes('costo') || messageLower.includes('cuánto')) nivelInteres += 2; // Cambiado de 1.5 a 2 (INTEGER)
  if (messageLower.includes('quiero') || messageLower.includes('necesito') || messageLower.includes('me interesa')) nivelInteres += 2;
  if (messageLower.includes('cuándo') || messageLower.includes('cuando') || messageLower.includes('cómo')) nivelInteres += 1;

  // Indicadores negativos (menos agresivos) - convertidos a INTEGER
  if (messageLower.includes('no me interesa') || messageLower.includes('no gracias')) nivelInteres -= 3;
  if (messageLower.includes('tal vez') || messageLower.includes('quizás')) nivelInteres -= 1; // Cambiado de -0.5 a -1 (INTEGER)
  if (messageLower.includes('duda')) nivelInteres -= 1; // Cambiado de -0.5 a -1 (INTEGER)

  // Redondear a INTEGER y limitar entre 0-10
  data.interest_level = Math.round(Math.min(10, Math.max(0, nivelInteres)));
  console.log('📊 [NEXUS] Nivel de interés calculado:', data.interest_level, {
    tiene_nombre: !!data.name,
    tiene_telefono: !!data.phone,
    tiene_email: !!data.email,
    tiene_ocupacion: !!data.occupation,
    momento_optimo: data.interest_level >= 7 ? 'caliente' : data.interest_level >= 4 ? 'tibio' : 'frio'
  });

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

      const { data: rpcResult, error: rpcError } = await supabase.rpc('update_prospect_data', {
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

  // 🌿 PRIORIDAD 1: BENEFICIOS CIENTÍFICOS (productos_ciencia)
  // Detecta preguntas sobre beneficios, propiedades, Ganoderma, estudios científicos
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

    // Preguntas técnicas
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
    /patente/i,
    /proceso.*extracción/i,
    /biodisponibilidad/i
  ];

  if (patrones_beneficios_productos.some(patron => patron.test(messageLower))) {
    console.log('🔬 Clasificación: CIENCIA GANODERMA (productos_ciencia)');
    return 'productos_ciencia';
  }

  // 🔧 PRIORIDAD 2: PRODUCTOS INDIVIDUALES - PRECIOS (catálogo)
  if (patrones_productos.some(patron => patron.test(messageLower))) {
    console.log('🛒 Clasificación: PRODUCTOS (catálogo)');
    return 'catalogo_productos';
  }

  // PRIORIDAD 3: PAQUETES DE INVERSIÓN
  // 🆕 FIX 2025-10-21: Routing a arsenal_cierre (contiene SIST_11 con productos por paquete)
  if (patrones_paquetes.some(patron => patron.test(messageLower))) {
    console.log('💼 Clasificación: PAQUETES (arsenal_cierre - SIST_11)');
    return 'arsenal_cierre'; // ✅ CORRECTO: SIST_11 está en arsenal_cierre
  }

  // 🎯 PRIORIDAD 3: FLUJO 3 NIVELES - EXPANSIÓN SEMÁNTICA CRÍTICA
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
  if (esManejo && !esCierre) return 'arsenal_manejo';
  if (esCierre) return 'arsenal_cierre';

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

    if (!data || data.length === 0) {
      console.warn('⚠️ Catálogo de productos no encontrado en Supabase');
      return [];
    }

    const catalogoDoc = data[0];
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

  // PASO 1: Clasificar documento apropiado
  const documentType = clasificarDocumentoHibrido(userMessage);

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

  // 🔬 NUEVA LÓGICA: CONSULTA DE PRODUCTOS CIENCIA (beneficios científicos Ganoderma)
  if (documentType === 'productos_ciencia') {
    console.log('🔬 Consulta dirigida: PRODUCTOS CIENCIA (beneficios científicos)');

    try {
      const { data, error } = await getSupabaseClient()
        .from('nexus_documents')
        .select('id, title, content, category, metadata')
        .eq('category', 'productos_ciencia')
        .limit(1);

      if (error) {
        console.error('Error consultando productos_ciencia:', error);
      } else if (data && data.length > 0) {
        const productosCiencia = data[0];
        console.log('✅ Productos Ciencia encontrado:', productosCiencia.title);

        const result = {
          ...productosCiencia,
          search_method: 'productos_ciencia',
          source: '/knowledge_base/arsenal_productos_beneficios.txt'
        };

        searchCache.set(cacheKey, {
          data: [result],
          timestamp: Date.now()
        });

        return [result];
      } else {
        console.warn('⚠️ Productos Ciencia no encontrado en Supabase (ejecutar EJECUTAR_7_productos_ciencia.sql)');
      }
    } catch (error) {
      console.error('Error accediendo productos_ciencia:', error);
    }
  }

  // LÓGICA ORIGINAL PARA ARSENALES
  if (documentType && documentType.startsWith('arsenal_')) {
    console.log(`📚 Consulta dirigida: ${documentType.toUpperCase()}`);

    try {
      const { data, error } = await getSupabaseClient()
        .from('nexus_documents')
        .select('id, title, content, category, metadata')
        .eq('category', documentType)
        .limit(1);

      if (!error && data && data.length > 0) {
        console.log(`✅ Arsenal ${documentType} encontrado - ${data[0].metadata?.respuestas_totales || 'N/A'} respuestas disponibles`);

        const result = data.map(doc => ({
          ...doc,
          source: `/knowledge_base/arsenal_conversacional_${documentType.replace('arsenal_', '')}.txt`,
          search_method: 'hibrid_classification'
        }));

        searchCache.set(cacheKey, {
          data: result,
          timestamp: Date.now()
        });

        return result;
      }
    } catch (error) {
      console.error(`Error consulta híbrida ${documentType}:`, error);
    }
  }

  // PASO 2: Fallback con búsqueda semántica general
  console.log('📡 Consulta híbrida - fallback búsqueda semántica');

  // PASO 3: Analizar intención para mejorar búsqueda
  const conceptos = analizarIntencionSemantica(userMessage);
  const searchTerms = conceptos.length > 0 ? conceptos.join(' ') : query;

  try {
    const { data, error } = await getSupabaseClient().rpc('search_nexus_documents', {
      search_query: searchTerms,
      match_count: maxResults
    });

    if (error) {
      console.error('Error búsqueda semántica híbrida:', error);
      return [];
    }

    const result = (data || []).filter((doc: any) =>
      doc.category && doc.category.includes('arsenal')
    ).map((doc: any) => ({
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

    const systemPrompt = data?.prompt || getFallbackSystemPrompt();

    // ⚠️ Validar longitud para detectar prompts excesivos
    if (systemPrompt.length > 50000) {
      console.warn(`⚠️ System prompt muy largo: ${systemPrompt.length} caracteres (>50k)`);
    }

    // Cachear el prompt con metadata
    systemPromptCache.set(cacheKey, {
      content: systemPrompt,
      timestamp: Date.now(),
      version: data?.version || 'unknown',
      length: systemPrompt.length
    });

    console.log(`✅ System prompt ${data?.version} cargado y cacheado (${systemPrompt.length} chars, TTL: 5min)`);
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
🏭 EL MOTOR: Los productos Gano Excel con patente mundial. Son tu prueba de una ventaja competitiva insuperable.
📋 EL PLANO: El Framework IAA (INICIAR → ACOGER → ACTIVAR). Es la metodología probada que estructura el éxito.
⚡ LA MAQUINARIA: NodeX y NEXUS. Es la automatización que elimina el 80% del trabajo manual y entrega apalancamiento real.

ARQUITECTURA HÍBRIDA ESCALABLE:
- Clasificación automática de documentos por intención
- Consulta semántica sin mapeos hardcodeados
- Búsqueda adaptativa por contenido
- Escalabilidad infinita para nuevas respuestas

ARSENAL MVP (79 respuestas escalables):
- arsenal_inicial: Primeras interacciones y credibilidad
- arsenal_manejo: Objeciones y soporte técnico
- arsenal_cierre: Sistema avanzado y escalación

PROCESO HÍBRIDO:
1. Clasificar documento apropiado
2. Analizar intención semántica
3. Consultar por contenido dinámico
4. Personalizar por arquetipo
5. Evaluar escalación inteligente

LENGUAJE DEL "NUEVO MUNDO" (USAR SIEMPRE):
- "Nuestro Ecosistema Tecnológico..."
- "La plataforma que hemos construido..."
- "Nuestro framework propietario INICIAR, ACOGER, ACTIVAR..."
- "Operamos bajo el Modelo DEA (Distribución Estratégica Automatizada)..."
- "Como Constructor Inteligente, tú..."

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
  const messageLower = userMessage.toLowerCase();

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
    'arquitectura': 'Framework IAA NodeX NEXUS Motor Plano Maquinaria arquitectura sistema',
    'funcionamiento': 'cómo funciona Framework IAA INICIAR ACOGER ACTIVAR proceso sistema',
    'productos': 'productos Gano Excel patente mundial ventaja competitiva único',
    'contacto': 'Liliana Moreno contacto WhatsApp escalación constructor mentor',

    // Objeciones comunes
    'mlm': 'MLM multinivel pirámide legítimo diferenciación nueva categoría',
    'tiempo': 'tiempo dedicar automatización 80% trabajo estratégico apalancamiento',
    'experiencia': 'experiencia ventas arquitecto operador sistema formación',
    'confianza': 'confianza credibilidad legítimo real funciona resultados',

    // Sistema y valor
    'ganar': 'ganar cuánto realista modelo valor compensación ingresos',
    'distribución': 'distribución sistema canales infraestructura Gano Excel',
    'escalación': 'siguiente paso empezar contactar hablar equipo Liliana'
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
    'CreaTuActivo', 'ecosistema', 'Framework IAA', 'INICIAR', 'ACOGER', 'ACTIVAR',
    'Gano Excel', 'NodeX', 'NEXUS', 'Constructor', 'activo', 'Liliana',
    'inversión', 'automatización', 'paquete', 'precio', 'costo', 'Motor',
    'Plano', 'Maquinaria', 'arquitectura', 'apalancamiento', 'híbrido'
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
  const nameConfirmationPatterns = [
    /(?:hola|perfecto|excelente|genial|encantado)\s+([A-ZÀ-Ÿ][a-zà-ÿ]+(?:\s+[A-ZÀ-Ÿ][a-zà-ÿ]+)*)[!,]/i,
    /(?:gracias|muchas gracias)\s+([A-ZÀ-Ÿ][a-zà-ÿ]+(?:\s+[A-ZÀ-Ÿ][a-zà-ÿ]+)*)[!,]/i,
    /tu nombre es\s+([A-ZÀ-Ÿ][a-zà-ÿ]+(?:\s+[A-ZÀ-Ÿ][a-zà-ÿ]+)*)/i
  ];

  for (const pattern of nameConfirmationPatterns) {
    const nameMatch = response.match(pattern);
    if (nameMatch && nameMatch[1]) {
      const extractedName = nameMatch[1].trim();
      // Validar que no sea un falso positivo (palabras comunes)
      const nameBlacklist = /^(constructor|visionario|inicial|estratégico|excelente|perfecto)$/i;
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
    const { error } = await supabase.from('nexus_conversations').insert({
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
    const { messages, sessionId, fingerprint, constructorId, consentGiven, isReturningUser } = await req.json();

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
        const { data: uuid, error } = await supabase
          .rpc('get_constructor_uuid', { p_constructor_id: constructorId });

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
      messageCount: messages.length
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
        const { data: prospectData, error: prospectError } = await getSupabaseClient()
          .from('prospects')
          .select('id, device_info')
          .eq('fingerprint_id', fingerprint)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

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

    // ========================================
    // 🚨 INTERCEPTACIÓN: CONSENTIMIENTO (BACKEND-ONLY)
    // Basado en arquitectura de Intercom/Drift/Zendesk
    // ========================================
    if (fingerprint && userData) {
      const needsConsent = !userData.consent_granted;
      const neverShownModal = !userData.consent_modal_shown_count || userData.consent_modal_shown_count === 0;

      if (needsConsent && neverShownModal) {
        console.log('🔐 [NEXUS] INTERCEPTACIÓN: Usuario necesita consentimiento y nunca se le mostró modal');

        // Incrementar contador INMEDIATAMENTE (garantía de solo una vez)
        try {
          // Actualizar device_info JSONB en prospects
          const updatedDeviceInfo = {
            ...existingProspectData,
            consent_modal_shown_count: 1,
            last_consent_modal_shown: new Date().toISOString()
          };

          const { error: updateError } = await getSupabaseClient()
            .from('prospects')
            .update({
              device_info: updatedDeviceInfo,
              updated_at: new Date().toISOString()
            })
            .eq('fingerprint_id', fingerprint);

          if (updateError) {
            console.error('❌ [NEXUS] Error actualizando contador de consentimiento:', updateError);
          } else {
            console.log('✅ [NEXUS] Contador de consentimiento actualizado: 0 → 1');
          }
        } catch (error) {
          console.error('❌ [NEXUS] Error en transacción de consentimiento:', error);
        }

        // Retornar mensaje de consentimiento SIN llamar a Claude
        const consentMessage = `Para seguir conversando, necesito tu autorización para usar los datos que compartas conmigo.

Nuestra Política de Privacidad (https://creatuactivo.com/privacidad) explica todo.

¿Aceptas?

A) ✅ Acepto

B) ❌ No, gracias`;

        console.log('📤 [NEXUS] Retornando mensaje de consentimiento (sin llamar a Claude)');

        return new Response(consentMessage, {
          status: 200,
          headers: {
            'Content-Type': 'text/plain; charset=utf-8',
            'Transfer-Encoding': 'chunked'
          }
        });
      } else if (needsConsent && !neverShownModal) {
        console.log('⚠️ [NEXUS] Usuario NO consintió pero ya se le mostró modal (consent_modal_shown_count >= 1)');
        console.log('⚠️ [NEXUS] Continuar conversación en modo restringido');
      } else {
        console.log('✅ [NEXUS] Usuario YA dio consentimiento (consent_granted = true)');
        console.log('✅ [NEXUS] Proceder con conversación normal');
      }
    }


    // �� CARGAR HISTORIAL DE CONVERSACIONES PREVIAS (Memory a largo plazo)
    let conversationSummary = '';

    if (fingerprint) {
      try {
        console.log('🔍 [NEXUS] Cargando historial de conversaciones para:', fingerprint.substring(0, 20) + '...');

        const { data: conversations, error: convError } = await supabase
          .from('nexus_conversations')
          .select('messages, created_at')
          .eq('fingerprint_id', fingerprint)
          .order('created_at', { ascending: true })
          .limit(10); // Últimas 10 conversaciones

        if (convError) {
          console.error('❌ [NEXUS] Error cargando historial:', convError);
        } else if (conversations && conversations.length > 0) {
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
          console.log('ℹ️ [NEXUS] Sin historial previo - primera conversación');
        }
      } catch (error) {
        console.error('❌ [NEXUS] Error consultando historial:', error);
      }
    }

    // FRAMEWORK IAA - CAPTURA INTELIGENTE (solo del mensaje actual)
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
      context += `INFORMACIÓN DEL PROSPECTO CAPTURADA (Framework IAA):
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

    // 🔥 FASE 1.5 - BLOQUE FAQ: Preguntas más frecuentes pre-cargadas (CACHEABLE)
    const topQueriesFAQ = `
## 🔥 PREGUNTAS MÁS FRECUENTES - RESPUESTAS OPTIMIZADAS

Estas son las preguntas con mayor frecuencia y conversión. Si el usuario pregunta sobre estos temas, usa EXACTAMENTE estas respuestas:

### FAQ_01: "¿Cómo funciona el negocio?" (Flujo completo de 3 niveles)

**NIVEL 1 - LA VISIÓN:**
Esa es la pregunta correcta, y la respuesta redefine el juego.

**Piénsalo así: Jeff Bezos no construyó su fortuna vendiendo libros.**
Construyó Amazon, el **sistema** donde millones de libros se venden cada día.

Nosotros aplicamos esa misma filosofía. Tú no vendes productos. Construyes un sistema por donde fluyen productos todos los días.

**Preguntas por defecto:**
➡️ ¿Cómo puedo YO tener un sistema así?
⚙️ ¿Qué es un "sistema de distribución"?
📦 ¿Qué productos distribuye el sistema?

**NIVEL 2 - CÓMO FUNCIONA:**
Tu sistema tiene tres componentes que trabajan juntos:

**1. Productos únicos (Gano Excel)** - Patente mundial
**2. Inteligencia artificial (NEXUS)** - Comunica el proyecto por ti
**3. Tu aplicación (NodeX)** - Ves todo en tiempo real

La tecnología hace el 80% del trabajo pesado. Tú haces el 20% estratégico.

**Preguntas por defecto:**
➡️ ¿Qué hace exactamente la tecnología por mí?
🧠 ¿Qué tengo que hacer yo?
💡 ¿Cómo funciona en la práctica?

**NIVEL 3 - TU TRABAJO:**
Tu trabajo se divide en tres pasos simples:

**INICIAR:** Conectas personas con el sistema
**ACOGER:** Construyes confianza en momentos clave
**ACTIVAR:** Ayudas a otros a empezar su sistema

Mientras tú vives tu vida, el sistema sigue trabajando. Mientras duermes, NEXUS sigue conversando.

**Preguntas por defecto:**
➡️ ¿Qué herramientas tengo para iniciar?
🤝 ¿Cómo sé cuándo intervenir?
🚀 ¿Cómo ayudo a otros a empezar?

---

### FAQ_02: "¿Cómo se gana en el negocio?"

En nuestro ecosistema, no "ganas dinero", construyes flujos de valor. La arquitectura financiera recompensa la construcción de un activo real en tres fases:

**A Corto Plazo (Capitalización):** A través de los Bonos de Inicio Rápido al activar a tus primeros constructores.

**A Mediano Plazo (Expansión):** Con las Comisiones de Equipo (Binario), participas del volumen total de productos que se mueven en tu canal.

**A Largo Plazo (Legado):** Desbloqueas los Bonos de Liderazgo y otros incentivos por desarrollar a otros arquitectos.

**Pregunta de seguimiento:** ¿Cuál de estas tres fases resuena más con tu visión de construcción?

---

### FAQ_03: "¿Cuál es la inversión para empezar a construir?"

Esta no es una simple compra; es la elección de tu **arquitectura de construcción inicial**. Hemos diseñado tres puntos de entrada, cada uno pensado para una visión y un nivel de apalancamiento diferente.

Como parte del selecto grupo de los **150 Fundadores**, cada paquete desbloquea meses de cortesía de nuestra maquinaria tecnológica, un **Bono Tecnológico** exclusivo para los pioneros del ecosistema.

Aquí están las tres arquitecturas iniciales:

* **Constructor Inicial ($200 USD / ~$900.000 COP):** El punto de partida inteligente para validar la arquitectura y el poder del ecosistema. Incluye **2 meses de cortesía** de nuestra tecnología.

* **Constructor Empresarial ($500 USD / ~$2.250.000 COP):** El equilibrio perfecto para una construcción sólida y una operación profesional desde el inicio. Incluye **4 meses de cortesía** de nuestra tecnología.

* **Constructor Visionario ($1,000 USD / ~$4.500.000 COP):** Diseñado para el máximo apalancamiento y una construcción a gran escala desde el día uno. Incluye **6 meses de cortesía** de nuestra tecnología.

La única inversión recurrente es de 50 PV (aprox. $450,000 COP), que recibes íntegramente en productos. No es un costo de plataforma, es el **combustible que mueve tu activo**.

**Pregunta de seguimiento:** ¿Cuál de estas arquitecturas iniciales resuena más con tu visión de construcción?

---

### FAQ_04: "¿Qué hay que hacer?" / "¿Cuál es mi trabajo?"

Tu trabajo se transforma de operador a arquitecto estratégico. Con el Framework IAA, te enfocas en tres acciones clave:

**INICIAR (La Chispa):**
- Conectas personas con el ecosistema usando herramientas automatizadas
- NodeX y NEXUS educan y cualifican por ti
- Tu rol: Ser el puente inicial

**ACOGER (El Consultor):**
- Aportas el toque humano cuando el sistema detecta el momento óptimo
- Das confianza y validas el ajuste
- Tu rol: Consultoría estratégica (no ventas)

**ACTIVAR (El Mentor):**
- Entregas las llaves del ecosistema a nuevos constructores
- Enseñas el primer paso y acompañas el arranque
- Tu rol: Mentoría y transferencia de conocimiento

La tecnología maneja el 80% operativo (seguimiento, educación, contenido, análisis). Tú manejas el 20% estratégico (conexión humana, consultoría, mentoría).

**Pregunta de seguimiento:** ¿Cuál de estas tres acciones estratégicas te parece más natural para tu personalidad?

---

🎯 INSTRUCCIÓN CRÍTICA: Si el usuario hace una pregunta que coincide con estas FAQ, usa EXACTAMENTE el contenido de arriba. Estas respuestas han sido optimizadas para máxima claridad y conversión.
`;

    // 🎯 BLOQUE 3 - NO CACHEABLE: Instrucciones específicas de la sesión
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

    const sessionInstructions = `
INSTRUCCIONES ARQUITECTURA HÍBRIDA:
- Usa la consulta semántica escalable implementada
- Arsenal MVP como fuente de verdad absoluta
- Clasificación automática funcionando correctamente

🛒 INSTRUCCIONES ESPECÍFICAS PARA CATÁLOGO DE PRODUCTOS:
${searchMethod === 'catalogo_productos'
  ? `- ✅ CATÁLOGO CARGADO: Usa ÚNICAMENTE los precios exactos que aparecen en el contenido arriba
- NUNCA inventes precios ni uses información de otras fuentes
- Los precios del catálogo son la autoridad final para productos individuales
- Formato respuesta: "El [PRODUCTO] tiene un precio de $[PRECIO EXACTO] COP por [PRESENTACIÓN]"`
  : `- ⚠️ CATÁLOGO NO DISPONIBLE: Si te preguntan por precios de productos individuales, responde:
"En este momento no tengo acceso a los precios actualizados de productos individuales.

Para información precisa sobre precios y disponibilidad, te puedo conectar con **Liliana Moreno**, nuestra consultora senior.

📱 **WhatsApp:** +573102066593
🕐 **Horario:** 8:00 AM - 8:00 PM (GMT-5)

Ella te brindará el catálogo completo actualizado y podrá asesorarte personalmente."`
}

💼 INSTRUCCIONES PARA PAQUETES DE INVERSIÓN:
- Si consultas arsenal: usar información de paquetes de inversión (Constructor Inicial, Empresarial, Visionario)
- Para paquetes usa los precios: $900,000 / $2,250,000 / $4,500,000 COP

⚡ INSTRUCCIONES GENERALES:
- Si no hay información específica: "Para esa consulta, te conectaré con Liliana Moreno"
- Personalización adaptativa por arquetipo detectado
- CRÍTICO: Respuestas concisas + opciones para profundizar
- Evalúa escalación inteligente si momento_optimo 'caliente'

🎯 ONBOARDING + CAPTURA DE DATOS - INSTRUCCIÓN CRÍTICA v12.2 (Fix 3):
${userData.name || userData.consent_granted ? `
🎉 USUARIO CONOCIDO - SALUDO PERSONALIZADO:
- El usuario YA dio consentimiento previamente: ${userData.consent_granted ? '✅ SÍ' : 'Pendiente'}
- Su nombre es: ${userData.name || 'No capturado aún'}
- Usuario que regresa (limpia pizarra): ${isReturningUser ? '✅ SÍ' : 'No'}
- NO vuelvas a pedir consentimiento ni datos que ya tienes
${userData.name && isReturningUser ? `- SALUDO BREVE OBLIGATORIO: "¡Hola de nuevo, ${userData.name}! ¿En qué más puedo ayudarte?"` : userData.name && !isReturningUser ? `- SALUDO OBLIGATORIO: "¡Hola de nuevo, ${userData.name}! ¿En qué puedo ayudarte hoy?"` : ''}
${!userData.name && isReturningUser ? `- SALUDO BREVE SIN NOMBRE: "¡Hola de nuevo! ¿En qué más puedo ayudarte?"` : ''}
- Si preguntan algo que ya respondiste antes, recuérdales: "Como te comenté antes..."
- Mantén un tono familiar y cercano (ya se conocen)

📊 DATOS QUE YA TIENES (cargados desde BD):
- Nombre: ${userData.name || '❌ No capturado'}
- Arquetipo: ${userData.archetype || '❌ No capturado'}
- WhatsApp: ${userData.whatsapp || '❌ No capturado'}
- Email: ${userData.email || '❌ No capturado'}
- Consentimiento: ${userData.consent_granted ? '✅ YA OTORGADO' : '❌ Pendiente'}

⚠️ SOLO pide datos que AÚN NO TIENES (si faltan WhatsApp, arquetipo o email)
` : esPrimeraInteraccion ? `
⚠️ PRIMERA INTERACCIÓN - ONBOARDING LEGAL OBLIGATORIO:

PROHIBICIONES CRÍTICAS:
❌ NO agregues saludos ("¡Hola! Soy NEXUS..." o similares)
❌ NO agregues emojis (🚀, ✅, ❌)
❌ NO agregues texto sobre "arquitecto tecnológico" o "comprar tu tiempo de vuelta"
❌ NO agregues frases como "Una vez que tengamos eso claro..."
❌ NO expandas ni interpretes el texto de consentimiento

INSTRUCCIÓN:
- USA SOLO el texto de consentimiento del System Prompt (sección ONBOARDING MINIMALISTA)
- Esperar respuesta del usuario antes de continuar

- IMPORTANTE: El usuario preguntó "${latestUserMessage}"
- Pero NO respondas esa pregunta AÚN
- Primero completa el onboarding legal
- Al final del onboarding, puedes mencionar: "Ahora que tenemos eso claro, respondamos a tu pregunta..."
` : `
✅ SEGUNDA INTERACCIÓN EN ADELANTE - CAPTURA PROGRESIVA CON PROPUESTA DE VALOR:

📊 ESTADO ACTUAL DE CAPTURA (Datos acumulados en BD):
- Nombre: ${mergedProspectData.name || '❌ FALTA - PEDIR AHORA'}
- Ocupación: ${mergedProspectData.occupation || '❌ FALTA'}
- WhatsApp: ${mergedProspectData.phone || '❌ FALTA'}

🎯 PRÓXIMO DATO A CAPTURAR (si falta):

${!mergedProspectData.name ? `
⚠️ FALTA: NOMBRE
- Sigue las instrucciones del System Prompt (PASO 1) para timing y formato
` : mergedProspectData.name && !mergedProspectData.archetype ? `
⚠️ FALTA: ARQUETIPO
- Nombre ya capturado: ${mergedProspectData.name}
- Sigue las instrucciones del System Prompt (PASO 2) para presentar arquetipos
- Usa formato de viñetas: "- A) 💼 Profesional..."
` : mergedProspectData.name && mergedProspectData.archetype && (mergedProspectData.interest_level || 0) >= 7 && !mergedProspectData.phone ? `
⚠️ FALTA: WHATSAPP (Interés Alto: ${mergedProspectData.interest_level}/10)
- Nombre: ${mergedProspectData.name}
- Arquetipo: ${mergedProspectData.archetype}
- Sigue las instrucciones del System Prompt (PASO 3) para pedir WhatsApp
` : `
✅ DATOS COMPLETOS
- Continúa conversación sin pedir más datos
- Email solo si usuario solicita recurso digital
`}

⚠️ TIMING Y FORMATO - SEGUIR SYSTEM PROMPT v12.5:
- El System Prompt (PASO 1 y PASO 2) contiene las reglas de timing correctas
- Sigue esas instrucciones para timing de nombre y arquetipo
- NO impongas timing diferente a lo que dice el System Prompt
`}`;

    // 🔍 LOGGING DETALLADO PARA DEBUGGING
    console.log('🔍 DEBUG - Contexto enviado a Claude:');
    console.log('Método de búsqueda:', searchMethod);
    console.log('📦 CACHE STATUS: Usando Anthropic Prompt Caching (3 bloques + 1 dinámico)');
    if (searchMethod === 'catalogo_productos') {
      console.log('📋 Contenido catálogo enviado (primeros 200 chars):',
        relevantDocuments[0]?.content?.substring(0, 200) + '...');
    }
    console.log('📝 System prompt base (primeros 100 chars):',
      baseSystemPrompt.substring(0, 100) + '...');
    console.log('📝 Arsenal context length:', arsenalContext.length, 'chars');
    console.log('🔥 FAQ context length:', topQueriesFAQ.length, 'chars');

    console.log('Enviando request Claude con contexto híbrido + CACHE...');

    // ⚡ FASE 1 - OPTIMIZACIÓN: max_tokens dinámico según tipo de consulta
    // FIX 2025-10-25: Ajuste gradual para evitar respuestas cortadas (sincronizado con Dashboard)
    const maxTokens = searchMethod === 'catalogo_productos'
      ? 300  // Consultas de precios = respuestas cortas (producto + precio)
      : prospectData.momento_optimo === 'caliente'
      ? 500  // Prospecto caliente = respuesta más detallada para cerrar
      : 600; // Default: incrementado de 500 → 600 para arquetipos/paquetes completos

    console.log(`⚡ max_tokens dinámico: ${maxTokens} (${searchMethod}, momento: ${prospectData.momento_optimo || 'N/A'})`);

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
        // 🔥 BLOQUE 3: FAQ Top Queries (CACHEABLE - ~4K chars) - FASE 1.5
        {
          type: 'text',
          text: topQueriesFAQ,
          cache_control: { type: 'ephemeral' }
        },
        // 📝 BLOQUE 4: Session Instructions (NO CACHEABLE - siempre cambia)
        {
          type: 'text',
          text: sessionInstructions
        }
      ],
      stream: true,
      max_tokens: maxTokens,        // ⚡ OPTIMIZADO: dinámico 300-500 (antes: 1000)
      temperature: 0.3,
      top_p: 0.9,                    // ⚡ NUEVO: consistencia mejorada
      messages: recentMessages,      // ⚡ OPTIMIZADO: últimos 6 mensajes (antes: todos)
    });

    // Stream optimizado para arquitectura híbrida
    const stream = AnthropicStream(response as any, {
      onFinal: async (completion) => {
        const totalTime = Date.now() - startTime;
        console.log(`✅ NEXUS híbrido completado en ${totalTime}ms - Método: ${searchMethod}`);

        // ✅ EXTRACCIÓN SEMÁNTICA: Analizar respuesta de Claude para capturar datos
        const semanticData = extractFromClaudeResponse(completion);

        // Merge datos: captura directa (del usuario) + semántica (de respuesta Claude)
        const finalData: ProspectData = {
          ...prospectData,  // Datos capturados del input del usuario
          ...semanticData   // Datos extraídos de la respuesta de Claude (prioridad)
        };

        // Guardar datos semánticos si se encontró algo
        if (Object.keys(semanticData).length > 0 && fingerprint) {
          console.log('🔍 [SEMÁNTICA] Guardando datos extraídos de respuesta Claude:', semanticData);

          try {
            const cleanedSemanticData = removeNullValues(semanticData);

            const { data: rpcResult, error: rpcError } = await supabase.rpc('update_prospect_data', {
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
    // Verificar Arsenal MVP completo
    const { data: arsenalDocs, error: arsenalError } = await supabase
      .from('nexus_documents')
      .select('category, metadata')
      .in('category', ['arsenal_inicial', 'arsenal_manejo', 'arsenal_cierre']);

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
    const { data: rpcFunctions } = await supabase.rpc('search_nexus_documents', {
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
