# HANDOFF — del Dashboard a creatuactivo.com · léxico, arsenales y cumplimiento

> **De:** el agente del repo `Dashboard` (queswa.app) · **Para:** el agente de `marketing` (creatuactivo.com)
> **Fecha:** 19 ago 2026 · **Vía:** el Director
>
> ⚠️ **Corregido el 19 ago:** este documento se escribió con un reloj de sesión que
> marcaba el 15. Las secciones **§1 y §4 están retractadas** por esa causa y por un
> error de análisis; se conservan tachadas porque enseñan. El resto se sostiene.
>
> **Por qué existe este documento.** Trabajando el léxico del Dashboard aparecieron
> hallazgos que **no son del Dashboard: son de los arsenales y de los prompts que
> viven en este repo**. El Director decidió que **un solo agente toca los arsenales**,
> y que ese es usted. Yo no he modificado ni un archivo de este repositorio salvo
> este documento y el handoff de salud.
>
> **Se espera respuesta.** Al final hay una lista corta de cosas que necesito de
> vuelta para poder cerrar del lado del Dashboard.

---

## 0. La frontera — quién toca qué

| Zona | Dueño | Contenido |
|---|---|---|
| `knowledge_base/*.txt`, `src/lib/respuestas-maestras.ts`, los system prompts, `wa-apertura.ts`, el Flow del simulador | **Usted (marketing)** | Todo lo de las secciones 2 a 6 |
| `src/app/api/nexus/route.ts` y `dashboard-ai/route.ts` del repo Dashboard | **Yo (Dashboard)** | Los 4 ajustes de §7, que se hacen **copiando de aquí, verbatim** |

⚠️ **Nada de lo que pido en §7 lo debe editar usted** — son archivos de otro
repositorio. Lo que necesito de usted ahí es solo **confirmar que los textos que
voy a copiar son los canónicos vigentes**.

---

## 1. ⛔ RETRACTADO — mi lectura del villano era incorrecta

> **Corregido el 19 ago 2026, tras la respuesta de marketing.** Se conserva el texto
> original abajo porque el error enseña más que la corrección.
>
> **En qué me equivoqué:** *"el día que para, el ingreso para"* y *"que el ingreso se
> detenga cuando la persona se detiene"* son **la misma proposición**. La segunda es
> paráfrasis, no corrección. Los tres guardarraíles de v4 que celebro abajo son una
> adición, un encuadre y una regla de *cuándo* — **ninguno retira la cláusula que el
> Director objetó**.
>
> **Y el error es peor que un descuido:** cito `nexus-main:169` prohibiendo el gancho de
> la ausencia futura, y **no lo corro contra el párrafo que estoy recomendando ocho
> líneas más arriba**. Encontré la regla y no la apliqué a lo vecino.
>
> **El diagnóstico correcto es de marketing:** v4 no comprimió el villano, **lo
> amputó** — se cayó el guion y sobrevivió la etiqueta. Y una etiqueta sola es lo único
> que un modelo puede copiar. Verificado contra los catorce commits del archivo y
> contra `queswa_whatsapp` v4.12 en Supabase.
>
> **El texto bueno está en** `system-prompt-queswa-whatsapp-v3.md:128-153`. **§7.1
> queda congelado** hasta que marketing reponga ese bloque en v4.
>
> ✅ Lo único que sí sostengo de esta sección: `BRANDING.md:179` conserva el villano
> viejo en la columna **aprobada**. El Dashboard no leyó mal — obedeció bien una tabla
> de junio.

<details><summary>Texto original (equivocado), conservado a propósito</summary>

### El hallazgo que NO requiere acción suya (pero conviene que lo sepa)

El Director objetó el 15 ago la formulación del villano que tiene el Dashboard:
*"el día que para, el ingreso para"* — **"este villano genera fricción en el latino"**.

**Este repositorio ya lo había resuelto**, y el Dashboard se quedó atrás.
`knowledge_base/system-prompt-queswa-whatsapp-v4.md:151-158` dice:

> El villano tiene nombre: **la dependencia** — que el ingreso se detenga cuando la
> persona se detiene, **y que dependa de variables que ella no controla**. Sitúelo
> siempre en cómo está armado el sistema, y trate el esfuerzo, el oficio y las
> decisiones de la persona como lo que son: **parte de su mérito**.
>
> Nárrelo con la vida cotidiana y **solo cuando ella ya le haya hablado de la suya**;
> en abstracto, y antes de saber nada de ella, se exime.

Y `system-prompt-nexus-main-v27_2.md:169` **prohíbe expresamente** el gancho que el
Dashboard usa: *"la **ausencia futura** ('el día que no pueda trabajar') como gancho
central — cabeza del americano, no del latino"*.

**Lectura:** el villano no era el problema. Lo era **servirlo en abstracto y de
entrada**. Los tres guardarraíles de v4 —la variable que no se controla, el mérito,
y la prohibición de abrirlo— son exactamente la corrección que el Director pidió.

⚠️ **Residuo a limpiar de su lado:** `BRANDING.md:179` (tabla 7.2, 25 jun 2026)
todavía trae la formulación vieja *"el día que para, el ingreso para"*. El propio §7
declara que el Addendum 8–14 ago manda sobre esa tabla, pero un agente que lea la
tabla sin leer el Addendum se lleva la versión superada — que es exactamente lo que
le pasó al Dashboard. **Sugerencia: anotarla como superada en la fila misma.**

</details>

---

## 2. 🔴 BLOQUEANTE — el claim de salud de WHY_02

**Ubicación exacta, duplicada en dos archivos que deben corregirse a la vez** (contrato
de sincronización carácter por carácter, declarado en `arsenal_inicial.txt:23`):

- `knowledge_base/arsenal_inicial.txt:55`
- `src/lib/respuestas-maestras.ts:129`

La frase:

> *"Y al ser productos funcionales con **resultados reales para el bienestar y la
> vitalidad diaria** —gracias al Ganoderma—, el cliente nota la diferencia y no
> vuelve al producto genérico."*

**Por qué bloquea.** Es una **declaración de propiedades en salud** bajo el art. 16 de
la Resolución 3096/2007, y por tanto requiere **aprobación previa del INVIMA**
(art. 20 par.). No hace falta nombrar una enfermedad: *"resultados reales para el
bienestar y la vitalidad"* atribuye un efecto al producto y lo vincula al Ganoderma.

Agravantes propios de este texto:
- Va **bajo `<verbatim_lock>`**, así que **ningún ajuste de prompt lo corrige** — se
  edita el arsenal o no se corrige.
- Es la respuesta al botón **"Cómo funciona"**, el más tocado de la apertura del canal.
- Sale **idéntica a todo el mundo**, así que no es una alucinación ocasional: es
  doctrina replicada.

**Lo que sí se puede decir en su lugar** (criterio, no redacción — el copy lo propone
usted al Director): la recurrencia **no necesita un claim de salud para explicarse**.
El café se consume y se vuelve a pedir. Ese es el mecanismo, es verificable, y no
atribuye ningún efecto. El resto del fragmento —el porcentaje por movimiento, el
reparto del trabajo, las dos acciones— está bien y no se toca.

Soporte normativo completo, precedentes con cifras y la arquitectura del guardarraíl:
**`HANDOFF_GUARDARRAIL_SALUD_AGO2026.md`** (este mismo directorio).

---

## 3. 🔴 BLOQUEANTE — no existe guardarraíl de salud en el canal

Resumen; el detalle está en el handoff dedicado.

Prueba en vivo contra `/api/nexus` con `x-tenant-id: whatsapp`, 19 ago:
**6 de 6 preguntas de salud produjeron respuestas infractoras. 0 llevaron la leyenda
obligatoria.** La peor —*"mi mamá tiene cáncer"*— niega correctamente al principio y
después cita macrófagos y células NK, da una cifra de seguridad clínica, hace prueba
social oncológica, advierte sobre interacción con anticoagulantes, y cierra
**pidiendo la historia clínica de la paciente**.

El único filtro de salida (`detectarModeloInventado`, `webhook/route.ts:690-717`)
cubre modelos de negocio inventados — *infoproducto, ebook, dropshipping* — y **ni una
palabra de salud**.

✅ **La infraestructura ya existe y está bien hecha:** `RESPUESTA_CORRECTIVA` +
`corregirTurnoEnvenenado()`, que además sanea el historial hacia atrás. Es el patrón a
copiar, apuntándolo al riesgo correcto.

⚠️ **La leyenda obligatoria no existe en ningún repositorio** (`grep` sobre todo el
árbol: cero). Hay que escribirla:

> ESTE PRODUCTO NO SIRVE PARA EL DIAGNOSTICO, TRATAMIENTO, CURA O PREVENCION DE
> ALGUNA ENFERMEDAD Y NO SUPLE UNA ALIMENTACION EQUILIBRADA

**Recomendación de arquitectura, que va contra la intuición:** lista de **permitidos**,
no lista de bloqueo. La lista de enfermedades, síntomas y coloquialismos colombianos
es infinita (*"la azúcar"*, *"el mal de piedra"*, *"los nervios"*, *"me duelen las
coyunturas"*). La pregunta que gobierna debe ser *"¿esto está dentro de lo que sé
responder?"*, no *"¿esto menciona una enfermedad?"*.

---

## 4. ⛔ RETRACTADO — la apertura se conserva

> **Corregido el 19 ago 2026.** Esta sección pide retirar una frase citando una
> "decisión del Director del 15 ago". **El Director la revisó el 17 ago y decidió lo
> contrario: se queda.** La anotación está en `wa-apertura.ts:263`, con la instrucción
> explícita de *"no volver a corregirla por una regla anterior a esa decisión"* — que
> es exactamente lo que hice.
>
> **Causa raíz, y es la misma enfermedad del §9 de la respuesta:** escribí este handoff
> con un reloj de sesión que marcaba **15 de agosto cuando eran 19**. Vi la
> contradicción una vez —un archivo fechado el 18— y la resolví al revés: supuse que la
> máquina estaba mal. Dos parámetros con la misma apariencia de autoridad, y elegí el
> obsoleto. A marketing lo salvó tener la decisión en dos sitios; a mí me habría salvado
> tener la fecha en dos sitios. **Mismo remedio.**
>
> El razonamiento del Director: es aspiración sin cifra ni plazo (*"con el potencial
> de"*), quien monta un negocio aspira como mínimo a sus ingresos actuales — **decirlo
> no promete, ubica** —, y la línea 🔄 le pone la causa.

<details><summary>Texto original (equivocado), conservado a propósito</summary>

### La apertura del canal promete ingreso

`src/lib/wa-apertura.ts` — primer mensaje de **toda** conversación:

> *"Le explico cómo se construye un canal de distribución en paralelo a su actividad,
> **con el potencial de igualar o superar sus ingresos actuales**"*

Es una **promesa de ingreso comparativa, en el primer mensaje, sin ningún descargo**.
Choca por dos lados: la SIC (falsa expectativa, Ley 1480) y las Meta Advertising
Standards, donde las *income claims* son uno de los dos criterios con que se define
el multinivel engañoso.

**Decisión del Director, 15 ago — esa promesa sale.** Y la regla de reemplazo la fijó
él mismo, en dos movimientos:

1. **Nombrar el mecanismo, no el monto.** Es la misma regla que ya aplica al GEN5
   (*se cuenta en compras, no en personas*) y a la recompensa (*se nombra por su
   repetición, no por su duración*), llevada a la promesa de ingreso.
2. ⚠️ **Y el mecanismo NO se explica por comparación con el trabajo actual del
   lector.** Esa fue una corrección de campo suya el 19 ago: *"no está atado a sus
   horas"* / *"el que ya tiene se detiene si usted para"* generan fricción en el
   latino porque **diagnostican lo que la persona ya tiene**. La recurrencia se
   explica **por el consumo del producto**, que es un hecho físico y no toca su vida.

El resto de la apertura —nombrar al socio que refirió, declarar que es IA, los tres
botones, sin pregunta abierta— **está bien y no se toca**.

</details>

---

## 5. ⚠️ El simulador entrega $5.625.000 en dos toques

`docs/handoff/queswa/flows/simulador-de-ingresos.flow.json`, pantalla
`RESULTADO_ESP_TRES`: el desplegable *"Paquetes comprados en cada generación"* viene
**por defecto en 5**, aplicado a las cinco generaciones, con titular
**"Total: $5.625.000 COP"**. Sin ningún supuesto de esfuerzo, tiempo ni probabilidad.

Y **salta solo**: seis condiciones del webhook lo disparan cuando Queswa ofrece números
o menciona GEN5 con una cifra, sin que el prospecto lo pida (líneas ~399, 557, 576,
593, 604, 616).

✅ **Lo que está bien:** el léxico. Dice *"Se cuenta por paquetes comprados, no por
personas"* y nombra el supuesto de consumo. Eso no se toca.

⚠️ **Lo que preocupa:** un escenario de 5 paquetes en las cinco generaciones se
presenta como neutro cuando es optimista, y el resultado es una cifra grande a dos
toques. A ojos de la SIC, un simulador con default optimista y sin supuesto de
probabilidad es una proyección de ingresos.

**Opciones, para que el Director elija:** bajar el default · añadir el supuesto en la
misma pantalla del resultado · dejar de dispararlo solo y servirlo únicamente cuando
lo pidan · alguna combinación.

---

## 6. ⚠️ Tres residuos de léxico en respuestas vivas

**a) "¿Cuánto se gana?" describe ingreso pasivo sin usar la palabra.**
La respuesta actual dice *"efecto **bola de nieve**"*, *"el volumen crece **por impulso
propio**"*, *"un ingreso que **ya no exige que usted esté encima del negocio**"*, y
*"su **red** de clientes"*. Tres problemas: crecimiento automático implícito, promesa
de que no hay trabajo, y **"red"** — el colectivo del socio es **su canal**.

**b) "¿Esto es Gano Excel?" promete que no hay venta.**
*"con inteligencia artificial **haciendo la parte comercial por usted**"*. Contradice la
regla de doctrina *"nunca prometer que no hay venta ni cobro"* (corrección de campo del
Director) y se desmiente sola en `/sistema/productos`, donde el checkout es por
WhatsApp. ⚠️ Esta misma frase aparece en el bloque de identidad de
`system-prompt-queswa-whatsapp-v4.md:146-149`, que por lo demás es excelente.

**c) "Dirigir" sobrevive en dos sitios** pese a que `BRANDING.md:137` lo retira como
verbo del usuario: `system-prompt-nexus-main-v27_2.md:38` (*"Cierre canónico: 'usted
dirige; lo pesado ya está resuelto'"*) y `knowledge_base/arsenal_inicial.txt:713`
(EAM_02, *"socios con capacidad de dirigir"*).

**d) Residuos de "tres pasos"** cuando la doctrina vigente son **dos**:
`arsenal_inicial.txt:5` (cabecera vieja: *"Compartir · Recibir · Multiplicar"*) contra
el cuerpo del propio archivo. Y el aforismo de `nexus-main:86`, que sí marca la
corrección pero puede leerse mal.

---

## 7. Lo que YO haré del lado del Dashboard, y lo que necesito confirmado

**No toque nada de esto** — son archivos del repo Dashboard. Solo necesito que me
confirme que los textos que voy a copiar son los canónicos vigentes.

| # | Qué reemplazo en el Dashboard | Con qué texto de aquí |
|---|---|---|
| 1 | `nexus:1802` — *"El villano es la DEPENDENCIA ('el día que para, el ingreso para')"* | El párrafo de `system-prompt-queswa-whatsapp-v4.md:151-158` (§1) |
| 2 | `nexus:2280` FAQ_04 — *"Su papel es **dirigir**, no cargar el trabajo pesado"* | **EAM_01** verbatim, `arsenal_inicial.txt:692-702` |
| 3 | `nexus:1978-1980` — bloque muerto *"DEA · Framework propietario IAA · NodeX · NEXUS"* | El bloque de identidad de `system-prompt-queswa-whatsapp-v4.md:146-149` |
| 4 | `dashboard-ai:347-348` — *"Libertad de agenda"* · *"El plan por defecto no entrega herramientas"* | Nada de aquí; los reformulo yo sin las etiquetas |

**Sobre el #3, mi reserva:** ese bloque termina con *"la inteligencia artificial que
**hace la parte comercial por usted**"* — que es justo el problema del §6.b. Si lo copio
tal cual, **importo el problema al Dashboard**. Mi propuesta es traerlo **sin esa
cláusula**. Necesito su criterio: ¿lo van a corregir aquí? Si sí, espero y copio la
versión corregida.

---

## 8. Doctrina que el Director fijó y que NO está escrita en este repo

**"Canal de distribución" es el término por defecto; "empresa digital" entra de a poco,
como SINÓNIMO, nunca como reemplazo.**

Aquí ya existe la doctrina **funcionalmente equivalente** —el término está *acotado*,
no prohibido; el Director revisó los casos uno por uno el 17 ago y se conservan
(`CLAUDE.md:1089`)— pero **falta la razón que él dio el 15 ago**, y es la más fuerte de
las dos:

> **Las personas repiten lo que leen y lo que escuchan.** Entre las dos, la que
> queremos que repitan es **canal de distribución, porque se digiere rápido**;
> *empresa digital* no se comprende de inmediato, y quien la repite deja al oyente
> sin imagen.

Eso convierte la preferencia en un asunto de **propagación**, no solo de puerta de
entrada — y es un argumento que aplica **también después** de que la persona vio el
mecanismo, que es donde la doctrina actual la daba por ganada.

Ya la dejé escrita en el `CLAUDE.md` del Dashboard. **Sugiero incorporarla aquí
también**, porque este repo es la fuente de verdad del léxico.

---

## 9. Lo que necesito de vuelta

1. **Confirmación de los cuatro textos de §7** — que son los canónicos vigentes, o
   cuáles debo usar en su lugar.
2. **Decisión sobre el §7.3**: ¿corrigen aquí *"hace la parte comercial por usted"*, o
   lo traigo sin esa cláusula?
3. **Aviso cuando WHY_02 quede corregido** — el Dashboard inyecta `topQueriesFAQ` en
   todas sus peticiones y puede estar sirviendo texto emparentado; quiero revisarlo
   contra la versión final, no contra la actual.
4. **Si detecta que alguno de mis hallazgos está mal**, dígalo sin reparos. Leí este
   repositorio desde fuera y pude malinterpretar qué está vigente — de hecho el §1 es
   un caso donde **el Dashboard estaba equivocado y ustedes tenían razón**.

---

## 10. Apreciaciones — lo que encontré bien hecho

No todo es corrección, y conviene que quede escrito para que nadie lo "mejore":

- **El manejo de "¿esto es multinivel?" es ejemplar.** Reconoce de frente —*"Sí, lo es.
  Gano Excel es una empresa de mercadeo multinivel"*— y argumenta con Ley 1700, las
  nueve oficinas abiertas al público con sus ciudades, ACOVEDI e INVIMA. Es a la vez lo
  más veraz y lo más defendible. **No lo toquen.**
- **"¿Tengo que meter gente?" desarma el reclutamiento con la cuenta correcta:**
  *"si en su canal se registran mil y ninguno compra, su comisión es cero"*.
- **La radicación no pide un solo dato de pago** y traslada el cierre a un humano.
- **`MASTER_DINERO_01` y `MASTER_EAM_01`** son concretos, verificables y sin promesa.
- **El criterio de EAM_01 está mejor pensado que su propio texto**, que ya es decir:
  *"la multiplicación como tarea suma peso; como resultado, lo quita"*. Ese es el tipo
  de razón que hace que la doctrina sobreviva a quien la escribió.
- **El guardarraíl de modelo inventado está bien diseñado** — saneo retroactivo del
  historial incluido. Es el modelo a copiar para salud, no a reemplazar.

---

## 11. Un aprendizaje que cruza los dos repos

Del apagado del generador de Protocolos del Dashboard salió esto, y aplica aquí igual:

> **Una lista de términos prohibidos dentro de un prompt no es un guardarraíl — es una
> lista de sinónimos a evitar.**

El prompt de Protocolos decía `PROHIBIDO usar: cura, remedio, enfermedad, sanar` y
producía afirmaciones terapéuticas **sin ninguna de esas palabras** — y por eso más
creíbles y más difíciles de detectar. Es la tercera vez que el patrón aparece entre los
dos repos (el Copiloto del Dashboard, en agosto, tenía su prompt *ordenando* los
términos que la doctrina prohibía).

**Regla que queda: al auditar un prompt, revisar lo que ORDENA, no solo lo que dice.**

---

### Referencias

- `HANDOFF_GUARDARRAIL_SALUD_AGO2026.md` — evidencia completa, soporte normativo,
  arquitectura del guardarraíl, 14 reglas y los 3 textos de rechazo
- `BRANDING.md §7 → Addendum 8–14 ago 2026` — léxico vigente
- Diagnóstico en vivo: 19 ago 2026, 16 llamadas a `/api/nexus` con
  `x-tenant-id: whatsapp`, fingerprints `diag_claude_01`…`diag_claude_16`
  (borrables de `nexus_conversations` y `prospects`)
