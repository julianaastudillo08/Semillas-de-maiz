import pool from '../config/database.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function agregarFaltantes() {
  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('  📸 AGREGANDO IMÁGENES FALTANTES');
  console.log('═══════════════════════════════════════════════════════════════\n');

  const imagenesDir = path.join(__dirname, '../../public/images');

  // Mapeo de imágenes duplicadas a las palabras existentes
  const mapeoImagenesAdicionales = [
    // Frutas duplicadas (versión sin acento ya existe)
    { archivo: 'atun.png', palabra: 'Atún' },
    { archivo: 'tucan.png', palabra: 'Tucán' },
    { archivo: 'cangrejo.png', palabra: 'Cangrejo' },
    { archivo: 'cereza.png', palabra: 'Cereza' },
    { archivo: 'coco.png', palabra: 'Coco' },
    { archivo: 'durazno.png', palabra: 'Durazno' },
    { archivo: 'fresa.png', palabra: 'Fresa' },
    { archivo: 'guayaba.png', palabra: 'Guayaba' },
    { archivo: 'limon.jpg', palabra: 'Limón' },
    { archivo: 'mandarina.png', palabra: 'Mandarina' },
    { archivo: 'mango.png', palabra: 'Mango' },
    { archivo: 'maracuya.png', palabra: 'Maracuyá' },
    { archivo: 'melon.png', palabra: 'Melón' },
    { archivo: 'naranja.png', palabra: 'Naranja' },
    { archivo: 'novios.png', palabra: 'Novios' },
    { archivo: 'papaya.png', palabra: 'Papaya' },
    { archivo: 'pina.png', palabra: 'Piña' },
    { archivo: 'sandia.png', palabra: 'Sandía' },
  ];

  let agregadas = 0;
  let actualizadas = 0;

  for (const item of mapeoImagenesAdicionales) {
    const imagePath = path.join(imagenesDir, item.archivo);
    
    if (!fs.existsSync(imagePath)) {
      console.log(`⚠️ Imagen no encontrada: ${item.archivo}`);
      continue;
    }

    const imageUrl = `/images/${item.archivo}`;

    // Verificar si la palabra existe
    const existe = await pool.query(
      'SELECT id, image_url FROM words WHERE spanish_word = $1',
      [item.palabra]
    );

    if (existe.rows.length > 0) {
      // La palabra existe, pero puede tener otra imagen
      // Agregar esta como imagen alternativa o actualizar si no tiene
      const wordId = existe.rows[0].id;
      const currentImage = existe.rows[0].image_url;

      if (!currentImage) {
        // No tiene imagen, agregar esta
        await pool.query(
          'UPDATE words SET image_url = $1 WHERE id = $2',
          [imageUrl, wordId]
        );
        console.log(`✅ Imagen agregada: ${item.palabra} → ${item.archivo}`);
        agregadas++;
      } else {
        console.log(`   ℹ️ ${item.palabra} ya tiene imagen: ${currentImage.replace('/images/', '')}`);
        console.log(`      Imagen alternativa disponible: ${item.archivo}`);
        actualizadas++;
      }
    } else {
      console.log(`⚠️ Palabra no encontrada en BD: ${item.palabra}`);
    }
  }

  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('  📊 RESUMEN');
  console.log('═══════════════════════════════════════════════════════════════\n');
  console.log(`   ✅ Imágenes agregadas: ${agregadas}`);
  console.log(`   ℹ️ Imágenes alternativas: ${actualizadas}`);

  // Estadísticas finales
  const stats = await pool.query(`
    SELECT COUNT(*) as total, 
           COUNT(image_url) as con_imagen,
           COUNT(pronunciation) as con_pronunciacion
    FROM words
  `);

  const final = stats.rows[0];

  console.log(`\n   📚 Total palabras: ${final.total}`);
  console.log(`   ✅ Con imagen: ${final.con_imagen}`);
  console.log(`   ✅ Con pronunciación: ${final.con_pronunciacion}`);

  console.log('\n═══════════════════════════════════════════════════════════════\n');

  await pool.end();
  process.exit(0);
}

// Ejecutar
agregarFaltantes();

