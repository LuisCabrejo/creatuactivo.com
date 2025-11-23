#!/usr/bin/env node
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

const supabase = createClient(envVars.NEXT_PUBLIC_SUPABASE_URL, envVars.SUPABASE_SERVICE_ROLE_KEY)

async function buscar() {
  const { data } = await supabase.from('prospects').select('id, fingerprint_id, device_info, stage').limit(100)

  console.log('🔍 Buscando device_info con nombres...\n')

  let encontrados = 0
  for (const p of data || []) {
    const deviceInfo = p.device_info || {}
    if (deviceInfo.name || deviceInfo.whatsapp || deviceInfo.email || deviceInfo.occupation) {
      encontrados++
      console.log(`\n📋 ID: ${p.id} | Stage: ${p.stage}`)
      console.log(`Fingerprint: ${p.fingerprint_id.substring(0, 16)}...`)
      if (deviceInfo.name) console.log(`  Nombre: "${deviceInfo.name}"`)
      if (deviceInfo.email) console.log(`  Email: ${deviceInfo.email}`)
      if (deviceInfo.whatsapp) console.log(`  WhatsApp: ${deviceInfo.whatsapp}`)
      if (deviceInfo.occupation) console.log(`  Occupation: ${deviceInfo.occupation}`)

      // Detectar problemas
      if (deviceInfo.name && (
        deviceInfo.name.toLowerCase().includes('visionario') ||
        deviceInfo.name.toLowerCase().includes('deseo') ||
        deviceInfo.name.toLowerCase().includes('de nuevo')
      )) {
        console.log(`  ⚠️  PROBLEMA DETECTADO`)
      }
    }
  }

  console.log(`\n\n📊 Total con datos: ${encontrados} de ${data?.length || 0}`)
}

buscar()
