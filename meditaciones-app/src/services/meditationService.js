import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { INITIAL_MEDITATIONS, INITIAL_CATEGORIES } from '../lib/mockData';

const LOCAL_STORAGE_KEY = 'zenith_meditations_store';
const LOCAL_FAVORITES_KEY = 'zenith_favorites_store';

// Helper local storage setup
const getLocalData = () => {
  const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_MEDITATIONS));
    return INITIAL_MEDITATIONS;
  }
  try {
    return JSON.parse(stored);
  } catch (e) {
    console.error("Error al parsear local storage, reiniciando data:", e);
    return INITIAL_MEDITATIONS;
  }
};

const saveLocalData = (data) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
};

export const meditationService = {
  // Obtenemos todas las meditaciones (Supabase o LocalStorage fallback)
  async getMeditations() {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('meditations')
          .select('*, categories(name, slug)')
          .order('created_at', { ascending: false });
        if (!error && data) return data;
      } catch (err) {
        console.warn("Fallo al conectar con Supabase, usando almacenamiento local:", err);
      }
    }
    return getLocalData();
  },

  // Crear una nueva meditación (Upload de Admin)
  async createMeditation(meditationData) {
    const newMeditation = {
      id: 'med-' + Date.now(),
      title: meditationData.title,
      description: meditationData.description,
      category_id: meditationData.category_id || 'cat-1',
      category_name: meditationData.category_name || 'Calma Nocturna',
      duration_seconds: parseInt(meditationData.duration_seconds || 300, 10),
      audio_url: meditationData.audio_url,
      cover_url: meditationData.cover_url || 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=800&q=80',
      instructor_name: meditationData.instructor_name || 'Guía Zenith',
      is_featured: Boolean(meditationData.is_featured),
      plays_count: 0,
      file_size_bytes: meditationData.file_size_bytes || 5000000,
      created_at: new Date().toISOString()
    };

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('meditations')
          .insert([newMeditation])
          .select();
        if (!error && data) return data[0];
      } catch (err) {
        console.warn("Fallo al guardar en Supabase, guardando en local storage:", err);
      }
    }

    const current = getLocalData();
    const updated = [newMeditation, ...current];
    saveLocalData(updated);
    return newMeditation;
  },

  // Actualizar metadatos de meditación existente (Update)
  async updateMeditation(id, updateData) {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('meditations')
          .update(updateData)
          .eq('id', id)
          .select();
        if (!error && data) return data[0];
      } catch (err) {
        console.warn("Error editando en Supabase, aplicando en storage local:", err);
      }
    }

    const current = getLocalData();
    const updated = current.map(item => item.id === id ? { ...item, ...updateData } : item);
    saveLocalData(updated);
    return updated.find(item => item.id === id);
  },

  // Eliminar una meditación (Delete)
  async deleteMeditation(id) {
    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase
          .from('meditations')
          .delete()
          .eq('id', id);
        if (!error) return true;
      } catch (err) {
        console.warn("Error eliminando de Supabase:", err);
      }
    }

    const current = getLocalData();
    const filtered = current.filter(item => item.id !== id);
    saveLocalData(filtered);
    return true;
  },

  // Favoritos
  getFavorites() {
    try {
      const stored = localStorage.getItem(LOCAL_FAVORITES_KEY);
      return stored ? JSON.parse(stored) : ['med-1'];
    } catch {
      return ['med-1'];
    }
  },

  toggleFavorite(id) {
    const favorites = this.getFavorites();
    const updated = favorites.includes(id) 
      ? favorites.filter(favId => favId !== id)
      : [...favorites, id];
    localStorage.setItem(LOCAL_FAVORITES_KEY, JSON.stringify(updated));
    return updated;
  }
};
