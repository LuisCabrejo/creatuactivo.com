/**
 * Copyright © 2026 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * Apertura de Queswa en WhatsApp — copy dictado por el backend.
 *
 * Mismo patrón que `respuestas-maestras.ts` y `getMicroPromptApertura()`: cuando
 * el texto es calibrado y no admite paráfrasis, lo dicta el backend y el modelo
 * no interviene. Aquí además hay dos razones propias del canal:
 *
 *   1. La apertura nombra al SOCIO que refirió, y ese dato solo lo tiene el
 *      webhook (lo resuelve `resolverPatrocinador()` del texto de entrada).
 *   2. Va como mensaje interactivo de lista, que solo la capa de canal envía.
 *
 * ⚠️ NO usar `getInitialGreeting()` de `queswa-greeting.ts` aquí: ese saludo es
 * compartido con la web y no conoce al socio ni declara la identidad de IA.
 *
 * Las tres decisiones que sostienen este texto (4 ago 2026):
 *
 * • **Nombrar al socio primero.** Transferencia de confianza: el prospecto no le
 *   presta crédito a un número desconocido, se lo presta a quien ya conoce. Es la
 *   palanca más fuerte del primer mensaje, por encima de la velocidad de respuesta.
 *
 * • **Declarar que es IA, antes del diálogo.** La divulgación previa sube la
 *   satisfacción en servicios de alto contacto; que lo descubran después destruye
 *   la confianza casi sin reparación. Y aquí no es un costo: es el argumento —
 *   la persona no lee una promesa sobre la herramienta, la está usando.
 *
 * • **Sin pronombre para el socio.** Decía "Él me pidió que lo recibiera", y de
 *   los diez socios registrados la mayoría son mujeres — con ese texto la
 *   apertura las trataba a todas en masculino. "Me pidió que lo recibiera"
 *   funciona para cualquiera y no pierde nada. NO reintroducir el pronombre.
 *
 * • **Sin pregunta abierta.** El villano NO va en la apertura: es un diagnóstico
 *   entregado como veredicto a alguien de quien no sabemos nada, y a quien no le
 *   aprieta el mes se exime en la línea tres. Se narra después, cuando la persona
 *   ya habló y se le puede calzar a su caso.
 *
 * Ver docs/handoff/negocio/ESTRATEGIA_CANAL_WHATSAPP.md §8.
 */

import type { WAListRow } from '@/lib/wa-channel';

/** Rótulo del botón que despliega la lista (máx. 20 caracteres). */
export const APERTURA_BOTON = 'Ver opciones';

export const APERTURA_SECCION = 'Por dónde empezar';

/**
 * Las tres preguntas reales del prospecto, en su voz.
 *
 * La tercera es la que más pesa: la objeción silenciosa casi nunca es "no
 * entiendo", es "yo no sería capaz". Los títulos están al límite de 24
 * caracteres de Meta — al editarlos, contarlos.
 */
export const APERTURA_OPCIONES: WAListRow[] = [
  {
    id: 'apertura_dinero',
    title: 'De dónde sale el dinero',
    description: 'De qué se distribuye y quién paga',
  },
  {
    id: 'apertura_sistema',
    title: 'Cómo funciona el sistema',
    description: 'Qué hace la tecnología por usted',
  },
  {
    id: 'apertura_rol',
    title: 'Qué tendría que hacer yo',
    description: 'Su día a día real, sin adornos',
  },
];

/** Nombres de perfil que no sirven para saludar (Meta rellena cuando no hay). */
function nombreUtil(nombre?: string): string | null {
  if (!nombre) return null;
  const limpio = nombre.trim();
  if (!limpio || limpio.toLowerCase() === 'constructor') return null;
  // Solo el primer nombre: "Hola, María Fernanda Restrepo" suena a formulario.
  return limpio.split(/\s+/)[0];
}

/**
 * Nombre del socio en su forma social, no legal.
 *
 * En la base los socios están con nombre completo de cédula — "Nidia Marleny
 * Cabrejo Moncada", "Adriana Patricia Flores Salcedo". Presentarlo entero
 * ("la inteligencia artificial que asiste a Nidia Marleny Cabrejo Moncada")
 * suena a escritura pública y trabaja contra la calidez que sostiene toda la
 * apertura.
 *
 * Se toman las dos primeras palabras. Es la regla robusta para Colombia: cae
 * bien tanto en nombre + apellido ("Luis Cabrejo") como en nombre compuesto
 * ("Carlos Alberto", "Nidia Marleny"), que es como esas personas se presentan.
 * Intentar adivinar dónde empieza el apellido exige un diccionario de nombres y
 * se equivoca justo en los casos ambiguos.
 */
function nombreSocioCorto(nombre?: string): string | undefined {
  if (!nombre) return undefined;
  const partes = nombre.trim().split(/\s+/).filter(Boolean);
  if (partes.length === 0) return undefined;
  return partes.slice(0, 2).join(' ');
}

/**
 * Cuerpo del mensaje de apertura.
 *
 * @param nombreProspecto  Nombre de perfil de WhatsApp; se omite si no es usable.
 * @param nombreSocio      Nombre del arquitecto que refirió; sin él se cae a la
 *                         marca, porque prometer un referidor que no existe es peor
 *                         que no nombrarlo.
 */
export function construirApertura(
  nombreProspecto?: string,
  nombreSocio?: string,
): string {
  const nombre = nombreUtil(nombreProspecto);
  const saludo = nombre ? `Hola, ${nombre}.` : 'Hola.';

  const socio = nombreSocioCorto(nombreSocio);
  const identidad = socio
    ? `Soy Queswa, la inteligencia artificial que asiste a ${socio}. Me pidió que lo recibiera. 🤝`
    : 'Soy Queswa, la inteligencia artificial de CreaTuActivo. 🤝';

  return [
    `${saludo} ${identidad}`,
    '',
    'Le explico cómo se construye un segundo ingreso, en paralelo a lo que usted ya hace, con el potencial de igualarlo o superarlo. Y de paso ve la herramienta funcionando: yo atiendo a quien pregunta, a la hora que sea.',
    '',
    '¿Por dónde prefiere empezar?',
  ].join('\n');
}
