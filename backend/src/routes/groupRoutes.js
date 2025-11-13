import express from 'express';
import {
  createGroup,
  getTeacherGroups,
  getGroupById,
  searchStudents,
  assignStudentsToGroup,
  removeStudentFromGroup,
  updateGroup,
  deleteGroup
} from '../controllers/groupController.js';
import { authenticate, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

/**
 * @route   POST /api/groups
 * @desc    Crear grupo
 * @access  Private (Docente)
 */
router.post('/', authenticate, authorize('docente'), createGroup);

/**
 * @route   GET /api/groups
 * @desc    Obtener grupos del docente
 * @access  Private (Docente)
 */
router.get('/', authenticate, authorize('docente'), getTeacherGroups);

/**
 * @route   GET /api/groups/:groupId
 * @desc    Obtener detalle de un grupo
 * @access  Private (Docente)
 */
router.get('/:groupId', authenticate, authorize('docente'), getGroupById);

/**
 * @route   GET /api/groups/students/search
 * @desc    Buscar estudiantes
 * @access  Private (Docente)
 */
router.get('/students/search', authenticate, authorize('docente'), searchStudents);

/**
 * @route   POST /api/groups/:groupId/students
 * @desc    Asignar estudiantes a un grupo
 * @access  Private (Docente)
 */
router.post('/:groupId/students', authenticate, authorize('docente'), assignStudentsToGroup);

/**
 * @route   DELETE /api/groups/:groupId/students/:studentId
 * @desc    Eliminar estudiante de un grupo
 * @access  Private (Docente)
 */
router.delete('/:groupId/students/:studentId', authenticate, authorize('docente'), removeStudentFromGroup);

/**
 * @route   PUT /api/groups/:groupId
 * @desc    Actualizar grupo
 * @access  Private (Docente)
 */
router.put('/:groupId', authenticate, authorize('docente'), updateGroup);

/**
 * @route   DELETE /api/groups/:groupId
 * @desc    Eliminar grupo
 * @access  Private (Docente)
 */
router.delete('/:groupId', authenticate, authorize('docente'), deleteGroup);

export default router;

