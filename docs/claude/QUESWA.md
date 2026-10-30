# Queswa — arquitectura, motor y conocimiento

> Texto íntegro de lo que vivía en [CLAUDE.md](../../CLAUDE.md) hasta el 18 oct 2026, movido sin recortar. CLAUDE.md conserva cada regla en una o dos líneas y apunta aquí; **lo largo —el porqué, las fechas y los casos— se mantiene en este archivo.** Si una regla cambia, se corrige aquí y su línea en CLAUDE.md.

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


**Respuestas canónicas** — la fuente viva es siempre `knowledge_base/arsenal_inicial.txt`, y **aquí no se transcribe ninguna**: se reescriben cada semana y una copia en este archivo envejece en días. Cinco llevan `<verbatim_lock>` sincronizado carácter por carácter con `src/lib/respuestas-maestras.ts` — **WHY_02 · WHY_04 (`MASTER_DINERO_01`) · EAM_01 · EMPRESA_DIGITAL_01 · INVERSION_MARKETING_01** (Camino A). Para ver una respuesta, léala del `.txt`; para saber por qué quedó así, el `[Concepto Nuclear]` de su cabecera y el [CHANGELOG](../../knowledge_base/CHANGELOG-arsenales.md).

### 1. NEXUS AI Chatbot

**Naming**: User-facing brand is "Queswa" (since v15.0). Code/components still use "NEXUS" prefix (no refactor planned). Use "Queswa" in UI text, "NEXUS" in code references.

**Ecosistema de proyectos** (todos comparten el mismo Supabase DB):

| Proyecto | Rol de Queswa | System Prompt | Estado |
|----------|---------------|---------------|--------|
| `creatuactivo.com` | Filtrar prospectos para funnel Fundadores | `nexus_main` | Activo |
| `luiscabrejo.com` | Marca personal — posicionar a Luis, redirigir a creatuactivo.com | `marca_personal_v1.0` | Activo (Mar 2026) |
| `queswa.app` | Chief of Staff del Director Ejecutivo — CRM + pipeline + mensajes | `queswa_dashboard` (tenant `dashboard`, mismo archivo fuente) | Activo (Mar 2026) |
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

**WhatsApp WABA** — canal operativo. 📄 **Estado de la cuenta de Meta, diagrama del flujo y decisiones en curso → [docs/handoff/queswa/WABA_REFERENCIA.md](../../docs/handoff/queswa/WABA_REFERENCIA.md)** y [HANDOFF_SESION_CANAL_Y_HOOK_AGO2026.md](../../docs/handoff/queswa/HANDOFF_SESION_CANAL_Y_HOOK_AGO2026.md). **No duplique aquí el estado de Meta** — cambia solo y se desincroniza.

Webhook `/api/whatsapp/webhook` (Node, 90 s) → adaptador de canal: extrae número, texto y `referral` de CTWA, inserta el prospecto (`fingerprint: wa_{phone}`), llama a `/api/nexus` con `x-tenant-id: whatsapp`, y responde por Graph API. Prompt `queswa_whatsapp`, fuente `knowledge_base/system-prompt-queswa.md` — **la misma de la web** (ver Reglas Críticas).

**Lo que rompe el canal si se ignora:**

- ⛔ **Quien escribe con nombre de usuario NO va en `to` — va en `recipient`** (21 ago 2026). Meta oculta el teléfono detrás de un **BSUID** (`CO.1497020585516131`) y lo reparte entre `from`, `wa_id` y `user_id` **sin garantía de cuál trae qué**: del mismo remitente llegó prefijado en un turno y pelado en el siguiente. Por eso `wa-channel.ts` elige la identidad **por forma** (teléfono real primero, luego el prefijado; si ningún campo lo trae, se rescata del `wamid`, que lo lleva codificado) y arma el destinatario con `destinatario()`: BSUID → `recipient` + `recipient_type`, **sin `to`**. ⚠️ **La trampa es que un BSUID en `to` NO da error**: Meta responde 200 con identificador de mensaje, lo resuelve a la forma sin prefijo y lo descarta después con **#131026** en un aviso de estado aparte. Falla en silencio y con apariencia de entregado — costó cinco rondas de prueba, con uno de cada cinco números viendo «escribiendo…» y sin recibir nada. **Se diagnostica con `select * from wa_envios_fallidos`**, la tabla donde el webhook guarda lo que Meta acepta y no entrega (el log de Vercel se pierde en minutos); los cuatro campos de identidad de cada mensaje quedan en `wa_mensajes_procesados.identidad`
- ⚠️ **Tres números, no confundirlos**: `+57 321 519 3909` = el WABA (Queswa) · `+57 320 341 5438` = el personal de Luis (el 1-a-1) · `+57 320 680 5737` = su WhatsApp Business, `WHATSAPP_ORGANICO_DEFAULT` (fallback de reels).
- ⛔ **NO tocar el nombre visible mientras `name_status` esté en revisión** — cada guardado abre una solicitud que pisa la anterior; así se perdió una aprobación previa. Meta permite 10 cambios cada 30 días. ✅ **La revisión de «Queswa» terminó** (auditado 21 ago 2026): `verified_name: Queswa`, `new_name_status: NONE` — no hay solicitud en cola y **no quedó en `DECLINED`**. ⚠️ `name_status` devuelve **`NON_EXISTS`**, que **no está en la lista oficial de Meta** (APPROVED · AVAILABLE_WITHOUT_REVIEW · DECLINED · EXPIRED · PENDING_REVIEW · NONE) y es idéntico de v19 a v24; **no es ausencia de certificado sino ausencia de expediente de revisión** — comprobado enviando `hello_world` a un teléfono real: el chat muestra **Queswa** como nombre verificado. ⚠️ **La API nunca dice `APPROVED` en este número, así que no lo lea como rechazo ni vuelva a someter el nombre.** Y si comprueba de nuevo: WhatsApp pone el nombre de Meta en la **segunda línea** del encabezado cuando el número está guardado en contactos — la primera línea es el nombre local del teléfono y no prueba nada
- ⛔ **NO ejecutar `request_code` / `verify_code`** sobre un número `CONNECTED` que funciona. `code_verification_status: EXPIRED` **no bloquea el envío** (medido el 4 ago); el error #131037 era un riesgo del manual, no algo activo.
- ⚠️ **Ventana de 24 h**: si la persona escribe primero se responde en **texto libre**; iniciar conversación con quien nunca escribió **exige plantilla aprobada**, sin excepción.
- ⚠️ **`clonar-arsenal-whatsapp.mjs` NO actualiza lo existente** — solo inserta categorías nuevas. Para propagar fragmentos *modificados* hay que **purgar primero** en el tenant whatsapp; si no, quedan stale.
- ⛔ **NO modificar `/api/nexus/route.ts` por WhatsApp.** El webhook es solo adaptador de canal; toda la lógica de IA vive en el motor.
- ⚠️ **Flow del simulador** (`WHATSAPP_FLOW_SIMULADOR_ID`, mismo ID en Vercel): las descripciones de `NavigationList` admiten **máx 20 caracteres** — el validador de publicación de Meta NO lo revisa, el runtime del teléfono sí (el Flow estuvo `PUBLISHED` y era imposible de abrir). Para diagnosticar: la **vista previa interactiva** (`?fields=preview.invalidate(true)`) muestra el error completo. ⚠️ **El runtime de Flows NO acepta condiciones sobre dos campos** (medido a golpes, 25 ago 2026): `A == 'x' && B == 'y'` falla por gramática —con o sin paréntesis—, el `If` anidado bajo `Form` excede su conteo de niveles, y `Switch` tumba el validador con un error interno. Límites globales que también muerden: **máx 10 ramas de navegación en todo el Flow** (ya usa 9) y **máx 2 `NavigationList`**; los `id` de pantalla **no admiten dígitos** (por eso todas deletrean: `RENTA_DIECISIETE`). La salida que cabe en todo: **un solo desplegable con las combinaciones** (`10x4`) e `If` planos de una variable; el webhook decodifica (`escenario` → clientes + consumo, bloque del simulador en `webhook/route.ts`). Actualizar vía API devuelve el Flow a DRAFT → republicar con `POST /<FLOW_ID>/publish`. **Copia versionada del JSON**: [docs/handoff/queswa/flows/simulador-de-ingresos.flow.json](../../docs/handoff/queswa/flows/simulador-de-ingresos.flow.json) — el builder de Meta no es fuente versionada. El webhook lo envía pegado a la oferta de números (pantalla RENTA_MENU por defecto — prioridad del ingreso recurrente, decisión del Director 14 ago).
- ⚠️ **El cierre del canal no cobra peaje** (14 ago 2026): los cuatro datos de la radicación **nunca condicionan una respuesta**. Ante una digresión se responde completo; la primera vez se recuerda en una línea qué falta, después se suelta y se retoma tras un par de respuestas. En la **primera** digresión con algún dato capturado, el equipo recibe la plantilla con lo que hay y qué falta (`avisarInteresParcial` en wa-radicacion.ts) — el cierre en persona es parte del diseño. Regla viva en el prompt `queswa_whatsapp` («Los datos nunca son peaje») y red de digresión en `gestionarCierre`.
- ⛔ **La FSM de cierre del motor NO aplica a WhatsApp NI a la web** (aislada en WhatsApp el 5 ago 2026; la web la dejó cuando pasó a compartir el cierre del canal, 4 sep 2026): sus estados 2/3/4 entregan enlaces `wa.me` al propio WABA y un correo de handoff que duplicaría la plantilla de pre-afiliación. El guard es `cierreLoManejaElCanal = canalDictado` (`whatsapp` y `creatuactivo_marketing`), que deja `closingState` en 0. El cierre de los dos vive en [src/lib/wa-radicacion.ts](../../src/lib/wa-radicacion.ts) → `pending_activations`. **En este motor la FSM solo corre fuera de `canalDictado` —en la práctica, el widget de ganocafe.online (`ecommerce`); luiscabrejo.com tiene su propio `/api/nexus` en su repo—; no reactivarla para estos dos tenants.**
- ⚠️ **`src/lib/wa-channel.ts` es el ÚNICO lugar que habla con graph.facebook.com** y que conoce `WHATSAPP_SYSTEM_TOKEN`. El Dashboard opera el canal por el puente `/api/wa/assets` + `/api/wa/send`, autenticado con `x-wa-bridge-secret`; **si la env no está definida el puente DENIEGA** (503) en vez de abrirse. No copiar el token al Dashboard.
- 🟢 **El App Review de Meta NO hace falta para este caso de uso** (auditoría cerrada 26 jul 2026): sobre activos propios basta el *Acceso estándar*. Solo se retoma si se decide que cada socio conecte su propio número.

**Fotos de producto** (20 ago 2026): Queswa manda la foto cuando se la piden. Las 22 son estáticas en `public/productos/compuestas/{slug}.jpg` y se sirven por CDN —el envío no toca nuestro servidor—; las genera `scripts/componer-imagenes-producto.mjs` componiendo el PNG oficial sobre la placa de marca (`public/productos/_set/placa-1080.png`, extraída de las escenas del Dashboard). **1080×1080 y no 9:16**: el 9:16 es formato de Estado, y WhatsApp recorta a cuadrado por su cuenta la imagen de un chat, normalmente cortando el producto. ⚠️ **El producto es la foto REAL, nunca generado por IA** — un empaque dibujado es un producto que no existe. Y si el mensaje no nombra producto («dame una imagen»), se toma del hilo, dando prioridad a lo que dijo la PERSONA sobre lo que dijo el bot. **Imágenes de familia** (22 ago 2026): `categoria-{bebidas,suplementos,cuidado-personal,luvoco}.jpg` y `portafolio.jpg` en la misma carpeta, generadas por `scripts/componer-imagenes-categoria.mjs` — misma placa, mismo título y marca de agua; solo nombre de categoría y conteo, sin precio. Los productos guardan **proporción real entre sí** (`ALTO_REAL`, medida sobre `public/productos/productos.webp`) y van juntos, no repartidos. Las familias usan `public/productos/_set/limpios/{slug}.png` —las fotos de estudio de ganoexcel.com.co sin hongos ni frutas, con el fondo quitado por `scripts/recortar-fondo-birefnet.py`— y caen al PNG oficial solo si falta alguno; **las individuales siguen usando el PNG oficial con hongo a propósito** (allí la decoración suma). ⚠️ **La imagen individual de la máquina Luvoco es la máquina SOLA** (`luvoco55-1-1024x1024.png`, también en el catálogo web): con las cajas al lado la persona entendía que venían incluidas; el PNG del sistema completo queda solo para `categoria-luvoco.jpg`. **El webhook las envía** (22 ago 2026, bloque 2.25a, antes que la foto de producto): cuando la persona pide VER una línea o todos los productos con palabra de imagen («muéstreme las bebidas», «foto de todos los productos»), cuando acepta la oferta con la que cerró el turno anterior («¿le muestro las demás bebidas?» → «sí»), o cuando nombra una línea después de que el pie del portafolio preguntó cuál acercar. El pie lleva la lista con precios (el portafolio, solo el conteo por línea). Detección en `FAMILIAS_WA` / `detectarFamilia()` de `wa-productos.ts` — los patrones son **colectivos** (plural, «línea», «todos») para que «las cápsulas» sea la línea y «las cápsulas de ganoderma» el producto. ⚠️ **Imagen ≠ catálogo:** quien dice «catálogo» (o «enlace/página de productos») recibe el **ENLACE con el ref del socio** (`/{slug}/productos`, bloque 2.24 `pideEnlaceCatalogo`, que corre antes) — la imagen es para mirar en el chat, el catálogo es para comprar.

**Scripts:** `actualizar-system-prompt-queswa.mjs` (despliega el prompt a los tres canales: web, WhatsApp y Dashboard) · `desplegar-redaccion-socio.mts` (el esqueleto de redacción al tenant `dashboard`) · `clonar-arsenal-whatsapp.mjs` (ver la advertencia de arriba).


**Key Files**:
- [src/app/api/nexus/route.ts](../../src/app/api/nexus/route.ts) - Motor principal (~7.900 líneas: localice con `grep -n` sobre el identificador, nunca por número de línea)
- [src/app/api/nexus/producer/route.ts](../../src/app/api/nexus/producer/route.ts) - Productor de la cola asíncrona. ⚠️ Hoy **nadie lo llama**: el chat web (`useNEXUSChat.ts`) y el webhook van directo a `/api/nexus`
- [src/app/api/nexus/tts/route.ts](../../src/app/api/nexus/tts/route.ts) - TTS endpoint (ElevenLabs → OpenAI fallback, Edge, 30s)
- [src/app/api/voice-command/route.ts](../../src/app/api/voice-command/route.ts) - Voice pipeline: Whisper → Claude Haiku → ElevenLabs (Node, 60s)
- [src/lib/vectorSearch.ts](../../src/lib/vectorSearch.ts) - Voyage AI embeddings + semantic search (multi-tenant: `tenantId` param)
- [src/components/UnifiedQueswaOrb.tsx](../../src/components/UnifiedQueswaOrb.tsx) - **Orbe unificado** (reemplaza NEXUSFloatingButton + VoiceCommandButton)
- [src/components/nexus/useNEXUSChat.ts](../../src/components/nexus/useNEXUSChat.ts) - React hook for chat state
- [src/components/nexus/NEXUSWidget.tsx](../../src/components/nexus/NEXUSWidget.tsx) - Chat UI container (incluye botón TTS por mensaje)
- [src/components/nexus/NEXUSFloatingButton.tsx](../../src/components/nexus/NEXUSFloatingButton.tsx) - Legacy sin uso (solo lo exporta `nexus/index.ts`); los eventos `open-queswa` los escucha `UnifiedQueswaOrb`
- [src/components/nexus/Chat.tsx](../../src/components/nexus/Chat.tsx) - Chat message rendering
- [src/components/nexus/NEXUSDataCaptureCard.tsx](../../src/components/nexus/NEXUSDataCaptureCard.tsx) - Data capture UI
- [src/components/nexus/useSlidingViewport.ts](../../src/components/nexus/useSlidingViewport.ts) - Mobile viewport handling

**How It Works**:
1. **Fragmented Vector Search** — arsenales fragmentados con embeddings Voyage AI (95% menos tokens de entrada).

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
| `arsenal_ciencia_socio` | **solo `dashboard`** | La evidencia en personas de cada ingrediente (Ganoderma, Cordyceps, espirulina, rooibos, micelio, colágeno) con PMID y calibre, cómo leer un estudio, y qué responder cuando un cliente pregunta por una enfermedad. Para el distribuidor. ⛔ No se clona al canal ni a la web |
| `arsenal_socio` | **solo `dashboard`** | Lo que Queswa le explica al distribuidor sobre cómo trabaja con él. Hoy `WAZE_01`: el modo Waze (de dónde sale · a dónde va · por dónde va). En WhatsApp, al socio identificado se lo dicta el nodo 1.392 leyéndolo del tenant `dashboard`; al prospecto, el 2.235 le da `WHY_APP_01` |

⚠️ **Los tenants `creatuactivo_marketing`, `whatsapp` y `dashboard` deben tener exactamente los mismos fragmentos, con DOS excepciones declaradas:** `arsenal_ciencia_socio` (13 sep 2026, Director) y `arsenal_socio` (6 oct 2026, el modo Waze; `desplegar-arsenal-socio.mjs`) viven **solo en `dashboard`**. La de ciencia trae la evidencia de los ingredientes con su calibre (PMID, n, duración, lo que no cambió) para el distribuidor, y cada respuesta cierra en *lo que sí puede decirle a su cliente*. El Dashboard es privado y no se indexa; el canal y la web conservan sus guardarraíles y **no lo reciben**. Se despliega con `node scripts/desplegar-arsenal-ciencia-socio.mjs` (padre + 9 fragmentos, orden sin ventana; falla si el arsenal aparece en otro tenant). Al comparar conteos de fragmentos (`is_fragment`): `dashboard` = los otros dos **+ 10** (9 de ciencia + `WAZE_01`; el padre no cuenta como fragmento). Todo lo demás termina clonando **a los dos derivados**; si los conteos difieren en otra cosa, algo quedó a medias. ⚠️ El motor del Dashboard (otro repo) clasifica al **bucket** y sirve el **documento padre entero** — por eso el `.txt` va sin `[Concepto Nuclear]` ni notas de edición, y por eso el arsenal tuvo que entrar en `BUCKETS_VECTORIALES` de su `route.ts`; sin eso sus fragmentos existen y nadie los encuentra.


**Historial completo de cambios por arsenal** → [knowledge_base/CHANGELOG-arsenales.md](../../knowledge_base/CHANGELOG-arsenales.md)

2. **Clasificación de documentos — 3 capas + override**:
   - **PASO -2 (CQR — anclaje de la consulta)**: [src/lib/query-rewrite.ts](../../src/lib/query-rewrite.ts) colapsa la conversación en una consulta autónoma **antes** de buscar. Sin ancla temática, un "sí", "panadero" o "y eso cómo sería" recupera ruido y el modelo rellena el vacío con su memoria de entrenamiento (donde "empresa digital" = infoproductos). ⚠️ **Corre bajo `canalDictado` (WhatsApp y la web)** y se salta en precios / query simple / flujo de cierre — ver el bloque `consultaRecuperacion` en `route.ts`. Gate barato `necesitaReescritura()` (≤8 palabras o deíctico) evita pagar la llamada al modelo; **degrada con gracia** — si falla, se busca con el mensaje original
   - **PASO -2 (CQR + aceptación, `canalDictado`)**: antes de buscar, la consulta se ancla. **Una aceptación pelada («sí», «dale») busca con la última pregunta del bot** — determinístico, el CQR no corre. ⛔ **Y una NEGACIÓN pelada («no», «ahora no», «luego») NO busca nada** (12 sep 2026): MFernanda dijo «No» a «¿le gustaría saber cómo pedirlo?» y recibió `WHY_01` con candado, o sea el discurso del negocio a quien acababa de rechazar algo. El CQR **entendió** el rechazo y su salvaguarda descartó la reescritura, así que al buscador le llegó «No» solo — y en ese vacío gana cualquier candado. ⚠️ Anclarlo con la oferta, como se hace con el «sí», sería PEOR: traería el fragmento de lo que la persona acaba de rechazar. Un «no» no pide material nuevo, pide que se le reconozca y se le ofrezca otra cosa. **Un mensaje que ya matchea patrón del clasificador se basta solo** — el CQR tampoco corre (Haiku le inyectaba contexto de la conversación a preguntas autónomas: «hay formación?» terminó en compensación). El CQR queda para lo genuinamente dependiente del hilo. Fuente: [src/lib/query-rewrite.ts](../../src/lib/query-rewrite.ts) + bloque `consultaRecuperacion` en route.ts
   - **PASO -1 (MenuExpansion)**: Opciones a/b/c/d del menú inicial se expanden a queries semánticas
   - **PASO 0 (Patrones — corre PRIMERO)**: `clasificarDocumentoHibrido()`, regex, 0ms, corta el circuito si matchea. ⚠️ El orden de los arrays importa: compensación se evalúa antes que inicial, y un patrón mal ubicado ahí desvía la pregunta más común (así falló «cómo se inicia», 13 ago). Batería de regresión: `node scripts/benchmark-clasificador.mjs --tenant whatsapp` (exit 1 si falla)
   - **PASO 1 (Vector — solo si patrones devuelve null)**: Voyage AI sobre FRAGMENTOS (no docs padre — esos no tienen embedding), threshold 0.4, con alcance por tenant. El arsenal ganador se deriva de la categoría del mejor fragmento
   - **PASO 1.5 (Override crítico)**: Previene falsos positivos vectoriales. Si el vector devuelve `arsenal_compensacion` pero la query es "cómo funciona el negocio" o variante → fuerza `arsenal_inicial`. Está en el array `patrones_inicial` de `clasificarDocumentoHibrido()` (buscar el comentario `FIX 2026-05-19: WHY_02`).
   - ⚠️ **Dos thresholds que no son intercambiables**: 0.40 clasifica el arsenal; 0.30 es el de `searchArsenalFragments` para traer fragmentos. Declarar rota una recuperación de 0.38 midiendo contra 0.40 es un error ya cometido
   - **Candado solitario (14 ago 2026)**: si el fragmento que encabeza la recuperación trae `<verbatim_lock>`, se entrega SOLO — los demás se descartan del contexto. Un casi-empate (Δ0.017) hacía que el modelo mezclara dos fragmentos. ⚡ **Y desde el 9 sep 2026, en el canal (`canalDictado`) ese candado lo EMITE EL BACKEND sin modelo** (`search_method: candado_dictado`, mismo helper que las puertas `dictar`): reproducido dos veces que en hilos largos el modelo lo parafraseaba —Patricia tras tres turnos de salud (3/3), Liliana en el turno 17— mientras en frío salía verbatim. Quedan fuera los candados con marcadores de pin (`[PRECIO]` de FREQ_03) y los turnos de salud compuesta. ⚠️ Consecuencia: lo que diga un candado sale LITERAL siempre — un candado con copy viejo ya no lo «arregla» el modelo (WHY_01 dice *«productos que las personas consumen todos los días»*, el marco retirado)
   - **El ejemplo dictado gana sobre el candado (14 ago 2026)**: cuando `getPinCifrasGEN5` dicta un ejemplo (renta o GEN5), los fragmentos recuperados se retiran del turno — dos dictados a la vez son una contradicción servida, y el prompt ordena que el candado mande. El tipo de ejemplo lo decide **la última pregunta del bot** (la oferta), nunca el cuerpo del mensaje; el default es **renta** (prioridad del ingreso recurrente — decisión del Director)

   **Falso positivo conocido (resuelto Mar 2026)**: `COMP_MODELO_01` tiene "¿Cómo funciona el negocio?" como trigger → el vector lo confundía con WHY_02. El override en PASO 1.5 lo corrige (⚠️ el comentario en `route.ts` conserva el nombre viejo `PASO 0.5` — buscar por `OVERRIDE CRÍTICO`, no por número).

   **Excepción ecommerce (Mar 2026)**: `isSimpleQueryEarly` retorna siempre `false` cuando `tenantId === 'ecommerce'`. En ganocafe.online cualquier query puede ser sobre un producto — no hay queries "simples". Esto garantiza que mensajes de 1–3 palabras ("el té", "cereal", "jabón") igualmente pasen por vector search.

3. **Data Capture** - `captureProspectData()` extracts:
   - Personal info (name, email, phone, occupation)
   - Interest level (0-10 score)
   - Objections (price, time, trust, MLM concerns)
   - Archetype classification

4. **System Prompt** - Stored in Supabase `system_prompts` table (name: `nexus_main`)
   - ⚠️ **Lo desplegado se consulta, no se recuerda:** `node scripts/leer-system-prompt.mjs`. El `VERSION_LABEL` del script es lo que se pretende desplegar; local ≠ DB. Historial y calibraciones → [CHANGELOG-system-prompts.md](../../knowledge_base/CHANGELOG-system-prompts.md). Reglas vigentes: **moneda por país** (Colombia → solo COP · **cualquier otro país → solo USD**, Director 11 oct 2026 · sin país detectado → COP). ⚠️ **Promesa canónica:** *"Queswa explica, atiende y **madura en cada interesado la decisión de avanzar**, las 24 horas"* (objeto = la decisión, NO la persona → activo sin presionar). **Regla del espejo:** "madura la decisión" SOLO en 3ª persona (los prospectos del usuario); en CTA/interpelación al lector NO se usa verbo sobre *su* decisión — ver [[feedback_promesa_canonica_queswa]]. La calidez humana (el equipo recibe de la mano al que ya decidió) conserva "acompaña". **Contexto reels:** el prompt sabe que la mayoría llega tras ver un reel; el saludo post-reel lo acompaña `getReelGreeting()` en [src/lib/queswa-greeting.ts](../../src/lib/queswa-greeting.ts). Historial → [CHANGELOG-system-prompts.md](../../knowledge_base/CHANGELOG-system-prompts.md).
   - ⚠️ **Desde el 4 sep 2026 la fuente es `knowledge_base/system-prompt-queswa.md`, compartida con WhatsApp** (el archivo `system-prompt-nexus-main-v27_2.md` se borró; vive en git). Ver la regla del prompt único y la del **presupuesto de 20.000 caracteres por canal** en Reglas Críticas.
   - Versiones anteriores del archivo eliminadas — viven en git: `git show <hash>:knowledge_base/system-prompt-nexus-main-vXX_Y.md`
   - Cached in-memory for 5 minutes
   - **El fallback hardcodeado de `route.ts` no lleva doctrina** — solo guardarraíles (ver Reglas Críticas). El copy se actualiza en Supabase.
   - **Bifurcación de embudos**: `nexus_main` sirve tráfico orgánico (95%). El 5% de ads tendrá prompt `nexus_ads_premium` cuando se construya `/executive` o `/private`. Pendiente.
   - **MODO ASESORA DE PRODUCTO — el mismo en la web y en WhatsApp** (14 oct 2026, Director): quien llega por la página de productos recibe la asesora del canal (`whatsapp_catalogo`): el producto por lo que ES —qué lleva, cómo se prepara, presentación, precio, registro— y lo sensorial y el ritual; ninguna condición de salud, órgano ni estudio, y el negocio solo si lo preguntan. En la web entra por `pageContext === 'catalogo_productos'` (lo envía `useNEXUSChat` en `/productos`) y comparte las reglas (`reglasAsesoraDeProducto` en `getPageContextInstructions()`); retiró al «MODO ASESOR DE SALUD Y BIENESTAR», que pedía «beneficios para la salud» —lo que el filtro de salud descarta— y dejaba a la persona con el texto de reemplazo. ⚠️ **La foto no apaga el modo:** si sale la imagen y el turno sigue al motor desde el catálogo, el contexto es `whatsapp_foto_enviada_catalogo` (foto ya enviada + las mismas reglas); sin eso, el modelo volvió a componer con el marco del consumo diario. El frontend acompaña con la apertura de productos del canal (`getProductsGreeting`, aprobada el 14 oct 2026) y sus dos botones, CTAs `open-queswa` y tooltip del orbe contextual.
   - **Bug parcialmente resuelto (22 May 2026):** PRECIOS Y CV/PV — `catalogo_productos` v7.2 ya está fragmentado (25 fragments + doc maestro). Las tablas canónicas (PROD_OVERVIEW, BEB_01, LUV_01, SUP_01, PERS_01) ahora tienen `<verbatim_lock>` que erradica alucinaciones de nombres ("Ganotea", "Gano Cocoa", "Gano Supreme") y omisión de la categoría Suplementos. **Bug pendiente parcial**: CV/PV todavía faltantes en respuestas individuales por producto. Ver `docs/handoff/queswa/HANDOFF-QUESWA-PRECIOS-CVPV.md`.
   - **Cotización por país (Fase 2, jun 2026)** — ver memoria [[project_cotizacion_moneda_local]]. **Problema:** Gano Excel tasa el USD a **$4,500 COP FIJO** (no de mercado). Un colombiano leía "ESP-3 = $1,000 USD" → convertía a TRM (~$3,500) → *"me sobrecobran el dólar a 4,500"*; peor, Queswa **derivaba** la pregunta a un humano. **Solución (2 partes):**
     1. **Fragmento `FREQ_27`** en `arsenal_inicial.txt` (desplegado + clonado al tenant `whatsapp`) — responde el reclamo con 3 palancas: no compras dólares sino productos / precio fijo del fabricante para más de 60 países (no margen de CreaTuActivo) / **simetría** (la misma tasa que pagas una vez la cobras en CADA comisión, por encima del mercado). Incluye instrucción "NUNCA derivar a un humano". ⚠️ El slot FREQ_24 ya estaba ocupado (Consumidor VIP, fuera de orden en el .txt) → quedó como **FREQ_27**.
     2. **Detección de país + reorden de precios** en `route.ts`: `detectVisitorCountry()` (web = header `x-vercel-ip-country` de Vercel Edge; whatsapp = prefijo telefónico del `fingerprint`). `getPaquetesPricingPin(country)` + pin de composición ahora **país-aware**. **Regla (Director, 11 oct 2026):** Colombia en COP; **cualquier otro país en USD, sin los pesos al lado** (antes el resto salía «USD (COP)»); sin país detectado, COP. Los precios de PRODUCTO siguen en COP: no hay lista oficial en dólares. El simulador de WhatsApp tiene **gemelo en dólares** (`simulador-de-ingresos-usd.flow.json`, generado desde el de pesos con `generar-flow-simulador-usd.mjs` — nunca se edita a mano; el webhook elige con `flowSimuladorPara`, y sin `WHATSAPP_FLOW_SIMULADOR_USD_ID` cae al de pesos), y `/servilleta` arranca en USD fuera de Colombia (`/api/pais`). ⚠️ **Las cifras en dólares son conversiones del plan colombiano a 4.500**: los datos reales de EE. UU. (precios ESP, CV por caja, sin Kit de Inicio) están en [knowledge_base/paises/USA_2026.md](../../knowledge_base/paises/USA_2026.md), con decisiones pendientes del Director. Comisiones/ingresos → **ambas monedas**. La IP es default, no verdad: para diáspora la moneda la define el **país de registro** (Queswa confirma, no asume — ver memoria `project_diaspora_registro_real` / memoria `project_diaspora_registro_real`).
     - ⏳ **Gap Fase 3:** no hay listas de precios oficiales de Gano por país (MXN, EUR…) ni precios de productos en USD → para no-CO/no-US se cotiza USD como referencia hasta conseguirlas.

**Camino A — Backend Dictador para chip-triggers (May 2026)**:

Los tres botones de la web (WHY_02 **"¿Y esto cómo funciona, exactamente?"** · WHY_04 `MASTER_DINERO_01` **"¿De dónde sale el dinero?"**, este por expresión regular · EAM_01 **"¿Cómo lo haría yo? ¿Qué hago en el día a día?"**) se sirven desde [src/lib/respuestas-maestras.ts](../../src/lib/respuestas-maestras.ts) **antes** del Voyage AI + Anthropic. El bypass en [src/app/api/nexus/route.ts](../../src/app/api/nexus/route.ts) detecta match exacto sobre `trim().toLowerCase()` contra `QUESWA_QUICK_REPLIES` y, si coincide, construye un `ReadableStream` con la respuesta Master y retorna `StreamingTextResponse` directamente. **Tercer bypass (v5.18)**: queries de texto libre tipo *"¿qué es una empresa digital?"* matchean el regex `RE_QUE_ES_EMPRESA_DIGITAL` (corre tras el match exacto de chips) → sirven `MASTER_EMPRESA_DIGITAL` verbatim (sync con EMPRESA_DIGITAL_01 del arsenal).

Beneficios:
- ✓ **100% fidelidad** al copy calibrado (cero paráfrasis del LLM)
- ✓ **$0 tokens** en Anthropic para esas queries
- ✓ **Latencia ~50ms** vs ~2s del flujo completo

Patrón arquitectónico: mismo que `getMicroPromptApertura()` / `getCierreEstado4()` — el backend dicta texto exacto cuando hay un nodo determinístico. No es un workaround; es la separación canónica entre LLM (interpretación) y backend (copy calibrado).

**Fuente dual de verdad — regla inviolable**: Los textos en `src/lib/respuestas-maestras.ts` y los bloques `<verbatim_lock>...</verbatim_lock>` en `knowledge_base/arsenal_inicial.txt` (WHY_02 y EMPRESA_DIGITAL_01 en BLOQUE 1, EAM_01 en BLOQUE 8) se sincronizan con **contrato de PREFIJO** (14 ago 2026): el candado es el texto del TS **menos la pregunta de cierre**, que vive fuera del candado. El arsenal es la doctrina viva; el módulo TS es el caché operativo del backend. Si edita uno, sincronice el otro.

**Camino B (RAG con marcador XML) — fallback para queries naturales**: WHY_01 ("¿Qué es CreaTuActivo?") y queries naturales que coincidan semánticamente con WHY_02/EAM_01 entran por el flujo RAG normal. Las etiquetas XML `<verbatim_lock>...</verbatim_lock>` envuelven el cuerpo de esos fragmentos en el arsenal; la regla `<verbatim_lock>` del system prompt ordena al LLM entregar el contenido exacto entre las etiquetas. Reliability esperada ~95-99% (XML tags activan atención post-entrenada en Claude Sonnet 4.6; investigación Gemini Hipótesis C).

**Histórico de fallos doctrinales (no repetir)**: los dos fallos ya son reglas en [Reglas Críticas](./REGLAS_CRITICAS.md#reglas-críticas-no-hacer) (corchetes planos `[VERBATIM_LOCK]` → parafraseo; extracción de `package` en `extractFromClaudeResponse()` → contaminación de BD). No re-introducir ninguno.

**Warm Handoff con sumario ejecutivo (Opción B · activo)**:

El correo al equipo NO lo dispara `getCierreEstado4()` (eso solo dicta la doble oferta wa.me); lo dispara el callback **`onFinal` del stream** en [route.ts](../../src/app/api/nexus/route.ts), guardado por `closingState === 4 && !_handoffYaEntregado` (solo el primer turno de Estado 4 → sin duplicados). Corre en `onFinal` **tras** entregar el mensaje al prospecto → cero latencia para él, y `onFinal` mantiene viva la función Edge hasta completar el envío (`await` seguro, no fire-and-forget — Edge cortaría un fire-and-forget). Coexisten AMBAS notificaciones: correo al equipo + link wa.me al prospecto.

Cuando entra Estado 4, [src/lib/handoff-sumario.ts](../../src/lib/handoff-sumario.ts) (`ejecutarWarmHandoff`):

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
- **Quick Reply Chips** (solo `creatuactivo.com`, NO en `queswa.app`): 3 chips en estado inicial (antes de que el usuario escriba). Llaman `handleSendMessage()` directamente. Eliminan el "área muerta" móvil y bajan la barrera de articulación. Fuente de verdad: `QUESWA_QUICK_REPLIES` en [src/lib/queswa-greeting.ts](../../src/lib/queswa-greeting.ts): `¿Y esto cómo funciona, exactamente?` · `¿De dónde sale el dinero?` · `¿Cómo lo haría yo? ¿Qué hago en el día a día?`. Los de productos y números se retiraron; su expansión se conserva para quien los escriba. Los tres disparan **Camino A** (bypass backend dictador, [respuestas-maestras.ts](../../src/lib/respuestas-maestras.ts)) → su texto exacto es key; cambiar el texto exige sincronizar la key allí + el mapa `QUESWA_QUICK_REPLIES_EXPANSION`. **Excepción catálogo** (`/productos`): `NEXUSWidget` detecta la ruta y muestra `QUESWA_PRODUCTS_QUICK_REPLIES` (desde el 14 oct 2026 los dos botones de WhatsApp: «Ver el portafolio» → imagen del portafolio · «Lista de precios» → las tablas del catálogo en el chat) en vez de las de negocio, y **oculta el CTA "Suscríbete"** — Queswa es asesor de salud allí (jun 2026). Esos botones NO entran a Camino A: los atienden el conductor (portafolio, 2.25a) y el bypass de precios. ⚠️ «Lista de precios» capturaba «Lista de» como NOMBRE de la persona (patrón «Nombre + precio» con /i); desde el 14 oct `captureProspectData` rechaza capturas que empiezan con pregunta o pedido o terminan en artículo.
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
- Fuente: [src/components/UnifiedQueswaOrb.tsx](../../src/components/UnifiedQueswaOrb.tsx)

**Servilleta + Queswa**: La servilleta usa eventos custom (`open-queswa` / `close-queswa`) para comunicarse con `UnifiedQueswaOrb`. Al abrir Queswa en servilleta, el `body.style.overflow = 'auto'` se restaura temporalmente para que el teclado funcione. El deck-container mantiene `overflow: hidden` independientemente.

**API Endpoints**:
- **Production**: el chat web y el webhook llaman a `/api/nexus` (streaming, Edge)
- **Cron fallback**: `/api/nexus/consumer-cron` (processes queue without triggers)
- **Health checks**: GET request to `/api/nexus`
- **Sin uso hoy**: `/api/nexus/producer` (cola asíncrona — nadie lo llama)

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
| `/api/fundadores` | Node | 10s | Founder registration |
| `/api/cron/process-emails` | Node | 60s | Soap Opera sequence |
| `/api/emails/send-sequence` | Node | 30s | Generic email dispatch |
| `/api/cron/wa-lunes-socio` | Node | 60s | **Mensaje de los lunes a cada distribuidor**, lunes 13:00 UTC = 08:00 Bogotá. Lógica en `src/lib/wa-lunes-socio.ts`: `private_users` activos con WhatsApp y rol constructor, menos las cuentas de sistema. ⭐ **Desde el 5 oct 2026 es el MODO WAZE** (Director): Queswa trabaja con un propósito —el destino del socio—, no con tareas. **Dos plantillas según `socio_referencias`**: `lunes_socio_v8_ruta` a quien anotó las tres (punto de partida, destino y razón con SUS cifras de gasto · [Actualizar destino]) y `lunes_socio_v8` a los demás («¿Ya conoce mi modo Waze?» · [Anotarlo ahora] abre el formulario «Su destino» sin salir de WhatsApp · [Recuérdemelo a las 2], que deja un acuerdo que cumple `/api/cron/wa-acuerdos`). Al guardar el formulario, el nodo 1.391 escribe en la tabla que lee el Dashboard y confirma con un botón que abre queswa.app con la sesión iniciada (`/api/auth/enlace-canal` del Dashboard); si la vida que quiere queda por debajo de lo que necesita hoy, pregunta y reabre el formulario (`cifraDudosa`). ⛔ «Le marco la ruta», nunca «lo llevo»: llevarlo es prometer el resultado. ⛔ El Director descartó en este mensaje ofrecer tareas («¿a quién tiene en mente? Le redacto»): es de propósito. `SEMANA_EN_SALUDO_SOCIO` va en `null`. 🛑 **Una plantilla nueva cada semana** (Director, 20 sep): el texto se aprueba en el chat → se somete con nombre nuevo y se verifica la categoría con `--estado` → al aprobarse se cambian juntos `PLANTILLA_LUNES_SOCIO`/`PLANTILLA_LUNES_RUTA`, los cuerpos y `SEMANA_EN_SALUDO_SOCIO` → la anterior se borra **después** del envío; si la nueva no está aprobada, sale la vigente sin tocar el código. Meta las aprueba MARKETING aunque se sometan UTILITY (~90 pesos, cuenta contra la calificación del número, **no llega a EE. UU.**: a Susana se le manda por correo). 🔴 **La ventana se decide ANTES de enviar** (`src/lib/wa-ventana.ts`): fuera de ella la API acepta el texto libre con 200 + wamid y lo tumba después (131047); dentro, sale el mismo texto con sus botones, sin costo. **Semanal a quien le escribió a Queswa en 30 días, cada 4 semanas al que calla** (`--todos` la salta una vez, como el 5 oct); uno por socio y semana ISO en `wa_lunes_socio_envios` (llave única: una marca de pausa ocupa la semana); horas de silencio 21–07; el envío queda en `nexus_conversations`. `?dry=1` lista sin enviar, `?forzar=1` fuera de lunes. A mano: `npx tsx scripts/enviar-lunes-socio.mts [--todos] [--enviar] [--solo <id> --gancho --plantilla]`. Detalle de la historia en el CLAUDE.md del Dashboard, «Canal de WhatsApp → Mensaje de los lunes» |
| `/api/cron/wa-pendientes-socio` | Node | 60s | **Los pendientes del socio en modo Waze** (6 oct 2026, aprobado por el Director), jueves 14:00 UTC = 09:00 Bogotá, uno por socio y semana. A quien le falte algo en Ajustes de Cuenta —destino, contraseña de Gano, foto o notificaciones (`push_subscriptions.is_active`)—, plantilla `ruta_pendientes_v1` («estoy en modo Waze para usted… me falta {lista}: cada cosa le abre algo» · [Ver qué me abre]); el botón (nodo 1.394) trae solo lo que le falta, cada cosa con lo que le abre, y el botón a sus Ajustes en la sección que toca. Lógica en `src/lib/wa-pendientes-socio.ts`; la marca de la semana va en `nexus_conversations.metadata.nodo`. ⚠️ En iPhone las notificaciones solo se activan desde la app instalada. `?dry=1` lista sin enviar |
| `/api/cron/vigilar-motor` | Node | 60s | **Vigilante de la clave de Anthropic** (18 sep 2026): un token a Haiku cada 15 min; correo a `ALERTA_SISTEMA_EMAIL` (lista por coma; default sistema@ + luiscabrejo7@gmail.com) al caer, al recuperarse y cada 6 h mientras siga caído. Lógica en `src/lib/vigilar-motor.ts` · `?simular=facturacion` · `?sin_correo=1` |
| `/api/constructor/[id]` | Node | 10s | Constructor dashboard |
| `/api/fundadores/pre-registro` | Node | 10s | Pre-registration flow |
| `/api/fundadores/registro-diciembre` | Node | 10s | Legacy December registration |
| `/api/track/video` | Edge | — | ⚠️ Legacy — las páginas `dia-1..5` de la Auditoría que reportaban aquí fueron eliminadas (jul 2026) |
| `/api/track/engagement` | Edge | — | Reel engagement tracker — merge **sin retroceder** (`Math.max` numéricos / OR lógico bools) sobre `device_info` vía `update_prospect_data`; dispara webhook Supabase → push en queswa.app. Campos = contrato cerrado con el Dashboard (ver [Video y Reels](./WEB_Y_OPERACION.md#video-y-reels)) |
| `/api/email-open` | Node | — | Email open pixel tracker |
| `/api/logo-email` | Edge | — | Logo dinámico (Quiet Luxury) renderizado para emails |
| `/api/whatsapp/webhook` | Node | 90s | WABA inbound — adaptador de canal WhatsApp → motor `/api/nexus` (ver [Estado integración WABA](#1-nexus-ai-chatbot)) |
| `/api/test-resend` | Node | — | Dev/debug only (not for production use) |

**Vercel Cron Schedules** (vercel.json):
```
/api/cron/process-emails       → 0 14 * * *   (9:00 Bogotá — secuencia de correos)
/api/cron/wa-acuerdos          → 0 * * * *    (cada hora — Queswa cumple lo que prometió escribir, incluido el «Recuérdemelo a las 2»)
/api/cron/wa-lunes-socio       → 0 13 * * 1   (lunes 8:00 Bogotá — el mensaje de los lunes, modo Waze)
/api/cron/vigilar-motor        → */15 * * * * (clave de Anthropic viva; correo al cambiar de estado)
/api/cron/revisar-turnos       → 0 13 * * *   (8:00 Bogotá — detectores sobre los turnos de 24 h; correo solo si hay algo nuevo)
/api/cron/wa-pendientes-socio  → 0 14 * * 4   (jueves 9:00 Bogotá — los pendientes del socio en modo Waze)
```

**Important**: Cron routes require `CRON_SECRET` env var for authorization.

**`/api/funnel` — `PAGE_VIEW_STEPS`** (eventos de tracking que no requieren email):
`vio_pagina_gracias`, `vio_catalogo`, `vio_calculadora`, `vio_bridge_auditoria`

**Tracking events de video** (páginas `dia-1` a `dia-5`, reportan a `/api/nexus`):
- `video_play_moduloXX` — al iniciar reproducción
- `video_completed_80_moduloXX` — al llegar al 80% del video

### 2. Prospect Tracking

**Location**: [public/tracking.js](../../public/tracking.js)

Browser fingerprinting loaded in [src/app/layout.tsx](../../src/app/layout.tsx). Creates `window.FrameworkIAA` global API.

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

**Location**: [public/sw.js](../../public/sw.js) (la versión vive en `CACHE_VERSION`)

Hybrid caching strategy for Next.js App Router:
- **Network-first**: HTML navigation y payloads RSC (`?_rsc=`) desde la v1.5.0 (24 oct 2026). La copia guardada sirve solo sin conexión, y nunca se guarda una respuesta redirigida. ⛔ No volver a cache-first para páginas: con él, quien ya había visitado una página recibía el HTML del despliegue anterior —apuntando a JS que ya no existía—, la veía como una captura, y Next recargaba todo (caso del catálogo, 24 oct 2026; ver la cabecera de `sw.js`). Ya no hace falta subir `CACHE_VERSION` en cada despliegue de contenido.
- **Cache-first**: static assets (JS, CSS, images), que llevan hash en el nombre
- **Network-first**: Dynamic data, APIs
- **Auto-cache**: el HTML de cada navegación RSC, para abrirla sin conexión
- **Bypass**: `/api/`, `/auth/`, `tracking.js`, external services, `/empresa-digital`, `/negocio-digital` (URLs legacy → Home 301; van siempre a red para que el redirect funcione). ⚠️ `public/sw.js` aún lista `/mapa-de-salida` y `/reto-5-dias` (sus redirects se retiraron jul 2026 → hoy 404; se pueden quitar del bypass)

**Registered in**: [src/app/layout.tsx](../../src/app/layout.tsx) via inline script

**PWA Icons & Manifest** (Dic 2025):
- **Manifest**: [public/site.webmanifest](../../public/site.webmanifest)
- **Theme color**: #D4AF37 (gold - Quiet Luxury)
- **Background**: #0a0a0f (dark)
- **Icons** (generated from [public/favicon.svg](../../public/favicon.svg)):
  - `web-app-manifest-192x192.png` - PWA icon
  - `web-app-manifest-512x512.png` - PWA splash
  - `favicon-96x96.png` - Browser tab
  - `apple-touch-icon.png` - iOS home screen

**Regenerate icons**: `node scripts/generate-favicons.mjs` (requires sharp)

### 3. Async Queue Architecture

**Database trigger architecture** (no external queue service):

```
Producer → nexus_queue (INSERT)   ⚠️ hoy sin tráfico: nada llama al producer
                         ↓ (DB Trigger)
              Edge Function (nexus-queue-processor)
                         ↓
          Claude API + update_prospect_data RPC
```

**Benefits**: $0/month, <2s latency, simple debugging via Supabase Dashboard

**Deployment**: See [DEPLOYMENT_DB_QUEUE.md](../../DEPLOYMENT_DB_QUEUE.md)

**Edge Functions** (in `supabase/functions/`):
- `nexus-queue-processor` - **Primary**: Processes NEXUS messages from DB queue
- `nexus-consumer` - Legacy: Kafka consumer (deprecated, kept for reference)
- `notify-stage-change` - Sends email notifications when prospects advance stages

### 3.1. Multi-Tenant Architecture (FASE C - Mar 2026)

Aislamiento por tenant_id en todas las capas: Middleware (x-tenant-id header) -> vectorSearch (filter_tenant_id) -> system_prompt (get_tenant_system_prompt RPC) -> nexus_queue (metadata.tenant_id).

Tenants activos: creatuactivo_marketing (creatuactivo.com), whatsapp (el WABA), dashboard (queswa.app), marca_personal (luiscabrejo.com), ecommerce (ganocafe.online).

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

- [knowledge_base/arsenal_inicial.txt](../../knowledge_base/arsenal_inicial.txt)
- [knowledge_base/arsenal_avanzado.txt](../../knowledge_base/arsenal_avanzado.txt)- [knowledge_base/arsenal_12_niveles.txt](../../knowledge_base/arsenal_12_niveles.txt)
- [knowledge_base/catalogo_productos.txt](../../knowledge_base/catalogo_productos.txt)
- [knowledge_base/arsenal_compensacion.txt](../../knowledge_base/arsenal_compensacion.txt)
- [knowledge_base/arsenal_marca_personal.txt](../../knowledge_base/arsenal_marca_personal.txt)
- [knowledge_base/arsenal_ganocafe.txt](../../knowledge_base/arsenal_ganocafe.txt)

**Documentación completa**: [knowledge_base/README.md](../../knowledge_base/README.md) · **Historial de cambios**: [knowledge_base/CHANGELOG-arsenales.md](../../knowledge_base/CHANGELOG-arsenales.md)

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
- `ANTHROPIC_API_KEY_PRUEBAS` - **Opcional**. Clave aparte para las peticiones con `x-queswa-origen: prueba` (ver Reglas Críticas). Sin ella, las pruebas gastan de `ANTHROPIC_API_KEY`
- `EQUIPO_DIRECTIVO_EMAIL` - **Opcional** (default hardcoded `sistema@creatuactivo.com`). Destinatario del warm handoff cuando entra Estado 4 del FSM. Sirve para override sin redeploy (ej. testing con otra dirección)

Ver [.env.example](../../.env.example) para la lista completa con instrucciones de configuración.

## Common Development Patterns

### Modifying NEXUS Behavior

**CRITICAL**: Update database, not code.

1. Update `system_prompts` table in Supabase
2. Use helper scripts por dominio:

| Dominio | Prompt name | Script de actualización |
|---------|-------------|------------------------|
| `creatuactivo.com` + WABA + `queswa.app` | `nexus_main` · `queswa_whatsapp` · `queswa_dashboard` | `actualizar-system-prompt-queswa.mjs` — un solo archivo fuente (`system-prompt-queswa.md`), tres filas. Verificar siempre con `leer-system-prompt.mjs` |
| `luiscabrejo.com` | `marca_personal_v1.0` | `actualizar-system-prompt-marca-personal-v1.mjs` |
| `ganocafe.online` | `ganocafe_main` | `actualizar-system-prompt-ganocafe-v1.3.mjs` (latest: **v1.5_ganocafe_alias_coloquiales**) — ⚠️ tiene catálogo de precios hardcodeado: sincronizar con `arsenal_ganocafe.txt` al cambiar precios |

3. Clear cache (restart dev server or wait 5 minutes)

**El fallback** de [src/app/api/nexus/route.ts](../../src/app/api/nexus/route.ts) solo lleva guardarraíles; la doctrina y el copy se actualizan en Supabase.

**Queswa Official Constants** (calibradas Mar 2026 — consistencia obligatoria en todos los arsenales):
- Lanzamiento público: **sin fecha dura** (decisión 31 May 2026). La fase de cimentación está **en curso** (selección de los 15); el despliegue público global llega **una vez consolidada la base fundacional**. La urgencia es la **banda directiva finita** (tiempo del núcleo para los 15), NO un calendario. ❌ No usar "1 de junio" ni ninguna fecha de lanzamiento en arsenales/Queswa.
- Equipo base Fundadores inicial: **15 socios estratégicos / 15 cupos**
- Porcentaje de automatización tecnológica: **90%** (la tecnología hace el 90% del trabajo pesado)
- **Los tres elementos, de cara al prospecto — en TODAS partes** (Director, 18 oct 2026): **un fabricante · una máquina de ventas · una herramienta para multiplicar** (fabricar · vender · multiplicar). El fabricante es Gano Excel (fabrica, almacena y despacha — 30 años, más de 60 países); *máquina de ventas* se paga siempre con su mecanismo en la misma frase (usted envía a quien quiera; quien llega conoce y compra; Queswa atiende); la herramienta le va marcando la ruta, como en Waze. ⛔ «Herramienta», nunca «aplicación»: la aplicación es el envase de los tres. Las acciones del usuario siguen siendo **Compartir y Recibir** (el Método Comprobado, ver arriba). Detalle → [La presentación única](./WEB_Y_OPERACION.md#la-presentación-única--servilleta). Las etiquetas internas —Pilares, Matriz Física, Centro de Mando, Metodología Automatizada— sobreviven en arsenales profundos pero **no se usan con el prospecto**.
- Activo del usuario: **su sistema de distribución** (Director, 6 sep 2026 — antes *canal*) — unidad replicable que se **multiplica** cuando alguien de su sistema abre el suyo. ⚠️ **Un canal se abre; un sistema se construye**, y todo lo que le vendemos es la construcción. Además carga el estatus que *canal* no tiene: la comparación del copy es *el que vende* vs. *el dueño del sistema*
- Rol del usuario: **es el dueño de su canal**, y el rol **no se nombra como cargo** (8 ago 2026). Para hablar del rol **entre nosotros** sirven los verbos *decidir · conectar · ver crecer*; **al prospecto se le entregan siempre las dos acciones — Compartir y Recibir —, y nunca una segunda lista**. Los títulos —Arquitecto de Patrimonio, Propietario de Base Operativa, Director— crean barrera de autoeficacia y evocan hojas de cálculo; la identidad más ligera y más cierta es *dueño*, que además es lo que compró.
- Multiplicación (3er Comando, renombrado desde "Maestría" jun 2026): multiplicar la empresa digital está a un clic en todo el continente — resuelve el cuello de botella de crecer. La Academia/formación es el medio (Queswa forma a cada persona nueva), NO el gancho. Ver [[project_rename_maestria_multiplicacion]]
- Gano Excel presencia global: **más de 60 países** (8 ago 2026 — es lo que publican los sitios oficiales de Gano Excel Colombia y Estados Unidos; la cifra anterior de 70 no la sostiene ninguna fuente, y "más de 100" de la auditoría corporativa se apoya en un aviso de empleo). Defendible ante quien verifique, y solo puede sorprender hacia arriba
- **Respaldo institucional en Colombia** (verificado 8 ago 2026, usado en FREQ_13): la **Ley 1700 de 2013** regula el mercadeo multinivel y **exige oficina abierta al público de manera permanente** — el criterio con el que el legislador separó el comercio del fraude · Gano Excel tiene **nueve sedes** en el país (dos en Bogotá; Medellín, Cali, Pereira, Barranquilla, Bucaramanga, Cúcuta, Villavicencio) · afiliada a **ACOVEDI** · registros **INVIMA** vigentes y certificación **TGA de Australia**
- **Fundadores — no es orden de llegada** (8 ago 2026): es un equipo que se selecciona, con una conversación de por medio. Entran más de 15 para escoger 15. Eso quita la urgencia falsa y eleva el registro sin reclamar nada. ⚠️ La mecánica interna de la selección **no se escribe en los arsenales**
- **Formación** (8 ago 2026 · acotada 25 ago 2026): sección **Maestría** en queswa.app — liderazgo, comunicación, maestría para el éxito y maestría para administrar los recursos, más el detalle de producto y la experiencia de socios que ya recorrieron el camino. ⚠️ **Los espacios SÍ existen y son opcionales — no se nombran por una razón de CANAL, no de verdad** (Director, 25 ago 2026). Gano Excel y su liderazgo desarrollan espacios de bienestar y de liderazgo, la mayoría en línea, sin obligación de asistir. **Queswa vive en WhatsApp y Meta restringe a la industria del mercadeo en red:** nombrar encuentros en línea en un mensaje saliente es el marcador más reconocible de esa industria. Por eso `FREQ_35` responde **«nada obligatorio»**, que es exacto, en vez de describir los espacios. Quien edite esto debe saber que no se está ocultando nada: se está eligiendo qué decir en el canal donde hay restricción.

⛔ **De cara al prospecto NO se nombran *profesionales de la salud* ni *eventos / encuentros en vivo*** (Director, 25 ago 2026): lo primero le presta respaldo médico a un suplemento —la línea exacta que defiende `wa-guardarrail-salud.ts`— y lo segundo es marcador de la industria del multinivel, con restricción de Meta encima. La experiencia de quienes ya recorrieron el camino se nombra **como contenido de Maestría**, no como evento. *Maestría* aquí nombra la sección del producto, no el Comando renombrado
- **Sucesión del código** (8 ago 2026, FREQ_05): con Gano Excel el traspaso ocurre **una vez fallece** el titular y va al cónyuge o a familiares en primer grado; **en vida**, poniendo el código a nombre de una sociedad —en Colombia una SAS— con la titularidad repartida en los estatutos
- **Compra mensual mínima: 50 PV** — en producto, **cuatro cajas** (Director, 3 sep 2026: decir *tres o cuatro* deja creer que con menos alcanza; se dice *cuatro cajas al mes, **o** el equivalente a 50 PV* — cuatro cajas dan 60 PV: son la compra típica y la que Gano aplica por defecto, no una igualdad). ⚠️ **No se cotiza en moneda**: la pone el pin por país. Los ~$100 USD son del **Kit de Inicio**, no de la recompra (esa confusión estuvo desplegada en dos arsenales)
- Sub-perfiles del Constructor: **Perfil-A** (ejecutivo/alto ingreso) · **Perfil-B** (negocio propio) · **Perfil-C** (independiente/freelance) — uso interno únicamente. Las etiquetas "Esposas de Oro", "Trampa Operativa", "Creador de Ingreso Lineal" están **eliminadas** — atacaban la identidad del prospecto. El villano es siempre el Plan por Defecto, nunca la actividad del héroe.

**Audiencia objetivo + reglas lingüísticas** → ver [Léxico y voz](./LEXICO_Y_VOZ.md#léxico-y-voz--lo-que-se-aplica-en-cada-línea-de-copy). Reglas clave:
- Audiencia mixta pan-americana (USA, México, Colombia) — vocabulario respetuoso pero accesible (test "abuela de 75 años"). El target original "CEOs/cirujanos" del Lujo Clínico se amplió en v5.2 (May 2026) tras el insight del Director Cabrejo: "el arquitecto no precipita el cierre, pero cuando llega los procesos son sencillos".
- NUNCA plantar objeciones ("vender", "convencer", "perseguir") donde el héroe no las mencionó.
- Referencias geográficas pan-americanas — no Colombia-only.

### El modelo de la respuesta: Sonnet 4.6, medido contra Sonnet 5.5 (19 oct 2026)

El motor responde con `claude-sonnet-4-6`. El 19 oct 2026, en la auditoría de consumo, se midió `claude-sonnet-5-5` con `prueba-40-preguntas` (tenant whatsapp, local, clave de pruebas, 26 llamadas al modelo por corrida). **Producción no cambió**: la decisión de la voz es del Director.

| | Sonnet 4.6 | Sonnet 5.5 (`between_tools`, esfuerzo `low`) |
|---|---|---|
| Batería | 38/42 | 38/42 |
| Costo por llamada (medido) | $0,0111 | $0,0093 (−16 %) |
| Latencia mediana · p95 | 8,4 s · 16,4 s | 5,3 s · 16,7 s |
| Salida media | 186 tokens · 595 caracteres | 267 tokens · 644 caracteres |

- **El tokenizador nuevo cuenta ~30 % más tokens para el mismo español** (`count_tokens`: el prompt de WhatsApp más un historial pasa de 6.902 a 8.967). Por eso el precio un tercio más bajo de Sonnet 5.5 rinde ~13 % en entrada y salida; la lectura de caché sí baja ~57 % (0,05× la entrada). En el motor, que paga sobre todo entrada sin caché, el neto es −16 %; en el Dashboard, donde el 62 % del costo es lectura de caché, se estima −40 %.
- **Lo que hay que resolver antes de cambiar:** en la #30 («¿El café sirve para adelgazar?») Sonnet 5.5 negó con «no como un producto para bajar de peso», y el guardarraíl de salud de salida se dispara con esas palabras; 4.6 dijo «no está formulado como producto para adelgazar» (y agregó «menos necesidad de picar entre comidas», que también merece revisión). Las #31 (registro sanitario → lista de productos) y #39 (países de Gano → «no lo tengo confirmado») fallan con los dos modelos: son de enrutamiento o de datos, no del modelo.
- **Lo que rompe al cambiar:** Sonnet 5.5 responde 400 a un `temperature` distinto del de fábrica (el motor manda 0,65) y piensa por defecto con el pensamiento contado dentro de `max_tokens` (aquí 600-1.500): se manda `thinking: { type: 'between_tools' }` con `output_config: { effort }` (esfuerzo `high` o menor). El respaldo a Haiku del tercer intento no acepta `between_tools`: lleva sus propios parámetros. El SDK de este repo (0.60) no tipa esos campos.
- **Receta para repetir la medición:** en `callAnthropic` de `route.ts`, el modelo y esos parámetros por variable de entorno; `QUESWA_MODELO_RESPUESTA=claude-sonnet-5-5 npx next dev -p 3055`, luego `npx tsx scripts/prueba-40-preguntas.mjs --base http://localhost:3055 --tenant whatsapp --json salida.json`, y la misma corrida con 4.6. Cuesta ~$1 por corrida, de la clave de pruebas.

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

**Escala**: 0–100. Implementado en `captureProspectData()` dentro de [src/app/api/nexus/route.ts](../../src/app/api/nexus/route.ts). Umbrales: 0–49 frío, 50–74 tibio, 75–89 caliente, 90–100 SQL. Las señales con mayor peso son: multi-threading +15, WhatsApp +8, verbos de compra +8, preguntas sobre inicio +8. Señal más negativa: "no me interesa" -15.

### Updating Queswa Knowledge

**Workflow** (Arquitectura Consolidada v3.0 - Feb 2026):

⚠️ **Un fragmento tiene TRES piezas y cada una va a un solo sitio** (25 ago 2026). `**[Índice]:**` —disparadores más 2-3 líneas con las palabras que usa la persona— es lo **único que se vectoriza**. El **cuerpo** es lo **único que se sirve**. El `**[Concepto Nuclear]:**` se queda en el `.txt`: el fragmentador lo recorta, y por eso puede escribirse en negativo sin costo — el modelo no lo lee. Antes viajaba dentro del fragmento y era el **47% del corpus servido**; el daño no era de recuperación sino de generación (*contextual entrainment*: el modelo sube la probabilidad de cualquier token del prompt, y las instrucciones de ignorarlo apenas lo mitigan — el incidente de `COMP_GEN5_01` no fue mala suerte). Medido sobre el corpus: acierto en el puesto 1 de **24/40 a 34/40**, margen sobre el segundo **×3,6**. ⚠️ **Añadirle el cuerpo al índice empeora** (34 → 29): el índice se indexa solo. Arnés: `node scripts/experimento-indice-recuperacion.mjs`. Al escribir un fragmento nuevo, el índice se redacta con las paráfrasis coloquiales que el disparador no cubre, y se mide antes de dar por bueno. **Migración completa el 25 ago 2026:** los cinco arsenales del tenant principal tienen índice —`arsenal_inicial`, `arsenal_avanzado`, `arsenal_compensacion`, `arsenal_12_niveles` y `catalogo_productos`, 519 fragmentos en los tres tenants—. `arsenal_ganocafe` y `arsenal_marca_personal` viven en tenants propios y no compiten con los demás. ✅ **Completa y verificada el 10 sep 2026**: compensación 40 · catálogo 44 · 12 niveles 16 · avanzado 16, todos con `[Índice]`. Esta sección decía que faltaban tres arsenales y **era un dato viejo** — se comprueba con `grep -c '^\*\*\[Índice\]' knowledge_base/<arsenal>.txt`, no de memoria.

⚠️ **Un corpus no puede estar MEDIO migrado** (25 ago 2026). Los índices producen vectores cortos y concentrados que **ganan casi siempre** contra fragmentos indexados por su cuerpo largo. Al migrar solo `arsenal_inicial`, dos consultas del benchmark se desviaron —una a un fragmento **con candado**, que se sirve solo y descarta al resto—. Comprobado contra el respaldo de embeddings previos: antes acertaban. Se corrigió migrando también `arsenal_avanzado`. ✅ **Los cinco están migrados** (verificado 10 sep 2026): ya nadie compite en desventaja.

⚠️ **El guardarraíl de negocio NO ve dos siluetas** (barrido del 25 ago 2026 sobre los 60 cuerpos): **el resultado personal prometido** —*«esto le resuelve su tema financiero»*, que se sanciona **sin necesidad de cifra ni de fecha**— y **la promesa de esfuerzo mínimo** —*«usted no las arma; las enciende»*—. Vigila conjunciones de dinero con plazo, garantía o personas, y estas no las tienen: **quince casos reales pasaron invisibles**. Se corrigieron a mano (v5.99 a v6.01 del arsenal inicial) y esos quince, con su antes y su después, son el conjunto de prueba para calibrar los patrones nuevos. ⚠️ **No se añaden patrones sin backtest**: *«no depende de su presencia»* es léxico aprobado y caería en cualquier regla ingenua, y bloquear copy bueno también es daño.

⚠️ **El TÍTULO también se vectoriza, y tiene un ÓPTIMO, no una dirección** (26 ago 2026). El texto embebido es `title\n\níndice`. Demasiado largo **diluye**: `INV_00` (254 caracteres) no aparecía ni en el top 6 de su propio disparador, y `EAM_01` 🔒 (145) ganaba su pregunta canónica por 0.002 contra un rival de 65. Demasiado corto **se vuelve atractor**: `OBJ_01` con solo *«No tengo tiempo»* le robaba consultas a WHY_03, EAM_01 y PERFIL_01, y **ninguna de cuatro redacciones del índice lo movió** — el atractor era el título. Acotarlo a *«No tengo tiempo para otro proyecto»* lo arregló; alargarlo más lo desplomaba, porque perdía las suyas. **La palanca es la especificidad, no la longitud.** ⏳ El barrido del corpus sigue pendiente, pero **se mide antes de cortar**: de 41 títulos largos, solo tres fragmentos pierden consultas.

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

⚠️ **Pero entre el paso 3 y el 4 el fragmento NO EXISTE en producción** (13 sep 2026): un Gateway Timeout de Supabase en el paso 4 dejó `WHY_02` ausente en los tres tenants durante dos minutos, y en ese lapso «cómo funciona el negocio» caía a compensación. **El orden sin ventana** es el que se usó para la v6.38 el mismo día: en vez de borrar, **renombrar** la categoría vieja (`update … set category = category || '_old'`, en los tres tenants; el fragmentador solo salta lo que coincide exacto), correr el paso 4, clonar, y **borrar `_old` al final**. Durante el proceso se sirve el fragmento viejo, que es lo correcto; si el paso 4 falla, no hay nada que restaurar. ⚠️ Y **el fragmentador puede crear un DUPLICADO** si su consulta de existencia falla en silencio (13 sep 2026: creó una segunda `COMP_PV_01` en el tenant principal, idéntica a la de la víspera): el paso 6 se lee también por categoría —`select category, tenant_id, count(*) … group by 1,2 having count(*) > 1`— y no solo por total.

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
- `queswa-greeting.ts` - Saludo canónico de Queswa + chips `QUESWA_QUICK_REPLIES` (single source of truth — antes duplicado en 4 lugares). También exporta `QUESWA_PRODUCTS_QUICK_REPLIES` y `getProductsGreeting()` (la apertura de `/productos`, la misma del canal de WhatsApp)
- `reels.ts` - **Fuente de verdad de Reels por Nicho** (`REEL_NICHOS`, `REEL_ASSETS`, `REEL_COPY`). Ver [Video y Reels](./WEB_Y_OPERACION.md#video-y-reels)
- `wa-channel.ts` - **Capa única de canal WhatsApp** (Meta Cloud API): `sendText` (acepta `responderA` para citar) · `sendImage` · `sendTemplate` (con `buttonUrlParam` para el sufijo dinámico del botón de URL — Meta exige que la variable vaya AL FINAL de la URL, de ahí la ruta corta `/e/{token}` del Dashboard) · `sendReplyButtons` · `sendFlow` · `marcarLeidoYEscribiendo` (visto azul + "escribiendo…" en UNA llamada; se cae sola a los 25 s, por eso el webhook la renueva cada 20 mientras el motor trabaja) · `listTemplates` · `getPhoneAsset`. Único lugar con `WHATSAPP_SYSTEM_TOKEN`. (`whatsapp-meta.ts` + `sendpulse.ts` borrados jul 2026)
- `wa-bridge-auth.ts` - Auth del puente `/api/wa/*` que consume el Dashboard server-to-server (header `x-wa-bridge-secret`, `timingSafeEqual`). ⚠️ **Deniega si la env `WA_BRIDGE_SECRET` no está definida** — a diferencia del `x-webhook-secret` de Supabase; un endpoint que envía WhatsApp en nombre de la marca no puede quedar abierto por una env olvidada
- `wa-productos.ts` - **Los 22 productos para el canal**: nombre, presentación, precio, registro INVIMA, imagen y alias tolerantes a typos (`cordigold` encuentra el Cordygold). De aquí salen el envío de fotos, el pie de foto y el **pin de precio** que el motor dicta cuando el mensaje nombra un producto — sin él, el modelo resume el fragmento y deja caer el precio, o inventa el nombre (llamó *«la Intensa»* a la cápsula Fuerte, 20 ago). ⚠️ **La imagen NO lleva precio ni declaración de salud**: el precio cambia y una imagen con precio viejo circulando no se retira nunca; una imagen con promesa deja de ser conversación y pasa a ser publicidad de producto, que se juzga con la vara de la etiqueta. Nombre y marca en la imagen; precio y registro en el pie; explicación en el texto. ⛔ **El registro se cita solo si está confirmado en los datos abiertos del INVIMA** (datos.gov.co, `ui32-p9f2` y `uqkt-7tia`; 25 sep 2026): hasta ese día más de la mitad de los códigos eran de productos de otras empresas (el del Shoko Rico, de unos dulces de San Valentín) y el del 3 en 1 figuraba negado desde 2019 — hoy se vende como alimento (RSA-0011698-2021). `invima` vacío = no se muestra: Clásico, cápsulas de Ganoderma y Excellium (pendientes con Gano Excel) y la máquina (no aplica). Por qué y qué se puede decir de salud → [SALUD_CLAIMS_SINTESIS_SEP2026.md](../../docs/investigaciones/resultados/SALUD_CLAIMS_SINTESIS_SEP2026.md)
- `ciclos-gano.ts` - **El ciclo de pago se calcula, no se recuerda**: ancla (ciclo 924 = 17–23 ago 2026, pagado el 4 de septiembre) + aritmética de semanas en calendario Bogotá. `respuestaCiclo()` la dicta el motor ante cualquier mensaje con «ciclo». Una tabla escrita se congela — COMP_PV_03 imprimía ciclos de enero de 2025 en el chat
- `wa-simulador.ts` - Responde el escenario que la persona armó en el Flow con SU cifra, calculada con las mismas tablas del Flow. El motor dictaba un ejemplo fijo al 17% a quien había elegido 16%
- `wa-pareja.ts` - **La consulta con la pareja** (24 ago 2026): detector de «lo consulto con mi esposa», el **enlace para la pareja** (wa.me a Queswa con texto pre-llenado: slug del socio + «soy la pareja de {nombre}» — la misma pieza del enlace del socio, sin infraestructura nueva) que **se ofrece primero y se genera solo si la persona acepta** (Director, 24 ago), el turno dictado con **cierre por opciones** («¿mañana, o en dos días?» — abierto, el 100 % responde «yo le aviso»), la apertura para cuando la pareja llega (la estándar con sus botones y una línea de reconocimiento; nunca una pregunta abierta a quien apenas ve la información) y el aviso al socio con el plazo. **Cableado en el webhook** (24 ago): nodo 2.23, antes de todos los demás y del motor, y la llegada de la pareja antes de la apertura (1.5b). El nodo de ambivalencia (2.8) también detecta este caso, pero 2.23 corre primero y su detector cubre todo lo que cubre el de 2.8, así que `microPromptPareja()` —que promete un enlace que no existe— no debería alcanzarse; si alguna vez se ve en el log `whatsapp_amb_pareja`, es que una frase se escapó y hay que sumarla a `detectarConsultaConPareja`
- `queswa-conductor.ts` - **El conductor compartido** (4 sep 2026): los nodos dictados iguales en WhatsApp y en la web — enlace al catálogo, el hilo de Los 12 Niveles con sus «sí», el simulador, el seguimiento de salud. Decide y dicta; cada canal entrega (`banderasDelHilo`, `atenderEnlaceCatalogo`, `atenderHiloNiveles`, `textoDeCandado`, `textoBonoPaquetes`, `slugDelSocio`, `textoSimuladorWeb`). Sin `sendText` ni `StreamingTextResponse` adentro, a propósito. ⛔ **En la web el conductor lee el arsenal con la llave de SERVIDOR** (`getSupabaseAdmin`): con la pública, `textoDeCandado` devuelve vacío sin error, y hasta el 8 oct 2026 el 2.34 (Los 12 Niveles) no se disparó nunca en la web
- `queswa-videos.ts` + `queswa-videos-web.ts` - **Los cuatro videos de Queswa en la web** (8 oct 2026, Director): «Cómo funciona», «Cómo entra el dinero», «Qué debo hacer yo» y «Los 12 Niveles» se responden con video, como en WhatsApp y el Dashboard. El motor responde entrada + marcador `[[video:id]]` + pregunta de pie (el patrón del Dashboard); `NEXUSWidget` pinta el reproductor (`VideoQueswa.tsx`). La fila guarda lo que dice la voz —la forma de WhatsApp— y el historial que vuelve del chat se expande con esa voz al entrar al motor (`expandirVideosDelHistorial`): sin eso el modelo no sabría qué vio la persona. Entra por cuatro puertas: los botones (Camino A), el texto libre por significado (`videoQuePide`, después de la radicación), la estrategia con palabras propias y el candado dictado. No en `/productos`. «¿Qué estrategia tienen?» la atiende el 2.34 del conductor (`pideLaEstrategia`), igual en WhatsApp y en la web desde el 8 oct 2026. Arnés: `npx tsx scripts/prueba-videos-web.mts [--motor http://localhost:3000]`
- `wa-radicacion.ts` - **Cierre de WhatsApp y de la web** — nodo determinístico que pide los **cuatro datos** (nombre completo · cédula · ciudad · paquete — **con cuál de las cuatro formas empieza**, el Kit incluido desde el 6 oct 2026) en **un solo mensaje** y radica contra `POST {DASHBOARD_URL}/api/pre-afiliacion` (auth `x-wa-bridge-secret`; escribe en `pending_activations` y dispara plantilla `pre_afiliacion_nueva` al socio + al equipo). Se invoca desde el webhook **antes** de llamar al motor. Extracción con Haiku (nunca lanza; ante fallo vuelve a pedir). ⚠️ **El bloque de los cuatro datos vive SOLO en el backend** (9 sep 2026). Hasta entonces el prompt llevaba una copia como red de respaldo y el modelo la copió a alguien que solo quería ver números (Patricia); al turno siguiente el nodo, leyendo ese texto como propio, le pidió el nombre a «armeme el guión». Hoy: (a) el modelo no pide datos — si reconoce una volición que `RE_VOLICION` no vio, cierra con la frase puente `OFERTA_RADICAR_MODELO` («Cuando quiera, le tomo los datos de la vinculación.»), idéntica en el prompt y en el código, y el «sí» de la persona abre el trámite; (b) el webhook persiste sus pedidos con `metadata.nodo = 'radicacion'` y `gestionarCierre` solo reabre el trámite con un pedido de esa lista (`pedidosDelBackend`); la web, sin metadata, cae al regex. Arnés: `npx tsx scripts/prueba-radicacion-y-persona.mts`
- `wa-destino-socio.ts` - **El destino del socio — el modo Waze** (5 oct 2026): leer, guardar y confirmar `socio_referencias` desde el formulario de WhatsApp (`destino_socio_v2`), el enlace con sesión a sus Ajustes (`enlaceAjustes` → `/api/auth/enlace-canal` del Dashboard, con la llave del puente), y la explicación del modo Waze al socio (`atenderModoWazeSocio`, nodo 1.392). Son cifras de GASTO que él escribe, nunca lo que el negocio le pagará
- `wa-pendientes-socio.ts` - **Los pendientes del socio** (6 oct 2026): qué le falta en Ajustes de Cuenta y qué le abre cada cosa; el envío de los jueves y el botón [Ver qué me abre] (nodo 1.394)
- `wa-guardarrail-salud.ts` - **Filtro de salud del canal** (v2, 17 ago 2026): Capa 0 de emergencia → línea 123 · derivación de entrada · validación de salida que **descarta y reemplaza el borrador, nunca lo corrige ni reintenta**. ⚠️ Calibrado sobre la línea roja **verificada** (INVIMA/SIC · Meta · FDA/FTC): bloquea enfermedad, adelgazamiento —el disparador nº1 de sanción de la SIC—, ciencia citada, mecanismo y clases farmacológicas; y, desde el **22 ago 2026, la declaración de órgano** (circulación, riñones, pulmones, cerebro, función sexual): INVIMA solo la aprueba como *"contribuye al funcionamiento **normal** de X"*, y su catálogo cubre nutrientes —no menciona Ganoderma ni una vez—. **Deja pasar** energía, vitalidad, antioxidante, adaptógeno y *"apoya el sistema inmune"*, que el propio fabricante usa y ninguna sanción del período castigó, y **las articulaciones**, porque el colágeno sí tiene declaración aprobada (Acta 10 de 2017). Investigación → `docs/investigaciones/resultados/CRUCE_INVESTIGACIONES_VOCABULARIO_AGO2026.md` y `INVIMA_PROCLAMAS_APROBADAS_SEPFSD.md` (163 declaraciones oficiales, descifradas de un PDF ilegible)
- `wa-guardarrail-negocio.ts` - **Filtro de promesa de ingreso** (17 ago 2026). ⚠️ **Los patrones exigen CONJUNCIÓN, no palabras sueltas** —dinero+tiempo, dinero+garantía, comisión+personas— porque varias tienen uso legítimo: la durabilidad es cierta en FREQ_05 donde el activo se hereda, las cifras del plan son correctas cuando las dicta un pin, y *"cada viernes"* es un hecho. Backtest sobre 400 respuestas reales: habría bloqueado 33
- `wa-onboarding.ts` - ⛔ **Lo que es del Centro de Mando se pide en el Centro de Mando** (Director, 16 sep 2026): Queswa en WhatsApp atiende a los PROSPECTOS del socio; Queswa en queswa.app atiende al DISTRIBUIDOR (conoce sus metas, aprende cómo escribe, entra a su back office). **El mensaje para un NEGOCIO o una EMPRESA, cargar compras y ver su lista no se hacen en el canal**: el nodo 2.22 del webhook (`detectarPideFuncionDashboard` → `invitacionAlDashboard`, copy aprobado) lo invita como algo que tiene por ser socio, y el «sí» le manda el acceso por `POST queswa.app/api/auth/magic-link` (plantilla `acceso_centro_mando_v2`, UTILITY). ⚠️ **El mensaje para una PERSONA sí se redacta en el canal** (Director, tras probarlo: «para mí eso es genial»): el esqueleto sigue en el MODO SOCIO del motor y el saludo del socio sigue ofreciéndolo; una relación personal delante del destinatario (*mi amigo, mi hermana, un conocido*) lo vuelve persona aunque tenga negocio. El mensaje de los lunes se queda igual. Motivo: Patricia, 15 sep, 20 turnos pidiendo un correo para restaurantes que el canal no tenía cómo escribir bien. Arnés: sección 9 de `prueba-experiencia-socio.mts`. ⚠️ **El socio que solo agradece** recibe «Con gusto, {nombre}.» y nada más (nodo 1.393, `esSoloAgradecimiento`, 6 oct 2026: Maryi pidió que le recordaran a las 2, dijo «Gracias» y recibió dos ofertas de tarea), y a quien tiene un recordatorio pendiente el saludo no le ofrece tareas (`saludoDeSocio(…, { sinOferta })`). **Onboarding del socio nuevo por WhatsApp**: comando `ACTIVAR`, enlace de canal, avisos de actividad, y **`identificarSocio()` + `saludoDeSocio()`** — el canal atiende a socios y prospectos por el mismo número, y hasta el 17 ago 2026 no los distinguía: el socio recibía la apertura de prospecto y Queswa se presentaba ante él como *"la asistente de [él mismo]"*. La detección es **determinística** (su teléfono contra `constructor_slugs` y, de respaldo, `private_users`, comparando **normalizado en ambos lados** — están guardados con `+`, con espacios y con cero inicial, así que `.eq()` contra la columna cruda no encuentra a nadie). ⚠️ **El slug se asigna por defecto** (Director, 10 sep 2026): un socio de `private_users` sin fila en `constructor_slugs` la recibe al vuelo (`asignarSlugPorDefecto`; backfill con `npx tsx scripts/asignar-slugs-por-defecto.mts --dry`). Hasta ese día «sin slug no era socio» y **8 de 18 socios activos no lo tenían**: Patricia Reyes (socia desde julio) y Liliana Moreno (desde noviembre) recibieron el discurso de prospecto, y a Patricia le pidieron la cédula para vincularla. ⛔ **Y el prospecto que pasa a distribuidor queda CONFIGURADO como distribuidor** (Director, 10 sep 2026): `convertirProspectoEnSocio()` pone `prospects.user_id`, `stage = 'maestria'` y `device_info.es_socio`, y **retira la temperatura de prospecto** (`momento_optimo`, `interest_level`, `hilo_12_niveles`) — así el Dashboard deja de tratarlo como venta pendiente (`toCanonicalStage`: user_id no nulo → maestria). Desde ahí el trato se abre **únicamente** como socio: el hilo se corta en `socio_desde` (el modelo no vuelve a ver los turnos en que se le vendió lo que ya tiene) y el saludo se da **una sola vez**, marcado con `saludo_socio_en`. ⚠️ **La puerta del saludo NO es «no tiene ficha»** — ese era el bug: Patricia tenía ficha desde el 2 sep, así que el saludo con su enlace no le salía nunca. Backfill: `npx tsx scripts/convertir-prospectos-en-socios.mts --dry`. Arnés: `npx tsx scripts/prueba-experiencia-socio.mts` Activa el `pageContext` **`whatsapp_socio`** → **MODO SOCIO** en `getPageContextInstructions()` del motor: se le habla como colega, no se le vuelve a vender lo que ya compró, y se le responde el plan completo porque lo necesita para atender a los suyos. ⚠️ `constructor_id` **NO es un UUID** sino la llave de texto que comparte con el Dashboard; y el enlace es **`/{slug}/queswa`**, nunca `/{slug}` —esa página no existe y da 404— porque además valida el slug antes de redirigir. Ver el handoff del 17 ago. ⚠️ **Dos casos del 12 sep 2026 que el teléfono NO resuelve:** (a) **quien escribe con nombre de usuario de WhatsApp no trae teléfono** —Meta lo esconde tras un BSUID—, así que Victor Armando Rojas, aprobado a las 18:35, recibió a las 19:05 la apertura de prospecto. Salida: el **vínculo por token** — ⚠️ **el botón «Hablar con Queswa por WhatsApp» ya NO está en queswa.app**: el Director lo retiró el 13 sep 2026 (el socio habla con Queswa dentro de la app; WhatsApp es la vía de sus prospectos). Hoy el atado es a mano con `vincular-huella-a-socio.mts`, y quien dice ser socio desde un número no registrado recibe el nodo 2.51e (invitación a queswa.app + push al equipo). El mecanismo de firma sigue en pie (`/api/constructor/vinculo-queswa`: HMAC del `constructor_id` con `WA_BRIDGE_SECRET`, espejo de `tokenDeVinculoSocio`), el webhook verifica la firma en el bloque 1.385 y ata la huella a su cuenta; desde ahí `identificarSocio` la reconoce por la ficha (`es_socio` + `socio_constructor_id`). A mano: `npx tsx scripts/vincular-huella-a-socio.mts <fingerprint> <constructor_id> [--nombre "…"]`. (b) **El socio que toca un enlace de canal** —el suyo o el de otro socio— recibe `mensajeSocioEnlace` (bloque 1.48) y nada más: Miguel Barahona tocó el suyo y, como la apertura lo excluía y el modo socio no sabía qué hacer con ese mensaje, el modelo le vendió el negocio once turnos con un método inventado («1. Usted consume, 2. Usted comparte»). Por lo mismo **el hilo de 12 Niveles y la tarjeta del simulador están cerrados al socio**, y la conversión retira también `package`, `archetype` y `objections`, que el motor ya no le captura
- `query-rewrite.ts` - **CQR (reescritura conversacional de la consulta)** — colapsa el hilo en una consulta autónoma antes del vector search. Ver [PASO -2](#1-nexus-ai-chatbot). Activo bajo **`canalDictado`** (WhatsApp y la web); nunca lanza (ante fallo devuelve el mensaje original)
- `tts-normalize.ts` - `normalizarParaVoz()` — convierte símbolos y abreviaturas a palabras antes del TTS (sin esto el motor lee "$200 USD" como "dollar sign 200 U-S-D"). **Fuente única** compartida por `/api/voice-command` y `/api/nexus/tts`

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
| `/api/claude-chat` (repo **luiscabrejo.com**, no este) | ✅ Eliminado (6 oct 2026) | Era un endpoint público sin autenticación que escribía PII en Supabase y nadie montaba. Borrado con `NexusChat.tsx`, `useNexusChat.ts` y su entrada en `vercel.json`; `/api/nexus` con tenant `marca_personal` es la única ruta de chat de ese sitio |
| `/api/nexus/producer` + `consumer-cron` | Sin tráfico | El chat web y el webhook llaman a `/api/nexus` directo; la cola no la alimenta nadie |
| `/api/nexus/consumer-cron` | Legacy | Fallback sin triggers — el flujo activo es DB trigger → `nexus-queue-processor` |
| `nexus-consumer` (Edge Function) | Deprecated | Consumer Kafka — reemplazado por `nexus-queue-processor` |
| `src/lib/sendpulse.ts` + `whatsapp-meta.ts` | ✅ Eliminados (jul 2026) | Reemplazados por `wa-channel.ts` (capa única de canal Meta Cloud API) |
| RPC `match_documents` + columna `embedding` (1536) | Muerto — camino TS retirado 7 ago 2026 | El RPC compara contra `embedding` (512 rellenado a 1536) y las funciones que lo llamaban mandaban el vector sin rellenar: fallaban siempre. La búsqueda viva es **en memoria** sobre `embedding_512` (`getArsenalFragments` → `searchSimilarDocuments`). La función SQL y la columna siguen en la BD; el Dashboard conserva la misma copia muerta |
| `src/components/nexus/NEXUSFloatingButton.tsx` | Sin uso | Reemplazado por `UnifiedQueswaOrb`, que también escucha `open-queswa`; solo lo exporta `nexus/index.ts` |
| `/reto-5-dias/*` · `/mapa-de-salida/*` · `/auditoria-confirmada` · `/empresa-digital/*` · `/diagnostico` · `/confirmacion` | ✅ Eliminadas (jul 2026, `ca6ff59`) | Funnel muerto retirado — páginas + redirects borrados; URLs viejas del funnel → Home (301) |
| `/api/fundadores/registro-diciembre` | Legacy | Registro Diciembre — reemplazado por flujo Founder actual |
| `/api/test-resend`, `/api/test-reto-email` | Dev only | No para producción |
| `scripts/actualizar-system-prompt-whatsapp-v1.mjs` | Legacy — **borrable** | Quedó huérfano con el prompt único (4 sep 2026): hoy los dos canales se despliegan con `actualizar-system-prompt-queswa.mjs`. ⚠️ Esta fila decía que el vigente era `...-whatsapp-v4.mjs`, **que no existe** — auditado 6 sep 2026 |
| `*.tsx.bak` | Respaldos inactivos | Nunca editar |
