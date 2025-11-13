import pool from '../config/database.js';
import { AppError } from '../middlewares/errorHandler.js';

/**
 * Obtener reporte de un grupo
 */
export const getGroupReport = async (req, res, next) => {
  try {
    const { groupId } = req.params;
    const teacherId = req.user.id;

    // Verificar que el grupo pertenece al docente
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

    const group = groupResult.rows[0];

    // Estadísticas del grupo
    const statsResult = await pool.query(
      `SELECT 
         COUNT(DISTINCT gs.student_id) as total_students,
         COUNT(DISTINCT aa.id) as total_attempts,
         COUNT(DISTINCT CASE WHEN aa.completed = true THEN aa.id END) as completed_attempts,
         ROUND(AVG(CASE WHEN aa.completed = true THEN aa.score END), 2) as average_score,
         MAX(aa.completed_at) as last_activity
       FROM group_students gs
       LEFT JOIN activity_attempts aa ON gs.student_id = aa.student_id
       WHERE gs.group_id = $1`,
      [groupId]
    );

    // Rendimiento por estudiante
    const studentsPerformance = await pool.query(
      `SELECT 
         u.id,
         u.full_name,
         u.email,
         COUNT(DISTINCT aa.id) as total_attempts,
         COUNT(DISTINCT CASE WHEN aa.completed = true THEN aa.id END) as completed_attempts,
         ROUND(AVG(CASE WHEN aa.completed = true THEN aa.score END), 2) as average_score,
         MAX(aa.completed_at) as last_activity
       FROM group_students gs
       INNER JOIN users u ON gs.student_id = u.id
       LEFT JOIN activity_attempts aa ON u.id = aa.student_id
       WHERE gs.group_id = $1
       GROUP BY u.id, u.full_name, u.email
       ORDER BY average_score DESC NULLS LAST`,
      [groupId]
    );

    // Actividades más realizadas
    const topActivities = await pool.query(
      `SELECT 
         a.id,
         a.title,
         a.type,
         a.difficulty_level,
         COUNT(aa.id) as attempt_count,
         ROUND(AVG(aa.score), 2) as average_score
       FROM activity_attempts aa
       INNER JOIN activities a ON aa.activity_id = a.id
       INNER JOIN group_students gs ON aa.student_id = gs.student_id
       WHERE gs.group_id = $1 AND aa.completed = true
       GROUP BY a.id, a.title, a.type, a.difficulty_level
       ORDER BY attempt_count DESC
       LIMIT 10`,
      [groupId]
    );

    res.json({
      group: {
        id: group.id,
        name: group.name,
        education_level: group.education_level,
        grade: group.grade,
        difficulty_level: group.difficulty_level,
        student_count: group.student_count
      },
      statistics: statsResult.rows[0],
      students_performance: studentsPerformance.rows,
      top_activities: topActivities.rows
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtener reporte detallado de un estudiante
 */
export const getStudentReport = async (req, res, next) => {
  try {
    const { studentId } = req.params;
    const teacherId = req.user.id;

    // Verificar que el estudiante pertenece a un grupo del docente
    const accessResult = await pool.query(
      `SELECT gs.group_id
       FROM group_students gs
       INNER JOIN groups g ON gs.group_id = g.id
       WHERE gs.student_id = $1 AND g.teacher_id = $2
       LIMIT 1`,
      [studentId, teacherId]
    );

    if (accessResult.rows.length === 0) {
      throw new AppError('No tiene acceso a este estudiante', 403);
    }

    // Información del estudiante
    const studentResult = await pool.query(
      `SELECT u.id, u.full_name, u.email,
              pt.total_activities_completed,
              pt.average_score,
              pt.last_activity_date
       FROM users u
       LEFT JOIN progress_tracking pt ON u.id = pt.student_id
       WHERE u.id = $1`,
      [studentId]
    );

    if (studentResult.rows.length === 0) {
      throw new AppError('Estudiante no encontrado', 404);
    }

    // Historial de actividades
    const activitiesResult = await pool.query(
      `SELECT 
         aa.id,
         aa.score,
         aa.correct_answers,
         aa.total_questions,
         aa.time_taken,
         aa.completed_at,
         a.title,
         a.type,
         a.difficulty_level
       FROM activity_attempts aa
       INNER JOIN activities a ON aa.activity_id = a.id
       WHERE aa.student_id = $1 AND aa.completed = true
       ORDER BY aa.completed_at DESC
       LIMIT 50`,
      [studentId]
    );

    // Progreso por tipo de actividad
    const progressByType = await pool.query(
      `SELECT 
         a.type,
         a.difficulty_level,
         COUNT(aa.id) as attempt_count,
         ROUND(AVG(aa.score), 2) as average_score
       FROM activity_attempts aa
       INNER JOIN activities a ON aa.activity_id = a.id
       WHERE aa.student_id = $1 AND aa.completed = true
       GROUP BY a.type, a.difficulty_level
       ORDER BY a.type, a.difficulty_level`,
      [studentId]
    );

    res.json({
      student: studentResult.rows[0],
      activities: activitiesResult.rows,
      progress_by_type: progressByType.rows
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtener estadísticas generales del docente
 */
export const getTeacherStatistics = async (req, res, next) => {
  try {
    const teacherId = req.user.id;

    // Total de grupos
    const groupsResult = await pool.query(
      'SELECT COUNT(*) as total FROM groups WHERE teacher_id = $1 AND is_active = true',
      [teacherId]
    );

    // Total de estudiantes
    const studentsResult = await pool.query(
      `SELECT COUNT(DISTINCT gs.student_id) as total
       FROM group_students gs
       INNER JOIN groups g ON gs.group_id = g.id
       WHERE g.teacher_id = $1 AND g.is_active = true`,
      [teacherId]
    );

    // Actividades completadas por estudiantes
    const activitiesResult = await pool.query(
      `SELECT COUNT(DISTINCT aa.id) as total
       FROM activity_attempts aa
       INNER JOIN group_students gs ON aa.student_id = gs.student_id
       INNER JOIN groups g ON gs.group_id = g.id
       WHERE g.teacher_id = $1 AND aa.completed = true`,
      [teacherId]
    );

    // Promedio general de puntuación
    const averageResult = await pool.query(
      `SELECT ROUND(AVG(aa.score), 2) as average_score
       FROM activity_attempts aa
       INNER JOIN group_students gs ON aa.student_id = gs.student_id
       INNER JOIN groups g ON gs.group_id = g.id
       WHERE g.teacher_id = $1 AND aa.completed = true`,
      [teacherId]
    );

    // Grupos con mejor rendimiento
    const topGroups = await pool.query(
      `SELECT 
         g.id,
         g.name,
         COUNT(DISTINCT gs.student_id) as student_count,
         ROUND(AVG(aa.score), 2) as average_score
       FROM groups g
       LEFT JOIN group_students gs ON g.id = gs.group_id
       LEFT JOIN activity_attempts aa ON gs.student_id = aa.student_id AND aa.completed = true
       WHERE g.teacher_id = $1 AND g.is_active = true
       GROUP BY g.id, g.name
       ORDER BY average_score DESC NULLS LAST
       LIMIT 5`,
      [teacherId]
    );

    res.json({
      total_groups: parseInt(groupsResult.rows[0].total),
      total_students: parseInt(studentsResult.rows[0].total),
      total_activities_completed: parseInt(activitiesResult.rows[0].total),
      average_score: parseFloat(averageResult.rows[0].average_score) || 0,
      top_groups: topGroups.rows
    });
  } catch (error) {
    next(error);
  }
};

