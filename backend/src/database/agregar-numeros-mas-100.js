import pool from '../config/database.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Script para agregar números mayores a 100
 */

// Mapeo de números mayores a 100
const numerosGrandes = [
  { numero: 101, spanish: 'Ciento uno', nasa: 'Patxa teeçx', archivo: '101.png' },
  { numero: 102, spanish: 'Ciento dos', nasa: 'Patxa teka', archivo: '102.png' },
  { numero: 110, spanish: 'Ciento diez', nasa: 'Patxa tees', archivo: '110.png' },
  { numero: 112, spanish: 'Ciento doce', nasa: 'Patxa tees teka', archivo: 'ciento doce.webp' },
  { numero: 120, spanish: 'Ciento veinte', nasa: 'Patxa teka teeswe', archivo: '120.png' },
  { numero: 200, spanish: 'Doscientos', nasa: 'Teka patxa', archivo: '200.png' },
  { numero: 300, spanish: 'Trescientos', nasa: 'Tekça patxa', archivo: '300.png' },
  { numero: 400, spanish: 'Cuatrocientos', nasa: 'Taksa patxa', archivo: '400.png' },
  { numero: 500, spanish: 'Quinientos', nasa: 'Tehça patxa', archivo: '500.png' },
  { numero: 1000, spanish: 'Mil', nasa: 'Tʉũ patxa', archivo: '1000.png' },
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

async function generarAudio(text, filename, tipo = 'es') {
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

async function agregarNumerosGrandes() {
  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('  🔢 AGREGANDO NÚMEROS MAYORES A 100');
  console.log('═══════════════════════════════════════════════════════════════\n');

  const imagenesDir = path.join(__dirname, '../../public/images');
  
  // Obtener ID de la categoría Números
  const categoryResult = await pool.query(
    "SELECT id FROM categories WHERE name = 'Números'"
  );

  if (categoryResult.rows.length === 0) {
    console.error('❌ Categoría "Números" no encontrada');
    process.exit(1);
  }

  const categoryId = categoryResult.rows[0].id;

  let agregados = 0;
  let errores = 0;

  for (const num of numerosGrandes) {
    const imagePath = path.join(imagenesDir, num.archivo);
    
    if (!fs.existsSync(imagePath)) {
      console.log(`⚠️ Imagen no encontrada: ${num.archivo}`);
      continue;
    }

    const imageUrl = `/images/${num.archivo}`;
    const pronunciation = generarPronunciacion(num.nasa);
    const exampleEs = `El número ${num.spanish.toLowerCase()} es importante`;
    const exampleNasa = `${num.nasa} fxi importante`;

    try {
      // Verificar si ya existe
      const existe = await pool.query(
        'SELECT id FROM words WHERE spanish_word = $1',
        [num.spanish]
      );

      if (existe.rows.length > 0) {
        console.log(`   ℹ️ ${num.spanish} ya existe en la BD`);
        continue;
      }

      // Insertar palabra
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

      const wordId = result.rows[0].id;

      console.log(`✅ ${num.spanish} (${num.nasa})`);
      console.log(`   📸 Imagen: ${num.archivo}`);
      console.log(`   📢 /${pronunciation}/`);

      // Generar audios
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const audioEsFilename = `es_${wordId.replace(/-/g, '_').substring(0, 20)}.mp3`;
        const audioEs = await generarAudio(num.spanish, audioEsFilename);
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const audioNasaFilename = `nasa_${wordId.replace(/-/g, '_').substring(0, 20)}.mp3`;
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
        console.log(`   ⚠️ Error generando audios: ${audioError.message}\n`);
      }

      agregados++;

    } catch (error) {
      console.error(`❌ Error con ${num.spanish}: ${error.message}`);
      errores++;
    }
  }

  console.log('═══════════════════════════════════════════════════════════════');
  console.log('  📊 RESUMEN');
  console.log('═══════════════════════════════════════════════════════════════\n');
  console.log(`   ✅ Números agregados: ${agregados}`);
  console.log(`   ❌ Errores: ${errores}`);

  const stats = await pool.query(`
    SELECT COUNT(*) as total FROM words WHERE category_id = $1
  `, [categoryId]);

  console.log(`\n   📚 Total números en el diccionario: ${stats.rows[0].total}`);
  console.log('\n═══════════════════════════════════════════════════════════════\n');

  await pool.end();
  process.exit(0);
}

// Ejecutar
agregarNumerosGrandes().catch(error => {
  console.error('❌ Error:', error);
  process.exit(1);
});

