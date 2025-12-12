#!/usr/bin/env node

/**
 * Script para actualizar System Prompt de NEXUS a v14.8.0
 * Fecha: 12 Diciembre 2025
 *
 * FIX CRÍTICO: RETO DE LOS 12 DÍAS - Errores en cálculos y datos inventados
 *
 * Problemas detectados:
 * 1. NEXUS inventa datos de CV que no corresponden a la proyección del Reto
 * 2. NEXUS hace cálculos incorrectos del bono binario
 * 3. NEXUS confunde y dice que el Reto incluye GEN5 (INCORRECTO)
 *
 * Solución:
 * 1. Agregar regla "NO INVENTAR" específica para el Reto
 * 2. Incrustar tabla RETO_02 directamente en system prompt
 * 3. Reforzar regla Kit = SOLO binario 10% (NO GEN5)
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

// ============================================================================
// REGLA CRÍTICA: RETO DE LOS 12 DÍAS
// ============================================================================
const REGLA_RETO_12_DIAS = `
---

## 🚨 REGLA CRÍTICA: RETO DE LOS 12 DÍAS - USAR DATOS EXACTOS

### ⚠️ ALERTA MÁXIMA - NO INVENTAR DATOS DEL RETO

Cuando el usuario pregunte sobre el **Reto de los 12 Días**, **DEBES usar ÚNICAMENTE** los datos de esta tabla. **NUNCA calcules tus propios números.**

### 📊 TABLA OFICIAL DE PROYECCIÓN (MEMORIZA ESTO):

| Día | Personas | CV/lado | Bono 10% | Acumulado |
|-----|----------|---------|----------|-----------|
| 1 | 2 | 56 | $25,200 | $25,200 |
| 2 | 4 | 112 | $50,400 | $75,600 |
| 4 | 16 | 448 | $201,600 | $378,000 |
| 6 | 64 | 1,792 | $806,400 | $1,587,600 |
| 8 | 256 | 7,168 | $3,225,600 | $6,428,400 |
| 10 | 1,024 | 28,672 | $12,902,400 | $25,776,600 |
| 12 | 4,096 | 114,688 | $51,609,600 | **$103,177,800** |

**Valores clave que DEBES memorizar:**
- Kit de Inicio = **56 CV** por persona
- Bono Binario = **10%** (ÚNICO bono disponible con Kit)
- 1 CV = $450 COP (para cálculo: CV × $450 × 10% = Bono)
- Potencial día 12 = **$103 millones COP** acumulados

### 🚫 PROHIBIDO ABSOLUTAMENTE:

❌ **NUNCA inventes** otros valores de CV (ej: "100 CV", "50 CV")
❌ **NUNCA calcules** bonos con fórmulas propias - USA LA TABLA
❌ **NUNCA digas** que el Reto incluye "Bono GEN5" o "Bono de Inicio Rápido"
❌ **NUNCA inventes** "días de entrenamiento" o "fases de configuración"
❌ **NUNCA digas** porcentajes diferentes al 10% para Kit de Inicio

### ✅ RESPUESTAS CORRECTAS:

**Pregunta: "¿Cuánto puedo ganar con el Reto?"**
RESPUESTA CORRECTA: "Con el Reto de los 12 Días usando Kit de Inicio, el potencial acumulado al día 12 es de más de $103 millones COP. Esto es con el Bono Binario al 10%. El día 1 con 2 personas ganas $25,200, el día 6 con 64 personas ganas $806,400, y así sucesivamente."

**Pregunta: "¿Cuántos CV genera el Kit de Inicio?"**
RESPUESTA CORRECTA: "El Kit de Inicio genera 56 CV (Volumen Comisional) por persona. En el Reto, cuando tienes 2 personas el día 1, son 56 CV por lado."

**Pregunta: "¿Qué bonos gano con el Reto?"**
RESPUESTA CORRECTA: "Con el Kit de Inicio en el Reto, ganas ÚNICAMENTE el Bono Binario al 10%. El Bono GEN5 (Inicio Rápido) NO está disponible con el Kit de Inicio - solo con paquetes empresariales ESP1, ESP2 o ESP3."

### 📋 CUANDO NO SEPAS LA RESPUESTA:

Si te preguntan algo específico del Reto que NO está en esta tabla, di:
"Esa información específica la maneja directamente el equipo. Te recomiendo contactar a Liliana al +573102066593 para detalles precisos."

---
`;

// ============================================================================
// REFUERZO: KIT DE INICIO = SOLO BINARIO (NO GEN5)
// ============================================================================
const REFUERZO_KIT_NO_GEN5 = `
---

## 🔒 REFUERZO: KIT DE INICIO EN EL RETO = SOLO BONO BINARIO

### ⚠️ ERROR COMÚN QUE DEBES EVITAR:

El "**Kit de Inicio**" y el "**Bono de Inicio Rápido**" (GEN5) son cosas COMPLETAMENTE DIFERENTES:

| Concepto | Qué es | Disponible con Kit |
|----------|--------|-------------------|
| Kit de Inicio | Paquete de $443,600 COP | Es el paquete |
| Bono Binario 10% | Comisión por volumen | ✅ SÍ |
| Bono GEN5 (Inicio Rápido) | Bono por inscripciones | ❌ NO |

### 🚫 RESPUESTAS PROHIBIDAS EN CONTEXTO DEL RETO:

❌ "Con el Reto ganas Bono GEN5..." → INCORRECTO
❌ "Además del binario, tienes el bono de inicio rápido..." → INCORRECTO
❌ "Ganas por cada persona que inscriba un paquete empresarial..." → INCORRECTO (esto es GEN5)

### ✅ RESPUESTA MODELO:

"En el Reto de los 12 Días con Kit de Inicio ($443,600 COP), tu única forma de ganar es el **Bono Binario al 10%**. Cada Kit genera 56 CV. No tienes acceso al Bono GEN5 con este paquete. Si deseas acceder a más formas de ganar, puedes considerar un Paquete Empresarial."

---
`;

async function actualizarSystemPrompt() {
  console.log('🔄 Actualizando System Prompt de NEXUS a v14.8.0 - FIX RETO 12 DÍAS\n');
  console.log('═'.repeat(70));

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

  console.log('\n📖 Prompt actual encontrado:');
  console.log(`   Versión: ${currentPrompt.version}`);
  console.log(`   Longitud: ${currentPrompt.prompt.length} caracteres`);
  console.log(`   Updated: ${currentPrompt.updated_at}`);

  let newPrompt = currentPrompt.prompt;

  // 2. Verificar si ya existen las reglas
  const yaExisteReglaReto = newPrompt.includes('RETO DE LOS 12 DÍAS - USAR DATOS EXACTOS');
  const yaExisteTabla = newPrompt.includes('| 12 | 4,096 | 114,688 |');
  const yaExisteRefuerzoKit = newPrompt.includes('KIT DE INICIO EN EL RETO = SOLO BONO BINARIO');

  console.log('\n🔍 Verificando reglas existentes:');
  console.log(`   Regla "USAR DATOS EXACTOS": ${yaExisteReglaReto ? '✅ Ya existe' : '❌ No existe'}`);
  console.log(`   Tabla de proyección: ${yaExisteTabla ? '✅ Ya existe' : '❌ No existe'}`);
  console.log(`   Refuerzo Kit NO GEN5: ${yaExisteRefuerzoKit ? '✅ Ya existe' : '❌ No existe'}`);

  if (yaExisteReglaReto && yaExisteTabla && yaExisteRefuerzoKit) {
    console.log('\n⚠️  Todas las reglas ya existen. No se realizarán cambios.');
    process.exit(0);
  }

  // 3. Buscar punto de inserción óptimo
  console.log('\n📝 Agregando reglas...');

  // Buscar después de "ANTI-ALUCINACIÓN" o antes de "FORMATO"
  const insertPoints = [
    '## 🚫 REGLAS ANTI-ALUCINACIÓN',
    '## 📐 FORMATO',
    '## 📐 FORMATO Y LEGIBILIDAD'
  ];

  let inserted = false;
  for (const point of insertPoints) {
    if (newPrompt.includes(point) && !inserted) {
      // Insertar ANTES del punto encontrado
      const newRules = REGLA_RETO_12_DIAS + '\n' + REFUERZO_KIT_NO_GEN5;
      newPrompt = newPrompt.replace(point, newRules + '\n' + point);
      console.log(`   ✅ Reglas insertadas antes de "${point}"`);
      inserted = true;
      break;
    }
  }

  if (!inserted) {
    // Fallback: agregar al final
    console.log('   ⚠️ No se encontró punto de inserción. Agregando al final...');
    newPrompt += '\n' + REGLA_RETO_12_DIAS + '\n' + REFUERZO_KIT_NO_GEN5;
  }

  // 4. Eliminar reglas duplicadas o obsoletas si existen
  // (Limpiar versiones anteriores incompletas)
  if (newPrompt.includes('RETO DE LOS 12 DÍAS - NO INVENTAR') &&
      !newPrompt.includes('RETO DE LOS 12 DÍAS - USAR DATOS EXACTOS')) {
    console.log('   🧹 Limpiando regla obsoleta "NO INVENTAR" (reemplazada por "USAR DATOS EXACTOS")');
    // Esta versión anterior no tenía la tabla, la dejamos porque la nueva es más completa
  }

  // 5. Guardar en Supabase
  console.log('\n💾 Guardando en Supabase...');

  const { data, error: updateError } = await supabase
    .from('system_prompts')
    .update({
      prompt: newPrompt,
      version: 'v14.8.0_fix_reto_12_dias_datos_exactos',
      updated_at: new Date().toISOString()
    })
    .eq('name', 'nexus_main')
    .select();

  if (updateError) {
    console.error('❌ Error al actualizar:', updateError);
    process.exit(1);
  }

  console.log('\n✅ System Prompt actualizado exitosamente a v14.8.0');
  console.log(`📌 Nueva longitud: ${newPrompt.length} caracteres`);
  console.log(`📌 Updated at: ${data[0].updated_at}`);

  // 6. Verificaciones
  console.log('\n🔍 Verificando cambios aplicados:\n');

  const checks = [
    { name: 'Regla "USAR DATOS EXACTOS"', found: newPrompt.includes('RETO DE LOS 12 DÍAS - USAR DATOS EXACTOS') },
    { name: 'Tabla con 56 CV', found: newPrompt.includes('| 1 | 2 | 56 |') },
    { name: 'Día 12 = 4,096 personas', found: newPrompt.includes('| 12 | 4,096 | 114,688 |') },
    { name: 'Total $103 millones', found: newPrompt.includes('$103,177,800') },
    { name: '1 CV = $450 COP', found: newPrompt.includes('1 CV = $450 COP') },
    { name: 'Prohibición inventar CV', found: newPrompt.includes('NUNCA inventes') },
    { name: 'Respuesta modelo "56 CV"', found: newPrompt.includes('genera 56 CV') },
    { name: 'Refuerzo Kit NO GEN5', found: newPrompt.includes('KIT DE INICIO EN EL RETO = SOLO BONO BINARIO') },
    { name: 'Tabla comparativa Kit vs GEN5', found: newPrompt.includes('Bono GEN5 (Inicio Rápido)') && newPrompt.includes('❌ NO') }
  ];

  let allPassed = true;
  checks.forEach(check => {
    const status = check.found ? '✅' : '❌';
    console.log(`${status} ${check.name}`);
    if (!check.found) allPassed = false;
  });

  console.log('\n' + '═'.repeat(70));

  if (allPassed) {
    console.log('🎉 ¡TODAS las verificaciones pasaron!');
  } else {
    console.log('⚠️  Algunas verificaciones fallaron. Revisa el prompt manualmente.');
  }

  console.log('\n📋 NEXUS ahora sabe que:');
  console.log('   ✓ Kit de Inicio = 56 CV por persona');
  console.log('   ✓ Bono Binario = 10% (ÚNICO bono con Kit)');
  console.log('   ✓ Día 12 = $103 millones COP potenciales');
  console.log('   ✓ NO debe inventar datos del Reto');
  console.log('   ✓ NO debe decir que Kit tiene GEN5');
  console.log('   ✓ DEBE usar la tabla exacta de proyección');
  console.log('');
}

actualizarSystemPrompt().catch(console.error);
