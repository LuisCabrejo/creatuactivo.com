#!/usr/bin/env node
/**
 * Script para encontrar la tabla correcta que contiene los nombres
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

async function encontrarTabla() {
  console.log('🔍 Buscando tablas con columna "name"...\n')

  // Query para encontrar todas las tablas con columna 'name'
  const { data, error } = await supabase
    .from('information_schema.columns')
    .select('table_name, column_name, data_type')
    .eq('table_schema', 'public')
    .eq('column_name', 'name')

  if (error) {
    console.log('⚠️  No se puede acceder a information_schema directamente')
    console.log('Intentando con tablas conocidas...\n')

    // Listar tablas conocidas y ver cuál tiene datos
    const tablasConocidas = [
      'prospects',
      'prospect_data',
      'prospect_captured_data',
      'nexus_conversations',
      'constructors'
    ]

    for (const tabla of tablasConocidas) {
      console.log(`📋 Probando tabla: ${tabla}`)

      // Intentar seleccionar con name
      const { data: sample, error: sampleError } = await supabase
        .from(tabla)
        .select('*')
        .limit(5)

      if (!sampleError && sample && sample.length > 0) {
        console.log(`   ✅ Tabla accesible: ${tabla}`)
        console.log(`   📊 ${sample.length} registros de muestra:\n`)

        // Mostrar campos disponibles
        const campos = Object.keys(sample[0])
        console.log(`   Campos: ${campos.join(', ')}`)

        // Mostrar valores de name si existe
        sample.forEach((row, i) => {
          if (row.name) {
            console.log(`   ${i + 1}. ID: ${row.id || '?'} | name: "${row.name}"`)
          }
        })
        console.log()
      } else if (sampleError) {
        console.log(`   ❌ Error: ${sampleError.message}`)
      } else {
        console.log(`   ⚠️  Vacía`)
      }
      console.log()
    }
    return
  }

  console.log('📊 Tablas encontradas con columna "name":\n')
  data.forEach(row => {
    console.log(`  - ${row.table_name} (${row.data_type})`)
  })
}

encontrarTabla()
