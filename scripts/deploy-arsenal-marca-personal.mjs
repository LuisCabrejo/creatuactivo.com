#!/usr/bin/env node

/**
 * deploy-arsenal-marca-personal.mjs
 * Despliega arsenal_marca_personal.txt a Supabase como documento padre
 * del tenant marca_personal (luiscabrejo.com).
 *
 * Ejecutar: node scripts/deploy-arsenal-marca-personal.mjs
 *
 * Después de este script:
 *   node scripts/fragmentar-arsenales-voyage.mjs  (para generar fragmentos + embeddings)
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync }  from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = dirname(__filename);

// Cargar .env.local
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

const CATEGORY  = 'arsenal_marca_personal';
const TENANT_ID = 'marca_personal';

async function main() {
  console.log('📤 Desplegando arsenal_marca_personal.txt → Supabase\n');
  console.log('   Tenant:', TENANT_ID);
  console.log('   Categoría:', CATEGORY);

  const arsenalPath = join(__dirname, '..', 'knowledge_base', 'arsenal_marca_personal.txt');
  const content     = readFileSync(arsenalPath, 'utf8');
  console.log('   Contenido:', content.length, 'caracteres\n');

  // Verificar si el documento padre ya existe
  const { data: existing } = await supabase
    .from('nexus_documents')
    .select('id, category')
    .eq('category', CATEGORY)
    .single();

  if (existing) {
    // Actualizar documento existente
    const { error } = await supabase
      .from('nexus_documents')
      .update({
        title:      'Arsenal Marca Personal v1.0 — luiscabrejo.com',
        content,
        tenant_id:  TENANT_ID,
        updated_at: new Date().toISOString()
      })
      .eq('category', CATEGORY);

    if (error) {
      console.error('❌ Error actualizando:', error.message);
      process.exit(1);
    }
    console.log('✅ Documento actualizado (', CATEGORY, ')');
  } else {
    // Insertar nuevo documento padre
    const { error } = await supabase
      .from('nexus_documents')
      .insert({
        category:  CATEGORY,
        title:     'Arsenal Marca Personal v1.0 — luiscabrejo.com',
        content,
        tenant_id: TENANT_ID,
        metadata:  {
          version:       'v1.0',
          tenant:        TENANT_ID,
          is_fragment:   false,
          deployed_at:   new Date().toISOString()
        }
      });

    if (error) {
      console.error('❌ Error insertando:', error.message);
      process.exit(1);
    }
    console.log('✅ Documento creado (', CATEGORY, ')');
  }

  // Verificar fragmentos existentes de este arsenal
  const { data: fragments } = await supabase
    .from('nexus_documents')
    .select('category')
    .like('category', `${CATEGORY}_%`);

  if (fragments?.length) {
    console.log(`\n⚠️  ${fragments.length} fragmentos existentes detectados.`);
    console.log('   Para regenerar con el nuevo contenido:');
    console.log('   1. Elimina los fragmentos en Supabase: .like(\'category\', \'arsenal_marca_personal_%\')');
    console.log('   2. Ejecuta: node scripts/fragmentar-arsenales-voyage.mjs');
  } else {
    console.log('\n📋 Próximo paso:');
    console.log('   node scripts/fragmentar-arsenales-voyage.mjs');
    console.log('   (genera 11 fragmentos con embeddings Voyage AI para luiscabrejo.com)');
  }

  console.log('\n✅ Deploy completado.');
}

main().catch(err => {
  console.error('\n💥 Error fatal:', err);
  process.exit(1);
});
