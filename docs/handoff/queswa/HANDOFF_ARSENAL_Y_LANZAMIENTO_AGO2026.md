# Handoff — revisión del arsenal y arranque de contactos (8-9 ago 2026)

> **Para el agente que continúa.** Este documento se escribió al cerrar una sesión larga en la que se revisaron **30 respuestas de `arsenal_inicial`** una por una con el Director. Lo que sigue es el estado real, lo que quedó pendiente y las trampas que costaron tiempo. Las reglas que se aplican a diario ya subieron a [CLAUDE.md](../../../CLAUDE.md); aquí está el contexto operativo.

## 1. Dónde quedó el arsenal

`arsenal_inicial` va en **v5.67** · **57 respuestas** · **149 fragmentos por tenant** (`creatuactivo_marketing` y `whatsapp`, idénticos) · **0 hits del auditor**, en cabecera y en cuerpo.

**Revisadas (30):** WHY_01 · WHY_02 · WHY_03 · WHY_04 · EMPRESA_DIGITAL_01 · VS_01 · FREQ_01 · PERFIL_01 · FREQ_02 · INVERSION_MARKETING_01 · FREQ_03 · ACTIVACION_01 · FREQ_04 · FREQ_20 · FREQ_21 · FREQ_22 · EAM_01 · WHY_ROL_01 · CLIENTE_VIP_01 · STORY_01 · CRED_01 · FREQ_05 · FREQ_06 · FREQ_07 · FREQ_08 · FREQ_09 · FREQ_10 · FREQ_13 · más `ADV_VAL_04` de `arsenal_avanzado`.

**Eliminadas (3):** `STORY_02` (la mesa de Mocoa — cobertura de unas historias de IG vencidas, y su moraleja contradice el guion *Quién, no cómo*) · `FREQ_11` (la respondía WHY_04, que además va en verbatim) · `FREQ_12` (repartida entre FREQ_02, PERFIL_01 y EAM_01).

⚠️ **Al eliminar, los disparadores se mudan.** FREQ_12 dejó sus preguntas en PERFIL_01 (*¿tengo que ser vendedor? · yo no sirvo para vender · soy introvertido*) y en FREQ_02 (*¿a quién le vendo? · no quiero molestar a mis amigos*). Borrar sin mudar la puerta deja al vector adivinando.

**Sin revisar (~27):** de `FREQ_14` en adelante, más los bloques CRED (parcial), OBJ, VOICE, ACTIVACION, CIERRE, NET y DIÁSPORA.

**El historial razonado de cada cambio vive en la cabecera `**Versión actual:**` de [arsenal_inicial.txt](../../../knowledge_base/arsenal_inicial.txt)**, que encadena de v5.67 hacia atrás explicando el *porqué* de cada una. Es la mejor fuente para entender los criterios en uso.

## 2. Lo que hay que probar en WhatsApp antes de mandar tráfico

El canal ha atendido **4 personas en toda su vida** (15 mensajes). El plan del Director es contactar **entre 50 y 100 personas** — un salto de 25× sobre un motor cuyo arsenal cambió 30 veces en un día. **La prueba va primero, no de última.**

Se escriben al WABA `+57 321 519 3909` en este orden, en una sola conversación:

| # | Mensaje | Debe responder | Está mal si |
|---|---------|----------------|-------------|
| 1 | `¿Y esto cómo funciona, exactamente?` | WHY_02: productos premium de bienestar + de dónde sale la plata | menciona *consumo diario* o compara con el café del supermercado |
| 2 | `¿Esto es una pirámide?` | FREQ_13: **Ley 1700 de 2013**, nueve sedes, ACOVEDI | solo dice *"hay un producto real"* → no se recuperó el fragmento |
| 3 | `¿Cuánto cuesta empezar?` | FREQ_03: los tres niveles ESP en **solo COP** | aparece USD al lado → falló la detección de país por prefijo |
| 4 | `¿Tengo que comprar todos los meses?` | FREQ_09: **50 PV, tres o cuatro cajas** | dice *$100 USD* o *$450.000* → cifra vieja |
| 5 | `¿Hay capacitación?` | FREQ_08: espacios en vivo · Queswa · sección Maestría, **en tres líneas** | las tres salen corridas → el render colapsa las viñetas |
| 6 | `Quiero iniciar` | `wa-radicacion`: los **cuatro datos en un solo mensaje** (nombre completo, cédula, ciudad, paquete) | manda un enlace `wa.me` → **la FSM web se coló en el canal**, el bug más caro |

⚠️ **La 6 no es simulacro**: radica de verdad contra el Dashboard, escribe en `pending_activations` y dispara plantilla al socio y al equipo.

## 3. El plan de 4 horas acordado

| | Bloque | Estado |
|---|--------|--------|
| 0 | Prueba en vivo del canal (las 6 de arriba) | ⏳ el Director la estaba haciendo al cerrar la sesión |
| 1 | **Auditoría de los 57 cierres, en lote** | pendiente |
| 2 | **Auditoría de eliminación, en lote** | pendiente |
| 3 | Barridos globales | ✅ *equipo directivo* y *70 países* hechos; falta el marco del hábito |
| 4 | Mensaje de contacto + guion del reel de documentación | pendiente |
| 5 | Push de los commits + deploy a Vercel | pendiente |

**El método importa tanto como el contenido.** Revisar fragmento por fragmento consume una conversación completa por respuesta y se come el mes. Los bloques 1 y 2 **se lotean**: se produce una tabla con las 57 preguntas de cierre (o las colisiones de los 27 sin revisar), el Director decide en **una** pasada, y se despliega todo junto. 27 conversaciones se vuelven 2 decisiones.

**Criterio del Director para los cierres:** no puede responderse con **sí o no**, ni pedir la **opinión** del prospecto. Tiene que **proponer un paso concreto**, con **una sola salida**, y el arsenal tiene que poder atender lo que promete.

## 4. Pendientes anotados

- **El marco del hábito de consumo diario** se retiró de WHY_02 y reapareció entero en FREQ_07, FREQ_09 y ADV_VAL_04 el mismo día. Falta un barrido con `grep -rn "ya iba a\|de todos modos\|consumo diario\|mercado de la casa"`.
- **`arsenal_manejo` (tenant `dashboard`)** todavía dice *70 países*. Es de queswa.app, repositorio aparte; cambiarlo por SQL lo desincroniza de su archivo fuente.
- **`/lexico`** conserva *"setenta"* a propósito: es la página de ejercicios de dicción del Director y ese es el fonema que practica.
- **`system-prompt-queswa-whatsapp-v1.0/v2/v3.md`** conservan la cifra vieja. Son legacy no desplegados; el vivo es `v4`.
- **La página `/gano-excel`** — idea del Director. La [auditoría corporativa](../../investigaciones/prompts/Auditoría%20Corporativa%20Gano%20Excel.md) tiene material de primera para ella (40 hectáreas, extracto hidrosoluble 40:1, el problema de la quitina, 12 años de I+D antes de vender, FDA 2002-2003). ⚠️ **Tres datos de ese informe no se pueden usar:** *"más de 100 países"* (fuentes débiles y contradice al propio Gano), *"4.16 billones de dólares"* (es *billion* leído como *billón*), y el ensayo clínico de cáncer de mama con la USM — es real y está en la web de la universidad, pero los productos están registrados como alimentos y suplementos ante INVIMA, así que insinuar eficacia oncológica es lo que esa autoridad sanciona. El **Gran Contribuyente de la DIAN** el Director prefirió no usarlo por ahora.

## 5. Cómo verificar recuperación antes de tocar un disparador

Cuando se cambia un disparador, una expansión de chip o se elimina un fragmento, **se puede medir** en vez de suponer. Un script temporal que embebe la consulta con Voyage (`voyage-3-lite`, 512 dim, `input_type: 'query'`) y la compara por coseno contra `embedding_512` muestra el top-N antes y después.

Así se descubrió que la expansión del chip 4 pedía *"renta vitalicia"* —término que no existe en el corpus— y que **seis de sus diez primeros resultados quedaban bajo el umbral de 0.4**. Con *"ingreso recurrente"* los diez lo superan.

## 6. La receta de despliegue, sin atajos

```bash
node scripts/deploy-arsenal-inicial.mjs
node scripts/sql.mjs -e "delete from nexus_documents where category='arsenal_inicial_XXX'"
node scripts/fragmentar-arsenales-voyage.mjs
node scripts/sql.mjs -e "insert into nexus_documents (category, title, content, embedding_512, tenant_id, metadata)
select category, title, content, embedding_512, 'whatsapp', metadata || '{\"cloned_from\":\"creatuactivo_marketing\"}'::jsonb
from nexus_documents where tenant_id='creatuactivo_marketing' and category='arsenal_inicial_XXX'"
```

Después: `content like` sobre **lo nuevo y sobre lo que debía salir**, en los dos tenants · `node scripts/auditar-frases-vetadas.mjs --detalle` · conteos iguales por tenant.

⚠️ **El directorio de trabajo se pega.** Un `cd knowledge_base` de un comando anterior hizo que un despliegue y una purga fallaran en silencio. Confirmar `pwd` si algo no cuadra.
