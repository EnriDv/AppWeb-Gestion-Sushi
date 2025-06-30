const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const Order = sequelize.define("Order", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        total_amount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            validate: {
                min: 0,
            },
        },
        status: {
            type: DataTypes.STRING(50),
            allowNull: false,
            defaultValue: 'pending',
        },
    }, {
        tableName: 'orders',
        timestamps: true,
        createdAt: 'order_date',
        updatedAt: false,
    });

    return Order;
};
