/**
 * Copyright © 2026 CreaTuActivo.com
 * Mini-landing personal del Arquitecto de Patrimonio
 *
 * Ruta: creatuactivo.com/luis-cabrejo
 * → Micro-sitio personalizado con foto, frase y links del constructor
 * → Open Graph dinámico con foto del constructor para WhatsApp
 */

import { createClient } from '@supabase/supabase-js'
import { notFound } from 'next/navigation'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Destinos disponibles con su label y emoji
const DESTINOS = [
  { key: 'auditoria', label: 'Auditoría Patrimonial',   emoji: '🎯', desc: 'Descubre tu punto de partida' },
  { key: 'productos',  label: 'Ver los productos',       emoji: '📦', desc: 'Catálogo Gano Excel completo' },
  { key: 'servilleta', label: 'La servilleta digital',   emoji: '🗺️', desc: 'El modelo en 4 diapositivas' },
]

async function getConstructorBySlug(slug: string) {
  const { data } = await supabase
    .from('constructor_slugs')
    .select('slug, display_name, foto_url, frase_personal, whatsapp, constructor_id')
    .eq('slug', slug)
    .single()
  return data
}

// ── Metadata dinámica (Open Graph para WhatsApp) ───────────────
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const constructor = await getConstructorBySlug(params.slug)
  if (!constructor) return { title: 'CreaTuActivo' }

  const nombre = constructor.display_name || params.slug
  const frase = constructor.frase_personal || 'Construyendo patrimonio paralelo.'
  const foto = constructor.foto_url

  return {
    title: `${nombre} | CreaTuActivo`,
    description: frase,
    openGraph: {
      title: `${nombre} · Arquitecto de Patrimonio`,
      description: frase,
      url: `https://creatuactivo.com/${params.slug}`,
      siteName: 'CreaTuActivo.com',
      ...(foto && {
        images: [{ url: foto, width: 400, height: 400, alt: nombre }],
      }),
    },
    twitter: {
      card: 'summary',
      title: `${nombre} · CreaTuActivo`,
      description: frase,
      ...(foto && { images: [foto] }),
    },
  }
}

// ── Página ─────────────────────────────────────────────────────
export default async function SlugMiniLanding({ params }: { params: { slug: string } }) {
  const constructor = await getConstructorBySlug(params.slug)
  if (!constructor) notFound()

  const { slug, display_name, foto_url, frase_personal, whatsapp } = constructor
  const nombre = display_name || slug
  const initials = nombre.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase()
  const waUrl = whatsapp
    ? `https://wa.me/${whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(`Hola ${nombre.split(' ')[0]}, vi tu perfil en CreaTuActivo 👋`)}`
    : null

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#080808',
      color: '#F5F5F0',
      fontFamily: 'var(--font-rajdhani), sans-serif',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '48px 20px 80px',
    }}>

      {/* Logo CreaTuActivo */}
      <a href="https://creatuactivo.com" style={{
        fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase',
        color: '#6B6B5A', textDecoration: 'none', marginBottom: '48px',
        fontFamily: 'var(--font-roboto-mono), monospace',
      }}>
        CreaTuActivo.com
      </a>

      {/* Avatar */}
      <div style={{ marginBottom: '20px' }}>
        {foto_url ? (
          <img
            src={foto_url}
            alt={nombre}
            style={{
              width: 96, height: 96, borderRadius: '50%',
              objectFit: 'cover',
              border: '2px solid rgba(200,168,75,0.4)',
            }}
          />
        ) : (
          <div style={{
            width: 96, height: 96, borderRadius: '50%',
            background: 'linear-gradient(135deg, #1a1a1a, #2a2a2a)',
            border: '2px solid rgba(200,168,75,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '2rem', fontWeight: 700, color: '#C8A84B',
            fontFamily: 'var(--font-playfair), Georgia, serif',
          }}>
            {initials}
          </div>
        )}
      </div>

      {/* Nombre */}
      <h1 style={{
        fontSize: '1.5rem', fontWeight: 700,
        fontFamily: 'var(--font-playfair), Georgia, serif',
        color: '#F5F5F0', marginBottom: '8px', textAlign: 'center',
      }}>
        {nombre}
      </h1>

      {/* Frase */}
      <p style={{
        fontSize: '0.9rem', color: '#6B6B5A', marginBottom: '40px',
        textAlign: 'center', maxWidth: '300px', lineHeight: 1.6,
      }}>
        {frase_personal}
      </p>

      {/* Links */}
      <div style={{ width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {DESTINOS.map((d) => (
          <a
            key={d.key}
            href={`/${slug}/${d.key}`}
            style={{
              display: 'flex', alignItems: 'center', gap: '14px',
              padding: '16px 20px',
              background: '#0d0d0d',
              border: '1px solid #1a1a1a',
              color: '#F5F5F0', textDecoration: 'none',
              clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)',
              transition: 'border-color 0.2s, background 0.2s',
            }}
            onMouseEnter={undefined}
          >
            <span style={{ fontSize: '1.4rem', flexShrink: 0 }}>{d.emoji}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.95rem', fontWeight: 600, letterSpacing: '0.03em' }}>{d.label}</div>
              <div style={{ fontSize: '0.75rem', color: '#6B6B5A', marginTop: '2px' }}>{d.desc}</div>
            </div>
            <span style={{ color: '#C8A84B', fontSize: '1rem' }}>→</span>
          </a>
        ))}

        {/* WhatsApp directo */}
        {waUrl && (
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
              padding: '16px 20px', marginTop: '8px',
              background: 'linear-gradient(135deg, #C8A84B, #A8881F)',
              color: '#000', textDecoration: 'none', fontWeight: 700,
              fontSize: '0.95rem', letterSpacing: '0.08em', textTransform: 'uppercase',
              clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)',
            }}
          >
            💬 Hablar con {nombre.split(' ')[0]}
          </a>
        )}
      </div>

      {/* Footer */}
      <p style={{
        marginTop: '48px', fontSize: '0.65rem', color: '#3a3a3a',
        fontFamily: 'var(--font-roboto-mono), monospace', letterSpacing: '0.05em',
        textAlign: 'center',
      }}>
        creatuactivo.com/{slug}
      </p>
    </div>
  )
}
