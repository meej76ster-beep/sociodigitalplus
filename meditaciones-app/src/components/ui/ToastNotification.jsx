import React from 'react';
import { useAudio } from '../../context/AudioContext';
import { Sparkles } from 'lucide-react';

export const ToastNotification = () => {
  const { toastMessage } = useAudio();

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-24 right-6 z-50 animate-bounce">
      <div className="flex items-center space-x-3 px-4 py-3 bg-midnight-900/90 backdrop-blur-xl border border-amberGlow-500/40 rounded-2xl shadow-candle text-amberGlow-100 text-sm font-medium">
        <Sparkles className="w-4 h-4 text-amberGlow-400 animate-pulse" />
        <span>{toastMessage}</span>
      </div>
    </div>
  );
};
