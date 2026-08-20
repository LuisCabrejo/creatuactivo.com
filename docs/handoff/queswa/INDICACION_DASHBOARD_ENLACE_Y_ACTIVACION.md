# Indicación para el agente del Dashboard — el enlace del socio y la activación por WhatsApp

> **De:** agente del repo `marketing` (motor Queswa + canal WhatsApp).
> **Fecha:** 17 ago 2026.
> **Para:** el agente de `queswa.app`.
>
> Dos cosas: (1) cuál es el enlace que debe salir por defecto en la Home del Dashboard y con qué
> forma exacta, y (2) el contexto de lo que se construyó del lado del canal para que el Director
> pueda pedir activaciones desde su propio WhatsApp — por si conviene reflejarlo en la aplicación.

---

## 1. El enlace de WhatsApp en la Home

### 1.1 Hay un bug en producción

En la Home aparece hoy:

```
creatuactivo.com/[object Object]/queswa
```

Se está interpolando un **objeto** donde va el slug. Probablemente el registro de
`constructor_slugs` completo en vez de su campo `.slug`. La estructura de la URL está bien; lo que
falla es el valor.

### 1.2 La forma canónica

```
https://creatuactivo.com/{slug}/queswa
```

- `{slug}` sale de **`constructor_slugs.slug`** (texto: `luis-cabrejo`, `nidia-cabrejo`,
  `prosperosysaludables`). Es un campo `text`, no un objeto.
- **Sin parámetros.** Nada de `?ref=`, nada de UTM: el slug ya identifica al socio.
- Se muestra tal cual, y el botón de copiar debe copiar **exactamente** esa cadena.

### 1.3 Por qué esta forma y no otras dos que parecen equivalentes

**No usar `creatuactivo.com/{slug}` a secas.** Esa página **no existe** — verificado contra
producción, devuelve **404**. Solo existen `/{slug}/{nicho}` (páginas de reel) y los destinos con
nombre, entre ellos `/queswa`.

**No usar un enlace `wa.me` directo.** Tienta porque ahorra un salto, pero pierde lo más
importante: `/{slug}/queswa` **valida el slug contra la base antes de redirigir**. Si el slug está
mal escrito o es de alguien no registrado, la ruta corta con 404. Con el `wa.me` crudo el prospecto
escribiría igual, el webhook no encontraría al socio y entraría **sin dueño** — fuera del radar de
nadie, sin aviso, y con el saludo genérico en vez del nombre del socio. Con un socio pasa
desapercibido; con diez es una fuga silenciosa de prospectos.

### 1.4 Qué hace la ruta (para que sepan qué esperar al tocarla)

1. Busca el `slug` en `constructor_slugs`. Si no existe → `notFound()`.
2. Redirige a `https://wa.me/573215193909` con este texto pre-llenado:

   ```
   Hola Queswa, vengo del enlace de {slug}
   ```

3. El prospecto ve la pantalla de WhatsApp con el botón de empezar a chatear. Al enviar, el
   webhook lee el slug de ese texto y le atribuye el prospecto al socio.

⚠️ **Ese texto es contrato.** El webhook lo parsea con un patrón que busca palabras unidas por
guion. Si el Dashboard alguna vez genera su propio enlace `wa.me`, el texto tiene que conservar el
slug con guiones dentro del mensaje o la atribución se rompe.

⚠️ **Sin emojis en el texto pre-llenado.** La pre-carga de wa.me los destruye y al webhook le llega
`U+FFFD`. Ya está resuelto en la ruta; menciónelo si van a construir enlaces por su cuenta.

### 1.5 Sugerencia de presentación

El enlace es lo que el socio va a compartir decenas de veces, así que conviene que sea lo más
fácil de copiar de toda la pantalla. Dos detalles que ayudan: que el toque en cualquier parte de
la caja copie (no solo el ícono), y un acuse visible de que se copió.

Y hay un caso que vale cubrir: **un socio sin `slug`**. Hoy no todas las filas lo tienen. En vez de
mostrar una URL rota, conviene un estado explícito — *"su enlace se está preparando"* o similar.

---

## 2. Contexto: cómo se activa un socio nuevo desde WhatsApp

Esto ya funciona del lado del canal. Se lo cuento para que decidan si el Dashboard lo refleja o lo
dispara.

### 2.1 El comando

El Director le escribe al WABA (`+57 321 519 3909`) desde su propio móvil:

```
ACTIVAR Julieth Cabrejo 3001234567
ACTIVAR Julieth Cabrejo 3001234567 7118234   # con código de Gano
ACTIVAR Julieth                              # lo busca en pending_activations
```

Solo responde a números autorizados (`WA_ADMIN_NUMBERS`, hoy los dos del Director).

### 2.2 Qué crea, y esto es lo que más les toca

Crea **dos filas**, y ambas hacen falta:

- **`private_users`** — `name`, `constructor_id`, `whatsapp`, `status: 'active'`,
  `role: 'constructor'`, `plan_type: 'inicial'`, y `gano_excel_id` si vino en el comando.
- **`constructor_slugs`** — `slug`, `display_name`, `whatsapp`, `constructor_id`, `activado_en`.

⚠️ **`constructor_id` NO es un UUID.** Es la llave de texto con la que ustedes y nosotros nos
entendemos, con formato `nombre-completo-en-slug` + código de Gano:
`carlos-alberto-franco-7116642`. Si no hay código, se usa un sufijo numérico. **Con un UUID
aleatorio la página del reel no encuentra al dueño en `private_users` y cae al WhatsApp orgánico**
— los prospectos de ese socio le escriben a otra persona. Nos pasó y lo corregimos.

`plan_type` entra como `'inicial'` por defecto: **la corrección es suya**, desde el Centro de
Mando, cuando se sepa el paquete real.

### 2.3 Qué recibe cada uno

- **El socio nuevo**, en su WhatsApp: su enlace `/{slug}/queswa`, la instrucción de compartirlo con
  cinco personas hoy, y el aviso de que Queswa le irá contando lo que pase. Si su ventana de 24 h
  está cerrada, entra la plantilla `enlace_canal_listo` (UTILITY, aprobada por Meta el 17 ago),
  cuyo botón **abre la ventana** y habilita el resto.
- **El Director**, en el suyo: la confirmación **y el texto listo para reenviar**, en un mensaje
  aparte para copiarlo de un toque. Así la activación funciona aunque Meta no deje escribirle a esa
  persona todavía.

### 2.4 Lo que el socio recibe después, sin abrir la aplicación

- **Cuando alguien le escribe a Queswa por su enlace:** aviso con **nombre y número** del prospecto.
- **Hitos del prospecto** (abrió el enlace, vio el video, escribió, volvió): un aviso por hito
  distinto, ninguno repetido, y solo si la ventana del socio está abierta.

⚠️ Los avisos de la web son **anónimos por naturaleza**: quien abre una página en el navegador
tiene `nombre` y `teléfono` en `null` — es un hash. Solo el momento de WhatsApp permite nombrarlo.

### 2.5 Y el canal ya distingue al socio del prospecto

Desde el 17 ago, si quien escribe está en `constructor_slugs`, el webhook activa **modo socio**:
Queswa lo saluda como dueño de canal —su enlace y *"¿a quién le va a escribir hoy?"*— en vez de
explicarle el negocio que ya compró.

⚠️ **La detección compara los teléfonos NORMALIZADOS en ambos lados.** En `constructor_slugs` los
números están guardados con `+`, con espacios y algunos con cero inicial (`03175857607`), así que
un `.eq()` contra la columna cruda **no encuentra a nadie**. Si el Dashboard hace búsquedas por
teléfono contra esa tabla, le va a pasar lo mismo.

### 2.6 Si quisieran disparar la activación desde el Dashboard

Existe el puente `/api/wa/*` en `marketing`, autenticado con `x-wa-bridge-secret`, que ustedes ya
usan para `assets` y `send`. Exponer ahí la activación es viable, pero **hoy no hace falta**: con
quince socios el Director activa desde su móvil en un mensaje, y eso es más rápido que abrir la
aplicación mientras está contactando gente. Lo dejo anotado por si el volumen lo pide.

---

## 3. Resumen de lo que hay que hacer

1. **Arreglar el `[object Object]`** — interpolar `registro.slug`, no el registro.
2. Mantener la forma `https://creatuactivo.com/{slug}/queswa`, sin parámetros.
3. Cubrir el caso del socio sin `slug` con un estado explícito, no con una URL rota.
4. (Opcional) Facilitar el copiado: toque en toda la caja y acuse visible.
