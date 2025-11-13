import pool from '../config/database.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Genera audios en español usando Google TTS
 */

async function generarAudio(text, filename) {
  return new Promise((resolve, reject) => {
    const audioDir = path.join(__dirname, '../../public/audio');
    
    // Crear directorio si no existe
    if (!fs.existsSync(audioDir)) {
      fs.mkdirSync(audioDir, { recursive: true });
      console.log('📁 Carpeta audio creada\n');
    }

    const outputPath = path.join(audioDir, filename);

    // Usar la API gratuita de Google Translate TTS
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=es&client=tw-ob&q=${encodeURIComponent(text)}`;

    const file = fs.createWriteStream(outputPath);

    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'Referer': 'https://translate.google.com/'
      }
    }, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`HTTP ${response.statusCode}`));
        return;
      }

      response.pipe(file);

      file.on('finish', () => {
        file.close();
        resolve(`/audio/${filename}`);
      });

      file.on('error', (err) => {
        fs.unlinkSync(outputPath);
        reject(err);
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

async function generarTodosLosAudios() {
  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('  🔊 GENERANDO AUDIOS EN ESPAÑOL');
  console.log('═══════════════════════════════════════════════════════════════\n');

  try {
    // Obtener todas las palabras
    const result = await pool.query(`
      SELECT id, spanish_word, audio_url
      FROM words
      ORDER BY spanish_word
      LIMIT 50
    `);

    console.log(`📚 Generando audios para ${result.rows.length} palabras...\n`);
    console.log('⏱️ Esto tomará aproximadamente ${Math.ceil(result.rows.length * 0.7)} segundos\n');

    let generados = 0;
    let errores = 0;

    for (let i = 0; i < result.rows.length; i++) {
      const word = result.rows[i];
      
      try {
        const audioFilename = `es_${word.id.replace(/-/g, '')}.mp3`;
        const audioUrl = await generarAudio(word.spanish_word, audioFilename);

        // Actualizar la BD
        await pool.query(
          'UPDATE words SET audio_url = $1 WHERE id = $2',
          [audioUrl, word.id]
        );

        console.log(`✅ [${i + 1}/${result.rows.length}] ${word.spanish_word.padEnd(25)} → ${audioFilename}`);
        generados++;

        // Esperar 700ms entre cada audio para no saturar
        await new Promise(resolve => setTimeout(resolve, 700));

      } catch (error) {
        console.log(`❌ [${i + 1}/${result.rows.length}] ${word.spanish_word.padEnd(25)} → Error: ${error.message}`);
        errores++;
      }
    }

    console.log('\n═══════════════════════════════════════════════════════════════');
    console.log('  📊 RESUMEN');
    console.log('═══════════════════════════════════════════════════════════════\n');
    console.log(`   ✅ Audios generados: ${generados}`);
    console.log(`   ❌ Errores: ${errores}`);

    const statsResult = await pool.query(`
      SELECT COUNT(*) as total,
             COUNT(audio_url) as con_audio
      FROM words
    `);

    console.log(`\n   📚 Total palabras: ${statsResult.rows[0].total}`);
    console.log(`   🔊 Con audio: ${statsResult.rows[0].con_audio}`);

    console.log('\n═══════════════════════════════════════════════════════════════');
    console.log('  💡 NOTA SOBRE AUDIOS EN NASA YUWE');
    console.log('═══════════════════════════════════════════════════════════════\n');
    console.log('   Los audios en Nasa Yuwe deben grabarse manualmente porque');
    console.log('   no existe un servicio de text-to-speech para este idioma.\n');
    console.log('   Recursos recomendados para grabar:');
    console.log('   • https://kwesxyuwe.com/vocales.html (pronunciación)');
    console.log('   • SoundCloud Nasa Yuwe (ejemplos)');
    console.log('   • Grabar con hablantes nativos\n');
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
generarTodosLosAudios();

