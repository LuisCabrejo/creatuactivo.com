/**
 * Copyright © 2026 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * El país de una persona, a partir de lo que tenemos de ella.
 *
 * Hasta el 8 oct 2026 el país solo vivía dentro del motor (`detectVisitorCountry`
 * en /api/nexus, para cotizar), y ningún aviso al socio lo decía: Aldo Moller
 * escribió desde Canadá, preguntó por Canadá, Chile y Brasil, y el aviso que le
 * debía llegar al equipo no habría dicho de dónde era. Es la primera pieza de la
 * base por país (16 países de América), y por eso vive aparte: lo que venga por
 * país —moneda, precios, registro, envío— se cuelga de este mismo código.
 *
 * Tres fuentes, de la mejor a la peor:
 *   · el BSUID de WhatsApp trae el país en sus dos letras (`CA.951…`): es lo que
 *     la persona declaró en su cuenta, no la línea que compró;
 *   · el teléfono, por su prefijo. El +1 lo comparten Estados Unidos, Canadá,
 *     Puerto Rico y República Dominicana, así que ahí decide el código de área;
 *   · en la web, el encabezado `x-vercel-ip-country`, que es la conexión.
 *
 * Sin dependencias: lo usan el webhook (Node) y las rutas de tracking (Edge).
 */

export const NOMBRE_PAIS: Record<string, string> = {
  CO: 'Colombia', US: 'Estados Unidos', CA: 'Canadá', MX: 'México',
  PR: 'Puerto Rico', DO: 'República Dominicana', HN: 'Honduras', CR: 'Costa Rica',
  SV: 'El Salvador', PA: 'Panamá', GT: 'Guatemala', BR: 'Brasil', EC: 'Ecuador',
  PE: 'Perú', BO: 'Bolivia', CL: 'Chile',
  // Fuera de los 16, pero de aquí escribe gente: diáspora y vecinos.
  VE: 'Venezuela', AR: 'Argentina', PY: 'Paraguay', UY: 'Uruguay', NI: 'Nicaragua',
  ES: 'España', IT: 'Italia', GB: 'Reino Unido', DE: 'Alemania', FR: 'Francia',
  AU: 'Australia', CU: 'Cuba',
};

export function nombrePais(codigo: string | null | undefined): string | null {
  if (!codigo) return null;
  return NOMBRE_PAIS[codigo.toUpperCase()] ?? null;
}

const PREFIJO_PAIS: Record<string, string> = {
  '57': 'CO', '52': 'MX', '51': 'PE', '56': 'CL', '55': 'BR', '54': 'AR',
  '58': 'VE', '34': 'ES', '39': 'IT', '44': 'GB', '49': 'DE', '33': 'FR', '61': 'AU',
  '53': 'CU',
  '593': 'EC', '507': 'PA', '506': 'CR', '502': 'GT', '503': 'SV', '504': 'HN',
  '505': 'NI', '591': 'BO', '595': 'PY', '598': 'UY',
};

// Códigos de área del +1 que no son de Estados Unidos.
const AREA_CANADA = new Set([
  '204', '226', '236', '249', '250', '263', '289', '306', '343', '354', '365', '367',
  '368', '382', '403', '416', '418', '428', '431', '437', '438', '450', '468', '474',
  '506', '514', '519', '548', '579', '581', '584', '587', '604', '613', '639', '647',
  '672', '683', '705', '709', '742', '753', '778', '780', '782', '807', '819', '825',
  '867', '873', '879', '902', '905', '942',
]);
const AREA_PUERTO_RICO = new Set(['787', '939']);
const AREA_DOMINICANA = new Set(['809', '829', '849']);

/**
 * El país de quien escribe por WhatsApp. Acepta la huella (`wa_…`), el BSUID
 * (`CA.951546381359010`) o el teléfono (`573001234567`, `+1 786…`).
 */
export function paisDeContactoWA(contacto: string | null | undefined): string | null {
  if (!contacto) return null;
  const crudo = contacto.replace(/^wa_/, '').trim();

  const bsuid = crudo.match(/^([A-Z]{2})\./);
  if (bsuid) return bsuid[1];

  // Solo un teléfono: la huella del navegador (hexadecimal) también trae
  // dígitos, y leídos como prefijo darían un país al azar.
  if (!/^\+?\d[\d\s()-]*$/.test(crudo)) return null;
  const digitos = crudo.replace(/\D/g, '');
  if (digitos.length < 8) return null;

  if (digitos.startsWith('1') && digitos.length === 11) {
    const area = digitos.slice(1, 4);
    if (AREA_CANADA.has(area)) return 'CA';
    if (AREA_PUERTO_RICO.has(area)) return 'PR';
    if (AREA_DOMINICANA.has(area)) return 'DO';
    return 'US';
  }
  for (const largo of [3, 2]) {
    const codigo = PREFIJO_PAIS[digitos.slice(0, largo)];
    if (codigo) return codigo;
  }
  return null;
}

/** Quien escribe con nombre de usuario: WhatsApp no nos muestra su teléfono. */
export function esBsuid(contacto: string | null | undefined): boolean {
  return /^(wa_)?[A-Z]{2}\./.test(contacto ?? '');
}

// Los países que la persona NOMBRA en lo que escribe. Colombia no cuenta como
// señal: es el país de casi todos y no dice nada de su interés.
const PAISES_EN_TEXTO: [RegExp, string][] = [
  [/canad[aá]/i, 'Canadá'],
  [/estados\s+unidos|\bee\.?\s?uu\b|\busa\b|\bu\.s\.a?\b/i, 'Estados Unidos'],
  [/m[eé]xico/i, 'México'],
  [/\bper[uú]\b/i, 'Perú'],
  [/bolivia/i, 'Bolivia'],
  [/\bchile\b/i, 'Chile'],
  [/brasil|brazil/i, 'Brasil'],
  [/ecuador/i, 'Ecuador'],
  [/panam[aá]/i, 'Panamá'],
  [/costa\s+rica/i, 'Costa Rica'],
  [/guatemala/i, 'Guatemala'],
  [/honduras/i, 'Honduras'],
  [/el\s+salvador/i, 'El Salvador'],
  [/rep[uú]blica\s+dominicana/i, 'República Dominicana'],
  [/puerto\s+rico/i, 'Puerto Rico'],
  [/espa[nñ]a/i, 'España'],
  [/venezuela/i, 'Venezuela'],
  [/argentina/i, 'Argentina'],
];

export function paisesNombrados(texto: string): string[] {
  return PAISES_EN_TEXTO.filter(([re]) => re.test(texto)).map(([, nombre]) => nombre);
}
