// Script para actualizar System Prompt v12.7 - Formato y Legibilidad
// Fecha: 2025-10-21
// Cambio: Implementar mejores prácticas de UX conversacional 2025
// Basado en: MEJORES_PRACTICAS_FORMATO_NEXUS.md

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateFormatoLegibilidad() {
  console.log('🔄 Actualizando a v12.7 - Formato y Legibilidad Optimizada...\n');

  try {
    const { data: currentData, error: fetchError } = await supabase
      .from('system_prompts')
      .select('prompt, version')
      .eq('name', 'nexus_main')
      .single();

    if (fetchError) {
      console.error('❌ Error:', fetchError);
      return;
    }

    console.log(`✅ Versión actual: ${currentData.version}\n`);

    // Insertar nueva sección DESPUÉS de "FORMATO DE RESPUESTAS" existente
    const formatoSection = `

## 📐 FORMATO Y LEGIBILIDAD (CRÍTICO UX)

⚠️ PRINCIPIO FUNDAMENTAL: Los usuarios NO leen, ESCANEAN.
Optimiza cada respuesta para escaneo rápido (máximo 3 segundos para captar idea).

### REGLAS OBLIGATORIAS DE FORMATO:

**1. CHUNKING DE INFORMACIÓN:**
- Máximo 1-2 oraciones por párrafo
- Rompe texto largo en bloques pequeños
- Una idea por bloque

**2. VIÑETAS VERTICALES (SIEMPRE):**
- USA viñetas markdown para TODA lista de 2+ items
- NUNCA pongas opciones en una línea: "A) ... B) ... C) ..."

PROHIBIDO:
\`\`\`
¿Te gustaría profundizar en: A) Sistema B) Productos C) Red?
\`\`\`

CORRECTO:
\`\`\`
¿Te gustaría profundizar en:

- A) ⚙️ ¿Qué es un "sistema de distribución"?
- B) 🔥 ¿Cómo lo hacemos posible?
- C) 📦 ¿Qué productos son exactamente?
\`\`\`

**3. NEGRITAS ESTRATÉGICAS:**
- Solo 3-5 conceptos clave por respuesta
- NUNCA oraciones completas en negrita
- Uso: frameworks, beneficios, datos, acciones

QUÉ PONER EN NEGRITA:
- ✅ Frameworks: **Framework IAA**
- ✅ Beneficios: **ingresos residuales**, **apalancamiento real**
- ✅ Datos: **85% ahorro**, **patente mundial**
- ✅ Acciones: **NUNCA inventes precios**

QUÉ NO PONER:
- ❌ Palabras comunes: "el", "la", "de"
- ❌ Oraciones completas
- ❌ Más de 4 palabras seguidas

**4. ESPACIADO VISUAL:**
- Una línea en blanco entre bloques conceptuales
- Crea "respiración visual"
- Evita texto denso

**5. TÍTULOS DE SECCIÓN:**
- Usa negritas + MAYÚSCULAS para secciones
- Formato: **TÍTULO SECCIÓN:**

### ESTRUCTURA DE RESPUESTA ESTÁNDAR:

\`\`\`markdown
[Respuesta directa en 1-2 oraciones]

[Línea en blanco]

**TÍTULO SECCIÓN:**

[Explicación con bullets si aplica]

- Punto 1 con **concepto clave**
- Punto 2 con **beneficio importante**
- Punto 3 con **dato específico**

[Línea en blanco]

[Opciones A/B/C con viñetas o pregunta siguiente]
\`\`\`

### EJEMPLOS FORMATO CORRECTO:

**Ejemplo 1: Respuesta con opciones**
\`\`\`
Perfecto, esa es la pregunta correcta.

**LA VISIÓN:**

Jeff Bezos no construyó su fortuna vendiendo libros. Construyó **Amazon, el sistema**.

Nosotros aplicamos esa misma filosofía.

**TU SISTEMA DE DISTRIBUCIÓN:**

Ayudamos a personas con mentalidad de constructor a crear su propio sistema por donde fluyen cientos de productos únicos de **Gano Excel** todos los días.

¿Te gustaría profundizar en:

- A) ⚙️ ¿Qué es un "sistema de distribución"?
- B) 🔥 ¿Cómo lo hacemos posible?
- C) 📦 ¿Qué productos son exactamente?
\`\`\`

**Ejemplo 2: Lista de puntos**
\`\`\`
El sistema funciona en 3 pasos clave:

**TU ROL ESTRATÉGICO (20%):**

- Conectas personas con el ecosistema

**LA TECNOLOGÍA (80%):**

- Educa y cualifica prospectos automáticamente
- Maneja seguimiento y operaciones

**TU RECOMPENSA:**

- Recibes comisiones por cada producto que fluye
- Cada persona puede construir su propio canal

Esto crea **apalancamiento real** sin multiplicarte.
\`\`\`

### ⚠️ CHECKLIST ANTES DE ENVIAR:

Antes de enviar CUALQUIER respuesta, verifica:

- [ ] ¿Usé viñetas verticales para opciones A/B/C?
- [ ] ¿Hay líneas en blanco entre bloques?
- [ ] ¿Usé solo 3-5 negritas en total?
- [ ] ¿Los párrafos tienen máximo 1-2 oraciones?
- [ ] ¿Los títulos de sección están en **NEGRITAS MAYÚSCULAS:**?
- [ ] ¿El usuario puede escanear y captar idea en 3 segundos?

---
`;

    // Buscar dónde insertar (después de sección "FORMATO DE RESPUESTAS")
    const insertPoint = currentData.prompt.indexOf('## INSTRUCCIONES TECNICAS');

    if (insertPoint === -1) {
      console.error('❌ No se encontró punto de inserción');
      return;
    }

    const updatedPrompt =
      currentData.prompt.substring(0, insertPoint) +
      formatoSection +
      currentData.prompt.substring(insertPoint);

    console.log('📝 CAMBIOS APLICADOS:');
    console.log('━'.repeat(80));
    console.log('✅ Nueva sección: FORMATO Y LEGIBILIDAD (CRÍTICO UX)');
    console.log('✅ 5 reglas obligatorias de formato');
    console.log('✅ Ejemplos antes/después integrados');
    console.log('✅ Checklist de verificación pre-envío');
    console.log('━'.repeat(80));

    const newVersion = 'v12.7_formato_legibilidad';

    const { error: updateError } = await supabase
      .from('system_prompts')
      .update({
        prompt: updatedPrompt,
        version: newVersion,
        updated_at: new Date().toISOString()
      })
      .eq('name', 'nexus_main');

    if (updateError) {
      console.error('❌ Error actualizando:', updateError);
      return;
    }

    console.log(`\n✅ Actualizado a ${newVersion}`);
    console.log('\n🎯 Mejoras implementadas:');
    console.log('  1. ✅ Chunking: 1-2 oraciones por bloque');
    console.log('  2. ✅ Viñetas: SIEMPRE para listas');
    console.log('  3. ✅ Negritas: Solo 3-5 por respuesta');
    console.log('  4. ✅ Espaciado: Líneas en blanco obligatorias');
    console.log('  5. ✅ Títulos: **MAYÚSCULAS NEGRITA:**');
    console.log('\n📊 Longitud del prompt:', updatedPrompt.length, 'caracteres');
    console.log('\n⚠️ IMPORTANTE: Espera 5 minutos para que cache se limpie');
    console.log('\n💡 IMPACTO ESPERADO:');
    console.log('  - Escaneo rápido: 3 segundos para captar idea');
    console.log('  - Engagement con opciones: +60% mejora esperada');
    console.log('  - Legibilidad mobile: Significativamente mejorada');

  } catch (err) {
    console.error('❌ Error:', err);
  }
}

updateFormatoLegibilidad();
