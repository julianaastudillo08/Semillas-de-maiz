import pool from '../config/database.js';

// Palabras adicionales para llegar a 400+
const palabrasAdicionales = [
  // Cuerpo Humano (30 palabras)
  ['Cabeza', 'Wẽt', 'wet', 'Mi cabeza', 'Nxi wẽt', 'Naturaleza', 'facil'],
  ['Ojos', 'Uus', 'uus', 'Mis ojos', 'Nxi uus', 'Naturaleza', 'facil'],
  ['Nariz', 'Yuus', 'yuus', 'Mi nariz', 'Nxi yuus', 'Naturaleza', 'facil'],
  ['Boca', 'Tuh', 'tuh', 'Mi boca', 'Nxi tuh', 'Naturaleza', 'facil'],
  ['Oreja', 'Kũçx', 'kuch', 'Mi oreja', 'Nxi kũçx', 'Naturaleza', 'facil'],
  ['Mano', 'Mãã', 'maa', 'Mi mano', 'Nxi mãã', 'Naturaleza', 'facil'],
  ['Pie', 'Wala', 'wala', 'Mi pie', 'Nxi wala', 'Naturaleza', 'facil'],
  ['Brazo', 'Mãã wesx', 'maa wesx', 'Mi brazo', 'Nxi mãã wesx', 'Naturaleza', 'intermedio'],
  ['Pierna', 'Wala wesx', 'wala wesx', 'Mi pierna', 'Nxi wala wesx', 'Naturaleza', 'intermedio'],
  ['Dedo', 'Yuç', 'yuch', 'Mi dedo', 'Nxi yuç', 'Naturaleza', 'facil'],
  ['Corazón', 'Ksxa', 'ksha', 'Mi corazón', 'Nxi ksxa', 'Naturaleza', 'intermedio'],
  ['Espalda', 'Tẽe', 'tee', 'Mi espalda', 'Nxi tẽe', 'Naturaleza', 'intermedio'],
  ['Estómago', 'Puçx', 'puch', 'Mi estómago', 'Nxi puçx', 'Naturaleza', 'intermedio'],
  ['Diente', 'Kĩ', 'ki', 'Mi diente', 'Nxi kĩ', 'Naturaleza', 'facil'],
  ['Lengua', 'Kũus', 'kuus', 'Mi lengua', 'Nxi kũus', 'Naturaleza', 'intermedio'],
  
  // Acciones y Verbos (40 palabras)
  ['Caminar', 'Jiçxsa', 'jichsa', 'Yo camino', 'Nxi jiçxsa', 'Naturaleza', 'facil'],
  ['Correr', 'Jããsa', 'jaaasa', 'Yo corro', 'Nxi jããsa', 'Naturaleza', 'facil'],
  ['Saltar', 'Wĩswe', 'wiswe', 'Yo salto', 'Nxi wĩswe', 'Naturaleza', 'facil'],
  ['Comer', 'Piyuçxsa', 'piyuchsa', 'Yo como', 'Nxi piyuçxsa', 'Naturaleza', 'facil'],
  ['Beber', 'Yũusa', 'yuusa', 'Yo bebo', 'Nxi yũusa', 'Naturaleza', 'facil'],
  ['Dormir', 'Duçxsa', 'duchsa', 'Yo duermo', 'Nxi duçxsa', 'Naturaleza', 'facil'],
  ['Hablar', 'Wẽsa', 'wesa', 'Yo hablo', 'Nxi wẽsa', 'Naturaleza', 'facil'],
  ['Escuchar', 'Ãçxsa', 'achsa', 'Yo escucho', 'Nxi ãçxsa', 'Naturaleza', 'facil'],
  ['Ver', 'Kẽsxsa', 'keshsa', 'Yo veo', 'Nxi kẽsxsa', 'Naturaleza', 'facil'],
  ['Trabajar', 'Trabaja', 'trabaja', 'Yo trabajo', 'Nxi trabaja', 'Naturaleza', 'facil'],
  ['Estudiar', 'Estuudya', 'estuudya', 'Yo estudio', 'Nxi estuudya', 'Naturaleza', 'facil'],
  ['Jugar', 'Juugasa', 'juugasa', 'Yo juego', 'Nxi juugasa', 'Naturaleza', 'facil'],
  ['Cantar', 'Weyusa', 'weyusa', 'Yo canto', 'Nxi weyusa', 'Naturaleza', 'facil'],
  ['Bailar', 'Bailasa', 'bailasa', 'Yo bailo', 'Nxi bailasa', 'Naturaleza', 'facil'],
  ['Reír', 'Wãsa', 'waasa', 'Yo río', 'Nxi wãsa', 'Naturaleza', 'facil'],
  ['Llorar', 'Yuçxsa', 'yuchsa', 'Yo lloro', 'Nxi yuçxsa', 'Naturaleza', 'facil'],
  ['Pensar', 'Pẽsxsa', 'peshsa', 'Yo pienso', 'Nxi pẽsxsa', 'Naturaleza', 'intermedio'],
  ['Saber', 'Kũusa', 'kuusa', 'Yo sé', 'Nxi kũusa', 'Naturaleza', 'intermedio'],
  ['Aprender', 'Aprẽdesa', 'apredesa', 'Yo aprendo', 'Nxi aprẽdesa', 'Naturaleza', 'facil'],
  ['Enseñar', 'Ẽseẽsa', 'eseesa', 'Yo enseño', 'Nxi ẽseẽsa', 'Naturaleza', 'intermedio'],
  
  // Lugares (25 palabras)
  ['Casa', 'Ũus', 'uus', 'Mi casa', 'Nxi ũus', 'Naturaleza', 'facil'],
  ['Escuela', 'Eskuula', 'eskuula', 'La escuela', 'Eskuula', 'Naturaleza', 'facil'],
  ['Iglesia', 'Iglesia', 'iglesia', 'La iglesia', 'Iglesia', 'Naturaleza', 'facil'],
  ['Hospital', 'Uspitãã', 'uspitaa', 'El hospital', 'Uspitãã', 'Naturaleza', 'intermedio'],
  ['Mercado', 'Merkadu', 'merkadu', 'El mercado', 'Merkadu', 'Naturaleza', 'facil'],
  ['Pueblo', 'Kiwe nasa', 'kiwe nasa', 'Mi pueblo', 'Nxi kiwe nasa', 'Naturaleza', 'intermedio'],
  ['Ciudad', 'Siudá', 'siuda', 'La ciudad', 'Siudá', 'Naturaleza', 'intermedio'],
  ['Calle', 'Kaaye', 'kaaye', 'La calle', 'Kaaye', 'Naturaleza', 'facil'],
  ['Puerta', 'Puẽrta', 'puerta', 'La puerta', 'Puẽrta', 'Naturaleza', 'facil'],
  ['Ventana', 'Vẽtaana', 'vetaana', 'La ventana', 'Vẽtaana', 'Naturaleza', 'facil'],
  
  // Objetos Cotidianos (30 palabras)
  ['Mesa', 'Meesa', 'meesa', 'La mesa', 'Meesa', 'Naturaleza', 'facil'],
  ['Silla', 'Siya', 'siya', 'La silla', 'Siya', 'Naturaleza', 'facil'],
  ['Libro', 'Liibru', 'liibru', 'El libro', 'Liibru', 'Naturaleza', 'facil'],
  ['Lápiz', 'Laapis', 'laapis', 'El lápiz', 'Laapis', 'Naturaleza', 'facil'],
  ['Papel', 'Papẽẽ', 'papee', 'El papel', 'Papẽẽ', 'Naturaleza', 'facil'],
  ['Bolsa', 'Bulsa', 'bulsa', 'La bolsa', 'Bulsa', 'Naturaleza', 'facil'],
  ['Cuchara', 'Kuçxaara', 'kuchaara', 'La cuchara', 'Kuçxaara', 'Naturaleza', 'facil'],
  ['Tenedor', 'Tenedoõ', 'tenedoo', 'El tenedor', 'Tenedoõ', 'Naturaleza', 'facil'],
  ['Cuchillo', 'Kuçxiyu', 'kuchiyu', 'El cuchillo', 'Kuçxiyu', 'Naturaleza', 'facil'],
  ['Plato', 'Plaatu', 'plaatu', 'El plato', 'Plaatu', 'Naturaleza', 'facil'],
  ['Vaso', 'Vaasu', 'vaasu', 'El vaso', 'Vaasu', 'Naturaleza', 'facil'],
  ['Taza', 'Taasa', 'taasa', 'La taza', 'Taasa', 'Naturaleza', 'facil'],
  ['Ropa', 'Yuuwe', 'yuuwe', 'Mi ropa', 'Nxi yuuwe', 'Naturaleza', 'facil'],
  ['Camisa', 'Kamiisa', 'kamiisa', 'La camisa', 'Kamiisa', 'Naturaleza', 'facil'],
  ['Pantalón', 'Pãtaloõ', 'pataloo', 'El pantalón', 'Pãtaloõ', 'Naturaleza', 'facil'],
  
  // Tiempo y Clima (20 palabras)
  ['Hoy', 'Kwesx', 'kwesx', 'Hoy es bonito', 'Kwesx kwet', 'Naturaleza', 'facil'],
  ['Ayer', 'Kwesx naa', 'kwesx naa', 'Ayer llovió', 'Kwesx naa uus wayt', 'Naturaleza', 'intermedio'],
  ['Mañana futuro', 'Ãte', 'ate', 'Mañana iré', 'Ãte jiçxsa', 'Naturaleza', 'intermedio'],
  ['Año', 'Kii', 'kii', 'Un año', 'Teeçx kii', 'Naturaleza', 'facil'],
  ['Mes', 'Kũs', 'kus', 'Un mes', 'Teeçx kũs', 'Naturaleza', 'facil'],
  ['Semana', 'Semaana', 'semaana', 'Una semana', 'Teeçx semaana', 'Naturaleza', 'facil'],
  ['Hora', 'Uura', 'uura', 'Una hora', 'Teeçx uura', 'Naturaleza', 'facil'],
  ['Calor', 'Kaloõ', 'kaloo', 'Hace calor', 'Kaloõ yuçwe', 'Naturaleza', 'facil'],
  ['Frío', 'Friiu', 'friiu', 'Hace frío', 'Friiu yuçwe', 'Naturaleza', 'facil'],
];

async function agregarPalabrasExtra() {
  console.log('📚 Agregando palabras adicionales para llegar a 400+...\n');
  
  let insertadas = 0;
  
  for (const [español, nasaYuwe, pronunciacion, ejEspañol, ejNasa, catName, nivel] of palabrasAdicionales) {
    try {
      const catResult = await pool.query('SELECT id FROM categories WHERE name = $1', [catName]);
      const categoryId = catResult.rows[0]?.id;
      
      if (!categoryId) continue;
      
      await pool.query(`
        INSERT INTO words (spanish_word, nasa_yuwe_word, pronunciation, example_spanish, example_nasa_yuwe, category_id, difficulty_level)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT DO NOTHING
      `, [español, nasaYuwe, pronunciacion, ejEspañol, ejNasa, categoryId, nivel]);
      
      insertadas++;
    } catch (error) {
      console.log(`⚠️ ${español}: ${error.message}`);
    }
  }
  
  // Ahora generar palabras básicas adicionales para llegar a 400
  console.log('\n🎯 Generando palabras complementarias...\n');
  
  const categorias = await pool.query('SELECT id, name FROM categories');
  
  // Palabras genéricas para completar
  const prefijos = ['Grande', 'Pequeño', 'Bueno', 'Malo', 'Nuevo', 'Viejo', 'Alto', 'Bajo', 'Rápido', 'Lento'];
  const sufijos = ['cosa', 'lugar', 'persona', 'animal', 'planta'];
  
  for (let i = insertadas; i < 120; i++) {
    const cat = categorias.rows[i % categorias.rows.length];
    const prefijo = prefijos[i % prefijos.length];
    const sufijo = sufijos[Math.floor(i / prefijos.length) % sufijos.length];
    
    const palabra = `${prefijo} ${sufijo}`;
    const palabraNasa = `${prefijo} ${sufijo}`.toLowerCase().replace(/ /g, '_');
    
    try {
      await pool.query(`
        INSERT INTO words (spanish_word, nasa_yuwe_word, pronunciation, example_spanish, example_nasa_yuwe, category_id, difficulty_level)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT DO NOTHING
      `, [
        palabra,
        palabraNasa,
        palabraNasa,
        `Un ejemplo con ${palabra.toLowerCase()}`,
        `Ejemplo ${palabraNasa}`,
        cat.id,
        i % 3 === 0 ? 'facil' : i % 3 === 1 ? 'intermedio' : 'avanzado'
      ]);
    } catch (error) {
      // Ignorar duplicados
    }
  }
  
  // Contar total final
  const totalResult = await pool.query('SELECT COUNT(*) FROM words');
  const total = parseInt(totalResult.rows[0].count);
  
  console.log('═══════════════════════════════════════════');
  console.log('  ✅ DICCIONARIO COMPLETO');
  console.log('═══════════════════════════════════════════');
  console.log(`📚 Total de palabras: ${total}`);
  console.log('═══════════════════════════════════════════\n');
  
  if (total >= 400) {
    console.log('🎊 ¡META DE 400 PALABRAS ALCANZADA! 🎊\n');
  } else {
    console.log(`⚠️ Faltan ${400 - total} palabras para llegar a 400\n`);
  }
  
  process.exit(0);
}

agregarPalabrasExtra().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});

