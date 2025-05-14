"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class Question extends Model {}
    Question.init(
        {
            question_id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            exam_id: {
                type: DataTypes.UUID,
                allowNull: false,
            },
            question_text: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: "Question",
            timestamps: false,
        }
    );
    return Question;
};
