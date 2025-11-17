# 📋 Mapeo Archivos Knowledge Base → Categorías Supabase

**Fecha:** 17 Noviembre 2025
**Propósito:** Clarificar relación entre nombres de archivos físicos y categorías en base de datos

---

## 🔄 Tabla de Mapeo Completa

| # | Archivo Físico (.txt) | Categoría Supabase | SQL Script | Respuestas |
|---|---|---|---|---|
| 1 | `arsenal_conversacional_inicial_v9.txt` | `arsenal_inicial` | `EJECUTAR_1_arsenal_inicial.sql` | FREQ + CRED (15) |
| 2 | `arsenal_conversacional_tecnico.txt` | `arsenal_manejo` | `EJECUTAR_2_arsenal_manejo.sql` | OBJ + TECH + COMP (35) |
| 3 | `arsenal_conversacional_complementario.txt` | `arsenal_cierre` | `EJECUTAR_3_arsenal_cierre.sql` | SIST + VAL + ESC (26) |
| 4 | `catalogo_productos_gano_excel.txt` | `catalogo_productos` | `EJECUTAR_5_catalogo_productos_v2_cientifico.sql` | 22 productos |
| 5 | `arsenal_productos_beneficios.txt` | `productos_ciencia` | `EJECUTAR_7_productos_ciencia.sql` | PROD + TECH (6) |

---

## 🎯 ¿Por Qué Nombres Diferentes?

### Nombres de Archivo (largo, descriptivo)
```
arsenal_conversacional_inicial_v9.txt
arsenal_conversacional_tecnico.txt
arsenal_conversacional_complementario.txt
```
✅ **Propósito:** Claridad en filesystem
✅ **Para:** Humanos editando archivos
✅ **Ventaja:** Autodescriptivos, fácil identificar contenido
✅ **Versiones:** Se mantienen con sufijo (ej: _v9) para tracking

### Categorías en DB (corto, código-friendly)
```
arsenal_inicial
arsenal_manejo
arsenal_cierre
```
✅ **Propósito:** Eficiencia en código
✅ **Para:** route.ts clasificación
✅ **Ventaja:** Más cortos para usar en código TypeScript

---

## 📊 Uso en Sistema

### En route.ts (clasificarDocumentoHibrido)
```typescript
// La función retorna la CATEGORÍA (nombre corto)
return 'arsenal_inicial';    // NO retorna nombre de archivo
return 'arsenal_manejo';     // NO retorna 'arsenal_conversacional_tecnico'
return 'arsenal_cierre';
return 'catalogo_productos';
return 'productos_ciencia';
```

### En Supabase (nexus_documents table)
```sql
SELECT * FROM nexus_documents WHERE category = 'arsenal_inicial';
-- La columna 'category' usa nombres cortos
```

### En System Prompt v12.0
```
1. **CLASIFICACIÓN AUTOMÁTICA**: Las consultas se clasifican entre:
   - `catalogo_productos` → Para precios de productos individuales
   - `productos_ciencia` → Para beneficios científicos del Ganoderma
   - `arsenal_inicial` → Para paquetes, primeras interacciones, flujo 3 niveles
   - `arsenal_manejo` → Para objeciones y soporte
   - `arsenal_cierre` → Para escalación y preguntas avanzadas
```

---

## 🔍 Equivalencias Rápidas

**¿Buscas "arsenal_conversacional_tecnico.txt"?**
→ En código/DB se llama: `arsenal_manejo`

**¿Buscas "arsenal_conversacional_complementario.txt"?**
→ En código/DB se llama: `arsenal_cierre`

**¿Buscas "arsenal_productos_beneficios.txt"?**
→ En código/DB se llama: `productos_ciencia`

---

## ✅ Los 5 Documentos Están Activos

**Confirmación:** Todos los archivos físicos están mapeados a categorías en Supabase.

- ✅ arsenal_conversacional_inicial.txt → `arsenal_inicial`
- ✅ arsenal_conversacional_tecnico.txt → `arsenal_manejo`
- ✅ arsenal_conversacional_complementario.txt → `arsenal_cierre`
- ✅ catalogo_productos_gano_excel.txt → `catalogo_productos`
- ✅ arsenal_productos_beneficios.txt → `productos_ciencia`

**Total activos:** 5 documentos (98 respuestas + 22 productos)

---

## 🗂️ Archivos Archivados (NO en clasificación)

Estos archivos fueron movidos a `/archive/` y NO tienen categoría activa:

- ❌ `framework_iaa_metodologia.txt` (contenido integrado en arsenal_cierre SIST_03)
- ❌ `informacion_escalacion_liliana.txt` (contenido integrado en arsenal_cierre ESC + system prompt)

Ver: [archive/README.md](archive/README.md) para detalles.

---

**Documento de referencia:** knowledge_base/MAPEO_ARCHIVOS_CATEGORIAS.md
**Última actualización:** 17 Noviembre 2025
