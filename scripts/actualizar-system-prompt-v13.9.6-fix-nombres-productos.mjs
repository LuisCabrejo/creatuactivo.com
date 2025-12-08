#!/usr/bin/env node
/**
 * actualizar-system-prompt-v13.9.6-fix-nombres-productos.mjs
 *
 * FIX: Corrige nombres de productos incorrectos en System Prompt
 *
 * PROBLEMA: El System Prompt tiene nombres inventados que no existen en el catálogo oficial:
 *   ❌ Gano C Ganocaps → ✅ Cápsulas Ganoderma
 *   ❌ Tongkat Ali → ✅ Cápsulas Excellium
 *   ❌ Mangostán → ✅ Cápsulas Cordygold
 *   ❌ Hidratante Facial → ✅ Pasta Dientes Gano Fresh
 *   ❌ Hidratante Corporal → ✅ Jabón Gano
 *   ❌ Limpiador Facial → ✅ Jabón Transparente Gano
 *   ❌ Tónico Facial → ✅ Champú Piel&Brillo
 *   ❌ Crema de Manos → ✅ Acondicionador Piel&Brillo
 *
 * FUENTE DE VERDAD: knowledge_base/catalogo_productos.txt
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Tabla de precios CORRECTA según catalogo_productos.txt
const TABLA_PRECIOS_CORRECTA = `## 📋 LISTA DE PRECIOS GANO EXCEL - POR CATEGORÍAS

**Cuando pregunten "lista de precios", muestra ESTA lista completa organizada:**

### ☕ BEBIDAS FUNCIONALES (9 productos)
| Producto | Precio |
|----------|--------|
| Ganocafé 3 en 1 (20 sobres) | $110,900 |
| Ganocafé Clásico (30 sobres) | $110,900 |
| Ganorico Latte Rico (20 sobres) | $119,900 |
| Ganorico Mocha Rico (20 sobres) | $119,900 |
| Ganorico Shoko Rico (20 sobres) | $124,900 |
| Espirulina Gano C'Real (15 sobres) | $119,900 |
| Bebida Oleaf Gano Rooibos (20 sobres) | $119,900 |
| Gano Schokoladde (20 sobres) | $124,900 |
| Bebida Colágeno Reskine (10 sachets) | $216,900 |

### 💊 SUPLEMENTOS (3 productos)
| Producto | Precio |
|----------|--------|
| Cápsulas Ganoderma (90 caps) | $272,500 |
| Cápsulas Excellium (90 caps) | $272,500 |
| Cápsulas Cordygold (90 caps) | $336,900 |

### ✨ CUIDADO PERSONAL - Piel&Brillo (6 productos)
| Producto | Precio |
|----------|--------|
| Pasta Dientes Gano Fresh (150g) | $73,900 |
| Jabón Gano (2 barras 100g) | $73,900 |
| Jabón Transparente Gano (100g) | $78,500 |
| Champú Piel&Brillo (250ml) | $73,900 |
| Acondicionador Piel&Brillo (250ml) | $73,900 |
| Exfoliante Corporal Piel&Brillo (200g) | $73,900 |

### ☕ LÍNEA PREMIUM LUVOCO (4 productos)
| Producto | Precio |
|----------|--------|
| Máquina Café LUVOCO | $1,026,000 |
| LUVOCO Cápsulas Suave x15 | $110,900 |
| LUVOCO Cápsulas Medio x15 | $110,900 |
| LUVOCO Cápsulas Fuerte x15 | $110,900 |

**Total: 22 productos | Precios en COP | Precios de Constructor**`;

// Regex para encontrar la tabla de precios incorrecta en el System Prompt
const REGEX_TABLA_INCORRECTA = /## 📋 LISTA DE PRECIOS GANO EXCEL - POR CATEGORÍAS[\s\S]*?\*\*Total: 22 productos \| Precios en COP \| Precios de Constructor\*\*/;

async function actualizarSystemPrompt() {
  console.log('🔧 Actualizando System Prompt v13.9.6 - FIX nombres de productos...\n');

  // 1. Leer System Prompt actual
  const { data: promptData, error: readError } = await supabase
    .from('system_prompts')
    .select('*')
    .eq('name', 'nexus_main')
    .single();

  if (readError) {
    console.error('❌ Error leyendo System Prompt:', readError);
    process.exit(1);
  }

  const promptActual = promptData.prompt;
  const versionActual = promptData.version;

  console.log('📋 Versión actual:', versionActual);
  console.log('📏 Longitud actual:', promptActual.length, 'caracteres\n');

  // 2. Verificar que existe la tabla incorrecta
  const matchTablaIncorrecta = promptActual.match(REGEX_TABLA_INCORRECTA);

  if (!matchTablaIncorrecta) {
    console.error('❌ No se encontró la tabla de precios en el System Prompt');
    console.log('Buscando patrón alternativo...');

    // Buscar si al menos existe la sección
    if (promptActual.includes('Gano C Ganocaps') || promptActual.includes('Tongkat Ali')) {
      console.log('✅ Se encontraron nombres incorrectos. Procediendo con reemplazo...');
    } else {
      console.log('⚠️ No se encontraron nombres incorrectos. El prompt podría ya estar correcto.');
      process.exit(0);
    }
  }

  // 3. Mostrar lo que vamos a reemplazar
  console.log('🔍 Tabla INCORRECTA encontrada (fragmento):');
  if (matchTablaIncorrecta) {
    console.log(matchTablaIncorrecta[0].substring(0, 500) + '...\n');
  }

  // 4. Reemplazar la tabla incorrecta con la correcta
  let promptNuevo = promptActual.replace(REGEX_TABLA_INCORRECTA, TABLA_PRECIOS_CORRECTA);

  // Si el regex principal no funcionó, hacer reemplazos individuales
  if (promptNuevo === promptActual) {
    console.log('⚠️ Regex principal no hizo cambios. Aplicando reemplazos individuales...');

    // Reemplazos de Suplementos
    promptNuevo = promptNuevo
      .replace(/Gano C Ganocaps \(90 cáps\)/g, 'Cápsulas Ganoderma (90 caps)')
      .replace(/Tongkat Ali \(60 cáps\)/g, 'Cápsulas Excellium (90 caps)')
      .replace(/Mangostán \(60 cáps\)/g, 'Cápsulas Cordygold (90 caps)');

    // Reemplazos de Cuidado Personal
    promptNuevo = promptNuevo
      .replace(/Hidratante Facial/g, 'Pasta Dientes Gano Fresh (150g)')
      .replace(/Hidratante Corporal/g, 'Jabón Gano (2 barras 100g)')
      .replace(/Limpiador Facial/g, 'Jabón Transparente Gano (100g)')
      .replace(/Tónico Facial/g, 'Champú Piel&Brillo (250ml)')
      .replace(/Crema de Manos/g, 'Acondicionador Piel&Brillo (250ml)');

    // Reemplazos de Bebidas (añadir presentaciones)
    promptNuevo = promptNuevo
      .replace(/Ganocafé 3 en 1 \|/g, 'Ganocafé 3 en 1 (20 sobres) |')
      .replace(/Ganocafé Clásico \|/g, 'Ganocafé Clásico (30 sobres) |')
      .replace(/Ganorico Latte Rico \|/g, 'Ganorico Latte Rico (20 sobres) |')
      .replace(/Ganorico Mocha Rico \|/g, 'Ganorico Mocha Rico (20 sobres) |')
      .replace(/Ganorico Shoko Rico \|/g, 'Ganorico Shoko Rico (20 sobres) |')
      .replace(/Espirulina Gano C'Real \|/g, "Espirulina Gano C'Real (15 sobres) |")
      .replace(/Oleaf Gano Rooibos \|/g, 'Bebida Oleaf Gano Rooibos (20 sobres) |')
      .replace(/Gano Schokoladde \|/g, 'Gano Schokoladde (20 sobres) |')
      .replace(/Colágeno Reskine \|/g, 'Bebida Colágeno Reskine (10 sachets) |');

    // Reemplazos de LUVOCO
    promptNuevo = promptNuevo
      .replace(/Cápsulas Suave \(15 u\)/g, 'LUVOCO Cápsulas Suave x15')
      .replace(/Cápsulas Medio \(15 u\)/g, 'LUVOCO Cápsulas Medio x15')
      .replace(/Cápsulas Fuerte \(15 u\)/g, 'LUVOCO Cápsulas Fuerte x15');
  }

  // 5. Verificar que hubo cambios
  if (promptNuevo === promptActual) {
    console.log('⚠️ No se detectaron cambios. El prompt podría ya estar correcto.');
    process.exit(0);
  }

  // 6. Mostrar diferencia
  console.log('✅ Cambios detectados:');
  console.log('   - Longitud anterior:', promptActual.length);
  console.log('   - Longitud nueva:', promptNuevo.length);
  console.log('   - Diferencia:', promptNuevo.length - promptActual.length, 'caracteres\n');

  // 7. Actualizar en Supabase
  const nuevaVersion = 'v13.9.6_fix_nombres_productos';

  const { error: updateError } = await supabase
    .from('system_prompts')
    .update({
      prompt: promptNuevo,
      version: nuevaVersion,
      updated_at: new Date().toISOString()
    })
    .eq('name', 'nexus_main');

  if (updateError) {
    console.error('❌ Error actualizando System Prompt:', updateError);
    process.exit(1);
  }

  console.log('✅ System Prompt actualizado exitosamente!');
  console.log('   Nueva versión:', nuevaVersion);
  console.log('\n🔄 Reinicia el servidor de desarrollo para aplicar cambios (o espera 5 min para cache).');
}

actualizarSystemPrompt().catch(console.error);
