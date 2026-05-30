# **Arquitectura de Calificación Predictiva y Modelado de Intención de Compra: Un Marco Científico para la Distribución de Activos Digitales mediante Inteligencia Conversacional**

El diseño de un sistema de calificación de prospectos (lead scoring) para entornos de distribución de activos digitales y marketing multinivel (MLM) requiere una transición fundamental desde los métodos heurísticos tradicionales hacia modelos basados en la evidencia empírica y el análisis de datos masivos. En el ecosistema de CreaTuActivo, donde el chatbot Queswa actúa como el primer punto de contacto, la capacidad de discernir la probabilidad de conversión en tiempo real no es solo una ventaja operativa, sino una necesidad estructural para optimizar el retorno de la inversión y la productividad de los distribuidores. El presente reporte detalla los parámetros científicos, modelos matemáticos y señales conductuales validadas por investigaciones realizadas entre 2020 y 2025, proporcionando un marco robusto para la automatización de la calificación de prospectos.

## **Señales conductuales y el paradigma de la inteligencia conversacional en la era de la IA**

La inteligencia conversacional ha evolucionado de ser una herramienta de registro a convertirse en un sistema de orquestación estratégica del ingreso (Revenue AI). En el año 2025, el análisis de decenas de millones de interacciones comerciales ha revelado que la eficacia de un proceso de venta no reside en la mera persuasión, sino en la consistencia de los patrones de interacción.1 Para un chatbot como Queswa, el comportamiento del prospecto durante la conversación textual ofrece indicadores predictivos de alta fidelidad sobre su disposición para convertirse en un socio activo.

## **El equilibrio y la consistencia en la interacción textual**

Una de las señales más potentes para predecir el éxito de una conversión es el equilibrio entre la participación del emisor y el receptor. Investigaciones actualizadas al 2025 indican que los vendedores de alto rendimiento mantienen una relación de habla-escucha constante de aproximadamente 43% de tiempo de palabra frente a un 57% de escucha, independientemente de si el trato se cierra o se pierde.1 En un entorno de chat, esto se traduce en que el prospecto debe generar un volumen de contenido significativamente mayor al del bot si se encuentra en una fase de alta intención. Por el contrario, los prospectos que muestran oscilaciones bruscas en su nivel de participación o que requieren que el bot "empuje" la conversación con intervenciones excesivamente largas (donde el bot habla más del 60% del tiempo) tienen una probabilidad de conversión un 10% menor.1

La consistencia es el marcador de identidad de los prospectos calificados. Los datos muestran que los individuos con alta intención de compra mantienen patrones de respuesta estables en términos de tiempo de latencia y longitud de mensaje a lo largo de los diferentes hitos de la conversación. La inconsistencia —pasar de respuestas detalladas a monosílabos— sugiere que el prospecto está reaccionando a la conversación en lugar de impulsarla hacia un objetivo claro.1

## **Multi-threading y compromiso multi-stakeholder**

Aunque el marketing de red suele percibirse como un modelo de persona a persona, los datos de 2025 subrayan la importancia del "multi-threading" o la participación de múltiples contactos dentro de la esfera de decisión del prospecto. Los acuerdos que se cierran con éxito involucran, en promedio, el doble de contactos que aquellos que fracasan.1 En el contexto de activos digitales, esto puede manifestarse cuando un prospecto menciona a un socio potencial, a su cónyuge o solicita información para compartirla con un tercero. En ventas que superan los $50,000, el multi-threading aumenta las tasas de éxito en un 130%.1 Por lo tanto, Queswa debe identificar señales donde el prospecto actúe como un puente hacia otros interesados, incrementando el score de la oportunidad proporcionalmente al número de "nodos" de decisión mencionados.

## **Colaboración y el efecto del equipo de ventas**

El éxito predictivo también se correlaciona con la percepción de soporte estructural por parte de la plataforma. Los equipos de ventas para tratos ganados son un 67% más grandes que los de tratos perdidos.1 Cuando un bot como Queswa es capaz de orquestar la entrada de un especialista humano o un "líder de éxito del cliente" en el momento preciso, las tasas de cierre pueden saltar hasta un 30%.1 La disposición del prospecto a interactuar con diferentes perfiles dentro de la organización es un indicador de confianza institucional y de intención de permanencia a largo plazo.

## **Análisis lingüístico y marcadores de intención de compra en interacciones de texto**

El lenguaje utilizado en una conversación de chat no es solo un medio de transmisión de información; es una representación externa de la etapa cognitiva en la que se encuentra el comprador. El procesamiento de lenguaje natural (NLP) permite hoy desglosar las interacciones en unidades de análisis que predicen la "preparación para el servicio" (service readiness) con una precisión sin precedentes.

## **Especificidad lingüística y concreción**

Estudios recientes han demostrado que la especificidad en el lenguaje es un proxy directo de la intención de compra.2 Los consumidores revelan su nivel de madurez en el túnel de ventas a través de la precisión de sus términos. Aquellos en la parte superior del embudo (TOFU) utilizan un lenguaje abstracto y exploratorio, mientras que los que están cerca de la decisión (BOFU) emplean consultas dirigidas a objetivos específicos.3

La aplicación de modelos de lenguaje para evaluar el nivel de especificidad genera una puntuación que puede predecir la probabilidad de compra a lo largo del tiempo utilizando modelos de riesgo acelerado.2 Un prospecto que pregunta por "rendimientos porcentuales mensuales" o "métodos de retiro de criptoactivos" demuestra una concreción superior a uno que pregunta simplemente por "cómo ganar dinero".

| Característica Lingüística | Impacto en la Intención de Compra (PI) | Mecanismo de Análisis |
| :---- | :---- | :---- |
| **Uso de Verbos de Acción** | Alto (0.639 promedio) | Identificación de acciones deseadas ("comprar", "invertir"). |
| **Uso de Sustantivos Específicos** | Medio-Alto (0.459 promedio) | Identificación de objetos de interés ("cartera", "activo"). |
| **Distancia a palabras "Doradas"** | Crítico | Similitud semántica con términos como "ordenar" o "adquirir". |
| **Concreción (Escala 0-5)** | Positivo | Los términos concretos indican etapas finales del embudo. |
| **Sentimiento Positivo** | Moderado | Las expresiones de satisfacción aumentan la probabilidad. |

El análisis de redes bipartitas entre verbos y sustantivos permite mapear la intención sin necesidad de rastrear al cliente a través de múltiples interacciones, lo que es ideal para chatbots de primer contacto.3 Los verbos como "buscar" (0.7833), "encontrar" (0.8489) y "comprar" (0.8392) presentan los puntajes de intención más altos, mientras que términos abstractos como "verdad" (0.1870) o "aplicar" (0.4346) indican una etapa mucho más temprana o de baja calificación.3

## **Modelado de secuencias y dependencias temporales**

El uso de arquitecturas BERT combinadas con redes LSTM (Long Short-Term Memory) permite capturar las dinámicas secuenciales de la conversación. Estos modelos superan a los métodos estadísticos tradicionales al entender cómo evoluciona el sentimiento y la preferencia del usuario durante el diálogo.4 Una señal lingüística crítica es el cambio de polaridad: un prospecto que inicia con dudas técnicas (sentimiento neutro-negativo) y transita hacia una comprensión clara (sentimiento positivo y lenguaje concreto) tiene una probabilidad de conversión superior a aquel que se mantiene estático en su lenguaje.

Además, el análisis temporal de los patrones de comportamiento revela secuencias que indican una progresión clara hacia la evaluación. Las Redes Neuronales Convolucionales (CNN) aplicadas a secuencias de comportamiento pueden identificar combinaciones de actividades que importan más para la precisión de la predicción, como la secuencia: "Consulta de FAQ" \-\> "Descarga de Whitepaper" \-\> "Pregunta sobre comisiones de red".5

## **Modelos de Lead Scoring: De la heurística manual al aprendizaje supervisado**

La calificación de leads ha experimentado un cambio de paradigma, alejándose de las suposiciones humanas y acercándose a la inteligencia basada en datos. Mientras que los modelos tradicionales dependen de lo que el equipo de marketing *cree* que importa, los modelos predictivos descubren lo que *realmente* importa analizando miles de puntos de datos históricos.6

## **Comparativa de precisión: Modelos tradicionales vs. Aprendizaje Automático**

Los sistemas de puntuación basados en reglas (como BANT o sistemas de puntos fijos) sufren de sesgos cognitivos. Por ejemplo, los especialistas en marketing a menudo asumen que un cargo directivo es un mejor lead, cuando los datos pueden mostrar que los analistas en empresas de rápido crecimiento convierten tres veces más rápido.6 La investigación de Forrester indica que el 67% del tiempo de ventas se desperdicia en leads que nunca convierten debido a la inexactitud de la calificación tradicional.

En contraste, los modelos de aprendizaje automático modernos ofrecen precisiones que rozan la perfección en la clasificación de prospectos calificados. En un estudio de 2025 publicado en *Frontiers in Artificial Intelligence*, se evaluaron quince algoritmos de clasificación utilizando datos reales de CRM entre 2020 y 2024\. El **Gradient Boosting Classifier** surgió como el líder absoluto.7

| Modelo Evaluado | Exactitud (Accuracy) | AUC-ROC | F1 Score | Coeficiente Kappa |
| :---- | :---- | :---- | :---- | :---- |
| **Gradient Boosting Classifier** | 0.9839 | 0.9891 | 0.9338 | 0.9247 |
| **LightGBM** | 0.9835 | 0.9885 | 0.9318 | 0.9224 |
| **XGBoost** | 0.9821 | 0.9872 | 0.9252 | 0.9150 |
| **Regresión Logística** | 0.9818 | 0.9775 | 0.9248 | 0.9144 |

La superioridad del Gradient Boosting reside en su capacidad para combinar múltiples "modelos débiles" (árboles de decisión) para crear una predicción robusta que minimiza tanto los falsos positivos como los falsos negativos.7 Para CreaTuActivo, implementar este modelo significa que el chatbot no solo buscará palabras clave, sino patrones complejos de interacción que correlacionan con el éxito histórico de la plataforma.

## **Beneficios tangibles del Scoring Predictivo**

Las organizaciones que adoptan el scoring predictivo reportan mejoras sustanciales en sus métricas de negocio. Según datos de 2024 y 2025:

* Incremento del 10% al 20% en las tasas de conversión en el primer trimestre.9  
* Aumento del 30% en la productividad de ventas y reducción del 50% en el tiempo dedicado a leads no calificados.6  
* Mejora del 30% al 50% en la tasa de conversión de contacto a oportunidad.9  
* Casos de éxito documentados muestran precisiones superiores al 90% en la identificación de leads de alto potencial, permitiendo crecimientos de ingresos por representante de hasta un 77%.8

## **Psicodinámica y comportamiento del prospecto en Network Marketing**

El comportamiento de los prospectos en el sector del marketing de red y la distribución de activos digitales posee matices psicográficos que no se encuentran en el B2B tradicional. La motivación aquí suele estar ligada a la autonomía personal, la resiliencia económica y la validación social.

## **Factores motivacionales en la adhesión al MLM**

Un análisis de componentes estructurales realizado en 2025 identificó cuatro pilares fundamentales que impulsan la membresía en redes de mercadeo 11:

1. **Ingreso Mensual Percibido (EMIP):** La expectativa de ingresos adicionales es el motor primario, con un coeficiente de impacto (beta) de 0.642.  
2. **Calidad Percibida de los Productos (PQ):** Es el determinante más fuerte de la decisión de unirse (beta 0.811). En CreaTuActivo, la percepción de la robustez del activo digital es el factor crítico de conversión.  
3. **Desarrollo Personal (PD):** El deseo de adquirir nuevas habilidades y crecimiento individual (beta 0.669).  
4. **Modo Organizacional (OM):** La estructura, el liderazgo y la facilidad de entrada (beta 0.288).

La confianza juega un papel moderador esencial. El estudio demuestra que la **credibilidad** (la creencia en la honestidad de la empresa) tiene un efecto más potente que la benevolencia en la decisión de adherirse.11 Si Queswa detecta señales de desconfianza en la legitimidad de la plataforma, el score debe penalizarse drásticamente, ya que incluso una alta percepción de ingresos potenciales no compensará la falta de credibilidad.

## **El modelo de Rogers y la difusión de la innovación**

Para categorizar a los prospectos en CreaTuActivo, es útil aplicar la curva de adopción de Rogers, que divide a los usuarios según su propensión al riesgo y a la novedad.12

* **Innovadores (2.5%):** Son "tomadores de riesgo". En el chat, preguntan por la tecnología de punta, la exclusividad y son los primeros en probar nuevas funcionalidades. Su score inicial es alto por naturaleza.14  
* **Adoptantes Tempranos (13.5%):** Son "visionarios". Buscan una ventaja competitiva o estatus. Son altamente influenciables por líderes de opinión y requieren menos pruebas sociales masivas que los grupos siguientes.13  
* **Mayoría Temprana (34%):** Son "pragmáticos". Esperan a ver resultados en otros. Queswa debe identificar si el prospecto pide testimonios o pruebas de retiro de fondos, lo que indica que pertenece a este grupo.15  
* **Mayoría Tardía (34%) y Rezagados (16%):** Son escépticos. Solo se unen cuando la innovación es una necesidad o un estándar social. Su costo de adquisición es alto y su probabilidad de conversión es baja en fases de crecimiento rápido.14

| Categoría de Adopción | Característica Principal | Estrategia de Mensajería del Bot |
| :---- | :---- | :---- |
| Innovadores | Entusiasmo por el riesgo | Enfatizar novedad y tecnología. |
| Adoptantes Tempranos | Búsqueda de estatus | Enfatizar liderazgo y oportunidad exclusiva. |
| Mayoría Temprana | Necesidad de pragmatismo | Enfatizar testimonios y seguridad. |
| Mayoría Tardía | Escepticismo | Enfatizar estabilidad y adopción masiva. |

## **Identificación de señales negativas y descalificación estadística**

La eficiencia de un sistema de scoring también depende de su capacidad para el "negative scoring" o la deducción de puntos basada en comportamientos que predicen la no-conversión.16 Identificar cuándo un lead es "ruido" permite proteger la moral y el tiempo del equipo de ventas.

## **Patrones de respuesta evasivos y el "Black Hole"**

Existen señales silenciosas que indican que un prospecto ha perdido el interés o nunca lo tuvo realmente. El **sobre-acuerdo** es irónicamente una señal de alerta: cuando un prospecto dice "sí" a todo sin hacer preguntas difíciles o plantear objeciones, a menudo está buscando una salida educada de la conversación en lugar de un compromiso real.17

Otras señales negativas críticas validadas incluyen:

* **Falta de autoridad:** Frases como "tengo que preguntarle a mi jefe/pareja" actúan como bloqueadores del proceso de decisión si no se gestionan adecuadamente.18  
* **Ausencia de necesidad real:** Si el prospecto no identifica un dolor o un problema que el activo digital resuelva, la probabilidad de conversión es nula.18  
* **Evasión en el presupuesto:** Respuestas vagas como "estamos explorando opciones" cuando se trata de hablar de la inversión inicial.17  
* **Desinterés en el tiempo:** La falta de urgencia es el principal asesino de tratos. Si el prospecto afirma que el tema "no es importante ahora", las probabilidades de que se convierta en un lead "muerto" aumentan exponencialmente.19

## **El costo de la persistencia y el tiempo óptimo de abandono**

La persistencia es valiosa, pero tiene un límite estadístico. Se estima que el 90% de los leads se vuelven inactivos después de 30 días de su creación sin una interacción significativa.20 Aunque el representante promedio se rinde después de 1.3 intentos, los ganadores realizan entre 6 y 8 intentos en las primeras 48 horas.21

Sin embargo, hay momentos en los que es estadísticamente inútil seguir nutriendo a un prospecto de forma manual:

1. **Falta de respuesta total:** Tras 5 correos o mensajes de chat no contestados, la probabilidad de éxito cae a niveles cercanos al cero.22  
2. **Demandas irreales:** Prospectos que solicitan condiciones fuera de los términos de la plataforma (ej. "quiero un retorno garantizado del 100% semanal") rara vez se convierten en socios productivos.22  
3. **Ciclos de contacto fallidos:** Si se han realizado al menos dos intentos de conexión por semana durante cuatro semanas consecutivas sin respuesta, el lead debe ser movido a una campaña de nutrición pasiva o descartado.23

## **Calibración, pesos y modelos de Inteligencia Artificial Explicable (XAI)**

Asignar pesos a señales tan diversas como la demografía, el comportamiento y la lingüística requiere un enfoque matemático riguroso. El objetivo es que el score de 0 a 10 de Queswa sea interpretable y accionable.

## **Metodologías de asignación de pesos**

Existen varios métodos para determinar la importancia de cada variable en el score final:

1. **Gini Importance y Mean Decrease Accuracy (MDA):** Son métodos integrados en los algoritmos de Random Forest que miden cuánto disminuye la precisión del modelo cuando una característica se elimina o se baraja aleatoriamente.24  
2. **Valores de Shapley (SHAP):** Proporcionan una explicación "justa" de la contribución de cada variable basándose en la teoría de juegos. Los valores SHAP permiten ver, para un prospecto individual, qué factores aumentaron o disminuyeron su puntuación. Un valor SHAP positivo indica que esa característica (por ejemplo, vivir en una ciudad con alta adopción de activos) sumó puntos a la probabilidad de conversión.26

## **Requisitos de datos para la calibración**

La fiabilidad de un modelo predictivo depende de la masa crítica de datos históricos. Las organizaciones deben apuntar a:

* **Mínimo absoluto:** 40 leads calificados y 40 descalificados creados y cerrados en un periodo de tiempo determinado (ej. los últimos 3 meses) para poder entrenar un modelo básico.28  
* **Mínimo recomendado para estabilidad:** Un conjunto de datos con al menos 120 conversiones exitosas para que los modelos de Gradient Boosting alcancen precisiones superiores al 90%.8  
* **Regla de oro de dimensionalidad:** Tener al menos 10 veces más observaciones que variables (features). Si Queswa rastrea 20 señales diferentes, el dataset debe contener al menos 200 casos cerrados.29

En el caso de CreaTuActivo, si no se cuenta con este volumen histórico, se debe comenzar con un modelo de puntuación manual fundamentado en la literatura (70% peso en ajuste demográfico y 30% en comportamiento implícito) hasta alcanzar la masa crítica de datos.30

## **Gestión de la temperatura y el impacto crítico de la velocidad de respuesta**

El tiempo es la variable más implacable en la conversión digital. La "vida media" de un lead es extremadamente corta, y la degradación de la intención ocurre en cuestión de minutos.

## **La regla de los 5 minutos y el minuto de platino**

Los datos de 2024 y 2025 confirman que la velocidad de respuesta (speed-to-lead) es el factor individual con mayor impacto en la conexión.

* **Respuesta en \< 1 minuto:** Puede elevar las tasas de conversión en un 391%.31  
* **Respuesta en \< 5 minutos:** El prospecto es 21 veces más propenso a entrar en el proceso de ventas que si se responde a los 30 minutos.21  
* **El "Hour of Doom" (La Hora de la Perdición):** Después de una hora, la probabilidad de calificar a un lead cae 10 veces. Si se tarda 24 horas, las posibilidades son 60 veces menores que si se responde en la primera hora.31

| Intervalo de Respuesta | Probabilidad de Calificación (vs Baseline \>24h) |
| :---- | :---- |
| Menos de 5 minutos | 60x más probable |
| 5 a 30 minutos | 21x más probable |
| 30 a 60 minutos | 7x más probable |
| 1 a 2 horas | 0.7x más probable |
| Más de 24 horas | Baseline (Desperdicio de lead) |

## **Umbrales de segmentación y acciones recomendadas**

Para optimizar la operación de CreaTuActivo, los prospectos deben clasificarse en cubetas de temperatura basadas en su score predictivo (0-100 o escala ajustada 0-10):

1. **Frio (Score 0-4.9):** Leads en fase de descubrimiento temprano. Acción: Nutrición automatizada con contenido educativo general. No requiere atención humana inmediata.9  
2. **Tibio (Score 5.0-7.4):** Leads comprometidos que evalúan opciones. Acción: Envío de casos de estudio o guías de comparación. El equipo de ventas debe monitorizar actividad para identificar "picos" de interés.9  
3. **Caliente (Score 7.5-8.9):** Leads con alta intención. Acción: Correo o mensaje personalizado en menos de 24 horas.9  
4. **Venta Inmediata / SQL (Score 9.0-10):** Leads listos para la acción. Acción: Llamada telefónica o contacto directo en menos de 2 horas (idealmente \<5 min). Notificación inmediata vía Slack o CRM al equipo de ventas.9

## **Propuesta de arquitectura para el sistema de scoring Queswa**

Basado en la investigación detallada, se recomienda la implementación de un sistema de scoring híbrido que combine señales demográficas de ajuste con señales conductuales y lingüísticas de intención.

## **Componentes del Score (Fórmula de Cálculo)**

El score final (![][image1]) se compondrá de la suma de tres dimensiones, ajustada por la urgencia temporal:

![][image2]  
Donde los pesos sugeridos (![][image3]) respaldados por la literatura son:

1. **Fit (Ajuste ICP) \- 30%:** Evalúa quién es el prospecto.  
   * Nivel de ingresos declarado (alto peso en MLM).11  
   * Interés en desarrollo personal.11  
   * Perfil de innovador (Rogers).14  
2. **Beh (Conducta) \- 40%:** Evalúa qué hace el prospecto.  
   * Tiempo de respuesta a las preguntas del bot (\<1 min \= Max puntos).  
   * Interacción con videos de presentación (\>75% visto \= \+15 puntos).34  
   * Visitas múltiples a la página de registro/activos (+20 puntos).34  
3. **Ling (Lingüística) \- 30%:** Evalúa cómo se expresa el prospecto.  
   * Especificidad de los términos financieros utilizados (ej. "staking", "yield", "blockchain").2  
   * Sentimiento de urgencia y positivismo detectado por NLP.4  
   * Distancia semántica corta a palabras clave de compra.3

## **Plan de validación e iteración operativa**

Para asegurar que el modelo de Queswa sea dinámico y mejore con el tiempo, se propone el siguiente ciclo de vida del dato:

* **Fase 1: Auditoría de Datos (Semanas 1-2):** Limpiar el CRM de duplicados y estandarizar formatos. La precisión de la IA depende de la higiene del dato.35  
* **Fase 2: Definición de MQL/SQL (Semanas 3-4):** Alinear a los equipos de ventas y marketing sobre qué constituye un "lead calificado" para evitar que el bot envíe prospectos irrelevantes.36  
* **Fase 3: Entrenamiento del Modelo (Semanas 5-8):** Una vez recopilados 100+ casos de éxito, entrenar un Gradient Boosting Classifier para reemplazar los pesos manuales iniciales por pesos derivados estadísticamente.7  
* **Fase 4: Monitoreo de KPIs:**  
  * **Tasa de conversión por decil de puntuación:** Los leads con score \>8 deben convertir a una tasa 3.5 veces superior a los de score \<5.8  
  * **Reducción del ciclo de venta:** El objetivo es pasar de ciclos de 60-90 días a 30 días mediante la priorización efectiva.8  
  * **Precisión del modelo (AUC-ROC):** El sistema debe mantenerse por encima de 0.92 para ser considerado confiable por el equipo humano.7

El sistema de scoring predictivo para CreaTuActivo no debe ser una estructura estática, sino un organismo digital capaz de aprender de cada conversación de Queswa. Al integrar la velocidad de respuesta, la precisión lingüística y los factores motivacionales específicos del marketing de red, la plataforma podrá escalar su distribución de activos digitales con una eficiencia operativa validada por la ciencia de ventas contemporánea.

#### **Fuentes citadas**

1. The best sales insights of 2025 \- Gong, acceso: marzo 18, 2026, [https://www.gong.io/blog/the-best-sales-insights-of-2025](https://www.gong.io/blog/the-best-sales-insights-of-2025)  
2. Reading between the lines: AI and customer acquisition in professional services, acceso: marzo 18, 2026, [https://www.emerald.com/jsm/article/doi/10.1108/JSM-05-2025-0362/1315931/Reading-between-the-lines-AI-and-customer](https://www.emerald.com/jsm/article/doi/10.1108/JSM-05-2025-0362/1315931/Reading-between-the-lines-AI-and-customer)  
3. Predicting Purchase Intent: Deciphering Customer ... \- AWS, acceso: marzo 18, 2026, [https://thearf-org-unified-admin.s3.amazonaws.com/MSI\_Report\_24-145.pdf](https://thearf-org-unified-admin.s3.amazonaws.com/MSI_Report_24-145.pdf)  
4. Sentiment Analysis and Consumer Purchase Intention Prediction Based on BERT and DBLSTM \- ResearchGate, acceso: marzo 18, 2026, [https://www.researchgate.net/publication/390472679\_Sentiment\_Analysis\_and\_Consumer\_Purchase\_Intention\_Prediction\_Based\_on\_BERT\_and\_DBLSTM](https://www.researchgate.net/publication/390472679_Sentiment_Analysis_and_Consumer_Purchase_Intention_Prediction_Based_on_BERT_and_DBLSTM)  
5. How Machine Learning Predicts Buyer Intent: The Complete Guide, acceso: marzo 18, 2026, [https://www.smartlead.ai/blog/how-machine-learning-predicts-buyer-intent](https://www.smartlead.ai/blog/how-machine-learning-predicts-buyer-intent)  
6. Predictive Lead Scoring: Machine Learning Models, Propensity Analytics, and Sales-Marketing Alignment Technology | MEXC News, acceso: marzo 18, 2026, [https://www.mexc.com/news/905420](https://www.mexc.com/news/905420)  
7. The relevance of lead prioritization: a B2B lead scoring model based ..., acceso: marzo 18, 2026, [https://www.frontiersin.org/journals/artificial-intelligence/articles/10.3389/frai.2025.1554325/full](https://www.frontiersin.org/journals/artificial-intelligence/articles/10.3389/frai.2025.1554325/full)  
8. Machine Learning Lead Scoring Complete Guide (2025) \- Articsledge, acceso: marzo 18, 2026, [https://www.articsledge.com/post/machine-learning-lead-scoring](https://www.articsledge.com/post/machine-learning-lead-scoring)  
9. Predictive Lead Scoring & Funnel Stages: How AI Improves Sales ..., acceso: marzo 18, 2026, [https://sales-mind.ai/blog/predictive-scoring-funnel-stages](https://sales-mind.ai/blog/predictive-scoring-funnel-stages)  
10. New Gong Labs Research Finds AI Is Now a Trusted Decision-Maker in Revenue Teams, acceso: marzo 18, 2026, [https://www.gong.io/press/new-gong-labs-research-finds-ai-is-now-a-trusted-decision-maker-in-revenue-teams](https://www.gong.io/press/new-gong-labs-research-finds-ai-is-now-a-trusted-decision-maker-in-revenue-teams)  
11. Motivational Factors to Multi-Level Marketing: The Moderating Role ..., acceso: marzo 18, 2026, [https://www.scirp.org/journal/paperinformation?paperid=141682](https://www.scirp.org/journal/paperinformation?paperid=141682)  
12. Reading: Diffusion of Innovation | Principles of Marketing \- Lumen Learning, acceso: marzo 18, 2026, [https://courses.lumenlearning.com/clinton-marketing/chapter/reading-diffusion-of-innovation/](https://courses.lumenlearning.com/clinton-marketing/chapter/reading-diffusion-of-innovation/)  
13. The Rogers Curve: a guide to the diffusion of innovation in the marketplace \- B-PlanNow, acceso: marzo 18, 2026, [https://b-plannow.com/en/the-rogers-curve-a-guide-to-the-diffusion-of-innovation-in-the-marketplace/](https://b-plannow.com/en/the-rogers-curve-a-guide-to-the-diffusion-of-innovation-in-the-marketplace/)  
14. IB:DP:DT \- 5.6 Rogers' characteristics of innovation and consumers \- Google Drive: Sign-in, acceso: marzo 18, 2026, [https://sites.google.com/gapps.uwcsea.edu.sg/ib-dp-dt/topic-5/5-6-rogers-characteristics-of-innovation-and-consumers](https://sites.google.com/gapps.uwcsea.edu.sg/ib-dp-dt/topic-5/5-6-rogers-characteristics-of-innovation-and-consumers)  
15. Diffusion of Innovation Theory | Canadian Journal of Nursing Informatics, acceso: marzo 18, 2026, [https://cjni.net/journal/?p=1444](https://cjni.net/journal/?p=1444)  
16. The secret to better lead scoring models | Turtl, acceso: marzo 18, 2026, [https://turtl.co/blog/lead-scoring-models/](https://turtl.co/blog/lead-scoring-models/)  
17. Silent Signals: What Your Prospects Aren't Saying \- Vendux, acceso: marzo 18, 2026, [https://www.vendux.org/blog/silent-signals-what-your-prospects-arent-saying](https://www.vendux.org/blog/silent-signals-what-your-prospects-arent-saying)  
18. 5 Signs to Identify Disqualified Leads \- Peasy AI, acceso: marzo 18, 2026, [https://peasy.ai/mid\_5\_signs\_to\_identify\_disqualified\_leads/](https://peasy.ai/mid_5_signs_to_identify_disqualified_leads/)  
19. Objection Handling: 44 Common Sales Objections & How to Respond \- HubSpot Blog, acceso: marzo 18, 2026, [https://blog.hubspot.com/sales/handling-common-sales-objections](https://blog.hubspot.com/sales/handling-common-sales-objections)  
20. Key Lead Response Time Statistics \- Leadport, acceso: marzo 18, 2026, [https://www.leadport.app/en/blog/key-lead-response-time-statistics/](https://www.leadport.app/en/blog/key-lead-response-time-statistics/)  
21. Lead Response Time: The 5-Minute Rule That Transforms Conversion \- Rework, acceso: marzo 18, 2026, [https://resources.rework.com/libraries/lead-management/lead-response-time](https://resources.rework.com/libraries/lead-management/lead-response-time)  
22. When Should You Stop Pursuing A Sales Lead? | Straight North, acceso: marzo 18, 2026, [https://www.straightnorth.com/blog/when-should-you-stop-pursuing-sales-lead/](https://www.straightnorth.com/blog/when-should-you-stop-pursuing-sales-lead/)  
23. Cold Leads: When to Cut and Run | Pipedrive, acceso: marzo 18, 2026, [https://www.pipedrive.com/en/blog/cold-leads-when-to-give-up](https://www.pipedrive.com/en/blog/cold-leads-when-to-give-up)  
24. Feature Importance with Random Forests \- GeeksforGeeks, acceso: marzo 18, 2026, [https://www.geeksforgeeks.org/machine-learning/feature-importance-with-random-forests/](https://www.geeksforgeeks.org/machine-learning/feature-importance-with-random-forests/)  
25. ShapG: new feature importance method based on the Shapley value \- arXiv.org, acceso: marzo 18, 2026, [https://arxiv.org/html/2407.00506v2](https://arxiv.org/html/2407.00506v2)  
26. Practical guide to SHAP analysis: Explaining supervised machine learning model predictions in drug development \- PMC, acceso: marzo 18, 2026, [https://pmc.ncbi.nlm.nih.gov/articles/PMC11513550/](https://pmc.ncbi.nlm.nih.gov/articles/PMC11513550/)  
27. From Abstract to Actionable: Pairwise Shapley Values for Explainable AI \- arXiv.org, acceso: marzo 18, 2026, [https://arxiv.org/html/2502.12525v1](https://arxiv.org/html/2502.12525v1)  
28. Configure predictive lead scoring | Microsoft Learn, acceso: marzo 18, 2026, [https://learn.microsoft.com/en-us/dynamics365/sales/configure-predictive-lead-scoring](https://learn.microsoft.com/en-us/dynamics365/sales/configure-predictive-lead-scoring)  
29. How Much Data is Needed to Train a (Good) Model? | DataRobot Blog, acceso: marzo 18, 2026, [https://www.datarobot.com/blog/how-much-data-is-needed-to-train-a-good-model/](https://www.datarobot.com/blog/how-much-data-is-needed-to-train-a-good-model/)  
30. Ultimate Guide to Demographic Lead Scoring Models \- LeadBoxer, acceso: marzo 18, 2026, [https://www.leadboxer.com/learn/ultimate-guide-to-demographic-lead-scoring-models](https://www.leadboxer.com/learn/ultimate-guide-to-demographic-lead-scoring-models)  
31. Speed to Lead Response Time Statistics That Drive Conversions \- Kixie, acceso: marzo 18, 2026, [https://www.kixie.com/sales-blog/speed-to-lead-response-time-statistics-that-drive-conversions/](https://www.kixie.com/sales-blog/speed-to-lead-response-time-statistics-that-drive-conversions/)  
32. The Ultimate Conversion Booster: A 1-Minute Response Time Can Lead to 391% More ... \- Rogue Digital, acceso: marzo 18, 2026, [https://www.roguedigital.ai/insights/blog/response-time-conversions](https://www.roguedigital.ai/insights/blog/response-time-conversions)  
33. 25 Eye-Opening Speed to Lead Statistics: Why Response Time Matters | Verse.ai, acceso: marzo 18, 2026, [https://verse.ai/blog/speed-to-lead-statistics](https://verse.ai/blog/speed-to-lead-statistics)  
34. Network Marketing Lead Generation System: Automated MLM ..., acceso: marzo 18, 2026, [https://www.hybridmlm.io/blogs/the-ultimate-network-marketing-lead-generation-system/](https://www.hybridmlm.io/blogs/the-ultimate-network-marketing-lead-generation-system/)  
35. AI-Driven Lead Scoring: The Strategy Reshaping Sales in 2025 \- Clearout, acceso: marzo 18, 2026, [https://clearout.io/blog/ai-driven-lead-scoring/](https://clearout.io/blog/ai-driven-lead-scoring/)  
36. AI Lead Scoring: What Is It & How To Do It Right \[2026\] \- Warmly, acceso: marzo 18, 2026, [https://www.warmly.ai/p/blog/ai-lead-scoring](https://www.warmly.ai/p/blog/ai-lead-scoring)

[image1]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAAYCAYAAAAh8HdUAAAAqklEQVR4XmNgGLJADYhnArEvklgJEhsFsALxPyCeDcR8QGwHxP+BuAaIPyOpQwEgBTboggwQ8Sp0QRBYwACRxAZA4iBXYACQBD5NWAFMUy+6BD7QzYDQCMMzUFTgAHkMmBpvoaggAFwY8PuTIRhdAAoWM+DQ5AfEBeiCUFDKgEPTWSBehy4IBX8ZcAQGzN08aOJrGfAknSdAzATEHxggmt9D6QVIakbBwAEAIrItoSGpzDcAAAAASUVORK5CYII=>

[image2]: <data:image/png;base64,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1blYf4CV70qQyiTOeWHO4e5hG+4F70h5QzHWUEqWvDkPjyGsYqHn6xPaXnjN55kGuK/XDB6Wvh89YzoPEfEcY0EM8dpn6gu2dr5grHkeGuB91easQP3tc7BFXVz4krHoJV9neuNM3kdxGx6upHQddTxIwHxYXyos25oDSd+cdMS97KPFeN9QeD8sqc/Xoa/d2LByT3i98NDM6SOcbKu/SXqEdc8L7Mh2t/muwTz7Yt79+8TfzcoZFkMcb2WpeJe4PSuLuB+k4NzkVNhYubGaipFPbTQ/L5bxH5VijBj5XDg6KDF9m8+F7psFI0XRl2I4N9CD7/qOg1/sT7U/eSLzzV7SFeQodwbk9PfNwQly+mQq0jC1Ly3OK36Y/d/ca3wZ0zFvssXW9jj5N3NCMV21s9rLZv9GO/pGCWOwimm9Ohcc1xZbnW7yv/Xc9mde2OL1vtIs3zdkLGQd8cRerxvC1X4/y2O3hdfk/lgnfViI7ch4QPalrRaldn3mdQcr/wPst1L8JCvpFh6YPi9wiK2ef2K1HnneeR+KOwI6U31fwl0EOnZDqeBZsEqReQz/0jDoKJweXpP2iQ8+UninhdfMl5FSPtjW716WhC94sYT23LZn+3Ps3MDOZqPc4ExKz/udBlkfJ1gZjW0EfIFv1i/eLgIPnnlGZDLRdWzcf2kyBY3i/ta/rHdnRS98I2H10a45KEtX+8/0loUFDRsJbQyrp8CIpG/SXTYBUgu6iCKynshosDRYRERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERETWy/8Bjzt8DnN/ItkAAAAASUVORK5CYII=>

[image3]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAYCAYAAAAVibZIAAAA+klEQVR4Xu2SMetBYRTGT7EaWJAPwIcgi8liN6AsJotPoP7FqnwEBhl9BqMyyGCRMlooEuF/jvfcOh3v9Vpkub964n1+PbfrXgAB3yCE2WMeIjt2GcxRuRU7YqtcWbgnJxY2vJGNBqalS485+A/fXfSqC8kYzDCp+grmzk7Tx8R0KemAGeZUf8ZM2YWVW6rzC3Uww5rohpgIZsAuLdxCfPclD2b4J7oZf7bZFfkcBfPTnaTADEd83ghXZdfk80U4JzSku0tguqLPsuthCpiScE5oeMDcVE//CHITi3NCQwrdjcZzcS1c0MjveZFb6/ITaEhv1ga5gIBf8A/vQUX4wN6bNQAAAABJRU5ErkJggg==>