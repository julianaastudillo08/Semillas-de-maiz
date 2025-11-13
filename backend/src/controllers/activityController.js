import pool from '../config/database.js';
import { AppError } from '../middlewares/errorHandler.js';

/**
 * Obtener actividades por nivel de dificultad
 */
export const getActivitiesByDifficulty = async (req, res, next) => {
  try {
    const { difficulty } = req.params;

    if (!['facil', 'intermedio', 'avanzado'].includes(difficulty)) {
      throw new AppError('Nivel de dificultad inválido', 400);
    }

    const result = await pool.query(
      `SELECT a.*, COUNT(q.id) as question_count
       FROM activities a
       LEFT JOIN questions q ON a.id = q.activity_id
       WHERE a.difficulty_level = $1 AND a.is_active = true
       GROUP BY a.id
       ORDER BY a.created_at DESC`,
      [difficulty]
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
 * Obtener actividades por tipo
 */
export const getActivitiesByType = async (req, res, next) => {
  try {
    const { type } = req.params;

    if (!['quiz', 'completar_oracion', 'asociar_imagen'].includes(type)) {
      throw new AppError('Tipo de actividad inválido', 400);
    }

    const result = await pool.query(
      `SELECT a.*, COUNT(q.id) as question_count
       FROM activities a
       LEFT JOIN questions q ON a.id = q.activity_id
       WHERE a.type = $1 AND a.is_active = true
       GROUP BY a.id
       ORDER BY a.created_at DESC`,
      [type]
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
 * Obtener detalle de una actividad con sus preguntas
 */
export const getActivityById = async (req, res, next) => {
  try {
    const { activityId } = req.params;

    // Obtener actividad
    const activityResult = await pool.query(
      'SELECT * FROM activities WHERE id = $1 AND is_active = true',
      [activityId]
    );

    if (activityResult.rows.length === 0) {
      throw new AppError('Actividad no encontrada', 404);
    }

    const activity = activityResult.rows[0];

    // Obtener preguntas con opciones
    const questionsResult = await pool.query(
      `SELECT q.*, 
              json_agg(
                json_build_object(
                  'id', qo.id,
                  'option_text', qo.option_text,
                  'option_label', qo.option_label,
                  'is_correct', qo.is_correct
                ) ORDER BY qo.option_label
              ) as options
       FROM questions q
       LEFT JOIN question_options qo ON q.id = qo.question_id
       WHERE q.activity_id = $1
       GROUP BY q.id
       ORDER BY q.order_number`,
      [activityId]
    );

    res.json({
      activity: {
        ...activity,
        questions: questionsResult.rows
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Iniciar un intento de actividad
 */
export const startActivity = async (req, res, next) => {
  try {
    const { activityId } = req.params;
    const studentId = req.user.id;

    // Verificar que la actividad existe
    const activityResult = await pool.query(
      'SELECT * FROM activities WHERE id = $1 AND is_active = true',
      [activityId]
    );

    if (activityResult.rows.length === 0) {
      throw new AppError('Actividad no encontrada', 404);
    }

    const activity = activityResult.rows[0];

    // Contar preguntas
    const questionsCount = await pool.query(
      'SELECT COUNT(*) FROM questions WHERE activity_id = $1',
      [activityId]
    );

    const totalQuestions = parseInt(questionsCount.rows[0].count);

    // Crear intento
    const attemptResult = await pool.query(
      `INSERT INTO activity_attempts (activity_id, student_id, total_questions, score, correct_answers)
       VALUES ($1, $2, $3, 0, 0)
       RETURNING *`,
      [activityId, studentId, totalQuestions]
    );

    res.json({
      message: 'Actividad iniciada',
      attempt: attemptResult.rows[0],
      activity: {
        id: activity.id,
        title: activity.title,
        time_limit: activity.time_limit,
        total_questions: totalQuestions
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Enviar respuestas de una actividad
 */
export const submitActivity = async (req, res, next) => {
  let client;
  
  try {
    client = await pool.connect();
    await client.query('BEGIN');

    const { attemptId } = req.params;
    const { answers, time_taken } = req.body;
    const studentId = req.user.id;

    console.log('📝 Submitting activity:', { attemptId, studentId, answersCount: answers?.length });

    // Validar datos de entrada
    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      throw new AppError('No se proporcionaron respuestas', 400);
    }

    // Verificar que el intento pertenece al estudiante
    const attemptResult = await client.query(
      'SELECT * FROM activity_attempts WHERE id = $1 AND student_id = $2',
      [attemptId, studentId]
    );

    if (attemptResult.rows.length === 0) {
      throw new AppError('Intento no encontrado', 404);
    }

    const attempt = attemptResult.rows[0];

    if (attempt.completed) {
      throw new AppError('Este intento ya fue completado', 400);
    }

    let correctAnswers = 0;
    let totalPoints = 0;

    // Procesar cada respuesta
    for (const answer of answers) {
      const { question_id, selected_option_id, student_answer } = answer;

      if (!question_id) {
        console.warn('⚠️ Respuesta sin question_id, saltando...');
        continue;
      }

      // Obtener la pregunta y respuesta correcta
      const questionResult = await client.query(
        'SELECT * FROM questions WHERE id = $1',
        [question_id]
      );

      if (questionResult.rows.length === 0) {
        console.warn(`⚠️ Pregunta ${question_id} no encontrada`);
        continue;
      }

      const question = questionResult.rows[0];
      let isCorrect = false;
      let pointsEarned = 0;

      // Verificar respuesta según el tipo
      if (selected_option_id) {
        const optionResult = await client.query(
          'SELECT is_correct FROM question_options WHERE id = $1',
          [selected_option_id]
        );

        if (optionResult.rows.length > 0) {
          isCorrect = Boolean(optionResult.rows[0].is_correct);
        }
      } else if (student_answer) {
        // Para respuestas de texto, comparar con respuesta correcta
        isCorrect = student_answer.trim().toLowerCase() === question.correct_answer.trim().toLowerCase();
      }

      if (isCorrect) {
        correctAnswers++;
        pointsEarned = question.points || 1;
        totalPoints += pointsEarned;
      }

      // Guardar respuesta del estudiante - asegurar tipos correctos
      const insertParams = [
        attemptId, 
        question_id, 
        selected_option_id || null, 
        student_answer || null, 
        Boolean(isCorrect), 
        Number(pointsEarned) || 0
      ];
      
      console.log('💾 Guardando respuesta:', {
        attemptId: String(attemptId).substring(0, 8) + '...',
        questionId: String(question_id).substring(0, 8) + '...',
        selectedOptionId: selected_option_id ? String(selected_option_id).substring(0, 8) + '...' : 'null',
        studentAnswer: student_answer || 'null',
        isCorrect: Boolean(isCorrect),
        pointsEarned: Number(pointsEarned) || 0
      });
      
      await client.query(
        `INSERT INTO student_answers (attempt_id, question_id, selected_option_id, student_answer, is_correct, points_earned)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        insertParams
      );
    }

    // Calcular puntuación porcentual
    const score = attempt.total_questions > 0 
      ? Math.round((correctAnswers / attempt.total_questions) * 100)
      : 0;

    console.log('📊 Resultados:', { correctAnswers, totalQuestions: attempt.total_questions, score });

    // Actualizar intento
    await client.query(
      `UPDATE activity_attempts 
       SET completed = true, 
           completed_at = CURRENT_TIMESTAMP,
           score = $1,
           correct_answers = $2,
           time_taken = $3
       WHERE id = $4`,
      [score, correctAnswers, time_taken || 0, attemptId]
    );

    // Actualizar progreso del estudiante
    await client.query(
      `INSERT INTO progress_tracking (student_id, total_activities_completed, total_score, average_score, last_activity_date)
       VALUES ($1, 1, $2::INTEGER, $2::DECIMAL, CURRENT_TIMESTAMP)
       ON CONFLICT (student_id)
       DO UPDATE SET
         total_activities_completed = progress_tracking.total_activities_completed + 1,
         total_score = progress_tracking.total_score + $2::INTEGER,
         average_score = (progress_tracking.total_score + $2::INTEGER)::DECIMAL / (progress_tracking.total_activities_completed + 1),
         last_activity_date = CURRENT_TIMESTAMP`,
      [studentId, score]
    );

    await client.query('COMMIT');
    
    console.log('✅ Transacción completada exitosamente');

    // Obtener respuestas correctas para mostrar (después de cerrar la transacción)
    const correctAnswersResult = await pool.query(
      `SELECT sa.*, q.question_text, q.correct_answer, qo.option_text as selected_option_text
       FROM student_answers sa
       INNER JOIN questions q ON sa.question_id = q.id
       LEFT JOIN question_options qo ON sa.selected_option_id = qo.id
       WHERE sa.attempt_id = $1
       ORDER BY q.order_number`,
      [attemptId]
    );

    res.json({
      message: 'Actividad completada',
      score,
      correct_answers: correctAnswers,
      total_questions: attempt.total_questions,
      time_taken,
      answers: correctAnswersResult.rows
    });

  } catch (error) {
    console.error('❌ Error en submitActivity:', error.message);
    console.error('Stack:', error.stack);
    
    if (client) {
      try {
        await client.query('ROLLBACK');
        console.log('⏮️ Rollback ejecutado');
      } catch (rollbackError) {
        console.error('❌ Error en rollback:', rollbackError.message);
      }
    }
    
    next(error);
  } finally {
    if (client) {
      try {
        client.release();
        console.log('🔓 Cliente liberado');
      } catch (releaseError) {
        console.error('❌ Error liberando cliente:', releaseError.message);
      }
    }
  }
};

/**
 * Obtener historial de intentos del estudiante
 */
export const getStudentAttempts = async (req, res, next) => {
  try {
    const studentId = req.user.id;
    const { activityId } = req.query;

    let query = `
      SELECT aa.*, a.title, a.type, a.difficulty_level
      FROM activity_attempts aa
      INNER JOIN activities a ON aa.activity_id = a.id
      WHERE aa.student_id = $1
    `;
    const params = [studentId];

    if (activityId) {
      query += ' AND aa.activity_id = $2';
      params.push(activityId);
    }

    query += ' ORDER BY aa.created_at DESC LIMIT 50';

    const result = await pool.query(query, params);

    res.json({
      attempts: result.rows,
      total: result.rows.length
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtener detalles de un intento específico
 */
export const getAttemptDetails = async (req, res, next) => {
  try {
    const { attemptId } = req.params;
    const studentId = req.user.id;

    // Obtener intento
    const attemptResult = await pool.query(
      `SELECT aa.*, a.title, a.type, a.difficulty_level
       FROM activity_attempts aa
       INNER JOIN activities a ON aa.activity_id = a.id
       WHERE aa.id = $1 AND aa.student_id = $2`,
      [attemptId, studentId]
    );

    if (attemptResult.rows.length === 0) {
      throw new AppError('Intento no encontrado', 404);
    }

    // Obtener respuestas
    const answersResult = await pool.query(
      `SELECT sa.*, q.question_text, q.correct_answer, q.image_url, q.audio_url,
              qo.option_text as selected_option_text, qo.option_label
       FROM student_answers sa
       INNER JOIN questions q ON sa.question_id = q.id
       LEFT JOIN question_options qo ON sa.selected_option_id = qo.id
       WHERE sa.attempt_id = $1
       ORDER BY q.order_number`,
      [attemptId]
    );

    res.json({
      attempt: attemptResult.rows[0],
      answers: answersResult.rows
    });
  } catch (error) {
    next(error);
  }
};

