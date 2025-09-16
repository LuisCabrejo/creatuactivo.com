'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Award, Coffee, Heart, Shield, Sparkles } from 'lucide-react'
import Link from 'next/link'
import StrategicNavigation from '@/components/StrategicNavigation'

// --- Estilos CSS Globales (Desde Guía de Branding v4.2) ---
const GlobalStyles = () => (
  <style jsx global>{`
    :root {
      --creatuactivo-blue: #1E40AF;
      --creatuactivo-purple: #7C3AED;
      --creatuactivo-gold: #F59E0B;
    }

    .creatuactivo-h1-ecosystem {
      font-weight: 800;
      background: linear-gradient(135deg, var(--creatuactivo-blue) 0%, var(--creatuactivo-purple) 50%, var(--creatuactivo-gold) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      line-height: 1.1;
      letter-spacing: -0.03em;
    }

    .creatuactivo-h2-component {
        font-weight: 700;
        background: linear-gradient(135deg, #FFFFFF 0%, #E5E7EB 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }

    .creatuactivo-ecosystem-card {
      background: linear-gradient(135deg,
        rgba(30, 64, 175, 0.15) 0%,
        rgba(124, 58, 237, 0.15) 50%,
        rgba(245, 158, 11, 0.15) 100%);
      backdrop-filter: blur(24px);
      border: 2px solid rgba(245, 158, 11, 0.3);
      border-radius: 20px;
      box-shadow:
        0 12px 40px rgba(30, 64, 175, 0.2),
        0 6px 20px rgba(124, 58, 237, 0.15),
        0 2px 10px rgba(245, 158, 11, 0.1);
      transition: all 0.4s ease;
      position: relative;
      overflow: hidden;
    }

    .creatuactivo-ecosystem-card:hover {
      border-color: rgba(245, 158, 11, 0.5);
      transform: translateY(-4px) scale(1.02);
      box-shadow:
        0 20px 60px rgba(30, 64, 175, 0.25),
        0 10px 30px rgba(124, 58, 237, 0.2),
        0 4px 15px rgba(245, 158, 11, 0.15);
    }

    .creatuactivo-ecosystem-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 1px;
      background: linear-gradient(135deg, var(--creatuactivo-blue) 0%, var(--creatuactivo-purple) 50%, var(--creatuactivo-gold) 100%);
    }

    .creatuactivo-product-card {
      background: linear-gradient(135deg, rgba(30, 64, 175, 0.1) 0%, rgba(124, 58, 237, 0.1) 100%);
      border: 1px solid rgba(124, 58, 237, 0.2);
      border-radius: 16px;
      backdrop-filter: blur(24px);
      transition: all 0.4s ease;
      overflow: hidden;
    }

    .creatuactivo-product-card:hover {
      border-color: rgba(245, 158, 11, 0.4);
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(30, 64, 175, 0.15);
    }

    .creatuactivo-cta-ecosystem {
      background: linear-gradient(135deg, var(--creatuactivo-blue) 0%, var(--creatuactivo-purple) 100%);
      border: none;
      border-radius: 16px;
      padding: 18px 36px;
      font-weight: 700;
      color: white;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow:
        0 6px 20px rgba(30, 64, 175, 0.4),
        0 3px 10px rgba(124, 58, 237, 0.3),
        0 1px 5px rgba(245, 158, 11, 0.2);
    }

    .creatuactivo-cta-ecosystem:hover {
      transform: translateY(-3px) scale(1.05);
      box-shadow:
        0 12px 35px rgba(30, 64, 175, 0.5),
        0 6px 15px rgba(124, 58, 237, 0.4),
        0 2px 8px rgba(245, 158, 11, 0.3);
    }

    .creatuactivo-ventaja-card {
      background: linear-gradient(135deg,
        rgba(245, 158, 11, 0.15) 0%,
        rgba(146, 64, 14, 0.1) 100%);
      border: 1px solid rgba(245, 158, 11, 0.3);
      border-radius: 24px;
      backdrop-filter: blur(24px);
    }
  `}</style>
);

// --- Datos de los Productos ---
const productsData = {
  bebidas: [
    { name: "GANOCAFÉ 3 EN 1", price: "$110,900", img: "https://placehold.co/400x400/1e293b/94a3b8?text=Café+3+en+1" },
    { name: "GANOCAFÉ CLÁSICO", price: "$110,900", img: "https://placehold.co/400x400/1e293b/94a3b8?text=Café+Clásico" },
    { name: "GANORICO LATTE", price: "$119,900", img: "https://placehold.co/400x400/1e293b/94a3b8?text=Latte" },
    { name: "GANO SHOKO RICO", price: "$124,900", img: "https://placehold.co/400x400/1e293b/94a3b8?text=Chocolate" },
    { name: "ESPIRULINA GANO C'REAL", price: "$119,900", img: "https://placehold.co/400x400/1e293b/94a3b8?text=Cereal" },
    { name: "BEBIDA OLEAF GANO ROOIBOS", price: "$119,900", img: "https://placehold.co/400x400/1e293b/94a3b8?text=Té+Rooibos" },
  ],
  suplementos: [
    { name: "Cápsulas Ganoderma", price: "$272,500", img: "https://placehold.co/400x400/1e293b/94a3b8?text=Ganoderma" },
    { name: "Cápsulas Excellium", price: "$272,500", img: "https://placehold.co/400x400/1e293b/94a3b8?text=Excellium" },
    { name: "Cápsulas Cordygold", price: "$336,900", img: "https://placehold.co/400x400/1e293b/94a3b8?text=Cordygold" },
  ],
  cuidadoPersonal: [
    { name: "Pasta Dental GANO FRESH", price: "$73,900", img: "https://placehold.co/400x400/1e293b/94a3b8?text=Gano+Fresh" },
    { name: "Jabón GANO SOAP", price: "$73,900", img: "https://placehold.co/400x400/1e293b/94a3b8?text=Gano+Soap" },
    { name: "Exfoliante Corporal", price: "$73,900", img: "https://placehold.co/400x400/1e293b/94a3b8?text=Exfoliante" },
  ]
};

const categories = [
  { id: 'bebidas', name: 'Bebidas', icon: <Coffee /> },
  { id: 'suplementos', name: 'Suplementos', icon: <Heart /> },
  { id: 'cuidadoPersonal', name: 'Cuidado Personal', icon: <Sparkles /> },
];

// --- Componente de Tarjeta de Producto ---
const ProductCard = ({ product }) => (
  <motion.div
    layout
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.8 }}
    transition={{ duration: 0.3 }}
    className="creatuactivo-product-card group"
  >
    <div className="aspect-square bg-slate-900">
      <img src={product.img} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
    </div>
    <div className="p-4">
      <h3 className="font-bold text-white truncate">{product.name}</h3>
      <p className="text-slate-400 text-sm">{product.price} COP</p>
    </div>
  </motion.div>
);

// --- Componente Principal de la Página de Productos ---
export default function ProductosPage() {
  const [activeCategory, setActiveCategory] = React.useState('bebidas');

  return (
    <>
      <GlobalStyles />
      <div className="bg-slate-900 text-white min-h-screen">
        <StrategicNavigation />

        {/* --- Fondo Decorativo Oficial --- */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute -top-1/4 left-0 w-96 h-96 bg-[var(--creatuactivo-gold)]/10 rounded-full filter blur-3xl opacity-50 animate-pulse"></div>
          <div className="absolute -bottom-1/4 right-0 w-96 h-96 bg-[var(--creatuactivo-blue)]/10 rounded-full filter blur-3xl opacity-50 animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-[var(--creatuactivo-purple)]/10 rounded-full filter blur-3xl opacity-30 animate-pulse transform -translate-x-1/2 -translate-y-1/2"></div>
        </div>

        <main className="relative z-10 p-4 lg:p-8">
          {/* --- SECCIÓN HERO: El Motor de tu Activo --- */}
          <section className="text-center max-w-4xl mx-auto py-20 lg:py-28 pt-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="creatuactivo-h1-ecosystem text-4xl md:text-6xl lg:text-7xl mb-4 leading-tight">
                <span className="block">Un Producto Único.</span>
                <span className="block">Un Activo Insuperable.</span>
              </h1>
              <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto">
                No solo distribuimos productos de bienestar. Construimos ecosistemas sobre una base de ciencia, exclusividad y una patente mundial que nos posiciona en una categoría propia.
              </p>
            </motion.div>
          </section>

          {/* --- SECCIÓN VENTAJA COMPETITIVA: La Patente --- */}
          <section className="max-w-5xl mx-auto mb-20 lg:mb-32">
            <div className="creatuactivo-ventaja-card p-8 lg:p-12 grid md:grid-cols-2 gap-8 items-center">
              <div className="text-center md:text-left">
                <div className="inline-block bg-[var(--creatuactivo-gold)]/20 text-[var(--creatuactivo-gold)] font-semibold text-sm uppercase tracking-wider px-4 py-1 rounded-full mb-4">
                  Nuestra Ventaja Insuperable
                </div>
                <h2 className="creatuactivo-h2-component text-3xl lg:text-4xl font-bold mb-4">La Patente Mundial</h2>
                <p className="text-slate-300">
                  Gano Excel posee la única patente en el mundo para un extracto de Ganoderma lucidum 100% soluble. Esto no es una simple ventaja de marketing; es un foso competitivo infranqueable. Como constructor, no compites en precio, compites en una categoría que solo tú puedes ofrecer.
                </p>
              </div>
              <div className="flex items-center justify-center">
                  <Award className="w-32 h-32 text-[var(--creatuactivo-gold)]/80" />
              </div>
            </div>
          </section>

          {/* --- SECCIÓN CATÁLOGO DE PRODUCTOS --- */}
          <section className="max-w-7xl mx-auto mb-20 lg:mb-32">
            <h2 className="creatuactivo-h2-component text-3xl md:text-5xl font-bold text-center mb-12">Explora el Motor de Valor</h2>

            {/* --- Pestañas de Categorías --- */}
            <div className="flex justify-center border-b border-white/10 mb-8">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`${
                    activeCategory === cat.id
                      ? 'text-[var(--creatuactivo-gold)] border-[var(--creatuactivo-gold)]'
                      : 'text-slate-400 border-transparent hover:text-white'
                  } flex items-center gap-2 px-4 py-3 text-sm md:text-base font-medium border-b-2 transition-all duration-300`}
                >
                  {cat.icon}
                  {cat.name}
                </button>
              ))}
            </div>

            {/* --- Grid de Productos --- */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
              >
                {productsData[activeCategory].map((product) => (
                  <ProductCard key={product.name} product={product} />
                ))}
              </motion.div>
            </AnimatePresence>
          </section>

          {/* --- SECCIÓN CTA: Conexión al Ecosistema --- */}
          <section className="max-w-4xl mx-auto text-center py-20">
            <div className="creatuactivo-ecosystem-card p-12">
              <Shield className="w-16 h-16 text-[var(--creatuactivo-gold)] mx-auto mb-6"/>
              <h2 className="creatuactivo-h2-component text-3xl md:text-4xl font-bold mb-6">Un Producto Sólido Necesita un Sistema Inteligente</h2>
              <p className="text-slate-300 mb-10 max-w-2xl mx-auto">
                La verdadera oportunidad no está en vender un producto, sino en construir el sistema de distribución que lo mueve. Descubre cómo nuestro ecosistema tecnológico potencia esta ventaja única.
              </p>
              <Link href="/presentacion-empresarial" className="creatuactivo-cta-ecosystem text-lg inline-block">
                Ver la Presentación del Ecosistema
              </Link>
            </div>
          </section>

          {/* --- Footer --- */}
          <footer className="border-t border-white/10 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-slate-400 text-sm">
              <p>&copy; {new Date().getFullYear()} CreaTuActivo.com. Todos los derechos reservados.</p>
              <p className="mt-2">El primer ecosistema tecnológico completo para construcción de activos en América.</p>
            </div>
          </footer>
        </main>
      </div>
    </>
  );
}
