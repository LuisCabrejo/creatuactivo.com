# Handoff para el agente del Dashboard — acceso por WhatsApp y usuarios en prueba

> **De:** agente del repo `marketing` (motor Queswa + canal WhatsApp).
> **Fecha:** 17 ago 2026 · **Pedido del Director**, dos frentes:
>
> 1. Quien compra un paquete debe recibir **por WhatsApp** su enlace de canal **y el acceso al
>    Dashboard**, con **un botón** — no una URL larga con parámetros. Hoy el magic link va por
>    correo.
> 2. Quien recibe **días de prueba sin pagar** (una o dos semanas) necesita registro propio, y hay
>    que poder ver a las personas con las que comparte su enlace.
>
> Auditó `Dashboard/src/app/api/auth/magic-link/route.ts` y el esquema de `private_users` antes de
> escribir esto. Lo de abajo son recomendaciones con su porqué, no instrucciones cerradas: la
> decisión de arquitectura del Dashboard es suya.

---

## 1. Lo que ya existe (para no reconstruirlo)

**Magic link:** `POST /api/auth/magic-link` recibe `{ email, name, constructorId, whatsapp,
affiliationLink, ganoExcelId }`, crea o encuentra el usuario en `private_users`, genera
`token = nanoid(48)` con **24 h** de expiración, lo guarda en `magic_links` y envía por Resend a
`{baseUrl}/activate?token={token}`.

**Del lado del canal (repo `marketing`), ya funciona:**

- Comando `ACTIVAR Nombre 3001234567 [códigoGano]` desde el WhatsApp del Director. Crea las filas
  de `private_users` y `constructor_slugs`, y le manda al socio su enlace `/{slug}/queswa`.
- Plantilla **`enlace_canal_listo`** (UTILITY, **aprobada** por Meta el 17 ago) para cuando la
  ventana de 24 h está cerrada.
- Puente `/api/wa/send` en `marketing`, autenticado con `x-wa-bridge-secret`, que ustedes ya usan.
  ⚠️ El token de Meta (`WHATSAPP_SYSTEM_TOKEN`) vive **solo** en `marketing` y no debe copiarse.

---

## 2. El acceso al Dashboard por WhatsApp, con botón

### 2.1 El botón es una plantilla con URL dinámica

WhatsApp permite plantillas con **botón de URL de sufijo dinámico**: la base va fija en la
plantilla aprobada y solo viaja la variable. La persona ve **un botón**, nunca la URL.

⚠️ **La variable tiene que ir al FINAL de la URL.** Por eso conviene una ruta corta de path en vez
del query actual:

```
Ruta nueva en el Dashboard:  /e/{token}   →  redirige internamente a /activate?token={token}
Botón de la plantilla:       https://queswa.app/e/{{1}}
```

Con `?token={{1}}` también funcionaría, pero el path es más limpio, se ve mejor en la vista previa
de WhatsApp y les deja libertad de cambiar el destino sin volver a someter la plantilla.

### 2.2 Plantilla sugerida

Categoría **UTILITY** (es la entrega de un acceso que la persona acaba de adquirir; se aprueban en
horas y se rechazan menos que las de marketing). Cuerpo corto, sin instrucciones que suenen
promocionales:

```
Listo, {{1}}. Su Centro de Mando ya está abierto.

Ahí ve quién ha llegado por su enlace y en qué va cada persona.

[ Abrir mi Centro de Mando ]   → https://queswa.app/e/{{2}}
```

⚠️ **Someterla desde el WABA de CreaTuActivo**, que es donde vive el número. En `marketing` hay un
script que sirve de molde: `scripts/someter-plantilla-bienvenida.mjs` (somete y consulta estado).

### 2.3 Quién genera el token y quién envía — dos caminos

**Camino A (recomendado): el Dashboard genera y pide el envío.**
`/api/auth/magic-link` acepta un `canal: 'whatsapp' | 'email'`. Con `whatsapp`, en vez de Resend
llama al puente `POST {MARKETING_URL}/api/wa/send` con la plantilla y el token. La lógica de auth
—token, expiración, `magic_links`— **no sale del Dashboard**, que es donde debe estar.

**Camino B: el canal lo pide al activar.** El comando `ACTIVAR` en `marketing` llama a
`/api/auth/magic-link` con `canal: 'whatsapp'` y ustedes hacen el resto. Es un paso menos para el
Director, pero acopla el canal al Dashboard.

En cualquiera de los dos, **el token nunca se genera en `marketing`**: eso duplicaría la lógica de
sesión en un repo que no la tiene.

### 2.4 Tres detalles que van a morder si no se cuidan

- ⚠️ **La ventana de 24 h.** A quien no le haya escrito nunca al WABA solo se le puede llegar con
  plantilla. Por eso el acceso debe ir **como plantilla**, no como texto libre: así funciona
  siempre, sin depender de si la persona conversó.
- ⚠️ **El token expira en 24 h y el mensaje puede leerse después.** Conviene que `/e/{token}`
  distinga *expirado* de *inválido* y ofrezca un botón de "envíenmelo de nuevo" en vez de un error
  seco. Es el momento de mayor abandono de todo el flujo.
- ⚠️ **Un mismo token no debería servir dos veces.** `magic_links` ya tiene `used_at`; asegúrense
  de que la ruta corta lo respete igual que `/activate`.

---

## 3. Usuarios en prueba — mi recomendación difiere del pedido, y explico por qué

El Director pidió **una tabla nueva**. Yo recomiendo **no crearla**, por una razón concreta que
sale del esquema.

### 3.1 Los prospectos del usuario en prueba ya están resueltos

Quien está en prueba **también comparte un enlace**, y los prospectos que llegan por él caen en
`prospects` con su `constructor_id`, exactamente igual que los de un socio que pagó. La atribución,
los avisos y el radar ya funcionan sin tocar nada. **No hace falta una tabla para "las personas con
las que comparte el enlace": ya existen y ya están atribuidas.**

### 3.2 Lo único genuinamente nuevo es el reloj

Cuándo empieza la prueba, cuándo termina, y qué pasa al terminar. Eso es **una columna**, no una
tabla:

```sql
alter table private_users add column if not exists trial_ends_at timestamptz;
```

Quien está en prueba es un usuario con `trial_ends_at` en el futuro. Quien pagó lo tiene en `null`.

### 3.3 Por qué NO agregar 'trial' al status

`private_users.status` tiene un CHECK: `'active' | 'inactive' | 'suspended'`. Es tentador añadir
`'trial'`, pero **rompería en silencio todo lo que hoy filtra `status = 'active'`** — listados,
permisos, notificaciones, el radar. Un usuario en prueba desaparecería de consultas que nadie
recuerda haber escrito, y sin un solo error visible.

El usuario en prueba **sí está activo**: solo tiene un plazo. `status = 'active'` +
`trial_ends_at` conserva todo funcionando y hace la condición explícita donde importe.

### 3.4 Lo que sí conviene decidir antes de implementar

Son preguntas de producto, para el Director:

1. **Al vencer, ¿qué pasa?** ¿El enlace deja de funcionar, o sigue y lo que se corta es el acceso
   al Dashboard? Mi lectura: **el enlace debería seguir vivo**. Si un prospecto suyo escribe
   después del vencimiento y encuentra un 404, el daño es para un tercero que no tiene culpa — y
   además es el mejor argumento para que la persona pague.
2. **¿Quién queda de sponsor de esos prospectos** si el usuario en prueba no convierte? Hoy quedan
   atribuidos a él. Vale definirlo antes de que ocurra.
3. **El aviso de vencimiento** conviene por WhatsApp y con antelación (2–3 días), no el mismo día.

### 3.5 Cómo crear a alguien en prueba

Lo más simple es reusar lo que ya existe: el comando `ACTIVAR` del canal, con una variante que
marque el plazo — por ejemplo `ACTIVAR PRUEBA Julieth Cabrejo 3001234567 15`. Crea las mismas dos
filas y además pone `trial_ends_at`. Si les sirve, lo implemento del lado de `marketing` cuando
tengan definida la columna.

---

## 4. Resumen de lo que propongo

| | |
|---|---|
| Ruta corta `/e/{token}` → `/activate?token=` | Dashboard |
| Plantilla UTILITY con botón de URL dinámica | someter desde el WABA |
| `canal: 'whatsapp'` en `/api/auth/magic-link`, enviando por el puente `/api/wa/send` | Dashboard |
| `trial_ends_at timestamptz` en `private_users` — **sin tabla nueva y sin tocar el CHECK de status** | Dashboard |
| Variante `ACTIVAR PRUEBA` en el canal | `marketing`, cuando exista la columna |

Y una nota aparte, ya reportada en
[INDICACION_DASHBOARD_ENLACE_Y_ACTIVACION.md](INDICACION_DASHBOARD_ENLACE_Y_ACTIVACION.md): la Home
muestra hoy `creatuactivo.com/[object Object]/queswa` — se interpola el registro en vez de su campo
`.slug`.
