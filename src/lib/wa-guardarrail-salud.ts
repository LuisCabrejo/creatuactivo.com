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

import { normalizarSuave } from '@/lib/texto-normalizar';

/** lower + sin diacríticos (á→a, ñ→n). Los patrones de este módulo asumen esta forma. */
export function normalizarSalud(texto: string): string {
  return normalizarSuave(texto);
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
  // ⚠️ `adelga[sz]a` y NO `adelga[sz]ar`: con el infinitivo, «¿esto adelgaza?»
  // —la forma en que de verdad se pregunta— pasaba entera. El lado de SALIDA sí
  // lo atrapaba desde siempre; el de ENTRADA no, y es el que evita que el modelo
  // llegue siquiera a componer la respuesta. Encontrado el 24 ago 2026 al llevar
  // este guardarraíl a la web. El adelgazamiento es el disparador nº1 de sanción
  // de la SIC en el período auditado, así que este hueco no era menor.
  /bajar de peso|perder peso|subir de peso|adelga[sz]a|obesidad|sobrepeso|quemar grasa|bajar la barriga/,
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
  // La ciencia AFIRMADA como credencial, sin cita. Nuestra doctrina ya la
  // rechaza por otra vía —la evidencia es un hecho verificable (número de
  // registro, certificación), nunca un adjetivo de credibilidad—, y el filtro
  // no la veía: «base científica del extracto» pasaba entero. Destapado el 29
  // ago 2026 al auditar los bloques que propuso el informe de Gemini.
  // Backtest: 0 de 128 respuestas reales y 0 de 203 fragmentos del arsenal.
  /(base|respaldo|aval|sustento|fundamento) cientific[oa]|cientificamente (respaldad|avalad|sustentad|formulad)/,
  // PREVENCIÓN. Prevenir enfermedad es declaración terapéutica, reservada a
  // medicamentos. El patrón de arriba exige verbo + enfermedad nombrada
  // («previene la diabetes»), así que el adjetivo suelto —«apoyo nutricional
  // preventivo», «equilibrio preventivo del organismo»— pasaba sin tocar nada.
  // ⚠️ Lo que el backtest NO respaldó: bloquear «equilibrio del cuerpo». Vive
  // en dos fragmentos aprobados junto a «apoyan el sistema inmune», que es
  // vocabulario verde; el elemento riesgoso de esa frase era «preventivo».
  // Backtest: 0 de 128 respuestas reales y 0 de 203 fragmentos.
  /(?<![a-z])(prevencion|preventiv[oa]s?)(?![a-z])/,
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
  // Órgano o sistema con verbo de mejora. INVIMA solo aprueba esta forma como
  // "contribuye al funcionamiento NORMAL de X", y su catálogo cubre nutrientes
  // —vitaminas, minerales, colágeno—: no menciona Ganoderma ni una vez. Hueco
  // encontrado el 22 ago 2026 auditando el catálogo web, donde 22 declaraciones
  // de este tipo llevaban meses publicadas y el guardarraíl dejaba pasar todas.
  // ⚠️ El sistema INMUNE se deja fuera a propósito: "apoya las defensas" es la
  // práctica de mercado que el propio fabricante usa y que ninguna sanción del
  // período castigó. Las articulaciones también, porque el colágeno SÍ tiene
  // declaración aprobada (Acta 10 de 2017).
  /(mejor|fortalec|estimul|proteg|regener|regul|restaur|optimiz)[a-z]*[^.]{0,30}\b(circulacion|cardiovascular|corazon|rinones|pulmones|respiratori|higado|cerebr|memoria|oxigenacion|celulas|prostata|tiroides|funcion sexual|libido)/,
  /(apoya|favorece|promueve|contribuye a|ayuda a)[^.]{0,35}\b(la salud|el funcionamiento|la funcion|el desarrollo)\b[^.]{0,30}\b(cerebr|corazon|circulator|cardiovascular|respiratori|digestiv|nervios|renal|rinones|higado|pulmon|huesos|sexual)/,
  /tonico para el cerebro|oxigenacion celular|regeneracion celular|desintoxicacion (natural|del organismo)|efecto detox/,
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

// ─── ENTRADA — pide la ciencia ────────────────────────────────────────────────
// «Resúmame los estudios de PubMed», «¿qué evidencia científica hay?». Hasta el
// 8 sep 2026 esta pregunta llegaba al motor, el modelo componía con la ciencia
// adentro, el filtro de salida la bloqueaba y la persona recibía el texto fijo
// de quien DECLARA una condición («le agradezco la confianza de contármelo»,
// «sobre su condición») — acuse equivocado y plantilla (Patricia, docente que
// se preparaba para lo que el mercado le iba a preguntar). Con familia propia
// se compone desde el principio alrededor de su núcleo.
//
// Lo que la norma castiga no es que la ciencia exista sino el VÍNCULO con una
// enfermedad, juzgado por contexto (Res. 3096 art. 5.3 «sugieran o impliquen»;
// la FDA lleva 31 cartas desde 2006 por citar literatura, y el criterio es que
// la cita refiera a un uso para enfermedad en el conjunto). Por eso `grave`
// manda sobre esta familia: «estudios sobre el hongo y el cáncer» es grave, y
// el texto de grave nunca apunta a estudios.
export const RE_SALUD_EVIDENCIA: RegExp[] = [
  /pubmed|scielo|cochrane|ensayos? clinicos?/,
  /estudios? (cientific|clinic|publicad|medic|de laboratorio|que (lo )?(respald|demuestr|comprueb))|estudios? (sobre|del|de la|acerca)/,
  /evidencia (cientific|clinic|medica)|(base|respaldo|sustento|soporte|aval) cientific|articulos? cientific|papers?\b|literatura cientific|revistas? (cientific|medic|indexad)/,
  /investigaci(on|ones) (cientific|clinic|medic|publicad|sobre|del)|que dice la ciencia|(esta|estan) (comprobad|demostrad|probad)[oa]s? cientific|cientificamente (comprobad|demostrad|probad)/,
];

export function pideEvidencia(texto: string): boolean {
  return primerMatch(RE_SALUD_EVIDENCIA, normalizarSalud(texto)) !== null;
}

/** Entrada. 'grave' manda sobre 'evidencia', y esta sobre 'comun' (cada una tiene su núcleo). */
export function clasificarPreguntaSalud(texto: string): { nivel: 'grave' | 'comun' | 'evidencia'; termino: string } | null {
  const t = normalizarSalud(texto);
  const grave = primerMatch(RE_SALUD_GRAVE, t);
  if (grave) return { nivel: 'grave', termino: grave };
  const evidencia = primerMatch(RE_SALUD_EVIDENCIA, t);
  if (evidencia) return { nivel: 'evidencia', termino: evidencia };
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

// ⚠️ Reescritos el 29 ago 2026 con el Director. Dos decisiones:
//   · Una sola respuesta para toda pregunta de salud era el error: «¿qué es
//     bueno para bajar de peso?» se pregunta con naturalidad en Colombia, y
//     recibía el mismo texto que «tengo cáncer». Hay FAMILIAS (peso · molestia
//     común · tratamiento en curso · grave), y cada una tiene su acuse de recibo.
//   · Nada de «le hablo con franqueza / con honestidad / para serle
//     transparente»: quien se declara honesto posiciona al otro como el que no
//     lo es. La limitación se presenta como HECHO —la categoría del producto
//     ante el INVIMA— o como cuidado, nunca como declaración de virtud propia.
// Lo que no cambia: ningún texto repite la condición que la persona nombró
// (Res. 3096 art. 5.3), ninguno vincula un producto al resultado, y todos
// cierran con una sola salida. Los cuatro pasan el filtro de SALIDA.

export type FamiliaSalud = 'peso' | 'azucar' | 'tratamiento' | 'grave' | 'comun' | 'evidencia';

// ─── EL NÚCLEO LEGAL ─────────────────────────────────────────────────────────
// Lo único de estas respuestas con exposición legal, y por eso lo único que se
// congela. El acuse y el cierre dependen de lo que la persona dijo y deben
// adaptarse (etapa 3, 29 ago 2026): el nodo entrega el núcleo, el modelo escribe
// alrededor, y el webhook verifica que el núcleo llegó antes de enviar.
// Estas constantes arman los textos fijos Y viajan en la instrucción al modelo,
// así que no se pueden desincronizar.

export const NUCLEO_PESO =
  'Para orientarle con exactitud: nuestra línea está catalogada ante el INVIMA como alimentos y ' +
  'suplementos dietarios, y no como tratamientos médicos, así que lo que encontrará aquí es ' +
  'nutrición para el día a día.';

export const NUCLEO_DECLARA =
  'Para orientarle con exactitud: nuestra línea está catalogada ante el INVIMA como alimentos y ' +
  'suplementos dietarios, y no como medicamentos, así que sobre su condición quien tiene la ' +
  'palabra es su médico, que es quien conoce su caso.';

// ⚠️ «terreno médico», no «terreno de su médico» (Director, 30 ago 2026): nueve
// de cada diez personas que preguntan esto están midiendo el MERCADO, no su
// propio caso. «Su médico» les atribuye una condición y un tratante que no
// mencionaron — la misma falla que el acuse de confianza, en pequeño. Y para
// quien sí pregunta por lo suyo, la forma neutra sirve igual.
export const NUCLEO_PREGUNTA =
  'Para orientarle con exactitud: nuestra línea está catalogada ante el INVIMA como alimentos y ' +
  'suplementos dietarios, y no como medicamentos, así que ninguno está indicado para una condición ' +
  'de salud, que es terreno médico.';

// Quien pide la ciencia. Lo que se congela es el porqué, dicho como hecho y no
// como disculpa: la categoría del producto es un dato estructural, y usar la
// ciencia para vender la vuelve publicidad. La frase de apertura («uno de los
// hongos más estudiados del mundo») está en la lista verde del fabricante y NO
// vincula nada; vive en el texto de respaldo y en la instrucción al modelo, que
// puede abrir con ella.
export const NUCLEO_EVIDENCIA =
  'Lo que yo no hago es traer esa literatura a esta conversación como respaldo de un producto que ' +
  'ante el INVIMA es un alimento: en el momento en que la ciencia se usa para vender, deja de ser ' +
  'información y pasa a ser publicidad, y ahí la norma es clara.';

// La segunda pregunta de salud del mismo hilo. Repetir el núcleo palabra por
// palabra es lo que suena a máquina (Patricia recibió dos veces el mismo texto,
// letra por letra, 8 sep 2026). El marco legal ya está dicho dos turnos atrás y
// sigue en el hilo; lo que se congela ahora es la referencia a él.
export const NUCLEO_REINCIDE = 'Ahí aplica lo mismo que le acabo de decir, y no se lo repito.';

/** El núcleo que corresponde. Solo la emergencia queda fuera de la composición. */
export function nucleoSalud(familia: FamiliaSalud, declara: boolean): string {
  if (familia === 'peso') return NUCLEO_PESO;
  if (familia === 'evidencia') return NUCLEO_EVIDENCIA;
  return declara ? NUCLEO_DECLARA : NUCLEO_PREGUNTA;
}

/**
 * Las familias cuya envoltura puede componer el modelo: todas. La emergencia no
 * pasa por aquí (Capa 0 corta antes).
 *
 * `grave` se dictaba entera hasta el 8 sep 2026 con el argumento de que «la
 * respuesta correcta no depende del contexto». Patricia demostró lo contrario:
 * dos preguntas graves seguidas, dos veces el mismo texto. Lo que no depende del
 * contexto es el NÚCLEO, y ese sigue literal y verificado; el acuse y el cierre
 * sí dependen de cómo preguntó la persona. Para grave rigen dos reglas más,
 * escritas en la instrucción del motor: ningún producto concreto en ese turno
 * (ofrecerlo tras esa pregunta es la insinuación del art. 5.3) y un acuse que
 * no le atribuya a la persona nada que no dijo.
 */
export function saludSeCompone(familia: FamiliaSalud): boolean {
  return familia === 'peso' || familia === 'azucar' || familia === 'comun' || familia === 'tratamiento'
    || familia === 'grave' || familia === 'evidencia';
}

/** El cierre único de las respuestas de salud compuestas. */
export const CIERRE_SALUD = '¿Le muestro el catálogo completo para que vea las presentaciones?';
/** El cierre de quien pidió la ciencia: lo verificable, empezando por el extracto solo. */
export const CIERRE_EVIDENCIA = '¿Le paso la ficha de las Cápsulas de Ganoderma, que es el extracto sin nada más?';
/** El cierre de la segunda pregunta de salud del hilo. */
export const CIERRE_REINCIDE = '¿Le comparto la de alguno en particular?';

/**
 * ¿Este texto del asistente ya trae un núcleo de salud? Devuelve cuál. Compara
 * sobre la parte con exposición legal —sin el «Para orientarle con exactitud:»
 * de arranque— para que cuenten también los textos fijos anteriores al 29 ago,
 * que llevan la misma frase sin ese prefijo. Es la señal de reincidencia: si el
 * núcleo que aplica ahora ya está en el hilo, no se repite, se nombra.
 */
export function nucleoClave(nucleo: string): string {
  return nucleo.replace(/^Para orientarle con exactitud:\s*/i, '').replace(/\s+/g, ' ').trim().toLowerCase();
}
export function contieneNucleoSalud(textoAsistente: string, nucleo: string): boolean {
  const plano = (textoAsistente || '').replace(/\s+/g, ' ').toLowerCase();
  return plano.includes(nucleoClave(nucleo));
}

/** Peso: la pregunta más natural del país. Un producto real, por sus hechos. */
export const RECHAZO_SALUD_PESO =
  'Comprendo su objetivo, y me alegra que esté buscando opciones para cuidar su bienestar.\n\n' +
  NUCLEO_PESO + '\n\n' +
  'Dicho esto, el compañero ideal para cualquier rutina saludable es el Ganocafé Clásico: un café ' +
  'negro premium, sin azúcar ni crema, que le da energía pareja desde temprano.\n\n' +
  '¿Le cuento cómo integrarlo en su rutina?';

/** Azúcar (diabetes, glucosa, insulina): el hecho de composición —sin azúcar— dicho con orgullo. */
export const RECHAZO_SALUD_AZUCAR =
  'Comprendo su consulta, y hace muy bien en cuidar esos detalles de su alimentación.\n\n' +
  NUCLEO_DECLARA + '\n\n' +
  'Dicho esto, usted tiene a mano dos opciones que Gano Excel fabrica desde hace treinta años, ' +
  'cada una con su registro sanitario. Si cuida el azúcar en lo que consume, el Ganocafé Clásico ' +
  'le da café negro premium sin azúcar ni crema, y las Cápsulas de Ganoderma le entregan el ' +
  'extracto puro, sin nada más.\n\n' +
  '¿Le muestro el catálogo completo para que vea las presentaciones?';

/** Molestia o condición común: la categoría del producto es la que responde, con orgullo. */
export const RECHAZO_SALUD_ESTANDAR =
  'Comprendo su consulta, y le agradezco la confianza de contármelo.\n\n' +
  NUCLEO_DECLARA + '\n\n' +
  'Dicho esto, usted tiene a mano una línea que Gano Excel fabrica desde hace treinta años, con ' +
  'registro sanitario en cada producto: el café, las bebidas y las cápsulas de Ganoderma, ' +
  'pensadas para acompañar su día con energía y bienestar.\n\n' +
  '¿Le muestro el catálogo completo para que vea las presentaciones?';

/** Tratamiento en curso: la última palabra la tiene su médico, y la composición se le da. */
export const RECHAZO_SALUD_TRATAMIENTO =
  'Gracias por contármelo. Con un tratamiento en curso la última palabra la tiene su médico, y así ' +
  'debe ser: los productos de Gano Excel están registrados como alimentos y suplementos dietarios, ' +
  'de modo que él es quien puede decirle cómo encajan en lo suyo.\n\n' +
  'Para esa conversación usted puede llevar la composición exacta de cualquiera de ellos, con su ' +
  'registro sanitario.\n\n' +
  '¿Le comparto la de alguno en particular?';

export const RECHAZO_SALUD_GRAVE =
  'Le agradezco la confianza de contármelo, y le deseo lo mejor.\n\n' +
  'Los productos de Gano Excel están registrados ante el INVIMA como alimentos y suplementos ' +
  'dietarios, y por esa categoría ninguno está indicado para una condición de salud, así que quien ' +
  'debe orientarle es su médico tratante.\n\n' +
  'Cuando quiera conocerlos por lo que son, aquí me encuentra con mucho gusto.';

// «terreno médico», no «su médico» (8 sep 2026): también aquí la persona puede
// no estar preguntando por ella. Es además el texto de la SEGUNDA reincidencia
// de cualquier familia: la referencia a lo ya dicho se dice una vez; a la
// tercera pregunta de salud seguida, esto, y la puerta al equipo.
export const RECHAZO_SALUD_CORTO =
  'Le entiendo. En temas de salud esa parte es terreno médico, y sobre el producto usted puede ' +
  'preguntarme lo que quiera: qué lleva, cómo se prepara y cuánto cuesta. ' +
  '¿Le sirve que lo comunique con alguien del equipo?';

/**
 * ¿La persona DECLARA algo suyo, o PREGUNTA por el catálogo?
 *
 * Medido el 29 ago 2026 sobre el corpus: de 4 mensajes clasificados como salud,
 * los 4 PREGUNTAN y ninguno declara. El texto que recibían estaba construido
 * entero sobre la suposición contraria —«le agradezco la confianza de
 * contármelo», «su condición», «su médico, que conoce su caso»—, así que estaba
 * mal el 100 % de las veces. Son dos personas distintas: a quien cuenta algo
 * suyo se le reconoce la confianza; a quien pregunta por un producto, no.
 */
export function declaraCondicion(texto: string): boolean {
  const t = normalizarSalud(texto);
  return /(?<![a-z])(tengo|sufro|padezco|me diagnosticaron|estoy (con|en tratamiento)|soy diabetic|me duele|ando con|vivo con|me detectaron|mi (mama|papa|esposa|esposo|hijo|hija|hermano|hermana|madre|padre))(?![a-z])/.test(t);
}

// ─── Variantes para quien PREGUNTA (no declara nada suyo) ────────────────────
// Mismo marco legal, palabra por palabra. Cambia el acuse y desaparece «su
// condición», que le atribuye a la persona algo que no dijo.

export const RECHAZO_SALUD_AZUCAR_PREGUNTA =
  'Buena pregunta, y de las que más nos hacen.\n\n' +
  NUCLEO_PREGUNTA + '\n\n' +
  'Dicho esto, si lo que busca es cuidar el azúcar en lo que consume, el Ganocafé Clásico es café ' +
  'negro premium sin azúcar ni crema, y las Cápsulas de Ganoderma le entregan el extracto puro, ' +
  'sin nada más.\n\n' +
  '¿Le muestro el catálogo completo para que vea las presentaciones?';

export const RECHAZO_SALUD_COMUN_PREGUNTA =
  'Buena pregunta.\n\n' +
  NUCLEO_PREGUNTA + '\n\n' +
  'Dicho esto, usted tiene a mano una línea que Gano Excel fabrica desde hace treinta años, con ' +
  'registro sanitario en cada producto: el café, las bebidas y las cápsulas de Ganoderma, ' +
  'pensadas para acompañar su día con energía y bienestar.\n\n' +
  '¿Le muestro el catálogo completo para que vea las presentaciones?';

export const RECHAZO_SALUD_GRAVE_PREGUNTA =
  'Le respondo con cuidado, porque el tema lo merece.\n\n' +
  'Nuestra línea está catalogada ante el INVIMA como alimentos y suplementos dietarios, y no como ' +
  'medicamentos, así que ninguno está indicado para una condición de salud, que es terreno ' +
  'médico.\n\n' +
  'Cuando quiera conocer los productos por lo que son, aquí me encuentra con mucho gusto.';

/**
 * Quien pide la ciencia (respaldo fijo — el turno se compone alrededor del
 * núcleo; esto se envía solo si el modelo no reprodujo el núcleo literal o si
 * el filtro de salida bloqueó lo compuesto). Redacción del Director, 8 sep 2026.
 */
export const RECHAZO_SALUD_EVIDENCIA =
  'El Ganoderma es uno de los hongos más estudiados del mundo, y esa literatura es pública.\n\n' +
  NUCLEO_EVIDENCIA + '\n\n' +
  'Lo que sí le doy con exactitud es lo verificable: composición, proceso de extracción, presentación ' +
  'y registro sanitario de cada producto. ' + CIERRE_EVIDENCIA;

/** La familia de la pregunta, a partir del término que disparó la entrada. */
export function familiaSalud(clasificacion: { nivel: 'grave' | 'comun' | 'evidencia'; termino: string }): FamiliaSalud {
  if (clasificacion.nivel === 'grave') return 'grave';
  if (clasificacion.nivel === 'evidencia') return 'evidencia';
  const t = clasificacion.termino;
  if (/peso|adelga|obesidad|sobrepeso|grasa|barriga/.test(t)) return 'peso';
  if (/diabet|glucosa|insulina|glucemia|azucar/.test(t)) return 'azucar';
  if (/tratamiento|tomo |anticoagulante|metformina|losartan|ibuprofeno|acetaminofen|omeprazol|diagnosticaron/.test(t)) return 'tratamiento';
  return 'comun';
}

/** El texto que corresponde. La reincidencia endurece solo a la familia común. */
export function rechazoSaludPorFamilia(
  clasificacion: { nivel: 'grave' | 'comun' | 'evidencia'; termino: string },
  reincide = false,
  mensaje = '',
): { familia: FamiliaSalud; texto: string; declara: boolean } {
  const familia = familiaSalud(clasificacion);
  // `tratamiento` es declaración por definición (su detector lee «tomo
  // medicamentos», «me diagnosticaron»), y `peso` sirve igual en los dos casos.
  // ⚠️ Nada más cuenta como declaración: «ayudarme», «coadyuvante» o el
  // vocabulario clínico NO significan que la persona esté enferma (Director,
  // 8 sep 2026 — Patricia era una docente preparándose para lo que le iba a
  // preguntar el mercado). Asumirlo es el error, no la excepción.
  const declara = familia === 'tratamiento' || declaraCondicion(mensaje);
  const texto = familia === 'grave'
      ? (declara ? RECHAZO_SALUD_GRAVE : RECHAZO_SALUD_GRAVE_PREGUNTA)
    : familia === 'evidencia' ? RECHAZO_SALUD_EVIDENCIA
    : familia === 'peso' ? RECHAZO_SALUD_PESO
    : familia === 'azucar'
      ? (declara ? RECHAZO_SALUD_AZUCAR : RECHAZO_SALUD_AZUCAR_PREGUNTA)
    : familia === 'tratamiento' ? RECHAZO_SALUD_TRATAMIENTO
    : reincide ? RECHAZO_SALUD_CORTO
    : (declara ? RECHAZO_SALUD_ESTANDAR : RECHAZO_SALUD_COMUN_PREGUNTA);
  return { familia, texto, declara };
}

/**
 * ── LA LÍNEA DE SALUD, DICHA A UN DISTRIBUIDOR ───────────────────────────────
 *
 * El socio que pregunta por salud NO está consultando por lo suyo: se está
 * preparando para lo que le van a preguntar a él. Patricia Reyes —docente
 * universitaria y socia desde julio— abrió con cáncer de colon y quimioterapia,
 * y recibió dos veces, letra por letra, la derivación escrita para un prospecto
 * que cuenta su condición. Ni siquiera era su caso.
 *
 * El NÚCLEO no se ablanda: la línea del INVIMA es la misma para todos, y con un
 * distribuidor importa más, porque lo que él crea permitido se lo va a decir a
 * sus clientes. Lo que cambia es a quién se le habla. Aprobado por el Director
 * el 10 sep 2026; verificado contra los dos guardarraíles de salida.
 */
export const RECHAZO_SALUD_SOCIO =
  'Esa pregunta le va a llegar seguido, así que le dejo la línea con claridad.\n\n' +
  'Nuestra línea está registrada ante el INVIMA como alimentos y suplementos dietarios, no como ' +
  'medicamentos. Eso fija lo que se puede decir: nada de enfermedades, tratamientos ni resultados ' +
  'de salud. La norma mira lo que quedó escrito, y lo escribe usted.\n\n' +
  'Lo que sí está de su lado, y es bastante: es el hongo más estudiado que existe, Gano Excel lleva ' +
  'treinta años fabricándolo, cada producto tiene su registro sanitario, y la gente lo incorpora a ' +
  'su rutina por energía y bienestar.\n\n' +
  'Y cuando alguien le cuente una condición concreta, hay una sola respuesta que les sirve a los ' +
  'dos: eso lo ve con su médico, que conoce su caso. Devolverle la decisión a quien sabe no le ' +
  'resta autoridad a usted — se la da.\n\n' +
  '¿Le armo la respuesta para la pregunta que le hicieron?';

/**
 * La segunda vez, dentro de la misma conversación. No se repite el texto
 * completo: ese fue exactamente el error con Patricia el 8 sep (dos veces el
 * mismo bloque). Se nombra lo dicho y se ofrece lo único que falta — la frase
 * concreta para responderle a esa persona.
 */
export const RECHAZO_SALUD_SOCIO_OTRA_VEZ =
  'La línea es la misma de hace un momento, y ahí no hay matices.\n\n' +
  'Si quiere, dígame con qué palabras se lo preguntaron y le armo la respuesta que sí puede dar.';

// Prefijos distintivos de los textos de arriba. Sirven para (a) detectar
// reincidencia en el historial y endurecer al rechazo corto, y (b) que el
// saneamiento del historial reconozca sus propias correcciones.
const PREFIJOS_RECHAZO = [
  'Esa pregunta le va a llegar seguido',
  'La línea es la misma de hace un momento',
  'Comprendo su objetivo, y me alegra que esté buscando opciones',
  'Comprendo su consulta, y hace muy bien en cuidar esos detalles',
  'Buena pregunta, y de las que más nos hacen',
  'Buena pregunta.\n',
  'Le respondo con cuidado, porque el tema lo merece',
  'Comprendo su consulta, y le agradezco la confianza de contármelo',
  'Le agradezco que me lo cuente. Los productos de Gano Excel',
  'Gracias por contármelo. Con un tratamiento en curso',
  'Le agradezco la confianza de contármelo',
  'Le entiendo, y ojalá pudiera decirle más',
  'Lo que me describe necesita atención inmediata',
  'El Ganoderma es uno de los hongos más estudiados del mundo',
  // Prefijos de los textos anteriores al 29 ago 2026: siguen en conversaciones
  // viejas de la base, y el saneamiento del historial los tiene que reconocer.
  'Le agradezco que me pregunte, y le voy a responder con franqueza',
  'Le agradezco la confianza de escribirme sobre esto',
  'Le entiendo, pero en temas de salud no le puedo orientar',
];

export function esRechazoSalud(texto: string): boolean {
  const t = (texto || '').trim();
  return PREFIJOS_RECHAZO.some((p) => t.startsWith(p));
}

/**
 * ¿Es el rechazo de la familia COMÚN (o su versión corta)? Solo estos cuentan
 * como reincidencia: la respuesta del peso no es un rechazo sino una respuesta,
 * y «diabetes» después de «adelgazar» recibía la versión endurecida como si la
 * persona estuviera insistiendo (prueba del 29 ago 2026).
 */
export function esRechazoSaludComun(texto: string): boolean {
  const t = (texto || '').trim();
  return t.startsWith('Comprendo su consulta, y le agradezco la confianza de contármelo')
    || t.startsWith('Buena pregunta.\n')
    || t.startsWith('Le agradezco que me lo cuente. Los productos de Gano Excel')
    || t.startsWith('Le entiendo, y ojalá pudiera decirle más')
    || t.startsWith('Le agradezco que me pregunte, y le voy a responder con franqueza')
    || t.startsWith('Le entiendo, pero en temas de salud no le puedo orientar');
}
