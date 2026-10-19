import React, { useState, useEffect } from 'react';
import { useAudio } from '../../context/AudioContext';
import { X, Play, Pause, RotateCcw, RotateCw, Flame, Sparkles } from 'lucide-react';
import { ScrubberBar } from './ScrubberBar';

export const CandleVisualizer = () => {
  const {
    isVisualizerOpen,
    setIsVisualizerOpen,
    currentMeditation,
    isPlaying,
    playMeditation,
    pauseMeditation,
    currentTime,
    duration,
    seekTo,
    skipTime
  } = useAudio();

  // Guía de Respiración (Inhala 4s, Sostén 4s, Exhala 4s)
  const [breathPhase, setBreathPhase] = useState('Inhala suavemente');
  const [breathScale, setBreathScale] = useState(1);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      const cycleTime = Math.floor(Date.now() / 1000) % 12;
      if (cycleTime < 4) {
        setBreathPhase('Inhala pausadamente...');
        setBreathScale(1.35);
      } else if (cycleTime < 8) {
        setBreathPhase('Sostén el aire en tu pecho...');
        setBreathScale(1.35);
      } else {
        setBreathPhase('Exhala liberando tensión...');
        setBreathScale(1.0);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying]);

  if (!isVisualizerOpen || !currentMeditation) return null;

  return (
    <div className="fixed inset-0 z-50 bg-midnight-950 flex flex-col justify-between p-6 sm:p-12 overflow-hidden animate-fadeIn">
      
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amberGlow-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse-glow" />
      <div className="absolute top-10 right-10 w-96 h-96 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Header Bar */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-amberGlow-500/20 text-amberGlow-400 border border-amberGlow-500/30">
            <Flame className="w-5 h-5 animate-candle-flicker" />
          </div>
          <div>
            <span className="text-xs text-amberGlow-300 uppercase tracking-widest font-mono">Modo Vela Ambiental</span>
            <h3 className="font-serif text-lg text-white font-semibold">{currentMeditation.title}</h3>
          </div>
        </div>

        <button
          onClick={() => setIsVisualizerOpen(false)}
          className="p-3 rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition shadow-lg"
          title="Cerrar modo visualizador"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Center Candle & Breathing Flame Graphic */}
      <div className="relative z-10 my-auto flex flex-col items-center justify-center text-center">
        
        {/* Pulsing Aura Rings */}
        <div className="relative flex items-center justify-center mb-8">
          <div 
            className="w-48 h-48 sm:w-64 sm:h-64 rounded-full border border-amberGlow-500/20 bg-amberGlow-500/5 transition-all duration-[4000ms] ease-in-out flex items-center justify-center"
            style={{ transform: `scale(${breathScale})` }}
          >
            <div className="w-32 h-32 sm:w-44 sm:h-44 rounded-full border border-amberGlow-400/30 bg-amberGlow-500/10 shadow-candle-lg flex items-center justify-center">
              
              {/* Candle Candle Flame Graphic */}
              <div className="relative">
                <div className="w-8 h-12 sm:w-10 sm:h-16 bg-gradient-to-t from-amberGlow-600 via-amberGlow-400 to-amberGlow-100 rounded-full blur-[2px] animate-candle-flicker shadow-candle-lg" />
                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-3 h-5 bg-white rounded-full blur-[1px]" />
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-1.5 h-8 bg-slate-700 rounded-b-md" />
              </div>

            </div>
          </div>
        </div>

        {/* Dynamic Breathing Text */}
        <div className="space-y-2">
          <p className="text-amberGlow-300 font-serif text-xl sm:text-2xl font-light tracking-wide transition-all duration-1000">
            {breathPhase}
          </p>
          <p className="text-slate-400 text-xs font-mono">
            {currentMeditation.instructor_name} • {currentMeditation.category_name || 'Calma Nocturna'}
          </p>
        </div>

      </div>

      {/* Bottom Floating Control Bar */}
      <div className="relative z-10 max-w-2xl mx-auto w-full p-6 bg-midnight-900/80 backdrop-blur-2xl border border-amberGlow-500/30 rounded-3xl shadow-2xl glass-card">
        
        <ScrubberBar
          currentTime={currentTime}
          duration={duration}
          onSeek={seekTo}
        />

        <div className="flex items-center justify-center space-x-6 mt-4">
          <button
            onClick={() => skipTime(-10)}
            className="p-3 text-slate-300 hover:text-amberGlow-300 hover:bg-slate-800/60 rounded-full transition"
            title="Retroceder 10 segundos"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            onClick={() => isPlaying ? pauseMeditation() : playMeditation(currentMeditation)}
            className="p-5 rounded-full gold-gradient-bg text-midnight-950 shadow-candle-lg hover:scale-105 transition transform"
          >
            {isPlaying ? <Pause className="w-7 h-7 fill-current" /> : <Play className="w-7 h-7 fill-current ml-1" />}
          </button>

          <button
            onClick={() => skipTime(10)}
            className="p-3 text-slate-300 hover:text-amberGlow-300 hover:bg-slate-800/60 rounded-full transition"
            title="Adelantar 10 segundos"
          >
            <RotateCw className="w-5 h-5" />
          </button>
        </div>

      </div>

    </div>
  );
};
