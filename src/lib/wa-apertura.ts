/**
 * Copyright © 2026 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * Apertura de Queswa en WhatsApp — copy dictado por el backend.
 *
 * Mismo patrón que `respuestas-maestras.ts` y `getMicroPromptApertura()`: cuando
 * el texto es calibrado y no admite paráfrasis, lo dicta el backend y el modelo
 * no interviene. Aquí además hay dos razones propias del canal:
 *
 *   1. La apertura nombra al SOCIO que refirió, y ese dato solo lo tiene el
 *      webhook (lo resuelve `resolverPatrocinador()` del texto de entrada).
 *   2. Va con botones interactivos, que solo la capa de canal sabe enviar.
 *
 * ⚠️ NO usar `getInitialGreeting()` de `queswa-greeting.ts` aquí: ese saludo es
 * compartido con la web y no conoce al socio ni declara la identidad de IA.
 *
 * Las tres decisiones que sostienen este texto (4 ago 2026):
 *
 * • **Nombrar al socio primero.** Transferencia de confianza: el prospecto no le
 *   presta crédito a un número desconocido, se lo presta a quien ya conoce. Es la
 *   palanca más fuerte del primer mensaje, por encima de la velocidad de respuesta.
 *
 * • **Declarar que es IA, antes del diálogo.** La divulgación previa sube la
 *   satisfacción en servicios de alto contacto; que lo descubran después destruye
 *   la confianza casi sin reparación. Y aquí no es un costo: es el argumento —
 *   la persona no lee una promesa sobre la herramienta, la está usando.
 *
 * • **Sin pronombre para el socio.** Decía "Él me pidió que lo recibiera", y de
 *   los diez socios registrados la mayoría son mujeres — con ese texto la
 *   apertura las trataba a todas en masculino. "Me pidió que lo recibiera"
 *   funciona para cualquiera y no pierde nada. NO reintroducir el pronombre.
 *
 * • **Sin pregunta abierta.** El villano NO va en la apertura: es un diagnóstico
 *   entregado como veredicto a alguien de quien no sabemos nada, y a quien no le
 *   aprieta el mes se exime en la línea tres. Se narra después, cuando la persona
 *   ya habló y se le puede calzar a su caso.
 *
 * Ver docs/handoff/negocio/ESTRATEGIA_CANAL_WHATSAPP.md §8.
 */

import type { WAButton } from '@/lib/wa-channel';
import { getRespuestaMaestra } from '@/lib/respuestas-maestras';
import { aFormatoWhatsApp } from '@/lib/wa-formato';
import { sinDiacriticos } from '@/lib/texto-normalizar';

/**
 * Las tres preguntas reales del prospecto, en su voz, como botones VISIBLES.
 *
 * Iban como lista interactiva y había que tocar "Ver opciones" para verlas. Con
 * tres opciones eso esconde el menú: quien toca una no recuerda que existían las
 * otras dos y sigue preguntando por su cuenta. Los botones de respuesta se ven
 * sin desplegar nada — y Meta permite exactamente hasta tres.
 *
 * El orden es el de la conversación real (Director, 7 ago 2026): primero qué es
 * esto, luego de dónde sale la plata, y al final —cuando ya hay contexto— la
 * pregunta que de verdad decide, que es si yo sería capaz.
 *
 * ⚠️ **20 caracteres es el tope duro de Meta** para el título de un botón; si se
 * pasa, rechaza el mensaje entero. "Cómo entra el dinero" está justo en 20.
 * ⚠️ Los títulos van en PRIMERA persona a propósito: al tocar, Meta manda el
 * título como MENSAJE DEL USUARIO. "Qué debe hacer usted" se leería como si el
 * prospecto le preguntara a Queswa qué debe hacer Queswa.
 */
export const APERTURA_OPCIONES: WAButton[] = [
  { id: 'apertura_sistema', title: 'Cómo funciona' },
  { id: 'apertura_dinero',  title: 'Cómo entra el dinero' },
  { id: 'apertura_rol',     title: 'Qué debo hacer yo' },
];

// La traducción de formato vive en `wa-formato.ts`: aquí solo se aplica. La
// versión local hacía únicamente `**` → `*`, y las respuestas maestras traen
// también viñetas y separadores de Markdown que WhatsApp imprime literales.

/**
 * Texto dictado para cada opción de la apertura, o `null` si esa opción no
 * tiene uno y debe ir por el motor.
 *
 * Las opciones 2 y 3 NO se copian aquí: se leen de `respuestas-maestras.ts`,
 * que a su vez está obligado a coincidir carácter por carácter con los bloques
 * `<verbatim_lock>` de `arsenal_inicial.txt`. Duplicar el texto habría creado
 * una tercera copia que se desincroniza sola; derivarlo mantiene una sola verdad
 * y hace que una corrección en el arsenal llegue también a WhatsApp.
 *
 * ⚠️ Estas dos son largas para el canal (1.3–1.5 K caracteres, seis y ocho
 * bloques) frente a la regla de "3–4 líneas por mensaje" del system prompt. Se
 * conservan íntegras a propósito: son respuestas con candado verbatim y
 * recortarlas sería reescribir doctrina. Si se quiere partirlas en varios
 * mensajes, decidirlo explícitamente — no hacerlo por goteo.
 */
export function getRespuestaBoton(opcionId: string): string | null {
  // Las TRES tienen respuesta canónica con candado verbatim. La del dinero se
  // sumó el 7 ago 2026: antes estaba hardcodeada aquí y era inalcanzable
  // escribiendo — solo salía tocando un botón que aparece una vez.
  const canonica: Record<string, string> = {
    apertura_sistema: '¿Y esto cómo funciona, exactamente?',
    apertura_dinero:  '¿de dónde sale el dinero?',
    apertura_rol:     '¿Cómo lo haría yo? ¿Qué hago en el día a día?',
  };

  const chip = canonica[opcionId];
  if (!chip) return null;

  const maestra = getRespuestaMaestra(chip);
  return maestra ? aFormatoWhatsApp(maestra) : null;
}

/**
 * Nombres de pila frecuentes en Colombia y el mundo hispano.
 *
 * Es una LISTA BLANCA a propósito, no un detector de negocios. Un detector se
 * equivoca hacia el lado caro ("Hola, Barbería"); una lista blanca se equivoca
 * hacia el barato (no saluda por nombre a alguien con un nombre poco común, que
 * es exactamente lo que hacíamos con todos hasta ahora).
 *
 * Se compara sin tildes y en minúscula, así que basta una forma por nombre.
 */
const NOMBRES_MASCULINOS = new Set([
  'juan','carlos','jose','luis','jorge','andres','diego','julian','camilo','santiago',
  'sebastian','david','daniel','miguel','fernando','ricardo','oscar','alvaro','javier','alejandro',
  'felipe','mauricio','german','hernan','ivan','jhon','john','wilson','edison','nelson',
  'fabian','cristian','christian','brayan','brahyam','yeison','jefferson','duvan','edwin','anderson',
  'alex','alexander','gustavo','hugo','ruben','raul','rafael','ramiro','pedro','pablo',
  'manuel','marco','mario','martin','nestor','orlando','omar','rodrigo','sergio','victor',
  'wilmar','yesid','arnulfo','efrain','elkin','freddy','gabriel','gerardo','gilberto','gonzalo',
  'guillermo','hector','henry','jaime','jairo','jesus','joaquin','leonardo','libardo','marlon',
  'nicolas','oswaldo','rigoberto','samuel','tomas','uriel','esteban','emilio','ernesto','eduardo',
  'enrique','antonio','alberto','armando','arturo','benjamin','bernardo','cesar','ceferino','cristobal',
  'damian','dario','edgar','eliecer','emmanuel','ferney','francisco','geovanny','giovanny','harold',
  'ignacio','isaac','israel','jarrison','jhonatan','jonathan','julio','kevin','lorenzo','lucas',
  'matias','mateo','maximiliano','norberto','octavio','pastor','ramon','reinaldo','roberto','rodolfo',
  'rolando','salvador','saul','simon','teodoro','vicente','wilfredo','william','yohan',
]);

const NOMBRES_FEMENINOS = new Set([
  'maria','ana','luz','martha','marta','sandra','diana','claudia','paola','carolina',
  'catalina','natalia','andrea','adriana','alejandra','angela','beatriz','blanca','carmen','cecilia',
  'clara','consuelo','daniela','dora','elena','elizabeth','erika','esperanza','fabiola','flor',
  'gloria','gladys','graciela','hilda','ingrid','irma','isabel','jenny','jessica','johana',
  'johanna','juliana','karen','karina','laura','leidy','liliana','lina','lorena','lucia',
  'luisa','magda','marcela','margarita','mariana','maribel','marisol','mercedes','michelle','milena',
  'monica','myriam','miriam','nancy','nidia','nubia','olga','patricia','paula','pilar',
  'rocio','rosa','rubiela','ruth','sara','silvia','sofia','sonia','stella','tatiana',
  'teresa','valentina','vanessa','veronica','victoria','viviana','yolanda','yuliana','zulma','belcy',
  'maryi','sidney','amparo','aura','cielo','edilma','eugenia','fanny','gina','ines',
  'janeth','leonor','ligia','lucero','luzmila','melissa','nataly','nelly','norma','oliva',
  'omaira','rosalba','sirley','sol','yamile','yaneth','yenny',
]);

const NOMBRES_DE_PILA = new Set([...NOMBRES_MASCULINOS, ...NOMBRES_FEMENINOS]);

/** Palabras que delatan un nombre comercial aunque empiece con un nombre de pila. */
const RE_MARCA = /\b(sas|s\.a\.s|ltda|cia|sa|inc|corp|store|shop|boutique|barberia|barbería|salon|salón|spa|restaurante|panaderia|panadería|distribuidora|comercializadora|inversiones|servicios|soluciones|grupo|tienda|mercado|farmacia|drogueria|droguería|taller|motos|autos|viajes|seguros|inmobiliaria|constructora|transportes|logistica|logística|academia|instituto|gimnasio|gym|agencia|consultorio|clinica|clínica|veterinaria|ferreteria|ferretería|papeleria|papelería|variedades|creaciones|publicidad|marketing|oficial)\b/i;

/**
 * El sexo del nombre, para que la concordancia sea correcta al saludar a quien
 * vuelve (Director, 31 ago 2026). Sale de `NOMBRES_DE_PILA`, que ya está
 * separada en masculinos y femeninos: no se adivina por la terminación.
 *
 * ⚠️ Devuelve `null` cuando el nombre no está en la lista, y el copy tiene que
 * traer una forma NEUTRA para ese caso. Equivocar el trato es peor que omitirlo.
 */
export function sexoDelNombre(nombre?: string): 'm' | 'f' | null {
  if (!nombre) return null;
  const limpio = nombre.replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}\u{200D}]/gu, '').trim();
  const primera = sinTildes(limpio.split(/\s+/)[0].toLowerCase());
  if (NOMBRES_MASCULINOS.has(primera)) return 'm';
  if (NOMBRES_FEMENINOS.has(primera)) return 'f';
  return null;
}

function sinTildes(s: string): string {
  return sinDiacriticos(s);
}

/**
 * Nombre para saludar, o `null` si no hay certeza de que sea una persona.
 *
 * Por qué es tan conservador (probado en campo, 4 ago 2026): el nombre de perfil
 * de WhatsApp es la MARCA cuando la cuenta es Business — un saludo salió "Hola,
 * Crea." porque el perfil era "Crea Tu Activo". Y los nichos del proyecto son
 * justo quienes más usan WhatsApp Business: empresarios e informales.
 *
 * Manda la asimetría: acertar suma una calidez pequeña; fallar produce un
 * tropiezo que grita "esto es un robot", la señal que destruye la confianza en
 * los primeros segundos. Ante la duda, no se saluda por nombre — nunca al revés.
 *
 * Devuelve solo el PRIMER nombre. En trato directo "Hola, Juan" es lo que diría
 * una persona; "Hola, Juan Pérez" es lo que diría un banco. (Distinto del socio,
 * a quien se nombra en tercera persona y ahí sí piden dos palabras.)
 */
function nombreUtil(nombre?: string): string | null {
  if (!nombre) return null;

  // El emoji se LIMPIA, no descarta: «Milena❤️» es una persona que decoró su
  // perfil, y descartarla la dejaba sin nombre y sin trato (31 ago 2026).
  const limpio = nombre.replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}\u{200D}]/gu, '').trim();
  if (!limpio || limpio.toLowerCase() === 'constructor') return null;

  // Dígitos, arrobas o urls → nombre comercial o alias, no una persona.
  if (/[\d@/_|+·•]/.test(limpio)) return null;
  if (RE_MARCA.test(limpio)) return null;

  const partes = limpio.split(/\s+/).filter(Boolean);
  // Más de cuatro palabras deja de parecer un nombre y empieza a parecer un letrero.
  if (partes.length > 4) return null;

  const primera = sinTildes(partes[0].toLowerCase());
  if (!NOMBRES_DE_PILA.has(primera)) return null;

  // Se devuelve con la grafía original (tildes incluidas), capitalizada.
  const original = partes[0];
  return original.charAt(0).toUpperCase() + original.slice(1).toLowerCase();
}

/**
 * Nombre del socio en su forma social, no legal.
 *
 * En la base los socios están con nombre completo de cédula — "Nidia Marleny
 * Cabrejo Moncada", "Adriana Patricia Flores Salcedo". Presentarlo entero
 * ("la inteligencia artificial que asiste a Nidia Marleny Cabrejo Moncada")
 * suena a escritura pública y trabaja contra la calidez que sostiene toda la
 * apertura.
 *
 * Se toman las dos primeras palabras. Es la regla robusta para Colombia: cae
 * bien tanto en nombre + apellido ("Luis Cabrejo") como en nombre compuesto
 * ("Carlos Alberto", "Nidia Marleny"), que es como esas personas se presentan.
 * Intentar adivinar dónde empieza el apellido exige un diccionario de nombres y
 * se equivoca justo en los casos ambiguos.
 */
function nombreSocioCorto(nombre?: string): string | undefined {
  if (!nombre) return undefined;
  const partes = nombre.trim().split(/\s+/).filter(Boolean);
  if (partes.length === 0) return undefined;
  return partes.slice(0, 2).join(' ');
}

/**
 * Cuerpo del mensaje de apertura.
 *
 * @param nombreSocio      Nombre del arquitecto que refirió; sin él se cae a la
 *                         marca, porque prometer un referidor que no existe es
 *                         peor que no nombrarlo.
 * @param nombreProspecto  Nombre de perfil de WhatsApp. Se usa SOLO si supera el
 *                         filtro de `nombreUtil()`; ante la duda se omite.
 */
/**
 * Recibimiento de quien VUELVE. Es corto a propósito: ya recibió la explicación
 * larga, y repetírsela le dice que no lo reconocimos.
 *
 * Nació el 31 ago 2026: la apertura solo dispara para prospectos nuevos, así que
 * quien volvía y escribía «hola» caía al motor, y el modelo improvisaba un
 * saludo — inventó «Luis ya me comentó que podía escribirme», que es falso y que
 * habíamos retirado justamente por eso, y adivinó el género con un «Bienvenida».
 *
 * Lleva el nombre cuando lo hay, y la concordancia SOLO cuando el nombre la
 * determina (`sexoDelNombre`). Si no, la forma neutra: equivocar el trato es
 * peor que omitirlo.
 */
/**
 * ¿El mensaje es SOLO un saludo? «Hola», «buenas tardes», «hola queswa», «hola
 * de nuevo». No hay nada que responder: lo que toca es abrir, o recibir si ya
 * nos había escrito. Un saludo seguido de cualquier otra cosa NO cuenta — lo
 * que sigue manda.
 *
 * Es el discriminador del recibimiento de quien vuelve, y tiene que ser
 * POSITIVO: el 31 ago 2026 ese nodo se abría con «no es socio, no trae
 * volición, no trae pregunta», y así cualquier respuesta corta de una
 * conversación viva —un «sí» a «¿Quiere ver cómo se gana?», una cédula, una
 * ciudad en mitad de la radicación— recibía «Qué bueno que vuelva» y los tres
 * botones.
 */
export function esSoloSaludo(texto: string): boolean {
  return /^(hola|buenas|buenos d[ií]as|buenas tardes|buenas noches|hey|qu[eé] tal|saludos|buen d[ií]a)(\s*[,.!¡]*\s*(queswa|de nuevo|otra vez|buenas|buen d[ií]a|buenos d[ií]as|buenas tardes|buenas noches|qu[eé] tal))*[\s.,!¡]*$/i
    .test(texto.trim());
}

export function aperturaRetorno(nombreProspecto?: string): string {
  const nombre = nombreUtil(nombreProspecto);
  const sexo = sexoDelNombre(nombre ?? undefined);
  const saludo = sexo === 'f' ? `Qué bueno tenerla de vuelta, ${nombre}.`
    : sexo === 'm' ? `Qué bueno tenerlo de vuelta, ${nombre}.`
    : nombre ? `Qué bueno que vuelva, ${nombre}.`
    : 'Qué bueno que vuelva.';
  return [saludo, '', 'Seguimos donde quiera. ¿Por dónde retomamos?'].join('\n');
}

// ─── La apertura de PRODUCTOS (9 sep 2026) ───────────────────────────────────
//
// Quien toca el orbe en /productos llega con «Hola Queswa, vengo del enlace de
// {ref}. Quiero preguntar por los productos.» (orbe-config.ts), y hasta el 9 sep
// recibía la apertura del sistema de distribución con sus tres botones —Liliana
// y Patricia, las dos por el ref de ganocafe-online—. Patricia además traía una
// pregunta completa detrás de la frase, y fue ignorada. Decisión del Director:
// la página de productos abre como asesora; quien ya venía conversando del
// negocio conserva su hilo y pasa a los productos. Copy aprobado el 9 sep.

export const RE_VIENE_DE_PRODUCTOS = /quiero preguntar por los productos/i;

export function vieneDeProductos(texto: string): boolean {
  return RE_VIENE_DE_PRODUCTOS.test(texto || '');
}

/** Lo que la persona escribió DESPUÉS de la frase del orbe, si algo. Patricia: la limpieza del organismo. */
export function preguntaTrasOrbeProductos(texto: string): string {
  const m = RE_VIENE_DE_PRODUCTOS.exec(texto || '');
  if (!m) return '';
  return (texto || '').slice(m.index + m[0].length).replace(/^[\s.,;:!¡]+/, '').trim();
}

export const APERTURA_PRODUCTOS_OPCIONES: WAButton[] = [
  { id: 'productos_portafolio', title: 'Ver el portafolio' },
  { id: 'productos_precios',    title: 'Lista de precios' },
];

export function construirAperturaProductos(nombreSocio?: string, nombreProspecto?: string): string {
  const nombre = nombreUtil(nombreProspecto);
  const saludo = nombre ? `Hola, ${nombre}.` : 'Hola.';
  const socio = nombreSocioCorto(nombreSocio);
  const identidad = socio
    ? `Soy Queswa, la inteligencia artificial que asiste a ${socio}. Atiendo a cientos de personas, las 24 horas.`
    : 'Soy Queswa, la inteligencia artificial de CreaTuActivo. Atiendo a cientos de personas, las 24 horas.';
  return [
    `${saludo} Un gusto saludarle.`,
    '',
    identidad,
    '',
    'Aquí puede preguntar lo que quiera de los productos: qué lleva cada uno, cómo se prepara, en qué presentación viene y cuánto cuesta. La línea es de Gano Excel, con extracto propio de Ganoderma y registro sanitario en cada producto.',
    '',
    '¿Le muestro el portafolio completo?',
  ].join('\n');
}

/** Quien ya venía conversando y toca el enlace del catálogo: el hilo sigue, el tema cambia. */
export function aperturaRetornoProductos(nombreProspecto?: string): string {
  const nombre = nombreUtil(nombreProspecto);
  return `Qué bueno que vuelva${nombre ? `, ${nombre}` : ''}. Aquí sigo con su conversación, y ahora vamos con los productos. ¿Le muestro el portafolio completo?`;
}

export function construirApertura(nombreSocio?: string, nombreProspecto?: string): string {
  const nombre = nombreUtil(nombreProspecto);
  const saludo = nombre ? `Hola, ${nombre}.` : 'Hola.';

  // Se retiró "Me pidió que lo recibiera": además de sonar a relleno, ese "lo"
  // se refiere al PROSPECTO —no al socio— así que trataba en masculino a las
  // mujeres; y sobre todo no era cierto: nadie pidió recibir a esa persona en
  // particular. La transferencia de confianza ya la produce nombrar al socio.
  const socio = nombreSocioCorto(nombreSocio);
  // La prueba social sube AQUÍ (6 sep 2026). Antes vivía en un párrafo largo
  // más abajo que también explicaba qué hace Queswa — y esa explicación se
  // mudó a WHY_02, donde queda mejor dicha. Repetirla en la apertura gastaba
  // el momento de mayor atención en algo que se iba a volver a decir. Lo que
  // sí valía la pena rescatar es el hecho social —cientos de personas, las 24
  // horas—: con un estigma de POPULARIDAD (no de fraude), la prueba de que
  // otros ya están aquí trabaja más que cualquier credencial.
  const identidad = socio
    ? `Soy Queswa, la inteligencia artificial que asiste a ${socio}. Atiendo a cientos de personas, las 24 horas.`
    : 'Soy Queswa, la inteligencia artificial de CreaTuActivo. Atiendo a cientos de personas, las 24 horas.';

  return [
    `${saludo} Un gusto saludarle.`,
    '',
    identidad,
    '',
    // LA CREENCIA VA ANTES DE LO QUE HACEMOS (Director, 10 sep 2026). El saludo
    // explicaba qué construimos sin decir nunca por qué — hablaba desde afuera.
    // Se calca la MECÁNICA de la frase de Nu (David Vélez), no sus palabras: se
    // nombra un adversario, se absuelve a las personas, y se termina devolviendo
    // lo que falta. Es la misma frase de la Home v16 y de WHY_01.
    // • La ANÁFORA es deliberada: dos frases que abren igual son recurso de
    //   manifiesto y ganan fuerza. Lo que sí era defecto —y se corrigió— era
    //   unirlas con una coma en una sola frase: ahí se leían como lista.
    // • «Creemos que nadie debería» y no «Nadie debería» a secas: lo segundo es
    //   un juicio moral; lo primero es una casa diciendo en qué cree.
    // • La marca va DENTRO de la primera frase y no en un renglón aparte: un
    //   lead-in que termina en «creemos» choca con el «Creemos» que sigue, y de
    //   paso el mensaje no crece. En la variante con socio, «CreaTuActivo» no
    //   aparecía en ningún otro lado.
    // ⛔ SIN «y recibir tan poco a cambio» (10 sep 2026). Es una afirmación de
    //    CANTIDAD, y el remate de STORY_03 existe justo para cerrar esa salida:
    //    quien gana bien se exime («ese no es mi caso») y se acabó la
    //    conversación. El ciclo no se discute; la cantidad sí.
    // ⛔ SIN «absoluto» (que sí dice Nu): en un banco es su propia cuenta; aquí
    //    sería una promesa.
    `En CreaTuActivo creemos que nadie debería entregar su vida entera al ciclo de trabajar, pagar cuentas y repetir. Creemos en empoderar a las personas para que recuperen el control de su tiempo y de su dinero.`,
    '',
    // LA SENCILLEZ SE MODELA EN EL TEXTO (Director, 13 sep 2026). Lo que seguía
    // al credo era una frase de treinta palabras con tres calificativos
    // («premium de bienestar» · «en paralelo a su actividad» · «no depende de
    // que usted esté encima») y dos viñetas. Un texto que promete sencillez con
    // una frase de cinco cláusulas se desmiente solo: «si queremos que la gente
    // vea que es sencillo, los primeros que tienen que hacer las cosas sencillas
    // somos nosotros, y eso incluye cómo lo decimos». El ejercicio fue escribirla
    // como la escribiría David Vélez: frases de una idea, el lector como sujeto,
    // sustantivos que se ven (enlace, celular), cero adjetivos. Es la misma
    // forma del perfil del WABA (WABA_REFERENCIA.md) y de WHY_01 🔒 (v6.36).
    // • «Hicimos sencillo lo que antes era complicado» es la columna del 26 ago
    //   en una frase y sin inventario de la faena.
    // • «Su propio sistema de distribución» nombra el NEGOCIO, no el ingreso
    //   (Director, 7 ago 2026: construir un ingreso es un resultado sin causa,
    //   la forma exacta de una estafa). «Propio» carga la propiedad que decía
    //   la viñeta «Usted es el dueño».
    // • Las tres viñetas son el Método tal cual —compartir · quién hace el
    //   trabajo · recibir—, cuatro palabras cada una: la pila se lee de un golpe.
    //   «Yo converso» y no «Queswa conversa»: aquí habla ella en primera persona.
    //   ⚠️ Con esto las dos acciones se dicen ANTES de EAM_01. El hueco que la
    //   doctrina pide dejar sin responder no desaparece: se muda a «de dónde
    //   sale la plata», que es el botón del medio.
    // • «Todo desde el celular» es la prueba de sencillez como HECHO, no como
    //   adjetivo. Va pegado a «Pregunte lo que quiera» para no abrir otro párrafo.
    // ⛔ LA CATEGORÍA («productos premium de bienestar») SALE DE LA APERTURA.
    //    El Director la puso el 25 ago para que «le paga cada vez que hay
    //    consumo» no dejara abierto CONSUMO DE QUÉ; esa viñeta la retiró él el
    //    10 sep, así que el trabajo que hacía la categoría ya no existe. Quien
    //    toca «Cómo funciona» la recibe en la primera línea de WHY_02.
    // ⛔ SIN «le paga cada vez que hay consumo» (Director, 10 sep 2026): sin
    //    decir DE QUIÉN es el consumo, el lector lo rellena con la escalera de
    //    gente. Medido: el 5 sep, 2 de 4 personas que tocaron «Cómo funciona»
    //    se fueron en la respuesta que ponía el origen del dinero en la segunda
    //    línea. El mecanismo se explica cuando la persona pregunta cómo se gana.
    // ⛔ SIN LA ASPIRACIÓN COMPARATIVA («con el potencial de igualar o superar
    //    sus ingresos actuales»). La historia importa: el 17 ago un handoff la
    //    marcó como promesa y el Director la RATIFICÓ (aspiración sin cifra ni
    //    plazo); tres agentes la «corrigieron» por reglas viejas y se restauró
    //    las tres veces; la quitó ÉL el 1 sep, la devolvió él el 6 sep y la
    //    quitó él otra vez el 10 sep. ⚠️ QUIEN LA ECHE DE MENOS, QUE NO LA
    //    REPONGA SIN PREGUNTARLE.
    // ⛔ SIN EMOJIS (Director, 1 sep 2026): leían como adorno. Negrita solo en
    //    el anclaje *sistema de distribución*, con asterisco simple de WhatsApp.
    // ⚠️ El arnés prueba-conversacion.mjs emula esta apertura: si cambia aquí,
    //    cambia allá.
    'Por eso hicimos sencillo lo que antes era complicado: tener su propio *sistema de distribución*.',
    '',
    '• Usted comparte un enlace.',
    '• Yo converso con quien llega.',
    '• Usted recibe.',
    '',
    // «Sin ningún afán» le quita presión al momento exacto en que se pide una
    // elección, y «pregunte lo que quiera» le avisa a quien no toca botones que
    // puede escribir (3 sep 2026, tomado de la propuesta de Gemini). La prueba
    // social ya subió a la identidad (6 sep 2026): no se repite aquí.
    'Todo desde el celular. Pregunte lo que quiera, sin ningún afán. ¿Por dónde prefiere empezar?',
  ].join('\n');
}
