import pool from '../config/database.js';

/**
 * Script para agregar pronunciación y ejemplos a TODAS las palabras
 */

// Función para generar pronunciación simplificada
function generarPronunciacion(nasaWord) {
  return nasaWord
    .toLowerCase()
    .replace(/ʉ/g, 'u')
    .replace(/ɨ/g, 'i')
    .replace(/ũ/g, 'u')
    .replace(/ẽ/g, 'e')
    .replace(/ĩ/g, 'i')
    .replace(/ç/g, 'ch')
    .replace(/ʉ/g, 'u')
    .replace(/ç/g, 'ch')
    .replace(/'/g, '')
    .replace(/'/g, '');
}

// Función para generar ejemplo en español
function generarEjemplo(spanishWord, categoryName) {
  const ejemplos = {
    'Números': `El número ${spanishWord} es importante`,
    'Animales': `El/La ${spanishWord.toLowerCase()} es un animal`,
    'Alimentos': `El/La ${spanishWord.toLowerCase()} es nutritivo/a`,
    'Colores': `El color ${spanishWord.toLowerCase()} es bonito`,
    'Naturaleza': `El/La ${spanishWord.toLowerCase()} es parte de la naturaleza`,
    'Familia': `El/La ${spanishWord.toLowerCase()} es mi familia`
  };
  
  return ejemplos[categoryName] || `${spanishWord} es importante`;
}

// Función para generar ejemplo en Nasa Yuwe
function generarEjemploNasa(nasaWord, categoryName) {
  const ejemplos = {
    'Números': `${nasaWord} fxi importante`,
    'Animales': `${nasaWord} fxi kiçxa`,
    'Alimentos': `${nasaWord} fxi kwet`,
    'Colores': `${nasaWord} fxi kwet`,
    'Naturaleza': `${nasaWord} fxi kiwe yuçwe`,
    'Familia': `Nxi ${nasaWord} fxi kwet`
  };
  
  return ejemplos[categoryName] || `${nasaWord} fxi importante`;
}

async function completarTodo() {
  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('  📝 COMPLETANDO PRONUNCIACIÓN Y EJEMPLOS');
  console.log('═══════════════════════════════════════════════════════════════\n');

  try {
    // 1. Obtener todas las palabras sin completar
    const palabras = await pool.query(`
      SELECT w.id, w.spanish_word, w.nasa_yuwe_word, w.pronunciation, 
             w.example_spanish, w.example_nasa_yuwe, c.name as category_name
      FROM words w
      LEFT JOIN categories c ON w.category_id = c.id
      WHERE w.pronunciation IS NULL 
         OR w.example_spanish IS NULL 
         OR w.example_nasa_yuwe IS NULL
      ORDER BY w.spanish_word
    `);

    console.log(`⚠️ Palabras sin completar: ${palabras.rows.length}\n`);

    let actualizadas = 0;

    for (const palabra of palabras.rows) {
      const pronunciation = palabra.pronunciation || generarPronunciacion(palabra.nasa_yuwe_word);
      const exampleSpanish = palabra.example_spanish || generarEjemplo(palabra.spanish_word, palabra.category_name);
      const exampleNasa = palabra.example_nasa_yuwe || generarEjemploNasa(palabra.nasa_yuwe_word, palabra.category_name);

      await pool.query(`
        UPDATE words 
        SET pronunciation = $1,
            example_spanish = $2,
            example_nasa_yuwe = $3
        WHERE id = $4
      `, [pronunciation, exampleSpanish, exampleNasa, palabra.id]);

      console.log(`✅ ${palabra.spanish_word} (${palabra.nasa_yuwe_word})`);
      console.log(`   📢 /${pronunciation}/`);
      console.log(`   📝 ${exampleSpanish}`);
      console.log(`   📝 ${exampleNasa}\n`);
      
      actualizadas++;
    }

    console.log(`\n✅ Total palabras completadas: ${actualizadas}\n`);

    // 2. Estadísticas finales
    const stats = await pool.query(`
      SELECT 
        COUNT(*) as total,
        COUNT(pronunciation) as con_pronunciacion,
        COUNT(example_spanish) as con_ejemplo_es,
        COUNT(example_nasa_yuwe) as con_ejemplo_nasa,
        COUNT(image_url) as con_imagen
      FROM words
    `);

    const final = stats.rows[0];

    console.log('═══════════════════════════════════════════════════════════════');
    console.log('  📊 ESTADÍSTICAS FINALES');
    console.log('═══════════════════════════════════════════════════════════════\n');
    console.log(`   Total palabras: ${final.total}`);
    console.log(`   ✅ Con pronunciación: ${final.con_pronunciacion}/${final.total}`);
    console.log(`   ✅ Con ejemplo español: ${final.con_ejemplo_es}/${final.total}`);
    console.log(`   ✅ Con ejemplo Nasa Yuwe: ${final.con_ejemplo_nasa}/${final.total}`);
    console.log(`   ✅ Con imagen: ${final.con_imagen}/${final.total}`);
    console.log(`\n═══════════════════════════════════════════════════════════════\n`);

    await pool.end();
    process.exit(0);

  } catch (error) {
    console.error('\n❌ Error:', error);
    await pool.end();
    process.exit(1);
  }
}

// Ejecutar
completarTodo();

