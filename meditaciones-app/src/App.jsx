import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AudioProvider, useAudio } from './context/AudioContext';
import { Navbar } from './components/layout/Navbar';
import { HeroBanner } from './components/layout/HeroBanner';
import { Footer } from './components/layout/Footer';
import { CategoryFilter } from './components/library/CategoryFilter';
import { SearchHeader } from './components/library/SearchHeader';
import { MeditationGrid } from './components/library/MeditationGrid';
import { AdvancedAudioPlayer } from './components/audio/AdvancedAudioPlayer';
import { CandleVisualizer } from './components/audio/CandleVisualizer';
import { AdminHeader } from './components/admin/AdminHeader';
import { AudioUploader } from './components/admin/AudioUploader';
import { MeditationTable } from './components/admin/MeditationTable';
import { ToastNotification } from './components/ui/ToastNotification';
import { ShareModal } from './components/ui/ShareModal';
import { meditationService } from './services/meditationService';
import { INITIAL_CATEGORIES } from './lib/mockData';
import { ShieldAlert, Compass, Heart } from 'lucide-react';

const MainContent = () => {
  const { isAdmin } = useAuth();
  const [meditations, setMeditations] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [currentTab, setCurrentTab] = useState('library'); // 'library' | 'favorites' | 'admin'

  // Filtros
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [durationFilter, setDurationFilter] = useState('all');

  // Carga inicial
  useEffect(() => {
    loadMeditations();
    setFavorites(meditationService.getFavorites());
  }, []);

  const loadMeditations = async () => {
    const data = await meditationService.getMeditations();
    setMeditations(data);
  };

  const handleToggleFavorite = (id) => {
    const updated = meditationService.toggleFavorite(id);
    setFavorites(updated);
  };

  const handleUploadSuccess = async (newMeditationData) => {
    const created = await meditationService.createMeditation(newMeditationData);
    await loadMeditations();
    return created;
  };

  const handleUpdateMeditation = async (id, updateData) => {
    await meditationService.updateMeditation(id, updateData);
    await loadMeditations();
  };

  const handleDeleteMeditation = async (id) => {
    await meditationService.deleteMeditation(id);
    await loadMeditations();
  };

  // Filtrado de meditaciones
  const filteredMeditations = meditations.filter(med => {
    // Filtro por categoría
    if (selectedCategory !== 'all' && med.category_id !== selectedCategory) {
      return false;
    }

    // Filtro por palabra clave
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const matchTitle = med.title.toLowerCase().includes(term);
      const matchDesc = med.description.toLowerCase().includes(term);
      const matchInstructor = med.instructor_name?.toLowerCase().includes(term);
      if (!matchTitle && !matchDesc && !matchInstructor) return false;
    }

    // Filtro por duración
    if (durationFilter === 'short' && med.duration_seconds >= 360) return false; // < 6 min
    if (durationFilter === 'medium' && (med.duration_seconds < 360 || med.duration_seconds > 600)) return false; // 6-10 min
    if (durationFilter === 'long' && med.duration_seconds <= 600) return false; // > 10 min

    return true;
  });

  const favoritedMeditationsList = meditations.filter(m => favorites.includes(m.id));
  const featuredMeditation = meditations.find(m => m.is_featured) || meditations[0];

  return (
    <div className="min-h-screen flex flex-col justify-between pb-28">
      
      {/* Toast Notifications */}
      <ToastNotification />

      {/* Share Modal */}
      <ShareModal />

      {/* Fullscreen Candle Light Visualizer */}
      <CandleVisualizer />

      {/* Top Navbar with Role Switcher & Tabs */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        favoritesCount={favorites.length}
      />

      {/* Main View Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 flex-1 w-full">
        
        {/* VIEW 1: BIBLIOTECA DE MEDITACIONES */}
        {currentTab === 'library' && (
          <div className="animate-fadeIn">
            {/* Hero Section */}
            <HeroBanner featuredMeditation={featuredMeditation} />

            {/* Filter Pills */}
            <CategoryFilter
              categories={INITIAL_CATEGORIES}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />

            {/* Search and Duration Filter Header */}
            <SearchHeader
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              durationFilter={durationFilter}
              setDurationFilter={setDurationFilter}
              totalResults={filteredMeditations.length}
            />

            {/* Grid Cards */}
            <MeditationGrid
              meditations={filteredMeditations}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
            />
          </div>
        )}

        {/* VIEW 2: FAVORITOS */}
        {currentTab === 'favorites' && (
          <div className="animate-fadeIn py-6">
            <div className="flex items-center space-x-3 mb-8">
              <div className="p-3 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/30">
                <Heart className="w-6 h-6 fill-current" />
              </div>
              <div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">Mis Meditaciones Guardadas</h2>
                <p className="text-xs sm:text-sm text-slate-400">Tus momentos favoritos de introspección y descanso.</p>
              </div>
            </div>

            <MeditationGrid
              meditations={favoritedMeditationsList}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
            />
          </div>
        )}

        {/* VIEW 3: PANEL DE ADMINISTRACION (PROTEGIDO POR RBAC) */}
        {currentTab === 'admin' && (
          <div className="animate-fadeIn py-4">
            {isAdmin ? (
              <div>
                <AdminHeader meditationsCount={meditations.length} />
                
                {/* Formulario de Carga */}
                <AudioUploader onUploadSuccess={handleUploadSuccess} />

                {/* Tabla CRUD */}
                <MeditationTable
                  meditations={meditations}
                  onUpdateMeditation={handleUpdateMeditation}
                  onDeleteMeditation={handleDeleteMeditation}
                />
              </div>
            ) : (
              <div className="text-center py-20 px-6 rounded-3xl bg-midnight-900/60 border border-slate-800">
                <div className="inline-flex p-4 rounded-full bg-rose-500/10 text-rose-400 mb-4 border border-rose-500/20">
                  <ShieldAlert className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-serif font-bold text-white mb-2">Acceso Restringido (RBAC)</h3>
                <p className="text-slate-400 text-sm max-w-md mx-auto mb-6">
                  El Panel de Administración requiere permisos con rol <span className="text-amberGlow-400 font-bold">ADMINISTRADOR</span>. Utiliza el conmutador de rol ubicado en la esquina superior derecha para alternar tu rol.
                </p>
              </div>
            )}
          </div>
        )}

      </main>

      {/* Floating Bottom Audio Player */}
      <AdvancedAudioPlayer />

      {/* Footer */}
      <Footer />

    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AudioProvider>
        <MainContent />
      </AudioProvider>
    </AuthProvider>
  );
}
