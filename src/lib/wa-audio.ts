/**
 * Copyright © 2026 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * Notas de voz entrantes por WhatsApp → texto.
 *
 * Por qué existe: en América Latina el audio no es una excepción, es la forma
 * natural de explicar algo largo o con matices. Obligar a teclear un contexto
 * complejo es una barrera severa de usabilidad — y hasta hoy el webhook leía
 * únicamente `message.text.body`, así que quien mandaba una nota de voz recibía
 * silencio absoluto. El peor fallo posible en un canal de captación.
 *
 * Qué NO hace: responder en voz. La investigación desaconseja la voz sintética
 * en este flujo (riesgo de valle inquietante); se procesa el audio y se responde
 * en texto, que es la adaptación que el usuario espera.
 *
 * Mismo motor de transcripción que /api/voice-command, para no tener dos verdades.
 */

import OpenAI from 'openai';
import { downloadMedia } from '@/lib/wa-channel';

let _openai: OpenAI | null = null;
function getOpenAI(): OpenAI {
  if (!_openai) _openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY ?? '' });
  return _openai;
}

/** Extensión que espera el endpoint de transcripción a partir del MIME de Meta. */
function extensionPara(mimeType: string): string {
  if (mimeType.includes('mpeg')) return 'mp3';
  if (mimeType.includes('mp4') || mimeType.includes('m4a')) return 'm4a';
  if (mimeType.includes('wav')) return 'wav';
  if (mimeType.includes('webm')) return 'webm';
  return 'ogg';   // WhatsApp entrega audio/ogg; codec opus
}

/**
 * Descarga la nota de voz y la transcribe.
 *
 * Nunca lanza: ante cualquier fallo devuelve `null` y el llamador decide qué
 * responderle a la persona. Degradar a "no le entendí" es aceptable; dejar el
 * webhook caído no lo es.
 */
export async function transcribirNotaDeVoz(mediaId: string): Promise<string | null> {
  const { media, error } = await downloadMedia(mediaId);
  if (!media) {
    console.error('❌ [WA Audio] No se pudo descargar la nota de voz:', error);
    return null;
  }

  try {
    const archivo = new File(
      [media.buffer],
      `nota.${extensionPara(media.mimeType)}`,
      { type: media.mimeType },
    );

    let resultado;
    try {
      resultado = await getOpenAI().audio.transcriptions.create({
        file: archivo, model: 'gpt-4o-mini-transcribe', language: 'es',
      });
    } catch (e) {
      console.warn('[WA Audio] gpt-4o-mini-transcribe falló — fallback a whisper-1:',
        e instanceof Error ? e.message : e);
      resultado = await getOpenAI().audio.transcriptions.create({
        file: archivo, model: 'whisper-1', language: 'es',
      });
    }

    const texto = resultado.text.trim();
    if (!texto) {
      console.warn('[WA Audio] Transcripción vacía');
      return null;
    }

    console.log(`🎙 [WA Audio] "${texto}"`);
    return texto;

  } catch (err) {
    console.error('❌ [WA Audio] Error de transcripción:', err instanceof Error ? err.message : err);
    return null;
  }
}
