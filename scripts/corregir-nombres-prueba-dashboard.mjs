#!/usr/bin/env node
/**
 * Script para corregir nombres de prueba en Dashboard
 *
 * Problema: Nombres capturados incorrectamente como "visionario", "Deseo", "de nuevo"
 * Solución: Actualizar a nombres realistas para video demo
 *
 * Fecha: 22 Nov 2025
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Leer .env.local manualmente
const envPath = join(__dirname, '../.env.local')
const envFile = readFileSync(envPath, 'utf8')
const envVars = {}
envFile.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/)
  if (match) {
    envVars[match[1]] = match[2]
  }
})

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = envVars.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Faltan variables de entorno')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// Mapeo de correcciones: nombre_actual → nombre_correcto
const correcciones = {
  'visionario': 'Ricardo Méndez',
  'Deseo': 'Carolina Ramírez',
  'de nuevo': 'Felipe Torres'
}

async function corregirNombres() {
  console.log('🔧 Corrigiendo nombres de prueba en Dashboard...\n')

  for (const [nombreIncorrecto, nombreCorrecto] of Object.entries(correcciones)) {
    console.log(`📝 Buscando: "${nombreIncorrecto}"`)

    // Buscar prospect_data con nombre incorrecto
    const { data: prospectos, error: errorBuscar } = await supabase
      .from('prospect_data')
      .select('id, name, email, phone')
      .ilike('name', nombreIncorrecto)

    if (errorBuscar) {
      console.error(`   ❌ Error buscando "${nombreIncorrecto}":`, errorBuscar.message)
      continue
    }

    if (!prospectos || prospectos.length === 0) {
      console.log(`   ⚠️  No encontrado: "${nombreIncorrecto}"`)
      continue
    }

    console.log(`   ✅ Encontrado ${prospectos.length} registro(s)`)

    // Actualizar cada uno
    for (const prospecto of prospectos) {
      const { error: errorActualizar } = await supabase
        .from('prospect_data')
        .update({ name: nombreCorrecto })
        .eq('id', prospecto.id)

      if (errorActualizar) {
        console.error(`   ❌ Error actualizando ID ${prospecto.id}:`, errorActualizar.message)
      } else {
        console.log(`   ✅ Actualizado: "${nombreIncorrecto}" → "${nombreCorrecto}" (ID: ${prospecto.id})`)
      }
    }
    console.log()
  }

  // También actualizar "Sin nombre" a nombres realistas
  console.log('📝 Buscando prospectos "Sin nombre"...')

  const { data: sinNombre, error: errorSinNombre } = await supabase
    .from('prospect_data')
    .select('id, email, phone')
    .is('name', null)
    .limit(5)

  if (errorSinNombre) {
    console.error('❌ Error buscando sin nombre:', errorSinNombre.message)
  } else if (sinNombre && sinNombre.length > 0) {
    console.log(`   ✅ Encontrados ${sinNombre.length} sin nombre\n`)

    const nombresGenericos = [
      'Sandra López',
      'Miguel Ángel García',
      'Patricia Ruiz',
      'Andrés Vargas',
      'Camila Martínez'
    ]

    for (let i = 0; i < sinNombre.length && i < nombresGenericos.length; i++) {
      const prospecto = sinNombre[i]
      const nombreNuevo = nombresGenericos[i]

      const { error } = await supabase
        .from('prospect_data')
        .update({ name: nombreNuevo })
        .eq('id', prospecto.id)

      if (error) {
        console.error(`   ❌ Error actualizando ID ${prospecto.id}:`, error.message)
      } else {
        console.log(`   ✅ Asignado: "${nombreNuevo}" (ID: ${prospecto.id})`)
      }
    }
  }

  console.log('\n✅ Corrección completada!')
  console.log('💡 Refresca el dashboard para ver los cambios')
}

corregirNombres()
