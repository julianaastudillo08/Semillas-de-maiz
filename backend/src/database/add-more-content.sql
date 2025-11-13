-- ================================================
-- Agregar más actividades y contenido al sistema
-- ================================================

-- Insertar más palabras en diferentes categorías

-- Más Animales
INSERT INTO words (spanish_word, nasa_yuwe_word, pronunciation, example_spanish, example_nasa_yuwe, category_id, difficulty_level)
SELECT 'Caballo', 'Kawayo', 'kawayo', 'El caballo corre rápido', 'Kawayo sẽç weyu', c.id, 'facil'
FROM categories c WHERE c.name = 'Animales';

INSERT INTO words (spanish_word, nasa_yuwe_word, pronunciation, example_spanish, example_nasa_yuwe, category_id, difficulty_level)
SELECT 'Vaca', 'Waka', 'waka', 'La vaca da leche', 'Waka leche yu', c.id, 'facil'
FROM categories c WHERE c.name = 'Animales';

INSERT INTO words (spanish_word, nasa_yuwe_word, pronunciation, example_spanish, example_nasa_yuwe, category_id, difficulty_level)
SELECT 'Mariposa', 'Kẽẽsh', 'keesh', 'La mariposa es bonita', 'Kẽẽsh kwet', c.id, 'intermedio'
FROM categories c WHERE c.name = 'Animales';

-- Más Familia
INSERT INTO words (spanish_word, nasa_yuwe_word, pronunciation, example_spanish, example_nasa_yuwe, category_id, difficulty_level)
SELECT 'Hermana', 'Ala', 'ala', 'Mi hermana es alegre', 'Nxi ala fxi alegre', c.id, 'facil'
FROM categories c WHERE c.name = 'Familia';

INSERT INTO words (spanish_word, nasa_yuwe_word, pronunciation, example_spanish, example_nasa_yuwe, category_id, difficulty_level)
SELECT 'Abuelo', 'Tata sek', 'tata sek', 'Mi abuelo es sabio', 'Nxi tata sek sabio', c.id, 'facil'
FROM categories c WHERE c.name = 'Familia';

INSERT INTO words (spanish_word, nasa_yuwe_word, pronunciation, example_spanish, example_nasa_yuwe, category_id, difficulty_level)
SELECT 'Abuela', 'Mama sek', 'mama sek', 'Mi abuela cocina rico', 'Nxi mama sek kwet cocina', c.id, 'facil'
FROM categories c WHERE c.name = 'Familia';

-- Más Números
INSERT INTO words (spanish_word, nasa_yuwe_word, pronunciation, example_spanish, example_nasa_yuwe, category_id, difficulty_level)
SELECT 'Cuatro', 'Pʉʉç', 'puuch', 'Tengo cuatro libros', 'Pʉʉç libro yuçwe', c.id, 'facil'
FROM categories c WHERE c.name = 'Números';

INSERT INTO words (spanish_word, nasa_yuwe_word, pronunciation, example_spanish, example_nasa_yuwe, category_id, difficulty_level)
SELECT 'Cinco', 'Hĩĩç', 'hiich', 'Cinco dedos en mi mano', 'Hĩĩç dedo nxi mano', c.id, 'facil'
FROM categories c WHERE c.name = 'Números';

-- Más Colores
INSERT INTO words (spanish_word, nasa_yuwe_word, pronunciation, example_spanish, example_nasa_yuwe, category_id, difficulty_level)
SELECT 'Verde', 'Kĩus', 'kius', 'El árbol es verde', 'Pʉus kĩus', c.id, 'facil'
FROM categories c WHERE c.name = 'Colores';

INSERT INTO words (spanish_word, nasa_yuwe_word, pronunciation, example_spanish, example_nasa_yuwe, category_id, difficulty_level)
SELECT 'Amarillo', 'Tsũũk', 'tsuuk', 'El sol es amarillo', 'Sek tsũũk', c.id, 'facil'
FROM categories c WHERE c.name = 'Colores';

INSERT INTO words (spanish_word, nasa_yuwe_word, pronunciation, example_spanish, example_nasa_yuwe, category_id, difficulty_level)
SELECT 'Blanco', 'Yũũk', 'yuuk', 'La nube es blanca', 'Nube yũũk', c.id, 'facil'
FROM categories c WHERE c.name = 'Colores';

-- Más Naturaleza
INSERT INTO words (spanish_word, nasa_yuwe_word, pronunciation, example_spanish, example_nasa_yuwe, category_id, difficulty_level)
SELECT 'Montaña', 'Wesx', 'wesx', 'La montaña es grande', 'Wesx kwe', c.id, 'intermedio'
FROM categories c WHERE c.name = 'Naturaleza';

INSERT INTO words (spanish_word, nasa_yuwe_word, pronunciation, example_spanish, example_nasa_yuwe, category_id, difficulty_level)
SELECT 'Río', 'Ũus kiwe', 'uus kiwe', 'El río es cristalino', 'Ũus kiwe fxi cristalino', c.id, 'intermedio'
FROM categories c WHERE c.name = 'Naturaleza';

INSERT INTO words (spanish_word, nasa_yuwe_word, pronunciation, example_spanish, example_nasa_yuwe, category_id, difficulty_level)
SELECT 'Árbol', 'Pʉus', 'puus', 'El árbol da sombra', 'Pʉus sombra yu', c.id, 'facil'
FROM categories c WHERE c.name = 'Naturaleza';

INSERT INTO words (spanish_word, nasa_yuwe_word, pronunciation, example_spanish, example_nasa_yuwe, category_id, difficulty_level)
SELECT 'Tierra', 'Kiwe', 'kiwe', 'La tierra es sagrada', 'Kiwe fxi sagrado', c.id, 'intermedio'
FROM categories c WHERE c.name = 'Naturaleza';

-- Alimentos
INSERT INTO words (spanish_word, nasa_yuwe_word, pronunciation, example_spanish, example_nasa_yuwe, category_id, difficulty_level)
SELECT 'Maíz', 'Aça', 'acha', 'El maíz es importante', 'Aça fxi importante', c.id, 'facil'
FROM categories c WHERE c.name = 'Alimentos';

INSERT INTO words (spanish_word, nasa_yuwe_word, pronunciation, example_spanish, example_nasa_yuwe, category_id, difficulty_level)
SELECT 'Papa', 'Pulik', 'pulik', 'La papa es deliciosa', 'Pulik fxi delicioso', c.id, 'facil'
FROM categories c WHERE c.name = 'Alimentos';

INSERT INTO words (spanish_word, nasa_yuwe_word, pronunciation, example_spanish, example_nasa_yuwe, category_id, difficulty_level)
SELECT 'Chicha', 'Juu', 'juu', 'La chicha es tradicional', 'Juu fxi tradicional', c.id, 'intermedio'
FROM categories c WHERE c.name = 'Alimentos';

-- ================================================
-- Crear actividad de Completar Oración - Nivel Fácil
-- ================================================

-- Actividad
INSERT INTO activities (title, description, type, difficulty_level, time_limit, passing_score, is_active)
VALUES (
  'Completar Oraciones - Familia',
  'Completa las oraciones relacionadas con la familia en Nasa Yuwe',
  'completar_oracion',
  'facil',
  240,
  70,
  true
) RETURNING id;

-- Guardar el ID de la actividad (necesitarás reemplazar 'ACTIVITY_ID' con el UUID real)
-- Pregunta 1
INSERT INTO questions (activity_id, question_text, question_type, correct_answer, points, order_number)
SELECT a.id, 'Mi _____ cocina muy bien', 'multiple_choice', 'Mama', 1, 1
FROM activities a WHERE a.title = 'Completar Oraciones - Familia' LIMIT 1
RETURNING id;

-- Opciones pregunta 1
INSERT INTO question_options (question_id, option_text, option_label, is_correct)
SELECT q.id, 'Mama', 'A', true
FROM questions q WHERE q.question_text = 'Mi _____ cocina muy bien' LIMIT 1;

INSERT INTO question_options (question_id, option_text, option_label, is_correct)
SELECT q.id, 'Taita', 'B', false
FROM questions q WHERE q.question_text = 'Mi _____ cocina muy bien' LIMIT 1;

INSERT INTO question_options (question_id, option_text, option_label, is_correct)
SELECT q.id, 'We''wes', 'C', false
FROM questions q WHERE q.question_text = 'Mi _____ cocina muy bien' LIMIT 1;

-- Pregunta 2
INSERT INTO questions (activity_id, question_text, question_type, correct_answer, points, order_number)
SELECT a.id, 'Nxi _____ es fuerte (Mi padre es fuerte)', 'multiple_choice', 'Taita', 1, 2
FROM activities a WHERE a.title = 'Completar Oraciones - Familia' LIMIT 1
RETURNING id;

INSERT INTO question_options (question_id, option_text, option_label, is_correct)
SELECT q.id, 'Mama', 'A', false
FROM questions q WHERE q.question_text = 'Nxi _____ es fuerte (Mi padre es fuerte)' LIMIT 1;

INSERT INTO question_options (question_id, option_text, option_label, is_correct)
SELECT q.id, 'Taita', 'B', true
FROM questions q WHERE q.question_text = 'Nxi _____ es fuerte (Mi padre es fuerte)' LIMIT 1;

INSERT INTO question_options (question_id, option_text, option_label, is_correct)
SELECT q.id, 'Ala', 'C', false
FROM questions q WHERE q.question_text = 'Nxi _____ es fuerte (Mi padre es fuerte)' LIMIT 1;

-- ================================================
-- Crear actividad de Asociar Imágenes - Nivel Fácil
-- ================================================

INSERT INTO activities (title, description, type, difficulty_level, time_limit, passing_score, is_active)
VALUES (
  'Asociar Palabras con Imágenes - Animales',
  'Relaciona las palabras en Nasa Yuwe con las imágenes correctas',
  'asociar_imagen',
  'facil',
  180,
  70,
  true
);

-- Pregunta 1
INSERT INTO questions (activity_id, question_text, question_type, image_url, correct_answer, points, order_number)
SELECT a.id, '¿Qué palabra corresponde a esta imagen?', 'image_match', '🐕', 'Pʉʉs', 1, 1
FROM activities a WHERE a.title = 'Asociar Palabras con Imágenes - Animales' LIMIT 1;

INSERT INTO question_options (question_id, option_text, option_label, is_correct)
SELECT q.id, 'Pʉʉs (Perro)', 'A', true
FROM questions q 
JOIN activities a ON q.activity_id = a.id
WHERE a.title = 'Asociar Palabras con Imágenes - Animales' AND q.order_number = 1 LIMIT 1;

INSERT INTO question_options (question_id, option_text, option_label, is_correct)
SELECT q.id, 'Mishi (Gato)', 'B', false
FROM questions q 
JOIN activities a ON q.activity_id = a.id
WHERE a.title = 'Asociar Palabras con Imágenes - Animales' AND q.order_number = 1 LIMIT 1;

INSERT INTO question_options (question_id, option_text, option_label, is_correct)
SELECT q.id, 'Pɨsh (Pájaro)', 'C', false
FROM questions q 
JOIN activities a ON q.activity_id = a.id
WHERE a.title = 'Asociar Palabras con Imágenes - Animales' AND q.order_number = 1 LIMIT 1;

-- Pregunta 2
INSERT INTO questions (activity_id, question_text, question_type, image_url, correct_answer, points, order_number)
SELECT a.id, '¿Qué palabra corresponde a esta imagen?', 'image_match', '🐱', 'Mishi', 1, 2
FROM activities a WHERE a.title = 'Asociar Palabras con Imágenes - Animales' LIMIT 1;

INSERT INTO question_options (question_id, option_text, option_label, is_correct)
SELECT q.id, 'Pʉʉs (Perro)', 'A', false
FROM questions q 
JOIN activities a ON q.activity_id = a.id
WHERE a.title = 'Asociar Palabras con Imágenes - Animales' AND q.order_number = 2 LIMIT 1;

INSERT INTO question_options (question_id, option_text, option_label, is_correct)
SELECT q.id, 'Mishi (Gato)', 'B', true
FROM questions q 
JOIN activities a ON q.activity_id = a.id
WHERE a.title = 'Asociar Palabras con Imágenes - Animales' AND q.order_number = 2 LIMIT 1;

INSERT INTO question_options (question_id, option_text, option_label, is_correct)
SELECT q.id, 'Kawayo (Caballo)', 'C', false
FROM questions q 
JOIN activities a ON q.activity_id = a.id
WHERE a.title = 'Asociar Palabras con Imágenes - Animales' AND q.order_number = 2 LIMIT 1;

-- ================================================
-- Crear más actividades de Quiz - Nivel Intermedio
-- ================================================

INSERT INTO activities (title, description, type, difficulty_level, time_limit, passing_score, is_active)
VALUES (
  'Quiz de Números - Intermedio',
  'Prueba tus conocimientos sobre números en Nasa Yuwe',
  'quiz',
  'intermedio',
  300,
  70,
  true
);

-- Pregunta 1
INSERT INTO questions (activity_id, question_text, question_type, correct_answer, points, order_number)
SELECT a.id, '¿Cómo se dice "Cuatro" en Nasa Yuwe?', 'multiple_choice', 'Pʉʉç', 1, 1
FROM activities a WHERE a.title = 'Quiz de Números - Intermedio' LIMIT 1;

INSERT INTO question_options (question_id, option_text, option_label, is_correct)
SELECT q.id, 'Pʉʉç', 'A', true
FROM questions q 
JOIN activities a ON q.activity_id = a.id
WHERE a.title = 'Quiz de Números - Intermedio' AND q.order_number = 1 LIMIT 1;

INSERT INTO question_options (question_id, option_text, option_label, is_correct)
SELECT q.id, 'Tekça', 'B', false
FROM questions q 
JOIN activities a ON q.activity_id = a.id
WHERE a.title = 'Quiz de Números - Intermedio' AND q.order_number = 1 LIMIT 1;

INSERT INTO question_options (question_id, option_text, option_label, is_correct)
SELECT q.id, 'Hĩĩç', 'C', false
FROM questions q 
JOIN activities a ON q.activity_id = a.id
WHERE a.title = 'Quiz de Números - Intermedio' AND q.order_number = 1 LIMIT 1;

-- Pregunta 2
INSERT INTO questions (activity_id, question_text, question_type, correct_answer, points, order_number)
SELECT a.id, '¿Qué significa "Hĩĩç" en español?', 'multiple_choice', 'Cinco', 1, 2
FROM activities a WHERE a.title = 'Quiz de Números - Intermedio' LIMIT 1;

INSERT INTO question_options (question_id, option_text, option_label, is_correct)
SELECT q.id, 'Tres', 'A', false
FROM questions q 
JOIN activities a ON q.activity_id = a.id
WHERE a.title = 'Quiz de Números - Intermedio' AND q.order_number = 2 LIMIT 1;

INSERT INTO question_options (question_id, option_text, option_label, is_correct)
SELECT q.id, 'Cuatro', 'B', false
FROM questions q 
JOIN activities a ON q.activity_id = a.id
WHERE a.title = 'Quiz de Números - Intermedio' AND q.order_number = 2 LIMIT 1;

INSERT INTO question_options (question_id, option_text, option_label, is_correct)
SELECT q.id, 'Cinco', 'C', true
FROM questions q 
JOIN activities a ON q.activity_id = a.id
WHERE a.title = 'Quiz de Números - Intermedio' AND q.order_number = 2 LIMIT 1;

-- ================================================
-- Crear actividad de Completar Oración - Nivel Intermedio
-- ================================================

INSERT INTO activities (title, description, type, difficulty_level, time_limit, passing_score, is_active)
VALUES (
  'Completar Oraciones - Naturaleza',
  'Completa las oraciones sobre la naturaleza en Nasa Yuwe',
  'completar_oracion',
  'intermedio',
  300,
  70,
  true
);

-- Pregunta 1
INSERT INTO questions (activity_id, question_text, question_type, correct_answer, points, order_number)
SELECT a.id, 'El _____ brilla en el cielo (sek = sol)', 'multiple_choice', 'Sek', 1, 1
FROM activities a WHERE a.title = 'Completar Oraciones - Naturaleza' LIMIT 1;

INSERT INTO question_options (question_id, option_text, option_label, is_correct)
SELECT q.id, 'Sek', 'A', true
FROM questions q 
JOIN activities a ON q.activity_id = a.id
WHERE a.title = 'Completar Oraciones - Naturaleza' AND q.order_number = 1 LIMIT 1;

INSERT INTO question_options (question_id, option_text, option_label, is_correct)
SELECT q.id, 'Nus', 'B', false
FROM questions q 
JOIN activities a ON q.activity_id = a.id
WHERE a.title = 'Completar Oraciones - Naturaleza' AND q.order_number = 1 LIMIT 1;

INSERT INTO question_options (question_id, option_text, option_label, is_correct)
SELECT q.id, 'Ũus', 'C', false
FROM questions q 
JOIN activities a ON q.activity_id = a.id
WHERE a.title = 'Completar Oraciones - Naturaleza' AND q.order_number = 1 LIMIT 1;

-- Pregunta 2
INSERT INTO questions (activity_id, question_text, question_type, correct_answer, points, order_number)
SELECT a.id, 'La _____ es sagrada para el pueblo Nasa (kiwe = tierra)', 'multiple_choice', 'Kiwe', 1, 2
FROM activities a WHERE a.title = 'Completar Oraciones - Naturaleza' LIMIT 1;

INSERT INTO question_options (question_id, option_text, option_label, is_correct)
SELECT q.id, 'Wesx', 'A', false
FROM questions q 
JOIN activities a ON q.activity_id = a.id
WHERE a.title = 'Completar Oraciones - Naturaleza' AND q.order_number = 2 LIMIT 1;

INSERT INTO question_options (question_id, option_text, option_label, is_correct)
SELECT q.id, 'Kiwe', 'B', true
FROM questions q 
JOIN activities a ON q.activity_id = a.id
WHERE a.title = 'Completar Oraciones - Naturaleza' AND q.order_number = 2 LIMIT 1;

INSERT INTO question_options (question_id, option_text, option_label, is_correct)
SELECT q.id, 'Ũus', 'C', false
FROM questions q 
JOIN activities a ON q.activity_id = a.id
WHERE a.title = 'Completar Oraciones - Naturaleza' AND q.order_number = 2 LIMIT 1;

COMMIT;

