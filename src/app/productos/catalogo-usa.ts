/**
 * Copyright © 2026 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * LOS 17 PRODUCTOS DEL CATÁLOGO DE ESTADOS UNIDOS — datos, sin presentación (27 nov 2026).
 *
 * Es el inventario del catálogo de un socio inscrito en Gano Excel USA
 * (`private_users.pais`, ver ../socio.ts). La vitrina es la misma de Colombia
 * (page.tsx); lo que cambia es esto, por catalogo.ts.
 *
 * DE DÓNDE SALE CADA COSA (knowledge_base/paises/USA_2026.md):
 *   · El precio es el AL POR MENOR de la lista 2026 de Gano Excel USA (Director,
 *     27 nov 2026): el que el cliente paga en ganoexcel.us. La diferencia con el
 *     por mayor es la venta directa del socio. Solo dólares.
 *   · Nombre, presentación e ingredientes: la página de cada producto en
 *     ganoexcel.us, leída el 27 nov 2026, y su etiqueta. El ReSkine es colágeno
 *     de pescado (Director, 27 nov 2026), aunque la lista de la página no lo nombre. Allá formulan distinto
 *     que en Colombia (el Cordyceps es militaris y de 450 mg; el Mocha trae 15
 *     sobres de 28 g): nada de aquí se copia de catalogo-datos.ts sin verificar.
 *   · Las fotos son las oficiales de ganoexcel.us (public/productos/usa).
 *
 * ⚠️ SIN DECLARACIONES DE SALUD. El material de allá trae «apoyo inmune»,
 * «claridad mental», «equilibrio hormonal», «10x más potente»: no se importa
 * nada de eso (USA_2026.md §1.4). Se venden por el sabor, la presentación y el
 * ritual, igual que en Colombia, y la ficha lleva el descargo de la FDA que
 * Gano Excel USA imprime en cada producto. El Tongkat Ali se presenta como lo
 * que es, un café con dos raíces, sin nombrar lo que se le atribuye.
 *
 * La tabla del canal (src/lib/wa-productos-usa.ts), con la que Queswa lee y confirma
 * el pedido por WhatsApp, sale de aquí: un precio se cambia una sola vez.
 */

import type { Product } from './catalogo-datos'

/** Lo que comparten todos: allá no hay registro sanitario que citar (USA_2026.md §2.4). */
const base = { invima: '', goals: [] as string[] }

export const productDataUS: Record<string, Product> = {
  '3-in-1': {
    ...base,
    name: 'Gano Café 3-in-1',
    price: 33,
    image: '/productos/usa/3-in-1.png',
    presentacion: 'Caja de 20 sobres',
    categoria: 'Café',
    llevaGanoderma: true,
    shortDescription: 'El café de todas las mañanas, listo en un sobre: café, crema y azúcar, con el extracto de Ganoderma adentro. Se sirve el agua caliente y ya está.',
    taglineEstrategico: 'El café de la mañana, con algo más adentro',
    usage: 'Un sobre en 150 ml de agua caliente (unas 5 onzas). Revuelva y listo.',
    ingredients: ['Azúcar', 'Crema no láctea', 'Café instantáneo', 'Extracto de Ganoderma lucidum', 'Contiene leche'],
    benefits: ['Café, crema y azúcar en un solo sobre', 'Sabor suave y cremoso', 'El más pedido de la línea'],
    perfilIdeal: 'Quien ya toma café todas las mañanas y quiere que ese café haga algo más',
    momentoConsumo: 'A primera hora, como su café de siempre',
    ritual: ['Prepárelo como el café de siempre: un sobre, agua caliente, y a la mesa', 'Si lo prefiere más suave, use un poco más de agua', 'También se toma frío: prepárelo y sírvalo con hielo'],
    combinacionSugerida: ['classic', 'mocha'],
  },
  'classic': {
    ...base,
    name: 'Gano Café Classic',
    price: 33,
    image: '/productos/usa/classic.png',
    presentacion: 'Caja de 30 sobres',
    categoria: 'Café',
    llevaGanoderma: true,
    shortDescription: 'El café negro de siempre, con el extracto de Ganoderma adentro: sin crema y sin azúcar, para quien no negocia su taza.',
    taglineEstrategico: 'Para quien toma el café negro y no lo negocia',
    usage: 'Un sobre en 150 ml de agua caliente.',
    ingredients: ['Café instantáneo', 'Extracto de Ganoderma lucidum'],
    benefits: ['Café negro puro: sin crema y sin azúcar', 'Sabor robusto, con el amargo justo', 'Treinta sobres: un mes completo'],
    perfilIdeal: 'Quien toma el café negro, o cuida el azúcar en lo que consume',
    momentoConsumo: 'Mañana y después del almuerzo',
    ritual: ['Un sobre por taza; para un café más cargado, menos agua', 'Se puede tomar frío: prepárelo y sírvalo con hielo', 'Es el café de quien no quiere azúcar en la taza'],
    combinacionSugerida: ['3-in-1', 'ganoderma'],
  },
  'tongkat-ali': {
    ...base,
    name: 'Gano Café Tongkat Ali',
    price: 33,
    image: '/productos/usa/tongkat-ali.png',
    presentacion: 'Caja de 15 sobres',
    categoria: 'Café',
    llevaGanoderma: true,
    shortDescription: 'El café cremoso de la línea con dos raíces más en el sobre: ginseng americano y Tongkat Ali, la raíz que se toma en Malasia, de donde viene Gano Excel. Café, crema y azúcar, con el extracto de Ganoderma.',
    taglineEstrategico: 'El 3-in-1 con dos raíces más',
    usage: 'Un sobre en 150 ml de agua caliente. Revuelva y listo.',
    ingredients: ['Azúcar', 'Crema no láctea', 'Café instantáneo', 'Ginseng americano (Panax quinquefolius)', 'Tongkat Ali (Eurycoma longifolia)', 'Extracto de Ganoderma lucidum', 'Contiene leche'],
    benefits: ['Cremoso, como el 3-in-1', 'Con ginseng americano y Tongkat Ali', 'Listo en un sobre'],
    perfilIdeal: 'Quien ya toma el 3-in-1 y quiere probar la versión con raíces',
    momentoConsumo: 'La mañana',
    ritual: ['Prepárelo como el 3-in-1: un sobre y agua caliente', 'Alterne con el 3-in-1: uno para la mañana, otro para la tarde'],
    combinacionSugerida: ['3-in-1', 'classic'],
  },
  'latte-light': {
    ...base,
    name: 'Latte Light',
    price: 33,
    image: '/productos/usa/latte-light.png',
    presentacion: 'Caja de 15 sobres',
    categoria: 'Café',
    llevaGanoderma: true,
    shortDescription: 'El latte de todos los días, con solo 4 g de azúcar por sobre. Café y crema, con el extracto de Ganoderma adentro.',
    taglineEstrategico: 'El latte, con 4 g de azúcar',
    usage: 'Un sobre en 150 ml de agua caliente. Revuelva hasta que espume.',
    ingredients: ['Café', 'Crema', 'Extracto de Ganoderma lucidum'],
    benefits: ['Solo 4 g de azúcar por sobre', 'Cremoso, como el de una cafetería', 'Solo necesita agua caliente'],
    perfilIdeal: 'Quien quiere su latte y cuida el azúcar',
    momentoConsumo: 'Media mañana o media tarde',
    ritual: ['Revuelva fuerte al final: ahí sale la espuma', 'Para un latte helado, prepárelo con la mitad del agua y complete con hielo'],
    combinacionSugerida: ['mocha-light', 'classic'],
  },
  'mocha': {
    ...base,
    name: 'Gano Café Mocha',
    price: 40,
    image: '/productos/usa/mocha.png',
    presentacion: 'Caja de 15 sobres',
    categoria: 'Café',
    llevaGanoderma: true,
    shortDescription: 'Para esa hora de la tarde en que uno quiere algo dulce: café y cacao en el mismo sobre, con una crema que espuma y el extracto de Ganoderma adentro.',
    taglineEstrategico: 'El cacao le quita el filo al café; el café le quita el empalago al chocolate',
    usage: 'Un sobre en 180 ml de agua caliente.',
    ingredients: ['Azúcar', 'Crema no láctea', 'Café instantáneo', 'Cacao en polvo', 'Crema espumosa', 'Extracto de Ganoderma lucidum', 'Contiene leche'],
    benefits: ['Café y chocolate en una sola taza', 'Espuma ligera al revolver', 'Solo necesita agua caliente'],
    perfilIdeal: 'Quien quiere algo dulce por la tarde sin pensarlo mucho',
    momentoConsumo: 'La tarde',
    ritual: ['Con leche caliente en vez de agua queda más cremoso', 'Es el que suelen preferir quienes no toman el café negro'],
    combinacionSugerida: ['mocha-light', 'schokolade'],
  },
  'mocha-light': {
    ...base,
    name: 'Mocha Light',
    price: 38,
    image: '/productos/usa/mocha-light.png',
    presentacion: 'Caja de 15 sobres',
    categoria: 'Café',
    llevaGanoderma: true,
    shortDescription: 'Todo el sabor del mocha, con solo 4 g de azúcar por sobre: café y cacao, con el extracto de Ganoderma adentro.',
    taglineEstrategico: 'El mocha, con 4 g de azúcar',
    usage: 'Un sobre en 150 ml de agua caliente.',
    ingredients: ['Café', 'Cacao', 'Extracto de Ganoderma lucidum'],
    benefits: ['Solo 4 g de azúcar por sobre', 'Café y chocolate en una sola taza', 'Solo necesita agua caliente'],
    perfilIdeal: 'Quien quiere su mocha de la tarde y cuida el azúcar',
    momentoConsumo: 'La tarde',
    ritual: ['Con leche caliente en vez de agua queda más cremoso', 'Alterne con el Latte Light: uno para la mañana, otro para la tarde'],
    combinacionSugerida: ['latte-light', 'mocha'],
  },
  'schokolade': {
    ...base,
    name: 'Gano Schokolade',
    price: 34,
    image: '/productos/usa/schokolade.png',
    presentacion: 'Caja de 20 sobres',
    categoria: 'Chocolate',
    llevaGanoderma: true,
    shortDescription: 'El chocolate caliente de la línea, sin café: cacao, leche y el extracto de Ganoderma adentro, para tomarse despacio al final del día.',
    taglineEstrategico: 'El chocolate caliente, sin café',
    usage: 'Un sobre en 180 ml de agua caliente.',
    ingredients: ['Crema no láctea', 'Azúcar', 'Leche descremada en polvo', 'Cacao en polvo', 'Extracto de Ganoderma lucidum', 'Contiene leche'],
    benefits: ['Sin café', 'Cacao intenso, tan bueno como su aroma', 'Para toda la familia'],
    perfilIdeal: 'Quien no toma café, y las familias con niños',
    momentoConsumo: 'El final del día, o la tarde fría',
    ritual: ['Tómelo despacio: está hecho para eso', 'En leche caliente queda más cremoso'],
    combinacionSugerida: ['mocha', 'rooibos-tea'],
  },
  'rooibos-tea': {
    ...base,
    name: 'Rooibos Tea',
    price: 33,
    image: '/productos/usa/rooibos-tea.png',
    presentacion: 'Caja de 20 bolsitas',
    categoria: 'Té',
    llevaGanoderma: true,
    shortDescription: 'La infusión de la línea: rooibos de Sudáfrica con Ganoderma, sin cafeína, para la taza caliente del final del día.',
    taglineEstrategico: 'La taza de la noche, la que no quita el sueño',
    usage: 'Una bolsita en 180 ml de agua caliente. Deje reposar tres minutos.',
    ingredients: ['Rooibos (Aspalathus linearis)', 'Ganoderma lucidum'],
    benefits: ['Sin cafeína', 'Sabor suave', 'Caliente en la noche, o frío con hielo'],
    perfilIdeal: 'Quien no toma café, o quiere una taza caliente al final del día',
    momentoConsumo: 'La tarde y la noche',
    ritual: ['Tres minutos de reposo: ahí sale su color rojo', 'Frío con hielo y una rodaja de limón es otra bebida', 'Es la taza de después de la comida'],
    combinacionSugerida: ['schokolade', 'classic'],
  },
  'creal': {
    ...base,
    name: "C'Real",
    price: 34,
    image: '/productos/usa/creal.png',
    presentacion: 'Caja de 15 sobres',
    categoria: 'Cereal',
    llevaGanoderma: true,
    shortDescription: 'Un cereal caliente instantáneo, con malta, espirulina y extracto de Ganoderma, para las mañanas en que no hay tiempo de sentarse a la mesa.',
    taglineEstrategico: 'El desayuno de quien sale temprano',
    usage: 'Un sobre en 180 ml de agua o leche caliente. Revuelva y listo.',
    ingredients: ['Cereal de malta instantáneo (trigo, maíz, soya, arroz y malta)', 'Espirulina', 'Azúcar', 'Crema no láctea', 'Extracto de Ganoderma lucidum', 'Contiene trigo, soya y leche'],
    benefits: ['Desayuno caliente, listo en un minuto', 'Sabor dulce y textura cremosa', 'Sin café: para quien no lo toma'],
    perfilIdeal: 'Quien sale temprano y no desayuna, y quien no toma café',
    momentoConsumo: 'El desayuno',
    ritual: ['Con leche queda más espeso; con agua, como bebida', 'Va bien con una fruta al lado'],
    combinacionSugerida: ['3-in-1', 'schokolade'],
  },
  'reskine': {
    ...base,
    name: 'ReSkine',
    price: 63,
    image: '/productos/usa/reskine.png',
    presentacion: 'Caja de 10 sachets de 25 ml',
    categoria: 'Bebida',
    llevaGanoderma: true,
    shortDescription: 'Casi todo el colágeno es un polvo sin sabor que toca pasar rápido. Este es una bebida de frutos rojos con colágeno de pescado, lista para tomar directo del sachet, con manzana, goji, acerola, aloe y espinaca.',
    taglineEstrategico: 'La única forma de tomar colágeno en la que uno espera el momento',
    usage: 'Directo del sachet, sin agua ni vaso.',
    ingredients: ['Colágeno de pescado', 'Agua purificada', 'Concentrado de jugo de manzana', 'Eritritol', 'Sabores naturales de fresa, frambuesa y arándano', 'Extracto de goji', 'Jugo de aloe vera en polvo', 'Extracto de acerola', 'Espinaca en polvo', 'Arándano en polvo', 'Contiene soya y pescado'],
    benefits: ['Colágeno que sabe a fresa, frambuesa y arándano', 'Lista para tomar, directo del sachet', 'Con manzana, goji, acerola, aloe y espinaca'],
    perfilIdeal: 'Quien quiere tomar colágeno y no le gusta el que se vende sin sabor',
    momentoConsumo: 'La mañana, o después de entrenar',
    ritual: ['Bien frío es donde mejor sabe: guárdelo en la nevera', 'Un sachet al día; la caja rinde diez días', 'Cabe en el bolso: se toma donde esté'],
    combinacionSugerida: ['creal', 'latte-light'],
  },
  'ganoderma': {
    ...base,
    name: 'Spirit Ganoderma',
    price: 66,
    image: '/productos/usa/ganoderma.png',
    presentacion: 'Frasco de 90 cápsulas',
    categoria: 'Suplemento dietario',
    llevaGanoderma: true,
    shortDescription: 'El Ganoderma en su forma más directa, sin café ni bebida de por medio, para quien ya conoce la línea y lo quiere solo.',
    taglineEstrategico: 'El mismo hongo de toda la línea, en su forma más directa',
    usage: 'Una cápsula al día, con agua, preferiblemente con una comida.',
    ingredients: ['Reishi (Ganoderma lucidum), cuerpo del hongo, 275 mg por cápsula'],
    benefits: ['275 mg de Ganoderma por cápsula', 'Del cuerpo del hongo', 'Una al día: el frasco rinde tres meses'],
    perfilIdeal: 'Quien quiere el Ganoderma solo, sin café ni bebida',
    momentoConsumo: 'Con el almuerzo',
    ritual: ['Una cápsula con una comida, a la misma hora cada día', 'Al lado del café de la mañana, para no olvidarla', 'Con agua, nunca con el café caliente'],
    combinacionSugerida: ['excellium', 'cordyceps'],
  },
  'excellium': {
    ...base,
    name: 'Mind Excellium',
    price: 66,
    image: '/productos/usa/excellium.png',
    presentacion: 'Frasco de 90 cápsulas',
    categoria: 'Suplemento dietario',
    llevaGanoderma: true,
    shortDescription: 'Lo que la distingue es la parte del hongo: el micelio, el Ganoderma joven, que no lleva la Spirit.',
    taglineEstrategico: 'El Ganoderma joven, en cápsula',
    usage: 'Una cápsula al día, con agua, con el desayuno o el almuerzo.',
    ingredients: ['Reishi (Ganoderma lucidum), micelio, 425 mg por cápsula'],
    benefits: ['425 mg por cápsula', 'Del micelio, el hongo joven', 'Una al día: el frasco rinde tres meses'],
    perfilIdeal: 'Quien ya toma la Spirit y quiere probar la otra parte del hongo',
    momentoConsumo: 'La mañana',
    ritual: ['Con el desayuno, para que acompañe la jornada', 'Alterne con la Spirit Ganoderma si quiere probar las dos', 'Una al día es la medida; no hace falta más'],
    combinacionSugerida: ['classic', 'ganoderma'],
  },
  'cordyceps': {
    ...base,
    name: 'Body Cordyceps',
    price: 68,
    image: '/productos/usa/cordyceps.png',
    presentacion: 'Frasco de 60 cápsulas',
    categoria: 'Suplemento dietario',
    // La tabla de datos de ganoexcel.us no lista Ganoderma (USA_2026.md §2, verificado 6 nov 2026).
    llevaGanoderma: false,
    shortDescription: 'Cordyceps militaris en cápsula: el otro hongo de la línea, distinto del Ganoderma. Lo eligen quienes entrenan.',
    taglineEstrategico: 'El otro hongo de la línea',
    usage: 'Dos cápsulas al día, con agua, preferiblemente en la mañana.',
    ingredients: ['Cordyceps militaris, micelio, 450 mg por cápsula'],
    benefits: ['450 mg por cápsula', 'Dos cápsulas por porción', 'El frasco rinde un mes'],
    perfilIdeal: 'Quien entrena, o quien ya toma el café y quiere sumar algo distinto',
    momentoConsumo: 'La mañana, antes de la jornada o del entrenamiento',
    ritual: ['En la mañana, con el desayuno', 'Los días de entrenamiento, una hora antes', 'Combina con el Classic para quien no quiere azúcar'],
    combinacionSugerida: ['ganoderma', 'classic'],
  },
  'gano-plus': {
    ...base,
    name: 'Gano Plus',
    price: 235,
    image: '/productos/usa/gano-plus.png',
    presentacion: 'Caja de 45 sobres de 2 cápsulas',
    categoria: 'Suplemento dietario',
    llevaGanoderma: true,
    shortDescription: 'El extracto de Ganoderma más concentrado de Gano Excel, en cápsula: 392 mg de extracto por cápsula, en sobres de dos para llevar.',
    taglineEstrategico: 'El extracto más concentrado de la línea',
    usage: 'Un sobre al día: dos cápsulas, con agua.',
    ingredients: ['Extracto de Ganoderma lucidum (Lingzhi), 392 mg por cápsula', 'Dióxido de silicio', 'Hipromelosa (la cápsula)'],
    benefits: ['392 mg de extracto por cápsula', 'En sobres de dos cápsulas, para llevar', '90 cápsulas por caja'],
    perfilIdeal: 'Quien ya toma las cápsulas de la línea y quiere el extracto más concentrado',
    momentoConsumo: 'Con el almuerzo',
    ritual: ['Un sobre con una comida, a la misma hora cada día', 'Lleve un sobre en el bolso: no hace falta el frasco'],
    combinacionSugerida: ['ganoderma', 'excellium'],
  },
  'ganosoap': {
    ...base,
    name: 'Sense Soap',
    price: 23,
    image: '/productos/usa/ganosoap.png',
    presentacion: 'Dos barras',
    categoria: 'Cosmético',
    llevaGanoderma: true,
    shortDescription: 'El jabón de toda la familia, con leche de cabra, extracto de Ganoderma y vitamina E: suave y cremoso al usarlo.',
    taglineEstrategico: 'Limpia sin castigar',
    usage: 'Uso diario, en cuerpo y manos. Enjuague con agua tibia.',
    ingredients: ['Base de jabón', 'Leche de cabra', 'Extracto de Ganoderma lucidum', 'Fragancia'],
    benefits: ['Con leche de cabra y vitamina E', 'La piel queda suave en vez de tirante', 'Dos barras por caja'],
    perfilIdeal: 'Quien tiene la piel delicada y busca un jabón que no reseque',
    momentoConsumo: 'La ducha diaria',
    ritual: ['Guárdelo seco entre usos para que rinda más', 'Después de la ducha, el Reishi Touch'],
    combinacionSugerida: ['reishi-touch', 'toothpaste'],
  },
  'toothpaste': {
    ...base,
    name: 'Fresh Toothpaste',
    price: 24,
    image: '/productos/usa/toothpaste.png',
    presentacion: 'Pasta dental',
    categoria: 'Cosmético',
    llevaGanoderma: true,
    shortDescription: 'La pasta de dientes de la casa, sin flúor y con extracto de Ganoderma: la que buscan las familias que revisan etiquetas.',
    taglineEstrategico: 'La frescura de la menta, sin flúor',
    usage: 'Cepillado normal, dos o tres veces al día.',
    ingredients: ['Sorbitol', 'Glicerina', 'Sílice', 'Agua purificada', 'Sabor a menta', 'Extracto de Ganoderma lucidum', 'Sin flúor'],
    benefits: ['Sin flúor', 'Limpia y refresca el aliento', 'Para toda la familia'],
    perfilIdeal: 'Familias que prefieren una pasta sin flúor',
    momentoConsumo: 'Mañana y noche',
    ritual: ['La misma rutina de siempre, con otro producto en la mano', 'Mañana y noche: el aliento fresco dura'],
    combinacionSugerida: ['ganosoap', 'reishi-touch'],
  },
  'reishi-touch': {
    ...base,
    name: 'Reishi Touch',
    price: 52,
    image: '/productos/usa/reishi-touch.png',
    presentacion: 'Loción corporal',
    categoria: 'Cosmético',
    llevaGanoderma: true,
    shortDescription: 'Una loción para después de la ducha, con extracto de Ganoderma, chaga, shiitake y trufa blanca, sobre una base de karité, jojoba y coco.',
    taglineEstrategico: 'La loción de después de la ducha',
    usage: 'Sobre la piel limpia, con un masaje suave hasta que se absorba.',
    ingredients: ['Extractos de Ganoderma, chaga, shiitake y trufa blanca', 'Manteca de karité', 'Aceite de jojoba', 'Aceite de coco'],
    benefits: ['Con karité, jojoba y coco', 'Cuatro hongos en una loción', 'Para el cuerpo, todos los días'],
    perfilIdeal: 'Quien termina la ducha con una loción y quiere una con hongos',
    momentoConsumo: 'Después de la ducha',
    ritual: ['Con la piel todavía un poco húmeda se absorbe mejor', 'Después del Sense Soap: la rutina completa de la ducha'],
    combinacionSugerida: ['ganosoap', 'toothpaste'],
  },
}

/** Las líneas de allá: las de Colombia sin Luvoco, que en Estados Unidos no existe (USA_2026.md §2.1). */
export const LINEAS_US: { id: string; nombre: string; ids: string[] }[] = [
  {
    id: 'cafe',
    nombre: 'Bebidas',
    ids: ['3-in-1', 'classic', 'tongkat-ali', 'latte-light', 'mocha', 'mocha-light', 'schokolade', 'rooibos-tea', 'creal', 'reskine'],
  },
  { id: 'capsulas', nombre: 'Suplementos', ids: ['ganoderma', 'excellium', 'cordyceps', 'gano-plus'] },
  { id: 'cuidado', nombre: 'Cuidado personal', ids: ['ganosoap', 'toothpaste', 'reishi-touch'] },
]

export const MAS_PEDIDO_US = '3-in-1'

/** El descargo que Gano Excel USA imprime en cada producto, en español. No va en los cosméticos. */
export const DESCARGO_FDA = 'Estas declaraciones no han sido evaluadas por la FDA (Administración de Alimentos y Medicamentos de los Estados Unidos). Este producto no está destinado a diagnosticar, tratar, curar ni prevenir ninguna enfermedad.'

// ─── Preguntas (BORRADOR — pendiente del Director) ───────────────────────────
// Las mismas cinco de Colombia, con los datos de allá: precio en dólares, envío
// por FedEx desde California y «en Estados Unidos desde 2003» (USA_2026.md §5 y §7).

export const PREGUNTAS_US: { p: string; r: string }[] = [
  {
    p: '¿Qué es el Gano Café?',
    r: 'Es el café de Gano Excel con extracto de Ganoderma lucidum, el hongo también conocido como Reishi. El más pedido es el 3-in-1, que ya trae crema y azúcar; el Classic es café negro sin azúcar, y el Latte Light y el Mocha Light traen solo 4 g de azúcar por sobre.',
  },
  {
    p: '¿Cuánto cuesta el Gano Café en Estados Unidos?',
    r: 'El Gano Café 3-in-1 (caja de 20 sobres) y el Classic (caja de 30 sobres) cuestan $33 USD cada uno. Todos los precios de este catálogo están en dólares, al precio al por menor de Gano Excel USA, y no incluyen el envío.',
  },
  {
    p: '¿Cómo pago y cómo me llega el pedido?',
    r: 'Arme su pedido aquí y envíelo por WhatsApp. Le llega a Queswa, y su distribuidor le escribe para acordar el pago y la entrega: en persona si están en la misma ciudad, o Gano Excel se lo despacha por FedEx desde California.',
  },
  {
    p: '¿Hay un precio más bajo?',
    r: 'Sí: quien se afilia a Gano Excel compra al precio de afiliado, que en el 3-in-1 es de $25 USD. Su distribuidor le cuenta cómo hacerlo.',
  },
  {
    p: '¿Quién fabrica estos productos?',
    r: 'Gano Excel, una empresa con 30 años y presencia en más de 60 países, en Estados Unidos desde 2003, con sede en el sur de California. Fabrica y despacha; quien le atiende es un distribuidor independiente.',
  },
]
