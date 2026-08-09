# WABA WhatsApp — referencia y estado

**Extraído de CLAUDE.md el 8 ago 2026.** Aquí queda el **estado de la cuenta de Meta**, el diagrama del flujo y las decisiones en curso. Es lo que cambia solo y se desincroniza — el propio CLAUDE.md ya advertía que no se duplicara.

**En CLAUDE.md se quedaron todas las reglas que tumban el canal** si se ignoran: los tres números que no hay que confundir, el nombre visible en revisión, `request_code` sobre un número conectado, la ventana de 24 h, la clonación que no actualiza, el App Review innecesario, la FSM aislada, y `wa-channel.ts` como único lugar con el token.

**Estado detallado y actualizado → [HANDOFF_SESION_CANAL_Y_HOOK_AGO2026.md](HANDOFF_SESION_CANAL_Y_HOOK_AGO2026.md)** · arquitectura del pipeline → [Handoff_WABA_Queswa_WhatsApp_Estado_Abr2026.md](Handoff_WABA_Queswa_WhatsApp_Estado_Abr2026.md).

---

**Estado integración WABA WhatsApp** — ✅ canal **operativo**: negocio `verified`, cuenta `APPROVED`, número `CONNECTED` + `quality_rating: GREEN` (Graph API, 4 ago 2026).

> 📄 **Estado detallado, historial de Meta y decisiones abiertas → [HANDOFF_SESION_CANAL_Y_HOOK_AGO2026.md](docs/handoff/queswa/HANDOFF_SESION_CANAL_Y_HOOK_AGO2026.md)** (el más reciente) · arquitectura del pipeline → [Handoff_WABA_Queswa_WhatsApp_Estado_Abr2026.md](docs/handoff/queswa/Handoff_WABA_Queswa_WhatsApp_Estado_Abr2026.md). **No duplique aquí el estado de la cuenta de Meta** — cambia solo y se desincroniza.

- Webhook `/api/whatsapp/webhook` (Node, 30s). WABA `+573215193909` | Phone Number ID `1115546358301373` | WABA ID `1436663504253230` (`.env.local` + Vercel). Prompt `queswa_whatsapp`, fuente `knowledge_base/system-prompt-queswa-whatsapp-v4.md`. ⚠️ **`VERSION_LABEL` en el script es lo que se pretende desplegar, no lo que corre** — lo desplegado se consulta siempre contra la BD: `node scripts/sql.mjs -e "select name, version, length(prompt) from system_prompts"`. CTWA (`referral` de ads Meta) → `device_info`.
- ⚠️ **Tres números, no confundirlos**: `+57 321 519 3909` = el WABA (Queswa) · `+57 320 341 5438` = personal de Luis (el 1-a-1) · `+57 320 680 5737` = WhatsApp Business en su móvil, `WHATSAPP_ORGANICO_DEFAULT` (fallback de reels).

**Reglas que rompen el canal si se ignoran:**
- ⛔ **NO tocar el nombre visible mientras `name_status` esté en revisión** — cada guardado abre una solicitud nueva que pisa la anterior; así se perdió una aprobación previa de "Queswa". Meta permite 10 cambios cada 30 días.
- ⛔ **NO ejecutar `request_code` / `verify_code`** sobre un número `CONNECTED` que funciona. `code_verification_status: EXPIRED` **no bloquea el envío** (medido el 4 ago con `hello_world` entregada); el error #131037 era un riesgo del manual, no algo activo.
- ⚠️ **Ventana de 24 h**: si la persona escribe primero se responde en **texto libre**; iniciar conversación con quien nunca escribió **exige plantilla aprobada**, sin excepción.
- ⚠️ **`clonar-arsenal-whatsapp.mjs` SOLO inserta categorías nuevas — NO actualiza las existentes** (salta las que ya están). Para propagar fragmentos *modificados* al tenant whatsapp hay que **purgar primero** `arsenal_inicial_%` del tenant whatsapp y luego clonar; si no, quedan **stale**.
- 🟢 **El App Review de Meta NO hace falta para este caso de uso** (auditoría cerrada 26 jul 2026). Los permisos figuran "rechazados" y el canal opera igual: sobre activos propios basta el *Acceso estándar*. Solo se retoma si se decide que **cada socio conecte su propio número**. No re-someter sin eso.

**Flujo WABA:**
```
WhatsApp (orgánico o CTWA anuncio)
  └─ POST https://creatuactivo.com/api/whatsapp/webhook
       └─ extrae número, texto, referral CTWA
       └─ INSERT en prospects (fingerprint: "wa_{phone}", source: whatsapp_inbound/ctwa)
       └─ POST /api/nexus { x-tenant-id: whatsapp, fingerprint: wa_{phone} }
            └─ system prompt queswa_whatsapp + arsenal_inicial RAG
            └─ StreamingTextResponse consumida completa
       └─ POST graph.facebook.com/v22.0/{PHONE_NUMBER_ID}/messages
```

**Regla crítica WABA**: NO modificar `/api/nexus/route.ts`. El webhook es solo adaptador de canal. Toda lógica de IA vive en el motor existente.

⛔ **La FSM de cierre del motor NO aplica a WhatsApp** (aislada 5 ago 2026). Los estados 2/3/4 fueron escritos para la web y su último paso entrega **dos enlaces `wa.me` al número del WABA** — a alguien que escribe desde adentro de esa misma conversación. En `route.ts` el guard es `cierreLoManejaElCanal` (`tenantId === 'whatsapp'`): apaga `getMicroPromptCierre()`, `getCierreEstado4()`, la supresión de RAG de `isClosingFlowEarly` y la de `arsenalParaCierre` (sin texto dictado, el RAG es la única fuente de precios). El cierre del canal vive en [src/lib/wa-radicacion.ts](src/lib/wa-radicacion.ts) → `pending_activations`. **NO reactivar la FSM web para el tenant whatsapp.**

**Capa de canal + puente al Dashboard** (jul 2026):
- **`src/lib/wa-channel.ts` es el ÚNICO lugar que habla con graph.facebook.com** y que conoce `WHATSAPP_SYSTEM_TOKEN`: `sendText` · `sendTemplate` · `listTemplates` · `getPhoneAsset`. Si Meta cambia de versión de API, se toca este archivo y nada más.
- **Puente server-to-server** para que el Dashboard opere el canal sin ver el token: `GET /api/wa/assets` + `POST /api/wa/send`, autenticados con header **`x-wa-bridge-secret`** = env `WA_BRIDGE_SECRET` (mismo valor en ambos proyectos de Vercel). ⚠️ **Si la env no está definida el puente DENIEGA** (503) en vez de abrirse.
- **División de responsabilidad:** marketing = plano de datos (token, webhook, envío). Dashboard = plano de control (permisos, UI humana). La consola vive en `queswa.app/admin/wa-tester`. **No copiar el token al Dashboard** — cualquier superficie nueva consume el puente.
- ⏳ **Estrategia Queswa-WhatsApp (WIP)**: captación 1-a-1 del arquitecto → Home (video + Queswa) → cierre en espacio en vivo o llamada. El "plan de dos niveles" (ingreso inmediato + duplicación 2×2 → $103.194.000) es el contexto central; vive en `arsenal_12_niveles` y en el slide 4 de `/12-niveles`.
- ⏸️ **STANDBY**: el "empujón" de Queswa hacia el espacio en vivo del arquitecto queda diferido. Hoy el único empuje al humano es el **warm handoff** (Estado 4 → oferta wa.me). Queswa **no conoce el horario** de cada arquitecto, así que el empujón sería genérico.

**Scripts WABA:**
- `node scripts/actualizar-system-prompt-whatsapp-v4.mjs` — despliega el system prompt de WhatsApp (fuente: `knowledge_base/system-prompt-queswa-whatsapp-v4.md`). ⚠️ El `...-v1.mjs` sigue en `scripts/` y es la versión vieja; el `-v3.mjs` **ya no existe** — no busque ese nombre
- `node scripts/clonar-arsenal-whatsapp.mjs` — clona fragmentos arsenal_inicial al tenant whatsapp

