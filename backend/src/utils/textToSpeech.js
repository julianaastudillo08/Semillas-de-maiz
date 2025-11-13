import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Genera audio usando Google Text-to-Speech (gratuito)
 * @param {string} text - Texto a convertir en audio
 * @param {string} lang - Idioma (es-ES para español)
 * @param {string} filename - Nombre del archivo de salida
 * @returns {Promise<string>} - Ruta del archivo generado
 */
export async function generateSpeech(text, lang = 'es-ES', filename) {
  return new Promise((resolve, reject) => {
    const audioDir = path.join(__dirname, '../../public/audio');
    
    // Crear directorio si no existe
    if (!fs.existsSync(audioDir)) {
      fs.mkdirSync(audioDir, { recursive: true });
    }

    const outputPath = path.join(audioDir, filename);

    // Usar la API gratuita de Google Translate TTS
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${lang}&client=tw-ob&q=${encodeURIComponent(text)}`;

    const file = fs.createWriteStream(outputPath);

    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://translate.google.com/'
      }
    }, (response) => {
      response.pipe(file);

      file.on('finish', () => {
        file.close();
        resolve(`/audio/${filename}`);
      });
    }).on('error', (err) => {
      fs.unlinkSync(outputPath);
      reject(err);
    });
  });
}

/**
 * Genera audios para una palabra completa
 * @param {Object} word - Objeto con spanish_word y nasa_yuwe_word
 * @returns {Promise<Object>} - URLs de los audios generados
 */
export async function generateWordAudios(word) {
  try {
    const audioSpanish = await generateSpeech(
      word.spanish_word,
      'es-ES',
      `es_${word.id}.mp3`
    );

    // Para Nasa Yuwe, por ahora retornamos null hasta que se suban manualmente
    const audioNasaYuwe = null;

    return {
      audio_spanish: audioSpanish,
      audio_nasa_yuwe: audioNasaYuwe
    };
  } catch (error) {
    console.error('Error generando audios:', error);
    return {
      audio_spanish: null,
      audio_nasa_yuwe: null
    };
  }
}

/**
 * Genera audios para múltiples palabras
 * @param {Array} words - Array de palabras
 * @returns {Promise<void>}
 */
export async function generateBulkAudios(words, onProgress) {
  const results = [];

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    
    try {
      const audios = await generateWordAudios(word);
      results.push({ word: word.spanish_word, success: true, audios });
      
      if (onProgress) {
        onProgress(i + 1, words.length, word.spanish_word);
      }

      // Esperar 500ms entre cada llamada para no saturar el servicio
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      results.push({ word: word.spanish_word, success: false, error: error.message });
    }
  }

  return results;
}

