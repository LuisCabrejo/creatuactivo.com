import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const envPath = resolve(__dirname, '../.env.local');
const envContent = readFileSync(envPath, 'utf-8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    envVars[match[1].trim()] = match[2].trim().replace(/^["']|["']$/g, '');
  }
});

const supabase = createClient(
  envVars.NEXT_PUBLIC_SUPABASE_URL,
  envVars.SUPABASE_SERVICE_ROLE_KEY
);

async function updateSystemPrompt() {
  console.log('📖 Leyendo System Prompt actual...\n');

  const { data, error } = await supabase
    .from('system_prompts')
    .select('*')
    .eq('name', 'nexus_main')
    .single();

  if (error) {
    console.error('❌ Error al leer:', error);
    return;
  }

  console.log('✅ System Prompt encontrado, versión:', data.version);
  let content = data.prompt;

  // Remover la tabla anterior si existe
  const oldTableStart = '## 📋 LISTA RÁPIDA DE PRECIOS GANO EXCEL';
  const oldTableEnd = '**Rangos:**';

  if (content.includes(oldTableStart)) {
    const startIdx = content.indexOf(oldTableStart);
    const endIdx = content.indexOf(oldTableEnd, startIdx);
    if (endIdx !== -1) {
      // Encontrar el final de esa línea
      const lineEnd = content.indexOf('\n\n', endIdx);
      if (lineEnd !== -1) {
        content = content.slice(0, startIdx) + content.slice(lineEnd + 2);
        console.log('✅ Tabla anterior removida');
      }
    }
  }

  // Nueva tabla organizada por categorías
  const tablaPreciosCategorias = `## 📋 LISTA DE PRECIOS GANO EXCEL - POR CATEGORÍAS

**Cuando pregunten "lista de precios", muestra ESTA lista completa organizada:**

### ☕ BEBIDAS FUNCIONALES
| Producto | Precio |
|----------|--------|
| Ganocafé 3 en 1 | $110,900 |
| Ganocafé Clásico | $110,900 |
| Ganorico Latte Rico | $119,900 |
| Ganorico Mocha Rico | $119,900 |
| Ganorico Shoko Rico | $124,900 |
| Espirulina Gano C'Real | $119,900 |
| Oleaf Gano Rooibos | $119,900 |
| Gano Schokoladde | $124,900 |
| Colágeno Reskine | $216,900 |

### 💊 SUPLEMENTOS
| Producto | Precio |
|----------|--------|
| Gano C Ganocaps (90 cáps) | $272,500 |
| Tongkat Ali (60 cáps) | $272,500 |
| Mangostán (60 cáps) | $336,900 |

### ✨ CUIDADO PERSONAL (Piel&Brillo)
| Producto | Precio |
|----------|--------|
| Hidratante Facial | $73,900 |
| Hidratante Corporal | $73,900 |
| Limpiador Facial | $78,500 |
| Tónico Facial | $73,900 |
| Crema de Manos | $73,900 |
| Exfoliante Corporal | $73,900 |

### ☕ LÍNEA PREMIUM LUVOCO
| Producto | Precio |
|----------|--------|
| Máquina Café LUVOCO | $1,026,000 |
| Cápsulas Suave (15 u) | $110,900 |
| Cápsulas Medio (15 u) | $110,900 |
| Cápsulas Fuerte (15 u) | $110,900 |

**Total: 22 productos | Precios en COP | Precios de Constructor**

`;

  // Insertar después de la sección de catálogo
  const catalogoSection = '### 🛒 PARA CATÁLOGO DE PRODUCTOS:';
  const insertPoint = content.indexOf(catalogoSection);

  if (insertPoint !== -1) {
    const nextSection = content.indexOf('### ', insertPoint + catalogoSection.length);
    if (nextSection !== -1) {
      content = content.slice(0, nextSection) + tablaPreciosCategorias + '\n' + content.slice(nextSection);
      console.log('✅ Tabla por categorías insertada');
    }
  }

  // Actualizar versión
  content = content.replace(
    /# NEXUS - SYSTEM PROMPT v13\.[0-9]+\.[0-9]+.*/,
    '# NEXUS - SYSTEM PROMPT v13.9.4 PRECIOS POR CATEGORÍAS'
  );

  content = content.replace(
    /\*\*Versión:\*\* 13\.[0-9]+\.[0-9]+.*/,
    '**Versión:** 13.9.4 - Lista precios por categorías (22 productos)'
  );

  const { error: updateError } = await supabase
    .from('system_prompts')
    .update({
      prompt: content,
      version: 'v13.9.4_precios_por_categorias',
      updated_at: new Date().toISOString()
    })
    .eq('name', 'nexus_main');

  if (updateError) {
    console.error('Error updating:', updateError);
    return;
  }

  console.log('✅ System Prompt actualizado a v13.9.4');
  console.log('');
  console.log('Cambios aplicados:');
  console.log('1. ✅ Lista organizada en 4 categorías');
  console.log('2. ✅ 22 productos completos');
  console.log('3. ✅ Formato bonito con emojis por categoría');
}

updateSystemPrompt();
