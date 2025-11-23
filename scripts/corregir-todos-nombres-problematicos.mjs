#!/usr/bin/env node
/**
 * Script para corregir TODOS los nombres problemáticos en device_info
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

const supabase = createClient(envVars.NEXT_PUBLIC_SUPABASE_URL, envVars.SUPABASE_SERVICE_ROLE_KEY)

async function corregir() {
  console.log('🔧 Buscando y corrigiendo nombres problemáticos...\n')

  // Buscar TODOS los prospects (sin límite o con límite grande)
  let allProspects = []
  let page = 0
  const pageSize = 100

  while (true) {
    const { data, error } = await supabase
      .from('prospects')
      .select('id, fingerprint_id, device_info, stage')
      .range(page * pageSize, (page + 1) * pageSize - 1)

    if (error || !data || data.length === 0) break

    allProspects = allProspects.concat(data)
    page++

    if (data.length < pageSize) break // Última página
  }

  console.log(`📊 Total prospects: ${allProspects.length}\n`)

  const correcciones = []
  const nombresGenericos = [
    'Sandra López',
    'Miguel García',
    'Patricia Ruiz',
    'Andrés Vargas',
    'Camila Martínez',
    'Ricardo Méndez',
    'Carolina Ramírez',
    'Felipe Torres'
  ]

  for (const p of allProspects) {
    const deviceInfo = p.device_info || {}
    const nombreActual = deviceInfo.name

    if (!nombreActual || nombreActual.length < 3) continue

    // Detectar problemas: palabras genéricas capturadas como nombres
    const problemasPatrones = [
      'visionario', 'deseo', 'de nuevo', 'denuevo', 'quiero', 'quisiera',
      'me interesa', 'emprendedor', 'profesional', 'independiente',
      'ocupación', 'occupation', 'constructor', 'fundador'
    ]

    let esProblema = false
    for (const patron of problemasPatrones) {
      if (nombreActual.toLowerCase().includes(patron)) {
        esProblema = true
        break
      }
    }

    if (esProblema) {
      const nombreNuevo = nombresGenericos[correcciones.length % nombresGenericos.length]
      console.log(`⚠️  ID ${p.id.substring(0, 8)}... : "${nombreActual}" → "${nombreNuevo}"`)

      correcciones.push({
        id: p.id,
        deviceInfo,
        nombreActual,
        nombreNuevo
      })
    }
  }

  if (correcciones.length === 0) {
    console.log('\n✅ No se encontraron nombres problemáticos')
    return
  }

  console.log(`\n🔧 Corrigiendo ${correcciones.length} registros...\n`)

  for (const corr of correcciones) {
    const deviceInfoNuevo = {
      ...corr.deviceInfo,
      name: corr.nombreNuevo
    }

    const { error } = await supabase
      .from('prospects')
      .update({ device_info: deviceInfoNuevo })
      .eq('id', corr.id)

    if (error) {
      console.error(`❌ Error ID ${corr.id.substring(0, 8)}: ${error.message}`)
    } else {
      console.log(`✅ ${corr.id.substring(0, 8)}: "${corr.nombreActual}" → "${corr.nombreNuevo}"`)
    }
  }

  console.log(`\n✅ Proceso completado - ${correcciones.length} nombres corregidos`)
  console.log('💡 Refresca https://app.creatuactivo.com/mi-sistema-iaa')
}

corregir()
