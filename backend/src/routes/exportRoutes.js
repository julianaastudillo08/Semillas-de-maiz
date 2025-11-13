import express from 'express';
import {
  exportGroupToExcel,
  exportGroupToPDF,
  exportStatisticsToExcel,
  exportStudentProgressToPDF
} from '../controllers/exportController.js';
import { authenticate, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

/**
 * @route   GET /api/export/group/:groupId/excel
 * @desc    Exportar reporte de grupo a Excel
 * @access  Private (Docente)
 */
router.get('/group/:groupId/excel', authenticate, authorize('docente'), exportGroupToExcel);

/**
 * @route   GET /api/export/group/:groupId/pdf
 * @desc    Exportar reporte de grupo a PDF
 * @access  Private (Docente)
 */
router.get('/group/:groupId/pdf', authenticate, authorize('docente'), exportGroupToPDF);

/**
 * @route   GET /api/export/statistics/excel
 * @desc    Exportar estadísticas generales a Excel
 * @access  Private (Administrador)
 */
router.get('/statistics/excel', authenticate, authorize('administrador'), exportStatisticsToExcel);

/**
 * @route   GET /api/export/student/progress/pdf
 * @desc    Exportar progreso del estudiante a PDF
 * @access  Private (Estudiante, Docente, Administrador)
 */
router.get('/student/progress/pdf', authenticate, authorize('estudiante', 'docente', 'administrador'), exportStudentProgressToPDF);

/**
 * @route   GET /api/export/student/:studentId/progress/pdf
 * @desc    Exportar progreso de un estudiante específico a PDF
 * @access  Private (Docente, Administrador)
 */
router.get('/student/:studentId/progress/pdf', authenticate, authorize('docente', 'administrador'), exportStudentProgressToPDF);

export default router;

