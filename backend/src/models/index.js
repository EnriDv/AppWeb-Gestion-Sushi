const sequelize = require('../config/database');

const db = {};

db.Sequelize = require('sequelize');
db.sequelize = sequelize;

// Cargar modelos
db.User = require('./user.model.js')(sequelize);
db.Dish = require('./dish.model.js')(sequelize);
db.Reservation = require('./reservation.model.js')(sequelize);
db.Blog = require('./blog.model.js')(sequelize);
db.Order = require('./order.model.js')(sequelize);
db.OrderItem = require('./orderItem.model.js')(sequelize);
db.UserFavoriteBlog = require('./userFavoriteBlog.model.js')(sequelize);

// --- Definición de Asociaciones entre Modelos ---

// Usuario y Orden
db.User.hasMany(db.Order, { foreignKey: 'user_id', onDelete: 'CASCADE' });
db.Order.belongsTo(db.User, { foreignKey: 'user_id' });

// Usuario y Blogs Favoritos (Muchos a Muchos)
db.User.belongsToMany(db.Blog, {
    through: db.UserFavoriteBlog,
    foreignKey: 'user_id',
    as: 'favoriteBlogs',
    onDelete: 'CASCADE',
});
db.Blog.belongsToMany(db.User, {
    through: db.UserFavoriteBlog,
    foreignKey: 'blog_id',
    as: 'favoritedByUsers',
    onDelete: 'CASCADE',
});

// Orden y Ítems de la Orden
db.Order.hasMany(db.OrderItem, { foreignKey: 'order_id', onDelete: 'CASCADE' });
db.OrderItem.belongsTo(db.Order, { foreignKey: 'order_id' });

// Plato y Ítems de la Orden
db.Dish.hasMany(db.OrderItem, { foreignKey: 'dish_id', onDelete: 'RESTRICT' });
db.OrderItem.belongsTo(db.Dish, { foreignKey: 'dish_id' });

module.exports = db;
