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
 * ⚠️ Límite deliberado de v1 (documentado, no accidental): el detector de SALIDA
 * NO incluye "antioxidante", "inmunológico" ni "energía" porque viven dentro de
 * candados <verbatim_lock> del catálogo — bloquearlos tumbaría la lista de
 * productos y los precios, que son funnel legítimo. Esas frases son declaraciones
 * de propiedades (art. 16) y salen del CORPUS en la curaduría (paso 4 del
 * handoff), no de este filtro. La batería lo verifica:
 * `node scripts/test-guardarrail-salud.mjs` valida que ningún candado dispare.
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
export const RE_SALUD_COMUN: RegExp[] = [
  /diabet|glucosa|insulina|glucemia|a[sz]ucar (alta|alto|elevad|descompensad|descontrolad)|para (el|la) a[sz]ucar|a[sz]ucar en la sangre/,
  /artr?itis|artitis|artrosis|reuma|osteoporosis|fibromialgia|dolor (articular|muscular)/,
  /dolor de (cabeza|espalda|rodilla|estomago|huesos|articulacion|coyuntura|cintura|cuello)|coyunturas\b|me duele(n)? (la |el |las |los |todo|mucho)/,
  /gastritis|colitis|ulcera|reflujo|estrenimiento|hemorroides|colon irritable/,
  /migrana|jaqueca|sinusitis|bronquitis|\bgripa\b|\btos\b|\basma\b|alergi/,
  /colesterol|triglicerid|hipertension|(presion|tension) (alta|baja|arterial)/,
  /tiroides|higado graso|prostata|menopausia|\brinon(es)?\b|calculos renales|anemia/,
  /insomnio|no puedo dormir|para dormir\b|(para|contra) la (ansiedad|depresion)|sufro de (ansiedad|depresion)/,
  /bajar de peso|perder peso|subir de peso|adelga[sz]ar|obesidad|sobrepeso/,
  /defensas (bajas|bajitas)|(sub(e|a|ir)|fortalec[a-z]*) las defensas|sistema inmun|inmunidad/,
  /antiinflamator|antioxidant|desinflam|\bmedicinal/,
  /estoy en tratamiento|tomo (medicament|pastilla|remedio)|anticoagulante|metformina|losartan|ibuprofeno|acetaminofen|omeprazol|me diagnosticaron/,
  /buen[oa] para (la |el |los |las )?(salud|corazon|higado|memoria|circulacion|colon|vista|piel|cerebro|huesos|rinones)/,
  /enfermedad|estoy enferm|esta enferm|me enferme/,
];

// ─── SALIDA — claims que jamás pueden salir del canal ─────────────────────────
// Revisa el BORRADOR del modelo. Cada grupo corresponde a una infracción vista
// en el diagnóstico del 15 ago: citas de estudios, compuestos con función
// biológica, biomarcadores, enfermedades nombradas, testimonios de salud.
// ⚠️ Antes de agregar un término aquí, verificar que no viva en un candado
// (la batería lo hace sola). Ver el límite deliberado de v1 en la cabecera.
export const RE_CLAIM_SALIDA: RegExp[] = [
  /pubmed|frontiers|ensayo clinico|estudios? (publicad|cientific|clinic|documenta|muestra|demuestra|respalda)|la investigacion (reciente |cientifica )?(documenta|muestra|demuestra|respalda)/,
  /celulas nk|macrofag|triterpen|betaglucan|beta-glucan|b-d-glucan|glucanos|polisacarid|acidos? ganoderic|inmunomodulad|adaptogen|estres oxidativo/,
  /sensibilidad a la insulina|hiperglucemia|hiperlipidemia|glucemia|niveles de (azucar|glucosa|colesterol)|regula el azucar|baja el colesterol/,
  /diabet|\bcancer\b|tumor|oncolog|quimioterapia|artr?itis|artrosis|hipertension|gastritis|migrana|\bacv\b|alzheimer|parkinson/,
  /antiinflamator|propiedades (antiinflamatorias|antioxidantes|medicinales|curativas|terapeuticas)|inflamacion cronica|desinflam|hongo medicinal/,
  /(previene|alivia|trata|cura|combate|controla|regula) (la|el|los|las) (diabetes|azucar|presion|dolor|inflamacion|colesterol|glucosa|ansiedad|insomnio|enfermedad)/,
  /muchas personas (con|que sufren)|en tratamiento oncologico|le ha servido para (el|la)|lo toman para (el|la) dolor|mas recomendado (para|en) (ese|esos) (tema|casos)/,
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
