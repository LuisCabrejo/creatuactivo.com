# Prompt de investigación — Narrativa, fluidez y empatía en el system prompt de un agente conversacional de ventas por WhatsApp

**Para:** agente investigador (Gemini Deep Research)
**De:** CreaTuActivo · Dirección
**Fecha:** 29 ago 2026
**Entregable:** un informe con recomendaciones aplicables al system prompt, con evidencia y ejemplos en español colombiano.

---

## 1. El problema que queremos resolver

Tenemos un agente conversacional (Queswa) que atiende por WhatsApp a personas que llegan por el enlace de un distribuidor y preguntan por un negocio de distribución de productos de bienestar (café y suplementos con extracto de Ganoderma, fabricados por Gano Excel) y por los productos mismos. Corre sobre Claude Sonnet 4.6 con un system prompt de ~17.000 caracteres y una base de conocimiento recuperada por búsqueda vectorial.

**Las respuestas son correctas y cumplen la ley, pero no fluyen.** Llevamos semanas corrigiendo texto por texto —cambiando una frase seca por una cálida, quitando un "regaño", agregando un acuse de recibo— y el problema reaparece en la siguiente respuesta que el modelo compone. Concluimos que **es un problema de fondo del system prompt, no de los textos**: el prompt le dice al modelo qué no hacer y qué datos dar, pero no le enseña *cómo suena una conversación que hace sentir bien a la persona*.

Ejemplos reales de lo que hoy sale (todas legales, todas correctas, todas secas):

> "Le agradezco que me pregunte, y le voy a responder con franqueza. Lo que yo manejo son alimentos y suplementos, no medicamentos. No están hechos para tratar ni para curar ninguna condición de salud, y yo no soy quién para decirle qué le conviene a usted en ese tema."

> "Buena pregunta. Para ese momento, las Cápsulas de Ganoderma son lo que más encaja. Son el extracto concentrado del hongo en su forma más directa. Frasco de 90 cápsulas y cuesta $272.500 COP. ¿Le muestro los otros suplementos de la línea?"

Y un ejemplo de lo que sí queremos, construido a mano con el Director:

> "Comprendo su objetivo, y me alegra que esté buscando opciones para cuidar su bienestar. Para orientarle con exactitud: nuestra línea está catalogada ante el INVIMA como alimentos y suplementos dietarios, no como tratamientos médicos. Su enfoque es la nutrición y el bienestar diario. Dicho esto, el compañero ideal para cualquier rutina saludable es el Ganocafé Clásico: un café negro premium, sin azúcar ni crema, que le brinda energía pareja para su día. ¿Le cuento cómo integrarlo en su rutina?"

Lo que distingue el segundo del primero **no es el contenido** (dicen lo mismo): es el orden, las bisagras (*para orientarle con exactitud*, *dicho esto*), el acuse que valida sin repetir, y que la limitación se presenta como un hecho y no como una regla nuestra.

## 2. Lo que queremos de la investigación

Necesitamos saber, con evidencia, **qué instrucciones de system prompt producen de manera consistente respuestas fluidas, cálidas y con autoridad** en un LLM de la familia Claude, y cómo redactarlas. No queremos opiniones de estilo: queremos técnicas con respaldo (papers, documentación oficial de Anthropic/OpenAI/Google sobre prompting, estudios de lingüística del discurso, psicología de la comunicación, guías de UX conversacional de empresas de referencia) y con ejemplos verificables.

Preguntas concretas:

1. **Instrucciones de tono que funcionan en LLMs.** ¿Qué formas de instruir el tono (rol, ejemplos, principios, reglas, "voz de X persona") tienen evidencia de producir el efecto de forma estable a lo largo de una conversación larga, y cuáles se degradan después de pocos turnos? ¿Qué dice la documentación de Anthropic sobre esto para Claude?
2. **Instrucciones positivas vs. negativas.** Tenemos verificado en producción que una regla escrita como "nunca diga X" hace que el modelo diga X (entrainment contextual). Queremos la evidencia formal de este fenómeno, su magnitud, y las técnicas para expresar restricciones en afirmativo sin perder precisión.
3. **La estructura de una respuesta que fluye.** ¿Qué patrones de discurso —acuse de recibo, bisagra, tesis, cuerpo, cierre— están documentados como los que producen sensación de fluidez y de ser escuchado? Nos interesan especialmente: la regla *dado → nuevo* (theme/rheme), las frases puente entre la explicación y la pregunta de cierre, y cómo evitar el "eco" (repetir las palabras del usuario) sin perder el reconocimiento.
4. **Empatía sin condescendencia.** ¿Cómo se reconoce lo que hay detrás de una pregunta (miedo, prudencia, pudor) sin sonar a guion, sin decir "entiendo cómo se siente", y sin posicionarse por encima del otro? Queremos la evidencia de por qué fórmulas como "le hablo con franqueza", "tranquilo" o "no soy quién para decirle" generan reactancia en el lector hispanohablante, y qué alternativas están documentadas.
5. **Decir que no sin cerrar la puerta.** Cuando el agente no puede dar algo (una dirección, una recomendación de salud, un precio que no tiene), ¿qué estructuras de mensaje mantienen la relación y la conversación abierta? Buscar en literatura de servicio al cliente, negociación y comunicación clínica.
6. **Registro y cultura.** El público es colombiano y latinoamericano, tratado de *usted*. ¿Qué rasgos del registro cálido-formal colombiano están documentados (marcadores de cortesía, diminutivos, expresiones de acompañamiento) y cuáles deben evitarse por sonar impostados en boca de una IA?
7. **La pregunta de cierre.** Ya tenemos la regla de una sola pregunta, de una sola salida. Queremos evidencia sobre qué tipo de pregunta final mantiene a la persona en la conversación (propone un paso concreto vs. encuesta abierta), y cómo la frase inmediatamente anterior determina que la pregunta no se sienta brusca.
8. **Consistencia a lo largo de la conversación.** ¿Cómo evitar que el modelo repita la misma fórmula de acuse turno tras turno ("Claro que sí", "Buena pregunta") y que repita características ya dichas cuando la persona pide más detalle? ¿Qué instrucciones de "memoria del hilo" son eficaces?
9. **Cómo evaluar.** Proponga una rúbrica de 5-8 criterios para evaluar fluidez y empatía en una respuesta, aplicable por un revisor humano en menos de un minuto y automatizable con un LLM juez.

## 3. Restricciones que la investigación debe respetar (no son negociables)

- **Cumplimiento legal colombiano** para suplementos dietarios y mercadeo multinivel: nada de declaraciones de salud (enfermedad, adelgazamiento, órgano, mecanismo), nada de promesa de ingreso (cifra + plazo, garantía, sustitución del salario). Las técnicas de fluidez tienen que funcionar *dentro* de esa línea, no a costa de ella.
- **Una sola pregunta al cierre, de una sola salida.** Nada de "¿prefiere A o B?".
- **Tratamiento de usted.** Sin tuteo, sin signos de exclamación.
- **Las instrucciones se escriben en positivo.** Toda recomendación debe venir redactada como lo que el modelo SÍ hace.
- **Léxico de la casa:** el activo del usuario se llama *canal de distribución*; la gente de su canal son *clientes* y *distribuidores*; la recompensa se nombra por su repetición, nunca por su duración; el mecanismo se nombra, nunca el resultado.

## 4. Formato del entregable

1. **Resumen ejecutivo** (una página): las cinco palancas con más evidencia, en orden de impacto.
2. **Por cada pregunta de la sección 2:** hallazgos, evidencia (con fuente citada y verificable), y **la instrucción de system prompt propuesta, redactada en español y en positivo**, lista para pegar.
3. **Antes/después:** tome los dos ejemplos secos de la sección 1 y muestre cómo quedarían aplicando las instrucciones propuestas, sin cambiar los hechos ni cruzar las restricciones de la sección 3.
4. **Rúbrica de evaluación** (pregunta 9).
5. **Lo que NO recomienda** y por qué: técnicas populares de prompting que no tienen evidencia o que se degradan en conversaciones largas.
6. **Bibliografía** con enlaces.

Extensión orientativa: 3.000–5.000 palabras. Prioridad: evidencia sobre volumen.
