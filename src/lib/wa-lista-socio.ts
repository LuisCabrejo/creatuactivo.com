/**
 * Copyright © 2026 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * La LISTA DEL CAFÉ — a quién va a abordar el socio, y en qué va cada uno.
 *
 * ── LA PREGUNTA QUE LA ORIGINA ────────────────────────────────────────────────
 *
 *   «Hagamos una lista de cinco a diez personas a las que usted invitaría a tomar
 *    un café y que no le van a preguntar para qué.»
 *
 * Es la mejor pregunta del método de campo del Director. Identifica, sin
 * nombrarla, la relación COMUNAL —la que se sostiene en el vínculo y no en el
 * intercambio—, que es donde la confianza se transfiere. Y evita la lista de cien
 * nombres, que paraliza a cualquiera.
 *
 * ── POR QUÉ HAY QUE GUARDARLA ─────────────────────────────────────────────────
 *
 * Sin esto el socio le dicta un nombre suelto, Queswa redacta, y nadie lleva la
 * cuenta de a quién falta. Es exactamente la razón por la que la gente arranca y
 * se detiene a los tres contactos: no se le acabó la lista, se le perdió.
 *
 * ⚠️ NO es un CRM. No hay etapas ni puntajes: hay nombres, contexto y si ya se
 * escribió. Lo demás vive en `wa_acuerdos` y en el Dashboard.
 *
 * ⚠️ El nombre se guarda TAL COMO el socio lo dijo — «mi compadre Beto» y no
 * «Beto». Devolvérselo con sus palabras es lo que hace que reconozca su lista.
 */

export type ContactoLista = {
  id: number;
  nombre: string;
  contexto?: string | null;
  trato?: 'tu' | 'usted' | null;
  estado: string;
  orden: number;
};

/**
 * Los nombres que el socio dictó, en una sola respuesta.
 *
 * Acepta lo que la gente escribe de verdad: separados por coma, por «y», por
 * salto de línea, con viñetas o numerados. Se descarta lo que claramente no es un
 * nombre —frases largas, preguntas— para que un «déjame pensarlo» no entre como
 * contacto llamado así.
 */
export function extraerNombres(texto: string): string[] {
  if (!texto?.trim()) return [];
  return texto
    .split(/[\n,;]|(?:\s+y\s+)|(?:\s+—\s+)/)
    .map((s) => s.replace(/^\s*(?:\d+[.)]\s*|[-•*]\s*)/, '').trim())
    .filter((s) => {
      if (s.length < 2 || s.length > 40) return false;          // ni vacío ni una frase
      if (/[?¿!¡]/.test(s)) return false;                        // una pregunta no es un nombre
      if (s.split(/\s+/).length > 4) return false;               // «mi compadre Beto» sí; una oración no
      // ⚠️ La MAYÚSCULA es el filtro que de verdad separa. Sin ella entraban
      // «déjame pensarlo», «te digo mañana» y «la armo esta noche» — frases
      // cortas, sin signos, de pocas palabras, indistinguibles de un nombre por
      // longitud. Un nombre propio lleva mayúscula aunque el resto de la frase
      // vaya en minúscula: «mi compadre Beto», «a juan carlos Lozano».
      // Un socio que ve «déjame pensarlo» en su propia lista deja de confiar en
      // la herramienta, y con razón.
      if (!/[A-ZÁÉÍÓÚÑ]/.test(s)) return false;
      return /[a-záéíóúñ]/i.test(s);
    })
    .slice(0, 15);                                               // tope sano: la pregunta pide 5 a 10
}

/**
 * Guarda la lista. Si un nombre ya estaba, NO lo duplica ni lo pisa: la lista es
 * acumulativa y el socio puede agregar en varias tandas.
 */
export async function guardarLista(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  socioFp: string,
  nombres: string[],
  constructorId?: string | null,
): Promise<number> {
  if (!nombres.length) return 0;
  try {
    const { data: previos } = await supabase
      .from('wa_lista_socio').select('orden').eq('socio_fp', socioFp)
      .order('orden', { ascending: false }).limit(1);
    const desde = (previos?.[0]?.orden ?? 0) + 1;

    const filas = nombres.map((nombre, i) => ({
      socio_fp: socioFp, constructor_id: constructorId ?? null,
      nombre, orden: desde + i,
    }));

    // ⚠️ NO se usa `upsert` con `onConflict`: el índice único va sobre
    // `lower(nombre)`, que es una EXPRESIÓN, y PostgREST no puede apuntar a un
    // índice de expresión con nombres de columna — el upsert falla silencioso y
    // no entra nada. Se filtra a mano contra lo que ya está, que además deja
    // explícito lo que importa: repetir un nombre NO debe pisar el contexto que
    // ya se había capturado de esa persona.
    const { data: yaEstan } = await supabase
      .from('wa_lista_socio').select('nombre').eq('socio_fp', socioFp);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const conocidos = new Set(((yaEstan || []) as any[]).map((f) => f.nombre.toLowerCase()));
    const nuevas = filas.filter((f) => !conocidos.has(f.nombre.toLowerCase()));
    if (!nuevas.length) return 0;

    const { error } = await supabase.from('wa_lista_socio').insert(nuevas);
    if (error) { console.error('⚠️ [WA Lista] No se pudo guardar:', error); return 0; }

    console.log(`📋 [WA Lista] ${socioFp} → ${nuevas.length} contacto(s) nuevo(s)`);
    return nuevas.length;
  } catch (err) {
    console.error('⚠️ [WA Lista] Falló al guardar:', err);
    return 0;
  }
}

/** El siguiente a quien le toca, respetando el orden en que él los nombró. */
export async function siguienteContacto(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  socioFp: string,
): Promise<ContactoLista | null> {
  try {
    const { data } = await supabase
      .from('wa_lista_socio')
      .select('id, nombre, contexto, trato, estado, orden')
      .eq('socio_fp', socioFp).eq('estado', 'pendiente')
      .order('orden', { ascending: true }).limit(1).maybeSingle();
    return data ?? null;
  } catch { return null; }
}

/** Cómo va la lista. Es lo que Queswa le devuelve cuando pregunta. */
export async function resumenLista(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  socioFp: string,
): Promise<{ total: number; pendientes: number; enviados: number; siguiente?: string }> {
  try {
    const { data } = await supabase
      .from('wa_lista_socio').select('nombre, estado, orden')
      .eq('socio_fp', socioFp).order('orden', { ascending: true });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filas = (data || []) as any[];
    return {
      total:      filas.length,
      pendientes: filas.filter((f) => f.estado === 'pendiente').length,
      enviados:   filas.filter((f) => ['enviado', 'respondio'].includes(f.estado)).length,
      siguiente:  filas.find((f) => f.estado === 'pendiente')?.nombre,
    };
  } catch { return { total: 0, pendientes: 0, enviados: 0 }; }
}

/** Guarda lo que el socio contó de esa persona, y cómo se tratan. */
export async function anotarContexto(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  id: number,
  contexto: string,
  trato?: 'tu' | 'usted' | null,
): Promise<void> {
  try {
    await supabase.from('wa_lista_socio')
      .update({ contexto, ...(trato && { trato }), estado: 'redactado' })
      .eq('id', id);
  } catch (err) { console.error('⚠️ [WA Lista] No se pudo anotar el contexto:', err); }
}

/** El socio dice que ya lo mandó. Se marca y se pasa al siguiente. */
export async function marcarEnviado(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  id: number,
): Promise<void> {
  try {
    await supabase.from('wa_lista_socio')
      .update({ estado: 'enviado', enviado_at: new Date().toISOString() })
      .eq('id', id);
  } catch (err) { console.error('⚠️ [WA Lista] No se pudo marcar como enviado:', err); }
}

/** ¿El socio acaba de dictar una lista de nombres? */
export function pareceListaDeNombres(mensaje: string): boolean {
  const nombres = extraerNombres(mensaje);
  return nombres.length >= 3;
}

// ─────────────────────────────────────────────────────────────────────────────
// LOS NODOS DICTADOS DE LA LISTA
//
// Guardar, avanzar y resumir son operaciones, no conversación: tienen una sola
// respuesta correcta y el modelo solo puede empeorarlas. Van dictadas por el
// backend, como la apertura y el catálogo. Lo único que queda para el modelo es
// REDACTAR, que es lo que sí exige juicio.
// ─────────────────────────────────────────────────────────────────────────────

/** ¿El socio no sabe por dónde empezar? Entonces entra la pregunta del café. */
const RE_SIN_RUMBO = /\b(no se por donde|por donde (empiezo|arranco|comienzo)|no se a quien|a quien le escribo|no tengo a quien|no se me ocurre|ayudeme a (empezar|arrancar)|como empiezo)\b/;

/** El socio dice que ya mandó el de esta vuelta. */
const RE_YA_ENVIE = /\b(ya (se )?(lo|le)? ?(mande|envie|escribi|pase)|listo,? (ya )?(lo|le) (mande|envie|escribi)|ya (quedo|esta|fue)|hecho|enviado|ya le escribi)\b/;

/** Pregunta por el estado de su lista. */
const RE_COMO_VA_LISTA = /\b(como va (mi )?lista|que me falta|a quien(es)? (me )?falta|cuantos (me )?faltan|ver (mi )?lista|mi lista)\b/;

export function pideAyudaParaEmpezar(mensaje: string): boolean {
  return RE_SIN_RUMBO.test(normalizar(mensaje));
}
export function diceQueYaEnvio(mensaje: string): boolean {
  return RE_YA_ENVIE.test(normalizar(mensaje));
}
export function preguntaPorLaLista(mensaje: string): boolean {
  return RE_COMO_VA_LISTA.test(normalizar(mensaje));
}

function normalizar(t: string): string {
  return (t || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

/**
 * La pregunta del café.
 *
 * ⚠️ Se pide «como se le vengan» a propósito: pedir una lista ordenada o completa
 * es lo que hace que la persona la posponga. El orden en que salen ya es
 * información — el primero que nombra suele ser el que tiene más presente.
 */
export function preguntaDelCafe(): string {
  return (
    'Hagamos algo sencillo.\n\n' +
    'Piense en cinco o diez personas a las que usted invitaría a un café y que no le van a preguntar para qué. ' +
    'No tienen que ser las que crea que le van a decir que sí — las que tenga más cerca.\n\n' +
    'Escríbame los nombres, como se le vengan.'
  );
}

/** Confirmación de la lista, y arranque con el primero. */
export function listaGuardada(nombres: string[], primero: string): string {
  const lista = nombres.map((n) => `• ${n}`).join('\n');
  return (
    `Listo, quedaron ${nombres.length}:\n\n${lista}\n\n` +
    `Vamos de a uno. Empecemos por *${primero}*: cuénteme un poco de esa persona —a qué se dedica, en qué anda o cómo la conoce— ` +
    'y dígame cómo se tratan ustedes dos, ¿de tú o de usted?'
  );
}

/** Se marcó uno como enviado; sigue el próximo. */
export function siguienteDeLaLista(enviado: string, siguiente: string, faltan: number): string {
  return (
    `Anotado, *${enviado}* ya quedó.\n\n` +
    `${faltan === 1 ? 'Falta uno' : `Faltan ${faltan}`}. Sigue *${siguiente}*: cuénteme de esa persona y cómo se tratan ustedes dos.`
  );
}

/** La lista se acabó. */
export function listaTerminada(total: number): string {
  return (
    `Ya le escribió a los ${total} de su lista. Eso es más de lo que hace la mayoría en su primera semana.\n\n` +
    '¿Quiere sumar más nombres, o prefiere que revisemos quién ha respondido?'
  );
}

/** Cómo va la lista. */
export function resumenParaElSocio(
  r: { total: number; pendientes: number; enviados: number; siguiente?: string },
): string {
  if (!r.total) return preguntaDelCafe();
  if (!r.pendientes) return listaTerminada(r.total);
  return (
    `Su lista va así: ${r.enviados} de ${r.total} escritos.\n\n` +
    `El próximo es *${r.siguiente}*. ¿Le preparo el mensaje?`
  );
}
