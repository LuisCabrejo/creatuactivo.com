/**
 * Copyright © 2026 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * El PASE — el enlace que un prospecto comparte, sin dejar de ser el enlace del socio.
 *
 * ── QUÉ PROBLEMA RESUELVE ─────────────────────────────────────────────────────
 *
 * «Lo tengo que hablar con mi esposa» es el callejón sin salida clásico: él le
 * cuenta a medias lo que entendió a medias, y la conversación muere en la cocina.
 * El pase le da a él un enlace **a su nombre** para compartirlo, y Queswa atiende
 * a quien lo abra.
 *
 * Hace tres cosas a la vez, y la tercera es la que lo justifica:
 *   1. Ella entra por mano de él, no de un desconocido.
 *   2. Al compartirlo, él hace el trabajo del negocio ANTES de comprarlo — y
 *      descubre que es mandar un enlace.
 *   3. Ve a Queswa atender a alguien suyo: el argumento y la demostración pasan a
 *      ser el mismo objeto, sobre su propio caso.
 *
 * ── POR QUÉ NO ES UN SLUG NUEVO ───────────────────────────────────────────────
 *
 * La tentación era darle al prospecto un enlace propio, tipo `/{su-slug}/queswa`.
 * Eso obliga a crear una identidad para alguien que todavía no compró, y abre la
 * pregunta de a quién pertenece quien entre por ahí.
 *
 * **No hace falta.** El pase es el MISMO enlace del socio, con un marcador que
 * apunta al registro del prospecto que lo compartió. La atribución no se mueve un
 * milímetro: quien entra es del socio, igual que si hubieran reenviado el enlace
 * pelado — que es lo que iban a hacer de todos modos. El marcador no agrega
 * permisos: agrega MEMORIA.
 *
 * Y por eso no abre superficie nueva de abuso. Hoy cualquiera puede reenviar el
 * enlace del socio a quien quiera; esto no cambia lo que se puede hacer, cambia
 * lo que nosotros sabemos cuando ocurre.
 *
 * ── LA FORMA DEL MARCADOR, Y POR QUÉ LLEVA DOS PUNTOS ─────────────────────────
 *
 * `resolverPatrocinador()` busca en el texto entrante palabras unidas por guion
 * (`luis-cabrejo`, `luis-cabrejo-1288`). Un marcador con guion —`de-k7m2c9`— se
 * le parecería lo suficiente como para entrar en su barrido de candidatos.
 *
 * Por eso el separador es `:` y el token lleva dígitos: `de:k7m2c9` es invisible
 * para ese patrón. Las dos resoluciones conviven en el mismo mensaje sin pisarse.
 *
 * ⚠️ El marcador se RETIRA del texto antes de que el mensaje llegue al motor. Si
 * no, el modelo lo lee, intenta interpretarlo y termina enseñándole las tripas a
 * la persona — ya pasó con el contexto recuperado (prueba del Director, 21 ago).
 */

/**
 * Alfabeto sin caracteres que se confunden al dictar o al leer en un chat:
 * fuera 0/O, 1/l/I. El token viaja dentro de un enlace, pero alguien lo va a
 * leer en voz alta alguna vez.
 */
const ALFABETO = 'abcdefghjkmnpqrstuvwxyz23456789';
const LARGO_TOKEN = 6;

/** Token nuevo. 31^6 ≈ 887 millones: de sobra, y corto de leer. */
export function nuevoTokenDePase(): string {
  let out = '';
  const bytes = new Uint8Array(LARGO_TOKEN);
  crypto.getRandomValues(bytes);
  for (const b of bytes) out += ALFABETO[b % ALFABETO.length];
  return out;
}

/** El marcador tal como viaja en el texto del enlace. */
export function marcadorDePase(token: string): string {
  return `de:${token}`;
}

/** Extrae el token del texto entrante, o `null` si no hay marcador. */
export function extraerTokenDePase(texto: string | undefined): string | null {
  if (!texto) return null;
  const m = texto.toLowerCase().match(/\bde:([a-z2-9]{6})\b/);
  return m ? m[1] : null;
}

/**
 * Quita el marcador del texto antes de mandarlo al motor.
 *
 * ⚠️ Devuelve el texto ORIGINAL si al quitar el marcador no queda nada: un
 * mensaje vacío rompe el turno, y es mejor que el modelo vea un texto raro a que
 * no vea ninguno.
 */
export function limpiarMarcador(texto: string): string {
  const limpio = texto.replace(/\s*\bde:[a-zA-Z2-9]{6}\b\s*/g, ' ').replace(/\s{2,}/g, ' ').trim();
  return limpio.length ? limpio : texto;
}

/**
 * El enlace que el prospecto comparte.
 *
 * Es un `wa.me` y no una página web a propósito: quien lo abra tiene que caer en
 * la conversación, no en un sitio. Es la misma decisión de canal de todo el
 * proyecto — lo que la persona tenga que ver, lo ve conversando.
 *
 * El texto prellenado lleva las dos señales: el slug del socio, que resuelve la
 * ATRIBUCIÓN, y el marcador, que resuelve QUIÉN LO COMPARTIÓ.
 */
export function enlaceDePase(numeroWaba: string, slugDelSocio: string, token: string): string {
  const numero = numeroWaba.replace(/\D/g, '');
  const texto  = `Hola, vengo del enlace de ${slugDelSocio}. ${marcadorDePase(token)}`;
  return `https://wa.me/${numero}?text=${encodeURIComponent(texto)}`;
}

export type Compartidor = {
  fingerprintId: string;
  nombre?: string;
  telefono?: string;
};

/**
 * Resuelve a quién pertenece un token, leyendo el registro del prospecto.
 *
 * Deliberadamente **no falla hacia arriba**: si el token no existe o la consulta
 * revienta, devuelve `null` y la conversación sigue como una cualquiera. Perder
 * el nombre de quien compartió cuesta un saludo más frío; abortar el turno cuesta
 * la persona entera.
 */
export async function resolverCompartidor(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  token: string | null,
): Promise<Compartidor | null> {
  if (!token) return null;
  try {
    const { data } = await supabase
      .from('prospects')
      .select('fingerprint_id, device_info')
      .eq('device_info->>share_token', token)
      .maybeSingle();

    if (!data) return null;
    return {
      fingerprintId: data.fingerprint_id,
      nombre:        data.device_info?.name,
      telefono:      data.device_info?.phone,
    };
  } catch (err) {
    console.error('⚠️ [WA Pase] No se pudo resolver el compartidor:', err);
    return null;
  }
}

/**
 * Devuelve el token de este prospecto, creándolo la primera vez.
 *
 * ⚠️ Es IDEMPOTENTE a propósito: si la persona vuelve a pedir el enlace, recibe
 * el mismo. Un token nuevo por cada pedido dejaría enlaces vivos apuntando al
 * mismo sitio y volvería inútil el conteo de por dónde entró cada quien.
 */
export async function tokenDelProspecto(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  fingerprintId: string,
): Promise<string | null> {
  try {
    const { data } = await supabase
      .from('prospects')
      .select('device_info')
      .eq('fingerprint_id', fingerprintId)
      .maybeSingle();

    const existente = data?.device_info?.share_token;
    if (existente) return existente;

    const token = nuevoTokenDePase();
    // Merge sin pisar: `device_info` lleva canal, teléfono, nombre y métricas.
    const { error } = await supabase
      .from('prospects')
      .update({ device_info: { ...(data?.device_info ?? {}), share_token: token } })
      .eq('fingerprint_id', fingerprintId);

    if (error) {
      console.error('⚠️ [WA Pase] No se pudo guardar el token:', error);
      return null;
    }
    return token;
  } catch (err) {
    console.error('⚠️ [WA Pase] Falló la generación del token:', err);
    return null;
  }
}

/**
 * El aviso que recibe quien compartió, cuando la persona ya conversó.
 *
 * ⚠️ Se avisa sobre la CONVERSACIÓN, nunca sobre el clic. Decirle a alguien «su
 * esposa abrió el enlace» lo pone a vigilarla y a ella la incomoda si se entera;
 * decirle que ya hablaron y qué quedó pendiente es más cálido, más útil, y abre
 * la puerta a la conversación entre los tres, que es donde esto se cierra.
 */
export function avisoAlCompartidor(nombreDeQuienEntro: string | undefined): string {
  const quien = nombreDeQuienEntro?.split(/\s+/)[0];
  return quien
    ? `Ya conversé con ${quien}. Cuando quieran lo vemos entre los tres — dígame qué día les queda bien.`
    : `Ya conversé con la persona a la que le compartió el enlace. Cuando quieran lo vemos entre los tres — dígame qué día les queda bien.`;
}
