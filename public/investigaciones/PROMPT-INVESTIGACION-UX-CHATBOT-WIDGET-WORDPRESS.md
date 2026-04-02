# PROMPT DE INVESTIGACIÓN: UX de Chatbot Widget en Entornos WordPress/cPanel

> **Para**: Agente investigador (Gemini, Manus, Perplexity, o similar)
> **Objetivo**: Descubrir cómo las empresas élite del mundo resuelven problemas de UX en widgets de chatbot IA embebidos en sitios WordPress, específicamente en entornos sin framework (vanilla JS), con respuestas en streaming y renderizado de markdown.
> **Entregable**: Documento con hallazgos, benchmarks, patrones recomendados y snippets de implementación

---

## CONTEXTO DEL PROYECTO

Estamos construyendo un widget de chatbot IA llamado **Queswa** para embeber en páginas de aterrizaje de Google Ads alojadas en **cPanel** (servidor compartido sin Node.js, sin React, sin build tools). El widget es un **IIFE en vanilla JS puro** que se inyecta en el HTML de la landing page.

### Stack tecnológico exacto:

| Capa | Tecnología |
|------|-----------|
| Frontend widget | Vanilla JS (IIFE) + CSS inyectado inline |
| Entorno de host | WordPress / cPanel (sin framework) |
| API backend | Next.js 14 + Edge Runtime en Vercel (`/api/nexus`) |
| Modelo IA | Anthropic Claude (claude-sonnet-4-6) vía API |
| Protocolo de respuesta | **Streaming SSE** — chunks de texto plano + prefijo `data:` |
| Embeddings / búsqueda | Voyage AI (semántica) + Supabase pgvector |
| Multi-tenant | Header `x-tenant-id` — el mismo backend sirve múltiples marcas |
| Formato de respuesta IA | Markdown con `**bold**`, `• bullets`, `1. listas`, encabezados |

### Cómo funciona el widget:

```
Usuario escribe → POST streaming a creatuactivo.com/api/nexus
                       → chunks SSE llegan en tiempo real
                       → se muestran en tiempo real (textContent)
                       → al finalizar stream: se parsea markdown → innerHTML
```

### El widget se incrusta así en WordPress/cPanel:
```html
<!-- En index.html de landing page en cPanel -->
<script>
  (function() {
    // Widget autocontenido: estilos + HTML + lógica
    // Sin dependencias externas excepto la llamada a la API
  })();
</script>
```

---

## PROBLEMAS UX ESPECÍFICOS A INVESTIGAR

Necesitamos que el agente investigador encuentre las **mejores soluciones del mercado** para cada uno de estos 6 problemas:

---

### PROBLEMA 1: Renderizado de Markdown en Streaming

**Situación actual**: Durante el streaming mostramos `textContent` plano (sin parsear). Al terminar el stream, aplicamos un parser markdown propio que convierte `**bold**`, `• bullets`, `1. listas` y `**HEADER:**` a HTML semántico.

**Problema**: El cambio abrupto de texto plano → HTML formateado al final del stream puede verse como un "flash" de reestructuración visual. Además, nuestro parser casero puede fallar con edge cases del modelo.

**Investigar**:
- ¿Cómo resuelven el streaming + markdown rendering en tiempo real **Intercom**, **Drift**, **Tidio**, **Crisp** y **ChatGPT** (interface web)?
- ¿Existe alguna librería ultra-ligera (<10KB minificada) de markdown-to-HTML apropiada para vanilla JS sin build tools? (marked.js, snarkdown, micromark, etc.) — con comparativa de tamaño/features/compatibilidad
- ¿Cuál es el patrón "incremental markdown" — renderizar parcialmente mientras llegan chunks sin esperar al final?
- ¿Cómo manejan el problema del markdown incompleto durante streaming (e.g., `**texto` sin cerrar aún)?

---

### PROBLEMA 2: URLs Clickeables en Respuestas del Bot

**Situación actual**: El modelo IA responde con URLs en texto plano (e.g., "visita ganocafe.online") que no son clicables. Necesitamos autolink detection.

**Problema**: En entornos de e-commerce, el bot recomienda páginas de producto — si la URL no es clickeable, el usuario tiene que copiarla manualmente. Fricción = conversión perdida.

**Investigar**:
- ¿Cómo implementan autolink detection los mejores chatbots de e-commerce (Tidio, Gorgias, Re:amaze, Shopify Inbox)?
- ¿Cuál es la regex más robusta y segura para detectar URLs en texto markdown sin romper el parseo de bold/italic? (problema conocido: `**visita ganocafe.online**` — el autolink no debe romper el bold)
- ¿Deben los links abrir en `_blank` con `rel="noopener noreferrer"`? ¿Cómo manejan el phishing risk?
- ¿Existe algún patrón de "smart link preview" (como iMessage/Slack) apropiado para un widget lateral de 440px?
- Benchmarks de UX: ¿qué porcentaje de usuarios hace clic en URLs dentro de chatbots vs. copiar-pegar?

---

### PROBLEMA 3: Efecto de Fade / Jerarquía Visual en Historial de Conversación

**Situación actual**: Aplicamos `opacity: 0.55` a mensajes más viejos que los últimos 4. Esto crea jerarquía visual para que el foco esté en el intercambio reciente.

**Problema**: El efecto puede sentirse "extraño" para usuarios no acostumbrados. No sabemos si mejora o daña la UX percibida.

**Investigar**:
- ¿Usan fade/dimming en conversaciones los chatbots líderes? ¿Claude.ai, ChatGPT, Gemini, Intercom, Drift?
- ¿Qué dice la literatura de UX/HCI sobre jerarquía visual en interfaces conversacionales? (buscar en Nielsen Norman Group, Baymard Institute, ACM CHI papers)
- ¿Cuáles son las alternativas al fade? (e.g., separadores visuales, scroll automático con sticky, colapso de mensajes viejos, "mostrar historial" expandible)
- En mobile, ¿el fade introduce problemas de accesibilidad (WCAG contraste mínimo 4.5:1)?
- ¿Cuál es el patrón de gestión de historial de Intercom y Drift en paneles de 440px?

---

### PROBLEMA 4: Separadores Visuales entre Pares Q&A

**Situación actual**: Usamos `border-top: 1px solid rgba(255,255,255,0.06)` + `margin-top: 20px` en el segundo mensaje de usuario en adelante para separar los pares pregunta-respuesta.

**Problema**: El separador es casi invisible (opacity 6%). Se pierde la estructura conversacional.

**Investigar**:
- ¿Cómo estructuran visualmente los pares Q&A los mejores chatbots de soporte/ventas?
- ¿Hay diferencia en UX entre separadores de línea vs. separadores de color de fondo vs. agrupación con borde?
- ¿Cuál es la densidad visual óptima para chats de e-commerce donde el bot hace preguntas de cualificación? (contexto: estamos vendiendo café funcional, el bot guía al usuario hacia la compra)
- Buscar estudios o artículos sobre "conversational UI message grouping patterns"
- ¿Qué hace WhatsApp Business API con sus mensajes de template — tienen separadores?

---

### PROBLEMA 5: Espaciado y Tipografía en Burbujas del Bot

**Situación actual**: Las respuestas del bot son párrafos `<p>` con poco margen entre ellos dentro de la burbuja. El texto se siente denso.

**Problema**: Respuestas largas del modelo (3-5 párrafos) se leen como un muro de texto. Los bullets y bold mitigan esto pero no es suficiente.

**Investigar**:
- ¿Cuáles son los valores de `line-height`, `font-size`, `p margin-bottom` que usan los chatbots élite para máxima legibilidad en paneles de ~440px de ancho?
- ¿Cuál es la longitud máxima recomendada de respuesta de bot antes de que el usuario abandone? (Nielsen Norman, Baymard)
- ¿Existe algún patrón de "progressive disclosure" para respuestas largas? (e.g., mostrar 2 párrafos + "Ver más")
- En chatbots de e-commerce, ¿las respuestas cortas y directas convierten mejor que las explicativas? ¿Hay datos de Tidio, Gorgias, o HubSpot sobre longitud óptima de respuesta de bot?
- ¿Cómo manejan la tipografía en widgets Intercom Messenger, Drift, y Freshchat?

---

### PROBLEMA 6: Performance de Widget en WordPress/cPanel

**Situación actual**: El widget es un script de ~400 líneas de JS inline. No bloquea el render (carga como IIFE al final del body). La primera llamada a la API tiene latencia de ~2-4s (cold start en Edge Runtime + Claude API).

**Problema**: En páginas de Google Ads, el Core Web Vitals (LCP, CLS, INP) es crítico. Un widget pesado puede dañar el Quality Score y aumentar el CPC.

**Investigar**:
- ¿Cuál es la estrategia de carga óptima para widgets de terceros en landing pages de Google Ads? (defer, async, lazy load, intersection observer)
- ¿Cómo minimizan el impacto en Core Web Vitals los widgets de Intercom, Drift, HubSpot Chat? (tienen documentación pública sobre esto)
- ¿Cuál es el tamaño máximo de JS inline aceptable antes de que afecte el INP en mobile?
- Estrategias para reducir la latencia del cold start en Edge Functions de Vercel cuando se llama a Claude API
- ¿Existe algún patrón de "skeleton/placeholder" mientras carga el widget que mejore el CLS?
- ¿Cómo manejan Tidio y Crisp el "widget flicker" (el widget aparece después de que la página ya cargó)?

---

## ENTREGABLES ESPERADOS

El agente investigador debe producir un documento con las siguientes secciones:

### 1. Benchmark de Competidores
Tabla comparativa de cómo resuelven cada uno de los 6 problemas:
- Intercom Messenger
- Drift
- Tidio
- Crisp Chat
- HubSpot Live Chat
- Freshchat
- Gorgias (e-commerce)
- ChatGPT web interface (como referencia de calidad)

### 2. Hallazgos por Problema
Para cada uno de los 6 problemas: solución recomendada, fundamento técnico y/o de UX research, ejemplos de implementación, snippets de código cuando aplique.

### 3. Librerías Recomendadas
Lista de librerías vanilla JS (sin dependencias) apropiadas para el contexto:
- Markdown parsing (<10KB)
- Autolink detection
- Animaciones micro (alternativa a Framer Motion para vanilla)

### 4. Priorización por Impacto en Conversión
Ranking de los 6 problemas por impacto esperado en tasa de conversión de e-commerce, basado en datos publicados.

### 5. Guía de Implementación
Pseudocódigo o snippets listos para copiar en el contexto vanilla JS/IIFE del widget, sin dependencias de npm ni build tools.

---

## FUENTES PRIORITARIAS

Investigar preferiblemente en:
- Nielsen Norman Group (nngroup.com)
- Baymard Institute (baymard.com)
- ACM Digital Library — CHI papers sobre conversational UI
- Blog técnico de Intercom (intercom.com/blog)
- Blog técnico de Drift
- Tidio Research / State of Live Chat reports
- web.dev (Google) — Core Web Vitals
- MDN Web Docs — APIs nativas del browser
- GitHub — repos de marked.js, snarkdown, micromark, showdown (comparar stars, size, last update)
- Documentación oficial de Vercel Edge Runtime

---

## RESTRICCIONES DE IMPLEMENTACIÓN

El agente debe tener en cuenta que cualquier solución propuesta debe:

1. **Funcionar sin npm / build tools** — el widget se despliega como HTML estático en cPanel
2. **No agregar más de ~15KB** al tamaño total del widget (actualmente ~35KB inline)
3. **Ser compatible con Chrome 90+, Safari 14+, Firefox 88+** (usuarios de Colombia/Latam)
4. **No introducir dependencias CDN adicionales** a menos que sean absolutamente necesarias (cada CDN call es un punto de falla y latencia)
5. **Ser seguro contra XSS** — el widget renderiza HTML generado por IA; cualquier parser de markdown debe sanitizar el output
6. **Mantener el diseño visual actual**: fondo oscuro `#0F1115`, gold `#D4AF37`, tipografía system-ui

---

## PREGUNTA SÍNTESIS

Al final del documento, responder esta pregunta ejecutiva:

> *"Si Intercom, Drift o un equipo de producto de Silicon Valley tuviera que construir un chatbot IA de ventas para una landing page de Google Ads en WordPress/cPanel — sin framework, con streaming de Claude API y markdown en las respuestas — ¿qué decisiones técnicas y de UX tomaría? ¿En qué orden las implementaría para maximizar conversión?"*

---

*Fecha de investigación solicitada: marzo 2026*
*Proyecto: GanoCafé x CreaTuActivo — Widget Queswa (tenant: ecommerce)*
*Contexto completo disponible en: `/Users/luiscabrejo/Cta/marketing/CLAUDE.md`*
