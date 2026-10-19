import React, { useState } from 'react';
import { useAudio } from '../../context/AudioContext';
import { ScrubberBar } from './ScrubberBar';
import { AmbientSoundMixer } from './AmbientSoundMixer';
import {
  Play, Pause, RotateCcw, RotateCw, Volume2, VolumeX,
  Sparkles, Download, Share2, Flame, Sliders, Music
} from 'lucide-react';

export const AdvancedAudioPlayer = () => {
  const {
    currentMeditation,
    isPlaying,
    playMeditation,
    pauseMeditation,
    currentTime,
    duration,
    seekTo,
    skipTime,
    volume,
    setVolume,
    isMuted,
    toggleMute,
    playbackRate,
    setPlaybackRate,
    setIsVisualizerOpen,
    downloadAudioFile,
    shareMeditation,
    activeAmbient
  } = useAudio();

  const [showAmbientMixer, setShowAmbientMixer] = useState(false);

  if (!currentMeditation) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 p-3 sm:p-4 bg-midnight-950/90 backdrop-blur-2xl border-t border-amberGlow-500/30 shadow-2xl animate-slideUp">
      
      {/* Ambient Sound Popover */}
      {showAmbientMixer && (
        <div className="absolute bottom-24 right-4 sm:right-12 z-50">
          <AmbientSoundMixer onClose={() => setShowAmbientMixer(false)} />
        </div>
      )}

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        
        {/* Track info & Cover */}
        <div className="flex items-center space-x-3.5 w-full md:w-1/4">
          <div className="relative w-12 h-12 rounded-2xl overflow-hidden border border-amberGlow-500/30 shrink-0">
            <img
              src={currentMeditation.cover_url}
              alt={currentMeditation.title}
              className="w-full h-full object-cover"
            />
            {isPlaying && (
              <div className="absolute inset-0 bg-midnight-950/40 backdrop-blur-[1px] flex items-center justify-center">
                <Flame className="w-5 h-5 text-amberGlow-400 animate-candle-flicker" />
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h4 className="font-serif text-sm font-bold text-white truncate hover:text-amberGlow-200 cursor-pointer">
              {currentMeditation.title}
            </h4>
            <p className="text-xs text-slate-400 truncate">
              {currentMeditation.instructor_name} • <span className="text-amberGlow-300/90 font-mono">{currentMeditation.category_name || 'Meditación'}</span>
            </p>
          </div>
        </div>

        {/* Center Controls & Timeline Scrubber */}
        <div className="flex-1 w-full max-w-2xl px-2 flex flex-col items-center">
          
          <div className="flex items-center space-x-4 mb-1">
            <button
              onClick={() => skipTime(-10)}
              className="p-1.5 text-slate-400 hover:text-amberGlow-300 rounded-full hover:bg-slate-800/60 transition"
              title="Retroceder 10s"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={() => isPlaying ? pauseMeditation() : playMeditation(currentMeditation)}
              className="p-3 rounded-full gold-gradient-bg text-midnight-950 shadow-candle hover:scale-105 transition transform"
              title={isPlaying ? "Pausar" : "Reproducir"}
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
            </button>

            <button
              onClick={() => skipTime(10)}
              className="p-1.5 text-slate-400 hover:text-amberGlow-300 rounded-full hover:bg-slate-800/60 transition"
              title="Adelantar 10s"
            >
              <RotateCw className="w-4 h-4" />
            </button>
          </div>

          <ScrubberBar
            currentTime={currentTime}
            duration={duration}
            onSeek={seekTo}
          />

        </div>

        {/* Right Action Tools: Volume, Ambient, Visualizer, Download, Share */}
        <div className="flex items-center justify-end space-x-2 w-full md:w-1/4">
          
          {/* Speed Selector */}
          <select
            value={playbackRate}
            onChange={(e) => setPlaybackRate(parseFloat(e.target.value))}
            className="px-2 py-1 bg-midnight-900 border border-slate-800 text-xs font-mono text-amberGlow-300 rounded-xl focus:outline-none cursor-pointer"
            title="Velocidad de reproducción"
          >
            <option value="1">1.0x</option>
            <option value="1.25">1.25x</option>
            <option value="1.5">1.5x</option>
          </select>

          {/* Ambient Mixer Toggle */}
          <button
            onClick={() => setShowAmbientMixer(!showAmbientMixer)}
            className={`p-2 rounded-xl border transition ${
              activeAmbient || showAmbientMixer
                ? 'bg-amberGlow-500/20 text-amberGlow-300 border-amberGlow-500/40 shadow-sm'
                : 'bg-midnight-900 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
            title="Sonido Ambiental de Fondo (Lluvia/Olas/Bosque)"
          >
            <Music className="w-4 h-4" />
          </button>

          {/* Volume Control */}
          <div className="hidden sm:flex items-center space-x-1.5 px-2 py-1 bg-midnight-900 border border-slate-800 rounded-xl">
            <button onClick={toggleMute} className="text-slate-400 hover:text-amberGlow-300">
              {isMuted || volume === 0 ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-16 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amberGlow-400"
            />
          </div>

          {/* Candle Visualizer Mode */}
          <button
            onClick={() => setIsVisualizerOpen(true)}
            className="p-2 rounded-xl bg-amberGlow-500/10 hover:bg-amberGlow-500/20 text-amberGlow-300 border border-amberGlow-500/30 transition shadow-sm"
            title="Abrir Modo Vela & Visualizador de Respiración"
          >
            <Sparkles className="w-4 h-4 text-amberGlow-400 animate-pulse" />
          </button>

          {/* Download Audio */}
          <button
            onClick={() => downloadAudioFile(currentMeditation)}
            className="p-2 rounded-xl bg-midnight-900 hover:bg-slate-800 text-slate-300 hover:text-amberGlow-300 border border-slate-800 transition"
            title="Descargar audio para escuchar offline"
          >
            <Download className="w-4 h-4" />
          </button>

          {/* Share Button */}
          <button
            onClick={() => shareMeditation(currentMeditation)}
            className="p-2 rounded-xl bg-midnight-900 hover:bg-slate-800 text-slate-300 hover:text-amberGlow-300 border border-slate-800 transition"
            title="Compartir meditación"
          >
            <Share2 className="w-4 h-4" />
          </button>

        </div>

      </div>

    </div>
  );
};
