#!/usr/bin/env node
/**
 * Script para actualizar nombres usando SQL directo
 * Actualiza prospect_data que es la tabla correcta
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

const supabase = createClient(supabaseUrl, supabaseKey)

async function actualizar() {
  console.log('🔧 Actualizando nombres en prospect_data...\n')

  // Primero, listar todos los nombres actuales
  const { data: todos, error: errorListar } = await supabase
    .rpc('get_prospects_with_data')

  if (errorListar) {
    console.log('⚠️  RPC no disponible, intentando query directa...\n')

    // Intentar actualizar directamente por fingerprint conocidos
    const correcciones = [
      {
        nombreActual: 'visionario',
        nombreNuevo: 'Ricardo Méndez',
        email: null,
        phone: '3214532455'
      },
      {
        nombreActual: 'Deseo',
        nombreNuevo: 'Carolina Ramírez',
        email: 'carlosballen@gmail.com',
        phone: '3215674532'
      },
      {
        nombreActual: 'de nuevo',
        nombreNuevo: 'Felipe Torres',
        email: null,
        phone: '3213457902'
      }
    ]

    for (const corr of correcciones) {
      // Buscar por teléfono si está disponible
      if (corr.phone) {
        const { data, error } = await supabase
          .from('prospect_data')
          .select('id, name, phone')
          .eq('phone', corr.phone)

        if (!error && data && data.length > 0) {
          console.log(`✅ Encontrado por phone ${corr.phone}: "${data[0].name}"`)

          const { error: updateError } = await supabase
            .from('prospect_data')
            .update({ name: corr.nombreNuevo })
            .eq('id', data[0].id)

          if (updateError) {
            console.error(`   ❌ Error actualizando: ${updateError.message}`)
          } else {
            console.log(`   ✅ Actualizado: "${data[0].name}" → "${corr.nombreNuevo}"`)
          }
        }
      }

      // También buscar por email si está disponible
      if (corr.email) {
        const { data, error } = await supabase
          .from('prospect_data')
          .select('id, name, email')
          .eq('email', corr.email)

        if (!error && data && data.length > 0) {
          console.log(`✅ Encontrado por email ${corr.email}: "${data[0].name}"`)

          const { error: updateError } = await supabase
            .from('prospect_data')
            .update({ name: corr.nombreNuevo })
            .eq('id', data[0].id)

          if (updateError) {
            console.error(`   ❌ Error actualizando: ${updateError.message}`)
          } else {
            console.log(`   ✅ Actualizado: "${data[0].name}" → "${corr.nombreNuevo}"`)
          }
        }
      }
    }
  }

  console.log('\n✅ Proceso completado')
  console.log('💡 Refresca https://app.creatuactivo.com/mi-sistema-iaa')
}

actualizar()
