/**
 * Copyright © 2026 CreaTuActivo.com
 * Actualizar System Prompt a v27.2 (Modulación de Registro — Ola 2)
 * Lee el contenido desde knowledge_base/system-prompt-nexus-main-v27_2.md
 *
 * Cambios respecto a v27.1:
 *
 * Doctrina v5.5 — Modulación de Registro (estilo Mario Alonso Puig):
 * mantener autoridad técnica del Lujo Clínico pero modular registro según
 * contexto del usuario. Cambios sustantivos:
 *
 * #1 — Nueva sección MODULACIÓN DE REGISTRO v5.5 dentro de TONO Y VOZ.
 *      Tabla técnico-clínico (arquitectura/mecánica/compensación) vs
 *      humano-cálido (exploración/dudas/pausas). Ejemplos de
 *      sobre-tecnificación inapropiada. Vocabulario aprobado conservado
 *      en ambos registros + vocabulario modulable según contexto.
 *
 * #2 — VECTORES DE CIERRE balanceados en 2 BANCOS según registro:
 *      - Banco A (técnico-clínico): los 3 vectores Reel A v2.2 conservados
 *      - Banco B (conversacional): 3 vectores nuevos para incentivar diálogo
 *      Regla anti-pregunta-retórica-vacía. NO prohíbe contraste retórico
 *      legítimo (matiz capturado en feedback 24 May 2026 — la regla
 *      v26.3 "describir qué ES, no qué NO ES" se conserva tal cual).
 *
 * #3 — Refuerzo PIRÁMIDE McKINSEY AL DERECHO. Nueva REGLA ANTI-PREÁMBULO:
 *      cuando la pregunta es directa (paquetes, precios, productos),
 *      responde directo. El preámbulo doctrinal SOLO va cuando el usuario
 *      pide explicación arquitectónica. Ejemplo aprobado de respuesta
 *      directa a "háblame de los paquetes".
 *
 * #4 — BLOQUEO ABSOLUTO — DASHBOARD INEXISTENTE PARA PROSPECTO. El
 *      modelo alucinaba referencias al Dashboard en respuestas a prospectos
 *      en exploración (ej. *"¿prefiere que simulemos en su Dashboard..."*).
 *      El Dashboard de queswa.app existe SOLO para Arquitectos ya activados.
 *
 * #5 — BLOQUEO ABSOLUTO — FÓRMULAS MATEMÁTICAS EXPUESTAS. Prohibido
 *      mostrar fórmula del Binario al prospecto (CV × 17% × $1 USD o
 *      variantes). La matemática se demuestra con tablas terminadas,
 *      no con fórmulas. Si pregunta cómo se calcula, respuesta canónica
 *      sin fórmula.
 *
 * #6 — BLOQUEO ABSOLUTO — DOCTRINA 12 VELOCIDADES. Cuando usuario
 *      pregunta cómo se gana, apertura canónica es "12 velocidades, hoy
 *      analicemos las dos principales". NUNCA "Monetización de Doble
 *      Velocidad" como universo cerrado. Alineado con guion servilleta v6.0
 *      e insight de campo Director Cabrejo (12 años, solo 1 prospecto pidió
 *      detalle de otras formas).
 *
 * NO incluido (Ola 3 — código):
 * - FSM perspicaz (detectar verbos de intención vs exploración)
 * - Doble oferta cierre (tomar datos / link directo)
 * - Fix link WhatsApp pre-llenado
 *
 * Tamaño: ~36,143 → ~40,500 chars (+12% por nuevas reglas v5.5)
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const __dirname = dirname(fileURLToPath(import.meta.url));
const promptContent = readFileSync(
  join(__dirname, '../knowledge_base/system-prompt-nexus-main-v27_2.md'),
  'utf-8'
);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function actualizarSystemPrompt() {
  console.log('📡 Conectando a Supabase...');
  console.log(`📄 Prompt cargado: ${promptContent.length} caracteres`);
  console.log('🎯 Target: nexus_main → v28.8_calidez_sin_diagnostico\n');

  const { data, error } = await supabase
    .from('system_prompts')
    .update({
      prompt: promptContent,
      version: 'v28.8_calidez_sin_diagnostico',
      updated_at: new Date().toISOString(),
    })
    .eq('name', 'nexus_main')
    .select()
    .single();

  if (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }

  console.log('✅ System prompt actualizado exitosamente');
  console.log(`📌 Nombre:    ${data.name}`);
  console.log(`🏷️  Versión:   ${data.version}`);
  console.log(`📅 Fecha:     ${new Date(data.updated_at).toLocaleString('es-CO', { timeZone: 'America/Bogota' })}`);
  console.log(`📏 Tamaño:    ${promptContent.length} caracteres`);
  console.log('\n🔄 El caché se actualizará en los próximos 5 minutos.');
  console.log('💡 Para efecto inmediato en dev: reinicia el servidor con npm run dev');
  console.log('\n📋 Pruebas sugeridas:');
  console.log('   1. "háblame de los paquetes" → respuesta directa sin preámbulo doctrinal');
  console.log('   2. "cómo se gana?" → menciona 12 velocidades + 2 tablas (GEN5 + Binario)');
  console.log('   3. NO debe aparecer "Dashboard" en respuestas a prospectos');
  console.log('   4. NO debe aparecer fórmula "CV × 17% × $1 USD" expuesta');
}

actualizarSystemPrompt();
