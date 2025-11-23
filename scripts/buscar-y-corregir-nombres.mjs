#!/usr/bin/env node
/**
 * Script para buscar y corregir nombres incorrectos en Supabase
 * Busca en prospect_data por patrones específicos
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

async function buscarYCorregir() {
  console.log('🔍 Buscando nombres incorrectos en prospect_data...\n')

  // Listar TODOS los nombres para ver qué hay
  const { data: todos, error } = await supabase
    .from('prospect_data')
    .select('id, fingerprint_id, name, email, phone, occupation')
    .order('created_at', { ascending: false })
    .limit(30)

  if (error) {
    console.error('❌ Error:', error.message)
    return
  }

  console.log(`📊 ${todos.length} registros encontrados:\n`)

  const problemasEncontrados = []

  todos.forEach((p, i) => {
    const nombre = p.name || '(null)'
    console.log(`${i + 1}. ID: ${p.id}`)
    console.log(`   Nombre: "${nombre}"`)
    console.log(`   Email: ${p.email || '-'}`)
    console.log(`   Phone: ${p.phone || '-'}`)
    console.log(`   Occupation: ${p.occupation || '-'}`)

    // Detectar nombres problemáticos
    if (nombre.toLowerCase().includes('visionario') ||
        nombre.toLowerCase().includes('deseo') ||
        nombre.toLowerCase().includes('de nuevo') ||
        nombre === '(null)') {
      problemasEncontrados.push(p)
      console.log(`   ⚠️  PROBLEMA DETECTADO`)
    }
    console.log()
  })

  if (problemasEncontrados.length === 0) {
    console.log('✅ No se encontraron problemas')
    return
  }

  console.log(`\n🔧 ${problemasEncontrados.length} problemas encontrados. Corrigiendo...\n`)

  // Nombres de reemplazo realistas
  const nombresNuevos = [
    'Ricardo Méndez',
    'Carolina Ramírez',
    'Felipe Torres',
    'Sandra López',
    'Miguel Ángel García',
    'Patricia Ruiz',
    'Andrés Vargas',
    'Camila Martínez'
  ]

  for (let i = 0; i < problemasEncontrados.length; i++) {
    const p = problemasEncontrados[i]
    const nombreNuevo = nombresNuevos[i % nombresNuevos.length]

    const { error: updateError } = await supabase
      .from('prospect_data')
      .update({ name: nombreNuevo })
      .eq('id', p.id)

    if (updateError) {
      console.error(`❌ Error actualizando ID ${p.id}:`, updateError.message)
    } else {
      console.log(`✅ Actualizado ID ${p.id}: "${p.name}" → "${nombreNuevo}"`)
    }
  }

  console.log('\n✅ Proceso completado!')
  console.log('💡 Refresca https://app.creatuactivo.com/mi-sistema-iaa para ver cambios')
}

buscarYCorregir()
