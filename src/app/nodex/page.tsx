'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, CheckCircle, Copy, Crown, Rocket, Users, BarChart3, Edit, X, Zap, UserCheck, Construction } from 'lucide-react'
import Link from 'next/link'
import NodeXSidebar from '@/components/NodeXSidebar'

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
      border: 1px solid rgba(124, 58, 237, 0.2);
      border-radius: 20px;
      transition: all 0.4s ease;
      position: relative;
      overflow: hidden;
    }

    .creatuactivo-ecosystem-card:hover {
      border-color: rgba(245, 158, 11, 0.5);
      transform: translateY(-4px) scale(1.02);
    }

    .creatuactivo-cta-ecosystem {
      background: linear-gradient(135deg, var(--creatuactivo-blue) 0%, var(--creatuactivo-purple) 100%);
      border-radius: 16px;
      padding: 18px 36px;
      font-weight: 700;
      color: white;
      transition: all 0.3s ease;
      box-shadow: 0 6px 20px rgba(30, 64, 175, 0.4);
    }

    .creatuactivo-cta-ecosystem:hover {
      transform: translateY(-3px);
      box-shadow: 0 12px 35px rgba(30, 64, 175, 0.5);
    }
     .form-input {
        background-color: rgba(30, 41, 59, 0.5);
        border: 1px solid rgba(124, 58, 237, 0.2);
        color: white;
        border-radius: 12px;
        padding: 0.75rem 1rem;
        width: 100%;
        transition: all 0.3s ease;
    }
    .form-input:focus {
        outline: none;
        border-color: var(--creatuactivo-purple);
        box-shadow: 0 0 15px rgba(124, 58, 237, 0.3);
    }
  `}</style>
);

// --- Componente de Tarjeta de Métrica del Dashboard ---
const MetricCard = ({ title, value, icon, color }: {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}) => (
    <div className="creatuactivo-ecosystem-card p-6">
        <div className="flex items-center justify-between">
            <p className={`font-semibold text-sm ${color}`}>{title}</p>
            <div className="text-slate-500">{icon}</div>
        </div>
        <p className="text-4xl font-bold text-white mt-2">{value}</p>
    </div>
);

// --- Componente Modal para Editar Perfil ---
const ProfileModal = ({ isOpen, onClose, constructorData, setConstructorData }: {
  isOpen: boolean;
  onClose: () => void;
  constructorData: any;
  setConstructorData: (data: any) => void;
}) => {
    const [localData, setLocalData] = useState(constructorData);

    React.useEffect(() => {
        setLocalData(constructorData);
    }, [constructorData]);

    const handleSave = () => {
        setConstructorData(localData);
        // Aquí iría la llamada a Supabase para guardar los datos
        console.log("Guardando en Supabase:", localData);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="creatuactivo-ecosystem-card w-full max-w-lg"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="creatuactivo-h2-component text-2xl font-bold">Editar Perfil de Arquitecto</h2>
                        <button onClick={onClose} className="text-slate-400 hover:text-white"><X /></button>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Nombre Completo</label>
                            <input type="text" value={localData.name} onChange={e => setLocalData({...localData, name: e.target.value})} className="form-input" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">WhatsApp</label>
                            <input type="text" value={localData.whatsapp} onChange={e => setLocalData({...localData, whatsapp: e.target.value})} className="form-input" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Enlace de Activación Directa</label>
                            <input type="text" value={localData.affiliationLink} onChange={e => setLocalData({...localData, affiliationLink: e.target.value})} className="form-input" />
                        </div>
                        <div className="pt-4 flex justify-end">
                            <button onClick={handleSave} className="creatuactivo-cta-ecosystem text-base py-2 px-6">
                                Guardar Cambios
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

// --- Componente Principal de la Página de NodeX ---
export default function NodeXPage() {
    const [constructorData, setConstructorData] = useState({
        name: "Carlos",
        id: "carlos-perez-123",
        affiliationLink: "https://ganoexcel.com/afiliacion/carlosperez123",
        whatsapp: "+573001234567"
    });
    const [copiedLink, setCopiedLink] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleCopy = (linkType: string) => {
        let linkToCopy = '';
        if (linkType === 'affiliation') {
            linkToCopy = constructorData.affiliationLink;
        } else {
            linkToCopy = `https://CreaTuActivo.com/${linkType}?ref=${constructorData.id}`;
        }
        navigator.clipboard.writeText(linkToCopy);
        setCopiedLink(linkType);
        setTimeout(() => setCopiedLink(null), 2000);
    };

    return (
        <>
            <GlobalStyles />

            {/* ✅ ARQUITECTURA CORREGIDA: Sidebar wrapper sin double layout */}
            <NodeXSidebar>
                {/* ✅ CONTENIDO DIRECTO - Sin wrapper adicional de layout */}
                <div className="p-6 text-white relative">
                    {/* Background Effects */}
                    <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                        <div className="absolute -top-1/4 -left-1/4 w-96 h-96 bg-[var(--creatuactivo-blue)] opacity-10 rounded-full filter blur-3xl animate-pulse"></div>
                        <div className="absolute -bottom-1/4 -right-1/4 w-96 h-96 bg-[var(--creatuactivo-purple)] opacity-10 rounded-full filter blur-3xl animate-pulse animation-delay-4000"></div>
                    </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="relative z-10"
                >
                    {/* Header Welcome */}
                    <div className="mb-12">
                        <h1 className="creatuactivo-h1-ecosystem text-4xl md:text-5xl">
                            Bienvenido, {constructorData.name}.
                        </h1>
                        <p className="text-slate-300 text-lg mt-2">Este es NodeX, tu centro de comando.</p>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-8">

                            {/* Perfil de Arquitecto */}
                            <div className="creatuactivo-ecosystem-card p-8">
                                <h2 className="text-2xl font-bold text-white mb-4">Tu Perfil de Arquitecto</h2>
                                <p className="text-slate-400 mb-6">Este es el primer paso. Asegúrate de que tus datos y enlaces estén correctos. Esta información se usará para personalizar tus herramientas.</p>
                                <div className="bg-slate-900/50 p-4 rounded-lg text-sm text-slate-300 space-y-2">
                                    <p><strong>ID de Constructor:</strong> {constructorData.id}</p>
                                    <p><strong>WhatsApp de Contacto:</strong> {constructorData.whatsapp}</p>
                                </div>
                                <button onClick={() => setIsModalOpen(true)} className="w-full md:w-auto mt-4 bg-slate-700/70 hover:bg-slate-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm">
                                    <Edit className="w-4 h-4" /> Editar Perfil y Enlaces
                                </button>
                            </div>

                            {/* Arsenal de Enlaces */}
                            <div className="creatuactivo-ecosystem-card p-8">
                                <h2 className="text-2xl font-bold text-white mb-4">Tu Arsenal de Enlaces</h2>
                                <p className="text-slate-400 mb-6">Estas son tus herramientas para expandir el ecosistema. Cada enlace es único para ti.</p>
                                <div className="space-y-4">
                                    <div className="bg-slate-900/50 p-4 rounded-lg flex items-center justify-between">
                                        <div>
                                            <p className="font-semibold text-white">Enlace de Presentación</p>
                                            <p className="text-xs text-slate-500">Para nuevos constructores potenciales</p>
                                        </div>
                                        <button onClick={() => handleCopy('presentacion-empresarial')} className="bg-slate-700 hover:bg-slate-600 text-slate-300 font-medium py-2 px-4 rounded-lg transition-colors flex items-center gap-2">
                                            {copiedLink === 'presentacion-empresarial' ? <CheckCircle className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5" />}
                                            {copiedLink === 'presentacion-empresarial' ? 'Copiado' : 'Copiar'}
                                        </button>
                                    </div>
                                    <div className="bg-slate-900/50 p-4 rounded-lg flex items-center justify-between">
                                        <div>
                                            <p className="font-semibold text-white">Enlace a Fundadores</p>
                                            <p className="text-xs text-slate-500">Para la invitación exclusiva (tiempo limitado)</p>
                                        </div>
                                        <button onClick={() => handleCopy('fundadores')} className="bg-slate-700 hover:bg-slate-600 text-slate-300 font-medium py-2 px-4 rounded-lg transition-colors flex items-center gap-2">
                                            {copiedLink === 'fundadores' ? <CheckCircle className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5" />}
                                            {copiedLink === 'fundadores' ? 'Copiado' : 'Copiar'}
                                        </button>
                                    </div>
                                    <div className="bg-slate-900/50 p-4 rounded-lg flex items-center justify-between">
                                        <div>
                                            <p className="font-semibold text-white">Enlace al Catálogo de Productos</p>
                                            <p className="text-xs text-slate-500">Para interesados en el motor de valor</p>
                                        </div>
                                        <button onClick={() => handleCopy('sistema/productos')} className="bg-slate-700 hover:bg-slate-600 text-slate-300 font-medium py-2 px-4 rounded-lg transition-colors flex items-center gap-2">
                                            {copiedLink === 'sistema/productos' ? <CheckCircle className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5" />}
                                            {copiedLink === 'sistema/productos' ? 'Copiado' : 'Copiar'}
                                        </button>
                                    </div>
                                    <div className="bg-slate-900/50 p-4 rounded-lg flex items-center justify-between border-2 border-transparent border-dashed hover:border-[var(--creatuactivo-gold)] transition-all">
                                        <div>
                                            <p className="font-semibold text-white flex items-center gap-2">Enlace de Activación Directa <span className="text-xs bg-[var(--creatuactivo-gold)]/20 text-[var(--creatuactivo-gold)] px-2 py-0.5 rounded-full">¡PODEROSO!</span></p>
                                            <p className="text-xs text-slate-500">Para el que te dice: "¡Estoy listo! ¿Dónde pago?"</p>
                                        </div>
                                        <button onClick={() => handleCopy('affiliation')} className="bg-slate-700 hover:bg-slate-600 text-slate-300 font-medium py-2 px-4 rounded-lg transition-colors flex items-center gap-2">
                                            {copiedLink === 'affiliation' ? <CheckCircle className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5" />}
                                            {copiedLink === 'affiliation' ? 'Copiado' : 'Copiar'}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Próxima Misión */}
                            <div className="creatuactivo-ecosystem-card p-8 bg-gradient-to-br from-[var(--creatuactivo-blue)]/20 to-[var(--creatuactivo-purple)]/20">
                                <div className="flex items-start gap-4">
                                    <div className="bg-yellow-500/20 p-3 rounded-full mt-1"><Rocket className="w-6 h-6 text-[var(--creatuactivo-gold)]" /></div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-white mb-2">Tu Próxima Misión: Ejecuta tu Primer INICIAR</h2>
                                        <p className="text-slate-300 mb-4">Ahora que tus herramientas están listas, es momento de poner el sistema a trabajar. Ve al Centro de Inteligencia para generar tu primer mensaje personalizado.</p>
                                        <Link href="/nodex/inteligencia" className="font-bold text-blue-400 hover:text-blue-300 transition-colors">
                                            Ir al Centro de Inteligencia <ArrowRight className="inline w-4 h-4" />
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            {/* Informes de Inteligencia */}
                            <div className="creatuactivo-ecosystem-card p-8">
                                <h2 className="text-2xl font-bold text-white mb-4">Tus Informes de Inteligencia</h2>
                                <p className="text-slate-400 mb-6">Aquí aparecerán los análisis de los constructores potenciales que exploren tus enlaces.</p>
                                <div className="text-center py-10 bg-slate-900/50 rounded-lg border border-dashed border-white/10">
                                    <p className="text-slate-500">Aún no hay informes. ¡Ejecuta tu primer INICIAR!</p>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar Derecho - Pipeline Métricas */}
                        <div className="space-y-8">
                            <h3 className="text-xl font-bold text-white pt-4">Pipeline de tu Activo</h3>
                            <MetricCard title="En INICIAR" value="0" icon={<Zap />} color="text-blue-400" />
                            <MetricCard title="En ACOGER" value="0" icon={<Users />} color="text-purple-400" />
                            <MetricCard title="ACTIVADOS" value="0" icon={<UserCheck />} color="text-green-400" />

                            <div className="opacity-50">
                                <h3 className="text-xl font-bold text-white pt-4 flex items-center gap-2"><Construction size={20}/> En Construcción</h3>
                                <div className="space-y-8 mt-4 pointer-events-none">
                                    <MetricCard title="Volumen del Canal (CV)" value="-" icon={<BarChart3 />} />
                                    <MetricCard title="Ingreso Proyectado (Mes)" value="-" icon={<Crown />} />
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                    {/* Modal Editar Perfil */}
                    <ProfileModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        constructorData={constructorData}
                        setConstructorData={setConstructorData}
                    />
                </div>
            </NodeXSidebar>
        </>
    );
}
