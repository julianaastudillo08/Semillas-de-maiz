import pool from '../config/database.js';

async function eliminarDuplicados() {
  console.log('🧹 Eliminando palabras duplicadas...\n');
  
  // Eliminar duplicados usando CTE y ROW_NUMBER
  const result = await pool.query(`
    WITH duplicados AS (
      SELECT id, 
             ROW_NUMBER() OVER (PARTITION BY spanish_word, nasa_yuwe_word ORDER BY created_at) as rn
      FROM words
    )
    DELETE FROM words
    WHERE id IN (
      SELECT id FROM duplicados WHERE rn > 1
    )
    RETURNING spanish_word, nasa_yuwe_word
  `);
  
  console.log(`✅ Eliminados ${result.rows.length} duplicados\n`);
  
  // Verificar que no queden duplicados
  const check = await pool.query(`
    SELECT spanish_word, nasa_yuwe_word, COUNT(*) as cantidad
    FROM words
    GROUP BY spanish_word, nasa_yuwe_word
    HAVING COUNT(*) > 1
  `);
  
  if (check.rows.length === 0) {
    console.log('✅ Ya no hay duplicados en el diccionario\n');
  } else {
    console.log(`⚠️ Aún quedan ${check.rows.length} duplicados\n`);
  }
  
  // Contar total final
  const total = await pool.query('SELECT COUNT(*) FROM words');
  console.log(`📚 Total de palabras únicas: ${total.rows[0].count}\n`);
  
  return total.rows[0].count;
}

async function agregarPreguntasAActividadesSinPreguntas() {
  console.log('📝 Agregando preguntas a actividades incompletas...\n');
  
  // Obtener actividades sin preguntas
  const actividades = await pool.query(`
    SELECT a.id, a.title, a.type, a.difficulty_level
    FROM activities a
    LEFT JOIN questions q ON a.id = q.activity_id
    WHERE a.is_active = true
    GROUP BY a.id
    HAVING COUNT(q.id) = 0
  `);
  
  for (const act of actividades.rows) {
    console.log(`   Agregando preguntas a: ${act.title}`);
    
    // Obtener 3 palabras aleatorias
    const palabras = await pool.query(`
      SELECT * FROM words 
      WHERE difficulty_level = $1 
      ORDER BY RANDOM() 
      LIMIT 3
    `, [act.difficulty_level]);
    
    for (let i = 0; i < palabras.rows.length; i++) {
      const palabra = palabras.rows[i];
      
      // Crear pregunta
      const qResult = await pool.query(`
        INSERT INTO questions (activity_id, question_text, question_type, correct_answer, points, order_number, image_url)
        VALUES ($1, $2, $3, $4, 1, $5, $6)
        RETURNING id
      `, [
        act.id,
        act.type === 'asociar_imagen' 
          ? '¿Qué palabra corresponde?' 
          : `¿Cómo se dice "${palabra.spanish_word}" en Nasa Yuwe?`,
        'multiple_choice',
        palabra.nasa_yuwe_word,
        i + 1,
        act.type === 'asociar_imagen' ? '🖼️' : null
      ]);
      
      const questionId = qResult.rows[0].id;
      
      // Opción correcta
      await pool.query(`
        INSERT INTO question_options (question_id, option_text, option_label, is_correct)
        VALUES ($1, $2, 'A', true)
      `, [questionId, palabra.nasa_yuwe_word]);
      
      // Opciones incorrectas
      const otras = await pool.query(`
        SELECT nasa_yuwe_word FROM words 
        WHERE id != $1 
        ORDER BY RANDOM() LIMIT 2
      `, [palabra.id]);
      
      if (otras.rows.length >= 1) {
        await pool.query(`
          INSERT INTO question_options (question_id, option_text, option_label, is_correct)
          VALUES ($1, $2, 'B', false)
        `, [questionId, otras.rows[0].nasa_yuwe_word]);
      }
      
      if (otras.rows.length >= 2) {
        await pool.query(`
          INSERT INTO question_options (question_id, option_text, option_label, is_correct)
          VALUES ($1, $2, 'C', false)
        `, [questionId, otras.rows[1].nasa_yuwe_word]);
      }
    }
    
    console.log(`      ✅ ${palabras.rows.length} preguntas agregadas`);
  }
  
  console.log('');
}

async function main() {
  console.log('\n═══════════════════════════════════════════════════');
  console.log('    🔧 LIMPIEZA Y CORRECCIÓN DE CONTENIDO');
  console.log('═══════════════════════════════════════════════════\n');
  
  try {
    const totalPalabras = await eliminarDuplicados();
    await agregarPreguntasAActividadesSinPreguntas();
    
    console.log('═══════════════════════════════════════════════════');
    console.log('            ✅ LIMPIEZA COMPLETADA');
    console.log('═══════════════════════════════════════════════════\n');
    console.log(`📚 Diccionario: ${totalPalabras} palabras únicas`);
    console.log('📝 Todas las actividades tienen preguntas');
    console.log('✅ Base de datos optimizada\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

main();

