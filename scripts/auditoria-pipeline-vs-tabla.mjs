#!/usr/bin/env node
/**
 * Script de Auditoría: Pipeline vs Tabla de Prospectos
 *
 * Verifica consistencia entre:
 * - Contadores del pipeline visual (INICIAR/ACOGER/ACTIVAR)
 * - Datos reales en tabla prospects
 * - device_info vs columnas directas
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

async function auditar() {
  console.log('🔍 AUDITORÍA: Pipeline vs Tabla de Prospectos\n')
  console.log('=' .repeat(60))

  // 1. CONTADORES POR STAGE
  console.log('\n📊 PARTE 1: Contadores por Stage\n')

  const stages = ['iniciar', 'acoger', 'activar']
  const contadores = {}

  for (const stage of stages) {
    const { count, error } = await supabase
      .from('prospects')
      .select('*', { count: 'exact', head: true })
      .eq('stage', stage)

    if (error) {
      console.error(`❌ Error contando ${stage}:`, error.message)
    } else {
      contadores[stage] = count
      console.log(`${stage.toUpperCase().padEnd(10)} : ${count} prospectos`)
    }
  }

  const total = Object.values(contadores).reduce((a, b) => a + b, 0)
  console.log(`${'TOTAL'.padEnd(10)} : ${total} prospectos`)

  // 2. VERIFICAR DATOS device_info vs columnas directas
  console.log('\n📊 PARTE 2: Divergencias device_info vs campos directos\n')

  const { data: allProspects } = await supabase
    .from('prospects')
    .select('id, fingerprint_id, stage, device_info')
    .in('stage', stages)
    .limit(500)

  let divergenciasNombre = 0
  let divergenciasEmail = 0
  let divergenciasPhone = 0
  let sinDeviceInfo = 0
  let sinDatosContacto = 0

  const ejemplosDivergencias = []

  for (const p of allProspects || []) {
    const deviceInfo = p.device_info || {}

    // Verificar si tiene device_info
    if (!deviceInfo || Object.keys(deviceInfo).length === 0) {
      sinDeviceInfo++
      continue
    }

    // Verificar si tiene datos de contacto
    const tieneDatos = deviceInfo.name || deviceInfo.email || deviceInfo.whatsapp || deviceInfo.phone
    if (!tieneDatos) {
      sinDatosContacto++
      continue
    }

    // Guardar ejemplos de divergencias para análisis
    if (ejemplosDivergencias.length < 10) {
      ejemplosDivergencias.push({
        id: p.id.substring(0, 8),
        stage: p.stage,
        device_info: {
          name: deviceInfo.name,
          email: deviceInfo.email,
          phone: deviceInfo.whatsapp || deviceInfo.phone
        }
      })
    }
  }

  console.log(`Prospects sin device_info: ${sinDeviceInfo}`)
  console.log(`Prospects sin datos contacto: ${sinDatosContacto}`)
  console.log(`Prospects con datos: ${(allProspects?.length || 0) - sinDeviceInfo - sinDatosContacto}`)

  // 3. ANÁLISIS POR STAGE
  console.log('\n📊 PARTE 3: Análisis Detallado por Stage\n')

  for (const stage of stages) {
    const { data: prospectsStage } = await supabase
      .from('prospects')
      .select('id, device_info, created_at')
      .eq('stage', stage)
      .order('created_at', { ascending: false })
      .limit(100)

    let conNombre = 0
    let conEmail = 0
    let conPhone = 0
    let completos = 0

    for (const p of prospectsStage || []) {
      const di = p.device_info || {}
      if (di.name) conNombre++
      if (di.email) conEmail++
      if (di.whatsapp || di.phone) conPhone++
      if (di.name && (di.email || di.whatsapp || di.phone)) completos++
    }

    const total = prospectsStage?.length || 0
    console.log(`\n${stage.toUpperCase()}:`)
    console.log(`  Total: ${total}`)
    console.log(`  Con nombre: ${conNombre} (${total ? Math.round(conNombre/total*100) : 0}%)`)
    console.log(`  Con email: ${conEmail} (${total ? Math.round(conEmail/total*100) : 0}%)`)
    console.log(`  Con teléfono: ${conPhone} (${total ? Math.round(conPhone/total*100) : 0}%)`)
    console.log(`  Completos (nombre + contacto): ${completos} (${total ? Math.round(completos/total*100) : 0}%)`)
  }

  // 4. DETECTAR ANOMALÍAS
  console.log('\n📊 PARTE 4: Detección de Anomalías\n')

  const { data: anomalias } = await supabase
    .from('prospects')
    .select('id, fingerprint_id, stage, device_info, created_at')
    .in('stage', stages)
    .order('created_at', { ascending: false })
    .limit(1000)

  const nombresProblematicos = []
  const duplicados = new Map()

  for (const p of anomalias || []) {
    const di = p.device_info || {}
    const nombre = di.name

    if (!nombre) continue

    // Detectar nombres problemáticos (palabras genéricas)
    const palabrasProblematicas = [
      'quiero', 'deseo', 'quisiera', 'me interesa', 'ocupación',
      'visionario', 'emprendedor', 'profesional', 'independiente',
      'fundador', 'constructor', 'de nuevo', 'denuevo'
    ]

    for (const palabra of palabrasProblematicas) {
      if (nombre.toLowerCase().includes(palabra)) {
        nombresProblematicos.push({
          id: p.id.substring(0, 8),
          nombre,
          stage: p.stage,
          created: new Date(p.created_at).toLocaleDateString('es-ES')
        })
        break
      }
    }

    // Detectar duplicados por fingerprint
    const key = p.fingerprint_id
    if (duplicados.has(key)) {
      duplicados.set(key, duplicados.get(key) + 1)
    } else {
      duplicados.set(key, 1)
    }
  }

  // Filtrar solo duplicados reales
  const duplicadosReales = Array.from(duplicados.entries()).filter(([_, count]) => count > 1)

  console.log(`❌ Nombres problemáticos encontrados: ${nombresProblematicos.length}`)
  if (nombresProblematicos.length > 0) {
    console.log('\nEjemplos (primeros 5):')
    nombresProblematicos.slice(0, 5).forEach(n => {
      console.log(`  • ID ${n.id}: "${n.nombre}" (${n.stage}) - ${n.created}`)
    })
  }

  console.log(`\n⚠️  Fingerprints duplicados: ${duplicadosReales.length}`)
  if (duplicadosReales.length > 0) {
    console.log('\nTop 5 duplicados:')
    duplicadosReales.slice(0, 5).forEach(([fp, count]) => {
      console.log(`  • ${fp.substring(0, 16)}...: ${count} veces`)
    })
  }

  // 5. RESUMEN EJECUTIVO
  console.log('\n' + '='.repeat(60))
  console.log('📋 RESUMEN EJECUTIVO\n')

  console.log(`✅ Total prospectos en pipeline: ${total}`)
  console.log(`✅ Prospectos con datos contacto: ${(allProspects?.length || 0) - sinDeviceInfo - sinDatosContacto}`)
  console.log(`⚠️  Prospectos sin device_info: ${sinDeviceInfo}`)
  console.log(`⚠️  Prospectos sin datos contacto: ${sinDatosContacto}`)
  console.log(`❌ Nombres problemáticos: ${nombresProblematicos.length}`)
  console.log(`⚠️  Fingerprints duplicados: ${duplicadosReales.length}`)

  console.log('\n💡 RECOMENDACIONES:\n')

  if (nombresProblematicos.length > 0) {
    console.log(`1. Ejecutar script de corrección de nombres problemáticos`)
    console.log(`   → node scripts/corregir-todos-nombres-problematicos.mjs`)
  }

  if (duplicadosReales.length > 5) {
    console.log(`2. Revisar lógica de deduplicación en Dashboard`)
    console.log(`   → Ver src/app/api/mi-sistema-iaa/route.ts líneas 173-200`)
  }

  if (sinDatosContacto > total * 0.3) {
    console.log(`3. Revisar captura de datos en NEXUS`)
    console.log(`   → ${Math.round(sinDatosContacto/total*100)}% de prospectos sin datos de contacto`)
  }

  console.log('\n✅ Auditoría completada')
}

auditar()
