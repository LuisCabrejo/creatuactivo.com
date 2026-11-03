'use client';

/**
 * Copyright © 2026 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * «Su día se resume en dos acciones», dibujado (3 nov 2026, Director: «aprueba los textos»).
 * Es la misma escena del video de la presentación v14
 * (scripts/dankoe-video/captions/work/plan-servilleta/escenas.js, función `dia`): dos
 * teléfonos, «Usted» y «Ana María», y una sola historia en orden. Usted copia su enlace en
 * queswa.app, lo pega en WhatsApp y se lo envía; ella pasa por la página puente y conversa
 * con Queswa; cuando pide hablar con una persona, a usted le llega el aviso y la saluda.
 *
 * Por qué en el deck (Director, 3 nov 2026): casi todas las presentaciones son online, y
 * «VERLA POR DENTRO» abre una ventana que no se ve al compartir. Sin este paso, el deck en
 * una llamada nunca mostraba lo que hace el socio.
 *
 * Sin voz y en tres tramos, uno por clic (Compartir · Queswa · Recibir): el socio narra a
 * su ritmo, y cada tramo se queda quieto en su último cuadro hasta el clic siguiente. Las
 * pantallas de queswa.app y la página puente son capturas con la socia de ejemplo de las
 * guías del Dashboard (Carolina Ríos), sin datos reales; WhatsApp va dibujado como esquema.
 * Los textos de Queswa son los del sistema: el comienzo de WHY_02 🔒 y `respuestaPersona`
 * del nodo 2.46; el aviso es el de `avisarPidePersona`.
 *
 * Con movimiento reducido del sistema, cada clic salta al último cuadro de su tramo.
 */
import { useEffect, useRef, useState } from 'react';

const IMG = {
  inicio: '/images/servilleta/su-dia/inicio-v1.webp',
  copiado: '/images/servilleta/su-dia/copiado-v1.webp',
  puente: '/images/servilleta/su-dia/puente-v1.webp',
  og: '/images/servilleta/su-dia/og-queswa-v1.webp',
  // Rectángulos en px de la app (pantalla de 390×844).
  enlace: { x: 16.6, y: 212.5, w: 308.8, h: 60.8 },
  campana: { x: 338, y: 6, w: 36, h: 36 },
  boton: { x: 16, y: 583.5, w: 358, h: 60 },
};

// Los tiempos del video v14 (tiempos.json, «p5-dia»), relativos al inicio de la escena.
const T = {
  compartir: 2.6, toca: 4.21, pega: 5.65, envia: 6.96, recibe: 10.97, conversa: 11.32,
  responde: 14.68, madura: 15.53, fin2: 17.56, recibir: 19.46, aviso: 22.13, saluda: 23.08, fin3: 25.36,
};
// Cada tramo arranca donde terminó el anterior, así que avanzar es continuo; cada uno
// termina en un cuadro que se lee solo: el enlace ya enviado, la respuesta de Queswa, el saludo.
const TRAMOS: [number, number][] = [[2.3, 10.7], [10.7, 18.9], [18.9, 27.5]];

const cl = (u: number) => Math.max(0, Math.min(1, u));
const sale = (u: number) => 1 - Math.pow(1 - cl(u), 3);
const suave = (u: number) => { u = cl(u); return u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2; };
const lerp = (a: number, b: number, u: number) => a + (b - a) * u;
const el = (tag: string, css?: string, html?: string) => {
  const e = document.createElement(tag);
  if (css) e.style.cssText = css;
  if (html != null) e.innerHTML = html;
  return e;
};

type Escena = { pintar: (t: number) => void; SW: number; SH: number };

// H: la versión ancha (computador y proyector); si no, la del teléfono.
function armar(raiz: HTMLElement, H: boolean): Escena {
  const SW = H ? 1180 : 373, SH = H ? 520 : 548;                 // la ventana de la cámara
  const PW = H ? 236 : 168, PH = PW * 844 / 390, GAPF = H ? 150 : 22;
  const k = (PW - 10) / 390;                                       // pantalla de 390×844 dentro del marco
  const MW = PW * 2 + GAPF, MH = PH + 46;
  raiz.innerHTML = '';
  // Los bordes se difuminan: en el deck la escena vive en medio de la página, y el acercamiento
  // dejaba cortes duros donde en el video estaba el borde del cuadro.
  const borde = 'linear-gradient(to right,transparent,#000 5%,#000 95%,transparent),linear-gradient(to bottom,transparent,#000 4%,#000 96%,transparent)';
  const ventana = el('div', `position:relative;width:${SW}px;height:${SH}px;overflow:hidden;-webkit-mask-image:${borde};mask-image:${borde};-webkit-mask-composite:source-in;mask-composite:intersect`);
  const mundo = el('div', `position:absolute;left:0;top:0;width:${MW}px;height:${MH}px;transform-origin:0 0`);
  ventana.appendChild(mundo); raiz.appendChild(ventana);

  // ── Los dos teléfonos ──
  type Tel = { pant: HTMLElement; app: HTMLElement; x0: number; y0: number };
  const telefono = (x: number, quien: string): Tel => {
    const rot = el('p', `position:absolute;left:${x}px;top:0;width:${PW}px;text-align:center;margin:0;font-family:var(--font-mono);font-size:${H ? 13 : 10}px;letter-spacing:0.2em;text-transform:uppercase;color:#E5E5E5`, quien);
    const app = el('p', `position:absolute;left:${x}px;top:${PH + 30}px;width:${PW}px;text-align:center;margin:0;font-family:var(--font-mono);font-size:${H ? 12 : 9}px;letter-spacing:0.18em;color:var(--pd-muted)`, '');
    const marco = el('div', `position:absolute;left:${x}px;top:22px;width:${PW}px;height:${PH}px;box-sizing:border-box;padding:5px;background:#000;border:1px solid rgba(255,255,255,0.2);border-radius:${PW * 0.12}px;box-shadow:0 24px 60px rgba(0,0,0,0.6)`);
    const pant = el('div', `position:relative;width:390px;height:844px;transform:scale(${k});transform-origin:0 0;overflow:hidden;border-radius:${PW * 0.1 / k}px;background:#0B141A`);
    marco.appendChild(pant); mundo.append(rot, marco, app);
    return { pant, app, x0: x + 5, y0: 27 };
  };
  const A = telefono(0, 'Usted'), B = telefono(PW + GAPF, 'Ana María');
  const capa = (t: Tel, html: string) => { const e = el('div', 'position:absolute;inset:0;opacity:0', html); t.pant.appendChild(e); return e; };
  const img = (src: string) => `<img src="${src}" alt="" style="display:block;width:390px;height:844px">`;

  // WhatsApp, en esquema: cabecera, mensajes que se apilan desde abajo y la barra para escribir.
  const WA = (nombre: string, inicial: string, color: string) => {
    const c = el('div', 'position:absolute;inset:0;opacity:0;background:#0B141A;font-family:var(--font-sans);display:flex;flex-direction:column');
    c.innerHTML = `<div style="height:64px;flex:none;background:#1F2C34;display:flex;align-items:center;gap:12px;padding:0 14px">
        <span style="color:#AEBAC1;font-size:22px">‹</span>
        <span style="width:38px;height:38px;border-radius:50%;background:${color};display:flex;align-items:center;justify-content:center;color:#0B141A;font-weight:800;font-size:17px">${inicial}</span>
        <span><b style="display:block;color:#E9EDEF;font-size:17px;font-weight:600">${nombre}</b><span style="color:#8696A0;font-size:12.5px">en línea</span></span></div>
      <div class="m" style="flex:1;display:flex;flex-direction:column;justify-content:flex-end;gap:8px;padding:12px 12px 10px;overflow:hidden"></div>
      <div style="flex:none;display:flex;align-items:center;gap:8px;padding:8px 10px 14px">
        <div style="flex:1;min-height:46px;border-radius:23px;background:#2A3942;color:#E9EDEF;font-size:15.5px;display:flex;align-items:center;padding:0 16px;white-space:nowrap;overflow:hidden"><span class="ph" style="color:#8696A0">Mensaje</span><span class="txt"></span></div>
        <div style="width:46px;height:46px;border-radius:50%;background:#00A884;display:flex;align-items:center;justify-content:center"><svg viewBox="0 0 24 24" width="22" height="22" fill="#0B141A"><path d="M3 20.5 21 12 3 3.5v6.6l12 1.9-12 1.9z"/></svg></div></div>`;
    return c;
  };
  const burbuja = (cont: HTMLElement, html: string, sale_: boolean, extra = '') => {
    const e = el('div', `display:none;align-self:${sale_ ? 'flex-end' : 'flex-start'};max-width:82%;background:${sale_ ? '#005C4B' : '#202C33'};color:#E9EDEF;font-size:15px;line-height:1.38;padding:7px 10px 6px;border-radius:9px;${extra}`, html);
    cont.querySelector('.m')!.appendChild(e); return e;
  };
  const LINK = 'https://creatuactivo.com/carolina-rios/queswa';
  const tarjetaLink = `<div style="margin:-2px -5px 6px;border-radius:6px;overflow:hidden;background:rgba(0,0,0,0.25)"><img src="${IMG.og}" alt="" style="display:block;width:100%">
    <div style="padding:6px 8px"><b style="display:block;font-size:13.5px">Hable con Queswa</b><span style="font-size:12px;color:#AEBAC1">creatuactivo.com</span></div></div>`;
  const linkHtml = `${tarjetaLink}<span style="color:#53BDEB;text-decoration:underline;word-break:break-all">${LINK}</span>`;
  const escribiendo = (cont: HTMLElement) => burbuja(cont, '<span style="letter-spacing:3px;color:#AEBAC1">•••</span>', false);

  // Usted: queswa.app, WhatsApp con Ana María, y queswa.app otra vez con el aviso.
  const aIni = capa(A, img(IMG.inicio)), aCop = capa(A, img(IMG.copiado));
  const aWA = WA('Ana María', 'A', '#C9A27E'); A.pant.appendChild(aWA);
  const aLink = burbuja(aWA, linkHtml, true, 'width:82%'), aSaludo = burbuja(aWA, '¡Hola, Ana María! Soy Carolina. ¿Le parece si hablamos hoy?', true);
  const pegar = el('div', 'position:absolute;left:30px;bottom:74px;background:#3B4A54;color:#E9EDEF;font-size:15px;padding:9px 16px;border-radius:8px;opacity:0;box-shadow:0 6px 18px rgba(0,0,0,.4)', 'Pegar');
  aWA.appendChild(pegar);
  const aIni2 = capa(A, img(IMG.inicio));
  const C0 = IMG.campana;
  const badge = el('span', `position:absolute;left:${C0.x + C0.w - 15}px;top:${C0.y + 1}px;min-width:16px;height:16px;border-radius:8px;background:#22D3EE;box-shadow:0 0 10px rgba(34,211,238,.85);color:#0F1115;font:800 9.5px/16px var(--font-sans);text-align:center;opacity:0`, '1');
  const halo = el('span', `position:absolute;left:${C0.x - 6}px;top:${C0.y - 6}px;width:${C0.w + 12}px;height:${C0.h + 12}px;border-radius:50%;box-shadow:0 0 0 2px rgba(34,211,238,.9),0 0 26px rgba(34,211,238,.6);opacity:0`);
  aIni2.append(badge, halo);
  const banner = el('div', 'position:absolute;left:10px;right:10px;top:58px;background:rgba(44,46,52,0.97);border-radius:18px;padding:12px 14px;display:flex;gap:11px;align-items:flex-start;box-shadow:0 10px 30px rgba(0,0,0,.55);font-family:var(--font-sans);opacity:0');
  banner.innerHTML = `<span style="flex:none;width:36px;height:36px;border-radius:9px;background:#0F1115;border:1px solid rgba(255,255,255,.18);display:flex;align-items:center;justify-content:center;color:#fff;font:800 12px var(--font-sans);letter-spacing:.04em">Q</span>
    <span style="min-width:0"><span style="display:flex;justify-content:space-between;font-size:12px;color:#A3A3A3;letter-spacing:.04em"><span>QUESWA</span><span>ahora</span></span>
    <b style="display:block;color:#fff;font-size:15px;margin-top:2px">🙋 Ana María pide hablar con una persona</b>
    <span style="display:block;color:#D4D4D4;font-size:13.5px;line-height:1.35;margin-top:2px">Lo último que escribió: «Me interesa. ¿Puedo hablar con una persona?»</span></span>`;
  A.pant.appendChild(banner);

  // Ana María: el enlace que llega, la página puente y su conversación con Queswa.
  const bWA = WA('Carolina Ríos', 'C', '#94A3B8'); B.pant.appendChild(bWA);
  const bLink = burbuja(bWA, linkHtml, false, 'width:82%');
  const bPuente = capa(B, img(IMG.puente));
  const bQ = WA('Queswa', 'Q', '#E5E5E5'); B.pant.appendChild(bQ);
  const q1 = burbuja(bQ, '¿Cómo funciona?', true), q1e = escribiendo(bQ);
  const r1 = burbuja(bQ, 'Con gusto. Funciona así: una empresa de distribución moderna necesita tres elementos que, armados por su cuenta, le costarían millones. Usted los recibe en una sola aplicación.<br><br>1. <b>Un fabricante</b>, que empaca y despacha cada pedido hasta la casa del cliente.<br><br>2. <b>Una máquina de ventas</b>: esta conversación es una muestra…', false);
  const q2 = burbuja(bQ, 'Me interesa. ¿Puedo hablar con una persona?', true), q2e = escribiendo(bQ);
  const r2 = burbuja(bQ, 'Claro que sí. Ya le avisé a Carolina Ríos, y se comunica con usted por este mismo medio.', false);

  // El toque: un círculo que llega, se hunde y se va.
  const dedo = (t: Tel) => { const d = el('span', 'position:absolute;width:44px;height:44px;margin:-22px 0 0 -22px;border-radius:50%;background:rgba(255,255,255,.35);border:2px solid rgba(255,255,255,.9);opacity:0;pointer-events:none'); t.pant.appendChild(d); return d; };
  const dA = dedo(A), dB = dedo(B);
  const copiado = el('div', `position:absolute;left:50%;top:${IMG.enlace.y + IMG.enlace.h + 14}px;transform:translateX(-50%);background:#10B981;color:#0F1115;font:700 14px var(--font-sans);padding:8px 16px;border-radius:20px;white-space:nowrap;opacity:0`, '✓ Enlace copiado');
  aCop.appendChild(copiado);

  // ── Los tiempos ──
  const t1 = T.toca + 0.35;
  const tWA = T.pega - 0.2, tCampo = T.pega + 0.15, tPegar = T.pega + 0.45, tPegado = T.pega + 0.85;
  const tEnv = Math.max(T.envia, tPegado + 0.5), tLlega = tEnv + 0.9;
  const tTocaB = T.conversa - 0.25, tPuente = T.conversa + 0.1, tBoton = T.conversa + 0.85, tQ = T.conversa + 1.15;
  const tq1 = tQ + 0.35, tr1 = T.responde - 0.25, tq2 = T.madura - 0.2, tr2 = T.fin2 + 0.35;
  const tA2 = T.recibir - 0.35, tAviso = (T.recibir + T.aviso) / 2 + 0.3, tTocaBanner = T.aviso + 0.75;
  const tWA2 = Math.max(T.saluda - 0.35, tTocaBanner + 0.3), tEscribe = tWA2 + 0.3, tEnv2 = Math.max(T.fin3 + 0.15, tEscribe + 1.4);
  const SALUDO = '¡Hola, Ana María! Soy Carolina. ¿Le parece si hablamos hoy?';

  // La cámara: un punto de la pantalla de un teléfono (en px de la app) y el acercamiento.
  const p = (t: Tel, sx: number, sy: number): [number, number] => [t.x0 + sx * k, t.y0 + sy * k];
  const general: [number, number, number] = [MW / 2, MH / 2, Math.min(SW / MW, SH / MH) * 0.92];   // con aire para el borde difuminado
  const zEn = Math.min(SH / (PH + 30), SW / (PW + 20));
  const enA: [number, number, number] = [A.x0 + 195 * k, A.y0 + 422 * k + 4, zEn], enB: [number, number, number] = [B.x0 + 195 * k, B.y0 + 422 * k + 4, zEn];
  const cerca = H ? 2.1 : 2.25;
  const toma = (pt: [number, number], z: number): [number, number, number] => [pt[0], pt[1], z];
  const CAM: [number, number, number, number][] = [
    [0, ...general], [T.compartir - 0.1, ...general], [T.compartir + 0.6, ...enA],
    [T.toca - 0.3, ...enA], [T.toca + 0.15, ...toma(p(A, 195, IMG.enlace.y + 40), cerca)], [tWA - 0.15, ...toma(p(A, 195, IMG.enlace.y + 40), cerca)],
    [tWA + 0.4, ...toma(p(A, 195, 650), cerca * 0.85)], [tEnv + 0.35, ...toma(p(A, 195, 650), cerca * 0.85)],
    [tLlega - 0.1, ...general], [T.recibe - 0.1, ...general], [T.recibe + 0.6, ...enB],
    [tr1 + 1.6, ...enB], [tq2 + 0.3, ...toma(p(B, 195, 560), cerca * 0.7)], [tr2 + 1.0, ...toma(p(B, 195, 560), cerca * 0.7)],
    [tA2 + 0.3, ...enA], [tAviso - 0.1, ...enA], [tAviso + 0.4, ...toma(p(A, 195, 120), cerca * 0.85)], [tTocaBanner + 0.3, ...toma(p(A, 195, 120), cerca * 0.85)],
    [tWA2 + 0.3, ...toma(p(A, 195, 600), cerca * 0.75)], [tEnv2 + 0.9, ...toma(p(A, 195, 600), cerca * 0.75)], [tEnv2 + 1.9, ...general],
  ];
  const camara = (t: number) => {
    let i = 0;
    while (i < CAM.length - 1 && CAM[i + 1][0] <= t) i++;
    const a = CAM[i], b = CAM[Math.min(i + 1, CAM.length - 1)];
    const u = b[0] > a[0] ? suave((t - a[0]) / (b[0] - a[0])) : 1;
    // el acercamiento se interpola en escala logarítmica: así la velocidad se siente pareja
    const z = Math.exp(lerp(Math.log(a[3]), Math.log(b[3]), u)), cx = lerp(a[1], b[1], u), cy = lerp(a[2], b[2], u);
    mundo.style.transform = `translate(${SW / 2 - cx * z}px,${SH / 2 - cy * z}px) scale(${z})`;
  };
  const ver = (e: HTMLElement, t: number, a: number, b = 1e9, d = 0.22) => { e.style.opacity = String(Math.min(sale((t - a) / d), 1 - sale((t - b) / d))); };
  const mostrar = (e: HTMLElement, t: number, a: number, b = 1e9) => {
    const on = t >= a && t < b;
    e.style.display = on ? 'block' : 'none';
    if (on) { const u = sale((t - a) / 0.25); e.style.opacity = String(u); e.style.transform = `translateY(${(1 - u) * 10}px)`; }
  };
  const tocar = (d: HTMLElement, t: number, tt: number, sx: number, sy: number) => {
    const u = t - tt;
    if (u < -0.35 || u > 0.45) { d.style.opacity = '0'; return; }
    d.style.left = sx + 'px'; d.style.top = sy + 'px';
    d.style.opacity = String(u < 0 ? sale((u + 0.35) / 0.2) : 1 - sale(u / 0.45));
    d.style.transform = `scale(${u < 0 ? 1 : 1 - 0.25 * Math.sin(Math.min(1, u / 0.18) * Math.PI)})`;
  };
  const ta: [number, number, number][] = [[t1, 195, IMG.enlace.y + 30], [tCampo, 150, 807], [tPegar + 0.25, 60, 754], [tEnv, 357, 807], [tTocaBanner, 195, 60], [tEnv2, 357, 807]];
  const tb: [number, number, number][] = [[tTocaB, 200, 560], [tBoton, 195, IMG.boton.y + IMG.boton.h / 2]];
  const masCerca = (t: number, lst: [number, number, number][]) => lst.reduce((m, x) => Math.abs(t - x[0]) < Math.abs(t - m[0]) ? x : m);
  const campo = aWA.querySelector<HTMLElement>('.txt')!, ph = aWA.querySelector<HTMLElement>('.ph')!;

  const pintar = (t: number) => {
    camara(t);
    // Usted
    ver(aIni, t, -1, t1); ver(aCop, t, t1, tWA); ver(copiado, t, t1 + 0.1, tWA);
    ver(aWA, t, tWA, tA2); ver(aIni2, t, tA2, tWA2);
    if (t >= tWA2) aWA.style.opacity = String(sale((t - tWA2) / 0.22));
    ver(pegar, t, tPegar, tPegado, 0.15);
    let txt = '';
    if (t >= tPegado && t < tEnv) txt = LINK;
    if (t >= tEscribe && t < tEnv2) txt = SALUDO.slice(0, Math.floor((t - tEscribe) / Math.max(0.3, tEnv2 - 0.25 - tEscribe) * SALUDO.length));
    campo.textContent = txt.length > 32 ? '…' + txt.slice(-32) : txt; ph.style.display = txt ? 'none' : 'inline';
    mostrar(aLink, t, tEnv + 0.12); mostrar(aSaludo, t, tEnv2 + 0.12);
    ver(badge, t, tAviso + 0.15, tWA2);
    halo.style.opacity = String(t >= tAviso + 0.15 && t < tWA2 ? 0.35 + 0.65 * (0.5 + 0.5 * Math.cos((t - tAviso) * 5)) : 0);
    ver(banner, t, tAviso, tWA2); banner.style.transform = `translateY(${-(1 - sale((t - tAviso) / 0.35)) * 120}px)`;
    // Ana María
    ver(bWA, t, -1, tPuente); mostrar(bLink, t, tLlega);
    ver(bPuente, t, tPuente, tQ); ver(bQ, t, tQ);
    mostrar(q1, t, tq1); mostrar(q1e, t, tq1 + 0.4, tr1); mostrar(r1, t, tr1);
    mostrar(q2, t, tq2); mostrar(q2e, t, tq2 + 0.45, tr2); mostrar(r2, t, tr2);
    const a = masCerca(t, ta), b = masCerca(t, tb);
    tocar(dA, t, a[0], a[1], a[2]); tocar(dB, t, b[0], b[1], b[2]);
    A.app.textContent = t < tWA || (t >= tA2 && t < tWA2) ? 'queswa.app' : 'WhatsApp';
    B.app.textContent = t >= tPuente && t < tQ ? 'creatuactivo.com' : 'WhatsApp';
  };
  return { pintar, SW, SH };
}

/** paso: 0 con el beat apagado; 1, 2 o 3 según el tramo (Compartir · Queswa · Recibir). */
export default function SuDia({ paso }: { paso: number }) {
  const cajaRef = useRef<HTMLDivElement>(null);
  const raizRef = useRef<HTMLDivElement>(null);
  const escena = useRef<Escena | null>(null);
  const tRef = useRef(TRAMOS[0][0]);
  const [ancha, setAncha] = useState(true);

  // La escena se arma para el formato de la caja, y se escala para caber en ella.
  useEffect(() => {
    const caja = cajaRef.current, raiz = raizRef.current;
    if (!caja || !raiz) return;
    escena.current = armar(raiz, ancha);
    escena.current.pintar(tRef.current);
    const ajustar = () => {
      const w = caja.clientWidth, h = caja.clientHeight;
      if (!w || !h) return;
      const quiere = w / h > 1.25;
      if (quiere !== ancha) { setAncha(quiere); return; }
      const e = escena.current!;
      const s = Math.min(w / e.SW, h / e.SH, 1.6);
      raiz.style.width = `${e.SW}px`;
      raiz.style.height = `${e.SH}px`;
      raiz.style.transform = `translate(-50%, -50%) scale(${s})`;
    };
    ajustar();
    const ro = new ResizeObserver(ajustar);
    ro.observe(caja);
    return () => ro.disconnect();
  }, [ancha]);

  // Cada clic reproduce su tramo desde el comienzo y se queda en el último cuadro.
  useEffect(() => {
    if (!paso || !escena.current) return;
    const [a, b] = TRAMOS[paso - 1];
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { tRef.current = b; escena.current.pintar(b); return; }
    let raf = 0;
    const t0 = performance.now();
    const avanzar = (ahora: number) => {
      const t = Math.min(b, a + (ahora - t0) / 1000);
      tRef.current = t;
      escena.current?.pintar(t);
      if (t < b) raf = requestAnimationFrame(avanzar);
    };
    raf = requestAnimationFrame(avanzar);
    return () => cancelAnimationFrame(raf);
  }, [paso, ancha]);

  return (
    <div ref={cajaRef} className="pd-dia-caja" aria-hidden="true">
      <div ref={raizRef} style={{ position: 'absolute', left: '50%', top: '50%', transformOrigin: '50% 50%', textAlign: 'left' }} />
    </div>
  );
}
