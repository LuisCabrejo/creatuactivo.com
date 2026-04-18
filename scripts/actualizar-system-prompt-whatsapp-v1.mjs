/**
 * Copyright © 2026 CreaTuActivo.com
 * Deploy System Prompt: queswa_whatsapp v1.2 → WABA WhatsApp Cloud API
 *
 * Crea (o actualiza) la fila con tenant_id='whatsapp' en system_prompts.
 * El webhook /api/whatsapp/webhook envía x-tenant-id: whatsapp →
 * getSystemPrompt('whatsapp') → esta fila.
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const __dirname = dirname(fileURLToPath(import.meta.url));
const promptContent = readFileSync(
  join(__dirname, '../knowledge_base/system-prompt-whatsapp-v1.0.md'),
  'utf-8'
);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function deploy() {
  console.log('📡 Conectando a Supabase...');
  console.log(`📄 Prompt cargado: ${promptContent.length} caracteres`);

  const { data: existing } = await supabase
    .from('system_prompts')
    .select('id, name, tenant_id, version')
    .eq('tenant_id', 'whatsapp')
    .maybeSingle();

  if (existing) {
    const { data, error } = await supabase
      .from('system_prompts')
      .update({
        prompt: promptContent,
        version: 'v1.2_whatsapp',
        updated_at: new Date().toISOString(),
      })
      .eq('tenant_id', 'whatsapp')
      .select()
      .single();

    if (error) { console.error('❌ Error al actualizar:', error.message); process.exit(1); }
    console.log('✅ System prompt actualizado:', data.version);
    console.log('📅 Updated:', data.updated_at);
  } else {
    const { data, error } = await supabase
      .from('system_prompts')
      .insert({
        name: 'queswa_whatsapp',
        tenant_id: 'whatsapp',
        prompt: promptContent,
        version: 'v1.2_whatsapp',
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) { console.error('❌ Error al insertar:', error.message); process.exit(1); }
    console.log('✅ System prompt creado:', data.version);
    console.log('📅 Insertado:', data.updated_at);
  }

  // Verificar RPC
  const { data: rpc } = await supabase.rpc('get_tenant_system_prompt', { p_tenant_id: 'whatsapp' });
  if (rpc && rpc.length > 0) {
    console.log(`✅ RPC verificado: tenant 'whatsapp' → ${rpc[0].name} (${rpc[0].version})`);
  } else {
    console.warn('⚠️  RPC no devolvió resultado — verificar tenant_id UNIQUE constraint');
  }
}

deploy();
