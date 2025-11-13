import pool from '../config/database.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function ejecutarSQL() {
  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('  🔐 IMPLEMENTANDO SISTEMA DE APROBACIÓN DE USUARIOS');
  console.log('═══════════════════════════════════════════════════════════════\n');

  try {
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      console.log('📝 Agregando columnas...\n');

      // Agregar columnas
      await client.query(`
        ALTER TABLE users 
        ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT false
      `);
      console.log('   ✅ Columna is_approved agregada');

      await client.query(`
        ALTER TABLE users 
        ADD COLUMN IF NOT EXISTS approved_by UUID REFERENCES users(id) ON DELETE SET NULL
      `);
      console.log('   ✅ Columna approved_by agregada');

      await client.query(`
        ALTER TABLE users 
        ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP
      `);
      console.log('   ✅ Columna approved_at agregada');

      await client.query(`
        ALTER TABLE users 
        ADD COLUMN IF NOT EXISTS rejection_reason TEXT
      `);
      console.log('   ✅ Columna rejection_reason agregada\n');

      // Aprobar usuarios existentes (solo el administrador principal)
      console.log('📝 Aprobando usuarios existentes...\n');

      const approved = await client.query(`
        UPDATE users 
        SET is_approved = true, 
            approved_at = CURRENT_TIMESTAMP
        WHERE email = 'admin@semillasmaiz.edu.co'
      `);

      console.log(`   ✅ Administrador principal aprobado automáticamente\n`);

      // Marcar otros usuarios como pendientes
      const pending = await client.query(`
        UPDATE users 
        SET is_approved = false
        WHERE email != 'admin@semillasmaiz.edu.co' AND is_approved IS NULL
      `);

      console.log(`   ⏳ ${pending.rowCount} usuarios marcados como pendientes de aprobación\n`);

      // Crear índice
      await client.query(`
        CREATE INDEX IF NOT EXISTS idx_users_is_approved ON users(is_approved)
      `);
      console.log('   ✅ Índice creado\n');

      // Crear vista (TODOS los roles pendientes)
      await client.query(`
        CREATE OR REPLACE VIEW pending_users AS
        SELECT 
            u.id,
            u.full_name,
            u.email,
            u.role,
            u.created_at,
            u.is_active,
            u.email_verified
        FROM users u
        WHERE u.is_approved = false
        ORDER BY u.created_at DESC
      `);
      console.log('   ✅ Vista pending_users creada (incluye TODOS los roles)\n');

      await client.query('COMMIT');

      // Estadísticas por rol
      const stats = await client.query(`
        SELECT 
          role,
          COUNT(*) as total,
          COUNT(CASE WHEN is_approved = true THEN 1 END) as aprobados,
          COUNT(CASE WHEN is_approved = false THEN 1 END) as pendientes
        FROM users
        GROUP BY role
        ORDER BY role
      `);

      console.log('═══════════════════════════════════════════════════════════════');
      console.log('  📊 ESTADÍSTICAS POR ROL');
      console.log('═══════════════════════════════════════════════════════════════\n');
      
      stats.rows.forEach(row => {
        console.log(`   ${row.role.toUpperCase()}:`);
        console.log(`      Total: ${row.total}`);
        console.log(`      ✅ Aprobados: ${row.aprobados}`);
        console.log(`      ⏳ Pendientes: ${row.pendientes}\n`);
      });

      console.log('\n═══════════════════════════════════════════════════════════════');
      console.log('  ✅ SISTEMA DE APROBACIÓN IMPLEMENTADO');
      console.log('═══════════════════════════════════════════════════════════════\n');

      console.log('  📋 Nuevas funcionalidades:\n');
      console.log('     • Usuarios nuevos quedan pendientes de aprobación');
      console.log('     • Docentes/Admins pueden aprobar o rechazar');
      console.log('     • Se registra quién aprobó y cuándo');
      console.log('     • Se puede dar razón de rechazo\n');

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }

    await pool.end();
    process.exit(0);

  } catch (error) {
    console.error('\n❌ Error:', error);
    await pool.end();
    process.exit(1);
  }
}

ejecutarSQL();

