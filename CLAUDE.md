# CLAUDE.md

Guía para Claude Code en este repositorio: **creatuactivo.com** y el motor de **Queswa**, el agente que atiende a los prospectos en la web y en WhatsApp (en la interfaz es Queswa; el código conserva el prefijo `NEXUS`, sin refactor previsto). Next.js 14 (App Router) · TypeScript · Tailwind · Supabase · Anthropic · Voyage · Resend. Diseño «Quiet Luxury» bimetálico v3.0.

> ⚖️ **ORDEN DE DECISIÓN DEL PROYECTO (Director, 8-9 oct 2026), para TODO trabajo:** (1) lo que conduzca al **éxito del proyecto** → (2) los **resultados de las investigaciones** → (3) el **análisis del agente** → (4) las **sugerencias de Luis Cabrejo**. Su sugerencia va de última a propósito: se evalúa contra las tres anteriores y se le responde con disensión razonada cuando hay base documentada — no se ejecuta tal cual. Él tiene la última palabra, y cuando su contexto de campo es el que decide (12 años de conversaciones reales), su criterio gana.

> 🧭 **SI ES NUEVO, LEA PRIMERO (en este orden):** (1) [Reglas críticas](#reglas-críticas) — lo que rompe producción · (2) [Léxico y voz](#léxico-y-voz) — cómo se escribe aquí (⚠️ **la migración a léxico accesible ya está en código; nunca «corrija» copy accesible hacia el término viejo**) · (3) [HANDOFF_CONTEXTO_COMPLETO.md](HANDOFF_CONTEXTO_COMPLETO.md) — contexto de negocio.

> 📚 **Este archivo es un ÍNDICE de reglas, no la referencia** (18 oct 2026). Se carga en cada sesión, y cada línea le compite atención a las demás: la misma razón por la que el prompt de Queswa tiene presupuesto. Llegó a pesar 268 KB; el texto completo —con el porqué, las fechas y los casos— se movió **sin recortar** a [docs/claude/](docs/claude/). **Para agregar aquí: una o dos líneas y el puntero al documento largo.** La historia («el 12 sep pasó…») va al documento largo, al CHANGELOG o al handoff, nunca aquí. **Presupuesto: 60 KB** (`wc -c CLAUDE.md`). Si una regla cambia, se corrige aquí y en su documento largo.

## Dónde vive cada cosa

| Busca | Está en |
|---|---|
| Todos los comandos y scripts, con sus advertencias completas | [docs/claude/COMANDOS.md](docs/claude/COMANDOS.md) |
| Cada regla crítica con su porqué y su caso | [docs/claude/REGLAS_CRITICAS.md](docs/claude/REGLAS_CRITICAS.md) |
| Queswa por dentro: motor, clasificación, Camino A, FSM, WABA, fotos, librerías, tablas, arsenales y su receta de despliegue | [docs/claude/QUESWA.md](docs/claude/QUESWA.md) |
| Páginas y funnel, `/servilleta`, reels, performance, git, despliegue, diseño, índice de documentos | [docs/claude/WEB_Y_OPERACION.md](docs/claude/WEB_Y_OPERACION.md) |
| Léxico y voz completo: cada regla de escritura y cada prohibición con su razón | [docs/claude/LEXICO_Y_VOZ.md](docs/claude/LEXICO_Y_VOZ.md) · tablas en [BRANDING.md §7](BRANDING.md) |
| Design system completo | [BRANDING.md](BRANDING.md) |
| La presentación | [docs/SERVILLETA.md](docs/SERVILLETA.md) |
| Post-producción de reels (leer **antes** de ensamblar) | [scripts/dankoe-video/PIPELINE.md](scripts/dankoe-video/PIPELINE.md) |
| Estado de la cuenta de Meta y del WABA | [docs/handoff/queswa/WABA_REFERENCIA.md](docs/handoff/queswa/WABA_REFERENCIA.md) |
| Estrategia de contenido, voz e historia del fundador | [ESTRATEGIA_CONTENIDO_Y_VOZ.md](docs/handoff/negocio/ESTRATEGIA_CONTENIDO_Y_VOZ.md) · [EPIPHANY_BRIDGE_OFICIAL.md](EPIPHANY_BRIDGE_OFICIAL.md) |
| Cómo se construye una frase que fluye | [NARRATIVA_Y_FLUIDEZ.md](docs/handoff/negocio/NARRATIVA_Y_FLUIDEZ.md) |
| Historial | [CHANGELOG-arsenales.md](knowledge_base/CHANGELOG-arsenales.md) · [CHANGELOG-system-prompts.md](knowledge_base/CHANGELOG-system-prompts.md) |
| Índice general de documentos | [docs/README.md](docs/README.md) |

⚠️ **Lo desplegado se consulta, no se recuerda.** Aquí no se escriben versiones ni conteos, porque envejecen en días. El prompt vivo, con `node scripts/leer-system-prompt.mjs`; los fragmentos, con `node scripts/sql.mjs -e "select tenant_id, count(*) from nexus_documents where (metadata->>'is_fragment')::boolean is true group by 1"`; la versión de cada arsenal, en la cabecera de su `.txt`. Y si el impulso de cambiar algo viene de un ejemplo escrito aquí o en un handoff, verifique la decisión en el código.

## Comandos de cada día

Lista completa, con sus advertencias → [COMANDOS.md](docs/claude/COMANDOS.md). No hay framework de pruebas: son scripts, y casi todos terminan en exit 1 si fallan.

| Tarea | Comando | Lo que hay que saber |
|---|---|---|
| Desarrollo | `npm run dev` · `npm run build` · `npm run lint` | El build **ignora los errores de TypeScript** (`ignoreBuildErrors`): compila aunque algo esté roto |
| SQL contra Supabase | `node scripts/sql.mjs -e "select …"` | Ejecuta lo que se le pase, incluido `DROP` |
| Leer el prompt desplegado | `node scripts/leer-system-prompt.mjs` | Local ≠ base |
| Desplegar el prompt de Queswa (web, WhatsApp y Dashboard) | `node scripts/actualizar-system-prompt-queswa.mjs` · `--dry` · `--solo web\|whatsapp\|dashboard` · `--ver <canal>` | `--dry` imprime el tamaño por canal (techo 20.000). ⚠️ **Importar el script lo EJECUTA**: para medir un borrador, copie `renderizarCanal` a otro script. El Dashboard se verifica con la RPC `get_tenant_system_prompt('dashboard')`, no con el ✅ |
| Las tres baterías del canal (antes de desplegar copy) | `node scripts/test-guardarrail-salud.mjs` · `node scripts/test-guardarrail-negocio.mjs` · `node scripts/benchmark-clasificador.mjs --tenant whatsapp` | Verifican las dos direcciones: que bloqueen lo grave y que no toquen el copy aprobado |
| ¿Las puertas aguantan un dedo torpe? | `npx tsx scripts/prueba-typos.mts` | Línea base: falla solo si empeora; el `tope` se baja al arreglar, nunca se sube |
| Ensayar una conversación por el webhook sin enviar nada | `NEXT_PUBLIC_SITE_URL=http://localhost:3055 WA_DRY_RUN=1 npx next dev -p 3055` y luego `npx tsx scripts/repetir-por-webhook.mts --log <log>` | En una **copia** del proyecto si ya hay un `next dev` aquí. Es la única prueba que ve webhook, conductor y motor juntos |
| Auditar el tráfico real | `node scripts/auditar-conversaciones.mjs --dias 10` | Un «sí» con `fragment_vector_search` es un nodo que no disparó |
| Medir la recuperación de un fragmento | `node scripts/medir-recuperacion-voyage.mjs "<consulta>"` | Con paráfrasis coloquiales, nunca con el disparador literal (es circular) |
| Auditar frases vetadas | `node scripts/auditar-frases-vetadas.mjs --detalle` | Estado sano: 0 cabeceras |
| Gasto en Anthropic | `node scripts/consumo-anthropic.mjs [--dias 7]` | Separa personas de pruebas; el Dashboard entra desde el 19 oct 2026. No ve los scripts que llaman a Anthropic directo |
| ¿La clave de Anthropic sigue viva? | `npx tsx scripts/probar-vigilante-motor.mts` | `GET /api/nexus` dice «healthy» sin tocar la clave: no sirve para esto |
| Categoría real de las plantillas del WABA | `node scripts/auditar-plantillas-whatsapp.mjs` | Meta recategoriza por su cuenta y no avisa |
| Aperturas del enlace de Queswa, por dispositivo | `node scripts/medir-aperturas-enlace.mjs [--dias 7]` | Cruza `page_visits` con los primeros mensajes |
| Desplegar un fragmento del arsenal | La receta → [QUESWA.md](docs/claude/QUESWA.md#updating-queswa-knowledge) | Sin purgar no pasa nada; sin clonar a **los dos** tenants derivados, WhatsApp y el Dashboard quedan viejos |
| Lo que vive solo en el Dashboard | `npx tsx scripts/desplegar-redaccion-socio.mts` · `node scripts/desplegar-arsenal-ciencia-socio.mjs` · `node scripts/desplegar-arsenal-socio.mjs` | El esqueleto de redacción, cada vez que se toque `wa-redaccion-socio.ts` |
| Prompts de los otros sitios | `node scripts/actualizar-system-prompt-marca-personal-v1.mjs` · `node scripts/actualizar-system-prompt-ganocafe-v1.3.mjs` | ganocafe trae precios en el prompt: sincronizar con `arsenal_ganocafe.txt` |
| Edge function de la cola | `npx supabase functions deploy nexus-queue-processor` | |

Arneses por tema —catálogo, pago, avisos al socio, gestos, experiencia del socio, radicación, videos, salud, 40 preguntas, productos, conversación larga— → [COMANDOS.md](docs/claude/COMANDOS.md). ⚠️ **Las pruebas que llaman al motor no ven el webhook** (salud de entrada, botones, Flow), y **todo script que llame al motor manda la cabecera `x-queswa-origen: prueba`**.

## Reglas críticas

Una línea por regla; el porqué y el caso de cada una → [REGLAS_CRITICAS.md](docs/claude/REGLAS_CRITICAS.md), y las del canal y el arsenal también en [QUESWA.md](docs/claude/QUESWA.md).

### El prompt y el motor

- ⛔ **Un solo prompt para la web, WhatsApp y el Dashboard**: `knowledge_base/system-prompt-queswa.md`, con lo propio de cada canal entre `<!-- canal:… -->`. Nunca edite una fila de `system_prompts` a mano ni cree un prompt por canal. La web es el respaldo del canal si Meta lo cierra, y un respaldo que responde distinto no es respaldo.
- ⛔ **Presupuesto: menos de 20.000 caracteres por canal desplegado**, medido con `--dry`, no con el `.md`. El 18 oct 2026 (v5.19) la web quedó a **501** del techo: una regla nueva se paga quitando otra. Lo que no cabe va por una de cuatro puertas: el porqué al CHANGELOG, un hecho al arsenal o a un pin, la doctrina de un hilo a una instrucción de sesión, un texto exacto al backend.
- ⛔ **Un nodo nuevo que aplique a los dos canales se escribe en el conductor** ([queswa-conductor.ts](src/lib/queswa-conductor.ts)), no en el webhook: el conductor decide y dicta sin saber por dónde entrega. En `route.ts` las puertas leen `canalDictado` (`whatsapp` + `creatuactivo_marketing`), no el tenant.
- ⛔ **La conversación la decide el modelo; los datos, el código.** La bitácora le pasa hechos al modelo, la envoltura saca un candado literal con apertura y cierre del modelo, y el supervisor antes de enviar está **APAGADO** (empeoraba más de lo que arreglaba). Ninguna de las tres piezas se desmonta sin leer su cabecera.
- ⛔ **`nexus_conversations` y el arsenal se leen con la llave de SERVIDOR** (`getSupabaseAdmin`). Con la anon, la seguridad de filas devuelve cero filas **sin error**: así estuvieron muertos el historial del motor y el nodo 2.34 de la web. Los respaldos que traían el documento padre se retiraron y no se reviven.
- ❌ **Ningún texto de flujo ni respuesta verbatim en el system prompt**: el backend es el dictador. Lo que debe salir exacto va en los micro-prompts de `route.ts`, en [respuestas-maestras.ts](src/lib/respuestas-maestras.ts) o en un fragmento con candado.
- ⛔ **Si el nodo es determinístico, lo emite el backend**, sin llamar al modelo («casi siempre» no es un dictado). Y **el modelo no escribe una cifra que el backend conoce**: el fragmento pone el argumento y el pin pone la cifra.
- ⛔ **Una pregunta de precio no recibe cifras de comisión** (`preguntaSoloPorPrecio`). Dos excepciones del Director que no se «corrigen»: `textoBonoPaquetes` (nodo 2.355) y `textoCubrirCompra` (2.50).
- ⛔ **Una puerta no depende de que el enrutamiento acierte**: `PUERTAS_INICIAL` corre sobre cualquier arsenal y sobre el mensaje crudo, y el CQR no reescribe un mensaje que ya matchea un patrón ni uno que nombra un producto. Una negación pelada («no», «ahora no») no busca nada.
- ❌ **No diagnostique como copy lo que es enrutamiento**: primero `metadata.documents_used` o `search_method` en `nexus_conversations`, después el texto. Cuando un pin no dispara, el modelo compone, y al componer vuelven las frases vetadas.
- ❌ **Ningún regex de cara a la persona exige ortografía perfecta**: `(?![a-záéíóúñ])` en vez de `\b` después de una tilde, y toda puerta nueva entra a `prueba-typos.mts`.
- ⛔ **No despliegue copy nuevo del canal sin correr las tres baterías** (salud, negocio y clasificador): bloquear una respuesta buena también le cuesta una venta al socio.
- ⚠️ **El fallback `getFallbackSystemPrompt()` lleva guardarraíles, nunca doctrina**, y se cachea 5 minutos.
- ⚠️ **Los guardarraíles de salud y negocio corren en el webhook y, para la web, en el motor** (`canalDictado`). El widget de ganocafe.online (`ecommerce`) sigue sin filtro.
- ⚠️ **En este motor la FSM de cierre (estados 2/3/4 y el correo de handoff) solo corre fuera de `canalDictado`**: la web y WhatsApp cierran por [wa-radicacion.ts](src/lib/wa-radicacion.ts). Donde sigue viva vale: validar el nombre antes del Estado 4, sincronizar los regex si cambia `getCierreEstado4()` y no volver a extraer `package` de las respuestas del modelo.
- ❌ **No se re-implementa el prompt caching**: ya está (`grep -n cache_control`); el hit rate se mide con `consumo-anthropic.mjs`.
- ⛔ **Todo script que llame al motor manda `x-queswa-origen: prueba`**; si existe `ANTHROPIC_API_KEY_PRUEBAS`, gasta de esa clave. Cuatro de cada cinco llamadas eran pruebas, y salían de la clave que atiende a la gente.
- ⛔ **Toda prueba lleva presupuesto**: antes de correr dice cuánto va a costar, empieza con 3 muestras por variante, llama a Anthropic con `ANTHROPIC_API_KEY_PRUEBAS || ANTHROPIC_API_KEY`, y lo que no espera respuesta va por la Batch API (la mitad). Del 13 al 19 oct 2026 las pruebas triplicaron la factura (~1.250 llamadas), casi todas desde scripts desechables con la clave principal, que comparten marketing, el Dashboard y luiscabrejo.com.
- ⚠️ **No cite números de línea de `route.ts`** (~7.900 líneas): `grep -n` sobre el identificador.

### El arsenal

- ⚠️ **Un fragmento tiene tres piezas**: el `[Índice]` es lo único que se vectoriza (`title\n\níndice`), el cuerpo es lo único que se sirve, y el `[Concepto Nuclear]` se queda en el `.txt` (el fragmentador lo recorta). La doctrina nunca va en el índice.
- ❌ **No nombre la frase que quiere evitar**, ni en el índice ni en el cuerpo: escribirla la dicta (*contextual entrainment*). En el `[Concepto Nuclear]` sí puede ir en negativo.
- ⚠️ **Índice y título se miden antes de darlos por buenos**: con paráfrasis coloquiales, nunca con el disparador literal, y con los fragmentos que podrían perder en la comparación. Alargar diluye, y lo corto y genérico se vuelve atractor: la palanca es la especificidad. Para abrir una puerta nueva sirve un fragmento **corto**, no más disparadores en uno largo.
- ⚠️ **Si un fragmento es el destino de una oferta escrita, esa oferta va literal y aparte en su índice**: en WhatsApp, una aceptación pelada busca con la última pregunta del bot.
- ❌ **No cierre con una pregunta que el arsenal no pueda atender**: verifique que exista el fragmento destino. Y **una sola pregunta, una sola salida** (nunca «¿A o B?»), que proponga un paso en vez de encuestar.
- ⛔ **Los arsenales viven en TRES tenants** (`creatuactivo_marketing`, `whatsapp`, `dashboard`) con los mismos fragmentos, salvo `arsenal_ciencia_socio` y `arsenal_socio`, que viven solo en `dashboard`. Receta: subir el padre → purgar (o renombrar a `_old`, que no deja ventana) → fragmentar → clonar a los dos derivados → contar **por categoría** (el fragmentador salta en silencio y puede duplicar). `clonar-arsenal-whatsapp.mjs` no actualiza lo que ya existe.
- ❌ **[respuestas-maestras.ts](src/lib/respuestas-maestras.ts) y los `<verbatim_lock>` del arsenal se sincronizan con contrato de PREFIJO** (el candado es el texto del TS menos la pregunta de cierre). Los candados van en XML, nunca en corchetes, y no se quitan de PROD_OVERVIEW, BEB_01, LUV_01, SUP_01 ni PERS_01.
- ⚠️ **En el canal, un candado lo emite el backend sin modelo** (`candado_dictado`): lo que diga un candado sale literal siempre, así que uno con copy viejo ya no lo «arregla» el modelo.
- ❌ **No narre en la cabecera del arsenal lo que se retiró**: es lo primero que lee el próximo agente, y de ahí saca vocabulario que cree vigente. El historial va al CHANGELOG.
- ⛔ **Al prospecto no se le sirve una tabla escrita para el socio** (`COMP_PV_06`, con PV/CV y códigos): su lista de precios son las cuatro tablas del catálogo.

### El canal de WhatsApp

- ⛔ **[wa-channel.ts](src/lib/wa-channel.ts) es lo único que habla con graph.facebook.com** y conoce `WHATSAPP_SYSTEM_TOKEN`. El Dashboard opera el canal por el puente `/api/wa/*`, que **deniega** si falta `WA_BRIDGE_SECRET`. La lógica de IA vive en el motor; el webhook adapta y entrega.
- ⛔ **Quien escribe con nombre de usuario va en `recipient`, nunca en `to`**: un BSUID en `to` responde 200 y Meta lo descarta después (#131026), en silencio. Se diagnostica con `select * from wa_envios_fallidos`.
- ⚠️ **El webhook responde a Meta antes de trabajar** (`waitUntil`, `maxDuration = 90`); `wa_mensajes_procesados` guarda contra reenvíos y falla hacia procesar.
- ⚠️ **Ventana de 24 h**: fuera de ella, solo plantilla aprobada, y la ventana se decide ANTES de enviar ([wa-ventana.ts](src/lib/wa-ventana.ts)): fuera, la API acepta el texto con 200 y lo tumba después (131047).
- ⚠️ **El motor no sabe lo que manda el webhook**: la foto la envía el webhook, y si el borrador del modelo niega poder enviar imágenes, el webhook lo descarta y manda la imagen.
- ⚠️ **Al socio se le atiende solo como socio**: se le reconoce por su teléfono normalizado (o por su ficha, si escribe con nombre de usuario), antes que al primer contacto y antes del guardarraíl de salud. Si pregunta por salud, recibe la línea, no la derivación. Lo que es del Centro de Mando —el mensaje para un negocio, cargar compras, su lista— se le invita a hacerlo en queswa.app.
- ⛔ **Meta clasifica una plantilla por lo que ENTREGA**: no someta otra variante del enlace de canal, porque no hay redacción que la saque de MARKETING. Una plantilla que cambia lleva nombre nuevo, y a números +1 Meta no entrega MARKETING.
- ⛔ **No toque el nombre visible ni corra `request_code`/`verify_code`** sobre el número que funciona: `name_status: NON_EXISTS` no es un rechazo.
- ⚠️ **Flows**: descripciones de `NavigationList` de máximo 20 caracteres (el validador no lo revisa; el teléfono sí), sin condiciones sobre dos campos, máximo 10 ramas, ids sin dígitos; actualizar lo devuelve a DRAFT. **Un formulario ya abierto queda guardado en el teléfono**: contenido nuevo es id nuevo.
- ⚠️ **Tres números**: `+57 321 519 3909` es el WABA · `+57 320 341 5438`, el personal de Luis · `+57 320 680 5737`, su WhatsApp Business.
- ⚠️ **El cierre no cobra peaje**: los datos de la radicación nunca condicionan una respuesta.
- ⚠️ **Fotos de producto**: la foto real, nunca generada por IA; 1080×1080; sin precio ni declaración de salud en la imagen. Imagen ≠ catálogo: quien dice «catálogo» recibe el enlace con el ref del socio.
- ⚠️ **Antes de bloquear un número**, compruebe que no sea socio ni prospecto real; Meta solo deja bloquear a quien escribió en las últimas 24 h.

### Cumplimiento

Meta sanciona estas cosas en el canal, y en Colombia el Estatuto del Consumidor las vuelve exigibles a la empresa.

- ❌ **Nada de promesa de ingreso**: ni pago fechado, ni garantía, ni sustitución del salario, ni duración (*de por vida*, *vitalicia*). La recompensa se nombra por su **repetición**: el cliente que nota la diferencia vuelve a comprar. La durabilidad solo vive en `FREQ_05`, donde el activo se hereda.
- ⚠️ **La aspiración comparativa no es promesa y está ratificada** (*«con el potencial de igualar o superar sus ingresos actuales»*): no se «corrige».
- ❌ **Salud**: nada de enfermedad, adelgazamiento, ciencia citada, mecanismo ni declaraciones de órgano. Sí pasan energía, vitalidad, antioxidante, «apoya el sistema inmune» y las articulaciones (el colágeno tiene declaración aprobada). El producto se vende por lo sensorial y el ritual. El registro INVIMA se cita solo si está confirmado en los datos abiertos. De cara al prospecto no se nombran *profesionales de la salud* ni *eventos o encuentros en vivo*.
- ❌ **El GEN5 se cuenta en COMPRAS de paquetes, nunca en personas**, y ningún bono se nombra por su velocidad o su duración: el GEN5 lo mueve la compra de paquetes y el Binario, el consumo recurrente.

### Código, git y web

- ⛔ **No comitee un archivo que depende de otro modificado que no es suyo**: van juntos o no va ninguno. Si arma un blob sobre HEAD, re-verifique HEAD antes del `update-index` y el `--stat` antes de comitear (un blob vacío ya dejó este archivo en cero).
- ⛔ **Nunca corra `vercel` ni `vercel link` en esta carpeta**: crea un proyecto `marketing` duplicado (pasó dos veces). El que sirve el sitio es `creatuactivo-com`, y despliega por GitHub.
- ❌ **Ni `.env.local` ni secretos en git; nada de PII en localStorage** (solo huella e ids de sesión), y nada de capturas con datos de personas o tokens en `public/`: lo que está ahí se publica.
- ❌ **Un solo `<h1>` por página, vía [IndustrialHeader](src/components/IndustrialHeader.tsx)**; los títulos visuales adicionales van en `<h2>`.
- ❌ **Solo las fuentes cargadas** (Playfair Display, Inter, Roboto Mono). Nada de `clip-path` biselado, de `backdropFilter: blur()` en las cards de la Home ni de `priority` en imágenes decorativas del hero.
- ❌ **El consentimiento vive solo en [CookieBanner.tsx](src/components/CookieBanner.tsx)**, y los `*.tsx.bak` no se editan.
- ⚠️ **`queswa.app` es otro repositorio** (`/Users/luiscabrejo/Cta/Dashboard`), igual que luiscabrejo.com: su código no está aquí.
- ⚠️ **En localhost no se crean fichas ni avisos, a propósito**: el sitio local usa la base de producción. Para probar el seguimiento: `PERMITIR_TRACKING_LOCAL=1` en el servidor y `localStorage.setItem('tracking_local','1')` en el navegador.
- ⚠️ **El middleware que cuenta es `src/middleware.ts`**; el de la raíz nunca corrió y no se mueve (rompería el tenant de WhatsApp).

## Arquitectura en una página

Detalle completo → [QUESWA.md](docs/claude/QUESWA.md).

**Ecosistema** (todos comparten el mismo Supabase):

| Sitio | Tenant | Prompt | Nota |
|---|---|---|---|
| creatuactivo.com | `creatuactivo_marketing` | `nexus_main` | La web; respaldo del canal |
| WhatsApp (WABA) | `whatsapp` | `queswa_whatsapp` | Webhook `/api/whatsapp/webhook` → motor |
| queswa.app (otro repo) | `dashboard` | `queswa_dashboard` | El Dashboard del socio; le suma sus bloques en `buildSystemBlocks()` |
| luiscabrejo.com (otro repo) | `marca_personal` | `marca_personal_v1.0` | Tiene su propio `/api/nexus` |
| ganocafe.online | `ecommerce` | `ganocafe_main` | Widget que llama a este `/api/nexus` con `x-tenant-id: ecommerce` |

Los tres primeros prompts salen del mismo archivo.

**El motor**: [src/app/api/nexus/route.ts](src/app/api/nexus/route.ts) (Edge, `maxDuration = 60`, streaming). El chat web ([useNEXUSChat.ts](src/components/nexus/useNEXUSChat.ts)) y el webhook lo llaman directo; `/api/nexus/producer` y la cola existen, pero nadie los alimenta. En cada turno:

1. **Camino A**: los botones de la web y algunas preguntas libres salen verbatim de [respuestas-maestras.ts](src/lib/respuestas-maestras.ts), o como video ([queswa-videos-web.ts](src/lib/queswa-videos-web.ts)), sin llamar al modelo.
2. **Conductor** ([queswa-conductor.ts](src/lib/queswa-conductor.ts)): los nodos dictados que son iguales en los dos canales.
3. **CQR** ([query-rewrite.ts](src/lib/query-rewrite.ts), bajo `canalDictado`): ancla la consulta al hilo; una aceptación pelada busca con la última pregunta del bot.
4. **Clasificación**: patrones primero (`clasificarDocumentoHibrido()`; el orden de los arrays importa), luego Voyage sobre fragmentos (umbral 0.40 para elegir el arsenal, 0.30 para traer fragmentos) y después el override crítico. Un candado que encabeza la recuperación se entrega solo.
5. **Pines** de precio, producto, ciclo y cifras; **bitácora** y **envoltura**; Sonnet con prompt caching en tres bloques.
6. **Guardarraíles de salida** y captura de datos (`captureProspectData()` → RPC `update_prospect_data`).

**El canal**: el [webhook](src/app/api/whatsapp/webhook/route.ts) (Node, 90 s) entrega botones, el Flow del simulador, fotos, la radicación y los avisos al socio. Su lógica vive en `src/lib/wa-*.ts`.

**Arsenales** (en `knowledge_base/`, fragmentados con Voyage): `arsenal_inicial` · `arsenal_avanzado` · `arsenal_compensacion` (cifras del plan intocables) · `arsenal_12_niveles` · `catalogo_productos` (22 productos, cada uno con su respuesta) · `arsenal_marca_personal` · `arsenal_ganocafe`; solo en `dashboard`, `arsenal_ciencia_socio` y `arsenal_socio`. Cinco fragmentos son doble fuente con [respuestas-maestras.ts](src/lib/respuestas-maestras.ts): WHY_02 · WHY_04 · EAM_01 · EMPRESA_DIGITAL_01 · INVERSION_MARKETING_01.

**Seguimiento**: [public/tracking.js](public/tracking.js) calcula la huella del navegador y deja la cookie de un año `nexus_prospect_id`, que es la llave (la huella se repite entre teléfonos iguales) → RPC `identify_prospect`. Las aperturas de enlaces quedan en `page_visits`. El service worker es [public/sw.js](public/sw.js).

**Tablas clave**: `prospects` · `prospect_data` · `nexus_documents` · `nexus_conversations` · `system_prompts` · `constructor_slugs` · `private_users` (de aquí se lee el WhatsApp del socio) · `pending_activations` · `page_visits` · `wa_mensajes_procesados` · `wa_envios_fallidos`. Todas con RLS.

**Crons** (`vercel.json`, exigen `CRON_SECRET`; hora de Bogotá): secuencia de correos 9:00 · acuerdos cada hora · el mensaje de los lunes al socio (modo Waze) lunes 8:00 · vigilante del motor cada 15 min · revisión de turnos 8:00 · pendientes del socio jueves 9:00.

**Alias**: `@/` → `src/`.

## La web y el funnel

Detalle → [WEB_Y_OPERACION.md](docs/claude/WEB_Y_OPERACION.md).

- **Funnel vigente**: un reel o el enlace del socio (`/{slug}/{destino}`) → Queswa conversa y madura la decisión → 1-a-1 con el socio → `/paquetes`. El funnel de reto, mapa y diagnóstico se eliminó, y sus URLs redirigen a la Home.
- **Menú**: Presentación (`/servilleta`) · Productos · Tecnología · Nosotros, más «Suscríbete». Los rótulos no coinciden con las rutas a propósito: nombran lo que el visitante encuentra.
- ⚠️ **Un destino corto que no esté en `DESTINO_MAP`** ([src/app/[slug]/[destino]/page.tsx](src/app/[slug]/[destino]/page.tsx)) cae a la Home sin 404. Al añadir un enlace en el Dashboard, agregue aquí su destino.
- ⚠️ **Cada página destino declara su propio `openGraph.url`**: si no, al compartirla enlaza a la raíz.
- ⭐ **Computador → chat web; celular y tableta → WhatsApp, sin código en el mensaje** (Director, 23 oct 2026). En el celular el enlace no redirige: sirve un puente con un solo botón, «Abrir Queswa en WhatsApp» ([AbrirQueswaEnWhatsApp.tsx](src/components/AbrirQueswaEnWhatsApp.tsx), 24 oct): de un navegador solo se sale a otra app con un toque, y la redirección a wa.me dejaba a la persona en la página de api.whatsapp.com con el cuadro de Chrome encima. Del 20 al 23 oct todo fue al chat web, y el enlace del socio desde el celular convirtió peor que en WhatsApp (17 % contra 41 %): el sospechoso era el código `c:…` del mensaje, que sigue fuera (también el `w:` del orbe). En el catálogo, chat web en todos. La regla vive en [src/lib/dispositivo.ts](src/lib/dispositivo.ts). Medición: sin código, la tabla por dispositivo de `medir-aperturas-enlace.mjs` no puede atar WhatsApp a un navegador; se compara con la primera tabla (aperturas contra «escribieron»), el 30 oct.
- ⭐ **`/servilleta` es la presentación única** (nueve pantallas desde el 18 oct 2026), y todo apunta ahí, incluido el simulador (`?pantalla=8`). Debajo va la guía SEO con el único `<h1>`, y la página no baja hasta la última pantalla. ⛔ **Un asset que cambia lleva nombre nuevo**: el service worker lo sirve cache-first. Fuente → [docs/SERVILLETA.md](docs/SERVILLETA.md).
- **El catálogo** (`/productos/{slug}`) es una tienda para el cliente del socio: el pedido sale por WhatsApp o se paga a Gano Excel. Sus advertencias → [COMANDOS.md](docs/claude/COMANDOS.md#quick-reference).
- ⭐ **Las promociones de Gano** (22 oct 2026; la primera, 80094 «PROMOCIÓN DE PRODUCTOS», $587.000, 83 PV) viven en [src/lib/promociones-gano.ts](src/lib/promociones-gano.ts), espejo del registro del Dashboard: lo que traen sale de la imagen de Gano, porque su catálogo no lo dice. Desde ahí entran al catálogo (línea «Promoción», visible solo mientras Gano la tenga, `/api/promociones-gano`), al pedido por WhatsApp (`PRODUCTOS_WA`, alias «promoción»/«promo»/«80094», nunca por parecido: «proporción» queda a dos letras) y al motor (bloque `promociones_gano_vigentes`, solo cuando se habla de promociones). ⛔ **Una por pedido** (`LimitQuota` del act12): no se ofrece repartirla en varios pedidos, porque no está comprobado si el tope es por cuenta. ⛔ **Los PV de la promoción los fija Gano** (83): el modelo los sumaba producto por producto (108) y le decía al socio que pasaba los 100. Una promoción nueva se registra en los dos repos.
- ⭐ **El service worker va a la red primero para las páginas** (v1.5.0, 24 oct 2026) y guarda la copia solo para abrir sin conexión; cache-first sigue solo para los estáticos con hash. Con cache-first en páginas, el visitante recurrente veía la versión anterior como una captura y Next recargaba todo. Porqué → [QUESWA.md](docs/claude/QUESWA.md#21-pwa--service-worker). En el catálogo, el socio se resuelve una vez por petición (`cache()` de React) y en dos idas a la base.
- **Performance que no se revierte**: Home `force-static`; el LCP es el H1 de texto; turbina `lazy`; `DeferredOrb` difiere Framer Motion; `hormigon-tile.webp`; Cache-Control `s-maxage=86400`.
- **Reels por nicho** ([src/lib/reels.ts](src/lib/reels.ts)): los campos de engagement son un contrato cerrado con el Dashboard y no se renombran; máximo ~6 escrituras por sesión, porque cada una es un push al socio.
- **Reels del reto de los 90 días**: la rejilla, los guiones aprobados y el montaje → [WEB_Y_OPERACION.md](docs/claude/WEB_Y_OPERACION.md#video-y-reels). Tres tipos de guion que no se mezclan (documentación, nicho y sitio, este en voz neutra). ⛔ Lo que el Director marca como contexto nunca entra al guion, y un guion emitido no se edita: se sucede.

## Diseño

Guía completa → [BRANDING.md](BRANDING.md). «Quiet Luxury meets Private Equity»: el sitio debe parecer una firma de inversión, no un MLM típico. El dorado, máximo 10-20 % del lienzo.

| Rol | Token | Hex | Uso |
|---|---|---|---|
| **Oro (el premio)** | `--color-brand` | `#C5A059` | CTAs, dinero, logros, títulos clave (hover `#D4AF37`) |
| **Titanio (la estructura)** | `--color-titanium` | `#94A3B8` | Iconos activos, navegación (hover → oro) |
| **Cian (el dato)** | `--color-data` | `#22D3EE` | Labels técnicos en mono, líneas REF, Queswa en línea. ~5 %. Nunca en CTAs, títulos ni dinero |
| **Fondo** | `--color-bg-primary` | `#0F1115` | Carbón; alterna con `#15171C` elevado |
| **Texto** | `--color-text-primary` | `#E5E5E5` | Cuerpo; `#FFFFFF` solo en titulares |
| Estado | | `#10B981` / `#FBBF24` / `#F43F5E` | Éxito / pendiente / alerta |

- Los iconos arrancan en titanio y pasan a oro en hover; solo CTAs, cifras y logros nacen dorados (`ICON_COLORS` en [src/lib/branding.ts](src/lib/branding.ts)).
- Borde de card: glass neutro `rgba(255,255,255,0.1)`; el dorado, solo en hover.
- Nunca un hex escrito a mano: tokens. CTAs con `.cta-primary` / `.cta-secondary` / `.cta-ghost`; nunca fondo sólido con texto invertido en un primario.
- H1/H2: Inter en mayúsculas para lo institucional, Playfair para lo editorial; los eyebrows van en `<p>`.
- Implementación de referencia: [src/app/page.tsx](src/app/page.tsx) (la Home).

## Git y despliegue

- **Antes de trabajar, `git status`**: este repositorio ya perdió su `.git` una vez. La receta para recuperarlo → [WEB_Y_OPERACION.md](docs/claude/WEB_Y_OPERACION.md#critical-git-workflow).
- Commits convencionales (`feat` · `fix` · `style` · `content` · `refactor` · `docs`), `git add` de archivos específicos y `git push origin main` en primer plano (en segundo plano no accede al llavero).
- Vercel despliega `main` en el proyecto `creatuactivo-com`. Un `engines` en `package.json` pisa en silencio la versión de Node del panel.
- 🔴 **El DNS de creatuactivo.com apunta a `A 76.76.21.21` a propósito** (7 oct 2026: la red nueva de Vercel perdía paquetes desde Claro en Bogotá). Antes de «arreglarlo», lea [WEB_Y_OPERACION.md](docs/claude/WEB_Y_OPERACION.md#vercel-nextjs).
- Variables: copie `.env.example` a `.env.local`. Solo en Vercel: `CRON_SECRET`, `ANTHROPIC_API_KEY_PRUEBAS` (opcional) y `EQUIPO_DIRECTIVO_EMAIL` (opcional).

## Constantes del negocio

Detalle → [QUESWA.md](docs/claude/QUESWA.md#modifying-nexus-behavior).

- ⭐ **Los tres elementos, en TODAS partes** (18 oct 2026): **un fabricante · una máquina de ventas · una herramienta para multiplicar**. *Máquina de ventas* va siempre con su mecanismo en la misma frase (usted envía a quien quiera; ahí conoce y compra; Queswa atiende). «Herramienta», nunca «aplicación»: la aplicación es el envase de los tres.
- **Las acciones del usuario son dos: Compartir y Recibir** (el Método Comprobado). La multiplicación es la consecuencia, nunca un tercer paso. Entre las dos acciones se dice quién hace el trabajo: Queswa conversa y madura la decisión; Gano Excel fabrica y despacha. Entre nosotros, el rol se piensa con *decidir · conectar · ver crecer*, pero al prospecto nunca se le entrega otra lista.
- **El usuario es el dueño**, y el rol no se nombra como cargo. Su activo es **su sistema de distribución**.
- **Gano Excel**: más de 60 países y 30 años; en Colombia, Ley 1700 de 2013, nueve sedes, ACOVEDI e INVIMA. CreaTuActivo opera en 16 países.
- **Compra mensual mínima**: cuatro cajas, o el equivalente a 50 PV. No se cotiza en moneda: la pone el pin.
- **Cuatro formas de empezar**: el ESP-3 Visionario primero, como anclaje, y el Kit de Inicio al final, sin porcentaje.
- **Moneda**: en Colombia, solo pesos (Gano tasa el dólar fijo a $4.500); en cualquier otro país, solo dólares. Los pesos llevan punto de miles (`$110.900 COP`) y los dólares, coma (`$1,000 USD`).
- **Pago**: el ciclo va de lunes a domingo y se paga el segundo viernes después de su cierre; se calcula con [ciclos-gano.ts](src/lib/ciclos-gano.ts), no se recuerda.
- **Fundadores**: un núcleo de 15, seleccionados (no por orden de llegada) y sin fecha de lanzamiento. El 150 era el de la página `/fundadores`, ya eliminada.
- **La promesa de Queswa**: *explica, atiende y madura en cada interesado la decisión de avanzar*. «Madura la decisión», solo en tercera persona.

## Léxico y voz

El texto completo, con la razón de cada regla → [LEXICO_Y_VOZ.md](docs/claude/LEXICO_Y_VOZ.md); las tablas, en [BRANDING.md §7](BRANDING.md). **La fuente viva del copy es `knowledge_base/arsenal_inicial.txt`**: léala antes de escribir. ⏳ **Las prohibiciones caducan**: antes de invocar una, verifique que siga teniendo sentido en el léxico vigente.

**Regla de oro**: el test de la abuela de 75 años. Audiencia panamericana, y siempre **usted**.

**El vocabulario**

- ⭐ **El activo se llama «sistema de distribución», siempre.** Hay dos sinónimos vivos que no se corrigen: *empresa de distribución* y *maquinaria de distribución*. El vocabulario se duplica como en una franquicia, y un término doble se degrada tres eslabones más abajo. *Activo* es lo que el sistema PRODUCE, dicho junto a su causa, y nunca adjetivo de una persona (en esta industria significa estar al día con la compra). ⚠️ No se migran el *canal izquierdo/derecho* del binario ni los *canales oficiales* de pago.
- ⭐ **En frío, «una empresa de distribución moderna»**, con las cuatro palabras juntas; *moderna* una vez por conversación y pagada con un hecho que se vea. El diferencial es la propiedad: cada cliente que llega por su enlace queda a su nombre. Por eso, cada vez que vuelve a comprar, a usted le queda un porcentaje. Gano Excel se nombra al final, como quien fabrica y paga. El dropshipping, solo en forma de contraste.
- **Quienes componen el sistema** son clientes, socios y distribuidores; nunca «personas» que hay que conseguir. Una palabra no es el problema; lo es el verbo que se le cuelga: un sistema no consume, no compra y no pide.
- **Se cambia**: `filtrar` → conversar, madurar la decisión · `equipo directivo` → equipo de creatuactivo.com · `Maestría` (el Comando) → Multiplicación · `operar` → trabajar, funcionar · `pasivo` → recurrente · `entrar` (comprar el paquete) → comprar, iniciar, vincularse · `velocidades` → formas de ganar (doce, sin numerar) · «esto»/«eso» para nombrarnos → lo que es, por su nombre · *escalar* va solo junto a *multiplicar*.
- **Se elimina**: oportunidad de negocio · libertad financiera · ingreso pasivo · reclutamiento · sé tu propio jefe · perseguir · convencer · *directamente proporcional* · *soberanía financiera* (salvo el lema de Luis) · *Propietario* y *Arquitecto de Patrimonio* como cargo · el marco del consumo diario (los productos son premium, y la recompra se explica por su resultado).
- **La nomenclatura del plan va literal** (*Binario 17 %*, *Bono GEN5*, *GCV*, *PV/CV*): la accesibilidad manda en el marco, y la precisión en la cifra y su nombre.

**Cómo se escribe**

- **Dado primero, nuevo al final**; y **primero se suelta el peso, después se reparte el trabajo** → [NARRATIVA_Y_FLUIDEZ.md](docs/handoff/negocio/NARRATIVA_Y_FLUIDEZ.md).
- **El villano se narra, nunca se etiqueta**, con las tres piezas de `STORY_03` 🔒: al día siguiente de que le entra la plata, ese dinero ya tiene dueño; es un ciclo de trabajar, pagar cuentas y repetir; y *«le pasa exactamente igual al que gana dos millones y al que gana más de veinte»*. Nunca para abrir una conversación.
- **Se nombra el mecanismo, nunca el resultado.** Lo que antes era complejo hoy es sencillo: la dificultad, en una frase y sin el inventario de la faena.
- **El estigma es de popularidad, no de fraude.** Las credenciales son estatus, no alegato; nunca se nombra el fantasma para negarlo; se compara hacia arriba (el que vende contra el dueño del sistema). Si preguntan la empresa, se dice sin rodeos.
- **Se concede la razón bajo la premisa del otro y después se retira la premisa**; nunca *«precisamente porque…»*.
- **No explicar jazz**: una idea por párrafo. Listas de lo que hay, nunca de lo que falta. La analogía es un puente de una frase. La tesis, en la primera línea. Un hecho verificable en lugar de un adjetivo de credibilidad.
- **Se afirma, no se anuncia**: las reglas se dicen en presente y como hecho.
- **No se habla mal de otros equipos.** La exclusividad se reclama sobre productos con nombre (creatuactivo.com, queswa.app), nunca sobre «la tecnología». El gremio solo se nombra en `NET_01` y `NET_02`.
- **La frase de identidad**: *«Creemos que nadie debería entregar su vida entera al ciclo de trabajar, pagar cuentas y repetir. Creemos que el trabajo de cada persona debería convertirse en un activo.»*
- **Voz de Queswa**: tercera persona en aforismos y nombres propios; primera para lo que hace en la conversación.
- ❌ **No despliegue copy sin proponerlo antes en el chat**: el Director decide, y solo entonces se tocan archivos.
