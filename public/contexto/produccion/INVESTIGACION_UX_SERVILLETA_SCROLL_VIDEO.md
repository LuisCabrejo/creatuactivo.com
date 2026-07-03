# Investigación UX — Servilleta: scroll lateral, diapositivas y control de los clips de video

**Fecha:** 2 jul 2026
**Contexto:** Deck `/servilleta` v6.4. Slides 1 y 2 son *card-scrollers* con b-rolls 3D en autoplay/loop. El Director reporta una fricción concreta en la práctica: al dar **un clic simple sobre el clip esperaba que se pausara** (no pasó nada), y su intuición dice que el gesto correcto es **lateral** (swipe) — pero pausar al toque le parece necesario. Pregunta central: *¿cuál es la experiencia que los usuarios realmente esperan aquí?*

---

## 0. TL;DR (la conclusión antes del razonamiento)

1. **El instinto del Director es correcto y coincide con el estándar de la industria.** En video vertical a pantalla completa (Stories, Reels, TikTok, Shorts) el **toque simple ES el control primario**. La convención dominante 2024–2026 es: **tap = pausar/reanudar**. Que hoy no pase nada al tocar es una expectativa rota (*broken affordance*).
2. **Hoy el deck mezcla dos modelos mentales** — "diapositivas que avanzo con flecha/swipe" (PowerPoint/Keynote) y "video social que se controla al tocar" (Stories/TikTok). El usuario no sabe cuál está usando → duda → fricción.
3. **El video en autoplay-loop sin control es la causa raíz.** El usuario perdió el control del tiempo: el clip avanza solo, se repite solo, y no hay forma visible de detenerlo para mirar un detalle o para narrar en vivo sobre él.
4. **Recomendación:** hacer del **tap = pausa/play** el gesto primario, con un **indicador de progreso** por card (barra tipo Stories) y **reservar el swipe lateral para cambiar de card/slide**. Separar los dos gestos por eje elimina la ambigüedad.

---

## 1. El problema real: dos modelos mentales en colisión

Donald Norman (*The Design of Everyday Things*) llama a esto el **golfo de ejecución**: la distancia entre lo que el usuario *quiere hacer* (detener el clip) y lo que el sistema *le deja hacer* (nada al tocar). Cuando el objeto en pantalla es un **video a pantalla completa vertical**, el cerebro del usuario ya trae cargado un modelo mental: el de las apps donde vive ese formato.

| Modelo mental | De dónde viene | Qué espera el usuario |
|---|---|---|
| **Deck de diapositivas** | PowerPoint, Keynote, Google Slides | Flecha/espacio/clic **avanza**; el contenido es estático |
| **Video social vertical** | Instagram Stories, TikTok, YouTube Shorts, Reels | **Tap = pausa/play**; **swipe vertical** = siguiente; **tap lateral** = saltar |

La servilleta v6.4 **se ve** como el segundo (clip 9:16 a pantalla completa, autoplay, loop, sin cromo de "slide") pero **se comporta** como el primero (el clic solo sirve para avanzar/no hace nada; el video no se controla). Ese desajuste es exactamente lo que produjo la reacción "*le di clic y esperaba que pausara*".

> **Principio (Jakob Nielsen, "Jakob's Law"):** los usuarios pasan la mayor parte de su tiempo en *otras* interfaces. Traen a la tuya las expectativas formadas por Instagram y TikTok. Pelear contra esa convención es caro y casi siempre se pierde.

---

## 2. Qué esperan los usuarios de un clip de video (evidencia por plataforma)

Las convenciones de video vertical están **fuertemente estandarizadas** — es un patrón que miles de millones de personas ya tienen memorizado:

- **Instagram / Facebook Stories:** *tap-hold* (mantener) pausa; *tap* en el borde derecho avanza, borde izquierdo retrocede; **barras de progreso segmentadas** arriba muestran cuántas piezas hay y cuánto falta de la actual.
- **TikTok / Reels / Shorts:** **un tap simple pausa/reanuda** (con un ícono ▶︎ efímero que confirma el estado); el **swipe vertical** cambia de video. El progreso es una **barra fina inferior** arrastrable (*scrubber*).
- **YouTube (player):** tap muestra controles; centro = play/pause. Controles auto-ocultos.

**Denominador común across plataformas:**
1. El **toque** siempre hace *algo* inmediato y visible sobre la reproducción (nunca "nada").
2. Existe **feedback visual del estado** (ícono play/pausa momentáneo).
3. Hay un **indicador de progreso** que le dice al usuario "esto se está moviendo y termina aquí".
4. El gesto de **navegar** entre piezas está **separado** del gesto de **controlar** la pieza (distinto eje o distinta zona).

La servilleta hoy incumple los cuatro. La percepción del Director no es una preferencia personal — es el reflejo de un estándar aprendido.

---

## 3. El conflicto tap vs. swipe (y por qué la ambigüedad cuesta)

Investigación de **Nielsen Norman Group** sobre carruseles y gestos táctiles converge en tres hallazgos aplicables:

1. **Los gestos son "invisibles".** Un swipe no tiene affordance visual: el usuario no *ve* que puede deslizar. NN/g documenta que los carruseles con navegación solo-por-swipe tienen baja tasa de descubrimiento. → Hace falta una **señal visible** (dots, flechas, una card "asomando" en el borde) de que hay más contenido y de cómo llegar a él.
2. **Un mismo gesto no debe tener dos significados en la misma zona.** Si el tap a veces avanza la slide y a veces debería pausar el video, el usuario nunca predice el resultado → **ansiedad de interacción** (Baymard: la impredecibilidad es una de las causas top de abandono en móvil).
3. **Fitts + zonas de pulgar (thumb zones):** en móvil vertical el pulgar alcanza cómodamente el **centro y la mitad inferior**. Controles de reproducción viven bien ahí; la navegación entre secciones puede ir a bordes o a un swipe claro.

**Aplicación al deck:** hoy conviven el swipe horizontal (cambiar de *slide* del deck: 01→02→03→04), el swipe/scroll para cambiar de *card* dentro del slide, y el clic (que el usuario esperó que pausara). Son **tres intenciones sobre gestos que se pisan**. La solución no es agregar controles: es **asignar un eje/zona a cada intención**.

---

## 4. La tensión específica de esta página: es a la vez *pitch en vivo* y *auto-navegable*

La servilleta tiene **dos contextos de uso** y eso agrava todo:

- **(A) Presentación 1-a-1 en vivo** (Luis narra sobre el clip). Aquí el autoplay-loop es **el enemigo**: el presentador necesita **congelar** un b-roll mientras habla, sin que se repita ni salte. Necesita *pausa deliberada*.
- **(B) El prospecto la explora solo** (comparte el link). Aquí quiere avanzar a su ritmo, mirar, volver a ver un clip. Necesita *control de reproducción + navegación clara*.

Ambos contextos piden **lo mismo**: devolverle al humano el control del tiempo del clip. El autoplay-loop se lo quitó. (Nota: el ajuste de "reiniciar desde 0s al volver a una card" ya empuja en la dirección correcta — pero sin pausa, el usuario sigue sin poder *detenerse a mirar*.)

---

## 5. Recomendaciones (priorizadas)

### 🟢 P1 — Tap = pausa/play sobre el clip (cierra la fricción reportada)
Un toque simple sobre el video **pausa/reanuda**, con un **ícono ▶︎/⏸ efímero** (aparece ~600ms y se desvanece) que confirma el estado. Es *exactamente* lo que el Director esperó y lo que TikTok/Reels entrenaron en el usuario.
- Implementación mínima: `onClick` del `<video>` → `paused ? play() : pause()` + overlay de ícono temporal.
- **Cuidado:** hay que **separar** este tap del tap que hoy avanza/interactúa. Regla propuesta: **tap en el área del video = play/pausa**; **cambiar de card/slide = swipe (o dots/flechas)**. Ningún tap debe "avanzar" desde el cuerpo del video.

### 🟢 P2 — Barra de progreso por card (estilo Stories)
Una barra fina que se llena con la duración del clip activo. Comunica tres cosas de golpe: "esto se mueve", "termina aquí", "vas en la card 2 de 3". Resuelve el hallazgo #3 de la sección 2 y la invisibilidad del gesto (#1 sección 3). Ya existe el contador `01/03` + dots; la barra lo eleva al estándar visual que el usuario reconoce.

### 🟡 P3 — Señal de swipe visible (affordance de navegación)
Que el usuario *vea* que hay más: card siguiente **asomando** en el borde, o flechas sutiles, o los dots más prominentes. Elimina el gesto invisible (NN/g #1). En desktop, las flechas ya existen; en mobile, el "peek" de la card vecina es el patrón más limpio.

### 🟡 P4 — Separación de ejes (consistencia de gestos)
Definir y respetar: **swipe horizontal = cambiar de card dentro del slide**; **cambio de slide del deck = flechas/dots o swipe en zona/borde dedicado**; **tap en el video = pausa**. Documentar la regla para no re-introducir ambigüedad en futuras ediciones. (Hoy el swipe ya exonera zonas interactivas del Slide 4 — misma filosofía, extenderla.)

### ⚪ P5 — Respetar el contexto "presentación en vivo"
Considerar que, en one-card-mode (presentación), el **autoplay podría arrancar en pausa** o pausarse fácil, para que el presentador controle el ritmo. Mínimo: que P1 (tap-pausa) funcione con feedback grande y visible en fullscreen.

---

## 6. Lo que NO se recomienda

- **Controles nativos del navegador** (`controls` del `<video>`): rompen la estética Lujo Silencioso y el letterbox carbón. La barra de progreso custom (P2) da el control sin el cromo feo.
- **Auto-advance por tiempo entre slides** (kiosco): NN/g es contundente en que el auto-rotado de carruseles frustra — el usuario pierde el control y no alcanza a leer/mirar. Mantener el avance **iniciado por el usuario**.
- **Doble-tap para pausar** u otros gestos "ocultos": añaden carga de aprendizaje. El tap simple es lo aprendido.
- **Sobre-explicar con tutoriales/coach-marks**: si hace falta un tutorial para saber que se puede pausar, el diseño falló. La convención debe bastar.

---

## 7. Fundamento (fuentes y principios)

- **Nielsen Norman Group** — investigación sobre carruseles (baja interacción, gestos invisibles, el auto-rotado como anti-patrón) y sobre affordances táctiles en móvil.
- **Baymard Institute** — impredecibilidad de gestos como causa de abandono en flujos móviles; expectativa de feedback inmediato.
- **Don Norman**, *The Design of Everyday Things* — golfos de ejecución/evaluación; feedback; affordances y significantes.
- **Jakob Nielsen**, "Jakob's Law of the Internet UX" — los usuarios transfieren expectativas de las interfaces dominantes (Instagram/TikTok) a la tuya.
- **Convenciones de plataforma** (Instagram/Facebook Stories, TikTok, YouTube Shorts, Reels) — estándar de facto para video vertical a pantalla completa: tap=pausa, barras de progreso segmentadas, swipe=navegar.
- **Ley de Fitts / thumb zones (Steven Hoober)** — ergonomía del pulgar en móvil vertical para ubicar controles.

---

## 8. Siguiente paso sugerido

Implementar **P1 (tap = pausa/play con ícono efímero)** primero — es de bajo costo y cierra exactamente la fricción que el Director sintió. Seguido de **P2 (barra de progreso)** para completar el modelo mental "video social" que el formato ya promete. P3/P4 pulen la navegación. Validar en vivo (contexto A) y compartiendo el link a un prospecto real (contexto B).
