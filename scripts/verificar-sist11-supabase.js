// Verificar contenido de SIST_11 en Supabase
// Compara con el contenido local en arsenal_conversacional_complementario.txt

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function verificarSIST11() {
  console.log('🔍 VERIFICACIÓN DE SIST_11 EN SUPABASE\n');
  console.log('='.repeat(80));

  try {
    // 1. Leer contenido del archivo local
    const localContent = fs.readFileSync(
      './knowledge_base/arsenal_conversacional_complementario.txt',
      'utf-8'
    );

    console.log('\n📄 Contenido LOCAL (arsenal_conversacional_complementario.txt):\n');

    // Extraer SIST_11 del archivo local
    const sist11Match = localContent.match(/### SIST_11:.*?(?=###|$)/s);

    if (sist11Match) {
      const sist11Local = sist11Match[0];
      console.log('✅ SIST_11 encontrado en archivo local');
      console.log(`   Longitud: ${sist11Local.length} caracteres\n`);

      // Mostrar primeras líneas
      console.log('   Primeras 10 líneas:');
      console.log('   ' + '-'.repeat(78));
      const lines = sist11Local.split('\n').slice(0, 10);
      lines.forEach(line => console.log('   ' + line));
      console.log('   ...\n');

      // Extraer productos por paquete
      const esp1Match = sist11Local.match(/ESP 1.*?Total:\s*(\d+)\s*productos/s);
      const esp2Match = sist11Local.match(/ESP 2.*?Total:\s*(\d+)\s*productos/s);
      const esp3Match = sist11Local.match(/ESP 3.*?Total:\s*(\d+)\s*productos/s);

      console.log('   📦 Resumen de paquetes en LOCAL:');
      if (esp1Match) console.log(`   - ESP 1: ${esp1Match[1]} productos`);
      if (esp2Match) console.log(`   - ESP 2: ${esp2Match[1]} productos`);
      if (esp3Match) console.log(`   - ESP 3: ${esp3Match[1]} productos`);

    } else {
      console.log('❌ SIST_11 NO encontrado en archivo local');
    }

    // 2. Obtener contenido de Supabase
    console.log('\n\n📊 Contenido en SUPABASE (arsenal_cierre):\n');

    const { data: documento, error } = await supabase
      .from('nexus_documents')
      .select('id, title, content, category')
      .eq('category', 'arsenal_cierre')
      .single();

    if (error) {
      console.error('❌ Error obteniendo documento:', error);
      return;
    }

    console.log('✅ Documento arsenal_cierre encontrado');
    console.log(`   ID: ${documento.id}`);
    console.log(`   Título: ${documento.title}`);
    console.log(`   Longitud total: ${documento.content.length} caracteres\n`);

    // Verificar si tiene SIST_11
    const tieneSIST11 = documento.content.includes('SIST_11');
    console.log(`   ${tieneSIST11 ? '✅' : '❌'} Contiene "SIST_11"`);

    if (tieneSIST11) {
      // Extraer SIST_11 de Supabase
      const sist11SupaMatch = documento.content.match(/### SIST_11:.*?(?=###|---)/s);

      if (sist11SupaMatch) {
        const sist11Supabase = sist11SupaMatch[0];
        console.log(`   Longitud SIST_11: ${sist11Supabase.length} caracteres\n`);

        // Mostrar primeras líneas
        console.log('   Primeras 10 líneas:');
        console.log('   ' + '-'.repeat(78));
        const lines = sist11Supabase.split('\n').slice(0, 10);
        lines.forEach(line => console.log('   ' + line));
        console.log('   ...\n');

        // Extraer productos por paquete
        const esp1Match = sist11Supabase.match(/ESP 1.*?Total:\s*(\d+)\s*productos/s);
        const esp2Match = sist11Supabase.match(/ESP 2.*?Total:\s*(\d+)\s*productos/s);
        const esp3Match = sist11Supabase.match(/ESP 3.*?Total:\s*(\d+)\s*productos/s);

        console.log('   📦 Resumen de paquetes en SUPABASE:');
        if (esp1Match) console.log(`   - ESP 1: ${esp1Match[1]} productos`);
        if (esp2Match) console.log(`   - ESP 2: ${esp2Match[1]} productos`);
        if (esp3Match) console.log(`   - ESP 3: ${esp3Match[1]} productos`);

        // 3. Comparación
        console.log('\n\n🔄 COMPARACIÓN LOCAL vs SUPABASE:\n');
        console.log('='.repeat(80));

        if (sist11Match && sist11SupaMatch) {
          const localLength = sist11Match[0].length;
          const supaLength = sist11Supabase.length;
          const diff = Math.abs(localLength - supaLength);
          const diffPercent = ((diff / localLength) * 100).toFixed(1);

          console.log(`\nDiferencia de longitud: ${diff} caracteres (${diffPercent}%)`);

          if (diff === 0) {
            console.log('\n✅ CONTENIDO IDÉNTICO\n');
          } else if (diff < 100) {
            console.log('\n⚠️ DIFERENCIA MENOR - Posiblemente solo formato\n');
          } else {
            console.log('\n❌ DIFERENCIA SIGNIFICATIVA - Contenido diferente\n');
          }

          // Detectar productos específicos
          const productosEsp1Local = (sist11Match[0].match(/Ganocafé|Piel&Brillo|Gano Fresh|Gano Transparent/gi) || []).length;
          const productosEsp1Supa = (sist11Supabase.match(/Ganocafé|Piel&Brillo|Gano Fresh|Gano Transparent/gi) || []).length;

          console.log('Menciones de productos ESP 1:');
          console.log(`   Local: ${productosEsp1Local} menciones`);
          console.log(`   Supabase: ${productosEsp1Supa} menciones`);

        }

      } else {
        console.log('   ⚠️ Patrón SIST_11 no matcheó en Supabase');
      }
    }

    // 4. Listar todos los productos mencionados
    console.log('\n\n📋 PRODUCTOS MENCIONADOS EN SUPABASE:\n');
    const productos = [
      'Ganocafé 3 en 1',
      'Ganocafé Classic',
      'Piel&Brillo',
      'Gano Fresh',
      'Gano Transparent',
      'Gano Soap',
      'MochaRico',
      'Spirulina',
      'Latte Rico',
      'Shoko Rico',
      'Reskine',
      'Ganoderma Cápsulas',
      'Excellium',
      'Schokolade',
      'Rooibos'
    ];

    productos.forEach(producto => {
      const encontrado = documento.content.includes(producto);
      console.log(`   ${encontrado ? '✅' : '❌'} ${producto}`);
    });

    console.log('\n\n💡 RECOMENDACIÓN:\n');
    console.log('='.repeat(80));

    if (tieneSIST11) {
      console.log('\n✅ SIST_11 está presente en Supabase');
      console.log('\nPero si encontraste un ERROR en la descripción:');
      console.log('1. Corrige el archivo local: arsenal_conversacional_complementario.txt');
      console.log('2. Ejecuta el UPDATE desde EJECUTAR_3_arsenal_cierre.sql');
      console.log('3. O usa el contenido corregido en un nuevo script de actualización');
    } else {
      console.log('\n❌ SIST_11 NO está en Supabase');
      console.log('\nEjecuta: knowledge_base/EJECUTAR_3_arsenal_cierre.sql');
    }

    console.log('\n');

  } catch (err) {
    console.error('❌ Error:', err);
  }
}

verificarSIST11();
