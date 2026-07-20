# HANDOFF — Reels Engagement Fase 1 (instrumentación)

> **Para:** agente Claude Code rooteado en `/Users/luiscabrejo/Cta/marketing`
> **Lado Dashboard:** ✅ YA HECHO (webhook lee los campos y dispara push). **No renombrar los campos.**
> **Objetivo:** que el arquitecto sepa el comportamiento del prospecto en la página de reel: cuánto vio del reel, si lo completó, si abrió Queswa, cuánto tiempo estuvo, y si volvió.

---

## 1. Contrato de datos — campos nuevos en `device_info` (JSONB)

Escribir con el RPC existente `update_prospect_data(p_fingerprint_id, p_data, p_constructor_id)` (mismo patrón que `/api/track/video/route.ts`). El merge es aditivo.

| Campo | Tipo | Para qué | Dispara push? |
|-------|------|----------|----------------|
| `reel_nicho`      | string | qué reel (corporativo/empleados/empresarios/diaspora/informales) | no (contexto) |
| `reel_pct`        | number (0-100) | máx % visto del reel | no (timeline) |
| `reel_completed`  | bool | llegó al final | ✅ "Vio el reel completo" |
| `reel_time_s`     | number | segundos activos en la página | no (timeline) |
| `queswa_opened`   | bool | abrió el chat Queswa | ✅ "Abrió Queswa" |
| `queswa_messages` | number | nº de mensajes enviados a Queswa | no (timeline) |
| `visit_count`     | number | nº de sesiones del mismo fingerprint | ✅ "Volvió a visitar" |

⚠️ El webhook del Dashboard ya hace `!oldDI.reel_completed && newDI.reel_completed`, `!oldDI.queswa_opened && newDI.queswa_opened`, y `visit_count > old`. Nombres y semántica son **contrato cerrado**.

---

## 2. Endpoint de reporte

Crear `src/app/api/track/engagement/route.ts` (Edge), modelado en `/api/track/video`:
- Body: `{ fingerprint, nicho, pct?, completed?, time_s?, queswa_opened?, queswa_messages?, visit_count? }`
- Lee el `device_info` actual, hace **merge sin retroceder** (`Math.max` para `reel_pct`/`reel_time_s`/`visit_count`; OR lógico para los bool) y llama `update_prospect_data`.
- Devuelve `{ ok: true }`.

---

## 3. Instrumentación cliente (en `ReelVideo.tsx` / página de reel)

El `fingerprint` ya lo gestiona `public/tracking.js` (reusarlo; está en `localStorage`/cookie).

**a) Reel (`<video ref={videoRef}>`):**
- `onPlay` → marca inicio.
- `onTimeUpdate` → `pct = Math.floor(currentTime/duration*100)`; guarda el máximo.
- Reportar **solo en milestones** (cruza 25/50/75) y en `onEnded` (`completed:true, pct:100`). **NO** reportar en cada timeupdate.

**b) Queswa:** escuchar el evento `open-queswa` (ya existe) → `queswa_opened:true`. Contar mensajes enviados (hook del chat) → `queswa_messages`.

**c) Tiempo en página:** acumular segundos activos con `visibilitychange` (pausa con pestaña oculta). Reportar `reel_time_s` **solo al salir** con `navigator.sendBeacon` (no en heartbeat) para no spamear escrituras.

**d) Prospecto que vuelve:** al montar, leer `last_seen` (localStorage). Si gap > 30 min → `visit_count++` y reportar. Guardar `last_seen = now`.

---

## 4. Anti-spam (CRÍTICO)
Cada escritura a `device_info` dispara el webhook de Supabase. Mantener **≤ ~6 escrituras por sesión**:
- milestones del reel: 25/50/75/100 (4)
- queswa_opened: 1
- time_s + visit_count: en el beacon de salida (1)
No escribir en cada `timeupdate` ni en heartbeats. Nunca retroceder valores.

---

## 5. Verificación
- Visitar `/{slug}/corporativo`, ver 80% → el arquitecto recibe push "✅ Vio el reel completo" al llegar al final.
- Abrir Queswa → push "💬 Abrió Queswa".
- Volver en otra sesión → push "🔁 Volvió a visitar (2ª)".
- Confirmar en Supabase que `device_info` tiene los 7 campos.

## 6. Pendiente (NO Fase 1)
- Servilleta (YouTube IFrame API) → Fase 2.
- UI "línea de tiempo de engagement" en el Dashboard (Radar/Copiloto drawer) → la construye el agente del Dashboard leyendo estos campos.
