# Handoff — migrar «canal» → «sistema de distribución» en los arsenales pendientes
### 6 sep 2026 · encargo del Director

---

## LA TAREA

`arsenal_inicial` ya está migrado (85 ocurrencias) junto con los 5 candados de
`src/lib/respuestas-maestras.ts`. **Faltan tres arsenales:**

| Arsenal | «canal» aprox. | Otro pendiente heredado |
|---|---|---|
| `arsenal_avanzado` | ~21 | 8 × «empresa digital» |
| `arsenal_compensacion` | ~66 | 11 × «empresa digital» |
| `arsenal_12_niveles` | ~50 | — (NIVELES_01 ya migrado) |

**Alcance:** solo estos tres `.txt` de `knowledge_base/` y su despliegue.
⛔ **NO toque `src/`, la web, ni `arsenal_inicial`** — otra sesión está trabajando en paralelo
en `scripts/dankoe-video/` y en documentos de guion. Si `git status` muestra cambios ajenos en
el árbol, **no los comitee**: comitee solo sus tres archivos por ruta explícita.

---

## POR QUÉ EL CAMBIO (contexto, no adorno)

*Canal* es un conducto: se abre, y algo pasa por él. *Sistema* es una máquina: se construye,
tiene partes, y se es dueño de ella. Todo lo que vendemos es la construcción, y la comparación
que sostiene el copy nuevo —**el que vende una hamburguesa vs. el dueño de McDonald's**— no
funciona con un conducto. Decisión del Director, 6 sep 2026.

---

## ⛔ LAS TRES TRAMPAS — un `sed` ciego rompe producción

1. **`canal izquierdo` y `canal derecho`** son nomenclatura del **Binario**. NO se migran.
   Viven sobre todo en `arsenal_compensacion`.
2. **`canales oficiales` / `canales de pago`** son los medios de pago de Gano Excel
   (consignación, transferencia). NO se migran.
3. **Cualquier `canal` que no sea el activo del usuario.** Antes de reemplazar, **liste los
   contextos** (`grep -oE ".{0,40}canal.{0,40}"`) y decida uno por uno. En `arsenal_inicial`
   aparecieron tres falsos positivos de 88.

**Protéjalos con marcadores antes del reemplazo y restáurelos después** — así se hizo en
`arsenal_inicial` y funcionó:

```python
prot = {"canal izquierdo":"\x01A\x01", "canal derecho":"\x01B\x01", "canales oficiales":"\x01C\x01"}
for k,v in prot.items(): s = s.replace(k,v)
s = re.sub(r"\bcanal(es)?\b", rep, s)      # rep respeta mayúscula inicial y plural
for k,v in prot.items(): s = s.replace(v,k)
```

⚠️ `re.sub` **sin** `re.I` no toma `CANAL` en mayúsculas — revíselas aparte.

---

## ⚠️ FRASES QUE LA MIGRACIÓN VUELVE TORPES

No basta con cambiar la palabra: **léala en voz alta después**. En `arsenal_inicial` dos frases
quedaron mal y hubo que reescribirlas:

- *«…por su sistema de distribución. Hay un **sistema** entero ya montado…»* — la palabra con
  dos dueños distintos en frases seguidas. Quedó: *«Hay una **infraestructura** entera ya montada»*.
- *«construyen **sus sistemas** de forma constante»* — suena a inventario; el suyo es uno.
  Quedó: *«construyen **el suyo** de forma constante»*.

Busque en sus tres arsenales: `sus sistemas`, `sistema entero`, `al sistema`, `el sistema del sistema`.

---

## ⛔ CANDADOS DE DOBLE FUENTE

Cinco fragmentos viven **a la vez** en el arsenal (dentro de `<verbatim_lock>`) y en
`src/lib/respuestas-maestras.ts`: WHY_02 · EAM_01 · WHY_04 (`MASTER_DINERO_01`) ·
EMPRESA_DIGITAL_01 · INVERSION_MARKETING_01. **Los cinco están en `arsenal_inicial`, que usted
NO toca** — así que en principio no le afectan. Pero **verifíquelo** antes de terminar:

```bash
npx tsx -e "
import { readFileSync } from 'fs';
const ts = readFileSync('src/lib/respuestas-maestras.ts','utf8');
const ars = readFileSync('knowledge_base/arsenal_inicial.txt','utf8');
for (const [, n, c] of ts.matchAll(/const (MASTER_\w+) = \`(.*?)\`;/gs)) {
  const i = ars.indexOf(c.trim().split('\n')[0].slice(0,45));
  const lock = ars.slice(i, ars.indexOf('</verbatim_lock>', i)).trim();
  const q = c.lastIndexOf('¿');
  console.log((lock === (q>0?c.slice(0,q):c).trim() ? '✅ ':'❌ ') + n);
}"
```

El contrato es de **PREFIJO**: el candado = el texto del TS **menos la pregunta de cierre**.

---

## RECETA DE DESPLIEGUE — los cinco pasos, siempre los cinco

El fragmentador **salta en silencio** lo que ya existe: sin purgar no pasa nada y todo parece bien.
Y sin clonar, la web queda actualizada y **WhatsApp no** — que es donde está el tráfico.

```bash
# 1. editar el .txt  →  2. subir el documento padre
node scripts/deploy-arsenal-avanzado.mjs       # (y -compensacion, -12-niveles)

# 3. purgar los fragmentos viejos — EN LOS TRES TENANTS
#    ⚠️ scripts/sql.mjs devuelve 401 (token personal vencido, 6 sep). Use el service role:
node -e "
import('dotenv').then(d=>{d.config({path:'.env.local'});return import('@supabase/supabase-js');}).then(async({createClient})=>{
  const s=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY);
  const {data}=await s.from('nexus_documents').select('id').like('category','arsenal_avanzado_%');
  await s.from('nexus_documents').delete().in('id',data.map(x=>x.id));
  console.log('purgados',data.length);
});"

# 4. regenerar con embeddings Voyage
node scripts/fragmentar-arsenales-voyage.mjs

# 5. clonar a los DOS tenants derivados — NUNCA se omite ninguno
#    (por lotes de 40; el payload completo revienta)
```

**Los arsenales viven en TRES tenants:** `creatuactivo_marketing` (web) · `whatsapp` (el canal) ·
`dashboard` (queswa.app, otro repositorio que se surte de esta misma tabla). Si los conteos
difieren, algo quedó a medias.

---

## BATERÍAS — obligatorias, y las cuatro

```bash
node scripts/auditar-frases-vetadas.mjs              # esperado: 0 en cabecera, 0 en cuerpo
node scripts/test-guardarrail-negocio.mjs            # exit 1 si falla
node scripts/test-guardarrail-salud.mjs              # exit 1 si falla
node scripts/benchmark-clasificador.mjs --tenant whatsapp   # esperado 58/58
```

⚠️ **`prueba-40-preguntas.mjs` se corre con `npx tsx`, no con `node`.** Y tiene **variabilidad
del modelo**: si un caso falla, vuelva a correrlo antes de darlo por roto. **Mida el baseline
con `git stash` antes de creer que usted lo rompió** — así se comprobó hoy que el arsenal
inicial pasó de 36/42 a 38/42, no al revés.

Y verifique los conteos por tenant al terminar:

```bash
node -e "…select('tenant_id').eq('metadata->>is_fragment','true')…"   # los tres iguales
```

---

## LO QUE PUEDE HACER SIN PREGUNTAR, Y LO QUE NO

✅ **Sin preguntar:** el reemplazo mecánico canal→sistema, la protección de los falsos
positivos, las reescrituras mínimas de las frases que la migración vuelve torpes (como las dos
de arriba), el despliegue y las baterías.

⛔ **Con el Director, siempre:** cualquier cambio de **contenido** — reescribir una respuesta
porque le parece mejor, cambiar un argumento, mover una cifra, tocar una pregunta de cierre.
La regla de la casa es explícita: *no se despliega copy sin haberlo propuesto antes en el chat*.

⚠️ **Y una que se olvida:** si cambia una **pregunta de cierre**, hay dos cosas más que tocar —
el **índice del fragmento destino** (la oferta va literal ahí, porque en WhatsApp un «sí» pelado
busca con la última pregunta del bot) y, si el destino es un nodo dictado, el **patrón del
conductor** en `src/lib/queswa-conductor.ts`. Sin eso el «sí» cae al buscador vectorial — es el
fallo del caso Betsabe, documentado en `AUDITORIA_TRAFICO_ORGANICO_SEP2026.md`.

---

## HERENCIA: «empresa digital»

`arsenal_avanzado` (8) y `arsenal_compensacion` (11) todavía dicen *empresa digital*, que está
retirado desde el 25 ago. **Migre también esas ocurrencias a «sistema de distribución»**, con una
excepción: **en los ÍNDICES se conserva**, porque son las palabras que el prospecto escribe
—alguien que oyó el término en otra parte tiene que poder llegar—. El fragmento
`EMPRESA_DIGITAL_01` existe justo para aterrizar a esa persona, y **traduce al canónico en su
primera línea**.

---

## AL TERMINAR

Reporte al Director, en prosa y sin tecnicismos: cuántas ocurrencias migró por arsenal, qué
falsos positivos protegió, qué frases tuvo que reescribir y por qué, el resultado de las cuatro
baterías, y **cualquier cosa que le pareciera mal escrita pero no tocó** — eso último vale tanto
como lo corregido: sin ese registro, el próximo que audite pierde el tiempo o «arregla» lo que
estaba bien.
