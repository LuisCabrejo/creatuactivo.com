# Guía de Identidad Visual — Generación con IA (Gemini / Veo)

Cómo generar imágenes y b-rolls con IA que reconozcan **nuestra identidad** y se
sientan de la misma marca, pieza tras pieza. Destilada de los ejercicios de producción
(jun 2026) — el camino que sí funcionó. No es teoría: son los parámetros y prompts
probados.

> **Objetivo de fondo:** evolucionar de "video que se observa" a **experiencia 3D donde
> la cámara ES el usuario** atravesando el espacio. El orbe dorado = el protagonista =
> el espectador.

---

## 1. El ADN visual (la constante)

El **orbe dorado** es el ancla de identidad: es el usuario, su luz. Todo lo demás es el
sistema/el mundo, en blanco frío sobre negro. Pega este bloque al inicio de **toda**
generación:

```
You are generating visuals for a single, consistent brand identity. Apply these
parameters to EVERY image and video unless told otherwise.

— CANVAS: pure matte-black background (#0F1115), deep negative space, subtle vignette.
  Vertical 9:16 unless specified.
— LINEWORK: all structures (rings, shapes, platforms, paths) drawn as thin, precise,
  clean WHITE/silver outline strokes — minimalist, geometric, high precision. Cool,
  restrained, never busy.
— THE HERO: a SINGLE small glowing GOLDEN orb — warm champagne-gold (#C5A059 to
  #D4AF37) with a soft golden bloom. It is the ONLY warm light in the frame and the
  ONLY gold element; it represents the protagonist/viewer. Everything else stays cool
  white-on-black.
— MOOD: quiet luxury, hypnotic, cinematic, calm and premium — like a high-end
  investment firm, never flashy or playful. High contrast, faint volumetric haze,
  subtle lens bloom.
— CAMERA: prefer immersive 3D motion where the camera moves WITH the hero through the
  space (slow dolly / forward travel), so the viewer feels inside the experience.
```

**Imagen ancla maestra:** [`public/contexto/capturas/identidad/1.png`](../capturas/identidad/1.png)
— primera pieza con el orbe dorado y la piel definitiva. Es la referencia que se adjunta
para mantener identidad en las demás gráficas.

---

## 2. Flujo de trabajo (el orden importa)

1. **Texto primero, sin imagen.** Para *crear/acuñar* identidad NO se adjunta referencia
   — el style-transfer de una captura ajena (ej. Dan Koe) clona su identidad (orbe
   blanco, sus formas) en vez de la nuestra. Se establece por texto.
   - Turno 1: el bloque de ADN (§1). El modelo confirma parámetros.
   - Turno 2: la escena específica (también texto). Generar 3–4, elegir la mejor.
2. **Esa imagen elegida se vuelve el ancla.** Tu orbe dorado, tu piel.
3. **De ahí en adelante, sí se adjunta referencia** — pero con rol definido:
   `[imagen ancla] + "úsala como referencia de estilo e identidad, conserva paleta y
   orbe dorado, cambia solo X" + [nuevo escenario]`.
   - **La referencia mantiene una identidad que ya existe; no la crea.**

---

## 3. Dónde se hace cada cosa

| Paso | Herramienta |
|------|-------------|
| Imagen ancla + keyframes | **Gemini app → creación de imágenes** (Nano Banana / modelo de imagen) |
| Animar el keyframe (movimiento, dolly-in) | **Gemini app → video (Veo/Omni)** o **Google Flow** (filmmaking) |
| Ensamblar el reel completo | **NO Vids** — lo monta el pipeline `scripts/dankoe-video` (CapCut + Remotion + ffmpeg). Tú solo entregas el b-roll `.mp4` |

Google Vids es un producto **aparte** de Workspace (editor de video). No es el default de
Gemini. No se necesita en este flujo.

---

## 4. Parámetros técnicos (lo que de verdad mueve la aguja)

- **Formato 9:16 → fíjalo en el SELECTOR de la interfaz, no por texto.** El aspect ratio
  cambia el encuadre y la cercanía del sujeto; por texto es poco confiable y causa
  recortes. Mencionar "9:16" en el prompt solo refuerza.
- **Nada de conteos exactos.** "El segundo anillo" / "cinco objetos" rompen el realismo
  y bailan entre intentos. Usa **zonas visuales**: "en el cuadrante superior izquierdo",
  "un grupo pequeño".
- **Framing positivo, no negativo.** Describe lo que quieres ("túnel completo, centrado,
  con margen negro"), no "sin recorte". Minimiza los "sin/no".
- **La variabilidad es normal** (texto→imagen es estocástico). El control de consistencia
  viene de la **referencia + el bloque de ADN fijo**, no de un prompt "más perfecto".
  Genera 3–4 y elige.

---

## 5. Plantilla — prompt de IMAGEN (keyframe)

```
[Bloque de ADN §1, o "Apply the locked CreaTuActivo visual identity" si ya se confirmó]

Scene: [qué se ve — estructuras de línea blanca + el orbe dorado].
Composition: vertical 9:16, [framing: completo / centrado / con margen], the orb in
[zona visual, no conteo].
[Motivo específico — ver §7].
```

---

## 6. Plantilla — prompt de VIDEO (Veo) + aprendizajes de movimiento

El prompt de video describe **movimiento y cámara**, no re-describe la escena.

**Aprendizajes probados:**

- **La velocidad engancha.** "Velocidad tortuga" aburre. La energía hipnótica de
  Dan Koe = **el mundo pasando a toda velocidad** junto al héroe, con *motion-blur /
  speed lines*. La velocidad se controla con **palabras** ("FAST", "high speed",
  "rushing", "slow drift"), no con números.
- **Profundidad 3D = el push-in.** Un **dolly-in lento** (cámara entrando hacia el
  sujeto/punto de fuga) convierte "video que se ve" en "experiencia que se vive". Es el
  recurso transversal a todas las piezas.
- **Capas de movimiento.** Para "ciclo/repetir" funcionó **doble capa**: el orbe
  *girando* en un circuito (micro) + el laberinto *rugiendo* de fondo (macro). Marca
  **jerarquía** (MAIN / BACKGROUND / CAMERA): Veo prefiere una acción dominante; sin
  jerarquía, varias motions se vuelven inestables.
- **Loop perfecto vs. b-roll.** Un *push-in* continuo **rompe** el bucle perfecto
  (termina más cerca de donde empezó). Para un b-roll del reel da igual (el editor lo
  coloca). Si quieres gráfica que loopee sola, la cámara entra **y vuelve a salir**, o
  usas la misma imagen como cuadro de inicio **y** fin.
- **Inicio + fin (clip-chaining):** dos imágenes **distintas** solo cuando el orbe
  termina en un lugar **diferente** (ej. túnel llegando al centro). Si vuelve al mismo
  punto, **una sola imagen**.
- **El secreto del 3D real: TODO se acerca junto.** El push-in falla cuando unas figuras
  se aproximan y otras se quedan atrás (profundidad inconsistente). La inmersión tipo
  *Inception* sale cuando **toda la estructura escala hacia el espectador uniformemente,
  nada se queda atrás** ("scaling up TOGETHER, nothing left behind").
- **Edificios dimensionales > línea plana.** Las figuras con **relieve/textura** (caras
  3D, bordes dorados, parecen edificaciones reales, estilo *Inception*) inmersan mucho
  más que la línea fina plana. Buscarlas en el keyframe.
- **La estela dorada (comet trail) hace visible y bello el bucle.** El orbe deja un
  rastro luminoso que dibuja el circuito completo → el "repetir" se *ve*, no se infiere.
- **Push-in más rápido > lento** para el efecto de clavado/inmersión (un dolly lento
  aplica al motivo túnel; al clavado Inception conviene velocidad).
- **Giro del fondo: "X° y se queda quieto".** Un giro que **se devuelve** mata la
  inmersión; uno que **completa el ángulo y sostiene** (ej. 45° y hold) la conserva.
  Mantenerlo como **acento** (timestamp breve), con protagonismo al push-in + bucle.

**Ejemplo validado — "ciclo perpetuo", clavado Inception** (el ganador; keyframe
[`capturas/dan-koe/37.png`](../capturas/dan-koe/37.png) — pozo 3D de edificios con punto
de fuga central + circuito con estela dorada):

```
Animate the attached image as an immersive Inception-style dive into the center.

CAMERA (protagonist): the camera pushes steadily and fairly FAST straight forward into
the central vanishing point — the ENTIRE 3D structure approaches uniformly, every
building and shape scaling up TOGETHER toward the viewer, nothing left behind.

ORB (protagonist): the golden orb keeps circling its rounded-square closed loop-track
at the center, leaving a glowing golden comet trail that traces the full loop — round
and round, getting nowhere.

BACKGROUND (accent only): in the first 2 seconds the whole structure rotates 45° around
the central axis, then HOLDS completely still for the rest of the clip — it does NOT
return and does NOT keep spinning.

Gold-tinted dimensional edges, volumetric haze between the layers, deep matte-black,
the orb the only warm light. Premium, hypnotic, cinematic.
```

---

## 7. Biblioteca de motivos (mismo ADN, distinto mensaje)

| Motivo | Qué grita | Cómo |
|--------|-----------|------|
| **Laberinto / circuito** | el ciclo: *trabajar, pagar, repetir* | orbe girando en un circuito cerrado + laberinto de obstáculos blancos rugiendo. **Sin salida visible** (es la trampa) |
| **Vórtice / anillos concéntricos** | inmersión / viaje hacia adentro | túnel de anillos hacia un punto de fuga, cámara con dolly-in, orbe acercándose al centro |
| **Portal dorado** | la solución / la salida | reservado para el beat de solución: aparece el portal y el orbe **sale** del loop (contraste contra el laberinto) |

Regla: **lo universal** (orbe dorado, trazo blanco, negro mate, lujo silencioso) es
constante; **el motivo** cambia según el mensaje del beat.

> **El grid-void ES el fondo universal — regla inviolable (b-rolls "Maqueta Técnica
> Premium").** Todos los objetos (fábrica, ciudad, puente, orbe) se apoyan sobre la
> **misma cuadrícula sobre vacío mate**; el fondo "no representa nada" a propósito — eso es
> lo que lo hace maqueta y no render de fantasía. **NUNCA** entornos literales: sin agua/río
> bajo los puentes, sin cielo, sin mar, sin texturas de suelo/ciudad. Validado en
> [`capturas/servilleta/15.png`](../capturas/servilleta/15.png) (la ciudad flota sobre el
> mismo grid que la fábrica → más premium y coherente que darle escenario propio a cada
> elemento). Ver el spec completo de la maqueta sólida en
> [HANDOFF_BROLLS_HOME.md](HANDOFF_BROLLS_HOME.md) §2.

---

## 8. Producción (al entregar)

- **Marca de agua de Gemini** (el ✦ abajo-derecha): quitarla antes de usar como ancla, o
  taparla en el master. El pipeline `scripts/dankoe-video` ya usa el truco del *logo-bug*
  (`emblema.png` + `drawbox` negro) para cubrir el ✦.
- Entregar el b-roll `.mp4` al pipeline de reels; el montaje (subtítulos, música, SFX,
  outro) lo hace `scripts/dankoe-video` — ver CLAUDE.md § Reel Post-Production Pipeline.

---

## 9. Control fino de prompts — I2V y Vertex (aprendizajes jul 2026)

Destilado de la producción de los b-rolls de la Home (B4 "el peso", la bisagra "tres fuerzas",
B6 "pantalla Gano envía"). Son las técnicas que dieron el resultado exacto.

### 9.1 Plataforma — Gemini app vs. Vertex (Veo)
- **Gemini app:** rápido; bueno para imágenes e I2V simple. **Sin negative-prompt** → tiende a
  **duplicar objetos** (nos inventó DOS orbes) y respeta mal "solo uno".
- **Vertex (Veo):** más control. **Negative-prompt SÍ para imágenes** (UI). ⚠️ **Para VIDEO el
  negativo es solo por API Python, NO en la UI** → en la UI **todo va en positivo**. Ofrece
  **primer/último cuadro** (encadenado) y semilla. Los planos difíciles (objeto único, encadenado,
  dirección exacta) → **Vertex**.

### 9.2 Positivo-only (video en Vertex UI) — la regla de oro
- **NO menciones lo que NO quieres.** Nombrar "sin texto, sin números, sin monedas, sin cajas" en
  un contexto sin negative-prompt **los invoca** (un intento metió textos y números justo por
  nombrarlos). **Describe solo lo que SÍ hay.** Sustituciones:
  - "sin partículas/destello" → *"superficies mate, luz calmada y pareja, brillo contenido"*.
  - "que no se derrumbe" → *"piezas sólidas e intactas que encajan limpio"*.
  - "un solo orbe, nunca dos" → repetir en positivo *"one / single / solitary / the only sphere /
    just one / by itself"*.
- **Trampas de negación encubierta** (parecen positivas pero no lo son):
  - *"ni más ni menos / no more, no less"* → la IA lee el "más/menos" y varía el conteo. **Afirma el
    número a secas:** *"3 pasos"*.
  - Términos **relativos** que la IA no puede anclar (*"cercano/lejano", "near to far"*) confunden →
    usa **dirección absoluta** (*"hacia adelante / hacia el horizonte"*) u omítelos.

### 9.3 Objeto único / evitar duplicados
Si el objeto (ej. el orbe) **no está en la plancha** y aparece en el video, el modelo puede
**duplicarlo**. Arreglos, de más a menos seguro:
1. **Encadenado inicio→fin** (primer + último cuadro): el FIN fija **exactamente un** objeto →
   duplicado imposible. La bala de plata.
2. **Repetición positiva** de la singularidad (§9.2).
3. **Componer el objeto en el pipeline** (Remotion/ffmpeg) → cero riesgo.

### 9.4 Cámara revela > objeto que se transforma
- **Los movimientos de cámara son seguros; las transformaciones/morph de objetos son caóticas** en
  I2V (bordes hirviendo) y **se ven mágicas** (viola la [credibilidad lógica](INVESTIGACION_CREDIBILIDAD_LOGICA_BROLL.md)).
  Cuando quieras "que la escena cambie", **revela con cámara** (retroceso, giro, acercamiento) — la
  escena "ya estaba ahí", no nace de la nada.
- **Test de claridad:** si no puedes describir **plano-a-plano** lo que verá el usuario, está
  sobrecargado. Un corte cuenta **1 idea, no 5**.
- **Movimientos de cámara complejos → valida primero con una IMAGEN estática.** "Inmersión por un
  costado del cubo" Veo lo interpretó mal (bajaba desde arriba, partía/volaba el cubo). Antes de
  gastar intentos de video, genera el **cuadro estático** del resultado deseado para confirmar que
  la composición/instrucción da lo que quieres; luego animas.

### 9.5 Dirección de movimiento
El modelo **default es ambiguo** en el sentido de un flujo (metió los camiones **entrando** en vez
de saliendo). Se fija **repitiendo el vector en positivo**: *"OUT / FORWARD / AWAY / outward /
leaving it behind"*. La insistencia fija la dirección sin negativo.

### 9.6 Calidad — no edites frames de video
**Editar un FRAME de video** (agregar/quitar algo) **degrada la calidad** (queda muddy, líneas
blandas — caso `29.png`). Toda edición parte de un **render limpio**, no de un cuadro extraído de un
clip.

### 9.7 Video dentro de pantalla / estilo interno
- Si un clip corre "dentro de una pantalla", declara explícito **"in the SAME clinical quiet-luxury
  style as everything else"** — si no, el clip interno adopta otra estética.
- Mantén el contenido en **una sola cosa legible** (fábrica + camiones), sin loops recargados, y
  **sin grid adentro** si el grid es del mundo exterior.

### 9.8 Bugs literales → quita la sub-acción que confunde
El modelo sacó **cajas por la chimenea** al pedir "produce cajas". Solución: **quitar la sub-acción
confusa** y describir solo el resultado que importa (los camiones que salen). Menos verbos literales
= menos accidentes.

### 9.9 Duración según beats
Coreografías de **5 impactos** (B4) o encaje + orbe (bisagra) piden **10s**; **8s** las atropella.
Empareja duración con nº de beats.

### 9.10 Comportamiento emergente deseado → pídelo explícito
Lo bueno que salió "de suerte" se fija: el **orbe empujado por cada impacto** (= peso) salió
emergente en B4; ahora se pide de frente para reproducirlo.

### 9.11 Estabilidad de la cuadrícula (malla) — recipe CONFIRMADO
La cuadrícula en perspectiva es de lo más difícil para difusión (sin restricciones geométricas →
líneas onduladas, mosaicos desalineados; [ref](https://arxiv.org/pdf/2512.07504)). **Recipe que la
mantuvo perfecta:**
- **Anclar con imagen de referencia de malla limpia** (`orbe-solo.png`/`base-3.png`): *"keep the
  same clean, undistorted grid floor"*. Palanca #1.
- **Piso mate y simple:** *"flat matte grid floor, thin straight evenly-spaced lines, single-point
  perspective"*. **Quitar** reflectante/metálico/mojado y **niebla en el piso** (invitan a redibujar
  y torcer la malla).
- **Atmósfera arriba, nunca en el suelo.** En video, cámara mínima (*"grid stays undistorted"*) —
  mover mucho la cámara la reactiva.
- Plan B: **malla determinística en el pipeline** (Remotion/CSS, perfecta) + IA solo los elementos → componer.

### 9.12 Conteo y colocación de marcadores discretos
Los modelos **no cuentan bien**. Para "N puntos + un final":
- **Describe por PARTES, no el total:** *"two intermediate points, and the last one IS the pin"* —
  decir "3 puntos y un pin" hace que dibuje **3+1 = 4**.
- **Barreras estrictas:** *"the pin is the absolute end; no lines or points beyond it"* → evita que
  siga dibujando al infinito.
- Aun así en **video** el conteo es frágil → **fija los marcadores en la PLANCHA (imagen)** y en el
  video describe **solo el movimiento** (no re-describir los puntos, o los redibuja mal).

### 9.13 La imagen de referencia debe COINCIDIR con la escena (raíz de un fracaso)
En I2V la imagen adjunta **es el primer cuadro** → el video arranca de ella. Usar una plancha de
**otra escena** rompe todo: `BASE.png` (orbe SOBRE el cubo = escena **externa**) NO sirve para un
clip **interno** (orbe en el camino) — el modelo tiene que inventar el camino/los puntos y falla
("salta al piso", puntos mal). **El primer cuadro = exactamente la escena que quieres animar.**
Escenas distintas (externa↔interna) se unen con **corte de montaje** — **salvo** que la inmersión
la ejecute la **cámara** y el endpoint se encadene (ver §9.14, que resolvió el caso "entrar al cubo").

### 9.14 Inmersión externa→interna en UN clip (recipe CONFIRMADO — B8 "método")

El caso que parecía imposible (cubo externo → camino interno en una sola toma I2V) **sí sale**. Lo que
mató los intentos previos no era la inmersión: era **atar el orbe interno al externo** (Veo lo "bajaba"
al piso con un saltito) y **dejar el recorrido libre** (a veces dibujaba 4 puntos). Receta que funcionó:

1. **La inmersión la hace la CÁMARA, nunca el orbe.** *"a smooth push-in that immerses INTO one side
   face of the cube, entering at an angle as if passing through a screen"* → la cara del cubo llena el
   cuadro (el orbe externo, arriba, sale de plano) y abre a la escena interna. Ese movimiento de cámara
   es estable.
2. **No nombrar el orbe externo.** Adentro se presenta *"a single gold orb"* como elemento **nativo**,
   ya **posado en el camino** y que **se desliza hacia adelante** (*"resting on the path… glides smoothly
   FORWARD"*). **Cero verbos verticales** sobre el orbe → adiós al "orbe que cae/salta".
3. **Encadenado primer→último cuadro = la bala de plata para el recorrido.** Primer cuadro = plancha
   externa (`BASE.png`, orbe sobre el cubo); último cuadro = plancha del **destino interno**
   (`capturas/reel-home/metodo-punto-3.png`: un orbe en el pin, en su charco de luz). El fin bloqueado
   fija el conteo y obliga el aterrizaje (§9.3 + §9.12) → el orbe *tiene* que terminar en el pin, uno solo.
4. Puntos **por partes** (2 intermedios + el pin es el destino, jamás "3 + pin"; §9.12), **malla estable**
   (§9.11) y **10s** (inmersión + 2 waypoints + llegada = 4 beats; §9.9).

**Prompt final (Vertex UI, positivo-only), archivado:**

```
Animate from the first frame to the last frame. A single gold orb is the ONLY gold element in the
clip — just one orb.

CAMERA: a smooth push-in that immerses INTO one side face of the cube, entering at an angle as if
passing through a screen — the pale surface fills the frame and opens into a full clean interior
scene (same clinical quiet-luxury style, dark clean background, flat straight undistorted grid floor).

MOTION: once inside, a single gold orb glides smoothly FORWARD along a clear glowing path across the
grid. As it travels, two intermediate waypoints light up one by one in sequence along the route
ahead. The orb keeps moving forward with calm certainty and arrives at the final destination — a
minimalist white location pin — settling directly beneath it, resting on the grid inside a soft
round pool of light, exactly matching the last frame.

Everything is cool white and gray with the path and markers glowing; the only gold is the single
orb. Restrained glow, premium, hypnotic, calm — a sense of clear, guided certainty. Slow and elegant.
```

> **Regla general que deja esto:** cuando quieras que "la escena cambie de mundo" (externo→interno,
> fuera→dentro de una pantalla), **haz que la cámara atraviese una superficie** (cara/pantalla/portal),
> trata el nuevo mundo como escena **nativa** (no continúes objetos del mundo anterior) y **encadena el
> último cuadro** para fijar el desenlace. Es más fiable que un corte de montaje y no requiere morphing.

### 9.15 "El usuario recibe" sin flujo direccional ni fuegos — el destello PAREADO (B9 "multiplicación")

Beat B9 = *"cada vez que el consumo se repite… usted recibe una parte, una y otra vez… crece sin techo"*.
Lo que **no** funcionó y por qué:
- **Pulsos que "viajan y entran al orbe"** → la IA no dibuja bien el flujo direccional (los pulsos
  terminaban subiendo al cielo, sin entrar).
- **Haces de luz desde cada edificio** → se ven como **fuegos artificiales / bloom reventado** = *tell*
  de fantasía prohibido ([credibilidad lógica](INVESTIGACION_CREDIBILIDAD_LOGICA_BROLL.md)) y rompe el
  Lujo Silencioso.
- **Skyline generado de cero** → sale amontonado / "mar de bloques", no lee metrópoli.

Lo que **sí** funcionó (mecanismo ganador):
1. **Destello PAREADO en sincronía**, no flujo. *"somewhere in the city a single building lights up with
   a soft contained glow, and AT THE SAME INSTANT the gold orb gives a brief matching warm glint — the
   building and the orb light up TOGETHER, in perfect sync"* — repetido **~20 veces en 10s**, cada vez un
   edificio distinto (izq/der/cerca/lejos). El "recibe una parte, una y otra vez" se lee por la
   **simultaneidad** (causa→efecto), no por una partícula que se desplaza. Cero verbos de trayectoria.
2. **Crecimiento** = *"more and more buildings join in and stay softly lit… the city filling with quiet
   light toward the horizon"* (se quedan encendidos, el campo se llena) = "crece sin techo".
3. **Ciudad ordenada** = anclar la plancha en `capturas/servilleta/15.png` (metrópoli con torre insignia
   + fábrica al frente), no generar skyline nuevo.
4. **Orbe centrado y elevado SOBRE la ciudad**, glow **contenido** (no sol con flares).

**Prompt final (I2V desde `capturas/reel-home/multiplicacion/ciudad-cool.png`, positivo-only):**

```
Animate the attached image. Keep the whole scene — city, bridge, factory, grid and the single
elevated gold orb — in place. The gold orb is the ONLY gold element, hovering above the city.

CAMERA: the clip opens exactly on the attached image (frame 0), then a slow, continuous push-in
traveling forward toward the city and the orb.

MAIN MECHANIC (the heart of the clip — repeat MANY times, about twenty over the ten seconds):
Again and again, somewhere in the city a single building lights up with a soft contained glow, and
AT THE SAME INSTANT the gold orb gives a brief matching warm glint — the building and the orb light
up TOGETHER, in perfect sync, as one coordinated beat. Each time it is a DIFFERENT building
somewhere across the city (left, right, near, far), always paired with the same simultaneous glint
on the orb. A steady rhythmic pulse of paired flashes, over and over, all across the city — every
lit building answered instantly by the orb.

As it goes, more and more buildings join in and stay softly lit, the city filling with quiet light
toward the horizon — a calm sense of steady growth. The gold orb stays elevated and still, only
briefly glinting each time a building lights. Matte surfaces, crisp edges, restrained glow, deep
dark background, premium, calm and rhythmic.
```

> **Regla general que deja esto:** para "A le llega algo de B" sin trayectorias (que la IA dibuja mal) ni
> fuegos, usa **sincronía**: B se enciende y A responde con un glint **en el mismo instante**. La
> simultaneidad comunica la relación causa→efecto de forma más limpia y premium que una partícula viajera.

---

*Documento vivo. Actualizar con cada motivo/aprendizaje nuevo. Capturas de referencia:*
*[`public/contexto/capturas/`](../capturas/) (dan-koe/, identidad/, reel-home/, trabajar-pagar-cuentas-repetir/).*
