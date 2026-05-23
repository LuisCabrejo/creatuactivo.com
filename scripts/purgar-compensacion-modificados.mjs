#!/usr/bin/env node
/**
 * Purga los fragments de arsenal_compensacion modificados v6.4 (22 May 2026)
 * para que fragmentar-arsenales-voyage.mjs los recree con el contenido actualizado.
 *
 * Razón: fragmentar-arsenales-voyage.mjs salta fragments existentes (línea 195).
 * Cuando modificas un fragmento existente, primero hay que purgarlo y luego
 * re-fragmentar.
 *
 * Uso: node scripts/purgar-compensacion-modificados.mjs
 *      seguido de: node scripts/fragmentar-arsenales-voyage.mjs
 */
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
dotenv.config({ path: join(dirname(__filename), '..', '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const fragmentosAPurgar = [
  'arsenal_compensacion_COMP_MODELO_01',
  'arsenal_compensacion_COMP_PAQ_01',
];

console.log('🗑️  Purgando fragments modificados v6.4...\n');

for (const cat of fragmentosAPurgar) {
  const { error } = await supabase
    .from('nexus_documents')
    .delete()
    .eq('category', cat);
  console.log(error ? `❌ ${cat}: ${error.message}` : `✅ ${cat} purgado`);
}

console.log('\n📋 Próximo paso: node scripts/fragmentar-arsenales-voyage.mjs');
