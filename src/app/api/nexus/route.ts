// src/app/api/nexus/route.ts
// API Route NEXUS - ARQUITECTURA HÍBRIDA ESCALABLE CORREGIDA
// ARSENAL: 79 respuestas en 3 documentos con búsqueda adaptativa
// IDENTIDAD: Copiloto del Arquitecto (atemporal, sin versiones)
// CORRECCIONES: System prompt sin cache + Clasificación productos/paquetes + Consulta catálogo
// FIX APLICADO: Instrucciones específicas para interpretación correcta del catálogo

import { createClient } from '@supabase/supabase-js';
import Anthropic from '@anthropic-ai/sdk';
import { AnthropicStream, StreamingTextResponse } from 'ai';

// 1. Configuración de Clientes
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const runtime = 'edge';
export const maxDuration = 30; // ✅ OPTIMIZACIÓN v11.9: 25→30s buffer para requests pesados

// Cache en memoria optimizado para arquitectura híbrida
const searchCache = new Map<string, any>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutos
// ✅ OPTIMIZACIÓN v11.9: System prompt CON cache para reducir latencia
const systemPromptCache = new Map<string, any>();
const SYSTEM_PROMPT_CACHE_TTL = 5 * 60 * 1000; // 5 minutos (sincronizado con searchCache)

const API_VERSION = 'v11.9_cap_temprana_optimizada';

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
  momento_optimo?: string;
  preguntas?: string[];
}

// Función para capturar datos del prospecto inteligentemente
async function captureProspectData(
  message: string,
  sessionId: string,
  fingerprint?: string
): Promise<ProspectData> {

  console.log('🔍 [NEXUS] Captura datos híbrida - Input:', {
    message: message.substring(0, 100),
    sessionId,
    fingerprint,
    hasFingerprint: !!fingerprint
  });

  const data: ProspectData = {};
  const messageLower = message.toLowerCase();

  // CAPTURA DE NOMBRE
  const namePatterns = [
    /(?:me llamo|mi nombre es|soy)\s+([A-ZÀ-ÿ][a-zà-ÿ]+(?:\s+[A-ZÀ-ÿ][a-zà-ÿ]+)?)/i,
    /^([A-ZÀ-ÿ][a-zà-ÿ]+(?:\s+[A-ZÀ-ÿ][a-zà-ÿ]+)?)\s*$/
  ];

  for (const pattern of namePatterns) {
    const match = message.match(pattern);
    if (match) {
      data.name = match[1].trim();
      console.log('✅ [NEXUS] Nombre capturado:', data.name, 'del mensaje:', message.substring(0, 50));
      break;
    }
  }

  if (!data.name && message.length < 30) {
    // Intento adicional: nombre simple sin patrón estricto
    const simpleNameMatch = message.match(/^([A-ZÀ-ÿa-zà-ÿ]+(?:\s+[A-ZÀ-ÿa-zà-ÿ]+)?)\s*$/i);
    if (simpleNameMatch && !messageLower.match(/hola|gracias|si|no|ok|bien/)) {
      data.name = simpleNameMatch[1].trim();
      console.log('✅ [NEXUS] Nombre capturado (patrón simple):', data.name);
    }
  }

  // CAPTURA DE TELÉFONO
  const phoneMatch = message.match(/(?:\+?57)?\s*(\d{10})/);
  if (phoneMatch) {
    data.phone = phoneMatch[0].replace(/\s/g, '');
    console.log('Teléfono capturado:', data.phone);
  }

  // CAPTURA DE EMAIL
  const emailMatch = message.match(/[\w.-]+@[\w.-]+\.\w+/);
  if (emailMatch) {
    data.email = emailMatch[0].toLowerCase();
    console.log('Email capturado:', data.email);
  }

  // CAPTURA DE OCUPACIÓN
  const occupationPatterns = [
    /(?:soy|trabajo como|me dedico a|trabajo en)\s+(.+?)(?:\.|,|$)/i,
    /(?:profesión|ocupación):\s*(.+?)(?:\.|,|$)/i
  ];

  for (const pattern of occupationPatterns) {
    const match = message.match(pattern);
    if (match) {
      data.occupation = match[1].trim();
      console.log('Ocupación capturada:', data.occupation);
      break;
    }
  }

  // CÁLCULO DE NIVEL DE INTERÉS (HÍBRIDO MEJORADO)
  let nivelInteres = 5; // Base neutral

  // ✅ NUEVO: Compartir datos personales = alta calificación
  if (data.name) nivelInteres += 2;
  if (data.phone) nivelInteres += 3; // WhatsApp es el indicador más fuerte
  if (data.email) nivelInteres += 1.5;
  if (data.occupation) nivelInteres += 1;

  // Indicadores positivos (palabras clave)
  if (messageLower.includes('paquete') || messageLower.includes('inversión')) nivelInteres += 2;
  if (messageLower.includes('empezar') || messageLower.includes('comenzar')) nivelInteres += 3;
  if (messageLower.includes('precio') || messageLower.includes('costo') || messageLower.includes('cuánto')) nivelInteres += 1.5;
  if (messageLower.includes('quiero') || messageLower.includes('necesito') || messageLower.includes('me interesa')) nivelInteres += 2;
  if (messageLower.includes('cuándo') || messageLower.includes('cuando') || messageLower.includes('cómo')) nivelInteres += 1;

  // Indicadores negativos (menos agresivos)
  if (messageLower.includes('no me interesa') || messageLower.includes('no gracias')) nivelInteres -= 3;
  if (messageLower.includes('tal vez') || messageLower.includes('quizás')) nivelInteres -= 0.5;
  if (messageLower.includes('duda')) nivelInteres -= 0.5;

  data.interest_level = Math.min(10, Math.max(0, nivelInteres));
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
      console.log('🔵 [NEXUS] Guardando en BD:', { fingerprint, data });

      const { data: rpcResult, error: rpcError } = await supabase.rpc('update_prospect_data', {
        p_fingerprint_id: fingerprint,
        p_data: data
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

  // 🔧 NUEVA CLASIFICACIÓN ROBUSTA: PRODUCTOS INDIVIDUALES (CATÁLOGO) - SIN CAMBIOS
  const patrones_productos = [
    // ===== CÁPSULAS CORDYGOLD (PROBLEMA ESPECÍFICO) =====
    /(?:dame el precio|cuánto cuesta|precio|cuesta).*(?:cordy gold|cordygold|cordy|gano cordyceps)/i,
    /(?:dame el precio|cuánto cuesta|precio|cuesta).*cordyceps/i,

    // ===== GANO CAFÉ VARIACIONES =====
    /(?:dame el precio|cuánto cuesta|precio|cuesta).*(?:gano.*café|ganocafé|café.*3.*en.*1|capuchino)/i,
    /(?:dame el precio|cuánto cuesta|precio|cuesta).*(?:café.*negro|café.*clásico|negrito)/i,
    /(?:dame el precio|cuánto cuesta|precio|cuesta).*(?:latte.*rico|mocha.*rico|shoko.*rico)/i,

    // ===== CÁPSULAS SUPLEMENTOS =====
    /(?:dame el precio|cuánto cuesta|precio|cuesta).*(?:cápsulas.*ganoderma|ganoderma.*lucidum)/i,
    /(?:dame el precio|cuánto cuesta|precio|cuesta).*excellium/i,
    /(?:dame el precio|cuánto cuesta|precio|cuesta).*(?:cápsula|suplemento)/i,

    // ===== LÍNEA LUVOCO =====
    /(?:dame el precio|cuánto cuesta|precio|cuesta).*(?:máquina.*luvoco|luvoco)/i,
    /(?:dame el precio|cuánto cuesta|precio|cuesta).*(?:cápsulas.*luvoco|luvoco.*cápsulas)/i,

    // ===== PRODUCTOS ESPECÍFICOS =====
    /(?:dame el precio|cuánto cuesta|precio|cuesta).*(?:reskine|colágeno)/i,
    /(?:dame el precio|cuánto cuesta|precio|cuesta).*(?:espirulina|c'real)/i,
    /(?:dame el precio|cuánto cuesta|precio|cuesta).*(?:rooibos|oleaf)/i,
    /(?:dame el precio|cuánto cuesta|precio|cuesta).*schokoladde/i,

    // ===== CUIDADO PERSONAL =====
    /(?:dame el precio|cuánto cuesta|precio|cuesta).*(?:pasta.*dientes|gano fresh)/i,
    /(?:dame el precio|cuánto cuesta|precio|cuesta).*(?:jabón|champú|acondicionador|exfoliante)/i,
    /(?:dame el precio|cuánto cuesta|precio|cuesta).*(?:piel.*brillo|piel&brillo)/i,

    // ===== PATRONES GENERALES DE PRODUCTOS =====
    /(?:dame el precio|cuánto cuesta|precio|cuesta).*producto/i,
    /precio.*(?:consumidor|individual)/i,
    /catálogo.*precio/i,
    /lista.*precios.*producto/i,

    // ===== PATRONES ESPECÍFICOS POR MARCA =====
    /(?:dame el precio|cuánto cuesta|precio|cuesta).*(?:gano excel|dxn)/i,

    // ===== CRÍTICO: Distinguir productos de paquetes de inversión =====
    /cuánto.*cuesta(?!.*paquete|.*inversión|.*empezar|.*constructor|.*activar)/i,
    /precio.*(?!.*paquete|.*inversión|.*constructor)/i,
  ];

  // NUEVA CLASIFICACIÓN: PAQUETES DE INVERSIÓN (CONSTRUCTORES) - SIN CAMBIOS
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

    // NUEVOS: Patrones generales para paquetes
    /háblame.*paquetes/i,
    /sobre.*paquetes/i,
    /de.*los.*paquetes/i,
    /qué.*paquetes/i,
    /cuáles.*paquetes/i,
    /información.*paquetes/i,
    /paquetes.*disponibles/i,
    /paquetes.*hay/i,
    /tipos.*paquetes/i,

    // NUEVOS: Referencias específicas ESP
    /esp\s*1/i,
    /esp\s*2/i,
    /esp\s*3/i,
    /esp1/i,
    /esp2/i,
    /esp3/i,
    /paquete.*esp/i,
    /esp.*paquete/i
  ];

  // 🔧 PRIORIDAD 1: PRODUCTOS INDIVIDUALES (SIN CAMBIOS)
  if (patrones_productos.some(patron => patron.test(messageLower))) {
    console.log('🛒 Clasificación: PRODUCTOS (catálogo)');
    return 'catalogo_productos';
  }

  // PRIORIDAD 2: PAQUETES DE INVERSIÓN (SIN CAMBIOS)
  if (patrones_paquetes.some(patron => patron.test(messageLower))) {
    console.log('💼 Clasificación: PAQUETES (arsenal_inicial)');
    return 'arsenal_inicial';
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
    /contactar.*alguien/i
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
    // Buscar por ID específico (más confiable) o por pattern de título/source
    const { data, error } = await supabase
      .from('nexus_documents')
      .select('id, title, content, source, metadata')
      .or('id.eq.8,title.ilike.%Catálogo%Productos%,source.ilike.%catalogo_productos%')
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

  // LÓGICA ORIGINAL PARA ARSENALES
  if (documentType && documentType.startsWith('arsenal_')) {
    console.log(`📚 Consulta dirigida: ${documentType.toUpperCase()}`);

    try {
      const { data, error } = await supabase
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
    const { data, error } = await supabase.rpc('search_nexus_documents', {
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
    const { data, error } = await supabase
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
    const { messages, sessionId, fingerprint } = await req.json();

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

    // FRAMEWORK IAA - CAPTURA INTELIGENTE
    const prospectData = await captureProspectData(
      latestUserMessage,
      sessionId || 'anonymous',
      fingerprint
    );

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

    // Agregar contexto del prospecto
    if (Object.keys(prospectData).length > 0) {
      context += `INFORMACIÓN DEL PROSPECTO CAPTURADA (Framework IAA):
- Nivel de interés: ${prospectData.interest_level || 'No determinado'}/10
- Momento óptimo: ${prospectData.momento_optimo || 'Por determinar'}
- Arquetipo: ${prospectData.archetype || 'No identificado'}
${prospectData.objections ? `- Objeciones: ${prospectData.objections.join(', ')}` : ''}
${prospectData.name ? `- Nombre: ${prospectData.name}` : ''}

`;
      console.log('Contexto híbrido del prospecto incluido:', prospectData.momento_optimo);
    }

    // ✅ OPTIMIZACIÓN: System prompt CON CACHE de Anthropic
    const baseSystemPrompt = await getSystemPrompt();

    // 🎯 BLOQUE 1 - CACHEABLE: Arsenal/Catálogo Context
    const arsenalContext = context; // Ya contiene el contenido del arsenal o catálogo

    // 🎯 BLOQUE 2 - NO CACHEABLE: Instrucciones específicas de la sesión
    const sessionInstructions = `
INSTRUCCIONES ARQUITECTURA HÍBRIDA:
- Usa la consulta semántica escalable implementada
- Arsenal MVP como fuente de verdad absoluta
- Clasificación automática funcionando correctamente

🛒 INSTRUCCIONES ESPECÍFICAS PARA CATÁLOGO DE PRODUCTOS:
- CRÍTICO: Si consultaste el catálogo de productos, usa ÚNICAMENTE los precios exactos que aparecen en el contenido
- NUNCA inventes precios ni uses información de otras fuentes
- Los precios del catálogo son la autoridad final para productos individuales
- Formato respuesta: "El [PRODUCTO] tiene un precio de $[PRECIO EXACTO] COP por [PRESENTACIÓN]"
- Si no encuentras un producto específico en el catálogo, indica que no tienes esa información

💼 INSTRUCCIONES PARA PAQUETES DE INVERSIÓN:
- Si consultas arsenal: usar información de paquetes de inversión (Constructor Inicial, Empresarial, Visionario)
- Para paquetes usa los precios: $900,000 / $2,250,000 / $4,500,000 COP

⚡ INSTRUCCIONES GENERALES:
- Si no hay información específica: "Para esa consulta, te conectaré con Liliana Moreno"
- Personalización adaptativa por arquetipo detectado
- CRÍTICO: Respuestas concisas + opciones para profundizar
- Evalúa escalación inteligente si momento_optimo 'caliente'`;

    // 🔍 LOGGING DETALLADO PARA DEBUGGING
    console.log('🔍 DEBUG - Contexto enviado a Claude:');
    console.log('Método de búsqueda:', searchMethod);
    console.log('📦 CACHE STATUS: Usando Anthropic Prompt Caching (2 bloques)');
    if (searchMethod === 'catalogo_productos') {
      console.log('📋 Contenido catálogo enviado (primeros 200 chars):',
        relevantDocuments[0]?.content?.substring(0, 200) + '...');
    }
    console.log('📝 System prompt base (primeros 100 chars):',
      baseSystemPrompt.substring(0, 100) + '...');
    console.log('📝 Arsenal context length:', arsenalContext.length, 'chars');

    console.log('Enviando request Claude con contexto híbrido + CACHE...');

    // ✅ Generar respuesta con Claude usando Prompt Caching
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
        {
          type: 'text',
          text: sessionInstructions
        }
      ],
      stream: true,
      max_tokens: 1000,
      temperature: 0.3,
      messages: messages,
    });

    // Stream optimizado para arquitectura híbrida
    const stream = AnthropicStream(response as any, {
      onFinal: async (completion) => {
        const totalTime = Date.now() - startTime;
        console.log(`NEXUS híbrido completado en ${totalTime}ms - Método: ${searchMethod}`);

        // Log conversación con método de búsqueda - CORREGIDO 2025-10-17
        await logConversationHibrida(
          latestUserMessage,
          completion,
          documentsUsed,
          searchMethod,
          sessionId,
          fingerprint,
          prospectData
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
