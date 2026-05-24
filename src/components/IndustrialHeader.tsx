/**
 * Copyright © 2026 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * IndustrialHeader - Cabecera dramática para páginas internas
 * Elegancia Cinética: imagen B&W + overlay oscuro + título serif dorado
 */

import Image from 'next/image';
import type { ReactNode } from 'react';

interface IndustrialHeaderProps {
  title: ReactNode;
  subtitle?: string;
  refCode: string;
  imageSrc: string;
  imageAlt: string;
  /**
   * institutional (default): Inter uppercase letter-spacing — para títulos cortos institucionales
   *   (Memorándum Directivo, Insights Estratégicos, Construcción de Estructura Patrimonial).
   * editorial: Playfair serif natural case — para titulares masivos editoriales (artículos de blog).
   * Regla derivada de "Diseño de Branding Premium Institucional.md" — sección Arquitectura Tipográfica.
   */
  variant?: 'institutional' | 'editorial';
}

export function IndustrialHeader({
  title,
  subtitle,
  refCode,
  imageSrc,
  imageAlt,
  variant = 'institutional',
}: IndustrialHeaderProps) {
  const isEditorial = variant === 'editorial';

  return (
    <section style={{ height: '45vh', position: 'relative', overflow: 'hidden' }}>
      {/* Imagen B&W con fade inferior (mask-image) */}
      <Image
        src={imageSrc}
        alt={imageAlt}
        fill
        style={{
          objectFit: 'cover',
          filter: 'grayscale(70%) contrast(1.1) brightness(0.75)',
          opacity: 0.9,
          WebkitMaskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
          maskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
        }}
        priority
      />

      {/* Overlay sutil para uniformidad */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, rgba(11,12,12,0.2) 0%, rgba(11,12,12,0.35) 60%, transparent 100%)',
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
          style={{
            fontFamily: isEditorial ? 'var(--font-serif)' : 'var(--font-sans)',
            fontSize: isEditorial ? 'clamp(1.875rem, 4.5vw, 3.25rem)' : 'clamp(1.75rem, 4.5vw, 3rem)',
            fontWeight: isEditorial ? 600 : 700,
            letterSpacing: isEditorial ? '-0.01em' : '0.08em',
            textTransform: isEditorial ? 'none' : 'uppercase',
            color: 'var(--color-brand)',
            lineHeight: 1.1,
            marginBottom: '1rem',
            textShadow: '0 2px 12px rgba(0,0,0,0.9)',
          }}
        >
          {title}
        </h1>

        {subtitle && (
          <p style={{
            color: 'var(--color-text-body)',
            marginBottom: '1rem',
            fontSize: '1rem',
            textShadow: '0 2px 8px rgba(0,0,0,0.9)',
          }}>{subtitle}</p>
        )}

        {/* Línea técnica — cyan acento data, consistente con homepage */}
        <div
          style={{
            width: '3rem',
            height: '1px',
            background: '#22D3EE',
            margin: '0 auto 0.75rem',
          }}
        />
        <span
          className="font-mono"
          style={{
            fontSize: '0.7rem',
            color: '#22D3EE',
            letterSpacing: '0.15em',
          }}
        >
          REF: {refCode}
        </span>
      </div>
    </section>
  );
}
