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
  /ingresos? pasivos?|dinero mientras (duerme|descansa)|gana(r)? sin hacer nada|no tiene que hacer nada|solo (se|lo) hace solo/,
  /(crece|funciona|trabaja)[^.]{0,15}(solo|por si (solo|mismo)|en automatico|sin que usted)/,

  // ── La comisión contada en PERSONAS ────────────────────────────────────────
  // Es la silueta que el prospecto reconoce como pirámide. El GEN5 se cuenta en
  // COMPRAS: "por cada paquete empresarial que se compra en su canal".
  /(por cada|cada vez que un[ao]?)\s*(persona|socio|distribuidor|afiliado|miembro)[^.]{0,35}(entra|entre|ingresa|ingrese|se (vincula|vincule|inscribe|inscriba|registra|registre|afilia|afilie)|arranca|arranque|se une|se una)[^.]{0,35}(recibe|reciba|gana|gane|le (entra|entre|queda|quede|pagan|paguen)|\$|usd|cop)/,
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
export function detectarPromesaDeIngreso(texto: string): string | null {
  if (!texto) return null;
  return primerMatch(RE_PROMESA_INGRESO, normalizarNegocio(texto));
}
