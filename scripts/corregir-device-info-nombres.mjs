#!/usr/bin/env node
/**
 * Script FINAL para corregir nombres en device_info de tabla prospects
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

async function corregirDeviceInfo() {
  console.log('🔧 Corrigiendo nombres en device_info de tabla prospects...\n')

  // 1. Obtener todos los prospects con device_info
  const { data: prospects, error } = await supabase
    .from('prospects')
    .select('id, fingerprint_id, device_info, nombre')
    .not('device_info', 'is', null)
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) {
    console.error('❌ Error:', error.message)
    return
  }

  console.log(`📊 ${prospects.length} prospects con device_info:\n`)

  const correcciones = []

  for (const p of prospects) {
    const deviceInfo = p.device_info || {}
    const nombreActual = deviceInfo.name || p.nombre

    if (!nombreActual) continue

    console.log(`ID ${p.id}: "${nombreActual}"`)

    // Detectar problemas
    let nombreNuevo = null
    if (nombreActual.toLowerCase().includes('visionario')) {
      nombreNuevo = 'Ricardo Méndez'
    } else if (nombreActual.toLowerCase() === 'deseo' || nombreActual.toLowerCase().includes('deseo')) {
      nombreNuevo = 'Carolina Ramírez'
    } else if (nombreActual.toLowerCase().includes('de nuevo') || nombreActual.toLowerCase().includes('denuevo')) {
      nombreNuevo = 'Felipe Torres'
    }

    if (nombreNuevo) {
      console.log(`  ⚠️  PROBLEMA: "${nombreActual}" → "${nombreNuevo}"`)
      correcciones.push({
        id: p.id,
        nombreActual,
        nombreNuevo,
        deviceInfo
      })
    }
  }

  if (correcciones.length === 0) {
    console.log('\n✅ No se encontraron problemas en device_info')
    return
  }

  console.log(`\n🔧 Corrigiendo ${correcciones.length} registros...\n`)

  for (const corr of correcciones) {
    // Actualizar device_info con nombre corregido
    const deviceInfoActualizado = {
      ...corr.deviceInfo,
      name: corr.nombreNuevo
    }

    const { error: updateError } = await supabase
      .from('prospects')
      .update({
        device_info: deviceInfoActualizado,
        nombre: corr.nombreNuevo  // También actualizar columna directa
      })
      .eq('id', corr.id)

    if (updateError) {
      console.error(`❌ Error actualizando ID ${corr.id}:`, updateError.message)
    } else {
      console.log(`✅ ID ${corr.id}: "${corr.nombreActual}" → "${corr.nombreNuevo}"`)
    }
  }

  console.log('\n✅ Proceso completado!')
  console.log('💡 Refresca https://app.creatuactivo.com/mi-sistema-iaa para ver cambios')
  console.log(`📊 Total corregidos: ${correcciones.length}`)
}

corregirDeviceInfo()
