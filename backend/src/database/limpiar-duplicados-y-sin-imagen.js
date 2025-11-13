import pool from '../config/database.js';

/**
 * Script para limpiar palabras duplicadas y sin imagen
 */

async function limpiarBaseDeDatos() {
  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('  🧹 LIMPIEZA DE BASE DE DATOS');
  console.log('═══════════════════════════════════════════════════════════════\n');

  try {
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      // 1. IDENTIFICAR Y ELIMINAR DUPLICADOS
      console.log('📋 Paso 1: Identificando palabras duplicadas...\n');

      const duplicados = await client.query(`
        SELECT LOWER(spanish_word) as spanish_word_lower, 
               MIN(spanish_word) as spanish_word,
               COUNT(*) as cantidad, 
               array_agg(id ORDER BY 
                 CASE WHEN image_url IS NOT NULL THEN 0 ELSE 1 END,
                 created_at DESC
               ) as ids
        FROM words
        GROUP BY LOWER(spanish_word)
        HAVING COUNT(*) > 1
        ORDER BY MIN(spanish_word)
      `);

      console.log(`   Encontradas ${duplicados.rows.length} palabras duplicadas\n`);

      let duplicadosEliminados = 0;

      for (const row of duplicados.rows) {
        const idsToDelete = row.ids.slice(1); // Mantener el primero (con imagen preferiblemente)
        const idToKeep = row.ids[0];

        console.log(`   🔄 "${row.spanish_word}": ${row.cantidad} entradas`);
        console.log(`      ✅ Manteniendo: ${idToKeep}`);
        console.log(`      ❌ Eliminando: ${idsToDelete.join(', ')}`);

        // Eliminar las preguntas que usan estas palabras duplicadas
        await client.query(`
          DELETE FROM question_options 
          WHERE question_id IN (
            SELECT id FROM questions WHERE correct_answer IN (
              SELECT nasa_yuwe_word FROM words WHERE id = ANY($1)
            )
          )
        `, [idsToDelete]);

        await client.query(`
          DELETE FROM questions 
          WHERE correct_answer IN (
            SELECT nasa_yuwe_word FROM words WHERE id = ANY($1)
          )
        `, [idsToDelete]);

        // Eliminar las palabras duplicadas
        const result = await client.query(
          'DELETE FROM words WHERE id = ANY($1)',
          [idsToDelete]
        );

        duplicadosEliminados += result.rowCount;
      }

      console.log(`\n   ✅ Total duplicados eliminados: ${duplicadosEliminados}\n`);

      // 2. ELIMINAR PALABRAS SIN IMAGEN
      console.log('📋 Paso 2: Eliminando palabras sin imagen...\n');

      // Primero obtener las palabras sin imagen
      const sinImagen = await client.query(`
        SELECT id, spanish_word, nasa_yuwe_word
        FROM words
        WHERE image_url IS NULL
        LIMIT 10
      `);

      console.log(`   Encontradas palabras sin imagen (mostrando primeras 10):`);
      sinImagen.rows.forEach(word => {
        console.log(`      • ${word.spanish_word} (${word.nasa_yuwe_word})`);
      });

      // Contar total sin imagen
      const countSinImagen = await client.query(`
        SELECT COUNT(*) as total FROM words WHERE image_url IS NULL
      `);

      console.log(`\n   Total palabras sin imagen: ${countSinImagen.rows[0].total}\n`);

      // Eliminar preguntas que usan palabras sin imagen
      await client.query(`
        DELETE FROM question_options 
        WHERE question_id IN (
          SELECT q.id FROM questions q
          WHERE q.correct_answer IN (
            SELECT nasa_yuwe_word FROM words WHERE image_url IS NULL
          )
        )
      `);

      const deletedQuestions = await client.query(`
        DELETE FROM questions 
        WHERE correct_answer IN (
          SELECT nasa_yuwe_word FROM words WHERE image_url IS NULL
        )
      `);

      console.log(`   ✅ Preguntas eliminadas: ${deletedQuestions.rowCount}`);

      // Eliminar las palabras sin imagen
      const deletedWords = await client.query(
        'DELETE FROM words WHERE image_url IS NULL'
      );

      console.log(`   ✅ Palabras sin imagen eliminadas: ${deletedWords.rowCount}\n`);

      // 3. LIMPIAR ACTIVIDADES VACÍAS
      console.log('📋 Paso 3: Limpiando actividades sin preguntas...\n');

      const emptyActivities = await client.query(`
        SELECT a.id, a.title
        FROM activities a
        LEFT JOIN questions q ON a.id = q.activity_id
        WHERE q.id IS NULL
      `);

      console.log(`   Actividades sin preguntas: ${emptyActivities.rows.length}`);
      emptyActivities.rows.forEach(activity => {
        console.log(`      • ${activity.title}`);
      });

      const deletedActivities = await client.query(`
        DELETE FROM activities 
        WHERE id IN (
          SELECT a.id FROM activities a
          LEFT JOIN questions q ON a.id = q.activity_id
          WHERE q.id IS NULL
        )
      `);

      console.log(`\n   ✅ Actividades vacías eliminadas: ${deletedActivities.rowCount}\n`);

      // 4. ESTADÍSTICAS FINALES
      console.log('═══════════════════════════════════════════════════════════════');
      console.log('  📊 ESTADÍSTICAS FINALES');
      console.log('═══════════════════════════════════════════════════════════════\n');

      const finalStats = await client.query(`
        SELECT 
          (SELECT COUNT(*) FROM words) as total_palabras,
          (SELECT COUNT(*) FROM words WHERE image_url IS NOT NULL) as con_imagen,
          (SELECT COUNT(*) FROM words WHERE image_url IS NULL) as sin_imagen,
          (SELECT COUNT(*) FROM activities) as total_actividades,
          (SELECT COUNT(*) FROM questions) as total_preguntas,
          (SELECT COUNT(DISTINCT spanish_word) FROM words) as palabras_unicas
      `);

      const stats = finalStats.rows[0];

      console.log(`   📚 Total palabras: ${stats.total_palabras}`);
      console.log(`   ✅ Con imagen: ${stats.con_imagen}`);
      console.log(`   ❌ Sin imagen: ${stats.sin_imagen}`);
      console.log(`   📝 Palabras únicas: ${stats.palabras_unicas}`);
      console.log(`   🎮 Actividades: ${stats.total_actividades}`);
      console.log(`   ❓ Preguntas: ${stats.total_preguntas}`);

      await client.query('COMMIT');

      console.log('\n═══════════════════════════════════════════════════════════════');
      console.log('  ✅ LIMPIEZA COMPLETADA EXITOSAMENTE');
      console.log('═══════════════════════════════════════════════════════════════\n');

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }

    await pool.end();
    process.exit(0);

  } catch (error) {
    console.error('\n❌ Error durante la limpieza:', error);
    await pool.end();
    process.exit(1);
  }
}

// Ejecutar
limpiarBaseDeDatos();

