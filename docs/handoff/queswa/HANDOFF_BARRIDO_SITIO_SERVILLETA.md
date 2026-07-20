# HANDOFF — Barrido de Sitio + Servilleta al nuevo posicionamiento de la Home (jun 2026)

> **Para el agente que tome esta tarea.** Trabajo derivado del **reposicionamiento de la Home**
> (sesión jun 2026). La Home YA está hecha; el resto del sitio quedó desalineado. Tu trabajo es
> **alinear el resto del sitio + la página servilleta** a ese nuevo posicionamiento, siguiendo
> reglas estrictas y respetando los guardarraíles. **No improvises doctrina** — está toda escrita
> abajo y en `CLAUDE.md`.

---

## 1. Contexto — qué cambió en la Home (tu modelo a replicar)

La Home (`src/app/page.tsx`) se reposicionó así (esto es el canon nuevo; replícalo en el resto):

1. **Identidad / H1:** liderar con **propiedad** → *"Sea dueño de su empresa digital"* (no "construcción de ingresos").
2. **El "Diagnóstico de 5 Días" se DESCONECTÓ como gancho.** Producía cero aplicaciones y "olía a desesperado". Ya **no se empuja**. Los CTAs cambiaron:
   - **CTA de cuerpo** (en páginas) → **"Hablar con Queswa"** (frictionless; abre Queswa con el evento `open-queswa`, ver `src/components/QueswaCTAButton.tsx`).
   - **CTA de menú** → **"Suscríbete"** (newsletter; `SubscribeModal`, ya implementado en `StrategicNavigation`).
3. **Diagnóstico (villano)** narrado **limpio, estilo Slide 1 de la servilleta** (pintar con palabras, Jim Rohn): *"trabajar, pagar cuentas y volver a empezar… consecuencia matemática de un sistema diseñado para tomar sus mejores años y su salud… el éxito de hoy no garantiza estabilidad mañana."* Sin patchwork, sin tablas de estadísticas.
4. **"¿Qué es una empresa digital?"**: definición (Bezos/Amazon/MercadoLibre = *"usted es dueño del sistema, no empaca las cajas"*) + ejemplo (`sonrisaslindas.app`, el puente). El **escalar/McDonald's/multiplicar a un clic** NO va en la definición — va en la **oferta de valor** ("Cómo lo hacemos").
5. **"Cómo lo hacemos nosotros"**: la decisión (desde cero vs. apalancamiento) → **3 pilares**: Pilar 1 **El Respaldo Operativo** (Gano) · Pilar 2 **Queswa** · Pilar 3 **El Método Comprobado** (Expandir · Activar · Multiplicar).
6. **Gano Excel = respaldo operativo, NUNCA el titular del ingreso.** Se nombra solo como *"la empresa real que fabrica y entrega en 70 países"*. ❌ Prohibido *"ingresos cada vez que consumen productos Gano Excel"* (dispara el fantasma MLM).
7. **Rol humano (Activar):** calidez, NO auditar. *"Usted recibe al interesado y estrecha su mano — la calidez que solo un humano puede dar."* ❌ Nunca *"usted revisa / audita / da el sí"*. El "nadie audita" es el **principio**, no se escribe literal.

---

## 2. Reglas de oro — léxico y CTA (fuente: `CLAUDE.md` § Queswa Vocabulary + esta sesión)

**Reemplazos de CTA (lo más importante):**
| Si encuentras… | Reemplázalo por… |
|---|---|
| Botón/CTA "Iniciar el Diagnóstico de 5 Días" / "Iniciar Diagnóstico" / "Ver la Auditoría de 5 Días" (en páginas generales) | **"Hablar con Queswa"** (usa `QueswaCTAButton` si es client, o el patrón de evento `open-queswa`) |
| Link `href="/empresa-digital"` usado como **CTA de empuje al funnel** | Repuntar a la conversación (Queswa) o quitarlo. **NO** dejar el empuje al diagnóstico |
| Micro-copys tipo "5 Días · Sin Costo · Radiografía…" | Eliminar o sustituir por copy de conversación/valor |

**Léxico (de cara al prospecto):**
- ✅ **"empresa digital"** (el activo del usuario) · **"ingresos recurrentes"** · **"usted dirige; el sistema hace el trabajo"**.
- **"negocio"** solo para el contraste villano (don Carlos) o el negocio ACTUAL del visitante. La **empresa** (McDonald's) es lo que se multiplica.
- **"multiplicar"** (el activo del usuario), no "escalar". "Escalar" solo para el concepto universal.
- ❌ Prohibido: *auditar / filtrar / calificar* al visitante · *operar/operador* (usar "hacer el trabajo" / "dirigir") · *Base Operativa, Estructura Patrimonial, Arquitecto de Patrimonio, Máquina Híbrida, patrimonio paralelo, Tridente EAM* (de cara al prospecto) · Gano como titular del ingreso · *ingreso pasivo / libertad financiera / reclutamiento / oportunidad de negocio*.
- **Promesa canónica de Queswa** (verbatim): *"explica, atiende y guía a cada interesado hasta la decisión de avanzar, las 24 horas."*

**Paleta de analogías** (usar la correcta según el trabajo):
- **Nubank** (David Vélez 🇨🇴) → finanzas / fundador / visión.
- **Amazon / MercadoLibre** → qué es una empresa digital (dueño del sistema, no empaca cajas).
- **Rappi** → el ejemplo genérico del "puente".
- **McDonald's / cadena de hoteles** → escalar = negocio→empresa→multiplicar (oferta de valor).

---

## 3. Alcance — qué SÍ tocar

Corre primero el inventario:
```bash
grep -rIn "Diagnóstico de 5 Días\|Iniciar el Diagnóstico\|Auditoría" src/app src/components | grep -v "empresa-digital/"
grep -rln 'href="/empresa-digital"\|href="https://creatuactivo.com/empresa-digital"' src/app src/components
```
(referencia jun 2026: ~61 "Diagnóstico de 5 Días", ~33 `/empresa-digital`, ~17 "Auditoría").

**Targets principales:**
1. **Página servilleta** `src/app/servilleta/page.tsx` — el CTA secundario (≈línea 1882) *"VER LA AUDITORÍA DE 5 DÍAS →" → /empresa-digital*. Repuntar/relabelar (Queswa o quitar el empuje al diagnóstico). Revisar léxico del deck contra las reglas §2.
2. **Páginas indexadas** que aún lideran con el CTA de diagnóstico: `/tecnologia`, `/paquetes`, `/planes`, `/manifiesto`, `/calculadora`, blogs (`/blog/*`), mini-landing `[slug]`. Alinear sus CTAs al patrón nuevo (Queswa de cuerpo) y barrer léxico viejo.
3. **Guion maestro servilleta** (`public/contexto/produccion/guiones/servilleta/guion_maestro_servilleta_v3.md` + `_TELEPROMPTER.md`) — **ya está en v5.0 "empresa digital" y es el modelo de oro**, así que solo VERIFICA que no quede "Diagnóstico/Auditoría" como CTA o léxico viejo; cambios mínimos esperados.

**Modo de trabajo:** dos pasadas. (a) **Mecánica** (reemplazos claros de §2). (b) **Marcar para Luis** los casos de juicio (ver §4) en vez de cambiarlos a ciegas.

---

## 4. Qué NO tocar (guardarraíles — CRÍTICO)

- ❌ **La Home** (`src/app/page.tsx`, `StrategicNavigation.tsx`, `EmpresaDigitalSection`, etc.) — ya está hecha. No la reabras.
- ❌ **Arsenales** (`knowledge_base/arsenal_*.txt`) **y el system prompt** (`system_prompts` / `system-prompt-nexus-main-v27_2.md`) — es **otra tarea, sesión aparte** (toca doctrina viva de Queswa + pipeline de deploy + verbatim_lock + clonado al tenant whatsapp). **Pendiente conocido:** `arsenal_inicial.txt` línea ~510 todavía dice *"usted revisa quién ya mostró interés y le da el sí final"* (framing de auditoría que se contradice con EAM_01 línea ~732). **NO lo toques aquí.**
- ❌ **Las páginas del funnel `/empresa-digital/*`** (squeeze + dia-1..5 + `[constructorId]`) — están **dormidas a propósito** (con redirects 301). No las borres ni las reactives. Solo se trata de dejar de **enlazarlas como gancho** desde el resto del sitio.
- ❌ **Identificadores internos de tracking**: `source: 'auditoria-patrimonial'`, `source: 'auditoria-confirmada'`, eventos `vio_bridge_auditoria`, nombres de step en `/api/funnel`, `/api/diagnostico`, `/api/track/*`. Son **contrato con el backend** — NO renombrar aunque digan "auditoría/diagnóstico".
- ❌ **Rutas API** (`src/app/api/*`) — backend, no copy. Déjalas salvo que Luis lo pida.
- ⚠️ **Páginas de Reels** (`src/components/ReelPage.tsx`, `[slug]/[destino]`) — su CTA "Diagnóstico de 5 Días" → `/empresa-digital` fue una **decisión de diseño deliberada** para el canal WhatsApp tibio. **NO lo cambies en bloque** — **márcalo como decisión para Luis** (¿el reel también deja de empujar el diagnóstico?).
- ⚠️ **`/reto-12-niveles` y `/diagnostico`** (quiz standalone de ads) — tienen tono/propósito propios; revisar con cuidado, no asumir.

---

## 5. Verificación / aceptación

1. `npm run build` compila (TS errors se ignoran, pero no debe romper compilación).
2. `grep` de residuos en las páginas tocadas: que no quede *"Iniciar el Diagnóstico"* como CTA vivo ni léxico prohibido (§2).
3. Sin tocar nada de §4 (revisar el diff).
4. Entregar a Luis un **resumen** de: (a) qué se cambió, (b) los casos de juicio marcados (reels, diagnostico, reto-12), (c) cualquier duda de léxico.

---

## 6. Referencias

- `CLAUDE.md` → secciones **"Queswa Vocabulary — Tabla Canónica"**, **"NAMING DEL FUNNEL EN TRANSICIÓN"**, **"Page Structure & Funnel"**.
- **Modelo de oro de narrativa:** Slide 1 del guion servilleta (`..._TELEPROMPTER.md`) — pintar con palabras.
- La **Home** (`src/app/page.tsx`) como referencia viva del léxico/CTA correctos.
- Memorias del proyecto (si tienes acceso): `project_lexico_negocio_digital`, `project_migracion_lexico_accesible`, `feedback_filtrar_prohibido`, `feedback_promesa_canonica_queswa`.

---

**Resumen de una línea:** alinea el sitio + servilleta a *"Sea dueño de su empresa digital"* + CTAs **Queswa/Suscríbete** (no Diagnóstico) + Gano-como-respaldo + calidez-no-auditoría — sin tocar Home, arsenales, system prompt, funnel dormido ni contratos de tracking.
