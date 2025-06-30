require("dotenv").config();
const { Sequelize } = require("sequelize");

// --- Configuración de la conexión a la base de datos con Sequelize ---
const dbName = process.env.DB_NAME;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbHost = process.env.DB_HOST;
const dbPort = process.env.DB_PORT;

const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
    host: dbHost,
    port: dbPort,
    dialect: "postgres",
    logging: false,
    dialectOptions: {
        // Activar SSL si NODE_ENV es 'production' (para Render)
        ssl: process.env.NODE_ENV === 'production' 
            ? { require: true, rejectUnauthorized: false } 
            : false
    },
});

module.exports = sequelize;
