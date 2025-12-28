# Checklist: Cierre de Venta Queswa con Enlaces Clicables

**Fecha:** 28 Diciembre 2025
**Versión System Prompt:** v16.2.0_cierre_clicable

---

## COMPLETADO

### System Prompt v16.2.0
- [x] Enlaces markdown clicables para URL y WhatsApp
- [x] CONSTRUCTOR_CONTEXT con variables dinámicas documentadas
- [x] Mensajes pre-llenados en WhatsApp (`?text=Hola...quiero%20iniciar`)
- [x] Enlace de formulario con ref del constructor (`/reto-5-dias/[CONSTRUCTOR_REF]`)
- [x] Fallback a Liliana Moreno si no hay constructor
- [x] Desplegado en Supabase

### NEXUSWidget (Frontend)
- [x] Soporta renderizado de links markdown (ya existía `<a>` renderer)
- [x] Links abren en nueva pestaña (`target="_blank"`)
- [x] Estilo dorado para links (`color: QUIET_LUXURY.gold`)

### Tracking.js
- [x] Captura `constructorRef` desde URL path (`/fundadores/[ref]`)
- [x] Captura `constructorRef` desde query param (`?ref=...`)
- [x] Persiste en `localStorage` para visitas posteriores
- [x] Expone en `window.FrameworkIAA.constructorRef`

---

## PENDIENTE (Backend)

### 1. Inyección de CONSTRUCTOR_CONTEXT en NEXUS API
**Archivo:** `src/app/api/nexus/route.ts`

**Tarea:** Cuando se detecte un `constructorId`:
1. Buscar nombre y WhatsApp del constructor en BD
2. Reemplazar placeholders en System Prompt:
   - `[CONSTRUCTOR_NOMBRE]` → nombre real
   - `[CONSTRUCTOR_WHATSAPP]` → número real (sin + ni espacios)
   - `[CONSTRUCTOR_REF]` → slug del constructor

**Tablas involucradas:**
- `constructors` (o donde se guarden los datos de constructores)
- Campos necesarios: `name`, `whatsapp`, `slug`

### 2. Tabla de Constructores
**Verificar si existe y tiene campos:**
```sql
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'constructors';
```

**Campos requeridos:**
| Campo | Tipo | Ejemplo |
|-------|------|---------|
| `id` | UUID | auto |
| `slug` | TEXT | "luiscabrejo-4871288" |
| `name` | TEXT | "Luis Cabrejo" |
| `whatsapp` | TEXT | "573102066593" |
| `email` | TEXT | opcional |

### 3. Actualizar useNEXUSChat.ts
**Archivo:** `src/components/nexus/useNEXUSChat.ts`

**Cambio:** Usar `window.FrameworkIAA.constructorRef` en lugar de solo extraer de URL path.

```typescript
// ACTUAL (línea ~175):
let constructorId: string | null = null;
if (typeof window !== 'undefined') {
  const pathname = window.location.pathname;
  const match = pathname.match(/\/fundadores\/([a-z0-9-]+)/);
  if (match) {
    constructorId = match[1];
  }
}

// MEJORADO:
let constructorId: string | null = null;
if (typeof window !== 'undefined') {
  // Usar FrameworkIAA que ya captura de URL Y localStorage
  constructorId = (window as any).FrameworkIAA?.constructorRef || null;
}
```

---

## PENDIENTE (WhatsApp Business + ManyChat)

### 4. Configurar WhatsApp Business API
- [ ] Activar SIM en WhatsApp Business
- [ ] Verificar número en Meta Business Suite
- [ ] Obtener token de acceso API

### 5. Integrar ManyChat
- [ ] Conectar cuenta de WhatsApp Business
- [ ] Crear flujo de bienvenida para prospectos que vienen de Queswa
- [ ] Configurar triggers por palabras clave ("quiero iniciar")
- [ ] Asignar a constructor correspondiente

### 6. Webhook para Notificaciones
- [ ] Cuando prospecto elige WhatsApp → notificar al constructor
- [ ] Opcional: Enviar email de backup si WhatsApp no disponible

---

## PRÓXIMOS PASOS RECOMENDADOS

1. **Inmediato:** Implementar inyección de CONSTRUCTOR_CONTEXT en API
2. **Corto plazo:** Configurar WhatsApp Business con SIM
3. **Mediano plazo:** Integrar ManyChat para automatización

---

## NOTAS TÉCNICAS

### Formato WhatsApp Link
```
https://wa.me/[NUMERO]?text=[MENSAJE_ENCODED]
```
- Número sin + ni espacios: `573102066593`
- Mensaje URL-encoded: `Hola%20Luis,%20quiero%20iniciar`

### Fallback Actual
Si no hay constructor → Liliana Moreno (+573102066593)
