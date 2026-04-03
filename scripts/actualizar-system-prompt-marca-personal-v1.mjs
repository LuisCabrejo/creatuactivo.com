/**
 * Copyright © 2026 CreaTuActivo.com
 * Deploy System Prompt: marca_personal v1.0 → luiscabrejo.com
 *
 * Crea (o actualiza) la fila con tenant_id='marca_personal' en system_prompts.
 * El RPC get_tenant_system_prompt usa tenant_id para resolución — sin esta fila,
 * luiscabrejo.com cae al fallback nexus_main (incorrecto).
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const __dirname = dirname(fileURLToPath(import.meta.url));
const promptContent = readFileSync(
  join(__dirname, '../knowledge_base/system-prompt-marca-personal-v1.0.md'),
  'utf-8'
);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function deploy() {
  console.log('📡 Conectando a Supabase...');
  console.log(`📄 Prompt cargado: ${promptContent.length} caracteres`);

  // Primero verificar si ya existe una fila con tenant_id = 'marca_personal'
  const { data: existing } = await supabase
    .from('system_prompts')
    .select('id, name, tenant_id, version')
    .eq('tenant_id', 'marca_personal')
    .maybeSingle();

  if (existing) {
    // Actualizar fila existente
    const { data, error } = await supabase
      .from('system_prompts')
      .update({
        prompt: promptContent,
        version: 'v1.0_marca_personal',
        updated_at: new Date().toISOString(),
      })
      .eq('tenant_id', 'marca_personal')
      .select()
      .single();

    if (error) { console.error('❌ Error al actualizar:', error.message); process.exit(1); }
    console.log('✅ System prompt actualizado:', data.version);
    console.log('📅 Actualizado:', data.updated_at);
  } else {
    // Insertar nueva fila
    const { data, error } = await supabase
      .from('system_prompts')
      .insert({
        name: 'marca_personal',
        tenant_id: 'marca_personal',
        prompt: promptContent,
        version: 'v1.0_marca_personal',
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) { console.error('❌ Error al insertar:', error.message); process.exit(1); }
    console.log('✅ System prompt creado:', data.version);
    console.log('📅 Insertado:', data.updated_at);
  }
}

deploy();
