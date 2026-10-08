/**
 * Los avisos con contexto (8 oct 2026), contra el caso Aldo Moller.
 *
 *   npx tsx scripts/prueba-avisos-contexto.mts
 *
 * Sin red: el ensayo (`WA_DRY_RUN=1`) corta la entrega antes del push, el
 * WhatsApp y el correo. Aldo escribió desde Canadá con nombre de usuario, por el
 * sitio y sin socio, dijo que ya era distribuidor, nombró Canadá, Chile y Brasil
 * y eligió el ESP-3; el modelo le prometió cuatro veces un aviso que no salió.
 * Detalle → src/lib/wa-avisos-contexto.ts. Termina en error si algo falla.
 */
process.env.WA_DRY_RUN = '1';

const {
  destinatarioDe, quien, lineaContacto, origenDeLlegada, haceCuanto, leerSenales,
  detectarPromesaDeAviso, extraerHuellaWeb, limpiarHuellaWeb, textoLlegada, textoRegreso,
  textoDestacado, textoPromesa, avisarLlegada,
} = await import('../src/lib/wa-avisos-contexto.ts');
const { paisDeContactoWA, paisesNombrados } = await import('../src/lib/paises.ts');

let fallos = 0;
const es = (cond: boolean, m: string) => { console.log(`${cond ? '✅' : '❌'} ${m}`); if (!cond) fallos++; };

const ALDO = 'CA.951546381359010';

console.log('\n── 1. El país ──');
es(paisDeContactoWA(ALDO) === 'CA', 'el BSUID de Aldo es de Canadá');
es(paisDeContactoWA('wa_CA.951546381359010') === 'CA', 'también con la huella wa_');
es(paisDeContactoWA('573001234567') === 'CO', '57 → Colombia');
es(paisDeContactoWA('14165551234') === 'CA', '+1 416 → Canadá (Toronto)');
es(paisDeContactoWA('17865551234') === 'US', '+1 786 → Estados Unidos (Miami)');
es(paisDeContactoWA('18095551234') === 'DO', '+1 809 → República Dominicana');
es(paisDeContactoWA('17875551234') === 'PR', '+1 787 → Puerto Rico');
es(paisDeContactoWA('51987654321') === 'PE', '51 → Perú');
es(paisDeContactoWA('59171234567') === 'BO', '591 → Bolivia');
es(paisDeContactoWA('31ebf4f55dd6dade32b84676098498748b38e6cbc6dbe2f44d7632ec33e6b681') === null, 'la huella de un navegador no da país');
es(JSON.stringify(paisesNombrados('eso funciona en colombia... pero en Canada?')) === '["Canadá"]', 'nombra Canadá, sin tilde y con Colombia al lado');
es(paisesNombrados('me interesa lo mismo para Chile y Brazil').join(',') === 'Chile,Brasil', 'Chile y Brazil (en inglés)');

console.log('\n── 2. Las piezas del texto ──');
es(quien('Aldo Moller', ALDO) === '*Aldo Moller* (Canadá)', 'nombre y país');
es(quien('Constructor', '573001234567', false) === 'Una persona', '«Constructor» es relleno, no un nombre; y Colombia no se dice');
es(quien('Patricia Reyes', '17865551234', false) === 'Patricia Reyes (Estados Unidos)', 'el país de afuera sí se dice');
es(!textoLlegada(destinatarioDe(null), 'Yesid', '573001234567', 'por su enlace', 'Hola').includes('desde *'), 'la llegada desde Colombia no dice el país');
es(/nombre de usuario/.test(lineaContacto(ALDO)), 'sin teléfono visible lo dice');
es(lineaContacto('573001234567') === 'Su número es 3001234567.', 'el teléfono colombiano sin el 57');
es(lineaContacto('17865551234') === 'Su número es +17865551234.', 'el extranjero con su +');
es(origenDeLlegada({ texto: 'Hola Queswa, quiero saber cómo funciona' }) === 'desde creatuactivo.com, sin enlace de socio', 'Aldo llegó por el orbe del sitio');
es(origenDeLlegada({ porEnlace: true, texto: 'Hola Queswa, vengo del enlace de luis-cabrejo-1288' }) === 'por su enlace', 'por el enlace del socio');
es(origenDeLlegada({ anuncio: true, texto: 'Hola' }) === 'por un anuncio', 'por un anuncio');
const ahora = new Date('2026-10-08T15:00:00Z');
es(haceCuanto('2026-10-06T02:21:00Z', ahora) === 'hace 3 días', '6 oct 21:21 → hace 3 días');
es(haceCuanto('2026-10-07T09:00:00Z', ahora) === 'ayer', 'treinta horas → ayer');
es(haceCuanto('2026-10-08T08:00:00Z', ahora) === 'hace 7 horas', 'siete horas');

console.log('\n── 3. Las señales de la conversación de Aldo ──');
const suyos = [
  'Hola Queswa, quiero saber cómo funciona', 'si', 'eso funciona en colombia... pero en Canada?',
  'ya soy distribuidor o socio. tengo mi codigo', 'vale', 'si porfa', 'vale', 'en Canada tiene otros productos?',
  'si porfa', 'me interesa lo mismo para Chile y Brazil', 'correcto', 'ESP 3',
];
const s1 = leerSenales(suyos.slice(0, 3), {});
es(s1.tipos.join(',') === 'paises', 'turno 3: solo países (Canadá)');
const s2 = leerSenales(suyos.slice(0, 4), {});
es(s2.tipos.includes('distribuidor'), 'turno 4: «ya soy distribuidor, tengo mi código»');
const s3 = leerSenales(suyos, { package: 'ESP-3', occupation: 'distribuidor o socio' });
es(s3.tipos.join(',') === 'distribuidor,paises,paquete', 'al final: distribuidor, países y paquete');
es(s3.paises.join(',') === 'Canadá,Chile,Brasil', 'los tres países, sin Colombia');
es(leerSenales(['hola', 'cómo funciona'], {}).tipos.length === 0, 'una conversación corriente no avisa');
es(!leerSenales(['ya tuve código de Gano hace años'], {}).tipos.includes('distribuidor'), '«ya tuve código» es NET_02, no un distribuidor activo');

console.log('\n── 4. La promesa del modelo ──');
for (const p of [
  'Listo, Aldo. Le aviso al equipo ahora mismo y le hacen llegar el catálogo de Canadá con precios y referencias exactas.',
  'Entendido. Le incluyo Chile y Brasil en el mismo aviso, así el equipo le manda los tres catálogos de una vez.',
  'Perfecto. Le transmito al equipo que necesita los catálogos de Canadá, Chile y Brasil.',
  '¿Quiere que le muestre qué haría usted en el día a día, mientras coordino que el equipo le confirme eso?',
]) es(!!detectarPromesaDeAviso(p), `promete: «${p.slice(0, 60)}…»`);
for (const n of [
  'Entre las dos estoy yo: converso con cada persona que llega. Cuando alguien está listo, le aviso.',
  'Su código se reactiva, y lo que tenía debajo sigue en su posición. Los detalles de su caso se los confirma el equipo.',
  '¿Quiere que le avise al equipo para que le envíe el catálogo canadiense?',
  'Usted comparte su enlace y yo le aviso cuando alguien está listo.',
]) es(!detectarPromesaDeAviso(n), `no promete: «${n.slice(0, 60)}…»`);
es(detectarPromesaDeAviso('Gracias.\n\nListo, Aldo. Le aviso al equipo ahora mismo y le hacen llegar el catálogo.\n\n¿Algo más?')?.startsWith('Le aviso al equipo ahora mismo') === true, 'devuelve la oración que promete, no el texto entero');

console.log('\n── 5. La ficha web y la de WhatsApp ──');
es(extraerHuellaWeb('Hola Queswa, quiero saber cómo funciona w:31ebf4f5') === '31ebf4f5', 'lee el marcador del orbe');
es(limpiarHuellaWeb('Hola Queswa, quiero saber cómo funciona w:31ebf4f5') === 'Hola Queswa, quiero saber cómo funciona', 'y lo retira del texto');
es(limpiarHuellaWeb('Hola Queswa, vengo del enlace de luis-cabrejo-1288. Ya vi el video de cómo funciona. w:31ebf4f5') === 'Hola Queswa, vengo del enlace de luis-cabrejo-1288. Ya vi el video de cómo funciona.', 'con enlace y video, también');
es(extraerHuellaWeb('mi correo es aw:31ebf4f5x') === null, 'no confunde texto cualquiera');

console.log('\n── 6. Los textos, como le llegarían ──');
const equipo = destinatarioDe(null);
const socia = destinatarioDe({ constructorId: 'patricia-reyes-4920376', nombre: 'Patricia Reyes', whatsapp: '573128586701' });
es(equipo.esEquipo && equipo.constructorId === 'luis-cabrejo-1288', 'sin socio, el equipo');
es(!socia.esEquipo && socia.nombreCorto === 'Patricia', 'con socia, ella por su nombre');
const llegada = textoLlegada(equipo, 'Aldo Moller', ALDO, 'desde creatuactivo.com, sin enlace de socio', 'Hola Queswa, quiero saber cómo funciona');
const regreso = textoRegreso(socia, 'Aldo Moller', ALDO, 'hace 2 días', 'Hola de nuevo', ['Dijo que ya es distribuidor de Gano Excel.', 'Ya había elegido el ESP-3.']);
const destacado = textoDestacado(equipo, 'Aldo Moller', ALDO, ['· Ya es distribuidor de Gano Excel y tiene su código.', '· Le interesa Canadá, Chile y Brasil.', '· Eligió el ESP-3.']);
const promesa = textoPromesa(equipo, 'Aldo Moller', ALDO, 'en Canada tiene otros productos? → si porfa', 'Listo, Aldo. Le aviso al equipo ahora mismo y le hacen llegar el catálogo de Canadá.');
for (const [nombre, t] of [['llegada', llegada], ['regreso', regreso], ['destacado', destacado], ['promesa', promesa]] as const) {
  console.log(`\n· ${nombre}:\n${t}`);
  es(!/\b(él|ella|saludarlo|saludarla)\b/i.test(t), `${nombre}: sin pronombre de género`);
  es(t.includes('Canadá'), `${nombre}: dice el país`);
}
es(llegada.includes('acaba de escribirme desde *Canadá*'), 'la llegada dice de dónde escribe');
es(regreso.startsWith('🔁 Patricia, '), 'el regreso le habla a la socia por su nombre');
es(promesa.startsWith('📌 Le dije a'), 'la promesa al equipo empieza con mayúscula');

console.log('\n── 7. La entrega en ensayo no sale a ningún lado ──');
await avisarLlegada(null, { dest: equipo, nombre: 'Aldo Moller', contacto: ALDO, origen: 'desde creatuactivo.com, sin enlace de socio', primerMensaje: 'Hola Queswa, quiero saber cómo funciona' });
es(true, 'avisarLlegada en ensayo termina sin red');

console.log(fallos ? `\n❌ ${fallos} fallo(s)` : '\n✅ Todo en verde');
process.exit(fallos ? 1 : 0);
