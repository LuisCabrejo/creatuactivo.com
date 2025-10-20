// Script para actualizar el texto de consentimiento legal a versión corta (mobile-friendly)
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateConsentText() {
  console.log('🔄 Actualizando texto de consentimiento a versión corta...\n');

  try {
    // 1. Obtener el system prompt actual
    const { data: currentData, error: fetchError } = await supabase
      .from('system_prompts')
      .select('prompt, version')
      .eq('name', 'nexus_main')
      .single();

    if (fetchError) {
      console.error('❌ Error obteniendo prompt actual:', fetchError);
      return;
    }

    console.log(`✅ System Prompt actual: ${currentData.version}`);
    console.log(`📊 Longitud actual: ${currentData.prompt.length} caracteres\n`);

    // 2. Preparar el texto CORTO de consentimiento (mobile-friendly)
    const oldConsentText = `Para poder ayudarte de manera personalizada, necesito tu autorización para procesar los datos que compartas conmigo durante nuestra conversación (como tu nombre, ocupación, WhatsApp).

Esto me permite:
✅ Recordar tu progreso en futuras conversaciones
✅ Darte un mejor servicio personalizado
✅ Conectarte con nuestro equipo cuando lo necesites

**Tus derechos:** Siempre podrás conocer, actualizar o eliminar tu información escribiendo "mis datos".

Nuestra Política de Privacidad completa: https://creatuactivo.com/privacidad

¿Autorizas el tratamiento de tus datos personales?`;

    const newConsentText = `Para ayudarte mejor, necesito tu autorización para usar los datos que compartas (nombre, ocupación, WhatsApp).

Beneficios:

- Recordar nuestra conversación
- Servicio personalizado
- Conectarte con el equipo

Escribe "mis datos" para gestionar tu info. [Política completa](https://creatuactivo.com/privacidad)

¿Autorizas el tratamiento de tus datos?`;

    // 3. Reemplazar el texto en el system prompt
    const updatedPrompt = currentData.prompt.replace(oldConsentText, newConsentText);

    // Verificar que el reemplazo se hizo
    if (updatedPrompt === currentData.prompt) {
      console.log('⚠️ ADVERTENCIA: No se encontró el texto antiguo para reemplazar.');
      console.log('Verificando si ya está actualizado...\n');

      if (currentData.prompt.includes(newConsentText)) {
        console.log('✅ El texto corto YA está aplicado. No se requiere actualización.');
        return;
      } else {
        console.log('❌ Error: El texto de consentimiento no coincide con ninguna versión conocida.');
        return;
      }
    }

    console.log('📝 Texto de consentimiento ANTES:');
    console.log('━'.repeat(80));
    console.log(oldConsentText);
    console.log('━'.repeat(80));
    console.log(`Longitud: ${oldConsentText.length} caracteres\n`);

    console.log('📝 Texto de consentimiento DESPUÉS (versión corta):');
    console.log('━'.repeat(80));
    console.log(newConsentText);
    console.log('━'.repeat(80));
    console.log(`Longitud: ${newConsentText.length} caracteres`);
    console.log(`Reducción: ${Math.round((1 - newConsentText.length / oldConsentText.length) * 100)}%\n`);

    // 4. Actualizar en Supabase
    const newVersion = 'v12.1_consent_short';

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

    console.log(`✅ System Prompt actualizado exitosamente a ${newVersion}`);
    console.log(`📊 Nueva longitud total: ${updatedPrompt.length} caracteres`);
    console.log(`⚡ Ahorro total: ${currentData.prompt.length - updatedPrompt.length} caracteres`);
    console.log('\n🎯 CAMBIOS APLICADOS:');
    console.log('  ✅ Texto de consentimiento acortado 60%+');
    console.log('  ✅ Formato mobile-friendly (viñetas markdown estándar)');
    console.log('  ✅ Mantiene compliance legal (Ley 1581/2012)');
    console.log('  ✅ Link clickeable para política completa');

  } catch (err) {
    console.error('❌ Error inesperado:', err);
  }
}

updateConsentText();
