'use client'

import { useState, useEffect, useRef } from 'react'
import { ShoppingCart, X, Heart, Sparkles, Waves, Trophy, Send, Bot, Star, Zap, TrendingUp, Gift, Download, Coffee, Pill, Target, MessageCircle } from 'lucide-react'

// Interfaces
interface Product {
  name: string
  price: number
  image: string
  invima: string

  // PARA CARDS (Información breve y atractiva)
  goals: string[]
  shortDescription: string

  // PARA MODAL (Información detallada)
  usage: string
  ingredients: string[]
  benefits: string[]
  downloadUrl?: string // Para la máquina Luvoco
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

// Datos de productos completos - INFORMACIÓN ACTUALIZADA Y REESTRUCTURADA
const productData: ProductData = {
  'ganocafe-3-en-1': {
    name: 'GANOCAFÉ 3 EN 1',
    price: 110900,
    image: '/catalogo/images/ganocafe-3-en-1-gano-excel-min.png',
    invima: 'SD2012-0002589',
    goals: ['Energía', 'Defensas', 'Digestivo'],
    shortDescription: 'Una deliciosa mezcla de café premium con Ganoderma Lucidum, cremoso y azúcar',
    usage: 'Mezcla 1 sobre (21g) en 150ml de agua caliente',
    ingredients: ['Extracto de Ganoderma Lucidum', 'Café soluble premium', 'Cremora vegetal', 'Azúcar'],
    benefits: ['Aporta energía y vitalidad para tu día', 'Apoya las defensas naturales del cuerpo', 'Contribuye a la reducción del estrés y la fatiga', 'Promueve un estado de ánimo positivo', 'Disfruta de un delicioso y nutritivo sabor cremoso']
  },
  'ganocafe-clasico': {
    name: 'GANOCAFÉ CLÁSICO',
    price: 110900,
    image: '/catalogo/images/gano-cafe-clasico-gano-excel-min.png',
    invima: 'SD2013-0002947',
    goals: ['Energía', 'Concentración', 'Defensas'],
    shortDescription: 'Para los amantes del café puro, esta fórmula combina café negro de alta calidad con extracto de Ganoderma',
    usage: 'Mezcla 1 sobre (4.5g) en 150ml de agua caliente',
    ingredients: ['Extracto de Ganoderma Lucidum', 'Café soluble 100% puro', 'Sabor natural a café'],
    benefits: ['Ideal para los amantes del café negro (tinto)', 'Potenciado con nutrientes para apoyar tu salud', 'Perfecto para iniciar el día con enfoque y claridad', 'Contribuye a la protección antioxidante del cuerpo', 'Apoya un metabolismo saludable']
  },
  'ganorico-latte-rico': {
    name: 'GANORICO LATTE RICO',
    price: 119900,
    image: '/catalogo/images/latte-rico-gano-excel-min.png',
    invima: 'NSA-0012966-2022',
    goals: ['Energía', 'Relajación', 'Digestivo'],
    shortDescription: 'Una experiencia de latte premium con textura cremosa y espumosa',
    usage: 'Disuelve 1 sobre (25g) en 180ml de agua caliente',
    ingredients: ['Extracto de Ganoderma Lucidum', 'Café premium', 'Leche en polvo', 'Cremora natural'],
    benefits: ['Disfruta de una experiencia de café latte premium', 'Textura espumosa y cremosa que deleita tus sentidos', 'Un gusto enriquecido para tu bienestar', 'Contribuye a un sistema digestivo saludable', 'Aporta una sensación de confort y relajación', 'Sin endulzante']
  },
  'ganorico-mocha-rico': {
    name: 'GANORICO MOCHA RICO',
    price: 119900,
    image: '/catalogo/images/mocha-rico-gano-excel-min.png',
    invima: 'NSA-0012965-2022',
    goals: ['Energía', 'Relajación', 'Defensas'],
    shortDescription: 'La combinación perfecta de café y chocolate enriquecida con Ganoderma',
    usage: 'Mezcla 1 sobre (25g) en 180ml de agua caliente',
    ingredients: ['Extracto de Ganoderma Lucidum', 'Café premium', 'Cacao natural', 'Leche en polvo', 'Azúcar de caña'],
    benefits: ['La combinación perfecta de café y cacao saludable', 'Un sabor indulgente que apoya tu bienestar', 'Con betaglucanos para apoyar tus defensas', 'Promueve la sensación de saciedad', 'Ideal para recargar energías a media tarde', 'Sin endulzante']
  },
  'ganorico-shoko-rico': {
    name: 'GANORICO SHOKO RICO',
    price: 124900,
    image: '/catalogo/images/shoko-rico-gano-excel-min.png',
    invima: 'NSA-0012964-2022',
    goals: ['Energía', 'Relajación', 'Defensas'],
    shortDescription: 'Chocolate caliente nutritivo enriquecido con Ganoderma',
    usage: 'Disuelve 1 sobre (25g) en 180ml de agua caliente o leche',
    ingredients: ['Extracto de Ganoderma Lucidum', 'Cacao premium', 'Leche en polvo', 'Azúcar natural', 'Saborizante de chocolate'],
    benefits: ['Chocolate nutritivo y delicioso para toda la familia', 'Bebida reconfortante para momentos de relajación', 'Apoya el bienestar general de forma placentera', 'Contribuye al desarrollo de huesos fuertes', 'Una opción inteligente para antojos de dulce', 'Sin endulzante']
  },
  'espirulina-gano-creal': {
    name: 'ESPIRULINA GANO C\'REAL',
    price: 119900,
    image: '/catalogo/images/ganocereal-spirulina-min.png',
    invima: 'NSA-0012963-2022',
    goals: ['Energía', 'Digestivo', 'Defensas'],
    shortDescription: 'Un cereal nutritivo que combina Spirulina y Ganoderma',
    usage: 'Mezcla 2 cucharadas (30g) con leche, yogur o agua',
    ingredients: ['Extracto de Ganoderma Lucidum', 'Spirulina orgánica', 'Cereales integrales', 'Fibra natural', 'Vitaminas y minerales'],
    benefits: ['Alto contenido de fibra para la salud digestiva', 'Excelente fuente de proteína vegetal', 'Promueve una nutrición completa y balanceada', 'Rico en vitaminas y minerales esenciales', 'Apoya la desintoxicación natural del organismo']
  },
  'bebida-oleaf-gano-rooibos': {
    name: 'BEBIDA DE OLEAF GANO ROOIBOS',
    price: 119900,
    image: '/catalogo/images/te-rooibos-gano-excel-min.png',
    invima: 'NSA-0012962-2022',
    goals: ['Relajación', 'Defensas', 'Digestivo'],
    shortDescription: 'Té rooibos sudafricano naturalmente libre de cafeína, enriquecido con Ganoderma',
    usage: 'Disuelve 1 sobre en agua caliente y deja reposar 3-5 minutos',
    ingredients: ['Extracto de Ganoderma Lucidum', 'Té Rooibos orgánico', 'Antioxidantes naturales', 'Sabor natural'],
    benefits: ['Bebida relajante para un descanso reparador', 'Naturalmente libre de cafeína', 'Rico en antioxidantes que combaten el estrés oxidativo', 'Apoya la salud del sistema nervioso', 'Contribuye a una correcta hidratación']
  },
  'gano-schokoladde': {
    name: 'Gano Schokoladde',
    price: 124900,
    image: '/catalogo/images/gano-schokolade-gano-excel-min.png',
    invima: 'NSA-0012961-2022',
    goals: ['Energía', 'Concentración', 'Defensas', 'Relajación'],
    shortDescription: 'Bebida de chocolate SUIZO con extracto puro de Ganoderma',
    usage: 'Disuelve 1 sobre en agua caliente',
    ingredients: ['Extracto concentrado de Ganoderma Lucidum', 'Cacao puro', 'Azúcar'],
    benefits: ['Ofrece apoyo nutricional con delicioso sabor', 'Fórmula concentrada con extracto de Ganoderma', 'Ayuda a mejorar la circulación y salud cardiovascular', 'Contribuye a un estado de ánimo equilibrado', 'Fácil y rápido de preparar']
  },
  'luvoco': {
    name: 'LUVOCO',
    price: 159900,
    image: '/catalogo/images/luvoco-gano-excel-min.png',
    invima: 'NSA-0012960-2022',
    goals: ['Belleza', 'Relajación'],
    shortDescription: 'Bebida funcional con colágeno marino y Ganoderma Lucidum. Diseñada especialmente para el cuidado de la piel, cabello y uñas desde adentro.',
    usage: 'Disolver 1 sobre en 200ml de agua fría. Mezclar bien y consumir preferiblemente en la noche.',
    ingredients: ['Colágeno marino hidrolizado', 'Extracto de Ganoderma Lucidum', 'Vitamina C', 'Ácido hialurónico'],
    benefits: ['Apoya la elasticidad y firmeza de la piel', 'Fortalece el cabello y las uñas', 'Contribuye a una apariencia más juvenil', 'Ayuda a mantener la salud de articulaciones', 'Fórmula única con Colágeno y Gano Plus']
  },
  'bebida-colageno-reskine': {
    name: 'BEBIDA DE COLÁGENO RESKINE',
    price: 216900,
    image: '/catalogo/images/gano-plus-reskine-collagen-drink-gano-excel-min.png',
    invima: 'NSA-0012959-2022',
    goals: ['Belleza'],
    shortDescription: 'Bebida revolucionaria que combina colágeno marino con Ganoderma',
    usage: 'Disuelve 1 sobre en agua fría o al tiempo',
    ingredients: ['Colágeno marino', 'Gano Plus', 'Vitamina C', 'Sabor natural a frutas'],
    benefits: ['Apoya la elasticidad y firmeza de la piel', 'Fortalece el cabello y las uñas', 'Contribuye a una apariencia más juvenil', 'Ayuda a mantener la salud de articulaciones', 'Fórmula única con Colágeno y Gano Plus']
  },
  'capsulas-ganoderma': {
    name: 'Cápsulas de Ganoderma',
    price: 272500,
    image: '/catalogo/images/capsulas-de-ganoderma-gano-excel-min.png',
    invima: 'SD2013-0002860',
    goals: ['Defensas', 'Energía', 'Relajación'],
    shortDescription: 'Extracto concentrado de Ganoderma Lucidum en cápsulas',
    usage: 'Tomar 2 cápsulas al día con agua',
    ingredients: ['Extracto concentrado de Ganoderma Lucidum', 'Cápsula vegetal', 'Betaglucanos', 'Triterpenos', 'Polisacáridos'],
    benefits: ['Fortalece las defensas naturales del cuerpo', 'Potente acción antioxidante que protege las células', 'Promueve el bienestar general y el equilibrio', 'Apoya la salud del sistema circulatorio', 'Actúa como un adaptógeno natural']
  },
  'capsulas-excellium': {
    name: 'CÁPSULAS EXCELLIUM',
    price: 272500,
    image: '/catalogo/images/capsulas-de-excellium-gano-excel-min.png',
    invima: 'NSA-0012958-2022',
    goals: ['Concentración', 'Energía'],
    shortDescription: 'Conocido como el "tónico cerebral", contiene extracto del micelio joven del Ganoderma',
    usage: 'Tomar 1-2 cápsulas al día con agua',
    ingredients: ['Extracto de micelio de Ganoderma', 'Germanio orgánico', 'Cápsula vegetal', 'Aminoácidos esenciales'],
    benefits: ['Apoya la función cerebral, memoria y concentración', 'Conocido como el "tónico para el cerebro"', 'Ayuda a mantener un sistema nervioso saludable', 'Promueve una óptima oxigenación celular', 'Contribuye al desarrollo y función del cerebro']
  },
  'capsulas-cordygold': {
    name: 'CÁPSULAS CORDYGOLD',
    price: 336900,
    image: '/catalogo/images/capsulas-de-cordy-gold-gano-excel-min.png',
    invima: 'NSA-0012957-2022',
    goals: ['Energía', 'Defensas'],
    shortDescription: 'Cordyceps sinensis de alta calidad para aumentar la energía',
    usage: 'Tomar 2 cápsulas al día',
    ingredients: ['Extracto de Cordyceps sinensis', 'Cápsula vegetal', 'Adenosina', 'Polisacáridos bioactivos'],
    benefits: ['Aumenta la energía, resistencia y rendimiento físico', 'Apoya la salud del sistema respiratorio y pulmones', 'Contribuye al buen funcionamiento de los riñones', 'Mejora la vitalidad y apoya la función sexual', 'Ayuda a regular el estrés y la fatiga crónica']
  },
  'pasta-dientes-gano-fresh': {
    name: 'PASTA DE DIENTES GANO FRESH',
    price: 73900,
    image: '/catalogo/images/gano-fresh-gano-excel-min.png',
    invima: 'NSOC58855-14CO',
    goals: ['Belleza', 'Digestivo'],
    shortDescription: 'Pasta dental enriquecida con Ganoderma, libre de flúor',
    usage: 'Usar como pasta dental regular',
    ingredients: ['Extracto de Ganoderma Lucidum', 'Aceites esenciales naturales', 'Agentes limpiadores suaves', 'Sin flúor'],
    benefits: ['Promueve la salud integral de dientes y encías', 'Proporciona un aliento fresco y duradero', 'Fórmula suave, sin flúor, ideal para toda la familia', 'Ayuda a prevenir la formación de placa', 'Contribuye a calmar la sensibilidad dental']
  },
  'jabon-gano': {
    name: 'JABÓN GANO',
    price: 73900,
    image: '/catalogo/images/gano-jabon-gano-excel-min.png',
    invima: 'NSOC99970-20CO',
    goals: ['Belleza'],
    shortDescription: 'Jabón artesanal enriquecido con Ganoderma y leche de cabra',
    usage: 'Humedecer la piel, aplicar el jabón',
    ingredients: ['Extracto de Ganoderma Lucidum', 'Leche de cabra', 'Aceites vegetales naturales', 'Glicerina natural', 'Base jabonosa vegetal'],
    benefits: ['Nutre e hidrata la piel profundamente', 'Enriquecido con leche de cabra para mayor suavidad', 'Ayuda a equilibrar el pH natural de la piel', 'Limpia sin resecar, ideal para pieles sensibles', 'Propiedades antioxidantes que protegen la piel']
  },
  'jabon-transparente-gano': {
    name: 'JABÓN TRANSPARENTE GANO',
    price: 78500,
    image: '/catalogo/images/jabon-transparent-soap-gano-excel-min.png',
    invima: 'NSO09915-21CO',
    goals: ['Belleza'],
    shortDescription: 'Jabón transparente con papaya y aloe vera, enriquecido con Ganoderma',
    usage: 'Aplicar sobre piel húmeda',
    ingredients: ['Extracto de Ganoderma Lucidum', 'Extracto de papaya', 'Aloe vera', 'Base jabonosa transparente', 'Agentes exfoliantes naturales'],
    benefits: ['Limpia suavemente la piel, eliminando impurezas', 'Con papaya para una micro-exfoliación natural', 'El aloe vera proporciona un efecto calmante', 'Ayuda a mejorar la apariencia de la piel', 'Deja una sensación de frescura y limpieza total']
  },
  'champu-piel-brillo': {
    name: 'Champú Piel&Brillo',
    price: 73900,
    image: '/catalogo/images/shampoo-p&b-gano-excel-min.png',
    invima: 'NSOC96485-19CO',
    goals: ['Belleza'],
    shortDescription: 'Champú revitalizante que fortalece el cabello desde la raíz',
    usage: 'Aplicar sobre cabello húmedo',
    ingredients: ['Extractos herbales', 'Vitaminas para el cabello', 'Agentes limpiadores suaves', 'Aceites nutritivos', 'pH balanceado'],
    benefits: ['Fortalece y revitaliza el cabello desde la raíz', 'Proporciona un brillo saludable y natural', 'Limpia suavemente el cuero cabelludo', 'Ayuda a nutrir el folículo piloso', 'Deja el cabello con una sensación de frescura']
  },
  'acondicionador-piel-brillo': {
    name: 'PIEL&BRILLO ACONDICIONADOR',
    price: 73900,
    image: '/catalogo/images/acondicionador-p&b-gano-excel-min.png',
    invima: 'NSOC96486-19CO',
    goals: ['Belleza'],
    shortDescription: 'Acondicionador que complementa el champú',
    usage: 'Después del champú, aplicar de medios a puntas',
    ingredients: ['Agentes acondicionadores', 'Aceites nutritivos', 'Vitaminas capilares', 'Extractos naturales', 'Siliconas suaves'],
    benefits: ['Deja el cabello suave, sedoso y manejable', 'Facilita el peinado y reduce el frizz', 'Aporta una hidratación profunda sin ser graso', 'Sella la cutícula para un acabado pulido', 'El complemento perfecto para un cabello sano']
  },
  'exfoliante-piel-brillo': {
    name: 'PIEL&BRILLO EXFOLIANTE CORPORAL',
    price: 73900,
    image: '/catalogo/images/exfoliante-p&b-gano-excel-min.png',
    invima: 'NSOC96487-19CO',
    goals: ['Belleza'],
    shortDescription: 'Exfoliante corporal que elimina células muertas',
    usage: 'Aplicar sobre piel húmeda con movimientos circulares suaves',
    ingredients: ['Partículas exfoliantes naturales', 'Aceites hidratantes', 'Vitaminas E y C', 'Extractos vegetales', 'Agentes humectantes'],
    benefits: ['Elimina eficazmente impurezas y células muertas', 'Renueva y suaviza la textura de la piel', 'Deja la piel con una apariencia luminosa', 'Estimula la circulación y regeneración celular', 'Prepara la piel para una mejor hidratación']
  },
  // ===== PRODUCTOS LUVOCO ACTUALIZADOS =====
  'maquina-luvoco': {
    name: 'MÁQUINA DE CAFÉ LUVOCO',
    price: 1026000,
    image: '/catalogo/images/maquina-luvoco-gano-excel-min.png',
    invima: 'Certificado CE - Dispositivo',
    goals: ['Comodidad', 'Calidad'],
    shortDescription: 'Máquina de café premium Luvoco con tecnología de bomba de 15 bares y sistema de 2 pasos. Diseño compacto y elegante, eficiencia energética automática.',
    usage: 'Conectar a la corriente, llenar depósito de agua, insertar cápsula Luvoco, seleccionar intensidad y presionar botón. Preparación en 30 segundos.',
    ingredients: ['Acero inoxidable', 'Componentes de alta durabilidad', 'Sistema de bomba 15 bares', 'Eficiencia energética'],
    benefits: ['Tecnología de bomba de 15 bares para extracción perfecta', 'Sistema de 2 pasos para máxima calidad de café', 'Diseño compacto y elegante para cualquier cocina', 'Eficiencia energética automática', 'Preparación en 30 segundos', 'Compatible exclusivamente con cápsulas Luvoco'],
    downloadUrl: '/catalogo/docs/maquina-de-luvoco-digital-gano-excel.pdf'
  },
  'luvoco-suave': {
    name: 'LUVOCO CÁPSULAS SUAVE x15',
    price: 110900,
    image: '/catalogo/images/luvoco-suave-gano-excel-min.png',
    invima: 'NSA-0012955-2022',
    goals: ['Energía', 'Sabor'],
    shortDescription: 'Disfruta de la suavidad y el delicado sabor del café Luvoco Suave. Perfecto para aquellos que prefieren un café más ligero al paladar. Caja con 15 cápsulas.',
    usage: 'Insertar cápsula en máquina Luvoco, seleccionar intensidad suave, presionar botón. Temperatura interna 180°C-205°C.',
    ingredients: ['Café molido tostado suave', 'Betaglucanos de Ganoderma Lucidum', 'Antioxidantes naturales'],
    benefits: ['Sabor suave y delicado, perfecto para paladares sensibles', 'Enriquecido con betaglucanos de Ganoderma Lucidum', 'Ideal para empezar el día con energía natural', 'Aroma rico y envolvente', 'Sistema de cápsulas que preserva la frescura']
  },
  'luvoco-medio': {
    name: 'LUVOCO CÁPSULAS MEDIO x15',
    price: 110900,
    image: '/catalogo/images/luvoco-medio-gano-excel-min.png',
    invima: 'NSA-0012954-2022',
    goals: ['Energía', 'Concentración'],
    shortDescription: 'Experimenta el equilibrio perfecto con el café Luvoco Medio. Ideal para quienes buscan un balance entre la suavidad y la intensidad. Caja con 15 cápsulas.',
    usage: 'Insertar cápsula en máquina Luvoco, seleccionar intensidad media, presionar botón. Temperatura interna 210°C-220°C.',
    ingredients: ['Café molido tostado medio', 'Betaglucanos de Ganoderma Lucidum', 'Sabor aroma equilibrados'],
    benefits: ['Equilibrio perfecto entre suavidad e intensidad', 'Enriquecido con betaglucanos de Ganoderma Lucidum', 'Perfecto para cualquier momento del día', 'Sabor pronunciado pero no abrumador', 'Contribuye a la concentración y claridad mental']
  },
  'luvoco-fuerte': {
    name: 'LUVOCO CÁPSULAS FUERTE x15',
    price: 110900,
    image: '/catalogo/images/luvoco-fuerte-gano-excel-min.png',
    invima: 'NSA-0012953-2022',
    goals: ['Energía', 'Intensidad'],
    shortDescription: 'Déjate envolver por la intensidad robusta del café Luvoco Fuerte. Para los amantes del café que buscan una experiencia intensa y vigorosa. Caja con 15 cápsulas.',
    usage: 'Insertar cápsula en máquina Luvoco, seleccionar intensidad fuerte, presionar botón. Temperatura interna 240°C-250°C.',
    ingredients: ['Café molido tostado fuerte', 'Betaglucanos de Ganoderma Lucidum', 'Proceso de tostado dominante'],
    benefits: ['Intensidad robusta para verdaderos amantes del café', 'Sabor profundo y audaz que despierta los sentidos', 'Enriquecido con betaglucanos de Ganoderma Lucidum', 'Ideal para momentos que requieren impulso extra', 'Experiencia de café intensa y vigorosa']
  }
}

export default function CatalogoPage() {
  // Estados (solo los relacionados con funcionalidad, NO navegación)
  const [cart, setCart] = useState<CartItem[]>([])
  const [cartOpen, setCartOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [distributor, setDistributor] = useState<DistributorProfile | null>(null)
  const [showTopSelling, setShowTopSelling] = useState(false)
  const [countersStarted, setCountersStarted] = useState(false)

  // Productos destacados específicos - INCLUYE NUEVOS LUVOCO
  const featuredProducts = ['bebida-colageno-reskine', 'maquina-luvoco', 'luvoco-suave', 'pasta-dientes-gano-fresh']

  // Productos más vendidos (top 5) - LUVOCO RETIRADO
  const topSellingProducts = ['ganocafe-3-en-1', 'maquina-luvoco', 'bebida-colageno-reskine', 'gano-schokoladde']

  // Observer para contador animado
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !countersStarted) {
            setCountersStarted(true)
          }
        })
      },
      { threshold: 0.5 }
    )

    const counterElement = document.getElementById('contador-animado')
    if (counterElement) {
      observer.observe(counterElement)
    }

    return () => observer.disconnect()
  }, [countersStarted])

  // Función para hacer scroll a categorías con offset mejorado
  const scrollToCategory = (category: string) => {
    const element = document.getElementById(category)
    if (element) {
      // Calcular posición con offset para mostrar el título
      const elementRect = element.getBoundingClientRect()
      const absoluteElementTop = elementRect.top + window.pageYOffset
      const offset = 120 // Offset para mostrar el título claramente
      const finalPosition = absoluteElementTop - offset

      // Scroll suave a la posición calculada
      window.scrollTo({
        top: finalPosition,
        behavior: 'smooth'
      })
    }
  }

  // Función para buscar distribuidor (simulada)
  const buscarDistribuidor = async (slug: string): Promise<DistributorProfile | null> => {
    // Simulación de búsqueda - en producción usaría Supabase
    return {
      nombre: 'Liliana Patricia',
      whatsapp: '+573102066593',
      email: 'info@creatuactivo.com',
      ciudad: 'Villavicencio',
      pais: 'Colombia'
    }
  }

  // Cargar distribuidor al montar el componente
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const distributorSlug = params.get('distribuidor') || 'liliana-patricia'

    buscarDistribuidor(distributorSlug).then(profile => {
      if (profile) {
        setDistributor(profile)
      } else {
        // Perfil por defecto
        setDistributor({
          nombre: 'Liliana Patricia',
          whatsapp: '+573102066593',
          email: 'info@creatuactivo.com',
          ciudad: 'Villavicencio',
          pais: 'Colombia'
        })
      }
    })

    // Cargar carrito desde localStorage
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      setCart(JSON.parse(savedCart))
    }
  }, [])

  // Guardar carrito en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart))
  }, [cart])

  // Función para añadir al carrito
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

  // Función para remover del carrito
  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId))
  }

  // Función para actualizar cantidad
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

  // Función para generar mensaje de WhatsApp
  const generateWhatsAppMessage = () => {
    if (cart.length === 0) return ""

    const distributorName = distributor?.nombre || 'Liliana Patricia'
    const distributorWhatsApp = distributor?.whatsapp || '+573102066593'

    let message = `¡Hola ${distributorName}! 👋\n\nMe interesa realizar este pedido desde CreaTuActivo.com:\n\n`

    cart.forEach(item => {
      message += `• ${item.name} - Cantidad: ${item.quantity} - $${item.price.toLocaleString()}\n`
    })

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    const envio = 12000
    const total = subtotal + envio

    message += `\n💰 Subtotal: $${subtotal.toLocaleString()}`
    message += `\n🚚 Envío: $${envio.toLocaleString()}`
    message += `\n✨ Total: $${total.toLocaleString()}`
    message += `\n\n¿Podrías confirmar disponibilidad y proceso de compra?`
    message += `\n\nGracias! 🙏`

    return encodeURIComponent(message)
  }

  // Función para cerrar overlays al hacer clic fuera
  const handleOverlayClick = (e: React.MouseEvent, closeFunction: () => void) => {
    if (e.target === e.currentTarget) {
      closeFunction()
    }
  }

  // Componente contador animado
  const AnimatedCounter = ({ end, duration = 2000, suffix = '' }: { end: number, duration?: number, suffix?: string }) => {
    const [count, setCount] = useState(0)

    useEffect(() => {
      if (!countersStarted) return

      let startTime: number
      let animationFrame: number

      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime
        const progress = Math.min((currentTime - startTime) / duration, 1)

        const easeOut = 1 - Math.pow(1 - progress, 3)
        setCount(Math.floor(easeOut * end))

        if (progress < 1) {
          animationFrame = requestAnimationFrame(animate)
        }
      }

      animationFrame = requestAnimationFrame(animate)
      return () => cancelAnimationFrame(animationFrame)
    }, [countersStarted, end, duration])

    return (
      <div className="text-6xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent mb-3">
        {count}{suffix}
      </div>
    )
  }

  // Filtrar productos (sin filtros - mostrar todos)
  const filteredProducts = Object.entries(productData)

  // Organizar productos por categorías - LUVOCO RETIRADO DE BEBIDAS
  const bebidas = filteredProducts.filter(([id]) =>
    ['ganocafe-3-en-1', 'ganocafe-clasico', 'ganorico-latte-rico', 'ganorico-mocha-rico', 'ganorico-shoko-rico', 'espirulina-gano-creal', 'bebida-oleaf-gano-rooibos', 'gano-schokoladde', 'bebida-colageno-reskine'].includes(id)
  )

  const suplementos = filteredProducts.filter(([id]) =>
    ['capsulas-ganoderma', 'capsulas-excellium', 'capsulas-cordygold'].includes(id)
  )

  const cuidadoPersonal = filteredProducts.filter(([id]) =>
    ['pasta-dientes-gano-fresh', 'jabon-gano', 'jabon-transparente-gano', 'champu-piel-brillo', 'acondicionador-piel-brillo', 'exfoliante-piel-brillo'].includes(id)
  )

  // NUEVA CATEGORÍA LUVOCO
  const luvoco = filteredProducts.filter(([id]) =>
    ['maquina-luvoco', 'luvoco-suave', 'luvoco-medio', 'luvoco-fuerte'].includes(id)
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">

      {/* BOTÓN CARRITO FLOTANTE (se mantiene como funcionalidad de la página) */}
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
          <div className="w-full max-w-4xl bg-white/95 backdrop-blur-xl border border-slate-200 rounded-2xl shadow-2xl max-h-[80vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center">
                  <Trophy className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">Los Más Vendidos</h2>
                  <p className="text-slate-600">Nuestros productos favoritos de la comunidad</p>
                </div>
              </div>
              <button
                onClick={() => setShowTopSelling(false)}
                className="p-2 text-slate-500 hover:text-slate-700 transition-colors rounded-lg hover:bg-slate-100"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Productos Top */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {topSellingProducts.map((productId, index) => {
                  const product = productData[productId]
                  return (
                    <div key={productId} className="group relative overflow-hidden rounded-2xl border border-slate-200 hover:border-amber-300 hover:shadow-xl transition-all duration-300 bg-white">
                      {/* Badge posición */}
                      <div className="absolute top-4 left-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg z-10">
                        #{index + 1}
                      </div>

                      <div className="p-6">
                        <div className="relative mb-6">
                          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-4 flex items-center justify-center h-[420px]">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="object-contain max-h-[24rem] drop-shadow-lg transition-transform group-hover:scale-105 duration-300"
                            />
                          </div>
                          <div className="absolute top-4 right-4 bg-gradient-to-r from-slate-800 to-slate-700 text-white px-4 py-2 rounded-full text-lg font-bold shadow-lg">
                            ${product.price.toLocaleString()}
                          </div>
                        </div>

                        <h3 className="text-lg font-bold text-slate-800 mb-3">{product.name}</h3>
                        <p className="text-slate-700 text-sm mb-4 leading-relaxed line-clamp-3">{product.shortDescription}</p>

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
                            Más Detalles
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

      {/* Panel del carrito - CONTRASTE MEJORADO */}
      {cartOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={(e) => handleOverlayClick(e, () => setCartOpen(false))}
        >
          <div className="absolute right-0 top-0 h-full w-96 bg-slate-900/98 backdrop-blur-xl border-l border-slate-600 shadow-2xl">
            <div className="flex flex-col h-full">
              {/* Header del carrito */}
              <div className="flex items-center justify-between p-6 border-b border-slate-600">
                <h2 className="text-xl font-bold text-white">Tu Carrito</h2>
                <button
                  onClick={() => setCartOpen(false)}
                  className="p-2 text-slate-300 hover:text-white transition-colors rounded-lg hover:bg-slate-700"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Contenido del carrito */}
              <div className="flex-1 overflow-y-auto p-6">
                {cart.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingCart className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-300">Tu carrito está vacío</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.map((item) => (
                      <div key={item.id} className="bg-slate-800/80 border border-slate-600 rounded-2xl p-4">
                        <div className="flex items-center space-x-4">
                          <img
                            src={item.image}
                            alt={item.name}
                            width="70"
                            height="70"
                            className="rounded-lg object-contain bg-white/20 p-2"
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

              {/* Footer del carrito */}
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
                      <span>${(cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) + 12000).toLocaleString()}</span>
                    </div>
                  </div>
                  <a
                    href={`https://wa.me/${distributor?.whatsapp || '+573102066593'}?text=${generateWhatsAppMessage()}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-gradient-to-r from-emerald-500 to-green-500 text-white py-3 rounded-xl font-medium hover:from-emerald-600 hover:to-green-600 transition-all text-center block"
                  >
                    Finalizar Pedido por WhatsApp
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Contenido principal */}
      <div className="container mx-auto px-4 py-8">
        {/* Header del catálogo */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Catálogo Premium
            </span>
          </h1>
          <p className="text-slate-700 text-lg md:text-xl max-w-3xl mx-auto mb-8">
            Productos de bienestar auténtico con Ganoderma Lucidum, el "Rey de las Hierbas"
          </p>

          {/* Badge del distribuidor */}
          {distributor && (
            <div className="inline-flex items-center bg-white/90 backdrop-blur-lg border border-blue-200 rounded-full px-6 py-3 mb-8 shadow-lg">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce mr-3"></div>
              <span className="text-slate-700">
                Tu distribuidor: <span className="font-bold text-blue-700">{distributor.nombre}</span>
              </span>
            </div>
          )}
        </div>

        {/* Sección Tecnología Patentada */}
        <section className="mb-16">
          {/* Badge y Título Principal */}
          <div className="text-center mb-12">
            <div className="inline-block bg-gradient-to-r from-pink-200 to-purple-200 border border-pink-300 rounded-full px-6 py-2 mb-6">
              <span className="text-slate-800 font-medium text-sm tracking-wider uppercase">Tecnología Patentada</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6 leading-tight">
              La Innovación que Nos Hace <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Únicos en el Mundo</span>
            </h2>
            <p className="text-slate-600 text-lg max-w-4xl mx-auto">
              La única empresa que fusiona 6 variedades de Ganoderma Lucidum en extracto 100% hidrosoluble con más de 200 fitonutrientes biodisponibles
            </p>
          </div>

          {/* Cards de Tecnología */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {/* 100% Hidrosoluble */}
            <div className="bg-white/90 backdrop-blur-lg border border-pink-200 rounded-2xl p-6 group hover:border-pink-300 hover:shadow-lg transition-all">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-400 to-purple-400 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <div className="w-8 h-8 bg-slate-800 rounded-full"></div>
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-3">100% Hidrosoluble: Máxima Absorción</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Somos la única empresa en el mundo con tecnología patentada para crear extractos 100% hidrosolubles. Mientras otros usan polvo simple, nosotros garantizamos biodisponibilidad completa en cada sorbo.
              </p>
            </div>

            {/* 6 Variedades en 1 */}
            <div className="bg-white/90 backdrop-blur-lg border border-pink-200 rounded-2xl p-6 group hover:border-pink-300 hover:shadow-lg transition-all">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-400 to-purple-400 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xs font-bold">6</span>
                </div>
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-3">6 Variedades en 1 Solo Producto</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Fusionamos las 6 variedades más potentes del Ganoderma Lucidum mundial. Esta combinación imposible de replicar crea un superalimento con más de 200 fitonutrientes activos.
              </p>
            </div>

            {/* 200+ Fitonutrientes */}
            <div className="bg-white/90 backdrop-blur-lg border border-pink-200 rounded-2xl p-6 group hover:border-pink-300 hover:shadow-lg transition-all">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-400 to-purple-400 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-3">200+ Fitonutrientes Biodisponibles</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Cada producto contiene más de 200 fitonutrientes activos: betaglucanos, triterpenos, germanio orgánico, polisacáridos y aminoácidos esenciales trabajando en sinergia perfecta.
              </p>
            </div>

            {/* Integrado a Tu Rutina */}
            <div className="bg-white/90 backdrop-blur-lg border border-pink-200 rounded-2xl p-6 group hover:border-pink-300 hover:shadow-lg transition-all">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-400 to-purple-400 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Coffee className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-3">Integrado a Tu Rutina Diaria</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                No creamos nuevos hábitos, mejoramos los existentes. Nuestra tecnología se integra perfectamente en tu café, chocolate y productos de uso diario.
              </p>
            </div>
          </div>

          {/* Contador de beneficios animado MEJORADO */}
          <div id="contador-animado" className="bg-white/90 backdrop-blur-lg border border-pink-200 rounded-2xl p-8 text-center shadow-lg mb-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="group">
                <AnimatedCounter end={200} suffix="+" />
                <p className="text-slate-700 font-semibold uppercase tracking-wider text-sm">Fitonutrientes Activos</p>
              </div>
              <div className="group">
                <AnimatedCounter end={6} />
                <p className="text-slate-700 font-semibold uppercase tracking-wider text-sm">Variedades Fusionadas</p>
              </div>
              <div className="group">
                <AnimatedCounter end={100} suffix="%" />
                <p className="text-slate-700 font-semibold uppercase tracking-wider text-sm">% Hidrosoluble</p>
              </div>
            </div>
          </div>

          {/* Sección Ingredientes */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-800 mb-6">
              Los Ingredientes que Hacen Posible la <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Innovación</span>
            </h2>
            <p className="text-slate-600 text-lg max-w-3xl mx-auto">
              Conoce los superalimentos que fusionamos con nuestra tecnología patentada
            </p>
          </div>

          {/* Cards de Ingredientes */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Excellium */}
            <div className="bg-white/90 backdrop-blur-lg border border-slate-200 rounded-2xl p-6 group hover:border-blue-300 hover:shadow-lg transition-all">
              <div className="w-16 h-16 bg-gradient-to-r from-slate-600 to-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <div className="w-8 h-8 bg-white rounded-full"></div>
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-3">Excellium</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Conocido como el "tónico cerebral", es el extracto del hongo joven (micelio). Rico en germanio orgánico, apoya la oxigenación y la función del sistema nervioso, promoviendo la claridad mental y la concentración.
              </p>
            </div>

            {/* Spirulina */}
            <div className="bg-white/90 backdrop-blur-lg border border-slate-200 rounded-2xl p-6 group hover:border-green-300 hover:shadow-lg transition-all">
              <div className="w-16 h-16 bg-gradient-to-r from-slate-600 to-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <div className="w-8 h-8 bg-white rounded-lg"></div>
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-3">Spirulina</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Un superalimento completo. Esta alga es una fuente increíble de proteína vegetal, vitaminas y minerales. Es ideal para complementar la nutrición, aportar energía y apoyar los procesos de desintoxicación del cuerpo.
              </p>
            </div>

            {/* Cordy Gold */}
            <div className="bg-white/90 backdrop-blur-lg border border-slate-200 rounded-2xl p-6 group hover:border-amber-300 hover:shadow-lg transition-all">
              <div className="w-16 h-16 bg-gradient-to-r from-slate-600 to-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-3">Cordy Gold (Cordyceps)</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Un tesoro de la naturaleza utilizado por siglos para aumentar la energía, la resistencia y la vitalidad. Apoya la salud respiratoria y renal, siendo un aliado perfecto para un estilo de vida activo y dinámico.
              </p>
            </div>

            {/* Té Rooibos */}
            <div className="bg-white/90 backdrop-blur-lg border border-slate-200 rounded-2xl p-6 group hover:border-red-300 hover:shadow-lg transition-all">
              <div className="w-16 h-16 bg-gradient-to-r from-slate-600 to-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <X className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-3">Té Rooibos</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Una infusión sudafricana naturalmente libre de cafeína y rica en antioxidantes. Es conocida por sus propiedades relajantes y su capacidad para apoyar la salud digestiva, siendo una bebida ideal para cualquier momento del día.
              </p>
            </div>
          </div>
        </section>

        {/* Sección de Bebidas */}
        <section id="bebidas" className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-slate-800">Bebidas (Café y Té)</h2>
            <div className="h-1 flex-1 bg-gradient-to-r from-blue-400 to-indigo-400 ml-8 rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {bebidas.map(([id, product]) => (
              <div key={id} className="group relative overflow-hidden rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 bg-white">
                <div className="p-6">
                  <div className="relative mb-6">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4 flex items-center justify-center h-[450px]">
                      <img
                        src={product.image}
                        alt={product.name}
                        width="400"
                        height="400"
                        className="object-contain max-h-[26rem] drop-shadow-lg transition-transform group-hover:scale-105 duration-300"
                      />
                    </div>
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-full text-lg font-bold shadow-lg">
                      ${product.price.toLocaleString()}
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-slate-800 mb-3">{product.name}</h3>
                  <p className="text-slate-500 text-sm mb-4">Registro INVIMA: {product.invima}</p>
                  <p className="text-slate-700 text-sm mb-6 leading-relaxed">{product.shortDescription}</p>

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
                      Más Detalles
                    </button>
                    <button
                      onClick={() => addToCart(id)}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all text-sm font-medium shadow-lg"
                    >
                      Añadir al carrito
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ===== NUEVA SECCIÓN LUVOCO ===== */}
        <section id="luvoco" className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-slate-800">Luvoco Premium</h2>
            <div className="h-1 flex-1 bg-gradient-to-r from-red-400 to-pink-400 ml-8 rounded-full"></div>
          </div>

          {/* Descripción de la categoría */}
          <div className="text-center mb-12">
            <div className="inline-block bg-gradient-to-r from-red-200 to-pink-200 border border-red-300 rounded-full px-6 py-2 mb-6">
              <span className="text-slate-800 font-medium text-sm tracking-wider uppercase">Love of Coffee</span>
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-4">Para los Amantes del Café</h3>
            <p className="text-slate-600 text-lg max-w-3xl mx-auto">
              Experimenta la revolución del café premium con nuestra tecnología de cápsulas y máquina de 15 bares.
              Tres intensidades únicas: Suave, Medio y Fuerte, cada una diseñada para momentos específicos del día
              con la calidad incomparable que caracteriza a Luvoco.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-8">
            {luvoco.map(([id, product]) => (
              <div key={id} className="group relative overflow-hidden rounded-2xl border border-slate-200 hover:border-red-300 hover:shadow-xl transition-all duration-300 bg-white">
                <div className="p-6">
                  <div className="relative mb-6">
                    <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl p-4 flex items-center justify-center h-[450px]">
                      <img
                        src={product.image}
                        alt={product.name}
                        width="400"
                        height="400"
                        className="object-contain max-h-[26rem] drop-shadow-lg transition-transform group-hover:scale-105 duration-300"
                      />
                    </div>
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-red-600 to-pink-600 text-white px-4 py-2 rounded-full text-lg font-bold shadow-lg">
                      ${product.price.toLocaleString()}
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-slate-800 mb-3">{product.name}</h3>
                  <p className="text-slate-500 text-sm mb-4">Registro INVIMA: {product.invima}</p>
                  <p className="text-slate-700 text-sm mb-6 leading-relaxed">{product.shortDescription}</p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {product.goals.map((goal) => (
                      <span key={goal} className="bg-gradient-to-r from-red-100 to-pink-100 border border-red-200 px-3 py-1 rounded-full text-xs text-red-800 font-medium">
                        {goal}
                      </span>
                    ))}
                  </div>

                  <div className="flex space-x-3 mb-4">
                    <button
                      onClick={() => setSelectedProduct(product)}
                      className="flex-1 bg-slate-100 border-2 border-slate-200 text-slate-700 py-3 px-4 rounded-xl hover:bg-slate-200 hover:border-slate-300 transition-all text-sm font-medium"
                    >
                      Más Detalles
                    </button>
                    <button
                      onClick={() => addToCart(id)}
                      className="flex-1 bg-gradient-to-r from-red-600 to-pink-600 text-white py-3 px-4 rounded-xl hover:from-red-700 hover:to-pink-700 transition-all text-sm font-medium shadow-lg"
                    >
                      Añadir al carrito
                    </button>
                  </div>

                  {/* Botón especial de descarga PDF para la máquina */}
                  {product.downloadUrl && (
                    <a
                      href={product.downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-full bg-gradient-to-r from-emerald-500 to-green-500 text-white py-3 px-4 rounded-xl hover:from-emerald-600 hover:to-green-600 transition-all text-sm font-medium shadow-lg"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Descargar Ficha Técnica
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Sección de Suplementos */}
        <section id="suplementos" className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-slate-800">Suplementos</h2>
            <div className="h-1 flex-1 bg-gradient-to-r from-indigo-500 to-purple-500 ml-8 rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {suplementos.map(([id, product]) => (
              <div key={id} className="group relative overflow-hidden rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-xl transition-all duration-300 bg-white">
                <div className="p-6">
                  <div className="relative mb-6">
                    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-4 flex items-center justify-center h-[450px]">
                      <img
                        src={product.image}
                        alt={product.name}
                        width="400"
                        height="400"
                        className="object-contain max-h-[26rem] drop-shadow-lg transition-transform group-hover:scale-105 duration-300"
                      />
                    </div>
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-full text-lg font-bold shadow-lg">
                      ${product.price.toLocaleString()}
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-slate-800 mb-3">{product.name}</h3>
                  <p className="text-slate-500 text-sm mb-4">Registro INVIMA: {product.invima}</p>
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
                      Más Detalles
                    </button>
                    <button
                      onClick={() => addToCart(id)}
                      className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all text-sm font-medium shadow-lg"
                    >
                      Añadir al carrito
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Sección de Cuidado Personal */}
        <section id="cuidado-personal" className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-slate-800">Cuidado Personal</h2>
            <div className="h-1 flex-1 bg-gradient-to-r from-purple-500 to-pink-500 ml-8 rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {cuidadoPersonal.map(([id, product]) => (
              <div key={id} className="group relative overflow-hidden rounded-2xl border border-slate-200 hover:border-purple-300 hover:shadow-xl transition-all duration-300 bg-white">
                <div className="p-6">
                  <div className="relative mb-6">
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-4 flex items-center justify-center h-[450px]">
                      <img
                        src={product.image}
                        alt={product.name}
                        width="400"
                        height="400"
                        className="object-contain max-h-[26rem] drop-shadow-lg transition-transform group-hover:scale-105 duration-300"
                      />
                    </div>
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-full text-lg font-bold shadow-lg">
                      ${product.price.toLocaleString()}
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-slate-800 mb-3">{product.name}</h3>
                  <p className="text-slate-500 text-sm mb-4">Registro INVIMA: {product.invima}</p>
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
                      Más Detalles
                    </button>
                    <button
                      onClick={() => addToCart(id)}
                      className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-4 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all text-sm font-medium shadow-lg"
                    >
                      Añadir al carrito
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Modal de producto - CONTRASTE MEJORADO */}
      {selectedProduct && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={(e) => handleOverlayClick(e, () => setSelectedProduct(null))}
        >
          <div className="bg-slate-900/98 backdrop-blur-xl border border-slate-600 rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold text-white">{selectedProduct.name}</h2>
              <button
                onClick={() => setSelectedProduct(null)}
                className="p-2 text-slate-300 hover:text-white transition-colors rounded-lg hover:bg-slate-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-6">
                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    width="400"
                    height="400"
                    className="w-full h-[450px] object-contain rounded-xl"
                  />
                </div>
                <div className="text-center">
                  <span className="text-3xl font-bold text-white">${selectedProduct.price.toLocaleString()}</span>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-white mb-3">Descripción</h3>
                  <p className="text-slate-200 leading-relaxed">{selectedProduct.shortDescription}</p>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white mb-3">Modo de Uso</h3>
                  <p className="text-slate-200 leading-relaxed">{selectedProduct.usage}</p>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white mb-3">Ingredientes</h3>
                  <ul className="text-slate-200 space-y-1">
                    {selectedProduct.ingredients.map((ingredient, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-blue-400 mr-2">•</span>
                        {ingredient}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white mb-3">Beneficios</h3>
                  <ul className="text-slate-200 space-y-2">
                    {selectedProduct.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-emerald-400 mr-2">✓</span>
                        <span className="leading-relaxed">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white mb-3">Objetivos de Bienestar</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProduct.goals.map((goal) => (
                      <span key={goal} className="bg-blue-500/20 border border-blue-400/40 px-3 py-2 rounded-full text-sm text-blue-200 font-medium">
                        {goal}
                      </span>
                    ))}
                  </div>
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
                    Añadir al Carrito
                  </button>

                  {/* Botón descarga PDF en modal para máquina Luvoco */}
                  {selectedProduct.downloadUrl && (
                    <a
                      href={selectedProduct.downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center bg-gradient-to-r from-emerald-500 to-green-500 text-white py-4 rounded-xl hover:from-emerald-600 hover:to-green-600 transition-all font-medium text-lg shadow-lg"
                    >
                      <Download className="h-5 w-5 mr-2" />
                      Descargar Ficha Técnica Completa
                    </a>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-8 p-4 bg-slate-800/60 border border-slate-600 rounded-xl">
              <p className="text-slate-200 text-sm">
                <strong className="text-white">Registro INVIMA:</strong> {selectedProduct.invima}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Estilos adicionales para animaciones */}
      <style jsx>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slide-up {
          animation: slide-up 0.5s ease-out;
        }
      `}</style>
    </div>
  )
}
