/**
 * Copyright © 2026 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * Ejecuta SQL contra Supabase desde la línea de comandos.
 *
 * POR QUÉ EXISTE: hasta ahora toda migración había que pegarla a mano en el
 * editor SQL del panel. Eso hace lento cualquier cambio de esquema y, peor,
 * impide verificar el resultado en el mismo paso — se aplicaba a ciegas y se
 * comprobaba después por otro camino.
 *
 * POR QUÉ NO USA LA CONTRASEÑA DE LA BASE: se conecta por la API de gestión de
 * Supabase con un **token personal**, que se revoca desde el panel en un clic y
 * no da acceso directo a Postgres. La contraseña de la base no queda en ningún
 * archivo ni en el llavero.
 *
 * PREPARACIÓN (una sola vez):
 *   1. https://supabase.com/dashboard/account/tokens → Generate new token
 *   2. Agregar a .env.local:  SUPABASE_ACCESS_TOKEN=sbp_...
 *
 * USO:
 *   node scripts/sql.mjs archivo.sql            # ejecuta un archivo
 *   node scripts/sql.mjs -e "select now()"      # ejecuta SQL suelto
 *   node scripts/sql.mjs archivo.sql --dry      # solo muestra lo que enviaría
 *
 * ⚠️ Ejecuta lo que se le pase, incluido DROP. Antes de correr algo destructivo,
 * leerlo entero.
 */

import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const TOKEN = process.env.SUPABASE_ACCESS_TOKEN;

// El identificador del proyecto sale de la URL de Supabase, así que no hay que
// configurarlo aparte: https://<ref>.supabase.co
const REF = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').match(/https:\/\/([a-z0-9]+)\.supabase\.co/)?.[1];

if (!TOKEN) {
  console.error(
    '❌ Falta SUPABASE_ACCESS_TOKEN en .env.local\n\n' +
    '   1. Vaya a https://supabase.com/dashboard/account/tokens\n' +
    '   2. "Generate new token", nómbrelo (p. ej. "claude-code")\n' +
    '   3. Agregue a .env.local:  SUPABASE_ACCESS_TOKEN=sbp_...\n',
  );
  process.exit(1);
}
if (!REF) {
  console.error('❌ No pude deducir el proyecto desde NEXT_PUBLIC_SUPABASE_URL');
  process.exit(1);
}

const args = process.argv.slice(2);
const dry = args.includes('--dry');
const inline = args.indexOf('-e');
const sql = inline !== -1
  ? args[inline + 1]
  : fs.readFileSync(args.find((a) => a.endsWith('.sql')), 'utf8');

if (!sql?.trim()) {
  console.error('❌ Nada que ejecutar');
  process.exit(1);
}

console.log(`📡 Proyecto ${REF} · ${sql.length} caracteres de SQL`);
if (dry) {
  console.log('\n--- (solo vista previa, no se ejecuta) ---\n' + sql);
  process.exit(0);
}

const res = await fetch(`https://api.supabase.com/v1/projects/${REF}/database/query`, {
  method: 'POST',
  headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
  body: JSON.stringify({ query: sql }),
});

const cuerpo = await res.json().catch(() => null);

if (!res.ok) {
  console.error(`\n❌ ${res.status} — ${cuerpo?.message || JSON.stringify(cuerpo)}`);
  process.exit(1);
}

console.log('\n✅ Ejecutado');
if (Array.isArray(cuerpo) && cuerpo.length > 0) {
  console.table(cuerpo.slice(0, 25));
  if (cuerpo.length > 25) console.log(`   … y ${cuerpo.length - 25} filas más`);
} else if (Array.isArray(cuerpo)) {
  console.log('   (sin filas de retorno)');
}
