export const INITIAL_CATEGORIES = [
  { id: 'cat-1', name: 'Calma Nocturna', slug: 'calma-nocturna', icon: 'Moon', description: 'Meditaciones diseñadas para serenar la mente al final de la jornada.' },
  { id: 'cat-2', name: 'Sueño Profundo', slug: 'sueno-profundo', icon: 'Bed', description: 'Sonidos envolventes y guía para conciliar el descanso reparador.' },
  { id: 'cat-3', name: 'Ansiedad y Estrés', slug: 'ansiedad-estres', icon: 'Wind', description: 'Liberación de tensión muscular y calma mental inmediata.' },
  { id: 'cat-4', name: 'Respiración Consciente', slug: 'respiracion', icon: 'Activity', description: 'Técnicas de inhalación y exhalación diafragmática.' },
  { id: 'cat-5', name: 'Gratitud y Amor Propio', slug: 'gratitud', icon: 'Heart', description: 'Conexión con la compasión interna y el agradecimiento diario.' },
  { id: 'cat-6', name: 'Enfoque y Claridad', slug: 'enfoque', icon: 'Sun', description: 'Reinicio mental para momentos de alta exigencia o dispersión.' },
];

export const INITIAL_MEDITATIONS = [
  {
    id: 'med-1',
    title: 'Viaje a la Serenidad Nocturna',
    description: 'Una meditación guiada con tonos dorados y respiración pausada para desconectar del ruido diario y entrar en calma profunda.',
    category_id: 'cat-1',
    category_name: 'Calma Nocturna',
    duration_seconds: 480, // 8 min
    audio_url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=meditation-relaxing-12028.mp3',
    cover_url: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=800&q=80',
    instructor_name: 'Elena Rostova',
    is_featured: true,
    plays_count: 1420,
    file_size_bytes: 7680000,
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'med-2',
    title: 'Luz de Vela y Descanso Profundo',
    description: 'Imagina la llama tibia de una vela disolviendo tus pensamientos mientras te sumerges en un sueño placentero.',
    category_id: 'cat-2',
    category_name: 'Sueño Profundo',
    duration_seconds: 720, // 12 min
    audio_url: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73950.mp3?filename=deep-meditation-10948.mp3',
    cover_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    instructor_name: 'Mateo Silveira',
    is_featured: true,
    plays_count: 980,
    file_size_bytes: 11500000,
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: 'med-3',
    title: 'Respiración en 4 Tiempos (Pranayama)',
    description: 'Técnica de respiración cuadrada para desactivar la respuesta de estrés en el sistema nervioso en menos de 5 minutos.',
    category_id: 'cat-4',
    category_name: 'Respiración Consciente',
    duration_seconds: 300, // 5 min
    audio_url: 'https://cdn.pixabay.com/download/audio/2021/09/06/audio_404c0cb8db.mp3?filename=ambient-sound-meditation-7601.mp3',
    cover_url: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80',
    instructor_name: 'Sofia Benítez',
    is_featured: false,
    plays_count: 2150,
    file_size_bytes: 4800000,
    created_at: new Date(Date.now() - 86400000 * 8).toISOString(),
  },
  {
    id: 'med-4',
    title: 'Disolviendo la Ansiedad',
    description: 'Visualización guiada para soltar la rigidez en los hombros, el pecho y la mandíbula mediante escaneo corporal.',
    category_id: 'cat-3',
    category_name: 'Ansiedad y Estrés',
    duration_seconds: 600, // 10 min
    audio_url: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=zen-meditation-9441.mp3',
    cover_url: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&w=800&q=80',
    instructor_name: 'Elena Rostova',
    is_featured: false,
    plays_count: 870,
    file_size_bytes: 9600000,
    created_at: new Date(Date.now() - 86400000 * 12).toISOString(),
  },
  {
    id: 'med-5',
    title: 'Gratitud al Atardecer',
    description: 'Pausa reflexiva para cultivar el reconocimiento activo de 3 momentos valiosos vividos durante el día.',
    category_id: 'cat-5',
    category_name: 'Gratitud y Amor Propio',
    duration_seconds: 420, // 7 min
    audio_url: 'https://cdn.pixabay.com/download/audio/2022/10/14/audio_9937f378a5.mp3?filename=soft-meditation-122907.mp3',
    cover_url: 'https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?auto=format&fit=crop&w=800&q=80',
    instructor_name: 'Lucas Varela',
    is_featured: false,
    plays_count: 530,
    file_size_bytes: 6700000,
    created_at: new Date(Date.now() - 86400000 * 15).toISOString(),
  }
];

export const AMBIENT_TRACKS = [
  { id: 'rain', name: 'Lluvia Suave', url: 'https://cdn.pixabay.com/download/audio/2021/08/09/audio_8a8a473347.mp3?filename=rain-and-thunder-nature-sounds-7803.mp3', icon: 'CloudRain' },
  { id: 'waves', name: 'Olas de Mar', url: 'https://cdn.pixabay.com/download/audio/2022/06/03/audio_731ee9d968.mp3?filename=sea-waves-112906.mp3', icon: 'Waves' },
  { id: 'forest', name: 'Viento del Bosque', url: 'https://cdn.pixabay.com/download/audio/2021/09/06/audio_29fbefdd59.mp3?filename=forest-wind-birds-7634.mp3', icon: 'Trees' },
];
