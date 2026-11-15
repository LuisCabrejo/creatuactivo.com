'use client';
/**
 * Copyright © 2026 CreaTuActivo.com
 *
 * La reserva de un puesto en una convocatoria EN LÍNEA de /vip/{evento} (taller del
 * 16 nov 2026). Dos grupos con cupo aparte: el equipo (distribuidores, puestos 1 a
 * `sillas`) e invitados (prospectos, desde el puesto 101, `cupoInvitados`). El
 * invitado que llega por el enlace de un socio (/{slug}/taller → ?ref=) queda a su
 * nombre; sin enlace, escribe quién lo invitó.
 *
 * Decisiones del Director (15 nov 2026): cámara encendida obligatoria para todos (se
 * marca antes de reservar); nada en el copy que dependa de haber ido al regional; al
 * distribuidor sin foto en queswa.app se le sugiere ponerla; los invitados ven a un
 * equipo con plan, método y acompañamiento, que es evidencia y no promesa.
 *
 * El enlace de la reunión no está en la página: lo devuelve /api/mesa al reservar. El
 * cupo se refresca cada 20 s y al volver a la pestaña. La versión presencial es MesaReserva.
 */
import { useCallback, useEffect, useState } from 'react';
import type { Mesa } from '@/lib/mesas';
import { PRIMER_PUESTO_INVITADO, enlaceCalendario, horaCerrada, horaTexto } from '@/lib/mesas';

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

type Tipo = 'distribuidor' | 'invitado';

const CONTENIDO: Record<Tipo, { titulo: string; puntos: string[] }> = {
  distribuidor: {
    titulo: 'Sale con su plan para sumar dos socios nuevos',
    puntos: [
      'A quién invitar primero, y cómo abrir la conversación',
      'Una clínica en vivo: verá a Luis presentar una conversación real',
      'Su meta escrita en queswa.app, con fecha: 14 de diciembre',
    ],
  },
  invitado: {
    titulo: 'Vea por dentro cómo trabaja el equipo',
    puntos: [
      'Cómo se organiza un equipo para crecer: con plan y con fecha',
      'Una clínica en vivo: Luis presenta una conversación real',
      'El acompañamiento que recibe cada socio, de principio a fin',
    ],
  },
};

const CAMARA = 'Es una mesa de trabajo, no una transmisión: se entra con la cámara encendida.';

type Reserva = { tipo: Tipo; nombre: string; reunion: string | null; sugerirFoto: boolean };

export default function CupoReserva({
  evento,
  mesa,
  invitadoPor,
}: {
  evento: string;
  mesa: Mesa;
  /** El socio cuyo enlace trajo a esta persona, si llegó por /{slug}/taller. */
  invitadoPor?: { ref: string; nombre: string } | null;
}) {
  const horario = mesa.horarios[0];
  const hayInvitados = (mesa.cupoInvitados ?? 0) > 0;
  const [tipo, setTipo] = useState<Tipo>(invitadoPor && hayInvitados ? 'invitado' : 'distribuidor');
  const [tomados, setTomados] = useState<{ equipo: number; invitados: number } | null>(null);
  const [nombre, setNombre] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [quienInvito, setQuienInvito] = useState('');
  const [camara, setCamara] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reserva, setReserva] = useState<Reserva | null>(null);
  const [ahora, setAhora] = useState(() => new Date());

  const cargar = useCallback(async () => {
    try {
      const r = await fetch(`/api/mesa?evento=${encodeURIComponent(evento)}`, { cache: 'no-store' });
      if (!r.ok) throw new Error(String(r.status));
      const j = await r.json();
      const puestos: number[] = j.ocupadas?.[horario] ?? [];
      const invitados = puestos.filter((n) => n >= PRIMER_PUESTO_INVITADO).length;
      setTomados({ equipo: puestos.length - invitados, invitados });
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

  const cupo = tipo === 'invitado' ? mesa.cupoInvitados ?? 0 : mesa.sillas;
  const usados = tomados === null ? null : tipo === 'invitado' ? tomados.invitados : tomados.equipo;
  const libres = usados === null ? null : Math.max(0, cupo - usados);
  const cerrada = horaCerrada(mesa, horario, ahora);
  const lleno = libres === 0;

  async function reservar(e: React.FormEvent) {
    e.preventDefault();
    if (!camara) {
      setError('Confirme que entra con la cámara encendida.');
      return;
    }
    setEnviando(true);
    setError(null);
    try {
      const r = await fetch('/api/mesa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          evento,
          horario,
          nombre,
          whatsapp,
          tipo,
          ...(tipo === 'invitado' ? { ref: invitadoPor?.ref, invitadoPor: quienInvito } : {}),
        }),
      });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) {
        setError(j.error || 'No se pudo reservar. Intente de nuevo.');
        cargar();
        return;
      }
      setReserva({
        tipo,
        nombre: nombre.trim().split(/\s+/)[0],
        reunion: j.reunion || null,
        sugerirFoto: !!j.sugerirFoto,
      });
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
          <p style={{ margin: '1rem 0 0', color: ORO, lineHeight: 1.55 }}>Entre con la cámara encendida.</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: '1.5rem' }}>
            <a className="cta-primary" href={enlaceCalendario(mesa, horario, reserva.reunion)} target="_blank" rel="noopener noreferrer">
              Guardar en mi calendario
            </a>
            {reserva.reunion ? (
              <a className="cta-secondary" href={reserva.reunion} target="_blank" rel="noopener noreferrer">
                Enlace para entrar al taller
              </a>
            ) : (
              <p style={{ margin: 0, color: 'var(--color-text-body)', lineHeight: 1.6 }}>
                El enlace para entrar le llega por WhatsApp antes de las 8:00 a. m.
              </p>
            )}
          </div>

          {reserva.sugerirFoto && (
            <div style={{ marginTop: '1.75rem', paddingTop: '1.25rem', borderTop: `1px solid ${BORDE}`, textAlign: 'left' }}>
              <p style={etiqueta}>Su foto</p>
              <p style={{ margin: '0.5rem 0 0.9rem', lineHeight: 1.6 }}>
                Su cuenta de queswa.app todavía no tiene foto. Agréguela antes del taller: con cámara y foto, el equipo lo reconoce.
              </p>
              <a className="cta-secondary" href="https://queswa.app/perfil" target="_blank" rel="noopener noreferrer">
                Agregar mi foto
              </a>
            </div>
          )}

          <div style={{ marginTop: '1.75rem', paddingTop: '1.25rem', borderTop: `1px solid ${BORDE}`, textAlign: 'left' }}>
            <p style={etiqueta}>Para llegar listo</p>
            <p style={{ margin: '0.5rem 0 0', lineHeight: 1.6 }}>
              {reserva.tipo === 'invitado'
                ? `Entre unos minutos antes, desde un lugar tranquilo.${invitadoPor ? ` ${primerNombre(invitadoPor.nombre)} lo acompaña.` : ''}`
                : 'Anote diez contactos a los que le gustaría ver crecer con usted. En el taller elegimos por cuáles empezar.'}
            </p>
          </div>
        </div>
      </section>
    );
  }

  const contenido = CONTENIDO[tipo];

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
          <p style={{ margin: '0.35rem 0 0', fontSize: '1.15rem', color: '#FFFFFF' }}>En línea, con cámara encendida</p>
          <p style={{ margin: '0.2rem 0 0', color: 'var(--color-text-body)' }}>El enlace le llega al reservar.</p>
        </div>
        <div>
          <p style={etiqueta}>Presenta</p>
          <p style={{ margin: '0.35rem 0 0', fontSize: '1.15rem', color: '#FFFFFF' }}>Luis Cabrejo</p>
        </div>
      </div>

      {/* Quién es */}
      {hayInvitados && (
        <div role="radiogroup" aria-label="Cómo viene" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: '2rem' }}>
          {(['distribuidor', 'invitado'] as Tipo[]).map((t) => {
            const activo = t === tipo;
            return (
              <button
                key={t}
                type="button"
                role="radio"
                aria-checked={activo}
                onClick={() => {
                  setTipo(t);
                  setError(null);
                }}
                style={{
                  background: activo ? 'rgba(197,160,89,0.12)' : ELEVADO,
                  border: `1px solid ${activo ? ORO : BORDE}`,
                  borderRadius: 10,
                  padding: '0.85rem 0.5rem',
                  color: activo ? '#FFFFFF' : TEXTO,
                  fontSize: '1rem',
                  cursor: 'pointer',
                }}
              >
                {t === 'distribuidor' ? 'Soy distribuidor' : 'Vengo invitado'}
              </button>
            );
          })}
        </div>
      )}

      {tipo === 'invitado' && invitadoPor && (
        <p style={{ margin: '1rem 0 0', textAlign: 'center', color: 'var(--color-text-body)' }}>
          Invitado por <span style={{ color: ORO }}>{invitadoPor.nombre}</span>
        </p>
      )}

      {/* Lo que se lleva */}
      <h2
        style={{
          fontFamily: 'var(--font-serif)',
          fontWeight: 500,
          fontSize: '1.6rem',
          color: '#FFFFFF',
          margin: '2rem 0 1rem',
          textAlign: 'center',
        }}
      >
        {contenido.titulo}
      </h2>
      <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 12 }}>
        {contenido.puntos.map((t) => (
          <li key={t} style={{ display: 'flex', gap: 12, alignItems: 'baseline', lineHeight: 1.55 }}>
            <span style={{ color: ORO, flexShrink: 0 }}>◆</span>
            <span>{t}</span>
          </li>
        ))}
      </ul>
      {tipo === 'distribuidor' && (
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
      )}

      {/* El cupo */}
      <div style={{ marginTop: '2.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <p style={etiqueta}>{tipo === 'invitado' ? 'Cupos para invitados' : 'Cupos del equipo'}</p>
          <p style={{ margin: 0, fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: lleno ? ORO : TEXTO }}>
            {libres === null ? '…' : lleno ? 'Completo' : libres === 1 ? `Queda 1 de ${cupo}` : `Quedan ${libres} de ${cupo}`}
          </p>
        </div>
        <div style={{ marginTop: 8, height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
          <div
            style={{
              height: '100%',
              width: `${usados === null || !cupo ? 0 : Math.min(100, (usados / cupo) * 100)}%`,
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
          {tipo === 'invitado'
            ? 'Los cupos para invitados se completaron. Escríbale a quien lo invitó.'
            : 'Los cupos del equipo se completaron. Escríbale a su patrocinador.'}
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
          {tipo === 'invitado' && !invitadoPor && (
            <label style={{ display: 'grid', gap: 6 }}>
              <span style={etiqueta}>¿Quién lo invitó?</span>
              <input
                style={campo}
                value={quienInvito}
                onChange={(e) => setQuienInvito(e.target.value)}
                placeholder="Nombre de quien lo invitó"
                required
                minLength={2}
                maxLength={80}
              />
            </label>
          )}

          <label
            style={{
              display: 'flex',
              gap: 12,
              alignItems: 'flex-start',
              padding: '0.9rem 1rem',
              border: `1px solid ${camara ? ORO : BORDE}`,
              borderRadius: 10,
              cursor: 'pointer',
              lineHeight: 1.5,
            }}
          >
            <input
              type="checkbox"
              checked={camara}
              onChange={(e) => {
                setCamara(e.target.checked);
                setError(null);
              }}
              style={{ marginTop: 4, width: 18, height: 18, accentColor: ORO, flexShrink: 0 }}
            />
            <span>
              Entro con la cámara encendida.
              <span style={{ display: 'block', fontSize: '0.88rem', color: 'var(--color-text-body)', marginTop: 2 }}>{CAMARA}</span>
            </span>
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

const primerNombre = (n: string) => n.trim().split(/\s+/)[0] || n;
