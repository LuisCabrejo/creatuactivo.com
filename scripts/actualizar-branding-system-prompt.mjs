#!/usr/bin/env node
/**
 * Script para actualizar branding en System Prompt
 *
 * CAMBIOS:
 * - "LA APLICACIÓN:" → "LA APLICACIÓN CREATUACTIVO:"
 * - "la aplicación" (genérico) → "la aplicación CreaTuActivo"
 * - Eliminar menciones de "framework" sin contexto
 * - Mantener coherencia con arsenales actualizados
 *
 * Fecha: 22 Nov 2025
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Leer .env.local manualmente
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

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Faltan variables de entorno')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function actualizarBranding() {
  console.log('🎨 Actualizando branding en System Prompt...\n')

  // 1. Leer System Prompt actual
  const { data: promptActual, error: errorLeer } = await supabase
    .from('system_prompts')
    .select('prompt, version')
    .eq('name', 'nexus_main')
    .single()

  if (errorLeer) {
    console.error('❌ Error leyendo prompt:', errorLeer)
    return
  }

  console.log('📖 Version actual:', promptActual.version)
  console.log('📊 Tamaño actual:', promptActual.prompt.length, 'caracteres\n')

  // 2. Aplicar cambios de branding
  let promptNuevo = promptActual.prompt

  // CAMBIO 1: "LA APLICACIÓN:" → "LA APLICACIÓN CREATUACTIVO:"
  promptNuevo = promptNuevo.replace(
    /\* \*\*⚡ LA APLICACIÓN:\*\*/g,
    '* **⚡ LA APLICACIÓN CREATUACTIVO:**'
  )

  // CAMBIO 2: "la aplicación" → "la aplicación CreaTuActivo" (solo en contextos específicos)
  // Contextos donde debe ser específico:

  // Línea 370 (sección Lenguaje Simple)
  promptNuevo = promptNuevo.replace(
    /\* "\*\*la aplicación\*\*" \(en lugar de: ecosistema, NodeX, plataforma\)/g,
    '* "**la aplicación CreaTuActivo**" (en lugar de: ecosistema, NodeX, plataforma)'
  )

  // CAMBIO 3: Actualizar referencia a "el método" para ser más específico
  promptNuevo = promptNuevo.replace(
    /\* "\*\*el método\*\*" \(en lugar de: Framework IAA, metodología\)/g,
    '* "**el método probado**" o "**Los 3 Pasos: IAA**" (en lugar de: Framework IAA, metodología, framework)'
  )

  // CAMBIO 4: Agregar "framework" a la lista de palabras prohibidas si no está
  if (!promptNuevo.includes('* "framework"')) {
    promptNuevo = promptNuevo.replace(
      /\* Nombres técnicos internos: "Framework IAA", "NodeX", "Modelo DEA"/g,
      '* Nombres técnicos internos: "Framework IAA", "NodeX", "Modelo DEA", "framework" (solo)'
    )
  }

  // CAMBIO 5: Actualizar menciones genéricas de "la aplicación" en descripciones clave
  // (Mantener algunas genéricas cuando el contexto ya es claro)
  promptNuevo = promptNuevo.replace(
    /Tu aplicación completa con IA que trabaja 24\/7/g,
    'La aplicación CreaTuActivo completa con IA que trabaja 24/7'
  )

  // 3. Contar cambios aplicados
  const cambios = []

  if (promptNuevo.includes('LA APLICACIÓN CREATUACTIVO:')) {
    cambios.push('✅ "LA APLICACIÓN:" → "LA APLICACIÓN CREATUACTIVO:"')
  }

  if (promptNuevo.includes('la aplicación CreaTuActivo**" (en lugar de')) {
    cambios.push('✅ "la aplicación" → "la aplicación CreaTuActivo" (lenguaje simple)')
  }

  if (promptNuevo.includes('Los 3 Pasos: IAA')) {
    cambios.push('✅ "el método" → "el método probado" o "Los 3 Pasos: IAA"')
  }

  if (promptNuevo.includes('"framework" (solo)')) {
    cambios.push('✅ "framework" agregado a palabras prohibidas')
  }

  if (promptNuevo.includes('La aplicación CreaTuActivo completa')) {
    cambios.push('✅ Menciones genéricas actualizadas a "la aplicación CreaTuActivo"')
  }

  console.log('📝 Cambios aplicados:')
  cambios.forEach(c => console.log('  ', c))
  console.log()

  // 4. Actualizar versión
  const versionNueva = 'v19.0_branding_creatuactivo'

  console.log('🔄 Actualizando en Supabase...')
  console.log('   Version:', versionNueva)
  console.log('   Tamaño nuevo:', promptNuevo.length, 'caracteres\n')

  // 5. Guardar en Supabase
  const { error: errorActualizar } = await supabase
    .from('system_prompts')
    .update({
      prompt: promptNuevo,
      version: versionNueva,
      updated_at: new Date().toISOString()
    })
    .eq('name', 'nexus_main')

  if (errorActualizar) {
    console.error('❌ Error actualizando:', errorActualizar)
    return
  }

  console.log('✅ System Prompt actualizado exitosamente!')
  console.log()
  console.log('📊 Resumen:')
  console.log('   Cambios:', cambios.length)
  console.log('   Delta tamaño:', promptNuevo.length - promptActual.prompt.length, 'caracteres')
  console.log()
  console.log('⚠️  IMPORTANTE:')
  console.log('   - El cache de Anthropic expira en ~5 minutos')
  console.log('   - NEXUS empezará a usar el nuevo branding automáticamente')
  console.log('   - Verificar en: node scripts/leer-system-prompt.mjs')
}

actualizarBranding()
