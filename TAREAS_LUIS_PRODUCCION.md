# 📋 TAREAS DE LUIS - CHECKLIST DE PRODUCCIÓN

**Última actualización**: 19 de enero de 2026

---

## 🎥 VIDEOS A GRABAR (6 videos totales)

### 1. Video Epiphany Bridge (CRÍTICO - BLOQUEADOR)

**Destino**: Bridge Page ([src/app/reto-5-dias/gracias/page.tsx:103-104](src/app/reto-5-dias/gracias/page.tsx#L103-L104))

**Cuándo se ve**: Inmediatamente después de que el usuario se registra al Reto de 5 Días

**Duración**: 3 minutos máximo

**Contenido**: Ver [EPIPHANY_BRIDGE_OFICIAL.md](EPIPHANY_BRIDGE_OFICIAL.md) - Sección "3 minutos"

**Por qué es crítico**: Sin este video, la Bridge Page pierde 40% de efectividad emocional

**Guión condensado**:
- Hook: Por qué creé este reto (30 seg)
- Historia personal: Las 3 promesas + el punto de quiebre (2 min)
- CTA: Qué esperar en los próximos 5 días (30 seg)

**Pasos después de grabar**:
```bash
# 1. Optimizar video
./scripts/optimize-video.sh /path/to/epiphany-bridge.mp4

# 2. Subir a Vercel Blob
node scripts/upload-to-blob.mjs

# 3. Actualizar Bridge Page con URL
# Editar: src/app/reto-5-dias/gracias/page.tsx líneas 103-104
```

**Estado**: [ ] Pendiente

---

### 2-6. Videos Reto de 5 Días (WhatsApp + Redes)

**Destino**: WhatsApp (manual) + YouTube/Instagram/Facebook

**Cuándo se envían**: Días 1-5 (complementan los emails de texto)

**Duración**: 10-15 minutos cada uno

**Guión completo**: Ver [GUIONES_RETO_5_DIAS.md](GUIONES_RETO_5_DIAS.md)

**Estrategia**:
- Los emails de texto se envían automáticamente (cron job)
- Los videos se distribuyen manualmente por WhatsApp/redes sociales
- Los videos dan profundidad emocional; los emails dan instrucciones

---

#### Video DÍA 1: El Diagnóstico

**Título**: "¿Cuántos días podrías vivir si mañana dejaras de trabajar?"

**Hook**: "Hay una pregunta que nadie te hace, pero que define si serás libre o esclavo..."

**Contenido**:
- Tu historia personal (cero días de libertad a los 40)
- La fórmula: Días de Libertad = (Ingreso pasivo ÷ Gastos) × 30
- El problema: Nadie te enseña a construir activos

**CTA**: "Calcula tu número. Mañana te muestro los 3 vehículos financieros."

**Guión**: [GUIONES_RETO_5_DIAS.md líneas 32-132](GUIONES_RETO_5_DIAS.md#L32-L132)

**Estado**: [ ] Pendiente

---

#### Video DÍA 2: Los Vehículos

**Título**: "Los 3 vehículos financieros: ¿En cuál estás tú?"

**Hook**: "El 99% fracasa no por falta de esfuerzo, sino porque está en el vehículo equivocado."

**Contenido**:
- Vehículo 1: Empleo (techo = sueldo, días de libertad = 0-30)
- Vehículo 2: Negocio propio (compras un empleo, días = 0-30)
- Vehículo 3: Cartera de Activos (días = ilimitados)

**CTA**: "Identifica en qué vehículo estás. Mañana te muestro mi modelo específico."

**Guión**: [GUIONES_RETO_5_DIAS.md líneas 135-236](GUIONES_RETO_5_DIAS.md#L135-L236)

**Estado**: [ ] Pendiente

---

#### Video DÍA 3: El Nuevo Modelo

**Título**: "El modelo que me llevó de 0 días a soberano en 2.5 años"

**Hook**: "Después de 20 años trabajando, encontré un modelo diferente..."

**Contenido**:
- Tu epifanía: buscar alternativas (bienes raíces, acciones, franquicias)
- El modelo de distribución con consumo recurrente
- Los 3 modos: Analógico, Híbrido, 100% Digital
- Cómo CreaTuActivo.com permite escalamiento sin depender de ti

**CTA**: "Pregúntate: ¿Qué modo me funcionaría mejor? Mañana: el estigma."

**Guión**: [GUIONES_RETO_5_DIAS.md líneas 239-357](GUIONES_RETO_5_DIAS.md#L239-L357)

**Estado**: [ ] Pendiente

---

#### Video DÍA 4: El Estigma

**Título**: "Por qué el 97% fracasa (y cómo no ser uno de ellos)"

**Hook**: "El network marketing tiene mala fama. Y con razón. Hoy te explico por qué."

**Contenido**:
- Los problemas reales de la industria (presión, promesas vacías, enfoque en reclutar)
- Cómo CreaTuActivo lo hace diferente (no perseguir, producto rey, proyecto empresarial)
- ¿Para quién SÍ es esto? ¿Para quién NO?

**CTA**: "Sé honesto: ¿Esto es para ti? Mañana: cómo empezar."

**Guión**: [GUIONES_RETO_5_DIAS.md líneas 360-482](GUIONES_RETO_5_DIAS.md#L360-L482)

**Estado**: [ ] Pendiente

---

#### Video DÍA 5: La Invitación

**Título**: "El siguiente paso (si decides tomarlo)"

**Hook**: "Llegamos al día 5. Hoy te doy la invitación. No una venta."

**Contenido**:
- Recapitulación de los 4 días anteriores
- Las 3 opciones: no hacer nada, buscar otro modelo, explorar este
- Lo que ofrecemos: tecnología, respaldo Gano Excel, equipo, niveles de entrada
- La invitación: Ver presentación / Agendar llamada / Unirte directamente

**CTA**: "Las llaves están frente a ti. La decisión es tuya."

**Guión**: [GUIONES_RETO_5_DIAS.md líneas 485-610](GUIONES_RETO_5_DIAS.md#L485-L610)

**Estado**: [ ] Pendiente

---

## 🎬 NOTAS DE PRODUCCIÓN

### Equipo necesario:
- [ ] Cámara (o smartphone con buena resolución)
- [ ] Micrófono de solapa (lavalier)
- [ ] Iluminación (ring light o luz natural)
- [ ] Fondo neutro o con branding CreaTuActivo

### Setup recomendado:
- [ ] Grabar en formato horizontal (16:9)
- [ ] Resolución mínima: 1080p
- [ ] Audio limpio (sin eco)
- [ ] Vestimenta: Profesional pero accesible

### Proceso de grabación sugerido:
1. **Día 1**: Grabar Video Epiphany Bridge (3 min) ← PRIORIDAD
2. **Día 2-3**: Grabar Videos Día 1 y 2 (2 videos × 15 min = 30 min)
3. **Día 4-5**: Grabar Videos Día 3 y 4 (2 videos × 15 min = 30 min)
4. **Día 6**: Grabar Video Día 5 (15 min)

**Total grabación**: ~1.5 horas de contenido final

---

## 📝 EMAILS DEL RETO (Ya completos - NO requieren acción)

Los emails de texto ya están listos y se envían automáticamente:

- ✅ Email Confirmación: [src/emails/Reto5DiasConfirmation.tsx](src/emails/Reto5DiasConfirmation.tsx)
- ✅ Email Día 1: [src/emails/reto-5-dias/Dia1-Diagnostico.tsx](src/emails/reto-5-dias/Dia1-Diagnostico.tsx)
- ✅ Email Día 2: [src/emails/reto-5-dias/Dia2-Vehiculos.tsx](src/emails/reto-5-dias/Dia2-Vehiculos.tsx)
- ✅ Email Día 3: [src/emails/reto-5-dias/Dia3-Modelo.tsx](src/emails/reto-5-dias/Dia3-Modelo.tsx)
- ✅ Email Día 4: [src/emails/reto-5-dias/Dia4-Estigma.tsx](src/emails/reto-5-dias/Dia4-Estigma.tsx)
- ✅ Email Día 5: [src/emails/reto-5-dias/Dia5-Invitacion.tsx](src/emails/reto-5-dias/Dia5-Invitacion.tsx)

**Cron job**: Configurado en `vercel.json` para enviar a las 8:00 AM Colombia diariamente

**No requieren videos embebidos** - son emails de texto puro con CTAs a páginas web

---

## 🔧 CONFIGURACIÓN TÉCNICA (Tareas de Luis)

### ✅ Completado
- [x] Branding corregido (dorado en "Activo")
- [x] Queswa v17.7.0 desplegado (Mentor Empático)
- [x] System Prompt actualizado en Supabase
- [x] Emails escritos y testeados
- [x] Cron job configurado

### 🔶 Pendiente Validación (Con Claude)

#### 1. Validar Schema Supabase

**Tarea**: Verificar que `funnel_leads` tiene todas las columnas

**Por qué**: Si faltan, emails fallarán silenciosamente

**Columnas críticas**:
- `reto_email_day` (integer)
- `reto_last_email_at` (timestamptz)

**Cómo validar**:
```sql
-- Ejecutar en Supabase SQL Editor
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'funnel_leads'
ORDER BY ordinal_position;
```

**Estado**: [ ] Pendiente (hacer con Claude)

---

#### 2. Configurar Variables Vercel

**Ir a**: Vercel Dashboard → Settings → Environment Variables

**Variables críticas**:

| Variable | Dónde obtenerla | Valor |
|----------|-----------------|-------|
| `CRON_SECRET` | Generar: `openssl rand -hex 16` | [ ] Pendiente |
| `RESEND_API_KEY` | [resend.com/api-keys](https://resend.com/api-keys) | [ ] Verificar |

**Verificar Resend**:
- [ ] Ir a [resend.com/domains](https://resend.com/domains)
- [ ] Verificar que `creatuactivo.com` tiene status "✅ Verified"

**Estado**: [ ] Pendiente (hacer con Claude)

---

#### 3. Test Flow Completo

**Ejecutar localmente**:
1. [ ] `npm run dev`
2. [ ] Ir a `localhost:3000/reto-5-dias`
3. [ ] Registrarse con email real
4. [ ] Verificar email de confirmación llegó
5. [ ] Verificar registro en Supabase (`funnel_leads` table)
6. [ ] Ver Bridge Page (`/reto-5-dias/gracias`)

**Estado**: [ ] Pendiente (hacer con Claude después de subir video)

---

## 📱 POST-LANZAMIENTO (Semana 1)

### WhatsApp Migration

**Problema actual**: Twilio Sandbox solo envía a números pre-autorizados

**Opciones**:
- [ ] **Opción A**: Migrar a ManyChat ($15/mes) - RECOMENDADO
- [ ] **Opción B**: WhatsApp Business API (~$500 setup)
- [ ] **Opción C**: Eliminar WhatsApp, solo Resend

**Documentación**: Ver [WHATSAPP_MANYCHAT_SETUP.md](WHATSAPP_MANYCHAT_SETUP.md)

**Estado**: [ ] Pendiente (semana 1 post-lanzamiento)

---

### A/B Testing

**Implementar tracking** de variantes:
- [ ] `/reto-5-dias` (base)
- [ ] `/reto-5-dias/dolor` (hook emocional)
- [ ] `/reto-5-dias/analitico` (hook lógico)
- [ ] `/reto-5-dias/global` (latinos en extranjero)

**Métricas a medir**:
- Conversion rate por variante
- Reto completion rate (% que llega a Día 5)
- Click-through a `/webinar` desde Día 5

**Estado**: [ ] Pendiente (semana 1 post-lanzamiento)

---

## 🎯 TIMELINE SUGERIDO

### HOY (Día 1) - PRIORIDAD MÁXIMA
- [ ] **Grabar Video Epiphany Bridge** (3 min) ← BLOQUEADOR
- [ ] Subir a Vercel Blob
- [ ] Actualizar Bridge Page con URL

### MAÑANA (Día 2)
- [ ] Validar schema Supabase (con Claude)
- [ ] Configurar variables Vercel (con Claude)
- [ ] Test flow completo local

### DÍA 3-4
- [ ] Grabar Videos Día 1 y 2 (Reto)
- [ ] Subir a YouTube
- [ ] Preparar clips para Instagram/Facebook

### DÍA 5-6
- [ ] Grabar Videos Día 3 y 4 (Reto)
- [ ] Subir y distribuir

### DÍA 7
- [ ] Grabar Video Día 5 (La Invitación)
- [ ] Test smoke en producción
- [ ] 🚀 LANZAMIENTO

### SEMANA 2
- [ ] Migrar WhatsApp a ManyChat
- [ ] Implementar A/B tracking
- [ ] Monitorear métricas

---

## 📊 RECURSOS DE REFERENCIA

### Documentos estratégicos:
- [EPIPHANY_BRIDGE_OFICIAL.md](EPIPHANY_BRIDGE_OFICIAL.md) - Historia personal (60 seg, 3 min, 7 min)
- [GUIONES_RETO_5_DIAS.md](GUIONES_RETO_5_DIAS.md) - Guiones completos de los 5 videos
- [CHECKLIST_PRODUCCION_RETO_5_DIAS.md](CHECKLIST_PRODUCCION_RETO_5_DIAS.md) - Checklist técnico completo

### Documentos técnicos:
- [DEPLOYMENT_DB_QUEUE.md](DEPLOYMENT_DB_QUEUE.md) - Arquitectura del cron job
- [README_VIDEO_IMPLEMENTATION.md](README_VIDEO_IMPLEMENTATION.md) - Workflow de video
- [WHATSAPP_MANYCHAT_SETUP.md](WHATSAPP_MANYCHAT_SETUP.md) - Setup WhatsApp

---

## ✅ CRITERIO DE GO/NO-GO

### ✅ GO PARA PRODUCCIÓN si:
- [x] Emails del reto completos (✅ LISTO)
- [x] Cron job configurado (✅ LISTO)
- [ ] Video Epiphany Bridge subido y funcionando ← **BLOCKER**
- [ ] Schema Supabase validado
- [ ] Variables Vercel configuradas
- [ ] Test local 100% exitoso

### 🎬 GO PARA DISTRIBUCIÓN COMPLETA si:
- [ ] Video Epiphany Bridge ✅
- [ ] Videos Día 1-5 grabados
- [ ] YouTube configurado
- [ ] WhatsApp migration completa

---

**Última actualización**: 19 de enero de 2026
**Próxima revisión**: Después de grabar Video Epiphany Bridge
