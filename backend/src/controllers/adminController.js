import bcrypt from 'bcrypt';
import pool from '../config/database.js';
import { AppError } from '../middlewares/errorHandler.js';

/**
 * Obtener todos los usuarios
 */
export const getAllUsers = async (req, res, next) => {
  try {
    const { role, is_active, search } = req.query;
    
    let query = 'SELECT id, full_name, email, role, is_active, email_verified, created_at FROM users WHERE 1=1';
    const params = [];
    let paramCount = 1;

    if (role) {
      query += ` AND role = $${paramCount}`;
      params.push(role);
      paramCount++;
    }

    if (is_active !== undefined) {
      query += ` AND is_active = $${paramCount}`;
      params.push(is_active === 'true');
      paramCount++;
    }

    if (search) {
      query += ` AND (LOWER(full_name) LIKE LOWER($${paramCount}) OR LOWER(email) LIKE LOWER($${paramCount}))`;
      params.push(`%${search}%`);
      paramCount++;
    }

    query += ' ORDER BY created_at DESC';

    const result = await pool.query(query, params);

    res.json({
      users: result.rows,
      total: result.rows.length
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Crear usuario (por administrador)
 */
export const createUser = async (req, res, next) => {
  try {
    const { full_name, email, password, role } = req.body;

    // Verificar si el email ya existe
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      throw new AppError('El correo electrónico ya está registrado', 400);
    }

    // Hashear contraseña
    const password_hash = await bcrypt.hash(password, 10);

    // Insertar usuario
    const result = await pool.query(
      `INSERT INTO users (full_name, email, password_hash, role, is_active, email_verified)
       VALUES ($1, $2, $3, $4, true, true)
       RETURNING id, full_name, email, role, is_active, created_at`,
      [full_name, email, password_hash, role]
    );

    res.status(201).json({
      message: 'Usuario creado exitosamente',
      user: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Actualizar usuario
 */
export const updateUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { full_name, email, role, is_active } = req.body;

    const result = await pool.query(
      `UPDATE users 
       SET full_name = COALESCE($1, full_name),
           email = COALESCE($2, email),
           role = COALESCE($3, role),
           is_active = COALESCE($4, is_active),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $5
       RETURNING id, full_name, email, role, is_active, created_at`,
      [full_name, email, role, is_active, userId]
    );

    if (result.rows.length === 0) {
      throw new AppError('Usuario no encontrado', 404);
    }

    res.json({
      message: 'Usuario actualizado exitosamente',
      user: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Eliminar usuario
 */
export const deleteUser = async (req, res, next) => {
  try {
    const { userId } = req.params;

    // No permitir eliminar al usuario autenticado
    if (userId === req.user.id) {
      throw new AppError('No puede eliminar su propia cuenta', 400);
    }

    const result = await pool.query(
      'DELETE FROM users WHERE id = $1 RETURNING id',
      [userId]
    );

    if (result.rows.length === 0) {
      throw new AppError('Usuario no encontrado', 404);
    }

    res.json({
      message: 'Usuario eliminado exitosamente'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Activar/Desactivar usuario
 */
export const toggleUserStatus = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { is_active } = req.body;

    const result = await pool.query(
      'UPDATE users SET is_active = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [is_active, userId]
    );

    if (result.rows.length === 0) {
      throw new AppError('Usuario no encontrado', 404);
    }

    res.json({
      message: `Usuario ${is_active ? 'activado' : 'desactivado'} exitosamente`,
      user: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Asignar rol a usuario
 */
export const assignRole = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!['estudiante', 'docente', 'administrador'].includes(role)) {
      throw new AppError('Rol inválido', 400);
    }

    const result = await pool.query(
      'UPDATE users SET role = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [role, userId]
    );

    if (result.rows.length === 0) {
      throw new AppError('Usuario no encontrado', 404);
    }

    res.json({
      message: 'Rol asignado con éxito',
      user: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Gestión de contenido - Palabras
 */
export const getWords = async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT w.*, c.name as category_name
       FROM words w
       LEFT JOIN categories c ON w.category_id = c.id
       ORDER BY w.created_at DESC`
    );

    res.json({
      words: result.rows,
      total: result.rows.length
    });
  } catch (error) {
    next(error);
  }
};

export const createWord = async (req, res, next) => {
  try {
    const {
      spanish_word,
      nasa_yuwe_word,
      pronunciation,
      example_spanish,
      example_nasa_yuwe,
      category_id,
      difficulty_level,
      audio_url,
      image_url
    } = req.body;

    const result = await pool.query(
      `INSERT INTO words (spanish_word, nasa_yuwe_word, pronunciation, example_spanish, 
                          example_nasa_yuwe, category_id, difficulty_level, audio_url, 
                          image_url, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [spanish_word, nasa_yuwe_word, pronunciation, example_spanish, example_nasa_yuwe,
       category_id, difficulty_level, audio_url, image_url, req.user.id]
    );

    res.status(201).json({
      message: 'Palabra creada exitosamente',
      word: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
};

export const updateWord = async (req, res, next) => {
  try {
    const { wordId } = req.params;
    const {
      spanish_word,
      nasa_yuwe_word,
      pronunciation,
      example_spanish,
      example_nasa_yuwe,
      category_id,
      difficulty_level,
      audio_url,
      image_url
    } = req.body;

    const result = await pool.query(
      `UPDATE words 
       SET spanish_word = COALESCE($1, spanish_word),
           nasa_yuwe_word = COALESCE($2, nasa_yuwe_word),
           pronunciation = COALESCE($3, pronunciation),
           example_spanish = COALESCE($4, example_spanish),
           example_nasa_yuwe = COALESCE($5, example_nasa_yuwe),
           category_id = COALESCE($6, category_id),
           difficulty_level = COALESCE($7, difficulty_level),
           audio_url = COALESCE($8, audio_url),
           image_url = COALESCE($9, image_url),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $10
       RETURNING *`,
      [spanish_word, nasa_yuwe_word, pronunciation, example_spanish, example_nasa_yuwe,
       category_id, difficulty_level, audio_url, image_url, wordId]
    );

    if (result.rows.length === 0) {
      throw new AppError('Palabra no encontrada', 404);
    }

    res.json({
      message: 'Palabra actualizada exitosamente',
      word: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
};

export const deleteWord = async (req, res, next) => {
  try {
    const { wordId } = req.params;

    const result = await pool.query(
      'DELETE FROM words WHERE id = $1 RETURNING id',
      [wordId]
    );

    if (result.rows.length === 0) {
      throw new AppError('Palabra no encontrada', 404);
    }

    res.json({
      message: 'Palabra eliminada exitosamente'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Gestión de contenido - Actividades
 */
export const getAllActivities = async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT a.*, COUNT(q.id) as question_count
       FROM activities a
       LEFT JOIN questions q ON a.id = q.activity_id
       GROUP BY a.id
       ORDER BY a.created_at DESC`
    );

    res.json({
      activities: result.rows,
      total: result.rows.length
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Estadísticas generales
 */
export const getGeneralStatistics = async (req, res, next) => {
  try {
    // Total de usuarios por rol
    const usersResult = await pool.query(
      `SELECT role, COUNT(*) as count, 
              COUNT(CASE WHEN is_active = true THEN 1 END) as active_count
       FROM users
       GROUP BY role`
    );

    // Total de palabras
    const wordsResult = await pool.query(
      'SELECT COUNT(*) as count FROM words'
    );

    // Total de actividades
    const activitiesResult = await pool.query(
      'SELECT COUNT(*) as count FROM activities WHERE is_active = true'
    );

    // Total de intentos completados
    const attemptsResult = await pool.query(
      'SELECT COUNT(*) as count FROM activity_attempts WHERE completed = true'
    );

    // Promedio general de puntuación
    const averageResult = await pool.query(
      'SELECT ROUND(AVG(score), 2) as average_score FROM activity_attempts WHERE completed = true'
    );

    // Actividad por mes (últimos 6 meses)
    const activityByMonth = await pool.query(
      `SELECT 
         TO_CHAR(completed_at, 'YYYY-MM') as month,
         COUNT(*) as attempt_count
       FROM activity_attempts
       WHERE completed = true 
       AND completed_at >= NOW() - INTERVAL '6 months'
       GROUP BY TO_CHAR(completed_at, 'YYYY-MM')
       ORDER BY month DESC`
    );

    res.json({
      users: usersResult.rows,
      total_words: parseInt(wordsResult.rows[0].count),
      total_activities: parseInt(activitiesResult.rows[0].count),
      total_attempts: parseInt(attemptsResult.rows[0].count),
      average_score: parseFloat(averageResult.rows[0].average_score) || 0,
      activity_by_month: activityByMonth.rows
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Subir audio para una palabra
 */
export const uploadAudio = async (req, res, next) => {
  try {
    const { wordId } = req.params;
    const { language } = req.body; // 'spanish' o 'nasa_yuwe'

    if (!req.file) {
      throw new AppError('No se proporcionó archivo de audio', 400);
    }

    if (!['spanish', 'nasa_yuwe'].includes(language)) {
      throw new AppError('Idioma inválido. Use "spanish" o "nasa_yuwe"', 400);
    }

    // Mover el archivo a la carpeta de audios
    const audioPath = `/audio/${req.file.filename}`;
    
    // Actualizar la base de datos
    const columnName = language === 'spanish' ? 'audio_url' : 'audio_nasa_yuwe';
    
    const result = await pool.query(
      `UPDATE words 
       SET ${columnName} = $1
       WHERE id = $2
       RETURNING id, spanish_word, nasa_yuwe_word, audio_url, audio_nasa_yuwe`,
      [audioPath, wordId]
    );

    if (result.rows.length === 0) {
      throw new AppError('Palabra no encontrada', 404);
    }

    res.json({
      message: 'Audio subido exitosamente',
      word: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtener usuarios pendientes de aprobación
 */
export const getPendingUsers = async (req, res, next) => {
  try {
    const result = await pool.query(`
      SELECT id, full_name, email, role, created_at, is_active, email_verified
      FROM users
      WHERE is_approved = false
      ORDER BY created_at DESC
    `);

    res.json({
      pending_users: result.rows,
      total: result.rows.length
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Aprobar usuario
 */
export const approveUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const adminId = req.user.id; // ID del administrador que aprueba

    const result = await pool.query(
      `UPDATE users 
       SET is_approved = true,
           approved_by = $1,
           approved_at = CURRENT_TIMESTAMP,
           rejection_reason = NULL
       WHERE id = $2
       RETURNING id, full_name, email, role, is_approved, approved_at`,
      [adminId, userId]
    );

    if (result.rows.length === 0) {
      throw new AppError('Usuario no encontrado', 404);
    }

    res.json({
      message: 'Usuario aprobado exitosamente',
      user: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Rechazar usuario
 */
export const rejectUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { reason } = req.body;

    // Marcar como no aprobado y guardar razón
    const result = await pool.query(
      `UPDATE users 
       SET is_approved = false,
           rejection_reason = $1,
           is_active = false
       WHERE id = $2
       RETURNING id, full_name, email, role, rejection_reason`,
      [reason || 'Usuario rechazado por el administrador', userId]
    );

    if (result.rows.length === 0) {
      throw new AppError('Usuario no encontrado', 404);
    }

    res.json({
      message: 'Usuario rechazado',
      user: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
};

