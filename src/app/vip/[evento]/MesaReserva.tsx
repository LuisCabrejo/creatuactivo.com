'use client';
/**
 * Copyright © 2026 CreaTuActivo.com
 *
 * La mesa redonda de /vip/{evento}: se elige la hora, después la silla, y se deja
 * nombre y WhatsApp. Arriba de la mesa, la silla de Luis (fija, con su nombre); las
 * otras cuatro, libres o reservadas. Las sillas tomadas se refrescan cada 20 s y al
 * volver a la pestaña; si dos personas tocan la misma, la ruta le responde 409 a la
 * segunda y aquí se recarga la mesa.
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Mesa } from '@/lib/mesas';
import { enlaceCalendario, horaCerrada, horaTexto } from '@/lib/mesas';

const ORO = '#C5A059';
const TITANIO = '#94A3B8';
const CIAN = '#22D3EE';
const TEXTO = '#E5E5E5';
const ELEVADO = '#15171C';
const BORDE = 'rgba(255,255,255,0.1)';

type Ocupadas = Record<string, number[]>;
type Reserva = { horario: string; silla: number; nombre: string };

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

export default function MesaReserva({ evento, mesa }: { evento: string; mesa: Mesa }) {
  const [ocupadas, setOcupadas] = useState<Ocupadas | null>(null);
  const [errorCarga, setErrorCarga] = useState(false);
  const [horario, setHorario] = useState<string | null>(null);
  const [silla, setSilla] = useState<number | null>(null);
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
      setOcupadas(j.ocupadas);
      setErrorCarga(false);
    } catch {
      setErrorCarga(true);
    }
    setAhora(new Date());
  }, [evento]);

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

  const libresDe = useCallback(
    (h: string) => mesa.sillas - (ocupadas?.[h]?.length ?? 0),
    [mesa.sillas, ocupadas]
  );

  // La primera hora abierta con sillas libres queda elegida al cargar.
  useEffect(() => {
    if (!ocupadas || horario) return;
    const primera = mesa.horarios.find((h) => !horaCerrada(mesa, h, ahora) && libresDe(h) > 0);
    if (primera) setHorario(primera);
  }, [ocupadas, horario, mesa, ahora, libresDe]);

  // Si la silla elegida la tomó otra persona, se suelta.
  useEffect(() => {
    if (horario && silla && ocupadas?.[horario]?.includes(silla)) setSilla(null);
  }, [ocupadas, horario, silla]);

  const tomadas = useMemo(() => new Set(horario ? ocupadas?.[horario] ?? [] : []), [ocupadas, horario]);

  async function reservar(e: React.FormEvent) {
    e.preventDefault();
    if (!horario || !silla) return;
    setEnviando(true);
    setError(null);
    try {
      const r = await fetch('/api/mesa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ evento, horario, silla, nombre, whatsapp }),
      });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) {
        setError(j.error || 'No se pudo reservar. Intente de nuevo.');
        if (j.tomada) {
          setSilla(null);
          cargar();
        }
        return;
      }
      setReserva({ horario, silla, nombre: nombre.trim().split(/\s+/)[0] });
      cargar();
    } catch {
      setError('No se pudo reservar. Revise su conexión e intente de nuevo.');
    } finally {
      setEnviando(false);
    }
  }

  const contenedor: React.CSSProperties = {
    maxWidth: 480,
    margin: '0 auto',
    padding: '0 16px 64px',
    color: TEXTO,
  };

  if (reserva) {
    return (
      <section style={contenedor}>
        <div
          style={{
            background: ELEVADO,
            border: `1px solid rgba(197,160,89,0.35)`,
            borderRadius: 12,
            padding: '2rem 1.5rem',
            textAlign: 'center',
          }}
        >
          <p style={{ ...etiqueta, color: CIAN }}>Silla reservada</p>
          <h2
            style={{
              fontFamily: 'var(--font-serif)',
              fontWeight: 500,
              fontSize: '1.9rem',
              color: '#FFFFFF',
              margin: '0.9rem 0 1.25rem',
              lineHeight: 1.2,
            }}
          >
            Nos vemos el martes, {reserva.nombre}.
          </h2>
          <MesaRedonda hora={horaTexto(reserva.horario)} tomadas={new Set()} elegida={reserva.silla} soloLectura />
          <p style={{ margin: '1.25rem 0 0.25rem', fontSize: '1.05rem', color: '#FFFFFF' }}>
            {mesa.fechaTexto} · {horaTexto(reserva.horario)} · silla {reserva.silla}
          </p>
          <p style={{ margin: 0, color: 'var(--color-text-body)', lineHeight: 1.6 }}>
            {mesa.lugar}
            <br />
            {mesa.direccion}, {mesa.ciudad}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: '1.75rem' }}>
            <a className="cta-primary" href={enlaceCalendario(mesa, reserva.horario)} target="_blank" rel="noopener noreferrer">
              Guardar en mi calendario
            </a>
            <a className="cta-secondary" href={mesa.mapa} target="_blank" rel="noopener noreferrer">
              Ver cómo llegar
            </a>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section style={contenedor}>
      {/* Cuándo y dónde */}
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
          <p style={{ margin: '0.35rem 0 0', fontSize: '1.15rem', color: '#FFFFFF' }}>{mesa.fechaTexto}</p>
        </div>
        <div>
          <p style={etiqueta}>Dónde</p>
          <p style={{ margin: '0.35rem 0 0', fontSize: '1.15rem', color: '#FFFFFF' }}>{mesa.lugar}</p>
          <p style={{ margin: '0.2rem 0 0', color: 'var(--color-text-body)' }}>
            {mesa.direccion}, {mesa.ciudad} ·{' '}
            <a href={mesa.mapa} target="_blank" rel="noopener noreferrer" style={{ color: ORO }}>
              Ver en el mapa
            </a>
          </p>
        </div>
        <div>
          <p style={etiqueta}>Presenta</p>
          <p style={{ margin: '0.35rem 0 0', fontSize: '1.15rem', color: '#FFFFFF' }}>Luis Cabrejo</p>
        </div>
      </div>

      {/* La hora */}
      <h2
        style={{
          fontFamily: 'var(--font-serif)',
          fontWeight: 500,
          fontSize: '1.75rem',
          color: '#FFFFFF',
          margin: '2.5rem 0 0.5rem',
          textAlign: 'center',
        }}
      >
        Elija su hora y su silla
      </h2>
      <p style={{ margin: '0 0 1.5rem', textAlign: 'center', color: 'var(--color-text-body)', lineHeight: 1.6 }}>
        Cada hora es una mesa redonda: cuatro sillas y la de Luis.
      </p>

      {errorCarga && !ocupadas && (
        <p style={{ textAlign: 'center', color: '#FBBF24' }}>
          No pudimos cargar las mesas. Revise su conexión; lo intentamos de nuevo en unos segundos.
        </p>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
        {mesa.horarios.map((h) => {
          const cerrada = horaCerrada(mesa, h, ahora);
          const libres = libresDe(h);
          const llena = ocupadas !== null && libres <= 0;
          const deshabilitada = !ocupadas || cerrada || llena;
          const activa = h === horario;
          return (
            <button
              key={h}
              type="button"
              disabled={deshabilitada}
              onClick={() => {
                setHorario(h);
                setSilla(null);
                setError(null);
              }}
              aria-pressed={activa}
              style={{
                background: activa ? 'rgba(197,160,89,0.12)' : ELEVADO,
                border: `1px solid ${activa ? ORO : BORDE}`,
                borderRadius: 10,
                padding: '0.8rem 0.25rem',
                cursor: deshabilitada ? 'default' : 'pointer',
                opacity: deshabilitada && ocupadas ? 0.45 : 1,
                color: activa ? '#FFFFFF' : TEXTO,
              }}
            >
              <span style={{ display: 'block', fontSize: '1rem', fontWeight: 500 }}>{horaTexto(h)}</span>
              <span
                style={{
                  display: 'block',
                  marginTop: 4,
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.65rem',
                  letterSpacing: '0.08em',
                  color: activa ? ORO : TITANIO,
                }}
              >
                {!ocupadas ? '…' : cerrada ? 'Cerrada' : llena ? 'Completa' : libres === 1 ? '1 libre' : `${libres} libres`}
              </span>
            </button>
          );
        })}
      </div>

      {/* La mesa */}
      {horario && (
        <div style={{ marginTop: '2rem' }}>
          <MesaRedonda
            hora={horaTexto(horario)}
            tomadas={tomadas}
            elegida={silla}
            onElegir={(n) => {
              setSilla(n);
              setError(null);
            }}
          />
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 18,
              marginTop: 8,
              fontSize: '0.8rem',
              color: 'var(--color-text-body)',
            }}
          >
            <Leyenda color="transparent" borde={TITANIO} texto="Libre" />
            <Leyenda color={ORO} borde={ORO} texto="Su silla" />
            <Leyenda color="#2A2D33" borde="#2A2D33" texto="Reservada" />
          </div>
          {!silla && (
            <p style={{ textAlign: 'center', marginTop: '1rem', color: TITANIO }}>Toque una silla libre.</p>
          )}
        </div>
      )}

      {/* Los datos */}
      {horario && silla && (
        <form onSubmit={reservar} style={{ marginTop: '1.75rem', display: 'grid', gap: 14 }}>
          <p style={{ margin: 0, textAlign: 'center', color: '#FFFFFF', fontSize: '1.05rem' }}>
            {horaTexto(horario)} · silla {silla}
          </p>
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
            {enviando ? 'Reservando…' : 'Reservar mi silla'}
          </button>
        </form>
      )}

      <p style={{ marginTop: '3rem', textAlign: 'center', ...etiqueta, letterSpacing: '0.2em' }}>
        <a href="/" style={{ color: TITANIO, textDecoration: 'none' }}>
          CreaTuActivo.com
        </a>
      </p>
    </section>
  );
}

function Leyenda({ color, borde, texto }: { color: string; borde: string; texto: string }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
      <span style={{ width: 12, height: 12, borderRadius: '50%', background: color, border: `1.5px solid ${borde}` }} />
      {texto}
    </span>
  );
}

/**
 * Mesa redonda vista desde arriba: la silla de Luis arriba y las cuatro numeradas en
 * el sentido del reloj. 72° entre silla y silla.
 */
function MesaRedonda({
  hora,
  tomadas,
  elegida,
  onElegir,
  soloLectura = false,
}: {
  hora: string;
  tomadas: Set<number>;
  elegida: number | null;
  onElegir?: (n: number) => void;
  soloLectura?: boolean;
}) {
  const C = 170;
  const R_SILLA = 122;
  const pos = (k: number) => {
    const a = ((-90 + 72 * k) * Math.PI) / 180;
    return { x: C + R_SILLA * Math.cos(a), y: C + R_SILLA * Math.sin(a) };
  };

  return (
    <svg viewBox="0 0 340 350" style={{ width: '100%', maxWidth: 360, display: 'block', margin: '0 auto' }} role="group" aria-label={`Mesa de las ${hora}`}>
      <defs>
        <radialGradient id="mesa-luz" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="rgba(197,160,89,0.16)" />
          <stop offset="100%" stopColor="rgba(197,160,89,0)" />
        </radialGradient>
      </defs>
      {/* La mesa */}
      <circle cx={C} cy={C} r={74} fill={ELEVADO} stroke="rgba(197,160,89,0.45)" strokeWidth={1.5} />
      <circle cx={C} cy={C} r={74} fill="url(#mesa-luz)" />
      <text x={C} y={C - 6} textAnchor="middle" fill={TITANIO} style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.18em' }}>
        MESA
      </text>
      <text x={C} y={C + 14} textAnchor="middle" fill="#FFFFFF" style={{ fontSize: 15, fontWeight: 500 }}>
        {hora}
      </text>

      {/* La silla de Luis */}
      {(() => {
        const { x, y } = pos(0);
        return (
          <g>
            <circle cx={x} cy={y} r={28} fill="rgba(197,160,89,0.10)" stroke={ORO} strokeWidth={1.5} />
            <Figura x={x} y={y} color={ORO} />
            <text x={x} y={y - 38} textAnchor="middle" fill={ORO} style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.14em' }}>
              LUIS CABREJO
            </text>
          </g>
        );
      })()}

      {/* Las cuatro sillas */}
      {[1, 2, 3, 4].map((n) => {
        const { x, y } = pos(n);
        const tomada = tomadas.has(n);
        const suya = elegida === n;
        const relleno = suya ? ORO : tomada ? '#2A2D33' : 'transparent';
        const trazo = suya ? ORO : tomada ? '#2A2D33' : TITANIO;
        const figura = suya ? '#0F1115' : tomada ? '#4B5058' : TITANIO;
        const tocable = !soloLectura && !tomada && !!onElegir;
        return (
          <g
            key={n}
            role={tocable ? 'button' : undefined}
            tabIndex={tocable ? 0 : undefined}
            aria-label={tomada ? `Silla ${n}, reservada` : `Silla ${n}${suya ? ', su silla' : ', libre'}`}
            aria-pressed={tocable ? suya : undefined}
            onClick={tocable ? () => onElegir!(n) : undefined}
            onKeyDown={
              tocable
                ? (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onElegir!(n);
                    }
                  }
                : undefined
            }
            style={{ cursor: tocable ? 'pointer' : 'default', outline: 'none' }}
          >
            {/* Área de toque más amplia que la silla */}
            <circle cx={x} cy={y} r={36} fill="transparent" />
            <circle cx={x} cy={y} r={28} fill={relleno} stroke={trazo} strokeWidth={1.5} strokeDasharray={!suya && !tomada ? '4 3' : undefined} />
            <Figura x={x} y={y} color={figura} />
            <text
              x={x}
              y={y + (y > C ? 46 : -38)}
              textAnchor="middle"
              fill={suya ? ORO : TITANIO}
              style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.12em' }}
            >
              {tomada ? 'RESERVADA' : suya ? 'SU SILLA' : `SILLA ${n}`}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/** Una persona vista de frente: cabeza y hombros. */
function Figura({ x, y, color }: { x: number; y: number; color: string }) {
  return (
    <g fill={color}>
      <circle cx={x} cy={y - 7} r={7} />
      <path d={`M ${x - 13} ${y + 15} Q ${x - 13} ${y + 2} ${x} ${y + 2} Q ${x + 13} ${y + 2} ${x + 13} ${y + 15} Z`} />
    </g>
  );
}
