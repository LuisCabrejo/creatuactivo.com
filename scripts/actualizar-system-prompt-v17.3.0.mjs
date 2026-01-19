#!/usr/bin/env node
/**
 * Actualiza System Prompt a v17.3.0
 *
 * Cambios:
 * 1. USD-FIRST: Ejemplo Gen5 corregido de COP a USD
 * 2. VIÑETAS: Regla para usar bullets en listas de 3+ items
 * 3. TABLAS EXACTAS: Instrucción reforzada para copiar tablas del arsenal
 *
 * Ejecutar: node scripts/actualizar-system-prompt-v17.3.0.mjs
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Cargar .env.local
dotenv.config({ path: join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Variables de entorno no configuradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Nueva sección de REGLAS DE FORMATO v17.3.0
const NUEVAS_REGLAS_FORMATO = `
## 📐 REGLAS DE FORMATO v17.3.0

### 1. USD-FIRST (OBLIGATORIO):
**Siempre mostrar valores en USD como moneda principal. COP como referencia secundaria.**

| ❌ INCORRECTO | ✅ CORRECTO |
|---------------|-------------|
| $675,000 | $150 USD (~$675K COP) |
| $90,000 | $20 USD (~$90K COP) |
| Ganas $10 millones | Ganas $2,140 USD (~$9.6M COP) |

### 2. VIÑETAS PARA LISTAS (3+ ITEMS):
**Cuando presentes 3 o más elementos, SIEMPRE usa viñetas con bullets (•) o guiones (-), NUNCA números inline en párrafo.**

| ❌ INCORRECTO | ✅ CORRECTO |
|---------------|-------------|
| Ganas de 4 formas: 1. GEN5 2. Binario 3. Directas 4. Liderazgo | Ganas de 4 formas principales:\\n\\n• **GEN5** - cada vinculación\\n• **Binario** - volumen semanal\\n• **Directas** - ventas\\n• **Liderazgo** - crecimiento |

### 3. TABLAS DEL ARSENAL (COPIAR EXACTO):
**Cuando el arsenal tenga una tabla marcada con "⚠️ QUESWA: COPIAR ESTA TABLA EXACTAMENTE", usarla SIN modificar.**

Las tablas canónicas son:
- COMP_GEN5_08: Proyección 2x2 (Gen 1-5 con bonos en USD)
- COMP_BIN_08: Proyección de crecimiento Binario
- COMP_BIN_10: Ejemplo con consumo estándar (56 CV)

---

`;

// Ejemplo corregido de Gen5 en USD-first
const EJEMPLO_GEN5_CORREGIDO = `**Ejemplo correcto (pregunta sobre GEN5):**
\`\`\`
Cobras mientras construyes. Cada vinculación = un pago.

El GEN5 paga por 5 generaciones. Con duplicación 2x2:

| Gen | Vinculaciones | Bono c/u | Total Acumulado |
|-----|---------------|----------|-----------------|
| 1 | 2 | $150 USD | $300 USD |
| 2 | 4 | $20 USD | $380 USD |
| 3 | 8 | $20 USD | $540 USD |
| 4 | 16 | $20 USD | $860 USD |
| 5 | 32 | $40 USD | $2,140 USD |

Total al completar: **$2,140 USD** (~$9.6M COP).
\`\`\``;

// Ejemplo del Binario también en USD-first
const EJEMPLO_BINARIO_CORREGIDO = `**Ejemplo correcto (pregunta sobre BINARIO):**
\`\`\`
Rentas vitalicias. Ganas por volumen, infinito en profundidad.

El Binario paga CADA SEMANA sobre el lado menor de tu equipo:

| Escenario | Activos/Lado | CV Menor | Comisión Semanal |
|-----------|--------------|----------|------------------|
| Inicio | 5 | 300 CV | $51 USD |
| 3 meses | 15 | 1,050 CV | $178 USD |
| 6 meses | 30 | 2,400 CV | $408 USD |
| 1 año | 60 | 5,400 CV | $918 USD |
| Diamante | 100+ | 12,000 CV | $2,040 USD |

Diamante mensual: **$8,160 USD** (~$36.7M COP).
\`\`\``;

async function actualizarSystemPrompt() {
  console.log('📖 Leyendo System Prompt actual...');

  const { data, error } = await supabase
    .from('system_prompts')
    .select('prompt, version')
    .eq('name', 'nexus_main')
    .single();

  if (error || !data) {
    console.error('❌ Error leyendo prompt:', error);
    process.exit(1);
  }

  console.log(`✅ Versión actual: ${data.version}`);

  let newPrompt = data.prompt;

  // 1. Actualizar versión en el header
  newPrompt = newPrompt.replace(
    /\*\*Versión:\*\* v17\.2\.0_compensacion_conversion/g,
    '**Versión:** v17.3.0_formato_usd_first'
  );

  newPrompt = newPrompt.replace(
    /\*\*Actualizado:\*\* 18 de enero de 2026/g,
    '**Actualizado:** 18 de enero de 2026'
  );

  // 2. Agregar nueva sección de cambios v17.3.0
  const nuevoCambiosSection = `## 🔄 CAMBIOS v17.3.0 (Formato USD-First + Viñetas)

**1. USD-FIRST obligatorio:**
- ✅ NUEVO: Regla explícita - siempre USD primero, COP secundario
- ✅ CORREGIDO: Ejemplo Gen5 actualizado de COP a USD
- ✅ CORREGIDO: Ejemplo Binario actualizado de COP a USD

**2. Viñetas para listas:**
- ✅ NUEVO: Regla - cuando hay 3+ items, usar bullets (•) no números en párrafo
- ✅ NUEVO: Ejemplo de formato correcto vs incorrecto

**3. Tablas del arsenal:**
- ✅ REFORZADO: Copiar tablas EXACTAS del arsenal (COMP_GEN5_08, COMP_BIN_08, COMP_BIN_10)

---

`;

  // Insertar después del header
  newPrompt = newPrompt.replace(
    '## 🔄 CAMBIOS v17.2.0',
    nuevoCambiosSection + '## 🔄 CAMBIOS v17.2.0'
  );

  // 3. Insertar REGLAS DE FORMATO antes de ESTRUCTURA DE RESPUESTA PARA COMPENSACIÓN
  newPrompt = newPrompt.replace(
    '**📋 ESTRUCTURA DE RESPUESTA PARA COMPENSACIÓN:**',
    NUEVAS_REGLAS_FORMATO + '**📋 ESTRUCTURA DE RESPUESTA PARA COMPENSACIÓN:**'
  );

  // 4. Reemplazar ejemplo de Gen5 en COP por USD
  const ejemploViejoCOP = `**Ejemplo correcto (pregunta sobre GEN5):**
\`\`\`
Patrocinas 2, pero cobras por 62.

El GEN5 paga por 5 generaciones de profundidad. Con duplicación 2x2, tu red crece exponencialmente.

| Gen | Personas | Bono c/u | Total |
|-----|----------|----------|-------|
| 1 | 2 | $675,000 | $1,350,000 |
| 2 | 4 | $90,000 | $360,000 |
...

Con solo 2 patrocinados directos y duplicación, generas casi $10 millones en bonos GEN5.
\`\`\``;

  if (newPrompt.includes(ejemploViejoCOP)) {
    newPrompt = newPrompt.replace(ejemploViejoCOP, EJEMPLO_GEN5_CORREGIDO);
    console.log('✅ Ejemplo Gen5 actualizado a USD-first');
  } else {
    console.log('⚠️ No se encontró el ejemplo viejo de Gen5 exacto, buscando patrón...');
    // Buscar con regex más flexible
    newPrompt = newPrompt.replace(
      /\*\*Ejemplo correcto \(pregunta sobre GEN5\):\*\*[\s\S]*?generas casi \$10 millones en bonos GEN5\.\s*```/,
      EJEMPLO_GEN5_CORREGIDO
    );
  }

  // 5. Agregar ejemplo de Binario después del ejemplo de Gen5
  if (!newPrompt.includes('Ejemplo correcto (pregunta sobre BINARIO)')) {
    newPrompt = newPrompt.replace(
      EJEMPLO_GEN5_CORREGIDO,
      EJEMPLO_GEN5_CORREGIDO + '\n\n' + EJEMPLO_BINARIO_CORREGIDO
    );
    console.log('✅ Ejemplo Binario agregado');
  }

  // 6. Actualizar a Supabase
  console.log('\n📤 Actualizando System Prompt en Supabase...');

  const { error: updateError } = await supabase
    .from('system_prompts')
    .update({
      prompt: newPrompt,
      version: 'v17.3.0_formato_usd_first',
      updated_at: new Date().toISOString()
    })
    .eq('name', 'nexus_main');

  if (updateError) {
    console.error('❌ Error actualizando:', updateError);
    process.exit(1);
  }

  console.log('✅ System Prompt actualizado a v17.3.0');
  console.log('\n📋 Resumen de cambios:');
  console.log('   • USD-FIRST: Regla explícita agregada');
  console.log('   • VIÑETAS: Regla para listas de 3+ items');
  console.log('   • Ejemplo Gen5: Corregido de COP a USD');
  console.log('   • Ejemplo Binario: Agregado en USD');
  console.log('   • Tablas: Instrucción reforzada para copiar exacto');
}

actualizarSystemPrompt().catch(console.error);
