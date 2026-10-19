import React, { useState } from 'react';
import { X, Save } from 'lucide-react';
import { INITIAL_CATEGORIES } from '../../lib/mockData';

export const EditMeditationModal = ({ meditation, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: meditation.title || '',
    description: meditation.description || '',
    category_id: meditation.category_id || 'cat-1',
    instructor_name: meditation.instructor_name || '',
    is_featured: meditation.is_featured || false
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const catObj = INITIAL_CATEGORIES.find(c => c.id === formData.category_id);
    onSave(meditation.id, {
      ...formData,
      category_name: catObj ? catObj.name : meditation.category_name
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-midnight-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg p-6 bg-midnight-900 border border-amberGlow-500/30 rounded-3xl shadow-2xl glass-card text-white">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="font-serif text-xl font-bold text-white mb-4">Editar Metadatos de Meditación</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Título</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3.5 py-2 bg-midnight-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-amberGlow-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Categoría</label>
            <select
              value={formData.category_id}
              onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
              className="w-full px-3.5 py-2 bg-midnight-950 border border-slate-800 rounded-xl text-sm text-amberGlow-300 focus:outline-none focus:border-amberGlow-500 cursor-pointer"
            >
              {INITIAL_CATEGORIES.map(cat => (
                <option key={cat.id} value={cat.id} className="bg-midnight-900 text-white">
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Instructor</label>
            <input
              type="text"
              value={formData.instructor_name}
              onChange={(e) => setFormData({ ...formData, instructor_name: e.target.value })}
              className="w-full px-3.5 py-2 bg-midnight-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-amberGlow-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Descripción</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows="3"
              className="w-full px-3.5 py-2 bg-midnight-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-amberGlow-500"
              required
            />
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <input
              type="checkbox"
              id="edit_is_featured"
              checked={formData.is_featured}
              onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
              className="w-4 h-4 accent-amberGlow-500 rounded cursor-pointer"
            />
            <label htmlFor="edit_is_featured" className="text-xs text-slate-300 font-medium cursor-pointer">
              Meditación Destacada
            </label>
          </div>

          <div className="pt-4 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center space-x-2 px-5 py-2 rounded-xl gold-gradient-bg text-midnight-950 font-bold text-xs shadow-candle"
            >
              <Save className="w-4 h-4" />
              <span>Guardar Cambios</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
