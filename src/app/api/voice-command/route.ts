/**
 * /api/voice-command — Motor Cognitivo de Voz
 * Queswa Ecosystem — Multi-Tenant (FASE C)
 *
 * Pipeline:
 *   1. 🎙 OÍDO     → Whisper (OpenAI) — audio a texto
 *   2. 🧠 CEREBRO  → Claude — entrenamiento NEXUS + reglas de voz + fragmento RAG
 *   3. 🔊 VOZ      → ElevenLabs TTS → OpenAI TTS fallback → audio
 *
 * Arquitectura del system prompt (basada en investigación de latencia):
 *   Bloque 1 — Prompt entrenado de Supabase (estático, cacheado por Anthropic)
 *   Bloque 2 — Reglas de voz + fragmento RAG + vars dinámicas (no cacheado)
 *
 * Devuelve: audio/mpeg
 * Headers extra: x-transcript, x-reply
 */

import { NextRequest, NextResponse } from 'next/server'
import OpenAI                         from 'openai'
import Anthropic                      from '@anthropic-ai/sdk'
import { createClient }               from '@supabase/supabase-js'
import { normalizarParaVoz }          from '@/lib/tts-normalize'
import { vectorSearchVoyage }         from '@/lib/vectorSearch'
import type { DocumentWithEmbedding }  from '@/lib/vectorSearch'

export const runtime     = 'nodejs'
export const maxDuration = 60

// ─── Clientes lazy ────────────────────────────────────────────────────────────
let _openai: OpenAI | null = null
function getOpenAI(): OpenAI {
  if (!_openai) _openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY ?? '' })
  return _openai
}

let _anthropic: Anthropic | null = null
function getAnthropic(): Anthropic {
  if (!_anthropic) _anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  return _anthropic
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

const ELEVENLABS_KEY      = process.env.ELEVENLABS_API_KEY ?? ''
const ELEVENLABS_VOICE_ID = process.env.ELEVENLABS_VOICE_ID ?? 'EXAVITQu4vr4xnSDxMaL'
const VOYAGE_API_KEY      = process.env.VOYAGE_API_KEY ?? ''

// ─── Caché de módulo por tenant ───────────────────────────────────────────────
// Map keyed by tenantId — cada tenant carga y cachea su propio prompt.
// Cold start: 1 query a Supabase (~150-300ms). Warm (mismo tenant): 0ms.
const PROMPT_TTL = 5 * 60 * 1000 // 5 minutos
const _promptCache = new Map<string, { content: string; ts: number }>()

// Mapa tenant_id → nombre del prompt en system_prompts
// Permite que cada proyecto cargue su propio entrenamiento.
const TENANT_PROMPT_NAME: Record<string, string> = {
  creatuactivo_marketing: 'nexus_main',
  marca_personal:         'marca_personal',   // fila real en system_prompts (antes 'luiscabrejo_main' → no existía → caía al fallback)
  ecommerce:              'ganocafe_main',
  queswa_dashboard:       'queswa_dashboard',
}

const FALLBACK_PROMPTS: Record<string, string> = {
  creatuactivo_marketing: `Eres Queswa, el asistente de CreaTuActivo.com.
CreaTuActivo.com ayuda a las personas a construir su negocio digital con ingresos recurrentes que no dependen de su presencia, con el respaldo operativo de Gano Excel (presente en 70 países).
El Método tiene tres comandos: Expandir, Activar y Multiplicación. Paquetes ESP-1, ESP-2, ESP-3.
Trato de usted, cálido y claro. Nunca menciones que eres una IA.`,
  marca_personal: `Eres el asistente de voz de Luis Cabrejo en luiscabrejo.com.
Luis Cabrejo es emprendedor, creador del ecosistema CreaTuActivo y arquitecto de activos digitales.
Responde sobre su filosofía, contenido y propuesta de valor personal.`,
  ecommerce: `Eres el asistente de Ganocafé, tienda online de productos Gano Excel.
Ayudas a los visitantes a conocer los productos, precios y cómo realizar su pedido.`,
}

async function getPromptForTenant(tenantId: string): Promise<string> {
  const cached = _promptCache.get(tenantId)
  if (cached && Date.now() - cached.ts < PROMPT_TTL) return cached.content

  const promptName = TENANT_PROMPT_NAME[tenantId] ?? 'nexus_main'

  try {
    const { data } = await supabase
      .from('system_prompts')
      .select('prompt')
      .eq('name', promptName)
      .single()
    if (data?.prompt) {
      _promptCache.set(tenantId, { content: data.prompt, ts: Date.now() })
      console.log(`✅ [Voice] Prompt cargado tenant=${tenantId} name=${promptName} (${data.prompt.length} chars)`)
      return data.prompt
    }
  } catch (e) {
    console.warn(`⚠️ [Voice] Prompt load failed tenant=${tenantId}:`, e)
  }

  return FALLBACK_PROMPTS[tenantId] ?? FALLBACK_PROMPTS.creatuactivo_marketing
}

// ─── Clasificador de intención de voz ────────────────────────────────────────
function classifyVoiceQuery(msg: string): 'arsenal_inicial' | 'arsenal_compensacion' | 'catalogo_productos' | null {
  const m = msg.toLowerCase()

  // Catálogo primero — preguntas de precio de producto individual son muy específicas
  const catalogo = [
    /precio.*cordygold/i, /cordygold.*precio/i, /cuánto.*cordygold/i,
    /precio.*excellium/i, /excellium.*precio/i, /cuánto.*excellium/i,
    /precio.*ganocafé/i, /precio.*gano.*cafe/i, /cuánto.*ganocafé/i,
    /precio.*shoko/i, /precio.*chocolate/i, /precio.*luxxe/i,
    /precio.*black/i, /precio.*3-in-1/i, /precio.*mocha/i,
    /precio.*ukon/i, /precio.*soap/i, /precio.*spirulina/i,
    /cuánto.*cuesta.*producto/i, /precio.*producto/i, /lista.*precio/i,
    /precio.*caja/i, /precio.*bolsa/i,
  ]
  if (catalogo.some(p => p.test(m))) return 'catalogo_productos'

  const compensacion = [
    /cuánto.*ganar/i, /cuánto.*gana/i, /cómo.*se.*gana/i, /ingreso/i,
    /comision/i, /comisión/i, /bono/i, /porcentaje/i, /plan.*pago/i,
    /plan.*compensacion/i, /reto.*12/i, /12.*nivel/i, /niveles/i,
    /cuánto.*cuesta.*empezar/i, /inversión/i, /inversion/i,
    /paquete/i, /esp-1/i, /esp-2/i, /esp-3/i, /sist_11/i,
    /gano.*dinero/i, /negocio.*rentable/i, /retorno/i,
  ]
  if (compensacion.some(p => p.test(m))) return 'arsenal_compensacion'

  const inicial = [
    /qué es.*creatuactivo/i, /qué es.*queswa/i, /qué es.*ecosistema/i,
    /cómo funciona/i, /de qué trata/i, /en qué consiste/i,
    /es.*piramide/i, /es.*pirámide/i, /es.*mlm/i, /es.*multinivel/i,
    /es.*legitimo/i, /es.*legítimo/i, /es.*confiable/i, /es.*estafa/i,
    /quién.*luis/i, /quién.*detrás/i, /quién.*fundador/i,
    /gano.*excel/i, /ganoderma/i, /productos/i, /beneficio/i,
    /tridente.*eam/i, /método/i, /expandir/i, /expansión/i, /activar/i, /activación/i, /multiplicación/i, /maestría/i,
    /cómo.*empez/i, /primer.*paso/i, /siguiente.*paso/i,
  ]
  if (inicial.some(p => p.test(m))) return 'arsenal_inicial'

  return null
}

// ─── Fetch del fragmento más relevante de nexus_documents ────────────────────
// Para catálogo de productos: se trae el documento completo sin textSearch
// (la tabla de precios puede ser >1200 chars — truncar causa respuestas inconsistentes).
// Para otros arsenales: textSearch primero, fallback al primer documento de la categoría.
async function fetchArsenalFragment(category: string, query: string): Promise<string> {
  const isCatalog = category === 'catalogo_productos'
  const CHAR_LIMIT = isCatalog ? 3000 : 1400

  if (!isCatalog) {
    // textSearch para arsenal_inicial / arsenal_compensacion
    try {
      const { data } = await supabase
        .from('nexus_documents')
        .select('title, content')
        .like('category', `${category}%`)
        .textSearch('content', query.split(' ').filter(w => w.length > 3).slice(0, 5).join(' | '), { config: 'spanish' })
        .limit(1)
        .single()
      if (data?.content) return `FUENTE DE VERDAD (${data.title}):\n${data.content.substring(0, CHAR_LIMIT)}`
    } catch { /* fallback silencioso */ }
  }

  // Catálogo: traer directamente el documento de precios (más confiable que textSearch)
  // Otros: fallback al primer documento de la categoría si textSearch falló
  try {
    const { data } = await supabase
      .from('nexus_documents')
      .select('title, content')
      .like('category', `${category}%`)
      .limit(1)
      .single()
    if (data?.content) return `FUENTE DE VERDAD (${data.title}):\n${data.content.substring(0, CHAR_LIMIT)}`
  } catch { /* sin fragmento */ }

  return ''
}

// ─── Carga de fragmentos por tenant (in-memory, cacheada) ────────────────────
// Usamos embedding_512 + cosine en memoria (igual que el chat de texto): tolera
// mezclas de dimensiones. El RPC match_documents NO sirve aquí — exige dimensión
// exacta y revienta con "different vector dimensions 1536 and 512".
const MASTER_CATEGORIES = new Set([
  'arsenal_inicial', 'arsenal_avanzado', 'catalogo_productos', 'arsenal_compensacion',
  'arsenal_reto', 'arsenal_12_niveles', 'arsenal_marca_personal', 'arsenal_ganocafe',
])
const FRAG_TTL = 5 * 60 * 1000 // 5 min
const _fragCache = new Map<string, { docs: DocumentWithEmbedding[]; ts: number }>()

async function getTenantFragments(tenantId: string): Promise<DocumentWithEmbedding[]> {
  const c = _fragCache.get(tenantId)
  if (c && Date.now() - c.ts < FRAG_TTL) return c.docs

  const { data, error } = await supabase
    .from('nexus_documents')
    .select('category, title, content, embedding_512, metadata')
    .eq('tenant_id', tenantId)
    .not('embedding_512', 'is', null)

  if (error) { console.warn('⚠️ [Voice] carga de fragmentos falló:', error.message); return [] }

  const docs = (data ?? [])
    // Excluir los docs maestros (arsenal completo) — solo fragmentos específicos
    .filter((d: { category: string }) => !MASTER_CATEGORIES.has(d.category))
    .map((d: { category: string; title: string; content: string; embedding_512: string; metadata?: Record<string, unknown> }) => ({
      category: d.category,
      title: d.title,
      content: d.content,
      embedding: String(d.embedding_512),
      metadata: d.metadata,
    }))

  _fragCache.set(tenantId, { docs, ts: Date.now() })
  console.log(`📚 [Voice] ${docs.length} fragmentos cargados tenant=${tenantId}`)
  return docs
}

// ─── Recuperación de contexto (vector search in-memory + fallback regex) ──────
// Mismo motor que el chat de texto: Voyage AI embedding (voyage-3-lite) → cosine
// sobre embedding_512. Resuelve precios/productos ("Gano Café 3 en 1") que el
// clasificador regex no atrapaba → el modelo ya no improvisa el handoff a la
// directiva por falta de datos. Fallback al clasificador regex + textSearch.
async function fetchRelevantFragment(query: string, tenantId: string): Promise<string> {
  if (VOYAGE_API_KEY) {
    try {
      const docs = await getTenantFragments(tenantId)
      if (docs.length) {
        const results = await vectorSearchVoyage(query, docs, VOYAGE_API_KEY, 0.30, 3)
        if (results.length) {
          console.log(`🔎 [Voice] vector hits: ${results.map(r => `${r.category}(${r.similarity.toFixed(2)})`).join(', ')}`)
          return results
            .map(r => `FUENTE DE VERDAD (${r.title}):\n${r.content}`)
            .join('\n\n')
            .substring(0, 3000)
        }
        console.log('🔎 [Voice] vector search sin resultados → fallback regex')
      }
    } catch (e) {
      console.warn('⚠️ [Voice] vector search falló → fallback regex:', e)
    }
  }
  // Fallback legacy: clasificador regex + textSearch
  const cat = classifyVoiceQuery(query)
  return cat ? fetchArsenalFragment(cat, query) : ''
}

// Detecta preguntas que merecen más tokens
const COMPLEX_KEYWORDS = [
  'cómo funciona', 'explica', 'cuéntame', 'beneficio', 'ganoderma',
  'plan de compensación', 'cómo se gana', 'qué es', 'diferencia',
  'por qué', 'ventaja', 'metodología', 'tridente', 'historia',
]
function getMaxTokens(transcript: string): number {
  const lower = transcript.toLowerCase()
  return COMPLEX_KEYWORDS.some(kw => lower.includes(kw)) ? 500 : 300
}

// ─── Herramientas para Claude (solo dashboard) ────────────────────────────────
const TOOLS: Anthropic.Tool[] = [
  {
    name: 'move_prospect_to_stage',
    description: 'Mueve un prospecto a una etapa del pipeline EAM.',
    input_schema: {
      type: 'object' as const,
      properties: {
        name_query:     { type: 'string', description: 'Nombre o parte del nombre del prospecto' },
        target_stage:   { type: 'string', enum: ['exploracion', 'activar', 'maestria'] },
        constructor_id: { type: 'string' },
      },
      required: ['name_query', 'target_stage'],
    },
  },
  {
    name: 'list_prospects',
    description: 'Lista prospectos del pipeline.',
    input_schema: {
      type: 'object' as const,
      properties: {
        stage:          { type: 'string', enum: ['exploracion', 'activar', 'maestria', 'all'] },
        constructor_id: { type: 'string' },
      },
      required: ['constructor_id'],
    },
  },
  {
    name: 'get_pipeline_summary',
    description: 'Resumen del pipeline: conteos por etapa.',
    input_schema: {
      type: 'object' as const,
      properties: {
        constructor_id: { type: 'string' },
      },
      required: ['constructor_id'],
    },
  },
]

// ─── Ejecutores de herramientas ───────────────────────────────────────────────
async function executeTool(name: string, input: Record<string, unknown>): Promise<string> {
  const constructorId = String(input.constructor_id ?? 'unknown')

  if (name === 'move_prospect_to_stage') {
    const nameQuery = String(input.name_query)
    const stage     = String(input.target_stage)
    const { data: matches } = await supabase
      .from('device_info')
      .select('fingerprint, name')
      .eq('invited_by', constructorId)
      .ilike('name', `%${nameQuery}%`)
      .limit(3)
    if (!matches?.length) return `No encontré ningún prospecto con nombre "${nameQuery}".`
    const fp = (matches[0] as { fingerprint: string; name: string }).fingerprint
    const { error } = await supabase.from('nexus_prospects').update({ stage }).eq('fingerprint', fp)
    if (error) return `Error al mover: ${error.message}`
    return `Listo. ${(matches[0] as { name: string }).name} fue movido a ${stageLabel(stage)}.`
  }

  if (name === 'list_prospects') {
    const stage = String(input.stage ?? 'all')
    let q = supabase
      .from('nexus_prospects')
      .select('fingerprint, stage, device_info!inner(name, invited_by)')
      .eq('device_info.invited_by', constructorId)
    if (stage !== 'all') q = q.eq('stage', stage)
    const { data, error } = await q.limit(10)
    if (error) return `Error: ${error.message}`
    if (!data?.length) return 'No hay prospectos en esa etapa.'
    return (data as Array<Record<string, unknown>>)
      .map(p => {
        const di = Array.isArray(p.device_info)
          ? (p.device_info[0] as Record<string, unknown>)
          : (p.device_info as Record<string, unknown>)
        return `• ${di?.name ?? 'Sin nombre'} (${stageLabel(String(p.stage))})`
      })
      .join('\n')
  }

  if (name === 'get_pipeline_summary') {
    const stages = ['exploracion', 'activar', 'maestria'] as const
    const counts: Record<string, number> = {}
    for (const s of stages) {
      // Mismo filtro por constructor que list_prospects — sin él, el resumen
      // mezcla los prospectos de TODOS los constructores (fuga entre cuentas)
      const { count } = await supabase
        .from('nexus_prospects')
        .select('fingerprint, device_info!inner(invited_by)', { count: 'exact', head: true })
        .eq('device_info.invited_by', constructorId)
        .eq('stage', s)
      counts[s] = count ?? 0
    }
    const total = Object.values(counts).reduce((a: number, b: number) => a + b, 0)
    return `Tu pipeline: Exploración ${counts.exploracion}, Activación ${counts.activar}, Multiplicación ${counts.maestria}. Total ${total} prospectos.`
  }

  return `Herramienta "${name}" no reconocida.`
}

function stageLabel(stage: string): string {
  // Clave 'maestria' = valor de etapa en BD (contrato con queswa.app); la etiqueta visible es "Multiplicación"
  const map: Record<string, string> = { exploracion: 'Exploración', activar: 'Activación', maestria: 'Multiplicación' }
  return map[stage] ?? stage
}

// ─── Caché TTS en memoria (warm instance) ────────────────────────────────────
// Recorta llamadas a ElevenLabs cuando una misma frase corta se repite
// (saludos, "Con gusto…", aperturas rotativas). Hit rate moderado en voz libre,
// cero downside.
const TTS_CACHE_TTL = 60 * 60 * 1000 // 1 hora
const TTS_CACHE_MAX = 50
const _ttsCache = new Map<string, { buf: Uint8Array; ts: number }>()

function ttsHash(s: string): string {
  let h = 5381
  for (let i = 0; i < s.length; i++) h = (((h << 5) + h) ^ s.charCodeAt(i)) >>> 0
  return h.toString(36)
}
function ttsCacheSet(key: string, buf: Uint8Array) {
  if (_ttsCache.size >= TTS_CACHE_MAX) _ttsCache.delete(_ttsCache.keys().next().value!)
  _ttsCache.set(key, { buf, ts: Date.now() })
}

// ─── TTS ─────────────────────────────────────────────────────────────────────
const ELEVEN_VOICE_SETTINGS = { stability: 0.5, similarity_boost: 0.8, style: 0.0, use_speaker_boost: true }

function ttsCacheGet(text: string): Uint8Array | null {
  const c = _ttsCache.get(ttsHash(text))
  if (c && Date.now() - c.ts < TTS_CACHE_TTL) return c.buf
  return null
}

// Streaming ElevenLabs: devuelve el ReadableStream del audio para reproducir
// mientras se sintetiza (baja la latencia percibida). null si falla → fallback buffer.
async function elevenLabsStream(text: string): Promise<ReadableStream<Uint8Array> | null> {
  if (!ELEVENLABS_KEY) return null
  try {
    const res = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${ELEVENLABS_VOICE_ID}/stream?optimize_streaming_latency=3`,
      {
        method: 'POST',
        headers: { 'xi-api-key': ELEVENLABS_KEY, 'Content-Type': 'application/json', Accept: 'audio/mpeg' },
        body: JSON.stringify({ text, model_id: 'eleven_flash_v2_5', voice_settings: ELEVEN_VOICE_SETTINGS }),
      },
    )
    if (res.ok && res.body) return res.body
    console.warn(`[Voice] ElevenLabs stream ${res.status} — fallback a OpenAI TTS:`, (await res.text()).substring(0, 120))
  } catch (e) {
    console.warn('[Voice] ElevenLabs stream excepción — fallback a OpenAI TTS:', e instanceof Error ? e.message : e)
  }
  return null
}

// Fallback buffer (OpenAI tts-1) — no streaming. Cachea el resultado.
async function openAIBuffer(text: string): Promise<Uint8Array> {
  const mp3 = await getOpenAI().audio.speech.create({
    model: 'tts-1', voice: 'onyx', input: text, response_format: 'mp3',
  })
  const buf = new Uint8Array(await mp3.arrayBuffer())
  ttsCacheSet(ttsHash(text), buf)
  return buf
}

// ─── POST handler ─────────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  // 1. Audio desde FormData
  let audioBlob: Blob | File | null = null
  try {
    audioBlob = (await request.formData()).get('audio') as Blob | File | null
  } catch {
    return NextResponse.json({ error: 'FormData inválido' }, { status: 400 })
  }
  if (!audioBlob) return NextResponse.json({ error: 'Campo "audio" requerido' }, { status: 400 })

  const tenantId    = request.headers.get('x-tenant-id') ?? 'creatuactivo_marketing'
  const isDashboard = tenantId === 'queswa_dashboard'

  // Resolver constructor_id desde cookie de sesión
  const sessionToken = request.cookies.get('session_token')?.value
  let constructorId = 'unknown'
  if (sessionToken) {
    const { data } = await supabase
      .from('user_sessions')
      .select('private_users!inner(constructor_id)')
      .eq('token', sessionToken)
      .gt('expires_at', new Date().toISOString())
      .single()
    const user = data as Record<string, unknown> | null
    const pu = Array.isArray(user?.private_users)
      ? (user!.private_users as Record<string, unknown>[])[0]
      : (user?.private_users as Record<string, unknown> | null)
    constructorId = String(pu?.constructor_id ?? 'unknown')
  }

  // 2. OÍDO — STT: gpt-4o-mini-transcribe (mitad del costo de whisper-1, ~igual o más rápido)
  //    Fallback a whisper-1 si el modelo no estuviera disponible en la cuenta.
  let transcript = ''
  try {
    const audioFile = new File(
      [await audioBlob.arrayBuffer()],
      'voice.webm',
      { type: audioBlob.type || 'audio/webm' },
    )
    let result
    try {
      result = await getOpenAI().audio.transcriptions.create({
        file: audioFile, model: 'gpt-4o-mini-transcribe', language: 'es',
      })
    } catch (e) {
      console.warn('[Voice] gpt-4o-mini-transcribe falló — fallback a whisper-1:', e instanceof Error ? e.message : e)
      result = await getOpenAI().audio.transcriptions.create({
        file: audioFile, model: 'whisper-1', language: 'es',
      })
    }
    transcript = result.text.trim()
    console.log(`🎙 [Voice] "${transcript}"`)
  } catch (err) {
    console.error('❌ [Voice] STT:', err)
    return NextResponse.json({ error: 'Error de transcripción' }, { status: 500 })
  }

  if (!transcript) return NextResponse.json({ error: 'No se detectó voz' }, { status: 400 })

  // 3. CEREBRO — Claude con prompt de 2 bloques
  let replyText = ''
  try {
    console.log(`🏢 [Voice] tenant=${tenantId} constructor=${constructorId}`)

    // Traer fragmento relevante (vector search + fallback regex) — mismo motor que el chat
    const arsenalFragment = !isDashboard
      ? await fetchRelevantFragment(transcript, tenantId)
      : ''
    if (arsenalFragment) console.log(`🎯 [Voice] fragment=${arsenalFragment.length}chars`)

    // ── Construcción del system prompt en 2 bloques ──────────────────────────
    //
    // BLOQUE 1 — Contenido entrenado (estático, Anthropic lo cachea)
    //   Marketing: prompt nexus_main desde Supabase (caché de módulo, 5 min TTL)
    //   Dashboard: instrucciones de gestión de pipeline
    //
    // BLOQUE 2 — Reglas de voz + vars dinámicas (no se cachea, cambia por request)
    //   Anula las instrucciones de formato del bloque 1 (markdown → audio plano)
    //   Agrega el fragmento RAG relevante cuando aplica
    //   Agrega el constructorId y tenant al final (evita invalidar caché del bloque 1)

    let systemBlocks: Anthropic.TextBlockParam[]

    if (isDashboard) {
      // Dashboard: no necesita el prompt de marketing, usa instrucciones directas
      systemBlocks = [
        {
          type: 'text',
          text: `Queswa — asistente de voz del dashboard Queswa.app.
Constructor activo ID: ${constructorId}.
Tu función: gestión de pipeline EAM, consultas de prospectos y resúmenes de actividad.
Puedes mover prospectos de etapa, listar prospectos y dar resúmenes del pipeline.`,
          cache_control: { type: 'ephemeral' },
        },
        {
          type: 'text',
          text: `REGLAS ABSOLUTAS DE VOZ:
- Máximo 2 oraciones. Una idea por oración.
- Sin markdown, sin asteriscos, sin guiones de lista.
- Escribe "pesos" no "$", "por ciento" no "%".
- Tono directo, español colombiano formal (usted). Nunca menciones que eres IA.`,
        },
      ]
    } else {
      // Marketing: bloque 1 = prompt entrenado completo desde Supabase (cacheado por Anthropic)
      const trainedPrompt = await getPromptForTenant(tenantId)
      const voiceOverride = [
        `── MODO VOZ ACTIVO ── (estas reglas prevalecen sobre cualquier instrucción de formato anterior)`,
        `- Responde en MÁXIMO 2 oraciones cortas. Una sola idea por oración.`,
        `- Sin markdown, sin asteriscos, sin guiones, sin listas, sin emojis.`,
        `- Escribe "pesos" no "$", "por ciento" no "%", "Expansión" no "EXPANSIÓN".`,
        `- Tono: directo, español colombiano formal (usted). Nunca menciones que eres IA.`,
        arsenalFragment
          ? `\nFUENTE DE VERDAD PARA ESTA CONSULTA (úsala exactamente):\n${arsenalFragment}`
          : '',
        `\nContexto: tenant=${tenantId}`,
      ].filter(Boolean).join('\n')

      systemBlocks = [
        {
          type: 'text',
          text: trainedPrompt,
          cache_control: { type: 'ephemeral' }, // Anthropic cachea este bloque
        },
        {
          type: 'text',
          text: voiceOverride,
          // Sin cache_control: este bloque tiene vars dinámicas (arsenalFragment, tenantId)
        },
      ]
    }

    const messages: Anthropic.MessageParam[] = [{ role: 'user', content: transcript }]
    const maxTokens = getMaxTokens(transcript)

    let response = await getAnthropic().messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: maxTokens,
      system: systemBlocks,
      ...(isDashboard ? { tools: TOOLS } : {}),
      messages,
    })

    let turns = 0
    while (isDashboard && response.stop_reason === 'tool_use' && turns < 3) {
      turns++
      const toolResults: Anthropic.ToolResultBlockParam[] = []
      for (const block of response.content) {
        if (block.type !== 'tool_use') continue
        const result = await executeTool(block.name, (block.input ?? {}) as Record<string, unknown>)
        toolResults.push({ type: 'tool_result', tool_use_id: block.id, content: result })
      }
      messages.push({ role: 'assistant', content: response.content })
      messages.push({ role: 'user', content: toolResults })
      response = await getAnthropic().messages.create({
        model: 'claude-haiku-4-5-20251001', max_tokens: maxTokens, system: systemBlocks, tools: TOOLS, messages,
      })
    }

    replyText = response.content
      .filter((b): b is Anthropic.TextBlock => b.type === 'text')
      .map(b => b.text)
      .join(' ')
      .trim()

    console.log(`🧠 [Voice] "${replyText}"`)
  } catch (err) {
    console.error('❌ [Voice] Claude:', err)
    return NextResponse.json({ error: 'Error de procesamiento' }, { status: 500 })
  }

  // 4. VOZ — streaming ElevenLabs (baja latencia) → fallback buffer OpenAI
  const baseHeaders: Record<string, string> = {
    'Content-Type':  'audio/mpeg',
    'x-transcript':  encodeURIComponent(transcript),
    'x-reply':       encodeURIComponent(replyText),
    'Cache-Control': 'no-store',
  }
  try {
    const ttsText = normalizarParaVoz(replyText)
    console.log(`🔤 [Voice] TTS input: "${ttsText}"`)

    // a) Cache hit → buffer inmediato
    const cached = ttsCacheGet(ttsText)
    if (cached) {
      console.log(`🗃 [Voice] TTS cache hit`)
      return new NextResponse(cached.buffer as ArrayBuffer, {
        status: 200, headers: { ...baseHeaders, 'Content-Length': String(cached.length) },
      })
    }

    // b) Streaming ElevenLabs → el cliente reproduce mientras se sintetiza.
    //    tee(): una rama al cliente, la otra se acumula y puebla el caché —
    //    sin esto el caché solo guardaba el fallback OpenAI y las frases
    //    repetidas pagaban ElevenLabs cada vez.
    const stream = await elevenLabsStream(ttsText)
    if (stream) {
      console.log(`🔊 [Voice] TTS streaming`)
      const [toClient, toCache] = stream.tee()
      void (async () => {
        try {
          const reader = toCache.getReader()
          const chunks: Uint8Array[] = []
          let total = 0
          for (;;) {
            const { done, value } = await reader.read()
            if (done) break
            chunks.push(value)
            total += value.length
          }
          if (total === 0) return
          const buf = new Uint8Array(total)
          let off = 0
          for (const c of chunks) { buf.set(c, off); off += c.length }
          ttsCacheSet(ttsHash(ttsText), buf)
        } catch { /* caché best-effort — nunca afecta la respuesta */ }
      })()
      return new NextResponse(toClient, { status: 200, headers: baseHeaders })
    }

    // c) Fallback buffer (OpenAI tts-1)
    const buf = await openAIBuffer(ttsText)
    console.log(`🔊 [Voice] TTS fallback buffer ${buf.length} bytes`)
    return new NextResponse(buf.buffer as ArrayBuffer, {
      status: 200, headers: { ...baseHeaders, 'Content-Length': String(buf.length) },
    })
  } catch (err) {
    console.error('❌ [Voice] TTS:', err)
    return NextResponse.json({ error: 'Error de síntesis', fallback_reply: replyText }, { status: 500 })
  }
}
