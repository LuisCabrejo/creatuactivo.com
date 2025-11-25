/**
 * Script para actualizar fechas en arsenales existentes
 * Fecha: 25 Nov 2025
 *
 * Nuevas fechas:
 * - Lista Privada: 10 Nov 2025 - 04 Ene 2026 (domingo)
 * - Pre-Lanzamiento: 05 Ene - 01 Mar 2026 (lunes)
 * - Lanzamiento Público: 02 Mar 2026
 *
 * INSTRUCCIONES:
 * Ejecutar desde la raíz del proyecto: node knowledge_base/ACTUALIZAR_FECHAS_ARSENALES.js
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Cargar credenciales desde .env.local
const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');

const supabaseUrl = envContent.match(/NEXT_PUBLIC_SUPABASE_URL=(.+)/)?.[1]?.trim();
const supabaseKey = envContent.match(/SUPABASE_SERVICE_ROLE_KEY=(.+)/)?.[1]?.trim();

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: No se encontraron las credenciales de Supabase en .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Mapeo de fechas a actualizar
const dateReplacements = [
  // Formato 1: "17 Nov - 30 Nov" → "10 Nov 2025 - 04 Ene 2026"
  {
    old: '17 Nov - 30 Nov',
    new: '10 Nov 2025 - 04 Ene 2026',
    description: 'Lista Privada (formato corto)'
  },
  {
    old: '17 Nov - 30 Nov 2025',
    new: '10 Nov 2025 - 04 Ene 2026',
    description: 'Lista Privada (con año)'
  },
  // Formato 2: "01 Dic - 01 Mar" → "05 Ene - 01 Mar 2026"
  {
    old: '01 Dic - 01 Mar',
    new: '05 Ene - 01 Mar 2026',
    description: 'Pre-Lanzamiento (formato corto)'
  },
  {
    old: '01 Dic 2025 - 01 Mar 2026',
    new: '05 Ene - 01 Mar 2026',
    description: 'Pre-Lanzamiento (con año)'
  },
  // Formato 3: "02 Mar 2026" (sin cambios, pero verificar)
  {
    old: '02 Mar 2025',
    new: '02 Mar 2026',
    description: 'Lanzamiento Público (corregir año)'
  }
];

async function updateArsenalDates() {
  console.log('🚀 Iniciando actualización de fechas en arsenales...\n');

  const categories = ['arsenal_inicial', 'arsenal_manejo', 'arsenal_cierre'];

  for (const category of categories) {
    console.log(`\n📝 Actualizando ${category}...`);

    // 1. Obtener contenido actual
    const { data, error } = await supabase
      .from('nexus_documents')
      .select('id, content')
      .eq('category', category)
      .single();

    if (error) {
      console.error(`❌ Error al obtener ${category}:`, error);
      continue;
    }

    if (!data) {
      console.log(`   ⚠️  ${category} no encontrado, saltando...`);
      continue;
    }

    let updatedContent = data.content;
    let changesCount = 0;

    // 2. Aplicar todas las sustituciones
    for (const replacement of dateReplacements) {
      const occurrences = (updatedContent.match(new RegExp(replacement.old, 'g')) || []).length;
      if (occurrences > 0) {
        updatedContent = updatedContent.replaceAll(replacement.old, replacement.new);
        console.log(`   ✅ ${replacement.description}: ${occurrences} ocurrencias actualizadas`);
        changesCount++;
      }
    }

    if (changesCount === 0) {
      console.log(`   ℹ️  No se encontraron fechas antiguas para actualizar`);
      continue;
    }

    // 3. Actualizar en Supabase
    const { error: updateError } = await supabase
      .from('nexus_documents')
      .update({
        content: updatedContent,
        updated_at: new Date().toISOString()
      })
      .eq('id', data.id);

    if (updateError) {
      console.error(`❌ Error al actualizar ${category}:`, updateError);
      continue;
    }

    console.log(`   ✅ ${category} actualizado con ${changesCount} cambios`);
  }

  // 4. Verificar que las fechas se actualizaron correctamente
  console.log('\n\n4️⃣ Verificando fechas actualizadas...\n');

  const { data: arsenales, error: verifyError } = await supabase
    .from('nexus_documents')
    .select('category, content')
    .in('category', categories);

  if (verifyError) {
    console.error('❌ Error al verificar:', verifyError);
    return;
  }

  for (const arsenal of arsenales) {
    const hasNewDates = arsenal.content.includes('10 Nov 2025 - 04 Ene 2026') &&
                        arsenal.content.includes('05 Ene - 01 Mar 2026');

    const status = hasNewDates ? '✅ Fechas actualizadas' : '❌ Fechas sin actualizar';
    console.log(`   ${arsenal.category}: ${status}`);
  }

  console.log('\n✅ ¡Actualización de fechas completada!\n');
  console.log('📋 PRÓXIMOS PASOS:');
  console.log('   1. Verificar en Supabase Dashboard que los cambios son correctos');
  console.log('   2. Probar NEXUS en localhost para confirmar respuestas con nuevas fechas');
  console.log('   3. Hacer deploy a producción\n');
}

updateArsenalDates().catch(console.error);
