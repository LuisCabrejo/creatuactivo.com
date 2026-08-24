/**
 * Copyright © 2026 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * Detección de AMBIVALENCIA en el canal — la duda sobre uno mismo y el
 * aplazamiento cortés — y el nodo de ACUERDO que las atiende.
 *
 * ── POR QUÉ EXISTE ────────────────────────────────────────────────────────────
 *
 * El metaanálisis del modelo causal de la Entrevista Motivacional mide algo que
 * va contra todo instinto comercial: **el discurso de resistencia predice el mal
 * resultado (r = −.24); el discurso de cambio NO predice el bueno (r = .06)**.
 * El entusiasmo no informa; la duda sí. Y rebatir esa duda la AUMENTA — amenaza
 * la autonomía y dispara reactancia, y la persona se escucha a sí misma más de
 * lo que nos escucha a nosotros.
 *
 * Hoy el motor responde igual dos cosas que no se parecen:
 *
 *   · «¿yo tendría que vender?»      → PREGUNTA. El arsenal la responde. Correcto.
 *   · «yo no sirvo para vender»      → DUDA SOBRE SÍ MISMA. El arsenal la rebate,
 *                                      y al rebatirla la refuerza.
 *
 * Este módulo separa esos dos momentos. Ante el segundo, Queswa **deja de
 * explicar y pregunta** — que es lo que el Director hace en el 1-a-1 desde hace
 * doce años, y resultó ser la técnica canónica con otras palabras.
 *
 * ⚠️ **La pregunta de cierre NO es "¿qué lo frena?".** El detector dispara cuando
 * la persona YA nombró su duda, así que pedirle que la nombre es pedirle lo que
 * acaba de dar. La pregunta correcta es la que el Director le hizo a Claudia
 * cuando ella dijo que no era buena para esto: **"si usted arrancara, ¿por qué lo
 * haría?"**. No pide compromiso, pide un motivo — y el motivo lo dice ella, que
 * es el mecanismo entero: la persona se escucha a sí misma más de lo que nos
 * escucha a nosotros. Va precedida del apoyo explícito a la autonomía, que es lo
 * que evita que la pregunta se lea como empujón.
 *
 * ── POR QUÉ EL TEXTO NO ES VERBATIM ───────────────────────────────────────────
 *
 * Todos los demás nodos determinísticos del canal imprimen una frase fija. Este
 * NO puede: un «le entiendo» que no recoge lo que la persona acabó de decir es
 * exactamente la falla documentada de los modelos —reproducir la forma de la
 * empatía sin responder al significado— y se siente como un guion. Por eso va
 * como MICRO-PROMPT: el backend prohíbe explicar, ordena reflejar en las palabras
 * de ella, y dicta solo la línea de cierre.
 *
 * ── EL ACUERDO, Y POR QUÉ LLEVA EL OBSTÁCULO ──────────────────────────────────
 *
 * Oettingen midió que imaginar el resultado deseado SIN confrontar el obstáculo
 * produce MENOS acción, no más: entrega por adelantado una porción del premio.
 * Y la escasez financiera consume ancho de banda medible, con la atención cerrada
 * sobre lo urgente — de noche, que es cuando la persona decide, no compite un
 * proyecto que exige pensar.
 *
 * De ahí que el acuerdo nombre el obstáculo (la semana que se atraviesa) y fije
 * hora. Pero el obstáculo se ENTREGA, no se pregunta: preguntarlo justo después
 * de un «lo voy a pensar» se lee como no aceptar la pausa.
 *
 * ⚠️ Y por eso mismo la fecha la pone ELLA. Un plan autogenerado se cumple más
 * que uno impuesto, y además es la licencia legítima de reentrada del canal:
 * volver sobre un recordatorio que la persona pidió es lo único que Meta trata
 * distinto de una reactivación comercial.
 *
 * Fundamento completo → docs/investigaciones/resultados/CIENCIA_CONDUCTUAL_SEGUIMIENTO_Y_ACUERDO_AGO2026.md
 */

/** lower + sin diacríticos. Todos los patrones asumen esta forma. */
export function normalizarAmb(texto: string): string {
  return (texto || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
}

/**
 * DUDA SOBRE SÍ MISMA — la señal más predictiva y la más fácil de confundir con
 * una pregunta.
 *
 * ⚠️ Todos los patrones exigen que el sujeto sea LA PERSONA, no el modelo de
 * negocio. «no sirvo para vender» entra; «esto no sirve» no. La diferencia es la
 * que separa una duda de una objeción, y se atienden al revés.
 *
 * ⚠️ Sin `\b` de cierre tras vocal acentuada: en JS la tilde no es carácter de
 * palabra y `\b` no cierra después de una. Se usa `(?![a-z])` donde hace falta.
 */
export const RE_DUDA_PROPIA: RegExp[] = [
  // «no soy bueno para esto» · «no soy vendedor» · «no soy de esas personas»
  /\bno (soy|era|seria)\b[^.?!]{0,30}\b(bueno|buena|vendedor|vendedora|comercial|capaz|de esos|de esas)\b/,
  // «no sirvo para esto» · «no sirvo para vender»
  /\bno (sirvo|valgo)\b[^.?!]{0,25}\bpara\b/,
  // «no sé si pueda / podría / sea capaz / sirva / me dé»
  /\bno se si\b[^.?!]{0,20}\b(pueda|podria|sea capaz|sirva|me de|logre|aguante|funcione para mi)\b/,
  // «me da pena / miedo / susto / cosa»  (hablando de sí misma)
  /\bme da (pena|miedo|susto|cosa|nervios|verguenza)\b/,
  // «yo no sabría a quién hablarle» · «no sé a quién le hablaría»
  /\bno (sabria|se)\b[^.?!]{0,25}\b(a quien|con quien)\b/,
  // «no tengo el carácter / la madera / la facilidad / el don»
  /\bno tengo\b[^.?!]{0,20}\b(caracter|madera|facilidad|don|labia|paciencia para eso)\b/,
  // «soy muy tímido» · «soy malo para eso» · «soy pésimo para»
  /\bsoy (muy )?(timido|timida|penoso|penosa|malo|mala|pesimo|pesima)\b/,
  // «a mí no se me da» · «eso no se me da»
  /\bno se me da\b/,
  // «no creo poder» · «no creo que pueda» · «no me veo haciendo»
  /\bno creo (poder|que pueda)\b|\bno me veo\b[^.?!]{0,25}(haciendo|vendiendo|con esto)/,
];

/**
 * APLAZAMIENTO CORTÉS — en una amistad, esto no es una pausa: suele ser la
 * despedida. Se atiende SIN insistir, poniéndole fecha.
 *
 * ⚠️ NO incluye «no me interesa» ni «gracias, paso»: eso es un NO y se respeta.
 * El silencio y la negativa se tratan en otro lado; aquí solo lo ambivalente.
 */
export const RE_APLAZAMIENTO: RegExp[] = [
  /\blo (voy a|tengo que) pensar\b|\bdeja(me|nos)? pensarlo\b|\bpensarlo (bien|con calma)\b/,
  /\bcualquier cosa\b[^.?!]{0,20}\b(le|te) (aviso|escribo|digo|cuento|hablo)\b/,
  /\b(le|te) (aviso|escribo|cuento|confirmo)\b[^.?!]{0,20}\b(despues|luego|mas adelante|en estos dias|apenas pueda)\b/,
  /\bdespues\b[^.?!]{0,15}\b(le|te) (aviso|escribo|cuento|confirmo|digo)\b/,
  /\bdeje(me|nos)? (mirarlo|verlo|revisarlo|pensarlo|analizarlo)\b/,
  /\b(ahorita|ahora) no\b[^.?!]{0,20}\b(puedo|tengo|es el momento)\b|\bno es (el|mi) momento\b/,
  /\b(mas adelante|en unos dias|la otra semana|el otro mes)\b[^.?!]{0,25}\b(hablamos|miramos|lo veo|retomamos)\b/,
  /\btengo que (consultarlo|hablarlo)\b|\blo hablo con\b[^.?!]{0,20}\b(mi (esposa|esposo|mujer|marido|pareja|familia))\b/,
];

/**
 * Guardas: lo que NO es ambivalencia aunque se le parezca.
 *
 * · Una PREGUNTA informativa sobre el rol («¿yo tendría que vender?») la responde
 *   el arsenal, y responderla bien es justo lo que baja la duda.
 * · Un NO explícito se respeta; no se le propone acuerdo a quien ya cerró.
 */
const RE_PREGUNTA_DE_ROL = /\b(tendria|tengo|hay|toca|debo|debe|se debe)\b[^.?!]{0,25}\b(que vender|vender|convencer|buscar gente|hablarle a)\b/;
const RE_NO_EXPLICITO   = /\bno me interesa\b|\bgracias,? (pero )?(paso|no)\b|\bno gracias\b|\bno quiero\b|\bno,? por ahora no\b/;

export type SenalAmbivalencia = 'duda_propia' | 'aplazamiento' | null;

/**
 * Clasifica el mensaje de la persona. Devuelve `null` cuando no hay señal — que
 * es el caso mayoritario y en el que el flujo sigue intacto hacia el motor.
 */
export function detectarAmbivalencia(mensaje: string): SenalAmbivalencia {
  const t = normalizarAmb(mensaje);
  if (!t.trim()) return null;

  // Un NO explícito manda sobre todo lo demás: se respeta y no se propone nada.
  if (RE_NO_EXPLICITO.test(t)) return null;

  // La duda propia pesa más que el aplazamiento: si conviven, se atiende la duda.
  if (RE_DUDA_PROPIA.some((re) => re.test(t))) {
    // …salvo que sea una pregunta informativa sobre el rol, que el arsenal responde.
    if (RE_PREGUNTA_DE_ROL.test(t)) return null;
    return 'duda_propia';
  }

  if (RE_APLAZAMIENTO.some((re) => re.test(t))) return 'aplazamiento';

  return null;
}

/**
 * Micro-prompt para la DUDA SOBRE SÍ MISMA.
 *
 * No entrega texto verbatim a propósito (ver cabecera). Prohíbe lo que la
 * evidencia dice que hace daño y dicta solo la línea final.
 */
export function microPromptDudaPropia(): string {
  return `
🔴 NODO DE AMBIVALENCIA — la persona acaba de expresar una duda SOBRE SÍ MISMA,
no una pregunta sobre el negocio. Esto cambia lo que usted debe hacer en este
turno, y solo en este.

PROHIBIDO en este turno:
· Explicar cómo funciona el sistema, la tecnología o el método.
· Rebatir la duda, aunque tenga el argumento a la mano. Contradecirla la refuerza.
· Dar ánimo genérico ("¡claro que puede!", "todos empezamos así").
· Mencionar paquetes, precios, cifras o el siguiente paso.
· Hacer más de UNA pregunta.

OBLIGATORIO, en este orden y en máximo tres líneas:
1. Una frase que recoja LO QUE ELLA DIJO, con sus propias palabras. No una
   fórmula de empatía: si no puede nombrar lo que ella dijo, no escriba nada.
2. Cierre EXACTAMENTE con estas dos líneas, sin cambiarles una palabra:

"No busco que usted decida rápido, sino que decida bien.

Y dígame una cosa: si usted arrancara, ¿por qué lo haría?"
`.trim();
}

/**
 * ¿La conversación YA pasó por las formas de ganar?
 *
 * Importa porque cambia la pregunta que se ofrece. Dato de campo del Director
 * (22 ago 2026): que la persona ya haya visto el plan y AÚN ASÍ dude de sí misma
 * *"es más común de lo que parece"*. Ofrecerle otra vez "¿le muestro cómo entra
 * el dinero?" a quien ya lo vio la manda a repetir un paso, y eso es exactamente
 * el trámite que hace que la gente se vaya.
 *
 * Se mira SOLO lo que dijo el bot: que la persona escriba «binario» no significa
 * que se lo hayan explicado — puede estar preguntando qué es.
 */
const RE_YA_VIO_GANANCIA = /\bbinario\b|\bgen\s?5\b|\bgcv\b|\bcomisi[oó]n(es)?\b|paquetes? empresarial(es)?|consumo recurrente|formas de gana|c[oó]mo se gana|17\s?%/i;

export function yaVioLasFormasDeGanar(historial: { role: string; content: string }[]): boolean {
  return (historial || [])
    .filter((m) => m.role === 'assistant')
    .some((m) => RE_YA_VIO_GANANCIA.test(m.content || ''));
}

/**
 * ¿El mensaje actual responde a la evocación con un motivo de DINERO?
 *
 * El Director estima que el 95% contesta por ahí — *"por la plata, el jefe me
 * regaña, no me pagan lo que es justo, estoy mamada del empleo"*. No hace falta
 * afinarlo más: el 5% restante lo atiende el mismo micro-prompt, que instruye al
 * modelo a proponer el paso que corresponda al motivo que sí dio.
 */
const RE_MOTIVO_DINERO = /\b(plata|dinero|sueldo|salario|ingreso|deudas?|cuentas|no me alcanza|mal pago|pagan poco|lo que es justo)\b|\bmamad[oa]\b|\bcansad[oa] del (trabajo|empleo|jefe)\b|\bjefe\b/i;

/** El bot preguntó «si usted arrancara, ¿por qué lo haría?» en el turno anterior. */
export function botEvoco(ultimoMensajeDelBot: string): boolean {
  return /si usted arrancara/i.test(ultimoMensajeDelBot || '');
}

export function esMotivoDeDinero(mensaje: string): boolean {
  return RE_MOTIVO_DINERO.test(normalizarAmb(mensaje));
}

/**
 * Micro-prompt para EL MOTIVO — la persona acaba de decir por qué arrancaría.
 *
 * Es el turno de mayor rendimiento de toda la secuencia y el más fácil de
 * arruinar: aquí el impulso natural es explicar el negocio, y explicar apaga lo
 * que ella acaba de encender.
 *
 * ⚠️ **Queswa refleja lo que ella dijo de su trabajo, pero NO lo suscribe.** Ella
 * puede decir que el jefe la regaña; nosotros no opinamos de su jefe ni de su
 * empleo, nunca. El villano jamás es su trabajo — y menos cuando quien lo nombró
 * fue ella, porque entonces darle la razón se siente como que le hurgamos la
 * herida para vender.
 */
export function microPromptMotivo(yaVioGanancia: boolean): string {
  const cierre = yaVioGanancia
    ? '"Ya que menciona la plata: de las dos formas que vimos —el consumo recurrente y la compra de paquetes empresariales— ¿cuál cree que le serviría más a usted al comienzo?"'
    : '"¿Le muestro cómo entra el dinero?"';

  const nota = yaVioGanancia
    ? `La persona YA vio las formas de ganar en esta conversación, así que no se le
ofrece verlas otra vez: se le pide que elija cuál profundizar. La pregunta la
obliga a razonar sobre SU caso, y al razonarlo dice sus propios motivos.`
    : `La persona NO ha visto todavía las formas de ganar, así que el paso que se
le ofrece es verlas.`;

  return `
🔴 NODO DE MOTIVO — la persona acaba de decir por qué arrancaría. Eso que dijo es
lo más valioso de la conversación: son SUS razones, no las nuestras.

${nota}

PROHIBIDO en este turno:
· Explicar el negocio, el método o la tecnología. Explicar apaga lo que ella encendió.
· Opinar sobre su trabajo, su jefe o su sueldo, ni siquiera para darle la razón.
  Ella puede hablar mal de su empleo; usted no, nunca.
· Cualquier cifra, porcentaje, precio o proyección.
· Prometer o insinuar un resultado, un plazo o una comparación con lo que gana.
· Hacer más de UNA pregunta.

OBLIGATORIO, en máximo tres líneas:
1. Devolverle su motivo con SUS palabras, sin adornarlo y sin agregarle nada.
2. Una línea que convierta ese motivo en la razón de mirarlo — no en la razón de
   decidir. La idea es: eso que usted dice no es una duda, es una razón.
3. Cierre EXACTAMENTE con esta línea, sin cambiarle una palabra:

${cierre}

Si el motivo que dio NO tiene que ver con el dinero, conserve los puntos 1 y 2 y
reemplace el cierre por una sola pregunta que ofrezca ver justamente aquello que
ella nombró.
`.trim();
}

/**
 * Micro-prompt para el APLAZAMIENTO CORTÉS — el nodo de ACUERDO.
 *
 * El obstáculo se ENTREGA (la semana que se atraviesa), no se pregunta. La fecha
 * la pone ella. Una sola pregunta.
 */
export function microPromptAcuerdo(): string {
  return `
🔴 NODO DE ACUERDO — la persona está aplazando con cortesía. No es un "no": es
ambivalencia, y se atiende poniéndole fecha, nunca insistiendo.

PROHIBIDO en este turno:
· Insistir, resumir de nuevo el negocio o agregar un argumento más.
· Preguntarle qué la hace dudar. Ya pidió una pausa; preguntar ahí es no aceptarla.
· Mencionar urgencia, cupos o lo que se pierde si no decide.
· Hacer más de UNA pregunta.

OBLIGATORIO, en máximo tres líneas:
1. Aceptar la pausa sin reproche, en una línea.
2. Nombrar el obstáculo real —que la semana se atraviesa y esto queda para
   después— como un hecho compartido, NO como una pregunta y NO como advertencia.
3. Cierre EXACTAMENTE con esta línea, sin cambiarle una palabra:

"¿Qué día le escribo para retomarlo?"
`.trim();
}

// ─────────────────────────────────────────────────────────────────────────────
// LA ESCALERA DEL APLAZAMIENTO
//
// Dato de campo del Director (22 ago 2026), y es el que decide el diseño:
// **de 100 personas que dicen "lo voy a pensar", vuelve una o ninguna.** Con la
// escala del 1 al 10 vuelve al menos el 10%. Aceptar la pausa y poner fecha —que
// era mi diseño inicial— pierde a casi todos; la escala los conserva porque
// convierte una intención vaga en una posición medida, una carencia nombrada y
// una hora dicha por ella.
//
// Es la escalera que el Director usa en el 1-a-1, con UN peldaño añadido: el
// «¿por qué un 6 y no un 3?». Ahí la persona tiene que decir en voz alta por qué
// YA está en 6 — produce sus propias razones a favor, que es el momento de mayor
// rendimiento de toda la técnica.
//
// ⚠️ **El ancla va siempre hacia ABAJO.** «¿Por qué un 6 y no un 9?» la obliga a
// argumentar EN CONTRA del cambio: fabrica el discurso de resistencia, que es lo
// único que predice que no vuelve.
//
// Un peldaño por turno: una pregunta, una salida.
// ─────────────────────────────────────────────────────────────────────────────

export type PeldanoEscalera = 'escala' | 'ancla_baja' | 'que_falta' | 'cuando' | 'hora' | null;

/** Números del 1 al 10 como los escribe la gente: dígito o palabra. */
const PALABRA_A_NUMERO: Record<string, number> = {
  uno: 1, dos: 2, tres: 3, cuatro: 4, cinco: 5,
  seis: 6, siete: 7, ocho: 8, nueve: 9, diez: 10,
};

/** Extrae la calificación del mensaje. `null` si no hay ninguna. */
export function extraerCalificacion(mensaje: string): number | null {
  const t = normalizarAmb(mensaje);
  // Dígito suelto o con contexto: «6», «un 6», «como 7», «6/10», «6 de 10».
  const dig = t.match(/\b(10|[1-9])\b(?!\s*(?:mil|millon|pv|cv|%))/);
  if (dig) return parseInt(dig[1], 10);
  for (const [palabra, n] of Object.entries(PALABRA_A_NUMERO)) {
    if (new RegExp(`\\b${palabra}\\b`).test(t)) return n;
  }
  return null;
}

/**
 * En qué peldaño estamos, leyendo lo ÚLTIMO que dijo el bot.
 *
 * Mismo patrón que el resto del canal: el estado no se guarda, se lee del hilo.
 * Si el texto de un peldaño cambia, hay que cambiar también su patrón aquí.
 */
/**
 * ¿El bot acaba de pedir la HORA del acuerdo?
 *
 * Es el último peldaño de la escalera, y el único cuya respuesta hay que
 * GUARDAR: ahí la persona dice cuándo quiere que le escriban, y esa frase es la
 * que `wa-acuerdos.ts` convierte en un compromiso con fecha.
 *
 * ⚠️ Patrón acoplado al texto dictado en `microPromptEscalera('hora')`. Si aquel
 * cambia y este no, el acuerdo deja de guardarse **en silencio**: la escalera
 * seguiría funcionando y prometiendo, y nadie cumpliría.
 */
export function botPidioHora(ultimoMensajeDelBot: string): boolean {
  return /le escribo al dia siguiente|a que hora le queda bien/.test(
    normalizarAmb(ultimoMensajeDelBot || ''),
  );
}

export function peldanoDeEscalera(ultimoMensajeDelBot: string): PeldanoEscalera {
  const t = normalizarAmb(ultimoMensajeDelBot || '');
  if (!t) return null;
  if (/donde 1 es no me interesa/.test(t))                return 'ancla_baja';
  if (/\bpor que un \d+ y no un \d+\b/.test(t))           return 'que_falta';
  if (/que necesitaria para (llegar a|subir)/.test(t))    return 'cuando';
  if (/cuando (lo|la) (revisa|mira|ve)( con calma)?/.test(t)) return 'hora';
  return null;
}

/**
 * Micro-prompt de cada peldaño. Recibe la calificación cuando el peldaño la usa.
 *
 * ⚠️ Los textos dictados y los patrones de `peldanoDeEscalera()` son un contrato:
 * se editan juntos o la escalera se rompe en silencio y la persona recibe dos
 * veces la misma pregunta.
 */
export function microPromptEscalera(peldano: PeldanoEscalera, calificacion?: number | null): string {
  const base = (prohibido: string, obligatorio: string) => `
🔴 ESCALERA DEL APLAZAMIENTO — la persona está aplazando, no diciendo que no.
Se atiende con UNA pregunta por turno y sin agregar argumentos.

PROHIBIDO en este turno:
${prohibido}
· Insistir, resumir el negocio otra vez o mencionar urgencia, cupos o pérdida.
· Cualquier cifra de dinero, precio o porcentaje.
· Hacer más de UNA pregunta.

OBLIGATORIO, en máximo tres líneas:
${obligatorio}
`.trim();

  switch (peldano) {
    case 'escala':
      return base(
        '· Preguntarle qué la hace dudar. Ya pidió una pausa; preguntar ahí es no aceptarla.',
        `1. Aceptar la pausa sin reproche, en una línea, y sin pedir explicaciones.
2. Cierre EXACTAMENTE con esta línea, sin cambiarle una palabra:

"Antes de que se vaya, una sola pregunta: del 1 al 10, donde 1 es no me interesa y 10 es listo para arrancar, ¿dónde está hoy?"`,
      );

    case 'ancla_baja': {
      const n = calificacion ?? 5;
      const bajo = Math.max(1, n - 3);
      // Con 1 o 2 no hay ancla debajo: se salta al peldaño de la carencia.
      if (n <= 2) {
        return base(
          '· Tratar de subirle el número. Ella acaba de decir que está abajo; discutirlo es discutirle.',
          `1. Recibir el número sin juzgarlo, en una línea. Nada de "¡pero si es buenísimo!".
2. Cierre EXACTAMENTE con esta línea, sin cambiarle una palabra:

"Le agradezco la franqueza. ¿Qué tendría que pasar para que ese número subiera?"`,
        );
      }
      if (n >= 9) {
        return base(
          '· Explicar nada más. Ella ya está arriba: explicar ahora la enfría.',
          `1. Reconocer el número en una línea.
2. Cierre EXACTAMENTE con esta línea, sin cambiarle una palabra:

"¿Qué falta para que sea un 10?"`,
        );
      }
      return base(
        '· Preguntar por qué no es un número MÁS ALTO. Eso la obliga a argumentar en contra.',
        `1. Recibir el número en una línea, sin celebrarlo y sin corregirlo.
2. Cierre EXACTAMENTE con esta línea, sin cambiarle una palabra:

"¿Y por qué un ${n} y no un ${bajo}?"`,
      );
    }

    case 'que_falta': {
      const n = calificacion ?? 6;
      const alto = Math.min(10, n + 2);
      return base(
        '· Responder ahora lo que ella nombre. Primero se sabe qué falta; se entrega después.',
        `1. Devolverle en una línea la razón que ella acaba de dar, con SUS palabras.
2. Cierre EXACTAMENTE con esta línea, sin cambiarle una palabra:

"¿Qué necesitaría para llegar a un ${alto}: del producto o del negocio?"`,
      );
    }

    case 'cuando':
      // ⚠️ ESTE PELDAÑO ENVÍA. La primera versión decía «confirmar qué le va a
      // enviar, sin enviarlo aún» — copiado del 1-a-1, donde el Director manda el
      // material después y a mano. En el chat eso es una promesa incumplida dentro
      // de la propia escalera: Queswa anunciaba información, preguntaba cuándo la
      // revisaba, y no llegaba nada. La persona se queda esperando algo que ya
      // podía tener, y el acuerdo siguiente se agenda sobre el vacío.
      //
      // Aquí Queswa SÍ puede entregarlo en el mismo turno, así que lo entrega.
      // Diferirlo no ganaba nada y costaba credibilidad.
      return base(
        '· Prometer que le enviará algo después. Lo que ella nombró se responde AHORA.',
        `1. Responder AQUÍ MISMO lo que ella acaba de nombrar —del producto o del
   negocio, lo que haya dicho— en dos o tres líneas. Lo esencial, no todo: es
   para que tenga algo concreto que revisar, no para agotar el tema.
2. Cierre EXACTAMENTE con esta línea, sin cambiarle una palabra:

"¿Cuándo lo revisa con calma?"`,
      );

    case 'hora':
      return base(
        '· Proponerle usted la hora. La pone ella: un plan propio se cumple, uno impuesto no.',
        `1. Repetirle la hora que ella dijo, tal cual, en una línea.
2. Cierre EXACTAMENTE con esta línea, sin cambiarle una palabra:

"¿Le escribo al día siguiente para hablarlo? Dígame a qué hora le queda bien."`,
      );

    default:
      return '';
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// LA CONSULTA CON LA PAREJA — caso aparte, y el de mayor rendimiento
//
// «Lo tengo que hablar con mi esposa» no es un aplazamiento cualquiera: es el
// callejón sin salida clásico. Él le cuenta a medias lo que entendió a medias, y
// la conversación muere en la cocina.
//
// La jugada (Director, 22 ago 2026): **el enlace queda a nombre de ÉL y se lo
// comparte él mismo**. Tres razones, y la tercera es la que la vuelve la mejor
// pieza de toda la secuencia:
//
//   1. Ella entra por mano de él, no de un desconocido.
//   2. Al compartirlo, él hace el trabajo del negocio ANTES de comprarlo — y
//      descubre que es mandar un enlace.
//   3. Ve a Queswa atender a alguien suyo. El argumento y la demostración pasan a
//      ser el mismo objeto, sobre su propio caso y gratis.
//
// ⚠️ **NO se pregunta el nombre de ella.** Fricción detectada por el Director:
// al preguntar «¿cómo se llama?» la persona da el nombre de SU ESPOSA, y a partir
// de ahí Queswa le habla a él en femenino. El enlace va a nombre de él, que es un
// dato que ya tenemos, y así no hay referente ambiguo ni datos de un tercero.
// ─────────────────────────────────────────────────────────────────────────────

const RE_CONSULTA_PAREJA = /\b(lo|la) (tengo que|debo|voy a) (hablar|consultar|comentar)\b[^.?!]{0,25}\b(con)\b|\blo hablo con\b|\bconsultarlo con\b|\bcomentarlo con\b/;
const RE_PAREJA = /\b(mi )?(esposa|esposo|marido|mujer|pareja|senora|novia|novio|companer[oa])\b/;

export function esConsultaConPareja(mensaje: string): boolean {
  const t = normalizarAmb(mensaje);
  return RE_PAREJA.test(t) && (RE_CONSULTA_PAREJA.test(t) || /\bhablarlo con\b|\bdecidimos (entre los dos|juntos)\b/.test(t));
}

/**
 * ⚠️ NO ACTIVAR hasta que exista el enlace compartible del prospecto. Este texto
 * promete algo concreto —«le personalizo un enlace a su nombre»— y prometerlo sin
 * poder entregarlo es peor que no ofrecerlo.
 */
export function microPromptPareja(): string {
  return `
🔴 CONSULTA CON LA PAREJA — la persona quiere decidirlo con su pareja. Eso NO es
una excusa: es lo correcto, y se trata como tal.

PROHIBIDO en este turno:
· Tratarlo como una objeción o intentar que decida sin ella.
· Preguntar cómo se llama la pareja. El enlace va a nombre de QUIEN ESCRIBE.
· Mencionar urgencia, cupos, precios o cifras.
· Hacer más de UNA pregunta.

OBLIGATORIO, en máximo cuatro líneas:
1. Darle la razón en una línea: una decisión así se toma entre los dos.
2. Ofrecer el enlace en SU nombre, para que sea él quien se lo comparta, y decir
   que usted le responde a ella lo que quiera preguntar sin que él tenga que
   repetírselo.
3. Cierre EXACTAMENTE con esta línea, sin cambiarle una palabra:

"¿Se lo preparo?"
`.trim();
}

// ─────────────────────────────────────────────────────────────────────────────
// EL «NO», EN DOS TIEMPOS — y la PUERTA ABIERTA
//
// Técnica de campo del Director, y la que produjo el caso Patricia. Un «no» no se
// atiende de una sola forma: se atiende dos veces, y son distintas.
//
//   1º  Se acepta el no SIN discutirlo, y se hace UNA pregunta:
//       «Entiendo que siente que esto no es lo suyo. Pero dígame una cosa: si
//        usted arrancara, ¿por qué lo haría?»
//       Funciona incluso después de un no porque no pide compromiso, pide un
//       motivo — y el motivo lo dice ella. Es lo que le dijo a Claudia.
//
//   2º  Cuando ya es evidente que no hay nada que hacer, se deja la puerta:
//       «Soy enemigo del spam y de que lo persigan a uno. Pero si llego a tener
//        algo demasiado relevante, ¿le parece bien que se lo comparta?»
//       El 100% dice que sí.
//
// ⚠️ El orden NO es cosmético. Ofrecer la puerta al primer «no» se salta el
// segundo tiempo y desperdicia la única pregunta que todavía podía mover algo. Y
// repetir la evocación tras el segundo «no» es insistir, que es exactamente lo
// que la frase de la puerta promete no hacer.
//
// POR QUÉ IMPORTA GUARDARLA. Patricia dijo que no era lo suyo. Meses después la
// despidieron de Ecopetrol; hoy es rango bronce. Lo que cambió no fue su interés,
// fue su momento — y eso no se acelera, solo se puede estar ahí cuando pase. La
// puerta abierta es la única forma de seguir estando sin perseguir.
// ─────────────────────────────────────────────────────────────────────────────

/** El «no» explícito, que se respeta. Reutiliza el patrón del detector. */
export function esNoExplicito(mensaje: string): boolean {
  return RE_NO_EXPLICITO.test(normalizarAmb(mensaje));
}

/**
 * ¿Queswa ya hizo la pregunta del primer tiempo en esta conversación?
 *
 * Se lee del historial, no de un estado guardado — igual que todo el canal. Si ya
 * la hizo, este «no» es el segundo y toca la puerta; si no, es el primero.
 */
export function yaSeEvoco(historial: { role: string; content: string }[]): boolean {
  return (historial || [])
    .filter((m) => m.role === 'assistant')
    .some((m) => botEvoco(m.content || ''));
}

/**
 * Micro-prompt del PRIMER «no» — se acepta y se hace la pregunta.
 */
export function microPromptNoPrimero(): string {
  return `
🔴 PRIMER «NO» — la persona dice que no le interesa o que no es lo suyo.

PROHIBIDO en este turno:
· Rebatirlo, insistir o dar un argumento más. Contradecir un «no» lo endurece.
· Ofrecerle nada: ni información, ni paquetes, ni una llamada.
· Preguntarle POR QUÉ no le interesa. Eso le pide que defienda su negativa, y al
  defenderla se convence más.
· Hacer más de UNA pregunta.

OBLIGATORIO, en máximo tres líneas:
1. Aceptar el no en una línea, con sus palabras y sin reproche. Nada de «pero».
2. Cierre EXACTAMENTE con esta línea, sin cambiarle una palabra:

"Y dígame una cosa, por curiosidad: si usted llegara a arrancar, ¿por qué lo haría?"
`.trim();
}

/**
 * Micro-prompt del SEGUNDO «no» — la PUERTA ABIERTA.
 *
 * ⚠️ La promesa de no perseguir es literal y hay que poder cumplirla: lo que se
 * guarda es un permiso para avisar cuando aparezca algo que valga la pena, NO una
 * suscripción a una cadena. Si esto se convierte en un envío periódico, la frase
 * se vuelve mentira y la persona la va a reconocer como tal.
 */
export function microPromptPuertaAbierta(): string {
  return `
🔴 SEGUNDO «NO» — ya es claro que no hay nada que hacer hoy. Se deja la puerta.

PROHIBIDO en este turno:
· Cualquier intento más: nada de «piénselo», «cuando quiera aquí estoy con los
  paquetes», ni resumir el negocio una última vez.
· Mencionar precios, cupos, urgencia o lo que se pierde.
· Pedirle correo, teléfono ni ningún dato.
· Hacer más de UNA pregunta.

OBLIGATORIO, en máximo cuatro líneas:
1. Cerrar el tema de forma limpia y cordial, en una línea. Sin lástima y sin ironía.
2. Cierre EXACTAMENTE con estas líneas, sin cambiarles una palabra:

"Soy enemiga del spam y de que lo persigan a uno, así que no le voy a escribir por escribir.

Pero si en algún momento aparece algo que de verdad le sirva, ¿le parece bien que se lo comparta?"
`.trim();
}

/** ¿Aceptó la puerta? Un sí basta; no se insiste si dice que no. */
export function aceptaPuerta(mensaje: string): boolean {
  const t = normalizarAmb(mensaje);
  if (RE_NO_EXPLICITO.test(t) || /\bno\b/.test(t.split(/[.!?]/)[0] || '')) return false;
  return /\b(si|claro|dale|listo|dsd luego|desde luego|dale pues|dalee|dale si|dale claro|por supuesto|obvio|bueno|vale|ok|okay|de una)\b/.test(t);
}
