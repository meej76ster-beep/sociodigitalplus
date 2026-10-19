import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { AMBIENT_TRACKS } from '../lib/mockData';

const AudioContext = createContext();

export const AudioProvider = ({ children }) => {
  const [currentMeditation, setCurrentMeditation] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isVisualizerOpen, setIsVisualizerOpen] = useState(false);
  
  // Sonido ambiental de fondo (Lluvia, Olas, Bosque)
  const [activeAmbient, setActiveAmbient] = useState(null); // 'rain' | 'waves' | 'forest' | null
  const [ambientVolume, setAmbientVolume] = useState(0.3);

  // Modal de compartir
  const [shareTarget, setShareTarget] = useState(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Mensaje flotante de notificación (Toast)
  const [toastMessage, setToastMessage] = useState(null);

  const audioRef = useRef(new Audio());
  const ambientAudioRef = useRef(new Audio());

  // Inicializar listeners del audio principal
  useEffect(() => {
    const audio = audioRef.current;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration || 0);
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  // Actualizar volumen y velocidad del audio principal
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
      audioRef.current.playbackRate = playbackRate;
    }
  }, [volume, isMuted, playbackRate]);

  // Actualizar audio ambiental
  useEffect(() => {
    const ambientAudio = ambientAudioRef.current;
    if (activeAmbient) {
      const track = AMBIENT_TRACKS.find(t => t.id === activeAmbient);
      if (track) {
        ambientAudio.src = track.url;
        ambientAudio.loop = true;
        ambientAudio.volume = ambientVolume;
        ambientAudio.play().catch(e => console.warn("Auto-play ambiental restringido por navegador:", e));
      }
    } else {
      ambientAudio.pause();
    }
  }, [activeAmbient]);

  useEffect(() => {
    if (ambientAudioRef.current) {
      ambientAudioRef.current.volume = ambientVolume;
    }
  }, [ambientVolume]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Cargar y reproducir una meditación
  const playMeditation = (meditation) => {
    if (!meditation) return;

    if (currentMeditation?.id === meditation.id) {
      // Toggle reproducir/pausar
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play().then(() => setIsPlaying(true)).catch(err => {
          console.error("Error al reproducir audio:", err);
          showToast("No se pudo iniciar la reproducción del audio.");
        });
      }
    } else {
      // Nueva meditación seleccionada
      setCurrentMeditation(meditation);
      audioRef.current.src = meditation.audio_url;
      audioRef.current.currentTime = 0;
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(err => {
        console.error("Error al reproducir nuevo audio:", err);
        showToast("Error al cargar la pista de audio.");
      });
    }
  };

  const pauseMeditation = () => {
    audioRef.current.pause();
    setIsPlaying(false);
  };

  const seekTo = (seconds) => {
    if (audioRef.current) {
      audioRef.current.currentTime = seconds;
      setCurrentTime(seconds);
    }
  };

  const skipTime = (deltaSeconds) => {
    if (audioRef.current) {
      const newTime = Math.min(Math.max(audioRef.current.currentTime + deltaSeconds, 0), duration);
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const toggleAmbientSound = (ambientId) => {
    if (activeAmbient === ambientId) {
      setActiveAmbient(null);
    } else {
      setActiveAmbient(ambientId);
    }
  };

  // Descargar archivo para consumo offline
  const downloadAudioFile = async (meditation) => {
    const med = meditation || currentMeditation;
    if (!med) return;

    showToast(`Iniciando descarga de "${med.title}"...`);

    try {
      const response = await fetch(med.audio_url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `${med.title.replace(/[^a-zA-Z0-9]/g, '_')}.mp3`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      showToast(`¡Descarga completada! "${med.title}" guardada.`);
    } catch (err) {
      console.warn("Fallo descarga blob directa, abriendo en nueva pestaña:", err);
      window.open(med.audio_url, '_blank');
      showToast("Descarga abierta en navegador.");
    }
  };

  // Abrir Modal de Compartir / Web Share API
  const shareMeditation = async (meditation) => {
    const med = meditation || currentMeditation;
    if (!med) return;

    const shareData = {
      title: `Zenith Mind: ${med.title}`,
      text: `Escucha esta meditación guiada: "${med.title}" - ${med.description}`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        showToast("¡Gracias por compartir esta experiencia de calma!");
        return;
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.warn("Error en Web Share API, abriendo modal de respaldo:", err);
        }
      }
    }
    
    // Fallback Modal
    setShareTarget(med);
    setIsShareModalOpen(true);
  };

  return (
    <AudioContext.Provider value={{
      currentMeditation,
      isPlaying,
      currentTime,
      duration,
      volume,
      setVolume,
      isMuted,
      toggleMute,
      playbackRate,
      setPlaybackRate,
      playMeditation,
      pauseMeditation,
      seekTo,
      skipTime,
      isVisualizerOpen,
      setIsVisualizerOpen,
      activeAmbient,
      toggleAmbientSound,
      ambientVolume,
      setAmbientVolume,
      downloadAudioFile,
      shareMeditation,
      shareTarget,
      isShareModalOpen,
      setIsShareModalOpen,
      toastMessage,
      showToast
    }}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio debe ser usado dentro de un AudioProvider');
  }
  return context;
};
