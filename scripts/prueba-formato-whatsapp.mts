// Markdown → WhatsApp (`src/lib/wa-formato.ts`): lo que el teléfono debe recibir.
// Sin modelo ni red; termina en exit 1 si algo no sale igual.
//
//   npx tsx scripts/prueba-formato-whatsapp.mts
import { aFormatoWhatsApp } from '../src/lib/wa-formato.ts';

const casos: Array<[string, string, string]> = [
  // 5 nov 2026: la composición del ESP-2 llegaba como «• **Total*:* *18*».
  ['total en negrita, tabla de dos columnas',
    '| Producto | Cajas |\n|---|---|\n| Ganocafé 3 en 1 | 6 |\n| **Total** | **18** |',
    '• *Ganocafé 3 en 1:* 6\n• *Total:* *18*'],
  ['etiqueta sin negrita queda igual',
    '| Dato | Valor |\n|---|---|\n| Precio | $272.500 |',
    '• *Precio:* $272.500'],
  ['tabla de tres columnas: bloque con título',
    '| Gen | Vinculaciones | Comisión |\n|---|---|---|\n| **1** | 2 | **$675.000** |',
    '*Gen 1*\nVinculaciones: 2\nComisión: *$675.000*'],
  ['negrita doble a simple', 'Es **su propio activo**.', 'Es *su propio activo*.'],
  ['marca interna fuera', '<verbatim_lock>Hola</verbatim_lock>', 'Hola'],
  ['texto limpio no se toca', 'Hola, ¿cómo está?', 'Hola, ¿cómo está?'],
];

let fallas = 0;
for (const [nombre, entrada, esperado] of casos) {
  const salida = aFormatoWhatsApp(entrada).trim();
  if (salida === esperado) { console.log(`✅ ${nombre}`); continue; }
  fallas++;
  console.log(`❌ ${nombre}\n   esperado: ${JSON.stringify(esperado)}\n   salió:    ${JSON.stringify(salida)}`);
}
console.log(`\n${casos.length - fallas}/${casos.length}`);
process.exit(fallas ? 1 : 0);
