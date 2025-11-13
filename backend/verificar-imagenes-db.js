import pool from './src/config/database.js';

async function verificarImagenes() {
  try {
    // Verificar algunas palabras
    const result = await pool.query(`
      SELECT spanish_word, nasa_yuwe_word, image_url, category_id
      FROM words
      WHERE spanish_word IN ('Catorce', 'Perro', 'Manzana', 'Agua', 'Rojo')
      ORDER BY spanish_word
    `);

    console.log('\n🔍 Verificando palabras en la base de datos:\n');
    
    result.rows.forEach(word => {
      console.log(`📝 ${word.spanish_word} (${word.nasa_yuwe_word})`);
      console.log(`   📸 Imagen: ${word.image_url || 'SIN IMAGEN'}`);
      console.log(`   📂 Categoría ID: ${word.category_id}`);
      console.log('');
    });

    // Contar cuántas palabras tienen imagen
    const countResult = await pool.query(`
      SELECT 
        COUNT(*) as total,
        COUNT(image_url) as con_imagen,
        COUNT(*) - COUNT(image_url) as sin_imagen
      FROM words
    `);

    console.log('📊 Estadísticas:');
    console.log(`   Total palabras: ${countResult.rows[0].total}`);
    console.log(`   Con imagen: ${countResult.rows[0].con_imagen}`);
    console.log(`   Sin imagen: ${countResult.rows[0].sin_imagen}`);
    console.log('');

    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

verificarImagenes();

