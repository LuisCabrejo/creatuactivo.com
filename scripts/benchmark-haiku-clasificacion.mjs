#!/usr/bin/env node
/**
 * Fase 0 — Tarea 1: Benchmark de latencia de Haiku para clasificación de intención.
 *
 * Objetivo: validar premisa Gemini ">1000ms" vs estimación interna "500-800ms".
 * Decide si Hipótesis A (Haiku como clasificador pre-FSM) es arquitectónicamente viable.
 *
 * Criterio Go/No-Go:
 *   ✅ p95 < 1200ms → seguir
 *   ⚠️  p95 1200-1800ms → seguir con caveat (paralelizar con RAG)
 *   ❌ p95 > 1800ms → reconsiderar Hipótesis A
 *
 * Uso: node scripts/benchmark-haiku-clasificacion.mjs
 */
import Anthropic from '@anthropic-ai/sdk';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
dotenv.config({ path: join(dirname(__filename), '..', '.env.local') });

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// ============================================================================
// 50 QUERIES REPRESENTATIVAS — calibradas contra casos reales de QA
// ============================================================================
// Categorías:
//   A. Declaración directa cierre (8)
//   B. Intención impersonal / 3ra persona (8) ← caso Federico
//   C. Anáfora / referencia implícita (6)
//   D. Errores ortográficos (6)
//   E. Dialectos LATAM (6)
//   F. Negaciones / correcciones (4)
//   G. Preguntas durante cierre (4)
//   H. Captura nombre + paquete combo (4)
//   I. Ruido conversacional (4)

const QUERIES = [
  // A. Declaración directa cierre (8)
  { id: 'A1', query: 'ESP-3', expected: { intencion_cierre: 'declarativa', paquete: 'ESP-3' } },
  { id: 'A2', query: 'deseo iniciar', expected: { intencion_cierre: 'declarativa', paquete: null } },
  { id: 'A3', query: 'el visionario', expected: { intencion_cierre: 'declarativa', paquete: 'ESP-3' } },
  { id: 'A4', query: 'hagámoslo', expected: { intencion_cierre: 'declarativa', paquete: null } },
  { id: 'A5', query: 'quiero el ESP-2', expected: { intencion_cierre: 'declarativa', paquete: 'ESP-2' } },
  { id: 'A6', query: 'dale, procedamos', expected: { intencion_cierre: 'declarativa', paquete: null } },
  { id: 'A7', query: 'me apunto al inicial', expected: { intencion_cierre: 'declarativa', paquete: 'ESP-1' } },
  { id: 'A8', query: 'listo, ESP-3', expected: { intencion_cierre: 'declarativa', paquete: 'ESP-3' } },

  // B. Intención impersonal / 3ra persona (8) ← caso Federico perdido
  { id: 'B1', query: 'cómo se inicia', expected: { intencion_cierre: 'declarativa', paquete: null } },
  { id: 'B2', query: 'qué hay que hacer para empezar', expected: { intencion_cierre: 'declarativa', paquete: null } },
  { id: 'B3', query: 'cuál es el proceso para activar', expected: { intencion_cierre: 'declarativa', paquete: null } },
  { id: 'B4', query: 'cómo me uno', expected: { intencion_cierre: 'declarativa', paquete: null } },
  { id: 'B5', query: 'qué pasos sigo', expected: { intencion_cierre: 'declarativa', paquete: null } },
  { id: 'B6', query: 'cómo se hace para ser arquitecto', expected: { intencion_cierre: 'declarativa', paquete: null } },
  { id: 'B7', query: 'cómo arranco con esto', expected: { intencion_cierre: 'declarativa', paquete: null } },
  { id: 'B8', query: 'cuál es el camino para entrar', expected: { intencion_cierre: 'declarativa', paquete: null } },

  // C. Anáfora / referencia implícita (6)
  { id: 'C1', query: 'el mediano', expected: { intencion_cierre: 'declarativa', paquete: 'ESP-2' } },
  { id: 'C2', query: 'el más completo', expected: { intencion_cierre: 'declarativa', paquete: 'ESP-3' } },
  { id: 'C3', query: 'el primero', expected: { intencion_cierre: 'declarativa', paquete: 'ESP-1' } },
  { id: 'C4', query: 'el más grande', expected: { intencion_cierre: 'declarativa', paquete: 'ESP-3' } },
  { id: 'C5', query: 'el del medio', expected: { intencion_cierre: 'declarativa', paquete: 'ESP-2' } },
  { id: 'C6', query: 'el básico', expected: { intencion_cierre: 'declarativa', paquete: 'ESP-1' } },

  // D. Errores ortográficos (6)
  { id: 'D1', query: 'deceo empesar', expected: { intencion_cierre: 'declarativa', paquete: null } },
  { id: 'D2', query: 'ESP3 porfa', expected: { intencion_cierre: 'declarativa', paquete: 'ESP-3' } },
  { id: 'D3', query: 'kiero el visionario', expected: { intencion_cierre: 'declarativa', paquete: 'ESP-3' } },
  { id: 'D4', query: 'me anoto al esp 2', expected: { intencion_cierre: 'declarativa', paquete: 'ESP-2' } },
  { id: 'D5', query: 'cmo inicio', expected: { intencion_cierre: 'declarativa', paquete: null } },
  { id: 'D6', query: 'esp1 plis', expected: { intencion_cierre: 'declarativa', paquete: 'ESP-1' } },

  // E. Dialectos LATAM (6)
  { id: 'E1', query: 'le entro al de mil', expected: { intencion_cierre: 'declarativa', paquete: 'ESP-1' } },
  { id: 'E2', query: 'me animo al grande', expected: { intencion_cierre: 'declarativa', paquete: 'ESP-3' } },
  { id: 'E3', query: 'vamos con el chiquito', expected: { intencion_cierre: 'declarativa', paquete: 'ESP-1' } },
  { id: 'E4', query: 'va el empresarial pues', expected: { intencion_cierre: 'declarativa', paquete: 'ESP-2' } },
  { id: 'E5', query: 'me late el visionario, hermano', expected: { intencion_cierre: 'declarativa', paquete: 'ESP-3' } },
  { id: 'E6', query: 'órale, el ESP-3', expected: { intencion_cierre: 'declarativa', paquete: 'ESP-3' } },

  // F. Negaciones / correcciones (4)
  { id: 'F1', query: 'no, mejor el ESP-2', expected: { intencion_cierre: 'declarativa', paquete: 'ESP-2' } },
  { id: 'F2', query: 'espera, cambié de opinión, déjame pensarlo', expected: { intencion_cierre: 'ausente', paquete: null } },
  { id: 'F3', query: 'no estoy seguro todavía', expected: { intencion_cierre: 'ausente', paquete: null } },
  { id: 'F4', query: 'mejor ninguno por ahora', expected: { intencion_cierre: 'ausente', paquete: null } },

  // G. Preguntas durante cierre (4) — exploratorias, NO declarativas
  { id: 'G1', query: 'antes de decidir, ¿el binario incluye USA?', expected: { intencion_cierre: 'exploratoria', paquete: null } },
  { id: 'G2', query: '¿cuánto cuesta el visionario?', expected: { intencion_cierre: 'exploratoria', paquete: 'ESP-3' } },
  { id: 'G3', query: '¿qué diferencia hay entre ESP-2 y ESP-3?', expected: { intencion_cierre: 'exploratoria', paquete: null } },
  { id: 'G4', query: 'cuéntame más del empresarial', expected: { intencion_cierre: 'exploratoria', paquete: 'ESP-2' } },

  // H. Captura nombre + paquete combo (4)
  { id: 'H1', query: 'Soy Federico, hagámoslo con el ESP-3', expected: { intencion_cierre: 'declarativa', paquete: 'ESP-3', nombre: 'Federico' } },
  { id: 'H2', query: 'me llamo Ana y quiero el visionario', expected: { intencion_cierre: 'declarativa', paquete: 'ESP-3', nombre: 'Ana' } },
  { id: 'H3', query: 'Carlos Mendoza, dame el más completo', expected: { intencion_cierre: 'declarativa', paquete: 'ESP-3', nombre: 'Carlos Mendoza' } },
  { id: 'H4', query: 'Diego aquí, ESP-2 plis', expected: { intencion_cierre: 'declarativa', paquete: 'ESP-2', nombre: 'Diego' } },

  // I. Ruido conversacional (4)
  { id: 'I1', query: 'ok', expected: { intencion_cierre: 'ausente', paquete: null } },
  { id: 'I2', query: 'gracias', expected: { intencion_cierre: 'ausente', paquete: null } },
  { id: 'I3', query: 'interesante', expected: { intencion_cierre: 'ausente', paquete: null } },
  { id: 'I4', query: 'uy', expected: { intencion_cierre: 'ausente', paquete: null } },
];

// ============================================================================
// HERRAMIENTA — schema estructurado que Haiku debe llenar
// ============================================================================
const tools = [
  {
    name: 'clasificar_intencion',
    description: 'Clasifica la intención del usuario en una conversación de calificación patrimonial para Queswa (CreaTuActivo).',
    input_schema: {
      type: 'object',
      properties: {
        intencion_cierre: {
          type: 'string',
          enum: ['declarativa', 'exploratoria', 'ausente'],
          description:
            'declarativa: el usuario EXPRESA decisión o pregunta CÓMO iniciar (impersonal cuenta). exploratoria: pregunta INFORMATIVA sobre paquetes/precios sin compromiso. ausente: ruido conversacional o sin intención de cierre.',
        },
        confianza_cierre: {
          type: 'number',
          description: 'Confianza 0.0-1.0 en la clasificación de intencion_cierre.',
        },
        paquete_implicado: {
          type: ['string', 'null'],
          enum: ['ESP-1', 'ESP-2', 'ESP-3', null],
          description:
            'Paquete mencionado explícita (ESP-1/2/3, visionario=ESP-3, empresarial=ESP-2, inicial=ESP-1) o implícitamente (el más completo/grande=ESP-3, el mediano/del medio=ESP-2, el básico/chiquito/primero=ESP-1). null si no se puede inferir.',
        },
        nombre_dado: {
          type: ['string', 'null'],
          description: 'Nombre del prospecto si se menciona ("soy X", "me llamo X", "X aquí"). null si no se menciona.',
        },
        razonamiento: {
          type: 'string',
          description: 'Una sola frase explicando la decisión.',
        },
      },
      required: ['intencion_cierre', 'confianza_cierre', 'paquete_implicado', 'nombre_dado', 'razonamiento'],
    },
  },
];

const SYSTEM_PROMPT = `Eres un clasificador de intención para Queswa, asistente IA de calificación patrimonial de CreaTuActivo.

CONTEXTO: el usuario es un prospecto en conversación con Queswa sobre construir patrimonio paralelo via Gano Excel + tecnología propietaria. Hay 3 paquetes:
- ESP-1 "Inicial" (~$50-150)
- ESP-2 "Empresarial" (~$300-600)
- ESP-3 "Visionario" (~$800-1500)

REGLA CRÍTICA: una pregunta como "cómo se inicia" o "qué hay que hacer" es intención DECLARATIVA de cierre (el usuario quiere arrancar pero pregunta el proceso), NO exploratoria. Solo es exploratoria si pregunta sobre características/precios/diferencias SIN intención de avanzar.

Usa la herramienta clasificar_intencion para responder.`;

// ============================================================================
// EJECUCIÓN
// ============================================================================

async function clasificar(query) {
  const start = Date.now();
  const response = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 300,
    system: SYSTEM_PROMPT,
    tools,
    tool_choice: { type: 'tool', name: 'clasificar_intencion' },
    messages: [{ role: 'user', content: query }],
  });
  const latencia = Date.now() - start;

  const toolUse = response.content.find((c) => c.type === 'tool_use');
  if (!toolUse) {
    return { latencia, error: 'No tool_use in response', raw: response };
  }
  return {
    latencia,
    resultado: toolUse.input,
    tokens: {
      input: response.usage.input_tokens,
      output: response.usage.output_tokens,
    },
  };
}

function evaluarPrecision(esperado, obtenido) {
  const errores = [];
  if (esperado.intencion_cierre && obtenido.intencion_cierre !== esperado.intencion_cierre) {
    errores.push(`intencion: esperado ${esperado.intencion_cierre}, obtenido ${obtenido.intencion_cierre}`);
  }
  if (esperado.paquete !== undefined && obtenido.paquete_implicado !== esperado.paquete) {
    errores.push(`paquete: esperado ${esperado.paquete}, obtenido ${obtenido.paquete_implicado}`);
  }
  if (esperado.nombre && (!obtenido.nombre_dado || !obtenido.nombre_dado.toLowerCase().includes(esperado.nombre.toLowerCase().split(' ')[0]))) {
    errores.push(`nombre: esperado ${esperado.nombre}, obtenido ${obtenido.nombre_dado}`);
  }
  return errores;
}

function percentil(arr, p) {
  const sorted = [...arr].sort((a, b) => a - b);
  const idx = Math.ceil((p / 100) * sorted.length) - 1;
  return sorted[Math.max(0, idx)];
}

async function main() {
  console.log('🧪 FASE 0 — TAREA 1: Benchmark Haiku Clasificación\n');
  console.log(`Modelo: claude-haiku-4-5-20251001`);
  console.log(`Queries: ${QUERIES.length}\n`);
  console.log('─'.repeat(80));

  const resultados = [];
  let aciertos = 0;
  let totalTokensInput = 0;
  let totalTokensOutput = 0;

  for (const q of QUERIES) {
    process.stdout.write(`[${q.id}] "${q.query.slice(0, 50)}${q.query.length > 50 ? '...' : ''}" ... `);
    try {
      const r = await clasificar(q.query);
      if (r.error) {
        console.log(`❌ ERROR: ${r.error}`);
        resultados.push({ ...q, latencia: r.latencia, errores: ['no-tool-use'] });
        continue;
      }
      const errores = evaluarPrecision(q.expected, r.resultado);
      if (errores.length === 0) aciertos++;
      totalTokensInput += r.tokens.input;
      totalTokensOutput += r.tokens.output;
      resultados.push({ ...q, latencia: r.latencia, resultado: r.resultado, errores });
      console.log(`${r.latencia}ms ${errores.length === 0 ? '✅' : '⚠️  ' + errores.join('; ')}`);
    } catch (err) {
      console.log(`💥 EXCEPTION: ${err.message}`);
      resultados.push({ ...q, errores: ['exception'] });
    }
  }

  console.log('─'.repeat(80));

  const latencias = resultados.filter((r) => r.latencia).map((r) => r.latencia);
  const precision = (aciertos / QUERIES.length) * 100;

  // Costo Haiku 4.5: $1/MTok input, $5/MTok output
  const costoTotal = (totalTokensInput * 1.0 + totalTokensOutput * 5.0) / 1_000_000;

  console.log('\n📊 RESULTADOS\n');
  console.log(`Precisión global: ${aciertos}/${QUERIES.length} (${precision.toFixed(1)}%)`);
  console.log(`\nLatencia (ms):`);
  console.log(`  min:   ${Math.min(...latencias)}`);
  console.log(`  p50:   ${percentil(latencias, 50)}`);
  console.log(`  p95:   ${percentil(latencias, 95)}`);
  console.log(`  p99:   ${percentil(latencias, 99)}`);
  console.log(`  max:   ${Math.max(...latencias)}`);
  console.log(`  avg:   ${(latencias.reduce((a, b) => a + b, 0) / latencias.length).toFixed(0)}`);

  console.log(`\nTokens: ${totalTokensInput} input + ${totalTokensOutput} output`);
  console.log(`Costo total: $${costoTotal.toFixed(4)} ($${(costoTotal / QUERIES.length).toFixed(5)} por query)`);

  console.log(`\n🎯 CRITERIO Go/No-Go:`);
  const p95 = percentil(latencias, 95);
  if (p95 < 1200) {
    console.log(`  ✅ p95 ${p95}ms < 1200ms → SEGUIR a Fase 1`);
  } else if (p95 < 1800) {
    console.log(`  ⚠️  p95 ${p95}ms entre 1200-1800ms → SEGUIR con caveat (paralelizar con RAG)`);
  } else {
    console.log(`  ❌ p95 ${p95}ms > 1800ms → RECONSIDERAR Hipótesis A`);
  }

  // Desglose por categoría
  console.log(`\n📂 Desglose por categoría:`);
  const categorias = {
    A: 'Declaración directa',
    B: 'Impersonal / 3ra persona',
    C: 'Anáfora / implícita',
    D: 'Errores ortográficos',
    E: 'Dialectos LATAM',
    F: 'Negaciones / correcciones',
    G: 'Preguntas exploratorias',
    H: 'Nombre + paquete combo',
    I: 'Ruido conversacional',
  };
  for (const [letra, nombre] of Object.entries(categorias)) {
    const cat = resultados.filter((r) => r.id.startsWith(letra));
    const ok = cat.filter((r) => r.errores.length === 0).length;
    const lats = cat.map((r) => r.latencia).filter(Boolean);
    const avgLat = lats.length ? (lats.reduce((a, b) => a + b, 0) / lats.length).toFixed(0) : 'N/A';
    console.log(`  [${letra}] ${nombre.padEnd(28)}: ${ok}/${cat.length} ${ok === cat.length ? '✅' : '⚠️ '} (avg ${avgLat}ms)`);
  }

  // Listar fallos
  const fallos = resultados.filter((r) => r.errores && r.errores.length > 0);
  if (fallos.length > 0) {
    console.log(`\n⚠️  CASOS FALLIDOS (${fallos.length}):`);
    for (const f of fallos) {
      console.log(`  [${f.id}] "${f.query}"`);
      console.log(`         → ${f.errores.join(' | ')}`);
      if (f.resultado?.razonamiento) {
        console.log(`         razonamiento Haiku: "${f.resultado.razonamiento}"`);
      }
    }
  }
}

main().catch((err) => {
  console.error('💥 Fatal:', err);
  process.exit(1);
});
