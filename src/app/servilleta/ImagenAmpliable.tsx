'use client';

/**
 * Copyright © 2026 CreaTuActivo.com
 *
 * Imagen que se amplía con los dedos, para la ficha de cada línea del producto en
 * /servilleta (16 nov 2026). El pellizco nativo no sirve ahí: `.pd-root` lleva
 * `touch-action: pan-y` para el swipe del deck, y ese valor se hereda por
 * intersección a todo lo que va adentro, ficha incluida. Por eso el zoom se hace
 * aquí, sobre la imagen y no sobre la página:
 *   · dos dedos: pellizco (1× a 4×), anclado al punto entre los dedos;
 *   · un dedo con la imagen ampliada: la arrastra;
 *   · un dedo sin ampliar: desplaza la ficha, como si el gesto fuera nativo;
 *   · doble toque (o doble clic): 1× ↔ 2,5× en ese punto;
 *   · en el computador, Ctrl + rueda o el pellizco del trackpad.
 * Se reinicia sola al cambiar de línea: el padre la remonta con `key`.
 */

import { useEffect, useRef } from 'react';

const MAX = 4;
const DOBLE = 2.5;

type P = { x: number; y: number };

export default function ImagenAmpliable({ src, alt }: { src: string; alt: string }) {
  const marco = useRef<HTMLDivElement | null>(null);
  const img = useRef<HTMLImageElement | null>(null);
  const t = useRef({ s: 1, x: 0, y: 0 });
  const dedos = useRef(new Map<number, P>());
  const inicio = useRef({ s: 1, x: 0, y: 0, dist: 0, mid: { x: 0, y: 0 } as P, p: { x: 0, y: 0 } as P });
  const ultimoToque = useRef({ t: 0, x: 0, y: 0 });
  const movio = useRef(false);

  // Punto en coordenadas del marco, con origen en su centro.
  const local = (cx: number, cy: number): P => {
    const r = marco.current!.getBoundingClientRect();
    return { x: cx - r.left - r.width / 2, y: cy - r.top - r.height / 2 };
  };

  const aplicar = (s: number, x: number, y: number, animar = false) => {
    const el = marco.current;
    if (!el || !img.current) return;
    s = Math.min(MAX, Math.max(1, s));
    const mx = ((s - 1) * el.clientWidth) / 2;
    const my = ((s - 1) * el.clientHeight) / 2;
    x = Math.min(mx, Math.max(-mx, x));
    y = Math.min(my, Math.max(-my, y));
    if (s === 1) { x = 0; y = 0; }
    t.current = { s, x, y };
    img.current.style.transition = animar ? 'transform 0.25s ease' : 'none';
    img.current.style.transform = `translate(${x}px, ${y}px) scale(${s})`;
    el.classList.toggle('ampliada', s > 1);
  };

  // Escala nueva manteniendo fijo el punto p (local) bajo el dedo o el cursor.
  const zoomEn = (p: P, s: number, animar = false) => {
    const { s: s0, x, y } = t.current;
    const k = Math.min(MAX, Math.max(1, s)) / s0;
    aplicar(s0 * k, p.x - (p.x - x) * k, p.y - (p.y - y) * k, animar);
  };

  const fijarInicio = () => {
    const ps = [...dedos.current.values()];
    const { s, x, y } = t.current;
    if (ps.length >= 2) {
      const [a, b] = ps;
      inicio.current = {
        s, x, y,
        dist: Math.hypot(a.x - b.x, a.y - b.y) || 1,
        mid: local((a.x + b.x) / 2, (a.y + b.y) / 2),
        p: { x: 0, y: 0 },
      };
    } else if (ps.length === 1) {
      inicio.current = { ...inicio.current, s, x, y, p: ps[0] };
    }
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    e.stopPropagation();
    marco.current?.setPointerCapture(e.pointerId);
    dedos.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (dedos.current.size === 1) movio.current = false;
    fijarInicio();
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dedos.current.has(e.pointerId)) return;
    const previo = dedos.current.get(e.pointerId)!;
    dedos.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const ps = [...dedos.current.values()];
    const ini = inicio.current;

    if (ps.length >= 2) {
      movio.current = true;
      const [a, b] = ps;
      const k = Math.hypot(a.x - b.x, a.y - b.y) / ini.dist;
      const s = Math.min(MAX, Math.max(1, ini.s * k));
      const mid = local((a.x + b.x) / 2, (a.y + b.y) / 2);
      // El punto de la imagen que estaba entre los dedos sigue entre los dedos.
      const lx = (ini.mid.x - ini.x) / ini.s;
      const ly = (ini.mid.y - ini.y) / ini.s;
      aplicar(s, mid.x - lx * s, mid.y - ly * s);
      return;
    }

    const dx = e.clientX - ini.p.x;
    const dy = e.clientY - ini.p.y;
    if (Math.abs(dx) > 6 || Math.abs(dy) > 6) movio.current = true;
    if (t.current.s > 1) {
      aplicar(t.current.s, ini.x + dx, ini.y + dy);
    } else if (e.pointerType !== 'mouse') {
      // Sin ampliar, un dedo desplaza la ficha: el marco tiene touch-action: none.
      const ficha = marco.current?.closest('.pd-modal') as HTMLElement | null;
      if (ficha) ficha.scrollTop -= e.clientY - previo.y;
    }
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (!dedos.current.has(e.pointerId)) return;
    dedos.current.delete(e.pointerId);
    fijarInicio();
    if (dedos.current.size > 0 || movio.current) return;
    // Doble toque: alterna entre la imagen completa y 2,5× en ese punto.
    const ahora = Date.now();
    const u = ultimoToque.current;
    if (ahora - u.t < 320 && Math.hypot(e.clientX - u.x, e.clientY - u.y) < 30) {
      if (t.current.s > 1) aplicar(1, 0, 0, true);
      else zoomEn(local(e.clientX, e.clientY), DOBLE, true);
      ultimoToque.current = { t: 0, x: 0, y: 0 };
    } else {
      ultimoToque.current = { t: ahora, x: e.clientX, y: e.clientY };
    }
  };

  // Ctrl + rueda y el pellizco del trackpad (que llega como wheel con ctrlKey). Va
  // con addEventListener porque React registra wheel como pasivo y no deja
  // cancelar el zoom de la página.
  useEffect(() => {
    const el = marco.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (!e.ctrlKey) return;
      e.preventDefault();
      zoomEn(local(e.clientX, e.clientY), t.current.s * Math.exp(-e.deltaY / 200));
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={marco}
      className="pd-zoom"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      // El deck no debe leer como swipe lo que pasa sobre la imagen.
      onTouchStart={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
      onTouchEnd={(e) => e.stopPropagation()}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img ref={img} src={src} alt={alt} draggable={false} />
    </div>
  );
}
