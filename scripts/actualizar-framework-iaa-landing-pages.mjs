#!/usr/bin/env node

/**
 * Script para reemplazar "Framework IAA" en landing pages y componentes públicos
 * Objetivo: Lenguaje simple - "abuela de 75 años"
 * Alcance: Solo archivos user-facing (no técnicos como tracking.js)
 */

import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { globSync } from 'glob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Archivos a actualizar (user-facing)
const FILES_TO_UPDATE = [
  'src/app/soluciones/emprendedor-negocio/page.tsx',
  'src/app/soluciones/lider-del-hogar/page.tsx',
  'src/app/soluciones/profesional-con-vision/page.tsx',
  'src/app/soluciones/independiente-freelancer/page.tsx',
  'src/app/paquetes/page.tsx',
  'src/app/planes/page.tsx',
  'src/app/inicio-2/page.tsx',
  'src/app/sitemap.ts',
  'src/app/opengraph-image.tsx',
];

// Archivos a IGNORAR (técnicos o documentación)
const FILES_TO_IGNORE = [
  'public/tracking.js',                          // Console logs técnicos
  'src/components/nexus/NEXUSFloatingButton.tsx', // Console logs técnicos
  'src/app/sistema/framework-iaa/page.tsx',      // Página SOBRE el framework (título correcto)
  'src/app/sistema/framework-iaa-2/page.tsx',    // Página SOBRE el framework (título correcto)
  'supabase/functions/notify-stage-change/index.ts', // Edge function
  'CLAUDE.md',                                   // Documentación
  'README.md',                                   // Documentación
  '*.md',                                        // Otros docs
  'knowledge_base/*.md',                         // Knowledge base histórica
  'scripts/*.js',                                // Scripts antiguos
];

// Diccionario de reemplazos
const REEMPLAZOS = {
  // User-facing: Framework IAA → términos simples
  'El Framework IAA': 'El método probado',
  'el Framework IAA': 'el método probado',
  'Framework IAA completo': 'método completo',
  'Framework IAA y NEXUS': 'el sistema y NEXUS',

  // Contextos específicos
  'al Framework IAA': 'al método probado',
  'del Framework IAA': 'del método probado',

  // Standalone (cuidado con títulos de páginas)
  // NO reemplazar en rutas URL o nombres de componentes
};

function shouldUpdateFile(filePath) {
  // Verificar si está en la lista de ignorados
  for (const pattern of FILES_TO_IGNORE) {
    if (filePath.includes(pattern.replace('*', ''))) {
      return false;
    }
  }

  // Verificar si está en la lista de actualizar
  return FILES_TO_UPDATE.some(file => filePath.includes(file));
}

function aplicarReemplazos(contenido, filePath) {
  let contenidoActualizado = contenido;
  let cambiosRealizados = [];

  for (const [termino, reemplazo] of Object.entries(REEMPLAZOS)) {
    // Escapar caracteres especiales de regex
    const regex = new RegExp(termino.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');

    // Contar coincidencias antes
    const matchesBefore = (contenidoActualizado.match(regex) || []).length;

    if (matchesBefore > 0) {
      contenidoActualizado = contenidoActualizado.replace(regex, reemplazo);
      cambiosRealizados.push({
        termino,
        reemplazo,
        count: matchesBefore
      });
    }
  }

  return { contenidoActualizado, cambiosRealizados };
}

async function actualizarLandingPages() {
  console.log('🔄 Actualizando "Framework IAA" en landing pages...\\n');

  const projectRoot = resolve(__dirname, '..');
  let totalArchivosActualizados = 0;
  let totalCambios = 0;

  try {
    for (const relativePath of FILES_TO_UPDATE) {
      const fullPath = resolve(projectRoot, relativePath);

      try {
        const contenidoOriginal = readFileSync(fullPath, 'utf-8');
        const { contenidoActualizado, cambiosRealizados } = aplicarReemplazos(contenidoOriginal, relativePath);

        if (cambiosRealizados.length > 0) {
          writeFileSync(fullPath, contenidoActualizado, 'utf-8');

          console.log(`✅ ${relativePath}`);
          cambiosRealizados.forEach(cambio => {
            console.log(`   "${cambio.termino}" → "${cambio.reemplazo}" (${cambio.count}x)`);
            totalCambios += cambio.count;
          });
          console.log('');

          totalArchivosActualizados++;
        } else {
          console.log(`➖ ${relativePath} (sin cambios)`);
        }
      } catch (error) {
        if (error.code === 'ENOENT') {
          console.log(`⚠️  ${relativePath} (archivo no existe - OK)`);
        } else {
          console.error(`❌ Error en ${relativePath}:`, error.message);
        }
      }
    }

    console.log('\\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 RESUMEN:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\\n');
    console.log(`✅ Archivos actualizados: ${totalArchivosActualizados}`);
    console.log(`🔄 Total de reemplazos: ${totalCambios}`);
    console.log(`📝 Archivos revisados: ${FILES_TO_UPDATE.length}\\n`);

    if (totalArchivosActualizados > 0) {
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('🔄 PRÓXIMO PASO:');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\\n');
      console.log('1️⃣  Revisar cambios:');
      console.log('   git diff\\n');
      console.log('2️⃣  Commit y deploy:');
      console.log('   git add .');
      console.log('   git commit -m "🐛 fix: Actualizar Framework IAA en landing pages"');
      console.log('   git push origin main');
      console.log('   vercel --prod\\n');
    } else {
      console.log('✅ No se encontraron archivos para actualizar');
      console.log('   Todos los archivos ya usan lenguaje simple\\n');
    }

  } catch (error) {
    console.error('❌ Error general:', error.message);
    process.exit(1);
  }
}

// Ejecutar
actualizarLandingPages();
