# HANDOFF: Bug Precios COP / CV / PV en Queswa

**Fecha:** 06 Abril 2026  
**Propósito:** Entregar contexto completo al siguiente agente para resolver el problema de precios y valores CV/PV incorrectos en Queswa (creatuactivo.com).  
**Estado:** Bug persistente después de múltiples fixes. Ver sección "Lo que se intentó" antes de proponer cualquier cambio.

---

## EL PROBLEMA EN TÉRMINOS DE EXPERIENCIA

Un prospecto o constructor le pregunta a Queswa cosas como:

- "¿Cuánto cuesta el café 3en1?"
- "¿Qué precio tiene el Cordygold?"
- "¿Cuántos PV da el Rooibos?"
- "¿Cuánto es el CV del Spirulina?"
- "¿Cuánto cuesta el ESP-2?"

Queswa responde con **valores incorrectos** — precios que no existen en el catálogo oficial, CV/PV fabricados desde su entrenamiento pre-2024, y precios de paquetes solo en USD sin mostrar el equivalente en COP.

La experiencia objetivo es 11 estrellas: el modelo da el precio exacto, en la moneda correcta (siempre COP para Colombia, acompañado de USD cuando aplica), con el PV y CV oficial de Gano Excel 2026. El modelo **nunca fabrica** un valor que no esté en su contexto recuperado.

---

## ARQUITECTURA RELEVANTE

### Flujo de una consulta de precio

```
Usuario: "¿Cuánto cuesta el Reskine?"
    ↓
route.ts — isClosingFlowEarly() → ¿es intención de compra activa?
    → NO → continúa al vector search
    ↓
PASO 0: Voyage AI embedding → similitud coseno contra nexus_documents
    → Si similarity >= 0.4 → documentType = categoría del doc más similar
    ↓
PASO 0.5: Override crítico (falsos positivos entre arsenales)
    ↓
PASO 1 (fallback): clasificarDocumentoHibrido() → regex patterns
    → patrones_productos → documentType = 'catalogo_productos'
    → patrones_compensacion → documentType = 'arsenal_compensacion'
    ↓
Si documentType === 'catalogo_productos':
    → consultarCatalogoProductos() → Supabase → documento único 14,748 chars
    → Modelo recibe TODO el catálogo (22 productos) y extrae el precio
    
Si documentType === 'arsenal_compensacion':
    → searchArsenalFragments() → Voyage AI → top 5 fragmentos más similares
    → Modelo recibe solo los fragmentos relevantes (COMP_CV_01, COMP_PV_06, etc.)
```

### Archivos críticos

| Archivo | Función |
|---------|---------|
| `src/app/api/nexus/route.ts` | API principal — routing, RAG, streaming |
| `knowledge_base/catalogo_productos.txt` | Catálogo 22 productos con precios COP |
| `knowledge_base/arsenal_compensacion.txt` | Plan de compensación, CV/PV por producto |
| `knowledge_base/system-prompt-nexus-v21.0.md` | System prompt activo (nombre en Supabase: `nexus_main`) |
| `scripts/actualizar-system-prompt-v21.mjs` | Despliega el system prompt a Supabase |
| `scripts/fragmentar-arsenales-voyage.mjs` | Crea fragmentos con embeddings Voyage AI |
| `scripts/deploy-arsenal-compensacion.mjs` | Despliega arsenal_compensacion a Supabase |

### Datos oficiales Gano Excel 2026 (fuente: capturas en `public/capturas/productos/`)

**Precios COP verificados — catálogo oficial:**

| Cod. | Producto | PV | CV | Precio COP |
|------|----------|-----|-----|------------|
| 501 | Ganocafé 3 en 1 | 15 | 14 | $110,900 |
| 505 | Gano Café Classic | 15 | 14 | $110,900 |
| 502 | Gano Schokolade | 17 | 15.6 | $124,900 |
| 507 | Gano C'Real Spirulina | 17 | 15 | $119,900 |
| 504 | Oleaf Gano Rooibos | 17 | 15 | $119,900 |
| 503 | Ganorico Mocha Rico | 17 | 15 | $119,900 |
| 509 | Ganorico Latte Rico | 17 | 15 | $119,900 |
| 512 | Ganorico Shoko Rico | 17 | 15.6 | $124,900 |
| 530 | Reskine Collagen Drink | 31 | 27.6 | $216,900 |
| 801 | Ganoderma Capsulas | 41 | 34.5 | $272,500 |
| 803 | Excellium Capsulas | 41 | 34.5 | $272,500 |
| 805 | Cordygold Capsulas | 49 | 43 | $336,900 |
| 816 | Luvoco Suave (cápsula) | 15 | 14 | $110,900 |
| 817 | Luvoco Medio (cápsula) | 15 | 14 | $110,900 |
| 818 | Luvoco Fuerte (cápsula) | 15 | 14 | $110,900 |
| 997 | Luvoco Premium Máquina | 0 | 0 | $1,026,000 |
| 301 | Gano Soap | 10.4 | 8.9 | $73,900 |
| 302 | Gano Fresh Toothpaste | 11 | 9.5 | $73,900 |
| 303 | Gano Transparent Soap | 12 | 10 | $78,500 |
| 305 | Piel&Brillo Shampoo | 11 | 9 | $73,900 |
| 306 | Piel&Brillo Acondicionador | 11 | 9 | $73,900 |
| 307 | Piel&Brillo Exfoliante | 11 | 9 | $73,900 |
| 897 | ESP-1 (paquete) | 100 | 100 | $900,000 |
| 898 | ESP-2 (paquete) | 250 | 250 | $2,250,000 |
| 899 | ESP-3 (paquete) | 500 | 500 | $4,500,000 |

---

## LO QUE SE INTENTÓ (sin éxito)

### Fix 1 — Patrones de routing en `clasificarDocumentoHibrido()` ✅ aplicado, sin resolver el bug

**Qué se hizo:** Se ampliaron los `patrones_productos` y `patrones_compensacion` en `route.ts` para capturar más variantes de consultas de precio (lenguaje natural, nombres de productos en inglés/español, etc.). Se eliminaron dos regex con `.*(?!.*paquete)` que tenían un bug de lookahead negativo y siempre devolvían `true`.

**Por qué no resolvió:** El routing puede ser correcto pero el problema está en lo que el modelo hace con el documento que recibe.

### Fix 2 — `isClosingFlowEarly()` demasiado amplio ✅ aplicado, sin resolver el bug

**Qué se hizo:** Esta función devolvía `true` para queries informativas como "dame el precio de los paquetes", suprimiendo el RAG y obligando al modelo a responder desde entrenamiento pre-2024. Se narrowó para detectar solo intención de compra activa ("cuánto necesito invertir", "cuánto hay que poner").

**Por qué no resolvió completamente:** El bug de precios persiste para productos individuales incluso cuando el catálogo sí se entrega.

### Fix 3 — CV/PV corregidos y productos agregados en COMP_CV_01 y COMP_PV_06 ✅ aplicado

**Qué se hizo:** Los valores de CV estaban incorrectos (fabricados o desactualizados). Se auditaron contra la lista oficial de precios de Gano Excel (capturas en `public/capturas/productos/1.png` y `2.png`). Se corrigieron 6 CV erróneos y se agregaron 14 productos faltantes. Embeddings regenerados.

**Estado:** Esta parte está correcta en Supabase. El problema de CV/PV puede estar resuelto para productos en `arsenal_compensacion`. Pendiente de verificación en producción.

### Fix 4 — Guardrails en system prompt v21.0 ✅ aplicado, efectividad incierta

**Qué se hizo:** Se agregaron dos `BLOQUEO ABSOLUTO` en el system prompt:
1. Composición de paquetes ESP-1/2/3 → si no está en el contexto recuperado, no improvisar
2. Precios individuales COP → si no están en el contexto, decir "déjame verificar"

**Por qué puede no ser suficiente:** Los bloqueos en lenguaje natural en system prompts densos (23KB) tienen efectividad limitada. Claude tiende a ignorarlos cuando el comportamiento por defecto es fuerte (el modelo "sabe" precios de cafés de su entrenamiento).

---

## EL PROBLEMA RAÍZ IDENTIFICADO (no resuelto)

### `catalogo_productos` no está fragmentado

Todos los arsenales de Queswa usan **fragmentos individuales con embeddings Voyage AI** — cuando el modelo pregunta por "PV del Cordygold", vector search recupera solo el fragmento `COMP_PV_06` con la tabla de PV (~800 chars), no el arsenal completo de 36,000 chars.

El `catalogo_productos` es la excepción: es un **documento único de 14,748 chars** que contiene los 22 productos. Cuando se activa, `consultarCatalogoProductos()` entrega TODO ese documento al modelo de una vez.

**Consecuencia:** El modelo recibe 22 productos en contexto. Al responder una pregunta sobre un producto específico ("cuánto cuesta el café"), el modelo puede:
- Leer el precio correcto y responderlo bien
- Confundir productos de nombres similares
- Ignorar la tabla y usar su conocimiento previo (pre-2024)
- Dar el precio de otro producto de la misma tabla

No hay forma de saber cuál de estas cosas está pasando sin logs de producción que muestren qué fragmento se entregó y qué respondió el modelo.

### Los fragmentos de `catalogo_productos` tienen 0 entradas en Supabase

Verificado durante la sesión: en `nexus_documents`, no existe ningún registro con `category` empezando en `catalogo_productos_` (fragmentos individuales). Solo existe el documento madre. Esto contrasta con `arsenal_compensacion` que tiene 38 fragmentos.

---

## ESTADO ACTUAL DEL SISTEMA (06 Abril 2026)

### En Supabase (live en producción ahora):
- ✅ `COMP_CV_01` — tabla PV/CV oficial todos los productos (recreado con embedding)
- ✅ `COMP_PV_06` — tabla PV/precio COP todos los productos (recreado con embedding)
- ✅ System prompt `nexus_main` v21.0 — guardrails de fabricación activos
- ✅ Arsenal compensacion v5.3 — CV/PV corregidos, 14 productos agregados

### En Vercel (desplegado commit `b9d5a2a`):
- ✅ `isClosingFlowEarly()` — solo intención de compra real activa el FSM
- ✅ `patrones_compensacion` — routing de paquetes (precios + contenido) → `arsenal_compensacion`
- ✅ `patrones_productos` — patrones naturales de precio, fix typo schokolade, gano soap
- ⚠️ `consultarCatalogoProductos()` — sin cambios, sigue entregando doc único 14,748 chars

### Pendiente sin implementar:
- ❌ `catalogo_productos` no fragmentado
- ❌ Instrucción en system prompt para mostrar siempre USD + COP juntos en precios de paquetes

---

## INVESTIGACIONES APLICADAS EN ESTA SESIÓN

Tres documentos de investigación fueron base de las decisiones tomadas:

1. **RAG — Formato Markdown Consistente**  
   `public/contexto/investigaciones/RAG_ Formato Markdown Consistente.md`  
   Fundamentó la decisión de mantener fragmentos individuales por respuesta con embeddings Voyage AI, y la importancia del título del fragmento para el matching semántico.

2. **Investigación LLM — Máquinas de Estado Conversacional**  
   `public/contexto/investigaciones/Investigación LLM_ Máquinas de Estado Conversacional.md`  
   Fundamentó el análisis de por qué los bloqueos en system prompt son menos efectivos que el control de estado en código (route.ts) para comportamientos estructurales del modelo.

3. **Arquitectura IA Multi-Tenant y Multi-Dominio**  
   `public/investigaciones/Arquitectura IA Multi-Tenant y Multi-Dominio.md`  
   Contexto del sistema de routing multi-arsenal y cómo el vector search decide qué documento entregar por tenant.

---

## CONTEXTO DE NEGOCIO (no romper)

- **Villano:** el Plan por Defecto — nunca el prospecto ni sus hábitos actuales
- **Héroe:** el Constructor — Queswa es su guía, no su interrogador
- **Estándar de tono:** Lujo Clínico — consultor senior, no vendedor de call center
- **Moneda del plan de pagos:** USD es la moneda estándar del plan global. Tasa corporativa fija: $4,500 COP por dólar. Siempre mostrar ambas cuando se habla de paquetes ESP.
- **Vocabulario prohibido:** "multinivel", "reclutamiento", "libertad financiera", "ingresos pasivos", PII hardcodeada

---

## ARCHIVOS QUE NO DEBES TOCAR

- `src/app/api/nexus/route.ts` línea del fallback hardcodeado — actualizar siempre en Supabase
- Cualquier `*.tsx.bak` — respaldos inactivos
- `.env.local` — no commitear

---

## PREGUNTA CENTRAL PARA EL SIGUIENTE AGENTE

¿Por qué Queswa sigue dando precios incorrectos en COP para productos individuales, a pesar de que:
1. El catálogo tiene los precios correctos en Supabase
2. El routing lleva la consulta al catálogo
3. El system prompt tiene guardrails explícitos contra fabricar precios?

¿El problema es la entrega del documento completo de 14,748 chars? ¿Es un problema de attention del modelo sobre tablas largas? ¿O el routing no está llegando al catálogo en todos los casos y el modelo responde desde entrenamiento?

Sin logs de producción que muestren el fragmento exacto entregado en cada request fallido, no se puede confirmar cuál de estas tres hipótesis es la causa real.
