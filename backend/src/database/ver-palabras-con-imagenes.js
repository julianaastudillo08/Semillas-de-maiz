import pool from '../config/database.js';

async function verPalabrasConImagenes() {
  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('  📸 PALABRAS QUE NECESITAN IMÁGENES');
  console.log('═══════════════════════════════════════════════════════════════\n');
  
  try {
    // Obtener actividades de asociar_imagen
    const activitiesResult = await pool.query(`
      SELECT DISTINCT a.title, a.difficulty_level
      FROM activities a
      WHERE a.type = 'asociar_imagen'
      ORDER BY a.difficulty_level, a.title
    `);

    console.log(`Total actividades de asociar_imagen: ${activitiesResult.rows.length}\n`);

    // Obtener todas las palabras únicas de estas actividades
    const wordsResult = await pool.query(`
      SELECT DISTINCT 
        qo.option_text as palabra_nasa,
        w.spanish_word as palabra_español,
        w.category_id,
        c.name as categoria
      FROM activities a
      INNER JOIN questions q ON a.id = q.activity_id
      INNER JOIN question_options qo ON q.id = qo.question_id
      LEFT JOIN words w ON qo.option_text = w.nasa_yuwe_word
      LEFT JOIN categories c ON w.category_id = c.id
      WHERE a.type = 'asociar_imagen' AND qo.is_correct = true
      ORDER BY c.name, w.spanish_word
    `);

    console.log('📋 LISTADO DE PALABRAS POR CATEGORÍA:\n');

    let currentCategory = '';
    let count = 0;

    wordsResult.rows.forEach((row, index) => {
      if (row.categoria !== currentCategory) {
        if (currentCategory !== '') console.log('');
        currentCategory = row.categoria || 'Sin categoría';
        console.log(`\n📁 ${currentCategory.toUpperCase()}:`);
        console.log('─'.repeat(60));
      }
      
      count++;
      const numero = String(count).padStart(3, '0');
      console.log(`${numero}. ${row.palabra_español || 'N/A'} (${row.palabra_nasa})`);
    });

    console.log('\n');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log(`  📊 TOTAL: ${wordsResult.rows.length} palabras necesitan imágenes`);
    console.log('═══════════════════════════════════════════════════════════════\n');

    // Agrupar por categoría
    const porCategoria = {};
    wordsResult.rows.forEach(row => {
      const cat = row.categoria || 'Sin categoría';
      if (!porCategoria[cat]) porCa tegoria[cat] = [];
      porCategoria[cat].push(row.palabra_español || row.palabra_nasa);
    });

    console.log('📊 RESUMEN POR CATEGORÍA:\n');
    Object.entries(porCategoria).forEach(([cat, palabras]) => {
      console.log(`   ${cat}: ${palabras.length} palabras`);
    });
    console.log('');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

verPalabrasConImagenes();

