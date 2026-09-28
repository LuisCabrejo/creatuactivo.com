/**
 * Prueba de los enlaces de los reels «Cómo funciona» y «Los 12 Niveles» (28 sep 2026).
 *
 * El texto del reel compartible lleva `creatuactivo.com/{slug}/como-funciona`,
 * que abre WhatsApp con «Hola Queswa, vengo del enlace de {slug}. Ya vi el video
 * de cómo funciona.». Director: el enlace tiene que entregarle a Queswa el
 * contexto de que la persona ya vio el video. Esta prueba, sin red, comprueba:
 *   · que el detector reconoce la frase (y sus variantes de dedo) y no se dispara
 *     con el saludo normal ni con quien PREGUNTA cómo funciona;
 *   · que las dos aperturas no ofrecen el botón que repetiría el video;
 *   · que lo que se guarda lleva la firma de WHY_02, para que la bitácora marque
 *     el tema como ya mostrado.
 *
 * Correr:  npx tsx scripts/prueba-enlace-video.mts   (exit 1 si algo falla)
 */
import { config } from 'dotenv'; config({ path: '.env.local', quiet: true });
const {
  vieneDelVideoComoFunciona, APERTURA_TRAS_VIDEO_OPCIONES, APERTURA_OPCIONES,
  construirAperturaTrasVideo, aperturaRetornoTrasVideo, notaVideoComoFuncionaVisto,
  vieneDelVideoDoceNiveles, construirAperturaTrasVideoNiveles, aperturaRetornoTrasVideoNiveles, notaVideoDoceNivelesVisto,
} = await import('../src/lib/wa-apertura');
const { temasDelTexto } = await import('../src/lib/queswa-bitacora');

let fallos = 0;
const ok = (m: string) => console.log(`  ✅ ${m}`);
const mal = (m: string) => { fallos++; console.log(`  ❌ ${m}`); };
const espera = (m: string, c: boolean) => (c ? ok(m) : mal(m));

console.log('\n1 · El detector');
const SI = [
  'Hola Queswa, vengo del enlace de luis-cabrejo. Ya vi el video de cómo funciona.',
  'Hola Queswa, vengo del enlace de luis-cabrejo. Ya vi el video de como funciona',
  'hola queswa vengo del enlace de luis-cabrejo ya vi el vídeo de cómo funciona',
  'Hola Queswa, vengo del enlace de luis-cabrejo. Ya vi el video cómo funciona.',
];
const NO = [
  'Hola Queswa, vengo del enlace de luis-cabrejo',
  '¿Cómo funciona?',
  'Quiero ver el video de cómo funciona',
  'Hola Queswa, vengo del enlace de luis-cabrejo. Quiero preguntar por los productos.',
  'no vi el video, ¿cómo funciona esto?',
];
for (const t of SI) espera(`reconoce: «${t.slice(-45)}»`, vieneDelVideoComoFunciona(t));
for (const t of NO.slice(0, 4)) espera(`no se dispara: «${t.slice(-45)}»`, !vieneDelVideoComoFunciona(t));
// «no vi el video» contiene «vi el video» pero no «de cómo funciona» pegado: se
// documenta el comportamiento en vez de fingir que el regex entiende negaciones.
console.log(`  ℹ️  «${NO[4]}» → ${vieneDelVideoComoFunciona(NO[4]) ? 'se dispara' : 'no se dispara'} (solo llega por el enlace: el webhook exige además «vengo del enlace»)`);

console.log('\n2 · Las aperturas');
espera('dos botones, sin «Cómo funciona»', APERTURA_TRAS_VIDEO_OPCIONES.length === 2 && !APERTURA_TRAS_VIDEO_OPCIONES.some((o) => o.id === 'apertura_sistema'));
espera('los dos que quedan son los de la apertura estándar, en su orden',
  JSON.stringify(APERTURA_TRAS_VIDEO_OPCIONES.map((o) => o.id)) === JSON.stringify(APERTURA_OPCIONES.slice(1).map((o) => o.id)));
const conSocio = construirAperturaTrasVideo('Luis Cabrejo', 'Marcela');
const sinSocio = construirAperturaTrasVideo(undefined, undefined);
console.log(`\n${conSocio}\n\n---\n\n${sinSocio}\n\n---\n\n${aperturaRetornoTrasVideo('Marcela')}\n`);
espera('nombra al socio y dice «la misma del video»', /asiste a Luis/.test(conSocio) && /la misma del video/.test(conSocio));
espera('sin socio, nombra a CreaTuActivo', /inteligencia artificial de CreaTuActivo, la misma del video/.test(sinSocio));
espera('retoma la promesa del video («cómo aplicaría»)', /cómo aplicaría en su caso/.test(conSocio));
espera('sin el credo ni las viñetas de la apertura estándar', !/creemos|•/i.test(conSocio));
espera('el retorno reconoce el video', /ya vio el video de cómo funciona/.test(aperturaRetornoTrasVideo('Marcela')));

console.log('\n3 · Lo que se guarda');
const nota = notaVideoComoFuncionaVisto();
espera('la nota lleva la firma de WHY_02 (la bitácora lo da por mostrado)', temasDelTexto(nota).has('como_funciona'));
espera('la nota dice la forma única del gancho', /empresa de distribuci[oó]n moderna/.test(nota));
espera('la nota no trae la pregunta de cierre de WHY_02', !/\?\s*$/m.test(nota));

console.log('\n4 · «Los 12 Niveles» (/{slug}/estrategia)');
const NIV = 'Hola Queswa, vengo del enlace de luis-cabrejo. Ya vi el video de los 12 niveles.';
espera('reconoce la frase del enlace', vieneDelVideoDoceNiveles(NIV));
espera('reconoce «doce» y sin tilde en vídeo', vieneDelVideoDoceNiveles('ya vi el video de los doce niveles') && vieneDelVideoDoceNiveles('ya vi el vídeo de 12 niveles'));
espera('no se cruza con «Cómo funciona»', !vieneDelVideoComoFunciona(NIV) && !vieneDelVideoDoceNiveles(SI[0]));
espera('no se dispara con quien pregunta por la estrategia', !vieneDelVideoDoceNiveles('¿qué son los 12 niveles?'));
const aNiv = construirAperturaTrasVideoNiveles('Luis Cabrejo', 'Marcela');
console.log(`\n${aNiv}\n\n---\n\n${aperturaRetornoTrasVideoNiveles('Marcela')}\n`);
espera('una sola oferta: el simulador, al final', /¿Quiere verlo en el simulador, con la cifra de cada nivel\?$/.test(aNiv) && (aNiv.match(/\?/g) || []).length === 1);
espera('nombra «12 Niveles» (el nodo 2.4 abre la pantalla de los niveles)', /12 Niveles/.test(aNiv));
espera('sin «la misma del video» (Queswa no sale en este video)', !/la misma del video/.test(aNiv));
espera('el retorno ofrece el simulador', /simulador/.test(aperturaRetornoTrasVideoNiveles('Marcela')));
const notaNiv = notaVideoDoceNivelesVisto();
espera('la nota lleva la firma del tema «estrategia» de la bitácora', temasDelTexto(notaNiv).has('estrategia'));
espera('la nota no trae el precio del Kit (el video no lo dice)', !/PRECIO_KIT|\$\s?\d{3}\.\d{3}/.test(notaNiv));

console.log(fallos ? `\n❌ ${fallos} fallo(s)` : '\n✅ Todo en verde');
process.exit(fallos ? 1 : 0);
