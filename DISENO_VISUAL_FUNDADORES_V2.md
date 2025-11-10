# DISEÑO VISUAL COMPLETO: /fundadores-v2
## Especificaciones Técnicas y Wireframes

**Fecha:** 2025-01-13
**Proyecto:** CreaTuActivo - Landing Fundadores (Versión Círculo Dorado)
**Diseñador:** Claude Code + Luis Cabrejo
**Stack:** Next.js 14, Tailwind CSS, Framer Motion

---

# 🎨 SISTEMA DE DISEÑO BASE

## PALETA DE COLORES

### Colores Primarios (Branding CreaTuActivo):
```css
--azul-primario: #2563eb      /* Blue-600 - Confianza, tecnología */
--purpura-primario: #9333ea   /* Purple-600 - Innovación, transformación */
--dorado-acento: #f59e0b      /* Amber-500 - Valor, exclusividad */

/* Gradient principal (brand identity) */
--gradient-brand: linear-gradient(135deg, #2563eb 0%, #9333ea 50%, #f59e0b 100%);
```

### Colores Secundarios:
```css
--azul-oscuro: #1e40af        /* Blue-800 - Headers, texto importante */
--purpura-oscuro: #6b21a8     /* Purple-800 - CTAs secundarios */
--gris-texto: #374151          /* Gray-700 - Body text */
--gris-claro: #f3f4f6          /* Gray-100 - Fondos alternos */
--blanco: #ffffff
--negro: #111827               /* Gray-900 - Texto principal */
```

### Colores Funcionales:
```css
--exito: #10b981               /* Green-500 - Validaciones exitosas */
--advertencia: #f59e0b         /* Amber-500 - Urgencia, últimos cupos */
--error: #ef4444               /* Red-500 - Errores formulario */
--info: #3b82f6                /* Blue-500 - Información contextual */
```

### Overlays y Sombras:
```css
--overlay-oscuro: rgba(17, 24, 39, 0.75)    /* Sobre imágenes hero */
--overlay-gradient: linear-gradient(180deg, rgba(17,24,39,0.4) 0%, rgba(17,24,39,0.8) 100%);
--sombra-sutil: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
--sombra-media: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
--sombra-elevada: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
```

---

## TIPOGRAFÍA

### Fuentes:
```css
/* Headers - Serif para elegancia y autoridad */
--font-headings: 'Playfair Display', 'Georgia', serif;

/* Body - Sans-serif para legibilidad */
--font-body: 'Inter', 'system-ui', -apple-system, sans-serif;

/* Monospace - Datos técnicos, código */
--font-mono: 'JetBrains Mono', 'Courier New', monospace;
```

### Escala Tipográfica (Desktop):
```css
--text-hero: 64px / 72px (line-height) / -0.02em (letter-spacing)
--text-h1: 48px / 56px / -0.01em
--text-h2: 40px / 48px / -0.01em
--text-h3: 32px / 40px / 0
--text-h4: 24px / 32px / 0
--text-body-lg: 20px / 32px / 0
--text-body: 18px / 28px / 0
--text-body-sm: 16px / 24px / 0
--text-caption: 14px / 20px / 0.01em
--text-small: 12px / 16px / 0.01em
```

### Escala Tipográfica (Mobile):
```css
--text-hero-mobile: 40px / 48px / -0.01em
--text-h1-mobile: 36px / 44px / -0.01em
--text-h2-mobile: 32px / 40px / 0
--text-h3-mobile: 28px / 36px / 0
--text-h4-mobile: 22px / 30px / 0
/* Body text mantiene tamaños desktop para legibilidad */
```

### Pesos:
```css
--font-light: 300
--font-regular: 400
--font-medium: 500
--font-semibold: 600
--font-bold: 700
--font-black: 900
```

---

## ESPACIADO Y GRID

### Sistema de Espaciado (8px base):
```css
--space-1: 8px
--space-2: 16px
--space-3: 24px
--space-4: 32px
--space-5: 40px
--space-6: 48px
--space-8: 64px
--space-10: 80px
--space-12: 96px
--space-16: 128px
--space-20: 160px
--space-24: 192px
```

### Contenedores:
```css
--container-xs: 640px   /* Formularios, texto denso */
--container-sm: 768px   /* Texto largo, blog posts */
--container-md: 1024px  /* Contenido general */
--container-lg: 1280px  /* Secciones anchas */
--container-xl: 1536px  /* Full width hero */
```

### Grid:
```css
/* Desktop: 12 columnas */
grid-template-columns: repeat(12, 1fr);
gap: 32px;

/* Tablet: 8 columnas */
grid-template-columns: repeat(8, 1fr);
gap: 24px;

/* Mobile: 4 columnas */
grid-template-columns: repeat(4, 1fr);
gap: 16px;
```

---

## BOTONES Y CTAs

### Botón Primario:
```css
.btn-primary {
  background: linear-gradient(135deg, #2563eb 0%, #9333ea 100%);
  color: #ffffff;
  padding: 16px 32px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 18px;
  box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.3);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.4);
}

.btn-primary:active {
  transform: translateY(0);
}
```

### Botón Secundario:
```css
.btn-secondary {
  background: transparent;
  color: #2563eb;
  border: 2px solid #2563eb;
  padding: 14px 30px; /* -2px para compensar border */
  border-radius: 8px;
  font-weight: 600;
  font-size: 18px;
  transition: all 0.3s ease;
}

.btn-secondary:hover {
  background: #2563eb;
  color: #ffffff;
}
```

### Botón Urgencia (últimos cupos):
```css
.btn-urgencia {
  background: linear-gradient(135deg, #f59e0b 0%, #ef4444 100%);
  color: #ffffff;
  padding: 16px 32px;
  border-radius: 8px;
  font-weight: 700;
  font-size: 18px;
  box-shadow: 0 4px 6px -1px rgba(245, 158, 11, 0.4);
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.9; }
}
```

### Link de Texto:
```css
.link-text {
  color: #2563eb;
  text-decoration: underline;
  text-decoration-color: rgba(37, 99, 235, 0.3);
  text-underline-offset: 4px;
  transition: all 0.2s ease;
}

.link-text:hover {
  text-decoration-color: #2563eb;
}
```

---

## ANIMACIONES

### Transiciones Base:
```css
--transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
--transition-base: 300ms cubic-bezier(0.4, 0, 0.2, 1);
--transition-slow: 500ms cubic-bezier(0.4, 0, 0.2, 1);
```

### Fade In (elementos al scroll):
```css
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(24px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}
```

### Slide In (lateral):
```css
@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-40px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.animate-slide-in-left {
  animation: slideInLeft 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}
```

### Contador Animado:
```css
@keyframes countUp {
  from { opacity: 0.5; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

.contador-update {
  animation: countUp 0.3s ease-out;
}
```

---

# 📱 WIREFRAMES SECCIÓN POR SECCIÓN

---

## SECCIÓN 1: HERO (Above the Fold)

### Desktop (1920x1080):

```
┌─────────────────────────────────────────────────────────────────────────┐
│ [NAVIGATION BAR - Sticky]                                    [Menu ☰]   │
│ CreaTuActivo Logo                    Inicio | Sistema | Soluciones      │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  [IMAGEN BACKGROUND: Familia feliz (padre con 2 hijos) - Blur sutil]   │
│  [OVERLAY GRADIENT: Negro transparente arriba → Negro 80% abajo]       │
│                                                                         │
│                         ┌───────────────────────────┐                   │
│                         │                           │                   │
│                         │  ¿Cuánto vale tu tiempo   │  ← 64px, bold     │
│                         │    con tus hijos?         │     Blanco        │
│                         │                           │     Playfair      │
│                         └───────────────────────────┘                   │
│                                                                         │
│              ┌─────────────────────────────────────────┐                │
│              │ La vida es demasiado corta para         │  ← 24px        │
│              │ intercambiarla por dinero.              │    Regular     │
│              │                                         │    Blanco 90%  │
│              │ Tu tiempo con tus hijos no tiene precio │                │
│              │ y no debería sacrificarse por un        │                │
│              │ cheque quincenal.                       │                │
│              │                                         │                │
│              │ Fuiste diseñado para crear legado.      │                │
│              │ No para ser engranaje en una máquina    │                │
│              │ corporativa.                            │                │
│              └─────────────────────────────────────────┘                │
│                                                                         │
│                    ┌─────────────────────────────┐                      │
│                    │  🚀 Quiero construir legado │  ← Botón Primario   │
│                    └─────────────────────────────┘     Gradient         │
│                                                         Azul→Púrpura    │
│                                                                         │
│                    Ver cómo funciona (video 1 min)  ← Link texto       │
│                                                         Blanco 80%      │
│                                                                         │
│                            ↓ Scroll suave                               │
│                         (ícono animado)                                 │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
Height: 100vh (viewport completo)
```

### Mobile (375x812):

```
┌───────────────────────────┐
│ [NAV - Sticky]      [☰]  │
│ CreaTuActivo              │
├───────────────────────────┤
│                           │
│ [IMAGEN BACKGROUND]       │
│ [OVERLAY GRADIENT]        │
│                           │
│  ¿Cuánto vale tu          │  ← 40px
│  tiempo con tus           │    Bold
│  hijos?                   │    Blanco
│                           │
│                           │
│  La vida es demasiado     │  ← 18px
│  corta para               │    Regular
│  intercambiarla por       │
│  dinero.                  │
│                           │
│  Tu tiempo con tus        │
│  hijos no tiene           │
│  precio...                │
│                           │
│  [Leer más ▼]             │  ← Expandible
│                           │
│ ┌───────────────────────┐ │
│ │ 🚀 Construir legado   │ │ ← Full width
│ └───────────────────────┘ │
│                           │
│ Ver video (1 min)         │ ← Link
│                           │
│        ↓                  │
│                           │
└───────────────────────────┘
Height: 100vh
```

### Especificaciones Técnicas:

**Background Image:**
- Resolución: 2560x1440 (optimizada)
- Formato: WebP con fallback JPG
- Compresión: 85% quality
- Lazy loading: No (above the fold)
- Alt text: "Padre sonriendo con sus dos hijos en un parque"

**Overlay:**
```css
.hero-overlay {
  background: linear-gradient(
    180deg,
    rgba(17, 24, 39, 0.4) 0%,
    rgba(17, 24, 39, 0.85) 100%
  );
}
```

**Animación de entrada:**
```javascript
// Framer Motion
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8, ease: "easeOut" }}
>
  {/* Headline */}
</motion.div>
```

**CTA Button:**
```css
.hero-cta {
  background: linear-gradient(135deg, #2563eb 0%, #9333ea 100%);
  padding: 18px 40px;
  font-size: 20px;
  font-weight: 600;
  border-radius: 12px;
  box-shadow: 0 8px 16px -4px rgba(37, 99, 235, 0.4);
}

/* Efecto hover */
.hero-cta:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 24px -4px rgba(37, 99, 235, 0.5);
}
```

**Scroll Indicator:**
```css
@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(8px); }
}

.scroll-indicator {
  animation: bounce 2s infinite;
}
```

---

## SECCIÓN 2: HISTORIA PERSONAL

### Desktop Layout:

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          [Padding: 96px top/bottom]                     │
│                          [Container: 1280px max-width]                  │
│                          [Background: Blanco]                           │
│                                                                         │
│  POR QUÉ EXISTE CREATUACTIVO  ←─────────────────── Eyebrow 14px        │
│                                                     Uppercase           │
│                                                     Morado              │
│                                                                         │
│  ┌─────────────────────────┐  ┌──────────────────────────────────────┐ │
│  │                         │  │                                      │ │
│  │                         │  │  Una promesa que tardó 14 años       │ │
│  │                         │  │  ────────────────────────────────    │ │
│  │                         │  │  ↑ H2 40px Bold                      │ │
│  │   [FOTO]                │  │                                      │ │
│  │   Luis + Esposa         │  │  Hace años, cuando era novio, llevé  │ │
│  │                         │  │  a mi esposa a Buena Vista aquí en   │ │
│  │   Profesional           │  │  Vicencio.                           │ │
│  │   pero genuina          │  │                                      │ │
│  │                         │  │  Le prometí 3 cosas:                 │ │
│  │   800x1000px            │  │  • Una casa de campo                 │ │
│  │   Aspect ratio 4:5      │  │  • Que fuera de compras cuando       │ │
│  │                         │  │    quisiera                          │ │
│  │   Border radius 16px    │  │  • 3 hijos                           │ │
│  │   Box shadow sutil      │  │                                      │ │
│  │                         │  │  14 años después... solo le había    │ │
│  │                         │  │  cumplido con los hijos.             │ │
│  │                         │  │                                      │ │
│  │                         │  │  Porque seguía intercambiando tiempo │ │
│  │                         │  │  por dinero.                         │ │
│  │                         │  │  Porque seguía siendo empleado, no   │ │
│  │                         │  │  dueño.                              │ │
│  │                         │  │                                      │ │
│  └─────────────────────────┘  │  [... resto del copy ...]            │ │
│                                │                                      │ │
│  40% width                     │  ┌──────────────────────┐            │ │
│                                │  │  Luis Cabrejo        │  ← Firma   │ │
│                                │  │  Fundador            │    Script  │ │
│                                │  └──────────────────────┘    Casual  │ │
│                                │                                      │ │
│                                └──────────────────────────────────────┘ │
│                                60% width                                │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Mobile Layout:

```
┌───────────────────────────┐
│ [Padding: 48px top/bottom]│
│                           │
│ POR QUÉ EXISTE            │ ← Eyebrow
│ CREATUACTIVO              │
│                           │
│ Una promesa que           │ ← H2
│ tardó 14 años             │   32px
│                           │
│ ┌───────────────────────┐ │
│ │                       │ │
│ │   [FOTO]              │ │
│ │   Luis + Esposa       │ │
│ │                       │ │
│ │   Full width          │ │
│ │   Aspect 4:5          │ │
│ │   Margin bottom 32px  │ │
│ │                       │ │
│ └───────────────────────┘ │
│                           │
│ Hace años, cuando era     │ ← Body
│ novio, llevé a mi esposa  │   18px
│ a Buena Vista...          │   Line
│                           │   height
│ Le prometí 3 cosas:       │   1.8
│ • Una casa de campo       │
│ • Que fuera de compras    │
│ • 3 hijos                 │
│                           │
│ 14 años después... solo   │
│ le había cumplido con     │
│ los hijos.                │
│                           │
│ [... resto del copy ...]  │
│                           │
│ ┌───────────────────────┐ │
│ │  Luis Cabrejo         │ │ ← Firma
│ │  Fundador             │ │
│ └───────────────────────┘ │
│                           │
└───────────────────────────┘
```

### Especificaciones Técnicas:

**Foto Luis + Esposa:**
- Formato: WebP + JPG fallback
- Resolución: 800x1000 (desktop), 600x750 (mobile)
- Estilo: Profesional pero genuino (no corporativo rígido)
- Iluminación: Natural, cálida
- Fondo: Desenfocado (bokeh)
- Expresión: Sonrisa genuina, contacto visual directo

**Lista con bullets personalizados:**
```css
ul.promesas {
  list-style: none;
  padding-left: 0;
}

ul.promesas li {
  position: relative;
  padding-left: 32px;
  margin-bottom: 12px;
}

ul.promesas li::before {
  content: "✓";
  position: absolute;
  left: 0;
  color: #10b981; /* Verde éxito */
  font-weight: 700;
  font-size: 20px;
}
```

**Firma digital:**
- Font: 'Dancing Script' o 'Pacifico' (Google Fonts)
- Color: #6b21a8 (púrpura oscuro)
- Size: 24px
- Opción alternativa: Escanear firma real como imagen PNG

**Animación al scroll:**
```javascript
// Intersection Observer
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate-fade-in-up');
    }
  });
}, { threshold: 0.2 });
```

---

## SECCIÓN 3: VIDEO + CREENCIA CENTRAL

### Desktop Layout:

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    [Background: Gradient azul → púrpura]                │
│                    [Padding: 120px top/bottom]                          │
│                                                                         │
│                        Nuestra Creencia Central                         │
│                        ───────────────────────────                      │
│                            ↑ H2 42px Bold Blanco                        │
│                                                                         │
│                  ┌─────────────────────────────────┐                    │
│                  │ Creemos que la verdadera        │                    │
│                  │ independencia financiera y      │  ← 22px            │
│                  │ personal NO se encuentra        │    Line height 2.0 │
│                  │ intercambiando tiempo por       │    Blanco 95%      │
│                  │ dinero.                         │    Max-width 800px │
│                  │                                 │    Centrado        │
│                  │ Se encuentra convirtiéndote en  │                    │
│                  │ el ARQUITECTO de un activo      │                    │
│                  │ patrimonial.                    │                    │
│                  │                                 │                    │
│                  │ Creemos en construir un legado  │                    │
│                  │ HEREDABLE.                      │                    │
│                  │                                 │                    │
│                  │ Creemos en empoderar a las      │                    │
│                  │ personas para que pasen de ser  │                    │
│                  │ "trabajadores" a ser "dueños    │                    │
│                  │ de un sistema".                 │                    │
│                  │                                 │                    │
│                  │ Porque el tiempo que no         │                    │
│                  │ recuperas con tus hijos vale    │                    │
│                  │ más que cualquier cheque.       │                    │
│                  │                                 │                    │
│                  │ Y porque todos fuimos diseñados │                    │
│                  │ para crear, no para ser         │                    │
│                  │ engranajes.                     │                    │
│                  └─────────────────────────────────┘                    │
│                                                                         │
│                  ────────────────────────────────────  ← Separator      │
│                                                         Blanco 30%      │
│                                                                         │
│                  Si crees lo mismo... sigue leyendo.  ← 18px Italic    │
│                                                                         │
│                                                                         │
│                  ┌───────────────────────────────────┐                  │
│                  │                                   │                  │
│                  │         [VIDEO PLAYER]            │                  │
│                  │                                   │                  │
│                  │      ▶ Play Button                │  ← 1280x720     │
│                  │                                   │    16:9 ratio   │
│                  │   [Thumbnail: Frame del video]    │    Max-width    │
│                  │                                   │    960px        │
│                  │   Duración: 1:03                  │                  │
│                  │                                   │                  │
│                  │   Controles: Play, volumen,       │                  │
│                  │   fullscreen, calidad             │                  │
│                  │                                   │                  │
│                  └───────────────────────────────────┘                  │
│                                                                         │
│                  Así funciona CreaTuActivo  ← Caption 16px             │
│                  en menos de 2 minutos        Blanco 80%               │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Mobile Layout:

```
┌───────────────────────────┐
│ [Background: Gradient]    │
│ [Padding: 64px top/bottom]│
│                           │
│ Nuestra Creencia          │ ← H2 32px
│ Central                   │   Blanco
│ ──────────────            │
│                           │
│ Creemos que la            │ ← 18px
│ verdadera                 │   Line 1.8
│ independencia             │   Blanco 95%
│ financiera y personal     │
│ NO se encuentra           │
│ intercambiando tiempo     │
│ por dinero.               │
│                           │
│ Se encuentra              │
│ convirtiéndote en el      │
│ ARQUITECTO de un          │
│ activo patrimonial.       │
│                           │
│ [... resto del texto ...] │
│                           │
│ ──────────────            │ ← Separator
│                           │
│ Si crees lo mismo...      │ ← Italic
│ sigue leyendo.            │
│                           │
│ ┌───────────────────────┐ │
│ │                       │ │
│ │   [VIDEO PLAYER]      │ │
│ │                       │ │
│ │   ▶ Play              │ │ ← Full width
│ │                       │ │   16:9 ratio
│ │   [Thumbnail]         │ │
│ │                       │ │
│ │   1:03                │ │
│ │                       │ │
│ └───────────────────────┘ │
│                           │
│ Así funciona              │ ← Caption
│ CreaTuActivo en menos     │
│ de 2 minutos              │
│                           │
└───────────────────────────┘
```

### Especificaciones Técnicas del Video:

**Player:**
```html
<!-- Opción 1: HTML5 Video nativo -->
<video
  controls
  preload="metadata"
  poster="/videos/fundadores-thumbnail.webp"
  className="w-full max-w-[960px] rounded-xl shadow-2xl"
>
  <source src={process.env.NEXT_PUBLIC_VIDEO_FUNDADORES_1080P} type="video/mp4" />
  Tu navegador no soporta video HTML5.
</video>

<!-- Opción 2: React Player (más features) -->
<ReactPlayer
  url={process.env.NEXT_PUBLIC_VIDEO_FUNDADORES_1080P}
  controls={true}
  light={true} // Lazy load, muestra thumbnail primero
  playing={false}
  width="100%"
  height="auto"
  config={{
    file: {
      attributes: {
        poster: '/videos/fundadores-thumbnail.webp'
      }
    }
  }}
/>
```

**Optimización:**
```javascript
// Lazy loading
const [isVideoVisible, setIsVideoVisible] = useState(false);

useEffect(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        setIsVideoVisible(true);
      }
    },
    { threshold: 0.1 }
  );

  observer.observe(videoContainerRef.current);
}, []);

// Solo renderiza <video> cuando esté visible
{isVideoVisible && <video ... />}
```

**Thumbnail (poster):**
- Frame del video en segundo 3-5 (momento visual fuerte)
- Resolución: 1920x1080
- Formato: WebP (compresión superior)
- Play button overlay personalizado (SVG)

**Tracking:**
```javascript
// Google Analytics 4
const handleVideoPlay = () => {
  gtag('event', 'video_start', {
    video_title: 'Fundadores CreaTuActivo',
    video_duration: 63,
    page_location: '/fundadores-v2'
  });
};

const handleVideoProgress = (progress) => {
  if (progress >= 0.25 && !tracked25) {
    gtag('event', 'video_progress', { percent: 25 });
    setTracked25(true);
  }
  // 50%, 75%, 100%...
};
```

**Gradient Background:**
```css
.seccion-video {
  background: linear-gradient(
    135deg,
    #1e40af 0%,    /* Azul oscuro */
    #2563eb 25%,   /* Azul primario */
    #7c3aed 50%,   /* Violeta */
    #9333ea 75%,   /* Púrpura primario */
    #6b21a8 100%   /* Púrpura oscuro */
  );
  position: relative;
}

/* Textura sutil opcional */
.seccion-video::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url('/textures/noise.png');
  opacity: 0.05;
  mix-blend-mode: overlay;
}
```

---

## SECCIÓN 4: FRAMEWORK IAA (Cómo lo Hacemos)

### Desktop Layout - Comparativa ANTES/AHORA:

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    [Background: Blanco]                                 │
│                    [Padding: 96px top/bottom]                           │
│                    [Container: 1280px]                                  │
│                                                                         │
│  EL REDISEÑO  ←──────────────────────────────── Eyebrow 14px Morado    │
│                                                                         │
│                De la Edad de Piedra a 2025                              │
│                ──────────────────────────────                           │
│                    ↑ H2 40px Bold Centrado                              │
│                                                                         │
│         Durante 12 años construimos con herramientas manuales.          │
│         Funcionó. Pero era lento, complejo, y dependía 100% de ti.      │
│                                                                         │
│         Entonces rediseñamos CÓMO se construye.                         │
│                                                                         │
│         No el producto. El PROCESO.                                     │
│         ─────────────────────────────                                   │
│                ↑ Subheadline 20px Centrado Max-width 700px              │
│                                                                         │
│  ┌────────────────────┐  ┌────────────────────┐  ┌────────────────────┐│
│  │ 🧱 ANTES            │  │ ⚡ AHORA            │  │ 📊 IMPACTO REAL    ││
│  │ (Edad de Piedra)   │  │ (Framework IAA)    │  │                    ││
│  │ ──────────────────  │  │ ──────────────────  │  │ ──────────────────  ││
│  │                    │  │                    │  │                    ││
│  │ • Llamadas         │  │ • NEXUS IA educa   │  │ Antes:             ││
│  │   manuales         │  │   automáticamente  │  │ • 10 prospectos/   ││
│  │                    │  │                    │  │   semana (manual)  ││
│  │ • Seguimientos     │  │ • Califica         │  │ • 20 horas         ││
│  │   en Excel         │  │   prospectos en    │  │   invertidas       ││
│  │                    │  │   tiempo real      │  │ • 2-3 conversiones ││
│  │ • Presentaciones   │  │   (interés 0-10)   │  │                    ││
│  │   cara a cara      │  │                    │  │ Ahora:             ││
│  │                    │  │ • NodeX Dashboard  │  │ • 100+ prospectos/ ││
│  │ • Tú educas cada   │  │   centraliza todo  │  │   semana           ││
│  │   prospecto        │  │   tu ecosistema    │  │   (automatizados)  ││
│  │                    │  │                    │  │ • 5 horas          ││
│  │ • Tú calificas     │  │ • Sistema trabaja  │  │   invertidas (solo ││
│  │   manualmente      │  │   mientras         │  │   calls            ││
│  │                    │  │   duermes          │  │   estratégicas)    ││
│  │ • Tú haces         │  │                    │  │ • 15-20            ││
│  │   seguimiento 24/7 │  │ • Tú intervienes   │  │   conversiones     ││
│  │                    │  │   SOLO cuando      │  │                    ││
│  │                    │  │   prospecto está   │  │ = 26 horas         ││
│  │ RESULTADO:         │  │   listo            │  │   recuperadas/     ││
│  │ Agotamiento.       │  │                    │  │   semana           ││
│  │ Límite de escala.  │  │ RESULTADO:         │  │                    ││
│  │                    │  │ 80% automatizado.  │  │ = Tiempo con tu    ││
│  │                    │  │ Escalabilidad      │  │   familia          ││
│  │                    │  │ exponencial.       │  │                    ││
│  └────────────────────┘  └────────────────────┘  └────────────────────┘│
│       33% width              33% width               33% width          │
│                                                                         │
│  [Grid 3 columnas, gap 32px, responsive]                               │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Tarjetas Framework IAA (3 Fases):

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│                   Framework IAA: 3 Fases Automatizadas                  │
│                   ──────────────────────────────────────                │
│                           ↑ H3 32px Bold                                │
│                                                                         │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │ 🎯 FASE 1: INICIAR                                                 │ │
│  ├────────────────────────────────────────────────────────────────────┤ │
│  │                                                                    │ │
│  │ El prospecto llega a CreaTuActivo vía tu enlace personalizado.    │ │
│  │                                                                    │ │
│  │ Sistema automáticamente:                                           │ │
│  │ ✓ Identifica visitante (fingerprint)                              │ │
│  │ ✓ Rastrea comportamiento                                          │ │
│  │ ✓ Asigna a tu red                                                 │ │
│  │                                                                    │ │
│  │ ┌────────────────────────────────────────┐                        │ │
│  │ │ TÚ haces: NADA (100% automático)       │  ← Callout destacado   │ │
│  │ └────────────────────────────────────────┘    Fondo azul claro    │ │
│  │                                                  Border azul       │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │ 🤝 FASE 2: ACOGER                                                  │ │
│  ├────────────────────────────────────────────────────────────────────┤ │
│  │                                                                    │ │
│  │ NEXUS IA (chatbot inteligente) conversa con el prospecto.         │ │
│  │                                                                    │ │
│  │ Sistema automáticamente:                                           │ │
│  │ ✓ Educa sobre modelo de negocio                                   │ │
│  │ ✓ Responde objeciones                                             │ │
│  │ ✓ Califica nivel de interés (0-10)                                │ │
│  │ ✓ Captura datos (nombre, email, teléfono)                         │ │
│  │ ✓ Detecta arquetipo (emprendedor, profesional, etc.)              │ │
│  │                                                                    │ │
│  │ ┌────────────────────────────────────────┐                        │ │
│  │ │ TÚ haces: NADA (NEXUS trabaja 24/7)    │  ← Callout            │ │
│  │ └────────────────────────────────────────┘                        │ │
│  │                                                                    │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │ 🚀 FASE 3: ACTIVAR                                                 │ │
│  ├────────────────────────────────────────────────────────────────────┤ │
│  │                                                                    │ │
│  │ Cuando prospecto está LISTO (interés 8-10/10), sistema te avisa.  │ │
│  │                                                                    │ │
│  │ Sistema automáticamente:                                           │ │
│  │ ✓ Notifica vía WhatsApp/Dashboard                                 │ │
│  │ ✓ Entrega perfil completo del prospecto                           │ │
│  │ ✓ Sugiere mejor enfoque de cierre                                 │ │
│  │                                                                    │ │
│  │ ┌────────────────────────────────────────┐                        │ │
│  │ │ TÚ haces: Call estratégica (20 min)    │  ← Callout destacado   │ │
│  │ │ Para cerrar Constructor/Fundador.      │    Fondo verde claro   │ │
│  │ └────────────────────────────────────────┘    Border verde        │ │
│  │                                                                    │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ 💡 Resultado:                                                     │  │
│  │                                                                   │  │
│  │ Pasas de "perseguir 100 prospectos fríos" a "cerrar 15           │  │
│  │ prospectos calientes".                                            │  │
│  │                                                                   │  │
│  │ De 40 horas/semana a 5 horas/semana.                              │  │
│  │                                                                   │  │
│  │ 26 horas recuperadas = Tiempo con tu familia.                     │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│  ↑ Callout especial - Fondo morado claro, border morado, ícono 💡     │
│                                                                         │
│                    ┌───────────────────────────┐                        │
│                    │ Quiero el sistema completo│  ← CTA Botón           │
│                    └───────────────────────────┘                        │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Mobile Layout - Framework IAA:

```
┌───────────────────────────┐
│ EL REDISEÑO               │ ← Eyebrow
│                           │
│ De la Edad de Piedra      │ ← H2 32px
│ a 2025                    │
│                           │
│ Durante 12 años           │ ← Subheadline
│ construimos con           │   18px
│ herramientas manuales...  │
│                           │
│ ┌───────────────────────┐ │
│ │ 🧱 ANTES               │ │
│ │ (Edad de Piedra)      │ │
│ │ ────────────────────  │ │
│ │                       │ │
│ │ • Llamadas manuales   │ │
│ │ • Seguimientos Excel  │ │
│ │ • Presentaciones cara │ │
│ │   a cara              │ │
│ │ • Tú educas cada      │ │
│ │   prospecto           │ │
│ │                       │ │
│ │ RESULTADO:            │ │
│ │ Agotamiento. Límite   │ │
│ │ de escala.            │ │
│ └───────────────────────┘ │
│                           │
│ ┌───────────────────────┐ │
│ │ ⚡ AHORA               │ │
│ │ (Framework IAA)       │ │
│ │ ────────────────────  │ │
│ │                       │ │
│ │ • NEXUS IA educa      │ │
│ │   automáticamente     │ │
│ │ • Califica prospectos │ │
│ │   en tiempo real      │ │
│ │ • NodeX Dashboard     │ │
│ │   centraliza todo     │ │
│ │                       │ │
│ │ RESULTADO:            │ │
│ │ 80% automatizado.     │ │
│ │ Escalabilidad         │ │
│ │ exponencial.          │ │
│ └───────────────────────┘ │
│                           │
│ ┌───────────────────────┐ │
│ │ 📊 IMPACTO REAL       │ │
│ │ ────────────────────  │ │
│ │                       │ │
│ │ Antes:                │ │
│ │ • 10 prospectos/sem   │ │
│ │ • 20 horas            │ │
│ │ • 2-3 conversiones    │ │
│ │                       │ │
│ │ Ahora:                │ │
│ │ • 100+ prospectos/sem │ │
│ │ • 5 horas             │ │
│ │ • 15-20 conversiones  │ │
│ │                       │ │
│ │ = 26 horas recuperadas│ │
│ │ = Tiempo con familia  │ │
│ └───────────────────────┘ │
│                           │
│ [Stack vertical]          │
│                           │
│ Framework IAA:            │ ← H3 28px
│ 3 Fases Automatizadas     │
│                           │
│ ┌───────────────────────┐ │
│ │ 🎯 FASE 1: INICIAR    │ │
│ │                       │ │
│ │ [... copy ...]        │ │
│ │                       │ │
│ │ TÚ haces: NADA        │ │
│ └───────────────────────┘ │
│                           │
│ ┌───────────────────────┐ │
│ │ 🤝 FASE 2: ACOGER     │ │
│ │                       │ │
│ │ [... copy ...]        │ │
│ │                       │ │
│ │ TÚ haces: NADA        │ │
│ └───────────────────────┘ │
│                           │
│ ┌───────────────────────┐ │
│ │ 🚀 FASE 3: ACTIVAR    │ │
│ │                       │ │
│ │ [... copy ...]        │ │
│ │                       │ │
│ │ TÚ haces: Call 20 min │ │
│ └───────────────────────┘ │
│                           │
│ ┌───────────────────────┐ │
│ │ 💡 Resultado:         │ │
│ │                       │ │
│ │ De 40 horas/semana    │ │
│ │ a 5 horas/semana.     │ │
│ │                       │ │
│ │ 26 horas recuperadas  │ │
│ │ = Tiempo con familia  │ │
│ └───────────────────────┘ │
│                           │
│ ┌───────────────────────┐ │
│ │ Quiero el sistema →   │ │ ← CTA
│ └───────────────────────┘ │
│                           │
└───────────────────────────┘
```

### Especificaciones Técnicas - Tarjetas:

```css
.tarjeta-iaa {
  background: #ffffff;
  border: 2px solid #e5e7eb; /* Gray-200 */
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.tarjeta-iaa:hover {
  border-color: #9333ea; /* Púrpura */
  box-shadow: 0 10px 15px -3px rgba(147, 51, 234, 0.1);
  transform: translateY(-4px);
}

/* Callout "TÚ haces" */
.callout-accion {
  background: #eff6ff; /* Blue-50 */
  border-left: 4px solid #2563eb; /* Blue-600 */
  padding: 16px 20px;
  border-radius: 8px;
  font-weight: 600;
  margin-top: 24px;
}

/* Callout resultado final */
.callout-resultado {
  background: #faf5ff; /* Purple-50 */
  border: 2px solid #9333ea; /* Purple-600 */
  border-radius: 12px;
  padding: 24px;
  margin-top: 48px;
}

.callout-resultado::before {
  content: "💡";
  font-size: 28px;
  display: block;
  margin-bottom: 12px;
}
```

**Íconos de fases:**
- Usar emojis (mejor soporte cross-platform) o SVG custom
- Tamaño: 48px en desktop, 40px en mobile
- Posición: Alineado a la izquierda del título de fase

**Animación de tarjetas al scroll:**
```javascript
// Stagger animation (aparecen una por una)
<motion.div
  initial={{ opacity: 0, y: 40 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, amount: 0.3 }}
  transition={{ duration: 0.5, delay: index * 0.2 }}
>
  {/* Tarjeta */}
</motion.div>
```

---

## SECCIÓN 5: QUÉ CONSTRUYES (Tabla Comparativa)

**(Continuando...)**

Luis, he creado **LA MITAD del documento de diseño visual** (secciones 1-4 de 8).

**¿Quieres que continúe con el resto ahora o prefieres revisar estas primeras 4 secciones primero?**

Las secciones que faltan son:
5. Qué Construyes (Tabla Fundador vs Constructor vs Público)
6. Cupos y Timeline (Contador dinámico)
7. Formulario (Multi-pasos)
8. Footer

**Dime:**
- **A)** Continúa con las 4 secciones restantes ahora
- **B)** Pausa, revisemos lo que ya tienes y ajustamos si es necesario

¿A o B?
