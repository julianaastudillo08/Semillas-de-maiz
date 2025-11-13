import express from 'express';
import {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  toggleUserStatus,
  assignRole,
  getWords,
  createWord,
  updateWord,
  deleteWord,
  getAllActivities,
  getGeneralStatistics,
  uploadAudio,
  getPendingUsers,
  approveUser,
  rejectUser
} from '../controllers/adminController.js';
import { authenticate, authorize } from '../middlewares/authMiddleware.js';
import { uploadAudioFile } from '../middlewares/upload.js';

const router = express.Router();

// Todas las rutas requieren autenticación y rol de administrador
router.use(authenticate, authorize('administrador'));

/**
 * Gestión de usuarios
 */
router.get('/users', getAllUsers);
router.post('/users', createUser);
router.put('/users/:userId', updateUser);
router.delete('/users/:userId', deleteUser);
router.patch('/users/:userId/status', toggleUserStatus);
router.patch('/users/:userId/role', assignRole);

/**
 * Gestión de contenido - Palabras
 */
router.get('/words', getWords);
router.post('/words', createWord);
router.put('/words/:wordId', updateWord);
router.delete('/words/:wordId', deleteWord);

/**
 * Gestión de contenido - Actividades
 */
router.get('/activities', getAllActivities);

/**
 * Estadísticas generales
 */
router.get('/statistics', getGeneralStatistics);

/**
 * Subir audio para una palabra
 */
router.post('/words/:wordId/audio', uploadAudioFile, uploadAudio);

/**
 * Gestión de aprobación de usuarios
 */
router.get('/users/pending', getPendingUsers);
router.patch('/users/:userId/approve', approveUser);
router.patch('/users/:userId/reject', rejectUser);

export default router;

