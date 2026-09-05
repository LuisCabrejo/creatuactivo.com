/**
 * Copyright © 2026 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * EL CONDUCTOR COMPARTIDO — los nodos dictados que son los mismos en WhatsApp
 * y en la web.
 *
 * POR QUÉ EXISTE (Director, 4 sep 2026): la web de creatuactivo.com es el
 * respaldo del canal de WhatsApp si Meta lo cierra, y un respaldo que responde
 * distinto no es respaldo. Hasta hoy estos nodos vivían dentro del webhook,
 * amarrados a sus variables locales y a la forma de enviar de Meta (texto,
 * tarjeta del Flow). Aquí se separan las dos cosas: el conductor DECIDE y
 * DICTA —qué nodo aplica y con qué texto—, y cada canal ENTREGA como sabe:
 * el webhook manda el texto y, si hay simulador, la tarjeta del Flow; el motor
 * de la web devuelve el texto y, si hay simulador, un enlace al deck.
 *
 * Lo que vive aquí (capa 3, primer lote):
 *   · 2.24  el enlace al catálogo con el ref del socio
 *   · 2.34  «¿qué es eso del plan de dos ciclos?» → NIVELES_01 tal cual
 *   · 2.355 el «sí» a las ganancias por la compra de paquetes → el bono GEN5
 *   · 2.36  el «sí» a «¿le muestro cómo se vincula?» → los datos de la radicación
 *   · 2.35  el «sí» a la tabla nivel por nivel → NIVELES_02 tal cual
 *   · 2.4   el simulador cuando lo piden o aceptan la oferta
 *   · 2.44  el «sí» tras las respuestas de salud
 *
 * Segundo lote (5 sep 2026):
 *   · 2.25  la foto de una línea, del portafolio o de un producto
 *   · 2.46  «quiero hablar con una persona» → el socio se entera de verdad
 *   · 2.47  el envío, que se acuerda con el socio
 *   · 2.48  las sedes, para el prospecto
 *
 * Los números son los del webhook, para que quien venga de allá los reconozca.
 * Lo que sigue siendo solo del canal (botones de apertura, pareja, pedido, la
 * lista del socio, la autorización de marketing, ambivalencia) se va moviendo
 * nodo por nodo a medida que se toque.
 *
 * ⚠️ REGLA: aquí no hay `sendText` ni `StreamingTextResponse`. Si un nodo
 * necesita saber por dónde entrega, es que la decisión está mal partida.
 */

import { pedirDatos, CLAVES_CANAL, type ClaveRadicacion, type DatosRadicacion } from '@/lib/wa-radicacion';
import {
  seguimientoSalud, esAceptacion, RE_OFERTA_CATALOGO_SALUD, RE_OFERTA_FOTO_PRODUCTO,
  detectarPidePersona, respuestaPersona, avisarPidePersona,
  detectarPreguntaEnvio, respuestaEnvio,
  detectarPreguntaOficina, detectarCiudad, respuestaOficinaProspecto, RE_OFICINA_YA_EXPLICADA, diceDondeVive,
  type SocioPedido,
} from '@/lib/wa-pedido';
import { pideEnlaceCatalogo, mensajeEnlaceCatalogo } from '@/lib/wa-onboarding';
import {
  pideImagen, detectarProducto, cafeGenericoAFoto, productoDelHilo, pieDeFoto, urlImagen,
  esSoloPedidoDeImagen, seguimientoFoto, detectarFamilia, familiaOfrecida, preguntoCualLinea,
  esAceptacionCorta, urlImagenFamilia, pieDeFotoFamilia, FAMILIAS_WA,
} from '@/lib/wa-productos';

export type PaisConductor = 'CO' | 'US' | 'XX';
export type CanalConductor = 'whatsapp' | 'web';
export type PantallaSimulador = 'INICIO' | 'RENTA_MENU' | 'RENTA_DIEZ' | 'GEN_MENU' | 'NIVELES';

export interface Turno { role: string; content: string }

export interface ContextoConductor {
  canal: CanalConductor;
  mensaje: string;
  historial: Turno[];
  pais: PaisConductor;
  /** «Luis Cabrejo» — nombre corto del socio, para los textos dictados. */
  socioNombre?: string;
  /** El hilo es el de Los 12 Niveles (ficha o historial). Lo computa el canal. */
  hiloDoceNiveles: boolean;
  /** El mensaje es la respuesta de un Flow (solo WhatsApp). */
  vieneDelSimulador?: boolean;
  /** WhatsApp: hay `WHATSAPP_FLOW_SIMULADOR_ID`. Web: siempre, porque es un enlace. */
  simuladorDisponible: boolean;
  /** Quien escribe es un socio, no un prospecto (solo WhatsApp lo sabe). */
  socioQueEscribe?: boolean;
  /** Cuatro en WhatsApp; cinco en la web cuando no se conoce el teléfono. */
  clavesRadicacion?: readonly ClaveRadicacion[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any;
  /** Tenant de `nexus_documents` del que se leen los candados. */
  tenant: string;
}

export interface SimuladorDictado {
  pantalla: PantallaSimulador;
  /** El cuerpo de la tarjeta (WhatsApp) o la línea que precede al enlace (web). */
  cuerpo: string;
  primeraVez: boolean;
}

export interface RespuestaConductor {
  /** Número y nombre del nodo, para el log. */
  nodo: string;
  texto?: string;
  simulador?: SimuladorDictado;
  /** Lo que se guarda como turno del asistente cuando difiere del texto (el marcador del simulador). */
  persistir?: string;
  marcarHiloDoceNiveles?: boolean;
}

// ─── País ─────────────────────────────────────────────────────────────────────

/** El país por el prefijo del teléfono (WhatsApp). */
export function paisDeTelefono(phone: string): PaisConductor {
  return phone.startsWith('57') ? 'CO' : phone.startsWith('1') ? 'US' : 'XX';
}

/** El país por el código ISO que detecta el motor (web: `x-vercel-ip-country`). */
export function paisDeCodigo(codigo?: string | null): PaisConductor {
  return codigo === 'CO' ? 'CO' : codigo === 'US' ? 'US' : 'XX';
}

// ─── Las banderas del hilo ────────────────────────────────────────────────────

/**
 * Lo que el último turno del bot ofreció y cómo respondió la persona. Se
 * definen juntas porque se excluyen entre sí: el «sí» va a UNA sola puerta.
 */
export function banderasDelHilo(mensaje: string, historial: Turno[]) {
  const ultimoBot = [...historial].reverse().find((m) => m.role === 'assistant')?.content || '';
  // Aceptación SOLA: «Listo, ¿cómo me inscribo?» arranca con «listo» y trae
  // una pregunta nueva — sin este guard reabría el simulador en vez de
  // responder lo que la persona preguntó (ejercicio del 1 sep 2026).
  const aceptaSola = /^(s[ií]|claro|dale|listo|ok(ay)?|bueno|por supuesto|de una|h[aá]gale|h[aá]g[aá]mosl[eo]|mu[eé]str[ea]me(lo)?|quiero|s[ií] por favor|genial|perfecto|de acuerdo|vamos|excelente)(?![a-záéíóúñ])/i.test(mensaje.trim())
    && !/[?¿]/.test(mensaje)
    && !/(?<![a-záéíóúñ])(c[oó]mo|cu[aá]nto|cu[aá]l(es)?|qu[eé]|d[oó]nde|cu[aá]ndo|pero)(?![a-záéíóúñ])/i.test(mensaje);
  // «¿Seguimos con el simulador?» + «sí» debe reenviar la tarjeta — la forma
  // estricta («escenario en el simulador») dejó pasar la paráfrasis del
  // modelo y el turno cayó al motor, que improvisó una pregunta de
  // calificación (prueba de Edilberto, 2 sep, 1:42 p.m.).
  const aceptaSimulador = /simulador/i.test(ultimoBot) && aceptaSola;
  const ofrecioVinculacion = /c[oó]mo se vincula|c[oó]mo me vinculo|c[oó]mo se inscribe|arrancamos con su vinculaci[oó]n|seguimos con la activaci[oó]n|arrancamos con la activaci[oó]n/i.test(ultimoBot);
  const ofrecioTablaNiveles = /nivel por nivel|tabla[^?]{0,60}niveles|proyecci[oó]n[^?]{0,40}nivel/i.test(ultimoBot);
  // ⚠️ La forma tiene que ser la PREGUNTA de cierre de la tabla («¿le muestro
  // las ganancias por la compra de paquetes empresariales…?»), no las palabras
  // sueltas: un detector laxo sobre «paquetes empresariales» se re-dispararía
  // cuando el «sí» siguiente debe ir al motor por el ejemplo de cifras. La forma
  // vieja («la segunda forma de ganar») se conserva solo por los hilos en curso.
  const ofrecioSegundaForma = /le muestro (las ganancias por la compra de paquetes empresariales|la segunda forma de ganar)/i.test(ultimoBot);
  // ⚠️ Si el MENSAJE nombra el simulador («listo, seguimos con el simulador»),
  // ninguna aceptación dictada se lo queda: el reenvío de la tarjeta manda
  // (batería del 2 sep — el «listo» se comió la petición explícita).
  const pideSimulador = /simulad/i.test(mensaje);
  return { ultimoBot, aceptaSola, aceptaSimulador, ofrecioVinculacion, ofrecioTablaNiveles, ofrecioSegundaForma, pideSimulador };
}

// ─── Textos que se leen de la base ────────────────────────────────────────────

/**
 * El cuerpo con candado y la pregunta de seguimiento de un fragmento. Se lee de
 * la base para que una edición del arsenal no exija tocar código. Devuelve
 * cuerpo null si no hay candado.
 */
export async function leerCandado(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  tenant: string,
  categoria: string,
): Promise<{ cuerpo: string | null; cierre: string | null }> {
  const { data: frag } = await supabase
    .from('nexus_documents').select('content')
    .eq('tenant_id', tenant).eq('category', categoria)
    .maybeSingle();
  const cuerpo = frag?.content?.match(/<verbatim_lock>\s*([\s\S]*?)\s*<\/verbatim_lock>/)?.[1] ?? null;
  const cierre = frag?.content?.match(/\*\*Pregunta de seguimiento:\*\*\s*(.+)/)?.[1]?.trim() ?? null;
  return { cuerpo, cierre };
}

/** Cuerpo + pregunta de seguimiento, listos para entregar. Null si no hay candado. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function textoDeCandado(supabase: any, tenant: string, categoria: string): Promise<string | null> {
  const { cuerpo, cierre } = await leerCandado(supabase, tenant, categoria);
  if (!cuerpo) return null;
  return cierre ? `${cuerpo}\n\n${cierre}` : cuerpo;
}

/**
 * El slug amigable del socio, por su `constructor_id` o por el propio slug —
 * la web manda uno u otro según lo que traiga el `ref`.
 */
export async function slugDelSocio(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  ref: string | null | undefined,
): Promise<string | null> {
  if (!ref) return null;
  try {
    const { data } = await supabase.from('constructor_slugs').select('slug').eq('constructor_id', ref).maybeSingle();
    if (data?.slug) return data.slug as string;
    const { data: porSlug } = await supabase.from('constructor_slugs').select('slug').eq('slug', ref).maybeSingle();
    return (porSlug?.slug as string) || null;
  } catch {
    return null;
  }
}

// ─── Textos dictados ──────────────────────────────────────────────────────────

/**
 * LAS GANANCIAS POR LA COMPRA DE PAQUETES EMPRESARIALES (Director, 3 sep 2026,
 * auditoría de la prueba). Va DESPUÉS de la estrategia y del ingreso recurrente.
 * Dos cosas que el Director corrigió sobre la versión anterior:
 *   • El texto de concepto («hay un bono directo…») SOBRABA, y el ejemplo por
 *     generaciones cargaba demasiado a quien no sabe qué es una generación —
 *     él mismo tenía que leerlo despacio. Lo importante es que la persona VEA
 *     que hay una ganancia por paquetes: los tres paquetes con su inventario y
 *     su precio (no sabía cuáles eran), UNA cifra visible —el Visionario en la
 *     primera generación, que es exactamente lo que dice el menú del simulador
 *     que llega a continuación— y la orden de jugar con los números.
 *   • ⛔ «ENTRAR» ESTÁ VETADO cuando nombra comprar el paquete o iniciar: es el
 *     verbo de la pirámide (se «entra» a una cadena; se «compra» un inventario).
 *     «Le entra», dicho del dinero, sí vale.
 * El cierre NO es pregunta sino ORDEN («Juegue con los números…»), y por eso la
 * tarjeta del simulador sale pegada en el mismo turno: orden + tarjeta son UNA
 * sola oferta. ⚠️ Las formas de ganar no se numeran: hay doce; esta se nombra
 * por su mecanismo, nunca «segunda».
 */
export function textoBonoPaquetes(pais: PaisConductor): string {
  const precio = (usd: string, cop: string) => (pais === 'CO' ? cop : pais === 'US' ? usd : `${usd} (${cop})`);
  return [
    'Hay tres paquetes empresariales, cada uno con su inventario de productos:',
    '',
    `• *ESP-1 Inicial*: 7 productos · ${precio('$200 USD', '$900.000 COP')}`,
    `• *ESP-2 Empresarial*: 18 productos · ${precio('$500 USD', '$2.250.000 COP')}`,
    `• *ESP-3 Visionario*: 35 productos · ${precio('$1.000 USD', '$4.500.000 COP')}`,
    '',
    `Si usted compra uno de ellos como su inversión inicial, califica para cobrar el bono por la compra de paquetes empresariales en su canal. Por ejemplo: por cada Visionario que se compre en su primera generación, ${precio('$150 USD', '$675.000 COP')}; y el bono sigue en las cuatro generaciones siguientes.`,
    '',
    'Esa comisión le entra a medida que se compran los paquetes.',
    '',
    'Juegue con los números y arme el escenario que prefiera.',
  ].join('\n');
}

/** El precio del Kit de Inicio en la moneda del país (el candado trae el marcador). */
export function precioKit(pais: PaisConductor): string {
  return pais === 'CO' ? '$443.600 COP' : pais === 'US' ? '$98 USD' : '$98 USD ($443.600 COP)';
}

/**
 * En la web el simulador no es una tarjeta sino un enlace al deck que lo trae:
 * `/12-niveles` para la estrategia (niveles y la renta al 10%), `/servilleta`
 * para las tarifas de renta y los paquetes. Los dos llevan el orbe de Queswa,
 * así que la conversación sigue allá.
 */
export function textoSimuladorWeb(sim: SimuladorDictado): string {
  const url = sim.pantalla === 'NIVELES' || sim.pantalla === 'RENTA_DIEZ'
    ? 'https://creatuactivo.com/12-niveles'
    : 'https://creatuactivo.com/servilleta';
  return `${sim.cuerpo}\n\n[Abrir el simulador](${url})`;
}

// ─── Los nodos ────────────────────────────────────────────────────────────────

/**
 * 2.24 — El enlace al catálogo.
 *
 * La URL de la página de productos es determinística (el slug del socio +
 * /productos), así que la emite el backend y no el modelo. En la prueba del
 * 22 ago el motor primero dijo que no tenía el enlace y después lo armó por
 * su cuenta; acertó, pero un slug distinto habría caído en la mini-landing.
 * El «sí» al cierre de las respuestas de salud («¿le muestro el catálogo
 * completo?») entra por aquí.
 */
export async function atenderEnlaceCatalogo(
  mensaje: string,
  historial: Turno[],
  resolverSlug: () => Promise<string | null>,
): Promise<RespuestaConductor | null> {
  const ultimoBot = [...historial].reverse().find((m) => m.role === 'assistant')?.content || '';
  const aceptaCatalogoSalud = RE_OFERTA_CATALOGO_SALUD.test(ultimoBot) && esAceptacion(mensaje);
  if (!pideEnlaceCatalogo(mensaje) && !aceptaCatalogoSalud) return null;
  const slug = await resolverSlug();
  return { nodo: `2.24 enlace al catálogo (${slug ?? 'sin socio'})`, texto: mensajeEnlaceCatalogo(slug) };
}

/**
 * 2.34 → 2.44 — El hilo de Los 12 Niveles y el simulador.
 *
 * Devuelve el primer nodo que aplique, en el mismo orden del webhook, o null
 * si el turno es del motor.
 */
export async function atenderHiloNiveles(ctx: ContextoConductor): Promise<RespuestaConductor | null> {
  const { mensaje, historial } = ctx;
  const b = banderasDelHilo(mensaje, historial);
  const vieneDelSimulador = !!ctx.vieneDelSimulador;

  // ── 2.34 «¿Qué es eso del plan de dos ciclos?» se entrega dictado ──────────
  // El nombre de Los 12 Niveles llega mal oído —dos ciclos, dos niveles, 12
  // días, 12 semanas, 12 meses— y el clasificador ya lo enruta al arsenal
  // correcto; pero el modelo, al no reconocer el nombre, componía un «ese
  // término no lo manejamos» en vez de entregar el candado (batería del 1 sep
  // 2026, incluso con el alias escrito en el prompt). Es determinístico: la
  // pregunta por qué es el plan recibe NIVELES_01 tal cual.
  // Se acota a la pregunta de QUÉ ES; «¿cuánto se gana con el plan de 12
  // días?» sigue al motor, que la lleva a NIVELES_02.
  const nombreMalOido = /(plan|estrategia|programa|sistema|eso|ciclos?)\s+de\s+(los\s+)?(12|doce|dos)\s*(niveles|ciclos|d[ií]as|semanas|meses|pasos|etapas|escalones)?\b|\b(12|dos|doce)\s*niveles\b|(plan|estrategia)\s+(estrat[eé]gic[oa]|nuev[oa]|de septiembre|del?\s+(1|primero|1ro)\s+de\s+septiembre|que\s+(est[aá]n\s+)?lanz\w+)|nuev[oa]\s+(plan|estrategia)|plan\s+de\s+lanzamiento/i.test(mensaje);
  const preguntaQueEs = /qu[eé]\s+es|qu[eé]\s+son|c[oó]mo\s+es|expl[ií]ca|h[aá]bl[aoó]|cu[eé]nta|me hablaron|en qu[eé] consiste|de qu[eé] se trata|informaci[oó]n|averigua|saber|conocer|entender|no me acuerdo/i.test(mensaje)
    && !/cu[aá]nto|gan[ao]|precio|vale|cuesta|tabla|inscrib|vincul/i.test(mensaje);
  // El «sí» a las ofertas de la estrategia — las escritas Y las que el modelo
  // compone nombrando Los 12 Niveles («¿le muestro cómo funciona con su
  // caso?», prueba de Edilberto): cualquier oferta que nombre el plan y no sea
  // la tabla, la vinculación ni el simulador, dicta NIVELES_01.
  const aceptaEstrategia = b.aceptaSola && !b.pideSimulador
    && /12 niveles|estrategia de los 12/i.test(b.ultimoBot)
    && !b.ofrecioTablaNiveles && !b.ofrecioVinculacion && !b.ofrecioSegundaForma
    && !/simulador/i.test(b.ultimoBot);
  if (!vieneDelSimulador && ((nombreMalOido && preguntaQueEs) || aceptaEstrategia)) {
    try {
      const texto = await textoDeCandado(ctx.supabase, ctx.tenant, 'arsenal_12_niveles_NIVELES_01');
      if (texto) {
        // Si el hilo ya mostró el ejemplo de renta al 17%, una frase de puente:
        // sin ella la persona ve dos tarifas en la misma conversación y nadie
        // le dice por qué (prueba del Director, 1 sep, 12:16 → 12:17).
        const vieneDel17 = historial.some((m) => m.role === 'assistant' && /17\s?%/.test(m.content));
        const puente = vieneDel17 ? 'Esta estrategia corre con el Kit, al 10%: la misma regalía, con la tarifa de entrada.\n\n' : '';
        // Sin tarjeta automática (Director, 3 sep 2026): el texto cerraba
        // preguntando por la tabla Y llegaba la tarjeta — dos ofertas en un
        // turno. La pregunta de seguimiento ofrece el simulador y el «sí» lo trae.
        return {
          nodo: '2.34 NIVELES_01 (nombre mal oído / sí a la estrategia)',
          texto: puente + texto.replace(/\[PRECIO_KIT\]/g, precioKit(ctx.pais)),
          marcarHiloDoceNiveles: true,
        };
      }
    } catch (err) {
      console.warn('⚠️ [Conductor] No se pudo dictar NIVELES_01 — sigue al motor:', err);
    }
  }

  // ── 2.355 El «sí» a «¿le muestro las ganancias por la compra de paquetes…?» ─
  // El cierre de la tabla ofrece el segundo botín; el «sí» dicta el texto del
  // GEN5 (Director, 3 sep 2026). Va después de la estrategia, nunca antes. La
  // orden («Juegue con los números…») y la tarjeta son UNA oferta: van juntas.
  if (!vieneDelSimulador && b.aceptaSola && !b.pideSimulador && b.ofrecioSegundaForma) {
    return {
      nodo: '2.355 ganancias por paquetes (GEN5)',
      texto: textoBonoPaquetes(ctx.pais),
      simulador: ctx.simuladorDisponible
        ? { pantalla: 'GEN_MENU', cuerpo: 'Elija el paquete y cuántos se compran por generación, y el resultado sale al instante.', primeraVez: true }
        : undefined,
    };
  }

  // ── 2.36 El «sí» a «¿le muestro cómo se vincula?» pide los datos ───────────
  // Es el cierre de la tabla y del simulador de los 12 Niveles. En la prueba
  // del Director (1 sep, 10:55) el «sí» se fue a un patrón del clasificador y
  // el modelo compuso un «proceso en tres pasos» inventado. Es determinístico:
  // el bloque de los datos, con el Kit nombrado porque el hilo es el de la
  // estrategia. Lo que la persona conteste cae en gestionarCierre, que
  // reconoce el bloque por su encabezado.
  if (!vieneDelSimulador && b.aceptaSola && !b.pideSimulador && b.ofrecioVinculacion) {
    const vacio: DatosRadicacion = { nombre: null, cedula: null, ciudad: null, paquete: null, whatsapp: null };
    return {
      nodo: '2.36 vinculación → datos de la radicación',
      texto: pedirDatos(vacio, ctx.socioNombre, ctx.hiloDoceNiveles, ctx.clavesRadicacion ?? CLAVES_CANAL),
    };
  }

  // ── 2.35 El «sí» a la tabla de los niveles se entrega dictado ──────────────
  // El bot cierra ofreciendo «la tabla nivel por nivel» con palabras que él
  // mismo compone, y esa frase no siempre recupera NIVELES_02; sin la tabla en
  // contexto, el modelo INVENTÓ una de doce filas con el dinero al doble.
  const hiloDoce = historial.some((m) => /12 Niveles/i.test(m.content));
  if (!vieneDelSimulador && b.aceptaSola && !b.pideSimulador && b.ofrecioTablaNiveles && hiloDoce) {
    try {
      const { cuerpo, cierre } = await leerCandado(ctx.supabase, ctx.tenant, 'arsenal_12_niveles_NIVELES_02');
      if (cuerpo) {
        return {
          nodo: '2.35 NIVELES_02 (tabla nivel por nivel)',
          texto: `${cuerpo}\n\n${cierre || '¿Le muestro las ganancias por la compra de paquetes empresariales en su canal?'}`,
          simulador: ctx.simuladorDisponible
            ? { pantalla: 'NIVELES', cuerpo: 'Y si quiere verlo nivel por nivel en el simulador: elija el nivel y el resultado sale al instante.', primeraVez: true }
            : undefined,
        };
      }
    } catch (err) {
      console.warn('⚠️ [Conductor] No se pudo dictar NIVELES_02 — sigue al motor:', err);
    }
  }

  // ── 2.4 El simulador cuando lo piden, o aceptan la oferta ──────────────────
  // Un Flow completado queda sellado en WhatsApp: la tarjeta muestra el resumen
  // y no vuelve a abrir. Quien está sopesando el proyecto quiere volver a los
  // números — se le manda una tarjeta nueva. `!vieneDelSimulador` es
  // indispensable: el texto que sintetizamos al cerrar el Flow contiene la
  // palabra "simulador".
  if (ctx.simuladorDisponible && !vieneDelSimulador
      && (/simula(dor|r|ci[oó]n)|volver a ver los n[uú]meros|abrir.*n[uú]meros/i.test(mensaje) || b.aceptaSimulador)) {
    // La pantalla inicial hereda de la oferta que la persona aceptó: tras el
    // Kit, la renta al 10%; tras el ejemplo GEN5, los paquetes; tras el de
    // renta, la renta. Solo sin pista abre en el menú.
    const pantalla: PantallaSimulador = /tarifa del Kit/i.test(b.ultimoBot) ? 'RENTA_DIEZ'
      : /12 Niveles|nivel por nivel|distribuidores consumiendo/i.test(b.ultimoBot) ? 'NIVELES'
      : /Generaci[oó]n 1|primera generaci[oó]n|paquetes empresariales|paquetes? ESP-[123]\*? comprados?|Bono GEN5/i.test(b.ultimoBot) ? 'GEN_MENU'
      : /renta estar[ií]a|clientes en cada centro|supuesto modesto/i.test(b.ultimoBot) ? 'RENTA_MENU'
      : 'INICIO';
    // Si llega por el «sí» a una oferta, es la PRIMERA vez que la persona ve la
    // tarjeta y el cuerpo explica qué elegir; «aquí lo tiene de nuevo» es solo
    // para quien lo pide otra vez.
    const primeraVez = b.aceptaSimulador && !/\[Simulador/i.test(b.ultimoBot);
    const cuerpo = !primeraVez
      ? 'Aquí lo tiene de nuevo. Arme el escenario que quiera ver.'
      : pantalla === 'NIVELES' ? 'Elija el nivel y la cifra sale al instante, con los distribuidores que la producen.'
      : pantalla === 'GEN_MENU' ? 'Elija el paquete y cuántos se compran por generación, y el resultado sale al instante.'
      : 'Arme el escenario que quiera ver: el resultado sale al instante.';
    return {
      nodo: `2.4 simulador (${pantalla}${primeraVez ? ', primera vez' : ''})`,
      simulador: { pantalla, cuerpo, primeraVez },
      persistir: `${cuerpo} [Simulador ${primeraVez ? 'enviado' : 'reenviado'}]`,
    };
  }

  // ── 2.44 El «sí» tras las respuestas de salud — dictado ────────────────────
  // Tras el peso («¿le cuento cómo integrarlo en su rutina?») el «sí» tiene un
  // solo destino; el 29 ago el modelo lo compuso con un Clásico a $82.500. Los
  // datos salen de la tabla.
  if (!ctx.socioQueEscribe) {
    const seguimiento = seguimientoSalud(b.ultimoBot, mensaje);
    if (seguimiento) return { nodo: '2.44 seguimiento de salud', texto: seguimiento };
  }

  return null;
}

// ─── Formato para la web ──────────────────────────────────────────────────────

/**
 * Los textos dictados de `wa-*` vienen en el formato de WhatsApp (negrita con
 * UN asterisco). La web muestra Markdown, donde un asterisco es cursiva: se
 * convierte a dos. Idempotente sobre `**negrita**` y sin tocar `_cursiva_`.
 * Solo para textos dictados — el modelo ya escribe Markdown y usa `*cursiva*`
 * a propósito.
 */
export function aFormatoWeb(texto: string): string {
  if (!texto) return texto;
  return texto.replace(/(^|[^*])\*(?!\*)([^*\n]+?)\*(?!\*)/g, '$1**$2**');
}

// ─── 2.25 La foto ─────────────────────────────────────────────────────────────

export interface FotoDictada {
  nodo: string;
  url: string;
  /** El pie: nombre, presentación, precio y registro. Sin declaración de salud. */
  pie: string;
  /** Lo que se le informa al motor si el turno sigue (`whatsapp_foto_enviada`). */
  nombre: string;
  /** El mensaje pidió SOLO la foto: la pregunta de cierre va en el pie y el turno se cierra. */
  cierraTurno: boolean;
}

/**
 * La foto de una LÍNEA o del portafolio (2.25a), o la de UN producto (2.25b).
 *
 * Se envía SOLO si la persona la pide y nombra un producto o una línea, o si
 * acepta la oferta con la que el bot cerró: mandarla porque el producto se
 * mencionó convierte la conversación en un catálogo que dispara solo.
 *
 * ⚠️ EL MOTOR NO SABE QUE LA FOTO SALIÓ. Si el mensaje pide solo la foto, el
 * turno se cierra con la pregunta dictada dentro del pie (enviada aparte
 * llegaba ANTES que la imagen); si además pregunta algo, el canal sigue al
 * motor con `pageContext: 'whatsapp_foto_enviada'`.
 */
export function atenderFoto(mensaje: string, historial: Turno[]): FotoDictada | null {
  const ultimoBot = [...historial].reverse().find((m) => m.role === 'assistant')?.content || '';

  // 2.25a — la línea va ANTES que el producto: «las cápsulas» en plural es la
  // línea; «las cápsulas de ganoderma» es el producto.
  const familiaAceptada = familiaOfrecida(ultimoBot);
  const familia = (familiaAceptada && esAceptacionCorta(mensaje)) ? familiaAceptada
    : (preguntoCualLinea(ultimoBot) && detectarFamilia(mensaje)) ? detectarFamilia(mensaje)
    : (pideImagen(mensaje) && !detectarProducto(mensaje)) ? detectarFamilia(mensaje)
    : null;
  if (familia) {
    const vieneDeOferta = familia === familiaAceptada || preguntoCualLinea(ultimoBot);
    const soloFoto = vieneDeOferta || esSoloPedidoDeImagen(mensaje);
    return {
      nodo: `2.25a foto de la línea ${familia}`,
      url: urlImagenFamilia(familia),
      pie: pieDeFotoFamilia(familia, soloFoto ? FAMILIAS_WA[familia].seguimiento : undefined),
      nombre: FAMILIAS_WA[familia].titulo,
      cierraTurno: soloFoto,
    };
  }

  // 2.25b — el «sí» a «¿le muestro la foto?» es la foto del producto que ese
  // turno nombró; «dame una imagen» a secas toma el producto del hilo.
  const fotoOfrecida = RE_OFERTA_FOTO_PRODUCTO.test(ultimoBot) && esAceptacionCorta(mensaje);
  if (!pideImagen(mensaje) && !fotoOfrecida) return null;
  const producto = fotoOfrecida
    ? detectarProducto(ultimoBot)
    : (detectarProducto(mensaje) ?? cafeGenericoAFoto(mensaje) ?? productoDelHilo(historial));
  if (!producto) return null;

  const soloFoto = esSoloPedidoDeImagen(mensaje);
  let seguimiento: string | undefined;
  if (soloFoto) {
    // ¿Ya se le había explicado este producto? Volver a ofrecérselo sería no
    // estar leyendo el hilo.
    const clave = producto.nombre.toLowerCase().split(' ')[0];
    const yaExplicado = historial.some((m) =>
      m.role === 'assistant' && !m.content.startsWith('[Foto')
      && m.content.length > 200 && m.content.toLowerCase().includes(clave));
    seguimiento = seguimientoFoto(producto, yaExplicado);
  }
  return {
    nodo: `2.25b foto de ${producto.slug}`,
    url: urlImagen(producto),
    pie: pieDeFoto(producto, seguimiento),
    nombre: producto.nombre,
    cierraTurno: soloFoto,
  };
}

/** La foto como la muestra la web: la imagen en Markdown y el pie debajo. */
export function fotoParaWeb(foto: FotoDictada): string {
  return `![${foto.nombre}](${foto.url})\n\n${aFormatoWeb(foto.pie)}`;
}

// ─── 2.46 → 2.48 Los nodos del socio ──────────────────────────────────────────

export interface ContextoSocio {
  mensaje: string;
  historial: Turno[];
  socio: SocioPedido | null;
  /** Nombre corto del prospecto, para el aviso al socio. */
  nombreProspecto?: string;
  /** El teléfono en WhatsApp; en la web, la huella del navegador. */
  contacto: string;
  /** Ya hay un pedido cargado en el hilo (solo WhatsApp lo lleva). */
  hayPedido: boolean;
  socioQueEscribe?: boolean;
}

/**
 * «Quiero hablar con una persona» (2.46) · el envío (2.47) · las sedes (2.48).
 * En el mismo orden del webhook. Un socio que escribe no entra a ninguno.
 */
export async function atenderSocio(ctx: ContextoSocio): Promise<RespuestaConductor | null> {
  if (ctx.socioQueEscribe) return null;
  const { mensaje, historial, socio } = ctx;
  const ultimoBot = [...historial].reverse().find((m) => m.role === 'assistant')?.content ?? '';

  // 2.46 — Hasta el 27 ago el modelo escribía «le aviso al socio» y no pasaba nada.
  if (detectarPidePersona(mensaje)) {
    const ultimoUsuario = [...historial].reverse().find((m) => m.role === 'user')?.content ?? '';
    await avisarPidePersona(ctx.contacto, ctx.nombreProspecto, socio, ultimoUsuario);
    return { nodo: '2.46 pide una persona (socio y equipo avisados)', texto: respuestaPersona(socio) };
  }

  // 2.47 — El envío lo coordina con el socio, por su nombre.
  if (detectarPreguntaEnvio(mensaje) && !detectarPreguntaOficina(mensaje)) {
    return { nodo: '2.47 envío', texto: respuestaEnvio(socio) };
  }

  // 2.48 — Las direcciones son información de socio (Director, 27 ago 2026):
  // las sedes atienden a quien ya tiene código. Al prospecto: la razón real y
  // la puerta (su código lo abre el socio). Si insiste, una línea.
  if (detectarPreguntaOficina(mensaje)) {
    const insiste = RE_OFICINA_YA_EXPLICADA.test(ultimoBot);
    const ciudad = detectarCiudad(mensaje)
      ?? [...historial].reverse().map((m) => detectarCiudad(m.content)).find(Boolean)
      ?? null;
    return {
      nodo: `2.48 sedes (${ciudad ?? 'sin ciudad'}${insiste ? ', insiste' : ''})`,
      texto: respuestaOficinaProspecto(socio, ciudad, ctx.hayPedido, insiste, diceDondeVive(mensaje)),
    };
  }

  return null;
}
