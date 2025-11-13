import bcrypt from 'bcrypt';
import pool from '../config/database.js';

/**
 * Datos semilla para la base de datos
 */
const seed = async () => {
  try {
    console.log('🌱 Iniciando seed de datos...');

    // 1. Crear usuario administrador por defecto
    const adminPassword = await bcrypt.hash('admin123', 10);
    await pool.query(`
      INSERT INTO users (full_name, email, password_hash, role, is_active, email_verified)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (email) DO NOTHING
    `, ['Administrador', 'admin@semillasmaiz.edu.co', adminPassword, 'administrador', true, true]);

    // 2. Crear usuario docente de prueba
    const teacherPassword = await bcrypt.hash('docente123', 10);
    const teacherResult = await pool.query(`
      INSERT INTO users (full_name, email, password_hash, role, is_active, email_verified)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (email) DO NOTHING
      RETURNING id
    `, ['María López', 'maria.lopez@semillasmaiz.edu.co', teacherPassword, 'docente', true, true]);

    // 3. Crear usuarios estudiantes de prueba
    const studentPassword = await bcrypt.hash('estudiante123', 10);
    const students = [
      ['Juan Pérez', 'juan.perez@semillasmaiz.edu.co'],
      ['Ana García', 'ana.garcia@semillasmaiz.edu.co'],
      ['Carlos Rodríguez', 'carlos.rodriguez@semillasmaiz.edu.co'],
      ['Sofía Martínez', 'sofia.martinez@semillasmaiz.edu.co']
    ];

    const studentIds = [];
    for (const [name, email] of students) {
      const result = await pool.query(`
        INSERT INTO users (full_name, email, password_hash, role, is_active, email_verified)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (email) DO NOTHING
        RETURNING id
      `, [name, email, studentPassword, 'estudiante', true, true]);
      
      if (result.rows.length > 0) {
        studentIds.push(result.rows[0].id);
      }
    }

    // 4. Crear categorías
    const categories = [
      { name: 'Animales', description: 'Vocabulario relacionado con animales', icon_url: '🐾' },
      { name: 'Familia', description: 'Términos familiares y relaciones', icon_url: '👨‍👩‍👧‍👦' },
      { name: 'Números', description: 'Números del 1 al 100', icon_url: '🔢' },
      { name: 'Colores', description: 'Colores básicos y secundarios', icon_url: '🎨' },
      { name: 'Naturaleza', description: 'Elementos de la naturaleza', icon_url: '🌿' },
      { name: 'Alimentos', description: 'Comidas y bebidas', icon_url: '🍎' }
    ];

    const categoryIds = {};
    for (const category of categories) {
      const result = await pool.query(`
        INSERT INTO categories (name, description, icon_url)
        VALUES ($1, $2, $3)
        ON CONFLICT (name) DO UPDATE SET description = $2, icon_url = $3
        RETURNING id, name
      `, [category.name, category.description, category.icon_url]);
      
      categoryIds[category.name] = result.rows[0].id;
    }

    // 5. Crear palabras de ejemplo
    const words = [
      // Animales
      { spanish: 'Perro', nasa: "Pʉʉs", pronunciation: 'puus', exampleEs: 'El perro es mi amigo', exampleNasa: "Pʉʉs nxi amiguwe", category: 'Animales', difficulty: 'facil' },
      { spanish: 'Gato', nasa: "Mishi", pronunciation: 'mishi', exampleEs: 'El gato es pequeño', exampleNasa: "Mishi kɨwetwe", category: 'Animales', difficulty: 'facil' },
      { spanish: 'Pájaro', nasa: "Pɨsh", pronunciation: 'pish', exampleEs: 'El pájaro vuela alto', exampleNasa: "Pɨsh jĩi ũus", category: 'Animales', difficulty: 'facil' },
      
      // Familia
      { spanish: 'Madre', nasa: "Mama", pronunciation: 'mama', exampleEs: 'Mi madre es trabajadora', exampleNasa: "Nxi mama trabaja", category: 'Familia', difficulty: 'facil' },
      { spanish: 'Padre', nasa: "Taita", pronunciation: 'taita', exampleEs: 'Mi padre es fuerte', exampleNasa: "Nxi taita fxi'zwe", category: 'Familia', difficulty: 'facil' },
      { spanish: 'Hermano', nasa: "We'wes", pronunciation: 'wewes', exampleEs: 'Mi hermano estudia', exampleNasa: "Nxi we'wes estudia", category: 'Familia', difficulty: 'facil' },
      
      // Números
      { spanish: 'Uno', nasa: "Teeçx", pronunciation: 'teech', exampleEs: 'Tengo un libro', exampleNasa: "Teeçx libro yuçwe", category: 'Números', difficulty: 'facil' },
      { spanish: 'Dos', nasa: "Teka", pronunciation: 'teka', exampleEs: 'Hay dos niños', exampleNasa: "Teka ũus yuçwe", category: 'Números', difficulty: 'facil' },
      { spanish: 'Tres', nasa: "Tekça", pronunciation: 'tekcha', exampleEs: 'Tres pájaros cantan', exampleNasa: "Tekça pɨsh weyukwe", category: 'Números', difficulty: 'facil' },
      
      // Colores
      { spanish: 'Rojo', nasa: "Sxiya", pronunciation: 'shiya', exampleEs: 'La flor es roja', exampleNasa: "Kwetsa sxiya", category: 'Colores', difficulty: 'facil' },
      { spanish: 'Azul', nasa: "Çxiwe", pronunciation: 'chiwe', exampleEs: 'El cielo es azul', exampleNasa: 'Ipx çxiwe', category: 'Colores', difficulty: 'facil' },
      
      // Naturaleza
      { spanish: 'Agua', nasa: "Ũus", pronunciation: 'uus', exampleEs: 'El agua es clara', exampleNasa: "Ũus fxi'zçwe", category: 'Naturaleza', difficulty: 'facil' },
      { spanish: 'Sol', nasa: "Sek", pronunciation: 'sek', exampleEs: 'El sol brilla', exampleNasa: "Sek kıwkıw", category: 'Naturaleza', difficulty: 'facil' },
      { spanish: 'Luna', nasa: "Nus", pronunciation: 'nus', exampleEs: 'La luna es hermosa', exampleNasa: "Nus kwet", category: 'Naturaleza', difficulty: 'facil' }
    ];

    for (const word of words) {
      await pool.query(`
        INSERT INTO words (spanish_word, nasa_yuwe_word, pronunciation, example_spanish, example_nasa_yuwe, category_id, difficulty_level)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT DO NOTHING
      `, [word.spanish, word.nasa, word.pronunciation, word.exampleEs, word.exampleNasa, categoryIds[word.category], word.difficulty]);
    }

    // 6. Crear grupo de ejemplo
    if (teacherResult.rows.length > 0 && studentIds.length > 0) {
      const teacherId = teacherResult.rows[0].id;
      
      const groupResult = await pool.query(`
        INSERT INTO groups (name, education_level, grade, difficulty_level, teacher_id)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id
      `, ['Grupo 3A', 'primaria', 'Tercero', 'facil', teacherId]);

      const groupId = groupResult.rows[0].id;

      // Asignar estudiantes al grupo
      for (const studentId of studentIds) {
        await pool.query(`
          INSERT INTO group_students (group_id, student_id)
          VALUES ($1, $2)
          ON CONFLICT DO NOTHING
        `, [groupId, studentId]);
      }
    }

    // 7. Crear actividad de ejemplo
    const activityResult = await pool.query(`
      INSERT INTO activities (title, description, type, difficulty_level, time_limit, passing_score)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id
    `, ['Quiz de Animales', 'Prueba tus conocimientos sobre animales en Nasa Yuwe', 'quiz', 'facil', 300, 70]);

    const activityId = activityResult.rows[0].id;

    // 8. Crear preguntas de ejemplo para la actividad
    const questions = [
      {
        text: '¿Cómo se dice "Perro" en Nasa Yuwe?',
        type: 'multiple_choice',
        correctAnswer: 'Pʉʉs',
        options: [
          { label: 'A', text: 'Pʉʉs', isCorrect: true },
          { label: 'B', text: 'Mishi', isCorrect: false },
          { label: 'C', text: 'Pɨsh', isCorrect: false }
        ]
      },
      {
        text: '¿Qué significa "Mishi" en español?',
        type: 'multiple_choice',
        correctAnswer: 'Gato',
        options: [
          { label: 'A', text: 'Perro', isCorrect: false },
          { label: 'B', text: 'Gato', isCorrect: true },
          { label: 'C', text: 'Pájaro', isCorrect: false }
        ]
      }
    ];

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      const questionResult = await pool.query(`
        INSERT INTO questions (activity_id, question_text, question_type, correct_answer, order_number)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id
      `, [activityId, q.text, q.type, q.correctAnswer, i + 1]);

      const questionId = questionResult.rows[0].id;

      // Insertar opciones
      for (const option of q.options) {
        await pool.query(`
          INSERT INTO question_options (question_id, option_text, option_label, is_correct)
          VALUES ($1, $2, $3, $4)
        `, [questionId, option.text, option.label, option.isCorrect]);
      }
    }

    console.log('✅ Seed completado exitosamente');
    console.log('\n📋 Credenciales de prueba:');
    console.log('   Administrador: admin@semillasmaiz.edu.co / admin123');
    console.log('   Docente: maria.lopez@semillasmaiz.edu.co / docente123');
    console.log('   Estudiante: juan.perez@semillasmaiz.edu.co / estudiante123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error en seed:', error);
    process.exit(1);
  }
};

// Ejecutar seed
seed();

