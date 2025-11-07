# Google Search Console - Guía de Configuración

**Fecha**: 2025-11-07
**Proyecto**: CreaTuActivo Marketing Platform
**Objetivo**: Implementar Google Search Console para visibilidad SEO y monitoreo de indexación

---

## 📋 Resumen de Implementación

Se han implementado los siguientes componentes para Google Search Console:

✅ **Sitemap dinámico** - [src/app/sitemap.ts](src/app/sitemap.ts)
✅ **Robots.txt dinámico** - [src/app/robots.ts](src/app/robots.ts)
✅ **Meta tag de verificación** - [src/app/layout.tsx](src/app/layout.tsx)
✅ **Structured data mejorado** - JSON-LD enriquecido con Offer, ContactPoint
✅ **Variable de entorno** - `.env.example` actualizado

---

## 🚀 Paso a Paso: Configuración de Google Search Console

### PASO 1: Verificar que los archivos se generaron correctamente

**Build del proyecto** para generar sitemap.xml y robots.txt:

```bash
npm run build
```

**Verificar en local**:

```bash
# Sitemap debe estar disponible en:
curl http://localhost:3000/sitemap.xml

# Robots.txt debe estar disponible en:
curl http://localhost:3000/robots.txt
```

**Salida esperada del sitemap.xml**:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://creatuactivo.com</loc>
    <lastmod>2025-11-07</lastmod>
    <changeFrequency>weekly</changeFrequency>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://creatuactivo.com/fundadores</loc>
    <lastmod>2025-11-07</lastmod>
    <changeFrequency>daily</changeFrequency>
    <priority>0.95</priority>
  </url>
  <!-- ... 20+ URLs más -->
</urlset>
```

**Salida esperada del robots.txt**:
```
User-agent: *
Allow: /
Disallow: /api/
Disallow: /dashboard/
Disallow: /admin/
Disallow: /_next/
Disallow: /private/
Disallow: /*.json$
Disallow: /tracking.js

Sitemap: https://creatuactivo.com/sitemap.xml
```

---

### PASO 2: Deploy a Producción

**Opción A: Deploy desde Git (recomendado)**

```bash
# Commit de los cambios
git add src/app/sitemap.ts src/app/robots.ts src/app/layout.tsx .env.example
git commit -m "🔍 Add Google Search Console: sitemap, robots.txt, verification meta tag"
git push origin main
```

Vercel detectará automáticamente los cambios y hará deploy.

**Opción B: Deploy manual desde CLI**

```bash
npx vercel --prod
```

**Verificar en producción**:

```bash
# Sitemap
curl https://creatuactivo.com/sitemap.xml

# Robots.txt
curl https://creatuactivo.com/robots.txt
```

---

### PASO 3: Crear Cuenta de Google Search Console

1. **Ir a Google Search Console**:
   - URL: https://search.google.com/search-console

2. **Iniciar sesión** con tu cuenta de Google (usa una cuenta corporativa si es posible)

3. **Agregar propiedad**:
   - Click en "Agregar propiedad"
   - Selecciona **"Prefijo de URL"** (no "Dominio")
   - Ingresa: `https://creatuactivo.com`
   - Click en "Continuar"

---

### PASO 4: Verificar Propiedad (Método HTML Tag)

Google te mostrará varios métodos de verificación. Usa el método **"Etiqueta HTML"**:

1. **Copiar código de verificación**:
   - En GSC, selecciona "Etiqueta HTML"
   - Verás algo como: `<meta name="google-site-verification" content="ABC123XYZ789..." />`
   - Copia solo el valor de `content` (ejemplo: `ABC123XYZ789...`)

2. **Agregar a .env.local**:

```bash
# En tu archivo .env.local (NO commitear este archivo)
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=ABC123XYZ789...
```

3. **Agregar a Vercel Dashboard**:
   - Ve a tu proyecto en Vercel Dashboard
   - Settings → Environment Variables
   - Agregar nueva variable:
     - **Key**: `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`
     - **Value**: `ABC123XYZ789...` (el código que copiaste)
     - **Environments**: Production, Preview, Development (marca todos)
   - Click "Save"

4. **Redeploy en Vercel** (para que tome la nueva variable):
   - Ve a Deployments en Vercel Dashboard
   - Click en "..." de la última deployment → "Redeploy"
   - O simplemente haz otro push a Git

5. **Verificar que el meta tag está presente**:

```bash
curl https://creatuactivo.com | grep google-site-verification
```

Deberías ver:
```html
<meta name="google-site-verification" content="ABC123XYZ789..."/>
```

6. **Volver a Google Search Console y hacer click en "Verificar"**

✅ Si todo está correcto, verás: **"Propiedad verificada"**

---

### PASO 5: Enviar Sitemap a Google Search Console

Una vez verificada la propiedad:

1. **En el panel izquierdo de GSC**, click en **"Sitemaps"**

2. **Agregar nuevo sitemap**:
   - En el campo "Agregar un nuevo sitemap", ingresa: `sitemap.xml`
   - Click en "Enviar"

3. **Verificar estado**:
   - Deberías ver "Correcto" en el estado del sitemap
   - Google comenzará a rastrear las 20+ URLs

**Nota**: Google puede tardar 24-48 horas en procesar completamente el sitemap.

---

## 📊 Qué Puedes Monitorear en Google Search Console

Una vez configurado, podrás ver:

### 1. **Rendimiento** (Disponible en 2-3 días)
- **Consultas**: Qué buscan los usuarios en Google antes de llegar a tu sitio
- **Impresiones**: Cuántas veces apareciste en resultados de búsqueda
- **Clics**: Cuántas veces hicieron click
- **CTR**: Porcentaje de clics (Clics / Impresiones)
- **Posición promedio**: En qué posición apareces en los resultados

### 2. **Cobertura de Índice**
- Páginas indexadas vs no indexadas
- Errores de rastreo (404, 500, timeouts)
- Páginas bloqueadas por robots.txt

### 3. **Core Web Vitals**
- LCP (Largest Contentful Paint)
- FID (First Input Delay) / INP (Interaction to Next Paint)
- CLS (Cumulative Layout Shift)
- Comparación móvil vs desktop

### 4. **Experiencia en la Página**
- HTTPS (✅ Ya tienes)
- Usabilidad móvil
- Anuncios intrusivos (si los hay)

### 5. **Rich Results (Resultados Enriquecidos)**
- Validación de Schema.org (Organization, Offer)
- Preview de cómo apareces en Google

---

## 🔍 URLs Incluidas en el Sitemap

El sitemap incluye **24 URLs públicas** con prioridades optimizadas:

| Ruta | Prioridad | Change Frequency | Notas |
|------|-----------|------------------|-------|
| `/` | 1.0 | weekly | Homepage |
| `/fundadores` | 0.95 | **daily** | Alta conversión + contador dinámico |
| `/presentacion-empresarial` | 0.9 | monthly | Landing principal |
| `/paquetes`, `/planes` | 0.9 | weekly | Conversión |
| `/ecosistema/*` (3 páginas) | 0.8-0.85 | weekly | Framework IAA |
| `/sistema/*` (4 páginas) | 0.7-0.85 | monthly | Información técnica |
| `/soluciones/*` (6 páginas) | 0.75 | monthly | Arquetipos de usuarios |
| `/modelo-de-valor` | 0.8 | monthly | Propuesta de valor |
| `/privacidad` | 0.3 | yearly | Legal |

**URLs NO incluidas** (por diseño):
- Rutas con `[ref]` - Son variaciones con tracking de referidos
- `/api/*` - Bloqueadas en robots.txt
- `/dashboard/*`, `/admin/*` - No existen aún, pero están pre-bloqueadas

---

## 🚫 Rutas Bloqueadas en robots.txt

Para proteger tu plataforma y evitar rastreo innecesario:

```
Disallow: /api/              # Endpoints de API (NEXUS, fundadores, etc.)
Disallow: /dashboard/        # Panel administrativo (futuro)
Disallow: /admin/            # Área administrativa
Disallow: /_next/            # Archivos internos de Next.js
Disallow: /private/          # Contenido privado
Disallow: /*.json$           # Archivos JSON directos
Disallow: /tracking.js       # Script de tracking (no necesita indexarse)
```

**IMPORTANTE**: Si en el futuro creas un proyecto Dashboard (como `cta-Dashboard`), este debe estar en un dominio/subdominio separado y NO dentro de `src/app/` del proyecto Marketing.

---

## 🧪 Testing y Validación

### Test 1: Validar Sitemap

Usa la herramienta de Google:
- URL: https://search.google.com/test/rich-results
- Ingresa: `https://creatuactivo.com/sitemap.xml`
- Verifica que no hay errores

### Test 2: Validar Structured Data

- URL: https://validator.schema.org/
- Ingresa: `https://creatuactivo.com`
- Debe validar el JSON-LD de Organization con Offer

### Test 3: Simular Googlebot

```bash
curl -A "Googlebot" https://creatuactivo.com/fundadores
```

Verifica que la página se carga correctamente.

### Test 4: Verificar Robots.txt

```bash
curl https://creatuactivo.com/robots.txt
```

Debe mostrar las reglas de bloqueo.

---

## 🔄 Mantenimiento

### Actualizar Sitemap Cuando Agregues Nuevas Páginas

1. Edita [src/app/sitemap.ts](src/app/sitemap.ts)
2. Agrega la nueva URL con su prioridad y frecuencia
3. Actualiza `lastModified` a la fecha actual
4. Commit y push

**Ejemplo**:

```typescript
{
  url: `${baseUrl}/nueva-pagina`,
  lastModified: new Date('2025-11-15'), // Fecha de creación
  changeFrequency: 'monthly',
  priority: 0.75,
},
```

### Actualizar Fechas Importantes

Cuando cambien las fechas del programa Fundadores:

1. Edita [src/app/layout.tsx](src/app/layout.tsx) (JSON-LD, líneas 163-164)
2. Actualiza `validFrom` y `validThrough` en el `Offer`
3. Commit y push

---

## 📈 KPIs a Monitorear (Después de 1-2 Semanas)

| Métrica | Objetivo | Dónde verlo en GSC |
|---------|----------|-------------------|
| **Páginas indexadas** | 20+ URLs | Cobertura → Válidas |
| **Impresiones mensuales** | 1,000+ | Rendimiento → Total de impresiones |
| **CTR promedio** | >3% | Rendimiento → CTR promedio |
| **Posición promedio** | <30 | Rendimiento → Posición promedio |
| **Core Web Vitals (móvil)** | 80%+ buenas URLs | Experiencia → Core Web Vitals |

---

## 🆘 Troubleshooting

### Problema: "Sitemap no se puede leer"

**Causa**: El archivo sitemap.xml no está siendo generado.

**Solución**:
```bash
npm run build  # Regenerar build
npm start      # Verificar en http://localhost:3000/sitemap.xml
```

### Problema: "Error de verificación de propiedad"

**Causa**: La variable `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` no está configurada correctamente.

**Solución**:
1. Verificar que la variable esté en Vercel Dashboard
2. Redeploy después de agregar la variable
3. Verificar que el meta tag esté en el HTML: `curl https://creatuactivo.com | grep google-site-verification`

### Problema: "URLs bloqueadas por robots.txt"

**Causa**: Puede haber un conflicto con metadata en layout.tsx.

**Solución**:
Verifica que `robots` en metadata NO tenga `index: false`:

```typescript
// En src/app/layout.tsx
robots: {
  index: true,  // ✅ Debe ser true
  follow: true, // ✅ Debe ser true
}
```

### Problema: "Páginas con errores 404"

**Causa**: URLs en sitemap.ts que no existen realmente.

**Solución**:
1. Verificar que todas las rutas en sitemap.ts existen en `src/app/`
2. Eliminar del sitemap las rutas que no existen

---

## 📚 Recursos Adicionales

- **Google Search Console**: https://search.google.com/search-console
- **Next.js Metadata API**: https://nextjs.org/docs/app/api-reference/functions/generate-metadata
- **Next.js Sitemap**: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
- **Schema.org Organization**: https://schema.org/Organization
- **Schema.org Offer**: https://schema.org/Offer

---

## ✅ Checklist de Configuración Completa

- [ ] Build del proyecto ejecutado (`npm run build`)
- [ ] Sitemap.xml accesible en producción
- [ ] Robots.txt accesible en producción
- [ ] Cuenta de Google Search Console creada
- [ ] Propiedad verificada con método HTML Tag
- [ ] Variable `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` en Vercel
- [ ] Sitemap enviado a GSC
- [ ] Esperar 24-48 horas para ver datos
- [ ] Verificar páginas indexadas en GSC → Cobertura
- [ ] Configurar alertas de errores en GSC (opcional)

---

## 🎯 Próximos Pasos (Opcionales)

Una vez que Google Search Console esté funcionando y tengas datos (1-2 semanas):

1. **Analizar keywords**: Ver qué términos traen más tráfico
2. **Optimizar títulos y descripciones**: Basado en CTR real
3. **Evaluar Google Analytics 4**: Solo si necesitas demografía o embudos
4. **Rich Snippets**: Agregar FAQPage schema si creas una sección de preguntas frecuentes

---

**Fecha de última actualización**: 2025-11-07
**Autor**: Claude Code Assistant
**Proyecto**: CreaTuActivo Marketing Platform
