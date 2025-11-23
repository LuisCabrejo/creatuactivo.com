#!/usr/bin/env node
/**
 * Script para actualizar nombres usando SQL directo
 * Este script actualiza CUALQUIER tabla que tenga columna 'name'
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

async function actualizarSQL() {
  console.log('🔧 Actualizando nombres con SQL directo...\n')

  // Lista de correcciones
  const correcciones = [
    { actual: 'visionario', nuevo: 'Ricardo Méndez' },
    { actual: 'Deseo', nuevo: 'Carolina Ramírez' },
    { actual: 'de nuevo', nuevo: 'Felipe Torres' }
  ]

  for (const { actual, nuevo } of correcciones) {
    console.log(`📝 Buscando "${actual}"...`)

    // Ejecutar SQL directo para actualizar
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: `
        UPDATE prospects
        SET name = '${nuevo}'
        WHERE LOWER(name) LIKE '%${actual.toLowerCase()}%'
        RETURNING id, name;
      `
    })

    if (error) {
      // Si la función RPC no existe, mostrar instrucciones manuales
      console.log(`   ⚠️  No se puede ejecutar SQL automáticamente`)
      console.log(`   📋 Ejecuta esto manualmente en Supabase SQL Editor:`)
      console.log(`      UPDATE prospects SET name = '${nuevo}' WHERE LOWER(name) LIKE '%${actual.toLowerCase()}%';`)
      console.log()
      continue
    }

    if (data && data.length > 0) {
      console.log(`   ✅ Actualizado ${data.length} registro(s)`)
      data.forEach(row => {
        console.log(`      ID: ${row.id} → "${row.name}"`)
      })
    } else {
      console.log(`   ℹ️  No encontrado`)
    }
    console.log()
  }

  console.log('\n📋 INSTRUCCIONES MANUALES:')
  console.log('Si no funcionó automáticamente, ve a Supabase Dashboard → SQL Editor y ejecuta:\n')
  console.log(`-- Corregir "visionario"`)
  console.log(`UPDATE prospects SET name = 'Ricardo Méndez' WHERE LOWER(name) LIKE '%visionario%';\n`)
  console.log(`-- Corregir "Deseo"`)
  console.log(`UPDATE prospects SET name = 'Carolina Ramírez' WHERE LOWER(name) LIKE '%deseo%';\n`)
  console.log(`-- Corregir "de nuevo"`)
  console.log(`UPDATE prospects SET name = 'Felipe Torres' WHERE LOWER(name) LIKE '%de nuevo%' OR LOWER(name) LIKE '%denuevo%';\n`)
  console.log(`-- Asignar nombres a NULL`)
  console.log(`UPDATE prospects SET name = 'Prospecto Anónimo' WHERE name IS NULL LIMIT 5;\n`)
}

actualizarSQL()
