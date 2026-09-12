/**
 * Prueba del «sí» al catálogo — el caso de Betsabe (5 sep 2026).
 *
 * Reproduce, sin tocar producción, el turno en que Betsabe dijo «Si mi diamante»
 * a «¿Le muestro el catálogo completo con precios?» y no recibió nada. Enfrenta
 * el nodo 2.24 del conductor (atenderEnlaceCatalogo) contra las ofertas reales
 * de catálogo que hay en el arsenal y en los textos dictados, y contra las
 * aceptaciones tal como la gente las escribe. También comprueba lo contrario:
 * que un «sí» con pregunta encima NO se trague el nodo.
 *
 * Correr:  npx tsx scripts/prueba-aceptacion-catalogo.mts   (exit 1 si algo falla)
 */
import { config } from 'dotenv'; config({ path: '.env.local' });
const { atenderEnlaceCatalogo } = await import('../src/lib/queswa-conductor');
const { esAceptacion, RE_OFERTA_CATALOGO } = await import('../src/lib/wa-pedido');

let fallos = 0;
const ok  = (m: string) => console.log(`  ✅ ${m}`);
const mal = (m: string) => { fallos++; console.log(`  ❌ ${m}`); };

// Las ofertas tal como cierran los textos vivos (arsenal + nodos dictados).
const OFERTAS = [
  '¿Le muestro el catálogo completo con precios?',
  '¿Le muestro el catálogo completo para que vea las presentaciones?',
  '¿Le muestro el catálogo completo, con las cuatro líneas y sus precios?',
  '¿Le muestro el catálogo para que elija lo que quiere recibir?',
  '¿Le muestro qué trae el catálogo completo para que vea las opciones?',
  '¿le muestro el catálogo con precios?',
  '¿Le paso el enlace del catálogo?',
];
// Las aceptaciones como las escribe la gente (todas reales o del mismo molde).
const ACEPTA = ['Si', 'Sí', 'Sii', 'Si por favor', 'Si mi diamante', 'sí señora', 'Dale gracias', 'claro que sí', 'Listo'];
// Lo que NO es aceptación pelada: trae otra pregunta y va al motor.
const NO_ACEPTA = ['Sí, ¿y cuánto vale la caja?', 'si pero cómo se pide', 'Sí, quiero saber dónde queda la oficina', 'No', 'Cómo entra el dinero'];

console.log('\n── Ofertas reconocidas como oferta de catálogo ──');
for (const o of OFERTAS) RE_OFERTA_CATALOGO.test(o) ? ok(o) : mal(`no reconoce: ${o}`);

console.log('\n── Aceptaciones ──');
for (const a of ACEPTA) esAceptacion(a) ? ok(`"${a}"`) : mal(`"${a}" no cuenta como aceptación`);
for (const a of NO_ACEPTA) esAceptacion(a) ? mal(`"${a}" se tomó como aceptación pelada`) : ok(`"${a}" va al motor`);

console.log('\n── El turno de Betsabe, tal cual quedó en la base ──');
const historialBetsabe = [
  { role: 'user', content: 'Si por favor' },
  { role: 'assistant', content: 'Con gusto, Betsabe.\n\nEl café es una de las presentaciones; lo que se distribuye es **Ganoderma**, con extracto propio.\n\nViene en bebidas, en suplementos y en cuidado personal —22 productos en cuatro líneas—, y hasta en un sistema barista italiano de 15 bares con cápsulas propias.\n\nLa diferencia está en la extracción: más de 200 nutrientes en un producto premium que su cliente incorpora a su rutina.\n\nAhí está la lógica del negocio: el cliente que nota la diferencia no vuelve al genérico. Vuelve a pedir el mes siguiente, y esa compra ya no le cuesta trabajo a usted.\n\n¿Le muestro el catálogo completo con precios?' },
];
const r = await atenderEnlaceCatalogo('Si mi diamante', historialBetsabe, async () => 'luis-cabrejo');
if (r?.texto?.includes('creatuactivo.com/luis-cabrejo/productos')) ok(`"Si mi diamante" → ${r.nodo}`);
else mal(`"Si mi diamante" no recibió el enlace: ${JSON.stringify(r)}`);

// Y el «sí» con pregunta encima, sobre el mismo hilo, NO se lo queda el nodo.
const r2 = await atenderEnlaceCatalogo('Sí, ¿y cuánto vale la caja?', historialBetsabe, async () => 'luis-cabrejo');
r2 ? mal('un «sí» con pregunta se lo tragó el nodo del catálogo') : ok('«sí, ¿y cuánto vale?» sigue al motor');

// Una oferta que no es de catálogo no abre el nodo aunque la persona diga «sí».
const r3 = await atenderEnlaceCatalogo('Si', [{ role: 'assistant', content: 'Buena pregunta.\n\n¿Le muestro cómo se ve en números?' }], async () => 'luis-cabrejo');
r3 ? mal('un «sí» a la oferta de números abrió el catálogo') : ok('«sí» a otra oferta no abre el catálogo');

// ─── Las DOS puertas del «sí» miden igual ────────────────────────────────────
// El endurecimiento del caso Betsabe vivía solo en `esAceptacion`, y el conductor
// —puerta del hilo de los 12 Niveles, del simulador y de la vinculación, o sea el
// destino del botón principal de la apertura— se quedó con la versión vieja hasta
// el 12 sep 2026: tumbaba «Sii» por la vocal repetida y «claro que sí» porque su
// propio «que» matcheaba el guard de pregunta. Si las dos se separan otra vez, el
// «sí» vale distinto según por dónde entre, y eso no se ve en producción.
console.log('\n── Las dos puertas del «sí» coinciden ──');
const { banderasDelHilo } = await import('../src/lib/queswa-conductor');
const OFERTA_ESTRATEGIA = [{ role: 'assistant', content: '¿Le muestro la estrategia con la que se construye ese sistema, paso a paso?' }];
const delConductor = (t: string) => banderasDelHilo(t, OFERTA_ESTRATEGIA as never).aceptaSola;
for (const a of ACEPTA) {
  if (esAceptacion(a) === delConductor(a)) ok(`"${a}" — las dos puertas coinciden`);
  else mal(`"${a}" — catálogo: ${esAceptacion(a)} · conductor: ${delConductor(a)}`);
}
for (const a of NO_ACEPTA) {
  if (!delConductor(a)) ok(`"${a}" tampoco abre el hilo de los 12 Niveles`);
  else mal(`"${a}" abrió el hilo de los 12 Niveles`);
}

console.log(fallos ? `\n❌ ${fallos} fallo(s)\n` : '\n✅ Todo en orden\n');
process.exit(fallos ? 1 : 0);
