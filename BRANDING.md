# BRANDING.md — Sistema de Diseño CreaTuActivo

Parámetros canónicos de marca. Consolidado de la investigación "Diseño de Branding Premium Institucional" + la implementación viva en [src/lib/branding.ts](src/lib/branding.ts) y [src/app/globals.css](src/app/globals.css). **Este es el documento de referencia; las investigaciones crudas se archivaron.**

Filosofía: **"Quiet Luxury / Lujo Clínico meets Private Equity"** — el sitio debe verse como una firma de inversión de alta gama, no como un MLM. Autoridad por restricción, claridad arquitectónica, precisión matemática. El lujo genuino susurra desde una posición de supremacía; no grita.

---

## 1. Paleta cromática (Sistema Bimetálico)

Tokens en `:root` de [globals.css](src/app/globals.css). **Nunca hex hardcoded** — usar siempre la variable CSS.

### Fondos (elevación por luminancia, no por sombras)
| Token | Hex | Uso |
|-------|-----|-----|
| `--color-bg-primary` | `#0F1115` | Carbón Profundo — canvas raíz |
| `--color-bg-elevated` | `#15171C` | Carbón Brillante — un nivel arriba |
| `--color-bg-surface` | `#1A1D23` | Obsidian — cards |

### Marca — Dorado Champán (EL PREMIO, máx 10-20% del lienzo)
| Token | Hex | Uso |
|-------|-----|-----|
| `--color-brand` | `#C5A059` | CTAs, dinero, logros, títulos clave |
| `--color-brand-hover` | `#D4AF37` | Estados hover |
| `--color-brand-muted` | `#B38B59` | Texto bronce secundario |

### Titanio (LA ESTRUCTURA)
| Token | Hex | Uso |
|-------|-----|-----|
| `--color-titanium` | `#94A3B8` | Iconos activos, navegación |
| `--color-titanium-muted` | `#878681` | Iconos inactivos, labels |
| `--color-titanium-dark` | `#475569` | Líneas sutiles, divisores |

### Texto (titanio claro cálido — evita el resplandor del #FFF puro)
| Token | Hex | Uso |
|-------|-----|-----|
| `--color-text-primary` | `#E0DFDB` | Títulos |
| `--color-text-body` | `#C8C7C2` | Cuerpo |
| `--color-text-muted` | `#878681` | Secundario |

### Semánticos (desaturados — sin neón sobre carbón)
| Token | Hex | Significado |
|-------|-----|-------------|
| `--color-success` | `#408A71` | Verde salvia |
| `--color-error` | `#9E2A3A` | Carmesí profundo |
| `--color-warning` | `#C6A76B` | Ámbar |

**Acento data exclusivo servilleta:** Cyan `#22D3EE` (labels técnicos, líneas REF).

---

## 2. Tipografía

Fuentes cargadas en [layout.tsx](src/app/layout.tsx) vía `next/font/google`: **Playfair Display, Inter, Roboto Mono**. Cualquier otra (Rajdhani, Oswald, Söhne, Financier, Montserrat) hace fallback al sistema → usar siempre los tokens.

| Token | Familia | Rol |
|-------|---------|-----|
| `var(--font-sans)` | Inter | Estructura, datos, cuerpo, H1 institucional |
| `var(--font-serif)` | Playfair Display | H1 editorial, H2 narrativos, citas de tesis |
| `var(--font-mono)` | Roboto Mono | Métricas, REF codes, datos financieros (tabular-nums) |

> Nota: la investigación recomendaba Söhne + Financier (Klim, comerciales). Se sustituyeron por Inter + Playfair (open-source) — sustitución defendible por costo de licencias.

### Jerarquía de encabezados (regla unificada — 23 May 2026)

- **H1 institucional** (títulos cortos: Home, Nosotros, Tecnología, Blog index, Paquetes, Sistema/Productos): `var(--font-sans)` Inter, `font-weight: 700`, `text-transform: uppercase`, `letter-spacing: 0.08em`, color `var(--color-brand)`.
- **H1 editorial** (artículos largos `/blog/*`): `var(--font-serif)` Playfair, `font-weight: 600`, natural case, `letter-spacing: -0.01em`. Vía `<IndustrialHeader variant="editorial" />`.
- **H2**: siempre `var(--font-serif)` Playfair natural case (títulos narrativos, citas).
- **Eyebrows**: `<p>` con `text-sm uppercase tracking-[0.15em]`. **NUNCA** `<h2>` para eyebrows.

**Componente canónico:** [src/components/IndustrialHeader.tsx](src/components/IndustrialHeader.tsx) — `variant: 'institutional' | 'editorial'`, renderiza el único `<h1>` de la página.

**Reglas de hierro:**
- ❌ NUNCA dos `<h1>` en una página (rompe SEO/a11y).
- ❌ NUNCA `fontFamily` con fuente no cargada en layout.tsx.

### Microtipografía financiera
- `font-feature-settings: 'case' 1` — alinea %/−/+/() con mayúsculas.
- `font-variant-numeric: tabular-nums` — ancho fijo en cifras (tablas/balances).
- Signo menos real U+2212 (no guion `-`). Prohibido sustituir símbolos monetarios por íconos.

---

## 3. Geometría

Border-radius tokens — escala de sutileza. **Prohibido `clip-path: polygon()` biselado** en botones (estética cyberpunk, antitética a la construcción de patrimonio).

| Token | Valor | Uso |
|-------|-------|-----|
| `--radius-micro` | 2px | Checkboxes, badges |
| `--radius-action` | 4px | Botones, inputs |
| `--radius-container` | 8px | Cards, módulos |

---

## 4. CTAs / Botones

Clases canónicas en [globals.css](src/app/globals.css). **Nunca** fondo dorado sólido + texto invertido en botón primario.

- **`.cta-primary`**: tinte dorado 7% (`rgba(197,160,89,0.07)`) + borde 1.5px `--color-brand` + texto dorado. Hover: tinte 14%.
- **`.cta-secondary`**: transparente + borde titanio + texto titanio.
- **`.cta-ghost`**: sin borde, solo texto titanio; hover → dorado.

**Sub-marcas con identidad propia** (Clinical Luxury bioEmerald `#50C878`, WhatsApp `#25D366`): patrón = fondo con tinte 7-14% del acento + borde 1.5-2px + texto del acento. Sin clip-path biselado.

---

## 5. Efectos atmosféricos

- **Spotlights hero**: Titanio `radial-gradient(ellipse, rgba(148,163,184,0.08), transparent 70%)` · Dorado `rgba(197,160,89,0.06)`.
- **Glass borders**: standard `rgba(255,255,255,0.1)` · hover `rgba(197,160,89,0.3)`.
- **Dark Mode line-less**: profundidad por luminancia (aclarar el carbón), NO por sombras negras. Hairlines `rgba(255,255,255,0.08)` solo para datos tabulares.
- **Separadores `---` en chat**: `my-6` (24px) para respiración (ver NEXUSWidget.tsx custom `hr`).

❌ NO `backdropFilter: blur()` en cards del homepage (mata GPU compositing en paint inicial).

---

## 6. Implementación de referencia

- **Sistema completo aplicado:** [src/app/infraestructura/page.tsx](src/app/infraestructura/page.tsx) (`/infraestructura`).
- **Tokens fuente:** [src/lib/branding.ts](src/lib/branding.ts) (COLORS, ICON_COLORS, emailStyles) + [src/app/globals.css](src/app/globals.css) (`:root`).
- **Tailwind:** paletas `titanium`/`carbon`/`champagne` en [tailwind.config.ts](tailwind.config.ts).

> CLAUDE.md mantiene la versión operativa resumida en la sección "Design System: Bimetallic v3.0". Este BRANDING.md es la referencia extendida de diseño.
