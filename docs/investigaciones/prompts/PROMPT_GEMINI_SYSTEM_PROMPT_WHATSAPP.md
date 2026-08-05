# PROMPT DE INVESTIGACIÓN — Arquitectura de system prompts para agentes de IA en WhatsApp

**Para:** agente investigador (Gemini Deep Research, o equivalente)
**Solicita:** Luis Cabrejo Parra — CreaTuActivo.com
**Fecha:** 4 de agosto de 2026

---

## 0. La pregunta que origina esto

Tenemos un agente de IA propio (**Queswa**) atendiendo prospectos en WhatsApp, con
un system prompt escrito a mano y una base de conocimiento recuperada por búsqueda
vectorial (RAG). Cada vez que el agente comete un error de contenido, la reacción
instintiva del equipo es **añadir una prohibición al system prompt**: *"NUNCA diga
X"*. El archivo lleva así meses y las prohibiciones se acumulan.

Hace un tiempo, trabajando el agente de la versión web, concluimos —sin datos
duros, por observación— que **eso no funcionaba**: que si la información estaba
bien escrita en los documentos recuperados, las instrucciones negativas en el
system prompt sobraban, y que incluso podían empeorar el resultado.

**No sabemos si esa conclusión sigue siendo válida hoy, ni si aplica igual a
WhatsApp.** Eso es lo que necesitamos que averigüe.

Tres preguntas de gobierno:

1. **¿Las instrucciones negativas funcionan?** ¿Un "nunca digas X" reduce o aumenta
   la probabilidad de que el modelo diga X?
2. **¿Dónde debe vivir cada cosa?** Qué corresponde al system prompt, qué al
   material recuperado, y qué no debería confiarse a ninguno de los dos.
3. **¿Qué cambia en WhatsApp?** ¿La arquitectura del system prompt de un agente de
   mensajería difiere de la de un chat web, y en qué?

---

## 1. Contexto técnico — para que las recomendaciones sean aplicables

- **Modelo:** Claude (Anthropic), familia Sonnet, vía API. Las conclusiones deben
  señalar cuándo son específicas de un proveedor y cuándo generales.
- **Arquitectura:** system prompt (~6–10 K caracteres) + fragmentos recuperados por
  similitud vectorial de una base de conocimiento propia + historial de la
  conversación. Hay *prompt caching* activo sobre el bloque de sistema.
- **Canal:** WhatsApp Business API. Mensajes cortos, asíncronos, sin interfaz. La
  persona escribe como le habla a un conocido, a veces por nota de voz transcrita.
- **Control determinístico:** algunos textos ya no los redacta el modelo — los dicta
  el backend palabra por palabra (bienvenida, respuestas a botones). Nos interesa
  saber **hasta dónde conviene llevar ese patrón** y dónde empieza a hacer daño.
- **Restricción de negocio:** en Colombia lo que se le ofrece a un consumidor es
  vinculante. Una cifra inventada por el modelo es un problema legal, no solo un
  error de calidad.

---

## 2. Lo que observamos en campo, por si ayuda a orientar

Dos fallos reales de esta semana, ambos de contenido:

- El agente escribió *"cuando alguien en su organización compra su producto del
  mes"*. Nadie redactó esa frase. Al revisar, encontramos que **el system prompt
  contenía una formulación muy parecida** en su sección descriptiva. El modelo no
  desobedeció: obedeció una redacción vieja.
- Ante una pregunta sobre el precio de un producto, el agente respondió el precio y
  **pivotó solo hacia el argumento comercial**, aunque la doctrina interna dice que
  las preguntas de producto se responden como asesoría, sin vender.

Nos interesa especialmente saber si el patrón que sospechamos es real: **que la
mayoría de los errores de contenido no se corrigen prohibiendo, sino arreglando la
afirmación positiva que los causó.**

---

## 3. Preguntas de investigación

### Bloque A — Instrucciones negativas frente a positivas

1. ¿Qué evidencia experimental existe sobre el cumplimiento de instrucciones
   negativas ("no hagas X", "nunca digas Y") en modelos de lenguaje grandes
   actuales? ¿Se cumplen peor que las positivas, y en qué magnitud?
2. ¿Existe un efecto de **activación por mención** — que nombrar lo prohibido lo
   haga más probable? Buscamos medición, no la intuición de "no pienses en un
   elefante rosa".
3. ¿Cambia el resultado si la prohibición se acompaña de la **alternativa correcta**
   ("no diga X; diga Y") frente a la prohibición sola?
4. ¿Hay un punto de **saturación**? Si un system prompt acumula veinte prohibiciones,
   ¿se degradan todas, se degradan las últimas, o no pasa nada?
5. ¿La posición importa? Evidencia sobre efectos de primacía y recencia, y sobre
   pérdida de atención en el medio del contexto ("lost in the middle") aplicada
   específicamente al bloque de sistema.

### Bloque B — Reparto entre system prompt y material recuperado

6. ¿Qué tipo de contenido rinde mejor en el **system prompt** y cuál en los
   **documentos recuperados**? Nos interesa el reparto entre identidad y tono,
   reglas de comportamiento, hechos del negocio, cifras y textos literales.
7. ¿Es cierto que un hecho bien redactado en el material recuperado hace innecesaria
   la regla correspondiente en el system prompt? ¿Bajo qué condiciones falla eso?
8. Cuando el system prompt y un documento recuperado **se contradicen**, ¿cuál gana?
   ¿Se puede predecir o influir en esa jerarquía?
9. ¿Qué tan fiables son las técnicas de **cita literal obligatoria** (marcar un
   bloque con etiquetas para que el modelo lo reproduzca palabra por palabra)?
   Usamos etiquetas XML para esto; queremos saber la tasa de fidelidad real y qué la
   mejora.
10. ¿Cuándo conviene **sacar el texto del modelo por completo** y dictarlo desde el
    código? ¿Qué se pierde —naturalidad, adaptación al contexto— y cómo se mide ese
    costo frente a la ganancia en fidelidad?

### Bloque C — Lo propio de WhatsApp

11. ¿En qué se diferencia el system prompt de un agente de **mensajería** del de un
    chat web? Nos interesan el manejo de la asincronía, los mensajes cortos, la falta
    de interfaz y la ausencia de contexto de página.
12. ¿Cómo se instruye eficazmente el **formato y la longitud** en un canal donde el
    mensaje largo se colapsa tras un "leer más"? ¿Instrucciones de estilo, límites
    duros, o partir la respuesta en varios mensajes desde el código?
13. ¿Cómo tratan los agentes de producción los mensajes que llegan por **nota de voz
    transcrita**? ¿Conviene que el modelo sepa que la persona habló, o es ruido?
14. ¿Qué hacen los agentes serios cuando el usuario elige una **opción de un menú
    interactivo** en vez de escribir? ¿Se trata igual que un mensaje libre?
15. ¿Cuánto de la calidad final depende del system prompt y cuánto de la
    **arquitectura alrededor** —recuperación, validación de salida, control
    determinístico? Si existe una estimación en la literatura o en informes de
    industria, la queremos.

### Bloque D — Cómo lo hacen quienes ya lo tienen en producción

16. Documente **cómo estructuran su system prompt** los agentes de mensajería en
    producción de empresas reconocidas. Nos interesan casos con detalle publicado:
    system prompts filtrados o publicados, charlas técnicas, artículos de ingeniería.
17. ¿Qué **secciones** aparecen una y otra vez, y en qué orden? ¿Hay una estructura
    convergente o cada quien inventa la suya?
18. ¿Qué **longitud** manejan? ¿Hay relación observable entre longitud y calidad, o
    entre longitud y coste?
19. ¿Cómo manejan las **restricciones legales o regulatorias** —sectores donde una
    afirmación del agente compromete a la empresa— sin llenar el prompt de negativas?
20. ¿Qué prácticas están hoy **desaconsejadas** por quienes las probaron? Nos sirve
    tanto el "esto funciona" como el "esto lo intentamos y lo quitamos".

### Bloque E — Cómo saber si vamos bien

21. ¿Cómo se **evalúa** un system prompt de forma que un cambio se pueda comparar
    con el anterior? ¿Existen prácticas asentadas de evaluación con conjuntos de
    casos, o jueces automáticos, aplicables a un equipo pequeño?
22. ¿Cuál es el **ciclo de trabajo** recomendado para editarlo sin romper lo que ya
    funcionaba? Nosotros editamos, desplegamos y probamos a mano — queremos saber
    qué hace un equipo maduro.
23. ¿Qué **señales tempranas** delatan que un system prompt se degradó, antes de que
    lo note un cliente?

---

## 4. Lo que quiero recibir

1. **Veredicto sobre las tres preguntas de gobierno**, en una página. Si nuestra
   conclusión de la versión web era correcta, dígalo; si estaba mal, dígalo también.
2. **Una recomendación de estructura** para un system prompt de agente en WhatsApp:
   qué secciones, en qué orden, con qué extensión aproximada y por qué.
3. **Criterio de reparto**: una regla práctica para decidir, ante un contenido nuevo,
   si va al system prompt, al material recuperado o al código.
4. **Qué quitaríamos hoy** de un prompt lleno de prohibiciones, y con qué se
   reemplaza cada tipo.
5. **Riesgos** de aplicar sus recomendaciones en un negocio donde una afirmación
   inventada tiene consecuencias legales.
6. **Vacíos de evidencia** — dónde no hay investigación y estaríamos apostando.

---

## 5. Estándares

- **Cite.** Papers, documentación oficial de proveedores, artículos de ingeniería de
  empresas que lo tengan en producción. Distinga siempre lo medido de lo que es
  consenso profesional sin medir, y ambos de su propia inferencia.
- **Marque la antigüedad y el modelo.** Lo que era cierto para modelos de 2023 puede
  no serlo hoy; una técnica que rinde en un proveedor puede no trasladarse.
- **Prefiera fuentes primarias** —documentación de Anthropic, OpenAI, Google;
  publicaciones revisadas— sobre blogs de agencias con incentivo comercial.
- **No adorne.** Queremos poder decidir con el documento, no inspirarnos.
- **Contradíganos si la evidencia lo pide.** Este documento existe para poner a
  prueba cómo venimos trabajando, no para respaldarlo.
