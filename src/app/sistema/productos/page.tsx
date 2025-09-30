'use client'

import { useState, useEffect, useRef } from 'react'
import { ShoppingCart, X, Heart, Sparkles, Waves, Trophy, Send, Bot, Star, Zap, TrendingUp, Gift, Download, Coffee, Pill, Target, MessageCircle, Shield, Brain, Users, Rocket } from 'lucide-react'

// Interfaces mejoradas con campos estratégicos
interface Product {
  name: string
  price: number
  image: string
  invima: string
  goals: string[]
  shortDescription: string
  taglineEstrategico: string
  usage: string
  ingredients: string[]
  benefits: string[]
  perfilIdeal: string
  momentoConsumo: string
  puntosConversacion: string[]
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
    nombre: 'Sistema de Energía y Enfoque Diario',
    descripcion: 'Para profesionales que buscan rendimiento óptimo sin sacrificar su salud',
    productos: ['ganocafe-3-en-1', 'ganocafe-clasico', 'capsulas-excellium'],
    icono: <Zap className="h-6 w-6" />,
    color: 'from-yellow-500 to-orange-500'
  },
  'familiar-nutricion': {
    nombre: 'Sistema de Bienestar Familiar',
    descripcion: 'Alternativas saludables que toda la familia disfrutará',
    productos: ['ganorico-shoko-rico', 'espirulina-gano-creal', 'pasta-dientes-gano-fresh', 'ganorico-latte-rico'],
    icono: <Users className="h-6 w-6" />,
    color: 'from-green-500 to-emerald-500'
  },
  'rendimiento-avanzado': {
    nombre: 'Sistema de Rendimiento y Recuperación',
    descripcion: 'Para atletas y personas con estilo de vida activo',
    productos: ['capsulas-cordygold', 'capsulas-ganoderma', 'espirulina-gano-creal'],
    icono: <Target className="h-6 w-6" />,
    color: 'from-red-500 to-pink-500'
  },
  'belleza-holistica': {
    nombre: 'Sistema de Belleza Integral',
    descripcion: 'Cuidado profundo desde adentro hacia afuera',
    productos: ['bebida-colageno-reskine', 'jabon-gano', 'jabon-transparente-gano', 'exfoliante-piel-brillo'],
    icono: <Sparkles className="h-6 w-6" />,
    color: 'from-purple-500 to-pink-500'
  },
  'experiencia-premium': {
    nombre: 'Experiencia Barista Premium Luvoco',
    descripcion: 'La élite del café con tecnología patentada de 15 bares',
    productos: ['maquina-luvoco', 'luvoco-suave', 'luvoco-medio', 'luvoco-fuerte'],
    icono: <Coffee className="h-6 w-6" />,
    color: 'from-slate-700 to-slate-900'
  }
}

// Datos de productos completos con campos estratégicos
const productData: ProductData = {
  'ganocafe-3-en-1': {
    name: 'GANOCAFÉ 3 EN 1',
    price: 110900,
    image: '/productos/bebidas/ganocafe-3-en-1-gano-excel-min.png',
    invima: 'SD2012-0002589',
    goals: ['Energía', 'Defensas', 'Digestivo'],
    shortDescription: 'Una deliciosa mezcla de café premium con Ganoderma Lucidum, cremoso y azúcar',
    taglineEstrategico: 'El hábito diario que construye tu activo',
    usage: 'Mezcla 1 sobre (21g) en 150ml de agua caliente',
    ingredients: ['Extracto de Ganoderma Lucidum', 'Café soluble premium', 'Cremora vegetal', 'Azúcar'],
    benefits: ['Aporta energía y vitalidad para tu día', 'Apoya las defensas naturales del cuerpo', 'Contribuye a la reducción del estrés y la fatiga', 'Promueve un estado de ánimo positivo', 'Disfruta de un delicioso y nutritivo sabor cremoso'],
    perfilIdeal: 'Personas que valoran su salud y buscan energía sostenida para su día',
    momentoConsumo: 'Ideal para comenzar la mañana o media tarde cuando necesitas un impulso',
    puntosConversacion: [
      'Perfecto para profesionales que quieren mantener su ritual de café mientras construyen su negocio',
      'El producto más vendido: no cambia hábitos, los mejora con 200+ fitonutrientes',
      'Cada taza es una inversión en salud y una herramienta de networking'
    ],
    combinacionSugerida: ['capsulas-excellium', 'pasta-dientes-gano-fresh'],
    sistemaRecomendado: 'energia-enfoque'
  },
  'ganocafe-clasico': {
    name: 'GANOCAFÉ CLÁSICO',
    price: 110900,
    image: '/productos/bebidas/gano-cafe-clasico-gano-excel-min.png',
    invima: 'SD2013-0002947',
    goals: ['Energía', 'Concentración', 'Defensas'],
    shortDescription: 'Para los amantes del café puro, esta fórmula combina café negro de alta calidad con extracto de Ganoderma',
    taglineEstrategico: 'Café negro potenciado con inteligencia nutricional',
    usage: 'Mezcla 1 sobre (4.5g) en 150ml de agua caliente',
    ingredients: ['Extracto de Ganoderma Lucidum', 'Café soluble 100% puro', 'Sabor natural a café'],
    benefits: ['Ideal para los amantes del café negro (tinto)', 'Potenciado con nutrientes para apoyar tu salud', 'Perfecto para iniciar el día con enfoque y claridad', 'Contribuye a la protección antioxidante del cuerpo', 'Apoya un metabolismo saludable'],
    perfilIdeal: 'Puristas del café que valoran la salud sin comprometer el sabor auténtico',
    momentoConsumo: 'Perfecto para la mañana o durante reuniones importantes',
    puntosConversacion: [
      'Para clientes sofisticados que prefieren el café negro sin aditivos',
      'Demuestra conocimiento: mismo sabor intenso, beneficios superiores',
      'Ideal para reuniones de negocios: proyecta imagen de salud consciente'
    ],
    combinacionSugerida: ['capsulas-ganoderma'],
    sistemaRecomendado: 'energia-enfoque'
  },
  'ganorico-latte-rico': {
    name: 'GANORICO LATTE RICO',
    price: 119900,
    image: '/productos/bebidas/latte-rico-gano-excel-min.png',
    invima: 'NSA-0012966-2022',
    goals: ['Energía', 'Relajación', 'Digestivo'],
    shortDescription: 'Una experiencia de latte premium con textura cremosa y espumosa',
    taglineEstrategico: 'El latte que transforma pausas en oportunidades',
    usage: 'Disuelve 1 sobre (25g) en 180ml de agua caliente',
    ingredients: ['Extracto de Ganoderma Lucidum', 'Café premium', 'Leche en polvo', 'Cremora natural'],
    benefits: ['Disfruta de una experiencia de café latte premium', 'Textura espumosa y cremosa que deleita tus sentidos', 'Un gusto enriquecido para tu bienestar', 'Contribuye a un sistema digestivo saludable', 'Aporta una sensación de confort y relajación', 'Sin endulzante'],
    perfilIdeal: 'Amantes del café con leche que buscan una experiencia gourmet saludable',
    momentoConsumo: 'Perfecto para media mañana o como postre después del almuerzo',
    puntosConversacion: [
      'Experiencia de cafetería premium en casa u oficina',
      'Sin azúcar añadida: ideal para clientes conscientes de su salud',
      'Perfecto para introducir el concepto de "café funcional" a nuevos clientes'
    ],
    combinacionSugerida: ['ganorico-mocha-rico', 'bebida-colageno-reskine'],
    sistemaRecomendado: 'familiar-nutricion'
  },
  'ganorico-mocha-rico': {
    name: 'GANORICO MOCHA RICO',
    price: 119900,
    image: '/productos/bebidas/mocha-rico-gano-excel-min.png',
    invima: 'NSA-0012965-2022',
    goals: ['Energía', 'Relajación', 'Defensas'],
    shortDescription: 'La combinación perfecta de café y chocolate enriquecida con Ganoderma',
    taglineEstrategico: 'Donde el placer del chocolate se encuentra con el poder del Ganoderma',
    usage: 'Mezcla 1 sobre (25g) en 180ml de agua caliente',
    ingredients: ['Extracto de Ganoderma Lucidum', 'Café premium', 'Cacao natural', 'Leche en polvo', 'Azúcar de caña'],
    benefits: ['La combinación perfecta de café y cacao saludable', 'Un sabor indulgente que apoya tu bienestar', 'Con betaglucanos para apoyar tus defensas', 'Promueve la sensación de saciedad', 'Ideal para recargar energías a media tarde', 'Sin endulzante'],
    perfilIdeal: 'Personas que buscan una alternativa saludable a las bebidas azucaradas',
    momentoConsumo: 'Ideal como merienda o cuando necesitas un momento de indulgencia',
    puntosConversacion: [
      'Reemplaza antojos poco saludables con nutrición inteligente',
      'Perfecto para madres: alternativa nutritiva que los niños disfrutan',
      'Producto puente: fácil entrada para quienes no toman café regularmente'
    ],
    combinacionSugerida: ['ganorico-shoko-rico', 'espirulina-gano-creal'],
    sistemaRecomendado: 'familiar-nutricion'
  },
  'ganorico-shoko-rico': {
    name: 'GANORICO SHOKO RICO',
    price: 124900,
    image: '/productos/bebidas/shoko-rico-gano-excel-min.png',
    invima: 'NSA-0012964-2022',
    goals: ['Energía', 'Relajación', 'Defensas'],
    shortDescription: 'Chocolate caliente nutritivo enriquecido con Ganoderma',
    taglineEstrategico: 'El chocolate que nutre mientras deleita',
    usage: 'Disuelve 1 sobre (25g) en 180ml de agua caliente o leche',
    ingredients: ['Extracto de Ganoderma Lucidum', 'Cacao premium', 'Leche en polvo', 'Azúcar natural', 'Saborizante de chocolate'],
    benefits: ['Chocolate nutritivo y delicioso para toda la familia', 'Bebida reconfortante para momentos de relajación', 'Apoya el bienestar general de forma placentera', 'Contribuye al desarrollo de huesos fuertes', 'Una opción inteligente para antojos de dulce', 'Sin endulzante'],
    perfilIdeal: 'Familias que buscan opciones nutritivas que los niños disfruten',
    momentoConsumo: 'Perfecto para las noches, meriendas o momentos familiares',
    puntosConversacion: [
      'Producto estrella para familias: todos lo disfrutan, todos se benefician',
      'Reemplaza chocolates comerciales con nutrición real',
      'Abre puertas en hogares: los niños lo piden, los padres lo valoran'
    ],
    combinacionSugerida: ['espirulina-gano-creal', 'pasta-dientes-gano-fresh'],
    sistemaRecomendado: 'familiar-nutricion'
  },
  'espirulina-gano-creal': {
    name: 'ESPIRULINA GANO C\'REAL',
    price: 119900,
    image: '/productos/bebidas/ganocereal-spirulina-min.png',
    invima: 'NSA-0012963-2022',
    goals: ['Energía', 'Digestivo', 'Defensas'],
    shortDescription: 'Un cereal nutritivo que combina Spirulina y Ganoderma',
    taglineEstrategico: 'El desayuno que alimenta tu cuerpo y tu negocio',
    usage: 'Mezcla 2 cucharadas (30g) con leche, yogur o agua',
    ingredients: ['Extracto de Ganoderma Lucidum', 'Spirulina orgánica', 'Cereales integrales', 'Fibra natural', 'Vitaminas y minerales'],
    benefits: ['Alto contenido de fibra para la salud digestiva', 'Excelente fuente de proteína vegetal', 'Promueve una nutrición completa y balanceada', 'Rico en vitaminas y minerales esenciales', 'Apoya la desintoxicación natural del organismo'],
    perfilIdeal: 'Deportistas y personas conscientes de su nutrición',
    momentoConsumo: 'Ideal para desayunos nutritivos o post-entrenamiento',
    puntosConversacion: [
      'Superalimento completo: proteína, fibra y 200+ nutrientes',
      'Perfecto para veganos y vegetarianos: proteína vegetal completa',
      'Producto diferenciador: único cereal con Spirulina y Ganoderma'
    ],
    combinacionSugerida: ['ganocafe-3-en-1', 'capsulas-cordygold'],
    sistemaRecomendado: 'rendimiento-avanzado'
  },
  'bebida-oleaf-gano-rooibos': {
    name: 'BEBIDA DE OLEAF GANO ROOIBOS',
    price: 119900,
    image: '/productos/bebidas/te-rooibos-gano-excel-min.png',
    invima: 'NSA-0012962-2022',
    goals: ['Relajación', 'Defensas', 'Digestivo'],
    shortDescription: 'Té rooibos sudafricano naturalmente libre de cafeína, enriquecido con Ganoderma',
    taglineEstrategico: 'La calma productiva en cada sorbo',
    usage: 'Disuelve 1 sobre en agua caliente y deja reposar 3-5 minutos',
    ingredients: ['Extracto de Ganoderma Lucidum', 'Té Rooibos orgánico', 'Antioxidantes naturales', 'Sabor natural'],
    benefits: ['Bebida relajante para un descanso reparador', 'Naturalmente libre de cafeína', 'Rico en antioxidantes que combaten el estrés oxidativo', 'Apoya la salud del sistema nervioso', 'Contribuye a una correcta hidratación'],
    perfilIdeal: 'Personas que buscan relajación sin somnolencia',
    momentoConsumo: 'Perfecto para las tardes o antes de dormir',
    puntosConversacion: [
      'Ideal para clientes que no consumen cafeína',
      'Perfecto para embarazadas y personas con restricciones',
      'Producto versátil: se puede tomar frío o caliente'
    ],
    combinacionSugerida: ['capsulas-ganoderma', 'jabon-gano'],
    sistemaRecomendado: 'belleza-holistica'
  },
  'gano-schokoladde': {
    name: 'Gano Schokoladde',
    price: 124900,
    image: '/productos/bebidas/gano-schokolade-gano-excel-min.png',
    invima: 'NSA-0012961-2022',
    goals: ['Energía', 'Concentración', 'Defensas', 'Relajación'],
    shortDescription: 'Bebida de chocolate SUIZO con extracto puro de Ganoderma',
    taglineEstrategico: 'Chocolate suizo elevado con ciencia oriental',
    usage: 'Disuelve 1 sobre en agua caliente',
    ingredients: ['Extracto concentrado de Ganoderma Lucidum', 'Cacao puro', 'Azúcar'],
    benefits: ['Ofrece apoyo nutricional con delicioso sabor', 'Fórmula concentrada con extracto de Ganoderma', 'Ayuda a mejorar la circulación y salud cardiovascular', 'Contribuye a un estado de ánimo equilibrado', 'Fácil y rápido de preparar'],
    perfilIdeal: 'Conocedores del chocolate que valoran la calidad premium',
    momentoConsumo: 'Cualquier momento que requiera un toque de lujo y nutrición',
    puntosConversacion: [
      'Producto premium: chocolate suizo con tecnología patentada',
      'Perfecto para clientes de alto poder adquisitivo',
      'Regalo corporativo ideal: sofisticación y salud'
    ],
    combinacionSugerida: ['luvoco', 'bebida-colageno-reskine'],
    sistemaRecomendado: 'experiencia-premium'
  },

  'bebida-colageno-reskine': {
    name: 'BEBIDA DE COLÁGENO RESKINE',
    price: 216900,
    image: '/productos/bebidas/gano-plus-reskine-collagen-drink-gano-excel-min.png',
    invima: 'NSA-0012959-2022',
    goals: ['Belleza'],
    shortDescription: 'Bebida revolucionaria que combina colágeno marino con Ganoderma',
    taglineEstrategico: 'La inversión más inteligente en tu apariencia',
    usage: 'Disuelve 1 sobre en agua fría o al tiempo',
    ingredients: ['Colágeno marino', 'Gano Plus', 'Vitamina C', 'Sabor natural a frutas'],
    benefits: ['Apoya la elasticidad y firmeza de la piel', 'Fortalece el cabello y las uñas', 'Contribuye a una apariencia más juvenil', 'Ayuda a mantener la salud de articulaciones', 'Fórmula única con Colágeno y Gano Plus'],
    perfilIdeal: 'Personas que buscan resultados anti-edad sin procedimientos invasivos',
    momentoConsumo: 'Tomar diariamente en ayunas para máxima efectividad',
    puntosConversacion: [
      'Producto estrella: alto margen y alta demanda en el segmento belleza',
      'Genera clientes recurrentes: los resultados crean dependencia positiva',
      'Competencia directa con tratamientos estéticos costosos'
    ],
    combinacionSugerida: ['bebida-colageno-reskine', 'exfoliante-piel-brillo'],
    sistemaRecomendado: 'belleza-holistica'
  },
  'capsulas-ganoderma': {
    name: 'Cápsulas de Ganoderma',
    price: 272500,
    image: '/productos/suplementos/capsulas-de-ganoderma-gano-excel-min.png',
    invima: 'SD2013-0002860',
    goals: ['Defensas', 'Energía', 'Relajación'],
    shortDescription: 'Extracto concentrado de Ganoderma Lucidum en cápsulas',
    taglineEstrategico: 'La esencia pura del Rey de las Hierbas',
    usage: 'Tomar 2 cápsulas al día con agua',
    ingredients: ['Extracto concentrado de Ganoderma Lucidum', 'Cápsula vegetal', 'Betaglucanos', 'Triterpenos', 'Polisacáridos'],
    benefits: ['Fortalece las defensas naturales del cuerpo', 'Potente acción antioxidante que protege las células', 'Promueve el bienestar general y el equilibrio', 'Apoya la salud del sistema circulatorio', 'Actúa como un adaptógeno natural'],
    perfilIdeal: 'Personas que buscan máxima potencia en suplementación',
    momentoConsumo: 'Tomar con el desayuno y la cena para absorción óptima',
    puntosConversacion: [
      'Producto insignia: demuestra la seriedad de la patente mundial',
      'Para clientes que ya conocen los beneficios del Ganoderma',
      'Complemento ideal para cualquier sistema de bienestar'
    ],
    combinacionSugerida: ['capsulas-excellium', 'capsulas-cordygold'],
    sistemaRecomendado: 'rendimiento-avanzado'
  },
  'capsulas-excellium': {
    name: 'CÁPSULAS EXCELLIUM',
    price: 272500,
    image: '/productos/suplementos/capsulas-de-excellium-gano-excel-min.png',
    invima: 'NSA-0012958-2022',
    goals: ['Concentración', 'Energía'],
    shortDescription: 'Conocido como el "tónico cerebral", contiene extracto del micelio joven del Ganoderma',
    taglineEstrategico: 'Claridad mental para decisiones brillantes',
    usage: 'Tomar 1-2 cápsulas al día con agua',
    ingredients: ['Extracto de micelio de Ganoderma', 'Germanio orgánico', 'Cápsula vegetal', 'Aminoácidos esenciales'],
    benefits: ['Apoya la función cerebral, memoria y concentración', 'Conocido como el "tónico para el cerebro"', 'Ayuda a mantener un sistema nervioso saludable', 'Promueve una óptima oxigenación celular', 'Contribuye al desarrollo y función del cerebro'],
    perfilIdeal: 'Personas conscientes de su salud, memoria y claridad mental',
    momentoConsumo: 'Tomar en la mañana para máximo rendimiento cognitivo',
    puntosConversacion: [
      'Producto diferenciador: único extracto de micelio en el mercado',
      'Perfecto para profesionales: mejora el rendimiento mental',
      'Historia poderosa: el "secreto" de los líderes exitosos'
    ],
    combinacionSugerida: ['ganocafe-clasico', 'capsulas-ganoderma'],
    sistemaRecomendado: 'energia-enfoque'
  },
  'capsulas-cordygold': {
    name: 'CÁPSULAS CORDYGOLD',
    price: 336900,
    image: '/productos/suplementos/capsulas-de-cordy-gold-gano-excel-min.png',
    invima: 'NSA-0012957-2022',
    goals: ['Energía', 'Defensas'],
    shortDescription: 'Cordyceps sinensis de alta calidad para aumentar la energía',
    taglineEstrategico: 'Energía de atleta, resistencia de campeón',
    usage: 'Tomar 2 cápsulas al día',
    ingredients: ['Extracto de Cordyceps sinensis', 'Cápsula vegetal', 'Adenosina', 'Polisacáridos bioactivos'],
    benefits: ['Aumenta la energía, resistencia y rendimiento físico', 'Apoya la salud del sistema respiratorio y pulmones', 'Contribuye al buen funcionamiento de los riñones', 'Mejora la vitalidad y apoya la función sexual', 'Ayuda a regular el estrés y la fatiga crónica'],
    perfilIdeal: 'Personas activas que valoran su energía, vitalidad y bienestar general',
    momentoConsumo: 'Tomar 30 minutos antes del ejercicio o actividad física',
    puntosConversacion: [
      'Producto premium: el más caro justifica el valor del sistema completo',
      'Para clientes que buscan resultados extraordinarios',
      'Testimonio de atletas: resultados medibles en rendimiento'
    ],
    combinacionSugerida: ['espirulina-gano-creal', 'capsulas-ganoderma'],
    sistemaRecomendado: 'rendimiento-avanzado'
  },
  'pasta-dientes-gano-fresh': {
    name: 'PASTA DE DIENTES GANO FRESH',
    price: 73900,
    image: '/productos/cuidado-personal/gano-fresh-gano-excel-min.png',
    invima: 'NSOC58855-14CO',
    goals: ['Belleza', 'Digestivo'],
    shortDescription: 'Pasta dental enriquecida con Ganoderma, libre de flúor',
    taglineEstrategico: 'Sonrisas que abren puertas de oportunidad',
    usage: 'Usar como pasta dental regular',
    ingredients: ['Extracto de Ganoderma Lucidum', 'Aceites esenciales naturales', 'Agentes limpiadores suaves', 'Sin flúor'],
    benefits: ['Promueve la salud integral de dientes y encías', 'Proporciona un aliento fresco y duradero', 'Fórmula suave, sin flúor, ideal para toda la familia', 'Ayuda a prevenir la formación de placa', 'Contribuye a calmar la sensibilidad dental'],
    perfilIdeal: 'Familias conscientes que buscan alternativas naturales',
    momentoConsumo: 'Uso diario, mínimo 2 veces al día',
    puntosConversacion: [
      'Producto de entrada: bajo precio, uso diario, toda la familia',
      'Sin flúor: atrae a clientes conscientes de ingredientes',
      'Genera confianza: si funciona en la pasta, funcionará en todo'
    ],
    combinacionSugerida: ['jabon-gano', 'ganocafe-3-en-1'],
    sistemaRecomendado: 'familiar-nutricion'
  },
  'jabon-gano': {
    name: 'JABÓN GANO',
    price: 73900,
    image: '/productos/cuidado-personal/gano-jabon-gano-excel-min.png',
    invima: 'NSOC99970-20CO',
    goals: ['Belleza'],
    shortDescription: 'Jabón artesanal enriquecido con Ganoderma y leche de cabra',
    taglineEstrategico: 'Lujo accesible en cada baño',
    usage: 'Humedecer la piel, aplicar el jabón',
    ingredients: ['Extracto de Ganoderma Lucidum', 'Leche de cabra', 'Aceites vegetales naturales', 'Glicerina natural', 'Base jabonosa vegetal'],
    benefits: ['Nutre e hidrata la piel profundamente', 'Enriquecido con leche de cabra para mayor suavidad', 'Ayuda a equilibrar el pH natural de la piel', 'Limpia sin resecar, ideal para pieles sensibles', 'Propiedades antioxidantes que protegen la piel'],
    perfilIdeal: 'Personas con piel sensible o problemas dermatológicos',
    momentoConsumo: 'Uso diario en ducha o baño',
    puntosConversacion: [
      'Producto testimonial: resultados visibles en problemas de piel',
      'Leche de cabra: ingrediente premium que justifica el precio',
      'Regalo perfecto: útil, único y memorable'
    ],
    combinacionSugerida: ['jabon-transparente-gano', 'exfoliante-piel-brillo'],
    sistemaRecomendado: 'belleza-holistica'
  },
  'jabon-transparente-gano': {
    name: 'JABÓN TRANSPARENTE GANO',
    price: 78500,
    image: '/productos/cuidado-personal/jabon-transparent-soap-gano-excel-min.png',
    invima: 'NSO09915-21CO',
    goals: ['Belleza'],
    shortDescription: 'Jabón transparente con papaya y aloe vera, enriquecido con Ganoderma',
    taglineEstrategico: 'Transparencia que refleja pureza y calidad',
    usage: 'Aplicar sobre piel húmeda',
    ingredients: ['Extracto de Ganoderma Lucidum', 'Extracto de papaya', 'Aloe vera', 'Base jabonosa transparente', 'Agentes exfoliantes naturales'],
    benefits: ['Limpia suavemente la piel, eliminando impurezas', 'Con papaya para una micro-exfoliación natural', 'El aloe vera proporciona un efecto calmante', 'Ayuda a mejorar la apariencia de la piel', 'Deja una sensación de frescura y limpieza total'],
    perfilIdeal: 'Personas que buscan limpieza profunda con ingredientes naturales',
    momentoConsumo: 'Ideal para limpieza facial nocturna',
    puntosConversacion: [
      'Papaya: enzima natural que atrae al mercado de belleza',
      'Transparente: demuestra pureza y calidad de ingredientes',
      'Perfecto para rutinas de skincare: complementa otros productos'
    ],
    combinacionSugerida: ['exfoliante-piel-brillo', 'bebida-colageno-reskine'],
    sistemaRecomendado: 'belleza-holistica'
  },
  'champu-piel-brillo': {
    name: 'Champú Piel&Brillo',
    price: 73900,
    image: '/productos/cuidado-personal/shampoo-p&b-gano-excel-min.png',
    invima: 'NSOC96485-19CO',
    goals: ['Belleza'],
    shortDescription: 'Champú revitalizante que fortalece el cabello desde la raíz',
    taglineEstrategico: 'Cabello que proyecta salud y vitalidad',
    usage: 'Aplicar sobre cabello húmedo',
    ingredients: ['Extractos herbales', 'Vitaminas para el cabello', 'Agentes limpiadores suaves', 'Aceites nutritivos', 'pH balanceado'],
    benefits: ['Fortalece y revitaliza el cabello desde la raíz', 'Proporciona un brillo saludable y natural', 'Limpia suavemente el cuero cabelludo', 'Ayuda a nutrir el folículo piloso', 'Deja el cabello con una sensación de frescura'],
    perfilIdeal: 'Personas con cabello dañado o sin brillo',
    momentoConsumo: 'Uso regular, 3-4 veces por semana',
    puntosConversacion: [
      'Sistema completo de cuidado capilar con el acondicionador',
      'Resultados visibles: cabello más fuerte y brillante',
      'Para toda la familia: fórmula suave y efectiva'
    ],
    combinacionSugerida: ['champu-piel-brillo', 'exfoliante-piel-brillo'],
    sistemaRecomendado: 'belleza-holistica'
  },
  'acondicionador-piel-brillo': {
    name: 'PIEL&BRILLO ACONDICIONADOR',
    price: 73900,
    image: '/productos/cuidado-personal/acondicionador-p&b-gano-excel-min.png',
    invima: 'NSOC96486-19CO',
    goals: ['Belleza'],
    shortDescription: 'Acondicionador que complementa el champú',
    taglineEstrategico: 'El complemento perfecto para un cabello extraordinario',
    usage: 'Después del champú, aplicar de medios a puntas',
    ingredients: ['Agentes acondicionadores', 'Aceites nutritivos', 'Vitaminas capilares', 'Extractos naturales', 'Siliconas suaves'],
    benefits: ['Deja el cabello suave, sedoso y manejable', 'Facilita el peinado y reduce el frizz', 'Aporta una hidratación profunda sin ser graso', 'Sella la cutícula para un acabado pulido', 'El complemento perfecto para un cabello sano'],
    perfilIdeal: 'Personas que buscan un sistema completo de cuidado capilar',
    momentoConsumo: 'Después de cada lavado con champú',
    puntosConversacion: [
      'Venta cruzada natural con el champú',
      'Sistema completo: mejores resultados, mayor satisfacción',
      'Fideliza clientes: compra recurrente garantizada'
    ],
    combinacionSugerida: ['champu-piel-brillo', 'bebida-colageno-reskine'],
    sistemaRecomendado: 'belleza-holistica'
  },
  'exfoliante-piel-brillo': {
    name: 'PIEL&BRILLO EXFOLIANTE CORPORAL',
    price: 73900,
    image: '/productos/cuidado-personal/exfoliante-p&b-gano-excel-min.png',
    invima: 'NSOC96487-19CO',
    goals: ['Belleza'],
    shortDescription: 'Exfoliante corporal que elimina células muertas',
    taglineEstrategico: 'Renovación celular para una piel radiante',
    usage: 'Aplicar sobre piel húmeda con movimientos circulares suaves',
    ingredients: ['Partículas exfoliantes naturales', 'Aceites hidratantes', 'Vitaminas E y C', 'Extractos vegetales', 'Agentes humectantes'],
    benefits: ['Elimina eficazmente impurezas y células muertas', 'Renueva y suaviza la textura de la piel', 'Deja la piel con una apariencia luminosa', 'Estimula la circulación y regeneración celular', 'Prepara la piel para una mejor hidratación'],
    perfilIdeal: 'Personas que buscan una piel suave y renovada',
    momentoConsumo: 'Usar 2-3 veces por semana antes del baño',
    puntosConversacion: [
      'Complemento perfecto para rutinas de spa en casa',
      'Prepara la piel para mejor absorción de cremas',
      'Producto de lujo accesible: experiencia premium'
    ],
    combinacionSugerida: ['jabon-gano', 'luvoco'],
    sistemaRecomendado: 'belleza-holistica'
  },
  // PRODUCTOS LUVOCO
  'maquina-luvoco': {
    name: 'MÁQUINA DE CAFÉ LUVOCO',
    price: 1026000,
    image: '/productos/luvoco/maquina-luvoco-gano-excel-min.png',
    invima: 'Certificado CE - Dispositivo',
    goals: ['Comodidad', 'Calidad'],
    shortDescription: 'Máquina de café premium Luvoco con tecnología de bomba de 15 bares y sistema de 2 pasos. Diseño compacto y elegante, eficiencia energética automática.',
    taglineEstrategico: 'La máquina que eleva tu experiencia y construye tu imperio',
    usage: 'Conectar a la corriente, llenar depósito de agua, insertar cápsula Luvoco, seleccionar intensidad y presionar botón. Preparación en 30 segundos.',
    ingredients: ['Acero inoxidable', 'Componentes de alta durabilidad', 'Sistema de bomba 15 bares', 'Eficiencia energética'],
    benefits: ['Tecnología de bomba de 15 bares para extracción perfecta', 'Sistema de 2 pasos para máxima calidad de café', 'Diseño compacto y elegante para cualquier cocina', 'Eficiencia energética automática', 'Preparación en 30 segundos', 'Compatible exclusivamente con cápsulas Luvoco'],
    perfilIdeal: 'Amantes del café premium y constructores visionarios',
    momentoConsumo: 'Cualquier momento: café barista en 30 segundos',
    puntosConversacion: [
      'Inversión ancla: compromiso inicial genera clientes de alto valor',
      'Sistema cerrado: garantiza compra recurrente de cápsulas',
      'Status symbol: proyecta éxito y sofisticación'
    ],
    combinacionSugerida: ['luvoco-suave', 'luvoco-medio', 'luvoco-fuerte'],
    sistemaRecomendado: 'experiencia-premium',
    downloadUrl: '/catalogo/docs/maquina-de-luvoco-digital-gano-excel.pdf'
  },
  'luvoco-suave': {
    name: 'LUVOCO CÁPSULAS SUAVE x15',
    price: 110900,
    image: '/productos/luvoco/luvoco-suave-gano-excel-min.png',
    invima: 'NSA-0012955-2022',
    goals: ['Energía', 'Sabor'],
    shortDescription: 'Disfruta de la suavidad y el delicado sabor del café Luvoco Suave. Perfecto para aquellos que prefieren un café más ligero al paladar. Caja con 15 cápsulas.',
    taglineEstrategico: 'Suavidad premium que abre conversaciones',
    usage: 'Insertar cápsula en máquina Luvoco, seleccionar intensidad suave, presionar botón. Temperatura interna 180°C-205°C.',
    ingredients: ['Café molido tostado suave', 'Betaglucanos de Ganoderma Lucidum', 'Antioxidantes naturales'],
    benefits: ['Sabor suave y delicado, perfecto para paladares sensibles', 'Enriquecido con betaglucanos de Ganoderma Lucidum', 'Ideal para empezar el día con energía natural', 'Aroma rico y envolvente', 'Sistema de cápsulas que preserva la frescura'],
    perfilIdeal: 'Personas que prefieren sabores delicados y equilibrados',
    momentoConsumo: 'Perfecto para las mañanas y reuniones sociales',
    puntosConversacion: [
      'Entrada perfecta al sistema Luvoco: sabor accesible',
      'Ideal para nuevos consumidores de café gourmet',
      'Producto social: perfecto para compartir'
    ],
    combinacionSugerida: ['luvoco-medio', 'ganorico-latte-rico'],
    sistemaRecomendado: 'experiencia-premium'
  },
  'luvoco-medio': {
    name: 'LUVOCO CÁPSULAS MEDIO x15',
    price: 110900,
    image: '/productos/luvoco/luvoco-medio-gano-excel-min.png',
    invima: 'NSA-0012954-2022',
    goals: ['Energía', 'Concentración'],
    shortDescription: 'Experimenta el equilibrio perfecto con el café Luvoco Medio. Ideal para quienes buscan un balance entre la suavidad y la intensidad. Caja con 15 cápsulas.',
    taglineEstrategico: 'El equilibrio perfecto para mentes brillantes',
    usage: 'Insertar cápsula en máquina Luvoco, seleccionar intensidad media, presionar botón. Temperatura interna 210°C-220°C.',
    ingredients: ['Café molido tostado medio', 'Betaglucanos de Ganoderma Lucidum', 'Sabor aroma equilibrados'],
    benefits: ['Equilibrio perfecto entre suavidad e intensidad', 'Enriquecido con betaglucanos de Ganoderma Lucidum', 'Perfecto para cualquier momento del día', 'Sabor pronunciado pero no abrumador', 'Contribuye a la concentración y claridad mental'],
    perfilIdeal: 'Profesionales que buscan consistencia y calidad',
    momentoConsumo: 'Ideal para media mañana y después del almuerzo',
    puntosConversacion: [
      'El más vendido: equilibrio que satisface a todos',
      'Perfecto para oficinas: mantiene productividad sin nerviosismo',
      'Versatilidad: base para preparaciones especiales'
    ],
    combinacionSugerida: ['luvoco-fuerte', 'capsulas-excellium'],
    sistemaRecomendado: 'experiencia-premium'
  },
  'luvoco-fuerte': {
    name: 'LUVOCO CÁPSULAS FUERTE x15',
    price: 110900,
    image: '/productos/luvoco/luvoco-fuerte-gano-excel-min.png',
    invima: 'NSA-0012953-2022',
    goals: ['Energía', 'Intensidad'],
    shortDescription: 'Déjate envolver por la intensidad robusta del café Luvoco Fuerte. Para los amantes del café que buscan una experiencia intensa y vigorosa. Caja con 15 cápsulas.',
    taglineEstrategico: 'Intensidad que impulsa resultados extraordinarios',
    usage: 'Insertar cápsula en máquina Luvoco, seleccionar intensidad fuerte, presionar botón. Temperatura interna 240°C-250°C.',
    ingredients: ['Café molido tostado fuerte', 'Betaglucanos de Ganoderma Lucidum', 'Proceso de tostado dominante'],
    benefits: ['Intensidad robusta para verdaderos amantes del café', 'Sabor profundo y audaz que despierta los sentidos', 'Enriquecido con betaglucanos de Ganoderma Lucidum', 'Ideal para momentos que requieren impulso extra', 'Experiencia de café intensa y vigorosa'],
    perfilIdeal: 'Conocedores del café que buscan máxima intensidad',
    momentoConsumo: 'Mañanas exigentes y jornadas largas',
    puntosConversacion: [
      'Para clientes exigentes: máxima intensidad con beneficios',
      'Diferenciador: café fuerte que no causa acidez',
      'Producto aspiracional: para quienes buscan lo mejor'
    ],
    combinacionSugerida: ['capsulas-cordygold', 'ganocafe-clasico'],
    sistemaRecomendado: 'experiencia-premium'
  }
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

  // Función para buscar distribuidor
  const buscarDistribuidor = async (slug: string): Promise<DistributorProfile | null> => {
    return {
      nombre: 'Liliana Patricia',
      whatsapp: '+573102066593',
      email: 'info@creatuactivo.com',
      ciudad: 'Villavicencio',
      pais: 'Colombia'
    }
  }

  // Cargar distribuidor y carrito al montar
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const distributorSlug = params.get('distribuidor') || 'liliana-patricia'

    buscarDistribuidor(distributorSlug).then(profile => {
      setDistributor(profile || {
        nombre: 'Liliana Patricia',
        whatsapp: '+573102066593',
        email: 'info@creatuactivo.com',
        ciudad: 'Villavicencio',
        pais: 'Colombia'
      })
    })

    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      setCart(JSON.parse(savedCart))
    }
  }, [])

  // Guardar carrito en localStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart))
  }, [cart])

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

  const generateWhatsAppMessage = () => {
    if (cart.length === 0) return ""

    const distributorName = distributor?.nombre || 'Liliana Patricia'

    let message = `¡Hola ${distributorName}! 👋\n\nMe interesa realizar este pedido desde CreaTuActivo.com:\n\n`

    cart.forEach(item => {
      message += `• ${item.name} - Cantidad: ${item.quantity} - ${item.price.toLocaleString()}\n`
    })

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    const envio = 12000
    const total = subtotal + envio

    message += `\n💰 Subtotal: ${subtotal.toLocaleString()}`
    message += `\n🚚 Envío: ${envio.toLocaleString()}`
    message += `\n✨ Total: ${total.toLocaleString()}`
    message += `\n\nTambién me gustaría conocer más sobre convertirme en Constructor del ecosistema.`
    message += `\n\nGracias! 🙏`

    return encodeURIComponent(message)
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">

      {/* Botón carrito flotante */}
      <button
        onClick={() => setCartOpen(true)}
        className="fixed top-20 right-4 z-40 bg-gradient-to-r from-blue-500 to-indigo-500 text-white p-3 rounded-full shadow-lg hover:from-blue-600 hover:to-indigo-600 transition-all"
      >
        <ShoppingCart className="h-6 w-6" />
        {cart.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">
            {cart.reduce((sum, item) => sum + item.quantity, 0)}
          </span>
        )}
      </button>

      {/* Modal Los Más Vendidos */}
      {showTopSelling && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={(e) => handleOverlayClick(e, () => setShowTopSelling(false))}
        >
          <div className="w-full max-w-5xl bg-white/95 backdrop-blur-xl border border-slate-200 rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center">
                  <Trophy className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">Productos Estrella para Constructores</h2>
                  <p className="text-slate-600">Los que generan más resultados y testimonios</p>
                </div>
              </div>
              <button
                onClick={() => setShowTopSelling(false)}
                className="p-2 text-slate-500 hover:text-slate-700 transition-colors rounded-lg hover:bg-slate-100"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {topSellingProducts.map((productId, index) => {
                  const product = productData[productId]
                  return (
                    <div key={productId} className="group relative overflow-hidden rounded-2xl border border-slate-200 hover:border-amber-300 hover:shadow-xl transition-all duration-300 bg-white">
                      <div className="absolute top-4 left-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg z-10">
                        Top #{index + 1}
                      </div>

                      <div className="p-6">
                        <div className="relative mb-6">
                          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-4 flex items-center justify-center h-[320px]">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="object-contain max-h-[18rem] drop-shadow-lg transition-transform group-hover:scale-105 duration-300"
                            />
                          </div>
                          <div className="absolute top-4 right-4 bg-gradient-to-r from-slate-800 to-slate-700 text-white px-4 py-2 rounded-full text-lg font-bold shadow-lg">
                            ${product.price.toLocaleString()}
                          </div>
                        </div>

                        <h3 className="text-lg font-bold text-slate-800 mb-2">{product.name}</h3>
                        <p className="text-sm text-amber-600 font-medium mb-3 italic">"{product.taglineEstrategico}"</p>
                        <p className="text-slate-700 text-sm mb-4 leading-relaxed line-clamp-2">{product.shortDescription}</p>

                        <div className="mb-4">
                          <p className="text-xs font-semibold text-slate-600 mb-2">Para Constructores:</p>
                          <p className="text-xs text-slate-600 italic line-clamp-2">{product.puntosConversacion[0]}</p>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-6">
                          {product.goals.map((goal) => (
                            <span key={goal} className="bg-gradient-to-r from-amber-100 to-orange-100 border border-amber-200 px-3 py-1 rounded-full text-xs text-amber-800 font-medium">
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
                            className="flex-1 bg-slate-100 border-2 border-slate-200 text-slate-700 py-3 px-4 rounded-xl hover:bg-slate-200 hover:border-slate-300 transition-all text-sm font-medium"
                          >
                            Ver Estrategia
                          </button>
                          <button
                            onClick={() => {
                              addToCart(productId)
                              setShowTopSelling(false)
                            }}
                            className="flex-1 bg-gradient-to-r from-amber-600 to-orange-600 text-white py-3 px-4 rounded-xl hover:from-amber-700 hover:to-orange-700 transition-all text-sm font-medium shadow-lg"
                          >
                            Añadir al carrito
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

      {/* Panel del carrito mejorado */}
      {cartOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={(e) => handleOverlayClick(e, () => setCartOpen(false))}
        >
          <div className="absolute right-0 top-0 h-full w-96 bg-slate-900/98 backdrop-blur-xl border-l border-slate-600 shadow-2xl">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-6 border-b border-slate-600">
                <h2 className="text-xl font-bold text-white">Tu Sistema de Bienestar</h2>
                <button
                  onClick={() => setCartOpen(false)}
                  className="p-2 text-slate-300 hover:text-white transition-colors rounded-lg hover:bg-slate-700"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                {cart.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingCart className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-300">Tu sistema está vacío</p>
                    <p className="text-slate-400 text-sm mt-2">Comienza agregando productos estrella</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.map((item) => (
                      <div key={item.id} className="bg-slate-800/80 border border-slate-600 rounded-2xl p-4">
                        <div className="flex items-center space-x-4">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 rounded-lg object-contain bg-white/10 p-1"
                          />
                          <div className="flex-1">
                            <h3 className="text-white font-medium text-sm">{item.name}</h3>
                            <p className="text-slate-200 text-sm">${item.price.toLocaleString()}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-8 h-8 bg-slate-600 rounded-lg flex items-center justify-center text-white hover:bg-slate-500 transition-colors"
                            >
                              -
                            </button>
                            <span className="text-white w-8 text-center font-medium">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 bg-slate-600 rounded-lg flex items-center justify-center text-white hover:bg-slate-500 transition-colors"
                            >
                              +
                            </button>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-400 hover:text-red-300 transition-colors"
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
                <div className="border-t border-slate-600 p-6 space-y-4">
                  <div className="space-y-2 text-white">
                    <div className="flex justify-between">
                      <span className="text-slate-200">Subtotal:</span>
                      <span className="font-medium">${cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-200">Envío:</span>
                      <span className="font-medium">$12.000</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg border-t border-slate-600 pt-2">
                      <span>Total:</span>
                      <span className="text-amber-500">${(cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) + 12000).toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3">
                    <p className="text-amber-300 text-xs font-medium mb-1">Siguiente Paso:</p>
                    <p className="text-white text-sm">Confirma tu pedido y recibe tu sistema de bienestar</p>
                  </div>

                  <a
                    href={`https://wa.me/${distributor?.whatsapp || '+573102066593'}?text=${generateWhatsAppMessage()}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-gradient-to-r from-emerald-500 to-green-500 text-white py-3 rounded-xl font-medium hover:from-emerald-600 hover:to-green-600 transition-all text-center block"
                  >
                    Finalizar por WhatsApp
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Contenido principal */}
      <div className="container mx-auto px-4 py-8">

        {/* Header estratégico */}
        <div className="text-center mb-12">
  <div className="inline-block bg-gradient-to-r from-amber-200 to-yellow-200 border border-amber-300 rounded-full px-6 py-2 mb-6">
    <span className="text-slate-800 font-medium text-sm tracking-wider uppercase">Motor del Ecosistema CreaTuActivo</span>
  </div>

  <h1 className="text-4xl md:text-6xl font-bold mb-4">
    <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
      Tu Vitalidad, Desbloqueada
    </span>
  </h1>

  <p className="text-slate-700 text-lg md:text-xl max-w-3xl mx-auto mb-8">
    La naturaleza creó el código. La ciencia nos dio la llave. Tu cuerpo recibe la recompensa completa: el único extracto con 200+ fitonutrientes en Absorción a Nivel Celular™.
  </p>

  {distributor && (
    <div className="inline-flex items-center bg-white/90 backdrop-blur-lg border border-blue-200 rounded-full px-6 py-3 mb-8 shadow-lg">
      <Rocket className="h-4 w-4 text-blue-500 mr-2 animate-pulse" />
      <span className="text-slate-700">
        Tu mentor constructor: <span className="font-bold text-blue-700">{distributor.nombre}</span>
      </span>
    </div>
  )}
</div>

{/* Nueva Sección: La Ventaja Competitiva */}
<section className="mb-16">
  <div className="text-center mb-12">
    <div className="inline-block bg-gradient-to-r from-blue-200 to-indigo-200 border border-blue-300 rounded-full px-6 py-2 mb-6">
      <span className="text-slate-800 font-medium text-sm tracking-wider uppercase">Tecnología Patentada Mundial</span>
    </div>

    <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6 leading-tight">
      La Llave Celular™ que Desbloquea el <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Poder de la Naturaleza</span>
    </h2>

    <p className="text-slate-600 text-lg max-w-4xl mx-auto">
      La ciencia ha guardado este tesoro bajo llave. Nuestra tecnología de extracción patentada es la llave maestra: extracto 100% hidrosoluble que libera 6 variedades de Ganoderma en su máxima potencia.
    </p>
  </div>

          {/* Estadísticas de impacto */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 max-w-5xl mx-auto">
            <div className="bg-white/90 backdrop-blur-lg border border-blue-200 rounded-2xl p-8 text-center group hover:scale-105 transition-transform">
              <div className="text-5xl font-bold bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent mb-2">
                200+
              </div>
              <div className="text-slate-700 font-semibold">Fitonutrientes Activos</div>
              <div className="text-slate-500 text-sm mt-2">En cada producto</div>
            </div>

            <div className="bg-white/90 backdrop-blur-lg border border-purple-200 rounded-2xl p-8 text-center group hover:scale-105 transition-transform">
              <div className="text-5xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent mb-2">
                100%
              </div>
              <div className="text-slate-700 font-semibold">Hidrosoluble</div>
              <div className="text-slate-500 text-sm mt-2">Absorción completa garantizada</div>
            </div>

            <div className="bg-white/90 backdrop-blur-lg border border-amber-200 rounded-2xl p-8 text-center group hover:scale-105 transition-transform">
              <div className="text-5xl font-bold bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent mb-2">
                6
              </div>
              <div className="text-slate-700 font-semibold">Variedades Fusionadas</div>
              <div className="text-slate-500 text-sm mt-2">Fórmula exclusiva mundial</div>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={() => setShowTopSelling(true)}
              className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl hover:from-amber-600 hover:to-orange-600 transition-all inline-flex items-center gap-3"
            >
              <Trophy className="h-5 w-5" />
              Ver Productos Más Exitosos para Constructores
            </button>
          </div>
        </section>

        {/* Nueva Sección: Sistemas de Bienestar */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <div className="inline-block bg-gradient-to-r from-green-200 to-emerald-200 border border-green-300 rounded-full px-6 py-2 mb-6">
              <span className="text-slate-800 font-medium text-sm tracking-wider uppercase">Sistemas de Bienestar Inteligentes</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-6">
              No Vendas Productos, Ofrece Soluciones
            </h2>
            <p className="text-slate-600 text-lg max-w-3xl mx-auto">
              Cada sistema está diseñado para resolver necesidades específicas y generar testimonios poderosos
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {Object.entries(sistemasDebienestar).map(([key, system]) => (
              <div
                key={key}
                onClick={() => setSelectedSystem(key)}
                className="bg-white/90 backdrop-blur-lg border-2 border-slate-200 rounded-2xl p-6 cursor-pointer group hover:border-blue-400 hover:shadow-xl transition-all"
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${system.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                  {system.icono}
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2 text-center">{system.nombre}</h3>
                <p className="text-slate-600 text-sm text-center mb-4">{system.descripcion}</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  <span className="text-xs bg-slate-100 px-3 py-1 rounded-full text-slate-700">
                    {system.productos.length} productos
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Productos por categorías tradicionales */}
        <section id="bebidas" className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-slate-800">Bebidas Funcionales</h2>
            <div className="h-1 flex-1 bg-gradient-to-r from-blue-400 to-indigo-400 ml-8 rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {bebidas.map(([id, product]) => (
              <div key={id} className="group relative overflow-hidden rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 bg-white">
                <div className="p-6">
                  <div className="relative mb-6">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4 flex items-center justify-center h-[400px]">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="object-contain max-h-[22rem] drop-shadow-lg transition-transform group-hover:scale-105 duration-300"
                      />
                    </div>
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-full text-lg font-bold shadow-lg">
                      ${product.price.toLocaleString()}
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-slate-800 mb-2">{product.name}</h3>
                  {product.taglineEstrategico && (
                    <p className="text-sm text-amber-600 font-medium mb-3 italic">"{product.taglineEstrategico}"</p>
                  )}
                  <p className="text-slate-500 text-sm mb-3">INVIMA: {product.invima}</p>
                  <p className="text-slate-700 text-sm mb-6 leading-relaxed line-clamp-3">{product.shortDescription}</p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {product.goals.map((goal) => (
                      <span key={goal} className="bg-gradient-to-r from-blue-100 to-indigo-100 border border-blue-200 px-3 py-1 rounded-full text-xs text-blue-800 font-medium">
                        {goal}
                      </span>
                    ))}
                  </div>

                  <div className="flex space-x-3">
                    <button
                      onClick={() => setSelectedProduct(product)}
                      className="flex-1 bg-slate-100 border-2 border-slate-200 text-slate-700 py-3 px-4 rounded-xl hover:bg-slate-200 hover:border-slate-300 transition-all text-sm font-medium"
                    >
                      Ver Estrategia
                    </button>
                    <button
                      onClick={() => addToCart(id)}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all text-sm font-medium shadow-lg inline-flex items-center justify-center"
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

        {/* Sección Luvoco Premium */}
        <section id="luvoco" className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-slate-800">Experiencia Luvoco Premium</h2>
            <div className="h-1 flex-1 bg-gradient-to-r from-red-400 to-pink-400 ml-8 rounded-full"></div>
          </div>

          <div className="text-center mb-12">
            <div className="inline-block bg-gradient-to-r from-red-200 to-pink-200 border border-red-300 rounded-full px-6 py-2 mb-6">
              <span className="text-slate-800 font-medium text-sm tracking-wider uppercase">Love of Coffee - Sistema Premium</span>
            </div>
            <p className="text-slate-600 text-lg max-w-3xl mx-auto">
              Sistema de cápsulas con tecnología de 15 bares. El ancla perfecta para clientes de alto valor
              que garantiza compra recurrente y construye tu activo mes a mes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-8">
            {luvoco.map(([id, product]) => (
              <div key={id} className="group relative overflow-hidden rounded-2xl border border-slate-200 hover:border-red-300 hover:shadow-xl transition-all duration-300 bg-white">
                <div className="p-6">
                  <div className="relative mb-6">
                    <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl p-4 flex items-center justify-center h-[400px]">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="object-contain max-h-[22rem] drop-shadow-lg transition-transform group-hover:scale-105 duration-300"
                      />
                    </div>
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-red-600 to-pink-600 text-white px-4 py-2 rounded-full text-lg font-bold shadow-lg">
                      ${product.price.toLocaleString()}
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-slate-800 mb-2">{product.name}</h3>
                  {product.taglineEstrategico && (
                    <p className="text-sm text-red-600 font-medium mb-3 italic">"{product.taglineEstrategico}"</p>
                  )}
                  <p className="text-slate-500 text-sm mb-3">Certificación: {product.invima}</p>
                  <p className="text-slate-700 text-sm mb-6 leading-relaxed">{product.shortDescription}</p>

                  {product.puntosConversacion && (
                    <div className="mb-4 p-3 bg-amber-50 rounded-xl border border-amber-200">
                      <p className="text-xs font-semibold text-amber-700 mb-1">💡 Estrategia Constructor:</p>
                      <p className="text-xs text-amber-600">{product.puntosConversacion[0]}</p>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2 mb-6">
                    {product.goals.map((goal) => (
                      <span key={goal} className="bg-gradient-to-r from-red-100 to-pink-100 border border-red-200 px-3 py-1 rounded-full text-xs text-red-800 font-medium">
                        {goal}
                      </span>
                    ))}
                  </div>

                  <div className="flex flex-col space-y-3">
                    <div className="flex space-x-3">
                      <button
                        onClick={() => setSelectedProduct(product)}
                        className="flex-1 bg-slate-100 border-2 border-slate-200 text-slate-700 py-3 px-4 rounded-xl hover:bg-slate-200 hover:border-slate-300 transition-all text-sm font-medium"
                      >
                        Ver Estrategia
                      </button>
                      <button
                        onClick={() => addToCart(id)}
                        className="flex-1 bg-gradient-to-r from-red-600 to-pink-600 text-white py-3 px-4 rounded-xl hover:from-red-700 hover:to-pink-700 transition-all text-sm font-medium shadow-lg"
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
                          className="flex items-center justify-center w-full bg-gradient-to-r from-emerald-500 to-green-500 text-white py-3 px-4 rounded-xl hover:from-emerald-600 hover:to-green-600 transition-all text-sm font-medium shadow-lg"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Descargar Ficha de Producto
                        </a>
                        <a
                          href="https://drive.google.com/file/d/12EsTVv_HPTa6xEj505H_Z8XQssYHfSoi/view?usp=drive_link"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-3 px-4 rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all text-sm font-medium shadow-lg"
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

        {/* Suplementos */}
        <section id="suplementos" className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-slate-800">Suplementos Concentrados</h2>
            <div className="h-1 flex-1 bg-gradient-to-r from-indigo-500 to-purple-500 ml-8 rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {suplementos.map(([id, product]) => (
              <div key={id} className="group relative overflow-hidden rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-xl transition-all duration-300 bg-white">
                <div className="p-6">
                  <div className="relative mb-6">
                    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-4 flex items-center justify-center h-[400px]">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="object-contain max-h-[22rem] drop-shadow-lg transition-transform group-hover:scale-105 duration-300"
                      />
                    </div>
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-full text-lg font-bold shadow-lg">
                      ${product.price.toLocaleString()}
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-slate-800 mb-2">{product.name}</h3>
                  {product.taglineEstrategico && (
                    <p className="text-sm text-indigo-600 font-medium mb-3 italic">"{product.taglineEstrategico}"</p>
                  )}
                  <p className="text-slate-500 text-sm mb-3">INVIMA: {product.invima}</p>
                  <p className="text-slate-700 text-sm mb-6 leading-relaxed">{product.shortDescription}</p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {product.goals.map((goal) => (
                      <span key={goal} className="bg-gradient-to-r from-indigo-100 to-purple-100 border border-indigo-200 px-3 py-1 rounded-full text-xs text-indigo-800 font-medium">
                        {goal}
                      </span>
                    ))}
                  </div>

                  <div className="flex space-x-3">
                    <button
                      onClick={() => setSelectedProduct(product)}
                      className="flex-1 bg-slate-100 border-2 border-slate-200 text-slate-700 py-3 px-4 rounded-xl hover:bg-slate-200 hover:border-slate-300 transition-all text-sm font-medium"
                    >
                      Ver Estrategia
                    </button>
                    <button
                      onClick={() => addToCart(id)}
                      className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all text-sm font-medium shadow-lg"
                    >
                      Agregar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Cuidado Personal */}
        <section id="cuidado-personal" className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-slate-800">Cuidado Personal Inteligente</h2>
            <div className="h-1 flex-1 bg-gradient-to-r from-purple-500 to-pink-500 ml-8 rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {cuidadoPersonal.map(([id, product]) => (
              <div key={id} className="group relative overflow-hidden rounded-2xl border border-slate-200 hover:border-purple-300 hover:shadow-xl transition-all duration-300 bg-white">
                <div className="p-6">
                  <div className="relative mb-6">
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-4 flex items-center justify-center h-[400px]">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="object-contain max-h-[22rem] drop-shadow-lg transition-transform group-hover:scale-105 duration-300"
                      />
                    </div>
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-full text-lg font-bold shadow-lg">
                      ${product.price.toLocaleString()}
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-slate-800 mb-2">{product.name}</h3>
                  {product.taglineEstrategico && (
                    <p className="text-sm text-purple-600 font-medium mb-3 italic">"{product.taglineEstrategico}"</p>
                  )}
                  <p className="text-slate-500 text-sm mb-3">INVIMA: {product.invima}</p>
                  <p className="text-slate-700 text-sm mb-6 leading-relaxed">{product.shortDescription}</p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {product.goals.map((goal) => (
                      <span key={goal} className="bg-gradient-to-r from-purple-100 to-pink-100 border border-purple-200 px-3 py-1 rounded-full text-xs text-purple-800 font-medium">
                        {goal}
                      </span>
                    ))}
                  </div>

                  <div className="flex space-x-3">
                    <button
                      onClick={() => setSelectedProduct(product)}
                      className="flex-1 bg-slate-100 border-2 border-slate-200 text-slate-700 py-3 px-4 rounded-xl hover:bg-slate-200 hover:border-slate-300 transition-all text-sm font-medium"
                    >
                      Ver Estrategia
                    </button>
                    <button
                      onClick={() => addToCart(id)}
                      className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-4 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all text-sm font-medium shadow-lg"
                    >
                      Agregar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Sección CTA Final: Construye tu Sistema */}
        <section className="mb-16 mt-20">
          <div className="bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-amber-600/10 rounded-3xl p-12 text-center">
            <Shield className="w-16 h-16 text-amber-500 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-6">
              ¿Listo para Construir Tu Activo?
            </h2>
            <p className="text-slate-600 text-lg max-w-3xl mx-auto mb-8">
              Este catálogo no es solo una lista de productos. Es tu arsenal para construir un activo real
              con la única patente mundial de extracto 100% hidrosoluble de Ganoderma.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-10">
              <div className="bg-white/80 rounded-xl p-6">
                <div className="text-3xl font-bold text-blue-600 mb-2">Constructor Inicial</div>
                <p className="text-slate-700 font-semibold mb-2">$200 USD</p>
                <p className="text-slate-600 text-sm">~$900.000 COP</p>
                <p className="text-slate-500 text-xs mt-3">Bono Tecnológico incluido</p>
                <p className="text-slate-500 text-xs">2 meses cortesía Plan Cimiento</p>
              </div>

              <div className="bg-white/80 rounded-xl p-6">
                <div className="text-3xl font-bold text-purple-600 mb-2">Constructor Empresarial</div>
                <p className="text-slate-700 font-semibold mb-2">$500 USD</p>
                <p className="text-slate-600 text-sm">~$2.250.000 COP</p>
                <p className="text-slate-500 text-xs mt-3">Bono Tecnológico incluido</p>
                <p className="text-slate-500 text-xs">4 meses cortesía Plan Estructura</p>
              </div>

              <div className="bg-white/80 rounded-xl p-6">
                <div className="text-3xl font-bold text-amber-600 mb-2">Constructor Visionario</div>
                <p className="text-slate-700 font-semibold mb-2">$1,000 USD</p>
                <p className="text-slate-600 text-sm">~$4.500.000 COP</p>
                <p className="text-slate-500 text-xs mt-3">Bono Tecnológico incluido</p>
                <p className="text-slate-500 text-xs">6 meses cortesía Plan Rascacielos</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={`https://wa.me/${distributor?.whatsapp || '+573102066593'}?text=${encodeURIComponent('Hola! Me interesa conocer más sobre los Paquetes Constructor ESP y cómo puedo empezar a construir mi activo con CreaTuActivo.com')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-emerald-500 to-green-500 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl hover:from-emerald-600 hover:to-green-600 transition-all inline-flex items-center justify-center gap-3"
              >
                <MessageCircle className="h-5 w-5" />
                Quiero Ser Constructor
              </a>

              <button
                onClick={() => window.open('https://creatuactivo.com/presentacion-empresarial', '_blank')}
                className="bg-white border-2 border-blue-500 text-blue-700 px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 transition-all inline-flex items-center justify-center gap-3"
              >
                <Brain className="h-5 w-5" />
                Ver Presentación del Ecosistema
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* Modal de Sistema de Bienestar Seleccionado */}
      {selectedSystem && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={(e) => handleOverlayClick(e, () => setSelectedSystem(null))}
        >
          <div className="w-full max-w-5xl bg-white/95 backdrop-blur-xl border border-slate-200 rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <div className="flex items-center space-x-3">
                <div className={`w-12 h-12 bg-gradient-to-r ${sistemasDebienestar[selectedSystem].color} rounded-full flex items-center justify-center`}>
                  {sistemasDebienestar[selectedSystem].icono}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">{sistemasDebienestar[selectedSystem].nombre}</h2>
                  <p className="text-slate-600">{sistemasDebienestar[selectedSystem].descripcion}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedSystem(null)}
                className="p-2 text-slate-500 hover:text-slate-700 transition-colors rounded-lg hover:bg-slate-100"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6">
              <div className="mb-6 p-4 bg-amber-50 rounded-xl border border-amber-200">
                <p className="text-amber-800 font-semibold mb-2">Estrategia de Venta para Constructores:</p>
                <p className="text-amber-700 text-sm">
                  Este sistema resuelve necesidades específicas. Úsalo como paquete completo para maximizar
                  el valor percibido y generar testimonios poderosos que atraigan más clientes.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {getProductsBySystem(selectedSystem).map((product) => (
                  <div key={product.id} className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                    <div className="flex items-start space-x-4">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-24 h-24 object-contain rounded-lg bg-white p-2"
                      />
                      <div className="flex-1">
                        <h3 className="font-bold text-slate-800 mb-1">{product.name}</h3>
                        <p className="text-amber-600 text-xs italic mb-2">"{product.taglineEstrategico}"</p>
                        <p className="text-slate-600 text-sm mb-3">{product.shortDescription}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-slate-800">${product.price.toLocaleString()}</span>
                          <button
                            onClick={() => {
                              addToCart(product.id)
                              setSelectedSystem(null)
                            }}
                            className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-blue-600 hover:to-indigo-600 transition-all"
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
                  className="bg-gradient-to-r from-emerald-500 to-green-500 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl hover:from-emerald-600 hover:to-green-600 transition-all"
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
          <div className="bg-white/95 backdrop-blur-xl border border-slate-200 rounded-2xl p-6 max-w-5xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">{selectedProduct.name}</h2>
                <p className="text-amber-600 font-medium italic mt-1">"{selectedProduct.taglineEstrategico}"</p>
              </div>
              <button
                onClick={() => setSelectedProduct(null)}
                className="p-2 text-slate-500 hover:text-slate-700 transition-colors rounded-lg hover:bg-slate-100"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-6 mb-6">
                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    className="w-full h-[400px] object-contain"
                  />
                </div>
                <div className="text-center">
                  <span className="text-3xl font-bold text-slate-800">${selectedProduct.price.toLocaleString()}</span>
                  <p className="text-slate-500 text-sm mt-1">Precio constructor</p>
                </div>
              </div>

              <div className="space-y-6">
                {/* Tabs de navegación */}
                <div className="flex space-x-2 border-b border-slate-200">
                  <button
                    onClick={() => setActiveTab('beneficios')}
                    className={`px-4 py-2 font-medium transition-all ${
                      activeTab === 'beneficios'
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    Beneficios
                  </button>
                  <button
                    onClick={() => setActiveTab('ciencia')}
                    className={`px-4 py-2 font-medium transition-all ${
                      activeTab === 'ciencia'
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    Ciencia
                  </button>
                  <button
                    onClick={() => setActiveTab('constructor')}
                    className={`px-4 py-2 font-medium transition-all ${
                      activeTab === 'constructor'
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    Para Constructores
                  </button>
                </div>

                {/* Contenido de tabs */}
                <div>
                  {activeTab === 'beneficios' && (
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-bold text-slate-800 mb-3">Beneficios Clave</h3>
                        <ul className="space-y-2">
                          {selectedProduct.benefits.map((benefit, index) => (
                            <li key={index} className="flex items-start">
                              <span className="text-emerald-500 mr-2">✓</span>
                              <span className="text-slate-700">{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h3 className="text-lg font-bold text-slate-800 mb-3">Perfil Ideal</h3>
                        <p className="text-slate-700 bg-blue-50 p-3 rounded-lg">{selectedProduct.perfilIdeal}</p>
                      </div>

                      <div>
                        <h3 className="text-lg font-bold text-slate-800 mb-3">Momento de Consumo</h3>
                        <p className="text-slate-700">{selectedProduct.momentoConsumo}</p>
                      </div>
                    </div>
                  )}

                  {activeTab === 'ciencia' && (
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-bold text-slate-800 mb-3">Ingredientes Activos</h3>
                        <ul className="space-y-1">
                          {selectedProduct.ingredients.map((ingredient, index) => (
                            <li key={index} className="flex items-start">
                              <span className="text-blue-500 mr-2">•</span>
                              <span className="text-slate-700">{ingredient}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-xl border border-amber-200">
                        <h4 className="font-bold text-amber-800 mb-2">La Ventaja Patentada</h4>
                        <p className="text-amber-700 text-sm">
                          Este producto contiene nuestro extracto patentado 100% hidrosoluble de Ganoderma Lucidum.
                          Una fusión de 6 variedades que aporta más de 200 fitonutrientes biodisponibles,
                          imposible de replicar por la competencia.
                        </p>
                      </div>

                      <div>
                        <h3 className="text-lg font-bold text-slate-800 mb-3">Modo de Uso</h3>
                        <p className="text-slate-700 bg-slate-50 p-3 rounded-lg">{selectedProduct.usage}</p>
                      </div>

                      <div>
                        <p className="text-slate-500 text-sm">
                          <strong>Registro INVIMA:</strong> {selectedProduct.invima}
                        </p>
                      </div>
                    </div>
                  )}

                  {activeTab === 'constructor' && (
                    <div className="space-y-4">
                      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-200">
                        <h4 className="font-bold text-purple-800 mb-3">Puntos de Conversación Estratégicos</h4>
                        <ul className="space-y-2">
                          {selectedProduct.puntosConversacion.map((punto, index) => (
                            <li key={index} className="flex items-start">
                              <span className="text-purple-500 mr-2">{index + 1}.</span>
                              <span className="text-purple-700 text-sm">{punto}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {selectedProduct.combinacionSugerida && (
                        <div>
                          <h3 className="text-lg font-bold text-slate-800 mb-3">Combinación Sugerida</h3>
                          <div className="flex flex-wrap gap-2">
                            {selectedProduct.combinacionSugerida.map((productoId) => (
                              <span key={productoId} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                                {productData[productoId]?.name || productoId}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200">
                        <h4 className="font-bold text-emerald-800 mb-2">Potencial de Construcción</h4>
                        <p className="text-emerald-700 text-sm">
                          Ideal para construir relaciones con: {selectedProduct.perfilIdeal}.
                          Este producto crea conversaciones de valor y abre puertas para presentar el ecosistema completo.
                        </p>
                      </div>

                      {selectedProduct.sistemaRecomendado && (
                        <div>
                          <h3 className="text-lg font-bold text-slate-800 mb-3">Sistema Recomendado</h3>
                          <button
                            onClick={() => {
                              setSelectedProduct(null)
                              setSelectedSystem(selectedProduct.sistemaRecomendado!)
                            }}
                            className="w-full bg-gradient-to-r from-blue-100 to-indigo-100 border border-blue-300 p-4 rounded-xl hover:from-blue-200 hover:to-indigo-200 transition-all text-left"
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-semibold text-blue-800">
                                  {sistemasDebienestar[selectedProduct.sistemaRecomendado].nombre}
                                </p>
                                <p className="text-blue-600 text-sm">
                                  {sistemasDebienestar[selectedProduct.sistemaRecomendado].descripcion}
                                </p>
                              </div>
                              <Rocket className="h-6 w-6 text-blue-600" />
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
                    className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-4 rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all font-medium text-lg shadow-lg"
                  >
                    Agregar al Sistema de Bienestar
                  </button>

                  {selectedProduct.downloadUrl && (
                    <a
                      href={selectedProduct.downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center bg-gradient-to-r from-emerald-500 to-green-500 text-white py-4 rounded-xl hover:from-emerald-600 hover:to-green-600 transition-all font-medium text-lg shadow-lg"
                    >
                      <Download className="h-5 w-5 mr-2" />
                      Descargar Material para Constructores
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
