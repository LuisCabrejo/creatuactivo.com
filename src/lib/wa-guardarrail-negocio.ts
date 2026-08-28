/**
 * Copyright © 2026 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * Guardarraíl de negocio del canal WhatsApp — v1 (17 ago 2026)
 *
 * La contraparte del guardarraíl de salud, para el otro riesgo que puede costar
 * la cuenta: la **promesa de ingreso**.
 *
 * Por qué existe. El copy de los arsenales ya está corregido, pero eso solo cubre
 * lo que el modelo ENTREGA; cuando ningún fragmento dispara, el modelo COMPONE —
 * y al componer vuelven las frases retiradas. No es hipotético: en la prueba del
 * Director del 14 ago 2026 el motor produjo una pirámide de 3.125 personas con un
 * total de 292.875 USD, y un "el GEN5 le da ingreso inmediato". Se cerraron las
 * puertas que las causaron; esta es la red que faltaba debajo.
 *
 * Qué está en juego. Meta sanciona las promesas de ingreso en el canal —el WABA
 * cuelga de la cuenta de anuncios verificada— y en Colombia el Estatuto del
 * Consumidor vuelve **vinculante para la empresa** todo lo que se le ofrece a un
 * consumidor. Una cifra compuesta no es un error de estilo: es exigible.
 *
 * ⚠️ EL FILO DE ESTE GUARDARRAÍL, Y CÓMO SE RESUELVE. Aquí no basta con listar
 * palabras, porque varias tienen un uso legítimo en el corpus:
 *
 *   · La DURABILIDAD es legítima en FREQ_05, donde el activo se hereda: "sus
 *     clientes siguen pidiendo y las comisiones siguen llegando a su familia" es
 *     un hecho del modelo. Lo prohibido es atarle duración al PAGO ("de por
 *     vida", "vitalicia"), que es perpetuidad y por tanto promesa.
 *   · Las CIFRAS del plan son legítimas —17%, montos del GEN5, PV/CV— cuando las
 *     dicta un pin. Lo prohibido es proyectarlas en el tiempo ("en seis meses
 *     estará ganando…") o garantizarlas.
 *   · "cada viernes" es un HECHO (Gano liquida así), no una promesa.
 *
 * Por eso los patrones exigen la CONJUNCIÓN —dinero + tiempo, dinero + garantía,
 * comisión + personas— en vez de vetar palabras sueltas. La batería
 * `node scripts/test-guardarrail-negocio.mjs` verifica las dos direcciones: que
 * bloquee lo grave y que NO toque el copy legítimo del corpus.
 *
 * ⚠️ Los patrones corren sobre texto normalizado (minúsculas, sin tildes).
 */

/** lower + sin diacríticos. Los patrones de este módulo asumen esta forma. */
export function normalizarNegocio(texto: string): string {
  return (texto || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

export const RE_PROMESA_INGRESO: RegExp[] = [
  // ── Perpetuidad ────────────────────────────────────────────────────────────
  // Sin fecha es PEOR que con fecha: no hay plazo que la acote. La durabilidad
  // solo es legítima cuando habla del activo que se hereda, nunca del pago.
  // ⚠️ El disparador NO puede ser solo el sustantivo `pago`: la promesa se dice
  // casi siempre con el VERBO conjugado —"le pagará de por vida", "le siguen
  // pagando para siempre", "cobra de por vida"— y ninguna de esas contiene la
  // palabra "pago". El hueco se encontró el 21 ago 2026 midiendo el guardarraíl
  // contra la frase que CLAUDE.md marca como la más reincidente: apareció cinco
  // veces en un solo día y el filtro la dejaba pasar entera. Es la misma clase de
  // fallo que `reemplace` (141f262): el español conjuga y el patrón no.
  /(ingreso|renta|comision(es)?|pag(o|a|ue)\w*|cobr\w*|dinero|gana(ncia)?s?)[^.]{0,30}(de por vida|vitalici|para siempre|perpetu|eterno)/,
  /(de por vida|vitalici|para siempre|perpetu|eterno)[^.]{0,30}(ingreso|renta|comision|pag(o|a|ue)\w*|cobr\w*|gana)/,

  // ── Velocidad del ingreso ──────────────────────────────────────────────────
  // El adjetivo de rapidez además es falso: la compra de un paquete es
  // esporádica. Cada vía se nombra por lo que la mueve, no por su ritmo.
  /(ingreso|dinero|gana(ncia)?s?|retorno|pago)[^.]{0,25}(inmediat|rapid|al instante|en tiempo record|desde el primer dia)/,
  /(gana|genera|recibe|factura)[^.]{0,20}(dinero|plata|ingresos?)[^.]{0,20}(rapid|ya mismo|de una vez|sin esperar)/,

  // ── Proyección con línea de tiempo ─────────────────────────────────────────
  // Dinero + plazo = promesa exigible, aunque venga con "puede".
  /(en|a los|dentro de|despues de)\s+\d+\s*(dias?|semanas?|meses?|anos?)[^.]{0,45}(estara ganando|va a ganar|gana(ra)?|recibira|tendra un ingreso|recupera|se recupera|retorna)/,
  /(recupera|retorna|amortiza)[^.]{0,30}(inversion|paquete|lo invertido)[^.]{0,25}(en|a los|dentro de)\s+\d+\s*(dias?|semanas?|meses?)/,
  /(estara ganando|va a estar ganando|tendra un ingreso de)[^.]{0,30}\d/,

  // ── Garantías ──────────────────────────────────────────────────────────────
  /(garantiz|asegurad|seguro que)[^.]{0,35}(ingreso|gana(ncia)?s?|retorno|dinero|resultado|invers|recupera)/,
  /(ingreso|gana(ncia)?s?|retorno|dinero|resultado)[^.]{0,25}garantizad/,

  // ── Pago fechado encadenado a acciones simples ─────────────────────────────
  // "Haga estas dos cosas y COBRE cada viernes" — la forma exacta que Meta
  // sanciona (prueba del 20 ago: el modelo compuso un día a día de tres pasos
  // cuyo remate era "Cobrar cada viernes lo que su canal movió"). El copy
  // aprobado dice "se liquida cada viernes" —el hecho, en voz del sistema— y
  // "cobra cada vez que su canal mueve producto" —la repetición, sin fecha—.
  // Lo que se veta es el VERBO en manos de la persona pegado al día de pago.
  /cobr(ar?|e)[^.]{0,40}cada viernes/,

  // ── Margen de reventa con cifra ────────────────────────────────────────────
  // No tenemos precio público oficial —lo confirma el socio en su región—, así
  // que cualquier porcentaje de margen es inventado. En la prueba del 21 ago
  // salió "en promedio entre el 20 % y el 30 % por pedido", una cifra de
  // ganancia que nadie puede sostener. Las tasas del PLAN (binario 15/16/17%)
  // no caen aquí: el patrón exige que el porcentaje cuelgue de margen, reventa
  // o precio público.
  /(margen|reventa|revende)[^.]{0,40}\d{1,2}\s*%/,
  /\d{1,2}\s*%[^.]{0,25}(de margen|de ganancia)/,
  // El rango presentado como lo que se gana: "entre el 20 % y el 30 % por pedido".
  /\d{1,2}\s*%\s*y\s*(el\s*)?\d{1,2}\s*%[^.]{0,30}(por pedido|por venta|de ganancia|es suya|le queda)/,

  // ── Reemplazo del empleo ───────────────────────────────────────────────────
  // Se construye EN PARALELO a su ocupación; prometer que la sustituye es una
  // promesa de ingreso con la vida de la persona de por medio.
  // reemplac y renunci, no solo reemplaz y renunciar: en español la z alterna
  // con c al conjugar —reemplazar → reempla*c*e—, así que "reemplace su salario"
  // se colaba entera. Igual "renuncie a su trabajo" contra /renunciar?/.
  // Hueco encontrado el 20 ago 2026 al portar el guardarraíl a las piezas
  // gráficas del Dashboard; llevaba viva desde que existe el patrón.
  /(reemplaz|reemplac|sustitu)[^.]{0,30}(salario|sueldo|trabajo|empleo|ingresos actuales)/,
  /(renunci\w*|dejar) (a )?(su|tu|el) (trabajo|empleo)|deja(r)? de trabajar/,
  /(su|tu) salario[^.]{0,25}(reemplaz|sustitu|superad)/,

  // ── Ingreso pasivo dicho o descrito ────────────────────────────────────────
  /ingresos? pasivos?|dinero mientras (duerme|descansa)|gana(r)? sin hacer nada|solo (se|lo) hace solo/,
  // «No tiene que hacer nada» es promesa cuando habla del NEGOCIO. Dicho de un
  // despacho —«Gano Excel cobra, empaca y despacha a su puerta. Usted no tiene
  // que hacer nada más»— es logística, y bloquearlo le costó a Milena la
  // respuesta que le explicaba cómo comprar (27 ago 2026). Si en los 90
  // caracteres anteriores hay un verbo de operación del fabricante, no dispara.
  /(?<!(?:despach|envi|entreg|cobr|empac|factur|recib)\w*[\s\S]{0,90})no tiene que hacer nada/,
  /(crece|funciona|trabaja)[^.]{0,15}(solo|por si (solo|mismo)|en automatico|sin que usted)/,

  // ── La comisión contada en PERSONAS ────────────────────────────────────────
  // Es la silueta que el prospecto reconoce como pirámide. El GEN5 se cuenta en
  // COMPRAS: "por cada paquete empresarial que se compra en su canal".
  // «cada vez que ALGUIEN en su canal arranca con un paquete, usted recibe un
  // bono» (22 ago 2026) pasaba porque el sujeto no estaba en la lista; y «si en
  // su primer mes arrancan TRES PERSONAS con usted…» tampoco, porque va contado.
  /(por cada|cada vez que)\s*(un[ao]?\s*)?(persona|socio|distribuidor|afiliado|miembro|alguien|quien|gente)[^.]{0,35}(entra|entre|ingresa|ingrese|se (vincula|vincule|inscribe|inscriba|registra|registre|afilia|afilie)|arranca|arranque|se une|se una|llega|llegue)[^.]{0,45}(bono|comisi[oó]n|recibe|reciba|gana|gane|le (entra|entre|queda|quede|pagan|paguen)|\$|usd|cop)/,
  /(dos|tres|cuatro|cinco|seis|diez|\d+)\s+(personas|socios|amigos|conocidos)\s+(con usted|en su canal)?[^.]{0,10}(arrancan|arranquen|entran|entren|se (vinculan|vinculen|inscriben|inscriban|registran|unen))[^.]{0,60}(bono|comisi[oó]n|recibe|gana|\$|usd|cop)/,
  /(arrancan|entran|se (vinculan|inscriben|unen))\s+(dos|tres|cuatro|cinco|seis|diez|\d+)\s+(personas|socios|amigos|conocidos)[^.]{0,60}(bono|comisi[oó]n|recibe|gana|\$|usd|cop)/,
  /(recibe|gana|le (entran?|queda))[^.]{0,25}(\$|usd|cop)?[^.]{0,15}por cada (persona|socio|afiliado|miembro)/,

  // ── Progresión geométrica de personas (la pirámide dibujada) ───────────────
  // Se retiró del corpus a propósito; si reaparece es composición del modelo.
  /\b5\b[^.]{0,40}\b25\b[^.]{0,40}\b125\b/,
  /\b125\b[^.]{0,40}\b625\b/,
  /\b625\b[^.]{0,40}\b3[.,]?125\b/,
  /\b1\b[^.]{0,20}\b2\b[^.]{0,20}\b4\b[^.]{0,20}\b8\b[^.]{0,20}\b16\b/,
  /(3[.,]?125|15[.,]?625)\s*(personas|socios|distribuidores|afiliados)/,

  // ── Totales acumulados de una estructura completa ──────────────────────────
  // "Total acumulado GEN5: $292.875 USD" — el número que nadie va a alcanzar,
  // presentado como si fuera el resultado esperado.
  /total (acumulado|proyectado|potencial)[^.]{0,25}(\$|usd|cop|\d)/,
  /(acumula|sumaria|llegaria a)[^.]{0,20}(\$\s?\d|\d[\d.,]{4,}\s*(usd|cop|dolares))/,

  // ── El plazo dicho con un adverbio de tiempo ───────────────────────────────
  // Prueba del Director, 22 ago: «eso le genera $675.000 de una sola vez, ESA
  // MISMA SEMANA». Pasaba entera porque los patrones de velocidad buscaban
  // adjetivos —inmediato, rápido, desde el primer día— y esto es un adverbio.
  //
  // ⚠️ El dato real: cada ciclo se paga el SEGUNDO viernes después de su cierre.
  // Prometer «esa misma semana» decepciona en la primera semana, que es el peor
  // momento posible. «Cada viernes» a secas es un HECHO y se conserva: lo que se
  // veta es atarle a un pago concreto una ventana de tiempo más corta que la real.
  // ⚠️ «esa semana» a secas queda FUERA: COMP_BIN_06 dice «si no cumple estos
  // requisitos, no cobra Binario esa semana» — una condición de requisito, no una
  // promesa. Barrido sobre los 169 documentos del corpus, 22 ago 2026.
  /(genera|generan|recibe|reciba|gana|gane|cobra|cobre|pagan|paguen|abonan|consignan|le (queda|quede|entra|entre|llega|llegue|cae|caiga|caen|caigan|ingresa|ingrese)|se (lo|la|le)s? ?(paga|pagan|abona|abonan|consigna|consignan))[^.]{0,45}(esa misma semana|la misma semana|ese mismo viernes|el mismo viernes|el viernes siguiente|a los pocos dias|en cuestion de dias)/,
  /(esa misma semana|la misma semana|ese mismo viernes|el mismo viernes|el viernes siguiente)[^.]{0,45}(le (queda|entra|llega|pagan|cae|caiga)|recibe|gana|cobra|se le (paga|abona|consigna))/,

  // ── La comisión contada en personas, con sujeto POSESIVO ───────────────────
  // Prueba del Director, 22 ago: «SU PRIMER SOCIO también entra con Visionario —
  // eso le genera $675.000». El barrido del 22 ago cubrió «cada vez que ALGUIEN»
  // y «si arrancan TRES PERSONAS», pero un posesivo no es ni cuantificador ni
  // indefinido, así que volvía a pasar. Es la misma silueta de escalera de gente.
  /(su|mi|el|la)\s+(primer[ao]?\s+|segund[ao]\s+|siguiente\s+|proxim[ao]\s+)?(socio|distribuidor|afiliado|invitad[ao]|referid[ao])[^.]{0,25}(entra|entre|arranca|arranque|inicia|inicie|se (vincula|vincule|inscribe|inscriba|registra|registre|une|una))[^.]{0,50}(le (genera|queda|entra|pagan|paguen)|genera|recibe|gana|bono|comisi[oó]n)[^.]{0,20}(\$|usd|cop|\d)/,

  // ── La persona GENÉRICA como complemento agente de la compra ───────────────
  // Prueba del Director, 24 ago 2026: «un paquete Visionario comprado POR ALGUIEN
  // QUE USTED VINCULÓ directamente le genera $675.000». Los dos patrones de
  // arriba buscan a la persona como SUJETO —«su primer socio entra…», «cada vez
  // que alguien se vincula…»—; aquí va como complemento agente, y ninguno la ve.
  //
  // ⚠️ El disparador es la persona GENÉRICA, no la persona a secas (decisión del
  // Director, 24 ago 2026): «alguien / una persona / la gente / quien» bloquean;
  // «distribuidor / cliente / socio» pasan. Es la regla de vocabulario puesta en
  // el filtro — el rol comercial es lenguaje de empresa, la persona genérica es
  // la escalera de gente. La redacción aprobada saca a la persona de la frase:
  // «un paquete empresarial comprado en su canal de distribución en la primera
  // generación le genera $675.000».
  //
  // La lista de verbos de entrega se mantiene alineada con RE_COMISION_LLEGA:
  // «le deja» faltaba y se escapaba «le deja $337.500» (medido al escribir esto).
  /(alguien|una persona|la gente|quien(es)?)\s+que\s+(usted|tu)\s+(vincul|conect|inscrib|invit|registr|trajo|trae|meti)\w*[^.]{0,60}(le\s+(genera|generan|queda|quedan|entra|entran|llega|llegan|cae|caen|pagan|paga|deja|dejan)|genera|recibe|gana|bono|comisi[oó]n)[^.]{0,25}(\$|usd|cop|\d)/,
  /(comprad|adquirid|tomad)[oa]\s+por\s+(alguien|una persona|la gente|quien)[^.]{0,60}(le\s+(genera|generan|queda|quedan|entra|entran|llega|llegan|cae|caen|pagan|paga|deja|dejan)|genera|recibe|gana|bono|comisi[oó]n)[^.]{0,25}(\$|usd|cop|\d)/,
];

function primerMatch(patrones: RegExp[], t: string): string | null {
  for (const re of patrones) {
    const m = re.exec(t);
    if (m) return m[0].slice(0, 60);
  }
  return null;
}

/**
 * Revisa el borrador antes de enviarlo. Devuelve el fragmento que disparó, o null.
 *
 * El borrador que falla se DESCARTA y se reemplaza por la respuesta correctiva —
 * nunca se corrige ni se reintenta la generación: reintentar entrena al sistema a
 * bordear el límite, y el reintento cuesta latencia que el prospecto siente.
 */
/**
 * Precio de entrada y comisión conviviendo en el MISMO mensaje.
 *
 * No puede ser un patrón del array, y esa es la razón por la que se escapó: en la
 * prueba del Director del 22 ago las dos cifras estaban en párrafos distintos —
 * «cada paquete ESP-1 que se compre en su canal le genera desde $22.500 hasta
 * $112.500» y, dos líneas después, «el costo de entrada es $900.000 COP». Los
 * patrones usan `[^.]` para no cruzar oraciones, así que ninguno podía verlas
 * juntas. Esto mira el mensaje entero.
 *
 * Por qué importa: pegarle un rendimiento al lado de una inversión convierte una
 * lista de precios en una proyección de retorno, que es promesa de ingreso aunque
 * las dos cifras sean ciertas por separado.
 *
 * ⚠️ NO basta con que aparezca una cifra de dinero junto a un precio: la comisión
 * tiene que estar dicha como algo que LE LLEGA A ÉL. Por eso se exige el verbo de
 * entrega. Así, «hay tres formas de arrancar: ESP-1 $900.000, ESP-2 $2.250.000»
 * —una lista de precios legítima— no dispara.
 */
const RE_PRECIO_ENTRADA  = /(cuesta|vale|costo de entrada|precio de entrada|inversion (inicial|de entrada)|entrada es)[^\n]{0,40}(\$|\d[\d.,]{5,})|(\$\s?)?(900[.,]000|2[.,]250[.,]000|4[.,]500[.,]000)/;
const RE_COMISION_LLEGA  = /(le (genera|generan|queda|quedan|entra|entran|llega|llegan|pagan|deja|dejan)|usted (recibe|gana|cobra)|recibe|gana)[^\n]{0,40}(\$\s?\d|\d[\d.,]{4,}\s*(cop|usd))/;

export function mezclaPrecioYComision(textoNormalizado: string): string | null {
  const precio   = RE_PRECIO_ENTRADA.exec(textoNormalizado);
  const comision = RE_COMISION_LLEGA.exec(textoNormalizado);
  if (!precio || !comision) return null;
  return `precio «${precio[0].slice(0, 28)}» + comisión «${comision[0].slice(0, 28)}»`;
}

/**
 * Revisa el borrador antes de enviarlo. Devuelve el fragmento que disparó, o null.
 *
 * El borrador que falla se DESCARTA y se reemplaza por la respuesta correctiva —
 * nunca se corrige ni se reintenta la generación: reintentar entrena al sistema a
 * bordear el límite, y el reintento cuesta latencia que el prospecto siente.
 */
export function detectarPromesaDeIngreso(texto: string): string | null {
  if (!texto) return null;
  const t = normalizarNegocio(texto);
  return primerMatch(RE_PROMESA_INGRESO, t) ?? mezclaPrecioYComision(t);
}

// ─── El modelo de negocio inventado ──────────────────────────────────────────
//
// Cuando ningún fragmento ancla la respuesta, el modelo rellena «empresa
// digital» con lo que esa frase significa en internet: cursos, infoproductos,
// membresías, audiencia. Nada de eso existe aquí, y la Ley 1480 vuelve
// vinculante lo que la IA le ofrezca al consumidor (precedente Air Canada, 2024).
//
// Vivió en el webhook hasta el 27 ago 2026; se muda aquí para que la batería lo
// cubra. Ese día bloqueó una respuesta buena: «el paquete NO es un costo de
// membresía» — la negación no se distinguía de la afirmación, y Milena recibió
// un texto genérico en vez de los tres paquetes.

/** Términos que, afirmados, describen un negocio que no es el nuestro. */
export const TERMINOS_MODELO_INVENTADO: string[] = [
  'infoproducto', 'info-producto', 'e-book', 'ebook', 'membresía', 'membresia',
  'dropshipping', 'producto digital', 'productos digitales', 'curso online',
  'cursos online', 'consultoría online', 'consultoria online', 'monetizar su conocimiento',
  'monetizar tu conocimiento', 'vender su experiencia', 'crear contenido',
  'servicios escalados', 'asesorías online', 'asesorias online',
  'servicio digital', 'servicios digitales', 'audiencia',
];

/**
 * Lo que puede preceder al término dentro de la misma oración para que sea una
 * NEGACIÓN («no es un costo de membresía», «sin membresías», «nada de cursos»).
 * Se aplica al texto que va desde el inicio de la oración hasta el término.
 */
export const RE_NEGACION_PREVIA = /(no (es|son|hay|se trata de|existe|existen|tiene|tienen|cobra|cobran|paga|pagan|necesita|vende|vendemos)|sin|nada de|ni|tampoco|en vez de|en lugar de|no como)\s+(un[ao]?\s+|el\s+|la\s+|los\s+|las\s+|de\s+|costo de\s+|cuota de\s+|pago de\s+|ning[uú]n[ao]?\s+)*$/;

function inicioDeOracion(t: string, pos: number): number {
  let i = pos;
  while (i > 0 && !/[.!?\n:;]/.test(t[i - 1])) i--;
  return i;
}

/**
 * Devuelve el término detectado, o null. Un término NEGADO en su oración no
 * cuenta; seguirá bloqueándose si además aparece afirmado en otra parte.
 */
export function detectarModeloInventado(texto: string): string | null {
  if (!texto) return null;
  const t = texto.toLowerCase();

  for (const term of TERMINOS_MODELO_INVENTADO) {
    let desde = 0;
    while (true) {
      const pos = t.indexOf(term, desde);
      if (pos === -1) break;
      const previo = t.slice(inicioDeOracion(t, pos), pos);
      if (!RE_NEGACION_PREVIA.test(previo)) return term;
      desde = pos + term.length;
    }
  }

  // "curso(s)" solo cuenta si se PROPONE (vender/crear/ofrecer), no en usos legítimos
  // como "en el curso de la conversación" o la formación interna.
  if (/\b(vender|venda|crear|cree|ofrecer|ofrezca|dictar|dicte|grabar)\b[^.]{0,40}\bcursos?\b/.test(t)) {
    return 'proponer cursos';
  }
  if (/\bcursos?\b[^.]{0,40}\b(que otros compren|de pago|para vender)\b/.test(t)) {
    return 'cursos para vender';
  }
  return null;
}
