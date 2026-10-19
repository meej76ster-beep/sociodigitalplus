import React from 'react';
import { Search, X, Clock, SlidersHorizontal } from 'lucide-react';

export const SearchHeader = ({ searchTerm, setSearchTerm, durationFilter, setDurationFilter, totalResults }) => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
      
      {/* Search Input */}
      <div className="relative w-full md:w-96">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <Search className="w-4 h-4 text-amberGlow-400/80" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar por título, instructor o palabra clave..."
          className="w-full pl-10 pr-10 py-3 bg-midnight-900/90 border border-slate-800 rounded-2xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amberGlow-500/50 focus:ring-1 focus:ring-amberGlow-500/50 transition-all shadow-inner"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Duration Filter Dropdown & Results Counter */}
      <div className="flex items-center justify-between w-full md:w-auto space-x-4">
        
        <div className="flex items-center space-x-2 bg-midnight-900/80 px-3 py-2 rounded-2xl border border-slate-800 text-xs text-slate-300">
          <Clock className="w-3.5 h-3.5 text-amberGlow-400" />
          <span>Duración:</span>
          <select
            value={durationFilter}
            onChange={(e) => setDurationFilter(e.target.value)}
            className="bg-transparent text-amberGlow-300 font-semibold focus:outline-none cursor-pointer"
          >
            <option value="all" className="bg-midnight-900 text-white">Todas las duraciones</option>
            <option value="short" className="bg-midnight-900 text-white">Corta (&lt; 6 min)</option>
            <option value="medium" className="bg-midnight-900 text-white">Media (6 - 10 min)</option>
            <option value="long" className="bg-midnight-900 text-white">Extensa (&gt; 10 min)</option>
          </select>
        </div>

        <span className="text-xs text-slate-400 font-mono">
          {totalResults} {totalResults === 1 ? 'meditación' : 'meditaciones'}
        </span>

      </div>

    </div>
  );
};
