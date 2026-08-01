# Pendientes — checklist operativo

> Tareas abiertas que no pertenecen a un handoff específico. Marcar `[x]` al cerrar y borrar cuando ya no aplique.
> El historial con fecha vive en los CHANGELOGs; aquí solo lo que falta.

## Infraestructura / accesos

- [ ] **Autorizar los conectores de claude.ai** — Gmail, Google Calendar, Google Drive, Vercel y Supabase aparecen sin autorizar. Claude Code no puede correr el login desde una sesión no interactiva. Se autorizan desde **configuración de conectores en claude.ai**. Hasta entonces esas capacidades no están disponibles en sesión (leer Drive, consultar Supabase directo, revisar deploys de Vercel).

## Queswa — motor y guardrails

- [ ] **Falsos positivos del guardrail de WhatsApp** (`detectarModeloInventado()` en `src/app/api/whatsapp/webhook/route.ts`):
  - Bloquea **"membresía"**, que es el término real de afiliación de Gano Excel (`colombia.ganoexcel.com/membresias`) → corta el flujo legítimo de activación.
  - Bloquea negaciones correctas (cuando Queswa dice "aquí no hay cursos ni membresías", el guardrail lo marca).
  - **7 de 7 alucinaciones alternativas pasan sin detección**: coaching, webinars, tienda online, trading, consultoría, plantillas, "monetizar su experiencia".
- [ ] **Purgar `arsenal_reto` de Supabase** — el routing ya salió del motor (commit `8256c82`), faltan los documentos: `delete from nexus_documents where category like 'arsenal_reto%'`.

## Copy y arsenales

- [x] **Aplicar WHY_01 + WHY_02** (versiones aprobadas) a las 4 fuentes — hecho 31 jul 2026 (arsenal v5.28 + `respuestas-maestras.ts` + deploy/re-fragmentación + clonado a `whatsapp`). Incluyó EMPRESA_DIGITAL_01 y el system prompt v29.3.
- [ ] **Migrar (o no) el léxico del flujo de cierre** en `route.ts` — la tabla de niveles, la confirmación de paquete y los pines de comisiones siguen diciendo "empresa digital". Se dejó a propósito: ahí la persona ya vio el mecanismo, que es donde la regla nueva sí permite nombrar la categoría. Decisión del Director.
- [ ] **`HAIKU_SYSTEM_PROMPT` — encabezado stale** (`route.ts`): dice *"Protocolo de Auditoría Técnica y Calificación Patrimonial"*, que contradice la doctrina de que nadie audita ni califica a las personas.
- [ ] **"tres pilares" → "3 pilares"** en el módulo de solución compartido de los reels (re-deploya los 5 reels de tráfico — en espera de luz verde).
- [ ] **Propagar Compartir / Recibir / Multiplicar** (slide 2 servilleta v6.5) a arsenales, Home y reels.
- [ ] **Purga global de "Usted no explica — Queswa explica"** — el aforismo sigue vivo en WHY_01, `TridenteAphorisms` y el system prompt.

## Web

- [ ] **Revisar `/prueba`** (Home 2 construida desde principios, sin "empresa digital") — sin commitear, pendiente de revisión del Director.
- [ ] **`/sistema/productos` — checkout por WhatsApp del distribuidor.** Si el hook de "usted no le cobra a nadie" se propaga, esa página lo desmiente donde el prospecto lo puede comprobar. Revisar antes de propagar.
- [ ] **Limpiar `public/sw.js`** — todavía lista `/mapa-de-salida` y `/reto-5-dias` en el bypass; sus redirects se retiraron (hoy 404).

## Video

- [ ] **Re-render de `Puente3D`** (final con celular + WhatsApp), al estilo de los clips recientes.
- [ ] **Re-descargar masters desde Drive** antes de cualquier re-render — las rutas locales de reuso que cita CLAUDE.md están vacías (archivo movido a `sistema@creatuactivo.com`, carpeta `videos/`).

## Campo

- [ ] **Experimento de one-liners** — 20 conversaciones, medir preguntas genuinas vs. asentimiento pasivo. Regla de descarte: >15% de respuestas defensivas o justificativas ("usted sí es negativo", "yo no estoy tan mal") mata el hook.
