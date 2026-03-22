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

// ─── Caché de módulo para el system prompt entrenado ─────────────────────────
// En serverless, persiste mientras la instancia esté caliente (minutos/horas).
// Cold start: 1 query a Supabase (~150-300ms). Warm: 0ms.
let _promptCache: string | null = null
let _promptCacheTime = 0
const PROMPT_TTL = 5 * 60 * 1000 // 5 minutos

const FALLBACK_PROMPT = `Eres Queswa, asistente de CreaTuActivo.com y la Red de Valor Gano Excel.
CreaTuActivo.com es el ecosistema creado por Luis Cabrejo para construir activos empresariales con Gano Excel como motor de distribución.
Gano Excel distribuye productos de bienestar con Ganoderma lucidum (hongo reishi): cafés, suplementos, nutrición. Son consumibles de alta rotación.
El Tridente EAM es la metodología: Expansión (invitar, abrir puertas) → Activación (consultoría, comprometidos) → Maestría (onboarding, duplicación).
Los paquetes de inicio son ESP-1, ESP-2 y ESP-3. No es un esquema piramidal: los ingresos vienen del consumo real de productos.
Queswa.app es el dashboard privado para Arquitectos de Activos activos.`

async function getMarketingPrompt(): Promise<string> {
  if (_promptCache && Date.now() - _promptCacheTime < PROMPT_TTL) return _promptCache
  try {
    const { data } = await supabase
      .from('system_prompts')
      .select('content')
      .eq('name', 'nexus_main')
      .single()
    if (data?.content) {
      _promptCache = data.content
      _promptCacheTime = Date.now()
      console.log(`✅ [Voice] Prompt entrenado cargado (${data.content.length} chars)`)
      return _promptCache!
    }
  } catch (e) {
    console.warn('⚠️ [Voice] No se pudo cargar prompt de Supabase, usando fallback:', e)
  }
  return FALLBACK_PROMPT
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
    /tridente.*eam/i, /expansión/i, /activación/i, /maestría/i,
    /cómo.*empez/i, /primer.*paso/i, /siguiente.*paso/i,
  ]
  if (inicial.some(p => p.test(m))) return 'arsenal_inicial'

  return null
}

// ─── Fetch del fragmento más relevante de nexus_documents ────────────────────
async function fetchArsenalFragment(category: string, query: string): Promise<string> {
  try {
    const { data } = await supabase
      .from('nexus_documents')
      .select('title, content')
      .like('category', `${category}%`)
      .textSearch('content', query.split(' ').filter(w => w.length > 3).slice(0, 5).join(' | '), { config: 'spanish' })
      .limit(1)
      .single()
    if (data?.content) return `FUENTE DE VERDAD (${data.title}):\n${data.content.substring(0, 1200)}`
  } catch { /* fallback silencioso */ }

  // Si textSearch no encuentra, traer el primero de esa categoría
  try {
    const { data } = await supabase
      .from('nexus_documents')
      .select('title, content')
      .like('category', `${category}%`)
      .limit(1)
      .single()
    if (data?.content) return `FUENTE DE VERDAD (${data.title}):\n${data.content.substring(0, 1200)}`
  } catch { /* sin fragmento */ }

  return ''
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
      const { count } = await supabase
        .from('nexus_prospects')
        .select('fingerprint', { count: 'exact', head: true })
        .eq('stage', s)
      counts[s] = count ?? 0
    }
    const total = Object.values(counts).reduce((a: number, b: number) => a + b, 0)
    return `Tu pipeline: Exploración ${counts.exploracion}, Activación ${counts.activar}, Maestría ${counts.maestria}. Total ${total} prospectos.`
  }

  return `Herramienta "${name}" no reconocida.`
}

function stageLabel(stage: string): string {
  const map: Record<string, string> = { exploracion: 'Exploración', activar: 'Activación', maestria: 'Maestría' }
  return map[stage] ?? stage
}

// ─── TTS con fallback ElevenLabs → OpenAI ────────────────────────────────────
async function textToSpeech(text: string): Promise<Uint8Array> {
  if (ELEVENLABS_KEY) {
    const res = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${ELEVENLABS_VOICE_ID}`,
      {
        method: 'POST',
        headers: { 'xi-api-key': ELEVENLABS_KEY, 'Content-Type': 'application/json', Accept: 'audio/mpeg' },
        body: JSON.stringify({
          text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: { stability: 0.5, similarity_boost: 0.8, style: 0.0, use_speaker_boost: true },
        }),
      },
    )
    if (res.ok) return new Uint8Array(await res.arrayBuffer())
    const err = await res.text()
    console.warn(`[Voice] ElevenLabs ${res.status} — fallback a OpenAI TTS:`, err.substring(0, 120))
  }

  const mp3 = await getOpenAI().audio.speech.create({
    model: 'tts-1', voice: 'onyx', input: text, response_format: 'mp3',
  })
  return new Uint8Array(await mp3.arrayBuffer())
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

  // 2. OÍDO — Whisper
  let transcript = ''
  try {
    const audioFile = new File(
      [await audioBlob.arrayBuffer()],
      'voice.webm',
      { type: audioBlob.type || 'audio/webm' },
    )
    const result = await getOpenAI().audio.transcriptions.create({
      file: audioFile, model: 'whisper-1', language: 'es',
    })
    transcript = result.text.trim()
    console.log(`🎙 [Voice] "${transcript}"`)
  } catch (err) {
    console.error('❌ [Voice] Whisper:', err)
    return NextResponse.json({ error: 'Error de transcripción' }, { status: 500 })
  }

  if (!transcript) return NextResponse.json({ error: 'No se detectó voz' }, { status: 400 })

  // 3. CEREBRO — Claude con prompt de 2 bloques
  let replyText = ''
  try {
    console.log(`🏢 [Voice] tenant=${tenantId} constructor=${constructorId}`)

    // Clasificar + traer fragmento relevante (en paralelo con lo que sigue)
    const arsenalCategory = classifyVoiceQuery(transcript)
    const arsenalFragment = arsenalCategory && !isDashboard
      ? await fetchArsenalFragment(arsenalCategory, transcript)
      : ''
    if (arsenalCategory) console.log(`🎯 [Voice] category=${arsenalCategory} fragment=${arsenalFragment.length}chars`)

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
      const trainedPrompt = await getMarketingPrompt()
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

  // 4. VOZ — ElevenLabs → OpenAI fallback
  let audioBytes: Uint8Array
  try {
    audioBytes = await textToSpeech(replyText)
    console.log(`🔊 [Voice] TTS ${audioBytes.length} bytes`)
  } catch (err) {
    console.error('❌ [Voice] TTS:', err)
    return NextResponse.json({ error: 'Error de síntesis', fallback_reply: replyText }, { status: 500 })
  }

  return new NextResponse(audioBytes.buffer as ArrayBuffer, {
    status: 200,
    headers: {
      'Content-Type':   'audio/mpeg',
      'Content-Length': String(audioBytes.length),
      'x-transcript':   encodeURIComponent(transcript),
      'x-reply':        encodeURIComponent(replyText),
      'Cache-Control':  'no-store',
    },
  })
}
