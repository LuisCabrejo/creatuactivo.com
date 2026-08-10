# Changelog — Arsenales Queswa

Historial doctrinal de los arsenales (tenant `creatuactivo_marketing` salvo nota explícita). Extraído del cuerpo de CLAUDE.md a partir del 23 May 2026 para reducir overhead de tokens — un agente nuevo solo necesita la versión *actual* + la *previa*; el historial completo vive aquí.

Cada arsenal vive en `knowledge_base/<nombre>.txt`. Deploy:
- Actualizar todo el documento: `node scripts/deploy-arsenal-<nombre>.mjs`
- Solo re-fragmentar cambios puntuales: `node scripts/actualizar-fragmentos-modificados.mjs`
- Fragmentos Master con `<verbatim_lock>` (WHY_01/WHY_02/EAM_01): `node scripts/actualizar-fragmentos-master-v25.7.mjs`
- Cambios específicos al cierre (FREQ_03 + purgar CIERRE_01/02): `node scripts/actualizar-fragmentos-cierre-v5.2.mjs`

---

## arsenal_compensacion

### v7.6 — La unidad del GEN5 es la generación (9 ago 2026)

Lo detectó el Director revisando la prueba del canal: recordaba que el marco desarrollado con el agente anterior era otro. El conteo lo confirmó — **`COMP_GEN5_01` era el único fragmento GEN5 que contaba en niveles**:

```
COMP_GEN5_01     niveles: 3   generaciones: 2   ← el único
COMP_GEN5_03     niveles: 0   generaciones: 2
COMP_GEN5_04     niveles: 0   generaciones: 1
COMP_GEN5_06     niveles: 0   generaciones: 2
```

Más el ejemplo dictado por `route.ts` (*"Generación 1 — 5 paquetes"*) y **la referencia interna del propio COMP_GEN5_01**, que ya decía *generaciones 2 a 4*. El fragmento se contradecía consigo mismo, y es el primero que se entrega sobre el bono: el que fija el marco antes de que lleguen las cifras. En la prueba del 9 ago el prospecto oyó las dos versiones en turnos consecutivos.

⚠️ **No es una traducción a lenguaje llano — es lo contrario.** *Generación* es la nomenclatura del propio plan (GEN5 = cinco generaciones), así que el cambio **restaura** la regla de que la nomenclatura va literal. Y la generación es una unidad **horizontal**: dice quién vino después, no cuánto se baja. La imagen vertical es la del esquema que el prospecto teme, y esta respuesta suele llegar uno o dos turnos después de esa objeción.

⚠️ **El Binario conserva su descriptor.** En `COMP_BIN_08` y `COMP_BIN_10`, *sin límite de profundidad* es el término propio de ese bono y no tiene equivalente en generaciones. Barrer por barrer habría sido el error opuesto. Verificado: 0 apariciones de *niveles de profundidad* en todo el corpus, y las del Binario intactas.

**Trade-off medido, y la decisión.** La cabecera creció ~460 caracteres y eso mueve la recuperación en las dos direcciones:

| Consulta | cabecera larga | recortada |
|---|---|---|
| *"¿Qué es el Bono GEN5?"* (disparador primario) | **0.621 · #1** | 0.505 · #4 |
| *"explícame el Gen5"* | 0.616 · #1 | 0.592 · #1 |
| *"¿cómo se gana rápido?"* | 0.429 · #9 | 0.499 · #3 |

Se conserva la larga: optimiza el fragmento para su propia pregunta primaria. La que pierde la gana `COMP_MODELO_01`, que responde *cómo se gana* y **cierra puenteando al GEN5** — verificado en la conversación real del 9 ago, donde ese puente funcionó.

Cifras, %, CV/PV y tasas INTACTAS.

⚠️ **Anotado, sin tocar:** la REGLA DE ORO de la cabecera del arsenal todavía dice *"Binario=Renta Vitalicia"*. *Renta vitalicia* es promesa de perpetuidad — la regla del 8 ago es que la recompensa se nombra por su **repetición**, no por su duración. Es de cara interna, pero conviene resolverlo en la revisión de `arsenal_compensacion`.

## arsenal_inicial

### v5.69 — Dos eliminadas, dos corregidas, y una lección de despliegue (9 ago 2026)

Auditoría de redundancia pedida por el Director antes de subir el tráfico. Se separó lo que **produce una respuesta mala** de lo que solo produce una respuesta **redundante**, y solo se tocó lo primero: la víspera de multiplicar el tráfico por 25 no es el momento de mover seis fragmentos que funcionan.

**Antes de borrar se midió quién hereda la pregunta**, y la medición cambió el plan en dos de cuatro casos:

| Candidata | Hereda | Decisión |
|---|---|---|
| `FREQ_19` | `DIASPORA_01` 0.572 / 0.471 | ✅ eliminada |
| `CRED_03` | `ADV_OBJ_01` 0.496 · `FREQ_07` 0.481 | ✅ eliminada |
| `CRED_02` | `EMPRESA_DIGITAL_01` 0.481 ⚠️ | ❌ **editada**, no eliminada — lo que heredaba explica qué es un negocio digital, no cuántos años lleva la empresa |
| `FREQ_17` | `COMP_GEN5_01` 0.522 ⚠️ | ❌ **editada** — habría mandado *"¿cómo me pagan?"* a las tablas del plan en vez de al *cada viernes en su cuenta* |

**`FREQ_19` no era redundancia, era contradicción.** Sobre qué pasa al mudarse de país decía que el negocio se actualiza al país nuevo; `DIASPORA_01` dice que **se ancla al país de registro**. La respuesta dependía del azar del vector, en la pregunta que un migrante sí verifica. Manda DIASPORA_01, que es la doctrina confirmada por el Director.

**`CRED_03` se eliminó porque su premisa dejó de ser cierta.** Construía la prueba sobre cómo había llegado el prospecto — sin que nadie lo contactara. El tráfico de esta fase llega **porque un socio le escribe por WhatsApp**, así que la respuesta le afirmaba a la persona algo que ella sabe que no ocurrió, justo donde se pide confianza. La prueba que sí se sostiene —quienes construyeron la herramienta primero construyeron el negocio con ella— ya vivía en `CRED_01`.

**Los disparadores se mudaron, y se verificó que llegaran:** DIASPORA_01 suma *qué pasa si me mudo de país · me voy a vivir a otro país · el negocio se va conmigo* (medido después: 0.572 y **0.537**, mejor que el 0.471 de antes de la mudanza); CRED_01 suma *¿esto realmente funciona? · ¿hay pruebas? · ¿esto sí sirve?*.

**Las dos ediciones quirúrgicas.** `CRED_02` cambia una afirmación sobre la estructura financiera del fabricante —que no podemos sustentar si la piden, del mismo tipo que la retirada en v5.55— por lo verificable, y pierde la negación final que introducía el escenario que quería descartar; de paso el fabricante se nombra por su nombre. Su recuperación subió de competir a 0.481 a ganar con **0.593**. `FREQ_17` deja de enumerar monedas: listarlas le mostraba dólares a un colombiano, que es lo que dispara el reclamo de la tasa atendido por FREQ_27. Ahora gana su propia pregunta con **0.675**.

⚠️ **LA LECCIÓN CARA — borrar en Supabase sin borrar en el `.txt` no sobrevive un despliegue.** `CIERRE_03` y `CIERRE_04` se habían borrado de la base ese mismo día; al re-fragmentar, **el fragmentador los recreó** desde el archivo fuente, con sus enlaces `wa.me` incluidos. Ahora el bloque completo salió del `.txt` y en su lugar queda una nota explicando por qué no debe volver: ese texto es de la máquina de estados de la **web**, el motor ya lo dicta desde `getCierreEstado4()`, y en WhatsApp entregar un `wa.me` a quien ya escribe desde WhatsApp es un círculo — ese cierre lo maneja `wa-radicacion.ts`.

**Estado: 57 → 52 respuestas · 52 fragmentos por tenant, iguales · 0 hits del auditor · 0 fragmentos con `wa.me` · 42/42 en la batería del clasificador, en los dos tenants.**

**Sobre las cabeceras —medido, y va contra la intuición.** El Director notó que se ven exageradas y preguntó si estorban. Son el **39% del corpus indexado**, y las respuestas más trabajadas son las que más cargan: WHY_03 tiene 2.001 caracteres de cabecera para 697 de respuesta (2,9×), WHY_02 2,1×, EAM_01 1,9×; las que nadie ha tocado van en 0,1×. Pero re-embeber los 54 fragmentos **sin** cabecera y volver a medir da: **mejora 0 · empeora 3 · igual 11**, con caídas de hasta 0.107 (*"¿cómo se inicia?"*, que baja del puesto 1 al 3) y 0.062 (*"¿es esto legal?"*). La cabecera trae el vocabulario que la pregunta del prospecto también usa, así que **hace al fragmento encontrable**. No se tocan. Si algún día pesan, lo que se recorta es la parte histórica, no la que describe el concepto.

**Queda para la sesión con calma:** seis redundancias que no producen respuestas malas (`FREQ_23` contenida en FREQ_27 · `CRED_04` casi literal a OBJ_02 · `FREQ_15` que PERFIL_01 dice en su primera línea · `CTA_01` compitiendo con FREQ_03 · `FREQ_24` repartida en tres · `FREQ_04_PUENTE`, que además nunca se indexó), más los 19 cierres de la auditoría de preguntas finales.

### v5.68 — Candado en FREQ_13 y FREQ_08, y la causa real estaba en el enrutamiento (9 ago 2026)

Salió de la prueba de las seis preguntas en el canal, la primera antes de subir el tráfico de 4 a 50–100 personas. **Pasaron 2 de 6.** El diagnóstico obligó a mirar el motor, no el copy.

**Lo primero: la prueba se corrió sobre un número contaminado.** Entró por `wa_573203415438` —el número personal del Director—, que ya tenía 17 turnos desde el 8 ago. Dos consecuencias que invalidan parte de lo medido:

- El nodo 1.5 del webhook solo dispara `if (!existingProspect)`, así que **`construirApertura()` nunca corrió** y el modelo improvisó el saludo. El recorrido real de un prospecto nuevo —apertura dictada + tres botones— quedó **sin probar**.
- La respuesta 1 se leyó a las 20:41; el clon de v5.67 al tenant `whatsapp` entró a las 20:51. La cifra vieja de países que apareció ahí es un **falso negativo**: se corrigió sola diez minutos después.

**La causa de las tres fallas reales no era el arsenal.** El clasificador de `route.ts` corre **antes** que Voyage y lo cortocircuita: el vector solo opina si ningún regex dispara. Medido con Voyage sobre el corpus del tenant `whatsapp`, el fragmento correcto gana con holgura en los tres casos — **FREQ_13 0.493 · FREQ_03 0.618 · FREQ_08 0.539**, todos sobre el umbral de 0.4. Nunca fueron candidatos:

| Pregunta | Enrutaba a | Por qué |
|---|---|---|
| ¿Esto es una pirámide? | `arsenal_avanzado` | `/es.*pirámide/i` vivía en `patrones_manejo`, y **`esManejo` VETA a `esInicial`** en el retorno |
| ¿Cuánto cuesta empezar? | `arsenal_compensacion` | `empezar` estaba dentro de tres regex de precio; disparaba el pin de cifras GEN5 |
| ¿Hay capacitación? | `null` → vector | Sin regex; el vector tampoco pudo (ver abajo) |

⚠️ **HALLAZGO MAYOR — el clasificador vectorial no puede devolver `arsenal_inicial`, para ninguna consulta.** `clasificarDocumentoVectorial()` compara contra los documentos **padre** vía `getDocumentsWithEmbeddings()`, y el padre de `arsenal_inicial` es **el único de los cinco sin `embedding_512`** en la base, en los dos tenants. Carga 3 documentos, no 4. Con 124.017 caracteres es también el más grande con diferencia (el resto va de 20K a 54K), que es la explicación probable de que el embedding nunca se generara. Consecuencia operativa: **todo lo que deba llegar al arsenal principal entra por patrón; el vector no es red de respaldo, es un camino cerrado.** El `FIX 2026-07-09` de `INVERSION_MARKETING_01` ya había chocado con la misma pared y la parchó con regex sin nombrar la causa.

**La corrección de fondo se hizo el mismo día**, con el Director decidiendo postergar los contactos antes que salir con esto a medias. `clasificarDocumentoVectorial()` pasa a clasificar sobre **fragmentos** y a mapear el ganador a su arsenal padre por prefijo más largo, con alcance por tenant (`getArsenalFragments()` no filtra por tenant, así que sin eso una consulta de creatuactivo competía contra los fragmentos de ganocafe y marca personal). Se midieron **top-1 contra voto entre los primeros 3 y 5: votar EMPEORA** (24 aciertos contra 22 y 21) — el fragmento correcto gana limpio, pero sus vecinos suelen ser de otro arsenal y diluyen el voto. Umbral sin cambio en 0.40.

**Y `patrones_manejo` quedó vacío a propósito.** Enrutaba a `arsenal_avanzado` por la consolidación de los arsenales `manejo` y `cierre`, pero 7 de sus 9 destinos viven hoy en `arsenal_inicial` (OBJ_01, PERFIL_01, FREQ_18, FREQ_17, FREQ_19, FREQ_08, FREQ_13/NET_01). Hacía daño doble: enrutaba mal **y** `esManejo` VETA a `esInicial` en el retorno, así que esas preguntas no podían llegar a inicial ni aunque `patrones_inicial` las reconociera. Medido: con el array 30/42, sin él 37/42. ⚠️ `patrones_cierre` **sí hace trabajo útil y se conserva** — quitarlo baja a 32/42; solo se le sumó a `patrones_compensacion` la nomenclatura del plan (*binario · GCV · CV · PV · volumen comisional*), que vivía solo allá y terminaba en avanzado cuando sus respuestas están en compensación.

Marcador final, **42/42 en los dos tenants, 0 `null`**, con `node scripts/benchmark-clasificador.mjs`. Dos de las 42 no llevan expectativa porque el clasificador nunca las ve: el chip 1 lo intercepta Camino A y *"quiero iniciar"* lo intercepta `wa-radicacion`. Y una etiqueta se corrigió **a favor del motor**: *"¿puedo pausar?"* iba a `arsenal_avanzado` y yo lo daba por error, hasta ver que `ADV_TECH_01` se titula exactamente *"¿Puedo pausar mi negocio si me enfermo o viajo?"*.

**Lo que sí se cambió, en `route.ts`:** `empezar` sale de `patrones_compensacion` y de las dos entradas de `patrones_paquetes`; `/es.*pirámide/i` sale de `patrones_manejo`; y `patrones_inicial` suma pirámide/esquema piramidal, cuánto cuesta empezar, y capacitación/formación/entrenamiento/me enseñan. Verificado con una simulación del orden de prioridades sobre los arrays reales del archivo: **6 de 6 enrutan a `arsenal_inicial`, 0 regresiones** en paquetes, GEN5, catálogo, 12 niveles y "cómo funciona el negocio".

**En el arsenal:** FREQ_13 y FREQ_08 pasan a `<verbatim_lock>`. Las dos se entregaban parafraseadas y los hechos institucionales **largos** —el número de la ley, las nueve ciudades, el gremio, el nombre de la sección de formación— se normalizaban hacia formulaciones de manual que ningún arsenal contiene. Mismo comportamiento que el candado erradicó en `catalogo_productos` v7.2 con los nombres de producto. El texto no cambia una palabra; sale el rótulo *Pregunta de seguimiento* de FREQ_13, que dentro de un candado se imprimiría literal al prospecto. 1.865 → 1.869 y 2.106 → 2.139 caracteres (solo las etiquetas). El prompt `queswa_whatsapp` v4.7 ya trae la regla del candado, verificado antes de aplicarlo.

**`CIERRE_03` y `CIERRE_04` retirados del tenant `whatsapp`** — texto de la FSM web con `wa.me/573206805737` incrustado y el rótulo *Equipo Directivo*, que el barrido de v5.59 no alcanzó. ⚠️ **Divergencia deliberada entre tenants: 56 fragmentos en `creatuactivo_marketing`, 54 en `whatsapp`.** No es un despliegue a medias — no re-clonar. ⚠️ **Y es insuficiente por sí sola:** `getArsenalFragments()` carga fragmentos **sin filtro de tenant** y filtra después por prefijo de `category`, así que la copia de `creatuactivo_marketing` sigue siendo candidata en una conversación de WhatsApp. Retirarlas de los dos tenants queda pendiente de decisión del Director.

**Pendientes anotados:** `FREQ_04_PUENTE` está en el `.txt` y **nunca se indexó** (56 fragmentos para 57 respuestas) · el padre `arsenal_inicial` se titula *"Arsenal Inicial vunknown PEAJE"*, señal de que `deploy-arsenal-inicial.mjs` no parsea la versión · `getDocumentsWithEmbeddings()` tiene `tenant_id='creatuactivo_marketing'` **hardcodeado**.

### v5.34 — Barrido pregunta única + bautizo empresarial (7 ago 2026)

Barrido transversal aprobado por el Director (afectó también avanzado v12.6, compensación v7.4, 12-niveles v5.2, catálogo v7.3). Tres frentes:

1. **Pregunta única (27 reescritas en total; 20 aquí).** Toda pregunta de cierre con dos salidas ("¿le muestro A, o B?") pasó a UNA — el lector retiene la última opción, responde "sí" pensando en la otra, y repreguntar convierte el avance en trámite. La pregunta ahora **propone la continuación natural de lo explicado**, no encuesta. Incluye 5 locks sin sync TS (WHY_01, ACTIVACION_01, FREQ_04, FREQ_04_PUENTE, CLIENTE_VIP_01). FREQ_15 además dejó de preguntar cuánto tiempo tiene (plantaba "esto es más trabajo" — [[feedback_nunca_preguntar_tiempo_disponible]]) → ofrece mostrar un día normal.
2. **Bautizo empresarial** ([[feedback_vocabulario_empresarial]]): quienes componen la estructura → **clientes · socios** (FREQ_01/06/10/11/13/14/21, CRED_02/04, EAM_02, NET_01). Excepciones intactas: a quién atiende Queswa, consumo de mercado, villano narrado, disparadores con las palabras del prospecto.
3. **Negaciones que invocaban el fantasma:** FREQ_11 ("¿cómo se genera el dinero?") decía *"La empresa no le paga por meter personas"* ante alguien que NO mencionó pirámides → ahora afirma: *"le paga por una sola cosa: el producto que se mueve"*. FREQ_13/FREQ_20 conservan su negación porque ahí el prospecto SÍ trajo la pregunta. FREQ_02 reescrita completa: "personas" → **interesados**, "la empresa digital ya está armada" → "el negocio ya está armado".

**Del deploy:** se reparó el fragmentador (`'catalogo_productos'` llevaba tiempo pegado DENTRO de un comentario del array → el catálogo no se re-fragmentaba; y el regex no aceptaba `PROD_OVERVIEW`, que solo existía por un insert manual — ahora ambos son reproducibles). El padre de `arsenal_avanzado` tenía `is_fragment: true` en metadata (habría contaminado `match_fragments_512` con 20K chars) → corregido. Ambos tenants quedaron idénticos: 59+18+38+13+24 = 152 fragments.

### v5.33 — WHY_04: la respuesta del dinero tiene candado (7 ago 2026)

**El problema:** la mejor explicación del dinero que teníamos vivía **hardcodeada en `wa-apertura.ts`** y solo se alcanzaba tocando el botón de la apertura — un botón que aparece una vez, en el primer mensaje. Quien escribiera *"¿de dónde sale la plata?"* con sus palabras nunca la veía: la búsqueda lo mandaba a WHY_02 o a un FREQ. Ahora es **WHY_04**, con los dos caminos (chip/regex → `MASTER_DINERO_01`, y vector search → fragmento con `<verbatim_lock>`).

**Y el problema que destapó:** al reescribir WHY_02 (v5.32) las dos respuestas quedaron casi idénticas — *"usted arma un canal de distribución y lo dirige desde el celular: ni inventario, ni entregas"* contra *"usted dirige su propio canal de distribución desde el celular, sin comprar inventario ni entregar pedidos"*, más Gano/30 años/70 países, más el porcentaje, más el viernes, más el café que se acaba. Son los dos botones que más se tocan; quien toca los dos leía lo mismo dos veces.

**División de trabajo, ahora explícita en ambos [Concepto Nuclear]:** WHY_02 explica el **modelo** (apalancamiento · ecuación · ciclo · reparto del trabajo). WHY_04 responde la **transacción** (qué se vende, a quién, quién paga, cuándo llega). Por eso WHY_02 dice "el producto que se mueve por su canal" sin desglosar: el desglose *al detal / paquetes empresariales* vive en WHY_04 — y ahí gana precisión, porque ahora dice **a quién** se le vende cada uno (a quien solo quiere consumirlo · a quien arranca su propio canal).

Dos correcciones doctrinales en el texto:
- **Gano Excel va al final y como quien CONSIGNA, no como la fuente.** El dinero sale del producto que se vende por el canal del prospecto; invertir ese orden dispara el fantasma del multinivel ([[feedback_gano_respaldo_no_titular]]).
- **Fuera *"No es humo en la nube"***: violaba nuestra propia regla de que el candado de confianza **se afirma, nunca se niega** — nombrar el elefante lo invoca. Lo reemplaza el ancla física: *"Producto que sale de una fábrica y llega a una dirección; plata que sale de una empresa de 30 años y llega a su banco."*

⚠️ La regex `RE_DE_DONDE_SALE_EL_DINERO` **no captura "cómo se gana" a secas** a propósito: esa es la pregunta por las cifras del plan y le corresponde a `arsenal_compensacion`.

### v5.32 — WHY_02 como ecuación (6 ago 2026)

Sesión Director + Gemini sobre el transcript real del canal. **De 1.353 a 921 caracteres**: dos mensajes en vez de tres, con la pregunta a la vista. Sincronizado carácter por carácter con `MASTER_WHY_02`; purgado, re-embebido y clonado al tenant whatsapp.

Seis decisiones, en orden de importancia:

1. **El mecanismo es un sustantivo, no una categoría.** *"El producto que se mueve por su canal"*, no *"las ventas"*. "Ventas" obliga al prospecto a imaginarse **a él vendiendo** justo en el párrafo donde está midiendo si esto es para él. No niega que haya venta (eso sería mentir); el desglose *"producto al detal o paquetes empresariales"* vive en la respuesta hermana del botón "De dónde sale el dinero" — repetirlo aquí interrumpe la ecuación.
2. **La recompra es un ciclo con la cadencia del villano invertida.** *"Se consume, se acaba, se vuelve a pedir"* contra *"trabajar, pagar cuentas y repetir"* (STORY_03): tres tiempos, misma métrica, sentido contrario. Impersonal a propósito — el producto hace el ciclo, no la gente (ver [[feedback_ejemplos_compras_no_personas]]).
3. **Dos regresiones retiradas de la misma oración:** *"deja de depender de sus horas"* (al latino trabajar no le duele — el villano es la dependencia, ver [[feedback_horas_no_son_el_villano]]) y *"cuántas personas ya están consumiendo"* (contaba cabezas).
4. **El viernes se movió al cierre.** Arriba solo informaba; al final, después de "compartir", es la **recompensa de haber compartido**. La cuenta bancaria sigue siendo el candado anti-nube, ahora en el remate.
5. **Sin meta-frase de apertura.** *"Le respondo con el dinero primero, que es lo que uno de verdad se está preguntando"* le avisaba al prospecto que le íbamos a manejar la conversación. El dinero sigue llegando en el segundo párrafo, sin anunciarlo. Abre con saludo: un texto que entra en frío se lee como manual.
6. **Elevación por apalancamiento, no por adjetivos:** *"Usted no arranca desde cero: se apoya en una operación de 30 años que ya funciona en 70 países"*. Y el cierre cambia el vacío *"lo suyo es dirigir"* por **dos verbos contables** — el alivio viene de poder contar lo que queda por hacer.

⚠️ Efecto colateral aceptado: la bienvenida humana (*"recibir al que ya dijo que sí"*) sale de WHY_02 y queda solo en EAM_01, que es donde vive el día a día.

### v5.31 — EAM_01 en formato WhatsApp (6 ago 2026)

Decisión del Director tras auditar la primera conversación real por el canal: **la mayor parte de la comunicación es por WhatsApp**, y el orbe del sitio se va a reemplazar por WhatsApp, así que **las respuestas se calibran para WhatsApp en todas partes**. La excepción es el Dashboard (`queswa.app`), donde sí se quieren respuestas largas porque es el espacio de formación de los empresarios — y no le afecta: tiene tenant propio (`dashboard`, con `arsenal_cierre` + `arsenal_manejo`) y no lee `arsenal_inicial`.

**EAM_01**: de 1.350 a **818 caracteres**. Los tres movimientos pasan a nombrarse por el Tridente —**Comparte · Recibe · Multiplica**— en vez de "Usted comparte / Yo me encargo del resto / Usted pone lo humano". El tercero **no existía**: la respuesta describía dos movimientos del héroe y uno de Queswa, y la Multiplicación —el 3er Comando— quedaba fuera de la única respuesta que explica el día a día. Se retira además *"le llega la misma empresa digital"* (bautizo diferido a la Academia, ver [[feedback_bautizo_empresa_digital_diferido]]) → *"recibe lo mismo que usted tiene, ya montado"*. Sincronizado carácter por carácter con `MASTER_EAM_01`; fragmento purgado, re-embebido y re-clonado al tenant whatsapp.

⚠️ El formato Markdown ya **no se instruye, se traduce**: `src/lib/wa-formato.ts` convierte tablas, `**` y viñetas en la capa de canal. Los arsenales pueden seguir escribiéndose en Markdown.

### v5.30 — Método renombrado en el encabezado (2 ago 2026)

Línea Estrategia del doc padre: "(Comando Expandir · Activar · Multiplicación)" → **"(Compartir · Recibir · Multiplicar)"** — propagación del rename de servilleta v6.5. Solo doc padre (ningún fragmento contenía los nombres viejos; EAM_01 ya narraba los movimientos sin nombres). Padre re-desplegado + re-clonado al tenant whatsapp.

### v5.29 — Barrido del villano viejo (2 ago 2026)

Cierre de los pendientes del `docs/handoff/queswa/HANDOFF_LEXICO_MOTOR_AGO2026.md` §3.2 y §3.3. (1) **WHY_02**: *"cuánta gente ya está consumiendo"* → **"cuántas personas ya están consumiendo"** (registro vetado, ver [[feedback_evitar_gente_despectivo]]; se coló en la redacción del 31 jul y llegó a producción). El `<verbatim_lock>` pasa de 1349 a 1354 chars, sincronizado carácter por carácter con `MASTER_WHY_02` en `respuestas-maestras.ts`. (2) **STORY_01**: retirada la etiqueta *"un sistema diseñado para la asfixia mensual, no para construir verdadera soberanía financiera"* — villano etiquetado + "asfixia mensual" no es universal + "soberanía financiera" fuera del lema. Ahora narrado con el trancón 1 (*"la plata llegaba y al día siguiente ya tenía dueño"*) y el ancla del patrimonio concreto (*"nada de eso dejaba algo construido a su nombre"*). (3) Barrido verificado en `arsenal_avanzado`, `arsenal_12_niveles`, `arsenal_compensacion` y `catalogo_productos`: sin más ocurrencias de "mejores años", "consecuencia matemática" o "asfixia" de cara al prospecto. Sincroniza con system prompt **v29.4**.

### v5.28 — Lenguaje concreto: WHY_01, WHY_02 y EMPRESA_DIGITAL_01 (31 jul 2026)

Origen: dato de campo del Director tras dos meses de conversaciones 1-a-1 — *"nadie parece entender el concepto empresa digital, nadie me ha dicho sí wooow"*. Tres pasadas de investigación independientes (dos Gemini, una Claude Code) coincidieron: la categoría es abstracta y el prospecto rellena el vacío con pirámides, cripto o cursos — la misma causa por la que el propio modelo alucinaba infoproductos.

(1) **WHY_02** (>50% de las primeras preguntas) ahora dice **de dónde sale la plata en el segundo párrafo** — ventas de producto y de paquetes empresariales → un porcentaje → cuenta bancaria cada viernes — y explica la recurrencia con el café que se acaba. La arquitectura baja al final, reducida a **dos fuerzas** (quien fabrica · quien atiende); el método pasa a EAM_01. Se retiran la apertura por apalancamiento, la definición de "empresa digital", la analogía Amazon/MercadoLibre y la figura del "puente".
(2) **WHY_01** responde *qué hacemos* con sustantivos concretos (negocio de distribución de café y suplementos · celular · inteligencia artificial) y el *por qué ahora* en clave de lo que cambió en el mundo, no de lo que anda mal en la vida del prospecto. Se retira el diagnóstico "un sistema que le toma sus mejores años y su salud" (victimiza, roza retórica ideológica, activa reactancia). **"Empresa de tecnología" se conserva** deliberadamente contra la propuesta de cambiarla por "ecosistema/plataforma": es la palabra llana, la misma que usó Nubank ("somos una empresa de tecnología… no un banco").
(3) **EMPRESA_DIGITAL_01** abría con *"funciona sobre internet, **no sobre activos físicos**"*, que contradice de frente el candado de confianza de WHY_02 y ubica el negocio del lado de "la nube" — el patrón que el prospecto reconoce como fraude. Ahora aterriza: lo digital es la forma de dirigirlo; lo que se mueve es físico. El candado **se afirma, nunca se niega**.
(4) **El bautizo de la categoría sale del primer contacto.** Las categorías se ganan, no se anuncian: Nubank nunca le pidió a un cliente entender "neobanco" — el término lo pusieron los analistas años después. "Empresa digital" sigue vivo a nivel de marca, manifiesto y flujo de cierre.

57 fragments. Desplegado + re-fragmentado (Voyage) + purgado y clonado al tenant whatsapp. Sincroniza con system prompt **v29.3**. Base: `docs/handoff/negocio/HANDOFF_HOOK_Y_LENGUAJE_CONCRETO_JUL2026.md` + `docs/investigaciones/posicionamiento-categoria/`.

### v5.27 — Cliente Preferencial: rename + fragmento de cara al cliente (26 jul 2026)

(1) **"Consumidor VIP" → "Cliente VIP"** en todo el arsenal (24 ocurrencias) + `arsenal_compensacion` — decisión Luis: *cliente* es mejor que *consumidor*. "Cliente Preferencial" queda como sinónimo pleno, declarado en FREQ_22 y en los triggers. (2) **Fragmento nuevo CLIENTE_VIP_01** (`<verbatim_lock>`, tras FREQ_22): responde *"yo solo quiero el producto, no el negocio"* **de cara al cliente**, con cifras — precio sugerido $147.900 vs $110.900 de distribuidor = $37.000 por caja, 25% de ahorro, ~$1.776.000 al año para quien toma un café diario; acceso con compra inicial de 50 PV acompañada por el patrocinador; sin cuota mensual ni obligación de mover producto. Cierra dos huecos: el 25% no existía en ningún fragmento, y FREQ_22 respondía esa pregunta **desde el ángulo del Propietario** ("usted percibe regalías por el consumo de cada Cliente VIP") — al prospecto que preguntaba por el precio se le explicaba cómo otro gana con él.

### v5.26 — INVERSION_MARKETING_01 (9 jul 2026)

Fragmento nuevo para *"me dijeron que me pueden ayudar con marketing / invierten en marketing para armar la estructura"*. Cubre una oferta 1-a-1 no pública (Luis apoya con marketing casos puntuales para acelerar uno de sus dos lados de estructura): Queswa **confirma que existe** sin explicar mecánica, cifras ni por qué es selectiva, y remite al equipo de creatuactivo.com. Cierra el hueco donde la consulta caía en FREQ_03/FREQ_04 por colisión semántica con "inversión" y el modelo llegó a **negar que la oferta existiera**. `<verbatim_lock>`, tras FREQ_02. Ver [[project_inversion_marketing_selectiva]].

### v5.25 — Historia de la mesa + resolver de raíz (4 jul 2026)

Cobertura para las 2 historias de Instagram que promueven el reel Home (auditoría anti-alucinación — el CTA de ambas es "pregúntele a Queswa"). (1) **STORY_02**: la historia de la mesa en dos patas (evento de liderazgo en Mocoa, ~300 personas) — canónica y atribuida a Luis, con instrucción de NO inventar detalles adicionales; puentea al "¿cómo lo armo? ¿qué piezas necesito?" → las 3 cosas. (2) **FREQ_28**: "resolver el tema financiero de raíz" = estructura (ingresos que no dependen de su presencia), no acumulación ni paños de agua tibia; mapea "ideas y herramientas exactas" a fabricante/plataforma/método; **GUARD diciembre**: la "meta a diciembre" es meta personal de Luis — NO existe fecha de lanzamiento/cierre (cupos, no calendario), NUNCA mencionar fecha. 53→55 fragments; clonado al tenant whatsapp (solo inserción de categorías nuevas, sin purga).

### v5.24 — Tríada sin pronombre ambiguo (3 jul 2026)

WHY_02: "la idea es simple" → "la regla es sencilla"; "Alguien **la** fabrica / Algo **la** atiende" → **"Alguien fabrica / Una plataforma atiende a las personas"** (el pronombre era ambiguo — nadie "fabrica" una empresa; "una plataforma" mapea limpio con Queswa). Sync char-by-char con `MASTER_WHY_02`. Desplegado + re-fragmentado + clonado a whatsapp, incluyendo todo lo pendiente desde v5.20. *(Marco retirado en v5.28.)*

### v5.23 — WHY_02 a primeros principios + bisagra "se usa, no se entra" (30 jun 2026)

"Tres fuerzas que trabajan a su favor" → primeros principios en columna (*"tres cosas tienen que ser ciertas…"*, apilado con líneas en blanco porque el widget usa ReactMarkdown+remarkGfm y colapsa el salto simple). Bisagra **"Usted no entra a Gano Excel; Gano Excel trabaja para usted"**. Cierre "el trabajo pesado corre por cuenta de sus socios" → "Lo pesado ya está resuelto" ("sus socios" como sujeto suelto lee MLM). Labels "socio de infraestructura/de tecnología" → **"socio logístico y financiero / socio digital"**. WHY_01: "le entregamos el control" → "usted toma el control" (voz fundador). Ver [[feedback_gano_socio_primeros_principios]]. *(La tríada se retira como apertura canónica en v5.28.)*

### v5.22 — WHY_01 por ritmo (Puig) + purga del aforismo "Usted no explica" (29 jun 2026)

WHY_01: apertura que responde "qué es" (definición Waze), viñetas → prosa enumerada, sin guiones de freno. **Aforismo "Usted no explica — Queswa explica" retirado de TODA superficie viva** (arsenales, system prompt, home, servilleta); slot EXPANDIR → "Usted comparte; su alcance se vuelve masivo". Ver [[feedback_usted_no_explica_retirar]].

### v5.21 — WHY_02 por ritmo (Puig) desde el guion del reel Home (29 jun 2026)

Narrativa fluida en prosa enumerada, apertura cálida, apalancamiento como concepto-ancla, promesa completa "explico, atiendo y maduro". Retirados: el aforismo "Usted no explica" (al latino le gusta hablar), "a su escala", y la línea del ingreso "consumo se repite… recibe una parte" (se adelantaba al CTA de números y rozaba el fantasma MLM). Doctrina: [[feedback_ritmo_narrativo_puig]].

### v5.20 — Reframe socios / tres fuerzas estratégicas (28 jun 2026)

"Tres pilares / tres partes" → **tres fuerzas que trabajan para usted**, con dirección del poder explícita ("de su lado", "a su favor") → resuelve el colapso "¡ahh, es meterse a Gano!". Gano y Queswa pasan a **socio logístico y financiero** / **socio digital**. "Sistema" → "puente" en WHY_02 (el villano no se reusa en positivo). Barrido de TODOS los "(el Pilar 1/2)" residuales en CRED/FREQ/OBJ/VOICE — cero "Pilar" de cara al prospecto (decisión Director 28 jun: socios reemplaza pilares aunque tenga toque MLM, excepción aceptada). "Ingresos recurrentes" → "ingresos una y otra vez" (test abuela).

### v5.19 — Promesa Queswa: "guía" → "madura" (25 jun 2026)

WHY_01/WHY_02 + EAM_01 → *"madura en cada interesado la decisión de avanzar"*: el objeto es **la decisión**, no la persona → activo sin presionar. **Regla del espejo:** en CTA o interpelación al lector NO se usa verbo sobre *su* decisión (expone la persuasión); el verbo solo describe lo que Queswa hace con los prospectos del usuario. La calidez humana conserva "acompaña". Ver [[feedback_promesa_canonica_queswa]].

### v5.18 — EMPRESA_DIGITAL_01 a Camino A + "sistema" → "puente" (23 jun 2026)

Bug de recuperación: *"¿qué es una empresa digital?"* traía WHY_01 por similitud vectorial y el modelo sintetizaba pilares. Se sirve verbatim por **Camino A** (regex en `respuestas-maestras.ts`, tras el match exacto de chips) → $0 tokens. "Sistema" evitado en positivo por ser el villano.

### v5.17 — Fragmento EMPRESA_DIGITAL_01 + WHY_01 pulido (22 jun 2026)

EMPRESA_DIGITAL_01 responde la pregunta directa que el encuadre "empresa digital" dispara, con definición accesible y puente a "en el caso de CreaTuActivo". WHY_01: "monetiza" → "produce ingresos de", "protocolo paso a paso" → "paso a paso exacto", retirado el rótulo clínico "Pregunta de seguimiento". *(Ambos reescritos en v5.28.)*

### v5.16 — WHY_02 + EAM_01 al norte "empresa digital" + chips nuevos (22 jun 2026)

Chips 1 y 2 reescritos para empatizar con el pensamiento real: *"¿Y esto cómo funciona, exactamente?"* · *"¿Cómo lo haría yo? ¿Qué hago en el día a día?"* (sincronizados en `queswa-greeting.ts` + `respuestas-maestras.ts`). WHY_02 presenta los 3 pilares como **alivio** y nombra a Gano con orgullo (respaldo, **NUNCA titular del ingreso** — retirada la cláusula "ingresos cada vez que consumen productos Gano Excel"). EAM_01 alivia los miedos del "qué hago": minutos, no vender, no andar detrás de nadie, no responder a medianoche.

### v5.15 — Calidez en Activar + diagnóstico retirado (jun 2026)

"Usted revisa / da el sí" → *"cuando alguien ya decidió, usted lo recibe — la calidez que solo un humano puede dar"* (nadie audita). **CTA_01** deja de ofrecer el Diagnóstico de 5 Días → "una conversación sin compromiso, de persona a persona" (la Home lo desconectó como gancho).

### v5.14 — ACTIVACION_01 (19 jun 2026)

Fragmento nuevo para *"cómo se activa mi empresa digital"*: proceso de arranque concreto en `<verbatim_lock>` — capitalización → paquete en oficina Gano o a domicilio → formulario sencillo con cuenta bancaria → Centro de Mando activo de inmediato → acompañamiento del equipo por llamada. Cierra el vacío donde el modelo improvisaba con los 3 Comandos. Trigger de FREQ_03 limpiado para que no compitan.

### v5.13 — EAM_01 cierre humano (17 jun 2026)

Rol del héroe = recibir de persona a persona a quien decidió avanzar: calidez/confianza/apretón de manos. Nadie audita — ni Queswa ni el constructor. Cierra el giro de "filtro/auditoría" hacia un cierre humano. Sincronizado carácter por carácter con `respuestas-maestras.ts` (EAM_01). Alineado con system prompt v28.5.

### v5.12 — EAM_01 simple + "filtrar" desterrado + Maestría→Multiplicación (17 jun 2026)

(1) **EAM_01 versión simple**: 3 pasos Expandir/Activar/Multiplicación, Activar = conversión, sin la lista "no requiere" ni el "Protocolo de Validación". (2) **"filtrar" desterrado** → conversar/acompañar/reconocer quién está listo (reencuadre a conversión, ver [[feedback_filtrar_prohibido]]). (3) **3er Comando Maestría → Multiplicación** (ver [[project_rename_maestria_multiplicacion]]). WHY_02 + EAM_01 re-sincronizados carácter por carácter con `respuestas-maestras.ts`.

### v5.11 — Villano = el sistema que toma sus mejores años y su salud (13 jun 2026)

Reubica el villano de WHY_01 y WHY_02. "Asfixia mensual" NO es universal (hay quien está mal económicamente pero se siente relajado); el villano más potente e identificable (12 años de campo de Luis) es **un sistema diseñado para tomar sus mejores años y su salud a cambio de casi nada**. Antítesis deliberada: usted *entrega* sus años/salud / el sistema los *toma*.

- **WHY_02:** "sistema diseñado para la asfixia mensual, no para crear independencia financiera" → "…para tomar sus mejores años y su salud, no para darle seguridad financiera". Chip sincronizado (`respuestas-maestras.ts`).
- **WHY_01:** se retira el villano de **ausencia + patrimonio** ("un mes que no pueda trabajar… sus bienes más del banco que suyos") — doble problema: futuro/ausencia (cabeza del americano) + "patrimonio" que el latino ya cree tener. Reemplazo: "vive dentro de un sistema diseñado para tomar sus mejores años y su salud, sin devolverle nunca verdadera seguridad financiera".

Alineado con system prompt v28.3 (sección EL VILLANO) + servilleta Slide 1 + reel Home. Ver [[feedback_villano_anos_salud]]. ⏳ Pendiente: STORY_01 y Manifiesto aún citan "asfixia mensual".

### v5.10 — Villano narrado sin atacar el esfuerzo: WHY_01 + WHY_02 (12 jun 2026)

WHY_02 (chip 1) y WHY_01 reescritos para reubicar el villano. Fundamento: investigaciones `El Statu Quo_ Anatomía y Escape` + `Léxico CreaTuActivo_ Comprensión y Duplicabilidad` — atacar la "dependencia del trabajo" / la presencia obligada genera disonancia en el latino promedio, que valora su empleo como digno. El villano correcto es el **sistema de asfixia mensual** (vejez sin pensión, edadismo, deuda), narrado sin etiqueta abstracta.

- **WHY_02**: abre con reencuadre ("destapemos el verdadero problema") + reconocimiento del esfuerzo ("Usted trabaja duro, entrega sus mejores años y su salud"). Nombra Gano Excel + productos + "toda América" + "dirige desde su celular". Pilares presentados como alivio entregado (infraestructura/tecnología/método ya construidos). Se eliminó el villano "depende de su presencia". Léxico: "Operar" → "Llevar" (regla operar/operador).
- **WHY_01**: apertura reconoce el esfuerzo antes de la vulnerabilidad ("Usted ha trabajado duro y ha hecho las cosas bien. Aun así…"); "ingresos que no dependen de su trabajo físico" → "que siguen produciendo aunque usted no esté presente".

Sincronizado carácter por carácter con `src/lib/respuestas-maestras.ts` (MASTER_WHY_02). ⏳ Deploy a Supabase + re-fragmentar pendiente.

### v5.9 — Swap "empresa digital" (12 jun 2026)

El activo que entregamos: "negocio digital" → **"empresa digital"** (decisión Luis, alineado con Home v13.6 — eleva el estatus de propiedad). Concordancias de género corregidas. Se conserva "negocio" en el chip canónico ("¿Cómo funciona el negocio?"), en el negocio actual del prospecto y en "Centro de Negocios" (Binario). WHY_02 re-sincronizado con `respuestas-maestras.ts`.

### v5.8 — Swap léxico "negocio digital" (jun 2026, HANDOFF_AGENTE_LEXICO_ARSENALES.md)

"Base Operativa" → **"negocio digital"** (a secas — NO "de Gano Excel": la corona es de CreaTuActivo; Gano Excel solo se nombra como Respaldo Operativo / Pilar 1). Rol "Propietario de Base Operativa" → "Propietario". `operar/operador` del usuario/sistema → dirige/funciona/trabaja (se conserva "opera" de Gano Excel). `escalar` → **multiplicar** (incl. aforismo "Queswa multiplica"). Conservado: lema de Luis "soberanía financiera" en STORY_01. 48 fragments.

### v5.7 — Recalibración a Registro Accesible (Beto) (jun 2026)

WHY_01, WHY_02 y EAM_01 reescritos al léxico accesible: "Estructura Patrimonial" → estructura de ingresos recurrentes · "La Matriz Física" → El Respaldo Operativo · "El Tridente EAM" → El Método Comprobado · "Arquitecto de Patrimonio" → Propietario. WHY_01 con concepto nuclear modelo Waze + vulnerabilidad en autopersuasión ("un mes que no pueda trabajar, un despido… y en cuestión de meses sus bienes son más del banco que suyos"). Villano narrado sin etiqueta (NuBank). Camino A sincronizado.

### v5.6 / v5.6.1 — 4 nuevas FREQ + 2 nuevas COMP (tasa Gano, VIP, familia, back office, inscripción, 50 PV) (29 May 2026)

Causa: meta-auditoría del chat real identificó 7 gaps prioritarios. 4 aplicados en arsenal_inicial + 2 en arsenal_compensacion. Un pendiente (COMP_CV_02 sobre PVP) descartado tras audit — PV/CV/GCV ya cubiertos por COMP_PV_01/04/05 + COMP_CV_01.

**Nuevas respuestas en arsenal_inicial:**
- **FREQ_23** *"¿A qué tasa me paga Gano Excel?"* — tasa FIJA $4,500 COP/USD vigente independiente de TRM. Cierra malentendido "$1,000 USD a tasa de mercado = $3,631,020 COP" — la realidad es $4,500,000 COP. Ventaja estructural en contextos de devaluación.
- **FREQ_24** *"¿Cómo inscribo un Consumidor VIP?"* — proceso idéntico a Arquitecto. Documentos (ID/email/dirección/contacto). Canales (línea CO 018000 184266 / fija (601) 742 3399 / oficinas / back office). Formulario físico con presentador o digital enviado al correo tras finiquitar pago.
- **FREQ_25** *"¿El consumo familiar cuenta?"* — sí, abrir códigos VIP a familia directa (cónyuge/hijos/padres). Consumo familiar = CV al Centro de Negocios de Cobro. Upgrade futuro a Arquitecto posible.
- **FREQ_26** *"¿Back office vs Queswa.app?"* — distinción clave. Back office = sistema administrativo Gano Excel universal. Queswa.app = Centro de Mando exclusivo CreaTuActivo.com (Luis Cabrejo Parra + Liliana Patricia Moreno). El primero gestiona, el segundo orquesta.

**Nuevas respuestas en arsenal_compensacion:**
- **COMP_VIP_01** *"¿VIP requiere paquete / compras mensuales?"* — NO a ambas. Activación con 50 PV iniciales. Sin recompra mensual obligatoria. Sugerencia: mínimo 1 producto cada 5 meses para mantener cuenta operativa. Diferencia operativa explícita con Arquitecto (50 PV mensuales para conservar derecho de cobro de comisiones).
- **COMP_PV_08** *"¿Qué productos para mis 50 PV mensuales?"* — portado desde INV_06 (arsenal_12_niveles, vigente 2026). 4 opciones de combinación (café solo / café + suplemento / suplementos / mix) + tabla PV/CV oficial por producto. Resuelve el gap del chat principal que antes solo tenía la tabla en arsenal_12_niveles (no recuperable desde chat creatuactivo.com).

**Pendientes auditados y descartados:**
- COMP_CV_02 (CV vs precio) — NO crear. Auditoría confirmó que PV/CV/GCV ya están completamente cubiertos por COMP_PV_01/04/05 + COMP_CV_01 + COMP_PV_07. La distinción CV vs precio se mantiene implícita en COMP_BIN_11 sin necesidad de respuesta dedicada.

**Versiones finales tras v5.6.1:** arsenal_inicial 48 fragments + arsenal_compensacion 41 fragments = 89 respuestas en producción. Total Supabase: 179 fragments.

### v5.5 — Anti-alucinación Binario, 3 nuevas FREQ (personas/bases/VIP), banco aperturas (29 May 2026)

Causa: feedback de campo (Director Cabrejo) identificó tres focos:
1. Queswa improvisó tabla con encabezado *"Personas/Lado"* en respuesta de Binario — alucinación que refuerza paradigma MLM tradicional ("ganas por meter gente").
2. Repetición de la apertura *"Con gusto"* sonaba a guion comercial; necesitaba banco de aperturas para variar.
3. Errores semánticos repetidos por agentes Claude: *"paga 17% sobre el centro de negocios de cobro"* → el usuario malinterpreta como "17% sobre $100M de venta = $17M". La forma correcta es *"17% del GCV sobre el Centro de Negocios de Cobro"*. Y al decir *"ganas por consumo de Bases Operativas"*, muchos asumen que NO ganan por consumidores VIP que solo compran producto.

**Cambios léxicos en system prompt (v27.2):**
- *"Hoy analicemos las dos principales"* → *"Su Base Operativa genera ganancias en 12 velocidades que cubren su flujo de corto, mediano y largo plazo. Analicemos dos:"* (sincronizado con FREQ_04 verbatim_lock del arsenal). Doctrina: "las dos principales" implica jerarquía falsa sobre las otras 10.
- *"pierna débil/fuerte"* → *"Centro de Negocios de Cobro"* / *"Centro de Negocios de Mayor Tracción"* (doctrina canónica arsenal_compensacion:1010).
- *"17% sobre la pierna débil"* → *"17% del GCV sobre el Centro de Negocios de Cobro"* (el GCV vs PVP es la distinción clave).
- Nuevo banco de aperturas Lujo Clínico humano: *Claro / Por supuesto / Entiendo / Excelente / OK / Comprendo / De acuerdo* — antipatrón documentado: NUNCA empezar siempre con *"Con gusto"*.

**Cambios anti-alucinación en route.ts (getTablasComisiones):**
- Tabla Binario blindada con encabezado canónico *"Rentabilidad sobre GCV del Centro de Negocios de Cobro"*.
- Prohibición ABSOLUTA: nunca generar tablas con *"Personas/Lado"* — alucinación reincidente del modelo. Unidad correcta: *"Bases Operativas"*.
- Si el usuario pide proyección concreta, contextualizar estimado: *"con consumo de 4 cajas Ganocafé por Base Operativa por mes"*.
- USD + COP SIEMPRE entre paréntesis. Tasa Gano Excel fija: $1 USD = $4,500 COP (NO tasa de mercado).

**3 nuevas respuestas en arsenal_inicial:**
- **FREQ_04_PERSONAS** *"¿Gano Excel paga por meter personas?"* — filtro doctrinal anti-MLM tradicional. NO premia inscripciones; premia movimiento de inventario.
- **FREQ_04_BASES** *"¿Las ganancias son generadas únicamente por las Bases Operativas?"* — aclara que cada Base Operativa contiene Arquitectos Y Consumidores VIP. El sistema audita el consumo TOTAL.
- **FREQ_04_VIP** *"¿Qué es un Consumidor VIP?"* — define perfil (acceso a precio distribuidor sin compromiso de desarrollo). El usuario gana por su consumo recurrente igual que por el de un Arquitecto.

**Nueva respuesta en arsenal_compensacion:**
- **COMP_BIN_LIQUIDACION** *"¿Cómo liquida Gano Excel las comisiones binarias?"* — explica la matemática real: GCV (Volumen Comisionable Grupal) del Centro de Negocios de Cobro × porcentaje del paquete/rango activo. Tabla de orígenes de % (ESP-1/2/3 + escala de rangos Bronce-Diamante + promociones corporativas).

**Frontend (NEXUSWidget.tsx):**
- Custom `hr` component agregado al ReactMarkdown: `my-6` (24px vertical) + borde sutil. El default `<hr>` del browser dejaba el texto siguiente "pegado" al separador, rompiendo la respiración del Lujo Silencioso.

Doctrina aplicada: **cuando se detectan errores repetidos del modelo, no basta con ajustar el system prompt — hay que añadir respuestas explícitas al arsenal**. Las preguntas que el usuario va a hacer N veces deben tener fragment dedicado en el RAG, para que el modelo recupere doctrina verificada en lugar de improvisar.

### v5.4 — UX (FREQ_02 + FREQ_06), híbrido contextual de voz Queswa, limpieza léxico residual (24 May 2026)

Causa: feedback de campo identificó (a) respuestas demasiado técnicas en FREQ_02 y FREQ_06; (b) disonancia conversacional por uso sistemático de tercera persona ("Queswa hace X") cuando el agente habla con el usuario; (c) léxico residual no purgado en v5.3 (plusvalía, ancho de banda, vector); (d) inconsistencia "global" cuando se refiere al activo del usuario vs descripción factual de Gano Excel.

**Cambios:**

**FREQ_02 — reescrita completa** (sugerencia Gemini): Los 3 modos de tráfico ahora son "**Conexión Directa / Conexión Asistida / Conexión Automatizada**" en lugar de "Modo Relacional / Híbrido / Escalabilidad". Los nuevos nombres son auto-explicativos (cada uno indica QUÉ hace), eliminan "vector de tráfico"/"inyección de prospectos"/"protocolo de evaluación", y resuelven la inconsistencia con el header (que pregunta por "Análoga, Híbrida y Digital").

**FREQ_06 — reescrita completa**: elimina "Plusvalía Estructural" (→ "Ventaja Estructural"), "ancho de banda en la Dirección" (→ "disponibilidad de la Dirección"), "calibración personalizada" (→ "acompañamiento directo"). Nueva pregunta de cierre proyecta el "impacto financiero de asegurar esta posición de ventaja". Fecha corregida a "lunes 25 al domingo 31 de mayo" (ventana operativa real, no la histórica "04 al 09").

**Híbrido contextual de voz Queswa — doctrina de 3 niveles** (decisión arquitectónica documentada en CLAUDE.md):
- **Nivel 1 — Aforismos canónicos**: tercera persona PRESERVADA ("Usted no explica — Queswa explica", "Usted no enseña; Queswa escala"). Son frases-marca; cambiarlas rompe su fuerza retórica.
- **Nivel 2 — Sustantivos/componentes**: tercera persona PRESERVADA ("Centro de Mando Queswa", "Academia Queswa", "plataforma Queswa", "Pilar 2 (Queswa)" en referencias arquitectónicas). Son nombres propios o nombran componentes del ecosistema.
- **Nivel 3 — Acciones del agente AHORA**: CAMBIO a primera persona ("yo proceso", "yo asumo", "yo opero"). Antes el agente decía "Queswa filtra"; ahora dice "yo filtro".

Razón doctrinal: la disonancia conversacional ("¿acaso él no es Queswa?") quema atención del usuario. La regla híbrida resuelve la disonancia en chat sin perder la fuerza de los aforismos ni la precisión de los nombres propios. Aplicada a 9 instancias cross-arsenal: arsenal_inicial (5 cambios incluyendo WHY_01 verbatim_lock L34 + FREQ_01 L123 + FREQ_02 L153 + FREQ_04 L197 + DIASPORA L642), arsenal_avanzado (4 cambios L17, L69, L244, L246). arsenal_reto y respuestas-maestras.ts no requirieron cambios (ya alineados).

**Limpieza léxico residual:**
- "plusvalía" → "ventaja"/"valor patrimonial" según contexto (arsenal_avanzado:233 + arsenal_reto:32)
- "ancho de banda" → "disponibilidad"/"agenda" según contexto (4 instancias: arsenal_inicial L350, L437, L463 + arsenal_reto L55)
- "vector de tráfico"/"vector de adquisición" → absorbido en reescritura de FREQ_02 ("camino de expansión"/"ruta")
- "global" → "internacional" solo cuando refiere al activo del usuario (consumo internacional, Base Operativa internacional). "global" PRESERVADO cuando describe factualmente Gano Excel (70 países, distribución global) o el despliegue público del 1 de junio.

**Catálogo Bilingüe Verbal:**
- Cuando se hable de **acciones del agente conversacional**, usar primera persona ("yo")
- Cuando se citen **aforismos doctrinales**, mantener tercera persona ("Queswa")
- Cuando se nombren **componentes con nombre propio** (Centro de Mando Queswa, queswa.app, Academia Queswa, "Pilar 2 (Queswa)"), mantener tercera persona

### v5.3 — Propagación al backend dictador + léxico "arquitectura actual" → "modelo de ingresos" (24 May 2026)

Causa: el backend dictador en `route.ts` Estado 2 informativo (texto verbatim que se imprime cuando el usuario pide "háblame de los paquetes" en modo informativo) seguía usando vocabulario v5.1 prohibido — "Asignación de Capital para la Activación de Infraestructura", "tecnología nutricional", "apalancamiento asimétrico máximo". La purga v5.2 limpió el arsenal pero **no propagó al backend**, así que el modelo imprimía el preámbulo viejo verbatim.

**Cambios:**
- **`route.ts` Estado 2 informativo** (`getMicroPromptCierre` con `modoCierre=false`): preámbulo simple + bullets ESP simplificados ("Apalancamiento estratégico" sin "asimétrico/máximo") + pregunta de cierre canónica nueva.
- **`route.ts` Tabla Binario** (`getTablasComisiones`): eliminada columna técnica `CV × % × $1` (fricción innecesaria) + eliminada fila "Kit Inicio". Solo Paquete + Rentabilidad %. La fórmula técnica se sirve únicamente si el usuario pregunta "¿cómo se calcula la comisión semanal?".
- **PERFIL_01**: "su arquitectura actual" → "su modelo de ingresos".
- **OBJ_02 pregunta de cierre**: nueva canónica "¿Cuál de estas tres opciones (ESP-1/2/3) se alinea mejor con la liquidez que desea inyectar a su Estructura Patrimonial este mes?".
- **FREQ_04 (Doble Velocidad)**: "matemática" / "proyección estructural" → "(cómo se genera la liquidez semanal)" / "(cómo se consolida el flujo recurrente)".
- **FREQ_03 verbatim_lock**: (a) eliminada frase "No existen cuotas de inscripción ni cobros por afiliación" — en México sí hay un cobro de afiliación pequeño (~$10 USD); afirmar lo contrario es impreciso. (b) Pregunta de cierre alineada a la canónica de OBJ_02.
- **Limpieza léxico v5.2 residual**: 6 instancias de "tecnología nutricional" en `arsenal_inicial.txt` + 1 en `arsenal_avanzado.txt` → "productos físicos" / "bebidas enriquecidas y suplementos Gano Excel" / "este mercado" según contexto.
- **Afirmaciones "100%" eliminadas en CRED_04 y OBJ_02**: "El 100% de los fondos se transfiere" → "Su capital se transfiere a productos físicos". Mismo razonamiento que la regla México (cobros pequeños existentes; afirmar 100% genera riesgo de inconsistencia auditable).

Doctrina aplicada: **el backend dictador es la fuente de verdad ejecutable**. Si el arsenal tiene léxico v5.2 pero el backend imprime verbatim v5.1, el usuario ve v5.1. Cada vez que se purga vocabulario del arsenal, hay que auditar `route.ts` por reaparición en bloques `getMicroPromptApertura/Cierre/Estado4` y en las strings de inyección "📊 FORMATO TABLA".

### v5.2 — Cierre simplificado (22 May 2026, paralelo a system prompt v27.1)

Causa: ante "¿cómo se inicia?" el modelo alucinaba "equipo de Dirección Estratégica con disponibilidad de inventario en su zona" (texto inexistente en el arsenal); paralelamente CIERRE_01 aún disparaba el Klaff Prize Frame "7-10 horas semanales" — código zombi de antes de Opción B.

**Cambios:**
- **FREQ_03** reescrito con copy v5.2 + `<verbatim_lock>` para delivery exacto.
- Triggers ampliados: absorbe "cómo se inicia / quiero empezar / cómo me uno / cuáles son los pasos" además de los originales.
- Vocabulario simplificado: fuera "Asignación de Capital", "apalancamiento estratégico máximo", "tecnología nutricional"; adentro "su capital se convierte en los productos físicos" (sin afirmar 100% — no siempre exacto).
- Datos tangibles por nivel: productos + Binario + GEN5 (anchoring ESP-3 primero).
- **CIERRE_01 eliminado** del arsenal (Klaff Prize Frame BANT horas, contrario a Opción B).
- **CIERRE_02 eliminado** del arsenal (follow-up del Estado 1, ya no existe).
- BLOQUE CIERRE: header "4 respuestas" → "2 respuestas" + nota operativa que documenta el colapso.

Doctrina aplicada (insight del Director Cabrejo): *"el arquitecto no puede precipitar el cierre pero debe esperar que pase, y cuando pasa los procesos son sencillos"*. Cuando el prospecto pregunta cómo se inicia se sirven los 3 niveles + pregunta de selección, el FSM avanza a Estado 3 (nombre) y Estado 4 (warm handoff automático). Sin entrevista BANT prematura.

### v25.9 — Markdown enriquecido en chips canónicos (19 May 2026)

WHY_02 + EAM_01 reescritos con numeración explícita (1./2./3.), negritas en frases-ancla, cursivas en reencuadres psicológicos, separador `---` antes del cierre. Sincronizado con system prompt v26.9 (nueva sección "RECURSOS DE LEGIBILIDAD COGNITIVA").

### v25.8 — Migración XML verbatim_lock (18 May 2026)

`[VERBATIM_LOCK]...[/VERBATIM_LOCK]` → `<verbatim_lock>...</verbatim_lock>` en WHY_01, WHY_02, EAM_01. Razón: investigación Gemini Hipótesis C confirmó que Claude Sonnet 4.6 reconoce XML tags como señal de máxima prioridad post-entrenada; los corchetes planos son texto inerte. Paralela a system prompt v26.8.

### v25.7 — Respuestas Master del Director Académico (18 May 2026)

WHY_01, WHY_02, EAM_01 calibrados al estándar Director Académico de Élite (v5.0/v6.0/v5.1). Preservan recategorizaciones v25.3 (Pilar 3 = Metodología Automatizada) + v25.5 (jerarquía causal Modelo→Inestabilidad→Déficit).

### v25.6 — DIASPORA + verbos paridad (Abr 2026)

Bloque DIASPORA_01-03 (latinos en USA/Europa), verbos de paridad ("dirige", "orquesta", "ejecuta") aplicados en WHY_02 y CIERRE_03. Cifra cupos Fundadores 15.

### v25.5 — Jerarquía causal corregida (17 May 2026)

WHY_01 + STORY_01 + PERFIL_01 reescriben Déficit Estructural de Ingresos como CAUSA RAÍZ (no consecuencia). Modelo de presencia obligada = MANIFESTACIÓN. Sincronizado con system prompt v26.6.

### v25.3 — Pilar 3 recategorizado (15 May 2026)

WHY_02 reescrito: Pilar 3 = La Metodología Automatizada (El Tridente EAM), no "Su Rol como Arquitecto de Patrimonio". El Arquitecto queda elevado como director de los 3 pilares. Sincronizado con system prompt v26.5.

---

## arsenal_avanzado

### v12.5 — METH_01: Compartir · Recibir · Multiplicar (2 ago 2026)

Propagación del rename del método (servilleta v6.5, decisión del Director: *"si hay que explicar la palabra, la palabra falló"* — Expandir → **Compartir** · Activar → **Recibir** · Multiplicar sin cambio, "Recibir" además desambigua "activar" que ya significa comprar el paquete). METH_01: "tres comandos" → "tres movimientos"; bajo el rótulo Recibir, Queswa dice "yo **converso** con esas personas" (no "yo recibo" — recibir es el movimiento del Propietario, el apretón de manos al final); *"las guío hasta su decisión"* → *"maduro su decisión"* (verbo vetado, [[feedback_promesa_canonica_queswa]]); *"su empresa digital se multiplica"* → *"su negocio se multiplica"*. Cifras intactas. Purga METH_01 + re-fragmentación. Sincroniza con system prompt **v29.5**, Home, Manifiesto, `/fundadores` y voice-command. *(v12.4 documentada en el header del .txt — no tuvo entrada aquí.)*

### v12.3 — "filtrar" desterrado + Maestría→Multiplicación (17 jun 2026)

"filtrar" desterrado (5 hits → conversar/acompañar/reconocer) + 3er Comando Maestría → Multiplicación (Comando Multiplicación reescrito: la formación enlaza con multiplicación 1·2·4·8). Cifras intactas.

### v12.2 — Swap "empresa digital" (12 jun 2026)

"negocio digital" → "empresa digital" para el activo que entregamos. Cifras intactas.

### v12.1 — Swap léxico "negocio digital" (jun 2026)

Base Operativa → negocio digital · "Operando en el nivel" → "En el nivel" · aforismo "Queswa escala" → "Queswa multiplica" · "Calibre ESP-3" → "nivel ESP-3". Cifras intactas.

### v12.0 — Migración al registro accesible (Beto) (jun 2026)

Léxico canónico → accesible. "Capas" → "respaldos independientes" (ADV_TECH_03), "calibre" → "nivel", GCV correcto ("17% compensado sobre el volumen comisionable", "hasta 15/17% del GCV"), 50 PV como compra personal mínima, ADV_SIST_03 reescrito con técnica Mario Puig (analogía director de orquesta). Cifras del plan intactas. Aforismos canónicos preservados (Activar suavizado: "revisa y da el sí").

### v10.0 — ADV_VAL_05 + Tridente Comandos (May 2026)

Nueva respuesta ADV_VAL_05 (incentivos corporativos Gano Excel). METH_01 con Comandos canónicos del Tridente EAM (Expandir/Activar/Maestría + aforismos). Patrimonio Paralelo en OBJ_02. Queswa nombrado en OBJ_01. USD/COP unificado VAL_01/VAL_04. ADV_TECH_03 con "Queswa, el Centro de Mando" + "sistemas de contingencia" (Capas — no Pilares). ADV_SIST_02 "Infraestructura Continental". ADV_SIST_03 reordenado.

---

## arsenal_reto (Auditoría Patrimonial)

### v4.7 — Swap "empresa digital" (12 jun 2026)

"negocio digital" → "empresa digital". Jerga clínica profunda intacta (ver v4.6). 7 fragments (días 1–5).

### v4.6 — Swap léxico "negocio digital" (jun 2026)

Solo swap de marca: Base Operativa → negocio digital + "WhatsApp operará" → "funcionará". ⚠️ La **jerga clínica profunda se conserva a propósito** (Déficit Estructural, Re-Arquitectura, Acoplamiento Híbrido, "Ancho de Banda Mental" — esta última permitida explícitamente en RETO_05) — ver [[project_reto_12niveles_no_migrar]]. Migración profunda + rename del producto ("El Diagnóstico de 5 Días") = pase cross-channel pendiente.

### v4.1 — Arquitecto de Patrimonio (May 2026)

7 respuestas calibradas: Arquitecto de Patrimonio, jerarquía causal Protocolo→Inestabilidad→Déficit, Pilares 1/2 en Día 3, Base Operativa digital.

---

## arsenal_compensacion

### v6.4 — Cobertura geográfica canónica (22 May 2026)

Nueva sección "REGLA CANÓNICA: COBERTURA GEOGRÁFICA" (70 países Gano Excel vs 15 países operativos CreaTuActivo). COMP_MODELO_01 corregido: "cualquier país" → "cualquiera de los 15 países operativos de América". COMP_PAQ_01 con Insight "NUNCA digas 'X meses de GEN5'" — corrige confusión entre duración Binario y GEN5.

### v6.2 — Doble velocidad + organización (May 2026)

Capitalización Inmediata (GEN5) / Renta Vitalicia (Binario). "Su organización" reemplaza "su equipo/red". Arquitectos de Patrimonio. Analogía del Acueducto eliminada. COMP_MODELO_01 "Monetización de Doble Velocidad".

**⚠️ NO modificar vocabulario ni cifras** sin autorización explícita — son cifras matemáticas del plan, no copy editorial.

---

## catalogo_productos

### v7.2 — Verbatim lock en tablas + PROD_OVERVIEW (22 May 2026)

Causa: ante "¿Cuál es el producto?" Queswa alucinaba nombres simplificados ("Ganotea" en lugar de **Oleaf Gano Rooibos**, "Gano Cocoa" en lugar de **Gano Schokolade**, "Gano Supreme" inexistente, "Ganocafé Negro" en lugar de **Ganocafé Clásico**) y omitía la categoría completa de **Suplementos** (mencionando solo 2 de 4 categorías reales).

Diagnóstico: el catálogo SÍ estaba fragmentado (25 fragments en Supabase + doc maestro de 17,664 chars). La nota previa en CLAUDE.md decía que "no está fragmentado" — era falsa. El problema real: las tablas canónicas no tenían `<verbatim_lock>`, así que el modelo parafraseaba con nombres simplificados aunque tuviera la tabla exacta en contexto.

**Cambios v7.2:**
- **PROD_OVERVIEW (NUEVO)**: vista global de las 4 categorías canónicas en `<verbatim_lock>` — responde "vista general del portafolio", "categorías de productos", "¿cuál es el producto?". **Crítico: NUNCA omitir Suplementos ni LUVOCO.**
- **BEB_01**: tabla 9 bebidas envuelta en `<verbatim_lock>` + triggers ampliados ("productos", "bebidas") + nota explícita de productos inexistentes (Ganotea/Gano Cocoa/Ganocafé Negro).
- **LUV_01**: tabla sistema LUVOCO (4 productos) en `<verbatim_lock>`.
- **SUP_01**: tabla 3 suplementos en `<verbatim_lock>` + nota "es 1 de 4 categorías — NUNCA omitir" + aclaración "no existe Gano Supreme".
- **PERS_01**: tabla 6 cuidado personal en `<verbatim_lock>`.

Deploy: `node scripts/actualizar-fragmentos-catalogo-v7.2.mjs`. 5/5 fragments actualizados con embeddings duales (voyage-large-2 + voyage-3-lite) y `metadata.is_fragment = true`.

**Bug pendiente parcial:** CV/PV todavía faltantes en respuestas individuales por producto (PROD_*, BEB_02-06). Ver `docs/handoff/queswa/HANDOFF-QUESWA-PRECIOS-CVPV.md`.

### v7.0 — Lujo Clínico (Abr 2026)

22 productos + ciencia (Ganoderma Lucidum, Cordyceps), audiencia premium pan-americana. ~20KB total. Estructura por categorías: Bebidas funcionales (9), LUVOCO (4), Suplementos (3), Cuidado Personal (6).

---

## arsenal_marca_personal (tenant `marca_personal`)

### v1.1 — Calibración Luis Cabrejo (Abr 2026)

11 respuestas: QUIEN, HIST, VISION, METOD, ACTIVO, OBJ, CONTACTO. Para `luiscabrejo.com`.

---

## arsenal_ganocafe (tenant `ecommerce`)

### v1.5 — Alias coloquiales (Mar 2026)

16 respuestas (PROD_01–07, BENE, COMPRA, OBJ_GC, NEGOCIO, CODIGO). Para `ganocafe.online` (piloto Google Ads).

⚠️ El system prompt `ganocafe_main` tiene catálogo de precios hardcodeado. Al cambiar precios en el arsenal, **también** actualizar el system prompt con `node scripts/actualizar-system-prompt-ganocafe-v1.3.mjs`. Deben estar sincronizados.

---

## arsenal_12_niveles

### Mayo 2026 — Aforismo Tridente canónico

Línea 164: aforismo corregido a "Usted no explica — Queswa explica". 13 fragmentos re-embebidos con voyage-large-2 + voyage-3-lite.

---

## Versiones anteriores

Para historial pre-v25.3, consultar `git log -- knowledge_base/<arsenal>.txt`. Las versiones explícitas tienen tag de fecha; las implícitas se infieren del commit.
