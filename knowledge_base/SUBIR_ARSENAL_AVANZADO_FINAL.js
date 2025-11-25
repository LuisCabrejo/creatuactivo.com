/**
 * Script para subir arsenal_avanzado.txt a Supabase
 * Fecha: 25 Nov 2025
 *
 * INSTRUCCIONES:
 * 1. Ejecutar desde la raíz del proyecto: node knowledge_base/SUBIR_ARSENAL_AVANZADO_FINAL.js
 * 2. Verifica que las credenciales en .env.local sean correctas
 * 3. El script leerá el contenido de arsenal_avanzado.txt y lo subirá a Supabase
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

// Leer contenido de arsenal_avanzado.txt
const arsenalPath = path.join(__dirname, 'arsenal_avanzado.txt');
let arsenalContent = fs.readFileSync(arsenalPath, 'utf8');

// Extraer solo el contenido (entre las comillas del UPDATE)
// El archivo tiene formato: UPDATE ... SET content = '...' WHERE ...
const contentMatch = arsenalContent.match(/content = '([\s\S]+)'\nWHERE/);
if (!contentMatch) {
  console.error('❌ Error: No se pudo extraer el contenido de arsenal_avanzado.txt');
  process.exit(1);
}

const content = contentMatch[1];

async function insertArsenalAvanzado() {
  console.log('🚀 Iniciando inserción de arsenal_avanzado...\n');

  // 1. Verificar si ya existe
  console.log('1️⃣ Verificando si arsenal_avanzado ya existe...');
  const { data: existing, error: checkError } = await supabase
    .from('nexus_documents')
    .select('id, category')
    .eq('category', 'arsenal_avanzado')
    .maybeSingle();

  if (checkError) {
    console.error('❌ Error al verificar:', checkError);
    return;
  }

  if (existing) {
    console.log(`⚠️  arsenal_avanzado ya existe (ID: ${existing.id})`);
    console.log('   Ejecutando UPDATE en su lugar...\n');

    const { error: updateError } = await supabase
      .from('nexus_documents')
      .update({
        content: content,
        title: 'Arsenal Avanzado - Objeciones + Sistema + Valor + Escalación',
        metadata: {
          respuestas_totales: 37,
          version: '2.0',
          consolidacion: {
            fecha: '2025-11-25',
            origen: ['arsenal_manejo', 'arsenal_cierre'],
            respuestas_eliminadas: 24,
            reduccion_porcentaje: 38
          },
          categorias: {
            OBJ: 11,
            SIST: 10,
            VAL: 11,
            ESC: 5
          },
          descripcion: 'Arsenal consolidado: Objeciones críticas + Sistema + Modelo de valor + Escalación'
        },
        updated_at: new Date().toISOString()
      })
      .eq('id', existing.id);

    if (updateError) {
      console.error('❌ Error al actualizar:', updateError);
      return;
    }

    console.log('✅ arsenal_avanzado actualizado exitosamente!');
  } else {
    console.log('   No existe, procediendo con INSERT...\n');

    // 2. Insertar nuevo registro
    console.log('2️⃣ Insertando arsenal_avanzado...');
    const { data, error } = await supabase
      .from('nexus_documents')
      .insert({
        category: 'arsenal_avanzado',
        title: 'Arsenal Avanzado - Objeciones + Sistema + Valor + Escalación',
        content: content,
        metadata: {
          respuestas_totales: 37,
          version: '2.0',
          consolidacion: {
            fecha: '2025-11-25',
            origen: ['arsenal_manejo', 'arsenal_cierre'],
            respuestas_eliminadas: 24,
            reduccion_porcentaje: 38
          },
          categorias: {
            OBJ: 11,
            SIST: 10,
            VAL: 11,
            ESC: 5
          },
          descripcion: 'Arsenal consolidado: Objeciones críticas + Sistema + Modelo de valor + Escalación'
        }
      })
      .select();

    if (error) {
      console.error('❌ Error al insertar:', error);
      return;
    }

    console.log('✅ arsenal_avanzado insertado exitosamente!');
    console.log(`   ID generado: ${data[0].id}\n`);
  }

  // 3. Verificar inserción
  console.log('3️⃣ Verificando registro...');
  const { data: verify, error: verifyError } = await supabase
    .from('nexus_documents')
    .select('id, category, title, metadata, created_at, updated_at')
    .eq('category', 'arsenal_avanzado')
    .single();

  if (verifyError) {
    console.error('❌ Error al verificar:', verifyError);
    return;
  }

  console.log('\n📊 Registro verificado:');
  console.log(`   ID: ${verify.id}`);
  console.log(`   Category: ${verify.category}`);
  console.log(`   Title: ${verify.title}`);
  console.log(`   Respuestas: ${verify.metadata?.respuestas_totales}`);
  console.log(`   Versión: ${verify.metadata?.version}`);
  console.log(`   Consolidación: ${verify.metadata?.consolidacion?.fecha}`);
  console.log(`   Created: ${verify.created_at}`);
  console.log(`   Updated: ${verify.updated_at}`);

  // 4. Mostrar resumen de todos los arsenales
  console.log('\n4️⃣ Resumen de todos los arsenales:');
  const { data: arsenales, error: arsenalesError } = await supabase
    .from('nexus_documents')
    .select('id, category, metadata')
    .in('category', ['arsenal_inicial', 'arsenal_manejo', 'arsenal_cierre', 'arsenal_avanzado', 'catalogo_productos'])
    .order('category');

  if (arsenalesError) {
    console.error('❌ Error al obtener arsenales:', arsenalesError);
    return;
  }

  arsenales.forEach((a, i) => {
    const respuestas = a.metadata?.respuestas_totales || 'N/A';
    const version = a.metadata?.version || 'N/A';
    const estado = a.category === 'arsenal_avanzado' ? '✅ NUEVO' :
                   ['arsenal_manejo', 'arsenal_cierre'].includes(a.category) ? '⚠️ DEPRECAR' : '✅ MANTENER';
    console.log(`   ${i + 1}. ${a.category}`);
    console.log(`      Respuestas: ${respuestas} | Versión: ${version} | ${estado}`);
  });

  console.log('\n✅ ¡Proceso completado exitosamente!');
  console.log('\n📋 PRÓXIMOS PASOS:');
  console.log('   1. Actualizar fechas en arsenales existentes (ejecutar ACTUALIZAR_FECHAS_ARSENALES.js)');
  console.log('   2. Probar en localhost: curl http://localhost:3000/api/nexus');
  console.log('   3. Verificar que NEXUS responde correctamente con arsenal_avanzado');
  console.log('   4. Hacer deploy a producción');
  console.log('   5. (Opcional) Deprecar arsenal_manejo y arsenal_cierre después de 1-2 semanas\n');
}

insertArsenalAvanzado().catch(console.error);
