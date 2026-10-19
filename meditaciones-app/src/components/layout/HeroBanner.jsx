import React from 'react';
import { useAudio } from '../../context/AudioContext';
import { Flame, Play, Sparkles, Moon, Volume2 } from 'lucide-react';

export const HeroBanner = ({ featuredMeditation }) => {
  const { playMeditation, isPlaying, currentMeditation, setIsVisualizerOpen } = useAudio();

  const isCurrentPlaying = isPlaying && currentMeditation?.id === featuredMeditation?.id;

  return (
    <section className="relative overflow-hidden py-12 sm:py-16 mb-8 rounded-3xl bg-gradient-to-b from-midnight-900/90 via-midnight-900/60 to-midnight-950/80 border border-amberGlow-500/20 shadow-2xl glass-card">
      {/* Background candle ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amberGlow-500/10 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
      <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-6 sm:px-8 text-center flex flex-col items-center">
        
        {/* Organic Candle Light Badge */}
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-amberGlow-500/10 border border-amberGlow-500/30 text-amberGlow-300 text-xs sm:text-sm font-medium mb-6 shadow-candle">
          <Flame className="w-4 h-4 text-amberGlow-400 animate-candle-flicker" />
          <span>Santuario de Calma Nocturna</span>
          <span className="w-1.5 h-1.5 rounded-full bg-oliveSerenity-500 animate-ping" />
        </div>

        <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white mb-4 max-w-3xl leading-tight">
          Silencia la mente, sosiega la respiración y conecta con la <span className="candle-glow-text font-sans">luz interior</span>
        </h2>

        <p className="text-slate-300 text-base sm:text-lg max-w-2xl font-light mb-8 leading-relaxed">
          Explora sesiones guiadas de meditación en alta fidelidad sonora, diseñadas para conciliar el descanso profundo, disolver la ansiedad y renovar tu bienestar.
        </p>

        {featuredMeditation && (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => playMeditation(featuredMeditation)}
              className="group flex items-center space-x-3 px-8 py-4 rounded-2xl gold-gradient-bg text-midnight-950 font-bold text-base shadow-candle-lg hover:shadow-amberGlow-500/50 hover:scale-105 transition-all duration-300"
            >
              <div className="p-2 rounded-xl bg-midnight-950/20 text-midnight-950 group-hover:scale-110 transition">
                <Play className={`w-5 h-5 ${isCurrentPlaying ? 'animate-spin' : ''}`} fill="currentColor" />
              </div>
              <span>{isCurrentPlaying ? 'Pausar Meditación Diaria' : 'Reproducir Meditación Destacada'}</span>
            </button>

            <button
              onClick={() => setIsVisualizerOpen(true)}
              className="flex items-center space-x-2 px-6 py-4 rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-amberGlow-200 border border-amberGlow-500/30 text-sm font-semibold transition-all shadow-md"
            >
              <Sparkles className="w-4 h-4 text-amberGlow-400" />
              <span>Modo Vela & Visualizador</span>
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
