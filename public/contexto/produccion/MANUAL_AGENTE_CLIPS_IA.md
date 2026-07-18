# MANUAL DEL AGENTE — Clips 3D con IA (Veo/Vertex) para Reels CreaTuActivo

> **Para quién es esto:** un agente (humano o IA) **sin contexto previo** que va a generar
> videoclips 3D para los reels de CreaTuActivo. Este manual contiene TODO lo aprendido en
> semanas de producción real (reel de la Home, clips de servilleta, reels de nicho):
> los métodos que funcionan, los errores que cometimos y cómo se corrigieron, y prompts
> reales aprobados como ejemplo. **Léelo completo antes de generar el primer clip.**
>
> Documentos hermanos (complementan, no reemplazan):
> - `GUIA_IDENTIDAD_VISUAL_IA.md` — identidad visual (orbe dorado héroe, estilo maqueta) + §9 lecciones de prompting.
> - `INVESTIGACION_CREDIBILIDAD_LOGICA_BROLL.md` — por qué la fantasía genera fricción (doctrina anti-fantasía).
> - `HANDOFF_BROLLS_HOME.md` — historia y estado de cada b-roll (§8 = inventario vigente de archivos).
> - `../../../scripts/dankoe-video/PIPELINE.md` — el pipeline de post-producción (subtítulos, música, mezcla).

---

## 1. El estilo de la casa: "Maqueta Técnica Premium"

Todos los clips comparten un mundo visual:

- **Escenario**: piso oscuro de baldosas grandes con líneas de unión gris claro ("grid"), fondo carbón profundo, iluminación de estudio calmada. Todo **mate** — nada brilla por sí solo.
- **El héroe**: UN orbe dorado — "brushed matte gold, satin metal" — que representa al usuario/dueño. Es **el único elemento dorado** de cada escena. Recibe la luz del estudio; **jamás la emite**.
- **Los objetos**: maquetas 3D limpias (fábricas, cubos, camiones, engranajes) en carbón/titanio/gris, o concreto pálido cuando se necesita peso.
- **La regla madre**: la gráfica debe **explicar el concepto sin texto ni audio**. Si necesita rótulo para entenderse, está mal diseñada.
- **Anti-fantasía (inviolable)**: prohibido lluvia de dinero, partículas mágicas, bloom/estallidos, rayos de luz, símbolos ∞, pirámides. La abstracción es libre; **la lógica física es sagrada**. La confianza nace de la fluencia (Reber & Schwarz): lo que se procesa como plausible se cree; la fantasía enciende al "fiscal interno" del espectador.
- **Tensión contenida, nunca catástrofe**: las cosas *tambalean*, se *frenan*, quedan *a punto de* — no colapsan ni explotan. La amenaza sugerida es más potente (y más creíble) que la consumada.

---

## 2. Las plataformas y sus reglas (crítico)

| | Gemini app (plan Pro) | Vertex / Veo |
|---|---|---|
| Duración | 10s | 8s típico |
| Audio generado | Sí, por defecto | Sí (a veces lo ignora) |
| Negative prompt (IMAGEN) | No | **Sí** (en la UI) |
| Negative prompt (VIDEO) | No | **NO en la UI** (solo por API Python) |
| Primer + último cuadro (encadenado) | No | **Sí** — el arma principal |
| Marca de agua | ✦ horneada en el cuadro | Sin marca |
| Calidad | Buena, rápida | **Premium, cinematográfica** |

**Consecuencias prácticas:**
1. **Los prompts de VIDEO son 100% positivos** (ver §4.1). Los de IMAGEN en Vertex sí llevan bloque Negative.
2. **Nunca uses una imagen con la marca ✦ como keyframe** — la marca viaja al video. Regenera en Vertex o pide al Director la versión limpia.
3. Gemini **duplica objetos** con facilidad (nos generó DOS orbes más de una vez) porque no hay negativo que lo frene. Para planos difíciles → Vertex.
4. Si un resultado de Gemini es perfecto en mensaje pero trae marca, se puede tapar con el logo-bug en post (ver PIPELINE.md) — pero para keyframes NO sirve.

---

## 3. El flujo de trabajo canónico

**Imagen primero. Siempre.** Nunca gastes un render de video sobre una escena no aprobada.

```
1. IMAGEN BASE (primer cuadro)  → generar → auditar → corregir → aprobar
2. IMAGEN FINAL (último cuadro) → SOLO si el clip necesita encadenado (ver §4.2)
3. VIDEO                        → un prompt, un intento, auditar resultado
4. Si falla → identificar LA fuga concreta → corregir SOLO eso → reintentar
```

Reglas del ciclo:
- **Una corrección por iteración.** Si cambias tres cosas a la vez no sabrás cuál funcionó.
- **Audita con capturas**: pide el frame problemático, compáralo con la referencia. Nombra el defecto con precisión ("el orbe salió tamaño camión") antes de tocar el prompt.
- **El prompt es autocontenido**: el modelo de generación NO tiene contexto del chat. Nada de "como el clip anterior" o "el estilo de siempre" — todo se describe.
- Las capturas de trabajo viven en `public/contexto/capturas/<proyecto>/`.

---

## 4. Las reglas de prompting (con los descubrimientos que las produjeron)

### 4.1 POSITIVO-ONLY en video: nombrar lo que no quieres LO INVOCA

El error más caro de toda la producción. En prompts de video (sin negative disponible),
mencionar el elemento prohibido lo pone en la escena:

| ❌ Escrito así… | …produjo | ✅ Se corrigió así |
|---|---|---|
| "sin texto ni números" | texto y números | describir solo lo que SÍ hay |
| "the structure does not resolve/dissolve" | la estructura se disolvió | "the weight staying piled in place" |
| "no rebound, no collapse" | rebotes | "settles instantly, solid and final" |
| "no glow" | glow | "matte surfaces, lit by the room's lighting" |

**Método de traducción**: toma cada prohibición y pregúntate *"¿qué SÍ está pasando en su lugar?"* — escribe eso. El estado final deseado se declara en positivo: *"still standing and still swaying as the shot ends"*.

### 4.2 TIMESTAMPS: SÍ funcionan, y son la herramienta #1 de control temporal

**Esto no es opinión — está validado en producción repetidamente.** Veo respeta rangos y marcas de tiempo como beats narrativos:

```
[00:01] The first block slams down...
[00:02.5] The second block...
[00:06.5–00:07] LAST comes the biggest one...
```

- **Caso real**: en el clip de bloques cayendo, sin timestamps TODO caía en los primeros 3 segundos. Con timestamps explícitos (1 · 2.5 · 4 · 5.5 · 6.5s) las caídas se repartieron en los 7 segundos pedidos. Mismo patrón validado en el cierre (encendido en beat exacto) y en múltiples clips.
- **Lo que NO funciona**: precisión sub-segundo tipo "at exactly 5.3 seconds". Usa **rangos y marcas de beat**, no cronometraje fino.
- **Regla**: un beat por timestamp, y en cada beat describe **el evento completo** (qué cae, cómo suena, qué hace la cámara). Refuerza la distribución con lenguaje global: *"spread evenly across the FULL clip, from the very beginning to the very end"*.
- Si algo debe repetirse N veces: da el **conteo** ("six to eight times across the clip, roughly one per second").

### 4.3 ENCADENADO (primer cuadro → último cuadro): el arma principal de Vertex

Se adjuntan DOS imágenes: la inicial y la final. El prompt empieza:

```
Animate from the first frame to the last frame. ...
```

**Cuándo usarlo** (validado):
- **Conteo de objetos**: el cuadro final fija cuántos hay (mató el bug "a veces salen 4 puntos en vez de 3" y el de los orbes duplicados).
- **Estado final exacto**: la ciudad termina encendida así, la pila termina apilada así, el cubo termina limpio así.
- **Recorridos**: A viaja hasta B (el fin bloqueado obliga a llegar).
- **Cambio de mundo en un solo clip**: la cámara "atraviesa una superficie" y el interior es escena nativa (ver GUIA §9.14).
- **Movimiento de cámara horneado**: si el cuadro final se genera desde OTRA posición de cámara (más baja, más cerca), Veo interpola el viaje de cámara solo. Úsalo: genera la imagen final ya con el ángulo del cierre.

**Cuándo NO hace falta**: si la geometría no cambia y solo hay movimiento (una máquina que gira y se detiene), basta una imagen + I2V con timestamps.

**Gotcha del encadenado**: si primer y último cuadro difieren en un objeto que "aparece", di explícitamente cuándo y cómo aparece, o Veo lo materializa de forma rara.

### 4.4 CÁMARA: lo estático y lo que se mueve

- **Para que un objeto NO rote/derive** (Veo anima todo por defecto): declara el sujeto "FIXED AND ANCHORED to the floor, rock-steady and motionless" y dale a la cámara un movimiento explícito (dolly-in lento). Cámara con trabajo = objeto en paz.
- **Para que la cámara SÍ se mueva** (error real: pedimos dolly y salió toma estática): la frase "anchored... its only movement is..." se lee como permiso de quietud. Lo que funciona:
  1. Declararla **"the defining movement of this clip"**.
  2. Timestamps con **anclas de encuadre medibles**: *"[00:00] the factory occupies about one quarter of the frame height… [00:08] the factory fills the lower HALF of the frame"*.
  3. El test explícito: *"The framing of the last second is clearly different from the first second: much closer."*
- **Nombra el destino geométrico** de la cámara: "toward the factory's SAWTOOTH ROOF, over the FRONT — the side that faces the bridge". Con destino vago ("hacia la fábrica"), Veo rodeó por la parte trasera.
- **Vibración de cámara como recurso narrativo**: un "short, subtle camera shudder" por impacto vende peso; un tremor continuo al final ("the CAMERA shakes with a fine, rapid, continuous tremor… only the camera vibrates") comunica inestabilidad sin romper el objeto. Siempre acotado ("short", "subtle", "fine") o degenera en terremoto.

### 4.5 DIRECCIÓN DE MOVIMIENTO: repetir el vector, simplificar los flujos

- El default de Veo es ambiguo: pedimos camiones saliendo y los puso entrando. **Fix**: repetir el vector 3-5 veces en formas distintas: *"drive AWAY from the factory · toward the distant city · leaving the factory behind · from the factory to the city"*.
- **Dos direcciones en la misma vía = sub-acción que colapsa.** Pedimos dos carriles (unos llegan, otros salen) y TODOS terminaron moviéndose hacia el mismo lado. Si el mensaje sobrevive con una sola dirección, **simplifica a una**. (Lección general: elimina la sub-acción confusa en vez de insistirle.)
- **El movimiento debe ser medible** a escala pequeña: "driving" no basta para camiones diminutos — *"each truck clearly advancing many truck-lengths from the first second to the last, traffic flowing like a steady conveyor"*.

### 4.6 OBJETO ÚNICO: la duplicación es el bug #1

Veo duplica el objeto héroe (nos pasó con el orbe VARIAS veces, incluida una donde dos
orbes gemelos orbitaban entre sí y arruinaron el clip):

1. **Primera defensa**: repetición positiva — "ONE single gold orb — just one — …" y reforzar en el IMPORTANT ("the only gold element in the scene").
2. **Segunda defensa**: encadenar el final (el último cuadro tiene UN orbe → el conteo queda bloqueado).
3. **Tercera defensa**: si el objeto no está en la imagen base y debe entrar en el video, es candidato a duplicarse — mejor inclúyelo en la base desde el principio, o replantea.
4. **Si ya salió duplicado**: NO intentes arreglarlo en post si los duplicados se tocan/mueven (recolorear uno de dos gemelos en movimiento = parpadeo garantizado). Regenera.

### 4.7 ESCALA: anclar a lo pequeño, nunca a aperturas

- Error real: "small enough to pass through the door" produjo un orbe **tamaño camión** — las puertas de una bahía industrial son enormes; el modelo tomó la libertad que le dimos.
- **Fix validado**: anclar al elemento MÁS PEQUEÑO de la escena + comparación relativa con lo grande: *"exactly the same height as one of the worker figures beside it, a tiny element in the wide shot, dwarfed by the factory and by the trucks"*.
- Si nada pequeño existe en escena, el patrón es introducir el objeto por una referencia arquitectónica humana (una puerta de PERSONA) o encadenar un final donde la escala ya es correcta.

### 4.8 PESO Y MATERIA: el material + sus consecuencias físicas

- Error real: bloques que debían sentirse pesados parecían "porcelana rígida". El nombre del material ayuda (**concreto**, no clay genérico) pero lo que vende el peso son las **consecuencias**: *"drops FAST, straight down like dead weight · a low puff of concrete dust kicks out on impact · a short subtle camera shudder · settles instantly, immovable"*.
- El polvo se acota o inunda la escena: *"the dust is sparse, heavy and gray, settling quickly near the floor"*.
- Aterrizajes: "settles instantly" mata los rebotes de videojuego.

### 4.9 LUZ Y ORO: el orbe nunca es incandescente

- Error real (dos veces): el orbe salió como un **sol amarillo emitiendo luz** sobre el piso.
- **Receta validada del orbe**: *"a solid sphere of brushed matte gold, a satin metal surface with soft studio reflections, like polished brass, lit by the room's lighting"*. Si debe "responder" a algo: *"catches a faint sheen, like a metal surface catching light for a moment"* — un metal que ATRAPA luz no puede emitirla.
- **Cuidado con el contagio**: la palabra "glows" en una frase vecina (p.ej. "warm light glows from the windows") se le pega al orbe. Reemplazar por "a soft warm light fills…".
- **Separación de canales de color**: si algo en la escena debe iluminarse, dale un color distinto al héroe — ventanas de edificios = "small, dim, COOL-WHITE points"; el dorado queda reservado en exclusiva al orbe. Si un elemento no puede ser dorado por definición, no hay fuga posible.

### 4.10 LA MALLA DEL PISO se derrite — bloquearla siempre

En muchos resultados el grid degeneró en vetas curvas tipo mármol. Cerrojo estándar (va
en toda escena con piso grid, escrito en positivo):

```
The floor grid keeps its perfectly straight, parallel, evenly spaced lines, identical
from the first frame to the last frame.
```

### 4.11 COORDINACIÓN "A responde a B": coreografía del primer beat

- Las reglas estadísticas ("repeat many times, always in sync") se degradan a titileo genérico.
- **Lo que funciona**: describir **el PRIMER beat completo como unidad de coreografía** ("[00:00–00:02] … one building lights up … In that exact same instant, the gold orb BRIGHTENS — … as one single event") y luego "the same paired beat repeats, again and again". El verbo del que responde, en mayúscula (ANSWERS, BRIGHTENS).
- Ritmo legible: ~1 beat por segundo. A 2+/s el ojo no verifica la simultaneidad.
- **Honestidad**: aun así, Veo-Vertex puede no dar la coordinación fina. Es el caso #1 de "resolver en post" (§5).

### 4.12 SELLOS E ÍCONOS sobre objetos (la técnica del "sello ciego")

- Los símbolos son el punto débil de los modelos de video: en movimiento se garabatean.
- **Receta de imagen validada** (con-sus-manos, el-peso): *"ONE icon pressed INTO the concrete of every visible face, like a blind embossing seal — the SAME pale color as the block, no ink, no contrast, readable only by the soft shadow of its recessed relief, sunken about the depth of a coin, large and centered on each face, following the perspective of that face."*
- Claves: **mismo color que el material** (se lee por sombra del relieve, no por tinta — "gris sobre blanco" fue rechazado por verse de sticker) · profundidad física concreta ("depth of a coin") · **pocos íconos, grandes y simples** (casa, birrete, carro, camión, `</>`, ⚠).
- En el prompt de VIDEO, blindarlos: *"the seals are part of the material: rigid, sharp and unchanged, falling and moving WITH their block as one solid object, never redrawn"*.

### 4.13 AUDIO en el prompt: eventos discretos, jamás texturas

- Error real: pedimos "a soft chime per event" → Veo generó **tintineo continuo** todo el clip. "Chime/campanilla" = textura musical para Veo.
- **Receta validada**: declarar la base como silencio y el patrón como secuencia explícita:

```
Audio: the base is near-total SILENCE — a very quiet room tone with long silent gaps.
Each beat is marked by ONE single short, soft, muted tone that decays quickly back into
silence. One event, one tone, silence. Six to eight isolated tones in the whole clip,
nothing else — like a quiet confirmation sound, never continuous, never musical.
```

- Sonidos que Veo hace decentes: impactos sordos, ambiente industrial, rumbles. Sonidos que NO: campanas de registradora, coordinación exacta con eventos visuales → esos van en post.
- Veo a veces **ignora por completo** la sección de audio. No re-generes solo por audio: el post lo resuelve con timing perfecto (§5).

### 4.14 El bloque IMPORTANT: los cerrojos finales

Todo prompt de video termina con un bloque `IMPORTANT:` con 3-6 cerrojos **en positivo** de
lo que el modelo tiende a romper en ESA escena: conteo de objetos, rigidez de sellos,
malla recta, único dorado, trampilla cerrada, "one block per moment — the screen is never
crowded". No es decoración: es donde se ganan los reintentos.

### 4.15 INMERSIÓN Y SENSACIÓN 3D: la cámara viva sobre la maqueta

La sensación 3D **no la dan los objetos: la dan la cámara y la profundidad de la
composición**. Un clip con cámara muerta se siente foto animada aunque el render sea perfecto.

**a) Los movimientos de cámara que funcionan (validados en producción):**

1. **Barrido bajo e inmersivo** (para build-ups con energía): la cámara a ras del piso,
   la malla corriendo por debajo — es el velocímetro del ojo.
   > *"The camera moves fast and immersive, sweeping LOW across the floor toward the
   > building, the grid lines rushing beneath the camera."*
2. **Dolly-in con easing** (el estándar premium): traslación real hacia el sujeto, todo
   escala junto (efecto maqueta/Inception), y frena suave.
   > *"A slow, continuous push-in traveling forward toward [X], easing to a gentle stop."*
   ⚠️ Para que OCURRA de verdad, aplicar §4.4 (anclas de encuadre medibles) — sin ellas,
   Veo entrega toma estática.
3. **Descenso + acercamiento combinados** (inmersión creciente): pasar del punto de vista
   "maqueta vista desde arriba" al punto de vista "humano dentro de la escena".
   > *"The camera glides LOWER and CLOSER, easing down toward floor level on the [X] side."*
4. **Cenital con push imperceptible**: para circuitos/laberintos vistos desde arriba —
   el acercamiento lento crea tensión sin marear.
5. **Atravesar una superficie** (inmersión total / cambio de mundo en un solo clip):
   > *"The camera immerses INTO one side face of the cube, entering at an angle as if
   > passing through a screen."*
   Tres condiciones (receta completa en GUIA §9.14, clip `metodo`): la inmersión la hace
   **LA CÁMARA** (nunca el objeto morfeando) · el mundo interior se describe como escena
   **NATIVA** (con sus propios objetos, sin referenciar los de afuera) · se **encadena el
   cuadro final** para fijar el destino.
6. **Doble capa de movimiento = parallax**: cámara moviéndose + elementos cruzando en
   primer plano a OTRA velocidad (camiones, cajas en banda). Si todo se mueve a la misma
   velocidad, el ojo lee 2D. La combinación cámara-lenta + tráfico-constante es la fórmula
   del clip del puente.

**b) Composición que produce 3D incluso con cámara lenta:**

- **Tres planos de profundidad, siempre**: algo CERCA de la cámara (cajas, la manija, un
  borde), el sujeto al MEDIO, algo LEJOS (ciudad, fondo). Sin primer plano no hay parallax
  y el mejor dolly se siente plano. Frase: *"[X] near in the foreground, [subject] rising
  in the middle, [Y] on the distant horizon."*
- **La malla es el instrumento de profundidad**: sus líneas en fuga miden la distancia y su
  paso bajo la cámara mide la velocidad. Por eso el cerrojo de malla recta (§4.10) importa
  doble cuando hay movimiento.
- **Objetos que entran y salen de cuadro** (camiones, cajas): dicen "el mundo continúa más
  allá del encuadre" — profundidad narrativa además de óptica.

**c) Cómo se AGREGA la inmersión sin romper la historia (caso real, validado):**

Un agente aplicó estas técnicas "al pie de la letra" y el clip PERDIÓ su mensaje (2
generaciones malas). La autopsia dejó tres reglas:

1. **La cámara vive en UN solo bloque compacto** (`CAMERA: …`), nunca esparcida por los
   beats. Si la cámara aparece en la apertura, en cada beat y en el IMPORTANT, el
   presupuesto de atención del modelo se va en la cámara y la historia se degrada.
2. **Los planos de profundidad se logran COLOCANDO objetos, no nombrando la teoría.**
   ❌ *"Three depth planes: X near, Y middle, Z far"* (meta-lenguaje de manual) →
   ✅ poner un objeto en primer plano, el sujeto al medio y fondo abierto, descritos como
   escena.
3. **Cámara y escena se turnan el protagonismo (dos actos)**: la cámara se mueve cuando la
   escena es estática (arco bajo alrededor del remador que rema en el sitio) y **se
   detiene cuando la escena se mueve** (aterriza detrás de la barca justo antes de que el
   catamarán se fugue). Nunca compiten. Cierre útil del bloque de cámara: *"The camera
   stays calm; the vessels do the moving."*

**d) Fracasos de inmersión documentados (no repetir):**

- **Viajar A LO LARGO de una estructura repetitiva LA REGENERA**: la cámara estilo F1
  recorriendo el circuito hizo que Veo alucinara MÁS circuito adelante (continuación
  infinita, geometría rota). Si hay que recorrer un camino largo: dolly corto + encadenar
  el destino, o que viaje el OBJETO (el orbe avanza) con la cámara siguiéndolo suave.
- **Órbita alrededor del sujeto**: arcos suaves (<45°) funcionan; medias vueltas o más
  inventan las caras ocultas (geometría inconsistente al rodear). Preferir dolly + descenso.
- **"Zoom" a secas** produce a veces escalado plano (2D). Pedir traslación: *"the camera
  moves FORWARD / travels toward / closes the distance"* — eso genera parallax real.
- **Morph del objeto para cambiar de escena**: caótico y mágico (viola §1). El cambio de
  escena se logra revelando con la cámara o atravesando una superficie (técnica 5).

### 4.16 Miscelánea de descubrimientos

- **No edites un frame de video para usarlo de keyframe** — sale blando/muddy. Regenera desde render limpio.
- **Duración vs beats**: 5+ eventos piden 10s; en 8s reparte máximo 4-5 beats o se atropellan.
- **Comportamiento emergente que gustó → pedirlo explícito la próxima vez** (el orbe empujado por cada impacto salió de suerte una vez; después se pidió de frente).
- **"Quita la sub-acción confusa"**: si un elemento hace algo raro (cajas saliendo por la chimenea), elimina la instrucción que lo generaba en vez de contra-instruir.
- **Video dentro de una pantalla**: declarar "in the SAME clinical quiet-luxury style", una sola cosa legible, sin grid interno.
- **Iteración de imagen con IA de edición**: al corregir una imagen, di qué se conserva ("The exact same scene as the attached image — … — with ONE correction: …"). Si pides "iguala los tamaños", puede igualar HACIA ABAJO: declara la dirección ("the central block stays EXACTLY as it is; the side pieces are ENLARGED to match") y da permiso de recorte ("it is fine if they get partially cropped by the frame edges").

---

## 5. Cuándo NO pelear con Veo: composición en post (la otra mitad del sistema)

Doctrina de la casa: **lo que el modelo no da de forma fiable, se dicta por código sobre su
máster** (numpy/PIL/ffmpeg — recetas en PIPELINE.md). El máster de Veo aporta la belleza;
el post aporta la exactitud. Casos reales resueltos así:

| Necesidad | Por qué Veo no | Solución en post (validada) |
|---|---|---|
| Destello del orbe sincronizado con cada edificio + tono | La coordinación fina nunca salió en 5+ intentos | Glint radial compuesto frame a frame sobre el orbe trackeado + tonos sintetizados en los timestamps exactos (`multiplicacion-glint.mp4`) |
| Encendido de un objeto en un beat editorial exacto | El evento cae donde Veo quiere | Freeze del último frame + lift de exposición enmascarado + push-in digital + power-on (`cierre-encendido.mp4`) |
| Dolly-in que Veo se negó a hacer | 3 intentos de cámara estática | Zoom digital 1.0→1.28 con easing sobre la toma fija (`el-puente-v2.mp4`) — límite del zoom = mantener todos los elementos en cuadro |
| Sonido ambiente en crescendo + espacio para un sample | Veo ignoró el audio | Ambiente sintetizado + **ducking** tallado donde entrará el sample real de CapCut |
| Vibración de cámara + motor forzado en un freeze | El clip traía un artefacto pasado el seg. 5 | Corte + freeze + tremor sintético de crop + drone "empuja y no avanza" |

**Los límites del post** (aprendidos a la mala):
- ❌ **Trackear objetos que rotan en 3D** para pegarles cosas (íconos sobre bloques cayendo, recolorear un gemelo en movimiento): matchmove real, el resultado "nada"/parpadea. → Regenerar.
- ❌ **Recolor por máscara de color amplia**: un filtro "todo lo dorado → gris" desaturó también cajas de cartón y el logo. Las máscaras de color deben ser quirúrgicas o no ser.
- ❌ Sonidos icónicos complejos por síntesis (la campana de registradora sonó a juguete): un sample real de CapCut gana. La síntesis brilla en: tonos de confirmación, thumps, motores, ambientes, cuenta-billetes (flutter mecánico).
- ⚠️ Gotcha técnico: al decodificar N frames por pipe de ffmpeg, usar `-frames:v N` exacto — decodificar de más deja el pipe bloqueado (deadlock silencioso).

---

## 6. PROMPTS REALES APROBADOS (anatomía comentada)

### 6.1 Imagen base (Vertex, con Negative) — "la trampilla"

```
Positive:
A cinematic 3D render scene, vertical 9:16 portrait, premium clean CGI. A dark showroom floor
of large dark tiles with thin light-gray seam lines, deep dark backdrop, calm studio lighting,
matte surfaces. Set flush into the floor, centered in the lower half of the frame: a rectangular
STEEL TRAPDOOR, its outline visible as clean seams, with two hinges on the LEFT side and a
single small matte metal HANDLE on the RIGHT side. The trapdoor is closed, flat, solid.
Standing on the floor at the LEFT of the trapdoor, next to the hinges and clearly far from the
handle: one small brushed matte gold orb, a solid sphere of satin gold metal lit by the room's
lighting, the only gold element in the scene. Wide vertical framing with generous empty space in
the upper half of the frame, room for objects to fall into frame later. Quiet, minimal, premium.

Negative:
open trapdoor, hole, glowing edges, neon, particles, dust, text, letters, numbers, watermark,
people, extra spheres, gold floor, clutter, square framing
```

*Por qué funciona*: la geografía emocional declarada dos veces ("next to the hinges and clearly
far from the handle" — el mensaje del clip ES esa distancia) · espacio vacío reservado para la
acción futura · receta anti-incandescencia del orbe · Negative disponible porque es IMAGEN.

### 6.2 Video encadenado con timestamps — "el peso sobre la puerta"

```
Animate from the first frame to the last frame. A closed steel trapdoor sits flush in a dark
tiled floor — hinges on the left, a small recessed metal handle on its right side — and a small
brushed matte gold orb stands on the floor beside the hinges. Heavy blocks of pale gray concrete
fall from above, one at a time, and stack ON TOP of the closed trapdoor, building the exact pile
of the last frame.

[00:01.5] The FIRST block slams down onto the trapdoor — the one with the HOUSE seal. It drops
fast, straight down like dead weight, lands with a low puff of concrete dust, a short subtle
camera shudder, and settles instantly, immovable. The trapdoor holds, closed and flat.
[00:03.5] The SECOND block slams down on top of the first — the one with the GRADUATION CAP
seal. Same heavy landing: dust puff, brief shudder, instant stillness.
[00:05.5] The THIRD block slams down on top — the one with the CAR seal. The deepest impact of
the three. The pile now stands complete: house, cap, car, all their weight resting on the
closed trapdoor.
[00:05.5–00:08] With the pile complete and still, the camera glides LOWER and CLOSER, easing
down toward floor level on the handle side, until it arrives exactly at the last frame: the
small recessed handle near in the foreground, the loaded pile of sealed blocks rising behind
it, and the gold orb small in the distance beside the hinges. A single soft metallic CLICK
sounds as the camera settles. Nothing moves. The shot holds.

THE SEALS: each block carries its icon pressed INTO the concrete of every visible face — a
blind embossed seal, the same pale color as the block, readable only by the soft shadow of its
recessed relief. The seals are part of the material: rigid, sharp and unchanged, falling and
moving WITH their block as one solid object, identical from the moment each block appears until
the last frame.

IMPORTANT: exactly THREE blocks fall, one per moment, in that order — house, graduation cap,
car — matching the last frame's pile exactly. The trapdoor stays CLOSED and flat the entire
clip, holding the full weight. The gold orb stays on the floor beside the hinges, the only gold
element. The dust is sparse, heavy and gray, settling quickly near the floor. The floor keeps
its straight seam lines from first frame to last.

Audio: quiet dark room tone; one deep, dense, muffled concrete THUD per landing — three
isolated impacts with silence between them, each slightly deeper than the last; then
near-silence while the camera descends, and ONE single soft metallic click at the very end,
precise and small. Nothing continuous, never musical.
```

*Anatomía*: encadenado porque hay conteo (3 bloques) y estado final exacto · timestamps
reparten las caídas (sin ellos, todo caía en 3s) · peso por consecuencias (polvo + shudder) ·
cámara con destino nombrado y horneada en el último cuadro · sellos blindados como material ·
IMPORTANT con los cerrojos de ESTA escena · audio de eventos discretos con silencios.

### 6.3 Video de UNA imagen con beats repartidos — "empresa de siempre" (concreto)

Fragmentos clave (el prompt completo sigue el mismo esqueleto que 6.2, sin segunda imagen):

```
Five heavy blocks of pale gray-white CONCRETE — massive, dense, matte, with chipped edges —
fall from above and land around the orb, one at a time, spread evenly across the FULL clip.
Each block drops FAST, straight down like dead weight, and slams into the floor: a low puff of
concrete dust kicks out from under it on impact, the camera gives a short, subtle shudder from
the hit, and the block settles instantly where it lands, immovable.
[...]
[00:06.5–00:07] LAST comes the biggest one: the huge concrete slab — far more massive than the
others — drops behind the orb and hits with the deepest impact of all: the biggest dust puff,
the strongest camera shudder, then absolute stillness. Nothing falls after it; the pile rests.
```

*Nota*: la jerarquía del clímax se pide con jerarquía de lenguaje ("far more massive… the
deepest impact of all"). El final en positivo: "Nothing falls after it; the pile rests."

### 6.4 Coordinación par-a-par — "multiplicación" (y su lección)

```
[00:00–00:02] The city is dark and calm. Then the FIRST beat: one building lights up with a
soft, contained warm glow held inside its own shape. In that exact same instant, the gold orb
BRIGHTENS — a clear, visible pulse of warm gold — and then settles back to its calm satin
state. Building and orb light up together, as one single event.
[00:02–00:08] The same paired beat repeats, again and again, in a steady rhythm like a slow
heartbeat — about one beat per second. Each time it is a DIFFERENT building — left, right,
near, far. And every single time, the orb ANSWERS in the same instant...
```

*Lección honesta*: aun así redactado, Vertex nunca clavó la coordinación (Gemini sí, con
marca). La versión final en producción se compuso **en post** sobre el máster de Vertex
(destellos + tonos por código). Cuando la coordinación exacta sea el mensaje, presupuesta el
post desde el diseño.

### 6.5 Caso completo — "La barca y el catamarán" (remos vs motor)

El clip del reel "remar más fuerte / construir el barco": un remador se esfuerza y apenas
avanza; un catamarán a motor lo deja atrás. Pasó por 4 iteraciones malas antes de la buena
— el historial de fixes es la mejor clase del manual:

| Iteración | Falla | Fix aplicado |
|---|---|---|
| 1 | Mensaje bien, **cero inmersión** (cámara muerta, malla estática) | Agregar cámara viva… |
| 2 | El agente esparció la cámara por todos los beats → **se perdió el mensaje** | §4.15c: cámara en UN bloque, dos actos |
| 3 | **Remos moviéndose solos** (sin remador) = fantasía involuntaria | El actor se describe SIEMPRE: "Seated IN the boat, a small matte gray figure grips both oars — one in each hand" + candado "the oars stay in the hands of the seated figure" |
| 3 | Barca y catamarán se alejaron **a la misma velocidad** → el contraste (todo el mensaje) no se leyó | Velocidades con **distancias físicas por objeto**: barca = "less than ONE boat-length in the whole clip" · catamarán = "in barely two seconds it crosses the whole stage"; repetido en beat + IMPORTANT |
| 4 | Dos héroes en escena (orbe observador + remador) partían la identidad | **El orbe se retiró**: cuando el VO le habla a una figura ("por más duro que usted reme"), esa figura ES el héroe del clip. Un clip, un héroe |

**Las jugadas que hicieron la versión final:**

1. **El sujeto se metió a la IMAGEN BASE** (editando `orbe-solo.png`: orbe fuera, barca +
   remador adentro, "frozen mid-stroke, leaning into the effort"). Así la figura se audita
   en quieto ANTES de animar — el fix estructural de los remos fantasma. Regla general:
   **lo que actúa en el video debe existir en la base**.
2. **Cámara en dos actos**: [00:00–00:03] la cámara SE HUNDE desde el encuadre de la base
   ("From the opening frame, the camera SINKS LOW…") y hace un **arco bajo** alrededor del
   remador — la malla barriéndose debajo con parallax = la inmersión pedida — y en
   [00:03] **aterriza detrás de la barca** y se queda quieta. Composición lista: barca
   grande en primer plano (cercanía), oscuridad abierta al fondo.
3. **La fuga en el eje Z**: el catamarán no sale de cuadro lateral (eso es 2D) — *"surges
   FORWARD, away from the camera… shrinking to a small shape near the horizon"*. El
   encogimiento hacia el horizonte ES la profundidad, y además ES el mensaje: se pierde de
   vista **por encima del hombro del remador**, que sigue clavado en primer plano dando
   paladas ("still straining at the oars… having gained barely one boat-length").
4. **Conteo del recién llegado**: el catamarán no está en la base → candidato a duplicarse
   → "exactly one rowboat and one catamaran" en el IMPORTANT.
5. **El audio remata el contraste**: el motor "fading with distance" mientras "the oar
   strokes continue unchanged" — remos vs motor también en la banda sonora.

---

## 7. Checklist antes de enviar un prompt de video

1. ¿Es 100% positivo? (ni un "sin", "no", "never" aplicado a objetos — el IMPORTANT puede usar "never" solo sobre COMPORTAMIENTOS ya descritos en positivo)
2. ¿Cada momento clave tiene su timestamp/rango, y los beats están repartidos por todo el clip?
3. ¿El vector de todo movimiento está repetido 3+ veces en formas distintas?
4. ¿El objeto héroe está contado ("ONE single… just one") y declarado único dorado?
5. ¿La escala está anclada al elemento más pequeño de la escena?
6. ¿La cámara tiene rol explícito (quieta con sujeto anclado, o movimiento medible con encuadre inicial/final)? ¿Y el clip tiene sus **tres planos de profundidad** y alguna **doble capa de movimiento** para el parallax (§4.15)?
7. ¿El estado FINAL está descrito en positivo ("still X as the shot ends")?
8. ¿La malla del piso lleva su cerrojo?
9. ¿El audio pide eventos discretos con silencios (o se resolverá en post)?
10. ¿El prompt se entiende sin NINGÚN contexto externo?

---

## 8. Bitácora de errores célebres (para reconocerlos al primer síntoma)

| Síntoma | Causa | Fix |
|---|---|---|
| Todo pasa en los primeros 3s | Sin timestamps | Beats con marcas de tiempo + "spread evenly across the FULL clip" |
| Aparecen 2 héroes (orbes gemelos) | Objeto no estaba en la base / sin negativo | "ONE single… just one" + encadenar el final + incluirlo en la base |
| Orbe incandescente (sol) | "glowing"/contagio de "glows" vecino | Receta brushed matte gold + separar canales de color |
| Orbe gigante | Escala anclada a una apertura grande | Anclar a figura humana + "dwarfed by" |
| Malla del piso derretida (vetas de mármol) | Sin cerrojo de grid | Cerrojo §4.10 |
| Camiones quietos | Movimiento no medible | "clearly advancing many truck-lengths" |
| Todos los camiones en un sentido (o el contrario) | Vector ambiguo / dos direcciones colapsan | Repetir vector; simplificar a UNA dirección |
| Cámara estática pese a pedir dolly | "anchored/only movement" leído como quietud | "the defining movement" + anclas de encuadre + test primer-vs-último segundo |
| Cámara rodeó el objeto por atrás | Destino vago | Nombrar el rasgo geométrico destino (SAWTOOTH ROOF, over the FRONT) |
| Tintineo musical continuo | "chime" + patrón estadístico | Silencio como base + "one event, one tone, silence… never musical" |
| Bloques de porcelana sin peso | Material sin consecuencias | Concreto + polvo acotado + shudder + "settles instantly" |
| Objeto se disuelve/derrumba | Se nombró la prohibición | Estado final en positivo |
| Elemento fuera de escala en primer plano (manija gigante) | Instrucción de cámara interpretada como objeto nuevo | Editar la imagen: "REMOVED… the floor continues naturally; ONE small handle at realistic floor-hatch scale, much smaller than the blocks" |
| El texto/ícono se garabatea en vuelo | Símbolos en movimiento = punto débil | Sellos ciegos grandes y simples + blindaje "rigid, never redrawn" + encadenado |
| La edición achicó/deformó en vez de igualar | Dirección del cambio no declarada | "X stays EXACTLY as it is; Y are ENLARGED to match" + permiso de recorte |
| El clip se siente plano/foto animada | Cámara muerta o todo a la misma velocidad | §4.15: dolly con anclas + tres planos de profundidad + doble capa de movimiento (parallax) |
| La cámara recorrió el camino y aparecía MÁS camino | Viajar a lo largo de estructura repetitiva la regenera | Dolly corto + encadenar destino, o que viaje el objeto y la cámara lo siga |
| Al rodear el objeto, la geometría se rompió | Órbita amplia inventa caras ocultas | Arcos <45°; preferir dolly + descenso |
| Objetos actuando solos (remos sin remador) | El actor nunca se describió / no estaba en la base | Describir SIEMPRE al actor + incluirlo en la imagen base + candado "in the hands of the seated figure" |
| Dos objetos huyendo a la misma velocidad | "slow"/"fast" sin medida | Distancia física POR objeto ("less than one boat-length" vs "crosses the whole stage in two seconds"), repetida en beat + IMPORTANT |
| Al agregar inmersión se perdió el mensaje | Cámara esparcida en todos los beats + teoría nombrada | §4.15c: UN bloque de cámara, dos actos, planos colocados (no nombrados) |
| Dos héroes en escena diluyen la identidad | Orbe observador + figura protagonista a la vez | Un clip, un héroe: retirar el que no recibe el "usted" del VO |

---

*Documento vivo — sumar cada descubrimiento nuevo con su caso real. Última actualización: 7 jul 2026 (destilado de la producción del reel Home, clips de servilleta y reels de nicho).*
