# HANDOFF: Dashboard CreaTuActivo → Queswa.com

**Fecha**: 30 Diciembre 2025
**Para**: Claude Code (Agente Dashboard)
**De**: Claude Code (Agente Marketing)
**Proyecto**: Migración y mejoras del Dashboard de Socios

---

## CAMBIO CRÍTICO: REBRANDING DE DOMINIO

### Migración de Dominio
```
ANTES: app.creatuactivo.com
AHORA: queswa.com
```

**Queswa** pasa de ser solo el nombre del chatbot IA a ser la **marca tecnológica principal** del ecosistema.

### Implicaciones del Cambio
- Actualizar todas las referencias de dominio en el código
- Actualizar variables de entorno (`NEXT_PUBLIC_SITE_URL`, etc.)
- Verificar redirects de app.creatuactivo.com → queswa.com
- Actualizar Service Worker y PWA manifest
- Actualizar emails transaccionales y notificaciones

---

## 1. CONTEXTO DEL PROYECTO

### Ecosistema CreaTuActivo
Dos proyectos separados que comparten Supabase:

| Proyecto | Dominio | Propósito |
|----------|---------|-----------|
| Marketing | creatuactivo.com | Funnels, landing pages, captación |
| Dashboard | **queswa.com** (antes app.creatuactivo.com) | Panel para socios de negocio |

### El Fundador: Luis Cabrejo Parra
- **Técnico industrial** (electricidad/electrónica) - NO ejecutivo
- 12 años automotriz + 12 años negocio de lavadoras
- **Quebró a los 40 años**
- Diamante de Gano Excel en 2.5 años de forma **ANALÓGICA** (tocando puertas)
- Creó la tecnología para que otros no tengan que hacerlo "cuesta arriba"

### Valuación Tecnológica
- **Total**: $250,000 USD
- Incluye: CreaTuActivo.com + Dashboard (Queswa.com) + IA Queswa

---

## 2. INVESTIGACIÓN COMPLETADA (Russell Brunson)

### Archivo de Referencia Principal
```
/Users/luiscabrejo/Cta/marketing/public/.md/Investigación Estratégica CreaTuActivo_ Russell Brunson.md
```

### Conceptos Clave para Implementar en Dashboard

#### A. Los 3 Secretos (Base para Academia)
1. **Secreto del Vehículo** - Por qué Arquitectura de Activos funciona
2. **Secreto de las Creencias Internas** - "Yo SÍ puedo" (Queswa como prueba)
3. **Secreto de las Creencias Externas** - Validación de Gano Excel

#### B. Stack Slide (Valor que reciben los socios)
| Componente | Valor Percibido |
|------------|-----------------|
| Dashboard Queswa (métricas, pipeline) | $2,000/año |
| IA Queswa (chatbot 24/7) | $5,000/año |
| Academia de Formación | $997 |
| Mentoría en comunidad | Incalculable |
| **Total Stack** | >$8,000/año |

#### C. Reingeniería Léxica (Aplicar en toda la UI)

| NO usar | SÍ usar |
|---------|---------|
| Downline | Red de Valor / Mi Equipo |
| Reclutar | Invitar / Asociar |
| MLM / Multinivel | Plataforma de Distribución |
| Ingreso pasivo | Ingreso basado en activos |
| Distribuidor | Arquitecto de Activos |
| Upline / Patrocinador | Mentor de Negocio |
| Libertad financiera | Soberanía financiera |

---

## 3. ESTRATEGIA TRI-MODAL

El Dashboard debe soportar **3 modos de ejecución**:

### Modo 1: ANÁLOGO
- Para quienes prefieren contacto humano directo
- Dashboard provee: listas, seguimiento, materiales PDF
- El socio hace presentaciones en persona
- **UI**: Enfoque en exportación, impresión, QR codes

### Modo 2: HÍBRIDO (Recomendado)
- Combina contacto personal + automatización
- Socio hace contacto inicial → Queswa hace seguimiento
- **UI**: Balance entre CRM y métricas de IA

### Modo 3: 100% DIGITAL
- Automatización total con Queswa al frente
- Socio solo atiende prospectos pre-calificados
- **UI**: Dashboards de métricas, alertas, mínima intervención manual
- Ideal para: latinos en el extranjero, personas sin tiempo

---

## 4. FUNCIONALIDADES ACTUALES DEL DASHBOARD

### Ya Implementado
1. **Pipeline Limpio** - Visualización de prospectos por etapa
2. **Métricas en Tiempo Real** - Tracking de actividad
3. **Lista de Contactos** - Gestión de red personal
4. **Arsenal de Enlaces QR** - Links personalizados con tracking
5. **Integración Queswa** - Chatbot IA

### Por Implementar (Basado en Investigación)

#### Academia "Constructor de Activos"
Estructura basada en Los 3 Secretos:

```
Nivel 1: FUNDAMENTOS (Secreto del Vehículo)
├── Módulo 1.1: El Plan por Defecto vs Arquitectura de Activos
├── Módulo 1.2: Por qué distribución > producción
└── Módulo 1.3: El modelo Gano Excel explicado

Nivel 2: MENTALIDAD (Secreto Creencias Internas)
├── Módulo 2.1: De "No puedo" a "El sistema puede"
├── Módulo 2.2: Cómo Queswa elimina la barrera de ventas
└── Módulo 2.3: Tu rol como Arquitecto, no vendedor

Nivel 3: EJECUCIÓN (Secreto Creencias Externas)
├── Módulo 3.1: Validación social y casos de éxito
├── Módulo 3.2: Cómo responder objeciones
└── Módulo 3.3: El cierre sin presión
```

#### Comunidad "La Tribu"
- Feed social interno (tipo Slack/Discord simplificado)
- Celebración de logros
- Preguntas y respuestas
- Prueba social para mostrar a prospectos

#### Herramientas Adicionales
- **Calculadora de Proyección** - Cuánto podrían ganar
- **Generador de Contenido** - Posts para redes sociales
- **Calendario de Seguimiento** - Recordatorios automáticos

---

## 5. PERFIL DE USUARIOS

### Criterio: MENTALIDAD, no ESTATUS

Los socios NO se definen por:
- ❌ Nivel de ingresos
- ❌ Título profesional
- ❌ Experiencia en MLM

Se definen por:
- ✅ **INCOMODIDAD** con su situación actual
- ✅ **MENTALIDAD** de constructor
- ✅ **DESEO DE SOBERANÍA**

### Perfiles Típicos y sus Necesidades

| Usuario | Modo | Necesita en Dashboard |
|---------|------|----------------------|
| Técnico/Operario | Híbrido | Simplicidad, métricas claras, poco texto |
| Ama de casa | Digital | Guía paso a paso, tutoriales, soporte |
| Empleado full-time | Digital | Eficiencia, alertas, automatización |
| Emprendedor con red | Análogo | CRM robusto, exportación, reportes |
| Latino en el extranjero | 100% Digital | Todo automatizado, Queswa al frente |

---

## 6. DISEÑO: QUIET LUXURY

### Paleta de Colores
```css
--background: #0a0a0f;      /* Casi negro */
--accent-gold: #D4AF37;      /* Dorado principal */
--text-primary: #ffffff;     /* Blanco */
--text-secondary: #a0a0a0;   /* Gris suave */
```

### Tipografía
- **Headlines**: Georgia (serif) - Autoridad, elegancia
- **Body**: Sans-serif limpia - Legibilidad

### Principios de Diseño
- Espacios en blanco generosos
- Sin elementos "ruidosos" (no cheques gigantes, no autos)
- Profesionalismo sobrio
- La riqueza es SOBERANÍA, no ostentación
- Iconografía minimalista

---

## 7. ARQUITECTURA TÉCNICA

### Stack Actual
- Next.js 14 (App Router)
- TypeScript
- Supabase (Auth + Database)
- Tailwind CSS
- PWA habilitado

### Integración con Marketing
- Ambos proyectos comparten Supabase
- Queswa (chatbot) es el mismo
- Tracking de prospectos unificado
- Sistema de referidos conectado

### Variables de Entorno a Actualizar
```bash
# ANTES
NEXT_PUBLIC_SITE_URL=https://app.creatuactivo.com

# DESPUÉS
NEXT_PUBLIC_SITE_URL=https://queswa.com
```

---

## 8. RETO DE 5 DÍAS (Conexión Marketing ↔ Dashboard)

El Reto de 5 Días es el funnel principal. Los prospectos que completan el reto y se convierten en socios llegan al Dashboard.

### Flujo Completo
```
creatuactivo.com/reto-5-dias (Squeeze)
    ↓
creatuactivo.com/reto-5-dias/gracias (Bridge)
    ↓
WhatsApp + Emails (5 días de nurturing)
    ↓
creatuactivo.com/fundadores (Oferta)
    ↓
Registro como socio
    ↓
queswa.com (Dashboard) ← AQUÍ ENTRAN
```

### Onboarding en Dashboard
Cuando un nuevo socio llega a queswa.com:
1. **Bienvenida personalizada** - Video de Luis
2. **Tour guiado** - Mostrar funcionalidades clave
3. **Primera tarea** - Completar perfil + importar contactos
4. **Acceso a Academia** - Nivel 1 desbloqueado

---

## 9. MENSAJES CLAVE (Para UI/Copys)

### Mensaje Central de Luis
> "Yo me hice Diamante caminando cuesta arriba, sin las herramientas. Construí Queswa para que tú no tengas que hacerlo."

### Frases para Usar en Dashboard
- "Tu sistema trabaja mientras tú descansas"
- "Queswa filtra, tú cierras"
- "De dependiente a soberano"
- "Construye tu activo, no otro empleo"

### Frases a EVITAR
- ❌ "Gana dinero fácil"
- ❌ "Sin esfuerzo"
- ❌ "Hazte rico"
- ❌ Cualquier término de la lista prohibida

---

## 10. ARCHIVOS DE REFERENCIA

### En Proyecto Marketing
- `PROMPT_GEMINI_INVESTIGADOR.md` - Contexto completo del proyecto (v3.0)
- `PROMPT_GEMINI_DASHBOARD_RESEARCH.md` - Prompt para investigar Dashboard
- `public/.md/Investigación Estratégica CreaTuActivo_ Russell Brunson.md` - **LEER COMPLETO**
- `CLAUDE.md` - Guía técnica del proyecto marketing

### En Proyecto Dashboard
- `CLAUDE.md` - Guía técnica del Dashboard

---

## 11. PRÓXIMOS PASOS PRIORITARIOS

### Inmediato
1. ✅ **Migración de dominio** a queswa.com
2. ⏳ **Actualizar branding** en toda la UI
3. ⏳ **Implementar modo Tri-Modal** en la navegación

### Corto Plazo
4. ⏳ **Crear estructura de Academia** basada en 3 Secretos
5. ⏳ **Diseñar onboarding** para nuevos socios
6. ⏳ **Implementar Comunidad** básica

### Mediano Plazo
7. ⏳ **Herramientas adicionales** (calculadora, generador contenido)
8. ⏳ **Métricas avanzadas** de Queswa
9. ⏳ **Gamificación** (badges, niveles)

---

## 12. PRINCIPIO GUÍA

> "La lealtad es con los objetivos del proyecto, no con las personas."

El objetivo del Dashboard (Queswa.com) es:
**Hacer que CUALQUIER persona pueda construir un activo de distribución, independientemente de sus habilidades de venta, gracias a la tecnología.**

---

*Documento generado: 30 Diciembre 2025*
*Para: Claude Code (Dashboard)*
*Desde: Claude Code (Marketing)*
*Versión: 1.0*
