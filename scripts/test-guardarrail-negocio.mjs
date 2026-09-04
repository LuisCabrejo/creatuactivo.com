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
// ⚠️ La mezcla precio+comisión NO es un patrón del array: las dos cifras viven en
// párrafos distintos y los patrones usan [^.] para no cruzar oraciones. Se
// comprueba aparte, sobre el mensaje entero, igual que en el módulo.
const unaRe = (nombre) => new RegExp(SRC.match(new RegExp(`const ${nombre}\\s*=\\s*/(.*)/;`))[1]);
const RE_PRECIO = unaRe('RE_PRECIO_ENTRADA');
const RE_COMIS  = unaRe('RE_COMISION_LLEGA');

const detecta = (t) => {
  const n = norm(t);
  for (const re of RE) { const m = re.exec(n); if (m) return m[0].slice(0, 50); }
  if (RE_PRECIO.test(n) && RE_COMIS.test(n)) return 'precio de entrada + comisión en el mismo mensaje';
  return null;
};

// ─── Lo que DEBE bloquearse ───────────────────────────────────────────────────
const PROMESAS = [
  // ── Esfuerzo mínimo dicho del NEGOCIO (27 ago 2026) — sigue bloqueándose ──
  'Usted comparte el enlace y no tiene que hacer nada más: el canal crece solo.',
  'Con este negocio usted no tiene que hacer nada, el sistema trabaja por usted.',
  // Las dos que el motor produjo de verdad (prueba del Director, 14 ago 2026)
  'El GEN5 le da ingreso inmediato para crecer. El Binario construye su ingreso recurrente de por vida.',
  'Gen 5 | 3.125 personas | ESP-2 | $75 USD | $234,375 USD — Total acumulado GEN5: $292,875 USD',
  // Dos cifras comparadas entre tarifas (1 sep 2026): la grande es derivada y
  // el marco es el que el Director retiró el 26 ago.
  'El mismo canal de 8.190 distribuidores, con el ESP-3 al 17%, genera cerca de $175 millones COP al mes en lugar de los $103 millones del Kit.',
  // El GEN5 en personas con el verbo en infinitivo (1 sep 2026).
  'La segunda es por paquetes empresariales: cada vez que alguien decide entrar como distribuidor a través de su canal, usted recibe una comisión por ese paquete.',
  // La tabla canónica derivada a otra tarifa (1 sep 2026): $175 millones al 17%.
  '| Distribuidores consumiendo | CV al mes por lado | Regalía mensual 17% |\n|---|---|---|\n| 8.190 | 229.320 | $175.430.000 |',
  // La tabla de niveles compuesta con el dinero al doble (1 sep 2026): el
  // patrón de ×2 no la veía por los puntos de los montos.
  '| Nivel | Distribuidores | CV del nivel | CV acumulado | Regalía mensual |\n|---|---|---|---|---|\n| 1 | 2 | 112 | 112 | $50.400 COP |\n| 2 | 4 | 224 | 336 | $151.200 COP |\n| 3 | 8 | 448 | 784 | $352.800 COP |\n| 4 | 16 | 896 | 1.680 | $756.000 COP |\n| 5 | 32 | 1.792 | 3.472 | $1.562.400 COP |',
  // La pirámide dibujada con base 3 (1 sep 2026): tras un bloqueo, el rescate
  // compuso «hasta 12 generaciones» con esta tabla, y ningún patrón la veía.
  '| Nivel | Paquetes comprados | % | Comisión |\n| 1 | 3 | 10% | $225.000 |\n| 2 | 9 | 10% | $225.000 |\n| 3 | 27 | 10% | $225.000 |',
  // Perpetuidad
  'Es una renta vitalicia que le llega cada viernes.',
  'Le entra un ingreso de por vida.',
  // ── Los tres huecos de la prueba del Director del 22 ago 2026 ──────────────
  // El plazo dicho con ADVERBIO, no con adjetivo: los patrones de velocidad
  // buscaban «inmediato/rápido» y esto se les iba entero. El dato real es que
  // cada ciclo se paga el SEGUNDO viernes después de su cierre.
  'Su primer socio también entra con Visionario — eso le genera $675.000 de una sola vez, esa misma semana.',
  'Ese bono se lo pagan el viernes siguiente a la compra.',
  // El GEN5 contado en personas con sujeto POSESIVO. El barrido del 22 ago cubrió
  // «cada vez que ALGUIEN» y «si arrancan TRES PERSONAS»; un posesivo no es ni
  // cuantificador ni indefinido, y volvía a pasar.
  'Su primer socio entra con Visionario y eso le genera $675.000.',
  'Su primer distribuidor se vincula y usted recibe $337.500.',
  // Precio de entrada y comisión en el mismo mensaje. Iban en PÁRRAFOS distintos,
  // así que ningún patrón con [^.] podía verlas juntas: lo atrapa la comprobación
  // de coincidencia sobre el mensaje entero, no un patrón.
  'Con el ESP-1 usted arranca con 7 productos. Cada paquete ESP-1 que se compre en su canal le genera desde $22.500 hasta $112.500.\n\nEl costo de entrada es $900.000 COP.',
  // Perpetuidad dicha con el VERBO, sin el sustantivo "pago" en ninguna parte.
  // El hueco de la conjugación (21 ago 2026): las cuatro pasaban enteras.
  'Le pagará de por vida.',
  'Sus clientes siguen pidiendo y a usted le siguen pagando para siempre.',
  'Usted cobra de por vida por ese trabajo que hizo una sola vez.',
  'De por vida le van a pagar por ese canal.',
  'Sus comisiones seguirán llegando para siempre.',
  // ── Los dos huecos de la prueba del Director del 24 ago 2026 ──────────────
  // El verbo de CAÍDA: el par del adverbio exigía una lista cerrada de verbos de
  // entrega y «caer» no estaba, así que la frase más reincidente del canal —«ese
  // mismo viernes», la que ya costó la corrección de la cabecera de COMP_GEN5_01
  // en v7.5— volvió a pasar entera. El dato real: cada ciclo se paga el SEGUNDO
  // viernes después de su cierre.
  'Cada vez que alguien en su círculo compra un paquete empresarial, le cae una comisión ese mismo viernes.',
  'El bono le cae el viernes siguiente.',
  'Le ingresa esa misma semana.',
  'Ese mismo viernes le cae la comisión.',
  // La persona genérica como COMPLEMENTO AGENTE de la compra. Los patrones de
  // persona la buscaban como sujeto; aquí va detrás de «comprado por».
  'Un paquete Visionario comprado por alguien que usted vinculó directamente le genera $675.000 de una sola vez.',
  'Alguien que usted vinculó le genera $675.000.',
  'Un paquete adquirido por una persona que usted conectó le deja $337.500.',
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
  // ── El falso positivo del 1 sep 2026: el disclaimer de NIVELES_02 ─────────
  // «No son resultados garantizados» es la línea de CUMPLIMIENTO del fragmento,
  // y el patrón de garantías la bloqueaba por no ver la negación. El primer día
  // que el enrutamiento sirvió NIVELES_02 en el canal, el guardarraíl mató la
  // respuesta por su propia honestidad.
  'Estos números son el potencial matemático bajo duplicación perfecta. Las comisiones reales dependen del crecimiento y consumo de su canal. No son resultados garantizados.',
  // ── El segundo falso positivo del 1 sep 2026: el acumulado canónico ───────
  // NIVELES_01 con el $103M pegado a su origen. El patrón de totales acumulados
  // lo bloqueó por «acumulado supera los $1…»: doctrina, no invento.
  'Al nivel 12, su canal llega a 8.190 distribuidores consumiendo, y el acumulado supera los $103 millones COP — exactamente el 10% del volumen que factura un canal de ese tamaño.',
  // ── Los dos falsos positivos de Milena (27 ago 2026) ─────────────────────
  // Logística del fabricante, no promesa: bloquearlo le costó la respuesta de cómo comprar.
  'Gano Excel cobra, empaca y despacha a su puerta en Santa Marta. Usted no tiene que hacer nada más.',
  'El pedido lo recibe Gano Excel, lo factura y lo envía por Servientrega; usted no tiene que hacer nada más que recibirlo.',
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
  // ── El copy del GEN5 aprobado por el Director el 24 ago 2026 ───────────────
  // La respuesta a «¿cómo gano rápido / cómo recupero mi inversión?», que es la
  // pregunta que se hace el 100% de quien tiene interés real. Se contesta con el
  // MECANISMO y su cifra —la compra de paquetes empresariales— sin plazo, sin
  // precio de entrada al lado, y sin persona en la frase: el registro es el de la
  // gran distribución, «comprado en su canal», no «comprado por alguien».
  // Si alguno de estos tres dispara, el filtro está tumbando copy aprobado.
  'Con gusto. Lo que mueve dinero desde el principio es la compra de paquetes empresariales.\n\nCon el Visionario, cada paquete empresarial que se compra en su canal de distribución le genera una comisión directa: en la primera generación, $675.000; y sigue generando hasta la quinta, desde $90.000 por paquete.\n\nCorre en paralelo con la otra forma de ganar, la del consumo que se repite: esta le paga mientras construye, y la otra le paga por lo que ya construyó.',
  'Un paquete empresarial comprado en su canal de distribución en la primera generación le genera $675.000.',
  // El ROL COMERCIAL sí pasa: «distribuidor» es vocabulario de empresa, y esa es
  // justamente la distinción que separa este caso del bloqueado de arriba.
  'Un paquete empresarial comprado por un distribuidor que usted vinculó le genera $675.000.',
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

// ─── Modelo de negocio inventado (movido al módulo el 27 ago 2026) ──────────
// Se re-implementa igual que el módulo: término afirmado dispara; negado en su
// oración («NO es un costo de membresía») no. Los datos salen del TS.
const TERMINOS = [...SRC.slice(SRC.indexOf('export const TERMINOS_MODELO_INVENTADO'), SRC.indexOf('\n];', SRC.indexOf('export const TERMINOS_MODELO_INVENTADO')))
  .matchAll(/'([^']+)'/g)].map((m) => m[1]);
const RE_NEG = unaRe('RE_NEGACION_PREVIA');
const detectaModelo = (texto) => {
  const t = texto.toLowerCase();
  for (const term of TERMINOS) {
    let desde = 0;
    while (true) {
      const pos = t.indexOf(term, desde);
      if (pos === -1) break;
      let i = pos; while (i > 0 && !/[.!?\n:;]/.test(t[i - 1])) i--;
      if (!RE_NEG.test(t.slice(i, pos))) return term;
      desde = pos + term.length;
    }
  }
  return null;
};
const MODELO_BLOQUEAR = [
  'Puede vender un infoproducto o una membresía mensual a su audiencia.',
  'Es una membresía: usted paga cada mes y accede al contenido.',
  'No es un curso, es una membresía con acceso a los ebooks.',
];
const MODELO_LEGITIMO = [
  'El paquete no es un costo de membresía: es producto que usted recibe, usa y puede vender.',
  'Aquí no hay membresías ni cursos que vender: usted distribuye productos con registro INVIMA.',
  // El contraste es negación (producción, 4 sep 2026): la respuesta buena a «¿tengo que
  // comprar todos los meses?» quedó bloqueada por «membresía» dentro de una comparación.
  'La diferencia con una cuota de membresía está en qué recibe a cambio: ese dinero le llega a la casa en producto.',
  'A diferencia de una membresía, el paquete es inventario que usted recibe.',
  'Sin audiencia, sin contenido que crear: el producto ya existe y Gano Excel lo despacha.',
];
console.log('\n── Modelo inventado: lo que debe bloquearse ──');
for (const c of MODELO_BLOQUEAR) {
  const h = detectaModelo(c);
  h ? ok(`[${h}] ${c.slice(0, 62)}…`) : mal(`NO BLOQUEÓ: "${c.slice(0, 88)}"`);
}
console.log('\n── Modelo inventado: la negación no cuenta ──');
for (const c of MODELO_LEGITIMO) {
  const h = detectaModelo(c);
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
