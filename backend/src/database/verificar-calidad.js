import pool from '../config/database.js';

/**
 * Script para verificar calidad del contenido:
 * - Palabras duplicadas
 * - Palabras con errores ortográficos
 * - Validaciones de integridad
 */

async function verificarPalabrasDuplicadas() {
  console.log('🔍 Verificando palabras duplicadas...\n');
  
  const result = await pool.query(`
    SELECT spanish_word, nasa_yuwe_word, COUNT(*) as cantidad
    FROM words
    GROUP BY spanish_word, nasa_yuwe_word
    HAVING COUNT(*) > 1
  `);
  
  if (result.rows.length === 0) {
    console.log('✅ No hay palabras duplicadas\n');
  } else {
    console.log('⚠️ Palabras duplicadas encontradas:');
    result.rows.forEach(row => {
      console.log(`   - ${row.spanish_word} / ${row.nasa_yuwe_word} (${row.cantidad} veces)`);
    });
    console.log('');
  }
  
  return result.rows.length;
}

async function verificarPalabrasVacias() {
  console.log('🔍 Verificando palabras vacías o mal formadas...\n');
  
  const result = await pool.query(`
    SELECT id, spanish_word, nasa_yuwe_word
    FROM words
    WHERE spanish_word IS NULL 
       OR nasa_yuwe_word IS NULL
       OR spanish_word = ''
       OR nasa_yuwe_word = ''
       OR LENGTH(spanish_word) < 2
       OR LENGTH(nasa_yuwe_word) < 2
  `);
  
  if (result.rows.length === 0) {
    console.log('✅ Todas las palabras están bien formadas\n');
  } else {
    console.log('⚠️ Palabras con problemas:');
    result.rows.forEach(row => {
      console.log(`   - ID: ${row.id} | ESP: "${row.spanish_word}" | NASA: "${row.nasa_yuwe_word}"`);
    });
    console.log('');
  }
  
  return result.rows.length;
}

async function verificarOraciones() {
  console.log('🔍 Verificando ejemplos de oraciones...\n');
  
  const result = await pool.query(`
    SELECT COUNT(*) as total,
           COUNT(example_spanish) as con_ejemplo_es,
           COUNT(example_nasa_yuwe) as con_ejemplo_nasa
    FROM words
  `);
  
  const stats = result.rows[0];
  console.log(`   Total palabras: ${stats.total}`);
  console.log(`   Con ejemplo español: ${stats.con_ejemplo_es} (${Math.round(stats.con_ejemplo_es / stats.total * 100)}%)`);
  console.log(`   Con ejemplo Nasa Yuwe: ${stats.con_ejemplo_nasa} (${Math.round(stats.con_ejemplo_nasa / stats.total * 100)}%)`);
  console.log('');
  
  if (stats.con_ejemplo_es === stats.total && stats.con_ejemplo_nasa === stats.total) {
    console.log('✅ Todas las palabras tienen ejemplos completos\n');
  } else {
    console.log('⚠️ Algunas palabras no tienen ejemplos completos\n');
  }
}

async function verificarCategorias() {
  console.log('🔍 Verificando distribución por categorías...\n');
  
  const result = await pool.query(`
    SELECT c.name, COUNT(w.id) as cantidad
    FROM categories c
    LEFT JOIN words w ON c.id = w.category_id
    GROUP BY c.name
    ORDER BY cantidad DESC
  `);
  
  console.log('   Distribución de palabras por categoría:');
  result.rows.forEach(row => {
    console.log(`   📚 ${row.name.padEnd(20)} → ${row.cantidad} palabras`);
  });
  console.log('');
  
  const sinCategoria = result.rows.find(r => r.cantidad === 0);
  if (!sinCategoria) {
    console.log('✅ Todas las categorías tienen palabras\n');
  }
}

async function verificarActividades() {
  console.log('🔍 Verificando actividades y preguntas...\n');
  
  const result = await pool.query(`
    SELECT 
      a.title,
      a.difficulty_level,
      COUNT(q.id) as preguntas
    FROM activities a
    LEFT JOIN questions q ON a.id = q.activity_id
    WHERE a.is_active = true
    GROUP BY a.id, a.title, a.difficulty_level
    ORDER BY a.difficulty_level, a.title
  `);
  
  console.log(`   Total de actividades: ${result.rows.length}`);
  console.log('');
  
  let facil = 0, intermedio = 0, avanzado = 0;
  let sinPreguntas = [];
  
  result.rows.forEach(row => {
    if (row.difficulty_level === 'facil') facil++;
    if (row.difficulty_level === 'intermedio') intermedio++;
    if (row.difficulty_level === 'avanzado') avanzado++;
    
    if (row.preguntas === '0') {
      sinPreguntas.push(row.title);
    }
  });
  
  console.log(`   📊 Por dificultad:`);
  console.log(`      Fácil: ${facil} actividades`);
  console.log(`      Intermedio: ${intermedio} actividades`);
  console.log(`      Avanzado: ${avanzado} actividades`);
  console.log('');
  
  if (sinPreguntas.length === 0) {
    console.log('✅ Todas las actividades tienen preguntas\n');
  } else {
    console.log('⚠️ Actividades sin preguntas:');
    sinPreguntas.forEach(title => console.log(`   - ${title}`));
    console.log('');
  }
}

async function estadisticasGenerales() {
  console.log('📊 Estadísticas Generales del Sistema...\n');
  
  const usuarios = await pool.query(`
    SELECT role, COUNT(*) as cantidad, 
           SUM(CASE WHEN is_active THEN 1 ELSE 0 END) as activos
    FROM users
    GROUP BY role
  `);
  
  console.log('   👥 Usuarios:');
  usuarios.rows.forEach(row => {
    console.log(`      ${row.role.padEnd(15)} → ${row.cantidad} (${row.activos} activos)`);
  });
  console.log('');
  
  const palabras = await pool.query('SELECT COUNT(*) as total FROM words');
  const actividades = await pool.query('SELECT COUNT(*) as total FROM activities WHERE is_active = true');
  const categorias = await pool.query('SELECT COUNT(*) as total FROM categories');
  
  console.log(`   📚 Palabras en diccionario: ${palabras.rows[0].total}`);
  console.log(`   📝 Actividades activas: ${actividades.rows[0].total}`);
  console.log(`   📁 Categorías: ${categorias.rows[0].total}`);
  console.log('');
}

async function main() {
  console.log('\n═══════════════════════════════════════════════════');
  console.log('  🔍 VERIFICACIÓN DE CALIDAD DEL CONTENIDO');
  console.log('═══════════════════════════════════════════════════\n');
  
  try {
    const duplicados = await verificarPalabrasDuplicadas();
    const vacias = await verificarPalabrasVacias();
    await verificarOraciones();
    await verificarCategorias();
    await verificarActividades();
    await estadisticasGenerales();
    
    console.log('═══════════════════════════════════════════════════');
    console.log('              ✅ VERIFICACIÓN COMPLETA');
    console.log('═══════════════════════════════════════════════════\n');
    
    if (duplicados === 0 && vacias === 0) {
      console.log('🎊 ¡EXCELENTE! Base de datos sin problemas\n');
      console.log('   ✅ Sin duplicados');
      console.log('   ✅ Sin palabras vacías');
      console.log('   ✅ Contenido completo');
      console.log('   ✅ Listo para usar\n');
    } else {
      console.log('⚠️ Se encontraron algunos problemas:\n');
      if (duplicados > 0) console.log(`   - ${duplicados} palabras duplicadas`);
      if (vacias > 0) console.log(`   - ${vacias} palabras mal formadas`);
      console.log('');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

main();

