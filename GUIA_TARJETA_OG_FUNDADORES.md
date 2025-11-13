# Guía: Tarjeta Open Graph Dinámica para Página Fundadores

## ✅ Implementación Completada

Se creó una **tarjeta de presentación Open Graph dinámica** usando código (Next.js Image Generation). La imagen se genera automáticamente cuando alguien comparte el link de `/fundadores`.

## 🎨 Diseño de la Tarjeta

La tarjeta incluye:
- **Fondo**: Gradiente oscuro (azul slate) con efecto profesional
- **Badge "EXCLUSIVO"**: Superior derecha con gradiente dorado
- **Logo**: CREATUACTIVO.COM en gris claro
- **Título principal**: "Lista Privada FUNDADORES" con gradiente azul→morado→dorado (tu branding)
- **Subtítulo**: "Solo 150 Cupos Disponibles" en blanco grande
- **CTA**: Botón destacado "👑 Sé Fundador Pionero" con gradiente azul-morado
- **Fecha límite**: "⏰ Hasta el 30 de Noviembre 2025" en dorado
- **Footer**: Tres beneficios clave (Framework IAA, Mentoría 1:150, Ecosistema Completo)

### Especificaciones técnicas
- **Dimensiones**: 1200x630 pixels (ratio 1.9:1, estándar Open Graph)
- **Formato**: PNG con transparencia
- **Tamaño**: ~214KB (optimizado)
- **Generación**: Dinámica con Edge Runtime (ultra rápido)

## 📁 Archivos creados/modificados

1. **Nuevo**: `src/app/fundadores/opengraph-image.tsx`
   - Genera la imagen Open Graph dinámicamente
   - Usa tu branding (colores, gradientes)
   - Compatible con WhatsApp, Facebook, Twitter, LinkedIn

2. **Modificado**: `src/app/fundadores/layout.tsx`
   - Simplificado (Next.js detecta automáticamente `opengraph-image.tsx`)
   - Metadatos de título y descripción optimizados

## 🧪 Cómo probar (LOCAL)

### 1. Iniciar servidor de desarrollo

```bash
npm run dev
```

### 2. Ver la imagen directamente en el navegador

Abrir en el navegador:
```
http://localhost:3000/fundadores/opengraph-image
```

Verás la tarjeta generada en tiempo real.

### 3. Ver cómo se renderiza en la página

Abrir en el navegador:
```
http://localhost:3000/fundadores
```

Inspeccionar HTML (F12 → Elements) y buscar:
```html
<meta property="og:image" content="http://localhost:3000/fundadores/opengraph-image" />
```

## 🚀 Deployment a Producción

### 1. Commit y push

```bash
git add src/app/fundadores/
git commit -m "✨ Agregar tarjeta Open Graph dinámica para /fundadores"
git push origin main
```

Vercel desplegará automáticamente.

### 2. Verificar imagen en producción

Una vez desplegado, abrir en el navegador:
```
https://creatuactivo.com/fundadores/opengraph-image
```

Deberías ver la tarjeta generada.

### 3. Limpiar cache de redes sociales

**IMPORTANTE**: Las plataformas cachean las tarjetas Open Graph. Después del deploy, debes limpiar el cache.

#### WhatsApp (móvil)
1. Compartir link en chat de prueba
2. WhatsApp descarga la nueva tarjeta automáticamente
3. Si muestra la vieja, esperar 5-10 minutos (cache CDN)

#### Facebook
1. Ir a: https://developers.facebook.com/tools/debug/
2. Pegar: `https://creatuactivo.com/fundadores`
3. Clic en **"Scrape Again"** o **"Fetch new information"**
4. Verificar que muestre la nueva imagen

#### Twitter/X
1. Ir a: https://cards-dev.twitter.com/validator
2. Pegar: `https://creatuactivo.com/fundadores`
3. Clic en **"Preview card"**

#### LinkedIn
1. Ir a: https://www.linkedin.com/post-inspector/
2. Pegar: `https://creatuactivo.com/fundadores`
3. Clic en **"Inspect"**

## 📱 Resultado en WhatsApp

Cuando compartes `https://creatuactivo.com/fundadores`, se verá así:

```
┌─────────────────────────────────────┐
│                                     │
│  ⚡ EXCLUSIVO (badge dorado)         │
│                                     │
│      CREATUACTIVO.COM               │
│                                     │
│      Lista Privada                  │
│      FUNDADORES                     │
│   (gradiente azul→morado→dorado)    │
│                                     │
│  Solo 150 Cupos Disponibles         │
│                                     │
│  [ 👑 Sé Fundador Pionero ]         │
│   (botón azul-morado)               │
│                                     │
│  ⏰ Hasta el 30 de Noviembre 2025   │
│                                     │
│  🚀 Framework IAA | 💼 Mentoría     │
│  1:150 | 🎯 Ecosistema Completo     │
│                                     │
├─────────────────────────────────────┤
│ creatuactivo.com                    │
└─────────────────────────────────────┘
```

## 🎯 Ventajas de usar código para la tarjeta

1. **Texto grande y legible** - No hay problema de apiñamiento
2. **Actualización automática** - Cambia el código, cambia la imagen
3. **Consistencia de branding** - Usa los mismos colores/gradientes del sitio
4. **Sin herramientas de diseño** - No necesitas Photoshop/Canva
5. **Versionamiento** - Todo en Git, puedes ver historial de cambios

## 🔧 Cómo modificar el diseño

Editar el archivo `src/app/fundadores/opengraph-image.tsx`:

### Cambiar colores
```tsx
// Buscar:
background: 'linear-gradient(135deg, #1E40AF 0%, #7C3AED 50%, #F59E0B 100%)'

// Cambiar a tus colores:
background: 'linear-gradient(135deg, #TU_COLOR1 0%, #TU_COLOR2 100%)'
```

### Cambiar texto
```tsx
// Buscar la línea que quieres cambiar:
Solo 150 Cupos Disponibles

// Cambiar a:
¡Últimos 50 Cupos!
```

### Cambiar tamaños de fuente
```tsx
// Buscar:
fontSize: 72

// Cambiar a:
fontSize: 90  // Más grande
fontSize: 60  // Más pequeño
```

Después de cualquier cambio:
1. Guardar el archivo
2. Recargar `http://localhost:3000/fundadores/opengraph-image` en el navegador
3. Ver cambios en tiempo real

## 🚨 Solución de problemas

### Problema: La imagen no se actualiza en WhatsApp

**Causa**: Cache agresivo de WhatsApp (hasta 7 días)

**Solución**:
1. Esperar 10-15 minutos después del deploy
2. Probar con un link que tenga parámetro: `https://creatuactivo.com/fundadores?v=2`
3. WhatsApp ignora el parámetro pero lo trata como URL nueva

### Problema: Error al generar la imagen

**Causa**: Sintaxis JSX incorrecta o estilos no soportados

**Solución**:
1. Verificar que todos los `<div>` con múltiples hijos tengan `display: 'flex'`
2. No usar propiedades CSS no soportadas (ej: `z-index` sin unidad)
3. Ver logs de Vercel: Dashboard → Functions → Logs

### Problema: Imagen se ve diferente en diferentes plataformas

**Causa**: Cada plataforma recorta/escala diferente

**Solución**:
- La dimensión 1200x630 (ratio 1.9:1) es el estándar
- Mantener contenido importante en el centro
- Evitar texto cerca de los bordes (60px padding mínimo)

## 📊 Mejoras futuras (opcionales)

### 1. Contador dinámico de cupos

Actualizar la imagen con cupos reales disponibles:

```tsx
// En opengraph-image.tsx, agregar:
const cuposDisponibles = await getCuposFromDatabase()

// Y mostrar:
Solo {cuposDisponibles} Cupos Disponibles
```

### 2. A/B Testing

Crear múltiples versiones y medir CTR:
- `opengraph-image.tsx` (versión A)
- `opengraph-image-alt.tsx` (versión B)

Alternar según parámetro URL.

### 3. Personalización por referido

Mostrar nombre del constructor que refiere:

```tsx
// Leer parámetro ?ref=nombre
// Mostrar: "Invitación de [Nombre]"
```

## 🔗 Referencias útiles

- [Next.js OG Image Generation](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image)
- [Open Graph Protocol](https://ogp.me/)
- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- [Vercel OG (@vercel/og)](https://vercel.com/docs/functions/edge-functions/og-image-generation)

## ✅ Checklist de deployment

- [x] Archivo `opengraph-image.tsx` creado
- [x] Layout simplificado (Next.js detecta automáticamente la imagen)
- [x] Imagen se genera correctamente en local
- [ ] Commit y push a repositorio
- [ ] Deploy automático completado en Vercel
- [ ] Verificar imagen en `https://creatuactivo.com/fundadores/opengraph-image`
- [ ] Limpiar cache en Facebook Debugger
- [ ] Limpiar cache en Twitter Card Validator
- [ ] Probar compartir en WhatsApp
- [ ] Verificar en diferentes dispositivos (móvil/desktop)

---

**Fecha de implementación**: 12 Nov 2025
**Desarrollado por**: Claude Code
**Versión**: 2.0 (Imagen dinámica con código)
