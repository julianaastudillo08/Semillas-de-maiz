import express from 'express';
import {
  searchWords,
  getCategories,
  getWordsByCategory,
  getWordById,
  getWordsByDifficulty,
  getRandomWord
} from '../controllers/dictionaryController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();

/**
 * @route   GET /api/dictionary/search
 * @desc    Buscar palabras
 * @access  Private
 */
router.get('/search', authenticate, searchWords);

/**
 * @route   GET /api/dictionary/categories
 * @desc    Obtener todas las categorías
 * @access  Private
 */
router.get('/categories', authenticate, getCategories);

/**
 * @route   GET /api/dictionary/categories/:categoryId/words
 * @desc    Obtener palabras por categoría
 * @access  Private
 */
router.get('/categories/:categoryId/words', authenticate, getWordsByCategory);

/**
 * @route   GET /api/dictionary/words/:wordId
 * @desc    Obtener detalle de una palabra
 * @access  Private
 */
router.get('/words/:wordId', authenticate, getWordById);

/**
 * @route   GET /api/dictionary/difficulty/:difficulty
 * @desc    Obtener palabras por nivel de dificultad
 * @access  Private
 */
router.get('/difficulty/:difficulty', authenticate, getWordsByDifficulty);

/**
 * @route   GET /api/dictionary/random
 * @desc    Obtener palabra aleatoria
 * @access  Private
 */
router.get('/random', authenticate, getRandomWord);

export default router;

