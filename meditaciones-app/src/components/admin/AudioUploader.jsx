import React, { useState } from 'react';
import { Upload, Music, Image as ImageIcon, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';
import { INITIAL_CATEGORIES } from '../../lib/mockData';

export const AudioUploader = ({ onUploadSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category_id: 'cat-1',
    category_name: 'Calma Nocturna',
    instructor_name: 'Elena Rostova',
    cover_url: '',
    audio_url: '',
    duration_seconds: 480,
    is_featured: false
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Verificar formato
    const validFormats = ['audio/mp3', 'audio/mpeg', 'audio/wav', 'audio/x-m4a', 'audio/mp4', 'audio/m4a'];
    if (!validFormats.some(fmt => file.type.includes(fmt) || file.name.endsWith('.mp3') || file.name.endsWith('.wav') || file.name.endsWith('.m4a'))) {
      setMessage({ type: 'error', text: 'Formato no soportado. Por favor selecciona un archivo MP3, M4A o WAV.' });
      return;
    }

    setSelectedFile(file);
    // Simular URL de audio o crear objeto URL local
    const localAudioUrl = URL.createObjectURL(file);
    
    // Obtener duración aproximada
    const tempAudio = new Audio(localAudioUrl);
    tempAudio.onloadedmetadata = () => {
      setFormData(prev => ({
        ...prev,
        audio_url: localAudioUrl,
        duration_seconds: Math.round(tempAudio.duration || 480)
      }));
    };

    setMessage({ type: 'success', text: `Archivo "${file.name}" cargado correctamente.` });
  };

  const handleCategoryChange = (e) => {
    const catId = e.target.value;
    const catObj = INITIAL_CATEGORIES.find(c => c.id === catId);
    setFormData(prev => ({
      ...prev,
      category_id: catId,
      category_name: catObj ? catObj.name : 'Calma Nocturna'
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.description) {
      setMessage({ type: 'error', text: 'Por favor completa el título y la descripción.' });
      return;
    }

    // Si no hay archivo cargado, asignamos un audio de muestra por defecto
    const audioToSave = formData.audio_url || 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=meditation-relaxing-12028.mp3';
    const coverToSave = formData.cover_url || 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=800&q=80';

    setIsSubmitting(true);

    try {
      await onUploadSuccess({
        ...formData,
        audio_url: audioToSave,
        cover_url: coverToSave,
        file_size_bytes: selectedFile ? selectedFile.size : 7500000
      });

      setMessage({ type: 'success', text: '¡Meditación publicada con éxito en la plataforma!' });
      
      // Limpiar formulario
      setFormData({
        title: '',
        description: '',
        category_id: 'cat-1',
        category_name: 'Calma Nocturna',
        instructor_name: 'Elena Rostova',
        cover_url: '',
        audio_url: '',
        duration_seconds: 480,
        is_featured: false
      });
      setSelectedFile(null);
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'Error al publicar la meditación.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 rounded-3xl bg-midnight-900/90 border border-amberGlow-500/20 glass-card mb-8">
      
      <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-slate-800">
        <div className="p-2.5 rounded-2xl bg-amberGlow-500/10 text-amberGlow-400 border border-amberGlow-500/30">
          <Upload className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-serif text-lg font-bold text-white">Subir Nueva Meditación Guiada</h3>
          <p className="text-xs text-slate-400">Archivos soportados: MP3, M4A, WAV (Máximo 50MB)</p>
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-2xl mb-6 flex items-center space-x-3 text-sm ${
          message.type === 'success' ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
        }`}>
          {message.type === 'success' ? <CheckCircle className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
          <span>{message.text}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Drag & Drop Upload Zone */}
        <div className="relative border-2 border-dashed border-slate-700 hover:border-amberGlow-500/60 rounded-3xl p-6 text-center bg-midnight-950/50 transition duration-300 cursor-pointer">
          <input
            type="file"
            accept=".mp3,.m4a,.wav,audio/*"
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          <div className="flex flex-col items-center justify-center space-y-2 pointer-events-none">
            <div className="p-3 rounded-full bg-amberGlow-500/10 text-amberGlow-400">
              <Music className="w-8 h-8 animate-bounce" />
            </div>
            <p className="text-sm font-semibold text-slate-200">
              {selectedFile ? `Archivo seleccionado: ${selectedFile.name}` : 'Haz clic o arrastra tu archivo de audio aquí'}
            </p>
            <p className="text-xs text-slate-400">Formato MP3, M4A o WAV en alta resolución</p>
          </div>
        </div>

        {/* Metadata Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Título de la Meditación *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Ej: Viaje a la Serenidad Nocturna"
              className="w-full px-4 py-2.5 bg-midnight-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-amberGlow-500/50"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Categoría Principal *</label>
            <select
              value={formData.category_id}
              onChange={handleCategoryChange}
              className="w-full px-4 py-2.5 bg-midnight-950 border border-slate-800 rounded-xl text-sm text-amberGlow-300 focus:outline-none focus:border-amberGlow-500/50 cursor-pointer"
            >
              {INITIAL_CATEGORIES.map(cat => (
                <option key={cat.id} value={cat.id} className="bg-midnight-900 text-white">
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Nombre del Instructor / Guía</label>
            <input
              type="text"
              value={formData.instructor_name}
              onChange={(e) => setFormData({ ...formData, instructor_name: e.target.value })}
              placeholder="Ej: Elena Rostova"
              className="w-full px-4 py-2.5 bg-midnight-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-amberGlow-500/50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">URL de Imagen de Portada (Opcional)</label>
            <input
              type="url"
              value={formData.cover_url}
              onChange={(e) => setFormData({ ...formData, cover_url: e.target.value })}
              placeholder="https://images.unsplash.com/photo-..."
              className="w-full px-4 py-2.5 bg-midnight-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-amberGlow-500/50"
            />
          </div>

        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">Descripción y Guión de la Sesión *</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows="3"
            placeholder="Describe los beneficios, técnica de respiración o enfoque de esta meditación..."
            className="w-full px-4 py-2.5 bg-midnight-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-amberGlow-500/50"
            required
          />
        </div>

        {/* Featured Toggle */}
        <div className="flex items-center space-x-3 p-3 bg-midnight-950/60 rounded-xl border border-slate-800">
          <input
            type="checkbox"
            id="is_featured"
            checked={formData.is_featured}
            onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
            className="w-4 h-4 accent-amberGlow-500 rounded cursor-pointer"
          />
          <label htmlFor="is_featured" className="text-xs text-slate-300 font-medium cursor-pointer">
            Marcar como <span className="text-amberGlow-300 font-bold">Meditación Destacada</span> en la portada principal
          </label>
        </div>

        {/* Submit CTA */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3.5 px-6 rounded-2xl gold-gradient-bg text-midnight-950 font-bold text-sm shadow-candle hover:shadow-amberGlow-500/50 transition-all duration-300 flex items-center justify-center space-x-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>{isSubmitting ? 'Publicando...' : 'Publicar Meditación'}</span>
        </button>

      </form>
    </div>
  );
};
