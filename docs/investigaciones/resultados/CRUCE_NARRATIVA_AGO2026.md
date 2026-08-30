# Cruce: narrativa y fluidez — qué se tomó de cada investigación y qué se rechazó

**29 ago 2026 · este es el documento que se lee.** Los otros dos son el respaldo.

| | qué es | dónde |
|---|---|---|
| **Encargo** | el brief que se le mandó a Gemini | [prompts/PROMPT_INVESTIGACION_NARRATIVA_FLUIDEZ_SYSTEM_PROMPT_AGO2026.md](../prompts/PROMPT_INVESTIGACION_NARRATIVA_FLUIDEZ_SYSTEM_PROMPT_AGO2026.md) |
| **Informe de Gemini** | revisión de literatura, 9 preguntas, 4.500 palabras | [Optimización Prompt Agente WhatsApp Colombia.md](Optimización%20Prompt%20Agente%20WhatsApp%20Colombia.md) |
| **Medición propia** | 110 respuestas reales contra 5 textos de Gemini | [BRECHA_NARRATIVA_MEDIDA_AGO2026.md](BRECHA_NARRATIVA_MEDIDA_AGO2026.md) |

⚠️ **Si usted abre el informe de Gemini y encuentra bloques XML listos para pegar: tres de ellos rompen la norma INVIMA.** Están señalados abajo. No los pegue.

---

## 1. Lo que las dos investigaciones dicen igual, por caminos distintos

Yo medí sobre el corpus; Gemini revisó literatura. Convergen en cuatro puntos, y esa convergencia es la razón por la que se aplicaron:

| Hallazgo | Mi medición | Gemini |
|---|---|---|
| El mensaje se seca por falta de **conectores internos**, no por frases cortas | bisagras 2,3 % vs 21,4 % (×9,3) | progresión temática lineal (Lingüística Sistémico-Funcional); nombra el patrón de falla *«tema constante: repetir un concepto base y arrojar listas»* |
| La **pregunta final** debe nacer de la última frase | puente 12 % | la pregunta fluye del Rema, no introduce tema nuevo |
| *«Le hablo con franqueza»* levanta una barrera | observación del Director | **reactancia psicológica** (Brehm, 1966): el discurso controlador activa defensa |
| La calidez no se imita | doctrina de la casa | *uncanny valley*: simular rasgos humanos baja la confianza cuando se sabe que es un bot |

---

## 2. Lo que se aplicó

**En el system prompt (`queswa_whatsapp` v4.25), sección `<narrativa>`:** los tres movimientos de mi medición (reconocer · enlazar · traducir) más las cuatro mecánicas que salieron de contrastar mi redacción con la de Gemini —cerrar la frase en lo que sí hay, subordinar para traducir el dato, poner de sujeto a la persona, y la raya como subordinada sin hacer—. Y se retiró `Máximo tres párrafos, y cada párrafo de máximo dos oraciones`, que producía 1,5 frases por párrafo y cortaba justo donde iba la bisagra.

**En el guardarraíl de salud:** dos patrones nuevos, con backtest de 0 falsos positivos sobre 128 respuestas reales y 203 cuerpos del arsenal — *prevención/preventivo* y *base/respaldo científico*. Ninguno de los dos existía, y los destapó el propio informe de Gemini al proponerlos como copy.

**En los doce textos dictados:** rayas de 6 a 0, cierres en la negación de 4 a 0, subordinadas que traducen de 3 a 14.

**En `scripts/medir-narrativa.mts`:** la rúbrica corriendo sobre producción, con la línea base del 29 ago (2,3 % · 13 % · 12 % · 0,27) y sus metas.

---

## 3. Lo que se rechazó, y por qué

### 3.1 Tres bloques del informe rompen la norma

| Bloque | Frase | Problema |
|---|---|---|
| §2.2 `<marco_regulatorio_ontologico>` | *«apoyo nutricional **preventivo**»* | prevenir enfermedad es declaración terapéutica, reservada a medicamentos |
| §2.5 `<pivote_constructivo>` | *«los **beneficios preventivos** de la nutrición diaria»* | lo mismo |
| §2.1 `<rol_y_tono>` | *«conecte la **base científica** del extracto»* | la evidencia es un hecho verificable (registro, certificación), nunca un adjetivo de credibilidad |
| §3 Escenario 1 | *«Su principal propósito es apoyar el **equilibrio preventivo del organismo**»* | la respuesta estrella del informe, y la infracción más clara |
| §2.9 rúbrica, criterio 3 | *«centra los **beneficios preventivos** en la nutrición»* | **la rúbrica premia la infracción**: adoptarla sería puntuar como éxito lo que cuesta una sanción |

**El patrón:** la fluidez de Gemini y su incumplimiento salen del mismo dispositivo. La glosa responde *«¿y eso qué me da a mí?»*, y en producto regulado la respuesta honesta a esa pregunta casi siempre cruza la línea.

**La síntesis que sí se aplicó:** se traduce el **HECHO** y el **MECANISMO**, nunca el **RESULTADO**. *«La caja trae 30 sobres, lo que le alcanza para el mes»* es hecho. *«Se liquida cada viernes, así que lo ve en la misma semana»* es mecanismo. *«Apoya su metabolismo»* es resultado. Con esa acotación, la arquitectura de Gemini entra entera dentro de la línea — y la bisagra, que es la brecha mayor, no tiene riesgo ninguno.

### 3.2 Lo que el backtest tumbó de mi propia propuesta

Yo propuse tres huecos en el filtro; el dato respaldó dos. **Bloquear *«equilibrio del cuerpo»* habría bloqueado copy aprobado**: vive en dos fragmentos del arsenal junto a *«apoyan el sistema inmune»*, que es vocabulario verde verificado. El elemento riesgoso de la frase de Gemini era *preventivo*, no *equilibrio*. Queda registrado para que nadie lo vuelva a proponer sin medir.

### 3.3 Dos recomendaciones del informe que no aplican a nuestro caso

- **§4.1 «estructure el prompt con etiquetas XML».** Ya lo está —`<role_and_objective>`, `<core_behavior>`, `<constraint_framework>`, `<channel_formatting>`, `<trato>`, `<narrativa>`—. Gemini lo supuso plano porque el encargo dijo *«17.000 caracteres»* sin aclararlo; error de quien redactó el brief.
- **§4.4 «elimine todas las listas de restricciones negativas».** Dirección correcta para el **estilo**, y ya se venía aplicando. Pero nuestras reglas legales no viven en el prompt: viven en `wa-guardarrail-salud.ts` y `wa-guardarrail-negocio.ts`, que son código determinístico y no dependen de que el modelo obedezca. Por eso podemos aflojar el prompt hacia lo positivo sin quedar desprotegidos — siempre que el filtro esté sano, que es justo lo que §3.1 puso en duda.

---

## 4. Lo que hay que medir ahora

`npx tsx scripts/medir-narrativa.mts` sobre producción, después de que corra tráfico con el prompt v4.25.

| | línea base (29 ago) | meta |
|---|---|---|
| Frases que abren con bisagra | 2,3 % | ≥ 12 % |
| Respuestas con bisagra interna | 13 % | ≥ 60 % |
| Puente antes de la pregunta de cierre | 12 % | ≥ 50 % |
| Orientación al lector / 100 palabras | 0,27 | ≥ 1,0 |

⚠️ Y la que debe quedarse quieta: **los bloqueos del guardarraíl no pueden subir.** Si la fluidez sube y los bloqueos suben con ella, la glosa se fue al resultado y hay que acotar la instrucción del punto 3 de `<narrativa>`.
