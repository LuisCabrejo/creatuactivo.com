'use client';

/**
 * Copyright © 2026 CreaTuActivo.com
 *
 * El reproductor con que el chat web pinta un video que Queswa entrega en la
 * conversación (8 oct 2026): «Cómo funciona», «Cómo entra el dinero», «Qué debo
 * hacer yo» y «Los 12 Niveles». Es el mismo corte que WhatsApp manda al
 * prospecto y que el Dashboard pinta al socio (Dashboard/src/components/nexus/
 * VideoQueswa.tsx). El motor lo pide con el marcador `[[video:…]]`; la lista de
 * videos vive en src/lib/queswa-videos.ts.
 *
 * Sin reproducción automática: en el teléfono un video con sonido solo arranca
 * con el toque de la persona, y el chat no debe ponerse a hablar solo.
 */

import React from 'react';
import type { VideoQueswa as VideoQueswaDef } from '@/lib/queswa-videos';

const GOLD = '#C5A059';
const TITANIUM = '#94A3B8';
const BORDER = 'rgba(255,255,255,0.10)';
const SURFACE = '#15171C';

export default function VideoQueswa({ video }: { video: VideoQueswaDef }) {
  return (
    <div style={{ margin: '10px 0 14px', maxWidth: 280, background: SURFACE, border: `1px solid ${BORDER}`, overflow: 'hidden' }}>
      <div style={{ position: 'relative', background: '#000' }}>
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <video
          src={video.url}
          poster={video.poster}
          controls
          playsInline
          preload="metadata"
          aria-label={`Video: ${video.titulo}`}
          style={{ width: '100%', aspectRatio: '9 / 16', display: 'block', background: '#000' }}
        />
        <div
          style={{
            position: 'absolute', top: 8, left: 8,
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'rgba(11,12,12,0.85)', border: `1px solid ${BORDER}`,
            padding: '3px 8px', pointerEvents: 'none',
          }}
        >
          <span style={{ fontSize: 9, fontWeight: 700, color: GOLD, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            {video.titulo}
          </span>
          <span style={{ fontSize: 9, color: TITANIUM, letterSpacing: '0.08em' }}>· {video.duracion} s</span>
        </div>
      </div>
    </div>
  );
}
