"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class Answer extends Model {}
    Answer.init(
        {
            answer_id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            question_id: {
                type: DataTypes.UUID,
                allowNull: false,
            },
            answer_text: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            is_correct: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: "Answer",
            timestamps: false,
        }
    );
    return Answer;
};
