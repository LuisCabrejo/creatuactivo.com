# Cinematografía de Inmersión 3D — Guía para los b-rolls (clay / Gemini-Veo)

> **Por qué este documento.** Veníamos cayendo en **errores básicos** (la empresa "sobre una
> hoja de dibujo" = maqueta, la vista isométrica, el efecto miniatura) y parchándolos uno por
> uno. Esto es la **base**: qué hace que el ojo crea que está *dentro de un espacio real* y no
> *mirando un modelito*. Aplica a todos los b-rolls (estilo Maqueta Técnica Premium en arcilla,
> 9:16, imagen→video por Gemini/Veo). Complementa `HANDOFF_BROLLS_HOME.md` (qué se ve) y
> `GUIA_IDENTIDAD_VISUAL_IA.md` (cómo se genera).

---

## 0. El principio rector

El cerebro decide "esto es un espacio real / monumental" vs "esto es una maqueta de mesa"
con **pistas de profundidad**. Si damos las pistas de un objeto pequeño visto desde arriba,
sale maqueta — por más bonito que esté el render. La inmersión **no es un efecto que se
añade al final; es la suma de lente + ángulo + perspectiva + capas + luz + movimiento.**
Nuestro estándar de oro ya logrado: el **puente (15.png)**. Nuestro error típico: la
**empresa sobre placa (3.png)**.

---

## 1. La cámara (lo que más mueve la aguja)

### 1.1 Distancia focal / lente
| Lente | Efecto | Úsalo para |
|---|---|---|
| **Gran angular (≈18–35 mm)** | Exagera la profundidad: lo cercano se agranda, las líneas convergen fuerte. Sensación de **estar dentro**, escala monumental. | ✅ **Default de todos los b-rolls inmersivos.** |
| Normal (≈50 mm) | Perspectiva "humana", neutra. | Retrato del sujeto sin drama. |
| **Teleobjetivo (85 mm+)** | **Comprime y aplana** la profundidad. Combinado con ángulo alto = **tilt-shift / miniatura** (juguete). | ❌ Casi nunca. Es el lente que nos daba "maqueta". |

> **Regla:** gran angular + cámara baja = monumental e inmersivo. Tele + cámara alta = juguete.

### 1.2 Altura y ángulo de cámara
| Ángulo | Lectura emocional | Veredicto |
|---|---|---|
| **Bajo / casi a ras de piso** | El sujeto se siente **grande, importante, real**. Máxima inmersión (caso 1.png, 15.png). | ✅ Preferido. |
| Nivel de ojo | Relatable, neutro. | OK. |
| Alto / picado / cenital | Vista de dios, control — pero **encoge** al sujeto → maqueta/diagrama. | ⚠️ Solo si lo pide el concepto (ej. el "ciclo" cenital). |
| **Isométrico / ortográfico** | **Sin punto de fuga** → diagrama, "vista de app", maqueta de arquitecto. | ❌ **Prohibido para héroe inmersivo** (fue el error de 3.png). |

### 1.3 Perspectiva vs proyección paralela
La inmersión **exige perspectiva con punto(s) de fuga**: las líneas paralelas **convergen**.
La isométrica/ortográfica mantiene las líneas paralelas → el cerebro lee "esquema", no
"espacio". **Siempre perspectiva real, nunca isométrica** para los b-rolls.

### 1.4 Profundidad de campo (foco)
- **Foco profundo** (todo nítido) = escala real, arquitectura monumental. ✅ Default.
- **Foco superficial** (fondo desenfocado) sobre un sujeto chico = **efecto miniatura
  tilt-shift** = juguete. ❌ Evitar en edificios/estructuras. (El desenfoque de retrato sí
  sirve para *personas* talking-head, no para maquetas.)

---

## 2. Las 7 pistas de profundidad (cómo el ojo arma el 3D en 2D)

Marcar **varias a la vez**; cuantas más, más real.

1. **Perspectiva lineal** — líneas (cuadrícula, puente, carretera, muelles) que convergen a
   un **punto de fuga** en el horizonte.
2. **Tamaño relativo** — lo cercano grande, lo lejano chico. En la cuadrícula: **cuadros
   grandes adelante que se encogen hacia el horizonte** (geometría de 1.png/6.png).
3. **Oclusión / solapamiento** — un plano tapa a otro. Necesitamos **primer plano · plano
   medio · fondo** (capas), no todo a la misma distancia.
4. **Perspectiva atmosférica** — lo lejano se ve **más tenue, con menos contraste, velado**
   y se disuelve en bruma hacia el vacío. Es lo que hace "infinito" al suelo (1.png/15.png).
5. **Gradiente de textura** — la cuadrícula se hace **más densa** hacia el fondo.
6. **Sombras de contacto / proyectadas** — anclan el objeto al piso y revelan volumen
   (oclusión ambiental, ya en nuestro estilo).
7. **Paralaje** (solo en video, ver §4) — la pista **más potente** de todas.

> El suelo NUNCA es una **placa finita flotante**: es una **cuadrícula infinita** que recede
> a un horizonte brumoso. Placa con bordes + ejes de medición = "hoja de dibujo" = maqueta.

---

## 3. Composición para la profundidad (eje Z)

- **Ancla de primer plano.** Algo grande cerca de la cámara (una arista de la cuadrícula, el
  inicio del puente, una esquina del edificio) → dispara la sensación de profundidad al
  instante.
- **Líneas guía** que jalan el ojo al punto de fuga (la cuadrícula, el puente, la fila de
  camiones).
- **Capas (FG/MG/BG).** El sujeto en plano medio, el suelo viniendo hacia la cámara en primer
  plano, el horizonte brumoso atrás.
- **Anclas de escala humana.** Las figuras de trabajadores a tamaño correcto **venden el
  tamaño real** y separan "empresa" de "juguete".
- **Espacio negativo con propósito.** El vacío da lujo, pero el sujeto debe ocupar lo
  suficiente para no verse como un objeto solitario y pequeño (otro gatillo de "maqueta").
- **Horizonte** ubicado en el tercio (no a la mitad muerta); en 9:16 suele ir alto para dejar
  ver el suelo que recede.

---

## 4. Movimiento (la etapa de video — donde nace la inmersión real)

El movimiento correcto es lo que convierte "render lindo" en "experiencia".

- **Dolly-in / push-in** por el eje Z: la cámara **viaja hacia dentro** del espacio. Es el
  movimiento inmersivo por excelencia.
- **Paralaje** — capas a distinta distancia que se mueven a distinta velocidad (lo cercano
  más rápido que lo lejano). **Es la pista #1 que vende el 3D.** Se logra teniendo FG/MG/BG
  reales y moviendo la cámara lateral o hacia dentro.
- **"Todo escala junto" (efecto Inception)** — al entrar, **toda la estructura se acerca
  uniformemente, nada se queda atrás** (regla ya documentada en la guía de identidad). Falla
  cuando unos elementos se acercan y otros no.
- **Movimiento del sujeto = vida + capas de paralaje.** Camiones que entran, montacargas que
  trabaja, gente que se mueve: dan vida y suman planos a distinta profundidad.
- **Velocidad y easing.** Arranque suave, deriva continua; nada de tirones. La velocidad se
  controla con palabras ("slow drift", "steady push", "fast").
- ❌ **Evitar:** rotación tipo *turntable* del modelo (= product-shot / maqueta giratoria);
  cámara 100% estática y plana (= diagrama sin vida); zoom digital (≠ dolly, no da paralaje).

> **Imagen → video:** el keyframe ya debe traer la perspectiva y las capas; Veo solo añade el
> recorrido. Si el keyframe es isométrico o está sobre placa, ningún movimiento lo salva.

---

## 5. Luz para profundidad y realismo

- **3 puntos:** key (da la forma), fill (suaviza), **rim/contraluz (separa el sujeto del
  vacío negro)**. El rim es clave: sin él, la arcilla gris se funde con el fondo y se aplana.
- **Oclusión ambiental + sombra de contacto** — volumen y anclaje al piso.
- **Atmósfera / volumétricos (bruma tenue)** — profundidad + el horizonte que se disuelve.
- **Gradiente en el vacío/horizonte** (un poco más claro donde muere el suelo, como 1.png) —
  da aire y sensación de "sala infinita".
- ❌ Evitar luz plana y uniforme (lee a diagrama/render técnico sin alma).

---

## 6. La trampa "miniatura / maqueta" — anatomía del error (lo que nos pasó)

Sale juguete cuando se acumulan estos factores. Cada b-roll debe **invertir todos**:

| Gatillo de maqueta | Corrección inmersiva |
|---|---|
| Vista isométrica / sin punto de fuga | Perspectiva real con punto de fuga |
| Cámara alta / cenital + teleobjetivo | Cámara baja 3/4 + gran angular |
| **Placa finita flotante con bordes** | **Cuadrícula infinita hasta horizonte brumoso** |
| Ejes de medición / tics / "hoja de dibujo" | Sin ejes; el suelo es espacio, no plano técnico |
| Foco superficial (tilt-shift) sobre el edificio | Foco profundo (escala real) |
| Sujeto chico centrado en marco vacío | Ancla de primer plano + capas + escala humana |
| Luz plana uniforme | 3 puntos + rim + bruma |
| (video) turntable o estático | dolly-in + paralaje + vida del sujeto |

---

## 7. Vocabulario para Gemini (imagen) y Veo (video)

**Imagen (keyframe) — pegar lo que aplique:**
```
strong real perspective, clear vanishing point, wide-angle lens, low three-quarter camera
angle near the floor, infinite coordinate grid floor receding to a misty horizon (large
squares in foreground shrinking to the distance), deep focus, foreground anchor, layered
depth (foreground / midground / background), atmospheric haze at the horizon, rim light
separating the model from the dark void, ambient occlusion contact shadows.
NOT isometric, NO finite floating plate, NO base/sheet edges, NO measurement axes, NO
tilt-shift miniature, NO shallow depth of field on the building.
```

**Video (Veo) — describir movimiento, no la escena:**
```
slow cinematic dolly-in along the floor toward the vanishing point; strong parallax — the
foreground grid sweeps past faster than the distant horizon; the whole structure scales up
together as the camera approaches (Inception-style), nothing left behind; [subject motion:
trucks driving in, forklift working, people busy]; steady easing, premium pace.
```

---

## 8. Checklist de 8 puntos (correr antes de aprobar cada b-roll)

1. ¿Hay **punto de fuga**? (si las líneas son paralelas → isométrica → rehacer)
2. ¿El suelo es **infinito a un horizonte brumoso** (no una placa con bordes)?
3. ¿Cámara **baja 3/4 + gran angular** (no alta + tele)?
4. ¿**Cuadros de la malla grandes adelante** y chicos al fondo?
5. ¿Hay **capas** (primer plano / medio / fondo) y un **ancla de primer plano**?
6. ¿**Escala humana** correcta que venda el tamaño real?
7. ¿**Rim light** separando del vacío + **bruma** atrás?
8. (video) ¿**Dolly-in + paralaje + vida del sujeto**, sin turntable?

Si alguno falla, es uno de los "errores básicos" — corregir antes de pasar a video.

---

*Documento vivo. Anclas de referencia: ✅ `capturas/servilleta/15.png` (puente, suelo
infinito en perspectiva) · ✅ `capturas/servilleta/1.png` y `6.png` (geometría de malla en
perspectiva, cuadros grandes→chicos) · ❌ `capturas/reel-home/3.png` (placa finita = maqueta,
el error a no repetir).*
