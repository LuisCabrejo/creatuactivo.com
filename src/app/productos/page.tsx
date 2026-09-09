/**
 * Copyright © 2026 CreaTuActivo.com
 * Todos los derechos reservados.
 *
 * CATÁLOGO BIO-INTELIGENTE - Clinical Luxury Edition v1.0
 * Estética: Pharma-Teal + Bio-Emerald (Lab/Clinical spectrum)
 * Geometría: Hard Surface (ZERO border-radius)
 *
 * Color Transition: Amber (construcción) → Emerald (quirófano/biolab)
 * Justificación científica: Ver "Estética Clinical Luxury para E-commerce Oscuro.md"
 *
 * Para consultas de licenciamiento: legal@creatuactivo.com
 */

'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { ShoppingCart, X, Heart, Sparkles, Waves, Trophy, Send, Bot, Star, Zap, TrendingUp, Gift, Download, Coffee, Pill, Target, MessageCircle, Shield, Brain, Users, Rocket } from 'lucide-react'
import StrategicNavigation from '@/components/StrategicNavigation'
import { IndustrialHeader } from '@/components/IndustrialHeader'
import Link from 'next/link'

// ═══════════════════════════════════════════════════════════════════════════
// CLINICAL LUXURY - Bio-Lab Spectrum (sub-marca del vertical e-commerce de salud)
// ═══════════════════════════════════════════════════════════════════════════
// Fondos + textos heredan del sistema Lujo Silencioso (coherencia ecosistema).
// Los acentos cromáticos (emerald + teal + whatsapp) se preservan: son
// decisión arquitectónica del vertical Clinical, no del funnel financiero.
const C = {
  bioEmerald: '#50C878',                          // Acento Clinical (verde lab)
  pharmaTeal: '#0F2E2F',                          // Fondo card Clinical
  whatsappLux: '#25D366',                         // CTA WhatsApp
  obsidian: 'var(--color-bg-primary)',            // #0F1115 — del sistema
  gunmetal: 'var(--color-bg-elevated)',           // #15171C — del sistema
  textMain: 'var(--color-text-body)',             // #C8C7C2
  textMuted: 'var(--color-text-muted)',           // #878681
  textDim: 'rgba(255,255,255,0.4)',
}

// Interfaces mejoradas con campos estratégicos
// Los 22 productos, reescritos el 9 sep 2026 con el Director: composición
// verificada contra ganoexcel.com.co (nunca contra el sitio de EE. UU., que
// formula distinto), nombres y precios del back office, y la voz de las fichas
// del catálogo de Queswa. `presentacion` y `categoria` (la del fabricante) se
// muestran; `llevaGanoderma` condiciona el bloque del extracto en la ficha;
// `ritual` reemplaza a los puntos de conversación del socio, que se le
// mostraban al prospecto.
interface Product {
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
}

interface ProductData {
  [key: string]: Product
}

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
}

interface DistributorProfile {
  nombre: string
  whatsapp: string
  email: string
  ciudad: string
  pais: string
}

interface SistemaBienestar {
  nombre: string
  descripcion: string
  productos: string[]
  icono: JSX.Element
  color: string
}

// Sistemas de Bienestar Estratégicos
const sistemasDebienestar: { [key: string]: SistemaBienestar } = {
  'energia-enfoque': {
    nombre: 'Para Tener Más Energía',
    descripcion: 'Empiece el día con energía y manténgase activo sin el bajón del café normal',
    productos: ['ganocafe-3-en-1', 'ganocafe-clasico', 'capsulas-excellium'],
    icono: <Zap className="h-6 w-6" />,
    color: 'from-yellow-500 to-orange-500'
  },
  'familiar-nutricion': {
    nombre: 'Para Toda la Familia',
    descripcion: 'Bebidas y productos que cuidan a grandes y chicos por igual',
    productos: ['ganorico-shoko-rico', 'espirulina-gano-creal', 'pasta-dientes-gano-fresh', 'ganorico-latte-rico'],
    icono: <Users className="h-6 w-6" />,
    color: 'from-green-500 to-emerald-500'
  },
  'rendimiento-avanzado': {
    nombre: 'Para Mantenerse Activo',
    descripcion: 'Ideal si camina, hace ejercicio o simplemente desea sentirse con más vitalidad',
    productos: ['capsulas-cordygold', 'capsulas-ganoderma', 'espirulina-gano-creal'],
    icono: <Target className="h-6 w-6" />,
    color: 'from-red-500 to-pink-500'
  },
  'belleza-holistica': {
    nombre: 'Para Su Piel y Belleza',
    descripcion: 'Cuide su piel desde adentro con colágeno, y por fuera con jabones naturales',
    productos: ['bebida-colageno-reskine', 'jabon-gano', 'jabon-transparente-gano', 'exfoliante-piel-brillo'],
    icono: <Sparkles className="h-6 w-6" />,
    color: 'from-purple-500 to-pink-500'
  },
  'experiencia-premium': {
    nombre: 'Experiencia Barista Premium Luvoco',
    descripcion: 'La élite del café con nuestra tecnología de extracción propia de 15 bares',
    productos: ['maquina-luvoco', 'luvoco-suave', 'luvoco-medio', 'luvoco-fuerte'],
    icono: <Coffee className="h-6 w-6" />,
    color: 'from-slate-700 to-slate-900'
  }
}

// Datos de productos completos con campos estratégicos
const productData: ProductData = {
  'ganocafe-3-en-1': {
    name: 'Ganocafé 3 en 1',
    price: 110900,
    image: '/productos/bebidas/ganocafe-3-en-1-gano-excel-min.png',
    invima: 'SD2012-0002589',
    presentacion: 'Caja de 20 sobres',
    categoria: 'Alimento',
    llevaGanoderma: true,
    goals: ['Energía', 'Ritual de mañana'],
    shortDescription: 'Café premium con crema y azúcar, los tres en un sobre, con el extracto de Ganoderma adentro.',
    taglineEstrategico: 'El café de la mañana, con algo más adentro',
    usage: 'Un sobre en 150 ml de agua caliente. Revuelva y listo.',
    ingredients: ['Café instantáneo', 'Crema no láctea', 'Azúcar', 'Betaglucanos de Ganoderma lucidum', 'Contiene derivados de la leche'],
    benefits: ['Café premium con crema y azúcar en un solo sobre', 'Energía estable, sin nerviosismo y sin el bajón de media mañana', 'Sabor suave y aroma intenso', 'Uno cada mañana: la caja alcanza para veinte', 'El producto más vendido de la línea'],
    perfilIdeal: 'Quien ya toma café todas las mañanas y quiere que ese café haga algo más',
    momentoConsumo: 'A primera hora, como su café de siempre',
    ritual: ['Prepárelo como el café de siempre: un sobre, agua caliente, y a la mesa', 'Si lo prefiere más suave, use 180 ml de agua', 'Va bien acompañado de una cápsula con el almuerzo'],
    combinacionSugerida: ['capsulas-excellium', 'pasta-dientes-gano-fresh'],
    sistemaRecomendado: 'energia-enfoque',
  },
  'ganocafe-clasico': {
    name: 'Ganocafé Clásico',
    price: 110900,
    image: '/productos/bebidas/gano-cafe-clasico-gano-excel-min.png',
    invima: 'SD2013-0002947',
    presentacion: 'Caja de 30 sobres',
    categoria: 'Suplemento dietario',
    llevaGanoderma: true,
    goals: ['Energía', 'Sin azúcar'],
    shortDescription: 'Café negro soluble, sin crema y sin azúcar, con el extracto de Ganoderma adentro.',
    taglineEstrategico: 'Para quien toma el tinto negro y no lo negocia',
    usage: 'Un sobre de 4,5 g en 150 ml de agua caliente.',
    ingredients: ['Café instantáneo', 'Extracto de Ganoderma lucidum'],
    benefits: ['Café negro puro: sin crema y sin azúcar', 'Cuerpo, aroma y el amargo justo de una buena cafetería', 'Energía estable, sin nerviosismo y sin el bajón de media mañana', 'Treinta sobres: un mes completo', 'Sin azúcar añadida'],
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
    invima: 'NSA-0012966-2022',
    presentacion: 'Caja de 20 sobres',
    categoria: 'Alimento',
    llevaGanoderma: true,
    goals: ['Cremoso', 'Pausa'],
    shortDescription: 'El café de la pausa: cremoso y con espuma, armado en la taza con agua caliente.',
    taglineEstrategico: 'La textura de cafetería, en su cocina',
    usage: 'Un sobre de 25 g en 180 ml de agua caliente. Revuelva hasta que espume.',
    ingredients: ['Crema de café no láctea', 'Café instantáneo', 'Grasa vegetal', 'Leche en polvo y leche desnatada en polvo', 'Betaglucanos de Ganoderma lucidum', 'Contiene derivados de la leche'],
    benefits: ['Cremoso y con espuma, como un latte de cafetería', 'Sabor redondo que no empalaga', 'Se prepara solo con agua caliente', 'Veinte sobres, veinte pausas', 'Con el extracto de Ganoderma de toda la línea'],
    perfilIdeal: 'Quien prefiere el café suave y cremoso al café negro',
    momentoConsumo: 'Media mañana o media tarde',
    ritual: ['Revuelva fuerte al final: ahí sale la espuma', 'Para un latte helado, prepárelo con la mitad del agua y complete con hielo', 'Combina con el Mocha Rico para alternar según el día'],
    combinacionSugerida: ['ganorico-mocha-rico', 'bebida-colageno-reskine'],
    sistemaRecomendado: 'familiar-nutricion',
  },
  'ganorico-mocha-rico': {
    name: 'Ganorico Mocha Rico',
    price: 119900,
    image: '/productos/bebidas/mocha-rico-gano-excel-min.png',
    invima: 'NSA-0012965-2022',
    presentacion: 'Caja de 20 sobres',
    categoria: 'Alimento',
    llevaGanoderma: true,
    goals: ['Café y chocolate', 'Tarde'],
    shortDescription: 'Café y chocolate en el mismo sobre, para la hora de la tarde en que uno quiere algo dulce.',
    taglineEstrategico: 'El cacao le quita el filo al café; el café le quita el empalago al chocolate',
    usage: 'Un sobre de 25 g en 180 ml de agua caliente.',
    ingredients: ['Crema de moca no láctea', 'Café instantáneo', 'Cacao en polvo', 'Crema espumosa', 'Leche desnatada en polvo', 'Sabor natural a vainilla', 'Extracto de malta de cebada', 'Betaglucanos de Ganoderma lucidum', 'Contiene derivados de la leche', 'Contiene gluten (malta de cebada)'],
    benefits: ['Café y chocolate equilibrados en una sola taza', 'Un toque de vainilla al final', 'Espuma ligera al revolver', 'Veinte sobres por caja', 'Con el extracto de Ganoderma de toda la línea'],
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
    invima: 'NSA-0012964-2022',
    presentacion: 'Caja de 20 sobres',
    categoria: 'Alimento',
    llevaGanoderma: true,
    goals: ['Familia', 'Sin café'],
    shortDescription: 'El chocolate caliente de la casa: el que se prepara en la noche y el que piden los niños.',
    taglineEstrategico: 'No lleva café, así que no altera a nadie',
    usage: 'Un sobre de 25 g en 180 ml de agua o de leche caliente.',
    ingredients: ['Chocolate en polvo', 'Extracto de Ganoderma lucidum'],
    benefits: ['Chocolate caliente, sin café', 'Se prepara en agua o en leche, según la casa', 'Para toda la familia', 'Veinte sobres por caja', 'Con el extracto de Ganoderma de toda la línea'],
    perfilIdeal: 'Familias con niños, y quien no toma café',
    momentoConsumo: 'La noche, o la tarde fría',
    ritual: ['En leche queda más espeso; en agua, más ligero', 'Es la bebida de los niños de la casa en la noche', 'El Schokolade es su versión para adultos: más cacao, menos dulce'],
    combinacionSugerida: ['espirulina-gano-creal', 'pasta-dientes-gano-fresh'],
    sistemaRecomendado: 'familiar-nutricion',
  },
  'espirulina-gano-creal': {
    name: 'Gano C\'Real Spirulina',
    price: 119900,
    image: '/productos/bebidas/ganocereal-spirulina-min.png',
    invima: 'NSA-0012963-2022',
    presentacion: 'Caja de 15 sobres',
    categoria: 'Suplemento dietario',
    llevaGanoderma: true,
    goals: ['Desayuno', 'Sin café'],
    shortDescription: 'Un cereal instantáneo con espirulina y extracto de Ganoderma: el desayuno que se prepara en un minuto.',
    taglineEstrategico: 'El desayuno de quien sale temprano',
    usage: 'Un sobre en 180 ml de agua o leche caliente. Revuelva y listo.',
    ingredients: ['Cereal', 'Espirulina', 'Extracto de Ganoderma lucidum', 'Crema no láctea', 'Contiene derivados de la leche'],
    benefits: ['Desayuno instantáneo, listo en un minuto', 'Con espirulina, el alga rica en proteína, hierro y vitamina B12', 'Sabor suave, entre cereal y bebida caliente', 'Quince sobres por caja', 'Con el extracto de Ganoderma de toda la línea'],
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
    invima: 'NSA-0012962-2022',
    presentacion: 'Caja de 20 sobres',
    categoria: 'Suplemento dietario',
    llevaGanoderma: true,
    goals: ['Sin cafeína', 'Noche'],
    shortDescription: 'La única infusión de la línea: rooibos de Sudáfrica con el extracto de Ganoderma, sin cafeína.',
    taglineEstrategico: 'La taza de la noche, la que no quita el sueño',
    usage: 'Un sobre en 180 ml de agua caliente. Deje reposar tres minutos.',
    ingredients: ['Rooibos de Sudáfrica', 'Extracto de Ganoderma lucidum'],
    benefits: ['Sin cafeína: el rooibos es una planta que no la tiene', 'Con los antioxidantes propios del rooibos', 'Sabor suave y ligeramente dulce', 'Se toma caliente o frío', 'Veinte sobres por caja', 'La opción de la línea para quien no toma café'],
    perfilIdeal: 'Quien no toma café, o quiere una taza caliente al final del día',
    momentoConsumo: 'La tarde y la noche',
    ritual: ['Frío con hielo y una rodaja de limón es otra bebida', 'Es el que se toma después de la comida', 'Combina con las Cápsulas de Ganoderma para quien no toma café'],
    combinacionSugerida: ['capsulas-ganoderma', 'jabon-gano'],
    sistemaRecomendado: 'belleza-holistica',
  },
  'gano-schokoladde': {
    name: 'Gano Schokolade',
    price: 124900,
    image: '/productos/bebidas/gano-schokolade-gano-excel-min.png',
    invima: 'NSA-0012961-2022',
    presentacion: 'Caja de 20 sobres',
    categoria: 'Suplemento dietario',
    llevaGanoderma: true,
    goals: ['Cacao intenso', 'Adultos'],
    shortDescription: 'El chocolate del adulto: cacao intenso, del que se toma despacio, con el extracto de Ganoderma adentro.',
    taglineEstrategico: 'Más profundo y menos dulce que el Shoko Rico',
    usage: 'Un sobre en 180 ml de agua caliente.',
    ingredients: ['Cacao', 'Azúcar refinada', 'Crema no láctea', 'Leche descremada en polvo', 'Extracto de Ganoderma lucidum', 'Contiene derivados de la leche'],
    benefits: ['Cacao intenso, menos dulce', 'El chocolate que uno se toma solo, al final del día', 'Se prepara solo con agua caliente', 'Veinte sobres por caja', 'Con el extracto de Ganoderma de toda la línea'],
    perfilIdeal: 'Conocedores del chocolate que lo prefieren intenso',
    momentoConsumo: 'El final del día',
    ritual: ['Tómelo despacio: está hecho para eso', 'En leche caliente queda más cremoso', 'Para los niños, el Shoko Rico; este es el de los adultos'],
    combinacionSugerida: ['luvoco', 'bebida-colageno-reskine'],
    sistemaRecomendado: 'experiencia-premium',
  },
  'bebida-colageno-reskine': {
    name: 'Reskine Colágeno',
    price: 216900,
    image: '/productos/bebidas/gano-plus-reskine-collagen-drink-gano-excel-min.png',
    invima: 'NSA-0012959-2022',
    presentacion: 'Caja de 10 sachets',
    categoria: 'Alimento',
    llevaGanoderma: true,
    goals: ['Colágeno', 'Frutos rojos'],
    shortDescription: 'Colágeno de pescado en una bebida de frutos rojos, con los betaglucanos del Ganoderma.',
    taglineEstrategico: 'La única forma de tomar colágeno en la que uno espera el momento',
    usage: 'Un sachet en 200 ml de agua fría. Agite y listo.',
    ingredients: ['Colágeno de pescado', 'Betaglucanos de Ganoderma lucidum', 'Quinua líquida', 'Concentrado de jugo de manzana', 'Extracto de goji', 'Jugo de aloe vera', 'Espinaca en polvo', 'Sabor a fresa, frambuesa y arándano', 'Contiene pescado'],
    benefits: ['Colágeno que se toma con ganas: sabe a frutos rojos', 'No es un polvo sin sabor que toca pasar rápido', 'Con quinua, manzana, goji, aloe y espinaca', 'Diez sachets por caja', 'Con los betaglucanos del Ganoderma de toda la línea'],
    perfilIdeal: 'Quien quiere tomar colágeno y no le gusta el que se vende sin sabor',
    momentoConsumo: 'La mañana, o después de entrenar',
    ritual: ['Bien frío es donde mejor sabe', 'Un sachet al día; la caja rinde diez días', 'Va bien con el jabón transparente en la rutina de la cara'],
    combinacionSugerida: ['bebida-colageno-reskine', 'exfoliante-piel-brillo'],
    sistemaRecomendado: 'belleza-holistica',
  },
  'capsulas-ganoderma': {
    name: 'Cápsulas de Ganoderma',
    price: 272500,
    image: '/productos/suplementos/capsulas-de-ganoderma-gano-excel-min.png',
    invima: 'SD2013-0002860',
    presentacion: 'Frasco de 90 cápsulas',
    categoria: 'Suplemento dietario',
    llevaGanoderma: true,
    goals: ['Extracto puro', 'Tres meses'],
    shortDescription: 'El extracto de Ganoderma en su forma más directa: 275 mg por cápsula, sin café de por medio.',
    taglineEstrategico: 'El mismo hongo de toda la línea, en su forma más directa',
    usage: 'Una cápsula al día, con agua, preferiblemente con una comida.',
    ingredients: ['Extracto de Ganoderma lucidum, 275 mg por cápsula', 'Cápsula'],
    benefits: ['275 mg de extracto de Ganoderma por cápsula', 'Una al día: el frasco rinde tres meses', 'Apoya el funcionamiento normal de las defensas, como parte de la rutina', 'Para quien ya toma el café y quiere sumar algo más', 'El extracto que lleva toda la línea, sin nada más'],
    perfilIdeal: 'Quien quiere el Ganoderma solo, sin café ni bebida',
    momentoConsumo: 'Con el almuerzo',
    ritual: ['Una cápsula con una comida, a la misma hora cada día', 'Combina con el café de la mañana o con el Rooibos de la noche', 'El frasco dura tres meses: es la compra que menos se repite'],
    combinacionSugerida: ['capsulas-excellium', 'capsulas-cordygold'],
    sistemaRecomendado: 'rendimiento-avanzado',
  },
  'capsulas-excellium': {
    name: 'Cápsulas Excellium',
    price: 272500,
    image: '/productos/suplementos/capsulas-de-excellium-gano-excel-min.png',
    invima: 'NSA-0012958-2022',
    presentacion: 'Frasco de 90 cápsulas',
    categoria: 'Suplemento dietario',
    llevaGanoderma: true,
    goals: ['Enfoque', 'Tres meses'],
    shortDescription: 'Cápsulas con 275 mg de extracto de Ganoderma, las que suele buscar quien tiene el día lleno de decisiones.',
    taglineEstrategico: 'Para llegar despierto a la tarde',
    usage: 'Una cápsula al día, con agua, con el desayuno o el almuerzo.',
    ingredients: ['Extracto de Ganoderma lucidum, 275 mg por cápsula', 'Cápsula'],
    benefits: ['275 mg de extracto de Ganoderma por cápsula', 'Una al día: el frasco rinde tres meses', 'Enfoque y claridad mental para el día largo', 'Va bien acompañada del café de la mañana', 'Con el extracto de Ganoderma de toda la línea'],
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
    invima: 'NSA-0012957-2022',
    presentacion: 'Frasco de 90 cápsulas',
    categoria: 'Suplemento dietario',
    llevaGanoderma: false,
    goals: ['Cordyceps', 'Rendimiento'],
    shortDescription: 'El único de la línea que no gira alrededor del Ganoderma: Cordyceps sinensis, 500 mg por cápsula.',
    taglineEstrategico: 'La concentración más alta de todo el portafolio',
    usage: 'Una cápsula al día, con agua, preferiblemente en la mañana.',
    ingredients: ['Extracto de Cordyceps sinensis, 500 mg por cápsula', 'Cápsula'],
    benefits: ['500 mg de Cordyceps sinensis por cápsula', 'El hongo que se asocia con el aguante y el rendimiento físico', 'Una al día: el frasco rinde tres meses', 'Para quien entrena o tiene jornadas largas de pie', 'Distinto al Ganoderma: es sumar otra cosa, no más de lo mismo'],
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
    shortDescription: 'Pasta dental con extracto de Ganoderma y menta, sin flúor: la que buscan las familias que revisan etiquetas.',
    taglineEstrategico: 'Hasta en el cepillo de dientes',
    usage: 'Cepillado normal, dos o tres veces al día.',
    ingredients: ['Sorbitol', 'Agua', 'Menta', 'Extracto de Ganoderma lucidum'],
    benefits: ['Sin flúor', 'Frescura de menta que dura', 'Con el extracto de Ganoderma de toda la línea', 'Para toda la familia', 'Tubo de 150 g'],
    perfilIdeal: 'Familias que prefieren una pasta sin flúor',
    momentoConsumo: 'Mañana y noche',
    ritual: ['La misma rutina de siempre, con otro producto en la mano', 'Combina con el Jabón Gano en el baño', 'Un tubo dura alrededor de un mes en una familia'],
    combinacionSugerida: ['jabon-gano', 'ganocafe-3-en-1'],
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
    shortDescription: 'Jabón con leche de cabra y extracto de Ganoderma: la piel queda suave, no tirante.',
    taglineEstrategico: 'Limpia sin castigar',
    usage: 'Uso diario, en cuerpo y manos. Enjuague con agua tibia.',
    ingredients: ['Leche de cabra', 'Extracto de Ganoderma lucidum', 'Base de jabón'],
    benefits: ['Con leche de cabra', 'La piel queda suave en vez de tirante', 'El que suele preferir quien tiene la piel delicada', 'Para toda la familia', 'Dos barras de 100 g'],
    perfilIdeal: 'Quien tiene la piel delicada y busca un jabón que no reseque',
    momentoConsumo: 'La ducha diaria',
    ritual: ['Es el jabón de cuerpo; el Transparente es el de la cara', 'Guárdelo seco entre usos para que rinda más', 'Combina con el exfoliante dos veces por semana'],
    combinacionSugerida: ['jabon-transparente-gano', 'exfoliante-piel-brillo'],
    sistemaRecomendado: 'belleza-holistica',
  },
  'jabon-transparente-gano': {
    name: 'Jabón Transparente Gano',
    price: 78500,
    image: '/productos/cuidado-personal/jabon-transparent-soap-gano-excel-min.png',
    invima: 'NSO09915-21CO',
    presentacion: 'Barra de 100 g',
    categoria: 'Cosmético',
    llevaGanoderma: true,
    goals: ['Rostro', 'Papaya y aloe'],
    shortDescription: 'El jabón de la cara: papaya y aloe vera con el extracto de Ganoderma, para limpiar sin sentir la piel áspera.',
    taglineEstrategico: 'El del final del día',
    usage: 'Sobre el rostro húmedo, con movimientos suaves. Enjuague con agua tibia.',
    ingredients: ['Agua', 'Extracto de papaya', 'Extracto de hoja de aloe vera', 'Extracto de Ganoderma lucidum'],
    benefits: ['Para el rostro', 'Con papaya y aloe vera', 'Limpia el maquillaje y el polvo de la calle sin dejar la piel áspera', 'Barra transparente de 100 g', 'Con el extracto de Ganoderma de toda la línea'],
    perfilIdeal: 'Quien quiere un jabón suave para la cara, mañana y noche',
    momentoConsumo: 'Mañana y noche',
    ritual: ['Con agua tibia, nunca caliente', 'Después, el Reskine por dentro completa la rutina de la piel', 'El Jabón Gano es el del cuerpo; este, el de la cara'],
    combinacionSugerida: ['exfoliante-piel-brillo', 'bebida-colageno-reskine'],
    sistemaRecomendado: 'belleza-holistica',
  },
  'champu-piel-brillo': {
    name: 'Champú Piel&Brillo',
    price: 73900,
    image: '/productos/cuidado-personal/shampoo-p&b-gano-excel-min.png',
    invima: 'NSOC96485-19CO',
    presentacion: 'Frasco de 250 ml',
    categoria: 'Cosmético',
    llevaGanoderma: true,
    goals: ['Cabello', 'Brillo'],
    shortDescription: 'Champú con aloe y extracto de Ganoderma para el cabello que perdió el brillo.',
    taglineEstrategico: 'El champú limpia; el acondicionador cierra',
    usage: 'Sobre el cabello mojado, masajee y enjuague. Siga con el acondicionador.',
    ingredients: ['Agua', 'Extracto de hoja de aloe', 'Extracto de Ganoderma lucidum'],
    benefits: ['Limpia suave, sin dejar el cabello áspero', 'Con aloe', 'Pensado para usarse con el acondicionador de la línea', 'Frasco de 250 ml', 'Con el extracto de Ganoderma de toda la línea'],
    perfilIdeal: 'Quien tiene el cabello opaco y quiere que vuelva a brillar',
    momentoConsumo: 'La ducha',
    ritual: ['Champú y acondicionador juntos: ahí es donde se nota', 'Dos lavadas si el cabello está muy cargado', 'El frasco rinde alrededor de un mes'],
    combinacionSugerida: ['champu-piel-brillo', 'exfoliante-piel-brillo'],
    sistemaRecomendado: 'belleza-holistica',
  },
  'acondicionador-piel-brillo': {
    name: 'Acondicionador Piel&Brillo',
    price: 73900,
    image: '/productos/cuidado-personal/acondicionador-p&b-gano-excel-min.png',
    invima: 'NSOC96486-19CO',
    presentacion: 'Frasco de 250 ml',
    categoria: 'Cosmético',
    llevaGanoderma: true,
    goals: ['Cabello', 'Suavidad'],
    shortDescription: 'La segunda mitad del par: el champú limpia y este cierra, para que el pelo se desenrede solo.',
    taglineEstrategico: 'Donde el brillo se queda en vez de irse con el agua',
    usage: 'Después del champú, de medios a puntas. Deje un minuto y enjuague.',
    ingredients: ['Agua', 'Fragancia', 'Propilparabeno', 'Extracto de Ganoderma lucidum'],
    benefits: ['El cabello se desenreda solo al salir de la ducha', 'Suave y manejable', 'Con el champú de la línea es donde se nota', 'Frasco de 250 ml', 'Con el extracto de Ganoderma de toda la línea'],
    perfilIdeal: 'Quien usa el champú Piel&Brillo y quiere cerrar la rutina',
    momentoConsumo: 'La ducha, después del champú',
    ritual: ['De medios a puntas, no en la raíz', 'Un minuto antes de enjuagar', 'Rinde igual que el champú: se compran juntos'],
    combinacionSugerida: ['champu-piel-brillo', 'bebida-colageno-reskine'],
    sistemaRecomendado: 'belleza-holistica',
  },
  'exfoliante-piel-brillo': {
    name: 'Exfoliante Corporal Piel&Brillo',
    price: 73900,
    image: '/productos/cuidado-personal/exfoliante-p&b-gano-excel-min.png',
    invima: 'NSOC96487-19CO',
    presentacion: 'Envase de 200 g',
    categoria: 'Cosmético',
    llevaGanoderma: true,
    goals: ['Piel', 'Semanal'],
    shortDescription: 'Partículas suaves y extracto de Ganoderma para retirar lo que la ducha diaria no se lleva.',
    taglineEstrategico: 'La diferencia se siente el mismo día, al pasar la mano',
    usage: 'Dos o tres veces por semana, sobre la piel húmeda, con movimientos circulares. Enjuague.',
    ingredients: ['Agua', 'Sílice hidratada', 'Extracto de Ganoderma lucidum'],
    benefits: ['Partículas suaves que no raspan', 'Dos o tres veces por semana es la medida', 'La piel queda lisa al tacto', 'Envase de 200 g', 'Con el extracto de Ganoderma de toda la línea'],
    perfilIdeal: 'Quien quiere la piel lisa y no tiene tiempo para tratamientos largos',
    momentoConsumo: 'Dos o tres duchas por semana',
    ritual: ['Después, el Jabón Gano deja la piel suave', 'No lo use todos los días: dos o tres veces por semana basta', 'Antes de una ocasión especial, la noche anterior'],
    combinacionSugerida: ['jabon-gano', 'luvoco'],
    sistemaRecomendado: 'belleza-holistica',
  },
  'maquina-luvoco': {
    name: 'Máquina Luvoco',
    price: 1026000,
    image: '/productos/luvoco/luvoco55-1-1024x1024.png',
    invima: 'Certificado CE',
    presentacion: 'Máquina de espresso para cápsulas Luvoco',
    categoria: 'Dispositivo (certificado CE)',
    llevaGanoderma: false,
    goals: ['Espresso', 'Se compra una vez'],
    shortDescription: 'La máquina italiana de 15 bares que hace el espresso de la casa, con las cápsulas propias de Luvoco.',
    taglineEstrategico: 'La máquina se compra una vez; las cápsulas son las que se repiten',
    usage: 'Cápsula adentro, botón, y el espresso sale en segundos. Solo con cápsulas Luvoco.',
    ingredients: ['Máquina de espresso', 'Bomba de 15 bares', 'Compatible únicamente con cápsulas Luvoco', 'Garantía de 12 meses'],
    benefits: ['Espresso a presión, con el cuerpo de una cafetería', 'Con solo presionar un botón', '15 bares de presión', 'Garantía de 12 meses', 'Diseñada para las tres cápsulas Luvoco: Suave, Medio y Fuerte'],
    perfilIdeal: 'Quien quiere el espresso en casa y ya sabe qué café le gusta',
    momentoConsumo: 'Cada vez que quiera un espresso',
    ritual: ['Empiece por la cápsula Medio: es la que la mayoría deja en la cocina', 'Descalcifique la máquina una vez al mes', 'Las cápsulas no sirven en otras máquinas, ni otras cápsulas en esta'],
    combinacionSugerida: ['luvoco-suave', 'luvoco-medio', 'luvoco-fuerte'],
    sistemaRecomendado: 'experiencia-premium',
    downloadUrl: '/catalogo/docs/maquina-de-luvoco-digital-gano-excel.pdf',
  },
  'luvoco-suave': {
    name: 'Luvoco Suave · 15 cápsulas',
    price: 110900,
    image: '/productos/luvoco/luvoco-suave-gano-excel-min.png',
    invima: 'NSA-0012955-2022',
    presentacion: 'Caja de 15 cápsulas de 8 g',
    categoria: 'Alimento',
    llevaGanoderma: true,
    goals: ['Tueste claro', 'Acidez viva'],
    shortDescription: 'Tueste claro: sabor a grano tostado, acidez pronunciada y el mayor contenido de cafeína de las tres.',
    taglineEstrategico: 'La que uno pone cuando llega visita',
    usage: 'Una cápsula por espresso, en la máquina Luvoco.',
    ingredients: ['Café molido y tostado (tueste claro, 180 a 205 °C)', 'Betaglucanos de Ganoderma lucidum'],
    benefits: ['Tueste claro: conserva el sabor original del grano', 'Acidez viva y aroma limpio', 'De las tres, la de mayor cafeína', 'Quince cápsulas de 8 g', 'Con los betaglucanos del Ganoderma de toda la línea'],
    perfilIdeal: 'Quien toma el café sin que le pese, y quien lo prefiere más cargado de cafeína',
    momentoConsumo: 'La mañana',
    ritual: ['Es la que le gusta a casi todo el mundo: la de las visitas', 'Con un poco de leche espumada queda un cortado', 'Pruebe las tres antes de decidir cuál se queda en la cocina'],
    combinacionSugerida: ['luvoco-medio', 'ganorico-latte-rico'],
    sistemaRecomendado: 'experiencia-premium',
  },
  'luvoco-medio': {
    name: 'Luvoco Medio · 15 cápsulas',
    price: 110900,
    image: '/productos/luvoco/luvoco-medio-gano-excel-min.png',
    invima: 'NSA-0012954-2022',
    presentacion: 'Caja de 15 cápsulas de 8 g',
    categoria: 'Alimento',
    llevaGanoderma: true,
    goals: ['Equilibrado', 'El del diario'],
    shortDescription: 'Tueste medio: sabor, aroma y acidez equilibrados, con menos cafeína que el Suave.',
    taglineEstrategico: 'Ni tan ligero que se pierda, ni tan intenso que canse',
    usage: 'Una cápsula por espresso, en la máquina Luvoco.',
    ingredients: ['Café molido y tostado (tueste medio, 210 a 220 °C)', 'Betaglucanos de Ganoderma lucidum'],
    benefits: ['Sabor, aroma y acidez en equilibrio', 'Menos cafeína que el tueste claro', 'La que la mayoría deja en la cocina cuando ya probó las tres', 'Quince cápsulas de 8 g', 'Con los betaglucanos del Ganoderma de toda la línea'],
    perfilIdeal: 'Quien toma varios espressos al día y quiere uno que no canse',
    momentoConsumo: 'Todo el día',
    ritual: ['El del diario: mañana y después del almuerzo', 'Solo o con un chorrito de leche', 'Si el Suave le resulta ácido, esta es la suya'],
    combinacionSugerida: ['luvoco-fuerte', 'capsulas-excellium'],
    sistemaRecomendado: 'experiencia-premium',
  },
  'luvoco-fuerte': {
    name: 'Luvoco Fuerte · 15 cápsulas',
    price: 110900,
    image: '/productos/luvoco/luvoco-fuerte-gano-excel-min.png',
    invima: 'NSA-0012953-2022',
    presentacion: 'Caja de 15 cápsulas de 8 g',
    categoria: 'Alimento',
    llevaGanoderma: true,
    goals: ['Tueste alto', 'Menos cafeína'],
    shortDescription: 'Tueste alto: cuerpo denso, amargo redondo y ahumado, y la menor cafeína de las tres.',
    taglineEstrategico: 'Para quien lleva años tomando café y ya sabe lo que quiere',
    usage: 'Una cápsula por espresso, en la máquina Luvoco.',
    ingredients: ['Café molido y tostado (tueste alto, 240 a 250 °C)', 'Betaglucanos de Ganoderma lucidum'],
    benefits: ['Cuerpo denso y amargo redondo', 'Notas ahumadas del tueste alto', 'De las tres, la de menor cafeína', 'Quince cápsulas de 8 g', 'Con los betaglucanos del Ganoderma de toda la línea'],
    perfilIdeal: 'Quien busca el espresso intenso, y quien quiere menos cafeína sin renunciar al cuerpo',
    momentoConsumo: 'La mañana exigente, y después del almuerzo',
    ritual: ['Corto y sin azúcar es como mejor se aprecia', 'La menos cargada de cafeína, aunque sea la más intensa de sabor', 'Es la del espresso de después del almuerzo'],
    combinacionSugerida: ['capsulas-cordygold', 'ganocafe-clasico'],
    sistemaRecomendado: 'experiencia-premium',
  },
}

export default function CatalogoEstrategico() {
  // Estados
  const [cart, setCart] = useState<CartItem[]>([])
  const [cartOpen, setCartOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [distributor, setDistributor] = useState<DistributorProfile | null>(null)
  const [showTopSelling, setShowTopSelling] = useState(false)
  const [selectedSystem, setSelectedSystem] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'beneficios' | 'ciencia' | 'constructor'>('beneficios')

  // Productos destacados y más vendidos
  const featuredProducts = ['bebida-colageno-reskine', 'maquina-luvoco', 'ganocafe-3-en-1', 'capsulas-excellium']
  const topSellingProducts = ['ganocafe-3-en-1', 'maquina-luvoco', 'bebida-colageno-reskine', 'pasta-dientes-gano-fresh', 'capsulas-ganoderma']

  // Función para buscar distribuidor en Supabase
  const buscarDistribuidor = async (constructorRef: string | null): Promise<DistributorProfile | null> => {
    // Default para tráfico orgánico (sin referido)
    const defaultDistributor: DistributorProfile = {
      nombre: 'Luis Cabrejo',
      whatsapp: '+573215193909',
      email: 'info@creatuactivo.com',
      ciudad: 'Colombia',
      pais: 'Colombia'
    }

    // Si no hay constructor_ref, retornar default (tráfico orgánico)
    if (!constructorRef) {
      console.log('🔵 [Productos] Tráfico orgánico - usando distribuidor default:', defaultDistributor.nombre)
      return defaultDistributor
    }

    try {
      // Buscar constructor via API endpoint (usa SERVICE_KEY en servidor)
      console.log('🔍 [Productos] Buscando constructor:', constructorRef)

      const response = await fetch(`/api/constructor/${constructorRef}`)

      if (!response.ok) {
        if (response.status === 404) {
          console.log('ℹ️ [Productos] Constructor no encontrado en DB, usando default')
        } else {
          console.warn('⚠️ [Productos] Error buscando constructor, usando default')
        }
        return defaultDistributor
      }

      const data = await response.json()

      if (data && data.nombre) {
        console.log('✅ [Productos] Constructor encontrado:', data.nombre)

        return {
          nombre: data.nombre,
          whatsapp: data.whatsapp || defaultDistributor.whatsapp,
          email: data.email || defaultDistributor.email,
          ciudad: 'Colombia',
          pais: 'Colombia'
        }
      } else {
        console.log('ℹ️ [Productos] Respuesta inválida, usando default')
        return defaultDistributor
      }
    } catch (error) {
      console.error('❌ [Productos] Error consultando distribuidor:', error)
      return defaultDistributor
    }
  }

  // Cargar distribuidor y carrito al montar
  useEffect(() => {
    // Leer constructor_ref desde localStorage (guardado por tracking.js)
    const constructorRef = localStorage.getItem('constructor_ref')
    console.log('🎯 [Productos] Constructor ref desde localStorage:', constructorRef)

    // Tracking: prospecto vio el catálogo de productos
    const fingerprint =
      (window as any).FrameworkIAA?.fingerprint ||
      localStorage.getItem('iaa_fingerprint') ||
      null
    fetch('/api/funnel', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        source: 'catalogo-productos',
        step: 'vio_catalogo',
        fingerprint,
        constructor_ref: constructorRef,
      }),
    }).catch(() => {/* silencioso — no bloqueante */})

    buscarDistribuidor(constructorRef).then(profile => {
      setDistributor(profile || {
        nombre: 'Luis Cabrejo',
        whatsapp: '+573215193909',
        email: 'info@creatuactivo.com',
        ciudad: 'Colombia',
        pais: 'Colombia'
      })
    })

    // Pre-cargar productos desde URL param ?carrito=id1,id2 (Generador de Protocolos)
    const urlParams = new URLSearchParams(window.location.search)
    const carritoParam = urlParams.get('carrito')
    if (carritoParam) {
      const productIds = carritoParam.split(',').filter(id => productData[id])
      if (productIds.length > 0) {
        const urlCartItems: CartItem[] = productIds.map(id => ({
          id,
          name: productData[id].name,
          price: productData[id].price,
          quantity: 1,
          image: productData[id].image,
        }))
        setCart(urlCartItems)
        setCartOpen(true)
      }
    } else {
      const savedCart = localStorage.getItem('cart')
      if (savedCart) {
        try {
          const parsed = JSON.parse(savedCart)
          // Filtrar ítems cuyo producto ya no existe en el catálogo (evita carrito roto)
          if (Array.isArray(parsed)) {
            setCart(parsed.filter((item: CartItem) => item && productData[item.id]))
          }
        } catch {
          localStorage.removeItem('cart')
        }
      }
    }
  }, [])

  // Guardar carrito en localStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart))
  }, [cart])

  // Ocultar NEXUS cuando el carrito está abierto
  useEffect(() => {
    const nexusButton = document.querySelector('[data-nexus-button]') as HTMLElement
    if (nexusButton) {
      if (cartOpen) {
        nexusButton.style.display = 'none'
      } else {
        nexusButton.style.display = 'flex'
      }
    }
  }, [cartOpen])

  // Funciones del carrito
  const addToCart = (productId: string) => {
    const product = productData[productId]
    if (!product) return

    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === productId)
      if (existingItem) {
        return prevCart.map(item =>
          item.id === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      } else {
        return [...prevCart, {
          id: productId,
          name: product.name,
          price: product.price,
          quantity: 1,
          image: product.image
        }]
      }
    })
  }

  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId))
  }

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity === 0) {
      removeFromCart(productId)
      return
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    )
  }

  // El pedido va al chat de QUESWA (el WABA), no al número personal del socio:
  // quien venía conversando por WhatsApp continúa en el MISMO hilo, y el
  // webhook carga el pedido y le avisa al socio con su plantilla
  // (src/lib/wa-pedido.ts). El texto va en el formato que ese webhook sabe
  // leer («Quiero pedir: 2 x …»), sin precios — los pone el canal con su
  // tabla, así un precio viejo cacheado en esta página no viaja en el mensaje.
  // «vengo del enlace de {ref}» atribuye al socio a quien llega sin historial.
  const generateWhatsAppMessage = () => {
    if (cart.length === 0) return ""
    const ref = typeof window !== 'undefined' ? localStorage.getItem('constructor_ref') : null
    const lineas = cart.map(item => `${item.quantity} x ${item.name}`).join(', ')
    const saludo = ref ? `Hola Queswa, vengo del enlace de ${ref}.` : 'Hola Queswa.'
    return encodeURIComponent(`${saludo} Quiero pedir: ${lineas}.`)
  }

  const handleOverlayClick = (e: React.MouseEvent, closeFunction: () => void) => {
    if (e.target === e.currentTarget) {
      closeFunction()
    }
  }

  // Filtrar productos por sistema
  const getProductsBySystem = (systemId: string) => {
    const system = sistemasDebienestar[systemId]
    if (!system) return []
    return system.productos.map(id => ({ id, ...productData[id] }))
  }

  // Organizar productos por categorías tradicionales
  const bebidas = Object.entries(productData).filter(([id]) =>
    ['ganocafe-3-en-1', 'ganocafe-clasico', 'ganorico-latte-rico', 'ganorico-mocha-rico', 'ganorico-shoko-rico', 'espirulina-gano-creal', 'bebida-oleaf-gano-rooibos', 'gano-schokoladde', 'bebida-colageno-reskine'].includes(id)
  )

  const suplementos = Object.entries(productData).filter(([id]) =>
    ['capsulas-ganoderma', 'capsulas-excellium', 'capsulas-cordygold'].includes(id)
  )

  const cuidadoPersonal = Object.entries(productData).filter(([id]) =>
    ['pasta-dientes-gano-fresh', 'jabon-gano', 'jabon-transparente-gano', 'champu-piel-brillo', 'acondicionador-piel-brillo', 'exfoliante-piel-brillo'].includes(id)
  )

  const luvoco = Object.entries(productData).filter(([id]) =>
    ['maquina-luvoco', 'luvoco-suave', 'luvoco-medio', 'luvoco-fuerte'].includes(id)
  )

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        /* CTA Clinical (Lujo Silencioso adaptado al vertical e-commerce):
           tinte 7% del bioEmerald + borde + texto verde lab.
           Sin clip-path biselado (anti-investigación). */
        .clinical-btn {
          background: ${C.bioEmerald}14;
          color: ${C.bioEmerald};
          border: 1.5px solid ${C.bioEmerald};
          transition: background-color 0.25s ease, border-color 0.25s ease, color 0.25s ease;
        }
        .clinical-btn:hover {
          background: ${C.bioEmerald}26;
          border-color: ${C.bioEmerald};
        }
        .titanium-btn:hover {
          border-color: #ffffff !important;
          color: #ffffff !important;
        }
        /* WhatsApp hybrid: mantiene su identidad (verde WhatsApp + carbón obsidian)
           porque es un brand-button, pero sin clip-path biselado. */
        .whatsapp-hybrid {
          background: ${C.obsidian};
          color: ${C.whatsappLux};
          border: 2px solid ${C.whatsappLux}66;
          transition: background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease;
        }
        .whatsapp-hybrid:hover {
          background: ${C.whatsappLux};
          color: #000;
          border-color: ${C.whatsappLux};
        }
      `}} />

      <div className="min-h-screen" style={{ background: C.obsidian }}>
        <StrategicNavigation />

        {/* ═══════════════════════════════════════════════════════════════
            INDUSTRIAL HEADER - Clinical Biolab
            ═══════════════════════════════════════════════════════════════ */}
        <IndustrialHeader
          title="CATÁLOGO BIO-INTELIGENTE"
          subtitle="Nutrición Celular con Ingeniería de Extracción"
          refCode="CLINICAL_CATALOG_V1"
          imageSrc="/images/header-productos.jpg"
          imageAlt="Catálogo Bio-Inteligente Gano Excel"
        />

        {/* Botón carrito flotante - Hard Surface + Bio-Emerald */}
        <button
          onClick={() => setCartOpen(true)}
          aria-label="Abrir carrito de compras con productos seleccionados"
          style={{
            position: 'fixed',
            top: '6rem',
            right: '1rem',
            zIndex: 40,
            background: C.bioEmerald,
            color: C.obsidian,
            padding: '0.75rem',
            boxShadow: '0 4px 16px rgba(80, 200, 120, 0.3)',
          }}
          className="transition-all hover:scale-110"
        >
          <ShoppingCart className="h-6 w-6" />
          {cart.length > 0 && (
            <span
              style={{
                position: 'absolute',
                top: '-0.5rem',
                right: '-0.5rem',
                background: C.bioEmerald,
                color: C.obsidian,
                fontSize: '0.75rem',
                width: '1.5rem',
                height: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
              }}
            >
              {cart.reduce((sum, item) => sum + item.quantity, 0)}
            </span>
          )}
        </button>

      {/* Modal Los Más Vendidos - Clinical Luxury */}
      {showTopSelling && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={(e) => handleOverlayClick(e, () => setShowTopSelling(false))}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '80rem',
              background: 'var(--color-bg-surface)',
              border: '1px solid #3f3f46',
              boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1.5rem',
                borderBottom: '1px solid #3f3f46',
              }}
            >
              <div className="flex items-center space-x-3">
                <div
                  style={{
                    width: '3rem',
                    height: '3rem',
                    background: 'transparent',
                    border: '1px solid #52525b',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Trophy className="h-6 w-6" style={{ color: '#E5C279' }} />
                </div>
                <div>
                  <h2 className="text-2xl font-serif font-bold" style={{ color: C.textMain }}>Productos Más Vendidos</h2>
                  <p style={{ color: C.textMuted }}>Los favoritos de nuestra comunidad</p>
                </div>
              </div>
              <button
                onClick={() => setShowTopSelling(false)}
                aria-label="Cerrar ventana de productos más vendidos"
                style={{
                  padding: '0.5rem',
                  color: C.textMuted,
                  background: C.obsidian,
                }}
                className="transition-colors hover:scale-110"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {topSellingProducts.map((productId, index) => {
                  const product = productData[productId]
                  return (
                    <div
                      key={productId}
                      style={{
                        position: 'relative',
                        overflow: 'hidden',
                        border: '1px solid #3f3f46',
                              background: C.obsidian,
                      }}
                      className="group transition-all duration-300"
                    >
                      <div
                        style={{
                          position: 'absolute',
                          top: '1rem',
                          left: '1rem',
                          background: '#E5C279',
                          color: '#000',
                          padding: '0.25rem 0.75rem',
                          fontSize: '0.875rem',
                          fontWeight: 'bold',
                          zIndex: 10,
                        }}
                      >
                        Top #{index + 1}
                      </div>

                      <div className="p-6">
                        <div className="relative mb-6">
                          <div
                            style={{
                              background: C.obsidian,
                              padding: '1rem',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              height: '320px',
                            }}
                          >
                            <Image
                              src={product.image}
                              alt={`${product.name} - ${product.taglineEstrategico}`}
                              width={522}
                              height={348}
                              className="object-contain max-h-[18rem] drop-shadow-lg transition-transform group-hover:scale-105 duration-300"
                            />
                          </div>
                          <div
                            style={{
                              position: 'absolute',
                              top: '1rem',
                              right: '1rem',
                              background: 'transparent',
                              color: '#E5C279',
                              padding: '0.5rem 1rem',
                              fontSize: '1.25rem',
                              fontWeight: 'bold',
                              fontFamily: "var(--font-mono)",
                            }}
                          >
                            ${product.price.toLocaleString()}
                          </div>
                        </div>

                        <h3 className="text-lg font-bold mb-2" style={{ color: C.textMain }}>{product.name}</h3>
                        <p className="text-sm font-medium mb-3 italic" style={{ color: '#90A4AE' }}>"{product.taglineEstrategico}"</p>
                        <p className="text-sm mb-6 leading-relaxed line-clamp-2" style={{ color: C.textMuted }}>{product.shortDescription}</p>

                        <div className="flex flex-wrap gap-2 mb-6">
                          {product.goals.map((goal) => (
                            <span
                              key={goal}
                              style={{
                                background: 'transparent',
                                border: '1px solid #3f3f46',
                                padding: '0.25rem 0.75rem',
                                fontSize: '0.75rem',
                                color: '#71717a',
                                fontWeight: 500,
                              }}
                            >
                              {goal}
                            </span>
                          ))}
                        </div>

                        <div className="flex space-x-3">
                          <button
                            onClick={() => {
                              setSelectedProduct(product)
                              setShowTopSelling(false)
                            }}
                            style={{
                              flex: 1,
                              background: 'transparent',
                              border: '1px solid #52525b',
                              color: '#a1a1aa',
                              padding: '0.75rem 1rem',
                              fontSize: '0.75rem',
                              fontWeight: 500,
                              letterSpacing: '0.15em',
                              textTransform: 'uppercase',
                              fontFamily: "var(--font-mono)",
                            }}
                            className="titanium-btn transition-all"
                          >
                            ESPECIFICACIONES
                          </button>
                          <button
                            onClick={() => {
                              addToCart(productId)
                              setShowTopSelling(false)
                            }}
                            style={{
                              flex: 1,
                              background: '#60ABAE',
                              color: '#000',
                              padding: '0.75rem 1rem',
                              fontSize: '0.875rem',
                              fontWeight: 600,
                            }}
                            className="transition-all hover:scale-105 hover:brightness-110"
                          >
                            Añadir
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Panel del carrito - Clinical Luxury */}
      {cartOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={(e) => handleOverlayClick(e, () => setCartOpen(false))}
        >
          {/* Clinical Cart Panel */}
          <div
            style={{
              position: 'absolute',
              right: 0,
              top: 0,
              height: '100%',
              width: '24rem',
              background: `rgba(15, 46, 47, 0.98)`,
              backdropFilter: 'blur(16px)',
              borderLeft: `1px solid ${C.bioEmerald}30`,
              boxShadow: '-4px 0 24px rgba(0,0,0,0.5)',
            }}
          >
            <div className="flex flex-col h-full">
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1.5rem',
                  borderBottom: `1px solid ${C.bioEmerald}30`,
                }}
              >
                <h2 className="text-xl font-bold" style={{ color: C.textMain }}>Su Sistema de Bienestar</h2>
                <button
                  onClick={() => setCartOpen(false)}
                  aria-label="Cerrar carrito de compras"
                  style={{
                    padding: '0.5rem',
                    color: C.textMuted,
                    background: C.obsidian,
                  }}
                  className="transition-colors hover:scale-110"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                {cart.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingCart className="h-16 w-16 mx-auto mb-4" style={{ color: C.textDim }} />
                    <p style={{ color: C.textMuted }}>Su sistema está vacío</p>
                    <p className="text-sm mt-2" style={{ color: C.textDim }}>Comienza agregando productos estrella</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.map((item) => (
                      <div
                        key={item.id}
                        style={{
                          background: C.gunmetal,
                          border: `1px solid ${C.bioEmerald}20`,
                          padding: '1rem',
                        }}
                      >
                        <div className="flex items-center space-x-4">
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={64}
                            height={64}
                            style={{
                              width: '4rem',
                              height: '4rem',
                              objectFit: 'contain',
                              background: 'rgba(255,255,255,0.05)',
                              padding: '0.25rem',
                            }}
                          />
                          <div className="flex-1">
                            <h3 className="font-medium text-sm" style={{ color: C.textMain }}>{item.name}</h3>
                            <p className="text-sm" style={{ color: C.bioEmerald }}>${item.price.toLocaleString()}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              aria-label="Disminuir cantidad"
                              style={{
                                width: '2rem',
                                height: '2rem',
                                background: C.obsidian,
                                border: '1px solid #3f3f46',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: C.textMuted,
                              }}
                              className="transition-colors hover:scale-110"
                            >
                              -
                            </button>
                            <span className="w-8 text-center font-medium" style={{ color: C.textMain }}>{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              aria-label="Aumentar cantidad"
                              style={{
                                width: '2rem',
                                height: '2rem',
                                background: C.obsidian,
                                border: '1px solid #3f3f46',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: C.textMuted,
                              }}
                              className="transition-colors hover:scale-110"
                            >
                              +
                            </button>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            aria-label="Eliminar producto del carrito"
                            className="text-[#F43F5E] hover:text-[#FB7185] transition-colors"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {cart.length > 0 && (
                <div
                  style={{
                    borderTop: `1px solid ${C.bioEmerald}30`,
                    padding: '1.5rem',
                  }}
                  className="space-y-4"
                >
                  <div className="space-y-2" style={{ color: C.textMain }}>
                    <div className="flex justify-between">
                      <span style={{ color: C.textMuted }}>Envío:</span>
                      <span className="font-medium" style={{ color: C.textMuted }}>Por definir según ciudad y volumen</span>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontWeight: 'bold',
                        fontSize: '1.125rem',
                        borderTop: `1px solid ${C.bioEmerald}30`,
                        paddingTop: '0.5rem',
                      }}
                    >
                      <span>Total productos:</span>
                      <span style={{ color: C.bioEmerald }}>${cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toLocaleString('es-CO')}</span>
                    </div>
                  </div>

                  <div
                    style={{
                      background: `${C.bioEmerald}15`,
                      border: '1px solid #3f3f46',
                      padding: '0.75rem',
                    }}
                  >
                    <p className="text-xs font-medium mb-1" style={{ color: C.bioEmerald }}>Siguiente Paso:</p>
                    <p className="text-sm" style={{ color: C.textMain }}>Confirme su pedido; el costo de envío lo coordina con su asesor según su ciudad y el volumen.</p>
                  </div>

                  <a
                    href={`https://wa.me/573215193909?text=${generateWhatsAppMessage()}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="whatsapp-hybrid"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      fontWeight: 600,
                      textAlign: 'center',
                      display: 'block',
                      letterSpacing: '0.05em',
                      fontFamily: "var(--font-sans)",
                      fontSize: '1rem',
                    }}
                  >
                    FINALIZAR POR WHATSAPP
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Contenido principal */}
      <div className="container mx-auto px-4 py-8">

        {/* Header estratégico - Clinical Luxury */}
        <div className="text-center mb-12 pt-8">
          <div
            style={{
              display: 'inline-block',
              background: `${C.bioEmerald}15`,
              border: '1px solid #3f3f46',
              padding: '0.5rem 1.5rem',
              marginBottom: '1.5rem',
            }}
          >
            <span
              style={{
                color: C.bioEmerald,
                fontWeight: 500,
                fontSize: '0.875rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                fontFamily: "var(--font-mono)",
              }}
            >
              Catálogo Oficial Gano Excel
            </span>
          </div>

          <h2
            className="text-4xl md:text-6xl font-serif font-bold mb-4"
            style={{ color: C.textMain }}
          >
            Siéntase Bien <span style={{ color: C.bioEmerald }}>Cada Día</span>
          </h2>

          <p
            className="text-lg md:text-xl max-w-3xl mx-auto mb-8 leading-relaxed"
            style={{ color: C.textMuted }}
          >
            Imagine empezar su mañana con un café que además de despertarlo, cuida su salud. Nuestros productos tienen el poder del hongo <span style={{ color: C.bioEmerald }}>Ganoderma</span>: más de 200 nutrientes naturales que su cuerpo aprovecha fácilmente.
          </p>

          {/* CTA al asesor de salud y bienestar — abre Queswa (modo asesor vía pageContext catalogo_productos) */}
          <div className="flex flex-col items-center gap-3 mb-8">
            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent('open-queswa'))}
              className="cta-base cta-primary"
              style={{ padding: '1rem 2rem', fontSize: '1rem' }}
            >
              <Bot className="h-5 w-5" />
              <span>Pregúntele a Queswa, su asesor de bienestar →</span>
            </button>
            <p className="text-sm max-w-md" style={{ color: C.textMuted }}>
              ¿No sabe cuál elegir? Cuéntele cómo se siente y le recomienda los productos ideales para usted, sin compromiso.
            </p>
          </div>

          {distributor && (
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                background: `rgba(15, 46, 47, 0.70)`,
                border: `1px solid ${C.bioEmerald}30`,
                padding: '0.75rem 1.5rem',
                marginBottom: '2rem',
              }}
            >
              <Rocket className="h-4 w-4 mr-2 animate-pulse" style={{ color: C.bioEmerald }} />
              <span style={{ color: C.textMuted }}>
                Especialista en bienestar: <span className="font-bold" style={{ color: C.bioEmerald }}>{distributor.nombre}</span>
              </span>
            </div>
          )}
        </div>

{/* Nueva Sección: La Ventaja Competitiva - Clinical Luxury */}
<section className="mb-16">
  <div className="text-center mb-12">
    <div
      style={{
        display: 'inline-block',
        background: `${C.bioEmerald}15`,
        border: `1px solid ${C.bioEmerald}40`,
        padding: '0.5rem 1.5rem',
        marginBottom: '1.5rem',
      }}
    >
      <span
        style={{
          color: C.bioEmerald,
          fontWeight: 500,
          fontSize: '0.875rem',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          fontFamily: "var(--font-mono)",
        }}
      >
        Lo Mejor del Ganoderma
      </span>
    </div>

    <h2
      className="text-4xl md:text-5xl font-serif font-bold mb-6 leading-tight"
      style={{ color: C.textMain }}
    >
      Nutrición que Su Cuerpo <span style={{ color: C.bioEmerald }}>Realmente Aprovecha</span>
    </h2>

    <p className="text-lg max-w-4xl mx-auto" style={{ color: C.textMuted }}>
      No basta con tener buenos ingredientes, su cuerpo necesita poder absorberlos. Nuestro extracto de Ganoderma se disuelve completamente, permitiendo que reciba todos sus beneficios en cada taza o cápsula.
    </p>
  </div>

          {/* Estadísticas de impacto - Pharma Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 max-w-5xl mx-auto">
            <div
              style={{
                background: 'var(--color-bg-surface)',
                border: `1px solid ${C.bioEmerald}30`,
                borderTop: `3px solid ${C.bioEmerald}`,
                padding: '2rem',
                textAlign: 'center',
              }}
              className="group hover:scale-105 transition-all"
            >
              <div
                className="text-5xl font-serif font-bold mb-2"
                style={{ color: C.bioEmerald }}
              >
                200+
              </div>
              <div className="font-semibold" style={{ color: C.textMain }}>Nutrientes Naturales</div>
              <div className="text-sm mt-2" style={{ color: C.textDim }}>En cada producto</div>
            </div>

            <div
              style={{
                background: 'var(--color-bg-surface)',
                border: `1px solid ${C.bioEmerald}30`,
                borderTop: `3px solid ${C.bioEmerald}`,
                padding: '2rem',
                textAlign: 'center',
              }}
              className="group hover:scale-105 transition-all"
            >
              <div
                className="text-5xl font-serif font-bold mb-2"
                style={{ color: C.bioEmerald }}
              >
                100%
              </div>
              <div className="font-semibold" style={{ color: C.textMain }}>Fácil de Absorber</div>
              <div className="text-sm mt-2" style={{ color: C.textDim }}>Su cuerpo lo aprovecha completo</div>
            </div>

            <div
              style={{
                background: 'var(--color-bg-surface)',
                border: `1px solid ${C.bioEmerald}30`,
                borderTop: `3px solid ${C.bioEmerald}`,
                padding: '2rem',
                textAlign: 'center',
              }}
              className="group hover:scale-105 transition-all"
            >
              <div
                className="text-5xl font-serif font-bold mb-2"
                style={{ color: C.bioEmerald }}
              >
                6
              </div>
              <div className="font-semibold" style={{ color: C.textMain }}>Tipos de Ganoderma</div>
              <div className="text-sm mt-2" style={{ color: C.textDim }}>Unidos en una fórmula única</div>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={() => setShowTopSelling(true)}
              className="clinical-btn inline-flex items-center gap-3"
              style={{
                padding: '0.875rem 2rem',
                fontWeight: 600,
                fontSize: '1rem',
                fontFamily: "var(--font-sans)",
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
              }}
            >
              <Trophy className="h-5 w-5" />
              Ver Productos Más Vendidos
            </button>
          </div>
        </section>

        {/* Nueva Sección: Sistemas de Bienestar - Clinical Luxury */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <div
              style={{
                display: 'inline-block',
                background: `${C.bioEmerald}15`,
                border: '1px solid #3f3f46',
                padding: '0.5rem 1.5rem',
                marginBottom: '1.5rem',
              }}
            >
              <span
                style={{
                  color: C.bioEmerald,
                  fontWeight: 500,
                  fontSize: '0.875rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  fontFamily: "var(--font-mono)",
                }}
              >
                Encuentra lo que Necesitas
              </span>
            </div>
            <h2
              className="text-3xl md:text-4xl font-serif font-bold mb-6"
              style={{ color: C.textMain }}
            >
              Productos para Cada Momento de Su Vida
            </h2>
            <p className="text-lg max-w-3xl mx-auto" style={{ color: C.textMuted }}>
              Hemos organizado nuestros productos según lo que busca: más energía, cuidar a su familia, verse mejor o disfrutar un buen café.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {Object.entries(sistemasDebienestar).map(([key, system]) => (
              <div
                key={key}
                onClick={() => setSelectedSystem(key)}
                style={{
                  background: 'var(--color-bg-surface)',
                  border: '1px solid #3f3f46',
                  padding: '1.5rem',
                  cursor: 'pointer',
                }}
                className="group transition-all hover:scale-105"
              >
                <div
                  style={{
                    width: '4rem',
                    height: '4rem',
                    background: `${C.bioEmerald}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1rem',
                    color: C.bioEmerald,
                  }}
                  className="group-hover:scale-110 transition-all"
                >
                  {system.icono}
                </div>
                <h3
                  className="text-lg font-bold mb-2 text-center"
                  style={{ color: C.textMain }}
                >
                  {system.nombre}
                </h3>
                <p
                  className="text-sm text-center mb-4"
                  style={{ color: C.textMuted }}
                >
                  {system.descripcion}
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  <span
                    style={{
                      fontSize: '0.75rem',
                      background: C.obsidian,
                      border: '1px solid #3f3f46',
                      padding: '0.25rem 0.75rem',
                      color: C.bioEmerald,
                    }}
                  >
                    {system.productos.length} productos
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Productos por categorías tradicionales - Clinical Luxury */}
        <section id="bebidas" className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-serif font-bold" style={{ color: C.textMain }}>Bebidas Saludables</h2>
            <div
              style={{
                height: '1px',
                flex: 1,
                background: `linear-gradient(to right, ${C.bioEmerald}80, transparent)`,
                marginLeft: '2rem',
              }}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {bebidas.map(([id, product]) => (
              <div
                key={id}
                style={{
                  background: 'var(--color-bg-surface)',
                  border: '1px solid #3f3f46',
                  overflow: 'hidden',
                }}
                className="group transition-all duration-300 hover:border-zinc-600"
              >
                <div className="p-6">
                  <div className="relative mb-6">
                    <div
                      style={{
                        background: C.obsidian,
                        padding: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '400px',
                      }}
                    >
                      <Image
                        src={product.image}
                        alt={`${product.name} - ${product.shortDescription}`}
                        width={522}
                        height={348}
                        className="object-contain max-h-[22rem] drop-shadow-lg transition-transform group-hover:scale-105 duration-300"
                      />
                    </div>
                    <div
                      style={{
                        position: 'absolute',
                        top: '1rem',
                        right: '1rem',
                        background: 'transparent',
                        color: '#E5C279',
                        padding: '0.5rem 1rem',
                        fontSize: '1.25rem',
                        fontWeight: 'bold',
                        fontFamily: "var(--font-mono)",
                      }}
                    >
                      ${product.price.toLocaleString()}
                    </div>
                  </div>

                  <h3 className="text-xl font-bold mb-2" style={{ color: C.textMain }}>{product.name}</h3>
                  {product.taglineEstrategico && (
                    <p className="text-sm font-medium mb-3 italic" style={{ color: '#90A4AE' }}>"{product.taglineEstrategico}"</p>
                  )}
                  <p className="text-sm mb-3" style={{ color: C.textDim, fontFamily: "var(--font-mono)" }}>{product.presentacion} · INVIMA {product.invima}</p>
                  <p className="text-sm mb-6 leading-relaxed line-clamp-3" style={{ color: C.textMuted }}>{product.shortDescription}</p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {product.goals.map((goal) => (
                      <span
                        key={goal}
                        style={{
                          background: 'transparent',
                          border: '1px solid #3f3f46',
                          padding: '0.25rem 0.75rem',
                          fontSize: '0.75rem',
                          color: '#71717a',
                          fontWeight: 500,
                        }}
                      >
                        {goal}
                      </span>
                    ))}
                  </div>

                  <div className="flex space-x-3">
                    <button
                      onClick={() => setSelectedProduct(product)}
                      style={{
                        flex: 1,
                        background: 'transparent',
                        border: '1px solid #52525b',
                        color: '#a1a1aa',
                        padding: '0.75rem 1rem',
                        fontSize: '0.75rem',
                        fontWeight: 500,
                        letterSpacing: '0.15em',
                        textTransform: 'uppercase',
                        fontFamily: "var(--font-mono)",
                      }}
                      className="titanium-btn transition-all"
                    >
                      ESPECIFICACIONES
                    </button>
                    <button
                      onClick={() => addToCart(id)}
                      style={{
                        flex: 1,
                        background: '#60ABAE',
                        color: '#000',
                        padding: '0.75rem 1rem',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      className="transition-all hover:scale-105 hover:brightness-110"
                    >
                      <Gift className="h-4 w-4 mr-2" />
                      Agregar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Sección Luvoco Premium - Clinical Luxury */}
        <section id="luvoco" className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-serif font-bold" style={{ color: C.textMain }}>Experiencia Luvoco Premium</h2>
            <div
              style={{
                height: '1px',
                flex: 1,
                background: 'linear-gradient(to right, #E5C27980, transparent)',
                marginLeft: '2rem',
              }}
            />
          </div>

          {/* Banner Luvoco - Alquimia del Café */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '300px',
              marginBottom: '3rem',
              overflow: 'hidden',
              border: '1px solid #3f3f46',
              borderTop: '3px solid #E5C279',
            }}
          >
            <Image
              src="/productos/header-cafe.jpg"
              alt="Experiencia Barista Luvoco - Alquimia del Café"
              fill
              style={{ objectFit: 'cover', objectPosition: 'center' }}
              priority={false}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to right, rgba(11,12,12,0.85), rgba(11,12,12,0.3))',
                display: 'flex',
                alignItems: 'center',
                padding: '2rem 3rem',
              }}
            >
              <div>
                <h3
                  style={{
                    color: '#E5C279',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    fontFamily: "var(--font-mono)",
                    marginBottom: '0.5rem',
                  }}
                >
                  Love of Coffee
                </h3>
                <p
                  style={{
                    color: C.textMain,
                    fontSize: '2rem',
                    fontWeight: 700,
                    fontFamily: "var(--font-sans)",
                    letterSpacing: '0.05em',
                    marginBottom: '0.5rem',
                  }}
                >
                  ALQUIMIA DEL CAFÉ
                </p>
                <p
                  style={{
                    color: C.textMuted,
                    fontSize: '1rem',
                    maxWidth: '500px',
                  }}
                >
                  Tecnología de extracción de 15 bares. Experiencia barista premium en su hogar.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center mb-12">
            <div
              style={{
                display: 'inline-block',
                background: 'rgba(229, 194, 121, 0.08)',
                border: '1px solid rgba(229, 194, 121, 0.3)',
                padding: '0.5rem 1.5rem',
                marginBottom: '1.5rem',
              }}
            >
              <span
                style={{
                  color: '#E5C279',
                  fontWeight: 500,
                  fontSize: '0.875rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  fontFamily: "var(--font-mono)",
                }}
              >
                Love of Coffee - Sistema Premium
              </span>
            </div>
            <p className="text-lg max-w-3xl mx-auto" style={{ color: C.textMuted }}>
              Sistema de cápsulas con tecnología de 15 bares. El ancla perfecta para clientes de alto valor
              que garantiza compra recurrente y construye su activo mes a mes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-8">
            {luvoco.map(([id, product]) => (
              <div
                key={id}
                style={{
                  background: 'var(--color-bg-surface)',
                  border: '1px solid #3f3f46',
                  overflow: 'hidden',
                }}
                className="group transition-all duration-300"
              >
                <div className="p-6">
                  <div className="relative mb-6">
                    <div
                      style={{
                        background: C.obsidian,
                        padding: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '400px',
                      }}
                    >
                      <Image
                        src={product.image}
                        alt={`${product.name} - ${product.shortDescription}`}
                        width={522}
                        height={348}
                        className="object-contain max-h-[22rem] drop-shadow-lg transition-transform group-hover:scale-105 duration-300"
                      />
                    </div>
                    <div
                      style={{
                        position: 'absolute',
                        top: '1rem',
                        right: '1rem',
                        background: 'transparent',
                        color: '#E5C279',
                        padding: '0.5rem 1rem',
                        fontSize: '1.25rem',
                        fontWeight: 'bold',
                        fontFamily: "var(--font-mono)",
                      }}
                    >
                      ${product.price.toLocaleString()}
                    </div>
                  </div>

                  <h3 className="text-xl font-bold mb-2" style={{ color: C.textMain }}>{product.name}</h3>
                  {product.taglineEstrategico && (
                    <p className="text-sm font-medium mb-3 italic" style={{ color: '#90A4AE' }}>"{product.taglineEstrategico}"</p>
                  )}
                  <p className="text-sm mb-3" style={{ color: C.textDim, fontFamily: "var(--font-mono)" }}>{product.presentacion} · {product.categoria}</p>
                  <p className="text-sm mb-6 leading-relaxed" style={{ color: C.textMuted }}>{product.shortDescription}</p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {product.goals.map((goal) => (
                      <span
                        key={goal}
                        style={{
                          background: 'transparent',
                          border: '1px solid #3f3f46',
                          padding: '0.25rem 0.75rem',
                          fontSize: '0.75rem',
                          color: '#71717a',
                          fontWeight: 500,
                        }}
                      >
                        {goal}
                      </span>
                    ))}
                  </div>

                  <div className="flex flex-col space-y-3">
                    <div className="flex space-x-3">
                      <button
                        onClick={() => setSelectedProduct(product)}
                        style={{
                          flex: 1,
                          background: 'transparent',
                          border: '1px solid #52525b',
                          color: '#a1a1aa',
                          padding: '0.75rem 1rem',
                          fontSize: '0.75rem',
                          fontWeight: 500,
                          letterSpacing: '0.15em',
                          textTransform: 'uppercase',
                          fontFamily: "var(--font-mono)",
                        }}
                        className="titanium-btn transition-all"
                      >
                        ESPECIFICACIONES
                      </button>
                      <button
                        onClick={() => addToCart(id)}
                        style={{
                          flex: 1,
                          background: '#E5C279',
                          color: '#000',
                          padding: '0.75rem 1rem',
                          fontSize: '0.875rem',
                          fontWeight: 600,
                        }}
                        className="transition-all hover:scale-105 hover:brightness-110"
                      >
                        Agregar Premium
                      </button>
                    </div>

                    {product.downloadUrl && id === 'maquina-luvoco' && (
                      <div className="flex flex-col space-y-2">
                        <a
                          href="https://drive.google.com/file/d/13C_CQyXnmeNPqzrsm34GNCIysE-T4p2k/view?usp=drive_link"
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '100%',
                            background: C.gunmetal,
                            border: '1px solid rgba(229, 194, 121, 0.4)',
                            color: '#E5C279',
                            padding: '0.75rem 1rem',
                            fontSize: '0.875rem',
                            fontWeight: 500,
                          }}
                          className="transition-all hover:scale-105 hover:brightness-110"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Descargar Ficha de Producto
                        </a>
                        <a
                          href="https://drive.google.com/file/d/12EsTVv_HPTa6xEj505H_Z8XQssYHfSoi/view?usp=drive_link"
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '100%',
                            background: C.gunmetal,
                            border: '1px solid rgba(229, 194, 121, 0.4)',
                            color: '#E5C279',
                            padding: '0.75rem 1rem',
                            fontSize: '0.875rem',
                            fontWeight: 500,
                          }}
                          className="transition-all hover:scale-105 hover:brightness-110"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Descargar Especificaciones Técnicas
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Suplementos - Clinical Luxury */}
        <section id="suplementos" className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-serif font-bold" style={{ color: C.textMain }}>Suplementos Naturales</h2>
            <div
              style={{
                height: '1px',
                flex: 1,
                background: `linear-gradient(to right, ${C.bioEmerald}80, transparent)`,
                marginLeft: '2rem',
              }}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {suplementos.map(([id, product]) => (
              <div
                key={id}
                style={{
                  background: 'var(--color-bg-surface)',
                  border: '1px solid #3f3f46',
                  overflow: 'hidden',
                }}
                className="group transition-all duration-300"
              >
                <div className="p-6">
                  <div className="relative mb-6">
                    <div
                      style={{
                        background: C.obsidian,
                        padding: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '400px',
                      }}
                    >
                      <Image
                        src={product.image}
                        alt={`${product.name} - ${product.shortDescription}`}
                        width={522}
                        height={348}
                        className="object-contain max-h-[22rem] drop-shadow-lg transition-transform group-hover:scale-105 duration-300"
                      />
                    </div>
                    <div
                      style={{
                        position: 'absolute',
                        top: '1rem',
                        right: '1rem',
                        background: 'transparent',
                        color: '#E5C279',
                        padding: '0.5rem 1rem',
                        fontSize: '1.25rem',
                        fontWeight: 'bold',
                        fontFamily: "var(--font-mono)",
                      }}
                    >
                      ${product.price.toLocaleString()}
                    </div>
                  </div>

                  <h3 className="text-xl font-bold mb-2" style={{ color: C.textMain }}>{product.name}</h3>
                  {product.taglineEstrategico && (
                    <p className="text-sm font-medium mb-3 italic" style={{ color: '#90A4AE' }}>"{product.taglineEstrategico}"</p>
                  )}
                  <p className="text-sm mb-3" style={{ color: C.textDim, fontFamily: "var(--font-mono)" }}>{product.presentacion} · INVIMA {product.invima}</p>
                  <p className="text-sm mb-6 leading-relaxed" style={{ color: C.textMuted }}>{product.shortDescription}</p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {product.goals.map((goal) => (
                      <span
                        key={goal}
                        style={{
                          background: 'transparent',
                          border: '1px solid #3f3f46',
                          padding: '0.25rem 0.75rem',
                          fontSize: '0.75rem',
                          color: '#71717a',
                          fontWeight: 500,
                        }}
                      >
                        {goal}
                      </span>
                    ))}
                  </div>

                  <div className="flex space-x-3">
                    <button
                      onClick={() => setSelectedProduct(product)}
                      style={{
                        flex: 1,
                        background: 'transparent',
                        border: '1px solid #52525b',
                        color: '#a1a1aa',
                        padding: '0.75rem 1rem',
                        fontSize: '0.75rem',
                        fontWeight: 500,
                        letterSpacing: '0.15em',
                        textTransform: 'uppercase',
                        fontFamily: "var(--font-mono)",
                      }}
                      className="titanium-btn transition-all"
                    >
                      ESPECIFICACIONES
                    </button>
                    <button
                      onClick={() => addToCart(id)}
                      style={{
                        flex: 1,
                        background: '#60ABAE',
                        color: '#000',
                        padding: '0.75rem 1rem',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      className="transition-all hover:scale-105 hover:brightness-110"
                    >
                      <Gift className="h-4 w-4 mr-2" />
                      Agregar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Cuidado Personal - Clinical Luxury */}
        <section id="cuidado-personal" className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-serif font-bold" style={{ color: C.textMain }}>Cuidado Personal</h2>
            <div
              style={{
                height: '1px',
                flex: 1,
                background: `linear-gradient(to right, ${C.bioEmerald}80, transparent)`,
                marginLeft: '2rem',
              }}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {cuidadoPersonal.map(([id, product]) => (
              <div
                key={id}
                style={{
                  background: 'var(--color-bg-surface)',
                  border: '1px solid #3f3f46',
                  overflow: 'hidden',
                }}
                className="group transition-all duration-300"
              >
                <div className="p-6">
                  <div className="relative mb-6">
                    <div
                      style={{
                        background: C.obsidian,
                        padding: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '400px',
                      }}
                    >
                      <Image
                        src={product.image}
                        alt={`${product.name} - ${product.shortDescription}`}
                        width={522}
                        height={348}
                        className="object-contain max-h-[22rem] drop-shadow-lg transition-transform group-hover:scale-105 duration-300"
                      />
                    </div>
                    <div
                      style={{
                        position: 'absolute',
                        top: '1rem',
                        right: '1rem',
                        background: 'transparent',
                        color: '#E5C279',
                        padding: '0.5rem 1rem',
                        fontSize: '1.25rem',
                        fontWeight: 'bold',
                        fontFamily: "var(--font-mono)",
                      }}
                    >
                      ${product.price.toLocaleString()}
                    </div>
                  </div>

                  <h3 className="text-xl font-bold mb-2" style={{ color: C.textMain }}>{product.name}</h3>
                  {product.taglineEstrategico && (
                    <p className="text-sm font-medium mb-3 italic" style={{ color: '#90A4AE' }}>"{product.taglineEstrategico}"</p>
                  )}
                  <p className="text-sm mb-3" style={{ color: C.textDim, fontFamily: "var(--font-mono)" }}>{product.presentacion} · INVIMA {product.invima}</p>
                  <p className="text-sm mb-6 leading-relaxed" style={{ color: C.textMuted }}>{product.shortDescription}</p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {product.goals.map((goal) => (
                      <span
                        key={goal}
                        style={{
                          background: 'transparent',
                          border: '1px solid #3f3f46',
                          padding: '0.25rem 0.75rem',
                          fontSize: '0.75rem',
                          color: '#71717a',
                          fontWeight: 500,
                        }}
                      >
                        {goal}
                      </span>
                    ))}
                  </div>

                  <div className="flex space-x-3">
                    <button
                      onClick={() => setSelectedProduct(product)}
                      style={{
                        flex: 1,
                        background: 'transparent',
                        border: '1px solid #52525b',
                        color: '#a1a1aa',
                        padding: '0.75rem 1rem',
                        fontSize: '0.75rem',
                        fontWeight: 500,
                        letterSpacing: '0.15em',
                        textTransform: 'uppercase',
                        fontFamily: "var(--font-mono)",
                      }}
                      className="titanium-btn transition-all"
                    >
                      ESPECIFICACIONES
                    </button>
                    <button
                      onClick={() => addToCart(id)}
                      style={{
                        flex: 1,
                        background: '#60ABAE',
                        color: '#000',
                        padding: '0.75rem 1rem',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      className="transition-all hover:scale-105 hover:brightness-110"
                    >
                      <Gift className="h-4 w-4 mr-2" />
                      Agregar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Sección CTA Final: Construye su Sistema - Quiet Luxury */}
        <section className="mb-16 mt-20">
          <div className="bg-[#16181D] border border-[#E5C279]/20  p-12 text-center">
            <Shield className="w-16 h-16 text-[color:var(--color-brand)] mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[color:var(--color-text-primary)] mb-6">
              ¿Le Interesa Emprender con Productos de Bienestar?
            </h2>
            <p className="text-[#A3A3A3] text-lg max-w-3xl mx-auto mb-8">
              Si desea conocer más sobre cómo estos productos pueden ayudarle, o le interesa compartirlos con otros, estamos aquí para ayudarle.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-10">
              <div className="bg-[#0B0C0C] border border-[#E5C279]/20  p-6">
                <div className="text-2xl font-serif font-bold text-[color:var(--color-brand)] mb-2">Constructor Inicial</div>
                <p className="text-[color:var(--color-text-primary)] font-semibold mb-2">$200 USD</p>
                <p className="text-[#A3A3A3] text-sm">~$900.000 COP</p>
                <p className="text-[#6B7280] text-xs mt-3">Bono Tecnológico incluido</p>
                <p className="text-[#6B7280] text-xs">2 meses cortesía Plan Cimiento</p>
              </div>

              <div className="bg-[#0B0C0C] border border-[#E5C279]/30  p-6">
                <div className="text-2xl font-serif font-bold text-[color:var(--color-brand)] mb-2">Constructor Empresarial</div>
                <p className="text-[color:var(--color-text-primary)] font-semibold mb-2">$500 USD</p>
                <p className="text-[#A3A3A3] text-sm">~$2.250.000 COP</p>
                <p className="text-[#6B7280] text-xs mt-3">Bono Tecnológico incluido</p>
                <p className="text-[#6B7280] text-xs">4 meses cortesía Plan Estructura</p>
              </div>

              <div className="bg-[#0B0C0C] border border-[#E5C279]/40  p-6">
                <div className="text-2xl font-serif font-bold text-[color:var(--color-brand)] mb-2">Constructor Visionario</div>
                <p className="text-[color:var(--color-text-primary)] font-semibold mb-2">$1,000 USD</p>
                <p className="text-[#A3A3A3] text-sm">~$4.500.000 COP</p>
                <p className="text-[#6B7280] text-xs mt-3">Bono Tecnológico incluido</p>
                <p className="text-[#6B7280] text-xs">6 meses cortesía Plan Rascacielos</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={`https://wa.me/${(distributor?.whatsapp || '+573215193909').replace(/\D/g, '')}?text=${encodeURIComponent('Hola! Me interesa conocer más sobre los Paquetes Constructor ESP y cómo puedo empezar mi empresa digital con CreaTuActivo.com')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="cta-base cta-primary"
                style={{ padding: '1rem 2rem', fontSize: '1rem' }}
              >
                <MessageCircle className="h-5 w-5" />
                Quiero Ser Constructor
              </a>

              <button
                onClick={() => window.open('https://creatuactivo.com/servilleta', '_blank')}
                className="bg-[#0B0C0C] border border-[#E5C279]/30 text-[color:var(--color-text-primary)] px-8 py-4  font-bold text-lg hover:border-[#E5C279]/60 transition-all inline-flex items-center justify-center gap-3"
              >
                <Brain className="h-5 w-5" />
                Ver Presentación del Ecosistema
              </button>
            </div>
          </div>
        </section>

        {/* Sección FAQ - Quiet Luxury */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-[color:var(--color-text-primary)]">
              Preguntas Frecuentes sobre <span className="text-[color:var(--color-brand)]">Gano Café</span>
            </h2>
            <p className="text-[#A3A3A3] text-lg max-w-3xl mx-auto">
              Descubra todo sobre el Gano Café 3 en 1, beneficios del Ganoderma Lucidum y cómo tomarlo correctamente
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            {/* Pregunta 1 */}
            <details className="group bg-[#16181D]  border border-[#E5C279]/20 hover:border-[#E5C279]/40 transition-all overflow-hidden">
              <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                <h3 className="text-xl font-bold text-[color:var(--color-text-primary)] pr-4">
                  ¿Para qué sirve el Gano Café?
                </h3>
                <span className="text-[color:var(--color-brand)] text-2xl font-bold group-open:rotate-45 transition-transform">+</span>
              </summary>
              <div className="px-6 pb-6 text-[#A3A3A3] leading-relaxed">
                <p className="mb-4">
                  El <strong>Gano Café</strong> es un café enriquecido con <strong>Ganoderma Lucidum</strong> (Reishi), un hongo medicinal con más de 2,000 años de uso en la medicina tradicional china. El Gano Café sirve para:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Aumentar energía natural</strong>: Sin los efectos nerviosos del café común</li>
                  <li><strong>Fortalecer el sistema inmunológico</strong>: Gracias a los betaglucanos del Ganoderma</li>
                  <li><strong>Reducir estrés y fatiga</strong>: Propiedades adaptógenas que equilibran el cuerpo</li>
                  <li><strong>Mejorar concentración</strong>: Combinación de cafeína natural y nutrientes del hongo</li>
                  <li><strong>Apoyar la digestión</strong>: Con más de 200 fitonutrientes bioactivos</li>
                </ul>
                <p className="mt-4 text-[color:var(--color-brand)] font-medium">
                  💡 A diferencia del café tradicional, el Gano Café transforma su ritual diario en una inversión de salud.
                </p>
              </div>
            </details>

            {/* Pregunta 2 */}
            <details className="group bg-[#16181D]  border border-[#E5C279]/20 hover:border-[#E5C279]/40 transition-all overflow-hidden">
              <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                <h3 className="text-xl font-bold text-[color:var(--color-text-primary)] pr-4">
                  ¿Cuáles son los beneficios del Gano Café 3 en 1?
                </h3>
                <span className="text-[color:var(--color-brand)] text-2xl font-bold group-open:rotate-45 transition-transform">+</span>
              </summary>
              <div className="px-6 pb-6 text-[#A3A3A3] leading-relaxed">
                <p className="mb-4">
                  El <strong>Gano Café 3 en 1</strong> (café + crema + azúcar) de Gano Excel ofrece beneficios respaldados por el <strong>extracto natural de Ganoderma Lucidum</strong> que su cuerpo absorbe fácilmente:
                </p>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-[#0B0C0C] p-4  border border-[#E5C279]/20">
                    <h4 className="font-bold text-[color:var(--color-brand)] mb-2">🛡️ Sistema Inmunológico</h4>
                    <p className="text-sm">Fortalece defensas naturales con betaglucanos</p>
                  </div>
                  <div className="bg-[#0B0C0C] p-4  border border-[#E5C279]/20">
                    <h4 className="font-bold text-[color:var(--color-brand)] mb-2">⚡ Energía Sostenida</h4>
                    <p className="text-sm">Vitalidad sin nerviosismo ni caídas de energía</p>
                  </div>
                  <div className="bg-[#0B0C0C] p-4  border border-[#E5C279]/20">
                    <h4 className="font-bold text-[color:var(--color-brand)] mb-2">🧘 Reducción de Estrés</h4>
                    <p className="text-sm">Ayuda a manejar el estrés del día a día</p>
                  </div>
                  <div className="bg-[#0B0C0C] p-4  border border-[#E5C279]/20">
                    <h4 className="font-bold text-[color:var(--color-brand)] mb-2">🎯 Concentración</h4>
                    <p className="text-sm">Mejora claridad mental y enfoque</p>
                  </div>
                </div>
                <p className="text-sm text-[#A3A3A3] italic">
                  ✅ Registro INVIMA: SD2012-0002589 | Respaldado por 30+ años de investigación científica
                </p>
              </div>
            </details>

            {/* Pregunta 3 */}
            <details className="group bg-[#16181D]  border border-[#E5C279]/20 hover:border-[#E5C279]/40 transition-all overflow-hidden">
              <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                <h3 className="text-xl font-bold text-[color:var(--color-text-primary)] pr-4">
                  ¿Cuál es el precio del Gano Café en Colombia 2026?
                </h3>
                <span className="text-[color:var(--color-brand)] text-2xl font-bold group-open:rotate-45 transition-transform">+</span>
              </summary>
              <div className="px-6 pb-6 text-[#A3A3A3] leading-relaxed">
                <p className="mb-4">
                  Los <strong>precios oficiales de Gano Excel en Colombia</strong> para 2026 son:
                </p>
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between bg-[#0B0C0C] p-4  border border-[#E5C279]/30">
                    <div>
                      <p className="font-bold text-[color:var(--color-text-primary)]">Gano Café 3 en 1</p>
                      <p className="text-sm text-[#A3A3A3]">Caja con 20 sobres x 21g</p>
                    </div>
                    <p className="text-2xl font-bold text-[color:var(--color-brand)]">$110.900 COP</p>
                  </div>
                  <div className="flex items-center justify-between bg-[#0B0C0C] p-4  border border-[#E5C279]/20">
                    <div>
                      <p className="font-bold text-[color:var(--color-text-primary)]">Gano Café Clásico (Negro)</p>
                      <p className="text-sm text-[#A3A3A3]">Caja con 30 sobres x 4.5g</p>
                    </div>
                    <p className="text-2xl font-bold text-[color:var(--color-brand)]">$110.900 COP</p>
                  </div>
                </div>
                <div className="bg-[#0B0C0C] border border-[#E5C279]/30 p-4 ">
                  <p className="font-bold text-[color:var(--color-brand)] mb-2">💰 Precios de Distribuidor Mayorista</p>
                  <p className="text-sm text-[#A3A3A3]">
                    Como <strong>dueño de su sistema de distribución con CreaTuActivo</strong>, accede a precios mayoristas con descuento de hasta 35% sobre precio público.
                    <Link href="/" className="text-[color:var(--color-brand)] hover:text-[#F59E0B] font-medium ml-1 underline">Conozca CreaTuActivo →</Link>
                  </p>
                </div>
                <p className="text-sm text-[#A3A3A3] mt-4">
                  📦 <strong>Tarifas preferenciales de envío</strong>: Hasta 15 productos paga solo el envío mínimo. Fletes variables según ciudad y volumen.
                </p>
              </div>
            </details>

            {/* Pregunta 4 */}
            <details className="group bg-[#16181D]  border border-[#E5C279]/20 hover:border-[#E5C279]/40 transition-all overflow-hidden">
              <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                <h3 className="text-xl font-bold text-[color:var(--color-text-primary)] pr-4">
                  ¿Cómo se toma el Gano Café 3 en 1?
                </h3>
                <span className="text-[color:var(--color-brand)] text-2xl font-bold group-open:rotate-45 transition-transform">+</span>
              </summary>
              <div className="px-6 pb-6 text-[#A3A3A3] leading-relaxed">
                <p className="mb-4">
                  La forma correcta de preparar el <strong>Gano Café 3 en 1</strong> es:
                </p>
                <ol className="list-decimal pl-6 space-y-3 mb-4">
                  <li><strong>Vierta 1 sobre (21g)</strong> en su taza favorita</li>
                  <li><strong>Agregue 150ml de agua caliente</strong> (no hirviendo, aprox. 80-85°C)</li>
                  <li><strong>Revuelva bien</strong> hasta disolver completamente</li>
                  <li><strong>Disfrute inmediatamente</strong> para aprovechar todos los nutrientes</li>
                </ol>
                <div className="bg-[#0B0C0C] border border-[#E5C279]/30 p-4  mb-4">
                  <p className="font-bold text-[color:var(--color-brand)] mb-2">✅ Recomendaciones de Consumo</p>
                  <ul className="text-sm text-[#A3A3A3] space-y-1">
                    <li>• <strong>Mejor momento</strong>: Por la mañana o media tarde</li>
                    <li>• <strong>Frecuencia ideal</strong>: 1-2 tazas al día</li>
                    <li>• <strong>Antes o después de comidas</strong>: Ambos funcionan bien</li>
                    <li>• <strong>Puede tomarse frío</strong>: Prepare con agua fría y hielo en verano</li>
                  </ul>
                </div>
                <div className="bg-[#0B0C0C] border border-red-500/30 p-4 ">
                  <p className="font-bold text-[#C6A76B] mb-2">⚠️ Contraindicaciones</p>
                  <p className="text-sm text-[#A3A3A3]">
                    No recomendado para mujeres embarazadas o en lactancia. Si toma anticoagulantes o tiene condiciones médicas especiales, consulte a su médico antes de consumir.
                  </p>
                </div>
              </div>
            </details>

            {/* Pregunta 5 */}
            <details className="group bg-[#16181D]  border border-[#E5C279]/20 hover:border-[#E5C279]/40 transition-all overflow-hidden">
              <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                <h3 className="text-xl font-bold text-[color:var(--color-text-primary)] pr-4">
                  ¿El Gano Café está disponible en toda Latinoamérica?
                </h3>
                <span className="text-[color:var(--color-brand)] text-2xl font-bold group-open:rotate-45 transition-transform">+</span>
              </summary>
              <div className="px-6 pb-6 text-[#A3A3A3] leading-relaxed">
                <p className="mb-4">
                  Sí, <strong>Gano Excel</strong> distribuye sus productos, incluyendo el Gano Café, en <strong>16 países de América</strong>:
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                  <div className="bg-[#0B0C0C] p-3  text-center border border-[#E5C279]/30">
                    <p className="font-medium text-[color:var(--color-text-primary)]">🇨🇴 Colombia</p>
                  </div>
                  <div className="bg-[#0B0C0C] p-3  text-center border border-[#E5C279]/30">
                    <p className="font-medium text-[color:var(--color-text-primary)]">🇲🇽 México</p>
                  </div>
                  <div className="bg-[#0B0C0C] p-3  text-center border border-[#E5C279]/30">
                    <p className="font-medium text-[color:var(--color-text-primary)]">🇵🇪 Perú</p>
                  </div>
                  <div className="bg-[#0B0C0C] p-3  text-center border border-[#E5C279]/30">
                    <p className="font-medium text-[color:var(--color-text-primary)]">🇪🇨 Ecuador</p>
                  </div>
                  <div className="bg-[#0B0C0C] p-3  text-center border border-[#E5C279]/30">
                    <p className="font-medium text-[color:var(--color-text-primary)]">🇨🇱 Chile</p>
                  </div>
                  <div className="bg-[#0B0C0C] p-3  text-center border border-[#E5C279]/30">
                    <p className="font-medium text-[color:var(--color-text-primary)]">🇦🇷 Argentina</p>
                  </div>
                </div>
                <div className="bg-[#0B0C0C] border border-[#E5C279]/30 p-4 ">
                  <p className="font-bold text-[color:var(--color-brand)] mb-2">🤖 Consulta con Queswa IA</p>
                  <p className="text-sm text-[#A3A3A3] mb-3">
                    Nuestro asistente de IA conversacional puede ayudarle a encontrar distribuidores en su país,
                    calcular envíos internacionales y recomendarle los productos ideales para su perfil.
                  </p>
                  <button
                    type="button"
                    onClick={() => window.dispatchEvent(new CustomEvent('open-queswa'))}
                    className="cta-base cta-secondary"
                    style={{ fontSize: '0.875rem' }}
                  >
                    <Bot className="h-4 w-4" />
                    <span>Hablar con su asesor de bienestar →</span>
                  </button>
                </div>
              </div>
            </details>

            {/* Pregunta 6 - Bonus - Quiet Luxury */}
            <details className="group bg-[#16181D]  border-2 border-[#E5C279]/40 hover:border-[#E5C279]/70 transition-all overflow-hidden">
              <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                <h3 className="text-xl font-bold text-[color:var(--color-brand)] pr-4">
                  🚀 ¿Cómo puedo comprar Gano Café y otros productos al mayorista?
                </h3>
                <span className="text-[color:var(--color-brand)] text-2xl font-bold group-open:rotate-45 transition-transform">+</span>
              </summary>
              <div className="px-6 pb-6 text-[#A3A3A3] leading-relaxed">
                <p className="mb-4">
                  Con <strong className="text-[color:var(--color-brand)]">CreaTuActivo</strong>, no solo compra productos premium al <strong className="text-[color:var(--color-text-primary)]">precio de distribuidor mayorista</strong>
                  (35% de descuento), también accede a un <strong className="text-[color:var(--color-text-primary)]">ecosistema completo</strong>:
                </p>
                <div className="space-y-3 mb-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-[#C5A059]  flex items-center justify-center text-[#0F1115] font-bold flex-shrink-0">1</div>
                    <div>
                      <p className="font-bold text-[color:var(--color-text-primary)]">Aplicación CreaTuActivo + Queswa IA</p>
                      <p className="text-sm text-[#A3A3A3]">Sistema automatizado para que su sistema de distribución trabaje 24/7</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-[#C5A059]  flex items-center justify-center text-[#0F1115] font-bold flex-shrink-0">2</div>
                    <div>
                      <p className="font-bold text-[color:var(--color-text-primary)]">Mentoría Personalizada 1:150</p>
                      <p className="text-sm text-[#A3A3A3]">Como dueño de su sistema de distribución, recibe mentoría directa y construye su red de clientes y socios</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-[#C5A059]  flex items-center justify-center text-[#0F1115] font-bold flex-shrink-0">3</div>
                    <div>
                      <p className="font-bold text-[color:var(--color-text-primary)]">Ingresos Recurrentes</p>
                      <p className="text-sm text-[#A3A3A3]">Gana ingresos por sus ventas y por las de su organización</p>
                    </div>
                  </div>
                </div>
                <div className="bg-[#0B0C0C] border border-[#E5C279]/30 p-6 ">
                  <p className="text-xl font-bold text-[color:var(--color-brand)] mb-2">🎯 Solo 150 Cupos Disponibles</p>
                  <p className="mb-4 text-[#A3A3A3]">Acceso por tiempo limitado</p>
                  <a
                    href="/"
                    className="cta-base cta-primary"
                    style={{ padding: '0.875rem 2rem', fontSize: '0.95rem' }}
                  >
                    Sea dueño de su comercio electrónico →
                  </a>
                </div>
              </div>
            </details>
          </div>

          {/* CTA Final después del FAQ - Quiet Luxury */}
          <div className="mt-12 text-center bg-[#16181D] border border-[#E5C279]/30  p-8">
            <h3 className="text-2xl md:text-3xl font-serif font-bold mb-4 text-[color:var(--color-text-primary)]">
              ¿Listo para probar el <span className="text-[color:var(--color-brand)]">Gano Café</span>?
            </h3>
            <p className="text-lg mb-6 text-[#A3A3A3]">
              Hable con <strong className="text-[color:var(--color-brand)]">Queswa</strong>, su asesor de bienestar, y descubra qué productos son ideales para usted
            </p>
            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent('open-queswa'))}
              className="cta-base cta-primary"
              style={{ padding: '1rem 2rem', fontSize: '1rem' }}
            >
              <Bot className="h-5 w-5" />
              <span>Hablar con su asesor de bienestar →</span>
            </button>
          </div>
        </section>
      </div>

      {/* Modal de Sistema de Bienestar Seleccionado */}
      {selectedSystem && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={(e) => handleOverlayClick(e, () => setSelectedSystem(null))}
        >
          <div className="w-full max-w-5xl bg-[#18181b]/95 backdrop-blur-xl border border-[#3f3f46]  shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-[#3f3f46]">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-transparent border border-[#52525b] flex items-center justify-center text-[#a1a1aa]">
                  {sistemasDebienestar[selectedSystem].icono}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-[color:var(--color-text-primary)]">{sistemasDebienestar[selectedSystem].nombre}</h2>
                  <p className="text-[#A3A3A3]">{sistemasDebienestar[selectedSystem].descripcion}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedSystem(null)}
                aria-label="Cerrar detalle del sistema de bienestar"
                className="p-2 text-[#A3A3A3] hover:text-[color:var(--color-text-primary)] transition-colors  hover:bg-[#0B0C0C]"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {getProductsBySystem(selectedSystem).map((product) => (
                  <div key={product.id} className="bg-[#18181b]  p-4 border border-[#3f3f46]">
                    <div className="flex items-start space-x-4">
                      <Image
                        src={product.image}
                        alt={`${product.name} - Carrito`}
                        width={96}
                        height={96}
                        className="w-24 h-24 object-contain  bg-[#0A0A0E] p-2"
                      />
                      <div className="flex-1">
                        <h3 className="font-bold text-[color:var(--color-text-primary)] mb-1">{product.name}</h3>
                        <p className="text-[#90A4AE] text-xs italic mb-2">"{product.taglineEstrategico}"</p>
                        <p className="text-[#A3A3A3] text-sm mb-3">{product.shortDescription}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-[color:var(--color-brand)]">${product.price.toLocaleString()}</span>
                          <button
                            onClick={() => {
                              addToCart(product.id)
                              setSelectedSystem(null)
                            }}
                            style={{ background: '#60ABAE', color: '#000' }}
                            className="px-4 py-2 text-sm font-medium hover:brightness-110 transition-all"
                          >
                            Agregar
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 text-center">
                <button
                  onClick={() => {
                    // Agregar todos los productos del sistema al carrito
                    sistemasDebienestar[selectedSystem].productos.forEach(id => addToCart(id))
                    setSelectedSystem(null)
                  }}
                  style={{ background: '#60ABAE', color: '#000' }}
                  className="px-8 py-4 font-bold text-lg shadow-xl hover:brightness-110 transition-all"
                >
                  Agregar Sistema Completo al Carrito
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de producto mejorado con tabs */}
      {selectedProduct && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={(e) => handleOverlayClick(e, () => setSelectedProduct(null))}
        >
          <div
            style={{
              background: 'var(--color-bg-surface)',
              backdropFilter: 'blur(16px)',
              border: '1px solid #3f3f46',
              padding: '1.5rem',
              maxWidth: '80rem',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold" style={{ color: C.textMain }}>{selectedProduct.name}</h2>
                <p className="font-medium italic mt-1" style={{ color: C.bioEmerald }}>"{selectedProduct.taglineEstrategico}"</p>
              </div>
              <button
                onClick={() => setSelectedProduct(null)}
                aria-label="Cerrar detalle del producto"
                style={{
                  padding: '0.5rem',
                  color: C.textMuted,
                  background: C.obsidian,
                }}
                className="transition-colors hover:scale-110"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <div
                  style={{
                    background: C.obsidian,
                    padding: '1.5rem',
                    marginBottom: '1.5rem',
                  }}
                >
                  <Image
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    width={600}
                    height={400}
                    className="w-full h-[400px] object-contain"
                  />
                </div>
                <div className="text-center">
                  <span className="text-3xl font-bold" style={{ color: C.bioEmerald }}>${selectedProduct.price.toLocaleString()}</span>
                  <p className="text-sm mt-1" style={{ color: C.textMuted }}>{selectedProduct.presentacion} · {selectedProduct.categoria}</p>
                </div>
              </div>

              <div className="space-y-6">
                {/* Tabs de navegación */}
                <div
                  style={{
                    display: 'flex',
                    gap: '0.5rem',
                    borderBottom: `1px solid ${C.bioEmerald}30`,
                  }}
                >
                  <button
                    onClick={() => setActiveTab('beneficios')}
                    style={{
                      padding: '0.5rem 1rem',
                      fontWeight: 500,
                      color: activeTab === 'beneficios' ? C.bioEmerald : C.textMuted,
                      borderBottom: activeTab === 'beneficios' ? `2px solid ${C.bioEmerald}` : 'none',
                    }}
                    className="transition-all"
                  >
                    Lo que es
                  </button>
                  <button
                    onClick={() => setActiveTab('ciencia')}
                    style={{
                      padding: '0.5rem 1rem',
                      fontWeight: 500,
                      color: activeTab === 'ciencia' ? C.bioEmerald : C.textMuted,
                      borderBottom: activeTab === 'ciencia' ? `2px solid ${C.bioEmerald}` : 'none',
                    }}
                    className="transition-all"
                  >
                    Qué lleva
                  </button>
                  <button
                    onClick={() => setActiveTab('constructor')}
                    style={{
                      padding: '0.5rem 1rem',
                      fontWeight: 500,
                      color: activeTab === 'constructor' ? C.bioEmerald : C.textMuted,
                      borderBottom: activeTab === 'constructor' ? `2px solid ${C.bioEmerald}` : 'none',
                    }}
                    className="transition-all"
                  >
                    Cómo se usa
                  </button>
                </div>

                {/* Contenido de tabs */}
                <div>
                  {activeTab === 'beneficios' && (
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-bold mb-3" style={{ color: C.textMain }}>Beneficios Clave</h3>
                        <ul className="space-y-2">
                          {selectedProduct.benefits.map((benefit, index) => (
                            <li key={index} className="flex items-start">
                              <span className="mr-2" style={{ color: C.bioEmerald }}>✓</span>
                              <span style={{ color: C.textMuted }}>{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h3 className="text-lg font-bold mb-3" style={{ color: C.textMain }}>Perfil Ideal</h3>
                        <p
                          style={{
                            color: C.textMuted,
                            background: C.obsidian,
                            padding: '0.75rem',
                          }}
                        >
                          {selectedProduct.perfilIdeal}
                        </p>
                      </div>

                      <div>
                        <h3 className="text-lg font-bold mb-3" style={{ color: C.textMain }}>Momento de Consumo</h3>
                        <p style={{ color: C.textMuted }}>{selectedProduct.momentoConsumo}</p>
                      </div>
                    </div>
                  )}

                  {activeTab === 'ciencia' && (
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-bold mb-3" style={{ color: C.textMain }}>Qué lleva</h3>
                        <p className="text-sm mb-3" style={{ color: C.textDim, fontFamily: "var(--font-mono)" }}>
                          {selectedProduct.presentacion} · {selectedProduct.categoria} · {selectedProduct.invima.startsWith('Certificado') ? selectedProduct.invima : `Registro ${selectedProduct.invima}`}
                        </p>
                        <ul className="space-y-1">
                          {selectedProduct.ingredients.map((ingredient, index) => (
                            <li key={index} className="flex items-start">
                              <span className="mr-2" style={{ color: C.bioEmerald }}>•</span>
                              <span style={{ color: C.textMuted }}>{ingredient}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div
                        style={{
                          background: C.obsidian,
                          padding: '1rem',
                          border: '1px solid #3f3f46',
                        }}
                      >
                        {/* El bloque del extracto va solo en los productos que lo llevan:
                            antes salía igual en el Cordygold (Cordyceps) y en la máquina
                            Luvoco, y reclamaba exclusividad sobre la tecnología (9 sep 2026). */}
                        {selectedProduct.llevaGanoderma ? (
                          <>
                            <h4 className="font-bold mb-2" style={{ color: C.bioEmerald }}>El extracto de Ganoderma de Gano Excel</h4>
                            <p className="text-sm" style={{ color: C.textMuted }}>
                              Lleva el extracto de Ganoderma lucidum de Gano Excel: un híbrido de las seis variedades del hongo,
                              los seis colores del Reishi, extraído con un proceso propio de la empresa. Es 100% hidrosoluble:
                              se disuelve por completo, sin dejar residuo. En el hongo hay dos familias de compuestos, los
                              polisacáridos, entre ellos los betaglucanos, y los triterpenos, con más de doscientas variantes
                              identificadas. Es el hongo más estudiado, con tradición milenaria en Asia, y como parte de la
                              rutina apoya el funcionamiento normal de las defensas.
                            </p>
                          </>
                        ) : (
                          <>
                            <h4 className="font-bold mb-2" style={{ color: C.bioEmerald }}>Sin extracto de Ganoderma</h4>
                            <p className="text-sm" style={{ color: C.textMuted }}>
                              {selectedProduct.categoria.startsWith('Dispositivo')
                                ? 'Es la máquina: el Ganoderma va en las cápsulas Luvoco, que son las que se preparan en ella.'
                                : 'Este es el único producto de la línea que no gira alrededor del Ganoderma: su ingrediente es el Cordyceps sinensis, con la concentración más alta del portafolio.'}
                            </p>
                          </>
                        )}
                      </div>

                      <div>
                        <h3 className="text-lg font-bold mb-3" style={{ color: C.textMain }}>Modo de Uso</h3>
                        <p
                          style={{
                            color: C.textMuted,
                            background: C.obsidian,
                            padding: '0.75rem',
                          }}
                        >
                          {selectedProduct.usage}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm" style={{ color: C.textMuted }}>
                          <strong>{selectedProduct.invima.startsWith('Certificado') ? 'Certificación:' : 'Registro INVIMA:'}</strong> {selectedProduct.invima.replace(/^Certificado /, '')}
                        </p>
                      </div>
                    </div>
                  )}

                  {activeTab === 'constructor' && (
                    <div className="space-y-4">
                      <div
                        style={{
                          background: C.obsidian,
                          padding: '1rem',
                          border: '1px solid #3f3f46',
                        }}
                      >
                        <h4 className="font-bold mb-3" style={{ color: C.bioEmerald }}>Cómo se usa</h4>
                        <ul className="space-y-2">
                          {selectedProduct.ritual.map((punto, index) => (
                            <li key={index} className="flex items-start">
                              <span className="mr-2" style={{ color: C.bioEmerald }}>•</span>
                              <span className="text-sm" style={{ color: C.textMuted }}>{punto}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {selectedProduct.combinacionSugerida && (
                        <div>
                          <h3 className="text-lg font-bold text-[color:var(--color-text-primary)] mb-3">Combina bien con</h3>
                          <p className="text-[#A3A3A3] text-sm mb-3">Los que suelen ir juntos en la misma rutina:</p>
                          <div className="flex flex-wrap gap-2">
                            {selectedProduct.combinacionSugerida.map((productoId) => (
                              <span key={productoId} className="bg-[#C5A059]/20 text-[#C5A059] px-3 py-1  text-sm">
                                {productData[productoId]?.name || productoId}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="bg-[#0B0C0C] p-4  border border-[#E5C279]/30">
                        <h4 className="font-bold text-[color:var(--color-brand)] mb-2">Para quién es</h4>
                        <p className="text-[#A3A3A3] text-sm">
                          {selectedProduct.perfilIdeal}. {selectedProduct.momentoConsumo}.
                        </p>
                      </div>

                      {selectedProduct.sistemaRecomendado && (
                        <div>
                          <h3 className="text-lg font-bold text-[color:var(--color-text-primary)] mb-3">Sistema Recomendado</h3>
                          <button
                            onClick={() => {
                              setSelectedProduct(null)
                              setSelectedSystem(selectedProduct.sistemaRecomendado!)
                            }}
                            className="w-full bg-[#0B0C0C] border border-[#E5C279]/40 p-4  hover:border-[#E5C279]/70 transition-all text-left"
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-semibold text-[color:var(--color-brand)]">
                                  {sistemasDebienestar[selectedProduct.sistemaRecomendado].nombre}
                                </p>
                                <p className="text-[#A3A3A3] text-sm">
                                  {sistemasDebienestar[selectedProduct.sistemaRecomendado].descripcion}
                                </p>
                              </div>
                              <Rocket className="h-6 w-6 text-[color:var(--color-brand)]" />
                            </div>
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="pt-4 space-y-3">
                  <button
                    onClick={() => {
                      const productId = Object.entries(productData).find(([_, product]) => product === selectedProduct)?.[0]
                      if (productId) addToCart(productId)
                      setSelectedProduct(null)
                    }}
                    className="cta-base cta-primary w-full"
                    style={{ padding: '1rem 2rem', fontSize: '0.95rem' }}
                  >
                    Agregar al Sistema de Bienestar
                  </button>

                  {selectedProduct.downloadUrl && (
                    <a
                      href={selectedProduct.downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cta-base cta-secondary w-full"
                      style={{ padding: '0.875rem 2rem', fontSize: '0.95rem' }}
                    >
                      <Download className="h-5 w-5 mr-2" />
                      Descargar Guía del Producto (PDF)
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </>
  )
}
