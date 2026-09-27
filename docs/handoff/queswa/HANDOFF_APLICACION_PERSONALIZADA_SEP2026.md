# Traspaso: el tercer elemento es su aplicación personalizada (27 sep 2026)

**Para:** el agente Claude Code de creatuactivo.com. **Escribe:** el agente del Dashboard, con el Director.
**Reparto decidido por el Director:** el Dashboard hizo los arsenales y hace el video «Cómo funciona»; **este repo hace las páginas (servilleta · pitch deck · home) y el system prompt.**

## Qué cambió y por qué (ya desplegado — no lo rehaga)

En la sesión del guion del video «Cómo funciona» a 60 segundos, el Director elevó el tercer elemento de `WHY_02`: **los tres elementos responden qué RECIBE la persona, y las dos acciones responden qué HACE**. Sus palabras: *«aquí no le está volviendo el valor a lo construido, y cualquier persona que quiera montar una empresa quiere una aplicación»*. El tercer elemento pasó de «dos pasos sencillos» a **su aplicación personalizada**, con la imagen de Waze dicha en MECANISMO.

Desplegado por el Dashboard el 27 sep (verificado en los tres tenants, 180/180/189 fragmentos):

- **`WHY_02` v6.52** 🔒 — arranque nuevo (*usted recibe en una sola aplicación los tres elementos que eliminan la fricción de montar un negocio moderno de distribución*), el enlace sube al elemento 2 (*yo atiendo, las 24 horas, a quien llega por su enlace*), el tercer elemento es *su aplicación personalizada: como en Waze, usted me dice a dónde quiere llegar, y yo le voy marcando la ruta*. Pregunta de cierre intacta.
- **`WHY_APP_01` v6.53** 🔒 — nace la respuesta que el video estrena (*«¿Qué es la aplicación personalizada?»*): el Centro de Mando en mecanismo (marca la ruta · redacta · avisa), cierra hacia `EAM_01`. Índice medido: gana sus 6 paráfrasis, no le roba a WHY_02/WHY_01/EAM_01/FREQ_14/EMPRESA_DIGITAL_01.
- **`respuestas-maestras.ts`** sincronizado carácter por carácter y **firma `como_funciona` de `queswa-bitacora.ts`** ampliada (conserva las viejas). Detalle: `knowledge_base/CHANGELOG-arsenales.md` v6.52–v6.53.
- **`lexico-canonico.json`** subió a `2026-09-27`: fila nueva **`tener-con-que`** (🛑 PROHIBIDO por el Director: *«no tiene con qué»* en Colombia se oye como que no tiene dinero, capacidad ni valentía — lo que falta se dice de la OPERACIÓN: *muy pocos tienen la infraestructura para…*) y la excepción rota de `recompra-por-agotamiento` corregida (`[Índice]` sin escapar eximía casi cualquier línea).

## Las reglas que acotan todo lo que usted va a escribir

1. **Waze va en MECANISMO, nunca en resultado.** *Le marca la ruta* ✅ · *lo lleva a donde quiere estar* ⛔ (voz de coach, ya vetada en el pitch deck el 24 sep; y prometer la llegada es la silueta de la promesa de ingreso). Es cierto hoy: en queswa.app el socio escribe sus referencias y Queswa lo guía con ellas.
2. **Las dos acciones NO desaparecen.** Responden qué hace la persona y viven en `EAM_01`, en la línea de `WHY_01` (*Usted comparte un enlace. Yo converso con quien llega. Usted recibe.*) y en el «1 Comparte · 2 Recibe» del Dashboard. Lo que cambia es dónde se listan como **entregable**.
3. **«Moderno» una vez por conversación/pieza, pagado en la misma frase con hechos**, sin otro adjetivo de novedad y **sin nombrar el modelo viejo al lado** (nombrarlo deshace la ventaja que la palabra compra). Doctrina completa: bloque ⭐ del 25 sep en CLAUDE.md § Léxico y voz.
4. **El copy se propone al Director en el chat antes de tocar archivos** (regla vigente de este repo).

## Sus tareas

1. **Pitch deck** (`src/app/pitch-deck/page.tsx`):
   - La tarjeta `label: 'DOS PASOS SENCILLOS'` (sub: *Usted comparte. Y recibe…*) — decidir con el Director cómo entra la aplicación personalizada. ⚠️ Esa tarjeta carga la **ley de la multiplicación** (*«Solo se multiplica lo que es sencillo…»*, movida ahí el 24 sep): si la tarjeta cambia de eje, la ley necesita casa nueva — no la deje huérfana.
   - El beat *«Un fabricante… una tecnología… dos pasos…»* (~línea 1117) sigue el orden viejo de los tres elementos.
   - La segunda tarjeta ya dice la cara del socio (*«Y con usted trabaja aparte: conoce sus metas, le redacta…»*) — cuidar que la tarjeta nueva no la repita.
2. **Servilleta** (`src/app/servilleta/page.tsx`): tarjeta «Dos pasos sencillos». ⚠️ `/servilleta` conserva léxico viejo por SEO (decisión del Director, 27 jun 2026) — confirmar con él si esta sí se toca.
3. **Home** (`src/app/page.tsx`): verificar si lista los tres elementos o los dos pasos como entregable y alinear.
4. **System prompt** (`knowledge_base/system-prompt-queswa.md`): buscar «dos pasos» / «tres elementos» / cómo se nombra la aplicación; si algo contradice el tercer elemento nuevo, ajustar y desplegar con `actualizar-system-prompt-queswa.mjs` (⚠️ presupuesto: < 20.000 caracteres por canal desplegado, medido con `--dry`; una regla nueva se paga quitando otra).
5. **Después de sus cambios:** correr `auditar-guion-queswa.mjs` sobre el guion nuevo del video (abajo) — `WHY_APP_01` ya existe para atender lo que estrena.

## Lo que NO es suyo (lo lleva el Dashboard)

- Los arsenales. `WHY_05` (*«…y una metodología sencilla, de dos pasos»*) y `FREQ_14` (*«…y una metodología de dos pasos… su Dashboard»*) listan la metodología como entregable: el texto nuevo está propuesto al Director y lo despliega el Dashboard cuando él apruebe.
- **El video «Cómo funciona»** (los dos cortes de 60 s). Guion aprobado:

```
Hoy todos quieren vender por internet, pero muy pocos tienen la infraestructura para armar un negocio moderno de distribución. Funciona así: usted recibe en una sola aplicación los tres elementos que eliminan la fricción de montarlo.

Uno: un fabricante, que empaca y despacha cada pedido hasta la casa del cliente.

Dos: Queswa, una inteligencia artificial que atiende las 24 horas a quien llega por su enlace.

Tres: su aplicación personalizada. Como en Waze, usted le dice a dónde quiere llegar, y Queswa le marca la ruta, paso a paso.

La diferencia es la propiedad: cada cliente que llega por su enlace queda a su nombre, y cada recompra le deja un porcentaje.

Quien quiera distribuir recibe estas mismas herramientas: así se arma, a su nombre, un sistema de distribución.

Las comisiones las paga el fabricante: Gano Excel, treinta años, más de sesenta países.

[Corte compartible] Toque el enlace aquí abajo y Queswa le muestra, en vivo, cómo aplicaría para usted.
[Corte del chat]    Usted ya está viendo esta tecnología en vivo: pregúnteme cómo aplicaría para usted.
```

- ⚠️ **Ventana de desfase conocida:** hasta que los cortes nuevos estén subidos, los videos en producción dicen la voz anterior mientras `WHY_02` ya dice el texto nuevo. Está anotada en el CHANGELOG v6.52; no la "arregle" revirtiendo el arsenal.
