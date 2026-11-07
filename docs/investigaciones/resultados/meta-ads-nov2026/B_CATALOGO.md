# Investigación B — Campaña de catálogo de productos (preguntas 7, 8, 9 y 10)
### 6 de noviembre de 2026 · investigador B · alcance: solo §6, Campaña B

Todas las fuentes se leyeron el **6 nov 2026**. **VERIFICADO** = leí el texto en la fuente primaria (norma, autoridad, Meta, Gano Excel). **NO VERIFICADO** = viene de un tercero, de un resumen o de una inferencia mía, y lo marco como tal. Las copias de trabajo de lo descargado están en `scratchpad/invB/` (PDF del manual de Gano, resolución del INVIMA 2021019877, respuestas de datos abiertos, páginas de Meta ya renderizadas en `invB/pages/`).

---

## Resumen ejecutivo (lo que decide)

1. **El Ganocafé 3 en 1 ya no es suplemento dietario: es ALIMENTO** (RSA-0011698-2021, vigente hasta 2030, titular Gano Excel S.A.; datos abiertos del INVIMA actualizados el 16 oct 2026). El registro SD2012-0002589 que tenía figura **«NEGADO»**. Así que la §5 se equivoca en lo más importante: la campaña puede apoyarse en el producto estrella **sin aprobación previa del INVIMA**, porque para alimentos el control es posterior.
2. **La aprobación previa del INVIMA sigue vigente para los suplementos dietarios** (Decreto 3249/2006, art. 24, en la redacción del Decreto 3863/2008). En la práctica de 2026 la oficina virtual del INVIMA dice que el trámite «Solo aplica para Suplementos Dietarios». **No pasa lo mismo con los alimentos** (Concepto INVIMA 39/2021: «el control… en materia de publicidad de alimentos, es posterior»).
3. Un distribuidor **puede** pedir la autorización de un suplemento, pero **solo con un documento del titular del registro que lo autorice**. Se paga **por medio y por diseño**, y **cualquier cambio exige una solicitud nueva** (instructivo ASS-RSA-IN039 del INVIMA). Una pieza aprobada a Gano Excel solo sirve **idéntica**: en cuanto se le agrega precio, logo o botón, es una pieza nueva.
4. **La política de Gano Excel sí es pública, y es la restricción que más pesa.** La «Declaración de Políticas y Procedimientos» de Gano Excel S.A. (PDF de mayo de 2024, enlazado hoy en el pie de ganoexcel.com.co) exige **autorización previa y por escrito de la Compañía para toda publicidad**, también en «páginas de internet, comunicaciones por internet, redes sociales». Obliga a usar el logotipo de Vendedor Independiente, a mostrar **solo el precio oficial** y a someter las páginas web propias a aprobación con costo. Las sanciones llegan a la **desvinculación**. Lanzar la Campaña B sin ese visto bueno pone en riesgo el código de Luis, más que cualquier multa del INVIMA.
5. **Las restricciones de Meta para «salud y bienestar» recaen sobre los datos que entran por las herramientas para empresas (píxel, API de conversiones), no sobre el anuncio.** Meta clasifica el «origen de datos» y puede aplicar tres niveles: configuración básica, restricción de eventos de **embudo medio y bajo** o restricción total, «específicas para ciertos países o regiones, o… a nivel global». Meta no publica ninguna lista de países. Un anuncio que optimiza por **conversaciones** de WhatsApp no depende de esos datos.
6. **Meta prohíbe vender suplementos ingeribles en cualquier contenido de comercio** (catálogos y tiendas): *«Commerce content may not promote the sale of ingestible supplements»*. También prohíbe los alimentos o bebidas *«that make health or medical claims»*. Los artículos del catálogo de la app WhatsApp Business se revisan con esa política. **Las cápsulas y las bebidas SD no deberían ir en el catálogo de la app ni en anuncios de catálogo.**
7. **La política de mensajería de WhatsApp Business (actualizada el 23 sep 2026) lista «Multi-level marketing» y «Medical and healthcare products» entre los bienes y servicios prohibidos**, «as determined in our sole discretion». La cláusula está desde por lo menos 2023 (Wayback). Afecta más a la Campaña A que a la B, pero vale para las dos y para el número de Queswa.
8. **Precios de WhatsApp (VERIFICADO en la página de Meta, actualizada el 30 sep 2026):** desde el 1 oct 2026 los mensajes de servicio se cobran; en Colombia cuestan **US$0,0008 (COP 2,9455)** por mensaje, con **1.000 gratis al mes por número**. El marketing cuesta US$0,0125 (COP 46,02). Lo de la ventana gratuita del anuncio CTWA es cierto a medias: hoy el «free entry point» dura **«hasta 7 días»**, no 72 h. Se abre cuando la empresa responde y cubre marketing, utilidad, autenticación y servicio, pero no los mensajes de Meta Business Agent.
9. **El destino que mejor mide es el (b), CTWA hacia Queswa**: guarda `ad_id` y `ctwa_clid`, registra el pedido y puede devolverle `Purchase` a Meta por la API de conversiones para mensajería, que habilita la optimización por compras en CTWA. Con la (a), la función «Anunciar» de la app, solo se ven alcance, clics, costo por clic y «conversaciones iniciadas»; no hace falta Página de Facebook y es lo más fácil de duplicar entre distribuidores. Con la (c), tráfico a la web sin píxel, solo se optimiza por clics y no vuelve ninguna señal.
10. **Recomendación:** CTWA a Queswa con el objetivo de interacción y la meta de maximizar conversaciones, COP 25.000 a 30.000 diarios durante 14 días. Solo con los productos registrados como **alimento**: Ganocafé 3 en 1 primero, luego Luvoco y Ganorico. El anuncio se vende por el sabor y el ritual. Antes de gastar el primer peso hacen falta **dos permisos**: la autorización escrita de Gano Excel y la confirmación de qué precio se puede mostrar.

---

## Pregunta 7. La norma colombiana

### 7.1 ¿Un anuncio de un ALIMENTO (NSA/RSA/PSA) sin declaraciones de salud requiere aprobación previa del INVIMA?

**No.** — VERIFICADO.

- **Concepto INVIMA 39 de 2021** (26 mar 2021), https://normograma.invima.gov.co/compilacion/docs/concepto_invima_0000039_2021.htm: dice que *«el control ejercido por este Instituto en materia de publicidad de alimentos, es posterior»*. En alimentos, la publicidad se considera tal *«indistintamente del medio de emisión y su ubicación (física o digital)»*. (Lo leí con un extractor que limita las citas literales; las frases entre comillas son textuales.)
- **Concepto INVIMA 16103065 de 2016**, https://normograma.invima.gov.co/compilacion/docs/concepto_invima_16103065_2016.htm: *«la publicidad de alimentos en general no requiere autorización previa del INVIMA»*. La excepción es la de las bebidas energizantes (Res. 4150, art. 13: *«Toda publicidad de bebidas energizantes requerirá autorización previa expedida por el Instituto»*).
- **Oficina virtual del INVIMA**, «Solicitud de Autorización de Publicidad», https://app.invima.gov.co/oficina-virtual-update/atencion-al-ciudadano/knowledgebase.php?article=39: en Alimentos y Bebidas, *«Solo aplica para Bebidas Energizantes o solicitud bajo insistencia»*. En Suplementos, *«Solo aplica para Suplementos Dietarios»*.
- **Que no se pida aprobación no significa que todo valga.** Sigue rigiendo la Res. 810/2021 (prohíbe declaraciones curativas, art. 6.2 y 25.6, y el término «saludable», 25.7; con un sello de advertencia no se puede hacer ninguna declaración nutricional ni de salud, 16.3 y 25.4). Esas citas están verificadas en la investigación interna de septiembre: `docs/investigaciones/resultados/SALUD_CLAIMS_NORMA_COLOMBIA_SEP2026.md` §3.3. También rigen la Ley 1480 (publicidad engañosa) y la **Res. 2674/2013, art. 47** (VERIFICADO en el normograma): *«cualquier transgresión… se extenderá igualmente al fabricante, comercializador e importador del producto cuando no sean titulares»*. Es decir, el distribuidor que pauta responde.
- **La Ley 2120 de 2021** (entornos alimentarios saludables) restringe la publicidad dirigida a menores de los productos con sellos. NO VERIFICADO: no encontré el artículo. Como el anuncio va a mayores de 18 años, el riesgo práctico es bajo.

### 7.2 ¿Y un SUPLEMENTO DIETARIO (SD)?

**Sí: requiere aprobación previa.** — VERIFICADO.

- **Decreto 3249/2006, art. 24, modificado por el art. 6 del Decreto 3863/2008** (compilación del normograma del INVIMA, https://normograma.invima.gov.co/compilacion/docs/decreto_3249_2006.htm): *«La publicidad de los suplementos dietarios se ajustará a los beneficios atribuidos a cada uno de los ingredientes característicos de la composición y deberá ser aprobada previamente por el Instituto Nacional de Vigilancia de Medicamentos y Alimentos, Invima…»*. El parágrafo, modificado por el Decreto 272/2009, prohíbe *«ostentar indicaciones preventivas, de rehabilitación o terapéuticas»*.
- **Art. 1:** *«Su cumplimiento es obligatorio para los titulares del registro sanitario y en general, para todas las personas naturales o jurídicas que realicen actividades relacionadas con el contenido del presente decreto»*. El distribuidor que pauta está obligado.
- **Art. 25, num. 9:** la leyenda *«ESTE PRODUCTO NO SIRVE PARA EL DIAGNÓSTICO, TRATAMIENTO, CURA O PREVENCIÓN DE ALGUNA ENFERMEDAD…»* debe ir en la publicidad.
- **Normas posteriores (2023-2026):** no encontré ninguna que suprima la aprobación previa para suplementos. La **Res. 1896/2023 (Publimed)** solo cambió el régimen de los medicamentos (la oficina virtual dice que para medicamentos *«Actualmente no se debe realizar solicitudes de autorización de publicidad»*). Un despacho de abogados menciona un proyecto de 2024 del MinSalud para modificar el D. 3249 (NO VERIFICADO; no habla de publicidad). La **Res. 3096/2007** regula las declaraciones de propiedades, no el trámite de publicidad. El **Decreto 1076 que menciona el encargo es el Decreto Único Reglamentario del Sector Ambiente (1076 de 2015)**: no tiene relación con este tema.

### 7.3 ¿Puede un distribuidor usar piezas que Gano Excel ya tenga aprobadas? ¿Puede pedir su propia autorización?

- **El distribuidor puede pedirla, pero solo con autorización del titular.** El *Instructivo para el diligenciamiento del formato de solicitud de autorización de publicidad*, código **ASS-RSA-IN039**, v. 00, 21/07/2015, lo leí en una copia publicada por el propio INVIMA dentro de un expediente: https://www.invima.gov.co/biblioteca/download/83998. Es VERIFICADO como texto del INVIMA, pero la vigencia de esta versión del instructivo no está verificada. Dice:
  - *«Se deberá cancelar por cada medio publicitario. Si dentro de un mismo medio publicitario cambian los diseños, se debe cancelar por cada diseño.»*
  - *«Cuando la publicidad es aprobada y se requiere realizar un cambio el interesado deberá realizar una nueva solicitud para poder pautarla.»*
  - *«En el caso de que el solicitante no sea el Titular del Registro sino que sea otra persona natural y/o jurídica, se sugiere como requisito indispensable allegar el documento o acto administrativo… por medio del cual se le otorga autorización por parte del titular del Registro Sanitario.»*
  - *«En cuanto a las páginas web… se autorizan son los contenidos de la página web y no la página.»*
- **Reutilizar una pieza de Gano:** el Concepto 39/2021 exige que *«el contenido de los materiales publicitarios deben coincidir exactamente con las aprobadas en el acto administrativo»*. Mi lectura (inferencia): una pieza aprobada a Gano solo puede circular **idéntica** y en el medio para el que se aprobó. Un anuncio de Meta con otro texto, el precio, el botón de WhatsApp o el logo del distribuidor ya es otro diseño y exige otra solicitud con el aval del titular. El manual de Gano apunta en la misma dirección: el distribuidor solo puede *«distribuir el material previamente autorizado por la Compañía»* (ver §8).
- **¿Tiene Gano Excel autorizaciones de publicidad a su nombre?** **No pude verificarlo.** El INVIMA no publica en datos abiertos ningún conjunto de autorizaciones de publicidad (busqué en el catálogo de datos.gov.co «publicidad invima» y «autorizaciones publicidad», sin resultados pertinentes), y en la web no aparece ninguna resolución de publicidad a nombre de Gano Excel. **Para saberlo hay que pedírselo a Gano Excel**: los números de los actos administrativos de las piezas aprobadas y a qué productos y medios se refieren.

### 7.4 El registro real de cada producto (datos abiertos del INVIMA)

Consulta por API SoQL, VERIFICADA el 6 nov 2026:
- `ui32-p9f2`, «INFORMACIÓN SOBRE RS Y NSO VIGENTES Y VENCIDAS», **datos actualizados el 2026-10-16**, https://www.datos.gov.co/resource/ui32-p9f2.json, filtro `titular like 'GANO EXCEL%'`.
- `uqkt-7tia`, «REGISTROS SANITARIOS DE SUPLEMENTOS DIETARIOS», datos de 2024-04-02.

| Producto (como lo vende Gano) | Lo que dice el INVIMA hoy | Lo que dice ganoexcel.com.co (`/todos-productos/`, leído el 6 nov 2026) |
|---|---|---|
| **Ganocafé 3 en 1** | **RSA-0011698-2021, ALIMENTOS, Vigente, vence 2030-09-12.** El SD2012-0002589 figura «NEGADO» | «Bebidas (Alimentos)» |
| **Ganocafé Clásico** | El SD2013-0002865 figuraba «EN TRÁMITE RENOV» en abril de 2024 (vencido desde 2023-06-27) y **no aparece** en el conjunto vigente de oct 2026. Hay un **NSA-0013061-2022** «Mezcla de café instantáneo con B-glucanos de Ganoderma lucidum» (alimento, vigente) que podría ser el Clásico (NO VERIFICADO) | «Bebidas (Suplementos dietarios)» |
| Cápsulas de Ganoderma | SD2014-0003428, vigente en abril de 2024 y vencido el 2025-02-23; **no aparece** en el conjunto de oct 2026 | Suplemento |
| Excellium | SD2014-0003368, vencido el 2024-11-10; **no aparece** en oct 2026 | Suplemento |
| Cordygold | **SD2017-0004056, SUPLEMENTO DIETARIO, vigente hasta 2027-06-09** | Suplemento |
| Oleaf Rooibos | **SD2017-0004109, suplemento, vigente hasta 2027-11-01** | Suplemento |
| C'Real Spirulina | PSA-0004956-2024, ALIMENTOS, vigente (el SD2014-0003291 está vencido) | Suplemento (contradicción) |
| Schokolade / Shoko Rico | NSA-0013117-2022 «chocolate y betaglucanos» (alimento), y SD2013-0002936 en trámite de renovación desde 2023 | Schokolade: suplemento · Shoko Rico: alimento |
| Latte Rico / Mocha Rico | NSA-0010760-2021 y NSA-0010766-2021, alimentos, vigentes | Alimento |
| Luvoco Suave / Medio / Fuerte | NSA-0012966 / 0012956 / 0012958-2022, alimentos, vigentes | Alimento |
| Reskine | RSA-0025739-2023, alimento, vigente | Alimento |
| Cuidado personal (6) | NSOC, cosméticos | Cosméticos |
| (otro) | SD2021-0004591 «Premezcla de café con cacao y extracto de Ganoderma», Gano Excel S.A., vigente hasta 2031 (no identifiqué cuál producto del catálogo es) | — |

**Conclusión:** para la campaña, el **alimento seguro** —con registro de alimento vigente y que la propia Gano también lista como alimento— es el **Ganocafé 3 en 1, el Luvoco y los Ganorico (Latte, Mocha, Shoko)**. El **Clásico es ambiguo**: Gano lo presenta como suplemento, y el INVIMA no muestra un SD vigente. Mientras no se aclare, se trata como suplemento. Las cápsulas y el Rooibos son suplementos, o tienen un registro que no aparece vigente: quedan fuera de la pauta. *(Advertencia: el catálogo interno `knowledge_base/catalogo_productos.txt`, línea 791, todavía dice que el 3 en 1 y el Clásico son SD. Ese dato está desactualizado frente al INVIMA, y `src/lib/wa-productos.ts` ya trae el RSA del 3 en 1.)*

### 7.5 El precedente de 2015, leído en la fuente

**Resolución INVIMA 2021019877 del 24 may 2021**, «Por medio de la cual se archiva el proceso sancionatorio No. 201500495», Grupo de Procesos Sancionatorios de Publicidad. PDF: https://www.invima.gov.co/biblioteca/download/142120, enlazado desde https://www.invima.gov.co/biblioteca/aviso-2021000081-del-31-de-mayo-de-2021-ps-201500495pdf. VERIFICADO.
- Arrancó con una denuncia del 22 ene 2015 sobre *«la presunta publicidad que del Suplemento Dietario GANOCAFE se estaba haciendo»* en la web ganocafecolombia.com y en *«redes sociales como Facebook, Twitter y el canal de Youtube»*, que *«no cuentan con autorización previa… en donde además se le brindan propiedades terapéuticas al Producto»*. En ese momento el producto estaba registrado como SD (SD2012-0002589).
- El INVIMA citó a Gano Excel S.A., que rindió declaración en 2015. Después **formuló cargos a una persona natural** (Auto 2017014220, nov 2017), que se notificó en persona y presentó descargos. En 2020 revocó esos cargos y los formuló contra **otra persona natural y una S.A.S.**, identificadas por el teléfono que aparecía en la publicidad y por el registro del dominio.
- Se archivó porque *«no se logró identificar e individualizar más allá de toda duda a quienes serían las personas naturales o jurídicas responsables»*, y la imputación no se pudo notificar (correo rebotado, «no reside»).
- **Matices frente a la §5:** (i) la resolución **no dice** que el responsable fuera un distribuidor de Gano. (ii) El INVIMA **sí persiguió a personas naturales durante seis años** y archivó por no poder identificarlas. Un anuncio de Meta lleva visible el nombre de quien paga en la Biblioteca de anuncios, de modo que el anunciante se identifica con mucha más facilidad que en 2015. (iii) El producto de aquel caso era SD; **hoy el 3 en 1 es alimento** y su publicidad ya no exige autorización previa. Esto baja el riesgo de un anuncio limpio del 3 en 1, pero no el de uno con afirmaciones terapéuticas.

---

## Pregunta 8. La política de Gano Excel

### 8.1 Gano Excel Colombia: el manual es público — VERIFICADO

**«Declaración de Políticas y Procedimientos», Gano Excel S.A.**, https://www.ganoexcel.com.co/wp-content/uploads/2024/05/MANUAL-POLITICAS-Y-PROCEDIMIENTOS-GANO-EXCEL-ACTUALIZADO.pdf. PDF del 28-29 mayo 2024, 46 páginas, enlazado hoy en el pie de ganoexcel.com.co como «Declaración de políticas y procedimientos». Se incorpora al Contrato de Mercadeo Multinivel (Introducción, I). Las cláusulas que importan:

- **38. PUBLICIDAD, II:** *«Todas las solicitudes de autorización de publicidad deberán ser presentadas junto con el formulario diligenciado de Verificación de Cumplimiento y una copia del material propuesto, antes que el material sea publicado o distribuido. Esta publicidad incluye… páginas de internet, comunicaciones por internet, redes sociales, mensajes telefónicos, anuncios impresos…»*
- **38, III:** *«La exhibición, publicidad o promoción en público de los productos u oportunidad de negocio de la Compañía requiere de la precia [sic] autorización por escrito de la Compañía. Las solicitudes deberán ser enviadas a la Compañía 15 días antes…»*
- **38, I:** *«…la Compañía se reserva el derecho de restringir la exhibición, venta o publicidad de sus productos en cualquier lugar que no considere aceptable.»*
- **38, IV:** no se puede usar *«el nombre comercial de la Compañía… su logotipo o cualquier marca registrada… a menos que su uso haya sido previamente autorizado.»*
- **38, V-VI:** se debe usar *«el logotipo de Vendedor Independiente que la Compañía diseñe»*, también en *«páginas de internet personales o comerciales tales como (Facebook…)»*. Todo material propio *«deberá incluir el logotipo… adicionalmente debe ser enviado para su previa autorización»*.
- **38, VII:** prohíbe enlazar literatura de terceros *«para efectos de verificar, enfatizar o aseverar cualquier efecto medicinal, terapéutico o curativo»*.
- **38, IX:** *«podrán distribuir el material previamente autorizado por la Compañía que haya sido creado por el mismo, única y exclusivamente entre las personas de su línea descendente.»*
- **38, XI y 39, VI:** prohíben promocionar los productos *«conjuntamente con productos que no sean de la misma»*.
- **38, XII:** *«…en su material publicitario los Vendedores Independientes únicamente podrán mostrar el precio establecido por la Compañía (precio sugerido en algunos países) al detalle en los productos.»*
- **27. PRECIOS, I-II:** *«Ningún Vendedor Independiente deberá vender los productos… a un precio inferior al establecido oficialmente por Gano Excel S.A.»*, ni *«reproducir o diseminar materiales publicitarios… que contengan precios inferiores a los oficialmente establecidos»*.
- **39. PUBLICIDAD POR INTERNET, IV:** las páginas propias se permiten *«siempre y cuando hayan sido aprobadas por el Departamento de Normas y Cumplimiento, el Departamento de Comunicaciones y el Departamento Jurídico»*, presentando la página completa y *«los cargos correspondientes a la asesoría jurídica»*. Todo cambio futuro también se aprueba.
- **39, IX:** prohíbe vender en subastas o mercados en línea (*«mercado libre, linio, e-Bay»*).
- **37, III-IV y VII:** prohíben afirmar propiedades terapéuticas o curativas, sugerir un remedio para cualquier enfermedad o decir que el producto fue *«aprobado para uso medicinal por cualquier entidad gubernamental»*.
- **44. MEDIDAS DISCIPLINARIAS:** van desde la advertencia escrita, la multa descontada de las compensaciones y la retención de compensaciones hasta *«La reasignación de la totalidad o parte de su organización»*, la suspensión y la *«cancelación o desvinculación unilateral»*.

**Lo que esto implica para la Campaña B (mi análisis):**
- **No hay un permiso tácito para pautar.** Todo anuncio con la marca o los productos de Gano necesita autorización escrita previa (formulario de Verificación de Cumplimiento y 15 días de antelación para la promoción en público).
- **El precio:** el catálogo web muestra $110.900 por el 3 en 1 (`src/app/productos/catalogo-datos.ts`), y en el arsenal ese es el «precio de distribuidor», contra un **precio público de $140.000** (`knowledge_base/arsenal_compensacion.txt`, COMP_VENTA_01). **Un anuncio que muestre $110.900 al público puede leerse como un precio inferior al oficial** (27.I-II y 38.XII), salvo que Gano considere oficial el precio de Cliente Preferencial. Hay que preguntarlo por escrito antes de pautar. Mientras tanto, el anuncio va **sin precio**.
- **La web propia:** `creatuactivo.com/productos/{distribuidor}` es una «página de internet propia» que vende productos Gano: según el 39.IV requiere aprobación de tres departamentos. No sé si ya la tiene; si no, mandar tráfico pagado a esa página agrava la exposición.
- **El riesgo real** no es la sanción del INVIMA, que es remota y lenta; es el **código de Luis**: desvinculación o reasignación de la organización. Luis tiene 12 años y una organización de miles de personas, así que es lo que más tiene que perder.

### 8.2 Comparables (secundario, porque la de Gano es pública)

- **Amway** (Australia), Reglas de Conducta, sección 8 (vía resumen del buscador, NO VERIFICADO literal): los métodos de difusión masiva, incluida Internet, *«are not to be used in a way that removes personal contact with a prospect»*, y *«Advertising is allowed in a limited context as described in the Digital Communication Standards»*. La guía de la IBOAI (iboai.com, asociación de distribuidores, no Amway) dice que todo material en redes es «Business Support Material» bajo la Regla 7 y debe enviarse a Amway *«for authorization prior to use»*. NO VERIFICADO: el primario no cargó (404).
- **Herbalife:** no logré leer la cláusula de publicidad pagada (el PDF del código dio 404). Los casos de la DSSRC (BBB National Programs) muestran que Herbalife **retira publicaciones de sus distribuidores y cancela cuentas** cuando la DSSRC las cuestiona (resumen del buscador, NO VERIFICADO).
- **Código de Ética de ACOVEDI 2026** (gremio colombiano de venta directa al que pertenece Gano Excel), PDF alojado por Yanbal: https://info01.yanbal.com/yanbal/CO/codigo_de_etica_ACOVEDI_2026.pdf. VERIFICADO el texto: *«Quedan terminantemente prohibidas las explicaciones, demostraciones, marcas, leyendas y propaganda comercial que no correspondan a la realidad…»*, y la *«Propaganda comercial de precios: El precio debe corresponder al precio total del producto, incluido los impuestos… y anunciarse en forma clara, visible y legible.»*
- **Patrón de la industria** (mi síntesis): autorización previa de la compañía, logotipo de distribuidor independiente, precio oficial, nada de mercados en línea ni de afirmaciones de salud, y sanciones contractuales. Gano encaja en ese patrón y además es de los más estrictos: aprueba hasta las páginas web, con costo.

---

## Pregunta 9. Meta y la categoría de salud y bienestar

### 9.1 Lo que dice Meta (fuentes primarias) — VERIFICADO

- **«Comprender las restricciones de uso compartido de datos según las categorías de orígenes de datos»**, https://www.facebook.com/business/help/511197658391698:
  - *«Podrá asignarse una categoría a los orígenes de datos, como sitios web y apps, que comparten datos con nosotros a través de las herramientas empresariales de Meta… Estas restricciones de uso compartido de datos pueden ser específicas para ciertos países o regiones, o pueden aplicarse a nivel global.»*
  - Los tres tipos: *«Configuración básica: se restringe el uso compartido de parámetros personalizados y partes de las URL que vienen después del dominio. Restricción en ciertos eventos estándar: se restringe el intercambio de eventos específicos de embudo medio y bajo. Restricciones totales: se restringe completamente la opción de compartir todos los eventos en regiones específicas o en todas las regiones.»*
  - Ante restricciones totales, Meta recomienda los objetivos que *«no se basan en datos compartidos a través de las herramientas empresariales de Meta, como el reconocimiento… las interacciones… y el tráfico»*.
  - *«Si bien puedes modificar las categorías que hayas asignado, no podrás modificar una categoría asignada por Meta»*. Se puede pedir una revisión.
- **«Información sobre las categorías de orígenes de datos»**, https://www.facebook.com/business/help/1402913027039332: *«Salud y bienestar: se asocia con afecciones médicas o estados de salud específicos, relaciones entre proveedor y paciente, servicios para acceder a información personal sobre salud, o productos y servicios relacionados con la salud (por ejemplo, un portal de pacientes, una herramienta de seguimiento del bienestar, una plataforma de telemedicina, una farmacia…)»*. Aclara: *«Esta lista no es exhaustiva»*.
- **«Información sobre la configuración básica»**, https://www.facebook.com/business/help/124742407297678: con configuración básica, los públicos basados en URL o en parámetros personalizados pueden dejar de funcionar y el catálogo deja de actualizarse por el píxel. Se activa, entre otros motivos, cuando *«Meta determinó que el origen de datos corresponde a una categoría que requiere las restricciones»* o tras *«varias notificaciones»* de datos prohibidos.
- **«Qué es la información prohibida»**, https://www.facebook.com/business/help/361948878201809: entre los ejemplos están *«Medicamentos recetados, medicamentos sin receta y suplementos para afecciones médicas específicas»*. Los nombres de eventos, conversiones y públicos *«no deben reflejar ni insinuar información prohibida»*.
- **Conversiones personalizadas:** https://www.facebook.com/business/help/2455915321411996 y la documentación del píxel (https://developers.facebook.com/documentation/meta-pixel/implementation/conversion-tracking: *«Beginning September 2, 2025, we will start to roll out more proactive restrictions on custom conversions»*, por ejemplo «arthritis», «diabetes»). Las que se marcan no pueden usarse en campañas nuevas.
- **Normas de publicidad, «Salud y bienestar»** (https://transparency.meta.com/es-la/policies/ad-standards/restricted-goods-services/health-wellness/, cambios del 22 jul 2026 y del 26 dic 2024):
  - *«Los anuncios que promocionan o comercializan productos y servicios nutricionales, de salud, o para bajar o subir de peso deben dirigirse a personas mayores de 18 años.»*
  - Prohíbe afirmar la *«curación, sanación o eliminación»* de diabetes, cáncer, tiroides, Alzheimer y otras (lista exhaustiva), y el *«clickbait en un contexto de salud»*.
  - **La exigencia de edad no se aplica** a los *«Productos alimenticios generales, incluidos los productos proteicos»*.

### 9.2 ¿Un anunciante de café con Ganoderma en Colombia cae en esas restricciones?

- **Meta no publica qué países ni qué anunciantes.** Dice solo que pueden ser «específicas para ciertos países o regiones, o… a nivel global». **Ninguna fuente primaria dice que la medida empezó en 2025, ni que se limita a EE. UU.** Esas fechas y ese alcance vienen de blogs de agencias (Triple Whale, CustomerLabs, Aimerce y otros: NO VERIFICADO). Lo único fechado en una fuente primaria es la restricción de conversiones personalizadas, desde el 2 sep 2025.
- **La clasificación recae sobre el origen de datos** (el dominio o la app que manda eventos por el píxel o la API de conversiones), **no sobre el anuncio ni sobre la cuenta publicitaria**. Hoy creatuactivo.com **no tiene píxel**, así que no hay ningún origen de datos que clasificar. Si se instala, es razonable esperar que un sitio que habla de Ganoderma y de «defensas» quede clasificado como salud y bienestar (inferencia). Con «restricción en ciertos eventos estándar» se perderían justamente `Purchase` y `AddToCart`.
- **¿Afecta a CTWA?** Inferencia razonada, sin una fuente que lo diga expresamente:
  - (i) Optimizar por **conversaciones iniciadas** usa una señal que Meta mide dentro de sus propias apps, no datos de las herramientas para empresas. Las restricciones por categoría no deberían tocarla, y Meta misma recomienda los objetivos de interacción ante restricciones totales.
  - (ii) Optimizar por **compras en la conversación** necesita un conjunto de datos de la API de conversiones (ver 10.b). Ese conjunto **sí es un origen de datos** y podría ser clasificado y restringido.
  - (iii) Lo que aplica seguro: 18+ si el anuncio presenta el producto como nutricional o suplemento, y las prohibiciones de contenido.
- **Qué objetivos y eventos quedan:** reconocimiento, interacción (incluidas las conversaciones de WhatsApp) y tráfico (clics en el enlace) no dependen de datos de las herramientas para empresas. Los eventos de embudo medio y bajo (compra, añadir al carrito, iniciar pago) son los que se restringen cuando el origen queda categorizado. VERIFICADO en la redacción de Meta (511197658391698); la asignación al caso de Gano es inferencia.

---

## Pregunta 10. El destino del anuncio: tres caminos

### (a) La función «Anunciar» de la app WhatsApp Business (320 680 5737)

VERIFICADO en el Centro de ayuda de WhatsApp:
- **«Cómo crear anuncios en WhatsApp Business»**, https://faq.whatsapp.com/512723604104492/: *«puedes crear anuncios de Facebook e Instagram que conduzcan a un chat de WhatsApp con tu empresa. Para adaptar estos anuncios, puedes seleccionar fotos, videos, artículos del catálogo o estados. Puedes definir tu propio presupuesto, la duración y el público objetivo.»* Hay dos caminos: *«Sin una cuenta de Facebook: Usa tu dirección de correo electrónico para la verificación y el pago. No es necesario iniciar sesión con Facebook»*, o *«Con una cuenta de Facebook vinculada»*. Además: *«Los artículos del catálogo deben estar aprobados»*; *«las revisiones de anuncios demoran 24 horas»*; *«No puedes programar anuncios con anticipación ni hacer que se repitan automáticamente»*; un solo borrador, que se borra a los 7 días.
- **No hace falta Página de Facebook**: el anuncio sale con el nombre del perfil de empresa de WhatsApp (https://faq.whatsapp.com/434854355461483/).
- **Métricas** (https://faq.whatsapp.com/1886382371958930/): *«Alcance… Clics en el anuncio… Costo por clic en el enlace… Conversaciones iniciadas»*, más estado, presupuesto, público por edad, género y ubicación, y ubicaciones. **No hay eventos de compra ni API de conversiones**, y no hay forma de atar el pedido al anuncio salvo a mano.
- **Formatos:** foto, video, artículo del catálogo o estado, con varias fotos o productos, y plantillas de diseño (https://faq.whatsapp.com/1243656420068285/).
- **El catálogo de la app** (https://faq.whatsapp.com/833697274483076/): cada imagen y artículo se revisa contra la *«Política de mensajes de WhatsApp Business»*, y lo pendiente o rechazado no se ve.
- **Limitaciones decisivas:**
  - (1) **La Política de Comercio de Meta** (https://www.facebook.com/policies_center/commerce/medical_and_healthcare_products, VERIFICADO): *«Commerce content may not promote the buying, selling, or trading of medical and healthcare products and services, including medical devices, or ingestible supplements.»* Tampoco permite *«Products, including food or drinks, that make health or medical claims»*. Las cápsulas y las bebidas SD no deberían estar en el catálogo de la app, y un artículo del 3 en 1 con texto de salud se rechazaría.
  - (2) **La Política de mensajería de WhatsApp Business** (https://business.whatsapp.com/policy, actualizada el 23 sep 2026, VERIFICADO): prohíbe usar WhatsApp para empresas *«for buying, selling, promoting… certain regulated or restricted goods and services»*, incluidos *«Medical and healthcare products»* y *«Multi-level marketing»*. Para esos «verticales regulados» añade: *«You are prohibited from messaging about any Regulated Verticals on the WhatsApp Business App»*. La cláusula está desde 2023 (Wayback, 1 jun 2023); su aplicación real es desconocida. El café como alimento, vendido por el sabor, queda fuera de esas categorías. Las cápsulas, no necesariamente.
  - (3) **La cuenta publicitaria que crea la app** (por correo electrónico) es otra, distinta de la del portafolio de Queswa: no le suma historial.
  - (4) **Lo atiende Luis a mano**: no escala.
- **Costo:** solo el gasto en anuncios; los mensajes de la app no se cobran por mensaje. *(La app también vende «mensajes de marketing» de pago: https://faq.whatsapp.com/570949191470325/, no revisado en detalle.)*
- **Para qué sirve:** es **lo más fácil de duplicar** para un distribuidor que no tiene la API. Sirve como formato de la guía para distribuidores, con medición pobre.

### (b) Click-to-WhatsApp hacia Queswa (321 519 3909, API de la nube)

- **Lo que mide:** el webhook ya guarda el `referral` con `ad_id` y `ctwa_clid` (§3 del encargo). Queswa registra el pedido y avisa al distribuidor. Se puede saber **costo por conversación, por pedido y por anuncio** con datos propios.
- **Devolver la compra a Meta:** la API de conversiones para mensajería (https://developers.facebook.com/docs/marketing-api/conversions-api/business-messaging, actualizada el 28 sep 2026, VERIFICADO) acepta `Purchase`, `LeadSubmitted`, `InitiateCheckout`, `AddToCart`, `ViewContent`, `OrderCreated`, `OrderShipped`, `OrderDelivered`, `OrderCanceled`, `OrderReturned`, `CartAbandoned`, `QualifiedLead`, `RatingProvided` y `ReviewProvided`, con `action_source: business_messaging` y el `ctwa_clid`. FAQ: *«The Conversions API enables access to purchase optimization for ads that click to Messenger and ads that click to WhatsApp only»*. Requiere el permiso `whatsapp_business_manage_events` con acceso avanzado. La misma página dice en un aviso que el umbral bajó de 1.500 a 500 llamadas en 15 días, y en el cuerpo sigue diciendo 1.500: hay una inconsistencia interna. Sin `ctwa_clid`, el emparejamiento por datos con hash solo atribuye interacciones de los últimos 7 días. El dato es VERIFICADO; la profundidad de la API de conversiones la cubre el investigador de la Campaña A (pregunta 4).
- **Riesgo:** ese conjunto de datos es un «origen de datos» y podría quedar en la categoría de salud y bienestar (ver 9.2).
- **Costos de WhatsApp** (https://developers.facebook.com/docs/whatsapp/pricing, «Updated: Sep 30, 2026», y la hoja de tarifas USD/COP «effective October 1, 2026», VERIFICADO):
  - Colombia: **servicio US$0,0008 (COP 2,9455)**, utilidad y autenticación igual, **marketing US$0,0125 (COP 46,0227)**.
  - Desde el 1 oct 2026: *«Meta volvió a cobrar por… Los mensajes de servicio»*, con un *«nivel gratuito de 1.000 mensajes de servicio por mes»* por número, sin acumulación. Sin método de pago, Meta no entrega los mensajes de servicio después de los 1.000 gratis.
  - **Ventana gratuita (FEP):** si el usuario escribe desde un anuncio CTWA en la app de Android o iOS (no en la web ni en el escritorio) y la empresa responde dentro de la ventana de servicio, *«That message is not charged and opens a Free Entry Point ("FEP") window… The FEP window may remain open for up to 7 days»*. Dentro de ella no se cobran marketing, utilidad, autenticación ni servicio. **Sí se cobran los mensajes de Meta Business Agent**, el agente de IA de Meta (US$2 por millón de tokens, unos 4-5 centavos por mensaje). Queswa es una IA de terceros, así que sus mensajes son de la categoría «Servicio»: ese cobro no lo toca.
  - **En plata:** el costo de mensajería de Queswa es despreciable frente a la pauta. Con unos 1.000 mensajes de servicio gratis al mes y 2,9 pesos por mensaje después, 200 conversaciones de 15 mensajes costarían unos COP 6.000 al mes, y menos dentro de la ventana gratuita. El costo real es la pauta más el consumo del modelo de Queswa.
- **Limitaciones:** la cláusula de «Multi-level marketing» de la política de WhatsApp pesa sobre el número que también hace la Campaña A. Si Meta llegara a aplicarla, el número que vende el café y el que habla del negocio son el mismo. Esto es una dependencia que hay que conocer, no un bloqueo demostrado.

### (c) Tráfico al catálogo web, sin píxel

- **Qué se puede optimizar:** con el objetivo de tráfico y sin píxel, **clics en el enlace**. Las «visitas a la página de destino» necesitan el código base del píxel en la página de destino (Meta, «Best practices for landing page view optimisation», https://en-gb.facebook.com/business/help/203012060587398, leído por fragmento del buscador: VERIFICADO PARCIAL).
- **Qué mide:** clics en Meta. El pedido sale por WhatsApp hacia Queswa, que puede saber de qué catálogo viene (ref del distribuidor) pero **no de qué anuncio**, salvo con UTM (`utm_*`) que la web pase al mensaje. Meter un código en el mensaje ya mostró peor conversión (CLAUDE.md, 23 oct 2026). No vuelve ninguna señal a Meta, no hay públicos de quienes visitaron la web y el algoritmo optimiza por quien hace clic, no por quien compra.
- **Costo:** solo la pauta. Suma un paso (anuncio → web → WhatsApp), así que se espera menos conversión por peso que en (b) (inferencia).
- **Riesgos:** (i) si después se instala el píxel, es probable que el dominio caiga en salud y bienestar (ver 9.2). (ii) Según el manual de Gano (39.IV), la página propia necesita aprobación.
- **Para qué sirve:** solo en computador, donde la regla de CLAUDE.md manda al chat web. Para la Campaña B, que se juega casi entera en el celular, es el camino más débil.

### Tabla comparativa

| | (a) «Anunciar» en la app (320) | (b) CTWA → Queswa (321) | (c) Tráfico a la web sin píxel |
|---|---|---|---|
| Página de Facebook | No hace falta (correo o Facebook) | Sí (Página «Crea Tu Activo») | Sí |
| Optimiza por | Conversaciones (lo decide la app) | Conversaciones; compras si se activa la API de conversiones | Clics en el enlace |
| Qué se ve | Alcance, clics, costo por clic, conversaciones iniciadas | Lo anterior + `ad_id`/`ctwa_clid` → pedido en la base + `Purchase` a Meta | Clics; el pedido no se ata al anuncio |
| Catálogo en el anuncio | Sí, artículos del catálogo de la app (solo los aprobados; los suplementos los prohíbe la Política de Comercio) | Anuncio CTWA normal (imagen o video); catálogo de Meta posible, con la misma política | El catálogo web |
| Costo además de la pauta | 0 | Mensajería casi nula (1.000 de servicio gratis al mes, ventana gratuita de hasta 7 días) + el modelo de Queswa | 0 |
| Se puede duplicar en otros distribuidores | **Alta** | Media: el distribuidor pauta con su cuenta y usa el número de Queswa (atribución por `ad_id`) | Media |
| Riesgo principal | Rechazo de artículos del catálogo; la cláusula de verticales regulados en la app | Clasificación de salud y bienestar del conjunto de datos; la cláusula MLM sobre el número compartido | Paso extra; dominio clasificado si llega el píxel; aprobación de Gano para la web |

---

## Dónde la §5 se equivoca o se queda corta

1. **«Tres productos de Gano están registrados como suplemento dietario (SD): Ganocafé 3 en 1, Ganocafé Clásico y Cápsulas de Ganoderma. Los otros doce… son alimento (NSA)»** → **Equivocado.**
   - El **3 en 1 es alimento (RSA-0011698-2021)** y su SD figura «NEGADO».
   - Según la propia Gano, los suplementos son **siete** (Classic, C'Real Spirulina, Oleaf Rooibos, Schokolade y las tres cápsulas), y los alimentos son seis.
   - El INVIMA solo muestra **dos SD vigentes de un producto del catálogo** (Cordygold y Rooibos), más un SD2021 de una premezcla de café con cacao que no identifiqué. El Clásico, las cápsulas de Ganoderma y el Excellium no aparecen vigentes en el conjunto de oct 2026.
   - El origen del error es `catalogo_productos.txt`, que la investigación de septiembre ya había marcado.
2. **«La publicidad de un suplemento dietario requiere aprobación previa del INVIMA (Decreto 3249, art. 24)»** → **Correcto**, con precisiones: hoy rige la redacción del D. 3863/2008, y el parágrafo es del D. 272/2009. Le **falta lo que decide**: (a) los alimentos no la requieren (control posterior); (b) un distribuidor puede pedirla, pero solo con autorización del titular, pagando por medio y por diseño, y cualquier cambio exige una solicitud nueva.
3. **Precedente de 2015** → **Correcto en lo esencial, inexacto en un punto.** La resolución **no dice** que el responsable fuera «un distribuidor». Habla del dueño de una web (ganocafecolombia.com) y de redes sin identificar. Sí muestra que el INVIMA formuló cargos a **personas naturales** dos veces y que el caso se cayó por no poder identificarlas ni notificarlas, no por falta de interés. Con la Biblioteca de anuncios, el anunciante de Meta es identificable.
4. **«Desde 2025, Meta restringe la optimización de bajo embudo para anunciantes de salud y bienestar»** → **Impreciso.** La fuente primaria de Meta: (i) no fecha la medida en 2025, salvo la de conversiones personalizadas (2 sep 2025); (ii) la aplica a **orígenes de datos** (web, app, conjunto de datos), no a «anunciantes»; (iii) dice que puede ser por país o global, sin lista; (iv) tiene **tres niveles**, no uno. Le falta la consecuencia práctica: **sin píxel no hay nada que restringir**, y optimizar por conversaciones no depende de esos datos.
5. **«La ventana de 72 horas de un anuncio CTWA sigue gratis»** → **Desactualizado.** La página de Meta (30 sep 2026) dice que la ventana gratuita **«may remain open for up to 7 days»**. La abre la **respuesta de la empresa** dentro de la ventana de servicio, solo para usuarios de la app de Android o iOS, y **no cubre los mensajes de Meta Business Agent**.
6. **«Colombia ~US$0,0008 por mensaje de servicio»** → **Correcto** (COP 2,9455). Le falta: **los primeros 1.000 mensajes de servicio de cada mes son gratis por número**, y sin método de pago Meta deja de entregar los mensajes de servicio pasado ese tope. El marketing cuesta US$0,0125 (COP 46,02).
7. **«No encontramos en público la política de Gano Excel sobre publicidad pagada»** → **Equivocado: es pública** (ganoexcel.com.co, pie de página, PDF de mayo de 2024). Exige autorización previa escrita para cualquier publicidad en redes, el logo de Vendedor Independiente, el precio oficial y la aprobación de las páginas web propias, con sanciones hasta la desvinculación. **Es la restricción más dura de toda la Campaña B**, y la §5 no la tenía.
8. **Lo que la §5 no vio:** (i) la **Política de Comercio de Meta prohíbe vender suplementos ingeribles** en catálogos y tiendas; (ii) la **política de WhatsApp Business lista «Multi-level marketing» y «Medical and healthcare products»** como bienes prohibidos (desde 2023 por lo menos) y prohíbe hablar de verticales regulados desde la app; (iii) un **posible conflicto de precio**: el catálogo muestra el precio de distribuidor y el manual de Gano exige el precio oficial al detalle.
9. **«El contrapeso que Claude Code no midió»** (el caso de 2015 archivado y los miles de anuncios con curas) → para la **Campaña B** pesa menos de lo que parece. El riesgo de un anuncio limpio del 3 en 1 frente al INVIMA es bajo: es alimento, sin aprobación previa y sin afirmaciones. El riesgo vivo es **contractual (Gano)** y **de plataforma** (rechazo de artículos del catálogo y la cláusula de verticales). El censo de la Biblioteca de anuncios es del bloque C y no lo cubrí.

---

## Recomendación concreta para la Campaña B

**Antes de gastar (requisito, no sugerencia):**
1. **Pedir por escrito a Gano Excel** (Departamento de Normas y Cumplimiento) la autorización de la campaña: el formulario de Verificación de Cumplimiento, las piezas y 15 días de antelación (manual 38.II-III). En la misma solicitud: (a) **qué precio puede mostrarse** al cliente final, el público ($140.000 según el arsenal) o el de Cliente Preferencial ($110.900); (b) si `creatuactivo.com/productos/{distribuidor}` tiene la aprobación del 39.IV; (c) si Gano tiene **piezas aprobadas por el INVIMA** y con qué números de acto administrativo. Sin (a) resuelto, el anuncio va **sin precio**.
2. **Corregir en el arsenal** la clasificación SD/NSA (el 3 en 1 es alimento), para que Queswa no diga «suplemento» cuando llegue el tráfico.

**La campaña:**
- **Objetivo:** Interacción → Mensajes → **WhatsApp (Queswa, 321)** → meta: **maximizar el número de conversaciones**. Optimizar por compras (API de conversiones) no tiene sentido con este presupuesto, porque no va a haber volumen de compras semanales para que Meta aprenda. Lo que sí conviene es **mandar `Purchase`/`OrderCreated` por la API de conversiones para mensajería solo para medir**, y evaluar después si el conjunto de datos queda clasificado.
- **Presupuesto:** **COP 25.000-30.000 diarios, durante 14 días** (unos COP 350.000-420.000 en total), en un solo conjunto de anuncios con presupuesto en la campaña, para no partir el aprendizaje.
- **Público:** Colombia (todo el país; Gano despacha nacional), **25-55 años**, español. Público Advantage+ amplio, sin intereses. El creativo hace la segmentación: café de cafetería en casa y el ritual de la tarde. El mínimo de 18 años es obligatorio si el anuncio presenta el producto como nutricional; con 25+ queda cubierto.
- **Ubicaciones:** Advantage+ (Facebook e Instagram: secciones, reels e historias), **sin Audience Network**. Los Estados de WhatsApp, solo si aparecen disponibles en la cuenta: el FAQ dice que se implementan «gradualmente» (https://faq.whatsapp.com/692903349791443/). Su disponibilidad la cubre la Campaña A.
- **Destino:** CTWA a Queswa, con un mensaje precargado sin código. La atribución viene del `referral`.
- **Creativos:** 3 a 4. Video vertical de 10-20 s de la preparación y la taza, el «capuchino de la tarde», y dos o tres imágenes de producto real (foto real, 1080×1080, sin precio ni declaración de salud en la imagen, como manda CLAUDE.md). En el texto, la composición («café con extracto de Ganoderma») se puede decir; el beneficio, no: nada de «defensas», «energía» ni «bienestar». Logo de Vendedor Independiente según lo que autorice Gano.
- **Productos que SÍ van:** **Ganocafé 3 en 1** (el principal), **Luvoco** (Suave, Medio, Fuerte) y **Ganorico Latte, Mocha y Shoko**: todos con registro de alimento vigente y listados como alimento por Gano. Los cosméticos (NSOC) son posibles, pero no son el foco.
- **Productos que NO van:** **Ganocafé Clásico** (Gano lo lista como suplemento y el INVIMA no muestra un SD vigente: ambiguo), **Oleaf Rooibos, Gano Schokolade, C'Real Spirulina** (suplementos para Gano, aunque algunos tengan registro de alimento), **Ganoderma cápsulas, Excellium y Cordygold** (suplementos ingeribles: aprobación previa del INVIMA y prohibidos en el contenido de comercio de Meta) y **Reskine** (es alimento, pero se vende por belleza y articulaciones, y la línea entre composición y declaración es fina). Si una persona que llegó por el anuncio pregunta por ellos, Queswa los atiende en la conversación: el anuncio no los muestra.
- **Evento que se mide:** (1) Meta: **costo por conversación iniciada**. (2) Queswa, con `ad_id`: **pedidos registrados** y la **tasa de conversación a pedido**. (3) Opcional: `Purchase` por la API de conversiones para mensajería.
- **Umbrales.** No encontré costos por conversación verificados para Colombia; los cubre la Campaña A, pregunta 5. Por eso los derivo de la economía de la venta: margen directo de unos COP 29.100 por caja si se vende al precio público (COMP_VENTA_01), y el 3 en 1 se recompra.
  - **Día 7:** si hay **menos de 15 conversaciones**, o el costo por conversación pasa de **COP 6.000**, se **cambia el creativo** (no el público). Si hay **30 o más conversaciones y 0 pedidos**, el problema está en la conversación de Queswa o en el precio, no en el anuncio: se revisan los registros de esas conversaciones antes de gastar más.
  - **Día 14:** **sigue** si el costo por pedido es de **COP 60.000 o menos** (unas dos cajas de margen, justificable por la recompra) y la conversación termina en pedido en el **5 % o más** de los casos. **Cambia** (otro gancho u otro producto ancla, Luvoco o Ganorico) si el costo por pedido está entre COP 60.000 y 120.000. **Se apaga** si pasa de COP 120.000, o si Gano no dio su autorización.
- **Para la guía de distribuidores:** el camino duplicable es la **(a), la app con «Anunciar»**. Solo con artículos del catálogo de alimento (3 en 1, Luvoco, Ganorico), sin precio o con el oficial, sin ninguna palabra de salud y con la autorización de Gano. La medición se reduce a «conversaciones iniciadas» más lo que el distribuidor anote a mano.

---

## Fuentes principales (leídas el 6 nov 2026)

- INVIMA, datos abiertos `ui32-p9f2` (actualizado el 2026-10-16) y `uqkt-7tia`: https://www.datos.gov.co/resource/ui32-p9f2.json · https://www.datos.gov.co/resource/uqkt-7tia.json
- Decreto 3249/2006, compilación del INVIMA: https://normograma.invima.gov.co/compilacion/docs/decreto_3249_2006.htm
- Concepto INVIMA 39/2021: https://normograma.invima.gov.co/compilacion/docs/concepto_invima_0000039_2021.htm
- Concepto INVIMA 16103065/2016: https://normograma.invima.gov.co/compilacion/docs/concepto_invima_16103065_2016.htm
- Oficina virtual del INVIMA, autorización de publicidad: https://app.invima.gov.co/oficina-virtual-update/atencion-al-ciudadano/knowledgebase.php?article=39
- Resolución 2674/2013 (art. 47): https://normograma.invima.gov.co/compilacion/docs/resolucion_minsaludps_2674_2013.htm
- Instructivo ASS-RSA-IN039 (dentro de un documento del INVIMA): https://www.invima.gov.co/biblioteca/download/83998
- Resolución INVIMA 2021019877 (PS 201500495): https://www.invima.gov.co/biblioteca/download/142120
- Gano Excel S.A., Declaración de Políticas y Procedimientos: https://www.ganoexcel.com.co/wp-content/uploads/2024/05/MANUAL-POLITICAS-Y-PROCEDIMIENTOS-GANO-EXCEL-ACTUALIZADO.pdf · catálogo: https://www.ganoexcel.com.co/todos-productos/
- Código de Ética de ACOVEDI 2026: https://info01.yanbal.com/yanbal/CO/codigo_de_etica_ACOVEDI_2026.pdf
- Meta, artículos de ayuda: 511197658391698 · 1402913027039332 · 124742407297678 · 361948878201809 · 2455915321411996 (https://www.facebook.com/business/help/…)
- Meta, Normas de publicidad, Salud y bienestar: https://transparency.meta.com/es-la/policies/ad-standards/restricted-goods-services/health-wellness/
- Meta, Política de Comercio, productos médicos y suplementos: https://www.facebook.com/policies_center/commerce/medical_and_healthcare_products
- Política de mensajería de WhatsApp Business (23 sep 2026): https://business.whatsapp.com/policy · Wayback del 1 jun 2023 para la cláusula MLM
- Precios de WhatsApp (30 sep 2026) y hojas de tarifas USD/COP del 1 oct 2026: https://developers.facebook.com/docs/whatsapp/pricing
- API de conversiones para mensajería (28 sep 2026): https://developers.facebook.com/docs/marketing-api/conversions-api/business-messaging
- Centro de ayuda de WhatsApp: crear anuncios (512723604104492), métricas (1886382371958930), diseño (1243656420068285), rechazos (594356815709445), catálogo (833697274483076), información compartida con Meta (434854355461483), anuncios en Estados (692903349791443)
