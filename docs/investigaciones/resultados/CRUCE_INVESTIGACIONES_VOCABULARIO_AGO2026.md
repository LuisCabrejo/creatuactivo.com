# Cruce de las dos investigaciones de vocabulario — Claude Code vs. Gemini (17 ago 2026)

Dos investigaciones independientes sobre el mismo prompt. **Convergen en la conclusión central**, que
es la validación más fuerte posible: la premisa conservadora del HANDOFF_GUARDARRAIL_SALUD era
incorrecta y estaba costando negocio.

## Lo que ambas concluyeron por separado

1. La SIC **no sanciona vocabulario de bienestar**. Sanciona adelgazamiento, enfermedad y cifras.
   (Claude: REDU FAT FAST, Natural Vitamins, Quala · Gemini añade **Intermarketing Direct**, multado
   por prometer contener "el avance rápido de la artritis" — caso nuevo, útil.)
2. Los verbos **apoya · contribuye · favorece · promueve · respalda** son el carril seguro, calcados
   del *supports* de la FDA. Ambas los marcan 🟢.
3. Línea roja idéntica: enfermedad nombrada · curar/tratar/prevenir/aliviar · cifras y plazos ·
   adelgazamiento · datos de salud del usuario.
4. El rechazo nº1 de Meta es **segunda persona + déficit** ("¿sufre usted de…?"), no la palabra
   "energía". Ambas lo señalan como el hallazgo operativo clave.
5. El descargo **no va en cada mensaje** del chat: arruina la conversión y suena a robot.
6. Técnicas de encuadre coincidentes: narrativa del ingrediente · desplazamiento de categoría
   (farmacia → lifestyle) · testimonio sensorial, no clínico · contraste con el café común ·
   el descargo como sello de credibilidad.

## El aporte real de Gemini, verificado por mí

Gemini citó las **actas de la Sala Especializada del INVIMA** (documento `invima.gov.co/biblioteca/preview/144191`).
El PDF venía con fuente subset y ningún lector lo abría; **lo descifré carácter por carácter**. Existe,
y es un catálogo oficial de declaraciones aprobadas. Extractos textuales verificados:

> "El consumo regular de colágeno, junto con una dieta balanceada y actividad física, puede contribuir
> a una adecuada salud articular." — **Acta 10 de 2017 § 3.4.2**
> "El colágeno hidrolizado junto con una dieta balanceada y actividad física contribuye a la nutrición
> del cartílago de las articulaciones, mejorando la calidad de vida."
> "La vitamina A contribuye al funcionamiento normal del sistema inmune."
> "La niacina contribuye al metabolismo energético normal / a la función cognitiva normal."

**Dos precisiones que corrigen a Gemini:**

- **Ganoderma: 0 apariciones. Antioxidante: 0. Hongo: 0.** El catálogo cubre **nutrientes**
  (vitaminas, minerales, colágeno), no botánicos. Así que el carril *legalmente blindado* nos sirve
  para **Reskine (colágeno)** y para productos fortificados — **no para el Ganocafé**. Los claims de
  Ganoderma siguen viviendo en la zona de práctica de mercado (🟡), no en la de norma aprobada.
- Gemini dice que basta "un porcentaje mínimo del Valor Diario". El documento dice, textual:
  *"Esta declaración se puede emplear si el suplemento dietario contiene el **cien por ciento (100%)**
  del valor de referencia diario"*. La barra es mucho más alta. Antes de usar una declaración de
  nutriente hay que mirar la tabla nutricional del producto.

## Donde el informe de Gemini NO se puede usar tal cual

- **Sus respuestas modelo (Entregable C) se contradicen con su propio glosario.** El Modelo 7 usa
  *"calmar las tensiones"* cuando su tabla marca **Alivia/Calma 🔴**, y ofrece *"¿le comparto algunos
  testimonios?"* — testimonios de efecto es justo lo que ninguna de las dos investigaciones permite.
- **Su ejemplo de salvaguarda (E.2) rompe la regla que él mismo escribe.** Responde nombrando la
  enfermedad (*"no sirven para curar enfermedades como la diabetes"*) y ofrece el producto
  *"para acompañar su tratamiento"* — el encuadre de coadyuvante, prohibido. Su Entregable D dice
  "la IA nunca debe generar nombres de enfermedades"; su propio ejemplo lo hace.
- **El benchmark está mayormente sin fuente.** Solo las filas de Gano Excel llevan nota, y la nota 1
  es un listado de MercadoLibre (revendedor, no fabricante) y la 3 es un SlideShare de *NBN Living*
  usado para sostener copy de **Fuxion**, que es otra empresa. Las filas de Herbalife, Omnilife, GNC,
  Nutrilite, 4Life y "marcas genéricas" no tienen cita: se leen como reconstruidas. **Para benchmark,
  usar el informe de Claude Code**, que fetcheó los sitios oficiales con cita verificable.
- Marca el *"Inhibe el apetito y elimina la grasa"* de Fuxion como "riesgo moderado que Meta tolera",
  mientras su propia tabla marca **Adelgaza/Quema 🔴**. Es el disparador nº1 de sanción en Colombia.
- Sus modelos violan la voz del canal: abren con *"¡Hola! Qué gusto saludarle"* — el prompt
  `queswa_whatsapp` prohíbe los signos de exclamación.

## Lo que sí adoptamos de Gemini

**La arquitectura del descargo (Entregable E.2)**, que es mejor que la propuesta inicial: en el chat
la leyenda **no se imprime en cada mensaje**, solo en dos condiciones — (1) cuando se envía un
documento, catálogo o ficha técnica, y (2) cuando se activa la salvaguarda de salud. En anuncios va
al final del caption; en reels, en placa final.

## Efecto neto sobre el plan

| Pieza | Cambio |
|---|---|
| **BEB_02** y fichas de producto | La reescritura propuesta se mantiene y se enriquece con vocabulario verde que ambas validan |
| **Reskine (BEB_06)** | Usa la **declaración aprobada verbatim del Acta 10 de 2017** — con sus condiciones ("junto con una dieta balanceada y actividad física"), que son parte de la declaración |
| **Leyenda** | Arquitectura de Gemini: solo documento + salvaguarda. No en cada mensaje |
| **Guardarraíl v2** | Confirmado. Su rechazo NO nombra la enfermedad — mantener, es donde Gemini falla |
| **Anuncios / socios** | Doctrina FTC: la marca responde por lo que escriben sus socios. La capa de distribuidores es donde viven los claims indefendibles |
