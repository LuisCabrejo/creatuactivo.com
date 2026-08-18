# HANDOFF — Canal WhatsApp: guardarraíles, onboarding del socio y auditoría del catálogo (17 ago 2026)

> **Para el agente que continúa.** El Director sale a contactar ~100 personas. Este documento
> cubre qué se construyó el 17 ago, **qué quedó pendiente a propósito**, y las cuatro lecciones que
> se pagaron con errores propios durante la sesión. Antes de tocar el motor lea también
> [HANDOFF_CANAL_PRODUCCION_14AGO2026.md](HANDOFF_CANAL_PRODUCCION_14AGO2026.md).
>
> ⚠️ **El foco es Queswa de WhatsApp para creatuactivo.com.** ganocafe.online y la web quedaron
> fuera de alcance por decisión del Director; los riesgos de esas superficies están en §4.

---

## 1. Los dos guardarraíles de salida (el trabajo central de la sesión)

El canal tenía **un solo** filtro de salida —`detectarModeloInventado()`, 23 términos sobre
modelos de negocio ajenos— y ninguna protección para los dos riesgos que pueden costar la cuenta.
Ahora son tres, todos en el webhook, todos con batería:

| Módulo | Qué bloquea | Batería |
|---|---|---|
| `wa-guardarrail-salud.ts` | Enfermedad · adelgazamiento · ciencia citada · mecanismo · clases farmacológicas · testimonio de salud. Capa 0 de emergencia → línea 123 | `test-guardarrail-salud.mjs` |
| `wa-guardarrail-negocio.ts` | Perpetuidad · velocidad del ingreso · proyección con plazo · garantías · reemplazo del empleo · ingreso pasivo · **comisión contada en personas** · progresión geométrica · totales de estructura | `test-guardarrail-negocio.mjs` |
| `detectarModeloInventado()` | Modelos ajenos (infoproductos, cursos) — ya existía | — |

**El criterio de calibración, que es lo que hay que preservar:** los patrones exigen
**CONJUNCIÓN**, no palabras sueltas. Dinero + tiempo, dinero + garantía, comisión + personas. Sin
eso se bloquea copy legítimo: la durabilidad **es cierta** en FREQ_05 (el activo se hereda), las
cifras del plan **son correctas** cuando las dicta un pin, y *"cada viernes"* es un hecho.

⚠️ **Las dos baterías verifican las DOS direcciones** y así deben mantenerse: que bloqueen lo
grave **y** que no toquen los candados del corpus ni el copy aprobado. La de negocio prueba
explícitamente la apertura, que el Director decidió conservar (§3).

**Validación contra la realidad:** el guardarraíl de negocio se corrió sobre 400 respuestas
históricas — habría bloqueado 33 (8,3%), concentradas en jun–jul y **solo 1 en agosto**. Las
correcciones de copy bajaron la incidencia; no la llevaron a cero. Ahí está el argumento de por
qué la red hace falta.

---

## 2. Onboarding del socio nuevo, sin salir de WhatsApp

`src/lib/wa-onboarding.ts` + comando en el webhook. El Director activa desde su propio móvil:

```
ACTIVAR Julieth Cabrejo 3001234567          # con teléfono
ACTIVAR Julieth Cabrejo 3001234567 7118234  # con código de Gano
ACTIVAR Julieth                             # lo busca en pending_activations
```

Crea el canal y le devuelve al Director **el enlace y el texto listo para reenviar**, siempre.
Eso es lo que vuelve irrelevante la ventana de 24 h: él ya está conversando con esa persona.

**Cuatro cosas que NO se deben cambiar sin entenderlas:**

- ⚠️ **`constructor_id` NO es un UUID.** Es la llave de texto (`nombre-en-slug` + código de Gano)
  con la que el Dashboard y la página del reel se entienden. Con un UUID aleatorio la página no
  encuentra al dueño en `private_users` y cae al WhatsApp **orgánico** — los prospectos de un
  socio nuevo le escriben a otra persona. Se crean las dos filas: `private_users` y
  `constructor_slugs`.
- ⚠️ **El enlace del socio es `/{slug}/queswa`, nunca `/{slug}`.** Esa página **no existe** y
  devuelve 404 (verificado en producción). `/{slug}/queswa` además **valida el slug contra la base
  antes de redirigir** a wa.me: sin esa validación un slug mal escrito deja entrar al prospecto
  sin dueño, fuera del radar de nadie y sin un solo error visible.
- **Plantilla `enlace_canal_listo`** (UTILITY, APROBADA 17 ago): respaldo cuando la ventana está
  cerrada. Su botón de respuesta rápida **abre la ventana de 24 h**, y de ahí en adelante Queswa
  escribe libre. Someter/consultar: `scripts/someter-plantilla-bienvenida.mjs [--estado]`.
- **Quien llega con volición declarada se salta la apertura** y va directo a `gestionarCierre`.
  Sin esto, la persona que ya dijo que sí recibía el saludo con botones y tenía que decidir otra
  vez — el momento exacto en que se enfría. `RE_VOLICION` se exporta desde `wa-radicacion.ts`
  para que el mismo criterio decida en el primer turno y en los siguientes.

### Avisos al socio

- **Con nombre y número** cuando un prospecto le escribe a Queswa (`avisarSocioNuevoProspecto`).
  Es el aviso de mayor valor y el único que puede identificar a alguien: quien abre un enlace en
  el navegador tiene `nombre` y `teléfono` en **null** — es un hash, y no hay forma de nombrarlo.
- **Un aviso por hito distinto** de cada prospecto (llegó · vio el video · escribió · volvió),
  ninguno repetido. ⚠️ **No usar cupo numérico**: contar mensajes es cronológico, y los hitos de
  menos valor ocurren primero, así que el cupo se agotaba antes del aviso de que alguien está
  escribiendo — la señal de compra.
- ⚠️ **Antes de cada envío se verifica la ventana de 24 h; si está cerrada, no se envía nada.** No
  se encola, no se fuerza plantilla, no se insiste.

### Lo que NO restringe el volumen (verificado en la documentación de Meta)

Los límites de mensajería (250 · 2.000 · 10.000 · …) cuentan **solo los envíos FUERA de ventana**.
Todo lo iniciado por el usuario es **gratis, ilimitado y no consume tier** — desde nov 2024 las
conversaciones de servicio son libres. El plan de 100 contactos no toca ningún límite. Lo que sí
se cuida es que nadie **bloquee** el número: eso es lo que Meta mide para bajar la calidad.

Estado del número al cierre: `quality_rating` **GREEN** · `CONNECTED` · negocio **verificado** ·
cuenta **APPROVED** · `name_status` **PENDING_REVIEW** (⛔ no tocar el nombre visible mientras siga
así — cada guardado pisa la solicitud anterior).

---

## 3. Copy desplegado

**Trece respuestas reescritas**, todas con los cinco pasos y paridad verificada (145 fragmentos
por tenant al cierre).

- **Producto** (`catalogo_productos`): BEB_02 · CIENCIA_01 · CIENCIA_02 · CIENCIA_03 · BEB_06 ·
  FAQ_04. Salieron PubMed, Frontiers, macrófagos, células NK y las cifras infladas. El
  diferencial pasó a apoyarse en **lo verificable** (cultivo propio, 30 años, INVIMA, seis colores
  del Reishi, hidrosolubilidad observable) y en **la experiencia**.
- **Negocio**: `COMP_MODELO_01` (la segunda vía se cuenta en **compras**; el ingreso se define por
  la **presencia**, no por la ausencia de trabajo) y `WHY_01` (la IA *"explica y atiende"*, ya no
  *"hace la parte comercial por usted"*, que prometía que no hay venta y contradecía al prompt).
  Cierran §4.5 y §4.6 del handoff del 15 ago.
- **Credibilidad**: `FREQ_07` responde con **números de registro INVIMA consultables** en vez de
  2.000 estudios y de la certificación TGA, que el sitio colombiano no publica. A un escéptico no
  se le da un dato que no puede verificar.
- **Puertas nuevas**: `SUP_02` (CordyGold, que no tenía ficha y caía en compensación) y `FAQ_05`
  (rendimiento por caja).

**Decisión del Director sobre la apertura (17 ago):** *"con el potencial de igualar o superar sus
ingresos actuales"* **se conserva**. Un handoff previo la registró como promesa a retirar;
revisada con contexto, es aspiración sin cifra ni plazo y es el frame de upgrade del 2 ago. El
criterio quedó anotado en `wa-apertura.ts`. **No volver a proponerla como corrección.**

**Flow del simulador (cierra §4.8):** el GEN5 abre en **1 paquete** (era 5), el titular dice
*"Suma de esas N compras"* en vez de *"Total"*, se retiró la opción de 10 —y sus bloques de
cálculo, para que $11.250.000 no exista en el JSON— y se declaró el supuesto. Despliegue:
`scripts/actualizar-flow-simulador.mjs` (valida el límite de 20 caracteres de `NavigationList`
antes de subir y republica, porque actualizar deja el Flow en DRAFT).

⚠️ **Cadencia de pago, corregida por el Director:** es **un viernes de por medio** — lo comprado
en una semana se liquida **el viernes de la semana siguiente**, no el viernes inmediato. El corpus
repite *"cada viernes"*, que es cierto como cadencia pero no dice nada del rezago: **queda por
auditar si algún fragmento insinúa un pago más rápido del real.**

---

## 3.5 Modo socio (17 ago, tarde) — y de dónde sale la voz para el paso siguiente

**El canal ya distingue al dueño de canal del prospecto.** `identificarSocio()` lo resuelve
determinísticamente contra `constructor_slugs`; el socio recibe `saludoDeSocio()` —su enlace y
una sola pregunta, *"¿a quién le va a escribir hoy?"*— y el motor recibe `pageContext:
'whatsapp_socio'`, que activa **MODO SOCIO**. Antes, el socio recibía la apertura de prospecto y
Queswa se presentaba ante él como su propia asistente.

⚠️ **Los teléfonos se comparan NORMALIZADOS en ambos lados.** Están guardados con `+`, con
espacios y algunos con cero inicial, así que un `.eq()` contra la columna cruda no encuentra a
nadie — la detección nunca habría funcionado.

### El paso 2, pendiente: redacción asistida de mensajes de contacto

El motor ya sabe que debe hacerlo (está en las instrucciones de MODO SOCIO) pero **no tiene
fragmentos con qué**. Y la pregunta de cierre del saludo abre justo ahí, así que es lo primero que
un socio va a pedir.

**Qué fuente usar, decidido con el Director el 17 ago:**

- ✅ **Fiable:** `arsenal_inicial.txt` (cabecera + WHY), las trece respuestas reescritas el 17 ago,
  y `wa-apertura.ts` — la única sin un solo término retirado.
- ❌ **NO usar:** `HANDOFF_MENSAJES_1A1_FUNDADORES.md` (mayo 2026: *Arquitecto de Patrimonio*,
  *Base Operativa*, *ingreso pasivo*, *libertad financiera*) ni `REEL_COPY` de `src/lib/reels.ts`,
  que además construye con listas de ausencias.

⚠️ **Y una advertencia sobre el diagnóstico de léxico**, para no repetir el error que se cometió
en esta sesión: un conteo bruto de *"empresa digital"* sobre el arsenal da ~35 y parece una
emergencia. **No lo es.** Al abrirlas, casi todas están en notas de versión, cabeceras y **líneas
de disparo** —donde es correcta—. Las de cuerpo las revisó el Director una por una y **se
conservan todas**: el término no está prohibido, está acotado a no usarse en primer contacto, y
esos fragmentos responden a quien ya se ganó la categoría. **El arsenal está sano.**

---

## 4. Pendientes — documentados a propósito, fuera del foco actual

El Director decidió concentrarse en Queswa de WhatsApp para creatuactivo.com. Esto queda abierto,
en orden de riesgo:

1. **🔴 El guardarraíl de salud vive SOLO en el webhook de WhatsApp.** `/api/nexus` no tiene
   ninguno, así que **la web (orbe de creatuactivo.com) y ganocafe.online responden preguntas de
   salud sin filtro**. Mover el módulo al motor protege las tres superficies con el mismo código.
2. **🔴 `arsenal_ganocafe` (tenant `ecommerce`, 3 fragmentos):** `OBJ_GC_01` cita al **Memorial
   Sloan Kettering Cancer Center** —vecindad con el cáncer, el patrón exacto de las cartas de la
   FDA—; `BENE_01` trae 400 estudios, células NK y fatiga adrenal; `PROD_02` cuelga función a cada
   compuesto. Contexto: la página está **viva** (200) pero **sin una sola conversación desde el 13
   de abril**; probabilidad baja, protección cero. Los tres reemplazos están redactados en el
   historial de esta sesión.
3. **🔴 `SUP_01` dice "dosis terapéutica" dos veces, bajo `verbatim_lock`** — registro
   farmacológico, y ninguna marca del benchmark lo usa. Además `CordyGold` figura bajo el paraguas
   del Ganoderma cuando su ingrediente es **Cordyceps sinensis 500 mg**, y falta el gramaje por
   cápsula (275/275/500 mg) que el fabricante sí publica.
4. **🔴 Auditoría del catálogo — el problema es sistemático:** 0 de 22 productos coinciden
   plenamente con las fichas oficiales de ganoexcel.com.co; **14 con discrepancia grave**. Lo más
   serio, en orden:
   - **Alérgenos omitidos:** leche de cabra (Gano Soap), leche en polvo y desnatada (Latte Rico,
     Mocha Rico, Schokolade). Es seguridad del consumidor, no cumplimiento.
   - **Cuatro bebidas mal clasificadas:** Ganocafé Classic, Gano C'Real Spirulina, Oleaf Rooibos y
     Gano Schokolade son oficialmente **Suplemento Dietario**, no alimento — otro régimen y con
     leyenda obligatoria.
   - **El disclaimer global del catálogo es falso para 7 de 19 productos** (dice *"alimentos
     funcionales"*).
   - **Las cápsulas LUVOCO dicen lo contrario de la verdad:** el catálogo inventó una escala de
     "intensidad 4/10, 6/10, 8/10"; el micrositio oficial dice que **Suave = mayor cafeína** y
     **Fuerte = disminución sustancial**.
   - Precios y presentaciones no son verificables contra el fabricante (el sitio no los publica).
     **Su fuente real son las capturas del back office** en `public/contexto/capturas/productos/`.
5. **⚠️ El nombre visible del WABA** sigue en `PENDING_REVIEW`. No tocarlo.

---

## 5. Las cuatro lecciones de la sesión (se pagaron con errores propios)

1. **La cabecera `[Concepto Nuclear]` dicta lo que nombra.** Caí en la trampa **cuatro veces en un
   día**: escribí *"ingreso pasivo"*, *"proteger el estómago"*, *"200 fitonutrientes"* y hasta la
   palabra *"jabón"* dentro de notas que las prohibían. La cabecera viaja dentro del fragmento que
   el modelo lee. **La regla se enuncia SIEMPRE en afirmativo, sin nombrar lo vetado.** Las cuatro
   las cazaron las baterías; ninguna llegó a un prospecto.
2. **Agregar disparadores a un fragmento largo NO abre una puerta.** Le metí *"¿cuánto dura una
   caja?"* al título de BEB_02 (~1.500 caracteres sobre café): el texto quedó embebido y el score
   no se movió. **Lo que funciona es un fragmento corto**, donde la consulta domine la señal —
   `FAQ_05` pasó de no llegar a 0.507 con cuatro líneas.
3. **`medir-recuperacion-voyage.mjs` medía con el tipo de embedding equivocado** (le faltaba
   `input_type: 'query'`, y Voyage genera vectores asimétricos). Ya está corregido, pero **toda
   medición anterior al 17 ago es sospechosa**: dos diagnósticos de esta sesión se cayeron al
   re-medir. Producción usa `'query'` + `enrichQuery()`.
4. **Una "decisión" citada en un handoff ajeno es un reporte, no una regla.** El handoff del 15 ago
   registró como decisión del Director retirar la aspiración de la apertura; revisada con él, se
   conserva. Antes de obedecer una prohibición documentada, verificar de dónde salió y si sigue
   teniendo sentido en la doctrina vigente.

---

## 6. Comandos de verificación

```bash
node scripts/test-guardarrail-salud.mjs        # exit 1 si falla
node scripts/test-guardarrail-negocio.mjs      # exit 1 si falla
node scripts/benchmark-clasificador.mjs --tenant whatsapp   # 42/42 al cierre
node scripts/auditar-frases-vetadas.mjs        # 0 cabeceras, 0 cuerpo
node scripts/medir-recuperacion-voyage.mjs "<consulta>"     # ya con input_type correcto
node scripts/someter-plantilla-bienvenida.mjs --estado      # APPROVED
node scripts/sql.mjs -e "select tenant_id, count(*) from nexus_documents where (metadata->>'is_fragment')::boolean is true group by 1"
```

Paridad al cierre: **145 fragmentos** en `creatuactivo_marketing` y en `whatsapp`.
