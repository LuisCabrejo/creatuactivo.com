/**
 * Copyright © 2026 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * Guardarraíl de salud del canal WhatsApp — v1 (16 ago 2026)
 *
 * Origen: docs/handoff/queswa/HANDOFF_GUARDARRAIL_SALUD_AGO2026.md — seis de seis
 * preguntas de salud produjeron respuestas infractoras (producto↔enfermedad,
 * estudios citados, testimonios, cero leyenda). El INVIMA prohíbe "sugerir o
 * implicar" utilidad terapéutica de un suplemento (Res. 3096/2007 art. 5.3) y la
 * publicidad no aprobada previamente (Decreto 3249/2006 art. 24); la SIC ya multó
 * con $708 millones un caso menor que este canal (REDU FAT FAST).
 *
 * Diseño v1 — dos capas imperfectas que se compensan:
 *   · ENTRADA (este módulo + webhook): la pregunta de salud se deriva ANTES de
 *     llegar al motor. Falla ante formulaciones creativas.
 *   · SALIDA (este módulo + webhook): el borrador del modelo se revisa antes de
 *     enviarse. Revisa la salida del propio modelo — mucho más predecible que la
 *     entrada del usuario — y atrapa lo que la entrada dejó pasar.
 *   El borrador que falla se DESCARTA y se reemplaza por el rechazo fijo. Nunca
 *   se corrige ni se reintenta: reintentar entrena al sistema a bordear el límite.
 *
 * ⚠️ v2 (17 ago 2026) — RECALIBRADO sobre la línea roja verificada, no sobre "suena
 * a salud". Fuente: docs/investigaciones/resultados/VOCABULARIO_BIENESTAR_HALLAZGOS_CLAUDE_AGO2026.md
 * (norma colombiana + políticas de Meta + benchmark del mercado y de la FDA).
 * El vocabulario de bienestar —energía, vitalidad, enfoque, antioxidante,
 * adaptógeno, "apoya el sistema inmune", sin nerviosismo, sin el bajón— PASA:
 * lo usa el propio fabricante y ninguna sanción de la SIC en el período revisado
 * fue por él. Se bloquea enfermedad, adelgazamiento, ciencia citada, mecanismo,
 * biomarcadores, clases farmacológicas y testimonio de enfermedad.
 * La batería (`node scripts/test-guardarrail-salud.mjs`) verifica ambos lados:
 * que la línea roja se bloquee y que ningún candado ni vocabulario verde dispare.
 *
 * ⚠️ Los patrones se escriben SIN tildes y con ñ→n: corren sobre el texto
 * normalizado por `normalizarSalud()`. La gente escribe con el pulgar — los
 * patrones toleran los tipeos vistos en pruebas reales (diabetis, artitis).
 */

/** lower + sin diacríticos (á→a, ñ→n). Los patrones de este módulo asumen esta forma. */
export function normalizarSalud(texto: string): string {
  return (texto || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

// ─── CAPA 0 — Emergencia ──────────────────────────────────────────────────────
// Urgencia vital o riesgo de autolesión. Corta TODO el flujo: cero producto,
// cero guion comercial. La respuesta manda a la línea 123 / urgencias.
export const RE_EMERGENCIA: RegExp[] = [
  /quitar(me|se)? la vida|me quiero (morir|matar)|acabar con mi vida|suicid|no quiero seguir viviendo|hacerme dano/,
  /dolor (fuerte |opresivo )?en el pecho|no puedo respirar|no puede respirar|me falta el aire|le falta el aire/,
  /(esta|se esta) convulsionando|perdio el conocimiento|esta inconsciente|se desmayo|sobredosis/,
  /sangrado (abundante|que no para)|se enveneno|envenenamiento|me intoxique|intoxicacion/,
];

// ─── ENTRADA — condición grave ────────────────────────────────────────────────
// Recibe el rechazo para enfermedad grave (sin pregunta de cierre: con un tema
// así no se negocia la continuidad de la conversación).
export const RE_SALUD_GRAVE: RegExp[] = [
  /cancer|tumor|quimio|radioterapia|oncolog|leucemia|metastasis/,
  /\bvih\b|\bsida\b|dialisis|insuficiencia (renal|cardiaca|hepatica)|cirrosis|hepatitis/,
  /convulsion|epileps|esclerosis|lupus|parkinson|alzheimer/,
  /infarto|derrame cerebral|trombosis|\bacv\b|preinfarto/,
  /embarazad|embarazo|lactancia|lactando/,
];

// ─── ENTRADA — condición o marco de salud común ───────────────────────────────
// Todo esto se deriva sin llegar al motor. La lista es de temas que la gente
// realmente escribe (incluye coloquialismos y tipeos), no un vademécum.
//
// ⚠️ RECALIBRADA el 17 ago 2026 con la investigación de vocabulario permitido
// (docs/investigaciones/resultados/VOCABULARIO_BIENESTAR_HALLAZGOS_CLAUDE_AGO2026.md).
// La v1 derivaba al médico preguntas que el propio fabricante responde en su
// sitio: "¿es antioxidante?", "¿sube las defensas?", "¿es bueno para la salud?".
// Eso era dispararse en el pie — ninguna sanción de la SIC en el período
// revisado fue por vocabulario de bienestar; todas fueron por enfermedad,
// adelgazamiento o cifras. **Se deriva la CONDICIÓN, no el BIENESTAR.**
// Salieron de esta lista: antioxidante · sistema inmune/inmunidad genérica ·
// "subir/fortalecer las defensas" · "para dormir" · "bueno para la
// salud/memoria/cerebro/piel". Se responden con vocabulario verde.
export const RE_SALUD_COMUN: RegExp[] = [
  /diabet|glucosa|insulina|glucemia|a[sz]ucar (alta|alto|elevad|descompensad|descontrolad)|para (el|la) a[sz]ucar|a[sz]ucar en la sangre/,
  /artr?itis|artitis|artrosis|reuma|osteoporosis|fibromialgia|dolor (articular|muscular)/,
  /dolor de (cabeza|espalda|rodilla|estomago|huesos|articulacion|coyuntura|cintura|cuello)|coyunturas\b|me duele(n)? (la |el |las |los |todo|mucho)/,
  /gastritis|colitis|ulcera|reflujo|estrenimiento|hemorroides|colon irritable/,
  /migrana|jaqueca|sinusitis|bronquitis|\bgripa\b|\btos\b|\basma\b|alergi/,
  /colesterol|triglicerid|hipertension|(presion|tension) (alta|baja|arterial)/,
  /tiroides|higado graso|prostata|menopausia|\brinon(es)?\b|calculos renales|anemia/,
  /insomnio|no puedo dormir|(para|contra) la (ansiedad|depresion)|sufro de (ansiedad|depresion)/,
  /bajar de peso|perder peso|subir de peso|adelga[sz]ar|obesidad|sobrepeso|quemar grasa|bajar la barriga/,
  /defensas (bajas|bajitas)|inmunodeficien/,
  /antiinflamator|desinflam|\bmedicinal|propiedades curativas/,
  /estoy en tratamiento|tomo (medicament|pastilla|remedio)|anticoagulante|metformina|losartan|ibuprofeno|acetaminofen|omeprazol|me diagnosticaron/,
  /buen[oa] para (la |el |los |las )?(circulacion|corazon|higado|colon|vista|rinones|huesos|prostata)/,
  /enfermedad|estoy enferm|esta enferm|me enferme/,
];

// ─── SALIDA — claims que jamás pueden salir del canal ─────────────────────────
// Revisa el BORRADOR del modelo y lo DESCARTA si trae algo de esta lista.
//
// ⚠️ RECALIBRADA el 17 ago 2026 contra la investigación de vocabulario permitido.
// El criterio ya no es "suena a salud" sino la línea roja verificada en tres
// regímenes (INVIMA/SIC · Meta · FDA/FTC):
//
//   · Enfermedad nombrada, y los verbos prevenir/aliviar/tratar/curar/revertir.
//   · **Adelgazamiento** — el disparador nº1 de sanción de la SIC en Colombia
//     (REDU FAT FAST, >$700M). No estaba en la v1.
//   · Las clases farmacológicas que la FDA declara disease claim ABSOLUTO, sin
//     contexto que las salve (21 CFR 101.93 Criterio 5): antiviral, antimicrobiano,
//     antibiótico, analgésico, antidepresivo. Tampoco estaban.
//   · "Terapéutico" — ninguna marca del benchmark lo usa (salvo ganoexcel.us, que
//     es su riesgo, no nuestro modelo).
//   · Ciencia citada: estudios, revistas, referencias bibliográficas. La FDA
//     sancionó a Half Hill Farm (2026) SOLO por las citas a publicaciones.
//   · Biomarcadores y signos-síntoma atados a enfermedad ("reduce el colesterol").
//   · Inmunidad + patógeno o infección en la misma frase — la frase exacta que
//     disparó la carta de la FDA a Duoc Thao Tre Xanh (Ganoderma, 2021).
//     ⚠️ "apoya el sistema inmune" a secas NO se bloquea: la FDA la declara
//     literalmente aceptable ("not specific enough to imply prevention of
//     disease"), y es la categoría "Apoyo a la inmunidad" de Herbalife Colombia.
//   · Testimonios de enfermedad y segunda persona + condición ("si usted sufre
//     de…") — este último es además el rechazo de copy más frecuente de Meta.
//
// ✅ Lo que la v1 bloqueaba y AHORA PASA, con respaldo: *antioxidante* (ejemplo
// propio de la FDA: "antioxidants maintain cell integrity"; ganoexcel.us dice
// "Antioxidant-rich") · *adaptógeno* (sin objeción de ningún regulador; uso
// universal en la categoría) · *energía · vitalidad · enfoque · claridad mental ·
// bienestar · sin nerviosismo · sin el bajón*.
//
// ⚠️ Los COMPUESTOS (triterpenos, polisacáridos, betaglucanos) NO se bloquean por
// nombrarse: son composición, y el propio sitio de Gano Excel Colombia describe el
// producto como "Ganoderma lucidum – Betaglucano". Lo que se bloquea es
// atribuirles FUNCIÓN biológica, que es donde empieza la declaración de propiedad.
export const RE_CLAIM_SALIDA: RegExp[] = [
  // Ciencia citada — incluidas las referencias bibliográficas (caso Half Hill Farm)
  /pubmed|frontiers|\bnih\b|ensayo clinico|estudios? (publicad|cientific|clinic|documenta|muestra|demuestra|respalda)|la investigacion (reciente |cientifica )?(documenta|muestra|demuestra|respalda)|clinicamente (probad|comprobad|demostrad)|cientificamente (probad|comprobad|demostrad)/,
  // Mecanismo de acción — inmunología pura, nunca es composición
  /celulas nk|macrofag|inmunomodulad|estres oxidativo|acidos? ganoderic|radicales libres/,
  // Compuesto + función atribuida (el compuesto solo, como composición, sí pasa)
  /(triterpen|betaglucan|beta-glucan|b-d-glucan|glucano|polisacarid)[a-z]*[^.]{0,40}\b(estimul|activ|modul|combat|refuerz|fortalec|proteg|repar|regener|reduc|mejor)/,
  // Biomarcadores y signos-síntoma atados a enfermedad
  /sensibilidad a la insulina|hiperglucemia|hiperlipidemia|glucemia|niveles de (azucar|glucosa|colesterol|trigliceridos)|regula el azucar|baja el colesterol|reduce el colesterol|presion arterial/,
  // Enfermedad nombrada
  /diabet|\bcancer\b|tumor|oncolog|quimioterapia|artr?itis|artrosis|hipertension|gastritis|migrana|\bacv\b|alzheimer|parkinson|osteoporosis|colon irritable/,
  // Clases farmacológicas — disease claim absoluto para la FDA (Criterio 5)
  /antiviral|antimicrobian|antibiotic|analgesic|antidepresiv|antitumoral|antitrombotic/,
  // Propiedades terapéuticas atribuidas
  /antiinflamator|propiedades (antiinflamatorias|medicinales|curativas|terapeuticas|farmacologicas)|inflamacion cronica|desinflam|hongo medicinal|concentracion(es)? terapeutica|efecto terapeutic/,
  // Verbos de enfermedad
  /(previene|prevenir|alivia|aliviar|trata|tratar|cura|curar|combate|combatir|revierte|controla|controlar) (la|el|los|las) (diabetes|azucar|presion|dolor|inflamacion|colesterol|glucosa|ansiedad|insomnio|enfermedad|gastritis|artritis)/,
  // Adelgazamiento — disparador nº1 de sanción de la SIC
  /(baja|bajar|pierde|perder|elimina|eliminar|quema|quemar) (de |la |el |los )?(peso|grasa|barriga|kilos|abdomen)|adelga[sz]a|efecto reductor|quemador de grasa/,
  // Inmunidad + patógeno / infección (la frase de la carta a Duoc Thao Tre Xanh)
  /(defensas|inmun[a-z]*|sistema inmune)[^.]{0,40}(virus|infeccion|bacteria|patogen|gripa|covid|resistir)|resistir (infecciones|enfermedades)/,
  // Testimonios de enfermedad y segunda persona + condición
  /muchas personas (con|que sufren)|en tratamiento oncologico|le ha servido para (el|la)|lo toman para (el|la) dolor|mas recomendado (para|en) (ese|esos) (tema|casos)|si (usted )?(sufre|padece) de|(sufre|padece) usted de/,
  // Plazos y resultados clínicos prometidos
  /(resultados?|mejoria|mejoras?|cambios?|efectos?) (visibles |notables )?(en|a los|a las) \d+ (dias|semanas|meses)/,
];

function primerMatch(patrones: RegExp[], textoNormalizado: string): string | null {
  for (const re of patrones) {
    const m = re.exec(textoNormalizado);
    if (m) return m[0];
  }
  return null;
}

/** Capa 0. Devuelve el término detectado o null. */
export function detectarEmergencia(texto: string): string | null {
  return primerMatch(RE_EMERGENCIA, normalizarSalud(texto));
}

/** Entrada. 'grave' manda sobre 'comun' (el rechazo es distinto). */
export function clasificarPreguntaSalud(texto: string): { nivel: 'grave' | 'comun'; termino: string } | null {
  const t = normalizarSalud(texto);
  const grave = primerMatch(RE_SALUD_GRAVE, t);
  if (grave) return { nivel: 'grave', termino: grave };
  const comun = primerMatch(RE_SALUD_COMUN, t);
  if (comun) return { nivel: 'comun', termino: comun };
  return null;
}

/** Salida. Devuelve el término detectado o null. El borrador que dispara se DESCARTA. */
export function detectarClaimSaludEnSalida(texto: string): string | null {
  return primerMatch(RE_CLAIM_SALIDA, normalizarSalud(texto));
}

// ─── Textos ───────────────────────────────────────────────────────────────────
// Estructura del rechazo (handoff §7): reconocer sin diagnosticar · explicar en
// términos del producto, nunca de la ley · entregar lo que sí se puede · UNA sola
// salida (regla de pregunta única del Director — el borrador del handoff traía
// dos salidas en la misma pregunta y aquí se corrigió).
// ⚠️ Ninguna versión repite la condición que el usuario nombró: el propio rechazo
// sería la insinuación que prohíbe el art. 5.3.

export const RESPUESTA_EMERGENCIA =
  'Lo que me describe necesita atención inmediata, y eso está por encima de cualquier ' +
  'conversación que tengamos aquí.\n\n' +
  'Por favor comuníquese ahora mismo con la línea de emergencias *123* o acuda al servicio ' +
  'de urgencias más cercano.\n\n' +
  'Cuando ya esté atendido, aquí me encuentra.';

export const RECHAZO_SALUD_ESTANDAR =
  'Le agradezco que me pregunte, y le voy a responder con franqueza.\n\n' +
  'Lo que yo manejo son alimentos y suplementos, no medicamentos. No están hechos para tratar ' +
  'ni para curar ninguna condición de salud, y yo no soy quién para decirle qué le conviene a ' +
  'usted en ese tema. Esa orientación se la puede dar su médico, que conoce su caso.\n\n' +
  'Lo que sí le puedo contar con precisión es qué son los productos: qué contienen, cómo se ' +
  'preparan y su precio.\n\n' +
  '¿Le comparto esa información?';

export const RECHAZO_SALUD_GRAVE =
  'Le agradezco la confianza de escribirme sobre esto.\n\n' +
  'Con un tema así prefiero ser claro y no hacerle perder tiempo: lo que yo manejo son ' +
  'alimentos y suplementos, no medicamentos, y no está bien de mi parte sugerirle nada frente ' +
  'a una condición de salud. Quien debe orientarlo es su médico tratante.\n\n' +
  'Si más adelante quiere conocer los productos por lo que son, aquí estoy con mucho gusto.';

export const RECHAZO_SALUD_CORTO =
  'Le entiendo, pero en temas de salud no le puedo orientar — esa parte es de su médico. ' +
  'Sobre el producto sí le cuento lo que quiera: qué contiene, cómo se prepara y su precio. ' +
  '¿Le sirve que lo comunique con alguien del equipo?';

// Prefijos distintivos de los textos de arriba. Sirven para (a) detectar
// reincidencia en el historial y endurecer al rechazo corto, y (b) que el
// saneamiento del historial reconozca sus propias correcciones.
const PREFIJOS_RECHAZO = [
  'Le agradezco que me pregunte, y le voy a responder con franqueza',
  'Le agradezco la confianza de escribirme sobre esto',
  'Le entiendo, pero en temas de salud no le puedo orientar',
  'Lo que me describe necesita atención inmediata',
];

export function esRechazoSalud(texto: string): boolean {
  const t = (texto || '').trim();
  return PREFIJOS_RECHAZO.some((p) => t.startsWith(p));
}
