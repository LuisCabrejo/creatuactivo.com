#!/usr/bin/env node
/**
 * Script de prueba para el contador de cupos de fundadores
 * Simula diferentes fechas y horas para verificar el comportamiento
 */

function calcularCuposDisponibles(fechaActual) {
  const ahora = new Date(fechaActual)

  // Fecha de inicio: 27 de Octubre 2025 a las 10:00 AM (hora de Colombia UTC-5)
  const inicioLista = new Date('2025-10-27T10:00:00-05:00')

  // Si aún no ha llegado la fecha de inicio, mostrar 150
  if (ahora < inicioLista) {
    return 150
  }

  // Calcular días completos desde el inicio
  const msEnUnDia = 24 * 60 * 60 * 1000
  const diferenciaTiempo = ahora.getTime() - inicioLista.getTime()
  const diasCompletos = Math.floor(diferenciaTiempo / msEnUnDia)

  // Calcular cupos base del día actual (resta 10 por cada día completo)
  const cuposBaseDia = 150 - (diasCompletos * 10)

  // Si ya se agotaron todos los cupos
  if (cuposBaseDia <= 0) {
    return 0
  }

  // Calcular horas completas desde el inicio del día actual
  const inicioDiaActual = new Date(inicioLista)
  inicioDiaActual.setDate(inicioDiaActual.getDate() + diasCompletos)

  const diferenciaHoras = ahora.getTime() - inicioDiaActual.getTime()
  const horasTranscurridas = Math.floor(diferenciaHoras / (60 * 60 * 1000))

  // Restar 1 cupo por cada hora DESPUÉS de las 10:00
  // Hora 10:00 = 0 horas transcurridas = 0 cupos restados
  // Hora 11:00 = 1 hora transcurrida = 1 cupo restado
  // Hora 20:00 = 10 horas transcurridas = 10 cupos restados (máximo)
  const cuposRestadosPorHora = Math.min(Math.max(horasTranscurridas, 0), 10)
  const cuposActuales = cuposBaseDia - cuposRestadosPorHora

  // Asegurar que no sea negativo
  return Math.max(cuposActuales, 0)
}

console.log('🧪 PRUEBAS DEL CONTADOR DE CUPOS DE FUNDADORES\n')
console.log('═══════════════════════════════════════════════════════════\n')

const pruebas = [
  {
    nombre: 'Antes del inicio',
    fecha: '2025-10-26T15:00:00-05:00',
    esperado: 150
  },
  {
    nombre: 'Inicio exacto (27 Oct 10:00 AM)',
    fecha: '2025-10-27T10:00:00-05:00',
    esperado: 150
  },
  {
    nombre: 'Primera hora (27 Oct 11:00 AM)',
    fecha: '2025-10-27T11:00:00-05:00',
    esperado: 149
  },
  {
    nombre: 'Medio día primer día (27 Oct 12:00 PM)',
    fecha: '2025-10-27T12:00:00-05:00',
    esperado: 148
  },
  {
    nombre: 'Tarde primer día (27 Oct 15:00 PM)',
    fecha: '2025-10-27T15:00:00-05:00',
    esperado: 145
  },
  {
    nombre: 'Fin primer día (27 Oct 20:00 PM - 10 horas)',
    fecha: '2025-10-27T20:00:00-05:00',
    esperado: 140
  },
  {
    nombre: 'Inicio segundo día (28 Oct 10:00 AM)',
    fecha: '2025-10-28T10:00:00-05:00',
    esperado: 140
  },
  {
    nombre: 'Medio día segundo día (28 Oct 12:00 PM)',
    fecha: '2025-10-28T12:00:00-05:00',
    esperado: 138
  },
  {
    nombre: 'Fin segundo día (28 Oct 20:00 PM)',
    fecha: '2025-10-28T20:00:00-05:00',
    esperado: 130
  },
  {
    nombre: 'Inicio tercer día (29 Oct 10:00 AM)',
    fecha: '2025-10-29T10:00:00-05:00',
    esperado: 130
  },
  {
    nombre: 'Día 7 inicio (02 Nov 10:00 AM)',
    fecha: '2025-11-02T10:00:00-05:00',
    esperado: 90
  },
  {
    nombre: 'Día 10 inicio (05 Nov 10:00 AM)',
    fecha: '2025-11-05T10:00:00-05:00',
    esperado: 60
  },
  {
    nombre: 'Día 15 inicio (10 Nov 10:00 AM)',
    fecha: '2025-11-10T10:00:00-05:00',
    esperado: 10
  },
  {
    nombre: 'Día 15 fin (10 Nov 20:00 PM)',
    fecha: '2025-11-10T20:00:00-05:00',
    esperado: 0
  },
  {
    nombre: 'Después de agotado (20 Nov)',
    fecha: '2025-11-20T10:00:00-05:00',
    esperado: 0
  }
]

let exitosas = 0
let fallidas = 0

pruebas.forEach((prueba, index) => {
  const resultado = calcularCuposDisponibles(prueba.fecha)
  const exito = resultado === prueba.esperado

  if (exito) {
    console.log(`✅ Prueba ${index + 1}: ${prueba.nombre}`)
    console.log(`   Fecha: ${prueba.fecha}`)
    console.log(`   Cupos: ${resultado} (esperado: ${prueba.esperado})`)
    exitosas++
  } else {
    console.log(`❌ Prueba ${index + 1}: ${prueba.nombre}`)
    console.log(`   Fecha: ${prueba.fecha}`)
    console.log(`   Cupos: ${resultado} (esperado: ${prueba.esperado})`)
    console.log(`   ⚠️  DIFERENCIA: ${Math.abs(resultado - prueba.esperado)} cupos`)
    fallidas++
  }
  console.log('')
})

console.log('═══════════════════════════════════════════════════════════')
console.log(`\n📊 RESUMEN DE PRUEBAS:`)
console.log(`   ✅ Exitosas: ${exitosas}/${pruebas.length}`)
console.log(`   ❌ Fallidas: ${fallidas}/${pruebas.length}`)
console.log(`   📈 Tasa de éxito: ${((exitosas/pruebas.length)*100).toFixed(1)}%`)

if (fallidas === 0) {
  console.log(`\n🎉 ¡Todas las pruebas pasaron! El contador funciona correctamente.\n`)
  process.exit(0)
} else {
  console.log(`\n⚠️  Hay pruebas fallidas. Revisa la lógica del contador.\n`)
  process.exit(1)
}
