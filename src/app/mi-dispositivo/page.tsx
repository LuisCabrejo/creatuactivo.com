'use client';
/**
 * Copyright © 2026 CreaTuActivo.com
 *
 * /mi-dispositivo?c={constructor_id}&f={firma} — marca la ficha de este navegador
 * como dispositivo del socio. Ver src/lib/dispositivo-socio.ts.
 *
 * La huella la pone tracking.js, y la ficha nace unos instantes después de cargar
 * (la llamada va diferida): por eso se espera la huella y se reintenta mientras
 * la ruta responda «sin ficha». ⚠️ Mientras tanto, tracking.js deja en
 * FrameworkIAA una huella PROVISIONAL (`pending_…`) en un navegador nuevo: esa no
 * tiene ficha nunca, así que se espera la real (13 oct 2026; antes la marca
 * fallaba la primera vez en cualquier navegador recién estrenado).
 *
 * &destino=presentacion (13 oct 2026) — el botón «Abrir» de la Presentación en
 * queswa.app (Centro de Expansión → Enlaces) pasa por aquí: marca el dispositivo
 * y sigue a la presentación con el ?ref del socio, para que la estudie sin que la
 * campanita le avise de sí mismo. Se sigue SIEMPRE, salga como salga la marca: lo
 * que el socio quiere es estudiar. `location.replace` saca la firma del historial,
 * y la barra de direcciones queda con el enlace normal (si lo copia y lo comparte,
 * no silencia a nadie). Lista cerrada: un destino libre volvería esta página un
 * redirector abierto.
 */
import { useEffect, useState } from 'react';

type Estado = 'cargando' | 'listo' | 'invalido' | 'fallo';

const DESTINOS: Record<string, (constructorId: string) => string> = {
  presentacion: (c) => `/servilleta?ref=${encodeURIComponent(c)}`,
};
/** Con destino, a los 10 s se sigue aunque la marca no haya terminado. */
const TOPE_DESTINO_MS = 10_000;

export default function MiDispositivoPage() {
  const [estado, setEstado] = useState<Estado>('cargando');
  const [conDestino, setConDestino] = useState(false);

  useEffect(() => {
    let cancelado = false;
    const esperar = (ms: number) => new Promise((r) => setTimeout(r, ms));
    const url = new URL(window.location.href);
    const c = url.searchParams.get('c');
    const f = url.searchParams.get('f');
    const clave = url.searchParams.get('destino');
    const aDestino = clave && Object.prototype.hasOwnProperty.call(DESTINOS, clave) ? DESTINOS[clave] : null;
    const destino = aDestino && c ? aDestino(c.trim().toLowerCase()) : null;
    if (destino) setConDestino(true);
    let siguio = false;
    const seguir = () => {
      if (!destino || siguio || cancelado) return false;
      siguio = true;
      window.location.replace(destino);
      return true;
    };
    const terminar = (e: Estado) => { if (!cancelado && !seguir()) setEstado(e); };
    const tope = destino ? setTimeout(seguir, TOPE_DESTINO_MS) : null;

    (async () => {
      if (!c || !f) { terminar('invalido'); return; }

      let fingerprint: string | undefined;
      for (let i = 0; i < 40 && !fingerprint && !cancelado; i++) {
        const huella = (window as unknown as { FrameworkIAA?: { fingerprint?: unknown } }).FrameworkIAA?.fingerprint;
        if (typeof huella === 'string' && huella && !huella.startsWith('pending_')) fingerprint = huella;
        else await esperar(250);
      }
      if (!fingerprint) { terminar('fallo'); return; }

      for (let intento = 0; intento < 6 && !cancelado; intento++) {
        try {
          const r = await fetch('/api/dispositivo-socio', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fingerprint, c, f }),
          });
          if (r.ok) { terminar('listo'); return; }
          if (r.status === 403 || r.status === 400) { terminar('invalido'); return; }
        } catch { /* se reintenta */ }
        await esperar(1500);
      }
      terminar('fallo');
    })();
    return () => { cancelado = true; if (tope) clearTimeout(tope); };
  }, []);

  const textos: Record<Estado, { titulo: string; cuerpo: string[] }> = {
    cargando: { titulo: 'Un momento…', cuerpo: [] },
    listo: {
      titulo: 'Listo: este dispositivo es suyo',
      cuerpo: [
        'Desde aquí puede abrir sus enlaces y su presentación sin que la campanita le avise de usted mismo.',
        'Abra este enlace una vez en cada teléfono o computador que use. Si borra los datos del navegador, ábralo de nuevo.',
      ],
    },
    invalido: {
      titulo: 'Este enlace no es válido',
      cuerpo: ['Pídalo de nuevo: tiene que ser el que corresponde a su cuenta.'],
    },
    fallo: {
      titulo: 'No se pudo marcar este dispositivo',
      cuerpo: ['Recargue la página en un momento.'],
    },
  };
  const t = conDestino && estado === 'cargando' ? { titulo: 'Abriendo su presentación…', cuerpo: [] } : textos[estado];

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--color-bg-primary)',
        color: 'var(--color-text-primary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px',
      }}
    >
      <div style={{ maxWidth: 520, width: '100%' }}>
        <p style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: 12, letterSpacing: '0.18em', color: 'var(--color-data)', textTransform: 'uppercase', marginBottom: 16 }}>
          CreaTuActivo.com
        </p>
        <h1 style={{ fontSize: 28, lineHeight: 1.2, fontWeight: 600, color: estado === 'listo' ? 'var(--color-brand)' : 'var(--color-text-primary)', marginBottom: 20 }}>
          {t.titulo}
        </h1>
        {t.cuerpo.map((p) => (
          <p key={p} style={{ fontSize: 17, lineHeight: 1.6, marginBottom: 14, color: 'var(--color-text-body)' }}>{p}</p>
        ))}
      </div>
    </div>
  );
}
