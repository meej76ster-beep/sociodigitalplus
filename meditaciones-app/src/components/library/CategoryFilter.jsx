import React from 'react';
import { Moon, Bed, Wind, Activity, Heart, Sun, Layers } from 'lucide-react';

const ICON_MAP = {
  Moon, Bed, Wind, Activity, Heart, Sun
};

export const CategoryFilter = ({ categories, selectedCategory, onSelectCategory }) => {
  return (
    <div className="w-full overflow-x-auto pb-4 pt-2 no-scrollbar">
      <div className="flex items-center space-x-2 sm:space-x-3 min-w-max">
        
        <button
          onClick={() => onSelectCategory('all')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all duration-300 border ${
            selectedCategory === 'all'
              ? 'bg-amberGlow-500 text-midnight-950 border-amberGlow-400 shadow-candle font-bold'
              : 'bg-midnight-900/80 text-slate-300 border-slate-800 hover:border-amberGlow-500/40 hover:text-white'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Todas las Meditaciones</span>
        </button>

        {categories.map((cat) => {
          const IconComp = ICON_MAP[cat.icon] || Moon;
          const isSelected = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-medium transition-all duration-300 border ${
                isSelected
                  ? 'bg-amberGlow-500/20 text-amberGlow-300 border-amberGlow-500/60 shadow-sm font-semibold'
                  : 'bg-midnight-900/60 text-slate-400 border-slate-800/80 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              <IconComp className={`w-4 h-4 ${isSelected ? 'text-amberGlow-400' : 'text-slate-400'}`} />
              <span>{cat.name}</span>
            </button>
          );
        })}

      </div>
    </div>
  );
};
