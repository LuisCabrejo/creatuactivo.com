#!/usr/bin/env node
/**
 * Script para diagnosticar nombres incorrectos en Dashboard
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
  console.log('🔍 Diagnosticando todos los nombres en prospect_data...\n')

  const { data, error } = await supabase
    .from('prospect_data')
    .select('id, name, email, phone')
    .order('created_at', { ascending: false })
    .limit(20)

  if (error) {
    console.error('❌ Error:', error.message)
    return
  }

  console.log('📊 Últimos 20 prospectos:\n')
  data.forEach((p, i) => {
    const nombre = p.name || '(null)'
    const email = p.email || '-'
    const phone = p.phone || '-'
    console.log(`${i + 1}. ID: ${p.id}`)
    console.log(`   Nombre: "${nombre}"`)
    console.log(`   Email: ${email}`)
    console.log(`   Phone: ${phone}`)
    console.log()
  })
}

diagnosticar()
