/**
 * Copyright © 2026 CreaTuActivo.com
 * Página de Lanzamiento: Gano Excel Brasil
 * Update: Corrección Botón Hero + Urgencia 7 Dic Visual
 */

'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Globe, ArrowRight, Star, Coffee, AlertCircle, Building, CheckCircle, Flag, Gift, PackagePlus, CreditCard, ChevronRight, Eye } from 'lucide-react'
import Link from 'next/link'
import StrategicNavigation from '@/components/StrategicNavigation'
import { useHydration } from '@/hooks/useHydration'
import Image from 'next/image'

// Enlace de WhatsApp Configurado (Solo para cierre final)
const WA_LINK = "https://wa.me/573102066593?text=Ol%C3%A1%2C%20tenho%20interesse%20nos%20produtos%20e%20pacotes%20da%20Gano%20Excel%20no%20Brasil";

// --- DICCIONARIO DE CONTENIDO (ES / PT) ---
const content = {
  es: {
    badge: "Lanzamiento Oficial 2026",
    hero_title_1: "El Gigante ha Despertado.",
    hero_title_2: "Brasil es Territorio Gano Excel.",
    hero_desc: "La economía número 1 de América Latina abre sus puertas. La infraestructura física ya está en São Paulo. La infraestructura digital está en tus manos con CreaTuActivo.",
    btn_products: "Ver Promociones", // Ahora lleva a la sección, no a WA
    btn_expand: "Cómo Afiliarse",

    // --- UPDATE: PROMOCIONES ---
    promo_title: "Oportunidades Flash",
    promo_subtitle: "Válido hasta 07 Dic 2026",

    // Textos Visuales de la Tarjeta Derecha
    promo_visual_top: "CIERRE DE AÑO",
    promo_visual_middle: "HASTA 07 DIC", // Fecha límite explícita

    promo_1_title: "PAGUE 5, LLEVE 6",
    promo_1_desc: "En referencias seleccionadas de Café Trufado.",

    promo_2_title: "PRODUCTOS GRATIS",
    promo_2_desc: "Recibe cajas extra de regalo al comprar tu Paquete Empresarial (ESP 1, 2 o 3).",

    promo_3_title: "NUEVO KIT VISIÓN",
    promo_3_desc: "Tu puerta de entrada accesible por solo R$ 190,00 (aprox).",

    strategy_title: "La Estrategia 'Trufada':",
    strategy_subtitle: "Lujo y Exclusividad",
    strategy_desc: "Para entrar al mercado brasileño con total cumplimiento legal, Gano Excel ha ejecutado una jugada maestra de marketing y formulación.",
    reto_title: "El Reto Regulatorio",
    reto_desc: "En Brasil, la regulación sanitaria tiene restricciones sobre la comercialización masiva de 'hongos medicinales' en alimentos.",
    solucion_title: "La Solución Premium",
    solucion_desc: "Evolucionamos a 'Bebidas Trufadas'. La trufa es sinónimo mundial de lujo gastronómico. Mismo bienestar, estatus elevado.",
    note: "* Nota para constructores: El vehículo de bienestar sigue siendo el mismo ADN de excelencia, pero el 'empaque' narrativo se adapta para conquistar el paladar exigente de Brasil.",

    // --- SECCIÓN AFILIACIÓN ---
    affiliate_title: "¿Cómo Afiliarse a Gano Excel Brasil?",
    affiliate_subtitle: "Elige tu nivel de entrada al mercado más grande de LATAM.",
    affiliate_step_1: "Elige tu Paquete",
    affiliate_step_2: "Registro Oficial",
    affiliate_step_3: "Activación Digital",

    // Paquetes
    kit_name: "Kit Visión (Nuevo)",
    kit_price: "R$ 190,00",
    kit_desc: "Acceso básico + 2 Cajas de Producto.",

    esp1_name: "Paquete ESP 1",
    esp1_price: "R$ 900,00",
    esp1_desc: "+ Regalo: 1 Caja Extra.",

    esp2_name: "Paquete ESP 2",
    esp2_price: "R$ 2.250,00",
    esp2_desc: "+ Regalo: 2 Cajas Extra.",

    esp3_name: "Paquete ESP 3",
    esp3_price: "R$ 4.500,00",
    esp3_desc: "+ Regalo: 4 Cajas Extra (Máxima Rentabilidad).",

    catalog_title: "Colección Brasil 2026",
    catalog_sub: "La fusión perfecta entre el café premium y la sofisticación de la trufa.",

    infra_title_1: "Infraestructura Física",
    infra_title_2: "Ya Instalada.",
    infra_desc: "Gano Excel no llegó a 'probar suerte'. Llegó con infraestructura corporativa completa. Tú no tienes que invertir en oficinas ni logística.",
    hq_title: "Sede Corporativa São Paulo",
    hq_desc: "Av. Rebouças 2455, Pinheiros. El corazón financiero de Brasil.",
    legal_title: "Legalidad Total",
    legal_desc: "Operación 100% constituida bajo leyes brasileñas (CNPJ y ANVISA).",

    alert_title: "Para Distribuidores Existentes",
    alert_desc: "Proceso de Nacionalización de Código ID activo.",
    alert_list_1: "Solicitud disponible (proceso activo).",
    alert_list_2: "Requiere CPF (Cadastro de Pessoas Físicas).",
    alert_list_3: "Gestión directa con SAC Gano Excel Brasil.",

    cta_title_1: "No necesitas vivir en Brasil",
    cta_title_2: "para ganar en Brasil.",
    cta_desc: "Construye tu equipo internacional usando la arquitectura digital de CreaTuActivo.",
    cta_btn: "Iniciar Expansión Ahora",

    products: [
      {
        id: '3in1',
        name: 'GanoCafé 3in1 Trufado',
        tagline: 'Cremoso e Irresistível',
        desc: 'La evolución gourmet del clásico 3-en-1. Enriquecido con trufa para un perfil de sabor sofisticado y bienestar premium.',
        image: '/images/brasil/ganocafe-3-in-1-trufado-min.png'
      },
      {
        id: 'clasico',
        name: 'GanoCafé Clássico Trufado',
        tagline: 'Intensidade e Equilíbrio',
        desc: 'Para el purista del café. Sabor robusto y oscuro con el toque exclusivo de la trufa. Energía pura sin azúcar.',
        image: '/images/brasil/ganocafe-clasico-trufado-min.png'
      },
      {
        id: 'choc',
        name: 'GanoCafé Chocolate Trufado',
        tagline: 'Prazer em cada gole',
        desc: 'Una experiencia de cacao suizo de alta gama fusionado con el poder del bienestar. Ideal para toda la familia.',
        image: '/images/brasil/ganocafe-chocolate-trufado-min.png'
      },
      {
        id: 'latte',
        name: 'GanoCafé Latte Trufado',
        tagline: 'Suavidade com toque sofisticado',
        desc: 'Experiencia barista en casa. Textura láctea sedosa con el aroma inconfundible de la trufa.',
        image: '/images/brasil/ganocafe-latte-trufado-min.png'
      }
    ]
  },
  pt: {
    badge: "Lançamento Oficial 2026",
    hero_title_1: "O Gigante Acordou.",
    hero_title_2: "Brasil é Território Gano Excel.",
    hero_desc: "A economia número 1 da América Latina abre suas portas. A infraestrutura física já está em São Paulo. A infraestrutura digital está em suas mãos com CreaTuActivo.",
    btn_products: "Ver Promoções",
    btn_expand: "Como se Afiliar",

    // --- UPDATE: PROMOCIONES PT ---
    promo_title: "Oportunidades Flash",
    promo_subtitle: "Válido até 07 Dez 2026",

    // Textos Visuais
    promo_visual_top: "ENCERRAMENTO DE ANO",
    promo_visual_middle: "ATÉ 07 DEZ", // Data limite explícita

    promo_1_title: "PAGUE 5, LEVE 6",
    promo_1_desc: "Em referências selecionadas de Café Trufado.",

    promo_2_title: "PRODUTOS GRÁTIS",
    promo_2_desc: "Receba caixas extras de presente na compra do seu Pacote Empresarial (ESP 1, 2 ou 3).",

    promo_3_title: "NOVO KIT VISÃO",
    promo_3_desc: "Sua porta de entrada acessível por apenas R$ 190,00 (aprox).",

    strategy_title: "A Estratégia 'Trufada':",
    strategy_subtitle: "Luxo e Exclusividade",
    strategy_desc: "Para entrar no mercado brasileiro com total conformidade legal, a Gano Excel executou uma jogada mestre de marketing e formulação.",
    reto_title: "O Desafio Regulatório",
    reto_desc: "No Brasil, a regulação sanitária possui restrições específicas sobre a comercialização massiva de 'cogumelos medicinais' em alimentos.",
    solucion_title: "A Solução Premium",
    solucion_desc: "Evoluímos para 'Bebidas Trufadas'. A trufa é sinônimo mundial de luxo gastronômico. Mantemos o perfil de bem-estar, mas elevamos o status para 'Gourmet'.",
    note: "* Nota para construtores: O veículo de bem-estar continua sendo o mesmo DNA de excelência, mas a narrativa se adapta para conquistar o paladar exigente do Brasil.",

    // --- SECCIÓN AFILIACIÓN ---
    affiliate_title: "Como se Afiliar à Gano Excel Brasil?",
    affiliate_subtitle: "Escolha seu nível de entrada no maior mercado da LATAM.",
    affiliate_step_1: "Escolha seu Pacote",
    affiliate_step_2: "Cadastro Oficial",
    affiliate_step_3: "Ativação Digital",

    // Pacotes PT
    kit_name: "Kit Visão (Novo)",
    kit_price: "R$ 190,00",
    kit_desc: "Acesso básico + 2 Caixas de Produto.",

    esp1_name: "Pacote ESP 1",
    esp1_price: "R$ 900,00",
    esp1_desc: "+ Presente: 1 Caixa Extra.",

    esp2_name: "Pacote ESP 2",
    esp2_price: "R$ 2.250,00",
    esp2_desc: "+ Presente: 2 Caixas Extra.",

    esp3_name: "Pacote ESP 3",
    esp3_price: "R$ 4.500,00",
    esp3_desc: "+ Presente: 4 Caixas Extra (Máxima Rentabilidade).",

    catalog_title: "Coleção Brasil 2026",
    catalog_sub: "A fusão perfeita entre o café premium e a sofisticação da trufa.",

    infra_title_1: "Infraestrutura Física",
    infra_title_2: "Já Instalada.",
    infra_desc: "A Gano Excel não chegou para 'tentar a sorte'. Chegou com infraestrutura corporativa completa. Você não precisa investir em escritórios ou logística.",
    hq_title: "Sede Corporativa São Paulo",
    hq_desc: "Av. Rebouças 2455, Pinheiros. O coração financeiro do Brasil.",
    legal_title: "Legalidade Total",
    legal_desc: "Operação 100% constituída sob leis brasileiras (CNPJ e ANVISA).",

    alert_title: "Para Distribuidores Existentes",
    alert_desc: "Processo de Nacionalização de Código ID ativo.",
    alert_list_1: "Solicitação disponível (processo ativo).",
    alert_list_2: "Requer CPF (Cadastro de Pessoas Físicas).",
    alert_list_3: "Gestão direta com SAC Gano Excel Brasil.",

    cta_title_1: "Você não precisa morar no Brasil",
    cta_title_2: "para ganhar no Brasil.",
    cta_desc: "Construa sua equipe internacional usando a arquitetura digital do CreaTuActivo.",
    cta_btn: "Iniciar Expansão Agora",

    products: [
      {
        id: '3in1',
        name: 'GanoCafé 3in1 Trufado',
        tagline: 'Cremoso e Irresistível',
        desc: 'A evolução gourmet do clássico 3-em-1. Enriquecido com trufa para um perfil de sabor sofisticado e bem-estar premium.',
        image: '/images/brasil/ganocafe-3-in-1-trufado-min.png'
      },
      {
        id: 'clasico',
        name: 'GanoCafé Clássico Trufado',
        tagline: 'Intensidade e Equilíbrio',
        desc: 'Para o purista do café. Sabor robusto e escuro com o toque exclusivo da trufa. Energia pura sem açúcar.',
        image: '/images/brasil/ganocafe-clasico-trufado-min.png'
      },
      {
        id: 'choc',
        name: 'GanoCafé Chocolate Trufado',
        tagline: 'Prazer em cada gole',
        desc: 'Uma experiência de cacau suíço de alta gama fundido com o poder do bem-estar. Ideal para toda a família.',
        image: '/images/brasil/ganocafe-chocolate-trufado-min.png'
      },
      {
        id: 'latte',
        name: 'GanoCafé Latte Trufado',
        tagline: 'Suavidade com toque sofisticado',
        desc: 'Experiência barista em casa. Textura láctea sedosa com o aroma inconfundível da trufa.',
        image: '/images/brasil/ganocafe-latte-trufado-min.png'
      }
    ]
  }
};

// --- Estilos Globales ---
const GlobalStyles = () => (
  <style jsx global>{`
    :root {
      --brasil-green: #009C3B;
      --brasil-yellow: #FFDF00;
    }
    .creatuactivo-card {
      background: linear-gradient(135deg, rgba(30, 64, 175, 0.1) 0%, rgba(124, 58, 237, 0.1) 100%);
      backdrop-filter: blur(24px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 20px;
    }
    .product-card-brasil {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 223, 0, 0.2);
      border-radius: 16px;
      transition: all 0.3s ease;
    }
    .product-card-brasil:hover {
      transform: translateY(-5px);
      border-color: var(--brasil-yellow);
      box-shadow: 0 10px 30px rgba(0, 156, 59, 0.1);
    }
    .lang-switch-btn {
      transition: all 0.3s ease;
    }
    .lang-switch-btn.active {
      background: white;
      color: black;
      font-weight: bold;
    }
    .lang-switch-btn.inactive {
      background: transparent;
      color: rgba(255,255,255,0.6);
    }
    .lang-switch-btn.inactive:hover {
      color: white;
    }
    .promo-badge {
      animation: pulse-border 2s infinite;
    }
    @keyframes pulse-border {
      0% { box-shadow: 0 0 0 0 rgba(255, 223, 0, 0.4); }
      70% { box-shadow: 0 0 0 10px rgba(255, 223, 0, 0); }
      100% { box-shadow: 0 0 0 0 rgba(255, 223, 0, 0); }
    }
  `}</style>
);

export default function BrasilLaunchPage() {
  const isHydrated = useHydration()
  const [lang, setLang] = useState<'es' | 'pt'>('es');
  const t = content[lang];

  return (
    <>
      <GlobalStyles />
      <div className="bg-slate-900 text-white min-h-screen font-sans selection:bg-green-500 selection:text-white">
        <StrategicNavigation />

        {/* SELECTOR DE IDIOMA FLOTANTE */}
        <div className="fixed top-24 right-4 z-50 bg-black/40 backdrop-blur-md border border-white/10 rounded-full p-1 flex gap-1 shadow-xl">
          <button onClick={() => setLang('es')} className={`lang-switch-btn px-3 py-1 rounded-full text-sm ${lang === 'es' ? 'active' : 'inactive'}`}>ES</button>
          <button onClick={() => setLang('pt')} className={`lang-switch-btn px-3 py-1 rounded-full text-sm ${lang === 'pt' ? 'active' : 'inactive'}`}>PT</button>
        </div>

        {/* Background Effects */}
        <div className="fixed top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
          <Image src="/images/brasil/ganoexcel-brazil.webp" alt="Fondo Brasil Gano Excel" fill className="object-cover opacity-60" priority />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/40 via-slate-900/80 to-black"></div>
        </div>

        <main className="relative z-10">

          {/* SECCIÓN 1: HERO */}
          <section className="pt-32 pb-10 px-4 text-center">
            <motion.div initial={isHydrated ? { opacity: 0, y: 20 } : false} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-5xl mx-auto">
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-8">
                <Flag className="w-4 h-4 text-green-400" />
                <span className="text-sm font-semibold tracking-wider uppercase text-green-400">{t.badge}</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight tracking-tight">
                {t.hero_title_1}<br />
                <span className="bg-gradient-to-r from-green-400 via-yellow-400 to-green-400 bg-clip-text text-transparent">{t.hero_title_2}</span>
              </h1>
              <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-10 leading-relaxed">{t.hero_desc}</p>

              {/* BOTONES HERO ACTUALIZADOS */}
              <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
                <Link href="#promociones" className="bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 text-black px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg shadow-yellow-500/20 flex items-center justify-center gap-2 promo-badge">
                  <Gift className="w-5 h-5" />
                  {t.btn_products}
                </Link>
                <Link href="#afiliacion" className="bg-white/5 border border-white/10 hover:bg-white/10 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2">
                  <Globe className="w-5 h-5" />
                  {t.btn_expand}
                </Link>
              </div>
            </motion.div>
          </section>

          {/* SECCIÓN ACTUALIZADA: OPORTUNIDADES FLASH */}
          <section id="promociones" className="py-10 px-4">
            <div className="max-w-5xl mx-auto">
              <div className="bg-gradient-to-r from-green-900/40 to-slate-900 border border-green-500/30 rounded-2xl p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 -mt-4 -mr-4 bg-yellow-500 text-black font-bold text-xs px-4 py-2 rounded-full transform rotate-12 shadow-lg">
                  {t.promo_subtitle}
                </div>

                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                      <Star className="text-yellow-400 fill-yellow-400" /> {t.promo_title}
                    </h2>

                    <div className="space-y-4">
                      {/* Promo 1: 5x6 */}
                      <div className="flex items-start gap-4 bg-white/5 p-4 rounded-xl">
                        <Gift className="w-8 h-8 text-yellow-400 flex-shrink-0" />
                        <div>
                          <h3 className="font-bold text-yellow-400">{t.promo_1_title}</h3>
                          <p className="text-sm text-slate-300">{t.promo_1_desc}</p>
                        </div>
                      </div>

                      {/* Promo 2: Productos Gratis en Paquetes */}
                      <div className="flex items-start gap-4 bg-white/5 p-4 rounded-xl">
                        <PackagePlus className="w-8 h-8 text-green-400 flex-shrink-0" />
                        <div>
                          <h3 className="font-bold text-green-400">{t.promo_2_title}</h3>
                          <p className="text-sm text-slate-300">{t.promo_2_desc}</p>
                        </div>
                      </div>

                      {/* Promo 3: Kit Vision */}
                      <div className="flex items-start gap-4 bg-white/5 p-4 rounded-xl">
                        <Eye className="w-8 h-8 text-blue-400 flex-shrink-0" />
                        <div>
                          <h3 className="font-bold text-blue-400">{t.promo_3_title}</h3>
                          <p className="text-sm text-slate-300">{t.promo_3_desc}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Visual de Acción - ACTUALIZADO CON FECHA EXACTA */}
                  <div className="bg-slate-800/50 rounded-xl p-6 flex items-center justify-center border border-white/5 h-full">
                    <div className="text-center">
                      <p className="text-sm text-slate-400 uppercase tracking-widest mb-2">{t.promo_visual_top}</p>
                      <p className="text-3xl font-extrabold text-white mb-2">{t.promo_visual_middle}</p>
                      <p className="text-xl text-yellow-400 font-bold">2026</p>
                      <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="mt-6 inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors">
                        Aprovechar Ahora →
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SECCIÓN ACTUALIZADA: CÓMO AFILIARSE */}
          <section id="afiliacion" className="py-16 px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">{t.affiliate_title}</h2>
                <p className="text-slate-400">{t.affiliate_subtitle}</p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Kit Visión */}
                <div className="creatuactivo-card p-5 border-t-4 border-t-blue-400">
                  <div className="text-xs font-bold text-blue-400 mb-2 uppercase">Entrada Básica</div>
                  <h3 className="text-lg font-bold text-white mb-1">{t.kit_name}</h3>
                  <p className="text-xl font-bold text-yellow-400 mb-2">{t.kit_price}</p>
                  <p className="text-xs text-slate-400 mb-4">{t.kit_desc}</p>
                </div>

                {/* ESP 1 */}
                <div className="creatuactivo-card p-5 border-t-4 border-t-green-500">
                  <div className="text-xs font-bold text-green-500 mb-2 uppercase">Emprendedor</div>
                  <h3 className="text-lg font-bold text-white mb-1">{t.esp1_name}</h3>
                  <p className="text-xl font-bold text-yellow-400 mb-2">{t.esp1_price}</p>
                  <p className="text-xs text-green-400 font-semibold mb-4">{t.esp1_desc}</p>
                </div>

                {/* ESP 2 */}
                <div className="creatuactivo-card p-5 border-t-4 border-t-purple-500">
                  <div className="text-xs font-bold text-purple-500 mb-2 uppercase">Empresarial</div>
                  <h3 className="text-lg font-bold text-white mb-1">{t.esp2_name}</h3>
                  <p className="text-xl font-bold text-yellow-400 mb-2">{t.esp2_price}</p>
                  <p className="text-xs text-purple-400 font-semibold mb-4">{t.esp2_desc}</p>
                </div>

                {/* ESP 3 */}
                <div className="creatuactivo-card p-5 border-t-4 border-t-yellow-500 bg-gradient-to-b from-yellow-900/20 to-slate-900">
                  <div className="text-xs font-bold text-yellow-500 mb-2 uppercase">Fundador</div>
                  <h3 className="text-lg font-bold text-white mb-1">{t.esp3_name}</h3>
                  <p className="text-xl font-bold text-yellow-400 mb-2">{t.esp3_price}</p>
                  <p className="text-xs text-yellow-400 font-semibold mb-4">{t.esp3_desc}</p>
                </div>
              </div>

              <div className="mt-8 text-center">
                <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="inline-flex items-center bg-white text-slate-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-slate-200 transition-colors shadow-lg">
                  {t.cta_btn} <ChevronRight className="ml-2 w-5 h-5" />
                </a>
              </div>
            </div>
          </section>

          {/* SECCIÓN 2: EL PIVOT ESTRATÉGICO (TRUFAS) */}
          <section className="py-16 px-4 bg-white/5">
            <div className="max-w-4xl mx-auto">
              <div className="creatuactivo-card p-8 md:p-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <Star className="w-32 h-32 text-yellow-500" />
                </div>

                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
                  {t.strategy_title} <br/>
                  <span className="text-yellow-400">{t.strategy_subtitle}</span>
                </h2>

                <div className="space-y-6 text-lg text-slate-300">
                  <p>{t.strategy_desc}</p>

                  <div className="grid md:grid-cols-2 gap-8 mt-8">
                    <div className="bg-black/20 p-6 rounded-xl border-l-4 border-yellow-500">
                      <h3 className="text-xl font-bold text-white mb-2">{t.reto_title}</h3>
                      <p className="text-sm">{t.reto_desc}</p>
                    </div>

                    <div className="bg-green-900/20 p-6 rounded-xl border-l-4 border-green-500">
                      <h3 className="text-xl font-bold text-white mb-2">{t.solucion_title}</h3>
                      <p className="text-sm">{t.solucion_desc}</p>
                    </div>
                  </div>

                  <p className="italic text-sm text-slate-400 mt-4 border-t border-white/10 pt-4">
                    {t.note}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* SECCIÓN 3: CATÁLOGO DE PRODUCTOS */}
          <section id="productos" className="py-20 px-4">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold mb-4">{t.catalog_title}</h2>
                <p className="text-slate-400">{t.catalog_sub}</p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {t.products.map((product) => (
                  <div key={product.id} className="product-card-brasil p-6 flex flex-col h-full">
                    {/* Imagen del Producto */}
                    <div className="aspect-square bg-gradient-to-br from-slate-800 to-slate-700 rounded-xl mb-6 flex items-center justify-center relative overflow-hidden group">

                      <div className="relative w-full h-full p-4 transition-transform duration-300 group-hover:scale-110">
                        <Image
                          src={product.image}
                          alt={product.name}
                          width={800}
                          height={800}
                          className="object-contain w-full h-full drop-shadow-2xl"
                        />
                      </div>

                      {/* Badge Brasil */}
                      <div className="absolute top-3 right-3 bg-green-600 text-white text-[10px] font-bold px-2 py-1 rounded-full z-10">
                        BRASIL
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-1">{product.name}</h3>
                    <p className="text-xs font-semibold text-yellow-500 mb-3 uppercase tracking-wider">{product.tagline}</p>
                    <p className="text-sm text-slate-400 leading-relaxed flex-grow">
                      {product.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* SECCIÓN 4: INFRAESTRUCTURA */}
          <section className="py-20 px-4 bg-gradient-to-b from-slate-900 to-black">
            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-12 items-center">

                <div className="space-y-8">
                  <h2 className="text-3xl md:text-5xl font-bold">
                    {t.infra_title_1}<br/>
                    <span className="text-slate-500">{t.infra_title_2}</span>
                  </h2>
                  <p className="text-lg text-slate-300">{t.infra_desc}</p>

                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="bg-blue-900/30 p-3 rounded-lg text-blue-400">
                        <Building className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-lg">{t.hq_title}</h4>
                        <p className="text-slate-400">{t.hq_desc}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="bg-green-900/30 p-3 rounded-lg text-green-400">
                        <CheckCircle className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-lg">{t.legal_title}</h4>
                        <p className="text-slate-400">{t.legal_desc}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-yellow-500/10 border border-yellow-500/20 rounded-xl mt-6">
                    <div className="flex items-center gap-3 mb-2">
                      <AlertCircle className="w-5 h-5 text-yellow-500" />
                      <h4 className="font-bold text-white">{t.alert_title}</h4>
                    </div>
                    <p className="text-sm text-slate-300 mb-3">
                      {t.alert_desc}
                    </p>
                    <ul className="text-xs text-slate-400 space-y-1 list-disc pl-4">
                      <li>{t.alert_list_1}</li>
                      <li>{t.alert_list_2}</li>
                      <li>{t.alert_list_3}</li>
                    </ul>
                  </div>
                </div>

                {/* Mapa Placeholder */}
                <div className="relative h-[500px] bg-slate-800 rounded-2xl overflow-hidden border border-white/10 group">
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-green-900/20 to-slate-900">
                    <div className="text-center">
                      <MapPin className="w-16 h-16 text-green-500 mx-auto mb-4 animate-bounce" />
                      <p className="text-slate-500 font-mono">SÃO PAULO HQ</p>
                      <p className="text-slate-600 text-sm">Av. Rebouças 2455</p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </section>

          {/* CTA FINAL */}
          <section className="py-20 text-center px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl md:text-6xl font-bold mb-8 text-white">
                {t.cta_title_1}<br/>
                <span className="text-slate-500">{t.cta_title_2}</span>
              </h2>
              <p className="text-xl text-slate-400 mb-10">
                {t.cta_desc}
              </p>

              <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="inline-flex items-center bg-white text-slate-900 px-10 py-5 rounded-full font-bold text-xl hover:bg-slate-200 transition-colors shadow-2xl shadow-white/10">
                {t.cta_btn} <ArrowRight className="ml-2 w-6 h-6" />
              </a>
            </div>
          </section>

        </main>
      </div>
    </>
  )
}
