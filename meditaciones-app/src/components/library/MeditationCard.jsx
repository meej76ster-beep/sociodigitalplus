import React from 'react';
import { useAudio } from '../../context/AudioContext';
import { Play, Pause, Heart, Download, Share2, Clock, User, Flame } from 'lucide-react';

export const MeditationCard = ({ meditation, isFavorite, onToggleFavorite }) => {
  const { currentMeditation, isPlaying, playMeditation, downloadAudioFile, shareMeditation } = useAudio();

  const isCurrentActive = currentMeditation?.id === meditation.id;
  const isCurrentlyPlaying = isCurrentActive && isPlaying;

  const formatDuration = (seconds) => {
    const min = Math.floor(seconds / 60);
    return `${min} min`;
  };

  return (
    <div className={`group relative rounded-3xl overflow-hidden glass-card glass-panel-hover flex flex-col justify-between transition-all duration-300 border ${
      isCurrentActive ? 'border-amberGlow-500/60 shadow-candle' : 'border-slate-800/80'
    }`}>
      
      {/* Upper Image Header */}
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src={meditation.cover_url}
          alt={meditation.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-90 group-hover:brightness-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-midnight-950 via-midnight-950/30 to-transparent" />

        {/* Category Badge & Duration */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
          <span className="px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide backdrop-blur-md bg-midnight-950/70 text-amberGlow-300 border border-amberGlow-500/30">
            {meditation.category_name || 'Meditación'}
          </span>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(meditation.id);
            }}
            className={`p-2 rounded-full backdrop-blur-md transition ${
              isFavorite
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                : 'bg-midnight-950/60 text-slate-400 hover:text-white border border-slate-700/50'
            }`}
            title={isFavorite ? "Quitar de favoritos" : "Guardar en favoritos"}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Center Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center z-10 opacity-90 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => playMeditation(meditation)}
            className={`p-4 rounded-full transition-all duration-300 transform group-hover:scale-110 ${
              isCurrentlyPlaying
                ? 'bg-amberGlow-500 text-midnight-950 shadow-candle-lg animate-pulse'
                : 'bg-midnight-950/80 hover:bg-amberGlow-500 text-amberGlow-400 hover:text-midnight-950 border border-amberGlow-500/40'
            }`}
          >
            {isCurrentlyPlaying ? (
              <Pause className="w-6 h-6 fill-current" />
            ) : (
              <Play className="w-6 h-6 fill-current ml-0.5" />
            )}
          </button>
        </div>

        {/* Active playing indicator badge */}
        {isCurrentlyPlaying && (
          <div className="absolute bottom-3 left-3 flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-amberGlow-500/20 backdrop-blur-md border border-amberGlow-500/40 text-[10px] text-amberGlow-300 font-mono animate-pulse">
            <Flame className="w-3 h-3 text-amberGlow-400 animate-candle-flicker" />
            <span>EN REPRODUCCIÓN</span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center space-x-3 text-xs text-slate-400 mb-2">
            <span className="flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5 text-amberGlow-400" />
              <span>{formatDuration(meditation.duration_seconds)}</span>
            </span>
            <span>•</span>
            <span className="flex items-center space-x-1">
              <User className="w-3.5 h-3.5 text-slate-500" />
              <span>{meditation.instructor_name}</span>
            </span>
          </div>

          <h3 className="font-serif text-lg font-bold text-white group-hover:text-amberGlow-200 transition-colors mb-2 line-clamp-1">
            {meditation.title}
          </h3>

          <p className="text-slate-300 text-xs line-clamp-2 leading-relaxed font-light mb-4">
            {meditation.description}
          </p>
        </div>

        {/* Card Action Footer */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
          
          <button
            onClick={() => playMeditation(meditation)}
            className="text-amberGlow-400 hover:text-amberGlow-300 font-semibold flex items-center space-x-1 transition"
          >
            <span>{isCurrentlyPlaying ? 'Pausar' : 'Escuchar ahora'}</span>
          </button>

          <div className="flex items-center space-x-2">
            {/* Direct Audio Download */}
            <button
              onClick={() => downloadAudioFile(meditation)}
              className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-amberGlow-300 border border-slate-800 transition"
              title="Descargar audio para escuchar offline"
            >
              <Download className="w-4 h-4" />
            </button>

            {/* Share Native / Fallback */}
            <button
              onClick={() => shareMeditation(meditation)}
              className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-amberGlow-300 border border-slate-800 transition"
              title="Compartir meditación"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
