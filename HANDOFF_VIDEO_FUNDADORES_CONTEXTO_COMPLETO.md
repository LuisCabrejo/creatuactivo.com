# 🎬 HANDOFF COMPLETO: Video Fundadores CreaTuActivo.com

**Fecha:** 17 Noviembre 2025
**Para:** Agente Claude Code - Desarrollo de Guion y Aplicación
**Contexto:** Video hero para página [/fundadores](https://creatuactivo.com/fundadores)
**Versión Sistema:** NEXUS v12.2 Jobs-Style + Legal Compliance

---

## 📋 ÍNDICE

1. [Contexto Estratégico Actualizado](#contexto-estratégico-actualizado)
2. [Filosofía Jobs-Style (CRÍTICA)](#filosofía-jobs-style-crítica)
3. [Arquitectura Técnica de Video](#arquitectura-técnica-de-video)
4. [Guiones Propuestos (2 Opciones)](#guiones-propuestos-2-opciones)
5. [Implementación Técnica](#implementación-técnica)
6. [Branding y Diseño](#branding-y-diseño)
7. [Integración con NEXUS](#integración-con-nexus)
8. [Testing y Optimización](#testing-y-optimización)
9. [Referencias Documentales](#referencias-documentales)

---

## 🎯 CONTEXTO ESTRATÉGICO ACTUALIZADO

### **Estado Actual del Proyecto (17 Nov 2025)**

**Sistema NEXUS:**
- ✅ v12.2 en desarrollo (merge v12.1 legal + v12.0 Jobs-style)
- ✅ Anti-transiciones implementadas
- ✅ Consentimiento legal Ley 1581/2012
- ✅ Saludo Jobs-style: "Piénsalo así: Jeff Bezos no construyó su fortuna vendiendo libros. Construyó Amazon, el sistema."

**Página Fundadores:**
- URL: https://creatuactivo.com/fundadores
- Archivo: [src/app/fundadores/page.tsx](src/app/fundadores/page.tsx)
- Estado: Funcionando con formulario, timeline, contador de cupos
- **FALTA:** Video hero optimizado para conversión

**Timeline Actualizada:**
- **Lista Privada (ACTIVA):** 10 Nov - 30 Nov 2025 → 150 Fundadores
- **Pre-Lanzamiento:** 01 Dic 2025 - 01 Mar 2026 → 22,500 Constructores
- **Lanzamiento Público:** 02 Mar 2026 → Meta 4M+ usuarios (3-7 años)

**Contador de Cupos:**
- Actualmente: **150 cupos fijos** (pausado dinámico hasta tener ventas reales)
- Referencia: [CONTADOR_CUPOS_FUNDADORES.md](CONTADOR_CUPOS_FUNDADORES.md)

---

### **Propuesta de Valor ACTUALIZADA (Jobs-Style)**

**ANTES (jerga tradicional MLM):**
> "Únete a nuestro ecosistema de network marketing con tecnología avanzada"

**AHORA (Jobs-Style simplificado):**
> "Jeff Bezos no construyó su fortuna vendiendo libros. Construyó Amazon, el sistema.
> Nosotros aplicamos esa misma filosofía. Te ayudamos a construir TU sistema."

**Diferencias críticas:**
- ❌ NO usar: "ecosistema", "multinivel", "distribuidor", "reclutamiento", "NodeX", "Framework IAA"
- ✅ SÍ usar: "sistema", "la aplicación", "el método", "constructor", "apalancamiento"
- 🎯 Filosofía: **Comprensible para una abuela de 75 años** sin experiencia empresarial

**Referencia:** [knowledge_base/nexus-system-prompt-v12.2-jobs-style-legal.md](knowledge_base/nexus-system-prompt-v12.2-jobs-style-legal.md) líneas 365-396

---

### **Arquetipos de Fundadores (6 Personas)**

Cada Fundador pertenece a uno de estos perfiles:

1. **Profesional con Visión**
   - Carrera exitosa pero intercambia tiempo por dinero
   - Busca: Convertir experiencia en activo escalable
   - Ejemplo: Ingeniero, médico, abogado

2. **Emprendedor con Negocio**
   - Ya tiene negocio funcionando
   - Busca: Diversificar ingresos sin crear otro empleo
   - Ejemplo: Dueño de agencia, consultor

3. **Independiente/Freelancer**
   - Talento especializado (diseñador, dev, coach)
   - Busca: Convertir talento en activo que no requiera su tiempo
   - Ejemplo: Freelancer saturado de proyectos

4. **Líder del Hogar**
   - Gestiona familia y busca flexibilidad
   - Busca: Propósito + ingresos sin horario fijo
   - Ejemplo: Madre/padre emprendedor

5. **Líder de Comunidad**
   - Influencia en su red (iglesia, grupo deportivo, etc.)
   - Busca: Convertir influencia en legado tangible
   - Ejemplo: Pastor, entrenador, activista

6. **Joven con Ambición**
   - Estudiante o recién egresado
   - Busca: Construir activo ANTES de carrera tradicional
   - Ejemplo: Universitario visionario

**Páginas de captura específicas:**
- [src/app/soluciones/profesional-con-vision/page.tsx](src/app/soluciones/profesional-con-vision/page.tsx)
- [src/app/soluciones/emprendedor-negocio/page.tsx](src/app/soluciones/emprendedor-negocio/page.tsx)
- [src/app/soluciones/independiente-freelancer/page.tsx](src/app/soluciones/independiente-freelancer/page.tsx)
- [src/app/soluciones/lider-del-hogar/page.tsx](src/app/soluciones/lider-del-hogar/page.tsx)
- [src/app/soluciones/lider-comunidad/page.tsx](src/app/soluciones/lider-comunidad/page.tsx)
- [src/app/soluciones/joven-con-ambicion/page.tsx](src/app/soluciones/joven-con-ambicion/page.tsx)

---

## 🎨 FILOSOFÍA JOBS-STYLE (CRÍTICA)

### **Principio de la "Abuela de 75 Años"**

**Origen:** Steve Jobs / Jeff Bezos
> "Si no puedes explicárselo a tu abuela de 75 años, no es lo suficientemente simple."

**Aplicación CreaTuActivo:**

**❌ ANTES (técnico, inaccesible):**
```
"Nuestro Framework IAA (Iniciar, Acoger, Activar) integra un ecosistema
tecnológico NodeX con NEXUS AI para el modelo DEA (Distribuir, Enseñar,
Acompañar) que permite a Constructores Inteligentes escalar..."
```

**✅ AHORA (Jobs-style):**
```
"Tu sistema tiene tres partes:

1. Productos únicos (Gano Excel) - Patente mundial
2. Inteligencia artificial (NEXUS) - Trabaja por ti 24/7
3. Tu aplicación (para ver todo en tiempo real)

La tecnología hace el 80% del trabajo pesado.
Tú haces el 20% estratégico."
```

**Diferencia clave:**
- Simple primero, detalles después
- Como Waze: "Evita trancones" (NO "algoritmo de ruteo dinámico basado en ML")

---

### **Analogía Central: Bezos y Amazon**

**Texto actual en NEXUS (línea 36 de Chat.tsx):**
```
"Hola, soy NEXUS

Piénsalo así: Jeff Bezos no construyó su fortuna vendiendo libros.
Construyó Amazon, el sistema.

Nosotros aplicamos esa misma filosofía.
Te ayudamos a construir TU sistema.

¿Por dónde empezamos?"
```

**Por qué funciona:**
- ✅ Reconocimiento universal (todos conocen Amazon)
- ✅ Reframe mental: De "vender productos" a "construir sistema"
- ✅ Aspiracional sin sonar barato
- ✅ Resuelve objeción MLM (no vendes, construyes)

**Aplicación en video:**
Esta analogía debe ser el **hook central** del video. No es un ejemplo más, es EL marco conceptual.

---

### **Vocabulario Prohibido vs Permitido**

| ❌ PROHIBIDO | ✅ JOBS-STYLE | 🎯 Razón |
|-------------|---------------|----------|
| Ecosistema CreaTuActivo | CreaTuActivo.com | Jerga innecesaria |
| Framework IAA | El método | Técnico, inaccesible |
| NodeX | La aplicación | Nombre técnico sin contexto |
| Multinivel / MLM | Sistema de distribución | Estigma social |
| Distribuidor | Constructor | Más aspiracional |
| Reclutamiento | Construcción de equipo | Connotación negativa |
| Constructor Inteligente | Constructor | Redundante |
| Plataforma tecnológica | Tu aplicación | Más simple |
| Modelo DEA | El método probado | Acrónimo vacío |

**Regla general:** Si requiere explicación adicional, simplifícalo.

---

## 🎬 GUIONES PROPUESTOS (2 OPCIONES)

### **Investigación Previa Completada**

**Documento base:** [GUION_VIDEO_FUNDADORES_CONVERSION.md](GUION_VIDEO_FUNDADORES_CONVERSION.md)

**Hallazgos clave:**
- ✅ **Duración óptima:** 90-120 segundos (engagement vs atención)
- ✅ **Impacto conversión:** +86% vs landing sin video (datos 2025)
- ✅ **Estructura VSL:** Hook → Problema → Credibilidad → Solución → Urgencia → CTA
- ✅ **Drop-off crítico:** Primeros 8 segundos (20-30% abandonan)
- ✅ **Audio opcional:** 66% de videos se ven sin sonido (subtítulos críticos)

---

### **OPCIÓN A: Founder a Cámara (Recomendada)**

**Formato:** Luis o Liliana directo a cámara
**Duración:** 90-120 segundos
**Ventaja:** Máxima credibilidad + conexión emocional
**Desventaja:** Requiere producción profesional (iluminación, audio, edición)

---

#### **GUION ACTUALIZADO (Jobs-Style)**

**BLOQUE 1: HOOK BEZOS (0-10 segundos)**

```
[VISUAL: Founder directo a cámara, fondo profesional pero cálido]

FOUNDER:
"Jeff Bezos no construyó su fortuna vendiendo libros.
Construyó Amazon. El sistema.

[PAUSA 1 segundo - contacto visual]

Nosotros aplicamos esa misma filosofía."
```

**Por qué funciona:**
- ✅ Reconocimiento inmediato (todos conocen Amazon)
- ✅ Reframe mental desde segundo 1
- ✅ Intriga ("¿cómo se aplica eso aquí?")
- ✅ Diferenciación instantánea vs MLM tradicional

---

**BLOQUE 2: PROBLEMA UNIVERSAL (10-35 segundos)**

```
[VISUAL: B-roll de personas trabajando - freelancer, profesional, emprendedor]

FOUNDER:
"El problema es universal:

Para ganar más, necesitas trabajar más.
Y llega un momento donde ya no tienes más tiempo.

[VISUAL: Gráfico simple "Ingresos = Tiempo trabajado" con techo]

Llegas a un techo.

Profesionales, emprendedores, freelancers...
Todos en el mismo ciclo.

[PAUSA - volver a cámara]

Hasta que construyes un sistema."
```

**Por qué funciona:**
- ✅ Identifica 3 arquetipos clave (auto-segmentación)
- ✅ "Techo" es visualización poderosa del dolor
- ✅ Universal (no requiere experiencia MLM)
- ✅ Setup para solución ("sistema")

---

**BLOQUE 3: SOLUCIÓN - LOS 3 COMPONENTES (35-65 segundos)**

```
[VISUAL: Gráfico 3 pilares apareciendo uno por uno]

FOUNDER:
"Tu sistema tiene tres componentes que trabajan juntos:

[PILAR 1 - Logo Gano Excel]
1. Productos únicos. Gano Excel.
   30 años de éxito. Patente mundial.

[PILAR 2 - Plan binario visual]
2. Plan de compensación probado.
   Binario justo. No pirámide.

[PILAR 3 - NEXUS en pantalla]
3. Y esto es lo que cambia todo...

[DEMO NEXUS - 8 segundos en pantalla]

NEXUS. Inteligencia artificial que responde preguntas,
maneja objeciones, califica prospectos.
24/7. Mientras tú duermes.

[VISUAL: Dashboard plataforma - rápido]

Tu aplicación para ver todo en tiempo real.
Academia. Comunidad. Herramientas.

[VOLVER A CÁMARA]

La tecnología hace el 80% del trabajo pesado.
Tú haces el 20% estratégico."
```

**Por qué funciona:**
- ✅ Tríada clara (producto + plan + tech)
- ✅ NEXUS es el diferenciador (demo visual corta)
- ✅ Ratio 80/20 (Pareto) = comprensible universalmente
- ✅ Jobs-style: "Tu aplicación" en vez de "plataforma NodeX"

---

**BLOQUE 4: OPORTUNIDAD FUNDADORES (65-90 segundos)**

```
[VISUAL: Timeline horizontal: 150 → 22,500 → 4M+]

FOUNDER:
"Ahora: buscamos 150 Fundadores.

No distribuidores. FUNDADORES.

¿Por qué?

[ANIMACIÓN: 1 figura → se ramifica a 150 más pequeñas]

Porque el 1 de diciembre abrimos a 22,500 Constructores.
Y cada Fundador se convierte en MENTOR de hasta 150 personas.

Ratio: Uno a ciento cincuenta.

[VOLVER A CÁMARA - tono serio]

No empiezas desde cero.
Empiezas con NEXUS funcionando.
Con tecnología que otros no tienen.

[VISUAL: Calendario marcando 30 Nov]

Hay un detalle:
Solo 150 espacios.
Cierra 30 de noviembre.

No es táctica de marketing.
Es que necesitamos capacitar a los primeros 150
antes de abrir a 22,500."
```

**Por qué funciona:**
- ✅ Escasez genuina (150 spots matemáticamente limitados)
- ✅ "Fundador" vs "Distribuidor" = upgrade de status
- ✅ Ratio 1:150 visualizado (exclusividad clara)
- ✅ Deadline explicado (no manipulativo)
- ✅ Ventaja pionero (NEXUS ya funcionando)

---

**BLOQUE 5: CTA CONVERSACIONAL (90-110 segundos)**

```
[VISUAL: Founder a cámara - tono conversacional, no vendedor]

FOUNDER:
"Si esto resuena contigo...

Si eres profesional que sabe que su tiempo vale más...
Si eres emprendedor que quiere diversificar sin crear otro empleo...
Si eres freelancer cansado de intercambiar horas por dinero...

[VISUAL: Formulario aparece discretamente en pantalla]

Completa el formulario.

No es una venta.
Es una conversación.

Hablamos de tu caso específico.
Y decides si ser uno de los 150 Fundadores.

[PAUSA - contacto visual directo]

Nos vemos del otro lado."

[VISUAL: Logo CreaTuActivo + URL]
[MÚSICA: Resolución optimista pero profesional]
```

**Por qué funciona:**
- ✅ "Si esto resuena" = sortea, no convence (baja resistencia)
- ✅ Lista arquetipos = personalización masiva
- ✅ "Conversación no venta" = reduce fricción
- ✅ CTA visible pero no agresivo
- ✅ "Decides" = empoderamiento

---

### **OPCIÓN B: Video Explicativo Animado**

**Formato:** Motion graphics profesional + narración off
**Duración:** 60-90 segundos
**Ventaja:** Escalable, reutilizable, más barato que producción con cámara
**Desventaja:** Menor conexión emocional vs founder a cámara

**Guion completo disponible en:** [GUION_VIDEO_FUNDADORES_CONVERSION.md](GUION_VIDEO_FUNDADORES_CONVERSION.md) líneas 331-476

**Resumen estructura:**
1. Hook visual: Reloj corriendo, persona corriendo tras dinero (0-5s)
2. Problema: Gráfico "Ingresos = Tiempo" con techo invisible (5-25s)
3. Solución 3 pilares: Producto + Plan + Tech (NEXUS animado) (25-60s)
4. Oportunidad: Timeline 150 → 22,500 con ratio 1:150 (60-80s)
5. CTA: Formulario simple + URL (80-90s)

---

## 🏗️ ARQUITECTURA TÉCNICA DE VIDEO

### **Infraestructura Existente (Vercel Blob)**

**Ya implementado en:**
- Archivo: [src/app/fundadores/page.tsx](src/app/fundadores/page.tsx) líneas 204-275
- Scripts: [scripts/optimize-video.sh](scripts/optimize-video.sh)
- Docs: [README_VIDEO_IMPLEMENTATION.md](README_VIDEO_IMPLEMENTATION.md)

**Resoluciones soportadas:**
```javascript
const videoSources = [
  {
    src: process.env.NEXT_PUBLIC_VIDEO_FUNDADORES_4K,
    type: 'video/mp4',
    media: '(min-width: 1920px)'
  },
  {
    src: process.env.NEXT_PUBLIC_VIDEO_FUNDADORES_1080P,
    type: 'video/mp4',
    media: '(min-width: 1280px)'
  },
  {
    src: process.env.NEXT_PUBLIC_VIDEO_FUNDADORES_720P,
    type: 'video/mp4',
    media: '(min-width: 640px)'
  }
];
```

**Poster frame:**
```javascript
poster={process.env.NEXT_PUBLIC_VIDEO_FUNDADORES_POSTER}
```

**Costo estimado:** $0.75-$2/mes (vs $10-20 con Mux)

---

### **Pipeline de Optimización**

**Paso 1: Grabar video master**
- Formato: MP4 (H.264)
- Resolución: 4K (3840x2160) o mínimo 1080p
- FPS: 30fps
- Bitrate: 10-15 Mbps (4K) / 5-8 Mbps (1080p)
- Audio: AAC 192kbps estéreo

**Paso 2: Optimizar con script existente**
```bash
./scripts/optimize-video.sh /path/to/video-master.mp4
```

**Output automático:**
- `video-720p.mp4` - Para móviles
- `video-1080p.mp4` - Para desktop HD
- `video-4K.mp4` - Para pantallas retina/4K
- `poster.jpg` - Frame representativo

**Paso 3: Subir a Vercel Blob**
```bash
node scripts/upload-to-blob.mjs
```

**Paso 4: Configurar env vars**
```bash
# .env.local y Vercel Dashboard
NEXT_PUBLIC_VIDEO_FUNDADORES_720P=https://...
NEXT_PUBLIC_VIDEO_FUNDADORES_1080P=https://...
NEXT_PUBLIC_VIDEO_FUNDADORES_4K=https://...
NEXT_PUBLIC_VIDEO_FUNDADORES_POSTER=https://...
```

---

### **Implementación en Página Fundadores**

**Ubicación actual:** Hero section, above the fold

**Código ejemplo (líneas 204-275 de fundadores/page.tsx):**
```tsx
<div className="relative w-full max-w-4xl mx-auto">
  <video
    ref={videoRef}
    className="w-full rounded-2xl shadow-2xl"
    poster={process.env.NEXT_PUBLIC_VIDEO_FUNDADORES_POSTER}
    controls
    preload="metadata"
  >
    <source
      src={process.env.NEXT_PUBLIC_VIDEO_FUNDADORES_4K}
      type="video/mp4"
      media="(min-width: 1920px)"
    />
    <source
      src={process.env.NEXT_PUBLIC_VIDEO_FUNDADORES_1080P}
      type="video/mp4"
      media="(min-width: 1280px)"
    />
    <source
      src={process.env.NEXT_PUBLIC_VIDEO_FUNDADORES_720P}
      type="video/mp4"
    />
    Tu navegador no soporta video HTML5.
  </video>

  {/* Play button overlay (opcional) */}
  {!isPlaying && (
    <button
      onClick={handlePlayClick}
      className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-2xl transition-opacity hover:bg-black/50"
    >
      <PlayCircle className="w-20 h-20 text-white" />
    </button>
  )}
</div>
```

**Features implementadas:**
- ✅ Responsive (3 resoluciones)
- ✅ Poster frame (no espacio vacío)
- ✅ Controles nativos HTML5
- ✅ Lazy loading (preload="metadata")
- ✅ Play button overlay opcional

---

### **Tracking de Video (Implementar)**

**Eventos a trackear con Vercel Analytics:**

```typescript
// En fundadores/page.tsx
import { track } from '@vercel/analytics';

// Video started
videoRef.current?.addEventListener('play', () => {
  track('video_play', { location: 'fundadores_hero' });
});

// Video completed
videoRef.current?.addEventListener('ended', () => {
  track('video_complete', { location: 'fundadores_hero' });
});

// Video progress (25%, 50%, 75%, 100%)
videoRef.current?.addEventListener('timeupdate', (e) => {
  const video = e.target as HTMLVideoElement;
  const progress = (video.currentTime / video.duration) * 100;

  if (progress >= 25 && !milestones.q1) {
    track('video_progress', { milestone: '25%' });
    setMilestones(prev => ({ ...prev, q1: true }));
  }
  // ... similar para 50%, 75%, 100%
});
```

**KPIs críticos:**
- **Play rate:** % de visitantes que dan play
- **Completion rate:** % que ven hasta el final
- **Drop-off points:** Segundo exacto donde abandonan
- **CTA conversion:** % que completan formulario después de video

---

## 🎨 BRANDING Y DISEÑO

### **Paleta de Colores (Centralizada)**

**Archivo:** [src/lib/branding.ts](src/lib/branding.ts)

```typescript
export const BRAND = {
  colors: {
    blue: '#1E40AF',     // Primario
    purple: '#7C3AED',   // Secundario
    gold: '#F59E0B',     // Acento/CTA

    dark: '#0f172a',     // Background
    darkAlt: '#1e293b',  // Cards
    white: '#FFFFFF',

    gray: {
      100: '#f1f5f9',
      300: '#cbd5e1',
      500: '#64748b',
      700: '#334155'
    }
  }
}
```

**Aplicación en video:**
- **Overlays/títulos:** Gradient blue → purple
- **CTAs:** Gold (#F59E0B)
- **Backgrounds:** Dark (#0f172a)
- **Texto:** White (#FFFFFF)

---

### **Tipografía**

**Fuente principal:**
```typescript
fonts: {
  stack: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
}
```

**En video:**
- **Títulos:** Bold 700-800
- **Subtítulos:** Regular 400-500
- **Tamaño:** Mínimo 24px para legibilidad móvil

---

### **Elementos Visuales Obligatorios**

1. **Logo CreaTuActivo**
   - Ubicación: Esquina superior derecha (sutil, no invasivo)
   - Final: Logo + URL centrados

2. **Gradientes de Marca**
   - Títulos: Linear gradient blue → purple → gold
   - Cards/Overlays: rgba(30, 64, 175, 0.1) → rgba(124, 58, 237, 0.1)

3. **Íconos (Lucide React)**
   - Productos: Shield
   - Plan: Users
   - Tecnología: Zap / Bot
   - Timeline: TrendingUp
   - Aplicación: Smartphone

4. **Animaciones**
   - Transiciones: Smooth, profesionales (no juveniles)
   - Duración: 0.3-0.5s (no más lentas)
   - Easing: ease-in-out

---

### **Subtítulos (CRÍTICO - 66% sin sonido)**

**Especificaciones:**
- Formato: SRT o WebVTT
- Tamaño: 28-32px
- Fuente: Sans-serif bold
- Color: Blanco con outline negro (legibilidad máxima)
- Posición: Tercio inferior (no obstaculizar rostro)
- Timing: Sincronizado perfectamente (±0.1s)

**Ejemplo WebVTT:**
```
WEBVTT

00:00:00.000 --> 00:00:03.500
Jeff Bezos no construyó su fortuna
vendiendo libros.

00:00:03.500 --> 00:00:06.000
Construyó Amazon. El sistema.

00:00:08.000 --> 00:00:10.500
Nosotros aplicamos esa misma filosofía.
```

---

## 🤖 INTEGRACIÓN CON NEXUS

### **Tracking de Visualización**

**Implementar en route.ts (API NEXUS):**

Cuando NEXUS detecta que usuario vio el video, ajusta su estrategia:

```typescript
// En prospect_data agregar campo:
video_watched: boolean
video_completion_rate: number (0-100)

// En context injection (línea ~2200):
${userData.video_watched ? `
- El usuario vio el video de Fundadores (${userData.video_completion_rate}% completado)
- ${userData.video_completion_rate >= 75 ?
  'Ya conoce la propuesta completa. Enfócate en resolver dudas específicas.' :
  'Solo vio inicio del video. Puede necesitar más contexto.'}
` : ''}
```

---

### **Pregunta Post-Video de NEXUS**

**Después de detectar video completo:**

```
NEXUS: "Vi que viste el video completo. ¿Qué parte resonó más contigo?"

Opciones:
A) La analogía de Amazon (construir sistemas, no solo vender)
B) NEXUS trabajando 24/7 (tecnología haciendo el trabajo pesado)
C) La oportunidad de ser Fundador (150 spots, ratio 1:150)
D) Los productos Gano Excel (30 años, patente mundial)
```

**Beneficios:**
- ✅ Calificación inteligente (qué motivó al prospecto)
- ✅ Personalización conversación según interés
- ✅ Data para optimizar video (qué sección más poderosa)

**Implementación:**
- Agregar en [src/app/api/nexus/route.ts](src/app/api/nexus/route.ts)
- Quick Reply después de `video_watched: true`

---

### **Sincronización con Formulario**

**Flujo ideal:**

1. Usuario llega a `/fundadores`
2. Ve video (90-120s)
3. NEXUS aparece: "¿Preguntas sobre lo que viste?"
4. Conversación breve (1-2 intercambios)
5. NEXUS: "Para continuar, completa el formulario. Te llamamos en 24-48h"
6. Usuario completa formulario
7. `prospect_data.interest_level` aumenta automáticamente (vio video = +3 puntos)

**Código ejemplo:**
```typescript
// En captureProspectData() - route.ts línea ~1800
if (metadata.video_watched) {
  data.interest_level = Math.min(10, (data.interest_level || 5) + 3);
  data.notes = `${data.notes || ''} | Vio video fundadores (${metadata.video_completion_rate}%)`;
}
```

---

## 📊 TESTING Y OPTIMIZACIÓN

### **A/B Testing Inicial**

**Hipótesis:** Video optimizado aumenta conversión 80-86% vs sin video

**Setup:**
```typescript
// En fundadores/page.tsx
const [variant, setVariant] = useState<'control' | 'video'>('control');

useEffect(() => {
  // Randomly assign variant (50/50)
  const randomVariant = Math.random() > 0.5 ? 'video' : 'control';
  setVariant(randomVariant);

  track('ab_test_variant', {
    variant: randomVariant,
    page: 'fundadores'
  });
}, []);

// Mostrar video solo en variant 'video'
{variant === 'video' && (
  <VideoComponent />
)}
```

**Métricas a comparar:**
- **Control (sin video):** Baseline conversión actual
- **Treatment (con video):** Conversión con video hero

**Duración test:** 7-14 días o mínimo 100 visitantes por variante

---

### **Optimización Iterativa**

**Drop-off Analysis:**

Si detectas que 40% abandonan en segundo 35:
1. Revisar ese momento exacto del video
2. Identificar causa (¿mensaje confuso? ¿demasiado técnico? ¿transición lenta?)
3. Re-editar esa sección
4. Re-deploy y medir

**Herramientas:**
- Vercel Analytics con eventos custom
- Hotjar (heatmaps + recordings) opcional
- Google Analytics 4 (video engagement)

**Query ejemplo (Supabase):**
```sql
-- Conversión antes vs después de video
SELECT
  DATE(created_at) as fecha,
  COUNT(*) FILTER (WHERE video_watched = false) as sin_video,
  COUNT(*) FILTER (WHERE video_watched = true) as con_video,
  AVG(interest_level) FILTER (WHERE video_watched = false) as interes_sin_video,
  AVG(interest_level) FILTER (WHERE video_watched = true) as interes_con_video
FROM prospect_data
WHERE created_at > NOW() - INTERVAL '30 days'
GROUP BY DATE(created_at)
ORDER BY fecha DESC;
```

---

### **Variantes de CTA (A/B/C Testing)**

**Grabar 3 versiones del CTA (último bloque):**

**Versión A (Conversacional - ACTUAL):**
```
"Completa el formulario.
No es una venta. Es una conversación.
Decides si ser uno de los 150 Fundadores."
```

**Versión B (Urgencia):**
```
"Solo quedan X cupos de los 150 Fundadores.
Completa el formulario ahora.
Cierra 30 de noviembre."
```

**Versión C (Exclusividad):**
```
"No todos califican para ser Fundadores.
Completa el formulario y evaluamos tu caso.
Si encajas, te llamamos en 24-48 horas."
```

**Testing:**
- Rotar versiones semanalmente
- Medir: CTA click → formulario completado
- Implementar ganadora

---

## 📚 REFERENCIAS DOCUMENTALES

### **Documentos de Proyecto (Lectura Obligatoria)**

1. **[GUION_VIDEO_FUNDADORES_CONVERSION.md](GUION_VIDEO_FUNDADORES_CONVERSION.md)**
   - Investigación VSL 2025
   - Estructura de alta conversión
   - Guiones base (Opción A y B completos)
   - KPIs a medir

2. **[knowledge_base/nexus-system-prompt-v12.2-jobs-style-legal.md](knowledge_base/nexus-system-prompt-v12.2-jobs-style-legal.md)**
   - Filosofía Jobs-Style (líneas 365-396)
   - Vocabulario prohibido vs permitido
   - Identidad NEXUS actualizada
   - Lenguaje simple "abuela 75 años"

3. **[CONTADOR_CUPOS_FUNDADORES.md](CONTADOR_CUPOS_FUNDADORES.md)**
   - Lógica contador de cupos (actualmente pausado en 150)
   - Timeline de fechas críticas
   - Urgencia genuina vs manipulativa

4. **[README_VIDEO_IMPLEMENTATION.md](README_VIDEO_IMPLEMENTATION.md)**
   - Implementación técnica Vercel Blob
   - Scripts de optimización
   - Troubleshooting

5. **[src/lib/branding.ts](src/lib/branding.ts)**
   - Paleta de colores oficial
   - Tipografía
   - URLs de assets

---

### **Archivos de Código Relevantes**

1. **[src/app/fundadores/page.tsx](src/app/fundadores/page.tsx)**
   - Página actual (donde va el video)
   - Líneas 204-275: Estructura video hero
   - Formulario de captura
   - Timeline visual

2. **[src/components/nexus/Chat.tsx](src/components/nexus/Chat.tsx)**
   - Línea 36: Mensaje inicial Jobs-style
   - Línea 188: Footer NEXUS
   - Integración tracking

3. **[src/app/api/nexus/route.ts](src/app/api/nexus/route.ts)**
   - Línea ~1800: `captureProspectData()`
   - Línea ~2200: Context injection
   - Tracking de consentimiento y datos

4. **[scripts/optimize-video.sh](scripts/optimize-video.sh)**
   - FFmpeg para generar 720p, 1080p, 4K
   - Extracción de poster frame

5. **[scripts/upload-to-blob.mjs](scripts/upload-to-blob.mjs)**
   - Upload a Vercel Blob Storage
   - Generación de URLs públicas

---

### **Documentación Externa (Investigación)**

**Video Sales Letters:**
- CopyPosse: "High Converting VSL From Scratch"
- Vengreso: "Perfect Video Sales Letter"
- DigitalMarketer: "VSL Workshop"

**Conversion Data:**
- Unbounce: "Explainer Videos +20% Conversion"
- Wistia: "Video on Landing Pages"
- VBout: "Video Impact on Conversion Rates"

**Founder Story Framework:**
- FilmKraft: "Founder Video Ad Best Practices"
- Cumberland Creative: "Founder's Story Video"

**Attention Span Research:**
- Video Effect TV: "Video Attention Span 2025"
- Instapage: "Landing Page Video Viewership"

---

## ✅ CHECKLIST PARA AGENTE

### **Pre-Producción**

- [ ] Leer completamente este handoff (todas las secciones)
- [ ] Revisar [GUION_VIDEO_FUNDADORES_CONVERSION.md](GUION_VIDEO_FUNDADORES_CONVERSION.md)
- [ ] Entender filosofía Jobs-Style (líneas 365-396 de v12.2)
- [ ] Familiarizarse con arquetipos de Fundadores
- [ ] Decidir formato: Founder a cámara (A) vs Animación (B) vs Híbrido
- [ ] Confirmar con usuario: ¿Luis o Liliana a cámara? ¿Ambos? ¿Solo Liliana?

### **Guion Final**

- [ ] Adaptar guion base con lenguaje Jobs-Style ESTRICTO
- [ ] Verificar: CERO uso de vocabulario prohibido
- [ ] Confirmar duración: 90-120 segundos máximo
- [ ] Hook Bezos en primeros 10 segundos
- [ ] Problema universal (tiempo = ingresos) en 10-35s
- [ ] Solución 3 componentes (producto + plan + tech) en 35-65s
- [ ] Oportunidad 150 Fundadores (ratio 1:150) en 65-90s
- [ ] CTA conversacional (no venta) en 90-110s
- [ ] Crear script de subtítulos (WebVTT/SRT)

### **Storyboard (Incluso para Cámara)**

- [ ] Frame-by-frame para momentos clave
- [ ] B-roll necesario (freelancers, profesionales, emprendedores)
- [ ] Gráficos/overlays (3 pilares, timeline, ratio 1:150)
- [ ] Demo NEXUS (8-10 segundos máximo)
- [ ] Transiciones smooth entre bloques
- [ ] CTAs visuales (formulario apareciendo)

### **Producción (Si Founder a Cámara)**

- [ ] Brief para videógrafo (iluminación, audio, ambiente)
- [ ] Grabar takes múltiples de cada bloque
- [ ] Capturar demos reales NEXUS funcionando
- [ ] Grabar 3 variaciones de CTA (A/B/C testing)
- [ ] Audio limpio (micrófono lavalier/condensador)
- [ ] Iluminación profesional (ring light mínimo)

### **Producción (Si Animación)**

- [ ] Contratar motion designer (Fiverr/Upwork) o usar herramienta
- [ ] Narración en off con calidad broadcast
- [ ] Revisar animatic antes de producción final
- [ ] Colores de marca (blue #1E40AF, purple #7C3AED, gold #F59E0B)
- [ ] Íconos Lucide React (Shield, Users, Zap, Bot)

### **Post-Producción**

- [ ] Editar con ritmo dinámico (cortes cada 3-5s)
- [ ] Subtítulos grandes y legibles (28-32px, white + outline black)
- [ ] Gráficos/overlays para puntos clave
- [ ] Optimizar primeros 3 seg para autoplay silencioso
- [ ] Versiones 720p, 1080p, 4K (script optimize-video.sh)
- [ ] Generar poster frame representativo
- [ ] Música: energética pero profesional (no invasiva)

### **Implementación Técnica**

- [ ] Subir videos a Vercel Blob (upload-to-blob.mjs)
- [ ] Configurar env vars (4 URLs: 720p, 1080p, 4K, poster)
- [ ] Actualizar fundadores/page.tsx (si estructura cambia)
- [ ] Implementar tracking eventos (play, progress, complete)
- [ ] Setup A/B test (con video vs sin video)
- [ ] Integrar con NEXUS (pregunta post-video)

### **Testing & Launch**

- [ ] Test en móvil (iOS Safari, Android Chrome)
- [ ] Test en desktop (Chrome, Firefox, Safari)
- [ ] Verificar subtítulos legibles en todos los dispositivos
- [ ] Verificar autoplay silencioso funciona
- [ ] Medir play rate primeros 100 visitantes
- [ ] Analizar drop-off points
- [ ] Iterar basado en data (optimizar segundos críticos)

---

## 🎯 MÉTRICAS DE ÉXITO

### **Meta Conversión (Conservadora)**

- **Baseline (sin video):** 10-15% visitante → aplicante
- **Meta (con video):** 20-30% visitante → aplicante (+86% según investigación)

### **Video Engagement**

- **Play rate:** >60% de visitantes (benchmark: 50-70%)
- **Completion rate:** >40% ven hasta el final (benchmark: 30-50%)
- **Drop-off crítico:** <20% abandonan en primeros 10s (benchmark: 20-30%)

### **Cualitativo**

- Video transmite filosofía Jobs-Style (simplicidad, aspiracional sin ser barato)
- Usuario promedio entiende la oportunidad en <90s
- Diferenciación clara vs MLM tradicional (sistema, no venta)
- Escasez genuina (150 spots) sin sonar manipulativo

---

## 💡 RECOMENDACIONES FINALES

### **1. Empezar con Opción A (Founder a Cámara)**

**Razón:** Máxima credibilidad + conexión emocional en etapa inicial (150 Fundadores)

**Versión 1.0:** Luis o Liliana a cámara (90-120s)
**Versión 2.0 (futuro):** Testimonial de primer Fundador (60s)
**Versión 3.0 (futuro):** Animación explicativa (reutilizable para ads)

---

### **2. No Buscar Perfección en V1**

**Objetivo V1:** Video funcional que supere baseline sin video (>15% conversión)
**Objetivo V2:** Optimizar basado en drop-off points (iterar secciones débiles)
**Objetivo V3:** Variantes personalizadas por arquetipo (profesional, emprendedor, etc.)

**Filosofía:** Ship → Measure → Iterate

---

### **3. Mantener Coherencia Jobs-Style**

**Test mental:** "¿Mi abuela de 75 años lo entendería?"

Si la respuesta es NO → Simplificar más.

**Ejemplos:**
- ❌ "Framework de apalancamiento tecnológico con IA conversacional"
- ✅ "Tecnología que trabaja por ti mientras duermes"

---

### **4. Priorizar Subtítulos**

**66% de videos se ven sin sonido.**

No es opcional. Es crítico.

---

## 🚀 PRÓXIMOS PASOS INMEDIATOS

1. **Decidir formato** con usuario (Luis/Liliana a cámara vs Animación)
2. **Refinar guion** basado en feedback del usuario
3. **Crear brief de producción** (videógrafo o motion designer)
4. **Producir versión 1.0** (priorizar shipping sobre perfección)
5. **Implementar tracking** (Vercel Analytics + eventos custom)
6. **Lanzar A/B test** (con video vs sin video)
7. **Analizar data a 7 días** (drop-off, completion, conversión)
8. **Iterar sección débil** (segundo con mayor abandono)

---

**Preparado por:** Claude Code (Anthropic)
**Para:** Agente Claude Code - Desarrollo Video Fundadores
**Fecha:** 17 Noviembre 2025
**Versión:** 1.0 - Handoff Completo con Contexto v12.2
**Próxima revisión:** Post-feedback usuario sobre formato (Opción A vs B)

---

## 📞 CONTACTO PARA DECISIONES

**Decisiones de negocio/branding:**
- Luis Cabrejo (Fundador)
- Liliana Moreno (+573102066593)

**Decisiones técnicas:**
- Agente Claude Code (tú)
- Referencia: [CLAUDE.md](CLAUDE.md) para arquitectura

**Decisiones de contenido:**
- Basarse en v12.2 Jobs-Style
- Principio: "Abuela de 75 años debe entenderlo"

---

✅ **HANDOFF COMPLETO - LISTO PARA DESARROLLO**
