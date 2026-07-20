# HANDOFF — Auditoría de léxico en las "tarjetas" de los Reels

**Para:** agente de continuación
**De:** sesión Claude Code (19 jun 2026)
**Estado:** listo para ejecutar
**Disparador:** Luis comparte los enlaces de reels y ve **léxico viejo** en la tarjeta de previsualización (el card que aparece al pegar el link en WhatsApp / redes) y/o en el copy de la página.

---

## 1. Objetivo

Revisar y migrar al **léxico accesible** (jun 2026) los **datos de la tarjeta de cada reel**:
1. El **preview Open Graph** que se ve al compartir el enlace (title + description + imagen).
2. El **copy en la página** del reel (título serif + cuerpo).

Ambos salen del **mismo lugar**, así que el trabajo se concentra en un archivo.

---

## 2. Contexto técnico — de dónde sale la tarjeta (CLAVE)

**Fuente única de verdad: `REEL_COPY` en [src/lib/reels.ts](../../../src/lib/reels.ts).**

```
REEL_COPY[nicho] = { titulo, cuerpo, audiencia }
```

- **Tarjeta al compartir (OG)** → la genera `generateMetadata` en
  [src/app/[slug]/[destino]/page.tsx](../../../src/app/[slug]/[destino]/page.tsx) (rama `isReelNicho`, ~línea 146):
  - `og:title`  = `REEL_COPY[nicho].titulo`
  - `og:description` = **primer párrafo** de `REEL_COPY[nicho].cuerpo` (`.split('\n\n')[0]`)
  - `og:image`  = poster por-nicho (`REEL_POSTER_OVERRIDE[nicho].posterOg`) — **imagen, sin texto que migrar**
- **Copy en la página** → [src/components/ReelPage.tsx](../../../src/components/ReelPage.tsx) renderiza ese mismo `REEL_COPY[nicho]` (titulo + cuerpo).

➡️ **Editar `REEL_COPY` arregla card + página a la vez.** No hay copy de reel duplicado en otro lado.

Nichos: `corporativo, empleados, empresarios, diaspora, informales, networkers` (`REEL_NICHOS`).

---

## 3. Reglas de léxico (qué migrar)

Fuente de verdad del vocabulario: **CLAUDE.md → "Queswa Vocabulary — Tabla Canónica Unificada"** + la sub-sección **"Léxico del copy" de "Reels por Nicho"**. Resumen operativo:

**Prohibido / migrar:**
| Viejo | Nuevo |
|------|------|
| Estructura Patrimonial | estructura de ingresos recurrentes |
| Base Operativa / Patrimonio Paralelo | empresa digital (a secas) |
| Arquitecto (de Patrimonio) | Propietario (de su empresa digital) |
| Matriz Física / Tridente EAM / Máquina Híbrida / capas | El Respaldo Operativo · El Método Comprobado · 3 pilares |
| vehículo, nodo, soberanía financiera | (reemplazar — ver tabla CLAUDE.md) |
| **"La salida es / Escape de / Sal del"** | reformular (suena a MLM tradicional colombiano) |
| escalar (el activo del usuario) | multiplicar |
| "tres pilares" | **"3 pilares"** |

**Doctrina (el cómo):**
- **Test abuela/Beto:** si un profesional sin MBA no lo entiende, está prohibido. El lujo es la claridad.
- **Atribución:** "su empresa digital" SIN "de Gano Excel" (la corona es de CreaTuActivo; Gano Excel = El Respaldo Operativo).
- **Villano narrado, nunca etiquetado.** "Trabajar más/duro" NO es villano (orgullo latino) — sólo válido si va **negado** ("la respuesta no es trabajar más").
- **NO tocar cifras ni hechos:** 15 países de América, 24 horas, 70 países (Gano), Queswa, método probado.

---

## 4. Hallazgos concretos (punto de partida — NO exhaustivo)

Revisar **los 6 nichos** completos; estos son los que ya saltaron en el grep:

- [src/lib/reels.ts:76](../../../src/lib/reels.ts#L76) (empleados, cuerpo): **"La salida no es trabajar más…"** → reformular ("salida" prohibido).
- [src/lib/reels.ts:82](../../../src/lib/reels.ts#L82) (empresarios, cuerpo): **"La salida es tener algo que sí funcione sin usted…"** → reformular.
- "tres pilares" en [70](../../../src/lib/reels.ts#L70), [82](../../../src/lib/reels.ts#L82), [88](../../../src/lib/reels.ts#L88) → **"3 pilares"**.
- [src/lib/reels.ts:80](../../../src/lib/reels.ts#L80) (empresarios, **titulo** = título de la tarjeta): "…no tiene **un activo**: tiene una **prisión operativa de alto estatus**" → "activo" suelto confunde (ver [[project_lexico_negocio_digital]]); evaluar "prisión operativa" vs. Test Beto.
- [src/lib/reels.ts:68](../../../src/lib/reels.ts#L68) (corporativo, **titulo**): "Su salario resuelve su **liquidez** hoy…" → "liquidez" es técnico; evaluar.
- **networkers** ([98](../../../src/lib/reels.ts#L98)): **ya migrado** (jun 2026) — verificar, no debería tocarse.

> Nota: el copy de cuerpo ya está mayormente migrado a "empresa digital". Lo viejo restante es ligero. Si Luis sigue viendo léxico viejo tras corregir esto, es casi seguro **caché OG** (ver §6).

---

## 5. Fuera de alcance (NO tocar)

- **Comentarios de código y nombres internos**: "arquitecto" aparece en comentarios/variables de [ReelPage.tsx](../../../src/components/ReelPage.tsx) y la ruta — es **interno, no user-facing**. No migrar.
- **Texto quemado en los VIDEOS** (subtítulos / inserts 3D, p. ej. "tres pilares" en el módulo de solución compartido): es otra tarea, requiere **re-render** del reel — ver [[project_reels_3pilares_pendiente]]. NO entra en este handoff.
- **`source` de tracking** y demás identificadores internos.

---

## 6. Despliegue + (CRÍTICO) caché de Meta/WhatsApp

1. `REEL_COPY` es **estático** (no Supabase): editar `reels.ts` → `npm run build` (verificar) → commit → push → Vercel rebuild. **No** requiere re-fragmentar embeddings (no es arsenal).
2. ⚠️ **El card viejo persiste en caché aunque el código ya esté bien.** Tras desplegar, por **cada** URL `https://creatuactivo.com/{slug}/{nicho}` (p. ej. `luis-cabrejo/corporativo`):
   - Re-scrapear en el **[Meta Sharing Debugger](https://developers.facebook.com/tools/debug/)** → botón "Scrape Again" → confirma `og:title`/`og:description` nuevos.
   - WhatsApp cachea aparte (~7 días); el re-scrape de Meta suele refrescarlo. Probar el **share real** en un chat.
   - Esto probablemente explica buena parte de lo que Luis ve.

---

## 7. Criterios de aceptación

- [ ] Los 6 nichos: `titulo` + primer párrafo de `cuerpo` en léxico accesible, sin términos prohibidos, pasan Test Beto.
- [ ] "La salida", "tres pilares", "activo" suelto resueltos.
- [ ] Cifras/hechos intactos (15 países, 24h, Gano, Queswa, método).
- [ ] `npm run build` OK.
- [ ] Card re-scrapeada en Meta muestra el copy nuevo (no el cacheado).
- [ ] networkers sin cambios indebidos.

---

## 8. Referencias

- **CLAUDE.md** → "Queswa Vocabulary — Tabla Canónica Unificada" · "Reels por Nicho (fase orgánica WhatsApp)" · gotcha OG por página.
- Memorias: [[project_lexico_negocio_digital]] · [[feedback_dolor_real_por_nicho]] · [[project_migracion_lexico_accesible]] · [[project_reels_3pilares_pendiente]] · [[feedback_aspiracion_tranquilidad_financiera]].
- Archivos: [src/lib/reels.ts](../../../src/lib/reels.ts) · [src/app/[slug]/[destino]/page.tsx](../../../src/app/[slug]/[destino]/page.tsx) · [src/components/ReelPage.tsx](../../../src/components/ReelPage.tsx).
