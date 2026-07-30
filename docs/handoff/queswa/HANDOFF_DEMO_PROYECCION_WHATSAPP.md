# Handoff — La DEMO de proyección en WhatsApp (paso ③ de la experiencia)

**Para:** agente Claude Code que opera el canal WhatsApp (motor + webhook)
**De:** sesión de estrategia (Luis + Claude Code / marketing)
**Estado:** diseño **aprobado por Luis** (29 jul 2026) — listo para implementar.

---

## 1. Qué es y por qué existe

Es el momento central de la experiencia WhatsApp: cuando el prospecto ya entendió
el modelo y dice "sí, muéstreme", Queswa **le proyecta SU empresa digital con las
cifras reales del plan**. Deja de *leer* información y pasa a *ver* su caso.

Fundamento (investigación + terreno):
- **Ancho de banda mental:** la persona no puede visualizar una organización de
  cientos consumiendo — ve su lista de 3 contactos. La demo le presta esa visión.
- **Autopersuasión:** el escenario es moderado y el prospecto lo completa solo
  hacia arriba. Marcos extremos ("$103M") activan el "ese no es mi caso" y el
  fantasma de las captadoras.
- **Cifras dictadas por backend, jamás por el modelo** (patrón backend dictador,
  igual que `getPinCifrasGEN5`). Motivo legal: Ley 1480 + precedente Air Canada —
  lo que la IA promete, vincula.

---

## 2. El guion aprobado (3 movimientos)

### Movimiento 1 — La pregunta ancla (el modelo puede adaptarla al oficio)
> "Hagamos el ejercicio con SU caso. De su círculo cercano, ¿le suenan **2
> personas** que ya tomen café todos los días?"

- UNA sola pregunta. El ancla es 2 (el modelo 2×2 del plan) — cualquiera tiene dos.
- El modelo puede teñirla con el oficio ("colegas", "clientes", "familia").

### Movimiento 2 — La proyección (BLOQUE DICTADO — verbatim, cifras intocables)
> El plan se construye con algo muy simple: usted conecta a 2 personas… y cada
> una hace lo mismo. Así se ve, con las cifras reales del plan:
>
> ☕ Usted conecta *2 personas* → *$25.200/mes*
> 👥 Nivel 3: su organización ya suma *14 personas* → *$176.400/mes*
> 👥 Nivel 4: *30 personas* → *$378.000/mes*
> 👥 Nivel 5: *62 personas* → *$781.200/mes*
>
> Usted hizo 2 conversaciones. El resto lo hizo la duplicación — y yo estuve en
> cada conversación explicando por usted. Y este es el escenario más conservador
> del plan.
>
> (El plan llega hasta el nivel 12 — ¿quiere ver la proyección completa?)

- **Fuente única de cifras: `PROYECCION_12`** en `src/app/12-niveles/page.tsx`
  (post-fix acumulado). Personas mostradas = **acumulado** (2 · 14 · 30 · 62);
  ingresos = renta acumulada COP del plan. NO recalcular, NO redondear.
- Formato WhatsApp: **líneas con *negrita***, NUNCA tablas markdown (los `|` se
  ven rotos en el teléfono).
- "Escenario más conservador" es literal (binario 10%; hay paquetes que inician
  en 15–17%) — no citar los porcentajes salvo que pregunten.
- Si pide la proyección completa: continuar hasta nivel 12 con las cifras de
  `PROYECCION_12`, o enviar el simulador web `/12-niveles/{slug}` con su ref.

### Movimiento 3 — Los tres caminos (cierre con autonomía)
> Esto es una simulación para que vea la mecánica — no una promesa; lo que crezca
> depende de lo que usted construya. Desde aquí hay tres caminos:
> 1. *Activar su empresa digital hoy* (con su paquete de inicio),
> 2. *Empezar a beneficiarse de los productos* — consumirlos usted, a precio
>    preferencial,
> 3. O seguir explorando con calma, sin compromiso.
> ¿Cuál le suena?

**Enrutamiento de cada camino:**
1. **Activar** → flujo de pre-afiliación existente (`POST /api/pre-afiliacion`,
   datos de a uno; el endpoint normaliza `ESP-1/2/3` o `inicial/estrategico/visionario`).
2. **Productos** → enviar el **catálogo con la atribución del socio**:
   `https://creatuactivo.com/sistema/productos/{constructor_id}` (resolver el
   constructor_id del prospecto desde `prospects.constructor_id`; fallback: URL
   sin ref). Respaldo de conocimiento: fragmento **CLIENTE_VIP_01** (desplegado —
   25% de ahorro, $147.900 vs $110.900, acceso con compra inicial de 50 PV).
3. **Explorar** → conversación libre, sin presión (doctrina vigente).

---

## 3. Reglas inviolables

- **Cifras SOLO de `PROYECCION_12`.** El modelo no genera números de la demo.
- **NUNCA exponer la estrategia del lado único del binario** (ayuda del equipo
  por un lado). Regla vigente de Luis: se confirma solo si el prospecto la
  menciona, sin mecánica, y se remite al equipo (ver fragmento
  INVERSION_MARKETING_01).
- **NUNCA** decir "recuperar la inversión" ni armar la ruta de recuperación —
  el prospecto hace esa cuenta solo.
- **"organización"**, no "red". "Valor" o "aporte", no "inversión" (en tablas de
  paquetes).
- El disclaimer ("simulación, no promesa") **no se recorta** — es el
  diferenciador contra las captadoras, no un peaje.
- Trato de usted; máx. 3-4 líneas por mensaje salvo el bloque dictado.

## 4. Trigger sugerido (a criterio del implementador)

Después de que Queswa explicó el modelo y el usuario acepta ver más ("sí",
"muéstreme", "ok", "cómo se vería") **o** pregunta "¿cuánto ganaría?" en fase
temprana. Cuidado con colisión: la pregunta de ganancias ya dispara el pin GEN5 —
decidir si la demo lo reemplaza en el tenant whatsapp para el primer contacto
(recomendado: demo primero, GEN5 para preguntas específicas de bonos por paquete).

## 5. Estado de dependencias (lado marketing — ya resuelto)

- ✅ Fragmento CLIENTE_VIP_01 + rename "Cliente VIP" → desplegado a Supabase
  (marketing + clonado a whatsapp). *(Verificar en el CHANGELOG si esta casilla
  quedó marcada al momento de leer esto.)*
- ✅ Simulador `/12-niveles` con acumulado corregido (commit `a3421e2`) +
  arsenal_12_niveles v5.1 (`72c1be8`).
- ✅ Atribución prospecto→socio en producción (webhook).
- ✅ Pre-afiliación: endpoint listo en el Dashboard; falta que Queswa lo llame
  (contrato en el handoff del Dashboard).

## 6. Contexto estratégico (para calibrar el tono)

La demo es el paso ③ de la experiencia completa:
```
① Mensaje del socio (curiosidad) → enlace {slug}/queswa
② Queswa explica el modelo real (funciona ✅)
③ LA DEMO — este handoff
④ Los tres caminos (Mov. 3)
⑤ Pre-afiliación → push al socio → 1-a-1 humano cierra
⑥ El socio nuevo recibe SU enlace y su primer paso es compartirlo
```
El norte: que la persona sienta que esto es un **upgrade** (sencillo, en paralelo,
sin cambiar de vida) y que **vea** su empresa naciendo — no que lea sobre ella.
