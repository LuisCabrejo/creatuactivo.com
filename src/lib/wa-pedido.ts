/**
 * © CreaTuActivo.com — Propietario y confidencial.
 *
 * TOMA DE PEDIDO POR WHATSAPP — Queswa como mano derecha del distribuidor.
 *
 * Quien llega al canal viene referido por un distribuidor del equipo. Cuando esa
 * persona quiere COMPRAR PRODUCTO —no un paquete—, Queswa no la manda a una
 * oficina ni a una línea nacional: recibe el pedido, lo carga y se lo remite al
 * distribuidor, que coordina el pago y la entrega en persona. Es el mismo patrón
 * de la radicación (wa-radicacion.ts), con una sola diferencia: aquí lo único que
 * hace falta saber es QUÉ productos va a llevar. La ciudad, el flete y la forma de
 * entrega los define con quien le compartió el enlace — la mitad del mercado
 * orgánico vive en la misma ciudad del socio y eso se resuelve en persona
 * (Director, 27 ago 2026).
 *
 * Nació de la conversación de Milena (27 ago 2026): quiso una caja, el modelo le
 * improvisó un formulario de cuatro datos para «abrir código», ese texto activó el
 * trámite del PAQUETE («¿cuál es su nombre completo?»), y al pedir un asesor
 * recibió una promesa que nadie iba a cumplir. Salió sin comprar.
 *
 * Tres reglas de diseño:
 * - Los textos de este nodo NO deben parecerse a los de la radicación: el cierre
 *   de paquete reconoce «nombre completo, como aparece» y «número de
 *   identificación», y si un pedido los usa, el trámite equivocado se abre solo.
 * - Al socio se le nombra SIEMPRE por su nombre. «El distribuidor» o «el socio»
 *   son etiquetas; «Luis Cabrejo» es una persona que la va a llamar.
 * - Las oficinas son información de socio. Al prospecto se le da la razón real
 *   —atienden a quien ya tiene código— y la puerta: su código lo abre el socio.
 */

import { PRODUCTOS_WA, detectarProducto, productoDelHilo, type ProductoWA } from '@/lib/wa-productos';
import { sendTemplate } from '@/lib/wa-channel';
import { enlaceCatalogo } from '@/lib/wa-onboarding';

export interface LineaPedido { producto: ProductoWA; cantidad: number }

export interface SocioPedido {
  nombre?: string
  whatsapp?: string
  constructorId?: string
  slug?: string | null
}

function norm(t: string): string {
  return t.toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const cop = (n: number) => `$${n.toLocaleString('es-CO')} COP`;

/** Primer nombre, sin emojis ni adornos («Milena❤️» → «Milena»). */
export function nombreCorto(nombre?: string | null): string | undefined {
  if (!nombre) return undefined;
  // Solo letras: fuera emojis, selectores de variación (U+FE0F) y uniones (U+200D),
  // que se cuelan pegados al nombre del perfil («Milena❤️»).
  const limpio = nombre.normalize('NFC').replace(/[^\p{L}\s'-]/gu, '').trim().split(/\s+/)[0];
  if (!limpio || /^constructor$/i.test(limpio)) return undefined;
  return limpio.charAt(0).toUpperCase() + limpio.slice(1);
}

// ─── Detección ───────────────────────────────────────────────────────────────

// Lo que es del paquete, no del producto: eso lo atiende la radicación.
const RE_PAQUETE = /paquete|\besp[- ]?[123]\b|kit de inicio|afiliar|inscribir|vincular|ini?[cs]iar|arrancar|empe[zs]ar|comen[zs]ar con/i;

const RE_VERBO_COMPRA =
  /(quiero|quisiera|deseo|me gustar[ií]a|necesito|voy a|puedo|c[oó]mo|como|d[oó]nde|donde)\s+(comprar|pedir|encargar|ordenar|adquirir|conseguir|llevar|pido|compro|encargo|hacer\s+(el\s+|un\s+|mi\s+)?pedido|hago\s+(el\s+|un\s+|mi\s+)?pedido)/i;

const RE_COMPRA_DIRECTA =
  /\b(solo|s[oó]lo|nada m[aá]s)\s+quiero\b|quiero\s+(una|un|dos|tres|cuatro|cinco|\d+)\s+(caja|frasco|tarro|unidad|sobre)|me\s+(manda|env[ií]a|vende|lleva|trae)\s+(una|un|dos|tres|cuatro|\d+)|\b(v[eé]ndame|mand[ae]me|env[ií]eme)\b|hacer\s+(el\s+|un\s+|mi\s+)?pedido|hago\s+(el\s+|un\s+|mi\s+)?pedido|c[oó]mo\s+(pido|pedido|compro)|d[oó]nde\s+(pido|compro)|quiero\s+(comprar|pedir|encargar)|me interesa comprar|comprar\s+(una|un)\s+(caja|frasco|tarro)/i;

/**
 * ¿Quiere comprar PRODUCTO? Un verbo de compra sin vocabulario de paquete, o un
 * producto nombrado junto a un «quiero». Preguntar solo el precio no es comprar:
 * eso lo responde el catálogo.
 */
export function detectarIntencionCompra(texto: string): boolean {
  const t = texto.trim();
  if (!t || RE_PAQUETE.test(t)) return false;
  if (/cu[aá]nto\s+(vale|cuesta|sale)/i.test(t) && !/quiero|comprar|pedir|llevar/i.test(t)) return false;
  if (RE_VERBO_COMPRA.test(t) || RE_COMPRA_DIRECTA.test(t)) return true;
  return detectarProducto(t) !== null && /\b(quiero|quisiera|me llevo|me interesa|deme|d[eé]me|mande)\b/i.test(t);
}

/** El bot está a la espera de los productos del pedido. */
export const RE_PIDIO_PRODUCTOS = /qu[eé] productos va a llevar|enseguida le cargo su compra|no logr[eé] identificar/i;
/** El pedido ya quedó cargado en esta conversación. */
export const RE_PEDIDO_CARGADO = /su pedido qued[oó] cargado/i;

export function pedidoAbierto(ultimoBot: string): boolean {
  return RE_PIDIO_PRODUCTOS.test(ultimoBot);
}

export function pedidoCargado(historial: { role: string; content: string }[]): boolean {
  return historial.some((m) => m.role === 'assistant' && RE_PEDIDO_CARGADO.test(m.content));
}

// ─── Extracción de líneas ────────────────────────────────────────────────────

const NUMEROS: Record<string, number> = {
  un: 1, una: 1, uno: 1, dos: 2, tres: 3, cuatro: 4, cinco: 5, seis: 6,
  siete: 7, ocho: 8, nueve: 9, diez: 10, docena: 12,
};

function cantidadJunto(t: string, pos: number, largo: number): number {
  const antes = t.slice(Math.max(0, pos - 30), pos);
  const m = antes.match(/(\d+|un|una|uno|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez|docena)\s*(cajas?|frascos?|tarros?|unidades?|sobres?|de|del|x)?\s*(de\s+|del\s+)?$/);
  if (m) return NUMEROS[m[1]] ?? Math.max(1, Math.min(50, parseInt(m[1], 10)));
  const despues = t.slice(pos + largo, pos + largo + 12);
  const d = despues.match(/^\s*(x|por)\s*(\d+)/);
  if (d) return Math.max(1, Math.min(50, parseInt(d[2], 10)));
  return 1;
}

/**
 * Los productos que nombra el mensaje, con su cantidad. Varios a la vez
 * («dos de 3 en 1 y una de cápsulas»). Si un nombre contiene a otro
 * («luvoco fuerte» contiene «luvoco»), gana el específico.
 */
export function extraerLineasPedido(texto: string): LineaPedido[] {
  const t = norm(texto);
  if (!t) return [];
  const hallados: { p: ProductoWA; pos: number; largo: number }[] = [];

  for (const p of PRODUCTOS_WA) {
    const claves = [norm(p.nombre), ...p.alias.map(norm)].filter((k) => k.length >= 4);
    let mejor: { pos: number; largo: number } | null = null;
    for (const k of claves) {
      const i = t.indexOf(k);
      if (i >= 0 && (!mejor || i < mejor.pos || (i === mejor.pos && k.length > mejor.largo))) {
        mejor = { pos: i, largo: k.length };
      }
    }
    if (mejor) hallados.push({ p, ...mejor });
  }

  const especificos = hallados.filter((a) => !hallados.some((b) =>
    b !== a
    && b.pos <= a.pos && b.pos + b.largo >= a.pos + a.largo
    && b.largo > a.largo));

  return especificos
    .sort((a, b) => a.pos - b.pos)
    .map(({ p, pos, largo }) => ({ producto: p, cantidad: cantidadJunto(t, pos, largo) }));
}

/**
 * Las líneas del pedido: lo que dice el mensaje, o —si el mensaje solo trae el
 * verbo («quiero comprarlo»)— el producto del que venía hablando.
 */
export function lineasDelPedido(
  texto: string,
  historial: { role: string; content: string }[],
): LineaPedido[] {
  const propias = extraerLineasPedido(texto);
  if (propias.length > 0) return propias;
  const delHilo = productoDelHilo(historial);
  if (!delHilo) return [];
  const t = norm(texto);
  const m = t.match(/\b(\d+|un|una|uno|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez)\b/);
  const cantidad = m ? (NUMEROS[m[1]] ?? Math.max(1, Math.min(50, parseInt(m[1], 10)))) : 1;
  return [{ producto: delHilo, cantidad }];
}

export function totalPedido(lineas: LineaPedido[]): number {
  return lineas.reduce((s, l) => s + l.producto.precioCOP * l.cantidad, 0);
}

// ─── Copy ────────────────────────────────────────────────────────────────────

export function pedirProductos(nombre?: string): string {
  const saludo = nombre ? `Claro que sí, ${nombre}.` : 'Claro que sí.';
  return `${saludo} Enseguida le cargo su compra.\n\n¿Qué productos va a llevar?`;
}

export function noEntendiProductos(): string {
  return 'No logré identificar el producto. ¿Me dice cuál quiere, tal como aparece en el catálogo? Por ejemplo: Ganocafé 3 en 1, Ganocafé Clásico, Cápsulas Ganoderma…';
}

function lineaTexto(l: LineaPedido): string {
  const pres = l.producto.presentacion ? ` (${l.producto.presentacion})` : '';
  return `*${l.cantidad} × ${l.producto.nombre}*${pres} · ${cop(l.producto.precioCOP * l.cantidad)}`;
}

/** Resumen corto para la plantilla al socio (sin saltos de línea: Meta los rechaza). */
export function resumenLineas(lineas: LineaPedido[]): string {
  return lineas.map((l) => `${l.cantidad} × ${l.producto.nombre}`).join(' · ');
}

export function confirmarPedido(
  lineas: LineaPedido[],
  socio: SocioPedido | null,
  nombre?: string,
): string {
  const quien = socio?.nombre || 'El equipo de creatuactivo.com';
  const encabezado = nombre ? `Listo, ${nombre}. Su pedido quedó cargado:` : 'Listo. Su pedido quedó cargado:';
  const cuerpo = lineas.map(lineaTexto).join('\n');
  const total = lineas.length > 1 ? `\nTotal: *${cop(totalPedido(lineas))}*` : '';

  return [
    encabezado,
    '',
    cuerpo + total,
    '',
    `${quien} ya lo recibió y se comunica con usted por este mismo medio para coordinar el pago y la entrega.`,
    '',
    `Aquí tiene el catálogo completo, por si quiere ver las demás líneas: ${enlaceCatalogo(socio?.slug)} — y si le queda alguna duda mientras lo mira, toque el orbe de WhatsApp y seguimos aquí.`,
    '',
    '¿Le queda alguna pregunta que le pueda responder ahora?',
  ].join('\n');
}

// ─── El envío ────────────────────────────────────────────────────────────────

export const RE_PREGUNTA_ENVIO =
  /env[ií]o|envian|env[ií]an|domicilio|me lo (mandan|env[ií]an|traen|llevan)|llega a mi|flete|servientrega|cu[aá]nto (vale|cuesta|demora|tarda) (el )?env|c[oó]mo (me )?(llega|lo recibo)|contra ?entrega/i;

export function detectarPreguntaEnvio(texto: string): boolean {
  return RE_PREGUNTA_ENVIO.test(texto);
}

export function respuestaEnvio(socio: SocioPedido | null): string {
  const quien = socio?.nombre || 'el equipo de creatuactivo.com';
  return `La entrega la coordina directamente con ${quien} cuando se comunique con usted: si están en la misma ciudad, suele resolverse en persona; si no, Gano Excel despacha por Servientrega y normalmente llega de un día para otro.`;
}

// ─── Las oficinas, para el prospecto ─────────────────────────────────────────

export const RE_PREGUNTA_OFICINA =
  /\boficinas?\b|\bsedes?\b|punto de venta|d[oó]nde (queda|quedan|es|est[aá]|est[aá]n|los? (compro|consigo|venden))|la direcci[oó]n\b|voy (directo|directamente)|ir personalmente|pasar por/i;

export function detectarPreguntaOficina(texto: string): boolean {
  // «dirección de envío» es del pedido, no de la oficina.
  if (/direcci[oó]n de (env[ií]o|entrega)/i.test(texto)) return false;
  return RE_PREGUNTA_OFICINA.test(texto);
}

const CIUDADES_SEDE = ['Bogotá', 'Medellín', 'Cali', 'Pereira', 'Barranquilla', 'Bucaramanga', 'Cúcuta', 'Villavicencio'];
const CIUDADES = [
  ...CIUDADES_SEDE, 'Cartagena', 'Santa Marta', 'Manizales', 'Armenia', 'Ibagué', 'Neiva', 'Pasto',
  'Montería', 'Valledupar', 'Sincelejo', 'Popayán', 'Tunja', 'Riohacha', 'Florencia', 'Yopal', 'Quibdó',
];

export function detectarCiudad(texto: string): string | null {
  const t = norm(texto);
  return CIUDADES.find((c) => t.includes(norm(c))) ?? null;
}

/** El bot ya explicó lo de las sedes en esta conversación. */
export const RE_OFICINA_YA_EXPLICADA = /atiende(n)? a quienes ya tienen su c[oó]digo|la direcci[oó]n se la da/i;

export function respuestaOficinaProspecto(
  socio: SocioPedido | null,
  ciudad: string | null,
  hayPedido: boolean,
  insiste: boolean,
): string {
  const quien = socio?.nombre || 'el equipo de creatuactivo.com';
  const primerPedido = hayPedido ? 'este primer pedido' : 'su primer pedido';

  if (insiste) {
    return `La dirección se la da ${quien} al abrirle el código, y ahí mismo coordinan la entrega.`;
  }
  if (ciudad && CIUDADES_SEDE.includes(ciudad)) {
    return `Qué bien que esté en ${ciudad}. La sede de allá atiende a quienes ya tienen su código de cliente, y el suyo lo abre ${quien} con ${primerPedido}. Ahí mismo le indica la dirección y coordinan si lo recoge allá o se lo envían.`;
  }
  const destino = ciudad ? ` hasta ${ciudad}` : '';
  return `Las sedes de Gano Excel atienden a quienes ya tienen su código de cliente, y el suyo lo abre ${quien} con ${primerPedido}. Ahí mismo coordinan la entrega${destino}, y si prefiere recogerlo en una sede, ${quien} le indica cuál le queda más cerca.`;
}

// ─── «Quiero hablar con una persona» ─────────────────────────────────────────

export const RE_PIDE_PERSONA =
  /\basesor(a)?\b|hablar con (alguien|una persona|un humano|una humana|un[ao] asesor|luis|el socio|la socia|el distribuidor)|una persona real|que me llame|me pueden? llamar|ll[aá]meme|prefiero hablar con|cont[aá]ct(en)?me|comun[ií]queme con|pasarme con|eres? (un )?(robot|bot|m[aá]quina)/i;

export function detectarPidePersona(texto: string): boolean {
  return RE_PIDE_PERSONA.test(texto);
}

export function respuestaPersona(socio: SocioPedido | null): string {
  const quien = socio?.nombre || 'el equipo de creatuactivo.com';
  return `Claro. Le acabo de avisar a ${quien}; se comunica con usted por este mismo medio. Mientras tanto, aquí sigo si le queda alguna pregunta.`;
}

// ─── Autorización de marketing ───────────────────────────────────────────────
//
// Meta solo permite mensajes de promoción a quien dio su consentimiento, y la
// Ley 1581 (habeas data) exige que sea explícito y quede registrado. Por eso
// es SU propio turno, con una sola pregunta, y el «sí» se guarda con fecha en
// la ficha del prospecto (`marketing_optin`). Sin ese registro no hay campaña.

export const RE_OFRECIO_OPTIN = /quiere que le avise por aqu[ií]/i;

export function optinYaOfrecido(historial: { role: string; content: string }[]): boolean {
  return historial.some((m) => m.role === 'assistant' && RE_OFRECIO_OPTIN.test(m.content));
}

/** La persona cierra la conversación: «no», «gracias», «listo», «eso es todo». */
export function esCierreDeConversacion(texto: string): boolean {
  return /^(no|no,? gracias|no,? por ahora|por ahora no|gracias|muchas gracias|mil gracias|listo|listo,? gracias|eso es todo|nada m[aá]s|ninguna|ok|vale|perfecto|bueno|est[aá] bien)[\s.!,]*$/i.test(texto.trim());
}

export function ofrecerOptin(nombre?: string): string {
  const saludo = nombre ? `Perfecto, ${nombre}.` : 'Perfecto.';
  return `${saludo} Una última cosa: cuando haya promociones o productos nuevos, ¿quiere que le avise por aquí? Responda *sí* y queda en la lista.`;
}

export function leerRespuestaOptin(texto: string): boolean | null {
  const t = texto.trim();
  if (/^(s[ií]|claro|dale|por supuesto|ok(ay)?|listo|bueno|de una|me parece|s[ií],? (claro|por favor|gracias)|s[ií] quiero|quiero)[\s.!,]*$/i.test(t)) return true;
  if (/^(no|no,? gracias|no quiero|mejor no|por ahora no|no por ahora|prefiero que no)[\s.!,]*$/i.test(t)) return false;
  return null;
}

export function respuestaOptin(acepta: boolean): string {
  return acepta
    ? 'Listo. Le aviso cuando haya algo que valga la pena. Que tenga un buen día.'
    : 'Entendido. Aquí sigo cuando me necesite. Que tenga un buen día.';
}

// ─── Persistencia y aviso ────────────────────────────────────────────────────

const WHATSAPP_EQUIPO = () => process.env.WHATSAPP_EQUIPO || '573206805737';

export async function registrarPedido(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  datos: {
    fingerprint: string
    whatsapp: string
    nombre?: string
    lineas: LineaPedido[]
    socio: SocioPedido | null
  },
): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from('wa_pedidos')
      .insert({
        fingerprint_id: datos.fingerprint,
        whatsapp:       datos.whatsapp,
        nombre:         datos.nombre ?? null,
        lineas:         datos.lineas.map((l) => ({
          slug: l.producto.slug, nombre: l.producto.nombre, cantidad: l.cantidad, precio_cop: l.producto.precioCOP,
        })),
        total_cop:      totalPedido(datos.lineas),
        constructor_id: datos.socio?.constructorId ?? null,
        socio:          datos.socio?.nombre ?? null,
        estado:         'pendiente',
      })
      .select('id')
      .single();
    if (error) throw error;
    return (data?.id as string) ?? null;
  } catch (err) {
    console.error('❌ [Pedido WA] No se pudo registrar el pedido:', err);
    return null;
  }
}

/**
 * Aviso al socio y al equipo con la plantilla `pre_afiliacion_nueva` (UTILITY,
 * aprobada — el socio casi siempre está fuera de la ventana de 24 h). Sus cuatro
 * campos: a quién se saluda · quién · qué · dónde/cómo. Sin saltos de línea.
 */
export async function avisarPedido(
  lineas: LineaPedido[],
  whatsapp: string,
  nombre: string | undefined,
  socio: SocioPedido | null,
): Promise<void> {
  const quien = `${nombre || 'Sin nombre'} (${whatsapp}) · PEDIDO`;
  const que   = resumenLineas(lineas).slice(0, 200);
  const como  = `Total ${cop(totalPedido(lineas))} — coordinar pago y entrega`;

  if (socio?.whatsapp) {
    try {
      const r = await sendTemplate(socio.whatsapp, 'pre_afiliacion_nueva', 'es', [
        socio.nombre?.split(/\s+/)[0] || 'Socio', quien, que, como,
      ]);
      console.log(`📨 [Pedido WA] Aviso al socio ${socio.nombre}: ${r.ok ? 'enviado' : r.error}`);
    } catch (err) {
      console.error('❌ [Pedido WA] No se pudo avisar al socio:', err);
    }
  }
  try {
    const r = await sendTemplate(WHATSAPP_EQUIPO(), 'pre_afiliacion_nueva', 'es', [
      'equipo', quien, que, socio ? `${como} (atiende ${socio.nombre})` : `${como} — SIN SOCIO`,
    ]);
    console.log(`📨 [Pedido WA] Aviso al equipo: ${r.ok ? 'enviado' : r.error}`);
  } catch (err) {
    console.error('❌ [Pedido WA] No se pudo avisar al equipo:', err);
  }
}

/** Alguien pidió hablar con una persona: el socio se entera de verdad. */
export async function avisarPidePersona(
  whatsapp: string,
  nombre: string | undefined,
  socio: SocioPedido | null,
  contexto: string,
): Promise<void> {
  const quien = `${nombre || 'Sin nombre'} (${whatsapp}) · PIDE HABLAR CON UNA PERSONA`;
  const que   = contexto.slice(0, 160) || '—';
  const destinos: [string, string][] = [];
  if (socio?.whatsapp) destinos.push([socio.whatsapp, socio.nombre?.split(/\s+/)[0] || 'Socio']);
  destinos.push([WHATSAPP_EQUIPO(), 'equipo']);
  for (const [to, saludo] of destinos) {
    try {
      const r = await sendTemplate(to, 'pre_afiliacion_nueva', 'es', [saludo, quien, que, 'contactar por WhatsApp']);
      console.log(`📨 [Pedido WA] Aviso «pide persona» a ${saludo}: ${r.ok ? 'enviado' : r.error}`);
    } catch (err) {
      console.error('❌ [Pedido WA] No se pudo avisar «pide persona»:', err);
    }
  }
}
