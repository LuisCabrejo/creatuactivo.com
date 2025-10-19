# 🧠 NEXUS - Roadmap de Inteligencia Conversacional

**Versión:** 1.0
**Fecha:** 19 de Octubre 2025
**Objetivo:** Evolucionar NEXUS de chatbot a sistema de inteligencia que aprende y potencia a los Constructores

---

## 🎯 VISIÓN ESTRATÉGICA

NEXUS debe convertirse en el **copiloto inteligente** que:
1. **Aprende** de las conversaciones más exitosas
2. **Identifica** patrones de conversión por arquetipo
3. **Potencia** a los Constructores con insights accionables
4. **Automatiza** la generación de mensajes optimizados

---

## 📊 FASE 1.5 - OPTIMIZACIÓN INMEDIATA (Esta semana)

### **Contexto:**
Según análisis del usuario, las preguntas más frecuentes son:

**Top 4 Preguntas del Usuario:**
1. ¿Cómo funciona el negocio? (`FREQ_02`)
2. ¿Cómo se gana en el negocio? (`FREQ_11`)
3. ¿Qué hay que hacer? (contexto de "qué debo hacer yo")
4. Preguntas sobre paquetes y formas de inicio (`FREQ_03`)

**Preguntas por Defecto (Botones):**
Del arsenal conversacional inicial, identificamos **13 botones predefinidos** que son clicks directos:

**FREQ_02 - Nivel 1:**
- ➡️ ¿Quieres saber cómo lo hacemos posible?
- ⚙️ ¿Qué es un "sistema de distribución"?
- 📦 ¿Qué productos son?

**FREQ_02 - Nivel 2:**
- ➡️ Explícame el 80% que hace la tecnología
- 🧠 ¿Cuál es mi 20% estratégico?
- 💡 ¿Cómo se ve eso en la práctica?

**FREQ_02 - Nivel 3:**
- ➡️ ¿Qué herramientas tengo para INICIAR?
- 🤝 ¿Cómo sé cuándo ACOGER?
- 🚀 ¿Cómo es el proceso de ACTIVAR?

**Otras preguntas frecuentes:**
- ¿Cuál es la inversión para empezar? (`FREQ_03`)
- ¿Cómo funciona el negocio? (`FREQ_02`)
- ¿Cómo se gana en el negocio? (`FREQ_11`)
- ¿Es un activo heredable? (`FREQ_05`)

---

### **🔥 OPTIMIZACIÓN: Bloque Cacheable de FAQ**

#### **Propuesta Técnica:**

Crear un **4to bloque cacheable** con las respuestas a estas preguntas frecuentes pre-cargadas:

```typescript
// En route.ts - Nuevo bloque antes de session instructions

const topQueriesFAQ = `
## 🔥 PREGUNTAS MÁS FRECUENTES - RESPUESTAS OPTIMIZADAS

### FREQ_02: "¿Cómo funciona el negocio?"
[Contenido completo del flujo de 3 niveles]

### FREQ_11: "¿Cómo se gana en el negocio?"
[Contenido completo de flujos de valor]

### FREQ_03: "¿Cuál es la inversión para empezar?"
[Contenido completo de arquitecturas iniciales]

### FREQ_05: "¿Es un activo heredable?"
[Contenido completo]

### Botones predefinidos optimizados:
[Las 13 respuestas a botones del flujo conversacional]
`;

const response = await anthropic.messages.create({
  system: [
    { type: 'text', text: baseSystemPrompt, cache_control: { type: 'ephemeral' } },
    { type: 'text', text: arsenalContext, cache_control: { type: 'ephemeral' } },
    { type: 'text', text: topQueriesFAQ, cache_control: { type: 'ephemeral' } }, // ← NUEVO
    { type: 'text', text: sessionInstructions }
  ],
  // ...
});
```

#### **Beneficios:**

1. **Cache hit rate: 95%+** - Si 70% del tráfico son estas preguntas, cache hit sube de 80% a 95%
2. **Respuestas instantáneas** - Claude tiene las FAQ ya en memoria
3. **Consistencia perfecta** - Siempre responde con el arsenal exacto
4. **Ahorro adicional: 15-20%** en tokens vs búsqueda semántica

#### **Implementación:**

1. Extraer las 4 preguntas top + 13 botones del arsenal
2. Crear string `topQueriesFAQ` optimizado (~3-4K chars)
3. Agregar como 4to bloque cacheable
4. Total cache: ~38K chars (15K + 18K + 4K)

---

## 🧠 FASE 2 - SISTEMA DE ANALYTICS E INTELIGENCIA (2-4 semanas)

### **Objetivo:**
Construir el **cerebro analítico** de NEXUS que aprende de cada conversación.

### **2.1 - Tracking de Conversiones**

#### **Tabla Nueva: `nexus_conversation_outcomes`**

```sql
CREATE TABLE nexus_conversation_outcomes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID REFERENCES nexus_conversations(id),
  fingerprint_id TEXT,
  session_id TEXT,

  -- Resultado de la conversación
  outcome_type TEXT, -- 'activated', 'scheduled_call', 'churned', 'nurturing'
  momento_optimo TEXT, -- 'caliente', 'tibio', 'frio'
  archetype TEXT, -- del prospecto

  -- Métricas de la conversación
  total_messages INT,
  duration_minutes INT,
  questions_asked TEXT[], -- array de preguntas del prospecto
  objections_detected TEXT[], -- array de objeciones

  -- Conversión
  converted BOOLEAN DEFAULT FALSE,
  conversion_date TIMESTAMP,
  conversion_package TEXT, -- 'inicial', 'empresarial', 'visionario'

  created_at TIMESTAMP DEFAULT NOW()
);
```

#### **RPC Function: `track_conversation_outcome`**

```sql
CREATE OR REPLACE FUNCTION track_conversation_outcome(
  p_session_id TEXT,
  p_outcome_type TEXT,
  p_converted BOOLEAN DEFAULT FALSE
)
RETURNS JSON AS $$
  -- Analiza conversación completa
  -- Extrae arquetipos, objeciones, preguntas
  -- Guarda outcome para analytics
$$ LANGUAGE plpgsql;
```

---

### **2.2 - Dashboard de Inteligencia para Constructores**

#### **Nueva Página: `/inteligencia/insights`**

Métricas que un Constructor puede ver:

**📊 TUS MÉTRICAS:**
- Tasa de conversión por arquetipo (Emprendedor: 35%, Profesional: 28%, etc.)
- Preguntas que más convierten en tu pipeline
- Objeciones más frecuentes y cómo resolverlas
- Momento óptimo promedio de tus prospectos calientes

**🎯 BENCHMARKS DEL ECOSISTEMA:**
- Top 3 preguntas con mayor conversión (comunidad)
- Arquetipos con mejor ROI
- Mensajes de contacto con mayor respuesta

**💡 RECOMENDACIONES PERSONALIZADAS:**
- "Tus prospectos 'emprendedores' convierten 2x mejor con el paquete Empresarial"
- "El 70% de tus 'calientes' convirtieron después de ver el flujo de 3 niveles"

---

### **2.3 - Analytics Query: Top Conversiones**

```sql
-- Vista: Preguntas con mayor tasa de conversión
CREATE VIEW nexus_top_converting_questions AS
SELECT
  question_text,
  COUNT(*) as times_asked,
  SUM(CASE WHEN converted = true THEN 1 ELSE 0 END) as conversions,
  ROUND(
    (SUM(CASE WHEN converted = true THEN 1 ELSE 0 END)::NUMERIC / COUNT(*)) * 100,
    2
  ) as conversion_rate_percent
FROM (
  SELECT
    unnest(questions_asked) as question_text,
    converted
  FROM nexus_conversation_outcomes
) subquery
GROUP BY question_text
HAVING COUNT(*) >= 5 -- mínimo 5 veces preguntada
ORDER BY conversion_rate_percent DESC
LIMIT 20;
```

---

## 🚀 FASE 3 - GENERADOR INTELIGENTE DE MENSAJES (4-6 semanas)

### **Objetivo:**
Automatizar la creación de mensajes de contacto optimizados usando la inteligencia acumulada.

### **Nueva Herramienta: `/inteligencia/generador-mensajes`**

#### **Inputs del Constructor:**
1. Arquetipo del prospecto (Emprendedor, Profesional, Padre de Familia, etc.)
2. Momento óptimo detectado (Caliente, Tibio, Frío)
3. Objeciones conocidas (si las hay)
4. Canal de contacto (WhatsApp, Email, LinkedIn)

#### **Proceso de Generación:**

```typescript
// API: /api/inteligencia/generar-mensaje

async function generarMensajeOptimizado(input: {
  archetype: string;
  momento_optimo: string;
  objections?: string[];
  channel: 'whatsapp' | 'email' | 'linkedin';
}) {
  // 1. Consultar analytics: ¿Qué mensajes convierten mejor para este arquetipo?
  const topMessages = await getTopConvertingMessages(input.archetype);

  // 2. Usar Claude con prompt específico
  const prompt = `
  Genera un mensaje de contacto optimizado para:
  - Arquetipo: ${input.archetype}
  - Momento: ${input.momento_optimo}
  - Objeciones conocidas: ${input.objections?.join(', ')}
  - Canal: ${input.channel}

  Basándote en estos mensajes que han convertido bien:
  ${topMessages.map(m => m.template).join('\n')}

  Instrucciones:
  - Tono empático y consultivo (no vendedor)
  - Máximo 2 párrafos para WhatsApp
  - Incluir call-to-action suave
  - Usar Framework IAA implícitamente
  `;

  const message = await anthropic.messages.create({
    model: 'claude-haiku-4-20250514', // Más barato para generación
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 300,
  });

  return message.content;
}
```

#### **Output:**

```
📱 MENSAJE GENERADO PARA WHATSAPP:

Hola [Nombre], vi tu perfil y me pareció interesante tu experiencia
en [industria]. Te comparto esto porque estamos construyendo algo
único: un ecosistema donde personas con mentalidad emprendedora
crean activos patrimoniales (no empleos).

Lo interesante es que automatizamos el 80% del trabajo operativo
con IA, para que puedas enfocarte en lo estratégico. ¿Te interesa
conocer cómo funciona la arquitectura?

---

💡 INSIGHT: Este mensaje tiene 42% de conversión con perfil
"Emprendedor" en momento "Tibio"

📊 BASADO EN: 23 conversaciones exitosas similares
```

---

## 🎓 FASE 4 - ACE: Asistente de Conversación Estratégica (8-12 semanas)

### **Objetivo:**
Entrenar a los Constructores para las llamadas de ACOGER con simulación de objeciones.

### **Nueva Herramienta: `/inteligencia/asistente-conversacion-estrategica`**

#### **Componentes:**

**1. Carga de Informe de Inteligencia**

```typescript
// Constructor carga datos del prospecto antes de la llamada

interface ProspectIntelligence {
  name: string;
  archetype: string;
  momento_optimo: string;
  questions_history: string[]; // del chat NEXUS
  objections_detected: string[];
  interest_signals: string[];
  conversation_transcript?: string; // opcional
}
```

**2. Análisis Pre-Llamada**

```typescript
// ACE analiza y prepara recomendaciones

const analysis = await analyzeProspect(intelligence);

// Output:
{
  "recommended_approach": "Consultivo empático",
  "likely_objections": ["tiempo", "inversión"],
  "talking_points": [
    "Mencionar que el 80% es automatizado (objeción tiempo)",
    "Enfatizar paquete Constructor Inicial (objeción inversión)"
  ],
  "success_probability": "78%",
  "ideal_moment": "Entre 6-8pm (mejor conversión para este arquetipo)"
}
```

**3. Simulador de Objeciones (Training)**

```typescript
// Modo práctica: Claude simula al prospecto

const simulator = {
  mode: 'training',
  prospect_personality: intelligence.archetype,
  difficulty: 'medium', // easy, medium, hard
};

// Constructor practica manejar objeciones
// Claude actúa como prospecto escéptico
// Evalúa respuestas del Constructor
// Da feedback inmediato
```

#### **Flujo de Uso:**

1. **Pre-Llamada:** Constructor carga informe → ACE analiza → Recomendaciones
2. **Simulación (Opcional):** Constructor practica con Claude-prospecto virtual
3. **Durante Llamada:** ACE sugiere respuestas en tiempo real (future: voz)
4. **Post-Llamada:** Constructor ingresa resultado → Sistema aprende

---

## 📈 MÉTRICAS DE ÉXITO

### **Fase 1.5 (Optimización FAQ):**
- ✅ Cache hit rate: >95%
- ✅ Ahorro adicional: 15-20% en costos
- ✅ Velocidad de respuesta: <500ms para preguntas frecuentes

### **Fase 2 (Analytics):**
- ✅ 100% de conversaciones trackeadas con outcome
- ✅ Dashboard de insights accesible para todos los Constructores
- ✅ Al menos 10 insights accionables por Constructor/semana

### **Fase 3 (Generador Mensajes):**
- ✅ 80% de Constructores usando la herramienta semanalmente
- ✅ Tasa de respuesta de mensajes generados: +30% vs manual
- ✅ Tiempo ahorrado: 15 min/mensaje → 2 min/mensaje

### **Fase 4 (ACE):**
- ✅ 70% de Constructores entrenan con simulador antes de llamadas importantes
- ✅ Tasa de conversión en llamadas: +25% vs sin preparación
- ✅ NPS del sistema ACE: >8/10

---

## 💰 INVERSIÓN ESTIMADA

### **Fase 1.5:**
- **Tiempo:** 2-4 horas
- **Costo:** $0 (optimización del código existente)
- **ROI inmediato:** 15-20% ahorro en API

### **Fase 2:**
- **Tiempo:** 20-30 horas (2-4 semanas)
- **Costo:** Schema de BD, nuevas vistas, página de insights
- **ROI:** Aumento de conversión 10-15% (valor incalculable)

### **Fase 3:**
- **Tiempo:** 30-40 horas (4-6 semanas)
- **Costo:** Desarrollo de UI + lógica de generación
- **ROI:** Ahorro de tiempo para Constructores (15 min/mensaje)

### **Fase 4:**
- **Tiempo:** 60-80 horas (8-12 semanas)
- **Costo:** Sistema complejo con simulación interactiva
- **ROI:** Mejora de conversión en llamadas +25%

---

## 🎯 RECOMENDACIÓN DE EJECUCIÓN

### **Implementar YA (Esta semana):**
✅ **Fase 1.5** - Bloque FAQ cacheable

### **Próximos 30 días:**
🔄 **Fase 2.1** - Tracking de outcomes (fundamento para todo lo demás)

### **60-90 días:**
🔄 **Fase 2.2** - Dashboard de insights
🔄 **Fase 3** - Generador de mensajes

### **6 meses:**
🔄 **Fase 4** - ACE completo

---

## 🔑 CONCLUSIÓN

NEXUS puede evolucionar de un chatbot a un **sistema de inteligencia conversacional** que:

1. **Ahorra costos** (cache optimizado)
2. **Aprende continuamente** (analytics de conversiones)
3. **Potencia Constructores** (insights, generador, ACE)
4. **Escala el éxito** (replica patrones ganadores)

Esta es la diferencia entre tener un "chatbot" y tener un **copiloto inteligente** que hace crecer el negocio.

---

**Próximo paso inmediato:** ¿Implementamos el bloque FAQ cacheable (Fase 1.5) ahora mismo?
