const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const UserFavoriteBlog = sequelize.define("UserFavoriteBlog", {
        user_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
        },
        blog_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
        },
    }, {
        tableName: 'user_favorite_blogs',
        timestamps: true,
        createdAt: 'favorited_at',
        updatedAt: false,
    });

    return UserFavoriteBlog;
};
