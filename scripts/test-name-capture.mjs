#!/usr/bin/env node
/**
 * Test script para verificar lógica de captura de nombre
 *
 * PROBLEMA: Usuario escribió "Rafael Guzmán" pero se capturó "observación"
 *
 * Este script simula la lógica de captureProspectData() para name extraction
 */

function testNameCapture(message) {
  console.log(`\n📝 Testing message: "${message}"`);
  console.log('─'.repeat(60));

  const data = {};
  const messageLower = message.toLowerCase();

  // Lógica exacta de route.ts lines 131-151
  const namePatterns = [
    /(?:me llamo|mi nombre es|soy)\s+([A-ZÀ-ÿ][a-zà-ÿ]+(?:\s+[A-ZÀ-ÿ][a-zà-ÿ]+)*)/i,
    /^([A-ZÀ-ÿ][a-zà-ÿ]+(?:\s+[A-ZÀ-ÿ][a-zà-ÿ]+)*)\s+es\s+mi\s+nombre/i,
    /^([A-ZÀ-ÿ][a-zà-ÿ]+(?:\s+[A-ZÀ-ÿ][a-zà-ÿ]+)*)\s*-/i,
    /^([A-ZÀ-ÿ][a-zà-ÿ]+(?:\s+[A-ZÀ-ÿ][a-zà-ÿ]+)*)\s+(?:y|dame|precio|cuánto|quiero|necesito|empezar|iniciar|a\)|b\)|c\)|d\)|e\)|f\))/i,
    /^([A-ZÀ-ÿ][a-zà-ÿ]+(?:\s+[A-ZÀ-ÿ][a-zà-ÿ]+)*)\s*$/
  ];

  for (let i = 0; i < namePatterns.length; i++) {
    const pattern = namePatterns[i];
    const match = message.match(pattern);
    if (match) {
      const capturedName = match[1].trim();
      if (capturedName.length >= 2) {
        data.name = capturedName;
        console.log(`✅ Pattern ${i + 1} MATCHED: "${data.name}"`);
        console.log(`   Pattern: ${pattern}`);
        break;
      }
    }
  }

  // Fallback simple (lines 152-172)
  if (!data.name && message.length < 30) {
    const simpleNameMatch = message.match(/^([A-ZÀ-ÿa-zà-ÿ]+(?:\s+[A-ZÀ-ÿa-zà-ÿ]+)?)\s*$/i);
    const nameBlacklist = /^(hola|gracias|si|sí|no|ok|bien|claro|perfecto|excelente|entiendo|estoy listo|el|la|los|las|ese|este|aquel|aquella|el más|el de|la de|lo de|para|con|sin|sobre|desde|hasta|quiero|necesito|dame|busco)$/i;

    if (simpleNameMatch && !messageLower.match(nameBlacklist)) {
      const capturedName = simpleNameMatch[1].trim();
      const startsWithArticle = /^(el|la|los|las|un|una|unos|unas)\s+/i.test(capturedName);

      if (capturedName.length >= 2 && !startsWithArticle) {
        data.name = capturedName;
        console.log(`✅ Fallback pattern MATCHED: "${data.name}"`);
      } else if (startsWithArticle) {
        console.log(`⚠️ Rejected (starts with article): "${capturedName}"`);
      }
    } else if (simpleNameMatch) {
      console.log(`⚠️ Rejected (blacklisted): "${simpleNameMatch[1]}"`);
    }
  }

  if (!data.name) {
    console.log('❌ NO MATCH - Name not captured');
  }

  return data.name || null;
}

// TEST CASES
console.log('\n🧪 NAME CAPTURE LOGIC TESTS');
console.log('═'.repeat(60));

// Valid names that SHOULD capture
testNameCapture('Rafael Guzmán');
testNameCapture('Me llamo Rafael Guzmán');
testNameCapture('Soy Rafael Guzmán');
testNameCapture('Luis');
testNameCapture('María José');

// User's actual problem case
testNameCapture('observación');

// NEXUS response fragments (should NOT capture)
testNameCapture('excelente observación');
testNameCapture('Excelente observación Rafael');

// Edge cases
testNameCapture('Rafael - dame el precio');
testNameCapture('Rafael y quiero empezar');

// Blacklisted words
testNameCapture('perfecto');
testNameCapture('excelente');
testNameCapture('gracias');

console.log('\n═'.repeat(60));
console.log('✅ Tests completed\n');
