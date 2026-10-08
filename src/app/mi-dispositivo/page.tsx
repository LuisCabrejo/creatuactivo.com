'use client';
/**
 * Copyright © 2026 CreaTuActivo.com
 *
 * /mi-dispositivo?c={constructor_id}&f={firma} — marca la ficha de este navegador
 * como dispositivo del socio. Ver src/lib/dispositivo-socio.ts.
 *
 * La huella la pone tracking.js, y la ficha nace unos instantes después de cargar
 * (la llamada va diferida): por eso se espera la huella y se reintenta mientras
 * la ruta responda «sin ficha».
 */
import { useEffect, useState } from 'react';

type Estado = 'cargando' | 'listo' | 'invalido' | 'fallo';

export default function MiDispositivoPage() {
  const [estado, setEstado] = useState<Estado>('cargando');

  useEffect(() => {
    let cancelado = false;
    const esperar = (ms: number) => new Promise((r) => setTimeout(r, ms));
    (async () => {
      const url = new URL(window.location.href);
      const c = url.searchParams.get('c');
      const f = url.searchParams.get('f');
      if (!c || !f) { setEstado('invalido'); return; }

      let fingerprint: string | undefined;
      for (let i = 0; i < 40 && !fingerprint; i++) {
        fingerprint = (window as any).FrameworkIAA?.fingerprint;
        if (!fingerprint) await esperar(250);
      }
      if (!fingerprint) { if (!cancelado) setEstado('fallo'); return; }

      for (let intento = 0; intento < 6; intento++) {
        try {
          const r = await fetch('/api/dispositivo-socio', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fingerprint, c, f }),
          });
          if (r.ok) { if (!cancelado) setEstado('listo'); return; }
          if (r.status === 403 || r.status === 400) { if (!cancelado) setEstado('invalido'); return; }
        } catch { /* se reintenta */ }
        await esperar(1500);
      }
      if (!cancelado) setEstado('fallo');
    })();
    return () => { cancelado = true; };
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
  const t = textos[estado];

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
