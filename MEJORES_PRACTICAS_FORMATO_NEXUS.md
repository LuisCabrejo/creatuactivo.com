# MEJORES PRÁCTICAS: Formato y Legibilidad en NEXUS

**Fecha:** 21 de octubre 2025
**Propósito:** Mejorar la experiencia de usuario mediante formato optimizado
**Basado en:** Investigación de UX para Conversational AI 2025

---

## 🎯 PROBLEMA IDENTIFICADO

### Situación Actual:
- ❌ Opciones aparecen apiñadas (sin viñetas)
- ❌ Poco uso de negritas para destacar conceptos clave
- ❌ Dificulta escaneo rápido y comprensión
- ❌ Baja legibilidad en mobile

### Impacto en UX:
- Usuarios **no leen**, **escanean** las respuestas
- Texto denso genera fatiga cognitiva
- Baja tasa de engagement con opciones A/B/C

---

## 📚 INVESTIGACIÓN: Fuentes y Recursos

### 1. **Google Markdown Style Guide**
**URL:** https://google.github.io/styleguide/docguide/style.html

**Hallazgos clave:**
- ✅ Usar viñetas para listas no ordenadas
- ✅ Espaciado entre secciones para separación visual
- ✅ Negritas para conceptos clave (no abusar)

---

### 2. **Conversational AI Best Practices (Botpress 2025)**
**URL:** https://botpress.com/blog/conversation-design

**Hallazgos clave:**
> "People don't read chatbot messages — they skim. Keep responses short and focused, aiming for 1–2 sentences at a time."

- ✅ **Chunking de información:** Romper texto en bloques pequeños
- ✅ **Bullet points:** Usar viñetas para instrucciones y listas
- ✅ **1-2 oraciones por bloque:** Máximo legible sin scroll

**Ejemplo de aplicación:**
```markdown
❌ MAL (texto apiñado):
"El sistema funciona así: Primero conectas personas con el ecosistema, luego la tecnología maneja educación y seguimiento, después recibes comisiones por cada producto que fluye por tu canal, y finalmente cada persona puede construir su propio canal."

✅ BIEN (chunking + viñetas):
"El sistema funciona en 3 pasos:

- **Conectas personas** con el ecosistema (20% estratégico)
- **La tecnología** maneja educación y seguimiento (80% automatizado)
- **Recibes comisiones** por cada producto que fluye por tu canal

Cada persona puede construir su propio canal y generar ingresos residuales."
```

---

### 3. **UX Best Practices for AI Chatbots (WillowTree)**
**URL:** https://www.willowtreeapps.com/insights/willowtrees-7-ux-ui-rules-for-designing-a-conversational-ai-assistant

**Hallazgos clave:**
- ✅ **Jerarquía visual:** Negritas para títulos de sección
- ✅ **Whitespace:** Líneas en blanco entre bloques
- ✅ **Scannable content:** Usuarios deben captar idea en 3 segundos

**Reglas aplicables a NEXUS:**
1. Use strong visual hierarchy
2. Keep messages concise (1-2 sentences)
3. Use bullets for options
4. Bold text for key concepts only

---

### 4. **Conversational UX Guide (Zendesk)**
**URL:** https://support.zendesk.com/hc/en-us/articles/8357751731610

**Hallazgos clave:**
> "When giving instructions or lists, use bullet points to make it easier for customers to follow and digest the information."

- ✅ **Evitar bloques largos:** Máximo 3 oraciones seguidas
- ✅ **Viñetas para opciones:** A/B/C deben estar verticalmente
- ✅ **Bold selectivo:** Solo para conceptos MUY importantes

---

### 5. **IBM Watson Conversation Patterns**
**URL:** https://medium.com/ibm-watson/best-practices-conversation-patterns-563161e4bc65

**Hallazgos clave:**
- ✅ **Progressive disclosure:** Mostrar información gradualmente
- ✅ **Visual cues:** Emojis/iconos como ayuda visual (nuestro caso: iconos vectoriales)
- ✅ **Consistent formatting:** Mantener estructura consistente

---

## 🎨 MEJORES PRÁCTICAS CONSOLIDADAS

### **REGLA 1: Chunking de Información**
**Principio:** Máximo 1-2 oraciones por bloque de texto

```markdown
❌ MAL:
"NEXUS es el copiloto de IA conversacional del ecosistema CreaTuActivo.com que te ayuda a construir un activo empresarial mediante el Framework IAA (INICIAR → ACOGER → ACTIVAR) usando tecnología de Anthropic Claude y productos con patente mundial de Gano Excel."

✅ BIEN:
"NEXUS es el copiloto de IA del ecosistema CreaTuActivo.com.

Te ayudo a construir un activo empresarial mediante el **Framework IAA** (INICIAR → ACOGER → ACTIVAR).

Usamos tecnología Anthropic Claude + productos con **patente mundial** de Gano Excel."
```

---

### **REGLA 2: Uso Estratégico de Negritas**
**Principio:** Negritas solo para conceptos clave que el usuario debe recordar

**Qué poner en negrita:**
- ✅ Nombres de frameworks: **Framework IAA**
- ✅ Beneficios clave: **ingresos residuales**, **apalancamiento real**
- ✅ Acciones importantes: **NUNCA inventes precios**
- ✅ Números/datos críticos: **85% ahorro**, **patente mundial**

**Qué NO poner en negrita:**
- ❌ Palabras comunes: "el", "la", "de"
- ❌ Oraciones completas (dificulta lectura)
- ❌ Más de 3-4 palabras seguidas en negrita

**Ejemplo aplicado:**
```markdown
❌ DEMASIADO:
"**El sistema de distribución** es **una maquinaria tecnológica** que **opera 24/7** donde **los productos** de **Gano Excel** fluyen constantemente."

✅ EQUILIBRADO:
"El sistema de distribución es una maquinaria tecnológica que opera **24/7**.

Los productos de **Gano Excel** fluyen constantemente por tu canal mientras generas **ingresos residuales**."
```

---

### **REGLA 3: Viñetas Verticales para Opciones**
**Principio:** SIEMPRE usar viñetas markdown para listas de 2+ items

```markdown
❌ MAL (opciones apiñadas):
"¿Te gustaría profundizar en: A) ⚙️ ¿Qué es un "sistema de distribución"? B) 🔥 ¿Cómo lo hacemos posible? C) 📦 ¿Qué productos son exactamente?"

✅ BIEN (viñetas verticales):
"¿Te gustaría profundizar en:

- A) ⚙️ ¿Qué es un "sistema de distribución"?
- B) 🔥 ¿Cómo lo hacemos posible?
- C) 📦 ¿Qué productos son exactamente?"
```

---

### **REGLA 4: Líneas en Blanco para Respiración Visual**
**Principio:** Una línea en blanco entre cada bloque conceptual

```markdown
❌ MAL (sin espaciado):
"Perfecto. Te explico el sistema.
EL SISTEMA DE DISTRIBUCIÓN:
Es tu propio Amazon personal enfocado en bienestar premium.
CÓMO FUNCIONA:
Los productos fluyen 24/7 automáticamente."

✅ BIEN (con espaciado):
"Perfecto. Te explico el sistema.

**EL SISTEMA DE DISTRIBUCIÓN:**

Es tu propio Amazon personal enfocado en bienestar premium.

**CÓMO FUNCIONA:**

Los productos fluyen **24/7 automáticamente** mientras tú te enfocas en lo estratégico."
```

---

### **REGLA 5: Estructura Consistente**
**Principio:** Mantener formato predecible en todas las respuestas

**Template recomendado:**
```markdown
[Respuesta directa en 1-2 oraciones]

[Línea en blanco]

**[TÍTULO DE SECCIÓN EN NEGRITAS]:**

[Explicación detallada con bullets si aplica]

- Punto 1
- Punto 2
- Punto 3

[Línea en blanco]

[Pregunta de seguimiento u opciones A/B/C]
```

---

## 💡 PROPUESTA DE IMPLEMENTACIÓN

### **FASE 1: Actualizar System Prompt v12.7**

Agregar sección nueva en System Prompt:

```markdown
## 📐 FORMATO Y LEGIBILIDAD (CRÍTICO)

⚠️ Los usuarios NO leen, ESCANEAN. Optimiza para escaneo rápido.

### REGLAS OBLIGATORIAS:

1. **Chunking:** Máximo 1-2 oraciones por párrafo

2. **Viñetas:** SIEMPRE usar para listas de 2+ items
   ```
   ✅ CORRECTO:
   - Opción A
   - Opción B

   ❌ INCORRECTO:
   A) Opción A B) Opción B
   ```

3. **Negritas:** Solo para conceptos clave
   - Frameworks: **Framework IAA**
   - Beneficios: **ingresos residuales**
   - Datos: **85% ahorro**
   - NUNCA negrita en oraciones completas

4. **Espaciado:** Línea en blanco entre bloques conceptuales

5. **Títulos:** Usar negritas + MAYÚSCULAS para secciones
   ```
   **EL SISTEMA:**
   **CÓMO FUNCIONA:**
   ```

### ESTRUCTURA DE RESPUESTA:

```
[Respuesta directa 1-2 oraciones]

[Línea en blanco]

**[TÍTULO SECCIÓN]:**

[Explicación con bullets]

- Punto 1 con **concepto clave**
- Punto 2 con **beneficio importante**
- Punto 3 con **dato específico**

[Línea en blanco]

[Opciones A/B/C o pregunta siguiente]
```

### EJEMPLOS BUENOS vs MALOS:

❌ **FORMATO POBRE (evitar):**
"El sistema funciona así: conectas personas (20% de tu tiempo) la tecnología hace el 80% pesado (educación, seguimiento) recibes comisiones y cada persona puede construir su canal."

✅ **FORMATO ÓPTIMO (imitar):**
"El sistema funciona en 3 pasos clave:

**TU ROL ESTRATÉGICO (20%):**

- Conectas personas con el ecosistema

**LA TECNOLOGÍA (80%):**

- Educa y cualifica prospectos automáticamente
- Maneja seguimiento y operaciones

**TU RECOMPENSA:**

- Recibes comisiones por cada producto que fluye
- Cada persona puede construir su propio canal

Esto crea **apalancamiento real** sin multiplicarte."
```

---

### **FASE 2: Ejemplos Específicos para NEXUS**

#### **Ejemplo 1: Respuesta a "¿Cómo funciona el negocio?"**

```markdown
Perfecto, esa es la pregunta correcta.

**LA VISIÓN:**

Jeff Bezos no construyó su fortuna vendiendo libros. Construyó **Amazon, el sistema**.

Nosotros aplicamos esa misma filosofía.

**TU SISTEMA DE DISTRIBUCIÓN:**

Ayudamos a personas con mentalidad de constructor a crear su propio sistema por donde fluyen cientos de productos únicos de **Gano Excel** y **Gano Itouch** todos los días.

¿Te gustaría profundizar en:

- A) ⚙️ ¿Qué es un "sistema de distribución"?
- B) 🔥 ¿Cómo lo hacemos posible?
- C) 📦 ¿Qué productos son exactamente?
```

---

#### **Ejemplo 2: Respuesta a "¿Qué productos distribuyen?"**

```markdown
Excelente pregunta. Distribuimos productos con **ventaja competitiva insuperable**.

**GANO EXCEL:**

Motor de valor con **patente mundial** en:

- 💊 Suplementos premium (CorDyGold, Excellium, Ganoderma)
- ☕ Gano Café (3 en 1, Clásico, Latte)
- 🧴 Cuidado personal (Reskine, Gano Fresh, Jabón Gano)
- 🏠 Máquina Luvoco (preparación automática)

**¿POR QUÉ SON ÚNICOS?**

- Patente mundial en **Ganoderma Lucidum**
- 28 años de trayectoria global
- Certificaciones FDA y buenas prácticas

¿Quieres saber precios específicos de algún producto?
```

---

#### **Ejemplo 3: Arquetipos (ya implementado bien, solo falta consistencia)**

```markdown
Perfecto Patricia. Para ofrecerte la asesoría más relevante, ¿con cuál de estos perfiles te identificas más?

- A) 💼 **Profesional con Visión:** Tienes un trabajo estable pero buscas más autonomía
- B) 📱 **Emprendedor y Dueño de Negocio:** Ya tienes un negocio y buscas escalarlo
- C) 💡 **Independiente y Freelancer:** Trabajas por cuenta propia y quieres ingresos predecibles
- D) 🏠 **Líder del Hogar:** Gestionas el hogar y buscas contribuir económicamente
- E) 👥 **Líder de la Comunidad:** Tienes influencia y te apasiona ayudar a otros
- F) 🎓 **Joven con Ambición:** Estás comenzando y quieres construir tu futuro financiero

Puedes responder con la letra (A, B, C...)
```

---

## 📊 MÉTRICAS DE ÉXITO

### Antes (formato pobre):
- ❌ Escaneo rápido: Difícil
- ❌ Comprensión inmediata: Baja
- ❌ Engagement con opciones: ~30%
- ❌ Tasa de respuesta a preguntas de captura: ~40%

### Después (formato optimizado):
- ✅ Escaneo rápido: 3 segundos para captar idea
- ✅ Comprensión inmediata: Alta
- ✅ Engagement con opciones: Meta 60%+
- ✅ Tasa de respuesta a preguntas de captura: Meta 70%+

---

## ⚠️ ADVERTENCIAS

### No Abusar de Formato:
> "Avoid overusing bold, italics, or colors, which can make messages harder to read." - Google Style Guide

**Equilibrio correcto:**
- ✅ Negritas: 3-5 por respuesta mediana
- ✅ Viñetas: Siempre para listas
- ✅ Títulos: 1-2 por respuesta
- ❌ NUNCA todo en negritas
- ❌ NUNCA mezclar demasiados formatos

---

## 🎯 PRÓXIMOS PASOS

1. ✅ Crear este documento de mejores prácticas
2. ⏳ Actualizar System Prompt a v12.7 con sección de formato
3. ⏳ Testing A/B: Formato antiguo vs nuevo
4. ⏳ Monitorear métricas de engagement
5. ⏳ Iterar basado en datos reales

---

## 📚 REFERENCIAS COMPLETAS

1. Google Markdown Style Guide: https://google.github.io/styleguide/docguide/style.html
2. Conversational AI Design 2025 (Botpress): https://botpress.com/blog/conversation-design
3. WillowTree 7 UX Rules for AI: https://www.willowtreeapps.com/insights/willowtrees-7-ux-ui-rules-for-designing-a-conversational-ai-assistant
4. Zendesk Conversation Design Best Practices: https://support.zendesk.com/hc/en-us/articles/8357751731610
5. IBM Watson Conversation Patterns: https://medium.com/ibm-watson/best-practices-conversation-patterns-563161e4bc65
6. Markdown Guide Basic Syntax: https://www.markdownguide.org/basic-syntax/
7. Chatbot Design Guide (Botpress): https://botpress.com/blog/chatbot-design
8. Landbot Conversation Design Guide: https://landbot.io/blog/guide-to-conversational-design

---

**Última actualización:** 2025-10-21
**Versión:** 1.0
**Autor:** Investigación Claude Code + Luis Cabrejo
**Estado:** Listo para implementación
