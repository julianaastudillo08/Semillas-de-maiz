import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from '../config/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Ejecuta las migraciones de la base de datos
 */
const migrate = async () => {
  try {
    console.log('🚀 Iniciando migraciones...');

    // Leer el archivo schema.sql
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    // Ejecutar el schema
    await pool.query(schema);

    console.log('✅ Migraciones completadas exitosamente');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error en migraciones:', error);
    process.exit(1);
  }
};

// Ejecutar migraciones
migrate();

