# Reto de 90 días — Investigación de narrativa y cumplimiento (Claude, 2 sep 2026)

> **Qué es este documento:** investigación paralela a la de Gemini (`Análisis Narrativas Retos Comerciales.md`, misma carpeta) sobre el video ancla del reto de 90 días del Director, más el **cruce de las tres fuentes** (esta investigación, la de Gemini y la doctrina interna del proyecto). Al final: la arquitectura de apuesta resultante y **los problemas abiertos que el equipo debe resolver**.
>
> **Contexto del caso:** Luis Cabrejo (Pereira) documentará en vivo, 90 días, la construcción de un canal de distribución desde cero, arrancando con el Kit de Inicio ($443.600 COP — cifra verificada contra `getPinKitInicio`, la misma que dicta Queswa). Contexto real: terremoto hace un mes, desalojo del apartamento, familia temporalmente en tres ciudades. Distribución: video ancla en feed IG/FB + historias diarias + Meta Ads (interacción y luego CTWA). Restricción dura: vertical de mercadeo en red, y el WABA de Queswa cuelga de la misma cuenta de negocio verificada que la pauta.

---

## INFORME 1 — Casuística de narrativas de reto documentado (agente de investigación Claude)

### 1. Tabla de casos

| Caso | (a) Apuesta explícita | (b) Reglas verificables | (c) Hándicap | (d) Costo público de fallar | (e) Cadencia y retención entre entregas | (f) Datos de audiencia |
|---|---|---|---|---|---|---|
| **Undercover Billionaire T1** (Glenn Stearns, Discovery 2019) | $100 → empresa valuada en $1M en **90 días**, en Erie, PA | Solo $100, un carro y un tanque de gasolina; **identidad oculta** ("Glenn Bryant"); valuación final por tasador externo | Billonario sin su nombre, sin su red, sin su capital, en una ciudad deprimida del Rust Belt; además disléxico, hijo de alcohólicos — el underdog dentro del billonario | **$1M de su bolsillo** si fallaba — y falló: Underdog BBQ se tasó en **~$750.000**, y Stearns pagó el millón en cámara | Semanal, 8 episodios; cada episodio = crisis nueva; el reloj de 90 días como marcador permanente | Estreno 1,04M espectadores; ep. 2 1,14M; valle 0,80M; **final 1,04M** — retención casi plana en 8 semanas, raro en cable |
| **Undercover Billionaire T2** (Cardone, Idlett-Mosley, Culotti, 2021) | Misma cifra: $100 → $1M en 90 días, tres protagonistas | Iguales en papel | Mucho más débil: tres "empresarios de marca personal" ya mediáticos; sin anonimato ni arco underdog | Igual en papel (menos creíble: la audiencia sospechaba show de marketing personal) | Semanal | Estreno **0,40M** — **~60% menos que T1 con la misma apuesta**. El spinoff *Comeback City* (sin apuesta) duró 1 temporada |
| **MrBeast** | Apuesta por video: cifra + condición binaria | Reglas simples anunciadas en los primeros ~20 s; resultado verificable en cámara | Lo imposible o carísimo | El dinero comprometido en cámara; fallar el "wow" = perder al espectador | Doc interno filtrado (36 págs.): primeros 3-5 s cumplen título/miniatura; primeros 20 s = contexto + stakes + brecha de curiosidad; **re-enganche al minuto 3**; mini-arcos completos | Canal principal >300M subs |
| **Gary Vaynerchuk — Trash Talk** (2018) | Sin apuesta única: demostración recurrente de flipping ($75 → ~$1.000) | Compra en cámara, precios visibles, reventa en eBay | Bajo: Gary no arriesga nada | **Ninguno** — sin meta, sin fecha, sin castigo | Episódica, sin arco serial | La serie se desvaneció sin final anunciado. **Contraste: mismo carisma, sin apuesta → sin tensión serial** |
| **Alex Hormozi / Dan Koe** (documentación sin reto) | Ninguna apuesta; la "prueba" es el portafolio real o el proceso mental | La credibilidad sustituye a las reglas: cifras propias auditables | Se reemplaza por densidad de valor por minuto | Reputacional difuso | Hormozi: hook–retain–reward; Koe: cadencia fija. Retiene la **identidad aspiracional**, no el suspenso | Koe: ~2,6M de audiencia agregada |
| **Pieter Levels — 12 startups in 12 months** (2014) | 12 productos en 12 meses, uno cada 30 días | Deadline mensual público e inapelable; ingresos publicados | Solo, sin financiación, sin equipo | "Anunciarlo públicamente hizo que rendirse fuera mucho más difícil — internet estaba mirando" | Cada lanzamiento = entrega + hito; de ahí salieron NomadList y RemoteOK | Caso fundacional del indie hacking |
| **Nathan Barry — Web App Challenge** (2013) | $0 → **$5.000 MRR en 6 meses** | Máximo $5.000 de dinero propio; MRR publicado en su blog | En paralelo a su negocio, sin experiencia SaaS | Reputación en su propio blog | Posts periódicos con el MRR exacto como marcador | **Perdió la apuesta** ($2.480 a los 6 meses) y la audiencia se quedó — ConvertKit llegó a $2,1M/mes; la serie es su mito fundacional |
| **Romuald Fons** (España) | "De 2,48€/mes a millones" documentando proyectos SEO desde cero | Proyectos, tráfico y facturación en pantalla | Empezó quebrado | Reputacional (proyectos auditables por otros SEOs) | Serie continua "montar negocio desde 0" | >1M subs; lanzamiento CreceTube >1M€ en una semana |
| **Adrián Sáenz** (España) | Documentar cada negocio "desde cero" | Enseña cuentas en video | Empezó a los 12, sin capital | Reputacional | Documentación continua de ventures | ~2,4M subs (fuentes secundarias) |
| **Formato "Día 1/30" TikTok hispano** | Micro-retos con conteo de días | El conteo de días es la regla; el negocio se ve crecer en cámara | Emprendedor anónimo sin recursos | Abandonar la serie es visible | Diaria — el número de día es cliffhanger y marcador | Patrón de formato masivo (#emprendedora 2,8M posts), sin caso estrella verificable |
| **FRACASOS: UB T2, Comeback City, movimiento Open Startup** | Dashboards públicos de MRR **sin apuesta ni fecha** | — | — | — | — | Open Startups de Baremetrics: de 25-30 empresas a **6**; "la era dorada del open startup se acabó". **Números solos, sin partido, no retienen** |

### 2. Ranking de resortes

**Detienen el scroll:** (1) la **asimetría enunciable en una frase** — "billonario con $100" — que es el hándicap comprimido, no la cifra sola; (2) la cifra + el reloj como titular (stakes en los primeros ~20 s, MrBeast); (3) la promesa de **veredicto binario** — no es un vlog, es un partido.

**Hacen volver durante semanas:** (1) el **marcador verificable** entre entregas (día X/90, MRR exacto) — sin marcador no hay partido; (2) el **costo público de fallar** — y perder la apuesta **no mata la serie, la valida** (Stearns pagó, Barry siguió reportando; en ambos casos el fracaso parcial aumentó la credibilidad); (3) las **reglas autoimpuestas que vuelven árbitro al espectador**; (4) el cliffhanger / bucle abierto (efecto Zeigarnik); (5) la identificación parasocial con el underdog; (6) cadencia fija — necesaria pero no suficiente (Trash Talk la tenía).

### 3. Veredicto sobre la hipótesis

**Confirmada, con una precisión.** El experimento natural más limpio: la T2 de Undercover Billionaire mantuvo exactamente la misma cifra y plazo y perdió ~60% de audiencia — lo que cambió fue el hándicap y la credibilidad del costo. La precisión: a la tríada (hándicap + reglas + costo de fallar) le falta un cuarto elemento para la retención serial, **el marcador** — la cifra importa no como promesa sino como *progreso medible entre entregas*. La cifra prometida vende el episodio 1; el marcador + la tríada venden los episodios 2 a 90.

### 4. Hallazgo estratégico

**En el mercado hispano no existe un caso con nombre que combine reto formal (apuesta + reglas + castigo) con documentación de negocio real.** Hay retos (HotSpanish) y hay documentación (Fons, Sáenz, Oller), pero la combinación tipo Stearns/Barry es un hueco. Primer jugador disponible.

### Datos no verificados (informe 1)

Valuación exacta de Underdog BBQ (prensa secundaria); cifras de Sáenz (fuentes promocionales); final de Trash Talk; audiencia de Levels en 2014 (su propio relato).

---

## INFORME 2 — Filtro regulatorio: Meta + Colombia (agente de investigación Claude)

### A. Meta

- **"Unrealistic Outcomes" ya no existe como política independiente** — absorbida en "Unacceptable Business Practices" (fraude). Texto vigente: prohibido *"use deceptive or exaggerated claims about the success of a product or service"* y *"promise financial benefits by misrepresenting an entity"*. El estándar comunitario de fraude prohíbe ofertas donde *"returns are guaranteed"*, compensación basada en *"recruitment of others"*, esquemas *"get-rich-quick"* que afirmen que *"a small investment can be turned into a large amount"* — **la silueta textual de "$443.600 → 50 millones"**.
- **MLM en Facebook/Instagram Ads:** no es vertical nombrada como prohibida hoy; el criterio operativo vigente (heredado de la política histórica de income opportunities): **el anuncio que lidera con el producto/la historia pasa; el que lidera con ganancias o reclutamiento cae**.
- **WhatsApp es el punto crítico:** la Política de WhatsApp Business **lista textualmente "marketing multinivel" como industria prohibida** para los Servicios de WhatsApp Business. El enforcement práctico es por señales (reportes, bloqueos, quality rating), no por auditoría del modelo — pero la base normativa contra el WABA existe y es literal. Desde **oct 2025 los límites de mensajería se administran por Business Portfolio, no por número**: la salud del portafolio publicitario y la del canal quedaron acopladas.
- **Atributos personales:** prohibido implicar condiciones del espectador, incluido *"vulnerable financial status"*. El problema no es el pronombre "usted" sino implicar que se sabe algo de quien mira. **La narración en primera persona es estructuralmente inmune.**
- **Rechazos:** uno aislado no penaliza; el **patrón** de rechazos/reintentos escala a cuenta → Business Portfolio. **Nunca re-someter un creativo rechazado con maquillaje** (Meta lo lee como evasión → restricción permanente); editar de fondo o apelar una vez.
- **CTWA:** revisión estándar de anuncios + las políticas del destino (WhatsApp). Sin evidencia de capa de revisión adicional.

### B. Colombia

- **Ley 1480 art. 29:** las condiciones objetivas y específicas anunciadas **obligan al anunciante**. Art. 30: prohibida la publicidad engañosa; sanciones hasta 2.000 SMLMV.
- **Ley 1700 art. 5 (núms. 7-8):** la información sobre beneficios al prospecto de vinculación debe ser "clara y precisa", sin inducir a confusión ni inflar expectativas.
- **⭐ Precedente exacto — caso Cossio:** Resolución 18525 del 17 abr 2024 (confirmada en 2025), **multa $813.002.240 COP** a Grupo Cossio S.A.S. por publicidad engañosa del "Método Cossio". Frases sancionadas: *"¿Qué van a pensar ustedes ya en cinco meses? … tapados en plata"* y *"los 49 dólares los pueden librar con su primer video"*. Primera persona, **en sus propias redes, sin pauta** — lo orgánico NO eximió. Criterio SIC: la función del mensaje, no el pronombre — si el resultado propio se ofrece como espejo del resultado del comprador, es afirmación objetiva.
- **La escapatoria doctrinal:** las **aspiraciones subjetivas** ("mi meta personal", sin presentarla como resultado esperable para quien imite) no obligan y no pueden ser engañosas. Y la Guía de influenciadores SIC protege la **documentación honesta de experiencia real** — el formato documental es escudo legal, no solo formato creativo.

### C. Clasificación de formulaciones

| # | Formulación | Pautada | Orgánica | Legal CO |
|---|---|---|---|---|
| 1 | "50 millones mensuales en 90 días, empezando con $443.600" | 🔴 | 🟠 | 🔴 (patrón Cossio; art. 29 la vuelve exigible) |
| 2 | "Documentar 90 días; mi meta personal, sin fecha: 50 millones" | 🟡 (cifra grande = flag automatizado; nunca en overlay/primeros 3 s) | 🟢/🟡 | 🟡-🟢 (aspiración subjetiva) |
| 3 | "Si en 90 días no logro [hito verificable] → [castigo público]" | 🟡 (🟢 si el hito NO es de ingreso) | 🟢 | 🟢 |
| 4 | "¿Se puede construir una empresa desde cero, hoy? Lo documento 90 días" | 🟢 | 🟢 | 🟢 |
| 5 | Metas de proceso sin cifra de ingreso ("al día 90 esta empresa existirá, con clientes reales y operación andando") | 🟢 | 🟢 | 🟢 (cuidando que al día 90 sea cierto — art. 29 obliga) |

**Advertencia transversal:** el mayor riesgo estructural no está en ninguna frase sino en el **destino** (WABA + prohibición textual de multinivel en la política de WhatsApp). Derivadas: creativos verdes (4/5/3), cero income claims en los primeros mensajes del hilo de WhatsApp, nunca re-someter creativos rechazados.

### Datos no verificados (informe 2)

Texto verbatim vigente de "Unrealistic Outcomes" como página propia (404); página propia de MLM en Ad Standards actuales; número de artículo exacto de la "relación de causalidad directa" en la Ley 1700; PDF completo de la Resolución Cossio; confirmación oficial de Meta de que una restricción publicitaria suspende el WABA (el acoplamiento es por arquitectura de portafolio, documentado).

---

## CRUCE DE LAS TRES FUENTES (Claude × Gemini × doctrina interna)

### Convergencia total (terreno firme)

1. **Hipótesis confirmada por triplicado:** el drama = hándicap + reglas verificables + costo público de fallar + marcador. No la cifra. (Gemini: *"la atención se monetiza a través de la tensión del proceso, no del valor del trofeo"*.)
2. **Cifra + plazo = rojo** en pauta y en orgánico (Cossio). Precio de entrada + cifra de resultado nunca en el mismo bloque.
3. **El CTA pautado es documental** ("acompáñeme"), nunca comercial ("únase"). Protege revisión y WABA.
4. **Primera persona sobre hechos propios** = inmune a atributos personales; describir la situación del espectador = rechazo.

### Lo que aporta el informe de Gemini (adoptado)

1. **El auditor escéptico** (Formulación 3 de Gemini): un comerciante/empresario tradicional y escéptico con acceso a los números, que audita en los días 30, 60 y 90 y puede declarar el fracaso. Verificabilidad externa pura + retornos programados de la audiencia + antídoto estructural contra "esto es pirámide". **La mejor idea nueva del cruce.**
2. **La regla del flujo cerrado** (Formulación 2 de Gemini): ni un peso externo al negocio; todo crecimiento sale de su propio flujo. Verificable, honesta, equivalente al tope de Nathan Barry.
3. **La dicotomía visual calle/pantalla** (Formulación 4 de Gemini): el Director en la operación física mientras la IA atiende conversaciones — motor visual de las historias diarias.
4. Caso Ryan Trahan (Penny Challenge) como referencia de cadencia diaria y reglas duras en formato corto.

### Correcciones al informe de Gemini (NO adoptar)

1. **⛔ La familia como rehén narrativo.** La Formulación 2 de Gemini condiciona el regreso de la familia al éxito del negocio. Es **falso** (la familia volverá independientemente del reto) y la audiencia lo huele — el fracaso de la T2 de Undercover Billionaire fue exactamente por autenticidad, y la Guía SIC sanciona testimonios que no correspondan a la experiencia real. La familia repartida es contexto legítimo del gancho; **jamás la apuesta**.
2. **⛔ Jugar al pobre.** *"Me quedan 443.600 pesos de presupuesto para reorganizar nuestra vida"* insinúa que ese es todo el capital del Director, y no lo es. La solución es la de Stearns: **transparencia con la asimetría** — no esconder quién es, sino despojarse de las ventajas en cámara, como regla del juego: *"llevo doce años en esto y me va bien — por eso mismo lo voy a demostrar desde cero: solo $443.600, sin tocar lo que ya construí"*.
3. **Léxico:** los guiones de Gemini usan "prospectar", "bot" y prometen que la IA "opera el negocio mientras duermo" (jerga de gremio + promesa de esfuerzo mínimo, silueta sancionada). Lo que se dice de Queswa es lo que hace: **conversa, resuelve dudas y madura la decisión**.
4. "MARS" como nombre del sistema de revisión de Meta viene de blogs de agencias, no de fuente oficial de Meta. Las conclusiones coinciden con las fuentes primarias; el nombre no se repite como dato.
5. Detalle: Gemini cita la Resolución 20777/2025 (confirmatoria) del caso Cossio; la sancionatoria es la 18525/2024. Misma causa.

### Arquitectura final de la apuesta

- **Gancho (asimetría honesta):** terremoto + familia en tres ciudades + un empresario al que le va bien apostando a demostrar que se puede empezar de cero con $443.600 y nada más.
- **Destino (objeto, no cifra):** al día 90 existe una empresa real — clientes reales comprando, operación andando, la maquinaria atendiendo — **declarado por el auditor, no por el protagonista**.
- **Reglas candidatas:** (1) solo $443.600, flujo cerrado; (2) sin apoyarse en la red de doce años — solo mercado nuevo; (3) todo documentado, incluidos los tropiezos.
- **Costo de fallar:** veredicto público del auditor + castigo personal por definir (real, pagable en cámara, verdadero; liberar el código fuente descartado — esa propiedad intelectual sostiene a los socios).
- **Marcador:** día X/90 + hitos de proceso semanales; cifras reales solo como hechos ocurridos, con prueba, con moderación (Ley 1700 art. 5.7).
- **Los 50 millones:** solo como "meta personal, sin fecha", solo orgánico, nunca en la misma pieza que el precio de entrada ni que los 90 días.

### Problemas abiertos (para trabajo del equipo)

1. **El castigo público:** qué apuesta el Director si el día 90 el auditor declara el fracaso. Vara: real, pagable en cámara, verdadero, sin instrumentalizar a la familia, sin comprometer la PI que sostiene a los socios.
2. **El auditor:** quién — comerciante/empresario local, escéptico genuino, con credibilidad propia y sin conflicto de interés. Mecánica de acceso a los números.
3. **La(s) regla(s) del hándicap:** flujo cerrado, sin red existente, o ambas. Evaluar viabilidad operativa de "sin red" para el negocio real.
4. **Cifras reales durante el reto:** si se muestran (como hechos ocurridos con prueba) o si el marcador público se mantiene solo en proceso.
5. **Secuencia de pauta:** interacción pequeña sobre el video ancla (prueba social) → CTWA con el reto rodando. Creativos siempre en las casillas verdes.

### Fuentes principales

Informe 1: Wikipedia/Nielsen (Undercover Billionaire), doc interno MrBeast (filtrado 2024, vía Simon Willison/Tubefilter), garyvaynerchuk.com, nathanbarry.com, levels.io, testimonial.to ("The golden era of being an open startup is gone"), La Nación (Fons), investigación sobre cliffhangers (ResearchGate 2022) y efecto Zeigarnik.
Informe 2: transparency.meta.com (Unacceptable Business Practices · Community Standards Fraud · Personal Attributes · Prohibited Financial Products · Restricting Accounts), WhatsApp Business Policy (es-la), developers.facebook.com (CTWA), funcionpublica.gov.co (Ley 1480, Ley 1700), sedeelectronica.sic.gov.co (caso Cossio), Guía SIC de influenciadores, Chatarmin (límites por portafolio oct 2025), guías de agencias (Stackmatix, SuperAds, GetKanal).
El informe de Gemini con sus fuentes: `Análisis Narrativas Retos Comerciales.md` (misma carpeta).
