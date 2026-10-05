/**
 * Copyright © 2026 CreaTuActivo.com
 *
 * La experiencia del DISTRIBUIDOR en el canal (10 sep 2026), tal como la vivió
 * Patricia Reyes y como NO debe volver a vivirse.
 *
 *   npx tsx scripts/prueba-experiencia-socio.mts        (exit 1 si falla)
 *
 * Qué pasó: Patricia, socia desde julio, escribió tres veces en ocho días y en
 * las tres la atendieron como prospecta — le explicaron el plan, le pidieron la
 * cédula para vincularla, le redactaron cinco mensajes de contacto sin su enlace,
 * y su ficha quedó como prospecta caliente en el pipeline de quien la invitó.
 * Nunca recibió el saludo de socia, que es donde vive el enlace.
 *
 * Lo que este arnés fija:
 *   1. El slug se asigna por defecto — nadie tiene que reclamarlo.
 *   2. El saludo de socio NO depende de que la ficha no exista: depende de que
 *      no se le haya dado antes. Esa era la puerta que dejaba a Patricia fuera.
 *   3. El prospecto que pasa a distribuidor queda configurado como distribuidor
 *      (stage maestria, user_id, es_socio) y pierde la temperatura de prospecto.
 *   4. Las piezas publicitarias y su repregunta no llegan al modelo.
 */
import { config } from 'dotenv'; config({ path: '.env.local' });
import { createClient } from '@supabase/supabase-js';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { identificarSocio, saludoDeSocio, convertirProspectoEnSocio, slugDesdeNombre,
        esBsuid, extraerVinculoSocio, tokenDeVinculoSocio, mensajeSocioEnlace } =
  require('../src/lib/wa-onboarding.ts') as typeof import('../src/lib/wa-onboarding.ts');
const { esSoloSaludo } = require('../src/lib/wa-apertura.ts') as typeof import('../src/lib/wa-apertura.ts');
const { atenderPidePieza, detectarPidePieza, TEXTO_NO_PIEZAS, TEXTO_NO_PIEZAS_OTRA_VEZ, atenderHiloNiveles } =
  require('../src/lib/queswa-conductor.ts') as typeof import('../src/lib/queswa-conductor.ts');
const g = require('../src/lib/wa-guardarrail-salud.ts') as typeof import('../src/lib/wa-guardarrail-salud.ts');
const negocio = require('../src/lib/wa-guardarrail-negocio.ts') as typeof import('../src/lib/wa-guardarrail-negocio.ts');

let fallos = 0;
const es = (ok: boolean, q: string) => { console.log(`${ok ? '✅' : '❌'} ${q}`); if (!ok) fallos++; };
const s = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

console.log('\n── 1. El canal reconoce a la distribuidora ──');
const patricia = await identificarSocio(s, '573128586701');
es(patricia?.slug === 'patricia-reyes', 'Patricia se reconoce como socia por su teléfono');
es(!!patricia?.userId, 'trae el user_id de private_users (el que la marca como convertida)');
es((await identificarSocio(s, '3128586701'))?.slug === 'patricia-reyes', 'y también sin indicativo de país');
es(slugDesdeNombre('Liliana Patricia Moreno Moreno') === 'liliana-moreno', 'cuatro palabras → nombre y primer apellido');

console.log('\n── 2. El saludo con su enlace ──');
const saludo = saludoDeSocio(patricia!.nombre, patricia!.slug);
es(saludo.includes('creatuactivo.com/patricia-reyes/queswa'), 'el saludo trae su enlace, que es lo que nunca recibió');
es(!/paquete|invers|ESP-|c[eé]dula/i.test(saludo), 'y no le vuelve a vender lo que ya compró');
// La puerta: se saluda a quien NO tiene la marca, tenga o no ficha de prospecto.
const puertaSaludo = (p: { device_info?: Record<string, unknown> } | null) => !p || !p.device_info?.saludo_socio_en;
es(puertaSaludo(null), 'socio sin ficha → se saluda');
es(puertaSaludo({ device_info: { es_socio: true } }), 'socia CON ficha de prospecta y sin saludo → se saluda (el caso Patricia)');
es(!puertaSaludo({ device_info: { saludo_socio_en: '2026-09-10T12:00:00Z' } }), 'ya saludada → no se repite');

console.log('\n── 3. El prospecto que pasa a distribuidor ──');
const fichaPrevia = { id: 'x', device_info: { name: 'Ana', momento_optimo: 'caliente', interest_level: 84, hilo_12_niveles: true, invited_by: 'alguien' } };
const { momento_optimo, interest_level, hilo_12_niveles, ...limpio } = fichaPrevia.device_info;
es(!('momento_optimo' in limpio) && !('interest_level' in limpio), 'se le retira la temperatura: un socio no tiene «momento óptimo»');
es(limpio.invited_by === 'alguien', 'se conserva de quién vino (historia, no pipeline)');
es(await convertirProspectoEnSocio(s, 'wa_inexistente_prueba', patricia!, { device_info: { es_socio: true } }) === false,
   'no reconvierte a quien ya está marcado');
// ⚠️ El socio que escribe por PRIMERA vez llega aquí con la ficha en nulo: el
// webhook la lee antes de crearla. Hasta el 12 sep 2026 eso abortaba la
// conversión y el socio quedaba en `expansion`, contado como venta pendiente —
// le pasó a Miguel Barahona en su primer mensaje. Ahora se relee de la base.
es(await convertirProspectoEnSocio(s, 'wa_inexistente_prueba', patricia!, null) === false,
   'sin ficha en la base tampoco inventa una');
const fpNuevo = `wa_prueba_socio_${Date.now()}`;
await s.from('prospects').insert({ fingerprint_id: fpNuevo, stage: 'expansion', source: 'whatsapp_inbound',
  device_info: { channel: 'whatsapp', name: 'Socio Primerizo', phone: '570000000000' } });
es(await convertirProspectoEnSocio(s, fpNuevo, patricia!, null) === true,
   'el socio que escribe por primera vez SÍ se convierte (ficha recién creada, `prospecto` en nulo)');
const { data: recien } = await s.from('prospects').select('stage, user_id, device_info').eq('fingerprint_id', fpNuevo).maybeSingle();
es(recien?.stage === 'maestria' && !!recien?.user_id && recien?.device_info?.es_socio === true,
   'queda en maestría, con user_id y marcado como socio');
es(recien?.device_info?.channel === 'whatsapp' && recien?.device_info?.phone === '570000000000',
   'y al releer la ficha no se le borra lo que ya traía');
// 14 sep 2026: en la primera conversión el nombre REGISTRADO reemplaza al del
// perfil de WhatsApp, que se guarda aparte (caso Erika Cabrejo, «Yenireth»).
es(recien?.device_info?.name === 'Patricia Reyes' && recien?.device_info?.nombre_perfil_whatsapp === 'Socio Primerizo',
   'y el nombre de la ficha pasa a ser el registrado, con el del perfil guardado aparte');
await s.from('prospects').delete().eq('fingerprint_id', fpNuevo);
const { data: fichas } = await s.from('prospects').select('fingerprint_id, stage, user_id, device_info')
  .in('fingerprint_id', ['wa_573128586701', 'wa_573102066593']);
for (const f of fichas || []) {
  const d = (f.device_info || {}) as Record<string, unknown>;
  es(d.es_socio === true && f.stage === 'maestria' && !!f.user_id, `${f.fingerprint_id}: configurada como distribuidora`);
  es(!d.momento_optimo && !d.interest_level, `${f.fingerprint_id}: sin temperatura de prospecto`);
}

console.log('\n── 4. Lo que pidió y no debe redactarse ──');
es(atenderPidePieza('puedes crear una diapositiva?')?.texto === TEXTO_NO_PIEZAS, 'diapositiva → la negativa aprobada');
es(atenderPidePieza('un guión general que hable de los beneficios del consumo de ganoderma', TEXTO_NO_PIEZAS)?.texto
   === TEXTO_NO_PIEZAS_OTRA_VEZ, 'la repregunta sin verbo, tras la negativa, ya no se cuela al modelo');
es(atenderPidePieza('redacta una tarjeta de presentación atractiva como agente especializada')?.texto === TEXTO_NO_PIEZAS,
   'la tarjeta de presentación es una pieza');
es(atenderPidePieza('redáctame un mensaje para mi amigo Andrés, tiene una ferretería') === null,
   'pero el mensaje para alguien concreto sigue siendo el esqueleto del socio');

console.log('\n── 5. Salud: al distribuidor se le da la línea, no la derivación ──');
// Lo que preguntó Patricia el 8 sep. La emergencia NO cambia para nadie.
for (const t of [
  'Quiero que me hables de los beneficios del ganoderma lucidum como coadyuvante en el tratamiento del cáncer de colon',
  'quiero que me aclare cómo puede ayudarme para mitigar los efectos de la quimioterapia',
  'Resume los estudios con evidencia científica del hongo publicados en pubmed',
]) es(!!g.clasificarPreguntaSalud(t), `sigue clasificando como salud: «${t.slice(0, 55)}»`);
es(!!g.detectarEmergencia('me quiero morir'), 'la emergencia sigue cortando igual para todos');
es(!g.detectarEmergencia('cáncer de colon'), 'y una pregunta de producto no es emergencia');
es(/INVIMA/.test(g.RECHAZO_SALUD_SOCIO) && /alimentos y suplementos dietarios/.test(g.RECHAZO_SALUD_SOCIO),
   'la línea al socio conserva el núcleo legal intacto');
es(!/su condici[oó]n|le agradezco la confianza de cont[aá]rmelo/i.test(g.RECHAZO_SALUD_SOCIO),
   'y NO lo trata como a alguien que consulta por lo suyo');
es(g.detectarClaimSaludEnSalida(g.RECHAZO_SALUD_SOCIO) === null, 'pasa el guardarraíl de salud de salida');
es(negocio.detectarPromesaDeIngreso(g.RECHAZO_SALUD_SOCIO) === null, 'pasa el guardarraíl de negocio');
es(g.esRechazoSalud(g.RECHAZO_SALUD_SOCIO) && g.esRechazoSalud(g.RECHAZO_SALUD_SOCIO_OTRA_VEZ),
   'los dos textos se reconocen como rechazo (saneamiento del historial y reincidencia)');
es(g.RECHAZO_SALUD_SOCIO_OTRA_VEZ.length < g.RECHAZO_SALUD_SOCIO.length / 2,
   'la segunda vez no repite el bloque: fue el error con Patricia');

console.log('\n── 6. Lo que pidió Patricia el 11 sep, y no debe perderse ──');
const PIDE = 'Redácta una presentación sugestiva, tentadora y efectiva que atraiga la curiosidad de conocer el sitio creatuactivo.com';
es(atenderPidePieza(PIDE)?.texto === TEXTO_NO_PIEZAS, '«una presentación sugestiva» es una pieza (el patrón exigía calificador)');
es(detectarPidePieza('hazme una presentación del negocio'), '«una presentación del negocio» también');
es(!detectarPidePieza('¿en qué presentación viene el Ganocafé 3 en 1?'), 'pero preguntar por el envase NO es una pieza');
es(!detectarPidePieza('necesito la presentación de las Cápsulas de Ganoderma'), 'ni pedir el envase de un producto con verbo');
es(detectarPidePieza('hazme un flyer con la presentación del Ganocafé'), 'y un flyer sigue siendo pieza aunque nombre el producto');
// El saludo no se lleva la petición: la puerta distingue saludo pelado de petición.
es(esSoloSaludo('Hola') && esSoloSaludo('buenas'), 'el saludo pelado se reconoce');
es(!esSoloSaludo(PIDE), 'una petición NO es saludo pelado → el turno sigue al motor tras saludar');

console.log('\n── 7. El socio que toca un enlace, y el socio al que no se le ve el teléfono (12 sep 2026) ──');
// Miguel Barahona tocó su propio enlace a las 19:47 y el modelo compuso «Bienvenido,
// Antonio. Ya lo tengo en el sistema de Miguel», y de ahí once turnos de venta.
const miguel = { slug: 'miguel-barahona', nombre: 'Miguel', constructorId: 'miguel-barahona-7020577', userId: 'x' };
const propio = mensajeSocioEnlace(miguel, 'miguel-barahona');
es(/es el suyo, Miguel/.test(propio) && /¿Le redacto el mensaje/.test(propio), 'su propio enlace: se le dice qué hace y se le propone lo suyo');
es(!/paquete|invers|ESP-|Bienvenido/i.test(propio), 'sin venderle nada y sin darle la bienvenida como prospecto');
const ajeno = mensajeSocioEnlace(miguel, 'luis-cabrejo');
es(/es de luis-cabrejo, Miguel/.test(ajeno) && /miguel-barahona\/queswa/.test(ajeno), 'el enlace de otro socio: se le recuerda el suyo');
const conNombre = mensajeSocioEnlace(miguel, 'luis-cabrejo-1288', 'Luis Cabrejo');
es(/es de Luis Cabrejo, Miguel/.test(conNombre) && !/1288/.test(conNombre), 'con el nombre resuelto no se le lee el identificador (Liliana, 21 sep)');
es(!/como socio\b/.test(conNombre), 'y sin género: «ya hace parte del equipo»');
es(negocio.detectarPromesaDeIngreso(propio) === null && negocio.detectarPromesaDeIngreso(ajeno) === null, 'los dos pasan el guardarraíl de negocio');
// Victor Armando Rojas, aprobado a las 18:35, escribió a las 19:05 desde una cuenta
// con nombre de usuario y recibió la apertura de prospecto.
es(esBsuid('CO.1955991631759265') && !esBsuid('573142445710'), 'la huella con nombre de usuario se distingue del teléfono');
const tok = await tokenDeVinculoSocio('victor-armando-rojas-beltran-9097', 'secreto-de-prueba');
es(!!tok && tok.length === 16 && /^[A-Za-z0-9_-]+$/.test(tok), 'el token es corto y cabe en una URL');
es(tok === await tokenDeVinculoSocio('Victor-Armando-Rojas-Beltran-9097', 'secreto-de-prueba'), 'y no depende de mayúsculas');
es(tok !== await tokenDeVinculoSocio('victor-armando-rojas-beltran-9097', 'otro-secreto'), 'pero sí del secreto');
es((await tokenDeVinculoSocio('x', '')) === null, 'sin secreto no hay token (el vínculo se niega, no se abre)');
const v = extraerVinculoSocio(`Hola Queswa, soy socio · victor-armando-rojas-beltran-9097.${tok}`);
es(v?.constructorId === 'victor-armando-rojas-beltran-9097' && v?.token === tok, 'el texto prellenado se lee de vuelta');
es(extraerVinculoSocio('Soy socio, y necesito ver el café 3 en 1') === null, 'y «soy socio» a secas no es un vínculo');
// El hilo de Los 12 Niveles es la secuencia de venta: a un socio no se le dicta.
const hist = [{ role: 'assistant', content: 'Los 12 Niveles es nuestra estrategia para construirlo paso a paso. La lógica es la duplicación 2×2. ¿Quiere verlo en el simulador, con la cifra de cada nivel?' }];
const ctxNiveles = (socioQueEscribe: boolean) => ({ canal: 'whatsapp', mensaje: 'Si quiero ver esa cifra', historial: hist, pais: 'CO',
  hiloDoceNiveles: true, simuladorDisponible: true, socioQueEscribe, supabase: s, tenant: 'whatsapp' }) as any;
es((await atenderHiloNiveles(ctxNiveles(true))) === null, 'el «sí» al simulador de un SOCIO no dispara el hilo de venta');
es((await atenderHiloNiveles(ctxNiveles(false)))?.simulador != null, 'y el de un prospecto sí');

console.log('\n── 8. Mover el simulador no es elegir un paquete (caso Liliana, 1 sep; Luz y Miguel, 12 sep) ──');
// La regla vivía solo en el motor; la captura del webhook (1.35) la saltaba.
const { esReporteDelSimulador } = require('../src/lib/wa-simulador.ts') as typeof import('../src/lib/wa-simulador.ts');
for (const r of [
  'Acabo de usar el simulador: paquete ESP-1, con 1 paquetes comprados en cada generación.',
  'Acabo de usar el simulador de renta: tarifa ESP-3 Visionario — 17%, con 10 clientes en cada centro de negocio.',
  'Acabo de usar el simulador de Los 12 Niveles: nivel 2.',
  'Acabo de usar el simulador de la Regalía de Equipo: 6 distribuidores consumiendo.',
]) es(esReporteDelSimulador(r), `reporte del Flow reconocido: «${r.slice(0, 48)}…»`);
es(!esReporteDelSimulador('quiero el visionario'), 'pero «quiero el visionario» sí es una elección');
es(!esReporteDelSimulador('me interesa el ESP-1, ¿cómo arranco?'), 'y nombrar el paquete con sus palabras también');

console.log('\n── 14 sep 2026: respuestas al mensaje de los lunes ──');
const { normalizarLetrasDecorativas } = require('../src/lib/texto-normalizar.ts') as typeof import('../src/lib/texto-normalizar.ts');
const { nombreCortoDeSocio, nombreParaFichaDeSocio } = require('../src/lib/wa-onboarding.ts') as typeof import('../src/lib/wa-onboarding.ts');
for (const [entrada, esperado] of [
  ['𝕐 𝕖𝕤𝕠', 'Y eso'],
  ['ℍ𝕒𝕔𝕖𝕣', 'Hacer'],
  ['ℚ𝕦𝕖 𝕖𝕤 𝕝𝕒 𝕥𝕖𝕔𝕟𝕠𝕝𝕠𝕘𝕚𝕒', 'Que es la tecnologia'],
  ['𝐇𝐨𝐥𝐚 ①', 'Hola 1'],
  ['Ａｃｃｅｓｏ', 'Acceso'],
] as const) es(normalizarLetrasDecorativas(entrada) === esperado, `letras decorativas: «${entrada}» → «${esperado}»`);
const intacto = 'Señora, mi paquete Nº 3 ™ ½ café 🇨🇴 👋';
es(normalizarLetrasDecorativas(intacto) === intacto, 'y no toca tildes, eñes, Nº, ™, ½, banderas ni emojis');
es(nombreCortoDeSocio('Erika Julieth Cabrejo Moreno') === 'Erika Cabrejo', 'nombre corto: dos nombres y dos apellidos → nombre y primer apellido');
es(nombreCortoDeSocio('MONICA ALEJANDRA MALAGON CARDENAS') === 'Monica Malagon', 'nombre corto: la mayúscula sostenida no se repite a gritos');
es(nombreCortoDeSocio('Miguel  barahona') === 'Miguel Barahona', 'nombre corto: espacios dobles y minúscula');
const erika = nombreParaFichaDeSocio({ name: 'Yenireth Urariyu' }, { nombreCompleto: 'Erika Julieth Cabrejo Moreno' });
es(erika.name === 'Erika Cabrejo' && erika.nombre_perfil_whatsapp === 'Yenireth Urariyu',
  'primera conversión: manda el nombre registrado y el del perfil queda aparte (Erika, no «Yenireth»)');
es(Object.keys(nombreParaFichaDeSocio({ es_socio: true, name: 'Armando Rojas' }, { nombreCompleto: 'Victor Armando Rojas Beltrán' })).length === 0,
  'ficha que ya era de socio: no se pisa el nombre (puede ser corrección a mano)');


// ── 9. Lo que es del Centro de Mando se pide en el Centro de Mando (16 sep 2026) ──
// Patricia gastó 20 turnos aquí pidiendo un correo para restaurantes. El mensaje
// para un NEGOCIO, cargar compras y ver su lista viven en queswa.app: aquí recibe
// la invitación y el «sí» le manda el acceso. El mensaje para una PERSONA sí se
// redacta aquí (Director, tras probarlo). Las piezas (guion, video) siguen en su negativa.
console.log('\n── 9. Lo que es del Centro de Mando ──');
const { detectarPideFuncionDashboard, invitacionAlDashboard, botInvitoAlDashboard, saludoDeSocio: saludoNuevo } =
  require('../src/lib/wa-onboarding.ts') as typeof import('../src/lib/wa-onboarding.ts');
for (const [frase, motivo] of [
  ['ayúdame con redactar el contenido de un correo electrónico, dirigido a un restaurante en el que hacen comida de autor', 'redaccion'],
  ['redactar un texto que provoque el consumo de los productos, al gerente de un restaurante', 'redaccion'],
  ['necesito una invitación que llame la atención a dueños de restaurantes y tiendas naturistas', 'redaccion'],
  ['Redácta un mensaje para varias empresas de la ciudad', 'redaccion'],
  ['cárgueme una compra de 4 cajas de 3 en 1', 'funcion'],
  ['cómo van las personas que han llegado por mi enlace', 'funcion'],
  ['quiero ver mi lista', 'funcion'],
] as const) es(detectarPideFuncionDashboard(frase) === motivo, `«${frase.slice(0, 60)}» → ${motivo}`);
for (const frase of [
  'redáctame un mensaje para mi amigo Andrés, tiene una ferretería',
  'escríbale a Sandra',
  'necesito un mensaje para mi hermana, es dueña de una tienda',
  'ayúdame a escribirle a un conocido que tiene un restaurante',
  '¿cuánto vale el paquete ESP-2?', '¿qué le respondo si me pregunta si es pirámide?', 'en qué presentación viene el Ganocafé', 'Gracias',
]) es(detectarPideFuncionDashboard(frase) === null, `«${frase}» se queda en el canal`);
const inv = invitacionAlDashboard('Patricia', 'redaccion');
es(/para un negocio/.test(inv) && /Centro de Mando, Patricia/.test(inv) && /por ser socio/.test(inv) && inv.endsWith('¿Le mando el acceso?'), 'la invitación suena a privilegio y cierra ofreciendo el acceso');
es(botInvitoAlDashboard(inv), 'el «sí» que sigue se reconoce por el cierre de la invitación');
// 5 oct 2026 (Miguel Barahona): la bitácora hace que el modelo re-ofrezca el acceso
// con sus palabras, y «Si» caía al motor; el modelo escribió que el equipo le acababa
// de enviar el acceso y no se había enviado nada. La oferta se reconoce por su FORMA.
const { detectarAccesoInventado, TEXTO_ACCESO_ENVIADO, ACCESO_NO_ENVIADO } =
  require('../src/lib/wa-onboarding.ts') as typeof import('../src/lib/wa-onboarding.ts');
es([
  'Hola, Miguel. Quedamos en mandarle el acceso a queswa.app para que vea la Proyección Patrimonial con sus datos.\n\n¿Le mando el enlace de acceso ahora?',
  '¿Quiere que le mande el acceso a queswa.app?',
  'Eso lo ve en su Centro de Mando. ¿Se lo paso?'.replace('¿Se lo paso?', '¿Le paso el acceso?'),
  'Su Proyección Patrimonial está en queswa.app. ¿Le envío el acceso ahora mismo?',
].every(botInvitoAlDashboard), 'la oferta del acceso se reconoce por su forma, con las palabras del modelo');
es([
  '¿Le mando el enlace del catálogo?', '¿Le mando la foto del Cordygold?', '¿Le mando el acceso al catálogo?',
  'Le mando el acceso cuando quiera. ¿Qué más necesita?', 'Cuando quiera, le tomo los datos de la vinculación.',
  'El equipo le acaba de enviar el acceso a queswa.app.\n\n¿Hay algo más en lo que le pueda ayudar mientras tanto?',
].every((m) => !botInvitoAlDashboard(m)), 'ni el catálogo, ni una foto, ni una oferta que no cierra el turno cuentan como oferta de acceso');
es([
  'Listo. El equipo le acaba de enviar el acceso a queswa.app.',
  'Ya le envié el acceso; revise su WhatsApp.', 'Le acabo de mandar el enlace de acceso.',
  'El acceso ya fue enviado a su chat.', 'El equipo le manda el acceso en un momento.',
].every((m) => !!detectarAccesoInventado(m)), 'el borrador que da por enviado el acceso se caza');
es([
  '¿Le mando el acceso?', inv, ACCESO_NO_ENVIADO, 'Cuando entre, busca la Proyección Patrimonial y la corre con su tarifa.',
  'Le acabo de enviar el enlace del catálogo.', 'El acceso lo manda el sistema cuando usted diga que sí.',
].every((m) => detectarAccesoInventado(m) === null), 'la oferta, la invitación, el aviso de no enviado y el catálogo no se confunden con un acceso inventado');
es(/queswa\.app/.test(TEXTO_ACCESO_ENVIADO) && /mismo chat/.test(TEXTO_ACCESO_ENVIADO), 'el texto del acceso enviado dice dónde llega');
es(/en su Centro de Mando sí/.test(invitacionAlDashboard('Patricia', 'redaccion', true)), 'si insiste, una línea y la misma puerta');
es(atenderPidePieza('hazme un video para instagram')?.texto === TEXTO_NO_PIEZAS && detectarPideFuncionDashboard('hazme un video para instagram') === null,
   'una pieza para publicar sigue en su negativa, no va al Dashboard');
es(/Le redacto el mensaje/.test(saludoNuevo('Ana', 'ana-x')), 'el saludo del socio sigue ofreciendo redactar (para personas)');
// 28 sep 2026: ver la lista es del Centro de Mando, y el saludo cierra con UNA pregunta.
const { SEMANA_EN_SALUDO_SOCIO } = require('../src/lib/wa-lunes-socio.ts') as typeof import('../src/lib/wa-lunes-socio.ts');
const sNuevo = saludoNuevo('Ana', 'ana-x');
es(!/c[oó]mo va cada persona|persona que ha llegado/i.test(sNuevo), 'el saludo ya no ofrece revisar la lista (es del Centro de Mando)');
es((sNuevo.match(/\?/g) || []).length === 1, 'el saludo cierra con una sola pregunta');
es(!SEMANA_EN_SALUDO_SOCIO || (sNuevo.includes(SEMANA_EN_SALUDO_SOCIO.puente) && sNuevo.endsWith(SEMANA_EN_SALUDO_SOCIO.oferta)),
   'retoma la línea de la semana del mensaje de los lunes');

// ── 10. Las cifras del socio (2 oct 2026, Miguel Barahona) ──
// Visionario, vio la tabla del Kit al 10% y pidió «ese mismo sistema en paquetes
// empresariales 3». El modelo la compuso mal, el guardarraíl la bloqueó dos veces
// con reemplazos de prospecto, y después le ofreció el simulador —cerrado para él—
// y se lo negó. Hoy: la tabla la calcula el sistema, el reemplazo es de socio y el
// cierre lleva a su Proyección Patrimonial; todo cierra en «¿Le mando el acceso?».
console.log('\n── 10. Las cifras del socio ──');
const { paqueteParaNivelesSocio, respuestaNivelesSocio } =
  require('../src/lib/wa-simulador.ts') as typeof import('../src/lib/wa-simulador.ts');
const { sinSimuladorParaSocio, OFERTA_SIMULADOR_NIVELES, CIERRE_SOCIO_PROYECCION } =
  require('../src/lib/wa-apertura.ts') as typeof import('../src/lib/wa-apertura.ts');
const tablaKit = 'hasta llegar, al nivel 12, a los **8.190 distribuidores**.';
es(paqueteParaNivelesSocio('Sería bueno ese mismo sistema en paquetes empresariales 3', tablaKit) === 'ESP-3',
   '«ese mismo sistema en paquetes empresariales 3» pide la tabla con el ESP-3');
es(paqueteParaNivelesSocio('y con el ESP 2 cuanto seria', tablaKit) === 'ESP-2' && paqueteParaNivelesSocio('la misma tabla con visonario', '') === 'ESP-3',
   'el ESP-2 y el visionario mal escrito también');
es(['qué trae el ESP-3?', 'cuánto cuesta el visionario', 'explíqueme el bono gen5 del esp-3', 'y con el kit?']
     .every((m) => paqueteParaNivelesSocio(m, tablaKit) === null),
   'lo que pregunta qué trae, cuánto cuesta o el bono sigue su camino');
// ⚠️ El 17% del ESP-3 vence a los seis meses (COMP_BIN_02): Los 12 Niveles no se
// proyectan con él. Unas horas del 2 oct salió una tabla hasta el nivel 12 al 17%.
const conEsp3 = respuestaNivelesSocio('ESP-3');
es(/17%\*? durante los primeros seis meses/.test(conEsp3) && /base del 10%, que no vence/.test(conEsp3) && !/175|\$/.test(conEsp3),
   'con el ESP-3: la tarifa con su vigencia, sin tabla al 17%');
es(/dos meses/.test(respuestaNivelesSocio('ESP-1')) && /cuatro meses/.test(respuestaNivelesSocio('ESP-2')), 'cada paquete con su vigencia');
es(!negocio.detectarPromesaDeIngreso(conEsp3), 'el guardarraíl no la bloquea, ni el saneamiento la cambia al turno siguiente');
es(botInvitoAlDashboard(conEsp3), 'cierra en el acceso a su Proyección Patrimonial');
const h = (c: string) => [{ role: 'assistant', content: c }];
es(negocio.correctivaSegunHilo(h('x'), { socio: true }) === negocio.CORRECTIVA_SOCIO
   && negocio.correctivaSegunHilo(h(negocio.CORRECTIVA_SOCIO), { socio: true }) === negocio.CORRECTIVA_SOCIO_BIS,
   'el reemplazo por cifras es de socio, y cambia si insiste');
es(botInvitoAlDashboard(negocio.CORRECTIVA_SOCIO) && botInvitoAlDashboard(negocio.CORRECTIVA_SOCIO_BIS), 'los dos reemplazos del socio cierran en el acceso');
es(negocio.correctivaSegunHilo(h('x')) === negocio.RESPUESTA_CORRECTIVA, 'al prospecto le sigue llegando el suyo');
const conOferta = sinSimuladorParaSocio(`Material de NIVELES_01.\n\n**Pregunta de seguimiento:** ${OFERTA_SIMULADOR_NIVELES}`);
es(!conOferta.includes(OFERTA_SIMULADOR_NIVELES) && conOferta.endsWith(CIERRE_SOCIO_PROYECCION),
   'al socio no se le ofrece el simulador: le llega el cierre de su Proyección Patrimonial');

// ── 11. La estrategia para el socio: el video y el detalle (2 oct 2026) ──
// El Director la pidió y le llegó el texto compuesto, con un cierre inventado.
// Hoy: la pide → el video, con el pie que ofrece estudiarla; el «sí» o pedirla en
// detalle → la tabla de los doce niveles (5 oct 2026) y el enlace a la pantalla 9.
console.log('\n── 11. La estrategia para el socio ──');
const { pasoNivelesSocio, detalleNivelesSocio } =
  require('../src/lib/wa-simulador.ts') as typeof import('../src/lib/wa-simulador.ts');
const { CIERRE_VIDEO_NIVELES_SOCIO } = require('../src/lib/wa-apertura.ts') as typeof import('../src/lib/wa-apertura.ts');
const { enlacePresentacion } = require('../src/lib/wa-onboarding.ts') as typeof import('../src/lib/wa-onboarding.ts');
es(['Hola, dame la estrategia de los 12 niveles', 'Hola quiero ver los doce niveles', 'explíqueme los 12 nivles']
     .every((m) => pasoNivelesSocio(m, '', false) === 'video'),
   'pedir la estrategia (la del Director, la de Miguel, con typo) → el video');
es(pasoNivelesSocio('Si', `…\n\n${CIERRE_VIDEO_NIVELES_SOCIO}`, true) === 'detalle'
   && pasoNivelesSocio('cuánto se gana en los 12 niveles', '', false) === 'detalle',
   'el «sí» al pie del video, o pedirla en detalle → el detalle');
es(['hasta cuándo va el plan de 12 niveles', 'cuál es la inversión para los 12 niveles', 'quiero 12 nuevos clientes']
     .every((m) => pasoNivelesSocio(m, '', false) === null),
   'las preguntas con respuesta propia en el arsenal siguen su camino');
const enlace9 = enlacePresentacion('miguel-barahona', 9);
const detalle = detalleNivelesSocio('ESP-3', 'CO', enlace9);
// 5 oct 2026, Director: «demasiada carga cognitiva». Doce filas, llegan → total;
// «distribuidores» completo solo en el nivel 1 y «Total:» solo en el nivel 2; sin los cuatro pasos, sin la tarifa
// del paquete y sin el potencial matemático.
es(detalle.includes('*Nivel 1* · 2 distribuidores · $25.200 COP')
   && detalle.includes('*Nivel 2* · llegan 4 · Total: 6 Dist. · $75.600 COP')
   && detalle.includes('*Nivel 3* · llegan 8 · 14 Dist. · $176.400 COP')
   && detalle.includes('*Nivel 12* · llegan 4.096 · 8.190 Dist. · $103.194.000 COP') && !detalle.includes('175.429.800'),
   'doce filas al 10%: cuántos llegan, el total y la regalía del mes');
es((detalle.match(/^\*Nivel \d+\*/gm) || []).length === 12 && (detalle.match(/distribuidores/g) || []).length === 1
   && (detalle.match(/Total:/g) || []).length === 1,
   '«distribuidores» va completo solo en el nivel 1 y «Total:» solo en el nivel 2; después «Dist.» y la cifra sola');
es(!/tarifa es del|cuatro pasos|potencial matem|canal izquierdo/.test(detalle), 'sin la tarifa del paquete, sin los pasos y sin el potencial matemático');
es(detalle.trimEnd().endsWith(enlace9) && enlace9.endsWith('/miguel-barahona/presentacion?pantalla=9'), 'termina en la pantalla 9 de su presentación');
es(!/tarifa es del/.test(detalleNivelesSocio(null, 'CO', enlace9)) && !/tarifa es del/.test(detalleNivelesSocio('KIT', 'CO', enlace9)),
   'sin paquete, o con el Kit, no hay línea de vigencia');
es(pasoNivelesSocio('sí', '…\n\n¿Se la explico en detalle, nivel por nivel y con la tarifa de su paquete?', true) === 'detalle',
   'el «sí» al pie de unas horas del 2 oct sigue valiendo');
es(!negocio.detectarPromesaDeIngreso(detalle) && !g.detectarClaimSaludEnSalida(detalle), 'ningún guardarraíl bloquea el detalle');

// ── 12. El distribuidor del socio que quiere activarse, y el socio que pide su acceso (5 oct 2026) ──
// Miguel Barahona, 3 oct: Carolina ya tenía código con él y quería trabajar; Queswa le
// redactó la invitación de frío y le dio a Miguel su enlace de prospecto. Nadie activa por
// fuera de administración: Queswa pide los tres datos y la solicitud va a sistema@.
console.log('\n── 12. El distribuidor que quiere activarse, y el acceso directo ──');
const act = require('../src/lib/wa-activacion-distribuidor.ts') as typeof import('../src/lib/wa-activacion-distribuidor.ts');
const { ESQUELETO_REDACCION_SOCIO } = require('../src/lib/wa-redaccion-socio.ts') as typeof import('../src/lib/wa-redaccion-socio.ts');
es(act.detectarDistribuidorQuiereActivarse('Tengo una persona que tiene código en Gano Excel conmigo y quiere generar unos que le digo', ''),
   'la frase de Miguel (Carolina: código conmigo + quiere generar) abre el nodo');
es(['mi distribuidora quiere arrancar, qué le digo', 'ella ya está inscrita conmigo y quiere trabajar el negocio', 'lo inscribí yo hace un año y ahora quiere activarse']
     .every((m) => act.detectarDistribuidorQuiereActivarse(m, '')), 'otras formas de decirlo también');
es(['Tengo una persona que tiene código en Gano Excel y quiere volver hacer este proyecto como le digo',
    'mi distribuidora pregunta cuánto vale el ESP-2', 'redáctame un mensaje para mi amigo Andrés, tiene una ferretería', '¿cuánto vale el paquete ESP-2?']
     .every((m) => !act.detectarDistribuidorQuiereActivarse(m, '')), 'la de Andrea (sin decir de quién es el código), una pregunta del plan y una redacción normal no');
const preguntaModelo = `Con gusto. ${act.PREGUNTA_CODIGO_CON_USTED} Y ¿se tratan de tú o de usted?`;
es(['sí, conmigo', 'Si', 'conmigo', 'sí señora, en mi sistema'].every((m) => act.detectarDistribuidorQuiereActivarse(m, preguntaModelo))
   && ['no, con otra persona', 'No', 'no sé'].every((m) => !act.detectarDistribuidorQuiereActivarse(m, preguntaModelo)),
   'el «sí» a la pregunta del modelo cae en el nodo; el «no» sigue al esqueleto');
es(ESQUELETO_REDACCION_SOCIO.includes(act.PREGUNTA_CODIGO_CON_USTED) && /YA TUVO CÓDIGO/.test(ESQUELETO_REDACCION_SOCIO),
   'el esqueleto trae la pregunta literal y el estado del PASO 1');
es(act.botPidioDatosDistribuidor(act.PIDE_DATOS_DISTRIBUIDOR) && act.botPidioDatosDistribuidor(act.textoFaltanDatos({ nombre: '', whatsapp: '573001234567', codigo: '', faltan: ['el nombre completo', 'el código de Gano'] }))
   && !act.botPidioDatosDistribuidor(inv), 'la respuesta a la petición de datos se reconoce por su forma');
const d1 = act.extraerDatosDistribuidor('Se llama Carolina Pérez, su número es 300 123 4567 y el código de Gano es 7020588');
es(d1.nombre === 'Carolina Pérez' && d1.whatsapp === '573001234567' && d1.codigo === '7020588' && d1.faltan.length === 0, 'nombre, WhatsApp y código salen del mensaje escrito como la gente escribe');
const d2 = act.extraerDatosDistribuidor('Carolina Pérez 3001234567');
es(d2.nombre === 'Carolina Pérez' && d2.whatsapp === '573001234567' && d2.codigo === '' && d2.faltan.join() === 'el código de Gano', 'sin código: no frena, se anota como faltante');
const d3 = act.extraerDatosDistribuidor('Carolina Pérez');
es(d3.nombre === 'Carolina Pérez' && !d3.whatsapp && /el WhatsApp/.test(act.textoFaltanDatos(d3)) && !/código/.test(act.textoFaltanDatos(d3)), 'sin WhatsApp se pide solo el WhatsApp');
es(!act.extraerDatosDistribuidor('¿y ella tiene que pagar algo?').nombre, 'una pregunta no se lee como datos');
const correo = act.cuerpoSolicitudActivacion({ nombre: 'Miguel Barahona', slug: 'miguel-barahona', constructorId: 'miguel-barahona-7020577' }, '573188292631', d1, 'Se llama Carolina…');
es(/ACTIVAR Carolina Pérez 573001234567 7020588/.test(correo.texto) && /\[Activación\] Carolina Pérez/.test(correo.asunto), 'el correo a administración trae el comando listo para copiar');
es(/equipo de creatuactivo\.com/.test(act.textoSolicitudEnviada('Carolina')) && !/equipo directivo/.test(act.PIDE_DATOS_DISTRIBUIDOR + act.TEXTO_SOLICITUD_NO_ENVIADA), 'el equipo se nombra como manda el léxico');
es(['mándeme el acceso', 'quiero entrar a queswa.app', 'no puedo entrar a mi cuenta', 'cómo ingreso al centro de mando', 'me manda el acceso al dashboard por favor']
     .every(act.detectarPideAcceso), 'el socio que pide su acceso lo recibe sin invitación de por medio');
es(['mándeme mi enlace', 'mándeme el enlace de productos', 'el acceso para mi amigo Andrés', '¿cuánto vale el ESP-2?', 'dame acceso al catálogo', 'quiero entrar con un paquete']
     .every((m) => !act.detectarPideAcceso(m)), 'su enlace, el acceso para otro, el catálogo y una pregunta del plan no');

console.log(`\n${fallos ? `❌ ${fallos} fallo(s)` : '✅ Experiencia del socio en verde'}`);
process.exit(fallos ? 1 : 0);
