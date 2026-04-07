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

// ═══════════════════════════════════════════════════════════════════════════
// CLINICAL LUXURY - Color Palette (Bio-Lab Spectrum)
// ═══════════════════════════════════════════════════════════════════════════
const C = {
  bioEmerald: '#50C878',        // Acento Clinical (reemplaza amber/gold)
  pharmaTeal: '#0F2E2F',        // Fondo tarjetas (90% opacity)
  whatsappLux: '#25D366',       // WhatsApp Luxury green
  obsidian: '#0B0C0C',          // Background principal
  gunmetal: '#16181D',          // Secondary surfaces
  textMain: '#E5E5E5',          // Texto principal
  textMuted: '#A3A3A3',         // Texto secundario
  textDim: '#6b6b75',           // Texto terciario
}

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
    nombre: 'Para Tener Más Energía',
    descripcion: 'Empieza el día con energía y mantente activo sin el bajón del café normal',
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
    nombre: 'Para Mantenerte Activo',
    descripcion: 'Ideal si caminas, haces ejercicio o simplemente quieres sentirte con más vitalidad',
    productos: ['capsulas-cordygold', 'capsulas-ganoderma', 'espirulina-gano-creal'],
    icono: <Target className="h-6 w-6" />,
    color: 'from-red-500 to-pink-500'
  },
  'belleza-holistica': {
    nombre: 'Para Tu Piel y Belleza',
    descripcion: 'Cuida tu piel desde adentro con colágeno, y por fuera con jabones naturales',
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
    name: 'GANOCAFÉ 3 EN 1',
    price: 110900,
    image: '/productos/bebidas/ganocafe-3-en-1-gano-excel-min.png',
    invima: 'SD2012-0002589',
    goals: ['Energía', 'Defensas', 'Digestivo'],
    shortDescription: 'Una deliciosa mezcla de café premium con Ganoderma Lucidum, cremoso y azúcar',
    taglineEstrategico: 'Tu ritual diario con beneficios reales',
    usage: 'Mezcla 1 sobre (21g) en 150ml de agua caliente',
    ingredients: ['Extracto de Ganoderma Lucidum', 'Café soluble premium', 'Cremora vegetal', 'Azúcar'],
    benefits: ['Aporta energía y vitalidad para tu día', 'Apoya las defensas naturales del cuerpo', 'Contribuye a la reducción del estrés y la fatiga', 'Promueve un estado de ánimo positivo', 'Disfruta de un delicioso y nutritivo sabor cremoso'],
    perfilIdeal: 'Personas que valoran su salud y buscan energía sostenida para su día',
    momentoConsumo: 'Ideal para comenzar la mañana o media tarde cuando necesitas un impulso',
    puntosConversacion: [
      'Perfecto para profesionales que quieren mantener su ritual de café mientras construyen su negocio',
      'El producto más vendido: no cambia hábitos, los mejora con 200+ fitonutrientes gracias a nuestra fórmula exclusiva',
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
    taglineEstrategico: 'El latte que merece cada pausa',
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
    taglineEstrategico: 'El desayuno que alimenta tu día',
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
      'Producto premium: chocolate suizo con nuestra tecnología de extracción propia',
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
    taglineEstrategico: 'Colágeno + Ganoderma para tu piel radiante',
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
      'Producto insignia: demuestra la seriedad de nuestro Secreto Industrial',
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
    taglineEstrategico: 'Claridad mental para tu día a día',
    usage: 'Tomar 1-2 cápsulas al día con agua',
    ingredients: ['Extracto de micelio de Ganoderma', 'Germanio orgánico', 'Cápsula vegetal', 'Aminoácidos esenciales'],
    benefits: ['Apoya la función cerebral, memoria y concentración', 'Conocido como el "tónico para el cerebro"', 'Ayuda a mantener un sistema nervioso saludable', 'Promueve una óptima oxigenación celular', 'Contribuye al desarrollo y función del cerebro'],
    perfilIdeal: 'Personas conscientes de su salud, memoria y claridad mental',
    momentoConsumo: 'Tomar en la mañana para máximo rendimiento cognitivo',
    puntosConversacion: [
      'Producto diferenciador: único extracto de micelio en el mercado',
      'Perfecto para profesionales: mejora el rendimiento mental gracias a nuestro proceso de extracción único',
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
    taglineEstrategico: 'Sonrisas naturalmente brillantes',
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
    taglineEstrategico: 'La máquina que eleva cada taza a experiencia premium',
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
    taglineEstrategico: 'Suavidad premium para cada momento',
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
    taglineEstrategico: 'Intensidad para quienes aman el café robusto',
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
        setCart(JSON.parse(savedCart))
      }
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

    const distributorName = distributor?.nombre || 'Luis Cabrejo'

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
    <>
      <style dangerouslySetInnerHTML={{__html: `
        .clinical-btn {
          clip-path: polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px);
          transition: all 0.2s ease;
        }
        .clinical-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px ${C.bioEmerald}40;
        }
        .titanium-btn:hover {
          border-color: #ffffff !important;
          color: #ffffff !important;
        }
        .whatsapp-hybrid {
          background: ${C.obsidian};
          color: ${C.whatsappLux};
          border: 2px solid ${C.whatsappLux}66;
          clip-path: polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px);
          transition: all 0.3s ease;
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
              background: '#18181b',
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
                              fontFamily: "'Roboto Mono', monospace",
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
                              fontFamily: "'Roboto Mono', monospace",
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
                <h2 className="text-xl font-bold" style={{ color: C.textMain }}>Tu Sistema de Bienestar</h2>
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
                    <p style={{ color: C.textMuted }}>Tu sistema está vacío</p>
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
                      <span style={{ color: C.textMuted }}>Subtotal:</span>
                      <span className="font-medium">${cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ color: C.textMuted }}>Envío:</span>
                      <span className="font-medium">$12.000</span>
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
                      <span>Total:</span>
                      <span style={{ color: C.bioEmerald }}>${(cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) + 12000).toLocaleString()}</span>
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
                    <p className="text-sm" style={{ color: C.textMain }}>Confirma tu pedido y recibe tu sistema de bienestar</p>
                  </div>

                  <a
                    href={`https://wa.me/${(distributor?.whatsapp || '+573215193909').replace(/\D/g, '')}?text=${generateWhatsAppMessage()}`}
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
                      fontFamily: "'Rajdhani', sans-serif",
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
                fontFamily: "'Roboto Mono', monospace",
              }}
            >
              Catálogo Oficial Gano Excel
            </span>
          </div>

          <h1
            className="text-4xl md:text-6xl font-serif font-bold mb-4"
            style={{ color: C.textMain }}
          >
            Siéntete Bien <span style={{ color: C.bioEmerald }}>Cada Día</span>
          </h1>

          <p
            className="text-lg md:text-xl max-w-3xl mx-auto mb-8 leading-relaxed"
            style={{ color: C.textMuted }}
          >
            Imagina empezar tu mañana con un café que además de despertarte, cuida tu salud. Nuestros productos tienen el poder del hongo <span style={{ color: C.bioEmerald }}>Ganoderma</span>: más de 200 nutrientes naturales que tu cuerpo aprovecha fácilmente.
          </p>

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
          fontFamily: "'Roboto Mono', monospace",
        }}
      >
        Lo Mejor del Ganoderma
      </span>
    </div>

    <h2
      className="text-4xl md:text-5xl font-serif font-bold mb-6 leading-tight"
      style={{ color: C.textMain }}
    >
      Nutrición que Tu Cuerpo <span style={{ color: C.bioEmerald }}>Realmente Aprovecha</span>
    </h2>

    <p className="text-lg max-w-4xl mx-auto" style={{ color: C.textMuted }}>
      No basta con tener buenos ingredientes, tu cuerpo necesita poder absorberlos. Nuestro extracto de Ganoderma se disuelve completamente, permitiendo que recibas todos sus beneficios en cada taza o cápsula.
    </p>
  </div>

          {/* Estadísticas de impacto - Pharma Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 max-w-5xl mx-auto">
            <div
              style={{
                background: '#18181b',
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
                background: '#18181b',
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
              <div className="text-sm mt-2" style={{ color: C.textDim }}>Tu cuerpo lo aprovecha completo</div>
            </div>

            <div
              style={{
                background: '#18181b',
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
                background: C.bioEmerald,
                color: C.obsidian,
                padding: '1rem 2rem',
                fontWeight: 700,
                fontSize: '1.125rem',
                fontFamily: "'Rajdhani', sans-serif",
                letterSpacing: '0.05em',
              }}
            >
              <Trophy className="h-5 w-5" />
              VER PRODUCTOS MÁS VENDIDOS
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
                  fontFamily: "'Roboto Mono', monospace",
                }}
              >
                Encuentra lo que Necesitas
              </span>
            </div>
            <h2
              className="text-3xl md:text-4xl font-serif font-bold mb-6"
              style={{ color: C.textMain }}
            >
              Productos para Cada Momento de Tu Vida
            </h2>
            <p className="text-lg max-w-3xl mx-auto" style={{ color: C.textMuted }}>
              Hemos organizado nuestros productos según lo que buscas: más energía, cuidar a tu familia, verte mejor o disfrutar un buen café.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {Object.entries(sistemasDebienestar).map(([key, system]) => (
              <div
                key={key}
                onClick={() => setSelectedSystem(key)}
                style={{
                  background: '#18181b',
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
                  background: '#18181b',
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
                        fontFamily: "'Roboto Mono', monospace",
                      }}
                    >
                      ${product.price.toLocaleString()}
                    </div>
                  </div>

                  <h3 className="text-xl font-bold mb-2" style={{ color: C.textMain }}>{product.name}</h3>
                  {product.taglineEstrategico && (
                    <p className="text-sm font-medium mb-3 italic" style={{ color: '#90A4AE' }}>"{product.taglineEstrategico}"</p>
                  )}
                  <p className="text-sm mb-3" style={{ color: C.textDim, fontFamily: "'Roboto Mono', monospace" }}>INVIMA: {product.invima}</p>
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
                        fontFamily: "'Roboto Mono', monospace",
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
                    fontFamily: "'Roboto Mono', monospace",
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
                    fontFamily: "'Rajdhani', sans-serif",
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
                  Tecnología de extracción de 15 bares. Experiencia barista premium en tu hogar.
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
                  fontFamily: "'Roboto Mono', monospace",
                }}
              >
                Love of Coffee - Sistema Premium
              </span>
            </div>
            <p className="text-lg max-w-3xl mx-auto" style={{ color: C.textMuted }}>
              Sistema de cápsulas con tecnología de 15 bares. El ancla perfecta para clientes de alto valor
              que garantiza compra recurrente y construye tu activo mes a mes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-8">
            {luvoco.map(([id, product]) => (
              <div
                key={id}
                style={{
                  background: '#18181b',
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
                        fontFamily: "'Roboto Mono', monospace",
                      }}
                    >
                      ${product.price.toLocaleString()}
                    </div>
                  </div>

                  <h3 className="text-xl font-bold mb-2" style={{ color: C.textMain }}>{product.name}</h3>
                  {product.taglineEstrategico && (
                    <p className="text-sm font-medium mb-3 italic" style={{ color: '#90A4AE' }}>"{product.taglineEstrategico}"</p>
                  )}
                  <p className="text-sm mb-3" style={{ color: C.textDim, fontFamily: "'Roboto Mono', monospace" }}>Certificación: {product.invima}</p>
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
                          fontFamily: "'Roboto Mono', monospace",
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
                  background: '#18181b',
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
                        fontFamily: "'Roboto Mono', monospace",
                      }}
                    >
                      ${product.price.toLocaleString()}
                    </div>
                  </div>

                  <h3 className="text-xl font-bold mb-2" style={{ color: C.textMain }}>{product.name}</h3>
                  {product.taglineEstrategico && (
                    <p className="text-sm font-medium mb-3 italic" style={{ color: '#90A4AE' }}>"{product.taglineEstrategico}"</p>
                  )}
                  <p className="text-sm mb-3" style={{ color: C.textDim, fontFamily: "'Roboto Mono', monospace" }}>INVIMA: {product.invima}</p>
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
                        fontFamily: "'Roboto Mono', monospace",
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
                  background: '#18181b',
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
                        fontFamily: "'Roboto Mono', monospace",
                      }}
                    >
                      ${product.price.toLocaleString()}
                    </div>
                  </div>

                  <h3 className="text-xl font-bold mb-2" style={{ color: C.textMain }}>{product.name}</h3>
                  {product.taglineEstrategico && (
                    <p className="text-sm font-medium mb-3 italic" style={{ color: '#90A4AE' }}>"{product.taglineEstrategico}"</p>
                  )}
                  <p className="text-sm mb-3" style={{ color: C.textDim, fontFamily: "'Roboto Mono', monospace" }}>INVIMA: {product.invima}</p>
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
                        fontFamily: "'Roboto Mono', monospace",
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

        {/* Sección CTA Final: Construye tu Sistema - Quiet Luxury */}
        <section className="mb-16 mt-20">
          <div className="bg-[#16181D] border border-[#E5C279]/20  p-12 text-center">
            <Shield className="w-16 h-16 text-[#E5C279] mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#E5E5E5] mb-6">
              ¿Te Interesa Emprender con Productos de Bienestar?
            </h2>
            <p className="text-[#A3A3A3] text-lg max-w-3xl mx-auto mb-8">
              Si quieres conocer más sobre cómo estos productos pueden ayudarte, o te interesa compartirlos con otros, estamos aquí para ayudarte.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-10">
              <div className="bg-[#0B0C0C] border border-[#E5C279]/20  p-6">
                <div className="text-2xl font-serif font-bold text-[#E5C279] mb-2">Constructor Inicial</div>
                <p className="text-[#E5E5E5] font-semibold mb-2">$200 USD</p>
                <p className="text-[#A3A3A3] text-sm">~$900.000 COP</p>
                <p className="text-[#6B7280] text-xs mt-3">Bono Tecnológico incluido</p>
                <p className="text-[#6B7280] text-xs">2 meses cortesía Plan Cimiento</p>
              </div>

              <div className="bg-[#0B0C0C] border border-[#E5C279]/30  p-6">
                <div className="text-2xl font-serif font-bold text-[#E5C279] mb-2">Constructor Empresarial</div>
                <p className="text-[#E5E5E5] font-semibold mb-2">$500 USD</p>
                <p className="text-[#A3A3A3] text-sm">~$2.250.000 COP</p>
                <p className="text-[#6B7280] text-xs mt-3">Bono Tecnológico incluido</p>
                <p className="text-[#6B7280] text-xs">4 meses cortesía Plan Estructura</p>
              </div>

              <div className="bg-[#0B0C0C] border border-[#E5C279]/40  p-6">
                <div className="text-2xl font-serif font-bold text-[#E5C279] mb-2">Constructor Visionario</div>
                <p className="text-[#E5E5E5] font-semibold mb-2">$1,000 USD</p>
                <p className="text-[#A3A3A3] text-sm">~$4.500.000 COP</p>
                <p className="text-[#6B7280] text-xs mt-3">Bono Tecnológico incluido</p>
                <p className="text-[#6B7280] text-xs">6 meses cortesía Plan Rascacielos</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={`https://wa.me/${(distributor?.whatsapp || '+573215193909').replace(/\D/g, '')}?text=${encodeURIComponent('Hola! Me interesa conocer más sobre los Paquetes Constructor ESP y cómo puedo empezar a construir mi activo con CreaTuActivo.com')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#F59E0B] text-[#0B0C0C] px-8 py-4  font-bold text-lg shadow-xl hover:bg-[#F59E0B] transition-all inline-flex items-center justify-center gap-3"
              >
                <MessageCircle className="h-5 w-5" />
                Quiero Ser Constructor
              </a>

              <button
                onClick={() => window.open('https://creatuactivo.com/servilleta', '_blank')}
                className="bg-[#0B0C0C] border border-[#E5C279]/30 text-[#E5E5E5] px-8 py-4  font-bold text-lg hover:border-[#E5C279]/60 transition-all inline-flex items-center justify-center gap-3"
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
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-[#E5E5E5]">
              Preguntas Frecuentes sobre <span className="text-[#E5C279]">Gano Café</span>
            </h2>
            <p className="text-[#A3A3A3] text-lg max-w-3xl mx-auto">
              Descubre todo sobre el Gano Café 3 en 1, beneficios del Ganoderma Lucidum y cómo tomarlo correctamente
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            {/* Pregunta 1 */}
            <details className="group bg-[#16181D]  border border-[#E5C279]/20 hover:border-[#E5C279]/40 transition-all overflow-hidden">
              <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                <h3 className="text-xl font-bold text-[#E5E5E5] pr-4">
                  ¿Para qué sirve el Gano Café?
                </h3>
                <span className="text-[#E5C279] text-2xl font-bold group-open:rotate-45 transition-transform">+</span>
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
                <p className="mt-4 text-[#E5C279] font-medium">
                  💡 A diferencia del café tradicional, el Gano Café transforma tu ritual diario en una inversión de salud.
                </p>
              </div>
            </details>

            {/* Pregunta 2 */}
            <details className="group bg-[#16181D]  border border-[#E5C279]/20 hover:border-[#E5C279]/40 transition-all overflow-hidden">
              <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                <h3 className="text-xl font-bold text-[#E5E5E5] pr-4">
                  ¿Cuáles son los beneficios del Gano Café 3 en 1?
                </h3>
                <span className="text-[#E5C279] text-2xl font-bold group-open:rotate-45 transition-transform">+</span>
              </summary>
              <div className="px-6 pb-6 text-[#A3A3A3] leading-relaxed">
                <p className="mb-4">
                  El <strong>Gano Café 3 en 1</strong> (café + crema + azúcar) de Gano Excel ofrece beneficios respaldados por el <strong>extracto natural de Ganoderma Lucidum</strong> que tu cuerpo absorbe fácilmente:
                </p>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-[#0B0C0C] p-4  border border-[#E5C279]/20">
                    <h4 className="font-bold text-[#E5C279] mb-2">🛡️ Sistema Inmunológico</h4>
                    <p className="text-sm">Fortalece defensas naturales con betaglucanos</p>
                  </div>
                  <div className="bg-[#0B0C0C] p-4  border border-[#E5C279]/20">
                    <h4 className="font-bold text-[#E5C279] mb-2">⚡ Energía Sostenida</h4>
                    <p className="text-sm">Vitalidad sin nerviosismo ni caídas de energía</p>
                  </div>
                  <div className="bg-[#0B0C0C] p-4  border border-[#E5C279]/20">
                    <h4 className="font-bold text-[#E5C279] mb-2">🧘 Reducción de Estrés</h4>
                    <p className="text-sm">Ayuda a manejar el estrés del día a día</p>
                  </div>
                  <div className="bg-[#0B0C0C] p-4  border border-[#E5C279]/20">
                    <h4 className="font-bold text-[#E5C279] mb-2">🎯 Concentración</h4>
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
                <h3 className="text-xl font-bold text-[#E5E5E5] pr-4">
                  ¿Cuál es el precio del Gano Café en Colombia 2026?
                </h3>
                <span className="text-[#E5C279] text-2xl font-bold group-open:rotate-45 transition-transform">+</span>
              </summary>
              <div className="px-6 pb-6 text-[#A3A3A3] leading-relaxed">
                <p className="mb-4">
                  Los <strong>precios oficiales de Gano Excel en Colombia</strong> para 2026 son:
                </p>
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between bg-[#0B0C0C] p-4  border border-[#E5C279]/30">
                    <div>
                      <p className="font-bold text-[#E5E5E5]">Gano Café 3 en 1</p>
                      <p className="text-sm text-[#A3A3A3]">Caja con 20 sobres x 21g</p>
                    </div>
                    <p className="text-2xl font-bold text-[#E5C279]">$110.900 COP</p>
                  </div>
                  <div className="flex items-center justify-between bg-[#0B0C0C] p-4  border border-[#E5C279]/20">
                    <div>
                      <p className="font-bold text-[#E5E5E5]">Gano Café Clásico (Negro)</p>
                      <p className="text-sm text-[#A3A3A3]">Caja con 30 sobres x 4.5g</p>
                    </div>
                    <p className="text-2xl font-bold text-[#E5C279]">$110.900 COP</p>
                  </div>
                </div>
                <div className="bg-[#0B0C0C] border border-[#E5C279]/30 p-4 ">
                  <p className="font-bold text-[#E5C279] mb-2">💰 Precios de Distribuidor Mayorista</p>
                  <p className="text-sm text-[#A3A3A3]">
                    Como <strong>Fundador CreaTuActivo</strong>, accedes a precios mayoristas con descuento de hasta 35% sobre precio público.
                    <a href="/fundadores" className="text-[#E5C279] hover:text-[#F59E0B] font-medium ml-1 underline">Ver detalles de afiliación →</a>
                  </p>
                </div>
                <p className="text-sm text-[#A3A3A3] mt-4">
                  📦 <strong>Tarifas preferenciales de envío</strong>: Hasta 15 productos pagas solo el envío mínimo. Fletes variables según ciudad y volumen.
                </p>
              </div>
            </details>

            {/* Pregunta 4 */}
            <details className="group bg-[#16181D]  border border-[#E5C279]/20 hover:border-[#E5C279]/40 transition-all overflow-hidden">
              <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                <h3 className="text-xl font-bold text-[#E5E5E5] pr-4">
                  ¿Cómo se toma el Gano Café 3 en 1?
                </h3>
                <span className="text-[#E5C279] text-2xl font-bold group-open:rotate-45 transition-transform">+</span>
              </summary>
              <div className="px-6 pb-6 text-[#A3A3A3] leading-relaxed">
                <p className="mb-4">
                  La forma correcta de preparar el <strong>Gano Café 3 en 1</strong> es:
                </p>
                <ol className="list-decimal pl-6 space-y-3 mb-4">
                  <li><strong>Vierte 1 sobre (21g)</strong> en tu taza favorita</li>
                  <li><strong>Agrega 150ml de agua caliente</strong> (no hirviendo, aprox. 80-85°C)</li>
                  <li><strong>Revuelve bien</strong> hasta disolver completamente</li>
                  <li><strong>Disfruta inmediatamente</strong> para aprovechar todos los nutrientes</li>
                </ol>
                <div className="bg-[#0B0C0C] border border-[#E5C279]/30 p-4  mb-4">
                  <p className="font-bold text-[#E5C279] mb-2">✅ Recomendaciones de Consumo</p>
                  <ul className="text-sm text-[#A3A3A3] space-y-1">
                    <li>• <strong>Mejor momento</strong>: Por la mañana o media tarde</li>
                    <li>• <strong>Frecuencia ideal</strong>: 1-2 tazas al día</li>
                    <li>• <strong>Antes o después de comidas</strong>: Ambos funcionan bien</li>
                    <li>• <strong>Puede tomarse frío</strong>: Prepara con agua fría y hielo en verano</li>
                  </ul>
                </div>
                <div className="bg-[#0B0C0C] border border-red-500/30 p-4 ">
                  <p className="font-bold text-red-400 mb-2">⚠️ Contraindicaciones</p>
                  <p className="text-sm text-[#A3A3A3]">
                    No recomendado para mujeres embarazadas o en lactancia. Si tomas anticoagulantes o tienes condiciones médicas especiales, consulta a tu médico antes de consumir.
                  </p>
                </div>
              </div>
            </details>

            {/* Pregunta 5 */}
            <details className="group bg-[#16181D]  border border-[#E5C279]/20 hover:border-[#E5C279]/40 transition-all overflow-hidden">
              <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                <h3 className="text-xl font-bold text-[#E5E5E5] pr-4">
                  ¿El Gano Café está disponible en toda Latinoamérica?
                </h3>
                <span className="text-[#E5C279] text-2xl font-bold group-open:rotate-45 transition-transform">+</span>
              </summary>
              <div className="px-6 pb-6 text-[#A3A3A3] leading-relaxed">
                <p className="mb-4">
                  Sí, <strong>Gano Excel</strong> distribuye sus productos, incluyendo el Gano Café, en más de <strong>15 países de Latinoamérica</strong>:
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                  <div className="bg-[#0B0C0C] p-3  text-center border border-[#E5C279]/30">
                    <p className="font-medium text-[#E5E5E5]">🇨🇴 Colombia</p>
                  </div>
                  <div className="bg-[#0B0C0C] p-3  text-center border border-[#E5C279]/30">
                    <p className="font-medium text-[#E5E5E5]">🇲🇽 México</p>
                  </div>
                  <div className="bg-[#0B0C0C] p-3  text-center border border-[#E5C279]/30">
                    <p className="font-medium text-[#E5E5E5]">🇵🇪 Perú</p>
                  </div>
                  <div className="bg-[#0B0C0C] p-3  text-center border border-[#E5C279]/30">
                    <p className="font-medium text-[#E5E5E5]">🇪🇨 Ecuador</p>
                  </div>
                  <div className="bg-[#0B0C0C] p-3  text-center border border-[#E5C279]/30">
                    <p className="font-medium text-[#E5E5E5]">🇨🇱 Chile</p>
                  </div>
                  <div className="bg-[#0B0C0C] p-3  text-center border border-[#E5C279]/30">
                    <p className="font-medium text-[#E5E5E5]">🇦🇷 Argentina</p>
                  </div>
                </div>
                <div className="bg-[#0B0C0C] border border-[#E5C279]/30 p-4 ">
                  <p className="font-bold text-[#E5C279] mb-2">🤖 Consulta con Queswa IA</p>
                  <p className="text-sm text-[#A3A3A3]">
                    Nuestro asistente de IA conversacional puede ayudarte a encontrar distribuidores en tu país,
                    calcular envíos internacionales y recomendarte los productos ideales para tu perfil.
                    <strong className="text-[#E5C279]"> Haz clic en el botón flotante para hablar con Queswa.</strong>
                  </p>
                </div>
              </div>
            </details>

            {/* Pregunta 6 - Bonus - Quiet Luxury */}
            <details className="group bg-[#16181D]  border-2 border-[#E5C279]/40 hover:border-[#E5C279]/70 transition-all overflow-hidden">
              <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                <h3 className="text-xl font-bold text-[#E5C279] pr-4">
                  🚀 ¿Cómo puedo comprar Gano Café y otros productos al mayorista?
                </h3>
                <span className="text-[#E5C279] text-2xl font-bold group-open:rotate-45 transition-transform">+</span>
              </summary>
              <div className="px-6 pb-6 text-[#A3A3A3] leading-relaxed">
                <p className="mb-4">
                  Con <strong className="text-[#E5C279]">CreaTuActivo</strong>, no solo compras productos premium al <strong className="text-[#E5E5E5]">precio de distribuidor mayorista</strong>
                  (35% de descuento), también accedes a un <strong className="text-[#E5E5E5]">ecosistema completo</strong>:
                </p>
                <div className="space-y-3 mb-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-[#F59E0B]  flex items-center justify-center text-[#0B0C0C] font-bold flex-shrink-0">1</div>
                    <div>
                      <p className="font-bold text-[#E5E5E5]">Aplicación CreaTuActivo + Queswa IA</p>
                      <p className="text-sm text-[#A3A3A3]">Sistema automatizado para gestionar tu negocio 24/7</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-[#F59E0B]  flex items-center justify-center text-[#0B0C0C] font-bold flex-shrink-0">2</div>
                    <div>
                      <p className="font-bold text-[#E5E5E5]">Mentoría Personalizada 1:150</p>
                      <p className="text-sm text-[#A3A3A3]">Como Fundador, recibes mentoría directa y construyes tu red</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-[#F59E0B]  flex items-center justify-center text-[#0B0C0C] font-bold flex-shrink-0">3</div>
                    <div>
                      <p className="font-bold text-[#E5E5E5]">Ingresos Residuales</p>
                      <p className="text-sm text-[#A3A3A3]">Gana comisiones por ventas propias y de tu red</p>
                    </div>
                  </div>
                </div>
                <div className="bg-[#0B0C0C] border border-[#E5C279]/30 p-6 ">
                  <p className="text-xl font-bold text-[#E5C279] mb-2">🎯 Solo 150 Cupos Fundadores</p>
                  <p className="mb-4 text-[#A3A3A3]">Válido hasta el 04 de Enero 2026</p>
                  <a
                    href="/fundadores"
                    className="inline-block bg-[#F59E0B] text-[#0B0C0C] font-bold py-3 px-8  hover:bg-[#F59E0B] transition-all shadow-lg"
                  >
                    Únete como Fundador →
                  </a>
                </div>
              </div>
            </details>
          </div>

          {/* CTA Final después del FAQ - Quiet Luxury */}
          <div className="mt-12 text-center bg-[#16181D] border border-[#E5C279]/30  p-8">
            <h3 className="text-2xl md:text-3xl font-serif font-bold mb-4 text-[#E5E5E5]">
              ¿Listo para probar el <span className="text-[#E5C279]">Gano Café</span>?
            </h3>
            <p className="text-lg mb-6 text-[#A3A3A3]">
              Habla con <strong className="text-[#E5C279]">Queswa IA</strong> y descubre qué productos son ideales para tu estilo de vida
            </p>
            <button
              onClick={() => {
                // Trigger NEXUS floating button
                const nexusButton = document.querySelector('[data-nexus-trigger]') as HTMLButtonElement
                if (nexusButton) nexusButton.click()
              }}
              className="bg-[#F59E0B] text-[#0B0C0C] font-bold py-4 px-8  hover:bg-[#F59E0B] transition-all shadow-lg inline-flex items-center space-x-2"
            >
              <Bot className="h-5 w-5" />
              <span>Hablar con Queswa IA</span>
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
                  <h2 className="text-2xl font-bold text-[#E5E5E5]">{sistemasDebienestar[selectedSystem].nombre}</h2>
                  <p className="text-[#A3A3A3]">{sistemasDebienestar[selectedSystem].descripcion}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedSystem(null)}
                aria-label="Cerrar detalle del sistema de bienestar"
                className="p-2 text-[#A3A3A3] hover:text-[#E5E5E5] transition-colors  hover:bg-[#0B0C0C]"
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
                        <h3 className="font-bold text-[#E5E5E5] mb-1">{product.name}</h3>
                        <p className="text-[#90A4AE] text-xs italic mb-2">"{product.taglineEstrategico}"</p>
                        <p className="text-[#A3A3A3] text-sm mb-3">{product.shortDescription}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-[#E5C279]">${product.price.toLocaleString()}</span>
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
              background: '#18181b',
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
                  <p className="text-sm mt-1" style={{ color: C.textMuted }}>Precio constructor</p>
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
                    Beneficios
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
                    Ciencia
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
                    Guía de Uso Avanzado
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
                        <h3 className="text-lg font-bold mb-3" style={{ color: C.textMain }}>Componentes Clave</h3>
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
                        <h4 className="font-bold mb-2" style={{ color: C.bioEmerald }}>Nuestra Ventaja Tecnológica</h4>
                        <p className="text-sm" style={{ color: C.textMuted }}>
                          Este producto contiene nuestro extracto exclusivo 100% hidrosoluble de Ganoderma Lucidum.
                          Una fusión de 6 variedades que aporta más de 200 fitonutrientes biodisponibles,
                          imposible de replicar por la competencia.
                        </p>
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
                          <strong>Registro INVIMA:</strong> {selectedProduct.invima}
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
                        <h4 className="font-bold mb-3" style={{ color: C.bioEmerald }}>💡 Consejos de Uso Óptimo</h4>
                        <ul className="space-y-2">
                          {selectedProduct.puntosConversacion.map((punto, index) => (
                            <li key={index} className="flex items-start">
                              <span className="mr-2" style={{ color: C.bioEmerald }}>•</span>
                              <span className="text-sm" style={{ color: C.textMuted }}>{punto}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {selectedProduct.combinacionSugerida && (
                        <div>
                          <h3 className="text-lg font-bold text-[#E5E5E5] mb-3">🔗 Combina con estos productos</h3>
                          <p className="text-[#A3A3A3] text-sm mb-3">Para potenciar tus resultados, prueba combinarlo con:</p>
                          <div className="flex flex-wrap gap-2">
                            {selectedProduct.combinacionSugerida.map((productoId) => (
                              <span key={productoId} className="bg-[#F59E0B]/20 text-[#E5C279] px-3 py-1  text-sm">
                                {productData[productoId]?.name || productoId}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="bg-[#0B0C0C] p-4  border border-[#E5C279]/30">
                        <h4 className="font-bold text-[#E5C279] mb-2">✨ Ideal para ti si...</h4>
                        <p className="text-[#A3A3A3] text-sm">
                          Este producto es perfecto para: {selectedProduct.perfilIdeal}.
                          Maximiza tus beneficios explorando el catálogo completo y descubriendo combinaciones que se adapten a tus objetivos.
                        </p>
                      </div>

                      {selectedProduct.sistemaRecomendado && (
                        <div>
                          <h3 className="text-lg font-bold text-[#E5E5E5] mb-3">Sistema Recomendado</h3>
                          <button
                            onClick={() => {
                              setSelectedProduct(null)
                              setSelectedSystem(selectedProduct.sistemaRecomendado!)
                            }}
                            className="w-full bg-[#0B0C0C] border border-[#E5C279]/40 p-4  hover:border-[#E5C279]/70 transition-all text-left"
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-semibold text-[#E5C279]">
                                  {sistemasDebienestar[selectedProduct.sistemaRecomendado].nombre}
                                </p>
                                <p className="text-[#A3A3A3] text-sm">
                                  {sistemasDebienestar[selectedProduct.sistemaRecomendado].descripcion}
                                </p>
                              </div>
                              <Rocket className="h-6 w-6 text-[#E5C279]" />
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
                    className="w-full bg-[#F59E0B] text-[#0B0C0C] py-4  hover:bg-[#F59E0B] transition-all font-medium text-lg shadow-lg"
                  >
                    Agregar al Sistema de Bienestar
                  </button>

                  {selectedProduct.downloadUrl && (
                    <a
                      href={selectedProduct.downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center bg-[#F59E0B]/80 text-[#0B0C0C] py-4  hover:bg-[#F59E0B] transition-all font-medium text-lg shadow-lg"
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
