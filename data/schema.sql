-- ============================================================================
-- BASE DE DATOS: DEL CHAT AL AGENTE: GO
-- Especialista: Esp. Maria Esther Espinoza
-- Repositorio: https://github.com/meej76ster-beep/sociodigitalplus
-- Motor compatible: PostgreSQL / Supabase / SQLite3
-- ============================================================================

-- 1. TABLA DE USUARIOS Y PERFILES
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    institution VARCHAR(255),
    specialty VARCHAR(120),
    role VARCHAR(100) DEFAULT 'Estudiante',
    is_premium BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. TABLA DE PROGRESO DE APRENDIZAJE POR USUARIO
CREATE TABLE IF NOT EXISTS user_progress (
    user_id VARCHAR(64) PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    current_level VARCHAR(32) DEFAULT 'level-1',
    total_progress INT DEFAULT 0,
    xp INT DEFAULT 0,
    streak INT DEFAULT 1,
    last_streak_date DATE,
    unlocked_levels JSONB DEFAULT '["level-1"]'::jsonb,
    premium_status BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. HISTORIAL DE MICROLECCIONES COMPLETADAS
CREATE TABLE IF NOT EXISTS lesson_completions (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    lesson_id VARCHAR(64) NOT NULL,
    level_id VARCHAR(32) NOT NULL,
    xp_earned INT DEFAULT 20,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_user_lesson UNIQUE (user_id, lesson_id)
);

-- 4. INTENTOS DE EVALUACIONES FORMATIVAS
CREATE TABLE IF NOT EXISTS assessment_attempts (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    level_id VARCHAR(32) NOT NULL,
    score INT NOT NULL,
    passed BOOLEAN NOT NULL,
    details JSONB,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. REGISTROS AL WEBINAR CONJUNTO (LEGAL + CONTABLE)
CREATE TABLE IF NOT EXISTS webinar_registrations (
    id SERIAL PRIMARY KEY,
    ticket_id VARCHAR(64) UNIQUE NOT NULL,
    user_id VARCHAR(64),
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    country VARCHAR(100) NOT NULL,
    institution VARCHAR(255),
    specialty VARCHAR(120),
    teacher_role VARCHAR(120),
    ai_experience VARCHAR(100),
    ai_tools JSONB,
    speaker_question TEXT,
    registered_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. MENSAJES Y CONVERSACIONES CON EL TUTOR VIRTUAL IA
CREATE TABLE IF NOT EXISTS tutor_chat_logs (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL,
    sender VARCHAR(32) NOT NULL, -- 'user' | 'assistant'
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ÍNDICES DE CONSULTA RÁPIDA
CREATE INDEX IF NOT EXISTS idx_user_progress_xp ON user_progress(xp DESC);
CREATE INDEX IF NOT EXISTS idx_lesson_completions_user ON lesson_completions(user_id);
CREATE INDEX IF NOT EXISTS idx_webinar_registrations_email ON webinar_registrations(email);
