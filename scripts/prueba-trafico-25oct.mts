/**
 * Copyright © 2026 CreaTuActivo.com
 *
 * Los turnos reales de la auditoría del 25 oct 2026 (tráfico del 23 al 25 oct),
 * reproducidos sin red y sin llamar al modelo.
 *
 *   npx tsx scripts/prueba-trafico-25oct.mts   (exit 1 si falla)
 *
 * Cada bloque prueba las dos direcciones: que el arreglo atienda el turno real
 * Y que no se trague lo que no es suyo.
 *
 * - wa_573114033587 (25 oct, 8:09 a. m.): «Si» a «¿Le cuento en qué se diferencian
 *   estos productos entre ellos?» → el modelo compuso «colágeno para la piel y el
 *   tejido conectivo, y Cordyceps para el rendimiento físico», «un hongo que se usa
 *   en la nutrición funcional» y «se acaba el producto y vuelve a pedir». El filtro
 *   de salida no tenía esos patrones, y la oferta no tenía fragmento destino.
 * - Adry Escobar (23 oct, 5:12 p. m., WhatsApp y web): «Como puedo empezar» →
 *   «Claro, con mucho gusto…» encima de «Con gusto, y le va a gustar lo corto que es».
 * - Yensy Garzón (23 oct, 6:24 p. m.): «Sí» a «¿Le muestro cómo crece ese
 *   porcentaje…?» → dos frases sin cifras y otra oferta.
 * - Los avisos sin número y los del teléfono del equipo → prueba-avisos-contexto.mts.
 * - La ficha de socio del Director quedó con Yina como dueña al tocar su enlace.
 */
import { readFileSync } from 'node:fs';
import { atenderHiloNiveles, categoriaDeLasDiferencias, candadoDeContenido } from '../src/lib/queswa-conductor.ts';
import { envolverTextoAprobado, armarTurno, nucleoTraeSuEntrada } from '../src/lib/queswa-envoltura.ts';
import { detectarClaimSaludEnSalida } from '../src/lib/wa-guardarrail-salud.ts';

let fallos = 0;
const revisar = (titulo: string, ok: boolean, detalle = '') => {
  if (!ok) fallos++;
  console.log(`  ${ok ? '✅' : '❌'} ${titulo}${detalle ? `  → ${detalle}` : ''}`);
};
type T = { role: 'user' | 'assistant'; content: string };

// ── Los fragmentos tal cual están desplegados (tenant whatsapp, 25 oct 2026) ──
// ⚠️ PROD_OVERVIEW llega con el candado SIN CERRAR y la pregunta adentro: es la
// forma real, y es la que el lector tiene que aguantar.
const PROD_OVERVIEW = '### PROD_OVERVIEW: "¿Cómo se estructura el portafolio?"\n\n<verbatim_lock>\nEl portafolio de Gano Excel se estructura en **cuatro categorías** de consumo, todas con extracto propietario de Ganoderma lucidum de Gano Excel:\n\n**1. Bebidas funcionales** — 9 productos\n> Ganocafés (3 en 1, Clásico), Ganoricos (Latte, Mocha, Shoko), Gano C\'Real Spirulina, Oleaf Gano Rooibos, Gano Schokolade, Reskine Colágeno. Rango: $110.900 — $216.900 COP.\n\n**2. Sistema LUVOCO** — 4 productos\n> Máquina italiana de 15 bares + 3 intensidades de cápsulas exclusivas (Suave, Medio, Fuerte). Máquina: $1.026.000 COP · Cápsulas: $110.900 COP cada presentación.\n\n**3. Suplementos Avanzados** — 3 productos\n> Cápsulas concentradas: Ganoderma (apoyo inmune), Excellium (el micelio del hongo), Cordygold (rendimiento físico). Rango: $272.500 — $336.900 COP.\n\n**4. Cuidado Personal** — 6 productos\n> Línea diaria del hogar: Gano Fresh (pasta dental), Jabón Gano, Jabón Transparente, Shampoo + Acondicionador + Exfoliante Piel&Brillo. Rango: $73.900 — $78.500 COP.\n\n**Pregunta de seguimiento:** ¿Por cuál línea quiere que empecemos?';
const BEB_01 = '### BEB_01: "¿Cuáles son sus bebidas?"\n\n<verbatim_lock>\nLa línea de bebidas funcionales de Gano Excel cuenta con **9 productos** — todos contienen extracto propietario de Ganoderma lucidum de Gano Excel:\n\n| Producto | Precio COP | Presentación | Beneficio |\n|----------|------------|--------------|-----------|\n| **Ganocafé 3 en 1** | $110.900 | 20 sobres | Energía sin nerviosismo |\n| **Reskine Colágeno** | $216.900 | 10 sachets | Colágeno para las articulaciones |\n\n</verbatim_lock>\n\n**Pregunta de seguimiento:** ¿Sobre cuál quiere que le cuente?';
const SUP_01 = '### SUP_01: "¿Cuáles son los suplementos?"\n\n<verbatim_lock>\nLa categoría de **Suplementos Avanzados** tiene **3 productos** — concentrados en cápsulas:\n\n| Producto | Precio COP |\n|---|---|\n| **Cápsulas Cordygold** | $336.900 |\n</verbatim_lock>\n\n**Pregunta de seguimiento:** ¿Sobre cuál quiere que le cuente?';
const NIVELES_01 = '<verbatim_lock>La primera duda que suele surgir es si le toca conseguir cientos de clientes usted solo. No: su sistema factura con lo que compran sus clientes.\n\nLos 12 Niveles es nuestra estrategia para construirlo paso a paso.</verbatim_lock>\n\n**Pregunta de seguimiento:** ¿Quiere verlo en el simulador, con la cifra de cada nivel?';
// BEB_DIF_01 (5 nov 2026) se lee del .txt: el lector solo mira el candado y la pregunta.
const _cat = readFileSync('knowledge_base/catalogo_productos.txt', 'utf8');
const BEB_DIF_01 = _cat.slice(_cat.indexOf('### BEB_DIF_01'), _cat.indexOf('\n---', _cat.indexOf('### BEB_DIF_01')));
const FRAGMENTOS: Record<string, string> = {
  catalogo_productos_PROD_OVERVIEW: PROD_OVERVIEW,
  catalogo_productos_BEB_DIF_01: BEB_DIF_01,
  catalogo_productos_BEB_01: BEB_01,
  catalogo_productos_SUP_01: SUP_01,
  arsenal_12_niveles_NIVELES_01: NIVELES_01,
};
const baseFalsa = {
  from: () => ({ select: () => ({ eq: () => ({ eq: (_k: string, categoria: string) => ({ maybeSingle: async () => ({
    data: FRAGMENTOS[categoria] ? { content: FRAGMENTOS[categoria] } : null,
  }) }) }) }) }),
};
const hilo = (mensaje: string, historial: T[], pais: 'CO' | 'US' | 'XX' = 'CO') => atenderHiloNiveles({
  canal: 'whatsapp', mensaje, historial, pais, hiloDoceNiveles: true,
  simuladorDisponible: true, supabase: baseFalsa, tenant: 'whatsapp',
});

// ── 1a. La oferta de las diferencias tiene destino: el catálogo ──────────────
console.log('\n🛍️  «Sí» a «¿Le cuento en qué se diferencian…?» → el texto del catálogo');
const tablaVisionario = 'Con gusto. El *ESP-3 Visionario* vale *$4.500.000 COP* y le activa inmediatamente este inventario:\n\n| Producto | Cantidad |\n|---|---|\n| Ganocafé 3 en 1 | 9 |\n| Reskine Colágeno | 1 |\n| Cápsulas Cordygold | 1 |\n| **Total** | **35** |\n\nLo seleccionamos así para que su negocio arranque con un mix completo: bebidas enriquecidas, suplementos premium y cuidado personal.\n\n¿Le cuento en qué se diferencian estos productos entre ellos?';
const trasTabla: T[] = [{ role: 'assistant', content: tablaVisionario }];
const r1 = await hilo('Si', trasTabla);
revisar('wa_573114033587: «Si» tras la tabla del Visionario → 2.37 PROD_OVERVIEW', /^2\.37 PROD_OVERVIEW/.test(r1?.nodo ?? ''), r1?.nodo ?? 'null');
revisar('…sale el texto aprobado, desde su primera línea', !!r1?.texto?.startsWith('El portafolio de Gano Excel se estructura en **cuatro categorías**'));
revisar('…con su pregunta UNA vez y sin el rótulo «Pregunta de seguimiento»',
  !!r1?.texto?.endsWith('¿Por cuál línea quiere que empecemos?') && !/Pregunta de seguimiento/.test(r1?.texto ?? '') && (r1?.texto?.match(/¿Por cuál línea/g) ?? []).length === 1);
revisar('…y el texto entregado no dispara el filtro de salud', !detectarClaimSaludEnSalida(r1?.texto ?? ''), detectarClaimSaludEnSalida(r1?.texto ?? '') ?? '');
revisar('fuera de Colombia sigue el motor (las tablas van en pesos)', (await hilo('Si', trasTabla, 'US')) === null);
const yaVio: T[] = [{ role: 'assistant', content: 'El portafolio de Gano Excel se estructura en **cuatro categorías** de consumo, todas con extracto propietario de Ganoderma lucidum de Gano Excel:\n\n…' }, ...trasTabla];
revisar('si ya recibió la vista del portafolio, no se repite', (await hilo('Si', yaVio)) === null);
revisar('«Sí, ¿y cuánto cuesta el Visionario?» trae otra pregunta: no es del nodo', (await hilo('Sí, ¿y cuánto cuesta el Visionario?', trasTabla)) === null);
const tablaInicial = 'Con gusto. El *ESP-1 Inicial* vale *$900.000 COP* y le activa inmediatamente este inventario:\n\n| Producto | Cantidad |\n|---|---|\n| Ganocafé 3 en 1 | 2 |\n\nLo seleccionamos así para que su negocio arranque con las bebidas que más se piden.\n\n¿Le cuento en qué se diferencian estas bebidas?';
const r2 = await hilo('Sí', [{ role: 'assistant', content: tablaInicial }]);
revisar('«Sí» tras la tabla del ESP-1 → 2.37 BEB_DIF_01 (las diferencias, no la lista otra vez)', /^2\.37 BEB_DIF_01/.test(r2?.nodo ?? ''), r2?.nodo ?? 'null');
revisar('…con la pregunta que está fuera del candado', !!r2?.texto?.endsWith('¿Le cuento qué tiene de especial el Ganocafé 3 en 1?'), r2?.texto?.slice(-60) ?? '');
revisar('…y las diferencias no disparan el filtro de salud', !!r2?.texto && !detectarClaimSaludEnSalida(r2.texto), detectarClaimSaludEnSalida(r2?.texto ?? '') ?? '');
const pieBebidas = '*Bebidas* · 9 productos\nGanocafé 3 en 1 · $110.900 COP · Gano Schokolade · $124.900 COP · Reskine Colágeno · $216.900 COP\n\n¿Le cuento en qué se diferencian entre ellas?';
revisar('el pie de la foto de las bebidas → BEB_DIF_01', categoriaDeLasDiferencias('¿Le cuento en qué se diferencian entre ellas?', pieBebidas) === 'catalogo_productos_BEB_DIF_01');
revisar('el de los suplementos → SUP_01', categoriaDeLasDiferencias('¿Le cuento en qué se diferencian los tres?', 'Cápsulas Ganoderma · Cápsulas Excellium · Cápsulas Cordygold\n\n¿Le cuento en qué se diferencian los tres?') === 'catalogo_productos_SUP_01');
revisar('«entre ellas» sin las bebidas en el turno no es de nadie', categoriaDeLasDiferencias('¿Le cuento en qué se diferencian entre ellas?', 'Las cuatro formas de empezar…\n\n¿Le cuento en qué se diferencian entre ellas?') === null);
revisar('el candado cerrado se lee igual que antes', candadoDeContenido(BEB_01)?.startsWith('La línea de bebidas funcionales') === true);
revisar('un fragmento sin candado no se dicta', candadoDeContenido('### X\n\nTexto suelto.') === null);

// ── 1b. El filtro de salida ve lo que el modelo escribió ─────────────────────
console.log('\n🩺 El filtro de salida, sobre la respuesta compuesta del 25 oct');
const compuesta = 'Perfecto. Los 35 productos del Visionario se agrupan en tres líneas:\n\n*Bebidas enriquecidas con Ganoderma*\nEl Ganocafé 3 en 1, el Clásico, el Mocha Rico y el Shoko Rico son el corazón del catálogo. Todos llevan extracto de Ganoderma, un hongo que se usa en la nutrición funcional.\n\n*Suplementos y bienestar*\nEl Reskine Colágeno y las cápsulas Cordygold son la línea de nutrición concentrada: colágeno para la piel y el tejido conectivo, y Cordyceps para el rendimiento físico.';
revisar('la respuesta del 25 oct se bloquea', !!detectarClaimSaludEnSalida(compuesta), detectarClaimSaludEnSalida(compuesta) ?? 'pasó');
revisar('…y la de esa misma noche («cuidado de la piel desde adentro»)', !!detectarClaimSaludEnSalida('Las cápsulas Cordygold y el Reskine Colágeno van dirigidos a quien busca bienestar más enfocado: vitalidad y cuidado de la piel desde adentro.'));
revisar('«el hongo que se asocia con el rendimiento físico» (SUP_03) sigue verde', !detectarClaimSaludEnSalida('El Cordyceps es el hongo que se asocia con el rendimiento físico y el aguante.'));

// ── 2. La envoltura no le pone una segunda entrada a un candado que ya trae la suya ─
console.log('\n✉️  La envoltura y la entrada propia del candado');
const ACTIVACION_01 = 'Con gusto, y le va a gustar lo corto que es. Son tres pasos:\n\n**1. Elige su paquete de inicio** —ESP-3, ESP-2, ESP-1 o el Kit de Inicio—, que es el inventario con el que arranca.';
const PERFIL_02 = 'Usted ya tiene lo más difícil de trabajar por su cuenta: la disciplina.\n\nEl límite es otro.';
const modeloQueResponde = (apertura: string) => ({
  messages: { create: async () => ({ model: 'falso', usage: { input_tokens: 0, output_tokens: 0 }, content: [{ type: 'text', text: JSON.stringify({ apertura, cierre: '' }) }] }) },
});
for (const [lugar, apertura] of [['WhatsApp', 'Claro, con mucho gusto le explico cómo empezar.'], ['web', 'Eso es lo que sigue, y es más sencillo de lo que parece.']] as const) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const e = await envolverTextoAprobado({ anthropic: modeloQueResponde(apertura) as any, bitacora: null, mensajePersona: 'Como puedo empezar', ultimoBot: '', nucleo: ACTIVACION_01, cierrePorDefecto: '¿Le muestro las cuatro formas de empezar?' });
  revisar(`Adry (${lugar}): la apertura del modelo se descarta`, e.apertura === '', e.origen);
  revisar(`…y el turno empieza por el texto aprobado`, armarTurno(e, ACTIVACION_01).startsWith('Con gusto, y le va a gustar lo corto que es.'));
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const eConApertura = await envolverTextoAprobado({ anthropic: modeloQueResponde('Perfecto, lo retomamos cuando lo hayan hablado.') as any, bitacora: null, mensajePersona: 'Si está bien, yo soy independiente', ultimoBot: '', nucleo: PERFIL_02, cierrePorDefecto: '' });
revisar('un candado sin entrada propia conserva la apertura (PERFIL_02)', eConApertura.apertura === 'Perfecto, lo retomamos cuando lo hayan hablado.', eConApertura.origen);
for (const [t, espera] of [
  ['Con gusto.', true], ['Claro que sí. El Bono Binario…', true], ['Totalmente. El objetivo es…', true], ['Así es. Además del acompañamiento…', true],
  ['Vamos al punto, porque ningún modelo funciona…', true], ['**Con gusto**, y…', true],
  ['Sí, totalmente —siempre que su país natal…', false], ['Es legal, y la diferencia tiene nombre en la ley.', false],
  ['Usted ya logró lo más difícil: que su negocio funcione.', false], ['Listados de precios', false],
] as const) revisar(`«${t.slice(0, 40)}» ${espera ? 'trae' : 'no trae'} su entrada`, nucleoTraeSuEntrada(t) === espera);

// ── 3. El «sí» a «cómo crece ese porcentaje» recibe la estrategia ─────────────
console.log('\n📈 «Sí» a «¿Le muestro cómo crece ese porcentaje…?» → Los 12 Niveles');
const ofertaWhy04: T[] = [{ role: 'assistant', content: '¿Le muestro cómo crece ese porcentaje sin que le toque conseguir a todos los clientes usted?' }];
const r3 = await hilo('Sí', ofertaWhy04);
revisar('Yensy: «Sí» → 2.34 NIVELES_01', /^2\.34/.test(r3?.nodo ?? ''), r3?.nodo ?? 'null');
revisar('…con el video de Los 12 Niveles', !!r3?.video?.url);
revisar('…y la voz abre con la duda del «yo solo» que la pregunta prometía responder', !!r3?.texto?.startsWith('La primera duda que suele surgir'));
const why04Entero: T[] = [{ role: 'assistant', content: 'El dinero sale de una sola fuente: el producto que se vende por su sistema.\n\nSe vende de dos formas: al detal y en paquetes empresariales.\n\n¿Le muestro cómo crece ese porcentaje sin que le toque conseguir a todos los clientes usted?' }];
revisar('también cuando WHY_04 llegó como texto, con «paquetes» en el cuerpo', /^2\.34/.test((await hilo('Si', why04Entero))?.nodo ?? ''));
revisar('«Sí, pero ¿cuánto se gana?» no es una aceptación sola', (await hilo('Sí, pero ¿cuánto se gana?', ofertaWhy04)) === null);

// ── 6. Una ficha de socio no recibe patrocinador por tocar un enlace ─────────
console.log('\n🔗 La atribución del webhook');
const webhook = readFileSync('src/app/api/whatsapp/webhook/route.ts', 'utf8');
revisar('el prospecto existente se atribuye solo si NO es socio',
  /if \(patrocinador && !existingProspect\.constructor_id && existingProspect\.device_info\?\.es_socio !== true\)/.test(webhook));
revisar('el primer contacto de un socio se crea sin patrocinador', /const _atribuir = _socioDelPrimerContacto \? null : patrocinador;/.test(webhook)
  && /\.\.\.\(_atribuir && \{ constructor_id: _atribuir\.userId \}\)/.test(webhook) && !/\.\.\.\(patrocinador && \{ constructor_id: patrocinador\.userId \}\)/.test(webhook));
revisar('y esa consulta se reutiliza para `socioQueEscribe`', /let socioQueEscribe = _socioDelPrimerContacto !== undefined \? _socioDelPrimerContacto : await identificarSocio\(supabase, phoneNumber\);/.test(webhook));

console.log(`\n${fallos ? `❌ ${fallos} fallo(s)` : '✅ Todo en verde'}`);
process.exit(fallos ? 1 : 0);
