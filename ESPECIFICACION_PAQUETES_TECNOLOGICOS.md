# Especificación: Sistema de Paquetes Tecnológicos Automáticos
## CreaTuActivo.com - NodeX Platform

**Fecha:** 19 Noviembre 2025
**Objetivo:** Asignar automáticamente paquetes tecnológicos según paquete empresarial comprado + aplicar límites

---

## 📊 MAPEO: Paquete Empresarial → Paquete Tecnológico

| Paquete Empresarial (Gano Excel) | Precio USD | Precio COP | → Paquete Tecnológico | Meses Cortesía | Valor Mensual |
|----------------------------------|-----------|------------|----------------------|----------------|---------------|
| **Constructor Inicial** | $200 | $900,000 | **Plan Cimiento** | 2 meses | $25 USD / $112,500 COP |
| **Constructor Empresarial** | $500 | $2,250,000 | **Plan Estructura** | 4 meses | $49 USD / $220,500 COP |
| **Constructor Visionario** | $1,000 | $4,500,000 | **Plan Rascacielos** | 6 meses | $99 USD / $445,500 COP |

**Adicional:** Existe **Plan Explorador** (Gratis) para quienes no compran paquete empresarial

---

## 🎯 LÍMITES POR PLAN TECNOLÓGICO

### Plan Explorador (Gratis)
- ✅ **Prospectos en NodeX:** 30
- ✅ **Conversaciones NEXUS/mes:** 30
- ✅ **Límite por conversación:** 2 minutos
- ✅ **Acceso diario NodeX:** 30 minutos/día
- ✅ **Constructores en red:** 1 (solo tú)
- ✅ **Analíticas:** Básicas
- ✅ **Academia:** Nivel Fundamentos
- ✅ **Marca:** "Powered by CreaTuActivo.com" visible
- ✅ **Soporte:** Vía Comunidad
- ❌ **ACE Assistant:** No incluido
- ❌ **Exportar datos:** No permitido
- ❌ **Panel de red:** No disponible

### Plan Cimiento ($25 USD/mes)
- ✅ **Prospectos en NodeX:** 200
- ✅ **Conversaciones NEXUS/mes:** 100
- ✅ **Límite por conversación:** 5 minutos
- ✅ **Acceso diario NodeX:** 2 horas/día
- ✅ **Constructores en red:** 1 (solo tú)
- ✅ **Analíticas:** Básicas
- ✅ **Academia:** Nivel Fundamentos
- ✅ **ACE Assistant:** Incluido
- ✅ **Marca:** Eliminada (white-label)
- ✅ **Soporte:** Vía Comunidad
- ❌ **Exportar datos:** No permitido
- ❌ **Panel de red:** No disponible

### Plan Estructura ($49 USD/mes) - MÁS POPULAR
- ✅ **Prospectos en NodeX:** 500
- ✅ **Conversaciones NEXUS/mes:** 500
- ✅ **Límite por conversación:** 10 minutos
- ✅ **Acceso diario NodeX:** 4 horas/día
- ✅ **Constructores en red:** Hasta 3
- ✅ **Analíticas:** Avanzadas
- ✅ **Academia:** Nivel Arquitectura Avanzada
- ✅ **ACE Assistant:** Incluido
- ✅ **Panel de red:** Panel Básico de Gestión de Red
- ✅ **Exportar datos:** A hojas de cálculo (Excel/CSV)
- ✅ **Soporte:** Prioritario por Chat

### Plan Rascacielos ($99 USD/mes)
- ✅ **Prospectos en NodeX:** ILIMITADOS
- ✅ **Conversaciones NEXUS/mes:** ILIMITADAS
- ✅ **Límite por conversación:** SIN LÍMITES
- ✅ **Acceso diario NodeX:** 24/7 COMPLETO
- ✅ **Constructores en red:** Hasta 10+
- ✅ **Analíticas:** Avanzadas + Panel de Red
- ✅ **Academia:** Nivel Maestría
- ✅ **ACE Assistant:** Incluido
- ✅ **Panel de red:** Panel Avanzado de Gestión de Red
- ✅ **Exportar datos:** A hojas de cálculo (Excel/CSV)
- ✅ **Soporte:** Dedicado + 1 Sesión 1-a-1/mes

---

## 🔄 FLUJO DE ASIGNACIÓN AUTOMÁTICA

### Flujo Actual (Antes del Sistema)
```
1. Prospecto compra paquete en Gano Excel
2. Mentor solicita activación → pending_activations
3. Email a sistema@creatuactivo.com
4. Administración confirma paquete con Gano Excel
5. ❌ NO hay asignación de paquete tech
6. Administración activa → Magic Link
7. Constructor accede a Dashboard
8. ❌ NO tiene paquete tech asignado
```

### Flujo Deseado (Con el Sistema)
```
1. Prospecto compra paquete en Gano Excel
2. Mentor solicita activación → pending_activations
3. Email a sistema@creatuactivo.com
4. Administración recibe solicitud en panel
5. ✅ NUEVO: Admin confirma paquete empresarial comprado
6. ✅ NUEVO: Sistema asigna automáticamente paquete tech + cortesías
7. ✅ NUEVO: Se calcula fecha de vencimiento (hoy + meses cortesía)
8. Administración activa → Magic Link
9. Constructor accede a Dashboard
10. ✅ Paquete tech ya asignado y activo con cortesías
```

---

## 💾 ESTRUCTURA DE BASE DE DATOS

### Campos Nuevos en `pending_activations`

```sql
ALTER TABLE pending_activations ADD COLUMN IF NOT EXISTS
  -- Paquete empresarial confirmado por admin
  confirmed_business_package VARCHAR(50), -- 'inicial', 'empresarial', 'visionario'

  -- Paquete tecnológico asignado automáticamente
  tech_package VARCHAR(50), -- 'explorador', 'cimiento', 'estructura', 'rascacielos'

  -- Cortesía aplicada
  courtesy_months INTEGER DEFAULT 0,
  tech_package_start_date TIMESTAMP,
  tech_package_expiry_date TIMESTAMP,

  -- Control de asignación
  tech_assigned_by UUID REFERENCES auth.users(id),
  tech_assigned_at TIMESTAMP,

  -- Notas del admin
  admin_notes TEXT;
```

### Campos Nuevos en `private_users` (cuando se activa)

```sql
ALTER TABLE private_users ADD COLUMN IF NOT EXISTS
  -- Paquete tecnológico activo
  current_tech_package VARCHAR(50) DEFAULT 'explorador',
  tech_package_start_date TIMESTAMP,
  tech_package_expiry_date TIMESTAMP,

  -- Histórico de cortesías
  total_courtesy_months_received INTEGER DEFAULT 0,

  -- Estado de suscripción
  tech_subscription_status VARCHAR(20) DEFAULT 'courtesy', -- 'courtesy', 'active', 'expired', 'cancelled'

  -- Límites y uso actual
  monthly_prospect_limit INTEGER DEFAULT 30,
  monthly_nexus_limit INTEGER DEFAULT 30,
  chat_time_limit_minutes INTEGER DEFAULT 2,
  daily_access_limit_minutes INTEGER DEFAULT 30,
  network_size_limit INTEGER DEFAULT 1,

  -- Contadores de uso (resetean cada mes)
  current_month_prospects_used INTEGER DEFAULT 0,
  current_month_nexus_used INTEGER DEFAULT 0,
  current_month_access_minutes INTEGER DEFAULT 0,
  usage_reset_date TIMESTAMP;
```

---

## 🖥️ PANEL DE ADMINISTRACIÓN (Dashboard)

### Ubicación Propuesta
`/Users/luiscabrejo/Cta/Dashboard/src/app/admin/activations/page.tsx`

### Funcionalidades del Panel

#### Vista Principal: Lista de Solicitudes Pendientes
```typescript
interface PendingActivation {
  id: string
  name: string
  email: string
  whatsapp: string
  plan_type: 'inicial' | 'estrategico' | 'visionario' | 'asesoria'
  invited_by: string // Nombre del mentor
  created_at: string
  status: 'pending' | 'confirmed' | 'activated'

  // Nuevos campos
  confirmed_business_package?: string
  tech_package?: string
  courtesy_months?: number
  tech_package_expiry_date?: string
}
```

#### Acciones por Solicitud

**1. Confirmar Paquete Empresarial**
- Dropdown: Inicial / Empresarial / Visionario
- Auto-completa con `plan_type` del formulario (pero editable)
- Trigger automático de asignación de tech package

**2. Asignación Automática (Trigger)**
```typescript
function autoAssignTechPackage(businessPackage: string) {
  const mapping = {
    'inicial': {
      tech: 'cimiento',
      months: 2,
      limits: { prospects: 200, nexus: 100, chatTime: 5, dailyAccess: 120, network: 1 }
    },
    'empresarial': {
      tech: 'estructura',
      months: 4,
      limits: { prospects: 500, nexus: 500, chatTime: 10, dailyAccess: 240, network: 3 }
    },
    'visionario': {
      tech: 'rascacielos',
      months: 6,
      limits: { prospects: -1, nexus: -1, chatTime: -1, dailyAccess: -1, network: 10 } // -1 = ilimitado
    }
  }

  const config = mapping[businessPackage]
  const expiryDate = addMonths(new Date(), config.months)

  return {
    tech_package: config.tech,
    courtesy_months: config.months,
    tech_package_start_date: new Date(),
    tech_package_expiry_date: expiryDate,
    ...config.limits
  }
}
```

**3. Activar Constructor**
- Crea usuario en `private_users`
- Copia datos de tech package asignado
- Envía Magic Link
- Cambia status a `activated`

#### UI del Panel (Wireframe)

```
┌─────────────────────────────────────────────────────────────┐
│  Solicitudes de Activación Pendientes                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  🔍 Filtrar: [Todas ▼] [Buscar...]                         │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ 📋 Ricardo Toledo                                     │  │
│  │ ✉️  ricardo234@gmail.com | 📱 +57 310 123 4567       │  │
│  │ 👤 Mentor: Luis Cabrejo Parra                         │  │
│  │ 📅 Solicitado: 18 Nov 2025, 10:30 PM                 │  │
│  │                                                        │  │
│  │ Paquete del Formulario: Estratégico                   │  │
│  │                                                        │  │
│  │ ┌────────────────────────────────────────────────┐   │  │
│  │ │ 1️⃣ Confirmar Paquete Empresarial (Gano Excel) │   │  │
│  │ │ [Inicial ▼] [Empresarial ✓] [Visionario ▼]    │   │  │
│  │ └────────────────────────────────────────────────┘   │  │
│  │                                                        │  │
│  │ ✅ Auto-Asignación Tecnológica:                       │  │
│  │    Plan Estructura ($49/mes)                          │  │
│  │    4 Meses de Cortesía                                │  │
│  │    Vence: 19 Mar 2026                                 │  │
│  │                                                        │  │
│  │ Límites: 500 prospectos | 500 NEXUS | 10min/chat     │  │
│  │                                                        │  │
│  │ 📝 Notas Admin: [Campo de texto opcional]            │  │
│  │                                                        │  │
│  │ [🚀 Activar & Enviar Magic Link]  [❌ Rechazar]      │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## ⚙️ APLICACIÓN DE LÍMITES EN LA TECNOLOGÍA

### Lugares Donde Validar Límites

#### 1. Dashboard NodeX - Prospectos
**Archivo:** `/Users/luiscabrejo/Cta/Dashboard/src/app/dashboard/page.tsx`

```typescript
// Antes de crear nuevo prospecto
const { data: user } = await supabase
  .from('private_users')
  .select('current_month_prospects_used, monthly_prospect_limit')
  .single()

if (user.monthly_prospect_limit !== -1 &&
    user.current_month_prospects_used >= user.monthly_prospect_limit) {
  throw new Error(`Límite alcanzado. Tu plan permite ${user.monthly_prospect_limit} prospectos/mes.`)
}

// Incrementar contador
await supabase.rpc('increment_prospect_usage')
```

#### 2. NEXUS - Conversaciones
**Archivo:** `/Users/luiscabrejo/Cta/Dashboard/src/app/api/nexus/route.ts`

```typescript
// Antes de iniciar conversación
const { data: user } = await supabase
  .from('private_users')
  .select('current_month_nexus_used, monthly_nexus_limit, chat_time_limit_minutes')
  .single()

if (user.monthly_nexus_limit !== -1 &&
    user.current_month_nexus_used >= user.monthly_nexus_limit) {
  throw new Error(`Límite de conversaciones alcanzado. Tu plan permite ${user.monthly_nexus_limit}/mes.`)
}

// Middleware de tiempo
const conversationStartTime = Date.now()
const maxDuration = user.chat_time_limit_minutes * 60 * 1000

// En streaming, cortar si excede tiempo
if (user.chat_time_limit_minutes !== -1 &&
    (Date.now() - conversationStartTime) > maxDuration) {
  stream.abort()
  return { message: 'Tiempo límite de conversación alcanzado. Actualiza tu plan para conversaciones más largas.' }
}
```

#### 3. NodeX - Acceso Diario
**Archivo:** Middleware global o componente raíz del Dashboard

```typescript
// Al entrar a NodeX
const { data: user } = await supabase
  .from('private_users')
  .select('current_month_access_minutes, daily_access_limit_minutes')
  .single()

const todayMinutes = calculateTodayMinutes(user.session_logs)

if (user.daily_access_limit_minutes !== -1 &&
    todayMinutes >= user.daily_access_limit_minutes) {
  return <AccessLimitReached plan={user.current_tech_package} />
}

// Track tiempo en sesión
startSessionTimer()
```

#### 4. Red de Constructores
**Archivo:** `/Users/luiscabrejo/Cta/Dashboard/src/app/mi-red/page.tsx`

```typescript
// Antes de invitar nuevo constructor
const { data: user } = await supabase
  .from('private_users')
  .select('network_size_limit')
  .single()

const { count: currentNetworkSize } = await supabase
  .from('private_users')
  .select('*', { count: 'exact' })
  .eq('invited_by', user.id)

if (user.network_size_limit !== -1 &&
    currentNetworkSize >= user.network_size_limit) {
  throw new Error(`Límite de red alcanzado. Tu plan permite hasta ${user.network_size_limit} constructores.`)
}
```

#### 5. Exportar Datos
**Archivo:** `/Users/luiscabrejo/Cta/Dashboard/src/app/api/export/route.ts`

```typescript
// Antes de exportar
const { data: user } = await supabase
  .from('private_users')
  .select('current_tech_package')
  .single()

const allowedPlans = ['estructura', 'rascacielos']

if (!allowedPlans.includes(user.current_tech_package)) {
  throw new Error('Función disponible solo en Plan Estructura o superior.')
}

// Proceder con exportación a Excel/CSV
```

---

## 📅 RESETEO MENSUAL DE CONTADORES

### Cron Job (Supabase Edge Function)
**Archivo:** `supabase/functions/reset-monthly-usage/index.ts`

```typescript
// Ejecutar cada 1ro del mes a las 00:00 UTC
Deno.cron("Reset monthly usage", "0 0 1 * *", async () => {
  const { error } = await supabase
    .from('private_users')
    .update({
      current_month_prospects_used: 0,
      current_month_nexus_used: 0,
      current_month_access_minutes: 0,
      usage_reset_date: new Date()
    })
    .neq('id', '00000000-0000-0000-0000-000000000000')

  if (error) {
    console.error('Error resetting usage:', error)
  } else {
    console.log('Monthly usage reset successful')
  }
})
```

---

## 🎨 COMPONENTES UI NECESARIOS

### 1. Badge de Plan Actual
```typescript
// /Users/luiscabrejo/Cta/Dashboard/src/components/TechPlanBadge.tsx
export function TechPlanBadge({ plan }: { plan: string }) {
  const config = {
    explorador: { color: 'green', icon: Gift, label: 'Explorador' },
    cimiento: { color: 'blue', icon: Zap, label: 'Cimiento' },
    estructura: { color: 'purple', icon: Rocket, label: 'Estructura' },
    rascacielos: { color: 'yellow', icon: Crown, label: 'Rascacielos' }
  }

  const { color, icon: Icon, label } = config[plan] || config.explorador

  return (
    <div className={`flex items-center gap-2 px-3 py-1 rounded-full bg-${color}-500/20 border border-${color}-500/50`}>
      <Icon size={16} className={`text-${color}-400`} />
      <span className="text-sm font-semibold text-white">{label}</span>
    </div>
  )
}
```

### 2. Progress Bar de Uso
```typescript
// /Users/luiscabrejo/Cta/Dashboard/src/components/UsageProgressBar.tsx
export function UsageProgressBar({
  used,
  limit,
  label,
  type
}: {
  used: number
  limit: number // -1 = ilimitado
  label: string
  type: 'prospects' | 'nexus' | 'time'
}) {
  if (limit === -1) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-slate-400">{label}:</span>
        <span className="text-sm font-bold text-green-400">Ilimitado ∞</span>
      </div>
    )
  }

  const percentage = (used / limit) * 100
  const isWarning = percentage >= 80
  const isDanger = percentage >= 95

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="text-slate-400">{label}</span>
        <span className={`font-semibold ${isDanger ? 'text-red-400' : isWarning ? 'text-yellow-400' : 'text-blue-400'}`}>
          {used} / {limit}
        </span>
      </div>
      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all ${isDanger ? 'bg-red-500' : isWarning ? 'bg-yellow-500' : 'bg-blue-500'}`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
    </div>
  )
}
```

### 3. Modal de Upgrade
```typescript
// /Users/luiscabrejo/Cta/Dashboard/src/components/UpgradePlanModal.tsx
export function UpgradePlanModal({
  currentPlan,
  limitType
}: {
  currentPlan: string
  limitType: 'prospects' | 'nexus' | 'time' | 'network'
}) {
  const suggestions = {
    explorador: 'cimiento',
    cimiento: 'estructura',
    estructura: 'rascacielos'
  }

  const suggestedPlan = suggestions[currentPlan]

  return (
    <div className="bg-slate-800 p-6 rounded-xl border border-yellow-500/50">
      <h3 className="text-xl font-bold text-white mb-4">Límite Alcanzado</h3>
      <p className="text-slate-300 mb-6">
        Has alcanzado el límite de tu Plan {currentPlan}.
        Actualiza a {suggestedPlan} para continuar creciendo.
      </p>
      <Link href="/planes" className="btn-primary">
        Ver Planes Disponibles
      </Link>
    </div>
  )
}
```

---

## 🧪 PLAN DE TESTING

### Test Cases Críticos

#### TC-01: Asignación Automática
```
DADO un admin que confirma paquete "empresarial"
CUANDO selecciona el paquete en el panel
ENTONCES:
  - tech_package = 'estructura'
  - courtesy_months = 4
  - tech_package_expiry_date = hoy + 4 meses
  - Se actualizan límites según Plan Estructura
```

#### TC-02: Límite de Prospectos
```
DADO un usuario con Plan Cimiento (200 prospectos)
CUANDO intenta crear el prospecto #201
ENTONCES:
  - Se muestra error "Límite alcanzado"
  - Se sugiere upgrade a Plan Estructura
  - NO se crea el prospecto
```

#### TC-03: Límite de Tiempo NEXUS
```
DADO un usuario con Plan Cimiento (5 min/chat)
CUANDO una conversación NEXUS alcanza 5:00 minutos
ENTONCES:
  - Se corta el streaming
  - Se muestra mensaje de límite
  - Se sugiere upgrade
```

#### TC-04: Vencimiento de Cortesía
```
DADO un usuario con 2 meses de cortesía (Plan Cimiento)
CUANDO pasan 2 meses desde tech_package_start_date
ENTONCES:
  - tech_subscription_status cambia a 'expired'
  - Se downgrade automático a Plan Explorador
  - Se notifica por email
```

#### TC-05: Upgrade Manual
```
DADO un usuario con Plan Cimiento vencido
CUANDO paga suscripción de Plan Estructura
ENTONCES:
  - Se actualizan límites a Plan Estructura
  - courtesy_months no se suma (ya fue usado)
  - tech_subscription_status = 'active'
```

---

## 📦 ARCHIVOS A CREAR/MODIFICAR

### Backend (Marketing + Dashboard)

#### Marketing
- `src/app/api/fundadores/route.ts` - Ya existe, sin cambios necesarios
- `supabase/migrations/add_tech_packages.sql` - CREAR

#### Dashboard
- `src/app/admin/activations/page.tsx` - CREAR
- `src/app/admin/activations/components/ActivationCard.tsx` - CREAR
- `src/app/api/admin/activate-constructor/route.ts` - CREAR
- `src/components/TechPlanBadge.tsx` - CREAR
- `src/components/UsageProgressBar.tsx` - CREAR
- `src/components/UpgradePlanModal.tsx` - CREAR
- `src/middleware/checkPlanLimits.ts` - CREAR
- `src/hooks/usePlanLimits.ts` - CREAR

#### Supabase Edge Functions
- `supabase/functions/reset-monthly-usage/index.ts` - CREAR
- `supabase/functions/check-expiry-and-downgrade/index.ts` - CREAR

---

## 🚀 PLAN DE IMPLEMENTACIÓN (Fases)

### Fase 1: Base de Datos (1-2 días)
- [ ] Crear migration con nuevos campos
- [ ] Crear RPCs para asignación automática
- [ ] Crear RPCs para validación de límites
- [ ] Seed inicial con configuración de planes

### Fase 2: Panel de Admin (2-3 días)
- [ ] UI de lista de solicitudes pendientes
- [ ] Dropdown de confirmación de paquete
- [ ] Lógica de auto-asignación
- [ ] Botón de activación + Magic Link
- [ ] Vista de historial de activaciones

### Fase 3: Aplicación de Límites (3-4 días)
- [ ] Middleware global de validación
- [ ] Límite de prospectos en NodeX
- [ ] Límite de conversaciones NEXUS
- [ ] Límite de tiempo por chat
- [ ] Límite de acceso diario
- [ ] Límite de red de constructores
- [ ] Restricción de exportación de datos

### Fase 4: Componentes UI (1-2 días)
- [ ] Badge de plan actual
- [ ] Progress bars de uso
- [ ] Modals de límite alcanzado
- [ ] Página de upgrade de plan

### Fase 5: Automatizaciones (1-2 días)
- [ ] Cron job de reseteo mensual
- [ ] Cron job de vencimiento de cortesías
- [ ] Emails de notificación
- [ ] Downgrade automático

### Fase 6: Testing (2-3 días)
- [ ] Test de asignación automática
- [ ] Test de límites
- [ ] Test de vencimiento
- [ ] Test de upgrade/downgrade
- [ ] Test end-to-end

**TOTAL ESTIMADO: 10-16 días**

---

## 💰 CASOS ESPECIALES

### Caso 1: Constructor sin Paquete Empresarial
- **Situación:** Alguien quiere usar NodeX sin comprar en Gano Excel
- **Solución:** Plan Explorador (gratis) disponible siempre
- **Limitaciones:** Ver tabla de límites Plan Explorador

### Caso 2: Upgrade Antes de Vencer Cortesía
- **Situación:** Usuario quiere Plan Rascacielos pero tiene Cimiento con cortesía
- **Solución:** Puede pagar upgrade, cortesía restante se pierde
- **Alternativa:** Esperar a que termine cortesía

### Caso 3: Downgrade Voluntario
- **Situación:** Usuario con Plan Rascacielos quiere bajar a Estructura
- **Solución:** Permitido, pero límites se aplican inmediatamente
- **Advertencia:** Datos existentes pueden exceder nuevo límite

### Caso 4: Renovación Automática
- **Situación:** Cortesía vence, ¿se cobra automáticamente?
- **Solución Propuesta:** NO auto-renovación. Downgrade a Explorador + email de aviso
- **Razón:** Evitar cargos sorpresa

---

## 📧 EMAILS AUTOMÁTICOS

### Email 1: Bienvenida con Cortesía
**Asunto:** ✅ Tu Plan {tech_package} está activo con {months} meses de cortesía

```
Hola {nombre},

¡Bienvenido a CreaTuActivo.com!

Tu paquete empresarial {business_package} incluye:

🎁 {courtesy_months} Meses de Cortesía
📦 Plan {tech_package} ($XX USD/mes de valor)
📅 Válido hasta: {expiry_date}

Límites de tu plan:
✅ {prospect_limit} Prospectos en NodeX
✅ {nexus_limit} Conversaciones NEXUS/mes
✅ {time_limit} minutos por conversación
✅ {access_limit} acceso diario

Accede a tu Dashboard:
[Magic Link]

¡Empieza a construir tu activo!

Luis & Liliana
CreaTuActivo.com
```

### Email 2: Recordatorio (7 días antes de vencer)
**Asunto:** ⏰ Tu cortesía vence en 7 días - Plan {tech_package}

### Email 3: Cortesía Vencida
**Asunto:** ⚠️ Tu Plan {tech_package} ha vencido - Ahora en Plan Explorador

---

## 🔐 SEGURIDAD Y PERMISOS

### Roles de Usuario

| Rol | Permisos |
|-----|----------|
| `admin` | Activar constructores, asignar paquetes, ver todas las solicitudes |
| `constructor` | Ver su propio plan, uso, actualizar plan (pago) |
| `mentor` | Solicitar activaciones para su red |

### RLS Policies

```sql
-- Solo admins pueden actualizar pending_activations
CREATE POLICY "Admins can manage activations" ON pending_activations
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM private_users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Constructores solo ven su propio plan
CREATE POLICY "Users see own plan" ON private_users
  FOR SELECT
  USING (id = auth.uid());
```

---

## 📊 MÉTRICAS A TRACKEAR

1. **Asignaciones por Plan**
   - Cuántos constructores en cada plan
   - Promedio de cortesías usadas

2. **Uso de Límites**
   - % de usuarios que alcanzan límites
   - Qué límite se alcanza más

3. **Conversión**
   - % que upgraden de Explorador → Cimiento
   - % que upgraden antes de vencer cortesía

4. **Churn**
   - % que downgrade a Explorador al vencer cortesía
   - Tiempo promedio antes de upgrade

---

## ✅ CHECKLIST DE DEFINICIÓN DE "HECHO"

- [ ] Schema de BD implementado y migrado
- [ ] Panel de admin funcional
- [ ] Asignación automática funciona correctamente
- [ ] Todos los límites se aplican
- [ ] Componentes UI creados y testeados
- [ ] Cron jobs configurados
- [ ] Emails funcionando
- [ ] Tests E2E pasando
- [ ] Documentación actualizada
- [ ] Deploy a producción exitoso

---

**Preparado por:** Claude Code (Anthropic)
**Para:** CreaTuActivo.com - Sistema de Paquetes Tecnológicos
**Versión:** 1.0
**Fecha:** 19 Noviembre 2025
