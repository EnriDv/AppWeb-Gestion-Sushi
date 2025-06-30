require('dotenv').config();
const app = require('./server');
const db = require('./models');

console.log('Starting application...');
const port = process.env.PORT || 3000;
console.log(`Attempting to use port: ${port}`);

const connectAndStartServer = async () => {
    try {
        console.log('Attempting to authenticate with the database...');
        await db.sequelize.authenticate();
        console.log('✅ Database authentication successful!');

        console.log('Attempting to synchronize database schema...');
        await db.sequelize.sync({ alter: true });
        console.log('✅ Database schema synchronized!');

        app.listen(port, () => {
            console.log(`🚀 Server is running on http://localhost:${port}`);
        });
    } catch (error) {
        console.error('❌ Unable to connect to the database:');
        console.error(error);
        process.exit(1); 
    }
};

connectAndStartServer();
