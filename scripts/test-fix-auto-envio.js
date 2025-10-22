// Test del fix para preguntas sobre Auto Envío
// Fecha: 2025-10-22
// Objetivo: Validar que las preguntas sobre Auto Envío clasifican correctamente a arsenal_cierre

// Simular la función clasificarDocumentoHibrido
function testClasificacion(userMessage) {
  const messageLower = userMessage.toLowerCase();

  const patrones_cierre = [
    /cómo.*distribución/i,
    /herramientas.*tecnológicas/i,
    /cómo.*escalar/i,
    /modelo.*dea/i,
    /cómo.*se.*gana/i,
    /cuánto.*ganar/i,
    /porcentajes.*modelo/i,
    /qué.*me.*venden/i,
    /siguiente.*paso/i,
    /hablar.*equipo/i,
    /empezar.*hoy/i,
    /contactar.*alguien/i,

    // 🆕 FIX 2025-10-22: PATRONES PARA AUTO ENVÍO (SIST_12)
    /auto.*envío/i,
    /autoenvío/i,
    /auto\s*envío/i,
    /qué.*auto.*envío/i,
    /cómo.*funciona.*auto.*envío/i,
    /beneficios.*auto.*envío/i,
    /programa.*auto.*envío/i,
    /qué.*es.*auto.*envío/i,
    /explicame.*auto.*envío/i,
    /cuánto.*auto.*envío/i,

    // Variaciones sin tilde
    /auto.*envio/i,
    /qué.*auto.*envio/i,
    /beneficios.*auto.*envio/i,

    // Contexto de programa de lealtad
    /programa.*lealtad/i,
    /producto.*gratis/i,
    /producto.*obsequio/i,
    /recompensa.*consumo/i
  ];

  // Test si matchea con patrones
  const matches = patrones_cierre.some(patron => patron.test(messageLower));

  if (matches) {
    return 'arsenal_cierre'; // ✅ CORRECTO
  }

  return 'no_clasificado'; // ❌ FALLIDO
}

// 10 VARIACIONES DE PREGUNTAS SOBRE AUTO ENVÍO
const tests = [
  // Preguntas directas
  { pregunta: "¿Qué es el Auto Envío?", esperado: "arsenal_cierre" },
  { pregunta: "¿Qué es el auto envío?", esperado: "arsenal_cierre" },
  { pregunta: "¿Cómo funciona el Auto Envío?", esperado: "arsenal_cierre" },

  // Preguntas sobre beneficios
  { pregunta: "¿Qué beneficios tiene el Auto Envío?", esperado: "arsenal_cierre" },
  { pregunta: "¿Cuáles son los beneficios del auto envío?", esperado: "arsenal_cierre" },

  // Preguntas sobre programa
  { pregunta: "¿Qué es el programa de Auto Envío?", esperado: "arsenal_cierre" },
  { pregunta: "Explícame el Auto Envío", esperado: "arsenal_cierre" },

  // Variaciones sin tilde
  { pregunta: "¿Qué es el auto envio?", esperado: "arsenal_cierre" },
  { pregunta: "Beneficios del auto envio", esperado: "arsenal_cierre" },

  // Contexto de programa de lealtad
  { pregunta: "¿Tienen programa de lealtad?", esperado: "arsenal_cierre" }
];

console.log('🧪 TEST DE CLASIFICACIÓN - FIX AUTO ENVÍO\n');
console.log('='.repeat(80));
console.log('\n📋 Ejecutando 10 tests...\n');

let passed = 0;
let failed = 0;

tests.forEach((test, index) => {
  const resultado = testClasificacion(test.pregunta);
  const pass = resultado === test.esperado;

  if (pass) {
    passed++;
    console.log(`✅ TEST ${index + 1}: PASS`);
  } else {
    failed++;
    console.log(`❌ TEST ${index + 1}: FAIL`);
  }

  console.log(`   Pregunta: "${test.pregunta}"`);
  console.log(`   Esperado: ${test.esperado}`);
  console.log(`   Obtenido: ${resultado}`);
  console.log('');
});

console.log('='.repeat(80));
console.log('\n📊 RESULTADOS:\n');
console.log(`✅ Tests pasados: ${passed}/${tests.length}`);
console.log(`❌ Tests fallidos: ${failed}/${tests.length}`);
console.log(`📈 Success rate: ${((passed / tests.length) * 100).toFixed(1)}%\n`);

if (passed === tests.length) {
  console.log('🎉 ¡TODOS LOS TESTS PASARON! Fix funcionando correctamente.\n');
  console.log('✅ Listo para deploy a producción\n');
} else {
  console.log('⚠️ ALGUNOS TESTS FALLARON - Revisar patrones\n');
}

console.log('='.repeat(80));
console.log('\n💡 SIGUIENTES PASOS:\n');
console.log('1. Si todos los tests pasan → Commit + Push a producción');
console.log('2. Esperar 5 minutos (cache de Anthropic)');
console.log('3. Probar en producción con NEXUS real');
console.log('4. Validar respuesta completa sobre Auto Envío\n');

console.log('📋 INFORMACIÓN ESPERADA EN RESPUESTA:\n');
console.log('- Definición: Programa de lealtad para constructores');
console.log('- Beneficio: Producto gratis cada 4 meses');
console.log('- Nivel 1 (50-99 PV): Producto valorado $73.000-$78.500');
console.log('- Nivel 2 (100+ PV): Producto valorado $110.900-$124.900\n');
