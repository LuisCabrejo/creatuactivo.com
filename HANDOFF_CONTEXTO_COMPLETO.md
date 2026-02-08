# HANDOFF: Contexto Completo CreaTuActivo & Queswa

**Versión:** 1.0 - Enero 2026
**Autor:** Luis Cabrejo Parra
**Propósito:** Documento de transferencia de conocimiento para nuevos colaboradores, agentes IA, o continuidad de proyectos

---

## 1. VISIÓN GENERAL

### 1.1 ¿Qué es CreaTuActivo?

**CreaTuActivo.com** es un ecosistema tecnológico que ayuda a personas a transicionar de **dependientes a soberanos financieramente** mediante la construcción de activos de distribución.

**Misión:** Construir un vehículo que le permita a millones de personas empezar a cumplir sus propias promesas.

**Filosofía Central:** "La soberanía financiera no se trata de lujos. Se trata de poder cumplir tu palabra."

### 1.2 Posicionamiento de Marca

**Nueva Categoría:** "Arquitectura de Activos" (NO network marketing tradicional)

**El Villano:** El "Plan por Defecto" - trabajar → pagar cuentas → repetir

**La Solución:** Un sistema donde la tecnología hace el 90% del trabajo pesado

### 1.3 Infraestructura de Respaldo

**Socio Corporativo:** Gano Excel
- 30+ años de operación
- Presencia en 65 países
- Productos de café saludable (Ganoderma)
- Capital > $100M USD
- Toda la logística, producción, legal y distribución resuelta

---

## 2. FUNDADOR: LUIS CABREJO PARRA

### 2.1 Historia Personal (Epiphany Bridge)

**El Arco Narrativo:**

1. **El Sueño Inicial** - A los 15 años, seguro de ser millonario a los 30
2. **El Despertar** - A los 40, atrapado en el Plan por Defecto
3. **Primera Transformación** - Gano Excel método tradicional, #1 en 2.5 años, Rango Diamante
4. **Primera Epifanía** - "Lo que para mí era fácil, para los demás era difícil"
5. **El Pivote** - Pandemia → E-commerce ganocafe.online
6. **Segunda Epifanía** - E-commerce tampoco era escalable para todos
7. **La Solución** - Crear CreaTuActivo.com con tecnología IA

**Cita Clave:** En un mirador de los Llanos Orientales (Buena Vista), Luis le hizo 3 promesas a su esposa. 14 años después, solo había cumplido una: los tres hijos. Esa frustración fue el motor del cambio.

### 2.2 Contacto

- **Email:** contacto@creatuactivo.com
- **WhatsApp:** Disponible en la plataforma
- **País:** Colombia

---

## 3. METODOLOGÍAS APLICADAS

### 3.1 Russell Brunson (Conversión)

**Libros de referencia:**
- DotCom Secrets
- Expert Secrets
- Traffic Secrets

**Frameworks implementados:**

| Framework | Aplicación |
|-----------|------------|
| **Epiphany Bridge** | Historia de Luis en Bridge Page |
| **Soap Opera Sequence** | Emails días 1-5 del reto |
| **Perfect Webinar** | Webinar de conversión (WIP) |
| **Challenge Funnel** | Reto de 5 Días |
| **The Stack** | Oferta en /fundadores |
| **Value Ladder** | Fundador → Constructor → Usuario |

### 3.2 Naval Ravikant (Tráfico)

**Filosofía de contenido:**
- Valor puro, sin venta directa
- Pensamiento filosófico sobre riqueza
- "Specific knowledge" y leverage
- 30 videos de contenido → CTA sutil a CreaTuActivo

**Referencia:** "The Almanack of Naval Ravikant"

### 3.3 Framework IAA (Propio)

Sistema interno de gestión de prospectos:

| Fase | Significado | Acciones |
|------|-------------|----------|
| **INICIAR** | Initiate | Landing pages, identificación de prospectos |
| **ACOGER** | Welcome | Queswa AI engagement, captura de datos |
| **ACTIVAR** | Activate | Escalación a consultor humano |

---

## 4. TECNOLOGÍA: QUESWA

### 4.1 ¿Qué es Queswa?

**Queswa** (anteriormente NEXUS, rebranding v15.0) es un chatbot de IA que guía prospectos a través del funnel de ventas mientras captura datos de engagement.

**Nombre:** Inspirado en los puentes incas de cuerda (Q'eswachaka) - simboliza conexión entre tradición e innovación.

### 4.2 Stack Tecnológico

| Componente | Tecnología |
|------------|------------|
| **Frontend** | Next.js 14 (App Router), React, TypeScript |
| **Estilos** | Tailwind CSS |
| **Base de Datos** | Supabase (PostgreSQL + pgvector) |
| **IA Conversacional** | Anthropic Claude API |
| **Embeddings** | Voyage AI |
| **Emails** | Resend |
| **Hosting** | Vercel |
| **Videos** | Vercel Blob |
| **WhatsApp** | Twilio (opcional) |

### 4.3 Arquitectura de Queswa

```
Usuario escribe mensaje
        ↓
Frontend (NEXUSWidget.tsx)
        ↓
API Producer (/api/nexus/producer)
        ↓
Supabase Queue (nexus_queue)
        ↓ (DB Trigger)
Edge Function (nexus-queue-processor)
        ↓
Voyage AI (búsqueda semántica en arsenales)
        ↓
Claude API (genera respuesta)
        ↓
Streaming response al usuario
```

### 4.4 Base de Conocimiento (Arsenales)

Queswa tiene 4 arsenales de conocimiento con embeddings vectoriales:

| Arsenal | Contenido | Fragmentos |
|---------|-----------|------------|
| `arsenal_inicial` | Preguntas iniciales de negocio | 34 respuestas |
| `arsenal_avanzado` | Objeciones, sistema, valor, escalación | 63 respuestas |
| `arsenal_12_niveles` | Contenido del reto de 12 niveles | Variable |
| `catalogo_productos` | 22 productos Gano + ciencia | 22+ items |

### 4.5 Capacidades de Queswa

1. **Respuestas contextuales** - Búsqueda semántica en arsenales
2. **Captura de datos** - Nombre, email, teléfono, ocupación
3. **Clasificación de arquetipos** - Identifica tipo de prospecto
4. **Detección de objeciones** - Precio, tiempo, confianza, MLM
5. **Nivel de interés** - Score 0-10
6. **Streaming** - Respuestas en tiempo real

---

## 5. FUNNEL DE CONVERSIÓN

### 5.1 Arquitectura del Funnel

```
TRÁFICO FRÍO (Ads/Redes)
        ↓
/reto-5-dias (Squeeze Page)
        ↓
/reto-5-dias/gracias (Bridge Page - Epiphany Bridge)
        ↓
Soap Opera Emails (5 días)
        ↓
Reto de 5 Días (WhatsApp/Videos)
        ↓
/fundadores (Oferta - The Stack)
        ↓
Conversión o /paquetes


TRÁFICO SEO (Blog)
        ↓
/blog/* (Shadow Funnel)
        ↓
/reto-5-dias o /fundadores
```

### 5.2 El Reto de 5 Días

**Objetivo:** Nurturing de prospectos fríos a través de contenido de valor

**Estructura:**
- **Día 1:** El Plan por Defecto (el villano)
- **Día 2:** La Arquitectura de Apalancamiento
- **Día 3:** Tu Rol en el Sistema
- **Día 4:** El Dinero (proyecciones)
- **Día 5:** La Decisión

**Entrega:** WhatsApp + Emails automáticos (cron jobs)

### 5.3 Páginas Principales

| Página | Propósito | SEO |
|--------|-----------|-----|
| `/` | Homepage, hub del funnel | Indexada |
| `/reto-5-dias` | Squeeze page | noindex |
| `/reto-5-dias/gracias` | Bridge page | noindex |
| `/fundadores` | Oferta principal | Indexada |
| `/paquetes` | Catálogo de paquetes | Indexada |
| `/servilleta` | Presentación interactiva (4 tabs) | noindex |
| `/socios` | Landing para networkers tradicionales | Indexada |
| `/blog/*` | SEO shadow funnel | Indexada |
| `/tecnologia` | Landing de Queswa | Indexada |

---

## 6. DISEÑO: SISTEMA BIMETÁLICO v3.0

### 6.1 Filosofía

"Quiet Luxury meets Private Equity" - El sitio debe verse como una firma de inversión de alto nivel, no como un MLM típico.

### 6.2 Paleta de Colores

| Categoría | Color | Hex | Uso |
|-----------|-------|-----|-----|
| **Dorado (El Premio)** | Champagne | `#C5A059` | CTAs, dinero, logros |
| **Titanio (Estructura)** | Primary | `#94A3B8` | Iconos, navegación |
| **Fondos** | Carbon Deep | `#0F1115` | Fondo principal |
| | Carbon Elevated | `#15171C` | Secciones alternas |
| | Obsidian | `#1A1D23` | Cards, superficies |
| **Texto** | Blanco | `#FFFFFF` | Títulos |
| | Smoke | `#E5E5E5` | Cuerpo |
| | Muted | `#94A3B8` | Secundario |
| **Alerta** | Coral | `#FF8A80` | Dolor, dependencia |

### 6.3 Regla del Dorado

El dorado (`#C5A059`) solo se usa para:
- Botones CTA
- Números de dinero
- Logros/premios
- Títulos destacados

El titanio (`#94A3B8`) se usa para:
- Navegación
- Iconos (hover → dorado)
- Texto secundario
- Divisores

---

## 7. MODELO DE NEGOCIO

### 7.1 Fases de Lanzamiento

| Fase | Cupos | Descripción |
|------|-------|-------------|
| **Lista Privada** | 150 | Fundadores (MENTORES) |
| **Pre-Lanzamiento** | 22,500 | Constructores (150 × 150) |
| **Lanzamiento Público** | 4M+ | Usuarios |

### 7.2 Roles

| Rol | Descripción | Inversión |
|-----|-------------|-----------|
| **Fundador** | Mentor, acceso VIP, primer nivel | Paquete ESP3+ |
| **Constructor** | Builder activo, equipo | Paquete ESP2+ |
| **Usuario** | Consumidor de productos | Paquete ESP1 |

### 7.3 Paquetes (COP)

| Paquete | USD | COP (TRM 4500) | Contenido |
|---------|-----|----------------|-----------|
| ESP1 (Inicial) | ~$65 | ~$292,500 | Kit básico |
| ESP2 (Pro) | ~$195 | ~$877,500 | Kit intermedio |
| ESP3 (Visionario) | ~$455 | ~$2,047,500 | Kit completo |

---

## 8. LENGUAJE DE MARCA

### 8.1 Palabras a EVITAR

- ❌ MLM, network marketing, multinivel
- ❌ "Oportunidad de negocio"
- ❌ Reclutar, downline, upline
- ❌ "Sé tu propio jefe", "Trabaja desde casa"
- ❌ "Ingresos pasivos", "Libertad financiera" (sobreusadas)

### 8.2 Palabras a USAR

- ✅ Arquitectura de Activos
- ✅ Soberanía financiera
- ✅ Construir patrimonio
- ✅ El plan por defecto (villano)
- ✅ Leverage / Apalancamiento
- ✅ Cartera de activos
- ✅ Distribución global

### 8.3 Tono de Voz

- **Naval Ravikant style:** Filosófico, valor primero, sin venta directa
- **Quiet Luxury:** Sofisticado, no hype
- **Honestidad brutal:** Sin promesas exageradas

---

## 9. ESTRUCTURA DEL REPOSITORIO

```
/Users/luiscabrejo/Cta/marketing/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/               # API routes (nexus, funnel, etc.)
│   │   ├── reto-5-dias/       # Challenge funnel
│   │   ├── fundadores/        # Main offer
│   │   ├── servilleta/        # Interactive presentation
│   │   └── ...
│   ├── components/            # React components
│   │   └── nexus/            # Queswa chatbot components
│   ├── lib/                   # Utilities (branding, vectorSearch)
│   └── emails/               # Email templates (React Email)
├── knowledge_base/           # Arsenal .txt files
├── scripts/                  # Deployment & utility scripts
├── supabase/                # Edge functions & migrations
├── public/                  # Static assets
├── CLAUDE.md               # AI agent instructions
├── EPIPHANY_BRIDGE_OFICIAL.md
└── PROMPT_*.md             # Research prompts
```

---

## 10. SERVICIOS EXTERNOS

| Servicio | Propósito | Dashboard |
|----------|-----------|-----------|
| **Vercel** | Hosting Next.js | vercel.com/dashboard |
| **Supabase** | DB + Auth + Edge Functions | supabase.com/dashboard |
| **Anthropic** | Claude API (Queswa) | console.anthropic.com |
| **Voyage AI** | Embeddings vectoriales | voyageai.com |
| **Resend** | Emails transaccionales | resend.com |
| **Google Search Console** | SEO analytics | search.google.com/search-console |
| **GitHub** | Repositorio | github.com/LuisCabrejo/creatuactivo.com |

---

## 11. COMANDOS ESENCIALES

```bash
# Desarrollo
npm run dev              # Servidor local :3000
npm run build            # Build producción

# Queswa Knowledge Base
node scripts/leer-system-prompt.mjs           # Ver prompt actual
node scripts/deploy-arsenal-inicial.mjs       # Deploy arsenal
node scripts/fragmentar-arsenales-voyage.mjs  # Regenerar embeddings

# Deploy
git push origin main     # Auto-deploy en Vercel
npx supabase functions deploy nexus-queue-processor
```

---

## 12. DOCUMENTOS CLAVE

| Documento | Propósito |
|-----------|-----------|
| `CLAUDE.md` | Instrucciones para agentes IA |
| `EPIPHANY_BRIDGE_OFICIAL.md` | Script maestro de storytelling |
| `PROMPT_INVESTIGACION_BRUNSON_FUNNELS.md` | Research de funnels |
| `PROMPT_INVESTIGACION_NAVAL_CONTENIDO.md` | Research de contenido |
| `DEPLOYMENT_DB_QUEUE.md` | Deploy del sistema de cola |
| `knowledge_base/README.md` | Documentación de arsenales |

---

## 13. PRÓXIMOS PASOS (Roadmap)

1. **Webinar** - Implementar Perfect Webinar script
2. **WhatsApp Automation** - Twilio/ManyChat integration
3. **Dashboard Constructor** - Panel para miembros
4. **App Móvil** - PWA ya implementada, nativa pendiente
5. **Expansión** - Otros países de habla hispana

---

*Documento de transferencia de conocimiento - CreaTuActivo.com*
*Enero 2026*
