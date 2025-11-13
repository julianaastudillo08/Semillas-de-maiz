import pool from '../config/database.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function encontrarFaltantes() {
  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('  🔍 ENCONTRANDO IMÁGENES SIN PALABRA EN LA BD');
  console.log('═══════════════════════════════════════════════════════════════\n');

  try {
    const imagenesDir = path.join(__dirname, '../../public/images');
    
    // 1. Obtener todas las imágenes
    const archivos = fs.readdirSync(imagenesDir);
    const imagenes = archivos.filter(f => f.match(/\.(png|jpg|jpeg|JPG)$/i));
    
    console.log(`📸 Total imágenes en carpeta: ${imagenes.length}\n`);

    // 2. Obtener todas las image_url de la BD
    const result = await pool.query('SELECT image_url FROM words WHERE image_url IS NOT NULL');
    const imagenesEnBD = new Set(result.rows.map(row => row.image_url.replace('/images/', '')));

    console.log(`📚 Total image_url en BD: ${imagenesEnBD.size}\n`);

    // 3. Encontrar imágenes que NO están en la BD
    const faltantes = imagenes.filter(img => !imagenesEnBD.has(img));

    console.log(`⚠️ Imágenes sin palabra en BD: ${faltantes.length}\n`);

    if (faltantes.length > 0) {
      console.log('📋 Lista de imágenes faltantes:\n');
      faltantes.forEach((img, index) => {
        console.log(`   ${(index + 1).toString().padStart(2, ' ')}. ${img}`);
      });
    }

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
encontrarFaltantes();

