# ✅ CAMBIOS REALIZADOS - Formulario /fundadores (13 Oct 2025)

## 🎯 OBJETIVO
Garantizar que **TODOS los escenarios** de captura de prospectos guarden datos en Supabase antes de enviar emails.

---

## ✅ CAMBIOS IMPLEMENTADOS

### **1. Email destino cambiado** ✅

**Archivo**: `src/app/api/fundadores/route.ts` (línea 169)

**Antes**:
```typescript
to: ['luiscabrejo7@gmail.com', 'lilianapatriciamoreno7@gmail.com'],
```

**Después**:
```typescript
to: 'sistema@creatuactivo.com',
```

**Beneficio**: Centralización de notificaciones en un solo email institucional.

---

### **2. Guardar en base de datos** ✅

**Archivo**: `src/app/api/fundadores/route.ts` (líneas 80-136)

**Funcionalidad agregada**:

```typescript
// 1. Verifica si email ya existe en pending_activations
const { data: existingRequest } = await supabase
  .from('pending_activations')
  .select('id, email, status')
  .eq('email', formData.email.toLowerCase())
  .eq('status', 'pending')
  .single();

// 2. Detecta constructor referente (si existe ?ref= en URL)
const refParam = new URL(request.url).searchParams.get('ref');

// 3. Inserta en pending_activations
const { data: insertedRequest } = await supabase
  .from('pending_activations')
  .insert({
    name: formData.nombre.trim(),
    email: formData.email.toLowerCase().trim(),
    whatsapp: formData.telefono.trim(),
    gano_excel_id: 'PENDING', // Se completa cuando pague
    plan_type: formData.inversion || 'empresarial',
    status: 'pending',
    invited_by: invitedById, // UUID del constructor o null
  });
```

**Características**:
- ✅ Previene duplicados (verifica email existente)
- ✅ Detecta constructor referente automáticamente
- ✅ **Fail-safe**: Si falla INSERT, no bloquea envío de email
- ✅ Logging completo en consola

---

## 📊 COBERTURA DE ESCENARIOS

### **Escenario 1: Interacción con NEXUS** ✅
```
Prospecto → NEXUS chatbot → Claude extrae datos
    ↓
update_prospect_data() RPC
    ↓
nexus_prospects + prospects (sincronización automática)
    ↓
Email al constructor (notificación de stage)
```

**Estado**: ✅ Implementado previamente (commit `cdeeba1`)

---

### **Escenario 2: Formulario /fundadores (Landing)** ✅
```
Prospecto → Llena formulario /fundadores
    ↓
INSERT en pending_activations (NUEVO ✅)
    ↓
Email a sistema@creatuactivo.com (NUEVO ✅)
    ↓
Email confirmación a prospecto
```

**Estado**: ✅ Implementado en este commit (`231a323`)

---

### **Escenario 3: Contacto directo (WhatsApp/Llamada)** ✅
```
Prospecto contacta constructor por WhatsApp
    ↓
Constructor presiona "Activar Constructor" en Dashboard
    ↓
Modal captura: Nombre, Email, WhatsApp, Código Gano Excel
    ↓
INSERT en pending_activations
    ↓
Email a sistema@creatuactivo.com
```

**Estado**: ✅ Implementado previamente (Dashboard)
**Archivo**: `/Users/luiscabrejo/CreaTuActivo-Dashboard/src/app/api/constructor/activate/route.ts`

---

## 🗂️ TABLA `pending_activations`

### **Campos**:
```sql
- id (uuid, PK)
- name (text)
- email (text, UNIQUE)
- whatsapp (text)
- gano_excel_id (text)
- plan_type (text): 'inicial' | 'empresarial' | 'visionario'
- status (text): 'pending' | 'approved' | 'rejected'
- invited_by (uuid, FK → private_users.id)
- created_at (timestamptz)
- approved_at (timestamptz)
- approved_by (uuid)
- rejection_reason (text)
```

### **Queries útiles**:

**Ver todas las solicitudes pendientes**:
```sql
SELECT
  pa.id,
  pa.name,
  pa.email,
  pa.whatsapp,
  pa.gano_excel_id,
  pa.plan_type,
  pa.status,
  pa.created_at,
  pu.name as constructor_name,
  pu.email as constructor_email
FROM pending_activations pa
LEFT JOIN private_users pu ON pu.id = pa.invited_by
WHERE pa.status = 'pending'
ORDER BY pa.created_at DESC;
```

**Ver prospectos sin constructor asignado**:
```sql
SELECT *
FROM pending_activations
WHERE invited_by IS NULL
AND status = 'pending'
ORDER BY created_at DESC;
```

---

## 🚨 ACCIONES PENDIENTES (MANUAL)

### **1. Verificar dominio en Resend** ⏱️ 5 min

**URL**: https://resend.com/domains

**Verificar**:
- ✅ `sistema@creatuactivo.com` está configurado
- ✅ Registros DNS están activos (SPF, DKIM, DMARC)
- ✅ Estado: "Verified"

**Si NO está configurado**:
1. Ir a Resend Dashboard > Domains
2. Add Domain: `creatuactivo.com`
3. Copiar registros DNS
4. Agregar en tu proveedor DNS (Cloudflare/GoDaddy/etc)
5. Esperar verificación (5-30 min)

---

### **2. Aplicar migración SQL (Dashboard)** ⏱️ 5 min

**Archivo**: `/Users/luiscabrejo/CreaTuActivo-Dashboard/supabase/migrations/add_role_to_constructores.sql`

**Pasos**:
1. Ir a: https://supabase.com/dashboard
2. Proyecto: CreaTuActivo
3. SQL Editor > New Query
4. Copiar contenido del archivo
5. **IMPORTANTE**: Actualizar línea 17 con TU email:
   ```sql
   WHERE email IN ('TU_EMAIL_AQUI@gmail.com', 'admin@creatuactivo.com')
   ```
6. Ejecutar
7. Verificar con query al final del archivo

---

### **3. Testing end-to-end** ⏱️ 10 min

**Test 1: Formulario /fundadores**
```
1. Ir a: https://creatuactivo.com/fundadores?ref=constructor-xxx
2. Llenar formulario con datos de prueba
3. Enviar
4. Verificar:
   - Email llegó a sistema@creatuactivo.com ✅
   - Email confirmación llegó al prospecto ✅
   - Registro en Supabase > pending_activations ✅
   - Campo invited_by tiene UUID del constructor ✅
```

**Test 2: Modal Dashboard**
```
1. Login en: https://app.creatuactivo.com
2. Dashboard > Botón "Activar Constructor"
3. Llenar datos
4. Enviar
5. Verificar:
   - Email llegó a sistema@creatuactivo.com ✅
   - Registro en pending_activations ✅
```

**Test 3: NEXUS chatbot**
```
1. Ir a: https://creatuactivo.com?ref=constructor-xxx
2. Interactuar con NEXUS
3. Proporcionar: nombre, ocupación, teléfono
4. Verificar:
   - Email al constructor cuando avanza stage ✅
   - Registro en nexus_prospects ✅
   - Registro en prospects (sincronizado) ✅
```

---

## 📈 MÉTRICAS ESPERADAS

Después del deploy, deberías ver:

**Supabase Dashboard**:
- `pending_activations`: Incremento de registros
- `nexus_prospects`: Datos sincronizados con `prospects`
- Constructor puede ver prospectos en `/admin/prospectos`

**Resend Dashboard**:
- Emails enviados a `sistema@creatuactivo.com`
- Tasa de entrega: >95%
- Bounces: 0%

---

## 🔗 ARCHIVOS MODIFICADOS

### **Proyecto Marketing**:
- ✅ `src/app/api/fundadores/route.ts` (66 líneas agregadas)

### **Proyecto Dashboard** (commits previos):
- ✅ `supabase/migrations/add_role_to_constructores.sql`
- ✅ `src/middleware.ts`
- ✅ `src/app/admin/prospectos/page.tsx`
- ✅ `src/app/admin/analytics/page.tsx`
- ✅ `src/components/NodeXSidebar.tsx`

---

## 🎯 PRÓXIMOS PASOS SUGERIDOS

### **Corto Plazo** (1-2 semanas):

1. **Panel `/prospectos` para constructores**:
   - Vista filtrada: solo SUS prospectos
   - Tabs: INICIAR / ACOGER / ACTIVAR
   - Sin exportación CSV (solo admin)

2. **Slug amigable para enlaces**:
   - `?ref=luis-cabrejo001` en lugar de `?ref=constructor-b14d377a`
   - Campo `slug_amigable` en `constructores`
   - UI para editarlo en `/perfil`

3. **Notificación cuando admin activa constructor**:
   - Trigger en `private_users` INSERT
   - Email al constructor patrocinador
   - Template: "Tu referido [Nombre] fue activado"

### **Mediano Plazo** (1 mes):

4. **Dashboard de constructor mejorado**:
   - Gráfico de funnel personal
   - Timeline de interacciones
   - Métricas de conversión

5. **Integración WhatsApp Business API**:
   - Envío automático de mensajes
   - Templates aprobados
   - Respuestas automáticas

---

## ✅ CHECKLIST DE DEPLOYMENT

- [x] Código committed y pushed
- [x] Email destino cambiado a `sistema@creatuactivo.com`
- [x] INSERT en `pending_activations` implementado
- [x] Prevención de duplicados
- [x] Logging completo
- [ ] Dominio `sistema@creatuactivo.com` verificado en Resend
- [ ] Migración SQL aplicada en Supabase
- [ ] Testing end-to-end completado
- [ ] Vercel auto-deploy confirmado

---

**Commit**: `231a323`
**Fecha**: 13 Octubre 2025
**Desarrollado por**: Claude Code + Luis Cabrejo
**Proyecto**: CreaTuActivo Marketing
