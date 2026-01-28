# HANDOFF TÉCNICO: Sistema Queswa (NEXUS) para Dashboard

**Fecha**: 30 Diciembre 2025
**Para**: Claude Code (Agente Dashboard / queswa.app)
**De**: Claude Code (Agente Marketing)
**Propósito**: Documentar cambios técnicos del sistema Queswa que aplican en ambos proyectos

---

## CONTEXTO CRÍTICO

El chatbot **Queswa** (anteriormente NEXUS) es compartido entre:
- `creatuactivo.com` (Marketing) - Captación de prospectos
- `queswa.app` (Dashboard) - Soporte a socios de negocio

Ambos usan la **misma arquitectura**, pero con contextos diferentes.

---

## 1. ARQUITECTURA API NEXUS (route.ts)

### Ubicación
```
src/app/api/nexus/route.ts
```

### Versión Actual
- **API Version**: v14.9 - Fragmentación de arsenales
- **Modelo**: Claude (Anthropic)
- **Runtime**: Edge (60s timeout)

### Características Clave

#### 1.1 Lazy Initialization de Supabase
```typescript
let supabaseClient: ReturnType<typeof createClient> | null = null;
function getSupabaseClient() {
  if (!supabaseClient) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
  }
  return supabaseClient;
}
```
**Razón**: Evita errores en build-time cuando las variables de entorno no están disponibles.

#### 1.2 Cache en Memoria
```typescript
const searchCache = new Map<string, any>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutos

const systemPromptCache = new Map<string, any>();
const SYSTEM_PROMPT_CACHE_TTL = 5 * 60 * 1000;
```
**Uso**: Reduce latencia en búsquedas repetidas y carga del system prompt.

#### 1.3 Sistema de Scoring Progresivo v2.0
Detecta señales de interés en los mensajes del usuario:

| Señal | Puntos | Ejemplo |
|-------|--------|---------|
| Aplicación personal | +3 | "cómo puedo yo", "en mi caso" |
| Profundización | +1.5 | "exactamente", "en detalle" |
| Mentalidad de líder | +3.5 | "mi equipo", "ayudar otros" |
| Análisis financiero | +4 | "cuánto gano", "plan compensación" |
| Profesión relevante | +2 | "emprendedor", "freelance" |
| Respuestas concisas | +1 | Mensajes cortos después de 3+ intercambios |

#### 1.4 Captura de Datos del Prospecto
```typescript
interface ProspectData {
  name?: string;
  email?: string;
  phone?: string;
  occupation?: string;
  interest_level?: number;  // 0-10
  objections?: string[];
  archetype?: string;
  package?: string;         // Paquete seleccionado
  momento_optimo?: string;
  preguntas?: string[];
  consent_granted?: boolean;
  consent_timestamp?: string;
}
```

#### 1.5 Función removeNullValues
```typescript
function removeNullValues(obj: Record<string, any>): Record<string, any> {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, value]) => value !== null && value !== undefined)
  );
}
```
**Uso**: Evita que NULL sobreescriba datos existentes en el merge JSONB de PostgreSQL.

---

## 2. BASE DE CONOCIMIENTO (Arsenales)

### Estructura Consolidada v3.0

| Arsenal | Archivo | Contenido | Tamaño |
|---------|---------|-----------|--------|
| `arsenal_inicial` | `arsenal_inicial.txt` | 34 respuestas iniciales | 21K |
| `arsenal_avanzado` | `arsenal_avanzado.txt` | 63 respuestas (objeciones + sistema + valor + escalación) | 52K |
| `catalogo_productos` | `catalogo_productos.txt` | 22 productos + ciencia | 20K |

### Fragmentación con Voyage AI
- **108 fragmentos individuales** con embeddings
- Modelo: `voyage-3-lite` (512 dimensiones)
- **95% reducción de tokens** vs documentos monolíticos

### Ubicación Local
```
knowledge_base/
├── arsenal_inicial.txt
├── arsenal_avanzado.txt
├── catalogo_productos.txt
└── README.md
```

### Scripts de Sincronización
```bash
# Descargar desde Supabase
node scripts/descargar-arsenales-supabase.mjs

# Subir a Supabase
node scripts/deploy-arsenal-inicial.mjs
node scripts/deploy-arsenal-avanzado.mjs
node scripts/actualizar-catalogo-productos.mjs

# Regenerar embeddings
node scripts/fragmentar-arsenales-voyage.mjs
```

---

## 3. BÚSQUEDA VECTORIAL (vectorSearch.ts)

### Ubicación
```
src/lib/vectorSearch.ts
```

### Funciones Principales

#### 3.1 generateVoyageEmbedding
```typescript
export async function generateVoyageEmbedding(
  text: string,
  apiKey: string,
  inputType: 'query' | 'document' = 'query'
): Promise<number[]>
```
- Usa Voyage AI para generar embeddings de alta calidad
- Enriquece queries cortas con contexto adicional

#### 3.2 vectorSearch (con fallback)
```typescript
export async function vectorSearch(
  query: string,
  documents: DocumentWithEmbedding[],
  voyageApiKey?: string,
  options: VectorSearchOptions = {}
): Promise<VectorSearchResult[]>
```
- Usa Voyage AI si hay API key disponible
- Fallback a embeddings locales si falla

#### 3.3 Enriquecimiento de Queries
```typescript
const OBJECTION_KEYWORDS = ['mlm', 'multinivel', 'piramide', 'estafa', 'scam', 'fraude', 'ponzi'];

function enrichQuery(query: string): string {
  const hasObjection = OBJECTION_KEYWORDS.some(kw => normalized.includes(kw));
  if (hasObjection && query.length < 50) {
    return `${query} - objeción sobre legitimidad del negocio`;
  }
  return query;
}
```

---

## 4. COMPONENTES NEXUS

### Estructura de Archivos
```
src/components/nexus/
├── index.ts                    # Exportaciones
├── useNEXUSChat.ts             # Hook principal
├── NEXUSWidget.tsx             # UI del chat
├── NEXUSFloatingButton.tsx     # Botón flotante
├── NEXUSDataCaptureCard.tsx    # Captura de datos
├── useSlidingViewport.ts       # Manejo de scroll
└── Chat.tsx                    # Renderizado de mensajes
```

### 4.1 useNEXUSChat.ts

#### Saludo Inicial Contextual
```typescript
const getInitialGreeting = (): Message => {
  const isProductsPage = typeof window !== 'undefined' &&
    window.location.pathname.includes('/sistema/productos');

  if (isProductsPage) {
    // Saludo especializado para página de productos
    return { content: `Soy Queswa 🪢\n\nTu asesor de bienestar...` };
  }

  // Saludo genérico - Léxico de Soberanía
  return { content: `Soy Queswa 🪢\n\nLa mayoría de profesionales pasan 40 años...` };
};
```

#### Espera de Fingerprint
```typescript
const waitForFingerprint = async (maxWait = 5000): Promise<string | undefined> => {
  const start = Date.now();
  while (Date.now() - start < maxWait) {
    const fp = (window as any).FrameworkIAA?.fingerprint;
    if (fp) return fp;
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  // Fallback a localStorage
  return localStorage.getItem('nexus_fingerprint');
};
```

#### Detección de Constructor
```typescript
let constructorId: string | null = null;
if (typeof window !== 'undefined') {
  constructorId = (window as any).FrameworkIAA?.constructorRef || null;
  if (!constructorId) {
    const pathname = window.location.pathname;
    const match = pathname.match(/\/fundadores\/([a-z0-9-]+)/);
    if (match) constructorId = match[1];
  }
}
```

#### Contexto de Página
```typescript
const pageContext = typeof window !== 'undefined' &&
  window.location.pathname.includes('/sistema/productos')
  ? 'catalogo_productos'  // Modo asesor de salud/bienestar
  : 'default';            // Modo asesor de negocio
```

### 4.2 NEXUSWidget.tsx

#### Paleta Quiet Luxury
```typescript
const QUIET_LUXURY = {
  gold: '#D4AF37',
  goldMuted: '#C9A962',
  goldDark: '#B8962F',
  bgDeep: '#0a0a0f',
  bgSurface: '#12121a',
  bgCard: '#1a1a24',
  textPrimary: '#f5f5f5',
  textSecondary: '#a0a0a8',
  textMuted: '#6b6b75',
};
```

#### Sliding Viewport
```typescript
const { offset, registerNode, isUserScrolling } = useSlidingViewport(messages, scrollContainerRef);
```
- Efecto de "slide" como Claude.ai
- Detecta si el usuario está scrolleando manualmente
- Pausa el auto-scroll cuando el usuario explora el historial

#### Highlight de Preguntas de Captura
```typescript
const highlightCaptureQuestions = (text: string) => {
  const patterns = [
    /¿[Cc]ómo te llamas\?/g,
    /¿[Aa] qué te dedicas actualmente[^?]*\?/g,
    /¿[Cc]uál es tu número de [Ww]hats[Aa]pp\?/g,
  ];
  // Resalta en negrilla
  patterns.forEach(pattern => {
    highlighted = highlighted.replace(pattern, (match) => `**${match}**`);
  });
  return highlighted;
};
```

### 4.3 useSlidingViewport.ts

```typescript
export const useSlidingViewport = (
  messages: Message[],
  scrollContainerRef: React.RefObject<HTMLDivElement>
) => {
  // Calcula offset para efecto slide
  // Detecta scroll manual del usuario
  // Registra nodos para cálculos de altura
  return { offset, registerNode, isUserScrolling };
};
```

---

## 5. LAYOUT.TSX (Tracking + PWA)

### Ubicación
```
src/app/layout.tsx
```

### Configuraciones Clave

#### 5.1 Tracking.js
```html
<script src="/tracking.js" defer></script>
```
Configurado con:
```javascript
window.TRACKING_CONFIG = {
  SUPABASE_URL: '...',
  SUPABASE_ANON_KEY: '...'
};
```

#### 5.2 Service Worker PWA
```javascript
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}
```
**Versión**: v1.0.9

#### 5.3 Event Handler para NEXUS
```javascript
window.__cta_nexus_handler = function(e) {
  if (window.updateProspectData) window.updateProspectData(e.detail);
};
window.addEventListener('nexusMessage', window.__cta_nexus_handler);
```

#### 5.4 NEXUSFloatingButton
```tsx
<NEXUSFloatingButton />
```
Montado globalmente en el layout.

---

## 6. SYSTEM PROMPT

### Almacenamiento
- **Tabla**: `system_prompts` en Supabase
- **Nombre**: `nexus_main`
- **Cache**: 5 minutos en memoria

### Versión Actual
- **v13.6** - Flujo 14 mensajes + Captura temprana
- **Identidad**: "Copiloto del Arquitecto"

### Scripts
```bash
# Leer prompt actual
node scripts/leer-system-prompt.mjs

# Descargar a archivo local
node scripts/descargar-system-prompt.mjs

# Actualizar (versiones específicas)
node scripts/actualizar-system-prompt-v14.mjs
```

---

## 7. VARIABLES DE ENTORNO REQUERIDAS

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Anthropic (Claude)
ANTHROPIC_API_KEY=

# Voyage AI (embeddings)
VOYAGE_API_KEY=
```

---

## 8. AJUSTES PARA DASHBOARD (queswa.app)

### 8.1 Contexto Diferente
En el Dashboard, Queswa debe comportarse como **asistente para socios**, no captador de prospectos:

```typescript
// Detectar contexto Dashboard
const isDashboard = typeof window !== 'undefined' &&
  window.location.hostname.includes('queswa');

if (isDashboard) {
  // Modo: Soporte a socios
  // - Respuestas sobre uso del Dashboard
  // - Ayuda con herramientas
  // - Preguntas sobre compensación
} else {
  // Modo: Captación de prospectos
  // - Flujo 14 mensajes
  // - Captura de datos
  // - Escalación a humano
}
```

### 8.2 Saludo Inicial Dashboard
```typescript
if (isDashboard) {
  return {
    content: `Soy Queswa 🪢

Tu copiloto en la plataforma.

¿En qué puedo ayudarte hoy?

**A)** 📊 Entender mis métricas
**B)** 🎯 Usar el Pipeline
**C)** 📚 Acceder a la Academia
**D)** 💬 Otra consulta`
  };
}
```

### 8.3 Arsenales Adicionales (Por crear)
Para el Dashboard, considerar crear:
- `arsenal_dashboard.txt` - Preguntas sobre uso de la plataforma
- `arsenal_compensacion_detallado.txt` - Cálculos de compensación

---

## 9. CHECKLIST DE IMPLEMENTACIÓN

### Para replicar en Dashboard:

- [ ] Copiar `src/app/api/nexus/route.ts` (ajustar contexto)
- [ ] Copiar `src/lib/vectorSearch.ts`
- [ ] Copiar `src/components/nexus/*`
- [ ] Configurar variables de entorno
- [ ] Ajustar `layout.tsx` con tracking y NEXUSFloatingButton
- [ ] Sincronizar arsenales en Supabase (compartidos)
- [ ] Crear arsenales específicos para Dashboard
- [ ] Ajustar saludos iniciales para contexto de socios

### Archivos compartidos (misma fuente):
- Knowledge base (arsenales)
- System prompt (Supabase)
- Embeddings (Voyage AI)

### Archivos a personalizar:
- Saludos iniciales
- Contexto de página
- Scoring de interés (diferente para socios)

---

## 10. DEBUGGING

### Logs en Consola
```javascript
// Fingerprint
console.log('✅ [NEXUS Widget] Fingerprint obtenido:', fp);
console.log('❌ [NEXUS Widget] CRÍTICO: No se pudo obtener fingerprint');

// Constructor
console.log(`✅ [NEXUS Widget] Constructor detectado: ${constructorId}`);

// Scoring
console.log('🌟 [SCORING] SEÑAL: Aplicación personal (+3)');
console.log('💰 [SCORING] SEÑAL: Análisis financiero (+4)');
```

### Health Check
```bash
curl http://localhost:3000/api/nexus
```
Retorna: conteo de arsenales, versión de system prompt, estado de RPC.

---

*Documento generado: 30 Diciembre 2025*
*Para: Claude Code (Dashboard)*
*Desde: Claude Code (Marketing)*
*Versión: 1.0*
