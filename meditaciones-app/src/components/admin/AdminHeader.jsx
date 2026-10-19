import React from 'react';
import { ShieldCheck, HardDrive, Headphones, Radio, Sparkles } from 'lucide-react';
import { isSupabaseConfigured } from '../../lib/supabaseClient';

export const AdminHeader = ({ meditationsCount }) => {
  return (
    <div className="mb-8">
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amberGlow-500/10 border border-amberGlow-500/30 text-amberGlow-300 text-xs font-semibold mb-2">
            <ShieldCheck className="w-4 h-4 text-amberGlow-400" />
            <span>Panel de Administración Protegido (RBAC)</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
            Gestión de Contenido Multimedia
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm">
            Sube nuevos clips de audio, administra metadatos y supervisa la biblioteca de meditación.
          </p>
        </div>

        {/* BaaS Connection Badge */}
        <div className="flex items-center space-x-2 px-4 py-2 rounded-2xl bg-midnight-900 border border-slate-800 text-xs">
          <HardDrive className="w-4 h-4 text-amberGlow-400" />
          <span className="text-slate-400">Almacenamiento:</span>
          <span className={`font-semibold ${isSupabaseConfigured ? 'text-emerald-400' : 'text-amberGlow-300'}`}>
            {isSupabaseConfigured ? 'Supabase Storage' : 'LocalStorage Demo'}
          </span>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="p-4 rounded-2xl bg-midnight-900/80 border border-slate-800 glass-card">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Total de Meditaciones</span>
            <Headphones className="w-4 h-4 text-amberGlow-400" />
          </div>
          <span className="text-2xl font-bold text-white font-mono">{meditationsCount}</span>
          <span className="text-[11px] text-slate-500 block mt-1">Archivos MP3/WAV registrados</span>
        </div>

        <div className="p-4 rounded-2xl bg-midnight-900/80 border border-slate-800 glass-card">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Reproducciones Totales</span>
            <Radio className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="text-2xl font-bold text-white font-mono">5,920</span>
          <span className="text-[11px] text-emerald-400 block mt-1">+14% esta semana</span>
        </div>

        <div className="p-4 rounded-2xl bg-midnight-900/80 border border-slate-800 glass-card">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Estado del Servicio</span>
            <Sparkles className="w-4 h-4 text-amberGlow-400 animate-pulse" />
          </div>
          <span className="text-sm font-bold text-emerald-400 flex items-center gap-1.5 mt-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            Operativo (100% Uptime)
          </span>
          <span className="text-[11px] text-slate-500 block mt-1">Audio Streaming activo</span>
        </div>

      </div>

    </div>
  );
};
