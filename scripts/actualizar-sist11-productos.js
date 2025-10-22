// Actualizar SIST_11 en Supabase con productos corregidos
// Fecha: 2025-10-22
// Solo ajustamos productos que faltan/sobran, mantenemos nombres colombianos

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function actualizarSIST11() {
  console.log('🔄 ACTUALIZACIÓN DE PRODUCTOS EN SIST_11\n');
  console.log('='.repeat(80));

  try {
    // 1. Leer el contenido corregido del archivo local
    const contenidoCompleto = fs.readFileSync(
      './knowledge_base/arsenal_conversacional_complementario.txt',
      'utf-8'
    );

    console.log('\n📄 Archivo local leído correctamente');
    console.log(`   Tamaño total: ${contenidoCompleto.length} caracteres\n`);

    // 2. Ejecutar UPDATE
    console.log('📝 Actualizando Supabase...\n');

    const { data, error } = await supabase
      .from('nexus_documents')
      .update({
        content: contenidoCompleto,
        updated_at: new Date().toISOString()
      })
      .eq('category', 'arsenal_cierre')
      .select('id, title');

    if (error) {
      console.error('❌ Error actualizando:', error);
      return;
    }

    if (data && data.length > 0) {
      console.log('✅ Documento actualizado exitosamente:\n');
      console.log(`   ID: ${data[0].id}`);
      console.log(`   Título: ${data[0].title}`);
      console.log(`   Nuevo tamaño: ${contenidoCompleto.length} caracteres\n`);
    }

    // 3. Verificar el cambio
    console.log('🔍 Verificando actualización...\n');

    const { data: verificacion, error: errorVerif } = await supabase
      .from('nexus_documents')
      .select('content')
      .eq('category', 'arsenal_cierre')
      .single();

    if (errorVerif) {
      console.error('❌ Error verificando:', errorVerif);
      return;
    }

    // Extraer SIST_11
    const sist11Match = verificacion.content.match(/### SIST_11:.*?(?=###|---)/s);

    if (sist11Match) {
      const sist11Content = sist11Match[0];

      console.log('✅ SIST_11 verificado en Supabase:\n');

      // Verificar productos corregidos
      const verificaciones = [
        // ESP 1 - Nuevos productos
        { producto: 'Ganorico MochaRico', paquete: 'ESP1', debe: 'estar' },
        { producto: 'Gano C\'Real Spirulina', paquete: 'ESP1', debe: 'estar' },
        { producto: 'Ganorico Latte Rico', paquete: 'ESP1', debe: 'estar' },

        // ESP 1 - Productos removidos (ahora en ESP2/ESP3)
        { producto: 'Piel&Brillo Exfoliante', paquete: 'ESP1', debe: 'NO estar' },

        // ESP 2 - Productos agregados
        { producto: 'Piel&Brillo Shampoo', paquete: 'ESP2', debe: 'estar' },
        { producto: 'Piel&Brillo Acondicionador', paquete: 'ESP2', debe: 'estar' },
        { producto: 'Piel&Brillo Exfoliante', paquete: 'ESP2', debe: 'estar' },

        // ESP 3 - Productos agregados
        { producto: 'Ganorico Shoko Rico', paquete: 'ESP3', debe: 'estar' },
        { producto: 'Ganorico MochaRico', paquete: 'ESP3', debe: 'estar' }
      ];

      console.log('   Productos verificados:');
      verificaciones.forEach(v => {
        const encontrado = sist11Content.includes(v.producto);
        const correcto = v.debe === 'estar' ? encontrado : !encontrado;
        console.log(`   ${correcto ? '✅' : '❌'} ${v.paquete}: ${v.producto} (${v.debe})`);
      });

      // Verificar totales
      const esp1Match = sist11Content.match(/ESP 1.*?Total:\s*(\d+)\s*productos/s);
      const esp2Match = sist11Content.match(/ESP 2.*?Total:\s*(\d+)\s*productos/s);
      const esp3Match = sist11Content.match(/ESP 3.*?Total:\s*(\d+)\s*productos/s);

      console.log('\n   Totales por paquete:');
      console.log(`   ${esp1Match && esp1Match[1] === '7' ? '✅' : '❌'} ESP 1: ${esp1Match ? esp1Match[1] : '?'} productos (esperado: 7)`);
      console.log(`   ${esp2Match && esp2Match[1] === '18' ? '✅' : '❌'} ESP 2: ${esp2Match ? esp2Match[1] : '?'} productos (esperado: 18)`);
      console.log(`   ${esp3Match && esp3Match[1] === '35' ? '✅' : '❌'} ESP 3: ${esp3Match ? esp3Match[1] : '?'} productos (esperado: 35)`);

    } else {
      console.log('⚠️ SIST_11 no encontrado en verificación');
    }

    console.log('\n' + '='.repeat(80));
    console.log('\n✅ ACTUALIZACIÓN COMPLETADA\n');
    console.log('📋 CAMBIOS APLICADOS (manteniendo nombres colombianos):\n');
    console.log('ESP 1 (7 productos):');
    console.log('  ✅ Agregados:');
    console.log('     - Ganorico MochaRico');
    console.log('     - Gano C\'Real Spirulina');
    console.log('     - Ganorico Latte Rico');
    console.log('  ✅ Removidos:');
    console.log('     - Piel&Brillo Exfoliante Corporal (ahora en ESP2/ESP3)');
    console.log('     - Gano Fresh Toothpaste (ahora en ESP2/ESP3)');
    console.log('     - Gano Transparent Soap (ahora en ESP2/ESP3)');
    console.log('');
    console.log('ESP 2 (18 productos):');
    console.log('  ✅ Agregados:');
    console.log('     - Piel&Brillo Shampoo');
    console.log('     - Piel&Brillo Acondicionador');
    console.log('     - Piel&Brillo Exfoliante Corporal');
    console.log('  ✅ Removidos:');
    console.log('     - Ganoderma Cápsulas (ahora solo en ESP3)');
    console.log('     - Excellium Cápsulas (ahora solo en ESP3)');
    console.log('');
    console.log('ESP 3 (35 productos):');
    console.log('  ✅ Agregados:');
    console.log('     - Piel&Brillo Shampoo');
    console.log('     - Piel&Brillo Acondicionador');
    console.log('     - Piel&Brillo Exfoliante Corporal');
    console.log('     - Ganorico MochaRico');
    console.log('     - Ganorico Shoko Rico');
    console.log('');
    console.log('💡 PRÓXIMOS PASOS:\n');
    console.log('1. ⏳ Esperar 5 minutos (Anthropic limpia caché)');
    console.log('2. 🧪 Probar en producción:');
    console.log('   - "¿Qué productos trae ESP 1?"');
    console.log('   - "¿Cuántos productos incluye el paquete Empresarial?"');
    console.log('   - "Detalle de ESP 3"');
    console.log('3. ✅ Verificar respuesta correcta con productos actualizados');
    console.log('4. 📝 Commit cambios al repositorio\n');

  } catch (err) {
    console.error('❌ Error:', err);
  }
}

actualizarSIST11();
