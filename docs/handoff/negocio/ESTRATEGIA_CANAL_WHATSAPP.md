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

⚠️ **Implementación:** `queswa` **no está declarado** en `DESTINO_MAP` ([`src/app/[slug]/[destino]/page.tsx`](../../../src/app/[slug]/[destino]/page.tsx)), así que hoy cae al fallback y aterriza en la mini-landing del socio — sin error visible. Hay que declararlo, y es un destino distinto a los demás: los otros resuelven a una ruta interna con `?ref=`, este resuelve a un `wa.me` externo con texto pre-llenado.

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

**Pregunta de alcance que falta resolver, y es la única que bloquea:** ¿el chat web **desaparece**, o el **orbe** apunta a WhatsApp mientras el chat web sigue accesible desde los puntos donde tiene sentido propio? No es lo mismo. Con el chat web se van también el FSM de cierre con su warm handoff al equipo, los chips de arranque, la voz y el TTS, y el modo asesor de salud del catálogo — todo eso vive en la superficie web, no en el canal. La lectura mínima de su decisión (el **orbe** lleva a WhatsApp en todo el sitio) se puede hacer sin perder nada de eso; la máxima (no hay chat web) es un retiro de producto que conviene decidir aparte.

**Y el contexto del regreso:** si la persona salió de la charla hablando del simulador, el `?text=` de vuelta debería decirlo, para que Queswa no la reciba desde cero. Si no, la puerta de regreso le cuesta repetir lo que ya había dicho — justo la fricción que se está eliminando.

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
