import React from 'react';
import { useAudio } from '../../context/AudioContext';
import { AMBIENT_TRACKS } from '../../lib/mockData';
import { CloudRain, Waves, Trees, Volume2, X } from 'lucide-react';

const ICON_MAP = {
  CloudRain, Waves, Trees
};

export const AmbientSoundMixer = ({ onClose }) => {
  const { activeAmbient, toggleAmbientSound, ambientVolume, setAmbientVolume } = useAudio();

  return (
    <div className="p-4 bg-midnight-900/95 border border-amberGlow-500/30 rounded-2xl shadow-2xl glass-card text-white w-72 animate-fadeIn">
      <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
        <h4 className="text-xs font-semibold text-amberGlow-200 uppercase tracking-wider">Sonido Ambiental de Fondo</h4>
        {onClose && (
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <p className="text-[11px] text-slate-400 mb-3">
        Combina un ambiente relajante debajo de la voz de la meditación:
      </p>

      <div className="space-y-2 mb-4">
        {AMBIENT_TRACKS.map((track) => {
          const IconComponent = ICON_MAP[track.icon] || CloudRain;
          const isActive = activeAmbient === track.id;

          return (
            <button
              key={track.id}
              onClick={() => toggleAmbientSound(track.id)}
              className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-medium border transition-all ${
                isActive
                  ? 'bg-amberGlow-500/20 text-amberGlow-300 border-amberGlow-500/50 shadow-sm'
                  : 'bg-midnight-950/60 text-slate-300 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center space-x-2">
                <IconComponent className={`w-4 h-4 ${isActive ? 'text-amberGlow-400 animate-pulse' : 'text-slate-400'}`} />
                <span>{track.name}</span>
              </div>
              {isActive && <span className="text-[10px] text-amberGlow-400 font-bold">ACTIVO</span>}
            </button>
          );
        })}
      </div>

      {activeAmbient && (
        <div className="pt-2 border-t border-slate-800">
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
            <span className="flex items-center space-x-1">
              <Volume2 className="w-3 h-3 text-amberGlow-400" />
              <span>Volumen ambiental</span>
            </span>
            <span>{Math.round(ambientVolume * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={ambientVolume}
            onChange={(e) => setAmbientVolume(parseFloat(e.target.value))}
            className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amberGlow-400"
          />
        </div>
      )}
    </div>
  );
};
