# Claude Code ya puede fabricar sus clips

A septiembre de 2026, Claude Code ya puede generar y encadenar sus clips sin que usted abra la app de Gemini. Para eso no hace falta un MCP ni un plugin: basta un guion de Python de unas 60 líneas que llama a **Veo 3.1 por la API de Gemini** con una clave de Google AI Studio. La API hace lo mismo que usted hoy hace a mano (imagen a video, con primer cuadro o con primer y último cuadro, en 9:16, 8 segundos y 1080p). Además descarga el clip, le extrae el último cuadro y arranca con él el siguiente. La documentación de Google solo menciona la marca invisible SynthID, no la estrella visible de la app (conviene confirmarlo con el primer clip). Para unos **87 clips al mes** (20 por semana), con 2,5 intentos por clip útil y las planchas incluidas, el costo realista es de **160 a 250 dólares mensuales con Veo 3.1 Lite o Fast**. La calidad Standard ronda **380 dólares** si se genera sin audio (por Vertex o por fal) y pasa de **700** por la API de Gemini, que cobra el audio aunque usted no lo use. Lo que ninguna API arregla son los defectos que hoy le cuestan tomas. Ningún proveedor ni benchmark mide los objetos duplicados, las rejillas deformadas o el texto ilegible. La consistencia se gana en otro lado: en la plancha, en anclar los dos extremos de cada clip, en dejar todo el texto para Remotion y en que Claude revise cuadros antes de aceptar una toma. Lo primero que conviene adoptar son cinco cosas, en este orden:

1. Apagar hoy la marca visible de la app.
2. Montar el guion de Veo.
3. Fabricar las planchas con Nano Banana 2 o con su propio R3F.
4. Instalar los skills oficiales de Remotion.
5. Usar fal.ai como banco de pruebas para Gemini Omni Flash, Kling 3.0 y Wan 3.0, que sí llegan a 10 segundos.

Tres fechas marcan el calendario. La API de Sora cerró el 24 de septiembre. El Nano Banana original se apaga el 2 de octubre. Y los Veo 3.1 estables de Vertex tienen retiro anunciado para el 17 de noviembre de 2026 «o después».

## Un guion de 60 líneas reemplaza la app de Gemini

Una API es la puerta por la que un programa, en vez de una persona, le pide trabajo a un servicio. Veo tiene hoy dos. La primera es la **API de Gemini**, que se abre con una clave de Google AI Studio. Ahí hay tres modelos vigentes: `veo-3.1-generate-preview`, `veo-3.1-fast-generate-preview` y `veo-3.1-lite-generate-preview`, los tres todavía en fase *Preview* ([Gemini API: Veo](https://ai.google.dev/gemini-api/docs/veo)). La segunda es **Vertex AI**, que Google renombró en su documentación como «Gemini Enterprise Agent Platform». Ahí `veo-3.1-generate-001` y `veo-3.1-fast-generate-001` son estables (GA) desde el 17 de noviembre de 2025, con retiro previsto el «17 de noviembre de 2026 o después». La versión Lite sigue en Preview ([Vertex: Veo 3.1](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/veo/3-1-generate)).

Por cualquiera de las dos puertas, Veo 3.1 hace clips de **4, 6 u 8 segundos, a 24 cuadros por segundo, en 16:9 o 9:16**. El 1080p y el 4K solo salen en clips de 8 segundos. La imagen a video y el paso de un primer a un último cuadro funcionan en las tres variantes. En la API de Gemini cada clip tarda entre 11 segundos y 6 minutos en horas pico. Los videos se **borran del servidor a los dos días**, así que el guion tiene que descargarlos apenas terminan ([Gemini API: Veo](https://ai.google.dev/gemini-api/docs/veo)).

**Por qué un guion y no un MCP.** El único servidor MCP de Veo con sello de Google es `mcp-veo-go`, versión 3.7.0, con cambios del 25 y 26 de septiembre. Tiene tres limitaciones para su caso:

- Solo funciona sobre Vertex.
- Guarda siempre el resultado en un bucket (una carpeta en la nube) de Google Cloud Storage.
- Recibe las imágenes como direcciones `gs://`, es decir, archivos ya subidos a ese bucket.

El propio repositorio advierte que «no es un producto con soporte oficial de Google» ([mcp-veo-go](https://github.com/GoogleCloudPlatform/genmedia-creative-studio/blob/main/experiments/mcp-genmedia/mcp-genmedia-go/mcp-veo-go/README.md)). Para usted eso significaría crear un proyecto de Google Cloud y un bucket, y subir cada plancha antes de generar.

El guion usa el SDK oficial `google-genai` (la librería de Google para Python, versión 2.25.0 del 22 de septiembre), que Claude Code llama desde la terminal. Envía la plancha que está en su disco, pregunta cada diez segundos si el clip terminó y guarda el MP4 en la carpeta del pipeline ([python-genai](https://github.com/googleapis/python-genai/blob/main/google/genai/models.py)). La llamada central cabe en pocas líneas. El esquema siguiente sigue la forma que Google documenta para primer y último cuadro:

```python
operation = client.models.generate_videos(
    model=MODELO,                      # viene de un archivo de configuración, nunca fijo
    prompt=orden_en_ingles,
    image=types.Image.from_file(location="plancha_A.png"),            # primer cuadro
    config=types.GenerateVideosConfig(
        aspect_ratio="9:16", resolution="1080p", duration_seconds=8,
        last_frame=types.Image.from_file(location="plancha_B.png")),  # último cuadro
)
```

La tabla cruza cada dolor de su flujo actual con lo que lo resuelve, y con qué tan firme es esa respuesta.

| Dolor de hoy | Qué lo resuelve | Qué tan seguro es |
|---|---|---|
| Claude Code no puede llamar a Veo | Guion con `google-genai` y una clave de la API de Gemini | Documentado por Google |
| Encadenar exige extraer el último cuadro y volver a subirlo | El guion lo extrae con una línea de ffmpeg y lo pasa como primer cuadro del clip siguiente. También puede fijar el cuadro final con `last_frame` | Documentado. La extensión nativa de Veo no sirve aquí: en la API de Gemini solo trabaja a 720p |
| La estrella visible de la app | Por API, Google solo documenta SynthID (y C2PA en Vertex). En la app se puede apagar con «Media Watermark» | Se deduce de que la documentación no la menciona. Se confirma con el primer clip |
| Objetos duplicados, rejilla deformada, texto ilegible | Nada en la API. Se ataca con planchas, anclaje y revisión (sección siguiente) | Sin métricas públicas |
| Estilo igual en decenas de clips | Un archivo de estilo fijo, el mismo modelo, hasta 3 referencias y semilla (solo en Vertex) | Parcial: la semilla «guía», no garantiza |

**API de Gemini o Vertex.** La API de Gemini es la puerta más simple, pero tiene tres limitaciones que pesan en su caso:

- Cobra el audio siempre, aunque usted lo reemplace con la voz de ElevenLabs.
- Entrega un solo video por petición.
- El SDK actual rechaza el parámetro `seed` (la semilla) cuando apunta a esta API, aunque la documentación dice que existe.

Lo más prudente es tratar la semilla como no disponible allí ([python-genai](https://github.com/googleapis/python-genai/blob/main/google/genai/models.py); [Gemini API: Veo](https://ai.google.dev/gemini-api/docs/veo)).

Vertex permite tres cosas que la API de Gemini no:

- Apagar el audio. Con eso el Standard baja de $0.40 a $0.20 por segundo.
- Pedir de una a cuatro variantes por llamada.
- Fijar una semilla y usar `negativePrompt`, un campo aparte para lo que no se quiere ver.

Fuentes: [Vertex: imagen a video](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/video/generate-videos-from-an-image); [precios de Vertex](https://cloud.google.com/vertex-ai/generative-ai/pricing).

A cambio, Vertex exige la CLI de Google Cloud, un proyecto con facturación y credenciales de aplicación. Además, la ficha de Veo dice «Pay-as-you-go: Not supported; Fixed quota: Supported» y no explica cómo consigue cuota una cuenta pequeña. Ese punto no quedó verificado. La recomendación: empezar por la API de Gemini, y pasar a Vertex o a fal (que vende Veo sin audio a un precio parecido) solo si el volumen en calidad Standard lo justifica.

**Facturación.** Veo no tiene capa gratuita. Hay que vincular una cuenta de facturación, lo que deja la cuenta en el nivel 1. Ese nivel trae un **tope de gasto de 250 dólares**, que sube a 2,000 después de pagar 100 dólares y esperar tres días ([límites de la API de Gemini](https://ai.google.dev/gemini-api/docs/rate-limits)).

**Dos reglas del modelo cambian cómo se escribe cada orden:**

- **Solo el inglés está plenamente soportado.** Google dice que otros idiomas «pueden funcionar, pero los resultados varían». Claude debe escribir las órdenes en inglés aunque el guion del reel esté en español ([Gemini API: Veo](https://ai.google.dev/gemini-api/docs/veo)).
- **Personas en imagen a video.** El único valor permitido de `personGeneration` es `allow_adult`. Sus pictogramas humanos deberían pasar, siempre que la orden no los describa como niños.

**Una señal de fondo.** Desde junio, Google recomienda **Gemini Omni Flash** como modelo por defecto para video. Deja Veo 3.1 para «extensión de escena, control del último cuadro o integración con flujos heredados» ([Gemini API: video](https://ai.google.dev/gemini-api/docs/video)). Veo sigue siendo la mejor pieza para su encadenamiento. Pero el guion debe tratar el modelo como algo que se cambia en la configuración, no como algo fijo.

## La consistencia se gana en la plancha, no en el video

Ninguna fuente seria mide cuántas veces Veo 3.1 duplica un objeto, deforma una rejilla o arruina un texto. Un resumen de búsqueda afirmó que el texto sale ilegible «más veces que no», pero no se pudo atar a una fuente confiable. Los rankings públicos miden preferencia general, no conteo de objetos ni rectitud de líneas ([Artificial Analysis, imagen a video](https://artificialanalysis.ai/video/leaderboard/image-to-video)). La conclusión práctica: cambiar de herramienta no quita esos defectos. Se reducen con dirección de arte, y la palanca más fuerte es la plancha (el cuadro del que parte el modelo). Si la plancha ya trae una sola esfera, la rejilla recta y el teléfono con sus íconos, Veo se limita a mover lo que hay en vez de inventar.

**Planchas por API: Nano Banana 2.** Para fabricar planchas por API, la mejor relación calidad-precio es **Nano Banana 2** (`gemini-3.1-flash-image`):

- Usa la misma clave que Veo.
- Genera 9:16 nativo hasta 4K.
- Cuesta **$0.067 por imagen a 1K, $0.101 a 2K y $0.151 a 4K**, y la mitad en modo lote ([precios de la API de Gemini](https://ai.google.dev/gemini-api/docs/pricing)).
- Edita a partir de una imagen, acepta hasta 14 referencias, y la guía de Google sugiere la instrucción «Do not change any other elements of the image» para ediciones sucesivas ([Gemini API: generación de imágenes](https://ai.google.dev/gemini-api/docs/image-generation)).

En el ranking ciego de edición de Artificial Analysis queda octavo (1107 puntos, $67 por mil imágenes). GPT Image 2.5 Sunburst encabeza con 1180 puntos, pero cuesta $210.70 por mil. Conviene reservarlo para ediciones difíciles donde Nano Banana se desvíe ([Artificial Analysis, edición](https://artificialanalysis.ai/image/leaderboard/editing)).

Dos avisos sobre estos modelos:

- El **Nano Banana original (`gemini-2.5-flash-image`) se apaga el 2 de octubre de 2026** ([precios de la API de Gemini](https://ai.google.dev/gemini-api/docs/pricing)). Imagen 4 ya se apagó en la API el 17 de agosto ([kingy.ai](https://kingy.ai/ai-launch-tracker/google-will-shut-down-three-imagen-4-api-models-august-17/)).
- La página de precios llama al modelo `gemini-3.1-flash-image`, pero el ejemplo de la documentación de Veo usa `gemini-3.1-flash-image-preview`. El nombre exacto se confirma en la primera llamada.

**Planchas por código (idea por probar).** Esto es una deducción, no una medición. Su estilo es geometría mate, una rejilla y una esfera dorada, justo lo que su proyecto de Remotion con React Three Fiber (`scripts/dankoe-video/motion`, que ya incluye `@react-three/fiber` y `@remotion/three`) sabe dibujar. Una plancha dibujada por código trae la rejilla perfecta, una sola esfera y la pantalla del teléfono con los íconos exactos, idéntica entre clips. Veo solo pondría el movimiento.

**Cuando la plancha sí sale de un modelo de imagen,** un paso fijo en Python protege lo que el modelo tiende a tocar:

- Tomar del resultado solo los píxeles dentro de una máscara ampliada alrededor del objeto nuevo, y conservar el original en todo lo demás.
- Revisar después el tono del dorado, porque estos modelos suelen correr el color general.
- Para un plano más abierto, generar primero el amplio y recortar hacia el cerrado. Un recorte es exacto; un «aléjate» obliga al modelo a redibujar la rejilla.

**Anclar los dos extremos del clip** es la segunda palanca. La guía de primer y último cuadro de Runware para MiniMax H3 da un principio que sirve para cualquier modelo de este tipo. Funciona mejor cuando los dos cuadros «comparten composición y difieren en una cosa». Los movimientos pequeños y físicos conservan la forma; las acciones grandes la deforman ([Runware](https://runware.ai/docs/models/minimax-h3/guides/first-and-last-frame)). Eso sugiere clips que cambien una sola cosa: la esfera sube, la cámara avanza, aparece un pictograma. La orden describe solo el movimiento de cámara, el de la esfera y una lista cerrada de lo que hay en escena.

Aquí hay una tensión que su propia prueba debe resolver. Su experiencia dice que nombrar lo que no se quiere lo invoca. Google, en cambio, recomienda escribir negaciones dentro de la orden, tanto en Omni Flash («No scene cuts») como en Nano Banana ([Gemini API: Omni](https://ai.google.dev/gemini-api/docs/omni)). La salida razonable: redactar en positivo («single continuous shot») y enviar las negaciones solo a los campos separados donde existen, que son `negativePrompt` en Vertex y `negative_prompt` en Kling.

**Tres ajustes cierran el circuito:**

- **El texto no se genera.** La interfaz del teléfono y cualquier cifra se montan en Remotion encima del clip. Ningún modelo revisado demuestra que conserve texto con fiabilidad; MiniMax lo promete, pero es palabra del propio fabricante ([MiniMax](https://www.minimax.io/blog/minimax-h3)).
- **Referencias para objetos fijos.** Para que la esfera y el teléfono sean idénticos en decenas de clips, Veo 3.1 acepta hasta tres imágenes de referencia de tipo *asset*, solo en clips de 8 segundos y no en Lite ([Gemini API: Veo](https://ai.google.dev/gemini-api/docs/veo)). No quedó verificado si se pueden combinar con un primer cuadro en la misma llamada.
- **Cómo encadenar.** Hay que elegir, y conviene probar las dos formas:
  - Arrancar el clip siguiente desde el último cuadro real, extraído con ffmpeg: la continuidad es exacta, pero la calidad se degrada poco a poco, porque cada generación recomprime y redibuja.
  - Arrancarlo desde la misma plancha limpia que sirvió de último cuadro: no hay degradación, pero puede notarse un pequeño salto en el corte.

**Revisión automática.** Claude puede sacar cuadros de cada toma con ffmpeg y mirarlos antes de aceptarla, sin instalar nada: cuenta esferas y revisa la rejilla. En Vertex, pedir cuatro variantes por llamada da de dónde escoger, a cuatro veces el costo.

## Veo ya tiene rivales, y algunos llegan a 10 segundos

El panorama cambió este verano. OpenAI retiró de su API la Videos API y los modelos `sora-2` y `sora-2-pro` el **24 de septiembre de 2026**, sin reemplazo. Cualquier tutorial o MCP de Sora quedó muerto ([OpenAI: retiros](https://developers.openai.com/api/docs/deprecations)). En el ranking ciego de imagen a video sin audio de Artificial Analysis, los cinco primeros hoy son Gemini Omni Flash (1369), Wan 3.0 (1363), Bach 1.0 Pro (1363), MiniMax H3 (1357) y PixVerse V6 (1340). Veo 3.1 no está entre ellos ([Artificial Analysis](https://artificialanalysis.ai/video/leaderboard/image-to-video)). Ese ranking premia sobre todo el realismo y el gusto general, no lo que a usted le importa. Aun así, muestra que hay alternativas serias.

**El techo de Veo son 8 segundos por generación.** Para un clip de 10 hay dos salidas. Una es la extensión nativa de Veo, que en la API de Gemini solo trabaja a 720p y choca con una entrega en 1080p. La otra es otro modelo. Cuatro rivales cubren ese hueco, con primer y último cuadro, en 9:16.

| Modelo | Duración | Primer + último cuadro | Precio de referencia | Advertencias |
|---|---|---|---|---|
| Gemini Omni Flash (Google, misma clave que Veo) | 3–10 s | Sí, con dos imágenes | ≈$0.10/s a 720p; ≈$0.15/s a 1080p (reescalado) | Por defecto hace varias tomas y hay que pedir «single continuous shot». No tiene campo de negativos. Se usa por otra parte de la API (Interactions) |
| Kling 3.0 Pro (vía fal) | 3–15 s | Sí, con `end_image_url` | $0.112/s sin audio | Audio encendido por defecto (+50 %). Toma la proporción de la imagen inicial. La documentación oficial no se pudo leer |
| Wan 3.0 (Alibaba) | 2–30 s | Sí | $0.10/s a 720p; $0.20/s a 1080p, vía la API de Runway | Marca de agua apagada por defecto. El enlace del video caduca en 24 h |
| MiniMax H3 | 4–15 s | Sí (0, 1 o 2 cuadros) | $0.08/s a 768p, vía Runware | A 768p hay que reescalar a 1080×1920 |

Fuentes de la tabla: [Gemini Omni Flash](https://ai.google.dev/gemini-api/docs/models/gemini-omni-flash), [Omni: guía](https://ai.google.dev/gemini-api/docs/omni) y [precios de la API de Gemini](https://ai.google.dev/gemini-api/docs/pricing); [fal: Kling 3.0 Pro](https://fal.ai/models/fal-ai/kling-video/v3/pro/image-to-video); [Alibaba Cloud: Wan 3.0](https://www.alibabacloud.com/help/en/model-studio/wan3-video-generation-api-reference) y [precios de la API de Runway](https://docs.dev.runwayml.com/guides/pricing/); [MiniMax: API de video](https://platform.minimax.io/docs/guides/video-generation).

Dos modelos más merecen mención, con reservas:

- **Seedance 2.5 (ByteDance)** permite usar como referencia modelos 3D sin textura, en «render de arcilla», para fijar la posición de la cámara y de los objetos ([ByteDance Seed](https://seed.bytedance.com/en/blog/one-take-creation-flexible-referencing-introducing-seedance-2-5)). Es lo más cercano a su geometría gris que existe. Pero las fuentes se contradicen sobre qué versión acepta primer y último cuadro, y sobre si llega a 1080p ([ofox.ai](https://ofox.ai/blog/seedance-api-guide-tiers-pricing-2026/)). Y no está probado si conserva un aspecto deliberadamente sin textura.
- **Luma Ray3.2** admite hasta 16 cuadros clave por clip, ideal para control rígido ([Luma](https://lumalabs.ai/news/introducing-ray-3-2)). Pero su documentación de API está parcialmente desactualizada.

**Revendedores: una clave para muchos modelos.** No hace falta una cuenta por modelo. fal.ai tiene casi todos los anteriores, incluido Veo 3.1. Su imagen a video cuesta $0.20 por segundo sin audio y $0.40 con audio. Veo 3.1 Fast cuesta $0.10 y $0.15 a 720p y 1080p, es decir, precio de Vertex sin montar Google Cloud. Estas cifras vienen de un resumen de búsqueda y deben confirmarse con la herramienta de precios de fal ([fal: Veo 3.1](https://fal.ai/models/fal-ai/veo3.1/image-to-video)). Todos los modelos de fal funcionan igual: se envía el trabajo, se consulta si terminó y se descarga ([fal: cola](https://fal.ai/docs/model-apis/model-endpoints/queue)). El recargo del revendedor varía mucho:

- Replicate cobra Kling 3.0 a $0.224 por segundo, contra $0.112 en fal.
- fal cobra Seedance a cerca del doble que el proveedor directo ([Teamday](https://www.teamday.ai/blog/ai-image-video-api-providers-comparison-2026)).
- La API de Runway también revende Veo 3.1, Wan 3.0, Seedance, H3 Max y Omni Flash ([Runway](https://docs.dev.runwayml.com/guides/pricing/)).

Como ningún ranking mide sus defectos, la única señal confiable es una prueba propia: tres escenas suyas (la esfera que sube sobre la rejilla, los pictogramas que aparecen, el primer plano del teléfono), cinco modelos (Veo 3.1 Fast, Omni Flash, Kling 3.0, Wan 3.0 y H3) y dos tomas cada una. Son unos 30 clips, entre **30 y 45 dólares, una sola vez**, calificados por número de esferas, rectitud de la rejilla y fidelidad al estilo. Detalle útil para esa prueba: Seedance rechaza imágenes con rostros reales ([YingTu](https://yingtu.ai/en/blog/seedance-2-0-human-face)). Sus pictogramas sin rostro y un teléfono sin logotipos ni aplicaciones reales esquivan esos filtros.

## De decenas de MCP y skills, solo dos merecen instalarse hoy

Un MCP es un conector que le da a Claude herramientas nuevas; un skill es un paquete de instrucciones que Claude carga cuando la tarea lo pide. El repositorio oficial de skills de Anthropic no trae ninguno de video ni de ffmpeg ([anthropics/skills](https://api.github.com/repos/anthropics/skills/contents/skills)). Su tienda oficial de plugins tiene 314 entradas. Las de medios que importan son HyperFrames (de HeyGen), Runway, Adobe for Creativity y Cloudinary; no aparecen fal, ElevenLabs, Google ni Remotion ([tienda oficial de plugins](https://github.com/anthropics/claude-plugins-official/blob/main/.claude-plugin/marketplace.json)). Casi todo lo útil se instala directo del fabricante, con `npx skills add` o `claude mcp add`.

| Herramienta | Para qué sirve | Estado a sep 2026 | Veredicto |
|---|---|---|---|
| Skills oficiales de Remotion (`remotion-dev/skills`) | Composición, 3D, subtítulos, render y búsqueda en la documentación al día | Activo (actualizado 25 sep), gratis ([repo](https://github.com/remotion-dev/skills)) | **Instalar ya** |
| MCP de Remotion | Consultar la documentación | Retirado: puede apagarse desde el 31 ago 2026 ([Remotion](https://www.remotion.dev/docs/ai/mcp)) | No instalar |
| MCP en línea de fal.ai | Más de 1.000 modelos (Veo, Kling, Wan, H3…). Consulta precios con `get_pricing` y maneja trabajos largos | Oficial y activo ([fal](https://docs.fal.ai/model-apis/mcp.md)) | **Instalar para la prueba** |
| MCP genmedia de Google (`mcp-veo-go` y otros) | Veo, Nano Banana, Lyria y ffmpeg vía Vertex | Muy activo, sin soporte oficial. Exige proyecto de Google Cloud, bucket e imágenes `gs://` ([genmedia](https://github.com/GoogleCloudPlatform/genmedia-creative-studio/tree/main/experiments/mcp-genmedia)) | Posponer hasta pasar a Vertex |
| Runway (MCP + plugin en la tienda oficial) | Gen-4.5 y reventa de Veo, Wan, Seedance y Omni | Activo; prepago mínimo de 10 dólares ([skills de Runway](https://github.com/runwayml/skills)) | Alternativa a fal |
| Replicate (MCP en «code mode») | Catálogo amplio | Activo, pero más caro en Kling ([Replicate](https://replicate.com/docs/reference/mcp)) | Alternativa |
| ElevenLabs | Voz. Su MCP local está archivado; el MCP en línea se centra en agentes | Skills oficiales activos, con transcripción con marcas de tiempo ([MCP archivado](https://github.com/elevenlabs/elevenlabs-mcp); [skills](https://github.com/elevenlabs/skills)) | Opcional: usted ya usa la API |
| HyperFrames (HeyGen) | Convierte HTML en MP4. Compite con Remotion | Muy activo ([repo](https://github.com/heygen-com/hyperframes)) | No cambiar de sistema |
| `claude-code-video-toolkit` | Remotion + ElevenLabs + ffmpeg, con modelos abiertos en la nube | Activo ([repo](https://github.com/digitalsamba/claude-code-video-toolkit)) | Tomar ideas (su `/scene-review`), no adoptarlo entero |
| MCP de Sora y de Luma | Video | Sora cerrado el 24 sep; Luma sin cambios desde abr 2025 ([Luma MCP](https://github.com/lumalabs/luma-api-mcp)) | Descartados |

**Dos detalles técnicos de Claude Code pesan en esta elección** ([Claude Code: MCP](https://code.claude.com/docs/en/mcp.md)):

- Si un conector en línea pasa 5 minutos sin responder, Claude Code corta la llamada. Veo puede tardar hasta 6 minutos en horas pico. Un servidor que espera callado a que el video esté listo se arriesga a ese corte. El guion, o las herramientas que separan «enviar» de «consultar» (como las de fal), lo evitan.
- Las imágenes que devuelve un MCP cuentan contra un límite de 25.000 tokens por respuesta. Revisar cuadros con ffmpeg y leerlos desde disco sale más barato.

**Qué puede hacer su MacBook.** Su equipo es un M1 con 8 GB, macOS 26.6.2 y ffmpeg 8.1.1 (verificado en el equipo el 26 de septiembre). Generar video ahí queda descartado:

- Un M1 Max con 64 GB tardó 82 minutos en un clip de 2 segundos de Wan 2.2, a 832×480, y el formato FP8 falla en la GPU de los Mac ([lilting.ch](https://lilting.ch/en/articles/ltx2-wan22-mac-local-video-gen)).
- LTX-2.5 pesa unos 66 GiB ([LTX-2](https://github.com/Lightricks/LTX-2)).
- Topaz Video exige 16 GB como mínimo ([Topaz](https://docs.topazlabs.com/topaz-video/system-requirements)).

Dos herramientas locales sí caben, pero probablemente no hacen falta:

- `rife-ncnn-vulkan` crea cuadros intermedios y tiene versión para macOS ([RIFE ncnn](https://github.com/nihui/rife-ncnn-vulkan)). No hace falta si Remotion coloca los clips de 24 cuadros dentro de una composición de 30.
- Real-ESRGAN ncnn sube la resolución y también tiene versión para macOS ([Real-ESRGAN ncnn](https://github.com/xinntao/Real-ESRGAN-ncnn-vulkan)). No hace falta si los clips se generan directamente en 1080p.

**Quitar marcas de agua después de generar tampoco compensa:**

- El filtro `delogo` de ffmpeg emborrona las líneas de la rejilla.
- ProPainter necesita 19 GB a 720p y su licencia prohíbe el uso comercial ([ProPainter](https://github.com/sczhou/ProPainter)).
- IOPaint quedó archivado (sin mantenimiento) el 13 de agosto de 2025.

Es mejor evitar la marca que quitarla.

**Un hallazgo lateral**, visto en su propio repositorio y **corregido el 26 sep 2026**: `scripts/dankoe-video/process_video.py` decía usar BiRefNet, pero en realidad cargaba U2Net (para el que 320×320 sí es la entrada correcta) y corría solo en el procesador. Hoy el script corre U2Net en CoreML por defecto y acepta `--modelo birefnet` a 1024. Medido en su Mac: BiRefNet no compila en CoreML y en el procesador tarda 78–157 s por fotograma, así que un reel completo con BiRefNet sigue yendo por el notebook de Kaggle. El script, además, figura como obsoleto desde que usted graba con pared carbón.

## Cinco adopciones, en orden, con pasos y costo

El orden va de lo gratis e inmediato a lo que cuesta y conviene medir. Las dos primeras resuelven el acceso a Veo y la marca visible; la tercera ataca los defectos; la cuarta y la quinta amplían el taller.

| # | Adopción | Qué resuelve | Montaje | Costo |
|---|---|---|---|---|
| 1 | Apagar «Media Watermark» en gemini.google.com → Configuración ([Ayuda de Gemini](https://support.google.com/gemini/answer/17405358?hl=en)) | La estrella visible en lo que siga haciendo a mano | 2 minutos, usted | $0 |
| 2 | Guion `veo.py` sobre la API de Gemini | Claude genera, encadena y descarga, sin marca visible | Una tarde: usted crea la clave y Claude escribe el guion | Pago por uso (ver costos) |
| 3 | Planchas con Nano Banana 2 y protección de píxeles en Python; probar planchas dibujadas en R3F | Duplicados, rejilla y consistencia de estilo | 1 o 2 sesiones | ≈$15–35 al mes |
| 4 | Skills oficiales de Remotion | Composición, 3D y subtítulos con la documentación al día | 10 minutos | $0 |
| 5 | fal.ai como banco de pruebas, por API o por MCP | Probar Omni Flash, Kling, Wan, H3 y Veo sin audio con una sola clave | 1 hora, más la prueba | ≈$30–45, una vez |

**Sobre la primera adopción.** El ajuste solo controla la marca visible: SynthID sigue igual. Colombia no está entre los tres países (India, Corea del Sur y Vietnam) donde exige el plan AI Ultra. Aun así, la ayuda de Google no dice si depende del plan fuera de esos países. Y en Flow hay usuarios que ven la estrella incluso con Ultra ([foro de Gemini](https://support.google.com/gemini/thread/451900454/google-ai-ultra-visible-%E2%9C%A6-watermark-appears-on-every-flow-generated-video?hl=en)).

**Puesta en marcha.** Solo los dos primeros pasos requieren su mano; el resto lo ejecuta Claude Code.

| Paso | Quién | Qué se hace |
|---|---|---|
| 1 | Usted | Entrar a Google AI Studio con la cuenta del negocio, crear una clave de API y vincular una cuenta de facturación (Veo no tiene capa gratuita) |
| 2 | Usted | Pegar la clave como `GEMINI_API_KEY` en `.env.local`. El repositorio ya excluye `.env*` de los commits |
| 3 | Claude Code | `pip install -U google-genai`, y escribir `veo.py`. El guion recibe la plancha inicial (y la final, si la hay), toma la orden en inglés desde un archivo de estilo y lee el modelo de la configuración. Pide 9:16, 8 s y 1080p, espera, descarga en cuanto termina y extrae el último cuadro |
| 4 | Claude Code | Clip de prueba: confirmar la resolución, que no haya marca visible y que el cobro coincida con la tarifa |
| 5 | Claude Code | Sacar cuadros de cada toma y revisarlos antes de pasarla a Remotion |
| 6 | Claude Code | En `scripts/dankoe-video/motion`, correr `npx remotion skills add` ([Remotion](https://www.remotion.dev/docs/ai/mcp)) y reiniciar la sesión |
| 7 | Usted y Claude | Abrir cuenta en fal.ai con un saldo pequeño. Registrar el MCP con `claude mcp add --transport http fal-ai https://mcp.fal.ai/mcp --header "Authorization: Bearer SU_CLAVE_FAL"` ([fal](https://docs.fal.ai/model-apis/mcp.md)). Dejar en «preguntar» las herramientas que cobran |

**Costo mensual.** Supuestos:

- Unos **87 clips útiles al mes** (20 por semana × 52 ÷ 12).
- **2,5 intentos por clip útil.** Es un supuesto de trabajo, no una medición: su propia prueba lo afinará.
- Las tarifas son las oficiales publicadas en septiembre ([precios de la API de Gemini](https://ai.google.dev/gemini-api/docs/pricing); [precios de Vertex](https://cloud.google.com/vertex-ai/generative-ai/pricing)), salvo las de revendedores, que se citan en la sección anterior.
- Las planchas con Nano Banana 2 a 2K suman aparte unos **$17 a $35** al mes (entre 170 y 350 imágenes a $0.101).

| Modelo y vía | Duración | $ por clip | Mes, 1 intento | Mes, 2,5 intentos |
|---|---|---|---|---|
| Veo 3.1 Lite 1080p, API de Gemini | 8 s | $0.64 | $56 | $139 |
| Veo 3.1 Fast 1080p sin audio, vía fal (cifra por confirmar) | 8 s | $0.80 | $70 | $174 |
| Veo 3.1 Fast 1080p, API de Gemini | 8 s | $0.96 | $84 | $209 |
| Veo 3.1 Standard 1080p sin audio (Vertex o fal) | 8 s | $1.60 | $139 | $348 |
| Veo 3.1 Standard 1080p, API de Gemini (audio obligatorio) | 8 s | $3.20 | $278 | $696 |
| Gemini Omni Flash 720p, API de Gemini | 10 s | ≈$1.01 | $88 | $220 |
| Gemini Omni Flash 1080p reescalado, API de Gemini | 10 s | ≈$1.52 | $132 | $331 |
| Kling 3.0 Pro sin audio, vía fal | 10 s | $1.12 | $97 | $244 |
| Wan 3.0 720p, vía Runway | 10 s | $1.00 | $87 | $218 |

**Cómo leer la tabla.** La vía más barata que conserva 1080p es Veo 3.1 Lite. El centro razonable es Veo 3.1 Fast. El Standard solo se justifica si la prueba propia muestra una diferencia visible en su estilo.

**Una variante escalonada** baja el costo sin renunciar a Fast: dos borradores en Lite a 720p ($0.40 cada uno) y la versión final en Fast a 1080p ($0.96). Son $1.76 por clip, unos **$153 al mes** más las planchas. Tiene un límite: como la API de Gemini no acepta semilla, el borrador valida la plancha y la orden, no el clip final exacto.

**Dos cosas de facturación:**

- El escenario central, Fast con 2,5 intentos, roza el tope de $250 del nivel 1 en el primer mes. El nivel 2 se abre solo tras $100 pagados y tres días ([límites](https://ai.google.dev/gemini-api/docs/rate-limits)).
- Todo esto se suma a lo que ya paga. ElevenLabs Starter y Claude Code no cambian. Lo que paga hoy por la app de Gemini quedó fuera de esta investigación: si la sigue usando para explorar, ese costo sigue ahí.

## Fechas que vencen, gastos que se multiplican y lo que no está verificado

Varios cambios de este trimestre afectan directamente lo que se construya:

| Fecha | Qué ocurre | Qué implica |
|---|---|---|
| 17 ago 2026 (ya ocurrió) | Imagen 4 se apagó en la API de Gemini ([kingy.ai](https://kingy.ai/ai-launch-tracker/google-will-shut-down-three-imagen-4-api-models-august-17/)) | Planchas con Nano Banana 2 |
| Desde el 31 ago 2026 | El MCP en línea de Remotion puede apagarse ([Remotion](https://www.remotion.dev/docs/ai/mcp)) | Usar los skills |
| 24 sep 2026 (hace dos días) | Se retiró la API de Sora 2, sin reemplazo ([OpenAI](https://developers.openai.com/api/docs/deprecations)) | Descartar Sora |
| 2 oct 2026 | Se apaga `gemini-2.5-flash-image`, el Nano Banana original ([precios](https://ai.google.dev/gemini-api/docs/pricing)) | No construir nada sobre él |
| 23 oct 2026 | Se retira `gpt-image-1` (fuente de terceros) ([CostGoat](https://costgoat.com/pricing/openai-images)) | Si usa OpenAI, ir a GPT Image 2 o 2.5 |
| 17 nov 2026 «o después» | Retiro anunciado de Veo 3.1 estable en Vertex ([Vertex](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/veo/3-1-generate)) | Modelo en la configuración; buscar el sucesor antes de esa fecha |
| Sin fecha | Los Veo 3.1 de la API de Gemini siguen en Preview | Pueden cambiar con poco aviso |
| Siempre | La API de Gemini borra los videos a los 2 días. Wan y Seedance caducan sus enlaces en 24 h, y Runway los de las imágenes | Descargar al terminar |

**Trampas de gasto.** El riesgo de dejar que un agente llame APIs de pago no es un ataque: es multiplicar el gasto sin darse cuenta. Hay tres trampas:

- **Parámetros que multiplican.** Las cuatro variantes por llamada de Vertex, o los skills que prometen generar cientos de clips, multiplican el gasto en un solo turno.
- **Reintentos a ciegas.** Si Claude reintenta una llamada que tardó demasiado, puede pagar dos veces el mismo clip.
- **Audio encendido.** Kling, Wan y H3 generan audio por defecto, y en Kling eso cuesta un 50 % más ([fal: Kling 3.0](https://fal.ai/models/fal-ai/kling-video/v3/pro/image-to-video)).

**Las defensas:**

- Dejar en «preguntar» toda herramienta que cobre, y permitir sin pregunta solo las de consulta, como precios y estado de un trabajo.
- Usar saldos prepagados pequeños: Runway pide un mínimo de 10 dólares y Kling solo acepta créditos pagados ([Runway](https://github.com/runwayml/skills); [Kling](https://kling.ai/app/mcp/guide)).
- Una clave dedicada y revocable por servicio.
- Un registro de cada llamada que cobre.

**Lo que no está documentado:**

- Ninguna de las fuentes revisadas documenta topes de gasto duros en fal, Replicate, Runway, Kling o ElevenLabs, ni alertas de presupuesto para Veo en Vertex. Hay que buscarlos en cada consola de facturación.
- A favor: la API de Gemini solo cobra los clips que se generan con éxito. Un clip bloqueado por los filtros de seguridad no se paga ([Gemini API: Veo](https://ai.google.dev/gemini-api/docs/veo)).
- En seguridad: un skill corre con los mismos permisos que el agente, así que conviene leer su `SKILL.md` antes de instalarlo ([Claude Code: MCP](https://code.claude.com/docs/en/mcp.md)).

**En lo legal, la marca invisible no se va nunca.** SynthID viaja en todas las rutas de Google, y en Vertex además va C2PA (un sello de origen en el archivo). Quitar la marca visible no borra el origen del clip. La política de uso de IA de Google prohíbe hacer pasar un contenido generado como hecho solo por una persona «para engañar». No menciona las marcas de agua ([política de uso de Google](https://policies.google.com/terms/generative-ai/use-policy)). El artículo 50 de la ley de IA europea rige desde el 2 de agosto de 2026 para contenido que se hace pasar por real ([guía del artículo 50](https://artificialintelligenceact.eu/transparency-rules-article-50/)). Un video explicativo estilizado difícilmente entra ahí, y usted opera desde Colombia. Esto no es consejo legal. Queda sin investigar cómo Meta y TikTok exigen etiquetar el contenido generado con IA. Importa, porque su canal de WhatsApp y sus anuncios viven en una cuenta de Meta.

**Lo que esta investigación no pudo verificar, para que nadie lo tome como hecho:**

- **Marca visible por API:** que no existe se deduce de que Google no la menciona. Un tercero sí lo afirma explícitamente ([aifreeapi](https://www.aifreeapi.com/en/posts/veo-3-1-watermarks-synthid)).
- **Semilla:** la documentación de la API de Gemini dice que existe; el SDK la rechaza.
- **`negative_prompt`:** el SDK lo envía a la API de Gemini, pero la documentación ya no lo lista.
- **Cuota en Vertex:** no se sabe cómo obtiene cuota de Veo una cuenta pequeña.
- **Precios de Veo en fal:** vienen de un resumen de búsqueda.
- **Kling y Seedance:** sus documentaciones oficiales no se pudieron leer.
- **Omni Flash:** no apareció el parámetro exacto que fija la duración.
- **Referencias de Veo:** no se sabe si se combinan con un primer cuadro en la misma llamada.
- **Veo 3:** la documentación lo marca a la vez como «estable» y como «retirado».
- **Su MacBook:** no hay cifras publicadas de velocidad de estas herramientas en un M1 de 8 GB.

## Conclusión

Lo que cambió no es que exista una herramienta nueva, sino dónde está el cuello de botella. El acceso a Veo desde Claude Code se resuelve en una tarde y con una clave. Lo que decide si un clip sirve es la dirección de arte, y esa se juega antes de generar: en la plancha, en el anclaje y en la revisión automática. De ahí sale la idea con más potencial y menos probada del informe. Su estilo es tan geométrico que el código ya puede dibujar sin error justo lo que la IA hace mal: una sola esfera, una rejilla recta, una pantalla legible. La IA puede quedarse solo con lo que el código no hace bien, que es el movimiento orgánico. Un flujo híbrido de planchas en R3F animadas por Veo convierte el problema de consistencia en uno de configuración, y merece ser la primera escena de la prueba.

La segunda lección es de diseño. Google ya empuja a Omni Flash como su modelo por defecto, Vertex puso fecha de retiro a su Veo estable y Sora desapareció con seis meses de aviso. El guion debe tratar el modelo como una línea de configuración, con el mismo ciclo de enviar, consultar y descargar para cualquier proveedor. Así, cambiar de Veo a lo que gane la prueba cuesta minutos y no una reescritura. Por eso una prueba de 40 dólares con sus propias planchas vale más que cualquier ranking publicado: los rankings miden lo que le gusta al público general, y lo que usted necesita saber es cuál modelo respeta una esfera dorada sobre una rejilla.
