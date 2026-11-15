/**
 * Copyright © 2026 CreaTuActivo.com
 *
 * Las convocatorias privadas de /vip/{evento}. Dos modalidades:
 * - presencial: cada hora es una mesa redonda con la silla de Luis y cuatro sillas
 *   para reservar (la primera, Villavicencio, 10 nov 2026). Se cierra cuando empieza.
 * - en_linea: una sola hora con un cupo (`sillas`); la persona no elige silla, el
 *   servidor le da el primer puesto libre (la tabla no cambia). Se cierra una hora
 *   después de empezar, para quien llega tarde. El enlace de la reunión NO va aquí
 *   (este archivo llega al navegador): vive en src/lib/mesas-reunion.ts, solo de
 *   servidor, y se entrega después de reservar.
 *
 * Una convocatoria nueva se agrega aquí: la página, la ruta y la tabla
 * `reservas_mesa` la toman sin más cambios.
 */

export interface Mesa {
  /** Lo que se guarda en `reservas_mesa.evento`. */
  id: string;
  /** Sin el campo, presencial. */
  modalidad?: 'presencial' | 'en_linea';
  /** Minutos que dura cada hora, para el calendario. Sin el campo, 60. */
  duracionMin?: number;
  /** Título del evento en el calendario. Sin el campo, el de la mesa presencial. */
  tituloCalendario?: string;
  /** AAAA-MM-DD, en Bogotá. */
  fecha: string;
  fechaTexto: string;
  ciudad: string;
  lugar: string;
  /** Vacíos en una convocatoria en línea. */
  direccion: string;
  mapa: string;
  /** HH:MM, 24 horas. */
  horarios: string[];
  sillas: number;
  /**
   * En línea: cupo aparte para invitados (prospectos que llegan por el enlace de un
   * socio, /{slug}/taller). Ocupan los puestos PRIMER_PUESTO_INVITADO en adelante,
   * para que no le quiten puesto al equipo. Sin el campo, no hay invitados.
   */
  cupoInvitados?: number;
  /** constructor_id de quien presenta: a él le llega el push de cada reserva. */
  anfitrion: string;
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
    anfitrion: 'luis-cabrejo-1288',
  },
  taller: {
    id: 'taller-dos-socios-2026-11-16',
    modalidad: 'en_linea',
    duracionMin: 120,
    tituloCalendario: 'Taller privado · Dos socios nuevos',
    fecha: '2026-11-16',
    fechaTexto: 'Lunes 16 de noviembre',
    ciudad: 'En línea',
    lugar: 'En línea · el enlace le llega al reservar',
    direccion: '',
    mapa: '',
    horarios: ['09:00'],
    sillas: 30,
    cupoInvitados: 20,
    anfitrion: 'luis-cabrejo-1288',
  },
};

export const enLinea = (mesa: Mesa) => mesa.modalidad === 'en_linea';

/** Los invitados se numeran desde aquí: 101, 102… (los distribuidores, 1 a `sillas`). */
export const PRIMER_PUESTO_INVITADO = 101;
export const esPuestoInvitado = (puesto: number) => puesto >= PRIMER_PUESTO_INVITADO;

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
  const gracia = enLinea(mesa) ? 60 * 60 * 1000 : 0;
  return ahora.getTime() >= inicioDe(mesa, hhmm).getTime() + gracia;
}

/** Deja solo dígitos; un celular colombiano de 10 dígitos recibe el 57. */
export function normalizarWhatsapp(crudo: string): string | null {
  const d = (crudo || '').replace(/\D/g, '');
  if (/^3\d{9}$/.test(d)) return `57${d}`;
  if (/^\d{11,15}$/.test(d)) return d;
  return null;
}

/** Enlace para guardar la convocatoria en Google Calendar. En línea, con el enlace de la reunión. */
export function enlaceCalendario(mesa: Mesa, hhmm: string, reunion?: string | null): string {
  const ini = inicioDe(mesa, hhmm);
  const fin = new Date(ini.getTime() + (mesa.duracionMin ?? 60) * 60 * 1000);
  const f = (d: Date) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const p = new URLSearchParams({
    action: 'TEMPLATE',
    text: mesa.tituloCalendario ?? 'Mesa privada · Cómo construir su propio activo',
    dates: `${f(ini)}/${f(fin)}`,
    details: reunion
      ? `Presenta Luis Cabrejo · Entrar: ${reunion}`
      : 'Presenta Luis Cabrejo · creatuactivo.com',
    location: enLinea(mesa) ? reunion || 'En línea' : `${mesa.lugar}, ${mesa.direccion}, ${mesa.ciudad}`,
  });
  return `https://calendar.google.com/calendar/render?${p.toString()}`;
}
