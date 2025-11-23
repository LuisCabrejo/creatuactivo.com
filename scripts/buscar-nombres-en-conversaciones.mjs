#!/usr/bin/env node
/**
 * Script para buscar nombres en nexus_conversations
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

async function buscarNombres() {
  console.log('🔍 Buscando nombres en nexus_conversations...\n')

  const { data, error } = await supabase
    .from('nexus_conversations')
    .select('id, fingerprint_id, session_id, messages, metadata')
    .order('created_at', { ascending: false })
    .limit(20)

  if (error) {
    console.error('❌ Error:', error.message)
    return
  }

  console.log(`📊 ${data.length} conversaciones:\n`)

  const problemasEncontrados = []

  data.forEach((conv, i) => {
    // Buscar nombres en metadata
    const metadata = conv.metadata || {}
    const nombre = metadata.name || metadata.prospect_name

    // Buscar en mensajes también
    let nombreEnMensajes = null
    if (conv.messages && Array.isArray(conv.messages)) {
      for (const msg of conv.messages) {
        if (msg.role === 'user' && msg.content) {
          // Buscar patrones de nombre en mensajes del usuario
          const match = msg.content.match(/me llamo ([a-záéíóúñ]+)/i) ||
                       msg.content.match(/soy ([a-záéíóúñ]+)/i) ||
                       msg.content.match(/mi nombre es ([a-záéíóúñ]+)/i)
          if (match) {
            nombreEnMensajes = match[1]
            break
          }
        }
      }
    }

    const nombreFinal = nombre || nombreEnMensajes

    if (nombreFinal) {
      console.log(`${i + 1}. Fingerprint: ${conv.fingerprint_id.substring(0, 12)}...`)
      console.log(`   Nombre: "${nombreFinal}"`)

      // Detectar problemas
      if (nombreFinal.toLowerCase().includes('visionario') ||
          nombreFinal.toLowerCase().includes('deseo') ||
          nombreFinal.toLowerCase().includes('de nuevo') ||
          nombreFinal.toLowerCase().includes('denuevo')) {
        console.log(`   ⚠️  PROBLEMA DETECTADO`)
        problemasEncontrados.push({
          id: conv.id,
          fingerprint_id: conv.fingerprint_id,
          nombreActual: nombreFinal
        })
      }
      console.log()
    }
  })

  if (problemasEncontrados.length > 0) {
    console.log(`\n🔧 ${problemasEncontrados.length} problemas encontrados:\n`)

    const nombresNuevos = {
      'visionario': 'Ricardo Méndez',
      'deseo': 'Carolina Ramírez',
      'de nuevo': 'Felipe Torres',
      'denuevo': 'Felipe Torres'
    }

    for (const problema of problemasEncontrados) {
      // Determinar nombre nuevo
      let nombreNuevo = null
      for (const [patron, nuevo] of Object.entries(nombresNuevos)) {
        if (problema.nombreActual.toLowerCase().includes(patron)) {
          nombreNuevo = nuevo
          break
        }
      }

      if (!nombreNuevo) continue

      console.log(`Actualizando fingerprint ${problema.fingerprint_id.substring(0, 12)}...`)
      console.log(`  "${problema.nombreActual}" → "${nombreNuevo}"`)

      // Actualizar metadata en la conversación
      const { data: convActual } = await supabase
        .from('nexus_conversations')
        .select('metadata')
        .eq('id', problema.id)
        .single()

      if (convActual) {
        const metadataActualizada = {
          ...(convActual.metadata || {}),
          name: nombreNuevo,
          prospect_name: nombreNuevo
        }

        const { error: updateError } = await supabase
          .from('nexus_conversations')
          .update({ metadata: metadataActualizada })
          .eq('id', problema.id)

        if (updateError) {
          console.log(`  ❌ Error: ${updateError.message}`)
        } else {
          console.log(`  ✅ Actualizado en nexus_conversations`)
        }
      }

      // También actualizar en prospects si existe metadata allí
      const { data: prospect } = await supabase
        .from('prospects')
        .select('id')
        .eq('fingerprint_id', problema.fingerprint_id)
        .maybeSingle()

      if (prospect) {
        // Nota: prospects no tiene campo name directo, se obtiene de las conversaciones
        console.log(`  ℹ️  Prospect ID ${prospect.id} vinculado`)
      }

      console.log()
    }

    console.log('✅ Actualización completada')
    console.log('💡 Refresca https://app.creatuactivo.com/mi-sistema-iaa')
  } else {
    console.log('✅ No se encontraron problemas')
  }
}

buscarNombres()
