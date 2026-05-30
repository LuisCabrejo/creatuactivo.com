# PROMPT DE INVESTIGACIÓN
## Cómo startups élite resuelven routing de IA multi-tenant con knowledge bases heterogéneas

**Para:** Agente de investigación (Gemini Deep Research / Perplexity Pro / Claude con acceso web)
**Tipo:** Investigación técnica + arquitectura de producto
**Profundidad requerida:** Alta — incluir patrones de código, arquitecturas reales, casos documentados

---

## CONTEXTO DEL PROBLEMA (léelo completo antes de investigar)

### Quiénes somos

Operamos un ecosistema de 4 dominios que comparten **una sola API de IA** (`POST /api/nexus`) y **una sola base de datos Supabase**. Un chatbot de ventas llamado Queswa atiende a visitantes de los 4 sitios con identidades completamente distintas:

| Dominio | Rol de Queswa | Knowledge base |
|---------|--------------|----------------|
| `creatuactivo.com` | Filtrar prospectos para funnel de distribución multinivel | Arsenal de objeciones, compensación, metodología EAM, 135 fragmentos |
| `luiscabrejo.com` | Marca personal de Luis Cabrejo — posicionar autoridad, no vender | Historia personal, epifanías, metodología |
| `queswa.app` | Dashboard operativo — CRM, pipeline, métricas (usuario autenticado) | Comandos operativos, no knowledge base pública |
| `ganocafe.online` | Concierge de ventas e-commerce — dar precios, resolver dudas, cerrar venta | Catálogo de productos con precios específicos de esa tienda |

El tenant se inyecta via header `x-tenant-id` en cada request. La API lee el system prompt dinámico por tenant desde Supabase.

### Stack técnico

- **API**: Next.js 14 Edge Runtime (`route.ts` — un solo archivo de ~3,500 líneas)
- **Vector DB**: Supabase (`nexus_documents` table) con embeddings Voyage AI (512-dim)
- **LLM**: Anthropic Claude Sonnet 4.x (streaming)
- **Fragmentación**: ~135 fragmentos totales — cada respuesta de arsenal = 1 fragmento con embedding propio
- **Cache**: In-memory por instancia Edge (TTL 5 min)

---

## PROBLEMA CONCRETO QUE NECESITAMOS RESOLVER

### El bug que acabamos de parchear (y por qué el parche es frágil)

**Síntoma**: Queswa en ganocafe.online, cuando el usuario preguntaba "¿cuánto cuesta el Gano Café 3 en 1?", respondía con una redirección genérica ("Para precios actualizados visita ganocafe.online") en lugar de dar el precio específico ($135.900 COP).

**Causa raíz (cadena de fallos)**:

1. `getArsenalFragments()` tenía hardcoded `.eq('tenant_id', 'creatuactivo_marketing')` → los 13 fragmentos del tenant `ecommerce` nunca se cargaban al cache en memoria
2. El clasificador de rutas (`clasificarDocumentoHibrido`) era agnóstico al tenant — clasificaba "dame el precio del Gano Café 3 en 1" como `catalogo_productos` (catálogo de creatuactivo con precios de distribuidor, no precios de ganocafe.online)
3. El system prompt del tenant ganocafe tenía una regla defensiva: "Si no encuentras el precio en el contexto → redirige a ganocafe.online" — que se disparaba cuando el contexto recuperado era incorrecto

**Parche aplicado**:
```typescript
// 1. Eliminamos el filtro de tenant en getArsenalFragments() → carga todos los fragmentos
// 2. Agregamos branch: si tenantId === 'ecommerce' → salta clasificación → directo a arsenal_ganocafe
if (tenantId === 'ecommerce') {
  const gcFragments = await searchArsenalFragments(latestUserMessage, 'arsenal_ganocafe', 5);
  // ...
}
```

**Por qué el parche es frágil**:
- Es un `if (tenantId === 'ecommerce')` hardcodeado — cada nuevo tenant necesita una nueva rama de código
- El cache de fragmentos mezcla todos los tenants en memoria — escala mal con muchos tenants
- El clasificador de rutas sigue siendo monolítico y no sabe de tenants
- No hay separación de concerns: el routing, el retrieval y la construcción de contexto están entrelazados en ~3,500 líneas de un solo archivo

---

## LO QUE NECESITAMOS INVESTIGAR

### Pregunta central

**¿Cómo resuelven este problema las startups élite de AI (Intercom Fin, Zendesk AI, Kustomer, Sierra AI, Bland AI, Voiceflow, Botpress, etc.) cuando tienen que servir múltiples "agents" con knowledge bases distintas desde una sola plataforma?**

### Preguntas específicas (responde cada una)

#### 1. Arquitectura de routing multi-tenant

- ¿Cómo aíslan el routing de documentos/knowledge por tenant sin hardcodear condiciones por tenant en el código principal?
- ¿Usan middleware de routing? ¿Namespacing de vectores? ¿Índices separados por tenant?
- Ejemplos concretos: ¿Cómo lo hace Pinecone con namespaces? ¿Cómo lo hace Weaviate con tenancy? ¿Cómo lo hace Qdrant con collections?

#### 2. Clasificadores de intent agnósticos al tenant

- El clasificador de rutas actual usa regex + vector search contra documentos del tenant `creatuactivo_marketing`. Esto es incorrecto para otros tenants.
- ¿Cómo construyen clasificadores de intent que funcionen correctamente para diferentes dominios de negocio (e-commerce vs. funnel de ventas vs. soporte técnico) sin reentrenar por tenant?
- Patrones: intent routing por metadata del tenant, dynamic routing tables, o routing puramente vectorial sin clasificadores basados en reglas.

#### 3. Cache de embeddings multi-tenant

- El cache actual es un array en memoria que mezcla todos los tenants. No tiene TTL por tenant. Un tenant con alto tráfico puede contaminar el cache de otro.
- ¿Cómo implementan cache de embeddings multi-tenant empresas como Cohere, Voyage AI, OpenAI?
- Patrones recomendados: Redis con key `tenant:{id}:fragment:{hash}`, `LRU por tenant`, o cache-aside con Supabase pgvector.

#### 4. Prevención de alucinaciones de precios/datos estructurados

- El problema específico: el LLM inventaba precios (USD 45 para un café de $135.900 COP) cuando el contexto recuperado era vacío o incorrecto.
- ¿Cómo plataformas como Intercom Fin, Ada CX o Sierra AI garantizan que el LLM NUNCA invente datos factuales (precios, fechas, disponibilidad)?
- Técnicas: guardrails a nivel de sistema, verificación post-generación, structured outputs con JSON schema, tool calling obligatorio para datos factuales.

#### 5. Widget embebido en sitios externos (cross-origin)

- Tenemos un widget JS que llama a nuestra API desde `ganocafe.online` (WordPress) hacia `creatuactivo.com/api/nexus` vía CORS.
- ¿Cómo manejan este patrón Intercom, Drift (ahora Salesloft), Crisp, Tawk.to?
- ¿Es mejor patrón tener un proxy local en el dominio del cliente, o llamada directa cross-origin con CORS?
- ¿Qué hacen con el fingerprinting/tracking cuando el widget está embebido en un dominio diferente al que sirve la IA?

#### 6. Arquitectura recomendada para nuestro caso

Dado el contexto descrito arriba (Next.js Edge, Supabase pgvector, Voyage AI, ~4 tenants, ~150 fragmentos totales hoy, proyección 500+ en 12 meses), ¿cuál es la arquitectura recomendada por la industria?

Evalúa estas opciones y recomienda:

**Opción A — Índice vectorial por tenant (namespaced)**
- Un namespace/collection separado por tenant en el vector DB
- El router simplemente pasa el namespace correcto al search
- Ventaja: aislamiento total, sin mezcla en cache
- Desventaja: overhead de gestión de índices, más caro en algunos providers

**Opción B — Metadata filtering (como tenemos hoy, pero bien hecho)**
- Un solo índice vectorial, filtrar por `tenant_id` en cada query
- Eliminar el cache global, usar per-request retrieval o cache por tenant
- Ventaja: simple, menos overhead
- Desventaja: todos los tenants en el mismo espacio vectorial, posible contaminación semántica

**Opción C — RAG pipeline modular con tenant registry**
- Un registry de tenants que define: knowledge base, clasificador de intent, system prompt, guardrails
- El pipeline orquestador llama al componente correcto según el tenant, sin código hardcodeado
- Frameworks: LangChain, LlamaIndex, Haystack, Semantic Kernel

**Opción D — Agent por tenant con tool use**
- En lugar de inyectar contexto en el system prompt, cada tenant tiene un "agent" con tools propias
- Tool: `buscar_producto(nombre)` → retorna precio desde DB
- Ventaja: NUNCA alucina precios (tool llama a la fuente de verdad)
- Desventaja: latencia de tool calling (~500ms extra por tool)

---

## CASOS DE ESTUDIO ESPECÍFICOS A INVESTIGAR

Investiga cómo resuelven **exactamente este problema** las siguientes empresas:

1. **Intercom Fin** — Tienen un producto de AI con múltiples "workspaces" (tenants) y knowledge bases distintas por cliente. ¿Cómo aíslan el retrieval?

2. **Voiceflow** — Plataforma de chatbots con miles de "agents" distintos para clientes diferentes, todos en la misma infraestructura. ¿Cómo manejan el routing y el knowledge base?

3. **Sierra AI** (sierra.ai — founded by Bret Taylor) — AI conversational agents para empresas como Sonos, WeightWatchers. Cada cliente tiene knowledge base y comportamiento diferente. ¿Qué arquitectura usan?

4. **Dust.tt** — Plataforma de AI agents multi-tenant con knowledge bases custom. Open source en partes. Revisar su arquitectura de retrieval.

5. **Botpress** — Open source, self-hosted, multi-tenant. Revisar cómo implementan el knowledge base por "bot" y el routing de intents.

6. **Zendesk AI (Fin)** — Enterprise multi-tenant. ¿Cómo garantizan que el AI de un cliente de Zendesk NUNCA responda con datos de otro cliente?

---

## FORMATO DE RESPUESTA ESPERADO

Entrega la investigación en estas secciones:

### SECCIÓN 1: Patrones de Arquitectura (Top 3 más usados por élite)
Para cada patrón: descripción, empresas que lo usan, código de ejemplo conceptual, pros/cons.

### SECCIÓN 2: Solución Recomendada para Nuestro Stack
Dado nuestro contexto específico (Next.js Edge, Supabase, Voyage AI, 4 tenants, escala pequeña), cuál es la arquitectura recomendada con pasos concretos de implementación.

### SECCIÓN 3: Quick Wins (cambios de < 4 horas que resuelven el 80% del problema)
Qué podemos hacer esta semana sin refactorizar toda la arquitectura.

### SECCIÓN 4: Hoja de Ruta a 90 días
Qué construir en qué orden para llegar a una arquitectura sólida a escala.

### SECCIÓN 5: Recursos
Papers, artículos, repositorios, documentación oficial relevantes. Solo fuentes de alta credibilidad (documentación oficial, papers arxiv, engineering blogs de las empresas).

---

## RESTRICCIONES DE LA INVESTIGACIÓN

- **Stack actual inamovible a corto plazo**: Next.js 14, Supabase, Voyage AI, Anthropic Claude. Las soluciones deben ser compatibles.
- **Presupuesto de infraestructura**: < $200 USD/mes adicionales. Sin migraciones a Pinecone Enterprise ni soluciones SaaS caras.
- **Equipo**: 1 desarrollador + Claude Code como agente de implementación. Sin devops dedicado.
- **Tiempo de respuesta requerido**: < 3 segundos end-to-end (incluyendo LLM streaming). Las soluciones no deben agregar > 500ms de latencia.
- **Confiabilidad de precios**: El LLM NUNCA debe inventar precios. Este es el requisito más crítico para ganocafe.online (e-commerce directo).

---

*Fecha de generación: 24 Mar 2026*
*Contexto: CreaTuActivo / Queswa — ecosistema multi-dominio Colombia*
