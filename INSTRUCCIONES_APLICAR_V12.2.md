# 📝 INSTRUCCIONES: Aplicar NEXUS v12.2 en Supabase

**Fecha:** 17 Noviembre 2025
**Tiempo estimado:** 5 minutos
**Conocimiento técnico requerido:** Ninguno (copiar/pegar)

---

## 🎯 OBJETIVO

Actualizar el system prompt de NEXUS en Supabase para aplicar v12.2 con:
- ✅ Consentimiento legal minimalista (Ley 1581/2012)
- ✅ Anti-transiciones ("Mientras tanto..." prohibido)
- ✅ Timing 2da-3ra pregunta para nombre
- ✅ Lenguaje Jobs-Style
- ✅ URL correcta: https://creatuactivo.com/privacidad

---

## 📋 PASO A PASO

### **Paso 1: Abrir Supabase SQL Editor**

1. Ve a: https://supabase.com/dashboard
2. Haz login con tu cuenta
3. Selecciona el proyecto **CreaTuActivo** (o como lo hayas nombrado)
4. En el menú lateral izquierdo, click en **"SQL Editor"**
5. Click en botón **"New query"** (arriba a la derecha)

---

### **Paso 2: Copiar el Script SQL**

1. Abre el archivo: **`knowledge_base/APLICAR_V12.2_SUPABASE.sql`**
2. Selecciona TODO el contenido (Cmd+A en Mac, Ctrl+A en Windows)
3. Copia (Cmd+C en Mac, Ctrl+C en Windows)

---

### **Paso 3: Pegar y Ejecutar**

1. Pega el script completo en el editor SQL de Supabase (Cmd+V o Ctrl+V)
2. Click en botón **"Run"** (abajo a la derecha) o presiona **Cmd+Enter** (Mac) / **Ctrl+Enter** (Windows)
3. Espera 2-5 segundos mientras ejecuta

---

### **Paso 4: Verificar Resultado**

Deberías ver 2 resultados:

**Resultado 1: UPDATE**
```
UPDATE 1
```
Esto confirma que se actualizó 1 registro (el system prompt).

**Resultado 2: SELECT (verificación)**
```
name         | version | updated_at              | prompt_length
-------------|---------|-------------------------|---------------
nexus_main   | v12.2   | 2025-11-17 21:XX:XX     | ~22000
```

**✅ Si ves esto, ¡la actualización fue exitosa!**

---

### **Paso 5: Esperar Cache Expiry (CRÍTICO)**

**⏰ ESPERA 5 MINUTOS** antes de probar NEXUS.

El system prompt se cachea en memoria por 5 minutos. Opciones:

**Opción A (Recomendada):** Esperar 5 minutos
- Toma un café ☕
- Revisa otro tema
- Vuelve en 5 minutos

**Opción B (Reiniciar servidor local - solo si tienes dev corriendo):**
```bash
# Detener servidor (Ctrl+C)
# Iniciar de nuevo
npm run dev
```

**Opción C (Forzar refresh en producción - NO RECOMENDADO):**
- Redeploy en Vercel (pero toma más tiempo que esperar 5 min)

---

### **Paso 6: Probar NEXUS**

Después de 5 minutos:

1. Ve a: https://creatuactivo.com
2. Abre el widget NEXUS (botón flotante abajo derecha)
3. Inicia conversación: "¿Cómo funciona el negocio?"
4. **Verifica:**
   - ✅ Respuesta con opciones A, B, C (sin "Mientras tanto...")
   - ✅ Si eliges una opción y haces seguimiento, NO agrega transiciones
   - ✅ Después de 2da-3ra pregunta, pide consentimiento con texto EXACTO:
     ```
     Para poder conversar y ofrecerte una experiencia personalizada,
     necesito tu autorización para tratar los datos que compartas conmigo,
     de acuerdo con nuestra Política de Privacidad
     (https://creatuactivo.com/privacidad).
     ```
   - ✅ Muestra opciones: A) ✅ Acepto, B) ❌ No gracias, C) 📄 Leer política

---

## ⚠️ TROUBLESHOOTING

### **Problema 1: "Error: permission denied"**

**Causa:** No tienes permisos para ejecutar UPDATE en la tabla.

**Solución:**
- Verifica que estás usando la cuenta de administrador del proyecto
- Si el problema persiste, usa service_role key en un script Node.js

---

### **Problema 2: "No rows updated"**

**Causa:** No existe un registro con `name = 'nexus_main'`.

**Solución:**
```sql
-- Verificar qué registros existen
SELECT name, version FROM system_prompts;

-- Si el nombre es diferente, ajusta el WHERE
UPDATE system_prompts
SET prompt = $PROMPT$...
WHERE name = '[nombre_real]';  -- ← Cambia esto
```

---

### **Problema 3: NEXUS sigue usando texto viejo después de 5 minutos**

**Causa:** Cache persistente o servidor no re-leyó la base de datos.

**Solución:**
1. Verifica en Supabase que la columna `updated_at` cambió:
   ```sql
   SELECT name, version, updated_at FROM system_prompts WHERE name = 'nexus_main';
   ```
2. Si `updated_at` es reciente pero NEXUS sigue igual:
   - Hard refresh en navegador: Cmd+Shift+R (Mac) o Ctrl+F5 (Windows)
   - Limpia cookies/localStorage de creatuactivo.com
   - Prueba en ventana incógnito

3. Si persiste, verifica que el API está usando Supabase y no hardcoded fallback:
   - Abre: `src/app/api/nexus/route.ts`
   - Línea ~140: Debería decir `const systemPrompt = promptFromDB || FALLBACK_PROMPT;`
   - Si NO hay `promptFromDB`, el código no está leyendo Supabase

---

### **Problema 4: "Syntax error near $PROMPT$"**

**Causa:** Copiaste el script incorrectamente.

**Solución:**
- Asegúrate de copiar **TODO** el contenido del archivo SQL
- Incluye las líneas con `$PROMPT$` al inicio y final
- PostgreSQL usa `$PROMPT$...$PROMPT$` para strings largos (es sintaxis válida)

---

## ✅ CHECKLIST COMPLETO

- [ ] Abrí Supabase Dashboard
- [ ] Navegué a SQL Editor
- [ ] Creé nueva query
- [ ] Copié TODO el contenido de APLICAR_V12.2_SUPABASE.sql
- [ ] Pegué en editor SQL
- [ ] Click "Run" o Cmd+Enter
- [ ] Vi mensaje "UPDATE 1"
- [ ] Vi resultado SELECT con version = 'v12.2'
- [ ] **ESPERÉ 5 MINUTOS** ⏰
- [ ] Probé NEXUS en https://creatuactivo.com
- [ ] Verifiqué texto de consentimiento exacto con URL `/privacidad`
- [ ] Verifiqué opciones A) Acepto, B) No gracias, C) Leer política
- [ ] Verifiqué NO hay transiciones ("Mientras tanto...")

---

## 🎯 RESULTADO ESPERADO

### **ANTES (v12.1 o anterior):**
```
Usuario: "¿Cómo funciona?"
NEXUS: "[Respuesta]"
NEXUS: "Por cierto, ¿cómo te llamas?
       Mientras tanto, ¿qué te interesa saber?  ← ❌ MAL
       A) B) C)"
```

### **DESPUÉS (v12.2):**
```
Usuario: "¿Cómo funciona?"
NEXUS: "[Respuesta con opciones A, B, C]"

Usuario: [Elige B]
NEXUS: "[Contenido NIVEL 2]"

Usuario: [Hace seguimiento]
NEXUS: "[Responde]"

NEXUS: "Para poder conversar y ofrecerte una experiencia personalizada,
       necesito tu autorización para tratar los datos que compartas conmigo,
       de acuerdo con nuestra Política de Privacidad
       (https://creatuactivo.com/privacidad).

       Esto nos permite recordar tu progreso y darte un mejor servicio.

       ¿Estás de acuerdo?

       A) ✅ Acepto
       B) ❌ No, gracias
       C) 📄 Leer política completa"

Usuario: "Acepto"
NEXUS: "Perfecto, gracias por tu confianza. Continuemos..."
NEXUS: "¿Cómo te llamas? Me gusta personalizar la conversación 😊"  ← ✅ SOLO nombre, sin opciones
```

---

## 📞 SI NECESITAS AYUDA

**Si algo falla:**
1. Toma screenshot del error
2. Verifica que seguiste todos los pasos
3. Consulta sección Troubleshooting
4. Si persiste, comparte el screenshot del error con otro agente Claude Code

---

**Documento creado:** 17 Noviembre 2025
**Archivo:** INSTRUCCIONES_APLICAR_V12.2.md
**Relacionado:** knowledge_base/APLICAR_V12.2_SUPABASE.sql
