# La brecha narrativa, medida — por qué las respuestas de Gemini fluyen y las nuestras no

**29 ago 2026 · investigación propia, sobre corpus real**
Complementa [NARRATIVA_Y_FLUIDEZ.md](../../handoff/negocio/NARRATIVA_Y_FLUIDEZ.md), que trata la **frase**. Esto trata el **mensaje completo**.

---

## 0. Por qué esta investigación y no una revisión bibliográfica

Gemini está haciendo la revisión de literatura ([el prompt](../prompts/PROMPT_INVESTIGACION_NARRATIVA_FLUIDEZ_SYSTEM_PROMPT_AGO2026.md)). Lo que nosotros tenemos y ningún investigador externo tiene es **el corpus**: 110 respuestas reales que el modelo compuso en el canal en 45 días, y cinco textos que Gemini propuso en la misma conversación, sobre los mismos temas. Se pueden contrastar máquina contra máquina, sobre la misma tarea.

El Director lo planteó así: *«me la he pasado con todos los agentes haciendo ajustes de narrativa»* — corrigiendo texto por texto, y el problema reaparece en la siguiente respuesta compuesta. Eso es la firma de una causa estructural, no de una serie de descuidos. Esta medición la busca.

**Método.** Se extrajeron de `nexus_conversations` todas las respuestas del asistente en el tenant `whatsapp` de los últimos 45 días, filtrando las dictadas por el backend (que las escribimos nosotros y no dicen nada del modelo) y las de menos de 180 caracteres. Quedan **110 respuestas compuestas · 653 frases · 10.636 palabras**. Contra ellas, los **5 textos de Gemini** de la conversación del 29 ago (474 palabras).

---

## 1. Las dos hipótesis que la medición mata

Veníamos persiguiendo dos explicaciones. Las dos son falsas.

| | Queswa | Gemini |
|---|---|---|
| **Largo medio de frase** | 16,3 palabras | 16,9 palabras |
| **Negaciones por 100 palabras** | 2,45 | 2,74 |

**No es el estilo telegrama.** Nuestras frases miden lo mismo que las de Gemini. La sensación de sequedad no viene del largo de la frase, así que *«escriba frases más largas»* no habría arreglado nada.

**No son las negaciones.** Gemini niega **más** que nosotros, y sus textos fluyen. La negación cuesta cuando introduce un fantasma (ver NARRATIVA_Y_FLUIDEZ §4), pero no es lo que separa un texto fluido de uno seco.

⚠️ Registrar esto importa: las dos son las correcciones que cualquiera propone primero, y las dos habrían consumido semanas sin mover el resultado.

---

## 2. Las tres diferencias reales

| | Queswa | Gemini | Brecha |
|---|---|---|---|
| **Frases que abren con bisagra** | 2,3 % | 21,4 % | **×9,3** |
| **Orientación al lector** por 100 palabras | 0,27 | 1,90 | **×7,0** |
| **Glosas** («esto significa», «lo que le permite») por 100 palabras | 0,08 | 0,42 | **×5,6** |

### 2.1 La bisagra — el hallazgo principal

Una de cada cinco frases de Gemini empieza con una palabra que **anuncia qué tipo de paso viene**: *Dicho esto* · *Sin embargo* · *Por eso* · *Esto significa que* · *En ese caso* · *Lo que sí hacen es* · *Para serle transparente*. En nuestras respuestas: una de cada cuarenta y tres.

La bisagra no agrega información. Hace algo más barato y más poderoso: **le dice al lector si lo que viene confirma, corrige, matiza o concluye lo anterior.** Sin ella, tres datos correctos son tres datos; con ella, son un razonamiento. Es la diferencia entre una ficha técnica y alguien explicándole algo.

### 2.2 La traducción al lector

Gemini dice *«le brinda energía pareja»*, *«lo que le cubre tres meses de uso»*, *«encaja perfecto en su rutina»*. Nosotros decimos *«frasco de 90 cápsulas»*, *«caja de 30 sobres»*, *«$272.500 COP»*. Los dos entregan el mismo dato; uno lo deja en la mesa y el otro lo pone en las manos de quien lee.

Siete veces más frecuente en Gemini. Es la brecha más grande después de la bisagra, y es la que produce la sensación de *estar hablando con alguien que está de mi lado* en vez de *consultar un catálogo*.

### 2.3 La glosa

*«Viene en un frasco de 90 cápsulas, lo que le cubre tres meses de uso tomando una diaria.»* La segunda mitad no es un dato nuevo: es el primero, traducido. Gemini glosa cinco veces y media más que nosotros.

---

## 3. La causa está en nuestro prompt, y es demostrable

Segunda medición, sobre las mismas 110 respuestas:

```
Abren con fórmula de acuse de recibo:        51 %
Tienen al menos UNA bisagra interna:         13 %
Bisagras sobre el total de frases internas:  2,7 %  (15/546)
Construyen un puente antes de la pregunta:   12 %  (12/104)
```

El contraste es la prueba. **El 51 % abre con acuse de recibo porque el prompt lo ordena y le da una lista de fórmulas** (*Con gusto · Claro que sí · Buena pregunta…*). **El 13 % tiene bisagras internas porque el prompt no las menciona.**

Nuestro prompt instrumentó **la primera frase** (el acuse) y **la última** (una sola pregunta, de una sola salida). Todo lo que va en medio —que es el mensaje— quedó sin arquitectura. El modelo lo rellena con datos correctos en el orden en que los encuentra.

Y hay una instrucción que empuja activamente hacia la sequedad:

> `Máximo tres párrafos, y cada párrafo de máximo dos oraciones.`

Medido: **1,5 frases por párrafo en 4,1 párrafos**. El modelo obedece, y el resultado es un mensaje partido en bloques de frase y media. La regla nació para que WhatsApp no reciba paredes de texto —objetivo correcto—, pero corta el mensaje justo donde iría la bisagra.

⚠️ **Honestidad sobre una cifra:** el «1,0 párrafos por mensaje» de Gemini es un artefacto — los textos se pegaron al corpus como bloque único. No sirve para comparar. La cifra nuestra (1,5 frases por párrafo) sí es real y es la que importa.

---

## 4. Lo mejor de los dos mundos, y dónde está el peligro

La tentación es copiar los tres recursos de Gemini y ya. **En nuestro dominio, dos de ellos son exactamente por donde se cruza la línea legal.**

La glosa y la traducción al lector son dispositivos que responden a *«¿y eso qué me da a mí?»*. En un producto regulado, la respuesta honesta a esa pregunta es casi siempre una declaración de salud o una promesa de ingreso. Los propios textos de Gemini lo demuestran: de sus cinco propuestas, **tres las bloquea nuestro filtro de salida** — y las bloquea justo en la glosa (*«apoya su metabolismo»*, *«sin alterar su dieta»*, *«sin descuidar sus niveles»*). Su fluidez y su incumplimiento salen del mismo recurso.

De ahí la síntesis, que es la contribución propia de esta investigación:

> **Se glosa el HECHO y el MECANISMO. Nunca el RESULTADO.**
>
> *«La caja trae 30 sobres — un mes completo»* es glosa de un hecho: verificable, y el lector saca su conclusión.
> *«Se liquida cada viernes, así que ve el resultado en la misma semana»* es glosa de un mecanismo: describe cómo funciona el sistema.
> *«Apoya su metabolismo»* es glosa de un resultado: promete algo que ocurre dentro del cuerpo o del bolsillo de alguien.

Es la regla del mecanismo (CLAUDE.md, 19 ago) aplicada al plano de la frase. Con ella, la arquitectura de Gemini funciona entera dentro de nuestra línea: **la bisagra no tiene riesgo ninguno**, y es la brecha más grande.

---

## 5. La sección propuesta para el system prompt

Escrita en positivo, como manda la casa. Va después de `<trato>`, que dice *qué debe sentir* la persona; esta dice *cómo se construye* el mensaje que lo produce.

```
<narrativa>
Un mensaje suyo se lee como una sola idea que avanza, no como datos apilados.

1. RECONOZCA. La primera frase recoge lo que hay detrás de la pregunta, y
   cambia en cada turno. Hecho eso, entre al asunto.

2. ENLACE. Cada frase que trae algo nuevo se engancha a la anterior con una
   bisagra que dice qué tipo de paso viene: «Para orientarle con exactitud» ·
   «Dicho esto» · «Por eso» · «Lo que sí» · «Y ahí es donde» · «En ese caso» ·
   «Esto significa que». La bisagra es lo que convierte tres datos en un
   razonamiento, y es la diferencia entre una ficha técnica y alguien
   explicándole algo a otro.

3. TRADUZCA. Un dato se entrega y enseguida se dice qué es para quien lee: «la
   caja trae 30 sobres — un mes completo»; «se liquida cada viernes, así que lo
   ve en la misma semana». El hecho primero, su sentido después.
   ⚠️ Se traduce lo que el producto ES y lo que el sistema HACE. Sobre lo que
   una persona va a sentir o a conseguir, entregue el hecho y deje que ella
   saque la conclusión: ahí su trabajo es la precisión, y la conclusión es de
   ella.

Antes de la pregunta final, una frase que cierre lo dicho y abra lo que sigue.
La pregunta nace de esa frase, no del último dato.

Agrupe en un mismo párrafo las frases que son la misma idea —normalmente dos o
tres—, y deje máximo cuatro párrafos.
</narrativa>
```

Y el reemplazo en `<channel_formatting>`:

> `Máximo tres párrafos, y cada párrafo de máximo dos oraciones.`
> **→** `Máximo cuatro párrafos. Cada párrafo agrupa las frases que son la misma idea.`

---

## 6. Cómo se comprueba que sirvió

Las tres métricas de la sección 2 son la rúbrica, y se miden sobre producción con el mismo script. Metas, a partir de las cifras de hoy:

| | hoy | meta |
|---|---|---|
| Frases que abren con bisagra | 2,3 % | ≥ 12 % |
| Respuestas con al menos una bisagra interna | 13 % | ≥ 60 % |
| Puente antes de la pregunta de cierre | 12 % | ≥ 50 % |
| Orientación al lector / 100 palabras | 0,27 | ≥ 1,0 |

⚠️ Y una que debe quedarse quieta: **el filtro de salud y el de negocio no pueden bloquear ni una respuesta más que hoy.** Si la fluidez sube y los bloqueos suben con ella, la glosa se fue al resultado y la instrucción hay que acotarla.

---

## 7. Lo que esta investigación NO dice

- No dice que los textos de Gemini sean mejores que los nuestros. Tres de cinco no pueden salir al canal. Dice que su **arquitectura** es mejor y que es adoptable sin su contenido.
- No dice que el prompt sea malo. Su arquitectura de comportamiento —FSM, léxico, cumplimiento, pregunta única— es la que ha sostenido el canal. Dice que le falta la capa del **discurso**, entre la primera frase y la última.
- No mide si esto convierte más. Mide fluidez, que es una condición, no una garantía.
