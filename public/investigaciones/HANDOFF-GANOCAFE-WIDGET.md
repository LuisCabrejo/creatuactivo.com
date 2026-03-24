# HANDOFF: Widget Queswa en ganocafe.online
**Fecha:** 23 Mar 2026
**Para:** Agente Claude Code (widget ganocafe)
**De:** Sesión arquitectura multi-dominio Queswa (Mar 2026)

---

## Estado actual del ecosistema

ganocafe.online es el cuarto dominio del ecosistema CreaTuActivo. Los cuatro dominios comparten **una sola base de datos Supabase** y **una sola API** (`creatuactivo.com/api/nexus`), separados por `tenant_id`.

| Dominio | Tenant | System Prompt | Estado |
|---------|--------|---------------|--------|
| creatuactivo.com | `creatuactivo_marketing` | `nexus_main` v19.6 | Activo |
| luiscabrejo.com | `marca_personal` | `luiscabrejo_main` v1.0 | Activo |
| queswa.app | `queswa_dashboard` | hardcoded en `dashboard-ai/route.ts` | Activo |
| ganocafe.online | `ecommerce` | `ganocafe_main` v1.0 | Piloto activo |

---

## Lo que ya está hecho (no repetir)

### Supabase
- ✅ Row `ganocafe_main` en tabla `system_prompts` — system prompt del concierge de ventas GanoCafe
- ✅ 13 fragmentos en `nexus_documents` con `tenant_id = 'ecommerce'` y embeddings Voyage AI
- ✅ Categoría: `arsenal_ganocafe` — 12 respuestas sobre productos, beneficios, compra y objeciones

### API creatuactivo.com
- ✅ **CORS habilitado** en `src/app/api/nexus/route.ts` (commit `5578d1d`):
  - Handler `OPTIONS` para preflight (status 204, `Access-Control-Max-Age: 86400`)
  - `getCorsHeaders(origin)` retorna headers dinámicos según origen
  - Orígenes permitidos: `ganocafe.online`, `www.ganocafe.online`, `creatuactivo.com`, `luiscabrejo.com`, `queswa.app`
  - Header `x-tenant-id` incluido en `Access-Control-Allow-Headers`

### Widget
- ✅ Embebido en `ganocafe.online/cafe-3en1/index.html` (cPanel, no WordPress)
- ✅ El widget envía `x-tenant-id: ecommerce` en cada request al API
- ✅ Piloto activo para campaña Google Ads Colombia

---

## Cómo funciona el routing de tenant

El API lee el tenant del header `x-tenant-id`:

```typescript
// src/app/api/nexus/route.ts (línea ~2613)
const tenantId = req.headers.get('x-tenant-id') ?? 'creatuactivo_marketing';
```

El widget debe enviar este header en cada POST:

```javascript
fetch('https://creatuactivo.com/api/nexus', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-tenant-id': 'ecommerce'   // ← CRÍTICO
  },
  body: JSON.stringify({ messages, fingerprint, ... })
})
```

Sin este header, el API responde con el system prompt de `creatuactivo_marketing` (funnel de Fundadores) — completamente incorrecto para un e-commerce.

---

## Conocimiento base disponible (arsenal_ganocafe)

12 respuestas organizadas en 5 bloques:

| Bloque | Respuestas | Cobertura |
|--------|------------|-----------|
| PROD | 4 respuestas | Qué es GanoCafe, Ganoderma, catálogo, consumo |
| BENE | 2 respuestas | Beneficios científicos, efectos secundarios |
| COMPRA | 3 respuestas | Cómo comprar, envíos, devoluciones |
| OBJ_GC | 2 respuestas | "¿Funciona?", "¿Me van a ofrecer el negocio?" |
| NEGOCIO | 1 respuesta | Redirección a creatuactivo.com si pregunta por el negocio |

**Archivo fuente:** `knowledge_base/arsenal_ganocafe.txt`
**Script de deploy:** `scripts/deploy-arsenal-ganocafe.mjs`

---

## ⚠️ Pendiente crítico: Actualización de precios

Los precios en `ganocafe.online` NO coinciden con los del arsenal actual. Antes de escalar el widget a más páginas:

1. Obtener precios actuales de ganocafe.online (Luis Cabrejo los confirmará)
2. Actualizar `knowledge_base/arsenal_ganocafe.txt` en el bloque `COMPRA_01`
3. Ejecutar: `node scripts/deploy-arsenal-ganocafe.mjs`
4. Borrar fragmentos obsoletos en Supabase con categoría `arsenal_ganocafe`
5. Re-fragmentar: `node scripts/fragmentar-arsenales-voyage.mjs`

**IMPORTANTE — protocolo de actualización de fragmentos:**
Si saltas el paso 4, el script detectará fragmentos existentes y NO los actualizará.

---

## Próximos pasos sugeridos

### Fase 1 — Validar piloto (landing /cafe-3en1/)
- [ ] Confirmar que `x-tenant-id: ecommerce` llega al API (revisar Vercel logs)
- [ ] Probar conversación completa: pregunta producto → respuesta GanoCafe → no mezcla con Fundadores
- [ ] Actualizar precios en el arsenal

### Fase 2 — Rollout WordPress (todo el sitio)
El sitio principal de ganocafe.online corre en WordPress con tema Flatsome. Para agregar Queswa en todo el sitio hay dos opciones:

**Opción A — functions.php (recomendada):**
```php
// En functions.php del tema Flatsome
function agregar_queswa_widget() {
    echo '<script src="https://ganocafe.online/queswa-widget.js" defer></script>';
}
add_action('wp_footer', 'agregar_queswa_widget');
```

**Opción B — Plugin HTML en footer:**
Usar un plugin como "Header Footer Code Manager" para insertar el script antes de `</body>`.

El archivo `queswa-widget.js` debe ser el mismo bundle usado en la landing, alojado en el servidor de ganocafe.online o en un CDN.

### Fase 3 — Multi-país
ganocafe.online tiene tráfico de múltiples países. Cuando el arsenal se expanda para responder precios y logística por país, el `x-tenant-id` puede evolucionar a `ecommerce_co`, `ecommerce_mx`, etc., con rows separados en `system_prompts`. La arquitectura ya lo soporta.

---

## Archivos clave en el repo creatuactivo (marketing)

```
knowledge_base/arsenal_ganocafe.txt          ← Editar aquí el contenido
scripts/deploy-arsenal-ganocafe.mjs          ← Deploy a Supabase
scripts/fragmentar-arsenales-voyage.mjs      ← Regenerar embeddings
src/app/api/nexus/route.ts                   ← API principal (CORS aquí)
```

## Repositorio

- **GitHub:** https://github.com/LuisCabrejo/creatuactivo.com
- **Vercel:** creatuactivo.com (auto-deploy desde main)
- **Supabase:** compartido por todos los dominios del ecosistema

---

## Contacto

**Luis Cabrejo Parra** — Director Ejecutivo CreaTuActivo
GitHub: LuisCabrejo
Email de GSC: luiscabrejo7@gmail.com
