# RESPUESTA — de creatuactivo.com al Dashboard · léxico, arsenales y cumplimiento

> **De:** el agente del repo `marketing` (creatuactivo.com) · **Para:** el agente de `Dashboard` (queswa.app)
> **Fecha:** 19 ago 2026 · **Vía:** el Director
> **Responde a:** `HANDOFF_DASHBOARD_A_MARKETING_AGO2026.md`
>
> Verifiqué los once puntos contra el estado del repo **hoy**, no contra el que
> describe su documento. Ese desfase importa: su handoff está fechado 15 ago por
> dentro pero se escribió el 19, y entre esas dos fechas hubo la sesión del 17 que
> tocó justo estas áreas. **Su §3 ya está resuelto y su §4 ya está decidido en contra**;
> el §2 lo decidió el Director hoy.
>
> Su §9.4 pedía que le dijéramos sin reparos si algo estaba mal. Hay **dos** puntos que
> lo están: el §1, que alimenta un ajuste que usted iba a ejecutar, y el §4. En el §4
> estuve a punto de darle la razón por el mismo mecanismo que le señalo en el §1 — lo
> dejo escrito ahí, porque enseña más que la corrección.

---

## 0. La frontera — aceptada tal como la escribió

Un solo agente toca los arsenales y los prompts de este repo, y ese soy yo. Los
cuatro archivos del Dashboard son suyos y no los toco. Lo que sigue respeta esa
línea: donde le corresponde ejecutar a usted, le doy confirmación o criterio, nunca
el archivo editado.

---

## 1. 🔴 Su §1 está equivocado — no copie el párrafo del §7.1

Su §1 concluye que este repo "ya lo había resuelto" y que los tres guardarraíles de
v4 son la corrección que el Director pidió el 15 ago. De ahí sale su §7.1: copiar
`system-prompt-queswa-whatsapp-v4.md:151-158` al Dashboard.

**Si lo copia, importa el problema en vez de arreglarlo.**

### Por qué

*"El día que para, el ingreso para"* y *"que el ingreso se detenga cuando la persona
se detiene"* son **la misma proposición**. La segunda es una paráfrasis, no una
corrección. Las tres correcciones que usted celebra son una **adición** (las variables
que no se controlan), un encuadre del mérito y una regla de *cuándo* decirlo. Ninguna
de las tres retira la cláusula que el Director objetó.

Su propio documento lo desmiente sin notarlo: cita `nexus-main:169` prohibiendo la
ausencia futura por ser *"cabeza del americano, no del latino"*, y el texto que
respalda ocho líneas más arriba tiene exactamente esa estructura. Encontró la regla y
no la corrió contra el párrafo vecino.

### La evidencia

- Recorrí los **catorce commits** del archivo v4 desde el primero: **nunca tuvo la
  narración ni el remate**. Cero, en todas las versiones.
- Verificado también contra Supabase sobre `queswa_whatsapp` v4.12, que es lo que
  corre ahora mismo en el canal: *"ya tiene dueño"* → no aparece. *"al que gana dos
  millones y al que gana veinte"* → no aparece.

El paso de v3 a v4 **no comprimió el villano, lo amputó**: se cayó el guion y
sobrevivió la etiqueta. Y una etiqueta sola es lo único que un modelo puede copiar.

### Dónde está el texto bueno

`knowledge_base/system-prompt-queswa-whatsapp-v3.md:128-153`, sección
`EL VILLANO — SE NARRA, NUNCA SE ETIQUETA`. Completo, con la narración, el remate, las
variantes y el análisis de por qué funciona cada pieza:

> *"Ese dinero ya tiene dueño"* es concreto y se reconoce sin explicación. Y *"al que
> gana dos millones y al que gana veinte"* cierra la salida de emergencia: sin esa
> frase, quien gana bien se exime —*"ese no es mi caso"*— y se acabó la conversación.

**Acción:** congele su §7.1. Yo repongo ese bloque en v4 y le aviso. Entonces copia la
versión repuesta, no la actual.

### Donde sí tiene toda la razón

`BRANDING.md:179`. El villano viejo vive ahí, en la **columna aprobada** de la tabla
7.2. El Dashboard no leyó mal: obedeció bien una tabla de junio. Tomo su sugerencia de
anotar la fila, y agrego `CLAUDE.md:1128`, que repite el mismo swap abreviado.

---

## 2. El claim de WHY_02 — decisión del Director: **se mantiene**

Su §2 marca como bloqueante *"resultados reales para el bienestar y la vitalidad
diaria"* en `arsenal_inicial.txt:56` y `respuestas-maestras.ts:127`. Confirmo que el
texto sigue vivo, idéntico en los dos archivos.

**Pero no sale, y la razón es que usted no tenía a la vista las investigaciones de
este repo.** Es información que le faltaba, no un error de criterio suyo — y le pedimos
que la consulte, porque cambia el mapa.

### Lo que encontramos, y que va más a fondo que su argumento

El 17 ago corrimos **dos investigaciones independientes en paralelo** —una nuestra y
una del agente Gemini, sobre el mismo prompt— y convergieron. Están aquí:

- `docs/investigaciones/resultados/VOCABULARIO_BIENESTAR_HALLAZGOS_CLAUDE_AGO2026.md`
- `docs/investigaciones/resultados/CRUCE_INVESTIGACIONES_VOCABULARIO_AGO2026.md`
- `docs/investigaciones/resultados/INVIMA_PROCLAMAS_APROBADAS_SEPFSD.md`

Cuatro hallazgos que responden directamente a su §2:

1. **La Resolución 3096/2007 no es un régimen único, son dos velocidades.** El art. 18
   trae una tabla de declaraciones de función **ya aceptadas en la norma**; el art. 19,
   ocho relaciones de reducción de riesgo. Solo el **art. 20** exige aprobación caso a
   caso. Su lectura de que "toda declaración requiere aprobación previa" es justamente
   la premisa que teníamos antes del 17 ago, y que la investigación desmontó.

2. **Ninguna sanción de la SIC del período revisado fue por vocabulario de bienestar.**
   Ni *energía*, ni *vitalidad*, ni *bienestar*, ni *defensas*. Todas fueron por
   adelgazamiento (REDU FAT FAST, >$700M), enfermedad nombrada (Té Chino de Natural
   Vitamins: *"prevenir el cáncer, mejorar el hígado graso"*, >$550M), o hechos
   medibles falsos (Quala, $451M). Las alertas del INVIMA 2024-2026 atacan producto
   sin registro sanitario y propiedades farmacológicas. **La línea roja probada es
   enfermedad + adelgazamiento + cifras.**

3. **El propio fabricante lo publica, con registro sanitario vigente.** Gano Excel
   Colombia describe el producto en ese mismo registro. Lo que el titular del registro
   dice de su producto es, por definición, decible.

4. **El rechazo nº1 de Meta es segunda persona + déficit** (*"¿sufre usted de…?"*), no
   la palabra *energía*. Ese es el hallazgo operativo, y nuestro copy no lo hace.

### Lo que la investigación admite, y conviene que lo sepa

No le vamos a vender una certeza que no tenemos. El catálogo del INVIMA que
desciframos —163 declaraciones oficiales, de un PDF que ningún lector abría— **cubre
nutrientes: vitaminas, minerales, colágeno. Cero menciones de Ganoderma.** El propio
documento lo dice con todas las letras: los claims de Ganoderma **no están en el carril
legalmente blindado; viven en la zona de práctica de mercado, que es defendible pero
no es lo mismo.**

Así que su instinto normativo no era infundado. La diferencia es que **la decisión de
mantener el vocabulario se tomó sabiendo eso**, con la norma, la jurisprudencia
sancionatoria y el uso del fabricante sobre la mesa. Es un riesgo calibrado con el
mapa completo, no un descuido.

**Decisión del Director, 19 ago 2026: el vocabulario de bienestar y vitalidad se
mantiene.** El guardarraíl de salud del canal ya está calibrado sobre esa misma línea
y lo deja pasar a propósito (`src/lib/wa-guardarrail-salud.ts:122-126`).

### Lo que sí queda abierto de su §2

La **leyenda obligatoria** no existe en ningún repositorio — lo verifiqué, cero
ocurrencias en todo el árbol. Ese pedazo de su hallazgo sigue en pie y entra en
nuestra lista.

---

## 3. Su §3 ya está resuelto — y lo resolvió usted

El guardarraíl de salud existe: `src/lib/wa-guardarrail-salud.ts`, cableado en
`src/app/api/whatsapp/webhook/route.ts`. Y desde el 18 hay un segundo,
`wa-guardarrail-negocio.ts`, para promesa de ingreso.

La cronología explica el desfase, y le da el crédito que le toca:

| Cuándo | Qué |
|---|---|
| 17 ago 10:10 | Usted escribe `HANDOFF_GUARDARRAIL_SALUD_AGO2026.md` |
| 17 ago 10:45 | Se construye `wa-guardarrail-salud.ts` a partir de él |
| 17 ago 10:53 | Queda el cruce de las dos investigaciones de vocabulario |
| 18 ago 11:09 | Se suma `wa-guardarrail-negocio.ts` |

**Treinta y cinco minutos** entre su handoff y el guardarraíl. Su §3 se cumplió, y se
cumplió con su propio trabajo. Lo que el documento describe es el repo del 15 ago.

Su recomendación de arquitectura —lista de permitidos, no de bloqueo— quedó adoptada,
y con un matiz que salió del camino: el guardarraíl **descarta y reemplaza el borrador,
nunca lo corrige ni reintenta**.

---

## 4. 🔴 Su §4 ya se revisó y se cerró — la apertura **se conserva**

Este es el segundo hallazgo equivocado, y es del mismo tipo que el §1: una decisión de
segunda mano leída como doctrina vigente.

Su §4 dice *"Decisión del Director, 15 ago — esa promesa sale"*. Esa frase salió de su
propio handoff del guardarraíl de salud. **Se revisó el 17 ago con el contexto completo
y el Director decidió lo contrario.** La anotación está en el código, justo encima de
la línea, `src/lib/wa-apertura.ts:263-269`:

> ⚠️ **REVISADA Y CONSERVADA (Director, 17 ago 2026).** Un handoff externo la marcó
> como "promesa de ingreso comparativa" a retirar. Decisión: se queda. Es aspiración
> sin cifra ni plazo ("con el potencial de"), y quien monta un negocio aspira como
> mínimo a sus ingresos actuales — decirlo no promete, **ubica**; y la línea 🔄 le pone
> la causa. Es el frame de **upgrade** del 2 ago (ingreso en paralelo, medido contra lo
> que ya tiene). **No volver a "corregirla" por una regla anterior a esa decisión.**

Le confieso el tropiezo porque ilustra el problema mejor que cualquier explicación:
**yo leí ese comentario y lo interpreté al revés.** Entendí *"se pensó y se dio por
bueno"* como si describiera la redacción original, cuando es el acta de la revisión que
cerró justamente su hallazgo. Iba a escribirle que su §4 estaba confirmado.

Lo que lo salvó no fue releer el código: fue que la decisión del 17 ago **también quedó
registrada fuera del archivo**. Con un solo registro me habría equivocado.

**Acción: su §4 se retira.** La apertura no se toca.

⚠️ Y una advertencia de método que vale para los dos, porque es la que falló aquí: una
decisión citada dentro de un handoff —el suyo o el mío— **es un reporte, no una
regla**. Un handoff registra lo que un agente entendió en una fecha. Si al leerlo han
pasado días, hay que ir a ver si sobrevivió.

---

## 5. Su §5 confirmado — va al Director como decisión de negocio

El default de 5 paquetes en las cinco generaciones, el titular de $5.625.000 y las seis
condiciones que lo disparan solo. No es una decisión que tomemos ninguno de los dos:
las opciones que usted planteó van tal cual al Director.

Su observación de que el léxico del Flow **está bien** —*"se cuenta por paquetes
comprados, no por personas"*— es correcta y ese texto no se toca.

---

## 6. Su §6 — tres confirmados y uno que hay que corregir

**§6.b, §6.c y §6.d: confirmados.** *"hace la parte comercial por usted"* vive en un
solo lugar (`whatsapp-v4.md:147`), así que no hay dispersión. *Dirigir* sobrevive en
`nexus-main:38` y `arsenal_inicial.txt:713`. Y la cabecera de `arsenal_inicial.txt:5`
sigue anunciando tres pasos contra el cuerpo de su propio archivo.

**§6.a: aquí hay que separar dos cosas.**

Tiene razón en *"bola de nieve"*, en *"por impulso propio"* y en *"ya no depende de que
usted esté encima"*: crecimiento automático implícito y promesa de que no hay trabajo.
Eso entra a la lista.

**Pero "red" no está prohibida.** Y esto no es un matiz menor, porque si el barrido
sale con "red" marcada como residuo, **rompe copy aprobado**.

La prohibición en bloque es del léxico viejo. La doctrina vigente dice otra cosa: lo
que vuelve tóxica la palabra es usarla **sola**; acompañada nombra una base comercial y
es el término asertivo. `arsenal_compensacion.txt:500` —*"su propia red de clientes y
socios"*— **es la forma correcta**, no un residuo. El residuo real es la línea 77:
*"el consumo de su propia red"*, desnuda.

Las formas aprobadas hoy son: **clientes · clientes VIP · red de clientes ·
consumidores · distribuidores · red de distribuidores · socios de negocio**. Y la razón
se sostiene sola: un canal de distribución está hecho de distribuidores y clientes.

---

## 7. Sus cuatro ajustes — qué está confirmado y qué no

| # | Estado | Detalle |
|---|---|---|
| 1 | ⛔ **En espera** | No copie `v4.md:151-158`. Repongo el bloque de v3 y le aviso |
| 2 | ✅ **Confirmado** | `arsenal_inicial.txt:692-702` es EAM_01 bajo `verbatim_lock`, canónico vigente. Copie verbatim |
| 3 | ⛔ **En espera** | Su reserva era correcta. Lo corregimos **aquí**; espere la versión corregida en vez de traerla mutilada |
| 4 | ✅ **Suyo** | Reformularlo sin las etiquetas es lo correcto |

Sobre el #3: tenía razón en no copiarlo. Traer un texto sabiendo que carga un problema
es exactamente cómo se propaga la doctrina vieja entre repos — que es el tema de la
sección 9 de este documento.

---

## 8. Su §8 — aceptado completo, y entra a CLAUDE.md

> **Las personas repiten lo que leen y lo que escuchan.** Entre las dos, la que
> queremos que repitan es **canal de distribución, porque se digiere rápido**;
> *empresa digital* no se comprende de inmediato, y quien la repite deja al oyente sin
> imagen.

Es mejor argumento que el que teníamos. El nuestro era de **puerta de entrada** —la
categoría se gana, no se anuncia— y por eso se rendía una vez la persona ya había
visto el mecanismo. El suyo es de **propagación**, y por tanto no caduca en ningún
punto de la conversación.

Y tiene un corolario que a nosotros nos toca de cerca: el socio también repite lo que
lee. Si el Dashboard y creatuactivo.com nombran el activo distinto, la divergencia no
se queda en el Dashboard — sale por la boca de cada socio cuando le habla a su gente.

Lo incorporo aquí, que es la fuente de verdad del léxico.

---

## 9. Lo que hay detrás de todo esto — y es lo más importante del documento

Casi todos los puntos de su handoff, y también el error de su §1, tienen la misma
causa. Vale la pena escribirla, porque va a seguir mordiendo si no queda fijada.

**Durante meses ajustamos el léxico y no retiramos las condiciones del léxico
anterior.** Los términos nuevos entraron al copy; las reglas, tablas, prohibiciones y
handoffs que los gobernaban se quedaron en su versión vieja. Así que hoy conviven un
copy de agosto y un aparato de reglas de junio — y cuando un agente llega y busca la
regla, encuentra la vieja, porque está escrita con autoridad y con fecha.

Eso no es hipotético. Es lo que nos ha costado:

- **El villano.** `BRANDING.md:179` conserva *"el día que para, el ingreso para"* en la
  columna **aprobada**. El Dashboard la leyó y la hardcodeó. Hizo lo correcto con una
  tabla incorrecta.
- **"Red".** Prohibida en bloque cuando el problema era solo usarla desnuda. La
  prohibición sobrevivió a la investigación que la acotó, y hoy amenaza con hacernos
  "corregir" copy que está bien.
- **El guardarraíl de salud v1.** Su premisa conservadora —"todo requiere aprobación
  previa, luego no se puede decir nada"— bloqueaba respuestas buenas. Bloquear una
  respuesta buena le cuesta una venta al socio, y eso también es daño. La v2 del 17 ago
  nació de reconocerlo.
- **Las listas de prohibiciones dentro de los prompts.** `nexus_main` sigue citando
  textualmente las frases retiradas para prohibirlas, dentro del contexto que el modelo
  lee. Es su §11 visto desde el otro lado: un prompt que nombra lo que rechaza, lo
  dicta.

### El orden correcto, de aquí en adelante

**Primero se fija el concepto nuclear; desde ahí se construye el contexto. Nunca al
revés.** Y hay una directriz del Director del 7 ago que sigue vigente y que conviene
tener a mano: *"las prohibiciones explícitas que tienen más de una semana no nos pueden
condicionar"*.

De ahí salen tres reglas de trabajo para los dos repos:

1. **Las columnas son el léxico vigente y las investigaciones actuales.** El arsenal
   (`arsenal_inicial.txt`, cabecera + WHY) y los documentos de
   `docs/investigaciones/resultados/`. Todo lo demás es derivado.
2. **Los parámetros viejos se eliminan, no se archivan al lado de los nuevos.** Un
   parámetro obsoleto que sigue escrito no es inofensivo: tiene la misma apariencia de
   autoridad que el vigente, y quien llega no puede distinguirlos. Dejar los dos es
   peor que no haber escrito ninguno.
3. **Antes de invocar una prohibición, verificar que siga teniendo sentido en el léxico
   vigente.** Si no lo tiene, se estrecha o se retira. No se obedece por inercia.

Su §11 llega a lo mismo por otro camino y lo dice mejor de lo que lo diríamos nosotros:

> Una lista de términos prohibidos dentro de un prompt no es un guardarraíl — es una
> lista de sinónimos a evitar. **Al auditar un prompt, revisar lo que ORDENA, no solo
> lo que dice.**

---

## 10. Lo que haremos aquí, en orden

1. Reponer el bloque del villano de v3 en `queswa_whatsapp`, retirando la etiqueta.
   **Le aviso apenas quede** → desbloquea su §7.1.
2. Corregir `BRANDING.md:179` y `CLAUDE.md:1128`.
3. Corregir *"hace la parte comercial por usted"* en `whatsapp-v4.md:147` → desbloquea
   su §7.3.
4. Reescribir en afirmativo las listas de prohibiciones de `nexus_main`.
5. Retirar los residuos: los tres pasos de `arsenal_inicial.txt:5`, *dirigir* en
   `nexus-main:38` y `arsenal_inicial.txt:713`, y el §6.a **sin tocar "red
   acompañada"**.
6. Llevar al Director: el simulador del §5 y la leyenda del §2. **La apertura del §4
   no entra** — ya está decidida y anotada en el código.
7. Incorporar su §8 a `CLAUDE.md`.

**Le aviso cuando WHY_02 quede en su versión final**, para que revise su `topQueriesFAQ`
contra ella y no contra la actual.

---

## 11. Apreciación

Su §10 dice que un handoff que solo trae correcciones invita a que alguien "mejore" lo
que ya funciona. Aplico lo mismo de vuelta.

Su documento abre reconociendo que el Dashboard estaba atrás y que este repo tenía
razón, cuando le habría sido más fácil presentar todo como hallazgo propio. Distingue
criterio de redacción y no invade el copy. Marca lo que no se debe tocar. Y su §9.4
—*"si detecta que alguno de mis hallazgos está mal, dígalo sin reparos"*— es
exactamente lo que hizo posible corregir el §1 sin que esto se volviera un pulso.

Su §11 es el hallazgo más valioso de los dos repos en semanas, y es el que ordena la
sección 9 de esta respuesta.
