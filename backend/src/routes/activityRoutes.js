import express from 'express';
import {
  getActivitiesByDifficulty,
  getActivitiesByType,
  getActivityById,
  startActivity,
  submitActivity,
  getStudentAttempts,
  getAttemptDetails
} from '../controllers/activityController.js';
import { authenticate, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

/**
 * @route   GET /api/activities/difficulty/:difficulty
 * @desc    Obtener actividades por nivel de dificultad
 * @access  Private (Estudiante)
 */
router.get('/difficulty/:difficulty', authenticate, authorize('estudiante', 'docente', 'administrador'), getActivitiesByDifficulty);

/**
 * @route   GET /api/activities/type/:type
 * @desc    Obtener actividades por tipo
 * @access  Private (Estudiante)
 */
router.get('/type/:type', authenticate, authorize('estudiante', 'docente', 'administrador'), getActivitiesByType);

/**
 * @route   GET /api/activities/:activityId
 * @desc    Obtener detalle de una actividad
 * @access  Private (Estudiante)
 */
router.get('/:activityId', authenticate, authorize('estudiante', 'docente', 'administrador'), getActivityById);

/**
 * @route   POST /api/activities/:activityId/start
 * @desc    Iniciar una actividad
 * @access  Private (Estudiante)
 */
router.post('/:activityId/start', authenticate, authorize('estudiante'), startActivity);

/**
 * @route   POST /api/activities/attempts/:attemptId/submit
 * @desc    Enviar respuestas de una actividad
 * @access  Private (Estudiante)
 */
router.post('/attempts/:attemptId/submit', authenticate, authorize('estudiante'), submitActivity);

/**
 * @route   GET /api/activities/attempts/my-attempts
 * @desc    Obtener historial de intentos del estudiante
 * @access  Private (Estudiante)
 */
router.get('/attempts/my-attempts', authenticate, authorize('estudiante'), getStudentAttempts);

/**
 * @route   GET /api/activities/attempts/:attemptId
 * @desc    Obtener detalles de un intento
 * @access  Private (Estudiante)
 */
router.get('/attempts/:attemptId', authenticate, authorize('estudiante'), getAttemptDetails);

export default router;

