-- ================================================
-- SCHEMA: Base de datos Semillas de Maíz - Nasa Yuwe
-- ================================================

-- Extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ================================================
-- TABLA: users (Usuarios del sistema)
-- ================================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('estudiante', 'docente', 'administrador')),
  is_active BOOLEAN DEFAULT true,
  email_verified BOOLEAN DEFAULT false,
  verification_token VARCHAR(255),
  reset_password_token VARCHAR(255),
  reset_password_expires TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para users
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_is_active ON users(is_active);

-- ================================================
-- TABLA: categories (Categorías del diccionario)
-- ================================================
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  icon_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ================================================
-- TABLA: words (Palabras del diccionario)
-- ================================================
CREATE TABLE IF NOT EXISTS words (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  spanish_word VARCHAR(255) NOT NULL,
  nasa_yuwe_word VARCHAR(255) NOT NULL,
  pronunciation VARCHAR(255),
  example_spanish TEXT,
  example_nasa_yuwe TEXT,
  audio_url VARCHAR(500),
  image_url VARCHAR(500),
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  difficulty_level VARCHAR(50) CHECK (difficulty_level IN ('facil', 'intermedio', 'avanzado')),
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para words
CREATE INDEX idx_words_spanish ON words(spanish_word);
CREATE INDEX idx_words_nasa_yuwe ON words(nasa_yuwe_word);
CREATE INDEX idx_words_category ON words(category_id);
CREATE INDEX idx_words_difficulty ON words(difficulty_level);

-- ================================================
-- TABLA: groups (Grupos de estudiantes)
-- ================================================
CREATE TABLE IF NOT EXISTS groups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  education_level VARCHAR(50) NOT NULL CHECK (education_level IN ('preescolar', 'primaria')),
  grade VARCHAR(50),
  difficulty_level VARCHAR(50) CHECK (difficulty_level IN ('facil', 'intermedio', 'avanzado')),
  teacher_id UUID REFERENCES users(id) ON DELETE CASCADE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para groups
CREATE INDEX idx_groups_teacher ON groups(teacher_id);
CREATE INDEX idx_groups_is_active ON groups(is_active);

-- ================================================
-- TABLA: group_students (Relación estudiantes-grupos)
-- ================================================
CREATE TABLE IF NOT EXISTS group_students (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id UUID REFERENCES groups(id) ON DELETE CASCADE,
  student_id UUID REFERENCES users(id) ON DELETE CASCADE,
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(group_id, student_id)
);

-- Índices para group_students
CREATE INDEX idx_group_students_group ON group_students(group_id);
CREATE INDEX idx_group_students_student ON group_students(student_id);

-- ================================================
-- TABLA: activities (Actividades de aprendizaje)
-- ================================================
CREATE TABLE IF NOT EXISTS activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  type VARCHAR(50) NOT NULL CHECK (type IN ('quiz', 'completar_oracion', 'asociar_imagen')),
  difficulty_level VARCHAR(50) CHECK (difficulty_level IN ('facil', 'intermedio', 'avanzado')),
  time_limit INTEGER, -- en segundos
  passing_score INTEGER DEFAULT 70, -- porcentaje mínimo para aprobar
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para activities
CREATE INDEX idx_activities_type ON activities(type);
CREATE INDEX idx_activities_difficulty ON activities(difficulty_level);
CREATE INDEX idx_activities_is_active ON activities(is_active);

-- ================================================
-- TABLA: questions (Preguntas de las actividades)
-- ================================================
CREATE TABLE IF NOT EXISTS questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  activity_id UUID REFERENCES activities(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  question_type VARCHAR(50) NOT NULL CHECK (question_type IN ('multiple_choice', 'fill_blank', 'image_match')),
  image_url VARCHAR(500),
  audio_url VARCHAR(500),
  correct_answer TEXT NOT NULL,
  points INTEGER DEFAULT 1,
  order_number INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para questions
CREATE INDEX idx_questions_activity ON questions(activity_id);
CREATE INDEX idx_questions_order ON questions(order_number);

-- ================================================
-- TABLA: question_options (Opciones de respuesta)
-- ================================================
CREATE TABLE IF NOT EXISTS question_options (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
  option_text TEXT NOT NULL,
  option_label VARCHAR(10) NOT NULL, -- A, B, C, etc.
  is_correct BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para question_options
CREATE INDEX idx_question_options_question ON question_options(question_id);

-- ================================================
-- TABLA: activity_attempts (Intentos de actividades)
-- ================================================
CREATE TABLE IF NOT EXISTS activity_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  activity_id UUID REFERENCES activities(id) ON DELETE CASCADE,
  student_id UUID REFERENCES users(id) ON DELETE CASCADE,
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  correct_answers INTEGER NOT NULL,
  time_taken INTEGER, -- en segundos
  completed BOOLEAN DEFAULT false,
  started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para activity_attempts
CREATE INDEX idx_activity_attempts_activity ON activity_attempts(activity_id);
CREATE INDEX idx_activity_attempts_student ON activity_attempts(student_id);
CREATE INDEX idx_activity_attempts_completed ON activity_attempts(completed);

-- ================================================
-- TABLA: student_answers (Respuestas de estudiantes)
-- ================================================
CREATE TABLE IF NOT EXISTS student_answers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  attempt_id UUID REFERENCES activity_attempts(id) ON DELETE CASCADE,
  question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
  selected_option_id UUID REFERENCES question_options(id) ON DELETE SET NULL,
  student_answer TEXT,
  is_correct BOOLEAN,
  points_earned INTEGER DEFAULT 0,
  answered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para student_answers
CREATE INDEX idx_student_answers_attempt ON student_answers(attempt_id);
CREATE INDEX idx_student_answers_question ON student_answers(question_id);

-- ================================================
-- TABLA: progress_tracking (Seguimiento de progreso)
-- ================================================
CREATE TABLE IF NOT EXISTS progress_tracking (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES users(id) ON DELETE CASCADE,
  total_activities_completed INTEGER DEFAULT 0,
  total_score INTEGER DEFAULT 0,
  average_score DECIMAL(5,2) DEFAULT 0,
  words_learned INTEGER DEFAULT 0,
  last_activity_date TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(student_id)
);

-- Índices para progress_tracking
CREATE INDEX idx_progress_tracking_student ON progress_tracking(student_id);

-- ================================================
-- TABLA: audit_log (Log de auditoría)
-- ================================================
CREATE TABLE IF NOT EXISTS audit_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(100),
  entity_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address VARCHAR(50),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para audit_log
CREATE INDEX idx_audit_log_user ON audit_log(user_id);
CREATE INDEX idx_audit_log_action ON audit_log(action);
CREATE INDEX idx_audit_log_created ON audit_log(created_at);

-- ================================================
-- TRIGGERS para updated_at automático
-- ================================================

-- Función para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Aplicar trigger a las tablas necesarias
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_words_updated_at BEFORE UPDATE ON words
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_groups_updated_at BEFORE UPDATE ON groups
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_activities_updated_at BEFORE UPDATE ON activities
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_questions_updated_at BEFORE UPDATE ON questions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_progress_tracking_updated_at BEFORE UPDATE ON progress_tracking
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ================================================
-- VISTAS ÚTILES
-- ================================================

-- Vista de estadísticas por estudiante
CREATE OR REPLACE VIEW student_statistics AS
SELECT 
    u.id as student_id,
    u.full_name,
    u.email,
    COUNT(DISTINCT aa.id) as total_attempts,
    COUNT(DISTINCT CASE WHEN aa.completed = true THEN aa.id END) as completed_attempts,
    ROUND(AVG(CASE WHEN aa.completed = true THEN aa.score END), 2) as average_score,
    MAX(aa.completed_at) as last_activity
FROM users u
LEFT JOIN activity_attempts aa ON u.id = aa.student_id
WHERE u.role = 'estudiante'
GROUP BY u.id, u.full_name, u.email;

-- Vista de estadísticas por grupo
CREATE OR REPLACE VIEW group_statistics AS
SELECT 
    g.id as group_id,
    g.name as group_name,
    g.education_level,
    g.grade,
    COUNT(DISTINCT gs.student_id) as total_students,
    COUNT(DISTINCT aa.id) as total_attempts,
    ROUND(AVG(aa.score), 2) as average_score
FROM groups g
LEFT JOIN group_students gs ON g.id = gs.group_id
LEFT JOIN activity_attempts aa ON gs.student_id = aa.student_id
GROUP BY g.id, g.name, g.education_level, g.grade;

COMMENT ON TABLE users IS 'Usuarios del sistema (estudiantes, docentes, administradores)';
COMMENT ON TABLE categories IS 'Categorías para clasificar palabras del diccionario';
COMMENT ON TABLE words IS 'Diccionario de palabras en español y Nasa Yuwe';
COMMENT ON TABLE groups IS 'Grupos de estudiantes creados por docentes';
COMMENT ON TABLE activities IS 'Actividades de aprendizaje disponibles';
COMMENT ON TABLE questions IS 'Preguntas asociadas a cada actividad';
COMMENT ON TABLE activity_attempts IS 'Intentos de estudiantes en las actividades';
COMMENT ON TABLE progress_tracking IS 'Seguimiento del progreso de cada estudiante';

