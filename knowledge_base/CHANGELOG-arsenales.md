# Changelog — Arsenales Queswa

Historial doctrinal de los arsenales (tenant `creatuactivo_marketing` salvo nota explícita). Extraído del cuerpo de CLAUDE.md a partir del 23 May 2026 para reducir overhead de tokens — un agente nuevo solo necesita la versión *actual* + la *previa*; el historial completo vive aquí.

Cada arsenal vive en `knowledge_base/<nombre>.txt`. Deploy:
- Actualizar todo el documento: `node scripts/deploy-arsenal-<nombre>.mjs`
- Solo re-fragmentar cambios puntuales: `node scripts/actualizar-fragmentos-modificados.mjs`
- Fragmentos Master con `<verbatim_lock>` (WHY_01/WHY_02/EAM_01): `node scripts/actualizar-fragmentos-master-v25.7.mjs`
- Cambios específicos al cierre (FREQ_03 + purgar CIERRE_01/02): `node scripts/actualizar-fragmentos-cierre-v5.2.mjs`

---

## arsenal_compensacion

### v8.3 — La comisión del GEN5 se cotiza en la moneda del visitante (25 ago 2026)

La v8.2 le dio cifras a COMP_GEN5_01, y quedaron escritas en **pesos colombianos dentro de un `<verbatim_lock>`** — un texto que se entrega carácter por carácter. La regla de moneda por país dice que a un visitante de Estados Unidos se le cotiza en dólares, y el pin que resuelve eso (`getPinCifrasGEN5`) solo dicta cuando la persona **pide el ejemplo**, no cuando pregunta *«¿qué es el GEN5?»* en frío. Un prospecto con número +1 recibía COP.

Se aplica el mismo reparto que ya usaba FREQ_03: **el candado pone el texto, el pin pone la cifra.** El candado trae `[GEN1]` y `[GEN2_5]`; los llena `getPinComisionGEN5(country)` en `route.ts`, que se inyecta cuando el contexto trae este fragmento. Colombia → solo COP · Estados Unidos → USD limpio · resto → USD con COP entre paréntesis.

⚠️ **La regla general:** una cifra que depende del país **no puede vivir dentro de un candado**. Al escribir un fragmento con cifras y `<verbatim_lock>`, el hueco va en el candado y la cifra en un pin.

Cifras del plan intactas.

### v8.2 — El GEN5 lleva su rango en la primera respuesta (24 ago 2026)

Trabajo de otra sesión, documentado aquí el 25 ago al encontrarlo sin entrada en el CHANGELOG. **Verificado antes de desplegarlo:** las cifras cuadran con la tabla del propio arsenal (Gen 1 $675.000 · Gen 2-4 $90.000 · Gen 5 $180.000 para Visionario) y con el pin del motor en `route.ts`; el techo de $112.500 para Inicial también. La batería del guardarraíl de negocio trae un caso para el copy nuevo y pasa.

**COMP_GEN5_01 pasa a llevar el rango por generación**, anclado al paquete propio (decisión del Director). El razonamiento: quien pregunta cómo gana pronto está preguntando **cómo recupera lo que puso**, y en abstracto esa cuenta se la hace el prospecto solo, casi siempre hacia arriba. Acota la doctrina del 7 ago, que dejaba la primera respuesta sin cifras.

⚠️ **La compra se nombra sin persona** —*comprado en su canal de distribución*—, que es registro de gran distribución; nombrar a quien compró devuelve la escalera de gente. ⚠️ **Sin precio de entrada en el mismo mensaje**: una inversión al lado de un rendimiento es una proyección de retorno.

⚠️ **La pregunta de cierre nombra el paquete a propósito**: el pin del motor decide el tipo de ejemplo por la oferta y su default es la renta, así que un cierre que no nombraba la vía hacía que el «sí» entregara el ejemplo del Binario después de haber explicado el GEN5.

Cifras, %, CV/PV y tasas intactas.

### v8.1 — El Binario se explica por emparejamiento (23 ago 2026)

Lo que dijo el Director: en la práctica «compensados» siempre hay que explicarlo, y «lado menor» produce en muchas personas una sensación de injusticia —*«¿por qué la compañía me paga solo por un lado?»*—, cuando el problema real es que el léxico no pinta lo que ocurre: la compañía toma puntos de LOS DOS lados. La palabra es **emparejar** (sola: sin «pares», sin «compensados»), y los dos frentes se nombran **canal izquierdo y canal derecho** —no «sus dos lados» ni «centros de negocio», porque estas preguntas llegan cuando la persona aún no sabe que hay dos centros, y «canal» le dibuja producto moviéndose, no personas—. «Opera» y «mecánica» valen en este contexto: el léxico vigente manda sobre la prohibición vieja. Párrafo canónico construido con Gemini y el Director, ejemplo 1.000 / 5.000 (con 2.000, sobrante y emparejado eran ambos 1.000 y se confundían).

Barrido en nueve lugares: BIN_01 (referencia interna, que se indexa), BIN_02, BIN_06, BIN_08 (bullets, regla crítica, tabla, nota del mes 18, instrucción interna — y de paso «retiro semanal de por vida» e «ingreso inmediato», dos frases vetadas que seguían ahí), BIN_09, BIN_11, y el glosario (*«Lado de Compensación: el lado con MENOS puntos. Este es sobre el que le pagan»* era la frase de la injusticia, literal).

**Corrección de doctrina:** BIN_09 y el glosario afirmaban que el CV «NUNCA se pierde… se congela, no se borra». Falso: los puntos guardados se pierden si la persona deja de estar activa con su recompra mensual (50 PV). Reescrito con el ejemplo 1.050 / 5.070 y la observación del Director de que una caja a la semana se queda corta en la práctica.

**Nuevos:** BIN_06 reescrito con los tres requisitos en llano (activo con recompra · un cliente o distribuidor activo *patrocinado directamente* en cada canal · 100 puntos emparejados, se paga por centenas), separando lo que pausa el pago de lo que borra los puntos · GEN5_09 (las dos condiciones del GEN5, que estaban regadas en tres fragmentos) · PV_09 («¿cómo así una caja a la semana?» → cuatro cajas en el ciclo de cuatro semanas → 60 PV).

### v8.0 — Los productos se nombran como los ve el cliente (22 ago 2026)

Prueba del Director, 22 ago: la persona dijo «sí» a *"¿le muestro el catálogo completo con precios?"* y recibió **la tabla de puntos del plan** — 22 filas con código interno, PV, CV y precio, con los nombres en inglés del back office (*Gano Fresh Toothpaste*, *Gano Transparent Soap*, *Reskine Collagen Drink*) y *Piel8Brillo*, que es Piel&Brillo con el «&» corrompido. Esa tabla existe para el socio que calcula su recompra; servida a un prospecto como catálogo, le dice que el negocio no sabe ni el nombre de sus productos.

**Dos causas, dos arreglos.** (1) En el motor, la PRIORIDAD 1.5 del clasificador mandaba *"catálogo con precios"* a compensación a propósito, por un motivo de abril que dejó de existir en mayo cuando las tablas del catálogo recibieron su `<verbatim_lock>`; ahora la lista de precios va al catálogo y COMP_PV_06 queda para quien pregunta por **puntos**. La puerta directa a COMP_PV_06 exige PV/CV/puntos en el mensaje. (2) En este arsenal, **57 ocurrencias** renombradas en COMP_CV_01 · COMP_PAQ_02–05 · COMP_PV_06 · COMP_PV_08: los nombres son los del catálogo —Ganocafé Clásico, Jabón Gano, Jabón Transparente, Gano Fresh (pasta dental), Shampoo/Acondicionador/Exfoliante Piel&Brillo, Reskine Colágeno, Cápsulas Ganoderma/Excellium/Cordygold, Cápsulas Luvoco Suave/Medio/Fuerte, Máquina LUVOCO—. Ninguna cifra del plan cambia. ⚠️ `arsenal_ganocafe` (tenant ecommerce) conserva dos nombres en inglés; pendiente, no es de este canal.


### v7.7 — Cada vía se nombra por lo que la mueve (9 ago 2026)

Decisión del Director, después de que la investigación encargada a Gemini devolviera pensamiento útil y copy inservible (ocho nombres tipo *Bono de Habilitación de Nodos Comerciales*, y las tres frases propuestas en tuteo). Lo que sí se rescató de ese informe: **el criterio del artículo 2 de la Ley 1700** —cuando el discurso se centra en intermediar personas en vez de productos, cruza la línea regulatoria— y la lógica de preparación del canal.

**El problema era de hecho, no de tono.** El GEN5 se presentaba por su **velocidad** y el Binario por su **duración**, y las dos etiquetas estaban mal. La de velocidad además era **falsa**: la compra de un paquete empresarial es **esporádica**. Lo único que se puede afirmar es *cada vez que ocurre* — sin ritmo prometido y sin plazo. La de duración estaba vetada desde el 8 ago por ser promesa de perpetuidad.

**El daño que esto corrige ocurre aguas arriba, y es dato de campo.** Doce años de observación del fundador:

> *"Aún las personas que llevan años siguen viendo más llamativo el GEN5 que el ingreso recurrente. Es algo que daña. La gente piensa: rápido traigo a 5, que traen 5, que traen 5 — y solo con esa idea le inyecta la idea de la pirámide a su prospecto."*

No se deforma la cabeza del prospecto: se deforma la de **quien explica el negocio**. La prueba del canal del 9 ago lo documenta — el prospecto salió con una sola cifra en la cabeza, la del GEN5, cero cifras del recurrente, y dos frases nuestras diciéndole que esa es la rápida.

**Vocabulario canónico:** `GEN5 = compra de paquetes empresariales` · `Binario = consumo recurrente` · `colectivo = su canal`.

⚠️ **La función se conserva**, porque sin ella no se entiende para qué hay dos vías: el GEN5 es la plata que financia el crecimiento temprano. **Decir para qué sirve no es decir qué tan rápido llega.** Se conserva también la distinción que ya existía y no tiene adjetivo: *esta le paga mientras construye, y la otra le paga por lo que ya construyó*.

⚠️ **`colectivo = su canal`, y cuando el colectivo hace algo humano se nombra a quién** (*sus clientes*, *sus socios*). Un canal es un conducto y no consume — se vio al probar el reemplazo contra las frases reales: aguantaba en 6 de 7, y la que rompía era *"su organización sigue consumiendo"*. Y una sola palabra no puede cargar a la vez la red de clientes y la de dueños de canal. Nombrar a quién sí puede, es más concreto, y **mete al consumidor dentro de la frase, que es donde la Ley 1700 quiere verlo**. Se descartó *red de consumo* (propuesta de Gemini como «la más segura jurídicamente») porque **describe mal la mitad del modelo**: el GEN5 no paga por consumo.

⚠️ **Los disparadores conservan las palabras del prospecto** — *"¿cómo se gana rápido?"* sigue siendo trigger de COMP_GEN5_01. Son su vocabulario, no el nuestro; sin ellos la pregunta deja de encontrar respuesta. Es la distinción que ya aplica `auditar-frases-vetadas.mjs`.

**Retrieval medido antes y después** (línea base capturada ANTES de purgar, corrigiendo el método que falló en v7.6): **7 de 9 consultas conservan el mismo ganador**. Los dos cambios no son regresiones — *"¿se gana por las compras de paquetes?"* pasó de COMP_GEN5_04 a **COMP_MODELO_01**, que es mejor porque explica las dos vías y abre por el recurrente; y *"¿cómo funciona el plan de compensación?"* cambió entre dos fragmentos **ambos bajo el umbral de 0.4**, hueco preexistente. Mejora principal: *"¿qué es el Bono GEN5?"* de 0.618 a **0.643**.

**Alcance:** COMP_MODELO_01 (frase puente), COMP_GEN5_01 (apertura + cabecera), COMP_GEN5_08, COMP_PAQ_04, COMP_VIP_01 (cinco instancias, la peor: negaba *«No es Renta Vitalicia»*, que nombra el elefante para descartarlo), la REGLA DE ORO, y la pestaña visible de la servilleta (`INGRESO INMEDIATO` → `INGRESO POR PAQUETES`). ⚠️ **No se tocó el fallback de `route.ts`** — la regla del proyecto lo prohíbe y los dos prompts vivos en Supabase ya están limpios, verificado.

**Estado: 0 apariciones del léxico retirado en fragmentos · 38 fragmentos por tenant, iguales · 0 hits del auditor · 42/42 en la batería.** Queda `dashboard/arsenal_cierre`, que es de queswa.app y repositorio aparte.

**Pendientes anotados:** las **51 apariciones de *su organización*** en tres arsenales (barrido aparte, decidido hacerlo después de este para poder atribuir regresiones) · la progresión **«1, 2, 4, 8»** de `arsenal_avanzado`, que es el mismo inyector de pirámide escrito por nosotros · el bloque *LENGUAJE APROBADO* del fallback, que todavía lista *«estructura de ingresos recurrentes»*, jerga que los arsenales ya retiraron.

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

## Barridos transversales

### Vocabulario del colectivo, del rol y del fabricante (9 ago 2026)

Un solo pase sobre `arsenal_inicial`, `arsenal_compensacion`, `arsenal_avanzado` y `arsenal_12_niveles`, decidido junto tras la pregunta del Director: *"¿cómo vamos a llamar a nuestros dueños de canal?"*.

**Los tres registros del rol quedaron así:** a él, en segunda persona, **sin título** — *usted es el dueño* (decisión del 8 ago; un cargo evoca hojas de cálculo y le pide una identidad que no se atribuye). A los suyos, en tercera, **socios** — ya era lo dominante con 81 usos, y convive con *clientes preferenciales* para quienes solo consumen. En el código, **constructor** (`constructor_id`, `constructor_slugs`), que **no se migra**: es una migración de base de datos sin beneficio de cara al prospecto.

| Barrido | Instancias | A |
|---|---|---|
| *su organización* | 67 | **su canal** |
| …donde el colectivo actúa | 8 | **se nombra a quién** (*sus clientes*, *sus socios*) |
| *Propietario* | 31 | **socio** |
| *su socio logístico/financiero/digital* | 12 | **Gano Excel** / **Queswa** |

⚠️ **«Organización» no era un residuo.** La eligió deliberadamente el barrido del 20 jul para reemplazar *red*, conservando *canal de distribución* aparte. Esta es la tercera iteración sobre la misma palabra. El modelo nuevo es más limpio porque **elimina el término intermedio ambiguo**: el canal es la estructura y su volumen; cuando hacen falta las personas, se nombran.

⚠️ **La colisión de «socio» se resolvió sola.** Medida antes del barrido: *socio* significaba Gano/Queswa en 9 fragmentos y la gente del canal en 1. Pero los 9 eran todos de fragmentos **sin revisar** — los revisados ya decían *Gano Excel* por su nombre desde v5.60, cuyo argumento se aplicó aquí: *un rótulo interno le confirma la duda a quien duda*.

**Usos legítimos conservados:** *la organización dirigida por Luis Cabrejo* (es CreaTuActivo, la empresa) · *no es mala organización* en OBJ_01 (otro significado) · *extracto propietario de Ganoderma* · *"Total organización"* como rótulo de la tabla de `arsenal_12_niveles`, que está alineado con el simulador del deck y desincronizarlo rompería el funnel ([[project_reto_12niveles_no_migrar]]).

**Medición.** Línea base capturada **antes** de purgar: **21 de 23 consultas conservan el mismo fragmento ganador**. Los dos cambios son empates de milésimas — *"¿qué son los 12 niveles?"* pasa de la tabla a la definición (mejora) y *"¿el consumo de mi hogar cuenta?"* cruza por 0.001, mientras la pregunta principal de ese fragmento sigue resolviendo a 0.620. Se decidió **no** empujar el embedding para ganar un empate de milésimas: eso es afinar contra la propia prueba, y FREQ_25 ya tiene reescritura pendiente por otras razones.

**Hueco preexistente destapado:** `PERFIL_01` tenía el disparador *"yo no sirvo para vender"* pero no *"no sé vender"* — la mudanza de v5.65 cubrió una forma y no la otra. Se sumaron las dos variantes.

**Estado: 0 apariciones de los tres términos en fragmentos · 145 por tenant, idénticos · 0 hits del auditor · 42/42 en la batería, en los dos tenants.**

### Progresión geométrica retirada y concordancia corregida (10 ago 2026)

*(transversal: `arsenal_inicial` v5.79 · `arsenal_compensacion` v7.9 · `arsenal_avanzado` v13.2)*

⚠️ **El `1, 2, 4, 8` era el inyector de pirámide, escrito por nosotros.** Es exactamente lo que el Director describió el 9 ago —*"la gente piensa: rápido traigo a 5, que traen 5, que traen 5, y solo con esa idea le inyecta la pirámide a su prospecto"*— puesto en dígitos, y contando **socios**, no compras. Vivía en dos respuestas: `METH_01` de avanzado y `NET_01` de inicial.

**Se retiró solo el inciso.** Las dos frases quedan completas y más fuertes sin él — *"hace exactamente lo mismo que usted"* y *"su canal se multiplica sin depender del talento de cada quien"* — porque el mecanismo se dice entero **sin dibujarlo**. La duplicación transferible sigue siendo el argumento; lo que sale es su representación numérica.

⚠️ **Concordancia rota por el barrido del 9 ago.** Cambiar *organización* (femenino) por *canal* (masculino) dejó cuatro *"toda su canal"*. Error del agente. **Y una lección de despliegue:** corregir el `.txt` no basta — los fragmentos que no se purgan conservan el texto viejo en la base. La primera verificación dio 0 en el archivo y **6 en el corpus indexado**; hubo que purgar y regenerar `COMP_BIN_10`, `COMP_VIP_01` y `NET_02` aparte.

⚠️ **Y la nota de versión de la v7.8 citaba la progresión literalmente**, lo que la devolvía al documento padre indexado — la misma trampa que la regla del proyecto advierte. Reescrita por criterio.

**Estado: 0 apariciones de la progresión · 0 de concordancia rota · 143 fragmentos por tenant, idénticos · 0 hits del auditor · 42/42.**

**Pendientes de este frente:** el cierre de `METH_01` sigue ofreciendo *"¿le muestro cómo se ve esa multiplicación en números?"*, que lleva a la aritmética que acabamos de retirar del cuerpo — falta decidir a dónde debe llevar. Y **el verbo *dirigir*, retirado el 8 ago, sobrevive 14 veces de cara al prospecto** (6 en inicial, 7 en avanzado, 1 en compensación): barrido aparte.

### La multiplicación se cuenta en cajas, y la escala se hace visible (10 ago 2026)

*(`arsenal_avanzado` v13.3 · pines dictados de `route.ts`)*

**Aporte del Director que reencuadra el problema.** El agente había planteado que el ejemplo con números era peligroso por acercarse a la aritmética de la pirámide. La corrección:

> *"No lo veo negativo. Las personas no ven el crecimiento potencial: cuando piensan en una red donde se mueven mil cajas a la semana, lo que piensan es que **él** debe moverlas. No tienen en cuenta que mil cajas pueden ser movidas por diez distribuidores donde cada uno tiene cien consumidores. El punto es que se vea que la multiplicación no está relacionada a personas sino al **movimiento de un producto**."*

Es decir: hay **dos** problemas opuestos, y el ejemplo numérico resuelve el segundo si está bien contado. `COMP_BIN_10` ya tenía los números —10 / 100 / **1.000** clientes con el marco de las cajas— pero **mostraba el destino sin mostrar quién mueve**, y el prospecto leía *"1.000 clientes"* como *"tengo que conseguir mil personas"*.

⚠️ **El cierre de METH_01 era circular.** *"¿Le muestro cómo se ve esa multiplicación en números?"* recuperaba **el propio METH_01** (0.529): la persona decía que sí y recibía la misma respuesta. Ahora es **"¿Le muestro cuánto se mueve con cien clientes consumiendo?"**, que llega a `COMP_BIN_10` como #1 (0.558) — y planta *cien clientes* como un número normal, que es la capa invisible.

⚠️ **La cuenta que destapa la escala entra en el ejemplo dictado de renta** (`route.ts`): *"esos clientes no los consigue usted solo. Son los de sus socios, sumados — diez distribuidores con diez clientes cada uno ya llegan a cien."* Antes solo decía, de pasada, que *"esa red no la construye usted solo"*: la semilla sin la aritmética.

⚠️ **Y el barrido de vocabulario del 9 ago había quedado incompleto:** los pines dictados viven en `route.ts`, no en los arsenales. Quedaban tres *"su organización"* — y uno era **una instrucción que le ordenaba al modelo usar el término retirado** (*«léxico "negocio digital" / "su organización"»*). Corregidos, más dos *"por cada persona que arranca"* → **por cada paquete empresarial que se compra** (se cuentan compras, no personas), y una línea que decía *"mes tras mes, incluso mientras usted duerme"* — cadencia equivocada (Gano liquida los viernes) y la fórmula del ingreso pasivo mágico, que está vetada. Ahora: *"liquidado cada viernes"*.

**Verificado en `route.ts`: 0 de cada uno.** 143 fragmentos por tenant, idénticos · 0 hits del auditor · 42/42 · sin errores tsc nuevos.

## arsenal_inicial

### v5.97 — Nace FREQ_34: las nueve oficinas con dirección exacta (25 ago 2026)

**El arsenal invitaba a comprobar algo que no podía sostener.** FREQ_13 usa las oficinas como prueba de legalidad y cierra con *«usted puede entrar a cualquiera»*; FREQ_07 y FREQ_33 también las mencionan. Pero el corpus solo tenía las **ciudades** — ninguna dirección, en ningún arsenal. Si alguien preguntaba *«¿dónde queda la de Cali?»*, el modelo no tenía con qué responder, que es exactamente la condición en la que improvisa.

Las nueve, con barrio, aportadas por el Director: **Bogotá Cedritos** y **Bogotá Santa Isabel**, **Medellín**, **Cali**, **Barranquilla**, **Bucaramanga**, **Pereira**, **Cúcuta** y **Villavicencio**.

⚠️ **Va bajo `<verbatim_lock>`.** Una dirección parafraseada es una dirección equivocada, y alguien puede viajar hasta allá. Es el uso más literal que tiene el candado en todo el corpus.

⚠️ **Cada línea va separada por línea en blanco.** Con salto simple el render de Queswa las colapsa en un párrafo y el directorio se vuelve ilegible — mismo cuidado que las viñetas de FREQ_08.

⚠️ **No le roba consultas a FREQ_13.** Medido: *«es una pirámide?»* y *«es legal esto en Colombia»* siguen resolviendo a FREQ_13. FREQ_34 gana lo suyo con margen amplio — *«dónde queda la oficina de Cali»* con 0.449 contra 0.305 del segundo.

⚠️ **Reparto:** los teléfonos son FREQ_24, la prueba de legalidad es FREQ_13, y aquí solo van las direcciones.

### v5.96 — Nace FREQ_33 (el alivio operativo) y el par de perfiles se unifica en distribuidor (25 ago 2026)

**FREQ_33 responde algo que nadie respondía.** *¿Me toca empacar, cobrar, entregarle el pedido a cada cliente?* existía solo como una cláusula de paso dentro de WHY_02 —*«sin comprar inventario ni entregar pedidos»*— y no tenía fragmento propio. Quien hace esa pregunta se está imaginando de vendedor de catálogo, cargando cajas y persiguiendo pagos, y lo que lo desarma es saber **quién hace cada cosa**: la empresa cobra, empaca y despacha; a él le queda la comisión.

⚠️ **Se dice en afirmativo.** Enumerar las tres tareas que él NO hace se las mete en la cabeza para después tacharlas.

⚠️ **Las vías de compra son verificables y por eso convencen:** por internet, por la línea nacional gratuita (documentada en FREQ_24) o en cualquiera de las nueve oficinas (FREQ_13). El acceso de los clientes a **queswa.app** para armar y hacer su pedido está vigente, confirmado por el Director.

⚠️ **La fidelización se nombra por lo que el cliente RECIBE y por lo que el dueño DEJA de hacer** (confirmado por el Director el mismo día): promociones, beneficios del código y recordatorio de compra, **sin que usted les escriba**. Ese *sin que usted les escriba* es el valor entero; el mecanismo interno no le interesa a quien pregunta. Y el dueño lo ve desde su Dashboard.

⚠️ **El plazo de inactivación del código NO entra al corpus servido hasta conciliarlo.** `COMP_VIP_01` tiene escrito *«se sugiere una compra cada cinco meses para mantener la cuenta activa»* y la regla de campo del Director son **seis meses**. Probablemente no se contradicen —cinco es la sugerencia con margen, seis la regla de inactivación— pero mientras no esté confirmado, ninguna de las dos cifras se escribe.

⚠️ **La tarifa de envío se dice con el dato comprobable:** las tarifas están por debajo del mercado y **mandar veinticinco productos cuesta lo mismo que mandar uno**. El envío gratis es eventual y no constante, así que no se promete.

**El par de perfiles se unifica: cliente preferencial ↔ DISTRIBUIDOR.** Revisa la decisión del 8 ago, que hacía el contraste contra *socio de negocio*. **La regla que queda fijada: distribuidor es el rol formal** —son los dos tipos de código que existen, y el disparador de FREQ_22 ya pregunta por el *precio de distribuidor*— **y socio es el relacional**, para hablar de los suyos y del equipo. Mezclarlos le entregaba al prospecto dos palabras para un concepto en turnos seguidos, porque FREQ_21 cierra hacia FREQ_22. Barrido en FREQ_21, FREQ_22 y FREQ_25; los otros siete usos de *socio* son relacionales y se conservan (FREQ_01, FREQ_18, OBJ_02, EAM_02, DIASPORA_02, NET_01).

**FREQ_21 y FREQ_22 reescritas sobre borradores del Director.** Lo que entró de ellos: *«Esa es la base de la estabilidad»*, que le pone nombre al beneficio; *«porque les gusta el producto»*, que le devuelve dignidad al que solo consume —la versión vieja lo definía por lo que le falta, *no desarrolla nada*—; *«sin asumir ninguna responsabilidad comercial»*; y *«precio mayorista»*, más digerible que *precio de distribuidor* para quien llega nuevo. Lo que se les corrigió: *facturación* (es de Gano, a él le quedan comisiones), *su red* (→ su canal), *la persona* (→ quien lo consume), y tres adverbios de consultoría — *radica estrictamente en*, *puramente*, *estratégicamente*.

**La cadena de cierre queda encadenada:** FREQ_21 → FREQ_22 (qué es un cliente preferencial) → FREQ_33 (cómo compran) → el ejemplo con cifras.

⚠️ **FREQ_33 cierra con *«¿cuánto se mueve con un canal de puros clientes?»*, y esa forma engancha el pin del motor** (`cu[aá]nto se mueve con`), cuyo ejemplo por defecto es el de **renta** — el del consumo que se repite, que es exactamente el que corresponde a un canal sin distribuidores. El Director pidió un Flow nuevo para ese escenario; la máquina que ya existe lo responde, así que el Flow queda como mejora y no como bloqueante.

### v5.95 — FREQ_20 aísla la variable en vez de usar un espantapájaros (25 ago 2026)

**El ejemplo anterior no le pasa a nadie.** *«Mil clientes y ninguno compra da cero»* es cierto y es inútil: nadie tiene mil clientes que no compran, y quien examina el argumento lo nota. Servía con el que no lo examinaba.

**El nuevo aísla la variable** (idea del Director): deja fijas las personas —mil en los dos casos— y mueve solo el producto. *«Usted puede tener mil clientes que piden poco, o mil que piden cuatro veces más. Las mismas personas, y un ingreso que no se parece.»* El lector saca la conclusión solo, que es lo que hace que se la crea.

⚠️ **El múltiplo se le pega al PRODUCTO, no a la comisión.** Cuatro veces más producto es aritmética indiscutible; afirmar cuatro veces más comisión comprometería una mecánica que el Binario complica, porque paga sobre puntos emparejados. *Un ingreso que no se parece* dice la relación sin comprometer el múltiplo.

⚠️ **Sin unidad de empaque.** La primera versión contaba cajas, y el catálogo tiene máquinas y suplementos. Se mide en *producto que se mueve*, que además es el verbo canónico de WHY_02.

⚠️ **Y se nombran las dos vías del movimiento** — consumo recurrente y paquetes empresariales—, porque un ejemplo que solo cuenta consumo deja fuera la mitad. **Que el paquete genere más comisión se DEDUCE del primer párrafo y no se afirma:** dicho, pone el GEN5 por encima del Binario justo en el remate, que es el encuadre retirado el 9 ago.

⚠️ **Lo que se decidió no decir:** que una organización con diez distribuidores mueve más que una red de cien clientes. Es el argumento más potente y también el que más rápido dibuja la escalera de gente (decisión del Director).

⚠️ **Redacción:** la versión intermedia decía *«dos canales con mil clientes cada uno no le dejan lo mismo si en uno se mueve cuatro veces más producto»* y el Director tuvo que descifrarla. Apilaba una negación y una condicional antes del resultado, y su sujeto —*dos canales*— es una abstracción. La versión final pone al lector en la escena y deja el resultado al final.

### v5.94 — FREQ_20 habla como una empresa, no como un multinivel (25 ago 2026)

**La unidad pasa a ser el cliente.** Decía *«si en su canal se registran mil y ninguno compra»*, y **registrado es vocabulario del multinivel** — nombra a alguien por el acto de inscribirlo, no por lo que hace. Usarlo justo en la respuesta que niega el multinivel se lo confirma al que vino a sospechar. Ahora dice *«si en su canal hay mil clientes y ninguno compra»*: la misma aritmética, dicha como la diría cualquier empresa. Detectado por el Director.

**Y la respuesta termina en la cuenta.** Se retira el remate *«Por eso lo que cuenta son las compras, no los nombres»*. La cabecera del propio fragmento decía que el argumento se sostiene solo y que **todo lo demás sobra**; esa línea era todo lo demás — repetía en abstracto lo que el ejemplo acababa de demostrar con números, y encima terminaba en una negación. Cuerpo 411 → 285 caracteres.

⚠️ **Este sigue siendo el único fragmento donde la unidad es la persona y no la compra**, y es legítimo precisamente porque el resultado es cero: contar personas aquí sirve para demostrar que contar personas no paga.

⚠️ **La pregunta de cierre no se toca**: su forma engancha el pin del ejemplo dictado por el motor (`c[oó]mo se`), y reescribirla dejaría al «sí» del prospecto sin cifras.

### v5.93 — Cuatro ajustes quirúrgicos de narrativa (25 ago 2026)

**FREQ_04 — la ausencia de fecha se dice como criterio, no como límite nuestro.** Decía *«no hay una fecha fija, porque depende…»*, que suena a excusa. Ahora abre con **«en un negocio real no existe una fecha fija de retorno»**: la misma información con el signo cambiado — lo que parecía evasiva se vuelve prueba de seriedad, y de paso inocula contra quien sí promete plazos. Hallazgo de un borrador de Gemini que el Director trajo; su léxico se descartó entero (*garantizado*, *velocidad del sistema*, *apertura de cada nuevo canal en su red*, *siguiente liquidación semanal*, *métrica*, *volumen de facturación*) y se conservó solo la narrativa.

⚠️ **Y el ingreso crece por ACUMULACIÓN, no por repetición** (corrección del Director). Decía que crecía *«a medida que sus clientes vuelven a pedir»*, y eso es falso: si los mismos clientes repiten, el ingreso es el mismo mes tras mes. La recompra sostiene el piso; lo que levanta el techo es que **la base no se reinicia** — se suman los clientes nuevos de cada semana y los de sus distribuidores.

⚠️ **Las dos vías van fundidas en una idea.** El *cuándo* ya lo responde el párrafo del calendario de pago, así que la frase siguiente solo tiene que decir si el ingreso crece o se queda plano. Separarlas obligaba a nombrar dos mecánicas que el lector no pidió.

⚠️ **Y se retiró *«cuándo entra cada cosa»* y *«entra en la liquidación de ese ciclo»***: le producían fricción hasta a quien tiene el contexto completo del proyecto, y *liquidación de ese ciclo* se lee como que le pagan esa semana.

**Los clientes se SUMAN, no entran.** En esta industria *entrar* es el verbo de vincularse, así que aplicado a clientes importa el marco de reclutamiento justo donde la frase debía ser comercial. Corregido en FREQ_04 y en FREQ_22; en `arsenal_compensacion`, *«cada vez que alguien de su canal compra»* pasa a *«cada vez que se compra un paquete empresarial en su canal»*, que además cuenta compras y no personas. **Se conservan los usos legítimos:** los disparadores que traen la palabra del prospecto, y EAM_01, donde *quien entra con usted* habla de socios vinculándose, que es lo que el verbo significa.

⚠️ **Corrección del mismo día:** la versión intermedia decía *«son las dos principales»* a secas, borrando el *al inicio* del borrador del Director con el argumento de que degradaba al Binario. **El argumento era un error de lectura**: *estar activas desde el día uno* es cuándo se encienden, y *ser las principales al inicio* es cuáles producen mientras las otras diez todavía piden volumen o rango. Son dos hechos distintos y compatibles, y hay que decir los dos. Con el *al inicio* de vuelta, además, el primer párrafo prepara el segundo — el escalón que la versión intermedia había aplanado.

**FREQ_04_PUENTE — las 12 formas se reparten por horizonte:** cinco a corto plazo, tres a mediano y cuatro a largo (dato de campo del Director, doce años), y la explicación de las doce viene **en físico dentro del kit de inicio**. ⚠️ **El GEN5 y el Binario corren en paralelo desde el primer día**: presentarlas como las de *la etapa de inicio* degradaba al Binario, que es justamente el ingreso de largo plazo. La referencia interna de compensación ya lo decía así y ahora gana también el 5/3/4.

**PERFIL_01 deja de cobrar peaje.** Cerraba con *«Cuénteme a qué se dedica hoy, y le muestro…»*, que condiciona la respuesta a un dato. Quien duda de encajar —justo quien hace esta pregunta— muchas veces no lo entrega, y la conversación se queda sin paso siguiente. Además contradecía al propio cuerpo, que cubre a todos sin pedirles que se clasifiquen. Ahora propone el paso y sigue. De paso, *«alguien con su trayectoria»* pasa a *«alguien a quien le tienen confianza»*: la trayectoria presupone carrera y le habla mal a quien va empezando.

### v5.92 — Afinado de índices con datos de producción (25 ago 2026)

Los índices de la v5.91 se midieron primero contra los 58 de `arsenal_inicial`. En producción compiten **175 fragmentos de cinco arsenales**, y ahí aparecen colisiones que el laboratorio no ve. Seis consultas de las cuarenta no ganaban el primer puesto; dos de ellas las perdía contra un fragmento **con candado**, que se sirve solo y descarta a los demás — esos eran los defectos reales, porque el motor entrega top-3 y un segundo puesto sin candado enfrente llega igual al modelo.

**Resultado final en producción: 38/40 en el puesto 1 y 40/40 en el top 3.** Las cuarenta consultas alcanzan su fragmento.

**Tres cosas que enseñó el afinado, y las tres son contraintuitivas:**

1. **Alargar diluye.** Al añadirle disparadores a FREQ_17 para que ganara *«cada cuánto me consignan»*, su score BAJÓ (0.471 → 0.466). El texto indexado es corto a propósito; sumarle palabras reparte la señal. El lever es **acortar**, y así se resolvió: FREQ_17 y CRED_04 pasaron a juegos de disparadores mínimos y ganaron sus consultas.
2. **Corto y genérico se vuelve un atractor.** OBJ_01 quedó tan corto que empezó a ganar *tres* consultas ajenas sobre trabajo y día a día. Corto **sí**; genérico **no** — el índice se ancla a la formulación concreta de la objeción.
3. **Nombrar lo que no es, atrae lo que no es — también dentro del índice.** A OBJ_01 le escribí *«no la descripción de las tareas»* y se hizo MÁS fuerte en las consultas de tareas. Es la tesis de la investigación aplicada un nivel más abajo.

⚠️ **Un disparador ambiguo le cuesta la consulta a otro fragmento.** *«¿Me enseñan?»* vivía en FREQ_08 y significa dos cosas opuestas según quién enseñe a quién; se retiró, y *«¿Quién me consigna?»* se mudó de WHY_04 a FREQ_17, porque es mecánica de pago y no fuente del dinero.

⚠️ **Laguna del método:** el índice de FREQ_13 no traía *multinivel* ni *MLM*, palabras que sí estaban en su cuerpo (Ley 1700). Al dejar de indexar el cuerpo, la consulta *«¿esto es MLM?»* se fue al catálogo. **Al escribir un índice hay que barrer las palabras clave que el cuerpo tenía y él no.**

### v5.91 — El índice se separa del contenido servido, y la doctrina sale del contexto del modelo (25 ago 2026)

**Cada fragmento pasa a tener tres piezas con tres destinatarios distintos**, y por eso tres destinos:

| Pieza | Dónde vive | Quién la lee |
|---|---|---|
| `**[Índice]:**` — disparadores + 2-3 líneas escritas con las palabras de la persona | solo en el **embedding** | el buscador vectorial |
| Cuerpo | solo en el **contenido servido** | el modelo, y de ahí el prospecto |
| `**[Concepto Nuclear]:**` | solo en el **`.txt`** — el fragmentador lo recorta | los agentes que editan el archivo |

**Por qué.** La cabecera era el **47% de lo que se vectorizaba y se servía**. Eso tenía dos costos distintos y solo uno era el que parecía. El de recuperación resultó **marginal** —quitarla sin más casi no mueve la aguja, porque no es ruido fuera de tema sino verbosidad en la misma dirección—. El caro era el otro: instrucciones internas dentro del contexto del modelo, que él copia (*contextual entrainment*: un LLM sube la probabilidad de cualquier token presente en el prompt, y las instrucciones de ignorarlo apenas lo mitigan), y prohibiciones que le dictan justo lo que niegan. Ese fue el incidente de `COMP_GEN5_01`, y no fue mala suerte.

**Medido sobre este corpus**, 40 consultas coloquiales, `voyage-3-lite` 512d: acierto en el puesto 1 de **24/40 a 34/40**, top 3 de **31 a 38**, y el margen sobre el segundo de **0,023 a 0,082** — por 3,6. Mejoran 15, empatan 24, empeora 1. Arnés: `node scripts/experimento-indice-recuperacion.mjs`.

⚠️ **Añadirle el cuerpo al índice EMPEORA el resultado** (34 → 29). Lo que ahoga la señal no era solo la cabecera: era el texto largo. El índice se indexa solo.

**Efectos secundarios medibles.** El corpus servido baja de 88.493 a 47.090 caracteres, −47%. El texto indexado promedio queda en 272 caracteres, dentro del rango de 175-400 que recomienda Anthropic para el contexto prependido y que la cabecera de 739 duplicaba. Y las negaciones que el modelo lee pasan a **cero**, no por reescribirlas sino por sacarlas: una prohibición se lee mejor en negativo, y ahora puede estarlo sin costo porque el modelo no la ve.

⚠️ **Bug del fragmentador, anterior a este trabajo: `FREQ_04_PUENTE` nunca estuvo indexada.** El identificador se extraía sin exigir `:` al final, así que la alternativa `_\d+` casaba primero y devolvía `FREQ_04` — el mismo `fragmentCategory` que la respuesta anterior. El fragmentador la saltaba por «ya existe». Comprobado en Supabase: solo existe `arsenal_inicial_FREQ_04`, en los tres tenants. Arreglado y verificado contra los siete arsenales: mismos conteos, cero duplicados, y la respuesta recuperada.

⚠️ **Los otros seis arsenales heredan el recorte de la cabecera** (su doctrina sale del contenido servido) pero **todavía no tienen índice**, así que caen al comportamiento anterior para el embedding. Conviene re-fragmentarlos en el mismo despliegue: ganan el contenido limpio sin arriesgar la recuperación.

### v5.90 — El activo se nombra con una sola palabra, y la cadencia de pago se dice completa (25 ago 2026)

**El criterio nuevo lo puso el Director, y es de duplicación, no de estilo.** La información de este negocio se duplica como la de una franquicia: el término que se le enseña a un socio es exactamente el que él le va a enseñar al siguiente. Un vocabulario doble no se degrada en el arsenal — se degrada tres eslabones más abajo, en la boca de alguien que nunca leyó esto. Por eso el bautizo diferido *empresa digital* queda retirado y el activo se nombra **canal de distribución** en cuerpo y en cabecera, en los quince lugares donde no lo hacía. Sinónimo válido: *empresa de distribución*. Se conservan solo los **disparadores** que traen el término, porque son las palabras del prospecto: `EMPRESA_DIGITAL_01` sigue existiendo para aterrizar a quien lo oyó en otra parte, y ahora traduce al canónico en la primera línea.

**Los cuatro errores de hecho.**

1. **FREQ_17 decía mal la cadencia de pago.** Afirmaba que cada viernes Gano Excel suma «el consumo que se movió en esos días» y transfiere — que insinúa pago de la misma semana. Lo real: el ciclo corre de lunes a domingo y se liquida el **segundo viernes tras el cierre, doce días**. La semana intermedia es de conciliación —confirmaciones de pago, formularios, registros—, y decirlo así no es excusa: es lo que hace creíble el plazo. Este era el pendiente que CLAUDE.md dejó abierto («⏳ auditar si algún fragmento lo insinúa»). Fuente de verdad: `respuestaCiclo()` en `src/lib/ciclos-gano.ts`.
2. **La cifra de países quedó en 16** en las tres respuestas de diáspora. DIASPORA_01 se contradecía dentro del mismo párrafo: decía «los 15 donde Gano Excel opera» y tres líneas abajo «los 16 países de América».
3. **FREQ_28 servía una instrucción interna al prospecto.** Su cuerpo abría un párrafo dirigido al operador sobre una meta de fin de año que además ya no aplica. Fuera el párrafo, fuera los dos disparadores que lo llamaban, y la cabecera enuncia en afirmativo lo único que sigue vigente: la fase se cierra por cupos.
4. **WHY_PROD_01 explicaba la recompra por agotamiento**, contra lo que manda su propia cabecera. Pasa a explicarla por resultado, con la frase canónica de WHY_02 —*el cliente que nota la diferencia*—, que las dos comparten a propósito.

**Barrido de léxico.** Las vías del plan se nombran **formas de ganar**, doce en total (FREQ_04_PUENTE). *Dirigir*, retirado el 8 ago, salía todavía en NET_01 y DIASPORA_03. WHY_05, escrita el día anterior, había reintroducido *segundo ingreso* — el mismo término que FREQ_15 pide evitar y que WHY_03 contradice de frente. *Sus organizaciones* salía en DIASPORA_02.

**Dos listas de ausencias convertidas en presencias.** NET_01 remataba un bullet con tres cosas que no hay, y OBJ_02 abría enumerando tres destinos que el dinero no tiene — o sea, describiéndole tres fraudes para negarlos, justo en la respuesta sobre el monto. Es el mismo defecto que se corrigió en CRED_04 en la v5.78; la hermana había quedado intacta.

**Cuatro fallas estructurales.** NET_01 tenía **dos cabeceras `[Concepto Nuclear]` consecutivas**, las dos embebidas. FREQ_16 arrastraba la concordancia rota de un barrido anterior —género y número—, misma familia que los cuatro «toda su canal» de la v5.79. FREQ_31 y FREQ_32 compartían **dos disparadores idénticos**, así que el vector echaba suerte entre ambas. Y el pie del archivo seguía anunciando la v5.8.

**Cuatro cabeceras pasan a afirmativo.** FREQ_04_PUENTE, WHY_05, FREQ_15 y FREQ_21 nombraban el término vetado para prohibirlo — que es dictarlo, porque la cabecera viaja dentro del fragmento. Total de negaciones en cabeceras: 31 → 21; cabeceras afectadas: 20 → 15.

**Medición que acompaña este cambio** → `docs/investigaciones/resultados/CABECERAS_RAG_INVESTIGACION_AGO2026.md`. Dos hallazgos con consecuencias: las cabeceras son el **47% de lo que se vectoriza y se sirve** (no el 24% que decía CLAUDE.md), y **medir la recuperación con el disparador literal es circular** — el disparador está dentro del texto embebido. Toda medición se hace con paráfrasis coloquiales.


### v5.89 — WHY_05 y DUDAS_01: dos personas, dos respuestas (24 ago 2026)

Prueba del Director: *«no hace falta, sólo consultaba y tengo muchas dudas, ¿por qué uno debería desarrollar este negocio?»* recuperó ADV_OBJ_02 —escrito para quien ya tiene negocio— y el modelo le dijo *«lo demuestra su negocio actual»* a alguien que nunca lo dijo, y cerró ofreciendo lo ya visto. Mi primer borrador juntó en una respuesta al que valida y al que está incómodo y cerró con *«dígame cuál duda pesa más»*; el Director lo descartó: son dos personas, y esa pregunta examina. **WHY_05** responde la pregunta en frío: el ingreso depende de variables que no se controlan —un despido que nadie avisó, un mal trimestre de ventas, una semana en que no salió trabajo (el tercero, para el 30 % informal que vive al día)— y, cuando llega, ya tiene dueño; el canal es un plan para eso. Sin perfil, sin cifra, sin plazo; «clientes y distribuidores», no «socios» (actividad comercial, no gente que vinculo). **DUDAS_01** normaliza la duda, quita la presión de decidir hoy y cierra con una pregunta abierta que facilita seguir. Puertas para las dos (WHY_05 antes); prompt v4.22 con la separación.

### v5.88 — FREQ_32: «¿puedo pagar en partes?» empieza por el sí (23 ago 2026)

Prueba del Director: a *«me interesa iniciar, ¿puedo pagar en dos partes?»* FREQ_31 respondió primero los canales oficiales y al final el «sí». Regla del Director: los seres humanos queremos que nos respondan rápido lo que preguntamos; el contexto va después. FREQ_32 abre con «Sí, se puede», dice cómo en la misma frase y deja las formas en una línea; puerta directa antes de la de FREQ_31. También en esta pasada: las puertas del motor se evalúan antes del caché de búsqueda (dos veces FREQ_30 no disparó en vivo y sí en repro), FREQ_30 se entrega sin modelo (el modelo le pegaba el segundo tiempo al primero), el cierre del simulador de renta lleva al ejemplo del GEN5, «voy a consultarlo con mi esposa» en plena radicación vuelve al motor, y el prompt v4.21 ordena que ante «tengo dudas» la pregunta de cierre invite a nombrarlas sin atribuir perfil.

### v5.87 — FREQ_31, las formas de pago (23 ago 2026)

Prueba del Director, 23 ago: *«¿puedo pagar en dos partes?»* y *«¿qué opciones hay para la forma de pago?»* derivaban al socio «porque las condiciones varían según la región». No existía la respuesta. Hechos del Director: el pago va directo a Gano Excel por sus canales oficiales —consignación o transferencia, tarjeta de crédito; en la oficina débito o crédito, QR o llave; el efectivo solo por consignación en banco—, y se puede repartir en dos o hasta tres formas sobre el mismo número de orden. Cierra hacia la activación. Puerta directa en el motor.

### v5.86 — FREQ_30, la recomendación de paquete en dos tiempos (22 ago 2026)

Prueba del Director, 22 ago: a *"¿y cuál me recomiendas?"* el modelo respondió *"para un emprendedor que ya tiene negocio y círculo propio, el ESP-2"* — un perfil inventado, y sobre él bajó a la persona del ESP-3 que ella misma había nombrado. La doctrina del Director, de doce años de campo: **el negocio es el canal, no la venta de paquetes.** De diez que salen a buscar la plata del Visionario vuelven dos; de diez que ven que pueden arrancar con $900.000 —o con el Kit— arrancan ocho. Y lo que se duplica dentro del canal es la frase misma: *lo importante es iniciar*.

**Dos tiempos.** El primero es FREQ_30, con candado y puerta directa en `route.ts` (la clasificación se iba a compensación por "paquete"): *el que le resulte cómodo hoy; más allá del tamaño, lo importante es iniciar, y de paquete se puede subir después. ¿Con cuál arranca?* El segundo vive en el prompt (v4.20), porque depende del hilo: si la persona insiste —*"si fuera usted, ¿con cuál?"*— se le da el dato, el Visionario, y que decida. Quien insiste normalmente puede pagar cualquiera de los tres.


### v5.85 — WHY_PROD_01 deja el marco del consumo diario (22 ago 2026)

Prueba del Director, 22 ago: al «sí» de *"¿le muestro los productos?"* salió el candado de WHY_PROD_01 con su remate *"dentro de algo que su cliente ya toma todas las mañanas"*. Es el marco vetado desde el 8 ago —el café que ya iba a tomar igual—, que planta la comparación con el estante del supermercado antes de que la persona vea un precio; y estaba dentro de un fragmento cuya propia cabecera dice *"jamás en el estante del supermercado"*. Queda: *"en un producto premium que su cliente incorpora a su rutina"*. El párrafo siguiente ya explica la recompra por el resultado. Desplegado y clonado a whatsapp y dashboard.


### v5.84 — La condición de uso de STORY_03, enunciada por lo que la habilita (22 ago 2026)

La cabecera decía **"NO abrir con esto"** y explicaba el porqué en la misma línea: *en frío es un diagnóstico entregado como veredicto a alguien de quien no sabemos nada*. Son dos reglas distintas metidas en una — una habla de **posición** en el mensaje, la otra de **conocimiento**— y la que manda es la segunda. Esa confusión costó una vuelta completa de trabajo.

**Cómo se descubrió.** Al diseñar la prospección 1-a-1 del fundador a contactos que él conoce hace años, un agente citó la prohibición para descartar la narración del villano en el primer mensaje. El Director corrigió: *"los contactos van a ser a personas que conozco y de las cuales tengo contexto"*. Tenía razón, y no por la vía de que las prohibiciones caducan — **la regla, leída completa, nunca aplicó a ese caso**: su condición es el desconocimiento, y ahí no lo hay. La advertencia se escribió para Queswa, que recibe desconocidos llegados de un reel, y se leyó como si valiera para cualquiera que escriba.

**Qué cambia.** La condición se enuncia en afirmativo, como manda la doctrina de cabeceras: *se usa cuando ya se sabe de su situación — sea porque la contó en la conversación, sea porque quien escribe la conoce de antes*. Se agrega el supuesto que el arsenal no contemplaba, porque fue escrito para el trato con desconocidos: **que el emisor sea un humano con contexto previo**.

**Y se corrige un conteo.** La cabecera decía "dos piezas" y el candado tiene **tres**: falta contar *"es un ciclo de trabajar, pagar cuentas y repetir"*, que es lo que convierte el villano en estructura y no en un mal mes. El cuerpo no se tocó — el `<verbatim_lock>` está intacto.

⚠️ **Clonado a `whatsapp` Y a `dashboard`.** Este arsenal vive en **tres** tenants, no en dos; la receta de CLAUDE.md solo nombra `whatsapp`.


### v5.78 — CRED_04 deja de describir un fraude para negarlo (10 ago 2026)

**Estaba construida sobre tres negaciones**, y la última era la grave:

> *"**No** es como esos esquemas donde usted pone plata y, si la cosa se cae, **no** le queda nada en la mano."*

Eso **le describe un fraude para negarlo, en la respuesta sobre si va a perder su dinero** — el elefante nombrado en el peor momento posible, contra la regla de que el candado de confianza se afirma. Ahora responde con **lo que queda en la mano** (cajas que se despachan a su dirección, que puede tocar, consumir y vender) y con **hechos verificables**: 30 años, INVIMA, más de 60 países — el mismo criterio que funciona en FREQ_13 y FREQ_07.

**Cuerpo 611 → 457 caracteres. Retrieval al alza:** su pregunta principal sube de 0.629 a **0.668**, y *"¿qué respaldo tengo?"* —que se iba a STORY_01 con 0.435— ahora llega a CRED_04 con 0.457.

⚠️ **CRED_04 y OBJ_02 quedan diferenciadas, no fusionadas.** Comparten el argumento del producto físico porque sirve a las dos objeciones, pero **CRED_04 responde riesgo** (qué recibe y quién responde) y **OBJ_02 responde cuánto** (el monto y las tres formas de empezar). El vector las distingue: *es mucho dinero* 0.508 y *está muy caro para mí* 0.496 van a OBJ_02.

⚠️ **OBJ_02 pierde el marco del gasto doméstico.** Decía *"es plata que usted ya gastaba en consumo"* — misma familia que *"el café que ya iba a tomar"*, retirado el 8 ago y sacado de FREQ_09 en la v5.62. Había sobrevivido aquí. **Barrido verificado: 0 apariciones en todo el corpus.**

⚠️ **Hueco anotado, sin línea base para atribuirlo:** *"no puedo pagarlo"* —disparador literal de OBJ_02— lo gana `COMP_BIN_05` con 0.478, que responde *"¿cuándo me pagan?"*. Alguien que dice que no le alcanza recibiría el ciclo de liquidación. Es confusión léxica alrededor de *pagar* y probablemente es previa, pero no se puede afirmar sin medición anterior.

143 fragmentos por tenant, idénticos · 0 hits del auditor · 42/42 en la batería.

### v5.77 — FREQ_15 deja de cobrar 60 a 90 minutos al día (10 ago 2026)

El Director la daba por buena, y el argumento lo era: la analogía de *"igual que una empresa no cierra para abrir una nueva línea"* es de las mejores del arsenal —registro de negocios, eleva sin reclamar nada— y **se conserva íntegra**. Lo que estaba mal era otra cosa.

⚠️ **Cuantificar tiempo diario planta el marco de *"esto es más trabajo"***. Es el mismo por el que la **v5.34 le quitó a este fragmento la pregunta** de cuánto tiempo tenía — pero el cuerpo siguió **afirmando** el costo: *"unos 60 a 90 minutos al día"*. Contradice además la doctrina del 8 ago (el día a día son **dos acciones**, con la ligereza de abrir una app), y era una cifra que nadie puede sostener si la piden. En su lugar va la respuesta real: **compartir y recibir**.

⚠️ **Contradicción interna resuelta.** Decía *"un segundo ingreso"* tres veces mientras **WHY_03 afirma literalmente que esto NO es buscarse un segundo trabajo**. Quien recorriera las dos oía la negación y después su eco. Ahora dice *otro en paralelo* — y el término está en la lista de lo quemado por el multinivel: el ingreso en paralelo se vende como **actualizar**, no como conseguir otro empleo.

Salen los dos *dirigir*, retirados el 8 ago, y *"El sistema le pide que NO suelte su ingreso actual"* se vuelve afirmativo: *"sin soltar lo que gana hoy"*.

**Cuerpo 635 → 520 caracteres. Retrieval 4/4, sin dilución** — *"¿tengo que dejar mi trabajo?"* sube de 0.553 a **0.607**. La cabecera creció pero con vocabulario propio del fragmento, que es la diferencia con el caso de FREQ_24.

### v5.76 — FREQ_24: las opciones son para tranquilizar, no para repartir trabajo (10 ago 2026)

Dos correcciones del Director sobre la propuesta del agente, y la segunda es doctrina.

⚠️ **NOSOTROS lo registramos, y va primero.** Tanto la versión anterior como la propuesta ofrecían que la otra persona llenara el formulario. **Trasladarle la fricción a quien acaba de decidir es lo contrario de todo lo que promete el modelo.** Las vías alternativas existen para dar seguridad, no para devolverle el trámite.

⚠️ **La llamada se conserva a propósito.** El agente proponía retirar los teléfonos por no poder verificarlos y por ser de Colombia. El Director corrigió con un dato de campo: **para quien siente temor por lo tecnológico, poder hablar con una persona es lo que destraba la decisión** — no es un canal de segunda. Es el tipo de criterio que no se deduce del corpus.

⚠️ **Y la audiencia no era la supuesta.** No solo alguien ya adentro: también **alguien decidiendo, que quiere saber qué opciones tiene**. Eso la convierte en pregunta de **seguridad**, no de trámite, y cambia el tono entero.

Sale la diapositiva de tres bloques con viñetas; sale *Cliente VIP* del cuerpo (el canónico es **cliente preferencial** desde v5.53); el cierre pasa a los 50 PV. Las nueve ciudades salen de FREQ_13, donde están verificadas. **Cuerpo 1.006 → 655 caracteres.**

**Disparadores: se sumaron dos, no cuatro.** Se probaron cuatro y la medición mostró dilución — el principal caía de 0.704 a 0.685 y una formulación dejaba de resolver. Recortados a *¿qué opciones tengo para registrarme?* y *no soy bueno con la tecnología, ¿cómo me registro?*, queda en **7 de 7**, con el principal en 0.686 y la formulación del temor tecnológico —la persona que el Director describió— pasando de no existir a **0.573**.

⚠️ **Nota de método:** al medir esto el agente aplicó el umbral equivocado (0.4, que es el del **clasificador de arsenal**) cuando la búsqueda de fragmentos usa **0.30**. Los dos umbrales existen y no son intercambiables; confundirlos hace declarar rota una recuperación que funciona.

143 fragmentos por tenant, idénticos · 0 hits del auditor · 42/42 en la batería.

### v5.75 — CTA_01 eliminada, y las otras cinco redundancias resultaron falsas (10 ago 2026)

Aplicando el criterio que quedó de la v5.74 —*la pregunta útil no es "¿dicen lo mismo?" sino "¿el vector los distingue?"*— se midieron las seis candidatas a eliminación. **La medición confirmó una.**

| Candidato | Gana sus propios disparadores | Veredicto |
|---|---|---|
| `FREQ_24` | 3/4 — 0.702 · 0.608 · 0.497 | conservar |
| `FREQ_15` | 3/3 — 0.587 · 0.475 · 0.553 | conservar |
| `CRED_04` | 1/3, pero su pregunta literal con **0.629** | conservar |
| `FREQ_17` | 2/3 — *"¿cómo me pagan las comisiones?"* con **0.656** | conservar |
| `CTA_01` | **0/4** | **eliminada** |

**CTA_01 no tenía territorio propio.** Sus cuatro disparadores llegaban ya a fragmentos que responden mejor: *me interesa, ¿cómo empiezo?* → **FREQ_03** (0.583, la canónica del *cómo se inicia*, con candado) · *¿qué hago ahora?* → EAM_01 · *quiero saber más* → STORY_01 · *¿cuál es el siguiente paso?* → ADV_ESC_02. **No hubo disparadores que mudar: ya estaban donde debían.** Competía con el nodo de cierre desviando a *"una conversación sin compromiso"* justo donde la persona pedía los niveles.

⚠️ **Las otras cuatro salen de la lista de eliminación y pasan a la de *revisar contenido*, que es otra cosa.** Los dictámenes anteriores —hechos por parecido de contenido, sin medir— estaban equivocados: `PERFIL_01`, que se daba como duplicado de `FREQ_15`, **no aparece ni en el top 2** de ninguno de sus disparadores; `WHY_04`, dado como duplicado de `FREQ_17`, aparece segundo en una sola consulta. Lo que sí es real en `CRED_04` es que **comparte cuerpo** con `OBJ_02` —la misma frase del producto físico—, y eso se arregla diferenciando los textos, no borrando el fragmento.

**De seis redundancias declaradas por lectura, la medición confirmó una.** Es el argumento más fuerte que ha producido este método hasta ahora.

600 caracteres fuera · 51 → 50 respuestas · 143 fragmentos por tenant, idénticos · 0 hits del auditor · 42/42 en la batería.

### v5.74 — FREQ_23 eliminada; FREQ_27 abre con el hecho, no con el reclamo (10 ago 2026)

El motivo terminó siendo distinto del que parecía, y el recorrido vale la pena registrarlo porque es un caso de manual.

**Primera lectura:** *"FREQ_27 ya contiene a FREQ_23, sobra"*. **Segunda:** *"no — son audiencias distintas: una pregunta neutro y la otra reclama, y responderle a la neutra con «tiene razón en que la TRM es más baja» le planta una objeción que no trajo"*. **La medición decidió, y contra las dos:**

```
NEUTRAS → FREQ_23    1 de 4
   "¿cuánto vale el dólar para mis pagos?"  → FREQ_27 0.575   ← disparador literal de FREQ_23
   "¿la tasa es de mercado?"                → FREQ_27 0.507   ← disparador literal de FREQ_23
   "¿a cómo me pagan el dólar?"             → FREQ_27 0.615
```

La distinción que se estaba defendiendo **ya estaba colapsada en la práctica**: tres de cada cuatro formulaciones neutras llegaban a FREQ_27, incluidos dos disparadores propios de FREQ_23. Y con eso, **el defecto de plantar la objeción ya estaba ocurriendo** — eliminar FREQ_23 solo lo llevaba de 3 de 4 a 4 de 4.

⚠️ **Por eso el arreglo real no era eliminar, era la apertura.** Ahora abre con el dato —*la tasa es fija: $4.500 COP por dólar, sin importar la TRM del día*— y el reencuadre viene después, sirviendo igual a quien reclama y a quien solo pregunta. **158 → 104 caracteres**, y desaparece la repetición de la cifra en dos párrafos seguidos.

⚠️ **Lo que se pierde es una ganancia.** El ejemplo de FREQ_23 ilustraba *"$1.000 USD en comisiones semanales → $4.500.000 COP"*: una cifra de ingreso semanal sin condicionar, y encima mostrando USD a un colombiano — justo lo que dispara el reclamo que este fragmento atiende.

**Resultado: 8 de 8 formulaciones llegan a FREQ_27, y las neutras SUBIERON** (0.575→0.584, 0.507→0.522, 0.615→0.630). Los reclamos bajan una pizca (0.659→0.643), lo esperable al retirar la frase que los reconocía, y siguen dominando.

1.103 caracteres fuera · 52 → 51 respuestas · 144 fragmentos por tenant, idénticos · 0 hits del auditor · 42/42 en la batería.

**Lección de método:** cuando dos fragmentos parecen redundantes, la pregunta útil no es *"¿dicen lo mismo?"* sino *"¿el vector los distingue?"*. Aquí la respuesta era que no, y eso cambió el diagnóstico completo.

### v5.73 — STORY_03 conserva "¿Le suena conocido?" (10 ago 2026)

Revertida del barrido de cierres, por decisión del Director y con dos razones que apuntan al mismo lado.

**La de oficio:** STORY_03 es el villano narrado en segunda persona. *"¿Le suena conocido?"* **invita a la persona a contar lo suyo**, que es exactamente lo que uno quiere después de narrar el villano — y lo que un *"¿le muestro…?"* cierra. El criterio general del barrido (una pregunta que proponga un paso) **aquí se cumple de otra forma: el paso es que la persona hable.** Por eso este sí/no no encuesta, abre.

**La medida:** el reemplazo le costaba su propio disparador. *"No me alcanza, siempre estoy en lo mismo"* pasaba a OBJ_01 por 0.002; al revertir vuelve a STORY_03 con **0.517**, y el fragmento pasa de tres a **cuatro de sus cinco disparadores** resolviendo bien.

⚠️ **Anotado sin medir:** *"trabajo mucho y no veo resultados"*, disparador de STORY_03, lo gana OBJ_01 con 0.523. No hay línea base previa de esa frase, así que no se puede afirmar si es de ahora o preexistente.

Es la única de las 20 que se revierte. 42/42 en la batería · 0 hits del auditor.

### v5.72 — La pregunta de cierre sale del candado (10 ago 2026)

Inquietud del Director, y resultó estructural: *"cuando la pregunta de cierre es una que ya se resolvió antes, el usuario lo siente como un error nuestro"*.

**Y con el candado puesto, el modelo no podía evitarlo aunque se diera cuenta** — la regla del `verbatim_lock` dice que manda sobre todo lo demás. Estaba en **13 de los 15 candados**, justo los de más tráfico. El caso demostrable: `WHY_01`, `WHY_02`, `FREQ_10` y `WHY_ROL_01` **ofrecían los cuatro lo mismo** (*cómo se gana*); quien recorriera dos recibía dos veces la misma oferta.

⚠️ **El candado protege el argumento, no la pregunta.** El cuerpo sigue bloqueado carácter por carácter — es lo calibrado y lo que no admite paráfrasis. La pregunta queda afuera como **valor por defecto**, y los dos system prompts (`nexus_main` v29.8, `queswa_whatsapp` v4.8) instruyen reemplazarla cuando ofrezca algo ya entregado.

⚠️ **Se le dio el mapa de destinos servibles**, para que "elegir el siguiente paso" sea escoger de una lista y no improvisar — que es exactamente como entró el trámite de sucesión inventado en FREQ_05: *de dónde sale la plata · los números del plan · el catálogo · qué hace usted en el día a día · las tres formas de empezar · cómo se comprueba la legalidad · qué trae cada paquete · cuánto ahorra un cliente preferencial*. Verificado que el último está servido con cifra exacta en CLIENTE_VIP_01.

⚠️ **El contrato de doble fuente cambia de igualdad a PREFIJO.** `respuestas-maestras.ts` conserva el texto **completo con su pregunta**, porque Camino A lo sirve directo y ahí no hay adaptación posible; el candado del arsenal es ahora su prefijo exacto. Verificado en los cinco — **no hizo falta tocar el módulo TS**. La verificación pasa de *"longitudes idénticas"* a *"la constante empieza con el candado, y lo que sobra es la pregunta"*.

**20 preguntas reescritas — 1.888 → 1.009 caracteres.** Diez pedían asentimiento sin proponer nada (*¿le da tranquilidad…?*, *¿le parece sólido…?*, *¿le hace sentido…?*); cinco prometían lo que ningún fragmento atiende (*cómo se ensambla en su caso*, *cómo se encienden esas tres piezas*); cuatro daban dos o tres salidas; y una —`FREQ_27`— ofrecía *una proyección de su ingreso recurrente*, que es promesa de ingreso. Todos los destinos verificados como contenido servido.

⚠️ **LECCIÓN — el vocabulario genérico en el cierre diluye el fragmento.** Medido: 25 de 27 consultas conservan ganador, y los dos cambios son empates de 0.002. Pero la causa es instructiva: los reemplazos usaron palabras de alta frecuencia en todos los arsenales (*ingreso*, *canal*, *ciclo*), y eso **acerca el fragmento al centro del corpus en vez de anclarlo a su propio territorio**. `WHY_03` terminó tirando hacia compensación por culpa de su propia pregunta de cierre. Al escribir un cierre conviene preferir la palabra que solo tiene sentido en ESA respuesta.

**Estado: 145 fragmentos por tenant, idénticos · 0 hits del auditor · 42/42 en la batería · prompts v29.8 y v4.8 desplegados con etiqueta nueva** (la anterior no cambiaba de número y el despliegue quedaba invisible en `leer-system-prompt.mjs`).

### v5.71 — FREQ_25 deja de afirmar algo incorrecto sobre el pago (10 ago 2026)

Lo que parecía una limpieza de jerga resultó ser un **error de mecánica**. FREQ_25 decía que el consumo de la familia *"fluye como CV hacia su Centro de Negocios de Cobro"* — como si cayera automáticamente en el lado que paga. No es así: dónde queda ubicado cada código lo define la **Colocación**, y el centro que paga es el de **menor volumen acumulado**, que lo determina el ciclo. Afirmarle a alguien cómo le van a pagar, y que no sea cierto, cuesta más que cualquier palabra mal elegida — y estaba en una respuesta de dinero.

⚠️ **El término se conserva donde sirve.** *Centro de Negocios de Cobro* no es jerga heredada: es **nuestro reemplazo de "pierna débil"**, y en `arsenal_compensacion` está definido y el lector ya tiene contexto. Verificado tras el cambio: sobrevive en COMP_BIN_08 y COMP_BIN_11, cero en primer contacto. Lo que no tenía sentido era usarlo donde alguien pregunta si el café de su esposa cuenta.

Salen también *CV*, *volumen comisional*, *bajo su patrocinio*, y el marco del **gasto del hogar** —retirado el 8 ago— que seguía vivo aquí.

**FREQ_26** pasa de lista con viñetas y rótulos en negrita —que convierten el chat en una diapositiva— a prosa de cuatro frases. Pierde los nombres legales completos de los fundadores, que en una respuesta operativa suenan a escritura pública.

**Los dos cierres salen de la auditoría de los 19.** El de FREQ_25 pedía *"explorar cómo se planifica una expansión familiar como punto de anclaje inicial"* y ahora lleva a **FREQ_24** (cómo se inscribe un código); el de FREQ_26 preguntaba si le interesa *"ver cómo Queswa absorbe el 90%…"* y ahora lleva a **EAM_01**, con candado.

**Medición — y cierra un pendiente del barrido anterior.** Los dos cambios de ganador son **mejoras**:

| Consulta | Antes | Ahora |
|---|---|---|
| *"¿el consumo de mi hogar cuenta?"* | FREQ_09 · 0.502 | **FREQ_25 · 0.570** |
| *"¿mi esposa puede comprar bajo mi código?"* | CLIENTE_VIP_01 · 0.496 | **FREQ_25 · 0.523** |

La primera era el empate de 0.001 que dejamos sin tocar en el barrido de vocabulario, con el criterio de que empujar un embedding para ganarle a la propia prueba es afinar contra el examen. Se resolvió sola **al arreglar el fragmento**, que era el diagnóstico correcto.

668 → 521 y 1.575 → 1.267 caracteres · 145 fragmentos por tenant, idénticos · 0 hits del auditor · 42/42 en la batería, en los dos tenants.

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

### v13.5 — Los 16 fragmentos ganan su índice (25 ago 2026)

Mismo modelo que `arsenal_inicial` v5.91: `[Índice]` al embedding, cuerpo al contenido servido, `[Concepto Nuclear]` recortado y solo para quien edita.

**El motivo lo destapó la medición, no la teoría.** Al indexar `arsenal_inicial` por índice corto y dejar los demás compitiendo con su cuerpo largo, la competencia quedó **asimétrica**: los índices cortos producen vectores concentrados que ganan casi siempre. Dos consultas del benchmark se desviaron —*«¿yo tengo que enseñarles?»*, que es de ADV_SIST_03, se fue a FREQ_08, **que lleva candado y por tanto se sirve sola**—. Comprobado contra el respaldo de embeddings previos: antes ganaba ADV_SIST_03; el desvío lo introdujo el cambio.

⚠️ **Regla que se desprende: un corpus no puede estar medio migrado.** Mientras `arsenal_compensacion`, `catalogo_productos` y `arsenal_12_niveles` sigan sin índice, compiten en desventaja contra los dos que sí lo tienen.

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

### v7.9 — PROD_04 deja el registro viejo (22 ago 2026)

Era el único fragmento del catálogo que seguía hablando como hoja de cálculo: *«lógica financiera en dos niveles»*, *«terminal de activación»*, *«retorno sobre terminal: en 12 meses el consumo supera 2,3× el valor de la máquina»*, *«$110.900/mes × 12 = $1.330.800/año»*. Dos problemas: el léxico retirado, y una proyección de retorno con cifra anual que además asume una caja al mes como hecho. Le llega a quien pregunta *«cómo funciona el modelo Luvoco»* (0.586, primero). Reescrito desde el negocio y por mecanismo —la máquina se compra una vez, las cápsulas son las que se repiten, y son exclusivas de la máquina—, sin proyectar; cierra con la misma pregunta de LUV_00, que recupera la tabla LUV_01 (medida como aceptación). Aprobado por el Director.

### v7.8 — El «sí» al Luvoco llega a la tabla (22 ago 2026)

Segunda prueba del día. A *«¿Le muestro las tres intensidades con su precio?»* la persona dijo «sí», la aceptación buscó con esa pregunta, y el vector devolvió otra vez LUV_00 (0.525) — LUV_01, la tabla con los precios, ni aparecía en el top-6. Sin cifras el modelo rellenó: derivó al equipo y agregó una frase de margen de reventa que no existe en ningún arsenal. Era la regla de *no cerrar con una pregunta que el arsenal no pueda atender*, incumplida por medir la pregunta de entrada y no la aceptación de salida. La pregunta pasa a *«¿Le muestro el sistema Luvoco con sus precios?»* → LUV_01 a 0.644, y con candado se sirve sola. **Criterio nuevo para toda pregunta de seguimiento: se mide también como consulta de aceptación.**

### v7.7 — El Clásico es premium, y el Luvoco tiene puerta (22 ago 2026)

Dos hallazgos de la prueba del Director en el canal, el mismo día.

**BEB_07 (Ganocafé Clásico).** El párrafo sensorial decía *"en taza es el mismo café de siempre"* — escrito para honrar al purista que no quiere que le mejoren el tinto, pero ejecuta el marco del estante del supermercado que el resto del arsenal prohíbe (PROD en `arsenal_inicial`: *"jamás en el estante del supermercado"*), y el modelo lo copió textual en el chat. Queda: *"En taza es un café premium — cuerpo, aroma y el amargo justo, el que uno espera de una buena cafetería"*. La fidelidad al purista sigue en la primera línea.

**LUV_00 (nuevo).** *"¿Y los beneficios del café Luvoco?"* no tenía a dónde llegar: «luvoco» a secas enrutaba a LUV_01, que es la tabla bajo candado (máquina + tres cápsulas + compatibilidad), y el candado se sirve solo; LUV_02–04 son por cápsula y PROD_04 habla en el registro viejo (*"terminal de activación"*, *"retorno sobre terminal"*). El modelo compuso bien, pero admitió que *"no tenía detallados"* los beneficios. Fragmento **corto** a propósito —es lo que abre puertas, medido el 17 ago— que describe el café como experiencia: extracción a presión, tres intensidades por paladar, la máquina se compra una vez y las cápsulas se repiten. Hechos verificados en luvoco.ganoexcel.com.co: café molido tostado infundido con betaglucanos de Ganoderma lucidum, 8 g por cápsula, Suave de acidez pronunciada · Medio equilibrado · Fuerte amargo y ahumado. Por indicación del Director no se describe la crema. ⏳ PROD_04 sigue en registro viejo — pendiente.

**En el mismo día, fuera del arsenal:** el cierre de WhatsApp (`wa-radicacion.ts`) dejaba de reconocer como digresión una frase nominal corta sin signo ni verbo de pedido (*"Y LOS BENEFICIOS DEL CAFÉ LUVOCO"*, seis palabras) y pedía el nombre completo en vez de responder — ahora cuenta tema y producto nombrado; el texto dictado del simulador GEN5 y los pines de renta/GEN5 del motor decían *"el viernes de la semana siguiente a la compra"* / *"a medida que las compras ocurren"*, cadencia más rápida que la real (el ciclo se paga el segundo viernes tras su cierre) — ahora *"por ciclos semanales, cada viernes"*; y el enlace al catálogo (`/{slug}/productos`) lo emite el webhook en vez de improvisarlo el modelo.

### v7.6 — Lo que se rechaza deja de escribirse donde el modelo lo lee (22 ago 2026)

Salió de auditar `/sistema/productos`, la página web del catálogo, donde **22 declaraciones de salud llevaban meses publicadas**: mejora de circulación, funcionamiento de riñones y pulmones, prevención de placa dental, protección celular, desarrollo de huesos, función sexual. La vara es el catálogo de la Sala Especializada del INVIMA que se descifró el 17 ago: solo aprueba la forma *"contribuye al funcionamiento **normal** de X"*, exige el 100% del valor de referencia diario, y **no menciona Ganoderma ni una vez** — todo claim del hongo vive fuera del carril blindado. La página quedó reescrita desde lo sensorial y el ritual; se conservan energía, vitalidad, antioxidante, adaptógeno y defensas, que son la línea verificada.

**Lo que cambió aquí son dos líneas, y las dos son el mismo error nuestro.** La nota de versión de v7.5 explicaba qué se había dejado fuera **citando las frases textualmente**, y la cabecera `[Concepto Nuclear]` de BEB_09 prohibía nombrando: *"nunca una comparación con azúcares ni una promesa de control de peso"*. Las dos viajan dentro de texto que el modelo lee —el documento padre se indexa, y la cabecera va dentro del fragmento—, así que enunciarlas era dictarlas. Es el elefante rosado, y es la tercera vez que cae en este proyecto.

Las dos se reescriben en **afirmativo**, diciendo dónde SÍ vive el vocabulario: la nota remite a este CHANGELOG, y BEB_09 dice que la respuesta vive en el sabor y en el momento del día. El motivo puede escribirse aquí porque este archivo **no se indexa**; ese es todo el criterio de reparto.

**Del guardarraíl:** `wa-guardarrail-salud.ts` dejaba pasar las 22 — miraba enfermedad, mecanismo, adelgazamiento y ciencia citada, nunca la declaración de órgano. Cerrado con tres patrones, dejando fuera a propósito el **sistema inmune** (práctica de mercado que el fabricante usa y que ninguna sanción del período castigó) y las **articulaciones** (el colágeno sí tiene declaración aprobada, Acta 10 de 2017, ahora citada textual en el Reskine). Verificado en las dos direcciones: 0 de 114 declaraciones cruzan, y ninguna línea de los cuatro arsenales se bloquea por los patrones nuevos.


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

### v5.7 — NIVELES_02 y NIVELES_07 pasan a emparejar (23 ago 2026)

«Los puntos compensados de ambos lados» y «paga sobre el lado de menor crecimiento» → cada punto del canal izquierdo se empareja con su equivalente en el canal derecho; conviene ayudar a crecer el canal que va más despacio porque cada punto que entra ahí encuentra su pareja de inmediato. Ver compensación v8.1.

### v5.6 — La cifra del nivel 12 se explica por su origen (23 ago 2026)

**El hallazgo, y es de aritmética.** Los $103.194.000 admiten DOS lecturas y la tabla no decía cuál:

- *"la suma de doce niveles"* → $25.200 × (2¹²−1)
- *"el 10% del volumen de un lado de la estructura completa"* → 4.095 × 56 CV × $4.500 × 10%

Dan el mismo número porque **son la misma multiplicación**: $25.200 = 56 CV × $4.500 × 10%, y 2¹²−1 = 4.095 = las personas de un lado. No es coincidencia, es álgebra.

Lo que lo vuelve genuinamente ambiguo es que **56 CV son dos cosas a la vez**: el Kit que cada quien compra al entrar (una vez) y las 4 cajas de la recompra mensual (todos los meses). Leído como entrada, es un acumulado; leído como recompra, es lo que ese canal produce **cada mes que consume**. Las dos lecturas son ciertas y el plan paga sobre los dos volúmenes.

**La salida no es elegir una lectura: es nombrar de qué volumen sale.** Dicho como *acumulado* subvende; dicho como *$103 millones mensuales* corona la pirámide. El fragmento ahora dice el origen: 10% de un lado, sobre una facturación de **más de $3.600 millones COP al mes** — la comisión es el **2,84%** de lo que ese canal vende.

Ese 2,84% es la pieza que faltaba. **Un número grande sin origen se lee como magia; el mismo número como tajada pequeña de una facturación enorme se lee como un negocio.** Y remata con el argumento del Director: *la compañía no paga por gente vinculada, paga un porcentaje de lo que se vende.*

**`ganancias` → `comisiones` en todo el cuerpo.** Una comisión dice de dónde viene; una ganancia, no. Se conserva en el DISPARADOR de NIVELES_02 (*"¿cómo funciona el plan de ganancias?"*), que lleva las palabras del prospecto.

⚠️ **Se descartó el ángulo del millón de dólares.** A la tasa del fabricante ($4.500) la facturación es USD 807.352 — no llega al millón; llega a USD 1.18M solo a la tasa de mercado. Usar la del mercado para la facturación y la del fabricante para la comisión es una mezcla que no se sostiene si alguien la revisa, y además choca con la regla de moneda (a Colombia, solo pesos). En pesos el número es **más grande**, no más pequeño.

⚠️ **Corrección a una cuenta previa de esta sesión:** el CV **no** es una conversión de moneda. El peso por CV depende del producto ($7.921 en el Ganocafé, $9.000 en el ESP-3); los $4.500 son la tasa de **liquidación**, no el valor del producto. La facturación real es $3.633.084.000 COP, no los $1.719.900.000 que se calcularon usando el CV como si fuera precio.


### v5.5 — El léxico pasa a la actividad comercial (23 ago 2026)

Revisión del Director sobre este arsenal en concreto. **La proyección de los 12 niveles es el mejor ejemplo que tenemos de apalancamiento y crecimiento a escala, y es también el que más fácil dibuja una pirámide.** La diferencia no está en las cifras —quedan intactas— sino en cómo se nombra a quien las produce.

**Quienes componen la estructura pasan de `socios` a `distribuidores`.** Las dos palabras incluyen personas; la segunda incluye además la **actividad**. Un distribuidor mueve producto, y ese es el hecho que sostiene la cifra.

**Y `empresario` sale de este arsenal**, aunque suene mejor. Criterio del Director: el mercadeo en red lo usó tanto que dejó de leerse como actividad comercial y pasa por muletilla del gremio — la gente no lo asocia con mover producto sino con hacer redes. ⚠️ **Esto vale para ESTE archivo**; en los demás se auditará aparte antes de tocar nada.

**Ningún conteo va en abstracto.** La columna `Nuevos` pasa a `Nuevos distribuidores`: un número sin sustantivo lo rellena el lector, y en una tabla de duplicación lo rellena con gente.

**El acumulado deja de llamarse ingreso recurrente.** Los $103.194.000 del nivel 12 son la **suma** de las regalías a lo largo de la construcción, no un flujo mensual. Presentarlos como recurrente promete un ingreso que esa cifra no describe.

⚠️ **La cabecera de versión se reescribió como criterio.** La anterior narraba cuatro bautizos citando sus términos retirados —*personas*, *red*, *empresario activo*— y este documento **se indexa entero**: cada término citado volvía al corpus por la puerta de atrás. El detalle histórico vive aquí, que no se indexa.

⏳ **Pendiente en INV_02:** *"el Kit gana $1,000 USD mientras ESP-3 gana $1,700 USD"* convive con la tabla de precios en el mismo fragmento. El Director lo dio por correcto de contenido; queda anotado que el guardarraíl de negocio bloquea esa coincidencia en la salida del modelo desde el 22 ago.


### v5.3 — INV_06 con los nombres del catálogo (22 ago 2026)

Misma corrección que compensación v8.0: la tabla de productos para completar los 50 PV usaba los nombres en inglés del back office. 13 ocurrencias renombradas; sin cambios de puntos.


### v5.4 — INV_00: la opción menor al ESP-1 tiene puerta (22 ago 2026)

Prueba del Director, 22 ago: *«me interesa iniciar, ¿hay una opción menor al paquete ESP-1?»*. La pregunta tenía respuesta (INV_01, el Kit de Inicio) y no la recibía: con «paquete» y «esp1» en el texto la clasificación iba a compensación y el routing directo devolvía la composición del ESP-1; por vector, INV_01 quedaba sexto (0.451). Decisión del Director: **los tres paquetes empresariales son la entrada estándar, y el Kit de Inicio es una opción menor válida cuando la piden.** INV_00 es corto y dice las dos cosas —qué es la entrada estándar, qué trae el Kit y qué habilita— y su pregunta de seguimiento abre FREQ_03 por puerta. En el motor: patrón en `patrones_12_niveles` + puerta directa a INV_00; caso nuevo en el benchmark del clasificador. En el canal, además, el cierre deja pasar al motor la volición que llega con pregunta (*«me interesa iniciar, ¿hay…?»* abría el trámite y la pregunta quedaba sin responder), y la tabla del paquete la dicta el backend sin modelo (la del 21 ago salió con Rooibos y Latte, que el ESP-3 no trae).

### Mayo 2026 — Aforismo Tridente canónico

Línea 164: aforismo corregido a "Usted no explica — Queswa explica". 13 fragmentos re-embebidos con voyage-large-2 + voyage-3-lite.

---

## Versiones anteriores

Para historial pre-v25.3, consultar `git log -- knowledge_base/<arsenal>.txt`. Las versiones explícitas tienen tag de fecha; las implícitas se infieren del commit.
