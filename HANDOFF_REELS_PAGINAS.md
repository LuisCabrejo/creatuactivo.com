# HANDOFF — Páginas de Reel por Nicho (fase orgánica WhatsApp)

> **Para:** agente Claude Code rooteado en `/Users/luiscabrejo/Cta/marketing` (creatuactivo.com)
> **De:** sesión previa (rooteada en el Dashboard) — Luis + Claude
> **Fecha:** 2026-05-30
> **Estado:** ✅ reels optimizados (140MB→~24MB) y subidos a Blob; `src/lib/reels.ts` YA creado con URLs reales + copy. **Falta SOLO construir las páginas (§4-§5).**

---

## 0. Objetivo

5 reels verticales (uno por nicho) que cada **Arquitecto de Patrimonio** comparte por **WhatsApp** a su mercado orgánico. Cada reel vive en una página `creatuactivo.com/{slug}/{nicho}` con: video inline + copy del nicho + 2 CTA (presentación servilleta en YouTube + WhatsApp del arquitecto) + tracking de referido. **No** se publica Reel nativo en IG/TikTok en esta fase (eso es posterior).

Fase actual = WhatsApp orgánico. El prospecto ve el reel en la página y responde al WhatsApp del arquitecto, o entra a ver la servilleta (presentación de 7 min).

---

## 1. Decisiones ya tomadas (NO re-litigar)

- **URL:** `creatuactivo.com/{slug}/{nicho}` (ruta corta, sin `/reel/`). Convive con `[slug]/[destino]` → hay que **bifurcar** ahí (§4).
- **CTAs:** ambos. Primario = servilleta (YouTube unlisted `xHWZfg6prs8`). Secundario = WhatsApp del arquitecto (`wa.me`).
- **Hosting:** Vercel **Blob** por ahora (reels optimizados ~40-60MB). Migrar a Bunny Stream solo cuando el egress lo justifique. Servilleta NO se auto-hospeda → YouTube.
- **Coexistencia:** los flyers (imágenes) se mantienen; reels NO los reemplazan.
- **Léxico:** usted · Lujo Clínico / Quiet Luxury · Estructura Patrimonial, Base Operativa, 3 pilares. Prohibido: vehículo (negocio), red (MLM), patrimonio paralelo, capas, Máquina Híbrida.

## Los 5 nichos
| Slug (`{nicho}`) | Reel | Archivo crudo | Audiencia |
|------------------|------|---------------|-----------|
| `corporativo`  | A — Devaluación Corporativa | `corporativo.mp4`  | Empleado corporativo / ejecutivo |
| `empleados`    | B — Ilusión de Estabilidad  | `empleados.mp4`    | Empleado del Estado / sector público |
| `empresarios`  | C — Prisión Operativa       | `empresarios.mp4`  | Empresario / dueño de negocio |
| `diaspora`     | D — Trampa de la Diáspora   | `diaspora.mp4`     | Latinos en el exterior |
| `informales`   | E — Economía Popular        | `informales.mp4`   | Trabajador independiente / informal |

**Copy de cada página (títulos + texto, versión final de Luis):** `public/videos/reels/COPY_PAGINAS.md`.

---

## 2. Assets de video — Blob (PRIMERO: verificar que terminó)

Los reels crudos pesan ~140MB (1080×1920, H.264, ~2 min, 9.45 Mbps). **Se optimizan a ~40-60MB antes de servir** (inline en LATAM móvil sería inviable con 140MB).

Scripts creados (en `scripts/`):
- `optimize-reels.sh` → genera `{nicho}-web.mp4` (CRF 23, faststart) + `{nicho}-poster.jpg` (<250KB, para OG WhatsApp).
- `upload-reels-to-blob.mjs` → sube `*-web.mp4` + `*-poster.jpg` a Blob (`reels/{nicho}.mp4`, `reels/{nicho}-poster.jpg`) e imprime el mapa `REEL_ASSETS`.

**Acción:**
1. Verifica si la subida ya corrió (la sesión previa la lanzó en background). Si no hay URLs, ejecuta:
   ```bash
   bash scripts/optimize-reels.sh && node scripts/upload-reels-to-blob.mjs
   ```
2. Toma el `REEL_ASSETS` que imprime y créalo en **`src/lib/reels.ts`** junto con el copy:
   ```ts
   // src/lib/reels.ts
   export const REEL_ASSETS = { /* salida del script: { video, poster } por nicho */ }
   export const REEL_COPY: Record<string, { titulo: string; cuerpo: string; audiencia: string }> = {
     corporativo: { ... },  // de COPY_PAGINAS.md
     empleados:   { ... },
     empresarios: { ... },
     diaspora:    { ... },
     informales:  { ... },
   }
   export const REEL_NICHOS = ['corporativo','empleados','empresarios','diaspora','informales'] as const
   export const SERVILLETA_YOUTUBE_ID = 'xHWZfg6prs8'
   ```

---

## 3. Datos del arquitecto (ya existen en Supabase)

`[slug]/page.tsx` ya resuelve esto — reúsalo:
- Tabla `constructor_slugs`: `slug, display_name, foto_url, frase_personal, whatsapp, constructor_id`
- Tabla `private_users`: `affiliation_link, profile_photo_url`
- WhatsApp CTA: `https://wa.me/${whatsapp.replace(/\D/g,'')}?text=...` (ver el patrón en `[slug]/page.tsx`).

---

## 4. Integración de routing (el punto delicado)

`creatuactivo.com/{slug}/{nicho}` cae en el MISMO archivo que el redirect existente: `src/app/[slug]/[destino]/page.tsx`. Hay que **bifurcar**:

```ts
// src/app/[slug]/[destino]/page.tsx
import { REEL_NICHOS } from '@/lib/reels'

export default async function DestinoRoute({ params }) {
  const { slug, destino } = params
  // resolver constructor desde el slug (ya existe)
  if ((REEL_NICHOS as readonly string[]).includes(destino)) {
    return <ReelPage slug={slug} nicho={destino} constructor={...} />  // RENDER, no redirect
  }
  // ... DESTINO_MAP redirect existente (intacto)
}

export async function generateMetadata({ params }) {
  if (REEL_NICHOS.includes(params.destino)) {
    // OG de VIDEO para preview reproducible en WhatsApp/Facebook:
    // openGraph.videos[{ url: REEL_ASSETS[nicho].video, type:'video/mp4', width:1080, height:1920 }]
    // openGraph.images[{ url: REEL_ASSETS[nicho].poster }]  ← <250KB
    // title = REEL_COPY[nicho].titulo ; robots index:false
  }
  return { title: 'Redirigiendo... | CreaTuActivo', robots: { index: false } }  // caso redirect
}
```

Cuidado: los slugs de nicho NO chocan con los destinos de `DESTINO_MAP` (auditoria, calculadora, productos, servilleta, home, fundadores, dia-1..5, etc.). Verificar que sigan funcionando los redirects.

---

## 5. Componente `ReelPage` (UI)

Estética **Bimetálica v3.0** (igual que `[slug]/page.tsx` y `/infraestructura`): fondo carbón `#0F1115`, oro champagne `#C5A059` (CTAs), titanio `#94A3B8`. Server Component.

Estructura:
1. **Video 9:16 inline** — `<video controls preload="none" poster={REEL_ASSETS[nicho].poster} src={REEL_ASSETS[nicho].video}>`. `preload="none"` + poster = no descarga hasta que el prospecto toca play (clave para datos móviles).
2. **Título** (`REEL_COPY[nicho].titulo`) + **cuerpo** (`REEL_COPY[nicho].cuerpo`).
3. **CTA primario** (oro): "Ver la presentación completa (7 min)" → abre la servilleta. Opción A: modal con embed `https://www.youtube-nocookie.com/embed/${SERVILLETA_YOUTUBE_ID}?rel=0&modestbranding=1`. Opción B: link a una página dedicada que la embeba. Recomendado: modal liviano in-page.
4. **CTA secundario** (titanio/outline): "Hablar con {primer_nombre}" → `wa.me` del arquitecto con mensaje pre-escrito en usted.
5. Pie sutil con foto/nombre del arquitecto (reusar de `[slug]/page.tsx`).

---

## 6. Checklist de cierre
- [ ] `src/lib/reels.ts` con REEL_ASSETS (de la subida) + REEL_COPY (de COPY_PAGINAS.md)
- [ ] `[slug]/[destino]/page.tsx` bifurca render vs redirect (redirects existentes intactos)
- [ ] `generateMetadata` con OG de video + poster <250KB (probar preview en WhatsApp real)
- [ ] `ReelPage` Bimetálico, video `preload="none"`, 2 CTA
- [ ] Probar `creatuactivo.com/{slug-real}/corporativo` en móvil (iOS + Android)
- [ ] `npm run lint` && `npm run build`
- [ ] Confirmar que `/{slug}/auditoria`, `/servilleta`, etc. siguen redirigiendo bien

## 7. Riesgos / notas
- **Peso:** aún optimizado, 2 min ≈ 40-60MB. `preload="none"` + click-to-play es obligatorio. Si el egress de Blob crece → Bunny Stream (transcodifica adaptativo).
- **Fase posterior (NO ahora):** publicación nativa IG/TikTok (descarga MP4 + deep link), reel generalista 1 min para Estados, Queswa en WhatsApp (cuenta Meta en verificación).
- Brief de investigación completo: `public/contexto/invetigaciones/Distribución de Reels para Arquitectos.md` (en el repo Dashboard).
