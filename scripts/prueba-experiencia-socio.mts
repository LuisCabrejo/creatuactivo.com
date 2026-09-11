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
const { identificarSocio, saludoDeSocio, convertirProspectoEnSocio, slugDesdeNombre } =
  require('../src/lib/wa-onboarding.ts') as typeof import('../src/lib/wa-onboarding.ts');
const { atenderPidePieza, TEXTO_NO_PIEZAS, TEXTO_NO_PIEZAS_OTRA_VEZ } =
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

console.log(fallos ? `\n❌ ${fallos} fallo(s)` : '\n✅ Todo en verde');
process.exit(fallos ? 1 : 0);
