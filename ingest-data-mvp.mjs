// ingest-data-mvp.mjs
// Script para cargar knowledge base de NEXUS en Supabase (MVP sin embeddings)

import { createClient } from '@supabase/supabase-js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración Supabase desde .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Service role para escribir

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Variables de Supabase no configuradas');
  console.log('Verifica que .env.local tenga:');
  console.log('NEXT_PUBLIC_SUPABASE_URL=tu_url');
  console.log('SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Documentos a procesar (MVP - 5 archivos esenciales)
const documentsToProcess = [
  {
    filename: 'nexus_system_prompt_mvp.txt',
    title: 'NEXUS System Prompt MVP',
    source: 'system_prompt'
  },
  {
    filename: 'arsenal_conversacional_mvp.txt',
    title: 'Arsenal Conversacional MVP',
    source: 'arsenal_conversacional'
  },
  {
    filename: 'catalogo_productos_gano_excel.txt',
    title: 'Catálogo Productos Gano Excel',
    source: 'catalogo_productos'
  },
  {
    filename: 'framework_iaa_metodologia.txt',
    title: 'Framework IAA - Metodología',
    source: 'framework_iaa'
  },
  {
    filename: 'informacion_escalacion_liliana.txt',
    title: 'Información Escalación Liliana Moreno',
    source: 'escalacion'
  }
];

async function chunkText(text, maxLength = 2000) {
  // Para MVP, chunks simples por párrafos
  const paragraphs = text.split('\n\n').filter(p => p.trim().length > 0);
  const chunks = [];
  let currentChunk = '';

  for (const paragraph of paragraphs) {
    if (currentChunk.length + paragraph.length > maxLength && currentChunk.length > 0) {
      chunks.push(currentChunk.trim());
      currentChunk = paragraph;
    } else {
      currentChunk += (currentChunk ? '\n\n' : '') + paragraph;
    }
  }

  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}

async function clearExistingDocuments() {
  console.log('🗑️  Limpiando documentos existentes...');

  const { error } = await supabase
    .from('nexus_documents')
    .delete()
    .neq('id', 0); // Eliminar todos

  if (error) {
    console.error('❌ Error limpiando documentos:', error);
    throw error;
  }

  console.log('✅ Documentos existentes eliminados');
}

async function ingestDocument(docConfig) {
  const knowledgeBasePath = path.join(__dirname, 'knowledge_base');
  const filePath = path.join(knowledgeBasePath, docConfig.filename);

  try {
    console.log(`📖 Procesando: ${docConfig.title}`);

    // Leer archivo
    const content = await fs.readFile(filePath, 'utf-8');

    // Dividir en chunks para mejor búsqueda
    const chunks = await chunkText(content);

    console.log(`   📄 Creando ${chunks.length} chunks...`);

    // Insertar cada chunk
    for (let i = 0; i < chunks.length; i++) {
      const chunkTitle = chunks.length > 1 ?
        `${docConfig.title} - Parte ${i + 1}` :
        docConfig.title;

      const { data, error } = await supabase
        .from('nexus_documents')
        .insert({
          title: chunkTitle,
          content: chunks[i],
          source: docConfig.source
        })
        .select('id')
        .single();

      if (error) {
        console.error(`❌ Error insertando chunk ${i + 1}:`, error);
        throw error;
      }

      console.log(`   ✅ Chunk ${i + 1} insertado (ID: ${data.id})`);
    }

  } catch (error) {
    if (error.code === 'ENOENT') {
      console.error(`❌ Error: No se encontró el archivo ${filePath}`);
      console.log(`   💡 Sugerencia: Crea el archivo en knowledge_base/${docConfig.filename}`);
      return false;
    }
    throw error;
  }

  return true;
}

async function testSearchFunction() {
  console.log('🔍 Probando función de búsqueda...');

  const { data, error } = await supabase.rpc('search_nexus_documents', {
    search_query: 'CreaTuActivo ecosistema',
    match_count: 3
  });

  if (error) {
    console.error('❌ Error en búsqueda:', error);
    return false;
  }

  console.log(`✅ Función de búsqueda funciona. Encontrados: ${data.length} documentos`);
  if (data.length > 0) {
    console.log(`   📄 Ejemplo: "${data[0].title}" (similitud: ${data[0].similarity})`);
  }

  return true;
}

async function main() {
  console.log('🚀 Iniciando ingesta de knowledge base NEXUS MVP...\n');

  // Verificar carpeta knowledge_base
  const knowledgeBasePath = path.join(__dirname, 'knowledge_base');

  try {
    await fs.access(knowledgeBasePath);
  } catch (error) {
    console.log('📁 Creando carpeta knowledge_base...');
    await fs.mkdir(knowledgeBasePath, { recursive: true });
    console.log('✅ Carpeta creada');
    console.log('\n💡 SIGUIENTE PASO: Copia los 5 archivos .txt en la carpeta knowledge_base/');
    console.log('   - nexus_system_prompt_mvp.txt');
    console.log('   - arsenal_conversacional_mvp.txt');
    console.log('   - catalogo_productos_gano_excel.txt');
    console.log('   - framework_iaa_metodologia.txt');
    console.log('   - informacion_escalacion_liliana.txt\n');
    return;
  }

  try {
    // Limpiar documentos existentes
    await clearExistingDocuments();

    // Procesar cada documento
    let successCount = 0;
    for (const docConfig of documentsToProcess) {
      const success = await ingestDocument(docConfig);
      if (success) successCount++;
    }

    console.log(`\n📊 Resumen: ${successCount}/${documentsToProcess.length} documentos procesados`);

    if (successCount > 0) {
      // Probar función de búsqueda
      await testSearchFunction();

      console.log('\n🎉 ¡Knowledge base cargada exitosamente!');
      console.log('   ✅ NEXUS está listo para responder preguntas');
      console.log('   🚀 Siguiente paso: Actualizar API route con conexión a Supabase');
    } else {
      console.log('\n⚠️  No se procesaron documentos. Verifica que los archivos .txt existan.');
    }

  } catch (error) {
    console.error('\n❌ Error durante la ingesta:', error);
    process.exit(1);
  }
}

// Ejecutar script
main();
