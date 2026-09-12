/**
 * Copyright © 2026 CreaTuActivo.com
 *
 * Despliega el esqueleto con que Queswa redacta mensajes para el SOCIO
 * (`src/lib/wa-redaccion-socio.ts`) al tenant `dashboard` de `nexus_documents`,
 * para que queswa.app redacte con EXACTAMENTE el mismo texto que el canal de
 * WhatsApp. Decisión del Director (12 sep 2026): el socio debe vivir los dos
 * lugares como la misma experiencia, y eso exige una sola fuente.
 *
 * WhatsApp lo importa del archivo (no pasa por aquí). El Dashboard lo lee de la
 * fila con categoría `esqueleto_redaccion_socio` (caché 5 min). No lleva
 * embedding a propósito: no es material de consulta, es instrucción.
 *
 *   npx tsx scripts/desplegar-redaccion-socio.mts      # despliega
 *   npx tsx scripts/desplegar-redaccion-socio.mts --dry  # muestra tamaño y no sube
 *
 * Correrlo cada vez que cambie wa-redaccion-socio.ts (está anotado en su cabecera).
 */
import { config } from 'dotenv'; config({ path: '.env.local' });
import { createClient } from '@supabase/supabase-js';
import { ESQUELETO_REDACCION_SOCIO } from '../src/lib/wa-redaccion-socio.ts';

const TENANT = 'dashboard';
const CATEGORIA = 'esqueleto_redaccion_socio';
const TITULO = 'Esqueleto de redacción de mensajes del socio (fuente: marketing/src/lib/wa-redaccion-socio.ts)';
const DRY = process.argv.includes('--dry');

async function main() {
  const contenido = ESQUELETO_REDACCION_SOCIO.trim();
  console.log(`📄 Esqueleto: ${contenido.length} caracteres → tenant ${TENANT}, categoría ${CATEGORIA}`);
  if (DRY) { console.log('   --dry: no se sube'); return; }

  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
  const metadata = { is_fragment: false, fuente: 'src/lib/wa-redaccion-socio.ts', desplegado_at: new Date().toISOString() };

  const { data: existentes, error: e1 } = await supabase
    .from('nexus_documents').select('id').eq('tenant_id', TENANT).eq('category', CATEGORIA);
  if (e1) throw e1;

  if (existentes && existentes.length) {
    const [primero, ...sobrantes] = existentes;
    const { error } = await supabase.from('nexus_documents')
      .update({ title: TITULO, content: contenido, metadata, updated_at: new Date().toISOString() })
      .eq('id', primero.id);
    if (error) throw error;
    if (sobrantes.length) {
      const { error: e2 } = await supabase.from('nexus_documents').delete().in('id', sobrantes.map((s) => s.id));
      if (e2) throw e2;
      console.log(`🧹 ${sobrantes.length} fila(s) duplicada(s) retirada(s)`);
    }
    console.log(`✅ Actualizado (${primero.id})`);
  } else {
    const { data, error } = await supabase.from('nexus_documents')
      .insert({ tenant_id: TENANT, category: CATEGORIA, title: TITULO, content: contenido, metadata })
      .select('id').single();
    if (error) throw error;
    console.log(`✅ Creado (${data.id})`);
  }

  const { data: check } = await supabase.from('nexus_documents')
    .select('content').eq('tenant_id', TENANT).eq('category', CATEGORIA).limit(1);
  console.log(check?.[0]?.content?.length === contenido.length ? '✅ Verificado en la base' : '⚠️ La lectura no coincide con lo subido');
  console.log('⏳ El Dashboard cachea el esqueleto 5 minutos.');
}

main().catch((e) => { console.error('❌', e.message ?? e); process.exit(1); });
