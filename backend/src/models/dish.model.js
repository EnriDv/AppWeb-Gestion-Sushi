const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
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
                min: 0.01,
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
        timestamps: false,
    });

    return Dish;
};
