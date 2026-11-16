/**
 * Copyright © 2026 CreaTuActivo.com
 *
 * /vip/{evento} — la reserva de silla para una mesa privada presencial (9 nov 2026).
 * Cada hora es una mesa redonda: la silla de Luis y cuatro para reservar. El enlace
 * llega en el texto del mensaje que acompaña al flyer. Mesas en src/lib/mesas.ts,
 * reservas en `reservas_mesa` vía /api/mesa. noindex: es una invitación, no una página
 * del sitio. Sin orbe (<SinOrbe />): la página tiene un solo trabajo, y la burbuja tapaba la mesa.
 * Una convocatoria en línea (Mesa.modalidad) usa CupoReserva: cupo en vez de mesa.
 * Una por distribuidor usa MesaDistribuidor: cada hora es la mesa de un distribuidor
 * que sienta a sus prospectos (presentación empresarial, 18 nov 2026).
 */
import { notFound } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import type { Metadata } from 'next';
import { IndustrialHeader } from '@/components/IndustrialHeader';
import { MESAS, enLinea, porDistribuidor } from '@/lib/mesas';
import SinOrbe from '@/components/SinOrbe';
import MesaReserva from './MesaReserva';
import CupoReserva from './CupoReserva';
import MesaDistribuidor from './MesaDistribuidor';

export function generateStaticParams() {
  return Object.keys(MESAS).map((evento) => ({ evento }));
}

export function generateMetadata({ params }: { params: { evento: string } }): Metadata {
  const mesa = MESAS[params.evento];
  if (!mesa) return {};
  if (enLinea(mesa)) {
    const t = 'Taller privado · Dos socios nuevos';
    const d = `${mesa.fechaTexto}, 8:00 a 10:00 a. m., en línea con Luis Cabrejo. Su plan para sumarlos, en dos horas. Cupos limitados.`;
    return {
      title: t,
      description: d,
      robots: { index: false, follow: false },
      alternates: { canonical: `https://creatuactivo.com/vip/${params.evento}` },
      openGraph: { title: t, description: d, url: `https://creatuactivo.com/vip/${params.evento}` },
    };
  }
  if (porDistribuidor(mesa)) {
    const t = `Presentación empresarial · ${mesa.ciudad}`;
    const d = `${mesa.fechaTexto}, ${mesa.lugar}, con Luis Cabrejo. Elija la hora de su mesa y siente a sus prospectos.`;
    return {
      title: t,
      description: d,
      robots: { index: false, follow: false },
      alternates: { canonical: `https://creatuactivo.com/vip/${params.evento}` },
      openGraph: {
        title: t,
        description: d,
        url: `https://creatuactivo.com/vip/${params.evento}`,
        // El flyer de la convocatoria, para que el enlace compartido se vea como la invitación.
        images: [{ url: 'https://creatuactivo.com/images/eventos/flyer-villavicencio-20261118.png', width: 1080, height: 1350 }],
      },
    };
  }
  const titulo = `Mesa privada · ${mesa.ciudad}`;
  const descripcion = `${mesa.fechaTexto}, ${mesa.lugar}. Cómo construir su propio activo: una empresa de distribución moderna que no depende de su presencia. Elija su hora y su silla.`;
  return {
    title: titulo,
    description: descripcion,
    robots: { index: false, follow: false },
    alternates: { canonical: `https://creatuactivo.com/vip/${params.evento}` },
    openGraph: {
      title: titulo,
      description: descripcion,
      url: `https://creatuactivo.com/vip/${params.evento}`,
    },
  };
}

/**
 * El socio cuyo enlace trajo al invitado (/{slug}/taller → ?ref=constructor_id). Solo
 * el nombre, para «Invitado por …»; la ruta lo vuelve a validar al reservar.
 */
async function socioDelEnlace(ref: string | undefined): Promise<{ ref: string; nombre: string } | null> {
  const id = (ref || '').trim();
  if (!id || id.length > 80 || !process.env.SUPABASE_SERVICE_ROLE_KEY) return null;
  try {
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      global: { fetch: (url, init) => fetch(url, { ...init, cache: 'no-store' }) },
    });
    const { data } = await supabase.from('private_users').select('constructor_id, name').eq('constructor_id', id).maybeSingle();
    const fila = data as { constructor_id: string; name: string | null } | null;
    return fila?.name ? { ref: fila.constructor_id, nombre: fila.name.trim() } : null;
  } catch {
    return null;
  }
}

export default async function MesaPage({
  params,
  searchParams,
}: {
  params: { evento: string };
  searchParams: { ref?: string };
}) {
  const mesa = MESAS[params.evento];
  if (!mesa) notFound();

  if (enLinea(mesa)) {
    const invitadoPor = mesa.cupoInvitados ? await socioDelEnlace(searchParams.ref) : null;
    return (
      <main style={{ minHeight: '100vh', background: 'var(--color-bg-primary)' }}>
        <SinOrbe />
        <IndustrialHeader
          variant="editorial"
          refCode="TALLER PRIVADO · EN LÍNEA"
          title={
            <>
              <span style={{ color: '#FFFFFF' }}>Dos socios </span>
              nuevos
            </>
          }
          subtitle="Su plan para sumarlos, en dos horas."
        />
        <CupoReserva evento={params.evento} mesa={mesa} invitadoPor={invitadoPor} />
      </main>
    );
  }

  if (porDistribuidor(mesa)) {
    return (
      <main style={{ minHeight: '100vh', background: 'var(--color-bg-primary)' }}>
        <SinOrbe />
        <IndustrialHeader
          variant="editorial"
          refCode={`PRESENTACIÓN EMPRESARIAL · ${mesa.ciudad.toUpperCase()}`}
          title={
            <>
              <span style={{ color: '#FFFFFF' }}>Siente a sus </span>
              prospectos
            </>
          }
          subtitle="Una hora, una mesa, y sus dos primeros distribuidores."
        />
        <MesaDistribuidor evento={params.evento} mesa={mesa} />
      </main>
    );
  }

  return (
    <main style={{ minHeight: '100vh', background: 'var(--color-bg-primary)' }}>
      <SinOrbe />
      <IndustrialHeader
        variant="editorial"
        refCode={`MESA PRIVADA · ${mesa.ciudad.toUpperCase()}`}
        title={
          <>
            <span style={{ color: '#FFFFFF' }}>Cómo construir su propio </span>
            activo
          </>
        }
        subtitle="Una empresa de distribución moderna que no depende de su presencia."
      />
      <MesaReserva evento={params.evento} mesa={mesa} />
    </main>
  );
}
