import pool from '../config/database.js';
import { AppError } from '../middlewares/errorHandler.js';

/**
 * Crear grupo (Docente)
 */
export const createGroup = async (req, res, next) => {
  try {
    const { name, education_level, grade, difficulty_level } = req.body;
    const teacherId = req.user.id;

    if (!name || !education_level || !difficulty_level) {
      throw new AppError('Por favor diligenciar todos los campos requeridos', 400);
    }

    const result = await pool.query(
      `INSERT INTO groups (name, education_level, grade, difficulty_level, teacher_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [name, education_level, grade, difficulty_level, teacherId]
    );

    res.status(201).json({
      message: 'Grupo creado exitosamente',
      group: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtener grupos del docente
 */
export const getTeacherGroups = async (req, res, next) => {
  try {
    const teacherId = req.user.id;

    const result = await pool.query(
      `SELECT g.*, COUNT(DISTINCT gs.student_id) as student_count
       FROM groups g
       LEFT JOIN group_students gs ON g.id = gs.group_id
       WHERE g.teacher_id = $1 AND g.is_active = true
       GROUP BY g.id
       ORDER BY g.created_at DESC`,
      [teacherId]
    );

    if (result.rows.length === 0) {
      return res.json({
        message: 'No existen grupos registrados',
        groups: []
      });
    }

    res.json({
      groups: result.rows,
      total: result.rows.length
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtener detalle de un grupo
 */
export const getGroupById = async (req, res, next) => {
  try {
    const { groupId } = req.params;
    const teacherId = req.user.id;

    // Obtener grupo
    const groupResult = await pool.query(
      `SELECT g.*, COUNT(DISTINCT gs.student_id) as student_count
       FROM groups g
       LEFT JOIN group_students gs ON g.id = gs.group_id
       WHERE g.id = $1 AND g.teacher_id = $2
       GROUP BY g.id`,
      [groupId, teacherId]
    );

    if (groupResult.rows.length === 0) {
      throw new AppError('Grupo no encontrado', 404);
    }

    // Obtener estudiantes del grupo
    const studentsResult = await pool.query(
      `SELECT u.id, u.full_name, u.email, gs.joined_at,
              pt.average_score, pt.total_activities_completed
       FROM group_students gs
       INNER JOIN users u ON gs.student_id = u.id
       LEFT JOIN progress_tracking pt ON u.id = pt.student_id
       WHERE gs.group_id = $1
       ORDER BY u.full_name`,
      [groupId]
    );

    res.json({
      group: groupResult.rows[0],
      students: studentsResult.rows
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Buscar estudiantes para asignar
 */
export const searchStudents = async (req, res, next) => {
  try {
    const { query } = req.query;

    if (!query || query.trim().length === 0) {
      throw new AppError('Debe proporcionar un término de búsqueda', 400);
    }

    const searchQuery = `%${query}%`;

    const result = await pool.query(
      `SELECT id, full_name, email, created_at
       FROM users
       WHERE role = 'estudiante' 
       AND is_active = true
       AND (LOWER(full_name) LIKE LOWER($1) OR LOWER(email) LIKE LOWER($1))
       ORDER BY full_name
       LIMIT 20`,
      [searchQuery]
    );

    res.json({
      students: result.rows,
      total: result.rows.length
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Asignar estudiantes a un grupo
 */
export const assignStudentsToGroup = async (req, res, next) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    const { groupId } = req.params;
    const { student_ids } = req.body;
    const teacherId = req.user.id;

    if (!student_ids || student_ids.length === 0) {
      throw new AppError('Debe seleccionar al menos un estudiante', 400);
    }

    // Verificar que el grupo pertenece al docente
    const groupResult = await client.query(
      'SELECT id FROM groups WHERE id = $1 AND teacher_id = $2',
      [groupId, teacherId]
    );

    if (groupResult.rows.length === 0) {
      throw new AppError('Grupo no encontrado', 404);
    }

    const assignedStudents = [];
    const alreadyAssigned = [];

    for (const studentId of student_ids) {
      // Verificar si el estudiante ya está en el grupo
      const existingResult = await client.query(
        'SELECT id FROM group_students WHERE group_id = $1 AND student_id = $2',
        [groupId, studentId]
      );

      if (existingResult.rows.length > 0) {
        // Obtener nombre del estudiante
        const studentResult = await client.query(
          'SELECT full_name FROM users WHERE id = $1',
          [studentId]
        );
        alreadyAssigned.push(studentResult.rows[0].full_name);
        continue;
      }

      // Asignar estudiante al grupo
      await client.query(
        'INSERT INTO group_students (group_id, student_id) VALUES ($1, $2)',
        [groupId, studentId]
      );

      assignedStudents.push(studentId);
    }

    await client.query('COMMIT');

    let message = '¡Asignación correcta!';
    if (alreadyAssigned.length > 0) {
      message += ` ${alreadyAssigned.length} estudiante(s) ya estaban asignados al grupo.`;
    }

    res.json({
      message,
      assigned_count: assignedStudents.length,
      already_assigned: alreadyAssigned
    });

  } catch (error) {
    await client.query('ROLLBACK');
    next(error);
  } finally {
    client.release();
  }
};

/**
 * Eliminar estudiante de un grupo
 */
export const removeStudentFromGroup = async (req, res, next) => {
  try {
    const { groupId, studentId } = req.params;
    const teacherId = req.user.id;

    // Verificar que el grupo pertenece al docente
    const groupResult = await pool.query(
      'SELECT id FROM groups WHERE id = $1 AND teacher_id = $2',
      [groupId, teacherId]
    );

    if (groupResult.rows.length === 0) {
      throw new AppError('Grupo no encontrado', 404);
    }

    // Eliminar estudiante del grupo
    const result = await pool.query(
      'DELETE FROM group_students WHERE group_id = $1 AND student_id = $2 RETURNING *',
      [groupId, studentId]
    );

    if (result.rows.length === 0) {
      throw new AppError('El estudiante no pertenece a este grupo', 404);
    }

    res.json({
      message: 'Estudiante eliminado del grupo exitosamente'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Actualizar grupo
 */
export const updateGroup = async (req, res, next) => {
  try {
    const { groupId } = req.params;
    const { name, education_level, grade, difficulty_level } = req.body;
    const teacherId = req.user.id;

    // Verificar que el grupo pertenece al docente
    const groupResult = await pool.query(
      'SELECT id FROM groups WHERE id = $1 AND teacher_id = $2',
      [groupId, teacherId]
    );

    if (groupResult.rows.length === 0) {
      throw new AppError('Grupo no encontrado', 404);
    }

    const result = await pool.query(
      `UPDATE groups 
       SET name = COALESCE($1, name),
           education_level = COALESCE($2, education_level),
           grade = COALESCE($3, grade),
           difficulty_level = COALESCE($4, difficulty_level),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $5
       RETURNING *`,
      [name, education_level, grade, difficulty_level, groupId]
    );

    res.json({
      message: 'Grupo actualizado exitosamente',
      group: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Desactivar/Eliminar grupo
 */
export const deleteGroup = async (req, res, next) => {
  try {
    const { groupId } = req.params;
    const teacherId = req.user.id;

    // Verificar que el grupo pertenece al docente
    const groupResult = await pool.query(
      'SELECT id FROM groups WHERE id = $1 AND teacher_id = $2',
      [groupId, teacherId]
    );

    if (groupResult.rows.length === 0) {
      throw new AppError('Grupo no encontrado', 404);
    }

    // Desactivar grupo (soft delete)
    await pool.query(
      'UPDATE groups SET is_active = false WHERE id = $1',
      [groupId]
    );

    res.json({
      message: 'Grupo eliminado exitosamente'
    });
  } catch (error) {
    next(error);
  }
};

