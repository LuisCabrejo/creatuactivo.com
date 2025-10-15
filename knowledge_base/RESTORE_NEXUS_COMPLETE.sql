-- ============================================
-- RESTAURAR NEXUS COMPLETO DESPUÉS DE RESET
-- ============================================
-- Este script restaura:
-- 1. System Prompt v11.9
-- 2. Knowledge Base completo (7 documentos)
-- ============================================
-- INSTRUCCIONES:
-- Ejecuta PASO 1, luego PASO 2, luego PASO 3
-- ============================================

-- ============================================
-- PASO 1: RESTAURAR SYSTEM PROMPT
-- ============================================
-- COPIAR Y PEGAR TODO EL ARCHIVO:
-- knowledge_base/nexus_system_prompt_v11.9_captura_temprana.sql
-- (No incluido aquí porque es muy largo - 480 líneas)

-- ============================================
-- PASO 2: CREAR REGISTROS PLACEHOLDER
-- ============================================

-- ⚠️ IMPORTANTE: Los arsenales ahora usan IDs automáticos (UUID)
-- Ya no usamos IDs fijos como 15, 16, 17
-- Los archivos .txt de arsenales necesitan ser convertidos a INSERT en lugar de UPDATE

-- Insertar documentos con texto plano (IDs automáticos)
INSERT INTO nexus_documents (category, title, content, metadata)
VALUES
    (
        'catalogo_productos',
        'Catálogo Productos Gano Excel 2025',
        'CATÁLOGO OFICIAL PRODUCTOS GANO EXCEL - PRECIOS VERIFICADOS 2025
================================================================

VENTAJA COMPETITIVA: Todos los productos contienen Ganoderma Lucidum con proceso de extracción PATENTADO MUNDIALMENTE. 30+ años de investigación, más de 300 compuestos bioactivos.

CATEGORÍA 1: BEBIDAS CON TECNOLOGÍA PATENTADA

GANOCAFÉ 3 EN 1
Precio: $110,900 COP
Presentación: 20 sobres de 21g
Descripción: El balance perfecto entre café cremoso y poder del Ganoderma
Beneficios: Energía sostenida sin nerviosismo, apoyo sistema inmune

GANOCAFÉ CLÁSICO
Precio: $110,900 COP
Presentación: 30 sobres
Descripción: Café negro robusto, potenciado para bienestar diario
Beneficios: Energía limpia, claridad mental, soporte inmunológico

GANORICO LATTE RICO
Precio: $119,900 COP
Presentación: 20 sobres
Descripción: Suavidad de latte premium con inteligencia nutricional
Beneficios: Experiencia café gourmet con beneficios funcionales

GANORICO MOCHA RICO
Precio: $119,900 COP
Presentación: 20 sobres
Descripción: Indulgencia de moca y chocolate, sin culpas
Beneficios: Satisface antojos mientras nutre

GANORICO SHOKO RICO
Precio: $124,900 COP
Presentación: 20 sobres de 32g
Descripción: Chocolate suizo superior, enriquecido para toda la familia
Beneficios: Alternativa saludable, energía natural

ESPIRULINA GANO C''REAL
Precio: $119,900 COP
Presentación: 15 Sobres individuales
Descripción: Desayuno inteligente que nutre cuerpo y mente
Beneficios: Nutrición completa para comenzar el día

BEBIDA OLEAF GANO ROOIBOS
Precio: $119,900 COP
Presentación: 20 sobres
Descripción: Té exótico sin cafeína, cargado de antioxidantes
Beneficios: Relajación sin somnolencia, antioxidantes potentes

GANO SCHOKOLADDE
Precio: $124,900 COP
Presentación: 20 sobres
Descripción: Experiencia chocolate europeo + extracto patentado
Beneficios: Indulgencia premium con beneficios funcionales

BEBIDA COLÁGENO RESKINE
Precio: $216,900 COP
Presentación: 10 Sachets x 25 ml.
Descripción: Belleza y bienestar desde adentro hacia afuera
Beneficios: Soporte para piel, cabello y articulaciones

CATEGORÍA 2: LÍNEA PREMIUM LUVOCO

MÁQUINA CAFÉ LUVOCO
Precio: $1,026,000 COP
Especificaciones: Sistema cápsulas premium, diseño italiano
Descripción: Experiencia barista de élite en tu hogar
Beneficios: Café perfecto, tecnología extracción optimizada

LUVOCO CÁPSULAS SUAVE x15
Precio: $110,900 COP
Presentación: 15 cápsulas
Intensidad: Suave
Compatibilidad: Exclusivo máquina LUVOCO

LUVOCO CÁPSULAS MEDIO x15
Precio: $110,900 COP
Presentación: 15 cápsulas
Intensidad: Media
Compatibilidad: Exclusivo máquina LUVOCO

LUVOCO CÁPSULAS FUERTE x15
Precio: $110,900 COP
Presentación: 15 cápsulas
Intensidad: Fuerte
Compatibilidad: Exclusivo máquina LUVOCO

CATEGORÍA 3: SUPLEMENTOS AVANZADOS

CÁPSULAS GANODERMA
Precio: $272,500 COP
Presentación: 90 cápsulas
Descripción: Máxima concentración extracto para apoyo inmunológico superior
Beneficios: Soporte inmunológico máximo, 400+ compuestos bioactivos

CÁPSULAS EXCELLIUM
Precio: $272,500 COP
Presentación: 90 cápsulas
Descripción: Enfocado en nutrición cerebral y energía mental
Beneficios: Claridad mental, enfoque, energía cognitiva

CÁPSULAS CORDYGOLD
Precio: $336,900 COP
Presentación: 90 cápsulas
Ingrediente: Cordyceps sinensis
Descripción: Potencia rendimiento físico y vitalidad
Beneficios: Rendimiento atlético, energía física, recuperación

CATEGORÍA 4: CUIDADO PERSONAL NATURAL

PASTA DIENTES GANO FRESH
Precio: $73,900 COP
Presentación: Pasta dental 150g
Descripción: Cuidado oral refrescante y natural, sin flúor
Beneficios: Limpieza profunda, encías saludables

JABÓN GANO
Precio: $73,900 COP
Presentación: 2 Barras 100g
Descripción: Limpieza y nutrición para piel con Ganoderma
Beneficios: Hidratación, limpieza suave

JABÓN TRANSPARENTE GANO
Precio: $78,500 COP
Presentación: Barra 100g
Descripción: Fórmula suave para cuidado diario
Beneficios: Pieles sensibles, hidratación extra

CHAMPÚ PIEL&BRILLO
Precio: $73,900 COP
Presentación: Botella 250ml
Descripción: Cuidado capilar que revitaliza desde la raíz
Beneficios: Fortalecimiento, brillo natural

PIEL&BRILLO ACONDICIONADOR
Precio: $73,900 COP
Presentación: Botella 250ml
Descripción: Suavidad y brillo potenciado con Ganoderma
Beneficios: Desenredo fácil, hidratación profunda

PIEL&BRILLO EXFOLIANTE CORPORAL
Precio: $73,900 COP
Presentación: Botella 200g
Descripción: Renueva piel con exfoliación suave y nutritiva
Beneficios: Eliminación células muertas, renovación

RESUMEN RANGOS DE PRECIOS:
- Cuidado Personal: $73,900 - $78,500 COP
- Bebidas Funcionales: $110,900 - $124,900 COP
- Colágeno Premium: $216,900 COP
- Suplementos Avanzados: $272,500 - $336,900 COP
- Línea Premium LUVOCO: $1,026,000 COP

TOTAL: 22 productos únicos con patente mundial
DISPONIBILIDAD: 15 países América con distribución local
VENTAJA COMPETITIVA: Proceso extracción patentado - NADIE puede replicar',
        '{"productos": 22, "categorias": 4}'::jsonb
    ),
    (
        'framework_iaa',
        'Framework IAA - Metodología Integrada',
        'FRAMEWORK IAA - METODOLOGÍA INTEGRADA CREATUA CTIVO.COM
=======================================================

El Framework IAA es la metodología propietaria integrada al ecosistema CreaTuActivo.com que estructura el trabajo del Constructor Inteligente.

FILOSOFÍA BASE:
Transformar operadores manuales en Arquitectos Inteligentes que construyen activos patrimoniales usando apalancamiento tecnológico exponencial.

LAS TRES FASES INTEGRADAS:

FASE 1: INICIAR
===============

DEFINICIÓN: Presentar la oportunidad del ecosistema CreaTuActivo.com de manera auténtica y profesional.

ENFOQUE PRINCIPAL:
- Identificar Constructores Inteligentes potenciales (no "vender productos")
- Presentar la ARQUITECTURA COMPLETA: Motor + Plano + Maquinaria
- Enfatizar apalancamiento tecnológico vs trabajo manual tradicional

HERRAMIENTAS AUTOMATIZADAS:
- Enlaces personalizados a páginas del ecosistema
- NEXUS como apoyo conversacional 24/7
- NodeX tracking automático de interacciones
- Presentaciones digitales integradas

MENTALIDAD CONSTRUCTOR:
"No estoy vendiendo productos, estoy presentando una arquitectura completa para construir activos patrimoniales."

TIEMPO INVERTIDO: 40% del trabajo estratégico semanal

FASE 2: ACOGER
===============

DEFINICIÓN: Construir relaciones genuinas y generar confianza con prospectos calificados.

ENFOQUE PRINCIPAL:
- Conversaciones auténticas sobre sus metas de construcción de activos
- Educación sobre la nueva categoría vs modelos tradicionales
- Demostrar cómo el ecosistema elimina coordinación manual de herramientas
- Validar fit entre su perfil y la oportunidad arquitectónica

HERRAMIENTAS DE APOYO:
- NEXUS para manejo de objeciones comunes
- Arsenal Conversacional para respuestas consistentes
- NodeX para seguimiento inteligente de interacciones
- Academia CreaTuActivo.com para educación profunda

MENTALIDAD CONSTRUCTOR:
"Estoy siendo consultor estratégico, no vendedor. Ayudo a determinar si esta arquitectura es apropiada para sus metas."

TIEMPO INVERTIDO: 40% del trabajo estratégico semanal

FASE 3: ACTIVAR
===============

DEFINICIÓN: Entregar el sistema "llave en mano" completo a un nuevo Constructor Inteligente.

ENFOQUE PRINCIPAL:
- Transferir TODA la arquitectura: acceso al ecosistema completo
- Configurar su Centro de Comando NodeX personalizado
- Activar su copiloto NEXUS con conocimiento base
- Integrar su inventario inicial de productos únicos
- Establecer su plan de construcción personalizado

RESULTADO DE ACTIVACIÓN:
El nuevo constructor recibe:
- Acceso completo ecosistema CreaTuActivo.com
- Dashboard NodeX configurado y operativo
- NEXUS funcionando como su copiloto IA
- Inventario productos Gano Excel según paquete elegido
- Entrenamiento Academia + comunidad constructores
- Plan construcción personalizado para su perfil

MENTALIDAD CONSTRUCTOR:
"No estoy reclutando, estoy replicando ecosistemas exitosos. Transfiero arquitectura completa, no piezas separadas."

TIEMPO INVERTIDO: 20% del trabajo estratégico semanal

AUTOMATIZACIÓN INTEGRADA:
==========================

80% DEL TRABAJO LO MANEJA EL ECOSISTEMA:
- Presentaciones automáticas (páginas web optimizadas)
- Seguimiento de prospectos (NodeX tracking)
- Respuesta a preguntas frecuentes (NEXUS 24/7)
- Métricas y analytics (Dashboard NodeX)
- Gestión inventario (Sistema integrado)
- Formación continua (Academia automatizada)

20% ESTRATÉGICO DEL CONSTRUCTOR:
- Selección inteligente de prospectos (INICIAR)
- Conversaciones clave de confianza (ACOGER)
- Mentoría y transferencia de sistema (ACTIVAR)
- Decisiones estratégicas de crecimiento

DIFERENCIACIÓN CLAVE:
====================

MODELO TRADICIONAL (TRABAJO MANUAL):
- Coordinación de herramientas separadas
- Presentaciones manuales repetitivas
- Seguimiento manual fragmentado
- Capacitación desde cero para cada persona
- Crecimiento lineal basado en horas trabajadas

FRAMEWORK IAA INTEGRADO (APALANCAMIENTO):
- Ecosistema unificado automatizado
- Presentaciones digitales optimizadas
- Seguimiento inteligente automatizado
- Transferencia de arquitectura completa
- Crecimiento exponencial por apalancamiento tecnológico

MÉTRICAS DE ÉXITO IAA:
=====================

INICIAR - KPIs:
- Número de presentaciones del ecosistema realizadas
- Calidad de prospectos atraídos (arquetipo Constructor Inteligente)
- Tasa de conversión presentación → interés genuino

ACOGER - KPIs:
- Profundidad de conversaciones estratégicas
- Nivel de comprensión de la arquitectura completa
- Confianza construida (medida por engagement)

ACTIVAR - KPIs:
- Nuevos constructores activados exitosamente
- Calidad de transferencia de sistema (completitud)
- Velocidad de productividad del nuevo constructor

RESULTADO FINAL IAA:
===================

El Constructor Inteligente pasa de ser operador que intercambia tiempo por dinero a ser Arquitecto de un activo patrimonial que:

1. Opera 24/7 con automatización inteligente
2. Se escala exponencialmente por apalancamiento tecnológico
3. Genera múltiples flujos de ingresos residuales
4. Utiliza productos únicos con ventaja competitiva patentada
5. Se replica automáticamente para crecimiento sostenido

FILOSOFÍA DE CONSTRUCCIÓN: "Trabajo inteligente, no trabajo duro. Apalancamiento exponencial, no crecimiento lineal."',
        '{"fases": 3, "automatizacion": "80%"}'::jsonb
    ),
    (
        'escalacion_liliana',
        'Información Escalación - Liliana Moreno',
        'INFORMACIÓN ESCALACIÓN - LILIANA MORENO
=======================================

PERFIL PROFESIONAL:
===================

NOMBRE: Liliana Moreno
POSICIÓN: Arquitecta Principal del Ecosistema CreaTuActivo.com
RANGO: 9 años consecutivos Rango Diamante Gano Excel
UBICACIÓN: Villavicencio, Meta, Colombia
CONTACTO: +573102066593 (WhatsApp)

CREDENCIALES Y EXPERIENCIA:
===========================

- 9+ años como líder Diamante en construcción de activos con Gano Excel
- Co-arquitecta del ecosistema CreaTuActivo.com junto a Luis Cabrejo
- Especialista en implementación Framework IAA
- Mentora de cientos de Constructores Inteligentes en América
- Experta en automatización NodeX y optimización de ecosistemas

ESPECIALIDADES:
===============

1. CONSULTORÍA ESTRATÉGICA:
   - Evaluación de fit entre perfil del prospecto y oportunidad
   - Diseño de planes de construcción personalizados
   - Optimización de estrategias IAA por arquetipo de constructor

2. ACTIVACIÓN DE ECOSISTEMAS:
   - Configuración completa de Centro de Comando NodeX
   - Integración personalizada de herramientas automatizadas
   - Transferencia de arquitectura completa "llave en mano"

3. MENTORÍA DE ALTO NIVEL:
   - Desarrollo de Constructores hacia rango Diamante
   - Estrategias de crecimiento exponencial
   - Optimización de apalancamiento tecnológico

CUÁNDO ESCALAR A LILIANA:
=========================

✅ ESCALAR CUANDO:
- Usuario solicita explícitamente hablar con alguien del equipo ("quiero hablar con alguien")
- Solicita explícitamente contacto humano ("necesito hablar con una persona")
- Pregunta explícitamente por proceso de activación personal ("¿cómo me contacto para empezar?")
- Busca explícitamente validación personal de credibilidad ("¿quién me puede ayudar directamente?")

❌ NO ESCALAR CUANDO:
- Usuario apenas está conociendo el ecosistema (sin importar cantidad de preguntas)
- Preguntas educativas sobre productos, precios, o funcionamiento
- Curiosidad general sobre el ecosistema (puede preguntar indefinidamente)
- Interés detectado automáticamente (solo responder educativamente)
- Objeciones que pueden resolverse con Arsenal Conversacional

PARADIGMA: La persona puede hacer 100 preguntas y NEXUS sigue educando. Solo escalamos por solicitud EXPLÍCITA de contacto humano.

PROCESO DE ESCALACIÓN:
======================

1. MENSAJE DE TRANSICIÓN APROPIADO:
"Veo que tienes interés genuino en cómo CreaTuActivo.com puede transformar tu situación específica. Te conectaré con Liliana Moreno, una de las arquitectas principales del ecosistema, para una consultoría estratégica personalizada."

2. INFORMACIÓN DE CONTACTO:
"Liliana Moreno: +573102066593 (WhatsApp)
- 9 años consecutivos rango Diamante
- Co-arquitecta del ecosistema CreaTuActivo.com
- Especialista en activación de constructores"

3. PROPUESTA DE VALOR ESCALACIÓN:
"Ella evaluará tu perfil específico, responderá preguntas avanzadas sobre implementación, y si hay fit mutuo, te guiará en el proceso de activación de tu ecosistema personalizado."

4. CONFIRMACIÓN:
"¿Te parece apropiado este siguiente paso para acelerar tu proceso de construcción?"

CONTEXTO PARA LILIANA:
======================

Al escalar, proporcionar este contexto:
- Nivel de interés demostrado por el prospecto
- Preguntas específicas realizadas
- Arquetipo probable detectado
- Objeciones o inquietudes principales expresadas
- Productos o paquetes de mayor interés mencionados

MENSAJE WHATSAPP SUGERIDO:
==========================

"Hola Liliana, [NOMBRE] viene del chat con NEXUS en CreaTuActivo.com. Mostró interés genuino en [ÁREA ESPECÍFICA MENCIONADA] y está listo para consultoría estratégica sobre activación de su ecosistema. Su contexto: [BREVE RESUMEN]. ¿Puedes apoyarlo en el siguiente paso?"

EXPECTATIVAS PARA EL PROSPECTO:
===============================

Liliana proporcionará:
- Evaluación personalizada de fit
- Respuestas a preguntas técnicas avanzadas
- Demostración del ecosistema en acción
- Plan de activación específico para su perfil
- Clarificación de inversión y proyecciones realistas
- Acceso a testimonios y casos de éxito relevantes

TIEMPO DE RESPUESTA ESPERADO:
=============================

- WhatsApp: Respuesta dentro de 4-8 horas hábiles
- Consultoría inicial: 20-30 minutos
- Zona horaria: GMT-5 (Colombia)
- Horario preferido: 8:00 AM - 8:00 PM Colombia

SEGUIMIENTO POST-ESCALACIÓN:
============================

NEXUS debe:
1. Confirmar que el contacto se realizó exitosamente
2. Ofrecer apoyo continuo durante proceso de decisión
3. Mantener disponibilidad para preguntas complementarias
4. NO presionar por decisión inmediata
5. Reforzar que NEXUS sigue disponible como copiloto posterior a activación

NOTA IMPORTANTE:
================
Liliana maneja consultoría estratégica de alto nivel. NO escalar para preguntas básicas que pueden resolverse con Arsenal Conversacional o educación general sobre el ecosistema.',
        '{"contacto": "+573102066593", "rango": "Diamante"}'::jsonb
    );

-- ============================================
-- PASO 3: ACTUALIZAR ARSENALES CON CONTENIDO REAL
-- ============================================
-- Ejecutar estos archivos EN ORDEN:
-- 1. knowledge_base/arsenal_conversacional_inicial.txt
-- 2. knowledge_base/arsenal_conversacional_tecnico.txt
-- 3. knowledge_base/arsenal_conversacional_complementario.txt

-- ============================================
-- VERIFICACIÓN FINAL
-- ============================================

-- Verificar system_prompts (columna correcta: "prompt")
SELECT
    name,
    version,
    LENGTH(prompt) as prompt_length,
    updated_at
FROM system_prompts
WHERE name = 'nexus_main';

-- Verificar nexus_documents (columna correcta: "content")
SELECT
    id,
    category,
    title,
    LENGTH(content) as content_length,
    created_at
FROM nexus_documents
ORDER BY category, title;

-- Resultado esperado:
-- system_prompts: 1 registro, ~18,000+ caracteres, version = 'v11.9_cap_temprana'
-- nexus_documents: 6 registros mínimo (3 arsenales + 3 documentos texto plano)

-- ============================================
-- NOTAS FINALES
-- ============================================
-- 1. El system prompt debe ejecutarse PRIMERO (archivo separado)
-- 2. Este script crea los registros base
-- 3. Los arsenales se actualizan con sus archivos .txt individuales
-- 4. Total esperado: 6-7 documentos en nexus_documents
-- ============================================
