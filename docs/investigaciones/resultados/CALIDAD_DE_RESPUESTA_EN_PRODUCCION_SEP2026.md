# Que el primero que llega no se lleve una mala experiencia

**Investigación · 23 sep 2026 · encargada por el Director**

> ## ⛔ CORRECCIÓN DEL MISMO DÍA — LEER ANTES QUE NADA
>
> **La primera versión de este documento midió sobre un universo contaminado y su
> conclusión principal era falsa.** Queda escrita abajo, tachada, porque el error
> vale más que el hallazgo.
>
> **Qué pasó.** Separé las personas de los arneses con el filtro por patrón de
> `auditar-conversaciones.mjs`. Ese filtro no sirve: `prueba-productos.mjs`
> genera huellas `wa_57300` + 7 dígitos, que son exactamente doce, la longitud de
> un móvil colombiano que empieza por 300. Mirando la cadena no hay forma de
> distinguirlos.
>
> **La señal que sí funciona** es `wa_mensajes_procesados`, la guarda de reenvíos
> del webhook: cada mensaje que una persona manda de verdad deja su fila. Un
> arnés llama a `/api/nexus` directo y nunca pasa por ahí.
>
> | | Como lo medí primero | **La verdad** |
> |---|---|---|
> | Huellas de WhatsApp | 403 | **40** |
> | Turnos de personas | 819 | **339** |
> | Hilos de un solo turno | 84 % | **18 %** |
> | Abandono base | 15 % | **11 %** |
> | Abandono tras un «sí» que cayó al vector | **71 %** (41 casos) | **8 %** (13 casos) |
> | Preguntas de dos salidas | 50, y 15 mataron el hilo | **5, y ninguna mató un hilo** |
>
> **Qué se cae:** que la pregunta de dos salidas sea el fallo que más gente nos
> cuesta. No lo es. Era el eco de un arnés que hace preguntas de producto en
> sesiones de un solo turno, así que todos sus «hilos» morían por construcción.
>
> **Qué se sostiene:** que el modelo compone preguntas de dos salidas contra una
> regla escrita (5 turnos reales), y los bucles de Oswaldo y de María, que no
> salieron de ninguna estadística sino de leer sus conversaciones.
>
> **Lo que de verdad enseña este documento** es que *el universo de medición se
> valida antes que la medición*. Y que el tráfico real del canal son **40
> personas en 30 días**: cada una pesa el 2,5 %, ninguna conclusión se sostiene
> en promedios, y leer las conversaciones una por una no es artesanía, es el
> método correcto a esta escala.

---

> **La pregunta:** las primeras personas que entraron al canal tuvieron malas experiencias. ¿Qué mecanismo evita que se repitan?
>
> **La respuesta corta, ya corregida:** el canal atiende **40 personas en 30 días**. A esa escala no hay fallo «dominante» que un promedio revele: los que se llevaron una mala experiencia se encontraron leyendo sus conversaciones, una por una, y así se van a seguir encontrando. Lo que sí escala es **detectar y encolar** lo que ya sabemos reconocer, para que nadie dependa de acordarse de mirar.

---

## 1. Lo que se midió ⛔ (cifras contaminadas — ver la corrección de arriba)

Treinta días de `nexus_conversations`, separando a las personas de los arneses con el mismo filtro de `auditar-conversaciones.mjs`.

| | |
|---|---|
| Turnos de personas reales | 819 |
| Hilos | 403 |
| Abandono base (turnos que no son el primero y aun así fueron el último) | **15 %** |

Ese 15 % es la línea contra la que hay que comparar todo lo demás. Un hilo que termina no siempre es un fracaso: mucha gente pregunta una cosa, la recibe y se va satisfecha.

## 2. La taxonomía, con su tamaño real

Siete detectores corridos sobre los 819 turnos. La columna que importa no es cuántas veces ocurrió, sino **cuántas veces el hilo murió ahí**.

| Fallo | Turnos | % | Murió el hilo | Tasa de abandono |
|---|---|---|---|---|
| **Aceptación pelada que cae al vector** | 41 | 5,0 % | **29** | **71 %** |
| Repite el turno anterior, mismo texto | 10 | 1,2 % | 3 | 30 % |
| Sirve un fragmento ya servido en el hilo | 6 | 0,7 % | 1 | 17 % |
| Anuncia su propia honestidad | 2 | 0,2 % | 1 | — |
| Pesos con coma de miles | 1 | 0,1 % | 1 | — |
| Léxico retirado | 0 | — | — | — |
| Respuesta vacía o de error | 0 | — | — | — |

**El primero se lleva todo.** Ocurre cinco veces más que el segundo y mata el hilo **4,7 veces más que la línea base**. De los 403 hilos del mes, 29 terminaron exactamente ahí.

⚠️ Esto es correlación, no causa probada. Pero 71 % contra 15 % no se explica por azar, y las conversaciones se leen: la persona dice «sí», recibe algo que no pidió, y no vuelve a escribir.

## 3. El hallazgo ⛔ RETIRADO: la pregunta que no se puede contestar con «sí»

> Lo que sigue se midió sobre el universo contaminado. Sobre personas reales son
> 5 turnos y ninguno mató un hilo. Se conserva porque el mecanismo que describe
> es real y la regla que lo prohíbe existe; lo que era falso es su tamaño.

Al mirar **qué estaba aceptando** cada una de esas 41 personas, el patrón salta a la vista.

| La oferta con la que cerró Queswa | Veces | Murió |
|---|---|---|
| ¿Cuál de los dos tiene en su pedido? | 5 | 5 |
| ¿Cuál de los dos va más con su rutina? | 3 | 3 |
| ¿Cuál de los dos va más con su forma de tomar café? | 2 | 2 |
| ¿Cuál va más con su forma de tomar el café? | 1 | 1 |
| ¿Cuál se acerca más a como toma usted el café? | 1 | 1 |
| ¿Prefiere el tinto solo o le gusta con crema y dulce? | 1 | 1 |
| …y ocho variantes más de lo mismo | 8 | 7 |

**Dieciséis de las cuarenta y una son preguntas de dos salidas, y quince mataron el hilo.**

Esto ya está documentado como regla desde el 7 de agosto: *una sola pregunta, una sola salida; el ser humano retiene la última opción, responde «sí» pensando en una de las dos*. La regla existe, está escrita, y **el modelo la sigue rompiendo**, porque esas preguntas las compone él, no salen de ningún fragmento.

Y cuando la persona contesta «sí», el motor busca con esa pregunta como ancla. La pregunta no es de ningún fragmento, así que el buscador devuelve lo que se le parezca. La persona pidió elegir entre dos cosas y recibe un discurso.

> **Una regla que no se sostiene con disciplina se arregla con arquitectura.** Es la misma conclusión que ya sacó este proyecto con las cabeceras del arsenal y con los typos.

## 4. Las dos propuestas del Director, evaluadas

### 4.1 «Auditar cada respuesta antes de entregarla»

**Es viable, ya lo hacemos, y no debe correr sobre todo.**

El canal ya valida el borrador antes de enviarlo: los guardarraíles de salud y de negocio descartan y reemplazan la respuesta. El patrón está probado en producción. Lo que falta es extenderlo.

Medido con un juez de Haiku sobre un borrador real:

| | |
|---|---|
| Latencia, mediana de tres llamadas | **1 353 ms** |
| Tokens | 220 de entrada, 63 de salida |
| Veredicto | Cazó la pregunta de dos salidas y dijo por qué |

Contra el presupuesto del canal: la mediana de un turno son 8 s y el percentil 95 son 15,9 s. El webhook muere a los 30 s. Sumar 1,35 s a todos los turnos deja el percentil 95 en 17,2 s. Cabe, pero se come el margen que hoy protege del arranque en frío, que llegó a 35 s.

**Y el cálculo no compensa.** La industria mide que las comprobaciones deterministas cazan entre el 30 y el 60 % de los fallos reales en menos de 50 ms y a costo cero, y que el juez con modelo caza el resto semántico pagando de 100 a 3 000 ms. En nuestros datos el reparto es aún más favorable al lado barato: los cinco detectores deterministas de la tabla cubren **el 97 % de los turnos marcados**. Pagar 1,35 s en el 100 % de los turnos para cazar el 3 % restante es mal negocio en un canal donde cada segundo acerca al techo de Meta.

**Lo que sí recomiendo:** el juez corre **asíncrono sobre todos** los turnos, después de entregar, sin costarle latencia a nadie; y **síncrono solo** cuando el turno es de alto riesgo o el detector barato quedó en duda.

### 4.2 «Que Claude genere la respuesta»

**En el camino caliente, no. Fuera de él, es exactamente lo que funcionó hoy.**

En el camino caliente hay dos problemas. El primero es que yo no estoy siempre presente: una persona escribe a las once de la noche y nadie va a revisar su turno antes de que salga. El segundo es que ya existe un dictador de texto y es el backend, que emite sin modelo en milisegundos; meterme a mí en esa ruta la haría más lenta y menos predecible.

Fuera del camino caliente es otra cosa. Esta misma sesión es la prueba: se volcó el tráfico, se leyeron las conversaciones, se llevó cada fallo hasta su nodo, se escribió el arnés que lo reproduce y se corrigió. Oswaldo, María, Isabella y las dos preguntas de perfil salieron de ahí. **Lo que hay que hacer no es meterme en el turno, es que ese ciclo deje de depender de que alguien se acuerde de mirar.**

### 4.3 «Acceso permanente para ir ajustando»

La versión realista no es que yo mire en vivo. Es que **el sistema me llame cuando algo huele mal**.

La infraestructura ya está: hay crones corriendo, hay una tabla de alertas, hay un registro de notificaciones y hay un script de auditoría. Falta la cola.

## 5. La arquitectura: tres capas que ya sabemos construir

Es el patrón que la industria llama *apilar, no elegir*, y coincide con lo que el proyecto ya hace con los guardarraíles.

### Capa 1 — Antes de entregar, sin modelo (milisegundos, cero pesos)

Corre sobre el borrador, en el webhook, junto a los guardarraíles que ya existen.

1. **La pregunta de dos salidas.** Si el borrador cierra con «¿cuál de los dos…?», «¿prefiere X o Y?» o cualquier disyuntiva, **no sale así**. Es el fallo número uno y se caza con una expresión regular.
2. **La repetición.** Ya está puesto hoy para los candados dictados. Falta extenderlo a las respuestas que compone el modelo.
3. **El formato del dinero, el léxico retirado y el tic de la honestidad.** Los tres son patrones literales.

### Capa 2 — Después de entregar, con modelo (asíncrono, sin latencia)

El juez de Haiku lee cada turno ya entregado y responde en JSON si algo no cumple. No bloquea a nadie. Lo que marca entra a una cola.

A 220 tokens de entrada por turno y con el tráfico actual, es un gasto que se nota en la factura menos que un solo día de la clave del motor.

Aquí es donde se cazan los fallos que ninguna regla ve: la respuesta genérica a una pregunta específica, el perfil equivocado, el argumento que no viene al caso.

### Capa 3 — La cola, y yo trabajándola

Una tabla, `turnos_marcados`, con el turno, el detector que lo marcó y su estado. Un cron diario que la revisa y avisa. Y una sesión de agente que la trabaja: lee, lleva el fallo hasta el nodo, escribe el arnés que lo reproduce, propone el arreglo, usted aprueba.

**El lazo es: rastro → detectar → cola → revisar → arnés → arreglo.** Es el mismo que recomienda la literatura de evaluación en producción, y es literalmente lo que hicimos hoy a mano.

## 6. Qué construir primero, en este orden

| # | Qué | Por qué en ese puesto | Tamaño |
|---|---|---|---|
| 1 | La pregunta de dos salidas, bloqueada antes de salir | El 39 % de los turnos marcados y el 52 % de las muertes | Una tarde |
| 2 | El «sí» sin destino: si la pregunta anterior tenía dos salidas, no se busca — se repregunta con una sola | Cierra el otro extremo del mismo fallo | Una tarde |
| 3 | La cola `turnos_marcados` + cron diario + aviso | Sin esto, lo demás se pierde | Un día |
| 4 | El juez asíncrono escribiendo a la cola | Caza lo semántico sin cobrar latencia | Un día |
| 5 | El juez síncrono, solo en turnos de alto riesgo | Último, y solo si 1 a 4 dejan hueco | Medio día |

## 7. Lo que NO recomiendo, y por qué

**Bloquear con el juez en el camino caliente.** Un juez es un modelo y se equivoca en las dos direcciones. Bloquear una respuesta buena le cuesta una venta al socio, y ese daño no se ve en ninguna métrica. La doctrina de este proyecto ya lo dice para los guardarraíles: las baterías verifican las dos direcciones. Un juez que bloquea debe tener su batería antes de encenderse.

**Reescribir el borrador con el modelo.** Cuando el guardarraíl de salud descarta, **reemplaza por un texto nuestro**; no le pide al modelo que lo corrija. La razón es que un modelo que corrige su propio texto tiende a conservar el error y cambiar el envoltorio. Lo mismo aplica aquí.

**Una cola sin dueño.** El riesgo más real de todo esto es que la tabla se llene y nadie la mire. Por eso el cron avisa, y por eso el paso 3 va antes que el juez.

## 8. Cómo sabremos si funcionó

⛔ **Corregido.** El número que proponía —el abandono tras una aceptación— resultó ser ruido de arneses. Con 40 personas al mes, un porcentaje se mueve entero porque una sola persona hizo algo, y no significa nada.

A esta escala la medida honesta no es una tasa, son **casos**:

> **Cuántos turnos entran a la cola cada semana, y cuántos de ellos resultan ser fallos de verdad al mirarlos.**

Si la cola trae diez y ocho son reales, el detector sirve. Si trae cien y tres son reales, nadie la va a mirar y hay que apretarla. Las dos de control siguen valiendo: que la mediana del turno no pase de 10 s, y que ningún detector bloquee una respuesta que las baterías dan por buena.

## 9. Límites de esta investigación

Son treinta días y 819 turnos de personas. Es suficiente para ver el fallo dominante, y corto para los de cola larga: un fallo que ocurre una vez al mes no aparece aquí.

El abandono es una señal indirecta. Un hilo que termina puede ser una persona satisfecha. Lo que sostiene la conclusión no es el abandono solo, sino que la tasa se cuadruplique justo en los turnos donde la respuesta no correspondía a la pregunta.

Y los detectores se escribieron mirando los fallos que ya conocíamos de esta semana. Es muy probable que haya familias que ninguno de los siete ve. Ese es precisamente el trabajo de la capa 2.

---

**Fuentes externas consultadas**

- [Deterministic vs LLM-Judge Evals (2026): Layer, Don't Choose — Future AGI](https://futureagi.com/blog/deterministic-vs-llm-judge-evals-2026/)
- [10 Best Low-Latency LLM Evaluation Tools in 2026 — Galileo](https://galileo.ai/blog/best-low-latency-llm-evaluation-tools)
- [LLM Guardrails in 2026: Implementation Guide for Safer AI — Future AGI](https://futureagi.com/blog/llm-guardrails-safeguarding-ai-2025/)
- [Why is error analysis so important in AI evals — Hamel Husain](https://hamel.dev/blog/posts/evals-faq/why-is-error-analysis-so-important-in-llm-evals-and-how-is-it-performed.html)
- [AI Evals: Everything You Need to Know — Hamel Husain y Shreya Shankar](https://hamel.dev/blog/posts/evals-faq/)
- [Tracking LLM failures in production — Latitude](https://latitude.so/blog/tracking-llm-failures-in-production)
