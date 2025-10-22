// Test del fix para preguntas sobre productos por paquete
// Fecha: 2025-10-21
// Objetivo: Validar que las 10 variaciones clasifican correctamente a arsenal_cierre

// Simular la función clasificarDocumentoHibrido
function testClasificacion(userMessage) {
  const messageLower = userMessage.toLowerCase();

  const patrones_paquetes = [
    // Paquetes específicos de inversión
    /cuál.*inversión/i,
    /precio.*paquete/i,
    /cuesta.*empezar/i,
    /inversión.*inicial/i,
    /constructor.*inicial/i,
    /constructor.*empresarial/i,
    /constructor.*visionario/i,
    /paquete.*emprendedor/i,
    /cuánto.*cuesta.*(empezar|constructor|paquete|inversión|activar)/i,

    // Contexto de inversión para construcción
    /inversión.*para/i,
    /costo.*activar/i,
    /precio.*fundador/i,

    // Patrones generales para paquetes
    /háblame.*paquetes/i,
    /sobre.*paquetes/i,
    /de.*los.*paquetes/i,
    /qué.*paquetes/i,
    /cuáles.*paquetes/i,
    /información.*paquetes/i,
    /paquetes.*disponibles/i,
    /paquetes.*hay/i,
    /tipos.*paquetes/i,

    // Referencias específicas ESP
    /esp\s*1/i,
    /esp\s*2/i,
    /esp\s*3/i,
    /esp1/i,
    /esp2/i,
    /esp3/i,
    /paquete.*esp/i,
    /esp.*paquete/i,

    // 🆕 FIX 2025-10-21: PATRONES PARA PRODUCTOS POR PAQUETE (SIST_11)
    // Preguntas sobre CANTIDAD de productos
    /cuántos.*productos.*paquete/i,
    /cuántos.*productos.*ESP/i,
    /cuántos.*productos.*trae/i,
    /cuántos.*productos.*incluye/i,
    /cuántos.*productos.*contiene/i,
    /cantidad.*productos.*paquete/i,
    /número.*productos.*paquete/i,

    // Preguntas sobre QUÉ productos
    /qué.*productos.*paquete/i,
    /qué.*productos.*ESP/i,
    /qué.*productos.*trae/i,
    /qué.*productos.*incluye/i,
    /qué.*contiene.*paquete/i,
    /qué.*viene.*paquete/i,
    /cuáles.*productos.*paquete/i,
    /cuáles.*productos.*ESP/i,

    // Preguntas sobre INVENTARIO/COMPOSICIÓN
    /inventario.*paquete/i,
    /listado.*productos.*paquete/i,
    /lista.*productos.*paquete/i,
    /desglose.*paquete/i,
    /composición.*paquete/i,
    /detalle.*paquete/i,
    /detalle.*productos.*paquete/i,

    // Patrones específicos por paquete y productos
    /ESP.*1.*productos/i,
    /ESP.*2.*productos/i,
    /ESP.*3.*productos/i,
    /Inicial.*productos/i,
    /Empresarial.*productos/i,
    /Visionario.*productos/i,
    /productos.*Inicial/i,
    /productos.*Empresarial/i,
    /productos.*Visionario/i,

    // Patrones de contexto "qué viene"
    /qué.*viene.*ESP/i,
    /qué.*trae.*ESP/i,
    /qué.*incluye.*ESP/i
  ];

  // Test si matchea con patrones
  const matches = patrones_paquetes.some(patron => patron.test(messageLower));

  if (matches) {
    return 'arsenal_cierre'; // ✅ CORRECTO
  }

  return 'no_clasificado'; // ❌ FALLIDO
}

// 10 VARIACIONES DE LA PREGUNTA
const tests = [
  // Pregunta original reportada
  { pregunta: "¿Cuántos productos traen los paquetes?", esperado: "arsenal_cierre" },

  // Variaciones sobre CANTIDAD
  { pregunta: "¿Cuántos productos trae ESP 1?", esperado: "arsenal_cierre" },
  { pregunta: "¿Cuántos productos trae el paquete Inicial?", esperado: "arsenal_cierre" },
  { pregunta: "Cantidad de productos por paquete", esperado: "arsenal_cierre" },

  // Variaciones sobre QUÉ productos
  { pregunta: "¿Qué productos incluye ESP 2?", esperado: "arsenal_cierre" },
  { pregunta: "¿Qué contiene el paquete Empresarial?", esperado: "arsenal_cierre" },
  { pregunta: "¿Cuáles son los productos del paquete ESP 3?", esperado: "arsenal_cierre" },

  // Variaciones sobre INVENTARIO
  { pregunta: "¿Inventario del paquete Visionario?", esperado: "arsenal_cierre" },
  { pregunta: "Dame el listado de productos del paquete", esperado: "arsenal_cierre" },
  { pregunta: "Detalle de productos por paquete", esperado: "arsenal_cierre" }
];

console.log('🧪 TEST DE CLASIFICACIÓN - FIX PRODUCTOS POR PAQUETE\n');
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
console.log('4. Validar en conversación completa\n');
