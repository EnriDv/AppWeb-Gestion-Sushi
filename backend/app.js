
require("dotenv").config(); // Carga las variables de entorno desde .env
const express = require("express"); // Framework web para Node.js
const { Sequelize, DataTypes, Op } = require("sequelize"); // ORM Sequelize y tipos de datos

const app = express(); // Inicializa la aplicación Express
const port = process.env.PORT || 3000; // Define el puerto del servidor
app.use(express.json()); // Habilita el middleware para parsear cuerpos de solicitud JSON

// --- Configuración de la conexión a la base de datos con Sequelize ---
// Utiliza la URL de la base de datos de Render (DB_URL)
const sequelize = new Sequelize(process.env.DB_URL, {
    dialect: "postgres", // Especifica el dialecto de la base de datos
    logging: false, // Deshabilita el logging de SQL en consola (opcional, útil para depurar)
    dialectOptions: {
        ssl: {
            require: true, // Requerir SSL para la conexión
            rejectUnauthorized: false, // No rechazar certificados autofirmados (común en Render u otros PaaS)
        },
    },
});


const User = sequelize.define("User", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    phone_number: {
        type: DataTypes.STRING(20),
        unique: true,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING(100),
        unique: true,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING(255), // En una aplicación real, almacena contraseñas hasheadas
        allowNull: false,
    },
    address: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    // 'created_at' será manejado automáticamente por Sequelize como 'createdAt'
}, {
    tableName: 'users', // Nombre real de la tabla en la base de datos
    timestamps: true, // Habilita createdAt y updatedAt
    createdAt: 'created_at', // Mapea 'createdAt' de Sequelize a 'created_at' de la DB
    updatedAt: false, // Deshabilita 'updatedAt' ya que no está en tu esquema SQL
});

// Modelo para la tabla 'dishes'
const Dish = sequelize.define("Dish", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING(100),
        unique: true,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            min: 0.01, // Validación para asegurar que el precio sea mayor que 0
        },
    },
    image_url: {
        type: DataTypes.STRING(255),
    },
    category: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
}, {
    tableName: 'dishes',
    timestamps: false, // No tiene 'created_at'/'updated_at' en tu esquema
});

// Modelo para la tabla 'reservations'
const Reservation = sequelize.define("Reservation", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    phone_number: {
        type: DataTypes.STRING(20),
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    number_of_guests: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1, // Validación para asegurar que el número de invitados sea mayor que 0
        },
    },
    reservation_date: {
        type: DataTypes.DATEONLY, // Usar DATEONLY para tipos DATE sin información de tiempo
        allowNull: false,
    },
    reservation_time: {
        type: DataTypes.TIME,
        allowNull: false,
    },
    // 'created_at' será manejado automáticamente por Sequelize como 'createdAt'
}, {
    tableName: 'reservations',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
});

// Modelo para la tabla 'blogs'
const Blog = sequelize.define("Blog", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    title: {
        type: DataTypes.STRING(255),
        unique: true,
        allowNull: false,
    },
    image_url: {
        type: DataTypes.STRING(255),
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    author: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    publication_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
}, {
    tableName: 'blogs',
    timestamps: false,
});

// Modelo para la tabla 'orders'
const Order = sequelize.define("Order", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        // No se define 'references' aquí, se hace en la asociación (belongsTo/hasMany)
    },
    total_amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            min: 0, // Validación para asegurar que la cantidad sea >= 0
        },
    },
    status: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: 'pending',
    },
    // 'order_date' será manejado automáticamente por Sequelize como 'createdAt'
}, {
    tableName: 'orders',
    timestamps: true,
    createdAt: 'order_date', // Mapea 'createdAt' de Sequelize a 'order_date' de la DB
    updatedAt: false,
});

// Modelo para la tabla 'order_items'
const OrderItem = sequelize.define("OrderItem", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    order_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    dish_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1, // Validación para asegurar que la cantidad sea mayor que 0
        },
    },
    unit_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            min: 0.01, // Validación para asegurar que el precio unitario sea mayor que 0
        },
    },
}, {
    tableName: 'order_items',
    timestamps: false,
});

// Modelo para la tabla de unión 'user_favorite_blogs'
// Esta tabla se gestiona mejor con una relación `belongsToMany`
const UserFavoriteBlog = sequelize.define("UserFavoriteBlog", {
    user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true, // Parte de la clave primaria compuesta
        allowNull: false,
    },
    blog_id: {
        type: DataTypes.INTEGER,
        primaryKey: true, // Parte de la clave primaria compuesta
        allowNull: false,
    },
    // 'favorited_at' será manejado automáticamente por Sequelize como 'createdAt'
}, {
    tableName: 'user_favorite_blogs',
    timestamps: true,
    createdAt: 'favorited_at',
    updatedAt: false,
    // Sequelize creará automáticamente un índice único para la clave primaria compuesta
});

// --- Definición de Asociaciones entre Modelos ---

// Usuario y Orden: Un usuario puede tener muchas órdenes, una orden pertenece a un usuario
User.hasMany(Order, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Order.belongsTo(User, { foreignKey: 'user_id' });

// Usuario y Blogs Favoritos (relación muchos a muchos a través de UserFavoriteBlog)
User.belongsToMany(Blog, {
    through: UserFavoriteBlog,
    foreignKey: 'user_id',
    as: 'favoriteBlogs', // Alias para acceder a los blogs favoritos de un usuario
    onDelete: 'CASCADE',
});
Blog.belongsToMany(User, {
    through: UserFavoriteBlog,
    foreignKey: 'blog_id',
    as: 'favoritedByUsers', // Alias para acceder a los usuarios que marcaron un blog como favorito
    onDelete: 'CASCADE',
});
// También definimos las relaciones directas para la tabla de unión si necesitas acceder a ella directamente
UserFavoriteBlog.belongsTo(User, { foreignKey: 'user_id' });
UserFavoriteBlog.belongsTo(Blog, { foreignKey: 'blog_id' });


// Orden y Ítems de la Orden: Una orden tiene muchos ítems, un ítem pertenece a una orden
Order.hasMany(OrderItem, { foreignKey: 'order_id', onDelete: 'CASCADE' });
OrderItem.belongsTo(Order, { foreignKey: 'order_id' });

// Plato y Ítems de la Orden: Un plato puede estar en muchos ítems de la orden, un ítem pertenece a un plato
Dish.hasMany(OrderItem, { foreignKey: 'dish_id', onDelete: 'RESTRICT' }); // onDelete: 'RESTRICT' según tu SQL
OrderItem.belongsTo(Dish, { foreignKey: 'dish_id' });


// --- Sincronización de la Base de Datos ---
// Esto creará o actualizará las tablas en tu base de datos según tus modelos.
// En desarrollo, 'force: true' es útil para recrear tablas (¡cuidado, borra datos!).
// Para producción, se recomiendan las migraciones de Sequelize.
sequelize
    .sync({ alter: true }) // 'alter: true' intenta hacer cambios no destructivos en la tabla existente
    .then(() => {
        console.log("Database connected and synchronized!");
    })
    .catch((err) => {
        console.error("Error connecting or synchronizing database:", err);
    });


// --- Rutas API (Endpoints) ---

// Ruta de prueba
app.get("/", (req, res) => {
    res.send("¡Hola desde el servidor QITCHEN! La API está funcionando.");
});

// --- Funciones CRUD Genéricas para Modelos ---
// Se pueden crear funciones auxiliares para reducir la repetición de código

/**
 * Función genérica para obtener todos los registros de un modelo.
 * @param {Object} model - El modelo Sequelize.
 */
const getAll = (model) => async (req, res) => {
    try {
        const records = await model.findAll();
        res.json(records);
    } catch (err) {
        console.error(`Error fetching all ${model.name}s:`, err);
        res.status(500).json({ error: "Internal server error" });
    }
};

/**
 * Función genérica para obtener un registro por ID.
 * @param {Object} model - El modelo Sequelize.
 */
const getById = (model) => async (req, res) => {
    try {
        const record = await model.findByPk(req.params.id);
        if (record) {
            res.json(record);
        } else {
            res.status(404).json({ error: `${model.name} not found` });
        }
    } catch (err) {
        console.error(`Error fetching ${model.name} by ID:`, err);
        res.status(500).json({ error: "Internal server error" });
    }
};

/**
 * Función genérica para crear un nuevo registro.
 * @param {Object} model - El modelo Sequelize.
 */
const createRecord = (model) => async (req, res) => {
    try {
        const newRecord = await model.create(req.body);
        res.status(201).json(newRecord); // 201 Created
    } catch (err) {
        console.error(`Error creating ${model.name}:`, err);
        // Envía un error 400 para errores de validación o datos inválidos
        res.status(400).json({ error: err.message });
    }
};

/**
 * Función genérica para actualizar un registro por ID.
 * @param {Object} model - El modelo Sequelize.
 */
const updateRecord = (model) => async (req, res) => {
    try {
        const [updatedRowsCount] = await model.update(req.body, {
            where: { id: req.params.id },
            returning: true, // Para PostgreSQL, devuelve los registros actualizados
        });
        if (updatedRowsCount > 0) {
            // Si returning: true, los registros actualizados están en el segundo elemento del array
            const updatedRecord = await model.findByPk(req.params.id); // Vuelve a buscarlo para consistencia
            res.json(updatedRecord);
        } else {
            res.status(404).json({ error: `${model.name} not found or no changes made` });
        }
    } catch (err) {
        console.error(`Error updating ${model.name}:`, err);
        res.status(400).json({ error: err.message });
    }
};

/**
 * Función genérica para eliminar un registro por ID.
 * @param {Object} model - El modelo Sequelize.
 */
const deleteRecord = (model) => async (req, res) => {
    try {
        const deletedRowsCount = await model.destroy({
            where: { id: req.params.id },
        });
        if (deletedRowsCount > 0) {
            res.status(204).send(); // 204 No Content
        } else {
            res.status(404).json({ error: `${model.name} not found` });
        }
    } catch (err) {
        console.error(`Error deleting ${model.name}:`, err);
        res.status(500).json({ error: "Internal server error" });
    }
};


// --- Endpoints para Usuarios (Users) ---
app.get("/api/users", getAll(User));
app.get("/api/users/:id", getById(User));
app.post("/api/users", createRecord(User));
app.put("/api/users/:id", updateRecord(User));
app.delete("/api/users/:id", deleteRecord(User));

// --- Endpoints para Platos (Dishes) ---
app.get("/api/dishes", getAll(Dish));
app.get("/api/dishes/:id", getById(Dish));
app.post("/api/dishes", createRecord(Dish));
app.put("/api/dishes/:id", updateRecord(Dish));
app.delete("/api/dishes/:id", deleteRecord(Dish));

// --- Endpoints para Reservaciones (Reservations) ---
app.get("/api/reservations", getAll(Reservation));
app.get("/api/reservations/:id", getById(Reservation));
app.post("/api/reservations", createRecord(Reservation));
app.put("/api/reservations/:id", updateRecord(Reservation));
app.delete("/api/reservations/:id", deleteRecord(Reservation));

// --- Endpoints para Blogs ---
app.get("/api/blogs", getAll(Blog));
app.get("/api/blogs/:id", getById(Blog));
app.post("/api/blogs", createRecord(Blog));
app.put("/api/blogs/:id", updateRecord(Blog));
app.delete("/api/blogs/:id", deleteRecord(Blog));

// --- Endpoints para Órdenes (Orders) ---
app.get("/api/orders", getAll(Order));
app.get("/api/orders/:id", getById(Order)); // Opcional: incluir order_items en la respuesta con 'include'
app.post("/api/orders", createRecord(Order));
app.put("/api/orders/:id", updateRecord(Order));
app.delete("/api/orders/:id", deleteRecord(Order));

// --- Endpoints para Ítems de la Orden (OrderItems) ---
// Normalmente, los OrderItems se manejan a través de la relación con Orders
app.get("/api/order_items", getAll(OrderItem)); // Obtener todos los ítems de todas las órdenes
app.get("/api/order_items/:id", getById(OrderItem)); // Obtener un ítem de orden específico
app.post("/api/order_items", createRecord(OrderItem)); // Añadir un ítem de orden individual
app.put("/api/order_items/:id", updateRecord(OrderItem));
app.delete("/api/order_items/:id", deleteRecord(OrderItem));

// Adicional: Obtener ítems para una orden específica
app.get("/api/orders/:orderId/items", async (req, res) => {
    try {
        const orderItems = await OrderItem.findAll({
            where: { order_id: req.params.orderId },
            include: [{ model: Dish }] // Incluye la información del plato asociado
        });
        res.json(orderItems);
    } catch (err) {
        console.error("Error fetching order items for order:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.post("/api/users/:userId/favorite-blogs/:blogId", async (req, res) => {
    try {
        const { userId, blogId } = req.params;
        const user = await User.findByPk(userId);
        const blog = await Blog.findByPk(blogId);

        if (!user || !blog) {
            return res.status(404).json({ error: "User or Blog not found" });
        }

        // Usa el método add<AssociationName> de Sequelize
        await user.addFavoriteBlog(blog); // addFavoriteBlog es generado por belongsToMany(Blog, {as: 'favoriteBlogs'})
        res.status(201).json({ message: "Blog added to favorites" });
    } catch (err) {
        console.error("Error adding blog to favorites:", err);
        res.status(400).json({ error: err.message });
    }
});

// Obtener todos los blogs favoritos de un usuario
app.get("/api/users/:userId/favorite-blogs", async (req, res) => {
    try {
        const user = await User.findByPk(req.params.userId, {
            include: [{
                model: Blog,
                as: 'favoriteBlogs',
                through: { attributes: ['favorited_at'] } // Incluye el timestamp de la tabla de unión
            }]
        });
        if (user) {
            res.json(user.favoriteBlogs);
        } else {
            res.status(404).json({ error: "User not found" });
        }
    } catch (err) {
        console.error("Error fetching user's favorite blogs:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Eliminar un blog de favoritos
app.delete("/api/users/:userId/favorite-blogs/:blogId", async (req, res) => {
    try {
        const { userId, blogId } = req.params;
        const user = await User.findByPk(userId);
        const blog = await Blog.findByPk(blogId);

        if (!user || !blog) {
            return res.status(404).json({ error: "User or Blog not found" });
        }

        // Usa el método remove<AssociationName> de Sequelize
        await user.removeFavoriteBlog(blog);
        res.status(204).send(); // No Content
    } catch (err) {
        console.error("Error removing blog from favorites:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

// --- Inicio del Servidor ---
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});