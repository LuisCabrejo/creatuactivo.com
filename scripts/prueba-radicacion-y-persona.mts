/**
 * Copyright © 2026 CreaTuActivo.com
 *
 * Los tres arreglos del 9 sep 2026 sobre los hilos que llegaron desde /productos
 * (Liliana y Patricia), reproducidos tal cual quedaron en la base. `npx tsx`.
 *
 *   npx tsx scripts/prueba-radicacion-y-persona.mts        (exit 1 si falla)
 *
 * 1. La radicación solo la reabre un pedido de datos que EMITIÓ EL BACKEND.
 *    Patricia: el modelo copió el bloque de los cuatro datos a «quiero ver cómo
 *    se vería en mi caso» (sin volición), y al turno siguiente el nodo le pidió
 *    el nombre completo a «armeme el guión». Con la lista de pedidos del backend
 *    vacía, ese turno va al motor. Con el pedido en la lista, el trámite sigue.
 *    Y el puente nuevo: el modelo ya no pide datos, ofrece tomarlos con una
 *    frase fija, y el «sí» a esa frase abre el trámite.
 * 2. La segunda reincidencia de salud va al texto corto, y ese texto ya no dice
 *    «su médico».
 * 3. El «ok» a «¿le sirve que lo comunique con alguien del equipo?» se reconoce
 *    como pedir una persona (nodo 2.46), igual que la oferta del catálogo.
 */
import fs from 'node:fs';
import { config } from 'dotenv'; config({ path: '.env.local' });
import { gestionarCierre, RE_VOLICION, OFERTA_RADICAR_MODELO, pedirDatos } from '../src/lib/wa-radicacion.ts';
import { botOfrecioPersona } from '../src/lib/queswa-conductor.ts';
import { esAceptacion } from '../src/lib/wa-pedido.ts';
import { RECHAZO_SALUD_CORTO, NUCLEO_REINCIDE } from '../src/lib/wa-guardarrail-salud.ts';

let fallos = 0;
const es = (cond: boolean, m: string) => { console.log(`${cond ? '✅' : '❌'} ${m}`); if (!cond) fallos++; };

console.log('\n── 1. Radicación: solo el backend reabre el trámite ──');
const BLOQUE_COPIADO = 'Perfecto, Patricia. Para mostrarle cómo se vería en su caso, necesito cuatro datos:\n\n- **Nombre completo**, como aparece en su documento\n- **Número de identificación**\n- **La ciudad donde está**\n- **El paquete con el que inicia**\n\nLa ciudad se la pido por algo práctico.';
const historialPatricia = [
  { role: 'user', content: 'cómo puedo hacer esto posible, cómo me ayuda Qeswa a construirlo?' },
  { role: 'assistant', content: 'Permítame precisarlo bien: usted es el dueño de un sistema de distribución. ¿Quiere que le cuente cómo se vería en su caso?' },
  { role: 'user', content: 'sí. Quiero ver cómo se vería en mi caso' },
  { role: 'assistant', content: BLOQUE_COPIADO },
];
es(!RE_VOLICION.test('sí. Quiero ver cómo se vería en mi caso'), '«quiero ver cómo se vería en mi caso» no es volición');
es(!RE_VOLICION.test('armeme el guión'), '«armeme el guión» no es volición');
const base = { whatsapp: '573128586701', fingerprintId: 'wa_prueba_patricia', socio: 'Ganocafé Online' };
const sinBackend = await gestionarCierre({ ...base, mensajeActual: 'armeme el guión', historial: historialPatricia, pedidosDelBackend: [] });
es(sinBackend === null, 'bloque copiado por el modelo + «armeme el guión» → al motor (no pide el nombre)');
const conBackend = await gestionarCierre({ ...base, mensajeActual: 'armeme el guión', historial: historialPatricia, pedidosDelBackend: [BLOQUE_COPIADO] });
es(conBackend !== null, 'el mismo bloque emitido por el backend → el trámite sigue');
const sinLista = await gestionarCierre({ ...base, mensajeActual: 'Bogotá, y con el Kit', historial: [{ role: 'assistant', content: pedirDatos('Luis Cabrejo') }] });
es(sinLista !== null, 'sin lista (la web) se cae al regex y el trámite sigue');
const puente = [{ role: 'assistant', content: `Qué bueno que lo tenga claro. ${OFERTA_RADICAR_MODELO}` }];
const puenteSi = await gestionarCierre({ ...base, mensajeActual: 'sí', historial: puente, pedidosDelBackend: [] });
es(puenteSi !== null && /nombre completo/i.test(puenteSi.texto), '«sí» a la frase puente del modelo → el backend pide los datos');
const puenteNo = await gestionarCierre({ ...base, mensajeActual: '¿y cuánto vale el kit?', historial: puente, pedidosDelBackend: [] });
es(puenteNo === null, 'una pregunta tras la frase puente → al motor');
const prompt = fs.readFileSync('knowledge_base/system-prompt-queswa.md', 'utf8');
es(prompt.includes(OFERTA_RADICAR_MODELO), 'el prompt lleva la frase puente, idéntica a la del código');
es(!/Para radicar su vinculación necesito (cuatro|cinco) datos/.test(prompt), 'el bloque de los cuatro datos ya no vive en el prompt');

console.log('\n── 2. Salud: la segunda reincidencia y el texto corto ──');
es(!/su m[eé]dico|su tratamiento|su caso/i.test(RECHAZO_SALUD_CORTO), 'el texto corto no le atribuye nada a la persona');
es(RECHAZO_SALUD_CORTO.trim().endsWith('?'), 'el texto corto cierra con la puerta al equipo');
es(NUCLEO_REINCIDE.startsWith('Ahí aplica lo mismo'), 'la referencia a lo dicho sigue siendo el núcleo de la primera reincidencia');

console.log('\n── 3. El «ok» a la oferta de conectar con el equipo ──');
es(botOfrecioPersona(RECHAZO_SALUD_CORTO), 'el texto corto ofrece una persona');
es(botOfrecioPersona('Le entiendo.\n\n¿Quiere que le avise al socio para que la llame?'), '«¿quiere que le avise al socio?» ofrece una persona');
es(!botOfrecioPersona('¿Le muestro el catálogo completo con precios?'), 'la oferta del catálogo NO es una persona');
es(!botOfrecioPersona('Ya le avisé a Luis, y se comunica con usted por este medio.\n\n¿Hay algo que le pueda ir resolviendo?'), 'el aviso ya hecho no vuelve a ofrecer');
for (const t of ['Ok', 'Bueno', 'sí', 'Dale']) es(esAceptacion(t), `«${t}» acepta`);
es(!esAceptacion('ok pero ¿cuánto vale?'), '«ok pero ¿cuánto vale?» no acepta: va al motor con la pregunta');

console.log(fallos ? `\n❌ ${fallos} fallo(s)` : '\n✅ Todo en verde');
process.exit(fallos ? 1 : 0);
