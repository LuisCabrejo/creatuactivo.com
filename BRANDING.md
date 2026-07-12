# BRANDING.md — Sistema de Diseño CreaTuActivo

Parámetros canónicos de marca. Consolidado de la investigación "Diseño de Branding Premium Institucional" + la implementación viva en [src/lib/branding.ts](src/lib/branding.ts) y [src/app/globals.css](src/app/globals.css). **Este es el documento de referencia; las investigaciones crudas se archivaron.**

Filosofía: **"Quiet Luxury / Lujo Clínico meets Private Equity"** — el sitio debe verse como una firma de inversión de alta gama, no como un MLM. Autoridad por restricción, claridad arquitectónica, precisión matemática. El lujo genuino susurra desde una posición de supremacía; no grita.

---

## 1. Paleta cromática (Sistema Bimetálico)

Tokens en `:root` de [globals.css](src/app/globals.css). **Nunca hex hardcoded** — usar siempre la variable CSS.

### Fondos (elevación por luminancia, no por sombras)
| Token | Hex | Uso |
|-------|-----|-----|
| `--color-bg-primary` | `#0F1115` | Carbón Profundo — canvas raíz |
| `--color-bg-elevated` | `#15171C` | Carbón Brillante — un nivel arriba |
| `--color-bg-surface` | `#1A1D23` | Obsidian — cards |

### Marca — Dorado Champán (EL PREMIO, máx 10-20% del lienzo)
| Token | Hex | Uso |
|-------|-----|-----|
| `--color-brand` | `#C5A059` | CTAs, dinero, logros, títulos clave |
| `--color-brand-hover` | `#D4AF37` | Estados hover |
| `--color-brand-muted` | `#B38B59` | Texto bronce secundario |

### Titanio (LA ESTRUCTURA)
| Token | Hex | Uso |
|-------|-----|-----|
| `--color-titanium` | `#94A3B8` | Iconos activos, navegación |
| `--color-titanium-muted` | `#878681` | Iconos inactivos, labels |
| `--color-titanium-dark` | `#475569` | Líneas sutiles, divisores |

### Texto (titanio claro cálido — evita el resplandor del #FFF puro)
| Token | Hex | Uso |
|-------|-----|-----|
| `--color-text-primary` | `#E0DFDB` | Títulos |
| `--color-text-body` | `#C8C7C2` | Cuerpo |
| `--color-text-muted` | `#878681` | Secundario |

### Semánticos (desaturados — sin neón sobre carbón)
| Token | Hex | Significado |
|-------|-----|-------------|
| `--color-success` | `#408A71` | Verde salvia |
| `--color-error` | `#9E2A3A` | Carmesí profundo |
| `--color-warning` | `#C6A76B` | Ámbar |

**Acento data exclusivo servilleta:** Cyan `#22D3EE` (labels técnicos, líneas REF).

---

## 2. Tipografía

Fuentes cargadas en [layout.tsx](src/app/layout.tsx) vía `next/font/google`: **Playfair Display, Inter, Roboto Mono**. Cualquier otra (Rajdhani, Oswald, Söhne, Financier, Montserrat) hace fallback al sistema → usar siempre los tokens.

| Token | Familia | Rol |
|-------|---------|-----|
| `var(--font-sans)` | Inter | Estructura, datos, cuerpo, H1 institucional |
| `var(--font-serif)` | Playfair Display | H1 editorial, H2 narrativos, citas de tesis |
| `var(--font-mono)` | Roboto Mono | Métricas, REF codes, datos financieros (tabular-nums) |

> Nota: la investigación recomendaba Söhne + Financier (Klim, comerciales). Se sustituyeron por Inter + Playfair (open-source) — sustitución defendible por costo de licencias.

### Jerarquía de encabezados (regla unificada — 23 May 2026)

- **H1 institucional** (títulos cortos: Home, Nosotros, Tecnología, Blog index, Paquetes, Sistema/Productos): `var(--font-sans)` Inter, `font-weight: 700`, `text-transform: uppercase`, `letter-spacing: 0.08em`, color `var(--color-brand)`.
- **H1 editorial** (artículos largos `/blog/*`): `var(--font-serif)` Playfair, `font-weight: 600`, natural case, `letter-spacing: -0.01em`. Vía `<IndustrialHeader variant="editorial" />`.
- **H2**: siempre `var(--font-serif)` Playfair natural case (títulos narrativos, citas).
- **Eyebrows**: `<p>` con `text-sm uppercase tracking-[0.15em]`. **NUNCA** `<h2>` para eyebrows.

**Componente canónico:** [src/components/IndustrialHeader.tsx](src/components/IndustrialHeader.tsx) — `variant: 'institutional' | 'editorial'`, renderiza el único `<h1>` de la página.

**Reglas de hierro:**
- ❌ NUNCA dos `<h1>` en una página (rompe SEO/a11y).
- ❌ NUNCA `fontFamily` con fuente no cargada en layout.tsx.

### Microtipografía financiera
- `font-feature-settings: 'case' 1` — alinea %/−/+/() con mayúsculas.
- `font-variant-numeric: tabular-nums` — ancho fijo en cifras (tablas/balances).
- Signo menos real U+2212 (no guion `-`). Prohibido sustituir símbolos monetarios por íconos.

---

## 3. Geometría

Border-radius tokens — escala de sutileza. **Prohibido `clip-path: polygon()` biselado** en botones (estética cyberpunk, antitética a la construcción de patrimonio).

| Token | Valor | Uso |
|-------|-------|-----|
| `--radius-micro` | 2px | Checkboxes, badges |
| `--radius-action` | 4px | Botones, inputs |
| `--radius-container` | 8px | Cards, módulos |

---

## 4. CTAs / Botones

Clases canónicas en [globals.css](src/app/globals.css). **Nunca** fondo dorado sólido + texto invertido en botón primario.

- **`.cta-primary`**: tinte dorado 7% (`rgba(197,160,89,0.07)`) + borde 1.5px `--color-brand` + texto dorado. Hover: tinte 14%.
- **`.cta-secondary`**: transparente + borde titanio + texto titanio.
- **`.cta-ghost`**: sin borde, solo texto titanio; hover → dorado.

**Sub-marcas con identidad propia** (Clinical Luxury bioEmerald `#50C878`, WhatsApp `#25D366`): patrón = fondo con tinte 7-14% del acento + borde 1.5-2px + texto del acento. Sin clip-path biselado.

---

## 5. Efectos atmosféricos

- **Spotlights hero**: Titanio `radial-gradient(ellipse, rgba(148,163,184,0.08), transparent 70%)` · Dorado `rgba(197,160,89,0.06)`.
- **Glass borders**: standard `rgba(255,255,255,0.1)` · hover `rgba(197,160,89,0.3)`.
- **Dark Mode line-less**: profundidad por luminancia (aclarar el carbón), NO por sombras negras. Hairlines `rgba(255,255,255,0.08)` solo para datos tabulares.
- **Separadores `---` en chat**: `my-6` (24px) para respiración (ver NEXUSWidget.tsx custom `hr`).

❌ NO `backdropFilter: blur()` en cards del homepage (mata GPU compositing en paint inicial).

---

## 6. Implementación de referencia

- **Sistema completo aplicado:** [src/app/infraestructura/page.tsx](src/app/infraestructura/page.tsx) (`/infraestructura`).
- **Tokens fuente:** [src/lib/branding.ts](src/lib/branding.ts) (COLORS, ICON_COLORS, emailStyles) + [src/app/globals.css](src/app/globals.css) (`:root`).
- **Tailwind:** paletas `titanium`/`carbon`/`champagne` en [tailwind.config.ts](tailwind.config.ts).

> CLAUDE.md mantiene la versión operativa resumida en la sección "Design System: Bimetallic v3.0". Este BRANDING.md es la referencia extendida de diseño.

---

## 7. Léxico Queswa — Vocabulario Canónico (aprobado / prohibido)

> **Fuente de verdad completa del vocabulario.** CLAUDE.md conserva la doctrina de migración + las prohibiciones más frecuentes en su sección "Queswa Vocabulary — Tabla Canónica"; las **tablas completas** viven aquí. Toda edición de copy de cara al prospecto pasa el test "abuela de 75 años" y usa el **léxico accesible** (columna en negrita), no el canon interno.

### 7.1. Vocabulario APROBADO (doctrina canónica)

> 🔁 **Las filas marcadas 🪶 son CANON INTERNO ya migrado de cara al prospecto (jun 2026).** El "Término" sigue vivo en arsenales profundos + system prompt sin migrar, pero en copy que ve el prospecto va el **reemplazo accesible en negrita dentro de "Uso"** — NO uses el término canónico ni "corrijas" copy accesible hacia él. Ver [[project_migracion_lexico_accesible]].

| Término | Uso | Razón |
|---------|-----|-------|
| **Tres Pilares** | Arquitectura del sistema — NUNCA "capas" ni "Máquina Híbrida" | Doctrina v26.0 |
| 🪶 **Pilar 1 — La Matriz Física** | Gano Excel + músculo logístico · prospecto → **El Respaldo Operativo** | — |
| **Pilar 2 — Queswa, su Centro de Mando** | Plataforma IA propietaria | — |
| 🪶 **Pilar 3 — La Metodología Automatizada** | El Tridente EAM (no "Su Rol") · prospecto → **El Método Comprobado** | Recategorización v26.5 |
| 🪶 **Arquitecto de Patrimonio** | Rol del usuario — director de los 3 pilares, NO uno de ellos · prospecto → **Propietario (de su negocio digital)** | — |
| 🪶 **Base Operativa** | Activo del usuario · prospecto → **negocio digital** (a secas — NO "de Gano Excel": la corona es de CreaTuActivo, no del proveedor). "Base Operativa" sale de cara al prospecto (swap jun 2026, `HANDOFF_AGENTE_LEXICO_ARSENALES.md`) | Retirado 15 May 2026 (Unidad de Suministro/Nodo Logístico) |
| 🪶 **Tridente EAM** | Comando Expandir · Comando Activar · Comando **Multiplicación** (3er comando renombrado desde "Maestría" jun 2026) · prospecto → **El Método Comprobado** | v26.2 — "Comandos" no "Protocolos" |
| **Déficit Estructural de Ingresos** | El villano sistémico (causa raíz, no consecuencia) · prospecto → villano NARRADO, nunca etiquetado | v26.6 — jerarquía causal |
| **Monetización de Doble Velocidad** | Capitalización Inmediata (GEN5) + Renta Vitalicia (Binario) | v26.2 |
| 🪶 **Estructura Patrimonial** | Sustantivo doctrinal — reemplaza "Patrimonio Paralelo" · prospecto → **estructura de ingresos recurrentes** | v26.3 — Glosario v1.4 |
| **El Tridente EAM** | Reemplaza "Framework IAA" (eliminado) | v19.6 |
| **90% automatizado** | NO usar "80% automatizado" | Doctrina actual |
| **70 países** | Gano Excel presencia global — NO usar 60 | Oficial |
| **15 países operativos** | CreaTuActivo cobertura geográfica — NO confundir con 70 | v6.4 compensación |
| **Cupos Fundadores: 15** | Base fundacional inicial | — |
| **Acueducto / Alquiler vs. Propiedad / Ferrari gratis / Waze / Faro** | Metáforas universales aprobadas | Jobs-Style Feb 2026 |

### 7.2. Vocabulario PROHIBIDO (no usar bajo ninguna circunstancia)

| Prohibido | Reemplazar con | Razón de prohibición |
|-----------|---------------|---------------------|
| filtrar / filtro / filtrado / descartar a quien no encaja (lo que hace Queswa de cara al prospecto) | conversar · madurar la decisión de avanzar · reconocer quién está listo | jun 2026 — para un dueño de negocio físico "que filtre a sus visitantes" suena a perder clientes; reencuadrar en clave de **conversión**, no de rechazo. Ver [[feedback_filtrar_prohibido]] |
| Maestría (3er Comando del Tridente EAM) | **Multiplicación** | jun 2026 — "Maestría" obliga a explicar luego; "Multiplicación" comunica el lever directo. Ver [[project_rename_maestria_multiplicacion]] |
| **guía / acompaña** (lo que Queswa hace con la decisión del prospecto) | **madura** — *"Queswa explica, atiende y madura en cada interesado la decisión de avanzar, las 24 horas"* | 25 jun 2026 (Opción B) — "madura" dibuja el cambio de estado (interesado→listo), más preciso que "guía". Objeto = **la decisión**, no la persona (activo sin presionar). ⚠️ **Regla del espejo:** "madura la decisión" SOLO en 3ª persona (los prospectos del usuario); en CTA/interpelación al lector NO se usa verbo sobre *su* decisión (madurar/guiar SU decisión = expone la persuasión). La **calidez humana** (equipo/héroe recibe al que ya decidió) conserva "acompaña". Ver [[feedback_verbos_cambio_de_estado]] · [[feedback_promesa_canonica_queswa]] |
| **cambiar horas/tiempo por dinero** (como villano) · "no a cambio de sus horas" · "¿su meta es seguir cambiando horas por dinero?" | el villano es la **DEPENDENCIA**: *"el día que para, el ingreso para"* / *"su tiempo y su dinero amarrados"* + falta de seguridad | 25 jun 2026 — trabajar es **orgullo/dignidad** latina; atacar "las horas" choca con su identidad ("soy el que trabaja más duro"). Swap suave "no depende de su tiempo/horas" → **"de su presencia"**. "Techo limitado a las horas" SÍ se permite (límite de escala). Ver [[feedback_horas_no_son_el_villano]] |
| Hardware / Software | El Músculo / El Cerebro | Jerga técnica |
| Protocolo de Simulación | Auditoría Patrimonial | Test abuela falla |
| Cupo de Validación | acceso gratuito | Test abuela falla |
| Módulos Estratégicos | Videos de instrucción | Test abuela falla |
| Iniciar Simulación / Iniciar Protocolo | Toca el botón para comenzar | Test abuela falla |
| Despliegue | Acceso / Activación | Jerga técnica |
| Nodo de distribución | Base Operativa | Eufemismo opaco |
| Ancho de Banda Mental | (solo permitido en RETO_05) | Contexto específico únicamente |
| Pipeline / Embudo | Tubería / Canal | Jerga tech |
| Asignación de Capital para la Activación de Infraestructura | Selección del nivel de inventario / capital se convierte en productos físicos | v5.2 (May 2026) — opacidad en cierre |
| Apalancamiento Asimétrico / Apalancamiento Estratégico Máximo | Apalancamiento estratégico (a secas, sin "asimétrico/máximo") | v26.4 — fricción nivel 5/5 Wall Street |
| Tecnología nutricional | Productos físicos / bebidas enriquecidas y suplementos Gano Excel | v5.2 (May 2026) — opacidad |
| Su arquitectura actual (en preguntas de cierre/seguimiento) | Su modelo de ingresos / Su Estructura Patrimonial | v5.3 (24 May 2026) — claridad para avatar de primera visita |
| 100% / íntegramente (al describir transferencia de capital a productos) | Su capital se transfiere a productos físicos (sin cuantificador absoluto) | v5.3 — México tiene cobros pequeños de afiliación (~$10 USD); afirmar 100% es factualmente impreciso y auditable |
| "No existen cuotas de inscripción ni cobros por afiliación" | (omitir esta frase) | v5.3 — falsa en México |
| Tabla Binario con columna "Cálculo CV × % × $1" | Tabla Binario simplificada (Paquete + Rentabilidad %) | v5.3 — la fórmula técnica añade fricción al prospecto que recién entiende Base Operativa. Solo servirla si el usuario pregunta explícitamente "¿cómo se calcula?" |
| plusvalía (estructural / del posicionamiento / de su Base Operativa) | ventaja estructural / ventaja del posicionamiento / valor patrimonial | v5.4 — término inmobiliario opaco; "ventaja" o "valor patrimonial" comunican mejor |
| ancho de banda (en preguntas de seguimiento, contextos de tiempo/agenda) | disponibilidad / agenda directiva / agenda ejecutiva | v5.4 — jerga tech; "disponibilidad" o "agenda" son universales |
| vector de tráfico / vector de adquisición | camino de expansión / ruta / canal | v5.4 — jerga militar; absorbido en reescritura FREQ_02 |
| Modo Relacional / Modo Híbrido / Modo de Escalabilidad (los 3 modos de tráfico de FREQ_02) | Conexión Directa / Conexión Asistida / Conexión Automatizada | v5.4 — los nuevos nombres son auto-explicativos (cada uno indica QUÉ hace) |
| global (cuando refiere al activo del usuario: "consumo global", "Base Operativa global") | internacional | v5.4 — el usuario opera en 15 países América, no en todo el mundo. "Global" PRESERVADO cuando describe factualmente Gano Excel (70 países, distribución global) o el despliegue público global |
| pierna fuerte / pierna débil (Binario) | Centro de Negocios de Mayor Tracción / Centro de Negocios de Cobro | v5.5 — "pierna" suena a cosa, no a Lujo Clínico. "Centro de Negocios" eleva el status |
| "las dos principales" (al introducir GEN5 + Binario) | "Analicemos dos" (sin jerarquía) | v5.5 — "las dos principales" implica jerarquía falsa sobre las otras 10 velocidades. Apertura canónica: *"Su Base Operativa genera ganancias en 12 velocidades que cubren su flujo de corto, mediano y largo plazo. Analicemos dos:"* |
| "17% sobre la pierna débil" / "17% sobre el Centro de Negocios de Cobro" (sin GCV) | "17% del GCV sobre el Centro de Negocios de Cobro" | v5.5 — sin "GCV" el usuario puede asumir 17% sobre $100M de venta = $17M (absurdo). El GCV es valor comisionable asignado por Gano Excel, distinto al PVP |
| Tabla "Personas/Lado" en Binario (alucinación del modelo) | Tabla con "Bases Operativas" + contexto de estimado (4 cajas Ganocafé/Base/mes) | v5.5 — el modelo inventa esta tabla para "ilustrar" matemática. Refuerza paradigma MLM "ganas por meter gente". Prohibida en `getTablasComisiones()` |
| "Con gusto" (apertura única repetitiva) | Banco rotativo: Claro / Por supuesto / Entiendo / Excelente / OK / Comprendo / De acuerdo | v5.5 — repetir "Con gusto" suena a guion comercial. Documentado en system prompt v27.2 sección Modulación de Registro |
| ⚠️ Mostrar USD a un visitante de Colombia (cualquier valor) | **Colombia = SOLO COP** para TODO: precios de paquetes/productos **Y** comisiones/GEN5/binario (tasa fija $4,500). US = USD limpio. Resto/desconocido = USD (+COP) | **jun 2026** (decisión Director Cabrejo en pruebas): para CO, nunca mostrar USD — confunde y dispara la objeción "el dólar no está a 4,500". Aplica país-aware: `getPaquetesPricingPin`, `precioPaqueteLinea`, `getPinCifrasGEN5`, `getTablasComisiones`. Supersede la doctrina previa "comisiones = ambas monedas" |
| Auditoría de acoplamiento | (eliminado) | Klaff Prize Frame zombi |
| 7-10 horas semanales (entrevista BANT) | (eliminado) | Opción B colapsó Estado 1 |
| Tracción | dirección asimétrica / gobernanza | Wall Street/Anglo |
| Ancho de banda operativo | disponibilidad real para la dirección | Jerga tech |
| Máquina Híbrida | Base Operativa / los tres pilares | v26.0 |
| Capas (arquitectura de negocio) | Pilares | Doctrina |
| Unidad de Suministro / Nodo Logístico | Base Operativa | Retirados 15 May 2026 |
| Gobernanza estratégica/de activos | dirección estratégica/dirigir activo | v26.4 — fricción nivel 5/5 corporativo |
| Actualización de software financiero | instalación de Estructura Patrimonial en paralelo | v26.4 — sesgo WEIRD/tech-noir |
| Perseguir, convencer | (eliminar) | Plantar objeciones inexistentes |
| Multinacional (contexto MLM) | (evitar) | Asociación negativa |
| Pasivo | recurrente | — |
| Libertad financiera, ingreso pasivo, reclutamiento | (eliminar) | Filtra como MLM |
| Esposas de Oro / Trampa Operativa / Creador de Ingreso Lineal | (eliminado) | Atacaban identidad del prospecto |
| Sé tu propio jefe / Trabaja desde casa | (eliminar) | Filtra como MLM |
| Oportunidad de negocio | (eliminar) | Filtra como MLM |
| "Haz una lista de 100" | (eliminar — contexto: viejo MLM) | — |
| La salida es / Escape de / Sal del | (eliminar) | MLM tradicional colombiano |
| NO es reemplazo. NO es escape. | (eliminar — describir qué ES) | v26.3 |
| Tu Rol (El Director) como tercer elemento plano | METODOLOGÍA (Ejecución Exacta) | v19.6 |
| "esto" / "eso" para auto-referirnos (a CreaTuActivo o al proyecto) | Nombrar concretamente qué es — ej. *"la nueva forma de construir ingresos recurrentes que no dependen de su presencia"* | Jun 2026 — auto-referencia vaga debilita la categoría; un creador de categoría se nombra, no se señala |
| operar / operador (de cara al prospecto, para el usuario o el sistema) | hacer el trabajo / trabajar / funcionar; el usuario: dirigir / ser dueño | Jun 2026 — para el latino promedio "operar" evoca cirugía; nadie se identifica como "operador" (es empleado/trabajador/dueño). ⚠️ Afecta el canónico "el sistema opera" / "Usted dirige; el sistema opera" — revisar en el sweep de servilleta + arsenales + system prompt |
| escalar (el activo del usuario) | multiplicar | Jun 2026 — swap "negocio digital" (`HANDOFF_AGENTE_LEXICO_ARSENALES.md`) |
| soberanía financiera | tranquilidad / estabilidad / seguridad | Jun 2026 — swap "negocio digital". **EXCEPCIÓN:** el lema de Luis *"la soberanía financiera no se trata de lujos"* se conserva donde es su frase-marca / Epiphany Bridge |
| PII hardcodeada en arsenales | (nunca) | Seguridad |
