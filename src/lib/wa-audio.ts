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
 *
 * ⚠️ RESPALDO CON ELEVENLABS SCRIBE (2 sep 2026): la llave de OpenAI amaneció
 * revocada (401 en ambos modelos) y un prospecto real —Edilberto— mandó cuatro
 * notas de voz que recibieron cuatro veces el acuse de «no logré escuchar».
 * La llave de ElevenLabs (la misma del TTS) sí vive y su Scribe transcribe
 * bien en español, así que entra como tercera pata: OpenAI → Scribe → null.
 * Si OpenAI devuelve 401, el segundo modelo ni se intenta — va a fallar igual.
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

  const archivo = new File(
    [media.buffer],
    `nota.${extensionPara(media.mimeType)}`,
    { type: media.mimeType },
  );

  try {
    let resultado;
    try {
      resultado = await getOpenAI().audio.transcriptions.create({
        file: archivo, model: 'gpt-4o-mini-transcribe', language: 'es',
      });
    } catch (e) {
      // Con la llave revocada (401) el segundo modelo falla idéntico: directo a Scribe.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((e as any)?.status === 401) throw e;
      console.warn('[WA Audio] gpt-4o-mini-transcribe falló — fallback a whisper-1:',
        e instanceof Error ? e.message : e);
      resultado = await getOpenAI().audio.transcriptions.create({
        file: archivo, model: 'whisper-1', language: 'es',
      });
    }

    const texto = resultado.text.trim();
    if (texto) {
      console.log(`🎙 [WA Audio] "${texto}"`);
      return texto;
    }
    console.warn('[WA Audio] Transcripción vacía — se intenta con Scribe');
  } catch (err) {
    console.error('❌ [WA Audio] OpenAI falló — se intenta con Scribe:', err instanceof Error ? err.message : err);
  }

  return transcribirConScribe(archivo);
}

/**
 * ElevenLabs Scribe como tercera pata. Verificado el 2 sep 2026 con audio real:
 * transcripción exacta en español. Nunca lanza.
 */
async function transcribirConScribe(archivo: File): Promise<string | null> {
  const key = process.env.ELEVENLABS_API_KEY;
  if (!key) {
    console.error('❌ [WA Audio] Sin ELEVENLABS_API_KEY — no hay respaldo de transcripción');
    return null;
  }
  try {
    const form = new FormData();
    form.append('model_id', 'scribe_v1');
    form.append('file', archivo);
    form.append('language_code', 'es');
    const res = await fetch('https://api.elevenlabs.io/v1/speech-to-text', {
      method: 'POST', headers: { 'xi-api-key': key }, body: form,
    });
    if (!res.ok) {
      console.error(`❌ [WA Audio] Scribe ${res.status}:`, (await res.text()).slice(0, 200));
      return null;
    }
    const j = await res.json() as { text?: string };
    const texto = (j.text ?? '').trim();
    if (!texto) { console.warn('[WA Audio] Scribe devolvió vacío'); return null; }
    console.log(`🎙 [WA Audio · Scribe] "${texto}"`);
    return texto;
  } catch (err) {
    console.error('❌ [WA Audio] Scribe error:', err instanceof Error ? err.message : err);
    return null;
  }
}
