import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

console.log('🔍 Probando conexión a PostgreSQL...');
console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Configurado ✅' : 'NO configurado ❌');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false,
});

async function testConnection() {
  try {
    const client = await pool.connect();
    console.log('✅ Conexión exitosa a PostgreSQL');
    
    const result = await client.query('SELECT NOW()');
    console.log('⏰ Hora del servidor:', result.rows[0].now);
    
    const dbCheck = await client.query('SELECT current_database()');
    console.log('📚 Base de datos actual:', dbCheck.rows[0].current_database);
    
    client.release();
    await pool.end();
    
    console.log('\n🎉 Todo funciona correctamente');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error de conexión:', error.message);
    console.error('\n💡 Verifica:');
    console.error('   1. PostgreSQL está corriendo');
    console.error('   2. DATABASE_URL en .env es correcto');
    console.error('   3. La base de datos existe');
    console.error('   4. Usuario y contraseña son correctos');
    process.exit(1);
  }
}

testConnection();

