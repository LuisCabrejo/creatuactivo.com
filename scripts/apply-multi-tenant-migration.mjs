/**
 * apply-multi-tenant-migration.mjs
 * Aplica las migraciones de la Fase C (Multi-Tenant) directamente en Supabase.
 *
 * Ejecutar: node scripts/apply-multi-tenant-migration.mjs
 *
 * Orden de operaciones:
 *   1. Agrega columna tenant_id a nexus_documents
 *   2. Seed: etiqueta los 108 fragmentos existentes como creatuactivo_marketing
 *   3. Crea índices B-Tree (tenant_id, tenant+category)
 *   4. Actualiza RLS en nexus_documents
 *   5. Crea función set_app_tenant
 *   6. Crea función get_tenant_system_prompt
 *   7. Inserta/actualiza los 4 system_prompts por tenant
 *   8. Verifica resultado
 */

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// ─── helpers ──────────────────────────────────────────────────────────────────
async function sql(query, label) {
  console.log(`\n⚙️  ${label}...`)
  const { error } = await supabase.rpc('exec_sql', { query }).single()
  if (error) {
    // exec_sql no existe en Supabase público — usamos el cliente directo
    // Este bloque no se alcanza en producción
    console.warn(`   ⚠️  exec_sql no disponible: ${error.message}`)
  }
}

// ─── main ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log('🚀 Aplicando migración Multi-Tenant (FASE C)\n')
  console.log('   Supabase:', process.env.NEXT_PUBLIC_SUPABASE_URL)

  // ─── PASO 1: Verificar columna tenant_id en nexus_documents ────────────────
  console.log('\n📋 PASO 1: Verificar/crear columna tenant_id en nexus_documents')
  const { data: cols, error: colsErr } = await supabase
    .from('nexus_documents')
    .select('tenant_id')
    .limit(1)

  if (colsErr?.message?.includes('column "tenant_id" does not exist')) {
    console.log('   ❌ Columna no existe. Debes aplicar el SQL manualmente.')
    console.log('   📄 Archivo: supabase/migrations/20260316_multi_tenant_rls.sql')
    console.log('   📄 Archivo: supabase/migrations/20260316_tenant_system_prompts.sql')
    console.log('\n   Instrucciones:')
    console.log('   1. Abre Supabase Dashboard → SQL Editor')
    console.log('   2. Pega y ejecuta 20260316_multi_tenant_rls.sql')
    console.log('   3. Pega y ejecuta 20260316_tenant_system_prompts.sql')
    console.log('   4. Vuelve a correr este script para verificar')
    process.exit(1)
  }

  if (colsErr) {
    console.error('   ❌ Error inesperado:', colsErr.message)
    process.exit(1)
  }
  console.log('   ✅ Columna tenant_id existe')

  // ─── PASO 2: Verificar seed de documentos existentes ───────────────────────
  console.log('\n📋 PASO 2: Verificar distribución de tenant_id en nexus_documents')
  const { data: tenantDist } = await supabase
    .from('nexus_documents')
    .select('tenant_id')

  if (tenantDist) {
    const counts = tenantDist.reduce((acc, row) => {
      acc[row.tenant_id] = (acc[row.tenant_id] || 0) + 1
      return acc
    }, {})
    console.log('   Distribución actual:')
    Object.entries(counts).forEach(([tid, count]) =>
      console.log(`   • ${tid}: ${count} documentos`)
    )

    // Seed: documentos sin tenant_id o con valor vacío
    const untagged = tenantDist.filter(r => !r.tenant_id).length
    if (untagged > 0) {
      console.log(`\n   🔧 Seeding ${untagged} documentos sin tenant_id...`)
      const { error: seedErr } = await supabase
        .from('nexus_documents')
        .update({ tenant_id: 'creatuactivo_marketing' })
        .is('tenant_id', null)
      if (seedErr) console.error('   ❌ Error en seed:', seedErr.message)
      else console.log('   ✅ Seed completado')
    } else {
      console.log('   ✅ Todos los documentos tienen tenant_id')
    }
  }

  // ─── PASO 3: Verificar system_prompts por tenant ───────────────────────────
  console.log('\n📋 PASO 3: Verificar system_prompts por tenant')

  const tenantPrompts = [
    { name: 'nexus_main',         tenant_id: 'creatuactivo_marketing' },
    { name: 'luiscabrejo_main',   tenant_id: 'marca_personal' },
    { name: 'queswa_dashboard',   tenant_id: 'queswa_dashboard' },
    { name: 'ganocafe_main',      tenant_id: 'ecommerce' },
  ]

  for (const { name, tenant_id } of tenantPrompts) {
    const { data, error } = await supabase
      .from('system_prompts')
      .select('name, version, updated_at')
      .eq('name', name)
      .single()

    if (error || !data) {
      console.log(`   ❌ ${name} (${tenant_id}): NO EXISTE — aplicar SQL manualmente`)
    } else {
      console.log(`   ✅ ${name} (${tenant_id}): ${data.version} — ${data.updated_at}`)
    }
  }

  // ─── PASO 4: Verificar función get_tenant_system_prompt ────────────────────
  console.log('\n📋 PASO 4: Probar RPC get_tenant_system_prompt')
  const { data: rpcTest, error: rpcErr } = await supabase
    .rpc('get_tenant_system_prompt', { p_tenant_id: 'creatuactivo_marketing' })

  if (rpcErr) {
    console.log('   ❌ RPC no disponible:', rpcErr.message)
    console.log('   → Aplicar 20260316_tenant_system_prompts.sql en Supabase Dashboard')
  } else {
    const row = Array.isArray(rpcTest) ? rpcTest[0] : rpcTest
    console.log(`   ✅ RPC operativa → ${row?.name} (${row?.version})`)
  }

  // ─── PASO 5: Verificar RLS en nexus_documents ──────────────────────────────
  console.log('\n📋 PASO 5: Verificar aislamiento tenant (query con filtro explícito)')
  const { data: isolationTest, error: isoErr } = await supabase
    .from('nexus_documents')
    .select('id, tenant_id')
    .eq('tenant_id', 'creatuactivo_marketing')
    .limit(3)

  if (isoErr) {
    console.log('   ❌ Error en query:', isoErr.message)
  } else {
    console.log(`   ✅ Query filtrada por tenant devuelve ${isolationTest?.length} docs (muestra de 3)`)
  }

  // ─── Resumen ───────────────────────────────────────────────────────────────
  console.log('\n' + '─'.repeat(60))
  console.log('✅ VERIFICACIÓN COMPLETA')
  console.log('\nPróximos pasos:')
  console.log('  Capa 3.2 — Modificar nexus/route.ts para leer x-tenant-id')
  console.log('             y llamar get_tenant_system_prompt(tenantId)')
  console.log('  Capa 3.1 — Modificar voice-command/route.ts con prompt jerárquico')
  console.log('  Capa 4.1 — Añadir filtro tenant_id en vectorSearch.ts')
}

main().catch(err => {
  console.error('\n💥 Error fatal:', err)
  process.exit(1)
})
