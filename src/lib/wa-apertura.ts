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
    // PROMETE UN CANAL, NO UN INGRESO (Director, 7 ago 2026). "Construir un
    // ingreso" describe un resultado sin causa —dinero que aparece—, que es la
    // forma exacta que tiene una estafa en la cabeza de cualquiera. Nombrar la
    // máquina hace que el ingreso deje de ser la promesa y pase a ser la
    // consecuencia: no hay que defenderlo, se explica solo. Cuesta temperatura
    // (quien buscaba plata rápida no toca ningún botón) y eso es deseable.
    //
    // CASCADA VERTICAL (Director + investigación, 8 ago 2026). Los tres golpes
    // iban corridos en el párrafo; ahora se apilan, uno por línea. El texto en
    // WhatsApp es interfaz, no literatura: el bloque denso produce ceguera por
    // formato, y la pila obliga a detener el scroll y leer la ecuación paso a
    // paso. Cada línea sigue respondiendo una pregunta sin nombrarla: cuánto
    // trabajo · de quién es · de dónde sale la plata. La recompensa va última.
    //
    // • "ingresos actuales", no "ingresos": el ancla concreta es el sueldo que
    //   la persona tiene HOY en su cuenta — sin "actuales" la comparación flota.
    //   (Y "su actividad" perdió el "actual" para no repetirlo a tres palabras.)
    //   ⚠️ REVISADA Y CONSERVADA (Director, 17 ago 2026). Un handoff externo la
    //   marcó como "promesa de ingreso comparativa" a retirar. Decisión: se
    //   queda. Es aspiración sin cifra ni plazo ("con el potencial de"), y
    //   quien monta un negocio aspira como mínimo a sus ingresos actuales —
    //   decirlo no promete, ubica; y la línea 🔄 le pone la causa. Es el frame
    //   de UPGRADE del 2 ago (ingreso en paralelo, medido contra lo que ya
    //   tiene). No volver a "corregirla" por una regla anterior a esa decisión.
    // • Los pictogramas son funcionales, no decorativos: ⚙️ mecanismo · 🔑
    //   propiedad · 🔄 ciclo. Se descartó 👑 (la corona es el emoji del estatus
    //   prometido — el estante del multinivel); la llave dice lo mismo sin humo:
    //   ser dueño es tener las llaves. Este mensaje dictado fija su propio
    //   estándar de emojis; la regla "máximo un emoji" del prompt aplica a lo
    //   que el MODELO redacta, no a esta apertura.
    // • Negritas solo en los dos anclajes (*canal de distribución* · *ingresos
    //   actuales*) — asterisco simple, que es la negrita nativa de WhatsApp.
    // CATEGORÍA EN LA APERTURA (Director, 25 ago 2026). El saludo no nombraba
    // ningún producto, así que «le paga cada vez que hay consumo» dejaba sin
    // responder CONSUMO DE QUÉ, y el que llega frío lo rellena con cualquier
    // cosa. Se nombra la CATEGORÍA, no el producto: «bienestar» ubica la
    // conversación en una industria antes de que el lector la ubique él en
    // otra, y evita que la primera impresión sea «esto es café» — que era el
    // temor real, y que la auditoría encontró concentrado en FREQ_16.
    // ⚠️ Va AQUÍ y no en la cascada: las tres líneas de abajo tienen cuatro y
    //    cinco palabras, y meterle la categoría a la del ciclo la lleva a nueve
    //    — la pila deja de leerse de un golpe, que es para lo que se diseñó.
    'Le explico cómo se construye un *canal de distribución de productos de bienestar*, en paralelo a su actividad, con el potencial de igualar o superar sus *ingresos actuales*:',
    '',
    '⚙️ Se arma una sola vez.',
    '🔑 Usted es el dueño.',
    '🔄 Le paga cada vez que hay consumo.',
    '',
    // La prueba social va aquí, en presente y verificable — 559 personas
    // distintas han conversado con Queswa, así que "cientos" se queda corto.
    //
    // Tres decisiones de redacción, todas medidas contra
    // docs/handoff/negocio/NARRATIVA_Y_FLUIDEZ.md:
    //
    // • Abre con "Mientras conversamos" — el ancla máxima del contrato
    //   dado-nuevo: está ocurriendo en esa pantalla, en ese segundo. La versión
    //   anterior abría con "Y de paso", que convertía la demostración en un
    //   truco mostrado al pasar en vez de la razón por la que el canal se puede
    //   armar una vez.
    // • "cómo le PODRÍA ayudar" (condicional desde el 8 ago; antes "puedo",
    //   nunca "le voy a ayudar"). El futuro de indicativo afirma un hecho que
    //   exige una relación que no existe; el condicional además le baja la
    //   presión a la proactividad de la IA — describe una capacidad mía sin
    //   comprometerlo a él. Y lo que sigue a los dos puntos baja a su propia
    //   línea: el salto de línea es el que resalta la prueba social.
    // • "su PROPIO canal" hace eco con "usted es el dueño" del bloque anterior —
    //   es la palabra que separa esto de "vincularse a algo".
    'Mientras conversamos, usted ya está viendo cómo le podría ayudar:',
    'Así es como asisto a cientos de personas a construir su propio canal, las 24 horas.',
    '',
    '¿Por dónde prefiere empezar?',
  ].join('\n');
}
