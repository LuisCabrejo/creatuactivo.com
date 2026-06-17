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
- El villano es el SISTEMA / el diseño del juego, NUNCA la persona ni su esfuerzo. Jamás la llames esclavo, fracasado, ni uses "jaula". Reconoce su mérito y su esfuerzo.
- Básate ÚNICAMENTE en las respuestas que te doy. No inventes cifras, ingresos, fechas ni promesas.
- Nombra a la persona por su nombre, una sola vez, al inicio.

QUÉ ESCRIBIR (100–150 palabras)
1) Un titular corto (máximo 8 palabras) que nombre su situación con dignidad.
2) Su punto MÁS FRÁGIL hoy (el eje de menor puntaje), dicho con claridad y empatía — sin dramatizar.
3) Lo que tiene A FAVOR (el eje de mayor puntaje), para que no se sienta perdido.
4) Cierre-puente: ese punto débil tiene solución y es justo lo que trabaja el "Diagnóstico de 5 Días" que ya va en camino a su correo. Sin vender duro, sin exagerar.

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
      temperature: 0.4,
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
