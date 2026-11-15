'use client';
/**
 * Copyright © 2026 CreaTuActivo.com
 *
 * «WhatsApp de Queswa» en el panel de una convocatoria (15 nov 2026): someter las
 * plantillas a Meta, ver su estado y su categoría, y enviar la invitación a los
 * distribuidores y la confirmación con el enlace a los inscritos. Todo pasa por
 * /api/mesa/whatsapp con la llave del panel. Antes de enviar, siempre se ve la lista
 * de a quiénes les llega, y el envío pide confirmación.
 */
import { useCallback, useEffect, useState } from 'react';

const ORO = '#C5A059';
const TITANIO = '#94A3B8';
const ELEVADO = '#15171C';
const BORDE = 'rgba(255,255,255,0.1)';

type Plantilla = { estado: string; categoria: string | null; conImagen: boolean } | null;
type Estado = {
  confirmacion: Plantilla;
  invitacion: Plantilla;
  errorMeta: string | null;
  pendientes: { invitacion: number; invitacionAMano: number; confirmacion: number };
};
type Persona = { nombre: string; whatsapp: string };
type Accion = 'invitar' | 'confirmar';

const boton: React.CSSProperties = {
  padding: '0.8rem 1rem',
  background: 'transparent',
  border: `1px solid ${BORDE}`,
  color: '#E5E5E5',
  borderRadius: 8,
  fontSize: '0.95rem',
  cursor: 'pointer',
};

export default function AccionesWhatsApp({ evento, clave }: { evento: string; clave: string }) {
  const [estado, setEstado] = useState<Estado | null>(null);
  const [ocupado, setOcupado] = useState<string | null>(null);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [lista, setLista] = useState<{ accion: Accion; enviar: Persona[]; aMano: Persona[] } | null>(null);

  const cargar = useCallback(async () => {
    try {
      const r = await fetch(`/api/mesa/whatsapp?evento=${encodeURIComponent(evento)}&clave=${encodeURIComponent(clave)}`, { cache: 'no-store' });
      if (r.ok) setEstado(await r.json());
    } catch {
      /* se reintenta con «Actualizar» */
    }
  }, [evento, clave]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  async function post(cuerpo: Record<string, unknown>) {
    const r = await fetch('/api/mesa/whatsapp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ evento, clave, ...cuerpo }),
    });
    const j = await r.json().catch(() => ({}));
    return { ok: r.ok, j };
  }

  async function someter() {
    setOcupado('someter');
    setMensaje(null);
    const { j } = await post({ accion: 'someter' });
    const linea = (n: string, x: { ok?: boolean; yaExiste?: boolean; error?: string; status?: string; category?: string; conImagen?: boolean; errorImagen?: string | null } | undefined) =>
      !x ? '' : x.yaExiste ? `${n}: ya existía.` : x.ok
        ? `${n}: sometida${x.category ? ` (${x.category})` : ''}${x.conImagen === false ? ' · SIN imagen: ' + (x.errorImagen || '') : ''}.`
        : `${n}: error — ${x.error}`;
    setMensaje([linea('Confirmación', j.confirmacion), linea('Invitación', j.invitacion)].filter(Boolean).join('\n'));
    setOcupado(null);
    cargar();
  }

  async function verLista(accion: Accion) {
    setOcupado(accion);
    setMensaje(null);
    const { ok, j } = await post({ accion, dry: true });
    if (ok) setLista({ accion, enviar: j.enviar || [], aMano: j.aMano || [] });
    else setMensaje(j.error || 'No se pudo leer la lista.');
    setOcupado(null);
  }

  async function enviar(accion: Accion, n: number) {
    const que = accion === 'invitar' ? 'la invitación' : 'la confirmación con el enlace';
    if (!window.confirm(`¿Enviar ${que} a ${n} ${n === 1 ? 'persona' : 'personas'} por WhatsApp? No se puede deshacer.`)) return;
    setOcupado(accion);
    setMensaje(null);
    const { ok, j } = await post({ accion });
    if (!ok) setMensaje(j.error || 'No se pudo enviar.');
    else {
      const fallos = (j.fallos || []) as { nombre: string; error: string }[];
      setMensaje(
        `Enviados: ${j.enviados}.` +
          (fallos.length ? `\nFallaron ${fallos.length}:\n` + fallos.map((f) => `· ${f.nombre}: ${f.error}`).join('\n') : '') +
          ((j.aMano || []).length ? `\nA mano (número +1): ${(j.aMano as Persona[]).map((p) => `${p.nombre} +${p.whatsapp}`).join(', ')}` : '')
      );
      setLista(null);
    }
    setOcupado(null);
    cargar();
  }

  const fila = (titulo: string, p: Plantilla) => (
    <p style={{ margin: '0.35rem 0 0', fontSize: '0.95rem' }}>
      <span style={{ color: TITANIO }}>{titulo}:</span>{' '}
      {!p ? (
        <span style={{ color: '#FBBF24' }}>sin someter</span>
      ) : (
        <span style={{ color: p.estado === 'APPROVED' ? '#10B981' : p.estado === 'REJECTED' ? '#F43F5E' : '#FBBF24' }}>
          {p.estado === 'APPROVED' ? 'aprobada' : p.estado === 'REJECTED' ? 'rechazada' : 'en revisión'} · {p.categoria}
          {p.conImagen ? ' · con flyer' : ''}
        </span>
      )}
    </p>
  );

  const faltaAlguna = estado && (!estado.confirmacion || !estado.invitacion);
  const aprobada = (p: Plantilla) => p?.estado === 'APPROVED';

  return (
    <div style={{ marginTop: '1.75rem', background: ELEVADO, border: `1px solid rgba(197,160,89,0.35)`, borderRadius: 12, padding: '1.1rem 1.25rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 500, color: '#FFFFFF' }}>WhatsApp de Queswa</h2>
        <button type="button" onClick={cargar} style={{ ...boton, padding: '0.3rem 0.7rem', fontSize: '0.8rem' }}>
          Actualizar
        </button>
      </div>

      {!estado ? (
        <p style={{ color: TITANIO }}>Cargando…</p>
      ) : (
        <>
          {fila('Invitación', estado.invitacion)}
          {fila('Confirmación', estado.confirmacion)}
          {estado.errorMeta && <p style={{ color: '#F43F5E', fontSize: '0.85rem' }}>{estado.errorMeta}</p>}

          {faltaAlguna && (
            <button type="button" disabled={!!ocupado} onClick={someter} style={{ ...boton, width: '100%', marginTop: 12, borderColor: ORO, color: ORO }}>
              {ocupado === 'someter' ? 'Sometiendo…' : 'Someter plantillas a Meta'}
            </button>
          )}

          <div style={{ display: 'grid', gap: 10, marginTop: 14 }}>
            <button type="button" disabled={!!ocupado} onClick={() => verLista('invitar')} style={boton}>
              Invitación a distribuidores · faltan {estado.pendientes.invitacion}
              {estado.pendientes.invitacionAMano ? ` (+${estado.pendientes.invitacionAMano} a mano)` : ''}
            </button>
            <button type="button" disabled={!!ocupado} onClick={() => verLista('confirmar')} style={boton}>
              Confirmación con enlace a inscritos · faltan {estado.pendientes.confirmacion}
            </button>
          </div>
        </>
      )}

      {lista && estado && (
        <div style={{ marginTop: 14, paddingTop: 12, borderTop: `1px solid ${BORDE}` }}>
          <p style={{ margin: 0, color: TITANIO, fontSize: '0.85rem' }}>
            {lista.accion === 'invitar' ? 'La invitación' : 'La confirmación'} le llegaría a {lista.enviar.length}:
          </p>
          <ol style={{ margin: '0.5rem 0 0', paddingLeft: 22, fontSize: '0.9rem', lineHeight: 1.7, maxHeight: 220, overflowY: 'auto' }}>
            {lista.enviar.map((p) => (
              <li key={p.whatsapp}>
                {p.nombre || '(sin nombre)'} <span style={{ color: TITANIO }}>+{p.whatsapp}</span>
              </li>
            ))}
          </ol>
          {lista.aMano.length > 0 && (
            <p style={{ margin: '0.5rem 0 0', fontSize: '0.85rem', color: '#FBBF24' }}>
              A mano (Meta no entrega marketing a +1): {lista.aMano.map((p) => `${p.nombre} +${p.whatsapp}`).join(', ')}
            </p>
          )}
          {(() => {
            const p = lista.accion === 'invitar' ? estado.invitacion : estado.confirmacion;
            const listo = aprobada(p) && lista.enviar.length > 0;
            return (
              <button
                type="button"
                disabled={!listo || !!ocupado}
                onClick={() => enviar(lista.accion, lista.enviar.length)}
                style={{ ...boton, width: '100%', marginTop: 12, borderColor: listo ? ORO : BORDE, color: listo ? ORO : TITANIO, opacity: listo ? 1 : 0.6 }}
              >
                {ocupado === lista.accion
                  ? 'Enviando…'
                  : !aprobada(p)
                    ? 'La plantilla aún no está aprobada'
                    : lista.enviar.length === 0
                      ? 'No hay a quién enviar'
                      : `Enviar a ${lista.enviar.length}`}
              </button>
            );
          })()}
        </div>
      )}

      {mensaje && <p style={{ marginTop: 12, whiteSpace: 'pre-wrap', fontSize: '0.9rem', color: '#E5E5E5' }}>{mensaje}</p>}
    </div>
  );
}
