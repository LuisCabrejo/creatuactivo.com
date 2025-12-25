# Checklist de Tareas Pendientes - CreaTuActivo

**Última actualización:** 25 Diciembre 2025

---

## 1. FUNNEL RUSSELL BRUNSON

### Páginas del Funnel

| # | Página | Estado | Ruta | Notas |
|---|--------|--------|------|-------|
| 1 | Calculadora de Libertad | ✅ Hecho | `/calculadora` | Lead magnet principal |
| 2 | Reto 5 Días | ✅ Hecho | `/reto-5-dias` | Página de registro |
| 3 | Webinar (Registro) | ❌ Pendiente | `/webinar` | "Los 3 Secretos para Construir un Activo Digital" |
| 4 | Webinar (Sala) | ❌ Pendiente | `/webinar/sala` | Sala de transmisión |
| 5 | Página de Orden | ❌ Pendiente | `/constructor-pro` | Constructor Pro $297 |
| 6 | High Ticket Application | ❌ Pendiente | `/arquitecto` | Formulario de aplicación $2,000+ |

### Integraciones del Funnel

- [ ] Conectar formulario de Calculadora con Supabase (guardar leads)
- [ ] Conectar formulario de Reto 5 Días con Supabase
- [ ] Configurar Soap Opera Sequence (5 emails automáticos con Resend)
- [ ] Integrar WhatsApp Business API para el Reto
- [ ] Configurar secuencia Seinfeld (emails diarios post-reto)

---

## 2. MENÚ Y NAVEGACIÓN

### Páginas a Eliminar/Redirigir del Menú

| Página Actual | Acción | Redirigir a |
|---------------|--------|-------------|
| `/fundadores` | Mantener pero quitar del menú | - |
| `/fundadores-network` | Evaluar eliminar | `/calculadora` |
| `/fundadores-profesionales` | Evaluar eliminar | `/calculadora` |
| `/presentacion-empresarial` | Mantener en menú | - |
| `/sistema/framework-iaa` | Evaluar | - |
| `/sistema/tecnologia` | Evaluar | - |
| `/sistema/productos` | Evaluar | - |
| `/sistema/socio-corporativo` | Evaluar | - |
| `/ecosistema/*` | Evaluar | - |
| `/soluciones/*` | Evaluar (6 páginas) | - |

### Estructura de Menú Propuesta (Nueva)

```
MENÚ PRINCIPAL:
├── Cómo Funciona (scroll a sección)
├── Sobre Nosotros (nueva página o existente)
├── Testimonios (si aplica)
└── CTA: "Calcular mi Libertad" → /#calculadora
```

### Tareas de Navegación

- [ ] Definir qué páginas mantener en el menú
- [ ] Crear redirects para páginas eliminadas
- [ ] Simplificar estructura del menú (menos opciones)
- [ ] Actualizar enlaces internos que apunten a páginas eliminadas

---

## 3. NUEVAS PÁGINAS PROPUESTAS

Basadas en la estrategia Russell Brunson / StoryBrand:

| # | Página | Prioridad | Propósito |
|---|--------|-----------|-----------|
| 1 | La Trampa | Alta | Página de problema - "El Plan por Defecto" |
| 2 | Respuestas Honestas | Media | FAQ / Objeciones comunes |
| 3 | El Nuevo Modelo | Media | Explicación del modelo de negocio |
| 4 | Transformaciones | Baja | Casos de éxito / testimonios |
| 5 | Sobre Luis | Baja | Historia del fundador |

---

## 4. BRANDING Y DISEÑO

### Aplicar Quiet Luxury

- [x] Paleta de colores (dorado #D4AF37, fondos oscuros)
- [x] Logo nuevo (C dorada en cuadrado)
- [x] Favicon SVG
- [ ] Revisar páginas antiguas que no tienen el nuevo branding
- [ ] Actualizar imágenes/gráficos al nuevo estilo

### Páginas que Necesitan Actualización de Branding

- [ ] `/presentacion-empresarial` (tiene estilo viejo)
- [ ] `/presentacion-empresarial-inversionistas`
- [ ] `/sistema/*` (4 páginas)
- [ ] `/ecosistema/*` (páginas)
- [ ] `/soluciones/*` (6 páginas)
- [ ] `/paquetes`
- [ ] `/planes`
- [ ] `/reto-12-niveles`

---

## 5. TEXTOS Y COPY

### Términos a Reemplazar

| Término Antiguo | Término Nuevo |
|-----------------|---------------|
| "libertad financiera" | "libertad" / "independencia" |
| "network marketing" | "sistema de distribución" |
| "MLM" | No usar |
| "cohorte" | "grupo" / "comunidad" |
| "fundador" | Evaluar contexto |

### Tareas de Copy

- [x] Reemplazar "libertad financiera" (3 ocurrencias)
- [ ] Revisar todo el sitio por términos MLM
- [ ] Actualizar meta descriptions de páginas
- [ ] Revisar textos de NEXUS (system prompt)

---

## 6. TÉCNICO

### SEO

- [ ] Actualizar sitemap.xml con nuevas páginas
- [ ] Configurar redirects 301 para páginas eliminadas
- [ ] Revisar meta tags de nuevas páginas
- [ ] Verificar en Google Search Console

### Performance

- [ ] Revisar PageSpeed de nuevas páginas
- [ ] Optimizar imágenes si las hay
- [ ] Verificar Core Web Vitals

### Supabase / Backend

- [ ] Crear tabla para leads de Calculadora
- [ ] Crear tabla para registros de Reto 5 Días
- [ ] Configurar RPC para guardar datos de formularios
- [ ] Conectar con sistema de emails (Resend)

---

## 7. PRIORIDADES INMEDIATAS

### Esta Semana

1. [ ] Definir qué páginas del menú eliminar
2. [ ] Conectar formulario de Calculadora con Supabase
3. [ ] Conectar formulario de Reto 5 Días con Supabase
4. [ ] Crear página de Webinar (registro)

### Próxima Semana

1. [ ] Configurar emails automáticos (Soap Opera)
2. [ ] Crear página de orden (Constructor Pro)
3. [ ] Actualizar branding en páginas antiguas
4. [ ] Limpiar menú de navegación

---

## 8. DECISIONES PENDIENTES

Necesitan input del usuario:

1. **Menú:** ¿Qué secciones mantener? (El Sistema, Soluciones, Ecosistema)
2. **Fundadores:** ¿Eliminar las páginas de fundadores o mantenerlas?
3. **Precios:** ¿Mostrar precios en el sitio o solo en el funnel?
4. **WhatsApp:** ¿Usar WhatsApp Business API o solo enlace directo?
5. **Webinar:** ¿En vivo o automatizado (evergreen)?

---

## Flujo del Funnel Completo (Objetivo Final)

```
TRÁFICO (Ads, SEO, Redes)
         │
         ▼
┌─────────────────────────────────────┐
│     HOME → /#calculadora            │
│     Captura: Email                  │
└─────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│     /calculadora                    │
│     Quiz 6 preguntas → Resultados   │
│     Captura: Nombre, WhatsApp       │
└─────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│     SOAP OPERA SEQUENCE             │
│     5 emails automáticos            │
└─────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│     /reto-5-dias                    │
│     Reto por WhatsApp               │
└─────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│     /webinar                        │
│     "Los 3 Secretos"                │
└─────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│     /constructor-pro                │
│     Oferta $297                     │
│     + Order Bump + OTOs             │
└─────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│     /arquitecto                     │
│     High Ticket $2,000+             │
│     (Para clientes existentes)      │
└─────────────────────────────────────┘
```

---

*Documento generado para tracking de progreso. Actualizar conforme se completen tareas.*
