#!/usr/bin/env node
/**
 * Script para actualizar las fechas de prelanzamiento en la base de conocimiento de NEXUS
 *
 * NUEVAS FECHAS:
 * - Lista Privada: 27 Oct - 16 Nov (150 Fundadores)
 * - Pre-Lanzamiento: 17 Nov - 27 Dic (22,500 Constructores - 150 por cada fundador)
 * - Lanzamiento Público: 05 Ene 2026 (4M+ personas en América)
 *
 * Uso: node scripts/actualizar-fechas-prelanzamiento.mjs
 */

import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Configuración de Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Variables de entorno no configuradas')
  console.error('Asegúrate de tener NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY en .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

console.log('🚀 Iniciando actualización de fechas de prelanzamiento en Supabase...\n')

// Leer archivos de knowledge base actualizados
const knowledgeBasePath = path.join(__dirname, '..', 'knowledge_base')

const archivosActualizar = [
  {
    nombre: 'arsenal_conversacional_inicial.txt',
    category: 'arsenal_inicial'
  },
  {
    nombre: 'arsenal_conversacional_tecnico.txt',
    category: 'arsenal_manejo'
  },
  {
    nombre: 'arsenal_conversacional_complementario.txt',
    category: 'arsenal_cierre'
  }
]

async function actualizarDocumento(archivo, category) {
  try {
    const filePath = path.join(knowledgeBasePath, archivo)

    // Leer el contenido del archivo
    const content = fs.readFileSync(filePath, 'utf-8')

    console.log(`📄 Procesando: ${archivo}`)

    // Actualizar en Supabase
    const { data, error } = await supabase
      .from('nexus_documents')
      .update({ content: content })
      .eq('category', category)
      .select()

    if (error) {
      console.error(`❌ Error al actualizar ${category}:`, error.message)
      return false
    }

    if (data && data.length > 0) {
      console.log(`✅ ${category} actualizado exitosamente`)
      return true
    } else {
      console.log(`⚠️  No se encontró documento con categoría: ${category}`)
      return false
    }

  } catch (err) {
    console.error(`❌ Error al procesar ${archivo}:`, err.message)
    return false
  }
}

async function main() {
  let exitosos = 0
  let fallidos = 0

  for (const archivo of archivosActualizar) {
    const resultado = await actualizarDocumento(archivo.nombre, archivo.category)
    if (resultado) {
      exitosos++
    } else {
      fallidos++
    }
    console.log('') // Línea en blanco para separación
  }

  console.log('═══════════════════════════════════════════════')
  console.log(`✅ Documentos actualizados: ${exitosos}`)
  console.log(`❌ Documentos fallidos: ${fallidos}`)
  console.log('═══════════════════════════════════════════════\n')

  if (exitosos > 0) {
    console.log('📅 NUEVAS FECHAS APLICADAS:')
    console.log('   • Lista Privada: 27 Oct - 16 Nov (150 Fundadores)')
    console.log('   • Pre-Lanzamiento: 17 Nov - 27 Dic (22,500 Constructores)')
    console.log('   • Lanzamiento Público: 05 Ene 2026 (4M+ en América)')
    console.log('')
    console.log('🎯 Los cambios están ahora activos en NEXUS')
  }

  process.exit(fallidos > 0 ? 1 : 0)
}

main()
