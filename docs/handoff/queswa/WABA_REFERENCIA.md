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
- ✅ **El nombre visible «Queswa» está APROBADO y en uso** — verificado el **21 ago 2026** por API *y por prueba en teléfono real*. `verified_name: Queswa` · `new_name_status: NONE` — la cola está vacía y **no quedó en `DECLINED`**. Venía de `PENDING_REVIEW` el 17 ago. ⚠️ `name_status` devuelve **`NON_EXISTS`**, valor que **no figura en la lista oficial de Meta** (APPROVED · AVAILABLE_WITHOUT_REVIEW · DECLINED · EXPIRED · PENDING_REVIEW · NONE) y que es idéntico de v19 a v24; se lee como *«ya no existe expediente de revisión»*, coherente con que Meta desmontó la revisión previa para cuentas verificadas y con que el re-registro consolidó la solicitud. **La API nunca dice `APPROVED` en este número, y eso NO es rechazo — no vuelva a someter el nombre por ese motivo.**

  **La prueba que lo zanjó** (`hello_world` al `+57 320 341 5438`, captura en `public/contexto/capturas/pruebas/11.jpeg`): el encabezado del chat trae **dos líneas** — arriba `CreaTuActivo-Queswa`, que es el nombre guardado en los contactos de ese teléfono y **no prueba nada**, y debajo en pequeño **`Queswa`**, que es el nombre verificado que entrega Meta. ⚠️ **Al repetir esta comprobación, lea la segunda línea.** Con el número guardado en contactos, la primera es el rótulo local del teléfono; solo con el número *sin guardar* el nombre de Meta ocupa la línea principal.
- ⛔ **NO ejecutar `request_code` / `verify_code`** sobre un número `CONNECTED` que funciona. `code_verification_status: EXPIRED` **no bloquea el envío** (medido el 4 ago con `hello_world` entregada); el error #131037 era un riesgo del manual, no algo activo.
- ⚠️ **Ventana de 24 h**: si la persona escribe primero se responde en **texto libre**; iniciar conversación con quien nunca escribió **exige plantilla aprobada**, sin excepción.
- ⚠️ **`clonar-arsenal-whatsapp.mjs` SOLO inserta categorías nuevas — NO actualiza las existentes** (salta las que ya están). Para propagar fragmentos *modificados* al tenant whatsapp hay que **purgar primero** `arsenal_inicial_%` del tenant whatsapp y luego clonar; si no, quedan **stale**.
- 🟢 **El App Review de Meta NO hace falta para este caso de uso** (auditoría cerrada 26 jul 2026). Los permisos figuran "rechazados" y el canal opera igual: sobre activos propios basta el *Acceso estándar*. Solo se retoma si se decide que **cada socio conecte su propio número**. No re-someter sin eso.

**Plantillas de la cuenta** — **7, todas `APPROVED`** (inventario auditado el 21 ago 2026 — `node -e` contra `/{WABA_ID}/message_templates`):

| Estado | Categoría | Nombre |
|---|---|---|
| APPROVED | AUTHENTICATION | `codigo_centro_mando` |
| APPROVED | UTILITY | `acceso_centro_mando_v2` ← **la vigente para el acceso al Dashboard** |
| APPROVED | UTILITY | `pre_afiliacion_nueva` · `hello_world` |
| APPROVED | MARKETING | `acceso_centro_mando` · `enlace_canal_listo` · `acceso_creatuactivo` |

- ⚠️ **`acceso_centro_mando` (sin `_v2`) es MARKETING, no UTILITY.** Las dos están aprobadas y se llaman casi igual, pero la categoría cambia la tarifa y las reglas que le aplican. **La correcta es `acceso_centro_mando_v2`.** Quien la dispara es el **Dashboard**, que es repo aparte — verificar allá cuál invoca.
- ⛔ **El `WHATSAPP_SYSTEM_TOKEN` NO puede borrar plantillas.** Tiene `whatsapp_business_management` y **crea** sin problema, pero el DELETE devuelve `(#100) Need permission on either WhatsApp Business Account or owner/shared business` por las tres vías (`?name=`, `?hsm_id=` y el nodo `/{template_id}`). Meta exige **control total del activo WABA para el usuario del sistema**; mientras no se conceda, borrar es **a mano** en WhatsApp Manager. ⏳ Pendiente opcional: Configuración del negocio → Usuarios del sistema → *Queswa App CTA* → Agregar activos → Cuentas de WhatsApp → control total.
- ✅ `codigo_acceso_centro_mando` (REJECTED por `INCORRECT_CATEGORY`) **se eliminó a mano el 21 ago 2026**. La reemplazó `codigo_centro_mando`, en AUTHENTICATION, que es la categoría correcta para un código de acceso — someterlo como UTILITY fue lo que lo tumbó.
- ⚠️ **Al borrar en WhatsApp Manager, lea el nombre dos veces.** En esa cuenta conviven `codigo_centro_mando` (en uso) y existió `codigo_acceso_centro_mando`; y conviven `acceso_centro_mando` con `acceso_centro_mando_v2`. Además, **Configuración del negocio lista TRES cuentas llamadas «CreaTuActivo»** más una de pruebas: la de producción es la del identificador **`1436663504253230`**. Ruta directa a las plantillas del WABA correcto: `https://business.facebook.com/wa/manage/message-templates/?business_id=2440608633047462&waba_id=1436663504253230`
- 🖼️ **Foto de perfil: el fondo va horneado, y es deliberado.** WhatsApp **no admite transparencia** — Meta convierte toda foto de perfil a **JPEG** (verificado: lo almacenado es JPEG 640×640 con esquinas `srgb(255,255,255)`), así que un PNG transparente sale aplanado contra **blanco**. Los archivos listos, con el carbón de marca ya incorporado y el logo al 88% del radio, viven en **[public/images/marca/](../../../public/images/marca/)** junto a su README. **No les devuelva el alfa** — vuelve el blanco.
- ℹ️ Otros campos del número, misma auditoría: `account_mode: LIVE` · `is_official_business_account: false` (sin marca verde) · `search_visibility: NON_VISIBLE` · `is_pin_enabled: true` · `health_status: AVAILABLE` en las tres entidades (WABA, Business, App).

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

