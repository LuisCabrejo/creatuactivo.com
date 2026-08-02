# Handoff — Alinear el motor de Queswa con el léxico nuevo (ago 2026)

> ✅ **EJECUTADO — 2 ago 2026.** Los tres pendientes de §3 están cerrados y desplegados: system prompt **v29.4_villano_narrado** (verificado con `leer-system-prompt.mjs`), arsenal **v5.29** (re-fragmentado + clonado a `whatsapp`), sync de los 4 pares Camino A verificada (WHY_02 ahora 1354 chars). Detalle en los CHANGELOGs. El documento queda como registro de la doctrina.

> **Para el agente que entra en frío.** El guion de la presentación avanzó más rápido que el motor. Este documento dice **qué quedó desalineado, dónde está, y qué NO se puede romper al arreglarlo**. Si solo lee las fuentes y no esto, va a re-proponer cosas ya descartadas.

---

## 1. El encargo, en una frase

El **villano viejo** sigue vivo en el system prompt y probablemente en varios fragmentos del arsenal, aunque ya se retiró del guion y de WHY_01. **Queswa todavía puede decir lo que la presentación dejó de decir.**

---

## 2. Qué ya está aplicado y desplegado (no rehacer)

| Pieza | Versión | Estado |
|---|---|---|
| `arsenal_inicial` | **v5.28** | ✅ desplegado · 57 fragments · clonado a tenant `whatsapp` |
| `nexus_main` (system prompt) | **v29.3_lenguaje_concreto** | ✅ desplegado 1 ago 2026, 00:23 · 22.726 chars |
| `respuestas-maestras.ts` | — | ✅ sincronizado carácter por carácter |
| Guion servilleta | **v6.8** | ✅ commiteado (`dfd99a3`) |
| Deck `/servilleta` | 5 slides | ✅ commiteado (`21d4071`) |

Lo que **sí** entró en v29.3: la regla de **cuándo** se nombra "empresa digital" (nunca en primer contacto), la instrucción de que *la arquitectura no es la respuesta a "cómo funciona"*, y el retiro de la tríada de primeros principios como apertura canónica.

---

## 3. Los tres pendientes (esto es el trabajo)

### 3.1 · Villano viejo en el system prompt — **línea 168**

`knowledge_base/system-prompt-nexus-main-v27_2.md`, sección de villano permitido:

> *"Un sistema diseñado para tomar sus mejores años y su salud, a cambio de casi nada"*

**Se retiró el 31 jul** de WHY_01 (arsenal), del Slide 1 del guion y de la Opción 1 del cierre. Razones: victimiza al receptor, roza retórica ideológica que genera desconfianza en quien quiere emprender, y activa reactancia (*"usted sí es negativo"*, respuesta documentada en campo).

**Reemplazo canónico** (guion v6.6, calibrado con el Director):

> Usted trabaja el mes entero. Pero al día siguiente de que le entra la plata, ese dinero ya tiene dueño: el banco, las cuotas, los recibos. Es un ciclo de **trabajar, pagar cuentas y repetir**. Y quiero ser claro: esto no pasa por falta de capacidad ni de esfuerzo suyo. **Le pasa exactamente igual al que gana dos millones y al que gana veinte.**

⚠️ **La última frase no es decorativa.** El dolor **NO es que la plata sea poca** — eso hiere el orgullo y el que gana bien dice *"ese no es mi caso"*. El dolor es que **llega ya comprometida**, y eso le pasa igual en los dos extremos de ingreso. Si al migrar se pierde esa frase, se pierde la mitad del hallazgo.

### 3.2 · `"cuánta gente"` en WHY_02 — en producción

En el cierre del fragmento: *"…empieza a depender de **cuánta gente** ya está consumiendo"*. Debe ser **"cuántas personas"** (registro vetado, ver `feedback_evitar_gente_despectivo`). Se coló en la redacción del 31 jul y está desplegado.

Vive en **dos archivos que deben quedar idénticos**: `knowledge_base/arsenal_inicial.txt` (bloque `<verbatim_lock>` de WHY_02) y `src/lib/respuestas-maestras.ts` (`MASTER_WHY_02`).

### 3.3 · Barrido del villano viejo en el resto de los arsenales

Solo se tocó **WHY_01**. Falta auditar si *"mejores años y su salud"*, *"consecuencia matemática"* y formulaciones equivalentes viven en otros fragmentos de `arsenal_inicial`, `arsenal_avanzado` o `arsenal_12_niveles`.

```bash
grep -rn "mejores años\|consecuencia matemática\|asfixia mensual" knowledge_base/*.txt
```

---

## 4. Reglas que NO se pueden romper

**Sincronía inviolable de Camino A.** Cuatro pares deben coincidir **carácter por carácter** entre el `<verbatim_lock>` del arsenal y su constante en `src/lib/respuestas-maestras.ts`:

| Fragmento | Constante | Longitud actual |
|---|---|---|
| `WHY_02` | `MASTER_WHY_02` | 1349 |
| `EAM_01` | `MASTER_EAM_01` | 1469 |
| `EMPRESA_DIGITAL_01` | `MASTER_EMPRESA_DIGITAL` | 738 |
| `INVERSION_MARKETING_01` | `MASTER_INVERSION_MARKETING` | 394 |

Verificación rápida: extraer el cuerpo de cada `<verbatim_lock>` y compararlo con su constante; si las longitudes difieren, difieren.

**Protocolo de despliegue del arsenal** — el paso 2 es el que todos olvidan:

```bash
node scripts/deploy-arsenal-inicial.mjs        # 1. documento padre
# 2. PURGAR fragmentos arsenal_inicial_% del tenant creatuactivo_marketing
node scripts/fragmentar-arsenales-voyage.mjs   # 3. regenera solo los purgados
# 4. PURGAR arsenal_inicial% del tenant whatsapp
node scripts/clonar-arsenal-whatsapp.mjs       # 5. clonar
node scripts/audit-completo.mjs                # 6. verificar
```

⚠️ Sin purgar, el fragmentador **salta** los existentes (`⏭️ ya existe, saltando…`) y los cambios no llegan nunca. Y `clonar-arsenal-whatsapp.mjs` **solo inserta categorías nuevas** — sin purga previa, el tenant `whatsapp` queda con la versión vieja.

**System prompt:** se edita el `.md` local y se despliega con `node scripts/actualizar-system-prompt-v27.2.mjs`, ajustando `VERSION_LABEL` (hoy `v29.3_lenguaje_concreto`). El nombre del script y del archivo son legacy; la versión real está en `VERSION_LABEL`. Verificar siempre con `node scripts/leer-system-prompt.mjs` — nunca asumir que local = Supabase.

---

## 5. La doctrina, en seis reglas

Lo que gobierna cualquier decisión de copy aquí:

1. **Lo concreto antes que la categoría.** Sustantivos que se pueden ver: café, celular, cuenta bancaria, viernes. *"Empresa digital"* NO se usa en primer contacto ni al responder qué es esto o cómo funciona — es un contenedor vacío que el oyente rellena con pirámides o cripto. Es legítima **después**, cuando ya vio el mecanismo. Las categorías se ganan, no se anuncian (Nubank nunca pidió entender "neobanco").
2. **Sin diagnóstico a quien ya preguntó.** Quien escribe *"¿cómo funciona?"* ya se autodiagnosticó; insistir en el problema resta.
3. **Villano narrado, jamás etiquetado, y nunca contra el esfuerzo.** El trabajo es digno; señalarlo activa reactancia.
4. **El candado se afirma, nunca se niega.** *"Se liquida en su cuenta bancaria cada viernes"*, jamás *"no es dinero en la nube"* — nombrar el elefante lo invoca.
5. **Cifras fuera del párrafo emocional.** El dato junto a la historia **resta** emoción en vez de sumarla (efecto de la víctima identificable). Prohibido *"consecuencia matemática"*.
6. **Nunca prometer que no hay venta ni cobro.** Sí los hay; lo que no hay es inventario ni despachos. Corrección de campo del Director.

---

## 6. Dónde está el resto del contexto

**Léalos en este orden:**

1. `docs/handoff/negocio/HANDOFF_HOOK_Y_LENGUAJE_CONCRETO_JUL2026.md` — el origen: dos meses de conversaciones 1-a-1 sin un solo *"wow"*, los dos trancones, y la amnistía de vocabulario. **Incluye la doctrina de método: que algo ya esté desplegado no es argumento para conservarlo.**
2. `public/contexto/produccion/guiones/servilleta/guion_maestro_servilleta_v3.md` — el changelog **v6.6 → v6.8** al inicio tiene las decisiones más recientes, cada una con su porqué. Es la fuente más actualizada de todas.
3. `knowledge_base/CHANGELOG-arsenales.md` §`arsenal_inicial` v5.28 — qué cambió en WHY_01, WHY_02 y EMPRESA_DIGITAL_01, y por qué.
4. `knowledge_base/CHANGELOG-system-prompts.md` v29.3 — qué entró en el prompt.
5. `docs/investigaciones/posicionamiento-categoria/BRIEF_POSICIONAMIENTO.md` — las cinco barreras reales (no es "desconfianza"). La tercera, la **aversión a construir**, explica varias decisiones.
6. `docs/investigaciones/posicionamiento-categoria/claude_one_liner_concreto.md` — por qué la categoría abstracta no engancha (Newton 1990, Paivio, Heath).
7. `BRANDING.md` §7 — tablas completas de vocabulario aprobado y prohibido.
8. `docs/PENDIENTES.md` — checklist operativo abierto.

---

## 7. Trampas conocidas

- **No "corrija" copy accesible hacia el término viejo.** La tabla de léxico de `CLAUDE.md` todavía refleja en parte el canon anterior; el guion v6.8 y el arsenal v5.28 mandan.
- **"Perseguir" no es filtro corporativo: es la voz del Director.** Él no lo usa ni para el villano. Alternativas: *andar detrás de alguien, insistir, presionar*.
- **"Red de clientes" está permitido; "su red" a secas no.** La colocación decide, no la palabra.
- **El nombre de archivo del system prompt (`v27_2`) es legacy.** No renombrar; verificar siempre con `leer-system-prompt.mjs`.
- **El audit reporta `desconocido: 40 fragmentos`.** Es falsa alarma cosmética — son documentos maestros padre que el fragmentador necesita. **No borrar.**

---

**Última actualización:** 1 ago 2026 · Estado del motor verificado contra Supabase ese día.
