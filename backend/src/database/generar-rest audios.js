import pool from '../config/database.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generarAudioEspanol(text, wordId) {
  const audioDir = path.join(__dirname, '../../public/audio');
  
  if (!fs.existsSync(audioDir)) {
    fs.mkdirSync(audioDir, { recursive: true });
  }

  const filename = `es_${wordId.replace(/-/g, '_').substring(0, 20)}.mp3`;
  const outputPath = path.join(audioDir, filename);

  const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=es&client=tw-ob&q=${encodeURIComponent(text)}`;

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
        fs.unlinkSync(outputPath);
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
      if (fs.existsSync(outputPath)) {
        fs.unlinkSync(outputPath);
      }
      reject(err);
    });
  });
}

async function generarRestantes() {
  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('  🔊 GENERANDO AUDIOS RESTANTES');
  console.log('═══════════════════════════════════════════════════════════════\n');

  try {
    // Obtener palabras sin audio
    const result = await pool.query(`
      SELECT id, spanish_word
      FROM words
      WHERE audio_url IS NULL
      ORDER BY spanish_word
    `);

    console.log(`📚 Generando audios para ${result.rows.length} palabras restantes...\n`);
    console.log(`⏱️ Tiempo estimado: ~${Math.ceil(result.rows.length * 1.2 / 60)} minutos\n`);

    let generados = 0;
    let errores = 0;

    for (let i = 0; i < result.rows.length; i++) {
      const word = result.rows[i];
      
      try {
        const audioUrl = await generarAudioEspanol(word.spanish_word, word.id);

        await pool.query(
          'UPDATE words SET audio_url = $1 WHERE id = $2',
          [audioUrl, word.id]
        );

        console.log(`✅ [${(i + 1).toString().padStart(3, ' ')}/${result.rows.length}] ${word.spanish_word.padEnd(30)} → Audio generado`);
        generados++;

        if (i < result.rows.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }

      } catch (error) {
        console.log(`❌ [${(i + 1).toString().padStart(3, ' ')}/${result.rows.length}] ${word.spanish_word.padEnd(30)} → Error`);
        errores++;
        await new Promise(resolve => setTimeout(resolve, 2000));
      }

      // Cada 50 audios, mostrar progreso
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
        COUNT(audio_url) as con_audio
      FROM words
    `);

    console.log(`\n   📚 Total palabras: ${statsResult.rows[0].total}`);
    console.log(`   🔊 Con audio español: ${statsResult.rows[0].con_audio}`);
    console.log(`   📊 Porcentaje: ${Math.round(statsResult.rows[0].con_audio / statsResult.rows[0].total * 100)}%`);

    console.log('\n═══════════════════════════════════════════════════════════════\n');

    await pool.end();
    process.exit(0);

  } catch (error) {
    console.error('\n❌ Error:', error);
    await pool.end();
    process.exit(1);
  }
}

// Ejecutar
generarRestantes();

