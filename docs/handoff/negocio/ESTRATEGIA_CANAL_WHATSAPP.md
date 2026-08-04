# Estrategia del canal — WhatsApp es el destino, no la antesala

> Decisiones del Director, 4 ago 2026. Reemplaza el criterio con el que se implementó la entrega del `ACCESO` (commit `61b4f59`), que enviaba al prospecto al sitio.
>
> Estado del canal (cuenta Meta, números, reglas duras) → [HANDOFF_SESION_CANAL_Y_HOOK_AGO2026.md](../queswa/HANDOFF_SESION_CANAL_Y_HOOK_AGO2026.md).

## 1. La decisión de fondo

**El prospecto se queda en WhatsApp.** No se le saca al sitio para que "vea de qué se trata": lo que tiene que ver, lo ve conversando.

La evidencia que la sostiene viene de `ganocafe.online`, medida en campo por el Director: con un orbe de chat web, de cada 100 visitantes **1** iniciaba conversación. Cambiando ese mismo orbe por uno de WhatsApp, **30**. No es un ajuste de conversión, es un cambio de canal — la gente ya vive en WhatsApp y ahí no le cuesta escribir.

## 2. El principio que se deriva (y que cambia el estándar de calidad)

La conversación no es el argumento de venta. **Es la demostración del producto.**

Lo que se le está mostrando al prospecto es exactamente la herramienta que él va a recibir: un ingreso en paralelo a su actividad de siempre, operado desde el lugar donde ya vive. Mientras Queswa le explica, el prospecto está viendo a Queswa trabajar. El pitch y la prueba son el mismo objeto.

De ahí sale el estándar real, y es más exigente que "¿convirtió?":

> **¿Esta persona estaría tranquila mandándole esta misma conversación a un amigo?**

Si la respuesta es no, no importa que haya convertido.

## 3. Qué obstáculo histórico resuelve

El freno más caro del modelo nunca fue el precio ni la objeción de MLM. Fue este: **la persona se frenaba porque ella misma sentía fricción**, y no quería invitar a sus amigos a una experiencia que arrancaba incómoda. Nadie comparte algo de lo que no está orgulloso.

Por eso la calidad de los primeros tres mensajes no es un asunto de copy: es lo que determina si el propietario va a compartir o se va a quedar quieto. Si él siente que lo que tiene es muy bueno, compartir deja de costarle.

## 4. Lo que se retira

**El enlace al sitio anexado a la respuesta del `ACCESO`** ([`webhook/route.ts`](../../../src/app/api/whatsapp/webhook/route.ts), bloque "3.6 Entrega del acceso").

Razones, en orden:
- Saca a la persona del único canal donde tenemos su teléfono, hacia una superficie donde vuelve a ser anónima.
- El mensaje se pelea consigo mismo: Queswa pregunta *"¿A qué se dedica hoy?"* y en el mismo aliento entrega un enlace para irse. Si hace clic, la pregunta queda sin responder; si contesta, el enlace sobraba.
- Contradice el propio system prompt `queswa_whatsapp` v3.0, que ya posiciona a Queswa como el destino: *"Viene con curiosidad por una app —que se maneja desde WhatsApp— … **Usted es esa herramienta**"* (línea 20). **El motor ya piensa bien; el parche era lo que desviaba.**
- Al destino se llegaba a hablar con el mismo Queswa, en una versión peor de la experiencia que ya estaba teniendo.

**El acceso es la conversación.** El sitio no es el premio; es el folleto.

## 5. El video: no de entrada

El video en cuestión es el **reel explainer de la Home** — `HOME_MANIFESTO_VIDEO` en [`src/lib/reels.ts`](../../../src/lib/reels.ts), la v2 de ~**187 segundos** (3 min 7 s), talking-head de Luis con b-rolls 3D. Es el único activo en video que responde "¿de qué se trata?" de principio a fin, y por eso era el candidato natural a entregarse por WhatsApp.

Descartado como respuesta al primer mensaje. Lo primero es que el prospecto **encuentre valor**, y a partir de ahí la charla se lleva sola según por dónde entre. Tres minutos de video como respuesta a "Acceso" es volcar todo de golpe — justo lo que el system prompt prohíbe en su línea 34 (*"Explique de a poco, respondiendo lo que le preguntan. No vuelque todo de golpe"*).

Queda disponible como carta para cuando la persona lo pida.

## 6. El enlace amigable y la captura del teléfono

**Restricción vigente (trabajo previo):** el enlace que se comparte **no puede llevar parámetros** — un `?ref=` a la vista genera desconfianza. Forma acordada: `https://creatuactivo.com/luis-cabrejo-queswa`.

**La tensión:** un enlace web limpio no captura el WhatsApp del prospecto. Y el teléfono es el activo.

**Camino definido (confirmado por el Director, 4 ago 2026):** el enlace amigable **no tiene que capturar nada — tiene que entregar la conversación a WhatsApp.** La forma acordada es con barra, la que ya encaja con la arquitectura `/{slug}/{destino}`:

```
https://creatuactivo.com/luis-cabrejo/queswa
        └─ redirect →
https://wa.me/573215193909?text=Hola Queswa, vengo del enlace de luis-cabrejo
```

✅ **Ya está implementado** desde el commit `beab1bc` (*"feat(wa): enlace amigable {slug}/queswa + prompt WhatsApp v2.0"*, jul 2026), en [`src/app/[slug]/[destino]/page.tsx`](../../../src/app/[slug]/[destino]/page.tsx). No vive dentro de `DESTINO_MAP` —y hace bien: ese mapa resuelve rutas **internas** con `?ref=`, y este destino resuelve a un `wa.me` **externo**— sino en una rama propia antes de la búsqueda en el mapa:

```ts
if (destino === 'queswa' || destino === 'acceso') {
  const texto = `Hola Queswa 👋 vengo del enlace de ${slug}`
  redirect(`https://wa.me/573215193909?text=${encodeURIComponent(texto)}`)
}
```

`acceso` funciona como alias. El texto pre-llenado ya es lenguaje natural con el slug embebido, tal como lo espera `resolverPatrocinador()`.

Lo que se comparte queda limpio y con marca; el prospecto aterriza en el chat con el mensaje ya escrito y solo pulsa enviar; y **al enviarlo entrega su número**, que es lo que queríamos. El parámetro existe pero vive del lado de WhatsApp, no en el enlace que la persona lee.

Dos detalles que lo hacen encajar sin tocar el motor:
- El texto pre-llenado es **lenguaje natural, no un token**. El system prompt ya espera exactamente esa forma: *"verá algo como 'vengo del enlace de {nombre}'"* (línea 17).
- `resolverPatrocinador()` busca un token con guion en cualquier parte del mensaje, así que `luis-cabrejo` dentro de una frase natural resuelve igual. La atribución sigue guardándose en `prospects.constructor_id` — que es lo que alimenta el CRM y el aviso al arquitecto.

⚠️ **Consecuencia para los 50 contactos:** la atribución **nunca** dependió del enlace que se manda de vuelta, sino del texto con que el prospecto abre. Si se comparte un `wa.me` sin el nombre del socio, los prospectos entran sin patrocinador y no hay error visible — solo un `constructor_id` vacío.

## 7. Tareas abiertas

### 7.1. Orbe de WhatsApp en todo el sitio

**Decisión del Director (4 ago 2026): el orbe de WhatsApp va en todo `creatuactivo.com`**, no solo en las páginas que reciben tráfico desde el canal.

El razonamiento es el mismo de §1 y §2: si la tesis es que hoy se construye un ingreso desde WhatsApp, el sitio no puede ofrecer una puerta distinta. Y cuando la conversación necesite algo que el chat hace mal (el **simulador de los 12 niveles**, el **catálogo con fotos**), Queswa manda a esa página y ahí la persona **vuelve a encontrar la misma puerta de regreso**. El sitio deja de ser un desvío y pasa a ser una sala anexa.

**Lo que esta decisión toca** — el orbe monta global en [`layout.tsx`](../../../src/app/layout.tsx) vía `DeferredOrb`, y hay ocho superficies que hoy abren el chat web con el evento `open-queswa`:

| Superficie | Cómo abre el chat hoy |
|---|---|
| Orbe global | `UnifiedQueswaOrb` (tap corto abre chat, long-press activa voz) |
| Home | `QueswaCTAButton` + `HomeManifestoVideo` (al terminar el reel) |
| `/servilleta` | botón "PREGÚNTALE ALGO EN VIVO" del slide 2 |
| `/12-niveles` | mismo patrón del deck |
| `/sistema/productos` | chips de salud, Queswa como asesor de bienestar |
| Páginas de reel | burbuja de `ReelVideo` al terminar o al hacer scroll |

**Criterio para resolver el alcance (Director, 4 ago 2026): que lo guíen las investigaciones — se aplica lo que ofrezca mejor experiencia de usuario**, no una postura previa. Ver §8.

**El catálogo conserva el énfasis en salud.** Un asesor de salud no rinde si nadie entra al catálogo; pero si entran, Queswa está entrenado para responder muy bien sobre el producto, y ahí lo que corresponde es **salud, no negocio**. El modo asesor de `/sistema/productos` (`pageContext === 'catalogo_productos'` + `QUESWA_PRODUCTS_QUICK_REPLIES`) se mantiene, sea cual sea la superficie donde ocurra la conversación.

**El contexto del regreso:** si la persona salió de la charla hablando del simulador, el `?text=` de vuelta debe decirlo, para que Queswa no la reciba desde cero. Si no, la puerta de regreso le cuesta repetir lo que ya había dicho — justo la fricción que se está eliminando. La evidencia lo respalda: **el 73% de los consumidores señala repetir información como su máxima fuente de frustración**.

## 8. Lo que dijeron las investigaciones (4 ago 2026)

Dos informes: [Estrategia Canales de Mensajería](../../investigaciones/posicionamiento-categoria/Estrategia%20Canales%20de%20Mensajería.md) y [Estrategia Conversacional IA Prospectos](../../investigaciones/posicionamiento-categoria/Estrategia%20Conversacional%20IA%20Prospectos.md).

⚠️ **No tienen el mismo peso.** El primero reformula en gran medida este documento —lo ingirió como insumo— y se apoya en blogs de proveedores con incentivo comercial; su aporte propio son las restricciones de plataforma (§8.3). El segundo sí trae literatura revisada por pares (Taylor & Francis, Emerald, MDPI, arXiv, AAAI) y **nos contradice en puntos útiles**. Cuando choquen, pesa el segundo.

### 8.1. Lo que confirma

- El principio de no sacar al prospecto queda respaldado por la literatura de fricción cognitiva (mensajería *out-of-app*).
- El estándar de "¿lo compartiría con un amigo?" tiene nombre en la literatura: mitigación del **riesgo social**. Nadie propaga lo que percibe como precario.
- La **escasez manufacturada se castiga** en canales íntimos; la escasez estructural se acepta. Coincide con la doctrina de "se cierra por cupos, no por calendario".
- El warm handoff con expediente previo al equipo ya es lo correcto: el traspaso ciego es el error más caro del comercio conversacional.

### 8.2. Lo que nos contradice — y es accionable

| Hallazgo | Estado hoy | Qué implica |
|---|---|---|
| **Divulgar que es IA, antes del diálogo, sube la satisfacción** en servicios de alto contacto. Ocultarlo y que lo descubran después destruye la confianza casi sin reparación. | El prompt v3.0 dice "el asistente de CreaTuActivo" — **no declara que es IA**. | Declararlo en la apertura. Es también el marco honesto para que la competencia del software construya confianza por mérito propio. |
| **Transferencia de confianza**: nombrar al referidor humano es la palanca más fuerte del primer mensaje, por encima de la velocidad de respuesta. | Se resuelve el patrocinador y se guarda en BD, pero **el saludo no lo nombra**. | Que la apertura reconozca al socio por su nombre. |
| **Nada de preguntas abiertas en el primer mensaje** — cargan cognitivamente y se leen como interrogatorio. Se recomienda micro-compromiso con botones. | La apertura pregunta *"¿A qué se dedica hoy?"*. | Sustituir por opciones cerradas. Es el mismo patrón de los chips que ya funcionan en la web (`QUESWA_QUICK_REPLIES`), llevado a botones interactivos de WhatsApp. |
| **El audio es la norma en LATAM**; obligar a teclear un contexto complejo es una barrera severa. | El webhook lee **solo** `message.text?.body` — una nota de voz no produce texto y el flujo se queda sin entrada. | Transcribir el audio entrante. No hace falta responder en voz (riesgo de valle inquietante): se procesa el audio y se responde en texto. |
| **Latencia cero se lee como robot** (Teoría de Violación de Expectativas). | Se responde tan rápido como el modelo termine. | Considerar retardo tipográfico en respuestas que semánticamente exigen análisis. |
| **WhatsApp Flows** permite renderizar micro-interfaces dentro del chat. | Se planeaba mandar al sitio para el simulador. | **Tensión real entre los dos informes**: el primero dice mandar al sitio con orbe de regreso; el segundo dice no externalizar y usar Flows. El segundo está mejor sustentado. Evaluar Flows para el simulador antes de dar por cerrada la ruta del sitio. |

### 8.3. Restricciones de plataforma que hay que respetar

- **La etiqueta `HUMAN_AGENT` es una trampa.** Extiende la ventana de Instagram a 7 días, pero Meta la reserva a soporte humano real; usarla para secuencias automatizadas termina en bloqueo de API.
- **TikTok no tiene webhooks públicos** de comentarios ni de mensajes directos para automatización comercial. Quien ofrece comentario→DM ahí opera como *TikTok Marketing Partner*. Camino viable: un puente de terceros que entregue el webhook limpio a Queswa, conservando a Queswa como único motor de decisión. Alternativa más simple: en TikTok, redirigir al enlace de la biografía hacia `wa.me`.
- **Instagram es el mejor terreno** para comentario→DM en LATAM; Facebook funciona con demografía algo mayor.
- El flujo de Instagram debería **terminar migrando a WhatsApp** con el enlace amigable, donde las reglas de reactivación permiten plantillas.

### 8.4. Lo que hay que descartar de los informes

- **El informe 1 inventó un mercado**: dedica su §7 a la psicología del usuario "en Dosquebradas". Nunca dimos esa ciudad como contexto. Es relleno; ignórelo.
- **Ambos ponen a Gano Excel en el titular.** El mensaje de apertura que propone el informe 2 dice *"apalancándose en la infraestructura logística y de productos de consumo de Gano Excel"*. **Va contra doctrina**: Gano es respaldo, nunca el titular del ingreso — nombrarlo así dispara el fantasma del multinivel. Tomar la arquitectura del mensaje, no su redacción.
- Las cifras de conversión que citan (86–90% de apertura, 34,2% de conversión comentario→DM, 68%) salen de blogs comerciales, no de revisión por pares. Úsense como dirección, no como meta.

### 7.2. Palabra clave en Instagram, Facebook y TikTok

**Objetivo del Director:** reels donde se plantea *"escriba la palabra X y le enviamos X"*, con la entrega **automatizada por Queswa**, no por flujos de terceros.

Lo que ya está claro y no hay que volver a averiguar:
- **La aprobación del WABA no sirve ahí.** Son productos distintos. Las plantillas son exclusivas de WhatsApp; Instagram y Messenger se rigen por la ventana de 24 h más la etiqueta de agente humano que la estira a 7 días.
- Lo que sí exige revisión son los **permisos**: `instagram_business_manage_messages` + `instagram_business_manage_comments`, con **Acceso avanzado**.
- **Meta no aprueba una intención, aprueba algo funcionando.** Piden el screencast del ciclo real (alguien comenta → le llega el DM). Con acceso estándar ese ciclo se puede montar sobre la cuenta propia. **Se construye, se graba, y ahí se somete.** Someter antes es rechazo garantizado.
- **ManyChat está descartado** por decisión del Director: la conversación tiene que ser de Queswa.
- TikTok es un tercer sistema, con su propia API de mensajería y sus propias reglas. No asumir que se comporta como Meta.

Detalle heredado → [HANDOFF_SESION_CANAL_Y_HOOK_AGO2026.md §5](../queswa/HANDOFF_SESION_CANAL_Y_HOOK_AGO2026.md).

### 7.3. Investigación de estrategia de canal

Prompt para el agente investigador → [PROMPT_GEMINI_ESTRATEGIA_CANAL_CONVERSACIONAL.md](../../investigaciones/prompts/PROMPT_GEMINI_ESTRATEGIA_CANAL_CONVERSACIONAL.md). Cubre, con base científica, qué genera **confianza**, qué genera **enganche** y qué genera **deseo de iniciar** en WhatsApp, Instagram, Facebook y TikTok.
