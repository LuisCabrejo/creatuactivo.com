# 🚨 Fix Crítico: Captura de Datos sin Sobrecarga Cognitiva

**Fecha:** 17 Noviembre 2025
**Problema:** Regresión en comportamiento de captura de datos de NEXUS
**Archivo modificado:** `nexus_system_prompt_v12.0_jobs_style.sql`

---

## 🎯 Problema Identificado

NEXUS estaba solicitando datos del usuario (nombre, ocupación, WhatsApp) en el mismo mensaje donde entregaba contenido complejo o múltiples opciones.

**Ejemplo del problema:**
```
Usuario: "¿Cómo funciona el negocio?"
NEXUS: "[Respuesta completa de NIVEL 1 con 3 opciones]

Por cierto, ¿cómo te llamas?"
```

**Consecuencia:** El cerebro humano pierde el contexto cuando hay múltiples preguntas. El usuario responderá las preguntas finales y olvidará dar su nombre.

---

## ✅ Solución Aplicada

### 1. **REGLA DE ORO agregada a las 3 capturas de datos:**

#### Línea 210 - NOMBRE:
```sql
- **🚨 REGLA DE ORO: Cuando pidas el nombre, hazlo SOLO. No agregues otras preguntas antes ni después. El cerebro humano pierde el contexto si hay múltiples preguntas**
```

#### Línea 230 - OCUPACIÓN:
```sql
- **🚨 REGLA DE ORO: Cuando pidas ocupación, hazlo SOLO. Una pregunta a la vez**
```

#### Línea 256 - WHATSAPP:
```sql
- **🚨 REGLA DE ORO: Cuando pidas WhatsApp, hazlo SOLO. No agregues otras preguntas antes ni después. El cerebro humano pierde el contexto si hay múltiples preguntas**
```

---

### 2. **Timing corregido (Línea 209):**

**ANTES:**
```
- Pídelo en la 1ra-2da interacción SIEMPRE
```

**DESPUÉS:**
```
- Pídelo DESPUÉS de la 2da o 3ra pregunta del usuario (no inmediatamente en la 1ra)
```

**Razón:** Permite establecer rapport antes de solicitar datos personales.

---

### 3. **Ejemplos corregidos:**

#### Ejemplo 1 - INTEGRACIÓN NATURAL (Líneas 270-281):

**ANTES (incorrecto):**
```
Usuario: "¿Cómo funciona el negocio?"
NEXUS: "[Respuesta de NIVEL 1 del flujo]

Por cierto, ¿cómo te llamas?"
```

**DESPUÉS (correcto):**
```
[Primer mensaje - Usuario pregunta sobre el negocio]
Usuario: "¿Cómo funciona el negocio?"
NEXUS: "[Respuesta de NIVEL 1 del flujo con opciones]"

[Segundo mensaje - SOLO pedir nombre, SIN otras preguntas]
Usuario: [Elige una opción o hace pregunta de seguimiento]
NEXUS: "¿Cómo te llamas? Me gusta personalizar la conversación 😊"
```

**⚠️ NOTA CRÍTICA:** El nombre se pide en una interacción SEPARADA, no junto con contenido complejo.

---

#### Ejemplo 2 - ESCALACIÓN CON WHATSAPP (Líneas 289-300):

**ANTES (incorrecto):**
```
Usuario: "¿Cuánto cuesta empezar?"
NEXUS: "[Respuesta sobre paquetes]

¿Cuál es tu WhatsApp, Carlos? Te conecto con Liliana"
```

**DESPUÉS (correcto):**
```
[Primer mensaje - Responder pregunta sobre paquetes]
Usuario: "¿Cuánto cuesta empezar?"
NEXUS: "[Respuesta completa sobre paquetes y opciones]"

[Segundo mensaje - SOLO pedir WhatsApp, SIN otros contenidos]
Usuario: [Muestra interés o hace pregunta de seguimiento]
NEXUS: "¿Cuál es tu WhatsApp, Carlos? Te conecto con Liliana para un plan personalizado 📲"
```

**⚠️ NOTA CRÍTICA:** El WhatsApp se pide en una interacción SEPARADA, después de dar la información solicitada.

---

## 📊 Resumen de Cambios

| Sección | Cambio | Líneas |
|---------|--------|--------|
| **NOMBRE - REGLA** | Agregada REGLA DE ORO | 210 |
| **NOMBRE - TIMING** | Corregido: 2da-3ra pregunta | 209 |
| **OCUPACIÓN - REGLA** | Agregada REGLA DE ORO | 230 |
| **WHATSAPP - REGLA** | Agregada REGLA DE ORO | 256 |
| **EJEMPLO 1** | Corregido + NOTA CRÍTICA | 270-281 |
| **EJEMPLO 2** | Corregido + NOTA CRÍTICA | 289-300 |

**Total de ediciones:** 6 secciones modificadas

---

## 🧠 Principio de Psicología Cognitiva Aplicado

**"Una pregunta a la vez"** - Cuando solicitas datos personales:

1. ✅ **Hazlo en mensaje separado** - No mezcles con contenido complejo
2. ✅ **Colócalo al final** - Después de entregar valor
3. ✅ **Sin distracciones** - No agregues más preguntas antes o después
4. ✅ **Timing correcto** - Después de 2-3 interacciones (rapport establecido)

**Resultado esperado:** Mayor tasa de conversión en captura de datos.

---

## 🔄 Próximos Pasos

1. **Aplicar en Supabase:**
   ```bash
   # Ejecutar en Supabase SQL Editor:
   knowledge_base/nexus_system_prompt_v12.0_jobs_style.sql
   ```

2. **Verificar en producción:**
   - Probar flujo de captura de nombre
   - Verificar que no se mezcle con otras preguntas
   - Confirmar timing (después de 2da-3ra interacción)

3. **Monitorear conversiones:**
   - Revisar `prospect_data` en Supabase
   - Comparar tasa de captura antes/después del fix

---

## ✅ Verificación

- [x] REGLA DE ORO agregada a NOMBRE
- [x] REGLA DE ORO agregada a OCUPACIÓN
- [x] REGLA DE ORO agregada a WHATSAPP
- [x] Timing corregido (2da-3ra pregunta)
- [x] Ejemplo INTEGRACIÓN NATURAL corregido
- [x] Ejemplo ESCALACIÓN CON WHATSAPP corregido
- [x] Notas críticas agregadas a ejemplos

**Estado:** ✅ **FIX COMPLETADO**
**Listo para:** Aplicar en Supabase y probar en producción

---

**Documento de referencia:** knowledge_base/FIX_CAPTURA_DATOS_NOV17.md
**Última actualización:** 17 Noviembre 2025
