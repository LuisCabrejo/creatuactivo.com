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
import { Home, Target, Calculator, Package, Map, Zap, ChevronRight, MessageCircle } from 'lucide-react'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Destinos disponibles — orden: Home primero, Auditoría destacada, resto secundarios
const DESTINOS = [
  { key: 'home',        label: 'Mi Página Principal',        Icon: Home,       desc: 'Portal de entrada al ecosistema',      highlight: false },
  { key: 'auditoria',   label: 'Auditoría Patrimonial',      Icon: Target,     desc: 'Descubre tu punto de partida',         highlight: true  },
  { key: 'calculadora', label: 'Calculadora de Patrimonio',  Icon: Calculator, desc: 'Proyecta tu potencial',                highlight: false },
  { key: 'productos',   label: 'Ver los productos',          Icon: Package,    desc: 'Catálogo Gano Excel completo',         highlight: false },
  { key: 'servilleta',  label: 'La servilleta digital',      Icon: Map,        desc: 'El modelo en 4 diapositivas',          highlight: false },
]

async function getConstructorBySlug(slug: string) {
  const { data: slugData } = await supabase
    .from('constructor_slugs')
    .select('slug, display_name, foto_url, frase_personal, whatsapp, constructor_id')
    .eq('slug', slug)
    .single()

  if (!slugData) return null

  // Traer affiliation_link y profile_photo_url desde private_users
  const { data: userData } = await supabase
    .from('private_users')
    .select('affiliation_link, profile_photo_url')
    .eq('constructor_id', slugData.constructor_id)
    .single()

  // foto_url: preferir la del slug (ya sincronizada), fallback a profile_photo_url
  const foto_url = slugData.foto_url || userData?.profile_photo_url || null

  return {
    ...slugData,
    foto_url,
    affiliationLink: userData?.affiliation_link ?? null,
  }
}

// ── Metadata dinámica (Open Graph para WhatsApp) ───────────────
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const constructor = await getConstructorBySlug(params.slug)
  if (!constructor) return { title: 'CreaTuActivo' }

  const nombre = constructor.display_name || params.slug
  const frase = constructor.frase_personal || 'Construyendo patrimonio paralelo.'
  // Stripping query params (?t=...) — WhatsApp OG scraper rejects images with query strings
  const foto = constructor.foto_url?.split('?')[0] || null

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

  const { slug, display_name, foto_url, frase_personal, whatsapp, affiliationLink } = constructor
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

      {/* Micro-contexto */}
      <p style={{
        fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase',
        color: '#4a4a3a', marginBottom: '14px', alignSelf: 'flex-start',
        maxWidth: '400px', width: '100%',
        fontFamily: 'var(--font-roboto-mono), monospace',
      }}>
        Elige por dónde empezar:
      </p>

      {/* Links */}
      <div style={{ width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {DESTINOS.map((d) => {
          const isHighlight = d.highlight
          return (
            <a
              key={d.key}
              href={`/${slug}/${d.key}`}
              style={{
                display: 'flex', alignItems: 'center', gap: '14px',
                padding: isHighlight ? '18px 20px' : '14px 20px',
                background: isHighlight ? '#111111' : '#0d0d0d',
                border: `1px solid ${isHighlight ? '#2e2e2e' : '#181818'}`,
                color: '#F5F5F0', textDecoration: 'none',
                clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)',
              }}
            >
              <d.Icon
                size={isHighlight ? 22 : 20}
                color={isHighlight ? '#E8E8E0' : '#505050'}
                style={{ flexShrink: 0 }}
              />
              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: isHighlight ? '1rem' : '0.9rem',
                  fontWeight: isHighlight ? 600 : 400,
                  letterSpacing: '0.02em',
                  color: isHighlight ? '#F5F5F0' : '#8A8A80',
                }}>
                  {d.label}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#484840', marginTop: '2px' }}>{d.desc}</div>
              </div>
              <ChevronRight size={14} color={isHighlight ? '#606058' : '#2a2a2a'} style={{ flexShrink: 0 }} />
            </a>
          )
        })}

        {/* Activación Directa */}
        {affiliationLink && (
          <a
            href={affiliationLink}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex', alignItems: 'center', gap: '14px',
              padding: '14px 20px',
              background: '#0d0d0d',
              border: '1px solid rgba(200,168,75,0.2)',
              color: '#F5F5F0', textDecoration: 'none',
              clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)',
            }}
          >
            <Zap size={20} color='#505050' style={{ flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 400, letterSpacing: '0.02em', color: '#8A8A80' }}>Activación Directa</div>
              <div style={{ fontSize: '0.72rem', color: '#484840', marginTop: '2px' }}>Únete directamente a mi equipo</div>
            </div>
            <ChevronRight size={14} color='#2a2a2a' style={{ flexShrink: 0 }} />
          </a>
        )}

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
              fontSize: '0.9rem', letterSpacing: '0.08em', textTransform: 'uppercase',
              clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)',
            }}
          >
            <MessageCircle size={20} color='#000' />
            Hablar con {nombre.split(' ')[0]}
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
