'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Lock, Bell, Link as LinkIcon, Save } from 'lucide-react'
import Link from 'next/link'
import NodeXSidebar from '@/components/NodeXSidebar'

// --- Estilos CSS Globales (Sin cambios) ---
const GlobalStyles = () => (
  <style jsx global>{`
    :root {
      --creatuactivo-blue: #1E40AF;
      --creatuactivo-purple: #7C3AED;
      --creatuactivo-gold: #F59E0B;
    }

    .creatuactivo-h2-component {
        font-weight: 700;
        background: linear-gradient(135deg, #FFFFFF 0%, #E5E7EB 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }

    .creatuactivo-component-card {
      background: linear-gradient(135deg, rgba(30, 64, 175, 0.1) 0%, rgba(124, 58, 237, 0.1) 100%);
      backdrop-filter: blur(24px);
      border: 1px solid rgba(124, 58, 237, 0.2);
      border-radius: 20px;
      transition: all 0.4s ease;
      position: relative;
      overflow: hidden;
    }

    .creatuactivo-cta-ecosystem {
      background: linear-gradient(135deg, var(--creatuactivo-blue) 0%, var(--creatuactivo-purple) 100%);
      border-radius: 12px;
      padding: 12px 24px;
      font-weight: 600;
      color: white;
      transition: all 0.3s ease;
      box-shadow: 0 6px 20px rgba(30, 64, 175, 0.4);
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

// --- Componente de Tarjeta de Configuración (Sin cambios) ---
const SettingsCard = ({ icon, title, children }) => (
    <div className="creatuactivo-component-card">
        <div className="p-8">
            <div className="flex items-center gap-4 mb-6">
                <div className="bg-slate-800/50 p-3 rounded-lg">
                    {icon}
                </div>
                <h3 className="text-xl font-bold text-white">{title}</h3>
            </div>
            <div className="space-y-4">
                {children}
            </div>
        </div>
    </div>
);

// --- Componente Principal de la Página de Perfil (ACTUALIZADO) ---
export default function PerfilPage() {
    const [profileData, setProfileData] = useState({
        name: "Carlos Pérez",
        whatsapp: "+573001234567",
        affiliationLink: "https://ganoexcel.com/afiliacion/carlosperez123"
    });

    const handleSave = () => {
        // Lógica para guardar en Supabase
        console.log("Guardando perfil:", profileData);
        alert("Perfil actualizado con éxito.");
    };

    return (
        <>
            <GlobalStyles />
            {/* AJUSTE: Se utiliza NodeXSidebar como el layout principal que envuelve todo el contenido. */}
            <NodeXSidebar>
                <div className="p-6 relative">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                        <div className="mb-12">
                            <h1 className="creatuactivo-h2-component text-4xl md:text-5xl font-bold">Mi Perfil de Arquitecto</h1>
                            <p className="text-slate-400 mt-2">Gestiona tu identidad, tus herramientas y la seguridad de tu activo.</p>
                        </div>

                        <div className="space-y-8">
                            <SettingsCard icon={<User className="w-6 h-6 text-blue-400" />} title="Información Personal">
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-1">Nombre Completo</label>
                                    <input type="text" value={profileData.name} onChange={e => setProfileData({...profileData, name: e.target.value})} className="form-input" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-1">WhatsApp de Contacto</label>
                                    <input type="text" value={profileData.whatsapp} onChange={e => setProfileData({...profileData, whatsapp: e.target.value})} className="form-input" />
                                </div>
                            </SettingsCard>

                            <SettingsCard icon={<LinkIcon className="w-6 h-6 text-purple-400" />} title="Herramientas Personalizadas">
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-1">Enlace de Activación Directa</label>
                                    <input type="text" value={profileData.affiliationLink} onChange={e => setProfileData({...profileData, affiliationLink: e.target.value})} className="form-input" />
                                    <p className="text-xs text-slate-500 mt-2">Este es el enlace de Gano Excel que se usará en tu Dashboard de NodeX.</p>
                                </div>
                            </SettingsCard>

                            <SettingsCard icon={<Lock className="w-6 h-6 text-yellow-400" />} title="Seguridad de la Cuenta">
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-1">Contraseña Actual</label>
                                    <input type="password" placeholder="********" className="form-input" />
                                </div>
                                 <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-1">Nueva Contraseña</label>
                                    <input type="password" placeholder="Nueva contraseña segura" className="form-input" />
                                </div>
                                <Link href="/auth/recuperar-contrasena" className="text-sm text-blue-400 hover:text-blue-300">¿Olvidaste tu contraseña?</Link>
                            </SettingsCard>

                            <div className="flex justify-end pt-4">
                                <button onClick={handleSave} className="creatuactivo-cta-ecosystem flex items-center gap-2">
                                    <Save className="w-5 h-5" />
                                    Guardar Todos los Cambios
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </NodeXSidebar>
        </>
    );
}
