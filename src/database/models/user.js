"use strict";
const { Model } = require("sequelize");
const bcrypt = require("bcrypt");

module.exports = (sequelize, DataTypes) => {
    class User extends Model {}

    User.init(
        {
            user_id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            user_name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            user_lastname: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            user_profession: {
                type: DataTypes.STRING,
                allowNull: true
            },
            user_website: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            user_email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            user_phone: {
                type: DataTypes.DECIMAL,
                allowNull: true,
            },
            user_password: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            user_image: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            role_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: "User",
            timestamps: true,
        }
    );

    User.beforeCreate((user, options) => {
        user.user_password = bcrypt.hashSync(user.user_password, 10);
        return user;
    });

    User.beforeUpdate((user, options) => {
        user.user_password = bcrypt.hashSync(user.user_password, 10);
        return user;
    });

    return User;
};
