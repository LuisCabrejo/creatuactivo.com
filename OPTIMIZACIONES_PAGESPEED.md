# Optimizaciones PageSpeed Insights

**Fecha**: 2025-11-07
**Objetivo**: Reducir render-blocking resources y mejorar LCP (Largest Contentful Paint)

## Problema Identificado

PageSpeed Insights mostró 3 problemas críticos:

1. **tracking.js bloqueando render** - 570ms de bloqueo
2. **CSS de Next.js bloqueando render** - 190ms de bloqueo
3. **Cadena de dependencias larga** - tracking.js → identify_prospect → 1,020ms total

## Optimizaciones Implementadas

### 1. ✅ tracking.js - Carga Diferida Inteligente

**Archivo**: `public/tracking.js`

**Cambios**:
- Creación de **stub inmediato** de `window.FrameworkIAA` (sincrónico, no bloquea)
- Lectura inmediata de `localStorage` para fingerprint (sin API call)
- Diferir la llamada a `identify_prospect` usando `requestIdleCallback`
- Timeout de 2 segundos máximo si el navegador está ocupado

**Beneficio esperado**:
- ❌ ANTES: 570ms de bloqueo + 1,020ms de API call = **1,590ms total de bloqueo**
- ✅ AHORA: 0ms de bloqueo (stub inmediato) + API call en background

**Código clave**:
```javascript
// PASO 1: Stub inmediato (no bloquea)
window.FrameworkIAA = {
    fingerprint: localStorage.getItem('nexus_fingerprint') || 'pending_' + Date.now(),
    constructorRef: getConstructorRef(),
    prospect: null,
    ready: false,
    whenReady: function(callback) { ... }
};

// PASO 2: Diferir API call
requestIdleCallback(async () => {
    await identifyProspect();
    window.FrameworkIAA.ready = true;
}, { timeout: 2000 });
```

### 2. ✅ layout.tsx - Script defer + Preconnect

**Archivo**: `src/app/layout.tsx`

**Cambios**:
- Agregar `defer` al script de tracking.js (línea 116)
- Agregar `preconnect` para Supabase (líneas 92-94)
- Agregar `dns-prefetch` como fallback

**Beneficio esperado**:
- Script tracking.js ya no bloquea el parser HTML
- DNS resolution de Supabase comienza antes (reduce latencia de API call)

**Código clave**:
```tsx
{/* Preconnect para Supabase */}
<link rel="preconnect" href="https://cvadzbmdypnbrbnkznpb.supabase.co" />
<link rel="dns-prefetch" href="https://cvadzbmdypnbrbnkznpb.supabase.co" />

{/* Script con defer */}
<script src="/tracking.js" defer></script>
```

### 3. ✅ Fuentes - Optimización de Carga

**Archivo**: `src/app/layout.tsx`

**Cambios**:
- Agregar `display: 'swap'` a configuración de Inter
- Habilitar `preload: true`
- Agregar CSS variable para mayor flexibilidad

**Beneficio esperado**:
- Evita FOIT (Flash of Invisible Text)
- Reduce CLS (Cumulative Layout Shift)
- Mejora First Contentful Paint (FCP)

**Código clave**:
```typescript
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',    // Evita FOIT
  preload: true,      // Precarga la fuente
  variable: '--font-inter'
});
```

## Compatibilidad con NEXUS

### ⚠️ Consideración Importante

El sistema NEXUS ya tenía protección contra race conditions:

**Archivo**: `src/components/nexus/useNEXUSChat.ts` (líneas 78-100)

```typescript
const waitForFingerprint = async (maxWait = 5000): Promise<string | undefined> => {
  while (Date.now() - start < maxWait) {
    const fp = (window as any).FrameworkIAA?.fingerprint;
    if (fp) return fp;
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  // Fallback a localStorage
  return localStorage.getItem('nexus_fingerprint');
};
```

**Con nuestras optimizaciones**:
1. ✅ El stub inmediato garantiza que `window.FrameworkIAA.fingerprint` exista siempre
2. ✅ El fingerprint viene de localStorage (instantáneo)
3. ✅ NEXUS puede enviar mensajes inmediatamente sin esperar
4. ✅ La llamada a `identify_prospect` se completa en background
5. ✅ Cuando `identify_prospect` termine, actualiza `prospect` y dispara evento `nexusTrackingReady`

## Pruebas Requeridas

### Test 1: Verificar stub funciona antes de defer
```javascript
// En consola del navegador (inmediatamente al cargar)
console.log(window.FrameworkIAA);
// Debe mostrar: { fingerprint: "...", constructorRef: null, prospect: null, ready: false }
```

### Test 2: Verificar NEXUS puede enviar mensajes
```javascript
// Abrir NEXUS widget y enviar mensaje
// Debe funcionar sin errores "CRÍTICO: Request sin fingerprint"
```

### Test 3: Verificar identify_prospect se ejecuta
```javascript
// Esperar 2-3 segundos, luego verificar
console.log(window.FrameworkIAA.ready);  // Debe ser true
console.log(window.FrameworkIAA.prospect);  // Debe tener datos
```

### Test 4: Verificar en PageSpeed Insights
- URL: https://pagespeed.web.dev/
- Analizar versión móvil y desktop
- Verificar que tracking.js ya no aparezca como "render-blocking"
- Verificar que el LCP mejoró

## Métricas Esperadas

### Antes de Optimizaciones
- **LCP**: ~2.5s
- **FCP**: ~1.5s
- **Render-blocking resources**: 570ms (tracking.js)
- **Critical Request Chain**: 1,020ms

### Después de Optimizaciones (Estimado)
- **LCP**: ~1.2s (**-52% mejora**)
- **FCP**: ~0.8s (**-47% mejora**)
- **Render-blocking resources**: 0ms (**-100% mejora**)
- **Critical Request Chain**: Eliminated (async)

## Monitoreo Post-Deploy

1. **Verificar en producción**: https://creatuactivo.com
2. **Analizar con PageSpeed Insights**: https://pagespeed.web.dev/
3. **Verificar Web Vitals** en Google Search Console
4. **Revisar logs de Supabase** para confirmar que identify_prospect sigue funcionando

## Rollback Plan

Si algo falla, revertir estos commits:

```bash
# Ver cambios
git diff HEAD~1 public/tracking.js
git diff HEAD~1 src/app/layout.tsx

# Rollback si es necesario
git revert HEAD
```

**Archivos críticos para backup**:
- `public/tracking.js`
- `src/app/layout.tsx`

## Referencias

- [PageSpeed Insights Docs](https://developers.google.com/speed/docs/insights/v5/about)
- [requestIdleCallback API](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestIdleCallback)
- [Next.js Font Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/fonts)
- [Resource Hints (preconnect)](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/rel/preconnect)
