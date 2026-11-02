'use client';

/**
 * Copyright © 2026 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * El ciclo de la propiedad, dibujado (2 nov 2026, Director: «es genial» en el video v9,
 * «si» para el deck). Es el mismo dibujo del video de la presentación
 * (scripts/dankoe-video/captions/work/plan-servilleta/escenas.js, función `propiedad`),
 * con su propio reloj: en el deck no hay voz que lo marque, y el socio habla encima.
 *
 * Las figuras tienen un solo significado (Director, 2 nov 2026): la figura humana es una
 * persona (usted, el cliente); el cubo es su empresa, los tres elementos armados; la caja
 * es un paquete empresarial; el % es lo que le queda a usted. El orbe es Queswa y no
 * aparece aquí.
 *
 *   modo «propiedad» (pantalla 5, «La diferencia»): el cliente llega a su empresa y queda
 *     a su nombre; la compra recorre el ciclo y cada vuelta deja caer un % sobre usted.
 *     Tras la segunda vuelta usted se atenúa y el ciclo sigue: «aunque usted no esté
 *     presente».
 *   modo «gana» (pantalla 8, «Cómo se gana»): el mismo ciclo para el producto que vuelven
 *     a pedir, y cada tanto una caja entra a su empresa por su propio camino y también
 *     deja su %.
 *
 * Corre solo mientras su beat está encendido y vuelve a empezar al entrar. Con movimiento
 * reducido del sistema queda un cuadro quieto, con el ciclo completo y un % cayendo.
 */
import { useEffect, useRef, type CSSProperties } from 'react';

const ORO = '#C5A059';
const W = 360;
const A = 230;
const cl = (u: number) => Math.max(0, Math.min(1, u));
const sale = (u: number) => 1 - Math.pow(1 - cl(u), 3);
const suave = (u: number) => { u = cl(u); return u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2; };
const lerp = (a: number, b: number, u: number) => a + (b - a) * u;

// El reloj del deck. La vuelta es más lenta que en el video: aquí el socio habla encima.
const VUELTA = 3.2;
const SUBE = VUELTA / 2;
const CAE = 0.55;
const VIAJE = 1.3;

function figura(x: number, y: number, e: number) {
  return `<g transform="translate(${x} ${y}) scale(${e})"><circle cx="12" cy="6.8" r="4.3"/><path d="M3.2 22c0-5.2 3.9-8.6 8.8-8.6s8.8 3.4 8.8 8.6z"/></g>`;
}

export default function CicloPropiedad({ modo, activo }: { modo: 'propiedad' | 'gana'; activo: boolean }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const gana = modo === 'gana';
  const CX = gana ? 215 : 180;
  const CY = 95;
  const RX = gana ? 90 : 105;
  const RY = 58;

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg || !activo) return;
    const q = <T extends Element>(sel: string) => svg.querySelector(sel) as T;
    const ciclo = q<SVGPathElement>('[data-p="ciclo"]');
    const flecha = q<SVGLineElement>('[data-p="flecha"]');
    const aSuNombre = q<SVGTextElement>('[data-p="nombre"]');
    const empresa = q<SVGGElement>('[data-p="empresa"]');
    const rotEmpresa = q<SVGTextElement>('[data-p="rot-empresa"]');
    const cliente = q<SVGGElement>('[data-p="cliente"]');
    const rotCliente = q<SVGTextElement>('[data-p="rot-cliente"]');
    const figUsted = q<SVGGElement>('[data-p="fig-usted"]');
    const usted = q<SVGTextElement>('[data-p="usted"]');
    const compra = q<SVGCircleElement>('[data-p="compra"]');
    const camino = q<SVGLineElement>('[data-p="camino"]');
    const caja = q<SVGGElement>('[data-p="caja"]');
    const rotCaja = q<SVGTextElement>('[data-p="rot-caja"]');
    const pcts = [...svg.querySelectorAll<SVGTextElement>('[data-p="pct"]')];

    const largo = ciclo.getTotalLength();
    ciclo.style.strokeDasharray = `${largo} ${largo}`;
    const largoF = RX * 2 - 56;
    if (flecha) flecha.style.strokeDasharray = `${largoF} ${largoF}`;
    const pto = (th: number) => [CX + RX * Math.cos(th), CY - RY * Math.sin(th)];
    const P0 = [-6, CY + 48];
    const P1 = [CX - RX - 34, CY + 12];

    // Los momentos, en segundos desde que se enciende el beat.
    const T = gana
      ? { cliente: 0.2, empresa: 0.35, llega: 0, nombre: 0, arranque: 0.9, ausente: 1e9 }
      : { cliente: 0.2, empresa: 0.5, llega: 0.9, nombre: 1.5, arranque: 2.5, ausente: 0 };
    if (!gana) T.ausente = T.arranque + SUBE + VUELTA + CAE + 0.6;
    // En «cómo se gana» entra un paquete en la segunda vuelta y luego cada tres.
    const cajas = (t: number) => {
      if (!gana) return [] as number[];
      const r: number[] = [];
      for (let k = 0; ; k++) { const e = T.arranque + VUELTA * 0.9 + k * VUELTA * 3; if (e > t + VIAJE + 2) break; r.push(e); }
      return r;
    };

    const pintar = (t: number) => {
      const vCliente = cl((t - T.cliente) / 0.4);
      cliente.style.opacity = rotCliente.style.opacity = String(vCliente);
      const vEmpresa = cl((t - T.empresa) / 0.4);
      empresa.style.opacity = rotEmpresa.style.opacity = String(vEmpresa);
      const ausente = suave((t - T.ausente) / 0.8);
      const vUsted = (vEmpresa * lerp(1, 0.28, ausente)).toFixed(3);
      usted.style.opacity = figUsted.style.opacity = vUsted;
      const enCiclo = cl((t - T.arranque) / 0.6);
      if (!gana) {
        const fl = sale((t - T.llega) / 0.9);
        flecha.style.strokeDashoffset = String(largoF * (1 - fl));
        flecha.style.opacity = (lerp(1, 0.22, enCiclo) * (t >= T.llega ? 1 : 0)).toFixed(3);
        aSuNombre.style.opacity = (cl((t - T.nombre) / 0.4) * lerp(1, 0.22, enCiclo)).toFixed(3);
      }
      // La compra recorre el ciclo: arriba, del cliente a su empresa; abajo, de vuelta.
      const th = t >= T.arranque ? (Math.PI * (t - T.arranque)) / SUBE : 0;
      ciclo.style.strokeDashoffset = String(largo * (1 - Math.min(1, th / (2 * Math.PI))));
      ciclo.style.opacity = t >= T.arranque ? '1' : '0';
      const [x, y] = pto(th);
      compra.setAttribute('cx', x.toFixed(1));
      compra.setAttribute('cy', y.toFixed(1));
      compra.style.opacity = t >= T.arranque ? '1' : '0';
      // Las llegadas a su empresa: cada vuelta y cada paquete.
      const llegadas: number[] = [];
      for (let k = 0; ; k++) { const e = T.arranque + SUBE + k * VUELTA; if (e > t) break; llegadas.push(e); }
      if (gana) {
        let vCaja = 0, oCamino = 0, pos = P0, oRot = 0;
        for (const e of cajas(t)) {
          const u = (t - e) / VIAJE;
          if (u < -0.2 || u > 2.2) continue;
          vCaja = cl((t - e + 0.2) / 0.3) * (1 - cl((u - 1) * VIAJE / 0.4 - 0.5));
          oCamino = cl((t - e + 0.2) / 0.4) * 0.7 * (1 - cl((u - 1.4) / 0.6));
          oRot = cl((t - e) / 0.4) * (1 - cl((u - 1.6) / 0.5));
          const v = suave(u);
          pos = [lerp(P0[0], P1[0], v), lerp(P0[1], P1[1], v)];
          if (e + VIAJE <= t) llegadas.push(e + VIAJE);
        }
        caja.setAttribute('opacity', vCaja.toFixed(3));
        caja.setAttribute('transform', `translate(${pos[0].toFixed(1)} ${pos[1].toFixed(1)})`);
        camino.setAttribute('opacity', oCamino.toFixed(3));
        rotCaja.style.opacity = oRot.toFixed(3);
      }
      llegadas.sort((a, b) => a - b);
      const activas = llegadas.map((e) => (t - e) / CAE).filter((u) => u >= 0 && u <= 1.6).slice(-2);
      pcts.forEach((p, i) => {
        const u = activas[i];
        if (u === undefined || u > 1.4) { p.style.opacity = '0'; return; }
        p.setAttribute('x', String(CX - RX));
        p.setAttribute('y', lerp(CY + 44, A - 66, suave(Math.min(u, 1))).toFixed(1));
        p.style.opacity = String(u <= 1 ? 1 : (1.4 - u) / 0.4);
      });
      // Usted se enciende en oro cuando le cae el %.
      const brillo = Math.max(0, ...activas.map((u) => (u >= 0.9 && u <= 1.6 ? Math.sin((Math.PI * (u - 0.9)) / 0.7) : 0)));
      const oro = `rgb(${Math.round(lerp(229, 197, brillo))},${Math.round(lerp(229, 160, brillo))},${Math.round(lerp(229, 89, brillo))})`;
      usted.style.fill = brillo > 0 ? oro : '#FFFFFF';
      figUsted.setAttribute('fill', brillo > 0 ? oro : '#E5E5E5');
    };

    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      // Un cuadro quieto: el ciclo completo, usted presente y un % a medio caer.
      pintar(gana ? T.arranque + VUELTA * 0.9 + VIAJE + CAE * 0.6 : T.arranque + SUBE + VUELTA + CAE * 0.6);
      if (!gana) { usted.style.opacity = figUsted.style.opacity = '1'; }
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const paso = (ahora: number) => { pintar((ahora - t0) / 1000); raf = requestAnimationFrame(paso); };
    raf = requestAnimationFrame(paso);
    return () => cancelAnimationFrame(raf);
  }, [activo, gana, CX, RX]);

  const MONO: CSSProperties = { fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: 2.2, textTransform: 'uppercase' };
  let d = '';
  for (let k = 0; k <= 120; k++) {
    const th = (k / 120) * 2 * Math.PI;
    d += `${k ? 'L' : 'M'}${(CX + RX * Math.cos(th)).toFixed(2)} ${(CY - RY * Math.sin(th)).toFixed(2)}`;
  }
  const oculto = { opacity: 0 };

  return (
    <svg
      ref={svgRef}
      className="pd-ciclo"
      viewBox={`0 0 ${W} ${A}`}
      role="img"
      aria-label={gana
        ? 'La compra del cliente recorre un ciclo con su empresa y un paquete entra a su empresa; cada vuelta y cada paquete le dejan a usted un porcentaje.'
        : 'El cliente llega a su empresa y queda a su nombre; cada vez que vuelve a comprar, a usted le queda un porcentaje, aunque usted no esté presente.'}
    >
      <path data-p="ciclo" d={d} fill="none" stroke={ORO} strokeWidth={1.6} strokeLinecap="round" style={oculto} />
      {!gana && <line data-p="flecha" x1={CX + RX - 22} y1={CY} x2={CX - RX + 34} y2={CY} stroke={ORO} strokeWidth={1.4} style={oculto} />}
      {gana && <line data-p="camino" x1={-6} y1={CY + 48} x2={CX - RX - 34} y2={CY + 12} stroke={ORO} strokeWidth={1.3} strokeDasharray="3 5" opacity={0} />}
      {!gana && <text data-p="nombre" x={CX} y={CY - 8} textAnchor="middle" style={{ ...MONO, fill: ORO, opacity: 0 }}>A su nombre</text>}
      <g data-p="empresa" style={oculto}>
        <g transform={`translate(${CX - RX - 26} ${CY - 26}) scale(0.52)`}>
          <polygon points="6,11 46,6 46,95 6,89" fill="#E7D6B7" />
          <polygon points="46,6 95,11 95,88 46,95" fill="#F7E5C6" />
        </g>
      </g>
      <g data-p="cliente" fill="#E5E5E5" style={oculto} dangerouslySetInnerHTML={{ __html: figura(CX + RX - 13, CY - 15, 1.1) }} />
      <g data-p="fig-usted" fill="#E5E5E5" style={oculto} dangerouslySetInnerHTML={{ __html: figura(CX - RX - 13, A - 64, 1.1) }} />
      <text data-p="rot-cliente" x={CX + RX + 17} y={CY + 4} style={{ ...MONO, fill: 'var(--pd-muted)', opacity: 0 }}>Cliente</text>
      <text data-p="rot-empresa" x={CX - RX - 13} y={CY - 52} textAnchor="middle" style={{ ...MONO, fill: 'var(--pd-muted)', opacity: 0 }}>Su empresa</text>
      <text data-p="usted" x={CX - RX} y={A - 14} textAnchor="middle"
        style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 15, letterSpacing: 0.4, textTransform: 'uppercase', fill: '#FFFFFF', opacity: 0 }}>Usted</text>
      <circle data-p="compra" r={4.2} fill={ORO} style={oculto} />
      {gana && (
        <g data-p="caja" opacity={0}>
          <g transform="translate(-13 -12)">
            <polygon points="0,6 13,0 26,6 13,12" fill="#B9A27A" />
            <polygon points="0,6 13,12 13,26 0,20" fill="#8C7650" />
            <polygon points="13,12 26,6 26,20 13,26" fill="#A58D63" />
            <polygon points="5.5,3.4 18.5,9.4 18.5,11 5.5,5" fill={ORO} />
          </g>
        </g>
      )}
      {gana && <text data-p="rot-caja" x={22} y={CY + 72} textAnchor="middle" style={{ ...MONO, fill: 'var(--pd-muted)', opacity: 0 }}>Paquete</text>}
      {[0, 1].map((i) => (
        <text key={i} data-p="pct" x={0} y={0} textAnchor="middle"
          style={{ fontFamily: 'var(--font-mono)', fontSize: 15, fontWeight: 700, fill: ORO, opacity: 0 }}>%</text>
      ))}
    </svg>
  );
}
