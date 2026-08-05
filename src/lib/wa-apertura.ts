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
 *   2. Va como mensaje interactivo de lista, que solo la capa de canal envía.
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

import type { WAListRow } from '@/lib/wa-channel';
import { getRespuestaMaestra } from '@/lib/respuestas-maestras';

/** Rótulo del botón que despliega la lista (máx. 20 caracteres). */
export const APERTURA_BOTON = 'Ver opciones';

export const APERTURA_SECCION = 'Por dónde empezar';

/**
 * Las tres preguntas reales del prospecto, en su voz.
 *
 * La tercera es la que más pesa: la objeción silenciosa casi nunca es "no
 * entiendo", es "yo no sería capaz". Los títulos están al límite de 24
 * caracteres de Meta — al editarlos, contarlos.
 */
export const APERTURA_OPCIONES: WAListRow[] = [
  {
    id: 'apertura_dinero',
    title: 'De dónde sale el dinero',
    description: 'De qué se distribuye y quién paga',
  },
  {
    id: 'apertura_sistema',
    // "negocio", NO "sistema": es la formulación literal de cerca del 70% de las
    // primeras preguntas reales, y el disparador canónico de WHY_02. Nadie
    // pregunta "cómo funciona el sistema".
    title: 'Cómo funciona el negocio',
    description: 'El modelo completo, en concreto',
  },
  {
    id: 'apertura_rol',
    // En PRIMERA persona a propósito: al tocar una opción, Meta la manda como
    // MENSAJE DEL USUARIO. "Qué debe hacer usted" se leería como si el prospecto
    // le preguntara a Queswa qué debe hacer Queswa — se invierte el sentido.
    title: 'Qué tendría que hacer yo',
    description: 'Su día a día real, sin adornos',
  },
];

/**
 * Respuestas dictadas para las opciones de la apertura.
 *
 * Por qué existen: en la primera prueba en vivo, el botón "De dónde sale el
 * dinero" cayó en tierra de nadie — WHY_02 responde "cómo funciona el negocio" y
 * FREQ_04 responde con tablas de comisiones, así que el modelo improvisó. Y al
 * improvisar escribió *"cuando alguien en su organización compra su producto del
 * mes"*: autoconsumo mensual obligatorio, la marca más delatora del multinivel.
 * Nadie lo redactó; salió solo. Además era falso — Gano Excel liquida los viernes.
 *
 * Un nodo determinístico no se le deja al modelo. Mismo patrón que la apertura.
 *
 * ⚠️ Formato WhatsApp: negrita con *un* asterisco, no dos.
 */
/**
 * Markdown de la web → formato de WhatsApp.
 *
 * Los textos canónicos viven en `respuestas-maestras.ts` escritos para la web,
 * donde la negrita son dos asteriscos. WhatsApp usa uno solo: mandarlos sin
 * convertir hace que se vean los asteriscos crudos en pantalla.
 */
function aFormatoWhatsApp(texto: string): string {
  return texto.replace(/\*\*(.+?)\*\*/g, '*$1*');
}

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
  const dictada = RESPUESTAS_BOTONES[opcionId];
  if (dictada) return dictada;

  // Opciones que ya tienen respuesta canónica con candado verbatim.
  const canonica: Record<string, string> = {
    apertura_sistema: '¿Y esto cómo funciona, exactamente?',
    apertura_rol:     '¿Cómo lo haría yo? ¿Qué hago en el día a día?',
  };

  const chip = canonica[opcionId];
  if (!chip) return null;

  const maestra = getRespuestaMaestra(chip);
  return maestra ? aFormatoWhatsApp(maestra) : null;
}

const RESPUESTAS_BOTONES: Record<string, string> = {
  apertura_dinero: [
    'Buena pregunta, y la más importante.',
    '',
    'El dinero sale de las ventas: café, bebidas y suplementos con ganoderma que fabrica y despacha *Gano Excel* —30 años, 70 países—. Usted arma un canal de distribución y lo dirige desde el celular: ni inventario, ni entregas.',
    '',
    'Se vende de dos formas, producto al detal y paquetes empresariales. De cada venta le queda un porcentaje, y se lo consignan *cada viernes*.',
    '',
    'Y *el café se acaba*: quien probó vuelve a pedir, y esa recompra ya no le cuesta trabajo.',
    '',
    'No es humo en la nube: es producto que llega a una dirección y plata que llega a un banco.',
    '',
    '¿Le muestro cómo se ve en números?',
  ].join('\n'),
};

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
const NOMBRES_DE_PILA = new Set([
  // Masculinos
  'juan','carlos','jose','luis','jorge','andres','diego','julian','camilo','santiago',
  'sebastian','david','daniel','miguel','fernando','ricardo','oscar','alvaro','javier',
  'alejandro','felipe','mauricio','german','hernan','ivan','jhon','john','wilson','edison',
  'nelson','fabian','cristian','christian','brayan','brahyam','yeison','jefferson','duvan',
  'edwin','anderson','alex','alexander','gustavo','hugo','ruben','raul','rafael','ramiro',
  'pedro','pablo','manuel','marco','mario','martin','nestor','orlando','omar','rodrigo',
  'sergio','victor','wilmar','yesid','arnulfo','efrain','elkin','freddy','gabriel','gerardo',
  'gilberto','gonzalo','guillermo','hector','henry','jaime','jairo','jesus','joaquin',
  'leonardo','libardo','marlon','nicolas','oswaldo','rigoberto','samuel','tomas','uriel',
  'esteban','emilio','ernesto','eduardo','enrique','antonio','alberto','armando','arturo',
  'benjamin','bernardo','cesar','ceferino','cristobal','damian','dario','edgar','eliecer',
  'emmanuel','ferney','francisco','geovanny','giovanny','harold','ignacio','isaac','israel',
  'jarrison','jhonatan','jonathan','julio','kevin','lorenzo','lucas','matias','mateo',
  'maximiliano','norberto','octavio','pastor','ramon','reinaldo','roberto','rodolfo','rolando',
  'salvador','saul','simon','teodoro','vicente','wilfredo','william','yohan',
  // Femeninos
  'maria','ana','luz','martha','marta','sandra','diana','claudia','paola','carolina',
  'catalina','natalia','andrea','adriana','alejandra','angela','beatriz','blanca','carmen',
  'cecilia','clara','consuelo','daniela','dora','elena','elizabeth','erika','esperanza',
  'fabiola','flor','gloria','gladys','graciela','hilda','ingrid','irma','isabel','jenny',
  'jessica','johana','johanna','juliana','karen','karina','laura','leidy','liliana','lina',
  'lorena','lucia','luisa','magda','marcela','margarita','mariana','maribel','marisol',
  'mercedes','michelle','milena','monica','myriam','miriam','nancy','nidia','nubia','olga',
  'patricia','paula','pilar','rocio','rosa','rubiela','ruth','sara','silvia','sofia','sonia',
  'stella','tatiana','teresa','valentina','vanessa','veronica','victoria','viviana','yolanda',
  'yuliana','zulma','belcy','maryi','sidney','amparo','aura','cielo','edilma','eugenia',
  'fanny','gina','ines','janeth','leonor','ligia','lucero','luzmila','melissa','nataly',
  'nelly','norma','oliva','omaira','rosalba','sirley','sol','yamile','yaneth','yenny',
]);

/** Palabras que delatan un nombre comercial aunque empiece con un nombre de pila. */
const RE_MARCA = /\b(sas|s\.a\.s|ltda|cia|sa|inc|corp|store|shop|boutique|barberia|barbería|salon|salón|spa|restaurante|panaderia|panadería|distribuidora|comercializadora|inversiones|servicios|soluciones|grupo|tienda|mercado|farmacia|drogueria|droguería|taller|motos|autos|viajes|seguros|inmobiliaria|constructora|transportes|logistica|logística|academia|instituto|gimnasio|gym|agencia|consultorio|clinica|clínica|veterinaria|ferreteria|ferretería|papeleria|papelería|variedades|creaciones|publicidad|marketing|oficial)\b/i;

function sinTildes(s: string): string {
  // Rango de diacríticos combinantes, escapado a propósito: escribirlo literal
  // deja caracteres invisibles en el fuente y cualquier editor puede comérselos.
  return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
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

  const limpio = nombre.trim();
  if (!limpio || limpio.toLowerCase() === 'constructor') return null;

  // Dígitos, arrobas, urls o emoji → nombre comercial o alias, no una persona.
  if (/[\d@/_|+·•]/.test(limpio)) return null;
  if (/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u.test(limpio)) return null;
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
export function construirApertura(nombreSocio?: string, nombreProspecto?: string): string {
  const nombre = nombreUtil(nombreProspecto);
  const saludo = nombre ? `Hola, ${nombre}.` : 'Hola.';

  // Se retiró "Me pidió que lo recibiera": además de sonar a relleno, ese "lo"
  // se refiere al PROSPECTO —no al socio— así que trataba en masculino a las
  // mujeres; y sobre todo no era cierto: nadie pidió recibir a esa persona en
  // particular. La transferencia de confianza ya la produce nombrar al socio.
  const socio = nombreSocioCorto(nombreSocio);
  const identidad = socio
    ? `Soy Queswa, la inteligencia artificial que asiste a ${socio}.`
    : 'Soy Queswa, la inteligencia artificial de CreaTuActivo.';

  return [
    `${saludo} Un gusto saludarle. 🤝`,
    '',
    identidad,
    '',
    'Le explico cómo se construye un segundo ingreso, en paralelo a lo que usted ya hace, con el potencial de igualarlo o superarlo.',
    '',
    // La prueba social va aquí, en presente y verificable — 559 personas
    // distintas han conversado con Queswa, así que "cientos" se queda corto.
    // NO decir "a cada persona que usted invite": en el mensaje uno el prospecto
    // todavía no aceptó nada, y sentarlo en la silla del dueño produce un
    // "despacio". La autoeficacia —verse capaz de hacerlo— pertenece al botón
    // "Qué tendría que hacer yo", donde es él quien la pide.
    'Y de paso ve cómo trabajo: así es como ya atiendo a cientos de personas, las 24 horas.',
    '',
    '¿Por dónde prefiere empezar?',
  ].join('\n');
}
