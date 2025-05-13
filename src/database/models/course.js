"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class Course extends Model {}
    Course.init(
        {
            course_id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            teacher_id: {
                type: DataTypes.UUID,
                allowNull: false,
            },
            course_name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            course_description: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            course_image: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            course_difficulty: {
                type: DataTypes.ENUM("básico", "intermedio", "avanzado"),
                defaultValue: "básico",
                allowNull: false,
            },
            category_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: "Course",
            timestamps: true,
        }
    );
    return Course;
};
