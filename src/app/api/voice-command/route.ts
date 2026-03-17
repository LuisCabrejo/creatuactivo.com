/**
 * /api/voice-command — Motor Cognitivo de Voz
 * Queswa.app — FASE B
 *
 * Pipeline:
 *   1. 🎙 OÍDO     → Whisper (OpenAI) — audio a texto
 *   2. 🧠 CEREBRO  → Claude Sonnet — intención + herramientas Supabase
 *   3. 🔊 VOZ      → ElevenLabs TTS — texto a audio
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

// ─── ElevenLabs TTS ───────────────────────────────────────────────────────────
async function textToSpeech(text: string): Promise<Uint8Array> {
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
        model_id: 'eleven_multilingual_v2',
        voice_settings: { stability: 0.5, similarity_boost: 0.8, style: 0.0, use_speaker_boost: true },
      }),
    },
  )
  if (!res.ok) throw new Error(`ElevenLabs ${res.status}: ${await res.text()}`)
  return new Uint8Array(await res.arrayBuffer())
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
    const system = `Eres Queswa, asistente de voz del dashboard de Queswa.app. Hablas en español colombiano formal (usted). El constructor actual tiene ID: ${constructorId}. Responde en máximo 2 frases cortas — el texto será convertido a audio. Sin markdown, sin listas.`
    const messages: Anthropic.MessageParam[] = [{ role: 'user', content: transcript }]

    let response = await getAnthropic().messages.create({
      model: 'claude-sonnet-4-6', max_tokens: 256, system, tools: TOOLS, messages,
    })

    let turns = 0
    while (response.stop_reason === 'tool_use' && turns < 3) {
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
        model: 'claude-sonnet-4-6', max_tokens: 256, system, tools: TOOLS, messages,
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
