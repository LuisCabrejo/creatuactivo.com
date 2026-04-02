# **Estrategia Integral de Producción para "El Regreso": Convergencia de Neurociencia Cognitiva, Ingeniería Psicoacústica y Narrativa Visual Generativa**

## **1\. Introducción: La Arquitectura de la Atención en la Era de la Distracción**

La producción del proyecto audiovisual "El Regreso" representa una oportunidad sin precedentes para trascender las metodologías convencionales de creación de contenido y adoptar un enfoque fundamentado en la evidencia científica. En un ecosistema digital saturado, donde la competencia por la atención humana es feroz y la capacidad de concentración promedio ha disminuido, la mera calidad estética ya no es suficiente para garantizar el impacto del mensaje. La presente estrategia propone un cambio de paradigma: dejar de considerar el video como una simple secuencia de imágenes y sonidos, para redefinirlo como un **sistema de estímulos neurocognitivos** diseñado para optimizar el procesamiento de información, maximizar la retención mnemotécnica y establecer una autoridad incuestionable mediante la excelencia técnica.

Este informe despliega una hoja de ruta exhaustiva que integra hallazgos de vanguardia en neurociencia de la atención, psicoacústica aplicada, teoría de la carga cognitiva y cinematografía digital avanzada. El objetivo es diseñar una experiencia de visualización para "El Regreso" que induzca un estado de flujo cognitivo, minimizando la fricción mental y asegurando que la narrativa estratégica penetre en la memoria a largo plazo de la audiencia objetivo.

### **1.1 El Imperativo de la Calidad Técnica como Herramienta Cognitiva**

La premisa central de este análisis es que las especificaciones técnicas —desde la profundidad de bits del audio hasta la tasa de refresco de los fotogramas— no son decisiones meramente artísticas, sino determinantes funcionales de la credibilidad. Investigaciones recientes realizadas por la Universidad del Sur de California (USC) y la Universidad Nacional de Australia han revelado un fenómeno psicológico crítico: el "efecto halo" de la calidad de audio.1 Cuando un espectador se enfrenta a una grabación con imperfecciones técnicas, su cerebro no solo registra una mala calidad de sonido; subconscientemente, transfiere ese juicio negativo a la fuente de la información. El hablante es percibido como menos inteligente, menos competente y su investigación como menos relevante.3

Por tanto, la excelencia técnica en "El Regreso" actúa como un mecanismo de validación epistémica. Si el procesamiento sensorial es fluido (alta fluidez perceptual), el cerebro interpreta la información entrante como más veraz y confiable.5 Este informe detalla cómo lograremos esa fluidez mediante el uso de hardware específico (DJI Osmo Pocket 3, DJI Mic 2\) y flujos de trabajo de post-producción quirúrgicos.

## ---

**2\. Neurodinámica del Espectador: Gestión de la Carga Cognitiva y Ritmo**

Para estructurar "El Regreso", primero debemos comprender las limitaciones biológicas del hardware que lo procesará: el cerebro humano. La Teoría de la Carga Cognitiva (CLT) sugiere que la memoria de trabajo tiene una capacidad finita para procesar nueva información. Cualquier elemento del video que no contribuya directamente al aprendizaje o la narrativa constituye "carga cognitiva extraña" y debe ser eliminado despiadadamente.6

### **2.1 La Paradoja de la Velocidad y la Retención**

Contrario a la intuición tradicional de que un ritmo lento facilita la comprensión, la literatura científica en *Applied Cognitive Psychology* indica que una velocidad de reproducción ligeramente acelerada (entre 1.25x y 1.5x) puede mejorar la concentración y la retención en audiencias cognitivamente sanas.6 La explicación reside en la ocupación de recursos: un ritmo excesivamente lento deja "ancho de banda" cognitivo libre, permitiendo que la mente divague (*mind-wandering*). Al aumentar la densidad de información, forzamos al cerebro a asignar todos sus recursos atencionales al estímulo presente, reduciendo la distracción interna.6

Para "El Regreso", esto no implica que el narrador deba hablar artificialmente rápido, lo cual sonaría poco natural y ansioso. La estrategia consiste en **emular esta densidad a través de la edición**. Utilizaremos cortes precisos para eliminar silencios muertos no intencionales ("breathing room" innecesario) y emplearemos una cadencia visual rápida que mantenga el cerebro en un estado de alerta continua. Sin embargo, es crucial equilibrar esto; mientras que los jóvenes se benefician de la velocidad, la complejidad intrínseca del guion estratégico requiere momentos de pausa deliberada para la consolidación de la memoria.7

### **2.2 Segmentación y Procesamiento Dual**

El cerebro procesa la información visual y auditiva por canales separados pero interdependientes. La teoría del "Dual Coding" sugiere que la retención se maximiza cuando la información verbal se refuerza simultáneamente con imágenes congruentes, sin que una compita con la otra.7

Para implementar esto, utilizaremos **Tipografía Cinética (Kinetic Typography)** sincronizada. Cuando el guion mencione un concepto clave, este aparecerá en pantalla. Esto no es redundancia; es refuerzo. El espectador *oye* el concepto y *lee* el concepto al mismo tiempo, creando dos huellas de memoria separadas que convergen en una representación mental más robusta.8

### **2.3 Contrarrestando la Multitarea Digital**

Debemos asumir un entorno de visualización hostil donde el espectador podría estar tentado a realizar multitarea ("second screening"). La neurociencia confirma que la multitarea digital fragmenta el control cognitivo y degrada severamente la memoria de trabajo.10 Los "multitaskers" crónicos pierden la capacidad de filtrar información irrelevante.

Por consiguiente, el diseño visual de "El Regreso" debe ser **"visualmente pegajoso" pero cognitivamente calmado**. Debemos evitar la sobrecarga sensorial tipo "MTV" (flashes, cortes aleatorios) que agota la glucosa cerebral. En su lugar, optaremos por un estilo de "High Retention Editing" popularizado por creadores como Dan Koe 11, que utiliza movimiento constante pero suave (smooth motion), transiciones fluidas y fondos abstractos generativos (p5.js) para guiar la atención sin disparar respuestas de estrés o fatiga visual.12

## ---

**3\. Ingeniería Psicoacústica: La Voz de la Autoridad**

Dada la evidencia sobre el impacto del audio en la credibilidad 2, el tratamiento sonoro de "El Regreso" será la prioridad técnica número uno. No buscaremos simplemente "audio limpio"; buscaremos una firma sonora que denote autoridad, intimidad y presencia física.

### **3.1 Captura de Alta Fidelidad: La Revolución del 32-bit Float**

Utilizaremos el sistema **DJI Mic 2** configurado específicamente en modo de grabación interna de **32-bit Float**.13 Es imperativo comprender la física detrás de esta elección para justificar su implementación en el flujo de trabajo.

El audio digital convencional de 24 bits tiene un rango dinámico teórico de aproximadamente 144 dB. Aunque amplio, si la ganancia de entrada se configura incorrectamente, un grito repentino o una risa pueden exceder el límite digital (0 dBFS), resultando en "clipping" (recorte de onda) — una distorsión digital irreparable que destruye la inmersión.15 Por el contrario, el formato de 32 bits en coma flotante ofrece un rango dinámico superior a los 1,500 dB. Matemáticamente, los valores de amplitud pueden exceder el 0 dBFS sin perder información, ya que la "coma flotante" simplemente desplaza el punto decimal.

**Implicación Práctica:** Esto permite al narrador de "El Regreso" susurrar una confidencia estratégica y, segundos después, proyectar la voz con fuerza dramática sin que el ingeniero de sonido tenga que ajustar los preamplificadores en tiempo real. En post-producción, cualquier señal que parezca distorsionada puede simplemente "bajarse de volumen" para recuperar la onda perfecta, garantizando que ninguna toma emocional se pierda por error técnico.15

### **3.2 Cadena de Procesamiento Vocal (The Authority Chain)**

Para transformar la grabación bruta en una voz de "broadcast" autoritaria, aplicaremos una cadena de efectos (Vocal Chain) basada en principios psicoacústicos. El objetivo es resaltar las frecuencias que el cerebro humano asocia con el tamaño corporal y la proximidad (efecto de proximidad), mientras se eliminan las frecuencias que causan fatiga auditiva.

La siguiente tabla detalla la configuración exacta para la post-producción de audio en "El Regreso":

| Etapa del Procesamiento | Configuración Técnica | Justificación Psicoacústica y Cognitiva |
| :---- | :---- | :---- |
| **1\. Limpieza Espectral (Restoration)** | **iZotope RX:** De-click (mouth noise), Spectral De-noise. | Los ruidos de boca (saliva, clicks) activan una respuesta de asco ("misofonía") en algunos oyentes, rompiendo la conexión empática. La limpieza debe ser quirúrgica.17 |
| **2\. Ecualización Sustractiva (EQ)** | **HPF (High Pass Filter):** 75Hz \- 80Hz (12dB/oct). **Corte de "Barro":** \-3dB en 300Hz-400Hz (Q media). | Eliminar frecuencias sub-graves inaudibles libera "headroom" para el compresor. Cortar los 400Hz reduce la "nasalidad", haciendo la voz menos fatigante y más clara.18 |
| **3\. Compresión Primaria (Control)** | **Ratio:** 4:1. **Threshold:** \-10dB a \-12dB. **Ataque:** Medio (15ms). **Release:** Rápido (50ms). | Controla los picos transitorios (el inicio de las palabras) sin aplastar la dinámica. Un ataque medio permite que la consonante inicial pase, manteniendo la articulación clara.19 |
| **4\. Ecualización Aditiva (Color)** | **Boost:** \+2dB en 100Hz-150Hz (Cuerpo). **Boost:** \+3dB en 3kHz-5kHz (Presencia). **High Shelf:** \+2dB en 12kHz (Aire). | El cuerpo (100Hz) da autoridad masculina/profunda. La presencia (3-5kHz) es donde el oído humano es más sensible; aumentarla mejora la inteligibilidad léxica. El "aire" añade una percepción de fidelidad costosa.18 |
| **5\. Compresión Secundaria (Glue)** | **Ratio:** 2:1 o 3:1. **Ataque:** Rápido (1-3ms). **Release:** Lento/Auto. | Esta etapa nivela las palabras suaves con las fuertes, asegurando que el mensaje sea audible incluso en entornos ruidosos (metro, calle). Aumenta la densidad percibida de la voz.21 |
| **6\. De-Essing** | **Frecuencia:** 6kHz \- 8kHz. **Rango:** \-4dB a \-6dB. | La sibilancia (sonidos "S" y "T") excesiva es físicamente dolorosa a volúmenes altos. El De-esser suaviza estos picos de alta frecuencia para una escucha prolongada confortable.17 |

### **3.3 El Espacio Acústico**

Evitaremos el sonido de "habitación vacía" (reverberación no tratada), que psicológicamente sugiere amateurismo o distancia. La voz debe sonar "seca" y presente, como si el narrador estuviera hablando directamente al oído del espectador. Si se necesita ambiente, se añadirá una reverberación de convolución muy sutil en post-producción (tipo "Studio A" o "Wooden Room") para dar naturalidad sin perder intimidad.18

## ---

**4\. Arquitectura Visual: Cinematografía y Lenguaje de Cámara**

La imagen de "El Regreso" debe distanciarse estéticamente del contenido generado por usuarios (UGC) típico de redes sociales. Utilizaremos la cámara **DJI Osmo Pocket 3**, aprovechando su sensor de 1 pulgada para lograr una estética cinematográfica, pero solo si se configura rompiendo los automatismos de fábrica.

### **4.1 Física de la Percepción Visual y Frame Rate**

El estándar de **24 fotogramas por segundo (fps)** no es una elección nostálgica; es una elección perceptiva. El sistema visual humano procesa la información visual con cierta latencia ("low-pass filtering").22

* **60 fps (Hiperrealismo):** Ofrece una fluidez extrema que el cerebro asocia con la realidad inmediata, noticias en vivo, deportes o videojuegos. Elimina la barrera de la ficción/narrativa.  
* **24 fps (Narrativa):** Introduce una sutil discontinuidad temporal que el cerebro ha sido entrenado culturalmente para interpretar como "historia", "cine" o "reflexión". Para un video estratégico como "El Regreso", queremos evocar esta solemnidad narrativa, no la inmediatez de un telediario.23

**La Regla de los 180 Grados:** Para que el movimiento a 24 fps se sienta natural y no entrecortado (stuttery), es imperativo que cada fotograma capture suficiente desenfoque de movimiento (motion blur) para mezclarse con el siguiente. Esto se logra fijando la velocidad de obturación (shutter speed) en **1/50 de segundo** (el doble del frame rate). Cualquier velocidad mayor (ej. 1/100, 1/200) creará una imagen nítida y nerviosa que aumenta la ansiedad visual.23

### **4.2 Gestión del Color y Rango Dinámico (D-Log M)**

Para maximizar la calidad de imagen del sensor del Osmo Pocket 3, grabaremos exclusivamente en el perfil de color **D-Log M** (10-bit). A diferencia de los perfiles estándar (Rec.709) que "hornean" el contraste y la saturación, el perfil logarítmico preserva la información en las sombras y las luces altas comprimiendo la curva de gamma.

* **Beneficio:** Permite recuperar detalles en post-producción si la iluminación no es perfecta y, crucialmente, evita el "banding" (bandas de color) en los degradados suaves de los fondos generativos.23  
* **Flujo de Trabajo:** En post-producción, se aplicará un LUT (Look Up Table) de conversión técnica (D-Log M a Rec.709) seguido de una gradación creativa para establecer el tono anímico.26

### **4.3 Semántica del Movimiento de Cámara**

El uso del gimbal no debe ser arbitrario. Cada movimiento de cámara comunica una intención subconsciente al espectador. Definimos el siguiente vocabulario visual para "El Regreso" 23:

| Movimiento (Gimbal) | Ejecución Técnica | Significado Narrativo |
| :---- | :---- | :---- |
| **Push-In (Dolly In)** | Avance lento y constante hacia el sujeto. | Aumenta la intensidad emocional o intelectual. Señala: "Presta atención, esto es importante". Ideal para conclusiones de argumentos. |
| **Pull-Back (Dolly Out)** | Retroceso lento revelando el entorno. | Contextualización, cierre, o dejar al espectador reflexionando sobre una idea mientras nos alejamos. Sensación de finalidad. |
| **Parallax (Slide \+ Pan)** | Movimiento lateral (Truck) mientras la cámara gira (Pan) para mantener al sujeto centrado. | Separa al sujeto del fondo mediante el desplazamiento relativo de planos. Crea tridimensionalidad y dinamismo visual sin cortes. |
| **Orbit (Órbita)** | Giro circular alrededor de un objeto estático. | "Hero shot". Eleva el estatus del objeto o persona filmada. Ideal para presentar productos o conceptos centrales (el "Monolito"). |
| **Tilt Up (Revelación)** | Movimiento vertical de abajo hacia arriba. | Sugiere crecimiento, superioridad o la magnitud de un problema/solución. Otorga poder al sujeto. |

**Nota sobre Objetos Estáticos:** Para grabar maquetas, guiones impresos o elementos de utilería, no usaremos cámara en mano. Usaremos el modo "Tilt Locked" del Osmo Pocket 3 y moveremos el cuerpo entero del operador para simular un slider motorizado de precisión, eliminando el micro-temblor humano que denota amateurismo.23

## ---

**5\. Iluminación y Psicología del Color: La Atmósfera del Conocimiento**

La iluminación y el color no solo permiten ver; permiten *sentir*. Estableceremos una atmósfera de "Lujo Intelectual" utilizando esquemas de iluminación clásicos y paletas de color contemporáneas.

### **5.1 Esquema de Iluminación Rembrandt**

Para las tomas del narrador, rechazamos la iluminación plana y uniforme típica de la televisión corporativa. Adoptaremos el esquema **Rembrandt**, caracterizado por iluminar un lado del rostro mientras el otro permanece en penumbra, salvo por un pequeño triángulo de luz bajo el ojo en el lado sombreado.29

* **Mecanismo:** Luz principal (Key Light) a 45° lateral y 45° vertical respecto al sujeto.  
* **Efecto Psicológico:** Este claroscuro aporta volumen, profundidad y dramatismo. Históricamente asociado con retratos de pensadores y líderes, confiere al orador una gravedad y seriedad inmediatas.31  
* **Ratio de Contraste:** Mantendremos un ratio alto (4:1 o superior) entre el lado iluminado y el lado oscuro para enfatizar la textura y el carácter, evitando el look "plástico".32

### **5.2 Psicología Cromática y Paleta de Colores**

Los colores influyen directamente en la cognición y el estado de ánimo. Mientras que los colores cálidos (rojo, amarillo) excitan y alertan, pueden causar fatiga visual rápida. Los colores fríos (azul, verde) relajan pero pueden parecer pasivos. Para un video estratégico, necesitamos **autoridad (negro/oscuro)** y **valor (oro/luz)**.33

Proponemos una paleta "Dark Mode Luxury" para minimizar la fatiga visual (glare) y maximizar la percepción de exclusividad.34

**Tabla de Códigos Hexadecimales para Post-Producción:**

| Elemento | Color Sugerido | Código Hex | Psicología y Función |
| :---- | :---- | :---- | :---- |
| **Fondo Principal (Canvas)** | Negro Carbón (Charcoal) | \#0D0D0D | Autoridad absoluta, misterio, contraste máximo. Reduce la emisión de luz azul hacia el espectador.36 |
| **Fondo Secundario** | Azul Medianoche (Midnight) | \#0F172A | Profundidad, inteligencia, estabilidad corporativa moderna. Alternativa menos agresiva al negro puro. |
| **Texto Primario** | Blanco Hueso (Off-White) | \#F2EFEA | Legibilidad óptima. Evita la "vibración" visual del blanco puro (\#FFFFFF) sobre fondo negro. Calidez sutil. |
| **Acento/Énfasis 1** | Oro Muted (Muted Gold) | \#C6A87C | Sabiduría, valor, calidad premium. Se usará para palabras clave y líneas de conexión en gráficos. |
| **Acento/Énfasis 2** | Azul Eléctrico (Electric Blue) | \#3B82F6 | Tecnología, futuro, innovación digital. Se usará para datos técnicos o gráficos de red. |

Esta paleta debe ser consistente en vestuario, iluminación (geles de color sutiles en luces de contra) y, crucialmente, en los gráficos generativos.35

## ---

**6\. Identidad Visual Generativa: Programación Creativa con p5.js**

Para diferenciar "El Regreso" de la competencia que utiliza plantillas genéricas, implementaremos una identidad visual basada en código ("Creative Coding"). Utilizaremos la librería de JavaScript **p5.js** para crear fondos animados de partículas conectadas. Este estilo visual metáfora la interconexión de ideas estratégicas y la complejidad de los sistemas que estamos analizando.

### **6.1 Lógica del Sistema de Partículas (Red Neuronal)**

El concepto visual es una red dinámica donde nodos (ideas) flotan y se conectan automáticamente cuando están próximos. Esto no es una animación pre-renderizada cíclica (loop); es una simulación viva.37

**Algoritmo de Comportamiento:**

1. **Generación:** Se crean ![][image1] partículas con posiciones ![][image2] y velocidades ![][image3] aleatorias.  
2. **Movimiento:** En cada fotograma, la posición se actualiza: ![][image4]. Si la partícula toca un borde, invierte su velocidad (rebote).  
3. **Conectividad:** Para cada par de partículas, se calcula la distancia euclidiana ![][image5].  
4. **Renderizado Condicional:** Si ![][image6], se dibuja una línea entre ellas.  
5. **Mapeo de Opacidad:** La opacidad (alpha) de la línea es inversamente proporcional a la distancia. Cuanto más cerca, más sólida la línea; cuanto más lejos, más transparente hasta desaparecer. Esto crea una sensación orgánica de "respiración" en la red.39

### **6.2 Implementación de Código para Exportación**

A continuación, se presenta la estructura de código p5.js optimizada para generar este recurso gráfico. Dado que necesitamos transparencia para superponerlo en el video, el código está diseñado para exportarse o grabarse con fondo limpio.

JavaScript

// Configuración para 'El Regreso' \- Fondo de Red Neuronal Generativa  
// Lenguaje: JavaScript (p5.js)

let particles \=;  
const numParticles \= 100; // Ajustar densidad según necesidad  
const connectionThreshold \= 150; // Distancia máxima para conectar

function setup() {  
  createCanvas(1920, 1080); // Resolución Full HD estándar  
  // Inicializar partículas  
  for (let i \= 0; i \< numParticles; i++) {  
    particles.push(new Particle());  
  }  
}

function draw() {  
  clear(); // IMPORTANTE: Limpia el canvas para transparencia total en cada frame  
  // Si se necesita previsualizar con fondo: background(13, 13, 13);   
    
  for (let i \= 0; i \< particles.length; i++) {  
    particles\[i\].update();  
    particles\[i\].show();  
      
    // Lógica de conexión (Doble bucle optimizado)  
    for (let j \= i \+ 1; j \< particles.length; j++) {  
      let d \= dist(particles\[i\].x, particles\[i\].y, particles\[j\].x, particles\[j\].y);  
        
      if (d \< connectionThreshold) {  
        // La opacidad depende de la distancia: más cerca \= más visible  
        let alphaValue \= map(d, 0, connectionThreshold, 200, 0);  
        strokeWeight(1.5);  
        stroke(198, 168, 124, alphaValue); // Color: Oro Muted (\#C6A87C)  
        line(particles\[i\].x, particles\[i\].y, particles\[j\].x, particles\[j\].y);  
      }  
    }  
  }  
}

class Particle {  
  constructor() {  
    this.x \= random(width);  
    this.y \= random(height);  
    // Velocidad muy lenta para elegancia y "lujo cognitivo"  
    this.vx \= random(-0.3, 0.3);   
    this.vy \= random(-0.3, 0.3);  
    this.size \= 3;  
  }

  update() {  
    this.x \+= this.vx;  
    this.y \+= this.vy;

    // Rebote suave en los bordes  
    if (this.x \< 0 |

| this.x \> width) this.vx \*= \-1;  
    if (this.y \< 0 |

| this.y \> height) this.vy \*= \-1;  
  }

  show() {  
    noStroke();  
    fill(242, 239, 234, 150); // Color: Blanco Hueso (\#F2EFEA)  
    ellipse(this.x, this.y, this.size);  
  }  
}

### **6.3 Flujo de Trabajo de Exportación (El Desafío de la Transparencia)**

Exportar video con canal alfa (transparencia) directamente desde el navegador es técnicamente complejo. Para "El Regreso", recomendamos dos vías robustas:

1. **Captura WebM:** Utilizar librerías como CCapture.js para grabar el canvas cuadro a cuadro y exportar en formato WebM, que soporta transparencia nativa y es compatible con Adobe Premiere y DaVinci Resolve.40  
2. **Clave de Croma (Chroma Key):** Si la exportación transparente falla, cambiar clear() por background(0, 255, 0\) (verde puro) en el código, grabar la pantalla a máxima calidad, y eliminar el verde en post-producción usando el efecto "Ultra Key" o "Delta Keyer". Dado que nuestras partículas son doradas/blancas, el contraste con el verde será limpio.42

## ---

**7\. Post-Producción Dinámica: Ingeniería de la Retención**

La fase de edición no es simplemente "cortar y pegar"; es donde se construye el ritmo cognitivo. Adoptaremos un estilo de edición de "Ensayo Visual" (Visual Essayist), similar al de creadores de alto impacto como Dan Koe o Vox, que prioriza la claridad y el flujo sobre la pirotecnia visual.11

### **7.1 La Montaña Rusa de Ritmo (Pacing Rollercoaster)**

Para evitar la habituación sensorial (aburrimiento), el video debe variar su densidad de información constantemente.

* **Fase de Exposición (Alta Densidad):** Cuando se explican datos técnicos o listas, el ritmo de corte se acelera. Usamos cortes rápidos, zooms digitales sutiles ("punch-ins") en cada frase nueva, y tipografía cinética rápida. Esto eleva la energía y exige atención.44  
* **Fase de Reflexión (Baja Densidad):** Cuando se entrega la "tesis central" o una conclusión filosófica, el ritmo se desacelera drásticamente. Usamos planos largos, movimiento lento (slow motion a 24fps) y dejamos que el fondo generativo respire. Esta "descompresión" permite que el espectador consolide la información en la memoria a largo plazo antes del siguiente bloque de datos.44

### **7.2 Tipografía Cinética como Actor Principal**

El texto en pantalla no son subtítulos pasivos; es un elemento gráfico activo.

* **Fuentes:** Utilizaremos familias tipográficas Sans-Serif geométricas y audaces como **Montserrat (Bold/ExtraBold)** o **The Bold Font** para los titulares, y **Inter** para cuerpo de texto. Estas fuentes tienen alta legibilidad en pantallas móviles y transmiten modernidad.46  
* **Animación:** Las palabras clave no deben simplemente "aparecer". Deben tener una animación de entrada (In-Animation) congruente, como un deslizamiento vertical rápido (Translate Y \+ Opacity) o un efecto de revelado por máscara. El movimiento debe ser fluido ("Eased"), usando curvas de velocidad Bezier para que se sientan naturales y no mecánicas.9

### **7.3 B-Roll Híbrido: Digital y Analógico**

Para mantener el interés visual sin incurrir en costos de producción de locaciones masivos, mezclaremos:

1. **B-Roll Analógico:** Clips grabados con el Osmo Pocket 3 del narrador escribiendo, caminando o manipulando objetos (lentes, libros). Estos planos "humanizan" el contenido.27  
2. **B-Roll Digital:** Animaciones de interfaces abstractas, grabaciones de pantalla de software y los fondos generativos de p5.js. Esto "tecnifica" el contenido y refuerza la autoridad en la materia.11

## ---

**8\. Hoja de Ruta de Implementación (Checklist de Producción)**

Para garantizar la ejecución impecable de esta estrategia, se establece el siguiente protocolo secuencial.

### **Fase 1: Pre-Producción**

* \[ \] **Análisis de Guion:** Identificar palabras clave para Kinetic Typography. Marcar pausas dramáticas para cambios de ritmo.44  
* \[ \] **Prueba de Vestuario:** Verificar contraste del vestuario con el fondo negro/oscuro. Evitar patrones finos (moiré).  
* \[ \] **Setup de Código:** El equipo de desarrollo debe tener listo el script de p5.js y realizar una prueba de exportación (WebM o Chroma).40

### **Fase 2: Producción (Rodaje)**

* \[ \] **Audio:** Configurar DJI Mic 2 en 32-bit Float. Verificar ganancia (aunque sea flotante, es mejor tener una onda visible). Colocar lavalier oculto o muy discreto.13  
* \[ \] **Cámara:** Configurar Osmo Pocket 3: 4K, 24fps, Shutter 1/50, ISO \<400, D-Log M, Focus Mode: Continuous (Face Tracking activado para entrevista).23  
* \[ \] **Iluminación:** Establecer Key Light a 45° (Rembrandt). Verificar triángulo de luz en pómulo. Negativo de relleno (bandera negra) en el lado sombreado para contraste.29

### **Fase 3: Post-Producción**

* \[ \] **Sincronización:** Alinear audio y video.  
* \[ \] **Vocal Chain:** Aplicar presets de EQ, Compresión y De-essing detallados en la Sección 3.2.18  
* \[ \] **Corte:** Editar A-Roll eliminando silencios y errores. Establecer el ritmo base.  
* \[ \] **Gráficos:** Superponer capas de p5.js (modo de fusión "Screen" o "Add" si es sobre negro, o usar canal alfa). Animar textos clave.42  
* \[ \] **Color Grading:** Aplicar LUT de conversión D-Log M \-\> Rec.709. Ajustar curvas para negros puros pero con detalle. Teñir ligeramente las altas luces con el tono Oro (\#C6A87C) para coherencia de marca.26  
* \[ \] **Exportación Final:** Renderizar en 4K (3840x2160) con bitrate alto (H.264 o H.265, 40-60 Mbps) para YouTube/Vimeo.

## **Conclusión**

La estrategia aquí delineada no deja nada al azar. Al alinear la física de la captura (32-bit float, sensores logarítmicos), la psicología de la percepción (24fps, esquemas de color de autoridad) y la neurociencia de la atención (carga cognitiva, ritmo variable), "El Regreso" se posiciona no solo como una pieza de contenido, sino como un artefacto de influencia diseñado para penetrar y perdurar en la mente del espectador. La ejecución rigurosa de estos parámetros técnicos es la garantía de que el mensaje estratégico será recibido con la credibilidad y el impacto que merece.

#### **Fuentes citadas**

1. The quality of audio influences whether you believe what you hear \- USC Today, acceso: enero 26, 2026, [https://today.usc.edu/why-we-believe-something-audio-sound-quality/](https://today.usc.edu/why-we-believe-something-audio-sound-quality/)  
2. Superficial auditory (dis)fluency biases higher-level social judgment | PNAS, acceso: enero 26, 2026, [https://www.pnas.org/doi/10.1073/pnas.2415254122](https://www.pnas.org/doi/10.1073/pnas.2415254122)  
3. Now Hear This: Audio Quality Can Impact Your Credibility \- Goto Meeting, acceso: enero 26, 2026, [https://www.goto.com/blog/now-hear-audio-quality-impacts-credibility](https://www.goto.com/blog/now-hear-audio-quality-impacts-credibility)  
4. Audio quality influences whether you believe what you hear \- USC Dornsife, acceso: enero 26, 2026, [https://dornsife.usc.edu/news/stories/norbert-schwarz-research-links-sound-quality-belief/](https://dornsife.usc.edu/news/stories/norbert-schwarz-research-links-sound-quality-belief/)  
5. How Sound Quality Impacts Whether You Believe What You Hear \- Audality, acceso: enero 26, 2026, [https://www.audality.com/blog/audality-blog-5/how-sound-quality-impacts-whether-you-believe-what-you-hear-124](https://www.audality.com/blog/audality-blog-5/how-sound-quality-impacts-whether-you-believe-what-you-hear-124)  
6. How Does Video Speed Up Affect Concentration and Memory? \- Saima AI, acceso: enero 26, 2026, [https://saima.ai/blog/how-does-video-speed-up-affect-concentration-and-memory](https://saima.ai/blog/how-does-video-speed-up-affect-concentration-and-memory)  
7. The Effect of Video Playback Speed on Learning and Mind-Wandering in Younger and Older Adults \- PMC \- NIH, acceso: enero 26, 2026, [https://pmc.ncbi.nlm.nih.gov/articles/PMC10330257/](https://pmc.ncbi.nlm.nih.gov/articles/PMC10330257/)  
8. Reducing cognitive load during video lectures in physiology with eye movement modeling and pauses: a randomized controlled study, acceso: enero 26, 2026, [https://journals.physiology.org/doi/full/10.1152/advan.00185.2021](https://journals.physiology.org/doi/full/10.1152/advan.00185.2021)  
9. What is kinetic typography? 20+ fast typography templates to put your words into motion \- Envato, acceso: enero 26, 2026, [https://elements.envato.com/learn/fast-typography-templates](https://elements.envato.com/learn/fast-typography-templates)  
10. Digital multitasking and hyperactivity: unveiling the hidden costs to brain health \- PMC \- NIH, acceso: enero 26, 2026, [https://pmc.ncbi.nlm.nih.gov/articles/PMC11543232/](https://pmc.ncbi.nlm.nih.gov/articles/PMC11543232/)  
11. Minimalist Reels Editing – Dan Koe Style After Effects Full Course \- YouTube, acceso: enero 26, 2026, [https://www.youtube.com/watch?v=9QK7QRIwodg](https://www.youtube.com/watch?v=9QK7QRIwodg)  
12. The Impact of Short-Form Video Use on Cognitive and Mental Health Outcomes: A Systematic Review | medRxiv, acceso: enero 26, 2026, [https://www.medrxiv.org/content/10.1101/2025.08.27.25334540v1.full-text](https://www.medrxiv.org/content/10.1101/2025.08.27.25334540v1.full-text)  
13. Setup 32-Bit Float for the BEST Audio\! (DJI Mic 2\) \- YouTube, acceso: enero 26, 2026, [https://www.youtube.com/shorts/FV2bOSdjyOM](https://www.youtube.com/shorts/FV2bOSdjyOM)  
14. Introduction to DJI Mic 2 32-bit float recording, Auto Power Off, and auto power-on/off in sync with camera, acceso: enero 26, 2026, [https://repair.dji.com/help/content?customId=01700009936\&spaceId=17\&re=US\&lang=en\&documentType=\&paperDocType=ARTICLE](https://repair.dji.com/help/content?customId=01700009936&spaceId=17&re=US&lang=en&documentType&paperDocType=ARTICLE)  
15. Superior Audio: Mastering 32-Bit Float on the DJI Mic 2 With Examples \- YouTube, acceso: enero 26, 2026, [https://www.youtube.com/watch?v=DGrqoKcgNdI](https://www.youtube.com/watch?v=DGrqoKcgNdI)  
16. DJI Mic 2 BEST Settings Guide \- How to Use It \- YouTube, acceso: enero 26, 2026, [https://www.youtube.com/watch?v=H2ukvYti8f4](https://www.youtube.com/watch?v=H2ukvYti8f4)  
17. How do I make my DJI mic 2 sound better? \- Reddit, acceso: enero 26, 2026, [https://www.reddit.com/r/dji/comments/1fd07w2/how\_do\_i\_make\_my\_dji\_mic\_2\_sound\_better/](https://www.reddit.com/r/dji/comments/1fd07w2/how_do_i_make_my_dji_mic_2_sound_better/)  
18. How to Make the Perfect Vocal Chain for YOUR Voice (With Only Stock Plugins\!) \- YouTube, acceso: enero 26, 2026, [https://www.youtube.com/watch?v=EISF4iJpmQU](https://www.youtube.com/watch?v=EISF4iJpmQU)  
19. The Best Compressor Settings for Vocals (Exact Settings to Use) \- Music Guy Mixing, acceso: enero 26, 2026, [https://www.musicguymixing.com/compressor-settings-for-vocals/](https://www.musicguymixing.com/compressor-settings-for-vocals/)  
20. A guide to vocal compression for podcasters \- Acast, acceso: enero 26, 2026, [https://www.acast.com/en-us/blog/a-guide-to-vocal-compression-for-podcasters](https://www.acast.com/en-us/blog/a-guide-to-vocal-compression-for-podcasters)  
21. Audio Compression Settings: Threshold, Ratio, Attack, Release, and Makeup Gain, acceso: enero 26, 2026, [https://www.youtube.com/watch?v=VNsRt4AKBWE](https://www.youtube.com/watch?v=VNsRt4AKBWE)  
22. for a persistent perceptual experience, why is video able to have a lower frame rate than audio? \- Psychology & Neuroscience Stack Exchange, acceso: enero 26, 2026, [https://psychology.stackexchange.com/questions/21572/for-a-persistent-perceptual-experience-why-is-video-able-to-have-a-lower-frame](https://psychology.stackexchange.com/questions/21572/for-a-persistent-perceptual-experience-why-is-video-able-to-have-a-lower-frame)  
23. How to Achieve Cinematic Footage with the DJI Osmo Pocket 3 – Detailed Guide \+ Gear \+ Workflow (Input Welcome\!) : r/osmopocket \- Reddit, acceso: enero 26, 2026, [https://www.reddit.com/r/osmopocket/comments/1jtm7kr/how\_to\_achieve\_cinematic\_footage\_with\_the\_dji/](https://www.reddit.com/r/osmopocket/comments/1jtm7kr/how_to_achieve_cinematic_footage_with_the_dji/)  
24. Frame Rate: a Beginner's Guide \- TechSmith, acceso: enero 26, 2026, [https://www.techsmith.com/blog/frame-rate-beginners-guide/](https://www.techsmith.com/blog/frame-rate-beginners-guide/)  
25. DJI OSMO Pocket 3 D-Log M to Rec.709 \- Download Center \- DJI United States, acceso: enero 26, 2026, [https://www.dji.com/downloads/softwares/osmo-pocket-3-dlog-to-rec709](https://www.dji.com/downloads/softwares/osmo-pocket-3-dlog-to-rec709)  
26. FASTEST Way To Color Grade DJI D-Log M | Osmo Pocket 3 & Osmo Action 4 | DaVinci Resolve Tutorial \- YouTube, acceso: enero 26, 2026, [https://www.youtube.com/watch?v=XwGD92Q0QgE](https://www.youtube.com/watch?v=XwGD92Q0QgE)  
27. 8 DJI Pocket 3 Moves That'll INSTANTLY Upgrade Your Shots \- YouTube, acceso: enero 26, 2026, [https://www.youtube.com/watch?v=XYexFfA48mA](https://www.youtube.com/watch?v=XYexFfA48mA)  
28. 8 Cinematic Camera Techniques To Elevate Your Osmo Pocket 3 Videos \- YouTube, acceso: enero 26, 2026, [https://www.youtube.com/watch?v=G5RhXE-GZw0](https://www.youtube.com/watch?v=G5RhXE-GZw0)  
29. How to film a Cinematic Interview with Rembrandt Lighting (TUTORIAL) \- YouTube, acceso: enero 26, 2026, [https://www.youtube.com/watch?v=4Ln0fRDac6w](https://www.youtube.com/watch?v=4Ln0fRDac6w)  
30. Photography Lighting Tutorial: How To Do Rembrandt Lighting \- YouTube, acceso: enero 26, 2026, [https://www.youtube.com/watch?v=Spiz1dcnDMY](https://www.youtube.com/watch?v=Spiz1dcnDMY)  
31. How to create Rembrandt light \- YouTube, acceso: enero 26, 2026, [https://www.youtube.com/watch?v=yrOaRBEsqB4](https://www.youtube.com/watch?v=yrOaRBEsqB4)  
32. Can anyone help me set up better lighting for youtube talking head? : r/videography \- Reddit, acceso: enero 26, 2026, [https://www.reddit.com/r/videography/comments/jnk2dr/can\_anyone\_help\_me\_set\_up\_better\_lighting\_for/](https://www.reddit.com/r/videography/comments/jnk2dr/can_anyone_help_me_set_up_better_lighting_for/)  
33. Color Psychology: Use Warm Hues to Energize Your eLearning, acceso: enero 26, 2026, [https://www.shiftelearning.com/blog/color-psychology-elearning-part1](https://www.shiftelearning.com/blog/color-psychology-elearning-part1)  
34. The Impact of Color Cues on the Learning Performance in Video Lectures \- PMC \- NIH, acceso: enero 26, 2026, [https://pmc.ncbi.nlm.nih.gov/articles/PMC11274038/](https://pmc.ncbi.nlm.nih.gov/articles/PMC11274038/)  
35. 101 Brilliant Color Combinations \- Adobe, acceso: enero 26, 2026, [https://www.adobe.com/express/learn/blog/101-brilliant-color-combinations](https://www.adobe.com/express/learn/blog/101-brilliant-color-combinations)  
36. 10 sophisticated color palettes for luxury branding (2025) \- Steph Corrigan Design, acceso: enero 26, 2026, [https://stephcorrigan.com/sophisticated-color-palettes/](https://stephcorrigan.com/sophisticated-color-palettes/)  
37. Creating Stunning Particle Systems in p5.js | by Eftee Codes \- Medium, acceso: enero 26, 2026, [https://efteecodes.medium.com/creating-stunning-particle-systems-in-p5-js-acd30adb4426](https://efteecodes.medium.com/creating-stunning-particle-systems-in-p5-js-acd30adb4426)  
38. Connected Particles \- p5.js, acceso: enero 26, 2026, [https://p5js.org/examples/classes-and-objects-connected-particles/](https://p5js.org/examples/classes-and-objects-connected-particles/)  
39. Create this Delightful Interactive Particle Network \- YouTube, acceso: enero 26, 2026, [https://www.youtube.com/watch?v=vrSoUUWjgRQ](https://www.youtube.com/watch?v=vrSoUUWjgRQ)  
40. How to export images and animations from p5.js \- YouTube, acceso: enero 26, 2026, [https://www.youtube.com/watch?v=bVlIFf-hffY](https://www.youtube.com/watch?v=bVlIFf-hffY)  
41. amandaghassaei/canvas-capture: Record the canvas as an image, mp4 video, or gif from the browser \- GitHub, acceso: enero 26, 2026, [https://github.com/amandaghassaei/canvas-capture](https://github.com/amandaghassaei/canvas-capture)  
42. How to make a video/gif transparent on p5.js? \- Stack Overflow, acceso: enero 26, 2026, [https://stackoverflow.com/questions/55931503/how-to-make-a-video-gif-transparent-on-p5-js](https://stackoverflow.com/questions/55931503/how-to-make-a-video-gif-transparent-on-p5-js)  
43. Dan Koe Animation Breakdown and how to make it in Apple Motion Part 01 \- YouTube, acceso: enero 26, 2026, [https://www.youtube.com/watch?v=Ncw9qYCr3hQ](https://www.youtube.com/watch?v=Ncw9qYCr3hQ)  
44. Master Pacing in Video Editing for Maximum Story Impact \- Inside The Edit, acceso: enero 26, 2026, [https://www.insidetheedit.com/blog/pacing-in-video-editing](https://www.insidetheedit.com/blog/pacing-in-video-editing)  
45. How to Pace Your Film — Examples of Good and Bad Pacing in Editing, Writing and More, acceso: enero 26, 2026, [https://www.youtube.com/watch?v=a9reuDw4cnU](https://www.youtube.com/watch?v=a9reuDw4cnU)  
46. How to edit like Dan Koe, Masterclass Part 1 \- YouTube, acceso: enero 26, 2026, [https://www.youtube.com/watch?v=NsVjGpdy-ac](https://www.youtube.com/watch?v=NsVjGpdy-ac)  
47. UI Tutorial: Redesigning the Almanack of Naval (in 10 Min) \- YouTube, acceso: enero 26, 2026, [https://www.youtube.com/watch?v=v7NnSibhj7w](https://www.youtube.com/watch?v=v7NnSibhj7w)  
48. Typography Motion Graphics Animation in After Effects \- YouTube, acceso: enero 26, 2026, [https://www.youtube.com/watch?v=4vLwhXY0ZRw](https://www.youtube.com/watch?v=4vLwhXY0ZRw)  
49. DJI Osmo Pocket 3 Beginner’s Guide | Tips \+ Tricks for Better Video\!, acceso: enero 26, 2026, [https://www.youtube.com/watch?v=nenijF\_yYcM](https://www.youtube.com/watch?v=nenijF_yYcM)

[image1]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAYCAYAAAD3Va0xAAAA3UlEQVR4XmNgGAWkgnlA/BmI/0PxAhRZCPjLgJAHYWdUaVSArBAb2AfEKuiC6IARiLcD8XoGiEFBqNJggMsCFJAPxCZQNi5X/UEXwAbeIrE/MEAM4kMSUwPiTiQ+ToDsAlA4gPg3kcSWATEPEh8rAIXPZjQxdO9h8yoGQA4fZDGQ5m4o/xeSHE7wDl0ACmCu0gbiFjQ5rACXs3czQOTuATEnmhwGYAHiveiCUMDEgBlWWAEzEL8B4pPoEkjgGxB/RxdEBquA+CMDJP2A0g0oL2ED+kCcjS44CkYBEAAABi803bhnVOIAAAAASUVORK5CYII=>

[image2]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC0AAAAYCAYAAABurXSEAAACHElEQVR4Xu2Vz0sVURTHTxphgZC5EEIXLWwTRLSQaOGPFiGCBEIrF4+oQFpJkVqL/oAgUhCNNuHKRQtBJMq9QbRwJaIhoouwWkhQgUQ/zvfNve+d95258+YVOC78wJe553vO3LnD/SVySL5cZWOfucBGNYZUY2zmwB82QrSpPrKZE2dUu2wmgb9rYDNHvqv62bRcVu2xmTPtUmWZ/JSDsZYZDPoEmx4kj7Np6FM9V5108XXVjKq+VJGN86pZVRP5R6XctwXjeswmaJT0acDaalYdk6juteqKqsvFWcE7TyT5PcQb5IFFCSzbHol34plTnTMx6j6b9i+Tq4b/xgvT9iC+Qx54JvHaIjckkFAeUoy6W65d69Lodk/0sWb8i847YjzPqATGVpBAguiQbHVpYFOhDzt7C85L4r4EcpckkCDeSLa6NCYk3gfi0EUyLfH6ItjJiQmJ1u+Wa6Pmk8mdlvgx+YhiZlXi30J8lzwPNv0PNj14EacDA39Kygf9JuUs2LTwXpFvmZTK9965uM54FuTG2fQgeY9N5a1EuSUXYxoRb5cqypxSfZH4zzArEtVAy+4ZAjk+00uMqL6x+Y98ZcOAk8KCQb0kz9Mq6T9UBAW4mf6Hs6pBNh3vpXIQTylmMKsDbDK9qg9s1shvNgzrqgeufVOiAYfO+hbVDpshcM/fZrMGki4Iy7BqXnWNE0TaDCRSYGOf6WTjkDz4C/CWeehn/J6ZAAAAAElFTkSuQmCC>

[image3]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAAYCAYAAABKtPtEAAACvUlEQVR4Xu2XS6jNURTGF3mXIi7KoyspA+KWgQx0TTAgj4zd5FkGFNdraqAolESGyGtAkZKBoYFSKCkm8o6ivPJmfWevfc8633/ve8513ME5nV99nb2+tfc+e6+z/48j0qJFikVsNDBz2KjGZtVuNhucP2zkmKx6yWYTMFX1ns0UqNQwNpuEz6plbHrmq76x2URMlyqXwg9pvmufQQFGsBlBcjibBk7HYfKWqlaQ16E6q5piMcadU43q6VEbA1SHVJ3kX6B4rHkzyAftbEjY4wE2wUjJH4+bEjZyS/XV+ejvxzxSzXK5U6ptEhaSmzvFENUba2PcYGuftrjT4gmqG6qB5nueJzyA/snLfKGkB2ByFAAg7wuwzzywVbXJ5XxxuFDVeGyfuHNj3FCX8wX4ZZ9d5nsQXyQPnJBi3xJrJZ1oVw2yNvIry6kScbE7KtzQ9wx5tbLXPu9KcU0PXRsbB99Vv50fT8Rs50V2SXHOEqkqevZLMT9TtZg8gIKh7zRO9BHMcT7hMfC2uBg/Rqof6JZMbp5kEgZynL9HcWSPFPv2lYkS5uCb5xGKcSL5uz4kvMhxyeRGSyZhIHeZvPuu/UDK43GT4bmuU7xO1UaeZ40U57hEMUhtCPEV8iJYxxc2IxiIO3AKbOqFi5+5NsDYOxIeo2j7a/KjawNcm+jDC/fgl0c+PrNxQ8TjlVktlfPEguT+ACHHp6gHJLezaeDG8k5Cn58SHpueY5Z7YjEeiYjx+pl6t7itessmgbXEQh2lnAe/auyHU9pbYZHDaU+yU/WJzX4EhayXuRRjg0/Ji0yS3otTAh3iY6+/iY/Qf+WghPWOs3i5xXiLTIF/g6vYZJZI/QurhVeSX2itnFRdtfYCCZsfU05XMF71ms0ceFfewOZ/Jv5XqJf1qmuqjZwgqh59pouNBgano0WLDH8Bb3Opwmw1+joAAAAASUVORK5CYII=>

[image4]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFwAAAAYCAYAAAB3JpoiAAACPUlEQVR4Xu2WP0hVcRTHj1GYmdqQGG3SEg0KIiIkGJISVEIQVGvl4OAiKA6iEAoiLrWISFo4FOEs0dDqpFHQEIENNTs4VqTn6+8cPe/n9XXve3STOh/48s6/yz3vvN+fR+Q4juM4juP8XU6whuKg8+c4SUdw4I9ZfcafYo0aP2+OsZ6xbpvYLOuh8dNymkof+FnWU1atiZ2j0IulmvWK1SU+3rnE6tmrEBpYH8QeYH1nbYu/xpoRO086WMtiv2B9Y22Kj88bYqelhkob+DXWAoWh6UwAbOsPssbF/sx6y3rHqqBQd0Zyu9gH8avAb2a1i33X5JOYp/BLJuk5hVWKprFKUHt996ni/DQ2hos+jrNGxD5v8mkodeA6G3wPOye8X/1TrC8mhwWqudfG3qPF2MNUWICzL2+w4+qNv0KFPeECLEZrgjpZTxLiUDGuyCfe/97ENQbaCqJEW5Qw5MPIVJwT6OdrHCxCb4LuUNhpcRz6HXUUergYxVcjX0EtdncqMhULj1jTGXQzPJYa9PQgDmak1CMF4BiMF+EtCpdpDHYfai/ECQWHuRbo+X3J5D8aOy8uU+gDF0632JYfkZ+Gcga+QQd7sD7+aKg/GeVAgT8ngSrWutiNksPF+VLsPPlE+03qEYfhg/usfrGzUM7AsSvt0DDUJuMjp5c8bFu7SNE9oX9bIKwmrHT1x0xdnuiu0x8f56z690xdFsoZOHhD+z1cjXIYPuK/WJWsCfGh+EL9byh34I7jOI7jOP8wOzNHiJhxb4XvAAAAAElFTkSuQmCC>

[image5]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAYCAYAAADDLGwtAAAAm0lEQVR4XmNgGNRAAohl0AWRwUIg/g/FRWhyGECTAaKQBV0CHaxkgCgkCECKvqILwkAPEDdB2SCFNUhyYFAJxL+gbFUGhEfY4SqAIBUqyIEkdgkqhgJAAs+xiH1HFvCACqYjC0LFGpAFlkEFkYEKVAzZKQxToILIYAmS2FKYIDeSIAgEQ/kwMRRDnKECIJwNFfsH5QvBFI0CnAAAenEoOjLVGH8AAAAASUVORK5CYII=>

[image6]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGYAAAAYCAYAAAAI94jTAAADoklEQVR4Xu2YWaiNURTHlymz5ME83AyZI3nxoJQhKSlDnrhJlwcPpJTp4RgikRRlSFxjeSIyhIdLyQMeTC8yPChC8kJkXn977XvWWXd/3znfOfdcD3f/avV9+7++vdfZ357Wd4gikUikVdCXbaAVWwE92CZZsYoMZWtnxRAn2P6IrTW+avOO8rFhX9muKP9F4/+kfJXSm+0zuXa/GV81eEL5fnQ0vkRGk6vQ3jpagLnkYm+3DgX81QJtb7NilThJGftyjjJWKMI4K6Rwl9Jn0Ui2C1ZsJoaRi93ZOqoEYn23Yhqo8MWKZVBLrq3l1pGCX95JnKJsA50FtJ0Wu7lBrJ1WtOxh2yr3qLBZ+bKSI9fGHKOXAuphr08i6cXNJ9cHT3+23WzLlIateQvbQbYuSvegbZwvPdnOs80qdNMutkVy35btKNvMvLuAyWxH5Bqihly8rkZvZAPll9MIys/YpK0kDfzQX2wTraNEZpCLvd46FKGBGUvuTNpLzo8kISe+q+SSCLzQm6LNpnA7vu8rpPya7Y7cn2XrI/6nbK9Ef8G2RO49GFwkUeAAufg2Xn1Aa6SOnLOT0h6JloXL5La+StPr2+RiJyUdNeTOP4vfduvJ1dez2CcTGCANND2bh4g2VWlLRQO/5eoHD2ySe91vrPYfqgyS4ieeL3C+DWgY4WK0YbtPrn534ysX3ekQx8lljJaNcg11NpT54DsFGvrgwWq3z2Hb89o0uaKssza9Jc4j50eCooE2JaAFsz+/nFcaHVrOaCEwq7GMkY+X9IFUAoid9g1hX5wF/h0BzU60W6JrULYz/aPongFS1juMBj7bbm1AGyxaMPvDnmkrDBctKXAIzLp7bG/YuhlfVhD7kBUF/KbHVlT0I1ff/gZomPlWuxTQ9gU0PViHRUsiNDAvA9qxgNYIDiXrPK20M9pRIvi+wB6LjKgcEBs/OgTOEb31WDCgtj/+u0RPtEGi+e33gVyhLZZ7MEY0PdAoF1vRNwJag7r3Vz/g9jf/S9O0uEDKunK57Gf7yTbeOorQQE3jIi39QMUTi9BLC50v+AzwGl6i34YfkkuRPXgmtNJyRtNcp8J4z6S8mlxysUZ0aNfYOsi1CdMpPxirREP2gXIv/1AFrCPXVlKuH6KeXB2fYr4v8CaDZxca7Tm5bdaC2YrnRxndv0ik/BOMD8BX7DxFPDyHFY4zBN9XKON/QA8SAWhp32stQpaBiUQikUgkEolE/jN/AWrPB9MWIAQdAAAAAElFTkSuQmCC>