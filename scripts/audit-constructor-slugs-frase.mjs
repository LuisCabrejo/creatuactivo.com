/**
 * Copyright © 2026 CreaTuActivo.com
 * Auditoría + actualización de constructor_slugs.frase_personal
 *
 * Busca registros con "Patrimonio Paralelo" (sustantivo prohibido v26.4)
 * y los actualiza a "Estructura Patrimonial".
 *
 * Uso:
 *   node scripts/audit-constructor-slugs-frase.mjs        # solo audita (dry-run)
 *   node scripts/audit-constructor-slugs-frase.mjs --apply  # aplica updates
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const envPath = join(__dirname, '..', '.env.local');
const envContent = readFileSync(envPath, 'utf8');
const supabaseUrl = envContent.match(/NEXT_PUBLIC_SUPABASE_URL=(.+)/)?.[1]?.trim();
const supabaseKey = envContent.match(/SUPABASE_SERVICE_ROLE_KEY=(.+)/)?.[1]?.trim();

const supabase = createClient(supabaseUrl, supabaseKey);
const APPLY = process.argv.includes('--apply');

console.log(`\n${'='.repeat(60)}`);
console.log(`🔍 Auditoría constructor_slugs.frase_personal`);
console.log(`Modo: ${APPLY ? '⚙️  APLICAR cambios' : '👁️  DRY RUN (solo audita)'}`);
console.log('='.repeat(60));

// 1. Listar TODOS los registros para inspección
const { data: all, error: allError } = await supabase
  .from('constructor_slugs')
  .select('slug, display_name, frase_personal');

if (allError) {
  console.error('❌ Error consultando:', allError.message);
  process.exit(1);
}

console.log(`\n📊 Total registros: ${all.length}\n`);

// 2. Mostrar todas las frases para inspección
console.log('📋 Inventario de frase_personal:');
all.forEach(r => {
  const frase = r.frase_personal || '(null/vacío)';
  console.log(`   • ${r.slug}: "${frase}"`);
});

// 3. Detectar violaciones léxicas v26.4
const VIOLATIONS = ['Patrimonio Paralelo', 'patrimonio paralelo', 'software financiero', 'apalancamiento asimétrico', 'gobernanza'];

const affected = all.filter(r => {
  if (!r.frase_personal) return false;
  return VIOLATIONS.some(v => r.frase_personal.toLowerCase().includes(v.toLowerCase()));
});

console.log(`\n🔴 Registros con violaciones léxicas v26.4: ${affected.length}\n`);

if (affected.length === 0) {
  console.log('✅ Cero violaciones — base de datos limpia');
  process.exit(0);
}

affected.forEach(r => {
  console.log(`   • ${r.slug} (${r.display_name}): "${r.frase_personal}"`);
});

// 4. Si --apply, aplicar reemplazos
if (APPLY) {
  console.log(`\n⚙️  Aplicando reemplazos...`);
  for (const r of affected) {
    let newFrase = r.frase_personal
      .replace(/Patrimonio Paralelo/g, 'Estructura Patrimonial')
      .replace(/patrimonio paralelo/g, 'Estructura Patrimonial');

    console.log(`\n   ${r.slug}:`);
    console.log(`     ANTES: "${r.frase_personal}"`);
    console.log(`     DESPUÉS: "${newFrase}"`);

    const { error } = await supabase
      .from('constructor_slugs')
      .update({ frase_personal: newFrase })
      .eq('slug', r.slug);

    if (error) {
      console.error(`     ❌ Error: ${error.message}`);
    } else {
      console.log(`     ✅ Actualizado`);
    }
  }

  console.log(`\n🎉 Proceso completado. ${affected.length} registros actualizados.`);
  console.log(`💡 Vercel pre-renderiza la mini-landing — puede requerir redeploy o esperar revalidación.`);
} else {
  console.log(`\n💡 Para aplicar los cambios ejecute:`);
  console.log(`   node scripts/audit-constructor-slugs-frase.mjs --apply`);
}
