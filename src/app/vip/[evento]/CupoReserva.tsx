'use client';
/**
 * Copyright © 2026 CreaTuActivo.com
 *
 * La reserva de un puesto en una convocatoria EN LÍNEA de /vip/{evento} (taller del
 * 16 nov 2026): el cupo que queda a la vista, nombre y WhatsApp, y al reservar el
 * enlace de la reunión, que no está en la página (lo devuelve /api/mesa). El cupo se
 * refresca cada 20 s y al volver a la pestaña. La versión presencial es MesaReserva.
 */
import { useCallback, useEffect, useState } from 'react';
import type { Mesa } from '@/lib/mesas';
import { enlaceCalendario, horaCerrada, horaTexto } from '@/lib/mesas';

const ORO = '#C5A059';
const TITANIO = '#94A3B8';
const CIAN = '#22D3EE';
const TEXTO = '#E5E5E5';
const ELEVADO = '#15171C';
const BORDE = 'rgba(255,255,255,0.1)';

const etiqueta: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: '0.72rem',
  letterSpacing: '0.18em',
  textTransform: 'uppercase',
  color: TITANIO,
  margin: 0,
};

const campo: React.CSSProperties = {
  width: '100%',
  boxSizing: 'border-box',
  background: '#0F1115',
  border: `1px solid ${BORDE}`,
  borderRadius: 8,
  padding: '0.85rem 1rem',
  color: TEXTO,
  fontSize: '1rem',
  outline: 'none',
};

const LO_QUE_SE_LLEVA = [
  'A quién invitar primero, y cómo abrir la conversación',
  'Una clínica en vivo: verá a Luis presentar una conversación real',
  'Su meta escrita en queswa.app, con fecha: 14 de diciembre',
];

type Reserva = { nombre: string; reunion: string | null };

export default function CupoReserva({ evento, mesa }: { evento: string; mesa: Mesa }) {
  const horario = mesa.horarios[0];
  const [tomados, setTomados] = useState<number | null>(null);
  const [nombre, setNombre] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reserva, setReserva] = useState<Reserva | null>(null);
  const [ahora, setAhora] = useState(() => new Date());

  const cargar = useCallback(async () => {
    try {
      const r = await fetch(`/api/mesa?evento=${encodeURIComponent(evento)}`, { cache: 'no-store' });
      if (!r.ok) throw new Error(String(r.status));
      const j = await r.json();
      setTomados((j.ocupadas?.[horario] ?? []).length);
    } catch {
      /* el cupo se vuelve a pedir en 20 s */
    }
    setAhora(new Date());
  }, [evento, horario]);

  useEffect(() => {
    cargar();
    const t = setInterval(cargar, 20_000);
    const alVolver = () => document.visibilityState === 'visible' && cargar();
    document.addEventListener('visibilitychange', alVolver);
    return () => {
      clearInterval(t);
      document.removeEventListener('visibilitychange', alVolver);
    };
  }, [cargar]);

  const libres = tomados === null ? null : Math.max(0, mesa.sillas - tomados);
  const cerrada = horaCerrada(mesa, horario, ahora);
  const lleno = libres === 0;

  async function reservar(e: React.FormEvent) {
    e.preventDefault();
    setEnviando(true);
    setError(null);
    try {
      const r = await fetch('/api/mesa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ evento, horario, nombre, whatsapp }),
      });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) {
        setError(j.error || 'No se pudo reservar. Intente de nuevo.');
        cargar();
        return;
      }
      setReserva({ nombre: nombre.trim().split(/\s+/)[0], reunion: j.reunion || null });
      cargar();
    } catch {
      setError('No se pudo reservar. Revise su conexión e intente de nuevo.');
    } finally {
      setEnviando(false);
    }
  }

  const contenedor: React.CSSProperties = { maxWidth: 480, margin: '0 auto', padding: '0 16px 64px', color: TEXTO };
  const cuando = `${mesa.fechaTexto} · ${horaTexto(horario)} a ${horaTexto(finDe(horario, mesa.duracionMin ?? 60))}`;

  if (reserva) {
    return (
      <section style={contenedor}>
        <div
          style={{
            background: ELEVADO,
            border: '1px solid rgba(197,160,89,0.35)',
            borderRadius: 12,
            padding: '2rem 1.5rem',
            textAlign: 'center',
          }}
        >
          <p style={{ ...etiqueta, color: CIAN }}>Puesto reservado</p>
          <h2
            style={{
              fontFamily: 'var(--font-serif)',
              fontWeight: 500,
              fontSize: '1.9rem',
              color: '#FFFFFF',
              margin: '0.9rem 0 1rem',
              lineHeight: 1.2,
            }}
          >
            Nos vemos el lunes, {reserva.nombre}.
          </h2>
          <p style={{ margin: 0, fontSize: '1.05rem', color: '#FFFFFF' }}>{cuando}</p>
          <p style={{ margin: '0.25rem 0 0', color: 'var(--color-text-body)' }}>En línea · con Luis Cabrejo</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: '1.75rem' }}>
            <a className="cta-primary" href={enlaceCalendario(mesa, horario, reserva.reunion)} target="_blank" rel="noopener noreferrer">
              Guardar en mi calendario
            </a>
            {reserva.reunion ? (
              <a className="cta-secondary" href={reserva.reunion} target="_blank" rel="noopener noreferrer">
                Enlace para entrar al taller
              </a>
            ) : (
              <p style={{ margin: 0, color: 'var(--color-text-body)', lineHeight: 1.6 }}>
                El enlace para entrar le llega por WhatsApp antes de las 9:00 a. m.
              </p>
            )}
          </div>

          <div style={{ marginTop: '1.75rem', paddingTop: '1.25rem', borderTop: `1px solid ${BORDE}`, textAlign: 'left' }}>
            <p style={etiqueta}>Para llegar listo</p>
            <p style={{ margin: '0.5rem 0 0', lineHeight: 1.6 }}>
              Anote diez contactos a los que le gustaría ver crecer con usted. En el taller elegimos por cuáles empezar.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section style={contenedor}>
      {/* Cuándo y cómo */}
      <div
        style={{
          background: ELEVADO,
          border: `1px solid ${BORDE}`,
          borderRadius: 12,
          padding: '1.5rem',
          display: 'grid',
          gap: '1.1rem',
        }}
      >
        <div>
          <p style={etiqueta}>Cuándo</p>
          <p style={{ margin: '0.35rem 0 0', fontSize: '1.15rem', color: '#FFFFFF' }}>{cuando}</p>
        </div>
        <div>
          <p style={etiqueta}>Dónde</p>
          <p style={{ margin: '0.35rem 0 0', fontSize: '1.15rem', color: '#FFFFFF' }}>En línea</p>
          <p style={{ margin: '0.2rem 0 0', color: 'var(--color-text-body)' }}>El enlace le llega al reservar.</p>
        </div>
        <div>
          <p style={etiqueta}>Presenta</p>
          <p style={{ margin: '0.35rem 0 0', fontSize: '1.15rem', color: '#FFFFFF' }}>Luis Cabrejo</p>
        </div>
      </div>

      {/* Lo que se lleva */}
      <h2
        style={{
          fontFamily: 'var(--font-serif)',
          fontWeight: 500,
          fontSize: '1.6rem',
          color: '#FFFFFF',
          margin: '2.5rem 0 1rem',
          textAlign: 'center',
        }}
      >
        Sale con su plan para sumar dos socios nuevos
      </h2>
      <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 12 }}>
        {LO_QUE_SE_LLEVA.map((t) => (
          <li key={t} style={{ display: 'flex', gap: 12, alignItems: 'baseline', lineHeight: 1.55 }}>
            <span style={{ color: ORO, flexShrink: 0 }}>◆</span>
            <span>{t}</span>
          </li>
        ))}
      </ul>
      <p
        style={{
          margin: '1.5rem 0 0',
          padding: '1rem 1.1rem',
          border: '1px solid rgba(197,160,89,0.35)',
          borderRadius: 10,
          lineHeight: 1.55,
          textAlign: 'center',
        }}
      >
        Quien complete el taller recibe su <span style={{ color: ORO }}>insignia en queswa.app</span> y su diploma digital.
      </p>

      {/* El cupo */}
      <div style={{ marginTop: '2.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <p style={etiqueta}>Cupos</p>
          <p style={{ margin: 0, fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: lleno ? ORO : TEXTO }}>
            {libres === null ? '…' : lleno ? 'Completo' : libres === 1 ? 'Queda 1 de ' + mesa.sillas : `Quedan ${libres} de ${mesa.sillas}`}
          </p>
        </div>
        <div style={{ marginTop: 8, height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
          <div
            style={{
              height: '100%',
              width: `${tomados === null ? 0 : Math.min(100, (tomados / mesa.sillas) * 100)}%`,
              background: ORO,
              borderRadius: 3,
              transition: 'width 0.5s ease',
            }}
          />
        </div>
      </div>

      {/* Los datos */}
      {cerrada ? (
        <p style={{ marginTop: '1.75rem', textAlign: 'center', color: TITANIO }}>Las inscripciones ya se cerraron.</p>
      ) : lleno ? (
        <p style={{ marginTop: '1.75rem', textAlign: 'center', color: TITANIO }}>
          Los cupos se completaron. Escríbale a quien le compartió este enlace.
        </p>
      ) : (
        <form onSubmit={reservar} style={{ marginTop: '1.75rem', display: 'grid', gap: 14 }}>
          <label style={{ display: 'grid', gap: 6 }}>
            <span style={etiqueta}>Su nombre</span>
            <input
              style={campo}
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              autoComplete="name"
              required
              minLength={2}
              maxLength={80}
            />
          </label>
          <label style={{ display: 'grid', gap: 6 }}>
            <span style={etiqueta}>Su WhatsApp</span>
            <input
              style={campo}
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="300 123 4567"
              required
            />
          </label>
          {error && <p style={{ margin: 0, color: '#F43F5E', textAlign: 'center' }}>{error}</p>}
          <button type="submit" className="cta-primary" disabled={enviando} style={{ marginTop: 6 }}>
            {enviando ? 'Reservando…' : 'Reservar mi puesto'}
          </button>
        </form>
      )}

      <p style={{ ...etiqueta, margin: '4.5rem 0 0', textAlign: 'center', letterSpacing: '0.2em' }}>
        <a href="/" style={{ color: TITANIO, textDecoration: 'none' }}>
          CreaTuActivo.com
        </a>
      </p>
    </section>
  );
}

/** «09:00» + 120 min → «11:00». */
function finDe(hhmm: string, minutos: number): string {
  const [h, m] = hhmm.split(':').map(Number);
  const t = h * 60 + m + minutos;
  return `${String(Math.floor(t / 60) % 24).padStart(2, '0')}:${String(t % 60).padStart(2, '0')}`;
}
