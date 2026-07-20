# HANDOFF — Swap de léxico en arsenales → "Negocio Digital" (jun 2026)

**Para:** agente Claude Code delegado. **De:** Director Cabrejo + Claude (sesión system prompt).

## Objetivo
Ajustar el **léxico** de los arsenales de Queswa al registro **"Negocio Digital"**. Esto **NO es reingeniería**: se cambian **palabras y contextos** (ej. *Base Operativa → negocio digital*), conservando narrativa, cifras y estructura. Si una frase queda rara tras el swap, corrige solo la concordancia mínima — **no reescribas el párrafo**.

## ⚠️ ESTO SUPERSEDE EL MAPPING VIEJO
El handoff previo (`HANDOFF_RECALIBRACION_LEXICO_QUESWA.md`) migró a "**Base Operativa**" / "Propietario de Base Operativa" y lo conservaba. **Decisión nueva: "Base Operativa" también sale → "negocio digital".** Hay que barrer **dos capas**: el léxico viejo-viejo (Matriz Física, Tridente EAM…) **y** los "Base Operativa" que dejó la migración previa. Ante cualquier conflicto, **manda esta tabla**, no la de CLAUDE.md (que aún marca el canon viejo como aprobado — se actualizará aparte).

## Mapping autoritativo (viejo → nuevo)
| Viejo | Nuevo |
|---|---|
| Base Operativa | **negocio digital** (a secas — NO "negocio digital de Gano Excel") |
| Estructura Patrimonial / patrimonio paralelo | estructura de ingresos recurrentes / ingreso recurrente |
| La Matriz Física | El Respaldo Operativo (Pilar 1) |
| La Capa Tecnológica / "capa" (negocio) | (sin "capa") — Pilar 2 · Queswa |
| El Tridente EAM / Metodología Automatizada / protocolo EAM | El Método Comprobado (subtítulo: Comando Expandir · Activar · Maestría) |
| Arquitecto de Patrimonio | Propietario (de su negocio digital) |
| operar / operador (del usuario o del sistema) | hacer el trabajo / trabajar / funcionar; el usuario: **dirigir** / **ser dueño** |
| "esto" / "eso" (auto-referencia a CreaTuActivo) | nombrarlo concretamente (ej. *"la nueva forma de construir ingresos recurrentes que no dependen de su presencia"*) |
| soberanía financiera | tranquilidad / estabilidad / seguridad. **EXCEPCIÓN:** el lema de Luis *"la soberanía financiera no se trata de lujos"* se conserva donde sea su frase-marca/Epiphany Bridge |
| su vida como combustible · esclavo · engranaje | villano **NARRADO sin atacar** (la dependencia; el ciclo *"trabajar, pagar cuentas y repetir"*) |
| escalar | multiplicar |
| Apalancamiento Asimétrico / Máximo | apalancamiento estratégico (a secas) |

**Marco de marca:** CreaTuActivo.com = **protagonista / categoría nueva** (modelo Netflix). Gano Excel = el **proveedor que "hace por usted"** el trabajo pesado (el estudio detrás de Netflix), no a quien uno "se asocia". **Registro:** firme (Mario Alonso Puig) + claro (test abuela/Beto). Ni charla de vecino, ni jerga opaca.

⚠️ **Regla de atribución (la corona es de CreaTuActivo, no de Gano Excel):** el activo del usuario es **"su negocio digital"** a secas — NUNCA "su negocio digital de Gano Excel". Estampar "Gano Excel" en el sustantivo le regala el prestigio al proveedor (sería "Netflix de MGM"). Separar dos trabajos: (1) **Propiedad** del activo → "su negocio digital", sin nombrar a Gano Excel; (2) **Credibilidad del suministro** → ahí SÍ entra Gano Excel, pero como **Respaldo Operativo (Pilar 1)** / el estudio detrás de cámaras que fabrica, almacena y envía en 70 países ("Usted dirige; ellos cargan el peso"). Gano Excel se nombra solo en contexto de respaldo, nunca como dueño del negocio.

## Archivos y carga aproximada
| Archivo | Hits léxico viejo | Notas |
|---|---|---|
| `knowledge_base/arsenal_inicial.txt` | ~64 (el más pesado) | ⚠️ contiene `<verbatim_lock>` (WHY_02, EAM_01) |
| `knowledge_base/arsenal_avanzado.txt` | ~11 | |
| `knowledge_base/arsenal_reto.txt` | ~11 | |
| `knowledge_base/arsenal_compensacion.txt` | ~14 | ⚠️ SOLO léxico de marca — **jamás cifras/%/GCV/PV ni nombres del plan** |
| `knowledge_base/arsenal_12_niveles.txt` | 0 | revisar igual |
| `knowledge_base/catalogo_productos.txt` | 0 | ⚠️ `<verbatim_lock>` en nombres de producto — NO tocar |

*(El conteo solo cubre algunos términos; también busca `operar`, `esto/eso` auto-referencial, `escalar`.)*

## 🔒 Guardrails CRÍTICOS
1. **`verbatim_lock` (WHY_02 BLOQUE 1, EAM_01 BLOQUE 8 en arsenal_inicial):** si tocas el contenido entre `<verbatim_lock>…</verbatim_lock>`, sincronízalo **carácter por carácter** con `src/lib/respuestas-maestras.ts` (`MASTER_WHY_02`, `MASTER_EAM_01`). Son fuente dual. Verifica primero si ya están en "negocio digital" o aún en "Base Operativa".
2. **arsenal_compensacion:** solo swaps de marca. **NUNCA** cifras, porcentajes, GCV, PV, ni nombres del plan.
3. **catalogo_productos:** no toques nombres de producto (verbatim_lock anti-alucinación).
4. **No reescribas narrativa.** Solo palabras/contextos.

## Workflow (por arsenal editado)
1. Editar el `.txt`.
2. `node scripts/deploy-arsenal-<nombre>.mjs`
3. Purgar fragments del arsenal por prefijo (patrón en CLAUDE.md → "Updating Queswa Knowledge").
4. `node scripts/fragmentar-arsenales-voyage.mjs`
5. `node scripts/audit-completo.mjs` (verificar conteos).

## Coordinación
- El **system prompt** (`system-prompt-nexus-main-v27_2.md` + Supabase `system_prompts`) lo migra **otro agente en paralelo** — **NO lo toques.**
- `route.ts` NO se toca (lee de los mapas; el fallback se migra aparte).
- Contexto completo: CLAUDE.md "Queswa Vocabulary — Tabla Canónica" + memorias `project_lexico_negocio_digital`, `feedback_no_autoreferencia_esto_eso`, `feedback_registro_firma_no_vecino`, `project_vision_norma_ingreso_paralelo`.
- **Deploy a Supabase:** coordinar con el Director — idealmente desplegar arsenales + system prompt **juntos** para que Queswa no quede mezclando léxicos.
