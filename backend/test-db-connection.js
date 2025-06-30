require('dotenv').config();
const { Client } = require('pg');

console.log('--- Direct Database Connection Test ---');

if (!process.env.DB_URL) {
    console.error('❌ ERROR: La variable DB_URL no se encontró en el archivo .env.');
    process.exit(1);
}

console.log('Variable DB_URL encontrada. Intentando conectar...');

const client = new Client({
    connectionString: process.env.DB_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

async function testConnection() {
    try {
        await client.connect();
        console.log('✅ ¡CONEXIÓN EXITOSA! Se ha conectado a la base de datos directamente con `pg`.');
        
        const res = await client.query('SELECT NOW()');
        console.log('✅ Consulta de prueba exitosa. Hora del servidor de la BD:', res.rows[0].now);
        
        await client.end();
        console.log('✅ Conexión cerrada correctamente.');

    } catch (err) {
        console.error('❌ ERROR DE CONEXIÓN: No se pudo conectar usando `pg`.');
        console.error('--- Detalles del Error ---');
        console.error(err);
        console.error('--------------------------');
        process.exit(1);
    }
}

testConnection();
