// Comparación de lista oficial vs contenido actual en knowledge base
// Fecha: 2025-10-22

// LISTA OFICIAL (de la imagen lista-de-productos-paquetes.png)
const listaOficial = {
  ESP1: {
    total: 7,
    productos: [
      { nombre: "GANOCAFÉ 3 IN 1", cantidad: 1 },
      { nombre: "GANOCAFÉ CLASSIC", cantidad: 1 },
      { nombre: "PIEL&BRILLO SHAMPOO", cantidad: 1 },
      { nombre: "PIEL&BRILLO ACONDICIONADOR", cantidad: 1 },
      { nombre: "GANORICO MOCHARICO", cantidad: 1 },
      { nombre: "GANO C'REAL SPIRULINA", cantidad: 1 },
      { nombre: "GANORICO LATTE RICO", cantidad: 1 }
    ]
  },
  ESP2: {
    total: 18,
    productos: [
      { nombre: "GANOCAFÉ 3 IN 1", cantidad: 4 },
      { nombre: "GANOCAFÉ CLASSIC", cantidad: 3 },
      { nombre: "GANO SOAP", cantidad: 1 },
      { nombre: "GANO FRESH TOOTHPASTE", cantidad: 1 },
      { nombre: "GANO TRANSPARENT SOAP", cantidad: 1 },
      { nombre: "PIEL&BRILLO SHAMPOO", cantidad: 1 },
      { nombre: "PIEL&BRILLO ACONDICIONADOR", cantidad: 1 },
      { nombre: "PIEL&BRILLO EXFOLIANTE CORPORAL", cantidad: 1 },
      { nombre: "GANORICO MOCHARICO", cantidad: 1 },
      { nombre: "GANO C'REAL SPIRULINA", cantidad: 1 },
      { nombre: "GANORICO LATTE RICO", cantidad: 1 },
      { nombre: "GANORICO SHOKORICO", cantidad: 1 },
      { nombre: "RESKINE COLLAGEN DRINK", cantidad: 1 }
    ]
  },
  ESP3: {
    total: 35,
    productos: [
      { nombre: "GANOCAFÉ 3 IN 1", cantidad: 10 },
      { nombre: "GANOCAFÉ CLASSIC", cantidad: 10 },
      { nombre: "GANO SOAP", cantidad: 1 },
      { nombre: "GANO FRESH TOOTHPASTE", cantidad: 1 },
      { nombre: "GANO TRANSPARENT SOAP", cantidad: 1 },
      { nombre: "PIEL&BRILLO SHAMPOO", cantidad: 1 },
      { nombre: "PIEL&BRILLO ACONDICIONADOR", cantidad: 1 },
      { nombre: "PIEL&BRILLO EXFOLIANTE CORPORAL", cantidad: 1 },
      { nombre: "GANO SCHOKOLADE", cantidad: 1 },
      { nombre: "GANORICO MOCHARICO", cantidad: 1 },
      { nombre: "OLEAF GANO ROOIBOS DRINK", cantidad: 1 },
      { nombre: "GANO C'REAL SPIRULINA", cantidad: 1 },
      { nombre: "GANORICO LATTE RICO", cantidad: 1 },
      { nombre: "GANORICO SHOKORICO", cantidad: 1 },
      { nombre: "RESKINE COLLAGEN DRINK", cantidad: 1 },
      { nombre: "GANODERMA CÁPSULAS", cantidad: 1 },
      { nombre: "EXCELLIUM CÁPSULAS", cantidad: 1 }
    ]
  }
};

// LISTA ACTUAL (del archivo arsenal_conversacional_complementario.txt)
const listaActual = {
  ESP1: {
    total: 7,
    productos: [
      { nombre: "Ganocafé 3 en 1", cantidad: 1 },
      { nombre: "Ganocafé Classic", cantidad: 1 },
      { nombre: "Piel&Brillo Shampoo", cantidad: 1 },
      { nombre: "Piel&Brillo Acondicionador", cantidad: 1 },
      { nombre: "Piel&Brillo Exfoliante Corporal", cantidad: 1 },
      { nombre: "Gano Fresh Toothpaste", cantidad: 1 },
      { nombre: "Gano Transparent Soap", cantidad: 1 }
    ]
  },
  ESP2: {
    total: 18,
    productos: [
      { nombre: "Ganocafé 3 en 1", cantidad: 4 },
      { nombre: "Ganocafé Classic", cantidad: 3 },
      { nombre: "Gano Soap", cantidad: 1 },
      { nombre: "Gano Fresh Toothpaste", cantidad: 1 },
      { nombre: "Gano Transparent Soap", cantidad: 1 },
      { nombre: "Ganó Rico MochaRico", cantidad: 1 },
      { nombre: "Gano C'Real Spirulina", cantidad: 1 },
      { nombre: "Ganorico Latte Rico", cantidad: 1 },
      { nombre: "Ganorico Shoko Rico", cantidad: 1 },
      { nombre: "Reskine Collagen Drink", cantidad: 1 },
      { nombre: "Ganoderma Cápsulas", cantidad: 1 },
      { nombre: "Excellium Cápsulas", cantidad: 1 }
    ]
  },
  ESP3: {
    total: 35,
    productos: [
      { nombre: "Ganocafé 3 en 1", cantidad: 10 },
      { nombre: "Ganocafé Classic", cantidad: 10 },
      { nombre: "Gano Soap", cantidad: 1 },
      { nombre: "Gano Fresh Toothpaste", cantidad: 1 },
      { nombre: "Gano Transparent Soap", cantidad: 1 },
      { nombre: "Gano Schokolade", cantidad: 1 },
      { nombre: "Oleaf Gano Rooibos Drink", cantidad: 1 },
      { nombre: "Gano C'Real Spirulina", cantidad: 1 },
      { nombre: "Ganorico Latte Rico", cantidad: 1 },
      { nombre: "Reskine Collagen Drink", cantidad: 1 },
      { nombre: "Ganoderma Cápsulas", cantidad: 1 },
      { nombre: "Excellium Cápsulas", cantidad: 1 }
    ]
  }
};

function compararPaquetes() {
  console.log('🔍 COMPARACIÓN: LISTA OFICIAL vs LISTA ACTUAL\n');
  console.log('='.repeat(80));

  let totalErrores = 0;

  ['ESP1', 'ESP2', 'ESP3'].forEach(paquete => {
    console.log(`\n📦 PAQUETE ${paquete}:\n`);

    const oficial = listaOficial[paquete];
    const actual = listaActual[paquete];

    // Comparar total
    console.log(`Total productos:`);
    console.log(`  Oficial: ${oficial.total} productos`);
    console.log(`  Actual:  ${actual.total} productos`);

    if (oficial.total !== actual.total) {
      console.log(`  ❌ ERROR: Total no coincide\n`);
      totalErrores++;
    } else {
      console.log(`  ✅ Total correcto\n`);
    }

    // Comparar productos
    console.log(`Productos:`);

    // Crear mapas para comparación
    const oficialMap = {};
    oficial.productos.forEach(p => {
      oficialMap[p.nombre.toLowerCase()] = p.cantidad;
    });

    const actualMap = {};
    actual.productos.forEach(p => {
      actualMap[p.nombre.toLowerCase()] = p.cantidad;
    });

    // Productos en oficial que faltan o difieren en actual
    oficial.productos.forEach(prod => {
      const key = prod.nombre.toLowerCase();
      const actualCantidad = actualMap[key];

      if (!actualCantidad) {
        console.log(`  ❌ FALTA en actual: ${prod.nombre} (${prod.cantidad}x)`);
        totalErrores++;
      } else if (actualCantidad !== prod.cantidad) {
        console.log(`  ❌ CANTIDAD DIFERENTE: ${prod.nombre}`);
        console.log(`     Oficial: ${prod.cantidad}x | Actual: ${actualCantidad}x`);
        totalErrores++;
      } else {
        console.log(`  ✅ ${prod.nombre} (${prod.cantidad}x)`);
      }
    });

    // Productos en actual que NO están en oficial
    actual.productos.forEach(prod => {
      const key = prod.nombre.toLowerCase();
      if (!oficialMap[key]) {
        console.log(`  ⚠️ EXTRA en actual (no en oficial): ${prod.nombre} (${prod.cantidad}x)`);
        totalErrores++;
      }
    });

    console.log('');
  });

  console.log('='.repeat(80));
  console.log(`\n📊 TOTAL DE DIFERENCIAS: ${totalErrores}\n`);

  if (totalErrores === 0) {
    console.log('✅ ¡LISTAS IDÉNTICAS! No hay errores.\n');
  } else {
    console.log('❌ HAY DIFERENCIAS - Requiere corrección\n');
    console.log('🔧 ERRORES DETECTADOS POR PAQUETE:\n');

    // Resumen de errores críticos
    console.log('ESP 1:');
    console.log('  ❌ FALTAN: Ganorico MochaRico, Gano C\'Real Spirulina, Ganorico Latte Rico');
    console.log('  ⚠️ SOBRAN: Piel&Brillo Exfoliante, Gano Fresh Toothpaste, Gano Transparent Soap\n');

    console.log('ESP 2:');
    console.log('  ❌ FALTAN: Piel&Brillo Shampoo, Piel&Brillo Acondicionador, Piel&Brillo Exfoliante');
    console.log('  ⚠️ SOBRAN: Ganoderma Cápsulas, Excellium Cápsulas\n');

    console.log('ESP 3:');
    console.log('  ❌ FALTAN: Piel&Brillo Shampoo, Piel&Brillo Acondicionador, Piel&Brillo Exfoliante');
    console.log('  ❌ FALTAN: Ganorico MochaRico, Ganorico ShokoRico\n');
  }

  console.log('💡 SIGUIENTE PASO:\n');
  console.log('Generar archivo corregido con la lista oficial\n');

  return totalErrores > 0;
}

const hayErrores = compararPaquetes();

if (hayErrores) {
  console.log('='.repeat(80));
  console.log('\n📝 CONTENIDO CORREGIDO PARA SIST_11:\n');
  console.log('Se generará el contenido correcto basado en la lista oficial...\n');
}
