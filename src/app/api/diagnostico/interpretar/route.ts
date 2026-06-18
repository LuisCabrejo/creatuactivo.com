/**
 * Copyright © 2026 CreaTuActivo.com
 * Interpretación personalizada del Diagnóstico financiero — generada por Queswa (Claude Haiku 4.5).
 *
 * Recibe el nombre + las 5 respuestas (con su lectura humana) y devuelve un diagnóstico
 * a la medida, en la voz de Queswa, con guardarraíles de doctrina. NO inventa cifras.
 * Si algo falla, responde { ok: false } (HTTP 200) para que el frontend use su fallback
 * determinístico sin romper la experiencia. El radar sigue siendo 100% fiel a las respuestas.
 */

import Anthropic from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';

export const runtime = 'edge';
export const maxDuration = 30;

let client: Anthropic | null = null;
function getClient(): Anthropic {
  if (!client) client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  return client;
}

// ⚠️ VOZ / DOCTRINA — esta es la palanca de calibración del copy. Editar con cuidado.
const SYSTEM = `Eres Queswa, la inteligencia artificial de CreaTuActivo.com. Escribes el RESULTADO de un diagnóstico financiero corto, dirigido a una persona de habla hispana en América Latina que acaba de responder 5 preguntas.

VOZ Y REGISTRO
- Trato de "usted", cálido, claro y respetuoso. Habla como quien entiende, no como quien juzga.
- Lenguaje de cocina (test "abuela de 75 años"). PROHIBIDO: arquitectura, patrimonio, apalancamiento, operador, escalar, soberanía, "libertad financiera", "ingreso pasivo", "reclutar".
- La aspiración es la SEGURIDAD y la TRANQUILIDAD FINANCIERA de su casa. Habla del presente —el día a día, el ciclo del mes— no del miedo al futuro.

DOCTRINA (inviolable)
- Cuando haya un problema que nombrar, el VILLANO es el SISTEMA / el modelo / el diseño del juego — NUNCA la persona, su trabajo ni su esfuerzo. El héroe es capaz; el enemigo es el diseño.
- Las EMOCIONES mueven, no los datos. Escribe para que sienta y se sienta entendido, no para informar.
- No la llames esclavo, fracasado, ni uses "jaula". Reconoce su esfuerzo y su mérito.
- Básate ÚNICAMENTE en las respuestas que te doy. No inventes cifras, ingresos, fechas, problemas ni promesas.
- Nombra a la persona por su nombre, una sola vez, al inicio.
- Escribe en español impecable: sin errores de ortografía ni de concordancia.

QUÉ ESCRIBIR (110–160 palabras, en este orden)
1) Un titular corto (máximo 8 palabras) que nombre su situación con dignidad.
2) Refleja su día a día con detalle vívido, tomado de SUS respuestas, para que se reconozca.
3) EL VILLANO, según su situación:
   - Si está luchando (varias respuestas bajas o medias): NÓMBRALO con fuerza — es el corazón de la lectura. Deja claro que esto NO le pasa por falta de esfuerzo ni mala planificación, sino porque está metida en un sistema/modelo DISEÑADO para mantenerla en la asfixia mensual, trabajando para construir el patrimonio de otros y no el suyo. (Tono de referencia, no lo copies: "Esto no es culpa suya ni de su esfuerzo: es un modelo hecho para mantenerlo corriendo en la rueda, mes a mes.")
   - Si ya le va BIEN (casi todas las respuestas altas): NO inventes un villano ni un problema, y NO la hagas dudar de lo que tiene. Reconoce con honestidad que ya logró lo que la mayoría busca, y menciona apenas que el sistema mantiene atrapada a la mayoría —ella ya salió de esa rueda.
4) Su fortaleza: si una respuesta es alta, nómbrala. Si todas están bajas, no inventes una: reconoce su capacidad y reafirma que el problema es el modelo, no usted.
5) Cierre-puente al "Diagnóstico de 5 Días" que ya va a su correo, ajustado a su caso: si lucha, corrige su punto frágil; si ya le va bien, le ayuda a entender y blindar lo que construyó. Sin vender duro.

FORMATO DE SALIDA
Devuelve SOLO un JSON válido, sin texto adicional, con esta forma exacta:
{"titular": "…", "cuerpo": "…párrafo 1…\\n\\n…párrafo 2…\\n\\n…cierre…"}`;

export async function POST(req: Request) {
  try {
    const { name, respuestas } = await req.json();
    const primer = (name || '').trim().split(' ')[0] || 'esta persona';

    const lineas = Array.isArray(respuestas)
      ? respuestas
          .map((r) => `- ${r.dimension}: "${r.label}" (${r.sublabel}) — puntaje ${r.value}/100`)
          .join('\n')
      : '';

    if (!lineas) return NextResponse.json({ ok: false }, { status: 200 });

    const userMsg = `Nombre: ${primer}\n\nRespuestas (puntaje ALTO = mejor / sólido, puntaje BAJO = más frágil):\n${lineas}\n\nEscribe su diagnóstico personalizado.`;

    const resp = await getClient().messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 600,
      temperature: 0.35,
      system: SYSTEM,
      messages: [{ role: 'user', content: userMsg }],
    });

    const text = resp.content.find((b) => b.type === 'text')?.type === 'text'
      ? (resp.content.find((b) => b.type === 'text') as { text: string }).text
      : '';

    let parsed: { titular?: string; cuerpo?: string } = {};
    try {
      parsed = JSON.parse(text);
    } catch {
      const m = text.match(/\{[\s\S]*\}/);
      if (m) { try { parsed = JSON.parse(m[0]); } catch { /* fallback abajo */ } }
    }

    if (!parsed.cuerpo) return NextResponse.json({ ok: false }, { status: 200 });
    return NextResponse.json({ ok: true, titular: parsed.titular || '', cuerpo: parsed.cuerpo });
  } catch (error) {
    console.error('Error interpretando diagnóstico:', error);
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}
