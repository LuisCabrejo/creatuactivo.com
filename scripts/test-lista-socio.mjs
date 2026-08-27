/**
 * Copyright © 2026 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * Batería de la lista del café.
 *
 * Lo que verifica es que el socio pueda dictar su lista COMO LA DICE —de corrido,
 * con comas, con «y», numerada, con viñetas, con apodos— y que Queswa no confunda
 * una frase con un nombre. Si un «déjame pensarlo» entra como contacto llamado
 * así, el socio ve basura en su propia lista y deja de confiar en la herramienta.
 *
 * Uso: node scripts/test-lista-socio.mjs   (exit 1 si algo falla)
 */

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Se replica `extraerNombres` leyendo el .ts, para que si allá cambia y aquí no,
// la prueba no siga validando una versión que ya no existe.
const SRC = fs.readFileSync('src/lib/wa-lista-socio.ts', 'utf8');
const cuerpo = SRC.slice(SRC.indexOf('export function extraerNombres'));
const firma  = cuerpo.slice(cuerpo.indexOf('(texto'), cuerpo.indexOf('\n}') + 2).replace(/: string(\[\])?/g, '');
// eval de una EXPRESIÓN, no de una declaración: dentro de un módulo ES una
// declaración no crea enlace en el ámbito y la función quedaba indefinida.
const extraerNombres = eval(`(function ${firma})`);

let fallos = 0;
const ok = (c, m) => { console.log(c ? '✅' : '❌', m); if (!c) fallos++; };

console.log('\n── El socio dicta su lista como se le ocurre ──\n');
const CASOS = [
  ['Beto, Juan Carlos, Marta, mi compadre Nelson y Patricia', 5, 'con comas y un «y» al final'],
  ['1. Beto\n2. Juan Carlos\n3. Marta',                        3, 'numerada'],
  ['- Beto\n- Marta\n- Nelson',                                3, 'con viñetas'],
  ['Beto; Marta; Nelson',                                      3, 'con punto y coma'],
  ['mi compadre Beto y mi cuñada Marta',                       2, 'con apodos de parentesco'],
];
for (const [texto, esperado, etiqueta] of CASOS) {
  const n = extraerNombres(texto);
  ok(n.length === esperado, `${etiqueta.padEnd(30)} → ${n.length}: ${JSON.stringify(n)}`);
}

console.log('\n── Y lo que NO es un nombre no entra ──\n');
const NO = [
  ['déjame pensarlo y te digo mañana',                    'una frase de aplazamiento'],
  ['¿cuántas personas necesito?',                          'una pregunta'],
  ['todavía no tengo la lista lista, la armo esta noche',  'una explicación larga'],
  ['',                                                     'un mensaje vacío'],
];
for (const [texto, etiqueta] of NO) {
  const n = extraerNombres(texto);
  ok(n.length === 0, `${etiqueta.padEnd(30)} → ${n.length === 0 ? 'nada, correcto' : JSON.stringify(n)}`);
}

console.log('\n── La tabla: acumula sin duplicar ──\n');
const s = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const FP = 'wa_bateria_lista';
await s.from('wa_lista_socio').delete().eq('socio_fp', FP);

// Réplica de guardarLista(): se filtra a mano contra lo que ya está. El upsert
// con onConflict NO sirve aquí — el índice único va sobre lower(nombre), que es
// una expresión, y PostgREST no puede apuntarle con nombres de columna.
const meter = async (nombres, desde) => {
  const { data } = await s.from('wa_lista_socio').select('nombre').eq('socio_fp', FP);
  const yaEstan = new Set((data || []).map((f) => f.nombre.toLowerCase()));
  const nuevas = nombres
    .map((nombre, i) => ({ socio_fp: FP, nombre, orden: desde + i }))
    .filter((f) => !yaEstan.has(f.nombre.toLowerCase()));
  if (nuevas.length) await s.from('wa_lista_socio').insert(nuevas);
};

await meter(['Beto', 'Marta', 'Nelson'], 1);
const { data: d1 } = await s.from('wa_lista_socio').select('nombre').eq('socio_fp', FP);
ok(d1?.length === 3, `entran los tres primeros (${d1?.length})`);

await meter(['Beto', 'Patricia'], 4);   // Beto repetido
const { data: d2 } = await s.from('wa_lista_socio').select('nombre').eq('socio_fp', FP);
ok(d2?.length === 4, `agrega Patricia y NO duplica a Beto (${d2?.length})`);

const { data: sig } = await s.from('wa_lista_socio')
  .select('nombre, orden').eq('socio_fp', FP).eq('estado', 'pendiente')
  .order('orden', { ascending: true }).limit(1).maybeSingle();
ok(sig?.nombre === 'Beto', `el siguiente respeta el orden en que él los nombró: ${sig?.nombre}`);

await s.from('wa_lista_socio').update({ estado: 'enviado' }).eq('socio_fp', FP).eq('nombre', 'Beto');
const { data: sig2 } = await s.from('wa_lista_socio')
  .select('nombre').eq('socio_fp', FP).eq('estado', 'pendiente')
  .order('orden', { ascending: true }).limit(1).maybeSingle();
ok(sig2?.nombre === 'Marta', `tras marcar a Beto, sigue Marta: ${sig2?.nombre}`);

await s.from('wa_lista_socio').delete().eq('socio_fp', FP);

// ─── Los detectores de las tres operaciones ──────────────────────────────────
// Van dictados por el backend, así que un falso positivo NO produce una respuesta
// rara: produce que el socio reciba un texto fijo que no pidió, y que el turno se
// corte sin llegar al motor. Por eso la dirección negativa pesa igual que la otra.
const uno = (n) => new RegExp(SRC.match(new RegExp(`const ${n} = /(.*)/;`))[1]);
const SIN_RUMBO = uno('RE_SIN_RUMBO'), YA_ENVIE = uno('RE_YA_ENVIE'), COMO_VA = uno('RE_COMO_VA_LISTA');
const nm = (t) => t.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

console.log('\n── Los tres detectores de la lista ──\n');
const OPS = [
  ['no sé por dónde empezar',            SIN_RUMBO, true,  'pide ayuda para arrancar'],
  ['¿a quién le escribo primero?',       SIN_RUMBO, true,  'otra forma'],
  ['ayúdeme a arrancar',                 SIN_RUMBO, true,  'y otra'],
  ['ya se lo mandé',                     YA_ENVIE,  true,  'dice que ya envió'],
  ['listo, ya le escribí',               YA_ENVIE,  true,  'otra forma'],
  ['hecho',                              YA_ENVIE,  true,  'la más corta'],
  ['¿cómo va mi lista?',                 COMO_VA,   true,  'pregunta por la lista'],
  ['¿a quiénes me falta?',               COMO_VA,   true,  'otra forma'],
];
for (const [msg, re, esperado, etiqueta] of OPS)
  ok(re.test(nm(msg)) === esperado, `${etiqueta.padEnd(28)} «${msg}»`);

console.log('\n── Y lo que NO debe disparar ninguno ──\n');
const NADA = [
  '¿cuánto cuesta el ESP-1?',
  'quiero ver los productos',
  '¿cómo funciona el binario?',
  'Beto es mi amigo del colegio, tiene una ferretería',
];
for (const msg of NADA) {
  const cual = [['sin rumbo',SIN_RUMBO],['ya envié',YA_ENVIE],['cómo va',COMO_VA]]
    .filter(([, re]) => re.test(nm(msg))).map(([n]) => n);
  ok(cual.length === 0, `${cual.length ? '⚠️ dispara ' + cual.join(', ') : 'no dispara nada'} — «${msg}»`);
}

console.log(`\n${'─'.repeat(64)}`);
console.log(fallos ? `❌ ${fallos} fallaron` : '✅ la lista se dicta de cualquier forma, no admite frases, no se duplica, y los detectores no se pisan');
process.exit(fallos ? 1 : 0);
