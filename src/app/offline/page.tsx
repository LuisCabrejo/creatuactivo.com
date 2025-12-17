/**
 * Página Offline Fallback
 * Se muestra cuando el usuario está sin conexión y la página no está en cache
 */

import { WifiOff, RefreshCw, Home } from 'lucide-react'

export const metadata = {
  title: 'Sin Conexión | CreaTuActivo',
  description: 'No hay conexión a internet disponible',
}

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        {/* Icono animado */}
        <div className="relative mb-8">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center">
            <WifiOff className="w-12 h-12 text-blue-400 animate-pulse" />
          </div>
          {/* Círculos decorativos */}
          <div className="absolute inset-0 w-24 h-24 mx-auto border-2 border-blue-500/20 rounded-full animate-ping" />
        </div>

        {/* Título */}
        <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Sin Conexión
        </h1>

        {/* Descripción */}
        <p className="text-slate-400 text-lg mb-8 leading-relaxed">
          Parece que no tienes conexión a internet.
          Verifica tu conexión e intenta nuevamente.
        </p>

        {/* Botones de acción */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => window.location.reload()}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25"
          >
            <RefreshCw className="w-5 h-5" />
            Reintentar
          </button>

          <a
            href="/"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-xl transition-all duration-300"
          >
            <Home className="w-5 h-5" />
            Ir al Inicio
          </a>
        </div>

        {/* Información adicional */}
        <div className="mt-12 p-4 bg-slate-800/50 rounded-xl border border-slate-700">
          <p className="text-sm text-slate-500">
            💡 <span className="text-slate-400">Tip:</span> Las páginas que visitaste
            anteriormente están disponibles sin conexión.
          </p>
        </div>

        {/* Footer */}
        <p className="mt-8 text-slate-600 text-sm">
          CreaTuActivo.com
        </p>
      </div>
    </div>
  )
}
