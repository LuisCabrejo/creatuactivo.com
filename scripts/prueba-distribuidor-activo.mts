/**
 * El nodo 2.51: quien ya es distribuidor (8 oct 2026, caso Aldo Moller).
 *
 *   npx tsx scripts/prueba-distribuidor-activo.mts
 *
 * Sin red. Tres personas dicen casi lo mismo y Queswa las confundía: activo en
 * Gano Excel con otro equipo (texto aprobado, sin venderle), código viejo de
 * Gano (NET_02) y distribuidor de otra compañía (NET_01, bienvenido). Más el
 * socio nuestro con un número que no se reconoce. Termina en error si algo falla.
 */
const {
  atenderDistribuidorActivo, TEXTO_CODIGO_DE_QUE_COMPANIA, TEXTO_DISTRIBUIDOR_GANO,
  TEXTO_CAMBIO_DE_EQUIPO, TEXTO_CAPACITACION_OTRO_EQUIPO, TEXTO_SOCIO_NO_RECONOCIDO,
} = await import('../src/lib/queswa-conductor.ts');

let fallos = 0;
const es = (cond: boolean, m: string) => { console.log(`${cond ? '✅' : '❌'} ${m}`); if (!cond) fallos++; };

type T = { role: string; content: string };
const ESTRATEGIA: T = { role: 'assistant', content: 'Con gusto. Esta es la estrategia… ¿Quiere verlo en el simulador?' };
const nodo = (mensaje: string, historial: T[] = [ESTRATEGIA], extra: Record<string, unknown> = {}) =>
  atenderDistribuidorActivo({
    mensaje, historial, yaMarcado: false,
    esSocioNuestro: async (n: string) => /patricia reyes/i.test(n),
    ...extra,
  });

console.log('\n── 1. No dice de qué compañía: se pregunta ──');
const aldo = await nodo('ya soy distribuidor o socio. tengo mi codigo');
es(aldo?.texto === TEXTO_CODIGO_DE_QUE_COMPANIA, 'Aldo: «ya soy distribuidor o socio. tengo mi codigo» → ¿Su código es de Gano Excel?');
es((await nodo('ya soy distribuidor'))?.texto === TEXTO_CODIGO_DE_QUE_COMPANIA, '«ya soy distribuidor» → la pregunta');
es(!(await nodo('soy distribuidor de productos de aseo')), 'distribuidor de otros productos: no es esta conversación');
es(!(await nodo('¿cuándo tengo mi código?')), '«¿cuándo tengo mi código?» es de quien acaba de radicar');
es(!(await nodo('tengo mi código', [ESTRATEGIA, { role: 'assistant', content: TEXTO_CODIGO_DE_QUE_COMPANIA }, ESTRATEGIA])), 'no se pregunta dos veces');

console.log('\n── 2. Responde la pregunta ──');
const trasPregunta: T[] = [ESTRATEGIA, { role: 'user', content: 'ya soy distribuidor' }, { role: 'assistant', content: TEXTO_CODIGO_DE_QUE_COMPANIA }];
for (const r of ['si', 'Sí', 'sí, de Gano', 'De gano excel']) {
  const n = await nodo(r, trasPregunta);
  es(n?.texto === TEXTO_DISTRIBUIDOR_GANO && n?.marcarFicha?.distribuidor_otro_equipo === true, `«${r}» → el texto aprobado y la ficha marcada`);
}
es(!(await nodo('no, es de Omnilife', trasPregunta)), '«no, es de Omnilife» → sigue a NET_01 (bienvenido)');
es(!(await nodo('no', trasPregunta)), '«no» suelto → lo atiende el motor');
es((await nodo('sí, soy del equipo de Luis', trasPregunta))?.texto === TEXTO_SOCIO_NO_RECONOCIDO, '«sí, soy del equipo de Luis» → es socio nuestro');

console.log('\n── 3. Lo dice con la compañía ──');
for (const m of ['tengo mi código de Gano con otro equipo', 'estoy en Gano con otro equipo', 'soy distribuidora de Gano Excel', 'trabajo con Gano hace años']) {
  const n = await nodo(m);
  es(n?.texto === TEXTO_DISTRIBUIDOR_GANO && n?.marcarFicha?.distribuidor_otro_equipo === true, `«${m}» → el texto aprobado`);
}
es(TEXTO_DISTRIBUIDOR_GANO === 'Qué bueno: entonces ya conoce Gano Excel por dentro, y sabe que los productos y la empresa son reales.\n\n¿Qué inquietud quiere que le ayude a resolver?', 'el texto es el aprobado, sin la frase del medio');
es(!(await nodo('soy distribuidor de Herbalife')), 'Herbalife → NET_01');
es(!(await nodo('ya soy de Omnilife, tengo mi código')), 'Omnilife con código → NET_01');
es(!(await nodo('ya tuve código de Gano hace años')), 'código viejo → NET_02');
es(!(await nodo('quiero reactivar mi código')), 'reactivar → NET_02');
es(!(await nodo('estoy en Gano con otro equipo', [ESTRATEGIA, { role: 'assistant', content: TEXTO_DISTRIBUIDOR_GANO }])), 'no se repite la bienvenida');

console.log('\n── 4. Cambio de equipo y capacitación ──');
for (const m of ['¿me puedo pasar a su equipo?', 'quiero cambiarme de equipo', '¿cómo hago el cambio de patrocinador?']) {
  es((await nodo(m))?.texto === TEXTO_CAMBIO_DE_EQUIPO, `«${m}» → lo define Gano Excel`);
}
es(!/seis meses|6 meses/i.test(TEXTO_CAMBIO_DE_EQUIPO), 'el texto no nombra la regla de los seis meses');
es((await nodo('¿cómo hago para crecer mi equipo?', [ESTRATEGIA], { yaMarcado: true }))?.texto === TEXTO_CAPACITACION_OTRO_EQUIPO, 'de otro equipo pide capacitación → su propio equipo');
es(!(await nodo('¿cómo hago para crecer?', [ESTRATEGIA])), 'un prospecto que pregunta cómo crecer no recibe eso');

console.log('\n── 5. Socio nuestro con un número que no se reconoce ──');
const socio1 = await nodo('soy socio de creatuactivo');
es(socio1?.texto === TEXTO_SOCIO_NO_RECONOCIDO && !!socio1?.avisarAlEquipo, '«soy socio de creatuactivo» → a queswa.app, y aviso al equipo');
es(socio1?.marcarFicha?.distribuidor_otro_equipo === false, 'y la ficha deja de decir «otro equipo»');
const trasBienvenida: T[] = [ESTRATEGIA, { role: 'assistant', content: TEXTO_DISTRIBUIDOR_GANO }];
es((await nodo('mi patrocinadora es Patricia Reyes', trasBienvenida))?.texto === TEXTO_SOCIO_NO_RECONOCIDO, 'nombra a una socia nuestra → es de la casa');
es(!(await nodo('mi patrocinador es Juan Pérez', trasBienvenida)), 'nombra a alguien que no es socio nuestro → no se asume');
es(!(await nodo('conozco a Luis Cabrejo', [ESTRATEGIA])), 'nombrar a Luis fuera de este hilo no lo vuelve socio');
es(!/vincul|whatsapp/i.test(TEXTO_SOCIO_NO_RECONOCIDO), 'no lo manda a vincular el WhatsApp (botón retirado el 13 sep)');

console.log('\n── 6. Al socio identificado no le aplica ──');
es(!(await nodo('tengo mi código', [ESTRATEGIA], { socioQueEscribe: true })), 'socio identificado → nada');

for (const t of [TEXTO_CODIGO_DE_QUE_COMPANIA, TEXTO_DISTRIBUIDOR_GANO, TEXTO_CAMBIO_DE_EQUIPO, TEXTO_CAPACITACION_OTRO_EQUIPO, TEXTO_SOCIO_NO_RECONOCIDO]) {
  es(!/\b(él|ella|bienvenido|bienvenida|lo recibimos)\b/i.test(t), `sin género: «${t.slice(0, 40)}…»`);
}

console.log(fallos ? `\n❌ ${fallos} fallo(s)` : '\n✅ Todo en verde');
process.exit(fallos ? 1 : 0);
