#!/usr/bin/env node

/**
 * Script para actualizar System Prompt de NEXUS a v14.1
 * Fecha: 9 Diciembre 2025
 *
 * FIX CRÍTICO: Kit de Inicio NO tiene acceso al GEN5
 * - Kit de Inicio = SOLO bono binario 10%
 * - GEN5 = "Bono de Inicio Rápido" (solo ESP1, ESP2, ESP3)
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Cargar .env.local manualmente
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

// REGLA CRÍTICA ANTI-CONFUSIÓN
const REGLA_KIT_GEN5 = `
---

## 🚨 REGLA CRÍTICA: KIT DE INICIO vs GEN5 (ANTI-CONFUSIÓN)

### ⚠️ ALERTA MÁXIMA - NO CONFUNDIR ESTOS TÉRMINOS:

| Término | Significado | Acceso |
|---------|-------------|--------|
| **Kit de Inicio** | Paquete de $443,600 COP | SOLO binario 10% |
| **Bono de Inicio Rápido** | Bono GEN5 por inscripciones | Solo ESP1, ESP2, ESP3 |

### 🚫 PROHIBIDO ABSOLUTAMENTE:

❌ **NUNCA digas** que Kit de Inicio tiene acceso al GEN5
❌ **NUNCA digas** que Kit de Inicio gana por inscripciones en generaciones
❌ **NUNCA confundas** "Kit de Inicio" con "Bono de Inicio Rápido"

### ✅ LO CORRECTO ES:

**Con Kit de Inicio ($443,600):**
- ✅ Bono Binario al 10% (única forma de ganar)
- ❌ NO tiene Bono GEN5 (Inicio Rápido)
- ❌ NO gana por inscripciones de paquetes empresariales

**Con ESP1, ESP2, ESP3:**
- ✅ Bono Binario (15%, 16%, 17%)
- ✅ Bono GEN5 (Inicio Rápido) hasta 5 generaciones
- ✅ Gana por cada paquete empresarial en su red

### 📋 RESPUESTA CORRECTA CUANDO PREGUNTEN:

**"¿Si arranqué con Kit de Inicio tengo derecho al bono GEN5?"**

**RESPUESTA:** "No. El Kit de Inicio te da acceso ÚNICAMENTE al Bono Binario al 10%. El Bono GEN5 (también llamado Bono de Inicio Rápido) está disponible solo para quienes inician con Paquetes Empresariales (ESP1, ESP2 o ESP3). Si deseas acceder al GEN5, puedes actualizar tu paquete en cualquier momento."

### ⚠️ NOTA SOBRE NOMBRES CONFUSOS:

- "Kit de **Inicio**" ≠ "Bono de **Inicio** Rápido"
- El nombre similar puede confundir, pero son cosas completamente diferentes
- Cuando dudes, consulta arsenal_compensacion (COMP_06)

---
`;

async function actualizarSystemPrompt() {
  console.log('🔄 Actualizando System Prompt de NEXUS a v14.1 - FIX GEN5...\n');

  // 1. Leer System Prompt actual
  const { data: currentPrompt, error: readError } = await supabase
    .from('system_prompts')
    .select('*')
    .eq('name', 'nexus_main')
    .single();

  if (readError) {
    console.error('❌ Error al leer prompt actual:', readError);
    process.exit(1);
  }

  console.log('📖 Prompt actual encontrado:');
  console.log(`   - Versión: ${currentPrompt.version}`);
  console.log(`   - Longitud: ${currentPrompt.prompt.length} caracteres`);

  let newPrompt = currentPrompt.prompt;

  // 2. Verificar si ya existe la regla
  if (newPrompt.includes('KIT DE INICIO vs GEN5')) {
    console.log('\n⚠️  La regla KIT vs GEN5 ya existe en el prompt.');
    console.log('   No se realizarán cambios duplicados.');
    process.exit(0);
  }

  // 3. Insertar regla después de MODO TURBO
  console.log('\n📝 Agregando regla anti-confusión KIT vs GEN5...');

  const insertPoint = '## 📐 FORMATO Y LEGIBILIDAD';

  if (newPrompt.includes(insertPoint)) {
    newPrompt = newPrompt.replace(
      insertPoint,
      REGLA_KIT_GEN5 + '\n' + insertPoint
    );
    console.log('   ✅ Regla agregada correctamente');
  } else {
    console.log('   ⚠️  Punto de inserción no encontrado. Agregando al final...');
    newPrompt += '\n' + REGLA_KIT_GEN5;
  }

  // 4. Actualizar versión
  newPrompt = newPrompt.replace(/v14\.0/g, 'v14.1');
  newPrompt = newPrompt.replace(/14\.0\.0/g, '14.1.0');

  // 5. Guardar en Supabase
  console.log('\n💾 Guardando en Supabase...');

  const { data, error: updateError } = await supabase
    .from('system_prompts')
    .update({
      prompt: newPrompt,
      version: 'v14.1.0_fix_kit_gen5_confusion',
      updated_at: new Date().toISOString()
    })
    .eq('name', 'nexus_main')
    .select();

  if (updateError) {
    console.error('❌ Error al actualizar:', updateError);
    process.exit(1);
  }

  console.log('\n✅ System Prompt actualizado exitosamente a v14.1');
  console.log(`📌 Nueva longitud: ${newPrompt.length} caracteres`);
  console.log(`📌 Updated at: ${data[0].updated_at}`);

  // 6. Verificaciones
  console.log('\n🔍 Verificando cambios...\n');

  const checks = [
    { name: 'Regla KIT vs GEN5 presente', found: newPrompt.includes('KIT DE INICIO vs GEN5') },
    { name: 'Tabla de términos', found: newPrompt.includes('| Kit de Inicio | Paquete de $443,600') },
    { name: 'Prohibición explícita', found: newPrompt.includes('NUNCA digas que Kit de Inicio tiene acceso al GEN5') },
    { name: 'Respuesta correcta modelo', found: newPrompt.includes('El Kit de Inicio te da acceso ÚNICAMENTE al Bono Binario') },
    { name: 'Referencia a COMP_06', found: newPrompt.includes('arsenal_compensacion (COMP_06)') }
  ];

  checks.forEach(check => {
    console.log(`${check.found ? '✅' : '❌'} ${check.name}`);
  });

  console.log('\n🎉 Proceso completado\n');
  console.log('📋 Ahora NEXUS sabe que:');
  console.log('   - Kit de Inicio = SOLO binario 10%');
  console.log('   - GEN5 = Solo para ESP1, ESP2, ESP3');
  console.log('   - "Kit de Inicio" ≠ "Bono de Inicio Rápido"');
  console.log('');
}

actualizarSystemPrompt().catch(console.error);
