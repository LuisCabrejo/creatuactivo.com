# v7 — el catálogo (6 nov 2026), corrida completa de 30 casos × 3

Comentarios de Liliana sobre el catálogo, aprobados por el Director (commits 56d6ead y 10913ad):

1. `queswa-bitacora.ts`: recorridos `catalogo` (WhatsApp: portafolio → catálogo con precios) y
   `catalogo_web` (sin paso sugerido). En el catálogo, la red de cierre cambia toda oferta del
   negocio; en la web también quita la del portafolio y la del catálogo, que la página ya muestra.
   La firma del portafolio reconoce el título en negrita.
2. `route.ts` y el webhook: el modo catálogo se fija antes de que la salud reasigne el pageContext
   (`modoCatalogo` viaja del webhook al motor).
3. `hablaDeNegocio` / `RE_HABLA_DE_NEGOCIO`: «cómo funciona», «plata» y «dinero» sueltos ya no apagan
   el modo catálogo.
4. Casos nuevos: `catalogo-migrana` y `catalogo-diabetes` (harness aprobado por el Director).

Durante la corrida el servidor recargó tres cambios menores (Cordygold 60 cápsulas en
`wa-productos.ts`, la expansión de los botones del catálogo web y la consulta de cordygold en
`route.ts`); ninguno toca los casos.

## Resultado

Aprueba 74/90 (82 %) contra 64/84 (76 %) en v5; pass^3 en 21 casos contra 20. Los dos casos nuevos,
3/3. Bajan `cuantos-dias-colageno` (3→2), `beneficios-colageno` (3→1, con líneas rojas: «firmeza» y
«funciona por acumulación»), `conseguir-clientes` (1→0) y `como-puedo-empezar` (3→2): ninguno pasa
por el catálogo y los cuatro oscilan igual entre variantes (beneficios-colageno: 0, 0, 0, 1, 2, 3,
2, 1 de baseline a v7). Suben `dieciocho-unidades`, `reskine-rutina`, `beneficios-cada-uno`,
`bebidas-si-encadenados` y `me-inscribi-una-vez`.
