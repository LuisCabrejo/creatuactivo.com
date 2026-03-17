/**
 * /api/nexus/tts — Text-to-Speech con ElevenLabs + fallback OpenAI
 * Queswa Ecosystem — Voz pública en creatuactivo.com
 *
 * POST { text: string }
 * Devuelve: audio/mpeg
 *
 * Cadena: ElevenLabs (primario) → OpenAI tts-1 (fallback si quota/error)
 */

export const runtime     = 'edge';
export const maxDuration = 30;

const ELEVENLABS_VOICE_ID = process.env.ELEVENLABS_VOICE_ID ?? 'EXAVITQu4vr4xnSDxMaL';
const OPENAI_TTS_VOICE    = 'onyx'; // Deep, authoritative — coherente con la marca

// Limpia markdown antes de enviar a TTS
function stripMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/#{1,6}\s/g, '')
    .replace(/`{1,3}[^`]*`{1,3}/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/^\s*[-*+]\s/gm, '')
    .replace(/\n{2,}/g, '. ')
    .replace(/\n/g, ' ')
    .trim();
}

async function elevenLabsTTS(text: string, apiKey: string): Promise<ArrayBuffer | null> {
  const res = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${ELEVENLABS_VOICE_ID}`,
    {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
        Accept: 'audio/mpeg',
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.55,
          similarity_boost: 0.80,
          style: 0.0,
          use_speaker_boost: true,
        },
      }),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    console.warn('[TTS] ElevenLabs fallback activado:', res.status, err.substring(0, 120));
    return null; // señal para usar fallback
  }
  return res.arrayBuffer();
}

async function openAITTS(text: string, apiKey: string): Promise<ArrayBuffer> {
  const res = await fetch('https://api.openai.com/v1/audio/speech', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'tts-1',
      voice: OPENAI_TTS_VOICE,
      input: text,
      response_format: 'mp3',
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenAI TTS ${res.status}: ${err.substring(0, 120)}`);
  }
  return res.arrayBuffer();
}

export async function POST(req: Request) {
  let text: string;
  try {
    const body = await req.json();
    text = String(body.text ?? '').trim();
  } catch {
    return new Response(JSON.stringify({ error: 'Body inválido' }), {
      status: 400, headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!text) {
    return new Response(JSON.stringify({ error: 'Campo text requerido' }), {
      status: 400, headers: { 'Content-Type': 'application/json' },
    });
  }

  const cleanText     = stripMarkdown(text).substring(0, 2500);
  const elevenKey     = process.env.ELEVENLABS_API_KEY ?? '';
  const openaiKey     = process.env.OPENAI_API_KEY     ?? '';

  try {
    let audioBuffer: ArrayBuffer | null = null;

    // Intento primario: ElevenLabs
    if (elevenKey) {
      audioBuffer = await elevenLabsTTS(cleanText, elevenKey);
    }

    // Fallback: OpenAI TTS
    if (!audioBuffer) {
      if (!openaiKey) {
        return new Response(JSON.stringify({ error: 'Sin proveedor TTS disponible' }), {
          status: 503, headers: { 'Content-Type': 'application/json' },
        });
      }
      audioBuffer = await openAITTS(cleanText, openaiKey);
    }

    return new Response(audioBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': String(audioBuffer.byteLength),
        'Cache-Control': 'no-store',
      },
    });

  } catch (err) {
    console.error('[TTS] Exception:', err);
    return new Response(JSON.stringify({ error: 'Error de síntesis' }), {
      status: 500, headers: { 'Content-Type': 'application/json' },
    });
  }
}
