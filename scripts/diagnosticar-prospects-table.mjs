#!/usr/bin/env node
/**
 * Script para diagnosticar tabla prospects (no prospect_data)
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

async function diagnosticar() {
  console.log('🔍 Diagnosticando tabla prospects...\n')

  // Buscar en la tabla que usa el Dashboard
  const { data, error } = await supabase
    .from('prospects')
    .select(`
      id,
      name,
      email,
      phone,
      archetype,
      conversion_stage,
      created_at
    `)
    .order('created_at', { ascending: false })
    .limit(15)

  if (error) {
    console.error('❌ Error:', error.message)
    return
  }

  console.log(`📊 ${data.length} prospectos encontrados:\n`)
  data.forEach((p, i) => {
    const nombre = p.name || '(null)'
    const email = p.email || '-'
    const phone = p.phone || '-'
    const archetype = p.archetype || '-'
    const stage = p.conversion_stage || 'INICIAR'

    console.log(`${i + 1}. ID: ${p.id}`)
    console.log(`   Nombre: "${nombre}"`)
    console.log(`   Email: ${email}`)
    console.log(`   Phone: ${phone}`)
    console.log(`   Arquetipo: ${archetype}`)
    console.log(`   Stage: ${stage}`)
    console.log()
  })
}

diagnosticar()
