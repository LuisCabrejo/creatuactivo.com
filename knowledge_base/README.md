# Knowledge Base - Documentos NEXUS

Este directorio contiene los documentos de conocimiento que alimentan a NEXUS (el chatbot IA de CreaTuActivo.com).

## 📚 Estructura de archivos

Cada archivo `.txt` corresponde a una **category** en la tabla `nexus_documents` de Supabase:

| Archivo Local | Category en Supabase | Descripción |
|---------------|---------------------|-------------|
| `arsenal_inicial.txt` | `arsenal_inicial` | Preguntas fundamentales y WHY del negocio |
| `arsenal_manejo.txt` | `arsenal_manejo` | Manejo de objeciones y preguntas técnicas |
| `arsenal_cierre.txt` | `arsenal_cierre` | Preguntas avanzadas y cierre de ventas |
| `catalogo_productos.txt` | `catalogo_productos` | Catálogo completo de productos Gano Excel |

## 🔄 Cómo actualizar Supabase

### Opción 1: Manual (Recomendada para cambios menores)

1. Edita el archivo `.txt` correspondiente
2. Copia el contenido completo
3. Ve a Supabase Dashboard → Table Editor → `nexus_documents`
4. Encuentra el registro con la `category` correspondiente
5. Pega el contenido en el campo `content`
6. Guarda los cambios

### Opción 2: Script de verificación

Para verificar qué versión está aplicada en Supabase:

```bash
node scripts/verificar-arsenal-supabase.mjs
```

## 📝 Historial de versiones

Las versiones se manejan mediante:
- **Git commits**: Historial completo de cambios
- **Versión en el archivo**: Primera línea del `.txt` (ej: `v9.0`)

## ⚠️ Importante

- **NO crear archivos `.sql`** duplicados (genera confusión)
- **Un solo archivo** por arsenal (fuente única de verdad)
- **Nombres consistentes** con las categories de Supabase
- **Usar Git** para historial de cambios

## 🗂️ Otros archivos en este directorio

- `nexus-system-prompt-v*.md` - System prompts para NEXUS (diferentes versiones)
- `*.md` - Documentación de handoffs, fixes, y actualizaciones
- `archive/` - Archivos obsoletos archivados

---

**Última actualización**: 17 Nov 2025
**Mantenedor**: Luis Cabrejo
