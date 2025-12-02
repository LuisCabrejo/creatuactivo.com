#!/usr/bin/env node

/**
 * Script para actualizar lenguaje abstracto a concreto en route.ts
 * Objetivo: Hacer más específico y menos abstracto
 * Basado en feedback de Luis Cabrejo (test de analogía edificios/agricultura)
 */

import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const routeFilePath = resolve(__dirname, '../src/app/api/nexus/route.ts');

// Diccionario de reemplazos (lenguaje abstracto → lenguaje concreto)
const REEMPLAZOS = {
  // NIVEL 3 - TU TRABAJO (línea 2432-2434)
  'INICIAR: Conectas personas con el sistema': 'INICIAR: Compartes un enlace con personas que conoces',
  'ACOGER: Construyes confianza en momentos clave': 'ACOGER: Tienes una llamada cuando alguien está interesado',
  'ACTIVAR: Ayudas a otros a empezar su sistema': 'ACTIVAR: Les das acceso a la aplicación y les enseñas el primer paso',

  // FAQ_04 - INICIAR (línea 2484)
  'Conectas personas con el ecosistema usando herramientas automatizadas': 'Compartes un enlace por WhatsApp con personas que conoces',

  // FAQ_04 - ACOGER (línea 2489)
  'Aportas el toque humano cuando el sistema detecta el momento óptimo': 'Tienes una llamada de 20-30 minutos cuando alguien dice "quiero saber más"',

  // FAQ_04 - ACTIVAR (línea 2494)
  'Entregas las llaves del ecosistema a nuevos constructores': 'Les das acceso a su aplicación CreaTuActivo',
};

function aplicarReemplazos() {
  console.log('🔄 Actualizando lenguaje abstracto → concreto en route.ts...\n');

  try {
    // Leer archivo
    let contenido = readFileSync(routeFilePath, 'utf-8');
    const contenidoOriginal = contenido;

    let totalCambios = 0;

    // Aplicar cada reemplazo
    for (const [abstracto, concreto] of Object.entries(REEMPLAZOS)) {
      const regex = new RegExp(abstracto.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
      const matches = (contenido.match(regex) || []).length;

      if (matches > 0) {
        contenido = contenido.replace(regex, concreto);
        console.log(`✅ "${abstracto}"`);
        console.log(`   → "${concreto}"`);
        console.log(`   (${matches} reemplazo${matches > 1 ? 's' : ''})\n`);
        totalCambios += matches;
      }
    }

    if (totalCambios === 0) {
      console.log('⚠️  No se encontraron cambios para aplicar');
      console.log('   El archivo ya podría estar actualizado\n');
      return;
    }

    // Escribir archivo actualizado
    writeFileSync(routeFilePath, contenido, 'utf-8');

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ ACTUALIZACIÓN EXITOSA');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log(`📌 Archivo: src/app/api/nexus/route.ts`);
    console.log(`📊 Total de reemplazos: ${totalCambios}\n`);

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📋 CAMBIOS REALIZADOS:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('✅ NIVEL 3 - TU TRABAJO (FAQ pre-cargadas):');
    console.log('   INICIAR → "Compartes un enlace"');
    console.log('   ACOGER → "Tienes una llamada"');
    console.log('   ACTIVAR → "Les das acceso a la aplicación"\n');
    console.log('✅ FAQ_04 - Acciones detalladas:');
    console.log('   INICIAR → "Compartes enlace por WhatsApp"');
    console.log('   ACOGER → "Llamada de 20-30 minutos"');
    console.log('   ACTIVAR → "Das acceso a aplicación"\n');

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🔄 PRÓXIMO PASO:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('1️⃣  Revisar cambios:');
    console.log('   git diff src/app/api/nexus/route.ts\n');
    console.log('2️⃣  Commit y deploy:');
    console.log('   git add src/app/api/nexus/route.ts');
    console.log('   git commit -m "🐛 fix(nexus): Lenguaje concreto en FAQ (abstracto → específico)"');
    console.log('   git push origin main');
    console.log('   vercel --prod\n');
    console.log('3️⃣  Probar NEXUS:');
    console.log('   Preguntar: "¿Qué tengo que hacer?"');
    console.log('   Verificar: Debe decir "Compartes un enlace" (no "Conectas personas")\n');

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 IMPACTO ESPERADO:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('✅ Menos abstracto: "sistema/herramientas" → "enlace/aplicación"');
    console.log('✅ Más específico: "momentos clave" → "llamada de 20-30 min"');
    console.log('✅ Más accionable: "entregas llaves" → "das acceso a aplicación"');
    console.log('✅ Test analogía: Si funciona para edificios/agricultura, funciona aquí\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Ejecutar
aplicarReemplazos();
