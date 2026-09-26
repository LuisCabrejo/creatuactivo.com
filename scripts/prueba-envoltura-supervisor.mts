/**
 * La envoltura y el supervisor, contra los turnos reales de la prueba del
 * Director del 24 sep 2026 — con el modelo de verdad, sin tocar producción.
 *
 *   npx tsx scripts/prueba-envoltura-supervisor.mts
 *
 * 1. ENVOLTURA — el turno 21: «Si está bien, yo soy independiente y me va bien,
 *    ¿por qué debería hacer este negocio?». El texto aprobado de PERFIL_02 va
 *    literal; lo que se mide es lo de alrededor: que la apertura conecte con lo
 *    que él dijo (aceptó retomar con Liliana) y que el cierre NO ofrezca el día
 *    a día, que ya vio en el turno 9.
 * 2. SUPERVISOR — los tres borradores que inventaron el caso de Inglaterra
 *    (turnos 23, 27 y 28) tienen que salir marcados; una respuesta correcta,
 *    aprobada. Un revisor que marca de más es peor que ninguno.
 *
 * Cuesta unos centavos de API. Termina en error si algo falla.
 */
import fs from 'fs';
import dotenv from 'dotenv';
import Anthropic from '@anthropic-ai/sdk';
import { construirBitacora, type FilaBitacora } from '../src/lib/queswa-bitacora';
import { envolverTextoAprobado, armarTurno } from '../src/lib/queswa-envoltura';
import { revisarBorrador } from '../src/lib/queswa-supervisor';

dotenv.config({ path: '.env.local', quiet: true });
// Gasta de la clave de pruebas si existe (ver src/lib/consumo-anthropic.ts).
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY_PRUEBAS || process.env.ANTHROPIC_API_KEY });

const { filas, ficha } = JSON.parse(fs.readFileSync(new URL('./fixtures/prueba-director-24sep.json', import.meta.url), 'utf8')) as {
  filas: FilaBitacora[]; ficha: Record<string, unknown>;
};
const usuario = (n: number) => filas[n - 1].messages!.find((m) => m.role === 'user')!.content;
const bot = (n: number) => filas[n - 1].messages!.find((m) => m.role === 'assistant')!.content;
const antesDe = (n: number) => construirBitacora(filas.slice(0, n - 1), ficha);

const lockDe = (archivo: string, id: string) => {
  const t = fs.readFileSync(`knowledge_base/${archivo}`, 'utf8');
  const i = t.indexOf(id);
  return t.slice(i).match(/<verbatim_lock>([\s\S]*?)<\/verbatim_lock>/)![1].trim();
};

let fallas = 0;
const ok = (cond: boolean, que: string) => { console.log(`${cond ? '✅' : '❌'} ${que}`); if (!cond) fallas++; };

console.log('\n── 1. La envoltura del turno 21 (PERFIL_02) ──');
{
  const nucleo = lockDe('arsenal_inicial.txt', '### **PERFIL_02');
  const e = await envolverTextoAprobado({
    anthropic, bitacora: antesDe(21), mensajePersona: usuario(21), ultimoBot: bot(20),
    nucleo, cierrePorDefecto: '¿Le muestro qué haría usted en el día a día?',
  });
  console.log(`   origen: ${e.origen} · ${e.ms} ms`);
  console.log(`   apertura: «${e.apertura}»`);
  console.log(`   cierre:   «${e.cierre}»`);
  ok(!/d[ií]a a d[ií]a/i.test(e.cierre), 'el cierre no ofrece el día a día, que ya vio en el turno 9');
  ok(!/buena pregunta|toda la raz[oó]n/i.test(e.apertura), 'la apertura no elogia la pregunta');
  const turno = armarTurno(e, nucleo);
  ok(turno.includes(nucleo), 'el texto aprobado sale literal, entero');
}

console.log('\n── 2. El supervisor ──');
{
  const material = [
    lockDe('arsenal_inicial.txt', '### **DIASPORA_01'),
    'Tres formas de empezar: Kit de Inicio ($443.600 COP), ESP-1 Inicial ($900.000 COP), ESP-2 Empresarial ($2.250.000 COP), ESP-3 Visionario ($4.500.000 COP). El ESP-3 trae 35 productos.',
  ].join('\n\n');
  for (const n of [23, 27, 28]) {
    const v = await revisarBorrador({ anthropic, bitacora: antesDe(n).texto, material, mensajePersona: usuario(n), borrador: bot(n) });
    console.log(`   turno ${n}: ${v.ok ? 'aprobado' : `${v.problema} — ${v.detalle}`} (${v.ms} ms)${v.error ? ` · ${v.error}` : ''}`);
    ok(!v.ok, `turno ${n}: el borrador que inventó el caso de Inglaterra sale marcado`);
  }
  const bueno = 'Tiene razón, eso ya lo vimos.\n\nDesde Inglaterra sí se puede: su sistema se ancla al país de América por el que se registre, que es uno de los 16 donde Gano Excel tiene operación. Los productos se envían a una dirección dentro de ese país —puede ser la de un familiar de confianza— y sus comisiones se pagan a una cuenta bancaria de ese mismo país. Desde Londres, usted maneja todo a distancia.\n\n¿Por cuál país se registraría?';
  const v = await revisarBorrador({ anthropic, bitacora: antesDe(23).texto, material, mensajePersona: usuario(23), borrador: bueno });
  console.log(`   respuesta correcta al 23: ${v.ok ? 'aprobada' : `${v.problema} — ${v.detalle}`} (${v.ms} ms)`);
  ok(v.ok, 'una respuesta correcta sale aprobada');
}

console.log(fallas ? `\n❌ ${fallas} falla(s)` : '\n✅ Todo en orden');
process.exit(fallas ? 1 : 0);
