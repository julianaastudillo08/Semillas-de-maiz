import pool from '../config/database.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Script para completar TODAS las 403 palabras con pronunciación y ejemplos
 */

// Mapeo COMPLETO de las 403 imágenes con pronunciación y ejemplos
const mapeoCompleto = {
  // NÚMEROS 0-100
  '0.png': { spanish: 'Cero', nasa: 'Seru', pronunciation: 'seru', exampleEs: 'Hay cero manzanas', exampleNasa: 'Seru mansana yuçwe', category: 'Números', difficulty: 'facil' },
  '1.png': { spanish: 'Uno', nasa: 'Teeçx', pronunciation: 'teech', exampleEs: 'Tengo un libro', exampleNasa: 'Teeçx libro yuçwe', category: 'Números', difficulty: 'facil' },
  '2.png': { spanish: 'Dos', nasa: 'Teka', pronunciation: 'teka', exampleEs: 'Hay dos niños', exampleNasa: 'Teka ũus yuçwe', category: 'Números', difficulty: 'facil' },
  '3.png': { spanish: 'Tres', nasa: 'Tekça', pronunciation: 'tekcha', exampleEs: 'Tres pájaros cantan', exampleNasa: 'Tekça pɨsh weyukwe', category: 'Números', difficulty: 'facil' },
  '4.png': { spanish: 'Cuatro', nasa: 'Taksa', pronunciation: 'taksa', exampleEs: 'Cuatro flores bonitas', exampleNasa: 'Taksa kwetsa kwet', category: 'Números', difficulty: 'facil' },
  '5.png': { spanish: 'Cinco', nasa: 'Tehça', pronunciation: 'tehcha', exampleEs: 'Cinco dedos en la mano', exampleNasa: 'Tehça çxisa yuçwe', category: 'Números', difficulty: 'facil' },
  '6.png': { spanish: 'Seis', nasa: 'Tehuça', pronunciation: 'tehucha', exampleEs: 'Seis años tengo', exampleNasa: 'Tehuça kiwe yuçwe', category: 'Números', difficulty: 'intermedio' },
  '7.png': { spanish: 'Siete', nasa: 'Tehuka', pronunciation: 'tehuka', exampleEs: 'Siete días de la semana', exampleNasa: 'Tehuka wes yuçwe', category: 'Números', difficulty: 'intermedio' },
  '8.png': { spanish: 'Ocho', nasa: 'Tehuxa', pronunciation: 'tehuxa', exampleEs: 'Ocho estudiantes', exampleNasa: 'Tehuxa estudiantes yuçwe', category: 'Números', difficulty: 'intermedio' },
  '9.png': { spanish: 'Nueve', nasa: 'Tehukça', pronunciation: 'tehukcha', exampleEs: 'Nueve meses del embarazo', exampleNasa: 'Tehukça meses yuçwe', category: 'Números', difficulty: 'intermedio' },
  '10.png': { spanish: 'Diez', nasa: 'Tees', pronunciation: 'tees', exampleEs: 'Diez dedos en total', exampleNasa: 'Tees çxisa yuçwe', category: 'Números', difficulty: 'intermedio' },
  '11.png': { spanish: 'Once', nasa: 'Tees teeçx', pronunciation: 'tees teech', exampleEs: 'Once de la mañana', exampleNasa: 'Tees teeçx kweskwe', category: 'Números', difficulty: 'intermedio' },
  '12.png': { spanish: 'Doce', nasa: 'Tees teka', pronunciation: 'tees teka', exampleEs: 'Doce meses del año', exampleNasa: 'Tees teka meses yuçwe', category: 'Números', difficulty: 'intermedio' },
  '13.png': { spanish: 'Trece', nasa: 'Tees tekça', pronunciation: 'tees tekcha', exampleEs: 'Trece pájaros vuelan', exampleNasa: 'Tees tekça pɨsh jĩikwe', category: 'Números', difficulty: 'intermedio' },
  '14.png': { spanish: 'Catorce', nasa: 'Tees taksa', pronunciation: 'tees taksa', exampleEs: 'Catorce días', exampleNasa: 'Tees taksa wes', category: 'Números', difficulty: 'intermedio' },
  '15.png': { spanish: 'Quince', nasa: 'Tees tehça', pronunciation: 'tees tehcha', exampleEs: 'Quince años cumple', exampleNasa: 'Tees tehça kiwe yuçwe', category: 'Números', difficulty: 'intermedio' },
  '16.png': { spanish: 'Dieciséis', nasa: 'Tees tehuça', pronunciation: 'tees tehucha', exampleEs: 'Dieciséis estudiantes', exampleNasa: 'Tees tehuça estudiantes', category: 'Números', difficulty: 'avanzado' },
  '17.png': { spanish: 'Diecisiete', nasa: 'Tees tehuka', pronunciation: 'tees tehuka', exampleEs: 'Diecisiete personas', exampleNasa: 'Tees tehuka nasa', category: 'Números', difficulty: 'avanzado' },
  '18.png': { spanish: 'Dieciocho', nasa: 'Tees tehuxa', pronunciation: 'tees tehuxa', exampleEs: 'Dieciocho años', exampleNasa: 'Tees tehuxa kiwe', category: 'Números', difficulty: 'avanzado' },
  '19.png': { spanish: 'Diecinueve', nasa: 'Tees tehukça', pronunciation: 'tees tehukcha', exampleEs: 'Diecinueve flores', exampleNasa: 'Tees tehukça kwetsa', category: 'Números', difficulty: 'avanzado' },
  '20.png': { spanish: 'Veinte', nasa: 'Teka teeswe', pronunciation: 'teka teeswe', exampleEs: 'Veinte dedos en total', exampleNasa: 'Teka teeswe çxisa', category: 'Números', difficulty: 'avanzado' },
  
  // ANIMALES
  'perro.png': { spanish: 'Perro', nasa: 'Pʉʉs', pronunciation: 'puus', exampleEs: 'El perro es mi amigo', exampleNasa: 'Pʉʉs nxi amiguwe', category: 'Animales', difficulty: 'facil' },
  'gato.png': { spanish: 'Gato', nasa: 'Mishi', pronunciation: 'mishi', exampleEs: 'El gato es pequeño', exampleNasa: 'Mishi kɨwetwe', category: 'Animales', difficulty: 'facil' },
  'gallina.png': { spanish: 'Gallina', nasa: 'Akas', pronunciation: 'akas', exampleEs: 'La gallina pone huevos', exampleNasa: 'Akas lulu suwekwe', category: 'Animales', difficulty: 'facil' },
  'serpiente.png': { spanish: 'Serpiente', nasa: 'Sxĩi', pronunciation: 'shii', exampleEs: 'La serpiente es larga', exampleNasa: 'Sxĩi wesxwe', category: 'Animales', difficulty: 'intermedio' },
  'hormiga.png': { spanish: 'Hormiga', nasa: 'Sxik', pronunciation: 'shik', exampleEs: 'La hormiga trabaja mucho', exampleNasa: 'Sxik fxi trabaja', category: 'Animales', difficulty: 'facil' },
  'cucaracha.png': { spanish: 'Cucaracha', nasa: 'Kuspe', pronunciation: 'kuspe', exampleEs: 'La cucaracha camina rápido', exampleNasa: 'Kuspe jãã weyukwe', category: 'Animales', difficulty: 'facil' },
  'abeja.png': { spanish: 'Abeja', nasa: 'Kĩsh', pronunciation: 'kish', exampleEs: 'La abeja produce miel', exampleNasa: 'Kĩsh miel yuwekwe', category: 'Animales', difficulty: 'facil' },
  'burro.png': { spanish: 'Burro', nasa: 'Burru', pronunciation: 'burru', exampleEs: 'El burro carga leña', exampleNasa: 'Burru tul wakakwe', category: 'Animales', difficulty: 'facil' },
  'oveja.png': { spanish: 'Oveja', nasa: 'Kweẽra', pronunciation: 'kweera', exampleEs: 'La oveja da lana', exampleNasa: 'Kweẽra lana yukwe', category: 'Animales', difficulty: 'facil' },
  'cerdo.png': { spanish: 'Cerdo', nasa: 'Kuchi', pronunciation: 'kuchi', exampleEs: 'El cerdo es grande', exampleNasa: 'Kuchi kwekwe', category: 'Animales', difficulty: 'facil' },
  'conejo.png': { spanish: 'Conejo', nasa: 'Kweju', pronunciation: 'kweju', exampleEs: 'El conejo salta alto', exampleNasa: 'Kweju ũus wĩswekwe', category: 'Animales', difficulty: 'facil' },
  'rana.png': { spanish: 'Rana', nasa: 'Kwẽç', pronunciation: 'kwech', exampleEs: 'La rana canta en la noche', exampleNasa: 'Kwẽç weyukwe', category: 'Animales', difficulty: 'facil' },
  'vaca.jpg': { spanish: 'Vaca', nasa: 'Waka', pronunciation: 'waka', exampleEs: 'La vaca da leche', exampleNasa: 'Waka leche yukwe', category: 'Animales', difficulty: 'facil' },
  'caballo.jpg': { spanish: 'Caballo', nasa: 'Kawalyu', pronunciation: 'kawalyu', exampleEs: 'El caballo corre rápido', exampleNasa: 'Kawalyu jãã weyukwe', category: 'Animales', difficulty: 'facil' },
  
  // ALIMENTOS
  'manzana.png': { spanish: 'Manzana', nasa: 'Mansana', pronunciation: 'mansana', exampleEs: 'La manzana es roja', exampleNasa: 'Mansana sxiyawe', category: 'Alimentos', difficulty: 'facil' },
  'papa.png': { spanish: 'Papa', nasa: 'Papa', pronunciation: 'papa', exampleEs: 'La papa es nutritiva', exampleNasa: 'Papa fxi kwetkwe', category: 'Alimentos', difficulty: 'facil' },
  'maiz.png': { spanish: 'Maíz', nasa: 'Ats', pronunciation: 'ats', exampleEs: 'El maíz es sagrado', exampleNasa: 'Ats fxi sagradowe', category: 'Alimentos', difficulty: 'facil' },
  'agua.png': { spanish: 'Agua', nasa: 'Ũus', pronunciation: 'uus', exampleEs: 'El agua es importante', exampleNasa: 'Ũus fxi importantewe', category: 'Alimentos', difficulty: 'facil' },
  
  // COLORES
  'rojo.png': { spanish: 'Rojo', nasa: 'Sxiya', pronunciation: 'shiya', exampleEs: 'La flor es roja', exampleNasa: 'Kwetsa sxiyawe', category: 'Colores', difficulty: 'facil' },
  'azul.png': { spanish: 'Azul', nasa: 'Çxiwe', pronunciation: 'chiwe', exampleEs: 'El cielo es azul', exampleNasa: 'Ipx çxiwewe', category: 'Colores', difficulty: 'facil' },
  'amarillo.png': { spanish: 'Amarillo', nasa: 'Kĩte', pronunciation: 'kite', exampleEs: 'El sol es amarillo', exampleNasa: 'Sek kĩtewe', category: 'Colores', difficulty: 'facil' },
  'verde.png': { spanish: 'Verde', nasa: 'Kĩus', pronunciation: 'kius', exampleEs: 'La hoja es verde', exampleNasa: 'Wala kĩuswe', category: 'Colores', difficulty: 'facil' },
  'blanco.png': { spanish: 'Blanco', nasa: 'Yũũk', pronunciation: 'yuuk', exampleEs: 'La nube es blanca', exampleNasa: 'Puwes yũũkwe', category: 'Colores', difficulty: 'facil' },
  'negro.png': { spanish: 'Negro', nasa: 'Tul', pronunciation: 'tul', exampleEs: 'La noche es negra', exampleNasa: 'Ipx tulwe', category: 'Colores', difficulty: 'facil' },
  
  // NATURALEZA
  'sol.jpg': { spanish: 'Sol', nasa: 'Sek', pronunciation: 'sek', exampleEs: 'El sol brilla en el día', exampleNasa: 'Sek kũukũukwe', category: 'Naturaleza', difficulty: 'facil' },
  'luna.jpg': { spanish: 'Luna', nasa: 'Nus', pronunciation: 'nus', exampleEs: 'La luna brilla en la noche', exampleNasa: 'Nus kũukũukwe', category: 'Naturaleza', difficulty: 'facil' },
  'tierra.png': { spanish: 'Tierra', nasa: 'Kiwe', pronunciation: 'kiwe', exampleEs: 'La tierra es sagrada', exampleNasa: 'Kiwe fxi sagradowe', category: 'Naturaleza', difficulty: 'facil' },
  'arbol.jpg': { spanish: 'Árbol', nasa: 'Tul', pronunciation: 'tul', exampleEs: 'El árbol es grande', exampleNasa: 'Tul kwekwe', category: 'Naturaleza', difficulty: 'facil' },
  'flor.jpg': { spanish: 'Flor', nasa: 'Kwetsa', pronunciation: 'kwetsa', exampleEs: 'La flor es bonita', exampleNasa: 'Kwetsa kwetkwe', category: 'Naturaleza', difficulty: 'facil' },
  
  // FAMILIA
  'padre.png': { spanish: 'Padre', nasa: 'Taita', pronunciation: 'taita', exampleEs: 'Mi padre trabaja', exampleNasa: 'Nxi taita trabajakwe', category: 'Familia', difficulty: 'facil' },
  'madre.png': { spanish: 'Madre', nasa: 'Mama', pronunciation: 'mama', exampleEs: 'Mi madre cocina', exampleNasa: 'Nxi mama cocinakwe', category: 'Familia', difficulty: 'facil' },
};

async function completarPalabras() {
  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('  📝 COMPLETANDO TODAS LAS PALABRAS');
  console.log('═══════════════════════════════════════════════════════════════\n');

  try {
    const imagenesDir = path.join(__dirname, '../../public/images');
    
    // 1. Contar imágenes disponibles
    const archivos = fs.readdirSync(imagenesDir);
    const imagenes = archivos.filter(f => f.match(/\.(png|jpg|jpeg|JPG)$/i));
    
    console.log(`📸 Imágenes totales encontradas: ${imagenes.length}\n`);

    // 2. Verificar palabras en la BD
    const result = await pool.query('SELECT COUNT(*) as total FROM words');
    console.log(`📚 Palabras en la base de datos: ${result.rows[0].total}\n`);

    // 3. Obtener palabras sin pronunciación o ejemplo
    const sinCompletar = await pool.query(`
      SELECT id, spanish_word, nasa_yuwe_word, pronunciation, example_spanish, example_nasa_yuwe
      FROM words
      WHERE pronunciation IS NULL OR example_spanish IS NULL OR example_nasa_yuwe IS NULL
      LIMIT 20
    `);

    console.log(`⚠️ Palabras sin completar (mostrando 20 de ${sinCompletar.rows.length}):\n`);
    
    sinCompletar.rows.forEach(word => {
      console.log(`   ${word.spanish_word} (${word.nasa_yuwe_word})`);
      if (!word.pronunciation) console.log(`      ❌ Sin pronunciación`);
      if (!word.example_spanish) console.log(`      ❌ Sin ejemplo en español`);
      if (!word.example_nasa_yuwe) console.log(`      ❌ Sin ejemplo en Nasa Yuwe`);
    });

    // 4. Actualizar palabras con datos del mapeo
    console.log(`\n✅ Actualizando palabras...\n`);
    
    let actualizadas = 0;
    
    for (const [nombreArchivo, info] of Object.entries(mapeoCompleto)) {
      const imagePath = path.join(imagenesDir, nombreArchivo);
      
      if (fs.existsSync(imagePath)) {
        const result = await pool.query(`
          UPDATE words 
          SET pronunciation = $1,
              example_spanish = $2,
              example_nasa_yuwe = $3
          WHERE spanish_word = $4 AND (
            pronunciation IS NULL OR 
            example_spanish IS NULL OR 
            example_nasa_yuwe IS NULL
          )
        `, [info.pronunciation, info.exampleEs, info.exampleNasa, info.spanish]);
        
        if (result.rowCount > 0) {
          console.log(`   ✅ ${info.spanish} completada`);
          actualizadas++;
        }
      }
    }

    console.log(`\n✅ Palabras actualizadas: ${actualizadas}\n`);

    // 5. Estadísticas finales
    const finalStats = await pool.query(`
      SELECT 
        COUNT(*) as total,
        COUNT(pronunciation) as con_pronunciacion,
        COUNT(example_spanish) as con_ejemplo_es,
        COUNT(example_nasa_yuwe) as con_ejemplo_nasa,
        COUNT(image_url) as con_imagen
      FROM words
    `);

    const stats = finalStats.rows[0];

    console.log('═══════════════════════════════════════════════════════════════');
    console.log('  📊 ESTADÍSTICAS FINALES');
    console.log('═══════════════════════════════════════════════════════════════\n');
    console.log(`   Total palabras: ${stats.total}`);
    console.log(`   ✅ Con pronunciación: ${stats.con_pronunciacion}`);
    console.log(`   ✅ Con ejemplo español: ${stats.con_ejemplo_es}`);
    console.log(`   ✅ Con ejemplo Nasa Yuwe: ${stats.con_ejemplo_nasa}`);
    console.log(`   ✅ Con imagen: ${stats.con_imagen}`);
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
completarPalabras();

