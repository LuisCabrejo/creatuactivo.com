# HANDOFF — Recalibración léxica Queswa (jun 2026)

Migración del léxico canónico viejo → léxico accesible (servilleta / Mario Alonso Puig).
**Nada de esto está desplegado todavía.** Los cambios viven en archivos; el deploy lo decide el Director.

## Mapa de términos (decisión de esta sesión)

| Viejo (canon CLAUDE.md) | Nuevo (accesible) |
|---|---|
| Estructura Patrimonial | estructura de ingresos recurrentes |
| La Matriz Física | El Respaldo Operativo |
| El Tridente EAM | El Método Comprobado (mantiene "Comando Expandir · Activar · Maestría" de subtítulo) |
| Arquitecto de Patrimonio | Propietario de Base Operativa |
| Dirección Ejecutiva / gobernanza | dirige / dirección |
| Capa Logística / Tecnológica | (sin "capa" — solo el nombre del pilar) |
| Apalancamiento Asimétrico | Apalancamiento Estratégico |
| Ingeniería Patrimonial | (su) modelo de ingresos |

**Concepto nuclear nuevo de "¿qué es CreaTuActivo?":** "una **empresa de tecnología** que ayuda a corregir una **vulnerabilidad crítica** en la vida financiera de las personas… la independencia real solo se logra con **ingresos recurrentes** que no dependen de su trabajo físico." (Modelo Waze: empatía primero, categoría humilde.)

## ✅ HECHO en esta sesión (archivos, NO desplegado)

1. **WHY_01** (`knowledge_base/arsenal_inicial.txt`) — reescrito completo. Concepto nuclear + cuerpo verbatim_lock con vulnerabilidad estilo servilleta, ancla a lo real (café + 70 países), 3 pilares accesibles, rol Propietario. Es Camino B (RAG) → NO requiere sync con respuestas-maestras.
2. **WHY_02** (arsenal + `src/lib/respuestas-maestras.ts` MASTER_WHY_02) — reescrito. **Camino A: sincronizado carácter por carácter.** Eje "apalancamiento + cómo se gana (consumo recurrente)".
3. **FREQ_03** — auditada, se deja **casi intacta** (ya estaba calibrada en v5.2/v5.5; no carga léxico viejo). Pendiente micro-retoque opcional: quitar "estratégico" de "inventario estratégico".
4. **EAM_01** (arsenal + MASTER_EAM_01) — "Tridente EAM" → "El Método Comprobado", "Comandos del Tridente" → "Comandos del Método". **Camino A sincronizado.**
5. **Chips** (`src/lib/queswa-greeting.ts`) — chip #1 "Estructura Patrimonial" → "estructura de ingresos recurrentes". Actualizadas las 3 llaves acopladas en lockstep (display + `QUESWA_QUICK_REPLIES_EXPANSION` key + `RESPUESTAS_MAESTRAS_CHIP` key). `MISION` greeting también corregido. Hint RAG de chip #2 actualizado.
6. **Home** (`src/app/page.tsx` + `src/components/TridenteAphorisms.tsx`) — ~13 reemplazos visibles. Nombres de funnel preservados (Auditoría Patrimonial, Prueba de Estrés Patrimonial, Auditoría de Viabilidad). v13.3 → v13.4.

**Invariante Camino A verificado:** llaves de chip #1 idénticas en `queswa-greeting.ts` y `respuestas-maestras.ts`. route.ts NO se tocó (lee de los mapas).

## 🚀 DEPLOY — pendiente, con secuenciación recomendada

- **Código (Vercel, `git push`)** — home + chips + respuestas-maestras + TridenteAphorisms. **Seguro de desplegar solo:** la home es autocontenida; los chips disparan Camino A (respuestas-maestras) → consistente. Split menor aceptable: una consulta en lenguaje natural a WHY_02/EAM_01 (Camino B RAG) servirá el arsenal viejo de Supabase hasta que se despliegue el arsenal.
- **Arsenal (Supabase)** — `deploy-arsenal-inicial.mjs` + purgar fragments `arsenal_inicial_%` + `fragmentar-arsenales-voyage.mjs`. **NO desplegar en aislamiento:** WHY_01/02/EAM_01 dirían "Respaldo Operativo / Método Comprobado" mientras FREQ_04 y 36+ menciones siguen diciendo "Arquitecto / Matriz Física". **Desplegar junto con la migración profunda** (abajo).

## ⏳ PENDIENTE — próxima sesión

1. **Terminar las 5 primeras de arsenal_inicial** (Opción B): faltan **FREQ_04, FREQ_04_PUENTE, PERFIL_01**.
2. **Migración profunda** (deferida por decisión "alto tráfico ahora"): ~200 usos del léxico viejo en arsenales (Arquitecto 36+13, Matriz Física 18+1, Estructura Patrimonial 17+1, Tridente EAM 5+3), system prompt (`nexus_main` en Supabase + archivo local v27_2), y fallback de route.ts (líneas 2632+). **Cada par es reescritura cuidada, no find/replace ciego.**
3. **Actualizar canon en CLAUDE.md** — "Estructura Patrimonial" y "Arquitecto de Patrimonio" figuran como APROBADOS ahí; tras la migración hay que invertir la doctrina o anotar la excepción, o futuros agentes revertirán.
4. **SEO** — el `<title>` y meta description de la home cambiaron ("Estructura Patrimonial" → "Ingresos Recurrentes"). Revisar impacto en keywords/GSC; revertir si Luis prefiere conservar el keyword.
5. **Chips (opcional)** — memoria `feedback_chips_cognitivos`: el chip #1 sigue siendo un sustantivo denso. Considerar reformularlo a pregunta natural ("¿cómo funciona el negocio?").
