#!/usr/bin/env node

/**
 * deploy-arsenal-ganocafe.mjs
 * Despliega arsenal_ganocafe.txt a Supabase como documento padre
 * del tenant ecommerce (ganocafe.online).
 *
 * Ejecutar: node scripts/deploy-arsenal-ganocafe.mjs
 *
 * Después de este script:
 *   node scripts/fragmentar-arsenales-voyage.mjs  (genera fragmentos + embeddings)
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync }  from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = dirname(__filename);

const envPath    = join(__dirname, '..', '.env.local');
const envContent = readFileSync(envPath, 'utf-8');
const envVars    = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) envVars[match[1].trim()] = match[2].trim().replace(/^["']|["']$/g, '');
});

const supabase = createClient(
  envVars.NEXT_PUBLIC_SUPABASE_URL,
  envVars.SUPABASE_SERVICE_ROLE_KEY
);

const CATEGORY  = 'arsenal_ganocafe';
const TENANT_ID = 'ecommerce';

async function main() {
  console.log('📤 Desplegando arsenal_ganocafe.txt → Supabase\n');
  console.log('   Tenant:', TENANT_ID);
  console.log('   Categoría:', CATEGORY);

  const arsenalPath = join(__dirname, '..', 'knowledge_base', 'arsenal_ganocafe.txt');
  const content     = readFileSync(arsenalPath, 'utf8');
  console.log('   Contenido:', content.length, 'caracteres\n');

  const { data: existing } = await supabase
    .from('nexus_documents')
    .select('id, category')
    .eq('category', CATEGORY)
    .single();

  if (existing) {
    const { error } = await supabase
      .from('nexus_documents')
      .update({
        title:      'Arsenal GanoCafe v1.0 — ganocafe.online',
        content,
        tenant_id:  TENANT_ID,
        updated_at: new Date().toISOString()
      })
      .eq('category', CATEGORY);

    if (error) { console.error('❌ Error actualizando:', error.message); process.exit(1); }
    console.log('✅ Documento actualizado (', CATEGORY, ')');
  } else {
    const { error } = await supabase
      .from('nexus_documents')
      .insert({
        category:  CATEGORY,
        title:     'Arsenal GanoCafe v1.0 — ganocafe.online',
        content,
        tenant_id: TENANT_ID,
        metadata:  {
          version:     'v1.0',
          tenant:      TENANT_ID,
          is_fragment: false,
          deployed_at: new Date().toISOString()
        }
      });

    if (error) { console.error('❌ Error insertando:', error.message); process.exit(1); }
    console.log('✅ Documento creado (', CATEGORY, ')');
  }

  const { data: fragments } = await supabase
    .from('nexus_documents')
    .select('category')
    .like('category', `${CATEGORY}_%`);

  if (fragments?.length) {
    console.log(`\n⚠️  ${fragments.length} fragmentos existentes detectados.`);
    console.log('   Para regenerar: elimina fragmentos .like(\'category\', \'arsenal_ganocafe_%\')');
    console.log('   Luego: node scripts/fragmentar-arsenales-voyage.mjs');
  } else {
    console.log('\n📋 Próximo paso:');
    console.log('   node scripts/fragmentar-arsenales-voyage.mjs');
    console.log('   (genera 13 fragmentos con embeddings Voyage AI para ganocafe.online)');
  }

  console.log('\n✅ Deploy completado.');
}

main().catch(err => {
  console.error('\n💥 Error fatal:', err);
  process.exit(1);
});
