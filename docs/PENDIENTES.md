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

- [x] **Alinear el motor con el léxico nuevo** — hecho 2 ago 2026: system prompt **v29.4** (villano viejo fuera de "Permitido", trancón 1 + remate "dos millones y veinte" dentro, equivalentes a "Prohibido"), arsenal **v5.29** (WHY_02 "cuántas personas" + STORY_01 sin "asfixia mensual"), sync verificada en los 4 pares Camino A, desplegado + re-fragmentado + clonado a `whatsapp`. Barrido en los demás arsenales: limpio. Handoff: `docs/handoff/queswa/HANDOFF_LEXICO_MOTOR_AGO2026.md`.

- [x] **Aplicar WHY_01 + WHY_02** (versiones aprobadas) a las 4 fuentes — hecho 31 jul 2026 (arsenal v5.28 + `respuestas-maestras.ts` + deploy/re-fragmentación + clonado a `whatsapp`). Incluyó EMPRESA_DIGITAL_01 y el system prompt v29.3.
- [x] **Migrar el léxico del flujo de cierre** en `route.ts` — hecho 2 ago 2026. Decisión del Director: en el momento más crítico la persona compra la solución a su falta de liquidez (ingreso en paralelo), la categoría confunde → léxico nuevo en Estado 2/4 y pines; el bautizo "empresa digital" se difiere a **Academia/Maestría** (post-compra). Regex `_handoffYaEntregado` verificados. Ver [[feedback_bautizo_empresa_digital_diferido]].
- [x] **`HAIKU_SYSTEM_PROMPT` — encabezado stale** — corregido 2 ago 2026 (identidad Queswa: claridad, nadie evalúa ni califica).
- [ ] **"tres pilares" → "3 pilares"** en el módulo de solución compartido de los reels (re-deploya los 5 reels de tráfico — en espera de luz verde). Al hacerlo, incluir en el mismo re-render el rename **Compartir/Recibir/Multiplicar** si el módulo nombra los pasos.
- [ ] **Propagar Compartir / Recibir / Multiplicar** — **capa de texto hecha 2 ago 2026** (Home, Manifiesto, /fundadores, voice-command, system prompt v29.5, arsenal_inicial v5.30, arsenal_avanzado v12.5). Queda: **reels** (re-render, junto con "3 pilares") y la decisión pendiente del deck (guion v6.6: *Compartir · Recibir · Multiplicar* no tiene slide montada).
- [ ] **Purga global de "Usted no explica — Queswa explica"** — el aforismo sigue vivo en WHY_01, `TridenteAphorisms` y el system prompt.

## Web

- [x] **Home nueva aplicada** — 2 ago 2026: el Director aprobó la Home 2 de `/prueba` y se aplicó como **Home real v14.0** (`src/app/page.tsx`, con reel del hero, `force-static`, metadata/OG nuevos sin "empresa digital", footer de verificación Meta conservado). `/prueba` queda como sandbox noindex. ⏳ Derivados: (a) el **reel explainer** del hero narra el léxico viejo — regrabar/reemplazar asset en Blob (misma URL); (b) `TridenteAphorisms` y `CognitiveLoadComparator` quedaron sin uso en la Home (purga de "Usted no explica" avanzó de facto); (c) revisar metadata OG con el [Sharing Debugger](https://developers.facebook.com/tools/debug/) tras el deploy.
- [ ] **`/12-niveles` — re-fork pendiente.** El 2 ago se limpiaron los TEXTOS visibles (portada, nav, OG: fuera "empresa digital" y el villano retirado del subtítulo; pageContext alineado a "negocio digital"), pero la **estructura** sigue siendo el fork viejo de 4 slides pre-v6.8 (cards "puente"/Amazon + tríada "3 cosas ciertas" en slide 2). Decidir si se re-forkea desde el deck servilleta nuevo de 5 slides conservando el SLIDE 4 de los 12 niveles.
- [ ] **`/sistema/productos` — checkout por WhatsApp del distribuidor.** Si el hook de "usted no le cobra a nadie" se propaga, esa página lo desmiente donde el prospecto lo puede comprobar. Revisar antes de propagar.
- [ ] **Limpiar `public/sw.js`** — todavía lista `/mapa-de-salida` y `/reto-5-dias` en el bypass; sus redirects se retiraron (hoy 404).

## Video

- [ ] **Re-render de `Puente3D`** (final con celular + WhatsApp), al estilo de los clips recientes.
- [ ] **Re-descargar masters desde Drive** antes de cualquier re-render — las rutas locales de reuso que cita CLAUDE.md están vacías (archivo movido a `sistema@creatuactivo.com`, carpeta `videos/`).

## Campo

- [ ] **Experimento de one-liners** — 20 conversaciones, medir preguntas genuinas vs. asentimiento pasivo. Regla de descarte: >15% de respuestas defensivas o justificativas ("usted sí es negativo", "yo no estoy tan mal") mata el hook.
