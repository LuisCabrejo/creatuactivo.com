# **Reporte de Investigación: Optimización UX y Arquitectura Técnica para Widgets de Chatbot IA en Entornos Vanilla JS**

El panorama del comercio electrónico moderno exige interfaces conversacionales que no solo emulen la naturalidad del diálogo humano, sino que operen bajo tolerancias de latencia microscópicas y restricciones de rendimiento estrictas. La integración de modelos de lenguaje de gran tamaño (LLMs) como Claude en widgets de atención al cliente ha introducido desafíos arquitectónicos sin precedentes. Específicamente, el procesamiento de flujos de datos asíncronos (Server-Sent Events) acoplado al renderizado de lenguajes de marcado ligero (Markdown) dentro de entornos de navegador no optimizados, genera fricciones significativas en la experiencia de usuario (UX) y en las métricas vitales de la plataforma anfitriona.

El presente documento examina exhaustivamente las topologías de diseño y las soluciones de ingeniería adoptadas por las principales plataformas de la industria para resolver seis problemas fundamentales en la construcción de widgets conversacionales independientes, desarrollados en JavaScript puro (Vanilla JS) y ejecutados en infraestructuras de alojamiento compartido (cPanel/WordPress). La investigación se centra en la mitigación del impacto en los *Core Web Vitals* (LCP, INP, CLS), la accesibilidad visual, la arquitectura de renderizado incremental y la protección algorítmica contra vulnerabilidades de inyección.

## **1\. Benchmark de Competidores: Arquitectura y Experiencia de Usuario**

La industria de las interfaces conversacionales está dominada por entidades que han refinado iterativamente el equilibrio entre la funcionalidad avanzada y el peso del cliente. La evaluación de estas plataformas revela divergencias críticas en cómo manejan el streaming, la topología del historial y la carga inicial. La siguiente tabla comparativa desglosa las metodologías aplicadas por los líderes del mercado para resolver las fricciones de rendimiento y UX en entornos constreñidos.

| Plataforma | Renderizado Markdown & Streaming | Detección de Autolinks | Jerarquía Visual (Historial) | Tipografía y Espaciado | Estrategia de Performance (Core Web Vitals) |
| :---- | :---- | :---- | :---- | :---- | :---- |
| **Intercom** | Renderizado parcial mediante Árboles de Sintaxis Abstracta (AST). Sanitización estricta en servidor. | Reglas de esquema predefinidas en backend. Ignora enlaces ya formateados. | Sin difuminado (*fade*). Agrupación por proximidad temporal y anclas de avatar. | line-height: 1.5, tamaño de fuente 14px-15px. | Patrón Facade; carga diferida interactiva con esqueleto inicial. |
| **Drift** | Énfasis en bloques de texto estáticos (*playbooks*). Soporte de streaming limitado. | Detección robusta con listas de TLD permitidos. | Contraste alto estricto. Burbujas con sombras ligeras para elevación. | line-height: 1.4, márgenes amplios entre bloques de texto. | Retraso intencional de inicialización; preservación estricta del LCP. |
| **Tidio** | Nodos inyectados progresivamente. Manejo de estado interno avanzado. | Reemplazo con expresiones regulares. Filtrado de etiquetas previas. | Fondos alternados (*zebra striping*) para separar al usuario del bot. | Fuente 14px, padding generoso (12px 16px). | Widget minimizado por defecto; carga de módulos bajo demanda. |
| **Crisp** | WebSockets/SSE con inyección directa de HTML pre-procesado en el backend. | Detección de protocolos estándar, prevención de sobreescritura. | Sin reducción de opacidad. Líneas de tiempo discretas y absolutas. | Tipografía densa, diseñada para soporte técnico masivo. | Carga asíncrona temprana; impacto minimizado en el hilo principal. |
| **HubSpot** | Procesamiento centralizado en servidor, entrega de fragmentos de HTML estructurado. | Parsers internos basados en expresiones regulares complejas. | Diferenciación estricta por alineación (izquierda/derecha). | Sistema de diseño estandarizado, alto contraste y legibilidad. | Carga del JavaScript pesado únicamente tras la interacción inicial. |
| **Freshchat** | Buffer de tokens y actualización en lotes (*batching*) para reducir repintados. | Sanitización post-renderizado del árbol DOM. | Agrupación visual por bloque continuo de respuesta. | Tipografía corporativa heredada, interlineado variable. | Inicialización asíncrona condicionada a la inactividad del navegador. |
| **Gorgias** | Orientado a *e-commerce*; plantillas de respuesta pre-estructuradas. | Enlaces a productos automáticamente renderizados como tarjetas nativas. | Énfasis exclusivo en la respuesta actual. Historial colapsable. | font-size: 15px, espaciado vertical optimizado para lectura rápida. | Diferimiento absoluto del JS hasta el primer evento de *scroll* o *hover*. |
| **ChatGPT (Web)** | Renderizado incremental estricto (![][image1]). Retención de tokens incompletos en buffer. | Renderizado AST puro. Exclusión estricta de *autolinks* en bloques de código. | Historial completo con contraste máximo. Desplazamiento forzado (*auto-scroll*). | line-height: 1.5, bloques semánticos separados por márgenes de 1em. | Streaming SSE optimizado; renderizado virtualizado del DOM. |

El análisis arquitectónico demuestra que ninguna de las plataformas de élite confía en la manipulación continua del árbol DOM con texto plano durante el streaming, y ninguna aplica reducción de opacidad a los mensajes antiguos.1 En su lugar, el estándar de la industria se inclina hacia la interceptación temprana de eventos mediante patrones de diseño *Facade* y algoritmos de renderizado incremental que protegen las métricas de rendimiento del navegador.4

## **2\. Hallazgos Fundamentales por Problema Estructural**

La construcción de un widget en Vanilla JS sin herramientas de empaquetado (*bundlers*) impone restricciones severas en la gestión de dependencias y la manipulación del DOM. A continuación, se detallan las soluciones algorítmicas y de diseño para cada problemática identificada.

## **Problema 1: Renderizado de Markdown en Streaming**

El desafío computacional de renderizar Markdown durante una transmisión Server-Sent Events radica en la inestabilidad de la sintaxis incompleta y el costo exponencial de la re-evaluación de cadenas de texto cada vez más largas.

**Fundamento Técnico y Arquitectónico:** El paradigma de concatenación ingenua, donde cada nuevo fragmento (chunk) entrante se suma al texto anterior y se analiza la totalidad del documento nuevamente, posee una complejidad algorítmica temporal de ![][image2].7 Para respuestas generativas largas, este enfoque bloquea el hilo principal del navegador (*Main Thread*), disparando el tiempo de ejecución de JavaScript y degradando catastróficamente la métrica de Interacción hasta el Siguiente Pintado (*Interaction to Next Paint* \- INP).8 Además, si un token de streaming interrumpe una estructura de formato (por ejemplo, llega el token \*\*neg sin el cierre correspondiente), el analizador de Markdown lo interpretará como texto plano, causando un parpadeo visual (*flicker* o reestructuración destructiva) cuando lleguen los tokens finales y el texto plano se transforme repentinamente en un elemento HTML \<strong\>.10

**Solución Recomendada: Buffer Incremental Orientado a Líneas** Las aplicaciones líderes resuelven esta fricción implementando parsers incrementales.12 Dado el límite de peso estricto del proyecto (\<15KB), la importación de constructores de Árboles de Sintaxis Abstracta (AST) completos es inviable.13 La solución óptima en Vanilla JS es la implementación de un *buffer* de retención lógica combinado con un analizador ultra-ligero.

El algoritmo debe mantener dos estados: el texto renderizado seguro y el texto en tránsito. A medida que llegan los fragmentos, se acumulan en un buffer temporal. El analizador de Markdown solo se dispara cuando el buffer detecta un carácter de control seguro, como un doble salto de línea (\\n\\n), un punto final seguido de un espacio, o el evento de terminación de la transmisión.11 El estado del arte también sugiere optimizar el rendimiento identificando bloques completados y "bloqueándolos" en el DOM para que nunca vuelvan a ser procesados, reduciendo la complejidad computacional a ![][image1].7 Para elementos en línea incompletos (como un enlace \`

## **Problema 2: URLs Clickeables en Respuestas del Bot sin Destrucción de Sintaxis**

En el contexto del comercio electrónico, cada iteración manual requerida por el usuario (como copiar y pegar una URL promocional) representa un punto de fuga en el embudo de conversión.14 Las URLs deben ser interactivas por defecto, pero la detección automatizada introduce vulnerabilidades de seguridad y colisiones de análisis estructural.

**Fundamento de Expresiones Regulares y Colisión Estructural:** La aplicación de algoritmos de detección automática de enlaces (*autolink*) sobre texto Markdown pre-renderizado es un proceso delicado. Una expresión regular básica que busque secuencias que comiencen con http puede capturar accidentalmente el contenido dentro de atributos HTML (como src="https://..." o href="https://...") inyectados por el propio parser de Markdown, destruyendo la validez de las etiquetas generadas.16 Asimismo, la presencia de enlaces dentro de etiquetas de formato fuertes (ej. \*\*https://dominio.com\*\*) exige que el detector no interfiera con los caracteres delimitadores.18

Una solución documentada ampliamente es el uso de aserciones de mirada hacia atrás negativas (*negative lookbehinds*) en las expresiones regulares, por ejemplo: /(?\<\!href="|src="|\\\]\\()(https?:\\/\\/\[^\\s\<\]+)/gi.17 No obstante, existe una restricción de compatibilidad crítica: el motor de JavaScript en Safari no soportó aserciones de mirada hacia atrás hasta la versión 16.4. Dado que el widget Queswa debe operar en Safari 14+, el uso de *lookbehinds* causará un error de sintaxis irrecuperable que detendrá la ejecución del script por completo.

**Solución Recomendada: Manipulación Condicional de Nodos de Texto** Para garantizar compatibilidad universal y seguridad absoluta, la detección de *autolinks* debe diferirse hasta la culminación de la fase de renderizado a HTML. En lugar de utilizar expresiones regulares sobre cadenas de texto crudo o HTML serializado, el widget debe iterar a través del Árbol de Objetos del Documento (DOM) utilizando la interfaz TreeWalker, extrayendo exclusivamente los Nodos de Texto (TextNodes). Al aplicar una expresión regular simple (/(https?:\\/\\/\[^\\s\<\]+)/gi) únicamente sobre el contenido de los nodos de texto, se elimina el riesgo de corromper la estructura HTML subyacente.16

**Mitigación de Riesgos de Phishing:** Por directrices estrictas de seguridad de la información, toda URL dinámica debe procesarse inyectando los atributos target="\_blank" y rel="noopener noreferrer".16 La ausencia del atributo noopener expone al navegador al ataque de secuestro de pestañas cruzadas (*cross-origin tabnabbing*), donde la página de destino podría manipular maliciosamente la instancia window.opener para redirigir la tienda de comercio electrónico original hacia una página de suplantación de identidad.20

## **Problema 3: Jerarquía Visual y Gestión del Historial de Conversación**

La alteración deliberada de la opacidad (opacity: 0.55) en mensajes antiguos para forzar una jerarquía visual contradice los fundamentos ergonómicos de la interacción humano-computadora (HCI) y vulnera severamente las directrices internacionales de accesibilidad.

**Análisis de Interacción y Accesibilidad (WCAG):** Las investigaciones del Nielsen Norman Group enfatizan que el historial conversacional actúa como un andamiaje para la memoria de trabajo del usuario.22 El diálogo humano es un proceso acumulativo donde el contexto previo informa directamente la toma de decisiones actual. Difuminar el historial incrementa la carga cognitiva, forzando al usuario a esforzarse visual y mentalmente para recuperar información instrumental (por ejemplo, especificaciones de un producto mencionadas dos mensajes atrás).23

Desde la perspectiva del cumplimiento técnico, las Pautas de Accesibilidad para el Contenido Web (WCAG Nivel AA) dictaminan una relación de contraste mínima de 4.5:1 para el texto estándar.23 Aplicar un canal alfa del 55% sobre una tipografía clara, posicionada sobre un fondo oscuro (\#0F1115), reduce matemáticamente el contraste a niveles de ilegibilidad, marginalizando a los usuarios con deficiencias de percepción de luminosidad y destruyendo la usabilidad en dispositivos móviles sometidos al resplandor solar.23

**Solución Recomendada: Arquitectura Espacial y Focalización Activa** La industria rechaza universalmente la degradación visual destructiva. Plataformas como ChatGPT, Intercom y Drift gestionan la jerarquía de la información utilizando el desplazamiento algorítmico (*auto-scrolling*) y la ley de proximidad de la Gestalt.26 El contenedor principal de chat debe fijar dinámicamente la ventana gráfica en la base inferior cada vez que ingresa un nuevo token de transmisión, dirigiendo la atención ocular sin alterar la densidad de los píxeles.28 El historial debe mantener una opacidad del 100% y delegar la estructura visual a espaciados proporcionales y señales semánticas.

## **Problema 4: Separadores Visuales entre Pares de Pregunta-Respuesta**

La utilización de delineadores translúcidos capilares (border-top con opacidad del 6%) no logra comunicar efectivamente los bordes semánticos de la conversación, generando un "ruido" visual que difumina la cadencia del intercambio comercial.

**Patrones Estructurales de Interfaces Conversacionales:** La densidad de la información es el enemigo de la conversión en el comercio electrónico. Cuando un bot asume el rol de asesoramiento guiado, la incapacidad de distinguir rápidamente quién emitió qué declaración genera parálisis analítica.27 Las metodologías líderes evitan los separadores horizontales absolutos, dado que en el diseño de interfaces modernas, estos sugieren la terminación de una sección en lugar de una transición cronológica continua.30

**Solución Recomendada: Asimetría Espacial y Zebra Striping Sutil** La solución adoptada por las interfaces de alto rendimiento (incluyendo arquitecturas de WhatsApp Business) se fundamenta en la asimetría posicional y cromática 31:

1. **Alineación Direccional:** Los mensajes originados por el usuario deben anclarse al borde derecho del contenedor, mientras que las emisiones de la inteligencia artificial se justifican a la izquierda. Esta dicotomía posicional establece el paradigma mental de "acción" y "reacción" más rápido que cualquier marcador explícito.  
2. **Diferenciación Cromática (*Zebra Striping*):** En lugar de separar mediante líneas, se aplica un color de fondo diferenciado al contenedor del mensaje. Para el esquema actual, el mensaje de la IA puede mantener el fondo del lienzo (\#0F1115), mientras que las consultas del usuario pueden poseer una envoltura translúcida (ej. rgba(212, 175, 55, 0.1)) o un gris espectral muy oscuro.26  
3. **Marcadores de Entidad:** La adición de un isotipo o acento de color sólido (por ejemplo, una franja izquierda de 3px solid \#D4AF37) en las burbujas del bot establece un anclaje pre-atentivo inconfundible.33

## **Problema 5: Espaciado y Micro-Tipografía en Burbujas Contenidas**

La entrega de volúmenes sustanciales de texto generativo (3 a 5 párrafos) en un ancho de banda estrecho de aproximadamente 440px resulta en un bloqueo perceptivo severo. Un interlineado insuficiente amalgama las líneas, incrementando la fatiga ocular y acelerando el abandono.34

**Métricas Optimizadas para Retención en Lectura Móvil:** La ingeniería tipográfica prescribe que la medida ideal de una línea de texto para sostener la lectura confortable oscila entre 45 y 75 caracteres.34 Si un contenedor lateral proporciona 400px netos de área de dibujo (descontando *paddings*), el uso de una fuente menor a 14px genera fatiga por concentración excesiva.

El análisis métrico de los sistemas de diseño de la industria (incluyendo los perfiles de Intercom y Material Design) formula la siguiente ecuación canónica para tipografía de lectura continua 36:

* **Densidad Base (font-size):** Fijar estrictamente en 14px o 15px.  
* **Respiración de Línea (line-height):** Una relación multiplicadora mínima de 1.5 (150%). Esto se traduce matemáticamente en una altura de línea de 21px a 22.5px, proporcionando el canal necesario para que la retina rastree el retroceso de carro cognitivo sin saltar líneas por error.35  
* **Separación Temática (margin-bottom en \<p\>):** El margen entre elementos de bloque debe ser derivado del interlineado. Un espaciado inferior de 1em a 1.5em (14px a 21px) asegura un ritmo rítmico vertical, permitiendo que cada viñeta o idea mantenga su individualidad estructural.34

**Longitud de Respuesta e Impacto Comercial:** Las pruebas empíricas demuestran que las respuestas explicativas densas aniquilan las tasas de conversión. En flujos de cualificación de *e-commerce*, la concisión es imperativa. Los datos sugieren que las intervenciones generadas por la IA no deben superar los dos o tres párrafos breves y deben priorizar vehementemente la utilización de viñetas y texto en negrita para el escaneo no lineal.23 Las instrucciones del sistema (system prompt) del LLM subyacente deben imponer topes de longitud estrictos para evitar la asfixia de la interfaz de 440px.

## **Problema 6: Despliegue, Rendimiento y Core Web Vitals en Google Ads**

El entorno de alojamiento en plataformas monolíticas como cPanel y WordPress es inherentemente frágil ante el agotamiento de recursos. La inyección de un bloque monolítico de JavaScript en el ciclo crítico de renderizado penaliza directamente las evaluaciones algorítmicas de Google, particularmente el *Largest Contentful Paint* (LCP) y el *Interaction to Next Paint* (INP), lo que degrada el Nivel de Calidad (*Quality Score*) y encarece el Costo Por Adquisición.41 La latencia de inicio en frío de la infraestructura Edge añade otra capa de degradación transaccional.

**Estrategia de Inicialización (*Facade Pattern*):** La compilación en línea de 400 líneas de código compite de forma destructiva por el tiempo de ejecución en el hilo principal del navegador (*Main Thread*) contra el motor central de WordPress. Para neutralizar el impacto en los Web Vitals, la industria estandariza el uso del patrón de Fachada (*Facade*).5

Durante la carga de la página, el navegador debe recibir exclusivamente las reglas CSS mínimas y el código HTML necesario para dibujar el icono pasivo (el lanzador flotante del chatbot). Esta fachada es inerte y no carga ningún analizador sintáctico, lógica de estado ni instanciaciones de conexión a red.6 Las rutinas pesadas de JavaScript, agrupadas en un módulo diferido, solo se adjuntan a la memoria y se compilan a través del motor V8 del navegador cuando el evento de interacción del usuario (e.g., mouseover, touchstart o un observador de intersección al finalizar el *scroll*) indica una intención inminente de uso.6

**Mitigación de Arranque en Frío (*Cold Start*) en Vercel Edge:** La llamada inicial hacia el *Edge Runtime* de Vercel para instanciar la API de Claude a menudo sufre de latencia por "arranque en frío" (inicialización del aislamiento *microVM*, importación de dependencias y latencia de red global), la cual oscila entre 2 y 4 segundos.44 Para comprimir este impacto perceptivo:

1. **Modelo de Pre-calentamiento Anticipado:** Al detectar el paso del ratón o la primera interacción en la interfaz principal de la *landing page*, el cliente dispara discretamente una solicitud HTTP tipo OPTIONS (pre-vuelo) o un GET simplificado hacia la ruta /api/nexus. Esta solicitud microscópica obliga a la infraestructura Edge a aprovisionar e hidratar los nodos informáticos, de forma que, cuando el usuario emita su consulta textual real, la función del servidor ya esté activa en la memoria RAM.45  
2. **Optimización Concurrente de Vercel:** Las plataformas de próxima generación como Vercel implementan tecnologías de ejecución continua (Fluid Compute), que reutilizan contenedores calientes, pero en arquitecturas servidor-menos (*serverless*) puras, la respuesta falsa progresiva es imperativa.46  
3. **Ilusión de Sincronicidad:** Tras la emisión del *POST* de streaming, el widget debe inyectar instantáneamente un módulo visual de estado (*"Analizando..."* o indicadores secuenciales intermitentes). Esto neutraliza la percepción temporal humana (mitigando la ansiedad por los 2-4 segundos de latencia subyacente) mientras la comunicación con el motor de inferencia de Anthropic se consolida y el primer fragmento de datos (TTFB) retorna.47

## ---

**3\. Topografía de Librerías Recomendadas para Vanilla JS**

Las dependencias requeridas deben ajustarse a la severidad de un ecosistema estático y de baja entropía en cPanel, restringido a un incremento máximo de 15KB en la carga final y prohibiendo el uso de gestores de dependencias como NPM durante el despliegue de ejecución.

## **Analizador de Markdown**

El espectro de analizadores para JavaScript abarca arquitecturas extensas basadas en Árboles de Sintaxis Abstracta (como remark y markdown-it, que oscilan entre 15KB y 760KB instalados) y motores fundamentados en expresiones regulares como showdown (\~800KB).13

**Selección Principal: snarkdown** Con una huella gzippeada de apenas **1KB**, snarkdown es la única librería que satisface rigurosamente las limitaciones métricas del proyecto.50 Está diseñado algorítmicamente alrededor de un motor único de expresiones regulares emparejado con validación lógica masiva para renderizar los fundamentos estructurales de Markdown: sintaxis de bloque (encabezados, listas, código cercado) e inmersiones de línea (negritas, itálicas, referencias).50

*Contrapartida:* No soporta el dibujo de tablas y carece intrínsecamente de saneamiento HTML incorporado.50 Es perfectamente apto si el modelo generativo es instruido sistemáticamente a no emitir tablas.

*Alternativa Secundarizada:* marked.js. Proporciona un compilador de bajo nivel de extraordinaria velocidad y soporta la totalidad de la especificación común. Sin embargo, su peso comprimido (\~12KB a 15KB) consumiría casi la totalidad del presupuesto disponible del proyecto Queswa.13

## **Sanitizador de Documentos (Mandatorio)**

**Selección Crítica: DOMPurify** El acto de transformar una respuesta en texto desde un modelo estocástico de inteligencia artificial en una representación directa a través del método innerHTML expone a la *landing page* comercial a un secuestro a través de secuencias de comandos en sitios cruzados (XSS).50 Cualquier alucinación algorítmica por parte del modelo de lenguaje podría inyectar vectores de ataque. DOMPurify es el purificador HTML estándar de la industria desarrollado por Cure53. Aunque añade aproximadamente 7-8KB, es un requisito no negociable y absoluto de seguridad operativa.

## **Cinética y Micro-Animaciones**

**Selección: Animaciones CSS Nativas (Transiciones CSS)**

La importación de bibliotecas de animación espacial computada, tales como *Framer Motion* o *GSAP*, es una anomalía en entornos sin herramientas de construcción, dado que elevan drásticamente la latencia y rompen el presupuesto calórico del JavaScript.

La orquestación cinética completa (inicios de transición del chat, expansión secuencial del historial, colapso condicional) debe programarse delegando el cálculo de interpolación puramente al procesamiento asistido por la Unidad de Procesamiento Gráfico (GPU). Utilizar exclusivamente transform: translateY() y opacity a través de directrices transition nativas manipuladas por alteraciones condicionales de clase en *Vanilla JS* asegura la obtención imperativa de 60 fotogramas por segundo (FPS) sin desencadenar las costosas repintadas del motor estructural (*layout thrashing*).

## ---

**4\. Estratificación por Impacto Financiero y Conversión**

La asignación de recursos en la optimización del canal comercial requiere priorizar las soluciones en función del aumento potencial directo sobre las tasas de retención e ingresos en embudos (*funnels*) de comercio electrónico, basándose en la investigación forense de la industria:

1. **Prioridad Crítica de Nivel 1: Arquitectura de Fachada (Mitigación Core Web Vitals)**  
   * *Fundamento Transaccional:* Los estudios corporativos de Google y Deloitte señalan implacablemente que la degradación en el *Largest Contentful Paint* (retrasos de 1 segundo a 3 segundos) magnifica la probabilidad de abandono del usuario en un 32%, colapsando la métrica de retornos en Google Ads.41 Preservar el entorno subyacente mediante carga condicional (Facade) asegura el *Quality Score* de la campaña, directamente minimizando el Costo de Adquisición de Clientes.  
2. **Prioridad de Nivel 2: Detección Segura de URLs Interactivas (*Autolinks*)**  
   * *Fundamento Transaccional:* En el panorama competitivo, la recomendación algorítmica expedita aumenta drásticamente los ingresos. Las analíticas especializadas indican que la intervención contextual propiciada por enlaces instantáneamente accesibles magnifica las conversiones de compra asistida por encima de un 80%.15 El forzar una copia manual destruye el momento cognitivo de compra.  
3. **Prioridad de Nivel 3: Algoritmo de Renderizado Incremental en Streaming**  
   * *Fundamento Transaccional:* Un redibujo destructivo constante bloquea iterativamente las capas de interactividad móvil. Las latencias perceptuales, especialmente los temblores visuales y congelaciones que resultan del análisis de cadenas de texto exponencialmente crecientes (![][image2]), causan disonancia y dañan irreversiblemente el factor de confianza en el ente de soporte artificial.8  
4. **Prioridad de Nivel 4: Topografía Tipográfica (Espaciados de Alta Legibilidad)**  
   * *Fundamento Transaccional:* El cerebro humano ignora instintivamente agrupaciones densas y aglomeradas de texto (fatiga informativa). Interlineados normativos de 1.5 multiplican el flujo de lectura y garantizan el consumo del mensaje del bot.34 La persuasión depende íntegramente de que el consumidor lea la narrativa propuesta sin resistencia ocular.  
5. **Prioridad de Nivel 5: Supresión del Desvanecimiento Histórico (Accesibilidad Espacial)**  
   * *Fundamento Transaccional:* El incumplimiento de contrastes normativos (WCAG) fractura sistemáticamente la navegación para una fracción notable de la demografía.23 Las interfaces modernas fundamentan su integridad de uso garantizando que cada pieza de información anterior sea de alta recuperación cognitiva.  
6. **Prioridad de Nivel 6: Rutinas Silenciosas de Pre-calentamiento (Mitigación Edge)**  
   * *Fundamento Transaccional:* Si bien es fundamental para el rendimiento sistémico final, la fricción producida por retrasos iniciales de 2 segundos de arranque en frío puede enmascararse efectivamente a la percepción humana inyectando elementos semánticos inmediatos (*"Conectando con un especialista..."*), lo cual retiene al usuario durante la resolución de red del LLM.44

## ---

**5\. Guía Integradora de Implementación Lógica**

La resolución técnica en la amalgama de un entorno *Vanilla JS* requiere secuencias asiladas dentro de Expresiones de Función Invocadas Inmediatamente (IIFE), carentes de interacciones de marco externo y resguardando variables para prevenir colisiones de alcance.

## **Patrón I: Renderizado Incremental Resiliente con Control Cíclico**

Para eludir las interrupciones críticas en *Main Thread* causadas por el análisis repetitivo de cadenas SSE, se establece un búfer que retrasa las resoluciones del motor snarkdown hasta que detecta rupturas narrativas coherentes (saltos de línea estables).

JavaScript

const QueswaMarkdownStream \= (function() {  
  // Lógica interna inyectada y minificada del analizador  
  const snarkdown \= function(md) { /\* 1KB de lógica Regex \*/ return md; };  
    
  let streamBuffer \= '';  
  let safeRenderedText \= '';  
  let uiContainerNode \= null;

  return {  
    init: function(container) {  
      uiContainerNode \= document.createElement('div');  
      uiContainerNode.className \= 'bot-msg-bubble';  
      container.appendChild(uiContainerNode);  
      streamBuffer \= '';  
      safeRenderedText \= '';  
    },  
      
    // Invocado a través de EventSource.onmessage  
    receiveChunk: function(chunk) {  
      streamBuffer \+= chunk;  
        
      // Control algorítmico: Solo se compila el buffer cuando el final de la cadena  
      // entrante no representa un riesgo de partición de sintaxis activa de Markdown.  
      // Un carácter de nueva línea, punto o espacio es considerado seguro transitoriamente.  
      if (streamBuffer.match(/(\\n|\\.|\\s)$/)) {  
         safeRenderedText \= streamBuffer;  
         let parsedHTML \= snarkdown(safeRenderedText);  
           
         // Purificación forzosa ante inyecciones maliciosas del modelo IA  
         if(window.DOMPurify) {  
             parsedHTML \= window.DOMPurify.sanitize(parsedHTML);  
         }  
         uiContainerNode.innerHTML \= parsedHTML;  
      }  
    },

    endStream: function() {  
      // Vaciado residual del buffer final  
      if(streamBuffer\!== safeRenderedText) {  
         let parsedHTML \= snarkdown(streamBuffer);  
         uiContainerNode.innerHTML \= window.DOMPurify? window.DOMPurify.sanitize(parsedHTML) : parsedHTML;  
      }  
        
      // Post-procesado algorítmico para enlaces dinámicos interactivamente seguros  
      QueswaLinkProcessor.linkifyTextNodes(uiContainerNode);  
    }  
  };  
})();

## **Patrón II: Autolink Seguro mediante Manipulación del Árbol Documental (AST Bypass)**

Para garantizar la integridad del código en Safari 14+ (que carece de soporte de expresiones regulares inversas negativas), la inyección de la lógica hipertextual ignora la estructura serializada innerHTML y emplea el TreeWalker nativo para recorrer en exclusividad nodos de texto puros de extremo a extremo, aislando así los atributos de HTML.

JavaScript

const QueswaLinkProcessor \= {  
  linkifyTextNodes: function(rootNode) {  
    // Traverse que aísla los componentes de texto del árbol HTML,  
    // previniendo alteraciones destructivas sobre etiquetas como \<a href="..."\>  
    const walker \= document.createTreeWalker(rootNode, NodeFilter.SHOW\_TEXT, null, false);  
    const nodesQueue \=;  
    let textNode;

    while (textNode \= walker.nextNode()) {  
      nodesQueue.push(textNode);  
    }

    // Análisis crudo: busca estructuras de dominio estándar  
    const httpRegex \= /(https?:\\/\\/\[^\\s\<\]+)/gi;

    nodesQueue.forEach(node \=\> {  
      const parent \= node.parentNode;  
      // Prevenir el doble procesamiento si el nodo ya es hijo de un enlace nativo de Markdown  
      if(parent && parent.tagName.toLowerCase() \=== 'a') return;

      const nodeValue \= node.nodeValue;  
      if (httpRegex.test(nodeValue)) {  
        const replacementSpan \= document.createElement('span');  
          
        // Asignación con protección blindada contra vectores de tabnabbing reversos  
        replacementSpan.innerHTML \= nodeValue.replace(httpRegex, function(url) {  
          return \`\<a href="${url}" target="\_blank" rel="noopener noreferrer" class="queswa-smart-link"\>${url}\</a\>\`;  
        });  
          
        parent.replaceChild(replacementSpan, node);  
      }  
    });  
  }  
};

## **Patrón III: Inyección Topográfica y Cinética mediante CSS Variables**

Definición matemática en el CSS insertado programáticamente para subsanar los conflictos de WCAG y aplicar ergonomía de diseño sistemático y densidades operativas (relación de *Zebra Striping* posicional y asimetría temporal).

JavaScript

const QueswaTopography \= (function() {  
  const styleInjector \= document.createElement('style');  
  styleInjector.textContent \= \`  
    /\* Sistema de Control Zonal y Erradicación de Fades (Accesibilidad) \*/  
   .queswa-conversation-canvas.bot-msg-bubble,   
   .queswa-conversation-canvas.user-msg-bubble {  
      opacity: 1\!important;  
      transition: transform 0.25s ease-out, opacity 0.25s ease-out;  
    }

    /\* Asimetría Semántica \*/  
   .user-msg-bubble {  
      margin-left: auto;  
      background-color: rgba(212, 175, 55, 0.1); /\* Gris cálido/Gold espectral \*/  
      border-right: 3px solid rgba(255,255,255,0.2);  
    }

   .bot-msg-bubble {  
      margin-right: auto;  
      background-color: \#1A1D24; /\* Zebra striping táctico sobre fondo base \#0F1115 \*/  
      border-left: 3px solid \#D4AF37; /\* Ancla de entidad dorada constante \*/  
    }

    /\* Matemáticas de la Legibilidad Continua \*/  
   .bot-msg-bubble {  
      font-family: system-ui, \-apple-system, sans-serif;  
      font-size: 15px;   
      line-height: 1.5; /\* Altura forzada de 22.5px previniendo choques de glifos \*/  
      padding: 16px;  
      border-radius: 8px;  
    }  
      
   .bot-msg-bubble p {  
      margin-top: 0;  
      margin-bottom: 1.25em; /\* Pausa respiratoria entre argumentos derivados \*/  
    }  
      
   .bot-msg-bubble p:last-child {  
      margin-bottom: 0;  
    }

   .queswa-smart-link {  
      color: \#D4AF37;  
      text-decoration: underline;  
      text-underline-offset: 3px; /\* Refinamiento visual del clic \*/  
    }  
  \`;  
  document.head.appendChild(styleInjector);  
})();

## **Patrón IV: Patrón Facade y Aislamiento de Core Web Vitals**

Aislamiento de la carga pesada y supresión del arranque en frío Edge (*Cold Start*) a través de observadores e intercepción de entrada humana en los componentes.

JavaScript

(function QueswaFacadeBootstrap() {  
  const injectFloatingButton \= () \=\> {  
    const launcher \= document.createElement('div');  
    launcher.id \= 'queswa-launcher-facade';  
    // Estilos mínimos estáticos  
    launcher.style.cssText \= \`position:fixed; bottom:20px; right:20px; width:60px; height:60px; background:\#D4AF37; border-radius:50%; z-index:9999; cursor:pointer;\`;  
      
    // Instanciadores delegados para prevenir la ejecución prematura del motor V8  
    launcher.addEventListener('mouseenter', handleInitialIntent, { once: true });  
    launcher.addEventListener('touchstart', handleInitialIntent, { once: true });  
      
    document.body.appendChild(launcher);  
  };

  const handleInitialIntent \= () \=\> {  
    // 1\. Calentamiento espectral: Despertar de los aislados V8 en los nodos perimetrales de Vercel  
    fetch('https://creatuactivo.com/api/nexus?warmup=1', { method: 'HEAD' }).catch(()=\>console.log('Edge Init'));  
      
    // 2\. Aquí comienza la carga de la topografía asíncrona real y   
    // la hidratación controlada de la lógica del chat.  
    //... Carga de DOMPurify, scripts internos, apertura de interfaz.  
  };

  // Restricción pos-documento para evitar castigar el LCP y el TBT  
  if (document.readyState \=== 'complete') {  
    injectFloatingButton();  
  } else {  
    window.addEventListener('load', injectFloatingButton);  
  }  
})();

## ---

**6\. Síntesis Ejecutiva y Visión Resolutiva**

*"Si Intercom, Drift o un equipo de producto de Silicon Valley tuviera que construir un chatbot IA de ventas para una landing page de Google Ads en WordPress/cPanel — sin framework, con streaming de Claude API y markdown en las respuestas — ¿qué decisiones técnicas y de UX tomaría? ¿En qué orden las implementaría para maximizar conversión?"*

Un escuadrón élite de desarrollo de productos en Silicon Valley concibe estas interacciones bajo una premisa inquebrantable: **el rendimiento es la métrica de diseño primigenia y la fricción cognitiva es un costo financiero directo.** Toda decisión arquitectónica subordinaría cualquier ostentación estilística al incremento en la eficiencia del *rendimiento conversacional* en un ciclo predeterminado. El orden secuencial de su ejecución técnica y experiencial sería el siguiente:

1. **Defensa de las Métricas Transaccionales de Adquisición (Prioridad Cero):** La preservación de las métricas LCP y el *Quality Score* en Google Ads sería sacrosanta. El equipo implementaría mecánicas de carga difuminada (*Facade Pattern*). El widget nunca insertaría sus rutinas monolíticas algorítmicas o su pesado DOM inicial durante el hilo de renderizado principal del navegador; solo inyectaría un componente esqueleto HTML estático inerte. El motor V8 de JavaScript y las inicializaciones pesadas solo arrancarían mediante hidratación condicionada (el primer gesto táctil sobre el esqueleto o desplazamiento extremo en la página), garantizando un impacto estadísticamente nulo en la experiencia web. De manera acoplada, se inyectaría una rutina de calentamiento subrepticio al entorno Vercel Edge para destrozar preventivamente la latencia inicial del *handshake* con Claude API.  
2. **Mitigación de la Angustia de Espera a través del *Streaming* Perfeccionado:** El escuadrón no toleraría los temblores cognitivos ni el coste catastrófico en la CPU móvil que ocasiona el analizar iterativamente el texto base (complejidad ![][image2]) bajo transiciones SSE. Integrarían de inmediato un autómata finito de validación de sintaxis: un intermediario lógico entre la cadena bruta proveniente de Vercel y el renderizador de Markdown (*snarkdown*). Este control transitorio mantendría como escudo a los fragmentos de Markdown incompletos hasta que detectara resoluciones gramaticalmente válidas (e.g., saltos de espacio), actualizando el historial orgánicamente mediante renderizado en lotes seguros y aniquilando las mutaciones destructivas del DOM.  
3. **Matemáticas Tipográficas y Aislamiento Cronológico:** Descartarían instantáneamente el paradigma rudimentario de ocultar los registros conversacionales tempranos bajo mantos opacos. Aplicar la propiedad opacity: 0.55 erosiona la accesibilidad visual, forzando un incumplimiento grave de normativas internacionales de contraste WCAG, y elimina las referencias cruzadas necesarias en un viaje de compra complejo. Para la canalización de lectura, el sistema impondría rigidez algorítmica a la presentación tipográfica: fuentes estandarizadas de 15px con un estricto respirador visual de 1.5 de interlineado (line-height), apoyado sobre alineaciones asimétricas de los contenedores para diferenciar, sin separadores frágiles, el origen narrativo de los participantes.  
4. **Enriquecimiento Comercial Protegido (Autolinks Dinámicos):** Entendiendo que la inacción es muerte comercial, se orquestaría una modificación algorítmica de los enlaces para prevenir puntos ciegos. Todo nombre de dominio expuesto por la IA se traduciría silenciosa y obligatoriamente a anclajes HTML. Para evadir la colisión estructural en entornos sin herramientas de construcción, esto no se computaría con expresiones regulares caóticas susceptibles a fallos en Safari, sino aislando los nodos del árbol textual tras el renderizado absoluto e integrando blindaje de ciberseguridad innegociable a través de *DOMPurify* y el estricto uso algorítmico del atributo noopener para defender las sesiones de los consumidores contra usurpación.

En suma, el rigor corporativo dictamina que la adopción progresiva de inteligencia artificial transaccional en infraestructuras débiles (como alojamiento compartido cPanel) demanda un modelo de ingeniería brutalmente sobrio: asentar la confianza psicológica con interacciones fluidas mediante asincronicidad, y construir la retención financiera extirpando toda resistencia a la decodificación visual y temporal de los datos. Ningún capricho estético compensa el valor erosionado por latencia sistémica incontrolada.

#### **Fuentes citadas**

1. Drift vs. Intercom: Which One to Choose for Your Business? \- Tidio, acceso: marzo 24, 2026, [https://www.tidio.com/blog/drift-vs-intercom/](https://www.tidio.com/blog/drift-vs-intercom/)  
2. Crisp Review: Features, Pricing, and Value for the Money \- Tidio, acceso: marzo 24, 2026, [https://www.tidio.com/blog/crisp-review/](https://www.tidio.com/blog/crisp-review/)  
3. Intercom vs Drift: The Famous Live Chat Tool Compared \- Customerly, acceso: marzo 24, 2026, [https://www.customerly.io/blog/intercom-vs-drift](https://www.customerly.io/blog/intercom-vs-drift)  
4. Core Web Vitals optimization guide 2025 showing LCP, INP, CLS metrics and performance improvement strategies for web applications. | aTeam Soft Solutions, acceso: marzo 24, 2026, [https://www.ateamsoftsolutions.com/core-web-vitals-optimization-guide-2025-showing-lcp-inp-cls-metrics-and-performance-improvement-strategies-for-web-applications/](https://www.ateamsoftsolutions.com/core-web-vitals-optimization-guide-2025-showing-lcp-inp-cls-metrics-and-performance-improvement-strategies-for-web-applications/)  
5. How to Improve Core Web Vitals (LCP, INP, CLS) in Modern Web Apps \- Ableneo, acceso: marzo 24, 2026, [https://www.ableneo.com/insight/how-to-improve-core-web-vitals-lcp-inp-cls-in-modern-web-apps/](https://www.ableneo.com/insight/how-to-improve-core-web-vitals-lcp-inp-cls-in-modern-web-apps/)  
6. Improving a third party chatbot widget's performance | Erwin Hofman, acceso: marzo 24, 2026, [https://www.erwinhofman.com/blog/improving-third-party-chatbot-widget-performance/](https://www.erwinhofman.com/blog/improving-third-party-chatbot-widget-performance/)  
7. Weekend Project Incremark: An Incremental Markdown Parser for AI Streaming \- Medium, acceso: marzo 24, 2026, [https://medium.com/@kingshuai01/weekend-project-incremark-an-incremental-markdown-parser-for-ai-streaming-28c9fa95962f](https://medium.com/@kingshuai01/weekend-project-incremark-an-incremental-markdown-parser-for-ai-streaming-28c9fa95962f)  
8. From O(n ) to O(n): Building a Streaming Markdown Renderer for the AI Era \- DEV Community, acceso: marzo 24, 2026, [https://dev.to/kingshuaishuai/from-on2-to-on-building-a-streaming-markdown-renderer-for-the-ai-era-3k0f](https://dev.to/kingshuaishuai/from-on2-to-on-building-a-streaming-markdown-renderer-for-the-ai-era-3k0f)  
9. The most effective ways to improve Core Web Vitals | Articles, acceso: marzo 24, 2026, [https://web.dev/articles/top-cwv](https://web.dev/articles/top-cwv)  
10. Preventing Flash of Incomplete Markdown when streaming AI responses \- Hacker News, acceso: marzo 24, 2026, [https://news.ycombinator.com/item?id=44182941](https://news.ycombinator.com/item?id=44182941)  
11. Handling incomplete markdown during streaming · Issue \#3657 · markedjs/marked \- GitHub, acceso: marzo 24, 2026, [https://github.com/markedjs/marked/issues/3657](https://github.com/markedjs/marked/issues/3657)  
12. How does ChatGPT stream text smoothly without React UI lag? : r/reactjs \- Reddit, acceso: marzo 24, 2026, [https://www.reddit.com/r/reactjs/comments/1nh05xb/how\_does\_chatgpt\_stream\_text\_smoothly\_without/](https://www.reddit.com/r/reactjs/comments/1nh05xb/how_does_chatgpt_stream_text_smoothly_without/)  
13. marked vs micromark vs markdown-it vs remark vs showdown | JavaScript Markdown Parsing Libraries \- NPM Compare, acceso: marzo 24, 2026, [https://npm-compare.com/markdown-it,marked,micromark,remark,showdown](https://npm-compare.com/markdown-it,marked,micromark,remark,showdown)  
14. The Future of AI In Ecommerce: 40+ Statistics on Conversational AI Agents For 2025, acceso: marzo 24, 2026, [https://www.hellorep.ai/blog/the-future-of-ai-in-ecommerce-40-statistics-on-conversational-ai-agents-for-2025](https://www.hellorep.ai/blog/the-future-of-ai-in-ecommerce-40-statistics-on-conversational-ai-agents-for-2025)  
15. AI Chatbots in E-Commerce 2025: From FAQ Bot to Digital Sales Consultant | Qualimero, acceso: marzo 24, 2026, [https://qualimero.com/en/blog/ai-chatbots-conversational-commerce](https://qualimero.com/en/blog/ai-chatbots-conversational-commerce)  
16. Regex for urls and markdown like images \- Stack Overflow, acceso: marzo 24, 2026, [https://stackoverflow.com/questions/75762519/regex-for-urls-and-markdown-like-images](https://stackoverflow.com/questions/75762519/regex-for-urls-and-markdown-like-images)  
17. Javascript RegEx to match URL's but exclude images \- Stack Overflow, acceso: marzo 24, 2026, [https://stackoverflow.com/questions/11745004/javascript-regex-to-match-urls-but-exclude-images](https://stackoverflow.com/questions/11745004/javascript-regex-to-match-urls-but-exclude-images)  
18. Regular Expression Without Lookbehind for Markdown Bolding \- Stack Overflow, acceso: marzo 24, 2026, [https://stackoverflow.com/questions/44183199/regular-expression-without-lookbehind-for-markdown-bolding](https://stackoverflow.com/questions/44183199/regular-expression-without-lookbehind-for-markdown-bolding)  
19. Find all urls except markdown link to autolink \- Stack Overflow, acceso: marzo 24, 2026, [https://stackoverflow.com/questions/68364323/find-all-urls-except-markdown-link-to-autolink](https://stackoverflow.com/questions/68364323/find-all-urls-except-markdown-link-to-autolink)  
20. How to Parse URLs from Markdown to HTML Securely?, acceso: marzo 24, 2026, [https://www.nodejs-security.com/blog/how-to-parse-urls-from-markdown-to-html-securely](https://www.nodejs-security.com/blog/how-to-parse-urls-from-markdown-to-html-securely)  
21. Comprehensive Regex for URL Detection and Spam Filtering \- John Dalesandro, acceso: marzo 24, 2026, [https://johndalesandro.com/blog/comprehensive-regex-for-url-detection-and-spam-filtering/](https://johndalesandro.com/blog/comprehensive-regex-for-url-detection-and-spam-filtering/)  
22. One-Shot Interactions with Intelligent Assistants in Unfamiliar Smart Spaces by Meghan Clark A dissertation submitted in partial, acceso: marzo 24, 2026, [https://people.eecs.berkeley.edu/\~prabal/pubs/dissertations/clark21dissert.pdf](https://people.eecs.berkeley.edu/~prabal/pubs/dissertations/clark21dissert.pdf)  
23. Chatbot Interface Design: A Practical Guide for 2026 \- Fuselab Creative, acceso: marzo 24, 2026, [https://fuselabcreative.com/chatbot-interface-design-guide/](https://fuselabcreative.com/chatbot-interface-design-guide/)  
24. Chatbots and Web Accessibility: Addressing Usability Issues and Embracing Inclusive Design, acceso: marzo 24, 2026, [https://www.makethingsaccessible.com/guides/chatbots-and-web-accessibility-addressing-usability-issues-and-embracing-inclusive-design/](https://www.makethingsaccessible.com/guides/chatbots-and-web-accessibility-addressing-usability-issues-and-embracing-inclusive-design/)  
25. The Quiet Power of Visual Hierarchy | by Peace Afolabi \- Medium, acceso: marzo 24, 2026, [https://medium.com/@peafolabi/the-quiet-power-of-visual-hierarchy-a291fdec9bbc](https://medium.com/@peafolabi/the-quiet-power-of-visual-hierarchy-a291fdec9bbc)  
26. Customize your interface for ChatGPT web \-\> custom CSS inside \- OpenAI Developer Community, acceso: marzo 24, 2026, [https://community.openai.com/t/customize-your-interface-for-chatgpt-web-custom-css-inside/315446](https://community.openai.com/t/customize-your-interface-for-chatgpt-web-custom-css-inside/315446)  
27. How Visual Design and Hierarchy Make (or Break) UX \- Coveo, acceso: marzo 24, 2026, [https://www.coveo.com/blog/visual-hierarchy-and-user-experience/](https://www.coveo.com/blog/visual-hierarchy-and-user-experience/)  
28. These Three (Popular) Approaches to Implementing 'Live Chat' are Often Highly Disruptive for Users \- Baymard, acceso: marzo 24, 2026, [https://baymard.com/blog/live-chat-usability-issues](https://baymard.com/blog/live-chat-usability-issues)  
29. 5 Proven UX Strategies For "No Results" Pages – Baymard, acceso: marzo 24, 2026, [https://baymard.com/blog/no-results-page](https://baymard.com/blog/no-results-page)  
30. UI: Getting the Details Right – Baymard Institute, acceso: marzo 24, 2026, [https://baymard.com/blog/ui-details](https://baymard.com/blog/ui-details)  
31. Gorgias vs Tidio \- Software comparison for 2026 \- Crisp, acceso: marzo 24, 2026, [https://crisp.chat/en/comparisons/gorgias-vs-tidio/](https://crisp.chat/en/comparisons/gorgias-vs-tidio/)  
32. Intercom vs Drift \- Software comparison for 2026 \- Crisp, acceso: marzo 24, 2026, [https://crisp.chat/en/comparisons/intercom-vs-drift/](https://crisp.chat/en/comparisons/intercom-vs-drift/)  
33. Customize Chat Appearance \- Gorgias Help Center, acceso: marzo 24, 2026, [https://docs.gorgias.com/en-US/customize-chat-appearance-81791](https://docs.gorgias.com/en-US/customize-chat-appearance-81791)  
34. Font size, line height and line width the golden ratio way | by Kareem Elansary | Medium, acceso: marzo 24, 2026, [https://medium.com/@zkareemz/golden-ratio-62b3b6d4282a](https://medium.com/@zkareemz/golden-ratio-62b3b6d4282a)  
35. You need to fix your \`line-height\` \- Kevin Powell, acceso: marzo 24, 2026, [https://www.kevinpowell.co/article/line-height/](https://www.kevinpowell.co/article/line-height/)  
36. Line height \- Design tokens \- USWDS \- Digital.gov, acceso: marzo 24, 2026, [https://designsystem.digital.gov/design-tokens/typesetting/line-height/](https://designsystem.digital.gov/design-tokens/typesetting/line-height/)  
37. Line Height | Tokens Studio for Figma, acceso: marzo 24, 2026, [https://docs.tokens.studio/manage-tokens/token-types/typography/line-height](https://docs.tokens.studio/manage-tokens/token-types/typography/line-height)  
38. The type system \- Material Design, acceso: marzo 24, 2026, [https://m2.material.io/design/typography/the-type-system.html](https://m2.material.io/design/typography/the-type-system.html)  
39. The ideal line length & line height in web design \- Pimp my Type, acceso: marzo 24, 2026, [https://pimpmytype.com/line-length-line-height/](https://pimpmytype.com/line-length-line-height/)  
40. (PDF) The Impact of Chatbots on Customer Experience in e-commerce: Examining Responsiveness, Ease of Use, and Personalization \- ResearchGate, acceso: marzo 24, 2026, [https://www.researchgate.net/publication/399108476\_The\_Impact\_of\_Chatbots\_on\_Customer\_Experience\_in\_e-commerce\_Examining\_Responsiveness\_Ease\_of\_Use\_and\_Personalization](https://www.researchgate.net/publication/399108476_The_Impact_of_Chatbots_on_Customer_Experience_in_e-commerce_Examining_Responsiveness_Ease_of_Use_and_Personalization)  
41. SEO for AI: 5 Technical Fixes to Ensure Your Site is the “Primary Source” for Gemini and ChatGPT, acceso: marzo 24, 2026, [https://www.topseosydney.com.au/seo-for-ai-5-technical-fixes-to-ensure-your-site-is-the-primary-source-for-gemini-and-chatgpt/](https://www.topseosydney.com.au/seo-for-ai-5-technical-fixes-to-ensure-your-site-is-the-primary-source-for-gemini-and-chatgpt/)  
42. Core Web Vitals report \- Search Console Help, acceso: marzo 24, 2026, [https://support.google.com/webmasters/answer/9205520?hl=en](https://support.google.com/webmasters/answer/9205520?hl=en)  
43. Optimizing Core Web Vitals in 2024 | Vercel Knowledge Base, acceso: marzo 24, 2026, [https://vercel.com/kb/guide/optimizing-core-web-vitals-in-2024](https://vercel.com/kb/guide/optimizing-core-web-vitals-in-2024)  
44. Identifying Cold Starts With Vercel and Claude | by Nick Porter | Medium, acceso: marzo 24, 2026, [https://medium.com/@porter.nicholas/identifying-cold-starts-with-vercel-and-claude-1585d5340513](https://medium.com/@porter.nicholas/identifying-cold-starts-with-vercel-and-claude-1585d5340513)  
45. 12 Serverless Cold-Start Fixes That Actually Work in 2025 | by Thinking Loop | Medium, acceso: marzo 24, 2026, [https://medium.com/@ThinkingLoop/12-serverless-cold-start-fixes-that-actually-work-in-2025-aa9524a2e4b8](https://medium.com/@ThinkingLoop/12-serverless-cold-start-fixes-that-actually-work-in-2025-aa9524a2e4b8)  
46. Fluid compute \- Vercel, acceso: marzo 24, 2026, [https://vercel.com/docs/fluid-compute](https://vercel.com/docs/fluid-compute)  
47. llms-full.txt \- Next.js, acceso: marzo 24, 2026, [https://nextjs.org/docs/llms-full.txt](https://nextjs.org/docs/llms-full.txt)  
48. Stop Making Users Wait: The Ultimate Guide to Streaming AI Responses \- DEV Community, acceso: marzo 24, 2026, [https://dev.to/programmingcentral/stop-making-users-wait-the-ultimate-guide-to-streaming-ai-responses-22m3](https://dev.to/programmingcentral/stop-making-users-wait-the-ultimate-guide-to-streaming-ai-responses-22m3)  
49. micromark \- Unified.js, acceso: marzo 24, 2026, [https://unifiedjs.com/explore/package/micromark/](https://unifiedjs.com/explore/package/micromark/)  
50. developit/snarkdown: :smirk\_cat: A snarky 1kb Markdown ... \- GitHub, acceso: marzo 24, 2026, [https://github.com/developit/snarkdown](https://github.com/developit/snarkdown)  
51. snarkdown: The 1KB Markdown Renderer That Does Just Enough \- mfyz, acceso: marzo 24, 2026, [https://mfyz.com/snarkdown-1kb-markdown-renderer/](https://mfyz.com/snarkdown-1kb-markdown-renderer/)  
52. GitHub \- markedjs/marked: A markdown parser and compiler. Built for speed., acceso: marzo 24, 2026, [https://github.com/markedjs/marked](https://github.com/markedjs/marked)  
53. Don't use marked \- macwright.com, acceso: marzo 24, 2026, [https://macwright.com/2024/01/28/dont-use-marked](https://macwright.com/2024/01/28/dont-use-marked)  
54. Best practices to render streamed LLM responses | AI on Chrome, acceso: marzo 24, 2026, [https://developer.chrome.com/docs/ai/render-llm-responses](https://developer.chrome.com/docs/ai/render-llm-responses)  
55. The Importance of Website Optimization Through INP, CLS, and LCP \- Blue Triangle, acceso: marzo 24, 2026, [https://bluetriangle.com/blog/the-importance-of-website-optimization-through-inp-cls-and-lcp](https://bluetriangle.com/blog/the-importance-of-website-optimization-through-inp-cls-and-lcp)  
56. Core Web Vitals 2.0 & User Experience: The Definitive Guide to Performance Optimization and Ranking Factors \- Superstar SEO, acceso: marzo 24, 2026, [https://superstarseo.com/core-web-vitals-2-0-user-experience/](https://superstarseo.com/core-web-vitals-2-0-user-experience/)  
57. Impact of AI Chatbots on Website Conversion Rates by Codebrain \- Synergy PFT, acceso: marzo 24, 2026, [https://synergypft.com/impact-of-ai-chatbots-on-website-conversion-rates/](https://synergypft.com/impact-of-ai-chatbots-on-website-conversion-rates/)

[image1]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAYCAYAAACMcW/9AAACDklEQVR4Xu2WPUscURSGj5+ooCQg2viBhW2wS7RQVJA0aaKohbhYBJJaNPkFCjYmIOo/UMgfCGKhXcpgOgULEREVVPCT+JHzeu9kr+/cy+5sdsHCBw47+7znzuzM3LmzIs88ffpYZEkbiyQ0ay1qzWnVUObjo9YXlgm4Z5GJr2IGjdrvTVoHWlf/OuI0au2xTEiL1jFLH8VifuA6B5YbrTuWFoyrYJkD51rvWDI42DZLhx4xPb3kO7SuyeVKq2SYAruSoUHSV/w7+T/yf3OTwTGqWIIuMeEaeealmL4T8nCV5CKWtN473we1lrXeOI7B/mZYAlyRbObYiJi+X46rts7Hrf1E3i/mBF+IOSm4YZszKxKYShgUOpjLppg+LEMR3dYx+DHf7DZyPIgucKvkIrAkxvZZZ2Us8ODrG/M48EqrRKteTM5zDm6cXMRn8ewTO4O85IAYENPHS1fK+hDzEs/brSsiHzEh8TEP+K4UE+rBQ+HzEcjwDLjsWx9iQQL5qQQCy46YvIwDSa8EIZBNe9yUs8380LpgGYEBGyyVQ4lfEQZjy1kqtWIyXrrgsCbjbnyiDCDHazzIkZimn2LmLLZfP+rwgz7fgzEk/iv2W4yf5cCCDHcq70xqnbHMkQbxn1zewM5LWeYA/j25b7K881Zri2VCsOZiRSg4eD9/YJmAgt5yJsUiSzpZPFNI/gKXKoFupqnymQAAAABJRU5ErkJggg==>

[image2]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAYCAYAAAC4CK7hAAACXElEQVR4Xu2WzUsVURjG31JDEzVBamVBf0Arw9RFaBCuLSoiuhYEuXEjiLpw5wdtKgipRYtsoSD1F7TIRSBI0MemD3AREVEuDAyV0nwfzxk995kzc+cOd7DF/cHDnfm958ydOTPnzIiUyYRFzT/NKy7sB+dZJGTZ2Z7W/HH2wRXaL4oTmoeaB5p6qvm4rRlimRDciUm7fcDuu5zUvCVXkHtiDnTd7h/X/NCs77YI06z5xjIlpyV8IeC+5hFLHwfFHGCeC5a/mi2WFvSrZpkSPFZXWVp8FxgCjZZYOnSJaXOOfLtmg1xaHkv8fHgqBR6xr1L4aoM7NkceI5h2brjc1Jyx2x1uwaFBYs7zrJjiS/JMo5h2K+ThasgFzGh6nP1LmlnZO+GAFjGTvVdzS/Mxr5oP/s+7+GBEkzzj18S0e+O4Out8bNpf1C+IGYAjYi4azn2EsM+JArVhlqBQx4BPYtphmQ3otI7ByWKVAahjoXCBe0EuKej7hOVRW/CdDONrd8PjwClNheaYmPrh/PKOGyCXlDXNAkv8GQ6KYhwXxbTjpTlnfRRTEq63WYcXXxp+a16zBL6RZqLaYNL6fABq/Lnx3fq0oO9zluCXxB/4i5h6FRdkbyWLArUJjxt3tosFfUZYBqD4jqXyU8IjyqDvIZZKk5gaL81weCfhbvZRLQnojwGMBF+gaISJhDmD7da8Fn7QzjdxL4t/xN+L8Xe5kIBa8R+zJAxqVllmBL7Gn7EsJRilSpYZkNndCOjWfGZZYkY1Yyyz4I6Y76QswIv1A8ssybEoEf0syvzPbAMOhpRP83ejOwAAAABJRU5ErkJggg==>