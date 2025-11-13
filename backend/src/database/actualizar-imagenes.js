import pool from '../config/database.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function actualizarImagenes() {
  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('  📸 ACTUALIZAR IMÁGENES EN LA BASE DE DATOS');
  console.log('═══════════════════════════════════════════════════════════════\n');

  const imagenesDir = path.join(__dirname, '../../public/images/palabras');
  
  // Crear directorio si no existe
  if (!fs.existsSync(imagenesDir)) {
    fs.mkdirSync(imagenesDir, { recursive: true });
    console.log(`📁 Carpeta creada: ${imagenesDir}\n`);
  }

  // Mapeo de archivos a palabras en español
  const mapeo = {
    'manzana.jpg': 'Manzana',
    'perro.jpg': 'Perro',
    'gallina.jpg': 'Gallina',
    'venado.jpg': 'Venado',
    'serpiente.jpg': 'Serpiente',
    'hormiga.jpg': 'Hormiga',
    'cucaracha.jpg': 'Cucaracha',
    'luciernaga.jpg': 'Luciérnaga',
    'rojo.jpg': 'Rojo',
    'tio.jpg': 'Tío',
    'sobrino.jpg': 'Sobrino',
    'companero.jpg': 'Compañero',
    'arcoiris.jpg': 'Arcoíris',
    'relampago.jpg': 'Relámpago',
    'laguna.jpg': 'Laguna',
    'arena.jpg': 'Arena',
    'valle.jpg': 'Valle',
    'camisa.jpg': 'Camisa',
    'catorce.jpg': 'Catorce',
    'ultimo.jpg': 'Último'
  };

  let actualizadas = 0;
  let faltantes = [];

  for (const [archivo, palabra] of Object.entries(mapeo)) {
    const imagePath = path.join(imagenesDir, archivo);
    
    if (fs.existsSync(imagePath)) {
      const imageUrl = `/images/palabras/${archivo}`;
      
      const result = await pool.query(
        'UPDATE words SET image_url = $1 WHERE spanish_word = $2',
        [imageUrl, palabra]
      );
      
      if (result.rowCount > 0) {
        console.log(`✅ ${palabra.padEnd(20)} → ${imageUrl}`);
        actualizadas++;
      } else {
        console.log(`⚠️ ${palabra.padEnd(20)} → Palabra no encontrada en BD`);
      }
    } else {
      console.log(`❌ ${palabra.padEnd(20)} → Falta imagen: ${archivo}`);
      faltantes.push(archivo);
    }
  }

  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log(`  📊 RESUMEN`);
  console.log('═══════════════════════════════════════════════════════════════\n');
  console.log(`   ✅ Imágenes actualizadas: ${actualizadas}`);
  console.log(`   ❌ Imágenes faltantes: ${faltantes.length}`);
  
  if (faltantes.length > 0) {
    console.log('\n   📋 Imágenes que faltan:');
    faltantes.forEach(f => console.log(`      • ${f}`));
  }
  
  console.log('\n═══════════════════════════════════════════════════════════════\n');
  
  process.exit(0);
}

actualizarImagenes().catch(error => {
  console.error('❌ Error:', error);
  process.exit(1);
});

