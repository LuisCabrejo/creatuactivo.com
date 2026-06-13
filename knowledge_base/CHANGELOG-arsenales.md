# Changelog — Arsenales Queswa

Historial doctrinal de los arsenales (tenant `creatuactivo_marketing` salvo nota explícita). Extraído del cuerpo de CLAUDE.md a partir del 23 May 2026 para reducir overhead de tokens — un agente nuevo solo necesita la versión *actual* + la *previa*; el historial completo vive aquí.

Cada arsenal vive en `knowledge_base/<nombre>.txt`. Deploy:
- Actualizar todo el documento: `node scripts/deploy-arsenal-<nombre>.mjs`
- Solo re-fragmentar cambios puntuales: `node scripts/actualizar-fragmentos-modificados.mjs`
- Fragmentos Master con `<verbatim_lock>` (WHY_01/WHY_02/EAM_01): `node scripts/actualizar-fragmentos-master-v25.7.mjs`
- Cambios específicos al cierre (FREQ_03 + purgar CIERRE_01/02): `node scripts/actualizar-fragmentos-cierre-v5.2.mjs`

---

## arsenal_inicial

### v5.10 — Villano narrado sin atacar el esfuerzo: WHY_01 + WHY_02 (12 jun 2026)

WHY_02 (chip 1) y WHY_01 reescritos para reubicar el villano. Fundamento: investigaciones `El Statu Quo_ Anatomía y Escape` + `Léxico CreaTuActivo_ Comprensión y Duplicabilidad` — atacar la "dependencia del trabajo" / la presencia obligada genera disonancia en el latino promedio, que valora su empleo como digno. El villano correcto es el **sistema de asfixia mensual** (vejez sin pensión, edadismo, deuda), narrado sin etiqueta abstracta.

- **WHY_02**: abre con reencuadre ("destapemos el verdadero problema") + reconocimiento del esfuerzo ("Usted trabaja duro, entrega sus mejores años y su salud"). Nombra Gano Excel + productos + "toda América" + "dirige desde su celular". Pilares presentados como alivio entregado (infraestructura/tecnología/método ya construidos). Se eliminó el villano "depende de su presencia". Léxico: "Operar" → "Llevar" (regla operar/operador).
- **WHY_01**: apertura reconoce el esfuerzo antes de la vulnerabilidad ("Usted ha trabajado duro y ha hecho las cosas bien. Aun así…"); "ingresos que no dependen de su trabajo físico" → "que siguen produciendo aunque usted no esté presente".

Sincronizado carácter por carácter con `src/lib/respuestas-maestras.ts` (MASTER_WHY_02). ⏳ Deploy a Supabase + re-fragmentar pendiente.

### v5.9 — Swap "empresa digital" (12 jun 2026)

El activo que entregamos: "negocio digital" → **"empresa digital"** (decisión Luis, alineado con Home v13.6 — eleva el estatus de propiedad). Concordancias de género corregidas. Se conserva "negocio" en el chip canónico ("¿Cómo funciona el negocio?"), en el negocio actual del prospecto y en "Centro de Negocios" (Binario). WHY_02 re-sincronizado con `respuestas-maestras.ts`.

### v5.8 — Swap léxico "negocio digital" (jun 2026, HANDOFF_AGENTE_LEXICO_ARSENALES.md)

"Base Operativa" → **"negocio digital"** (a secas — NO "de Gano Excel": la corona es de CreaTuActivo; Gano Excel solo se nombra como Respaldo Operativo / Pilar 1). Rol "Propietario de Base Operativa" → "Propietario". `operar/operador` del usuario/sistema → dirige/funciona/trabaja (se conserva "opera" de Gano Excel). `escalar` → **multiplicar** (incl. aforismo "Queswa multiplica"). Conservado: lema de Luis "soberanía financiera" en STORY_01. 48 fragments.

### v5.7 — Recalibración a Registro Accesible (Beto) (jun 2026)

WHY_01, WHY_02 y EAM_01 reescritos al léxico accesible: "Estructura Patrimonial" → estructura de ingresos recurrentes · "La Matriz Física" → El Respaldo Operativo · "El Tridente EAM" → El Método Comprobado · "Arquitecto de Patrimonio" → Propietario. WHY_01 con concepto nuclear modelo Waze + vulnerabilidad en autopersuasión ("un mes que no pueda trabajar, un despido… y en cuestión de meses sus bienes son más del banco que suyos"). Villano narrado sin etiqueta (NuBank). Camino A sincronizado.

### v5.6 / v5.6.1 — 4 nuevas FREQ + 2 nuevas COMP (tasa Gano, VIP, familia, back office, inscripción, 50 PV) (29 May 2026)

Causa: meta-auditoría del chat real identificó 7 gaps prioritarios. 4 aplicados en arsenal_inicial + 2 en arsenal_compensacion. Un pendiente (COMP_CV_02 sobre PVP) descartado tras audit — PV/CV/GCV ya cubiertos por COMP_PV_01/04/05 + COMP_CV_01.

**Nuevas respuestas en arsenal_inicial:**
- **FREQ_23** *"¿A qué tasa me paga Gano Excel?"* — tasa FIJA $4,500 COP/USD vigente independiente de TRM. Cierra malentendido "$1,000 USD a tasa de mercado = $3,631,020 COP" — la realidad es $4,500,000 COP. Ventaja estructural en contextos de devaluación.
- **FREQ_24** *"¿Cómo inscribo un Consumidor VIP?"* — proceso idéntico a Arquitecto. Documentos (ID/email/dirección/contacto). Canales (línea CO 018000 184266 / fija (601) 742 3399 / oficinas / back office). Formulario físico con presentador o digital enviado al correo tras finiquitar pago.
- **FREQ_25** *"¿El consumo familiar cuenta?"* — sí, abrir códigos VIP a familia directa (cónyuge/hijos/padres). Consumo familiar = CV al Centro de Negocios de Cobro. Upgrade futuro a Arquitecto posible.
- **FREQ_26** *"¿Back office vs Queswa.app?"* — distinción clave. Back office = sistema administrativo Gano Excel universal. Queswa.app = Centro de Mando exclusivo CreaTuActivo.com (Luis Cabrejo Parra + Liliana Patricia Moreno). El primero gestiona, el segundo orquesta.

**Nuevas respuestas en arsenal_compensacion:**
- **COMP_VIP_01** *"¿VIP requiere paquete / compras mensuales?"* — NO a ambas. Activación con 50 PV iniciales. Sin recompra mensual obligatoria. Sugerencia: mínimo 1 producto cada 5 meses para mantener cuenta operativa. Diferencia operativa explícita con Arquitecto (50 PV mensuales para conservar derecho de cobro de comisiones).
- **COMP_PV_08** *"¿Qué productos para mis 50 PV mensuales?"* — portado desde INV_06 (arsenal_12_niveles, vigente 2026). 4 opciones de combinación (café solo / café + suplemento / suplementos / mix) + tabla PV/CV oficial por producto. Resuelve el gap del chat principal que antes solo tenía la tabla en arsenal_12_niveles (no recuperable desde chat creatuactivo.com).

**Pendientes auditados y descartados:**
- COMP_CV_02 (CV vs precio) — NO crear. Auditoría confirmó que PV/CV/GCV ya están completamente cubiertos por COMP_PV_01/04/05 + COMP_CV_01 + COMP_PV_07. La distinción CV vs precio se mantiene implícita en COMP_BIN_11 sin necesidad de respuesta dedicada.

**Versiones finales tras v5.6.1:** arsenal_inicial 48 fragments + arsenal_compensacion 41 fragments = 89 respuestas en producción. Total Supabase: 179 fragments.

### v5.5 — Anti-alucinación Binario, 3 nuevas FREQ (personas/bases/VIP), banco aperturas (29 May 2026)

Causa: feedback de campo (Director Cabrejo) identificó tres focos:
1. Queswa improvisó tabla con encabezado *"Personas/Lado"* en respuesta de Binario — alucinación que refuerza paradigma MLM tradicional ("ganas por meter gente").
2. Repetición de la apertura *"Con gusto"* sonaba a guion comercial; necesitaba banco de aperturas para variar.
3. Errores semánticos repetidos por agentes Claude: *"paga 17% sobre el centro de negocios de cobro"* → el usuario malinterpreta como "17% sobre $100M de venta = $17M". La forma correcta es *"17% del GCV sobre el Centro de Negocios de Cobro"*. Y al decir *"ganas por consumo de Bases Operativas"*, muchos asumen que NO ganan por consumidores VIP que solo compran producto.

**Cambios léxicos en system prompt (v27.2):**
- *"Hoy analicemos las dos principales"* → *"Su Base Operativa genera ganancias en 12 velocidades que cubren su flujo de corto, mediano y largo plazo. Analicemos dos:"* (sincronizado con FREQ_04 verbatim_lock del arsenal). Doctrina: "las dos principales" implica jerarquía falsa sobre las otras 10.
- *"pierna débil/fuerte"* → *"Centro de Negocios de Cobro"* / *"Centro de Negocios de Mayor Tracción"* (doctrina canónica arsenal_compensacion:1010).
- *"17% sobre la pierna débil"* → *"17% del GCV sobre el Centro de Negocios de Cobro"* (el GCV vs PVP es la distinción clave).
- Nuevo banco de aperturas Lujo Clínico humano: *Claro / Por supuesto / Entiendo / Excelente / OK / Comprendo / De acuerdo* — antipatrón documentado: NUNCA empezar siempre con *"Con gusto"*.

**Cambios anti-alucinación en route.ts (getTablasComisiones):**
- Tabla Binario blindada con encabezado canónico *"Rentabilidad sobre GCV del Centro de Negocios de Cobro"*.
- Prohibición ABSOLUTA: nunca generar tablas con *"Personas/Lado"* — alucinación reincidente del modelo. Unidad correcta: *"Bases Operativas"*.
- Si el usuario pide proyección concreta, contextualizar estimado: *"con consumo de 4 cajas Ganocafé por Base Operativa por mes"*.
- USD + COP SIEMPRE entre paréntesis. Tasa Gano Excel fija: $1 USD = $4,500 COP (NO tasa de mercado).

**3 nuevas respuestas en arsenal_inicial:**
- **FREQ_04_PERSONAS** *"¿Gano Excel paga por meter personas?"* — filtro doctrinal anti-MLM tradicional. NO premia inscripciones; premia movimiento de inventario.
- **FREQ_04_BASES** *"¿Las ganancias son generadas únicamente por las Bases Operativas?"* — aclara que cada Base Operativa contiene Arquitectos Y Consumidores VIP. El sistema audita el consumo TOTAL.
- **FREQ_04_VIP** *"¿Qué es un Consumidor VIP?"* — define perfil (acceso a precio distribuidor sin compromiso de desarrollo). El usuario gana por su consumo recurrente igual que por el de un Arquitecto.

**Nueva respuesta en arsenal_compensacion:**
- **COMP_BIN_LIQUIDACION** *"¿Cómo liquida Gano Excel las comisiones binarias?"* — explica la matemática real: GCV (Volumen Comisionable Grupal) del Centro de Negocios de Cobro × porcentaje del paquete/rango activo. Tabla de orígenes de % (ESP-1/2/3 + escala de rangos Bronce-Diamante + promociones corporativas).

**Frontend (NEXUSWidget.tsx):**
- Custom `hr` component agregado al ReactMarkdown: `my-6` (24px vertical) + borde sutil. El default `<hr>` del browser dejaba el texto siguiente "pegado" al separador, rompiendo la respiración del Lujo Silencioso.

Doctrina aplicada: **cuando se detectan errores repetidos del modelo, no basta con ajustar el system prompt — hay que añadir respuestas explícitas al arsenal**. Las preguntas que el usuario va a hacer N veces deben tener fragment dedicado en el RAG, para que el modelo recupere doctrina verificada en lugar de improvisar.

### v5.4 — UX (FREQ_02 + FREQ_06), híbrido contextual de voz Queswa, limpieza léxico residual (24 May 2026)

Causa: feedback de campo identificó (a) respuestas demasiado técnicas en FREQ_02 y FREQ_06; (b) disonancia conversacional por uso sistemático de tercera persona ("Queswa hace X") cuando el agente habla con el usuario; (c) léxico residual no purgado en v5.3 (plusvalía, ancho de banda, vector); (d) inconsistencia "global" cuando se refiere al activo del usuario vs descripción factual de Gano Excel.

**Cambios:**

**FREQ_02 — reescrita completa** (sugerencia Gemini): Los 3 modos de tráfico ahora son "**Conexión Directa / Conexión Asistida / Conexión Automatizada**" en lugar de "Modo Relacional / Híbrido / Escalabilidad". Los nuevos nombres son auto-explicativos (cada uno indica QUÉ hace), eliminan "vector de tráfico"/"inyección de prospectos"/"protocolo de evaluación", y resuelven la inconsistencia con el header (que pregunta por "Análoga, Híbrida y Digital").

**FREQ_06 — reescrita completa**: elimina "Plusvalía Estructural" (→ "Ventaja Estructural"), "ancho de banda en la Dirección" (→ "disponibilidad de la Dirección"), "calibración personalizada" (→ "acompañamiento directo"). Nueva pregunta de cierre proyecta el "impacto financiero de asegurar esta posición de ventaja". Fecha corregida a "lunes 25 al domingo 31 de mayo" (ventana operativa real, no la histórica "04 al 09").

**Híbrido contextual de voz Queswa — doctrina de 3 niveles** (decisión arquitectónica documentada en CLAUDE.md):
- **Nivel 1 — Aforismos canónicos**: tercera persona PRESERVADA ("Usted no explica — Queswa explica", "Usted no enseña; Queswa escala"). Son frases-marca; cambiarlas rompe su fuerza retórica.
- **Nivel 2 — Sustantivos/componentes**: tercera persona PRESERVADA ("Centro de Mando Queswa", "Academia Queswa", "plataforma Queswa", "Pilar 2 (Queswa)" en referencias arquitectónicas). Son nombres propios o nombran componentes del ecosistema.
- **Nivel 3 — Acciones del agente AHORA**: CAMBIO a primera persona ("yo proceso", "yo asumo", "yo opero"). Antes el agente decía "Queswa filtra"; ahora dice "yo filtro".

Razón doctrinal: la disonancia conversacional ("¿acaso él no es Queswa?") quema atención del usuario. La regla híbrida resuelve la disonancia en chat sin perder la fuerza de los aforismos ni la precisión de los nombres propios. Aplicada a 9 instancias cross-arsenal: arsenal_inicial (5 cambios incluyendo WHY_01 verbatim_lock L34 + FREQ_01 L123 + FREQ_02 L153 + FREQ_04 L197 + DIASPORA L642), arsenal_avanzado (4 cambios L17, L69, L244, L246). arsenal_reto y respuestas-maestras.ts no requirieron cambios (ya alineados).

**Limpieza léxico residual:**
- "plusvalía" → "ventaja"/"valor patrimonial" según contexto (arsenal_avanzado:233 + arsenal_reto:32)
- "ancho de banda" → "disponibilidad"/"agenda" según contexto (4 instancias: arsenal_inicial L350, L437, L463 + arsenal_reto L55)
- "vector de tráfico"/"vector de adquisición" → absorbido en reescritura de FREQ_02 ("camino de expansión"/"ruta")
- "global" → "internacional" solo cuando refiere al activo del usuario (consumo internacional, Base Operativa internacional). "global" PRESERVADO cuando describe factualmente Gano Excel (70 países, distribución global) o el despliegue público del 1 de junio.

**Catálogo Bilingüe Verbal:**
- Cuando se hable de **acciones del agente conversacional**, usar primera persona ("yo")
- Cuando se citen **aforismos doctrinales**, mantener tercera persona ("Queswa")
- Cuando se nombren **componentes con nombre propio** (Centro de Mando Queswa, queswa.app, Academia Queswa, "Pilar 2 (Queswa)"), mantener tercera persona

### v5.3 — Propagación al backend dictador + léxico "arquitectura actual" → "modelo de ingresos" (24 May 2026)

Causa: el backend dictador en `route.ts` Estado 2 informativo (texto verbatim que se imprime cuando el usuario pide "háblame de los paquetes" en modo informativo) seguía usando vocabulario v5.1 prohibido — "Asignación de Capital para la Activación de Infraestructura", "tecnología nutricional", "apalancamiento asimétrico máximo". La purga v5.2 limpió el arsenal pero **no propagó al backend**, así que el modelo imprimía el preámbulo viejo verbatim.

**Cambios:**
- **`route.ts` Estado 2 informativo** (`getMicroPromptCierre` con `modoCierre=false`): preámbulo simple + bullets ESP simplificados ("Apalancamiento estratégico" sin "asimétrico/máximo") + pregunta de cierre canónica nueva.
- **`route.ts` Tabla Binario** (`getTablasComisiones`): eliminada columna técnica `CV × % × $1` (fricción innecesaria) + eliminada fila "Kit Inicio". Solo Paquete + Rentabilidad %. La fórmula técnica se sirve únicamente si el usuario pregunta "¿cómo se calcula la comisión semanal?".
- **PERFIL_01**: "su arquitectura actual" → "su modelo de ingresos".
- **OBJ_02 pregunta de cierre**: nueva canónica "¿Cuál de estas tres opciones (ESP-1/2/3) se alinea mejor con la liquidez que desea inyectar a su Estructura Patrimonial este mes?".
- **FREQ_04 (Doble Velocidad)**: "matemática" / "proyección estructural" → "(cómo se genera la liquidez semanal)" / "(cómo se consolida el flujo recurrente)".
- **FREQ_03 verbatim_lock**: (a) eliminada frase "No existen cuotas de inscripción ni cobros por afiliación" — en México sí hay un cobro de afiliación pequeño (~$10 USD); afirmar lo contrario es impreciso. (b) Pregunta de cierre alineada a la canónica de OBJ_02.
- **Limpieza léxico v5.2 residual**: 6 instancias de "tecnología nutricional" en `arsenal_inicial.txt` + 1 en `arsenal_avanzado.txt` → "productos físicos" / "bebidas enriquecidas y suplementos Gano Excel" / "este mercado" según contexto.
- **Afirmaciones "100%" eliminadas en CRED_04 y OBJ_02**: "El 100% de los fondos se transfiere" → "Su capital se transfiere a productos físicos". Mismo razonamiento que la regla México (cobros pequeños existentes; afirmar 100% genera riesgo de inconsistencia auditable).

Doctrina aplicada: **el backend dictador es la fuente de verdad ejecutable**. Si el arsenal tiene léxico v5.2 pero el backend imprime verbatim v5.1, el usuario ve v5.1. Cada vez que se purga vocabulario del arsenal, hay que auditar `route.ts` por reaparición en bloques `getMicroPromptApertura/Cierre/Estado4` y en las strings de inyección "📊 FORMATO TABLA".

### v5.2 — Cierre simplificado (22 May 2026, paralelo a system prompt v27.1)

Causa: ante "¿cómo se inicia?" el modelo alucinaba "equipo de Dirección Estratégica con disponibilidad de inventario en su zona" (texto inexistente en el arsenal); paralelamente CIERRE_01 aún disparaba el Klaff Prize Frame "7-10 horas semanales" — código zombi de antes de Opción B.

**Cambios:**
- **FREQ_03** reescrito con copy v5.2 + `<verbatim_lock>` para delivery exacto.
- Triggers ampliados: absorbe "cómo se inicia / quiero empezar / cómo me uno / cuáles son los pasos" además de los originales.
- Vocabulario simplificado: fuera "Asignación de Capital", "apalancamiento estratégico máximo", "tecnología nutricional"; adentro "su capital se convierte en los productos físicos" (sin afirmar 100% — no siempre exacto).
- Datos tangibles por nivel: productos + Binario + GEN5 (anchoring ESP-3 primero).
- **CIERRE_01 eliminado** del arsenal (Klaff Prize Frame BANT horas, contrario a Opción B).
- **CIERRE_02 eliminado** del arsenal (follow-up del Estado 1, ya no existe).
- BLOQUE CIERRE: header "4 respuestas" → "2 respuestas" + nota operativa que documenta el colapso.

Doctrina aplicada (insight del Director Cabrejo): *"el arquitecto no puede precipitar el cierre pero debe esperar que pase, y cuando pasa los procesos son sencillos"*. Cuando el prospecto pregunta cómo se inicia se sirven los 3 niveles + pregunta de selección, el FSM avanza a Estado 3 (nombre) y Estado 4 (warm handoff automático). Sin entrevista BANT prematura.

### v25.9 — Markdown enriquecido en chips canónicos (19 May 2026)

WHY_02 + EAM_01 reescritos con numeración explícita (1./2./3.), negritas en frases-ancla, cursivas en reencuadres psicológicos, separador `---` antes del cierre. Sincronizado con system prompt v26.9 (nueva sección "RECURSOS DE LEGIBILIDAD COGNITIVA").

### v25.8 — Migración XML verbatim_lock (18 May 2026)

`[VERBATIM_LOCK]...[/VERBATIM_LOCK]` → `<verbatim_lock>...</verbatim_lock>` en WHY_01, WHY_02, EAM_01. Razón: investigación Gemini Hipótesis C confirmó que Claude Sonnet 4.6 reconoce XML tags como señal de máxima prioridad post-entrenada; los corchetes planos son texto inerte. Paralela a system prompt v26.8.

### v25.7 — Respuestas Master del Director Académico (18 May 2026)

WHY_01, WHY_02, EAM_01 calibrados al estándar Director Académico de Élite (v5.0/v6.0/v5.1). Preservan recategorizaciones v25.3 (Pilar 3 = Metodología Automatizada) + v25.5 (jerarquía causal Modelo→Inestabilidad→Déficit).

### v25.6 — DIASPORA + verbos paridad (Abr 2026)

Bloque DIASPORA_01-03 (latinos en USA/Europa), verbos de paridad ("dirige", "orquesta", "ejecuta") aplicados en WHY_02 y CIERRE_03. Cifra cupos Fundadores 15.

### v25.5 — Jerarquía causal corregida (17 May 2026)

WHY_01 + STORY_01 + PERFIL_01 reescriben Déficit Estructural de Ingresos como CAUSA RAÍZ (no consecuencia). Modelo de presencia obligada = MANIFESTACIÓN. Sincronizado con system prompt v26.6.

### v25.3 — Pilar 3 recategorizado (15 May 2026)

WHY_02 reescrito: Pilar 3 = La Metodología Automatizada (El Tridente EAM), no "Su Rol como Arquitecto de Patrimonio". El Arquitecto queda elevado como director de los 3 pilares. Sincronizado con system prompt v26.5.

---

## arsenal_avanzado

### v10.0 — ADV_VAL_05 + Tridente Comandos (May 2026)

Nueva respuesta ADV_VAL_05 (incentivos corporativos Gano Excel). METH_01 con Comandos canónicos del Tridente EAM (Expandir/Activar/Maestría + aforismos). Patrimonio Paralelo en OBJ_02. Queswa nombrado en OBJ_01. USD/COP unificado VAL_01/VAL_04. ADV_TECH_03 con "Queswa, el Centro de Mando" + "sistemas de contingencia" (Capas — no Pilares). ADV_SIST_02 "Infraestructura Continental". ADV_SIST_03 reordenado.

---

## arsenal_reto (Auditoría Patrimonial)

### v4.1 — Arquitecto de Patrimonio (May 2026)

7 respuestas calibradas: Arquitecto de Patrimonio, jerarquía causal Protocolo→Inestabilidad→Déficit, Pilares 1/2 en Día 3, Base Operativa digital.

---

## arsenal_compensacion

### v6.4 — Cobertura geográfica canónica (22 May 2026)

Nueva sección "REGLA CANÓNICA: COBERTURA GEOGRÁFICA" (70 países Gano Excel vs 15 países operativos CreaTuActivo). COMP_MODELO_01 corregido: "cualquier país" → "cualquiera de los 15 países operativos de América". COMP_PAQ_01 con Insight "NUNCA digas 'X meses de GEN5'" — corrige confusión entre duración Binario y GEN5.

### v6.2 — Doble velocidad + organización (May 2026)

Capitalización Inmediata (GEN5) / Renta Vitalicia (Binario). "Su organización" reemplaza "su equipo/red". Arquitectos de Patrimonio. Analogía del Acueducto eliminada. COMP_MODELO_01 "Monetización de Doble Velocidad".

**⚠️ NO modificar vocabulario ni cifras** sin autorización explícita — son cifras matemáticas del plan, no copy editorial.

---

## catalogo_productos

### v7.2 — Verbatim lock en tablas + PROD_OVERVIEW (22 May 2026)

Causa: ante "¿Cuál es el producto?" Queswa alucinaba nombres simplificados ("Ganotea" en lugar de **Oleaf Gano Rooibos**, "Gano Cocoa" en lugar de **Gano Schokolade**, "Gano Supreme" inexistente, "Ganocafé Negro" en lugar de **Ganocafé Clásico**) y omitía la categoría completa de **Suplementos** (mencionando solo 2 de 4 categorías reales).

Diagnóstico: el catálogo SÍ estaba fragmentado (25 fragments en Supabase + doc maestro de 17,664 chars). La nota previa en CLAUDE.md decía que "no está fragmentado" — era falsa. El problema real: las tablas canónicas no tenían `<verbatim_lock>`, así que el modelo parafraseaba con nombres simplificados aunque tuviera la tabla exacta en contexto.

**Cambios v7.2:**
- **PROD_OVERVIEW (NUEVO)**: vista global de las 4 categorías canónicas en `<verbatim_lock>` — responde "vista general del portafolio", "categorías de productos", "¿cuál es el producto?". **Crítico: NUNCA omitir Suplementos ni LUVOCO.**
- **BEB_01**: tabla 9 bebidas envuelta en `<verbatim_lock>` + triggers ampliados ("productos", "bebidas") + nota explícita de productos inexistentes (Ganotea/Gano Cocoa/Ganocafé Negro).
- **LUV_01**: tabla sistema LUVOCO (4 productos) en `<verbatim_lock>`.
- **SUP_01**: tabla 3 suplementos en `<verbatim_lock>` + nota "es 1 de 4 categorías — NUNCA omitir" + aclaración "no existe Gano Supreme".
- **PERS_01**: tabla 6 cuidado personal en `<verbatim_lock>`.

Deploy: `node scripts/actualizar-fragmentos-catalogo-v7.2.mjs`. 5/5 fragments actualizados con embeddings duales (voyage-large-2 + voyage-3-lite) y `metadata.is_fragment = true`.

**Bug pendiente parcial:** CV/PV todavía faltantes en respuestas individuales por producto (PROD_*, BEB_02-06). Ver `public/investigaciones/HANDOFF-QUESWA-PRECIOS-CVPV.md`.

### v7.0 — Lujo Clínico (Abr 2026)

22 productos + ciencia (Ganoderma Lucidum, Cordyceps), audiencia premium pan-americana. ~20KB total. Estructura por categorías: Bebidas funcionales (9), LUVOCO (4), Suplementos (3), Cuidado Personal (6).

---

## arsenal_marca_personal (tenant `marca_personal`)

### v1.1 — Calibración Luis Cabrejo (Abr 2026)

11 respuestas: QUIEN, HIST, VISION, METOD, ACTIVO, OBJ, CONTACTO. Para `luiscabrejo.com`.

---

## arsenal_ganocafe (tenant `ecommerce`)

### v1.5 — Alias coloquiales (Mar 2026)

16 respuestas (PROD_01–07, BENE, COMPRA, OBJ_GC, NEGOCIO, CODIGO). Para `ganocafe.online` (piloto Google Ads).

⚠️ El system prompt `ganocafe_main` tiene catálogo de precios hardcodeado. Al cambiar precios en el arsenal, **también** actualizar el system prompt con `node scripts/actualizar-system-prompt-ganocafe-v1.3.mjs`. Deben estar sincronizados.

---

## arsenal_12_niveles

### Mayo 2026 — Aforismo Tridente canónico

Línea 164: aforismo corregido a "Usted no explica — Queswa explica". 13 fragmentos re-embebidos con voyage-large-2 + voyage-3-lite.

---

## Versiones anteriores

Para historial pre-v25.3, consultar `git log -- knowledge_base/<arsenal>.txt`. Las versiones explícitas tienen tag de fecha; las implícitas se infieren del commit.
