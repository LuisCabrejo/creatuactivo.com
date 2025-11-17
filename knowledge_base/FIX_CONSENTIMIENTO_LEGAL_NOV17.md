# 🔒 Fix: Consentimiento Legal Minimalista (Ley 1581 de 2012 - Colombia)

**Fecha:** 17 Noviembre 2025 (Update 3)
**Problema:** NEXUS improvisa texto de consentimiento, cambia en cada ocasión
**Solución:** Texto exacto obligatorio + opciones Acepto/No acepto + integración Ley 1581

---

## 🎯 Problema Identificado (Reporte Usuario)

"No está funcionando correctamente el texto que tenemos por defecto para el consentimiento de datos, en cada ocasión da una opción diferente"

**Causa raíz:** NEXUS no tenía instrucciones específicas sobre consentimiento legal, improvisaba el texto cada vez.

---

## ✅ Solución Aplicada

### **Nueva Sección en System Prompt: CONSENTIMIENTO LEGAL**

**Ubicación:** Líneas 188-234 (ANTES de captura de datos)

### **1. Texto Exacto Obligatorio**

NEXUS ahora debe usar SIEMPRE este texto (basado en documento "Chatbot: Recopilación de Datos para Startup.md"):

```
Para poder conversar y ofrecerte una experiencia personalizada, necesito tu autorización para tratar los datos que compartas conmigo, de acuerdo con nuestra Política de Privacidad (https://creatuactivo.com/politica-privacidad).

Esto nos permite recordar tu progreso y darte un mejor servicio.

¿Estás de acuerdo?
```

**Características del texto:**
- ✅ Minimalista (3 líneas)
- ✅ Cumple Ley 1581 de 2012 (Colombia)
- ✅ Enlace a política completa
- ✅ Beneficio claro para el usuario
- ✅ Pregunta directa

---

### **2. Opciones Estandarizadas (Acepto/No acepto)**

```
A) ✅ Acepto

B) ❌ No, gracias

C) 📄 Leer política completa
```

**Formato obligatorio:** Opciones A, B, C con emojis para claridad visual

---

### **3. Manejo de Respuestas**

#### **Si usuario acepta:**
```
NEXUS: "Perfecto, gracias por tu confianza. Continuemos..."
```
- Proceder con conversación normal
- Habilitar captura de datos

#### **Si usuario rechaza:**
```
NEXUS: "Entiendo tu decisión. Puedo seguir respondiendo preguntas generales, pero no podré personalizar la experiencia ni recordar nuestra conversación. ¿En qué puedo ayudarte?"
```
- NO solicitar más datos personales
- Mantener conversación general sin tracking

#### **Si usuario quiere leer política:**
```
NEXUS: "Puedes leer nuestra Política de Privacidad completa aquí: https://creatuactivo.com/politica-privacidad"
```
- Luego volver a preguntar: "¿Aceptas los términos?"

---

### **4. Reglas Críticas del Consentimiento**

**Líneas 227-232:**

1. **Una sola vez por usuario:** Si ya se solicitó consentimiento en sesión anterior, NO volver a pedirlo
2. **Antes de cualquier dato:** El consentimiento debe preceder la captura de nombre, email, WhatsApp
3. **Texto exacto:** NUNCA improvisar el texto del consentimiento
4. **Sin presión:** El "No, gracias" debe ser una opción válida y respetable

---

## 📜 Cumplimiento Legal: Ley 1581 de 2012 (Colombia)

### **Artículos Aplicados:**

| Artículo | Requisito | Cómo se cumple en NEXUS |
|----------|-----------|-------------------------|
| **Art. 9** | Autorización previa, expresa e informada | Texto solicita autorización ANTES de capturar datos. Opciones explícitas (Acepto/No acepto). Enlace a política completa (informada) |
| **Art. 12** | Deber de informar finalidad | "Para conversar y ofrecerte experiencia personalizada" + "recordar tu progreso y darte mejor servicio" |
| **Art. 6** | Principio de Finalidad | Finalidad declarada: personalización y memoria conversacional |
| **Art. 8 y 15** | Derechos del Titular | Enlace a política que explica derechos (conocer, actualizar, rectificar, suprimir) |

---

## 🔄 Integración con Captura de Datos

### **Secuencia Correcta:**

```
1. Usuario inicia conversación
2. NEXUS responde 1-2 preguntas (demuestra valor)
3. [CONSENTIMIENTO] NEXUS solicita autorización con texto exacto
4. Usuario acepta
5. [CAPTURA NOMBRE] NEXUS pide nombre en mensaje separado
6. Usuario da nombre
7. [CAPTURA OCUPACIÓN] NEXUS pide ocupación inmediatamente después
8. ... continúa flujo
```

**⚠️ CRÍTICO:** Consentimiento va ANTES de cualquier captura de datos

---

## 📊 Cambios Específicos

| Sección | Cambio | Líneas |
|---------|--------|--------|
| **CONSENTIMIENTO LEGAL** | Nueva sección completa | 188-234 |
| **CAPTURA DE DATOS** | Prerequisito agregado | 241-242 |
| **VALIDACIONES PRE-RESPUESTA** | 2 checks de consentimiento | 519-520 |

**Total:** 3 secciones modificadas + 1 nueva sección

---

## 🎯 Resultado Esperado

### **ANTES:**
```
Usuario: "¿Cómo funciona?"
NEXUS: "[Respuesta]"
NEXUS: "¿Cómo te llamas?" ← Sin consentimiento previo
```
**Problema:**
- ❌ Texto de consentimiento diferente cada vez
- ❌ A veces no pedía consentimiento
- ❌ No cumplía Ley 1581

### **DESPUÉS:**
```
Usuario: "¿Cómo funciona?"
NEXUS: "[Respuesta]"
NEXUS: "Para poder conversar y ofrecerte una experiencia personalizada, necesito tu autorización..." ← Texto exacto
Opciones: A) Acepto  B) No, gracias  C) Leer política
Usuario: "Acepto"
NEXUS: "Perfecto, gracias por tu confianza. Continuemos..."
NEXUS: "¿Cómo te llamas?" ← Después del consentimiento
```
**Beneficios:**
- ✅ Texto consistente siempre
- ✅ Cumple Ley 1581 de 2012
- ✅ Opciones claras (Acepto/No acepto)
- ✅ Usuario tiene control real

---

## 🧪 Testing

### **Test Case 1: Flujo Normal con Consentimiento**

1. Usuario: "¿Cómo funciona el negocio?"
2. NEXUS responde con NIVEL 1
3. Usuario elige opción
4. **NEXUS solicita consentimiento con texto exacto**
5. Usuario: "Acepto"
6. NEXUS: "Perfecto, gracias por tu confianza..."
7. NEXUS pide nombre (sin transiciones)
8. Usuario da nombre
9. NEXUS pide ocupación

**✅ Éxito si:**
- Texto de consentimiento es EXACTO (no improvisa)
- Opciones son A) Acepto, B) No gracias, C) Leer política
- Consentimiento aparece ANTES del nombre

---

### **Test Case 2: Usuario Rechaza Consentimiento**

1. Usuario: "¿Qué productos tienen?"
2. NEXUS responde
3. NEXUS solicita consentimiento
4. Usuario: "No, gracias"
5. **NEXUS debe responder:** "Entiendo tu decisión. Puedo seguir respondiendo preguntas generales..."
6. **NEXUS NO debe pedir más datos personales**

**✅ Éxito si:**
- NEXUS respeta el rechazo
- Conversación continúa sin pedir nombre, email, WhatsApp

---

### **Test Case 3: Usuario Quiere Leer Política**

1. NEXUS solicita consentimiento
2. Usuario elige "Leer política"
3. **NEXUS debe dar enlace:** https://creatuactivo.com/politica-privacidad
4. **NEXUS debe volver a preguntar:** "¿Aceptas los términos?"

**✅ Éxito si:**
- Enlace es correcto
- NEXUS vuelve a la pregunta de consentimiento

---

## 📋 Documento Fuente

Basado en: [/public/Chatbot_ Recopilación de Datos para Startup.md](../public/Chatbot_%20Recopilación%20de%20Datos%20para%20Startup.md)

**Sección aplicada:** 4.1 - El Saludo y Onboarding Legal (líneas 115-127)

**Adaptaciones:**
- ✅ Minimalizado para NEXUS (3 líneas vs párrafo completo)
- ✅ Agregadas opciones explícitas A, B, C
- ✅ Enlace específico a política de CreaTuActivo.com
- ✅ Integrado con flujo de captura existente

---

## 🔄 Próximos Pasos

1. **Aplicar en Supabase:**
   ```bash
   # Ejecutar en Supabase SQL Editor
   knowledge_base/nexus_system_prompt_v12.0_jobs_style.sql
   ```

2. **Esperar 5 minutos** (cache expira)

3. **Crear página de política:**
   - URL: https://creatuactivo.com/politica-privacidad
   - Contenido: Política completa según Ley 1581
   - **⚠️ CRÍTICO:** Sin esta página, el enlace fallará

4. **Testing intensivo:**
   - Verificar texto EXACTO del consentimiento
   - Probar todas las opciones (Acepto, No acepto, Leer política)
   - Verificar que consentimiento va ANTES de captura de nombre
   - Verificar que texto NO cambia entre conversaciones

5. **Monitorear aceptación:**
   - Tasa de aceptación del consentimiento
   - Tasa de rechazo
   - Clicks en "Leer política"

---

## ✅ Verificación

- [x] Sección CONSENTIMIENTO LEGAL agregada (líneas 188-234)
- [x] Texto exacto definido con prohibición de improvisar
- [x] Opciones Acepto/No acepto/Leer política
- [x] Manejo de respuestas para cada opción
- [x] Reglas críticas (una vez, antes de datos, texto exacto, sin presión)
- [x] Prerequisito agregado a CAPTURA DE DATOS
- [x] Checklist de validaciones actualizado (2 checks consentimiento)
- [x] Cumplimiento Ley 1581 documentado

**Estado:** ✅ **LISTO PARA APLICAR EN SUPABASE**

**Pendiente externo:**
- ⚠️ Crear página `/politica-privacidad` en el sitio
- ⚠️ Verificar URL funciona antes de aplicar en Supabase

**Archivo:** `knowledge_base/nexus_system_prompt_v12.0_jobs_style.sql`

---

**Documento de referencia:** FIX_CONSENTIMIENTO_LEGAL_NOV17.md
**Última actualización:** 17 Noviembre 2025 (Update 3)
