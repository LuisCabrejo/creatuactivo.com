# Handoff de sesión — Canal WhatsApp operativo + giro del hook (4 ago 2026)

> Para el agente que continúa. Dos frentes en paralelo: **el canal de WhatsApp quedó operativo y verificado**, y **el hook/diagnóstico cambió de raíz**. Lo segundo tiene su propio documento; aquí está el estado del canal, lo que se hizo, y las decisiones abiertas.
>
> 📖 **Lea primero** [`docs/handoff/negocio/HANDOFF_HOOK_Y_LENGUAJE_CONCRETO_JUL2026.md`](../negocio/HANDOFF_HOOK_Y_LENGUAJE_CONCRETO_JUL2026.md) — contiene la investigación cruzada, los dos trancones, la amnistía de vocabulario, la corrección del catálogo, la doctrina de método y la nota de voz. Sin eso, lo de abajo se lee sin contexto.

---

## 1. El objetivo inmediato del Director

**Empezar volumen hoy: ~50 contactos 1-a-1.** El flujo acordado:

```
Luis escribe desde su WhatsApp PERSONAL (+57 320 341 5438)
   └─ "escríbame ACCESO a este número" + wa.me del corporativo
        └─ la persona escribe ACCESO al +57 321 519 3909 (WABA)
             └─ ESE envío abre la ventana de servicio de 24 h
                  └─ Queswa responde en TEXTO LIBRE (sin plantilla) + entrega el enlace
```

**El enlace que se comparte:**
```
https://wa.me/573215193909?text=ACCESO
```
Sin `+`, sin espacios, sin guiones — con cualquiera de esos se rompe en algunos teléfonos. Para saber de dónde vino: `?text=ACCESO%20luis-cabrejo` (el webhook ya resuelve el patrocinador desde el texto).

## 2. Estado real del canal (verificado por Graph API, 4 ago 2026)

| Campo | Valor | Lectura |
|---|---|---|
| `status` | `CONNECTED` | operativo |
| `quality_rating` | `GREEN` | sano |
| `verified_name` | **`Queswa`** | el re-registro consolidó la solicitud |
| `name_status` | `PENDING_REVIEW` | ⏳ esperando a Meta |
| `new_name_status` | `NONE` | ya no hay dos nombres compitiendo |
| `code_verification_status` | `EXPIRED` | ⚠️ **no bloquea** — ver abajo |
| `business_verification_status` | `verified` | ✅ fuera de modo desarrollo |
| `account_review_status` | `APPROVED` | ✅ |

**Números del ecosistema — no confundirlos:**

- `+57 321 519 3909` — **el WABA**. Número corporativo público, donde vive Queswa.
- `+57 320 341 5438` — **personal de Luis**. Desde aquí sale el 1-a-1.
- `+57 320 680 5737` — **WhatsApp Business de Luis en su móvil**, segundo número corporativo. Aparece en el código como `WHATSAPP_ORGANICO_DEFAULT` (fallback de reels) y como bandeja interna. **No es el personal** — un test se mandó ahí por error creyendo que sí.

## 3. Lo que se hizo en esta sesión

**PIN de verificación en dos pasos.** El anterior se perdió y no estaba documentado. Se fijó uno nuevo por API (`POST /{PHONE_NUMBER_ID}` con `pin`) y quedó en `.env.local` como `WHATSAPP_TWO_STEP_PIN` (gitignored). También debe estar en el gestor de contraseñas del Director.

**Re-registro del número** (`POST /{PHONE_NUMBER_ID}/register`). Efecto inesperado y bueno: antes el número mostraba `CreaTuActivo` en `DECLINED` con "Queswa" en cola aparte; después quedó `verified_name: Queswa` con la cola vacía. La solicitud se consolidó.

**Prueba de envío end-to-end.** Plantilla `hello_world` enviada y **recibida** en los dos números de Luis. Conclusión medida: **el `code_verification_status: EXPIRED` NO está bloqueando el envío.** El error #131037 era un riesgo del manual, no algo que esté pasando.

**Plantilla `acceso_creatuactivo` creada** (id `1034288436163506`, `PENDING`, UTILITY, es):
> Hola {{1}}. Soy Queswa, el asistente de CreaTuActivo. Aquí está el acceso que pidió: puede ver de qué se trata y preguntarme lo que quiera, a la hora que sea.
> `[ Ver el acceso ]` → `https://creatuactivo.com/{{1}}`

**Reconocimiento de `ACCESO` en el webhook** ([`src/app/api/whatsapp/webhook/route.ts`](../../../src/app/api/whatsapp/webhook/route.ts)). En el **primer contacto**, si el mensaje contiene "acceso", la respuesta de Queswa se completa con el enlace + atribución del patrocinador. ✅ **Desplegado a producción** — commit `61b4f59`, 4 ago 2026.

⚠️ **Sin probar en vivo todavía.** La primera prueba real es escribir `ACCESO` al `+57 321 519 3909` desde un número que nunca haya escrito (la condición es `!existingProspect` — con un número ya registrado NO se dispara). Si hace falta repetir la prueba con el mismo teléfono, hay que borrar su fila de `prospects` (`fingerprint_id = 'wa_57XXXXXXXXXX'`).

## 4. Reglas del canal que hay que tener claras

**La ventana de 24 h.** Cuando la persona escribe primero, se abre una ventana de servicio de 24 horas en la que se responde en **texto libre**: enlaces, lo que sea, sin plantilla ni aprobación. Cuando el negocio inicia la conversación con alguien que nunca escribió, **se exige plantilla aprobada, sin excepción**.

**Hay dos "accesos" distintos y se confunden fácil:**
- *Camino web* — se comparte `creatuactivo.com/{slug}`; la persona habla con el widget de Queswa en el sitio. Cero Meta. Sirve por cualquier canal. **Pierde el teléfono** si la persona no se anima.
- *Camino WhatsApp* — se comparte `wa.me/...?text=ACCESO`; la persona escribe, entra al CRM, dispara aviso al arquitecto. **Recomendado para captación.**
- La *plantilla* no es ninguno de los dos: es para escribirle a quien nunca escribió.

⛔ **No tocar el campo de nombre visible mientras `name_status` esté en revisión.** Cada guardado abre una solicitud nueva que pisa la anterior; así se perdió una aprobación previa de "Queswa". Van 4 cambios de los 10 que Meta permite cada 30 días.

⚠️ **No ejecutar `request_code` / `verify_code`** sobre el número para arreglar el `EXPIRED`. Manda SMS o llamada al número y exige que alguien lo reciba; es arriesgar un número `CONNECTED` que hoy funciona, por un campo que no estorba.

**Chequeo de estado:**
```bash
set -a; . ./.env.local; set +a
curl -s "https://graph.facebook.com/v22.0/${WHATSAPP_PHONE_NUMBER_ID}?fields=verified_name,name_status,new_name_status,code_verification_status,quality_rating,status&access_token=${WHATSAPP_SYSTEM_TOKEN}"
```

## 5. Instagram y Facebook — proyecto aparte

El Director quiere el flujo *"comente ACCESO y le llega el enlace"*. **La aprobación del WABA no sirve ahí** — son productos distintos.

Diferencias que hay que tener claras:
- **Las plantillas son exclusivas de WhatsApp.** Instagram y Messenger no tienen plantillas ni revisión de mensajes: rige la ventana de 24 h, más una etiqueta de agente humano que la estira a 7 días.
- Lo que sí exige revisión son los **permisos**: `instagram_business_manage_messages` + `instagram_business_manage_comments`, con **Acceso avanzado**.

⚠️ **Secuencia crítica: Meta no aprueba una intención, aprueba algo funcionando.** Piden un screencast del ciclo real (alguien comenta la palabra → le llega el DM). Con acceso estándar ese ciclo se puede hacer con la cuenta propia. **Se construye primero, se graba, y ahí se somete.** Someter antes es rechazo garantizado.

**Pendiente de confirmar con el Director:** él recuerda haber adelantado una solicitud con ayuda de Gemini que no fue aprobada y cree que hay que reenviar un video. En los documentos del proyecto solo consta el rechazo de `whatsapp_business_messaging` / `whatsapp_business_management` en la app `Queswa App CTA` (`1513851726973155`) — y sobre esos la conclusión fue que **no se necesitan** (operamos sobre activos propios, basta acceso estándar). **Si lo que él adelantaba era eso, está bien que no se aprobara y no hay que reenviar nada. Si era Instagram, es una solicitud aparte que no está documentada** — hay que abrir el panel de la app, sección Revisión de la aplicación, y leer el estado real.

**Descartado:** ManyChat. El Director lo rechazó explícitamente — la conversación tiene que ser de Queswa, no de flujos de terceros.

## 6. Decisiones abiertas

**`/{slug}/queswa` no es un destino declarado.** `DESTINO_MAP` en [`src/app/[slug]/[destino]/page.tsx`](../../../src/app/[slug]/[destino]/page.tsx) no lo tiene, así que cae al fallback `redirect('/?ref=...')` y aterriza en la Home con atribución. Funciona por accidente. Decidir: declararlo formalmente o usar `?ref=` directo.

**WHY_02 sin aplicar.** La versión acordada (registro de Gemini + hechos corregidos, dos fuerzas en vez de tres cosas) está redactada en la conversación pero **no se bajó a las 4 fuentes**. Ver §8 del handoff de hook.

**`CLAUDE.md` tiene una reestructuración grande sin commitear**, hecha en otra sesión (adelgazamiento del archivo, extracción a `docs/SERVILLETA.md`, `ESTRATEGIA_CONTENIDO_Y_VOZ.md`, `VIDEO_Y_ANIMACIONES.md`). Se dejó **fuera** del commit `61b4f59` a propósito — no es trabajo de esta sesión. Las correcciones del estado del canal sí están escritas ahí y viajan cuando ese trabajo se commitee.

**El resto** → [`docs/PENDIENTES.md`](../../PENDIENTES.md).

## 7. Advertencias heredadas que siguen vigentes

- **`detectarModeloInventado()` tiene falsos positivos**: bloquea "membresía" (término real de afiliación de Gano) y bloquea negaciones correctas; y 7 de 7 alucinaciones alternativas pasan sin detectar. Está en el checklist.
- **No modificar `/api/nexus/route.ts` desde el webhook.** El webhook es adaptador de canal; toda la lógica de IA vive en el motor. La entrega del `ACCESO` se implementó respetando esa regla (se completa la respuesta ya generada, no se toca el motor).
- **Conectores de claude.ai sin autorizar** (Gmail, Drive, Calendar, Vercel, Supabase). Se autorizan desde la configuración de conectores en claude.ai; una sesión no interactiva no puede correr el login.
