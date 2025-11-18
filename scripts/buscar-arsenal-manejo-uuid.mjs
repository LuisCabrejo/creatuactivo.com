/**
 * Buscar UUID de arsenal_manejo en Supabase
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Leer variables de entorno
const envPath = join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = {};

envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.+)$/);
  if (match) {
    const key = match[1].trim();
    const value = match[2].trim().replace(/^["']|["']$/g, '');
    envVars[key] = value;
  }
});

const supabase = createClient(
  envVars.NEXT_PUBLIC_SUPABASE_URL,
  envVars.SUPABASE_SERVICE_ROLE_KEY
);

async function buscarArsenalManejo() {
  console.log('🔍 Buscando arsenal_manejo en nexus_documents...\n');

  const { data, error} = await supabase
    .from('nexus_documents')
    .select('id, title, category, updated_at')
    .ilike('title', '%arsenal%man%')
    .order('title');

  if (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }

  console.log('📚 Documentos con "arsenal" en el título:\n');
  data.forEach(doc => {
    console.log(`📄 ${doc.title}`);
    console.log(`   UUID: ${doc.id}`);
    console.log(`   Category: ${doc.category}`);
    console.log(`   Updated: ${doc.updated_at}\n`);
  });
}

buscarArsenalManejo().catch(console.error);
