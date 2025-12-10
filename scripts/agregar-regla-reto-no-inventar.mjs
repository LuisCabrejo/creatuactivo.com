#!/usr/bin/env node

/**
 * Script para agregar regla CRÍTICA: NO inventar sobre el Reto de los 12 Días
 * Fecha: 10 Dic 2025
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const envPath = join(__dirname, '..', '.env.local');
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

// NUEVA REGLA CRÍTICA
const REGLA_RETO_NO_INVENTAR = `

---

## 🚨 REGLA CRÍTICA: RETO DE LOS 12 DÍAS - NO INVENTAR

### ⚠️ ALERTA MÁXIMA - RESPUESTAS DEL RETO

Cuando el usuario pregunte sobre el **Reto de los 12 Días** (opción A del menú inicial o cualquier variación):

**USA ÚNICAMENTE el contenido de arsenal_compensacion (RETO_01 a RETO_07).**

### 🚫 PROHIBIDO ABSOLUTAMENTE:

❌ **NUNCA inventes** detalles sobre "días de entrenamiento" o "configuración"
❌ **NUNCA inventes** "Días 1-4: Configuración", "Días 5-8: Activación", etc.
❌ **NUNCA inventes** "mentoría diaria" o "entrenamiento consecutivo"
❌ **NUNCA inventes** contenido del reto que no esté en arsenal_compensacion
❌ **NUNCA digas** que es un "programa de activación acelerada" (INVENTADO)

### ✅ LO QUE SÍ DEBES DECIR (de RETO_01):

"El Reto de los 12 Días es una estrategia de CreaTuActivo.com que busca premiar la velocidad.

En este plan se refleja cómo una persona, al hacer un trabajo sencillo de unir dos personas, puede construir un sistema de distribución masiva de productos Gano Excel."

### 📊 TABLA CORRECTA (de RETO_01):

| Día | Nivel | Tu red crece a |
|-----|-------|----------------|
| 1 | Tus 2 directos | 2 personas |
| 2 | 2da generación | 6 personas |
| 3 | 3ra generación | 14 personas |
| ... | ... | ... |
| 12 | 12va generación | 8,190 personas |

### 📋 PROCEDIMIENTO CORRECTO:

1. Usuario pregunta sobre el Reto → Busca en arsenal_compensacion
2. Usa RETO_01 para "¿Qué es el Reto?"
3. Usa RETO_03 para "¿Cómo se gana?"
4. Usa RETO_04 para "¿Cómo participo?"
5. **SI NO ENCUENTRAS LA RESPUESTA EN EL ARSENAL, di "no tengo esa información específica"**

---
`;

async function agregarRegla() {
  console.log('🔄 Agregando regla CRÍTICA: NO inventar sobre el Reto...\n');

  const { data: prompt, error: readError } = await supabase
    .from('system_prompts')
    .select('*')
    .eq('name', 'nexus_main')
    .single();

  if (readError || !prompt) {
    console.log('❌ No se encontró el System Prompt:', readError);
    return;
  }

  console.log('📖 Versión actual:', prompt.version);
  console.log('📏 Longitud:', prompt.prompt.length, 'caracteres');

  // Verificar si ya existe
  if (prompt.prompt.includes('RETO DE LOS 12 DÍAS - NO INVENTAR')) {
    console.log('\n⚠️  La regla ya existe. No se realizarán cambios duplicados.');
    return;
  }

  // Insertar después de ANTI-ALUCINACIÓN o al inicio de las reglas
  let newPrompt = prompt.prompt;

  const insertPoint = '## 🚫 REGLAS ANTI-ALUCINACIÓN';

  if (newPrompt.includes(insertPoint)) {
    // Insertar ANTES de anti-alucinación
    newPrompt = newPrompt.replace(insertPoint, REGLA_RETO_NO_INVENTAR + '\n' + insertPoint);
    console.log('\n✅ Regla insertada antes de ANTI-ALUCINACIÓN');
  } else {
    // Buscar otro punto de inserción
    const altPoint = '## 📐 FORMATO';
    if (newPrompt.includes(altPoint)) {
      newPrompt = newPrompt.replace(altPoint, REGLA_RETO_NO_INVENTAR + '\n' + altPoint);
      console.log('\n✅ Regla insertada antes de FORMATO');
    } else {
      console.log('\n⚠️  No se encontró punto de inserción. Agregando al final...');
      newPrompt += REGLA_RETO_NO_INVENTAR;
    }
  }

  // Guardar
  const { data, error: updateError } = await supabase
    .from('system_prompts')
    .update({
      prompt: newPrompt,
      version: 'v14.4.0_regla_reto_no_inventar',
      updated_at: new Date().toISOString()
    })
    .eq('name', 'nexus_main')
    .select();

  if (updateError) {
    console.log('❌ Error al actualizar:', updateError);
    return;
  }

  console.log('\n✅ System Prompt actualizado a v14.4.0');
  console.log('📌 Updated at:', data[0].updated_at);
  console.log('📏 Nueva longitud:', newPrompt.length, 'caracteres');

  // Verificar
  const { data: verify } = await supabase
    .from('system_prompts')
    .select('prompt')
    .eq('name', 'nexus_main')
    .single();

  if (verify.prompt.includes('NUNCA inventes') && verify.prompt.includes('Días 1-4')) {
    console.log('\n🔍 Verificación: ✅ Regla agregada correctamente');
  }

  console.log('\n🎉 Proceso completado');
  console.log('\n📋 NEXUS ahora sabe que:');
  console.log('   - NO debe inventar detalles del Reto');
  console.log('   - DEBE usar arsenal_compensacion para respuestas del Reto');
  console.log('   - La tabla correcta tiene Día 1 = 2 directos');
}

agregarRegla().catch(console.error);
