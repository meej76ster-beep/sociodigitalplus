import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Flame, ShieldCheck, Heart, Compass, Sparkles, User } from 'lucide-react';

export const Navbar = ({ currentTab, setCurrentTab, favoritesCount }) => {
  const { user, toggleRole, isAdmin } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full bg-midnight-950/80 backdrop-blur-xl border-b border-amberGlow-500/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div 
          onClick={() => setCurrentTab('library')}
          className="flex items-center space-x-3 cursor-pointer group"
        >
          <div className="relative p-2.5 rounded-2xl bg-amberGlow-500/10 border border-amberGlow-500/30 group-hover:border-amberGlow-400 shadow-candle transition-all duration-300">
            <Flame className="w-6 h-6 text-amberGlow-400 animate-candle-flicker" />
            <div className="absolute inset-0 rounded-2xl bg-amberGlow-500/20 blur-md -z-10 group-hover:opacity-100 opacity-60 transition opacity" />
          </div>
          <div>
            <h1 className="font-serif text-xl sm:text-2xl font-bold tracking-wide text-white">
              ZENITH <span className="candle-glow-text font-sans font-semibold">MIND</span>
            </h1>
            <p className="text-[10px] tracking-widest text-amberGlow-300/80 uppercase font-mono">
              Meditación Nocturna
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center space-x-1 p-1 bg-midnight-900/90 rounded-2xl border border-slate-800">
          <button
            onClick={() => setCurrentTab('library')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              currentTab === 'library'
                ? 'bg-amberGlow-500/20 text-amberGlow-300 border border-amberGlow-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Explorar Biblioteca</span>
          </button>

          <button
            onClick={() => setCurrentTab('favorites')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all relative ${
              currentTab === 'favorites'
                ? 'bg-amberGlow-500/20 text-amberGlow-300 border border-amberGlow-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Heart className="w-4 h-4 text-rose-400" />
            <span>Mis Favoritos</span>
            {favoritesCount > 0 && (
              <span className="ml-1 px-1.5 py-0.5 text-[10px] bg-rose-500/30 text-rose-200 rounded-full border border-rose-500/40">
                {favoritesCount}
              </span>
            )}
          </button>

          {isAdmin && (
            <button
              onClick={() => setCurrentTab('admin')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                currentTab === 'admin'
                  ? 'bg-amberGlow-500/20 text-amberGlow-300 border border-amberGlow-500/40 shadow-sm'
                  : 'text-amberGlow-400/80 hover:text-amberGlow-300 hover:bg-amberGlow-500/10'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-amberGlow-400" />
              <span>Panel Admin (CRUD)</span>
            </button>
          )}
        </nav>

        {/* Right Section: Role Switcher & User Profile */}
        <div className="flex items-center space-x-3">
          {/* Simulated RBAC Toggle Switcher */}
          <button
            onClick={toggleRole}
            title="Haz clic para alternar entre el rol de Comprador y Administrador"
            className="flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-300 shadow-sm bg-midnight-900 border-amberGlow-500/30 hover:border-amberGlow-400"
          >
            <Sparkles className="w-3.5 h-3.5 text-amberGlow-400 animate-spin-slow" />
            <span className="text-slate-300 hidden sm:inline">Rol actual:</span>
            <span className={isAdmin ? "text-amberGlow-400 font-bold" : "text-emerald-400 font-bold"}>
              {isAdmin ? 'ADMINISTRADOR' : 'OYENTE / COMPRADOR'}
            </span>
          </button>

          {/* User Icon */}
          <div className="flex items-center space-x-2 pl-2 border-l border-slate-800">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amberGlow-600 to-amberGlow-400 flex items-center justify-center text-midnight-950 font-bold text-sm shadow-md">
              <User className="w-5 h-5 text-midnight-950" />
            </div>
          </div>
        </div>

      </div>
    </header>
  );
};
