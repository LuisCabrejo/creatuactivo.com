/**
 * Copyright © 2026 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * Markdown → WhatsApp. Traducción de formato en la capa de canal.
 *
 * POR QUÉ EXISTE: el motor es el mismo que sirve la web, y sus arsenales están
 * escritos en Markdown — negritas con `**`, tablas con tubos, separadores con
 * `---`. WhatsApp no entiende nada de eso. En producción, la respuesta con las
 * cifras del plan llegó así:
 *
 *     | Gen | Vinculaciones | Comisión c/u | Total acumulado |
 *     |-----|---------------|--------------|-----------------|
 *     | 1 | 2 | $675.000 COP | $1.350.000 COP |
 *
 * Ilegible en un teléfono, y encima `**Velocidad 2**` se veía con los asteriscos
 * a la vista: WhatsApp tomó el par exterior como delimitador y dejó el interior
 * impreso.
 *
 * Se arregla aquí y no en el system prompt por la misma razón de siempre: una
 * transformación determinística no se le pide a un modelo turno a turno. Además
 * el texto también llega de fragmentos recuperados y de micro-prompts dictados,
 * donde el modelo no tiene la última palabra sobre el formato.
 *
 * ⚠️ El formato de WhatsApp es `*negrita*`, `_cursiva_`, `~tachado~`. Un solo
 * asterisco. No hay encabezados, no hay tablas, no hay enlaces con etiqueta.
 */

/** Fila de tabla Markdown: empieza y termina con tubo. */
const RE_FILA = /^\s*\|.*\|\s*$/;
/** Fila separadora: solo guiones, dos puntos y tubos. */
const RE_SEPARADOR = /^\s*\|[\s:|-]+\|\s*$/;

function celdas(linea: string): string[] {
  return linea.trim().replace(/^\||\|$/g, '').split('|').map((c) => c.trim());
}

/**
 * Convierte una tabla en bloques legibles.
 *
 * Cada fila se vuelve un bloque encabezado por su primera celda, y el resto de
 * columnas quedan como `Etiqueta: valor`. Es más largo de leer que una tabla en
 * pantalla ancha, pero en un teléfono es la diferencia entre entenderlo y no.
 */
function tablaABloques(filas: string[]): string {
  const datos = filas.filter((f) => !RE_SEPARADOR.test(f)).map(celdas);
  if (datos.length < 2) return filas.map((f) => celdas(f).join(' · ')).join('\n');

  const [cabecera, ...cuerpo] = datos;

  return cuerpo
    .map((fila) => {
      const titulo = [cabecera[0], fila[0]].filter(Boolean).join(' ').trim();
      const resto = fila
        .slice(1)
        .map((valor, i) => {
          const etiqueta = cabecera[i + 1];
          if (!valor) return null;
          return etiqueta ? `${etiqueta}: ${valor}` : valor;
        })
        .filter(Boolean);
      return [`*${titulo}*`, ...resto].join('\n');
    })
    .join('\n\n');
}

/**
 * Deja el texto en el formato que WhatsApp sí renderiza.
 *
 * Idempotente sobre texto que ya viene limpio: si no hay Markdown, no toca nada.
 */
export function aFormatoWhatsApp(texto: string): string {
  if (!texto) return texto;

  const lineas = texto.replace(/\r\n/g, '\n').split('\n');
  const salida: string[] = [];
  let tabla: string[] = [];

  const volcarTabla = () => {
    if (tabla.length === 0) return;
    salida.push(tablaABloques(tabla));
    tabla = [];
  };

  for (const linea of lineas) {
    if (RE_FILA.test(linea)) {
      tabla.push(linea);
      continue;
    }
    volcarTabla();
    salida.push(linea);
  }
  volcarTabla();

  return salida
    .join('\n')
    // Bloques de código: WhatsApp los renderiza en monoespaciado, y eso solo
    // ayuda si la alineación cabe. Un teléfono parte la línea alrededor de los 30
    // caracteres, así que un bloque más ancho llega descuadrado y encima con
    // aspecto de consola. Si cabe, se conserva; si no, se quitan las comillas.
    .replace(/```(?:\w+)?\n([\s\S]*?)```/g, (_m, cuerpo: string) => {
      const cabe = cuerpo.split('\n').every((l) => l.length <= 30);
      return cabe ? '```\n' + cuerpo.replace(/\n$/, '') + '\n```' : cuerpo.trim();
    })
    // Encabezados: WhatsApp no los tiene, y `### Algo` se lee como ruido.
    .replace(/^\s{0,3}#{1,6}\s*(.+?)\s*#*\s*$/gm, '*$1*')
    // Separadores horizontales: dejan una línea de guiones suelta en el chat.
    .replace(/^\s{0,3}([-*_])\1{2,}\s*$/gm, '')
    // Enlaces con etiqueta: WhatsApp muestra la URL, no el texto.
    .replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, '$1: $2')
    // Negrita: el par doble deja los asteriscos interiores a la vista.
    .replace(/\*\*\*(.+?)\*\*\*/g, '*_$1_*')
    .replace(/\*\*(.+?)\*\*/g, '*$1*')
    .replace(/__(.+?)__/g, '*$1*')
    // Viñetas: el guion inicial se lee como raya, no como lista.
    .replace(/^(\s*)[-*+]\s+/gm, '$1• ')
    // Tres o más saltos seguidos dejan huecos enormes en la burbuja.
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/**
 * Parte un mensaje largo en varios, por límites de párrafo.
 *
 * WhatsApp colapsa lo que pase de unas pocas líneas detrás de un "Leer más", y
 * ahí se pierde justo el final — que es donde va la pregunta. Varios mensajes
 * cortos se leen como alguien escribiendo; uno larguísimo, como un folleto.
 *
 * Nunca corta a mitad de párrafo ni de bloque de cifras: si un solo párrafo ya
 * excede el límite, sale entero.
 *
 * El umbral de 600 no es arbitrario: es el que la investigación de arquitectura
 * de agentes en WhatsApp da como empírico para el colapso visual (§4.2). Y el
 * control de longitud no se le confía al prompt — "sé breve" es de los adjetivos
 * que peor se cumplen; la fragmentación tiene que ocurrir en el código.
 */
export function partirParaWhatsApp(texto: string, limite = 600, maxPartes = 3): string[] {
  const limpio = (texto || '').trim();
  if (!limpio) return [];
  if (limpio.length <= limite) return [limpio];

  const parrafos = limpio.split(/\n{2,}/);
  const partes: string[] = [];
  let actual = '';

  for (const p of parrafos) {
    if (!actual) {
      actual = p;
      continue;
    }
    if (actual.length + p.length + 2 <= limite || partes.length === maxPartes - 1) {
      actual += `\n\n${p}`;
    } else {
      partes.push(actual);
      actual = p;
    }
  }
  if (actual) partes.push(actual);

  return partes;
}
