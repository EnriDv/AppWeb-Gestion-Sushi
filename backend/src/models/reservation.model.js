const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
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
                min: 1,
            },
        },
        reservation_date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        reservation_time: {
            type: DataTypes.TIME,
            allowNull: false,
        },
    }, {
        tableName: 'reservations',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: false,
    });

    return Reservation;
};
