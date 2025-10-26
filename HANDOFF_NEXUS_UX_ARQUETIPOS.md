# HANDOFF: NEXUS UX - Implementación de Arquetipos en Captura de Datos

**Fecha:** 21 de octubre 2025
**Proyecto:** CreaTuActivo Marketing (creatuactivo.com)
**Prioridad:** Alta
**Agente Asignado:** [TBD]
**Estado:** Pendiente de inicio

---

## CONTEXTO DEL PROYECTO

### Sistema NEXUS Actual
NEXUS es el copiloto de IA conversacional del ecosistema CreaTuActivo.com, powered by Anthropic Claude. Su función principal es capturar prospectos y guiarlos a través del Framework IAA (INICIAR → ACOGER → ACTIVAR).

**Arquitectura actual:**
- API Route: `/src/app/api/nexus/route.ts` (Edge runtime)
- System Prompt: Supabase `system_prompts` table, versión actual: `v12.2_value_prop_asesoria`
- Base de datos: Tabla `prospects` en Supabase
- Captura actual: Nombre, ocupación (texto libre), WhatsApp, email

---

## PROBLEMA A RESOLVER

### Estado Actual (v12.2)
NEXUS captura "ocupación" como texto libre:
- Pregunta: "¿A qué te dedicas?"
- Usuario responde: "ingeniero", "ama de casa", "estudiante", etc.
- Se guarda en `device_info.occupation` como texto libre
- **Problema:** Datos inconsistentes, difíciles de analizar, sin segmentación clara

### Estado Deseado
Capturar **arquetipo** en vez de ocupación mediante selección guiada:
- 6 arquetipos predefinidos con descripciones atractivas
- Usuario selecciona con cuál se identifica más
- Datos consistentes y segmentables
- Mejor personalización de mensajes por arquetipo

---

## ARQUETIPOS DEFINIDOS (Imagen de Referencia)

**Ubicación:** `/Users/luiscabrejo/cta/CreaTuActivo-Marketing/public/paquetes.png`

### Los 6 Arquetipos:

1. **💼 Profesional con Visión** (`profesional_vision`)
   - Descripción: Tienes un trabajo estable pero buscas más autonomía y crecimiento

2. **🎯 Emprendedor y Dueño de Negocio** (`emprendedor_dueno_negocio`)
   - Descripción: Ya tienes un negocio y buscas escalarlo o diversificar

3. **💡 Independiente y Freelancer** (`independiente_freelancer`)
   - Descripción: Trabajas por cuenta propia y quieres crear flujos de ingreso más predecibles

4. **🏠 Líder del Hogar** (`lider_hogar`)
   - Descripción: Gestionas el hogar y buscas contribuir económicamente sin descuidar tu familia

5. **👥 Líder de la Comunidad** (`lider_comunidad`)
   - Descripción: Tienes influencia en tu círculo y te apasiona ayudar a otros a crecer

6. **📈 Joven con Ambición** (`joven_ambicion`)
   - Descripción: Estás comenzando y quieres construir tu futuro financiero desde ya

---

## OBJETIVO DE LA TAREA

### Objetivo Principal
Implementar captura de arquetipos en NEXUS con UX óptima que incentive la selección y mejore la tasa de conversión.

### Objetivos Específicos
1. ✅ Reemplazar pregunta "¿A qué te dedicas?" por pregunta de arquetipos
2. ✅ Presentar los 6 arquetipos de forma atractiva y clickeable
3. ✅ Capturar la selección en `device_info.archetype`
4. ✅ Mantener funcionalidad de captura por texto libre (fallback)
5. ✅ Actualizar Dashboard para mostrar arquetipos correctamente

---

## IMPLEMENTACIÓN TÉCNICA

### FASE 1: Actualizar System Prompt (Supabase)

**Archivo:** Tabla `system_prompts`, columna `prompt`, `name = 'nexus_main'`

**Cambio en sección "FRAMEWORK IAA - CAPTURA PROGRESIVA":**

```markdown
### ORDEN DE CAPTURA (después del consentimiento):

1. Nombre - "Para conocerte mejor, ¿cómo te llamas?"

2. Arquetipo - "Para ofrecerte la mejor asesoría, ¿con cuál de estos perfiles te identificas más?"

   PRESENTAR ARQUETIPOS (formato vertical clickeable):

   - 💼 Profesional con Visión: Tienes un trabajo estable pero buscas más autonomía
   - 🎯 Emprendedor y Dueño de Negocio: Ya tienes un negocio y buscas escalarlo
   - 💡 Independiente y Freelancer: Trabajas por cuenta propia y quieres ingresos predecibles
   - 🏠 Líder del Hogar: Gestionas el hogar y buscas contribuir económicamente
   - 👥 Líder de la Comunidad: Tienes influencia y te apasiona ayudar a otros
   - 📈 Joven con Ambición: Estás comenzando y quieres construir tu futuro financiero

3. WhatsApp - "¿Cuál es tu WhatsApp para coordinar tu consulta?"

4. Email (opcional) - Solo si el prospecto lo ofrece
```

**Script para aplicar:**
```javascript
// scripts/update-archetipos-captura.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function updateArchetypos() {
  // 1. Obtener prompt actual
  const { data: currentData } = await supabase
    .from('system_prompts')
    .select('prompt')
    .eq('name', 'nexus_main')
    .single();

  // 2. Reemplazar sección de captura
  const oldCapture = `### ORDEN DE CAPTURA (despues del consentimiento):

1. Nombre - "Para conocerte mejor, como te llamas?"
2. Ocupacion - "A que te dedicas?"
3. WhatsApp - "Cual es tu WhatsApp para coordinar tu consulta?"
4. Email (opcional) - Solo si el prospecto lo ofrece`;

  const newCapture = `### ORDEN DE CAPTURA (despues del consentimiento):

1. Nombre - "Para conocerte mejor, como te llamas?"

2. Arquetipo - "Para ofrecerte la mejor asesoria, con cual de estos perfiles te identificas mas?"

   PRESENTAR ARQUETIPOS (formato vertical clickeable):

   - 💼 Profesional con Vision: Tienes un trabajo estable pero buscas mas autonomia
   - 🎯 Emprendedor y Dueno de Negocio: Ya tienes un negocio y buscas escalarlo
   - 💡 Independiente y Freelancer: Trabajas por cuenta propia y quieres ingresos predecibles
   - 🏠 Lider del Hogar: Gestionas el hogar y buscas contribuir economicamente
   - 👥 Lider de la Comunidad: Tienes influencia y te apasiona ayudar a otros
   - 📈 Joven con Ambicion: Estas comenzando y quieres construir tu futuro financiero

3. WhatsApp - "Cual es tu WhatsApp para coordinar tu consulta?"
4. Email (opcional) - Solo si el prospecto lo ofrece`;

  const updatedPrompt = currentData.prompt.replace(oldCapture, newCapture);

  // 3. Actualizar en Supabase
  await supabase
    .from('system_prompts')
    .update({
      prompt: updatedPrompt,
      version: 'v12.3_arquetipos_captura',
      updated_at: new Date().toISOString()
    })
    .eq('name', 'nexus_main');

  console.log('✅ System Prompt actualizado a v12.3_arquetipos_captura');
}

updateArchetypos();
```

---

### FASE 2: Actualizar API Route (Captura desde Texto)

**Archivo:** `/src/app/api/nexus/route.ts`

**Sección a actualizar:** Líneas ~820-860 (función `captureProspectData`)

**Código actual (líneas 839-864):**
```typescript
// ✅ CAPTURA DE ARQUETIPO (desde Quick Replies o texto libre)
const archetypeMap: Record<string, string> = {
  'profesional con visión': 'profesional_vision',
  'emprendedor y dueño de negocio': 'emprendedor_dueno_negocio',
  'independiente y freelancer': 'independiente_freelancer',
  'líder del hogar': 'lider_hogar',
  'líder de la comunidad': 'lider_comunidad',
  'joven con ambición': 'joven_ambicion'
};

for (const [label, value] of Object.entries(archetypeMap)) {
  if (messageLower.includes(label)) {
    data.archetype = value;
    console.log('✅ [NEXUS] Arquetipo capturado:', value);
    break;
  }
}
```

**Estado:** Ya funciona correctamente, no requiere cambios. ✅

**Captura por emojis (opcional - agregar si queremos detectar cuando usuario copia emoji):**
```typescript
// Agregar después del bucle archetypeMap
const emojiMap: Record<string, string> = {
  '💼': 'profesional_vision',
  '🎯': 'emprendedor_dueno_negocio',
  '💡': 'independiente_freelancer',
  '🏠': 'lider_hogar',
  '👥': 'lider_comunidad',
  '📈': 'joven_ambicion'
};

for (const [emoji, value] of Object.entries(emojiMap)) {
  if (message.includes(emoji)) {
    data.archetype = value;
    console.log('✅ [NEXUS] Arquetipo capturado por emoji:', value);
    break;
  }
}
```

---

### FASE 3: Verificar Dashboard (Ya implementado)

**Archivo:** `/src/app/mi-sistema-iaa/page.tsx`

**Estado:** La función `formatArchetype()` ya existe (líneas 89-104) y está funcionando correctamente. ✅

```typescript
const formatArchetype = (archetype: string | null) => {
  if (!archetype) return '-'
  const map: Record<string, string> = {
    'profesional_vision': '💼 Profesional con Visión',
    'emprendedor_dueno_negocio': '🎯 Emprendedor y Dueño de Negocio',
    'independiente_freelancer': '💡 Independiente y Freelancer',
    'lider_hogar': '🏠 Líder del Hogar',
    'lider_comunidad': '👥 Líder de la Comunidad',
    'joven_ambicion': '📈 Joven con Ambición'
  }
  return map[archetype] || archetype
}
```

**No requiere cambios en Dashboard.** ✅

---

## CONSIDERACIONES DE UX

### ⚠️ APRENDIZAJE DE FASE 2 (Quick Replies fallido)

**Qué NO hacer:**
- ❌ NO usar formato JSON ni `QUICK_REPLIES:` en respuestas
- ❌ NO crear componentes de botones UI (NEXUSWidget no los renderiza correctamente)
- ❌ NO complicar el flujo con parsers custom

**Qué SÍ hacer:**
- ✅ Presentar arquetipos como lista markdown con emojis
- ✅ Usuarios copian/pegan el texto o escriben similar
- ✅ Detección por texto funciona bien (ya implementada)
- ✅ Mantener UX simple y probada

### Formato de Presentación Recomendado

**CORRECTO (formato actual que funciona):**
```
Para ofrecerte la mejor asesoría, ¿con cuál de estos perfiles te identificas más?

- 💼 Profesional con Visión: Tienes un trabajo estable pero buscas más autonomía
- 🎯 Emprendedor y Dueño de Negocio: Ya tienes un negocio y buscas escalarlo
- 💡 Independiente y Freelancer: Trabajas por cuenta propia y quieres ingresos predecibles
- 🏠 Líder del Hogar: Gestionas el hogar y buscas contribuir económicamente
- 👥 Líder de la Comunidad: Tienes influencia y te apasiona ayudar a otros
- 📈 Joven con Ambición: Estás comenzando y quieres construir tu futuro financiero

Puedes copiar el que mejor te representa.
```

---

## TESTING Y VALIDACIÓN

### Test Manual (Flujo Completo)

1. **Abrir sesión nueva** (modo incógnito o limpia localStorage)
   - URL: https://creatuactivo.com/fundadores/luis-cabrejo-parra-4871288

2. **Verificar onboarding:**
   - ✅ Texto de consentimiento minimalista aparece
   - ✅ Sin saludos duplicados, sin emojis extra
   - Usuario acepta consentimiento

3. **Verificar captura de nombre:**
   - ✅ NEXUS pregunta: "Para conocerte mejor, ¿cómo te llamas?"
   - Usuario responde: "Luis"
   - ✅ NEXUS confirma: "Perfecto, Luis..."

4. **Verificar captura de arquetipo:**
   - ✅ NEXUS pregunta con lista de 6 arquetipos
   - Usuario copia/pega: "💼 Profesional con Visión"
   - ✅ NEXUS confirma arquetipo capturado

5. **Verificar captura de WhatsApp:**
   - ✅ NEXUS pregunta número de WhatsApp
   - Usuario responde: "3001234567"
   - ✅ NEXUS confirma y ofrece coordinar consulta

6. **Verificar en Dashboard:**
   - Ir a: https://app.creatuactivo.com/mi-sistema-iaa
   - ✅ Prospecto aparece con arquetipo formateado correctamente
   - ✅ Emoji + label visible en columna ARQUETIPO

### Queries de Verificación en Supabase

```sql
-- Ver prospects con arquetipos capturados
SELECT
  fingerprint_id,
  device_info->>'name' as nombre,
  device_info->>'archetype' as arquetipo,
  device_info->>'phone' as whatsapp,
  stage,
  created_at
FROM prospects
WHERE device_info->>'archetype' IS NOT NULL
ORDER BY created_at DESC
LIMIT 20;

-- Contar por arquetipo
SELECT
  device_info->>'archetype' as arquetipo,
  COUNT(*) as total
FROM prospects
WHERE device_info->>'archetype' IS NOT NULL
GROUP BY device_info->>'archetype'
ORDER BY total DESC;
```

---

## CHECKLIST DE IMPLEMENTACIÓN

### Pre-requisitos
- [ ] Leer este documento completo
- [ ] Revisar imagen de arquetipos: `public/paquetes.png`
- [ ] Entender por qué Quick Replies falló (commit 71d3c57)
- [ ] Confirmar que System Prompt actual es v12.2_value_prop_asesoria

### Implementación
- [ ] Crear script `update-arquetipos-captura.js`
- [ ] Ejecutar script y verificar en Supabase que prompt se actualizó
- [ ] (Opcional) Agregar detección por emojis en route.ts
- [ ] Commit con mensaje descriptivo

### Testing
- [ ] Test manual completo (6 pasos descritos arriba)
- [ ] Verificar en Dashboard que arquetipos se muestran correctamente
- [ ] Probar con diferentes arquetipos (mínimo 3)
- [ ] Verificar que texto libre aún funciona ("soy emprendedor")

### Deploy
- [ ] Push a producción
- [ ] Esperar deploy de Vercel (~2 mins)
- [ ] Test en producción con sesión nueva
- [ ] Monitorear logs por 24 horas

---

## POSIBLES PROBLEMAS Y SOLUCIONES

### Problema 1: NEXUS no muestra lista de arquetipos
**Causa:** System Prompt no se actualizó correctamente
**Solución:** Verificar en Supabase que versión es v12.3_arquetipos_captura

### Problema 2: Arquetipos no se capturan
**Causa:** Usuario escribe variaciones no cubiertas por archetypeMap
**Solución:** Agregar más variaciones al map o mejorar detección con regex

### Problema 3: Dashboard muestra "undefined"
**Causa:** Formato de archetype no coincide con formatArchetype()
**Solución:** Verificar que valores guardados usan guiones bajos (snake_case)

### Problema 4: Cache de Anthropic sirve prompt antiguo
**Causa:** Cache de 5 minutos en System Prompt
**Solución:** Esperar 5 minutos o forzar limpieza cambiando version number

---

## RECURSOS Y REFERENCIAS

### Archivos Clave
- **System Prompt:** Supabase `system_prompts` table
- **API Route:** `/src/app/api/nexus/route.ts`
- **Dashboard:** `/src/app/mi-sistema-iaa/page.tsx`
- **Imagen referencia:** `/public/paquetes.png`

### Commits Relevantes
- `4c89eab` - Fix texto de consentimiento (eliminar saludo duplicado)
- `71d3c57` - Reversion de Quick Replies (aprender qué NO hacer)
- `10a9232` - FASE 1: Agregar columnas Arquetipo y Paquete en Dashboard
- `f3a5c05` - Quick Replies FASE 2 (fallido, revertido)

### Documentación
- `/CLAUDE.md` - Guía completa del proyecto
- `/FASE_2_QUICK_REPLIES_NEXUS.md` - Por qué Quick Replies falló
- `/LISTA_CONTACTOS_SPECS.md` - Referencia de otra feature similar

---

## CRITERIOS DE ÉXITO

### Mínimos Aceptables
1. ✅ NEXUS pregunta por arquetipo en vez de ocupación
2. ✅ Lista de 6 arquetipos se muestra correctamente
3. ✅ Captura funciona con texto libre (copiar/pegar)
4. ✅ Dashboard muestra arquetipos formateados
5. ✅ No se rompe funcionalidad existente

### Ideal
1. ✅ Todo lo anterior
2. ✅ Detección por emojis funciona
3. ✅ Tasa de captura de arquetipo > 80%
4. ✅ Formato atractivo que incentiva selección
5. ✅ Tiempo de respuesta < 3 segundos

---

## NOTAS FINALES

**Filosofía de esta tarea:**
> "Mantener la simplicidad que funciona. No complicar con UI custom o parsers. Markdown + detección por texto = probado y funcional."

**Prioridad:**
Esta tarea es **crítica** para mejorar la segmentación de prospectos y personalización de asesoría. Los arquetipos permiten mensajes específicos por perfil.

**Timeline sugerido:**
- Implementación: 2-3 horas
- Testing: 1 hora
- Deploy + monitoreo: 30 mins
- **Total: ~4 horas**

**Contacto:**
Si tienes dudas o encuentras bloqueadores, consulta con el agente principal que tiene contexto completo del proyecto.

---

**Última actualización:** 2025-10-21 17:30
**Versión System Prompt actual:** v12.2_value_prop_asesoria
**Próxima versión:** v12.3_arquetipos_captura
