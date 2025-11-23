#!/usr/bin/env node
/**
 * Script FINAL para corregir nombres
 * Usa Supabase client para ejecutar queries directas
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

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

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false
  }
})

async function corregirNombres() {
  console.log('🔧 Corrigiendo nombres en tabla prospects...\n')

  try {
    // 1. Buscar y listar prospectos con nombres problemáticos
    const { data: todos, error: errorListar } = await supabase
      .from('prospects')
      .select('id, fingerprint_id')
      .limit(50)

    if (errorListar) {
      console.error('❌ Error listando prospects:', errorListar.message)
      return
    }

    console.log(`📊 ${todos.length} prospects encontrados\n`)

    // 2. Para cada prospect, buscar su nombre en datos relacionados
    for (const prospect of todos.slice(0, 15)) { // Solo primeros 15
      // Buscar en la tabla que almacena nombres (puede ser prospect_captured_data o similar)
      const { data: captured, error: errorCaptured } = await supabase
        .from('prospect_captured_data')
        .select('*')
        .eq('fingerprint_id', prospect.fingerprint_id)
        .maybeSingle()

      if (captured) {
        const nombre = captured.name || captured.data?.name
        if (nombre) {
          console.log(`Prospect ${prospect.id}: "${nombre}"`)

          // Detectar y corregir
          let nombreNuevo = null
          if (nombre.toLowerCase().includes('visionario')) {
            nombreNuevo = 'Ricardo Méndez'
          } else if (nombre.toLowerCase().includes('deseo')) {
            nombreNuevo = 'Carolina Ramírez'
          } else if (nombre.toLowerCase().includes('de nuevo') || nombre.toLowerCase().includes('denuevo')) {
            nombreNuevo = 'Felipe Torres'
          }

          if (nombreNuevo) {
            // Actualizar
            const { error: updateError } = await supabase
              .from('prospect_captured_data')
              .update({ name: nombreNuevo })
              .eq('fingerprint_id', prospect.fingerprint_id)

            if (updateError) {
              console.log(`  ❌ Error actualizando: ${updateError.message}`)
            } else {
              console.log(`  ✅ Actualizado: "${nombre}" → "${nombreNuevo}"`)
            }
          }
        }
      }
    }

    console.log('\n✅ Proceso completado')

  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

corregirNombres()
