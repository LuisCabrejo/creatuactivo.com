# 🚀 Quick Start: Subir Video Fundadores

**Todo está listo para que subas tu video 4K.** Sigue estos pasos:

---

## ✅ Lo que ya está instalado:

- ✅ FFmpeg 8.0
- ✅ @vercel/blob
- ✅ Scripts de optimización y subida
- ✅ Componente de video actualizado

---

## 📹 PASOS PARA SUBIR TU VIDEO:

### 1️⃣ Optimizar el video (2-5 minutos)

Coloca tu video 4K en cualquier carpeta y ejecuta:

```bash
./scripts/optimize-video.sh /ruta/a/tu/video-4k.mp4

# Ejemplo si está en Downloads:
./scripts/optimize-video.sh ~/Downloads/video-fundadores.mp4
```

**Esto creará en `public/videos/`:**
- ✅ fundadores-1080p.mp4 (~40-60 MB)
- ✅ fundadores-720p.mp4 (~20-30 MB)
- ✅ fundadores-4k.mp4 (~100-150 MB)
- ✅ fundadores-poster.jpg (~200 KB)

---

### 2️⃣ Obtener token de Vercel Blob (1 minuto)

1. **Ir a:** https://vercel.com/dashboard
2. **Selecciona tu proyecto** (cta-marketing o el nombre que tenga)
3. **Ve a:** Storage → Blob
4. Si no está habilitado, click en **"Enable Blob"**
5. **Ve a Settings** (dentro de Blob)
6. **Click en "Create Token"**
   - Nombre: `video-upload-token`
   - Permisos: **Read & Write**
7. **Copia el token** (empieza con `vercel_blob_rw_...`)

---

### 3️⃣ Exportar token y subir videos (1-3 minutos)

```bash
# Exportar el token (reemplaza con tu token real)
export BLOB_READ_WRITE_TOKEN="vercel_blob_rw_TU_TOKEN_AQUI"

# Subir videos
node scripts/upload-to-blob.mjs
```

**El script te mostrará las URLs de los videos.**

---

### 4️⃣ Agregar URLs a .env.local (30 segundos)

Copia las URLs que te mostró el script y agrégalas a `.env.local`:

```bash
# Abrir archivo
code .env.local

# O con cualquier editor:
nano .env.local
```

Pega las variables que el script te dio:

```bash
# Videos Fundadores - Vercel Blob
NEXT_PUBLIC_VIDEO_FUNDADORES_1080P="https://..."
NEXT_PUBLIC_VIDEO_FUNDADORES_720P="https://..."
NEXT_PUBLIC_VIDEO_FUNDADORES_4K="https://..."
NEXT_PUBLIC_VIDEO_FUNDADORES_POSTER="https://..."
```

**Guarda el archivo** (Cmd+S o Ctrl+S)

---

### 5️⃣ Probar en desarrollo (30 segundos)

```bash
# Reiniciar servidor
npm run dev
```

Abre: http://localhost:3000/fundadores

**Deberías ver el video funcionando!** ✅

---

### 6️⃣ Deploy a producción (1 minuto)

```bash
git add .
git commit -m "feat(fundadores): Agregar video optimizado con Vercel Blob"
git push origin main
```

Vercel hará deploy automáticamente. 🚀

---

## 🆘 ¿Problemas?

### No tengo el token de Vercel
- Ve a: https://vercel.com/dashboard
- Storage → Blob → Settings → Create Token

### El video no aparece en localhost
- Verifica que las variables estén en `.env.local`
- Reinicia el servidor: `npm run dev`

### Error al optimizar video
- Verifica que FFmpeg funcione: `ffmpeg -version`
- Verifica la ruta del video original

### Más ayuda
- Lee el archivo completo: `VIDEO_SETUP_GUIDE.md`

---

## 📊 Costo estimado:

- **Plan Hobby (gratis):** 1 GB almacenamiento + 10 GB transferencia/mes
- **Tu uso:** ~200 MB de videos
- **Costo real:** ~$0.75-$2/mes (después de plan gratis)

---

**¿Listo?** Empieza con el paso 1! 🎬
