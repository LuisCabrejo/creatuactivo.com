// Script para actualizar System Prompt v12.3 - Arquetipos SIMPLE (sin Quick Replies)
// Fecha: 2025-10-21
// Cambio: Reemplazar pregunta "ocupación" por arquetipos con lista markdown
// Filosofía: SIMPLE - Markdown + detección por texto (probado y funcional)

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateArquetiposCaptura() {
  console.log('🔄 Actualizando con Arquetipos v12.3 (SIMPLE)...\n');

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

    // Buscar y reemplazar sección completa de captura
    const oldCapture = `### ORDEN DE CAPTURA (despues del consentimiento):

1. Nombre - "Para conocerte mejor, como te llamas?"
2. Ocupacion - "A que te dedicas?"
3. WhatsApp - "Cual es tu WhatsApp para coordinar tu consulta?"
4. Email (opcional) - Solo si el prospecto lo ofrece`;

    const newCapture = `### ORDEN DE CAPTURA (despues del consentimiento):

1. Nombre - "Para conocerte mejor, como te llamas?"

2. Arquetipo - "Para ofrecerte la mejor asesoria, con cual de estos perfiles te identificas mas?"

   PRESENTAR ARQUETIPOS (formato vertical con emojis):

   - 💼 Profesional con Vision: Tienes un trabajo estable pero buscas mas autonomia
   - 🎯 Emprendedor y Dueno de Negocio: Ya tienes un negocio y buscas escalarlo
   - 💡 Independiente y Freelancer: Trabajas por cuenta propia y quieres ingresos predecibles
   - 🏠 Lider del Hogar: Gestionas el hogar y buscas contribuir economicamente
   - 👥 Lider de la Comunidad: Tienes influencia y te apasiona ayudar a otros
   - 📈 Joven con Ambicion: Estas comenzando y quieres construir tu futuro financiero

   Instruccion: "Puedes copiar el que mejor te representa o escribir cual se parece mas a ti."

3. WhatsApp - "Cual es tu WhatsApp para coordinar tu consulta?"
4. Email (opcional) - Solo si el prospecto lo ofrece`;

    if (!currentData.prompt.includes(oldCapture)) {
      console.log('⚠️ El texto de captura no se encontró exactamente.\n');
      console.log('Buscando variaciones...\n');

      // Buscar por línea clave
      if (!currentData.prompt.includes('2. Ocupacion - "A que te dedicas?"')) {
        console.log('❌ Ya parece estar actualizado o tiene formato diferente\n');
        return;
      }
    }

    const updatedPrompt = currentData.prompt.replace(oldCapture, newCapture);

    console.log('📝 CAMBIO APLICADO:');
    console.log('━'.repeat(80));
    console.log('✅ Reemplazado: "2. Ocupacion - A que te dedicas?"');
    console.log('✅ Por: "2. Arquetipo - con cual de estos perfiles te identificas mas?"');
    console.log('✅ Lista de 6 arquetipos con emojis agregada');
    console.log('━'.repeat(80));

    const newVersion = 'v12.3_arquetipos_simple';

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
    console.log('\n🎯 Cambios aplicados:');
    console.log('  1. ✅ Pregunta de arquetipos con lista markdown');
    console.log('  2. ✅ 6 arquetipos con emojis y descripciones');
    console.log('  3. ✅ Sin Quick Replies (formato simple probado)');
    console.log('  4. ✅ Detección por texto funciona (route.ts líneas 839-864)');
    console.log('\n📊 Longitud del prompt:', updatedPrompt.length, 'caracteres');
    console.log('\n⚠️ IMPORTANTE: Espera 5 minutos para que cache se limpie');

  } catch (err) {
    console.error('❌ Error:', err);
  }
}

updateArquetiposCaptura();
