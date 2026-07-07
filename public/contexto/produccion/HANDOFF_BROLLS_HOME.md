# Handoff — B-rolls del reel explicativo de la HOME

**Para:** agente creativo (Gemini/Veo) + equipo de producción.
**Objetivo:** producir la serie de b-rolls 3D que ilustran el guion explicativo de la Home
(`creatuactivo.com`). El video responde a quien ya llegó preguntando *"¿de qué se trata?"*.

> ⚠️ **Gemini abre cada generación en un chat nuevo, sin memoria.** Todo prompt debe ser
> autocontenido; la única "memoria" entre piezas es la **imagen de referencia** que se adjunta.
> Este documento es la fuente única — léelo completo antes de generar.

**Documentos que complementan este handoff (leerlos):**
- [Manual de Dirección de Arte CreaTuActivo.md](Manual%20de%20Dirección%20de%20Arte%20CreaTuActivo.md) — la especificación técnica del estilo bloqueado + catálogo de referencias.
- [INVESTIGACION_ESTILO_GRAFICAS.md](INVESTIGACION_ESTILO_GRAFICAS.md) — la evidencia empírica (qué ganó / qué falló).
- [GUIA_IDENTIDAD_VISUAL_IA.md](GUIA_IDENTIDAD_VISUAL_IA.md) — el flujo de trabajo con IA + aprendizajes de motion.
- [CINEMATOGRAFIA_INMERSION_3D.md](CINEMATOGRAFIA_INMERSION_3D.md) — **la base cinematográfica** (lente, ángulo, perspectiva, capas, luz, movimiento) para lograr inmersión y evitar el efecto "maqueta". Leer antes de definir cámara de cualquier b-roll.
- [REELS_SITIO_CREATUACTIVO.md](guiones/reels/REELS_SITIO_CREATUACTIVO.md) — el guion (locución) que estos b-rolls ilustran.

---

## 1. Contexto de marca (lo mínimo para no equivocar el tono)

CreaTuActivo es una **firma de tecnología y construcción de patrimonio** (NO un multinivel).
Tono: **"Lujo Silencioso / Lujo Clínico"** — como una firma de capital privado, nunca como una
oportunidad de negocio. Audiencia: latinos pan-americanos (Colombia, México, USA), profesionales
y dueños de negocio. **El esfuerzo del usuario es digno**; el villano es **el sistema** que
consume sus mejores años, no la persona.

---

## 2. El estilo bloqueado: "Maqueta Técnica Premium"

Confirmado por experimento propio (ver INVESTIGACION). **NO** improvisar otro estilo.

- **Lienzo:** negro mate `#0F1115`, profundidad negativa, viñeta sutil. Vertical **9:16**.
- **Materia:** modelos 3D sólidos **gris mate tipo arcilla/yeso técnico** (clay render), con
  **arista blanca/plata nítida** (bevel) y **caras suavemente sombreadas** que revelan volumen.
  NO outline plano, NO cromado, NO fotorrealismo cotidiano.
- **Piso:** **cuadrícula de coordenadas en perspectiva REAL** (con punto de fuga — NO isométrica
  plana, que se ve "a app"). Líneas finas gris oscuro.
- **El grid-void ES el fondo universal — regla inviolable.** Todos los objetos (fábrica, ciudad,
  puente, orbe) se apoyan sobre la **misma cuadrícula sobre vacío mate**. El fondo "no representa
  nada" a propósito: eso es lo que lo hace **maqueta técnica** y no render de fantasía. **NUNCA**
  agregar entornos literales — sin agua/río bajo los puentes, sin cielo, sin mar, sin texturas de
  suelo ni de ciudad. Validado en `15.png`: la ciudad flota sobre el mismo grid que la fábrica, y
  eso se ve más premium/coherente que darle a cada elemento su propio escenario.
- **Luz:** estudio cerrado, HDRI de baja intensidad, **oclusión ambiental** (sombras de contacto
  densas que anclan los objetos al piso).
- **El orbe dorado = SOLO el usuario.** Oro satinado `#C5A059–#D4AF37`, **no emisivo** (latón
  cepillado), sin resplandor. Es el único elemento cálido. Aparece **solo cuando la pieza
  necesita héroe**; las gráficas de "sistema/mundo" pueden ir sin él.
- **Referencias de estilo** (para anclar prompts): **Ditroit**, **Found Studio**, **MIR**
  (escala monumental/archviz), MNFST. Ver catálogo en el Manual.

### Anti-patrones — PROHIBIDO (esto fue lo que rechazamos)
Partículas brillantes · estallidos / fuegos artificiales · estelas de cometa · speed-lines ·
lens bloom · neblina volumétrica · resplandor neón · **redes tipo "plexus"** · acabados de
fantasía. Tampoco **cian** ni robots humanoides. (El cian vive solo en la UI web, jamás en los
b-rolls.) Estos efectos = "fantasía barata, trabajo para niños" → destruyen la confianza.

### Plantilla base de prompt de IMAGEN (del Manual)
```
3D physical clay render, architectural massing study model, high-density matte dark gray
polymer material, sharp microscopic white edge bevel highlights, subtle ambient occlusion
contact shadows, real perspective with vanishing point, minimalist solid geometry, dark
matte studio background, 3D coordinate grid floor, [OPCIONAL: single solid satin gold metal
orb accent #C5A059, non-emissive, physical gold texture], clinical luxury aesthetic, 8k,
Redshift render style --ar 9:16 --style raw
```

---

## 3. Cómo trabajamos: imagen primero, luego videoclip

1. **Imagen (keyframe) en Gemini → sección imágenes.** Se genera el cuadro fijo del b-roll con
   la plantilla de arriba + el motivo específico. Generar 3–4, elegir la mejor.
   - **9:16 se fija en el SELECTOR de la interfaz**, no por texto.
   - **Sin verbos de movimiento** en el prompt de imagen ("entra", "viaja", "se acerca") →
     disparan modo video. Declarar *"A single STILL IMAGE, static frame — no motion"*.
   - Sin conteos exactos; usar **zonas visuales**. Framing positivo (describir lo que se quiere).
   - **La imagen de referencia es la palanca #1 de consistencia y calidad** — adjuntar la base
     aprobada (ej. `7.png`) con rol definido: *"úsala como referencia de estilo, cambia solo X"*.
2. **Videoclip en Veo** (anima el keyframe). El prompt describe **movimiento y cámara**, no
   re-describe la escena. Aprendizajes: la cámara se mueve CON el héroe (dolly-in), **todo
   escala junto** (inmersión Inception, nada se queda atrás), velocidad por palabras
   ("slow", "fast"). Gemini genera clips de ~10s → calcular el sobrante a recortar.
3. **Marca de agua ✦ de Gemini:** se tapa en el master con el logo-bug del pipeline.
4. **El reel NO se monta en Gemini.** El ensamble (orden, subtítulos, música, SFX, outro) lo
   hace el pipeline `scripts/dankoe-video`. Aquí solo se entregan los b-roll `.mp4`.

---

## 4. Reglas narrativas que rigen TODAS las gráficas

- **El orbe dorado = el usuario.** Ni Queswa, ni Gano, ni los prospectos se tiñen de oro.
- **Doctrina de socios (anti-MLM):** Gano y Queswa son **socios que trabajan PARA su empresa**
  ("de su lado"), nunca algo a lo que el usuario entra. Gano = el músculo; Queswa = el cerebro;
  el método = el mapa. (Ver memoria `feedback_socios_apalancamiento`.)
- **Villano = el sistema**, narrado, nunca etiquetado ni culpando al usuario.
- **Queswa = CONVERSIÓN, jamás "filtrar".** Bloques desordenados entran y salen ordenados.
- **Multiplicación** (si aparece) = duplicación **1→2→4→8 de abajo hacia arriba**, columna
  sólida — NUNCA pirámide/abanico (lenguaje MLM/downline).
- **Léxico:** "empresa digital" · "ingreso recurrente" · "masivo" (escala). Prohibido: vehículo,
  red, MLM, plexus, "operar".

---

## 5. La secuencia de b-rolls (tabla maestra)

Mapeada a la locución final del guion. **(estrella)** = la pieza más relevante.
**(NUEVA)** = el b-roll extra que pidió el Director para la sección "con sus manos".

### B1 · El Ciclo (villano)
- **Locución:** *"…un ciclo perpetuo de trabajar, pagar cuentas y repetir… un sistema diseñado
  para tomar sus mejores años y su salud."*
- **Qué dice la gráfica:** la trampa. Esfuerzo digno que no lleva a ningún lado.
- **Historia:** el orbe (usuario) recorre un circuito cerrado pasando por 3 prensas que bajan
  (TRABAJAR · PAGAR · REPETIR). Sin salida visible.
- **Visual:** circuito/laberinto en la cuadrícula; el orbe gira atrapado.
- **Cámara:** cenital, push-in lento e imperceptible.
- **Base / estado:** ✅ ya producido — verificar que sea maqueta sólida (sin partículas).

### B2 · La empresa de toda la vida (depende de usted)
- **Locución:** *"Una empresa de toda la vida necesita local, empleados, y si usted se aleja un
  poco, empieza a tambalear."*
- **Qué dice la gráfica:** el negocio físico **depende de su presencia**.
- **Historia:** una **fábrica-empresa con vida** (camiones, montacargas, trabajadores), en arcilla
  premium sobre grid-void; el **orbe dorado = el dueño**. Clip **dinámico**: la malla aparece a gran
  velocidad → la fábrica se resuelve → entran camiones, se mueve el montacargas, aparecen los
  trabajadores → el **dueño (orbe) se va** → la empresa **tambalea** (nunca colapsa).
- **Visual:** fábrica-empresa estilo `6.png` pero llevada al material arcilla premium de `15.png`.
  ❌ **NO** la casita/storefront (`16.png` descartada — leía como vivienda, no como empresa).
- **Cámara:** rápida e inmersiva al inicio (build-up), casi estática para el tambaleo final.
- **Base / estado:** 🆕 keyframe por generar (fábrica clay + orbe-dueño). Prompts de imagen + video
  definidos (sesión 28 jun 2026).
- **⚠️ B4 ya NO comparte la fábrica** (se rediseñó a "orbe solo + bloques que caen"), así que la
  colisión visual con B2 desapareció. B2 conserva la fábrica-empresa; distínguelo de B3/B6 (que también
  usan industria) por **acción** (B2 termina en tambaleo) y **ángulo/encuadre**.
- **Regla clave:** termina en **tambaleo**, jamás derrumbe/catástrofe/escombros (bloque IMPORTANT en
  el prompt de video lo blinda).
- **⚠️ Escala del orbe — NO ponerlo en el keyframe.** En la imagen fija la IA lo dimensiona enorme
  (tamaño camión). Solución: keyframe **sin orbe**; el orbe-dueño se **introduce en el prompt de
  video** saliendo por la puerta de la fábrica → la arquitectura lo obliga a ser **del tamaño de una
  persona/trabajador** ("same size as a worker figure · small enough to pass through the doorway ·
  never the size of a truck"). Patrón reutilizable para cualquier b-roll donde el orbe conviva con
  edificaciones.

### B3 · ¿Qué es una empresa digital? — EL PUENTE **(estrella)**
- **Locución:** *"…reemplaza el local por infraestructura en internet… Crece de forma masiva y
  su alcance no tiene fronteras. Piense en Amazon o MercadoLibre… el puente digital que conecta
  a millones y ganan por cada transacción, de forma automática."*
- **Qué dice la gráfica:** *"yo soy dueño del puente que conecta"* = una empresa digital.
- **Historia:** el **puente/plataforma protagonista** con el **orbe dorado (usted, dueño)** en el
  tercio medio. Fábrica pequeña en un extremo (proveedor, secundaria), ciudad/personas en el otro.
  El puente se extiende al horizonte = masivo / sin fronteras.
- **Visual:** fábrica (primer plano, abajo) → puente recto de **dos carriles** con fila continua
  de camiones alejándose → ciudad (fondo, continente de borde a borde). Sin orbe (el puente es el
  protagonista, decisión Luis). Todo sobre el **mismo grid sobre vacío** (sin río/cielo).
- **Cámara:** dolly-in premium siguiendo el puente hacia la ciudad; todo escala junto (Inception).
  Sin partículas.
- **Base / estado:** ✅ **keyframe bloqueado en `public/contexto/capturas/servilleta/15.png`**.
  Resolvió todos los problemas previos (islote → continente; un solo puente recto; fondo grid-void;
  flujo de camriones fábrica→ciudad legible). **Es la imagen de la que sale el ADN del resto.**
  **Siguiente paso: prompt de video de 10s sobre 15.png.**

  **Prompt ganador del keyframe** (cualquier ajuste debe partir de este — los prompts que pedían
  "isla/orbe en el puente" reintroducían el islote):
  ```
  A single STILL IMAGE, static frame. 3D physical clay render, architectural massing study model.
  High-density matte dark gray polymer material, sharp white edge bevel highlights. 3D coordinate
  grid floor, dark matte studio background. VERTICAL SCENE COMPOSITION (9:16 Layout): The camera
  looks down a single, monumental, straight bridge extending from the FOREGROUND deep into the
  BACKGROUND horizon. FOREGROUND (Bottom of image): The bridge originates DIRECTLY OUT OF a large,
  minimalist industrial factory. BACKGROUND (Top of image): The bridge leads DIRECTLY INTO a vast,
  dense, minimalist modern city. ACTION: On the bridge, a continuous line of cargo trucks is
  driving AWAY from the viewer, traveling from the foreground factory straight to the background
  city. Everything built flat on the grid floor. NO ISLANDS. NO CROSSROADS. NO ORBS. Clinical
  luxury aesthetic, minimalist solid geometry, 8k, Redshift render style --ar 9:16
  ```

### B4 · Con sus propias manos, desde cero — EL PESO **(NUEVA)**
- **Locución:** *"El primero: con sus propias manos, desde cero. Pagar el desarrollo tecnológico,
  conseguir los proveedores, tramitar los permisos en cada país, resolver la logística de
  entregas y asumir los riesgos de cualquier proyecto empresarial."*
- **Qué dice la gráfica:** construir todo usted solo = una carga enorme que se le va acumulando encima.
- **Concepto (validado jul 2026):** el **orbe solo** en el grid-void; por cada uno de los 5 elementos
  que nombra la voz **cae un bloque grande, pesado y robusto** junto al orbe, con impacto que **hace
  vibrar el piso** (escala en peso; el 5º "asumir los riesgos" es el más brutal). Coreografía:
  1) derecha · 2) izquierda · 3) frente-derecha · 4) más al frente · 5) el más pesado **encima/detrás
  del orbe**. El orbe termina **cercado por el peso, solo — sin resolverse** (el alivio es de Gano, B6).
  **Bonus emergente que conservamos:** cada impacto **empuja un poco al orbe** → traduce el peso.
  - Es el mecanismo que blinda el beat: mapeo 1:1 por sincronía (5 elementos = 5 bloques), física
    honesta (el piso vibra), causa visible (voz nombra → bloque cae). Ver
    [INVESTIGACION_CREDIBILIDAD_LOGICA_BROLL.md](INVESTIGACION_CREDIBILIDAD_LOGICA_BROLL.md).
- **Base / plancha:** `public/contexto/capturas/reel-home/orbe-solo.png` (orbe solo adelante, grid-void,
  piso libre a los lados y atrás para las caídas). **Reemplaza la vieja idea `6.png`** (fábrica
  industrial con montacargas/trabajadores), que contradecía "desde cero, solo".
- **Cámara:** fija en tres cuartos bajo; solo un **temblor breve** en cada impacto (escala, el mayor en el 5º).
- **Base / estado:** ✅ concepto validado con clip generativo (Veo I2V 10s, `capturas/reel-home/16–19.png`).
  Pendiente: bajar la marca de agua ✦ y **sincronizar los 5 impactos a la voz** en el pipeline (o clavarlo
  en Remotion `DesdeCero3D` si se quiere precisión determinística + golpe de SFX del kit).
- **Watch-out:** en el test los bloques salieron **piedra clara rugosa** (no el clay gris oscuro de casa);
  se ve premium pero vigilar consistencia con los demás b-rolls. El 5º "techo" sobre el orbe puede leer un
  pelín a "refugio"; en contexto (voz + impactos) lee a **cercado/atrapado**.
- **Nota:** este es el contraste que hace **sentir necesario el apalancamiento** del camino 2.

### B5 · El apalancamiento — la empresa ya construida (transición)
- **Locución:** *"El segundo camino es el apalancamiento: usted no crea la infraestructura, la
  usa para empezar de inmediato. Funciona gracias a la unión de tres fuerzas estratégicas."*
- **Qué dice la gráfica:** usted no carga el peso; lo toma ya resuelto.
- **Historia:** del camino lleno de bloques pesados (B4) se revela, despejado, la empresa digital
  ya construida; el orbe toma ese camino.
- **Visual:** bifurcación en la cuadrícula → el camino construido al frente.
- **Cámara:** push hacia el camino despejado.
- **Base / estado:** 🆕 crear (opcional; puede resolverse como transición entre B4 y B6).

### B5b · La bisagra — Tres fuerzas, las tres resueltas **(NUEVA · ✅ producida jul 2026)**
- **Locución (línea 44):** *"…para que una empresa digital así exista, tres cosas tienen que ser ciertas — alguien la fabrica, algo la atiende, y usted sabe qué hacer. Las tres ya están resueltas."*
- **Por qué es EL eje:** desactiva el bloqueo *"¡ops, es meterme a Gano!"*. Al establecer "3 requisitos, ya resueltos" ANTES de nombrar a Gano, Gano aterriza como "la pieza 1, ya hecha", no como un destino (frame-before-name).
- **Concepto:** tres monolitos abstractos distintos (cubo · losa · cilindro) separados en el grid-void → **convergen al centro y encajan en UN solo bloque** (clic sólido, "hechas para embonar" = ya resuelto) → **un orbe dorado baja y se asienta encima** (usted, dueño, sobre lo ya construido). **Espejo invertido de B4** (allí caos/cercado; aquí encaje limpio/corona). Sin destellos: la activación es el encaje.
- **Plancha INICIO:** `capturas/reel-home/35.png` (3 piezas grandes separadas, estilo `empresa-de-toda-la-vida`: fondo graduado + líneas nítidas). FIN = bloque ensamblado + 1 orbe encima.
- **Estado:** ✅ producido en **Vertex (Veo)**. Clave: el Gemini app **duplicaba el orbe** (sin negative-prompt); en Vertex, prompt **100% positivo** repitiendo "one / single / only sphere" (el negativo de video en Vertex es por API Python, no UI) + opción de último cuadro. Ver [[project_reel_home_broll_map]].
- **Pareja con el CIERRE** (*"une las tres en una… las enciende"*): mismo motivo, 2º estado → las tres se funden/encienden como una plataforma.
- Doctrina: física honesta (piezas que encajan), causa visible, 1:1 (3 piezas = 3 fuerzas), cero fantasía. Ver [INVESTIGACION_CREDIBILIDAD_LOGICA_BROLL.md](INVESTIGACION_CREDIBILIDAD_LOGICA_BROLL.md).

### B6 · Socio 1 — Gano, el músculo
- **Locución:** *"Su socio logístico y financiero: Gano Excel… una corporación con más de 30
  años y presencia en 70 países que fabrica, asume el costo millonario del inventario, responde
  por lo legal y despacha el producto en cada país… músculo real, de su lado."*
- **Qué dice la gráfica:** infraestructura global que carga el peso por usted.
- **Historia:** globo monumental + 70 puntos que se encienden + complejo industrial. Escala
  monumental (referencia MIR). **SIN orbe-héroe** (es respaldo/sistema, no el usuario).
- **Visual:** `49.png` (globo + complejo industrial).
- **Cámara:** sobrevuelo diagonal constante (drone).
- **Base / estado:** base `49.png` ✅ → animar.
- **Nota:** leer como **socio que se le entrega**, no "empresa a la que entra".

### B7 · Socio 2 — Queswa
- **Locución:** *"Su socio digital: Queswa… atiende y madura en cada interesado la decisión de
  avanzar, las 24 horas. Es su oficina digital completa, trabajando a su favor."*
- **Qué dice la gráfica:** el cerebro que convierte, 24/7.
- **Historia:** núcleo/prisma gris monolítico + ondas/ecualizador (la IA); bloques entran
  desordenados y salen **ordenados** (conversión). El orbe (usuario) lo dirige desde arriba.
- **Visual:** prisma/centro de mando + ecualizador.
- **Cámara:** giro orbital suave alrededor del prisma.
- **Base / estado:** ✅ base de Queswa ya producida — revisar que **no esté dorada**.
- **Nota:** conversión, **jamás "filtrar"**. Queswa no dorada (oro = solo el usuario).

### B8 · Socio 3 — Método comprobado
- **Locución:** *"Un método comprobado: un sistema que le marca los pasos exactos… usted dirige,
  sus socios hacen el trabajo."*
- **Qué dice la gráfica:** pasos exactos = certeza, sin ensayo y error.
- **Historia:** malla densa + camino con checkpoints (PASO 01 · 02 · 03) con ✓; el orbe recorre
  el camino marcado.
- **Visual:** `48.png` (malla + camino + checkpoints).
- **Cámara:** push-in siguiendo el camino.
- **Base / estado:** ✅ **RESUELTO (jul 2026) — un solo clip I2V, inmersión + recorrido en una toma.**
  Concepto: cámara **entra por una cara del cubo** (inmersión) → adentro el orbe recorre un camino con
  **2 waypoints luminosos** + **pin de Google Maps** como destino final. La receta ganadora (**GUIA §9.14**):
  1. **La inmersión la hace la CÁMARA, no el orbe** — *"a smooth push-in that immerses INTO one side face
     of the cube, entering at an angle as if passing through a screen"*. La cara del cubo llena el cuadro
     (el orbe externo, que está arriba, sale de plano) y abre a la escena interna. Este movimiento de
     cámara **sí funciona** en Veo.
  2. **No se referencia el orbe externo.** Adentro se presenta *"a single gold orb"* como elemento
     **nativo** de la escena interna, **posado sobre el camino** (*"resting on the path… glides smoothly
     FORWARD"*). Esto mata el bug del **"orbe que cae al piso con un saltito"**: ese salto salía porque el
     prompt ataba el orbe interno al externo y Veo lo "bajaba" al escenario. Cero verbos verticales sobre
     el orbe.
  3. **Encadenado primer→último cuadro** fija el desenlace: primer cuadro `BASE.png` (orbe sobre el cubo,
     externo) → último cuadro [`metodo-punto-3.png`](../capturas/reel-home/metodo-punto-3.png) (un orbe en
     el pin, en su charco de luz, interno). El **último cuadro bloqueado** blinda el conteo y el recorrido
     (GUIA §9.3) → el orbe *tiene* que aterrizar en el pin, uno solo; se acabó el "a veces 4 puntos".
  4. Puntos **por partes** (2 intermedios + el pin es el destino, nunca "3 + pin" = 4, GUIA §9.12) + malla
     estable (GUIA §9.11) + duración **10s** (inmersión + 2 waypoints + llegada = 4 beats).
  **Prompt final** (Vertex UI, positivo-only) archivado en GUIA §9.14. Reemplaza el diagnóstico previo de
  §9.13 ("la inmersión entrar-al-cubo NO la hace la IA"): sí la hace **si la ejecuta la cámara** y el orbe
  se trata como nativo interno + endpoint encadenado.

### B9 · El consumo recurrente (el premio / loop)
- **Locución:** *"…cada vez que el consumo se repite en los hogares de su organización, usted
  recibe una parte, una y otra vez. Una empresa que crece sin techo…"*
- **Qué dice la gráfica:** el ingreso que vuelve, una y otra vez, y crece.
- **Historia:** metrópoli ordenada sobre el grid-void (fábrica al frente → puente → skyline con
  torre insignia, mismo orden que `servilleta/15.png`); el orbe dorado **flota sobre la ciudad**.
  Una y otra vez, un edificio se enciende y **al mismo instante el orbe hace un glint pareado**
  (encienden JUNTOS, en sync) = "usted recibe una parte". Más edificios se van quedando encendidos
  = crece sin techo.
- **Visual:** ciudad ordenada + orbe elevado sobre ella; destellos **pareados** edificio⇆orbe.
- **Cámara:** push-in lento y continuo desde la fábrica hacia la ciudad y el orbe.
- **Base / estado:** ✅ **RESUELTO (jul 2026).** Plancha final: `capturas/reel-home/multiplicacion/
  ciudad-cool.png` (metrópoli ordenada anclada en `servilleta/15.png` + orbe sobre la ciudad + glow
  contenido). **Aprendizajes que lo destrabaron** (ver GUIA §9.15):
  1. **"Usted recibe" SIN flujo direccional ni fuegos** → el mecanismo ganador es el **destello
     pareado en sincronía**: edificio se enciende ⇆ el orbe hace un glint **al mismo instante**,
     ~20 veces en 10s, cada vez un edificio distinto. Comunica "le llega una parte, una y otra vez"
     sin haces que suban al cielo (que leían fuegos artificiales) ni pulsos que "entran" (que la IA
     no dibujaba bien).
  2. **Ciudad ordenada = anclar en `servilleta/15.png`**, no generar skyline de cero (salía
     amontonada / mar de bloques). La referencia impone el orden de metrópoli.
  3. **Orbe centrado y elevado SOBRE la ciudad** (no al ras, no a un lado) → todo converge a él.
  4. **Glow contenido** (no sol con flares) — el bloom reventado rompía el Lujo Silencioso.
  **Prompt final** archivado en GUIA §9.15.

> **CTA** (*"pregúntele a Queswa…"*) = talking-head / orbe en la página, sin b-roll dedicado.

---

## 6. Assets de referencia

**APROBADAS (replicar esta calidad):**
- `public/contexto/capturas/servilleta/7.png` — terminal logística (estándar de oro del estilo).
- `public/contexto/capturas/servilleta/15.png` — **keyframe bloqueado de B3 (el puente).** Fábrica
  → puente 2 carriles con camiones → ciudad-continente, todo sobre grid-void. Estándar de oro del
  fondo "que no representa nada".
- `public/contexto/capturas/servilleta/6.png` — fábrica + personas (base de B4).
- `public/contexto/capturas/dan-koe/48.png` — malla + camino + checkpoints (B8).
- `public/contexto/capturas/dan-koe/49.png` — globo + complejo industrial (B6).
- `public/contexto/capturas/identidad/1.png` — ancla de identidad del orbe dorado.

**RECHAZADAS (lo que NUNCA debe pasar):**
- `public/contexto/capturas/servilleta/3.png`, `4.png`, `5.png` — puente con estallidos dorados
  (partículas/bloom/fantasía). Si un resultado se parece a estas, descartar.

---

## 7. Orden de producción sugerido

1. **B3 (estrella)** — ✅ keyframe bloqueado (`15.png`); falta solo el videoclip. Fija el ADN del resto.
2. **B4 (con sus manos · NUEVA)** y **B2 (empresa de siempre)** — el contraste/peso.
3. **B6 · B7 · B8** (los tres socios) — bases existentes, solo animar.
4. **B9** (loop recurrente) y **B5** (transición apalancamiento) — cierran el arco.
5. **B1** (ciclo) — ya existe; solo verificar estilo.

Cada pieza: imagen (3–4 variantes, elegir) → videoclip Veo → entregar `.mp4` al pipeline.

---

## 8. INVENTARIO VIGENTE DE CLIPS (6 jul 2026) — fuente de verdad de nombres

⚠️ **Para cualquier agente que ensamble reels con estos clips**: varios archivos llevan
sufijo de versión y NO coinciden con el nombre canónico del beat. Esta tabla resuelve el
mapeo. Carpeta: `~/Downloads/clips-reel-home/` (local, gitignored — los clips web viven
en Vercel Blob; los de la servilleta en `public/videos/servilleta/`).

| Beat | Archivo VIGENTE | Nota |
|------|-----------------|------|
| B1 · El ciclo (villano) | `bucle.mp4` | — |
| B2 · Empresa de siempre | `empresa-de-siempre.mp4` | tambaleo + sonido (post) |
| B3 · El puente | **`el-puente-v2.mp4`** | dolly-in digital hacia el techo de la fábrica (post, compuesto por código sobre toma fija de Veo) + ambiente de despacho en crescendo + **duck en t=6.4s reservado para sample de registradora** (se agrega en CapCut). El `el-puente.mp4` viejo NO existe |
| — · sonrisaslindas | `sonrisaslindas.mp4` | — |
| B4 · Con sus manos | `con-sus-manos.mp4` | v2 en sitio (mismo nombre): bloques de CONCRETO con sellos ciegos (íconos: `</>`, fábrica, documento, camión, ⚠) que caen en 7s, placa grande al final |
| B5b · 3 cosas ciertas | **`3-cosas-ciertas-v2.mp4`** | piezas iguales con sellos (fábrica/chat/checklist) que se unen en el cubo limpio + orbe |
| B6 · Gano | `socio-logistico.mp4` | — |
| B7 · Queswa | `queswa-final.mp4` | — |
| B8 · Método | `metodo.mp4` | actualizado 6 jul |
| B9 · Multiplicación | **`multiplicacion-glint.mp4`** | destellos del orbe + tonos de confirmación compuestos EN POST (8 beats exactos sobre olas de encendido) — el `multiplicacion.mp4` crudo ya no existe |
| Cierre | **`cierre-encendido.mp4`** | supersede a `creatuactivo.mp4` (ya no existe): cubo+orbe, encendido interior en t=2.0s + power-on (post). Alinear "las enciende" del VO a t≈2.1s |
| Máster Home | `reel-home-final-2.mp4` (6 jul) | corte nuevo en curso; `reel-home-final.mp4` (5 jul) es el previo |

**Técnica de la casa (clips `-glint` / `-encendido` / B4-sellos):** lo que Veo no da de forma
fiable (coordinación luz+sonido, sellos legibles, timing exacto) se **compone por código en
post** sobre el máster de Veo — scripts numpy/PIL/ffmpeg, patrón validado (multiplicación,
cierre, con-sus-manos, el-puente). Los scripts de esta tanda vivieron en el scratchpad de
sesión; la doctrina y las recetas están en [PIPELINE.md](../../../scripts/dankoe-video/PIPELINE.md)
y los prompts/lecciones de generación en [GUIA_IDENTIDAD_VISUAL_IA.md](GUIA_IDENTIDAD_VISUAL_IA.md) §9.

*Documento vivo. Actualizar a medida que cada b-roll se apruebe (marcar ✅ y enlazar el master).*
