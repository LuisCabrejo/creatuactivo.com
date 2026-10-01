/**
 * Copyright © 2026 CreaTuActivo.com
 *
 * El enlace «este dispositivo es mío» de un socio.
 *
 *   npx tsx scripts/enlace-dispositivo-socio.mts <constructor_id>
 *   npx tsx scripts/enlace-dispositivo-socio.mts luis-cabrejo-1288
 *
 * El socio lo abre una vez en cada teléfono o computador con el que mira sus
 * propios enlaces, y la campanita deja de avisarle de sí mismo. No caduca: es
 * identidad, no sesión. Por qué y cómo se firma → src/lib/dispositivo-socio.ts.
 */
import { config } from 'dotenv'; config({ path: '.env.local', quiet: true });
import { firmaDispositivoSocio } from '../src/lib/dispositivo-socio.ts';

const constructorId = (process.argv[2] || '').trim().toLowerCase();
if (!constructorId) {
  console.error('Uso: npx tsx scripts/enlace-dispositivo-socio.mts <constructor_id>');
  process.exit(1);
}
const firma = await firmaDispositivoSocio(constructorId);
if (!firma) {
  console.error('Falta WA_BRIDGE_SECRET en .env.local');
  process.exit(1);
}
console.log(`https://creatuactivo.com/mi-dispositivo?c=${encodeURIComponent(constructorId)}&f=${firma}`);
