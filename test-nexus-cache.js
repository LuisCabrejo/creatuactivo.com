/**
 * Script de prueba para verificar Anthropic Prompt Caching en NEXUS
 *
 * Ejecuta 5 requests consecutivos para validar:
 * 1. Request 1: Cache WRITE (costo normal)
 * 2. Request 2-5: Cache HIT (90% descuento en tokens cacheados)
 */

const testQuestions = [
  '¿Qué es CreaTuActivo?',
  '¿Cómo funciona el sistema de 3 niveles?',
  '¿Cuál es la inversión inicial?',
  '¿Cuánto tiempo tarda en ver retorno?',
  '¿Cómo se gana dinero con CreaTuActivo?'
];

async function testNEXUSCache() {
  console.log('🧪 INICIANDO PRUEBA DE CACHE NEXUS\n');
  console.log('📊 Configuración:');
  console.log('   - Requests: 5');
  console.log('   - Bloques cacheables: 2 (System Prompt + Arsenal)');
  console.log('   - Duración de caché: 5 minutos');
  console.log('   - Descuento esperado: 90% en tokens cacheados\n');
  console.log('━'.repeat(80) + '\n');

  const sessionId = `test-session-${Date.now()}`;
  const fingerprint = `test-fp-${Date.now()}`;

  for (let i = 0; i < testQuestions.length; i++) {
    const question = testQuestions[i];
    console.log(`\n${'━'.repeat(80)}`);
    console.log(`📨 REQUEST ${i + 1}/5: "${question}"`);
    console.log(`${'━'.repeat(80)}\n`);

    const startTime = Date.now();

    try {
      const response = await fetch('http://localhost:3000/api/nexus', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'user',
              content: question
            }
          ],
          sessionId: sessionId,
          fingerprint: fingerprint
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      // Consumir el stream
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullResponse = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        fullResponse += chunk;
      }

      const duration = Date.now() - startTime;

      console.log(`✅ RESPUESTA RECIBIDA (${duration}ms)`);
      console.log(`📏 Longitud: ${fullResponse.length} caracteres`);

      if (i === 0) {
        console.log(`\n💡 Request 1: Se espera CACHE WRITE (costo normal)`);
      } else {
        console.log(`\n💰 Request ${i + 1}: Se espera CACHE HIT (90% descuento)`);
      }

      // Esperar 1 segundo entre requests
      if (i < testQuestions.length - 1) {
        console.log('\n⏳ Esperando 1 segundo antes del siguiente request...');
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

    } catch (error) {
      console.error(`❌ ERROR en request ${i + 1}:`, error.message);
    }
  }

  console.log('\n\n' + '━'.repeat(80));
  console.log('🏁 PRUEBA COMPLETADA');
  console.log('━'.repeat(80));
  console.log('\n📊 SIGUIENTE PASO:');
  console.log('   1. Revisa los logs del servidor (terminal con npm run dev)');
  console.log('   2. Busca el mensaje: "📦 CACHE STATUS: Usando Anthropic Prompt Caching"');
  console.log('   3. Ve al Anthropic Dashboard (https://console.anthropic.com)');
  console.log('   4. Verifica en la sección "Usage" el cache hit rate');
  console.log('   5. Esperado: >80% cache hit rate después del request 1\n');
}

// Ejecutar prueba
testNEXUSCache().catch(console.error);
