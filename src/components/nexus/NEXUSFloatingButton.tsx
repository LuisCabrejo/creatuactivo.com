'use client';
import React, { useState } from 'react';
import NEXUSWidget from './NEXUSWidget';

const NEXUSFloatingButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Button - Optimizado */}
      <button
        className="fixed bottom-6 right-6 w-16 h-16 rounded-full shadow-2xl z-40 flex items-center justify-center transition-all duration-300 hover:scale-110 group"
        style={{
          background: 'linear-gradient(135deg, #1E40AF 0%, #7C3AED 100%)'
        }}
        onClick={() => setIsOpen(true)}
      >
        <div className="relative">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/>
          </svg>
          {/* Notification pulse */}
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse">
            <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-75"></div>
          </div>
        </div>

        {/* ✅ TOOLTIP OPTIMIZADO */}
        <div className="absolute right-full mr-4 px-3 py-2 bg-slate-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
          Descubre tu arquitectura de activos
          <div className="absolute top-1/2 -right-1 transform -translate-y-1/2 w-2 h-2 bg-slate-800 rotate-45"></div>
        </div>
      </button>

      {/* Widget */}
      <NEXUSWidget isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};

export default NEXUSFloatingButton;
