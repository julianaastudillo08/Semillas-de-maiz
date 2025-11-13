import pool from '../config/database.js';
import { AppError } from '../middlewares/errorHandler.js';

/**
 * Buscar palabras por texto (español o Nasa Yuwe)
 */
export const searchWords = async (req, res, next) => {
  try {
    const { query } = req.query;

    if (!query || query.trim().length === 0) {
      throw new AppError('Debe proporcionar un término de búsqueda', 400);
    }

    const searchQuery = `%${query}%`;
    
    const result = await pool.query(
      `SELECT w.*, c.name as category_name, c.icon_url as category_icon
       FROM words w
       LEFT JOIN categories c ON w.category_id = c.id
       WHERE (LOWER(w.spanish_word) LIKE LOWER($1) 
       OR LOWER(w.nasa_yuwe_word) LIKE LOWER($1))
       AND w.image_url IS NOT NULL
       ORDER BY w.spanish_word
       LIMIT 20`,
      [searchQuery]
    );

    if (result.rows.length === 0) {
      // Buscar palabras similares para sugerir
      const suggestions = await pool.query(
        `SELECT DISTINCT spanish_word, nasa_yuwe_word
         FROM words
         WHERE (LOWER(spanish_word) SIMILAR TO LOWER($1)
         OR LOWER(nasa_yuwe_word) SIMILAR TO LOWER($1))
         AND image_url IS NOT NULL
         LIMIT 5`,
        [`%${query.substring(0, 3)}%`]
      );

      return res.json({
        message: 'La palabra no se encuentra',
        words: [],
        suggestions: suggestions.rows
      });
    }

    res.json({
      words: result.rows,
      total: result.rows.length
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtener todas las categorías
 */
export const getCategories = async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT c.*, COUNT(w.id) as word_count
       FROM categories c
       LEFT JOIN words w ON c.id = w.category_id AND w.image_url IS NOT NULL
       GROUP BY c.id
       HAVING COUNT(w.id) > 0
       ORDER BY c.name`
    );

    res.json({
      categories: result.rows
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtener palabras por categoría
 */
export const getWordsByCategory = async (req, res, next) => {
  try {
    const { categoryId } = req.params;

    // Obtener nombre de la categoría
    const catResult = await pool.query('SELECT name FROM categories WHERE id = $1', [categoryId]);
    const categoryName = catResult.rows[0]?.name;

    // Para Números: mostrar TODOS (con o sin imagen), ordenados numéricamente
    // Para otras categorías: solo con imagen
    const imageFilter = categoryName === 'Números' ? '' : 'AND w.image_url IS NOT NULL';

    const result = await pool.query(
      `SELECT w.*, c.name as category_name, c.icon_url as category_icon
       FROM words w
       INNER JOIN categories c ON w.category_id = c.id
       WHERE c.id = $1 ${imageFilter}
       ORDER BY 
         CASE 
           WHEN c.name = 'Números' THEN 
             -- Extraer el número y ordenar numéricamente
             CAST(
               CASE 
                 WHEN w.spanish_word ~ '^[0-9]+$' THEN w.spanish_word
                 WHEN w.spanish_word LIKE 'Cero%' THEN '0'
                 WHEN w.spanish_word LIKE 'Uno%' OR w.spanish_word = 'Uno' THEN '1'
                 WHEN w.spanish_word LIKE 'Dos%' OR w.spanish_word = 'Dos' THEN '2'
                 WHEN w.spanish_word LIKE 'Tres%' OR w.spanish_word = 'Tres' THEN '3'
                 WHEN w.spanish_word LIKE 'Cuatro%' OR w.spanish_word = 'Cuatro' THEN '4'
                 WHEN w.spanish_word LIKE 'Cinco%' OR w.spanish_word = 'Cinco' THEN '5'
                 WHEN w.spanish_word LIKE 'Seis%' OR w.spanish_word = 'Seis' THEN '6'
                 WHEN w.spanish_word LIKE 'Siete%' OR w.spanish_word = 'Siete' THEN '7'
                 WHEN w.spanish_word LIKE 'Ocho%' OR w.spanish_word = 'Ocho' THEN '8'
                 WHEN w.spanish_word LIKE 'Nueve%' OR w.spanish_word = 'Nueve' THEN '9'
                 WHEN w.spanish_word LIKE 'Diez%' OR w.spanish_word = 'Diez' THEN '10'
                 WHEN w.spanish_word LIKE 'Once%' OR w.spanish_word = 'Once' THEN '11'
                 WHEN w.spanish_word LIKE 'Doce%' OR w.spanish_word = 'Doce' THEN '12'
                 WHEN w.spanish_word LIKE 'Trece%' THEN '13'
                 WHEN w.spanish_word LIKE 'Catorce%' THEN '14'
                 WHEN w.spanish_word LIKE 'Quince%' THEN '15'
                 WHEN w.spanish_word LIKE 'Dieciséis%' THEN '16'
                 WHEN w.spanish_word LIKE 'Diecisiete%' THEN '17'
                 WHEN w.spanish_word LIKE 'Dieciocho%' THEN '18'
                 WHEN w.spanish_word LIKE 'Diecinueve%' THEN '19'
                 WHEN w.spanish_word LIKE 'Veinte%' OR w.spanish_word = 'Veinte' THEN '20'
                 WHEN w.spanish_word LIKE 'Treinta%' OR w.spanish_word = 'Treinta' THEN '30'
                 WHEN w.spanish_word LIKE 'Cuarenta%' OR w.spanish_word = 'Cuarenta' THEN '40'
                 WHEN w.spanish_word LIKE 'Cincuenta%' OR w.spanish_word = 'Cincuenta' THEN '50'
                 WHEN w.spanish_word LIKE 'Sesenta%' OR w.spanish_word = 'Sesenta' THEN '60'
                 WHEN w.spanish_word LIKE 'Setenta%' OR w.spanish_word = 'Setenta' THEN '70'
                 WHEN w.spanish_word LIKE 'Ochenta%' OR w.spanish_word = 'Ochenta' THEN '80'
                 WHEN w.spanish_word LIKE 'Noventa%' OR w.spanish_word = 'Noventa' THEN '90'
                 WHEN w.spanish_word LIKE 'Cien%' OR w.spanish_word = 'Cien' THEN '100'
                 ELSE '999'
               END AS INTEGER
             )
           ELSE 0
         END,
         w.spanish_word`,
      [categoryId]
    );

    if (result.rows.length === 0) {
      return res.json({
        message: 'No hay palabras en esta categoría',
        words: []
      });
    }

    res.json({
      words: result.rows,
      total: result.rows.length
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtener detalles de una palabra específica
 */
export const getWordById = async (req, res, next) => {
  try {
    const { wordId } = req.params;

    const result = await pool.query(
      `SELECT w.*, c.name as category_name, c.icon_url as category_icon,
              u.full_name as created_by_name
       FROM words w
       LEFT JOIN categories c ON w.category_id = c.id
       LEFT JOIN users u ON w.created_by = u.id
       WHERE w.id = $1`,
      [wordId]
    );

    if (result.rows.length === 0) {
      throw new AppError('Palabra no encontrada', 404);
    }

    res.json({
      word: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtener palabras por nivel de dificultad
 */
export const getWordsByDifficulty = async (req, res, next) => {
  try {
    const { difficulty } = req.params;

    if (!['facil', 'intermedio', 'avanzado'].includes(difficulty)) {
      throw new AppError('Nivel de dificultad inválido', 400);
    }

    const result = await pool.query(
      `SELECT w.*, c.name as category_name, c.icon_url as category_icon
       FROM words w
       LEFT JOIN categories c ON w.category_id = c.id
       WHERE w.difficulty_level = $1 AND w.image_url IS NOT NULL
       ORDER BY w.spanish_word`,
      [difficulty]
    );

    res.json({
      words: result.rows,
      total: result.rows.length,
      difficulty
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtener palabra aleatoria
 */
export const getRandomWord = async (req, res, next) => {
  try {
    const { difficulty, category } = req.query;
    
    let query = 'SELECT w.*, c.name as category_name FROM words w LEFT JOIN categories c ON w.category_id = c.id WHERE w.image_url IS NOT NULL';
    const params = [];
    let paramCount = 1;

    if (difficulty) {
      query += ` AND w.difficulty_level = $${paramCount}`;
      params.push(difficulty);
      paramCount++;
    }

    if (category) {
      query += ` AND w.category_id = $${paramCount}`;
      params.push(category);
      paramCount++;
    }

    query += ' ORDER BY RANDOM() LIMIT 1';

    const result = await pool.query(query, params);

    if (result.rows.length === 0) {
      throw new AppError('No se encontraron palabras con imágenes con los criterios especificados', 404);
    }

    res.json({
      word: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
};

