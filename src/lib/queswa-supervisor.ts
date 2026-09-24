/**
 * Copyright © 2026 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * EL SUPERVISOR — una segunda mirada antes de que la respuesta salga.
 *
 * ── POR QUÉ (24 sep 2026) ─────────────────────────────────────────────────────
 *
 * En la prueba del Director, el modelo le dijo que se registraba «en este caso,
 * Reino Unido», que lo contactaba «el equipo de Reino Unido» y que los precios
 * iban «en libras». Ninguno de los guardarraíles lo vio, porque vigilan la
 * salud, la promesa de ingreso y la marca interna; nada revisaba si lo que se
 * afirma está en el material, ni si se le repite a la persona lo que ya vio.
 *
 * Es el patrón de Sierra y de Intercom: un segundo modelo revisa cada respuesta
 * antes de enviarla —Anthropic también lo recomienda así, en una llamada aparte,
 * porque el mismo modelo que escribió no se revisa bien a sí mismo—. Si
 * encuentra un problema claro, el motor redacta de nuevo una sola vez con esa
 * nota. Nunca frena el turno: si el revisor tarda o falla, la respuesta sale.
 *
 * ⚠️ Solo marca problemas CLAROS. Un revisor que marca de más es peor que
 * ninguno: cada reescritura cuesta segundos, y bloquear una respuesta buena
 * también es daño (misma regla de calibración que los guardarraíles).
 */
import type Anthropic from '@anthropic-ai/sdk';

export type ProblemaSupervisor = 'REPITE' | 'INVENTA' | 'IGNORA';

export interface VeredictoSupervisor {
  ok: boolean;
  problema?: ProblemaSupervisor;
  detalle?: string;
  ms: number;
  error?: string;
}

const SISTEMA = `Usted revisa, antes de que se envíe, una respuesta que Queswa —la asistente de CreaTuActivo.com— le va a dar a una persona interesada en el negocio. Tiene la bitácora de la conversación, el material de referencia con el que se redactó, el último mensaje de la persona y el borrador.

Marque un problema solo si es claro y es uno de estos tres:
REPITE — el borrador vuelve a explicar un tema que según la bitácora ya se le mostró, y la persona no pidió que se lo repitieran.
INVENTA — el borrador afirma un dato concreto que no está en el material ni en la bitácora: un equipo u oficina en un país, un país de registro, una moneda, un plazo, una cifra o un procedimiento.
IGNORA — el borrador no responde lo que la persona dijo o preguntó en su último mensaje.

Todo lo demás se aprueba: el estilo, el orden, que retome algo con otras palabras para responder una pregunta nueva, o que nombre de pasada un tema ya visto.

Dos reglas del negocio que un borrador correcto cumple, y que nunca se marcan como falla: no atribuirle a un producto efectos sobre la salud o sobre una enfermedad, y no agregar cifras, plazos ni procedimientos que no estén en el material. Un borrador que responde lo que se puede y remite lo demás al equipo o al médico está bien.

Responda solo con JSON: {"ok": true} o {"ok": false, "problema": "REPITE|INVENTA|IGNORA", "detalle": "una frase que diga qué corregir, en positivo"}`;

export async function revisarBorrador(p: {
  anthropic: Anthropic;
  bitacora: string;
  material: string;
  mensajePersona: string;
  borrador: string;
  timeoutMs?: number;
}): Promise<VeredictoSupervisor> {
  const t0 = Date.now();
  const usuario = `${p.bitacora || '<bitacora>Primer contacto.</bitacora>'}

<material>
${(p.material || '').slice(0, 9000)}
</material>

Último mensaje de la persona: «${(p.mensajePersona || '').slice(0, 600)}»

<borrador>
${(p.borrador || '').slice(0, 4000)}
</borrador>`;

  try {
    const r = await p.anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 200,
      temperature: 0,
      system: SISTEMA,
      messages: [{ role: 'user', content: usuario }],
    }, { timeout: p.timeoutMs ?? 6000, maxRetries: 0 });
    const texto = r.content.map((b) => (b.type === 'text' ? b.text : '')).join('');
    const json = texto.match(/\{[\s\S]*\}/)?.[0];
    if (!json) return { ok: true, ms: Date.now() - t0, error: 'sin JSON' };
    const d = JSON.parse(json) as { ok?: unknown; problema?: unknown; detalle?: unknown };
    if (d.ok !== false) return { ok: true, ms: Date.now() - t0 };
    const problema = ['REPITE', 'INVENTA', 'IGNORA'].includes(String(d.problema)) ? (d.problema as ProblemaSupervisor) : undefined;
    if (!problema) return { ok: true, ms: Date.now() - t0, error: `problema no reconocido: ${String(d.problema)}` };
    return { ok: false, problema, detalle: typeof d.detalle === 'string' ? d.detalle.slice(0, 300) : '', ms: Date.now() - t0 };
  } catch (err) {
    return { ok: true, ms: Date.now() - t0, error: err instanceof Error ? err.message.slice(0, 80) : 'error' };
  }
}

/**
 * La nota con la que el motor redacta de nuevo. Va en las instrucciones de la
 * sesión, dicha en positivo: qué tener en cuenta, no qué evitar.
 */
export function notaDeRevision(v: VeredictoSupervisor): string {
  const que = v.problema === 'REPITE'
    ? 'la persona ya recibió ese tema; avance con lo que pide ahora'
    : v.problema === 'INVENTA'
      ? 'afirme solo datos que estén en el material o en la bitácora; lo que no esté, lo resuelve el equipo'
      : 'responda primero lo que la persona dijo en su último mensaje';
  // ⚠️ Va la indicación GENÉRICA del tipo de problema, nunca el detalle del
  // revisor (24 sep 2026): en la primera prueba, Haiku justificó bien un
  // bloqueo con un dato falso —«Gano Excel opera en 16 países»; son más de 60, y
  // los 16 son los de América—, y pasarle eso al modelo metía el error en la
  // respuesta corregida. El detalle queda en el registro, para quien revisa.
  return `\n<revision>\nUna revisión de un borrador anterior de esta misma respuesta encontró algo que corregir. Al redactarla: ${que}.\n</revision>\n`;
}
