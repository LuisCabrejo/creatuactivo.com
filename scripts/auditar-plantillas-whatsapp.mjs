/**
 * Copyright © 2026 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * Auditoría de las plantillas del WABA — categoría, estado y recategorizaciones.
 *
 * Por qué existe. Meta **recategoriza plantillas por su cuenta** y no avisa por
 * ningún canal que llegue a nosotros: el 21 ago 2026 encontramos tres pasadas de
 * UTILITY a MARKETING, y una de ellas —`enlace_canal_listo`— estaba en producción
 * entregándole el enlace a los socios nuevos. Cuando eso pasa, la plantilla deja
 * de entregarse a números de Estados Unidos y empieza a consumir el cupo diario
 * de marketing del buzón de la persona (compartido con TODAS las marcas que le
 * escriben). Se descubre porque alguien dice que no le llegó nada.
 *
 * El campo que lo delata es `previous_category`, que Meta conserva. Si difiere de
 * `category`, la plantilla fue movida.
 *
 * ⚠️ La categoría de una plantilla APROBADA no se puede cambiar (error_subcode
 * 3835031), y Meta **reserva el nombre** de las plantillas borradas. Recuperar
 * una plantilla recategorizada obliga a someter un nombre nuevo (`..._v2`).
 *
 * ⚠️ La regla que separa UTILITY de MARKETING, deducida de nuestra propia cuenta:
 * una plantilla es de utilidad mientras **entrega lo que se pidió y se calla**.
 * En cuanto explica para qué sirve o invita al paso siguiente, Meta la mueve.
 * No hay que redactar mal para perderla; basta redactar bien.
 *
 * Uso:
 *   node scripts/auditar-plantillas-whatsapp.mjs            # tabla resumen
 *   node scripts/auditar-plantillas-whatsapp.mjs --detalle  # + cuerpo y botones
 *
 * Sale con código 1 si hay alguna plantilla recategorizada, para poder colgarlo
 * de una revisión periódica.
 */

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const GRAPH   = 'https://graph.facebook.com/v24.0';
const WABA_ID = process.env.WHATSAPP_WABA_ID;
const TOKEN   = process.env.WHATSAPP_SYSTEM_TOKEN;
const DETALLE = process.argv.includes('--detalle');

if (!WABA_ID || !TOKEN) {
  console.error('❌ Faltan WHATSAPP_WABA_ID / WHATSAPP_SYSTEM_TOKEN en .env.local');
  process.exit(1);
}

const CAMPOS = 'name,status,category,previous_category,language,quality_score,rejected_reason,components';

const res  = await fetch(`${GRAPH}/${WABA_ID}/message_templates?fields=${CAMPOS}&limit=100`,
  { headers: { Authorization: `Bearer ${TOKEN}` } });
const data = await res.json();

if (!res.ok) {
  console.error('❌ Meta respondió con error:', JSON.stringify(data?.error ?? data, null, 2));
  process.exit(1);
}

const plantillas = data?.data ?? [];
const movidas    = plantillas.filter((t) => t.previous_category && t.previous_category !== t.category);

console.log(`\n📋 ${plantillas.length} plantillas en el WABA\n`);
console.log(
  '   ' + 'NOMBRE'.padEnd(26) + 'CATEGORÍA'.padEnd(17) + 'ANTES'.padEnd(12) + 'ESTADO'.padEnd(11) + 'CALIDAD',
);
console.log('   ' + '─'.repeat(78));

for (const t of plantillas.sort((a, b) => a.name.localeCompare(b.name))) {
  const movida = t.previous_category && t.previous_category !== t.category;
  console.log(
    (movida ? '⚠️ ' : '   ')
    + t.name.padEnd(26)
    + (t.category ?? '—').padEnd(17)
    + (movida ? t.previous_category : '—').padEnd(12)
    + (t.status ?? '—').padEnd(11)
    + (t.quality_score?.score ?? '—')
    + (t.rejected_reason && t.rejected_reason !== 'NONE' ? `  · ${t.rejected_reason}` : ''),
  );

  if (DETALLE) {
    for (const c of t.components ?? []) {
      if (c.type === 'BUTTONS') {
        const bs = (c.buttons ?? []).map((b) => `${b.type}:"${b.text}"${b.url ? ` → ${b.url}` : ''}`);
        console.log('      ↳ [BOTONES] ' + bs.join('  |  '));
      } else if (c.text) {
        console.log(`      ↳ [${c.type}] ` + c.text.replace(/\n/g, '\n                   '));
      }
    }
    console.log('');
  }
}

if (movidas.length) {
  console.log(`\n⚠️  ${movidas.length} plantilla(s) recategorizadas por Meta:\n`);
  for (const t of movidas) {
    console.log(`   · ${t.name}: ${t.previous_category} → ${t.category}`);
  }
  console.log('\n   Una plantilla movida a MARKETING deja de entregarse a números de');
  console.log('   Estados Unidos y consume cupo diario del buzón de la persona.');
  console.log('   La categoría de una aprobada NO se puede cambiar: hay que someter');
  console.log('   un nombre nuevo, con el texto reducido a entrega pura.\n');
  process.exit(1);
}

console.log('\n✅ Ninguna plantilla recategorizada\n');
