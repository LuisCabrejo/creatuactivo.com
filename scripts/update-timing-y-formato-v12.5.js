// Script para actualizar System Prompt v12.5 - Timing y Formato Optimizado
// Fecha: 2025-10-21
// Cambio: Mejorar timing de captura + formato de arquetipos

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateTimingYFormato() {
  console.log('🔄 Actualizando a v12.5 - Timing y Formato Optimizado...\n');

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

    // Reemplazar sección completa de captura
    const oldSection = `**PASO 1: CAPTURA DE NOMBRE (con propuesta de valor)**

Despues de que el usuario acepte el consentimiento y tu respondas su primera consulta, captura el nombre asi:

"Para personalizar tu asesoria y darte las mejores recomendaciones segun tu situacion, como te llamas?"

⚠️ IMPORTANTE:
- Solo UNA pregunta en este mensaje (nombre)
- NO preguntes arquetipo todavia
- Enfatiza el BENEFICIO (asesoria personalizada)

---

**PASO 2: CAPTURA DE ARQUETIPO (con viñetas con letras)**

Una vez tengas el nombre, en tu SIGUIENTE mensaje (despues de confirmar el nombre y responder su consulta), presenta los arquetipos asi:

"Perfecto [NOMBRE]. Para ofrecerte la asesoria mas relevante para tu situacion, con cual de estos perfiles te identificas mas?

A) 💼 Profesional con Vision: Tienes un trabajo estable pero buscas mas autonomia
B) 🎯 Emprendedor y Dueno de Negocio: Ya tienes un negocio y buscas escalarlo
C) 💡 Independiente y Freelancer: Trabajas por cuenta propia y quieres ingresos predecibles
D) 🏠 Lider del Hogar: Gestionas el hogar y buscas contribuir economicamente
E) 👥 Lider de la Comunidad: Tienes influencia y te apasiona ayudar a otros
F) 📈 Joven con Ambicion: Estas comenzando y quieres construir tu futuro financiero

Puedes responder con la letra (A, B, C...) o copiar el perfil completo."

⚠️ IMPORTANTE:
- USA VIÑETAS CON LETRAS (A, B, C, D, E, F)
- Facilita respuesta rapida del usuario (solo escribir una letra)
- Confirma el nombre antes de hacer esta pregunta
- Enfatiza el BENEFICIO (asesoria mas relevante)`;

    const newSection = `**PASO 1: CAPTURA DE NOMBRE (timing correcto)**

⚠️ TIMING CRÍTICO - Captura el nombre SOLO cuando:
1. Usuario ha hecho 1-2 preguntas básicas (está enganchado)
2. ANTES de ofrecer opciones de profundización A/B/C
3. NUNCA después de opciones múltiples (interrumpe flujo)

Ejemplo CORRECTO:
Usuario: "¿Cómo funciona el negocio?"
NEXUS: [Responde con explicación clara]
       "Para personalizar tu asesoría, ¿cómo te llamas?"

Ejemplo INCORRECTO:
Usuario: "¿Cómo funciona?"
NEXUS: [Responde]
       "¿Te gustaría profundizar en: A) Sistema B) Productos C) Red?"
       "Por cierto, ¿cómo te llamas?" ← ❌ MAL TIMING

Formato de pregunta:
"Para personalizar tu asesoría y darte las mejores recomendaciones, ¿cómo te llamas?"

---

**PASO 2: CAPTURA DE ARQUETIPO (formato legible)**

Una vez tengas el nombre, en tu SIGUIENTE mensaje presenta los arquetipos así:

"Perfecto [NOMBRE]. Para ofrecerte la asesoría más relevante, ¿con cuál de estos perfiles te identificas más?

- A) 💼 Profesional con Visión: Tienes un trabajo estable pero buscas más autonomía
- B) 🎯 Emprendedor y Dueño de Negocio: Ya tienes un negocio y buscas escalarlo
- C) 💡 Independiente y Freelancer: Trabajas por cuenta propia y quieres ingresos predecibles
- D) 🏠 Líder del Hogar: Gestionas el hogar y buscas contribuir económicamente
- E) 👥 Líder de la Comunidad: Tienes influencia y te apasiona ayudar a otros
- F) 📈 Joven con Ambición: Estás comenzando y quieres construir tu futuro financiero

Puedes responder con la letra (A, B, C...)"

⚠️ FORMATO OBLIGATORIO:
- USA VIÑETAS MARKDOWN: "- A) ..." (con guion al inicio)
- NUNCA todo en una línea (ilegible)
- Instrucción corta: "Puedes responder con la letra (A, B, C...)"
- NO agregues: "o copiar el perfil completo" (redundante)`;

    if (!currentData.prompt.includes('PASO 1: CAPTURA DE NOMBRE')) {
      console.log('⚠️ Sección no encontrada\n');
      return;
    }

    const updatedPrompt = currentData.prompt.replace(oldSection, newSection);

    console.log('📝 CAMBIOS APLICADOS:');
    console.log('━'.repeat(80));
    console.log('✅ Timing corregido: nombre ANTES de opciones A/B/C');
    console.log('✅ Formato legible: viñetas markdown (- A) ...)');
    console.log('✅ Instrucción simplificada: solo "letra (A, B, C...)"');
    console.log('━'.repeat(80));

    const newVersion = 'v12.5_timing_formato_optimizado';

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
    console.log('\n🎯 Mejoras críticas:');
    console.log('  1. ✅ Timing de nombre: ANTES de opciones profundización');
    console.log('  2. ✅ Arquetipos en viñetas verticales (legibles)');
    console.log('  3. ✅ Instrucción corta y clara');
    console.log('\n📊 Longitud del prompt:', updatedPrompt.length, 'caracteres');
    console.log('\n⚠️ IMPORTANTE: Espera 5 minutos para que cache se limpie');

  } catch (err) {
    console.error('❌ Error:', err);
  }
}

updateTimingYFormato();
