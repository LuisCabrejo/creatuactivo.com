import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

const envPath = '/Users/luiscabrejo/Cta/marketing/.env.local';
const envContent = readFileSync(envPath, 'utf8');
const supabaseUrl = envContent.match(/NEXT_PUBLIC_SUPABASE_URL=(.+)/)?.[1]?.trim();
const supabaseKey = envContent.match(/SUPABASE_SERVICE_ROLE_KEY=(.+)/)?.[1]?.trim();
const voyageApiKey = envContent.match(/VOYAGE_API_KEY=(.+)/)?.[1]?.trim();

const supabase = createClient(supabaseUrl, supabaseKey);

async function generateVoyageEmbedding(text) {
  const response = await fetch('https://api.voyageai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${voyageApiKey}`
    },
    body: JSON.stringify({
      model: 'voyage-3-lite',
      input: text,
      input_type: 'document'
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Voyage API error: ${response.status} - ${error.substring(0, 200)}`);
  }

  const data = await response.json();
  return data.data[0].embedding;
}

function formatForPgvector(embedding) {
  const padded = [...embedding, ...new Array(1536 - embedding.length).fill(0)];
  return '[' + padded.join(',') + ']';
}

async function main() {
  console.log('📄 Regenerando embedding para arsenal_inicial...\n');

  const { data: doc, error } = await supabase
    .from('nexus_documents')
    .select('id, category, title, content')
    .eq('category', 'arsenal_inicial')
    .single();

  if (error) {
    console.error('❌ Error:', error.message);
    return;
  }

  console.log(`   Documento: ${doc.category}`);
  console.log(`   Contenido: ${doc.content.length} chars`);

  const text = [doc.title || '', doc.category.replace(/_/g, ' '), doc.content || ''].join('\n\n').substring(0, 32000);
  console.log(`   Texto para embedding: ${text.length} chars`);

  try {
    const embedding = await generateVoyageEmbedding(text);
    console.log(`   ✅ Embedding: ${embedding.length} dimensiones`);

    const embeddingStr = formatForPgvector(embedding);

    const { error: updateError } = await supabase.rpc('update_document_embedding', {
      doc_id: doc.id,
      new_embedding: embeddingStr
    });

    if (updateError) {
      console.log(`   ❌ Error guardando: ${updateError.message}`);
    } else {
      console.log(`   ✅ Guardado en Supabase`);
    }
  } catch (e) {
    console.log(`   ❌ Error: ${e.message}`);
  }
}

main().catch(console.error);
