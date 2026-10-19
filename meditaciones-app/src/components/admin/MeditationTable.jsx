import React, { useState } from 'react';
import { useAudio } from '../../context/AudioContext';
import { EditMeditationModal } from './EditMeditationModal';
import { Play, Pause, Edit2, Trash2, Clock, Sparkles } from 'lucide-react';

export const MeditationTable = ({ meditations, onUpdateMeditation, onDeleteMeditation }) => {
  const { currentMeditation, isPlaying, playMeditation } = useAudio();
  const [editingMeditation, setEditingMeditation] = useState(null);

  const formatDuration = (seconds) => {
    const min = Math.floor(seconds / 60);
    return `${min} min`;
  };

  const handleDelete = (id, title) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar la meditación "${title}"? esta acción no se puede deshacer.`)) {
      onDeleteMeditation(id);
    }
  };

  return (
    <div className="rounded-3xl bg-midnight-900/90 border border-slate-800 glass-card overflow-hidden shadow-2xl">
      
      <div className="p-6 border-b border-slate-800 flex items-center justify-between">
        <div>
          <h3 className="font-serif text-lg font-bold text-white">Inventario de Meditaciones Guiadas (CRUD)</h3>
          <p className="text-xs text-slate-400">Edita información, previsualiza la pista de audio o elimina elementos obsoletos.</p>
        </div>
        <span className="px-3 py-1 rounded-full bg-slate-800 text-amberGlow-300 text-xs font-mono">
          {meditations.length} pistas activas
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm text-slate-300">
          <thead className="bg-midnight-950/80 text-amberGlow-300/80 uppercase font-mono text-[11px] tracking-wider border-b border-slate-800">
            <tr>
              <th className="px-6 py-4">Pista</th>
              <th className="px-6 py-4">Categoría</th>
              <th className="px-6 py-4">Instructor</th>
              <th className="px-6 py-4">Duración</th>
              <th className="px-6 py-4">Reproducciones</th>
              <th className="px-6 py-4 text-right">Acciones CRUD</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {meditations.map((med) => {
              const isCurrent = currentMeditation?.id === med.id;
              const isCurrentlyPlaying = isCurrent && isPlaying;

              return (
                <tr key={med.id} className="hover:bg-midnight-850/60 transition">
                  
                  {/* Pista Info */}
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="relative w-10 h-10 rounded-xl overflow-hidden shrink-0 border border-slate-700">
                        <img src={med.cover_url} alt={med.title} className="w-full h-full object-cover" />
                        <button
                          onClick={() => playMeditation(med)}
                          className="absolute inset-0 bg-midnight-950/60 hover:bg-amberGlow-500/80 text-white hover:text-midnight-950 flex items-center justify-center transition"
                        >
                          {isCurrentlyPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                        </button>
                      </div>
                      <div>
                        <span className="font-semibold text-white block line-clamp-1">{med.title}</span>
                        {med.is_featured && (
                          <span className="text-[10px] text-amberGlow-400 font-mono inline-flex items-center gap-1">
                            <Sparkles className="w-3 h-3" /> Destacada
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Categoría */}
                  <td className="px-6 py-4 font-medium text-slate-300">
                    <span className="px-2.5 py-1 rounded-full text-[11px] bg-slate-800 text-amberGlow-300 border border-slate-700">
                      {med.category_name || 'Calma Nocturna'}
                    </span>
                  </td>

                  {/* Instructor */}
                  <td className="px-6 py-4 text-slate-400">{med.instructor_name || 'Guía Zenith'}</td>

                  {/* Duración */}
                  <td className="px-6 py-4 font-mono text-slate-400">
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5 text-amberGlow-400" />
                      <span>{formatDuration(med.duration_seconds)}</span>
                    </span>
                  </td>

                  {/* Reproducciones */}
                  <td className="px-6 py-4 font-mono text-slate-300">{med.plays_count || 0}</td>

                  {/* Acciones CRUD */}
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => setEditingMeditation(med)}
                        className="p-2 rounded-xl bg-slate-800/80 hover:bg-amberGlow-500/20 text-slate-300 hover:text-amberGlow-300 border border-slate-700 transition"
                        title="Editar metadatos"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDelete(med.id, med.title)}
                        className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition"
                        title="Eliminar meditación"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>

                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {editingMeditation && (
        <EditMeditationModal
          meditation={editingMeditation}
          onClose={() => setEditingMeditation(null)}
          onSave={(id, updateData) => {
            onUpdateMeditation(id, updateData);
            setEditingMeditation(null);
          }}
        />
      )}

    </div>
  );
};
