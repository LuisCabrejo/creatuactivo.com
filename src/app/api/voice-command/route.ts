/**
 * /api/voice-command — Motor Cognitivo de Voz
 * Queswa Ecosystem — Multi-Tenant (FASE C)
 *
 * Pipeline:
 *   1. 🎙 OÍDO     → Whisper (OpenAI) — audio a texto
 *   2. 🧠 CEREBRO  → Claude Sonnet — intención + herramientas Supabase
 *   3. 🔊 VOZ      → ElevenLabs TTS — texto a audio
 *
 * Multi-tenant: x-tenant-id inyectado por middleware.ts
 * System prompt cargado dinámicamente desde get_tenant_system_prompt RPC
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

// ─── Clientes lazy (no se instancian en build) ────────────────────────────────
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

// ─── System prompt cache (particionado por tenant) ────────────────────────────
const promptCache = new Map<string, { content: string; ts: number }>()
const PROMPT_TTL  = 5 * 60 * 1000 // 5 minutos

// Fallback si la RPC no devuelve prompt para el tenant
const FALLBACK_VOICE_PROMPT = 'Eres Queswa, asistente de voz de CreaTuActivo. Hablas en español colombiano formal (usted). Responde en máximo 2 frases cortas — el texto será convertido a audio. Sin markdown, sin listas.'

// ─── Sufijo TTS — se añade a TODO system prompt de voz ───────────────────────
// Garantiza fonética natural y brevedad independientemente del prompt base
const VOICE_TTS_SUFFIX = `

REGLAS ESTRICTAS PARA AUDIO (texto a voz — TTS):
- Máximo 4-5 oraciones por respuesta. Si la pregunta requiere explicación, puedes extenderte hasta 6.
- NUNCA uses símbolos: $, %, +, /, =, #.
- NUNCA uses abreviaturas ni siglas sin expandir. Escribe todo en palabras:
  · "100M USD" → "cien millones de dólares"
  · "$110.990 COP" → "ciento diez mil novecientos noventa pesos colombianos"
  · "E.A.M." → "E A M" (pausa entre letras)
  · "%" → "por ciento"
  · "km²" → "kilómetros cuadrados"
- Escribe los números completos cuando sean clave (no "100M", sí "cien millones").
- Habla de forma conversacional y fluida, como si explicaras en persona.
- Sin viñetas, sin listas, sin markdown de ningún tipo.`

async function getTenantSystemPrompt(tenantId: string): Promise<string> {
  const cached = promptCache.get(tenantId)
  if (cached && (Date.now() - cached.ts) < PROMPT_TTL) return cached.content

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase.rpc as any)(
      'get_tenant_system_prompt',
      { p_tenant_id: tenantId }
    )
    const row = Array.isArray(data) ? data[0] : data
    const prompt: string = (!error && row?.prompt) ? String(row.prompt) : FALLBACK_VOICE_PROMPT
    if (error) console.warn(`[Voice] prompt RPC error (${tenantId}):`, error.message)
    promptCache.set(tenantId, { content: prompt, ts: Date.now() })
    return prompt
  } catch (err) {
    console.error('[Voice] getTenantSystemPrompt exception:', err)
    return FALLBACK_VOICE_PROMPT
  }
}

// ─── Herramientas para Claude ─────────────────────────────────────────────────
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
  // Intento primario: ElevenLabs
  if (ELEVENLABS_KEY) {
    const res = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${ELEVENLABS_VOICE_ID}`,
      {
        method: 'POST',
        headers: {
          'xi-api-key': ELEVENLABS_KEY,
          'Content-Type': 'application/json',
          Accept: 'audio/mpeg',
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_turbo_v2_5',
          voice_settings: { stability: 0.5, similarity_boost: 0.8, style: 0.0, use_speaker_boost: true },
        }),
      },
    )
    if (res.ok) return new Uint8Array(await res.arrayBuffer())
    const err = await res.text()
    console.warn(`[Voice] ElevenLabs ${res.status} — fallback a OpenAI TTS:`, err.substring(0, 120))
  }

  // Fallback: OpenAI TTS (tts-1, voz onyx — profunda, autoridad de marca)
  const mp3 = await getOpenAI().audio.speech.create({
    model: 'tts-1',
    voice: 'onyx',
    input: text,
    response_format: 'mp3',
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

  // 3. CEREBRO — Claude + herramientas
  let replyText = ''
  try {
    const tenantId    = request.headers.get('x-tenant-id') ?? 'creatuactivo_marketing'
    const basePrompt  = await getTenantSystemPrompt(tenantId)
    const isDashboard = tenantId === 'queswa_dashboard'
    // Sufijo TTS siempre presente + constructor_id solo en dashboard
    const system      = isDashboard
      ? `${basePrompt}\n\nConstructor activo en sesión: ${constructorId}.${VOICE_TTS_SUFFIX}`
      : `${basePrompt}${VOICE_TTS_SUFFIX}`
    console.log(`🏢 [Voice] tenant=${tenantId} constructor=${constructorId}`)
    const messages: Anthropic.MessageParam[] = [{ role: 'user', content: transcript }]

    let response = await getAnthropic().messages.create({
      model: 'claude-haiku-4-5-20251001', max_tokens: 280, system,
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
        model: 'claude-haiku-4-5-20251001', max_tokens: 280, system, tools: TOOLS, messages,
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

  // 4. VOZ — ElevenLabs
  let audioBytes: Uint8Array
  try {
    audioBytes = await textToSpeech(replyText)
    console.log(`🔊 [Voice] TTS ${audioBytes.length} bytes`)
  } catch (err) {
    console.error('❌ [Voice] ElevenLabs:', err)
    return NextResponse.json({ error: 'Error de síntesis', fallback_reply: replyText }, { status: 500 })
  }

  // 5. Devolver audio + metadata en headers
  return new NextResponse(audioBytes.buffer as ArrayBuffer, {
    status: 200,
    headers: {
      'Content-Type': 'audio/mpeg',
      'Content-Length': String(audioBytes.length),
      'x-transcript': encodeURIComponent(transcript),
      'x-reply':      encodeURIComponent(replyText),
      'Cache-Control': 'no-store',
    },
  })
}
