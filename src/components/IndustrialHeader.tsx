/**
 * Copyright © 2026 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * IndustrialHeader - Cabecera dramática para páginas internas
 * Elegancia Cinética: imagen B&W + overlay oscuro + título serif dorado
 */

import Image from 'next/image';

interface IndustrialHeaderProps {
  title: string;
  subtitle?: string;
  refCode: string;
  imageSrc: string;
  imageAlt: string;
}

export function IndustrialHeader({
  title,
  subtitle,
  refCode,
  imageSrc,
  imageAlt,
}: IndustrialHeaderProps) {
  return (
    <section style={{ height: '40vh', position: 'relative', overflow: 'hidden' }}>
      {/* Imagen B&W con opacidad */}
      <Image
        src={imageSrc}
        alt={imageAlt}
        fill
        style={{
          objectFit: 'cover',
          filter: 'grayscale(100%) contrast(1.1)',
          opacity: 0.3,
        }}
        priority
      />

      {/* Overlay oscuro + gradiente inferior */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to bottom, rgba(11,12,12,0.6) 0%, rgba(11,12,12,0.85) 70%, #0B0C0C 100%)',
        }}
      />

      {/* Contenido centrado */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          padding: '0 1.5rem',
          textAlign: 'center',
        }}
      >
        <h1
          className="font-serif"
          style={{
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            color: '#E5C279',
            lineHeight: 1.1,
            marginBottom: '1rem',
          }}
        >
          {title}
        </h1>

        {subtitle && (
          <p style={{ color: '#A3A3A3', marginBottom: '1rem' }}>{subtitle}</p>
        )}

        {/* Línea técnica */}
        <div
          style={{
            width: '3rem',
            height: '1px',
            background: '#38BDF8',
            margin: '0 auto 0.75rem',
          }}
        />
        <span
          className="font-mono"
          style={{
            fontSize: '0.7rem',
            color: '#38BDF8',
            letterSpacing: '0.15em',
          }}
        >
          REF: {refCode}
        </span>
      </div>
    </section>
  );
}
