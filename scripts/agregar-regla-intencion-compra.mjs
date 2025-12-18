#!/usr/bin/env node

/**
 * Script para agregar regla de INTENCIÓN DE COMPRA al System Prompt
 * Fecha: 10 Dic 2025
 * Problema: NEXUS no cierra cuando el usuario dice "deseo iniciar"
 * Solución: Detectar intención de compra y usar RETO_04 para cerrar
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

// NUEVA REGLA: DETECCIÓN DE INTENCIÓN DE COMPRA
const REGLA_INTENCION_COMPRA = `
---

## 🎯 REGLA CRÍTICA: DETECCIÓN DE INTENCIÓN DE COMPRA (CIERRE)

### 🚨 CUANDO EL USUARIO MANIFIESTE INTENCIÓN DE INICIAR/VINCULAR:

**Frases que activan esta regla:**
- "deseo iniciar" / "quiero iniciar" / "quiero empezar"
- "qué hago para empezar" / "cómo inicio" / "cómo me vinculo"
- "quiero participar" / "me interesa vincularme"
- "cómo pago" / "dónde pago" / "cuánto es"
- "estoy listo" / "vamos" / "hagámoslo"

### ✅ ACCIÓN OBLIGATORIA - CERRAR CON OPCIONES DE VINCULACIÓN:

Cuando detectes intención de compra, **SALTA** cualquier paso pendiente (arquetipo, opciones A/B/C) y responde con las opciones de vinculación:

**Respuesta modelo:**
\`\`\`
Perfecto [NOMBRE], te ayudo a vincularte.

**Opciones para tu vinculación:**

**1. Formulario de vinculación:**
Llena el formulario en [creatuactivo.com/reto-12-niveles](https://creatuactivo.com/reto-12-niveles#formulario)

**2. WhatsApp directo:**
[Escríbenos al 310 206 6593](https://wa.me/573102066593?text=Hola%2C%20quiero%20participar%20en%20los%2012%20Niveles)

**3. Contacta a quien te invitó:**
La persona que te compartió el enlace puede guiarte.

¿Cuál opción prefieres?
\`\`\`

### 🚫 NO HAGAS ESTO:

❌ NO preguntes arquetipo si el usuario ya quiere vincular
❌ NO ofrezcas opciones A/B/C/D genéricas
❌ NO muestres paquetes SIN incluir cómo vincularse
❌ NO sigas el flujo rígido cuando hay intención de compra

### 📋 REGLA DE ORO - DESPUÉS DE MOSTRAR PAQUETES:

**SIEMPRE** incluye las opciones de vinculación después de mostrar paquetes/precios.

Es como un vendedor: después de mostrar el producto y el precio, llevas al cliente a la caja.

---
`;

async function agregarRegla() {
  console.log('🔄 Agregando regla de INTENCIÓN DE COMPRA al System Prompt...\n');

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
  if (prompt.prompt.includes('DETECCIÓN DE INTENCIÓN DE COMPRA')) {
    console.log('\n⚠️  La regla ya existe. No se realizarán cambios duplicados.');
    return;
  }

  let newPrompt = prompt.prompt;

  // Insertar después del flujo de 14 mensajes o antes de REGLAS ANTI-ALUCINACIÓN
  const insertPoints = [
    '## 🚫 REGLAS ANTI-ALUCINACIÓN',
    '## 📐 FORMATO',
    '## 🎭 REGLAS DE ESTILO'
  ];

  let inserted = false;
  for (const point of insertPoints) {
    if (newPrompt.includes(point)) {
      newPrompt = newPrompt.replace(point, REGLA_INTENCION_COMPRA + '\n' + point);
      console.log(`\n✅ Regla insertada antes de "${point}"`);
      inserted = true;
      break;
    }
  }

  if (!inserted) {
    console.log('\n⚠️  No se encontró punto de inserción. Agregando al final...');
    newPrompt += REGLA_INTENCION_COMPRA;
  }

  // Guardar
  const { data, error: updateError } = await supabase
    .from('system_prompts')
    .update({
      prompt: newPrompt,
      version: 'v14.6.0_intencion_compra_cierre',
      updated_at: new Date().toISOString()
    })
    .eq('name', 'nexus_main')
    .select();

  if (updateError) {
    console.log('❌ Error al actualizar:', updateError);
    return;
  }

  console.log('\n✅ System Prompt actualizado a v14.6.0');
  console.log('📌 Updated at:', data[0].updated_at);
  console.log('📏 Nueva longitud:', newPrompt.length, 'caracteres');

  // Verificar
  const { data: verify } = await supabase
    .from('system_prompts')
    .select('prompt')
    .eq('name', 'nexus_main')
    .single();

  const checks = [
    { name: 'Regla de intención de compra', found: verify.prompt.includes('DETECCIÓN DE INTENCIÓN DE COMPRA') },
    { name: 'Frases activadoras', found: verify.prompt.includes('deseo iniciar') },
    { name: 'Link WhatsApp', found: verify.prompt.includes('wa.me/573102066593') },
    { name: 'Link formulario', found: verify.prompt.includes('reto-12-niveles#formulario') }
  ];

  console.log('\n🔍 Verificaciones:');
  checks.forEach(check => {
    console.log(`   ${check.found ? '✅' : '❌'} ${check.name}`);
  });

  console.log('\n🎉 Proceso completado');
  console.log('\n📋 NEXUS ahora:');
  console.log('   - Detecta intención de compra ("deseo iniciar", "cómo pago", etc.)');
  console.log('   - Salta pasos innecesarios cuando el usuario quiere vincular');
  console.log('   - Cierra con opciones de vinculación (formulario/WhatsApp)');
}

agregarRegla().catch(console.error);
