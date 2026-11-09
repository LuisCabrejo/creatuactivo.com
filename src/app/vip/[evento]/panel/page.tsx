/**
 * Copyright © 2026 CreaTuActivo.com
 *
 * /vip/{evento}/panel?clave=… — cómo va la convocatoria: cada hora con sus sillas,
 * quién reservó y su WhatsApp. Solo con la llave (src/lib/mesas-panel.ts); sin ella,
 * 404. Es el destino del push que le llega a Luis con cada reserva. Se refresca solo
 * cada 30 s. noindex, sin orbe.
 */
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { createClient } from '@supabase/supabase-js';
import { unstable_noStore as noStore } from 'next/cache';
import SinOrbe from '@/components/SinOrbe';
import { MESAS, horaCerrada, horaTexto } from '@/lib/mesas';
import { claveValida } from '@/lib/mesas-panel';
import Refrescar from './Refrescar';

export const dynamic = 'force-dynamic';
// Sin esto, Next guardaba la consulta de supabase-js en su caché de datos y el panel
// se quedaba con la foto de la primera visita (9 nov 2026).
export const fetchCache = 'force-no-store';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Panel de la mesa',
  robots: { index: false, follow: false },
};

type Fila = { horario: string; silla: number; nombre: string; whatsapp: string; created_at: string };

const ORO = '#C5A059';
const TITANIO = '#94A3B8';
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

export default async function PanelMesa({
  params,
  searchParams,
}: {
  params: { evento: string };
  searchParams: { clave?: string };
}) {
  const mesa = MESAS[params.evento];
  if (!mesa || !claveValida(mesa.id, searchParams.clave)) notFound();

  noStore();
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    global: { fetch: (url, init) => fetch(url, { ...init, cache: 'no-store' }) },
  });
  const { data, error } = await supabase
    .from('reservas_mesa')
    .select('horario, silla, nombre, whatsapp, created_at')
    .eq('evento', mesa.id)
    .order('created_at', { ascending: true });
  const filas = (data || []) as Fila[];

  const total = mesa.horarios.length * mesa.sillas;
  const ahora = new Date();
  const hora = new Intl.DateTimeFormat('es-CO', { timeZone: 'America/Bogota', hour: 'numeric', minute: '2-digit' }).format(ahora);

  return (
    <main style={{ minHeight: '100vh', background: 'var(--color-bg-primary)', color: '#E5E5E5' }}>
      <SinOrbe />
      <Refrescar cada={30_000} />
      <section style={{ maxWidth: 560, margin: '0 auto', padding: '40px 16px 64px' }}>
        <p style={{ ...etiqueta, color: '#22D3EE' }}>Mesa VIP · {mesa.ciudad}</p>
        <p style={{ margin: '0.5rem 0 0', fontSize: '1.05rem', color: '#FFFFFF' }}>
          {mesa.fechaTexto} · {mesa.lugar}
        </p>

        <div
          style={{
            marginTop: '1.5rem',
            background: ELEVADO,
            border: `1px solid ${BORDE}`,
            borderRadius: 12,
            padding: '1.25rem 1.5rem',
            display: 'flex',
            alignItems: 'baseline',
            gap: 10,
          }}
        >
          <span style={{ fontSize: '2.5rem', fontWeight: 500, color: ORO, lineHeight: 1 }}>{filas.length}</span>
          <span style={{ fontSize: '1.05rem', color: '#FFFFFF' }}>de {total} sillas reservadas</span>
        </div>
        <p style={{ ...etiqueta, marginTop: 10, letterSpacing: '0.1em', textTransform: 'none' }}>
          Actualizado a las {hora}. Se refresca solo.
        </p>
        {error && <p style={{ color: '#F43F5E' }}>No se pudieron leer las reservas: {error.message}</p>}

        <div style={{ display: 'grid', gap: 14, marginTop: '1.75rem' }}>
          {mesa.horarios.map((h) => {
            const deEsta = filas.filter((f) => f.horario === h);
            const cerrada = horaCerrada(mesa, h, ahora);
            return (
              <div key={h} style={{ background: ELEVADO, border: `1px solid ${BORDE}`, borderRadius: 12, padding: '1.1rem 1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 500, color: '#FFFFFF' }}>{horaTexto(h)}</h2>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: deEsta.length >= mesa.sillas ? ORO : TITANIO }}>
                    {deEsta.length} de {mesa.sillas}
                    {cerrada ? ' · cerrada' : deEsta.length >= mesa.sillas ? ' · completa' : ''}
                  </span>
                </div>
                <ul style={{ listStyle: 'none', margin: '0.75rem 0 0', padding: 0, display: 'grid', gap: 8 }}>
                  {Array.from({ length: mesa.sillas }, (_, i) => i + 1).map((n) => {
                    const r = deEsta.find((f) => f.silla === n);
                    return (
                      <li key={n} style={{ display: 'flex', gap: 12, alignItems: 'baseline', fontSize: '0.98rem' }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: TITANIO, minWidth: 56 }}>Silla {n}</span>
                        {r ? (
                          <span style={{ color: '#FFFFFF' }}>
                            {r.nombre} ·{' '}
                            <a href={`https://wa.me/${r.whatsapp}`} target="_blank" rel="noopener noreferrer" style={{ color: ORO }}>
                              +{r.whatsapp}
                            </a>
                          </span>
                        ) : (
                          <span style={{ color: '#5B616B' }}>Libre</span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
