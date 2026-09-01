/**
 * Copyright © 2026 CreaTuActivo.com
 * Deploy System Prompt: queswa_whatsapp v3.0 → WABA WhatsApp Cloud API
 *
 * Crea (o actualiza) la fila con tenant_id='whatsapp' en system_prompts.
 * El webhook /api/whatsapp/webhook envía x-tenant-id: whatsapp →
 * get_tenant_system_prompt('whatsapp') → esta fila.
 *
 * ⚠️ NO use `actualizar-system-prompt-whatsapp-v1.mjs`: lee
 * `system-prompt-whatsapp-v1.0.md` y escribe la etiqueta `v1.2_whatsapp`, así que
 * revierte producción a la versión de abril. Este es el script vivo.
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const VERSION_LABEL = 'v4.26_cadencia_cifras_cierres';
const ARCHIVO_PROMPT = 'system-prompt-queswa-whatsapp-v4.md';

const __dirname = dirname(fileURLToPath(import.meta.url));
const promptContent = readFileSync(join(__dirname, '../knowledge_base', ARCHIVO_PROMPT), 'utf-8');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function deploy() {
  console.log(`📄 ${ARCHIVO_PROMPT} → ${promptContent.length} caracteres (${VERSION_LABEL})`);

  const { data: existing } = await supabase
    .from('system_prompts')
    .select('id, name, tenant_id, version')
    .eq('tenant_id', 'whatsapp')
    .maybeSingle();

  if (existing) {
    console.log(`📌 Versión que se reemplaza: ${existing.version}`);
  }

  const payload = {
    prompt: promptContent,
    version: VERSION_LABEL,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = existing
    ? await supabase.from('system_prompts').update(payload).eq('tenant_id', 'whatsapp').select().single()
    : await supabase.from('system_prompts')
        .insert({ name: 'queswa_whatsapp', tenant_id: 'whatsapp', ...payload })
        .select()
        .single();

  if (error) {
    console.error('❌ Error al desplegar:', error.message);
    process.exit(1);
  }

  console.log(`✅ System prompt ${existing ? 'actualizado' : 'creado'}: ${data.version} (${data.updated_at})`);

  // Verificar por la misma vía que usa el motor
  const { data: rpc } = await supabase.rpc('get_tenant_system_prompt', { p_tenant_id: 'whatsapp' });
  if (rpc && rpc.length > 0) {
    console.log(`✅ RPC verificado: tenant 'whatsapp' → ${rpc[0].name} (${rpc[0].version}), ${rpc[0].prompt?.length} chars`);
  } else {
    console.warn('⚠️  RPC sin resultado — revisar el constraint UNIQUE de tenant_id');
  }

  console.log('\n⏳ El motor cachea el prompt 5 minutos. Espere ese tiempo antes de probar.');
}

deploy();
