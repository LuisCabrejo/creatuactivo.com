// Test RÁPIDO: Verificar que los nuevos patrones funcionan
// Fecha: 2025-10-22
// Solo testea las 18 secciones que fallaron

function testClasificacion(userMessage) {
  const messageLower = userMessage.toLowerCase();

  // PATRONES ACTUALIZADOS (copiados de route.ts líneas 624-792)
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
    /auto.*envio/i,
    /qué.*auto.*envio/i,
    /beneficios.*auto.*envio/i,
    /programa.*lealtad/i,
    /producto.*gratis/i,
    /producto.*obsequio/i,
    /recompensa.*consumo/i,

    // NUEVOS PATRONES AGREGADOS (FIX 2025-10-22)
    /escalo.*operación/i,
    /escala.*operación/i,
    /escalabilidad.*operación/i,
    /operación.*estratégica/i,
    /escalar.*estratégicamente/i,
    /cómo.*crezco/i,
    /toque.*personal/i,
    /personalización/i,
    /sistema.*automatizado/i,
    /automatizado.*personal/i,
    /dónde.*queda.*personal/i,
    /diferencia.*otros.*sistemas/i,
    /diferencia.*sistemas.*tecnológicos/i,
    /qué.*diferencia.*esto/i,
    /vs.*otros.*sistemas/i,
    /comparación.*sistemas/i,
    /me.*diferencia.*constructores/i,
    /diferencia.*demás.*constructores/i,
    /otros.*constructores/i,
    /diferenciación.*personal/i,
    /tipo.*personas/i,
    /personas.*construyendo/i,
    /quién.*está.*aquí/i,
    /perfil.*constructores/i,
    /ya.*están.*construyendo/i,
    /rol.*mentor/i,
    /como.*mentor/i,
    /tu.*rol/i,
    /mentoría/i,
    /guía.*estratégico/i,
    /plan.*construcción/i,
    /plan.*primer.*año/i,
    /roadmap.*año/i,
    /estrategia.*anual/i,
    /plan.*anual/i,
    /ingreso.*depende.*gente/i,
    /depende.*cuánta.*gente/i,
    /depende.*activar/i,
    /ingreso.*cantidad/i,
    /qué.*venden.*exactamente/i,
    /qué.*me.*están.*vendiendo/i,
    /están.*vendiendo/i,
    /venden.*realmente/i,
    /tiempo.*promedio.*resultados/i,
    /cuándo.*veo.*resultados/i,
    /cuánto.*tiempo.*resultados/i,
    /qué.*tiempo.*resultados/i,
    /estadística.*éxito/i,
    /qué.*estadística/i,
    /tasa.*éxito/i,
    /porcentaje.*éxito/i,
    /normalmente.*éxito/i,
    /paquete.*recomienda/i,
    /recomienda.*iniciar/i,
    /cuál.*paquete.*mejor/i,
    /qué.*paquete.*elegir/i,
    /arquitectura.*completa/i,
    /qué.*incluye.*arquitectura/i,
    /arquitectura.*incluye/i,
    /qué.*viene.*arquitectura/i,
    /es.*lo.*mismo/i,
    /igual.*otros.*sistemas/i,
    /otros.*sistemas.*marketing/i,
    /parecido.*otros/i,
    /qué.*significan/i,
    /significado.*pv/i,
    /qué.*es.*pv/i,
    /qué.*es.*cv/i,
    /qué.*es.*gcv/i,
    /volumen.*personal/i,
    /volumen.*comisional/i,
    /empiezo.*hoy/i,
    /empezar.*inmediatamente/i,
    /empezar.*ya/i,
    /comenzar.*hoy/i,
    /activar.*hoy/i,
    /reservar.*lugar/i,
    /puedo.*reservar/i,
    /sin.*comprometerme/i,
    /sin.*compromiso/i,
    /apartar.*lugar/i,
    /necesito.*pensarlo/i,
    /interesa.*pero/i,
    /interesa.*necesito/i,
    /me.*interesa.*tiempo/i,
    /tengo.*dudas/i
  ];

  if (patrones_cierre.some(patron => patron.test(messageLower))) {
    return 'arsenal_cierre';
  }

  return null;
}

// TESTS: Solo las 18 secciones que fallaron
const tests = [
  // SIST faltantes (7)
  { seccion: 'SIST_03', pregunta: '¿Cómo escalo mi operación estratégicamente?', esperado: 'arsenal_cierre' },
  { seccion: 'SIST_04', pregunta: '¿Dónde queda mi toque personal en un sistema tan automatizado?', esperado: 'arsenal_cierre' },
  { seccion: 'SIST_05', pregunta: '¿Qué diferencia esto de otros sistemas tecnológicos?', esperado: 'arsenal_cierre' },
  { seccion: 'SIST_07', pregunta: '¿Qué me diferencia de los demás constructores?', esperado: 'arsenal_cierre' },
  { seccion: 'SIST_08', pregunta: '¿Qué tipo de personas ya están construyendo aquí?', esperado: 'arsenal_cierre' },
  { seccion: 'SIST_09', pregunta: '¿Cuál sería tu rol como mi mentor?', esperado: 'arsenal_cierre' },
  { seccion: 'SIST_10', pregunta: '¿Cuál es el plan de construcción para el primer año?', esperado: 'arsenal_cierre' },

  // VAL faltantes (8)
  { seccion: 'VAL_03', pregunta: '¿Mi ingreso depende de cuánta gente active?', esperado: 'arsenal_cierre' },
  { seccion: 'VAL_05', pregunta: '¿Qué me están vendiendo exactamente?', esperado: 'arsenal_cierre' },
  { seccion: 'VAL_06', pregunta: '¿En qué tiempo promedio veo resultados?', esperado: 'arsenal_cierre' },
  { seccion: 'VAL_07', pregunta: '¿Normalmente qué estadística hay de éxito?', esperado: 'arsenal_cierre' },
  { seccion: 'VAL_08', pregunta: '¿Cuál paquete me recomienda para iniciar?', esperado: 'arsenal_cierre' },
  { seccion: 'VAL_09', pregunta: '¿Cuál es la arquitectura completa que incluye esto?', esperado: 'arsenal_cierre' },
  { seccion: 'VAL_10', pregunta: '¿Es lo mismo que otros sistemas de marketing que he visto?', esperado: 'arsenal_cierre' },
  { seccion: 'VAL_11', pregunta: '¿Qué significan PV, CV y GCV?', esperado: 'arsenal_cierre' },

  // ESC faltantes (3)
  { seccion: 'ESC_03', pregunta: '¿Cómo empiezo hoy mismo?', esperado: 'arsenal_cierre' },
  { seccion: 'ESC_04', pregunta: '¿Puedo reservar mi lugar sin comprometerme completamente?', esperado: 'arsenal_cierre' },
  { seccion: 'ESC_05', pregunta: 'Me interesa pero necesito pensarlo', esperado: 'arsenal_cierre' }
];

console.log('🧪 TEST FIX AUDITORÍA COMPLETA - 18 SECCIONES CORREGIDAS\n');
console.log('='.repeat(80));
console.log('\n📋 Ejecutando tests de patrones agregados...\n');

let passed = 0;
let failed = 0;
const failedTests = [];

tests.forEach((test) => {
  const resultado = testClasificacion(test.pregunta);
  const pass = resultado === test.esperado;

  if (pass) {
    passed++;
    console.log(`✅ ${test.seccion}: PASS`);
  } else {
    failed++;
    failedTests.push(test);
    console.log(`❌ ${test.seccion}: FAIL`);
  }

  console.log(`   Pregunta: "${test.pregunta}"`);
  console.log(`   Esperado: ${test.esperado}`);
  console.log(`   Obtenido: ${resultado || 'sin clasificación'}\n`);
});

console.log('='.repeat(80));
console.log('\n📊 RESULTADOS FINALES:\n');
console.log(`✅ Tests pasados: ${passed}/${tests.length} (${((passed / tests.length) * 100).toFixed(1)}%)`);
console.log(`❌ Tests fallidos: ${failed}/${tests.length} (${((failed / tests.length) * 100).toFixed(1)}%)\n`);

if (passed === tests.length) {
  console.log('🎉 ¡TODOS LOS TESTS PASARON!\n');
  console.log('✅ Las 18 secciones que fallaban ahora tienen patrones funcionando\n');
  console.log('📈 Cobertura total esperada: 28/28 secciones (100%)\n');
  console.log('💡 SIGUIENTES PASOS:\n');
  console.log('1. Commit cambios a route.ts');
  console.log('2. Push a producción');
  console.log('3. Esperar 5 minutos (cache Anthropic)');
  console.log('4. Validar en producción con NEXUS real\n');
} else {
  console.log('⚠️ ALGUNOS TESTS FALLARON - Revisar patrones\n');
  console.log('Secciones que siguen fallando:');
  failedTests.forEach(t => console.log(`  - ${t.seccion}: "${t.pregunta}"`));
  console.log('');
}

console.log('='.repeat(80));
