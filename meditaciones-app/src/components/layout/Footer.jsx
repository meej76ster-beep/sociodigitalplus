import React from 'react';
import { Flame, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="w-full bg-midnight-950 border-t border-slate-900 py-12 px-4 mt-20 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-amberGlow-500/10 border border-amberGlow-500/20 text-amberGlow-400">
            <Flame className="w-5 h-5 animate-candle-flicker" />
          </div>
          <div>
            <span className="font-serif text-lg font-bold text-white tracking-wide">ZENITH MIND</span>
            <p className="text-xs text-slate-500">Plataforma de Meditaciones Guiadas Nocturnas</p>
          </div>
        </div>

        <div className="text-center md:text-right">
          <p className="text-xs text-slate-400 flex items-center justify-center md:justify-end gap-1">
            Diseñado con <Heart className="w-3.5 h-3.5 text-rose-500 inline fill-current" /> para el bienestar mental y la serenidad.
          </p>
          <p className="text-[11px] text-slate-600 mt-1">
            &copy; {new Date().getFullYear()} Zenith Mind — Todos los derechos reservados.
          </p>
        </div>

      </div>
    </footer>
  );
};
