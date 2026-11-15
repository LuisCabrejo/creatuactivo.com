/**
 * Copyright © 2026 CreaTuActivo.com
 *
 * /vip/{evento} — la reserva de silla para una mesa privada presencial (9 nov 2026).
 * Cada hora es una mesa redonda: la silla de Luis y cuatro para reservar. El enlace
 * llega en el texto del mensaje que acompaña al flyer. Mesas en src/lib/mesas.ts,
 * reservas en `reservas_mesa` vía /api/mesa. noindex: es una invitación, no una página
 * del sitio. Sin orbe (<SinOrbe />): la página tiene un solo trabajo, y la burbuja tapaba la mesa.
 * Una convocatoria en línea (Mesa.modalidad) usa CupoReserva: cupo en vez de mesa.
 */
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { IndustrialHeader } from '@/components/IndustrialHeader';
import { MESAS, enLinea } from '@/lib/mesas';
import SinOrbe from '@/components/SinOrbe';
import MesaReserva from './MesaReserva';
import CupoReserva from './CupoReserva';

export function generateStaticParams() {
  return Object.keys(MESAS).map((evento) => ({ evento }));
}

export function generateMetadata({ params }: { params: { evento: string } }): Metadata {
  const mesa = MESAS[params.evento];
  if (!mesa) return {};
  if (enLinea(mesa)) {
    const t = 'Taller privado · Dos socios nuevos';
    const d = `${mesa.fechaTexto}, 9:00 a 11:00 a. m., en línea con Luis Cabrejo. Del regional a su plan. Cupos limitados.`;
    return {
      title: t,
      description: d,
      robots: { index: false, follow: false },
      alternates: { canonical: `https://creatuactivo.com/vip/${params.evento}` },
      openGraph: { title: t, description: d, url: `https://creatuactivo.com/vip/${params.evento}` },
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

export default function MesaPage({ params }: { params: { evento: string } }) {
  const mesa = MESAS[params.evento];
  if (!mesa) notFound();

  if (enLinea(mesa)) {
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
          subtitle="Del regional a su plan, en dos horas."
        />
        <CupoReserva evento={params.evento} mesa={mesa} />
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
