const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
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

    return Blog;
};
