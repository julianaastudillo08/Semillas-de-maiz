import pool from '../config/database.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Mapeo completo de números 101-116
const numeros = [
  { numero: 101, spanish: 'Ciento uno', nasa: 'Patxa teeçx', imagen: 'ciento uno.png' },
  { numero: 102, spanish: 'Ciento dos', nasa: 'Patxa teka', imagen: 'ciento dos.png' },
  { numero: 103, spanish: 'Ciento tres', nasa: 'Patxa tekça', imagen: 'ciento tres.png' },
  { numero: 104, spanish: 'Ciento cuatro', nasa: 'Patxa taksa', imagen: 'ciento cuatro.png' },
  { numero: 105, spanish: 'Ciento cinco', nasa: 'Patxa tehça', imagen: 'ciento cinco.png' },
  { numero: 106, spanish: 'Ciento seis', nasa: 'Patxa tehuça', imagen: 'ciento seis.png' },
  { numero: 107, spanish: 'Ciento siete', nasa: 'Patxa tehuka', imagen: 'ciento siete.png' },
  { numero: 108, spanish: 'Ciento ocho', nasa: 'Patxa tehuxa', imagen: 'ciento ocho.png' },
  { numero: 109, spanish: 'Ciento nueve', nasa: 'Patxa tehukça', imagen: 'ciento nueve.png' },
  { numero: 110, spanish: 'Ciento diez', nasa: 'Patxa tees', imagen: 'ciento diez.png' },
  { numero: 111, spanish: 'Ciento once', nasa: 'Patxa tees teeçx', imagen: 'ciento once.png' },
  { numero: 112, spanish: 'Ciento doce', nasa: 'Patxa tees teka', imagen: 'ciento doce.webp' },
  { numero: 113, spanish: 'Ciento trece', nasa: 'Patxa tees tekça', imagen: 'ciento trece.png' },
  { numero: 114, spanish: 'Ciento catorce', nasa: 'Patxa tees taksa', imagen: 'ciento catorce.png' },
  { numero: 115, spanish: 'Ciento quince', nasa: 'Patxa tees tehça', imagen: 'ciento quince.png' },
  { numero: 116, spanish: 'Ciento dieciséis', nasa: 'Patxa tees tehuça', imagen: 'ciento dieciseis.png' },
];

function generarPronunciacion(nasaWord) {
  return nasaWord
    .toLowerCase()
    .replace(/ʉ/g, 'u')
    .replace(/ɨ/g, 'i')
    .replace(/ũ/g, 'un')
    .replace(/ẽ/g, 'en')
    .replace(/ĩ/g, 'in')
    .replace(/ç/g, 'ch')
    .replace(/'/g, '');
}

async function generarAudio(text, filename) {
  const audioDir = path.join(__dirname, '../../public/audio');
  
  if (!fs.existsSync(audioDir)) {
    fs.mkdirSync(audioDir, { recursive: true });
  }

  const outputPath = path.join(audioDir, filename);

  const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=es&client=tw-ob&q=${encodeURIComponent(text)}`;

  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(outputPath);

    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'Referer': 'https://translate.google.com/'
      }
    }, (response) => {
      if (response.statusCode !== 200) {
        if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
        reject(new Error(`HTTP ${response.statusCode}`));
        return;
      }

      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve(`/audio/${filename}`);
      });
      file.on('error', (err) => {
        if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
        reject(err);
      });
    }).on('error', (err) => {
      if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
      reject(err);
    });
  });
}

async function agregarNumeros() {
  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('  🔢 AGREGANDO NÚMEROS 101-116 CON IMÁGENES');
  console.log('═══════════════════════════════════════════════════════════════\n');

  const imagenesDir = path.join(__dirname, '../../public/images');
  
  // Obtener ID de la categoría Números
  const categoryResult = await pool.query(
    "SELECT id FROM categories WHERE name = 'Números'"
  );

  if (categoryResult.rows.length === 0) {
    console.error('❌ Categoría "Números" no encontrada');
    await pool.end();
    process.exit(1);
  }

  const categoryId = categoryResult.rows[0].id;

  let agregados = 0;
  let actualizados = 0;

  for (const num of numeros) {
    const imagePath = path.join(imagenesDir, num.imagen);
    
    if (!fs.existsSync(imagePath)) {
      console.log(`⚠️ Imagen no encontrada: ${num.imagen}`);
      continue;
    }

    const imageUrl = `/images/${num.imagen}`;
    const pronunciation = generarPronunciacion(num.nasa);
    const exampleEs = `El número ${num.spanish.toLowerCase()} viene después del cien`;
    const exampleNasa = `${num.nasa} fxi patxa wala`;

    try {
      // Verificar si ya existe
      const existe = await pool.query(
        'SELECT id, image_url FROM words WHERE spanish_word = $1',
        [num.spanish]
      );

      let wordId;

      if (existe.rows.length > 0) {
        // Ya existe, actualizar con imagen
        wordId = existe.rows[0].id;
        
        await pool.query(
          'UPDATE words SET image_url = $1 WHERE id = $2',
          [imageUrl, wordId]
        );
        
        console.log(`♻️ ${num.numero}. ${num.spanish} → Imagen actualizada`);
        actualizados++;
      } else {
        // Insertar nueva palabra
        const result = await pool.query(`
          INSERT INTO words (
            spanish_word, nasa_yuwe_word, pronunciation, 
            example_spanish, example_nasa_yuwe, 
            image_url, category_id, difficulty_level
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          RETURNING id
        `, [
          num.spanish, num.nasa, pronunciation,
          exampleEs, exampleNasa,
          imageUrl, categoryId, 'avanzado'
        ]);

        wordId = result.rows[0].id;

        console.log(`✅ ${num.numero}. ${num.spanish} (${num.nasa})`);
        console.log(`   📸 ${num.imagen}`);
        console.log(`   📢 /${pronunciation}/`);

        // Generar audios
        try {
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const audioEsFilename = `es_num_${num.numero}.mp3`;
          const audioEs = await generarAudio(num.spanish, audioEsFilename);
          
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const audioNasaFilename = `nasa_num_${num.numero}.mp3`;
          const textoNasaLimpio = num.nasa.replace(/ʉ/g, 'u').replace(/ũ/g, 'un').replace(/ç/g, 'ch');
          const audioNasa = await generarAudio(textoNasaLimpio, audioNasaFilename);

          // Actualizar con audios
          await pool.query(`
            UPDATE words 
            SET audio_url = $1, audio_nasa_yuwe = $2
            WHERE id = $3
          `, [audioEs, audioNasa, wordId]);

          console.log(`   🔊 Audios generados\n`);

        } catch (audioError) {
          console.log(`   ⚠️ Error audios: ${audioError.message}\n`);
        }

        agregados++;
      }

    } catch (error) {
      console.error(`❌ Error con ${num.spanish}: ${error.message}`);
    }
  }

  console.log('═══════════════════════════════════════════════════════════════');
  console.log('  📊 RESUMEN');
  console.log('═══════════════════════════════════════════════════════════════\n');
  console.log(`   ✅ Números nuevos agregados: ${agregados}`);
  console.log(`   ♻️ Números actualizados: ${actualizados}`);
  console.log(`   📸 Total procesado: ${agregados + actualizados}`);

  const stats = await pool.query(`
    SELECT COUNT(*) as total,
           COUNT(image_url) as con_imagen
    FROM words 
    WHERE category_id = $1
  `, [categoryId]);

  console.log(`\n   📚 Total números en diccionario: ${stats.rows[0].total}`);
  console.log(`   📸 Con imagen: ${stats.rows[0].con_imagen}`);
  console.log(`   🔊 Con audios: ${stats.rows[0].total * 2} (español + Nasa Yuwe)`);

  console.log('\n═══════════════════════════════════════════════════════════════\n');

  await pool.end();
  process.exit(0);
}

// Ejecutar
agregarNumeros().catch(error => {
  console.error('❌ Error:', error);
  process.exit(1);
});

