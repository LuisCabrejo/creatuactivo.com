# HANDOFF — WABA + QUESWA WhatsApp · Estado Abril 2026
**Para:** Agente Claude Code · Agente Gemini (campañas Meta)
**Director de Proyecto:** Luis Cabrejo — CreaTuActivo.com
**Fecha:** Sábado 5 de abril 2026

---

## 1 · RESUMEN EJECUTIVO

El canal WhatsApp está operativo en modo desarrollo. Queswa responde en WhatsApp con el mismo motor de IA que en la web. El pipeline completo fue construido, probado y verificado esta semana.

**Lo que funciona hoy:**
- Cualquier número en la lista de prueba de Meta escribe al `+573215193909` → Queswa responde
- Los datos del prospecto se guardan en Supabase (prospect + conversación + scoring)
- CTWA detectado: si el mensaje viene de un anuncio Meta, se guarda la atribución del anuncio
- El system prompt de WhatsApp es independiente del web — optimizado para canal móvil

**Lo que falta para producción real:**
- Verificación de negocio en Meta (para salir de modo desarrollo)
- Plantilla `acceso_mapa_salida` aprobada en Meta (para envío outbound)
- 5 templates de secuencia de días

---

## 2 · ARQUITECTURA TÉCNICA COMPLETA

### Flujo inbound (alguien escribe al WABA)
```
WhatsApp del prospecto
  └─ Meta Cloud API
       └─ POST https://creatuactivo.com/api/whatsapp/webhook
            ├─ Extrae: número, nombre, texto, referral CTWA
            ├─ INSERT en Supabase.prospects (fingerprint: "wa_{phone}")
            │    source: 'whatsapp_inbound' | 'whatsapp_ctwa'
            │    device_info: { channel, phone, name, ctwa_clid, ad_id, ad_headline }
            ├─ POST /api/nexus
            │    headers: { x-tenant-id: 'whatsapp' }
            │    body: { messages, sessionId: wa_{phone}, fingerprint: wa_{phone}, pageContext }
            │         └─ Motor Queswa completo (RAG + scoring + Anthropic)
            │              system prompt: queswa_whatsapp v1.1
            │              arsenal: arsenal_inicial (39 fragmentos tenant: whatsapp)
            └─ POST graph.facebook.com/v22.0/1115546358301373/messages
                 WHATSAPP_SYSTEM_TOKEN → respuesta al prospecto
```

### Flujo outbound (envío proactivo de templates)
```
Evento (ej: formulario mapa de salida completado)
  └─ funnel/route.ts o webhooks/prospect-capture/route.ts
       └─ src/lib/whatsapp-meta.ts → sendWhatsAppTemplate(prospect, constructor)
            └─ POST graph.facebook.com/v22.0/1115546358301373/messages
                 template: 'acceso_mapa_salida' (pendiente aprobación Meta)
```

---

## 3 · CREDENCIALES Y VARIABLES DE ENTORNO

| Variable | Valor | Dónde |
|---|---|---|
| `WHATSAPP_PHONE_NUMBER_ID` | `1115546358301373` | .env.local + Vercel |
| `WHATSAPP_SYSTEM_TOKEN` | `EAAVg1x...` (permanente) | .env.local + Vercel |
| `WHATSAPP_WEBHOOK_VERIFY_TOKEN` | `queswa_webhook_2026` | .env.local + Vercel |
| `WHATSAPP_WABA_ID` | ⏳ pendiente | .env.local |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | `+573215193909` | .env.local |

**Token verificado:** nombre `Token Queswa`, permisos `whatsapp_business_messaging` + `whatsapp_business_management`, no expira (System User Token permanente).

---

## 4 · ARCHIVOS CLAVE

| Archivo | Propósito |
|---|---|
| `src/app/api/whatsapp/webhook/route.ts` | Webhook WABA — adaptador de canal (NO es el motor) |
| `src/lib/whatsapp-meta.ts` | Envío outbound de templates via Meta Cloud API |
| `src/lib/sendpulse.ts` | Legacy — mantener hasta confirmar templates aprobados en Meta |
| `knowledge_base/system-prompt-whatsapp-v1.0.md` | System prompt WhatsApp v1.1 |
| `scripts/actualizar-system-prompt-whatsapp-v1.mjs` | Deploy del prompt a Supabase |
| `scripts/clonar-arsenal-whatsapp.mjs` | Clona arsenal_inicial al tenant whatsapp |

---

## 5 · SUPABASE — ESTADO DE DATOS

**Sistema de prompts (tabla `system_prompts`):**
| name | tenant_id | version | Estado |
|---|---|---|---|
| `nexus_main` | `creatuactivo_marketing` | v20.0 | Activo web |
| `queswa_whatsapp` | `whatsapp` | v1.0_whatsapp | Activo WABA |
| `marca_personal_v1.0` | `marca_personal` | v1.0 | Activo luiscabrejo.com |
| `ganocafe_main` | `ecommerce` | v1.5 | Activo ganocafe.online |

**Arsenal WhatsApp (tabla `nexus_documents`):**
- 39 fragmentos de `arsenal_inicial` con `tenant_id = 'whatsapp'`
- Embeddings Voyage AI copiados directamente (válidos, no requieren re-embedear)

**Prospects WhatsApp:**
- `fingerprint_id`: prefijo `wa_` + número (ej: `wa_573203415438`)
- `source`: `whatsapp_inbound` | `whatsapp_ctwa`
- `device_info`: incluye `channel: 'whatsapp'`, `ctwa_clid`, `ad_id` si viene de anuncio

---

## 6 · SYSTEM PROMPT WHATSAPP v1.1 — REGLAS CLAVE

El prompt está en `knowledge_base/system-prompt-whatsapp-v1.0.md`. Puntos críticos:

- **Máximo 3–4 líneas** por respuesta (WhatsApp no es un blog)
- **Una sola pregunta por mensaje** — regla inquebrantable. Si pide nombre, ESA es la única pregunta
- **M1 exacto**: "Hola. Soy Queswa, el Motor Cognitivo de CreaTuActivo. 🪢 ..."
- **M2 por situación**: copies exactos para empleo / negocio propio / independiente / otro
- **Escalada a humano**: si dice "quiero entrar" o pide precio → notificar a Luis
- **Vocabulario**: no usar MLM, multinivel, downline, ingreso pasivo, libertad financiera

Para actualizar el prompt: editar `knowledge_base/system-prompt-whatsapp-v1.0.md` y ejecutar `node scripts/actualizar-system-prompt-whatsapp-v1.mjs`.

---

## 7 · PENDIENTES TÉCNICOS (para agente Claude Code)

### 7.1 Inmediato — tras verificación Meta
- [ ] Confirmar que mensajes de números reales (fuera de lista de prueba) llegan y son respondidos
- [ ] Agregar `WHATSAPP_WABA_ID` en `.env.local` y Vercel cuando Meta lo muestre
- [ ] Eliminar `SENDPULSE_API_ID` y `SENDPULSE_API_SECRET` de `.env.local` y Vercel (tras confirmar plantilla `acceso_mapa_salida` aprobada)

### 7.2 Plantillas pendientes en Meta WhatsApp Manager
Crear y someter a aprobación en **Meta Business Suite → WhatsApp → Plantillas**:

**Plantilla 1 — `acceso_mapa_salida`** (reemplaza SendPulse, CRÍTICA)
- Categoría: Marketing
- Idioma: es
- Cuerpo: `Hola {{1}}, tu acceso al Mapa de Salida está listo. En los próximos 5 días recibirás las coordenadas exactas para construir tu Patrimonio Paralelo — sin dejar lo que ya tienes. Tu enlace personalizado: {{2}}`
- Variables: `{{1}}` = nombre, `{{2}}` = URL mapa

**Plantillas 2–6 — Secuencia de días (Fase 6 handoff original)**

| Template | Tipo | Texto base |
|---|---|---|
| `dia_0_bienvenida` | Utility | `Hola {{1}}, bienvenido al Mapa de Salida de CreaTuActivo. En los próximos días te muestro exactamente cómo construir un ingreso en paralelo a lo que ya tienes.` |
| `dia_1_problema` | Marketing | `{{1}}, el Plan por Defecto tiene una falla que la mayoría descubre demasiado tarde. Hoy te muestro cuál es — y qué hacen las personas que lograron salir de él.` |
| `dia_3_modelo` | Marketing | `{{1}}, hoy vemos los números. Qué genera el modelo y en qué tiempo. Sin promesas, solo matemática real.` |
| `dia_5_siguiente` | Marketing | `{{1}}, llegaste al día 5. Tienes el mapa completo. La pregunta ahora es: ¿qué vas a hacer con él?` |
| `dia_7_cierre` | Marketing | `{{1}}, una última cosa antes de cerrar esta conversación. Si todavía tienes preguntas, estoy acá.` |

### 7.3 Decisión pendiente
- SendPulse: mantener como respaldo hasta que `acceso_mapa_salida` esté aprobada y probada en producción

---

## 8 · PARA EL AGENTE GEMINI — CAMPAÑAS META

### Contexto del canal WhatsApp para campañas CTWA

**CTWA = Click-To-WhatsApp Ads.** Cuando alguien hace clic en un anuncio Meta con botón "Enviar mensaje", se abre WhatsApp directamente con un mensaje pre-cargado al número `+573215193909`. Ese primer mensaje activa Queswa automáticamente.

**Lo que el sistema detecta y guarda automáticamente de cada anuncio:**
- `ctwa_clid`: click ID único de Meta para atribución
- `ad_id`: ID del anuncio que generó el clic
- `ad_headline`: titular del anuncio
- `ad_source_type`: `"ad"` | `"post"` | `"unknown"`
- `pageContext`: `'whatsapp_ctwa_mapa_de_salida'` si el anuncio menciona "mapa"

**Datos disponibles en Supabase para optimización:**
```sql
SELECT 
  device_info->>'ad_id' as ad_id,
  device_info->>'ad_headline' as titular,
  stage,
  device_info->>'interest_level' as score,
  created_at
FROM prospects
WHERE source = 'whatsapp_ctwa'
ORDER BY created_at DESC;
```

### Recomendaciones para campañas CTWA Mapa de Salida

**CTA del anuncio:** El mensaje pre-cargado al abrir WhatsApp debe ser corto y accionable. Opciones probadas:
- `"MAPA"` — activa el flujo de Queswa inmediatamente
- `"Quiero el mapa"` — más natural, mismo resultado
- `"Información"` — genérico, funciona pero menos calificado

**Audiencias recomendadas:**
- **Fría**: intereses en emprendimiento, negocios, finanzas personales, bienestar
- **Caliente**: retargeting de visitantes de `/mapa-de-salida` que no llenaron el formulario
- **Lookalike**: basada en prospects con `interest_level > 70` en Supabase

**Ventana CTWA:** Meta da 72 horas de conversación gratuita cuando el prospecto inicia desde un anuncio. Queswa debe capturar nombre + correo + calificar dentro de esa ventana.

**Número de WhatsApp para los anuncios:** `+573215193909`

**URL alternativa (si no usan CTWA):** `https://creatuactivo.com/mapa-de-salida`

### Estado de aprobación requerido antes de lanzar campañas
- [ ] Meta business verification completada (modo Live)
- [ ] Plantilla `acceso_mapa_salida` aprobada (para follow-up automático)
- [ ] Al menos 1 número de prueba verificado como funcionando end-to-end

---

## 9 · VERIFICACIÓN DE ESTADO — COMANDOS RÁPIDOS

```bash
# Verificar webhook activo
curl "https://creatuactivo.com/api/whatsapp/webhook?hub.mode=subscribe&hub.verify_token=queswa_webhook_2026&hub.challenge=TEST"
# Debe responder: TEST

# Verificar token Meta permanente
curl "https://graph.facebook.com/v22.0/me?access_token={WHATSAPP_SYSTEM_TOKEN}"
# Debe responder: { "name": "Token Queswa", "id": "122098422776814388" }

# Verificar system prompt WhatsApp activo
node scripts/actualizar-system-prompt-whatsapp-v1.mjs
# Debe mostrar: ✅ RPC verificado: tenant 'whatsapp' → queswa_whatsapp

# Simular mensaje inbound (prueba sin WhatsApp real)
curl -X POST https://creatuactivo.com/api/whatsapp/webhook \
  -H 'Content-Type: application/json' \
  -d '{"entry":[{"changes":[{"value":{"messages":[{"from":"573200000000","type":"text","text":{"body":"hola"}}],"contacts":[{"profile":{"name":"Test"}}]}}]}]}'
```

---

## 10 · HISTORIAL DE DECISIONES TÉCNICAS

| Decisión | Razón |
|---|---|
| Webhook usa Node runtime (no Edge) | Necesita leer el stream completo antes de enviar a Meta |
| `fingerprint_id = "wa_{phone}"` | Distingue prospectos WhatsApp de browser fingerprints en la misma tabla |
| `SUPABASE_SERVICE_ROLE_KEY` en webhook | Evita bloqueos RLS en INSERT de prospects |
| Arsenal clonado (no re-embebido) | Los embeddings Voyage AI son agnósticos al tenant — válidos sin regenerar |
| `whatsapp-meta.ts` mismo interface que `sendpulse.ts` | Migración sin fricción — mismo `sendWhatsAppTemplate(prospect, constructor)` |
| `sendpulse.ts` conservado temporalmente | Respaldo hasta confirmar plantillas aprobadas en Meta |
| Meta API v22.0 | v18.0 generaba warning de deprecación en logs |
