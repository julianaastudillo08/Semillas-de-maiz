-- ================================================
-- Agregar más actividades de todos los tipos
-- ================================================

-- ================================================
-- QUIZ - NIVEL FÁCIL - Colores
-- ================================================
INSERT INTO activities (title, description, type, difficulty_level, time_limit, passing_score, is_active)
VALUES (
  'Quiz de Colores',
  'Aprende los colores básicos en Nasa Yuwe',
  'quiz',
  'facil',
  180,
  70,
  true
);

INSERT INTO questions (activity_id, question_text, question_type, correct_answer, points, order_number)
SELECT a.id, '¿Cómo se dice "Rojo" en Nasa Yuwe?', 'multiple_choice', 'Sxiya', 1, 1
FROM activities a WHERE a.title = 'Quiz de Colores' LIMIT 1;

INSERT INTO question_options (question_id, option_text, option_label, is_correct)
SELECT q.id, 'Sxiya', 'A', true FROM questions q JOIN activities a ON q.activity_id = a.id WHERE a.title = 'Quiz de Colores' AND q.order_number = 1 LIMIT 1;

INSERT INTO question_options (question_id, option_text, option_label, is_correct)
SELECT q.id, 'Çxiwe', 'B', false FROM questions q JOIN activities a ON q.activity_id = a.id WHERE a.title = 'Quiz de Colores' AND q.order_number = 1 LIMIT 1;

INSERT INTO question_options (question_id, option_text, option_label, is_correct)
SELECT q.id, 'Kĩus', 'C', false FROM questions q JOIN activities a ON q.activity_id = a.id WHERE a.title = 'Quiz de Colores' AND q.order_number = 1 LIMIT 1;

INSERT INTO questions (activity_id, question_text, question_type, correct_answer, points, order_number)
SELECT a.id, '¿Qué significa "Çxiwe"?', 'multiple_choice', 'Azul', 1, 2
FROM activities a WHERE a.title = 'Quiz de Colores' LIMIT 1;

INSERT INTO question_options (question_id, option_text, option_label, is_correct)
SELECT q.id, 'Rojo', 'A', false FROM questions q JOIN activities a ON q.activity_id = a.id WHERE a.title = 'Quiz de Colores' AND q.order_number = 2 LIMIT 1;

INSERT INTO question_options (question_id, option_text, option_label, is_correct)
SELECT q.id, 'Azul', 'B', true FROM questions q JOIN activities a ON q.activity_id = a.id WHERE a.title = 'Quiz de Colores' AND q.order_number = 2 LIMIT 1;

INSERT INTO question_options (question_id, option_text, option_label, is_correct)
SELECT q.id, 'Verde', 'C', false FROM questions q JOIN activities a ON q.activity_id = a.id WHERE a.title = 'Quiz de Colores' AND q.order_number = 2 LIMIT 1;

INSERT INTO questions (activity_id, question_text, question_type, correct_answer, points, order_number)
SELECT a.id, '¿Cómo se dice "Verde"?', 'multiple_choice', 'Kĩus', 1, 3
FROM activities a WHERE a.title = 'Quiz de Colores' LIMIT 1;

INSERT INTO question_options (question_id, option_text, option_label, is_correct)
SELECT q.id, 'Kĩus', 'A', true FROM questions q JOIN activities a ON q.activity_id = a.id WHERE a.title = 'Quiz de Colores' AND q.order_number = 3 LIMIT 1;

INSERT INTO question_options (question_id, option_text, option_label, is_correct)
SELECT q.id, 'Sxiya', 'B', false FROM questions q JOIN activities a ON q.activity_id = a.id WHERE a.title = 'Quiz de Colores' AND q.order_number = 3 LIMIT 1;

INSERT INTO question_options (question_id, option_text, option_label, is_correct)
SELECT q.id, 'Yũũk', 'C', false FROM questions q JOIN activities a ON q.activity_id = a.id WHERE a.title = 'Quiz de Colores' AND q.order_number = 3 LIMIT 1;

-- ================================================
-- COMPLETAR ORACIÓN - NIVEL AVANZADO
-- ================================================
INSERT INTO activities (title, description, type, difficulty_level, time_limit, passing_score, is_active)
VALUES (
  'Completar Oraciones - Avanzado',
  'Completa oraciones complejas en Nasa Yuwe',
  'completar_oracion',
  'avanzado',
  360,
  70,
  true
);

INSERT INTO questions (activity_id, question_text, question_type, correct_answer, points, order_number)
SELECT a.id, 'La tierra es _____ para el pueblo Nasa (sagrada = sagrado)', 'multiple_choice', 'sagrado', 1, 1
FROM activities a WHERE a.title = 'Completar Oraciones - Avanzado' LIMIT 1;

INSERT INTO question_options (question_id, option_text, option_label, is_correct)
SELECT q.id, 'grande', 'A', false FROM questions q JOIN activities a ON q.activity_id = a.id WHERE a.title = 'Completar Oraciones - Avanzado' AND q.order_number = 1 LIMIT 1;

INSERT INTO question_options (question_id, option_text, option_label, is_correct)
SELECT q.id, 'sagrado', 'B', true FROM questions q JOIN activities a ON q.activity_id = a.id WHERE a.title = 'Completar Oraciones - Avanzado' AND q.order_number = 1 LIMIT 1;

INSERT INTO question_options (question_id, option_text, option_label, is_correct)
SELECT q.id, 'pequeño', 'C', false FROM questions q JOIN activities a ON q.activity_id = a.id WHERE a.title = 'Completar Oraciones - Avanzado' AND q.order_number = 1 LIMIT 1;

-- ================================================
-- ASOCIAR IMÁGENES - NIVEL INTERMEDIO - Números
-- ================================================
INSERT INTO activities (title, description, type, difficulty_level, time_limit, passing_score, is_active)
VALUES (
  'Asociar Números con Imágenes',
  'Relaciona los números en Nasa Yuwe con las cantidades',
  'asociar_imagen',
  'intermedio',
  240,
  70,
  true
);

INSERT INTO questions (activity_id, question_text, question_type, image_url, correct_answer, points, order_number)
SELECT a.id, '¿Qué número representa esta imagen?', 'image_match', '1️⃣', 'Teeçx (Uno)', 1, 1
FROM activities a WHERE a.title = 'Asociar Números con Imágenes' LIMIT 1;

INSERT INTO question_options (question_id, option_text, option_label, is_correct)
SELECT q.id, 'Teeçx (Uno)', 'A', true FROM questions q JOIN activities a ON q.activity_id = a.id WHERE a.title = 'Asociar Números con Imágenes' AND q.order_number = 1 LIMIT 1;

INSERT INTO question_options (question_id, option_text, option_label, is_correct)
SELECT q.id, 'Teka (Dos)', 'B', false FROM questions q JOIN activities a ON q.activity_id = a.id WHERE a.title = 'Asociar Números con Imágenes' AND q.order_number = 1 LIMIT 1;

INSERT INTO question_options (question_id, option_text, option_label, is_correct)
SELECT q.id, 'Tekça (Tres)', 'C', false FROM questions q JOIN activities a ON q.activity_id = a.id WHERE a.title = 'Asociar Números con Imágenes' AND q.order_number = 1 LIMIT 1;

INSERT INTO questions (activity_id, question_text, question_type, image_url, correct_answer, points, order_number)
SELECT a.id, '¿Qué número representa esta imagen?', 'image_match', '3️⃣', 'Tekça (Tres)', 1, 2
FROM activities a WHERE a.title = 'Asociar Números con Imágenes' LIMIT 1;

INSERT INTO question_options (question_id, option_text, option_label, is_correct)
SELECT q.id, 'Teeçx (Uno)', 'A', false FROM questions q JOIN activities a ON q.activity_id = a.id WHERE a.title = 'Asociar Números con Imágenes' AND q.order_number = 2 LIMIT 1;

INSERT INTO question_options (question_id, option_text, option_label, is_correct)
SELECT q.id, 'Teka (Dos)', 'B', false FROM questions q JOIN activities a ON q.activity_id = a.id WHERE a.title = 'Asociar Números con Imágenes' AND q.order_number = 2 LIMIT 1;

INSERT INTO question_options (question_id, option_text, option_label, is_correct)
SELECT q.id, 'Tekça (Tres)', 'C', true FROM questions q JOIN activities a ON q.activity_id = a.id WHERE a.title = 'Asociar Números con Imágenes' AND q.order_number = 2 LIMIT 1;

-- ================================================
-- QUIZ AVANZADO - Vocabulario Completo
-- ================================================
INSERT INTO activities (title, description, type, difficulty_level, time_limit, passing_score, is_active)
VALUES (
  'Quiz Avanzado - Vocabulario General',
  'Prueba tu dominio completo del vocabulario Nasa Yuwe',
  'quiz',
  'avanzado',
  420,
  80,
  true
);

INSERT INTO questions (activity_id, question_text, question_type, correct_answer, points, order_number)
SELECT a.id, 'Completa: "Nxi _____ fxi importante" (Mi tierra es importante)', 'multiple_choice', 'kiwe', 1, 1
FROM activities a WHERE a.title = 'Quiz Avanzado - Vocabulario General' LIMIT 1;

INSERT INTO question_options (question_id, option_text, option_label, is_correct)
SELECT q.id, 'kiwe', 'A', true FROM questions q JOIN activities a ON q.activity_id = a.id WHERE a.title = 'Quiz Avanzado - Vocabulario General' AND q.order_number = 1 LIMIT 1;

INSERT INTO question_options (question_id, option_text, option_label, is_correct)
SELECT q.id, 'wesx', 'B', false FROM questions q JOIN activities a ON q.activity_id = a.id WHERE a.title = 'Quiz Avanzado - Vocabulario General' AND q.order_number = 1 LIMIT 1;

INSERT INTO question_options (question_id, option_text, option_label, is_correct)
SELECT q.id, 'ũus', 'C', false FROM questions q JOIN activities a ON q.activity_id = a.id WHERE a.title = 'Quiz Avanzado - Vocabulario General' AND q.order_number = 1 LIMIT 1;

INSERT INTO questions (activity_id, question_text, question_type, correct_answer, points, order_number)
SELECT a.id, 'Traduce: "Mama sek" al español', 'multiple_choice', 'Abuela', 1, 2
FROM activities a WHERE a.title = 'Quiz Avanzado - Vocabulario General' LIMIT 1;

INSERT INTO question_options (question_id, option_text, option_label, is_correct)
SELECT q.id, 'Madre', 'A', false FROM questions q JOIN activities a ON q.activity_id = a.id WHERE a.title = 'Quiz Avanzado - Vocabulario General' AND q.order_number = 2 LIMIT 1;

INSERT INTO question_options (question_id, option_text, option_label, is_correct)
SELECT q.id, 'Abuela', 'B', true FROM questions q JOIN activities a ON q.activity_id = a.id WHERE a.title = 'Quiz Avanzado - Vocabulario General' AND q.order_number = 2 LIMIT 1;

INSERT INTO question_options (question_id, option_text, option_label, is_correct)
SELECT q.id, 'Hermana', 'C', false FROM questions q JOIN activities a ON q.activity_id = a.id WHERE a.title = 'Quiz Avanzado - Vocabulario General' AND q.order_number = 2 LIMIT 1;

COMMIT;

