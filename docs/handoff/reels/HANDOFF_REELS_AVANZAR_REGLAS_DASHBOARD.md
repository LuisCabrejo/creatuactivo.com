# HANDOFF — Reels de Prospección "AVANZAR" y "REGLAS" (para el agente del Dashboard)

> **Propósito.** Dar contexto completo de dos reels de prospección nuevos al agente Claude Code del **Dashboard (queswa.app — repo separado)**, que es donde los **socios de negocio** disponen y comparten sus reels. Mismo patrón que [`HANDOFF_REEL_PROPIO_DASHBOARD.md`](HANDOFF_REEL_PROPIO_DASHBOARD.md).
>
> **Qué son:** reels verticales 9:16, faceless, 100% 3D (maqueta técnica premium · piso oscuro de baldosas + grid · fondo carbón · matte · **orbe dorado mate = el usuario**, nunca emite luz). VO ElevenLabs "Andres Felipe" (voice_id `d2Cxiyh5zS7CQNTlRrdT`, speed 1.05). Cada reel cierra con una **palabra clave (keyword)** que el prospecto escribe → entra al 1‑a‑1 con el socio (o Queswa).

---

## Cómo los usa el socio (igual que PROPIO)
1. Dispone/descarga el reel desde el Dashboard.
2. Lo comparte a su mercado (Estados de WhatsApp, DM, redes).
3. Quien se interesa **escribe la keyword** → el Dashboard lo trata como **prospecto caliente entrante**, atribuido al socio que lo difundió.

> ⚠️ **Registro de keywords — una única por reel (no repetir).** Keywords en uso por la serie: `PROPIO`, `MOTOR`, `PARALELO`, `ENCIENDE` (ya producidos) + **`AVANZAR`** y **`REGLAS`** (estos dos). El Dashboard debe reconocerlas todas como intención entrante.

---

## REEL 1 — "AVANZAR" (la bicicleta estática)

- **Keyword (CTA):** `AVANZAR`
- **Ángulo / villano:** el villano es **el modelo**, NUNCA el esfuerzo del héroe (honra el esfuerzo). "Pedalea con todas sus fuerzas en una bicicleta estática y no avanza." Dolor = avance **financiero** que no llega por más que se esfuerce.
- **Promesa:** con el mismo esfuerzo, en el modelo correcto (una empresa digital donde la tecnología hace el trabajo pesado), sí se avanza — y lo que construye queda.

**VO — texto exacto (aprobado, QA verificado):**
> "La dificultad para avanzar financieramente, casi nunca es por falta de esfuerzo. Es el modelo: usted pedalea con todas sus fuerzas… como en una bicicleta estática. Le da y le da… y no avanza. La buena noticia: con el mismo esfuerzo, en el modelo correcto, sí se avanza. Hoy usted puede dirigir una empresa digital donde la tecnología hace el trabajo pesado — y lo que construye hoy, mañana sigue construido. Escriba la palabra AVANZAR y le muestro cómo funciona."

**Estructura visual (se entiende sin audio):** el orbe gira en un **bucle cerrado** (pedalea, no avanza) → **sale del bucle** a una recta y acelera hacia el horizonte (el modelo correcto) → **bloques ensamblándose + ciudad** (la tecnología trabajando) → CTA con el orbe avanzando + lockup **ESCRIBA / AVANZAR**.

- **Léxico:** usted · empresa digital · "avanzar financieramente" · el villano es el modelo (no el esfuerzo). Prohibido: red/MLM, ingreso pasivo, "cambiar horas por dinero".
- **Entregable (máster final):** `~/Downloads/reels-equipo/avanzar/avanzar_master.mp4` (~34.6s, con música por actos + subtítulos karaoke + lockup + marca de agua CreaTuActivo.com + outro). ✅ **Listo.**

---

## REEL 2 — "REGLAS" (el mismo tablero · ajedrez)

- **Keyword (CTA):** `REGLAS`
- **Título público: "El mismo tablero"** (decisión Director, resuelta: **convive** con el reel ENCIENDE, que conserva "La regla que casi nadie conoce" — son ángulos distintos: creencia falsa vs. dependencia del salario). Keyword `REGLAS`. **Ya no hay colisión de título.**
- **Ángulo / villano:** un mejor salario mejora el mes pero **no cambia las reglas del juego**: el ingreso **depende de su presencia**. Villano = la **dependencia**, no el esfuerzo ni el salario.
- **Promesa:** la tranquilidad no viene de ganar más, sino de **tener algo que trabaje sin usted** — otro "tablero" (una empresa digital que usted dirige, con pasos claros).

**VO — texto exacto (aprobado):**
> "Un mejor salario mejora su mes. Pero no cambia las reglas del juego: su ingreso sigue dependiendo de su presencia. Le pueden dar una pieza mejor… y el tablero sigue siendo el mismo. La tranquilidad de verdad no viene de ganar más: viene de tener algo que trabaje sin usted. Ese otro tablero hoy existe — una empresa digital que usted dirige, y se construye con pasos claros. Escriba la palabra REGLAS y le muestro cómo funciona."

**Estructura visual (se entiende sin audio):** una **partida de ajedrez real se juega** (Gambito de Rey completo, cámara orbitando = "las reglas del juego") → bajo el orbe‑peón **crece un pedestal** que lo vuelve la pieza más alta ("una pieza mejor")… la cámara se abre: **el tablero no cambió** → el orbe **despega y abandona el tablero** hacia el horizonte → **ciudad iluminada** (el otro tablero) con **contador de billetes** → CTA con el método + lockup **ESCRIBA / REGLAS**.

- **Léxico:** usted · empresa digital · ingresos recurrentes · tranquilidad. Villano = dependencia de su presencia (no el salario ni el esfuerzo). Prohibido: red/MLM, "patrimonio/estructura paralela", tuteo.
- **Entregable (máster publicable):** `~/Downloads/reels-equipo/reglas_master.mp4` (~36s con outro — VO + música por actos + contador de billetes + SFX de ajedrez por jugada + subtítulos karaoke + lockup ESCRIBA/REGLAS + marca de agua + outro). ✅ **Listo.**
- **Nota técnica:** el ajedrez es **3D por código** (Remotion/three.js, `Ajedrez3D.tsx`) — tablero y jugadas exactas, reutilizable por parámetro. No es clip de modelo de imagen.

---

## Lo que necesita el agente del Dashboard
1. **Reconocer los keywords `AVANZAR` y `REGLAS`** como intención de prospecto entrante, atribuida al socio que difundió el reel (igual que `PROPIO`/`MOTOR`/`PARALELO`).
2. Cuando existan, **las URLs/assets finales** para exponerlos en la biblioteca de reels del socio.
3. Mantener el **léxico** (usted · empresa digital · villano = modelo/dependencia, nunca el esfuerzo; sin MLM/pasivo/tuteo) en cualquier copy que el Dashboard genere alrededor de estos reels.

> **Estado de hosting:** ⏳ pendiente. AVANZAR y REGLAS tienen máster publicable. Cuando se suban a Blob/host se define la URL y se actualiza este handoff.
>
> **Contexto de negocio + doctrina general de la serie** → carpeta canónica en el repo de marketing `public/contexto/produccion/guiones/reels/prospeccion/` (README + guiones + banco de dolores).
