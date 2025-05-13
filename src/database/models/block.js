"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class Block extends Model {}
    Block.init(
        {
            block_id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            course_id: {
                type: DataTypes.UUID,
                allowNull: false,
            },
            block_title: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            block_description: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            block_order: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: "Block",
            timestamps: false,
        }
    );
    return Block;
};
