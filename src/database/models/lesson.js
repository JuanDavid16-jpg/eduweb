"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class Lesson extends Model {}
    Lesson.init(
        {
            lesson_id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            block_id: {
                type: DataTypes.UUID,
                allowNull: false,
            },
            lesson_title: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            lesson_video: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            lesson_description: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            lesson_duration: {
                type: DataTypes.TIME,
                defaultValue: "00:00:00",
                allowNull: false,
            },
            lesson_image: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            lesson_order: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: "Lesson",
            timestamps: false,
        }
    );
    return Lesson;
};
