/**
 * Copyright © 2026 CreaTuActivo.com
 * Clona fragmentos de arsenal_inicial (tenant: creatuactivo_marketing)
 * al tenant 'whatsapp' en nexus_documents.
 *
 * Esto permite que el motor Queswa use RAG con arsenal_inicial
 * cuando responde en WhatsApp (x-tenant-id: whatsapp).
 *
 * Estrategia: copia exacta de content + embedding (sin re-embeddear).
 * Los embeddings Voyage AI son agnósticos al tenant — son válidos.
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function clonar() {
  console.log('📡 Conectando a Supabase...');

  // 1. Obtener todos los fragmentos de arsenal_inicial de creatuactivo_marketing
  const { data: origen, error: errOrigen } = await supabase
    .from('nexus_documents')
    .select('*')
    .eq('tenant_id', 'creatuactivo_marketing')
    .like('category', 'arsenal_inicial%');

  if (errOrigen) { console.error('❌ Error al leer origen:', errOrigen.message); process.exit(1); }
  console.log(`📄 Fragmentos encontrados en origen: ${origen.length}`);

  // 2. Verificar cuántos ya existen en tenant 'whatsapp'
  const { data: existentes } = await supabase
    .from('nexus_documents')
    .select('category')
    .eq('tenant_id', 'whatsapp')
    .like('category', 'arsenal_inicial%');

  const yaExisten = new Set(existentes?.map(d => d.category) || []);
  console.log(`📋 Ya clonados: ${yaExisten.size}`);

  // 3. Filtrar solo los que faltan
  const pendientes = origen.filter(d => !yaExisten.has(d.category));
  console.log(`⏳ Por clonar: ${pendientes.length}`);

  if (pendientes.length === 0) {
    console.log('✅ Todos los fragmentos ya están clonados.');
    return;
  }

  // 4. Insertar con tenant_id = 'whatsapp' (sin el id original para que Supabase genere uno nuevo)
  const insertar = pendientes.map(({ id, tenant_id, created_at, ...rest }) => ({
    ...rest,
    tenant_id: 'whatsapp',
  }));

  // Insertar en lotes de 10 para evitar timeout
  const LOTE = 10;
  let insertados = 0;

  for (let i = 0; i < insertar.length; i += LOTE) {
    const lote = insertar.slice(i, i + LOTE);
    const { error } = await supabase.from('nexus_documents').insert(lote);
    if (error) {
      console.error(`❌ Error en lote ${i / LOTE + 1}:`, error.message);
      process.exit(1);
    }
    insertados += lote.length;
    console.log(`  ✓ ${insertados}/${insertar.length} fragmentos insertados`);
  }

  // 5. Verificar resultado final
  const { count } = await supabase
    .from('nexus_documents')
    .select('*', { count: 'exact', head: true })
    .eq('tenant_id', 'whatsapp')
    .like('category', 'arsenal_inicial%');

  console.log(`\n✅ Clonación completada. Fragmentos arsenal_inicial en tenant 'whatsapp': ${count}`);
}

clonar();
