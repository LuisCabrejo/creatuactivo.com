# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**CreaTuActivo Marketing Platform** - Next.js 14 application for a multilevel marketing business featuring an AI-powered chatbot (**Queswa**, formerly NEXUS - rebranded in v15.0) that guides prospects through the sales funnel while tracking engagement via Supabase.

**Stack**: Next.js 14 (App Router), TypeScript, React, Tailwind CSS, Supabase, Anthropic Claude API, Resend

**Design System**: "Quiet Luxury" with Bimetallic Accents v3.0 - See detailed guide below

**Funnel Strategy**: Russell Brunson methodology - Squeeze Page → Bridge Page → Offer (see Section 5)

> 🧭 **SI ERES NUEVO, LEE PRIMERO (en este orden):** (1) [Reglas Críticas (NO HACER)](#reglas-críticas-no-hacer) — lo que rompe producción · (2) [Léxico y voz](#léxico-y-voz--lo-que-se-aplica-en-cada-línea-de-copy) — cómo se escribe aquí (⚠️ **la migración a léxico accesible ya está en código; nunca "corrijas" copy accesible hacia el término viejo**) · (3) [HANDOFF_CONTEXTO_COMPLETO.md](HANDOFF_CONTEXTO_COMPLETO.md) — contexto de negocio. El **historial con fecha** de cada subsistema vive en sus CHANGELOGs/handoffs (enlazados en cada sección); aquí solo está el **estado vigente + las reglas**.

> 📚 **Este archivo se carga en cada sesión — manténgalo delgado.** Lo que es *referencia* vive en documentos hermanos y aquí solo queda el puntero: [BRANDING.md](BRANDING.md) (diseño + tablas de léxico) · [docs/SERVILLETA.md](docs/SERVILLETA.md) (deck) · [scripts/dankoe-video/PIPELINE.md](scripts/dankoe-video/PIPELINE.md) (post-producción de reels) · [docs/handoff/reels/VIDEO_Y_ANIMACIONES.md](docs/handoff/reels/VIDEO_Y_ANIMACIONES.md) · [docs/handoff/negocio/ESTRATEGIA_CONTENIDO_Y_VOZ.md](docs/handoff/negocio/ESTRATEGIA_CONTENIDO_Y_VOZ.md) (estrategia, voz, historia del fundador) · [docs/README.md](docs/README.md) (índice general). **Antes de agregar una sección larga aquí, pregúntese si es una regla que se aplica a diario o una referencia que se consulta.**

## Table of Contents

1. [Quick Reference](#quick-reference)
2. [Development Commands](#development-commands)
3. [Reglas Críticas (NO HACER)](#reglas-críticas-no-hacer)
4. [Performance — Estado Actual](#performance--estado-actual-abr-2026)
5. [Critical Git Workflow](#critical-git-workflow)
6. [Architecture Overview](#architecture-overview)
   - [NEXUS AI Chatbot](#1-nexus-ai-chatbot)
   - [Prospect Tracking](#2-prospect-tracking)
   - [Async Queue](#3-async-queue-architecture)
   - [Supabase Schema](#4-supabase-schema)
   - [Page Structure & Funnel](#5-page-structure--funnel-architecture)
   - [Servilleta Digital](#servilleta-digital---interactive-presentations)
7. [Environment Variables](#environment-variables)
8. [Common Development Patterns](#common-development-patterns)
9. [Important Patterns & Constraints](#important-patterns--constraints) → [Design System](#design-system-bimetallic-v30)
10. [Utility Scripts](#utility-scripts)
11. [Deployment](#deployment)
12. [Key Documentation Files](#key-documentation-files)
13. [Léxico y voz](#léxico-y-voz--lo-que-se-aplica-en-cada-línea-de-copy)

## Quick Reference

| Task | Command |
|------|---------|
| Dev server | `npm run dev` |
| Check active system prompt | `node scripts/leer-system-prompt.mjs` |
| Update creatuactivo.com prompt | `node scripts/actualizar-system-prompt-v27.2.mjs` (nombre legacy; verificar lo activo con `leer-system-prompt.mjs`) |
| Update WhatsApp prompt | `node scripts/actualizar-system-prompt-whatsapp-v4.mjs` |
| SQL directo contra Supabase | `node scripts/sql.mjs -e "select …"` |
| Auditar cabeceras y frases vetadas | `node scripts/auditar-frases-vetadas.mjs --detalle` |
| Batería del guardarraíl de salud | `node scripts/test-guardarrail-salud.mjs` (exit 1 si falla) |
| Batería del guardarraíl de negocio | `node scripts/test-guardarrail-negocio.mjs` (exit 1 si falla) |
| Auditar las plantillas del WABA (categoría real) | `node scripts/auditar-plantillas-whatsapp.mjs [--detalle]` — **Meta recategoriza plantillas por su cuenta y no avisa**; lee `previous_category`; exit 1 si hay alguna movida. Correr antes de creer lo que un handoff diga sobre la categoría |
| Plantilla del enlace de canal (¿por qué es MARKETING?) | **Meta clasifica por lo que la plantilla ENTREGA, no por cómo está redactada.** Una credencial personal que caduca es utilidad; un enlace que la persona va a COMPARTIR es un activo de mercadeo, y lo mueve aunque el mensaje no diga una palabra de más. Cuatro variantes sometidas como UTILITY el 17-23 ago —`enlace_canal_listo`, `enlace_canal_listo_v2` (entrega pura, sin botón ni beneficio), `acceso_canal` (¡sin URL siquiera!) y `acceso_creatuactivo`— y Meta movió las cuatro a MARKETING. La que sí sobrevive, `acceso_centro_mando_v2`, entrega un acceso personal que vence en 24 h: no es que esté mejor escrita, es que entrega otra cosa. ⛔ **No someter otra variante del enlace de canal: no es un problema de copy y no hay redacción que lo arregle.** ⚠️ El webhook se queda en la **v1**: las dos son MARKETING, y la v1 al menos trae el botón que, al tocarlo, abre la ventana de 24 h. `someter-plantilla-enlace-canal-v2.mjs` se borró para que nadie la vuelva a correr (la plantilla aprobada no se puede eliminar — Meta reserva el nombre —, queda sin invocar). A números +1 Meta no entrega MARKETING → al socio de EE. UU. le llega por el reenvío del Director. Detalle → [WABA_REFERENCIA.md](docs/handoff/queswa/WABA_REFERENCIA.md) |
| Eliminar plantillas huérfanas del WABA | `node scripts/eliminar-plantillas-whatsapp.mjs [--dry] nombre…` — con lista de PROTEGIDAS; el token ya tiene control total del WABA (23 ago). ⚠️ En Meta, «Queswa App CTA» es la **app**; el usuario del sistema del token es **«Token Queswa»** |
| Estado de la plantilla de bienvenida | `node scripts/someter-plantilla-bienvenida.mjs --estado` — ⚠️ `enlace_canal_listo` y su `_v2` de entrega pura están las dos en **MARKETING** por decisión de Meta. El webhook se queda con la **v1**, que conserva el botón. El porqué —y por qué no sirve someter otra— en la fila del enlace de canal, arriba. Detalle → [WABA_REFERENCIA.md](docs/handoff/queswa/WABA_REFERENCIA.md) |
| Someter la plantilla de acceso al Dashboard | `node scripts/someter-plantilla-acceso-dashboard.mjs` — la vigente es **`acceso_centro_mando_v2`, UTILITY**, aprobada y única (la v1 MARKETING se eliminó el 23 ago 2026) |
| Actualizar y republicar el Flow del simulador | `node scripts/actualizar-flow-simulador.mjs` (valida los 20 caracteres de NavigationList y republica) |
| Batería de regresión del clasificador | `node scripts/benchmark-clasificador.mjs --tenant whatsapp` (48/48 al 20 ago; exit 1 si falla) |
| Prueba de 40 preguntas (negocio) | `node scripts/prueba-40-preguntas.mjs [--detalle]` (39/40 al 20 ago) |
| Prueba de productos — los 22, 7 ángulos | `node scripts/prueba-productos.mjs [--detalle]` (47/47 al 20 ago) |
| Prueba conversacional (una persona, 26-28 turnos) | `node scripts/prueba-conversacion.mjs --guion 1\|2` |
| Recomponer las fotos de producto | `node scripts/componer-imagenes-producto.mjs` (22 imágenes 1080×1080) · `node scripts/componer-imagenes-categoria.mjs` (4 de categoría + `portafolio.jpg`, misma placa) |
| Re-fragmentar arsenal tras editar (genérico) | Patrón purgar + `node scripts/fragmentar-arsenales-voyage.mjs` (ver [Updating Queswa Knowledge](#updating-queswa-knowledge)) |
| Benchmark Haiku clasificación (Fase 0 — Tool Calling research) | `node scripts/benchmark-haiku-clasificacion.mjs` |
| POC Tool Calling con Sonnet 4.6 (Fase 0) | `node scripts/poc-tool-calling.mjs` |
| Update luiscabrejo.com prompt | `node scripts/actualizar-system-prompt-marca-personal-v1.mjs` |
| Update ganocafe.online prompt | `node scripts/actualizar-system-prompt-ganocafe-v1.3.mjs` (nombre legacy) |
| Rebuild embeddings after arsenal change | `node scripts/fragmentar-arsenales-voyage.mjs` |
| Deploy Supabase edge function | `npx supabase functions deploy nexus-queue-processor` |
| NEXUS health check | `curl http://localhost:3000/api/nexus` |
| Verify arsenal in Supabase | `node scripts/verificar-arsenal-supabase.mjs` |

**Multi-tenant prompt names**: `nexus_main` (creatuactivo.com) · `marca_personal_v1.0` (luiscabrejo.com) · `ganocafe_main` (ganocafe.online) · hardcoded in `dashboard-ai/route.ts` (queswa.app) · `queswa_whatsapp` (WABA WhatsApp — tenant: `whatsapp`)

## Development Commands

```bash
# Development
npm install          # Install dependencies
npm run dev          # Start dev server at http://localhost:3000
npm run build        # Build for production (TypeScript errors ignored)
npm run start        # Serve the production build (tras npm run build)
npm run lint         # Run ESLint

# Testing (via utility scripts - no test framework configured)
node scripts/test-contador-cupos.mjs              # Test founder spots counter
node scripts/leer-system-prompt.mjs               # View current NEXUS prompt
curl http://localhost:3000/api/nexus              # NEXUS health check

# Deployment
npx supabase functions deploy nexus-queue-processor  # Deploy queue processor
```

**IMPORTANT**: TypeScript build errors are ignored (`ignoreBuildErrors: true` in next.config.js). Builds succeed regardless of type errors.

## Reglas Críticas (NO HACER)

- ⚠️ **El fallback de `getFallbackSystemPrompt()` lleva GUARDARRAÍLES, nunca doctrina** (regla reescrita 9 ago 2026, tras auditarla). El copy, el léxico y los argumentos viven en Supabase; aquí solo van los rieles que deben sobrevivir a una caída: `verbatim_lock`, prohibición de promesa de ingreso, moneda por país, «responda solo con el contexto recuperado» y la normalización de datos —esta última es contrato con `captureProspectData()`, que extrae de las respuestas de Queswa, no de las del usuario. **Motivo del cambio:** la regla vieja decía *no lo toque* para evitar que alguien lo editara creyendo que actualizaba producción; el efecto fue que quedó dos meses sin mantener, con 7 términos retirados y **sin cuatro guardarraíles**, dos de ellos con exposición legal. Un fallback sin doctrina no puede desincronizarse de ella. ⚠️ Dispara solo si fallan la RPC por tenant **y** la consulta directa a `nexus_main`, y **se cachea 5 minutos** — un hipo de Supabase degrada esa instancia Edge todo ese rato
- ❌ **NO agregar** textos de flujo o respuestas verbatim al System Prompt (`system-prompt-nexus-main-v27_2.md`) — el backend es el dictador absoluto. Todo texto que el modelo deba imprimir exacto va en `getMicroPromptApertura()`, `getMicroPromptCierre()`, `getCierreEstado4()` en `route.ts`, o en `src/lib/respuestas-maestras.ts` (Camino A para chip-triggers WHY_02/EAM_01 + regex EMPRESA_DIGITAL_01)
- ❌ **NO nombrar en el ÍNDICE ni en el CUERPO la frase que se quiere evitar.** Escribir *"no diga X"* es dictarle X: el modelo sube la probabilidad de cualquier token del prompt con independencia de su relevancia (*contextual entrainment*), y las instrucciones de ignorarlo apenas lo mitigan. ⚠️ **La cabecera `[Concepto Nuclear]` ya NO llega al modelo** desde el 25 ago 2026 —el fragmentador la recorta—, así que ahí una prohibición puede escribirse en negativo sin costo, que suele ser como mejor se lee. **El riesgo se mudó al `[Índice]`**, que sí se vectoriza: un índice que dice *«no por su velocidad»* atrae justamente esa consulta. ⚠️ Ese es el motivo de fondo por el que la doctrina salió del fragmento: la regla vieja se rompió **siete veces en una semana**, y cuatro más en un solo día, siempre por agentes advertidos que la estaban mirando. Una regla que no se sostiene con disciplina se arregla con arquitectura.
- ❌ **NO atribuirle al pago una duración garantizada.** *"Le pagará de por vida"*, *"renta vitalicia"*, *"flujos perpetuos"*: sin fecha es **peor** que con fecha, porque es perpetuidad. Es promesa de ingreso — Meta la sanciona en el canal y el Estatuto del Consumidor colombiano la vuelve exigible a la empresa. **La recompensa se nombra por su REPETICIÓN:** *"el cliente que nota la diferencia vuelve a comprar, y esa recompra es la que le sostiene el ingreso"*. La durabilidad tiene una sola casa legítima: **FREQ_05**, donde el activo se hereda. ⚠️ Apareció **cinco veces en un solo día** (8 ago) en bocas distintas —el arsenal, dos agentes y el Director— porque es el remate más satisfactorio del argumento. Ver [[feedback_recompensa_repeticion_no_duracion]]
- ❌ **NO narrar en la nota de versión del arsenal lo que se acaba de retirar.** ⚠️ **El motivo cambió — el mecanismo que decía esta regla ya no es real** (verificado 26 ago 2026): el documento padre **no tiene `embedding_512`** y `route.ts` filtra el contexto a `is_fragment === true`, así que la cabecera **nunca llega al modelo**. Lo que sigue vigente es el otro daño, y es el que de verdad muerde: una cabecera con veinticinco entradas citando entrecomillada cada frase retirada es **el primer texto que lee el próximo agente**, y de ahí saca vocabulario que cree vigente. Pasó el 26 ago con *decidir · conectar · ver crecer*, leído de este mismo archivo. **Se enuncia el criterio, no el ejemplo**, y en la cabecera quedan solo la versión actual y las dos previas; el historial va al [CHANGELOG](knowledge_base/CHANGELOG-arsenales.md), que no se indexa
- ❌ **NO cerrar con una pregunta que el arsenal no pueda atender.** Si la pregunta final promete algo que ningún fragmento responde, el modelo lo improvisa — así entró un procedimiento de sucesión inventado en FREQ_05. Antes de escribirla, verificar que exista el fragmento destino (`select category, title from nexus_documents where tenant_id='whatsapp'`), y medir con Voyage si hay duda
- ❌ **NO desplegar copy sin haberlo propuesto antes en el chat** (acuerdo con el Director, 8 ago 2026). Se escribe la respuesta propuesta, él decide, y solo entonces se tocan archivos. Desplegar para después corregir dobla el trabajo y le cuesta tiempo y presupuesto
- ❌ **NO diagnosticar como copy lo que es enrutamiento.** Si Queswa responde algo distinto al texto calibrado, **lo primero es verificar qué fragmento llegó al contexto** (`metadata.documents_used` en `nexus_conversations`, o `benchmark-clasificador.mjs`) — no reescribir la respuesta. Tres pruebas seguidas del Director (9–14 ago) fallaron por puertas, nunca por copy: «cómo se inicia» enrutaba a compensación, «cuánto cuesta empezar» caía en la rama del catálogo, «bola de nieve» no tenía puerta. **Cuando un pin no dispara, el modelo compone** — y al componer vuelven las frases vetadas
- ❌ **NO escribir un regex de cara al prospecto que exija ortografía perfecta.** La gente escribe con el pulgar: `bianrio`, `inciar` y «sí» con tilde tumbaron tres puertas en una sola prueba (el `\b` de JS no cierra tras `í` — usar `(?![a-záéíóúñ])`). Patrones tolerantes ya en código: `b[ia]+n[a-z]?r[a-z]?i?o` · `ini?[cs]iar|empe[zs]ar|comen[zs]ar`. Toda puerta nueva se prueba con tipeos antes de desplegar
- ❌ **NO dejar que una pregunta de PRECIO reciba cifras de COMISIÓN.** Pegar un rendimiento al lado de una inversión («$900.000 → $112.500 por cada uno que entre») es promesa de ingreso. El veto compartido `preguntaSoloPorPrecio` en `route.ts` manda sobre los pines de cifras; los mixtos («¿cuánto cuesta y cuánto se gana?») sí pasan. Aplica igual al copy: en un mismo bloque no conviven precio de entrada y comisión
- ⛔ **NO comitear un archivo que depende de otro modificado que no es suyo.** Si `git status` muestra cambios ajenos en el árbol (otro agente trabajando en paralelo), o van juntos o no va ninguno. El 17 ago 2026 se comiteó `webhook/route.ts` con llamadas a funciones que vivían en `wa-channel.ts` sin comitear ese archivo: **desde ese despliegue todo mensaje entrante reventó** en la primera línea del POST, y una persona escribió y no recibió nada. `git add` de archivos específicos NO protege de esto — protege de subir lo ajeno, no de subir algo que lo necesita. ⚠️ Y **comitear un blob armado sobre una copia de HEAD** (para separar lo propio de lo ajeno en el mismo archivo) tiene una carrera: si el otro agente comitea entre la copia y el `update-index`, el blob le borra su trabajo del historial — pasó el 24 ago 2026 con el webhook y se restauró en el commit siguiente. Antes de `update-index`, re-verificar que HEAD sea el mismo del que salió la copia
- ⛔ **NO dejar que el modelo escriba una cifra que el backend ya conoce.** El reparto es: **el fragmento pone el argumento, el pin pone la cifra**. Vale para los paquetes (`getPaquetesPricingPin` llena los `[PRECIO]` de FREQ_03) y para los productos (`getPinProducto` inyecta nombre, presentación, precio y registro cuando el mensaje nombra uno). Sin el pin el modelo resume el fragmento y **deja caer el precio**, o inventa el nombre — 20 ago: omitió el precio en tres respuestas de Luvoco y llamó *«la Intensa»* a la cápsula Fuerte
- ⛔ **NO confiar en que el modelo copie un texto dictado: si el nodo es determinístico, que lo emita el backend.** «Casi siempre» no es un dictado. Con el pin activo, el arsenal retirado y el log diciendo `dicta=true`, el modelo seguía parafraseando el ejemplo de cifras unas veces sí y otras no. Hoy el ejemplo GEN5/renta lo emite `extraerEjemploDictado()` **sin llamar al modelo** — cero tokens, ~50 ms, y la cifra que sale es la calculada. Mismo patrón: Camino A, el cierre de radicación, el escenario del simulador y la respuesta de ciclos
- ⛔ **NO condicionar una PUERTA a que el enrutamiento acierte.** `PUERTAS_INICIAL` en `route.ts` existe porque el vector falla: son preguntas con respuesta escrita que igual reciben otra (el fragmento correcto es largo, su embedding se diluye, y gana otro por una palabra de superficie). Por eso se evalúan sobre **cualquier arsenal** y sobre **el mensaje CRUDO además de la consulta reescrita** — el CQR puede borrar justo las palabras que abren la puerta. Y por eso mismo el CQR **no reescribe** un mensaje que ya matchea patrón del clasificador ni uno que **nombra un producto**: esa consulta ya es autónoma
- ⛔ **NO servirle al prospecto una tabla escrita para el socio.** `COMP_PV_06` (códigos internos, PV/CV, nombres del back office) existe para quien calcula su recompra; la **lista de precios** del prospecto son las cuatro tablas del catálogo con `<verbatim_lock>` (BEB_01 · LUV_01 · SUP_01 · PERS_01). El 22 ago 2026 un «sí» a *«¿le muestro el catálogo con precios?»* devolvió la tabla de puntos con *Gano Fresh Toothpaste* y *Piel8Brillo* — y había **tres** vías distintas en `route.ts` mandándola (prioridad 1.5 del clasificador, la puerta `comp_pv06_direct` y el bypass de precios), las tres con un motivo de abril que el candado de mayo volvió falso. Hoy las tres exigen PV/CV/puntos. ⚠️ El benchmark del clasificador **no ve** estas prioridades inline —solo lee los arrays— así que un cambio ahí se sondea en producción (`metadata.search_method` de la conversación)
- ⚠️ **El webhook responde a Meta ANTES de trabajar** (20 ago 2026): `POST` acusa 200 en milisegundos y el trabajo sigue en `procesarEntrante` bajo `waitUntil`, con `maxDuration = 90`. ⚠️ `waitUntil` **no regala tiempo** —la promesa muere con el mismo techo—; lo que cambia es que el reloj ya no lo mira Meta. Guarda contra reenvíos: tabla `wa_mensajes_procesados` con el `wamid` como llave primaria, que **falla hacia procesar** — una respuesta repetida es un bochorno, una persona sin respuesta es una venta perdida
- ⚠️ **El motor NO sabe lo que manda el webhook.** La foto de producto la envía el webhook, y sin avisarle el modelo respondía *«por este canal no puedo enviar imágenes»* justo debajo de la imagen que la persona acababa de recibir. Si el mensaje pide SOLO la foto, el webhook cierra el turno entero (imagen + pregunta dictada **dentro del pie**, porque un texto aparte llega ANTES que la imagen); si además pregunta algo, sigue al motor con `pageContext: 'whatsapp_foto_enviada'`
- ⛔ **NO desplegar copy nuevo del canal sin correr las TRES baterías.** El webhook tiene tres filtros de salida y cada uno tiene la suya: `test-guardarrail-salud.mjs` · `test-guardarrail-negocio.mjs` · `benchmark-clasificador.mjs --tenant whatsapp`. Las dos primeras verifican **las dos direcciones** —que bloqueen lo grave Y que no toquen los candados ni el copy aprobado—, y así deben mantenerse: bloquear una respuesta buena le cuesta una venta al socio, que también es daño. Detalle y criterio de calibración → [HANDOFF_CANAL_17AGO2026.md](docs/handoff/queswa/HANDOFF_CANAL_17AGO2026.md)
- ⚠️ **Los guardarraíles de salud y negocio viven SOLO en el webhook de WhatsApp.** `/api/nexus` no tiene ninguno, así que la web y ganocafe.online responden sin filtro. Es pendiente conocido, no un descuido — no asumir que el motor está protegido
- ❌ **NO agregar disparadores a un fragmento largo esperando abrir una puerta nueva.** El fragmento se embebe completo, así que una frase suelta no mueve el vector: probado con BEB_02 (~1.500 caracteres), el score no cambió un punto. **Lo que funciona es un fragmento CORTO**, donde la consulta domine la señal — `FAQ_05` pasó de no recuperar nada a 0.507 con cuatro líneas
- ❌ **NO editar** los textos verbatim de `src/lib/respuestas-maestras.ts` sin sincronizar los bloques `<verbatim_lock>...</verbatim_lock>` en `knowledge_base/arsenal_inicial.txt` (WHY_02 BLOQUE 1, EAM_01 BLOQUE 8). Son fuente dual — backend dictador + RAG fallback. **El contrato es de PREFIJO** (14 ago 2026): el candado = el texto del TS **menos la pregunta de cierre**, que por regla vive fuera del candado para poder adaptarse. Verificar con `lock.startswith(master)` tras quitar la pregunta, no con igualdad total
- ❌ **NO regresar** los marcadores XML `<verbatim_lock>` a corchetes planos `[VERBATIM_LOCK]`. La investigación Gemini (18 May 2026) confirmó que Claude Sonnet 4.6 reconoce XML tags como señales de activación de atención, mientras que los corchetes planos son texto inerte. Migración aplicada en v25.8/v26.8.
- ❌ **NO modificar** el texto de `getCierreEstado4()` sin actualizar los regex de detección en `route.ts` — hoy son `_handoffYaEntregado` (`/WhatsApp Directo de Activación|mesa directiva|sintetizado su evaluación|Su acceso oficial está aquí/i`) y `nombreSolicitado` (`grep -n "nombreSolicitado" src/app/api/nexus/route.ts`). Si el texto cambia y los regex no, el FSM genera handoffs duplicados o pierde estado. ⚠️ **No cite números de línea aquí** — `route.ts` tiene ~4.800 líneas y se corren en cada edición; use `grep -n` sobre el identificador
- ❌ **NO re-introducir** la extracción de `package` desde `extractFromClaudeResponse()` (eliminado 22 May 2026, Fix G). Causaba contaminación silenciosa de `data.package` cada vez que Claude mencionaba el paquete en una respuesta informativa ("ESP-3 incluye 35 productos"). La captura debe venir **exclusivamente** del usuario con `packageMap` + guard de pregunta informativa.
- ❌ **NO disparar Estado 4 sin validar nombre** — el FSM debe verificar con `extractNameFromHandoffReply()` que el usuario respondió con un nombre. Si responde con pregunta o pide pausar, mantener Estado 0 (responder libre) y conservar `package` en BD para el próximo intento. Bug crítico documentado QA 22 May 2026.
- ❌ **NO eliminar `<verbatim_lock>` de PROD_OVERVIEW/BEB_01/LUV_01/SUP_01/PERS_01** en `catalogo_productos.txt`. Sin él, el modelo aluciona nombres simplificados ("Ganotea" en lugar de Oleaf Gano Rooibos, "Gano Cocoa" en lugar de Gano Schokolade, "Gano Supreme" inexistente) y omite categorías enteras (mencionando solo 2 de 4). Bug confirmado QA 22 May 2026, resuelto con v7.2.
- ❌ **NO re-implementar Anthropic Prompt Caching** — ya está activo en `route.ts` con 3 bloques (system base + arsenal + session instructions); localícelo con `grep -n "cache_control" src/app/api/nexus/route.ts`. Logging `[CACHE HIT]`/`[CACHE MISS]` (`cache_read` vs `cache_creation`) unas 30 líneas más abajo. Gemini lo propuso como "Fase 3" en investigación May 2026 sin saber que ya existe — verificado en Fase 0 (23 May 2026). Solo medir hit rate cuando llegue tráfico real.
- ❌ **NO agregar** lógica de consentimiento a route.ts o System Prompt de NEXUS (Cookie Banner in [src/components/CookieBanner.tsx](src/components/CookieBanner.tsx) handles all consent UX)
- ❌ **NO guardar** PII en localStorage (solo fingerprint/session IDs)
- ❌ **NO hacer commit** de `.env.local`, API keys o secretos
- ❌ **NO agregar** `backdropFilter: blur()` en cards del homepage — elimina GPU compositing en paint inicial
- ❌ **NO agregar** `priority` a imágenes decorativas del hero — usar `loading="lazy"` para que no compitan con LCP
- ❌ **NO editar** archivos `*.tsx.bak` — son respaldos inactivos, no fuente viva
- ❌ **NO declarar** un segundo `<h1>` en el cuerpo si la página ya usa `<IndustrialHeader>` — rompe SEO/a11y. Si necesitas un título visualmente prominente, usa `<h2>` con `font-serif`. Bug recurrente — ver [BRANDING.md §2, jerarquía de encabezados](BRANDING.md#jerarquía-de-encabezados-regla-unificada--23-may-2026)
- ❌ **NO usar** `fontFamily` con fuentes que no estén cargadas en [src/app/layout.tsx](src/app/layout.tsx) — el navegador hará fallback genérico y el H1 se verá distinto al resto del sitio (caso histórico: Rajdhani en `/paquetes`)
- ❌ **NO usar** `clip-path: polygon(...)` biselado en botones — viola la investigación de branding ("estética cyberpunk antitética a la construcción de patrimonio"). Border-radius del sistema es suficiente
- ⚠️ `queswa.app` es un **repositorio separado** — su código no está en este repo. No buscar `dashboard-ai/route.ts` aquí

## Performance — Estado Actual (Abr 2026)

**Historial LCP homepage** (`/`):

| Fecha | LCP | Speed Index | Cambio |
|-------|-----|-------------|--------|
| Línea base | 6.5s | 4.5s | — |
| Imágenes WebP + next/image | 3.8s | 2.6s | turbina.webp + hormigon-tile.webp |
| force-static homepage | 2.9s | — | TTFB CDN edge ~20ms |
| turbina lazy + CSS gradient LCP | 2.7s | 1.7s | LCP = H1 texto, no imagen |
| backdropFilter eliminado + DeferredOrb | 2.5s | 2.0s | Framer 114KB diferido |
| Cache-Control s-maxage=86400 | 2.5s | 2.0s | CDN cachea HTML 24h |

**Decisiones de arquitectura de performance (NO revertir):**

- **`export const dynamic = 'force-static'`** en [src/app/page.tsx](src/app/page.tsx) — homepage pre-renderizado en build time, servido desde CDN edge
- **Turbina hero con `loading="lazy"`** — el LCP es el H1 texto (no requiere request de red adicional); turbina aparece ~2s después sin bloquear
- **`DeferredOrb`** en [src/components/DeferredOrb.tsx](src/components/DeferredOrb.tsx) — envuelve `UnifiedQueswaOrb` y difiere la carga de Framer Motion (114KB) hasta el primer evento del usuario (scroll/mousemove/touchstart). Fallback: carga a los 3s si no hubo interacción
- **`globals.css` limpio** — reducido de 374 líneas a 166 líneas (9.3KB → 4.3KB). ~18 clases y 4 keyframes eliminados por no tener uso en el proyecto
- **3 fuentes** (Playfair Display, Inter, Roboto Mono) — Montserrat, Oswald y Rajdhani NO están cargadas en la web. `BRAND.fonts` en [src/lib/branding.ts](src/lib/branding.ts) son stacks web-safe SOLO para emails (los keys muertos `industrial`/`logo` con Rajdhani se eliminaron jul 2026)
- **Preconnects mínimos** en layout.tsx — solo Material Symbols async. Los preconnects de Google Fonts y Supabase fueron eliminados (next/font self-hostea, Queswa carga lazy)
- **`hormigon-tile.webp`** en [public/images/servilleta/hormigon-tile.webp](public/images/servilleta/hormigon-tile.webp) — tile 200×200px de 2KB reemplaza `fondo-global-hormigon.jpg` (299KB) en 12 páginas
- **Cache-Control HTML** en `next.config.js` — `s-maxage=86400, stale-while-revalidate=604800` para todas las páginas excepto `/api/*`

**Techo realista con arquitectura actual:** ~2.3–2.5s LCP en PSI (simulación mobile 3G). Llegar a <1.5s requeriría Critical CSS extraction (frágil con Tailwind) o migrar a servidor con LiteSpeed/full-page cache.

## Critical Git Workflow

**BEFORE any development work**:
```bash
git status  # MUST verify repository is working
```

This repository has **lost its `.git` directory** in the past. Always verify git status before starting work.

**Symptoms of missing .git**:
- ❌ `git status` returns "fatal: no es un repositorio git"
- ❌ Production shows old code despite local changes working
- ⚠️ Vercel deployments show "vercel deploy" instead of `main` branch

**If .git is missing**:
```bash
git init
git remote add origin https://github.com/LuisCabrejo/creatuactivo.com.git
git fetch origin main
git reset --hard origin/main  # WARNING: Overwrites local files
# Restore your changes, then:
git add [files]
git commit -m "✨ Your message"
git push -u origin main
```

**Standard workflow**:
```bash
git status              # Verify repository works
git add [files]
git commit -m "✨ feat: Description"
git push origin main
# ALWAYS verify on GitHub that changes uploaded
```

**Commit Convention** (Conventional Commits):
- `feat(scope):` - New features
- `fix(scope):` - Bug fixes
- `style(scope):` - Visual/style changes
- `content(scope):` - Content updates
- `refactor(scope):` - Code refactoring

## Architecture Overview

### Core System: El Método Comprobado

**De cara al prospecto son DOS acciones, y la multiplicación es la consecuencia** (8 ago 2026):

1. **Compartir** — usted pasa un enlace a quien quiera.
2. **Recibir** — usted saluda a quien llega con interés.

De esa sencillez salen **la multiplicación del negocio y el aumento de la facturación**, porque quien entra hace exactamente lo mismo. La multiplicación se nombra como **resultado, nunca como un tercer paso**: como tarea suma peso, como consecuencia lo quita.

⚠️ **Las dos acciones nunca van solas.** Entre una y otra va **quién hace el trabajo** — Queswa conversa, resuelve dudas y madura la decisión; Gano Excel fabrica y despacha. Sin eso, dos acciones tan simples se leen como una promesa sin causa, que es la forma exacta de una estafa y el primero de los tres desafíos del modelo.

⚠️ **CUMPLIMIENTO — la consecuencia que se nombra es del NEGOCIO** (multiplicación, facturación), nunca un pago al usuario con día ni monto. Encadenar acciones simples a un pago fechado es una **promesa de ingreso**: Meta la sanciona en el canal —el WABA está atado a la cuenta de anuncios verificada— y en Colombia el Estatuto del Consumidor la vuelve **vinculante para la empresa**. Ver [[feedback_nunca_prometer_pago_fechado]].

**Rol del usuario — es DUEÑO, y el rol no se nombra como cargo** (8 ago 2026):
- La identidad correcta es la más ligera y más cierta: **usted es el dueño**. El canal es suyo y usted decide con quién lo comparte.
- Palabras como *dirigir* o *Director* evocan hojas de cálculo y reuniones, y le piden al lector una identidad que todavía no se atribuye. ⚠️ **Al hablar del rol entre nosotros** se usan los verbos **decidir · conectar · ver crecer** — pero eso es doctrina interna, **jamás una lista de acciones que se le entregue al prospecto**. Las acciones son **Compartir y Recibir**, siempre, y las dicta `EAM_01`. El 26 ago 2026 la tríada se coló como copy en el arsenal y creó un tercer vocabulario para lo mismo (Director: *«es mejor que tengan una directriz clara sobre cuáles son las acciones»*).
- La sensación que debe producir es la de abrir Uber o Nubank: dos toques. **El producto se eleva; la acción se trivializa** — ver [[feedback_tres_desafios_del_modelo]].
- ⚠️ Los nombres históricos (Tridente EAM · Expandir/Activar/Multiplicación · Arquitecto de Patrimonio · Propietario de Base Operativa · Máquina Híbrida) viven solo como historia en los CHANGELOG. No se usan.


**Respuestas canónicas** — la fuente viva es siempre `knowledge_base/arsenal_inicial.txt`, y **aquí no se transcribe ninguna**: se reescriben cada semana y una copia en este archivo envejece en días. Cinco llevan `<verbatim_lock>` sincronizado carácter por carácter con `src/lib/respuestas-maestras.ts` — **WHY_02 · WHY_04 (`MASTER_DINERO_01`) · EAM_01 · EMPRESA_DIGITAL_01 · INVERSION_MARKETING_01** (Camino A). Para ver una respuesta, léala del `.txt`; para saber por qué quedó así, el `[Concepto Nuclear]` de su cabecera y el [CHANGELOG](knowledge_base/CHANGELOG-arsenales.md).

### 1. NEXUS AI Chatbot

**Naming**: User-facing brand is "Queswa" (since v15.0). Code/components still use "NEXUS" prefix (no refactor planned). Use "Queswa" in UI text, "NEXUS" in code references.

**Ecosistema de proyectos** (todos comparten el mismo Supabase DB):

| Proyecto | Rol de Queswa | System Prompt | Estado |
|----------|---------------|---------------|--------|
| `creatuactivo.com` | Filtrar prospectos para funnel Fundadores | `nexus_main` | Activo |
| `luiscabrejo.com` | Marca personal — posicionar a Luis, redirigir a creatuactivo.com | `marca_personal_v1.0` | Activo (Mar 2026) |
| `queswa.app` | Chief of Staff del Director Ejecutivo — CRM + pipeline + mensajes | `queswa_dashboard` (en route.ts) | Activo (Mar 2026) |
| `ganocafe.online` | Soporte de producto + venta directa e-commerce | `ganocafe_main` | Activo (Mar 2026) |
| **WABA WhatsApp** | Responde prospectos inbound desde anuncios Meta + orgánico | `queswa_whatsapp` — consultar la versión viva (ver abajo) | Activo — negocio **verificado** y WABA **APPROVED** |

**Regla crítica multi-proyecto**: Un cambio en `system_prompts.nexus_main` afecta SOLO `creatuactivo.com` (caché 5 min). `luiscabrejo.com` usa `marca_personal_v1.0` — prompts independientes desde Mar 2026.

**En `luiscabrejo.com`**: tenant hardcodeado como `marca_personal` en `route.ts` (sin middleware — repo siempre es ese tenant). La ruta `/api/claude-chat/route.ts` es legacy sin uso.

**Estado integración ganocafe.online** (piloto activo · detalle → `docs/handoff/queswa/HANDOFF-GANOCAFE-WIDGET.md`):
- Prompt `ganocafe_main` **v1.5** + `arsenal_ganocafe.txt` (16 respuestas) + 16 fragmentos Voyage, todo tenant `ecommerce`. v1.5 incluye `## NOMBRES COLOQUIALES` (alias → producto).
- ⚠️ **`ganocafe_main` tiene catálogo de precios hardcodeado** en el system prompt (línea "NUNCA uses otros precios") → el modelo ignora el vector search para precios. Al cambiar precios en el arsenal, **también actualizar el system prompt** con `node scripts/actualizar-system-prompt-ganocafe-v1.3.mjs`. Los dos deben estar sincronizados.
- Widget JS embebido en `/cafe-3en1/index.html` (cPanel, piloto Google Ads CO). Deploy arsenal: `scripts/deploy-arsenal-ganocafe.mjs`. Rollout WordPress ⏳.

**Arquitectura widget externo** (ganocafe.online → creatuactivo.com API):
```
ganocafe.online/cafe-3en1/index.html
  └─ widget JS llama POST https://creatuactivo.com/api/nexus
       └─ headers: { 'x-tenant-id': 'ecommerce', 'Content-Type': 'application/json' }
            └─ Supabase carga ganocafe_main + arsenal_ganocafe (tenant: ecommerce)
```

**CORS config** (`src/app/api/nexus/route.ts`):
- Handler `OPTIONS` para preflight (status 204)
- `getCorsHeaders()` en respuesta POST y error fallback
- Dominios permitidos: ganocafe.online, creatuactivo.com, luiscabrejo.com, queswa.app

**Handoff doc para agente widget**: `docs/handoff/queswa/HANDOFF-GANOCAFE-WIDGET.md`

**WhatsApp WABA** — canal operativo. 📄 **Estado de la cuenta de Meta, diagrama del flujo y decisiones en curso → [docs/handoff/queswa/WABA_REFERENCIA.md](docs/handoff/queswa/WABA_REFERENCIA.md)** y [HANDOFF_SESION_CANAL_Y_HOOK_AGO2026.md](docs/handoff/queswa/HANDOFF_SESION_CANAL_Y_HOOK_AGO2026.md). **No duplique aquí el estado de Meta** — cambia solo y se desincroniza.

Webhook `/api/whatsapp/webhook` (Node, 90 s) → adaptador de canal: extrae número, texto y `referral` de CTWA, inserta el prospecto (`fingerprint: wa_{phone}`), llama a `/api/nexus` con `x-tenant-id: whatsapp`, y responde por Graph API. Prompt `queswa_whatsapp`, fuente `knowledge_base/system-prompt-queswa-whatsapp-v4.md`.

**Lo que rompe el canal si se ignora:**

- ⛔ **Quien escribe con nombre de usuario NO va en `to` — va en `recipient`** (21 ago 2026). Meta oculta el teléfono detrás de un **BSUID** (`CO.1497020585516131`) y lo reparte entre `from`, `wa_id` y `user_id` **sin garantía de cuál trae qué**: del mismo remitente llegó prefijado en un turno y pelado en el siguiente. Por eso `wa-channel.ts` elige la identidad **por forma** (teléfono real primero, luego el prefijado; si ningún campo lo trae, se rescata del `wamid`, que lo lleva codificado) y arma el destinatario con `destinatario()`: BSUID → `recipient` + `recipient_type`, **sin `to`**. ⚠️ **La trampa es que un BSUID en `to` NO da error**: Meta responde 200 con identificador de mensaje, lo resuelve a la forma sin prefijo y lo descarta después con **#131026** en un aviso de estado aparte. Falla en silencio y con apariencia de entregado — costó cinco rondas de prueba, con uno de cada cinco números viendo «escribiendo…» y sin recibir nada. **Se diagnostica con `select * from wa_envios_fallidos`**, la tabla donde el webhook guarda lo que Meta acepta y no entrega (el log de Vercel se pierde en minutos); los cuatro campos de identidad de cada mensaje quedan en `wa_mensajes_procesados.identidad`
- ⚠️ **Tres números, no confundirlos**: `+57 321 519 3909` = el WABA (Queswa) · `+57 320 341 5438` = el personal de Luis (el 1-a-1) · `+57 320 680 5737` = su WhatsApp Business, `WHATSAPP_ORGANICO_DEFAULT` (fallback de reels).
- ⛔ **NO tocar el nombre visible mientras `name_status` esté en revisión** — cada guardado abre una solicitud que pisa la anterior; así se perdió una aprobación previa. Meta permite 10 cambios cada 30 días. ✅ **La revisión de «Queswa» terminó** (auditado 21 ago 2026): `verified_name: Queswa`, `new_name_status: NONE` — no hay solicitud en cola y **no quedó en `DECLINED`**. ⚠️ `name_status` devuelve **`NON_EXISTS`**, que **no está en la lista oficial de Meta** (APPROVED · AVAILABLE_WITHOUT_REVIEW · DECLINED · EXPIRED · PENDING_REVIEW · NONE) y es idéntico de v19 a v24; **no es ausencia de certificado sino ausencia de expediente de revisión** — comprobado enviando `hello_world` a un teléfono real: el chat muestra **Queswa** como nombre verificado. ⚠️ **La API nunca dice `APPROVED` en este número, así que no lo lea como rechazo ni vuelva a someter el nombre.** Y si comprueba de nuevo: WhatsApp pone el nombre de Meta en la **segunda línea** del encabezado cuando el número está guardado en contactos — la primera línea es el nombre local del teléfono y no prueba nada
- ⛔ **NO ejecutar `request_code` / `verify_code`** sobre un número `CONNECTED` que funciona. `code_verification_status: EXPIRED` **no bloquea el envío** (medido el 4 ago); el error #131037 era un riesgo del manual, no algo activo.
- ⚠️ **Ventana de 24 h**: si la persona escribe primero se responde en **texto libre**; iniciar conversación con quien nunca escribió **exige plantilla aprobada**, sin excepción.
- ⚠️ **`clonar-arsenal-whatsapp.mjs` NO actualiza lo existente** — solo inserta categorías nuevas. Para propagar fragmentos *modificados* hay que **purgar primero** en el tenant whatsapp; si no, quedan stale.
- ⛔ **NO modificar `/api/nexus/route.ts` por WhatsApp.** El webhook es solo adaptador de canal; toda la lógica de IA vive en el motor.
- ⚠️ **Flow del simulador** (`WHATSAPP_FLOW_SIMULADOR_ID`, mismo ID en Vercel): las descripciones de `NavigationList` admiten **máx 20 caracteres** — el validador de publicación de Meta NO lo revisa, el runtime del teléfono sí (el Flow estuvo `PUBLISHED` y era imposible de abrir). Para diagnosticar: la **vista previa interactiva** (`?fields=preview.invalidate(true)`) muestra el error completo. ⚠️ **El runtime de Flows NO acepta condiciones sobre dos campos** (medido a golpes, 25 ago 2026): `A == 'x' && B == 'y'` falla por gramática —con o sin paréntesis—, el `If` anidado bajo `Form` excede su conteo de niveles, y `Switch` tumba el validador con un error interno. Límites globales que también muerden: **máx 10 ramas de navegación en todo el Flow** (ya usa 9) y **máx 2 `NavigationList`**; los `id` de pantalla **no admiten dígitos** (por eso todas deletrean: `RENTA_DIECISIETE`). La salida que cabe en todo: **un solo desplegable con las combinaciones** (`10x4`) e `If` planos de una variable; el webhook decodifica (`escenario` → clientes + consumo, bloque del simulador en `webhook/route.ts`). Actualizar vía API devuelve el Flow a DRAFT → republicar con `POST /<FLOW_ID>/publish`. **Copia versionada del JSON**: [docs/handoff/queswa/flows/simulador-de-ingresos.flow.json](docs/handoff/queswa/flows/simulador-de-ingresos.flow.json) — el builder de Meta no es fuente versionada. El webhook lo envía pegado a la oferta de números (pantalla RENTA_MENU por defecto — prioridad del ingreso recurrente, decisión del Director 14 ago).
- ⚠️ **El cierre del canal no cobra peaje** (14 ago 2026): los cuatro datos de la radicación **nunca condicionan una respuesta**. Ante una digresión se responde completo; la primera vez se recuerda en una línea qué falta, después se suelta y se retoma tras un par de respuestas. En la **primera** digresión con algún dato capturado, el equipo recibe la plantilla con lo que hay y qué falta (`avisarInteresParcial` en wa-radicacion.ts) — el cierre en persona es parte del diseño. Regla viva en el prompt `queswa_whatsapp` («Los datos nunca son peaje») y red de digresión en `gestionarCierre`.
- ⛔ **La FSM de cierre del motor NO aplica a WhatsApp** (aislada 5 ago 2026): sus estados 2/3/4 fueron escritos para la web y su último paso entrega enlaces `wa.me` al propio WABA — a alguien que ya está escribiendo desde ahí. El guard es `cierreLoManejaElCanal` (`tenantId === 'whatsapp'`). El cierre del canal vive en [src/lib/wa-radicacion.ts](src/lib/wa-radicacion.ts) → `pending_activations`. **No reactivar la FSM web para este tenant.**
- ⚠️ **`src/lib/wa-channel.ts` es el ÚNICO lugar que habla con graph.facebook.com** y que conoce `WHATSAPP_SYSTEM_TOKEN`. El Dashboard opera el canal por el puente `/api/wa/assets` + `/api/wa/send`, autenticado con `x-wa-bridge-secret`; **si la env no está definida el puente DENIEGA** (503) en vez de abrirse. No copiar el token al Dashboard.
- 🟢 **El App Review de Meta NO hace falta para este caso de uso** (auditoría cerrada 26 jul 2026): sobre activos propios basta el *Acceso estándar*. Solo se retoma si se decide que cada socio conecte su propio número.

**Fotos de producto** (20 ago 2026): Queswa manda la foto cuando se la piden. Las 22 son estáticas en `public/productos/compuestas/{slug}.jpg` y se sirven por CDN —el envío no toca nuestro servidor—; las genera `scripts/componer-imagenes-producto.mjs` componiendo el PNG oficial sobre la placa de marca (`public/productos/_set/placa-1080.png`, extraída de las escenas del Dashboard). **1080×1080 y no 9:16**: el 9:16 es formato de Estado, y WhatsApp recorta a cuadrado por su cuenta la imagen de un chat, normalmente cortando el producto. ⚠️ **El producto es la foto REAL, nunca generado por IA** — un empaque dibujado es un producto que no existe. Y si el mensaje no nombra producto («dame una imagen»), se toma del hilo, dando prioridad a lo que dijo la PERSONA sobre lo que dijo el bot. **Imágenes de familia** (22 ago 2026): `categoria-{bebidas,suplementos,cuidado-personal,luvoco}.jpg` y `portafolio.jpg` en la misma carpeta, generadas por `scripts/componer-imagenes-categoria.mjs` — misma placa, mismo título y marca de agua; solo nombre de categoría y conteo, sin precio. Los productos guardan **proporción real entre sí** (`ALTO_REAL`, medida sobre `public/productos/productos.webp`) y van juntos, no repartidos. Las familias usan `public/productos/_set/limpios/{slug}.png` —las fotos de estudio de ganoexcel.com.co sin hongos ni frutas, con el fondo quitado por `scripts/recortar-fondo-birefnet.py`— y caen al PNG oficial solo si falta alguno; **las individuales siguen usando el PNG oficial con hongo a propósito** (allí la decoración suma). ⚠️ **La imagen individual de la máquina Luvoco es la máquina SOLA** (`luvoco55-1-1024x1024.png`, también en el catálogo web): con las cajas al lado la persona entendía que venían incluidas; el PNG del sistema completo queda solo para `categoria-luvoco.jpg`. **El webhook las envía** (22 ago 2026, bloque 2.25a, antes que la foto de producto): cuando la persona pide VER una línea o todos los productos con palabra de imagen («muéstreme las bebidas», «foto de todos los productos»), cuando acepta la oferta con la que cerró el turno anterior («¿le muestro las demás bebidas?» → «sí»), o cuando nombra una línea después de que el pie del portafolio preguntó cuál acercar. El pie lleva la lista con precios (el portafolio, solo el conteo por línea). Detección en `FAMILIAS_WA` / `detectarFamilia()` de `wa-productos.ts` — los patrones son **colectivos** (plural, «línea», «todos») para que «las cápsulas» sea la línea y «las cápsulas de ganoderma» el producto. ⚠️ **Imagen ≠ catálogo:** quien dice «catálogo» (o «enlace/página de productos») recibe el **ENLACE con el ref del socio** (`/{slug}/productos`, bloque 2.24 `pideEnlaceCatalogo`, que corre antes) — la imagen es para mirar en el chat, el catálogo es para comprar.

**Scripts:** `actualizar-system-prompt-whatsapp-v4.mjs` (despliega el prompt) · `clonar-arsenal-whatsapp.mjs` (ver la advertencia de arriba).


**Key Files**:
- [src/app/api/nexus/route.ts](src/app/api/nexus/route.ts) - Main API (v14.9, FSM architecture — backend como dictador absoluto Abr 2026)
- [src/app/api/nexus/producer/route.ts](src/app/api/nexus/producer/route.ts) - **PREFERRED** async queue producer
- [src/app/api/nexus/tts/route.ts](src/app/api/nexus/tts/route.ts) - TTS endpoint (ElevenLabs → OpenAI fallback, Edge, 30s)
- [src/app/api/voice-command/route.ts](src/app/api/voice-command/route.ts) - Voice pipeline: Whisper → Claude Haiku → ElevenLabs (Node, 60s)
- [src/lib/vectorSearch.ts](src/lib/vectorSearch.ts) - Voyage AI embeddings + semantic search (multi-tenant: `tenantId` param)
- [src/components/UnifiedQueswaOrb.tsx](src/components/UnifiedQueswaOrb.tsx) - **Orbe unificado** (reemplaza NEXUSFloatingButton + VoiceCommandButton)
- [src/components/nexus/useNEXUSChat.ts](src/components/nexus/useNEXUSChat.ts) - React hook for chat state
- [src/components/nexus/NEXUSWidget.tsx](src/components/nexus/NEXUSWidget.tsx) - Chat UI container (incluye botón TTS por mensaje)
- [src/components/nexus/NEXUSFloatingButton.tsx](src/components/nexus/NEXUSFloatingButton.tsx) - Legacy (ya no usado en layout, conservado para servilleta events)
- [src/components/nexus/Chat.tsx](src/components/nexus/Chat.tsx) - Chat message rendering
- [src/components/nexus/NEXUSDataCaptureCard.tsx](src/components/nexus/NEXUSDataCaptureCard.tsx) - Data capture UI
- [src/components/nexus/useSlidingViewport.ts](src/components/nexus/useSlidingViewport.ts) - Mobile viewport handling

**How It Works**:
1. **Fragmented Vector Search** (v14.9) — 7 arsenales fragmentados con embeddings Voyage AI (95% menos tokens de entrada).

> ⚠️ **Aquí NO se escriben números de versión ni conteos de fragmentos.** Cambian cada semana, nadie los actualiza al desplegar, y un dato viejo dentro del archivo que se carga en cada sesión tiene apariencia de autoridad. **Dónde está la verdad:** la versión de cada arsenal, en la cabecera de su `.txt`; lo que corre en Supabase, con `node scripts/sql.mjs -e "select tenant_id, count(*) from nexus_documents where (metadata->>'is_fragment')::boolean is true group by 1"`; los system prompts, con `node scripts/leer-system-prompt.mjs` o la misma consulta sobre `system_prompts`.

| Arsenal | Tenant | Contenido |
|---------|--------|-----------|
| `arsenal_inicial` | creatuactivo_marketing + clon en `whatsapp` | Doctrina base: WHY, STORY, VS, PERFIL, FREQ, CRED, OBJ, VOICE, EAM, CIERRE, ACTIVACION, EMPRESA_DIGITAL, NET, DIASPORA. Cinco fragmentos son **doble fuente** con `respuestas-maestras.ts` (ver Camino A) |
| `arsenal_avanzado` | creatuactivo_marketing + clon | Objeciones complejas, mecánica técnica, cierre y el Método. ⚠️ Cifras del plan INTACTAS |
| `arsenal_compensacion` | creatuactivo_marketing + clon | Plan de compensación completo. ⚠️ **Cifras, %, GCV, PV/CV, tasas y nombres del plan NO se tocan** — los swaps léxicos son solo de marca. Término "PVP" prohibido |
| `arsenal_12_niveles` | creatuactivo_marketing + clon | Los 12 Niveles + Kit de Inicio. Activa con "12 niveles" / "kit de inicio" / "2×2" / "duplicación" / "103 millones" / "simulador" |
| `catalogo_productos` | creatuactivo_marketing + clon | 22 productos, **cada uno con su respuesta propia desde v7.5** (20 ago 2026). Antes faltaban 16: preguntar por el Ganocafé Clásico devolvía la ficha del 3 en 1 —composición, presentación y precio, todo del producto equivocado— y el modelo la presentaba con seguridad. ⚠️ El deseo se construye desde lo **sensorial y el ritual**, nunca desde la salud; de la ficha web se toman los HECHOS —ingredientes, preparación, presentación, precio— y se dejan fuera sus `benefits`. **La página `/productos` quedó reescrita el 22 ago 2026** (catálogo v7.6): sus 22 declaraciones de órgano, mecanismo celular y prevención llevaban meses publicadas y hoy no queda ninguna; el detalle, en el CHANGELOG. ⚠️ **No es fuente confiable de composición ni de categoría** (auditoría 17 ago 2026 contra ganoexcel.com.co): 14 de 22 con discrepancia grave — alérgenos omitidos, cuatro bebidas clasificadas como alimento cuando el fabricante las registra como suplemento dietario, y el disclaimer global falso para 7 de 19. **Antes de citar composición, verificar la ficha oficial.** Los precios y presentaciones sí son válidos: su fuente son las capturas del back office en `public/contexto/capturas/productos/`. Detalle → handoff del 17 ago. PROD_OVERVIEW y las tablas por categoría llevan `<verbatim_lock>` — sin él el modelo alucina nombres y omite categorías |
| `arsenal_marca_personal` | marca_personal | Identidad, historia y metodología de Luis Cabrejo — para luiscabrejo.com |
| `arsenal_ganocafe` | ecommerce | Productos GanoCafe — para ganocafe.online |

⚠️ **Los tenants `creatuactivo_marketing`, `whatsapp` y `dashboard` deben tener exactamente los mismos fragmentos.** Todo despliegue termina clonando **a los dos derivados**; si los conteos difieren, algo quedó a medias.


**Historial completo de cambios por arsenal** → [knowledge_base/CHANGELOG-arsenales.md](knowledge_base/CHANGELOG-arsenales.md)

2. **Clasificación de documentos — 3 capas + override**:
   - **PASO -2 (CQR — anclaje de la consulta)**: [src/lib/query-rewrite.ts](src/lib/query-rewrite.ts) colapsa la conversación en una consulta autónoma **antes** de buscar. Sin ancla temática, un "sí", "panadero" o "y eso cómo sería" recupera ruido y el modelo rellena el vacío con su memoria de entrenamiento (donde "empresa digital" = infoproductos). ⚠️ **Hoy está limitado al tenant `whatsapp`** y se salta en precios / query simple / flujo de cierre — ver el bloque `consultaRecuperacion` en `route.ts`. Gate barato `necesitaReescritura()` (≤8 palabras o deíctico) evita pagar la llamada al modelo; **degrada con gracia** — si falla, se busca con el mensaje original
   - **PASO -2 (CQR + aceptación, solo tenant `whatsapp`)**: antes de buscar, la consulta se ancla. **Una aceptación pelada («sí», «dale») busca con la última pregunta del bot** — determinístico, el CQR no corre. **Un mensaje que ya matchea patrón del clasificador se basta solo** — el CQR tampoco corre (Haiku le inyectaba contexto de la conversación a preguntas autónomas: «hay formación?» terminó en compensación). El CQR queda para lo genuinamente dependiente del hilo. Fuente: [src/lib/query-rewrite.ts](src/lib/query-rewrite.ts) + bloque `consultaRecuperacion` en route.ts
   - **PASO -1 (MenuExpansion)**: Opciones a/b/c/d del menú inicial se expanden a queries semánticas
   - **PASO 0 (Patrones — corre PRIMERO)**: `clasificarDocumentoHibrido()`, regex, 0ms, corta el circuito si matchea. ⚠️ El orden de los arrays importa: compensación se evalúa antes que inicial, y un patrón mal ubicado ahí desvía la pregunta más común (así falló «cómo se inicia», 13 ago). Batería de regresión: `node scripts/benchmark-clasificador.mjs --tenant whatsapp` (exit 1 si falla)
   - **PASO 1 (Vector — solo si patrones devuelve null)**: Voyage AI sobre FRAGMENTOS (no docs padre — esos no tienen embedding), threshold 0.4, con alcance por tenant. El arsenal ganador se deriva de la categoría del mejor fragmento
   - **PASO 1.5 (Override crítico)**: Previene falsos positivos vectoriales. Si el vector devuelve `arsenal_compensacion` pero la query es "cómo funciona el negocio" o variante → fuerza `arsenal_inicial`. Está en el array `patrones_inicial` de `clasificarDocumentoHibrido()` (buscar el comentario `FIX 2026-05-19: WHY_02`).
   - ⚠️ **Dos thresholds que no son intercambiables**: 0.40 clasifica el arsenal; 0.30 es el de `searchArsenalFragments` para traer fragmentos. Declarar rota una recuperación de 0.38 midiendo contra 0.40 es un error ya cometido
   - **Candado solitario (14 ago 2026)**: si el fragmento que encabeza la recuperación trae `<verbatim_lock>`, se entrega SOLO — los demás se descartan del contexto. Un casi-empate (Δ0.017) hacía que el modelo mezclara dos fragmentos
   - **El ejemplo dictado gana sobre el candado (14 ago 2026)**: cuando `getPinCifrasGEN5` dicta un ejemplo (renta o GEN5), los fragmentos recuperados se retiran del turno — dos dictados a la vez son una contradicción servida, y el prompt ordena que el candado mande. El tipo de ejemplo lo decide **la última pregunta del bot** (la oferta), nunca el cuerpo del mensaje; el default es **renta** (prioridad del ingreso recurrente — decisión del Director)

   **Falso positivo conocido (resuelto Mar 2026)**: `COMP_MODELO_01` tiene "¿Cómo funciona el negocio?" como trigger → el vector lo confundía con WHY_02. El override en PASO 1.5 lo corrige (⚠️ el comentario en `route.ts` conserva el nombre viejo `PASO 0.5` — buscar por `OVERRIDE CRÍTICO`, no por número).

   **Excepción ecommerce (Mar 2026)**: `isSimpleQueryEarly` retorna siempre `false` cuando `tenantId === 'ecommerce'`. En ganocafe.online cualquier query puede ser sobre un producto — no hay queries "simples". Esto garantiza que mensajes de 1–3 palabras ("el té", "cereal", "jabón") igualmente pasen por vector search.

3. **Data Capture** - `captureProspectData()` extracts:
   - Personal info (name, email, phone, occupation)
   - Interest level (0-10 score)
   - Objections (price, time, trust, MLM concerns)
   - Archetype classification

4. **System Prompt** - Stored in Supabase `system_prompts` table (name: `nexus_main`)
   - ⚠️ **Lo desplegado se consulta, no se recuerda:** `node scripts/leer-system-prompt.mjs`. El `VERSION_LABEL` del script es lo que se pretende desplegar; local ≠ DB. Historial y calibraciones → [CHANGELOG-system-prompts.md](knowledge_base/CHANGELOG-system-prompts.md). Reglas vigentes: **moneda por país** (Colombia → solo COP · US → USD · resto/desconocido → USD). ⚠️ **Promesa canónica:** *"Queswa explica, atiende y **madura en cada interesado la decisión de avanzar**, las 24 horas"* (objeto = la decisión, NO la persona → activo sin presionar). **Regla del espejo:** "madura la decisión" SOLO en 3ª persona (los prospectos del usuario); en CTA/interpelación al lector NO se usa verbo sobre *su* decisión — ver [[feedback_promesa_canonica_queswa]]. La calidez humana (el equipo recibe de la mano al que ya decidió) conserva "acompaña". **Contexto reels:** el prompt sabe que la mayoría llega tras ver un reel; el saludo post-reel lo acompaña `getReelGreeting()` en [src/lib/queswa-greeting.ts](src/lib/queswa-greeting.ts). Historial → [CHANGELOG-system-prompts.md](knowledge_base/CHANGELOG-system-prompts.md).
   - ⚠️ **El archivo fuente conserva el nombre legacy `system-prompt-nexus-main-v27_2.md`** — no se renombró pese a las versiones internas v28.x. Migración léxico "negocio/empresa digital" aplicada en v28.0–v28.1.
   - Versiones anteriores del archivo eliminadas — viven en git: `git show <hash>:knowledge_base/system-prompt-nexus-main-vXX_Y.md`
   - Cached in-memory for 5 minutes
   - **El fallback hardcodeado de `route.ts` no lleva doctrina** — solo guardarraíles (ver Reglas Críticas). El copy se actualiza en Supabase.
   - **Bifurcación de embudos**: `nexus_main` sirve tráfico orgánico (95%). El 5% de ads tendrá prompt `nexus_ads_premium` cuando se construya `/executive` o `/private`. Pendiente.
   - **MODO CONSULTOR DE LIFESTYLE & BIENESTAR** (v19.6): cuando alguien pregunta por beneficios/uso de un producto, Queswa actúa como consultor de lifestyle & bienestar. NO mezcla terminología de negocio, NO compara precios vs competencia, NO introduce oportunidad de negocio a menos que el usuario lo solicite explícitamente. En la **página de catálogo** (`/productos`) este modo se fuerza vía `pageContext === 'catalogo_productos'` (route.ts `getPageContextInstructions()` — "MODO ASESOR DE SALUD Y BIENESTAR", enviado por `useNEXUSChat`); el frontend acompaña con chips de salud, saludo de asesor, CTAs `open-queswa` y tooltip del orbe contextual (ver [Active Pages → `sistema/productos/`](#5-page-structure--funnel-architecture)).
   - **Bug parcialmente resuelto (22 May 2026):** PRECIOS Y CV/PV — `catalogo_productos` v7.2 ya está fragmentado (25 fragments + doc maestro). Las tablas canónicas (PROD_OVERVIEW, BEB_01, LUV_01, SUP_01, PERS_01) ahora tienen `<verbatim_lock>` que erradica alucinaciones de nombres ("Ganotea", "Gano Cocoa", "Gano Supreme") y omisión de la categoría Suplementos. **Bug pendiente parcial**: CV/PV todavía faltantes en respuestas individuales por producto. Ver `docs/handoff/queswa/HANDOFF-QUESWA-PRECIOS-CVPV.md`.
   - **Cotización por país (Fase 2, jun 2026)** — ver memoria [[project_cotizacion_moneda_local]]. **Problema:** Gano Excel tasa el USD a **$4,500 COP FIJO** (no de mercado). Un colombiano leía "ESP-3 = $1,000 USD" → convertía a TRM (~$3,500) → *"me sobrecobran el dólar a 4,500"*; peor, Queswa **derivaba** la pregunta a un humano. **Solución (2 partes):**
     1. **Fragmento `FREQ_27`** en `arsenal_inicial.txt` (desplegado + clonado al tenant `whatsapp`) — responde el reclamo con 3 palancas: no compras dólares sino productos / precio fijo del fabricante para más de 60 países (no margen de CreaTuActivo) / **simetría** (la misma tasa que pagas una vez la cobras en CADA comisión, por encima del mercado). Incluye instrucción "NUNCA derivar a un humano". ⚠️ El slot FREQ_24 ya estaba ocupado (Consumidor VIP, fuera de orden en el .txt) → quedó como **FREQ_27**.
     2. **Detección de país + reorden de precios** en `route.ts`: `detectVisitorCountry()` (web = header `x-vercel-ip-country` de Vercel Edge; whatsapp = prefijo telefónico del `fingerprint`). `getPaquetesPricingPin(country)` + pin de composición ahora **país-aware**. **Regla:** precio de paquetes/productos → **moneda local** (CO=COP solo sin USD al lado; US=USD limpio; resto/desconocido=USD+COP con nota de oficina local). Comisiones/ingresos → **ambas monedas**. La IP es default, no verdad: para diáspora la moneda la define el **país de registro** (Queswa confirma, no asume — ver memoria `project_diaspora_registro_real` / memoria `project_diaspora_registro_real`).
     - ⏳ **Gap Fase 3:** no hay listas de precios oficiales de Gano por país (MXN, EUR…) ni precios de productos en USD → para no-CO/no-US se cotiza USD como referencia hasta conseguirlas.

**Camino A — Backend Dictador para chip-triggers (May 2026)**:

Las 2 chips canónicas que concentran el ~80% del tráfico inicial (Chip 1 → WHY_02 **"¿Y esto cómo funciona, exactamente?"** y Chip 2 → EAM_01 **"¿Cómo lo haría yo? ¿Qué hago en el día a día?"** — reescritas en v5.16, jun 2026) se sirven desde [src/lib/respuestas-maestras.ts](src/lib/respuestas-maestras.ts) **antes** del Voyage AI + Anthropic. El bypass en [src/app/api/nexus/route.ts](src/app/api/nexus/route.ts) detecta match exacto sobre `trim().toLowerCase()` contra `QUESWA_QUICK_REPLIES` y, si coincide, construye un `ReadableStream` con la respuesta Master y retorna `StreamingTextResponse` directamente. **Tercer bypass (v5.18)**: queries de texto libre tipo *"¿qué es una empresa digital?"* matchean el regex `RE_QUE_ES_EMPRESA_DIGITAL` (corre tras el match exacto de chips) → sirven `MASTER_EMPRESA_DIGITAL` verbatim (sync con EMPRESA_DIGITAL_01 del arsenal).

Beneficios:
- ✓ **100% fidelidad** al copy calibrado (cero paráfrasis del LLM)
- ✓ **$0 tokens** en Anthropic para esas queries
- ✓ **Latencia ~50ms** vs ~2s del flujo completo

Patrón arquitectónico: mismo que `getMicroPromptApertura()` / `getCierreEstado4()` — el backend dicta texto exacto cuando hay un nodo determinístico. No es un workaround; es la separación canónica entre LLM (interpretación) y backend (copy calibrado).

**Fuente dual de verdad — regla inviolable**: Los textos en `src/lib/respuestas-maestras.ts` y los bloques `<verbatim_lock>...</verbatim_lock>` en `knowledge_base/arsenal_inicial.txt` (WHY_02 y EMPRESA_DIGITAL_01 en BLOQUE 1, EAM_01 en BLOQUE 8) se sincronizan con **contrato de PREFIJO** (14 ago 2026): el candado es el texto del TS **menos la pregunta de cierre**, que vive fuera del candado. El arsenal es la doctrina viva; el módulo TS es el caché operativo del backend. Si edita uno, sincronice el otro.

**Camino B (RAG con marcador XML) — fallback para queries naturales**: WHY_01 ("¿Qué es CreaTuActivo?") y queries naturales que coincidan semánticamente con WHY_02/EAM_01 entran por el flujo RAG normal. Las etiquetas XML `<verbatim_lock>...</verbatim_lock>` envuelven el cuerpo de los 3 fragmentos en el arsenal; la sección "REGLA `<verbatim_lock>` — INVIOLABLE" en el system prompt v26.8 ordena al LLM entregar el contenido exacto entre las etiquetas. Reliability esperada ~95-99% (XML tags activan atención post-entrenada en Claude Sonnet 4.6; investigación Gemini Hipótesis C).

**Histórico de fallos doctrinales (no repetir)**: los dos fallos ya son reglas en [Reglas Críticas](#reglas-críticas-no-hacer) (corchetes planos `[VERBATIM_LOCK]` → parafraseo; extracción de `package` en `extractFromClaudeResponse()` → contaminación de BD). No re-introducir ninguno.

**Warm Handoff con sumario ejecutivo (Opción B · activo)**:

El correo al equipo NO lo dispara `getCierreEstado4()` (eso solo dicta la doble oferta wa.me); lo dispara el callback **`onFinal` del stream** en [route.ts](src/app/api/nexus/route.ts), guardado por `closingState === 4 && !_handoffYaEntregado` (solo el primer turno de Estado 4 → sin duplicados). Corre en `onFinal` **tras** entregar el mensaje al prospecto → cero latencia para él, y `onFinal` mantiene viva la función Edge hasta completar el envío (`await` seguro, no fire-and-forget — Edge cortaría un fire-and-forget). Coexisten AMBAS notificaciones: correo al equipo + link wa.me al prospecto.

Cuando entra Estado 4, [src/lib/handoff-sumario.ts](src/lib/handoff-sumario.ts) (`ejecutarWarmHandoff`):

1. `generarSumarioEjecutivo()` — sub-agente Claude Haiku procesa los últimos 15 turnos + `prospectData` y genera JSON estructurado: `{dolores_expresados, objeciones_manejadas, mensajes_clave, next_best_action}`. Latencia ~1s, costo <$0.005 por handoff. Tiene fallback si Haiku falla.
2. `enviarExpedienteEquipo()` — Resend envía email HTML estilo Quiet Luxury a `EQUIPO_DIRECTIVO_EMAIL` (default: `sistema@creatuactivo.com`), from `hola@creatuactivo.com`. Asunto: `[Handoff Queswa] {Nombre} → ESP-X Visionario (Score X/100)`.
3. En paralelo, el prospecto recibe la **doble oferta wa.me** (Estado 4): (a) Activar ahora / (b) Que el equipo me contacte — links con texto pre-llenado (nombre + WhatsApp + paquete).

Fundamento (investigación corporativa Salesforce/Intercom/HubSpot): el traspaso es el momento de mayor abandono — el equipo humano debe recibir matriz táctica ANTES del primer mensaje del prospecto, no después de saludarlo.

**Variable de entorno opcional**: `EQUIPO_DIRECTIVO_EMAIL` (default hardcoded `sistema@creatuactivo.com`). Reutiliza `ANTHROPIC_API_KEY` y `RESEND_API_KEY` ya configuradas.

**UI Design Decisions** (Mar 2026 — no revertir sin justificación):
- **Layout mobile**: Panel anclado al `bottom` con `items-end` (no centrado). Patrón elite apps (Claude, Gemini).
- **Viewport keyboard**: `interactiveWidget: 'resizes-content'` en `src/app/layout.tsx` → fix Chrome 108+ double-jump. Sin esto el área de escritura salta dos veces al abrir teclado.
- **Input**: `<textarea>` con auto-resize (max 120px), `autoCorrect="on"`, `autoCapitalize="sentences"`, `spellCheck`. Enter=enviar, Shift+Enter=salto de línea. Botones (mic/enviar) anclados al `bottom-3` del contenedor. Acepta sustituciones de texto del sistema operativo.
- **Mic integrado en input** (Abr 2026): el ícono mic y el botón enviar comparten la misma posición — toggle según `voiceState`. Patrón idéntico a Claude/Gemini. El orbe NO muestra ícono de mic cuando el chat está abierto (`isOpen`).
- **Quick Reply Chips** (solo `creatuactivo.com`, NO en `queswa.app`): 4 chips en estado inicial (antes de que el usuario escriba). Llaman `handleSendMessage()` directamente. Eliminan el "área muerta" móvil y bajan la barrera de articulación. Fuente de verdad: `QUESWA_QUICK_REPLIES` en [src/lib/queswa-greeting.ts](src/lib/queswa-greeting.ts) — son las **4 preguntas reales del avatar** (reescritas en v5.16, jun 2026, para empatizar con el pensamiento real): `¿Y esto cómo funciona, exactamente?` · `¿Cómo lo haría yo? ¿Qué hago en el día a día?` · `¿Cuáles son los productos y para qué sirven?` · `Quiero ver los números: ¿cómo y cuánto se gana?`. Los chips 1 y 2 disparan **Camino A** (bypass backend dictador, [respuestas-maestras.ts](src/lib/respuestas-maestras.ts)) → su texto exacto es key; cambiar el texto exige sincronizar la key allí + el mapa `QUESWA_QUICK_REPLIES_EXPANSION`. **Excepción catálogo** (`/productos`): `NEXUSWidget` detecta la ruta y muestra `QUESWA_PRODUCTS_QUICK_REPLIES` (3 chips de salud: beneficios / estudios científicos / seguridad del Ganoderma) en vez de las 4 de negocio, y **oculta el CTA "Suscríbete"** — Queswa es asesor de salud allí (jun 2026). Esos chips NO entran a Camino A ni al mapa de expansión (RAG normal → `catalogo_productos`).
- **Orbe pointer events** (Abr 2026): `pointerEvents: (!isOpen && orbVisible) ? 'auto' : 'none'` — evita que el orbe invisible (opacity:0, zIndex:200) intercepte clics sobre el widget (z-50).
- **Saludo inicial**: Texto grande centrado (estilo Claude.ai) cuando es el único mensaje. Desaparece al enviar el primer mensaje del usuario. Implementado en `NEXUSWidget.tsx` como caso especial `isInitialGreeting && isOnlyMessage`.
- **Nombre persistido**: Se extrae del mensaje del usuario con regex (`me llamo / mi nombre es / soy`) y se guarda en `localStorage('nexus_prospect_name')`. El saludo siguiente lo usa: `"Hola, {nombre} 🪢"`.
- **Header mobile**: Solo `Queswa 🪢` + botón X. Sin ícono, sin subtítulo "TERMINAL ACTIVA".
- **Fondo**: Panel sobre fondo oscuro puro (`#0F1115`), sin secciones ni cards intermedias. Respuestas sobre el mismo fondo — no agregar `background` a los mensajes del bot.
- **Burbujas usuario**: Sin border-radius (`borderRadius: 0`) — branding Industrial Luxury, 90 grados. Color `#16181D`.
- **UnifiedQueswaOrb** (Mar 2026 — reemplaza NEXUSFloatingButton + VoiceCommandButton):
- Tap corto = abre chat Queswa. Long press 300ms = activa micrófono de voz.
- Posición: `bottom: 1.5rem` cuando chat cerrado, `5rem` cuando chat abierto (evita tapar input). **Excepción queswa.app**: siempre `5rem` para no solapar bottom nav de 64px.
- Glassmorphism + Framer Motion spring scroll hide/show. Safe-area iOS.
- Haptic feedback: `navigator.vibrate(50)` al iniciar, `vibrate(30)` al detener grabación.
- **Icono idle**: 6 barras SVG `<rect>` doradas con animación `scaleY` escalonada (efecto ecualizador de audio, delays 0–0.42s). Complementa `orbBreath` (scale + glow). En estados recording/processing/speaking/error se muestran iconos dedicados.
- Fuente: [src/components/UnifiedQueswaOrb.tsx](src/components/UnifiedQueswaOrb.tsx)

**Servilleta + Queswa**: La servilleta usa eventos custom (`open-queswa` / `close-queswa`) para comunicarse con `NEXUSFloatingButton`. Al abrir Queswa en servilleta, el `body.style.overflow = 'auto'` se restaura temporalmente para que el teclado funcione. El deck-container mantiene `overflow: hidden` independientemente.

**API Endpoints**:
- **Production**: Always use `/api/nexus/producer` (async queue)
- **Cron fallback**: `/api/nexus/consumer-cron` (processes queue without triggers)
- **Health checks**: GET request to `/api/nexus`
- **Legacy**: `/api/nexus` POST (synchronous, still works)

### 1.1. API Routes Reference

| Route | Runtime | Timeout | Purpose |
|-------|---------|---------|---------|
| `/api/nexus` | Edge | 60s | NEXUS AI main (streaming) |
| `/api/nexus/producer` | Edge | 10s | DB Queue producer |
| `/api/nexus/tts` | Edge | 30s | TTS: ElevenLabs → OpenAI fallback |
| `/api/voice-command` | Node | 60s | Voice pipeline: Whisper → Haiku → ElevenLabs |
| `/api/nexus/consumer-cron` | Edge | 60s | Legacy queue consumer |
| `/api/funnel` | Node | 10s | Calculadora de Días de Libertad → soap-opera (Email1) + tracking de página |
| `/api/subscribe` | Node | — | Newsletter "Suscríbete" (jun 2026) — upsert `funnel_leads` (source `newsletter`) + adjunta correo al prospecto (update_prospect_data) + bienvenida institucional (Equipo CreaTuActivo) + aviso a `sistema@`. Single opt-in; pendiente double opt-in + envío real. Ver [[project_newsletter_suscripcion]] |
| `/api/fundadores` | Node | 10s | Founder registration || `/api/cron/process-emails` | Node | 60s | Soap Opera sequence || `/api/emails/send-sequence` | Node | 30s | Generic email dispatch |
| `/api/constructor/[id]` | Node | 10s | Constructor dashboard |
| `/api/fundadores/pre-registro` | Node | 10s | Pre-registration flow |
| `/api/fundadores/registro-diciembre` | Node | 10s | Legacy December registration |
| `/api/track/video` | Edge | — | ⚠️ Legacy — las páginas `dia-1..5` de la Auditoría que reportaban aquí fueron eliminadas (jul 2026) |
| `/api/track/engagement` | Edge | — | Reel engagement tracker — merge **sin retroceder** (`Math.max` numéricos / OR lógico bools) sobre `device_info` vía `update_prospect_data`; dispara webhook Supabase → push en queswa.app. Campos = contrato cerrado con el Dashboard (ver [Reels por Nicho](#reels-por-nicho-fase-orgánica-whatsapp)) |
| `/api/email-open` | Node | — | Email open pixel tracker |
| `/api/logo-email` | Edge | — | Logo dinámico (Quiet Luxury) renderizado para emails || `/api/whatsapp/webhook` | Node | 90s | WABA inbound — adaptador de canal WhatsApp → motor `/api/nexus` (ver [Estado integración WABA](#1-nexus-ai-chatbot)) |
| `/api/test-resend` | Node | — | Dev/debug only (not for production use) |

**Vercel Cron Schedules** (vercel.json):
```
/api/cron/process-emails   → 0 14 * * *  (9:00 AM UTC-5 Colombia)
```

**Important**: Cron routes require `CRON_SECRET` env var for authorization.

**`/api/funnel` — `PAGE_VIEW_STEPS`** (eventos de tracking que no requieren email):
`vio_pagina_gracias`, `vio_catalogo`, `vio_calculadora`, `vio_bridge_auditoria`

**Tracking events de video** (páginas `dia-1` a `dia-5`, reportan a `/api/nexus`):
- `video_play_moduloXX` — al iniciar reproducción
- `video_completed_80_moduloXX` — al llegar al 80% del video

### 2. Prospect Tracking

**Location**: [public/tracking.js](public/tracking.js)

Browser fingerprinting loaded in [src/app/layout.tsx](src/app/layout.tsx). Creates `window.FrameworkIAA` global API.

**Deferred loading strategy** (PageSpeed optimized):
- Loads with `defer` attribute (non-blocking)
- Creates stub immediately with localStorage fingerprint
- Defers API call using `requestIdleCallback`
- Achieved ~52% LCP improvement (2.5s → 1.2-1.5s)

**Debug in browser**:
```javascript
window.debugTracking()              // Full state
window.FrameworkIAA                 // Current prospect
window.reidentifyProspect()         // Force re-identification
```

### 2.1. PWA & Service Worker

**Location**: [public/sw.js](public/sw.js) (v1.2.0)

Hybrid caching strategy for Next.js App Router:
- **Cache-first**: HTML navigation, static assets (JS, CSS, images)
- **Network-first**: Dynamic data, APIs
- **Auto-cache**: Client-side navigation via RSC (`?_rsc=` params)
- **Bypass**: `/api/`, `/auth/`, `tracking.js`, external services, `/empresa-digital`, `/negocio-digital` (URLs legacy → Home 301; van siempre a red para que el redirect funcione). ⚠️ `public/sw.js` aún lista `/mapa-de-salida` y `/reto-5-dias` (sus redirects se retiraron jul 2026 → hoy 404; se pueden quitar del bypass)

**Registered in**: [src/app/layout.tsx](src/app/layout.tsx) via inline script

**PWA Icons & Manifest** (Dic 2025):
- **Manifest**: [public/site.webmanifest](public/site.webmanifest)
- **Theme color**: #D4AF37 (gold - Quiet Luxury)
- **Background**: #0a0a0f (dark)
- **Icons** (generated from [public/favicon.svg](public/favicon.svg)):
  - `web-app-manifest-192x192.png` - PWA icon
  - `web-app-manifest-512x512.png` - PWA splash
  - `favicon-96x96.png` - Browser tab
  - `apple-touch-icon.png` - iOS home screen

**Regenerate icons**: `node scripts/generate-favicons.mjs` (requires sharp)

### 3. Async Queue Architecture

**Database trigger architecture** (no external queue service):

```
Usuario → Producer → nexus_queue (INSERT)
                         ↓ (DB Trigger)
              Edge Function (nexus-queue-processor)
                         ↓
          Claude API + update_prospect_data RPC
```

**Benefits**: $0/month, <2s latency, simple debugging via Supabase Dashboard

**Deployment**: See [DEPLOYMENT_DB_QUEUE.md](DEPLOYMENT_DB_QUEUE.md)

**Edge Functions** (in `supabase/functions/`):
- `nexus-queue-processor` - **Primary**: Processes NEXUS messages from DB queue
- `nexus-consumer` - Legacy: Kafka consumer (deprecated, kept for reference)
- `notify-stage-change` - Sends email notifications when prospects advance stages

### 3.1. Multi-Tenant Architecture (FASE C - Mar 2026)

Aislamiento por tenant_id en todas las capas: Middleware (x-tenant-id header) -> vectorSearch (filter_tenant_id) -> system_prompt (get_tenant_system_prompt RPC) -> nexus_queue (metadata.tenant_id).

Tenants activos: creatuactivo_marketing (creatuactivo.com), marca_personal (luiscabrejo.com), queswa_dashboard (queswa.app), ecommerce (ganocafe.online pendiente).

SQL migration: supabase/migrations/20260316_match_documents_tenant_filter.sql

### 3.2. Voice Pipeline (Mar 2026)

Cadena: Whisper (~2s) -> Claude Haiku (~1s, max 450 tokens) -> ElevenLabs turbo_v2_5 (~2s) = ~5-8s total.
Ruta: /api/voice-command (Node, maxDuration=60, Vercel Pro requerido).
TTS inline: /api/nexus/tts (boton ESCUCHAR en mensajes del chat).
Fallback TTS: ElevenLabs quota/401 -> OpenAI tts-1-hd voz onyx.

### 4. Supabase Schema

**Key Tables**:
- `prospects` - Fingerprinted visitors
- `prospect_data` - Captured info (name, email, phone, etc.)
- `nexus_documents` - Knowledge base
- `nexus_conversations` - Chat history
- `system_prompts` - Dynamic NEXUS prompts
- `nexus_queue` - Async message queue
- `constructor_slugs` - Mini-landing slugs (slug, display_name, foto_url, frase_personal, whatsapp, constructor_id)
- `private_users` - Constructor profile data (affiliation_link, profile_photo_url)
- `wa_mensajes_procesados` - Guarda de reenvíos del webhook (`wamid` = llave primaria). La columna `identidad` guarda los cuatro campos con que Meta identifica a quien escribe
- `wa_envios_fallidos` - Lo que Meta **acepta con 200 y descarta después**. Única señal de un mensaje que la persona nunca recibió — el log de Vercel se pierde en minutos

**Key RPC Functions**:
- `identify_prospect()` - Create/update prospect
- `update_prospect_data()` - Merge new data
- `search_nexus_documents()` - Semantic search
- `enqueue_nexus_message()` - Add to queue

**Knowledge Base** (almacenado en `nexus_documents`): ver la tabla de arsenales y versiones actuales en la sección [NEXUS AI Chatbot — Fragmented Vector Search](#1-nexus-ai-chatbot) arriba. Archivos fuente:

- [knowledge_base/arsenal_inicial.txt](knowledge_base/arsenal_inicial.txt)
- [knowledge_base/arsenal_avanzado.txt](knowledge_base/arsenal_avanzado.txt)- [knowledge_base/arsenal_12_niveles.txt](knowledge_base/arsenal_12_niveles.txt)
- [knowledge_base/catalogo_productos.txt](knowledge_base/catalogo_productos.txt)
- [knowledge_base/arsenal_compensacion.txt](knowledge_base/arsenal_compensacion.txt)
- [knowledge_base/arsenal_marca_personal.txt](knowledge_base/arsenal_marca_personal.txt)
- [knowledge_base/arsenal_ganocafe.txt](knowledge_base/arsenal_ganocafe.txt)

**Documentación completa**: [knowledge_base/README.md](knowledge_base/README.md) · **Historial de cambios**: [knowledge_base/CHANGELOG-arsenales.md](knowledge_base/CHANGELOG-arsenales.md)

### 5. Page Structure & Funnel Architecture

> 📄 **Inventario página por página, historia de la Home y del funnel eliminado → [docs/PAGINAS_Y_FUNNEL.md](docs/PAGINAS_Y_FUNNEL.md).** Aquí quedan solo el mapa vigente y las trampas que cuestan horas.

**Funnel vigente** — el de reto/mapa/diagnóstico se eliminó en jul 2026 tras meses sin conversión; sus URLs redirigen a Home (301):

```
Tráfico (reel por nicho / orgánico WhatsApp) → creatuactivo.com/{slug}/{nicho}
                              ↓
              Reel + Queswa (conversa, madura la decisión) → 1-a-1 con el socio
                              ↓
                         /paquetes (activación) · /fundadores (Oferta)

Home → "Hablar con Queswa" (open-queswa) + "Suscríbete" (newsletter → /api/subscribe)
Blog (SEO) → /blog/* → Home / /fundadores
/calculadora → soap-opera Email1-5 (cron process-emails) → Home / /fundadores
```

**Las tres trampas:**

- ⚠️ **`DESTINO_MAP` (cuesta horas):** un destino que no esté en el mapa —ni en `REEL_NICHOS`— **cae al fallback `redirect(/{slug})`, que es la mini-landing, sin 404**. Síntoma: *"el enlace `/{slug}/X` lleva a la mini-landing"*. Al añadir un enlace amigable en el Dashboard (`src/lib/arsenal.ts`), agregue SIEMPRE su destino en [src/app/[slug]/[destino]/page.tsx](src/app/[slug]/[destino]/page.tsx).
- ⚠️ **OG por página:** la página destino debe declarar su **propio `openGraph.url`**. Si solo define `title`/`description`, hereda el del root layout y al compartir en Meta la publicación enlaza a la raíz aunque el enlace pegado sea correcto. Tras corregir, forzar re-scrape en el Sharing Debugger.
- ⚠️ **Un solo `<h1>` por página**, vía [IndustrialHeader](src/components/IndustrialHeader.tsx). Bug recurrente.

**Menú** ([StrategicNavigation.tsx](src/components/StrategicNavigation.tsx), array `directLinks`): Nosotros (`/nosotros`) · Tecnología · Presentación (`/servilleta`) · Insights (`/blog`) + CTA **"Suscríbete"**. ⚠️ **Los rótulos no coinciden con sus rutas a propósito** (jun 2026): el menú nombra *qué encuentra el visitante*, no la ruta técnica. `/presentacion-empresarial` es herramienta interna 1-a-1 y **no** está en el menú — no confundirla con el item "Presentación".

**Indexadas:** `/`, `/fundadores`, `/blog/*`, `/tecnologia`, `/productos`, `/paquetes`. **noindex:** `/nosotros`, `/prueba`, `/12-niveles`, `/lexico`, decks internos.

### Servilleta Digital - Interactive Presentations

Deck de 4 slides para conversaciones 1-a-1. **Fuente viva completa → [docs/SERVILLETA.md](docs/SERVILLETA.md)** (arquitectura mobile, b-rolls 3D, beat del colapso, comandos de re-render, reglas de iconos).

| Version | Route | Notas |
|---------|-------|-------|
| v6.7 (Main) | `/servilleta` | 4 slides; 1 y 2 son card-scrollers con b-rolls 3D + portada. Fullscreen (F), keyboard nav, swipe |
| v6.7 (Ref) | `/servilleta/[constructorId]` | Re-exporta la página principal; el `constructorId` se lee del path en cliente para tracking |

Estructura (2 ago 2026): **01 EL PROBLEMA** · **02 LAS TRES COSAS** (+ beat del colapso) · **03 EL PRODUCTO** · **04 LOS NÚMEROS**. El slide "QUÉ HACE USTED" se eliminó el 2 ago 2026 (5 → 4 slides).

**Lo que rompe producción si lo toca sin leer el doc:**
- ❌ NO revertir `.card-bg` a `object-fit: cover` ni al split `height: 50%` — recorta el 3D
- ❌ NO añadir `.simulator-panel`, tabs ni botones a `touchSwipeIgnore` — bloquea el swipe-back del Slide 4 (la exoneración es SOLO para `<input>`)
- ❌ NO unificar el Slide 4 a `justify-content: center` en ambos modos — en fullscreen mobile empuja el 2º botón fuera de pantalla
- ❌ NO reintroducir strings de Material Symbols en `<span>` — renderizan como texto en inglés hasta que carga la fuente
- ❌ NO mostrar el orbe Queswa flotante en `/servilleta` — el chat abre solo desde "PREGÚNTALE ALGO EN VIVO" (slide 2)
- ⚠️ El **copy verbatim NO se documenta** — vive en [src/app/servilleta/page.tsx](src/app/servilleta/page.tsx); la narración en [guion_maestro_servilleta_v3.md](public/contexto/produccion/guiones/servilleta/guion_maestro_servilleta_v3.md) (nombre legacy `v3`, contenido v5.8)

## Environment Variables

Copia `.env.example` a `.env.local` y configura. Servicios requeridos:

- **Supabase**: Base de datos + Auth + Edge Functions (requires pgvector extension)
- **Anthropic**: Claude API para chatbot Queswa/NEXUS
- **Voyage AI**: Embeddings vectoriales para búsqueda semántica
- **Resend**: Emails transaccionales
- **Vercel Blob**: Almacenamiento de videos (opcional)
- **Twilio**: WhatsApp automation (opcional)

**Production-only variables** (set in Vercel Dashboard, not in .env.example):
- `CRON_SECRET` - Authorization for Vercel cron jobs
- `EQUIPO_DIRECTIVO_EMAIL` - **Opcional** (default hardcoded `sistema@creatuactivo.com`). Destinatario del warm handoff cuando entra Estado 4 del FSM. Sirve para override sin redeploy (ej. testing con otra dirección)

Ver [.env.example](.env.example) para la lista completa con instrucciones de configuración.

## Common Development Patterns

### Modifying NEXUS Behavior

**CRITICAL**: Update database, not code.

1. Update `system_prompts` table in Supabase
2. Use helper scripts por dominio:

| Dominio | Prompt name | Script de actualización |
|---------|-------------|------------------------|
| `creatuactivo.com` | `nexus_main` | `actualizar-system-prompt-v27.2.mjs` (despliega la versión indicada en `VERSION_LABEL` del script — apunta a `system-prompt-nexus-main-v27_2.md`; tanto el script como el archivo conservan el nombre legacy `v27.2`/`v27_2`. Verificar siempre con `leer-system-prompt.mjs`) |
| `luiscabrejo.com` | `marca_personal_v1.0` | `actualizar-system-prompt-marca-personal-v1.mjs` |
| `ganocafe.online` | `ganocafe_main` | `actualizar-system-prompt-ganocafe-v1.3.mjs` (latest: **v1.5_ganocafe_alias_coloquiales**) — ⚠️ tiene catálogo de precios hardcodeado: sincronizar con `arsenal_ganocafe.txt` al cambiar precios |
| `queswa.app` | hardcoded en `dashboard-ai/route.ts` | editar `buildSystemBlocks()` directamente |

3. Clear cache (restart dev server or wait 5 minutes)

**El fallback** de [src/app/api/nexus/route.ts](src/app/api/nexus/route.ts) solo lleva guardarraíles; la doctrina y el copy se actualizan en Supabase.

**Queswa Official Constants** (calibradas Mar 2026 — consistencia obligatoria en todos los arsenales):
- Lanzamiento público: **sin fecha dura** (decisión 31 May 2026). La fase de cimentación está **en curso** (selección de los 15); el despliegue público global llega **una vez consolidada la base fundacional**. La urgencia es la **banda directiva finita** (tiempo del núcleo para los 15), NO un calendario. ❌ No usar "1 de junio" ni ninguna fecha de lanzamiento en arsenales/Queswa.
- Equipo base Fundadores inicial: **15 socios estratégicos / 15 cupos**
- Porcentaje de automatización tecnológica: **90%** (la tecnología hace el 90% del trabajo pesado)
- **Las tres fuerzas, de cara al prospecto:** **Gano Excel** (fabrica, almacena y despacha — 30 años, más de 60 países) · **Queswa** (explica, atiende y madura la decisión, a toda hora) · **el Método Comprobado** (Compartir y Recibir, ver arriba). Se nombran así, en llano. Las etiquetas internas —Pilares, Matriz Física, Centro de Mando, Metodología Automatizada— sobreviven en arsenales profundos pero **no se usan con el prospecto**.
- Activo del usuario: **su canal de distribución** — unidad replicable que se **multiplica** cuando alguien de su canal abre el suyo
- Rol del usuario: **es el dueño de su canal**, y el rol **no se nombra como cargo** (8 ago 2026). Para hablar del rol **entre nosotros** sirven los verbos *decidir · conectar · ver crecer*; **al prospecto se le entregan siempre las dos acciones — Compartir y Recibir —, y nunca una segunda lista**. Los títulos —Arquitecto de Patrimonio, Propietario de Base Operativa, Director— crean barrera de autoeficacia y evocan hojas de cálculo; la identidad más ligera y más cierta es *dueño*, que además es lo que compró.
- Multiplicación (3er Comando, renombrado desde "Maestría" jun 2026): multiplicar la empresa digital está a un clic en todo el continente — resuelve el cuello de botella de crecer. La Academia/formación es el medio (Queswa forma a cada persona nueva), NO el gancho. Ver [[project_rename_maestria_multiplicacion]]
- Gano Excel presencia global: **más de 60 países** (8 ago 2026 — es lo que publican los sitios oficiales de Gano Excel Colombia y Estados Unidos; la cifra anterior de 70 no la sostiene ninguna fuente, y "más de 100" de la auditoría corporativa se apoya en un aviso de empleo). Defendible ante quien verifique, y solo puede sorprender hacia arriba
- **Respaldo institucional en Colombia** (verificado 8 ago 2026, usado en FREQ_13): la **Ley 1700 de 2013** regula el mercadeo multinivel y **exige oficina abierta al público de manera permanente** — el criterio con el que el legislador separó el comercio del fraude · Gano Excel tiene **nueve sedes** en el país (dos en Bogotá; Medellín, Cali, Pereira, Barranquilla, Bucaramanga, Cúcuta, Villavicencio) · afiliada a **ACOVEDI** · registros **INVIMA** vigentes y certificación **TGA de Australia**
- **Fundadores — no es orden de llegada** (8 ago 2026): es un equipo que se selecciona, con una conversación de por medio. Entran más de 15 para escoger 15. Eso quita la urgencia falsa y eleva el registro sin reclamar nada. ⚠️ La mecánica interna de la selección **no se escribe en los arsenales**
- **Formación** (8 ago 2026 · acotada 25 ago 2026): sección **Maestría** en queswa.app — liderazgo, comunicación, maestría para el éxito y maestría para administrar los recursos, más el detalle de producto y la experiencia de socios que ya recorrieron el camino. ⚠️ **Los espacios SÍ existen y son opcionales — no se nombran por una razón de CANAL, no de verdad** (Director, 25 ago 2026). Gano Excel y su liderazgo desarrollan espacios de bienestar y de liderazgo, la mayoría en línea, sin obligación de asistir. **Queswa vive en WhatsApp y Meta restringe a la industria del mercadeo en red:** nombrar encuentros en línea en un mensaje saliente es el marcador más reconocible de esa industria. Por eso `FREQ_35` responde **«nada obligatorio»**, que es exacto, en vez de describir los espacios. Quien edite esto debe saber que no se está ocultando nada: se está eligiendo qué decir en el canal donde hay restricción.

⛔ **De cara al prospecto NO se nombran *profesionales de la salud* ni *eventos / encuentros en vivo*** (Director, 25 ago 2026): lo primero le presta respaldo médico a un suplemento —la línea exacta que defiende `wa-guardarrail-salud.ts`— y lo segundo es marcador de la industria del multinivel, con restricción de Meta encima. La experiencia de quienes ya recorrieron el camino se nombra **como contenido de Maestría**, no como evento. *Maestría* aquí nombra la sección del producto, no el Comando renombrado
- **Sucesión del código** (8 ago 2026, FREQ_05): con Gano Excel el traspaso ocurre **una vez fallece** el titular y va al cónyuge o a familiares en primer grado; **en vida**, poniendo el código a nombre de una sociedad —en Colombia una SAS— con la titularidad repartida en los estatutos
- **Compra mensual mínima: 50 PV** — en producto, unas tres o cuatro cajas. ⚠️ **No se cotiza en moneda**: la pone el pin por país. Los ~$100 USD son del **Kit de Inicio**, no de la recompra (esa confusión estuvo desplegada en dos arsenales)
- Sub-perfiles del Constructor: **Perfil-A** (ejecutivo/alto ingreso) · **Perfil-B** (negocio propio) · **Perfil-C** (independiente/freelance) — uso interno únicamente. Las etiquetas "Esposas de Oro", "Trampa Operativa", "Creador de Ingreso Lineal" están **eliminadas** — atacaban la identidad del prospecto. El villano es siempre el Plan por Defecto, nunca la actividad del héroe.

**Audiencia objetivo + reglas lingüísticas** → ver [Léxico y voz](#léxico-y-voz--lo-que-se-aplica-en-cada-línea-de-copy). Reglas clave:
- Audiencia mixta pan-americana (USA, México, Colombia) — vocabulario respetuoso pero accesible (test "abuela de 75 años"). El target original "CEOs/cirujanos" del Lujo Clínico se amplió en v5.2 (May 2026) tras el insight del Director Cabrejo: "el arquitecto no precipita el cierre, pero cuando llega los procesos son sencillos".
- NUNCA plantar objeciones ("vender", "convencer", "perseguir") donde el héroe no las mencionó.
- Referencias geográficas pan-americanas — no Colombia-only.

### Arquitectura FSM — Backend como Dictador Absoluto (rediseñado Opción B, 22 May 2026)

Principio: el LLM es un **procesador semántico**, no un tomador de decisiones de flujo. El backend (`route.ts`) detecta el estado y controla todos los textos verbatim. Patrón: Graph Prompting (Salesforce Agentforce / Intercom Fin / HubSpot Breeze).

**Rediseño Opción B (22 May 2026):** se ELIMINARON Estado 1 (pregunta de horas) y Klaff Prize Frame agresivo. Razón: la investigación corporativa documentó que la entrevista de cualificación al final del flujo destruye conversión — la cualificación BANT debe inferirse de la conversación previa, no preguntarse explícitamente.

**Funciones de micro-prompt en `route.ts`** (cada estado recibe SOLO instrucciones de su nodo):

| Función | Condición de disparo | Qué controla |
|---------|---------------------|--------------|
| `getMicroPromptApertura()` | `messageCount === 1` | Saludo inicial verbatim — M1 |
| `getMicroPromptCierre()` Estado 2 | `closingState === 2` | Tabla ESP (3 niveles). **Modo dual**: `modoCierre=true` (pregunta combinada nombre+nivel cuando trigger cierre sin paquete) · `modoCierre=false` (pregunta abierta cuando solo es informativo) |
| `getMicroPromptCierre()` Estado 3 | `closingState === 3` | Confirmación + solicitud de nombre. Usa nombre descriptivo completo (ESP-3 Visionario) |
| `getCierreEstado4()` | `closingState === 4` | Dicta la **doble oferta wa.me** al prospecto (a) Activar ahora / (b) Que el equipo me contacte. El **correo** al equipo NO sale de aquí — se dispara en `onFinal` del stream (`closingState===4 && !_handoffYaEntregado`), ver Warm Handoff |

**`sessionInstructions` (Bloque 3 — no cacheable):**
- M1: inyecta `getMicroPromptApertura()` (texto verbatim, ignora Pirámide McKinsey)
- M2+: inyecta `📍 ${getMessageContext()}` para orientación del modelo
- Siempre incluye: `getPageContextInstructions()`, `getMicroPromptCierre()`, `getCierreEstado4()`, `<prospect_state>`

**Regla crítica**: NO agregar textos de flujo al System Prompt. El System Prompt es perfil de personalidad puro (identidad + tono + diccionario). Cualquier texto que el modelo deba imprimir verbatim va en las funciones de micro-prompt del backend.

**Clasificador único de marcha — FUENTE DE VERDAD del cierre:** La intención de cierre se decide en **un solo lugar** (`marchaCierre`, route.ts tras `mergedProspectData`), del que derivan `isClosingFlowEarly`, el FSM y la supresión de RAG → no se pueden desincronizar. **Modelo de 3 marchas** — el discriminador es **gramática + recorrido**, NO la palabra "inicio/iniciar" (contaminada: vive en "paquetes de inicio"=info y "quiero iniciar"=intención):

| Marcha | Señal | RAG | Resultado |
|--------|-------|-----|-----------|
| **1 Catálogo** | `señalCatalogo` — pide opciones/valores ("cuáles son los paquetes / de inicio", "formas de inicio") | tabla dictada | Estado 2 informativo (tabla + pregunta exploratoria). **NUNCA ofrece activación** |
| **2 Interés** | nombra UN paquete sin volición (`prospectData.package` de ESTE turno), O frase procedimental EN FRÍO | **ON** | Estado 0 + `marchaInteres` → respuesta sustanciosa del arsenal + **puente suave** (sin pedir datos). Fuerza Sonnet |
| **3 Firme** | `señalVolicion` ("quiero iniciar/hagámoslo/me decido/dónde pago") **O** `señalProcedimental` + `yaRecorrioProceso` | off | con paquete → Estado 3 (pedir nombre); sin paquete → Estado 2 `modoCierre` (tabla + nombre+nivel) |

- **`yaRecorrioProceso`**: el bot ya mostró paquetes, O la conversación tocó compensación, O el usuario ya preguntó precios/paquetes, O hay paquete en BD. Convierte lo procedimental ("ok, ¿cuál es el paso a seguir?") en intención de pagar. En frío esa misma frase es Marcha 2.
- **Guardas**: `_contextoNoCierre` (café/producto/"si se acaba" → no es avance de cierre, evita falso positivo de "qué hago") · `_esInformativaCierre` ("qué es/incluye el ESP-3" → no es selección).
- **`_aceptaConexion` → Marcha 3 (19 jun 2026)**: cuando el bot ofrece conectar con el equipo (`_botOfrecioConectar`, lee el ÚLTIMO msg del bot) y el usuario acepta (`_usuarioAcepta`: "de acuerdo / sí / dale / listo…"), **O** el usuario pide explícitamente conexión (`_señalConectarEquipo`: "conécteme con el equipo / quiero que me contacten"). Sin paquete cae a Estado 2 modoCierre = **pide el nivel primero** (decisión Director Cabrejo). Cierra el hueco donde el modelo improvisaba el handoff (inventaba "en 24 horas", compartía contacto suelto) y no llegaba a Estado 4 (→ no se enviaba correo).

**Continuación del cierre escriturado** (independiente de la marcha, lee lo que el bot ya pidió):
1. `_handoffYaEntregado` (doble oferta Estado 4 ya dada) → Estado 0
2. `_whatsappSolicitado && package && nombreValido && (WhatsApp ahora O guardado)` → Estado 4
3. `_botPidioNivelCombinado && package` (modoCierre) → con nombre → Estado 3b · solo nivel → Estado 3
4. `_nombreSolicitado3a && package` → con nombre → Estado 3b · sin nombre → Estado 0 (no insistir)

**Detección Estado 4 (regex):** `/WhatsApp Directo de Activación|mesa directiva|sintetizado su evaluación|Su acceso oficial está aquí/i`. Si se modifica el texto de `getCierreEstado4()`, actualizar el regex.

**Validación de nombre (Fix Bug 1+2, 22 May 2026):** Antes de disparar Estado 4, el FSM valida con `extractNameFromHandoffReply()` que el usuario efectivamente respondió con un nombre. Si la respuesta del usuario es una pregunta nueva o pide pausar, NO se dispara Estado 4 — el sistema responde libremente y el package permanece guardado para que el próximo turno (cuando el usuario dé el nombre) sí dispare el handoff.

**Tratamiento**: Siempre `Usted` — nunca tuteo. Auditado en todos los micro-prompts.

### Lead Scoring v3.0

**Escala**: 0–100. Implementado en `captureProspectData()` dentro de [src/app/api/nexus/route.ts](src/app/api/nexus/route.ts). Umbrales: 0–49 frío, 50–74 tibio, 75–89 caliente, 90–100 SQL. Las señales con mayor peso son: multi-threading +15, WhatsApp +8, verbos de compra +8, preguntas sobre inicio +8. Señal más negativa: "no me interesa" -15.

### Updating Queswa Knowledge

**Workflow** (Arquitectura Consolidada v3.0 - Feb 2026):

⚠️ **Un fragmento tiene TRES piezas y cada una va a un solo sitio** (25 ago 2026). `**[Índice]:**` —disparadores más 2-3 líneas con las palabras que usa la persona— es lo **único que se vectoriza**. El **cuerpo** es lo **único que se sirve**. El `**[Concepto Nuclear]:**` se queda en el `.txt`: el fragmentador lo recorta, y por eso puede escribirse en negativo sin costo — el modelo no lo lee. Antes viajaba dentro del fragmento y era el **47% del corpus servido**; el daño no era de recuperación sino de generación (*contextual entrainment*: el modelo sube la probabilidad de cualquier token del prompt, y las instrucciones de ignorarlo apenas lo mitigan — el incidente de `COMP_GEN5_01` no fue mala suerte). Medido sobre el corpus: acierto en el puesto 1 de **24/40 a 34/40**, margen sobre el segundo **×3,6**. ⚠️ **Añadirle el cuerpo al índice empeora** (34 → 29): el índice se indexa solo. Arnés: `node scripts/experimento-indice-recuperacion.mjs`. Al escribir un fragmento nuevo, el índice se redacta con las paráfrasis coloquiales que el disparador no cubre, y se mide antes de dar por bueno. **Migración completa el 25 ago 2026:** los cinco arsenales del tenant principal tienen índice —`arsenal_inicial`, `arsenal_avanzado`, `arsenal_compensacion`, `arsenal_12_niveles` y `catalogo_productos`, 519 fragmentos en los tres tenants—. `arsenal_ganocafe` y `arsenal_marca_personal` viven en tenants propios y no compiten con los demás.

⚠️ **Un corpus no puede estar MEDIO migrado** (25 ago 2026). Los índices producen vectores cortos y concentrados que **ganan casi siempre** contra fragmentos indexados por su cuerpo largo. Al migrar solo `arsenal_inicial`, dos consultas del benchmark se desviaron —una a un fragmento **con candado**, que se sirve solo y descarta al resto—. Comprobado contra el respaldo de embeddings previos: antes acertaban. Se corrigió migrando también `arsenal_avanzado`. ⏳ **Pendientes: `arsenal_compensacion` (40), `catalogo_productos` (43) y `arsenal_12_niveles` (14)** — mientras no los tengan, compiten en desventaja.

⚠️ **El guardarraíl de negocio NO ve dos siluetas** (barrido del 25 ago 2026 sobre los 60 cuerpos): **el resultado personal prometido** —*«esto le resuelve su tema financiero»*, que se sanciona **sin necesidad de cifra ni de fecha**— y **la promesa de esfuerzo mínimo** —*«usted no las arma; las enciende»*—. Vigila conjunciones de dinero con plazo, garantía o personas, y estas no las tienen: **quince casos reales pasaron invisibles**. Se corrigieron a mano (v5.99 a v6.01 del arsenal inicial) y esos quince, con su antes y su después, son el conjunto de prueba para calibrar los patrones nuevos. ⚠️ **No se añaden patrones sin backtest**: *«no depende de su presencia»* es léxico aprobado y caería en cualquier regla ingenua, y bloquear copy bueno también es daño.

⚠️ **El título tiene un ÓPTIMO, no una dirección** (26 ago 2026). Demasiado largo **diluye**: `INV_00` (254 caracteres) no aparecía ni en el top 6 de su propio disparador, y `EAM_01` 🔒 (145) ganaba su pregunta canónica por 0.002 contra un rival de 65. Demasiado corto **se vuelve atractor**: `OBJ_01` con solo *«No tengo tiempo»* le robaba consultas a WHY_03, EAM_01 y PERFIL_01, y **ninguna de cuatro redacciones del índice lo movió** — el atractor era el título. Acotarlo a *«No tengo tiempo para otro proyecto»* lo arregló; alargarlo más lo desplomaba, porque perdía las suyas. **La palanca es la especificidad, no la longitud.** ⏳ El barrido del corpus sigue pendiente, pero **se mide antes de cortar**: de 41 títulos largos, solo tres fragmentos pierden consultas.

⚠️ **El TÍTULO también se vectoriza, y un título largo mata al fragmento** (26 ago 2026). El texto embebido es `title\n\níndice`, y un *title* con cinco o siete preguntas casi idénticas reparte la señal hasta que ninguna consulta concreta la concentra. Dos casos el mismo día: `INV_00` (254 caracteres, siete preguntas) no aparecía ni en el top 6 de su propio disparador, y `EAM_01` 🔒 (145 caracteres, cinco preguntas) ganaba su pregunta canónica **por 0.002** contra un rival de 65 caracteres sin candado. Los dos se arreglaron recortando el título a una o dos preguntas. ⏳ **La migración a índices dejó los títulos como estaban — el barrido del corpus está pendiente.**

⚠️ **Si un fragmento es el destino de una oferta escrita, esa oferta va LITERAL y APARTE en su índice** (26 ago 2026). En WhatsApp una aceptación pelada busca con **la última pregunta del bot**, no con palabras del prospecto, y los índices están escritos en voz del prospecto. Medido: la oferta como frase propia lleva a `INV_00` de 7/8 a 8/8, y la cadena `WHY_ROL_01` → `EAM_01` a **0.752**; **fundida dentro de la línea del prospecto cae a 4/8** y arrastra las demás consultas.

⚠️ **La doctrina NO se escribe dentro del índice.** El índice de `EAM_01` terminaba en *«Para quien mide si sería capaz»* — una nota para quien edita, gastando la única señal que se vectoriza. Eso va en el `[Concepto Nuclear]`, que el fragmentador recorta.

⚠️ **Un índice se prueba con un arnés que NO toca producción** (26 ago 2026): embeber los candidatos como documento, las consultas como consulta, y enfrentarlos contra los rivales reales sacados de Supabase. Cuesta segundos, contra los dos minutos de un ciclo de despliegue. **Pero reproducir el texto que se vectoriza es la mitad del trabajo:** el fragmentador embebe `title\n\níndice`, y *title* es **solo la pregunta entrecomillada**, no la línea `###` completa. Con la línea completa salen números que no se parecen a producción — el primer diagnóstico de OBJ_01/OBJ_02 salió al revés por eso. Se valida el arnés comprobando que reproduzca una medición conocida antes de creerle.

⚠️ **Antes de dar por buena una variante de índice, meta en la comparación a los fragmentos que podrían perder.** Dos variantes de `OBJ_02` empataban en el primer puesto y le **robaban *«cuánto vale entrar»* a `FREQ_03`** — la tabla de precios, con candado y con pin de moneda. Ganar una paráfrasis a costa de un candado es mal negocio, y el laboratorio no lo dice si el rival no está en la mesa.

⚠️ **Al escribir un índice, tres reglas que costaron iteraciones:**
1. **Alargar diluye.** Sumarle disparadores a un fragmento para que gane una consulta le BAJA el score — el texto indexado es corto a propósito y las palabras nuevas reparten la señal. El lever es **acortar**.
2. **Corto y genérico se vuelve un atractor.** Un índice muy corto y vago empieza a ganar consultas ajenas. Corto sí; genérico no — se ancla a la formulación concreta.
3. **Barrer las palabras que el cuerpo tenía y el índice no.** El índice de FREQ_13 omitía *multinivel* y *MLM*, que vivían en su cuerpo; al dejar de indexarse el cuerpo, *«¿esto es MLM?»* se fue al catálogo.

⚠️ **Un disparador ambiguo le cuesta la consulta a otro fragmento.** *«¿Me enseñan?»* significa cosas opuestas según quién enseñe a quién, y le robaba a `ADV_SIST_03` una consulta que además caía en un fragmento con candado. Antes de dejar un disparador, preguntarse si otro fragmento podría reclamarlo.

⚠️ **La medición de laboratorio sobreestima.** `experimento-indice-recuperacion.mjs` enfrenta solo los 58 de `arsenal_inicial`; en producción compiten ~175 de cinco arsenales. La cifra que vale la da `medir-40-produccion.mjs`. Estado al 25 ago: **38/40 en el puesto 1, 40/40 en top 3** — y como el motor entrega top-3, las cuarenta consultas alcanzan su fragmento.

⚠️ **`FREQ_04_PUENTE` nunca estuvo indexada** (bug del fragmentador arreglado el 25 ago): el ID se extraía sin exigir `:` al final, así que `_\d+` casaba primero y devolvía `FREQ_04` — misma categoría que la respuesta anterior, y el fragmentador la saltaba por «ya existe». **Después de cada despliegue, contrastar la lista de IDs del `.txt` contra `select category from nexus_documents`**: el fragmentador salta en silencio y una respuesta puede parecer desplegada sin existir.

**RECETA DE DESPLIEGUE DE UN FRAGMENTO — los cinco pasos, siempre los cinco.** El fragmentador **salta** lo que ya existe, así que sin purgar no pasa nada y todo parece bien. Y sin clonar, la web queda actualizada y **WhatsApp no** — que es el canal donde está el tráfico.

⚠️ **Los arsenales viven en TRES tenants, no en dos:** `creatuactivo_marketing` (la web), `whatsapp` (el canal) y `dashboard` (queswa.app, que es **otro repositorio** y se surte de esta misma tabla). La receta nombró solo `whatsapp` durante meses y el resultado se midió el 22 ago 2026: a `dashboard` le faltaban **los 16 productos** que el catálogo ganó en la v7.5 — justo los que existen para que preguntar por el Ganocafé Clásico no devuelva la ficha del 3 en 1. La deriva no avisa; solo aparece cuando alguien recibe el precio del producto vecino.

```bash
# 1. editar el .txt   →   2. subir el documento padre
node scripts/deploy-arsenal-inicial.mjs

# 3. purgar el fragmento viejo (sin esto, el paso 4 lo salta en silencio)
node scripts/sql.mjs -e "delete from nexus_documents where category='arsenal_inicial_XXX'"

# 4. regenerar con embedding Voyage
node scripts/fragmentar-arsenales-voyage.mjs

# 5. clonar a los DOS tenants derivados — NUNCA se omite ninguno
node scripts/sql.mjs -e "insert into nexus_documents (category, title, content, embedding_512, tenant_id, metadata)
select d.category, d.title, d.content, d.embedding_512, t.tenant,
       d.metadata || '{\"cloned_from\":\"creatuactivo_marketing\"}'::jsonb
from nexus_documents d
cross join (values ('whatsapp'), ('dashboard')) as t(tenant)
where d.tenant_id='creatuactivo_marketing' and d.category='arsenal_inicial_XXX'"

# 6. comprobar que los tres quedaron iguales
node scripts/sql.mjs -e "select tenant_id, count(*) from nexus_documents
where (metadata->>'is_fragment')::boolean is true group by 1 order by 2 desc"
```

⚠️ El `delete` del paso 3 **no filtra por tenant a propósito**: borra esa categoría en los tres de una vez, que es justo lo que hace falta antes de volver a clonar.

**Verificar con un `content like` sobre lo que entró Y sobre lo que debía salir, en los tres tenants** — comprobar solo lo nuevo deja pasar los residuos. Después `node scripts/auditar-frases-vetadas.mjs`. Si el fragmento es de **doble fuente**, sincronizar antes `src/lib/respuestas-maestras.ts` y confirmar longitudes idénticas.

**Patrón validado para purgar (24 May 2026, v5.4 deploy):**

```bash
# Purgar fragments de uno o varios arsenales padre (tenant creatuactivo_marketing)
node -e "
import('dotenv').then(d => { d.config({path: '.env.local'}); return import('@supabase/supabase-js'); })
  .then(({createClient}) => {
    const s = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
    return Promise.all([
      s.from('nexus_documents').select('id').like('category', 'arsenal_inicial_%').eq('tenant_id', 'creatuactivo_marketing'),
      // … repetir por cada arsenal afectado
    ]).then(async ([r]) => {
      const ids = r.data.map(x => x.id);
      await s.from('nexus_documents').delete().in('id', ids);
      console.log('Purgados:', ids.length);
    });
  });
"
```

**⚠️ NO confiar en `actualizar-fragmentos-modificados.mjs` como herramienta genérica** — tiene fragmentos HARDCODED (COMP_MODELO_01, COMP_BIN_08). Sirvió para ediciones puntuales históricas, pero NO detecta cambios actuales por hash/diff. Para v5.3+ usar el patrón purgar+re-fragmentar de arriba.

**Atajo solo si el script genérico cubre tu caso**: `node scripts/fragmentar-arsenales-voyage.mjs` — si los fragments no existen, los crea. Si existen, los salta. Útil cuando se añaden respuestas NUEVAS sin modificar existentes.

Archivos fuente y versiones actuales → ver la [tabla de arsenales](#1-nexus-ai-chatbot). Scripts de deploy por arsenal: `deploy-arsenal-inicial.mjs` · `deploy-arsenal-avanzado.mjs` · `deploy-arsenal-12-niveles.mjs` · `deploy-arsenal-compensacion.mjs` · `deploy-arsenal-ganocafe.mjs` · `deploy-arsenal-marca-personal.mjs` · `actualizar-catalogo-productos.mjs`. Luego `fragmentar-arsenales-voyage.mjs` (embeddings Voyage) y verificar con `audit-completo.mjs` (preferido — `verificar-arsenal-supabase.mjs` tiene bug PGRST116).

**Falsa alarma del audit — `desconocido: 40 fragmentos`**: `audit-completo.mjs` clasifica por `metadata.parent_arsenal`; cuando ese campo no está poblado etiqueta "desconocido" aunque la `category` esté bien. Los 40 son fragments reales de `arsenal_compensacion` + los **docs maestros padre** (`arsenal_inicial/ganocafe/reto/marca_personal`, `catalogo_productos`) + `catalogo_productos_PROD_OVERVIEW`. ⚠️ **NO ELIMINAR ninguno** — los docs maestros los necesita el fragmentador para parsear (`.eq('category', arsenalCategory)`). El warning es cosmético; se limpia poblando `metadata.parent_arsenal`.

### Video y Reels

> 📄 **Todo el detalle —inventario de los 6 nichos, componentes, posters, hosting, pipeline de actualización, taxonomía de guiones y el reel de la Home— vive en [docs/handoff/reels/REELS_Y_VIDEO.md](docs/handoff/reels/REELS_Y_VIDEO.md).** Post-producción → [scripts/dankoe-video/PIPELINE.md](scripts/dankoe-video/PIPELINE.md), que hay que leer **antes** de ensamblar cualquier reel.

**Qué es:** 6 reels verticales por nicho (`corporativo · empleados · empresarios · diaspora · informales · networkers`) que cada socio comparte por WhatsApp. Viven en `creatuactivo.com/{slug}/{nicho}` con tracking de referido. Fuente de verdad: [src/lib/reels.ts](src/lib/reels.ts). **NO** se publica reel nativo en IG/TikTok en esta fase.

**Las cuatro reglas que rompen algo si se ignoran:**

- ⚠️ **Los campos de engagement son un contrato cerrado con el Dashboard — no se renombran:** `reel_nicho`, `reel_pct`, `reel_completed`, `reel_time_s`, `queswa_opened`, `queswa_messages`, `visit_count`. Los reporta [ReelVideo.tsx](src/components/ReelVideo.tsx) a [`/api/track/engagement`](src/app/api/track/engagement/route.ts), que mergea **sin retroceder** (`Math.max` / OR lógico).
- ⚠️ **Anti-spam (crítico):** cada escritura dispara un webhook → push al socio. **Máximo ~6 escrituras por sesión.** Solo milestones del reel (25/50/75/100), `queswa_opened` una vez, y `reel_time_s` + `visit_count` en el beacon de salida. Nunca en `timeupdate` ni en heartbeats.
- ⚠️ **El WhatsApp del socio se lee de `private_users.whatsapp`**, NO de `constructor_slugs.whatsapp`. Bug histórico de "cero inicial" en esos números — el `.replace(/\D/g, '')` lo neutraliza. Fallback: el número orgánico.
- ⚠️ **Tres tipos de guion, tres registros que no se mezclan** (`public/contexto/produccion/guiones/reels/`): **documentación** (build-in-public, primera persona, despierta curiosidad sin confrontar — su mercado ya cree que "hace Gano Excel" y un hook de negocio en cada reel lo quema) · **nicho** (oportunidad directa, es el copy de las páginas `/{slug}/{nicho}`) · **sitio** (explainer en voz **neutra**, nunca "soy Luis", porque la Home la alimentan todos los socios con su `?ref`).

**Léxico de los tres:** negocio digital a secas · ingreso que no depende de su presencia · usted decide, el sistema hace el trabajo.


### Founder Spots Counter

**Location**: [src/app/fundadores/page.tsx](src/app/fundadores/page.tsx)

**Status**: Static counter showing 150 spots. Dynamic system paused waiting for real sales data. Las fases ya no muestran fechas (retiradas jul 2026 — doctrina sin fecha dura) y el countdown estático con fechas vencidas fue reemplazado por la card "se cierra por cupos, no por calendario".

**Test**: `node scripts/test-contador-cupos.mjs`

## Testing & Debugging

### NEXUS Health Check

```bash
curl http://localhost:3000/api/nexus
```

Returns: Arsenal counts, system prompt version, catalog availability, RPC status.

### Common Issues

**NEXUS messages not saving prospect data**:
- Check browser console for "CRÍTICO: Request sin fingerprint"
- Verify `window.FrameworkIAA.fingerprint` exists
- Ensure `tracking.js` loads before NEXUS interaction

**Streaming responses break**:
- Check Network tab for failed `/api/nexus` requests
- Verify `ANTHROPIC_API_KEY` is valid
- Edge runtime has 30s timeout (configurable)

**Wrong knowledge base returned**:
- Check console logs for "Clasificación híbrida"
- Update patterns in `clasificarDocumentoHibrido()`

**Queue messages not processed**:
- Supabase Dashboard → Edge Functions → nexus-queue-processor → Logs
- Check trigger: `SELECT * FROM pg_trigger WHERE tgname LIKE '%nexus_queue%'`
- Check queue: `SELECT * FROM nexus_queue WHERE status = 'pending'`
- Redeploy: `npx supabase functions deploy nexus-queue-processor`

## Business Timeline

**Fases del Lanzamiento** — ⚠️ **sin fechas duras** (decisión 31 May 2026): la ventana la cierra el cupo, no el calendario. Las fechas vencidas y el countdown estático de `/fundadores` fueron retirados (jul 2026).

1. **Lista Privada** - 150 Founder spots (Fundadores = MENTORES) — fase actual
2. **Pre-Lanzamiento** - 22,500 Constructor spots (150 × 150)
3. **Lanzamiento Público** - Target: 4M+ users

⚠️ **150 vs 15 — no confundir**: **150** = cupos totales de la Lista Privada (contador estático en [src/app/fundadores/page.tsx](src/app/fundadores/page.tsx)); **15** = núcleo de socios estratégicos de la fase de cimentación — el número que usan Queswa y los arsenales (ver Queswa Official Constants). Antes de citar cualquiera de los dos en copy nuevo, confirmar con el Director cuál aplica.

**Actualizar fechas**: `node scripts/actualizar-fechas-prelanzamiento.mjs` (legacy — hoy la página no muestra fechas).

## Deployment

### Vercel (Next.js)

- TypeScript errors don't block builds
- Set all env vars in Vercel Dashboard
- Video URLs required in production
- ⚠️ **El proyecto de Vercel que sirve creatuactivo.com se llama `creatuactivo-com`** (repo `LuisCabrejo/creatuactivo.com`, despliega por GitHub), aunque esta carpeta local se llame `marketing`. Ese desajuste de nombres ya causó una confusión: existía un segundo proyecto llamado **`marketing`** —abandonado desde dic 2025, sin repo ni dominio propio— y el `.vercel/project.json` de esta carpeta apuntaba a ÉL, de modo que un `vercel deploy` desde aquí habría publicado en el lugar equivocado. **El 14 ago 2026 se eliminó ese proyecto y se borró el enlace local**, así que la trampa ya no existe; si algún día vuelve a aparecer un `.vercel/`, verificar a qué proyecto apunta antes de usar el CLI
- ⚠️ **Un `engines` en `package.json` pisa en silencio la versión de Node del panel de Vercel.** El aviso de fin de vida de Node 20 (ago 2026) salió de ahí: el Dashboard traía `"node": "20.x"` mientras su panel decía 22.x, así que el build corría en 20 y el panel mentía. **Al diagnosticar versión de Node se lee el `package.json` ANTES que el panel** — el log del build lo confirma con un `Warning: Due to "engines"…`. Hoy los 11 proyectos de la cuenta están en **24.x** y este repo no tiene pin (obedece al panel)

### Supabase

**Prerequisites**:
- Enable `pgvector` extension (for embeddings storage)
- Enable `pg_net` extension (for DB triggers to call Edge Functions)

**Critical order**:
1. Apply migrations: `supabase/APPLY_MANUALLY.sql`
2. Seed knowledge base (copy from `knowledge_base/*.txt`)
3. Deploy Edge Function: `npx supabase functions deploy nexus-queue-processor`
4. Create trigger: `supabase/CREATE_TRIGGER_AFTER_FUNCTION.sql`
5. Update system prompts in `system_prompts` table

**Verify**:
- Edge Function logs in Supabase Dashboard
- Test: `curl -X POST https://your-app.vercel.app/api/nexus/producer`
- Check `nexus_queue` table

**Security (RLS)**:
All 34 tables have Row Level Security enabled (Dec 2025). To diagnose/fix:
```bash
# Run in Supabase SQL Editor
# Diagnostic: scripts/diagnostico-seguridad-supabase.sql
# Fix: scripts/fix-rls-seguridad-supabase.sql
```

## Important Patterns & Constraints

**Path Aliases** (tsconfig.json):
```typescript
import { X } from '@/components/X'  // → src/components/X
import { Y } from '@/lib/Y'         // → src/lib/Y
import type { Z } from '@/types/Z'  // → src/types/Z
// All imports starting with @/ resolve to src/*
```

**Custom Hooks** (in `src/hooks/`):
- `useHydration.tsx` - Prevents hydration mismatches
- `useTracking.ts` - React wrapper for tracking API

**Shared Libraries** (in `src/lib/`):
- `branding.ts` - Centralized branding v3.0 (COLORS, BRAND, ICON_COLORS, emailStyles)
- `vectorSearch.ts` - Voyage AI embeddings + cosine similarity for semantic search
- `respuestas-maestras.ts` - **Camino A backend dictador** — textos verbatim WHY_02 + EAM_01 servidos directo sin pasar por Anthropic cuando matchea chip canónico. Sincronizar carácter por carácter con `<verbatim_lock>` en arsenal_inicial.txt
- `handoff-sumario.ts` - **Warm handoff** (RE-ACTIVADO 19 jun 2026) — sub-agente Haiku genera expediente táctico + envía email HTML al equipo directivo (sistema@creatuactivo.com) via Resend cuando entra Estado 4 del FSM. Disparado en `onFinal` del stream (await, no fire-and-forget — Edge cortaría un fire-and-forget); coexiste con la doble oferta wa.me al prospecto
- `queswa-greeting.ts` - Saludo canónico de Queswa + chips `QUESWA_QUICK_REPLIES` (single source of truth — antes duplicado en 4 lugares). También exporta `QUESWA_PRODUCTS_QUICK_REPLIES` (3 chips de salud para `/productos` — Queswa asesor de salud y bienestar)
- `reels.ts` - **Fuente de verdad de Reels por Nicho** (`REEL_NICHOS`, `REEL_ASSETS`, `REEL_COPY`). Ver [Reels por Nicho](#reels-por-nicho-fase-orgánica-whatsapp)
- `wa-channel.ts` - **Capa única de canal WhatsApp** (Meta Cloud API): `sendText` (acepta `responderA` para citar) · `sendImage` · `sendTemplate` (con `buttonUrlParam` para el sufijo dinámico del botón de URL — Meta exige que la variable vaya AL FINAL de la URL, de ahí la ruta corta `/e/{token}` del Dashboard) · `sendReplyButtons` · `sendFlow` · `marcarLeidoYEscribiendo` (visto azul + "escribiendo…" en UNA llamada; se cae sola a los 25 s, por eso el webhook la renueva cada 20 mientras el motor trabaja) · `listTemplates` · `getPhoneAsset`. Único lugar con `WHATSAPP_SYSTEM_TOKEN`. (`whatsapp-meta.ts` + `sendpulse.ts` borrados jul 2026)
- `wa-bridge-auth.ts` - Auth del puente `/api/wa/*` que consume el Dashboard server-to-server (header `x-wa-bridge-secret`, `timingSafeEqual`). ⚠️ **Deniega si la env `WA_BRIDGE_SECRET` no está definida** — a diferencia del `x-webhook-secret` de Supabase; un endpoint que envía WhatsApp en nombre de la marca no puede quedar abierto por una env olvidada
- `wa-productos.ts` - **Los 22 productos para el canal**: nombre, presentación, precio, registro INVIMA, imagen y alias tolerantes a typos (`cordigold` encuentra el Cordygold). De aquí salen el envío de fotos, el pie de foto y el **pin de precio** que el motor dicta cuando el mensaje nombra un producto — sin él, el modelo resume el fragmento y deja caer el precio, o inventa el nombre (llamó *«la Intensa»* a la cápsula Fuerte, 20 ago). ⚠️ **La imagen NO lleva precio ni declaración de salud**: el precio cambia y una imagen con precio viejo circulando no se retira nunca; una imagen con promesa deja de ser conversación y pasa a ser publicidad de producto, que se juzga con la vara de la etiqueta. Nombre y marca en la imagen; precio y registro en el pie; explicación en el texto
- `ciclos-gano.ts` - **El ciclo de pago se calcula, no se recuerda**: ancla (ciclo 924 = 17–23 ago 2026, pagado el 4 de septiembre) + aritmética de semanas en calendario Bogotá. `respuestaCiclo()` la dicta el motor ante cualquier mensaje con «ciclo». Una tabla escrita se congela — COMP_PV_03 imprimía ciclos de enero de 2025 en el chat
- `wa-simulador.ts` - Responde el escenario que la persona armó en el Flow con SU cifra, calculada con las mismas tablas del Flow. El motor dictaba un ejemplo fijo al 17% a quien había elegido 16%
- `wa-pareja.ts` - **La consulta con la pareja** (24 ago 2026): detector de «lo consulto con mi esposa», el **enlace para la pareja** (wa.me a Queswa con texto pre-llenado: slug del socio + «soy la pareja de {nombre}» — la misma pieza del enlace del socio, sin infraestructura nueva) que **se ofrece primero y se genera solo si la persona acepta** (Director, 24 ago), el turno dictado con **cierre por opciones** («¿mañana, o en dos días?» — abierto, el 100 % responde «yo le aviso»), la apertura para cuando la pareja llega (la estándar con sus botones y una línea de reconocimiento; nunca una pregunta abierta a quien apenas ve la información) y el aviso al socio con el plazo. **Cableado en el webhook** (24 ago): nodo 2.23, antes de todos los demás y del motor, y la llegada de la pareja antes de la apertura (1.5b). El nodo de ambivalencia (2.8) también detecta este caso, pero 2.23 corre primero y su detector cubre todo lo que cubre el de 2.8, así que `microPromptPareja()` —que promete un enlace que no existe— no debería alcanzarse; si alguna vez se ve en el log `whatsapp_amb_pareja`, es que una frase se escapó y hay que sumarla a `detectarConsultaConPareja`
- `wa-radicacion.ts` - **Cierre de WhatsApp** — nodo determinístico que pide los **cuatro datos** (nombre completo · cédula · ciudad · paquete) en **un solo mensaje** y radica contra `POST {DASHBOARD_URL}/api/pre-afiliacion` (auth `x-wa-bridge-secret`; escribe en `pending_activations` y dispara plantilla `pre_afiliacion_nueva` al socio + al equipo). Se invoca desde el webhook **antes** de llamar al motor. Extracción con Haiku (nunca lanza; ante fallo vuelve a pedir). ⚠️ El texto de `pedirDatos()` coincide a propósito con el bloque de cierre del system prompt `queswa_whatsapp` — es la red de respaldo si el detector de volición no dispara; **editar uno obliga a editar el otro**
- `wa-guardarrail-salud.ts` - **Filtro de salud del canal** (v2, 17 ago 2026): Capa 0 de emergencia → línea 123 · derivación de entrada · validación de salida que **descarta y reemplaza el borrador, nunca lo corrige ni reintenta**. ⚠️ Calibrado sobre la línea roja **verificada** (INVIMA/SIC · Meta · FDA/FTC): bloquea enfermedad, adelgazamiento —el disparador nº1 de sanción de la SIC—, ciencia citada, mecanismo y clases farmacológicas; y, desde el **22 ago 2026, la declaración de órgano** (circulación, riñones, pulmones, cerebro, función sexual): INVIMA solo la aprueba como *"contribuye al funcionamiento **normal** de X"*, y su catálogo cubre nutrientes —no menciona Ganoderma ni una vez—. **Deja pasar** energía, vitalidad, antioxidante, adaptógeno y *"apoya el sistema inmune"*, que el propio fabricante usa y ninguna sanción del período castigó, y **las articulaciones**, porque el colágeno sí tiene declaración aprobada (Acta 10 de 2017). Investigación → `docs/investigaciones/resultados/CRUCE_INVESTIGACIONES_VOCABULARIO_AGO2026.md` y `INVIMA_PROCLAMAS_APROBADAS_SEPFSD.md` (163 declaraciones oficiales, descifradas de un PDF ilegible)
- `wa-guardarrail-negocio.ts` - **Filtro de promesa de ingreso** (17 ago 2026). ⚠️ **Los patrones exigen CONJUNCIÓN, no palabras sueltas** —dinero+tiempo, dinero+garantía, comisión+personas— porque varias tienen uso legítimo: la durabilidad es cierta en FREQ_05 donde el activo se hereda, las cifras del plan son correctas cuando las dicta un pin, y *"cada viernes"* es un hecho. Backtest sobre 400 respuestas reales: habría bloqueado 33
- `wa-onboarding.ts` - **Onboarding del socio nuevo por WhatsApp**: comando `ACTIVAR`, enlace de canal, avisos de actividad, y **`identificarSocio()` + `saludoDeSocio()`** — el canal atiende a socios y prospectos por el mismo número, y hasta el 17 ago 2026 no los distinguía: el socio recibía la apertura de prospecto y Queswa se presentaba ante él como *"la asistente de [él mismo]"*. La detección es **determinística** (su teléfono contra `constructor_slugs`, comparando **normalizado en ambos lados** — están guardados con `+`, con espacios y con cero inicial, así que `.eq()` contra la columna cruda no encuentra a nadie). Activa el `pageContext` **`whatsapp_socio`** → **MODO SOCIO** en `getPageContextInstructions()` del motor: se le habla como colega, no se le vuelve a vender lo que ya compró, y se le responde el plan completo porque lo necesita para atender a los suyos. ⚠️ `constructor_id` **NO es un UUID** sino la llave de texto que comparte con el Dashboard; y el enlace es **`/{slug}/queswa`**, nunca `/{slug}` —esa página no existe y da 404— porque además valida el slug antes de redirigir. Ver el handoff del 17 ago
- `query-rewrite.ts` - **CQR (reescritura conversacional de la consulta)** — colapsa el hilo en una consulta autónoma antes del vector search. Ver [PASO -2](#1-nexus-ai-chatbot). Hoy activo **solo en tenant `whatsapp`**; nunca lanza (ante fallo devuelve el mensaje original)
- `tts-normalize.ts` - `normalizarParaVoz()` — convierte símbolos y abreviaturas a palabras antes del TTS (sin esto el motor lee "$200 USD" como "dollar sign 200 U-S-D"). **Fuente única** compartida por `/api/voice-command` y `/api/nexus/tts`

### Design System: Bimetallic v3.0

**Fuente única y completa → [BRANDING.md](BRANDING.md)** (paleta con todos los hex, tipografía, geometría, CTAs, efectos atmosféricos, léxico §7). Aquí solo lo que se aplica en cada decisión:

**Filosofía**: "Quiet Luxury meets Private Equity" — el sitio debe parecer una firma de inversión, no un MLM típico. Dorado = máx 10-20% del lienzo.

| Rol | Token | Hex | Uso |
|-----|-------|-----|-----|
| **Oro (EL PREMIO)** | `--color-brand` | `#C5A059` | CTAs, dinero, logros, títulos clave (hover `#D4AF37`) |
| **Titanio (LA ESTRUCTURA)** | `--color-titanium` | `#94A3B8` | Iconos activos, navegación (hover → oro) |
| **Cian (EL DATO)** | `--color-data` | `#22D3EE` | Labels técnicos en mono, líneas REF, Queswa en línea. ~5%. Nunca en CTAs, títulos ni dinero. ⚠️ Reemplaza a «exclusivo servilleta» (29 ago 2026) — ver [BRANDING.md](BRANDING.md) |
| **Fondo** | `--color-bg-primary` | `#0F1115` | Carbón; alterna con `#15171C` elevado |
| **Texto** | `--color-text-primary` | `#E5E5E5` | Cuerpo; `#FFFFFF` solo titulares |
| Estado | | `#10B981` / `#FBBF24` / `#F43F5E` | Éxito / pendiente / alerta |

**Reglas que se rompen a diario:**
- **Iconos**: arrancan titanio, hover → oro. Solo CTAs, cifras y logros nacen dorados (`ICON_COLORS` en [src/lib/branding.ts](src/lib/branding.ts))
- **Bordes de card**: glass `rgba(255,255,255,0.1)` neutro; dorado `rgba(197,160,89,0.3)` **solo** en hover
- **Nunca hex hardcodeado** — use los tokens (`var(--color-brand)`, no `#E5C279`; `var(--color-bg-surface)`, no `#18181b`)
- **CTAs**: clases `.cta-primary` / `.cta-secondary` / `.cta-ghost` de [globals.css](src/app/globals.css). Nunca fondo sólido + texto invertido en un primario
- **H1/H2**: Inter uppercase para institucional, Playfair natural para editorial y narrativo; eyebrows en `<p>`, nunca `<h2>`. Un solo `<h1>` por página, vía [IndustrialHeader](src/components/IndustrialHeader.tsx)
- **Fuentes cargadas**: solo Playfair Display, Inter y Roboto Mono. Cualquier otra (Rajdhani, Oswald, Montserrat) hace fallback al sistema
- **Tailwind**: paletas `titanium`/`carbon`/`champagne` + utilidades `shadow-spotlight`, `bg-spotlight-gold` en [tailwind.config.ts](tailwind.config.ts)

**Implementación de referencia**: [src/app/page.tsx](src/app/page.tsx) — la Home v15 (29 ago 2026). Léala antes de crear una página nueva. (`/infraestructura`, la referencia anterior, se eliminó ese día.)


**Email Templates** (in `src/emails/`):
- `soap-opera/` - Soap Opera sequence (Dia1-5)
- `FounderConfirmation.tsx` - Founder registration confirmation
- `Reto12DiasConfirmation.tsx` - 12-level challenge confirmation
- `PreRegistroAdmin.tsx`, `PreRegistroUser.tsx` - Pre-registration emails

**Prospect Data Flow**:
1. Browser → `tracking.js` → RPC `identify_prospect`
2. NEXUS → `captureProspectData()` → RPC `update_prospect_data`

**Edge Runtime**:
- All NEXUS API routes use `export const runtime = 'edge'`
- Configured with `maxDuration = 60` seconds for heavy requests (product list queries)
- Supports streaming responses via `StreamingTextResponse`

**Build-Time Patterns**:
- Supabase client uses lazy initialization (avoid build-time errors)
- TypeScript errors ignored (`ignoreBuildErrors: true`)
- Environment variables validated at runtime

**Code Headers**:
- All API routes include copyright header (© CreaTuActivo.com)
- Headers specify proprietary licensing and confidentiality

**Global Window Types** (defined in `src/types/global.d.ts`):
```typescript
window.FrameworkIAA?: { fingerprint?: string }  // Tracking API
window.nexusProspect?: { id: string }           // Current prospect
```

**Never** store PII in localStorage (only fingerprint/session IDs).

## Heredado / Pendiente de eliminación

Inventario centralizado de código y rutas legacy. Cada ítem mantiene su nota detallada en la sección original; aquí se listan para que un agente nuevo identifique de un vistazo qué NO es la fuente viva.

| Item | Estado | Detalle |
|------|--------|---------|
| `/api/claude-chat` (repo **luiscabrejo.com**, no este) | Sin uso | Reemplazado por `/api/nexus` con tenant `marca_personal` hardcodeado. En este repo la ruta no existe |
| `/api/nexus` POST (síncrono) | Funciona pero legacy | Usar `/api/nexus/producer` (async queue) en producción |
| `/api/nexus/consumer-cron` | Legacy | Fallback sin triggers — el flujo activo es DB trigger → `nexus-queue-processor` |
| `nexus-consumer` (Edge Function) | Deprecated | Consumer Kafka — reemplazado por `nexus-queue-processor` |
| `src/lib/sendpulse.ts` + `whatsapp-meta.ts` | ✅ Eliminados (jul 2026) | Reemplazados por `wa-channel.ts` (capa única de canal Meta Cloud API) |
| RPC `match_documents` + columna `embedding` (1536) | Muerto — camino TS retirado 7 ago 2026 | El RPC compara contra `embedding` (512 rellenado a 1536) y las funciones que lo llamaban mandaban el vector sin rellenar: fallaban siempre. La búsqueda viva es **en memoria** sobre `embedding_512` (`getArsenalFragments` → `searchSimilarDocuments`). La función SQL y la columna siguen en la BD; el Dashboard conserva la misma copia muerta |
| `src/components/nexus/NEXUSFloatingButton.tsx` | Conservado parcial | Reemplazado por `UnifiedQueswaOrb` en layout; aún se usa para eventos servilleta |
| `/reto-5-dias/*` · `/mapa-de-salida/*` · `/auditoria-confirmada` · `/empresa-digital/*` · `/diagnostico` · `/confirmacion` | ✅ Eliminadas (jul 2026, `ca6ff59`) | Funnel muerto retirado — páginas + redirects borrados; URLs viejas del funnel → Home (301) |
| `/api/fundadores/registro-diciembre` | Legacy | Registro Diciembre — reemplazado por flujo Founder actual |
| `/api/test-resend`, `/api/test-reto-email` | Dev only | No para producción |
| `scripts/actualizar-system-prompt-whatsapp-v1.mjs` | Legacy | El vigente es `...-whatsapp-v4.mjs`. El `-v3.mjs` ya no existe |
| `*.tsx.bak` | Respaldos inactivos | Nunca editar |

## Insights Estratégicos

Posicionamiento, doctrina de venta, diáspora latina, eventos corporativos Gano Excel, distinciones léxicas críticas → ver [public/contexto/INSIGHTS_ESTRATEGICOS_v1.md](public/contexto/INSIGHTS_ESTRATEGICOS_v1.md). Contenido extraído de CLAUDE.md el 18 May 2026 — no es referencia de arquitectura técnica, es referencia de doctrina de venta.

---

## Key Documentation Files

> 📁 **`docs/` (jul 2026)** — handoffs de trabajo e investigaciones, **fuera de `public/`** (no se sirven en la web). Índice en [docs/README.md](docs/README.md). Estructura: `docs/handoff/{reels,queswa,negocio}/` + `docs/investigaciones/{prompts,resultados}/`. Los docs **núcleo** (este archivo, `README.md`, `BRANDING.md`, `POSICIONAMIENTO.md`, `EPIPHANY_BRIDGE_OFICIAL.md`, `MANIFIESTO_FUNDADORES.md`, `HANDOFF_CONTEXTO_COMPLETO.md`, `HANDOFF_QUESWA_TECNICO.md`) siguen en la raíz a propósito.

**Extraídos de este archivo (4 ago 2026)** — se movieron para que CLAUDE.md no los cargue en cada sesión:
- [docs/SERVILLETA.md](docs/SERVILLETA.md) - Deck `/servilleta` completo (aplica igual a su copia `/12-niveles`)
- [docs/handoff/reels/VIDEO_Y_ANIMACIONES.md](docs/handoff/reels/VIDEO_Y_ANIMACIONES.md) - Video estándar, color grade DaVinci, animaciones Canvas
- [docs/handoff/negocio/ESTRATEGIA_CONTENIDO_Y_VOZ.md](docs/handoff/negocio/ESTRATEGIA_CONTENIDO_Y_VOZ.md) - Estrategia de contenido, voz de Queswa (3 niveles), migración léxica, historia del fundador
- [BRANDING.md](BRANDING.md) - Design System completo + léxico aprobado/prohibido (§7)

**Architecture & Deploy**:
- [DEPLOYMENT_DB_QUEUE.md](DEPLOYMENT_DB_QUEUE.md) - Queue system deployment
- [knowledge_base/README.md](knowledge_base/README.md) - Arsenal structure and sync docs

**SEO & Performance**:
- [GOOGLE_SEARCH_CONSOLE_SETUP.md](GOOGLE_SEARCH_CONSOLE_SETUP.md) - GSC setup
- [OPTIMIZACIONES_PAGESPEED.md](OPTIMIZACIONES_PAGESPEED.md) - PageSpeed optimizations

**Video & Media**:
- [README_VIDEO_IMPLEMENTATION.md](README_VIDEO_IMPLEMENTATION.md) - Video implementation
- [QUICK_START_VIDEO.md](QUICK_START_VIDEO.md) - Quick start guide
- [HANDOFF-VIDEO-NAVAL-DAVINCI.md](docs/handoff/reels/HANDOFF-VIDEO-NAVAL-DAVINCI.md) - DaVinci Resolve color grade handoff

**Business Logic**:
- [CONTADOR_CUPOS_FUNDADORES.md](CONTADOR_CUPOS_FUNDADORES.md) - Spots counter spec
- [PITCHES_ARQUITECTO_EMPRESARIAL_V3.md](PITCHES_ARQUITECTO_EMPRESARIAL_V3.md) - Sales pitches

**Handoff & Context**:
- ⭐ [docs/handoff/queswa/HANDOFF_UX_CANAL_18AGO2026.md](docs/handoff/queswa/HANDOFF_UX_CANAL_18AGO2026.md) — **el más reciente (18-20 ago): empiece aquí.** La experiencia de usuario del canal: acuse de lectura y «escribiendo…», el webhook que responde a Meta antes de trabajar, las fotos de producto, los ciclos de pago calculados, las puertas directas, y las cuatro pruebas automáticas con lo que cada una ve y lo que NO ve
- ⭐ [docs/handoff/queswa/HANDOFF_CANAL_17AGO2026.md](docs/handoff/queswa/HANDOFF_CANAL_17AGO2026.md) — **el de los guardarraíles.** Los dos guardarraíles de salida (salud y negocio) con su criterio de calibración, el onboarding del socio por WhatsApp (comando ACTIVAR, plantilla aprobada, avisos), las trece respuestas reescritas, **los cuatro pendientes documentados a propósito** (guardarraíl solo en el webhook · arsenal_ganocafe · SUP_01 · auditoría del catálogo con alérgenos omitidos) y las cuatro lecciones que costaron errores: la cabecera que dicta lo que nombra, los disparadores que no abren puertas en fragmentos largos, el script de medición que medía mal, y por qué una decisión citada en un handoff ajeno es un reporte y no una regla
- ⭐ [docs/handoff/queswa/HANDOFF_CANAL_PRODUCCION_14AGO2026.md](docs/handoff/queswa/HANDOFF_CANAL_PRODUCCION_14AGO2026.md) — **el de la salida a producción.** Estado al salir a producción: qué cambió en route.ts (y por qué no se revierte), la prueba de 5 puntos que el Director está corriendo, el arreglo del Flow del simulador, los pendientes en orden, y la lección de la sesión: tres pruebas fallaron por ENRUTAMIENTO, nunca por copy — verificar qué llegó al contexto antes de reescribir nada
- ⭐ [docs/handoff/queswa/HANDOFF_ARSENAL_Y_LANZAMIENTO_AGO2026.md](docs/handoff/queswa/HANDOFF_ARSENAL_Y_LANZAMIENTO_AGO2026.md) — **empiece aquí si va a tocar el arsenal.** Estado de la revisión respuesta por respuesta (30 hechas, 3 eliminadas, ~27 pendientes), las 6 pruebas del canal con lo que debe responder cada una, y cómo medir la recuperación con Voyage antes de tocar un disparador
- [HANDOFF_CONTEXTO_COMPLETO.md](HANDOFF_CONTEXTO_COMPLETO.md) - Complete business context for onboarding
- [HANDOFF_QUESWA_TECNICO.md](HANDOFF_QUESWA_TECNICO.md) - Technical handoff for Queswa chatbot
- [HANDOFF_MENSAJES_1A1_FUNDADORES.md](docs/handoff/negocio/HANDOFF_MENSAJES_1A1_FUNDADORES.md) - Guion de mensajes 1-a-1 para captar Fundadores
- [EPIPHANY_BRIDGE_OFICIAL.md](EPIPHANY_BRIDGE_OFICIAL.md) - Luis Cabrejo's story (master doc for all storytelling)

**Research** (in `docs/investigaciones/resultados/`):
- Reducir Fricción Cognitiva en Presentación Servilleta - Cognitive science behind industrial design
- Desarrollo Web Diseño Industrial Técnico - Industrial design implementation
- Sistema Lead Scoring Científico Digital - Lead scoring v3.0 design rationale

**Handoffs técnicos de Queswa** (in `docs/handoff/queswa/`):
- `HANDOFF-QUESWA-PRECIOS-CVPV.md` - Bug parcialmente resuelto (22 May 2026): nombres de productos + categorías ya correctos (catálogo v7.2 con `<verbatim_lock>`); CV/PV individuales todavía pendientes en BEB_02-06 y PROD_*
- `HANDOFF-QUESWA-UX-M3-BUG.md` - UX bug handoff for M3 flow
- `HANDOFF-GANOCAFE-WIDGET.md` - Integración widget ganocafe.online
- `Handoff_WABA_Queswa_WhatsApp_Estado_Abr2026.md` - Estado integración WABA WhatsApp

**Research — Posicionamiento & UX** (in `public/contexto/investigaciones/`):
- System Prompts de IA Élite - Reference for elite AI system prompt patterns
- Investigación LLM: Máquinas de Estado Conversacional - State machine architecture for conversational AI
- RAG: Formato Markdown Consistente - RAG formatting consistency research
- UX Conversacional para Clase Media Latinoamericana / Servicio Premium - UX research for target audience
- Mejora UX Voz Agente Conversacional - Voice UX improvements research
- Posicionamiento de Producto (Obviously Awesome) / Ideas que Pegan / Storytelling - Positioning & messaging research

**Security**:
- [scripts/diagnostico-seguridad-supabase.sql](scripts/diagnostico-seguridad-supabase.sql) - RLS diagnostic
- [scripts/fix-rls-seguridad-supabase.sql](scripts/fix-rls-seguridad-supabase.sql) - RLS fix script

## Utility Scripts

**Location**: `scripts/` directory (`ls scripts/ | wc -l` para el conteo — no se escribe aquí, envejece solo). La mayoría requiere variables de `.env.local`; corre `ls scripts/` para la lista completa. Abajo solo los que llevan gotcha o no son auto-descriptivos.

**NEXUS System Prompt**: `leer-system-prompt.mjs` (lee de Supabase — **no asumir local = DB**) · `descargar-system-prompt.mjs`. `actualizar-system-prompt-v27.2.mjs` despliega la versión indicada en su `VERSION_LABEL`; ⚠️ el script y el archivo conservan el **nombre legacy `v27.2`/`v27_2`**. Historial → `CHANGELOG-system-prompts.md`.

**Knowledge Base**: `deploy-arsenal-{inicial,avanzado,12-niveles,compensacion,ganocafe,marca-personal}.mjs` + `actualizar-catalogo-productos.mjs` (deploy por arsenal) — ⚠️ `deploy-arsenal-reto.mjs` **ya no existe** (se borró con el funnel del reto, jul 2026) · `verificar-arsenal-supabase.mjs` / `descargar-arsenales-supabase.mjs`.

**Embeddings (Voyage)**: `medir-recuperacion-voyage.mjs "<consulta>" […]` (top-6 con score y 🔒 por consulta, tenant whatsapp — **se mide antes de tocar un disparador, no se supone**). ⚠️ **Corregido el 17 ago 2026**: no enviaba `input_type: 'query'` y Voyage genera vectores asimétricos para consulta y documento, así que **toda medición anterior a esa fecha es sospechosa** — dos diagnósticos se cayeron al re-medir. Producción usa `'query'` + `enrichQuery()` (`vectorSearch.ts`) · `fragmentar-arsenales-voyage.mjs` (crea fragments con embeddings; salta los existentes) · `audit-completo.mjs` (audit completo: cuenta fragments, detecta huérfanos y embeddings faltantes — preferido) · `purgar-fragmentos-duplicados.mjs` · `regenerar-embeddings-voyage.mjs`. ⚠️ `actualizar-fragmentos-modificados.mjs` tiene fragments HARDCODED — **NO** usar como genérico (ver [Updating Queswa Knowledge](#updating-queswa-knowledge)).

**Auditoría de copy**: `auditar-frases-vetadas.mjs` — recorre los fragmentos separando **disparador** (la línea `###`, con las palabras del prospecto: legítimas) de **cabecera** (`[Concepto Nuclear]`, texto que el modelo lee) y **cuerpo** (lo que lee el prospecto). Marca frases vetadas y, sobre todo, **cabeceras que citan lo que rechazan**. `--detalle` muestra cuáles. Estado sano: 0 cabeceras.

**SQL directo**: `sql.mjs` — ejecuta SQL contra Supabase desde la terminal (`node scripts/sql.mjs archivo.sql` · `-e "select …"` · `--dry`). Evita pegar migraciones a mano en el panel y permite **verificar el resultado en el mismo paso**. Usa `SUPABASE_ACCESS_TOKEN` (token personal, revocable en un clic desde el panel) — **no** la contraseña de la base. ⚠️ Ejecuta lo que se le pase, incluido `DROP`.

**Database**: `verificar-esquema-completo.mjs` · `diagnostico-seguridad-supabase.sql` (chequea RLS) · `fix-rls-seguridad-supabase.sql` (habilita RLS + policies).

**Testing del canal** (correr antes de desplegar; todas devuelven exit 1 si fallan):
- `benchmark-clasificador.mjs --tenant whatsapp` — enrutamiento, 48 casos
- `test-guardarrail-salud.mjs` · `test-guardarrail-negocio.mjs` — las dos direcciones: que bloqueen lo grave Y que no toquen el copy aprobado
- `prueba-40-preguntas.mjs` — negocio, preguntas sueltas contra producción
- `prueba-productos.mjs` — los 22 productos por 7 ángulos (nombre exacto, apodo, typo, precio, uso, comparación entre hermanos, categoría). ⚠️ Verifica por **dato duro** —precio y presentación—, no por parecido de texto: recibir el precio del producto vecino es el fallo que cuesta plata, y es el que tuvo el Ganocafé Clásico
- `prueba-conversacion.mjs --guion 1|2` — una sola persona, 26-28 turnos seguidos. Encuentra lo que las preguntas sueltas no ven: el «sí» que acepta una oferta, el typo a mitad del cierre, la pregunta que el bot repite porque no releyó su propio hilo

⚠️ **Las pruebas que llaman al motor NO ven el webhook**: los guardarraíles de salud de ENTRADA, los botones y el Flow viven allá. `prueba-conversacion.mjs` emula la derivación de salud a propósito; las otras no. Un fallo de salud en esos arneses suele ser del arnés, no del canal.

**Testing (otros)**: `test-contador-cupos.mjs` (15 escenarios del contador) · `test-flow-reto-completo.mjs` (E2E funnel reto) · `validar-schema-funnel-leads.mjs` / `diagnostico-funnel-leads.mjs`.

**Video**: `optimize-video.sh` (multi-res, FFmpeg) · `upload-to-blob.mjs` · `generate_lut.py` → `naval_style.cube` (LUT 3D Naval/Dan Koe; re-generar si se borra) · `davinci_naval.py` (DaVinci: LUT + export 1080/720/poster) · `dankoe-video/process_video.py` (**Fase 1** remoción de fondo BiRefNet/CoreML M1 → 1080×1920). **Fase 2 subtítulos** ya automatizada por forced alignment + Pillow (ver [Reel Post-Production Pipeline](#reel-post-production-pipeline-scriptsdankoe-video)); WhisperX/CapCut descartados. Setup Fase 1: `python3.12 -m venv .venv && .venv/bin/pip install -r requirements.txt` (BiRefNet ~973MB → `~/.u2net/`); nube: `dankoe-video/colab_birefnet.ipynb`.

**PWA / SEO**: `generate-favicons.mjs` (PNG desde favicon.svg, requiere sharp) · `gsc-extractor.mjs` (Google Search Console — ver Analytics abajo).

## Analytics: Google Search Console Integration

### GSC Data Extractor

**Script**: [scripts/gsc-extractor.mjs](scripts/gsc-extractor.mjs)

Automatically extracts performance data from Google Search Console API.

**Setup (one-time)**:
1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create/select project → Enable "Google Search Console API"
3. APIs & Services → Credentials → Create OAuth Client (Desktop app)
4. Download JSON → rename to `gsc-credentials.json` → move to `scripts/`
5. Run: `node scripts/gsc-extractor.mjs`
6. First run opens browser for OAuth authorization

**Output** (saved to `data/gsc/`):
- `queries_FECHA.csv` - Top 1000 keywords
- `pages_FECHA.csv` - Top 500 pages
- `countries_FECHA.csv` - Traffic by country
- `devices_FECHA.csv` - Traffic by device
- `REPORTE_GSC_FECHA.md` - Full analysis with Quick Wins

**Quick Wins**: Queries in position 5-20 with high impressions = opportunities to optimize and reach top 3.

**Google Account**: luiscabrejo7@gmail.com (owner of GSC for creatuactivo.com)

## Léxico y voz — lo que se aplica en cada línea de copy

> 📖 **Estrategia de contenido, voz de Queswa (3 niveles), mapa completo de migración léxica e historia del fundador → [docs/handoff/negocio/ESTRATEGIA_CONTENIDO_Y_VOZ.md](docs/handoff/negocio/ESTRATEGIA_CONTENIDO_Y_VOZ.md)**
> 📖 **Tablas completas de vocabulario aprobado/prohibido (~60 términos con su razón) → [BRANDING.md §7](BRANDING.md#7-léxico-queswa--vocabulario-canónico-aprobado--prohibido)**

**Regla de oro**: todo texto debe pasar el test "abuela de 75 años". Si requiere contexto técnico para entenderse, está prohibido.

> ⏳ **Las prohibiciones caducan.** Directriz del Director (7 ago 2026): *"las prohibiciones explícitas que tienen más de una semana no nos pueden condicionar"*. Buena parte de las de esta lista se escribieron dentro de un léxico que **ya abandonamos**, así que hoy protegen menos de lo que estorban — el caso de "red" es el ejemplo: prohibida en bloque, cuando el problema era solo usarla desnuda. **El orden correcto es: primero se fija el concepto nuclear, y desde ahí se construye el contexto** — nunca al revés. Antes de invocar una prohibición de esta lista, verificar que siga teniendo sentido en el léxico vigente; si no, proponer estrecharla o retirarla en vez de obedecerla.

⚠️ **La migración a léxico accesible ya está en código.** Nunca "corrija" copy accesible hacia el término viejo. Los swaps que más se encuentran: `Matriz Física` → **Respaldo Operativo** · `Tridente EAM` → **Método Comprobado** · `Base Operativa` / `empresa digital` / `negocio digital` → **canal de distribución** · `Arquitecto de Patrimonio` → **Propietario** · `escalar` → **multiplicar** · `Maestría` → **Multiplicación**. Atribución: "su canal de distribución" SIN "de Gano Excel".

⚠️ **El activo del usuario se nombra "canal de distribución", siempre y en todas partes** (doctrina jul 2026 · **el bautizo diferido queda RETIRADO el 25 ago 2026, decisión del Director**). Sinónimo válido: *empresa de distribución*. El sustituto de *red* es el mismo.

> **El motivo es de duplicación, no de estilo, y por eso reemplaza al criterio anterior.** La información de este negocio se duplica como la de una franquicia: **el término que se le enseña a un socio es exactamente el que él le va a enseñar al siguiente.** Un vocabulario doble no se degrada en el arsenal — se degrada tres eslabones más abajo, en la boca de alguien que nunca leyó esta doctrina. El plan de ir introduciendo *"empresa digital"* una vez la persona vio el mecanismo (auditoría 17 ago, que conservó las ocurrencias de cuerpo una por una) **ya no aplica**: un término que solo es correcto en cierto momento de la conversación es, por definición, un término que no se puede duplicar.
>
> **Dónde SÍ sobrevive:** en los **disparadores**, porque son las palabras que el prospecto escribe. `EMPRESA_DIGITAL_01` sigue existiendo para aterrizar a quien oyó el término en otra parte, y **traduce al canónico en su primera línea**. Eso es todo. ⚠️ Barrido aplicado en `arsenal_inicial` (v5.90). ⏳ **Pendiente: `arsenal_avanzado` (8 ocurrencias) y `arsenal_compensacion` (11)** — hasta que se hagan, los tres arsenales le dicen cosas distintas a la misma persona.

⚠️ **Las vías del plan se nombran "formas de ganar" — doce en total** (25 ago 2026). *Velocidades* es término interno: quien llega nuevo tiene que traducirlo, y esa fricción no paga nada. Aplicado en `arsenal_inicial` y `arsenal_avanzado`; en `arsenal_12_niveles` las apariciones son *velocidad de ejecución* —rapidez de actuar, no el nombre de un bono— y se conservan.

⚠️ **Medir la recuperación con el disparador literal es CIRCULAR** (25 ago 2026): el disparador vive dentro del texto embebido, así que la medición comprueba que el texto se parece a sí mismo. Verificado — *"¿Qué garantía tengo de que no voy a perder mi dinero?"* lleva a CRED_04 en 0.670 y puesto 1; *"y si pierdo la plata que meti"* no lo mete ni en el top 6. **Toda medición se hace con paráfrasis coloquiales.** Hay decisiones de arquitectura apoyadas en la forma circular (la v5.75 conservó cinco fragmentos con ese argumento). Investigación completa → [docs/investigaciones/resultados/CABECERAS_RAG_INVESTIGACION_AGO2026.md](docs/investigaciones/resultados/CABECERAS_RAG_INVESTIGACION_AGO2026.md), que además mide que **las cabeceras `[Concepto Nuclear]` son el ~47% de lo que se vectoriza y se sirve** (no el ~24% que decía este archivo).

⚠️ **De dónde se saca la voz al redactar mensajes** (decisión del Director, 17 ago 2026). **Fiable:** `knowledge_base/arsenal_inicial.txt` (cabecera + WHY), las respuestas reescritas el 17 ago, y `src/lib/wa-apertura.ts` — la única fuente sin un solo término retirado. **NO fiable:** [HANDOFF_MENSAJES_1A1_FUNDADORES.md](docs/handoff/negocio/HANDOFF_MENSAJES_1A1_FUNDADORES.md) (mayo 2026, con *Arquitecto de Patrimonio*, *Base Operativa*, *ingreso pasivo* y *libertad financiera*) y `REEL_COPY` en `src/lib/reels.ts`, que además construye con **listas de ausencias** (*"sin local ni empleados"*).

> 📐 **Cómo se construye una frase para que fluya → [docs/handoff/negocio/NARRATIVA_Y_FLUIDEZ.md](docs/handoff/negocio/NARRATIVA_Y_FLUIDEZ.md)** (ago 2026). Regla madre: **abrir cada frase con lo que el lector ya tiene y terminar con lo nuevo**. ⚠️ Y la segunda, del 26 ago: **primero se suelta el peso, después se reparte el trabajo** (§5). Un texto puede ser exacto, no tener una palabra vetada y aun así *sonar a trabajo*, porque enumera esfuerzo —así sea nuestro— antes de haber liberado al lector de nada. La palabra **delega** reencuadra la lista entera; una **imagen física** (*abrir la puerta*) hace lo que ningún procedimiento hace; y el cierre releva de la tarea imposible (*usted no necesita fabricar horas*). Casi todas las fallas de narrativa de este proyecto son esa regla al revés. Incluye la lista de verificación de seis puntos y por qué la fluidez no es cosmética — un texto que hace tropezar **activa el escrutinio analítico**, que es lo último que uno quiere en un negocio al que le sospechan pirámide.

**Cómo se escribe** (no solo qué se dice):
1. **Villano NARRADO, nunca etiquetado** — detalles que el lector reconoce (*"la bicicleta estática: le da y le da y no avanza"*), jamás una etiqueta abstracta ("PPO", "Plan por Defecto", "tiempo por dinero" en seco)
2. **Autopersuasión** — marcos moderados; escenarios que el lector completa, no afirmaciones
3. **Test Beto** — si un profesional inteligente sin MBA no la entiende, la frase está prohibida. El lujo es la claridad
4. **Concepto nuclear (modelo Waze)** — *"empresa de tecnología que ayuda a corregir una vulnerabilidad crítica en la vida financiera… ingresos recurrentes que no dependen de su trabajo físico"*
5. **Se nombra el MECANISMO, nunca el resultado** (19 ago 2026 — generalizada desde el plan de compensación, hallazgo del agente del Dashboard). La regla ya existía suelta para el dinero; aplica a **todo lo que el sistema hace por el socio**, y en un solo día resolvió tres problemas distintos: el ingreso (*"en seis meses estará ganando X"* → **cobra cada vez que su canal mueve producto**), el GEN5 (*"cada vez que entra un socio"* → **cada vez que se compra un paquete**) y Queswa (*"hace la parte comercial por usted"* → **conversa, resuelve las dudas y madura la decisión**). Un resultado prometido es una deuda que alguien tiene que pagar después —y en el caso de Queswa se desmentía sola en `/productos`, donde el checkout es por WhatsApp—; un mecanismo descrito es verificable y el prospecto lo está viviendo mientras lo lee.

   ⚠️ **La aspiración comparativa NO es un resultado prometido — y está ratificada, no pendiente.** La línea viva de la apertura del canal, *"con el potencial de igualar o superar sus **ingresos actuales**"*, **se conserva** (Director, 17 ago 2026; la anotación vive junto al bloque de la cascada vertical en [src/lib/wa-apertura.ts](src/lib/wa-apertura.ts)). El razonamiento: es aspiración **sin cifra y sin plazo** —*"con el potencial de"*—, quien monta un negocio aspira como mínimo a lo que ya gana, y **decirlo no promete, ubica**; la línea 🔄 le pone la causa. Un handoff externo la marcó para retiro y esa sección **se retractó** ([HANDOFF_DASHBOARD_A_MARKETING_AGO2026.md §4](docs/handoff/queswa/HANDOFF_DASHBOARD_A_MARKETING_AGO2026.md)). ⚠️ **Ya se ha "corregido" tres veces por una regla anterior a esa decisión; el ejemplo que estaba escrito aquí era el vector.** Dónde SÍ vive la prohibición: el **plazo** (*"en seis meses estará ganando…"*), la **garantía**, y la **sustitución del salario** (*"reemplace su sueldo"*, *"renuncie a su trabajo"*) — esas tres las bloquea `wa-guardarrail-negocio.ts`; la aspiración comparativa **no**, y es correcto que no.

⚠️ **LA COLUMNA: hacer sencillo lo que era difícil — y NO definirnos por la tarea vieja** (Director, 26 ago 2026). Es la categoría a la que pertenecemos, la misma de las apps que la gente ya entiende: **del taxi a Uber · de las cartas físicas a WhatsApp · de la videotienda a Netflix**. Ninguna de las tres se presenta como *«hacemos por usted lo que antes le tocaba»*: Uber no dice *«pedimos el taxi por usted»*, dice que el carro llega con tocar. **Plantearnos como quien hace la faena vieja es aburrido —a nadie le interesa— y de paso la vuelve vívida y pesada justo antes de invitarlo.** Se dice la verdad y se dice hacia adelante: **lo que antes era complejo, hoy es sencillo.** La dificultad se nombra en **una frase, sin inventario**; lo que se describe es la comodidad de ahora. ⚠️ El defecto tiene una silueta reconocible: *«buscar, presentar, explicar y dar seguimiento, persona por persona»* — un listado de la faena. Se cambia por *«en ese entonces esto era complicado de desarrollar. Hoy no lo es»*. Y la prueba de que hoy no lo es va como **hecho verificable** (*se maneja desde una aplicación, y buena parte desde WhatsApp*), nunca como adjetivo.

**Las cuatro reglas de la sesión del 8 ago 2026** — salieron de reescribir 18 respuestas seguidas con el Director, y son las que más se violan:

- **No explicarle jazz a quien no sabe música.** Dar el contexto completo y el detalle exacto **confunde**: es información precisa que el lector no puede recibir. Una idea por párrafo; y cuando aparezca la tentación de agregar una precisión "para que quede completo", ese es exactamente el momento de no hacerlo. Donde más daño hace es en el plan de compensación ([[feedback_explicar_jazz]]).
- **Listas de presencias, nunca de ausencias.** *"En un negocio tradicional usted paga arriendo, nómina, inventario y transporte"* cuesta una fracción de *"sin local, sin empleados, sin bodega"* — en la segunda el lector construye cada cosa para después tacharla.
- **El producto se eleva; la acción se trivializa.** El registro sube tomando prestado el léxico de **las finanzas**, nunca el del gremio del mercadeo en red (analogía del cannabis: esa industria cambió su estigma con el léxico de la medicina). La prueba: ¿esa palabra la diría una banca privada, o solo alguien que lleva años en esta industria? ([[feedback_elevar_registro_desde_finanzas]])
- **La nomenclatura del plan va literal.** *Binario 17%*, *Bono GEN5*, *GCV*, *PV/CV* **no se traducen** por accesibles que suenen: decir *"su comisión queda en 17%"* hace que el modelo y la persona calculen sobre la facturación cuando corre sobre el GCV. La accesibilidad manda en el **marco**; la precisión manda en la **cifra y su nombre** ([[feedback_nomenclatura_del_plan_literal]]).

**Las tres que se sumaron el 8-9 ago 2026, reescribiendo doce respuestas más:**

- **La fricción no es enemiga; la promesa de que todo se resuelve solo sí.** *"Nubank no multiplica su dinero — hay cosas que usted tiene que hacer, así sean sencillas"* (Director). Quien va a invertir **espera** trámite: si le decimos que su parte es *la parte liviana* o que son *dos toques*, le quitamos seriedad a una decisión que él está tomando como patrimonio. Su parte se dice con **verbos** —decide, comparte, cobra—, nunca con adjetivos que la minimicen. Y quien se interesa **quiere comprender**, no solo que se lo hagan ([[feedback_friccion_con_dignidad]]).
- **La tesis completa va en la primera línea, y con forma.** *"La diferencia no está solo en quién carga con la operación, sino en lo que a usted le cuesta crecer"* le dice al lector qué va a leer **y reconoce lo que él ya pensaba antes de corregirlo**. Y las frases se dejan respirar: el estilo telegrama —seis palabras, guion, dos puntos— optimiza caracteres cuando lo que hay que optimizar es que se entienda. Auditoría de estilo encargada por el Director sobre la redacción del agente Gemini ([[feedback_cadencia_primera_linea]]).
- **La evidencia verificable vence a cualquier adjetivo.** *Rigor legal · solidez corporativa · auditada* no prueban nada; un número de ley, una dirección, un registro de afiliados y un registro sanitario sí. Antes de escribir un adjetivo de credibilidad, buscar el hecho que lo reemplaza — en `catalogo_productos` llevaban meses INVIMA y la TGA de Australia sin que ningún fragmento de primer contacto los usara.

**Las siete reglas de escritura del 25 ago 2026** — de auditar el arsenal inicial respuesta por respuesta con el Director:

- **La analogía es un PUENTE, no un argumento.** Ocupa una frase y transporta; con remate propio, el lector procesa dos tesis y se pierde el hilo. Comprobación: quitarla debe dejar el párrafo funcionando, solo más seco — si al quitarla se cae una conclusión, hacía trabajo que no le tocaba.
- **El sustantivo tiene que aparecer.** Una respuesta puede ser impecable en cumplimiento y dejar al lector sin idea. FREQ_28 decía lo que *no* era resolver de raíz y saltaba a las herramientas, sin nombrar nunca **un canal de distribución**. Ese vacío es donde el modelo improvisa.
- **NO se habla mal de los otros equipos.** *«Ahí termina el favor»* desprecia a distribuidores reales, que pueden ser conocidos del prospecto; y es normal que cada equipo desarrolle sus estrategias (Director). Quien desprecia invita a que lo midan con la misma vara.
- **La exclusividad se reclama sobre PRODUCTOS con nombre, nunca sobre la tecnología.** *«El único que le suma inteligencia artificial»* es falso hoy y suena a fanfarronada; *«el único que le da acceso a **creatuactivo.com** y **queswa.app**»* es verificable, no envejece y no incomoda a nadie.
- **NO se nombra el gremio fuera de `NET_01` y `NET_02`.** Solo ahí lo trajo la persona. En otra respuesta, *«el viejo marketing de redes»* le revela la categoría a quien no la traía **y nos ubica dentro de esa industria como su versión mejorada**. La barrera se cuenta sin etiqueta: *tocaba estar cerca y reunirse en persona*.
- **NO se invoca un fantasma para negarlo.** *«Resultados verificables, no gurús de internet»* le mete esa imagen a quien no la traía. La negación solo es gratis si niega lo que el lector **ya** esperaba.
- **Podar disparadores tiene el mismo riesgo que alargarlos, y se mide igual.** Una poda de ACTIVACION_01 y PERFIL_01 rompió dos puertas que estaban bien; se cazó midiendo contra los embeddings del respaldo.

⚠️ **Al retirar algo por cumplimiento, pregúntese qué pregunta quedó sin dueño.** Sacar los eventos en vivo de `FREQ_08` dejó *«¿hacen reuniones?»* devolviendo el té Rooibos — la pregunta más cargada del multinivel, sin respuesta. De ahí nació `FREQ_35`.

⚠️ **Registrar lo que se revisó y NO se tocó vale tanto como registrar lo corregido**, con el motivo: sin eso el próximo que audite pierde el tiempo, o «arregla» lo que estaba bien.

**Antes de reescribir cualquier respuesta, busque con quién colisiona.** En una sola sesión aparecieron cuatro fragmentos distintos respondiendo la misma pregunta con criterios opuestos — el prospecto recibía una cosa u otra según el azar del vector search. Comparar disparadores primero: `node scripts/sql.mjs -e "select category, title from nexus_documents where tenant_id='whatsapp' and category like 'arsenal_%'"`.

**Prohibiciones de alta frecuencia** (el resto → BRANDING.md §7):
- **filtrar / filtro / descartar** → conversar · madurar la decisión · reconocer quién está listo ([[feedback_filtrar_prohibido]])
- **equipo directivo** → **equipo de creatuactivo.com** (decisión del Director, 8 ago 2026; barrido en los dos arsenales). Se conserva solo en el correo interno de handoff (`handoff-sumario.ts`, `route.ts`), que ningún prospecto lee
- **el marco del hábito de consumo diario** (*"el café que usted ya iba a tomar igual"*, *"productos que de todos modos va a consumir"*, *"lo que destinaba al mercado de la casa"*) → **productos premium de bienestar que el cliente incorpora a su rutina**, y la recompra explicada por **resultado**. El marco viejo planta la comparación con el estante del supermercado antes de que la persona vea un precio. ⚠️ Se retiró de WHY_02 el 8 ago y **reapareció entero en otros cuatro fragmentos el mismo día** ([[feedback_productos_premium_aspiracionales]])
- **cadencia de pago mezclada** → el consumo es **mensual**, Gano liquida **cada viernes** — la semana comercial va de **lunes a domingo y es un ciclo numerado**, y cada ciclo se paga **el segundo viernes después de su cierre** (dato del Director, 20 ago 2026: ciclo 924 = 17–23 ago, pagado el 4 de septiembre; corrige la nota del 17 ago que decía "semana siguiente"). El ciclo vigente se **calcula, no se recuerda**: `respuestaCiclo()` en [src/lib/ciclos-gano.ts](src/lib/ciclos-gano.ts), dictada por el motor ante cualquier pregunta con "ciclo". Decir *"el viernes siguiente a la compra"* insinúa un pago más rápido del real y decepciona en la primera semana, que es el peor momento. ⏳ Pendiente auditar si algún fragmento lo insinúa. Decir *"le entra mes a mes"* obliga a desenredarlo después ([[reference_gano_paga_semanal]])
- **nombrar un bono por su velocidad o por su duración** (*paga rápido · la que paga a mayor velocidad · Capitalización Inmediata · ingreso inmediato · Renta Vitalicia*) → **cada vía se nombra por lo que la mueve**: **GEN5 = compra de paquetes empresariales · Binario = consumo recurrente**. El adjetivo de velocidad era además **falso** —la compra de un paquete es esporádica—, así que lo único que se afirma es *cada vez que ocurre*, sin ritmo ni plazo. ⚠️ **El daño es aguas arriba:** doce años de campo del Director muestran que el GEN5 se ve más llamativo que el ingreso recurrente incluso para quien lleva años, y con esa idea el socio le dibuja la pirámide a su prospecto sin darse cuenta. La **función** sí se conserva (el GEN5 financia el crecimiento temprano): decir para qué sirve no es decir qué tan rápido llega. Los **disparadores conservan las palabras del prospecto** (*"¿cómo se gana rápido?"*) — son su vocabulario, no el nuestro. ⚠️ **Y el GEN5 se cuenta en COMPRAS, nunca en personas**: *"por cada paquete empresarial que se compra en su canal"*, jamás *"por cada persona que arranca"* ni *"cada vez que un socio nuevo entra"* — la segunda forma dibuja la escalera de gente, que es la silueta que el prospecto reconoce como pirámide. El Flow del simulador lo dice literal: *"se cuenta por paquetes comprados, no por personas"*, y el Dashboard no puede contar distinto ([[feedback_ejemplos_compras_no_personas]])
- **«activo» dicho de la PERSONA** (*"no depende de que usted esté activo ese día"*) → **presente · involucrado**. En esta industria *activo* ya tiene dueño: significa **estar al día con la compra mensual**, así que la frase se lee como que esa compra no se necesita — y sí se necesita. Dicho de la CUENTA o del código (*"Código de Distribución activo"*) es correcto y se conserva (14 ago 2026)
- **entrar**, dicho de comprar el paquete o de iniciar (*«si usted entra con un paquete»*, *«quien entra con usted»*, *«entra al proyecto»*) → **comprar · iniciar · vincularse** (Director, 3 sep 2026). Es el verbo de la pirámide: a una cadena se *entra*; un inventario se *compra*. *«Le entra»* dicho del dinero sí vale. Barrido aplicado en los tres arsenales el mismo día (`EAM_01` 🔒, `NIVELES_01` 🔒, `ADV_VAL_03`). ⏳ Queda la web: *quien entra con usted* en `page.tsx`, `fundadores`, `prueba` y `planes`
- **Maestría** (3er Comando) → **Multiplicación** ([[project_rename_maestria_multiplicacion]])
- **guía / acompaña** (lo que Queswa hace con la decisión) → **madura** ("madura la decisión", SOLO 3ª persona — regla del espejo) ([[feedback_promesa_canonica_queswa]])
- **cambiar horas/tiempo por dinero** (villano) → el villano se **NARRA**, y la narración canónica es la de **STORY_03**, que va bajo `<verbatim_lock>` y tiene **tres** piezas, no dos: *"usted trabaja el mes entero, pero al día siguiente de que le entra la plata, ese dinero ya tiene dueño — el banco, las cuotas, los recibos"* + **el ciclo**, *"es un ciclo de trabajar, pagar cuentas y repetir"* + remate obligatorio *"le pasa exactamente igual al que gana dos millones y al que gana **más de** veinte"*. El *"más de"* es deliberado: incluye al que gana treinta o cincuenta. Sin el remate, quien gana bien se exime (*"ese no es mi caso"*) y se acabó la conversación; sin el ciclo, el villano queda como un mal mes y no como una estructura. ⚠️ **No abrir con esto:** en frío es un diagnóstico entregado como veredicto a alguien de quien no sabemos nada. ⚠️ *Dependencia* es el nombre **analítico** nuestro, no texto para el prompt: escrito como etiqueta es lo único que el modelo puede copiar, y así se amputó el villano del canal (19 ago 2026). La **promesa** sí usa "no depende de su presencia" ([[feedback_horas_no_son_el_villano]])
- **operar / operador** (de cara al prospecto) → hacer el trabajo / trabajar / funcionar; el usuario: dirigir / ser dueño
- **escalar** (el activo del usuario) → **multiplicar**
- **soberanía financiera** → tranquilidad / estabilidad / seguridad (EXCEPCIÓN: el lema de Luis se conserva)
- **personas** (nombrando a quienes componen la organización o a quienes hay que conseguir) → **clientes** y **socios de negocio**. Es literalmente lo que el prospecto teme del multinivel ("meter personas"), y el vocabulario correcto es el de una empresa: se tienen clientes y socios. ✅ SÍ se usa cuando Queswa habla de a quién atiende ("atiendo a cientos de personas") o cuando el prospecto pregunta si habla con una máquina — ahí no nombra reclutamiento ([[feedback_vocabulario_empresarial]])
- **quienes componen el canal** → el bautizo es de estructura, no de gente: **clientes · clientes VIP · red de clientes · consumidores · distribuidores · red de distribuidores · socios de negocio**. Prohibido *"gente que arranca con usted"*, *"personas que inician el proyecto"*, *"conseguir personas"*. La regla se justifica sola: **un canal de distribución está hecho de distribuidores y clientes** — el vocabulario sale de la estructura del negocio y por eso no hay que defenderlo ([[feedback_vocabulario_empresarial]])
- **el colectivo del usuario** → **su canal** (9 ago 2026). *Su organización* se retiró de los cuatro arsenales: `arsenal_inicial` ya decía *su canal* mientras compensación y avanzado decían *organización*, así que al prospecto le cambiábamos la palabra justo al llegar al dinero. ⚠️ **Cuando el colectivo hace algo humano —consumir, pedir, comprar— se nombra a quién:** *sus clientes*, *sus socios*. Un canal es un conducto y no consume, y una sola palabra no puede cargar a la vez la red de clientes y la de dueños de canal; nombrar a quién sí, y además mete al consumidor en la frase, que es donde la Ley 1700 quiere verlo. ⚠️ **Los tres registros del rol:** a él en 2ª persona **sin título** (*usted es el dueño*) · a los suyos en 3ª persona **socios** (y *clientes preferenciales* los que solo consumen) · en el código **constructor** (`constructor_id`, `constructor_slugs`), que no se migra
- **Propietario** (cargo retirado el 8 ago) → **socio**. Sobrevivía en 31 lugares de tres arsenales contradiciendo la decisión; barrido el 9 ago
- **su socio logístico y financiero / su socio digital** → **Gano Excel** / **Queswa**, por su nombre. Un rótulo interno le confirma la duda a quien duda (criterio de v5.60, FREQ_07), y libera *socio* para que signifique una sola cosa: la gente del canal del usuario
- **red** *desnuda* ("una red de personas que compren") → **red de clientes y socios** · organización · canal de distribución. La palabra no está prohibida: lo que la vuelve tóxica es usarla sola. Acompañada nombra una base comercial
- **directamente proporcional · matemáticamente · es la consecuencia matemática de** → decirlo en llano. Nos hace sonar inteligentes y no empáticos; ver también [[feedback_matematica_toque_experto]]
- **rebatir una objeción** (*"precisamente porque no tiene tiempo…"*, *"eso no es un problema de organización"*, *"cuánto le cuesta quedarse igual"*) → **se le CONCEDE la razón bajo su premisa y después se retira la premisa**. Confrontar la resistencia la aumenta —la resistencia predice el mal resultado (r = −.24), el entusiasmo no predice nada— y en una persona ambivalente el costo de no hacer nada vuelve más atractivo APLAZAR. ⚠️ *"No tengo tiempo"* no es una objeción al negocio: es **una pregunta sobre el tamaño**, y se contesta con la magnitud. Protocolo de las cinco reglas del bloque OBJ → §5.4 de [CIENCIA_CONDUCTUAL_SEGUIMIENTO_Y_ACUERDO_AGO2026.md](docs/investigaciones/resultados/CIENCIA_CONDUCTUAL_SEGUIMIENTO_Y_ACUERDO_AGO2026.md). ⏳ **OBJ_02 sigue incumpliéndolo** a propósito y sin corregir
- **pregunta de cierre que encuesta** ("¿qué más quiere saber?", "¿en qué más le ayudo?") → **la pregunta PROPONE un paso concreto**, no pide que el prospecto lo busque. Una pregunta abierta le entrega a él la carga de encontrar el siguiente tema, y la salida más fácil de esa carga es irse. Las preguntas están para que la persona **se quede**
- **pregunta de cierre con dos salidas** ("¿le muestro A, o B?") → **una sola pregunta, una sola salida**. El ser humano retiene la última opción, responde "sí" pensando en una de las dos, y repreguntar convierte el avance en trámite (vivido por el Director con Queswa, 7 ago 2026). Aplica a arsenales, textos dictados y system prompt; quedan ~23 dobles en arsenales para el barrido
- **"esto" / "eso"** para auto-referirnos → nombrar concretamente qué es
- **oportunidad de negocio · libertad financiera · ingreso pasivo · reclutamiento · sé tu propio jefe** → (eliminar — filtran como MLM)
- **perseguir / convencer** → (eliminar — plantan objeciones inexistentes); **pasivo** → recurrente
- **Máquina Híbrida · capas** → los tres Pilares; **Hardware/Software** → El Músculo / El Cerebro
- ⚠️ **Mostrar USD a visitante de Colombia** → **CO = SOLO COP** para TODO (precios Y comisiones, tasa fija $4,500); US = USD limpio; resto = USD (+COP). País-aware en `getPaquetesPricingPin`/`precioPaqueteLinea`/`getPinCifrasGEN5`/`getTablasComisiones`
- **PII hardcodeada en arsenales** → nunca (seguridad)

**Voz del agente (resumen de los 3 niveles)**: aforismos y nombres propios en **tercera** persona ("Queswa explica", "Centro de Mando Queswa"); lo que el agente hace AHORA en la conversación, en **primera** ("yo proceso", "me encargo"). Detalle y casos límite → el doc enlazado arriba.

**Constantes canónicas de vocabulario** (los números → ver [Queswa Official Constants](#modifying-nexus-behavior)): el Método Comprobado = **Compartir · Recibir**, y la multiplicación es la consecuencia · 90% automatizado · más de 60 países (Gano) · 16 países operativos (CreaTuActivo — Puerto Rico genera puntos de forma independiente, por eso 16 y no 15; corregido 19 ago 2026) · 15 cupos Fundadores.

**Cierre v5.2 (May 2026) — frase canónica única**: cuando el prospecto pregunta cómo se inicia, Queswa entrega FREQ_03 (los 3 niveles ESP + pregunta de selección) en `<verbatim_lock>`. Sin entrevista BANT, sin "equipo de Dirección Estratégica", sin "Asignación de Capital". El FSM avanza a Estado 3 (nombre) → Estado 4 (warm handoff automático).

**Historia del fundador**: [EPIPHANY_BRIDGE_OFICIAL.md](EPIPHANY_BRIDGE_OFICIAL.md) es el documento maestro para todo storytelling (versiones de 60s / 3min / 7min). Frase clave: *"La soberanía financiera no se trata de lujos. Se trata de poder cumplir tu palabra."*
