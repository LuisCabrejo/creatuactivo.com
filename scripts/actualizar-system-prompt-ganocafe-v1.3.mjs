/**
 * Deploy System Prompt: ganocafe_main v1.3 → ganocafe.online
 *
 * v1.3 embeds the FULL product catalog + PV/CV table directly in the system prompt.
 * Eliminates dependency on vector search for pricing/PV data (Quick Win per research).
 *
 * Solución validada por: "Routing IA Multi-Tenant: Desafíos y Soluciones"
 * → Sección 4: Inyección de Contexto Estructurado como fuente de verdad para datos factuales.
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const __dirname = dirname(fileURLToPath(import.meta.url));
const promptContent = readFileSync(
  join(__dirname, '../knowledge_base/system-prompt-ganocafe-v1.3.md'),
  'utf-8'
);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function deploy() {
  console.log('📡 Conectando a Supabase...');
  console.log(`📄 Prompt v1.3 cargado: ${promptContent.length} caracteres`);

  // Verificar si ya existe fila con name='ganocafe_main'
  const { data: existing } = await supabase
    .from('system_prompts')
    .select('id, name, tenant_id, version')
    .eq('name', 'ganocafe_main')
    .maybeSingle();

  if (existing) {
    console.log(`📋 Fila existente: id=${existing.id}, version=${existing.version}`);
    const { data, error } = await supabase
      .from('system_prompts')
      .update({
        prompt: promptContent,
        version: 'v1.4_ganocafe_bullet_format',
        updated_at: new Date().toISOString(),
      })
      .eq('name', 'ganocafe_main')
      .select()
      .single();

    if (error) { console.error('❌ Error al actualizar:', error.message); process.exit(1); }
    console.log('✅ System prompt actualizado:', data.version);
    console.log('📅 Actualizado:', data.updated_at);
    console.log('🔑 tenant_id:', data.tenant_id);
  } else {
    console.log('🆕 Creando nueva fila ganocafe_main...');
    const { data, error } = await supabase
      .from('system_prompts')
      .insert({
        name: 'ganocafe_main',
        tenant_id: 'ecommerce',
        prompt: promptContent,
        version: 'v1.4_ganocafe_bullet_format',
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) { console.error('❌ Error al insertar:', error.message); process.exit(1); }
    console.log('✅ System prompt creado:', data.version);
  }

  // Verificar resultado final
  console.log('\n🔍 Verificando...');
  const { data: verify } = await supabase
    .from('system_prompts')
    .select('name, tenant_id, version, updated_at')
    .eq('name', 'ganocafe_main')
    .single();

  console.log('✅ Verificación:', verify);
}

deploy();
