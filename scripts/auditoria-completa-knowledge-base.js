// Auditoría Completa de Knowledge Base NEXUS
// Fecha: 2025-10-22
// Objetivo: Identificar gaps de clasificación para TODAS las secciones (SIST, VAL, ESC)

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

// ============================================
// FUNCIÓN: Simular clasificarDocumentoHibrido
// ============================================
function testClasificacion(userMessage) {
  const messageLower = userMessage.toLowerCase();

  // PATRONES DE PAQUETES (líneas 404-487 en route.ts)
  const patrones_paquetes = [
    /cuál.*inversión/i,
    /precio.*paquete/i,
    /cuesta.*empezar/i,
    /inversión.*inicial/i,
    /constructor.*inicial/i,
    /constructor.*empresarial/i,
    /constructor.*visionario/i,
    /paquete.*emprendedor/i,
    /cuánto.*cuesta.*(empezar|constructor|paquete|inversión|activar)/i,
    /inversión.*para/i,
    /costo.*activar/i,
    /precio.*fundador/i,
    /háblame.*paquetes/i,
    /sobre.*paquetes/i,
    /de.*los.*paquetes/i,
    /qué.*paquetes/i,
    /cuáles.*paquetes/i,
    /información.*paquetes/i,
    /paquetes.*disponibles/i,
    /paquetes.*hay/i,
    /tipos.*paquetes/i,
    /esp\s*1/i,
    /esp\s*2/i,
    /esp\s*3/i,
    /esp1/i,
    /esp2/i,
    /esp3/i,
    /paquete.*esp/i,
    /esp.*paquete/i,
    /cuántos.*productos.*paquete/i,
    /cuántos.*productos.*ESP/i,
    /cuántos.*productos.*trae/i,
    /cuántos.*productos.*incluye/i,
    /cuántos.*productos.*contiene/i,
    /cantidad.*productos.*paquete/i,
    /número.*productos.*paquete/i,
    /qué.*productos.*paquete/i,
    /qué.*productos.*ESP/i,
    /qué.*productos.*trae/i,
    /qué.*productos.*incluye/i,
    /qué.*contiene.*paquete/i,
    /qué.*viene.*paquete/i,
    /cuáles.*productos.*paquete/i,
    /cuáles.*productos.*ESP/i,
    /inventario.*paquete/i,
    /listado.*productos.*paquete/i,
    /lista.*productos.*paquete/i,
    /desglose.*paquete/i,
    /composición.*paquete/i,
    /detalle.*paquete/i,
    /detalle.*productos.*paquete/i,
    /ESP.*1.*productos/i,
    /ESP.*2.*productos/i,
    /ESP.*3.*productos/i,
    /Inicial.*productos/i,
    /Empresarial.*productos/i,
    /Visionario.*productos/i,
    /productos.*Inicial/i,
    /productos.*Empresarial/i,
    /productos.*Visionario/i,
    /qué.*viene.*ESP/i,
    /qué.*trae.*ESP/i,
    /qué.*incluye.*ESP/i
  ];

  // PATRONES DE CIERRE (líneas 624-661 en route.ts)
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
    /recompensa.*consumo/i
  ];

  // PATRONES DE INICIAL (líneas 589-606 en route.ts)
  const patrones_inicial = [
    /qué es.*creatuactivo/i,
    /retorno.*activo/i,
    /es.*heredable/i,
    /qué.*fundador/i,
    /quién.*detrás/i,
    /es.*confiable/i,
    /realmente.*funciona/i,
    /tiempo.*operando/i,
    /es.*legítimo/i,
    /^qué es esto$/i,
    /qué es.*ecosistema/i,
    /qué es.*plataforma/i,
    /información.*básica/i,
    /información.*general/i,
  ];

  // PATRONES DE MANEJO (líneas 608-622 en route.ts)
  const patrones_manejo = [
    /esto.*mlm/i,
    /es.*pirámide/i,
    /necesito.*experiencia/i,
    /no.*tengo.*tiempo/i,
    /me.*da.*miedo/i,
    /no.*sé.*vender/i,
    /datos.*personales/i,
    /puedo.*pausar/i,
    /cómo.*pagos/i,
    /funciona.*país/i,
    /qué.*soporte/i,
    /mucho.*trabajo/i,
    /automatiza.*80/i
  ];

  // VERIFICAR ORDEN DE PRIORIDAD (mismo que route.ts)

  // 1. Paquetes (arsenal_cierre)
  if (patrones_paquetes.some(patron => patron.test(messageLower))) {
    return { category: 'arsenal_cierre', reason: 'paquetes_pattern' };
  }

  // 2. Cierre
  if (patrones_cierre.some(patron => patron.test(messageLower))) {
    return { category: 'arsenal_cierre', reason: 'cierre_pattern' };
  }

  // 3. Inicial
  if (patrones_inicial.some(patron => patron.test(messageLower))) {
    return { category: 'arsenal_inicial', reason: 'inicial_pattern' };
  }

  // 4. Manejo
  if (patrones_manejo.some(patron => patron.test(messageLower))) {
    return { category: 'arsenal_manejo', reason: 'manejo_pattern' };
  }

  return { category: null, reason: 'no_pattern_match' };
}

// ============================================
// DEFINICIÓN DE TODAS LAS SECCIONES A AUDITAR
// ============================================
const SECCIONES_AUDITORIA = {
  // ARSENAL CIERRE - SIST (12 secciones)
  'SIST_01': {
    pregunta: '¿Cómo funciona el sistema de distribución?',
    esperado: 'arsenal_cierre',
    keywords: ['distribución', 'gano excel', 'constructor', 'creatuactivo']
  },
  'SIST_02': {
    pregunta: '¿Qué herramientas tecnológicas me proporciona el ecosistema?',
    esperado: 'arsenal_cierre',
    keywords: ['nexus', 'nodex', 'herramientas', 'tecnología']
  },
  'SIST_03': {
    pregunta: '¿Cómo escalo mi operación estratégicamente?',
    esperado: 'arsenal_cierre',
    keywords: ['escalar', 'framework iaa', 'iniciar', 'acoger', 'activar']
  },
  'SIST_04': {
    pregunta: '¿Dónde queda mi toque personal en un sistema tan automatizado?',
    esperado: 'arsenal_cierre',
    keywords: ['toque personal', 'automatización', 'confianza']
  },
  'SIST_05': {
    pregunta: '¿Qué diferencia esto de otros sistemas tecnológicos?',
    esperado: 'arsenal_cierre',
    keywords: ['diferencia', 'sistemas', 'competitiva']
  },
  'SIST_06': {
    pregunta: '¿Qué es el Modelo DEA?',
    esperado: 'arsenal_cierre',
    keywords: ['modelo dea', 'desarrollo estratégico', 'activos']
  },
  'SIST_07': {
    pregunta: '¿Qué me diferencia de los demás constructores?',
    esperado: 'arsenal_cierre',
    keywords: ['diferenciación', 'constructores', 'habilidades']
  },
  'SIST_08': {
    pregunta: '¿Qué tipo de personas ya están construyendo aquí?',
    esperado: 'arsenal_cierre',
    keywords: ['perfil', 'constructores', 'profesionales']
  },
  'SIST_09': {
    pregunta: '¿Cuál sería tu rol como mi mentor?',
    esperado: 'arsenal_cierre',
    keywords: ['mentor', 'guía', 'soporte']
  },
  'SIST_10': {
    pregunta: '¿Cuál es el plan de construcción para el primer año?',
    esperado: 'arsenal_cierre',
    keywords: ['plan', 'año', 'fases', 'meses']
  },
  'SIST_11': {
    pregunta: '¿Qué productos trae específicamente cada paquete?',
    esperado: 'arsenal_cierre',
    keywords: ['productos', 'paquete', 'esp 1', 'esp 2', 'esp 3']
  },
  'SIST_12': {
    pregunta: '¿Qué es el programa Auto Envío?',
    esperado: 'arsenal_cierre',
    keywords: ['auto envío', 'programa lealtad', 'beneficios']
  },

  // ARSENAL CIERRE - VAL (11 secciones)
  'VAL_01': {
    pregunta: '¿Cómo se gana en el negocio?',
    esperado: 'arsenal_cierre',
    keywords: ['gana', 'flujos', 'valor', 'corto plazo']
  },
  'VAL_02': {
    pregunta: '¿Puedes darme los detalles y porcentajes del modelo de valor?',
    esperado: 'arsenal_cierre',
    keywords: ['porcentajes', 'modelo', 'compensación', 'binario']
  },
  'VAL_03': {
    pregunta: '¿Mi ingreso depende de cuánta gente active?',
    esperado: 'arsenal_cierre',
    keywords: ['ingreso', 'gente', 'volumen', 'valor']
  },
  'VAL_04': {
    pregunta: '¿Cuánto puedo ganar realisticamente?',
    esperado: 'arsenal_cierre',
    keywords: ['ganar', 'realista', 'expectativas', 'mes']
  },
  'VAL_05': {
    pregunta: '¿Qué me están vendiendo exactamente?',
    esperado: 'arsenal_cierre',
    keywords: ['venden', 'arquitectura', 'activo', 'patrimonial']
  },
  'VAL_06': {
    pregunta: '¿En qué tiempo promedio veo resultados?',
    esperado: 'arsenal_cierre',
    keywords: ['tiempo', 'resultados', 'semana', 'estadística']
  },
  'VAL_07': {
    pregunta: '¿Normalmente qué estadística hay de éxito?',
    esperado: 'arsenal_cierre',
    keywords: ['estadística', 'éxito', 'activación', 'constructores']
  },
  'VAL_08': {
    pregunta: '¿Cuál paquete me recomienda para iniciar?',
    esperado: 'arsenal_cierre',
    keywords: ['paquete', 'recomienda', 'iniciar', 'esp']
  },
  'VAL_09': {
    pregunta: '¿Cuál es la arquitectura completa que incluye esto?',
    esperado: 'arsenal_cierre',
    keywords: ['arquitectura', 'completa', 'motor', 'plano']
  },
  'VAL_10': {
    pregunta: '¿Es lo mismo que otros sistemas de marketing que he visto?',
    esperado: 'arsenal_cierre',
    keywords: ['sistemas', 'marketing', 'diferente', 'ecosistema']
  },
  'VAL_11': {
    pregunta: '¿Qué significan PV, CV y GCV?',
    esperado: 'arsenal_cierre',
    keywords: ['pv', 'cv', 'gcv', 'volumen']
  },

  // ARSENAL CIERRE - ESC (5 secciones)
  'ESC_01': {
    pregunta: '¿Cuál sería mi siguiente paso?',
    esperado: 'arsenal_cierre',
    keywords: ['siguiente paso', 'conversación', 'activación']
  },
  'ESC_02': {
    pregunta: 'Quiero hablar con alguien del equipo',
    esperado: 'arsenal_cierre',
    keywords: ['hablar', 'equipo', 'contacto', 'liliana']
  },
  'ESC_03': {
    pregunta: '¿Cómo empiezo hoy mismo?',
    esperado: 'arsenal_cierre',
    keywords: ['empezar', 'hoy', 'activación', 'inmediato']
  },
  'ESC_04': {
    pregunta: '¿Puedo reservar mi lugar sin comprometerme completamente?',
    esperado: 'arsenal_cierre',
    keywords: ['reservar', 'lugar', 'compromiso']
  },
  'ESC_05': {
    pregunta: 'Me interesa pero necesito pensarlo',
    esperado: 'arsenal_cierre',
    keywords: ['pensarlo', 'tiempo', 'decisión', 'fundadores']
  },
};

// ============================================
// FUNCIÓN PRINCIPAL: Auditoría Completa
// ============================================
async function ejecutarAuditoriaCompleta() {
  console.log('🔍 AUDITORÍA COMPLETA - NEXUS KNOWLEDGE BASE\n');
  console.log('='.repeat(80));
  console.log('Objetivo: Identificar gaps de clasificación para 28 secciones\n');
  console.log('Secciones a auditar:');
  console.log('  - SIST (Sistema): 12 secciones');
  console.log('  - VAL (Valor): 11 secciones');
  console.log('  - ESC (Escalación): 5 secciones');
  console.log('  - Total: 28 secciones\n');
  console.log('='.repeat(80));

  let totalTests = 0;
  let testsPassed = 0;
  let testsFailed = 0;
  const failedSections = [];

  console.log('\n🧪 EJECUTANDO TESTS...\n');

  // Agrupar por categoría
  const categorias = {
    'SIST': [],
    'VAL': [],
    'ESC': []
  };

  for (const [seccion, config] of Object.entries(SECCIONES_AUDITORIA)) {
    const categoria = seccion.substring(0, seccion.indexOf('_'));
    categorias[categoria].push({ seccion, config });
  }

  // Ejecutar tests por categoría
  for (const [categoria, secciones] of Object.entries(categorias)) {
    console.log(`\n${'='.repeat(80)}`);
    console.log(`📋 CATEGORÍA: ${categoria} (${secciones.length} secciones)`);
    console.log('='.repeat(80));

    for (const { seccion, config } of secciones) {
      totalTests++;
      const resultado = testClasificacion(config.pregunta);
      const pass = resultado.category === config.esperado;

      if (pass) {
        testsPassed++;
        console.log(`\n✅ ${seccion}: PASS`);
      } else {
        testsFailed++;
        failedSections.push({
          seccion,
          pregunta: config.pregunta,
          esperado: config.esperado,
          obtenido: resultado.category || 'sin clasificación',
          reason: resultado.reason
        });
        console.log(`\n❌ ${seccion}: FAIL`);
      }

      console.log(`   Pregunta: "${config.pregunta}"`);
      console.log(`   Esperado: ${config.esperado}`);
      console.log(`   Obtenido: ${resultado.category || 'sin clasificación'}`);
      console.log(`   Razón: ${resultado.reason}`);
    }
  }

  // REPORTE FINAL
  console.log('\n\n' + '='.repeat(80));
  console.log('📊 RESUMEN DE AUDITORÍA');
  console.log('='.repeat(80));
  console.log(`\n✅ Tests pasados: ${testsPassed}/${totalTests} (${((testsPassed / totalTests) * 100).toFixed(1)}%)`);
  console.log(`❌ Tests fallidos: ${testsFailed}/${totalTests} (${((testsFailed / totalTests) * 100).toFixed(1)}%)`);

  if (testsFailed > 0) {
    console.log('\n\n' + '='.repeat(80));
    console.log('🔴 SECCIONES CON GAPS DE CLASIFICACIÓN');
    console.log('='.repeat(80));

    failedSections.forEach((fail, index) => {
      console.log(`\n${index + 1}. ${fail.seccion}`);
      console.log(`   Pregunta: "${fail.pregunta}"`);
      console.log(`   Esperado: ${fail.esperado}`);
      console.log(`   Obtenido: ${fail.obtenido}`);
      console.log(`   Razón: ${fail.reason}`);
    });

    console.log('\n\n' + '='.repeat(80));
    console.log('🔧 RECOMENDACIONES PARA CORREGIR GAPS');
    console.log('='.repeat(80));
    console.log('\nPara cada sección fallida, agregar patrones en route.ts:');
    console.log('\n1. Identificar keywords clave de la pregunta');
    console.log('2. Agregar patrones regex a la categoría correspondiente');
    console.log('3. Validar con test script antes de commit');
    console.log('\nEjemplo de patrones a agregar:');

    failedSections.forEach((fail) => {
      console.log(`\n// ${fail.seccion}`);
      // Generar sugerencias de patrones
      const words = fail.pregunta.toLowerCase().match(/\w+/g) || [];
      const suggestions = words
        .filter(w => w.length > 4 && !['cuál', 'qué', 'cómo', 'sería'].includes(w))
        .slice(0, 3);

      suggestions.forEach(word => {
        console.log(`/${word}/i,`);
      });
    });
  } else {
    console.log('\n\n🎉 ¡AUDITORÍA COMPLETADA CON ÉXITO!');
    console.log('✅ Todas las secciones tienen patrones de clasificación funcionando correctamente.\n');
  }

  // VERIFICAR CONTENIDO EN SUPABASE
  console.log('\n\n' + '='.repeat(80));
  console.log('🔵 VERIFICANDO CONTENIDO EN SUPABASE');
  console.log('='.repeat(80));

  try {
    const { data: documento, error } = await supabase
      .from('nexus_documents')
      .select('id, title, content, category')
      .eq('category', 'arsenal_cierre')
      .single();

    if (error) {
      console.error('❌ Error obteniendo documento:', error);
      return;
    }

    console.log('\n✅ Documento arsenal_cierre encontrado');
    console.log(`   ID: ${documento.id}`);
    console.log(`   Título: ${documento.title}`);
    console.log(`   Longitud: ${documento.content.length} caracteres\n`);

    // Verificar presencia de cada sección en el contenido
    console.log('📋 Verificando presencia de secciones en Supabase:\n');

    const seccionesPresentes = [];
    const seccionesFaltantes = [];

    for (const seccion of Object.keys(SECCIONES_AUDITORIA)) {
      const presente = documento.content.includes(seccion);
      if (presente) {
        seccionesPresentes.push(seccion);
        console.log(`   ✅ ${seccion}`);
      } else {
        seccionesFaltantes.push(seccion);
        console.log(`   ❌ ${seccion} - NO ENCONTRADO`);
      }
    }

    console.log(`\n📊 Presencia en Supabase: ${seccionesPresentes.length}/${Object.keys(SECCIONES_AUDITORIA).length} secciones encontradas`);

    if (seccionesFaltantes.length > 0) {
      console.log('\n⚠️ SECCIONES FALTANTES EN SUPABASE:');
      seccionesFaltantes.forEach(s => console.log(`   - ${s}`));
      console.log('\n💡 Acción requerida: Actualizar Supabase con contenido de arsenal_conversacional_complementario.txt');
    }

  } catch (err) {
    console.error('❌ Error verificando Supabase:', err);
  }

  console.log('\n' + '='.repeat(80));
  console.log('\n✅ AUDITORÍA COMPLETA FINALIZADA\n');

  // Generar archivo de reporte
  const reporte = {
    fecha: new Date().toISOString(),
    total: totalTests,
    pasados: testsPassed,
    fallidos: testsFailed,
    tasa_exito: `${((testsPassed / totalTests) * 100).toFixed(1)}%`,
    secciones_fallidas: failedSections
  };

  fs.writeFileSync(
    './scripts/REPORTE_AUDITORIA_KNOWLEDGE_BASE.json',
    JSON.stringify(reporte, null, 2)
  );

  console.log('📄 Reporte generado: scripts/REPORTE_AUDITORIA_KNOWLEDGE_BASE.json\n');

  return {
    success: testsFailed === 0,
    totalTests,
    testsPassed,
    testsFailed,
    failedSections
  };
}

// Ejecutar auditoría
ejecutarAuditoriaCompleta();
