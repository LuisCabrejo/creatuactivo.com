# 📹 Guía de Implementación: Video Fundadores

Esta guía te llevará paso a paso para subir el video 4K optimizado a la página de Fundadores.

## 📋 Prerequisitos Completados

- ✅ FFmpeg instalado
- ✅ @vercel/blob instalado
- ✅ Scripts de optimización creados

---

## 🚀 PASO 1: Optimizar el Video

Coloca tu video 4K original en la carpeta del proyecto y ejecuta:

```bash
# Desde la raíz del proyecto
./scripts/optimize-video.sh [ruta-a-tu-video-4k.mp4]

# Ejemplo:
./scripts/optimize-video.sh ~/Downloads/video-fundadores-original.mp4
```

**Esto generará en `public/videos/`:**
- ✅ `fundadores-1080p.mp4` (~40-60 MB) - **Principal**
- ✅ `fundadores-720p.mp4` (~20-30 MB) - **Móviles**
- ✅ `fundadores-4k.mp4` (~100-150 MB) - **Pantallas grandes**
- ✅ `fundadores-poster.jpg` (~200 KB) - **Imagen de portada**

⏱️ **Tiempo estimado:** 2-5 minutos dependiendo del tamaño original

---

## 🔑 PASO 2: Obtener Token de Vercel Blob

1. **Ve a tu Dashboard de Vercel:**
   ```
   https://vercel.com/dashboard
   ```

2. **Selecciona el proyecto:** `cta-marketing` (o como se llame tu proyecto)

3. **Ve a Storage → Blob:**
   - Click en la pestaña "Blob" en el menú lateral
   - Si no tienes Blob habilitado, click en "Enable Blob"

4. **Genera un Token de lectura/escritura:**
   - Click en "Settings" (dentro de Blob)
   - Click en "Create Token"
   - Nombre sugerido: `video-upload-token`
   - Permisos: **Read & Write**
   - Click en "Create"

5. **Copia el token** (empieza con `vercel_blob_rw_...`)

6. **Exporta la variable de entorno:**
   ```bash
   export BLOB_READ_WRITE_TOKEN="vercel_blob_rw_TU_TOKEN_AQUI"
   ```

---

## 📤 PASO 3: Subir Videos a Vercel Blob

```bash
node scripts/upload-to-blob.mjs
```

**El script te mostrará:**
- ✅ Progreso de subida de cada archivo
- ✅ URLs públicas de cada video
- ✅ Variables de entorno para copiar

**Ejemplo de output:**
```
📤 Subiendo: fundadores-1080p.mp4 (52.3 MB)...
   ✓ Subido: https://xxxxx.public.blob.vercel-storage.com/videos/fundadores-1080p.mp4

📝 Agrega estas variables a tu archivo .env.local:

NEXT_PUBLIC_VIDEO_FUNDADORES_1080P="https://xxxxx.public.blob.vercel-storage.com/videos/fundadores-1080p.mp4"
NEXT_PUBLIC_VIDEO_FUNDADORES_720P="https://xxxxx.public.blob.vercel-storage.com/videos/fundadores-720p.mp4"
NEXT_PUBLIC_VIDEO_FUNDADORES_4K="https://xxxxx.public.blob.vercel-storage.com/videos/fundadores-4k.mp4"
NEXT_PUBLIC_VIDEO_FUNDADORES_POSTER="https://xxxxx.public.blob.vercel-storage.com/videos/fundadores-poster.jpg"
```

⏱️ **Tiempo estimado:** 1-3 minutos dependiendo de tu conexión

---

## ⚙️ PASO 4: Configurar Variables de Entorno

1. **Abre tu archivo `.env.local`:**
   ```bash
   # Desde VSCode o tu editor preferido
   code .env.local
   ```

2. **Agrega las variables** que te mostró el script en el paso anterior:
   ```bash
   # Videos Fundadores - Vercel Blob
   NEXT_PUBLIC_VIDEO_FUNDADORES_1080P="https://..."
   NEXT_PUBLIC_VIDEO_FUNDADORES_720P="https://..."
   NEXT_PUBLIC_VIDEO_FUNDADORES_4K="https://..."
   NEXT_PUBLIC_VIDEO_FUNDADORES_POSTER="https://..."
   ```

3. **Guarda el archivo** (Cmd+S / Ctrl+S)

---

## 🎨 PASO 5: Actualizar Componente Fundadores

El componente `src/app/fundadores/page.tsx` ya tiene el código del video player preparado en las líneas 205-214.

**No necesitas hacer nada más** - el video se renderizará automáticamente usando las variables de entorno que configuraste.

---

## 🧪 PASO 6: Probar en Desarrollo

1. **Reinicia el servidor de desarrollo:**
   ```bash
   # Detén el servidor actual (Ctrl+C) y reinicia
   npm run dev
   ```

2. **Abre el navegador:**
   ```
   http://localhost:3000/fundadores
   ```

3. **Verifica que:**
   - ✅ El video carga (puedes ver el poster)
   - ✅ El video reproduce al hacer click
   - ✅ La calidad se adapta según el dispositivo
   - ✅ El streaming progresivo funciona (reproduce sin esperar descarga completa)

4. **Prueba en diferentes dispositivos (opcional):**
   ```bash
   # DevTools → Toggle Device Toolbar (Cmd+Shift+M)
   # Prueba: iPhone, iPad, Desktop
   ```

---

## 🚀 PASO 7: Deploy a Producción

1. **Commit de cambios:**
   ```bash
   git add .
   git commit -m "feat(fundadores): Agregar video optimizado con Vercel Blob"
   ```

2. **Push a producción:**
   ```bash
   git push origin main
   ```

3. **Vercel detectará el cambio** y hará deploy automáticamente

4. **Verifica en producción:**
   - Ve a tu URL de producción: `https://creatuactivo.com/fundadores`
   - Verifica que el video funciona correctamente

---

## 📊 Monitoreo y Costos

### Ver uso de Vercel Blob:

1. Ve a: https://vercel.com/dashboard
2. Click en tu proyecto
3. Ve a "Storage" → "Blob" → "Usage"

**Costos esperados:**
- Videos totales: ~200 MB de almacenamiento
- Plan Hobby (gratis): 1 GB almacenamiento + 10 GB transferencia/mes
- Si excedes: $0.05/GB de transferencia adicional

**Estimación mensual:**
- 500 vistas/mes × 50 MB promedio = 25 GB transferencia
- Primeros 10 GB gratis
- 15 GB × $0.05 = **~$0.75/mes**

---

## ❓ Troubleshooting

### Error: "BLOB_READ_WRITE_TOKEN no está configurada"
**Solución:** Exporta la variable antes de ejecutar el script:
```bash
export BLOB_READ_WRITE_TOKEN="vercel_blob_rw_..."
node scripts/upload-to-blob.mjs
```

### Error: "No se encontró el archivo"
**Solución:** Ejecuta primero el script de optimización:
```bash
./scripts/optimize-video.sh tu-video.mp4
```

### Video no carga en producción
**Solución:** Verifica que las variables de entorno estén en Vercel:
1. Ve a Vercel Dashboard → Proyecto → Settings → Environment Variables
2. Agrega las mismas variables que pusiste en `.env.local`
3. Redeploy: `git push origin main`

### Video se ve borroso en desktop
**Solución:** El navegador puede estar eligiendo la versión 720p. Verifica:
- Que la versión 4K se haya subido correctamente
- Que el atributo `media` en `<source>` esté correcto
- Considera aumentar el ancho mínimo del breakpoint

### Video tarda mucho en cargar
**Solución:** Verifica que:
- El parámetro `-movflags +faststart` se usó en la optimización
- El CDN de Vercel Blob esté activo (debería ser automático)
- La conexión del usuario sea estable

---

## 🎯 Próximos Pasos (Opcional)

### Analytics de Video:
```tsx
<video
  onPlay={() => console.log('Video reproducido')}
  onPause={() => console.log('Video pausado')}
  onEnded={() => console.log('Video completado')}
>
```

### Lazy Loading:
```tsx
// Cargar video solo cuando esté cerca del viewport
import dynamic from 'next/dynamic';

const VideoPlayer = dynamic(() => import('@/components/VideoPlayer'), {
  ssr: false,
  loading: () => <div>Cargando video...</div>
});
```

### Migrar a next-video + Mux (streaming HLS):
```bash
npx -y next-video init
# Seguir wizard de configuración
```

---

## ✅ Checklist Final

- [ ] FFmpeg instalado y funcionando
- [ ] Video 4K original disponible
- [ ] Ejecutado `optimize-video.sh` correctamente
- [ ] Token de Vercel Blob obtenido
- [ ] Videos subidos a Vercel Blob con `upload-to-blob.mjs`
- [ ] Variables agregadas a `.env.local`
- [ ] Video funciona en desarrollo (localhost:3000/fundadores)
- [ ] Commit y push a producción
- [ ] Video funciona en producción

---

## 📚 Recursos Adicionales

- [Documentación Vercel Blob](https://vercel.com/docs/storage/vercel-blob)
- [FFmpeg Documentation](https://ffmpeg.org/documentation.html)
- [Next.js Video Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/videos)
- [Web Video Best Practices (MDN)](https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Video_codecs)

---

**¿Necesitas ayuda?** Contacta al equipo de desarrollo o revisa los logs en la consola del navegador.
