/**
 * Copyright © 2026 CreaTuActivo.com
 *
 * Las mesas privadas presenciales (/vip/{evento}): cada hora es una mesa redonda con
 * la silla de Luis y cuatro sillas para reservar. La primera, en la oficina de Gano
 * Excel de Villavicencio, el martes 10 de noviembre de 2026.
 *
 * Una mesa nueva se agrega aquí: la página, la ruta y la tabla `reservas_mesa` la
 * toman sin más cambios. Una hora se cierra cuando empieza (hora de Bogotá).
 */

export interface Mesa {
  /** Lo que se guarda en `reservas_mesa.evento`. */
  id: string;
  /** AAAA-MM-DD, en Bogotá. */
  fecha: string;
  fechaTexto: string;
  ciudad: string;
  lugar: string;
  direccion: string;
  mapa: string;
  /** HH:MM, 24 horas. */
  horarios: string[];
  sillas: number;
}

export const MESAS: Record<string, Mesa> = {
  villavicencio: {
    id: 'villavicencio-2026-11-10',
    fecha: '2026-11-10',
    fechaTexto: 'Martes 10 de noviembre',
    ciudad: 'Villavicencio',
    lugar: 'Oficina de Gano Excel',
    direccion: 'Avenida 40 # 20-37, 7 de Agosto',
    mapa: 'https://www.google.com/maps/search/?api=1&query=Gano+Excel+Avenida+40+%2320-37+Villavicencio',
    horarios: ['10:00', '11:00', '14:00', '15:00', '16:00', '17:00'],
    sillas: 4,
  },
};

/** «14:00» → «2:00 p. m.» */
export function horaTexto(hhmm: string): string {
  const [h, m] = hhmm.split(':').map(Number);
  const sufijo = h < 12 ? 'a. m.' : 'p. m.';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(m).padStart(2, '0')} ${sufijo}`;
}

/** Inicio de la hora en Bogotá (UTC−5, sin horario de verano). */
export function inicioDe(mesa: Mesa, hhmm: string): Date {
  return new Date(`${mesa.fecha}T${hhmm}:00-05:00`);
}

export function horaCerrada(mesa: Mesa, hhmm: string, ahora = new Date()): boolean {
  return ahora.getTime() >= inicioDe(mesa, hhmm).getTime();
}

/** Deja solo dígitos; un celular colombiano de 10 dígitos recibe el 57. */
export function normalizarWhatsapp(crudo: string): string | null {
  const d = (crudo || '').replace(/\D/g, '');
  if (/^3\d{9}$/.test(d)) return `57${d}`;
  if (/^\d{11,15}$/.test(d)) return d;
  return null;
}

/** Enlace para guardar la mesa en Google Calendar (una hora). */
export function enlaceCalendario(mesa: Mesa, hhmm: string): string {
  const ini = inicioDe(mesa, hhmm);
  const fin = new Date(ini.getTime() + 60 * 60 * 1000);
  const f = (d: Date) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const p = new URLSearchParams({
    action: 'TEMPLATE',
    text: 'Mesa privada · Cómo construir su propio activo',
    dates: `${f(ini)}/${f(fin)}`,
    details: 'Presenta Luis Cabrejo · creatuactivo.com',
    location: `${mesa.lugar}, ${mesa.direccion}, ${mesa.ciudad}`,
  });
  return `https://calendar.google.com/calendar/render?${p.toString()}`;
}
