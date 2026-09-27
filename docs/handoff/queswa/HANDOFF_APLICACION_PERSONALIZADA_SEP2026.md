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

## El video «Cómo funciona» a 60 s — AHORA ES SUYO (Director, 27 sep 2026)

El Director reasignó la producción del video a este repo («ya tiene todo el contexto y
los elementos»). **Buena parte ya está hecha y vive aquí** — no lo rehaga:

- **La voz, generada y calibrada:** `captions/work/como-funciona/vo-v2/` — 22 tomas
  (2 semillas × 11 bloques) con **Andres Felipe** (`d2Cxiyh5zS7CQNTlRrdT`, stability 0.5 ·
  similarity 0.75 · **speed 1.05**, calibrada contra la toma del video actual: desvío 33 ms).
  Borradores ensamblados para que el Director elija: `borrador-compartible.wav` (59.7 s),
  `borrador-chat.wav` (59.2 s), `borrador-chat-alt.wav` (60.2 s) y
  `comparacion-A-B-por-bloque.wav` (seed 11 · bip · seed 23, bloque por bloque).
  Generador reproducible: `generar-vo.mjs` en ese directorio. ⛔ **La voz NUNCA sale de
  `ELEVENLABS_VOICE_ID` del .env (es Sarah, la de Queswa web)** — ver PIPELINE.md.
- **El plan completo:** `captions/work/como-funciona/PLAN-VIDEO-60S.md` — beats por
  bloque, mapa bloque→clip (los clips existentes cubren todo menos el b05), duraciones,
  y los pasos que faltan (segmentos v2, subtítulos karaoke, música, masters, Blob `-v2`).
- **El visual del b05 (Waze), en borrador Remotion:** `motion/src/Ruta3D.tsx` (comiteado)
  + registro en `Root.tsx` (LOCAL, sin comitear — ese archivo trae cambios ajenos). Render
  de muestra: `motion/out/ruta3d.mp4` (7.5 s). El orbe, el pin que cae, la ruta punteada
  que se enciende en oro y tres hitos que pulsan — beats anclados a la toma b05 seed 11.
  ⚠️ El orbe NO llega al pin, a propósito: la ruta se marca, la llegada no se promete.
- **Decisiones del Director aún pendientes:** tomas por bloque (seed 11 = la lectura del
  video actual; el total va justo — b03/b05/b08 en seed 23 ahorran ~1.7 s) · cierre del
  chat («pregúnteme» aprobado, pero cambia la voz del narrador; «pregúntele aquí mismo»
  la conserva — las dos tomas existen) · si el visual b05 es el insert Remotion o un clip
  Veo suyo (prompt en el plan).
- **Al terminar, el Dashboard hace su parte:** cambiar la URL del corte del chat en
  `Dashboard/src/lib/videos-queswa.ts` (subir a Blob con NOMBRE NUEVO, `-v2`: Meta y los
  teléfonos cachean), y reemplazar el compartible + poster + caption en
  `Dashboard/public/videos/reels-equipo/` y `REELS_EQUIPO_DATA`. Avísele al agente del
  Dashboard o al Director.
- Después de ensamblar: `auditar-guion-queswa.mjs` sobre el guion (WHY_APP_01 ya existe).

## Lo que sigue siendo del Dashboard

- Los arsenales: `WHY_02` v6.52, `WHY_APP_01` v6.53 y `WHY_05`/`FREQ_14` v6.54 ya están
  desplegados y verificados — no los toque.

## El guion aprobado:

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

⚠️ **Ventana de desfase conocida:** hasta que los cortes nuevos estén subidos, los videos en producción dicen la voz anterior mientras `WHY_02` ya dice el texto nuevo. Está anotada en el CHANGELOG v6.52; no la "arregle" revirtiendo el arsenal — se cierra produciendo.
