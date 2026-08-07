# Investigación — Estilo de gráficas explicativas para CreaTuActivo

Investigación propia (Claude Code, jun 2026) sobre **qué estilo de gráfica** sirve mejor
para explicar nuestros conceptos en reels, video de servilleta, home y piezas de marca.
Para contrastar con la investigación paralela del agente Gemini.

Doble fuente: (1) **evidencia empírica nuestra** — qué generó la IA que aprobamos vs. qué
rechazamos; (2) **literatura** de diseño de explicación y persuasión visual.

---

## 0. Conclusión primero (TL;DR)

El estilo ganador para nosotros es el de **`servilleta/7.png`**: lo llamo

> **"Maqueta Técnica Premium"** — modelos 3D grises mate, aristas blancas nítidas,
> caras suavemente sombreadas, sobre **piso de cuadrícula en perspectiva**, fondo negro
> mate. Realismo arquitectónico tipo *maqueta de estudio* / *blueprint con volumen*.
> Cero efectos de luz. El **orbe dorado** entra solo cuando hace falta el héroe.

No es claymation (demasiado "humano/juguetón" para una firma de patrimonio), no es
flat/isométrico de startup (demasiado "app juguetona"), no es el wireframe de línea plana
(se ve infantil), y **no es** el render con partículas/bloom/speed-lines (se ve "fantasía
de los años 30", el error de 3–5.png).

---

## 1. Evidencia empírica — el experimento que ya corrimos

| Pieza | Veredicto | Por qué |
|-------|-----------|---------|
| `servilleta/7.png` (fábrica + ciudad + camiones en maqueta gris) | ✅ **premium, fino** | Formas 3D **sólidas con caras sombreadas**, vehículos realistas, figuras bien proporcionadas, piso de cuadrícula. Lectura instantánea. |
| `servilleta/6.png` (fábrica + personas + montacargas) | ✅ premium | Mismo ADN: dimensional, sólido, sin efectos. |
| `capturas/dan-koe/48.png` (malla densa + camino + checkpoints) | ✅ "la malla se ve espectacular" | Densidad geométrica con volumen = autoridad, no adorno. |
| `servilleta/3.png · 4.png · 5.png` (puente con estallido dorado) | ❌ **"fantasía, trabajo para niños"** | Partículas doradas, fuegos artificiales, speed-lines radiales, neblina, bloom + estructuras de **línea plana**. |

**Detonantes confirmados del look "fantasía"** (eliminar siempre que se busque premium):
`glowing particles`, `light burst / fireworks`, `comet trail`, `speed lines`,
`lens bloom`, `volumetric haze`, `neon glow`, `dreamy/fantasy lighting`, y estructuras
como **outline plano** (sin caras sombreadas).

**Lo que sí da premium:** formas dimensionales **sólidas** (caras grises + aristas
blancas), perspectiva real (no isométrica plana), piso de cuadrícula como anclaje
espacial, negro mate, y **una sola** fuente de calidez (el orbe) cuando se necesita héroe.

---

## 2. Qué dice la literatura (y cómo lo aplicamos)

### 2.1 "Show, don't tell" tiene respaldo medible
Gráficas bien diseñadas reducen la **carga cognitiva 30–50%** vs. solo texto (Clark &
Lyons; teoría de doble codificación de Paivio: canal visual + canal verbal en paralelo).
→ **Implicación nuestra:** la gráfica debe explicar el concepto **sin depender del texto
ni del audio** (criterio que Luis ya exige: "el mensaje debe entenderse sin texto"). La
narración refuerza, no carga el peso.

⚠️ Advertencia de la misma literatura: combinar mal imagen + texto **aumenta** la carga
(clutter). → Una idea por gráfica. Si la escena necesita leyenda para entenderse, está mal
diseñada (es el **Test Beto / abuela de 75** del CLAUDE.md, ahora con base científica).

### 2.2 Metáfora visual = más recordación y más persuasión
La retórica metafórica visual sube **recall** e **intención de compra**. Matiz clave del
estudio: las metáforas **concretas** se entienden más fácil; las **abstractas** persuaden
más *pero solo si están ancladas* por el copy/titular.
→ **Implicación nuestra:** nuestras metáforas deben ser **concretas y autoexplicativas**
(fábrica ↔ ciudad ↔ camiones = "conecta fabricantes con personas"; laberinto = la trampa;
casas → orbe = renta recurrente). Lo abstracto (orbe, malla) funciona porque el contexto
de la pieza lo ancla. Evitar metáfora abstracta **sin** anclaje → no comunica.

### 2.3 Por qué NO los estilos vecinos
- **Claymation / 3D Clay:** construye confianza por "calidez humana/artesanal" y es fuerte
  en fintech *editorial*. Pero su lenguaje es **suave/juguetón** → choca con "firma de
  patrimonio / private equity". Lo descartamos como estilo base (podría servir, con cautela,
  para una pieza emocional puntual, nunca para explicar el sistema).
- **Isométrico flat:** "playful yet professional", fácil de loopear/reutilizar — por eso lo
  aman las apps. Justamente por eso se siente **a startup/SaaS juguetón**, no a lujo. Útil
  como *recurso de loop* puntual, no como piel de marca.
- **Ultra-realista (B2B SaaS):** "la opción más segura, transmite autoridad" — pero es
  genérico y caro, y pierde nuestra **firma** (orbe dorado + trazo). Nuestra maqueta técnica
  conserva autoridad **con** identidad propia.

→ La "Maqueta Técnica Premium" es el punto dulce: **autoridad del realista + identidad
propia + claridad de la metáfora concreta**, sin la frialdad genérica ni lo juguetón.

---

## 3. El sistema recomendado (piel única, motivo variable)

**Constante (la piel de marca):**
- Negro mate `#0F1115`, profundidad negativa, viñeta sutil.
- Modelos 3D **grises mate** con **aristas blancas/plata nítidas** y caras sombreadas
  (NO outline plano).
- **Piso de cuadrícula en perspectiva** como anclaje espacial recurrente (firma reconocible).
- **Orbe dorado** = único elemento cálido = el héroe/usuario. Aparece solo cuando la pieza
  necesita protagonista; las gráficas de "mundo/sistema" pueden ir sin él (como 6/7.png).
- Cámara inmersiva (dolly-in) en video; perspectiva real en imagen.
- **Prohibido permanente:** partículas, bloom, fuegos, speed-lines, neblina, neón, fantasía.

**Variable (el motivo, según el mensaje del beat):**

| Concepto | Metáfora concreta recomendada | Notas |
|----------|-------------------------------|-------|
| **Qué es empresa digital** | Fábrica ↔ ciudad/personas + camiones cruzando (7.png) | "puente que conecta fabricantes con personas". Lectura izquierda↔derecha. |
| **Negocio de toda la vida** | Una sola tienda/local + UNA figura amarrada a la persiana | contraste: si la persona se va, baja la persiana (depende de su presencia). |
| **Cómo lo hacemos nosotros** | Los 3 pilares como 3 estructuras + camino que los une | Respaldo (fábrica/globo) · Queswa (orbe+ecualizador) · Método (checklist con ✓). |
| **Matriz física (Gano)** | Globo monumental + complejo industrial isométrico (49.png) | "el músculo / AWS físico". Confianza + cool tipo Apple. SIN personas/red (anti-MLM). |
| **La AI (Queswa)** | Orbe + ondas/ecualizador convirtiendo nodos rojo→verde | grita CONVERSIÓN, no "robot". |
| **La metodología** | Tarjetas PASO 01–03 con ✓ dorado en cascada (48.png) | pasos exactos = método comprobado. |
| **Ciclo "trabajar, pagar, repetir"** | Laberinto/circuito cerrado, orbe girando con estela, **sin salida** | la trampa. La estela hace visible el "repetir". |
| **La solución / salida** | Portal dorado: el orbe **sale** del loop | reservado al beat de solución (contraste contra el laberinto). |

Regla de oro (ya en la guía, ahora respaldada): **lo universal es constante; el motivo
cambia.** Eso da una marca que se reconoce pieza tras pieza sin volverse monótona.

---

## 4. Implicaciones de producción (qué ajustar)

1. **`GUIA_IDENTIDAD_VISUAL_IA.md`:** agregar "Maqueta Técnica Premium" como el estilo base
   confirmado + la lista negra de detonantes de fantasía + caras sombreadas obligatorias
   (no outline plano). Anclas nuevas: `servilleta/6.png` y `7.png`.
2. **Imágenes:** generar el keyframe con **7.png como referencia de estilo** y solo cambiar
   composición/motivo. La referencia mantiene la identidad; no se re-acuña por texto.
3. **Video:** dolly-in premium, todo escala junto (Inception), camiones avanzando — **sin**
   partículas. El error de 3–5 fue pedirle a Veo "luz/partículas".
4. **Una idea por gráfica.** Si requiere leyenda, rediseñar (carga cognitiva).
5. **Watermark ✦** de Gemini: tapar con el logo-bug del pipeline `dankoe-video`.

---

## 5. Para contrastar con Gemini

Puntos donde quiero ver si Gemini coincide o aporta:
- ¿Confirma "maqueta técnica/blueprint con volumen" sobre clay/isométrico/flat para una
  marca de patrimonio? (mi apuesta: sí).
- ¿Propone una **referencia de marca** análoga (Apple, firma de PE, Kurzgesagt premium,
  estudios de motion) que valide o eleve la piel?
- ¿Sugiere paleta/acento más allá del dorado único? (mi recomendación: mantener un solo
  acento cálido; más color diluye el lujo).
- ¿Aporta principios de *legibilidad en 9:16 mobile* (tamaño mínimo de figura, zona segura
  de tercio superior) que deberíamos codificar?

---

*Fuentes (literatura):*
- *Animation style por marca (clay = premium/editorial; ultrarrealista = autoridad B2B):*
  [hyphemotion](https://www.hyphemotion.com/how-to-choose-animation-style-for-brand-video/) ·
  [A+C claymation](https://aplusc.tv/blog/rethink-brand-animation-the-claymation-advantage/)
- *Isométrico vs perspectiva (iso = playful/loopable; perspectiva = realismo humano):*
  [Linearity](https://www.linearity.io/blog/isometric-design/) ·
  [garagefarm](https://garagefarm.net/blog/isometric-animation-breathing-life-into-stylized-worlds)
- *Doble codificación / carga cognitiva (−30–50% vs texto):*
  [cloudassess](https://cloudassess.com/blog/dual-coding-theory/) ·
  [structural-learning](https://www.structural-learning.com/post/dual-coding-a-teachers-guide)
- *Metáfora visual → recall + persuasión (concreta = clara; abstracta = persuade si anclada):*
  [efecto persuasivo (PDF)](https://www.academia.edu/59950076/The_Persuasive_Effect_of_Using_Visual_Metaphors_in_Advertising_Design) ·
  [neurofisiológico (PMC)](https://pmc.ncbi.nlm.nih.gov/articles/PMC7235424/)
