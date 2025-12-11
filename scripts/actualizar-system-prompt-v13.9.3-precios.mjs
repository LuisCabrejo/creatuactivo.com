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

  // Tabla de precios para agregar al System Prompt
  const tablaPreciosProductos = `
## 📋 LISTA RÁPIDA DE PRECIOS GANO EXCEL (22 productos)

**Cuando pregunten "lista de precios" o "todos los precios", usa esta tabla:**

| Producto | Precio COP |
|----------|------------|
| Ganocafé 3 en 1 | $110,900 |
| Ganocafé Clásico | $110,900 |
| Ganorico Latte Rico | $119,900 |
| Ganorico Mocha Rico | $119,900 |
| Ganorico Shoko Rico | $124,900 |
| Espirulina Gano C'Real | $119,900 |
| Oleaf Gano Rooibos | $119,900 |
| Gano Schokoladde | $124,900 |
| Colágeno Reskine | $216,900 |
| Máquina LUVOCO | $1,026,000 |
| LUVOCO Cápsulas (c/u) | $110,900 |
| Gano C Ganocaps | $272,500 |
| Tongkat Ali | $272,500 |
| Mangostán | $336,900 |
| Piel&Brillo Hidratante Facial | $73,900 |
| Piel&Brillo Hidratante Corporal | $73,900 |
| Piel&Brillo Limpiador Facial | $78,500 |
| Piel&Brillo Tónico Facial | $73,900 |
| Piel&Brillo Crema Manos | $73,900 |
| Piel&Brillo Exfoliante | $73,900 |

**Rangos:** Cuidado Personal $73,900-$78,500 | Bebidas $110,900-$216,900 | Suplementos $272,500-$336,900

`;

  // Buscar un buen lugar para insertar - después de la sección de catálogo
  const catalogoSection = '### 🛒 PARA CATÁLOGO DE PRODUCTOS:';
  const insertPoint = content.indexOf(catalogoSection);

  if (insertPoint !== -1) {
    // Encontrar el final de esa sección (siguiente ###)
    const nextSection = content.indexOf('### ', insertPoint + catalogoSection.length);
    if (nextSection !== -1) {
      // Insertar la tabla de precios antes de la siguiente sección
      content = content.slice(0, nextSection) + tablaPreciosProductos + '\n' + content.slice(nextSection);
      console.log('✅ Tabla de precios insertada después de sección CATÁLOGO');
    }
  } else {
    // Si no encuentra, agregar al final antes de la última sección
    const lastSection = content.lastIndexOf('---');
    if (lastSection !== -1) {
      content = content.slice(0, lastSection) + tablaPreciosProductos + '\n' + content.slice(lastSection);
      console.log('✅ Tabla de precios insertada al final');
    }
  }

  // Actualizar versión
  content = content.replace(
    /# NEXUS - SYSTEM PROMPT v13\.[0-9]+\.[0-9]+.*/,
    '# NEXUS - SYSTEM PROMPT v13.9.3 TABLA PRECIOS INTEGRADA'
  );

  content = content.replace(
    /\*\*Versión:\*\* 13\.[0-9]+\.[0-9]+.*/,
    '**Versión:** 13.9.3 - Tabla de precios productos integrada'
  );

  const { error: updateError } = await supabase
    .from('system_prompts')
    .update({
      prompt: content,
      version: 'v13.9.3_tabla_precios_integrada',
      updated_at: new Date().toISOString()
    })
    .eq('name', 'nexus_main');

  if (updateError) {
    console.error('Error updating:', updateError);
    return;
  }

  console.log('✅ System Prompt actualizado a v13.9.3');
  console.log('');
  console.log('Cambios aplicados:');
  console.log('1. ✅ Tabla de 22 productos con precios');
  console.log('2. ✅ Se cachea con Anthropic (menor costo)');
  console.log('3. ✅ Disponible para los 3 sitios (creatuactivo.com, app.creatuactivo.com, luiscabrejo.com)');
}

updateSystemPrompt();
