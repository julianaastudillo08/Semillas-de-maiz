import express from 'express';
import {
  getGroupReport,
  getStudentReport,
  getTeacherStatistics
} from '../controllers/reportController.js';
import { authenticate, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

/**
 * @route   GET /api/reports/groups/:groupId
 * @desc    Obtener reporte de un grupo
 * @access  Private (Docente)
 */
router.get('/groups/:groupId', authenticate, authorize('docente', 'administrador'), getGroupReport);

/**
 * @route   GET /api/reports/students/:studentId
 * @desc    Obtener reporte de un estudiante
 * @access  Private (Docente)
 */
router.get('/students/:studentId', authenticate, authorize('docente', 'administrador'), getStudentReport);

/**
 * @route   GET /api/reports/teacher/statistics
 * @desc    Obtener estadísticas del docente
 * @access  Private (Docente)
 */
router.get('/teacher/statistics', authenticate, authorize('docente'), getTeacherStatistics);

export default router;

