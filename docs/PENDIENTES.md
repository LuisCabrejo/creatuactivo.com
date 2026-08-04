# Pendientes — checklist operativo

> Tareas abiertas que no pertenecen a un handoff específico. Marcar `[x]` al cerrar y borrar cuando ya no aplique.
> El historial con fecha vive en los CHANGELOGs; aquí solo lo que falta.

## Infraestructura / accesos

- [ ] **Autorizar los conectores de claude.ai** — Gmail, Google Calendar, Google Drive, Vercel y Supabase aparecen sin autorizar. Claude Code no puede correr el login desde una sesión no interactiva. Se autorizan desde **configuración de conectores en claude.ai**. Hasta entonces esas capacidades no están disponibles en sesión (leer Drive, consultar Supabase directo, revisar deploys de Vercel).

## Meta / WhatsApp (verificado por Graph API el 4 ago 2026)

- [ ] **Nombre visible "Queswa" — `name_status: PENDING_REVIEW`, esperando a Meta.** El re-registro del 4 ago consolidó la solicitud: el número ya tiene `verified_name: Queswa` (antes mostraba `CreaTuActivo` en `DECLINED`) y `new_name_status: NONE`. ⛔ **No tocar el campo de nombre mientras la revisión siga abierta** — cada guardado abre una solicitud nueva que pisa la anterior; así se perdió una aprobación previa. Van 4 cambios de los 10 que Meta permite cada 30 días.
- [ ] **`code_verification_status: EXPIRED`** — **no lo arregla el `register`** (se probó el 4 ago; el campo no se movió). Corresponde al flujo `request_code` / `verify_code`, que manda un SMS o llamada al `+57 321 519 3909` y exige que alguien reciba el código. ⚠️ No ejecutarlo a ciegas sobre un número `CONNECTED`. **Impacto real medido: ninguno hoy** — el envío funciona con el campo en `EXPIRED` (ver abajo).
- [x] **Canal verificado de punta a punta** — 4 ago 2026: plantilla `hello_world` enviada al número interno, respuesta `message_status: accepted`. **El `EXPIRED` no está bloqueando el envío**; el error #131037 era un riesgo documentado, no un bloqueo activo.
- [x] **PIN de verificación en dos pasos** — se perdió el anterior; se fijó uno nuevo por API (`POST /{PHONE_NUMBER_ID}` con `pin`) y quedó en `.env.local` como `WHATSAPP_TWO_STEP_PIN` (gitignored). Guardarlo también en gestor de contraseñas.
- [x] **Verificación del negocio en Meta** — hecha. `business_verification_status: verified` · `account_review_status: APPROVED`. Ya no estamos en modo desarrollo.
- [ ] ⚠️ **No hay plantilla para enviar el acceso a un prospecto.** Las dos aprobadas son `hello_world` (prueba) y `pre_afiliacion_nueva`, que es un **aviso al arquitecto** (*"X dejó lista su pre-afiliación… comuníquese pronto"*), no un mensaje al prospecto. Enviar el enlace de acceso desde el WABA a alguien que **no escribió primero** exige una plantilla nueva aprobada. Si la persona escribe primero, se abre la ventana de 24 h y el mensaje sale en texto libre, sin plantilla.
- [x] **Reconocimiento de `ACCESO`** — desplegado 4 ago 2026 (commit `61b4f59`). ⏳ Falta la prueba en vivo: escribir `ACCESO` al `+57 321 519 3909` desde un número nuevo (solo se dispara si el prospecto no existe en BD).
- [ ] **Plantilla `acceso_creatuactivo`** — creada 4 ago 2026, id `1034288436163506`, `PENDING`, UTILITY/es. Revisar si Meta la aprueba o la reclasifica a MARKETING. **No bloquea el flujo de captación** (la persona escribe primero → texto libre); sirve para retomar después de las 24 h.
- [ ] **Declarar `/{slug}/queswa` en `DESTINO_MAP`** o dejar de usarlo — hoy cae al fallback y aterriza en la Home con `?ref`. Funciona, pero por accidente.
- [ ] **App Review de Instagram** — `instagram_business_manage_messages` + `instagram_business_manage_comments` con **Acceso avanzado**, para el flujo "comente ACCESO y le llega el enlace". Requiere la integración construida antes de someter (Meta pide screencast del caso de uso funcionando). Ver el plan en el handoff del canal.

**Chequeo rápido de estado:**
```bash
set -a; . ./.env.local; set +a
curl -s "https://graph.facebook.com/v22.0/${WHATSAPP_PHONE_NUMBER_ID}?fields=verified_name,name_status,new_name_status,code_verification_status,quality_rating,status&access_token=${WHATSAPP_SYSTEM_TOKEN}"
```

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
