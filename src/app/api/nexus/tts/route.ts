/**
 * /api/nexus/tts — Text-to-Speech con ElevenLabs
 * Queswa Ecosystem — Voz pública en creatuactivo.com
 *
 * POST { text: string }
 * Devuelve: audio/mpeg
 *
 * Mismo voice ID que voice-command para coherencia de marca.
 */

export const runtime     = 'edge';
export const maxDuration = 30;

const ELEVENLABS_VOICE_ID = process.env.ELEVENLABS_VOICE_ID ?? 'EXAVITQu4vr4xnSDxMaL';

// Limpia markdown antes de enviar a TTS
function stripMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1')   // bold
    .replace(/\*(.*?)\*/g, '$1')        // italic
    .replace(/#{1,6}\s/g, '')           // headings
    .replace(/`{1,3}[^`]*`{1,3}/g, '') // code
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // links
    .replace(/^\s*[-*+]\s/gm, '')       // bullets
    .replace(/\n{2,}/g, '. ')           // double newlines → pause
    .replace(/\n/g, ' ')
    .trim();
}

export async function POST(req: Request) {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'ELEVENLABS_API_KEY no configurada' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  let text: string;
  try {
    const body = await req.json();
    text = String(body.text ?? '').trim();
  } catch {
    return new Response(JSON.stringify({ error: 'Body inválido' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  if (!text) {
    return new Response(JSON.stringify({ error: 'Campo text requerido' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Limitar longitud para TTS (ElevenLabs tiene límite de caracteres)
  const cleanText = stripMarkdown(text).substring(0, 2500);

  try {
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
          text: cleanText,
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
      console.error('[TTS] ElevenLabs error:', res.status, err.substring(0, 200));
      return new Response(JSON.stringify({ error: `ElevenLabs ${res.status}` }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const audioBuffer = await res.arrayBuffer();

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
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
