# HANDOFF: Contexto de Fechas Actualizadas - CreaTuActivo Marketing

**Fecha de este documento:** 11 de noviembre de 2025
**Generado para:** Transferencia de contexto entre agentes
**Estado:** Información actualizada y sincronizada

---

## 🎯 Contexto General

Este documento proporciona el contexto actualizado sobre las fechas del lanzamiento del ecosistema CreaTuActivo. **Es importante entender que las fechas han sido actualizadas recientemente** y algunos documentos legacy pueden contener referencias a fechas antiguas de octubre que ya no son válidas.

---

## 📅 FECHAS OFICIALES ACTUALIZADAS (Noviembre 2025)

### **Timeline Actual del Lanzamiento:**

1. **Lista Privada (Fase Fundadores)**
   - **Inicio:** Lunes 10 de noviembre de 2025
   - **Fin:** Domingo 30 de noviembre de 2025
   - **Objetivo:** Construir la base de 150 Fundadores élite
   - **Características:** Acompañamiento profundo e individual, ventaja posicional estratégica

2. **Pre-Lanzamiento (Fase Mentores)**
   - **Inicio:** Lunes 1 de diciembre de 2025
   - **Fin:** Domingo 1 de marzo de 2026
   - **Objetivo:** 22,500 Constructores totales
   - **Modelo:** Los 150 Fundadores actúan como **MENTORES**, cada uno guiando a 150 nuevos constructores
   - **Ratio:** 1 Fundador → 150 Constructores (150 × 150 = 22,500)

3. **Lanzamiento Público**
   - **Fecha:** Lunes 2 de marzo de 2026
   - **Objetivo:** Apertura masiva con objetivo de impactar 4 millones de personas en América
   - **Plazo:** 3-7 años para alcanzar los 4M+ usuarios

---

## ⚠️ FECHAS OBSOLETAS (NO USAR)

Las siguientes fechas aparecen en documentos legacy pero **YA NO SON VÁLIDAS:**

- ❌ Lista Privada: 27 Oct - 16 Nov (OBSOLETO)
- ❌ Pre-Lanzamiento: 17 Nov - 27 Dic (OBSOLETO)
- ❌ Lanzamiento: 05 Ene 2026 (OBSOLETO)

**Razón del cambio:** Las fechas originales de octubre no se pudieron cumplir debido a ajustes operativos. El lanzamiento se retrasó y ahora inicia el 10 de noviembre de 2025.

---

## 📁 Archivos Actualizados (11 Nov 2025)

Los siguientes archivos **YA ESTÁN ACTUALIZADOS** con las fechas correctas:

### **Frontend:**
- ✅ `src/app/fundadores/page.tsx` (líneas 326-336)
  - Timeline visual con las 3 fases
  - Texto: "10 Nov - 30 Nov: Lista Privada"
  - Texto: "01 Dic - 01 Mar: Pre-Lanzamiento"
  - Texto: "02 Mar 2026: Lanzamiento Público"

### **Knowledge Base (NEXUS AI):**
- ✅ `knowledge_base/arsenal_conversacional_inicial.txt` (líneas 84-86)
- ✅ `knowledge_base/arsenal_conversacional_tecnico.txt` (líneas 68-70)
- ✅ `knowledge_base/arsenal_conversacional_complementario.txt` (líneas 440-442)

### **SQL Scripts:**
- ✅ `knowledge_base/EJECUTAR_1_arsenal_inicial.sql`
- ✅ `knowledge_base/EJECUTAR_2_arsenal_manejo.sql`
- ✅ `knowledge_base/EJECUTAR_3_arsenal_cierre.sql`

### **Base de Datos:**
- ✅ **Supabase** - Tabla `nexus_documents` sincronizada vía script `actualizar-fechas-prelanzamiento.mjs`
- ✅ Categorías actualizadas: `arsenal_inicial`, `arsenal_manejo`, `arsenal_cierre`

---

## 🔍 Archivos Potencialmente Desactualizados

Si encuentras referencias a fechas de octubre en los siguientes lugares, **necesitarán actualización:**

### **Documentos de Marketing/Comunicación:**
- `HANDOFF_CAMPANA_VIDEO_DIA1.md` (archivo que el usuario tiene abierto)
- Cualquier documento en `/docs` o `/marketing` con fechas hardcodeadas
- Emails templates en `src/emails/`
- Presentaciones en `/public/capturas/`

### **Páginas Públicas:**
- `src/app/presentacion-empresarial/page.tsx`
- `src/app/modelo-de-valor/page.tsx`
- `src/app/paquetes/page.tsx`
- Archivos en `src/app/soluciones/*/page.tsx`

### **Documentación:**
- README files
- CLAUDE.md (puede contener referencias en ejemplos)
- Archivos de onboarding/tutoriales

---

## 🎯 Énfasis Semántico: Rol de MENTOR

Además del cambio de fechas, se ajustó la **semántica** para enfatizar el rol de **MENTOR** de los Fundadores:

### **Antes (semántica antigua):**
> "Objetivo: 22,500 Constructores (150 por cada fundador)"

### **Ahora (semántica actualizada):**
> "Los 150 Fundadores actúan como **MENTORES** de 150 nuevos constructores cada uno (22,500 total)"

**Palabras clave a usar:**
- ✅ "MENTORES" (mayúsculas para énfasis)
- ✅ "guiar", "acompañar", "mentoría"
- ✅ "cada Fundador actúa como MENTOR de 150 nuevos constructores"
- ❌ Evitar: "recluta", "construye equipo de", "trae a"

---

## 🛠️ Cómo Actualizar Fechas en Otros Documentos

Si encuentras documentos con fechas obsoletas, sigue este patrón de reemplazo:

### **Patrón 1: Timeline Completo**
```markdown
**ANTES:**
- Lista Privada (27 Oct - 16 Nov): 150 Fundadores
- Pre-Lanzamiento (17 Nov - 27 Dic): 22,500 Constructores
- Lanzamiento Público (05 Ene 2026): 4M+ en América

**DESPUÉS:**
- Lista Privada (10 Nov - 30 Nov): 150 Fundadores
- Pre-Lanzamiento (01 Dic - 01 Mar): 150 Mentores → 22,500 Constructores
- Lanzamiento Público (02 Mar 2026): 4M+ en América
```

### **Patrón 2: Descripción de Fases**
```markdown
**ANTES:**
Los 150 Fundadores mentorean a 22,500 constructores (150 c/u)

**DESPUÉS:**
Los 150 Fundadores actúan como MENTORES de 150 nuevos constructores cada uno (22,500 total)
```

### **Patrón 3: Referencias de Urgencia**
```markdown
**ANTES:**
"Estamos en la fase de Lista Privada (27 Oct - 16 Nov)"

**DESPUÉS:**
"Estamos en la fase de Lista Privada (10 Nov - 30 Nov)"
```

---

## 📊 Contador de Cupos Fundadores

El contador de cupos en la página `/fundadores` está actualmente **PAUSADO** en 150 cupos estáticos:

```typescript
// Estado actual en src/app/fundadores/page.tsx líneas 37-41
function calcularCuposDisponibles(): number {
  // TEMPORAL: Retornar 150 cupos estáticos
  // TODO: Luis actualizará con el número real
  return 150
}
```

**Nota:** El contador dinámico (que reducía 1 cupo por hora) fue pausado por solicitud del usuario hasta que pueda proporcionar datos reales de ventas. No modificar sin autorización.

---

## 🗓️ Referencia Rápida: Diferencia de Fechas

| Fase | Fechas ANTIGUAS (obsoletas) | Fechas NUEVAS (válidas) | Diferencia |
|------|---------------------------|------------------------|------------|
| Lista Privada | 27 Oct - 16 Nov | 10 Nov - 30 Nov | +14 días de inicio |
| Pre-Lanzamiento | 17 Nov - 27 Dic | 01 Dic - 01 Mar | +14 días de inicio, +64 días de duración |
| Lanzamiento | 05 Ene 2026 | 02 Mar 2026 | +57 días |

---

## 🔄 Script de Sincronización

Para sincronizar cambios de knowledge base con Supabase después de editar archivos `.txt`:

```bash
node scripts/actualizar-fechas-prelanzamiento.mjs
```

Este script lee los 3 archivos `.txt` del knowledge base y actualiza la tabla `nexus_documents` en Supabase.

---

## 📞 Contactos de Escalación

- **Liliana Moreno:** Consultora principal, mencionada en NEXUS para escalación humana
- **WhatsApp:** Variable de entorno `NEXT_PUBLIC_WHATSAPP_NUMBER`

---

## ✅ Checklist para Otro Agente

Si estás trabajando en contenido de marketing/comunicación, verifica:

- [ ] Todas las referencias de fechas usan las nuevas fechas (10 Nov, 01 Dic, 02 Mar 2026)
- [ ] No hay menciones a "27 Oct" o "17 Nov" o "05 Ene 2026"
- [ ] El lenguaje enfatiza el rol de **MENTOR** de los Fundadores
- [ ] Las menciones a "22,500 Constructores" incluyen el contexto de "150 Fundadores como MENTORES"
- [ ] Si modificas knowledge base `.txt`, ejecutar script de sincronización
- [ ] Si modificas fechas en frontend, verificar que el diseño responsive se mantenga

---

## 📝 Historial de Cambios

- **26 Oct 2025:** Fechas originales establecidas (27 Oct - 16 Nov - 05 Ene)
- **27 Oct 2025:** Implementación de contador dinámico de cupos
- **10 Nov 2025:** Pausado contador en 150 estático por solicitud del usuario
- **11 Nov 2025:** **ACTUALIZACIÓN COMPLETA DE FECHAS** (10 Nov - 01 Dic - 02 Mar) + énfasis en MENTOR

---

## 🎯 Resumen Ejecutivo (TL;DR)

**FECHAS ACTUALES (usar estas):**
- 📅 **Lista Privada:** 10 Nov - 30 Nov 2025 (150 Fundadores)
- 📅 **Pre-Lanzamiento:** 01 Dic 2025 - 01 Mar 2026 (22,500 Constructores)
- 📅 **Lanzamiento:** 02 Mar 2026 (4M+ en América)

**SEMÁNTICA:**
- 150 Fundadores actúan como **MENTORES**
- Cada Fundador guía a 150 nuevos constructores
- Total: 22,500 Constructores en Pre-Lanzamiento

**ARCHIVOS YA ACTUALIZADOS:**
- Frontend: `src/app/fundadores/page.tsx` ✅
- Knowledge base: 3 archivos `.txt` + 3 archivos `.sql` ✅
- Base de datos: Supabase sincronizada ✅

**ACCIÓN REQUERIDA:**
- Revisar archivos de marketing/comunicación con fechas hardcodeadas
- Actualizar cualquier referencia a octubre que encuentres
- Usar el patrón de reemplazo documentado arriba

---

**Última actualización:** 11 de noviembre de 2025
**Commit de referencia:** `09aa6a2` - "📅 Actualizar fechas de prelanzamiento + énfasis en rol de MENTOR"
**Generado por:** Claude Code

---

## 💬 Preguntas Frecuentes

**P: ¿Por qué cambiaron las fechas?**
R: Ajustes operativos retrasaron el inicio. Las fechas de octubre ya no eran viables.

**P: ¿Puedo usar fechas relativas como "próximo lunes"?**
R: No. Usa siempre fechas explícitas para evitar confusión.

**P: ¿Qué hago si encuentro fechas de octubre en un documento?**
R: Actualízalas usando los patrones de este documento y notifica al equipo.

**P: ¿El contador de cupos sigue funcionando?**
R: No, está pausado en 150 estático hasta nueva orden.

**P: ¿Debo actualizar también las imágenes/capturas de pantalla?**
R: Sí, si contienen fechas visibles. Verifica en `/public/capturas/`.
