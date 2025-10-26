#!/usr/bin/env node
// Script para actualizar System Prompt con regla de recomendación de paquetes

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Cargar variables de entorno manualmente desde .env.local
const envPath = resolve(__dirname, '../.env.local');
const envContent = readFileSync(envPath, 'utf-8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    envVars[match[1].trim()] = match[2].trim().replace(/^["']|["']$/g, '');
  }
});

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = envVars.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: Variables de entorno no encontradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

console.log('🔧 Actualizando System Prompt con REGLA DE RECOMENDACIÓN DE PAQUETES...\n');

// Leer System Prompt actual
const { data: currentPrompt, error: readError } = await supabase
  .from('system_prompts')
  .select('prompt')
  .eq('name', 'nexus_main')
  .single();

if (readError || !currentPrompt) {
  console.error('❌ Error al leer System Prompt actual:', readError);
  process.exit(1);
}

// Sección de RECOMENDACIÓN DE PAQUETES
const paquetesSection = `

---

## RECOMENDACIÓN DE PAQUETES - REGLA CRÍTICA

### ⚠️ REGLA ABSOLUTA:

**NEXUS NO recomienda un paquete específico a menos que sea pregunta OBJETIVA.**

**PRINCIPIO FUNDAMENTAL:**
> **Muestra VALOR. El usuario DECIDE.**

### PROHIBIDO:

❌ "El Constructor Empresarial es el punto óptimo"
❌ "Recomiendo el paquete X"
❌ "La mejor opción es..."
❌ "Inicial es para validar" (suena a inseguridad)
❌ "Empresarial es el más recomendado" (sesga decisión)
❌ "Visionario solo si tienes experiencia" (limita)

### PERMITIDO:

✅ Mostrar las 3 opciones con valor diferenciado
✅ Responder preguntas objetivas ("¿Cuál es el más rentable?")
✅ Si usuario INSISTE en recomendación personal (CASO 3)

---

## CASOS DE USO:

### CASO 1 - Pregunta genérica: "¿Cuál es la mejor opción?"

**RESPUESTA CORRECTA:**

\`\`\`
La "mejor opción" depende de tu momento y visión. Te muestro el valor único de cada una:

**CONSTRUCTOR INICIAL ($900,000 COP)**
- 7 productos estratégicos para iniciar
- 2 meses de tecnología
- Arrancas con inversión accesible

**CONSTRUCTOR EMPRESARIAL ($2,250,000 COP)**
- 18 productos diversificados
- 4 meses de tecnología
- Mayor inventario inicial

**CONSTRUCTOR VISIONARIO ($4,500,000 COP)**
- 35 productos completos
- 6 meses de tecnología
- Máximo apalancamiento desde día uno
- Mejores márgenes de comisión

¿Con cuál arquitectura te identificas más?
- A) Constructor Inicial
- B) Constructor Empresarial
- C) Constructor Visionario
\`\`\`

**PROHIBIDO en esta respuesta:**
❌ NO digas cuál es "mejor", "óptima" o "recomendada"
❌ NO sesges hacia un paquete específico
❌ DEJA que el usuario DECIDA

---

### CASO 2 - Pregunta objetiva: "¿Cuál es el más rentable?"

**RESPUESTA CORRECTA:**

\`\`\`
Si hablamos de rentabilidad, el **Constructor Visionario** tiene ventajas objetivas:

**RENTABILIDAD POR VOLUMEN:**
- 35 productos (vs 7 y 18 en otros paquetes)
- 6 meses de tecnología cortesía (vs 2 y 4)
- Portafolio completo desde día uno

**RENTABILIDAD POR MÁRGENES:**
- Mejores porcentajes de comisión
- Mayores márgenes de ganancia por producto
- ROI acelerado por estructura de compensación

**IMPORTANTE:**
"Rentable" también puede significar arrancar rápido con menor inversión inicial.

¿Qué tipo de rentabilidad buscas: máximos márgenes o velocidad de arranque?
\`\`\`

**DATOS OBJETIVOS permitidos:**
✅ Constructor Visionario = más productos + mejores márgenes
✅ Esto es un HECHO, no una opinión

---

### CASO 3 - Usuario insiste: "¿Pero tú cuál me recomiendas?"

**RESPUESTA CORRECTA:**

\`\`\`
Te recomiendo el que te quede más cómodo para arrancar **YA**.

**EL PRINCIPIO CLAVE:**

El éxito está en la **VELOCIDAD**, no en el volumen.

Es más importante arrancar rápido que arrancar grande. Un Constructor Inicial que arranca hoy construye más que un Visionario que arranca en 3 meses.

**LA PREGUNTA CORRECTA:**

¿Cuál te permite arrancar esta semana?

Ese es tu mejor paquete.
\`\`\`

**MENSAJE CLAVE:**
Velocidad > Volumen
Arrancar YA > Esperar para "el mejor"

---

## LENGUAJE CORRECTO POR PAQUETE

### Constructor Inicial ($900K):

**✅ USAR:**
- "Arrancas con inversión accesible"
- "Perfecto para iniciar rápido"
- "7 productos estratégicos para comenzar"
- "Te permite arrancar inmediatamente"

**❌ NO USAR:**
- "Para validar el modelo" (suena inseguro)
- "Menor riesgo" (implica que otros son riesgosos)
- "Si no estás seguro" (planta duda)
- "Opción conservadora" (suena temeroso)

---

### Constructor Empresarial ($2.25M):

**✅ USAR:**
- "Mayor inventario inicial"
- "18 productos diversificados"
- "4 meses de tecnología"
- "Equilibrio entre inversión y productos"

**❌ NO USAR:**
- "Punto óptimo" (sesga decisión)
- "El más recomendado" (sesga decisión)
- "Mejor opción para la mayoría" (sesga decisión)
- "Balance perfecto" (sesga decisión)

---

### Constructor Visionario ($4.5M):

**✅ USAR:**
- "Máximo apalancamiento desde día uno"
- "Portafolio completo inmediato"
- "35 productos completos"
- "6 meses de tecnología"
- "Mejores márgenes de comisión" ← DATO OBJETIVO
- "Mayores porcentajes de ganancia" ← DATO OBJETIVO

**❌ NO USAR:**
- "Solo si tienes experiencia previa" (limita)
- "Para constructores avanzados" (limita)
- "Si ya conoces el negocio" (limita)
- "Requiere más experiencia" (falso y limita)

---

## PRINCIPIO RECTOR

**Cuando usuario pregunta por "mejor opción":**

1. Muestra VALOR de las 3 opciones (sin sesgar)
2. Pregunta: ¿Con cuál te identificas más? A/B/C
3. Si insiste en recomendación: VELOCIDAD > VOLUMEN

**Cuando usuario pregunta dato objetivo ("más rentable"):**

1. Constructor Visionario (dato objetivo)
2. Explica por qué: más productos + mejores márgenes
3. Pregunta: ¿Buscas márgenes o velocidad?

**Siempre recordar:**

> Un constructor que arranca HOY con Inicial construye más que uno que espera 3 meses para Visionario.

`;

// Insertar la sección después de "CAPTURA DE DATOS - REGLA DE ORO"
const updatedPrompt = currentPrompt.prompt.replace(
  /(## CAPTURA DE DATOS - REGLA DE ORO[\s\S]*?\*\*Una pregunta de captura a la vez\. No mezcles\. No apresures\.\*\*)/,
  `$1${paquetesSection}`
);

try {
  // Actualizar System Prompt en Supabase
  const { data, error } = await supabase
    .from('system_prompts')
    .update({
      prompt: updatedPrompt,
      version: 'v12.10_regla_paquetes',
      updated_at: new Date().toISOString()
    })
    .eq('name', 'nexus_main')
    .select();

  if (error) {
    console.error('❌ Error al actualizar System Prompt:', error);
    process.exit(1);
  }

  console.log('✅ System Prompt actualizado exitosamente!');
  console.log('━'.repeat(80));
  console.log('📌 Name:', data[0].name);
  console.log('📌 Version:', data[0].version);
  console.log('📌 Updated:', data[0].updated_at);
  console.log('📌 Prompt length:', data[0].prompt.length, 'caracteres');
  console.log('━'.repeat(80));
  console.log('\n✅ CAMBIOS APLICADOS:');
  console.log('1. ✅ REGLA: NO recomendar paquete específico (muestra valor, usuario decide)');
  console.log('2. ✅ CASO 1: Pregunta genérica → Mostrar 3 opciones sin sesgar');
  console.log('3. ✅ CASO 2: "Más rentable" → Visionario (dato objetivo + mejores márgenes)');
  console.log('4. ✅ CASO 3: Usuario insiste → "El que te permita arrancar YA (velocidad)"');
  console.log('5. ✅ LENGUAJE: Correcto/Incorrecto por cada paquete');
  console.log('6. ✅ DATO CLAVE: Visionario tiene mejores márgenes de comisión');
  console.log('\n⏰ IMPORTANTE: Espera 5 minutos para que cache de Anthropic se limpie');
  console.log('\n🧪 TESTING: Prueba "cuál es la mejor opción" → debe mostrar 3 opciones sin recomendar');

} catch (err) {
  console.error('❌ Error inesperado:', err);
  process.exit(1);
}
