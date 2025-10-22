// Script para actualizar iconos de arquetipos: emojis → vectoriales
// Fecha: 2025-10-21
// Cambio: Alinear con branding CreaTuActivo (iconos vectoriales monocromáticos)

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateIconosVectoriales() {
  console.log('🔄 Actualizando a v12.6 - Iconos Vectoriales Branding...\n');

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

    let updatedPrompt = currentData.prompt;

    // Mapeo de cambios (emojis coloridos → iconos vectoriales del branding)
    const replacements = [
      // Emprendedor: 🎯 → 📱 (como en /soluciones/emprendedor-negocio)
      {
        old: 'B) 🎯 Emprendedor y Dueno de Negocio:',
        new: 'B) 📱 Emprendedor y Dueno de Negocio:',
        name: 'Emprendedor'
      },
      // Joven: 📊 → 🎓 (como en /soluciones/joven-con-ambicion)
      {
        old: 'F) 📊 Joven con Ambicion:',
        new: 'F) 🎓 Joven con Ambicion:',
        name: 'Joven con Ambición'
      },
      // Nota: 💼 💡 🏠 👥 ya son vectoriales monocromáticos y coinciden con el branding
    ];

    replacements.forEach(({ old, new: newText, name }) => {
      if (updatedPrompt.includes(old)) {
        updatedPrompt = updatedPrompt.replace(old, newText);
        console.log(`  ✅ ${name}: ${old.substring(3, 5)} → ${newText.substring(3, 5)}`);
      }
    });

    console.log('\n📝 CAMBIOS APLICADOS:');
    console.log('━'.repeat(80));
    console.log('✅ Alineado con branding CreaTuActivo');
    console.log('✅ Iconos vectoriales monocromáticos');
    console.log('✅ Consistencia con navegación del sitio');
    console.log('━'.repeat(80));

    const newVersion = 'v12.6_iconos_vectoriales';

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
    console.log('\n🎯 Arquetipos actualizados:');
    console.log('  A) 💼 Profesional con Visión (sin cambio - ya vectorial)');
    console.log('  B) 📱 Emprendedor y Dueño de Negocio (🎯 → 📱)');
    console.log('  C) 💡 Independiente y Freelancer (sin cambio - ya vectorial)');
    console.log('  D) 🏠 Líder del Hogar (sin cambio - ya vectorial)');
    console.log('  E) 👥 Líder de la Comunidad (sin cambio - ya vectorial)');
    console.log('  F) 🎓 Joven con Ambición (📊 → 🎓)');
    console.log('\n📊 Longitud del prompt:', updatedPrompt.length, 'caracteres');
    console.log('\n⚠️ IMPORTANTE: Espera 5 minutos para que cache se limpie');

  } catch (err) {
    console.error('❌ Error:', err);
  }
}

updateIconosVectoriales();
