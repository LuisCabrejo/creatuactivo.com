/**
 * Copyright © 2026 CreaTuActivo.com
 * Actualizar System Prompt a v26.9 (Recursos de Legibilidad Cognitiva)
 * Lee el contenido desde knowledge_base/system-prompt-nexus-main-v26_9.md
 *
 * Cambios respecto a v26.8 (xml_verbatim_lock):
 * - Resuelve contradicción doctrinal interna sobre formato visual.
 * - Auditoría de formato paso 3 reescrita: antes ordenaba destruir listas/numeración;
 *   ahora ordena auditar si el borrador aprovecha los recursos disponibles.
 * - Nuevas Reglas E, F, G, H en REGLAS DE FORMATO VISUAL:
 *   E — Negritas en frases-ancla (datos, sustantivos doctrinales, conclusiones).
 *   F — Cursiva en reencuadres psicológicos (Dunford).
 *   G — Separador `---` antes del cierre + bifurcación.
 *   H — Sub-listas para enumeraciones de 2-5 elementos paralelos.
 * - Regla TONO 6 matizada: máximo 3 párrafos solo para queries de orientación.
 * - Nueva sección "## RECURSOS DE LEGIBILIDAD COGNITIVA" que explica el PROPÓSITO
 *   de cada recurso (escaneabilidad, modelado mental, retención).
 *
 * Justificación: las 2 chips canónicas (WHY_02 + EAM_01) ya entregan formato
 * enriquecido via <verbatim_lock> en arsenal v25.9, pero las queries naturales
 * que recuperan otros fragmentos (OBJ_*, FREQ_*, COMP_*) quedaban planas. La
 * paridad visual cross-respuestas es lo que retiene al usuario y facilita la
 * comprensión cognitiva.
 *
 * Sin cambios en arsenales — esta es Nivel 1 (solo system prompt) del plan
 * de mejora de legibilidad. Nivel 2 (reformatear arsenal_avanzado + arsenal_reto)
 * pendiente de evaluación post-QA.
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const __dirname = dirname(fileURLToPath(import.meta.url));
const promptContent = readFileSync(
  join(__dirname, '../knowledge_base/system-prompt-nexus-main-v26_9.md'),
  'utf-8'
);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function actualizarSystemPrompt() {
  console.log('📡 Conectando a Supabase...');
  console.log(`📄 Prompt cargado: ${promptContent.length} caracteres`);
  console.log('🎯 Target: nexus_main → v26.9_recursos_legibilidad_cognitiva\n');

  const { data, error } = await supabase
    .from('system_prompts')
    .update({
      prompt: promptContent,
      version: 'v26.9_recursos_legibilidad_cognitiva',
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
}

actualizarSystemPrompt();
