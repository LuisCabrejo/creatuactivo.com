#!/usr/bin/env node
/**
 * Fase 0 — Tarea 3: POC Tool Calling con UNA herramienta.
 *
 * Objetivo: validar que Claude Sonnet 4.6 invoca tools con precisión + medir latencia agregada.
 * Decide si Tool Calling es solución viable para reemplazar regex en FSM.
 *
 * Test: 20 escenarios (10 deben invocar, 10 NO deben).
 *
 * Criterio Go/No-Go:
 *   ✅ Precisión > 90% Y recall > 85% Y latencia < 800ms más que baseline → seguir
 *   ⚠️  Precisión 80-90% → seguir con refinamiento de description
 *   ❌ Precisión < 80% O recall < 70% → Tool Calling no resuelve perspicacia
 *
 * Uso: node scripts/poc-tool-calling.mjs
 */
import Anthropic from '@anthropic-ai/sdk';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
dotenv.config({ path: join(dirname(__filename), '..', '.env.local') });

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// ============================================================================
// HERRAMIENTA — solo una, fire-and-forget warm handoff
// ============================================================================
const tools = [
  {
    name: 'disparar_warm_handoff',
    description: `Invocar SOLO cuando se cumplen AMBAS condiciones:
1. El prospecto ha seleccionado un paquete ESP-1, ESP-2 o ESP-3 (explícitamente o por sinónimo: "visionario"=ESP-3, "empresarial"=ESP-2, "inicial"=ESP-1, "el más completo/grande"=ESP-3, "el mediano/del medio"=ESP-2, "el básico/primero/chiquito"=ESP-1).
2. El prospecto ha proporcionado su nombre.

NO invocar si:
- El prospecto solo pregunta información (precios, diferencias, características).
- El prospecto seleccionó paquete pero NO dio nombre todavía.
- El prospecto dio nombre pero NO ha seleccionado paquete todavía.
- El prospecto se está retractando ("espera, déjame pensarlo", "cambié de opinión").

Si la conversación cumple ambas condiciones, INVOCA esta herramienta INMEDIATAMENTE — el sistema enviará un sumario al equipo directivo y el prospecto recibirá link de WhatsApp.`,
    input_schema: {
      type: 'object',
      properties: {
        paquete: {
          type: 'string',
          enum: ['ESP-1', 'ESP-2', 'ESP-3'],
          description: 'Paquete seleccionado por el prospecto.',
        },
        nombre: {
          type: 'string',
          minLength: 2,
          description: 'Nombre del prospecto.',
        },
        whatsapp: {
          type: ['string', 'null'],
          description: 'Número de WhatsApp si el prospecto lo proporcionó. null si no se dio.',
        },
        razon_invocacion: {
          type: 'string',
          description: 'Frase exacta del usuario que disparó la decisión.',
        },
      },
      required: ['paquete', 'nombre', 'razon_invocacion'],
    },
  },
];

const SYSTEM_PROMPT = `Eres Queswa, asistente de calificación patrimonial de CreaTuActivo.

Tu trabajo: conversar con prospectos sobre construir patrimonio paralelo via Gano Excel + tecnología propietaria. Hay 3 paquetes de activación:
- ESP-1 "Inicial" (~$50-150 USD)
- ESP-2 "Empresarial" (~$300-600 USD)
- ESP-3 "Visionario" (~$800-1500 USD)

Cuando el prospecto haya seleccionado un paquete Y dado su nombre, invoca la herramienta disparar_warm_handoff INMEDIATAMENTE para que el equipo directivo reciba el sumario y el prospecto reciba su link de WhatsApp.

Si falta UNA de las dos cosas (paquete o nombre), continúa la conversación pidiendo lo que falta sin invocar la herramienta.

Tono: Lujo Clínico, McKinsey/BCG, trato "Usted", no tuteo, no jerga MLM.`;

// ============================================================================
// 20 ESCENARIOS — 10 deben invocar, 10 NO deben
// ============================================================================
const ESCENARIOS = [
  // ────────────────────────────────────────────────────────────────────────
  // CASOS POSITIVOS (10 — deben invocar)
  // ────────────────────────────────────────────────────────────────────────
  {
    id: 'P1',
    descripcion: 'Captura simultánea nombre + paquete',
    debe_invocar: true,
    paquete_esperado: 'ESP-3',
    nombre_esperado: 'Federico',
    messages: [
      { role: 'user', content: 'Soy Federico, hagámoslo con el ESP-3' },
    ],
  },
  {
    id: 'P2',
    descripcion: 'Captura secuencial — paquete primero, nombre después',
    debe_invocar: true,
    paquete_esperado: 'ESP-3',
    nombre_esperado: 'Ana',
    messages: [
      { role: 'user', content: 'Quiero el visionario' },
      { role: 'assistant', content: 'Excelente decisión. Para activar su acceso al ESP-3 Visionario, ¿con qué nombre lo registramos?' },
      { role: 'user', content: 'Ana Martínez' },
    ],
  },
  {
    id: 'P3',
    descripcion: 'Selección implícita — "el más completo"',
    debe_invocar: true,
    paquete_esperado: 'ESP-3',
    nombre_esperado: 'Carlos',
    messages: [
      { role: 'user', content: 'Soy Carlos, dame el más completo' },
    ],
  },
  {
    id: 'P4',
    descripcion: 'Nombre primero, paquete después',
    debe_invocar: true,
    paquete_esperado: 'ESP-2',
    nombre_esperado: 'Diego',
    messages: [
      { role: 'user', content: 'Me llamo Diego' },
      { role: 'assistant', content: 'Mucho gusto, Diego. ¿Qué nivel de activación le interesa explorar?' },
      { role: 'user', content: 'El ESP-2' },
    ],
  },
  {
    id: 'P5',
    descripcion: 'Selección con dialecto + nombre',
    debe_invocar: true,
    paquete_esperado: 'ESP-1',
    nombre_esperado: 'Luis',
    messages: [
      { role: 'user', content: 'Le entro al de mil, soy Luis' },
    ],
  },
  {
    id: 'P6',
    descripcion: 'Error ortográfico en nombre + paquete',
    debe_invocar: true,
    paquete_esperado: 'ESP-3',
    nombre_esperado: 'Mariana',
    messages: [
      { role: 'user', content: 'mariana aki, kiero el visionario' },
    ],
  },
  {
    id: 'P7',
    descripcion: 'Conversación larga, decisión al final',
    debe_invocar: true,
    paquete_esperado: 'ESP-2',
    nombre_esperado: 'Roberto',
    messages: [
      { role: 'user', content: '¿Cómo funciona el negocio?' },
      { role: 'assistant', content: 'CreaTuActivo se basa en tres pilares: la Matriz Física (Gano Excel), Queswa como Centro de Mando, y la Metodología Automatizada del Tridente EAM. Usted dirige los tres pilares como Arquitecto de Patrimonio.' },
      { role: 'user', content: '¿Cuál paquete me recomiendas?' },
      { role: 'assistant', content: 'Tres niveles disponibles: ESP-1 (~$150), ESP-2 (~$500), ESP-3 (~$1200). El ESP-2 ofrece el mejor balance de profundidad de catálogo y velocidad de activación. ¿Cuál le hace sentido?' },
      { role: 'user', content: 'Va el empresarial. Soy Roberto González' },
    ],
  },
  {
    id: 'P8',
    descripcion: 'Cambio de opinión + decisión final',
    debe_invocar: true,
    paquete_esperado: 'ESP-2',
    nombre_esperado: 'Patricia',
    messages: [
      { role: 'user', content: 'Soy Patricia, quiero el ESP-3' },
      { role: 'assistant', content: 'Excelente. Para activar el ESP-3 Visionario, confirmamos el registro.' },
      { role: 'user', content: 'Espera, mejor el ESP-2' },
    ],
  },
  {
    id: 'P9',
    descripcion: 'Pregunta + decisión inmediata',
    debe_invocar: true,
    paquete_esperado: 'ESP-3',
    nombre_esperado: 'Andrés',
    messages: [
      { role: 'user', content: 'Andrés. ¿Cuál es el más completo?' },
      { role: 'assistant', content: 'El más completo es el ESP-3 Visionario, Andrés — incluye 35+ productos y máxima velocidad de capitalización.' },
      { role: 'user', content: 'Perfecto, ese' },
    ],
  },
  {
    id: 'P10',
    descripcion: 'Decisión + WhatsApp opcional',
    debe_invocar: true,
    paquete_esperado: 'ESP-1',
    nombre_esperado: 'Sofía',
    whatsapp_esperado: '+573001234567',
    messages: [
      { role: 'user', content: 'Soy Sofía, le entro al inicial. Mi WhatsApp es +573001234567' },
    ],
  },

  // ────────────────────────────────────────────────────────────────────────
  // CASOS NEGATIVOS (10 — NO deben invocar)
  // ────────────────────────────────────────────────────────────────────────
  {
    id: 'N1',
    descripcion: 'Solo paquete, sin nombre',
    debe_invocar: false,
    messages: [
      { role: 'user', content: 'Quiero ESP-3' },
    ],
  },
  {
    id: 'N2',
    descripcion: 'Solo nombre, sin paquete',
    debe_invocar: false,
    messages: [
      { role: 'user', content: 'Me llamo Federico' },
    ],
  },
  {
    id: 'N3',
    descripcion: 'Pregunta informativa sobre precio',
    debe_invocar: false,
    messages: [
      { role: 'user', content: '¿Cuánto cuesta el visionario?' },
    ],
  },
  {
    id: 'N4',
    descripcion: 'Pregunta sobre diferencias',
    debe_invocar: false,
    messages: [
      { role: 'user', content: '¿Qué diferencia hay entre ESP-2 y ESP-3?' },
    ],
  },
  {
    id: 'N5',
    descripcion: 'Negación tardía después de selección + nombre',
    debe_invocar: false,
    messages: [
      { role: 'user', content: 'Soy Carlos, quiero el ESP-3' },
      { role: 'assistant', content: 'Excelente decisión, Carlos. Para activar su ESP-3 Visionario...' },
      { role: 'user', content: 'Espera, cambié de opinión, déjame pensarlo' },
    ],
  },
  {
    id: 'N6',
    descripcion: 'Selección pero pide pausar',
    debe_invocar: false,
    messages: [
      { role: 'user', content: 'Me interesa el ESP-2 pero antes quisiera consultarlo con mi esposa' },
    ],
  },
  {
    id: 'N7',
    descripcion: 'Pregunta exploratoria con nombre',
    debe_invocar: false,
    messages: [
      { role: 'user', content: 'Soy Diego. ¿Cuál me recomiendas?' },
    ],
  },
  {
    id: 'N8',
    descripcion: 'Saludo inicial',
    debe_invocar: false,
    messages: [
      { role: 'user', content: 'Hola, cuéntame de CreaTuActivo' },
    ],
  },
  {
    id: 'N9',
    descripcion: 'Objeción sobre precio',
    debe_invocar: false,
    messages: [
      { role: 'user', content: 'Me llamo Juan. El ESP-3 me parece caro' },
    ],
  },
  {
    id: 'N10',
    descripcion: 'Pregunta sobre garantía',
    debe_invocar: false,
    messages: [
      { role: 'user', content: '¿Hay garantía si el ESP-2 no me funciona?' },
    ],
  },
];

// ============================================================================
// EJECUCIÓN
// ============================================================================

async function ejecutarEscenario(escenario) {
  const start = Date.now();
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    tools,
    messages: escenario.messages,
  });
  const latencia = Date.now() - start;

  const toolUse = response.content.find((c) => c.type === 'tool_use');
  return {
    latencia,
    invocó: !!toolUse,
    toolInput: toolUse?.input,
    textoRespuesta: response.content.find((c) => c.type === 'text')?.text,
    stopReason: response.stop_reason,
    tokens: {
      input: response.usage.input_tokens,
      output: response.usage.output_tokens,
    },
  };
}

function percentil(arr, p) {
  const sorted = [...arr].sort((a, b) => a - b);
  const idx = Math.ceil((p / 100) * sorted.length) - 1;
  return sorted[Math.max(0, idx)];
}

async function main() {
  console.log('🧪 FASE 0 — TAREA 3: POC Tool Calling\n');
  console.log(`Modelo: claude-sonnet-4-6`);
  console.log(`Tool: disparar_warm_handoff`);
  console.log(`Escenarios: ${ESCENARIOS.length} (10 deben invocar / 10 NO deben)\n`);
  console.log('─'.repeat(80));

  const resultados = [];
  let truePositives = 0;
  let falsePositives = 0;
  let trueNegatives = 0;
  let falseNegatives = 0;
  let slotErrors = 0;
  let totalTokensInput = 0;
  let totalTokensOutput = 0;

  for (const esc of ESCENARIOS) {
    process.stdout.write(`[${esc.id}] ${esc.descripcion.padEnd(48)} ... `);
    try {
      const r = await ejecutarEscenario(esc);
      totalTokensInput += r.tokens.input;
      totalTokensOutput += r.tokens.output;

      let resultado = '';
      let veredicto = '';
      let slotsOk = true;

      if (esc.debe_invocar && r.invocó) {
        truePositives++;
        veredicto = '✅ TP';
        // Validar slots
        if (r.toolInput.paquete !== esc.paquete_esperado) {
          slotsOk = false;
          slotErrors++;
          veredicto += ` ⚠️  paquete ${r.toolInput.paquete}≠${esc.paquete_esperado}`;
        }
        const nombreObtenido = (r.toolInput.nombre || '').toLowerCase();
        const nombreEsperado = esc.nombre_esperado.toLowerCase();
        if (!nombreObtenido.includes(nombreEsperado)) {
          slotsOk = false;
          slotErrors++;
          veredicto += ` ⚠️  nombre "${r.toolInput.nombre}"≠"${esc.nombre_esperado}"`;
        }
      } else if (esc.debe_invocar && !r.invocó) {
        falseNegatives++;
        veredicto = '❌ FN (debió invocar)';
      } else if (!esc.debe_invocar && r.invocó) {
        falsePositives++;
        veredicto = `❌ FP (invocó indebidamente: ${JSON.stringify(r.toolInput)})`;
      } else {
        trueNegatives++;
        veredicto = '✅ TN';
      }

      console.log(`${r.latencia}ms ${veredicto}`);
      resultados.push({ ...esc, ...r, slotsOk });
    } catch (err) {
      console.log(`💥 EXCEPTION: ${err.message}`);
      resultados.push({ ...esc, error: err.message });
    }
  }

  console.log('─'.repeat(80));

  // ──────────────────────────────────────────────────────────────────────
  // MÉTRICAS
  // ──────────────────────────────────────────────────────────────────────
  const precision = truePositives / (truePositives + falsePositives) || 0;
  const recall = truePositives / (truePositives + falseNegatives) || 0;
  const f1 = (2 * precision * recall) / (precision + recall) || 0;
  const accuracy = (truePositives + trueNegatives) / ESCENARIOS.length;

  const latencias = resultados.filter((r) => r.latencia).map((r) => r.latencia);
  const latenciasInvocó = resultados.filter((r) => r.invocó).map((r) => r.latencia);
  const latenciasNoInvocó = resultados.filter((r) => r.invocó === false).map((r) => r.latencia);

  // Costo Sonnet 4.5: $3/MTok input, $15/MTok output
  const costoTotal = (totalTokensInput * 3.0 + totalTokensOutput * 15.0) / 1_000_000;

  console.log('\n📊 RESULTADOS\n');
  console.log(`Matriz de confusión:`);
  console.log(`  ✅ True Positives:  ${truePositives}/10  (invocó cuando debía)`);
  console.log(`  ✅ True Negatives:  ${trueNegatives}/10  (NO invocó cuando NO debía)`);
  console.log(`  ❌ False Positives: ${falsePositives}/10  (invocó indebidamente)`);
  console.log(`  ❌ False Negatives: ${falseNegatives}/10  (omitió invocación)`);
  console.log(`  ⚠️  Slot errors:    ${slotErrors}      (invocó OK pero paquete/nombre mal)`);

  console.log(`\nMétricas:`);
  console.log(`  Precisión:  ${(precision * 100).toFixed(1)}%`);
  console.log(`  Recall:     ${(recall * 100).toFixed(1)}%`);
  console.log(`  F1 Score:   ${(f1 * 100).toFixed(1)}%`);
  console.log(`  Accuracy:   ${(accuracy * 100).toFixed(1)}%`);

  console.log(`\nLatencia (ms):`);
  console.log(`  p50 global:        ${percentil(latencias, 50)}`);
  console.log(`  p95 global:        ${percentil(latencias, 95)}`);
  console.log(`  avg global:        ${(latencias.reduce((a, b) => a + b, 0) / latencias.length).toFixed(0)}`);
  if (latenciasInvocó.length) {
    console.log(`  avg cuando invocó: ${(latenciasInvocó.reduce((a, b) => a + b, 0) / latenciasInvocó.length).toFixed(0)} (n=${latenciasInvocó.length})`);
  }
  if (latenciasNoInvocó.length) {
    console.log(`  avg cuando NO:     ${(latenciasNoInvocó.reduce((a, b) => a + b, 0) / latenciasNoInvocó.length).toFixed(0)} (n=${latenciasNoInvocó.length})`);
  }

  console.log(`\nTokens: ${totalTokensInput} input + ${totalTokensOutput} output`);
  console.log(`Costo total: $${costoTotal.toFixed(4)} ($${(costoTotal / ESCENARIOS.length).toFixed(5)} por escenario)`);

  // ──────────────────────────────────────────────────────────────────────
  // GO/NO-GO
  // ──────────────────────────────────────────────────────────────────────
  console.log(`\n🎯 CRITERIO Go/No-Go:`);
  const precOk = precision >= 0.9;
  const recOk = recall >= 0.85;
  const latOk = percentil(latencias, 95) < 4000; // baseline Sonnet ~2-3s, tool calling no debería agregar >1s

  if (precOk && recOk) {
    console.log(`  ✅ Precisión ${(precision * 100).toFixed(1)}% ≥ 90% Y Recall ${(recall * 100).toFixed(1)}% ≥ 85% → SEGUIR a Fase 1`);
  } else if (precision >= 0.8 && recall >= 0.75) {
    console.log(`  ⚠️  Precisión ${(precision * 100).toFixed(1)}% Y Recall ${(recall * 100).toFixed(1)}% → SEGUIR con refinamiento de tool description`);
  } else {
    console.log(`  ❌ Precisión ${(precision * 100).toFixed(1)}% O Recall ${(recall * 100).toFixed(1)}% → Tool Calling NO resuelve perspicacia con esta config`);
  }

  if (slotErrors > 0) {
    console.log(`  ⚠️  ${slotErrors} slot errors detectados — revisar tool schema description`);
  }

  // ──────────────────────────────────────────────────────────────────────
  // FALLOS DETALLADOS
  // ──────────────────────────────────────────────────────────────────────
  const fallos = resultados.filter((r) => {
    const condicionFallo =
      (r.debe_invocar && !r.invocó) || (!r.debe_invocar && r.invocó) || (r.invocó && !r.slotsOk);
    return condicionFallo;
  });

  if (fallos.length > 0) {
    console.log(`\n⚠️  CASOS PROBLEMÁTICOS (${fallos.length}):`);
    for (const f of fallos) {
      console.log(`\n  [${f.id}] ${f.descripcion}`);
      console.log(`         Última query: "${f.messages[f.messages.length - 1].content}"`);
      console.log(`         Esperado: ${f.debe_invocar ? 'INVOCAR' : 'NO invocar'}`);
      console.log(`         Obtenido: ${f.invocó ? 'INVOCÓ ' + JSON.stringify(f.toolInput) : 'NO invocó'}`);
      if (f.textoRespuesta && f.textoRespuesta.length < 200) {
        console.log(`         Texto del modelo: "${f.textoRespuesta}"`);
      }
    }
  }
}

main().catch((err) => {
  console.error('💥 Fatal:', err);
  process.exit(1);
});
