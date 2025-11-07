# Pruebas de Optimizaciones PageSpeed

**Fecha**: 2025-11-07
**Estado**: ✅ Optimizaciones implementadas - Listo para testing

## ✅ Cambios Implementados

### 1. tracking.js - Carga Diferida Inteligente
- ✅ Stub inmediato de `window.FrameworkIAA`
- ✅ Lectura de localStorage para fingerprint (sin API call blocking)
- ✅ `requestIdleCallback` para diferir `identify_prospect`
- ✅ Timeout de 2 segundos para garantizar ejecución

### 2. layout.tsx - Optimizaciones de Carga
- ✅ `defer` en script de tracking.js
- ✅ `preconnect` para Supabase
- ✅ `dns-prefetch` como fallback
- ✅ Font optimization con `display: swap`

## 🧪 Checklist de Pruebas

### Prueba 1: Verificar Stub Inmediato ✓

**Objetivo**: Confirmar que `window.FrameworkIAA` existe inmediatamente

**Pasos**:
1. Abrir Chrome DevTools (F12)
2. Ir a la pestaña Console
3. Recargar la página (Cmd+R / Ctrl+R)
4. **Inmediatamente** después de cargar, escribir en consola:
   ```javascript
   window.FrameworkIAA
   ```

**Resultado esperado**:
```javascript
{
  fingerprint: "pending_1699..." o "abc123...",  // Del localStorage
  constructorRef: null,
  prospect: null,
  ready: false,
  error: null,
  whenReady: ƒ
}
```

**✅ PASS si**: El objeto existe inmediatamente
**❌ FAIL si**: Muestra `undefined`

---

### Prueba 2: Verificar identify_prospect Diferido ✓

**Objetivo**: Confirmar que la llamada a Supabase NO bloquea el render

**Pasos**:
1. Abrir Chrome DevTools → Network tab
2. Filtrar por "identify_prospect"
3. Recargar la página
4. Observar **cuándo** se hace la llamada a Supabase

**Resultado esperado**:
- La llamada aparece **DESPUÉS** de que la página esté visible
- El waterfall muestra que NO está en el critical path
- Debe haber ~100-500ms de delay desde el inicio

**Consola debe mostrar**:
```
⚡ FrameworkIAA stub creado (optimizado)
⚡ Ejecutando identify_prospect en idle callback  // <-- DESPUÉS del render
✅ Datos recibidos de identify_prospect
```

**✅ PASS si**: La llamada es diferida
**❌ FAIL si**: La llamada ocurre inmediatamente (blocking)

---

### Prueba 3: Verificar NEXUS Funciona ✓

**Objetivo**: Confirmar que NEXUS puede enviar mensajes sin errores

**Pasos**:
1. Esperar a que la página cargue completamente
2. Abrir el widget NEXUS (botón flotante)
3. Enviar un mensaje de prueba: "Hola"
4. Revisar consola en busca de errores

**Resultado esperado**:
```javascript
// En consola
✅ [NEXUS Widget] Fingerprint obtenido: abc123...
📤 Enviando mensaje a NEXUS...
✅ Response recibido
```

**✅ PASS si**:
- No hay errores de fingerprint
- El mensaje se envía correctamente
- NEXUS responde

**❌ FAIL si**:
- Mensaje "CRÍTICO: Request sin fingerprint"
- Errores en la petición

---

### Prueba 4: Verificar Preconnect ✓

**Objetivo**: Confirmar que el DNS resolution de Supabase está optimizado

**Pasos**:
1. Abrir Chrome DevTools → Network tab
2. Recargar página con cache disabled (Cmd+Shift+R)
3. Buscar la llamada a `identify_prospect`
4. Ver columna "Timing"

**Resultado esperado**:
- **DNS Lookup**: ~0ms (debería ser casi instantáneo gracias a preconnect)
- **Initial Connection**: Reducido significativamente

**✅ PASS si**: DNS lookup < 10ms
**❌ FAIL si**: DNS lookup > 50ms

---

### Prueba 5: PageSpeed Insights - CRÍTICA ✓

**Objetivo**: Medir mejora real en PageSpeed Insights

**Pasos**:
1. Ir a: https://pagespeed.web.dev/
2. Analizar la URL de producción: `https://creatuactivo.com`
3. Esperar resultados completos (toma 1-2 minutos)
4. Revisar las secciones:
   - **Render-blocking resources**
   - **LCP (Largest Contentful Paint)**
   - **FCP (First Contentful Paint)**
   - **Critical Request Chain**

**Resultados ANTES de optimizaciones**:
```
❌ Render-blocking: tracking.js (570ms)
❌ LCP: ~2.5s
❌ FCP: ~1.5s
❌ Critical Chain: 1,020ms
```

**Resultados ESPERADOS después**:
```
✅ Render-blocking: 0ms (o solo CSS de Next.js ~190ms)
✅ LCP: < 1.5s (mejora ~40%)
✅ FCP: < 1.0s (mejora ~33%)
✅ Critical Chain: Eliminated
```

**✅ PASS si**:
- tracking.js NO aparece en "render-blocking resources"
- LCP mejoró al menos 30%

**❌ FAIL si**:
- tracking.js sigue apareciendo como blocking
- LCP sin mejora significativa

---

## 🔍 Debugging si algo falla

### Error: "CRÍTICO: Request sin fingerprint"

**Causa**: El stub no se creó correctamente

**Solución**:
1. Verificar que tracking.js se carga (buscar en Network tab)
2. Verificar consola en busca de errores de sintaxis
3. Verificar que `defer` está presente en el script tag

**Verificar manualmente**:
```bash
curl https://creatuactivo.com | grep 'tracking.js'
# Debe mostrar: <script src="/tracking.js" defer="">
```

---

### Error: identify_prospect falla

**Causa posible**: Problemas con Supabase RPC

**Solución**:
1. Verificar que `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` están configuradas
2. Revisar logs de Supabase Dashboard
3. Verificar que la función RPC `identify_prospect` existe en Supabase

**Test manual**:
```bash
curl -X POST https://cvadzbmdypnbrbnkznpb.supabase.co/rest/v1/rpc/identify_prospect \
  -H "Content-Type: application/json" \
  -H "apikey: YOUR_ANON_KEY" \
  -d '{"p_fingerprint":"test","p_cookie":"test","p_url":"test","p_device":{}}'
```

---

### Error: tracking.js sigue bloqueando en PageSpeed

**Causa posible**: El `defer` no se aplicó correctamente

**Solución**:
1. Verificar que los cambios están en producción (deploy completo)
2. Limpiar cache de Vercel/CDN
3. Verificar con curl que el HTML tiene `defer`:

```bash
curl -s https://creatuactivo.com | grep -o 'tracking.js[^<]*'
# Debe mostrar: tracking.js" defer="">
```

---

## 📊 Monitoreo Continuo

### Herramientas recomendadas:

1. **PageSpeed Insights**: https://pagespeed.web.dev/
   - Analizar mensualmente
   - Target: Score > 90

2. **Web Vitals Chrome Extension**:
   - Instalar: https://chrome.google.com/webstore/detail/web-vitals/
   - Monitorear en tiempo real

3. **Google Search Console**:
   - Core Web Vitals report
   - Verificar semanalmente

4. **Supabase Dashboard**:
   - Edge Functions logs
   - RPC call statistics
   - Verificar que `identify_prospect` sigue funcionando

---

## 🚀 Deploy Checklist

Antes de hacer deploy a producción:

- [ ] ✅ Todas las pruebas locales pasan
- [ ] ✅ NEXUS funciona correctamente
- [ ] ✅ No hay errores en consola
- [ ] ✅ Commit con mensaje descriptivo
- [ ] ✅ Variables de entorno configuradas en Vercel
- [ ] ✅ Documentación actualizada (CLAUDE.md)

**Comando para deploy**:
```bash
# Commit changes
git add public/tracking.js src/app/layout.tsx
git commit -m "⚡ Optimize PageSpeed: defer tracking.js + preconnect Supabase"

# Push to production
git push origin main
```

**Post-deploy**:
- Esperar 2-3 minutos para que Vercel complete el deploy
- Limpiar cache del navegador (Cmd+Shift+Delete)
- Ejecutar todas las pruebas nuevamente en producción
- Analizar con PageSpeed Insights (esperar 5 minutos para que cache se limpie)

---

## 📈 Métricas de Éxito

### Core Web Vitals Target:

- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1

### Performance Score Target:

- **Mobile**: > 85
- **Desktop**: > 95

### Render-blocking Target:

- **tracking.js**: 0ms (eliminated)
- **Total blocking time**: < 300ms

---

## 🔄 Rollback si es necesario

Si algo sale mal en producción:

```bash
# Ver último commit
git log -1

# Revertir cambios
git revert HEAD

# Deploy del revert
git push origin main
```

**Archivos para backup manual** (antes de deploy):
1. `public/tracking.js` (versión anterior)
2. `src/app/layout.tsx` (versión anterior)

---

## 📝 Notas Adicionales

### Compatibilidad requestIdleCallback

**Navegadores compatibles**:
- ✅ Chrome 47+
- ✅ Edge 79+
- ✅ Firefox 55+
- ✅ Safari 14+

**Fallback**: Si `requestIdleCallback` no existe, usa `setTimeout(..., 0)` (ya implementado)

### Impacto en SEO

Las optimizaciones de PageSpeed tienen impacto directo en:
- **Rankings de Google** (Core Web Vitals es factor de ranking)
- **Tasa de conversión** (usuarios abandonan sitios lentos)
- **Mobile experience** (especialmente importante)

**Meta**: Lograr 90+ en mobile para maximizar SEO.

---

## ✅ Conclusión

Con estas optimizaciones, esperamos:
- ✅ **-52% en LCP** (~2.5s → ~1.2s)
- ✅ **-100% en render-blocking** (570ms → 0ms)
- ✅ **Mejor experiencia de usuario**
- ✅ **Mejor ranking en Google**

**Próximos pasos sugeridos** (futuro):
1. Implementar lazy loading de imágenes
2. Optimizar CSS con critical CSS extraction
3. Implementar service worker para caching
4. Considerar CDN para assets estáticos

---

**Documento creado**: 2025-11-07
**Autor**: Claude Code
**Versión**: 1.0
