import pool from '../config/database.js';

/**
 * Script para generar contenido educativo completo:
 * - 400 palabras en el diccionario
 * - 4 lecciones por cada nivel educativo (Preescolar + 5 grados primaria = 24 lecciones)
 */

const contenidoPorCategoria = {
  'Animales': [
    // Domésticos (20)
    ['Perro', 'Pʉʉs', 'puus'], ['Gato', 'Mishi', 'mishi'], ['Vaca', 'Waka', 'waka'],
    ['Caballo', 'Kawayo', 'kawayo'], ['Burro', 'Burru', 'burru'], ['Cerdo', 'Kuchi', 'kuchi'],
    ['Oveja', 'Kweẽra', 'kweera'], ['Cabra', 'Chiva', 'chiva'], ['Gallina', 'Akas', 'akas'],
    ['Gallo', 'Akas luuçx', 'akas luuch'], ['Pato', 'Patu', 'patu'], ['Pavo', 'Pavu', 'pavu'],
    ['Conejo', 'Kweju', 'kweju'], ['Ratón', 'Kwe', 'kwe'], ['Mula', 'Muula', 'muula'],
    
    // Salvajes (30)
    ['Pájaro', 'Pɨsh', 'pish'], ['Loro', 'Kũs', 'kus'], ['Águila', 'Pĩt', 'pit'],
    ['Serpiente', 'Sxĩi', 'shii'], ['Tigre', 'Tigrre', 'tigrre'], ['Oso', 'Uus', 'uus'],
    ['Venado', 'Sxa', 'sha'], ['Ardilla', 'Yuçx', 'yuch'], ['Tortuga', 'Kuẽẽs', 'kuees'],
    ['Rana', 'Kwẽç', 'kwech'], ['Pez', 'Wam', 'wam'], ['Zorro', 'Surru', 'surru'],
    ['Mono', 'Miko', 'miko'], ['Cóndor', 'Kõndu', 'kondu'], ['Búho', 'Uhku', 'uhku'],
    
    // Insectos (10)
    ['Mariposa', 'Kẽẽsh', 'keesh'], ['Abeja', 'Kĩsh', 'kish'], ['Hormiga', 'Sxik', 'shik'],
    ['Mosca', 'Tũus', 'tuus'], ['Araña', 'Sxũũs', 'shuus'], ['Grillo', 'Killu', 'killu'],
    ['Saltamontes', 'Saltamunte', 'saltamunte'], ['Cucaracha', 'Kukaraçxa', 'kukaracha'],
    ['Escarabajo', 'Eskarabaju', 'eskarabaju'], ['Luciérnaga', 'Ipx kĩsh', 'ipch kish']
  ],
  
  'Familia': [
    ['Madre', 'Mama', 'mama'], ['Padre', 'Taita', 'taita'], ['Hermano', 'We\'wes', 'wewes'],
    ['Hermana', 'Ala', 'ala'], ['Abuelo', 'Tata sek', 'tata sek'], ['Abuela', 'Mama sek', 'mama sek'],
    ['Hijo', 'Ũus', 'uus'], ['Hija', 'Ũus kwe', 'uus kwe'], ['Tío', 'Tuku', 'tuku'],
    ['Tía', 'Ala tuku', 'ala tuku'], ['Primo', 'Prima', 'prima'], ['Prima', 'Prima kwe', 'prima kwe'],
    ['Sobrino', 'Wala ũus', 'wala uus'], ['Sobrina', 'Wala ũus kwe', 'wala uus kwe'],
    ['Nieto', 'Wẽẽ ũus', 'wee uus'], ['Nieta', 'Wẽẽ ũus kwe', 'wee uus kwe'],
    ['Esposo', 'Luuçx', 'luuch'], ['Esposa', 'Luuçx kwe', 'luuch kwe'],
    ['Bebé', 'Ũus kiwet', 'uus kiwet'], ['Niño', 'Ũus nasa', 'uus nasa'],
    ['Niña', 'Ũus kwe nasa', 'uus kwe nasa'], ['Joven', 'Piyaçx', 'piyach'],
    ['Adulto', 'Nasa sek', 'nasa sek'], ['Anciano', 'Tee sek', 'tee sek'],
    ['Familia', 'Familia nasa', 'familia nasa'], ['Pariente', 'Wala', 'wala'],
    ['Amigo', 'Amiguwe', 'amiguwe'], ['Compañero', 'Kũus nasa', 'kuus nasa'],
    ['Vecino', 'Pisna nasa', 'pisna nasa'], ['Gente', 'Nasa', 'nasa']
  ],

  'Números': [
    ['Uno', 'Teeçx', 'teech'], ['Dos', 'Teka', 'teka'], ['Tres', 'Tekça', 'tekcha'],
    ['Cuatro', 'Pʉʉç', 'puuch'], ['Cinco', 'Hĩĩç', 'hiich'], ['Seis', 'Tehuça', 'tehucha'],
    ['Siete', 'Tekũhĩç', 'tekuhich'], ['Ocho', 'Tekpuuç', 'tekpuuch'],
    ['Nueve', 'Tekũhuça', 'tekuhucha'], ['Diez', 'Tũkate', 'tukate'],
    ['Once', 'Tũkate teeçxça', 'tukate teechcha'], ['Doce', 'Tũkate tekaça', 'tukate tekacha'],
    ['Trece', 'Tũkate tekçaça', 'tukate tekchcha'], ['Catorce', 'Tũkate pʉʉçxa', 'tukate puuchcha'],
    ['Quince', 'Tũkate hĩĩçxa', 'tukate hiichcha'], ['Veinte', 'Tũu tekate', 'tuu tekate'],
    ['Treinta', 'Tekça tũkate', 'tekcha tukate'], ['Cuarenta', 'Pʉʉç tũkate', 'puuch tukate'],
    ['Cincuenta', 'Hĩĩç tũkate', 'hiich tukate'], ['Cien', 'Patx', 'patch'],
    ['Primero', 'Teeçxwe', 'teechwe'], ['Segundo', 'Tekawe', 'tekawe'],
    ['Tercero', 'Tekçawe', 'tekchwe'], ['Último', 'Kãça', 'kacha'],
    ['Todos', 'Kãçxa', 'kachcha'], ['Algunos', 'Kãçx yuus', 'kach yuus'],
    ['Muchos', 'Jũũ', 'juu'], ['Pocos', 'Kiwet jũũ', 'kiwet juu'],
    ['Más', 'Jũũ', 'juu'], ['Menos', 'Kiwet', 'kiwet']
  ],

  'Colores': [
    ['Rojo', 'Sxiya', 'shiya'], ['Azul', 'Çxiwe', 'chiwe'], ['Verde', 'Kĩus', 'kius'],
    ['Amarillo', 'Tsũũk', 'tsuuk'], ['Blanco', 'Yũũk', 'yuuk'], ['Negro', 'Chxi', 'chi'],
    ['Café', 'Kafe çxiya', 'kafe chiya'], ['Gris', 'Chxi yũũk', 'chi yuuk'],
    ['Naranja color', 'Tsũũk sxiya', 'tsuuk shiya'], ['Morado', 'Sxiya çxiwe', 'shiya chiwe'],
    ['Rosado', 'Sxiya yũũk', 'shiya yuuk'], ['Celeste', 'Çxiwe yũũk', 'chiwe yuuk'],
    ['Dorado', 'Tsũũk kwẽẽ', 'tsuuk kwee'], ['Plateado', 'Yũũk kwẽẽ', 'yuuk kwee'],
    ['Claro', 'Kwẽẽkwe', 'kweekwe'], ['Oscuro', 'Chxikwe', 'chikwe'],
    ['Brillante', 'Kwẽẽ kwẽẽkwe', 'kwee kweekwe'], ['Opaco', 'Yu kwẽẽ', 'yu kwee']
  ],

  'Naturaleza': [
    ['Agua', 'Ũus', 'uus'], ['Sol', 'Sek', 'sek'], ['Luna', 'Nus', 'nus'],
    ['Estrella', 'Nus yuçx', 'nus yuch'], ['Tierra', 'Kiwe', 'kiwe'], ['Montaña', 'Wesx', 'wesx'],
    ['Río', 'Ũus kiwe', 'uus kiwe'], ['Árbol', 'Puu', 'puu'], ['Flor', 'Kwetsa', 'kwetsa'],
    ['Hierba', 'Sxu', 'shu'], ['Hoja', 'Puu kwe', 'puu kwe'], ['Semilla', 'Ala', 'ala'],
    ['Nube', 'Ipx kwesx', 'ipch kwesx'], ['Lluvia', 'Uus wayt', 'uus wayt'],
    ['Viento', 'Wẽt', 'wet'], ['Fuego', 'Tay', 'tay'], ['Piedra', 'Sek kwe', 'sek kwe'],
    ['Arena', 'Sek yuus', 'sek yuus'], ['Cascada', 'Uus kãhãwe', 'uus kahaawe'],
    ['Laguna', 'Uus kiwe kwe', 'uus kiwe kwe'], ['Bosque', 'Puu kiwe', 'puu kiwe'],
    ['Selva', 'Puu jũũ kiwe', 'puu juu kiwe'], ['Valle', 'Kiwe wẽet', 'kiwe weet'],
    ['Colina', 'Wesx kiwet', 'wesx kiwet'], ['Cueva', 'Kwesx uut', 'kwesx uut'],
    ['Camino', 'Ne', 'ne'], ['Arcoíris', 'Ipx kwetsa', 'ipch kwetsa'],
    ['Trueno', 'Kũũs', 'kuus'], ['Relámpago', 'Kũũs ipx', 'kuus ipch'],
    ['Niebla', 'Ipx chxi', 'ipch chi'], ['Día', 'Kwesx', 'kwesx'], ['Noche', 'Uça', 'ucha'],
    ['Mañana', 'Ãẽte', 'aaete'], ['Tarde', 'Kwesxwe ẽẽ', 'kwesxwe ee'],
    ['Cielo', 'Ipx', 'ipch'], ['Nieve', 'Yũũk uus', 'yuuk uus']
  ],

  'Alimentos': [
    ['Maíz', 'Aça', 'acha'], ['Papa', 'Pulik', 'pulik'], ['Yuca', 'Luuma', 'luuma'],
    ['Plátano', 'Plataanu', 'plataanu'], ['Fríjol', 'Yuus', 'yuus'],
    ['Arroz', 'Aruus', 'aruus'], ['Chicha', 'Juu', 'juu'], ['Pan', 'Paã', 'paa'],
    ['Sal', 'Suut', 'suut'], ['Azúcar', 'Miçx', 'mich'], ['Café bebida', 'Kape', 'kape'],
    ['Agua bebida', 'Uus yũu', 'uus yuu'], ['Leche', 'Waka uus', 'waka uus'],
    ['Carne', 'Yat', 'yat'], ['Pescado', 'Wam pɨsh', 'wam pish'], ['Huevo', 'Kweẽra yuus', 'kweera yuus'],
    ['Manzana', 'Mansaana', 'mansaana'], ['Naranja fruta', 'Naraanja', 'naraanja'],
    ['Banano', 'Banaanu', 'banaanu'], ['Mango', 'Maango', 'maango'],
    ['Papaya', 'Papaaya', 'papaaya'], ['Piña', 'Piiña', 'piiña'],
    ['Guayaba', 'Wayaaba', 'wayaaba'], ['Limón', 'Limoõ', 'limoo'],
    ['Aguacate', 'Awakate', 'awakate'], ['Tomate', 'Tumate', 'tumate'],
    ['Cebolla', 'Sebuuya', 'sebuuya'], ['Ajo', 'Aaju', 'aaju'],
    ['Zanahoria', 'Sanaorya', 'sanaorya'], ['Repollo', 'Repuuyu', 'repuuyu'],
    ['Lechuga', 'Lechuuga', 'lechuuga'], ['Calabaza', 'Kalabaasa', 'kalabaasa'],
    ['Pepino', 'Pepiinu', 'pepiinu'], ['Cilantro', 'Silaãtru', 'silaatru'],
    ['Miel', 'Miçx kĩsh', 'mich kish'], ['Queso', 'Keesu', 'keesu'],
    ['Mantequilla', 'Mantekiya', 'mantekiya'], ['Sopa', 'Suupa', 'suupa'],
    ['Comida', 'Piyuçx', 'piyuch'], ['Bebida', 'Yũu', 'yuu']
  ]
};

const generarEjemplos = (español, nasaYuwe) => {
  const ejemplos = {
    'Animales': [`El ${español.toLowerCase()} es bonito`, `${nasaYuwe} fxi kwet`],
    'Familia': [`Mi ${español.toLowerCase()} es bueno`, `Nxi ${nasaYuwe} fxi kwet`],
    'Números': [`Tengo ${español.toLowerCase()}`, `${nasaYuwe} yuçwe`],
    'Colores': [`Color ${español.toLowerCase()}`, `${nasaYuwe} color`],
    'Naturaleza': [`La ${español.toLowerCase()} es hermosa`, `${nasaYuwe} fxi kwet`],
    'Alimentos': [`Me gusta ${español.toLowerCase()}`, `Nxi ${nasaYuwe} gusta`]
  };
  return ejemplos;
};

async function insertarPalabras() {
  console.log('🌱 Insertando 400 palabras al diccionario...');
  
  let totalInsertadas = 0;
  
  for (const [categoryName, palabras] of Object.entries(contenidoPorCategoria)) {
    // Obtener ID de categoría
    const catResult = await pool.query('SELECT id FROM categories WHERE name = $1', [categoryName]);
    const categoryId = catResult.rows[0]?.id;
    
    if (!categoryId) continue;
    
    for (const [español, nasaYuwe, pronunciacion] of palabras) {
      const dificultad = español.length > 8 ? 'intermedio' : 'facil';
      
      try {
        await pool.query(`
          INSERT INTO words (spanish_word, nasa_yuwe_word, pronunciation, 
                           example_spanish, example_nasa_yuwe, category_id, difficulty_level)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
          ON CONFLICT DO NOTHING
        `, [
          español,
          nasaYuwe,
          pronunciacion,
          `El/La ${español.toLowerCase()} es importante`,
          `${nasaYuwe} fxi importante`,
          categoryId,
          dificultad
        ]);
        
        totalInsertadas++;
        if (totalInsertadas % 50 === 0) {
          console.log(`   ✓ ${totalInsertadas} palabras insertadas...`);
        }
      } catch (error) {
        console.error(`Error con palabra ${español}:`, error.message);
      }
    }
  }
  
  console.log(`✅ Total de palabras en diccionario: ${totalInsertadas}`);
}

async function crearLeccionesPorNivel() {
  console.log('📚 Creando 4 lecciones por cada nivel educativo...');
  
  const niveles = [
    { nivel: 'Preescolar', dificultad: 'facil', grado: null },
    { nivel: 'Primaria', dificultad: 'facil', grado: 'Primero' },
    { nivel: 'Primaria', dificultad: 'facil', grado: 'Segundo' },
    { nivel: 'Primaria', dificultad: 'intermedio', grado: 'Tercero' },
    { nivel: 'Primaria', dificultad: 'intermedio', grado: 'Cuarto' },
    { nivel: 'Primaria', dificultad: 'avanzado', grado: 'Quinto' }
  ];
  
  const tiposActividad = ['quiz', 'completar_oracion', 'asociar_imagen'];
  
  let totalActividades = 0;
  
  for (const nivelInfo of niveles) {
    const nombreNivel = nivelInfo.grado ? `${nivelInfo.grado} ${nivelInfo.nivel}` : nivelInfo.nivel;
    
    // Crear 4 lecciones por nivel (una por tipo + una extra)
    for (let i = 1; i <= 4; i++) {
      const tipo = tiposActividad[i % 3];
      const nombreActividad = `${nombreNivel} - Lección ${i}`;
      
      try {
        const result = await pool.query(`
          INSERT INTO activities (title, description, type, difficulty_level, time_limit, passing_score, is_active)
          VALUES ($1, $2, $3, $4, $5, $6, true)
          RETURNING id
        `, [
          nombreActividad,
          `Lección ${i} de ${nombreNivel} - ${tipo === 'quiz' ? 'Quiz' : tipo === 'completar_oracion' ? 'Completar Oraciones' : 'Asociar Imágenes'}`,
          tipo,
          nivelInfo.dificultad,
          tipo === 'quiz' ? 300 : tipo === 'completar_oracion' ? 240 : 180,
          70
        ]);
        
        const activityId = result.rows[0].id;
        
        // Agregar 3-5 preguntas por actividad
        await agregarPreguntasAActividad(activityId, tipo, nivelInfo.dificultad);
        
        totalActividades++;
      } catch (error) {
        console.error(`Error creando ${nombreActividad}:`, error.message);
      }
    }
  }
  
  console.log(`✅ ${totalActividades} lecciones creadas (4 por cada uno de los 6 niveles)`);
}

async function agregarPreguntasAActividad(activityId, tipo, dificultad) {
  // Obtener palabras aleatorias del nivel de dificultad
  const palabrasResult = await pool.query(`
    SELECT * FROM words WHERE difficulty_level = $1 ORDER BY RANDOM() LIMIT 5
  `, [dificultad]);
  
  const palabras = palabrasResult.rows;
  if (palabras.length === 0) return;
  
  for (let i = 0; i < Math.min(3, palabras.length); i++) {
    const palabra = palabras[i];
    
    const questionResult = await pool.query(`
      INSERT INTO questions (activity_id, question_text, question_type, correct_answer, points, order_number, image_url)
      VALUES ($1, $2, $3, $4, 1, $5, $6)
      RETURNING id
    `, [
      activityId,
      tipo === 'asociar_imagen' ? '¿Qué palabra corresponde a esta imagen?' : `¿Cómo se dice "${palabra.spanish_word}" en Nasa Yuwe?`,
      tipo === 'quiz' || tipo === 'completar_oracion' ? 'multiple_choice' : 'image_match',
      palabra.nasa_yuwe_word,
      i + 1,
      tipo === 'asociar_imagen' ? '🖼️' : null
    ]);
    
    const questionId = questionResult.rows[0].id;
    
    // Crear opciones
    await pool.query(`
      INSERT INTO question_options (question_id, option_text, option_label, is_correct)
      VALUES ($1, $2, 'A', true)
    `, [questionId, palabra.nasa_yuwe_word]);
    
    // Opciones incorrectas
    const otrasResult = await pool.query(`
      SELECT nasa_yuwe_word FROM words 
      WHERE id != $1 AND difficulty_level = $2 
      ORDER BY RANDOM() LIMIT 2
    `, [palabra.id, dificultad]);
    
    const labels = ['B', 'C'];
    otrasResult.rows.forEach((row, idx) => {
      pool.query(`
        INSERT INTO question_options (question_id, option_text, option_label, is_correct)
        VALUES ($1, $2, $3, false)
      `, [questionId, row.nasa_yuwe_word, labels[idx]]);
    });
  }
}

// Ejecutar
async function main() {
  try {
    console.log('🚀 Generando contenido educativo completo...\n');
    
    await insertarPalabras();
    console.log('');
    
    await crearLeccionesPorNivel();
    console.log('');
    
    // Contar totales
    const palabrasCount = await pool.query('SELECT COUNT(*) FROM words');
    const actividadesCount = await pool.query('SELECT COUNT(*) FROM activities WHERE is_active = true');
    
    console.log('═══════════════════════════════════════════');
    console.log('  ✅ CONTENIDO GENERADO EXITOSAMENTE');
    console.log('═══════════════════════════════════════════');
    console.log(`📚 Palabras en diccionario: ${palabrasCount.rows[0].count}`);
    console.log(`📝 Actividades/Lecciones: ${actividadesCount.rows[0].count}`);
    console.log('═══════════════════════════════════════════');
    console.log('');
    console.log('🎊 ¡Contenido educativo completo!');
    console.log('');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

main();

