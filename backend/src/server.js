require('dotenv').config();
const express = require("express");
const cors = require("cors");
const path = require("path");

// Importar enrutadores
const dishRouter = require('./routes/dish.router');
const blogRouter = require('./routes/blog.router');
const reservationRouter = require('./routes/reservation.router');
const userRouter = require('./routes/user.router');
const orderRouter = require('./routes/order.router');
const authRouter = require('./routes/auth.router');

const app = express();

// Configuración de CORS
const allowedOrigins = [
    'http://127.0.0.1:5500',
    'http://localhost:5500',
    'http://127.0.0.1:8000',
    'http://localhost:8000',
    'http://127.0.0.1:3000',
    'http://localhost:3000'
];

app.use(cors({
    origin: function (origin, callback) {
        // Permitir solicitudes sin 'origin' (como aplicaciones móviles o curl)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'El origen de la petición no está permitido por CORS';
            console.warn(`Origen no permitido: ${origin}`);
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-Requested-With',
        'Accept',
        'Origin'
    ]
}));

// Manejar solicitudes preflight
app.options('*', cors());

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', '..', 'frontend')));

app.use('/api/dishes', dishRouter);
app.use('/api/blogs', blogRouter);
app.use('/api/reservations', reservationRouter);
app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/orders', orderRouter);

app.get("/api", (req, res) => {
    res.send("¡Hola desde el servidor QITCHEN refactorizado! La API está funcionando.");
});

module.exports = app;
