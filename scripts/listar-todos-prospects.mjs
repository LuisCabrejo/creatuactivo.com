#!/usr/bin/env node
/**
 * Listar TODOS los prospects para encontrar los nombres incorrectos
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

async function listar() {
  console.log('🔍 Listando todos los prospects (tabla base)...\n')

  // Listar tabla prospects (la base)
  const { data, error } = await supabase
    .from('prospects')
    .select('id, fingerprint_id, session_id, conversion_stage, created_at')
    .order('created_at', { ascending: false })
    .limit(15)

  if (error) {
    console.error('❌ Error:', error.message)
    return
  }

  console.log(`📊 ${data.length} prospects:\n`)
  for (const p of data) {
    console.log(`ID: ${p.id} | Fingerprint: ${p.fingerprint_id} | Stage: ${p.conversion_stage}`)

    // Buscar datos asociados en prospect_data
    const { data: pData } = await supabase
      .from('prospect_data')
      .select('name, email, phone, occupation, archetype')
      .eq('fingerprint_id', p.fingerprint_id)
      .single()

    if (pData) {
      console.log(`  → Nombre: "${pData.name || '(null)'}"`)
      console.log(`  → Email: ${pData.email || '-'}`)
      console.log(`  → Phone: ${pData.phone || '-'}`)
      console.log(`  → Occupation: ${pData.occupation || '-'}`)
      console.log(`  → Archetype: ${pData.archetype || '-'}`)
    } else {
      console.log(`  → Sin datos en prospect_data`)
    }
    console.log()
  }
}

listar()
