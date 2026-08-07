/**
 * Copyright © 2026 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * Despliega el Flow del Simulador a Meta: crear → subir JSON → validar → publicar.
 *
 * Un Flow tiene dos estados. En BORRADOR ya se puede abrir, pero solo desde la
 * vista previa del administrador; nadie más lo ve. Al PUBLICAR queda disponible
 * para enviarlo a cualquier persona — y a partir de ahí su JSON no se puede
 * modificar: hay que crear una versión nueva. Por eso publicar es un paso aparte
 * y explícito, nunca el final automático de subir.
 *
 * Uso:
 *   node scripts/flows/desplegar-flow.mjs              # crea/actualiza el borrador y valida
 *   node scripts/flows/desplegar-flow.mjs --publicar   # además lo publica
 */

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import fs from 'fs';
import path from 'path';

const API      = 'https://graph.facebook.com/v22.0';
const WABA_ID  = process.env.WHATSAPP_WABA_ID;
const TOKEN    = process.env.WHATSAPP_SYSTEM_TOKEN;
const NOMBRE   = 'Simulador de ingresos';
const CATEGORIA = 'OTHER';   // el catálogo de Meta no tiene una categoría para simuladores
const RUTA_JSON = path.join(process.cwd(), 'knowledge_base', 'flows', 'simulador-gen5.json');

const publicar = process.argv.includes('--publicar');

if (!WABA_ID || !TOKEN) {
  console.error('❌ Faltan WHATSAPP_WABA_ID o WHATSAPP_SYSTEM_TOKEN en .env.local');
  process.exit(1);
}

const auth = { Authorization: `Bearer ${TOKEN}` };

async function graph(ruta, opciones = {}) {
  const res = await fetch(`${API}${ruta}`, { ...opciones, headers: { ...auth, ...opciones.headers } });
  const cuerpo = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`${res.status} — ${cuerpo?.error?.message || JSON.stringify(cuerpo)}`);
  return cuerpo;
}

// ── 1. ¿Ya existe? ────────────────────────────────────────────────────────────
// Se busca por nombre en vez de guardar el id en el repo: el id es distinto en
// cada WABA, y quien corra esto contra otra cuenta debe obtener el suyo.
const { data: flows = [] } = await graph(`/${WABA_ID}/flows?fields=id,name,status&limit=50`);
let flow = flows.find((f) => f.name === NOMBRE);

if (flow) {
  console.log(`📋 Flow existente: ${flow.id} (${flow.status})`);
  if (flow.status === 'PUBLISHED') {
    console.error(
      '\n⛔ Ese Flow ya está PUBLICADO y su JSON es inmutable.\n' +
      '   Para cambiarlo: renómbrelo en Meta (o cambie NOMBRE aquí) y despliegue uno nuevo,\n' +
      '   luego apunte WHATSAPP_FLOW_SIMULADOR_ID al id nuevo.',
    );
    process.exit(1);
  }
} else {
  flow = await graph(`/${WABA_ID}/flows`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: NOMBRE, categories: [CATEGORIA] }),
  });
  console.log(`✅ Flow creado: ${flow.id}`);
}

// ── 2. Subir el JSON ──────────────────────────────────────────────────────────
const contenido = fs.readFileSync(RUTA_JSON);
const form = new FormData();
form.append('name', 'flow.json');
form.append('asset_type', 'FLOW_JSON');
form.append('file', new Blob([contenido], { type: 'application/json' }), 'flow.json');

const subida = await graph(`/${flow.id}/assets`, { method: 'POST', body: form });

const errores = subida.validation_errors || [];
if (errores.length > 0) {
  console.error(`\n❌ ${errores.length} error(es) de validación:`);
  for (const e of errores) {
    console.error(`   · ${e.error_type || e.error}: ${e.message}`);
    if (e.pointers?.length) {
      for (const p of e.pointers) console.error(`     ↳ ${p.path || ''} ${p.line_start ? `línea ${p.line_start}` : ''}`);
    }
  }
  process.exit(1);
}
console.log('✅ Flow JSON subido y validado sin errores');

// ── 3. Publicar ───────────────────────────────────────────────────────────────
if (!publicar) {
  console.log(
    `\n📌 Queda en BORRADOR. Revíselo en WhatsApp Manager → Flows y, cuando esté bien:\n` +
    `   node scripts/flows/desplegar-flow.mjs --publicar\n\n` +
    `   FLOW_ID = ${flow.id}`,
  );
  process.exit(0);
}

await graph(`/${flow.id}/publish`, { method: 'POST' });
console.log(`\n🚀 Flow PUBLICADO — ${flow.id}`);
console.log(`   Agregue a .env.local y a Vercel:  WHATSAPP_FLOW_SIMULADOR_ID=${flow.id}`);
