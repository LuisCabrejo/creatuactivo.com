/**
 * Copyright © 2026 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * LOS 22 PRODUCTOS DEL CATÁLOGO — datos, sin presentación.
 *
 * Salieron de src/app/productos/page.tsx el 17 oct 2026, al rehacer el catálogo
 * como tienda B2C: la página es la vitrina y esto es el inventario. El contenido
 * es el del 9 sep 2026, reescrito con el Director: composición verificada contra
 * ganoexcel.com.co (nunca contra el sitio de EE. UU., que formula distinto),
 * nombres y precios del back office, y la voz de las fichas del catálogo de
 * Queswa. Un cambio de precio aquí debe ir también a src/lib/wa-productos.ts,
 * que es la tabla con la que el canal confirma el pedido.
 */

import { PROMOCIONES_GANO, unidadesDe } from '@/lib/promociones-gano'

// Interfaces mejoradas con campos estratégicos
// Los 22 productos, reescritos el 9 sep 2026 con el Director: composición
// verificada contra ganoexcel.com.co (nunca contra el sitio de EE. UU., que
// formula distinto), nombres y precios del back office, y la voz de las fichas
// del catálogo de Queswa. `presentacion` y `categoria` (la del fabricante) se
// muestran; `llevaGanoderma` condiciona el bloque del extracto en la ficha;
// `ritual` reemplaza a los puntos de conversación del socio, que se le
// mostraban al prospecto.
export interface Product {
  name: string
  price: number
  image: string
  invima: string
  presentacion: string
  categoria: string
  llevaGanoderma: boolean
  goals: string[]
  shortDescription: string
  taglineEstrategico: string
  usage: string
  ingredients: string[]
  benefits: string[]
  perfilIdeal: string
  momentoConsumo: string
  ritual: string[]
  combinacionSugerida?: string[]
  sistemaRecomendado?: string
  downloadUrl?: string
  /** Solo en las promociones de Gano (22 oct 2026): qué trae y cuántas por pedido. */
  promocion?: { inventoryId: number; contenido: { id: string; cantidad: number }[]; limite: number }
}

export const productData: Record<string, Product> = {
  'ganocafe-3-en-1': {
    name: 'Ganocafé 3 en 1',
    price: 110900,
    image: '/productos/bebidas/ganocafe-3-en-1-gano-excel-min.png',
    invima: 'RSA-0011698-2021',
    presentacion: 'Caja de 20 sobres',
    categoria: 'Alimento',
    llevaGanoderma: true,
    goals: ['Energía', 'Ritual de mañana'],
    shortDescription: 'El café de todas las mañanas, listo en un sobre: se sirve el agua caliente y ya está. Lleva el extracto de Ganoderma adentro, y su sabor suave y su aroma son la razón por la que se vuelve costumbre.',
    taglineEstrategico: 'El café de la mañana, con algo más adentro',
    usage: 'Un sobre en 150 ml de agua caliente. Revuelva y listo.',
    ingredients: ['Café instantáneo', 'Crema no láctea', 'Azúcar', 'Betaglucanos de Ganoderma lucidum', 'Contiene derivados de la leche'],
    benefits: ['Café, crema y azúcar en un solo sobre', 'Energía pareja, sin nerviosismo y sin el bajón de media mañana', 'El más pedido de la línea'],
    perfilIdeal: 'Quien ya toma café todas las mañanas y quiere que ese café haga algo más',
    momentoConsumo: 'A primera hora, como su café de siempre',
    ritual: ['Prepárelo como el café de siempre: un sobre, agua caliente, y a la mesa', 'Si lo prefiere más suave, use 180 ml de agua', 'Va bien acompañado de una cápsula con el almuerzo'],
    combinacionSugerida: ['capsulas-excellium', 'ganorico-latte-rico'],
    sistemaRecomendado: 'energia-enfoque',
  },
  'ganocafe-clasico': {
    name: 'Ganocafé Clásico',
    price: 110900,
    image: '/productos/bebidas/gano-cafe-clasico-gano-excel-min.png',
    invima: '',
    presentacion: 'Caja de 30 sobres',
    categoria: 'Suplemento dietario',
    llevaGanoderma: true,
    goals: ['Energía', 'Sin azúcar'],
    shortDescription: 'El tinto de siempre, con el extracto de Ganoderma adentro: una taza que invita a equilibrar cuerpo y mente, en la mañana o después del almuerzo.',
    taglineEstrategico: 'Para quien toma el tinto negro y no lo negocia',
    usage: 'Un sobre de 4,5 g en 150 ml de agua caliente.',
    ingredients: ['Café instantáneo', 'Extracto de Ganoderma lucidum'],
    benefits: ['Café negro puro: sin crema y sin azúcar', 'Aroma tentador y sabor robusto, con el amargo justo de una buena cafetería', 'Treinta sobres: un mes completo'],
    perfilIdeal: 'Quien toma el café negro, o cuida el azúcar en lo que consume',
    momentoConsumo: 'Mañana y después del almuerzo',
    ritual: ['Un sobre por taza; para un café más cargado, 120 ml de agua', 'Se puede tomar frío: prepárelo y sírvalo con hielo', 'Es el café de quien no quiere azúcar en la taza'],
    combinacionSugerida: ['capsulas-ganoderma'],
    sistemaRecomendado: 'energia-enfoque',
  },
  'ganorico-latte-rico': {
    name: 'Ganorico Latte Rico',
    price: 119900,
    image: '/productos/bebidas/latte-rico-gano-excel-min.png',
    invima: 'NSA-0010760-2021',
    presentacion: 'Caja de 20 sobres',
    categoria: 'Alimento',
    llevaGanoderma: true,
    goals: ['Cremoso', 'Pausa'],
    shortDescription: 'El café de media mañana o media tarde, para quien lo prefiere suave antes que negro. Café, crema y extracto de Ganoderma, en una taza que se arma en un minuto.',
    taglineEstrategico: 'La textura de cafetería, en su cocina',
    usage: 'Un sobre de 15 g en 180 ml de agua caliente. Revuelva hasta que espume.',
    ingredients: ['Crema de café no láctea', 'Café instantáneo', 'Grasa vegetal', 'Leche en polvo y leche desnatada en polvo', 'Betaglucanos de Ganoderma lucidum', 'Contiene derivados de la leche'],
    benefits: ['Cremoso y con espuma, como el de una cafetería', 'Sabor redondo que no empalaga', 'Solo necesita agua caliente'],
    perfilIdeal: 'Quien prefiere el café suave y cremoso al café negro',
    momentoConsumo: 'Media mañana o media tarde',
    ritual: ['Revuelva fuerte al final: ahí sale la espuma', 'Para un latte helado, prepárelo con la mitad del agua y complete con hielo', 'Media mañana o media tarde: es el café de la pausa'],
    combinacionSugerida: ['ganorico-mocha-rico', 'bebida-colageno-reskine'],
    sistemaRecomendado: 'familiar-nutricion',
  },
  'ganorico-mocha-rico': {
    name: 'Ganorico Mocha Rico',
    price: 119900,
    image: '/productos/bebidas/mocha-rico-gano-excel-min.png',
    invima: 'NSA-0010760-2021',
    presentacion: 'Caja de 20 sobres',
    categoria: 'Alimento',
    llevaGanoderma: true,
    goals: ['Café y chocolate', 'Tarde'],
    shortDescription: 'Para esa hora de la tarde en que uno quiere algo dulce: café y cacao en el mismo sobre, con el extracto de Ganoderma adentro.',
    taglineEstrategico: 'El cacao le quita el filo al café; el café le quita el empalago al chocolate',
    usage: 'Un sobre de 18 g en 180 ml de agua caliente.',
    ingredients: ['Crema de moca no láctea', 'Café instantáneo', 'Cacao en polvo', 'Crema espumosa', 'Leche desnatada en polvo', 'Sabor natural a vainilla', 'Extracto de malta de cebada', 'Betaglucanos de Ganoderma lucidum', 'Contiene derivados de la leche', 'Contiene gluten (malta de cebada)'],
    benefits: ['Café y chocolate equilibrados en una sola taza', 'Un toque de vainilla al final', 'Espuma ligera al revolver'],
    perfilIdeal: 'Quien quiere algo dulce por la tarde sin pensarlo mucho',
    momentoConsumo: 'La tarde',
    ritual: ['Con leche caliente en vez de agua queda más cremoso', 'Es el que suelen preferir quienes no toman el café negro', 'Alterne con el Latte Rico: uno para la mañana, otro para la tarde'],
    combinacionSugerida: ['ganorico-shoko-rico', 'espirulina-gano-creal'],
    sistemaRecomendado: 'familiar-nutricion',
  },
  'ganorico-shoko-rico': {
    name: 'Ganorico Shoko Rico',
    price: 124900,
    image: '/productos/bebidas/shoko-rico-gano-excel-min.png',
    invima: 'NSA-0010766-2021',
    presentacion: 'Caja de 20 sobres',
    categoria: 'Alimento',
    llevaGanoderma: true,
    goals: ['Familia', 'Sin café'],
    shortDescription: 'El chocolate caliente de la casa, el que se prepara en la noche: de sabor y aroma intensos, con el extracto de Ganoderma adentro.',
    taglineEstrategico: 'El chocolate que piden los niños',
    usage: 'Un sobre de 23 g en 180 ml de agua o de leche caliente.',
    ingredients: ['Chocolate en polvo', 'Extracto de Ganoderma lucidum'],
    benefits: ['Sin café', 'En agua o en leche, según la casa', 'Para toda la familia'],
    perfilIdeal: 'Familias con niños, y quien no toma café',
    momentoConsumo: 'La noche, o la tarde fría',
    ritual: ['En leche queda más espeso; en agua, más ligero', 'Es la bebida de los niños de la casa en la noche', 'El Schokolade es su versión para adultos: más cacao, menos dulce'],
    combinacionSugerida: ['espirulina-gano-creal', 'gano-schokoladde'],
    sistemaRecomendado: 'familiar-nutricion',
  },
  'espirulina-gano-creal': {
    name: 'Gano C\'Real Spirulina',
    price: 119900,
    image: '/productos/bebidas/ganocereal-spirulina-min.png',
    invima: 'PSA-0004956-2024',
    presentacion: 'Caja de 15 sobres',
    categoria: 'Alimento',
    llevaGanoderma: true,
    goals: ['Desayuno', 'Sin café'],
    shortDescription: 'Un cereal instantáneo con espirulina y extracto de Ganoderma, para las mañanas en que no hay tiempo de sentarse a la mesa.',
    taglineEstrategico: 'El desayuno de quien sale temprano',
    usage: 'Un sobre de 30 g en 180 ml de agua o leche caliente. Revuelva y listo.',
    ingredients: ['Cereales', 'Azúcar', 'Crema no láctea', 'Espirulina', 'Extracto de Ganoderma lucidum', 'Contiene derivados de la leche'],
    benefits: ['Desayuno completo, listo en un minuto', 'Sabor suave, entre cereal y bebida caliente', 'Sin café: para quien no lo toma'],
    perfilIdeal: 'Quien sale temprano y no desayuna, y quien no toma café',
    momentoConsumo: 'El desayuno',
    ritual: ['Con leche queda más espeso, como una papilla; con agua, como bebida', 'Es la opción de desayuno de quien no toma café', 'Va bien con una fruta al lado'],
    combinacionSugerida: ['ganocafe-3-en-1', 'capsulas-cordygold'],
    sistemaRecomendado: 'rendimiento-avanzado',
  },
  'bebida-oleaf-gano-rooibos': {
    name: 'Oleaf Gano Rooibos',
    price: 119900,
    image: '/productos/bebidas/te-rooibos-gano-excel-min.png',
    invima: 'SD2017-0004109',
    presentacion: 'Caja de 20 sobres',
    categoria: 'Suplemento dietario',
    llevaGanoderma: true,
    goals: ['Sin cafeína', 'Noche'],
    shortDescription: 'La única infusión de la línea: rooibos de Sudáfrica con extracto de Ganoderma, para calmar los sentidos y armonizar cuerpo y mente al final del día.',
    taglineEstrategico: 'La taza de la noche, la que no quita el sueño',
    usage: 'Un sobre en 180 ml de agua caliente. Deje reposar tres minutos.',
    ingredients: ['Rooibos de Sudáfrica', 'Extracto de Ganoderma lucidum'],
    benefits: ['Sin cafeína', 'Sabor suave y ligeramente dulce', 'Caliente en la noche, o frío con hielo'],
    perfilIdeal: 'Quien no toma café, o quiere una taza caliente al final del día',
    momentoConsumo: 'La tarde y la noche',
    ritual: ['Tres minutos de reposo: ahí sale su color rojo', 'Frío con hielo y una rodaja de limón es otra bebida', 'Es la taza de después de la comida'],
    combinacionSugerida: ['capsulas-ganoderma', 'gano-schokoladde'],
    sistemaRecomendado: 'belleza-holistica',
  },
  'gano-schokoladde': {
    name: 'Gano Schokolade',
    price: 124900,
    image: '/productos/bebidas/gano-schokolade-gano-excel-min.png',
    invima: 'NSA-0013117-2022',
    presentacion: 'Caja de 20 sobres',
    categoria: 'Alimento',
    llevaGanoderma: true,
    goals: ['Cacao intenso', 'Adultos'],
    shortDescription: 'El chocolate del adulto, para tomarse despacio al final del día, con el extracto de Ganoderma adentro.',
    taglineEstrategico: 'Más profundo y menos dulce que el Shoko Rico',
    usage: 'Un sobre en 180 ml de agua caliente.',
    ingredients: ['Cacao', 'Azúcar refinada', 'Crema no láctea', 'Leche descremada en polvo', 'Extracto de Ganoderma lucidum', 'Contiene derivados de la leche'],
    benefits: ['Cacao intenso', 'Un sabor tan bueno como su aroma', 'Solo necesita agua caliente'],
    perfilIdeal: 'Conocedores del chocolate que lo prefieren intenso',
    momentoConsumo: 'El final del día',
    ritual: ['Tómelo despacio: está hecho para eso', 'En leche caliente queda más cremoso', 'Para los niños, el Shoko Rico; este es el de los adultos'],
    combinacionSugerida: ['luvoco-medio', 'ganorico-shoko-rico'],
    sistemaRecomendado: 'experiencia-premium',
  },
  'bebida-colageno-reskine': {
    name: 'Reskine Colágeno',
    price: 216900,
    image: '/productos/bebidas/gano-plus-reskine-collagen-drink-gano-excel-min.png',
    invima: 'RSA-0025739-2023',
    presentacion: 'Caja de 10 sachets de 25 ml',
    categoria: 'Alimento',
    llevaGanoderma: true,
    goals: ['Colágeno', 'Frutos rojos'],
    shortDescription: 'Casi todo el colágeno es un polvo sin sabor que toca pasar rápido. Este es una bebida de frutos rojos con colágeno de pescado, y junto con una dieta saludable, el colágeno ayuda a mantener la función de barrera de la piel.',
    taglineEstrategico: 'La única forma de tomar colágeno en la que uno espera el momento',
    usage: 'Directo del sachet, sin agua ni vaso.',
    ingredients: ['Colágeno de pescado', 'Betaglucanos de Ganoderma lucidum', 'Quinua líquida', 'Concentrado de jugo de manzana', 'Extracto de goji', 'Jugo de aloe vera', 'Espinaca en polvo', 'Sabor a fresa, frambuesa y arándano', 'Contiene pescado'],
    benefits: ['Sabe a fresa, frambuesa y arándano', 'Lista para tomar, directo del sachet', 'Con quinua, manzana, goji, aloe y espinaca'],
    perfilIdeal: 'Quien quiere tomar colágeno y no le gusta el que se vende sin sabor',
    momentoConsumo: 'La mañana, o después de entrenar',
    ritual: ['Bien frío es donde mejor sabe: guárdelo en la nevera', 'Un sachet al día; la caja rinde diez días', 'Cabe en el bolso: se toma donde esté'],
    combinacionSugerida: ['espirulina-gano-creal', 'capsulas-cordygold'],
    sistemaRecomendado: 'belleza-holistica',
  },
  'capsulas-ganoderma': {
    name: 'Cápsulas de Ganoderma',
    price: 272500,
    image: '/productos/suplementos/capsulas-de-ganoderma-gano-excel-min.png',
    invima: '',
    presentacion: 'Frasco de 90 cápsulas',
    categoria: 'Suplemento dietario',
    llevaGanoderma: true,
    goals: ['Extracto puro', 'Tres meses'],
    shortDescription: 'El extracto de Ganoderma en su forma más directa, sin café ni bebida de por medio, para quien ya conoce la línea y lo quiere solo.',
    taglineEstrategico: 'El mismo hongo de toda la línea, en su forma más directa',
    usage: 'Una cápsula al día, con agua, preferiblemente con una comida.',
    ingredients: ['Extracto de Ganoderma lucidum, 275 mg por cápsula', 'Cápsula'],
    benefits: ['275 mg de extracto de Ganoderma por cápsula', 'Como parte de la rutina, apoya el funcionamiento normal de las defensas', 'Una al día: el frasco rinde tres meses'],
    perfilIdeal: 'Quien quiere el Ganoderma solo, sin café ni bebida',
    momentoConsumo: 'Con el almuerzo',
    ritual: ['Una cápsula con una comida, a la misma hora cada día', 'Al lado del café de la mañana, para no olvidarla', 'Con agua, nunca con el café caliente'],
    combinacionSugerida: ['capsulas-excellium', 'capsulas-cordygold'],
    sistemaRecomendado: 'rendimiento-avanzado',
  },
  'capsulas-excellium': {
    name: 'Cápsulas Excellium',
    price: 272500,
    image: '/productos/suplementos/capsulas-de-excellium-gano-excel-min.png',
    invima: '',
    presentacion: 'Frasco de 90 cápsulas',
    categoria: 'Suplemento dietario',
    llevaGanoderma: true,
    goals: ['Enfoque', 'Tres meses'],
    shortDescription: 'Lo que la distingue es la parte del hongo: el micelio, el Ganoderma joven, que no llevan las otras cápsulas.',
    taglineEstrategico: 'Para llegar despierto a la tarde',
    usage: 'Una cápsula al día, con agua, con el desayuno o el almuerzo.',
    ingredients: ['Extracto de Ganoderma lucidum del hongo joven (micelio), 425 mg por cápsula', 'Cápsula'],
    benefits: ['425 mg por cápsula', 'Las buscan quienes tienen el día lleno de decisiones', 'Una al día: el frasco rinde tres meses'],
    perfilIdeal: 'Quien tiene el día lleno de decisiones y quiere llegar despierto a la tarde',
    momentoConsumo: 'La mañana',
    ritual: ['Con el desayuno, para que acompañe la jornada', 'Alterne con las Cápsulas de Ganoderma si quiere probar las dos', 'Una al día es la medida; no hace falta más'],
    combinacionSugerida: ['ganocafe-clasico', 'capsulas-ganoderma'],
    sistemaRecomendado: 'energia-enfoque',
  },
  'capsulas-cordygold': {
    name: 'Cápsulas Cordygold',
    price: 336900,
    image: '/productos/suplementos/capsulas-de-cordy-gold-gano-excel-min.png',
    invima: 'SD2017-0004056',
    presentacion: 'Frasco de 60 cápsulas',
    categoria: 'Suplemento dietario',
    llevaGanoderma: false,
    goals: ['Cordyceps', 'Rendimiento'],
    shortDescription: 'Cordyceps sinensis, un hongo adaptógeno que se asocia con la energía natural, el rendimiento físico y la resistencia. Lo eligen quienes entrenan o pasan el día de pie.',
    taglineEstrategico: 'La cápsula más concentrada del portafolio: 500 mg',
    usage: 'Una cápsula al día, con agua, preferiblemente en la mañana.',
    ingredients: ['Extracto de Cordyceps sinensis, 500 mg por cápsula', 'Cápsula'],
    benefits: ['Energía natural, rendimiento físico y resistencia', 'Apoya el funcionamiento normal de las defensas', 'Una al día; el frasco rinde dos meses'],
    perfilIdeal: 'Quien entrena, quien pasa el día de pie, o quien ya toma el café y quiere sumar algo distinto',
    momentoConsumo: 'La mañana, antes de la jornada o del entrenamiento',
    ritual: ['En la mañana, con el desayuno', 'Los días de entrenamiento, una hora antes', 'Combina con el Ganocafé Clásico para quien no quiere azúcar'],
    combinacionSugerida: ['espirulina-gano-creal', 'capsulas-ganoderma'],
    sistemaRecomendado: 'rendimiento-avanzado',
  },
  'pasta-dientes-gano-fresh': {
    name: 'Gano Fresh · Pasta dental',
    price: 73900,
    image: '/productos/cuidado-personal/gano-fresh-gano-excel-min.png',
    invima: 'NSOC58855-14CO',
    presentacion: 'Tubo de 150 g',
    categoria: 'Cosmético',
    llevaGanoderma: true,
    goals: ['Sin flúor', 'Familia'],
    shortDescription: 'La pasta de dientes de la casa, la que buscan las familias que revisan etiquetas, con extracto de Ganoderma.',
    taglineEstrategico: 'La frescura de la menta, sin flúor',
    usage: 'Cepillado normal, dos o tres veces al día.',
    ingredients: ['Sorbitol', 'Agua', 'Menta', 'Extracto de Ganoderma lucidum'],
    benefits: ['Limpia y refresca el aliento', 'Una frescura de menta que dura', 'Para toda la familia'],
    perfilIdeal: 'Familias que prefieren una pasta sin flúor',
    momentoConsumo: 'Mañana y noche',
    ritual: ['La misma rutina de siempre, con otro producto en la mano', 'Mañana y noche: el aliento fresco dura'],
    combinacionSugerida: ['jabon-gano', 'jabon-transparente-gano'],
    sistemaRecomendado: 'familiar-nutricion',
  },
  'jabon-gano': {
    name: 'Jabón Gano',
    price: 73900,
    image: '/productos/cuidado-personal/gano-jabon-gano-excel-min.png',
    invima: 'NSOC99970-20CO',
    presentacion: 'Dos barras de 100 g',
    categoria: 'Cosmético',
    llevaGanoderma: true,
    goals: ['Piel', 'Leche de cabra'],
    shortDescription: 'El jabón del cuerpo para toda la familia, con extracto de Ganoderma: para el cuidado diario de quien tiene la piel delicada.',
    taglineEstrategico: 'Limpia sin castigar',
    usage: 'Uso diario, en cuerpo y manos. Enjuague con agua tibia.',
    ingredients: ['Leche de cabra', 'Extracto de Ganoderma lucidum', 'Base de jabón'],
    benefits: ['Con leche de cabra', 'La piel queda suave en vez de tirante', 'Dos barras por caja'],
    perfilIdeal: 'Quien tiene la piel delicada y busca un jabón que no reseque',
    momentoConsumo: 'La ducha diaria',
    ritual: ['Es el jabón de cuerpo; el Transparente es el de la cara', 'Guárdelo seco entre usos para que rinda más', 'Combina con el exfoliante dos veces por semana'],
    combinacionSugerida: ['jabon-transparente-gano', 'exfoliante-piel-brillo'],
    sistemaRecomendado: 'belleza-holistica',
  },
  'jabon-transparente-gano': {
    name: 'Jabón Transparente Soap',
    price: 78500,
    image: '/productos/cuidado-personal/jabon-transparent-soap-gano-excel-min.png',
    invima: 'NSOC09915-21CO',
    presentacion: 'Barra de 100 g',
    categoria: 'Cosmético',
    llevaGanoderma: true,
    goals: ['Rostro', 'Papaya y aloe'],
    shortDescription: 'El jabón de la cara, para mañana y noche: una limpieza delicada, con extracto de Ganoderma, que deja la piel limpia y nutrida.',
    taglineEstrategico: 'El del final del día',
    usage: 'Sobre el rostro húmedo, con movimientos suaves. Enjuague con agua tibia.',
    ingredients: ['Agua', 'Extracto de papaya', 'Extracto de hoja de aloe vera', 'Extracto de Ganoderma lucidum'],
    benefits: ['Con papaya y aloe vera', 'De fragancia suave', 'Limpia el maquillaje y el polvo de la calle sin dejar la piel áspera'],
    perfilIdeal: 'Quien quiere un jabón suave para la cara, mañana y noche',
    momentoConsumo: 'Mañana y noche',
    ritual: ['Con agua tibia, nunca caliente', 'El Jabón Gano es el del cuerpo; este, el de la cara', 'Por dentro, el Reskine: junto con una dieta saludable, el colágeno ayuda a mantener la función de barrera de la piel'],
    combinacionSugerida: ['jabon-gano', 'bebida-colageno-reskine'],
    sistemaRecomendado: 'belleza-holistica',
  },
  'champu-piel-brillo': {
    name: 'Champú Piel&Brillo',
    price: 73900,
    image: '/productos/cuidado-personal/shampoo-p&b-gano-excel-min.png',
    invima: 'NSOC07407-21CO',
    presentacion: 'Frasco de 300 ml',
    categoria: 'Cosmético',
    llevaGanoderma: true,
    goals: ['Cabello', 'Brillo'],
    shortDescription: 'Para el cabello que perdió el brillo: con aloe y extracto de Ganoderma, limpia a fondo y con suavidad. Es la mitad de un par: el acondicionador Piel&Brillo hace la otra.',
    taglineEstrategico: 'El brillo empieza en el lavado',
    usage: 'Sobre el cabello mojado, masajee hasta que haga espuma y enjuague. Siga con el acondicionador.',
    ingredients: ['Agua', 'Extracto de hoja de aloe', 'Extracto de Ganoderma lucidum', 'Sin sulfatos'],
    benefits: ['Sin sulfatos', 'Nutre y fortalece el cabello desde la raíz hasta las puntas', 'Para todo tipo de cabello'],
    perfilIdeal: 'Quien tiene el cabello opaco y quiere que vuelva a brillar',
    momentoConsumo: 'La ducha',
    ritual: ['Sin sulfatos: limpia sin resecar', 'Si el cabello está muy cargado, una segunda lavada', 'Champú y acondicionador juntos: ahí es donde se nota el brillo'],
    combinacionSugerida: ['acondicionador-piel-brillo', 'exfoliante-piel-brillo'],
    sistemaRecomendado: 'belleza-holistica',
  },
  'acondicionador-piel-brillo': {
    name: 'Acondicionador Piel&Brillo',
    price: 73900,
    image: '/productos/cuidado-personal/acondicionador-p&b-gano-excel-min.png',
    invima: 'NSOC07389-21CO',
    presentacion: 'Frasco de 300 ml',
    categoria: 'Cosmético',
    llevaGanoderma: true,
    goals: ['Cabello', 'Suavidad'],
    shortDescription: 'La segunda mitad del par: el champú limpia y este cierra. Se absorbe rápido y deja el cabello lleno de brillo.',
    taglineEstrategico: 'Suave al tacto, y el peine pasa sin tirones',
    usage: 'Después del champú, de medios a puntas. Deje un minuto y enjuague.',
    ingredients: ['Agua', 'Fragancia', 'Propilparabeno', 'Extracto de Ganoderma lucidum'],
    benefits: ['Fórmula ligera, sin peso', 'Suave, manejable y fácil de peinar'],
    perfilIdeal: 'Quien usa el champú Piel&Brillo y quiere cerrar la rutina',
    momentoConsumo: 'La ducha, después del champú',
    ritual: ['De medios a puntas, nunca en la raíz: así no deja peso', 'Un minuto antes de enjuagar', 'Rinde lo mismo que el champú, por eso se compran juntos'],
    combinacionSugerida: ['champu-piel-brillo', 'jabon-gano'],
    sistemaRecomendado: 'belleza-holistica',
  },
  'exfoliante-piel-brillo': {
    name: 'Exfoliante Corporal Piel&Brillo',
    price: 73900,
    image: '/productos/cuidado-personal/exfoliante-p&b-gano-excel-min.png',
    invima: 'NSOC96487-19CO',
    presentacion: 'Envase de 300 ml',
    categoria: 'Cosmético',
    llevaGanoderma: true,
    goals: ['Piel', 'Semanal'],
    shortDescription: 'Para la piel que se siente áspera: un exfoliante para la ducha, con extracto de Ganoderma, que se lleva lo que el jabón no alcanza.',
    taglineEstrategico: 'La piel lisa, al pasar la mano',
    usage: 'Dos o tres veces por semana, sobre la piel húmeda, con movimientos circulares. Enjuague.',
    ingredients: ['Agua', 'Sílice hidratada (las partículas suaves)', 'Extracto de Ganoderma lucidum'],
    benefits: ['Partículas suaves que no raspan', 'La diferencia se siente el mismo día', 'Dos o tres veces por semana es la medida'],
    perfilIdeal: 'Quien quiere la piel lisa y no tiene tiempo para tratamientos largos',
    momentoConsumo: 'Dos o tres duchas por semana',
    ritual: ['Después, el Jabón Gano deja la piel suave', 'Dos o tres veces por semana basta', 'La noche antes de una ocasión especial'],
    combinacionSugerida: ['jabon-gano', 'champu-piel-brillo'],
    sistemaRecomendado: 'belleza-holistica',
  },
  'maquina-luvoco': {
    name: 'Máquina Luvoco',
    price: 1026000,
    image: '/productos/luvoco/luvoco55-1-1024x1024.png',
    invima: '',
    presentacion: 'Máquina de espresso para cápsulas Luvoco',
    categoria: 'Electrodoméstico',
    llevaGanoderma: false,
    goals: ['Espresso', 'Se compra una vez'],
    shortDescription: 'El espresso de la casa, hecho con las cápsulas Luvoco: el cuerpo y la crema de una cafetería, en segundos.',
    taglineEstrategico: 'El espresso de cafetería, con solo presionar un botón',
    usage: 'Cápsula adentro, botón, y el espresso sale en segundos. Solo con cápsulas Luvoco.',
    ingredients: ['Máquina de espresso', 'Bomba de 15 bares', 'Compatible únicamente con cápsulas Luvoco', 'Garantía de 12 meses'],
    benefits: ['15 bares de presión', 'Diseñada para las tres cápsulas Luvoco', 'Garantía de 12 meses'],
    perfilIdeal: 'Quien quiere el espresso en casa y ya sabe qué café le gusta',
    momentoConsumo: 'Cada vez que quiera un espresso',
    ritual: ['Empiece por el Medio: el balance entre la suavidad y la intensidad', 'Cada cápsula es de un solo uso', 'Las cápsulas Luvoco son para esta máquina, y la máquina, para ellas'],
    combinacionSugerida: ['luvoco-suave', 'luvoco-medio', 'luvoco-fuerte'],
    sistemaRecomendado: 'experiencia-premium',
    downloadUrl: '/catalogo/docs/maquina-de-luvoco-digital-gano-excel.pdf',
  },
  'luvoco-suave': {
    name: 'Luvoco Suave · 15 cápsulas',
    price: 110900,
    image: '/productos/luvoco/luvoco-suave-gano-excel-min.png',
    invima: 'NSA-0012966-2022',
    presentacion: 'Caja de 15 cápsulas de 8 g',
    categoria: 'Alimento',
    llevaGanoderma: true,
    goals: ['Tueste claro', 'Acidez viva'],
    shortDescription: 'El espresso para quien lo quiere sin que le pese, y el que se ofrece cuando llega visita. Grano Arábica y Robusta, de tueste claro.',
    taglineEstrategico: 'Suave y ligera, sin perder el aroma',
    usage: 'Una cápsula por espresso, en la máquina Luvoco.',
    ingredients: ['Café Arábica y Robusta molido y tostado (tueste claro, 180 a 205 °C)', 'Betaglucanos de Ganoderma lucidum'],
    benefits: ['Ligero al paladar, sin perder aroma ni sabor', 'Acidez viva y aroma limpio', 'De los tres, el de mayor cafeína'],
    perfilIdeal: 'Quien toma el café sin que le pese, y quien lo prefiere más cargado de cafeína',
    momentoConsumo: 'La mañana',
    ritual: ['Con un poco de leche espumada queda un cortado', 'Para un jaibol: 60 ml de sirope de frutos rojos, el espresso, hielo y crema chantilly'],
    combinacionSugerida: ['luvoco-medio', 'ganorico-latte-rico'],
    sistemaRecomendado: 'experiencia-premium',
  },
  'luvoco-medio': {
    name: 'Luvoco Medio · 15 cápsulas',
    price: 110900,
    image: '/productos/luvoco/luvoco-medio-gano-excel-min.png',
    invima: 'NSA-0012956-2022',
    presentacion: 'Caja de 15 cápsulas de 8 g',
    categoria: 'Alimento',
    llevaGanoderma: true,
    goals: ['Equilibrado', 'El del diario'],
    shortDescription: 'Tueste medio de Arábica y Robusta: un sabor pronunciado sin ser abrumador, con aroma y acidez en equilibrio. El espresso de todo el día.',
    taglineEstrategico: 'Ni tan ligero que se pierda, ni tan intenso que canse',
    usage: 'Una cápsula por espresso, en la máquina Luvoco.',
    ingredients: ['Café Arábica y Robusta molido y tostado (tueste medio, 210 a 220 °C)', 'Betaglucanos de Ganoderma lucidum'],
    benefits: ['El balance entre la suavidad y la intensidad', 'Menos cafeína que el tueste claro', 'Solo o con un chorrito de leche'],
    perfilIdeal: 'Quien toma varios espressos al día y quiere uno que no canse',
    momentoConsumo: 'Todo el día',
    ritual: ['El del diario: mañana y después del almuerzo', 'Para un shakerato: el espresso sobre hielo, con 22 ml de sirope de azúcar morena', 'Si el Suave le resulta ácido, este es el suyo'],
    combinacionSugerida: ['luvoco-fuerte', 'capsulas-excellium'],
    sistemaRecomendado: 'experiencia-premium',
  },
  'luvoco-fuerte': {
    name: 'Luvoco Fuerte · 15 cápsulas',
    price: 110900,
    image: '/productos/luvoco/luvoco-fuerte-gano-excel-min.png',
    invima: 'NSA-0012958-2022',
    presentacion: 'Caja de 15 cápsulas de 8 g',
    categoria: 'Alimento',
    llevaGanoderma: true,
    goals: ['Tueste alto', 'Menos cafeína'],
    shortDescription: 'El espresso de después del almuerzo, para quien lleva años tomando café. Grano Arábica y Robusta, de tueste oscuro.',
    taglineEstrategico: 'Rico e intenso, para quien ya sabe lo que quiere',
    usage: 'Una cápsula por espresso, en la máquina Luvoco.',
    ingredients: ['Café Arábica y Robusta molido y tostado (tueste alto, 240 a 250 °C)', 'Betaglucanos de Ganoderma lucidum'],
    benefits: ['Cuerpo denso y amargo redondo', 'Notas ahumadas del tueste oscuro', 'De los tres, el de menor cafeína'],
    perfilIdeal: 'Quien busca el espresso intenso, y quien quiere menos cafeína sin renunciar al cuerpo',
    momentoConsumo: 'La mañana exigente, y después del almuerzo',
    ritual: ['Corto y sin azúcar es como mejor se aprecia', 'Para un capuchino: el espresso con tres onzas de leche caliente', 'Para un latte frío: hielo, 22 ml de sirope de azúcar morena y leche deslactosada'],
    combinacionSugerida: ['capsulas-cordygold', 'ganocafe-clasico'],
    sistemaRecomendado: 'experiencia-premium',
  },
}

// ─── La vitrina ──────────────────────────────────────────────────────────────

/**
 * Las cuatro líneas, en el orden en que la gente compra: el café primero (el
 * 3 en 1 es el más pedido), Luvoco, las cápsulas y el cuidado personal. El
 * colágeno y el cereal van con las bebidas porque se toman en taza o en vaso.
 */
// ─── Las promociones de Gano (22 oct 2026) ───────────────────────────────────
// Entran desde su registro (src/lib/promociones-gano.ts) como un producto más,
// con la ficha propia: qué trae en vez de cómo se prepara. La página solo las
// muestra mientras Gano las tenga en su catálogo (/api/promociones-gano).
for (const pr of PROMOCIONES_GANO) {
  const porSeparado = pr.contenido.reduce((s, c) => s + (productData[c.slug]?.price ?? 0) * c.cantidad, 0)
  productData[pr.slug] = {
    name: pr.nombre,
    price: pr.precioCOP,
    image: pr.imagen,
    invima: '',
    presentacion: `${unidadesDe(pr)} productos`,
    categoria: 'Promoción',
    llevaGanoderma: false,
    goals: [],
    shortDescription: `La promoción de Gano Excel: ${unidadesDe(pr)} productos en un solo pedido. Comprados por separado suman ${pesos(porSeparado)}.`,
    taglineEstrategico: 'Promoción de Gano Excel',
    usage: '',
    ingredients: [],
    benefits: [],
    perfilIdeal: '',
    momentoConsumo: '',
    ritual: [],
    promocion: { inventoryId: pr.inventoryId, contenido: pr.contenido.map((c) => ({ id: c.slug, cantidad: c.cantidad })), limite: pr.limitePorPedido },
  }
}

export const LINEAS: { id: string; nombre: string; ids: string[] }[] = [
  { id: 'promocion', nombre: 'Promoción', ids: PROMOCIONES_GANO.map((p) => p.slug) },
  {
    id: 'cafe',
    nombre: 'Café y bebidas',
    ids: ['ganocafe-3-en-1', 'ganocafe-clasico', 'ganorico-latte-rico', 'ganorico-mocha-rico', 'ganorico-shoko-rico', 'gano-schokoladde', 'bebida-oleaf-gano-rooibos', 'espirulina-gano-creal', 'bebida-colageno-reskine'],
  },
  {
    id: 'luvoco',
    nombre: 'Café Luvoco',
    ids: ['luvoco-suave', 'luvoco-medio', 'luvoco-fuerte', 'maquina-luvoco'],
  },
  {
    id: 'capsulas',
    nombre: 'Cápsulas',
    ids: ['capsulas-ganoderma', 'capsulas-excellium', 'capsulas-cordygold'],
  },
  {
    id: 'cuidado',
    nombre: 'Cuidado personal',
    ids: ['pasta-dientes-gano-fresh', 'jabon-gano', 'jabon-transparente-gano', 'champu-piel-brillo', 'acondicionador-piel-brillo', 'exfoliante-piel-brillo'],
  },
]

/**
 * La foto de la vitrina: el recorte limpio, sin hongos ni frutas alrededor
 * (public/productos/_set/limpios, scripts/recortar-fondo-birefnet.py). En una
 * cuadrícula, las decoraciones de cada foto del fabricante competían entre sí y
 * el producto se veía pequeño. La máquina no tiene recorte: va la de catálogo.
 */
export function imagenVitrina(id: string): string {
  if (id === 'maquina-luvoco') return '/productos/luvoco/luvoco55-1-1024x1024.png'
  if (productData[id]?.promocion) return productData[id].image
  return `/productos/_set/limpios/${id}.png`
}

/** El más pedido de la línea (dato del back office, en su ficha desde el 9 sep 2026). */
export const MAS_PEDIDO = 'ganocafe-3-en-1'

/** Pesos con punto de miles, sin depender del idioma del navegador: «$110.900». */
export function pesos(n: number): string {
  return '$' + Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

// ─── El pedido que viaja a WhatsApp ──────────────────────────────────────────

export interface LineaCarrito { id: string; cantidad: number }

/**
 * El mensaje que la persona ve escrito al abrir WhatsApp. Lo lee ella antes de
 * tocar Enviar, así que empieza por lo que quiere y no por un código.
 *
 * Tres contratos con el webhook (src/lib/wa-pedido.ts), probados en
 * scripts/prueba-pedido-catalogo.mts:
 * - «quiero pedir» abre el nodo 2.45 (`detectarIntencionCompra`).
 * - Las cantidades van con «x» ASCII: `cantidadJunto` no lee «×».
 * - Nunca dice «catálogo»: con esa palabra el nodo 2.24 contesta con el enlace.
 * La referencia del socio va al final y legible (el slug); el webhook la
 * encuentra en cualquier posición (`resolverPatrocinador`).
 */
/**
 * `visitante` (18 oct 2026): la cookie del navegador (`ck_…`) va al final como
 * ` c:…`, igual que en el enlace de Queswa ([slug]/[destino]/page.tsx). El webhook
 * la retira antes de leer el pedido (limpiarCookieWeb) y la ata a la ficha de
 * WhatsApp; así el Centro de Mando sabe que ese navegador sí envió, y avisa al
 * socio cuando alguien tocó «Enviar pedido por WhatsApp» y no lo envió.
 */
export function mensajePedido(
  lineas: LineaCarrito[],
  socio: { nombre: string; slug?: string | null; constructorId?: string | null } | null,
  visitante?: string | null,
): string {
  // La promoción lleva su código: así la reconoce el canal (alias «80094» en wa-productos).
  const filas = lineas.filter((l) => productData[l.id]).map((l) => {
    const p = productData[l.id]
    return `${l.cantidad} x ${p.name}${p.promocion ? ` (código ${p.promocion.inventoryId})` : ''}`
  }).join('\n')
  const ref = socio?.slug || socio?.constructorId
  const atiende = socio ? `\n\nMe atiende ${socio.nombre}${ref ? ` (${ref})` : ''}.` : ''
  const codigo = visitante && /^ck_[a-z0-9]{6,12}$/.test(visitante) ? ` c:${visitante.slice(3)}` : ''
  return `Hola, quiero pedir:\n\n${filas}${atiende}${codigo}`
}

// ─── Preguntas (BORRADOR — pendiente del Director) ───────────────────────────
// Las lee la página y el JSON-LD del layout (Google exige que coincidan con lo
// visible). Reemplazan el FAQ que traía «hongo medicinal», «fortalece el sistema
// inmunológico», «reduce el estrés», «35% de descuento», «Solo 150 cupos» y un
// envío gratis que no existe. Solo hechos: qué es, cómo se prepara, cuánto vale,
// cómo llega.

export const PREGUNTAS: { p: string; r: string }[] = [
  {
    p: '¿Qué es el Gano Café?',
    r: 'Es el café de Gano Excel con extracto de Ganoderma lucidum, el hongo también conocido como Reishi. Hay dos: el 3 en 1, que ya trae crema y azúcar, y el Clásico, que es café negro sin azúcar. Los dos se disuelven por completo en el agua.',
  },
  {
    p: '¿Cuánto cuesta el Gano Café en Colombia?',
    r: 'El Ganocafé 3 en 1 (caja de 20 sobres) y el Ganocafé Clásico (caja de 30 sobres) cuestan $110.900 cada uno. Todos los precios de este catálogo están en pesos colombianos.',
  },
  {
    p: '¿Cómo se prepara el Gano Café 3 en 1?',
    r: 'Un sobre en 150 ml de agua caliente; se revuelve y listo. Si lo prefiere más suave, use 180 ml de agua. También se puede tomar frío, preparado y servido con hielo.',
  },
  {
    p: '¿Cómo pago y cómo me llega el pedido?',
    r: 'Arme su pedido aquí y elija cómo pagar. Puede pagar directo a Gano Excel, por PSE desde su banco o en efectivo, y Gano Excel lo despacha a su dirección por Servientrega, normalmente de un día para otro; o lo recoge sin costo de envío en una oficina de Gano Excel, usted o la persona que autorice con su documento. O puede pagar con su distribuidor: le escribe por WhatsApp y acuerdan el pago y la entrega, en persona si están en la misma ciudad.',
  },
  {
    p: '¿Quién fabrica estos productos?',
    r: 'Gano Excel, una empresa con 30 años y presencia en más de 60 países, que los fabrica y los despacha. Quien le atiende es un distribuidor independiente.',
  },
]
