'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Lock, Mail } from 'lucide-react'
import Link from 'next/link'

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
        padding: 1rem 1rem 1rem 2.5rem; /* Padding para el icono */
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


// --- Componente Principal de la Página de Login ---
export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        // Aquí iría la lógica de autenticación con Supabase
        console.log("Iniciando sesión con:", { email, password });
        // Si es exitoso, redirigir a /nodex
        // window.location.href = '/nodex';
    };

    return (
        <>
            <GlobalStyles />
            <div className="bg-slate-900 text-white min-h-screen flex items-center justify-center p-4">
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                    <div className="absolute -top-1/4 -left-1/4 w-96 h-96 bg-[var(--creatuactivo-blue)] opacity-10 rounded-full filter blur-3xl animate-pulse"></div>
                    <div className="absolute -bottom-1/4 -right-1/4 w-96 h-96 bg-[var(--creatuactivo-purple)] opacity-10 rounded-full filter blur-3xl animate-pulse animation-delay-4000"></div>
                </div>

                <main className="relative z-10 w-full max-w-md">
                    <Link href="/" className="block text-center mb-8 text-2xl font-bold bg-gradient-to-r from-[var(--creatuactivo-blue)] to-[var(--creatuactivo-purple)] bg-clip-text text-transparent">
                        CreaTuActivo
                    </Link>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="bg-slate-800/50 backdrop-blur-2xl rounded-2xl border border-white/10 shadow-2xl shadow-purple-500/10 p-8 lg:p-12"
                    >
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold text-white">Bienvenido, Arquitecto</h1>
                            <p className="text-slate-400 mt-2">Accede a tu Centro de Comando NodeX.</p>
                        </div>
                        <form onSubmit={handleLogin} className="space-y-6">
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="form-input"
                                    placeholder="Tu email de constructor"
                                    required
                                />
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="form-input"
                                    placeholder="Contraseña"
                                    required
                                />
                            </div>
                            <div>
                                <button type="submit" className="w-full creatuactivo-cta-ecosystem text-base flex items-center justify-center">
                                    Iniciar Sesión <ArrowRight size={20} className="ml-2" />
                                </button>
                            </div>
                            <div className="text-center text-sm">
                                <Link href="/recuperar-contrasena" className="text-blue-400 hover:text-blue-300 transition-colors">
                                    ¿Olvidaste tu contraseña?
                                </Link>
                            </div>
                        </form>
                    </motion.div>
                </main>
            </div>
        </>
    );
}
