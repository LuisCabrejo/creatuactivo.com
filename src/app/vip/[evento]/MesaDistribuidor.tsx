'use client';
/**
 * Copyright © 2026 CreaTuActivo.com
 *
 * La mesa del distribuidor (Mesa.modalidad 'por_distribuidor', 18 nov 2026): el
 * distribuidor elige una hora libre, y esa hora es su mesa. Escribe su nombre, su
 * WhatsApp y el nombre de sus prospectos (de uno a tres); mientras escribe, cada
 * nombre se sienta en la mesa. Luis presenta. La meta de la mesa son sus dos
 * primeros distribuidores.
 *
 * Las horas tomadas se refrescan cada 20 s y al volver a la pestaña; si dos
 * distribuidores tocan la misma, la ruta le responde 409 al segundo y aquí se
 * recarga. Del prospecto no se pide teléfono: lo lleva el distribuidor.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import type { Mesa } from '@/lib/mesas';
import { SILLA_DISTRIBUIDOR, enlaceCalendario, horaCerrada, horaTexto } from '@/lib/mesas';

const ORO = '#C5A059';
const TITANIO = '#94A3B8';
const CIAN = '#22D3EE';
const TEXTO = '#E5E5E5';
const ELEVADO = '#15171C';
const BORDE = 'rgba(255,255,255,0.1)';
/** Los prospectos en la mesa: blanco (el oro es de Luis y del distribuidor; el cian, solo para datos). */
const PROSPECTO = '#E5E5E5';

type Ocupadas = Record<string, number[]>;
type Nombres = Record<string, Record<number, string>>;
type Reserva = { horario: string; nombre: string; prospectos: string[] };

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

const primero = (s: string) => s.trim().split(/\s+/)[0] || '';
/** «11:00 a. m.» sin que «a. m.» se parta entre dos líneas. */
const hora = (h: string) => horaTexto(h).replace(/ /g, '\u00a0');

export default function MesaDistribuidor({ evento, mesa }: { evento: string; mesa: Mesa }) {
  const cupo = mesa.sillas - 1;
  const [ocupadas, setOcupadas] = useState<Ocupadas | null>(null);
  const [nombres, setNombres] = useState<Nombres>({});
  const [errorCarga, setErrorCarga] = useState(false);
  const [horario, setHorario] = useState<string | null>(null);
  const [nombre, setNombre] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [prospectos, setProspectos] = useState<string[]>(() => Array(cupo).fill(''));
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reserva, setReserva] = useState<Reserva | null>(null);
  const [ahora, setAhora] = useState(() => new Date());
  const formRef = useRef<HTMLFormElement>(null);

  const cargar = useCallback(async () => {
    try {
      const r = await fetch(`/api/mesa?evento=${encodeURIComponent(evento)}`, { cache: 'no-store' });
      if (!r.ok) throw new Error(String(r.status));
      const j = await r.json();
      setOcupadas(j.ocupadas);
      setNombres(j.nombres || {});
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

  const tomada = useCallback((h: string) => !!ocupadas?.[h]?.includes(SILLA_DISTRIBUIDOR), [ocupadas]);

  // Si la hora elegida la tomó otro distribuidor, se suelta.
  useEffect(() => {
    if (horario && tomada(horario)) setHorario(null);
  }, [horario, tomada]);

  // Al elegir la hora, la página baja al formulario (en el celular queda fuera de la pantalla).
  useEffect(() => {
    if (!horario) return;
    const t = setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60);
    return () => clearTimeout(t);
  }, [horario]);

  async function reservar(e: React.FormEvent) {
    e.preventDefault();
    if (!horario) return;
    const lista = prospectos.map((p) => p.trim()).filter(Boolean);
    if (!lista.length) {
      setError('Escriba el nombre de al menos un prospecto.');
      return;
    }
    setEnviando(true);
    setError(null);
    try {
      const r = await fetch('/api/mesa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ evento, horario, nombre, whatsapp, prospectos: lista }),
      });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) {
        setError(j.error || 'No se pudo reservar. Intente de nuevo.');
        if (j.tomada) {
          setHorario(null);
          cargar();
        }
        return;
      }
      setReserva({ horario, nombre: primero(nombre), prospectos: lista });
      cargar();
    } catch {
      setError('No se pudo reservar. Revise su conexión e intente de nuevo.');
    } finally {
      setEnviando(false);
    }
  }

  const contenedor: React.CSSProperties = { maxWidth: 480, margin: '0 auto', padding: '0 16px 64px', color: TEXTO };

  if (reserva) {
    const mensaje =
      `Le reservé un puesto en mi mesa el ${mesa.fechaTexto.toLocaleLowerCase('es')} a las ${horaTexto(reserva.horario)}, ` +
      `en la ${mesa.lugar.toLocaleLowerCase('es')}: ${mesa.direccion}, ${mesa.ciudad}. ` +
      `Ahí le presentamos el negocio con calma. Cómo llegar: ${mesa.mapa}`;
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
          <p style={{ ...etiqueta, color: CIAN }}>Mesa reservada</p>
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
            La mesa de las {hora(reserva.horario)} es suya, {reserva.nombre}.
          </h2>
          <MesaVista hora={horaTexto(reserva.horario)} distribuidor={reserva.nombre} prospectos={reserva.prospectos} cupo={cupo} />
          <p style={{ margin: '1.25rem 0 0.25rem', fontSize: '1.05rem', color: '#FFFFFF' }}>
            {mesa.fechaTexto} · {hora(reserva.horario)}
          </p>
          <p style={{ margin: 0, color: 'var(--color-text-body)', lineHeight: 1.6 }}>
            {mesa.lugar}
            <br />
            {mesa.direccion}, {mesa.ciudad}
          </p>
          <p style={{ margin: '1.25rem 0 0', color: 'var(--color-text-body)', lineHeight: 1.6 }}>
            Llegue diez minutos antes con sus prospectos. Mándeles la hora y la ubicación desde aquí:
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: '1rem' }}>
            <a className="cta-primary" href={`https://wa.me/?text=${encodeURIComponent(mensaje)}`} target="_blank" rel="noopener noreferrer">
              Enviar a mis prospectos
            </a>
            <a className="cta-secondary" href={enlaceCalendario(mesa, reserva.horario)} target="_blank" rel="noopener noreferrer">
              Guardar en mi calendario
            </a>
            <a className="cta-ghost" href={mesa.mapa} target="_blank" rel="noopener noreferrer">
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

      {/* Cómo funciona */}
      <h2
        style={{
          fontFamily: 'var(--font-serif)',
          fontWeight: 500,
          fontSize: '1.75rem',
          color: '#FFFFFF',
          margin: '2.5rem 0 0.75rem',
          textAlign: 'center',
        }}
      >
        Elija la hora de su mesa
      </h2>
      <p style={{ margin: '0 0 1.5rem', textAlign: 'center', color: 'var(--color-text-body)', lineHeight: 1.6 }}>
        Cada hora es la mesa de un solo distribuidor. Usted sienta a sus prospectos, hasta {cupo}, y Luis les presenta el
        negocio con usted al lado.
      </p>

      {errorCarga && !ocupadas && (
        <p style={{ textAlign: 'center', color: '#FBBF24' }}>
          No pudimos cargar las mesas. Revise su conexión; lo intentamos de nuevo en unos segundos.
        </p>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
        {mesa.horarios.map((h) => {
          const cerrada = horaCerrada(mesa, h, ahora);
          const ocupada = tomada(h);
          const deshabilitada = !ocupadas || cerrada || ocupada;
          const activa = h === horario;
          const de = nombres[h]?.[SILLA_DISTRIBUIDOR];
          return (
            <button
              key={h}
              type="button"
              disabled={deshabilitada}
              onClick={() => {
                setHorario(h);
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
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  padding: '0 4px',
                }}
              >
                {!ocupadas ? '…' : cerrada ? 'Cerrada' : ocupada ? (de ? `Mesa de ${de}` : 'Reservada') : 'Libre'}
              </span>
            </button>
          );
        })}
      </div>

      {/* La mesa y los datos */}
      {horario && (
        <form ref={formRef} onSubmit={reservar} style={{ marginTop: '2rem', display: 'grid', gap: 14, scrollMarginTop: 16 }}>
          <MesaVista
            hora={horaTexto(horario)}
            distribuidor={primero(nombre)}
            prospectos={prospectos.map((p) => p.trim())}
            cupo={cupo}
          />
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

          <p style={{ ...etiqueta, marginTop: 10 }}>Sus prospectos en la mesa</p>
          <p style={{ margin: '-6px 0 0', fontSize: '0.92rem', color: 'var(--color-text-body)', lineHeight: 1.5 }}>
            Solo el nombre. La meta de esta mesa: sus dos primeros distribuidores.
          </p>
          {prospectos.map((p, i) => (
            <input
              key={i}
              style={campo}
              value={p}
              onChange={(e) => setProspectos((prev) => prev.map((v, k) => (k === i ? e.target.value : v)))}
              placeholder={i === 0 ? 'Prospecto 1' : `Prospecto ${i + 1} (opcional)`}
              aria-label={`Prospecto ${i + 1}`}
              autoComplete="off"
              required={i === 0}
              maxLength={80}
            />
          ))}

          {error && <p style={{ margin: 0, color: '#F43F5E', textAlign: 'center' }}>{error}</p>}
          <button type="submit" className="cta-primary" disabled={enviando} style={{ marginTop: 6 }}>
            {enviando ? 'Reservando…' : `Reservar mi mesa de las ${horaTexto(horario)}`}
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

/**
 * La mesa vista desde arriba: Luis arriba, el distribuidor en la silla siguiente y
 * sus prospectos alrededor. Cada nombre se sienta mientras se escribe.
 */
function MesaVista({
  hora,
  distribuidor,
  prospectos,
  cupo,
}: {
  hora: string;
  distribuidor: string;
  prospectos: string[];
  cupo: number;
}) {
  const C = 170;
  const R = 122;
  const total = cupo + 2;
  const paso = 360 / total;
  const pos = (k: number) => {
    const a = ((-90 + paso * k) * Math.PI) / 180;
    return { x: C + R * Math.cos(a), y: C + R * Math.sin(a) };
  };
  const corto = (s: string) => {
    const t = primero(s).toLocaleUpperCase('es');
    return t.length > 11 ? `${t.slice(0, 10)}…` : t;
  };

  const sillas = [
    { rotulo: 'LUIS CABREJO', color: ORO, lleno: true, fijo: true },
    { rotulo: distribuidor ? corto(distribuidor) : 'USTED', color: ORO, lleno: !!distribuidor, fijo: false },
    ...Array.from({ length: cupo }, (_, i) => {
      const p = prospectos[i] || '';
      return { rotulo: p ? corto(p) : `PROSPECTO ${i + 1}`, color: p ? PROSPECTO : TITANIO, lleno: !!p, fijo: false };
    }),
  ];

  return (
    <svg viewBox="0 0 340 350" style={{ width: '100%', maxWidth: 360, display: 'block', margin: '0 auto' }} role="img" aria-label={`Su mesa de las ${hora}`}>
      <defs>
        <radialGradient id="mesa-distribuidor-luz" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="rgba(197,160,89,0.16)" />
          <stop offset="100%" stopColor="rgba(197,160,89,0)" />
        </radialGradient>
      </defs>
      <circle cx={C} cy={C} r={74} fill={ELEVADO} stroke="rgba(197,160,89,0.45)" strokeWidth={1.5} />
      <circle cx={C} cy={C} r={74} fill="url(#mesa-distribuidor-luz)" />
      <text x={C} y={C - 6} textAnchor="middle" fill={TITANIO} style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.18em' }}>
        SU MESA
      </text>
      <text x={C} y={C + 14} textAnchor="middle" fill="#FFFFFF" style={{ fontSize: 15, fontWeight: 500 }}>
        {hora}
      </text>
      {sillas.map((s, k) => {
        const { x, y } = pos(k);
        const vacia = !s.lleno;
        return (
          <g key={k}>
            <circle
              cx={x}
              cy={y}
              r={26}
              fill={s.fijo ? 'rgba(197,160,89,0.10)' : vacia ? 'transparent' : s.color === PROSPECTO ? 'rgba(255,255,255,0.08)' : 'rgba(197,160,89,0.10)'}
              stroke={vacia ? TITANIO : s.color}
              strokeWidth={1.5}
              strokeDasharray={vacia ? '4 3' : undefined}
            />
            <Figura x={x} y={y} color={vacia ? TITANIO : s.color} />
            <text
              x={x}
              y={y + (y > C + 10 ? 44 : -36)}
              textAnchor="middle"
              fill={vacia ? TITANIO : s.color}
              style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.12em' }}
            >
              {s.rotulo}
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
      <circle cx={x} cy={y - 7} r={6.5} />
      <path d={`M ${x - 12} ${y + 14} Q ${x - 12} ${y + 2} ${x} ${y + 2} Q ${x + 12} ${y + 2} ${x + 12} ${y + 14} Z`} />
    </g>
  );
}
