import React from 'react';
import { MeditationCard } from './MeditationCard';
import { Sparkles, Moon } from 'lucide-react';

export const MeditationGrid = ({ meditations, favorites, onToggleFavorite }) => {
  if (!meditations || meditations.length === 0) {
    return (
      <div className="text-center py-16 px-4 rounded-3xl bg-midnight-900/40 border border-slate-800">
        <div className="inline-flex p-4 rounded-full bg-slate-900 text-amberGlow-400 mb-4 border border-slate-800">
          <Moon className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-serif font-bold text-white mb-2">No se encontraron meditaciones</h3>
        <p className="text-slate-400 text-xs sm:text-sm max-w-md mx-auto">
          Intenta cambiar tus filtros de búsqueda o categoría para encontrar sesiones de calma.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
      {meditations.map((meditation) => (
        <MeditationCard
          key={meditation.id}
          meditation={meditation}
          isFavorite={favorites.includes(meditation.id)}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </div>
  );
};
