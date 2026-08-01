# Handoff — Funnel reto/mapa/diagnóstico ELIMINADO (27 jul 2026)

**Para:** agente Claude Code del **Dashboard** (`queswa.app`)
**De:** sesión en `marketing` (Luis + Claude Code)
**Estado:** ejecutado y commiteado en `main` de marketing — commit **`ca6ff59`** (sin push aún).

> Contraparte del handoff que ustedes nos dejaron (`HANDOFF_CANAL_WHATSAPP_OPERATIVO_JUL2026.md`).
> Ese trabajo suyo (número, `wa-channel`, puente, Cliente VIP) ya está commiteado en `9ce1a8e` +
> `2a3697c` y **no se tocó**.

---

## 1. Qué pasó

Decisión de Luis: se retiran **por completo** los tres funnels que nunca convirtieron
(meses de prueba, 1 solo registro que no avanzó):

- **Reto 5 Días** · **Mapa de Salida** · **Diagnóstico de 5 Días** (`/empresa-digital` + dia-1..5)

El embudo vigente es **reel → Queswa → 1-a-1**. En marketing ya se borró todo: páginas
(`/empresa-digital`, `/diagnostico`, `/confirmacion`), API (`cron/reto-5-dias`, `api/diagnostico`,
`webhooks/prospect-capture`, `test-reto-email`), correos (reto-5-dias/Dia1-5, las 2 confirmaciones),
y `lib/sendpulse.ts`. `api/funnel` quedó reducido a **calculadora + soap-opera + tracking de página**.
Redirects del funnel muerto retirados; los legacy (`/empresa-digital`, `/negocio-digital`,
`/auditoria-patrimonial`, etc.) ahora → **Home**.

**No se tocó el motor del canal WhatsApp** (`api/nexus`, número, puente, `wa-channel`). Intacto.

---

## 2. Lo que queda de SU lado (4 puntos)

### 2.1 `whatsapp-meta.ts` quedó huérfano → cierra su sección 8.4
Al retirar el disparo de `acceso_mapa_salida` (que fallaba en cada intento porque la plantilla no
existe) **se eliminaron sus dos únicos llamadores** (`api/funnel` y `api/webhooks/prospect-capture`).
`src/lib/whatsapp-meta.ts` ya **no lo importa nadie** en marketing. Pueden **borrarlo** (o reusar la
capa vía `wa-channel.ts`, que es la fuente única de canal). `lib/sendpulse.ts` **ya se borró** aquí.

### 2.2 Database Webhook de Supabase → prospect-capture ya no existe
La ruta `POST /api/webhooks/prospect-capture` **fue eliminada**. Si hay un **Database Webhook de
Supabase** apuntándole (el que disparaba la plantilla del Mapa de Salida), **quítenlo o repúntenlo** —
hoy responde 404 (y de todos modos la plantilla `acceso_mapa_salida` nunca existió).

### 2.3 Enlaces amigables del arsenal (`src/lib/arsenal.ts` del Dashboard)
`DESTINO_MAP` en marketing **ya no resuelve** estos destinos cortos (se eliminaron): `auditoria`,
`diagnostico`, `dia-1`..`dia-5`. Si su `arsenal.ts` todavía ofrece esos enlaces a los socios para
compartir, **retírenlos** para no dejar links que caen a la mini-landing (fallback) o a Home.
Cambio adicional: **`activacion` ahora apunta a `/paquetes?ref=`** (antes iba al squeeze muerto) —
mismo destino que el botón "Activación inmediata" de la servilleta.

### 2.4 `arsenal_reto` en Supabase (KB)
El arsenal `arsenal_reto` (tenant `creatuactivo_marketing`) sigue describiendo la "Auditoría de 5
días" en `nexus_documents`. Con el funnel muerto, Queswa no debería ofrecerlo. **Purga pendiente**
(borrar fragmentos `arsenal_reto_%` + doc maestro) — se coordinará con la ronda de léxico en curso.

---

## 3. Referencia

```
Commit marketing:   ca6ff59  refactor(funnel): eliminar reto-5-dias / mapa-de-salida / diagnóstico
Archivos:           41 (35 borrados + 4 editados + sendpulse borrado), −5.638 líneas
Embudo vigente:     reel → Queswa → 1-a-1
Redirects legacy:   /empresa-digital · /negocio-digital · /auditoria-patrimonial → Home
DESTINO_MAP:        activacion → /paquetes?ref  (auditoria/diagnostico/dia-1..5 eliminados)
```

**Contexto estratégico:** esto es parte del giro DEL→AL (de "oportunidad de negocio" a "prueba la
app / empresa digital"). El seguimiento del prospecto que antes intentaba hacer este funnel ahora es
trabajo del **Centro de Expansión** (radar + push) + la pre-afiliación (su sección 6). La atribución
prospecto→socio (su sección 8.1) sigue siendo el bloqueante #1 para que ese seguimiento exista.
