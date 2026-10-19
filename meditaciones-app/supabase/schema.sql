-- ============================================================
-- ZENITH MIND: ESQUEMA DE BASE DE DATOS Y POLITICAS DE SEGURIDAD (RLS)
-- Supabase / PostgreSQL
-- ============================================================

-- Habilitar extensión para UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. TABLA DE PERFILES DE USUARIOS (Profiles & Roles RBAC)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'buyer' CHECK (role IN ('buyer', 'admin')),
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. TABLA DE CATEGORIAS
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT DEFAULT 'Moon',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. TABLA DE MEDITACIONES GUIADAS
CREATE TABLE IF NOT EXISTS public.meditations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  category_name TEXT,
  audio_url TEXT NOT NULL,
  cover_url TEXT,
  duration_seconds INTEGER NOT NULL DEFAULT 300,
  instructor_name TEXT DEFAULT 'Guía Nocturno',
  is_featured BOOLEAN DEFAULT false,
  plays_count INTEGER DEFAULT 0,
  file_size_bytes BIGINT DEFAULT 5000000,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. TABLA DE FAVORITOS DE USUARIO
CREATE TABLE IF NOT EXISTS public.user_favorites (
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  meditation_id UUID REFERENCES public.meditations(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  PRIMARY KEY (user_id, meditation_id)
);

-- ============================================================
-- CONTROL DE ACCESO BASADO EN ROLES (RBAC) & ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE public.meditations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Lectura pública para meditaciones
CREATE POLICY "Meditaciones visibles para todos"
  ON public.meditations FOR SELECT USING (true);

-- Solo administradores pueden insertar, editar o borrar en meditaciones
CREATE POLICY "Solo administradores pueden crear meditaciones"
  ON public.meditations FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Solo administradores pueden editar meditaciones"
  ON public.meditations FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Solo administradores pueden borrar meditaciones"
  ON public.meditations FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================================
-- DATOS INICIALES (SEED DATA)
-- ============================================================

INSERT INTO public.categories (name, slug, description, icon) VALUES
('Calma Nocturna', 'calma-nocturna', 'Meditaciones diseñadas para serenar la mente al final de la jornada.', 'Moon'),
('Sueño Profundo', 'sueno-profundo', 'Sonidos envolventes y guía para conciliar el descanso reparador.', 'Bed'),
('Ansiedad y Estrés', 'ansiedad-estres', 'Liberación de tensión muscular y calma mental inmediata.', 'Wind'),
('Respiración Consciente', 'respiracion', 'Técnicas de inhalación y exhalación diafragmática.', 'Activity'),
('Gratitud y Amor Propio', 'gratitud', 'Conexión con la compasión interna y el agradecimiento diario.', 'Heart')
ON CONFLICT (slug) DO NOTHING;
