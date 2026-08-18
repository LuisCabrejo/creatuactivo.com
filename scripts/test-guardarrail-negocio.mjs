/**
 * Copyright © 2026 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * Batería del guardarraíl de negocio — promesas de ingreso.
 *
 * Este guardarraíl tiene más filo que el de salud, porque varias de las palabras
 * que vigila tienen uso legítimo en el corpus: la durabilidad es cierta cuando
 * habla del activo que se hereda, y las cifras del plan son correctas cuando las
 * dicta un pin. Por eso la batería pesa MÁS en la dirección negativa: bloquear
 * una respuesta buena le cuesta una venta al socio, y eso también es un daño.
 *
 * Tres garantías:
 *   1. BLOQUEA las promesas de ingreso, incluidas las dos que el motor produjo de
 *      verdad en la prueba del Director del 14 ago 2026.
 *   2. NO TOCA el copy legítimo: la apertura (que el Director decidió conservar),
 *      FREQ_05 con la herencia, las cifras dictadas, la cadencia del viernes.
 *   3. CERO FUEGO AMIGO contra TODOS los candados `<verbatim_lock>` del corpus —
 *      si un candado dispara, el guardarraíl estaría tumbando texto calibrado que
 *      se entrega palabra por palabra.
 *
 * Uso: node scripts/test-guardarrail-negocio.mjs   (exit 1 si algo falla)
 */

import fs from 'fs';

const SRC = fs.readFileSync('src/lib/wa-guardarrail-negocio.ts', 'utf8');

function extraerArray(nombre) {
  const ini = SRC.indexOf(`export const ${nombre}`);
  if (ini === -1) throw new Error(`No se encontró ${nombre}`);
  const fin = SRC.indexOf('\n];', ini);
  const regexes = [];
  for (const linea of SRC.slice(ini, fin).split('\n')) {
    const m = linea.match(/^\s*\/(.*)\/([a-z]*),\s*$/);
    if (m) regexes.push(new RegExp(m[1], m[2]));
  }
  if (!regexes.length) throw new Error(`${nombre} quedó vacío al extraer`);
  return regexes;
}

const RE = extraerArray('RE_PROMESA_INGRESO');
const norm = (t) => (t || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const detecta = (t) => { const n = norm(t); for (const re of RE) { const m = re.exec(n); if (m) return m[0].slice(0, 50); } return null; };

// ─── Lo que DEBE bloquearse ───────────────────────────────────────────────────
const PROMESAS = [
  // Las dos que el motor produjo de verdad (prueba del Director, 14 ago 2026)
  'El GEN5 le da ingreso inmediato para crecer. El Binario construye su ingreso recurrente de por vida.',
  'Gen 5 | 3.125 personas | ESP-2 | $75 USD | $234,375 USD — Total acumulado GEN5: $292,875 USD',
  // Perpetuidad
  'Es una renta vitalicia que le llega cada viernes.',
  'Le entra un ingreso de por vida.',
  'Sus comisiones seguirán llegando para siempre.',
  // Velocidad
  'El GEN5 es la forma de ganar dinero rápido.',
  'Va a tener retorno inmediato desde el primer día.',
  // Proyección con plazo
  'En seis meses estará ganando 4 millones al mes.',
  'Recupera su inversión en 90 días.',
  'A los 3 meses ya va a ganar más que su sueldo.',
  // Garantías
  'Es un ingreso garantizado.',
  'Le garantizo que va a recuperar la inversión.',
  // Reemplazo del empleo
  'Este negocio le va a reemplazar su salario.',
  'Con esto puede renunciar a su trabajo en un año.',
  // Pasivo
  'Es un ingreso pasivo.',
  'Usted gana dinero mientras duerme.',
  'El canal crece solo, sin que usted haga nada.',
  // Comisión contada en personas
  'Por cada persona que entre a su canal usted recibe $112.500 COP.',
  'Cada vez que un socio se vincula, gana $75 USD.',
  // Pirámide dibujada
  'Usted invita a 5, ellos invitan a 25, y esos a 125 personas.',
  'La progresión es 1, 2, 4, 8, 16 y así sucesivamente.',
];

// ─── Lo que NO puede bloquearse ───────────────────────────────────────────────
const LEGITIMAS = [
  // La apertura — el Director la revisó y decidió conservarla (17 ago 2026)
  'Le explico cómo se construye un canal de distribución en paralelo a su actividad, con el potencial de igualar o superar sus ingresos actuales.',
  // FREQ_05 — la durabilidad SÍ es legítima cuando habla del activo heredado
  'Es un activo a su nombre, y se transfiere como cualquier otro bien que usted deja. Sus clientes siguen pidiendo, y las comisiones que eso genera siguen llegando a su familia.',
  'Gano Excel traspasa el código a su cónyuge, a sus hijos o a sus padres cuando llega el momento.',
  // COMP_MODELO_01 corregido hoy
  'Su flujo de ganancias se alimenta de dos formas: el consumo que se repite, y la compra de paquetes empresariales en su canal.',
  'El volumen crece con cada compra que se repite, y Gano Excel le liquida por cada una de las que ocurren en su canal.',
  'Es un ingreso que no depende de que usted esté presente en cada venta.',
  // Cifras dictadas por los pines — legítimas
  'Con el ESP-3 Visionario arranca con 17% de Binario por 6 meses.',
  'Gen 1 | Su socio directo | $337.500 COP',
  'La caja trae 20 sobres y cuesta $110.900 COP.',
  'Hay tres formas de arrancar: ESP-1 $900.000, ESP-2 $2.250.000 y ESP-3 $4.500.000 COP.',
  // Hechos del modelo
  'Quien le consigna es Gano Excel, y lo hace en su cuenta bancaria cada viernes.',
  'Es un ingreso recurrente que sale de las compras que se repiten.',
  'Su compromiso mensual es una compra personal de 50 PV.',
  'El GEN5 se cuenta por paquetes comprados, no por personas.',
  'Cada vez que en su canal se compra un paquete empresarial, a usted le entra una comisión directa.',
  // Producto y método
  'Su día a día se resume en dos acciones: compartir y recibir.',
  'Gano Excel pone las fábricas, la investigación y la logística — 30 años, más de 60 países.',
  'Usted no cambia de hábito: eleva el que ya tiene.',
];

// ─── Cero fuego amigo: TODOS los candados del corpus ──────────────────────────
const CANDADOS = [];
for (const f of fs.readdirSync('knowledge_base').filter((x) => x.endsWith('.txt'))) {
  const t = fs.readFileSync(`knowledge_base/${f}`, 'utf8');
  [...t.matchAll(/<verbatim_lock>([\s\S]*?)<\/verbatim_lock>/g)].forEach((m, i) =>
    CANDADOS.push({ etiqueta: `${f} candado #${i + 1}`, texto: m[1] }));
}

// ─── Corrida ──────────────────────────────────────────────────────────────────
let fallos = 0;
const ok = (m) => console.log(`✅ ${m}`);
const mal = (m) => { console.log(`❌ ${m}`); fallos++; };

console.log('\n── Promesas de ingreso que deben bloquearse ──');
for (const c of PROMESAS) {
  const h = detecta(c);
  h ? ok(`[${h}] ${c.slice(0, 62)}…`) : mal(`NO BLOQUEÓ: "${c.slice(0, 88)}"`);
}

console.log('\n── Copy legítimo que NO puede bloquearse ──');
for (const c of LEGITIMAS) {
  const h = detecta(c);
  !h ? ok(c.slice(0, 68) + '…') : mal(`FALSO POSITIVO [${h}]: "${c.slice(0, 88)}"`);
}

console.log(`\n── Cero fuego amigo: ${CANDADOS.length} candados del corpus ──`);
let sucios = 0;
for (const c of CANDADOS) {
  const h = detecta(c.texto);
  if (h) { mal(`CANDADO BLOQUEADO [${h}] en ${c.etiqueta}`); sucios++; }
}
if (!sucios) ok(`los ${CANDADOS.length} candados pasan limpios`);

console.log('\n' + '─'.repeat(64));
if (fallos) { console.log(`❌ ${fallos} caso(s) fallaron`); process.exit(1); }
console.log('✅ Batería completa en verde');
