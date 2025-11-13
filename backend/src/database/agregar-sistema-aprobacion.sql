-- ================================================
-- AGREGAR SISTEMA DE APROBACIÓN DE USUARIOS
-- ================================================

-- Agregar campo is_approved a la tabla users
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT false;

-- Agregar campo approved_by (quién aprobó)
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS approved_by UUID REFERENCES users(id) ON DELETE SET NULL;

-- Agregar campo approved_at (cuándo se aprobó)
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP;

-- Agregar campo rejection_reason (razón de rechazo si aplica)
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS rejection_reason TEXT;

-- Comentarios
COMMENT ON COLUMN users.is_approved IS 'Indica si el usuario ha sido aprobado por un docente/admin';
COMMENT ON COLUMN users.approved_by IS 'ID del usuario (docente/admin) que aprobó este usuario';
COMMENT ON COLUMN users.approved_at IS 'Fecha y hora de aprobación';
COMMENT ON COLUMN users.rejection_reason IS 'Razón de rechazo del usuario';

-- Aprobar automáticamente usuarios existentes (excepto estudiantes nuevos)
UPDATE users 
SET is_approved = true, 
    approved_at = CURRENT_TIMESTAMP
WHERE role IN ('administrador', 'docente');

-- Índice para buscar usuarios pendientes
CREATE INDEX IF NOT EXISTS idx_users_is_approved ON users(is_approved);

-- Vista de usuarios pendientes
CREATE OR REPLACE VIEW pending_users AS
SELECT 
    u.id,
    u.full_name,
    u.email,
    u.role,
    u.created_at,
    u.is_active,
    u.email_verified
FROM users u
WHERE u.is_approved = false
ORDER BY u.created_at DESC;

-- Verificar cambios
SELECT 
    column_name, 
    data_type, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'users' 
  AND column_name IN ('is_approved', 'approved_by', 'approved_at', 'rejection_reason')
ORDER BY column_name;

SELECT COUNT(*) as usuarios_pendientes FROM pending_users;

