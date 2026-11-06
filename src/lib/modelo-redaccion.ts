// El modelo que redacta la respuesta del motor, y los parámetros que ese modelo
// acepta.
//
// En producción redacta Sonnet 4.6. Para comparar modelos con la evaluación
// (`scripts/eval-queswa/`, 5 nov 2026), el servidor de ensayo arranca con
// QUESWA_MODELO_PRUEBA (y, si se quiere, QUESWA_ESFUERZO_PRUEBA). La variable
// solo vale en una petición con la cabecera `x-queswa-origen: prueba`: si
// alguien la deja puesta en Vercel, la gente sigue recibiendo Sonnet 4.6.
//
// Los modelos de la generación 5 cambian la petición:
// - `temperature` es un 400: el control es `output_config.effort`.
// - El razonamiento no se apaga del todo (en Opus 5.5, nunca), y cuenta dentro
//   de `max_tokens`. Con los topes del motor (600-1.500) se cortaría la
//   respuesta, así que se le da margen.
// - El stream trae bloques `thinking` además del texto. `AnthropicStream` (ai v2)
//   solo lee `delta.text`, así que no se cuelan en lo que recibe la persona.
export const MODELO_REDACCION = 'claude-sonnet-4-6';

const MARGEN_RAZONAMIENTO = 4000;

export function parametrosDeRedaccion(esPrueba: boolean, maxTokens: number): Record<string, unknown> {
  const modelo = (esPrueba && process.env.QUESWA_MODELO_PRUEBA?.trim()) || MODELO_REDACCION;
  if (!/^claude-(sonnet|opus|haiku)-5/.test(modelo)) {
    return { model: modelo, max_tokens: maxTokens, temperature: 0.65 };
  }
  return {
    model: modelo,
    max_tokens: maxTokens + MARGEN_RAZONAMIENTO,
    output_config: { effort: process.env.QUESWA_ESFUERZO_PRUEBA?.trim() || 'low' },
  };
}
