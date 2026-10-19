import React from 'react';

export const ScrubberBar = ({ currentTime, duration, onSeek }) => {
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  const formatTime = (secs) => {
    if (isNaN(secs) || secs < 0) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleSliderChange = (e) => {
    const newTime = parseFloat(e.target.value);
    onSeek(newTime);
  };

  return (
    <div className="w-full flex items-center space-x-3 text-xs font-mono text-slate-400">
      <span>{formatTime(currentTime)}</span>
      
      <div className="relative flex-1 flex items-center group">
        <input
          type="range"
          min="0"
          max={duration || 100}
          step="0.1"
          value={currentTime || 0}
          onChange={handleSliderChange}
          className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amberGlow-400 focus:outline-none"
        />
        {/* Glowing Progress Overlay */}
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1.5 bg-gradient-to-r from-amberGlow-600 to-amberGlow-400 rounded-lg pointer-events-none shadow-candle"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <span>{formatTime(duration)}</span>
    </div>
  );
};
