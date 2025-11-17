-- ========================================================
-- INSERTAR NUEVO DOCUMENTO: Productos Ciencia (Beneficios Ganoderma)
-- ========================================================
-- Proyecto: CreaTuActivo.com
-- Fecha: 17 Noviembre 2025
-- Tabla: nexus_documents
-- OBJETIVO: Agregar 5to documento con ciencia de Ganoderma
-- ========================================================

-- Primero verificar si ya existe el documento
DO $$
BEGIN
  -- Si existe, actualizarlo
  IF EXISTS (SELECT 1 FROM nexus_documents WHERE category = 'productos_ciencia') THEN
    UPDATE nexus_documents
    SET
      title = 'Beneficios Científicos Ganoderma Lucidum',
      content = '# Arsenal Conversacional: Beneficios Científicos Ganoderma v2.0

**Propósito:** Respuestas sobre ciencia del Ganoderma Lucidum con respaldo verificable

**Integración:** Complementa arsenal_inicial (oportunidad) y catalogo_productos (precios)

---

## 🌿 PREGUNTAS SOBRE BENEFICIOS (2 respuestas principales)

### PROD_01: "¿Qué beneficios tienen los productos Gano Excel?"

Los productos tienen una ventaja que nadie puede replicar: **proceso de extracción patentado mundialmente** de Ganoderma lucidum.

**¿Por qué importa la patente?**

Mientras otros usan polvo de hongo básico, Gano Excel tiene:
- Extracto 100% hidrosoluble
- 200+ fitonutrientes activos por producto
- 30+ años de investigación científica
- Más de 2,000 estudios en PubMed

**Categorías de productos y beneficios:**

🍵 **Bebidas Funcionales** (cafés, chocolates, tés)
- Energía sostenida sin nerviosismo
- Claridad mental natural
- Soporte sistema inmunológico diario
- Experiencia gourmet con beneficios reales
- Ejemplo: GANOCAFÉ 3 EN 1 ($110,900 COP) - 20 sobres

💊 **Suplementos Concentrados** (cápsulas)
- Máxima concentración de Ganoderma (400mg por cápsula)
- Soporte inmunológico superior (CÁPSULAS GANODERMA)
- Claridad mental y enfoque (EXCELLIUM con nootrópicos)
- Rendimiento atlético (CORDYGOLD con Cordyceps sinensis)
- Suministro 3 meses (90 cápsulas)
- Ejemplo: CÁPSULAS GANODERMA ($272,500 COP)

☕ **Línea Premium LUVOCO**
- Sistema de cápsulas estilo barista profesional
- Café perfecto en casa con tecnología italiana
- 3 intensidades (Suave, Medio, Fuerte)
- 15 bares de presión para extracción óptima
- Máquina: $1,026,000 COP / Cápsulas: $110,900 COP

🧴 **Cuidado Personal Natural**
- Pasta dental sin flúor (GANO FRESH)
- Jabones y champús con Ganoderma
- Beneficios tópicos: anti-inflamatorio, hidratación
- Desde $73,900 COP

**Lo que hace únicos estos productos:**
1. **Patente mundial**: NADIE puede replicarlos
2. **Ciencia real**: 2,847 constructores en 9 años validaron la demanda sostenida
3. **15 países**: Distribución consolidada en toda América
4. **Biodisponibilidad garantizada**: Extracto 100% hidrosoluble vs. polvo convencional

**Pregunta de seguimiento:** ¿Qué categoría de productos resuena más contigo: bebidas diarias, suplementación intensiva, o experiencia premium?

---

### PROD_02: "¿Por qué Ganoderma lucidum es tan especial?"

Ganoderma lucidum (Reishi) es conocido en Asia como "el hongo de la inmortalidad", usado por más de 2,000 años. Pero lo que realmente importa es **lo que dice la ciencia moderna**.

**LO QUE DICE LA CIENCIA (PubMed 2024):**

🔬 **Compuestos bioactivos identificados:**
- **Polisacáridos** (β-D-glucanos, α-D-glucanos, α-D-mannans)
- **Ganoderic Acids** (triterpenoides con 200+ variantes)
- **200+ fitonutrientes activos** en total

🧬 **12 funciones documentadas científicamente:**
1. **Soporte sistema inmunológico** - Estimula macrófagos y células NK
2. **Anti-inflamatorio natural** - Reduce marcadores inflamatorios
3. **Protección hepática** - Hepatoprotección documentada
4. **Neuroprotección** - Soporte salud cerebral
5. **Salud cardiovascular** - Regula presión y lípidos
6. **Balance metabólico** - Mejora sensibilidad insulina
7. **Anti-envejecimiento** - Propiedades antioxidantes
8. **Protección ósea** - Salud esquelética
9. **Microbioma intestinal** - Regula flora bacteriana
10. **Energía celular** - Mejora función mitocondrial
11. **Adaptógeno natural** - Manejo del estrés
12. **Soporte respiratorio** - Salud pulmonar

🌍 **Evidencia científica verificable:**
- **2,000+ estudios** publicados en PubMed (1990-2024)
- **30+ años** de investigación continua
- Estudios en **Nature Scientific Reports**, **Frontiers in Microbiology**, **PMC**
- Meta-análisis sistemáticos con metodología GRADE

**LA DIFERENCIA GANO EXCEL (Crítico entender esto):**

Imagina que tienes granos de café. Puedes:
- **Opción A:** Masticar los granos crudos (baja biodisponibilidad)
- **Opción B:** Tomar un espresso perfectamente extraído (alta biodisponibilidad)

Con Ganoderma es igual:
- **Polvo de hongo convencional:** Tu cuerpo NO puede absorber efectivamente los compuestos (como masticar granos crudos)
- **Extracto patentado Gano Excel:** 100% hidrosoluble = Tu cuerpo absorbe TODOS los compuestos bioactivos (como el espresso perfecto)

El proceso de extracción patentado **rompe las paredes celulares del hongo** y extrae los compuestos en forma hidrosoluble. Esto garantiza biodisponibilidad completa.

**Estudios específicos recientes (2024):**
- **Frontiers in Microbiology:** Efectos positivos en microbioma intestinal
- **Nature Scientific Reports (2018):** Función inmunológica y network biológico
- **PubMed meta-análisis:** Evaluación sistemática de ensayos clínicos
- **PMC estudios 2023-2024:** Salud metabólica y cardiovascular

**IMPORTANTE (Disclaimer):**
Ganoderma lucidum se usa como suplemento alimenticio para apoyo a la salud general, no como medicamento. Los productos Gano Excel son alimentos funcionales. Los beneficios descritos se basan en investigación científica publicada, pero los productos no pretenden diagnosticar, tratar, curar o prevenir ninguna enfermedad.

**Pregunta de seguimiento:** ¿Te interesa conocer más sobre alguna categoría específica: inmunológico, mental, físico o metabólico?

---

## 🔬 PREGUNTAS TÉCNICAS SOBRE GANODERMA (4 respuestas)

### TECH_01: "¿Qué estudios científicos respaldan los beneficios?"

La evidencia científica sobre Ganoderma lucidum es sólida y verificable:

**Bases de datos científicas:**
- **PubMed:** 2,000+ estudios desde 1990
- **PubMed Central (PMC):** Acceso abierto a investigación
- **Nature:** Estudios de alto impacto
- **Frontiers in Microbiology:** Investigación reciente 2024

**Estudios clave destacados:**

1. **"Exploring the Therapeutic Potential of Ganoderma lucidum in Cancer" (PMC 2024)**
   - Documenta efectos en malignidades hematológicas
   - Mecanismos: estimulación inmune, diferenciación celular, apoptosis

2. **"Regulatory effect of Ganoderma lucidum on gut flora" (Frontiers 2024)**
   - Efectos en microbioma intestinal
   - Alivia hiperglucemia, hiperlipidemia, obesidad

3. **"The effect of Ganoderma lucidum extract on immunological function" (Nature Scientific Reports 2018)**
   - Network biológico de función inmune
   - Actividad anti-tumor immunostimulante

4. **"Research Progress on Ganoderic Acids" (PMC 2024)**
   - Últimos 5 años de investigación
   - 12 funciones biológicas documentadas

**Cómo verificar:**
Puedes buscar en PubMed.gov usando: "Ganoderma lucidum", "Reishi mushroom", "Ganoderic acid"

**Pregunta de seguimiento:** ¿Te gustaría que te compartiera enlaces a estudios específicos sobre algún beneficio en particular?

---

### TECH_02: "¿Es seguro consumir Ganoderma diariamente?"

Sí, Ganoderma tiene un perfil de seguridad excelente respaldado por evidencia:

**Seguridad documentada:**
- Uso tradicional: 2,000+ años en medicina china sin toxicidad reportada
- Estudios modernos: Perfil de seguridad confirmado en ensayos clínicos
- Efectos secundarios: Raros y generalmente leves (malestar digestivo leve en <5% usuarios)

**Contraindicaciones a considerar:**
- **Anticoagulantes:** Consultar médico (Ganoderma tiene propiedades antitrombóticas)
- **Inmunosupresores:** Consultar médico (Ganoderma estimula sistema inmune)
- **Cirugía programada:** Suspender 2 semanas antes (por efecto anticoagulante)
- **Embarazo/lactancia:** Uso no estudiado extensivamente, consultar médico

**Dosis recomendadas:**
- Bebidas: 1-2 sobres diarios (consumo regular)
- Cápsulas concentradas: 1 cápsula diaria con alimentos
- No hay evidencia de toxicidad por sobredosis en rangos normales

**Pregunta de seguimiento:** ¿Tienes alguna condición médica específica que te preocupe respecto al consumo de Ganoderma?

---

### TECH_03: "¿Cuánto tiempo toma notar los beneficios?"

Los beneficios de Ganoderma operan a diferentes niveles y tiempos:

**Efectos tempranos (Días a 2 semanas):**
- Mayor energía sostenida (sin picos de cafeína)
- Claridad mental y enfoque
- Mejor calidad de sueño
- Sensación general de bienestar

**Efectos de mediano plazo (4-8 semanas):**
- Soporte inmunológico (menos resfriados)
- Mejora digestión y regulación
- Balance energético estable
- Reducción inflamación percibida

**Efectos de largo plazo (3-6 meses):**
- Fortalecimiento sistema inmune sostenido
- Balance metabólico (glucosa, lípidos)
- Mejora marcadores de salud en análisis
- Beneficios acumulativos adaptogénicos

**Importante entender:**
Ganoderma NO es un estimulante (no sentirás un "rush" inmediato). Trabaja a nivel celular, apoyando sistemas del cuerpo de forma gradual y sostenible. Es como ir al gimnasio: los beneficios se acumulan con consistencia.

**Factor clave: Consistencia**
El uso diario consistente es crucial. Los compuestos bioactivos necesitan alcanzar niveles sostenidos en el organismo.

**Pregunta de seguimiento:** ¿Qué tipo de beneficios específicos estás buscando: energía diaria, soporte inmune, claridad mental, o salud metabólica?

---

### TECH_04: "¿Puedo combinar diferentes productos Gano Excel?"

¡Absolutamente! De hecho, combinar productos puede crear efectos sinérgicos:

**Combinaciones populares por objetivo:**

🎯 **Para energía y enfoque diario:**
- GANOCAFÉ 3 EN 1 (mañana) + CÁPSULAS EXCELLIUM (1/día)
- Beneficio: Energía sostenida + claridad mental potenciada

💪 **Para rendimiento físico:**
- GANOCAFÉ CLÁSICO (pre-entreno) + CÁPSULAS CORDYGOLD (1/día)
- Beneficio: Energía + recuperación muscular + resistencia

🛡️ **Para soporte inmune máximo:**
- GANO SCHOKOLADDE (noche) + CÁPSULAS GANODERMA (1/día)
- Beneficio: Doble dosis Ganoderma = soporte inmune superior

🌟 **Para bienestar integral:**
- GANOCAFÉ 3 EN 1 (mañana) + BEBIDA COLÁGENO RESKINE (tarde)
- Beneficio: Energía + belleza desde adentro

**Regla general:**
- Bebidas = Consumo según preferencia (1-3 al día)
- Cápsulas = 1 cápsula diaria (no exceder dosis recomendada)
- No hay interacciones negativas entre productos Gano Excel
- Todos contienen Ganoderma patentado compatible

**Pregunta de seguimiento:** ¿Cuál sería tu objetivo principal: energía, rendimiento, inmunidad, o bienestar integral?

---

## 📦 CATEGORIZACIÓN POR PERFIL

**Para el Profesional Corporativo:**
- LUVOCO (impresiona en casa)
- GANOCAFÉ 3 EN 1 (energía reuniones)
- CÁPSULAS EXCELLIUM (claridad estratégica)

**Para el Atleta/Activo:**
- GANOCAFÉ CLÁSICO (pre-entreno)
- CÁPSULAS CORDYGOLD (recuperación)
- ESPIRULINA GANO C''REAL (nutrición completa)

**Para la Familia Consciente:**
- GANO SCHOKOLADDE (niños y adultos)
- JABÓN GANO (toda la familia)
- CHAMPÚ PIEL&BRILLO (cuidado natural)

**Para el Minimalista Optimizador:**
- CÁPSULAS GANODERMA (máxima concentración)
- Un producto, máximo beneficio

---

**FIN DEL ARSENAL CIENCIA PRODUCTOS**
**Documento:** Beneficios Científicos Ganoderma v2.0
**Fecha:** 17 Noviembre 2025
**Fuentes:** PubMed 2024, Frontiers in Microbiology 2024, Nature Scientific Reports, PMC
**Total de respuestas:** 6 (PROD: 2 + TECH: 4)
**Estado:** Listo para implementación NEXUS',
      metadata = '{"respuestas": 6, "estudios_citados": 8, "fuente": "PubMed_2024"}'::jsonb,
      updated_at = NOW()
    WHERE category = 'productos_ciencia';

    RAISE NOTICE 'Documento productos_ciencia ACTUALIZADO correctamente';
  ELSE
    -- Si no existe, insertarlo
    INSERT INTO nexus_documents (category, title, content, metadata)
    VALUES (
      'productos_ciencia',
      'Beneficios Científicos Ganoderma Lucidum',
      '# Arsenal Conversacional: Beneficios Científicos Ganoderma v2.0

**Propósito:** Respuestas sobre ciencia del Ganoderma Lucidum con respaldo verificable

**Integración:** Complementa arsenal_inicial (oportunidad) y catalogo_productos (precios)

---

## 🌿 PREGUNTAS SOBRE BENEFICIOS (2 respuestas principales)

### PROD_01: "¿Qué beneficios tienen los productos Gano Excel?"

Los productos tienen una ventaja que nadie puede replicar: **proceso de extracción patentado mundialmente** de Ganoderma lucidum.

**¿Por qué importa la patente?**

Mientras otros usan polvo de hongo básico, Gano Excel tiene:
- Extracto 100% hidrosoluble
- 200+ fitonutrientes activos por producto
- 30+ años de investigación científica
- Más de 2,000 estudios en PubMed

**Categorías de productos y beneficios:**

🍵 **Bebidas Funcionales** (cafés, chocolates, tés)
- Energía sostenida sin nerviosismo
- Claridad mental natural
- Soporte sistema inmunológico diario
- Experiencia gourmet con beneficios reales
- Ejemplo: GANOCAFÉ 3 EN 1 ($110,900 COP) - 20 sobres

💊 **Suplementos Concentrados** (cápsulas)
- Máxima concentración de Ganoderma (400mg por cápsula)
- Soporte inmunológico superior (CÁPSULAS GANODERMA)
- Claridad mental y enfoque (EXCELLIUM con nootrópicos)
- Rendimiento atlético (CORDYGOLD con Cordyceps sinensis)
- Suministro 3 meses (90 cápsulas)
- Ejemplo: CÁPSULAS GANODERMA ($272,500 COP)

☕ **Línea Premium LUVOCO**
- Sistema de cápsulas estilo barista profesional
- Café perfecto en casa con tecnología italiana
- 3 intensidades (Suave, Medio, Fuerte)
- 15 bares de presión para extracción óptima
- Máquina: $1,026,000 COP / Cápsulas: $110,900 COP

🧴 **Cuidado Personal Natural**
- Pasta dental sin flúor (GANO FRESH)
- Jabones y champús con Ganoderma
- Beneficios tópicos: anti-inflamatorio, hidratación
- Desde $73,900 COP

**Lo que hace únicos estos productos:**
1. **Patente mundial**: NADIE puede replicarlos
2. **Ciencia real**: 2,847 constructores en 9 años validaron la demanda sostenida
3. **15 países**: Distribución consolidada en toda América
4. **Biodisponibilidad garantizada**: Extracto 100% hidrosoluble vs. polvo convencional

**Pregunta de seguimiento:** ¿Qué categoría de productos resuena más contigo: bebidas diarias, suplementación intensiva, o experiencia premium?

---

### PROD_02: "¿Por qué Ganoderma lucidum es tan especial?"

Ganoderma lucidum (Reishi) es conocido en Asia como "el hongo de la inmortalidad", usado por más de 2,000 años. Pero lo que realmente importa es **lo que dice la ciencia moderna**.

**LO QUE DICE LA CIENCIA (PubMed 2024):**

🔬 **Compuestos bioactivos identificados:**
- **Polisacáridos** (β-D-glucanos, α-D-glucanos, α-D-mannans)
- **Ganoderic Acids** (triterpenoides con 200+ variantes)
- **200+ fitonutrientes activos** en total

🧬 **12 funciones documentadas científicamente:**
1. **Soporte sistema inmunológico** - Estimula macrófagos y células NK
2. **Anti-inflamatorio natural** - Reduce marcadores inflamatorios
3. **Protección hepática** - Hepatoprotección documentada
4. **Neuroprotección** - Soporte salud cerebral
5. **Salud cardiovascular** - Regula presión y lípidos
6. **Balance metabólico** - Mejora sensibilidad insulina
7. **Anti-envejecimiento** - Propiedades antioxidantes
8. **Protección ósea** - Salud esquelética
9. **Microbioma intestinal** - Regula flora bacteriana
10. **Energía celular** - Mejora función mitocondrial
11. **Adaptógeno natural** - Manejo del estrés
12. **Soporte respiratorio** - Salud pulmonar

🌍 **Evidencia científica verificable:**
- **2,000+ estudios** publicados en PubMed (1990-2024)
- **30+ años** de investigación continua
- Estudios en **Nature Scientific Reports**, **Frontiers in Microbiology**, **PMC**
- Meta-análisis sistemáticos con metodología GRADE

**LA DIFERENCIA GANO EXCEL (Crítico entender esto):**

Imagina que tienes granos de café. Puedes:
- **Opción A:** Masticar los granos crudos (baja biodisponibilidad)
- **Opción B:** Tomar un espresso perfectamente extraído (alta biodisponibilidad)

Con Ganoderma es igual:
- **Polvo de hongo convencional:** Tu cuerpo NO puede absorber efectivamente los compuestos (como masticar granos crudos)
- **Extracto patentado Gano Excel:** 100% hidrosoluble = Tu cuerpo absorbe TODOS los compuestos bioactivos (como el espresso perfecto)

El proceso de extracción patentado **rompe las paredes celulares del hongo** y extrae los compuestos en forma hidrosoluble. Esto garantiza biodisponibilidad completa.

**Estudios específicos recientes (2024):**
- **Frontiers in Microbiology:** Efectos positivos en microbioma intestinal
- **Nature Scientific Reports (2018):** Función inmunológica y network biológico
- **PubMed meta-análisis:** Evaluación sistemática de ensayos clínicos
- **PMC estudios 2023-2024:** Salud metabólica y cardiovascular

**IMPORTANTE (Disclaimer):**
Ganoderma lucidum se usa como suplemento alimenticio para apoyo a la salud general, no como medicamento. Los productos Gano Excel son alimentos funcionales. Los beneficios descritos se basan en investigación científica publicada, pero los productos no pretenden diagnosticar, tratar, curar o prevenir ninguna enfermedad.

**Pregunta de seguimiento:** ¿Te interesa conocer más sobre alguna categoría específica: inmunológico, mental, físico o metabólico?

---

## 🔬 PREGUNTAS TÉCNICAS SOBRE GANODERMA (4 respuestas)

### TECH_01: "¿Qué estudios científicos respaldan los beneficios?"

La evidencia científica sobre Ganoderma lucidum es sólida y verificable:

**Bases de datos científicas:**
- **PubMed:** 2,000+ estudios desde 1990
- **PubMed Central (PMC):** Acceso abierto a investigación
- **Nature:** Estudios de alto impacto
- **Frontiers in Microbiology:** Investigación reciente 2024

**Estudios clave destacados:**

1. **"Exploring the Therapeutic Potential of Ganoderma lucidum in Cancer" (PMC 2024)**
   - Documenta efectos en malignidades hematológicas
   - Mecanismos: estimulación inmune, diferenciación celular, apoptosis

2. **"Regulatory effect of Ganoderma lucidum on gut flora" (Frontiers 2024)**
   - Efectos en microbioma intestinal
   - Alivia hiperglucemia, hiperlipidemia, obesidad

3. **"The effect of Ganoderma lucidum extract on immunological function" (Nature Scientific Reports 2018)**
   - Network biológico de función inmune
   - Actividad anti-tumor immunostimulante

4. **"Research Progress on Ganoderic Acids" (PMC 2024)**
   - Últimos 5 años de investigación
   - 12 funciones biológicas documentadas

**Cómo verificar:**
Puedes buscar en PubMed.gov usando: "Ganoderma lucidum", "Reishi mushroom", "Ganoderic acid"

**Pregunta de seguimiento:** ¿Te gustaría que te compartiera enlaces a estudios específicos sobre algún beneficio en particular?

---

### TECH_02: "¿Es seguro consumir Ganoderma diariamente?"

Sí, Ganoderma tiene un perfil de seguridad excelente respaldado por evidencia:

**Seguridad documentada:**
- Uso tradicional: 2,000+ años en medicina china sin toxicidad reportada
- Estudios modernos: Perfil de seguridad confirmado en ensayos clínicos
- Efectos secundarios: Raros y generalmente leves (malestar digestivo leve en <5% usuarios)

**Contraindicaciones a considerar:**
- **Anticoagulantes:** Consultar médico (Ganoderma tiene propiedades antitrombóticas)
- **Inmunosupresores:** Consultar médico (Ganoderma estimula sistema inmune)
- **Cirugía programada:** Suspender 2 semanas antes (por efecto anticoagulante)
- **Embarazo/lactancia:** Uso no estudiado extensivamente, consultar médico

**Dosis recomendadas:**
- Bebidas: 1-2 sobres diarios (consumo regular)
- Cápsulas concentradas: 1 cápsula diaria con alimentos
- No hay evidencia de toxicidad por sobredosis en rangos normales

**Pregunta de seguimiento:** ¿Tienes alguna condición médica específica que te preocupe respecto al consumo de Ganoderma?

---

### TECH_03: "¿Cuánto tiempo toma notar los beneficios?"

Los beneficios de Ganoderma operan a diferentes niveles y tiempos:

**Efectos tempranos (Días a 2 semanas):**
- Mayor energía sostenida (sin picos de cafeína)
- Claridad mental y enfoque
- Mejor calidad de sueño
- Sensación general de bienestar

**Efectos de mediano plazo (4-8 semanas):**
- Soporte inmunológico (menos resfriados)
- Mejora digestión y regulación
- Balance energético estable
- Reducción inflamación percibida

**Efectos de largo plazo (3-6 meses):**
- Fortalecimiento sistema inmune sostenido
- Balance metabólico (glucosa, lípidos)
- Mejora marcadores de salud en análisis
- Beneficios acumulativos adaptogénicos

**Importante entender:**
Ganoderma NO es un estimulante (no sentirás un "rush" inmediato). Trabaja a nivel celular, apoyando sistemas del cuerpo de forma gradual y sostenible. Es como ir al gimnasio: los beneficios se acumulan con consistencia.

**Factor clave: Consistencia**
El uso diario consistente es crucial. Los compuestos bioactivos necesitan alcanzar niveles sostenidos en el organismo.

**Pregunta de seguimiento:** ¿Qué tipo de beneficios específicos estás buscando: energía diaria, soporte inmune, claridad mental, o salud metabólica?

---

### TECH_04: "¿Puedo combinar diferentes productos Gano Excel?"

¡Absolutamente! De hecho, combinar productos puede crear efectos sinérgicos:

**Combinaciones populares por objetivo:**

🎯 **Para energía y enfoque diario:**
- GANOCAFÉ 3 EN 1 (mañana) + CÁPSULAS EXCELLIUM (1/día)
- Beneficio: Energía sostenida + claridad mental potenciada

💪 **Para rendimiento físico:**
- GANOCAFÉ CLÁSICO (pre-entreno) + CÁPSULAS CORDYGOLD (1/día)
- Beneficio: Energía + recuperación muscular + resistencia

🛡️ **Para soporte inmune máximo:**
- GANO SCHOKOLADDE (noche) + CÁPSULAS GANODERMA (1/día)
- Beneficio: Doble dosis Ganoderma = soporte inmune superior

🌟 **Para bienestar integral:**
- GANOCAFÉ 3 EN 1 (mañana) + BEBIDA COLÁGENO RESKINE (tarde)
- Beneficio: Energía + belleza desde adentro

**Regla general:**
- Bebidas = Consumo según preferencia (1-3 al día)
- Cápsulas = 1 cápsula diaria (no exceder dosis recomendada)
- No hay interacciones negativas entre productos Gano Excel
- Todos contienen Ganoderma patentado compatible

**Pregunta de seguimiento:** ¿Cuál sería tu objetivo principal: energía, rendimiento, inmunidad, o bienestar integral?

---

## 📦 CATEGORIZACIÓN POR PERFIL

**Para el Profesional Corporativo:**
- LUVOCO (impresiona en casa)
- GANOCAFÉ 3 EN 1 (energía reuniones)
- CÁPSULAS EXCELLIUM (claridad estratégica)

**Para el Atleta/Activo:**
- GANOCAFÉ CLÁSICO (pre-entreno)
- CÁPSULAS CORDYGOLD (recuperación)
- ESPIRULINA GANO C''REAL (nutrición completa)

**Para la Familia Consciente:**
- GANO SCHOKOLADDE (niños y adultos)
- JABÓN GANO (toda la familia)
- CHAMPÚ PIEL&BRILLO (cuidado natural)

**Para el Minimalista Optimizador:**
- CÁPSULAS GANODERMA (máxima concentración)
- Un producto, máximo beneficio

---

**FIN DEL ARSENAL CIENCIA PRODUCTOS**
**Documento:** Beneficios Científicos Ganoderma v2.0
**Fecha:** 17 Noviembre 2025
**Fuentes:** PubMed 2024, Frontiers in Microbiology 2024, Nature Scientific Reports, PMC
**Total de respuestas:** 6 (PROD: 2 + TECH: 4)
**Estado:** Listo para implementación NEXUS',
      '{"respuestas": 6, "estudios_citados": 8, "fuente": "PubMed_2024"}'::jsonb
    );

    RAISE NOTICE 'Documento productos_ciencia INSERTADO correctamente';
  END IF;
END $$;

-- ========================================================
-- VERIFICACIÓN POST-INSERCIÓN
-- ========================================================

-- Verificar que el documento se insertó correctamente
SELECT
  id,
  category,
  title,
  LENGTH(content) as content_length,
  metadata,
  created_at,
  'DOCUMENTO INSERTADO CORRECTAMENTE' as status
FROM nexus_documents
WHERE category = 'productos_ciencia'
ORDER BY created_at DESC
LIMIT 1;

-- ========================================================
-- NOTAS IMPORTANTES:
-- ========================================================
-- 1. Este es el 5to documento en la base de conocimiento
-- 2. Complementa catalogo_productos (que tiene precios)
-- 3. Enfocado en ciencia y beneficios del Ganoderma
-- 4. route.ts debe actualizarse para clasificar consultas a esta categoría
-- 5. System prompt v12.0 debe mencionar este documento
-- ========================================================
