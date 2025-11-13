import pool from '../config/database.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Genera audio de la palabra en Nasa Yuwe usando Google TTS
 * Aunque no es pronunciación perfecta, ayuda a los estudiantes
 */
async function generarAudioNasaYuwe(nasaText, wordId) {
  const audioDir = path.join(__dirname, '../../public/audio');
  
  if (!fs.existsSync(audioDir)) {
    fs.mkdirSync(audioDir, { recursive: true });
  }

  const filename = `nasa_${wordId.replace(/-/g, '_').substring(0, 20)}.mp3`;
  const outputPath = path.join(audioDir, filename);

  // Limpiar caracteres especiales de Nasa Yuwe para mejor pronunciación
  const textLimpio = nasaText
    .replace(/ʉ/g, 'u')
    .replace(/ɨ/g, 'i')
    .replace(/ũ/g, 'un')
    .replace(/ẽ/g, 'en')
    .replace(/ĩ/g, 'in')
    .replace(/ç/g, 'ch')
    .replace(/ʉ/g, 'u')
    .replace(/'/g, '')
    .replace(/'/g, '');

  const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=es&client=tw-ob&q=${encodeURIComponent(textLimpio)}`;

  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(outputPath);

    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://translate.google.com/',
        'Accept': 'audio/mpeg'
      }
    }, (response) => {
      if (response.statusCode !== 200) {
        if (fs.existsSync(outputPath)) {
          fs.unlinkSync(outputPath);
        }
        reject(new Error(`HTTP ${response.statusCode}`));
        return;
      }

      response.pipe(file);

      file.on('finish', () => {
        file.close();
        resolve(`/audio/${filename}`);
      });

      file.on('error', (err) => {
        if (fs.existsSync(outputPath)) {
          fs.unlinkSync(outputPath);
        }
        reject(err);
      });
    }).on('error', (err) => {
      if (fs.existsSync(outputPath)) {
        fs.unlinkSync(outputPath);
      }
      reject(err);
    });
  });
}

async function generarTodosAudiosNasa() {
  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('  🔊 GENERANDO AUDIOS EN NASA YUWE');
  console.log('═══════════════════════════════════════════════════════════════\n');
  console.log('  ℹ️ Usando TTS español para leer palabras Nasa Yuwe');
  console.log('  ℹ️ La pronunciación es aproximada, no perfecta\n');
  console.log('═══════════════════════════════════════════════════════════════\n');

  try {
    // Primero, agregar la columna si no existe
    await pool.query(`
      ALTER TABLE words 
      ADD COLUMN IF NOT EXISTS audio_nasa_yuwe VARCHAR(500)
    `);

    // Obtener todas las palabras
    const result = await pool.query(`
      SELECT id, spanish_word, nasa_yuwe_word
      FROM words
      ORDER BY spanish_word
    `);

    console.log(`📚 Generando audios para ${result.rows.length} palabras...\n`);
    console.log(`⏱️ Tiempo estimado: ~${Math.ceil(result.rows.length * 1.2 / 60)} minutos\n`);

    let generados = 0;
    let errores = 0;

    for (let i = 0; i < result.rows.length; i++) {
      const word = result.rows[i];
      
      try {
        const audioUrl = await generarAudioNasaYuwe(word.nasa_yuwe_word, word.id);

        // Actualizar la BD con el audio de Nasa Yuwe
        await pool.query(
          'UPDATE words SET audio_nasa_yuwe = $1 WHERE id = $2',
          [audioUrl, word.id]
        );

        console.log(`✅ [${(i + 1).toString().padStart(3, ' ')}/${result.rows.length}] ${word.spanish_word.padEnd(25)} → ${word.nasa_yuwe_word.padEnd(25)} → Audio generado`);
        generados++;

        // Esperar 1 segundo entre cada audio
        if (i < result.rows.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }

      } catch (error) {
        console.log(`❌ [${(i + 1).toString().padStart(3, ' ')}/${result.rows.length}] ${word.spanish_word.padEnd(25)} → Error: ${error.message}`);
        errores++;
        await new Promise(resolve => setTimeout(resolve, 2000));
      }

      // Mostrar progreso cada 50 palabras
      if ((i + 1) % 50 === 0) {
        console.log(`\n   📊 Progreso: ${i + 1}/${result.rows.length} (${Math.round((i + 1) / result.rows.length * 100)}%)\n`);
      }
    }

    console.log('\n═══════════════════════════════════════════════════════════════');
    console.log('  📊 RESUMEN FINAL');
    console.log('═══════════════════════════════════════════════════════════════\n');
    console.log(`   ✅ Audios generados: ${generados}`);
    console.log(`   ❌ Errores: ${errores}`);

    const statsResult = await pool.query(`
      SELECT 
        COUNT(*) as total,
        COUNT(audio_url) as con_audio_espanol,
        COUNT(audio_nasa_yuwe) as con_audio_nasa
      FROM words
    `);

    const stats = statsResult.rows[0];

    console.log(`\n   📚 Total palabras: ${stats.total}`);
    console.log(`   🔊 Con audio español: ${stats.con_audio_espanol}`);
    console.log(`   🔊 Con audio Nasa Yuwe: ${stats.con_audio_nasa}`);
    console.log(`   📊 Porcentaje: ${Math.round(stats.con_audio_nasa / stats.total * 100)}%`);

    console.log('\n═══════════════════════════════════════════════════════════════');
    console.log('  ⚠️ IMPORTANTE');
    console.log('═══════════════════════════════════════════════════════════════\n');
    console.log('   Estos audios son una APROXIMACIÓN usando TTS español.');
    console.log('   Para mejor calidad, considera grabar con hablantes nativos.\n');
    console.log('   Consulta: 📚-GUIA-AUDIOS-NASA-YUWE.md\n');
    console.log('═══════════════════════════════════════════════════════════════\n');

    await pool.end();
    process.exit(0);

  } catch (error) {
    console.error('\n❌ Error:', error);
    await pool.end();
    process.exit(1);
  }
}

// Ejecutar
generarTodosAudiosNasa();

