# **Análisis Exhaustivo y Resolución de la Integridad de Flujos Server-Sent Events en Interfaces Vainilla**

## **1\. Contexto Arquitectónico y Evolución del Streaming de Modelos de Lenguaje**

En el ecosistema contemporáneo de desarrollo web, la integración de Modelos de Lenguaje Grande (LLMs) como Anthropic Claude ha transformado radicalmente la topología de las interfaces de usuario. Las arquitecturas tradicionales basadas en el modelo de petición-respuesta (request-response) han demostrado ser insuficientes para manejar las altas latencias inherentes a la generación iterativa de tokens. Para mitigar la degradación en la experiencia del usuario provocada por el Tiempo Hasta el Primer Token (TTFT, por sus siglas en inglés), la industria ha adoptado de manera unánime los flujos de datos continuos o *streaming*.1

El escenario técnico analizado en este documento describe un widget de chat implementado en JavaScript vainilla, sin la mediación de marcos de trabajo reactivos o bibliotecas de manejo de estado virtual (Virtual DOM). Este componente se encuentra incrustado en una página de aterrizaje (landing page) estática, cuyo código fuente revela una estructura optimizada para dispositivos móviles con directivas específicas para el manejo del *viewport* y elementos interactivos.2 El widget establece comunicación bidireccional a través de un *endpoint* remoto (/api/nexus) desplegado como una *Edge Function* en la infraestructura de Vercel utilizando el entorno de ejecución de Next.js 14\.3

El protocolo de transporte seleccionado para esta comunicación es Server-Sent Events (SSE). A diferencia de WebSockets, que establecen un canal de comunicación dúplex completo, SSE proporciona un flujo unidireccional (del servidor al cliente) sobre una conexión HTTP estándar y persistente.4 Esta asimetría es computacionalmente ideal para el consumo de respuestas de LLMs, ya que el cliente envía una única carga útil (el *prompt* del usuario) y subsecuentemente recibe un torrente continuo de fragmentos de texto (tokens) generados dinámicamente por la API subyacente.1

El vector de consumo en el cliente se materializa mediante la API fetch(), acoplada a la interfaz ReadableStream proporcionada por la API de Streams del navegador.6 La adopción de fetch sobre la interfaz clásica EventSource obedece a una restricción fundamental del estándar W3C: EventSource está limitado a peticiones HTTP GET y no permite la inyección de encabezados personalizados (como *Authorization*) o cuerpos de mensaje complejos (JSON *payloads*), requisitos indispensables para interactuar con infraestructuras de IA modernas.7 Al utilizar fetch(), el desarrollador obtiene control absoluto sobre la petición HTTP, pero a cambio, hereda la responsabilidad total de procesar, decodificar y fragmentar el flujo de bytes entrante, una tarea que EventSource gestionaba de manera nativa.8

## **1.1. La Anatomía del Problema: La Paradoja de la Transición de Formato**

El defecto estructural reportado se manifiesta como una anomalía visual severa durante la fase de recepción de datos (streaming state). A medida que los tokens son emitidos por la *Edge Function* y consumidos por el bucle asíncrono del cliente, el texto se renderiza en el Document Object Model (DOM) como un bloque denso, compacto y continuo, carente por completo de saltos de línea, jerarquía de párrafos o espaciado semántico. Sin embargo, en el instante preciso en que el flujo de red concluye (determinado por la recepción de la señal de terminación), la invocación de una función de análisis sintáctico de Markdown (md()) sobre el texto acumulado desencadena un repintado masivo que transforma mágicamente la masa de texto ilegible en un documento estructurado de manera prístina.

Esta experiencia fragmentada —una transición abrupta de un "muro de texto" incomprensible a una estructura formateada— rompe la inmersión del usuario y expone una disonancia crítica en la capa de procesamiento intermedio. La resolución perfecta por parte del analizador Markdown al final del ciclo de vida del flujo confirma una hipótesis fundamental: los caracteres de nueva línea y la semántica estructural no se pierden en el origen ni en el tránsito final, sino que son marginados, ignorados o corrompidos durante la fase de ensamblaje en tiempo real.10

Las contramedidas documentadas en el análisis previo revelan intentos lógicos pero infructuosos para forzar la estructura visual. La mutación del acumulador de texto mediante expresiones regulares (intentando reemplazar saltos de línea con etiquetas HTML \<br\>) seguida de una inyección en el árbol DOM mediante la propiedad innerHTML, así como la aplicación de la regla CSS white-space: pre-wrap, no lograron mitigar el problema.12 La persistencia de esta falla en un entorno de producción, contrastada con la funcionalidad teórica del código en entornos de desarrollo aislados, sugiere que el problema subyacente reside en la intersección de la topología de red, el comportamiento del modelo de caja (Box Model) de CSS, y las heurísticas de segmentación de memoria en JavaScript.

El propósito de este documento es realizar una disección forense de las cuatro hipótesis operativas, analizar el recorrido atómico de cada byte desde los servidores de Anthropic hasta el subsistema de renderizado del navegador, y proveer una refactorización arquitectónica que garantice un *streaming* robusto, seguro y visualmente coherente para aplicaciones vainilla sin dependencias de terceros.

## **2\. Naturaleza del Transporte y la Segmentación de Red (TCP/IP)**

Para diagnosticar con precisión el punto de falla en el analizador (parser) SSE implementado en el cliente, es imperativo comprender la dinámica subyacente de la capa de transporte que subyace a la API ReadableStream.6

## **2.1. El Comportamiento de ReadableStream y los Chunks**

Cuando se inicia una petición mediante fetch() y el servidor responde con un encabezado Content-Type: text/event-stream y Transfer-Encoding: chunked, el navegador expone el cuerpo de la respuesta no como un bloque contiguo de memoria, sino a través de un ReadableStreamDefaultReader.13 La invocación iterativa del método asíncrono await reader.read() produce objetos que contienen una propiedad booleana done y un valor value que representa un fragmento de datos puros en formato Uint8Array.14

Es aquí donde reside uno de los malentendidos más extendidos en la programación de interfaces de red modernas: un *chunk* (fragmento) entregado por el lector del flujo no equivale semánticamente a un evento lógico de la aplicación.15 La API de *Streams* es agnóstica respecto al formato de los datos que transporta. El tamaño y el contenido exacto de cada Uint8Array están dictados de manera exclusiva por las fluctuaciones de la capa de red subyacente, el enrutamiento TCP, la Unidad Máxima de Transferencia (MTU) de los nodos intermedios, y los búferes de los proxies inversos que intervienen en la ruta.3

En un entorno de desarrollo local (localhost), la latencia es cercana a cero y no hay infraestructura de intermediación. Un evento SSE completo generado por el servidor, que consta de una o más líneas de texto finalizadas por una secuencia de dos saltos de línea (cuyos bytes equivalen a 0x0A 0x0A), suele caber perfectamente dentro del límite de un solo paquete TCP. En este escenario idílico, cada llamada a reader.read() devuelve un objeto Uint8Array que, al decodificarse, representa exactamente un evento SSE válido y completo.3

## **2.2. La Fragmentación en Entornos Edge (Producción)**

En contraste, el despliegue de la solución en la infraestructura global de Vercel introduce una topología de red radicalmente distinta. Las funciones *Edge* de Vercel operan detrás de una compleja red de distribución de contenido (CDN), pasarelas de API y firewalls de aplicaciones web.16 Cuando un LLM emite un flujo de tokens, estos atraviesan múltiples enrutadores, cada uno de los cuales puede subdividir los paquetes de datos para optimizar el ancho de banda y mantener el *keep-alive* de la conexión HTTP.

Por consiguiente, la especificación garantiza que los bytes se entregarán en el orden correcto, pero **no ofrece ninguna garantía sobre dónde se realizarán los cortes entre fragmentos**.6 Un evento SSE lógico, que por definición debe seguir la especificación del W3C (comenzando con data: y terminando con \\n\\n), puede quedar mutilado a través de dos o más *chunks* sucesivos del lector.18

Para visualizar este fenómeno crítico, considere la siguiente tabla que ilustra cómo un payload JSON válido es fragmentado arbitrariamente por la red antes de llegar al cliente:

| Secuencia Original Emitida por el Servidor | Fragmentación en reader.read() en Producción (Ejemplo) |
| :---- | :---- |
| data: {"choices":\[{"delta":{"content":"Hola\\n"}}\]} \\n\\n | **Iteración 1 (Chunk A):** data: {"choices":} \\n\\n |

Como se observa, el *Chunk A* no posee un salto de línea final, contiene una cadena JSON sintácticamente inválida y carece del delimitador de evento SSE (\\n\\n). Este comportamiento asíncrono y fragmentado de la capa de red es el catalizador principal de la falla reportada en la lógica de ensamblaje del cliente.

## **3\. Disección del Defecto del Parser: La Falla del Acumulador**

La base del problema de estructuración de texto reside en el algoritmo diseñado para transformar el flujo de bytes en texto plano. Analizaremos en detalle el código proporcionado para identificar la fuga de caracteres de salto de línea y la consecuente corrupción de la memoria en la variable botText.

JavaScript

while (true) {  
  var chunk \= await reader.read();  
  if (chunk.done) break;  
  var raw \= decoder.decode(chunk.value, { stream: true });  
  var lines \= raw.split('\\n');  
  for (var i \= 0; i \< lines.length; i++) {  
    //... lógica de extracción...

## **3.1. La Ineficacia Crítica de raw.split('\\n')**

El primer paso de procesamiento aplica una instancia de la API TextDecoder utilizando el parámetro de configuración { stream: true }.14 Esta directiva es arquitectónicamente correcta; indica al decodificador que conserve en su memoria interna cualquier secuencia de bytes que represente un carácter UTF-8 incompleto (caracteres que requieren múltiples bytes, como emojis o caracteres acentuados), difiriendo su emisión hasta que el resto de los bytes sean recibidos en la siguiente iteración. Esto previene eficazmente la corrupción tipográfica.9

Sin embargo, el desastre lógico ocurre inmediatamente en la siguiente instrucción: var lines \= raw.split('\\n');. Esta línea asume de manera dogmática e incorrecta que la variable raw, que es el string decodificado del *chunk* de red arbitrario, finaliza de manera segura con un carácter de nueva línea (\\n), o que cualquier línea fragmentada contenida en él constituye un evento evaluable.15

Siguiendo el modelo de fragmentación ilustrado en la sección anterior, si la variable raw contiene el texto \`data: {"choices":') continue;

try {

var obj \= JSON.parse(data);

var delta \= obj.choices && obj.choices && obj.choices.delta;

if (delta && delta.content) botText \+= delta.content;

} catch(\_) { botText \+= data; } // EL PUNTO DE FALLA CRÍTICO

} else if (line &&\!line.startsWith(':')) {

botText \+= line;

}

Al evaluar la cadena truncada \`{"choices":

\*\*La Mutación del Salto de Línea:\*\* Cuando un evento JSON que \*sí\* contiene un salto de línea es fragmentado, por ejemplo, \`data: {"choices":\[{"delta":{"content":"Hola\\n\` \[20\], la porción de texto que el cliente concatena ciegamente al \`botText\` incluye los dos caracteres literales empleados en el formato JSON para denotar saltos de línea: una barra invertida (\`\\\`, código hexadecimal \`0x5C\`) seguida inmediatamente de una consonante minúscula \`n\` (código hexadecimal \`0x6E\`). 

El acumulador \`botText\` deja de albergar saltos de línea genuinos (el carácter de control Line Feed, \`0x0A\`) para alojar secuencias de texto explícito (la secuencia de escape de dos bytes). Como corolario, cualquier intento posterior de utilizar una expresión regular basada en caracteres de control, como el intento del usuario \`.replace(/\\n/g, '\<br\>')\`, se volverá matemáticamente inútil, ya que el patrón \`\\n\` dentro de la expresión regular busca exclusivamente caracteres 0x0A en memoria, y la variable ahora solo contiene secuencias de texto literales \`\\n\` procedentes del JSON crudo.\[22, 23\]

Adicionalmente, cuando llega el siguiente \*chunk\* de red con el resto del JSON (por ejemplo, \`Mundo"}}\]}\`), este fragmento huérfano no comienza con el prefijo \`data: \`. Por consiguiente, la estructura condicional falla y se evalúa la ruta alternativa \`else if (line &&\!line.startsWith(':'))\`, lo que desencadena una inyección adicional (\`botText \+= line\`), embutiendo el resto de las llaves y corchetes JSON directamente en el historial de chat visible para el usuario final.

El resultado es un bloque masivo de texto entrelazado con llaves, corchetes, comillas dobles y barras invertidas, que carece por completo de semántica estructural para el motor de renderizado CSS. 

\#\# 4\. Análisis del Flujo de la Edge Function (Interoperabilidad de APIs)

La tercera hipótesis planteada por el usuario interpela directamente a la arquitectura de infraestructura alojada en Vercel: \*¿La Edge Function retransmite el stream de Anthropic directamente, o re-codifica los chunks? Si re-codifica, ¿en qué formato exacto llega al widget?\*

Para discernir la naturaleza de la carga útil (payload), es indispensable contrastar la especificación nativa de Server-Sent Events documentada por Anthropic contra la estructura que asume el analizador defectuoso del cliente.\[24\]

\#\#\# 4.1. La Especificación Nativa de Anthropic Claude

De acuerdo con la documentación oficial de Anthropic para las invocaciones en modalidad de flujo (streaming), su ecosistema emplea una taxonomía de eventos SSE altamente granular y tipificada.\[24\] A diferencia de otros proveedores que envían fragmentos indiscriminados, Anthropic orquesta un ciclo de vida compuesto por múltiples tipos de eventos nominales:

1\.  \`event: message\_start\` (Señal de inicialización).  
2\.  \`event: content\_block\_start\` (Apertura de un bloque de contenido específico).  
3\.  \`event: content\_block\_delta\` (Transmisión incremental de los tokens).  
4\.  \`event: message\_stop\` (Cierre formal de la petición).

Dentro de los eventos de tipo \`content\_block\_delta\`, la información que el desarrollador requiere (el texto incremental generado por el modelo) se encapsula bajo un esquema JSON anidado que sigue el patrón de acceso \`delta.text\`.\[25\]

\#\#\# 4.2. El Paradigma de Compatibilidad de OpenAI y Vercel AI SDK

Si analizamos el código del cliente suministrado, el algoritmo intenta acceder a los fragmentos de texto navegando a través de la ruta estructural \`obj.choices.delta.content\`. Esta arquitectura de objeto anidado (\`choices\`, con un array que engloba un objeto \`delta\` dotado de la propiedad \`content\`) es inequívocamente la firma estructural de la especificación de la API de Chat Completions de OpenAI (específicamente la interfaz \`chat.completion.chunk\`).\[26, 27\]

Esta observación concluye que la Edge Function, alojada en \`https://creatuactivo.com/api/nexus\`, no se limita a actuar como un simple proxy de reenvío (pass-through) para los bytes de Anthropic. En su lugar, el backend está ejecutando una capa de abstracción y normalización activa. Considerando que el entorno es Next.js 14 sobre Vercel, es altamente probable que el servidor esté implementando el \*\*Vercel AI SDK\*\* en conjunción con adaptadores de proveedores o el middleware de AI Gateway.\[28\]

El Vercel AI SDK fue diseñado para resolver el problema de la fragmentación de interfaces entre diversos proveedores de modelos fundamentales. Ofrece un envoltorio (wrapper) estandarizado que, de manera transparente, traduce las respuestas nativas de Anthropic Claude y las reempaqueta antes de empujarlas a través del \*stream\* de HTTP de la Edge Function.\[5, 29\] Existen dos formatos principales que el SDK puede emitir:

1\.  \*\*Formato Compatible con OpenAI:\*\* El backend recibe los bloques nativos de Anthropic y los reconstruye sintéticamente para imitar a OpenAI, devolviendo \`data: {"choices":\[{"delta":{"content":"..."}}\]}\`.\[30\]  
2\.  \*\*Data Stream Protocol (Protocolo de Datos de Flujo de Vercel):\*\* La iteración más moderna del Vercel AI SDK (versión 3+) utiliza un protocolo propietario optimizado para interfaces reactivas. Este protocolo abandona el prefijo \`data: \` del formato SSE estándar para emplear marcadores alfanuméricos como \`0:\` (para texto plano), \`9:\` (para llamadas de herramientas) y \`d:\` (para errores).\[31\] Si la Edge Function estuviera empleando el protocolo \`toDataStreamResponse()\`, el código del cliente experimentaría un fallo catastrófico constante, ya que las cadenas entrantes iniciarían con \`0:"Hola"\` en lugar de \`data: { JSON }\`.\[31, 32\] 

Dado que el código del cliente opera bajo la asunción de buscar prefijos \`data: \` y posteriormente decodificar \`choices\`, la resolución técnica de la hipótesis es definitiva: \*\*El widget está recibiendo un formato JSON estricto compatible con OpenAI, re-codificado por la infraestructura del servidor intermedio\*\*.\[16\]

\#\# 5\. El Conflicto CSS y el Comportamiento del Motor de Renderizado (DOM)

Incluso en el escenario teórico donde el búfer de red operase sin imperfecciones y la fragmentación TCP no corrompiera los datos, los parches superficiales intentados por el desarrollador para forzar la estética visual evidencian un malentendido de las primitivas de CSS y el ciclo vital del modelo de objetos del documento (DOM).\[12, 33\]

La hipótesis del usuario interroga si el ciclo \`while\` asíncrono se ejecuta con una voracidad tal que impide que el motor del navegador aplique los repintados en pantalla antes de sobrescribir el estado previo, anulando los esfuerzos de la propiedad \`innerHTML\`.

\#\#\# 5.1. El Ciclo de Eventos (Event Loop) y los Micro-Taks

En la arquitectura de ejecución de un solo hilo (single-threaded) de JavaScript vainilla, cualquier operación bloqueante que ocupe de forma síncrona el \*Main Thread\* inhibirá el paso del Renderizado, previniendo actualizaciones visuales. Sin embargo, en el paradigma expuesto, la iteración emplea la sintaxis \`await reader.read()\`. 

Cada vez que el motor encuentra una directiva \`await\`, la ejecución de la función asíncrona se suspende, y el control se devuelve inmediatamente al bucle de eventos principal (Event Loop). Durante estos lapsos de inactividad a la espera de operaciones de Entrada/Salida (I/O) en la red, el navegador cuenta con ventanas temporales amplias (desde la perspectiva computacional) para procesar tareas encoladas, aplicar cálculos de estilo (Recalculate Style), estructurar diseños (Layout/Reflow) e iniciar ciclos de repintado (Paint). En consecuencia, la ausencia de saltos de línea visibles no es producto de una asfixia en el repintado del DOM o una carrera de condiciones (race condition) temporal. La falla radica exclusivamente en la manipulación estructural del documento.

\#\#\# 5.2. El Riesgo Inherente y el Fracaso de \`innerHTML\` \+ \`\<br\>\`

El esfuerzo de mitigación propuesto por el desarrollador reemplazó la asignación de texto directo con la creación de una versión "segura" de la variable empleando múltiples invocaciones de la función encadenada \`.replace()\` y delegando la inyección al DOM a la propiedad \`bubble.innerHTML\`. Este enfoque no solo carece de eficiencia sistemática y abre fisuras de seguridad XSS potenciales \[20\], sino que desencadena anomalías profundas en la jerarquía del diseño.

\`\`\`javascript  
// El intento de refactorización inoperativo  
var safe \= botText  
 .replace(/\\\*\\\*/g, '').replace(/\\\*/g, '')  
 .replace(/&/g,'&').replace(/\</g,'\<').replace(/\>/g,'\>')  
 .replace(/\\n/g, '\<br\>');  
bubble.innerHTML \= safe;

Cuando se inyecta la etiqueta de salto de línea explícito (\<br\>) en lugar del carácter de control lógico (\\n), el analizador HTML (HTML Parser) detiene su flujo para construir un elemento de nodo del DOM (HTMLElement) en medio del flujo de caracteres.12 Sin embargo, en las hojas de estilo modernas, las burbujas de mensajería (identificadas en el contexto de desarrollo como .qw-bubble) con frecuencia son declaradas bajo contextos de formato Flexbox (display: flex) para simplificar el alineamiento vertical de iconos, sellos de tiempo y nodos de texto subordinados.12

En la especificación del modelo de caja flexible (Flexbox Box Model), todos los elementos descendientes directos de un contenedor flexible adquieren la designación de "elementos flexibles" (*flex items*), incluidos los nodos textuales anónimos y los elementos aislados como \<br\>.12 De forma predeterminada, los contenedores flexibles están orientados en fila (flex-direction: row) y suprimen drásticamente las restricciones de bloque normales. Un \<br\> incrustado en este contexto colapsa volumétricamente; se le despoja de su comportamiento intrínseco de generar una ruptura de carro.35 El texto que lo circunda continuará fluyendo de izquierda a derecha sin interrupciones o, en el peor de los escenarios, se desbordará visualmente de su contenedor.

## **5.3. La Correcta Implementación de white-space: pre-wrap**

Paralelamente, el desarrollador trató de remediar la situación empleando la propiedad CSS white-space: pre-wrap sobre la burbuja del chat.36

De acuerdo con las guías del World Wide Web Consortium (W3C), la declaración pre-wrap ordena al motor de renderizado CSS dos comportamientos concurrentes y fundamentales:

1. **Preservación de Espacios y Saltos:** Los caracteres de control como las tabulaciones (0x09) y los saltos de línea (Newlines, 0x0A) insertados en los nodos de texto del HTML se conservan y se traducen visualmente en la pantalla, en contraste con el valor predeterminado (normal) donde los navegadores colapsan secuencias de espacios en blanco y los reducen a un único espacio genérico.33  
2. **Envoltura Lógica (Wrapping):** Cuando el texto de un párrafo supera las dimensiones fronterizas horizontales (width) estipuladas por su elemento contenedor, el motor es libre de fragmentar la línea en espacios regulares y deslizar el texto al siguiente renglón para evitar el desbordamiento, previniendo los artefactos que causaría una etiqueta \<pre\> o un valor de white-space: pre estándar, que extenderían la línea indefinidamente exigiendo barras de desplazamiento (scroll).12

La tabla subsiguiente compara analíticamente el comportamiento de los valores de espaciado en blanco en conjunción con los flujos LLM:

| Valor CSS white-space | Colapsa Espacios Blancos | Conserva los caracteres \\n en el DOM | Permite Envoltura (Word Wrapping) | Adecuado para Flujos de Chat |
| :---- | :---- | :---- | :---- | :---- |
| normal (por defecto) | Sí | No (lo vuelve un espacio simple) | Sí | ❌ No, destruye formato de LLM. |
| pre | No | Sí | No | ❌ No, el texto rompe el contenedor. |
| pre-wrap | No | Sí | Sí | ✅ Sí, estructura óptima para texto continuo. |
| pre-line | Sí | Sí | Sí | ⚠️ Funciona, pero aplasta múltiples espacios. |

Para que white-space: pre-wrap exhiba alguna utilidad real, los elementos de nodo de texto (TextNodes) del DOM **deben contener caracteres literales de control de salto de línea (\\n)**. No obstante, mediante la invocación activa de .replace(/\\n/g, '\<br\>'), la totalidad de los caracteres \\n residuales (si es que lograban sobrevivir a la catástrofe del parser SSE documentado en la sección 3\) eran purgados y reemplazados por elementos HTML.12

En esencia, el cliente purgó sistemáticamente la única señal que el motor de CSS requería para estructurar el formato, suplicando luego a CSS que la interpretara. Ambas aproximaciones fueron contraproducentes y se contrarrestaron mutuamente.

La paradoja del éxito del analizador md() se explica bajo esta óptica: la función de análisis sintáctico de Markdown opera puramente a nivel de manipulación de cadenas de caracteres abstractas (String manipulations), y no depende de la lectura previa del modelo de caja o las reglas de cascada de estilos aplicadas a un contenedor.11 Una vez el flujo TCP concluye, es plausible que el proxy envíe un *chunk* masivo final íntegro que sobrescribe la variable global con una cadena donde los delimitadores \\n permanecen inalterados, permitiendo que la biblioteca reconstruya un árbol HTML con etiquetas semánticas formales (\<p\>, \<ul\>, \<li\>), lo cual elude los problemas de formato crudo.

## **6\. Diagnóstico Definitivo (Resolución de Hipótesis)**

Basado en el escrutinio técnico, forense y arquitectónico de la aplicación nativa, las respuestas consolidadas a los problemas del sistema son concluyentes:

1. **Pérdida Crítica de \\n en el Desempeño del Parser:** Los saltos de línea de los objetos del flujo JSON no se disipan debido a un comportamiento anómalo en la función JSON.parse(). Las mecánicas internas del analizador descifran correctamente las secuencias de escape (\\n) en caracteres literales (LF).21 La devastación estructural ocurre porque la arquitectura del bucle while asume erróneamente que la partición arbitraria raw.split('\\n') se alinea sinérgicamente con las fronteras del modelo de datos de la red de transporte (TCP/IP). Este proceso mutila los objetos de sintaxis JSON en el plano horizontal, desencadena excepciones sintácticas en try-catch, y deposita directamente secuencias subyacentes e informes crudos (incluyendo cadenas literales como \\n y corchetes }) en el historial transitorio del usuario.18  
2. **Identidad del Stream del Proxy:** A pesar de que el modelo proveedor de inteligencia artificial base es Anthropic Claude, la API en la *Edge Function* está utilizando una capa de compatibilidad formal. Esta aseveración técnica está comprobada de forma determinista por la presencia estructurada de los marcadores en la variable y su correspondiente lectura por parte del cliente (obj.choices.delta.content) que es, exclusivamente, la taxonomía estándar del esquema de completación conversacional heredado de OpenAI.27  
3. **Cronología e Inyección de Representación Gráfica (Rendering):** El fenómeno en el que se denotaba un muro de texto carente de formato no radica en la voracidad asincrónica que bloqueara las frecuencias de refresco visual, sino en el manejo inapropiado de las variables del modelo de caja. La estrategia híbrida de aplicar una inserción HTML \<br\> mediante la asignación insegura innerHTML anuló integralmente las capacidades de preservación y envolvimiento nativas concedidas por las directivas del sistema CSS en curso (white-space: pre-wrap), lo que resultó en un texto lineal, contiguo y sin fluidez gráfica.

## **7\. Refactorización y Solución Arquitectónica (Fix Mínimo)**

La solución más elegante, robusta y eficiente para un *framework-less* (JavaScript Vainilla puro) no es el enriquecimiento de la lógica mediante bibliotecas externas de empaquetado (parsing) para SSE, sino la implementación de un **búfer de fragmentación lineal dinámica**.

Este enfoque asegura de forma categórica que el motor solo pase al analizador JSON cadenas de texto cuando la integridad atómica de la línea ha sido matemáticamente validada, garantizando el aislamiento contra interrupciones de red.15 Además, prioriza el método textContent para la pintura de nodos en el DOM, lo cual confiere beneficios insoslayables en mitigación de seguridad y eficiencia computacional.

## **7.1. Ajuste Estructural de Hoja de Estilo (CSS)**

Antes de alterar la heurística del código, las directivas de apariencia gráfica deben cimentar el entorno adecuado.

CSS

/\* Entorno Visual del Chat Vainilla \*/  
.qw-msg\[data-streaming="1"\].qw-bubble {  
  /\* Habilita a la máquina de renderizado la lectura profunda de las señales \\n \*/  
  white-space: pre-wrap;  
  /\* Mitigación secundaria: Forzar un corte perimetral en sustantivos excepcionales \*/  
  overflow-wrap: break-word;  
  word-wrap: break-word;  
}

## **7.2. El Nuevo Parser Vanilla JS Orientado a Búferes TCP**

La implementación rectifica las deficiencias arquitectónicas al inicializar un reservorio de estado que sobrevive entre las diferentes peticiones asíncronas del torrente.

JavaScript

// Búfer que actúa como salvaguarda a nivel de transporte, preservando  
// bytes huérfanos que el chunker dejó atrás.  
var lineBuffer \= '';  
var botText \= '';

while (true) {  
  var chunk \= await reader.read();  
  if (chunk.done) break;  
    
  // La decodificación en stream preserva de manera segura los bytes UTF-8 fragmentados.  
  var raw \= decoder.decode(chunk.value, { stream: true });  
    
  // Re-concatenamos la porción no evaluada con el nuevo chorro de datos ingresante.  
  lineBuffer \+= raw;  
    
  // Fracturamos el paquete en sus divisiones lógicas (líneas).  
  var lines \= lineBuffer.split('\\n');  
    
  // CRÍTICO: La heurística del split invariablemente deja un remanente en el extremo   
  // del array (o una cadena vacía si finalizaba en \\n exacto).   
  // Retiramos dicho elemento del array y se consagra para el ciclo subsiguiente.  
  lineBuffer \= lines.pop();  
    
  for (var i \= 0; i \< lines.length; i++) {  
    // La sanitización de las impurezas heredadas \\r garantiza la inmunidad operativa.  
    var line \= lines\[i\].trim();  
      
    // Ignoramos cadenas nulas y fragmentos extraños  
    if (\!line) continue;  
      
    // Verificamos la taxonomía del Server-Sent Event  
    if (line.startsWith('data: ')) {  
      var data \= line.slice(6);  
      if (data \=== '') continue;  
        
      try {  
        var obj \= JSON.parse(data);  
        var delta \= obj.choices && obj.choices && obj.choices.delta;  
          
        // Conservación del contenido validado  
        if (delta && delta.content) {  
          botText \+= delta.content;  
        }  
      } catch (e) {  
        // En escenarios de error real, eludimos contaminar la memoria visual.  
        // La concatenación bruta (botText \+= data) se proscribe permanentemente.  
      }  
    }  
  }  
    
  // Empleo de renderizado seguro y asíncrono para el hilo de UI  
  // textContent esquiva vulnerabilidades y propaga la instrucción   
  // hacia el white-space: pre-wrap asignado.  
  bubble.textContent \= botText;  
}

// Al certificar la clausura transaccional del stream, aplicamos   
// el AST analítico para conceder semántica al bloque de datos y forjar el HTML  
bubble.innerHTML \= md(botText);

## **8\. Protocolo de Verificación y Auditoría de Red**

La incorporación del sistema debe validarse empíricamente en el marco productivo mediante el rastreo paramétrico de las mutaciones estructurales del contenido.38 El objetivo es observar con minuciosidad la eficacia de las correcciones de búfer.

Para ejecutar una confirmación categórica, inyecte las trazas paramétricas provistas dentro de la lógica del bucle while:

**Punto de inyección 1: Auditoría de Truncamiento y Rescate Temporal**

Inserte este analizador lógico de manera sucesiva al mandato reconstructivo: lineBuffer \= lines.pop();

JavaScript

if (lineBuffer.length \> 0) {  
  console.log(\` Búfer Activo: Rescatando un total de ${lineBuffer.length} bytes fragmentados ("${lineBuffer.substring(0, 15)}...") del inminente estrangulamiento de JSON.\`);  
}

*Expectativa Empírica:* Al desplegar el entorno de producción (Vercel Edge), el torrente de registros manifestará oscilaciones periódicas evidenciando la recuperación de fragmentos como data: {"choic.... La presencia de dichos registros ratifica inequívocamente que los cortes imprevistos producidos en las barreras del modelo TCP/IP están suscitando eventos disociados y que el sistema los preserva y posterga de manera exenta de riesgos.

**Punto de inyección 2: Identidad Fenoménica de Control (Recepción de Saltos Literales)**

Inserte la siguiente traza tras la suma de elementos estructurales botText \+= delta.content;

JavaScript

if (delta.content.includes('\\n')) {  
  console.log(\` Salto de línea estructural recibido. Longitud subyacente de botText: ${botText.length}. Inyección al textContent pendiente.\`);  
}

*Expectativa Empírica:* Cuando el flujo iterativo del modelo de lenguaje dictamine el salto hacia la próxima línea o inicio de listado, la consola arrojará este registro, testificando que la des-serialización JSON se cumple íntegramente y el carácter imperativo no se difumina en elementos espurios. El diseño CSS se encargará de forma autónoma de aplicar un salto visual genuino basándose exclusivamente en el mandato inherente del nodo de texto. Al converger todos los pilares técnicos bajo estas especificaciones, la transición abrupta hacia la invocación posterior de la librería md() transcurrirá imperceptible.

#### **Fuentes citadas**

1. The Complete Guide to Streaming LLM Responses in Web Applications: From SSE to Real-Time UI \- DEV Community, acceso: marzo 24, 2026, [https://dev.to/pockit\_tools/the-complete-guide-to-streaming-llm-responses-in-web-applications-from-sse-to-real-time-ui-3534](https://dev.to/pockit_tools/the-complete-guide-to-streaming-llm-responses-in-web-applications-from-sse-to-real-time-ui-3534)  
2. index.html  
3. Fixing Slow SSE (Server-Sent Events) Streaming in Next.js and Vercel \- Medium, acceso: marzo 24, 2026, [https://medium.com/@oyetoketoby80/fixing-slow-sse-server-sent-events-streaming-in-next-js-and-vercel-99f42fbdb996](https://medium.com/@oyetoketoby80/fixing-slow-sse-server-sent-events-streaming-in-next-js-and-vercel-99f42fbdb996)  
4. Real-Time Data Streaming with Server-Sent Events (SSE) \- DEV Community, acceso: marzo 24, 2026, [https://dev.to/serifcolakel/real-time-data-streaming-with-server-sent-events-sse-1gb2](https://dev.to/serifcolakel/real-time-data-streaming-with-server-sent-events-sse-1gb2)  
5. Real-time AI in Next.js: How to stream responses with the Vercel AI SDK \- LogRocket Blog, acceso: marzo 24, 2026, [https://blog.logrocket.com/nextjs-vercel-ai-sdk-streaming/](https://blog.logrocket.com/nextjs-vercel-ai-sdk-streaming/)  
6. Streams—The definitive guide | Articles \- web.dev, acceso: marzo 24, 2026, [https://web.dev/articles/streams](https://web.dev/articles/streams)  
7. sindresorhus/parse-sse: Parse Server-Sent Events (SSE) from a Response \- GitHub, acceso: marzo 24, 2026, [https://github.com/sindresorhus/parse-sse](https://github.com/sindresorhus/parse-sse)  
8. Browser APIs and Protocols: Server-Sent Events (SSE), acceso: marzo 24, 2026, [https://hpbn.co/server-sent-events-sse/](https://hpbn.co/server-sent-events-sse/)  
9. Beyond EventSource: Streaming fetch with ReadableStream | by Rob Blackbourn | Medium, acceso: marzo 24, 2026, [https://rob-blackbourn.medium.com/beyond-eventsource-streaming-fetch-with-readablestream-5765c7de21a1](https://rob-blackbourn.medium.com/beyond-eventsource-streaming-fetch-with-readablestream-5765c7de21a1)  
10. Using server-sent events \- Web APIs | MDN, acceso: marzo 24, 2026, [https://developer.mozilla.org/en-US/docs/Web/API/Server-sent\_events/Using\_server-sent\_events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events)  
11. NextJS's Amazing New Streaming Server Actions | by Jack Herrington \- Medium, acceso: marzo 24, 2026, [https://jherr2020.medium.com/nextjss-amazing-new-streaming-server-actions-ef4f6e2b1ca2](https://jherr2020.medium.com/nextjss-amazing-new-streaming-server-actions-ef4f6e2b1ca2)  
12. Handling whitespace \- CSS \- MDN Web Docs, acceso: marzo 24, 2026, [https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Text/Whitespace](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Text/Whitespace)  
13. Using readable streams \- Web APIs | MDN, acceso: marzo 24, 2026, [https://developer.mozilla.org/en-US/docs/Web/API/Streams\_API/Using\_readable\_streams](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API/Using_readable_streams)  
14. javascript \- Retrieve data from a ReadableStream object? \- Stack Overflow, acceso: marzo 24, 2026, [https://stackoverflow.com/questions/40385133/retrieve-data-from-a-readablestream-object](https://stackoverflow.com/questions/40385133/retrieve-data-from-a-readablestream-object)  
15. SSE Pattern \- Testing Agents with Server-Sent Events – Scenario \- LangWatch, acceso: marzo 24, 2026, [https://langwatch.ai/scenario/examples/testing-remote-agents/sse/](https://langwatch.ai/scenario/examples/testing-remote-agents/sse/)  
16. Responses API \- Vercel, acceso: marzo 24, 2026, [https://vercel.com/docs/ai-gateway/sdks-and-apis/openai-compat/responses](https://vercel.com/docs/ai-gateway/sdks-and-apis/openai-compat/responses)  
17. Streaming \- Vercel, acceso: marzo 24, 2026, [https://vercel.com/docs/functions/streaming-functions](https://vercel.com/docs/functions/streaming-functions)  
18. eventsource-parser \- NPM, acceso: marzo 24, 2026, [https://www.npmjs.com/package/eventsource-parser](https://www.npmjs.com/package/eventsource-parser)  
19. innerHTML and newlines : r/javascript \- Reddit, acceso: marzo 24, 2026, [https://www.reddit.com/r/javascript/comments/22ralo/innerhtml\_and\_newlines/](https://www.reddit.com/r/javascript/comments/22ralo/innerhtml_and_newlines/)  
20. OpenAI SDK vs Vercel AI SDK: Which Should You Choose in 2026 \- Strapi, acceso: marzo 24, 2026, [https://strapi.io/blog/openai-sdk-vs-vercel-ai-sdk-comparison](https://strapi.io/blog/openai-sdk-vs-vercel-ai-sdk-comparison)  
21. The Vercel AI SDK: A worthwhile investment in bleeding edge GenAI \- Zachary Proser, acceso: marzo 24, 2026, [https://zackproser.com/blog/vercel-ai-sdk](https://zackproser.com/blog/vercel-ai-sdk)  
22. white-space \- CSS-Tricks, acceso: marzo 24, 2026, [https://css-tricks.com/almanac/properties/w/whitespace/](https://css-tricks.com/almanac/properties/w/whitespace/)  
23. Comparing the streaming response structure for different LLM APIs | by Sirsh Amarteifio | Percolation Labs | Medium, acceso: marzo 24, 2026, [https://medium.com/percolation-labs/comparing-the-streaming-response-structure-for-different-llm-apis-2b8645028b41](https://medium.com/percolation-labs/comparing-the-streaming-response-structure-for-different-llm-apis-2b8645028b41)  
24. "white-space: pre;" CSS style does not seem to work according to W3C spec in  
25. White-space: pre; not working as expected; Technical Documentation project \- HTML-CSS, acceso: marzo 24, 2026, [https://forum.freecodecamp.org/t/white-space-pre-not-working-as-expected-technical-documentation-project/409927](https://forum.freecodecamp.org/t/white-space-pre-not-working-as-expected-technical-documentation-project/409927)  
26. CSS white-space: pre not working as expected \- Stack Overflow, acceso: marzo 24, 2026, [https://stackoverflow.com/questions/41081380/css-white-space-pre-not-working-as-expected](https://stackoverflow.com/questions/41081380/css-white-space-pre-not-working-as-expected)  
27. Edge Function using Anthropic / Claude API returning 401 status code \- Support, acceso: marzo 24, 2026, [https://answers.netlify.com/t/edge-function-using-anthropic-claude-api-returning-401-status-code/156287](https://answers.netlify.com/t/edge-function-using-anthropic-claude-api-returning-401-status-code/156287)