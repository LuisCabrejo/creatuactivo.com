# Handoff — Canal de WhatsApp operativo (26–27 jul 2026)

**Para:** agente Claude Code que lleva léxico, arsenales y embudo en `marketing`
**De:** sesión de trabajo en `Dashboard` (Luis + Claude Code)
**Estado:** el canal de WhatsApp **funciona end-to-end**. Verificado con mensajes reales.

> ⚠️ **Hay cambios aplicados y SIN COMMITEAR en este repo.** Ver sección 7 antes de tocar nada.

---

## 1. Titular

**Ya se puede usar WhatsApp.** Circuito completo probado hoy:

```
Meta → webhook (/api/whatsapp/webhook) → motor Queswa (/api/nexus, tenant whatsapp)
     → respuesta → Meta → teléfono del prospecto
```

Se envió una plantilla a un número real (entregada) y se recibió respuesta de Queswa a un "Hola".
Ambas direcciones funcionan.

---

## 2. Lo que estaba roto y se arregló

| Problema | Estado |
|---|---|
| **La app no estaba suscrita al webhook de la WABA** (`subscribed_apps` vacío) → Meta recibía los mensajes entrantes y no los entregaba a nadie. Existía en abril y se perdió (probablemente con el rechazo del App Review en junio). | ✅ Restaurada (`POST /{WABA_ID}/subscribed_apps`) |
| Sin PIN de verificación en dos pasos → imposible re-registrar el número | ✅ **PIN: `701571`** |
| Perfil del número sin foto y con descripción en léxico viejo | ✅ Foto cargada + descripción migrada a v27 con trato de usted |
| Nombre visible rechazado | ⏳ Ver sección 3 |

---

## 3. El nombre visible será **Queswa** (no "CreaTuActivo")

Meta rechazó "CreaTuActivo" **dos veces**, la segunda ya con el sitio corregido. Eran **dos problemas
distintos**:

1. **Sin vínculo con el negocio verificado** — el portafolio de Meta se llama "Luis Cabrejo" y el
   sitio no lo conectaba con la marca. ✅ **Resuelto**: footer del home ahora dice *"Fundada por
   Luis Cabrejo"* + *"© 2026 CreaTuActivo.com · Luis Cabrejo"* (commit `19aa0eb`, desplegado).
2. **"CreaTuActivo" es un imperativo** — *"crea tu activo"* es un llamado a la acción, y las normas
   de nombre visible prohíben lenguaje promocional. ❌ **Esto no se arregla con nada.**

Con el sitio ya corregido, **"Queswa" fue aprobado y "CreaTuActivo" rechazado**. Confirma el
diagnóstico.

**Estado actual:** "Queswa" reenviado a revisión, `new_name_status: PENDING_REVIEW`. Al aprobarse hay
que **re-registrar el número** (`POST /{PHONE_NUMBER_ID}/register` con el PIN) para que tome efecto —
un nombre aprobado no se aplica solo.

⚠️ **No tocar el campo de nombre visible mientras haya una revisión en curso.** Cada guardado abre una
solicitud nueva que pisa la anterior; así se perdió una aprobación de "Queswa". Meta permite 10
cambios cada 30 días; van 4.

**Implicación de marca:** el número público de creatuactivo.com se mostrará en WhatsApp como
**Queswa**. Decisión aceptada por Luis.

---

## 4. ✅ Número único — RESUELTO Y APLICADO

**Decisión de Luis: el número canónico de cara al público es `+57 321 5193909`** (el aprobado en Meta,
el que tiene Queswa).

El `+57 320 6805737` **sale del sitio por completo** y queda como **canal interno**: bandeja del
equipo directivo para recibir notificaciones. No es contacto público.

**Ya aplicado en el código** (sin commitear): ~30 ocurrencias migradas de 320 → 321 en `src/`,
incluyendo `api/nexus/route.ts` (doble oferta de cierre), `[slug]/[destino]`, `useNEXUSChat`,
`sistema/productos`, `catalogo-productos`, `paquetes`, `planes`, `confirmacion`, `paises/brasil`,
`ManifiestoDocument`, `api/fundadores`, `api/nexus/producer` y los 5 correos.

**Regla nueva de Luis:** *en el sitio no puede haber enlace de comunicación directa con Luis.*
Aplicado — los tres mensajes que decían *"Hola Luis, soy {nombre}"* ahora dicen *"Hola, soy {nombre}"*.

**También aplicado:** *"el equipo directivo"* → *"el equipo de CreaTuActivo"* (4 lugares en
`api/nexus/route.ts`, decisión de Luis: más amigable).

💡 **Mejora sugerida, no hecha:** el número sigue hardcodeado ~30 veces. Conviene extraerlo a una
constante única.

---

## 5. 🔴 El léxico del tenant whatsapp está congelado en abril

**Este punto le corresponde a este agente.** Luis pidió expresamente que se haga **después** de la
ronda de ajustes de léxico en curso, no antes.

El system prompt `queswa_whatsapp` (Supabase) está en **v1.2, sin tocar desde el 6 de abril de 2026**.
Medido sobre sus 6.195 caracteres:

| Dentro del prompt | Ocurrencias |
|---|---|
| "Patrimonio Paralelo" (prohibido desde v26.3) | 2 |
| "Motor Cognitivo" (hoy: Centro de Mando) | 2 |
| "constructor" (hoy: Propietario) | 17 |
| "Arquitecto" (hoy: Propietario) | 1 |
| **"usted"** | **0** |

Escrito **íntegramente en tuteo**. Ejemplo real de lo que respondió a un "Hola":

> Hola. Soy Queswa, el **Motor Cognitivo** de CreaTuActivo. 🪢
> Estoy aquí para ayudar**te** a construir **tu Patrimonio Paralelo**: un **sistema** de ingresos que
> no dependa de **tu** tiempo, sin que **tengas** que abandonar **tu** actividad actual.

Cuatro infracciones en tres frases: término prohibido, término retirado, villano reusado en positivo,
tuteo de punta a punta.

**Segunda capa:** los fragmentos clonados al tenant `whatsapp` en `nexus_documents` probablemente
estén igual de stale. Gotcha ya documentado en CLAUDE.md:

> `clonar-arsenal-whatsapp.mjs` **SOLO inserta categorías nuevas — NO actualiza las existentes**.
> Para propagar fragmentos *modificados* hay que **purgar primero** `arsenal_inicial_%` del tenant
> whatsapp y luego clonar.

---

## 6. 🆕 Pre-afiliación (diseño aprobado por Luis, sin construir)

**El problema:** hoy "Activar ahora" es un enlace a una persona. Quien ya decidió queda esperando a
que su patrocinador —que puede ser un empresario ocupado— vea el mensaje. Se enfría el mejor momento
del embudo.

**El diseño aprobado:**

```
Prospecto: "quiero activar"
   ↓
Queswa pide los datos, de a uno (no los cuatro de golpe):
   nombre completo → cédula → ciudad → paquete elegido
   ↓  (NADA bancario ni de pago por WhatsApp — eso lo cierra el humano)
Guarda la pre-afiliación y notifica a tres lados:
   · push en el Centro de Mando del patrocinador
   · WhatsApp al patrocinador
   · WhatsApp al 320 (bandeja del equipo)
   ↓
El humano finiquita, con los datos ya sobre la mesa
```

**Plantilla ya creada y en revisión de Meta** — `pre_afiliacion_nueva` (id `1456181582935790`,
categoría UTILITY, idioma `es`):

> Hola {{1}}. {{2}} dejó lista su pre-afiliación con el paquete {{3}}, desde {{4}}.
> Los datos completos están en su Centro de Mando. Comuníquese pronto para finiquitar.

Sirve igual para el patrocinador y para el equipo.

⚠️ **Prerequisito bloqueante: la atribución prospecto→socio (sección 8).** Para avisarle al
patrocinador hay que saber quién es, y hoy no se sabe.

**Pieza reutilizable:** la tabla `pending_activations` del Dashboard fue hecha justo para afiliaciones
a medio camino.

---

## 7. ⚠️ Cambios aplicados y SIN COMMITEAR en este repo

Antes de tocar estos archivos, revisar el diff — hay trabajo encima:

- **Migración del número** (~30 ocurrencias) + retiro de "Hola Luis" + "equipo directivo" →
  "equipo de CreaTuActivo". Archivos: `api/nexus/route.ts`, `[slug]/[destino]/page.tsx`,
  `components/nexus/useNEXUSChat.ts`, `components/ManifiestoDocument.tsx`, `sistema/productos/*`,
  `paquetes`, `planes`, `confirmacion`, `paises/brasil`, `api/fundadores`, `api/nexus/producer`,
  `emails/*`.
- **`src/lib/wa-channel.ts`** (nuevo) — capa única de canal: `sendText`, `sendTemplate`,
  `listTemplates`, `getPhoneAsset`. **Único archivo que debe hablar con graph.facebook.com.**
  `whatsapp-meta.ts` y el webhook delegan aquí.
- **Puente `GET /api/wa/assets` + `POST /api/wa/send`** (nuevos), autenticados con header
  `x-wa-bridge-secret` (env `WA_BRIDGE_SECRET`, mismo valor en ambos proyectos de Vercel).
- **`knowledge_base/arsenal_inicial.txt` v5.27 + `arsenal_compensacion.txt`** — rename
  "Consumidor VIP" → **"Cliente VIP"** (24 ocurrencias, decisión de Luis: *cliente* es mejor que
  *consumidor*; **"Cliente Preferencial" es sinónimo pleno**) + fragmento nuevo `CLIENTE_VIP_01` con
  las cifras del 25% de descuento. **Luis lo dejó en standby — no desplegar sin su visto bueno.**

Solo está commiteado el fix del footer (`19aa0eb`).

**Regla de arquitectura:** el `WHATSAPP_SYSTEM_TOKEN` vive **solo** en marketing. El Dashboard opera
el canal por el puente. Nunca copiar el token al otro repo.

---

## 8. Lo que falta, en orden

1. **Atribución prospecto→socio.** El webhook inserta en `prospects` con `fingerprint_id = wa_{phone}`
   pero **sin `constructor_id`** → los prospectos de WhatsApp no aparecen en el Radar de nadie ni
   disparan push. **Bloquea el seguimiento Y la pre-afiliación.** Es lo primero.
2. **Actualizar el léxico del tenant whatsapp** (sección 5), cuando termine la ronda en curso.
3. **Eliminar los flujos de Mapa de Salida y Reto 5 Días.** Decisión de Luis: ya no aplican.
   ⚠️ No son enlaces sueltos — `api/funnel/route.ts` usa `MapaDeSalidaConfirmation` y
   `Reto5DiasConfirmation`, y `/diagnostico` sigue siendo ruta viva. Es cirugía sobre el embudo.
4. **Retirar el código muerto de `acceso_mapa_salida`.** Esa plantilla **no existe en la WABA** (la
   cuenta solo tiene `hello_world` + la nueva `pre_afiliacion_nueva`), así que `sendWhatsAppTemplate`
   falla en cada ejecución desde `api/funnel/route.ts:345` y `api/webhooks/prospect-capture:92`.
5. **Construir la pre-afiliación** (sección 6), una vez exista la atribución.
6. **Más plantillas utility** para el seguimiento diario. En Colombia cuestan ~US$0,0008 (≈3 pesos)
   frente a ~US$0,02 de las de marketing, y no tienen el tope de ~2 por persona/día.

---

## 9. Datos de referencia

```
WABA ID:            1436663504253230   (nombre de la cuenta: "CreaTuActivo")
Phone Number ID:    1115546358301373
Número público:     +57 321 5193909    ← canónico, con Queswa
Número interno:     +57 320 6805737    ← bandeja del equipo, NO publicar
App de Meta:        "Queswa App CTA" — 1513851726973155
Portafolio (legal): "Luis Cabrejo" — 2440608633047462 (verificado)
PIN dos pasos:      701571
Calidad:            GREEN · Estado: CONNECTED
Plantillas:         hello_world (APPROVED) · pre_afiliacion_nueva (PENDING)
```

⚠️ **No migrar el 320 a la Cloud API.** Un número registrado en la API no puede usarse en WhatsApp
Messenger — Luis perdería su WhatsApp personal. La única excepción es Coexistence, que exige
WhatsApp Business App y activación explícita.

**Sobre el App Review de Meta:** los permisos `whatsapp_business_messaging` y
`whatsapp_business_management` figuran como "Revisión rechazada" y **eso no importa** para el caso de
uso actual — con acceso estándar la WABA propia opera sin problema (verificado: se leen plantillas y
se envían mensajes con normalidad). El App Review solo hace falta si algún día cada socio conecta
**su propio número** (camino Tech Provider + Embedded Signup + Coexistence).
