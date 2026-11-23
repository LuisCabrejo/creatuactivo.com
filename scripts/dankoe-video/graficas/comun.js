// Piezas comunes de las escenas del reto (día 77 en adelante): el mismo vocabulario de
// dia74-delegar.html y del deck. Cada escena define T0 (inicio del inserto, en segundos
// del cuerpo), FIN y window.pintar(tl) con tl desde T0.
const NS = 'http://www.w3.org/2000/svg';
const cl = u => Math.max(0, Math.min(1, u)), sale = u => 1 - Math.pow(1 - cl(u), 3);
const suave = u => { u = cl(u); return u < .5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2; };
const lerp = (a, b, u) => a + (b - a) * u;
const $ = id => document.getElementById(id);
const el = (tag, at, par) => { const e = document.createElementNS(NS, tag); for (const k in at) e.setAttribute(k, at[k]); par && par.appendChild(e); return e; };
const txt = (s, at, par) => { const e = el('text', at, par); e.textContent = s; return e; };
const ORO = '#C5A059', TIT = '#94A3B8', CIAN = '#22D3EE', TENUE = '#475569';

// Íconos de trazo (viewBox 24), como los de ELEMENTOS en la Presentación.
const ICONOS = {
  local: '<path d="M3 9l2-5h14l2 5"/><path d="M3 9c0 1.7 1.3 3 3 3s3-1.3 3-3c0 1.7 1.3 3 3 3s3-1.3 3-3c0 1.7 1.3 3 3 3s3-1.3 3-3"/><path d="M5 12v9h14v-9"/><path d="M10 21v-5h4v5"/>',
  cocina: '<path d="M4 11h16v5a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4z"/><path d="M2 11h20"/><path d="M9 8c0-1 1-1.3 1-2.3S9 4.5 9 3.5"/><path d="M14 8c0-1 1-1.3 1-2.3s-1-1.2-1-2.2"/>',
  mesas: '<path d="M3 10h18"/><path d="M6 10v10M18 10v10"/><path d="M9 15h6"/><path d="M5 6.5h14"/>',
  gente: '<circle cx="12" cy="6" r="2.6"/><path d="M7.5 15c0-2.8 2-4.6 4.5-4.6s4.5 1.8 4.5 4.6"/><circle cx="5" cy="9" r="2"/><path d="M1.5 16.5c0-2.2 1.5-3.6 3.5-3.6"/><circle cx="19" cy="9" r="2"/><path d="M22.5 16.5c0-2.2-1.5-3.6-3.5-3.6"/><path d="M4 20h16"/>',
  celular: '<rect x="6" y="2" width="12" height="20" rx="2.5"/><path d="M10.5 18.5h3"/>',
  puerta: '<rect x="6" y="3" width="12" height="18" rx="1"/><circle cx="15" cy="12.5" r=".9"/><path d="M3 21h18"/>',
  reloj: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.2 2"/>',
  maletin: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8.5 7V5.2A1.7 1.7 0 0 1 10.2 3.5h3.6a1.7 1.7 0 0 1 1.7 1.7V7"/><path d="M3 12.5h18"/>',
  contactos: '<circle cx="12" cy="5" r="2.4"/><circle cx="5" cy="18" r="2.4"/><circle cx="19" cy="18" r="2.4"/><path d="M10.8 7.1 6.2 15.9M13.2 7.1l4.6 8.8M7.4 18h9.2"/>',
  cambio: '<path d="M19.5 8.5A8 8 0 0 0 5 7.5"/><path d="M20 3.5v5h-5"/><path d="M4.5 15.5A8 8 0 0 0 19 16.5"/><path d="M4 20.5v-5h5"/>',
  grande: '<path d="M3 20.5h18"/><path d="M4.5 16.5l5-5 4 3 6.5-7.5"/><path d="M15 7h5v5"/>',
};
const FIG = '<circle cx="12" cy="6.8" r="4.3"/><path d="M3.2 22c0-5.2 3.9-8.6 8.8-8.6s8.8 3.4 8.8 8.6z"/>';
const CUBO = '<polygon points="6,11 46,6 46,95 6,89" fill="#E7D6B7"/><polygon points="46,6 95,11 95,88 46,95" fill="#F7E5C6"/>';

function montarDefs(svg) {
  const defs = el('defs', {}, svg);
  defs.innerHTML = `
  <radialGradient id="fondo" cx="50%" cy="38%" r="65%"><stop offset="0" stop-color="#16191F"/><stop offset="1" stop-color="#0F1115"/></radialGradient>
  <filter id="brillo" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="10" result="b"/><feFlood flood-color="#C5A059" flood-opacity=".75"/><feComposite in2="b" operator="in"/><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  ${Object.entries(ICONOS).map(([k, v]) => `<symbol id="i-${k}" viewBox="0 0 24 24">${v}</symbol>`).join('')}
  <symbol id="fig" viewBox="0 0 24 24">${FIG}</symbol>
  <g id="cubo">${CUBO}</g>`;
  el('rect', { width: 1080, height: 1920, fill: 'url(#fondo)' }, svg);
}

/** Una tarjeta de vidrio con su ícono, centrada en (0,0); se mueve con transform. */
function tarjeta(par, ic, tam, rotulo, dy = 50) {
  const g = el('g', {}, par);
  const card = el('rect', { x: -tam / 2, y: -tam / 2, width: tam, height: tam, rx: 26, fill: '#15171C', stroke: 'rgba(255,255,255,0.1)', 'stroke-width': 2 }, g);
  const s = tam * 0.5;
  const icon = el('use', { href: '#i-' + ic, x: -s / 2, y: -s / 2, width: s, height: s, fill: 'none', stroke: TIT, 'stroke-width': 1.5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
  const rot = rotulo ? txt(rotulo, { class: 'mono', 'text-anchor': 'middle', y: tam / 2 + dy }, g) : null;
  return { g, card, icon, rot };
}
const pon = (g, x, y, s = 1, o = 1) => { g.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${s.toFixed(3)})`); g.style.opacity = cl(o).toFixed(3); };
/** Fundido de entrada y de salida de toda la escena. */
function fundido(t, T0, FIN) { $('s').style.opacity = (cl((t - T0) / 0.25) * (1 - cl((t - (FIN - 0.25)) / 0.25))).toFixed(3); }
/** Dos titulares que se relevan en el mismo sitio. */
function relevo(a, b, t, tCambio) { a.style.opacity = 1 - cl((t - tCambio) / 0.3); b.style.opacity = cl((t - tCambio - 0.15) / 0.3); }

const ESTILO = `
@font-face{font-family:RM;src:url(roboto-mono-latin-500-normal.woff2)}
html,body{margin:0;background:transparent;width:1080px;height:1920px;overflow:hidden}
svg{display:block}
.mono{font-family:RM,monospace;font-size:26px;letter-spacing:5px;text-transform:uppercase;fill:#94A3B8}
.tit{font-family:Inter,sans-serif;font-weight:700;font-size:62px;fill:#FFFFFF;letter-spacing:.5px}
.fila{font-family:Inter,sans-serif;font-weight:700;font-size:46px;fill:#FFFFFF}
.ust{font-family:Inter,sans-serif;font-weight:700;font-size:28px;letter-spacing:1.5px;fill:#FFFFFF}`;
document.head.insertAdjacentHTML('beforeend', `<style>${ESTILO}</style>`);
