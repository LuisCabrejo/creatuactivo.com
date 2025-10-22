// Diagnóstico completo de Knowledge Base en Supabase
// Fecha: 2025-10-21
// Propósito: Verificar qué contenido está realmente disponible vs lo que debería estar

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function diagnosticarKnowledgeBase() {
  console.log('🔍 DIAGNÓSTICO COMPLETO DE KNOWLEDGE BASE\n');
  console.log('='.repeat(80));

  try {
    // 1. Obtener todos los documentos
    const { data: documentos, error } = await supabase
      .from('nexus_documents')
      .select('id, title, category, metadata, content')
      .order('id', { ascending: true });

    if (error) {
      console.error('❌ Error fetching documents:', error);
      return;
    }

    console.log(`\n📊 TOTAL DE DOCUMENTOS EN SUPABASE: ${documentos.length}\n`);

    // 2. Agrupar por categoría
    const porCategoria = {};
    documentos.forEach(doc => {
      const cat = doc.category || 'sin_categoria';
      if (!porCategoria[cat]) {
        porCategoria[cat] = [];
      }
      porCategoria[cat].push(doc);
    });

    // 3. Resumen por categoría
    console.log('📁 DOCUMENTOS POR CATEGORÍA:\n');
    Object.keys(porCategoria).sort().forEach(categoria => {
      const docs = porCategoria[categoria];
      console.log(`\n🔹 ${categoria.toUpperCase()}`);
      console.log(`   Total: ${docs.length} documentos`);

      docs.forEach(doc => {
        const metadata = doc.metadata || {};
        const length = doc.content?.length || 0;
        console.log(`   - ID ${doc.id}: ${doc.title}`);
        console.log(`     Longitud: ${length.toLocaleString()} caracteres`);
        if (metadata.respuestas_totales) {
          console.log(`     Respuestas: ${metadata.respuestas_totales}`);
        }
      });
    });

    // 4. Buscar información específica sobre paquetes
    console.log('\n\n🔎 BÚSQUEDA ESPECÍFICA: "productos por paquete"\n');
    console.log('='.repeat(80));

    const keywords = [
      'Paquete Constructor Inicial',
      'ESP 1',
      'ESP 2',
      'ESP 3',
      'productos Gano Excel trae',
      '7 productos',
      '18 productos',
      '35 productos',
      'Ganocafé 3 en 1',
      'inventario específico'
    ];

    const resultados = {};

    for (const keyword of keywords) {
      console.log(`\nBuscando: "${keyword}"`);
      const encontrados = documentos.filter(doc =>
        doc.content?.toLowerCase().includes(keyword.toLowerCase())
      );

      if (encontrados.length > 0) {
        console.log(`✅ ENCONTRADO en ${encontrados.length} documento(s):`);
        encontrados.forEach(doc => {
          console.log(`   - ${doc.category} (ID ${doc.id}): ${doc.title}`);
          if (!resultados[doc.id]) {
            resultados[doc.id] = {
              ...doc,
              keywords_encontrados: []
            };
          }
          resultados[doc.id].keywords_encontrados.push(keyword);
        });
      } else {
        console.log(`❌ NO ENCONTRADO`);
      }
    }

    // 5. Análisis de documento arsenal_cierre (ID 17)
    console.log('\n\n📄 ANÁLISIS ESPECÍFICO: arsenal_cierre (ID 17)\n');
    console.log('='.repeat(80));

    const arsenalCierre = documentos.find(doc => doc.id === 17);

    if (arsenalCierre) {
      console.log('✅ Documento encontrado:');
      console.log(`   Título: ${arsenalCierre.title}`);
      console.log(`   Categoría: ${arsenalCierre.category}`);
      console.log(`   Longitud: ${arsenalCierre.content?.length.toLocaleString()} caracteres`);
      console.log(`   Metadata:`, arsenalCierre.metadata);

      // Verificar si tiene la info de paquetes
      const tieneSIST11 = arsenalCierre.content?.includes('SIST_11');
      const tieneInventario = arsenalCierre.content?.includes('Paquete Constructor Inicial');
      const tiene7Productos = arsenalCierre.content?.includes('7 productos');

      console.log('\n   Verificación de contenido SIST_11:');
      console.log(`   - Tiene SIST_11: ${tieneSIST11 ? '✅' : '❌'}`);
      console.log(`   - Tiene "Paquete Constructor Inicial": ${tieneInventario ? '✅' : '❌'}`);
      console.log(`   - Tiene "7 productos": ${tiene7Productos ? '✅' : '❌'}`);

      if (tieneSIST11) {
        // Extraer la sección SIST_11
        const match = arsenalCierre.content.match(/### SIST_11:.*?(?=###|$)/s);
        if (match) {
          console.log('\n   📋 Contenido SIST_11 (primeros 500 chars):');
          console.log('   ' + '-'.repeat(78));
          console.log('   ' + match[0].substring(0, 500).split('\n').join('\n   '));
          console.log('   ...');
        }
      }
    } else {
      console.log('❌ Documento arsenal_cierre (ID 17) NO ENCONTRADO');
    }

    // 6. Verificar si hay documentos sin content
    console.log('\n\n⚠️ DOCUMENTOS SIN CONTENIDO O VACÍOS:\n');
    const sinContenido = documentos.filter(doc =>
      !doc.content || doc.content.trim().length < 100
    );

    if (sinContenido.length > 0) {
      console.log(`❌ Encontrados ${sinContenido.length} documentos problemáticos:`);
      sinContenido.forEach(doc => {
        console.log(`   - ID ${doc.id} (${doc.category}): ${doc.title}`);
        console.log(`     Longitud: ${doc.content?.length || 0} caracteres`);
      });
    } else {
      console.log('✅ Todos los documentos tienen contenido válido');
    }

    // 7. Recomendaciones
    console.log('\n\n💡 RECOMENDACIONES:\n');
    console.log('='.repeat(80));

    const hayProblemas = Object.keys(resultados).length === 0 || sinContenido.length > 0;

    if (hayProblemas) {
      console.log('\n⚠️ PROBLEMAS DETECTADOS:');

      if (Object.keys(resultados).length === 0) {
        console.log('\n1. ❌ CRÍTICO: La información sobre paquetes NO está en Supabase');
        console.log('   Solución: Ejecutar el UPDATE del archivo');
        console.log('   arsenal_conversacional_complementario.txt');
        console.log('   que contiene SIST_11 con la info de productos por paquete');
      }

      if (sinContenido.length > 0) {
        console.log('\n2. ❌ DOCUMENTOS VACÍOS: Algunos documentos no tienen contenido');
        console.log('   Solución: Revisar y actualizar estos documentos');
      }
    } else {
      console.log('\n✅ Knowledge Base parece estar completa');
      console.log('   - Todos los documentos tienen contenido');
      console.log('   - Información de paquetes disponible');
    }

    // 8. Sugerencias para mejorar coverage
    console.log('\n\n📋 PLAN DE MEJORA PARA GARANTIZAR COVERAGE COMPLETO:\n');
    console.log('='.repeat(80));
    console.log('\n1️⃣ MIGRACIÓN COMPLETA DE KNOWLEDGE BASE LOCAL → SUPABASE');
    console.log('   - Auditar todos los archivos .txt en /knowledge_base/');
    console.log('   - Verificar qué contenido falta en Supabase');
    console.log('   - Crear script automatizado de sincronización');
    console.log('');
    console.log('2️⃣ VALIDACIÓN DE CONTENIDO CRÍTICO');
    console.log('   - Lista de "preguntas frecuentes obligatorias"');
    console.log('   - Script de testing: "¿NEXUS puede responder X pregunta?"');
    console.log('   - Cobertura mínima: 95% de preguntas críticas');
    console.log('');
    console.log('3️⃣ MEJORA EN CLASIFICACIÓN HÍBRIDA');
    console.log('   - Agregar patrones específicos para "productos por paquete"');
    console.log('   - Mejorar semantic search con embeddings');
    console.log('   - Fallback inteligente si no encuentra respuesta exacta');
    console.log('');
    console.log('4️⃣ SISTEMA DE VERSIONADO Y ACTUALIZACIÓN');
    console.log('   - Versionado de documentos en Supabase');
    console.log('   - CI/CD para updates automáticos desde /knowledge_base/');
    console.log('   - Alertas si contenido local != Supabase');
    console.log('');
    console.log('5️⃣ MONITOREO DE GAPS (BRECHAS)');
    console.log('   - Logging de preguntas que NEXUS no pudo responder');
    console.log('   - Dashboard de "preguntas sin respuesta"');
    console.log('   - Retroalimentación para mejorar knowledge base');

    console.log('\n\n✅ Diagnóstico completado\n');

  } catch (err) {
    console.error('❌ Error en diagnóstico:', err);
  }
}

diagnosticarKnowledgeBase();
