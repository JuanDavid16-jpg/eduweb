"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class Exam extends Model {}
    Exam.init(
        {
            exam_id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            course_id: {
                type: DataTypes.UUID,
                allowNull: false,
            },
            exam_title: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            exam_description: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: "Exam",
            timestamps: false,
        }
    );
    return Exam;
};
