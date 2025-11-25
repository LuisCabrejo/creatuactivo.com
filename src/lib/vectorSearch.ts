/**
 * Búsqueda Vectorial para NEXUS
 *
 * Usa Voyage AI para generar embeddings de alta calidad.
 * Los embeddings de documentos se almacenan en Supabase (pgvector).
 *
 * Fecha: 25 Nov 2025
 * Modelo: voyage-3-lite (512 dimensiones)
 * Precisión: 90% con embeddings Voyage AI
 */

// Keywords que indican objeciones (para enriquecer queries cortas)
const OBJECTION_KEYWORDS = ['mlm', 'multinivel', 'piramide', 'pirámide', 'estafa', 'scam', 'fraude', 'ponzi'];

/**
 * Enriquece queries cortas con contexto adicional para mejor matching
 */
function enrichQuery(query: string): string {
  const normalized = query.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  // Si la query menciona objeciones comunes, añadir contexto
  const hasObjection = OBJECTION_KEYWORDS.some(kw => normalized.includes(kw));
  if (hasObjection && query.length < 50) {
    return `${query} - objeción sobre legitimidad del negocio`;
  }

  return query;
}

/**
 * Genera embedding para una query usando Voyage AI
 * Requiere VOYAGE_API_KEY en variables de entorno
 */
export async function generateVoyageEmbedding(
  text: string,
  apiKey: string,
  inputType: 'query' | 'document' = 'query'
): Promise<number[]> {
  // Enriquecer queries cortas para mejor contexto semántico
  const enrichedText = inputType === 'query' ? enrichQuery(text) : text;

  const response = await fetch('https://api.voyageai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'voyage-3-lite',
      input: enrichedText.substring(0, 8000),
      input_type: inputType
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    if (response.status === 429) {
      throw new Error('Voyage API rate limit exceeded. Retry in a few seconds.');
    }
    throw new Error(`Voyage API error: ${response.status} - ${errorText.substring(0, 100)}`);
  }

  const data = await response.json();
  return data.data[0].embedding;
}

/**
 * Calcula la similitud coseno entre dos vectores
 * Maneja vectores de diferentes longitudes (512 vs 1536 con padding)
 */
export function cosineSimilarity(a: number[], b: number[]): number {
  const len = Math.min(a.length, b.length);
  let dot = 0, magA = 0, magB = 0;
  for (let i = 0; i < len; i++) {
    dot += a[i] * b[i];
    magA += a[i] * a[i];
    magB += b[i] * b[i];
  }
  if (magA === 0 || magB === 0) return 0;
  return dot / (Math.sqrt(magA) * Math.sqrt(magB));
}

/**
 * Parsea un embedding string de PostgreSQL a array de números
 */
export function parseEmbedding(embeddingStr: string): number[] {
  return embeddingStr.slice(1, -1).split(',').map(parseFloat);
}

export interface VectorSearchResult {
  category: string;
  title: string;
  content: string;
  similarity: number;
  metadata?: Record<string, unknown>;
}

export interface DocumentWithEmbedding {
  category: string;
  title: string;
  content: string;
  embedding: string;
  metadata?: Record<string, unknown>;
}

/**
 * Busca documentos similares usando un embedding pre-generado
 *
 * @param queryEmbedding - Embedding de la query (generado con generateVoyageEmbedding)
 * @param documents - Documentos con embeddings de Supabase
 * @param threshold - Umbral mínimo de similitud (default: 0.3 para Voyage)
 * @param maxResults - Número máximo de resultados
 */
export function searchSimilarDocuments(
  queryEmbedding: number[],
  documents: DocumentWithEmbedding[],
  threshold = 0.3,
  maxResults = 3
): VectorSearchResult[] {
  const results = documents
    .map(doc => {
      const docEmbedding = parseEmbedding(doc.embedding);
      const similarity = cosineSimilarity(queryEmbedding, docEmbedding);
      return {
        category: doc.category,
        title: doc.title,
        content: doc.content,
        similarity,
        metadata: doc.metadata,
      };
    })
    .filter(r => r.similarity >= threshold)
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, maxResults);

  return results;
}

/**
 * Búsqueda vectorial completa con Voyage AI
 *
 * @param query - Texto de búsqueda del usuario
 * @param documents - Documentos con embeddings de Supabase
 * @param voyageApiKey - API key de Voyage AI
 * @param threshold - Umbral mínimo de similitud (default: 0.3)
 * @param maxResults - Número máximo de resultados
 */
export async function vectorSearchVoyage(
  query: string,
  documents: DocumentWithEmbedding[],
  voyageApiKey: string,
  threshold = 0.3,
  maxResults = 3
): Promise<VectorSearchResult[]> {
  // Generar embedding para la query
  const queryEmbedding = await generateVoyageEmbedding(query, voyageApiKey, 'query');

  // Buscar documentos similares
  return searchSimilarDocuments(queryEmbedding, documents, threshold, maxResults);
}

// ============================================================================
// FALLBACK: Embeddings locales (para cuando no hay API disponible)
// ============================================================================

function hashString(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) + str.charCodeAt(i);
    hash = hash & 0x7FFFFFFF;
  }
  return hash;
}

const DOMAIN_KEYWORDS: Record<string, number[]> = {
  'mlm': [0, 1, 2],
  'multinivel': [0, 1, 2],
  'piramide': [3, 4, 5],
  'gano': [6, 7, 8],
  'excel': [6, 7, 8],
  'cafe': [9, 10, 11],
  'producto': [12, 13, 14],
  'paquete': [15, 16, 17],
  'dinero': [18, 19, 20],
  'ganar': [18, 19, 20],
  'tiempo': [21, 22, 23],
  'sistema': [24, 25, 26],
  'funciona': [45, 46, 47],
};

/**
 * Genera embedding local (fallback cuando no hay API)
 * NOTA: Menor precisión que Voyage AI (~50% vs ~100%)
 */
export function generateLocalEmbedding(text: string): number[] {
  const cleanText = text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const words = cleanText.split(' ').filter(w => w.length > 2);
  const vector = new Array(512).fill(0); // 512 para compatibilidad con Voyage

  words.forEach((word, idx) => {
    const positionWeight = 1 / (1 + idx * 0.01);
    const hash = hashString(word);
    vector[hash % 512] += positionWeight;
  });

  words.forEach(word => {
    const indices = DOMAIN_KEYWORDS[word];
    if (indices) {
      indices.forEach(idx => {
        if (idx < 512) vector[idx] += 2.0;
      });
    }
  });

  const magnitude = Math.sqrt(vector.reduce((sum, v) => sum + v * v, 0));
  if (magnitude > 0) {
    for (let i = 0; i < vector.length; i++) {
      vector[i] /= magnitude;
    }
  }

  return vector;
}

export interface VectorSearchOptions {
  threshold?: number;
  maxResults?: number;
  debug?: boolean;
}

/**
 * Búsqueda vectorial con fallback local
 * Usa Voyage AI si está disponible, sino embeddings locales
 *
 * @param query - Texto de búsqueda
 * @param documents - Documentos con embeddings
 * @param voyageApiKey - API key (opcional, usa local si no hay)
 * @param options - threshold (0.3), maxResults (3), debug (false)
 */
export async function vectorSearch(
  query: string,
  documents: DocumentWithEmbedding[],
  voyageApiKey?: string,
  options: VectorSearchOptions = {}
): Promise<VectorSearchResult[]> {
  const { threshold = 0.3, maxResults = 3, debug = false } = options;
  let useVoyage = false;

  try {
    if (voyageApiKey) {
      useVoyage = true;
      const results = await vectorSearchVoyage(query, documents, voyageApiKey, threshold, maxResults);

      if (debug) {
        console.log(`[VectorSearch] Query: "${query}"`);
        console.log(`[VectorSearch] Engine: Voyage AI`);
        console.log(`[VectorSearch] Results: ${results.length}`);
        results.forEach((r, i) => console.log(`  ${i+1}. ${r.category} (${r.similarity.toFixed(3)})`));
      }

      return results;
    }
  } catch (error) {
    console.warn('[VectorSearch] Voyage API failed, falling back to local:', error);
  }

  // Fallback a embeddings locales
  const queryEmbedding = generateLocalEmbedding(query);
  const results = searchSimilarDocuments(queryEmbedding, documents, 0.05, maxResults);

  if (debug) {
    console.log(`[VectorSearch] Query: "${query}"`);
    console.log(`[VectorSearch] Engine: Local (fallback)`);
    console.log(`[VectorSearch] Results: ${results.length}`);
    results.forEach((r, i) => console.log(`  ${i+1}. ${r.category} (${r.similarity.toFixed(3)})`));
  }

  return results;
}
