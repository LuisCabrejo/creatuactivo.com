# Knowledge Base - CreaTuActivo.com

Directorio con los arsenales conversacionales y documentos de NEXUS sincronizados desde Supabase.

**Última actualización:** 3 de diciembre 2025
**Versión:** MVP v3.0 (Consolidado)

---

## 📚 Arsenales Conversacionales (3 arsenales optimizados)

### arsenal_inicial.txt (21K)
- **Título**: Arsenal Inicial - Jobs-Style v9.0
- **Propósito**: Base de conocimiento inicial para NEXUS
- **Contenido**: Preguntas WHY + preguntas fundamentales (34 respuestas)
- **Uso**: Primeras interacciones, establecer credibilidad
- **Estado**: ✅ Sincronizado con Supabase

### arsenal_avanzado.txt (52K) - 🆕 CONSOLIDADO
- **Título**: Arsenal Avanzado - Consolidado v3.0
- **Propósito**: Objeciones + Sistema + Valor + Escalación
- **Contenido**: 63 respuestas consolidadas
  - 🔧 Objeciones Críticas (11)
  - ⚙️ Técnicas y Operativas (16)
  - 🌟 Complementarias (8)
  - 🏗️ Sistema/Construcción (12)
  - 💰 Modelo de Valor (11)
  - 🚀 Escalación y Cierre (5)
- **Uso**: Todo lo avanzado (objeciones, sistema, valor, escalación)
- **Estado**: ✅ Sincronizado con Supabase
- **Nota**: Consolidado de arsenal_manejo + arsenal_cierre (3 dic 2025)

### catalogo_productos.txt (20K) - 🔄 ACTUALIZADO v3.0
- **Título**: Catálogo Productos Gano Excel 2025 v3.0
- **Propósito**: Catálogo completo + Ciencia + Preguntas técnicas
- **Contenido**:
  - 22 productos con precios verificados
  - Respaldo científico completo (PubMed, Nature, Frontiers)
  - 12 funciones documentadas de Ganoderma
  - 4 preguntas técnicas (TECH_01 a TECH_04)
  - Categorización por perfil de usuario
- **Uso**: Todo sobre productos (precios, beneficios, ciencia, combinaciones)
- **Estado**: ✅ Sincronizado con Supabase
- **Nota**: Incluye contenido de productos_ciencia (3 dic 2025)

---

## 🤖 System Prompt

### system-prompt-nexus-v13.6_construccion_sistema_analogia_edificio.md (22K)
- **Versión actual**: v13.6
- **Última actualización**: 2/12/2025
- System prompt completo de NEXUS con:
  - Identidad y personalidad
  - Flujo conversacional (14 mensajes)
  - Reglas de captura de datos
  - Formato y estilo de respuestas

---

## 🛠️ Scripts Útiles

### Descargar desde Supabase:
```bash
node scripts/descargar-arsenales-supabase.mjs
node scripts/descargar-system-prompt.mjs
```

### Verificar arsenales:
```bash
node scripts/verificar-arsenal-supabase.mjs
```

---

## 📝 Documentación

### RESUMEN_ARSENALES.md
Resumen ejecutivo de todos los arsenales y su propósito

### CONSOLIDACION_ARSENALES_DIC_03_2025.md 🆕
Documentación completa de la consolidación realizada el 3 de diciembre 2025:
- Resumen ejecutivo
- Cambios realizados
- Archivos eliminados
- Código actualizado
- Métricas de optimización

---

## 📊 Estructura Actual (MVP v3.0)

**Total de arsenales:** 3 documentos optimizados
**Total de respuestas:** 97 respuestas únicas + catálogo completo
**Tamaño total:** 93K (optimizado, sin redundancias)

**Distribución:**
1. arsenal_inicial: 34 respuestas (primeras interacciones)
2. arsenal_avanzado: 63 respuestas (objeciones + sistema + valor + escalación)
3. catalogo_productos: Catálogo + ciencia + preguntas técnicas

**Reducción vs versión anterior:**
- Documentos: 8 → 3 (62.5% reducción)
- Redundancia: Eliminada completamente
- Mantenimiento: Simplificado

---

## ⚠️ Importante

- **NO editar archivos locales** - Son copias sincronizadas desde Supabase
- **Para actualizar contenido**: Modificar directamente en Supabase → tabla `nexus_documents`
- **Para descargar última versión**: Ejecutar `node scripts/descargar-arsenales-supabase.mjs`
- Los arsenales son la memoria y conocimiento de NEXUS
- **Archivos locales = Supabase**: Solo existen localmente los archivos que están en Supabase
