# ✅ Checklist Producción: Reto de 5 Días

**Estado actual**: 85% completo - **Listo para producción en 48 horas**

**Funnel**: Squeeze Page → Bridge Page → Email Sequence (5 días) → Webinar

---

## 🚨 BLOQUEADORES CRÍTICOS (Hacer HOY)

### 1. 🎥 Video Epiphany Bridge (CRÍTICO)

**Estado**: ❌ Falta grabar

**Ubicación**: [src/app/reto-5-dias/gracias/page.tsx](src/app/reto-5-dias/gracias/page.tsx:103-104)

**Por qué es crítico**: La Bridge Page sin video pierde 40% de efectividad. El video genera la "epifanía emocional" que convierte curiosidad en acción.

**Contenido del video** (3 minutos máximo):
- Por qué creé este reto
- Historia personal condensada (las 3 promesas)
- Invitación al reto

**Guión**: Ver [EPIPHANY_BRIDGE_OFICIAL.md](EPIPHANY_BRIDGE_OFICIAL.md) - Sección "60 segundos" + "3 minutos"

**Pasos**:
```bash
# 1. Grabar video (3 min max)
# 2. Optimizar
./scripts/optimize-video.sh /path/to/epiphany-bridge.mp4

# 3. Subir a Vercel Blob
node scripts/upload-to-blob.mjs

# 4. Actualizar Bridge Page con URL
# Editar: src/app/reto-5-dias/gracias/page.tsx líneas 103-104
# Reemplazar placeholder con:
# <video src="URL_FROM_BLOB" autoPlay muted loop playsInline />
```

**Tiempo estimado**: 2 horas

---

### 2. 🗄️ Validar Schema Supabase (CRÍTICO)

**Estado**: ⚠️ Pendiente validación

**Por qué es crítico**: Si faltan columnas en `funnel_leads`, los emails del cron job fallarán silenciosamente.

**Columnas requeridas en tabla `funnel_leads`**:
- `id` (uuid, primary key)
- `email` (text, not null)
- `name` (text)
- `whatsapp` (text)
- `source` (text) - ej: "reto-5-dias"
- `step` (text) - ej: "reto_registered"
- `reto_email_day` (integer) - último día enviado
- `reto_last_email_at` (timestamptz) - fecha último email
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

**Verificar**:
```sql
-- Ejecutar en Supabase SQL Editor
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'funnel_leads'
ORDER BY ordinal_position;
```

**Si faltan columnas**, aplicar:
```sql
ALTER TABLE funnel_leads
ADD COLUMN IF NOT EXISTS reto_email_day INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS reto_last_email_at TIMESTAMPTZ;
```

**Verificar RPC existe**:
```sql
SELECT routine_name FROM information_schema.routines
WHERE routine_name = 'update_prospect_data';
```

**Tiempo estimado**: 30 minutos

---

### 3. 🔑 Configurar Variables en Vercel (CRÍTICO)

**Estado**: ⚠️ Pendiente verificación

**Por qué es crítico**: Sin estas variables, los emails no se envían y el cron job falla.

**Ir a**: Vercel Dashboard → Settings → Environment Variables

**Variables requeridas**:

| Variable | Dónde obtenerla | Test |
|----------|-----------------|------|
| `RESEND_API_KEY` | [resend.com/api-keys](https://resend.com/api-keys) | ✅ Dominio verificado |
| `CRON_SECRET` | Generar: `openssl rand -hex 16` | Solo en Vercel |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Dashboard → Settings → API | Copiar desde .env.local |
| `NEXT_PUBLIC_SUPABASE_URL` | Idem | Ya configurada |

**IMPORTANTE**: `CRON_SECRET` NO debe estar en `.env.local`, solo en Vercel (producción + preview).

**Verificar Resend**:
1. Ir a [resend.com/domains](https://resend.com/domains)
2. Verificar que `creatuactivo.com` tiene DNS configurado
3. Status debe ser "✅ Verified"

**Tiempo estimado**: 30 minutos

---

## 🧪 TEST COMPLETO (Hacer ANTES de producción)

### 4. Test Flow Local

**Ejecutar localmente** (con `.env.local` configurado):

```bash
npm run dev
```

**Pasos de test**:

1. **Squeeze Page**:
   - Ir a [http://localhost:3000/reto-5-dias](http://localhost:3000/reto-5-dias)
   - Llenar formulario (nombre, email, WhatsApp)
   - Click "Reservar mi Cupo GRATIS"
   - ✅ Debe redirigir a `/reto-5-dias/gracias`

2. **Verificar emails** (revisar bandeja + logs):
   - ✅ Email de confirmación "¡Bienvenido al Reto!" llegó
   - ✅ Consola muestra "Email sent successfully"
   - ✅ Admin notification enviada a `hola@creatuactivo.com`

3. **Bridge Page**:
   - Ver `/reto-5-dias/gracias`
   - ✅ Success message visible
   - ✅ Epiphany Bridge story completa
   - ✅ Video visible (o placeholder si aún no lo subiste)
   - ✅ WhatsApp alert visible

4. **Verificar Supabase**:
   - Supabase Dashboard → Table Editor → `funnel_leads`
   - ✅ Registro nuevo con `source: 'reto-5-dias'`
   - ✅ Columna `step: 'reto_registered'`
   - ✅ Columna `reto_email_day: 0`

5. **Test Cron Job** (manual):
   ```bash
   # Crear archivo temporal con CRON_SECRET
   export CRON_SECRET="tu-secret-local"

   # Llamar endpoint
   curl -X GET "http://localhost:3000/api/cron/reto-5-dias" \
     -H "Authorization: Bearer $CRON_SECRET"
   ```

   ✅ Debe retornar JSON con `processed`, `skipped`, `errors`

**Tiempo estimado**: 1 hora

---

### 5. Test Variantes A/B

**Variantes a testear**:

| URL | Hook | Color | Tracking |
|-----|------|-------|----------|
| `/reto-5-dias` | Base (soberanía) | Gold | N/A |
| `/reto-5-dias/dolor` | "Cometí un error que me costó 20 años" | Red | `variant: 'A_dolor'` |
| `/reto-5-dias/analitico` | "¿Cuántos meses podrías vivir?" | Blue | `variant: 'B_analitico'` |
| `/reto-5-dias/global` | "Ya demostraste que puedes sacrificarte" | Green | `variant: 'C_global'` |

**Test cada una**: Registrarse → Verificar que tracking se guarda en Supabase con `source` y `variant` correctos.

**Tiempo estimado**: 30 minutos

---

## 🚀 DEPLOYMENT A PRODUCCIÓN

### 6. Deploy y Smoke Test

**Pre-deploy checklist**:
- ✅ Video Epiphany Bridge subido y URL actualizada
- ✅ Schema Supabase validado
- ✅ Variables Vercel configuradas
- ✅ Test local exitoso

**Deploy**:
```bash
git add .
git commit -m "🚀 feat(reto): Production ready - Video + Schema validated"
git push origin main
```

**Vercel auto-deploya en ~2 minutos**

**Smoke test en producción**:
1. Ir a [https://creatuactivo.com/reto-5-dias](https://creatuactivo.com/reto-5-dias)
2. Registrarse con email real
3. Verificar email llegó
4. Ir a `/reto-5-dias/gracias` - video debe reproducirse
5. Supabase → Verificar registro en `funnel_leads`

**Verificar Cron Job en Vercel**:
- Vercel Dashboard → Cron Jobs tab
- Verificar que `/api/cron/reto-5-dias` aparece
- Schedule: `0 13 * * *` (8:00 AM Colombia)
- **IMPORTANTE**: Primera ejecución será mañana a las 8 AM

**Forzar ejecución inmediata** (solo para test):
```bash
curl -X GET "https://creatuactivo.com/api/cron/reto-5-dias" \
  -H "Authorization: Bearer $CRON_SECRET"
```

**Tiempo estimado**: 1 hora (incluyendo monitoreo)

---

## 📱 POST-LANZAMIENTO (Semana 1)

### 7. Migrar WhatsApp a Producción (ALTA PRIORIDAD)

**Problema actual**: Twilio Sandbox solo envía a números pre-autorizados.

**Opciones**:

#### Opción A: ManyChat (RECOMENDADO)
- **Pros**: Fácil, visual, $15/mes, templates listos
- **Cons**: Requiere Meta Business verification
- **Setup**: [WHATSAPP_MANYCHAT_SETUP.md](WHATSAPP_MANYCHAT_SETUP.md)

#### Opción B: WhatsApp Business API
- **Pros**: Oficial, escalable
- **Cons**: Complejo, $$$ ($500+ setup)
- **Setup**: [TWILIO_WHATSAPP_HANDOFF.md](TWILIO_WHATSAPP_HANDOFF.md)

#### Opción C: Solo Resend + Manual WhatsApp
- **Pros**: Simple, $0 adicional
- **Cons**: No escala, menos conversión
- **Implementación**: Eliminar `sendWhatsAppMessage()` de [src/app/api/funnel/route.ts](src/app/api/funnel/route.ts)

**Recomendación**: Opción A (ManyChat) para lanzamiento rápido, migrar a B si pasas 10K leads/mes.

**Tiempo estimado**: 4-8 horas (depende de verificación Meta)

---

### 8. Implementar A/B Testing Dashboard (NICE-TO-HAVE)

**Goal**: Ver qué variante convierte mejor.

**Métricas a trackear**:
- Conversion rate por variante (A/B/C)
- Reto completion rate (cuántos llegan a Día 5)
- Click-through rate a `/webinar` desde Día 5

**Implementación**:
1. Crear tabla `funnel_analytics` en Supabase
2. Agregar endpoint `/api/analytics/reto-5-dias`
3. Dashboard simple en `/sistema/analytics`

**Tiempo estimado**: 4 horas

---

## 📊 ESTADO DE ARCHIVOS CRÍTICOS

### ✅ Completos y Producción-Ready

| Archivo | Estado | Notas |
|---------|--------|-------|
| [src/app/reto-5-dias/page.tsx](src/app/reto-5-dias/page.tsx) | ✅ | Squeeze page principal |
| [src/app/reto-5-dias/dolor/page.tsx](src/app/reto-5-dias/dolor/page.tsx) | ✅ | Variante A |
| [src/app/reto-5-dias/analitico/page.tsx](src/app/reto-5-dias/analitico/page.tsx) | ✅ | Variante B |
| [src/app/reto-5-dias/global/page.tsx](src/app/reto-5-dias/global/page.tsx) | ✅ | Variante C |
| [src/app/api/funnel/route.ts](src/app/api/funnel/route.ts) | ✅ | API registro + emails |
| [src/app/api/cron/reto-5-dias/route.ts](src/app/api/cron/reto-5-dias/route.ts) | ✅ | Cron job emails |
| [src/emails/reto-5-dias/Dia1-Diagnostico.tsx](src/emails/reto-5-dias/Dia1-Diagnostico.tsx) | ✅ | Email Día 1 |
| [src/emails/reto-5-dias/Dia2-Vehiculos.tsx](src/emails/reto-5-dias/Dia2-Vehiculos.tsx) | ✅ | Email Día 2 |
| [src/emails/reto-5-dias/Dia3-Modelo.tsx](src/emails/reto-5-dias/Dia3-Modelo.tsx) | ✅ | Email Día 3 |
| [src/emails/reto-5-dias/Dia4-Estigma.tsx](src/emails/reto-5-dias/Dia4-Estigma.tsx) | ✅ | Email Día 4 |
| [src/emails/reto-5-dias/Dia5-Invitacion.tsx](src/emails/reto-5-dias/Dia5-Invitacion.tsx) | ✅ | Email Día 5 + CTA webinar |
| [src/emails/Reto5DiasConfirmation.tsx](src/emails/Reto5DiasConfirmation.tsx) | ✅ | Email confirmación |
| [vercel.json](vercel.json) | ✅ | Cron job configurado |

### ⚠️ Pendientes de Actualización

| Archivo | Faltante | Prioridad |
|---------|----------|-----------|
| [src/app/reto-5-dias/gracias/page.tsx](src/app/reto-5-dias/gracias/page.tsx:103-104) | Video Epiphany Bridge | 🚨 CRÍTICA |
| [src/app/reto-5-dias/[ref]/page.tsx](src/app/reto-5-dias/[ref]/page.tsx:32) | Fetch constructor name | 🔶 BAJA |

---

## 🎯 TIMELINE SUGERIDO

### Hoy (Día 1)
- [x] ~~Auditoría completa~~ ✅ (hecho por Claude)
- [ ] 🎥 Grabar video Epiphany Bridge (2h)
- [ ] 🗄️ Validar schema Supabase (30min)
- [ ] 🔑 Configurar Vercel env vars (30min)

### Mañana (Día 2)
- [ ] 🧪 Test completo local (1h)
- [ ] 🚀 Deploy a producción (1h)
- [ ] 📧 Monitorear primer cron job (8 AM)

### Semana 1
- [ ] 📱 Migrar WhatsApp a ManyChat (4-8h)
- [ ] 📊 Implementar A/B tracking (4h)
- [ ] 🔍 Analizar primeras conversiones

---

## 🚦 CRITERIOS DE GO/NO-GO

### ✅ GO si:
- Video Epiphany Bridge subido y funcionando
- Schema Supabase validado (todas las columnas)
- Variables Vercel configuradas correctamente
- Test local 100% exitoso (email + Supabase save)
- Cron job testeado manualmente

### 🛑 NO-GO si:
- Falta video (Bridge Page sin video = 40% menos conversión)
- Schema incompleto (emails fallarán silenciosamente)
- Resend no verificado (emails irán a spam o rebotarán)
- Test local falla (arreglar antes de producción)

---

## 📞 SOPORTE POST-LANZAMIENTO

**Monitorear diariamente** (primera semana):
- Vercel → Functions → `/api/cron/reto-5-dias` logs
- Supabase → `funnel_leads` → Nuevos registros
- Resend Dashboard → Deliverability rate
- Email inbox → Quejas/bounces

**Números clave**:
- **Conversion rate goal**: >15% (squeeze → registro)
- **Email open rate goal**: >25% (Día 1-5)
- **Reto completion goal**: >40% (llegan a Día 5)

---

## ✅ CHECKLIST FINAL

Marcar cuando esté listo:

**Pre-Lanzamiento**:
- [ ] Video Epiphany Bridge grabado y subido
- [ ] Bridge Page actualizada con URL del video
- [ ] Schema Supabase validado (10 columnas en funnel_leads)
- [ ] RPC `update_prospect_data` existe y funciona
- [ ] CRON_SECRET generado y en Vercel
- [ ] RESEND_API_KEY válida y dominio verificado
- [ ] Test local 100% exitoso (squeeze → email → bridge)
- [ ] Test manual cron job exitoso

**Lanzamiento**:
- [ ] Deploy a producción (git push)
- [ ] Smoke test en https://creatuactivo.com/reto-5-dias
- [ ] Email de confirmación recibido
- [ ] Registro visible en Supabase
- [ ] Video reproduce en Bridge Page
- [ ] Cron job programado visible en Vercel

**Post-Lanzamiento**:
- [ ] Primer cron job ejecutado (mañana 8 AM)
- [ ] Email Día 1 recibido
- [ ] WhatsApp migrado a ManyChat/Business API
- [ ] A/B tracking implementado
- [ ] Analytics dashboard configurado

---

**¿Preguntas?** Ver documentación:
- [DEPLOYMENT_DB_QUEUE.md](DEPLOYMENT_DB_QUEUE.md) - Arquitectura cron job
- [EPIPHANY_BRIDGE_OFICIAL.md](EPIPHANY_BRIDGE_OFICIAL.md) - Guión video
- [README_VIDEO_IMPLEMENTATION.md](README_VIDEO_IMPLEMENTATION.md) - Video workflow

---

**Estado**: 📝 Documento creado el 2026-01-19
**Última actualización**: Auditoría completa pre-lanzamiento
