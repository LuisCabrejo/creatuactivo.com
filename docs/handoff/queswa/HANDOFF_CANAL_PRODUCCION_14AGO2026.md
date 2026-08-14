# HANDOFF — Canal WhatsApp a producción (13–14 ago 2026)

> **Para el agente que continúa.** El objetivo del Director es **ir a producción y empezar a hacer contactos**. Esta sesión cerró los bloqueadores del canal; lo que queda es la prueba definitiva del Director y una lista corta de pendientes. Lea esto completo antes de tocar el motor o el arsenal, y después [HANDOFF_ARSENAL_Y_LANZAMIENTO_AGO2026.md](HANDOFF_ARSENAL_Y_LANZAMIENTO_AGO2026.md) para el contexto del arsenal.

## Dónde quedó la tarea

**El Director está corriendo la prueba definitiva del canal** desde uno de sus números (los tres se limpiaron: `3203415438` personal · `3206805737` Business · `3215193909` es el WABA y nunca guarda datos). Lo que la prueba debe confirmar — si algo de esto falla, ahí está el trabajo:

1. **«¿cuánto cuesta empezar?»** → tabla ESP del candado de FREQ_03 (`[PRECIO]` lo llena el pin en COP), **sin cifras de comisión**
2. Cuando Queswa **ofrece** números → el Flow del simulador llega **solo**, abriendo en las tarifas de renta — y abre sin error al tocarlo
3. **«sí»** (con o sin tilde) a una oferta → entrega directa sin repreguntar; el ejemplo por defecto es el de **renta** (GEN5 solo si se nombra gen5/paquetes)
4. Ejemplo del binario **aunque venga con tipeo** (`bianrio`, `binaro`) → dictado, nunca compuesto
5. **«me interesa iniciar»** + nombre y ciudad en el mismo mensaje → el nodo de radicación pide **solo cédula y paquete**

Para auditar la prueba: leer `nexus_conversations` por `fingerprint_id like 'wa_%<número>%'` (mensajes en la columna `messages`, enrutamiento en `metadata.documents_used` / `search_method`). Los respaldos de las pruebas anteriores están en `docs/respaldos/`.

## La lección de la sesión (léala antes de diagnosticar)

**Tres pruebas seguidas del Director fallaron por causas de ENRUTAMIENTO, nunca por el copy.** El patrón se repitió tanto que es doctrina:

- Si el modelo responde algo distinto al texto calibrado, **lo primero es verificar si el fragmento correcto llegó al contexto** — no reescribir el copy. En esta sesión: «cómo se inicia» enrutaba a compensación; «¿cuánto cuesta empezar?» se iba por la rama del catálogo de productos (`pideListaPreciosEarly`); «bola de nieve» no tenía puerta y el vector+CQR la perdía.
- **Cuando un pin no dispara, el modelo compone** — y al componer vuelven las frases vetadas («de por vida», «ingreso inmediato», proyecciones con línea de tiempo, ejemplos contando personas). La solución nunca es regañar al modelo en el prompt: es cerrar la puerta que falló.
- **Las puertas toleran el tipeo.** Tres bajas en una sola prueba: `bianrio` (no disparó el ejemplo dictado), `inciar` (no disparó la radicación), y «sí» con tilde (el `\b` de JS no cierra tras `í` — solo aceptaba «Si»). La gente escribe con el pulgar; un regex que exige ortografía perfecta no existe. Patrones ya en código: `b[ia]+n[a-z]?r[a-z]?i?o` · `ini?[cs]iar|empe[zs]ar|comen[zs]ar` · `(?![a-záéíóúñ])` en vez de `\b` final.
- **Batería antes que fe:** `node scripts/benchmark-clasificador.mjs --tenant whatsapp` (42/42 al cierre de sesión, exit 1 si falla). Para medir recuperación semántica: `node scripts/medir-recuperacion-voyage.mjs "<consulta>" [...]` (top-6 con score y 🔒 por consulta, tenant whatsapp).

## Qué cambió en el motor (route.ts) — no revertir

| Cambio | Qué hace | Commit |
|---|---|---|
| **Veto precio↔comisión** (`preguntaSoloPorPrecio`) | Una pregunta de precio nunca recibe cifras de comisión. Manda sobre `getPinCifrasGEN5` y `getTablasComisiones`. Los mixtos («¿cuánto cuesta y cuánto se gana?») sí pasan | `2127890` |
| **«cómo se inicia» → `patrones_inicial`** | Era la pregunta más común y enrutaba a compensación, lo que además ponía `esDocCompensacion` en verdadero (la condición con la que los pines inyectan cifras) | `65819e3` |
| **Candado solitario** | Si el fragmento que encabeza la recuperación trae `<verbatim_lock>`, se entrega SOLO (los demás se descartan). Sin esto, un segundo fragmento a 0.017 de distancia contaminaba la respuesta | `d850707` |
| **`objetoDeNegocio` en `pideListaPreciosEarly`** | «cuánto cuesta empezar» ya no es pedido de lista de precios de productos. La lista de los 22 sigue funcionando | `339db68` |
| **`[PRECIO]` en FREQ_03 + pin subordinado** | El candado pone el texto, el pin pone la cifra en la moneda del visitante. El pin lleva instrucción explícita de NO componer lista propia | `361fbf8` |
| **`_aceptaEjemplo` alcanzable + renta por defecto** | La aceptación se computa ANTES de la guarda de salida del pin; el «sí» hereda el tipo de ejemplo de la oferta; **renta es el default** (GEN5 solo nombrado). Decisión del Director: el GEN5 primero siembra «se gana por traer gente» | `8af0ecb`, `9fce509` |
| **«bola de nieve» → patrón a compensación** | Concepto que nosotros introducimos (COMP_MODELO_01/COMP_BIN_01) tiene puerta puesta a mano — primera evidencia dura de que el CQR cambia el enrutamiento | `69e73b7` |
| **RE_VOLICION tolerante** (`wa-radicacion.ts`) | `inciar/empesar/comensar` disparan; «¿cómo se inicia?» y «no estoy listo» siguen sin disparar (11/11) | `72947ba` |
| **Flow pegado a la oferta** (webhook) | Cuando la respuesta ofrece números y no dictó ejemplo, el simulador sale en ese momento (pantalla RENTA_MENU). Los ejemplos dictados conservan su propio envío | `9fce509` |
| **Strip de `<verbatim_lock>`** (`wa-formato.ts`) | Las etiquetas se retiran por código en el canal — se le habían escapado al modelo en producción | `361fbf8` |
| **Aceptación pelada busca con la OFERTA** | Un «sí» solo ya no va al CQR: la consulta es la última pregunta del bot, determinístico. Antes, un «sí» a «¿le muestro los productos?» recuperó COMPENSACIÓN y el modelo compuso productos alucinados con etiquetas de candado inventadas | `5c4669e` |
| **`gn5` tolera el tipeo** (`ge?n[\s.-]?5`) | «ejemplo de gn5» compuso la pirámide de 3.125 personas con total en USD — cuarta baja por tipeo en dos pruebas | `5c4669e` |

## El Flow del simulador (por qué no abría)

Las descripciones de `NavigationList` admiten **máximo 20 caracteres**; las nuestras tenían 40–50. El validador de publicación de Meta NO lo revisa (el Flow figuraba `PUBLISHED`, salud `AVAILABLE`) pero el runtime del teléfono sí → error al abrir. Diagnóstico: **la vista previa interactiva de Meta muestra el error completo** (`GET /<FLOW_ID>?fields=preview.invalidate(true)` → abrir la URL). Corregido vía API **sobre el mismo Flow** (`POST /<FLOW_ID>/assets` lo devuelve a DRAFT → `POST /<FLOW_ID>/publish`), ID intacto (`27695362003466921`, env `WHATSAPP_FLOW_SIMULADOR_ID` ya en Vercel). De paso salió léxico vetado de adentro: «Ingreso inmediato» → «Bono GEN5». **Copia versionada del JSON: [flows/simulador-de-ingresos.flow.json](flows/simulador-de-ingresos.flow.json)** — el builder de Meta no es fuente versionada; si alguien lo edita a mano allá, re-subir desde el repo o actualizar la copia.

## Copy que cambió (fuente dual sincronizada)

- **WHY_02** (el fragmento que más se sirve): cierre nuevo *«…y cobrar cada vez que su canal mueve producto»* (antes encadenaba las dos acciones a «sus comisiones cada viernes» = promesa fechada, puesta a propósito en jul 2026 con buena intención). También salió *«para que usted dirija»*. La cadencia del viernes vive en WHY_04, donde es un hecho. **El contrato de fuente dual es de PREFIJO**: el candado del arsenal = el texto de `respuestas-maestras.ts` MENOS la pregunta de cierre (que va fuera del candado). Commit `81f91c7`.
- **COMP_MODELO_01**: «le liquida por cada **compra**» (era «transacción» — palabra de extracto bancario). Commit `69e73b7`.
- **FREQ_03**: disparadores nuevos «¿Cuánto cuesta empezar? / ¿Cuánto vale entrar?» (0.547, 1º) y cabecera reescrita en afirmativo (1.578→705 chars — narraba el fallo que prohibía).

## Pendientes, por orden

1. **Resultado de la prueba del Director** — si falla un punto, esa es la tarea. No darle nada por cerrado sin verlo en la conversación real (leer la BD, no confiar en el resumen).
2. **Decisión abierta del Director**: ¿guardarraíl de salida que detecte «de por vida» / «ingreso inmediato» / tablas de personas por generación en la respuesta antes de enviarla? Propuesto, no aprobado — tiene filo (FREQ_05/herencia usa durabilidad legítimamente). **La evidencia ya es fuerte**: en la prueba de las 15:45, dos composiciones se colaron pese a las puertas — la tabla precio+comisión (turno 9, «la ganancia de comprar paquetes empresariales» no matchea ningún pin) y la pirámide de 3.125 personas (turno 10, cerrada con el fix de `gn5`). El turno 9 sigue abierto: no hay puerta para esa fórmula y el modelo compone con cifras de `arsenal_12_niveles` en USD.
3. ~~Kit de Inicio~~ **DECIDIDO (14 ago, 16:47)**: el Director aprobó que el Kit de Inicio se ofrezca como forma de empezar («me parece bien») — se queda en el Flow y en las respuestas. Si se toca FREQ_03, evaluar si el Kit entra a la tabla del candado (hoy son tres formas ESP).
4. **Los ~19 cierres pendientes** de la revisión respuesta por respuesta (ver handoff del arsenal).
5. **Barrido de «dirigir»**: ~14 instancias de cara al prospecto en los arsenales (6 inicial, 7 avanzado, 1 compensación).
6. «yo ya hice multinivel» resuelve a STORY_03 (0.405) en vez de NET_01.
7. `FREQ_04_PUENTE` está en el `.txt` pero nunca se indexó.
8. El prompt web `nexus_main` quedó limpio de léxico (v29.8+); el fallback de `route.ts` lleva solo guardarraíles — no re-meterle doctrina.

## Reglas de proceso con el Director (innegociables)

- **Copy se propone en el chat ANTES de tocar archivos.** Él decide. Cambios de motor/enrutamiento sí se ejecutan directo, con batería y commit explicativo.
- **Despliegue de fragmentos: los cinco pasos, siempre** (editar .txt → deploy padre → purgar fragmento → re-fragmentar → clonar a `whatsapp`) y verificar con `content like` lo que entró Y lo que debía salir, **en los dos tenants**. Paridad al cierre: **143 fragmentos por tenant**, auditor de frases vetadas en 0.
- Al auditar una respuesta de Queswa, citar el turno exacto y separar: ¿es copy nuestro (candado/pin) o composición del modelo? La respuesta define si se toca el arsenal o el motor.
